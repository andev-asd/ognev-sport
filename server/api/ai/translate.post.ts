import Groq from 'groq-sdk'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { text, sourceLang, field } = await readBody(event)

  if (!text || !sourceLang) throw createError({ statusCode: 400, message: 'text and sourceLang required' })

  const groq = new Groq({ apiKey: config.groqApiKey })

  const langNames: Record<string, string> = { ua: 'украинский', ru: 'русский', en: 'английский' }
  const targetLangs = (['ua', 'ru', 'en'] as const).filter(l => l !== sourceLang)

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `Ты профессиональный переводчик для B2B-сайта производителя спортивного оборудования OgnevSport.
Исходный язык: ${langNames[sourceLang] ?? sourceLang}.
Поле: ${field ?? 'text'}.
Переведи текст на ${targetLangs.map(l => langNames[l]).join(' и ')}.
Сохрани профессиональный тон и спортивную терминологию.
Верни ТОЛЬКО валидный JSON без markdown-блоков с ключами для всех трёх языков: {"ua": "...", "ru": "...", "en": "..."}`,
      },
      { role: 'user', content: text },
    ],
    temperature: 0.3,
    max_tokens: 2048,
    response_format: { type: 'json_object' },
  })

  const raw = completion.choices[0].message.content ?? '{}'
  const result = JSON.parse(raw)

  return {
    ua: sanitizeTerms(result.ua ?? (sourceLang === 'ua' ? text : '')),
    ru: sanitizeTerms(result.ru ?? (sourceLang === 'ru' ? text : '')),
    en: sanitizeTerms(result.en ?? (sourceLang === 'en' ? text : '')),
  }
})
