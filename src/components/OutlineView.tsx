import { Edit3, RefreshCw } from 'lucide-react';
import type { PresentationDeck } from '../types/slides';

interface OutlineViewProps {
  deck: PresentationDeck;
  activeIndex: number;
  regeneratingIndex: number | null;
  onSelectSlideForEdit: (index: number) => void;
  onRegenerateSlide: (index: number) => void;
}

export function OutlineView({
  deck,
  activeIndex,
  regeneratingIndex,
  onSelectSlideForEdit,
  onRegenerateSlide,
}: OutlineViewProps) {
  return (
    <section aria-label="Dàn ý toàn bộ bài trình chiếu" className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{deck.deckTitle}</h2>
          <p className="text-xs text-slate-500">
            {deck.audience} · {deck.slides.length} slide
          </p>
        </div>
      </div>

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
                  <span>{isBusy ? 'Đang tạo lại...' : 'Tạo lại'}</span>
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
