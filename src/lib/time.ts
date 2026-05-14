export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function addDaysISO(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + days)
  return dt.toISOString().slice(0, 10)
}

export function isSameDayISO(a?: string, b?: string): boolean {
  if (!a || !b) return false
  return a.slice(0, 10) === b.slice(0, 10)
}

export function isBeforeOrSameISO(a: string, b: string): boolean {
  return a <= b
}

