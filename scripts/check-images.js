const fs = require('fs');
const path = require('path');

// Список всех брендов и их папок
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

const productsDir = path.join(__dirname, '..', 'public', 'products');

console.log('🔍 Проверка изображений товаров...\n');

let totalMissing = 0;
let totalFound = 0;

brands.forEach(brand => {
  const brandDir = path.join(productsDir, brand.folder);
  const missingImages = [];
  const foundImages = [];
  
  // Проверяем каждое изображение (image1.jpg - image5.jpg)
  for (let i = 1; i <= 5; i++) {
    const imagePath = path.join(brandDir, `image${i}.jpg`);
    
    if (fs.existsSync(imagePath)) {
      const stats = fs.statSync(imagePath);
      foundImages.push(`image${i}.jpg (${Math.round(stats.size / 1024)}KB)`);
      totalFound++;
    } else {
      missingImages.push(`image${i}.jpg`);
      totalMissing++;
    }
  }
  
  // Выводим результат для каждого бренда
  console.log(`📁 ${brand.name} (${brand.folder}/):`);
  
  if (foundImages.length > 0) {
    console.log(`   ✅ Найдено: ${foundImages.join(', ')}`);
  }
  
  if (missingImages.length > 0) {
    console.log(`   ❌ Отсутствует: ${missingImages.join(', ')}`);
  }
  
  console.log('');
});

// Общая статистика
console.log('📊 Общая статистика:');
console.log(`   ✅ Найдено изображений: ${totalFound}`);
console.log(`   ❌ Отсутствует изображений: ${totalMissing}`);
console.log(`   📈 Процент заполнения: ${Math.round((totalFound / (totalFound + totalMissing)) * 100)}%`);

if (totalMissing === 0) {
  console.log('\n🎉 Все изображения на месте!');
} else {
  console.log(`\n⚠️  Необходимо добавить ${totalMissing} изображений`);
}
