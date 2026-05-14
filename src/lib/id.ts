export function makeId(prefix = 'id'): string {
  const rand = Math.random().toString(36).slice(2, 9)
  const ts = Date.now().toString(36)
  return `${prefix}_${ts}_${rand}`
}

