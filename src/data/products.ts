import { asset } from '../lib/assets.ts'

export type Product = {
  id: string
  name: string
  composition: string
  price: number
  image: string
  roses: boolean
  mixed: boolean
  url: string
}

export const products: Product[] = [
  {
    id: 'volshebny',
    name: 'Волшебный',
    composition: '9 диантусов, фисташка, матовая плёнка и атласная лента',
    price: 2000,
    image: asset('assets/volshebny.jpeg'),
    roses: false,
    mixed: true,
    url: 'https://centrroznn.ru/catalog/monobukety/buket-volshebnyi-iz-9-diantusov.html',
  },
  {
    id: 'istoriya',
    name: 'История любви',
    composition: '11 роз 60 см, фисташка и декоративные ягоды',
    price: 2820,
    image: asset('assets/istoriya.jpg'),
    roses: true,
    mixed: true,
    url: 'https://centrroznn.ru/catalog/sbornye-bukety/buket-istoriya-lyubvi-s-rozami_3112.html',
  },
  {
    id: 'lunnyi',
    name: 'Лунный свет S',
    composition: 'Розы Софи Лорен, герберы и эвкалипт',
    price: 2410,
    image: asset('assets/lunnyi.jpg'),
    roses: true,
    mixed: true,
    url: 'https://centrroznn.ru/catalog/sbornye-bukety/buket-lunnyi-svet-s-s-rozami-sofi-loren-gerberami-i-evkaliptom.html',
  },
  {
    id: 'rozy-51',
    name: '51 роза',
    composition: 'Розы 60 см под ленту',
    price: 8210,
    image: asset('assets/rozy-51.jpeg'),
    roses: true,
    mixed: false,
    url: 'https://centrroznn.ru/catalog/monobukety/buket-51-roza-60-sm-pod-lentu.html',
  },
  {
    id: 'shik',
    name: 'Благородный шик',
    composition: 'Розы Софи Лорен, эустома и эвкалипт',
    price: 5020,
    image: asset('assets/shik.jpg'),
    roses: true,
    mixed: true,
    url: 'https://centrroznn.ru/catalog/sbornye-bukety/buket-blagorodnyi-shik-s-rozami-sofi-loren-eustomoi-i-evkaliptom.html',
  },
  {
    id: 'poceluy',
    name: 'Первый поцелуй',
    composition: 'Розы Софи Лорен, диантусы, ягодки и эвкалипт',
    price: 3470,
    image: asset('assets/poceluy.jpg'),
    roses: true,
    mixed: true,
    url: 'https://centrroznn.ru/catalog/sbornye-bukety/buket-pervyi-potselui-s-rozami-sofi-loren-diantusami-yagodkami-i-evkaliptom.html',
  },
  {
    id: 'noyabr',
    name: 'Сладкий ноябрь',
    composition: '21 роза 60 см в оформлении',
    price: 3760,
    image: asset('assets/noyabr.jpg'),
    roses: true,
    mixed: false,
    url: 'https://centrroznn.ru/catalog/monobukety/buket-sladkii-noyabr-iz-21-rozy-60-sm-v-foamirane_1731.html',
  },
  {
    id: 'rozy-15',
    name: '15 роз',
    composition: 'Розы с фисташкой и оформлением',
    price: 2510,
    image: asset('assets/rozy-15.jpg'),
    roses: true,
    mixed: false,
    url: 'https://centrroznn.ru/catalog/monobukety/buket-nedeli-15-roz-s-fistashkoi-i-oformleniem.html',
  },
]

export const productIds = new Set(products.map((product) => product.id))

export const featuredProducts = products.filter((product) =>
  ['istoriya', 'lunnyi', 'poceluy'].includes(product.id),
)

export type CatalogFilter = 'all' | 'roses' | 'bouquets' | 'under-3000'

export function filterProducts(list: Product[], query: string, filter: CatalogFilter): Product[] {
  const needle = query.trim().toLocaleLowerCase('ru-RU')
  return list.filter((product) => {
    const haystack = `${product.name} ${product.composition}`.toLocaleLowerCase('ru-RU')
    const matchesQuery = needle.length === 0 || haystack.includes(needle)
    const matchesFilter =
      filter === 'all' ||
      (filter === 'roses' && product.roses) ||
      (filter === 'bouquets' && product.mixed) ||
      (filter === 'under-3000' && product.price <= 3000)
    return matchesQuery && matchesFilter
  })
}

export function findProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}
