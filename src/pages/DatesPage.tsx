import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { DATES_NOTE } from '../data/salons'
import { dateDistanceLabel, formatEventDate } from '../lib/format'
import { useAppState } from '../state/store'

export function DatesPage() {
  const { data, addEvent, removeEvent } = useAppState()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const events = [...data.events].sort(
    (a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, 'ru'),
  )

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const message = addEvent(title, date)
    if (message) {
      setError(message)
      return
    }
    setTitle('')
    setDate('')
    setError(null)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-semibold">Важные даты</h1>
      <p className="mt-2 text-sm leading-6 text-muted">{DATES_NOTE}</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-[18px] border border-line bg-white p-4">
        <div>
          <label htmlFor="event-title" className="mb-2 block text-sm font-medium">
            Название
          </label>
          <input
            id="event-title"
            value={title}
            maxLength={80}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-2xl border border-line px-4 py-3"
            placeholder="Годовщина"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'event-error' : undefined}
          />
        </div>
        <div>
          <label htmlFor="event-date" className="mb-2 block text-sm font-medium">
            Дата
          </label>
          <input
            id="event-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-2xl border border-line px-4 py-3"
          />
        </div>
        {error ? (
          <p id="event-error" role="alert" className="text-sm text-wine">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-wine px-5 py-3 text-sm font-medium text-white"
        >
          Добавить событие
        </button>
      </form>

      {events.length === 0 ? (
        <p className="mt-6 text-sm text-muted">Сохранённых событий пока нет.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {events.map((event) => (
            <li key={event.id} className="rounded-[18px] border border-line bg-white p-4">
              <p className="font-display text-lg font-semibold break-words">{event.title}</p>
              <p className="mt-1 text-sm text-muted">
                {formatEventDate(event.date)} · {dateDistanceLabel(event.date)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/catalog"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-powder px-4 text-sm font-medium text-wine"
                >
                  Выбрать букет
                </Link>
                <button
                  type="button"
                  onClick={() => removeEvent(event.id)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-line px-4 text-sm"
                  aria-label={`Удалить «${event.title}»`}
                >
                  <Trash2 aria-hidden="true" size={16} />
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
