import { Coins, Download } from 'lucide-react';

export type WorkspaceSection = 'editor' | 'outline' | 'present';

interface TopBarProps {
  activeSection: WorkspaceSection;
  onSelectSection: (section: WorkspaceSection) => void;
  onExportPptx: () => void;
  isExporting: boolean;
  quotaRemaining: number;
  quotaMax: number;
}

export function TopBar({
  activeSection,
  onSelectSection,
  onExportPptx,
  isExporting,
  quotaRemaining,
  quotaMax,
}: TopBarProps) {
  const isExhausted = quotaRemaining <= 0;

  return (
    <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 lg:gap-8 px-4 py-3 sm:px-6">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onSelectSection('editor');
          }}
          className="whitespace-nowrap shrink-0 text-lg font-bold tracking-tight text-slate-900"
        >
          SlideForge AI
        </a>

        <nav
          aria-label="Điều hướng không gian làm việc"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          <button
            type="button"
            onClick={() => onSelectSection('editor')}
            className={`whitespace-nowrap shrink-0 cursor-pointer border-b-2 py-1 transition-colors ${
              activeSection === 'editor'
                ? 'border-blue-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Trình tạo &amp; Xem trước
          </button>
          <button
            type="button"
            onClick={() => onSelectSection('outline')}
            className={`whitespace-nowrap shrink-0 cursor-pointer border-b-2 py-1 transition-colors ${
              activeSection === 'outline'
                ? 'border-blue-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Dàn ý toàn bộ
          </button>
          <button
            type="button"
            onClick={() => onSelectSection('present')}
            className="whitespace-nowrap shrink-0 cursor-pointer border-b-2 border-transparent py-1 transition-colors hover:text-slate-900"
          >
            Trình chiếu toàn màn hình
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <div
            data-testid="ai-quota-badge"
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 ${
              isExhausted
                ? 'border-amber-300 bg-amber-50 text-amber-900'
                : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}
          >
            <Coins
              className={`h-3.5 w-3.5 shrink-0 ${
                isExhausted ? 'text-amber-600' : 'text-blue-600'
              }`}
              aria-hidden="true"
            />
            <span className="hidden sm:inline tabular-nums">
              Điểm AI hôm nay: {quotaRemaining}/{quotaMax} (Reset mỗi ngày)
            </span>
            <span className="sm:hidden tabular-nums">
              {quotaRemaining}/{quotaMax} điểm
            </span>
          </div>

          <button
            type="button"
            onClick={onExportPptx}
            disabled={isExporting}
            className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 whitespace-nowrap shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>{isExporting ? 'Đang xuất...' : 'Xuất PPTX'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
