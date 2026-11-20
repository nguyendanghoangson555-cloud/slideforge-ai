import type { SlideItem, SlideStyle } from '../types/slides';
import { getThemeConfig } from '../utils/slideLogic';

interface SlideCanvasProps {
  slide: SlideItem;
  deckTitle: string;
  slideIndex: number;
  totalSlides: number;
  style: SlideStyle;
  compact?: boolean;
  isLoading?: boolean;
}

export function SlideCanvas({
  slide,
  deckTitle,
  slideIndex,
  totalSlides,
  style,
  compact = false,
  isLoading = false,
}: SlideCanvasProps) {
  const theme = getThemeConfig(style);
  const isCover = slide.layout === 'title' || slideIndex === 0;

  if (isLoading) {
    return (
      <div
        data-testid="slide-loading-skeleton"
        className="aspect-video w-full rounded-xl border border-slate-200 bg-white p-6 sm:p-10 flex flex-col justify-between animate-pulse"
        aria-busy="true"
        aria-label="Đang tạo nội dung slide"
      >
        <div className="space-y-4">
          <div className="h-1.5 w-14 rounded bg-blue-200" />
          <div className="h-8 w-3/4 rounded bg-slate-200" />
          <div className="h-4 w-1/2 rounded bg-slate-100" />
          <div className="pt-6 space-y-3">
            <div className="h-4 w-5/6 rounded bg-slate-100" />
            <div className="h-4 w-4/6 rounded bg-slate-100" />
            <div className="h-4 w-3/4 rounded bg-slate-100" />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="h-3 w-40 rounded bg-slate-100" />
          <div className="h-3 w-12 rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  const bg = isCover ? theme.coverBg : theme.canvasBg;
  const titleClr = isCover ? theme.coverTitleColor : theme.titleColor;
  const subtitleClr = isCover ? theme.coverSubtitleColor : theme.subtitleColor;
  const bodyClr = isCover ? theme.coverSubtitleColor : theme.bodyColor;
  const accentClr = isCover ? theme.coverAccentColor : theme.accentColor;
  const mutedClr = isCover ? theme.coverSubtitleColor : theme.mutedColor;
  const dividerClr = isCover ? theme.coverBorderColor : theme.borderColor;

  const padClass = compact ? 'p-2.5' : 'p-6 sm:p-10 lg:p-12';
  const titleSizeClass = compact
    ? 'text-[9.5px] leading-tight line-clamp-2'
    : isCover
      ? 'text-xl sm:text-3xl lg:text-[2.15rem] leading-[1.2] text-balance'
      : 'text-lg sm:text-2xl lg:text-[1.65rem] leading-[1.25] text-balance';
  const subtitleSizeClass = compact
    ? 'text-[7px] leading-tight line-clamp-1'
    : 'text-xs sm:text-sm lg:text-base leading-relaxed';
  const bulletSizeClass = compact
    ? 'text-[7px] leading-tight'
    : 'text-xs sm:text-sm lg:text-[15px] leading-relaxed';

  const midPoint = Math.ceil(slide.bullets.length / 2);
  const leftColumn = slide.bullets.slice(0, midPoint);
  const rightColumn = slide.bullets.slice(midPoint);

  return (
    <div
      data-testid={compact ? `slide-thumb-${slideIndex}` : 'active-slide-canvas'}
      className={`aspect-video w-full overflow-hidden rounded-xl border transition-colors duration-200 flex flex-col justify-between ${theme.fontClass} ${padClass}`}
      style={{
        backgroundColor: bg,
        borderColor: dividerClr,
      }}
    >
      <div className={compact ? 'space-y-1 overflow-hidden' : 'space-y-4 overflow-hidden'}>
        {/* Minimal structural accent rule */}
        <div
          className={compact ? 'h-0.5 w-4 rounded-full' : 'h-1 w-12 rounded-full'}
          style={{ backgroundColor: accentClr }}
        />

        <div className={compact ? 'space-y-0.5' : 'space-y-2'}>
          <h2 className={`font-bold tracking-tight ${titleSizeClass}`} style={{ color: titleClr }}>
            {slide.title}
          </h2>
          {slide.subtitle && (
            <p className={subtitleSizeClass} style={{ color: subtitleClr }}>
              {slide.subtitle}
            </p>
          )}
        </div>

        {/* Layout body */}
        {!compact && (
          <div className="pt-2">
            {isCover ? (
              <ul className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: dividerClr }}>
                {slide.bullets.map((bullet, idx) => (
                  <li key={idx} className={`flex items-start gap-2.5 ${bulletSizeClass}`} style={{ color: bodyClr }}>
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: accentClr }}
                      aria-hidden="true"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : slide.layout === 'highlight' && slide.highlightStat ? (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-stretch pt-1">
                <div
                  className="sm:col-span-4 rounded-lg border p-5 flex flex-col justify-center items-center text-center"
                  style={{
                    backgroundColor: theme.surfaceBg,
                    borderColor: theme.borderColor,
                  }}
                >
                  <span
                    className="text-3xl sm:text-5xl font-bold tracking-tight font-tabular"
                    style={{ color: accentClr }}
                  >
                    {slide.highlightStat}
                  </span>
                  <span className="mt-2 text-xs leading-snug" style={{ color: mutedClr }}>
                    Chỉ số trọng tâm
                  </span>
                </div>
                <ul className="sm:col-span-8 space-y-2.5 flex flex-col justify-center">
                  {slide.bullets.map((bullet, idx) => (
                    <li key={idx} className={`flex items-start gap-2.5 ${bulletSizeClass}`} style={{ color: bodyClr }}>
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: accentClr }}
                        aria-hidden="true"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : slide.layout === 'two-column' && slide.bullets.length >= 2 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <ul
                  className="rounded-lg border p-4 space-y-2.5"
                  style={{
                    backgroundColor: theme.surfaceBg,
                    borderColor: theme.borderColor,
                  }}
                >
                  {leftColumn.map((bullet, idx) => (
                    <li key={idx} className={`flex items-start gap-2.5 ${bulletSizeClass}`} style={{ color: bodyClr }}>
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: accentClr }}
                        aria-hidden="true"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <ul
                  className="rounded-lg border p-4 space-y-2.5"
                  style={{
                    backgroundColor: theme.surfaceBg,
                    borderColor: theme.borderColor,
                  }}
                >
                  {rightColumn.map((bullet, idx) => (
                    <li key={idx} className={`flex items-start gap-2.5 ${bulletSizeClass}`} style={{ color: bodyClr }}>
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: accentClr }}
                        aria-hidden="true"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ul className="space-y-3 pt-1">
                {slide.bullets.map((bullet, idx) => (
                  <li key={idx} className={`flex items-start gap-3 ${bulletSizeClass}`} style={{ color: bodyClr }}>
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: accentClr }}
                      aria-hidden="true"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={`flex items-center justify-between border-t ${
          compact ? 'pt-1 text-[6px]' : 'pt-3 text-xs'
        }`}
        style={{
          borderColor: dividerClr,
          color: mutedClr,
        }}
      >
        <span className="truncate max-w-[75%]">{deckTitle}</span>
        <span className="font-tabular shrink-0">
          {slideIndex + 1} / {totalSlides}
        </span>
      </div>
    </div>
  );
}
