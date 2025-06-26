"use client"

import { Check } from "lucide-react"

interface SuccessCheckmarkProps {
  isVisible: boolean
  size?: "sm" | "md" | "lg"
}

export function SuccessCheckmark({ isVisible, size = "md" }: SuccessCheckmarkProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className={`${sizeClasses[size]} animate-success-pop`}>
        <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
          <Check className={`${iconSizes[size]} text-white animate-check-draw`} strokeWidth={3} />
        </div>
      </div>
    </div>
  )
}
