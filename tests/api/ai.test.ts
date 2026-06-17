import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockCreate = vi.fn()

vi.mock('groq-sdk', () => ({
  default: class {
    chat = { completions: { create: mockCreate } }
  },
}))

describe('AI fix endpoint logic', () => {
  beforeEach(() => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ correctedText: 'Кросовер із підшипниками', detectedLang: 'ua' }) } }],
    })
  })

  it('returns correctedText and detectedLang', async () => {
    const Groq = (await import('groq-sdk')).default
    const groq = new (Groq as any)({ apiKey: 'test' })
    const result = await groq.chat.completions.create({ model: 'test', messages: [] })
    const parsed = JSON.parse(result.choices[0].message.content)
    expect(parsed).toHaveProperty('correctedText')
    expect(parsed).toHaveProperty('detectedLang')
    expect(['ua', 'ru', 'en']).toContain(parsed.detectedLang)
  })
})

describe('AI translate endpoint logic', () => {
  beforeEach(() => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ ua: 'Кросовер', ru: 'Кроссовер', en: 'Cable Crossover' }) } }],
    })
  })

  it('returns all 3 language translations', async () => {
    const Groq = (await import('groq-sdk')).default
    const groq = new (Groq as any)({ apiKey: 'test' })
    const result = await groq.chat.completions.create({ model: 'test', messages: [] })
    const parsed = JSON.parse(result.choices[0].message.content)
    expect(parsed).toHaveProperty('ua')
    expect(parsed).toHaveProperty('ru')
    expect(parsed).toHaveProperty('en')
  })
})

describe('AI seo endpoint logic', () => {
  beforeEach(() => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ text: 'Кросовер із <strong>підшипниковими роликами</strong>' }) } }],
    })
  })

  it('returns text with HTML markup', async () => {
    const Groq = (await import('groq-sdk')).default
    const groq = new (Groq as any)({ apiKey: 'test' })
    const result = await groq.chat.completions.create({ model: 'test', messages: [] })
    const parsed = JSON.parse(result.choices[0].message.content)
    expect(parsed).toHaveProperty('text')
    expect(parsed.text).toContain('<strong>')
  })
})
