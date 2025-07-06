"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FlipTimer } from "./flip-timer"
import { FaceIcon } from "./face-icon"

interface EnhancedProgressProps {
  departureDate: Date
  returnDate: Date
  currentDate: Date
}

export function EnhancedProgress({ departureDate, returnDate, currentDate }: EnhancedProgressProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      let targetDate: Date

      if (now < departureDate) {
        targetDate = departureDate
      } else if (now < returnDate) {
        targetDate = returnDate
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const diff = targetDate.getTime() - now.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 60000) // Обновляем каждую минуту
    return () => clearInterval(interval)
  }, [departureDate, returnDate])

  // Начальная дата - 26 июня 2025
  const startDate = new Date(2025, 5, 26) // месяцы в JS начинаются с 0

  // Вычисляем общее количество дней от начала до возвращения
  const totalDays = Math.ceil((returnDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  // Вычисляем текущий прогресс
  const getProgress = () => {
    const now = currentDate
    if (now < startDate) {
      // До начала - прогресс 0%
      return 0
    } else if (now >= returnDate) {
      // После возвращения - прогресс 100%
      return 100
    } else {
      // Вычисляем прогресс от начальной даты
      const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      return Math.min(100, (daysPassed / totalDays) * 100)
    }
  }

  const getStatusText = () => {
    const now = currentDate
    if (now < departureDate) return "До отъезда"
    if (now < returnDate) return "До возвращения"
    return "Поездка завершена! 🎉"
  }

  const progress = getProgress()

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-6 space-y-6">
        {/* Таймер с flip анимацией */}
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">{getStatusText()}</div>
          {progress < 100 && <FlipTimer timeLeft={timeLeft} />}
        </div>

        {/* Упрощенный прогресс-бар с иконкой лица */}
        <div className="relative">
          {/* Прогресс-бар без видимых разделений */}
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-blue-900 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Увеличенная иконка лица показывает текущий прогресс */}
          <div
            className="absolute -top-8 transition-all duration-500 ease-in-out flex items-center justify-center"
            style={{ left: `${progress}%`, transform: "translateX(-50%)" }}
          >
            <FaceIcon className="h-16 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
