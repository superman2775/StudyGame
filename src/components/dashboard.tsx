import { useMemo } from 'react'
import { isDue } from '../lib/spaced'
import { todayISO } from '../lib/time'
import type { Deck, Profile } from '../lib/types'
import { EmptyState } from './ui/empty-state'
import { HeroScrollDemo } from './ui/hero-scroll-demo'

function countDue(decks: Deck[]): number {
  const today = todayISO()
  let total = 0
  for (const d of decks) total += d.cards.filter((c) => isDue(c, today)).length
  return total
}

export function DashboardView({
  profile,
  decks,
  onGoDecks,
  onGoStudy,
}: {
  profile: Profile
  decks: Deck[]
  onGoDecks: () => void
  onGoStudy: (pickDeckId?: string) => void
}) {
  const due = useMemo(() => countDue(decks), [decks])
  const totalCards = useMemo(
    () => decks.reduce((sum, d) => sum + d.cards.length, 0),
    [decks],
  )

  return (
    <div className="stack">
      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        <HeroScrollDemo />
      </div>

      <div className="panel">
        <div className="row between wrap gap">
          <div>
            <h1>StudyGame</h1>
            <p className="muted">
              Welcome back. Keep the streak alive and farm XP (the legal kind).
            </p>
          </div>
          <div className="row gap wrap">
            <button className="btn" type="button" onClick={onGoDecks}>
              Manage decks
            </button>
            <button
              className="btn primary"
              type="button"
              onClick={() => onGoStudy()}
              disabled={decks.length === 0}
            >
              Start studying
            </button>
          </div>
        </div>
      </div>

      <div className="grid3">
        <div className="card">
          <p className="muted small">Level</p>
          <div className="bigNumber">{profile.level}</div>
          <p className="muted small">{profile.xp} XP</p>
        </div>
        <div className="card">
          <p className="muted small">Streak</p>
          <div className="bigNumber">{profile.streak}</div>
          <p className="muted small">days</p>
        </div>
        <div className="card">
          <p className="muted small">Due today</p>
          <div className="bigNumber">{due}</div>
          <p className="muted small">
            {decks.length} deck{decks.length === 1 ? '' : 's'} · {totalCards}{' '}
            card{totalCards === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {decks.length === 0 ? (
        <EmptyState
          title="Your quest log is empty"
          body="Create a deck, add a few cards, then come back to play your first round."
          actions={
            <button className="btn primary" type="button" onClick={onGoDecks}>
              Create a deck
            </button>
          }
        />
      ) : (
        <div className="panel">
          <h2>Quick start</h2>
          <p className="muted small">
            Pick a deck and jump straight into a round.
          </p>
          <div className="row gap wrap">
            {decks
              .slice()
              .sort((a, b) => b.updatedISO.localeCompare(a.updatedISO))
              .slice(0, 8)
              .map((d) => (
                <button
                  key={d.id}
                  className="btn"
                  type="button"
                  onClick={() => onGoStudy(d.id)}
                  disabled={d.cards.length === 0}
                  title={d.cards.length === 0 ? 'Add cards first' : ''}
                >
                  {d.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
