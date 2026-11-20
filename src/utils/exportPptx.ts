import PptxGenJS from 'pptxgenjs';
import type { PresentationDeck } from '../types/slides';
import { getThemeConfig } from './slideLogic';

function hex(color: string): string {
  return color.replace('#', '');
}

export async function exportDeckToPptx(deck: PresentationDeck): Promise<string> {
  const pptx = new PptxGenJS();
  const theme = getThemeConfig(deck.style);

  pptx.layout = 'LAYOUT_16x9';
  pptx.title = deck.deckTitle;
  pptx.subject = deck.topic;
  pptx.author = 'SlideForge AI';

  deck.slides.forEach((slide, index) => {
    const pptSlide = pptx.addSlide();
    const isCover = slide.layout === 'title' || index === 0;

    pptSlide.background = {
      color: hex(isCover ? theme.coverBg : theme.canvasBg),
    };

    const titleColor = hex(isCover ? theme.coverTitleColor : theme.titleColor);
    const subtitleColor = hex(isCover ? theme.coverSubtitleColor : theme.subtitleColor);
    const bodyColor = hex(isCover ? theme.coverSubtitleColor : theme.bodyColor);
    const accentColor = hex(isCover ? theme.coverAccentColor : theme.accentColor);
    const mutedColor = hex(isCover ? theme.coverSubtitleColor : theme.mutedColor);

    // Accent bar at top
    pptSlide.addShape(pptx.ShapeType.rect, {
      x: 0.65,
      y: 0.52,
      w: 0.9,
      h: 0.06,
      fill: { color: accentColor },
      line: { color: accentColor },
    });

    if (isCover) {
      pptSlide.addText(slide.title, {
        x: 0.65,
        y: 1.25,
        w: 8.7,
        h: 1.4,
        fontFace: theme.pptxFontFace,
        fontSize: 32,
        bold: true,
        color: titleColor,
        valign: 'top',
      });

      if (slide.subtitle) {
        pptSlide.addText(slide.subtitle, {
          x: 0.65,
          y: 2.8,
          w: 8.5,
          h: 0.8,
          fontFace: theme.pptxFontFace,
          fontSize: 16,
          color: subtitleColor,
          valign: 'top',
        });
      }

      if (slide.bullets.length > 0) {
        pptSlide.addText(
          slide.bullets.map((b) => ({
            text: b,
            options: { bullet: true, breakLine: true, paraSpaceAfter: 6 },
          })),
          {
            x: 0.65,
            y: 3.85,
            w: 8.5,
            h: 1.1,
            fontFace: theme.pptxFontFace,
            fontSize: 13,
            color: bodyColor,
            valign: 'top',
          }
        );
      }
    } else {
      pptSlide.addText(slide.title, {
        x: 0.65,
        y: 0.72,
        w: 8.7,
        h: 0.65,
        fontFace: theme.pptxFontFace,
        fontSize: 24,
        bold: true,
        color: titleColor,
        valign: 'top',
      });

      if (slide.subtitle) {
        pptSlide.addText(slide.subtitle, {
          x: 0.65,
          y: 1.38,
          w: 8.7,
          h: 0.45,
          fontFace: theme.pptxFontFace,
          fontSize: 13,
          color: subtitleColor,
          valign: 'top',
        });
      }

      if (slide.layout === 'highlight' && slide.highlightStat) {
        // Left stat card + right bullets
        pptSlide.addShape(pptx.ShapeType.roundRect, {
          x: 0.65,
          y: 2.05,
          w: 3.1,
          h: 2.65,
          fill: { color: hex(theme.surfaceBg) },
          line: { color: hex(theme.borderColor), width: 1 },
          rectRadius: 0.08,
        });

        pptSlide.addText(slide.highlightStat, {
          x: 0.85,
          y: 2.45,
          w: 2.7,
          h: 1.1,
          fontFace: theme.pptxFontFace,
          fontSize: 44,
          bold: true,
          color: accentColor,
          align: 'center',
          valign: 'middle',
        });

        pptSlide.addText(slide.subtitle || slide.title, {
          x: 0.85,
          y: 3.65,
          w: 2.7,
          h: 0.8,
          fontFace: theme.pptxFontFace,
          fontSize: 11,
          color: mutedColor,
          align: 'center',
          valign: 'top',
        });

        pptSlide.addText(
          slide.bullets.map((b) => ({
            text: b,
            options: { bullet: true, breakLine: true, paraSpaceAfter: 10 },
          })),
          {
            x: 4.1,
            y: 2.1,
            w: 5.25,
            h: 2.7,
            fontFace: theme.pptxFontFace,
            fontSize: 15,
            color: bodyColor,
            valign: 'top',
          }
        );
      } else if (slide.layout === 'two-column' && slide.bullets.length >= 2) {
        const mid = Math.ceil(slide.bullets.length / 2);
        const leftBullets = slide.bullets.slice(0, mid);
        const rightBullets = slide.bullets.slice(mid);

        pptSlide.addShape(pptx.ShapeType.roundRect, {
          x: 0.65,
          y: 2.0,
          w: 4.15,
          h: 2.85,
          fill: { color: hex(theme.surfaceBg) },
          line: { color: hex(theme.borderColor), width: 1 },
          rectRadius: 0.08,
        });

        pptSlide.addText(
          leftBullets.map((b) => ({
            text: b,
            options: { bullet: true, breakLine: true, paraSpaceAfter: 10 },
          })),
          {
            x: 0.85,
            y: 2.2,
            w: 3.75,
            h: 2.45,
            fontFace: theme.pptxFontFace,
            fontSize: 14,
            color: bodyColor,
            valign: 'top',
          }
        );

        pptSlide.addShape(pptx.ShapeType.roundRect, {
          x: 5.1,
          y: 2.0,
          w: 4.25,
          h: 2.85,
          fill: { color: hex(theme.surfaceBg) },
          line: { color: hex(theme.borderColor), width: 1 },
          rectRadius: 0.08,
        });

        pptSlide.addText(
          rightBullets.map((b) => ({
            text: b,
            options: { bullet: true, breakLine: true, paraSpaceAfter: 10 },
          })),
          {
            x: 5.3,
            y: 2.2,
            w: 3.85,
            h: 2.45,
            fontFace: theme.pptxFontFace,
            fontSize: 14,
            color: bodyColor,
            valign: 'top',
          }
        );
      } else {
        pptSlide.addText(
          slide.bullets.map((b) => ({
            text: b,
            options: { bullet: true, breakLine: true, paraSpaceAfter: 10 },
          })),
          {
            x: 0.65,
            y: 2.05,
            w: 8.7,
            h: 2.85,
            fontFace: theme.pptxFontFace,
            fontSize: 15,
            color: bodyColor,
            valign: 'top',
          }
        );
      }
    }

    // Footer on every slide
    pptSlide.addText(deck.deckTitle, {
      x: 0.65,
      y: 5.18,
      w: 6.5,
      h: 0.3,
      fontFace: theme.pptxFontFace,
      fontSize: 9,
      color: mutedColor,
    });

    pptSlide.addText(`${index + 1} / ${deck.slides.length}`, {
      x: 7.5,
      y: 5.18,
      w: 1.85,
      h: 0.3,
      fontFace: theme.pptxFontFace,
      fontSize: 9,
      color: mutedColor,
      align: 'right',
    });

    if (slide.speakerNotes) {
      pptSlide.addNotes(slide.speakerNotes);
    }
  });

  const safeSlug =
    deck.deckTitle
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 56)
      .replace(/-[^-]*$/, '') || 'slideforge-presentation';

  const fileName = `${safeSlug}.pptx`;
  await pptx.writeFile({ fileName });
  return fileName;
}
