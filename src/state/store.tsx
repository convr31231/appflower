import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createContext, useContext } from 'react'
import {
  commitBonus,
  type BonusMode,
  type BonusErrorCode,
} from '../lib/bonuses'
import { formatBonuses, formatRub, isValidIsoDate } from '../lib/format'
import {
  createDefaultData,
  loadDemoData,
  saveDemoData,
  STORAGE_KEY,
  readDemoData,
  type DemoData,
} from '../lib/storage'
import { findProduct } from '../data/products'

type OperationResult =
  | { ok: true; message: string }
  | { ok: false; code: BonusErrorCode; message: string }

type AppStateValue = {
  data: DemoData
  notice: string | null
  staffOpen: boolean
  openStaff: () => void
  closeStaff: () => void
  clearNotice: () => void
  toggleFavorite: (productId: string) => void
  addEvent: (title: string, date: string) => string | null
  removeEvent: (id: string) => void
  rename: (name: string) => string | null
  resetDemo: () => void
  applyOperation: (input: { id: string; mode: BonusMode; purchaseRub: number }) => OperationResult
}

const AppStateContext = createContext<AppStateValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DemoData>(() => loadDemoData())
  const [notice, setNotice] = useState<string | null>(null)
  const [staffOpen, setStaffOpen] = useState(false)
  const dataRef = useRef(data)
  dataRef.current = data

  const persist = useCallback((next: DemoData) => {
    dataRef.current = next
    setData(next)
    try {
      saveDemoData(next)
    } catch {
      setNotice('Изменение видно на экране, но браузер не сохранил его.')
    }
  }, [])

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) == null) saveDemoData(dataRef.current)
    } catch {
      // Демонстрация остаётся в памяти этой вкладки.
    }
  }, [])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return
      const next = readDemoData(event.newValue)
      dataRef.current = next
      setData(next)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 4200)
    return () => window.clearTimeout(timer)
  }, [notice])

  const value = useMemo<AppStateValue>(
    () => ({
      data,
      notice,
      staffOpen,
      openStaff: () => setStaffOpen(true),
      closeStaff: () => setStaffOpen(false),
      clearNotice: () => setNotice(null),
      toggleFavorite: (productId: string) => {
        if (!findProduct(productId)) return
        const current = dataRef.current
        const favorites = current.favorites.includes(productId)
          ? current.favorites.filter((id) => id !== productId)
          : [...current.favorites, productId]
        persist({ ...current, favorites })
      },
      addEvent: (title: string, date: string) => {
        const cleanTitle = title.trim()
        if (!cleanTitle) return 'Введите название события.'
        if (cleanTitle.length > 80) return 'Название должно быть короче 80 символов.'
        if (/[\u0000-\u001F]/.test(cleanTitle)) return 'Уберите служебные символы из названия.'
        if (!isValidIsoDate(date)) return 'Выберите корректную дату.'
        const current = dataRef.current
        if (current.events.length >= 50) return 'В демонстрации можно сохранить не больше 50 событий.'
        persist({
          ...current,
          events: [...current.events, { id: crypto.randomUUID(), title: cleanTitle, date }],
        })
        return null
      },
      removeEvent: (id: string) => {
        const current = dataRef.current
        persist({ ...current, events: current.events.filter((event) => event.id !== id) })
      },
      rename: (name: string) => {
        const clean = name.trim()
        if (!clean) return 'Введите имя.'
        if (clean.length > 40) return 'Имя должно быть короче 40 символов.'
        if (/[\u0000-\u001F]/.test(clean)) return 'Уберите служебные символы из имени.'
        persist({ ...dataRef.current, name: clean })
        setNotice('Имя в демонстрации обновлено.')
        return null
      },
      resetDemo: () => {
        persist(createDefaultData())
        setNotice('Демонстрация возвращена к исходным данным.')
      },
      applyOperation: (input) => {
        const result = commitBonus(dataRef.current, input)
        if (!result.ok) return result
        persist({
          ...dataRef.current,
          balance: result.state.balance,
          operations: result.state.operations,
        })
        const message =
          result.operation.mode === 'accrual'
            ? `Начислено ${formatBonuses(result.operation.bonusDelta)} бонусов. Баланс: ${formatBonuses(result.state.balance)}.`
            : `Списано ${formatBonuses(Math.abs(result.operation.bonusDelta))} бонусов. К оплате ${formatRub(result.operation.payRemainder)}. Баланс: ${formatBonuses(result.state.balance)}.`
        setNotice(message)
        return { ok: true, message }
      },
    }),
    [data, notice, persist, staffOpen],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext)
  if (!value) throw new Error('Состояние демонстрации недоступно')
  return value
}
