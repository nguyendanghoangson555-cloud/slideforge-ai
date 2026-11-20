import { Loader2, Sparkles } from 'lucide-react';
import type {
  PromptConfig,
  SamplePrompt,
  SlideLanguage,
  SlideStyle,
} from '../types/slides';
import { MAX_SLIDES, MIN_SLIDES, SAMPLE_PROMPTS, SLIDE_THEMES } from '../utils/slideLogic';

interface PromptPanelProps {
  config: PromptConfig;
  onChange: (next: PromptConfig) => void;
  onSubmit: () => void;
  onApplySample: (sample: SamplePrompt) => void;
  isGenerating: boolean;
  errorMessage: string | null;
  quotaRemaining: number;
  quotaCost: number;
}

const STYLE_LIST: SlideStyle[] = ['modern', 'academic', 'minimal', 'dynamic'];

export function PromptPanel({
  config,
  onChange,
  onSubmit,
  onApplySample,
  isGenerating,
  errorMessage,
  quotaRemaining,
  quotaCost,
}: PromptPanelProps) {
  const hasEnoughQuota = quotaRemaining >= quotaCost;
  return (
    <aside
      aria-label="Bảng cấu hình tạo bài trình chiếu"
      className="no-print w-full lg:w-[360px] shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white p-5 flex flex-col gap-4"
    >
      <div>
        <h1 className="text-lg font-bold tracking-tight text-slate-900">
          Thiết lập bài trình chiếu
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
          Nhập chủ đề hoặc chọn gợi ý mẫu để AI tự động dựng cấu trúc và nội dung slide.
        </p>
      </div>

      {/* Sample Prompts */}
      <div className="space-y-1.5">
        <span className="block text-xs font-semibold text-slate-700">
          Gợi ý chủ đề mẫu
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {SAMPLE_PROMPTS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onApplySample(sample)}
              disabled={isGenerating}
              className="w-full min-h-[38px] cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-left text-[11px] leading-snug font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50/50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-3.5"
      >
        {/* Topic */}
        <div className="space-y-1.5">
          <label htmlFor="prompt-topic" className="block text-xs font-semibold text-slate-700">
            Chủ đề hoặc câu lệnh
          </label>
          <textarea
            id="prompt-topic"
            rows={3}
            value={config.topic}
            onChange={(e) => onChange({ ...config, topic: e.target.value })}
            placeholder="Ví dụ: Chiến lược tăng trưởng thương mại điện tử bền vững năm 2026..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
          />
        </div>

        {/* Audience */}
        <div className="space-y-1.5">
          <label htmlFor="prompt-audience" className="block text-xs font-semibold text-slate-700">
            Mục tiêu người nghe
          </label>
          <input
            id="prompt-audience"
            type="text"
            value={config.audience}
            onChange={(e) => onChange({ ...config, audience: e.target.value })}
            placeholder="Ví dụ: Ban giám đốc, sinh viên, nhà đầu tư..."
            className="w-full min-h-[40px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
          />
        </div>

        {/* Slide count */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="prompt-slide-count" className="text-xs font-semibold text-slate-700">
              Số lượng slide
            </label>
            <span className="font-tabular text-xs font-semibold text-slate-900">
              {config.slideCount} slide
            </span>
          </div>
          <input
            id="prompt-slide-count"
            type="range"
            min={MIN_SLIDES}
            max={MAX_SLIDES}
            step={1}
            value={config.slideCount}
            onChange={(e) =>
              onChange({ ...config, slideCount: Number(e.target.value) })
            }
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-tabular">
            <span>{MIN_SLIDES}</span>
            <span>8</span>
            <span>{MAX_SLIDES}</span>
          </div>
        </div>

        {/* Style */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold text-slate-700">
            Phong cách thiết kế
          </span>
          <div className="grid grid-cols-2 gap-1.5 rounded-lg bg-slate-100 p-1">
            {STYLE_LIST.map((styleId) => {
              const active = config.style === styleId;
              return (
                <button
                  key={styleId}
                  type="button"
                  onClick={() => onChange({ ...config, style: styleId })}
                  aria-pressed={active}
                  className={`min-h-[36px] cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {SLIDE_THEMES[styleId].name}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-500">
            {SLIDE_THEMES[config.style].description}
          </p>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold text-slate-700">
            Ngôn ngữ xuất bản
          </span>
          <div className="grid grid-cols-2 gap-1.5 rounded-lg bg-slate-100 p-1">
            {(
              [
                { id: 'vi', label: 'Tiếng Việt' },
                { id: 'en', label: 'English' },
              ] as { id: SlideLanguage; label: string }[]
            ).map((lang) => {
              const active = config.language === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => onChange({ ...config, language: lang.id })}
                  aria-pressed={active}
                  className={`min-h-[36px] cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>

        {!hasEnoughQuota && !errorMessage && (
          <div
            role="note"
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
          >
            Bạn còn <strong className="font-tabular">{quotaRemaining}</strong> điểm hôm nay (cần{' '}
            <strong className="font-tabular">{quotaCost}</strong> điểm để tạo bộ slide mới). Bạn vẫn
            có thể chỉnh sửa thủ công, sao chép dàn ý và xuất file bình thường.
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700"
          >
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isGenerating}
          className="flex w-full min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Đang tạo dàn ý &amp; nội dung...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>Tạo bài trình chiếu (-{quotaCost} điểm)</span>
            </>
          )}
        </button>
      </form>
    </aside>
  );
}
