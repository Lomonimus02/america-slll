"use client"

import { useState } from "react"
import { Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ProductModalProps {
  product: any
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: any, buttonElement?: HTMLElement) => void
}

// Расширенные данные товаров с характеристиками
const extendedProductData: Record<number, any> = {
  1: {
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500&text=Polo+Ralph+Lauren",
      "/placeholder.svg?height=500&width=500&text=Polo+Collection",
      "/placeholder.svg?height=500&width=500&text=Polo+Style",
    ],
    colors: [
      { name: "Navy", value: "navy", hex: "#000080" },
      { name: "White", value: "white", hex: "#FFFFFF" },
      { name: "Red", value: "red", hex: "#DC143C" },
      { name: "Green", value: "green", hex: "#228B22" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    specifications: {
      Бренд: "Polo Ralph Lauren",
      Материал: "100% хлопок премиум",
      Страна: "США",
      Стиль: "Классический американский",
      Качество: "Премиум",
      Уход: "Машинная стирка",
    },
    features: [
      "Премиальное качество",
      "Классический дизайн",
      "100% хлопок",
      "Фирменный логотип",
      "Американский стиль",
      "Элегантность",
    ],
  },
  2: {
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500&text=GLD+SHOP",
      "/placeholder.svg?height=500&width=500&text=GLD+Jewelry",
      "/placeholder.svg?height=500&width=500&text=GLD+Collection",
    ],
    colors: [
      { name: "Gold", value: "gold", hex: "#FFD700" },
      { name: "Silver", value: "silver", hex: "#C0C0C0" },
      { name: "Rose Gold", value: "rosegold", hex: "#E8B4B8" },
      { name: "Black", value: "black", hex: "#000000" },
    ],
    sizes: ["One Size"],
    specifications: {
      Бренд: "GLD SHOP",
      Материал: "Металлические сплавы",
      Стиль: "Хип-хоп, уличный",
      Покрытие: "Позолота/посеребрение",
      Качество: "Высокое",
      Гарантия: "6 месяцев",
    },
    features: [
      "Качественные материалы",
      "Стильный дизайн",
      "Хип-хоп стиль",
      "Доступные цены",
      "Модные аксессуары",
      "Уличная культура",
    ],
  },
  3: {
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500&text=True+Religion",
      "/placeholder.svg?height=500&width=500&text=True+Religion+Jeans",
      "/placeholder.svg?height=500&width=500&text=True+Religion+Style",
    ],
    colors: [
      { name: "Dark Blue", value: "darkblue", hex: "#00008B" },
      { name: "Light Blue", value: "lightblue", hex: "#ADD8E6" },
      { name: "Black", value: "black", hex: "#000000" },
      { name: "White", value: "white", hex: "#FFFFFF" },
    ],
    sizes: ["28", "30", "32", "34", "36", "38", "40"],
    specifications: {
      Бренд: "True Religion",
      Материал: "Премиальный деним",
      Страна: "США",
      Крой: "Дизайнерский",
      Детали: "Фирменные строчки",
      Качество: "Премиум",
    },
    features: [
      "Премиальный деним",
      "Уникальные строчки",
      "Фирменные детали",
      "Американское качество",
      "Дизайнерский крой",
      "Культовый бренд",
    ],
  },
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedStorage, setSelectedStorage] = useState("")
  const [selectedMemory, setSelectedMemory] = useState("")

  const [imageLoading, setImageLoading] = useState(false)

  if (!product) return null

  const extendedData = extendedProductData[product.id] || {}
  // Используем изображения из продукта, если они есть, иначе из extendedData или fallback
  const images = product.images || extendedData.images || [product.image]

  const handleAddToCart = (event: React.MouseEvent) => {
    const productWithOptions = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      selectedOptions: {
        color: selectedColor,
        size: selectedSize,
        storage: selectedStorage,
        memory: selectedMemory,
      },
    }
    // Передаем элемент кнопки для анимации, не закрываем модальное окно сразу
    onAddToCart(productWithOptions, event.currentTarget as HTMLElement)
  }

  const nextImage = () => {
    setImageLoading(true)
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
      setImageLoading(false)
    }, 150)
  }

  const prevImage = () => {
    setImageLoading(true)
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
      setImageLoading(false)
    }, 150)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/95 border-0 shadow-2xl animate-modal-in">
        <DialogHeader>
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
          {/* Убираем этот Button с крестиком, так как он уже есть в DialogContent */}
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <div className={`transition-opacity duration-300 ${imageLoading ? "opacity-50" : "opacity-100"}`}>
                <img
                  src={images[currentImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm transition-all duration-200 hover:scale-110"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm transition-all duration-200 hover:scale-110"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentImageIndex === index ? "bg-white scale-125" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                      currentImageIndex === index ? "border-blue-500 scale-105" : "border-gray-200"
                    }`}
                    onClick={() => {
                      setImageLoading(true)
                      setTimeout(() => {
                        setCurrentImageIndex(index)
                        setImageLoading(false)
                      }, 150)
                    }}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6 animate-slide-in-right">
            <div>
              <Badge variant="secondary" className="mb-2 animate-fade-in">
                {product.category}
              </Badge>
              <h1 className="text-2xl font-bold mb-4 animate-fade-in-up">{product.name}</h1>
              <p className="text-gray-600 mb-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            {extendedData.colors && ![1, 2, 3].includes(product.id) && (
              <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
                <Label className="text-sm font-medium mb-3 block">Цвет</Label>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-2">
                  {extendedData.colors.map((color: any) => (
                    <div key={color.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={color.value} id={color.value} className="sr-only" />
                      <Label
                        htmlFor={color.value}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer hover:bg-gray-50 transition-all duration-200 hover:scale-105 ${
                          selectedColor === color.value ? "border-blue-500 bg-blue-50 scale-105" : "border-gray-200"
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full border transition-transform duration-200 hover:scale-110"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm">{color.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Size Selection */}
            {extendedData.sizes && ![1, 2, 3].includes(product.id) && (
              <div className="animate-fade-in-up" style={{ animationDelay: "500ms" }}>
                <Label className="text-sm font-medium mb-3 block">Размер</Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="transition-all duration-200 hover:border-blue-300 focus:border-blue-500">
                    <SelectValue placeholder="Выберите размер" />
                  </SelectTrigger>
                  <SelectContent>
                    {extendedData.sizes.map((size: string) => (
                      <SelectItem key={size} value={size} className="hover:bg-blue-50 transition-colors">
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Storage Selection */}
            {extendedData.storage && (
              <div className="animate-fade-in-up" style={{ animationDelay: "600ms" }}>
                <Label className="text-sm font-medium mb-3 block">Память</Label>
                <Select value={selectedStorage} onValueChange={setSelectedStorage}>
                  <SelectTrigger className="transition-all duration-200 hover:border-blue-300 focus:border-blue-500">
                    <SelectValue placeholder="Выберите объем памяти" />
                  </SelectTrigger>
                  <SelectContent>
                    {extendedData.storage.map((storage: string) => (
                      <SelectItem key={storage} value={storage} className="hover:bg-blue-50 transition-colors">
                        {storage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Memory Selection */}
            {extendedData.memory && (
              <div className="animate-fade-in-up" style={{ animationDelay: "700ms" }}>
                <Label className="text-sm font-medium mb-3 block">Оперативная память</Label>
                <Select value={selectedMemory} onValueChange={setSelectedMemory}>
                  <SelectTrigger className="transition-all duration-200 hover:border-blue-300 focus:border-blue-500">
                    <SelectValue placeholder="Выберите объем ОЗУ" />
                  </SelectTrigger>
                  <SelectContent>
                    {extendedData.memory.map((memory: string) => (
                      <SelectItem key={memory} value={memory} className="hover:bg-blue-50 transition-colors">
                        {memory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}



            {/* Add to Cart */}
            <Button
              className="w-full bg-blue-900 hover:bg-blue-950 text-white transition-all duration-200 hover:scale-105 active:scale-95 ripple animate-fade-in-up"
              size="lg"
              onClick={handleAddToCart}
              style={{ animationDelay: "900ms" }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Заказать
            </Button>


          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
