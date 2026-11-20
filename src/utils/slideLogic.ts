import type {
  PresentationDeck,
  PromptConfig,
  SamplePrompt,
  SlideItem,
  SlideLanguage,
  SlideLayout,
  SlideStyle,
  SlideThemeConfig,
} from '../types/slides';

export const MIN_SLIDES = 5;
export const MAX_SLIDES = 12;

export const SLIDE_THEMES: Record<SlideStyle, SlideThemeConfig> = {
  modern: {
    id: 'modern',
    name: 'Hiện đại',
    description: 'Bố cục doanh nghiệp gọn gàng, xanh cobalt sắc nét trên nền sáng',
    fontClass: 'font-slide-sans',
    pptxFontFace: 'Arial',
    canvasBg: '#FFFFFF',
    surfaceBg: '#F1F5F9',
    titleColor: '#0F172A',
    subtitleColor: '#334155',
    bodyColor: '#1E293B',
    mutedColor: '#64748B',
    accentColor: '#2563EB',
    accentSoftBg: '#EFF6FF',
    borderColor: '#E2E8F0',
    coverBg: '#0F172A',
    coverTitleColor: '#F8FAFC',
    coverSubtitleColor: '#CBD5E1',
    coverAccentColor: '#3B82F6',
    coverBorderColor: 'rgba(255, 255, 255, 0.16)',
  },
  academic: {
    id: 'academic',
    name: 'Học thuật',
    description: 'Kiểu chữ serif trang trọng, nền giấy ngà, nhấn xanh hải quân',
    fontClass: 'font-slide-serif',
    pptxFontFace: 'Georgia',
    canvasBg: '#FAF8F4',
    surfaceBg: '#F1ECE1',
    titleColor: '#14213D',
    subtitleColor: '#3D485E',
    bodyColor: '#1F2937',
    mutedColor: '#5B6475',
    accentColor: '#1D4ED8',
    accentSoftBg: '#EAECEF',
    borderColor: '#DDD5C7',
    coverBg: '#14213D',
    coverTitleColor: '#FAF8F4',
    coverSubtitleColor: '#D6D3CD',
    coverAccentColor: '#C99B3B',
    coverBorderColor: 'rgba(250, 248, 244, 0.18)',
  },
  minimal: {
    id: 'minimal',
    name: 'Tối giản',
    description: 'Trắng tinh khiết, độ tương phản cao và khoảng thở rộng rãi',
    fontClass: 'font-slide-sans',
    pptxFontFace: 'Helvetica',
    canvasBg: '#FFFFFF',
    surfaceBg: '#F9FAFB',
    titleColor: '#111827',
    subtitleColor: '#4B5563',
    bodyColor: '#1F2937',
    mutedColor: '#6B7280',
    accentColor: '#111827',
    accentSoftBg: '#F3F4F6',
    borderColor: '#E5E7EB',
    coverBg: '#FFFFFF',
    coverTitleColor: '#111827',
    coverSubtitleColor: '#4B5563',
    coverAccentColor: '#111827',
    coverBorderColor: '#E5E7EB',
  },
  dynamic: {
    id: 'dynamic',
    name: 'Năng động',
    description: 'Nền than sâu mạnh mẽ kết hợp điểm nhấn cam san hô nổi bật',
    fontClass: 'font-slide-sans',
    pptxFontFace: 'Arial',
    canvasBg: '#18181B',
    surfaceBg: '#27272A',
    titleColor: '#FAFAFA',
    subtitleColor: '#D4D4D8',
    bodyColor: '#E4E4E7',
    mutedColor: '#A1A1AA',
    accentColor: '#F97316',
    accentSoftBg: '#2E231D',
    borderColor: '#3F3F46',
    coverBg: '#09090B',
    coverTitleColor: '#FFFFFF',
    coverSubtitleColor: '#D4D4D8',
    coverAccentColor: '#FB923C',
    coverBorderColor: 'rgba(255, 255, 255, 0.14)',
  },
};

export const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    id: 'ai-enterprise',
    label: 'Chiến lược AI Doanh nghiệp',
    topic: 'Chiến lược ứng dụng AI tạo sinh để tối ưu vận hành doanh nghiệp vừa và nhỏ năm 2026',
    audience: 'Ban giám đốc và trưởng bộ phận vận hành',
    slideCount: 7,
    style: 'modern',
    language: 'vi',
  },
  {
    id: 'edtech-research',
    label: 'Nghiên cứu Khoa học & EdTech',
    topic: 'Phương pháp học tập thích ứng cá nhân hóa dựa trên dữ liệu hành vi sinh viên đại học',
    audience: 'Hội đồng khoa học và giảng viên đại học',
    slideCount: 8,
    style: 'academic',
    language: 'vi',
  },
  {
    id: 'product-launch',
    label: 'Ra mắt Sản phẩm Mới',
    topic: 'Kế hoạch ra mắt ứng dụng quản lý tài chính cá nhân thế hệ mới trong quý 3',
    audience: 'Nhà đầu tư và đội ngũ tăng trưởng sản phẩm',
    slideCount: 6,
    style: 'dynamic',
    language: 'vi',
  },
  {
    id: 'sustainability-en',
    label: 'ESG & Net Zero (English)',
    topic: 'Practical Roadmap to Carbon-Neutral Supply Chains for Manufacturing Leaders',
    audience: 'Executive Leadership & Supply Chain Partners',
    slideCount: 6,
    style: 'minimal',
    language: 'en',
  },
];

export const INITIAL_DEMO_DECK: PresentationDeck = {
  deckTitle: 'Chiến lược Ứng dụng AI trong Vận hành Doanh nghiệp 2026',
  topic: 'Chiến lược ứng dụng AI tạo sinh để tối ưu vận hành doanh nghiệp vừa và nhỏ năm 2026',
  audience: 'Ban giám đốc và trưởng bộ phận vận hành',
  style: 'modern',
  language: 'vi',
  updatedAt: '2026-11-20T04:52:46.000Z',
  slides: [
    {
      id: 'demo-1',
      layout: 'title',
      title: 'Chiến lược Ứng dụng AI trong Vận hành Doanh nghiệp 2026',
      subtitle: 'Lộ trình triển khai thực tiễn, đo lường hiệu quả ROI và quản trị rủi ro cho doanh nghiệp SME',
      bullets: [
        'Đối tượng: Ban giám đốc & Trưởng bộ phận vận hành',
        'Trọng tâm: Tự động hóa quy trình & Nâng cao năng suất nhân sự',
      ],
      speakerNotes:
        'Chào mừng anh chị đến với buổi trình bày chiến lược ứng dụng AI năm 2026. Hôm nay chúng ta tập trung vào các bài toán thực tế có thể triển khai ngay trong 90 ngày đầu tiên thay vì lý thuyết xa vời.',
    },
    {
      id: 'demo-2',
      layout: 'highlight',
      title: 'Bức tranh Năng suất & Cơ hội Chuyển đổi',
      subtitle: 'Tác động định lượng của quy trình hỗ trợ bởi AI đối với đội ngũ vận hành',
      highlightStat: '38%',
      bullets: [
        'Giảm trung bình 38% thời gian xử lý tài liệu và báo cáo định kỳ',
        'Rút ngắn thời gian phản hồi khách hàng từ 4 giờ xuống dưới 15 phút',
        'Chuẩn hóa kho tri thức nội bộ giúp nhân sự mới hòa nhập nhanh hơn 2 lần',
      ],
      speakerNotes:
        'Con số 38% là mức tiết kiệm thời gian trung bình ghi nhận ở các nhóm thử nghiệm khi chuẩn hóa quy trình nhập liệu và tổng hợp báo cáo bằng AI.',
    },
    {
      id: 'demo-3',
      layout: 'two-column',
      title: '3 Nhóm Quy trình Ưu tiên Triển khai Trước',
      subtitle: 'Lựa chọn điểm khởi đầu có rủi ro thấp và tác động đo lường được ngay',
      bullets: [
        'Chăm sóc khách hàng: Tóm tắt hội thoại, gợi ý câu trả lời theo bộ quy chuẩn',
        'Vận hành & Hành chính: Trích xuất dữ liệu hóa đơn, hợp đồng và biên bản họp',
        'Kinh doanh & Marketing: Cá nhân hóa đề xuất giải pháp và bản tin định kỳ',
        'Nguyên tắc chọn lọc: Khối lượng lặp lại cao, dữ liệu đầu vào rõ ràng',
      ],
      speakerNotes:
        'Thay vì dàn trải toàn công ty, chúng ta chọn 3 quy trình có tần suất lặp lại cao nhất. Mỗi quy trình đều giữ con người ở bước duyệt cuối cùng.',
    },
    {
      id: 'demo-4',
      layout: 'bullets',
      title: 'Kiến trúc Triển khai An toàn Dữ liệu',
      subtitle: 'Bảo vệ tài sản trí tuệ và tuân thủ quy định bảo mật nội bộ',
      bullets: [
        'Phân loại dữ liệu 3 cấp độ trước khi đưa vào công cụ xử lý ngôn ngữ',
        'Áp dụng cổng API doanh nghiệp cam kết không dùng dữ liệu để huấn luyện lại',
        'Thiết lập nhật ký kiểm soát (audit log) và phân quyền theo từng phòng ban',
        'Đào tạo nhân sự nhận diện rủi ro ảo giác thông tin và kiểm chứng nguồn',
      ],
      speakerNotes:
        'Bảo mật là điều kiện tiên quyết. Toàn bộ dữ liệu khách hàng nhạy cảm sẽ được ẩn danh hóa trước khi đi qua lớp xử lý tự động.',
    },
    {
      id: 'demo-5',
      layout: 'two-column',
      title: 'Lộ trình 90 Ngày: Từ Thử nghiệm đến Mở rộng',
      subtitle: 'Chia thành 3 chặng ngắn với tiêu chí nghiệm thu minh bạch',
      bullets: [
        'Ngày 1–30: Khảo sát điểm nghẽn, chọn 2 quy trình thí điểm và chuẩn hóa dữ liệu',
        'Ngày 31–60: Vận hành song song với nhóm nòng cốt, đo thời gian xử lý thực tế',
        'Ngày 61–90: Đánh giá ROI, hoàn thiện tài liệu hướng dẫn và nhân rộng toàn khối',
        'Chỉ số thành công: Tiết kiệm tối thiểu 6 giờ/nhân sự/tuần và tỷ lệ hài lòng >= 85%',
      ],
      speakerNotes:
        'Mỗi giai đoạn kéo dài 30 ngày đều có điểm dừng đánh giá. Nếu nhóm thí điểm không đạt ngưỡng tiết kiệm thời gian, chúng ta điều chỉnh ngay trước khi mở rộng.',
    },
    {
      id: 'demo-6',
      layout: 'bullets',
      title: 'Bước Tiếp Theo & Đề Xuất Phê Duyệt',
      subtitle: 'Các quyết định cần thống nhất trong tuần này để khởi động dự án',
      bullets: [
        'Phê duyệt thành lập Tổ công tác AI liên phòng ban gồm 5 thành viên đại diện',
        'Chốt ngân sách thử nghiệm giai đoạn 1 và danh sách công cụ được cấp phép',
        'Tổ chức 2 buổi đào tạo thực hành viết câu lệnh chuẩn cho quản lý cấp trung',
      ],
      speakerNotes:
        'Cảm ơn anh chị đã lắng nghe. Sau buổi hôm nay, tổ đề án rất mong nhận được phê duyệt nhân sự đầu mối từ các phòng ban để khởi động khảo sát ngay tuần tới.',
    },
  ],
};

export function clampSlideCount(value: number): number {
  if (!Number.isFinite(value)) return 7;
  return Math.min(MAX_SLIDES, Math.max(MIN_SLIDES, Math.round(value)));
}

export function validatePromptConfig(config: PromptConfig): {
  valid: boolean;
  error?: string;
  normalized: PromptConfig;
} {
  const topic = config.topic.trim();
  const audience = config.audience.trim();
  const slideCount = clampSlideCount(config.slideCount);

  if (topic.length < 3) {
    return {
      valid: false,
      error: 'Vui lòng nhập chủ đề hoặc câu lệnh từ 3 ký tự trở lên để AI tạo dàn ý.',
      normalized: { ...config, topic, audience, slideCount },
    };
  }

  return {
    valid: true,
    normalized: {
      ...config,
      topic,
      audience: audience || (config.language === 'en' ? 'General Professionals' : 'Người nghe đại chúng'),
      slideCount,
    },
  };
}

export function getThemeConfig(style: SlideStyle): SlideThemeConfig {
  return SLIDE_THEMES[style] ?? SLIDE_THEMES.modern;
}

const VALID_LAYOUTS: SlideLayout[] = ['title', 'bullets', 'two-column', 'highlight'];

export function sanitizeLayout(layout: unknown, index: number): SlideLayout {
  if (index === 0) return 'title';
  if (typeof layout === 'string' && VALID_LAYOUTS.includes(layout as SlideLayout)) {
    return layout as SlideLayout;
  }
  return index % 3 === 1 ? 'highlight' : index % 2 === 0 ? 'two-column' : 'bullets';
}

export function normalizeSingleSlide(
  raw: Partial<SlideItem> | null | undefined,
  index: number,
  fallbackId?: string
): SlideItem {
  const layout = sanitizeLayout(raw?.layout, index);
  const title =
    typeof raw?.title === 'string' && raw.title.trim().length > 0
      ? raw.title.trim()
      : `Slide ${index + 1}`;
  const subtitle =
    typeof raw?.subtitle === 'string' ? raw.subtitle.trim() : '';
  const bullets = Array.isArray(raw?.bullets)
    ? raw.bullets
        .filter((b): b is string => typeof b === 'string' && b.trim().length > 0)
        .map((b) => b.trim())
        .slice(0, 6)
    : [];
  const speakerNotes =
    typeof raw?.speakerNotes === 'string' ? raw.speakerNotes.trim() : '';
  const highlightStat =
    typeof raw?.highlightStat === 'string' && raw.highlightStat.trim().length > 0
      ? raw.highlightStat.trim()
      : undefined;

  return {
    id:
      typeof raw?.id === 'string' && raw.id.trim().length > 0
        ? raw.id.trim()
        : fallbackId ?? `slide-${index + 1}-${Date.now()}`,
    layout,
    title,
    subtitle,
    bullets: bullets.length > 0 ? bullets : ['Nội dung đang được cập nhật'],
    speakerNotes,
    ...(highlightStat ? { highlightStat } : {}),
  };
}

export function normalizeDeckResponse(
  raw: {
    deckTitle?: unknown;
    slides?: unknown;
  },
  config: PromptConfig
): PresentationDeck {
  const rawSlides = Array.isArray(raw?.slides) ? raw.slides : [];
  const slides = rawSlides.map((item, idx) =>
    normalizeSingleSlide(item as Partial<SlideItem>, idx, `slide-${idx + 1}`)
  );

  const deckTitle =
    typeof raw?.deckTitle === 'string' && raw.deckTitle.trim().length > 0
      ? raw.deckTitle.trim()
      : slides[0]?.title || config.topic;

  return {
    deckTitle,
    topic: config.topic,
    audience: config.audience,
    style: config.style,
    language: config.language,
    slides,
    updatedAt: new Date().toISOString(),
  };
}

export function updateSlideInDeck(
  deck: PresentationDeck,
  slideId: string,
  patch: Partial<SlideItem>
): PresentationDeck {
  return {
    ...deck,
    updatedAt: new Date().toISOString(),
    slides: deck.slides.map((slide) =>
      slide.id === slideId ? { ...slide, ...patch } : slide
    ),
  };
}

export function insertBlankSlide(
  deck: PresentationDeck,
  afterIndex: number
): { deck: PresentationDeck; newSlideId: string; newIndex: number } {
  const newSlideId = `slide-custom-${Date.now()}`;
  const isEnglish = deck.language === 'en';
  const newSlide: SlideItem = {
    id: newSlideId,
    layout: 'bullets',
    title: isEnglish ? 'New Slide Title' : 'Tiêu đề slide mới',
    subtitle: isEnglish ? 'Key takeaway subtitle' : 'Tóm tắt luận điểm chính của slide',
    bullets: isEnglish
      ? ['First key point', 'Second supporting point', 'Actionable conclusion']
      : ['Luận điểm chính thứ nhất', 'Dẫn chứng hoặc số liệu hỗ trợ', 'Kết luận hành động'],
    speakerNotes: isEnglish
      ? 'Speaker notes for this slide...'
      : 'Ghi chú thuyết trình dành cho người nói...',
  };

  const insertAt = Math.min(Math.max(0, afterIndex + 1), deck.slides.length);
  const nextSlides = [
    ...deck.slides.slice(0, insertAt),
    newSlide,
    ...deck.slides.slice(insertAt),
  ];

  return {
    deck: {
      ...deck,
      slides: nextSlides,
      updatedAt: new Date().toISOString(),
    },
    newSlideId,
    newIndex: insertAt,
  };
}

export function deleteSlideFromDeck(
  deck: PresentationDeck,
  slideId: string
): PresentationDeck {
  if (deck.slides.length <= 1) return deck;
  return {
    ...deck,
    updatedAt: new Date().toISOString(),
    slides: deck.slides.filter((s) => s.id !== slideId),
  };
}

export function moveSlideInDeck(
  deck: PresentationDeck,
  fromIndex: number,
  direction: -1 | 1
): { deck: PresentationDeck; nextIndex: number } {
  const toIndex = fromIndex + direction;
  if (toIndex < 0 || toIndex >= deck.slides.length) {
    return { deck, nextIndex: fromIndex };
  }
  const nextSlides = [...deck.slides];
  const [moved] = nextSlides.splice(fromIndex, 1);
  nextSlides.splice(toIndex, 0, moved);
  return {
    deck: {
      ...deck,
      slides: nextSlides,
      updatedAt: new Date().toISOString(),
    },
    nextIndex: toIndex,
  };
}

export function escapeHtml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildPrintableHtml(deck: PresentationDeck): string {
  const theme = getThemeConfig(deck.style);
  const fontStack =
    theme.fontClass === 'font-slide-serif'
      ? "'Source Serif 4', Georgia, serif"
      : "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

  const slidesHtml = deck.slides
    .map((slide, index) => {
      const isTitle = slide.layout === 'title' || index === 0;
      const bg = isTitle ? theme.coverBg : theme.canvasBg;
      const titleClr = isTitle ? theme.coverTitleColor : theme.titleColor;
      const subClr = isTitle ? theme.coverSubtitleColor : theme.subtitleColor;
      const accentClr = isTitle ? theme.coverAccentColor : theme.accentColor;

      const bulletsHtml = slide.bullets
        .map(
          (b) =>
            `<li style="margin-bottom: 10px; line-height: 1.5; color: ${
              isTitle ? theme.coverSubtitleColor : theme.bodyColor
            };">${escapeHtml(b)}</li>`
        )
        .join('');

      const statHtml =
        slide.layout === 'highlight' && slide.highlightStat
          ? `<div style="font-size: 56px; font-weight: 700; color: ${accentClr}; line-height: 1.1; margin: 16px 0;">${escapeHtml(
              slide.highlightStat
            )}</div>`
          : '';

      const notesHtml = slide.speakerNotes
        ? `<aside style="margin-top: 10px; padding: 12px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #334155;">
             <strong style="color: #0f172a;">Ghi chú người nói:</strong> ${escapeHtml(
               slide.speakerNotes
             )}
           </aside>`
        : '';

      return `
        <section class="slide-page" style="page-break-after: always; margin-bottom: 28px;">
          <article style="aspect-ratio: 16 / 9; width: 100%; background: ${bg}; border: 1px solid ${
            theme.borderColor
          }; border-radius: 12px; padding: 48px 56px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; font-family: ${fontStack};">
            <div>
              <div style="width: 48px; height: 4px; background: ${accentClr}; margin-bottom: 20px; border-radius: 2px;"></div>
              <h2 style="margin: 0 0 10px 0; font-size: ${
                isTitle ? '36px' : '28px'
              }; font-weight: 700; line-height: 1.25; color: ${titleClr};">${escapeHtml(
                slide.title
              )}</h2>
              ${
                slide.subtitle
                  ? `<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: ${subClr};">${escapeHtml(
                      slide.subtitle
                    )}</p>`
                  : ''
              }
              ${statHtml}
              <ul style="margin: 16px 0 0 0; padding-left: 20px; font-size: 16px; ${
                slide.layout === 'two-column' ? 'columns: 2; column-gap: 36px;' : ''
              }">
                ${bulletsHtml}
              </ul>
            </div>
            <footer style="display: flex; justify-content: space-between; font-size: 12px; color: ${
              isTitle ? theme.coverSubtitleColor : theme.mutedColor
            }; border-top: 1px solid ${theme.borderColor}; padding-top: 12px;">
              <span>${escapeHtml(deck.deckTitle)}</span>
              <span>Slide ${index + 1} / ${deck.slides.length}</span>
            </footer>
          </article>
          ${notesHtml}
        </section>
      `;
    })
    .join('');

  return `<!doctype html>
<html lang="${deck.language}">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(deck.deckTitle)} — SlideForge AI</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    body {
      margin: 0;
      padding: 32px;
      background: #f1f5f9;
      color: #0f172a;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .container {
      max-width: 1024px;
      margin: 0 auto;
    }
    .doc-header {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .doc-header { display: none; }
      .slide-page { margin-bottom: 0; break-inside: avoid; }
      @page { size: landscape; margin: 10mm; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="doc-header">
      <div>
        <h1 style="margin: 0; font-size: 20px;">${escapeHtml(deck.deckTitle)}</h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;">${escapeHtml(
          deck.audience
        )} · ${deck.slides.length} slides</p>
      </div>
      <span style="font-size: 12px; color: #64748b;">Xuất từ SlideForge AI</span>
    </header>
    ${slidesHtml}
  </div>
</body>
</html>`;
}
