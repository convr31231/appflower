export const CARD_NUMBER = '0001 2048'
export const QR_VALUE = 'DEMO-CENTRROZ-001'
export const MAX_PURCHASE_RUB = 1_000_000

export type BonusMode = 'accrual' | 'redeem'

export type BonusErrorCode = 'invalid-amount' | 'duplicate-id' | 'insufficient' | 'invalid-id'

export type OperationRecord = {
  id: string
  mode: BonusMode
  purchaseRub: number
  bonusDelta: number
  balanceAfter: number
  payRemainder: number
  createdAt: string
}

export type BonusState = {
  balance: number
  operations: OperationRecord[]
}

export type BonusPreview =
  | {
      ok: true
      mode: BonusMode
      purchaseRub: number
      bonusDelta: number
      balanceAfter: number
      payRemainder: number
    }
  | {
      ok: false
      code: BonusErrorCode
      message: string
    }

const INVALID_AMOUNT = 'Введите сумму покупки целым числом больше нуля.'

export function isPositiveIntegerAmount(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value > 0 &&
    value <= MAX_PURCHASE_RUB
  )
}

export function accrualBonuses(purchaseRub: number): number {
  return Math.floor((purchaseRub * 5) / 100)
}

export function redeemCap(purchaseRub: number, balance: number): number {
  const percentCap = Math.floor((purchaseRub * 20) / 100)
  const safeBalance = Number.isInteger(balance) ? Math.max(0, balance) : 0
  return Math.min(percentCap, safeBalance)
}

export function previewBonus(input: {
  mode: BonusMode
  purchaseRub: number
  balance: number
}): BonusPreview {
  if (!isPositiveIntegerAmount(input.purchaseRub)) {
    return { ok: false, code: 'invalid-amount', message: INVALID_AMOUNT }
  }

  if (!Number.isInteger(input.balance) || input.balance < 0) {
    return { ok: false, code: 'insufficient', message: 'Баланс бонусов недоступен.' }
  }

  if (input.mode === 'accrual') {
    const bonusDelta = accrualBonuses(input.purchaseRub)
    return {
      ok: true,
      mode: 'accrual',
      purchaseRub: input.purchaseRub,
      bonusDelta,
      balanceAfter: input.balance + bonusDelta,
      payRemainder: input.purchaseRub,
    }
  }

  const spend = redeemCap(input.purchaseRub, input.balance)
  if (spend <= 0) {
    return {
      ok: false,
      code: 'insufficient',
      message: 'Списать бонусы нельзя: доступно 0, а 20% покупки не дают бонусов к списанию.',
    }
  }

  return {
    ok: true,
    mode: 'redeem',
    purchaseRub: input.purchaseRub,
    bonusDelta: -spend,
    balanceAfter: input.balance - spend,
    payRemainder: input.purchaseRub - spend,
  }
}

export function commitBonus(
  state: BonusState,
  input: { id: string; mode: BonusMode; purchaseRub: number; createdAt?: string },
):
  | { ok: true; state: BonusState; operation: OperationRecord }
  | { ok: false; code: BonusErrorCode; message: string; state: BonusState } {
  const id = input.id.trim()
  if (!id) {
    return {
      ok: false,
      code: 'invalid-id',
      message: 'Не удалось подготовить операцию. Закройте панель и откройте её снова.',
      state,
    }
  }

  if (state.operations.some((operation) => operation.id === id)) {
    return {
      ok: false,
      code: 'duplicate-id',
      message: 'Эта операция уже учтена и не применена повторно.',
      state,
    }
  }

  const preview = previewBonus({
    mode: input.mode,
    purchaseRub: input.purchaseRub,
    balance: state.balance,
  })

  if (!preview.ok) {
    return { ...preview, state }
  }

  if (preview.balanceAfter < 0) {
    return {
      ok: false,
      code: 'insufficient',
      message: 'Списание больше доступного баланса.',
      state,
    }
  }

  const operation: OperationRecord = {
    id,
    mode: preview.mode,
    purchaseRub: preview.purchaseRub,
    bonusDelta: preview.bonusDelta,
    balanceAfter: preview.balanceAfter,
    payRemainder: preview.payRemainder,
    createdAt: input.createdAt ?? new Date().toISOString(),
  }

  return {
    ok: true,
    operation,
    state: {
      balance: preview.balanceAfter,
      operations: [...state.operations, operation],
    },
  }
}
