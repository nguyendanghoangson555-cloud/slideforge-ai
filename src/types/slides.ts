export type SlideStyle = 'modern' | 'academic' | 'minimal' | 'dynamic';

export type SlideLanguage = 'vi' | 'en';

export type SlideLayout = 'title' | 'bullets' | 'two-column' | 'highlight';

export interface SlideItem {
  id: string;
  layout: SlideLayout;
  title: string;
  subtitle: string;
  bullets: string[];
  speakerNotes: string;
  highlightStat?: string;
}

export interface PresentationDeck {
  deckTitle: string;
  topic: string;
  audience: string;
  style: SlideStyle;
  language: SlideLanguage;
  slides: SlideItem[];
  updatedAt: string;
}

export interface PromptConfig {
  topic: string;
  audience: string;
  slideCount: number;
  style: SlideStyle;
  language: SlideLanguage;
}

export interface SamplePrompt {
  id: string;
  label: string;
  topic: string;
  audience: string;
  slideCount: number;
  style: SlideStyle;
  language: SlideLanguage;
}

export interface SlideThemeConfig {
  id: SlideStyle;
  name: string;
  description: string;
  fontClass: 'font-slide-sans' | 'font-slide-serif';
  pptxFontFace: string;
  // Web CSS hex colors
  canvasBg: string;
  surfaceBg: string;
  titleColor: string;
  subtitleColor: string;
  bodyColor: string;
  mutedColor: string;
  accentColor: string;
  accentSoftBg: string;
  borderColor: string;
  // Title slide variant
  coverBg: string;
  coverTitleColor: string;
  coverSubtitleColor: string;
  coverAccentColor: string;
  coverBorderColor: string;
}
