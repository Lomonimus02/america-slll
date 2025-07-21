"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Cart } from "@/components/cart"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ContactsPage() {
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
          </div>

          <div className="max-w-2xl mx-auto text-center">
            {/* Contact Text */}
            <Card className="animate-fade-in-up dark:bg-gray-800/50 dark:border-gray-700" style={{ animationDelay: "200ms" }}>
              <CardContent className="pt-8 pb-8">
                <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 space-y-4">
                  <p>Сюда ты напишешь Когда найдешь то</p>
                  <p>Что хотел бы увидеть от One Eleven Store</p>
                  <p>Можешь найти тик ток</p>
                  <p>
                    <a
                      href="https://www.tiktok.com/@111store1?_t=ZN-8yDFrf6sLh8&_r=1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      Три единицы store
                    </a> мы развиваем блог
                  </p>
                  <p>Так же есть возможность завести диалог</p>
                  <p>
                    Менеджер: <a
                      href="https://t.me/StellarLTD"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      @111storetalk
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
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
