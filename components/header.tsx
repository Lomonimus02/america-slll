"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { BurgerMenu } from "@/components/burger-menu"

interface HeaderProps {
  totalItems?: number
  onCartClick?: () => void
  onProductsClick?: () => void
  title?: string
  subtitle?: string
}

export function Header({ 
  totalItems = 0, 
  onCartClick, 
  onProductsClick, 
  title,
  subtitle 
}: HeaderProps) {
  return (
    <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 animate-fade-in transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">IIIstore</h1>
              {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={onCartClick}
                className="p-2 transition-all duration-200 hover:scale-105 active:scale-95 ripple"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 min-w-[20px] h-5 rounded-full px-1 flex items-center justify-center text-xs animate-bounce-in bg-red-500 hover:bg-red-600 border-white dark:border-gray-800 border-2">
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
            </div>
            <BurgerMenu onProductsClick={onProductsClick} />
          </div>
        </div>
      </div>
    </header>
  )
}
