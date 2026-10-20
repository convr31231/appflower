import { CalendarDays, CreditCard, Heart, Home, LayoutGrid, MapPin } from 'lucide-react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { APP_INFO } from '../data/salons'
import { DemoBadge } from './DemoBadge'
import { StaffPanel } from './StaffPanel'
import { useAppState } from '../state/store'
import { asset } from '../lib/assets'
import { CARD_NUMBER } from '../lib/bonuses'
import { dateDistanceLabel, formatBonuses, formatEventDate } from '../lib/format'

const navItems = [
  { to: '/', label: 'Главная', short: 'Главная', icon: Home, end: true },
  { to: '/catalog', label: 'Каталог', short: 'Каталог', icon: LayoutGrid, end: false },
  { to: '/card', label: 'Моя карта', short: 'Карта', icon: CreditCard, end: false },
  { to: '/dates', label: 'Важные даты', short: 'Даты', icon: CalendarDays, end: false },
  { to: '/favorites', label: 'Избранное', short: 'Избранное', icon: Heart, end: false },
]

function navClass(active: boolean, compact = false) {
  return `flex items-center gap-3 rounded-2xl px-3 text-sm ${
    compact ? 'min-h-14 w-full min-w-0 flex-col justify-center gap-1 px-0.5 text-center text-[11px]' : 'min-h-11'
  } ${active ? 'bg-powder text-wine' : 'text-ink'}`
}

export function AppShell() {
  const { data, notice, staffOpen, closeStaff } = useAppState()
  const letter = data.name.trim().charAt(0).toLocaleUpperCase('ru-RU') || 'А'
  const upcoming = [...data.events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)

  return (
    <div className="min-h-dvh bg-milk text-ink">
      <div className="mx-auto grid min-h-dvh w-full max-w-[1440px] lg:grid-cols-[248px_minmax(0,1fr)] xl:grid-cols-[248px_minmax(0,1fr)_300px]">
        <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line px-4 py-6 lg:flex">
          <Link to="/" className="block px-2">
            <img src={asset('assets/logo.png')} alt="Дисконт Центр Роз" className="h-14 w-auto" />
          </Link>
          <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Разделы">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => navClass(isActive)}>
                <item.icon aria-hidden="true" size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/profile#about" className="px-3 text-xs leading-5 text-muted">
            О приложении
          </Link>
        </aside>

        <div className="min-w-0">
          <header className="px-4 py-3 lg:px-8">
            <div className="flex items-center gap-3">
              <Link to="/" className="shrink-0 lg:hidden">
                <img
                  src={asset('assets/logo.png')}
                  alt="Дисконт Центр Роз"
                  className="h-12 w-auto max-w-32 object-contain object-left"
                />
              </Link>
              <p className="hidden min-w-0 items-center gap-1.5 text-sm text-ink lg:flex">
                <MapPin aria-hidden="true" size={16} className="shrink-0 text-wine" />
                <span className="truncate">Нижний Новгород</span>
              </p>
              <div className="ml-auto flex shrink-0 items-center gap-2">
                <DemoBadge />
                <Link
                  to="/profile"
                  aria-label={`Профиль, ${data.name}`}
                  className="grid h-11 w-11 place-items-center rounded-full bg-powder font-display text-base font-semibold text-wine"
                >
                  {letter}
                </Link>
              </div>
            </div>
            <p className="mt-2 flex min-w-0 items-center gap-1.5 text-sm text-ink lg:hidden">
              <MapPin aria-hidden="true" size={16} className="shrink-0 text-wine" />
              <span className="truncate">Нижний Новгород</span>
            </p>
          </header>

          <main className="px-4 pb-[calc(6.25rem+env(safe-area-inset-bottom))] lg:px-8 lg:pb-10">
            <Outlet />
            <footer id="about-note" className="mt-12 max-w-3xl text-xs leading-5 text-muted">
              {APP_INFO}
            </footer>
          </main>
        </div>

        <aside className="sticky top-0 hidden h-dvh flex-col gap-4 overflow-y-auto border-l border-line px-4 py-6 xl:flex">
          <Link to="/card" className="rounded-[18px] bg-wine p-4 text-milk">
            <p className="text-[11px] tracking-[0.16em] text-powder">ЦЕНТР РОЗ · КАРТА</p>
            <p className="mt-4 font-display text-3xl font-semibold">{formatBonuses(data.balance)}</p>
            <p className="text-sm text-powder">бонусов</p>
            <p className="mt-4 flex items-center justify-between text-sm">
              <span>{data.name}</span>
              <span className="tracking-[0.12em]">{CARD_NUMBER}</span>
            </p>
            <p className="mt-3 text-xs text-powder">Показать QR-код</p>
          </Link>
          <section className="rounded-[18px] border border-line bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold">Важные даты</h2>
              <Link to="/dates" className="text-sm text-wine">
                Все
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted">Пока нет сохранённых событий.</p>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((event) => (
                  <li key={event.id}>
                    <p className="text-sm font-medium break-words text-ink">{event.title}</p>
                    <p className="text-xs text-muted">
                      {formatEventDate(event.date)} · {dateDistanceLabel(event.date)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-milk/95 pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label="Разделы"
      >
        <ul className="grid grid-cols-5">
          {navItems.map((item) => (
            <li key={item.to} className="min-w-0">
              <NavLink
                to={item.to}
                end={item.end}
                aria-label={item.label}
                className={({ isActive }) => navClass(isActive, true)}
              >
                <item.icon aria-hidden="true" size={20} />
                {item.short}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {notice ? (
        <div
          role="status"
          className="fixed top-4 left-1/2 z-[60] w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink shadow-[0_10px_30px_rgba(48,40,43,0.12)]"
        >
          {notice}
        </div>
      ) : null}

      {staffOpen ? <StaffPanel onClose={closeStaff} /> : null}
    </div>
  )
}
