import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      return NextResponse.json({ error: "Telegram переменные не настроены на сервере" }, { status: 500 })
    }

    const testMessage = {
      chat_id: chatId,
      text:
        "🧪 <b>Тестовое сообщение</b>\n\nTelegram интеграция работает корректно!\n\n📅 " +
        new Date().toLocaleString("ru-RU"),
      parse_mode: "HTML" as const,
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testMessage),
    })

    const data = await response.json()

    if (!response.ok || !data.ok) {
      throw new Error(data.description || "Ошибка Telegram API")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Test message error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Ошибка сервера" }, { status: 500 })
  }
}
