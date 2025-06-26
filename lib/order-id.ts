// Генератор уникальных ID заказов
export class OrderIdGenerator {
  private static getStoredCounter(): number {
    if (typeof window === "undefined") return 1
    const stored = localStorage.getItem("america_express_order_counter")
    return stored ? Number.parseInt(stored, 10) : 1
  }

  private static setStoredCounter(counter: number): void {
    if (typeof window === "undefined") return
    localStorage.setItem("america_express_order_counter", counter.toString())
  }

  static generateOrderId(): string {
    const counter = this.getStoredCounter()
    const date = new Date()

    // Формат: AE-YYYYMMDD-XXX (AE = America Express)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const orderNumber = String(counter).padStart(3, "0")

    const orderId = `AE-${year}${month}${day}-${orderNumber}`

    // ВАЖНО: Увеличиваем счетчик ПОСЛЕ создания ID
    this.setStoredCounter(counter + 1)

    console.log(`🆔 Сгенерирован orderId: ${orderId}, следующий счетчик: ${counter + 1}`)

    return orderId
  }

  // Альтернативный метод для серверной генерации с timestamp
  static generateServerOrderId(): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    const date = new Date()
    const dateStr =
      date.getFullYear().toString().slice(-2) +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0")

    return `AE-${dateStr}-${timestamp.toString().slice(-6)}-${random}`
  }

  // Метод для сброса счетчика (для тестирования)
  static resetCounter(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("america_express_order_counter")
      console.log("🔄 Счетчик заказов сброшен")
    }
  }

  // Метод для получения текущего счетчика (для отладки)
  static getCurrentCounter(): number {
    return this.getStoredCounter()
  }
}
