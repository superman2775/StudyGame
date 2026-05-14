import { useEffect, useMemo, useRef, useState } from 'react'
import { gradeCard, isDue } from '../lib/spaced'
import { todayISO } from '../lib/time'
import type { Deck } from '../lib/types'
import { EmptyState } from './ui/empty-state'

type SessionCard = {
  id: string
  front: string
  back: string
  deckId: string
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

function pickSession(deck: Deck, count: number): SessionCard[] {
  const today = todayISO()
  const due = deck.cards.filter((c) => isDue(c, today))
  const notDue = deck.cards.filter((c) => !isDue(c, today))
  const shuffledDue = [...due].sort(() => Math.random() - 0.5)
  const shuffledNotDue = [...notDue].sort(() => Math.random() - 0.5)

  const picked = [...shuffledDue, ...shuffledNotDue].slice(0, count)
  return picked.map((c) => ({
    id: c.id,
    deckId: deck.id,
    front: c.front,
    back: c.back,
  }))
}

export function StudyView({
  decks,
  activeDeckId,
  onSetActiveDeck,
  onDeckUpdate,
  onEarnXp,
}: {
  decks: Deck[]
  activeDeckId: string | null
  onSetActiveDeck: (deckId: string | null) => void
  onDeckUpdate: (deck: Deck) => void
  onEarnXp: (delta: number, studiedOneCard: boolean) => void
}) {
  const deck = useMemo(
    () => decks.find((d) => d.id === activeDeckId) ?? null,
    [decks, activeDeckId],
  )

  const [sessionSize, setSessionSize] = useState(12)
  const [session, setSession] = useState<SessionCard[] | null>(null)
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [combo, setCombo] = useState(0)
  const [score, setScore] = useState({ correct: 0, incorrect: 0 })

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (session) inputRef.current?.focus()
  }, [session, index])

  const dueCount = useMemo(() => {
    if (!deck) return 0
    const today = todayISO()
    return deck.cards.filter((c) => isDue(c, today)).length
  }, [deck])

  if (decks.length === 0) {
    return (
      <EmptyState
        title="No decks to study"
        body="Create a deck first, then come back here to play a study round."
      />
    )
  }

  if (!deck) {
    return (
      <div className="stack">
        <div className="panel">
          <h1>Study</h1>
          <p className="muted">Pick a deck and start a round.</p>
          <div className="row gap wrap">
            {decks.map((d) => (
              <button
                key={d.id}
                className="btn"
                type="button"
                onClick={() => onSetActiveDeck(d.id)}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const current = session?.[index] ?? null
  const done = session && index >= session.length

  return (
    <div className="stack">
      <div className="panel">
        <div className="row between wrap gap">
          <div>
            <h1>Study</h1>
            <p className="muted">
              Deck: <strong>{deck.name}</strong> · Due today: {dueCount}
            </p>
          </div>

          <div className="row gap wrap">
            <select
              className="input"
              value={deck.id}
              onChange={(e) => onSetActiveDeck(e.target.value)}
              aria-label="Select deck"
            >
              {decks.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <button
              className="btn"
              type="button"
              onClick={() => {
                setSession(null)
                setIndex(0)
                setInput('')
                setRevealed(false)
                setCombo(0)
                setScore({ correct: 0, incorrect: 0 })
              }}
              disabled={!session}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {!session ? (
        <div className="panel">
          <div className="row between wrap gap">
            <div>
              <h2>Start a round</h2>
              <p className="muted">
                You’ll get due cards first. Keep a combo to earn bonus XP.
              </p>
            </div>
            <div className="row gap wrap">
              <label className="row gap small muted">
                Cards
                <input
                  className="input"
                  type="number"
                  min={5}
                  max={50}
                  value={sessionSize}
                  onChange={(e) => setSessionSize(Number(e.target.value))}
                  style={{ width: 110 }}
                />
              </label>
              <button
                className="btn primary"
                type="button"
                onClick={() => {
                  const picked = pickSession(deck, sessionSize)
                  setSession(picked)
                  setIndex(0)
                  setInput('')
                  setRevealed(false)
                  setCombo(0)
                  setScore({ correct: 0, incorrect: 0 })
                }}
                disabled={deck.cards.length === 0}
              >
                Play
              </button>
            </div>
          </div>
        </div>
      ) : done ? (
        <div className="panel win">
          <div className="row between wrap gap">
            <div>
              <h2>Round complete</h2>
              <p className="muted">
                Correct: {score.correct} · Misses: {score.incorrect} · Best combo:{' '}
                {combo}
              </p>
            </div>
            <div className="row gap wrap">
              <button
                className="btn"
                type="button"
                onClick={() => setSession(null)}
              >
                Back
              </button>
              <button
                className="btn primary"
                type="button"
                onClick={() => {
                  const picked = pickSession(deck, sessionSize)
                  setSession(picked)
                  setIndex(0)
                  setInput('')
                  setRevealed(false)
                  setCombo(0)
                  setScore({ correct: 0, incorrect: 0 })
                }}
              >
                Play again
              </button>
            </div>
          </div>
          <p className="confetti" aria-hidden="true">
            ✦ ✧ ✦ ✧ ✦ ✧ ✦
          </p>
        </div>
      ) : current ? (
        <div className="panel">
          <div className="row between wrap gap">
            <div>
              <span className="tag">
                Card {index + 1}/{session.length}
              </span>
              <span className="tag" style={{ marginLeft: 8 }}>
                Combo {combo}
              </span>
            </div>
            <div className="row gap">
              <span className="muted small">
                Score {score.correct}–{score.incorrect}
              </span>
            </div>
          </div>

          <div className="divider" />

          <div className="studyCard">
            <p className="muted small">Front</p>
            <h2 className="studyFront">{current.front}</h2>

            <div className="stack">
              <label className="muted small" htmlFor="answer">
                Your answer
              </label>
              <input
                id="answer"
                ref={inputRef}
                className="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    setRevealed(true)
                  }
                }}
                placeholder="Type it, then press Enter…"
                disabled={revealed}
              />
            </div>

            {!revealed ? (
              <div className="row gap wrap">
                <button
                  className="btn primary"
                  type="button"
                  onClick={() => setRevealed(true)}
                >
                  Reveal
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    // skip without grading
                    setIndex((i) => i + 1)
                    setInput('')
                    setRevealed(false)
                  }}
                >
                  Skip
                </button>
              </div>
            ) : (
              <div className="panel inset">
                <p className="muted small">Back</p>
                <p className="answerText">{current.back}</p>
                <p className="muted small">
                  Your answer: <span className="mono">{input || '—'}</span>
                </p>

                <div className="row gap wrap">
                  <button
                    className="btn primary"
                    type="button"
                    onClick={() => {
                      const correct = normalize(input) === normalize(current.back)
                      const nextDeck: Deck = {
                        ...deck,
                        updatedISO: todayISO(),
                        cards: deck.cards.map((c) =>
                          c.id === current.id ? gradeCard(c, correct) : c,
                        ),
                      }
                      onDeckUpdate(nextDeck)

                      const baseXp = correct ? 12 : 4
                      const comboBonus = correct ? Math.min(10, combo) : 0
                      onEarnXp(baseXp + comboBonus, true)

                      setScore((s) =>
                        correct
                          ? { ...s, correct: s.correct + 1 }
                          : { ...s, incorrect: s.incorrect + 1 },
                      )
                      setCombo((c) => (correct ? c + 1 : 0))
                      setIndex((i) => i + 1)
                      setInput('')
                      setRevealed(false)
                    }}
                  >
                    Auto grade
                  </button>

                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      const nextDeck: Deck = {
                        ...deck,
                        updatedISO: todayISO(),
                        cards: deck.cards.map((c) =>
                          c.id === current.id ? gradeCard(c, true) : c,
                        ),
                      }
                      onDeckUpdate(nextDeck)
                      onEarnXp(12 + Math.min(10, combo), true)
                      setScore((s) => ({ ...s, correct: s.correct + 1 }))
                      setCombo((c) => c + 1)
                      setIndex((i) => i + 1)
                      setInput('')
                      setRevealed(false)
                    }}
                  >
                    I was right
                  </button>

                  <button
                    className="btn danger"
                    type="button"
                    onClick={() => {
                      const nextDeck: Deck = {
                        ...deck,
                        updatedISO: todayISO(),
                        cards: deck.cards.map((c) =>
                          c.id === current.id ? gradeCard(c, false) : c,
                        ),
                      }
                      onDeckUpdate(nextDeck)
                      onEarnXp(4, true)
                      setScore((s) => ({ ...s, incorrect: s.incorrect + 1 }))
                      setCombo(0)
                      setIndex((i) => i + 1)
                      setInput('')
                      setRevealed(false)
                    }}
                  >
                    I missed
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
