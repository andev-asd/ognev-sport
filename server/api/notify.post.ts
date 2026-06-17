// server/api/notify.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { name, phone, method, message } = body

  if (!config.telegramBotToken || !config.telegramChatId) {
    // Silently skip if not configured (dev environment)
    return { ok: true, skipped: true }
  }

  const text = [
    `📋 *Нова заявка OgnevSport*`,
    `👤 Ім'я: ${name}`,
    `📞 Телефон: ${phone}`,
    `💬 Спосіб зв'язку: ${method}`,
    message ? `📝 Повідомлення: ${message}` : null,
  ].filter(Boolean).join('\n')

  const url = `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`

  try {
    await $fetch(url, {
      method: 'POST',
      body: {
        chat_id: config.telegramChatId,
        text,
        parse_mode: 'Markdown',
      },
    })
  } catch (err) {
    // Log but don't throw — notification is non-critical
    console.error('Telegram notify error:', err)
  }

  return { ok: true }
})
