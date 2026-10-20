import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createDefaultData, parseDemoData, readDemoData } from './storage.ts'

describe('сохранение демонстрации', () => {
  it('сохраняет исходный баланс 840 и историю начислений', () => {
    const data = createDefaultData()
    assert.equal(data.balance, 840)
    assert.deepEqual(
      data.operations.map((operation) => operation.bonusDelta),
      [300, 300, 240],
    )
    assert.equal(data.name, 'Анна')
    assert.equal(data.events[0]?.title, 'День рождения мамы')
    assert.equal(data.events[0]?.date, '2026-11-24')
    const restored = parseDemoData(JSON.parse(JSON.stringify(data)))
    assert.equal(restored?.balance, 840)
  })

  it('восстанавливает исходные данные при повреждённом JSON', () => {
    const broken = readDemoData('{')
    assert.equal(broken.balance, 840)
    assert.equal(broken.name, 'Анна')

    const mismatched = readDemoData(
      JSON.stringify({
        version: 1,
        name: 'Анна',
        balance: 10,
        operations: createDefaultData().operations,
        favorites: [],
        events: createDefaultData().events,
      }),
    )
    assert.equal(mismatched.balance, 840)
    assert.equal(mismatched.name, 'Анна')
  })
})
