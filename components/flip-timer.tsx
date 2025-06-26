"use client"

import { useState, useEffect } from "react"

interface FlipDigitProps {
  digit: string
  label: string
  color: string
}

function FlipDigit({ digit, label, color }: FlipDigitProps) {
  const [currentDigit, setCurrentDigit] = useState(digit)
  const [nextDigit, setNextDigit] = useState(digit)
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (digit !== currentDigit) {
      setNextDigit(digit)
      setIsFlipping(true)

      const timer = setTimeout(() => {
        setCurrentDigit(digit)
        setIsFlipping(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [digit, currentDigit])

  return (
    <div className="bg-white rounded-lg px-3 py-2 shadow-sm relative overflow-hidden">
      <div className="relative h-12 flex items-center justify-center">
        {/* Current digit */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-transform duration-300 ${
            isFlipping ? "animate-flip-out" : ""
          }`}
        >
          <div className={`font-bold text-lg ${color}`}>{currentDigit}</div>
        </div>

        {/* Next digit */}
        {isFlipping && (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-flip-in">
            <div className={`font-bold text-lg ${color}`}>{nextDigit}</div>
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 text-center">{label}</div>
    </div>
  )
}

interface FlipTimerProps {
  timeLeft: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
}

export function FlipTimer({ timeLeft }: FlipTimerProps) {
  return (
    <div className="flex justify-center gap-3 text-sm">
      <FlipDigit digit={timeLeft.days.toString().padStart(2, "0")} label="дней" color="text-blue-600" />
      <FlipDigit digit={timeLeft.hours.toString().padStart(2, "0")} label="часов" color="text-purple-600" />
      <FlipDigit digit={timeLeft.minutes.toString().padStart(2, "0")} label="минут" color="text-orange-600" />
      <FlipDigit digit={timeLeft.seconds.toString().padStart(2, "0")} label="секунд" color="text-red-600" />
    </div>
  )
}
