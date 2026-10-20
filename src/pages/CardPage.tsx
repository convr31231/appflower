import { QRCodeSVG } from 'qrcode.react'
import { BONUS_DISCLAIMER } from '../data/salons'
import { CARD_NUMBER, QR_VALUE } from '../lib/bonuses'
import { formatBonuses, formatOperationWhen, formatRub, formatSignedBonuses } from '../lib/format'
import { useAppState } from '../state/store'

export function CardPage() {
  const { data, openStaff } = useAppState()
  const history = [...data.operations].reverse()

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="font-display text-3xl font-semibold">Моя карта</h1>
      <section className="rounded-[22px] bg-wine p-6 text-milk shadow-[0_12px_30px_rgba(135,43,75,0.18)]">
        <p className="text-xs tracking-[0.18em] text-powder">ЦЕНТР РОЗ · КАРТА ПОКУПАТЕЛЯ</p>
        <p className="mt-8 font-display text-5xl font-semibold">{formatBonuses(data.balance)}</p>
        <p className="text-sm text-powder">бонусов</p>
        <div className="mt-8 flex items-end justify-between gap-4 text-sm">
          <p className="break-words">{data.name}</p>
          <p className="shrink-0 tracking-[0.16em]">{CARD_NUMBER}</p>
        </div>
      </section>

      <section className="rounded-[22px] border border-line bg-white p-5 text-center">
        <div className="inline-block rounded-[16px] bg-milk p-3">
          <QRCodeSVG value={QR_VALUE} size={180} level="M" bgColor="#FCFAF9" fgColor="#30282B" />
        </div>
        <p className="mt-4 text-sm font-medium text-ink">Покажите карту флористу</p>
        <p className="mt-1 text-xs text-muted">Код для демонстрации: {QR_VALUE}</p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">История</h2>
        <ul className="mt-3 space-y-3">
          {history.map((operation) => (
            <li key={operation.id} className="rounded-[16px] border border-line bg-white px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {operation.mode === 'accrual' ? 'Начисление за покупку' : 'Списание бонусов'}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Покупка {formatRub(operation.purchaseRub)}
                    {operation.mode === 'redeem' ? ` · к оплате ${formatRub(operation.payRemainder)}` : ''}
                  </p>
                  <p className="mt-1 text-xs text-muted">{formatOperationWhen(operation.createdAt)}</p>
                </div>
                <p className={`font-medium ${operation.bonusDelta > 0 ? 'text-moss' : 'text-wine'}`}>
                  {formatSignedBonuses(operation.bonusDelta)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[18px] bg-powder p-5 text-sm leading-6 text-ink">
        <h2 className="font-display text-lg font-semibold">Пример условий</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Начисление 5% от суммы покупки.</li>
          <li>1 бонус = 1 ₽.</li>
          <li>Списание до 20% стоимости покупки.</li>
          <li>Сумма списания ограничена доступным балансом.</li>
          <li>При демонстрационном списании новые бонусы не начисляются.</li>
        </ul>
        <p className="mt-3 text-muted">{BONUS_DISCLAIMER}</p>
      </section>

      <button
        type="button"
        onClick={openStaff}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-wine px-5 py-3 text-sm font-medium text-white"
      >
        Панель сотрудника
      </button>
    </div>
  )
}
