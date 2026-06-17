import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // ─── Products ────────────────────────────────────────────────────────────

  const products = [
    {
      slug: 'crossover',
      price: 52000,
      fromPrice: false,
      order: 1,
      images: [
        'https://ireland.apollo.olxcdn.com:443/v1/files/pc3cf0kotvgu3-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/z3o455trywsw2-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/gdiudoxfdqc31-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/4yn02zary0wn2-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/sn6txh0gk68f1-UA/image',
      ],
      content: [
        {
          lang: 'ua',
          name: 'Блокова рамка / Кросовер 115 кг × 2',
          shortDesc: 'Кросовер із двома блоками по 115 кг, підшипниковими роликами та нержавіючими направляючими',
          description: 'Кросовер із порошковим покриттям рами. Два стеки по 115 кг із фторопластовими втулками на нержавіючих направляючих. Ролики на підшипниках — плавний хід без заїдань. Поворотні вузли з пружинними фіксаторами, декілька варіантів рукояток та перекладина для підтягувань.',
          features: [
            'Два стеки по 115 кг',
            'Фторопластові втулки на нержавіючих направляючих',
            'Підшипникові ролики — плавний хід',
            'Поворотні вузли з пружинними фіксаторами',
            'Порошкове покриття рами',
            'Виготовлення під ваш дизайн та колір',
          ],
        },
        {
          lang: 'ru',
          name: 'Блочная рамка / Кроссовер 115 кг × 2',
          shortDesc: 'Кроссовер с двумя блоками по 115 кг, подшипниковыми роликами и нержавеющими направляющими',
          description: 'Кроссовер с порошковым покрытием рамы. Два стека по 115 кг с фторопластовыми втулками на нержавеющих направляющих. Ролики на подшипниках — плавный ход без заеданий. Поворотные узлы с пружинными фиксаторами, несколько вариантов рукояток и перекладина для подтягиваний.',
          features: [
            'Два стека по 115 кг',
            'Фторопластовые втулки на нержавеющих направляющих',
            'Подшипниковые ролики — плавный ход',
            'Поворотные узлы с пружинными фиксаторами',
            'Порошковое покрытие рамы',
            'Изготовление под ваш дизайн и цвет',
          ],
        },
        {
          lang: 'en',
          name: 'Cable Crossover 115 kg × 2',
          shortDesc: 'Crossover with dual 115 kg weight stacks, ball-bearing rollers, and stainless steel guides',
          description: 'Powder-coated cable crossover frame. Dual 115 kg weight stacks with fluoroplastic sleeves on stainless steel guides. Ball-bearing rollers ensure smooth operation. Adjustable turning nodes with spring fixators, multiple handle options and a pull-up bar included.',
          features: [
            'Dual 115 kg weight stacks',
            'Fluoroplastic sleeves on stainless steel guides',
            'Ball-bearing rollers for smooth operation',
            'Adjustable turning nodes with spring fixators',
            'Powder-coated frame',
            'Custom design and colors available',
          ],
        },
      ],
    },
    {
      slug: 'delta-machine',
      price: 43000,
      fromPrice: false,
      order: 2,
      images: [
        'https://ireland.apollo.olxcdn.com:443/v1/files/6kzk9runqycb2-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/ck58fpjqgynt3-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/8rt3sod87erm-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/0yucq65tlhlb2-UA/image',
      ],
      content: [
        {
          lang: 'ua',
          name: 'Тренажер на дельти/плечі — 7 в 1',
          shortDesc: 'Сім варіантів вправ для плечей та дельт в одному тренажері',
          description: 'Багатофункціональний тренажер для плечей із сімома варіантами вправ: жим сидячи з регульованим кутом спинки, підйоми на середні дельти сидячи, підйоми на задні дельти з нахилом сидячи, підйоми на середні дельти стоячи, підйоми на передні дельти, шраги стоячи, тяга до підборіддя.',
          features: [
            '7 варіантів вправ в одному тренажері',
            'Регульований кут спинки',
            'Якісна набивка та нержавіюча сталь',
            'Порошкове покриття',
            'Виготовлення під кольори вашого залу',
          ],
        },
        {
          lang: 'ru',
          name: 'Тренажёр на дельты/плечи — 7 в 1',
          shortDesc: 'Семь вариантов упражнений для плеч и дельт в одном тренажёре',
          description: 'Многофункциональный тренажёр для плеч с семью вариантами упражнений: жим сидя с регулируемым углом спинки, подъёмы на средние дельты сидя, подъёмы на задние дельты с наклоном сидя, подъёмы на средние дельты стоя, подъёмы на передние дельты, шраги стоя, тяга к подбородку.',
          features: [
            '7 вариантов упражнений в одном тренажёре',
            'Регулируемый угол спинки',
            'Качественная набивка и нержавеющая сталь',
            'Порошковое покрытие',
            'Изготовление под цвета вашего зала',
          ],
        },
        {
          lang: 'en',
          name: 'Shoulder & Deltoid Machine — 7-in-1',
          shortDesc: 'Seven exercise variations for shoulders and deltoids in one machine',
          description: 'Multifunctional shoulder machine with 7 exercise variations: seated press with adjustable backrest angle, seated middle deltoid raises, incline seated rear deltoid raises, standing middle deltoid raises, front raises, standing shrugs, and upright rows.',
          features: [
            '7 exercise variations in one machine',
            'Adjustable backrest angle',
            'Quality padding and stainless steel',
            'Powder coating',
            'Custom colors to match your gym',
          ],
        },
      ],
    },
    {
      slug: 'glute-bridge',
      price: 28000,
      fromPrice: false,
      order: 3,
      images: [
        'https://ireland.apollo.olxcdn.com:443/v1/files/d1zzqxpc3jpv-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/wkfzx3xyk12y-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/lvexquxshuhz1-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/ithlcm3hyvns3-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/wdkazxkcyo702-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/jn4wlthh6cfg-UA/image',
      ],
      content: [
        {
          lang: 'ua',
          name: 'Сідничний місток — тренажер для залів',
          shortDesc: 'Профільна конструкція з нержавіючими направляючими та алюмінієвими підніжками',
          description: 'Профіль 100/50/3.2 мм (можливі інші розміри). Нержавіючі направляючі, підшипники з фторопластовими втулками. Порошкове або рідинне покриття. Якісна набивка спинки, зносостійка вінілова шкіра. Рифлені алюмінієві підніжки. Частина виручки — на підтримку ЗСУ.',
          features: [
            'Профіль 100/50/3.2 мм',
            'Нержавіючі направляючі з фторопластовими підшипниками',
            'Рифлені алюмінієві підніжки',
            'Порошкове покриття',
            'Зносостійка вінілова шкіра',
            'Виготовлення за вашими кресленнями',
          ],
        },
        {
          lang: 'ru',
          name: 'Ягодичный мостик — тренажёр для залов',
          shortDesc: 'Профильная конструкция с нержавеющими направляющими и алюминиевыми подножками',
          description: 'Профиль 100/50/3.2 мм (возможны другие размеры). Нержавеющие направляющие, подшипники с фторопластовыми втулками. Порошковое или жидкостное покрытие. Качественная набивка спинки, износостойкая виниловая кожа. Рифлёные алюминиевые подножки. Часть выручки — на поддержку ЗСУ.',
          features: [
            'Профиль 100/50/3.2 мм',
            'Нержавеющие направляющие с фторопластовыми подшипниками',
            'Рифлёные алюминиевые подножки',
            'Порошковое покрытие',
            'Износостойкая виниловая кожа',
            'Изготовление по вашим чертежам',
          ],
        },
        {
          lang: 'en',
          name: 'Glute Bridge Machine — Gym Equipment',
          shortDesc: 'Structural profile with stainless steel guides and grated aluminum footplates',
          description: 'Profile pipe 100/50/3.2 mm (alternative sizes available). Stainless steel guides with fluoroplastic sleeve bearings. Powder or spray coating. High-quality backrest padding with durable vinyl leather. Grated aluminum footplates. Part of proceeds supports ZSU.',
          features: [
            '100/50/3.2 mm profile pipe',
            'Stainless steel guides with fluoroplastic bearings',
            'Grated aluminum footplates',
            'Powder coating',
            'Durable vinyl leather',
            'Custom manufacturing from your drawings',
          ],
        },
      ],
    },
    {
      slug: 'bench-press',
      price: 15000,
      fromPrice: false,
      order: 4,
      images: [
        'https://ireland.apollo.olxcdn.com:443/v1/files/bpibf63o5c39-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/m497pj702e8y2-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/s25or37evuch-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/vpecm1dp25u8-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/k5ps8pqq9g2y1-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/cgpsr2p6p2062-UA/image',
      ],
      content: [
        {
          lang: 'ua',
          name: 'Стійки + лава для жиму лежачи',
          shortDesc: 'Посилені стійки для жиму лежачи з регульованими страховками та педалями',
          description: 'Спортивне обладнання для залів, пауерліфтингу, армрестлингу та кросфіту. Посилені стійки для жиму лежачи. Деталі з нержавіючої трубки. Лава оббита якісним замінником шкіри на двошаровому матеріалі. Штирі для зберігання блинів, регульовані страхувальні жердини з педалями.',
          features: [
            'Посилена конструкція стійок',
            'Деталі з нержавіючої трубки',
            'Лава з якісним замінником шкіри',
            'Штирі для зберігання блинів',
            'Регульовані страхувальні жердини',
            'Педалі-страхувальники',
          ],
        },
        {
          lang: 'ru',
          name: 'Стойки + скамья для жима лёжа',
          shortDesc: 'Усиленные стойки для жима лёжа с регулируемыми страховками и педалями',
          description: 'Спортивное оборудование для залов, пауэрлифтинга, армрестлинга и кроссфита. Усиленные стойки для жима лёжа. Детали из нержавеющей трубки. Скамья обита качественным кожзамом на двухслойном материале. Штыри для хранения блинов, регулируемые страховочные жёрдочки с педалями.',
          features: [
            'Усиленная конструкция стоек',
            'Детали из нержавеющей трубки',
            'Скамья с качественным кожзамом',
            'Штыри для хранения блинов',
            'Регулируемые страховочные жёрдочки',
            'Педали-страховщики',
          ],
        },
        {
          lang: 'en',
          name: 'Squat Rack + Bench Press',
          shortDesc: 'Reinforced bench press rack with adjustable safety bars and spotter pedals',
          description: 'Sports equipment for gyms, powerlifting, armwrestling, and CrossFit. Reinforced squat racks. Stainless steel tubing on exposed parts. Bench upholstered with quality vinyl leather over dual-layer material. Weight plate storage pegs and adjustable safety bars with spotter pedals.',
          features: [
            'Reinforced rack construction',
            'Stainless steel tubing',
            'Quality vinyl leather bench',
            'Weight plate storage pegs',
            'Adjustable safety bars',
            'Spotter pedals',
          ],
        },
      ],
    },
    {
      slug: 'armwrestling-table',
      price: 9000,
      fromPrice: false,
      order: 5,
      images: [
        'https://ireland.apollo.olxcdn.com:443/v1/files/eeqasj7zyaiv1-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/6nxhlto4ey8j2-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/zqdw5j4vet7u1-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/z7vhmsxxlnub2-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/tqo6pa6cqqrx1-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/idgd2kcy5ju01-UA/image',
      ],
      content: [
        {
          lang: 'ua',
          name: 'Стіл для армрестлингу — змагальний посилений',
          shortDesc: 'Профіль 50×50 мм, гумові ніжки, 3-шарова ПВХ оббивка',
          description: 'Змагальний стіл із посиленою конструкцією. Профільна труба 50/50 мм, ніжки діаметром 48 мм. Гумові ніжки проти ковзання. Спинні панелі на металевій основі, кріплення на баранцях. 3-шарова оббивка, ПВХ тканина преміум-класу. Вибір кольору фарби та тканини. Доступні варіанти з автоматичними платформами.',
          features: [
            'Профіль 50/50 мм, ніжки 48 мм',
            'Гумові ніжки проти ковзання',
            '3-шарова ПВХ оббивка',
            'Кріплення спинних панелей на баранцях',
            'Вибір кольору фарби та тканини',
            'Варіанти з автоматичними платформами',
          ],
        },
        {
          lang: 'ru',
          name: 'Стол для армрестлинга — соревновательный усиленный',
          shortDesc: 'Профиль 50×50 мм, резиновые ножки, 3-слойная ПВХ обивка',
          description: 'Соревновательный стол с усиленной конструкцией. Профильная труба 50/50 мм, ножки диаметром 48 мм. Резиновые ножки против скольжения. Спинные панели на металлической основе, крепление на барашках. 3-слойная обивка, ПВХ ткань премиум-класса. Выбор цвета краски и ткани. Доступны варианты с автоматическими платформами.',
          features: [
            'Профиль 50/50 мм, ножки 48 мм',
            'Резиновые ножки против скольжения',
            '3-слойная ПВХ обивка',
            'Крепление спинных панелей на барашках',
            'Выбор цвета краски и ткани',
            'Варианты с автоматическими платформами',
          ],
        },
        {
          lang: 'en',
          name: 'Armwrestling Table — Competition Reinforced',
          shortDesc: '50×50 mm profile, rubberized legs, triple-layer premium PVC upholstery',
          description: 'Competition armwrestling table with reinforced construction. 50/50 mm profile tubing and 48 mm diameter legs. Rubberized non-slip feet. Backrest panels with metal bases, wing-nut secured. Triple-layer upholstery with premium PVC fabric. Custom paint and fabric colors. Optional automatic platform configurations.',
          features: [
            '50/50 mm profile, 48 mm legs',
            'Rubberized non-slip feet',
            'Triple-layer premium PVC upholstery',
            'Wing-nut secured backrest panels',
            'Custom paint and fabric colors',
            'Optional automatic platform configurations',
          ],
        },
      ],
    },
    {
      slug: 'armwrestling-attachments',
      price: 5000,
      fromPrice: true,
      order: 6,
      images: [
        'https://ireland.apollo.olxcdn.com:443/v1/files/fvmcb79qmgcl2-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/vc0cf5mrcdip-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/0ou025sssv9o2-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/l3gzo3cay4lv2-UA/image',
        'https://ireland.apollo.olxcdn.com:443/v1/files/jdrnyd32qx6x-UA/image',
      ],
      content: [
        {
          lang: 'ua',
          name: 'Столи, тренажери та приставки для армрестлингу',
          shortDesc: 'Широкий вибір обладнання для армрестлингу власного виробництва',
          description: 'Широкий вибір обладнання для армрестлингу та пауерліфтингу власного виробництва. В асортименті: посилені змагальні столи, стандартні столи, столи з гумовими ніжками та автоматичними платформами, різні приставки, механічні тренажери для рук, блокові машини. Усе обладнання з підшипниковими з\'єднаннями та нержавіючими направляючими.',
          features: [
            'Змагальні та стандартні столи',
            'Столи з автоматичними платформами',
            'Різні види приставок',
            'Механічні тренажери для рук',
            'Підшипникові з\'єднання',
            'Виготовлення під специфікацію',
          ],
        },
        {
          lang: 'ru',
          name: 'Столы, тренажёры и приставки для армрестлинга',
          shortDesc: 'Широкий выбор оборудования для армрестлинга собственного производства',
          description: 'Широкий выбор оборудования для армрестлинга и пауэрлифтинга собственного производства. В ассортименте: усиленные соревновательные столы, стандартные столы, столы с резиновыми ножками и автоматическими платформами, различные приставки, механические тренажёры для рук, блочные машины.',
          features: [
            'Соревновательные и стандартные столы',
            'Столы с автоматическими платформами',
            'Различные виды приставок',
            'Механические тренажёры для рук',
            'Подшипниковые соединения',
            'Изготовление под спецификацию',
          ],
        },
        {
          lang: 'en',
          name: 'Armwrestling Tables, Machines & Attachments',
          shortDesc: 'Wide selection of in-house manufactured armwrestling equipment',
          description: 'Wide selection of armwrestling and powerlifting equipment from own production. Range includes reinforced competition tables, standard tables, tables with automatic platforms, various attachments, mechanical arm trainers, and cable machines. All equipment features bearing joints, stainless steel guides, and PVC upholstery.',
          features: [
            'Competition and standard tables',
            'Tables with automatic platforms',
            'Various attachment types',
            'Mechanical arm trainers',
            'Bearing joint construction',
            'Custom manufacturing available',
          ],
        },
      ],
    },
  ]

  for (const prod of products) {
    const { content, ...productData } = prod
    const createdProduct = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: { ...productData },
      create: { ...productData },
    })

    for (const c of content) {
      const { productId: _pid, ...contentData } = c as any
      await prisma.productContent.upsert({
        where: { productId_lang: { productId: createdProduct.id, lang: c.lang } },
        update: contentData,
        create: { ...contentData, product: { connect: { id: createdProduct.id } } },
      })
    }
  }

  console.log(`Seeded ${products.length} products`)

  // ─── SiteContent ─────────────────────────────────────────────────────────

  const siteContent: Array<{ key: string; lang: string; value: string }> = [
    // ── UA ──
    { lang: 'ua', key: 'nav.home',         value: 'Головна' },
    { lang: 'ua', key: 'nav.eq',           value: 'Тренажери' },
    { lang: 'ua', key: 'nav.con',          value: 'Контакти' },
    { lang: 'ua', key: 'hero.eyebrow',     value: 'Власне виробництво' },
    { lang: 'ua', key: 'hero.title',       value: 'Тренажери для залів і клубів' },
    { lang: 'ua', key: 'hero.sub',         value: 'Проектуємо та виготовляємо спортивне обладнання для армрестлингу, пауерліфтингу та кросфіту. Під ваш дизайн та бюджет.' },
    { lang: 'ua', key: 'hero.cta',         value: 'Переглянути тренажери' },
    { lang: 'ua', key: 'hero.cta2',        value: 'Зв\'язатись' },
    { lang: 'ua', key: 'stats.0.value',    value: '6+' },
    { lang: 'ua', key: 'stats.0.label',    value: 'Видів тренажерів\nу каталозі' },
    { lang: 'ua', key: 'stats.1.value',    value: '100%' },
    { lang: 'ua', key: 'stats.1.label',    value: 'Власне\nвиробництво' },
    { lang: 'ua', key: 'stats.2.value',    value: 'Під замовлення' },
    { lang: 'ua', key: 'stats.2.label',    value: 'Будь-який дизайн\nта колір' },
    { lang: 'ua', key: 'stats.3.value',    value: 'ЗСУ' },
    { lang: 'ua', key: 'stats.3.label',    value: 'Частина виручки\nна підтримку' },
    { lang: 'ua', key: 'about.label',      value: 'Про компанію' },
    { lang: 'ua', key: 'about.title',      value: 'Виробляємо обладнання для серйозних тренувань' },
    { lang: 'ua', key: 'about.p1',         value: 'OgnevSport — виробник спортивного обладнання для залів, армрестлингу, пауерліфтингу та кросфіту. Ми не посередники — кожен тренажер виготовляємо самостійно на власному виробництві.' },
    { lang: 'ua', key: 'about.p2',         value: 'Для кожного замовника — індивідуальне виготовлення: ваш колір, ваш дизайн, ваші параметри. Якісні матеріали, порошкове покриття, деталі з нержавіючої сталі.' },
    { lang: 'ua', key: 'feat.0.name',      value: 'Власне виробництво' },
    { lang: 'ua', key: 'feat.0.desc',      value: 'Контроль якості на кожному етапі' },
    { lang: 'ua', key: 'feat.1.name',      value: 'Індивідуальний підхід' },
    { lang: 'ua', key: 'feat.1.desc',      value: 'Під ваш колір та дизайн залу' },
    { lang: 'ua', key: 'feat.2.name',      value: 'Широкий асортимент' },
    { lang: 'ua', key: 'feat.2.desc',      value: 'Армрестлинг, жим, кросфіт, ягодиці' },
    { lang: 'ua', key: 'featured.title',   value: 'Популярні тренажери' },
    { lang: 'ua', key: 'featured.link',    value: 'Весь каталог →' },
    { lang: 'ua', key: 'eq.title',         value: 'Каталог тренажерів' },
    { lang: 'ua', key: 'eq.sub',           value: 'Власне виробництво. Індивідуальне замовлення під ваш проект.' },
    { lang: 'ua', key: 'con.title',        value: 'Зв\'яжіться з нами' },
    { lang: 'ua', key: 'con.sub',          value: 'Заповніть форму — ми відповімо зручним для вас способом.' },
    { lang: 'ua', key: 'con.nameLbl',      value: 'Ім\'я' },
    { lang: 'ua', key: 'con.phoneLbl',     value: 'Телефон' },
    { lang: 'ua', key: 'con.methodLbl',    value: 'Спосіб зв\'язку' },
    { lang: 'ua', key: 'con.callOpt',      value: 'Дзвінок' },
    { lang: 'ua', key: 'con.msgLbl',       value: 'Повідомлення' },
    { lang: 'ua', key: 'con.msgPh',        value: 'Напишіть, що вас цікавить…' },
    { lang: 'ua', key: 'con.submit',       value: 'Надіслати' },
    { lang: 'ua', key: 'con.successT',     value: 'Дякуємо!' },
    { lang: 'ua', key: 'con.successS',     value: 'Ми зв\'яжемося з вами найближчим часом.' },
    { lang: 'ua', key: 'con.langLbl',      value: 'Мова' },
    { lang: 'ua', key: 'prod.badge',       value: 'Власне виробництво' },
    { lang: 'ua', key: 'prod.frm',         value: 'від' },
    { lang: 'ua', key: 'prod.uah',         value: 'грн' },
    { lang: 'ua', key: 'prod.order',       value: 'Замовити тренажер' },
    { lang: 'ua', key: 'prod.custom',      value: 'Можливе виготовлення під ваш дизайн та кольорову схему' },
    { lang: 'ua', key: 'prod.bhome',       value: 'Головна' },
    { lang: 'ua', key: 'prod.beq',         value: 'Тренажери' },
    { lang: 'ua', key: 'foot',             value: '© 2026 OgnevSport. Виробник тренажерів.' },

    // ── RU ──
    { lang: 'ru', key: 'nav.home',         value: 'Главная' },
    { lang: 'ru', key: 'nav.eq',           value: 'Тренажёры' },
    { lang: 'ru', key: 'nav.con',          value: 'Контакты' },
    { lang: 'ru', key: 'hero.eyebrow',     value: 'Собственное производство' },
    { lang: 'ru', key: 'hero.title',       value: 'Тренажёры для залов и клубов' },
    { lang: 'ru', key: 'hero.sub',         value: 'Проектируем и изготавливаем спортивное оборудование для армрестлинга, пауэрлифтинга и кроссфита. Под ваш дизайн и бюджет.' },
    { lang: 'ru', key: 'hero.cta',         value: 'Смотреть тренажёры' },
    { lang: 'ru', key: 'hero.cta2',        value: 'Связаться' },
    { lang: 'ru', key: 'stats.0.value',    value: '6+' },
    { lang: 'ru', key: 'stats.0.label',    value: 'Видов тренажёров\nв каталоге' },
    { lang: 'ru', key: 'stats.1.value',    value: '100%' },
    { lang: 'ru', key: 'stats.1.label',    value: 'Собственное\nпроизводство' },
    { lang: 'ru', key: 'stats.2.value',    value: 'По заказу' },
    { lang: 'ru', key: 'stats.2.label',    value: 'Любой дизайн\nи цвет' },
    { lang: 'ru', key: 'stats.3.value',    value: 'ЗСУ' },
    { lang: 'ru', key: 'stats.3.label',    value: 'Часть выручки\nна поддержку' },
    { lang: 'ru', key: 'about.label',      value: 'О компании' },
    { lang: 'ru', key: 'about.title',      value: 'Производим оборудование для серьёзных тренировок' },
    { lang: 'ru', key: 'about.p1',         value: 'OgnevSport — производитель спортивного оборудования для залов, армрестлинга, пауэрлифтинга и кроссфита. Мы не посредники — каждый тренажёр изготавливаем на собственном производстве.' },
    { lang: 'ru', key: 'about.p2',         value: 'Для каждого заказчика — индивидуальное изготовление: ваш цвет, ваш дизайн, ваши параметры. Качественные материалы, порошковое покрытие, детали из нержавеющей стали.' },
    { lang: 'ru', key: 'feat.0.name',      value: 'Собственное производство' },
    { lang: 'ru', key: 'feat.0.desc',      value: 'Контроль качества на каждом этапе' },
    { lang: 'ru', key: 'feat.1.name',      value: 'Индивидуальный подход' },
    { lang: 'ru', key: 'feat.1.desc',      value: 'Под ваш цвет и дизайн зала' },
    { lang: 'ru', key: 'feat.2.name',      value: 'Широкий ассортимент' },
    { lang: 'ru', key: 'feat.2.desc',      value: 'Армрестлинг, жим, кроссфит, ягодицы' },
    { lang: 'ru', key: 'featured.title',   value: 'Популярные тренажёры' },
    { lang: 'ru', key: 'featured.link',    value: 'Весь каталог →' },
    { lang: 'ru', key: 'eq.title',         value: 'Каталог тренажёров' },
    { lang: 'ru', key: 'eq.sub',           value: 'Собственное производство. Индивидуальный заказ под ваш проект.' },
    { lang: 'ru', key: 'con.title',        value: 'Свяжитесь с нами' },
    { lang: 'ru', key: 'con.sub',          value: 'Заполните форму — мы ответим удобным для вас способом.' },
    { lang: 'ru', key: 'con.nameLbl',      value: 'Имя' },
    { lang: 'ru', key: 'con.phoneLbl',     value: 'Телефон' },
    { lang: 'ru', key: 'con.methodLbl',    value: 'Способ связи' },
    { lang: 'ru', key: 'con.callOpt',      value: 'Звонок' },
    { lang: 'ru', key: 'con.msgLbl',       value: 'Сообщение' },
    { lang: 'ru', key: 'con.msgPh',        value: 'Напишите, что вас интересует…' },
    { lang: 'ru', key: 'con.submit',       value: 'Отправить' },
    { lang: 'ru', key: 'con.successT',     value: 'Спасибо!' },
    { lang: 'ru', key: 'con.successS',     value: 'Мы свяжемся с вами в ближайшее время.' },
    { lang: 'ru', key: 'con.langLbl',      value: 'Язык' },
    { lang: 'ru', key: 'prod.badge',       value: 'Собственное производство' },
    { lang: 'ru', key: 'prod.frm',         value: 'от' },
    { lang: 'ru', key: 'prod.uah',         value: 'грн' },
    { lang: 'ru', key: 'prod.order',       value: 'Заказать тренажёр' },
    { lang: 'ru', key: 'prod.custom',      value: 'Возможно изготовление под ваш дизайн и цветовую схему' },
    { lang: 'ru', key: 'prod.bhome',       value: 'Главная' },
    { lang: 'ru', key: 'prod.beq',         value: 'Тренажёры' },
    { lang: 'ru', key: 'foot',             value: '© 2026 OgnevSport. Производитель тренажёров.' },

    // ── EN ──
    { lang: 'en', key: 'nav.home',         value: 'Home' },
    { lang: 'en', key: 'nav.eq',           value: 'Equipment' },
    { lang: 'en', key: 'nav.con',          value: 'Contacts' },
    { lang: 'en', key: 'hero.eyebrow',     value: 'In-house manufacturing' },
    { lang: 'en', key: 'hero.title',       value: 'Custom Gym Equipment' },
    { lang: 'en', key: 'hero.sub',         value: 'We design and manufacture sports equipment for armwrestling, powerlifting, and CrossFit. Matched to your design and budget.' },
    { lang: 'en', key: 'hero.cta',         value: 'View equipment' },
    { lang: 'en', key: 'hero.cta2',        value: 'Contact us' },
    { lang: 'en', key: 'stats.0.value',    value: '6+' },
    { lang: 'en', key: 'stats.0.label',    value: 'Equipment types\nin catalog' },
    { lang: 'en', key: 'stats.1.value',    value: '100%' },
    { lang: 'en', key: 'stats.1.label',    value: 'Own\nmanufacturing' },
    { lang: 'en', key: 'stats.2.value',    value: 'Custom' },
    { lang: 'en', key: 'stats.2.label',    value: 'Any design\nand color' },
    { lang: 'en', key: 'stats.3.value',    value: 'ZSU' },
    { lang: 'en', key: 'stats.3.label',    value: 'Part of proceeds\nto support' },
    { lang: 'en', key: 'about.label',      value: 'About us' },
    { lang: 'en', key: 'about.title',      value: 'Manufacturing equipment for serious training' },
    { lang: 'en', key: 'about.p1',         value: 'OgnevSport is a manufacturer of sports equipment for gyms, armwrestling, powerlifting, and CrossFit. We are not intermediaries — every machine is made in our own facility.' },
    { lang: 'en', key: 'about.p2',         value: 'For every client — custom manufacturing: your color, your design, your specifications. Quality materials, powder coating, stainless steel components.' },
    { lang: 'en', key: 'feat.0.name',      value: 'Own manufacturing' },
    { lang: 'en', key: 'feat.0.desc',      value: 'Quality control at every stage' },
    { lang: 'en', key: 'feat.1.name',      value: 'Custom approach' },
    { lang: 'en', key: 'feat.1.desc',      value: 'Matched to your gym\'s design' },
    { lang: 'en', key: 'feat.2.name',      value: 'Wide range' },
    { lang: 'en', key: 'feat.2.desc',      value: 'Armwrestling, bench, CrossFit, glutes' },
    { lang: 'en', key: 'featured.title',   value: 'Featured equipment' },
    { lang: 'en', key: 'featured.link',    value: 'Full catalog →' },
    { lang: 'en', key: 'eq.title',         value: 'Equipment catalog' },
    { lang: 'en', key: 'eq.sub',           value: 'In-house manufacturing. Custom orders for your project.' },
    { lang: 'en', key: 'con.title',        value: 'Contact us' },
    { lang: 'en', key: 'con.sub',          value: 'Fill out the form and we\'ll reply through your preferred channel.' },
    { lang: 'en', key: 'con.nameLbl',      value: 'Name' },
    { lang: 'en', key: 'con.phoneLbl',     value: 'Phone' },
    { lang: 'en', key: 'con.methodLbl',    value: 'Contact method' },
    { lang: 'en', key: 'con.callOpt',      value: 'Phone call' },
    { lang: 'en', key: 'con.msgLbl',       value: 'Message' },
    { lang: 'en', key: 'con.msgPh',        value: 'Tell us what you\'re looking for…' },
    { lang: 'en', key: 'con.submit',       value: 'Send message' },
    { lang: 'en', key: 'con.successT',     value: 'Thank you!' },
    { lang: 'en', key: 'con.successS',     value: 'We\'ll get back to you shortly.' },
    { lang: 'en', key: 'con.langLbl',      value: 'Language' },
    { lang: 'en', key: 'prod.badge',       value: 'In-house manufacturing' },
    { lang: 'en', key: 'prod.frm',         value: 'from' },
    { lang: 'en', key: 'prod.uah',         value: 'UAH' },
    { lang: 'en', key: 'prod.order',       value: 'Order this machine' },
    { lang: 'en', key: 'prod.custom',      value: 'Custom manufacturing available to match your gym\'s design and colors' },
    { lang: 'en', key: 'prod.bhome',       value: 'Home' },
    { lang: 'en', key: 'prod.beq',         value: 'Equipment' },
    { lang: 'en', key: 'foot',             value: '© 2026 OgnevSport. Gym equipment manufacturer.' },
  ]

  for (const item of siteContent) {
    await prisma.siteContent.upsert({
      where: { key_lang: { key: item.key, lang: item.lang } },
      update: { value: item.value },
      create: item,
    })
  }

  console.log(`Seeded ${siteContent.length} site content entries`)

  // ─── SiteSettings ─────────────────────────────────────────────────────────

  const heroImages = JSON.stringify([
    'https://ireland.apollo.olxcdn.com:443/v1/files/pc3cf0kotvgu3-UA/image',
    'https://ireland.apollo.olxcdn.com:443/v1/files/bpibf63o5c39-UA/image',
    'https://ireland.apollo.olxcdn.com:443/v1/files/d1zzqxpc3jpv-UA/image',
  ])

  const siteSettings = [
    { key: 'heroVisible',     value: 'true' },
    { key: 'statsVisible',    value: 'true' },
    { key: 'aboutVisible',    value: 'true' },
    { key: 'productsVisible', value: 'true' },
    { key: 'heroImages',      value: heroImages },
  ]

  for (const setting of siteSettings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  console.log(`Seeded ${siteSettings.length} site settings`)
  console.log('Done!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
