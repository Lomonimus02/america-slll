"use client"

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

// Типы для Vanta
declare global {
  interface Window {
    VANTA: any
    THREE: any
  }
}

interface VantaBackgroundProps {
  effect?: 'CLOUDS' | 'WAVES' | 'NET' | 'BIRDS' | 'FOG'
  className?: string
}

const effectUrls = {
  CLOUDS: 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js',
  WAVES: 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js',
  NET: 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js',
  BIRDS: 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js',
  FOG: 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js'
}

const getEffectOptions = (effect: string, theme: string | undefined) => {
  const isDark = theme === 'dark'

  switch (effect) {
    case 'CLOUDS':
      return {
        skyColor: isDark ? 0x1a1a2e : 0x68b8d7,
        cloudColor: isDark ? 0x16213e : 0xadc1de,
        cloudShadowColor: isDark ? 0x0f0f23 : 0x183550,
        sunColor: isDark ? 0x3f51b5 : 0xff9919,
        sunGlareColor: isDark ? 0x5c6bc0 : 0xff6633,
        sunlightColor: isDark ? 0x7986cb : 0xff9933,
        speed: 0.8,
        scale: 1.0,
        scaleMobile: 1.0
      }
    case 'WAVES':
      return {
        color: isDark ? 0x1a1a2e : 0x3f7cac,
        waveHeight: 20,
        waveSpeed: 0.5,
        zoom: 0.75
      }
    case 'NET':
      return {
        color: isDark ? 0x3f51b5 : 0x3f7cac,
        backgroundColor: isDark ? 0x0a0a0a : 0xffffff,
        points: 10,
        maxDistance: 20,
        spacing: 15
      }
    case 'BIRDS':
      return {
        backgroundColor: isDark ? 0x0a0a0a : 0x87ceeb,
        color1: isDark ? 0x3f51b5 : 0x1e3a8a,
        color2: isDark ? 0x5c6bc0 : 0x3b82f6,
        colorMode: 'variance',
        birdSize: 1.5,
        wingSpan: 25,
        speedLimit: 3,
        separation: 20,
        alignment: 20,
        cohesion: 20,
        quantity: 3
      }
    case 'FOG':
      return {
        highlightColor: isDark ? 0x3f51b5 : 0x3f7cac,
        midtoneColor: isDark ? 0x1a1a2e : 0x87ceeb,
        lowlightColor: isDark ? 0x0a0a0a : 0xffffff,
        baseColor: isDark ? 0x0a0a0a : 0xffffff,
        blurFactor: 0.6,
        speed: 1.0,
        zoom: 1.0
      }
    default:
      return {}
  }
}

export function VantaBackground({ 
  effect = 'CLOUDS', 
  className = '' 
}: VantaBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    // Очищаем предыдущий эффект
    if (vantaEffect.current) {
      vantaEffect.current.destroy()
      vantaEffect.current = null
    }

    // Динамически загружаем скрипты
    const loadVanta = async () => {
      // Загружаем Three.js
      if (!window.THREE) {
        const threeScript = document.createElement('script')
        threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js'
        document.head.appendChild(threeScript)

        await new Promise((resolve) => {
          threeScript.onload = resolve
        })
      }

      // Загружаем Vanta.js эффект
      const effectUrl = effectUrls[effect]
      const scriptId = `vanta-${effect.toLowerCase()}`

      if (!document.getElementById(scriptId)) {
        const vantaScript = document.createElement('script')
        vantaScript.id = scriptId
        vantaScript.src = effectUrl
        document.head.appendChild(vantaScript)

        await new Promise((resolve) => {
          vantaScript.onload = resolve
        })
      }

      // Инициализируем эффект
      if (vantaRef.current && window.VANTA && window.THREE && window.VANTA[effect]) {
        // Используем resolvedTheme или fallback на 'dark' для начальной загрузки
        const currentTheme = resolvedTheme || theme || 'dark'
        const effectOptions = getEffectOptions(effect, currentTheme)
        vantaEffect.current = window.VANTA[effect]({
          el: vantaRef.current,
          THREE: window.THREE,
          ...effectOptions
        })
      }
    }

    loadVanta()

    // Очистка при размонтировании
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
      }
    }
  }, [effect, theme, resolvedTheme])



  return (
    <div 
      ref={vantaRef} 
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ 
        width: '100vw', 
        height: '100vh',
        pointerEvents: 'none'
      }}
    />
  )
}
