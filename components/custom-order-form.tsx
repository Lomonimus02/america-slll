"use client"

import { useState } from "react"
import { Send, MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { telegramService } from "@/lib/telegram"

export function CustomOrderForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    contactMethod: "",
    name: "",
    telegramNick: "",
    phoneNumber: "",
    request: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.contactMethod || !formData.name || !formData.request) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive"
      })
      return
    }

    if (formData.contactMethod === "telegram" && !formData.telegramNick) {
      toast({
        title: "Ошибка", 
        description: "Пожалуйста, укажите ник в Telegram",
        variant: "destructive"
      })
      return
    }

    if (formData.contactMethod === "whatsapp" && !formData.phoneNumber) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, укажите номер телефона для WhatsApp",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const message = `🛍️ ИНДИВИДУАЛЬНЫЙ ЗАКАЗ

👤 Имя: ${formData.name}
📞 Способ связи: ${formData.contactMethod === "telegram" ? "Telegram" : "WhatsApp"}
${formData.contactMethod === "telegram" ? `📱 Telegram: @${formData.telegramNick}` : `📱 WhatsApp: ${formData.phoneNumber}`}

📝 Запрос:
${formData.request}

⏰ Дата: ${new Date().toLocaleString("ru-RU")}`

      await telegramService.sendMessage(message)
      
      toast({
        title: "Заказ отправлен!",
        description: "Мы свяжемся с вами в ближайшее время"
      })

      // Очистка формы
      setFormData({
        contactMethod: "",
        name: "",
        telegramNick: "",
        phoneNumber: "",
        request: ""
      })
    } catch (error) {
      console.error("Ошибка отправки:", error)
      toast({
        title: "Ошибка отправки",
        description: "Попробуйте еще раз или свяжитесь с нами напрямую",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in-up dark:bg-gray-800/50 dark:border-gray-700">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Заказать что-то другое
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Не нашли нужный товар? Опишите что вам нужно, и мы постараемся найти это в США
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactMethod">Способ связи *</Label>
            <Select value={formData.contactMethod} onValueChange={(value) => handleInputChange("contactMethod", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите способ связи" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="telegram">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Telegram
                  </div>
                </SelectItem>
                <SelectItem value="whatsapp">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    WhatsApp
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Имя *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ваше имя"
              required
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {formData.contactMethod === "telegram" && (
            <div className="space-y-2">
              <Label htmlFor="telegramNick">Ник в Telegram *</Label>
              <Input
                id="telegramNick"
                value={formData.telegramNick}
                onChange={(e) => handleInputChange("telegramNick", e.target.value)}
                placeholder="Без символа @"
                required
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          )}

          {formData.contactMethod === "whatsapp" && (
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Номер телефона *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder="+7 (999) 123-45-67"
                required
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="request">Что вам нужно? *</Label>
            <Textarea
              id="request"
              value={formData.request}
              onChange={(e) => handleInputChange("request", e.target.value)}
              placeholder="Опишите подробно что вам нужно: название товара, бренд, модель, размер, цвет и другие важные детали..."
              required
              rows={4}
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-950 text-white transition-all duration-200 hover:scale-105"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Отправляем..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Отправить запрос
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
