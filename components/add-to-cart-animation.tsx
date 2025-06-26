"use client"

import { useState, useEffect } from "react"
import { ShoppingCart } from "lucide-react"

interface AddToCartAnimationProps {
  isActive: boolean
  startPosition: { x: number; y: number }
  onComplete: () => void
}

export function AddToCartAnimation({ isActive, startPosition, onComplete }: AddToCartAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isActive) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete])

  if (!isVisible) return null

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: startPosition.x,
        top: startPosition.y,
      }}
    >
      <div className="animate-fly-to-cart">
        <div className="bg-blue-500 text-white p-2 rounded-full shadow-lg">
          <ShoppingCart className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}
