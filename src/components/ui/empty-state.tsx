import type { ReactNode } from 'react'

export function EmptyState({
  title,
  body,
  actions,
}: {
  title: string
  body: string
  actions?: ReactNode
}) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      <p className="muted">{body}</p>
      {actions ? <div className="row gap">{actions}</div> : null}
    </div>
  )
}

