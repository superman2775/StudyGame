import { useMemo } from 'react'
import { isDue } from '../lib/spaced'
import { todayISO } from '../lib/time'
import type { Deck, Profile } from '../lib/types'
import { EmptyState } from './ui/empty-state'

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
      <section className="heroSection panel">
        <div className="heroGrid">
          <div className="heroCopy">
            <p className="kicker">Study, but make it a game</p>
            <h1 className="heroTitle">Build a streak. Beat your backlog.</h1>
            <p className="muted heroSubtitle">
              StudyGame turns quick reviews into a loop you’ll actually stick
              with: decks → rounds → XP → streak.
            </p>

            <div className="row gap wrap" style={{ marginTop: 14 }}>
              <button className="btn primary" type="button" onClick={() => onGoStudy()}>
                Start studying
              </button>
              <button className="btn" type="button" onClick={onGoDecks}>
                Manage decks
              </button>
            </div>

            <div className="pillRow" role="list" aria-label="Highlights">
              <span className="pill" role="listitem">
                Quick rounds
              </span>
              <span className="pill" role="listitem">
                Due-first review
              </span>
              <span className="pill" role="listitem">
                Combo XP
              </span>
            </div>
          </div>

          <div className="heroPreview" aria-label="Progress preview">
            <div className="row between gap">
              <span className="tag">Level</span>
              <span className="tag">Streak</span>
              <span className="tag">Due</span>
            </div>
            <div className="heroStats">
              <div className="heroStat">
                <div className="bigNumber">{profile.level}</div>
                <p className="muted small">{profile.xp} XP</p>
              </div>
              <div className="heroStat">
                <div className="bigNumber">{profile.streak}</div>
                <p className="muted small">days</p>
              </div>
              <div className="heroStat">
                <div className="bigNumber">{due}</div>
                <p className="muted small">due today</p>
              </div>
            </div>
            <div className="divider" />
            <p className="muted small">
              Tip: keep a combo in Study to earn bonus XP.
            </p>
          </div>
        </div>
      </section>

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
        <section className="panel">
          <div className="row between wrap gap">
            <div>
              <h2>Quick start</h2>
              <p className="muted small">
                Pick a deck and jump straight into a round.
              </p>
            </div>
            <div className="row gap wrap">
              <span className="tag">{decks.length} deck{decks.length === 1 ? '' : 's'}</span>
              <span className="tag">{totalCards} card{totalCards === 1 ? '' : 's'}</span>
            </div>
          </div>

          <div className="row gap wrap" style={{ marginTop: 10 }}>
            {decks
              .slice()
              .sort((a, b) => b.updatedISO.localeCompare(a.updatedISO))
              .slice(0, 10)
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
        </section>
      )}
    </div>
  )
}
