"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Plane, MapPin, Calendar, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductGrid } from "@/components/product-grid"
import { Cart } from "@/components/cart"
import { ThemeToggle } from "@/components/theme-toggle"
import { useCart } from "@/hooks/use-cart"
import { EnhancedProgress } from "@/components/enhanced-progress"

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { items } = useCart()

  const departureDate = new Date("2025-07-15")
  const returnDate = new Date("2025-08-05") // 3 недели после отъезда

  useEffect(() => {
    const timer = setInterval(
      () => {
        setCurrentDate(new Date())
      },
      1000 * 60 * 60, // Обновляем каждый час (не каждую секунду)
    )

    return () => clearInterval(timer)
  }, [])

  const getDaysUntilDeparture = () => {
    const diffTime = departureDate.getTime() - currentDate.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getDaysUntilReturn = () => {
    const diffTime = returnDate.getTime() - currentDate.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getProgressStatus = () => {
    const daysUntilDeparture = getDaysUntilDeparture()
    const daysUntilReturn = getDaysUntilReturn()

    const totalDaysBeforeDeparture = 19 // с 26 июня до 15 июля
    const totalDaysInAmerica = 21 // 3 недели в Америке

    if (daysUntilDeparture > 0) {
      // До отлета: прогресс от 0% до 100%
      const progress = Math.max(
        0,
        Math.min(100, ((totalDaysBeforeDeparture - daysUntilDeparture) / totalDaysBeforeDeparture) * 100),
      )
      return {
        status: "До отъезда в Америку",
        days: daysUntilDeparture,
        icon: <Plane className="h-5 w-5" />,
        progress: progress,
        color: "bg-blue-500",
      }
    } else if (daysUntilReturn > 0) {
      // В Америке: прогресс от 0% до 100%
      const daysInAmerica = totalDaysInAmerica - daysUntilReturn
      const progress = Math.max(0, Math.min(100, (daysInAmerica / totalDaysInAmerica) * 100))
      return {
        status: "В Америке, до возвращения",
        days: daysUntilReturn,
        icon: <MapPin className="h-5 w-5" />,
        progress: progress,
        color: "bg-green-500",
      }
    } else {
      return {
        status: "Вернулся из Америки",
        days: 0,
        icon: <Calendar className="h-5 w-5" />,
        progress: 100,
        color: "bg-gray-500",
      }
    }
  }

  const progressInfo = getProgressStatus()
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden transition-colors duration-300">
      {/* Фоновые эффекты */}
      <div className="floating-shapes">
        <div className="floating-shape">
          <Plane className="h-16 w-16 text-blue-300 dark:text-blue-400 animate-floating" />
        </div>
        <div className="floating-shape">
          <Star className="h-12 w-12 text-yellow-300 dark:text-yellow-400 animate-floating" />
        </div>
        <div className="floating-shape">
          <Zap className="h-14 w-14 text-purple-300 dark:text-purple-400 animate-floating" />
        </div>
        <div className="floating-shape">
          <ShoppingCart className="h-10 w-10 text-green-300 dark:text-green-400 animate-floating" />
        </div>
      </div>

      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 animate-fade-in transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-red-600 text-white p-2 rounded-lg animate-gradient-shift">
                <Plane className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">America Express</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Временный магазин</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative transition-all duration-200 hover:scale-105 active:scale-95 ripple"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Корзина
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 min-w-[20px] h-5 rounded-full px-1 flex items-center justify-center text-xs animate-bounce-in">
                    {totalItems > 99 ? "99+" : totalItems}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Progress */}
      <section className="py-12 px-4 animate-fade-in-up">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in-up">
              Привези из Америки!
            </h2>
            <p
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              15 июля один из наших создателей улетает в США на 3 недели. Закажите товары, которые он может привезти для
              вас!
            </p>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <EnhancedProgress departureDate={departureDate} returnDate={returnDate} currentDate={currentDate} />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: ShoppingCart,
                title: "Выберите товары",
                description: "Добавьте нужные товары в корзину",
                color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                delay: "600ms",
              },
              {
                icon: Plane,
                title: "Отправим заказ",
                description: "Мы купим и привезем ваши товары",
                color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                delay: "700ms",
              },
              {
                icon: MapPin,
                title: "Получите товары",
                description: "Заберите заказ после возвращения",
                color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
                delay: "800ms",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="animate-fade-in-up hover:shadow-lg hover:-translate-y-1 transition-all duration-300 dark:bg-gray-800/50 dark:border-gray-700"
                style={{ animationDelay: item.delay }}
              >
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className={`${item.color} p-3 rounded-full w-fit mx-auto mb-3 animate-floating`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section
        className="py-12 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm animate-fade-in-up transition-colors duration-300"
        style={{ animationDelay: "1000ms" }}
      >
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 animate-fade-in-up dark:text-white">Каталог товаров</h2>
          <ProductGrid />
        </div>
      </section>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 px-4 animate-fade-in-up transition-colors duration-300">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 dark:text-gray-500">
            © 2025 America Express. Временный магазин действует до 5 августа 2025.
          </p>
        </div>
      </footer>
    </div>
  )
}
