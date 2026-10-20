import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, ChevronRight } from 'lucide-react'
import { featuredProducts } from '../data/products'
import { PRICE_NOTE } from '../data/salons'
import { useAppState } from '../state/store'
import { asset } from '../lib/assets'
import { CARD_NUMBER } from '../lib/bonuses'
import { dateDistanceLabel, formatBonuses, formatEventDate } from '../lib/format'
import { ProductCard } from '../components/ProductCard'
import { ProductModal } from '../components/ProductModal'
import { SalonsDialog } from '../components/SalonsDialog'
import type { Product } from '../data/products'

export function HomePage() {
  const { data, toggleFavorite } = useAppState()
  const [opened, setOpened] = useState<Product | null>(null)
  const [salonsOpen, setSalonsOpen] = useState(false)
  const nextEvent = [...data.events].sort((a, b) => a.date.localeCompare(b.date))[0]

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Здравствуйте, {data.name}</h1>
        <p className="mt-2 text-muted">Пусть сегодня будет повод для цветов.</p>
      </section>

      <section className="grid items-center gap-6 overflow-hidden rounded-[22px] bg-powder p-5 md:grid-cols-[1.15fr_0.85fr] md:p-8">
        <div>
          <p className="text-xs tracking-[0.16em] text-wine uppercase">Маленькие знаки большой любви</p>
          <h2 className="mt-3 font-display text-4xl leading-tight font-semibold text-ink sm:text-5xl">
            Цветы говорят за вас
          </h2>
          <p className="mt-3 max-w-md text-base leading-7 text-ink">
            Для особенного дня. И просто потому, что любите.
          </p>
          <Link
            to="/catalog"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl bg-wine px-5 py-3 text-sm font-medium text-white"
          >
            Выбрать букет
          </Link>
        </div>
        <img
          src={asset('assets/delivery-bouquet.png')}
          alt="Букет из магазина Дисконт Центр Роз"
          className="mx-auto h-64 w-full object-contain md:h-80"
        />
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/card"
          className="rounded-[18px] border border-line bg-white p-4 text-left shadow-[0_8px_24px_rgba(48,40,43,0.04)]"
        >
          <p className="text-sm text-muted">Бонусный баланс</p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink">{formatBonuses(data.balance)}</p>
          <p className="mt-1 text-xs tracking-[0.12em] text-muted">{CARD_NUMBER}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm text-wine">
            Показать QR-код
            <ChevronRight aria-hidden="true" size={16} />
          </span>
        </Link>
        <Link
          to="/dates"
          className="rounded-[18px] border border-line bg-white p-4 shadow-[0_8px_24px_rgba(48,40,43,0.04)]"
        >
          <p className="flex items-center gap-2 text-sm text-muted">
            <CalendarDays aria-hidden="true" size={16} />
            Особенные даты
          </p>
          {nextEvent ? (
            <>
              <p className="mt-2 font-display text-2xl font-semibold break-words text-ink">{nextEvent.title}</p>
              <p className="mt-1 text-sm text-muted">
                {formatEventDate(nextEvent.date)} · {dateDistanceLabel(nextEvent.date)}
              </p>
            </>
          ) : (
            <p className="mt-2 text-lg text-ink">Добавьте важную дату</p>
          )}
        </Link>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold">Выбрано с любовью</h2>
          <Link to="/catalog" className="text-sm text-wine">
            Весь каталог
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              favorite={data.favorites.includes(product.id)}
              onOpen={() => setOpened(product)}
              onToggleFavorite={() => toggleFavorite(product.id)}
            />
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-muted">{PRICE_NOTE}</p>
      </section>

      <section className="rounded-[22px] border border-line bg-white p-5 sm:p-6">
        <h2 className="font-display text-2xl font-semibold">Рядом, когда нужны цветы</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
          Салоны «Дисконт Центр Роз» в Нижнем Новгороде. Позвоните флористу и уточните наличие.
        </p>
        <button
          type="button"
          onClick={() => setSalonsOpen(true)}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl border border-wine px-5 py-3 text-sm font-medium text-wine"
        >
          Наши салоны
        </button>
      </section>

      <ProductModal product={opened} onClose={() => setOpened(null)} />
      <SalonsDialog open={salonsOpen} onClose={() => setSalonsOpen(false)} />
    </div>
  )
}
