import { OrderIdGenerator } from "./order-id"

interface TelegramMessage {
  chat_id: string
  text: string
  parse_mode?: "HTML" | "Markdown"
}

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  selectedOptions?: {
    color?: string
    size?: string
    storage?: string
    memory?: string
  }
}

interface CustomerData {
  name: string
  phone: string
  email: string
}

interface OrderData {
  orderId: string
  items: CartItem[]
  totalPrice: number
  timestamp: string
  customer: CustomerData
}

export class TelegramService {
  private formatOrderMessage(orderData: OrderData): string {
    const { orderId, items, totalPrice, customer } = orderData

    const orderHeader = `🛍️ <b>Новый заказ из America Express</b>\n📋 <b>Заказ №${orderId}</b>\n\n`

    const customerInfo =
      `👤 <b>Данные клиента:</b>\n` +
      `   📝 Имя: <b>${customer.name}</b>\n` +
      `   📞 Телефон: <b>${customer.phone}</b>\n` +
      `   📧 Email: <b>${customer.email}</b>\n\n`

    const itemsList =
      `🛒 <b>Товары:</b>\n` +
      items
        .map((item, index) => {
          let itemText = `${index + 1}. <b>${item.name}</b>\n`
          itemText += `   💰 $${item.price} × ${item.quantity} = <b>$${item.price * item.quantity}</b>\n`

          if (item.selectedOptions) {
            const options = []
            if (item.selectedOptions.color) options.push(`🎨 ${item.selectedOptions.color}`)
            if (item.selectedOptions.size) options.push(`📏 ${item.selectedOptions.size}`)
            if (item.selectedOptions.storage) options.push(`💾 ${item.selectedOptions.storage}`)
            if (item.selectedOptions.memory) options.push(`🧠 ${item.selectedOptions.memory}`)

            if (options.length > 0) {
              itemText += `   📋 ${options.join(" | ")}\n`
            }
          }

          return itemText
        })
        .join("\n")

    const orderFooter =
      `\n💵 <b>Итого: $${totalPrice}</b>\n` + `📦 <i>+ доставка из США (рассчитается отдельно)</i>\n\n`

    const timestamp = `📅 ${new Date().toLocaleString("ru-RU", {
      timeZone: "Europe/Moscow",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })}`

    return orderHeader + customerInfo + itemsList + orderFooter + timestamp
  }

  async sendOrderWithCustomerData(
    items: CartItem[],
    totalPrice: number,
    customerData: CustomerData,
  ): Promise<{ success: boolean; error?: string; orderId?: string }> {
    try {
      // Генерируем уникальный ID заказа
      const orderId = OrderIdGenerator.generateOrderId()
      console.log(`🆔 Новый заказ с ID: ${orderId}`)

      const orderData: OrderData = {
        orderId,
        items,
        totalPrice,
        timestamp: new Date().toISOString(),
        customer: customerData,
      }

      const message = this.formatOrderMessage(orderData)

      const response = await fetch("/api/telegram/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderData,
          message,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Ошибка отправки заказа")
      }

      console.log(`✅ Заказ ${orderId} успешно отправлен`)
      return { success: true, orderId }
    } catch (error) {
      console.error("❌ Ошибка отправки заказа:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Неизвестная ошибка",
      }
    }
  }

  async sendOrder(
    items: CartItem[],
    totalPrice: number,
  ): Promise<{ success: boolean; error?: string; orderId?: string }> {
    // Этот метод больше не используется, оставляем для совместимости
    throw new Error("Используйте sendOrderWithCustomerData вместо sendOrder")
  }

  async sendTestMessage(): Promise<{ success: boolean; error?: string }> {
    if (!process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || !process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID) {
      return {
        success: false,
        error: "Telegram не настроен",
      }
    }

    try {
      const testOrderId = OrderIdGenerator.generateServerOrderId()
      const message: TelegramMessage = {
        chat_id: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID,
        text: `🧪 <b>Тестовое сообщение</b>\n📋 <b>Тест №${testOrderId}</b>\n\nTelegram интеграция работает корректно!`,
        parse_mode: "HTML",
      }

      const response = await fetch(
        `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        },
      )

      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.description || "Ошибка отправки тестового сообщения")
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Неизвестная ошибка",
      }
    }
  }
}

export const telegramService = new TelegramService()
