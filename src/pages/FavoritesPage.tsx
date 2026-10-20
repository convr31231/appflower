import { useState } from 'react'
import { Link } from 'react-router-dom'
import { findProduct } from '../data/products'
import { PRICE_NOTE } from '../data/salons'
import { ProductCard } from '../components/ProductCard'
import { ProductModal } from '../components/ProductModal'
import { useAppState } from '../state/store'
import type { Product } from '../data/products'

export function FavoritesPage() {
  const { data, toggleFavorite } = useAppState()
  const [opened, setOpened] = useState<Product | null>(null)
  const items = data.favorites.map((id) => findProduct(id)).filter((item): item is Product => Boolean(item))

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Избранное</h1>
      {items.length === 0 ? (
        <div className="mt-6 rounded-[22px] border border-line bg-white px-5 py-10">
          <p className="font-display text-2xl font-semibold">В избранном пока пусто</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted">
            Отметьте сердечком букеты, которые хотите сохранить в этой демонстрации.
          </p>
          <Link
            to="/catalog"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl bg-wine px-5 py-3 text-sm font-medium text-white"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                favorite
                onOpen={() => setOpened(product)}
                onToggleFavorite={() => toggleFavorite(product.id)}
              />
            ))}
          </div>
          <p className="mt-6 text-xs leading-5 text-muted">{PRICE_NOTE}</p>
        </>
      )}
      <ProductModal product={opened} onClose={() => setOpened(null)} />
    </div>
  )
}
