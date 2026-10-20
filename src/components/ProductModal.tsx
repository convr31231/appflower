import { accrualBonuses } from '../lib/bonuses'
import { formatBonuses, formatRub } from '../lib/format'
import type { Product } from '../data/products'
import { PRICE_NOTE } from '../data/salons'
import { Modal } from './Modal'

type ProductModalProps = {
  product: Product | null
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const bonus = product ? accrualBonuses(product.price) : 0

  return (
    <Modal open={product !== null} title={product?.name ?? 'Букет'} onClose={onClose} wide>
      {product ? (
        <div className="grid gap-5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <img
            src={product.image}
            alt={`Букет «${product.name}»`}
            className="aspect-[3/4] w-full rounded-[18px] object-cover"
          />
          <div className="space-y-4">
            <p className="text-sm leading-6 text-muted">{product.composition}</p>
            <p className="font-display text-3xl font-semibold text-ink">{formatRub(product.price)}</p>
            <p className="rounded-[14px] bg-moss-soft px-4 py-3 text-sm text-moss">
              Пример начисления: 5% от цены, {formatBonuses(bonus)} бонусов.
            </p>
            <a
              href={product.url}
              target="_blank"
              rel="noreferrer"
              data-autofocus
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-wine px-5 py-3 text-sm font-medium text-white"
            >
              Открыть на сайте магазина
            </a>
            <p className="text-xs leading-5 text-muted">{PRICE_NOTE}</p>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
