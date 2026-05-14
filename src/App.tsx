import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { DashboardView } from './components/dashboard'
import { DecksView } from './components/decks'
import { StudyView } from './components/study'
import { makeId } from './lib/id'
import { computeLevelFromXp, loadState, saveState } from './lib/storage'
import { todayISO } from './lib/time'
import type { AppState, Deck } from './lib/types'

function App() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [tab, setTab] = useState<'dashboard' | 'decks' | 'study'>('dashboard')
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null)

  useEffect(() => {
    saveState(state)
  }, [state])

  const decksSorted = useMemo(
    () => [...state.decks].sort((a, b) => b.updatedISO.localeCompare(a.updatedISO)),
    [state.decks],
  )

  function createDeck(name: string) {
    const now = todayISO()
    const deck: Deck = {
      id: makeId('deck'),
      name,
      createdISO: now,
      updatedISO: now,
      cards: [],
    }
    setState((s) => ({ ...s, decks: [deck, ...s.decks] }))
  }

  function updateDeck(nextDeck: Deck) {
    setState((s) => ({
      ...s,
      decks: s.decks.map((d) => (d.id === nextDeck.id ? nextDeck : d)),
    }))
  }

  function deleteDeck(deckId: string) {
    setState((s) => ({ ...s, decks: s.decks.filter((d) => d.id !== deckId) }))
    if (activeDeckId === deckId) setActiveDeckId(null)
  }

  function earnXp(delta: number, studiedOneCard: boolean) {
    setState((s) => {
      const xp = Math.max(0, s.profile.xp + delta)
      const level = computeLevelFromXp(xp)

      let streak = s.profile.streak
      let lastStudyISO = s.profile.lastStudyISO
      if (studiedOneCard) {
        const today = todayISO()
        const last = lastStudyISO?.slice(0, 10)
        if (last !== today) {
          const yesterday = new Date(today + 'T00:00:00Z')
          yesterday.setUTCDate(yesterday.getUTCDate() - 1)
          const y = yesterday.toISOString().slice(0, 10)
          streak = last === y ? streak + 1 : 1
          lastStudyISO = today
        }
      }

      return { ...s, profile: { ...s.profile, xp, level, streak, lastStudyISO } }
    })
  }

  return (
    <div className="appShell">
      <header className="topbar">
        <button
          className="brandBtn"
          type="button"
          onClick={() => setTab('dashboard')}
        >
          <span className="brandMark" aria-hidden="true">
            SG
          </span>
          <span className="brandText">StudyGame</span>
        </button>

        <nav className="tabs" aria-label="Primary">
          <button
            className={tab === 'dashboard' ? 'tab active' : 'tab'}
            type="button"
            onClick={() => setTab('dashboard')}
          >
            Home
          </button>
          <button
            className={tab === 'decks' ? 'tab active' : 'tab'}
            type="button"
            onClick={() => setTab('decks')}
          >
            Decks
          </button>
          <button
            className={tab === 'study' ? 'tab active' : 'tab'}
            type="button"
            onClick={() => setTab('study')}
          >
            Study
          </button>
        </nav>

        <div className="hud" aria-label="Progress">
          <span className="hudItem">Lvl {state.profile.level}</span>
          <span className="hudItem">{state.profile.xp} XP</span>
          <span className="hudItem">Streak {state.profile.streak}</span>
        </div>
      </header>

      <main className="content">
        {tab === 'dashboard' ? (
          <DashboardView
            profile={state.profile}
            decks={decksSorted}
            onGoDecks={() => setTab('decks')}
            onGoStudy={(pickDeckId) => {
              if (pickDeckId) setActiveDeckId(pickDeckId)
              setTab('study')
            }}
          />
        ) : null}

        {tab === 'decks' ? (
          <DecksView
            decks={decksSorted}
            onCreate={createDeck}
            onUpdate={updateDeck}
            onDelete={deleteDeck}
            onStartStudy={(deckId) => {
              setActiveDeckId(deckId)
              setTab('study')
            }}
          />
        ) : null}

        {tab === 'study' ? (
          <StudyView
            decks={decksSorted}
            activeDeckId={activeDeckId}
            onSetActiveDeck={setActiveDeckId}
            onDeckUpdate={updateDeck}
            onEarnXp={earnXp}
          />
        ) : null}
      </main>

      <footer className="footer">
        <p className="muted small">
          Tip: import cards as <code>front</code> TAB <code>back</code>. Your
          progress saves automatically in this browser.
        </p>
      </footer>
    </div>
  )
}

export default App

