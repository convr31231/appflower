import { useEffect, useState, type FormEvent } from 'react'
import { APP_INFO } from '../data/salons'
import { Modal } from '../components/Modal'
import { useAppState } from '../state/store'

export function ProfilePage() {
  const { data, rename, resetDemo, openStaff } = useAppState()
  const [name, setName] = useState(data.name)
  const [error, setError] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    setName(data.name)
  }, [data.name])

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const message = rename(name)
    setError(message)
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-3xl font-semibold">Профиль</h1>
      <p className="mt-2 text-sm text-muted">Имя используется только в этой демонстрации.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-[18px] border border-line bg-white p-4">
        <div>
          <label htmlFor="demo-name" className="mb-2 block text-sm font-medium">
            Имя
          </label>
          <input
            id="demo-name"
            value={name}
            maxLength={40}
            autoComplete="off"
            onChange={(event) => setName(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'name-error' : undefined}
            className="w-full rounded-2xl border border-line px-4 py-3"
          />
        </div>
        {error ? (
          <p id="name-error" role="alert" className="text-sm text-wine">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-wine px-5 py-3 text-sm font-medium text-white"
        >
          Сохранить имя
        </button>
      </form>

      <div className="mt-4 grid gap-3">
        <button
          type="button"
          onClick={openStaff}
          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-line bg-white px-5 py-3 text-sm font-medium"
        >
          Панель сотрудника
        </button>
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-wine px-5 py-3 text-sm font-medium text-wine"
        >
          Сбросить демонстрацию
        </button>
      </div>

      <section id="about" className="mt-8 rounded-[18px] bg-powder p-5">
        <h2 className="font-display text-lg font-semibold">О приложении</h2>
        <p className="mt-2 text-sm leading-6 text-ink">{APP_INFO}</p>
        <a href="https://centrroznn.ru" target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm text-wine">
          Сайт магазина
        </a>
      </section>

      <Modal open={confirmReset} title="Сбросить демонстрацию?" onClose={() => setConfirmReset(false)}>
        <p className="text-sm leading-6 text-muted">
          Имя, бонусы, история, избранное и важные даты вернутся к исходным значениям.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            data-autofocus
            onClick={() => {
              resetDemo()
              setConfirmReset(false)
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-wine px-5 py-3 text-sm font-medium text-white"
          >
            Сбросить
          </button>
          <button
            type="button"
            onClick={() => setConfirmReset(false)}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-line bg-white px-5 py-3 text-sm"
          >
            Отмена
          </button>
        </div>
      </Modal>
    </div>
  )
}
