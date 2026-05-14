import './App.css'

function App() {
  const features = [
    {
      title: 'Quick rounds',
      description:
        'Turn 10-15 cards into a fast game loop so starting feels effortless.',
    },
    {
      title: 'Spaced review',
      description:
        'Focus on what you miss most and bring it back at the right time.',
    },
    {
      title: 'Streaks & goals',
      description:
        'Keep momentum with daily goals, streaks, and clear progress signals.',
    },
    {
      title: 'Import anything',
      description:
        'Create decks from notes, definitions, formulas, or language vocab.',
    },
    {
      title: 'Mistake journal',
      description:
        'Review the cards you struggled with and learn from the pattern.',
    },
    {
      title: 'Works anywhere',
      description:
        'A lightweight web app you can open on desktop, tablet, or mobile.',
    },
  ]

  return (
    <div className="page">
      <header className="header">
        <a className="brand" href="#top" aria-label="StudyGame home">
          <span className="brandMark" aria-hidden="true">
            SG
          </span>
          <span className="brandText">StudyGame</span>
        </a>

        <nav className="nav" aria-label="Primary">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#get-started">Get started</a>
        </nav>
      </header>

      <main id="top" className="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="heroGrid">
            <div className="heroCopy">
              <p className="kicker">Study, but make it a game</p>
              <h1 id="hero-title">Build a streak. Beat your backlog.</h1>
              <p className="subtitle">
                StudyGame is a simple, game-like study companion that helps you
                practice what matters most, in short rounds you can actually
                stick with.
              </p>

              <div className="ctaRow">
                <a className="btn primary" href="#get-started">
                  Start studying
                </a>
                <a className="btn" href="#features">
                  See features
                </a>
              </div>

              <div className="pillRow" role="list" aria-label="Highlights">
                <span className="pill" role="listitem">
                  Quick quizzes
                </span>
                <span className="pill" role="listitem">
                  Spaced review
                </span>
                <span className="pill" role="listitem">
                  Progress streaks
                </span>
              </div>
            </div>

            <div className="heroCard" aria-label="Preview">
              <div className="cardTop">
                <span className="chip">Today</span>
                <span className="chip chipAccent">5 min</span>
              </div>
              <div className="prompt">
                <p className="promptLabel">Card</p>
                <p className="promptText">What is the derivative of sin(x)?</p>
              </div>
              <div className="answers" role="list" aria-label="Choices">
                <div className="answer" role="listitem">
                  cos(x)
                </div>
                <div className="answer" role="listitem">
                  -cos(x)
                </div>
                <div className="answer" role="listitem">
                  sin(x)
                </div>
              </div>
              <div className="cardBottom">
                <span className="meterLabel">Streak</span>
                <div className="meter" aria-hidden="true">
                  <span style={{ width: '72%' }} />
                </div>
                <span className="meterValue">18 days</span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section" aria-labelledby="features-h">
          <div className="sectionHead">
            <h2 id="features-h">Everything you need to keep momentum</h2>
            <p className="sectionLead">
              Designed for short sessions, consistent progress, and fast
              feedback.
            </p>
          </div>

          <div className="grid">
            {features.map((feature) => (
              <article key={feature.title} className="featureCard">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="section" aria-labelledby="how-h">
          <div className="sectionHead">
            <h2 id="how-h">How it works</h2>
            <p className="sectionLead">
              A simple loop: pick a deck, play a round, review what you missed.
            </p>
          </div>

          <ol className="steps">
            <li className="step">
              <div className="stepNum" aria-hidden="true">
                1
              </div>
              <div>
                <h3>Choose a deck</h3>
                <p>
                  Import notes or create a deck for any subject: formulas,
                  definitions, vocab, dates, or concepts.
                </p>
              </div>
            </li>
            <li className="step">
              <div className="stepNum" aria-hidden="true">
                2
              </div>
              <div>
                <h3>Play fast rounds</h3>
                <p>
                  Answer cards in a quick flow. No setup friction, just
                  repetition with instant feedback.
                </p>
              </div>
            </li>
            <li className="step">
              <div className="stepNum" aria-hidden="true">
                3
              </div>
              <div>
                <h3>Review your mistakes</h3>
                <p>
                  Turn misses into wins. StudyGame brings back the cards you
                  struggle with until they stick.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section
          id="get-started"
          className="section cta"
          aria-labelledby="start-h"
        >
          <div className="ctaBox">
            <h2 id="start-h">Ready to study?</h2>
            <p>
              This is the landing page scaffold. Next step is adding decks,
              rounds, and progress tracking.
            </p>
            <div className="ctaRow">
              <a className="btn primary" href="#top">
                Back to top
              </a>
              <a
                className="btn"
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
              >
                Connect repo
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          <span className="muted">StudyGame</span> — make studying feel like a game.
        </p>
      </footer>
    </div>
  )
}

export default App
