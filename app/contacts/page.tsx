"use client"

import { Phone, Mail, MessageCircle, Clock, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/header"
import { Cart } from "@/components/cart"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ContactsPage() {
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { items } = useCart()
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          data: {
            name: formData.name,
            email: formData.email,
            message: formData.message
          }
        }),
      })

      if (response.ok) {
        toast({
          title: "Сообщение отправлено!",
          description: "Мы получили ваше сообщение и свяжемся с вами в ближайшее время.",
        })
        setFormData({ name: "", email: "", message: "" })
      } else {
        throw new Error('Ошибка отправки')
      }
    } catch (error) {
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение. Попробуйте еще раз.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const scrollToProducts = () => {
    router.push("/#products")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <Header
        totalItems={totalItems}
        onCartClick={() => setIsCartOpen(true)}
        onProductsClick={scrollToProducts}
        subtitle="Контакты"
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              контакты
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="animate-fade-in-up dark:bg-gray-800/50 dark:border-gray-700" style={{ animationDelay: "200ms" }}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 dark:text-white">Lorem Ipsum</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        Lorem ipsum dolor sit amet consectetur
                      </p>
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400">
                        @lorem_ipsum
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in-up dark:bg-gray-800/50 dark:border-gray-700" style={{ animationDelay: "300ms" }}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 dark:text-white">Sed Do Eiusmod</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        Tempor incididunt ut labore et dolore
                      </p>
                      <a
                        href="mailto:lorem@ipsum.com"
                        className="text-green-600 dark:text-green-400 hover:underline"
                      >
                        lorem@ipsum.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in-up dark:bg-gray-800/50 dark:border-gray-700" style={{ animationDelay: "400ms" }}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                      <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 dark:text-white">Ut Enim Ad Minim</h3>
                      <div className="text-gray-600 dark:text-gray-300 space-y-1">
                        <p>Lorem ipsum - Dolor sit: 10:00 - 20:00</p>
                        <p>Consectetur - Adipiscing: 12:00 - 18:00</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Sed do eiusmod</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in-up dark:bg-gray-800/50 dark:border-gray-700" style={{ animationDelay: "500ms" }}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <MapPin className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 dark:text-white">Veniam Quis Nostrud</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="animate-fade-in-up dark:bg-gray-800/50 dark:border-gray-700" style={{ animationDelay: "600ms" }}>
              <CardContent className="pt-6">
                <h3 className="text-base font-semibold mb-4 dark:text-white">напишите нам</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      name="name"
                      placeholder="Ваше имя"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Ваш email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <Textarea
                      name="message"
                      placeholder="Ваше сообщение"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-900 hover:bg-blue-950 text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Отправляем..." : "Отправить сообщение"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: "800ms" }}>
            <Button 
              onClick={() => router.push("/")}
              variant="outline"
              className="px-8 py-3 text-lg transition-all duration-200 hover:scale-105"
            >
              Вернуться к каталогу
            </Button>
          </div>
        </div>
      </main>

      {/* Cart */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
