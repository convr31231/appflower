export function formatRub(value: number): string {
  return `${new Intl.NumberFormat('ru-RU').format(value)}\u00a0₽`
}

export function formatBonuses(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value)
}

export function formatSignedBonuses(delta: number): string {
  const formatted = formatBonuses(Math.abs(delta))
  if (delta > 0) return `+${formatted}`
  if (delta < 0) return `−${formatted}`
  return formatted
}

export function formatEventDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

export function formatOperationWhen(iso: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function daysUntil(isoDate: string, today = new Date()): number {
  const [year, month, day] = isoDate.split('-').map(Number)
  const target = new Date(year, month - 1, day)
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.round((target.getTime() - start.getTime()) / 86_400_000)
}

function dayWord(count: number): string {
  const abs = Math.abs(count) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return 'дней'
  if (last === 1) return 'день'
  if (last >= 2 && last <= 4) return 'дня'
  return 'дней'
}

export function dateDistanceLabel(isoDate: string, today = new Date()): string {
  const days = daysUntil(isoDate, today)
  if (days === 0) return 'сегодня'
  if (days === 1) return 'завтра'
  if (days > 1) return `через ${days} ${dayWord(days)}`
  return 'дата уже прошла'
}

export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  if (year < 2000 || year > 2100) return false
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}
