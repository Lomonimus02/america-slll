"use client"

import { useState } from "react"
import { Plus, Minus, Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
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
  onAddToCart: (product: any) => void
}

// Расширенные данные товаров с характеристиками
const extendedProductData: Record<number, any> = {
  1: {
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500&text=iPhone+Side",
      "/placeholder.svg?height=500&width=500&text=iPhone+Back",
      "/placeholder.svg?height=500&width=500&text=iPhone+Box",
    ],
    colors: [
      { name: "Natural Titanium", value: "natural", hex: "#8E8E93" },
      { name: "Blue Titanium", value: "blue", hex: "#1E3A8A" },
      { name: "White Titanium", value: "white", hex: "#F8F9FA" },
      { name: "Black Titanium", value: "black", hex: "#1C1C1E" },
    ],
    storage: ["128GB", "256GB", "512GB", "1TB"],
    specifications: {
      Дисплей: "6.1″ Super Retina XDR",
      Процессор: "A17 Pro chip",
      Камера: "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
      Батарея: "До 23 часов видео",
      Материал: "Титан Grade 5",
      Защита: "IP68",
    },
    features: [
      "Action Button",
      "USB-C разъем",
      "Поддержка 5G",
      "Face ID",
      "Беспроводная зарядка",
      "MagSafe совместимость",
    ],
  },
  2: {
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500&text=Jordan+Side",
      "/placeholder.svg?height=500&width=500&text=Jordan+Sole",
      "/placeholder.svg?height=500&width=500&text=Jordan+Detail",
    ],
    colors: [
      { name: "Chicago", value: "chicago", hex: "#DC143C" },
      { name: "Bred", value: "bred", hex: "#000000" },
      { name: "Royal", value: "royal", hex: "#1E3A8A" },
      { name: "Shadow", value: "shadow", hex: "#6B7280" },
    ],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12", "US 13"],
    specifications: {
      "Материал верха": "Кожа премиум класса",
      Подошва: "Резина с узором",
      Технология: "Air-Sole в пятке",
      Стиль: "Высокие",
      "Год выпуска": "1985 (ретро)",
      Артикул: "555088-101",
    },
    features: [
      "Классический дизайн 1985 года",
      "Премиум кожа",
      "Air-Sole амортизация",
      "Резиновая подошва",
      "Перфорация для вентиляции",
    ],
  },
  3: {
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500&text=MacBook+Open",
      "/placeholder.svg?height=500&width=500&text=MacBook+Side",
      "/placeholder.svg?height=500&width=500&text=MacBook+Ports",
    ],
    colors: [
      { name: "Midnight", value: "midnight", hex: "#1C1C1E" },
      { name: "Starlight", value: "starlight", hex: "#F8F9FA" },
      { name: "Silver", value: "silver", hex: "#E5E5E7" },
      { name: "Space Gray", value: "spacegray", hex: "#6B7280" },
    ],
    memory: ["8GB", "16GB", "24GB"],
    storage: ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"],
    specifications: {
      Процессор: "Apple M3 chip",
      Дисплей: "13.6″ Liquid Retina",
      Память: "До 24GB unified memory",
      Батарея: "До 18 часов",
      Вес: "1.24 кг",
      Порты: "2x Thunderbolt, MagSafe 3",
    },
    features: [
      "Apple M3 chip",
      "Liquid Retina дисплей",
      "1080p FaceTime HD камера",
      "Magic Keyboard",
      "Touch ID",
      "Быстрая зарядка MagSafe",
    ],
  },
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedStorage, setSelectedStorage] = useState("")
  const [selectedMemory, setSelectedMemory] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [imageLoading, setImageLoading] = useState(false)

  if (!product) return null

  const extendedData = extendedProductData[product.id] || {}
  const images = extendedData.images || [product.image]

  const handleAddToCart = () => {
    const productWithOptions = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      selectedOptions: {
        color: selectedColor,
        size: selectedSize,
        storage: selectedStorage,
        memory: selectedMemory,
      },
    }
    onAddToCart(productWithOptions)
    onClose()
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
              <h1 className="text-2xl font-bold mb-2 animate-fade-in-up">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-twinkle" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-500">(127 отзывов)</span>
              </div>
              <p className="text-gray-600 mb-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                {product.description}
              </p>
              <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                <span className="text-3xl font-bold text-green-600 animate-price-pulse">${product.price}</span>
                <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                <Badge className="bg-red-500 animate-bounce-in">
                  Экономия ${product.originalPrice - product.price}
                </Badge>
              </div>
            </div>

            {/* Color Selection */}
            {extendedData.colors && (
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
            {extendedData.sizes && (
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

            {/* Quantity */}
            <div className="animate-fade-in-up" style={{ animationDelay: "800ms" }}>
              <Label className="text-sm font-medium mb-3 block">Количество</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-8 text-center animate-number-change">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              className="w-full transition-all duration-200 hover:scale-105 active:scale-95 ripple animate-fade-in-up"
              size="lg"
              onClick={handleAddToCart}
              style={{ animationDelay: "900ms" }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Добавить в корзину - ${product.price * quantity}
            </Button>

            {/* Specifications */}
            {extendedData.specifications && (
              <Card className="animate-fade-in-up" style={{ animationDelay: "1000ms" }}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Характеристики</h3>
                  <div className="space-y-2">
                    {Object.entries(extendedData.specifications).map(([key, value], index) => (
                      <div
                        key={key}
                        className="flex justify-between text-sm animate-fade-in-up"
                        style={{ animationDelay: `${1100 + index * 50}ms` }}
                      >
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {extendedData.features && (
              <Card className="animate-fade-in-up" style={{ animationDelay: "1200ms" }}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Особенности</h3>
                  <ul className="space-y-1">
                    {extendedData.features.map((feature: string, index: number) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-center gap-2 animate-fade-in-up"
                        style={{ animationDelay: `${1300 + index * 50}ms` }}
                      >
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
