import { useMemo, useState } from 'react'
import { makeId } from '../lib/id'
import { newCard } from '../lib/spaced'
import { todayISO } from '../lib/time'
import type { Deck } from '../lib/types'
import { EmptyState } from './ui/empty-state'

function parseImport(text: string): Array<{ front: string; back: string }> {
  const lines = text
    .split(/\r?\n/g)
    .map((l) => l.trim())
    .filter(Boolean)

  const pairs: Array<{ front: string; back: string }> = []
  for (const line of lines) {
    const idx = line.indexOf(':')
    if (idx <= 0) continue
    const front = line.slice(0, idx).trim()
    const back = line.slice(idx + 1).trim()
    if (!front || !back) continue
    pairs.push({ front, back })
  }
  return pairs
}

export function DecksView({
  decks,
  onCreate,
  onUpdate,
  onDelete,
  onStartStudy,
}: {
  decks: Deck[]
  onCreate: (name: string) => void
  onUpdate: (deck: Deck) => void
  onDelete: (deckId: string) => void
  onStartStudy: (deckId: string) => void
}) {
  const [creatingName, setCreatingName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const editing = useMemo(
    () => decks.find((d) => d.id === editingId) ?? null,
    [decks, editingId],
  )

  const sorted = useMemo(
    () => [...decks].sort((a, b) => b.updatedISO.localeCompare(a.updatedISO)),
    [decks],
  )

  return (
    <div className="stack">
      <div className="panel">
        <div className="row between wrap gap">
          <div>
            <h1>Decks</h1>
            <p className="muted">
              Make decks. Add cards. Then play a study round.
            </p>
          </div>

          <form
            className="row gap"
            onSubmit={(e) => {
              e.preventDefault()
              const name = creatingName.trim()
              if (!name) return
              onCreate(name)
              setCreatingName('')
            }}
          >
            <input
              className="input"
              value={creatingName}
              onChange={(e) => setCreatingName(e.target.value)}
              placeholder="New deck name…"
              aria-label="New deck name"
            />
            <button className="btn primary" type="submit">
              Create
            </button>
          </form>
        </div>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          title="No decks yet"
          body='Create a deck to start. Tip: import cards as "front: back" (one per line).'
        />
      ) : (
        <div className="grid3">
          {sorted.map((deck) => (
            <div key={deck.id} className="card">
              <div className="row between gap">
                <div>
                  <h2 className="h3">{deck.name}</h2>
                  <p className="muted small">
                    {deck.cards.length} card{deck.cards.length === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="row gap">
                  <button
                    className="btn"
                    type="button"
                    onClick={() => setEditingId(deck.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn primary"
                    type="button"
                    onClick={() => onStartStudy(deck.id)}
                    disabled={deck.cards.length === 0}
                    title={deck.cards.length === 0 ? 'Add cards first' : ''}
                  >
                    Study
                  </button>
                </div>
              </div>

              <div className="row between">
                <span className="tag">Updated</span>
                <span className="muted small">{deck.updatedISO}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing ? (
        <DeckEditor
          deck={editing}
          onClose={() => setEditingId(null)}
          onDelete={() => {
            onDelete(editing.id)
            setEditingId(null)
          }}
          onChange={(next) => onUpdate(next)}
        />
      ) : null}
    </div>
  )
}

function DeckEditor({
  deck,
  onClose,
  onChange,
  onDelete,
}: {
  deck: Deck
  onClose: () => void
  onChange: (deck: Deck) => void
  onDelete: () => void
}) {
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [importText, setImportText] = useState('')

  function downloadText(filename: string, contents: string) {
    const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportAsColon(deck: Deck): string {
    return deck.cards.map((c) => `${c.front}: ${c.back}`).join('\n') + '\n'
  }

  function exportAsJson(deck: Deck): string {
    return JSON.stringify(deck, null, 2) + '\n'
  }

  return (
    <div className="modalBackdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="row between gap">
          <div>
            <h2>Edit deck</h2>
            <p className="muted small">{deck.name}</p>
          </div>
          <div className="row gap">
            <button className="btn" type="button" onClick={onClose}>
              Done
            </button>
            <button className="btn danger" type="button" onClick={onDelete}>
              Delete deck
            </button>
          </div>
        </div>

        <div className="divider" />

        <div className="grid2">
          <div className="panel">
            <h3>Add a card</h3>
            <form
              className="stack"
              onSubmit={(e) => {
                e.preventDefault()
                const f = front.trim()
                const b = back.trim()
                if (!f || !b) return
                const next: Deck = {
                  ...deck,
                  updatedISO: todayISO(),
                  cards: [...deck.cards, newCard(f, b, makeId('card'))],
                }
                onChange(next)
                setFront('')
                setBack('')
              }}
            >
              <input
                className="input"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Front (question / term)…"
              />
              <input
                className="input"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="Back (answer / definition)…"
              />
              <button className="btn primary" type="submit">
                Add card
              </button>
            </form>
          </div>

          <div className="panel">
            <h3>Import (TAB-separated)</h3>
            <p className="muted small">
              One card per line: <code>front</code>: <code>back</code>
            </p>
            <textarea
              className="textarea"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={'Capital of France?: Paris\n2+2?: 4'}
              rows={7}
            />
            <div className="row gap wrap">
              <button
                className="btn primary"
                type="button"
                onClick={() => {
                  const pairs = parseImport(importText)
                  if (pairs.length === 0) return
                  const nextCards = pairs.map((p) =>
                    newCard(p.front, p.back, makeId('card')),
                  )
                  const next: Deck = {
                    ...deck,
                    updatedISO: todayISO(),
                    cards: [...deck.cards, ...nextCards],
                  }
                  onChange(next)
                  setImportText('')
                }}
              >
                Import
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => setImportText('')}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="panel">
          <div className="row between gap wrap">
            <h3>Export</h3>
            <div className="row gap wrap">
              <button
                className="btn"
                type="button"
                onClick={() =>
                  downloadText(
                    `${deck.name.replaceAll(' ', '_')}.txt`,
                    exportAsColon(deck),
                  )
                }
                disabled={deck.cards.length === 0}
                title={deck.cards.length === 0 ? 'Add cards first' : ''}
              >
                Export .txt
              </button>
              <button
                className="btn"
                type="button"
                onClick={() =>
                  downloadText(
                    `${deck.name.replaceAll(' ', '_')}.json`,
                    exportAsJson(deck),
                  )
                }
                disabled={deck.cards.length === 0}
                title={deck.cards.length === 0 ? 'Add cards first' : ''}
              >
                Export .json
              </button>
            </div>
          </div>
          <p className="muted small">
            Text export uses <code>front</code>: <code>back</code> per line.
          </p>
        </div>

        <div className="divider" />

        <div className="panel">
          <div className="row between gap">
            <h3>Cards</h3>
            <span className="muted small">{deck.cards.length} total</span>
          </div>
          {deck.cards.length === 0 ? (
            <p className="muted">Add a few cards and come back to study.</p>
          ) : (
            <div className="table">
              {deck.cards
                .slice()
                .reverse()
                .slice(0, 25)
                .map((c) => (
                  <div key={c.id} className="tableRow">
                    <div className="tableCell">
                      <span className="tag">Q</span> {c.front}
                    </div>
                    <div className="tableCell muted">
                      <span className="tag">A</span> {c.back}
                    </div>
                    <div className="tableCell right">
                      <button
                        className="btn"
                        type="button"
                        onClick={() => {
                          const next: Deck = {
                            ...deck,
                            updatedISO: todayISO(),
                            cards: deck.cards.filter((x) => x.id !== c.id),
                          }
                          onChange(next)
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
          {deck.cards.length > 25 ? (
            <p className="muted small">Showing the last 25 cards.</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
