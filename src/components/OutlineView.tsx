import { Copy, Edit3, FileText, RefreshCw } from 'lucide-react';
import type { PresentationDeck } from '../types/slides';
import { formatCleanOutlineText } from '../utils/slideLogic';

interface OutlineViewProps {
  deck: PresentationDeck;
  activeIndex: number;
  regeneratingIndex: number | null;
  onSelectSlideForEdit: (index: number) => void;
  onRegenerateSlide: (index: number) => void;
  onCopyCleanOutline: () => void;
  onDownloadOutlineTxt: () => void;
  onDownloadOutlineMd: () => void;
}

export function OutlineView({
  deck,
  activeIndex,
  regeneratingIndex,
  onSelectSlideForEdit,
  onRegenerateSlide,
  onCopyCleanOutline,
  onDownloadOutlineTxt,
  onDownloadOutlineMd,
}: OutlineViewProps) {
  const cleanOutlineText = formatCleanOutlineText(deck);

  return (
    <section aria-label="Dàn ý toàn bộ bài trình chiếu" className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{deck.deckTitle}</h2>
          <p className="text-xs text-slate-500">
            {deck.audience} · {deck.slides.length} slide
          </p>
        </div>
      </div>

      {/* Clean Outline / Canva Paste Panel */}
      <div
        aria-label="Xuất dàn ý văn bản sạch"
        className="rounded-xl border border-slate-200 bg-white p-5 space-y-3.5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Dàn ý văn bản sạch (Canva Paste)
            </h3>
            <p className="text-xs text-slate-500">
              Văn bản thuần túy theo cấu trúc chuẩn từng slide — sao chép trực tiếp sang Canva hoặc tải về máy, không tốn điểm AI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onCopyCleanOutline}
              className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap"
            >
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Copy dàn ý cho Canva</span>
            </button>
            <button
              type="button"
              onClick={onDownloadOutlineTxt}
              className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tải .txt</span>
            </button>
            <button
              type="button"
              onClick={onDownloadOutlineMd}
              className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tải .md</span>
            </button>
          </div>
        </div>

        <label htmlFor="clean-outline-preview" className="sr-only">
          Nội dung dàn ý văn bản sạch
        </label>
        <textarea
          id="clean-outline-preview"
          data-testid="clean-outline-text"
          readOnly
          rows={10}
          value={cleanOutlineText}
          onFocus={(e) => e.currentTarget.select()}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3.5 font-mono text-xs leading-relaxed text-slate-800 focus:border-blue-600 focus:outline-none"
        />
      </div>

      {/* Per-slide cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deck.slides.map((slide, idx) => {
          const isSelected = idx === activeIndex;
          const isBusy = regeneratingIndex === idx;

          return (
            <article
              key={slide.id}
              className={`rounded-xl border bg-white p-5 flex flex-col justify-between gap-4 transition-colors ${
                isSelected ? 'border-blue-600' : 'border-slate-200'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="font-tabular font-semibold text-slate-700">
                    Slide {idx + 1}
                  </span>
                  <span>{slide.layout}</span>
                </div>

                <h3 className="text-base font-semibold text-slate-900 leading-snug">
                  {slide.title}
                </h3>

                {slide.subtitle && (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {slide.subtitle}
                  </p>
                )}

                <ul className="space-y-1.5 pt-1">
                  {slide.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-slate-400 shrink-0" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {slide.speakerNotes && (
                  <p className="border-t border-slate-100 pt-2.5 text-xs text-slate-500 leading-relaxed">
                    <span className="font-semibold text-slate-700">Ghi chú: </span>
                    {slide.speakerNotes}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onRegenerateSlide(idx)}
                  disabled={regeneratingIndex !== null}
                  className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isBusy ? 'animate-spin' : ''}`} aria-hidden="true" />
                  <span>{isBusy ? 'Đang tạo lại...' : 'Tạo lại (-1 điểm)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSlideForEdit(idx)}
                  className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                >
                  <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Sửa slide này</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
