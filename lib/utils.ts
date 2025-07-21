import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Утилита для поиска изображений продукта
export function findProductImages(folder: string): string[] {
  const supportedFormats = ['jpg', 'jpeg', 'png', 'webp']
  const images: string[] = []

  // Проверяем изображения от image1 до image20
  for (let i = 1; i <= 20; i++) {
    for (const format of supportedFormats) {
      const imagePath = `/products/${folder}/image${i}.${format}`

      // В браузере мы не можем проверить существование файла напрямую
      // Поэтому добавляем все возможные пути и позволяем браузеру обработать 404
      // Но для оптимизации, мы будем использовать известные изображения

      // Временно добавляем все возможные пути - позже оптимизируем
      images.push(imagePath)
    }
  }

  return images
}

// Функция для получения главного изображения продукта
export function getMainProductImage(folder: string): string {
  const supportedFormats = ['jpg', 'jpeg', 'png', 'webp']

  for (const format of supportedFormats) {
    const imagePath = `/products/${folder}/image1.${format}`
    // Возвращаем первый найденный формат
    return imagePath
  }

  return "/placeholder.svg"
}
