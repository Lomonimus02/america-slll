const fs = require('fs');
const path = require('path');

// Импортируем конфигурацию (симулируем)
const configPath = path.join(__dirname, '..', 'lib', 'product-images.ts');
const configContent = fs.readFileSync(configPath, 'utf8');

console.log('🧪 Тестирование доступности изображений...\n');

// Извлекаем пути изображений из конфигурации
const imagePathRegex = /\/products\/[^"]+\.(jpg|jpeg|png|webp)/g;
const imagePaths = configContent.match(imagePathRegex) || [];

console.log(`📊 Найдено ${imagePaths.length} путей к изображениям\n`);

let successCount = 0;
let errorCount = 0;

imagePaths.forEach(imagePath => {
  // Преобразуем путь из веб-формата в файловый
  const filePath = path.join(__dirname, '..', 'public', imagePath.replace('/products/', 'products/'));
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${imagePath} (${Math.round(stats.size / 1024)}KB)`);
    successCount++;
  } else {
    console.log(`❌ ${imagePath} - файл не найден`);
    errorCount++;
  }
});

console.log(`\n📈 Результаты тестирования:`);
console.log(`   ✅ Доступно: ${successCount}`);
console.log(`   ❌ Недоступно: ${errorCount}`);
console.log(`   📊 Успешность: ${Math.round((successCount / (successCount + errorCount)) * 100)}%`);

if (errorCount === 0) {
  console.log('\n🎉 Все изображения доступны!');
} else {
  console.log('\n⚠️  Некоторые изображения недоступны. Проверьте пути к файлам.');
}
