/** Пути к файлам из public с учётом base для GitHub Pages. */
export function asset(path: string): string {
  const base =
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    typeof import.meta.env.BASE_URL === 'string'
      ? import.meta.env.BASE_URL
      : '/'
  const clean = path.replace(/^\//, '')
  return `${base}${clean}`
}
