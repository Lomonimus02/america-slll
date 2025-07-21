// Конфигурация изображений продуктов
// Автоматически сгенерировано на основе реальных файлов в папках

export interface ProductImageConfig {
  folder: string
  images: string[]
}

export const productImagesConfig: Record<string, ProductImageConfig> = {
  "polo-ralph-lauren": {
    "folder": "polo-ralph-lauren",
    "images": [
      "/products/polo-ralph-lauren/image1.jpg"
    ]
  },
  "gld-shop": {
    "folder": "gld-shop",
    "images": [
      "/products/gld-shop/image1.jpeg",
      "/products/gld-shop/image2.jpeg",
      "/products/gld-shop/image3.jpeg"
    ]
  },
  "true-religion": {
    "folder": "true-religion",
    "images": [
      "/products/true-religion/image1.jpg"
    ]
  },
  "purple-brand": {
    "folder": "purple-brand",
    "images": [
      "/products/purple-brand/image1.jpeg",
      "/products/purple-brand/image2.jpeg"
    ]
  },
  "denim-tears": {
    "folder": "denim-tears",
    "images": [
      "/products/denim-tears/image1.png",
      "/products/denim-tears/image2.png",
      "/products/denim-tears/image3.png",
      "/products/denim-tears/image4.png"
    ]
  },
  "glo-gang-merch": {
    "folder": "glo-gang-merch",
    "images": [
      "/products/glo-gang-merch/image1.png",
      "/products/glo-gang-merch/image2.png",
      "/products/glo-gang-merch/image3.png",
      "/products/glo-gang-merch/image4.png",
      "/products/glo-gang-merch/image5.png"
    ]
  },
  "sp5der": {
    "folder": "sp5der",
    "images": [
      "/products/sp5der/image1.png",
      "/products/sp5der/image2.png",
      "/products/sp5der/image3.png",
      "/products/sp5der/image4.png",
      "/products/sp5der/image5.png",
      "/products/sp5der/image6.png",
      "/products/sp5der/image7.png"
    ]
  },
  "supreme": {
    "folder": "supreme",
    "images": [
      "/products/supreme/image1.png"
    ]
  },
  "a-bathing-ape": {
    "folder": "a-bathing-ape",
    "images": [
      "/products/a-bathing-ape/image1.png",
      "/products/a-bathing-ape/image2.png",
      "/products/a-bathing-ape/image3.png"
    ]
  },
  "yeezy": {
    "folder": "yeezy",
    "images": [
      "/products/yeezy/image1.png"
    ]
  },
  "tom-ford": {
    "folder": "tom-ford",
    "images": [
      "/products/tom-ford/image1.png"
    ]
  },
  "gant": {
    "folder": "gant",
    "images": [
      "/products/gant/image1.png"
    ]
  },
  "dickies": {
    "folder": "dickies",
    "images": [
      "/products/dickies/image1.png"
    ]
  },
  "carhartt": {
    "folder": "carhartt",
    "images": [
      "/products/carhartt/image1.jpg"
    ]
  },
  "stone-island": {
    "folder": "stone-island",
    "images": [
      "/products/stone-island/image1.jpg",
      "/products/stone-island/image2.jpg",
      "/products/stone-island/image3.jpg",
      "/products/stone-island/image4.jpg",
      "/products/stone-island/image5.jpg"
    ]
  },
  "cp-company": {
    "folder": "cp-company",
    "images": [
      "/products/cp-company/image1.png"
    ]
  },
  "lacoste": {
    "folder": "lacoste",
    "images": [
      "/products/lacoste/image1.jpg"
    ]
  },
  "ecko-unltd": {
    "folder": "ecko-unltd",
    "images": [
      "/products/ecko-unltd/image1.jpg"
    ]
  },
  "diesel": {
    "folder": "diesel",
    "images": [
      "/products/diesel/image1.png"
    ]
  },
  "armani": {
    "folder": "armani",
    "images": [
      "/products/armani/image1.jpg"
    ]
  },
  "prada": {
    "folder": "prada",
    "images": [
      "/products/prada/image1.jpg"
    ]
  },
  "coach": {
    "folder": "coach",
    "images": [
      "/products/coach/image1.jpg"
    ]
  }
}

// Функция для получения изображений продукта
export function getProductImages(folder: string): string[] {
  const config = productImagesConfig[folder]
  if (config && config.images.length > 0) {
    return config.images
  }
  
  // Fallback для брендов без изображений
  return ["/placeholder.svg"]
}

// Функция для получения главного изображения
export function getMainProductImage(folder: string): string {
  const images = getProductImages(folder)
  return images[0] || "/placeholder.svg"
}