import Groq from 'groq-sdk'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { ua, ru, en } = await readBody(event)

  if (!ua && !ru && !en) throw createError({ statusCode: 400, message: 'At least one text required' })

  const groq = new Groq({ apiKey: config.groqApiKey })

  const addSeoMarkup = async (text: string, langName: string): Promise<string> => {
    if (!text) return text
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Добавь минимальную семантическую HTML-разметку в описание товара на ${langName}.
Правила:
- <strong> для ключевых технических характеристик (материалы, параметры, уникальные свойства)
- <em> для важных уточнений или пояснений
- НЕ добавляй заголовки h1-h6, списки ul/ol, div, span, class или style атрибуты
- Максимум 3-4 выделения на весь текст, не перегружай
- Сохрани все слова, структуру абзацев и переносы строк
Верни ТОЛЬКО валидный JSON без markdown-блоков: {"text": "..."}`,
        },
        { role: 'user', content: text },
      ],
      temperature: 0.2,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    })
    const raw = completion.choices[0].message.content ?? '{}'
    return JSON.parse(raw).text ?? text
  }

  const [uaResult, ruResult, enResult] = await Promise.all([
    addSeoMarkup(ua ?? '', 'украинском языке'),
    addSeoMarkup(ru ?? '', 'русском языке'),
    addSeoMarkup(en ?? '', 'английском языке'),
  ])

  return {
    ua: sanitizeTerms(uaResult),
    ru: sanitizeTerms(ruResult),
    en: sanitizeTerms(enResult),
  }
})
