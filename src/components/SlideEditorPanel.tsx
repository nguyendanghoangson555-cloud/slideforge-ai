import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import type { SlideItem, SlideLayout } from '../types/slides';

interface SlideEditorPanelProps {
  slide: SlideItem;
  slideIndex: number;
  totalSlides: number;
  isRegenerating: boolean;
  onUpdateSlide: (patch: Partial<SlideItem>) => void;
  onRegenerateSlide: (instruction?: string) => void;
  onAddSlide: () => void;
  onDeleteSlide: () => void;
  onMoveSlide: (direction: -1 | 1) => void;
}

const LAYOUT_OPTIONS: { id: SlideLayout; label: string }[] = [
  { id: 'title', label: 'Trang bìa' },
  { id: 'bullets', label: 'Gạch đầu dòng' },
  { id: 'two-column', label: 'Hai cột' },
  { id: 'highlight', label: 'Số liệu nhấn' },
];

export function SlideEditorPanel({
  slide,
  slideIndex,
  totalSlides,
  isRegenerating,
  onUpdateSlide,
  onRegenerateSlide,
  onAddSlide,
  onDeleteSlide,
  onMoveSlide,
}: SlideEditorPanelProps) {
  const [refineHint, setRefineHint] = useState('');

  const handleBulletChange = (idx: number, value: string) => {
    const next = [...slide.bullets];
    next[idx] = value;
    onUpdateSlide({ bullets: next });
  };

  const handleAddBullet = () => {
    if (slide.bullets.length >= 6) return;
    onUpdateSlide({ bullets: [...slide.bullets, 'Ý mới cần trình bày'] });
  };

  const handleRemoveBullet = (idx: number) => {
    if (slide.bullets.length <= 1) return;
    onUpdateSlide({ bullets: slide.bullets.filter((_, i) => i !== idx) });
  };

  return (
    <section
      aria-label="Chỉnh sửa nội dung slide và ghi chú thuyết trình"
      className="no-print rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5"
    >
      {/* Header row with actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Chỉnh sửa Slide {slideIndex + 1}
          </h3>
          <p className="text-xs text-slate-500">
            Mọi thay đổi hiển thị trực tiếp trên bản xem trước 16:9 và được lưu khi xuất file.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onMoveSlide(-1)}
            disabled={slideIndex === 0 || isRegenerating}
            aria-label="Di chuyển slide lên trước"
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Lên</span>
          </button>
          <button
            type="button"
            onClick={() => onMoveSlide(1)}
            disabled={slideIndex >= totalSlides - 1 || isRegenerating}
            aria-label="Di chuyển slide xuống sau"
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Xuống</span>
          </button>
          <button
            type="button"
            onClick={onAddSlide}
            disabled={isRegenerating}
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Thêm slide</span>
          </button>
          <button
            type="button"
            onClick={onDeleteSlide}
            disabled={totalSlides <= 1 || isRegenerating}
            aria-label={`Xóa slide ${slideIndex + 1}`}
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Xóa</span>
          </button>
        </div>
      </div>

      {/* AI Regenerate Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <label htmlFor="regenerate-hint" className="sr-only">
          Ghi chú yêu cầu khi tạo lại slide
        </label>
        <input
          id="regenerate-hint"
          type="text"
          value={refineHint}
          onChange={(e) => setRefineHint(e.target.value)}
          placeholder="Gợi ý cho AI khi tạo lại slide này (tùy chọn, ví dụ: thêm số liệu thực tế)..."
          className="flex-1 min-h-[40px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => {
            onRegenerateSlide(refineHint.trim() || undefined);
            setRefineHint('');
          }}
          disabled={isRegenerating}
          className="inline-flex min-h-[40px] shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRegenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Đang tạo lại...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              <span>Tạo lại slide này (-1 điểm)</span>
            </>
          )}
        </button>
      </div>

      {/* Layout + Title + Subtitle */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 space-y-1.5">
          <label htmlFor="edit-slide-title" className="block text-xs font-semibold text-slate-700">
            Tiêu đề chính
          </label>
          <input
            id="edit-slide-title"
            type="text"
            value={slide.title}
            onChange={(e) => onUpdateSlide({ title: e.target.value })}
            className="w-full min-h-[40px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
          />
        </div>

        <div className="md:col-span-4 space-y-1.5">
          <label htmlFor="edit-slide-layout" className="block text-xs font-semibold text-slate-700">
            Bố cục slide
          </label>
          <select
            id="edit-slide-layout"
            value={slide.layout}
            onChange={(e) => onUpdateSlide({ layout: e.target.value as SlideLayout })}
            className="w-full min-h-[40px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
          >
            {LAYOUT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className={slide.layout === 'highlight' ? 'md:col-span-8 space-y-1.5' : 'md:col-span-12 space-y-1.5'}>
          <label htmlFor="edit-slide-subtitle" className="block text-xs font-semibold text-slate-700">
            Tiêu đề phụ
          </label>
          <input
            id="edit-slide-subtitle"
            type="text"
            value={slide.subtitle}
            onChange={(e) => onUpdateSlide({ subtitle: e.target.value })}
            className="w-full min-h-[40px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
          />
        </div>

        {slide.layout === 'highlight' && (
          <div className="md:col-span-4 space-y-1.5">
            <label htmlFor="edit-highlight-stat" className="block text-xs font-semibold text-slate-700">
              Số liệu nổi bật
            </label>
            <input
              id="edit-highlight-stat"
              type="text"
              value={slide.highlightStat ?? ''}
              onChange={(e) => onUpdateSlide({ highlightStat: e.target.value })}
              placeholder="Ví dụ: 38%, 3x, 90 ngày"
              className="w-full min-h-[40px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 font-tabular focus:border-blue-600 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Bullets and Speaker Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Các gạch đầu dòng ({slide.bullets.length})
            </span>
            <button
              type="button"
              onClick={handleAddBullet}
              disabled={slide.bullets.length >= 6}
              className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Thêm ý</span>
            </button>
          </div>

          <div className="space-y-2">
            {slide.bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-5 text-right text-xs text-slate-400 font-tabular shrink-0">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  aria-label={`Gạch đầu dòng ${idx + 1}`}
                  value={bullet}
                  onChange={(e) => handleBulletChange(idx, e.target.value)}
                  className="flex-1 min-h-[40px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBullet(idx)}
                  disabled={slide.bullets.length <= 1}
                  aria-label={`Xóa gạch đầu dòng ${idx + 1}`}
                  className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-1.5">
          <label htmlFor="edit-speaker-notes" className="block text-xs font-semibold text-slate-700">
            Ghi chú thuyết trình (Speaker Notes)
          </label>
          <textarea
            id="edit-speaker-notes"
            rows={6}
            value={slide.speakerNotes}
            onChange={(e) => onUpdateSlide({ speakerNotes: e.target.value })}
            placeholder="Lời dẫn chi tiết giúp người thuyết trình trình bày tự tin..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
          />
        </div>
      </div>
    </section>
  );
}
