import { productIds } from '../data/products.ts'
import { accrualBonuses, redeemCap, type BonusMode, type OperationRecord } from './bonuses.ts'
import { isValidIsoDate } from './format.ts'

export const STORAGE_KEY = 'centr-roz-demo'
export const DATA_VERSION = 1

export type DemoEvent = {
  id: string
  title: string
  date: string
}

export type DemoData = {
  version: typeof DATA_VERSION
  name: string
  balance: number
  operations: OperationRecord[]
  favorites: string[]
  events: DemoEvent[]
}

export function createSeedOperations(): OperationRecord[] {
  return [
    {
      id: 'seed-accrual-1',
      mode: 'accrual',
      purchaseRub: 6000,
      bonusDelta: 300,
      balanceAfter: 300,
      payRemainder: 6000,
      createdAt: '2026-09-02T12:00:00+03:00',
    },
    {
      id: 'seed-accrual-2',
      mode: 'accrual',
      purchaseRub: 6000,
      bonusDelta: 300,
      balanceAfter: 600,
      payRemainder: 6000,
      createdAt: '2026-09-18T12:00:00+03:00',
    },
    {
      id: 'seed-accrual-3',
      mode: 'accrual',
      purchaseRub: 4800,
      bonusDelta: 240,
      balanceAfter: 840,
      payRemainder: 4800,
      createdAt: '2026-10-04T12:00:00+03:00',
    },
  ]
}

export function createDefaultData(): DemoData {
  const operations = createSeedOperations()
  return {
    version: DATA_VERSION,
    name: 'Анна',
    balance: 840,
    operations,
    favorites: [],
    events: [
      {
        id: 'event-mom',
        title: 'День рождения мамы',
        date: '2026-11-24',
      },
    ],
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readName(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const name = value.trim()
  if (name.length < 1 || name.length > 40) return null
  if (/[\u0000-\u001F]/.test(name)) return null
  return name
}

function readOperations(value: unknown): OperationRecord[] | null {
  if (!Array.isArray(value)) return null
  const operations: OperationRecord[] = []
  const ids = new Set<string>()
  let running = 0

  for (const item of value) {
    if (!isRecord(item)) return null
    const id = item.id
    const mode = item.mode
    const purchaseRub = item.purchaseRub
    const bonusDelta = item.bonusDelta
    const balanceAfter = item.balanceAfter
    const payRemainder = item.payRemainder
    const createdAt = item.createdAt

    if (typeof id !== 'string' || id.trim().length === 0 || ids.has(id)) return null
    if (mode !== 'accrual' && mode !== 'redeem') return null
    if (typeof purchaseRub !== 'number' || !Number.isInteger(purchaseRub) || purchaseRub <= 0) return null
    if (typeof bonusDelta !== 'number' || !Number.isInteger(bonusDelta) || bonusDelta === 0) return null
    if (typeof balanceAfter !== 'number' || !Number.isInteger(balanceAfter) || balanceAfter < 0) return null
    if (typeof payRemainder !== 'number' || !Number.isInteger(payRemainder) || payRemainder < 0) return null
    if (typeof createdAt !== 'string' || Number.isNaN(Date.parse(createdAt))) return null

    const bonusMode = mode as BonusMode
    if (bonusMode === 'accrual') {
      if (bonusDelta !== accrualBonuses(purchaseRub) || payRemainder !== purchaseRub) return null
    } else {
      const spend = redeemCap(purchaseRub, running)
      if (spend <= 0 || bonusDelta !== -spend || payRemainder !== purchaseRub - spend) return null
    }

    running += bonusDelta
    if (running !== balanceAfter || running < 0) return null
    ids.add(id)
    operations.push({
      id,
      mode: bonusMode,
      purchaseRub,
      bonusDelta,
      balanceAfter,
      payRemainder,
      createdAt,
    })
  }

  return operations
}

function readFavorites(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null
  const favorites: string[] = []
  for (const item of value) {
    if (typeof item !== 'string') return null
    if (productIds.has(item) && !favorites.includes(item)) favorites.push(item)
  }
  return favorites
}

function readEvents(value: unknown): DemoEvent[] | null {
  if (!Array.isArray(value) || value.length > 50) return null
  const events: DemoEvent[] = []
  const ids = new Set<string>()
  for (const item of value) {
    if (!isRecord(item)) return null
    const id = item.id
    const title = item.title
    const date = item.date
    if (typeof id !== 'string' || id.trim().length === 0 || ids.has(id)) return null
    if (typeof title !== 'string') return null
    const cleanTitle = title.trim()
    if (cleanTitle.length < 1 || cleanTitle.length > 80 || /[\u0000-\u001F]/.test(cleanTitle)) return null
    if (typeof date !== 'string' || !isValidIsoDate(date)) return null
    ids.add(id)
    events.push({ id, title: cleanTitle, date })
  }
  return events
}

export function parseDemoData(value: unknown): DemoData | null {
  if (!isRecord(value)) return null
  if (value.version !== DATA_VERSION) return null
  const name = readName(value.name)
  const operations = readOperations(value.operations)
  const favorites = readFavorites(value.favorites)
  const events = readEvents(value.events)
  if (!name || !operations || !favorites || !events) return null
  if (typeof value.balance !== 'number' || !Number.isInteger(value.balance) || value.balance < 0) return null
  const lastBalance = operations.length > 0 ? operations[operations.length - 1].balanceAfter : 0
  if (value.balance !== lastBalance) return null
  return {
    version: DATA_VERSION,
    name,
    balance: value.balance,
    operations,
    favorites,
    events,
  }
}

export function readDemoData(raw: string | null): DemoData {
  if (raw == null || raw.trim() === '') return createDefaultData()
  try {
    return parseDemoData(JSON.parse(raw)) ?? createDefaultData()
  } catch {
    return createDefaultData()
  }
}

export function loadDemoData(): DemoData {
  try {
    return readDemoData(localStorage.getItem(STORAGE_KEY))
  } catch {
    return createDefaultData()
  }
}

export function saveDemoData(data: DemoData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
