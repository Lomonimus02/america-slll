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
import { AddToCartAnimation } from "./add-to-cart-animation"
import { SuccessCheckmark } from "./success-checkmark"

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 999,
    originalPrice: 1200,
    image: "/placeholder.svg?height=300&width=300",
    category: "Электроника",
    rating: 4.9,
    description: "Последняя модель iPhone с титановым корпусом",
  },
  {
    id: 2,
    name: "Nike Air Jordan 1",
    price: 170,
    originalPrice: 220,
    image: "/placeholder.svg?height=300&width=300",
    category: "Обувь",
    rating: 4.8,
    description: "Классические кроссовки Nike Air Jordan",
  },
  {
    id: 3,
    name: "MacBook Air M3",
    price: 1099,
    originalPrice: 1299,
    image: "/placeholder.svg?height=300&width=300",
    category: "Электроника",
    rating: 4.9,
    description: "Новый MacBook Air с чипом M3",
  },
  {
    id: 4,
    name: "Levi's 501 Jeans",
    price: 59,
    originalPrice: 89,
    image: "/placeholder.svg?height=300&width=300",
    category: "Одежда",
    rating: 4.7,
    description: "Классические джинсы Levi's 501",
  },
  {
    id: 5,
    name: "Stanley Tumbler",
    price: 45,
    originalPrice: 60,
    image: "/placeholder.svg?height=300&width=300",
    category: "Аксессуары",
    rating: 4.6,
    description: "Популярная термокружка Stanley",
  },
  {
    id: 6,
    name: "Apple AirPods Pro",
    price: 249,
    originalPrice: 299,
    image: "/placeholder.svg?height=300&width=300",
    category: "Электроника",
    rating: 4.8,
    description: "Беспроводные наушники с шумоподавлением",
  },
  {
    id: 7,
    name: "Patagonia Jacket",
    price: 199,
    originalPrice: 279,
    image: "/placeholder.svg?height=300&width=300",
    category: "Одежда",
    rating: 4.9,
    description: "Куртка Patagonia для активного отдыха",
  },
  {
    id: 8,
    name: "Vitamins & Supplements",
    price: 89,
    originalPrice: 120,
    image: "/placeholder.svg?height=300&width=300",
    category: "Здоровье",
    rating: 4.5,
    description: "Набор витаминов и добавок из США",
  },
]

const categories = ["Все", "Электроника", "Одежда", "Обувь", "Аксессуары", "Здоровье"]

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState("Все")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null)
  const [animationState, setAnimationState] = useState({
    isActive: false,
    startPosition: { x: 0, y: 0 },
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  // Симуляция загрузки
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const filteredProducts =
    selectedCategory === "Все" ? products : products.filter((product) => product.category === selectedCategory)

  const handleAddToCart = (product: any, event?: React.MouseEvent) => {
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect()
      setAnimationState({
        isActive: true,
        startPosition: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        },
      })
    }

    // Проверяем, вызвано ли из модального окна (есть selectedOptions или quantity > 1)
    if (product.selectedOptions || product.quantity > 1) {
      // Добавление из модального окна с опциями
      addItem(product)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
      toast({
        title: "Товар добавлен в корзину",
        description: `${product.name} добавлен в вашу корзину`,
      })
    } else {
      // Обычное добавление из карточки товара - НЕ добавляем, а открываем модальное окно
      setSelectedProduct(product)
    }
  }

  const handleProductClick = (product: (typeof products)[0]) => {
    setSelectedProduct(product)
  }

  const handleAnimationComplete = () => {
    setAnimationState({ isActive: false, startPosition: { x: 0, y: 0 } })
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Category Filter Skeleton */}
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        <ProductGridSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <Card
            key={product.id}
            className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden animate-fade-in-up dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-2xl"
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
                <Badge className="absolute top-2 left-2 bg-red-500 animate-bounce-in">
                  Экономия ${product.originalPrice - product.price}
                </Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs transition-colors group-hover:bg-blue-100">
                    {product.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 animate-twinkle" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-sm dark:text-gray-300">{product.description}</CardDescription>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600 animate-price-pulse">${product.price}</span>
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                </div>
                <Button
                  className="w-full group-hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95 ripple"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToCart(product, e)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />В корзину
                </Button>
              </div>
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

      <AddToCartAnimation
        isActive={animationState.isActive}
        startPosition={animationState.startPosition}
        onComplete={handleAnimationComplete}
      />

      <SuccessCheckmark isVisible={showSuccess} />
    </div>
  )
}
