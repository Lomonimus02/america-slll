"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { ShoppingCart, Info, Phone } from "lucide-react"

interface BurgerMenuProps {
  onProductsClick?: () => void
}

export function BurgerMenu({ onProductsClick }: BurgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleProductsClick = () => {
    setIsOpen(false)
    if (onProductsClick) {
      onProductsClick()
    }
  }

  const handleAboutClick = () => {
    setIsOpen(false)
    router.push("/about")
  }

  const handleContactsClick = () => {
    setIsOpen(false)
    router.push("/contacts")
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <div className="burger-icon">
            <div className={`burger-line ${isOpen ? "open" : ""}`}></div>
            <div className={`burger-line ${isOpen ? "open" : ""}`}></div>
            <div className={`burger-line ${isOpen ? "open" : ""}`}></div>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Название (не кликабельный) */}
          <div className="flex items-center justify-center p-6 border-b bg-gradient-to-r from-blue-50 to-red-50 dark:from-gray-800 dark:to-gray-700">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">IIIstore</h2>
            </div>
          </div>

          {/* Меню пункты */}
          <div className="flex-1 py-4">
            <nav className="space-y-2 px-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-left p-4 h-auto hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={handleProductsClick}
              >
                <ShoppingCart className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">товары</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-left p-4 h-auto hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={handleAboutClick}
              >
                <Info className="h-5 w-5 mr-3 text-green-600 dark:text-green-400" />
                <span className="text-sm">о нас</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-left p-4 h-auto hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={handleContactsClick}
              >
                <Phone className="h-5 w-5 mr-3 text-red-600 dark:text-red-400" />
                <span className="text-sm">контакты</span>
              </Button>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
