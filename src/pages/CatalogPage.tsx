import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { filterProducts, products, type CatalogFilter, type Product } from '../data/products'
import { PRICE_NOTE } from '../data/salons'
import { useAppState } from '../state/store'
import { ProductCard } from '../components/ProductCard'
import { ProductModal } from '../components/ProductModal'

const filters: { id: CatalogFilter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'roses', label: 'Розы' },
  { id: 'bouquets', label: 'Букеты' },
  { id: 'under-3000', label: 'До 3 000 ₽' },
]

export function CatalogPage() {
  const { data, toggleFavorite } = useAppState()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<CatalogFilter>('all')
  const [opened, setOpened] = useState<Product | null>(null)
  const visible = useMemo(() => filterProducts(products, query, filter), [query, filter])

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Каталог</h1>
      <p className="mt-2 text-sm text-muted">Букеты «Дисконт Центр Роз» для демонстрации.</p>

      <div className="mt-6">
        <label htmlFor="catalog-search" className="mb-2 block text-sm font-medium">
          Поиск по названию и составу
        </label>
        <div className="relative">
          <Search aria-hidden="true" size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
          <input
            id="catalog-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Например, розы или эвкалипт"
            className="w-full rounded-2xl border border-line bg-white py-3 pr-4 pl-11 text-ink"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Фильтры каталога">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={`min-h-11 rounded-full px-4 text-sm ${
              filter === item.id ? 'bg-wine text-white' : 'border border-line bg-white text-ink'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 rounded-[18px] border border-line bg-white px-4 py-8 text-sm text-muted">
          Ничего не нашлось. Измените запрос или фильтр.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              favorite={data.favorites.includes(product.id)}
              onOpen={() => setOpened(product)}
              onToggleFavorite={() => toggleFavorite(product.id)}
            />
          ))}
        </div>
      )}

      <p className="mt-6 text-xs leading-5 text-muted">{PRICE_NOTE}</p>
      <ProductModal product={opened} onClose={() => setOpened(null)} />
    </div>
  )
}
