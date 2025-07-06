"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Cart } from "@/components/cart"
import { useCart } from "@/hooks/use-cart"

export default function AboutPage() {
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { items } = useCart()
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

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
        subtitle="О нас"
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              о нас
            </h2>
            <Card className="animate-fade-in-up dark:bg-gray-800/50 dark:border-gray-700" style={{ animationDelay: "200ms" }}>
              <CardContent className="pt-6">
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Молодые парни вылезли с улиц чтобы распродать американского стиля.
                  Целый месяц маленький Луи будет бегать по магазинам Америки что бы найти то, что заказал ты. По бегущей линии на главной странице ты можешь понять насколько близок твой заказ. В день, когда все заказы доберутся до России, мы доставим каждый прямо до порога (это подходит только жителям Санкт-Петербурга). В другие города доставка будет осуществляться через транспортные компании.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: "1000ms" }}>
            <Button
              onClick={() => router.push("/")}
              className="bg-blue-900 hover:bg-blue-950 text-white px-8 py-3 text-lg transition-all duration-200 hover:scale-105"
            >
              Перейти к каталогу брендов
            </Button>
          </div>
        </div>
      </main>

      {/* Cart */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
