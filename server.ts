import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const MODEL_NAME = 'gemini-4-hydrogen';

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY chưa được cấu hình trên máy chủ.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const status = (err as { status?: number })?.status;
      const isRetryable = status === 429 || (typeof status === 'number' && status >= 500);
      if (!isRetryable || attempt === maxAttempts) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 400 * Math.pow(2, attempt - 1)));
    }
  }
  throw lastError;
}

const STYLE_LABELS: Record<string, string> = {
  modern: 'Hiện đại, chuyên nghiệp, súc tích hướng hành động',
  academic: 'Học thuật, chặt chẽ, có dẫn chứng và lập luận logic',
  minimal: 'Tối giản, cô đọng tối đa, mỗi ý một thông điệp rõ ràng',
  dynamic: 'Năng động, giàu sức thuyết phục, nhấn mạnh số liệu và điểm nhấn nổi bật',
};

function sanitizeJsonText(raw: string | undefined): string {
  const trimmed = (raw ?? '{}').trim();
  if (trimmed.startsWith('```')) {
    return trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }
  return trimmed;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, model: MODEL_NAME });
  });

  app.post('/api/slides/generate', async (req, res) => {
    try {
      const { topic, audience, slideCount, style, language } = req.body ?? {};
      const cleanTopic = typeof topic === 'string' ? topic.trim() : '';
      if (cleanTopic.length < 3) {
        res.status(400).json({ error: 'Vui lòng nhập chủ đề từ 3 ký tự trở lên.' });
        return;
      }

      const count = Math.min(12, Math.max(5, Math.round(Number(slideCount) || 7)));
      const cleanAudience =
        typeof audience === 'string' && audience.trim().length > 0
          ? audience.trim()
          : language === 'en'
            ? 'Executive & General Audience'
            : 'Người nghe chuyên môn và quản lý';
      const cleanStyle = typeof style === 'string' && STYLE_LABELS[style] ? style : 'modern';
      const langLabel = language === 'en' ? 'English' : 'Tiếng Việt';

      const ai = getAiClient();
      const response = await withRetry(() =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: [
            `Hãy xây dựng một bài trình chiếu hoàn chỉnh gồm đúng ${count} slide.`,
            `Chủ đề: ${cleanTopic}`,
            `Đối tượng người nghe: ${cleanAudience}`,
            `Phong cách trình bày: ${STYLE_LABELS[cleanStyle]}`,
            `Ngôn ngữ toàn bộ nội dung slide và ghi chú thuyết trình: ${langLabel}.`,
            'Yêu cầu cấu trúc:',
            '- Slide 1 bắt buộc có layout = "title" (trang bìa mở đầu ấn tượng).',
            '- Các slide tiếp theo phân bổ hợp lý giữa các layout: "bullets", "two-column", và "highlight" (có highlightStat ngắn như "42%", "3x", "90 ngày" khi dùng layout highlight).',
            '- Mỗi slide có 3 đến 4 gạch đầu dòng súc tích (dưới 18 từ mỗi ý), không lan man.',
            '- Mỗi slide có ghi chú thuyết trình (speakerNotes) tự nhiên khoảng 2-3 câu cho người nói.',
          ].join('\n'),
          config: {
            systemInstruction:
              'Bạn là chuyên gia thiết kế bài trình chiếu và cấu trúc nội dung điều hành cấp cao. Luôn trả về JSON hợp lệ đúng theo schema, ngôn ngữ chuẩn xác, giàu giá trị thực tiễn.',
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                deckTitle: {
                  type: Type.STRING,
                  description: 'Tiêu đề tổng thể của bộ slide.',
                },
                slides: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      layout: {
                        type: Type.STRING,
                        description: 'Một trong bốn giá trị: title, bullets, two-column, highlight.',
                      },
                      title: {
                        type: Type.STRING,
                        description: 'Tiêu đề chính ngắn gọn của slide.',
                      },
                      subtitle: {
                        type: Type.STRING,
                        description: 'Tiêu đề phụ tóm tắt thông điệp chính.',
                      },
                      highlightStat: {
                        type: Type.STRING,
                        description: 'Con số hoặc từ khóa nổi bật ngắn (chỉ điền khi layout là highlight).',
                      },
                      bullets: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: '3-4 gạch đầu dòng súc tích.',
                      },
                      speakerNotes: {
                        type: Type.STRING,
                        description: 'Ghi chú thuyết trình chi tiết cho người nói.',
                      },
                    },
                    required: ['layout', 'title', 'subtitle', 'bullets', 'speakerNotes'],
                  },
                },
              },
              required: ['deckTitle', 'slides'],
            },
          },
        })
      );

      const parsed = JSON.parse(sanitizeJsonText(response.text));
      res.json(parsed);
    } catch (error) {
      console.error('Error generating presentation:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể kết nối tới dịch vụ tạo slide. Vui lòng thử lại.';
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/slides/regenerate', async (req, res) => {
    try {
      const { deckTitle, topic, audience, style, language, slideIndex, totalSlides, currentSlide, instruction } =
        req.body ?? {};

      if (!currentSlide || typeof currentSlide.title !== 'string') {
        res.status(400).json({ error: 'Thiếu thông tin slide hiện tại để tạo lại.' });
        return;
      }

      const langLabel = language === 'en' ? 'English' : 'Tiếng Việt';
      const cleanStyle = typeof style === 'string' && STYLE_LABELS[style] ? style : 'modern';

      const ai = getAiClient();
      const response = await withRetry(() =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: [
            `Hãy viết lại và nâng cấp chất lượng cho Slide ${Number(slideIndex) + 1}/${totalSlides || 1} trong bài trình chiếu.`,
            `Tiêu đề bộ slide: ${deckTitle || topic}`,
            `Đối tượng người nghe: ${audience || 'Người nghe chuyên môn'}`,
            `Phong cách: ${STYLE_LABELS[cleanStyle]}`,
            `Ngôn ngữ: ${langLabel}`,
            `Slide hiện tại: ${JSON.stringify(currentSlide)}`,
            instruction ? `Yêu cầu bổ sung của người dùng: ${instruction}` : 'Hãy làm nội dung sắc bén, mới mẻ và thuyết phục hơn.',
            Number(slideIndex) === 0
              ? 'Lưu ý: Đây là slide đầu tiên nên layout bắt buộc là "title".'
              : 'Có thể chọn layout phù hợp nhất trong: "bullets", "two-column", "highlight".',
          ].join('\n'),
          config: {
            systemInstruction:
              'Bạn là chuyên gia biên tập bài trình chiếu. Trả về đúng 1 đối tượng JSON slide hợp lệ theo schema.',
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                layout: { type: Type.STRING },
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                highlightStat: { type: Type.STRING },
                bullets: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                speakerNotes: { type: Type.STRING },
              },
              required: ['layout', 'title', 'subtitle', 'bullets', 'speakerNotes'],
            },
          },
        })
      );

      const parsed = JSON.parse(sanitizeJsonText(response.text));
      res.json(parsed);
    } catch (error) {
      console.error('Error regenerating slide:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể tạo lại slide này lúc này. Vui lòng thử lại.';
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('/{*splat}', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SlideForge AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
