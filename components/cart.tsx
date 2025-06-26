"use client"

import { useState } from "react"
import { X, Minus, Plus, Send, Copy, CheckCircle, User, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { telegramService } from "@/lib/telegram"

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

interface CustomerData {
  name: string
  phone: string
  email: string
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart()
  const { toast } = useToast()
  const [isSending, setIsSending] = useState(false)
  const [lastOrderId, setLastOrderId] = useState<string | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    phone: "",
    email: "",
  })

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Корзина пуста",
        description: "Добавьте товары в корзину перед оформлением заказа",
        variant: "destructive",
      })
      return
    }
    setShowCheckout(true)
  }

  const handleSendToTelegram = async () => {
    // Простая проверка
    if (!customerData.name || !customerData.phone || !customerData.email) {
      toast({
        title: "Заполните все поля",
        description: "Все поля обязательны для заполнения",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      const result = await telegramService.sendOrderWithCustomerData(items, getTotalPrice(), customerData)

      if (result.success && result.orderId) {
        setLastOrderId(result.orderId)
        toast({
          title: "✅ Заказ отправлен!",
          description: `Заказ №${result.orderId} успешно отправлен. Мы свяжемся с вами в ближайшее время.`,
          duration: 5000,
        })
        clearCart()
        setShowCheckout(false)
        setCustomerData({ name: "", phone: "", email: "" })
      } else {
        toast({
          title: "❌ Ошибка отправки",
          description: result.error || "Не удалось отправить заказ. Попробуйте позже.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Произошла ошибка при отправке заказа.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const copyOrderId = () => {
    if (lastOrderId) {
      navigator.clipboard.writeText(lastOrderId)
      toast({
        title: "Скопировано",
        description: "Номер заказа скопирован в буфер обмена",
      })
    }
  }

  const handleClose = () => {
    setLastOrderId(null)
    setShowCheckout(false)
    onClose()
  }

  const getItemId = (item: any) => {
    return `${item.id}-${JSON.stringify(item.selectedOptions || {})}`
  }

  const formatOptions = (options: any) => {
    if (!options) return null

    const optionsList = []
    if (options.color) optionsList.push(`Цвет: ${options.color}`)
    if (options.size) optionsList.push(`Размер: ${options.size}`)
    if (options.storage) optionsList.push(`Память: ${options.storage}`)
    if (options.memory) optionsList.push(`ОЗУ: ${options.memory}`)

    return optionsList.length > 0 ? optionsList.join(", ") : null
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Корзина</SheetTitle>
          <SheetDescription>Ваши товары для заказа из Америки</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Показываем номер заказа после успешной отправки */}
          {lastOrderId && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Заказ успешно отправлен!</p>
                    <p className="text-sm">
                      Номер заказа: <span className="font-mono font-bold">{lastOrderId}</span>
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={copyOrderId}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex-1 overflow-y-auto py-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                {lastOrderId ? (
                  <div>
                    <p className="text-gray-500 mb-4">Заказ отправлен!</p>
                    <p className="text-sm text-gray-600 mb-4">
                      Сохраните номер заказа: <span className="font-mono font-bold">{lastOrderId}</span>
                    </p>
                    <Button variant="outline" onClick={handleClose}>
                      Продолжить покупки
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-500 mb-4">Корзина пуста</p>
                    <Button variant="outline" onClick={handleClose}>
                      Продолжить покупки
                    </Button>
                  </div>
                )}
              </div>
            ) : showCheckout ? (
              // Форма оформления заказа
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Оформление заказа</h3>
                <p className="text-sm text-gray-600">Заполните ваши контактные данные для оформления заказа:</p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customer-name">Имя *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="customer-name"
                        placeholder="Ваше имя"
                        value={customerData.name}
                        onChange={(e) => setCustomerData((prev) => ({ ...prev, name: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customer-phone">Телефон *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="customer-phone"
                        placeholder="+7 (999) 123-45-67"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customer-email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="customer-email"
                        type="email"
                        placeholder="email@example.com"
                        value={customerData.email}
                        onChange={(e) => setCustomerData((prev) => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Ваш заказ:</h4>
                  {items.map((item) => {
                    const itemId = getItemId(item)
                    const optionsText = formatOptions(item.selectedOptions)

                    return (
                      <div key={itemId} className="flex justify-between text-sm">
                        <div>
                          <span>{item.name}</span>
                          {optionsText && <div className="text-xs text-gray-500">{optionsText}</div>}
                        </div>
                        <span>
                          ${item.price} × {item.quantity} = ${item.price * item.quantity}
                        </span>
                      </div>
                    )
                  })}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Итого:</span>
                    <span>${getTotalPrice()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowCheckout(false)} className="flex-1">
                    Назад к корзине
                  </Button>
                  <Button type="button" onClick={handleSendToTelegram} disabled={isSending} className="flex-1">
                    {isSending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Отправляем...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Оформить заказ
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              // Список товаров в корзине
              <div className="space-y-4">
                {items.map((item) => {
                  const itemId = getItemId(item)
                  const optionsText = formatOptions(item.selectedOptions)

                  return (
                    <Card key={itemId}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{item.name}</h3>
                            {optionsText && <p className="text-xs text-gray-500 mt-1">{optionsText}</p>}
                            <p className="text-sm text-gray-600 mt-1">${item.price}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeItem(itemId)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(itemId, Math.max(0, item.quantity - 1))}
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Badge variant="secondary" className="min-w-[24px] text-center">
                                {item.quantity}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(itemId, item.quantity + 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {items.length > 0 && !showCheckout && (
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Товары ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>${getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Доставка из США</span>
                  <span>Рассчитается отдельно</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Итого</span>
                  <span>${getTotalPrice()}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handleProceedToCheckout}>
                Оформить заказ
              </Button>

              <p className="text-xs text-gray-500 text-center">
                При оформлении заказа потребуется указать контактные данные
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
