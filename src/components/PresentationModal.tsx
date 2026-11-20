import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, X } from 'lucide-react';
import type { PresentationDeck } from '../types/slides';
import { SlideCanvas } from './SlideCanvas';

interface PresentationModalProps {
  deck: PresentationDeck;
  currentIndex: number;
  onChangeIndex: (index: number) => void;
  onClose: () => void;
}

export function PresentationModal({
  deck,
  currentIndex,
  onChangeIndex,
  onClose,
}: PresentationModalProps) {
  const [showNotes, setShowNotes] = useState(false);
  const currentSlide = deck.slides[currentIndex] ?? deck.slides[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentIndex < deck.slides.length - 1) {
          onChangeIndex(currentIndex + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentIndex > 0) {
          onChangeIndex(currentIndex - 1);
        }
      } else if (e.key.toLowerCase() === 'n') {
        setShowNotes((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck.slides.length, onChangeIndex, onClose]);

  if (!currentSlide) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chế độ trình chiếu toàn màn hình"
      data-testid="presentation-fullscreen-overlay"
      className="no-print fixed inset-0 z-50 flex flex-col bg-zinc-950 text-zinc-100"
    >
      {/* Top minimal bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-3 text-sm text-zinc-300 min-w-0">
          <span className="font-semibold text-white truncate">{deck.deckTitle}</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span className="font-tabular text-zinc-400 shrink-0">
            Slide {currentIndex + 1} / {deck.slides.length}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowNotes((prev) => !prev)}
            aria-pressed={showNotes}
            className={`inline-flex min-h-[38px] cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              showNotes
                ? 'border-blue-500 bg-blue-600 text-white'
                : 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Ghi chú (N)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Thoát chế độ trình chiếu"
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span>Thoát</span>
          </button>
        </div>
      </div>

      {/* Central 16:9 stage */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto gap-4">
        <div className="w-full max-w-[1120px]">
          <SlideCanvas
            slide={currentSlide}
            deckTitle={deck.deckTitle}
            slideIndex={currentIndex}
            totalSlides={deck.slides.length}
            style={deck.style}
          />
        </div>

        {showNotes && (
          <div className="w-full max-w-[1120px] rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3.5 text-sm text-zinc-200">
            <span className="font-semibold text-white">Ghi chú người nói: </span>
            <span>{currentSlide.speakerNotes || 'Chưa có ghi chú cho slide này.'}</span>
          </div>
        )}
      </div>

      {/* Bottom navigation bar */}
      <div className="flex items-center justify-center gap-4 px-6 py-4 border-t border-zinc-800/80">
        <button
          type="button"
          onClick={() => onChangeIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          aria-label="Slide trước"
          className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span>Trước</span>
        </button>

        <span className="font-tabular text-sm font-medium text-zinc-300 min-w-[80px] text-center">
          {currentIndex + 1} / {deck.slides.length}
        </span>

        <button
          type="button"
          onClick={() => onChangeIndex(Math.min(deck.slides.length - 1, currentIndex + 1))}
          disabled={currentIndex >= deck.slides.length - 1}
          aria-label="Slide tiếp theo"
          className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>Tiếp theo</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
