"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function TestTelegramPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testDualSend = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-dual-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Тест отправки в два Telegram аккаунта</h1>
        
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardContent className="pt-6">
            <Button 
              onClick={testDualSend} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Отправляем..." : "Тестировать отправку"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Результат:</h2>
              <pre className="bg-gray-900 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
