"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plane, MapPin, Calendar, Star, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FlipTimer } from "./flip-timer"

interface TripStage {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  color: string
  bgColor: string
}

const tripStages: TripStage[] = [
  {
    id: "preparation",
    name: "Подготовка",
    icon: <Calendar className="h-4 w-4" />,
    description: "Сбор заказов и подготовка к поездке",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: "departure",
    name: "Отъезд",
    icon: <Plane className="h-4 w-4" />,
    description: "Вылет в США",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: "arrival",
    name: "Прибытие",
    icon: <MapPin className="h-4 w-4" />,
    description: "Приземление в Америке",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    id: "return",
    name: "Возвращение",
    icon: <Star className="h-4 w-4" />,
    description: "Обратный путь домой",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
]

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
  const [currentStage, setCurrentStage] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [achievements, setAchievements] = useState<string[]>([])

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
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [departureDate, returnDate])

  useEffect(() => {
    // Определяем текущий этап
    const now = currentDate
    if (now < departureDate) {
      setCurrentStage(0) // Подготовка
    } else if (now < returnDate) {
      const tripProgress = (now.getTime() - departureDate.getTime()) / (returnDate.getTime() - departureDate.getTime())
      if (tripProgress < 0.1)
        setCurrentStage(1) // Отъезд
      else if (tripProgress < 0.5)
        setCurrentStage(2) // Прибытие
      else setCurrentStage(3) // Возвращение
    } else {
      setCurrentStage(4) // Завершено
    }

    // Добавляем достижения
    const newAchievements = []
    if (currentStage >= 1) newAchievements.push("🛫 Взлетел!")
    if (currentStage >= 2) newAchievements.push("🇺🇸 В Америке!")
    if (currentStage >= 3) newAchievements.push("🏠 Возвращается домой!")
    if (currentStage >= 4) newAchievements.push("✅ Миссия выполнена!")

    setAchievements(newAchievements)
  }, [currentDate, departureDate, returnDate, currentStage])

  // Позиции самолетика точно над этапами (grid-cols-4)
  const getPlanePosition = () => {
    // Позиции для grid-cols-4: центр каждой колонки
    const positions = [12.5, 37.5, 62.5, 87.5] // проценты для 4 колонок
    return positions[Math.min(currentStage, 3)]
  }

  // Создаем градиентный стиль для прогресс-бара в зависимости от этапа
  const getProgressBarStyle = () => {
    const position = getPlanePosition()

    if (currentStage === 0) {
      // Подготовка: синий градиент
      return {
        background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${position}%, #E5E7EB ${position}%, #E5E7EB 100%)`,
      }
    } else if (currentStage === 1) {
      // Отъезд: синий к фиолетовому
      return {
        background: `linear-gradient(to right, #3B82F6 0%, #8B5CF6 ${position}%, #E5E7EB ${position}%, #E5E7EB 100%)`,
      }
    } else if (currentStage === 2) {
      // Прибытие: синий к фиолетовому к зеленому
      return {
        background: `linear-gradient(to right, #3B82F6 0%, #8B5CF6 25%, #10B981 ${position}%, #E5E7EB ${position}%, #E5E7EB 100%)`,
      }
    } else if (currentStage === 3) {
      // Возвращение: полный градиент
      return {
        background: `linear-gradient(to right, #3B82F6 0%, #8B5CF6 25%, #10B981 50%, #F59E0B ${position}%, #E5E7EB ${position}%, #E5E7EB 100%)`,
      }
    } else {
      // Завершено: полный цветной градиент
      return {
        background: `linear-gradient(to right, #3B82F6 0%, #8B5CF6 25%, #10B981 50%, #F59E0B 75%, #EF4444 100%)`,
      }
    }
  }

  // Прогресс для прогресс-бара (заполнение до позиции самолетика)
  const getProgressBarValue = () => {
    // Заполняем прогресс-бар до позиции самолетика
    return getPlanePosition()
  }

  const getStatusText = () => {
    if (currentStage === 0) return "До отъезда"
    if (currentStage >= 1 && currentStage <= 3) return "До возвращения"
    return "Поездка завершена! 🎉"
  }

  const getCurrentStageName = () => {
    const stageNames = ["Подготовка", "Отъезд", "Прибытие", "Возвращение", "Завершено"]
    return stageNames[Math.min(currentStage, 4)]
  }

  return (
    <Card className="relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-red-50 opacity-50" />

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="relative">
              <Plane
                className={`h-6 w-6 transition-all duration-500 ${currentStage >= 1 ? "text-green-600 animate-pulse" : "text-blue-600"}`}
              />
              {currentStage >= 1 && currentStage <= 4 && (
                <Zap className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 animate-bounce" />
              )}
            </div>
            America Express Journey
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)} className="text-xs">
            {showDetails ? "Скрыть" : "Детали"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* Упрощенный таймер с flip анимацией */}
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-700 mb-4">{getStatusText()}</div>
          {currentStage < 4 && <FlipTimer timeLeft={timeLeft} />}
        </div>

        {/* Прогресс-бар с самолетиком и мерцающими границами */}
        <div className="relative">
          {/* Кастомный градиентный прогресс-бар с мерцающими границами */}
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-500 ease-in-out relative shimmer-border"
              style={getProgressBarStyle()}
            />
          </div>

          {/* Самолетик точно над текущим этапом */}
          <div
            className="absolute top-0 transition-all duration-500 ease-in-out"
            style={{ left: `${getPlanePosition()}%`, transform: "translateX(-50%)" }}
          >
            <div className="bg-white rounded-full p-1 shadow-lg border-2 border-blue-500">
              <Plane className="h-3 w-3 text-blue-600" />
            </div>
          </div>

          {/* Показываем только название этапа без процентов */}
          <div className="text-center mt-2">
            <Badge variant="outline" className="text-xs">
              {getCurrentStageName()}
            </Badge>
          </div>
        </div>

        {/* Этапы путешествия */}
        <div className="grid grid-cols-4 gap-3">
          {tripStages.map((stage, index) => (
            <div
              key={stage.id}
              className={`text-center transition-all duration-300 ${
                index <= currentStage ? "opacity-100 scale-100" : "opacity-50 scale-95"
              }`}
            >
              <div
                className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  index <= currentStage ? stage.bgColor : "bg-gray-100"
                }`}
              >
                <div className={index <= currentStage ? stage.color : "text-gray-400"}>{stage.icon}</div>
              </div>
              <div className="text-xs font-medium">{stage.name}</div>
              {index === currentStage && (
                <div className="mt-1">
                  <Badge variant="secondary" className="text-xs animate-pulse">
                    Сейчас
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Детальная информация */}
        {showDetails && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold mb-2">Текущий этап:</h4>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${tripStages[currentStage]?.bgColor || "bg-gray-100"}`}>
                  <div className={tripStages[currentStage]?.color || "text-gray-400"}>
                    {tripStages[currentStage]?.icon}
                  </div>
                </div>
                <div>
                  <div className="font-medium">{tripStages[currentStage]?.name || "Завершено"}</div>
                  <div className="text-sm text-gray-600">
                    {tripStages[currentStage]?.description || "Поездка успешно завершена!"}
                  </div>
                </div>
              </div>
            </div>

            {/* Достижения */}
            {achievements.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold mb-2">🏆 Достижения:</h4>
                <div className="flex flex-wrap gap-2">
                  {achievements.map((achievement, index) => (
                    <Badge key={index} variant="secondary" className="animate-in zoom-in duration-300">
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Статистика */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                <div className="text-lg font-bold text-blue-600">{getProgressBarValue()}%</div>
                <div className="text-xs text-gray-500">Общий прогресс</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                <div className="text-lg font-bold text-green-600">{currentStage + 1}/4</div>
                <div className="text-xs text-gray-500">Этапов</div>
              </div>
            </div>

            {/* Временные метки */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold mb-2">📅 Временная шкала:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Начало подготовки:</span>
                  <span className="font-medium">26 июня 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Отъезд:</span>
                  <span className="font-medium">15 июля 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Возвращение:</span>
                  <span className="font-medium">5 августа 2025</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <style jsx>{`
        .shimmer-border::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.8), transparent);
          border-radius: inherit;
          animation: shimmer 2s infinite;
          pointer-events: none;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes flip-out {
          0% { transform: rotateX(0deg); }
          50% { transform: rotateX(-90deg); }
          100% { transform: rotateX(-90deg); }
        }

        @keyframes flip-in {
          0% { transform: rotateX(90deg); }
          50% { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg); }
        }

        .animate-flip-out {
          animation: flip-out 0.3s ease-in-out;
        }

        .animate-flip-in {
          animation: flip-in 0.3s ease-in-out;
        }
      `}</style>
    </Card>
  )
}
