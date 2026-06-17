import Groq from 'groq-sdk'

export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401 })

  const config = useRuntimeConfig()
  const { text } = await readBody(event)
  if (!text?.trim()) throw createError({ statusCode: 400, message: 'text is required' })

  const groq = new Groq({ apiKey: config.groqApiKey })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content: `Ты — профессиональный копирайтер и редактор сайта украинского производителя спортивных тренажёров OgnevSport.

Клиент присылает сырой текст о товаре — вразброс, с опечатками, без структуры. Твоя задача: понять суть и создать коммерческое описание товара СРАЗУ на трёх языках.

СТРУКТУРА ОТВЕТА — строго этот JSON:
{
  "slug": "...",
  "price": 0,
  "ua": { "name": "...", "shortDesc": "...", "description": "...", "features": ["...", "..."] },
  "ru": { "name": "...", "shortDesc": "...", "description": "...", "features": ["...", "..."] },
  "en": { "name": "...", "shortDesc": "...", "description": "...", "features": ["...", "..."] }
}

ПРАВИЛА ДЛЯ slug И price:
- slug: URL-slug на основе английского названия товара. Только строчные латинские буквы, цифры и дефисы. Без пробелов. Пример: "block-frame-crossover-115kg".
- price: цена в гривнах как целое число. Если клиент написал "52тис", "52 000", "52k" — это 52000. Если "9тис" — 9000. Если цена не указана — верни 0.

ПРАВИЛА ДЛЯ КАЖДОГО ПОЛЯ:
- name: Короткое товарное название (до 70 символов). Только суть — модель, тип, ключевые параметры. Без маркетинга.
- shortDesc: Одно предложение — главная ценность товара. Для каталожной карточки.
- description: Структурированное продающее описание, 2-4 абзаца. Вводный абзац → ключевые конструктивные особенности → варианты комплектации с ценами если есть. Без воды.
- features: Массив строк — конкретные характеристики (материал, размеры, вес нагрузки, покрытие). Каждая строка — один факт. НЕ включай сюда общие фразы.

ЖЕЛЕЗНЫЕ ПРАВИЛА:
- Используй ТОЛЬКО факты из текста клиента. Не выдумывай характеристики, габариты, цены.
- Все цены — в гривнах (грн). Если клиент написал «9тыс» — это «9 000 грн».
- Технические термины переноси дословно (ПВХ, профтруба, барашки, обрезиненные ножки, и т.д.).
- Не добавляй: «высокое качество», «индивидуальный подход», «наши мастера», финальный абзац с пожеланиями.
- UA = украинский язык, RU = русский, EN = английский.

Верни ТОЛЬКО валидный JSON. Без markdown, без пояснений, без блоков \`\`\`.`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
  })

  const raw = completion.choices[0]?.message?.content?.trim() ?? ''

  try {
    return JSON.parse(raw)
  } catch {
    // Try to extract JSON if model added extra text
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw createError({ statusCode: 500, message: 'AI returned invalid JSON', data: raw })
  }
})
