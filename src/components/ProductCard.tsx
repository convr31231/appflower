import { Heart } from 'lucide-react'
import { accrualBonuses } from '../lib/bonuses'
import { formatBonuses, formatRub } from '../lib/format'
import type { Product } from '../data/products'

type ProductCardProps = {
  product: Product
  favorite: boolean
  onOpen: () => void
  onToggleFavorite: () => void
}

export function ProductCard({ product, favorite, onOpen, onToggleFavorite }: ProductCardProps) {
  const bonus = accrualBonuses(product.price)

  return (
    <article className="relative overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_8px_24px_rgba(48,40,43,0.05)]">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <img
          src={product.image}
          alt={`Букет «${product.name}»`}
          className="aspect-[3/4] w-full object-cover"
        />
        <div className="space-y-1 px-3 py-3 pr-4">
          <h3 className="font-display text-base font-semibold text-ink">{product.name}</h3>
          <p className="line-clamp-2 min-h-10 text-xs leading-5 text-muted">{product.composition}</p>
          <p className="pt-1 text-sm font-medium text-ink">{formatRub(product.price)}</p>
          <p className="text-xs text-moss">+{formatBonuses(bonus)} бонусов</p>
        </div>
      </button>
      <button
        type="button"
        aria-pressed={favorite}
        aria-label={
          favorite
            ? `Убрать «${product.name}» из избранного`
            : `Добавить «${product.name}» в избранное`
        }
        onClick={(event) => {
          event.stopPropagation()
          onToggleFavorite()
        }}
        className="absolute top-2 right-2 grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-wine"
      >
        <Heart aria-hidden="true" size={18} className={favorite ? 'fill-wine' : ''} />
      </button>
    </article>
  )
}
