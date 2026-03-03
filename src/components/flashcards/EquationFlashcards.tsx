import { useState, useEffect, useCallback, useMemo, useRef } from "preact/hooks";
import type { Flashcard } from "../../lib/flashcards";
import { flashcards as allFlashcards, FLASHCARD_TOPICS } from "../../lib/flashcards";
import katex from "katex";

type View = "menu" | "cards" | "done";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── KaTeX renderer ──
function RenderedLatex({ latex, display }: { latex: string; display?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    try {
      katex.render(latex, ref.current, {
        displayMode: display ?? true,
        throwOnError: false,
        trust: true,
      });
    } catch {
      ref.current.textContent = latex;
    }
  }, [latex, display]);

  return <div ref={ref} />;
}

// ── Category color ──
const categoryColor = (cat: string) => {
  switch (cat) {
    case "Forces & Torques":
      return { color: "var(--accent)", bg: "var(--accent-soft)" };
    case "Spaces & Conventions":
      return { color: "var(--deep)", bg: "var(--deep-soft)" };
    case "Integration":
      return { color: "var(--success)", bg: "var(--success-soft)" };
    case "Damping":
      return { color: "var(--warning)", bg: "var(--warning-soft)" };
    default:
      return { color: "var(--text-muted)", bg: "var(--surface-muted)" };
  }
};

// ── Per-topic counts ──
const topicCounts = new Map<string, number>();
for (const f of allFlashcards) {
  topicCounts.set(f.topic, (topicCounts.get(f.topic) || 0) + 1);
}

// ── Menu View ──
function MenuView({
  selectedTopics,
  toggleTopic,
  cardCount,
  onStart,
  selectAll,
  selectNone,
}: {
  selectedTopics: Set<string>;
  toggleTopic: (t: string) => void;
  cardCount: number;
  onStart: () => void;
  selectAll: () => void;
  selectNone: () => void;
}) {
  return (
    <div class="page-reveal">
      <div class="surface-card" style={{ padding: "1.25rem 1.5rem", marginBottom: "0.75rem" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <p class="eyebrow" style={{ margin: 0 }}>Topics</p>
            <span style={{
              fontSize: "0.66rem", fontWeight: 600, color: "var(--text-muted)",
              background: "var(--surface-muted)", borderRadius: "4px",
              padding: "0.08rem 0.35rem", fontFamily: "var(--font-code)",
            }}>
              {selectedTopics.size}/{FLASHCARD_TOPICS.length}
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.35rem" }}>
            <button
              onClick={selectAll}
              class="chip"
              style={{ cursor: "pointer", fontSize: "0.66rem", padding: "0.18rem 0.5rem" }}
            >
              Select all
            </button>
            <button
              onClick={selectNone}
              class="chip"
              style={{ cursor: "pointer", fontSize: "0.66rem", padding: "0.18rem 0.5rem" }}
            >
              Clear
            </button>
          </div>
        </div>

        <div class="quiz-topic-grid">
          {FLASHCARD_TOPICS.map((t) => {
            const active = selectedTopics.has(t);
            const count = topicCounts.get(t) || 0;
            return (
              <button
                key={t}
                onClick={() => toggleTopic(t)}
                class={`quiz-topic-card${active ? " quiz-topic-card--active" : ""}`}
              >
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: "0.4rem",
                }}>
                  <span style={{
                    fontFamily: "var(--font-display)", fontSize: "0.84rem",
                    fontWeight: active ? 700 : 600,
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    lineHeight: "1.3",
                  }}>
                    {t}
                  </span>
                  <span style={{
                    width: "18px", height: "18px", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontSize: "0.6rem", fontWeight: 700,
                    background: active ? "var(--accent)" : "transparent",
                    border: active ? "1.5px solid var(--accent)" : "1.5px solid var(--border-strong)",
                    color: active ? "white" : "transparent",
                    transition: "all 0.18s ease",
                  }}>
                    ✓
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 700, fontFamily: "var(--font-code)",
                    color: active ? "var(--accent)" : "var(--text-muted)",
                    transition: "color 0.18s ease",
                  }}>
                    {count} cards
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start bar */}
      <div
        class="surface-card"
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "0.75rem", padding: "0.85rem 1.25rem",
        }}
      >
        <p class="display-font"
          style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)", lineHeight: "1.4" }}
        >
          <span style={{
            fontWeight: 800, fontSize: "1.1rem",
            color: cardCount > 0 ? "var(--accent)" : "var(--text-muted)",
            fontFamily: "var(--font-code)",
          }}>
            {cardCount}
          </span>{" "}
          flashcard{cardCount !== 1 ? "s" : ""} ready
        </p>
        <button
          onClick={onStart}
          disabled={cardCount === 0}
          class="quiz-start-btn"
        >
          Start Flashcards →
        </button>
      </div>
    </div>
  );
}

// ── Card View ──
function CardView({
  card,
  index,
  total,
  flipped,
  onFlip,
  onPrev,
  onNext,
}: {
  card: Flashcard;
  index: number;
  total: number;
  flipped: boolean;
  onFlip: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const progress = ((index + 1) / total) * 100;
  const cat = categoryColor(card.category);

  return (
    <div>
      {/* Progress bar */}
      <div style={{
        height: "4px", borderRadius: "2px", background: "var(--surface-muted)",
        marginBottom: "0.75rem", overflow: "hidden",
      }}>
        <div style={{
          height: "100%", width: `${progress}%`, background: "var(--accent)",
          borderRadius: "2px", transition: "width 0.4s cubic-bezier(0.2,0.8,0.2,1)",
        }} />
      </div>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)" }}>
            {index + 1} / {total}
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", borderRadius: "0.4rem",
            padding: "0.15rem 0.45rem", fontSize: "0.68rem", fontWeight: 700,
            letterSpacing: "0.03em", color: cat.color, background: cat.bg,
            border: `1px solid color-mix(in srgb, ${cat.color} 24%, var(--border-soft))`,
          }}>
            {card.category}
          </span>
        </div>
        <span style={{
          fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500,
        }}>
          {flipped ? "Showing answer" : "Click card or press Space to flip"}
        </span>
      </div>

      {/* Flashcard */}
      <div
        onClick={onFlip}
        style={{
          perspective: "1000px",
          marginBottom: "1rem",
          cursor: "pointer",
        }}
      >
        <div style={{
          position: "relative",
          width: "100%",
          minHeight: "220px",
          transition: "transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}>
          {/* Front */}
          <div
            class="surface-card"
            style={{
              position: "absolute", inset: 0,
              backfaceVisibility: "hidden",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "2rem 1.5rem",
              textAlign: "center",
            }}
          >
            <p class="eyebrow" style={{ marginBottom: "0.75rem" }}>{card.topic}</p>
            <p class="display-font" style={{
              fontSize: "1.25rem", fontWeight: 650, lineHeight: "1.5",
              color: "var(--text-primary)",
            }}>
              {card.front}
            </p>
            <p style={{
              marginTop: "1.5rem", fontSize: "0.72rem",
              color: "var(--text-muted)", fontWeight: 500,
            }}>
              Tap to reveal equation
            </p>
          </div>

          {/* Back */}
          <div
            class="surface-card"
            style={{
              position: "absolute", inset: 0,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "2rem 1.5rem",
              textAlign: "center",
              background: "color-mix(in srgb, var(--accent-soft) 25%, var(--surface-elevated))",
              borderColor: "color-mix(in srgb, var(--accent) 18%, var(--border-soft))",
            }}
          >
            <div style={{ fontSize: "1.5rem", color: "var(--text-primary)" }}>
              <RenderedLatex latex={card.back} display />
            </div>
            {card.note && (
              <p style={{
                marginTop: "1.25rem", fontSize: "0.82rem", lineHeight: "1.55",
                color: "var(--text-secondary)", maxWidth: "420px",
              }}>
                {card.note}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        gap: "0.75rem",
      }}>
        <button
          onClick={onPrev}
          disabled={index === 0}
          class="metric-pill hover-lift"
          style={{
            cursor: index === 0 ? "default" : "pointer",
            opacity: index === 0 ? 0.4 : 1,
            fontWeight: 700, fontSize: "0.85rem", padding: "0.5rem 1rem",
          }}
        >
          ← Prev
        </button>
        <button
          onClick={onNext}
          class="metric-pill hover-lift"
          style={{
            cursor: "pointer",
            background: "var(--accent-soft)", color: "var(--accent)",
            borderColor: "var(--accent)",
            fontWeight: 700, fontSize: "0.85rem", padding: "0.5rem 1rem",
          }}
        >
          {index < total - 1 ? "Next →" : "Finish →"}
        </button>
      </div>
    </div>
  );
}

// ── Done View ──
function DoneView({
  total,
  onRestart,
  onMenu,
}: {
  total: number;
  onRestart: () => void;
  onMenu: () => void;
}) {
  return (
    <div class="page-reveal">
      <div class="surface-card" style={{
        padding: "2rem", textAlign: "center", marginBottom: "1.5rem",
      }}>
        <p class="display-font score-enter" style={{
          fontSize: "3.5rem", fontWeight: 700, color: "var(--accent)",
          lineHeight: "1.1",
        }}>
          {total}
        </p>
        <p class="score-enter" style={{
          fontSize: "1rem", color: "var(--text-secondary)",
          marginTop: "0.5rem", animationDelay: "80ms",
        }}>
          equation{total !== 1 ? "s" : ""} reviewed
        </p>
        <p class="score-enter" style={{
          fontSize: "0.85rem", color: "var(--text-muted)",
          marginTop: "0.25rem", animationDelay: "160ms",
        }}>
          Keep at it — repetition builds retention.
        </p>
      </div>

      <div style={{
        display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap",
      }}>
        <button
          onClick={onRestart}
          class="metric-pill hover-lift"
          style={{
            cursor: "pointer", background: "var(--accent-soft)",
            color: "var(--accent)", borderColor: "var(--accent)",
            fontWeight: 700, fontSize: "0.85rem", padding: "0.5rem 1rem",
          }}
        >
          Go Again
        </button>
        <button
          onClick={onMenu}
          class="metric-pill hover-lift"
          style={{
            cursor: "pointer", fontWeight: 600,
            fontSize: "0.85rem", padding: "0.5rem 1rem",
          }}
        >
          Back to Topics
        </button>
      </div>
    </div>
  );
}

// ── Main Component ──
export default function EquationFlashcards() {
  const [view, setView] = useState<View>("menu");
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(
    () => new Set(FLASHCARD_TOPICS)
  );
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const filteredCards = useMemo(() => {
    return allFlashcards.filter((f) => selectedTopics.has(f.topic));
  }, [selectedTopics]);

  const toggleTopic = useCallback((topic: string) => {
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => setSelectedTopics(new Set(FLASHCARD_TOPICS)), []);
  const selectNone = useCallback(() => setSelectedTopics(new Set()), []);

  const startDeck = useCallback(() => {
    setDeck(shuffle(filteredCards));
    setCurrentIndex(0);
    setFlipped(false);
    setView("cards");
  }, [filteredCards]);

  const handleFlip = useCallback(() => setFlipped((f) => !f), []);

  const handlePrev = useCallback(() => {
    if (currentIndex <= 0) return;
    setFlipped(false);
    setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex >= deck.length - 1) {
      setView("done");
      return;
    }
    setFlipped(false);
    setCurrentIndex((i) => i + 1);
  }, [currentIndex, deck.length]);

  // Keyboard shortcuts
  useEffect(() => {
    if (view !== "cards") return;

    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (key === " ") { handleFlip(); e.preventDefault(); }
      else if (key === "ArrowRight") { handleNext(); e.preventDefault(); }
      else if (key === "ArrowLeft") { handlePrev(); e.preventDefault(); }
      else if (key === "Escape") { setView("menu"); e.preventDefault(); }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [view, handleFlip, handleNext, handlePrev]);

  const currentCard = deck[currentIndex];

  return (
    <div>
      {view === "menu" && (
        <MenuView
          selectedTopics={selectedTopics}
          toggleTopic={toggleTopic}
          cardCount={filteredCards.length}
          onStart={startDeck}
          selectAll={selectAll}
          selectNone={selectNone}
        />
      )}
      {view === "cards" && currentCard && (
        <CardView
          card={currentCard}
          index={currentIndex}
          total={deck.length}
          flipped={flipped}
          onFlip={handleFlip}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
      {view === "done" && (
        <DoneView
          total={deck.length}
          onRestart={startDeck}
          onMenu={() => setView("menu")}
        />
      )}
    </div>
  );
}
