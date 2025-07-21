import { type NextRequest, NextResponse } from "next/server"

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
    const { orderData, message } = await request.json()

    // Серверные переменные окружения (без NEXT_PUBLIC_)
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

    // Массив чатов для отправки
    const chatIds = [chatId1, chatId2]
    const results = []

    console.log("📤 Начинаем отправку в чаты:", chatIds)

    // Отправляем сообщение в каждый чат
    for (const chatId of chatIds) {
      console.log(`🎯 Отправляем сообщение в чат: ${chatId}`)

      const telegramMessage: TelegramMessage = {
        chat_id: chatId,
        text: message,
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
        console.log(`📥 Ответ от Telegram API для чата ${chatId}:`, data)

        if (!response.ok || !data.ok) {
          const tgError = data.description ?? "Unknown Telegram API error"
          console.error(`❌ Telegram API Error for chat ${chatId}:`, tgError)
          results.push({ chatId, success: false, error: tgError })
        } else {
          console.log(`✅ Message sent successfully to chat ${chatId}`)
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

    if (successfulSends.length === 0) {
      // Если ни одна отправка не удалась
      const firstError = failedSends[0]?.error || "Unknown error"
      console.log("Failed order (all chats failed):", {
        orderId: orderData.orderId,
        error: firstError,
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json(
        {
          error: firstError,
          hint: firstError.includes("chat not found")
            ? "Проверьте chat ID и убедитесь, что вы нажали /start боту (или добавили его в группу)."
            : undefined,
        },
        { status: 400 },
      )
    }

    // Логируем успешный заказ
    console.log("Order sent successfully:", {
      orderId: orderData.orderId,
      totalPrice: orderData.totalPrice,
      itemsCount: orderData.items.length,
      timestamp: orderData.timestamp,
      successfulChats: successfulSends.length,
      failedChats: failedSends.length,
    })

    if (failedSends.length > 0) {
      console.warn("Some chats failed:", failedSends)
    }

    return NextResponse.json({
      success: true,
      orderId: orderData.orderId,
      sentToChats: successfulSends.length,
      failedChats: failedSends.length,
    })
  } catch (error) {
    console.error("Send order error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Ошибка сервера" }, { status: 500 })
  }
}
