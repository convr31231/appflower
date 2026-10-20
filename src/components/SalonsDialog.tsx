import { MapPin, Phone } from 'lucide-react'
import { salons } from '../data/salons'
import { Modal } from './Modal'

type SalonsDialogProps = {
  open: boolean
  onClose: () => void
}

export function SalonsDialog({ open, onClose }: SalonsDialogProps) {
  return (
    <Modal open={open} title="Наши салоны" onClose={onClose}>
      <p className="mb-4 text-sm leading-6 text-muted">
        Четыре салона в Нижнем Новгороде. Часы работы уточняйте по телефону.
      </p>
      <ul className="space-y-3">
        {salons.map((salon, index) => (
          <li key={salon.id} className="rounded-[16px] border border-line bg-white px-4 py-3">
            <p className="flex items-start gap-2 text-sm font-medium text-ink">
              <MapPin aria-hidden="true" size={16} className="mt-0.5 shrink-0 text-wine" />
              {salon.address}
            </p>
            <a
              href={salon.tel}
              data-autofocus={index === 0 ? true : undefined}
              className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm text-wine"
            >
              <Phone aria-hidden="true" size={16} />
              {salon.phone}
            </a>
          </li>
        ))}
      </ul>
    </Modal>
  )
}
