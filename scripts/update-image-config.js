const fs = require('fs');
const path = require('path');

// Путь к папке с продуктами
const productsDir = path.join(__dirname, '..', 'public', 'products');

// Список всех брендов
const brands = [
  { name: "Polo Ralph Lauren", folder: "polo-ralph-lauren" },
  { name: "GLD SHOP", folder: "gld-shop" },
  { name: "True Religion", folder: "true-religion" },
  { name: "Purple Brand", folder: "purple-brand" },
  { name: "Denim Tears", folder: "denim-tears" },
  { name: "GLO GANG MERCH", folder: "glo-gang-merch" },
  { name: "SP5DER", folder: "sp5der" },
  { name: "Supreme", folder: "supreme" },
  { name: "A Bathing Ape", folder: "a-bathing-ape" },
  { name: "Yeezy", folder: "yeezy" },
  { name: "Tom Ford", folder: "tom-ford" },
  { name: "Gant", folder: "gant" },
  { name: "Dickies", folder: "dickies" },
  { name: "Carhartt", folder: "carhartt" },
  { name: "Stone Island", folder: "stone-island" },
  { name: "C.P. Company", folder: "cp-company" },
  { name: "Lacoste", folder: "lacoste" },
  { name: "Ecko Unltd", folder: "ecko-unltd" },
  { name: "Diesel", folder: "diesel" },
  { name: "Armani", folder: "armani" },
  { name: "Prada", folder: "prada" },
  { name: "Coach", folder: "coach" }
];

console.log('🔍 Сканирование изображений продуктов...\n');

const productImagesConfig = {};

brands.forEach(brand => {
  const brandDir = path.join(productsDir, brand.folder);
  const foundImages = [];
  
  if (fs.existsSync(brandDir)) {
    // Проверяем изображения от image1 до image20
    for (let i = 1; i <= 20; i++) {
      const supportedFormats = ['jpg', 'jpeg', 'png', 'webp'];
      
      for (const format of supportedFormats) {
        const imagePath = path.join(brandDir, `image${i}.${format}`);
        
        if (fs.existsSync(imagePath)) {
          const stats = fs.statSync(imagePath);
          foundImages.push(`/products/${brand.folder}/image${i}.${format}`);
          console.log(`✅ ${brand.name}: image${i}.${format} (${Math.round(stats.size / 1024)}KB)`);
          break; // Найден файл с этим номером, переходим к следующему
        }
      }
    }
  }
  
  // Добавляем в конфигурацию
  productImagesConfig[brand.folder] = {
    folder: brand.folder,
    images: foundImages.length > 0 ? foundImages : ["/placeholder.svg"]
  };
  
  if (foundImages.length === 0) {
    console.log(`❌ ${brand.name}: Изображения не найдены`);
  }
  
  console.log('');
});

// Генерируем новый файл конфигурации
const configContent = `// Конфигурация изображений продуктов
// Автоматически сгенерировано на основе реальных файлов в папках

export interface ProductImageConfig {
  folder: string
  images: string[]
}

export const productImagesConfig: Record<string, ProductImageConfig> = ${JSON.stringify(productImagesConfig, null, 2)}

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
}`;

// Сохраняем новый файл конфигурации
const configPath = path.join(__dirname, '..', 'lib', 'product-images.ts');
fs.writeFileSync(configPath, configContent);

console.log('🎉 Конфигурация изображений обновлена!');
console.log(`📁 Файл сохранен: ${configPath}`);

// Статистика
const totalBrands = brands.length;
const brandsWithImages = Object.values(productImagesConfig).filter(config => 
  config.images.length > 0 && config.images[0] !== "/placeholder.svg"
).length;

console.log(`\n📊 Статистика:`);
console.log(`   Всего брендов: ${totalBrands}`);
console.log(`   С изображениями: ${brandsWithImages}`);
console.log(`   Без изображений: ${totalBrands - brandsWithImages}`);
console.log(`   Процент заполнения: ${Math.round((brandsWithImages / totalBrands) * 100)}%`);
