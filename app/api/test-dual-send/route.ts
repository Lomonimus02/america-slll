import { NextRequest, NextResponse } from "next/server"

interface TelegramMessage {
  chat_id: string | number
  text: string
  parse_mode: "HTML"
}

function normaliseChatId(raw: string | undefined): string | number | undefined {
  if (!raw) return undefined
  // channel usernames or @my_channel are left intact
  if (raw.startsWith("@")) return raw
  // numeric strings → numbers (-100123… for groups or 123456 for users)
  const numeric = Number(raw)
  return Number.isNaN(numeric) ? raw : numeric
}

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 Тестируем отправку в оба аккаунта...")

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId1 = normaliseChatId(process.env.TELEGRAM_CHAT_ID)
    const chatId2 = 7787429894 // Второй аккаунт

    console.log("🔍 Debug info:")
    console.log("Bot token exists:", !!botToken)
    console.log("Chat ID 1:", chatId1)
    console.log("Chat ID 2:", chatId2)

    if (!botToken || !chatId1) {
      return NextResponse.json({ error: "Telegram не настроен на сервере" }, { status: 500 })
    }

    const testMessage = `🧪 <b>Тестовое сообщение</b>

Проверяем отправку в оба аккаунта
Время: ${new Date().toLocaleString('ru-RU')}
ID чата: {CHAT_ID}`

    // Массив чатов для отправки
    const chatIds = [chatId1, chatId2]
    const results = []

    console.log("📤 Начинаем отправку в чаты:", chatIds)

    // Отправляем сообщение в каждый чат
    for (const chatId of chatIds) {
      console.log(`🎯 Отправляем тестовое сообщение в чат: ${chatId}`)
      
      const telegramMessage: TelegramMessage = {
        chat_id: chatId,
        text: testMessage.replace('{CHAT_ID}', String(chatId)),
        parse_mode: "HTML",
      }

      try {
        console.log(`📡 Делаем запрос к Telegram API для чата ${chatId}`)
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(telegramMessage),
        })

        const data = await response.json()
        console.log(`📥 Ответ от Telegram API для чата ${chatId}:`, JSON.stringify(data, null, 2))

        if (!response.ok || !data.ok) {
          const tgError = data.description ?? "Unknown Telegram API error"
          console.error(`❌ Telegram API Error for chat ${chatId}:`, tgError)
          results.push({ chatId, success: false, error: tgError })
        } else {
          console.log(`✅ Test message sent successfully to chat ${chatId}`)
          results.push({ chatId, success: true })
        }
      } catch (error) {
        console.error(`❌ Error sending to chat ${chatId}:`, error)
        results.push({ chatId, success: false, error: error instanceof Error ? error.message : "Unknown error" })
      }
    }

    // Проверяем результаты
    const successfulSends = results.filter(r => r.success)
    const failedSends = results.filter(r => !r.success)

    console.log("📊 Результаты тестовой отправки:")
    console.log("Успешно:", successfulSends)
    console.log("Неудачно:", failedSends)

    return NextResponse.json({
      success: true,
      results: results,
      successfulSends: successfulSends.length,
      failedSends: failedSends.length,
    })
  } catch (error) {
    console.error("❌ Test dual send error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Ошибка сервера" }, { status: 500 })
  }
}
