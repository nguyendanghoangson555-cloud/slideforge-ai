import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_DEMO_DECK,
  MAX_SLIDES,
  MIN_SLIDES,
  buildPrintableHtml,
  clampSlideCount,
  deleteSlideFromDeck,
  escapeHtml,
  formatCleanOutlineMarkdown,
  formatCleanOutlineText,
  getThemeConfig,
  insertBlankSlide,
  moveSlideInDeck,
  normalizeDeckResponse,
  updateSlideInDeck,
  validatePromptConfig,
} from './slideLogic';

test('validatePromptConfig rejects short or empty topic and clamps slideCount', () => {
  const emptyRes = validatePromptConfig({
    topic: '  ',
    audience: '',
    slideCount: 20,
    style: 'modern',
    language: 'vi',
  });
  assert.equal(emptyRes.valid, false);
  assert.ok(emptyRes.error);
  assert.equal(emptyRes.normalized.slideCount, MAX_SLIDES);

  const validRes = validatePromptConfig({
    topic: 'Chiến lược sản phẩm 2026',
    audience: '',
    slideCount: 2,
    style: 'academic',
    language: 'en',
  });
  assert.equal(validRes.valid, true);
  assert.equal(validRes.normalized.slideCount, MIN_SLIDES);
  assert.equal(validRes.normalized.audience, 'General Professionals');
});

test('clampSlideCount stays within 5..12 bounds', () => {
  assert.equal(clampSlideCount(1), 5);
  assert.equal(clampSlideCount(8), 8);
  assert.equal(clampSlideCount(99), 12);
  assert.equal(clampSlideCount(Number.NaN), 7);
});

test('getThemeConfig returns curated theme palettes for all styles', () => {
  const academic = getThemeConfig('academic');
  assert.equal(academic.fontClass, 'font-slide-serif');
  const dynamic = getThemeConfig('dynamic');
  assert.equal(dynamic.canvasBg, '#18181B');
});

test('normalizeDeckResponse handles partial AI JSON gracefully', () => {
  const deck = normalizeDeckResponse(
    {
      deckTitle: 'Báo cáo Quý 4',
      slides: [
        { title: 'Mở đầu', subtitle: 'Tổng quan', bullets: ['Ý 1', 'Ý 2'], speakerNotes: 'Xin chào' },
        { layout: 'highlight', title: 'Tăng trưởng', highlightStat: '140%', bullets: ['Vượt kế hoạch'] },
      ],
    },
    {
      topic: 'Báo cáo Quý 4',
      audience: 'Ban lãnh đạo',
      slideCount: 6,
      style: 'minimal',
      language: 'vi',
    }
  );

  assert.equal(deck.deckTitle, 'Báo cáo Quý 4');
  assert.equal(deck.slides.length, 2);
  assert.equal(deck.slides[0].layout, 'title');
  assert.equal(deck.slides[1].layout, 'highlight');
  assert.equal(deck.slides[1].highlightStat, '140%');
});

test('slide CRUD and reordering helpers preserve immutability and bounds', () => {
  const firstId = INITIAL_DEMO_DECK.slides[0].id;
  const updated = updateSlideInDeck(INITIAL_DEMO_DECK, firstId, { title: 'Tiêu đề đã sửa' });
  assert.equal(updated.slides[0].title, 'Tiêu đề đã sửa');
  assert.notEqual(INITIAL_DEMO_DECK.slides[0].title, 'Tiêu đề đã sửa');

  const inserted = insertBlankSlide(updated, 0);
  assert.equal(inserted.deck.slides.length, INITIAL_DEMO_DECK.slides.length + 1);
  assert.equal(inserted.newIndex, 1);

  const moved = moveSlideInDeck(inserted.deck, 1, 1);
  assert.equal(moved.nextIndex, 2);
  assert.equal(moved.deck.slides[2].id, inserted.newSlideId);

  const deleted = deleteSlideFromDeck(moved.deck, inserted.newSlideId);
  assert.equal(deleted.slides.length, INITIAL_DEMO_DECK.slides.length);
});

test('buildPrintableHtml escapes HTML entities and renders all slides', () => {
  assert.equal(escapeHtml('<script>alert("x")</script>'), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  const html = buildPrintableHtml({
    ...INITIAL_DEMO_DECK,
    deckTitle: 'Demo <Safe>',
  });
  assert.ok(html.includes('Demo &lt;Safe&gt;'));
  assert.ok(html.includes('Slide 1 / 6'));
  assert.ok(!html.includes('<script>alert'));
});

test('formatCleanOutlineText produces clean Canva-ready plain text without HTML/JSON', () => {
  const text = formatCleanOutlineText({
    ...INITIAL_DEMO_DECK,
    slides: [
      {
        id: 's1',
        layout: 'title',
        title: '<b>Mở đầu</b>',
        subtitle: 'Tóm tắt ngắn gọn',
        bullets: ['Ý chính 1', 'Ý chính 2'],
        speakerNotes: 'Lời dẫn mở đầu',
      },
    ],
  });

  assert.equal(
    text,
    [
      'Slide 1: Mở đầu',
      '- Tóm tắt ngắn gọn',
      '- Ý chính 1',
      '- Ý chính 2',
      '- Ghi chú thuyết trình: Lời dẫn mở đầu',
    ].join('\n')
  );

  const md = formatCleanOutlineMarkdown(INITIAL_DEMO_DECK);
  assert.ok(md.includes('## Slide 1:'));
  assert.ok(md.includes('> Ghi chú thuyết trình:'));
});
