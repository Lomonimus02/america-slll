import { NextRequest, NextResponse } from "next/server"

interface TelegramMessage {
  chat_id: string
  text: string
  parse_mode?: "HTML" | "Markdown"
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Сообщение не может быть пустым" }, { status: 400 })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId1 = process.env.TELEGRAM_CHAT_ID
    const chatId2 = "7787429894" // Второй аккаунт

    if (!botToken || !chatId1) {
      console.error("❌ Telegram переменные не настроены")
      return NextResponse.json({ error: "Telegram не настроен" }, { status: 500 })
    }

    // Массив чатов для отправки
    const chatIds = [chatId1, chatId2]
    const results = []

    console.log(`📤 Отправляем сообщение в ${chatIds.length} чатов...`)

    // Отправляем сообщение в каждый чат
    for (const chatId of chatIds) {
      const telegramMessage: TelegramMessage = {
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }

      try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(telegramMessage),
        })

        const data = await response.json()

        if (!response.ok || !data.ok) {
          console.error(`❌ Ошибка Telegram API для чата ${chatId}:`, data)
          results.push({ chatId, success: false, error: data.description || "Ошибка отправки сообщения" })
        } else {
          console.log(`✅ Сообщение успешно отправлено в чат ${chatId}`)
          results.push({ chatId, success: true })
        }
      } catch (error) {
        console.error(`❌ Ошибка отправки в чат ${chatId}:`, error)
        results.push({ chatId, success: false, error: error instanceof Error ? error.message : "Unknown error" })
      }
    }

    // Проверяем результаты
    const successfulSends = results.filter(r => r.success)
    const failedSends = results.filter(r => !r.success)

    if (successfulSends.length === 0) {
      // Если ни одна отправка не удалась
      const firstError = failedSends[0]?.error || "Ошибка отправки сообщения"
      throw new Error(firstError)
    }

    if (failedSends.length > 0) {
      console.warn("Некоторые чаты не получили сообщение:", failedSends)
    }

    console.log(`✅ Сообщение успешно отправлено в ${successfulSends.length} из ${chatIds.length} чатов`)
    return NextResponse.json({
      success: true,
      sentToChats: successfulSends.length,
      failedChats: failedSends.length
    })
  } catch (error) {
    console.error("❌ Ошибка отправки сообщения:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Неизвестная ошибка" },
      { status: 500 }
    )
  }
}
