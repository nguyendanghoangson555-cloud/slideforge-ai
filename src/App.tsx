import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileCode2,
  Maximize2,
  Printer,
  X,
} from 'lucide-react';
import { OutlineView } from './components/OutlineView';
import { PresentationModal } from './components/PresentationModal';
import { PromptPanel } from './components/PromptPanel';
import { SlideCanvas } from './components/SlideCanvas';
import { SlideEditorPanel } from './components/SlideEditorPanel';
import { TopBar, type WorkspaceSection } from './components/TopBar';
import type {
  PresentationDeck,
  PromptConfig,
  SamplePrompt,
  SlideItem,
} from './types/slides';
import { exportDeckToPptx } from './utils/exportPptx';
import {
  COST_GENERATE_DECK,
  COST_REGENERATE_SLIDE,
  DAILY_AI_QUOTA_MAX,
  type QuotaState,
  canSpendQuota,
  loadQuotaState,
  spendQuota,
} from './utils/quotaLogic';
import {
  INITIAL_DEMO_DECK,
  SLIDE_THEMES,
  buildPrintableHtml,
  deleteSlideFromDeck,
  formatCleanOutlineMarkdown,
  formatCleanOutlineText,
  insertBlankSlide,
  moveSlideInDeck,
  normalizeDeckResponse,
  normalizeSingleSlide,
  updateSlideInDeck,
  validatePromptConfig,
} from './utils/slideLogic';

function formatApiErrorMessage(rawMessage: string): string {
  const lower = rawMessage.toLowerCase();
  if (lower.includes('429') || lower.includes('resource_exhausted') || lower.includes('quota')) {
    return 'Hệ thống AI đang tạm thời chạm giới hạn lượt gọi. Danh sách slide hiện tại vẫn được giữ nguyên để bạn chỉnh sửa thủ công, sao chép dàn ý hoặc xuất PPTX bình thường.';
  }
  return rawMessage;
}

export default function App() {
  const [deck, setDeck] = useState<PresentationDeck>(INITIAL_DEMO_DECK);
  const [promptConfig, setPromptConfig] = useState<PromptConfig>({
    topic: INITIAL_DEMO_DECK.topic,
    audience: INITIAL_DEMO_DECK.audience,
    slideCount: INITIAL_DEMO_DECK.slides.length,
    style: INITIAL_DEMO_DECK.style,
    language: INITIAL_DEMO_DECK.language,
  });

  const [quota, setQuota] = useState<QuotaState>(() =>
    loadQuotaState(typeof window !== 'undefined' ? window.localStorage : null)
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSection, setActiveSection] = useState<WorkspaceSection>('editor');
  const [isPresenting, setIsPresenting] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [isExportingPptx, setIsExportingPptx] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const currentSlide = deck.slides[activeIndex] ?? deck.slides[0];

  // Auto-sync daily reset when returning to tab or crossing midnight
  useEffect(() => {
    const syncQuota = () => {
      setQuota(loadQuotaState(window.localStorage));
    };
    window.addEventListener('focus', syncQuota);
    const interval = window.setInterval(syncQuota, 60_000);
    return () => {
      window.removeEventListener('focus', syncQuota);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!statusMessage) return;
    const timer = window.setTimeout(() => setStatusMessage(null), 5000);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  const handlePromptChange = (next: PromptConfig) => {
    setPromptConfig(next);
    setErrorMessage(null);
    if (next.style !== deck.style) {
      setDeck((prev) => ({ ...prev, style: next.style }));
    }
  };

  const handleApplySample = (sample: SamplePrompt) => {
    setErrorMessage(null);
    setPromptConfig({
      topic: sample.topic,
      audience: sample.audience,
      slideCount: sample.slideCount,
      style: sample.style,
      language: sample.language,
    });
    setDeck((prev) => ({ ...prev, style: sample.style }));
    setStatusMessage(`Đã điền chủ đề mẫu "${sample.label}". Nhấn "Tạo bài trình chiếu" để AI dựng slide.`);
  };

  const handleGenerateDeck = async () => {
    const freshQuota = loadQuotaState(window.localStorage);
    setQuota(freshQuota);

    const quotaCheck = canSpendQuota(freshQuota, COST_GENERATE_DECK);
    if (!quotaCheck.ok) {
      setErrorMessage(quotaCheck.error ?? 'Bạn đã hết điểm AI hôm nay.');
      return;
    }

    const validation = validatePromptConfig(promptConfig);
    if (!validation.valid) {
      setErrorMessage(validation.error ?? 'Vui lòng kiểm tra lại thông tin đầu vào.');
      return;
    }

    setErrorMessage(null);
    setStatusMessage(null);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/slides/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.normalized),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Không thể tạo bài trình chiếu từ AI.');
      }

      const nextDeck = normalizeDeckResponse(payload, validation.normalized);
      if (nextDeck.slides.length === 0) {
        throw new Error('AI chưa trả về slide hợp lệ. Vui lòng thử lại.');
      }

      const updatedQuota = spendQuota(freshQuota, COST_GENERATE_DECK, window.localStorage);
      setQuota(updatedQuota);
      setDeck(nextDeck);
      setActiveIndex(0);
      setActiveSection('editor');
      setStatusMessage(
        `Đã tạo hoàn chỉnh ${nextDeck.slides.length} slide theo phong cách ${SLIDE_THEMES[nextDeck.style].name} (còn ${updatedQuota.remaining}/${DAILY_AI_QUOTA_MAX} điểm hôm nay).`
      );
    } catch (err) {
      const rawMsg = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tạo bài trình chiếu.';
      setErrorMessage(formatApiErrorMessage(rawMsg));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateSlide = async (targetIndex: number, instruction?: string) => {
    const targetSlide = deck.slides[targetIndex];
    if (!targetSlide) return;

    const freshQuota = loadQuotaState(window.localStorage);
    setQuota(freshQuota);

    const quotaCheck = canSpendQuota(freshQuota, COST_REGENERATE_SLIDE);
    if (!quotaCheck.ok) {
      setErrorMessage(quotaCheck.error ?? 'Bạn đã hết điểm AI hôm nay.');
      return;
    }

    setErrorMessage(null);
    setRegeneratingIndex(targetIndex);

    try {
      const response = await fetch('/api/slides/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deckTitle: deck.deckTitle,
          topic: deck.topic,
          audience: deck.audience,
          style: deck.style,
          language: deck.language,
          slideIndex: targetIndex,
          totalSlides: deck.slides.length,
          currentSlide: targetSlide,
          instruction,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Không thể tạo lại slide này.');
      }

      const normalized = normalizeSingleSlide(payload, targetIndex, targetSlide.id);
      const updatedQuota = spendQuota(freshQuota, COST_REGENERATE_SLIDE, window.localStorage);
      setQuota(updatedQuota);
      setDeck((prev) => updateSlideInDeck(prev, targetSlide.id, normalized));
      setStatusMessage(
        `Đã tạo lại nội dung cho Slide ${targetIndex + 1} (còn ${updatedQuota.remaining}/${DAILY_AI_QUOTA_MAX} điểm hôm nay).`
      );
    } catch (err) {
      const rawMsg = err instanceof Error ? err.message : 'Lỗi khi tạo lại slide.';
      setErrorMessage(formatApiErrorMessage(rawMsg));
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const handleUpdateCurrentSlide = (patch: Partial<SlideItem>) => {
    if (!currentSlide) return;
    setDeck((prev) => updateSlideInDeck(prev, currentSlide.id, patch));
  };

  const handleAddSlide = () => {
    const result = insertBlankSlide(deck, activeIndex);
    setDeck(result.deck);
    setActiveIndex(result.newIndex);
    setStatusMessage(`Đã thêm slide mới tại vị trí ${result.newIndex + 1}.`);
  };

  const handleDeleteCurrentSlide = () => {
    if (!currentSlide || deck.slides.length <= 1) return;
    const nextDeck = deleteSlideFromDeck(deck, currentSlide.id);
    setDeck(nextDeck);
    setActiveIndex((prev) => Math.min(prev, nextDeck.slides.length - 1));
    setStatusMessage('Đã xóa slide khỏi bài trình chiếu.');
  };

  const handleMoveCurrentSlide = (direction: -1 | 1) => {
    const result = moveSlideInDeck(deck, activeIndex, direction);
    setDeck(result.deck);
    setActiveIndex(result.nextIndex);
  };

  const handleExportPptx = useCallback(async () => {
    setIsExportingPptx(true);
    setErrorMessage(null);
    try {
      const fileName = await exportDeckToPptx(deck);
      setStatusMessage(`Đã xuất file PowerPoint (${fileName}) thành công!`);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Không thể xuất file .pptx.'
      );
    } finally {
      setIsExportingPptx(false);
    }
  }, [deck]);

  const handleExportHtml = () => {
    const html = buildPrintableHtml(deck);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'slideforge-presentation.html';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatusMessage('Đã tải xuống bản trình chiếu HTML kèm ghi chú thuyết trình!');
  };

  const handleCopyCleanOutline = async () => {
    const cleanText = formatCleanOutlineText(deck);
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(cleanText);
      } else {
        throw new Error('Clipboard API unavailable');
      }
      setStatusMessage('Đã sao chép dàn ý sạch');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = cleanText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      setStatusMessage('Đã sao chép dàn ý sạch');
    }
  };

  const triggerTextDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadOutlineTxt = () => {
    const text = formatCleanOutlineText(deck);
    triggerTextDownload(text, 'slideforge-dan-y-sach.txt', 'text/plain');
    setStatusMessage('Đã tải xuống dàn ý sạch (.txt)!');
  };

  const handleDownloadOutlineMd = () => {
    const md = formatCleanOutlineMarkdown(deck);
    triggerTextDownload(md, 'slideforge-dan-y-sach.md', 'text/markdown');
    setStatusMessage('Đã tải xuống dàn ý sạch (.md)!');
  };

  const handlePrintPdf = () => {
    setStatusMessage('Đang mở hộp thoại in / lưu PDF gọn gàng...');
    window.setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleSelectSection = (section: WorkspaceSection) => {
    if (section === 'present') {
      setIsPresenting(true);
      return;
    }
    setActiveSection(section);
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onExportPptx={handleExportPptx}
        isExporting={isExportingPptx}
        quotaRemaining={quota.remaining}
        quotaMax={DAILY_AI_QUOTA_MAX}
      />

      {/* Mobile section switcher */}
      <div className="no-print flex md:hidden items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-2">
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveSection('editor')}
            className={`min-h-[36px] rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap ${
              activeSection === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Xem trước
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('outline')}
            className={`min-h-[36px] rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap ${
              activeSection === 'outline' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Dàn ý
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsPresenting(true)}
          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-800 whitespace-nowrap"
        >
          <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Trình chiếu</span>
        </button>
      </div>

      {/* Status Banner */}
      {statusMessage && (
        <div
          role="status"
          aria-live="polite"
          data-testid="status-banner"
          className="no-print border-b border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-900"
        >
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <span className="font-medium">{statusMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              aria-label="Đóng thông báo"
              className="rounded p-1 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Main 2-column Studio Workspace */}
      <div className="no-print mx-auto flex w-full max-w-[1440px] flex-1 flex-col lg:flex-row">
        <PromptPanel
          config={promptConfig}
          onChange={handlePromptChange}
          onSubmit={handleGenerateDeck}
          onApplySample={handleApplySample}
          isGenerating={isGenerating}
          errorMessage={errorMessage}
          quotaRemaining={quota.remaining}
          quotaCost={COST_GENERATE_DECK}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
          {errorMessage && activeSection === 'outline' && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {errorMessage}
            </div>
          )}

          {activeSection === 'outline' ? (
            <OutlineView
              deck={deck}
              activeIndex={activeIndex}
              regeneratingIndex={regeneratingIndex}
              onSelectSlideForEdit={(idx) => {
                setActiveIndex(idx);
                setActiveSection('editor');
              }}
              onRegenerateSlide={(idx) => handleRegenerateSlide(idx)}
              onCopyCleanOutline={handleCopyCleanOutline}
              onDownloadOutlineTxt={handleDownloadOutlineTxt}
              onDownloadOutlineMd={handleDownloadOutlineMd}
            />
          ) : (
            <>
              {/* Stage Toolbar */}
              <div className="flex flex-wrap xl:flex-nowrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{SLIDE_THEMES[deck.style].name}</span>
                    <span aria-hidden="true">·</span>
                    <span>{deck.language === 'en' ? 'English' : 'Tiếng Việt'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-tabular">{deck.slides.length} slide</span>
                  </div>
                  <h2 className="mt-0.5 truncate text-lg font-bold text-slate-900">
                    {deck.deckTitle}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyCleanOutline}
                    className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                  >
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copy dàn ý cho Canva</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportHtml}
                    className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                  >
                    <FileCode2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Xuất HTML</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintPdf}
                    className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                  >
                    <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>In / Lưu PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPresenting(true)}
                    className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 whitespace-nowrap"
                  >
                    <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Trình chiếu</span>
                  </button>
                </div>
              </div>

              {/* Central 16:9 Slide Preview Stage */}
              <div className="space-y-4">
                <SlideCanvas
                  slide={currentSlide}
                  deckTitle={deck.deckTitle}
                  slideIndex={activeIndex}
                  totalSlides={deck.slides.length}
                  style={deck.style}
                  isLoading={isGenerating || regeneratingIndex === activeIndex}
                />

                {/* Slide Prev / Next Navigation */}
                <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeIndex === 0 || isGenerating}
                    aria-label="Chuyển tới slide trước"
                    className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    <span>Slide trước</span>
                  </button>

                  <span
                    data-testid="slide-counter"
                    className="font-tabular text-xs font-semibold text-slate-700"
                  >
                    Slide {activeIndex + 1} / {deck.slides.length}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((prev) => Math.min(deck.slides.length - 1, prev + 1))
                    }
                    disabled={activeIndex >= deck.slides.length - 1 || isGenerating}
                    aria-label="Chuyển tới slide tiếp theo"
                    className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap"
                  >
                    <span>Slide sau</span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Filmstrip Thumbnails */}
                <div
                  aria-label="Danh sách slide thu nhỏ"
                  className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5"
                >
                  {isGenerating
                    ? Array.from({ length: promptConfig.slideCount }).map((_, idx) => (
                        <div
                          key={`skel-${idx}`}
                          className="aspect-video rounded-lg border border-slate-200 bg-slate-200/70 animate-pulse"
                        />
                      ))
                    : deck.slides.map((s, idx) => {
                        const isSelected = idx === activeIndex;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setActiveIndex(idx)}
                            aria-label={`Chọn Slide ${idx + 1}: ${s.title}`}
                            aria-current={isSelected ? 'true' : undefined}
                            className={`group text-left rounded-lg p-1 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 ${
                              isSelected
                                ? 'ring-2 ring-blue-600 bg-blue-50/40'
                                : 'hover:ring-1 hover:ring-slate-300'
                            }`}
                          >
                            <SlideCanvas
                              slide={s}
                              deckTitle={deck.deckTitle}
                              slideIndex={idx}
                              totalSlides={deck.slides.length}
                              style={deck.style}
                              compact
                              isLoading={regeneratingIndex === idx}
                            />
                            <span className="mt-1 block truncate px-0.5 text-[11px] font-medium text-slate-600 font-tabular">
                              {idx + 1}. {s.title}
                            </span>
                          </button>
                        );
                      })}
                </div>
              </div>

              {/* Direct Editor + Speaker Notes */}
              {!isGenerating && currentSlide && (
                <SlideEditorPanel
                  slide={currentSlide}
                  slideIndex={activeIndex}
                  totalSlides={deck.slides.length}
                  isRegenerating={regeneratingIndex === activeIndex}
                  onUpdateSlide={handleUpdateCurrentSlide}
                  onRegenerateSlide={(instruction) =>
                    handleRegenerateSlide(activeIndex, instruction)
                  }
                  onAddSlide={handleAddSlide}
                  onDeleteSlide={handleDeleteCurrentSlide}
                  onMoveSlide={handleMoveCurrentSlide}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Fullscreen Presentation Modal */}
      {isPresenting && (
        <PresentationModal
          deck={deck}
          currentIndex={activeIndex}
          onChangeIndex={setActiveIndex}
          onClose={() => setIsPresenting(false)}
        />
      )}

      {/* Clean Printable PDF Layout (only visible during window.print()) */}
      <div className="print-only-deck hidden">
        {deck.slides.map((slide, idx) => (
          <div key={slide.id} className="mb-8 break-after-page">
            <SlideCanvas
              slide={slide}
              deckTitle={deck.deckTitle}
              slideIndex={idx}
              totalSlides={deck.slides.length}
              style={deck.style}
            />
            {slide.speakerNotes && (
              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                <strong>Ghi chú thuyết trình: </strong>
                {slide.speakerNotes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
