import { AutoPart, CompatibilityStatus, SelectedVehicle } from '../types/garage';

export const AUTO_PARTS: AutoPart[] = [
  // ================= ХОДОВАЯ ЧАСТЬ И ПОДВЕСКА (suspension) =================
  {
    id: 'part-bilstein-b6-g20-front',
    sku: '22-291448',
    oemNumbers: ['31316873795', '31316883325', '31316888867'],
    name: 'Стойка амортизационная передняя газомасляная B6 Performance',
    brand: 'BILSTEIN',
    isOriginal: false,
    systemId: 'suspension',
    subcategoryId: 'shock-absorbers',
    price: 21450,
    oldPrice: 23900,
    stockCount: 8,
    deliveryDays: 0,
    popularity: 99,
    warrantyMonths: 24,
    illustrationType: 'shock_absorber',
    specs: [
      { label: 'Ось установки', value: 'Передняя ось (двусторонняя)' },
      { label: 'Тип амортизатора', value: 'Давление газа, однотрубный Upside-Down' },
      { label: 'Конструкция', value: 'Амортизационная стойка' },
      { label: 'Диаметр штока', value: '22 мм' },
      { label: 'Вес детали', value: '4.15 кг' },
    ],
    description:
      'Усиленный газомасляный амортизатор серии Bilstein B6 Performance. Обеспечивает повышенную курсовую устойчивость и точный отклик при активном маневрировании без занижения штатного клиренса.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive', 'bmw-3-g20-m340i'],
        notes: 'Для автомобилей со стандартной и спортивной подвеской M Sport (без EDC)',
      },
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-f30',
        modificationIds: ['bmw-3-f30-320i-n20'],
        notes: 'Подходит для полноприводных версий xDrive',
      },
    ],
    analogPartIds: ['part-sachs-shock-front', 'part-bmw-oem-shock-g20'],
  },
  {
    id: 'part-sachs-shock-front',
    sku: '318-854',
    oemNumbers: ['31316873795', '31316883325', '48510-06B40', '5Q0413031FM'],
    name: 'Амортизатор передний Super Touring двухтрубный',
    brand: 'SACHS',
    isOriginal: false,
    systemId: 'suspension',
    subcategoryId: 'shock-absorbers',
    price: 13800,
    stockCount: 14,
    deliveryDays: 0,
    popularity: 95,
    warrantyMonths: 18,
    illustrationType: 'shock_absorber',
    specs: [
      { label: 'Ось установки', value: 'Передняя ось' },
      { label: 'Тип наполнителя', value: 'Газомасляный двухтрубный' },
      { label: 'Способ крепления', value: 'Верхний стержень / нижний хомут' },
      { label: 'Покрытие', value: 'Антикоррозийное цинк-никелевое' },
    ],
    description:
      'Конвейерный поставщик европейских автопроизводителей. Сбалансированная характеристика демпфирования, полностью соответствующая заводским параметрам комфорта.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive'],
      },
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-f30',
        modificationIds: ['bmw-3-f30-320i-n20', 'bmw-3-f30-316i'],
      },
      {
        brandId: 'toyota',
        modelId: 'toyota-camry',
        generationId: 'toyota-camry-xv70',
        modificationIds: ['toyota-camry-xv70-25', 'toyota-camry-xv70-35'],
      },
      {
        brandId: 'vw',
        modelId: 'vw-tiguan',
        generationId: 'vw-tiguan-ad1',
        modificationIds: ['vw-tiguan-ad1-14-czda', 'vw-tiguan-ad1-20-czpa'],
      },
      {
        brandId: 'audi',
        modelId: 'audi-a4',
        generationId: 'audi-a4-b9',
        modificationIds: ['audi-a4-b9-40tfsi', 'audi-a4-b9-45tfsi-quattro'],
      },
    ],
    analogPartIds: ['part-bilstein-b6-g20-front', 'part-bmw-oem-shock-g20', 'part-kyb-excel-g'],
  },
  {
    id: 'part-bmw-oem-shock-g20',
    sku: '31316873795',
    oemNumbers: ['31316873795', '31316888867'],
    name: 'Оригинальная амортизационная стойка передняя Лев/Прав M Sport',
    brand: 'BMW Original',
    isOriginal: true,
    systemId: 'suspension',
    subcategoryId: 'shock-absorbers',
    price: 32900,
    stockCount: 3,
    deliveryDays: 1,
    popularity: 88,
    warrantyMonths: 24,
    illustrationType: 'shock_absorber',
    specs: [
      { label: 'Статус детали', value: 'Оригинал концерна BMW Group' },
      { label: 'Ось установки', value: 'Передняя' },
      { label: 'Опция шасси', value: 'S704A (Спортивная ходовая часть M)' },
    ],
    description:
      'Оригинальная заводская стойка передней подвески BMW. Поставляется в фирменной упаковке с защитной голограммой и заводским клапаном прогрессивного отбоя.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive', 'bmw-3-g20-m340i'],
      },
      {
        brandId: 'bmw',
        modelId: 'bmw-x5',
        // специально без modificationIds для демонстрации статуса "Совместимость требует проверки"
        generationId: 'bmw-x5-g05',
      },
    ],
    analogPartIds: ['part-bilstein-b6-g20-front', 'part-sachs-shock-front'],
  },
  {
    id: 'part-kyb-excel-g',
    sku: '339700',
    oemNumbers: ['48510-06B40', '48520-06B40', '54651-L2000', '5Q0413031FM'],
    name: 'Стойка амортизатора передняя Excel-G двухтрубная газомасляная',
    brand: 'KYB (Kayaba)',
    isOriginal: false,
    systemId: 'suspension',
    subcategoryId: 'shock-absorbers',
    price: 11200,
    stockCount: 22,
    deliveryDays: 0,
    popularity: 94,
    warrantyMonths: 24,
    illustrationType: 'shock_absorber',
    specs: [
      { label: 'Серия', value: 'KYB Excel-G (Япония)' },
      { label: 'Запатентованный клапан', value: 'Трёхступенчатая клапанная система' },
      { label: 'Шток', value: 'Твёрдое хромирование с тефлоновым кольцом' },
    ],
    description:
      'Популярная серия амортизаторов KYB Excel-G с запатентованной клапанной системой, снижающей вспенивание жидкости при интенсивной работе на неровном покрытии.',
    compatibility: [
      {
        brandId: 'toyota',
        modelId: 'toyota-camry',
        generationId: 'toyota-camry-xv70',
        modificationIds: ['toyota-camry-xv70-25', 'toyota-camry-xv70-35'],
      },
      {
        brandId: 'toyota',
        modelId: 'toyota-camry',
        generationId: 'toyota-camry-xv50',
        modificationIds: ['toyota-camry-xv50-25-2ar'],
      },
      {
        brandId: 'toyota',
        modelId: 'toyota-rav4',
        generationId: 'toyota-rav4-xa50',
        modificationIds: ['toyota-rav4-xa50-20-cvt', 'toyota-rav4-xa50-25-at'],
      },
      {
        brandId: 'kia',
        modelId: 'kia-k5',
        generationId: 'kia-k5-dl3',
        modificationIds: ['kia-k5-dl3-25-gdi', 'kia-k5-dl3-20-mpi'],
      },
      {
        brandId: 'vw',
        modelId: 'vw-polo',
        generationId: 'vw-polo-ck',
        modificationIds: ['vw-polo-ck-16-cwva', 'vw-polo-ck-14-czca'],
      },
    ],
    analogPartIds: ['part-sachs-shock-front'],
  },
  {
    id: 'part-lemforder-arm-front',
    sku: '42231-01',
    oemNumbers: ['31106878585', '31106878586', '48068-06190', '5Q0407151M'],
    name: 'Рычаг передней подвески нижний поперечный из кованого алюминия',
    brand: 'LEMFÖRDER',
    isOriginal: false,
    systemId: 'suspension',
    subcategoryId: 'control-arms',
    price: 14900,
    stockCount: 9,
    deliveryDays: 0,
    popularity: 92,
    warrantyMonths: 24,
    illustrationType: 'control_arm',
    specs: [
      { label: 'Материал корпуса', value: 'Кованый авиационный алюминий AlSi1MgMn' },
      { label: 'Комплектация', value: 'В сборе с гидроопорой и шаровым шарниром' },
      { label: 'Сторона установки', value: 'Передний мост слева / справа' },
    ],
    description:
      'Рычаг подвески Lemförder в сборе с усиленным сайлентблоком. Обеспечивает эталонную кинематику углов установки колёс и гашение высокочастотных вибраций.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive', 'bmw-3-g20-m340i'],
      },
      {
        brandId: 'bmw',
        modelId: 'bmw-x5',
        generationId: 'bmw-x5-g05',
        modificationIds: ['bmw-x5-g05-30d', 'bmw-x5-g05-40i'],
      },
      {
        brandId: 'audi',
        modelId: 'audi-a4',
        generationId: 'audi-a4-b9',
        modificationIds: ['audi-a4-b9-40tfsi', 'audi-a4-b9-45tfsi-quattro'],
      },
      {
        brandId: 'vw',
        modelId: 'vw-tiguan',
        generationId: 'vw-tiguan-ad1',
        modificationIds: ['vw-tiguan-ad1-14-czda', 'vw-tiguan-ad1-20-czpa'],
      },
      {
        brandId: 'toyota',
        modelId: 'toyota-camry',
        generationId: 'toyota-camry-xv70',
        modificationIds: ['toyota-camry-xv70-25', 'toyota-camry-xv70-35'],
      },
    ],
    analogPartIds: [],
  },
  {
    id: 'part-fag-wheel-hub',
    sku: '713-6496-60',
    oemNumbers: ['31206871193', '43550-33060', '8W0407613B'],
    name: 'Ступица колеса в сборе с двухрядным радиально-упорным подшипником',
    brand: 'FAG (Schaeffler)',
    isOriginal: false,
    systemId: 'suspension',
    subcategoryId: 'wheel-hubs',
    price: 16200,
    stockCount: 6,
    deliveryDays: 1,
    popularity: 86,
    warrantyMonths: 24,
    illustrationType: 'wheel_hub',
    specs: [
      { label: 'Наружный диаметр', value: '142 мм' },
      { label: 'Разболтовка', value: '5x112 / M14x1.25' },
      { label: 'Датчик ABS', value: 'Встроенное магнитное кольцо импульсов' },
      { label: 'Комплектация', value: 'Ступица + 4 высокопрочных болта крепления' },
    ],
    description:
      'Ступичный узел FAG поколения 3 с низким моментом трения и торцевым шлицевым зацеплением. Включает интегрированный энкодер системы ABS/DSC.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive', 'bmw-3-g20-m340i'],
      },
      {
        brandId: 'audi',
        modelId: 'audi-a4',
        generationId: 'audi-a4-b9',
        modificationIds: ['audi-a4-b9-40tfsi', 'audi-a4-b9-45tfsi-quattro'],
      },
      {
        brandId: 'toyota',
        modelId: 'toyota-camry',
        generationId: 'toyota-camry-xv70',
        modificationIds: ['toyota-camry-xv70-25', 'toyota-camry-xv70-35'],
      },
    ],
    analogPartIds: [],
  },
  {
    id: 'part-trw-ball-joint-link',
    sku: 'JTS7741',
    oemNumbers: ['31306881929', '48820-06100', '5Q0411315B'],
    name: 'Стойка стабилизатора поперечной устойчивости усиленная (комплект)',
    brand: 'TRW',
    isOriginal: false,
    systemId: 'suspension',
    subcategoryId: 'ball-joints',
    price: 3450,
    stockCount: 28,
    deliveryDays: 0,
    popularity: 90,
    warrantyMonths: 12,
    illustrationType: 'control_arm',
    specs: [
      { label: 'Длина по центрам', value: '295 мм' },
      { label: 'Резьба пальца', value: 'M12 x 1.5' },
      { label: 'Пыльник', value: 'Морозостойкий хлоропреновый каучук (-45°C)' },
    ],
    description:
      'Тяга стабилизатора TRW с вкладышем из полиоксиметилена (POM) и кованым шаровым пальцем высокой чистоты полировки.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive', 'bmw-3-g20-m340i'],
      },
      {
        brandId: 'toyota',
        modelId: 'toyota-camry',
        generationId: 'toyota-camry-xv70',
        modificationIds: ['toyota-camry-xv70-25', 'toyota-camry-xv70-35'],
      },
      {
        brandId: 'vw',
        modelId: 'vw-tiguan',
        generationId: 'vw-tiguan-ad1',
        modificationIds: ['vw-tiguan-ad1-14-czda', 'vw-tiguan-ad1-20-czpa'],
      },
      {
        brandId: 'kia',
        modelId: 'kia-k5',
        generationId: 'kia-k5-dl3',
        modificationIds: ['kia-k5-dl3-25-gdi', 'kia-k5-dl3-20-mpi'],
      },
    ],
    analogPartIds: [],
  },

  // ================= ТОРМОЗНАЯ СИСТЕМА (brakes) =================
  {
    id: 'part-brembo-xtra-disc',
    sku: '09.D094.1X',
    oemNumbers: ['34116880072', '34106880077', '43512-06240', '5Q0615301G'],
    name: 'Тормозной диск передний вентилируемый с перфорацией Brembo Xtra',
    brand: 'BREMBO',
    isOriginal: false,
    systemId: 'brakes',
    subcategoryId: 'brake-discs',
    price: 15800,
    oldPrice: 17500,
    stockCount: 12,
    deliveryDays: 0,
    popularity: 98,
    warrantyMonths: 24,
    illustrationType: 'brake_disc',
    specs: [
      { label: 'Диаметр диска', value: '348 мм' },
      { label: 'Толщина нового / мин.', value: '30.0 мм / 28.4 мм' },
      { label: 'Тип охлаждения', value: 'Внутренняя вентиляция + сквозная перфорация' },
      { label: 'Сплав', value: 'Высокоуглеродистый чугун High Carbon (HC)' },
      { label: 'Покрытие ступицы', value: 'УФ-лак UV Coated против коррозии' },
    ],
    description:
      'Перфорированный тормозной диск Brembo Xtra из высокоуглеродистого чугуна. Сквозные отверстия эффективно отводят воду и газы от колодки, исключая фединг при интенсивных торможениях.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive', 'bmw-3-g20-m340i'],
      },
      {
        brandId: 'bmw',
        modelId: 'bmw-x5',
        generationId: 'bmw-x5-g05',
        modificationIds: ['bmw-x5-g05-30d', 'bmw-x5-g05-40i'],
      },
      {
        brandId: 'toyota',
        modelId: 'toyota-camry',
        generationId: 'toyota-camry-xv70',
        modificationIds: ['toyota-camry-xv70-25', 'toyota-camry-xv70-35'],
      },
      {
        brandId: 'vw',
        modelId: 'vw-tiguan',
        generationId: 'vw-tiguan-ad1',
        modificationIds: ['vw-tiguan-ad1-14-czda', 'vw-tiguan-ad1-20-czpa'],
      },
      {
        brandId: 'audi',
        modelId: 'audi-a4',
        generationId: 'audi-a4-b9',
        modificationIds: ['audi-a4-b9-40tfsi', 'audi-a4-b9-45tfsi-quattro'],
      },
    ],
    analogPartIds: ['part-ate-ceramic-pads'],
  },
  {
    id: 'part-ate-ceramic-pads',
    sku: '13.0470-4884.2',
    oemNumbers: ['34116888457', '04465-33480', '8W0698151N'],
    name: 'Комплект тормозных колодок передних низкопылящих ATE Ceramic',
    brand: 'ATE',
    isOriginal: false,
    systemId: 'brakes',
    subcategoryId: 'brake-pads',
    price: 9650,
    stockCount: 19,
    deliveryDays: 0,
    popularity: 96,
    warrantyMonths: 12,
    illustrationType: 'brake_pads',
    specs: [
      { label: 'Фрикционный состав', value: 'Керамический компаунд Low-Dust' },
      { label: 'Ось установки', value: 'Передняя (комплект 4 шт. на ось)' },
      { label: 'Противоскрипные пластины', value: 'Двухслойные демпфирующие накладки' },
      { label: 'Подготовка под датчик', value: 'С пазом под электронный датчик износа' },
    ],
    description:
      'Тормозные колодки ATE Ceramic сохраняют колёсные диски чистыми от тёмной фрикционной пыли, обеспечивают бесшумное торможение и увеличенный ресурс тормозного диска.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive', 'bmw-3-g20-m340i'],
      },
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-f30',
        modificationIds: ['bmw-3-f30-320i-n20', 'bmw-3-f30-316i'],
      },
      {
        brandId: 'toyota',
        modelId: 'toyota-camry',
        generationId: 'toyota-camry-xv70',
        modificationIds: ['toyota-camry-xv70-25', 'toyota-camry-xv70-35'],
      },
      {
        brandId: 'audi',
        modelId: 'audi-a4',
        generationId: 'audi-a4-b9',
        modificationIds: ['audi-a4-b9-40tfsi', 'audi-a4-b9-45tfsi-quattro'],
      },
      {
        brandId: 'kia',
        modelId: 'kia-k5',
        generationId: 'kia-k5-dl3',
        modificationIds: ['kia-k5-dl3-25-gdi', 'kia-k5-dl3-20-mpi'],
      },
    ],
    analogPartIds: [],
  },

  // ================= ДВИГАТЕЛЬ И НАВЕСНОЕ (engine) =================
  {
    id: 'part-ina-timing-kit',
    sku: '530-0650-10',
    oemNumbers: ['11318648732', '11288604266', '04E198119A', '13506-25010'],
    name: 'Комплект привода ГРМ с натяжителем, направляющими и демпфером',
    brand: 'INA (Schaeffler)',
    isOriginal: false,
    systemId: 'engine',
    subcategoryId: 'belts-chains',
    price: 17900,
    stockCount: 7,
    deliveryDays: 0,
    popularity: 95,
    warrantyMonths: 24,
    illustrationType: 'timing_belt',
    specs: [
      { label: 'Состав комплекта', value: 'Цепь/ремень привода, гидравлический натяжитель, планки, крепёж' },
      { label: 'Ресурс по регламенту', value: '120 000 — 150 000 км' },
      { label: 'Стандарт качества', value: 'OEM поставщик сборочного конвейера' },
    ],
    description:
      'Полный сервисный комплект газораспределительного механизма INA. Все компоненты изготовлены из цементируемой легированной стали с прецизионной закалкой зубьев.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive'],
      },
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-f30',
        modificationIds: ['bmw-3-f30-320i-n20', 'bmw-3-f30-316i'],
      },
      {
        brandId: 'vw',
        modelId: 'vw-tiguan',
        generationId: 'vw-tiguan-ad1',
        modificationIds: ['vw-tiguan-ad1-14-czda', 'vw-tiguan-ad1-20-czpa'],
      },
      {
        brandId: 'vw',
        modelId: 'vw-polo',
        generationId: 'vw-polo-ck',
        modificationIds: ['vw-polo-ck-16-cwva', 'vw-polo-ck-14-czca'],
      },
    ],
    analogPartIds: [],
  },
  {
    id: 'part-elring-gasket-set',
    sku: '741.830',
    oemNumbers: ['11128638248', '11213-25010', '06K103483'],
    name: 'Комплект прокладок клапанной крышки и свечных колодцев Viton',
    brand: 'ELRING',
    isOriginal: false,
    systemId: 'engine',
    subcategoryId: 'gaskets-seals',
    price: 4250,
    stockCount: 16,
    deliveryDays: 0,
    popularity: 89,
    warrantyMonths: 12,
    illustrationType: 'timing_belt',
    specs: [
      { label: 'Материал уплотнения', value: 'Фторкаучук FPM (Viton) термостойкий до +220°C' },
      { label: 'Комплектность', value: 'Прокладка периметра + уплотнения свечных колодцев' },
    ],
    description:
      'Профильная эластомерная прокладка Elring из фторкаучука, устойчивая к агрессивным синтетическим ПАО-маслам и высоким термическим нагрузкам турбодвигателей.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-m340i'],
      },
      {
        brandId: 'toyota',
        modelId: 'toyota-camry',
        generationId: 'toyota-camry-xv70',
        modificationIds: ['toyota-camry-xv70-25'],
      },
      {
        brandId: 'audi',
        modelId: 'audi-a4',
        generationId: 'audi-a4-b9',
        modificationIds: ['audi-a4-b9-40tfsi', 'audi-a4-b9-45tfsi-quattro'],
      },
    ],
    analogPartIds: [],
  },
  {
    id: 'part-corteco-engine-mount',
    sku: '49389844',
    oemNumbers: ['22116860487', '22116860488', '12361-25010'],
    name: 'Гидравлическая опора двигателя правая с вакуумным управлением',
    brand: 'CORTECO',
    isOriginal: false,
    systemId: 'engine',
    subcategoryId: 'engine-mounts',
    price: 11400,
    stockCount: 5,
    deliveryDays: 1,
    popularity: 84,
    warrantyMonths: 24,
    illustrationType: 'control_arm',
    specs: [
      { label: 'Тип демпфера', value: 'Двухкамерная гидроопора' },
      { label: 'Корпус', value: 'Литой под давлением алюминий' },
    ],
    description:
      'Гидравлическая подушка двигателя Corteco (группа Freudenberg). Эффективно изолирует кузов автомобиля от вибраций холостого хода и рывков под нагрузкой.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive'],
      },
      {
        brandId: 'bmw',
        modelId: 'bmw-x5',
        generationId: 'bmw-x5-g05',
        modificationIds: ['bmw-x5-g05-30d', 'bmw-x5-g05-40i'],
      },
    ],
    analogPartIds: [],
  },

  // ================= ФИЛЬТРЫ, МАСЛА И РАСХОДНИКИ (maintenance) =================
  {
    id: 'part-mann-oil-filter',
    sku: 'HU 6022 Z',
    oemNumbers: ['11428575211', '04152-YZZA1', '06L115562B', '26300-35505'],
    name: 'Фильтр масляный картриджный с комплектом уплотнительных колец',
    brand: 'MANN-FILTER',
    isOriginal: false,
    systemId: 'maintenance',
    subcategoryId: 'filters',
    price: 1680,
    stockCount: 45,
    deliveryDays: 0,
    popularity: 100,
    warrantyMonths: 12,
    illustrationType: 'oil_filter',
    specs: [
      { label: 'Исполнение фильтра', value: 'Фильтр-патрон без металла (Energetic)' },
      { label: 'Тонкость отсева', value: '99.2% частиц > 12 мкм' },
      { label: 'В комплекте', value: 'Уплотнительное кольцо крышки стакана + медная шайба' },
    ],
    description:
      'Оригинальный по качеству масляный фильтр MANN-FILTER. Синтетическое фильтровальное полотно сохраняет пропускную способность при холодном пуске и длительных интервалах ТО.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive', 'bmw-3-g20-m340i'],
      },
      {
        brandId: 'bmw',
        modelId: 'bmw-x5',
        generationId: 'bmw-x5-g05',
        modificationIds: ['bmw-x5-g05-30d', 'bmw-x5-g05-40i'],
      },
      {
        brandId: 'toyota',
        modelId: 'toyota-camry',
        generationId: 'toyota-camry-xv70',
        modificationIds: ['toyota-camry-xv70-25', 'toyota-camry-xv70-35'],
      },
      {
        brandId: 'toyota',
        modelId: 'toyota-rav4',
        generationId: 'toyota-rav4-xa50',
        modificationIds: ['toyota-rav4-xa50-20-cvt', 'toyota-rav4-xa50-25-at'],
      },
      {
        brandId: 'vw',
        modelId: 'vw-tiguan',
        generationId: 'vw-tiguan-ad1',
        modificationIds: ['vw-tiguan-ad1-14-czda', 'vw-tiguan-ad1-20-czpa'],
      },
      {
        brandId: 'audi',
        modelId: 'audi-a4',
        generationId: 'audi-a4-b9',
        modificationIds: ['audi-a4-b9-40tfsi', 'audi-a4-b9-45tfsi-quattro'],
      },
      {
        brandId: 'kia',
        modelId: 'kia-k5',
        generationId: 'kia-k5-dl3',
        modificationIds: ['kia-k5-dl3-25-gdi', 'kia-k5-dl3-20-mpi'],
      },
    ],
    analogPartIds: [],
  },
  {
    id: 'part-liquimoly-synthoil-5w30',
    sku: '9077',
    oemNumbers: ['83212465849', '08880-83886', 'G052195M4'],
    name: 'Моторное масло ПАО-синтетическое Molygen New Generation 5W-30 (5 л)',
    brand: 'LIQUI MOLY',
    isOriginal: false,
    systemId: 'maintenance',
    subcategoryId: 'oils-fluids',
    price: 7890,
    oldPrice: 8600,
    stockCount: 31,
    deliveryDays: 0,
    popularity: 97,
    warrantyMonths: 36,
    illustrationType: 'motor_oil',
    specs: [
      { label: 'Объём канистры', value: '5 литров' },
      { label: 'Вязкость SAE', value: '5W-30' },
      { label: 'Допуски производителей', value: 'BMW Longlife-04, VW 504 00 / 507 00, API SP, ILSAC GF-6A' },
      { label: 'Температура застывания', value: '-45 °C' },
    ],
    description:
      'Высокотехнологичное синтетическое моторное масло с фирменным модификатором трения MFC. Снижает износ цилиндро-поршневой группы и защищает от эффекта LSPI в турбомоторах.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive', 'bmw-3-g20-m340i'],
      },
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-f30',
        modificationIds: ['bmw-3-f30-320i-n20', 'bmw-3-f30-316i'],
      },
      {
        brandId: 'bmw',
        modelId: 'bmw-x5',
        generationId: 'bmw-x5-g05',
        modificationIds: ['bmw-x5-g05-30d', 'bmw-x5-g05-40i'],
      },
      {
        brandId: 'toyota',
        modelId: 'toyota-camry',
        generationId: 'toyota-camry-xv70',
        modificationIds: ['toyota-camry-xv70-25', 'toyota-camry-xv70-35'],
      },
      {
        brandId: 'vw',
        modelId: 'vw-tiguan',
        generationId: 'vw-tiguan-ad1',
        modificationIds: ['vw-tiguan-ad1-14-czda', 'vw-tiguan-ad1-20-czpa'],
      },
      {
        brandId: 'audi',
        modelId: 'audi-a4',
        generationId: 'audi-a4-b9',
        modificationIds: ['audi-a4-b9-40tfsi', 'audi-a4-b9-45tfsi-quattro'],
      },
      {
        brandId: 'kia',
        modelId: 'kia-k5',
        generationId: 'kia-k5-dl3',
        modificationIds: ['kia-k5-dl3-25-gdi', 'kia-k5-dl3-20-mpi'],
      },
    ],
    analogPartIds: [],
  },
  {
    id: 'part-ngk-laser-iridium',
    sku: 'SILZKGR8B8S',
    oemNumbers: ['12120040551', '90919-01289', '06K905601B'],
    name: 'Свеча зажигания иридиевая Laser Iridium (комплект 4 шт.)',
    brand: 'NGK',
    isOriginal: false,
    systemId: 'maintenance',
    subcategoryId: 'spark-plugs',
    price: 8400,
    stockCount: 15,
    deliveryDays: 0,
    popularity: 91,
    warrantyMonths: 12,
    illustrationType: 'spark_plug',
    specs: [
      { label: 'Центральный электрод', value: 'Иридий 0.6 мм с лазерной сваркой' },
      { label: 'Боковой электрод', value: 'Платиновая напайка' },
      { label: 'Калильное число', value: '8 (для двигателей с непосредственным впрыском и турбонаддувом)' },
    ],
    description:
      'Комплект из 4 иридиевых свечей NGK Laser Iridium. Гарантирует стабильное искрообразование при высоком давлении наддува и экономию топлива.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i'],
      },
      {
        brandId: 'toyota',
        modelId: 'toyota-camry',
        generationId: 'toyota-camry-xv70',
        modificationIds: ['toyota-camry-xv70-25'],
      },
      {
        brandId: 'vw',
        modelId: 'vw-tiguan',
        generationId: 'vw-tiguan-ad1',
        modificationIds: ['vw-tiguan-ad1-14-czda', 'vw-tiguan-ad1-20-czpa'],
      },
      {
        brandId: 'audi',
        modelId: 'audi-a4',
        generationId: 'audi-a4-b9',
        modificationIds: ['audi-a4-b9-40tfsi', 'audi-a4-b9-45tfsi-quattro'],
      },
    ],
    analogPartIds: [],
  },

  // ================= ОХЛАЖДЕНИЕ И ОТОПЛЕНИЕ (cooling) =================
  {
    id: 'part-mahle-radiator',
    sku: 'CR 2145 000P',
    oemNumbers: ['17118672104', '16400-25130', '5Q0121251GN'],
    name: 'Радиатор охлаждения двигателя основной паяный алюминиевый Behr/Mahle',
    brand: 'MAHLE ORIGINAL',
    isOriginal: false,
    systemId: 'cooling',
    subcategoryId: 'radiators',
    price: 19600,
    stockCount: 5,
    deliveryDays: 1,
    popularity: 87,
    warrantyMonths: 24,
    illustrationType: 'radiator',
    specs: [
      { label: 'Размеры сердцевины', value: '600 x 458 x 32 мм' },
      { label: 'Технология сот', value: 'Цельнопаяный алюминий Nocolok' },
      { label: 'Линия качества', value: 'Behr Hella Service Premium Line' },
    ],
    description:
      'Основной радиатор системы охлаждения Mahle Original с увеличенной теплоотдачей для эксплуатации в городских пробках и жарком климате.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive', 'bmw-3-g20-m340i'],
      },
      {
        brandId: 'toyota',
        modelId: 'toyota-camry',
        generationId: 'toyota-camry-xv70',
        modificationIds: ['toyota-camry-xv70-25', 'toyota-camry-xv70-35'],
      },
      {
        brandId: 'vw',
        modelId: 'vw-tiguan',
        generationId: 'vw-tiguan-ad1',
        modificationIds: ['vw-tiguan-ad1-14-czda', 'vw-tiguan-ad1-20-czpa'],
      },
    ],
    analogPartIds: [],
  },

  // ================= ЭЛЕКТРИКА И ОСВЕЩЕНИЕ (electrical) =================
  {
    id: 'part-hella-led-headlight',
    sku: '1EX 014 890-211',
    oemNumbers: ['63118496133', '81145-33E10', '8W0941033'],
    name: 'Фара головного света адаптивная Matrix LED левая в сборе',
    brand: 'HELLA',
    isOriginal: true,
    systemId: 'electrical',
    subcategoryId: 'lighting',
    price: 74500,
    stockCount: 2,
    deliveryDays: 1,
    popularity: 83,
    warrantyMonths: 24,
    illustrationType: 'headlight',
    specs: [
      { label: 'Тип оптики', value: 'Адаптивная би-светодиодная (Adaptive LED)' },
      { label: 'Цветовая температура', value: '5700K (кристально-белый дневной свет)' },
      { label: 'Функции', value: 'ДХО, автокорректор, подсветка поворотов' },
    ],
    description:
      'Оригинальный блок фары Hella с проекционными линзами ближнего и дальнего света и характерной световой подписью ходовых огней.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive', 'bmw-3-g20-m340i'],
      },
      {
        brandId: 'audi',
        modelId: 'audi-a4',
        generationId: 'audi-a4-b9',
        modificationIds: ['audi-a4-b9-40tfsi', 'audi-a4-b9-45tfsi-quattro'],
      },
    ],
    analogPartIds: [],
  },

  // ================= РУЛЕВОЕ УПРАВЛЕНИЕ (steering) =================
  {
    id: 'part-zf-steering-tie-rod',
    sku: '42235-01',
    oemNumbers: ['32106883663', '45046-09800', '5Q0423811E'],
    name: 'Рулевая тяга в сборе с наконечником и защитным пыльником',
    brand: 'LEMFÖRDER / ZF',
    isOriginal: false,
    systemId: 'steering',
    subcategoryId: 'tie-rods',
    price: 5900,
    stockCount: 11,
    deliveryDays: 0,
    popularity: 88,
    warrantyMonths: 24,
    illustrationType: 'steering_rack',
    specs: [
      { label: 'Сторона установки', value: 'Передняя ось слева/справа' },
      { label: 'В комплекте', value: 'Рулевая тяга, наконечник, хомуты, гайка' },
    ],
    description:
      'Рулевая тяга с наконечником концерна ZF Friedrichshafen. Обеспечивает безлюфтовую передачу усилия от рулевой рейки к поворотному кулаку.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive', 'bmw-3-g20-m340i'],
      },
      {
        brandId: 'toyota',
        modelId: 'toyota-camry',
        generationId: 'toyota-camry-xv70',
        modificationIds: ['toyota-camry-xv70-25', 'toyota-camry-xv70-35'],
      },
      {
        brandId: 'vw',
        modelId: 'vw-tiguan',
        generationId: 'vw-tiguan-ad1',
        modificationIds: ['vw-tiguan-ad1-14-czda', 'vw-tiguan-ad1-20-czpa'],
      },
    ],
    analogPartIds: [],
  },

  // ================= ТРАНСМИССИЯ (transmission) =================
  {
    id: 'part-zf-at-service-kit',
    sku: '1087.298.365',
    oemNumbers: ['24118612901', '24115A13115', '35330-33110'],
    name: 'Сервисный комплект обслуживания АКПП (поддон-фильтр + 7 л масла Lifeguard 8)',
    brand: 'ZF',
    isOriginal: true,
    systemId: 'transmission',
    subcategoryId: 'at-service',
    price: 26800,
    stockCount: 10,
    deliveryDays: 0,
    popularity: 95,
    warrantyMonths: 24,
    illustrationType: 'clutch_kit',
    specs: [
      { label: 'Тип трансмиссии', value: '8-ступенчатая АКПП ZF 8HP50 / 8HP51 / 8HP76' },
      { label: 'Состав комплекта', value: 'Поддон с интегрированным фильтром, прокладка, 13 алюминиевых болтов, 7 л ZF LifeguardFluid 8' },
    ],
    description:
      'Оригинальный комплект ZF для регламентной замены масла в 8-ступенчатых автоматических коробках передач каждые 60 000 — 80 000 км пробега.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive', 'bmw-3-g20-m340i'],
      },
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-f30',
        modificationIds: ['bmw-3-f30-320i-n20', 'bmw-3-f30-316i'],
      },
      {
        brandId: 'bmw',
        modelId: 'bmw-x5',
        generationId: 'bmw-x5-g05',
        modificationIds: ['bmw-x5-g05-30d', 'bmw-x5-g05-40i'],
      },
    ],
    analogPartIds: [],
  },

  // ================= КУЗОВ (body) =================
  {
    id: 'part-m-perf-bumper-grille',
    sku: '51138072085',
    oemNumbers: ['51138072085', '51118069362', '53101-06E10'],
    name: 'Решётка радиатора и аэродинамический сплиттер переднего бампера Shadow Line',
    brand: 'BMW Original',
    isOriginal: true,
    systemId: 'body',
    subcategoryId: 'bumpers-grilles',
    price: 18500,
    stockCount: 4,
    deliveryDays: 1,
    popularity: 91,
    warrantyMonths: 24,
    illustrationType: 'bumper',
    specs: [
      { label: 'Материал', value: 'Ударопрочный ABS-пластик с покрытием черный рояльный лак' },
      { label: 'Совместимость с камерой', value: 'Штатное посадочное место под камеру кругового обзора 360°' },
      { label: 'Крепление', value: 'В заводские защёлки без доработок' },
    ],
    description:
      'Оригинальная решётка радиатора в исполнении High-Gloss Shadow Line. Устанавливается взамен хромированной детали в штатные посадочные точки.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive', 'bmw-3-g20-m340i'],
      },
    ],
    analogPartIds: [],
  },

  // ================= САЛОН (interior) =================
  {
    id: 'part-3d-cabin-mats',
    sku: '51472461168',
    oemNumbers: ['51472461168', '51472461169', 'PW210-33002'],
    name: 'Комплект всесезонных 3D-ковриков салона с высокими бортами и металлическим подпятником',
    brand: 'WeatherTech / OEM',
    isOriginal: true,
    systemId: 'interior',
    subcategoryId: 'mats-accessories',
    price: 12400,
    stockCount: 14,
    deliveryDays: 0,
    popularity: 89,
    warrantyMonths: 36,
    illustrationType: 'cabin_mat',
    specs: [
      { label: 'Комплектность', value: '4 коврика (передние + задний ряд)' },
      { label: 'Материал', value: 'Термопластичный эластомер TPE без запаха' },
      { label: 'Фиксация', value: 'Штатные клипсы Velcro / поворотные замки' },
    ],
    description:
      'Спроектированные по лазерному 3D-сканированию пола коврики идеально повторяют рельеф ниши для ног и удерживают влагу внутри глубоких ячеек.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive', 'bmw-3-g20-m340i'],
      },
      {
        brandId: 'toyota',
        modelId: 'toyota-camry',
        generationId: 'toyota-camry-xv70',
        modificationIds: ['toyota-camry-xv70-25', 'toyota-camry-xv70-35'],
      },
      {
        brandId: 'vw',
        modelId: 'vw-tiguan',
        generationId: 'vw-tiguan-ad1',
        modificationIds: ['vw-tiguan-ad1-14-czda', 'vw-tiguan-ad1-20-czpa'],
      },
    ],
    analogPartIds: [],
  },

  // ================= ВЫХЛОПНАЯ СИСТЕМА (exhaust) =================
  {
    id: 'part-remus-exhaust-muffler',
    sku: '086019-1500',
    oemNumbers: ['18308686274', '18302464498'],
    name: 'Задний глушитель из нержавеющей стали с управляемой заслонкой и карбоновыми насадками',
    brand: 'REMUS / M Performance',
    isOriginal: false,
    systemId: 'exhaust',
    subcategoryId: 'mufflers-pipes',
    price: 68900,
    stockCount: 3,
    deliveryDays: 2,
    popularity: 85,
    warrantyMonths: 24,
    illustrationType: 'exhaust_muffler',
    specs: [
      { label: 'Материал трассы', value: 'Аустенитная нержавеющая сталь AISI 304 с дробеструйной обработкой' },
      { label: 'Диаметр насадок', value: '2 x 90 мм (карбон + титановая гильза)' },
      { label: 'Управление звуком', value: 'Штатный сервопривод заслонки (Comfort / Sport)' },
    ],
    description:
      'Спортивная задняя часть выхлопной системы с пониженным противодавлением отработавших газов и глубоким басовитым тембром в режиме Sport.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-m340i'],
      },
    ],
    analogPartIds: [],
  },

  // ================= КОЛЁСА И ШИНЫ (wheels) =================
  {
    id: 'part-bbs-forged-wheel',
    sku: 'CI-R-19-85-ET30',
    oemNumbers: ['36118089892', '36118089893', '42611-06J30'],
    name: 'Диск колёсный легкосплавный Flow-Forming 8.5Jx19 5x112 ET30 Satin Anthracite',
    brand: 'BBS Germany',
    isOriginal: false,
    systemId: 'wheels',
    subcategoryId: 'alloy-wheels',
    price: 38400,
    stockCount: 8,
    deliveryDays: 0,
    popularity: 93,
    warrantyMonths: 24,
    illustrationType: 'alloy_wheel',
    specs: [
      { label: 'Параметры диска', value: '8.5J x R19, PCD 5x112, ET 30, DIA 66.6 мм' },
      { label: 'Технология', value: 'Ротационная вытяжка обода Flow-Forming' },
      { label: 'Масса диска', value: '9.8 кг (снижение неподрессоренных масс)' },
      { label: 'Защита кромки', value: 'Сменное лазерно-сварное кольцо из нержавейки' },
    ],
    description:
      'Легендарный Y-образный дизайн BBS CI-R с фрезерованными спицами для снижения веса и оптимального охлаждения суппортов тормозной системы.',
    compatibility: [
      {
        brandId: 'bmw',
        modelId: 'bmw-3',
        generationId: 'bmw-3-g20',
        modificationIds: ['bmw-3-g20-320i', 'bmw-3-g20-320d-xdrive', 'bmw-3-g20-m340i'],
      },
      {
        brandId: 'audi',
        modelId: 'audi-a4',
        generationId: 'audi-a4-b9',
        modificationIds: ['audi-a4-b9-40tfsi', 'audi-a4-b9-45tfsi-quattro'],
      },
      {
        brandId: 'vw',
        modelId: 'vw-tiguan',
        generationId: 'vw-tiguan-ad1',
        modificationIds: ['vw-tiguan-ad1-14-czda', 'vw-tiguan-ad1-20-czpa'],
      },
    ],
    analogPartIds: [],
  },
];

/**
 * Проверяет совместимость детали с выбранным автомобилем,
 * учитывая марку, модель, поколение и конкретную модификацию двигателя.
 * Никогда не утверждает полную совместимость только по марке автомобиля.
 */
export function evaluatePartCompatibility(
  part: AutoPart,
  vehicle: SelectedVehicle | null
): { status: CompatibilityStatus; label: string; detail: string } {
  if (!vehicle || !vehicle.brandId) {
    return {
      status: 'no_vehicle',
      label: 'Автомобиль не выбран',
      detail: 'Выберите марку, поколение и двигатель для проверки применимости',
    };
  }

  // Если выбрана только марка или модель без поколения или модификации
  if (!vehicle.modelId || !vehicle.generationId || !vehicle.modificationId) {
    const brandMatches = part.compatibility.some((c) => c.brandId === vehicle.brandId);
    if (brandMatches) {
      return {
        status: 'verify_required',
        label: 'Совместимость требует проверки',
        detail: 'Укажите поколение и модификацию двигателя для точного подтверждения',
      };
    }
    return {
      status: 'incompatible',
      label: 'Не подходит к выбранной марке',
      detail: `Деталь не предназначена для ${vehicle.brandName}`,
    };
  }

  // Ищем совпадение по марке, модели и поколению
  const genMatch = part.compatibility.find(
    (c) =>
      c.brandId === vehicle.brandId &&
      c.modelId === vehicle.modelId &&
      c.generationId === vehicle.generationId
  );

  if (genMatch) {
    // Проверяем точную модификацию двигателя/КПП
    if (genMatch.modificationIds && genMatch.modificationIds.includes(vehicle.modificationId)) {
      return {
        status: 'compatible',
        label: 'Точная совместимость подтверждена',
        detail:
          genMatch.notes ||
          `Подходит для ${vehicle.brandName} ${vehicle.modelName} (${vehicle.generationName}), ${vehicle.engine}`,
      };
    }
    // Поколение совпало, но конкретная модификация не подтверждена в списке
    return {
      status: 'verify_required',
      label: 'Совместимость требует проверки',
      detail: `Требуется сверка по OEM для двигателя ${vehicle.engine}`,
    };
  }

  // Проверяем, есть ли совпадение только по марке/модели (другое поколение)
  const modelMatch = part.compatibility.find(
    (c) => c.brandId === vehicle.brandId && c.modelId === vehicle.modelId
  );

  if (modelMatch) {
    return {
      status: 'verify_required',
      label: 'Совместимость требует проверки',
      detail: `Деталь рассчитана на другое поколение ${vehicle.brandName} ${vehicle.modelName}`,
    };
  }

  return {
    status: 'incompatible',
    label: 'Несовместимо с выбранным авто',
    detail: `Не подходит для ${vehicle.brandName} ${vehicle.modelName} ${vehicle.generationName}`,
  };
}
