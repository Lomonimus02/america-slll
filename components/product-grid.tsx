"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { ProductModal } from "./product-modal"
import { ProductGridSkeleton } from "./loading-skeleton"
import { getProductImages, getMainProductImage } from "@/lib/product-images"


// Базовые данные продуктов без изображений
const baseProducts = [
  {
    id: 1,
    name: "Polo Ralph Lauren",
    price: 150,
    originalPrice: 200,
    folder: "polo-ralph-lauren",
    category: "Одежда",
    rating: 4.8,
    description: "Премиальная одежда и аксессуары Polo Ralph Lauren",
  },
  {
    id: 2,
    name: "GLD SHOP",
    price: 80,
    originalPrice: 120,
    folder: "gld-shop",
    category: "Аксессуары",
    rating: 4.7,
    description: "Стильные украшения и аксессуары GLD SHOP",
  },
  {
    id: 3,
    name: "True Religion",
    price: 180,
    originalPrice: 250,
    folder: "true-religion",
    category: "Одежда",
    rating: 4.6,
    description: "Дизайнерские джинсы и одежда True Religion",
  },
  {
    id: 4,
    name: "Purple Brand",
    price: 220,
    originalPrice: 300,
    folder: "purple-brand",
    category: "Одежда",
    rating: 4.9,
    description: "Эксклюзивная уличная одежда Purple Brand",
  },
  {
    id: 5,
    name: "Denim Tears",
    price: 160,
    originalPrice: 220,
    folder: "denim-tears",
    category: "Одежда",
    rating: 4.8,
    description: "Культовая одежда и аксессуары Denim Tears",
  },
  {
    id: 6,
    name: "GLO GANG MERCH",
    price: 90,
    originalPrice: 130,
    folder: "glo-gang-merch",
    category: "Одежда",
    rating: 4.5,
    description: "Официальный мерч GLO GANG",
  },
  {
    id: 7,
    name: "SP5DER",
    price: 200,
    originalPrice: 280,
    folder: "sp5der",
    category: "Одежда",
    rating: 4.9,
    description: "Трендовая уличная одежда SP5DER",
  },
  {
    id: 8,
    name: "Supreme",
    price: 250,
    originalPrice: 350,
    folder: "supreme",
    category: "Одежда",
    rating: 4.9,
    description: "Легендарный стритвир бренд Supreme",
  },
  {
    id: 9,
    name: "A Bathing Ape",
    price: 300,
    originalPrice: 400,
    folder: "a-bathing-ape",
    category: "Одежда",
    rating: 4.8,
    description: "Японский стритвир бренд A Bathing Ape (BAPE)",
  },
  {
    id: 10,
    name: "Yeezy",
    price: 220,
    originalPrice: 300,
    folder: "yeezy",
    category: "Обувь",
    rating: 4.9,
    description: "Инновативные кроссовки и одежда Yeezy",
  },
  {
    id: 11,
    name: "Tom Ford",
    price: 500,
    originalPrice: 700,
    folder: "tom-ford",
    category: "Одежда",
    rating: 4.9,
    description: "Роскошная одежда и аксессуары Tom Ford",
  },
  {
    id: 12,
    name: "Gant",
    price: 120,
    originalPrice: 160,
    folder: "gant",
    category: "Одежда",
    rating: 4.7,
    description: "Классическая американская одежда Gant",
  },
  {
    id: 13,
    name: "Dickies",
    price: 60,
    originalPrice: 80,
    folder: "dickies",
    category: "Одежда",
    rating: 4.6,
    description: "Рабочая и повседневная одежда Dickies",
  },
  {
    id: 14,
    name: "Carhartt",
    price: 80,
    originalPrice: 110,
    folder: "carhartt",
    category: "Одежда",
    rating: 4.8,
    description: "Прочная рабочая одежда Carhartt",
  },
  {
    id: 15,
    name: "Stone Island",
    price: 350,
    originalPrice: 450,
    folder: "stone-island",
    category: "Одежда",
    rating: 4.9,
    description: "Итальянская техническая одежда Stone Island",
  },
  {
    id: 16,
    name: "C.P. Company",
    price: 280,
    originalPrice: 380,
    folder: "cp-company",
    category: "Одежда",
    rating: 4.8,
    description: "Инновационная итальянская одежда C.P. Company",
  },
  {
    id: 17,
    name: "Lacoste",
    price: 100,
    originalPrice: 140,
    folder: "lacoste",
    category: "Одежда",
    rating: 4.7,
    description: "Французская спортивная элегантность Lacoste",
  },
  {
    id: 18,
    name: "Ecko Unltd",
    price: 70,
    originalPrice: 100,
    folder: "ecko-unltd",
    category: "Одежда",
    rating: 4.5,
    description: "Уличная одежда и аксессуары Ecko Unltd",
  },
  {
    id: 19,
    name: "Diesel",
    price: 140,
    originalPrice: 190,
    folder: "diesel",
    category: "Одежда",
    rating: 4.7,
    description: "Итальянские джинсы и одежда Diesel",
  },
  {
    id: 20,
    name: "Armani",
    price: 400,
    originalPrice: 550,
    folder: "armani",
    category: "Одежда",
    rating: 4.9,
    description: "Итальянская роскошь и элегантность Armani",
  },
  {
    id: 21,
    name: "Prada",
    price: 600,
    originalPrice: 800,
    folder: "prada",
    category: "Одежда",
    rating: 4.9,
    description: "Миланская роскошь и инновации Prada",
  },
  {
    id: 22,
    name: "Coach",
    price: 300,
    originalPrice: 420,
    folder: "coach",
    category: "Аксессуары",
    rating: 4.8,
    description: "Американские кожаные изделия и аксессуары Coach",
  },
]

// Создаем продукты с динамическими изображениями
const products = baseProducts.map(product => ({
  ...product,
  image: getMainProductImage(product.folder),
  images: getProductImages(product.folder)
}))

export function ProductGrid() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null)

  const { addItem } = useCart()
  const { toast } = useToast()

  // Симуляция загрузки
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleAddToCart = (product: any, buttonElement?: HTMLElement) => {
    // Проверяем, вызвано ли из модального окна (передан buttonElement)
    if (buttonElement) {
      // Добавление из модального окна с опциями
      addItem(product)

      // Мгновенно закрываем модальное окно
      setSelectedProduct(null)

      toast({
        title: "Товар добавлен в корзину",
        description: `${product.name} добавлен в вашу корзину`,
      })
    } else {
      // Обычное добавление из карточки товара - открываем модальное окно
      setSelectedProduct(product)
    }
  }

  const handleProductClick = (product: (typeof products)[0]) => {
    setSelectedProduct(product)
  }

  if (isLoading) {
    return <ProductGridSkeleton />
  }

  return (
    <div className="space-y-8">
      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <Card
            key={product.id}
            className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden animate-fade-in-up dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-2xl flex flex-col h-full"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handleProductClick(product)}
          >
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </CardHeader>
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex-1 flex flex-col">
                <CardTitle className="text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white h-14 flex items-center line-clamp-2 leading-tight">
                  {product.name}
                </CardTitle>
              </div>
              <Button
                className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-900 dark:hover:bg-blue-800 text-white transition-all duration-200 hover:scale-105 active:scale-95 ripple mt-4 flex items-center justify-between px-3"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddToCart(product)
                }}
              >
                <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                <span className="text-lg font-bold">Заказать</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
