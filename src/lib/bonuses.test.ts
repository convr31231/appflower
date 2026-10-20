import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { accrualBonuses, commitBonus, previewBonus, redeemCap } from './bonuses.ts'
import { createDefaultData } from './storage.ts'

describe('начисление бонусов', () => {
  it('начисляет 150 бонусов за покупку 3000 ₽', () => {
    assert.equal(accrualBonuses(3000), 150)
    const result = commitBonus({ balance: 840, operations: [] }, { id: 'op-150', mode: 'accrual', purchaseRub: 3000 })
    assert.equal(result.ok, true)
    if (!result.ok) return
    assert.equal(result.operation.bonusDelta, 150)
    assert.equal(result.state.balance, 990)
    assert.equal(result.operation.payRemainder, 3000)
  })

  it('разрешает новую покупку с той же суммой и другим id', () => {
    const first = commitBonus({ balance: 840, operations: [] }, { id: 'op-a', mode: 'accrual', purchaseRub: 3000 })
    assert.equal(first.ok, true)
    if (!first.ok) return
    const second = commitBonus(first.state, { id: 'op-b', mode: 'accrual', purchaseRub: 3000 })
    assert.equal(second.ok, true)
    if (!second.ok) return
    assert.equal(second.state.balance, 1140)
  })
})

describe('списание бонусов', () => {
  it('ограничивает списание 20 процентами и балансом', () => {
    assert.equal(redeemCap(3000, 840), 600)
    assert.equal(redeemCap(3000, 100), 100)
    const capped = previewBonus({ mode: 'redeem', purchaseRub: 3000, balance: 840 })
    assert.equal(capped.ok, true)
    if (!capped.ok) return
    assert.equal(capped.bonusDelta, -600)
    assert.equal(capped.payRemainder, 2400)
    assert.equal(capped.balanceAfter, 240)

    const limited = commitBonus({ balance: 100, operations: [] }, { id: 'op-limit', mode: 'redeem', purchaseRub: 3000 })
    assert.equal(limited.ok, true)
    if (!limited.ok) return
    assert.equal(limited.state.balance, 0)
    assert.equal(limited.operation.bonusDelta, -100)
    assert.equal(limited.operation.payRemainder, 2900)
  })

  it('не даёт уйти в отрицательный баланс', () => {
    const empty = previewBonus({ mode: 'redeem', purchaseRub: 3000, balance: 0 })
    assert.equal(empty.ok, false)
    const result = commitBonus({ balance: 0, operations: [] }, { id: 'op-zero', mode: 'redeem', purchaseRub: 3000 })
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.state.balance, 0)
  })

  it('при списании не начисляет новые бонусы', () => {
    const result = commitBonus({ balance: 840, operations: [] }, { id: 'op-redeem', mode: 'redeem', purchaseRub: 3000 })
    assert.equal(result.ok, true)
    if (!result.ok) return
    assert.equal(result.state.operations.length, 1)
    assert.equal(result.operation.bonusDelta < 0, true)
    assert.equal(result.state.balance, 240)
  })
})

describe('защита операции', () => {
  it('отклоняет повтор одного id', () => {
    const first = commitBonus({ balance: 840, operations: [] }, { id: 'same-id', mode: 'accrual', purchaseRub: 3000 })
    assert.equal(first.ok, true)
    if (!first.ok) return
    const second = commitBonus(first.state, { id: 'same-id', mode: 'accrual', purchaseRub: 3000 })
    assert.equal(second.ok, false)
    if (second.ok) return
    assert.equal(second.code, 'duplicate-id')
    assert.equal(second.state.balance, 990)
    assert.equal(second.state.operations.length, 1)
  })

  it('не принимает исходный id повторно', () => {
    const data = createDefaultData()
    const result = commitBonus(data, { id: 'seed-accrual-1', mode: 'accrual', purchaseRub: 3000 })
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.code, 'duplicate-id')
    assert.equal(result.state.balance, 840)
  })

  it('отклоняет некорректную сумму', () => {
    for (const purchaseRub of [0, -10, 10.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      const preview = previewBonus({ mode: 'accrual', purchaseRub, balance: 840 })
      assert.equal(preview.ok, false)
      if (preview.ok) continue
      assert.equal(preview.code, 'invalid-amount')
      const result = commitBonus(
        { balance: 840, operations: [] },
        { id: `bad-${purchaseRub}`, mode: 'accrual', purchaseRub },
      )
      assert.equal(result.ok, false)
      if (result.ok) continue
      assert.equal(result.state.balance, 840)
    }
  })
})
