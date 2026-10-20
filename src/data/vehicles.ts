import { BodyStyle, VehicleBrand, SystemCategory, SelectedVehicle } from '../types/garage';

export const BODY_STYLE_LABELS: Record<BodyStyle, string> = {
  sedan: 'Седан',
  suv: 'Кроссовер / SUV',
  hatchback: 'Хэтчбек',
  coupe: 'Купе',
  minivan: 'Микроавтобус',
  pickup: 'Бортовой грузовик',
};

// Высокие кузова: на схематичной модели показываются с поднятой крышей
export const isTallBody = (style: BodyStyle): boolean =>
  style === 'suv' || style === 'minivan' || style === 'pickup';

export const VEHICLE_BRANDS: VehicleBrand[] = [
  // Марки и модели, распространённые на рынке Узбекистана
  {
    id: 'chevrolet',
    name: 'Chevrolet',
    country: 'Узбекистан',
    models: [
      {
        id: 'chevrolet-cobalt',
        name: 'Cobalt',
        generations: [
          {
            id: 'chevrolet-cobalt-2',
            name: 'II поколение (UzAuto Motors)',
            years: '2013 — н.в.',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'chevrolet-cobalt-2-15-mt',
                engine: '1.5 л B15D2 (106 л.с., Бензин)',
                powerHp: 106,
                transmission: '5-ст. МКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'LS / LT',
              },
              {
                id: 'chevrolet-cobalt-2-15-at',
                engine: '1.5 л B15D2 (106 л.с., Бензин)',
                powerHp: 106,
                transmission: '6-ст. АКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'LTZ',
              },
            ],
          },
        ],
      },
      {
        id: 'chevrolet-nexia',
        name: 'Nexia 3',
        generations: [
          {
            id: 'chevrolet-nexia-t250',
            name: 'Nexia 3 (T250)',
            years: '2016 — 2020',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'chevrolet-nexia-t250-15-mt',
                engine: '1.5 л B15D2 (106 л.с., Бензин)',
                powerHp: 106,
                transmission: '5-ст. МКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'LS / LT',
              },
              {
                id: 'chevrolet-nexia-t250-15-at',
                engine: '1.5 л B15D2 (106 л.с., Бензин)',
                powerHp: 106,
                transmission: '6-ст. АКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'LTZ',
              },
            ],
          },
        ],
      },
      {
        id: 'chevrolet-lacetti',
        name: 'Lacetti / Gentra',
        generations: [
          {
            id: 'chevrolet-gentra-j200',
            name: 'Gentra (UzAuto Motors)',
            years: '2013 — н.в.',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'chevrolet-gentra-15-mt',
                engine: '1.5 л B15D2 (107 л.с., Бензин)',
                powerHp: 107,
                transmission: '5-ст. МКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'Optimum',
              },
              {
                id: 'chevrolet-gentra-15-at',
                engine: '1.5 л B15D2 (107 л.с., Бензин)',
                powerHp: 107,
                transmission: '6-ст. АКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'Elegant',
              },
            ],
          },
          {
            id: 'chevrolet-lacetti-j200',
            name: 'Lacetti (J200)',
            years: '2004 — 2013',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'chevrolet-lacetti-16-mt',
                engine: '1.6 л F16D3 (109 л.с., Бензин)',
                powerHp: 109,
                transmission: '5-ст. МКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'SE',
              },
              {
                id: 'chevrolet-lacetti-18-at',
                engine: '1.8 л F18D3 (122 л.с., Бензин)',
                powerHp: 122,
                transmission: '4-ст. АКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'CDX',
              },
            ],
          },
        ],
      },
      {
        id: 'chevrolet-spark',
        name: 'Spark',
        generations: [
          {
            id: 'chevrolet-spark-m300',
            name: 'III поколение (M300)',
            years: '2010 — 2022',
            bodyStyle: 'hatchback',
            modifications: [
              {
                id: 'chevrolet-spark-m300-12-mt',
                engine: '1.25 л B12D1 (85 л.с., Бензин)',
                powerHp: 85,
                transmission: '5-ст. МКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'LS',
              },
              {
                id: 'chevrolet-spark-m300-12-at',
                engine: '1.25 л B12D1 (85 л.с., Бензин)',
                powerHp: 85,
                transmission: '4-ст. АКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'LT',
              },
            ],
          },
        ],
      },
      {
        id: 'chevrolet-onix',
        name: 'Onix',
        generations: [
          {
            id: 'chevrolet-onix-2',
            name: 'II поколение (UzAuto Motors)',
            years: '2023 — н.в.',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'chevrolet-onix-2-12t-at',
                engine: '1.2 л Turbo (132 л.с., Бензин)',
                powerHp: 132,
                transmission: '6-ст. АКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'LTZ',
              },
            ],
          },
        ],
      },
      {
        id: 'chevrolet-tracker',
        name: 'Tracker',
        generations: [
          {
            id: 'chevrolet-tracker-3',
            name: 'Tracker 2 (III поколение)',
            years: '2021 — н.в.',
            bodyStyle: 'suv',
            modifications: [
              {
                id: 'chevrolet-tracker-3-12t-at',
                engine: '1.2 л Turbo (132 л.с., Бензин)',
                powerHp: 132,
                transmission: '6-ст. АКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'Premier',
              },
            ],
          },
        ],
      },
      {
        id: 'chevrolet-malibu',
        name: 'Malibu',
        generations: [
          {
            id: 'chevrolet-malibu-9',
            name: 'Malibu 2 (IX поколение)',
            years: '2016 — 2023',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'chevrolet-malibu-9-15t-at',
                engine: '1.5 л Turbo LFV (163 л.с., Бензин)',
                powerHp: 163,
                transmission: '6-ст. АКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'LTZ',
              },
            ],
          },
          {
            id: 'chevrolet-malibu-8',
            name: 'Malibu (VIII поколение)',
            years: '2012 — 2016',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'chevrolet-malibu-8-24-at',
                engine: '2.4 л LE9 (167 л.с., Бензин)',
                powerHp: 167,
                transmission: '6-ст. АКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'LTZ',
              },
            ],
          },
        ],
      },
      {
        id: 'chevrolet-captiva',
        name: 'Captiva',
        generations: [
          {
            id: 'chevrolet-captiva-c140',
            name: 'C140 (рестайлинг)',
            years: '2011 — 2018',
            bodyStyle: 'suv',
            modifications: [
              {
                id: 'chevrolet-captiva-c140-24-fwd',
                engine: '2.4 л LE9 (167 л.с., Бензин)',
                powerHp: 167,
                transmission: '6-ст. АКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'LT',
              },
              {
                id: 'chevrolet-captiva-c140-24-awd',
                engine: '2.4 л LE9 (167 л.с., Бензин)',
                powerHp: 167,
                transmission: '6-ст. АКПП',
                drivetrain: 'Полный (AWD)',
                trim: 'LTZ',
              },
            ],
          },
        ],
      },
      {
        id: 'chevrolet-damas',
        name: 'Damas',
        generations: [
          {
            id: 'chevrolet-damas-1',
            name: 'Damas (микроавтобус)',
            years: '1996 — н.в.',
            bodyStyle: 'minivan',
            modifications: [
              {
                id: 'chevrolet-damas-08-mt',
                engine: '0.8 л F8C (38 л.с., Бензин)',
                powerHp: 38,
                transmission: '5-ст. МКПП',
                drivetrain: 'Задний (RWD)',
                trim: 'Van / Combi',
              },
            ],
          },
        ],
      },
      {
        id: 'chevrolet-labo',
        name: 'Labo',
        generations: [
          {
            id: 'chevrolet-labo-1',
            name: 'Labo (бортовой грузовик)',
            years: '1996 — н.в.',
            bodyStyle: 'pickup',
            modifications: [
              {
                id: 'chevrolet-labo-08-mt',
                engine: '0.8 л F8C (38 л.с., Бензин)',
                powerHp: 38,
                transmission: '5-ст. МКПП',
                drivetrain: 'Задний (RWD)',
                trim: 'Бортовой',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'daewoo',
    name: 'Daewoo',
    country: 'Узбекистан',
    models: [
      {
        id: 'daewoo-nexia',
        name: 'Nexia',
        generations: [
          {
            id: 'daewoo-nexia-n150',
            name: 'Nexia (N150, рестайлинг)',
            years: '2008 — 2016',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'daewoo-nexia-n150-15-8v',
                engine: '1.5 л A15SMS 8V (80 л.с., Бензин)',
                powerHp: 80,
                transmission: '5-ст. МКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'GL / GLE',
              },
              {
                id: 'daewoo-nexia-n150-16-16v',
                engine: '1.6 л F16D3 16V (109 л.с., Бензин)',
                powerHp: 109,
                transmission: '5-ст. МКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'GLE',
              },
            ],
          },
          {
            id: 'daewoo-nexia-n100',
            name: 'Nexia (N100)',
            years: '1995 — 2008',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'daewoo-nexia-n100-15-8v',
                engine: '1.5 л G15MF 8V (75 л.с., Бензин)',
                powerHp: 75,
                transmission: '5-ст. МКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'GL / GLE',
              },
            ],
          },
        ],
      },
      {
        id: 'daewoo-matiz',
        name: 'Matiz',
        generations: [
          {
            id: 'daewoo-matiz-m150',
            name: 'Matiz (M100 / M150)',
            years: '1998 — 2015',
            bodyStyle: 'hatchback',
            modifications: [
              {
                id: 'daewoo-matiz-08-mt',
                engine: '0.8 л F8CV (51 л.с., Бензин)',
                powerHp: 51,
                transmission: '5-ст. МКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'Best / Standard',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'byd',
    name: 'BYD',
    country: 'Китай',
    models: [
      {
        id: 'byd-chazor',
        name: 'Chazor',
        generations: [
          {
            id: 'byd-chazor-1',
            name: 'Chazor (Qin Plus DM-i)',
            years: '2024 — н.в.',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'byd-chazor-15-dmi',
                engine: '1.5 л DM-i, подключаемый гибрид (110 л.с. ДВС + электромотор)',
                powerHp: 110,
                transmission: 'E-CVT (DHT)',
                drivetrain: 'Передний (FWD)',
                trim: 'Flagship',
              },
            ],
          },
        ],
      },
      {
        id: 'byd-song-plus',
        name: 'Song Plus',
        generations: [
          {
            id: 'byd-song-plus-1',
            name: 'Song Plus',
            years: '2021 — н.в.',
            bodyStyle: 'suv',
            modifications: [
              {
                id: 'byd-song-plus-15-dmi',
                engine: '1.5 л DM-i, подключаемый гибрид (110 л.с. ДВС + электромотор)',
                powerHp: 110,
                transmission: 'E-CVT (DHT)',
                drivetrain: 'Передний (FWD)',
                trim: 'Flagship',
              },
              {
                id: 'byd-song-plus-ev',
                engine: 'Электромотор (204 л.с., EV)',
                powerHp: 204,
                transmission: 'Редуктор',
                drivetrain: 'Передний (FWD)',
                trim: 'Flagship EV',
              },
            ],
          },
        ],
      },
      {
        id: 'byd-han',
        name: 'Han',
        generations: [
          {
            id: 'byd-han-1',
            name: 'Han EV',
            years: '2020 — н.в.',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'byd-han-ev',
                engine: 'Электромотор (222 л.с., EV)',
                powerHp: 222,
                transmission: 'Редуктор',
                drivetrain: 'Передний (FWD)',
                trim: 'Long Range',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'chery',
    name: 'Chery',
    country: 'Китай',
    models: [
      {
        id: 'chery-tiggo-7-pro',
        name: 'Tiggo 7 Pro',
        generations: [
          {
            id: 'chery-tiggo-7-pro-1',
            name: 'Tiggo 7 Pro',
            years: '2020 — н.в.',
            bodyStyle: 'suv',
            modifications: [
              {
                id: 'chery-tiggo-7-pro-15t-cvt',
                engine: '1.5 л Turbo SQRE4T15C (147 л.с., Бензин)',
                powerHp: 147,
                transmission: 'Вариатор CVT',
                drivetrain: 'Передний (FWD)',
                trim: 'Prestige',
              },
            ],
          },
        ],
      },
      {
        id: 'chery-tiggo-4-pro',
        name: 'Tiggo 4 Pro',
        generations: [
          {
            id: 'chery-tiggo-4-pro-1',
            name: 'Tiggo 4 Pro',
            years: '2021 — н.в.',
            bodyStyle: 'suv',
            modifications: [
              {
                id: 'chery-tiggo-4-pro-15-mt',
                engine: '1.5 л SQRE4G15C (113 л.с., Бензин)',
                powerHp: 113,
                transmission: '5-ст. МКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'Comfort',
              },
              {
                id: 'chery-tiggo-4-pro-15-cvt',
                engine: '1.5 л SQRE4G15C (113 л.с., Бензин)',
                powerHp: 113,
                transmission: 'Вариатор CVT',
                drivetrain: 'Передний (FWD)',
                trim: 'Luxury',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'haval',
    name: 'Haval',
    country: 'Китай',
    models: [
      {
        id: 'haval-jolion',
        name: 'Jolion',
        generations: [
          {
            id: 'haval-jolion-1',
            name: 'Jolion',
            years: '2021 — н.в.',
            bodyStyle: 'suv',
            modifications: [
              {
                id: 'haval-jolion-15t-dct',
                engine: '1.5 л Turbo GW4G15K (143 л.с., Бензин)',
                powerHp: 143,
                transmission: '7-ст. робот DCT',
                drivetrain: 'Передний (FWD)',
                trim: 'Premium',
              },
            ],
          },
        ],
      },
      {
        id: 'haval-h6',
        name: 'H6',
        generations: [
          {
            id: 'haval-h6-3',
            name: 'III поколение',
            years: '2021 — н.в.',
            bodyStyle: 'suv',
            modifications: [
              {
                id: 'haval-h6-3-15t-dct',
                engine: '1.5 л Turbo (150 л.с., Бензин)',
                powerHp: 150,
                transmission: '7-ст. робот DCT',
                drivetrain: 'Передний (FWD)',
                trim: 'Premium',
              },
              {
                id: 'haval-h6-3-20t-awd',
                engine: '2.0 л Turbo (190 л.с., Бензин)',
                powerHp: 190,
                transmission: '7-ст. робот DCT',
                drivetrain: 'Полный (AWD)',
                trim: 'Tech Plus',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hyundai',
    name: 'Hyundai',
    country: 'Южная Корея',
    models: [
      {
        id: 'hyundai-elantra',
        name: 'Elantra',
        generations: [
          {
            id: 'hyundai-elantra-cn7',
            name: 'CN7 (VII поколение)',
            years: '2020 — н.в.',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'hyundai-elantra-cn7-16-at',
                engine: '1.6 л MPI (128 л.с., Бензин)',
                powerHp: 128,
                transmission: '6-ст. АКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'Comfort',
              },
              {
                id: 'hyundai-elantra-cn7-20-ivt',
                engine: '2.0 л MPI (149 л.с., Бензин)',
                powerHp: 149,
                transmission: 'Вариатор IVT',
                drivetrain: 'Передний (FWD)',
                trim: 'Prestige',
              },
            ],
          },
        ],
      },
      {
        id: 'hyundai-tucson',
        name: 'Tucson',
        generations: [
          {
            id: 'hyundai-tucson-nx4',
            name: 'NX4 (IV поколение)',
            years: '2021 — н.в.',
            bodyStyle: 'suv',
            modifications: [
              {
                id: 'hyundai-tucson-nx4-20-at',
                engine: '2.0 л MPI (150 л.с., Бензин)',
                powerHp: 150,
                transmission: '6-ст. АКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'Lifestyle',
              },
              {
                id: 'hyundai-tucson-nx4-25-awd',
                engine: '2.5 л GDI (190 л.с., Бензин)',
                powerHp: 190,
                transmission: '8-ст. АКПП',
                drivetrain: 'Полный (AWD)',
                trim: 'High-Tech',
              },
            ],
          },
        ],
      },
      {
        id: 'hyundai-sonata',
        name: 'Sonata',
        generations: [
          {
            id: 'hyundai-sonata-dn8',
            name: 'DN8 (VIII поколение)',
            years: '2019 — н.в.',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'hyundai-sonata-dn8-20-at',
                engine: '2.0 л MPI (150 л.с., Бензин)',
                powerHp: 150,
                transmission: '6-ст. АКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'Comfort',
              },
              {
                id: 'hyundai-sonata-dn8-25-at',
                engine: '2.5 л MPI (180 л.с., Бензин)',
                powerHp: 180,
                transmission: '8-ст. АКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'Prestige',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'lada',
    name: 'Lada',
    country: 'Россия',
    models: [
      {
        id: 'lada-granta',
        name: 'Granta',
        generations: [
          {
            id: 'lada-granta-fl',
            name: 'Granta (рестайлинг)',
            years: '2018 — н.в.',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'lada-granta-16-87',
                engine: '1.6 л ВАЗ-11186 8V (87 л.с., Бензин)',
                powerHp: 87,
                transmission: '5-ст. МКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'Classic',
              },
              {
                id: 'lada-granta-16-106',
                engine: '1.6 л ВАЗ-21127 16V (106 л.с., Бензин)',
                powerHp: 106,
                transmission: '5-ст. МКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'Comfort',
              },
            ],
          },
        ],
      },
      {
        id: 'lada-vesta',
        name: 'Vesta',
        generations: [
          {
            id: 'lada-vesta-1',
            name: 'Vesta (I поколение)',
            years: '2015 — 2022',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'lada-vesta-16-mt',
                engine: '1.6 л ВАЗ-21129 16V (106 л.с., Бензин)',
                powerHp: 106,
                transmission: '5-ст. МКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'Comfort',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'bmw',
    name: 'BMW',
    country: 'Германия',
    models: [
      {
        id: 'bmw-3',
        name: '3 серия',
        generations: [
          {
            id: 'bmw-3-g20',
            name: 'G20 / G21 (VII поколение)',
            years: '2018 — 2024',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'bmw-3-g20-320i',
                engine: '2.0 л B48B20 (184 л.с., Бензин)',
                powerHp: 184,
                transmission: '8-ст. АКПП Steptronic',
                drivetrain: 'Задний (RWD)',
                trim: 'M Sport Pure',
              },
              {
                id: 'bmw-3-g20-320d-xdrive',
                engine: '2.0 л B47D20 (190 л.с., Дизель)',
                powerHp: 190,
                transmission: '8-ст. АКПП Steptronic',
                drivetrain: 'Полный (xDrive)',
                trim: 'M Sport Pro',
              },
              {
                id: 'bmw-3-g20-m340i',
                engine: '3.0 л B58B30 (387 л.с., Бензин)',
                powerHp: 387,
                transmission: '8-ст. АКПП Sport',
                drivetrain: 'Полный (xDrive)',
                trim: 'M Performance',
              },
            ],
          },
          {
            id: 'bmw-3-f30',
            name: 'F30 / F31 (VI поколение)',
            years: '2011 — 2019',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'bmw-3-f30-320i-n20',
                engine: '2.0 л N20B20 (184 л.с., Бензин)',
                powerHp: 184,
                transmission: '8-ст. АКПП ZF',
                drivetrain: 'Полный (xDrive)',
                trim: 'Sport Line',
              },
              {
                id: 'bmw-3-f30-316i',
                engine: '1.6 л N13B16 (136 л.с., Бензин)',
                powerHp: 136,
                transmission: '8-ст. АКПП ZF',
                drivetrain: 'Задний (RWD)',
                trim: 'Base / SE',
              },
            ],
          },
        ],
      },
      {
        id: 'bmw-x5',
        name: 'X5',
        generations: [
          {
            id: 'bmw-x5-g05',
            name: 'G05 (IV поколение)',
            years: '2018 — 2024',
            bodyStyle: 'suv',
            modifications: [
              {
                id: 'bmw-x5-g05-30d',
                engine: '3.0 л B57D30 (249 л.с., Дизель)',
                powerHp: 249,
                transmission: '8-ст. АКПП Steptronic',
                drivetrain: 'Полный (xDrive)',
                trim: 'M Sport Plus',
              },
              {
                id: 'bmw-x5-g05-40i',
                engine: '3.0 л B58B30 (340 л.с., Бензин)',
                powerHp: 340,
                transmission: '8-ст. АКПП Steptronic',
                drivetrain: 'Полный (xDrive)',
                trim: 'xLine / Luxury',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'toyota',
    name: 'Toyota',
    country: 'Япония',
    models: [
      {
        id: 'toyota-camry',
        name: 'Camry',
        generations: [
          {
            id: 'toyota-camry-xv70',
            name: 'XV70 (VIII поколение)',
            years: '2017 — 2024',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'toyota-camry-xv70-25',
                engine: '2.5 л A25A-FKS (200 л.с., Бензин)',
                powerHp: 200,
                transmission: '8-ст. АКПП Direct Shift',
                drivetrain: 'Передний (FWD)',
                trim: 'GR Sport / Prestige',
              },
              {
                id: 'toyota-camry-xv70-35',
                engine: '3.5 л 2GR-FKS V6 (249 л.с., Бензин)',
                powerHp: 249,
                transmission: '8-ст. АКПП Direct Shift',
                drivetrain: 'Передний (FWD)',
                trim: 'Executive Safety',
              },
            ],
          },
          {
            id: 'toyota-camry-xv50',
            name: 'XV50 (VII поколение)',
            years: '2011 — 2018',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'toyota-camry-xv50-25-2ar',
                engine: '2.5 л 2AR-FE (181 л.с., Бензин)',
                powerHp: 181,
                transmission: '6-ст. АКПП U760E',
                drivetrain: 'Передний (FWD)',
                trim: 'Elegance Plus',
              },
            ],
          },
        ],
      },
      {
        id: 'toyota-rav4',
        name: 'RAV4',
        generations: [
          {
            id: 'toyota-rav4-xa50',
            name: 'XA50 (V поколение)',
            years: '2018 — 2024',
            bodyStyle: 'suv',
            modifications: [
              {
                id: 'toyota-rav4-xa50-20-cvt',
                engine: '2.0 л M20A-FKS (149 л.с., Бензин)',
                powerHp: 149,
                transmission: 'Вариатор Direct Shift-CVT',
                drivetrain: 'Полный (AWD)',
                trim: 'Comfort / Style',
              },
              {
                id: 'toyota-rav4-xa50-25-at',
                engine: '2.5 л A25A-FKS (199 л.с., Бензин)',
                powerHp: 199,
                transmission: '8-ст. АКПП UB80F',
                drivetrain: 'Полный (AWD)',
                trim: 'Prestige Safety',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'vw',
    name: 'Volkswagen',
    country: 'Германия',
    models: [
      {
        id: 'vw-tiguan',
        name: 'Tiguan',
        generations: [
          {
            id: 'vw-tiguan-ad1',
            name: 'II поколение (AD1 / Рестайлинг)',
            years: '2016 — 2023',
            bodyStyle: 'suv',
            modifications: [
              {
                id: 'vw-tiguan-ad1-14-czda',
                engine: '1.4 л TSI CZDA (150 л.с., Бензин)',
                powerHp: 150,
                transmission: '6-ст. РКПП DSG (DQ250)',
                drivetrain: 'Полный (4Motion)',
                trim: 'Respect / Status',
              },
              {
                id: 'vw-tiguan-ad1-20-czpa',
                engine: '2.0 л TSI CZPA (180 л.с., Бензин)',
                powerHp: 180,
                transmission: '7-ст. РКПП DSG (DQ500)',
                drivetrain: 'Полный (4Motion)',
                trim: 'R-Line / Exclusive',
              },
            ],
          },
        ],
      },
      {
        id: 'vw-polo',
        name: 'Polo',
        generations: [
          {
            id: 'vw-polo-ck',
            name: 'VI поколение (Лифтбек CK)',
            years: '2020 — 2023',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'vw-polo-ck-16-cwva',
                engine: '1.6 л MPI CWVA (110 л.с., Бензин)',
                powerHp: 110,
                transmission: '6-ст. АКПП Aisin',
                drivetrain: 'Передний (FWD)',
                trim: 'Status',
              },
              {
                id: 'vw-polo-ck-14-czca',
                engine: '1.4 л TSI CZCA (125 л.с., Бензин)',
                powerHp: 125,
                transmission: '7-ст. РКПП DSG (DQ200)',
                drivetrain: 'Передний (FWD)',
                trim: 'Exclusive',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'audi',
    name: 'Audi',
    country: 'Германия',
    models: [
      {
        id: 'audi-a4',
        name: 'A4',
        generations: [
          {
            id: 'audi-a4-b9',
            name: 'B9 (8W / V поколение)',
            years: '2015 — 2023',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'audi-a4-b9-40tfsi',
                engine: '2.0 л TFSI CVKB (190 л.с., Бензин)',
                powerHp: 190,
                transmission: '7-ст. РКПП S tronic',
                drivetrain: 'Передний (FWD)',
                trim: 'Advance / S line',
              },
              {
                id: 'audi-a4-b9-45tfsi-quattro',
                engine: '2.0 л TFSI CYMC (249 л.с., Бензин)',
                powerHp: 249,
                transmission: '7-ст. РКПП S tronic',
                drivetrain: 'Полный (quattro)',
                trim: 'Sport quattro',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'kia',
    name: 'Kia',
    country: 'Южная Корея',
    models: [
      {
        id: 'kia-k5',
        name: 'K5',
        generations: [
          {
            id: 'kia-k5-dl3',
            name: 'DL3 (III поколение)',
            years: '2020 — 2024',
            bodyStyle: 'sedan',
            modifications: [
              {
                id: 'kia-k5-dl3-25-gdi',
                engine: '2.5 л G4KN Smartstream (194 л.с., Бензин)',
                powerHp: 194,
                transmission: '8-ст. АКПП A8LF1',
                drivetrain: 'Передний (FWD)',
                trim: 'GT Line+',
              },
              {
                id: 'kia-k5-dl3-20-mpi',
                engine: '2.0 л G4NA MPI (150 л.с., Бензин)',
                powerHp: 150,
                transmission: '6-ст. АКПП A6MF1',
                drivetrain: 'Передний (FWD)',
                trim: 'Luxe / Prestige',
              },
            ],
          },
        ],
      },
      {
        id: 'kia-sportage',
        name: 'Sportage',
        generations: [
          {
            id: 'kia-sportage-nq5',
            name: 'NQ5 (V поколение)',
            years: '2021 — н.в.',
            bodyStyle: 'suv',
            modifications: [
              {
                id: 'kia-sportage-nq5-20-at',
                engine: '2.0 л MPI (150 л.с., Бензин)',
                powerHp: 150,
                transmission: '6-ст. АКПП',
                drivetrain: 'Передний (FWD)',
                trim: 'Comfort',
              },
              {
                id: 'kia-sportage-nq5-25-awd',
                engine: '2.5 л GDI (190 л.с., Бензин)',
                powerHp: 190,
                transmission: '8-ст. АКПП',
                drivetrain: 'Полный (AWD)',
                trim: 'Prestige',
              },
            ],
          },
        ],
      },
    ],
  },
];

// Автомобиль по умолчанию — самая массовая модель на рынке Узбекистана
export const DEFAULT_VEHICLE: SelectedVehicle = buildSelectedVehicle(
  'chevrolet',
  'chevrolet-cobalt',
  'chevrolet-cobalt-2',
  'chevrolet-cobalt-2-15-at'
)!;

export const GARAGE_SYSTEMS: SystemCategory[] = [
  {
    id: 'suspension',
    name: 'Ходовая часть и подвеска',
    shortName: 'Подвеска',
    description: 'Амортизаторы, пружины, рычаги, шаровые опоры, стабилизаторы и ступичные узлы.',
    hotspotPosition: [1.05, 0.42, 1.38],
    cameraTarget: [0.85, 0.42, 1.35],
    cameraPosition: [2.8, 1.25, 2.55],
    svgCoords: { x: 25, y: 69 },
    subcategories: [
      { id: 'shock-absorbers', name: 'Амортизаторы и стойки', systemId: 'suspension', description: 'Газомасляные стойки, пружины, пыльники и отбойники' },
      { id: 'control-arms', name: 'Рычаги и сайлентблоки', systemId: 'suspension', description: 'Поперечные и продольные рычаги, резинометаллические шарниры' },
      { id: 'ball-joints', name: 'Шаровые опоры и стойки стабилизатора', systemId: 'suspension', description: 'Шаровые шарниры, тяги и втулки стабилизатора' },
      { id: 'wheel-hubs', name: 'Ступицы и подшипники', systemId: 'suspension', description: 'Ступичные узлы в сборе и комплекты подшипников' },
    ],
  },
  {
    id: 'engine',
    name: 'Двигатель и навесное оборудование',
    shortName: 'Двигатель',
    description: 'Привод ГРМ, прокладки, опоры двигателя, поршневая группа, турбокомпрессоры.',
    hotspotPosition: [0.0, 0.85, 1.52],
    cameraTarget: [0.0, 0.78, 1.4],
    cameraPosition: [1.9, 1.75, 3.2],
    svgCoords: { x: 22, y: 45 },
    subcategories: [
      { id: 'belts-chains', name: 'Ремни, цепи и ролики ГРМ', systemId: 'engine', description: 'Комплекты ГРМ, поликлиновые ремни, натяжители' },
      { id: 'gaskets-seals', name: 'Прокладки и сальники', systemId: 'engine', description: 'Прокладки ГБЦ, клапанной крышки, маслосъёмные колпачки' },
      { id: 'engine-mounts', name: 'Опоры двигателя', systemId: 'engine', description: 'Гидроопоры и подушки крепления силового агрегата' },
      { id: 'pistons-valves', name: 'Поршневая группа и ГРМ', systemId: 'engine', description: 'Поршни, кольца, клапаны, гидрокомпенсаторы' },
    ],
  },
  {
    id: 'brakes',
    name: 'Тормозная система',
    shortName: 'Тормоза',
    description: 'Тормозные диски, колодки, суппорты, датчики износа и тормозные шланги.',
    hotspotPosition: [-1.05, 0.38, 1.38],
    cameraTarget: [-0.85, 0.38, 1.35],
    cameraPosition: [-2.7, 1.1, 2.3],
    svgCoords: { x: 29, y: 74 },
    subcategories: [
      { id: 'brake-discs', name: 'Тормозные диски', systemId: 'brakes', description: 'Вентилируемые и перфорированные диски передней и задней оси' },
      { id: 'brake-pads', name: 'Тормозные колодки', systemId: 'brakes', description: 'Керамические и низкометаллические комплекты колодок' },
      { id: 'brake-calipers', name: 'Суппорты и ремкомплекты', systemId: 'brakes', description: 'Тормозные суппорты, направляющие и поршни' },
    ],
  },
  {
    id: 'maintenance',
    name: 'Фильтры, масла и расходники',
    shortName: 'Расходники ТО',
    description: 'Моторные и трансмиссионные масла, масляные, воздушные и салонные фильтры, свечи.',
    hotspotPosition: [0.45, 0.88, 1.25],
    cameraTarget: [0.3, 0.8, 1.2],
    cameraPosition: [2.2, 1.8, 2.9],
    svgCoords: { x: 32, y: 39 },
    subcategories: [
      { id: 'filters', name: 'Фильтры (масляные, воздушные, салонные)', systemId: 'maintenance', description: 'Оригинальные фильтрующие элементы для планового ТО' },
      { id: 'oils-fluids', name: 'Моторные масла и техжидкости', systemId: 'maintenance', description: 'Синтетические масла, антифризы и тормозные жидкости' },
      { id: 'spark-plugs', name: 'Свечи зажигания и накаливания', systemId: 'maintenance', description: 'Иридиевые и платиновые свечи зажигания' },
    ],
  },
  {
    id: 'steering',
    name: 'Рулевое управление',
    shortName: 'Рулевое',
    description: 'Рулевые рейки, тяги, наконечники, насосы ГУР и электроусилители.',
    hotspotPosition: [0.42, 0.58, 0.92],
    cameraTarget: [0.35, 0.55, 0.9],
    cameraPosition: [2.5, 1.4, 2.2],
    svgCoords: { x: 37, y: 54 },
    subcategories: [
      { id: 'steering-racks', name: 'Рулевые рейки и валы', systemId: 'steering', description: 'Рейки с ЭУР и ГУР в сборе, рулевые карданы' },
      { id: 'tie-rods', name: 'Рулевые тяги и наконечники', systemId: 'steering', description: 'Наконечники рулевых тяг, пыльники рейки' },
    ],
  },
  {
    id: 'transmission',
    name: 'Трансмиссия',
    shortName: 'Трансмиссия',
    description: 'Сцепление, маховики, приводы, ШРУСы, комплекты обслуживания АКПП и DSG.',
    hotspotPosition: [0.0, 0.45, 0.15],
    cameraTarget: [0.0, 0.45, 0.15],
    cameraPosition: [2.7, 1.3, 1.5],
    svgCoords: { x: 49, y: 63 },
    subcategories: [
      { id: 'clutch-flywheel', name: 'Сцепление и маховики', systemId: 'transmission', description: 'Комплекты сцепления, двухмассовые маховики, выжимные подшипники' },
      { id: 'cv-joints', name: 'Приводы и ШРУСы', systemId: 'transmission', description: 'Приводные валы в сборе, наружные и внутренние гранаты' },
      { id: 'at-service', name: 'Поддоны и фильтры АКПП', systemId: 'transmission', description: 'Сервисные комплекты замены масла АКПП и РКПП' },
    ],
  },
  {
    id: 'cooling',
    name: 'Охлаждение и отопление',
    shortName: 'Охлаждение',
    description: 'Радиаторы охлаждения, водяные помпы, термостаты, компрессоры кондиционера.',
    hotspotPosition: [0.0, 0.65, 2.02],
    cameraTarget: [0.0, 0.62, 1.9],
    cameraPosition: [1.6, 1.35, 3.6],
    svgCoords: { x: 14, y: 54 },
    subcategories: [
      { id: 'radiators', name: 'Радиаторы и вентиляторы', systemId: 'cooling', description: 'Основные радиаторы, интеркулеры и конденсоры кондиционера' },
      { id: 'water-pumps', name: 'Помпы и термостаты', systemId: 'cooling', description: 'Механические и электрические насосы охлаждающей жидкости' },
    ],
  },
  {
    id: 'electrical',
    name: 'Электрика и освещение',
    shortName: 'Электрика',
    description: 'Фары, фонари, генераторы, стартеры, аккумуляторы, датчики и блоки управления.',
    hotspotPosition: [-0.72, 0.68, 1.96],
    cameraTarget: [-0.6, 0.65, 1.85],
    cameraPosition: [-2.1, 1.3, 3.4],
    svgCoords: { x: 13, y: 47 },
    subcategories: [
      { id: 'lighting', name: 'Фары, фонари и лампы', systemId: 'electrical', description: 'Головная LED/Laser оптика, задние фонари, блоки розжига' },
      { id: 'starters-alternators', name: 'Генераторы, стартеры и АКБ', systemId: 'electrical', description: 'AGM аккумуляторы, стартеры и генераторы в сборе' },
      { id: 'sensors', name: 'Датчики и катушки зажигания', systemId: 'electrical', description: 'Катушки зажигания, лямбда-зонды, датчики ABS и ДМРВ' },
    ],
  },
  {
    id: 'body',
    name: 'Кузов',
    shortName: 'Кузов',
    description: 'Бамперы, крылья, капоты, зеркала заднего вида, решётки радиатора и остекление.',
    hotspotPosition: [0.85, 0.82, 0.6],
    cameraTarget: [0.65, 0.8, 0.5],
    cameraPosition: [2.9, 1.55, 2.1],
    svgCoords: { x: 43, y: 36 },
    subcategories: [
      { id: 'bumpers-grilles', name: 'Бамперы и решётки', systemId: 'body', description: 'Передние и задние бамперы, диффузоры, решётки радиатора' },
      { id: 'hoods-fenders', name: 'Капоты, крылья и двери', systemId: 'body', description: 'Кузовные панели из алюминия и оцинкованной стали' },
      { id: 'mirrors-glass', name: 'Зеркала и стёкла', systemId: 'body', description: 'Боковые зеркала с обогревом, лобовые стёкла, щётки стеклоочистителя' },
    ],
  },
  {
    id: 'interior',
    name: 'Салон',
    shortName: 'Салон',
    description: 'Сиденья, коврики, рулевые колёса, органы управления и элементы отделки.',
    hotspotPosition: [0.0, 1.16, -0.15],
    cameraTarget: [0.0, 1.0, -0.15],
    cameraPosition: [2.3, 1.85, 1.2],
    svgCoords: { x: 55, y: 31 },
    subcategories: [
      { id: 'mats-accessories', name: 'Коврики и защита салона', systemId: 'interior', description: 'Полиуретановые и ворсовые 3D-коврики в салон и багажник' },
      { id: 'trim-controls', name: 'Ручки, кнопки и отделка', systemId: 'interior', description: 'Декоративные планки, селекторы КПП, подрулевые переключатели' },
    ],
  },
  {
    id: 'exhaust',
    name: 'Выхлопная система',
    shortName: 'Выхлоп',
    description: 'Глушители, резонаторы, катализаторы, гофры, насадки и прокладки приёмной трубы.',
    hotspotPosition: [0.55, 0.36, -2.02],
    cameraTarget: [0.35, 0.4, -1.9],
    cameraPosition: [2.2, 1.2, -3.4],
    svgCoords: { x: 87, y: 69 },
    subcategories: [
      { id: 'mufflers-pipes', name: 'Глушители и резонаторы', systemId: 'exhaust', description: 'Задние банки глушителя, спортивные трассы и резонаторы' },
      { id: 'catalysts-gaskets', name: 'Катализаторы, гофры и хомуты', systemId: 'exhaust', description: 'Эластичные муфты, термопрокладки и крепёж выхлопа' },
    ],
  },
  {
    id: 'wheels',
    name: 'Колёса и шины',
    shortName: 'Колёса и шины',
    description: 'Литые и кованые диски, шины, датчики давления TPMS, колёсные болты и секретки.',
    hotspotPosition: [1.05, 0.42, -1.38],
    cameraTarget: [0.85, 0.42, -1.35],
    cameraPosition: [2.8, 1.15, -2.4],
    svgCoords: { x: 75, y: 69 },
    subcategories: [
      { id: 'alloy-wheels', name: 'Колёсные диски и крепёж', systemId: 'wheels', description: 'Легкосплавные диски, датчики давления TPMS, болты-секретки' },
      { id: 'tires', name: 'Летние и зимние шины', systemId: 'wheels', description: 'Низкопрофильные и всесезонные шины с омологацией' },
    ],
  },
];

/**
 * Собирает SelectedVehicle по идентификаторам из справочника VEHICLE_BRANDS.
 * Возвращает null, если марка или модель не найдены. Поколение и модификация
 * необязательны: при их отсутствии поля остаются пустыми.
 */
export function buildSelectedVehicle(
  brandId: string,
  modelId: string,
  generationId: string,
  modificationId: string
): SelectedVehicle | null {
  const brandObj = VEHICLE_BRANDS.find((b) => b.id === brandId);
  const modelObj = brandObj?.models.find((m) => m.id === modelId);
  if (!brandObj || !modelObj) return null;
  const genObj = modelObj.generations.find((g) => g.id === generationId);
  const modObj = genObj?.modifications.find((mod) => mod.id === modificationId);

  return {
    brandId: brandObj.id,
    brandName: brandObj.name,
    modelId: modelObj.id,
    modelName: modelObj.name,
    generationId: genObj?.id || '',
    generationName: genObj?.name || '',
    years: genObj?.years || '',
    bodyStyle: genObj?.bodyStyle || 'sedan',
    modificationId: modObj?.id || '',
    engine: modObj?.engine || 'Модификация не указана',
    transmission: modObj?.transmission || '',
    drivetrain: modObj?.drivetrain || '',
    trim: modObj?.trim || '',
  };
}
