import { useRef, useState, type FormEvent } from 'react'
import { DemoBadge } from './DemoBadge'
import { Modal } from './Modal'
import { useAppState } from '../state/store'
import { previewBonus, type BonusMode } from '../lib/bonuses'
import { formatBonuses, formatRub } from '../lib/format'
import { BONUS_DISCLAIMER } from '../data/salons'

export function StaffPanel({ onClose }: { onClose: () => void }) {
  const { data, applyOperation } = useAppState()
  const [raw, setRaw] = useState('')
  const [mode, setMode] = useState<BonusMode>('accrual')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [opId, setOpId] = useState(() => crypto.randomUUID())
  const lock = useRef(false)

  const purchaseRub = /^\d+$/.test(raw.trim()) ? Number(raw.trim()) : Number.NaN
  const preview = previewBonus({ mode, purchaseRub, balance: data.balance })

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (lock.current) return
    if (!preview.ok) {
      setError(preview.message)
      setDone(null)
      return
    }

    lock.current = true
    setBusy(true)
    const result = applyOperation({ id: opId, mode, purchaseRub: preview.purchaseRub })
    lock.current = false
    setBusy(false)

    if (!result.ok) {
      setError(result.message)
      setDone(null)
      return
    }

    setError(null)
    setDone(result.message)
    setRaw('')
    setOpId(crypto.randomUUID())
  }

  return (
    <Modal open title="Панель сотрудника" onClose={onClose}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">Демонстрация для владельца</p>
        <DemoBadge />
      </div>
      <dl className="grid grid-cols-2 gap-3 rounded-[16px] bg-powder px-4 py-3 text-sm">
        <div>
          <dt className="text-muted">Покупатель</dt>
          <dd className="font-medium text-ink">{data.name}</dd>
        </div>
        <div>
          <dt className="text-muted">Номер карты</dt>
          <dd className="font-medium tracking-wide text-ink">0001 2048</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-muted">Баланс</dt>
          <dd className="font-display text-2xl font-semibold text-ink">
            {formatBonuses(data.balance)} бонусов
          </dd>
        </div>
      </dl>

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="purchase-amount" className="mb-2 block text-sm font-medium text-ink">
            Сумма покупки, ₽
          </label>
          <input
            id="purchase-amount"
            data-autofocus
            inputMode="numeric"
            autoComplete="off"
            value={raw}
            aria-invalid={error ? true : undefined}
            aria-describedby="purchase-help"
            onChange={(event) => {
              setRaw(event.target.value)
              setError(null)
              setDone(null)
            }}
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-ink outline-none"
            placeholder="3000"
          />
          <p id="purchase-help" className="mt-2 text-xs text-muted">
            Например, 3000. Начисление: 5% от суммы. Списание: до 20% и не больше баланса.
          </p>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">Операция</legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ['accrual', 'Начисление'],
                ['redeem', 'Списание'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`flex min-h-11 cursor-pointer items-center justify-center rounded-2xl border px-3 text-sm ${
                  mode === value ? 'border-wine bg-powder text-wine' : 'border-line bg-white text-ink'
                }`}
              >
                <input
                  type="radio"
                  name="bonus-mode"
                  value={value}
                  checked={mode === value}
                  onChange={() => {
                    setMode(value)
                    setError(null)
                    setDone(null)
                  }}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {preview.ok ? (
          <div className="rounded-[16px] border border-line bg-white px-4 py-3 text-sm leading-6 text-ink">
            {preview.mode === 'accrual' ? (
              <p>
                Начислим {formatBonuses(preview.bonusDelta)} бонусов. Баланс станет{' '}
                {formatBonuses(preview.balanceAfter)}.
              </p>
            ) : (
              <p>
                Спишем {formatBonuses(Math.abs(preview.bonusDelta))} бонусов. К оплате{' '}
                {formatRub(preview.payRemainder)}. Баланс станет {formatBonuses(preview.balanceAfter)}.
              </p>
            )}
          </div>
        ) : null}

        {error ? (
          <p role="alert" className="text-sm text-wine">
            {error}
          </p>
        ) : null}
        {done ? (
          <p role="status" className="text-sm text-moss">
            {done}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-wine px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {busy ? 'Сохраняем…' : 'Подтвердить'}
        </button>
        <p className="text-xs leading-5 text-muted">{BONUS_DISCLAIMER}</p>
      </form>
    </Modal>
  )
}
