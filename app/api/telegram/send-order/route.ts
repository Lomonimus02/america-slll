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
    const chatId = normaliseChatId(process.env.TELEGRAM_CHAT_ID)

    if (!botToken || !chatId) {
      return NextResponse.json({ error: "Telegram не настроен на сервере" }, { status: 500 })
    }

    const telegramMessage: TelegramMessage = {
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(telegramMessage),
    })

    const data = await response.json()

    if (!response.ok || !data.ok) {
      const tgError = data.description ?? "Unknown Telegram API error"
      console.error("Telegram API Error:", tgError)

      // Логируем неудачный заказ
      console.log("Failed order:", {
        orderId: orderData.orderId,
        error: tgError,
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json(
        {
          error: tgError,
          hint: tgError.includes("chat not found")
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
    })

    return NextResponse.json({
      success: true,
      orderId: orderData.orderId,
    })
  } catch (error) {
    console.error("Send order error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Ошибка сервера" }, { status: 500 })
  }
}
