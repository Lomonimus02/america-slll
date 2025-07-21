# Инструкция по добавлению изображений товаров

## Структура папок

Каждый товар имеет свою папку в `public/products/` с 5 плейсхолдерами для изображений:

```
public/products/
├── polo-ralph-lauren/
│   ├── image1.jpg
│   ├── image2.jpg
│   ├── image3.jpg
│   ├── image4.jpg
│   └── image5.jpg
├── gld-shop/
│   ├── image1.jpg
│   ├── image2.jpg
│   ├── image3.jpg
│   ├── image4.jpg
│   └── image5.jpg
└── ... (остальные бренды)
```

## Список всех брендов и их папок:

1. **Polo Ralph Lauren** → `polo-ralph-lauren/`
2. **GLD SHOP** → `gld-shop/`
3. **True Religion** → `true-religion/`
4. **Purple Brand** → `purple-brand/`
5. **Denim Tears** → `denim-tears/`
6. **GLO GANG MERCH** → `glo-gang-merch/`
7. **SP5DER** → `sp5der/`
8. **Supreme** → `supreme/`
9. **A Bathing Ape** → `a-bathing-ape/`
10. **Yeezy** → `yeezy/`
11. **Tom Ford** → `tom-ford/`
12. **Gant** → `gant/`
13. **Dickies** → `dickies/`
14. **Carhartt** → `carhartt/`
15. **Stone Island** → `stone-island/`
16. **C.P. Company** → `cp-company/`
17. **Lacoste** → `lacoste/`
18. **Ecko Unltd** → `ecko-unltd/`
19. **Diesel** → `diesel/`
20. **Armani** → `armani/`
21. **Prada** → `prada/`
22. **Coach** → `coach/`

## Как добавить изображения:

1. **Найдите нужную папку бренда** из списка выше
2. **Замените файлы image1.jpg - image5.jpg** на ваши изображения
3. **Сохраните имена файлов** как `image1.jpg`, `image2.jpg`, `image3.jpg`, `image4.jpg`, `image5.jpg`
4. **Первое изображение (image1.jpg)** будет отображаться как главное на карточке товара
5. **Все 5 изображений** будут доступны в модальном окне товара с галереей

## Рекомендации по изображениям:

- **Формат**: JPG, PNG, WebP
- **Размер**: рекомендуется 500x500px или больше
- **Качество**: высокое качество для лучшего отображения
- **Соотношение сторон**: желательно квадратное (1:1)

## Пример:

Чтобы добавить изображения для бренда **Supreme**:
1. Откройте папку `public/products/supreme/`
2. Замените `image1.jpg` на главное фото Supreme товара
3. Замените `image2.jpg` - `image5.jpg` на дополнительные фото
4. Изображения автоматически появятся на сайте

## Важно:

- **НЕ изменяйте имена файлов** - используйте только `image1.jpg`, `image2.jpg`, и т.д.
- **НЕ изменяйте имена папок** - они связаны с кодом
- Если у вас меньше 5 изображений, оставьте оставшиеся файлы как есть (плейсхолдеры)
