# APEX GARAGE

Интернет-магазин автозапчастей с интерактивным 3D-гаражом: выбор автомобиля
(марка → модель → поколение → двигатель), выбор узла на 3D-модели или 2D-схеме
и подбор деталей с проверкой совместимости.

Стек: React 19, TypeScript, Vite, Tailwind CSS 4, three.js.

## Запуск

```bash
bun install        # или npm install
bun run dev        # http://localhost:3000
bun run build      # production-сборка в dist/
bun run lint       # проверка типов
```

## Структура

- `src/App.tsx` — состояние приложения, навигация и основные экраны
- `src/components/` — 3D-сцена, 2D-схема, карточка и страница товара, корзина, «Мой гараж», контакты
- `src/data/` — справочник автомобилей, систем и каталог запчастей с правилами совместимости
- `src/lib/storage.ts` — сохранение корзины, избранного и гаража в localStorage с проверкой данных

## 3D-модели автомобилей

По умолчанию в 3D-гараже показывается схематичный автомобиль. Чтобы показать
реальную модель:

1. Положите файл `.glb` в `public/models/` (лучше до 5–10 МБ; сжатие meshopt поддерживается).
2. Добавьте запись в `src/data/carModels.ts`, ключ — `generationId` или `modelId` из `src/data/vehicles.ts`:

   ```ts
   'chevrolet-cobalt': {
     file: 'chevrolet-cobalt.glb',
     title: 'Chevrolet Cobalt',
     forward: '+z',          // куда смотрит перед машины в файле: +z, -z, +x, -x
     lengthMeters: 4.48,     // необязательно
     credit: {
       author: 'Автор',
       license: 'CC BY 4.0',
       licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
       url: 'https://…',                         // страница модели
       modified: 'геометрия оптимизирована',   // если файл изменён
     },
   },
   ```

Подключённые модели:

- `chevrolet-cobalt.glb` — «Chevrolet Cobalt LTZ 2014», автор [Q.SARDOR](https://sketchfab.com/qsardor57913),
  [источник](https://sketchfab.com/3d-models/chevrolet-cobalt-ltz-2014-f91cbef731444f939e263041400216ca),
  лицензия [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); геометрия оптимизирована и сжата (33 МБ → 1,1 МБ).

Модель сама масштабируется, ставится на пол и центрируется. В режиме «Рентген кузова»
она становится прозрачной, и видны узлы. Для моделей с лицензией CC-BY поле
`credit` обязательно — автор показывается под сценой.

Уменьшить тяжёлую модель: `npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt --texture-size 2048`.

## Регион

Цены — в узбекских сумах (`src/lib/format.ts`). Телефон, адрес пункта выдачи и
условия доставки — в `src/data/store.ts` (сейчас там заглушки).

Экраны отражаются в адресе (`#/catalog`, `#/product/<id>` и т. д.), поэтому работают
кнопки «Назад/Вперёд» браузера и ссылки на товар.

Оформление заказа и подбор по VIN работают в демонстрационном режиме — без бэкенда.
