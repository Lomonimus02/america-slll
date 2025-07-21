"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Plane, MapPin, Calendar, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductGrid } from "@/components/product-grid"
import { Cart } from "@/components/cart"
import { Header } from "@/components/header"
import { CustomOrderForm } from "@/components/custom-order-form"
import { useCart } from "@/hooks/use-cart"
import { EnhancedProgress } from "@/components/enhanced-progress"
import { FaceIcon } from "@/components/face-icon"
import { VantaBackground } from "@/components/vanta-background"

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { items } = useCart()

  const departureDate = new Date("2025-07-15")
  const returnDate = new Date("2025-08-25") // Возвращение 25 августа

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
    const totalDaysInAmerica = 41 // с 15 июля до 25 августа

    if (daysUntilDeparture > 0) {
      // До отлета: прогресс от 0% до 100%
      const progress = Math.max(
        0,
        Math.min(100, ((totalDaysBeforeDeparture - daysUntilDeparture) / totalDaysBeforeDeparture) * 100),
      )
      return {
        status: "До отъезда в Америку",
        days: daysUntilDeparture,
        icon: <FaceIcon className="h-5 w-5" />,
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

  const scrollToProducts = () => {
    const productsSection = document.getElementById("products")
    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Vanta.js интерактивный фон */}
      <VantaBackground effect="FOG" />

      {/* Дополнительный полупрозрачный слой для лучшей читаемости */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-[0.5px] -z-5" />

      {/* Header */}
      <Header
        totalItems={totalItems}
        onCartClick={() => setIsCartOpen(true)}
        onProductsClick={scrollToProducts}
      />

      {/* Hero Section with Progress */}
      <section className="py-12 px-4 animate-fade-in-up">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in-up">
              привезем любые товары из америки
            </h2>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <EnhancedProgress departureDate={departureDate} returnDate={returnDate} currentDate={currentDate} />
          </div>
        </div>
      </section>

      {/* Products */}
      <section
        id="products"
        className="py-12 px-4 animate-fade-in-up transition-colors duration-300"
        style={{ animationDelay: "1000ms" }}
      >
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 animate-fade-in-up dark:text-white">каталог брендов</h2>
          <ProductGrid />
        </div>
      </section>

      {/* Custom Order Form */}
      <section className="py-12 px-4 animate-fade-in-up transition-colors duration-300" style={{ animationDelay: "1200ms" }}>
        <div className="container mx-auto">
          <CustomOrderForm />
        </div>
      </section>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-white py-8 px-4 animate-fade-in-up transition-colors duration-300">
        <div className="container mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400">
            сайт создан студией <a href="https://t.me/dronston_dron" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Stellar Web-Design</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
