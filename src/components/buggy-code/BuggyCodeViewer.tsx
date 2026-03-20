import { useState, useMemo, useCallback, useEffect } from "preact/hooks";
import type { ComponentChildren } from "preact";
import type { BuggyProgramHighlighted, StdlibRef } from "../../lib/buggy-code";

type View = "menu" | "list" | "viewer";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const difficultyStyle = (d: BuggyProgramHighlighted["difficulty"]) => {
  switch (d) {
    case "Easy":
      return {
        border: "1px solid color-mix(in srgb, var(--success) 24%, var(--border-soft))",
        background: "color-mix(in srgb, var(--success-soft) 55%, var(--surface-elevated))",
        color: "var(--success)",
      };
    case "Medium":
      return {
        border: "1px solid color-mix(in srgb, var(--warning) 24%, var(--border-soft))",
        background: "color-mix(in srgb, var(--warning-soft) 55%, var(--surface-elevated))",
        color: "var(--warning)",
      };
    case "Hard":
      return {
        border: "1px solid color-mix(in srgb, var(--deep) 24%, var(--border-soft))",
        background: "color-mix(in srgb, var(--deep-soft) 55%, var(--surface-elevated))",
        color: "var(--deep)",
      };
  }
};

// ── Highlighted Code Block ──
function HighlightedCodeBlock({ html }: { html: string }) {
  return (
    <div
      class="buggy-code-block"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ── Generic expandable section ──
function Expandable({
  label,
  icon,
  iconColor,
  accentBorder,
  children,
}: {
  label: string;
  icon: ComponentChildren;
  iconColor: string;
  accentBorder?: string;
  children: ComponentChildren;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderRadius: "0.75rem",
        border: `1px solid var(--border-soft)`,
        background: "var(--surface-elevated)",
        overflow: "hidden",
        ...(accentBorder && open
          ? { borderColor: `color-mix(in srgb, ${accentBorder} 30%, var(--border-soft))` }
          : {}),
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.65rem 1rem",
          cursor: "pointer",
          background: "none",
          border: "none",
          color: "var(--text-primary)",
          fontFamily: "var(--font-display)",
          fontSize: "0.84rem",
          fontWeight: 650,
          letterSpacing: "-0.01em",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: iconColor, flexShrink: 0, display: "flex" }}>{icon}</span>
          <span>{label}</span>
        </div>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          style={{
            color: "var(--text-muted)",
            transition: "transform 0.22s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          class="page-reveal"
          style={{
            padding: "0 1rem 0.75rem 1rem",
            borderTop: "1px solid var(--border-soft)",
          }}
        >
          <div style={{ paddingTop: "0.65rem" }}>{children}</div>
        </div>
      )}
    </div>
  );
}

// ── Hint + Explanation icons ──
const LightbulbIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

const BugIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="m8 2 1.88 1.88" />
    <path d="M14.12 3.88 16 2" />
    <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
    <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
    <path d="M12 20v-9" />
    <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
    <path d="M6 13H2" />
    <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
    <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
    <path d="M22 13h-4" />
    <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
  </svg>
);

const TerminalIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const BookIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

// ── Hints + Explanation block ──
function StdlibRefCards({ refs }: { refs: StdlibRef[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      {refs.map((ref, i) => (
        <div
          key={i}
          style={{
            padding: "0.55rem 0.7rem",
            borderRadius: "0.5rem",
            border: "1px solid var(--border-soft)",
            background: "var(--surface-code)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
            <code
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "var(--accent)",
              }}
            >
              {ref.name}
            </code>
            <a
              href={ref.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.66rem",
                color: "var(--text-muted)",
                textDecoration: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              cppreference →
            </a>
          </div>
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--text-secondary)",
              margin: "0.2rem 0 0 0",
              lineHeight: "1.5",
            }}
          >
            {ref.brief}
          </p>
          {ref.note && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--warning)",
                margin: "0.25rem 0 0 0",
                lineHeight: "1.5",
                paddingLeft: "0.55rem",
                borderLeft: "2px solid color-mix(in srgb, var(--warning) 40%, transparent)",
              }}
            >
              {ref.note}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function HintsAndExplanation({
  hints,
  explanation,
  manifestation,
  stdlibRefs,
}: {
  hints: string[];
  explanation: string;
  manifestation: string;
  stdlibRefs?: StdlibRef[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginTop: "0.75rem" }}>
      {stdlibRefs && stdlibRefs.length > 0 && (
        <Expandable
          label={`Standard Library Reference (${stdlibRefs.length})`}
          icon={BookIcon}
          iconColor="var(--accent)"
          accentBorder="var(--accent)"
        >
          <StdlibRefCards refs={stdlibRefs} />
        </Expandable>
      )}

      {hints.map((hint, i) => (
        <Expandable
          key={i}
          label={`Hint ${i + 1}`}
          icon={LightbulbIcon}
          iconColor="var(--accent)"
        >
          <p
            style={{
              fontSize: "0.84rem",
              lineHeight: "1.6",
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            {hint}
          </p>
        </Expandable>
      ))}

      <Expandable
        label="Explanation"
        icon={BugIcon}
        iconColor="var(--warning)"
        accentBorder="var(--warning)"
      >
        <p
          style={{
            fontSize: "0.84rem",
            lineHeight: "1.65",
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          {explanation}
        </p>
      </Expandable>

      <Expandable
        label="What Actually Happens"
        icon={TerminalIcon}
        iconColor="var(--deep)"
        accentBorder="var(--deep)"
      >
        <pre
          style={{
            fontFamily: "var(--font-code)",
            fontSize: "0.78rem",
            lineHeight: "1.55",
            color: "var(--text-secondary)",
            background: "var(--surface-code)",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            margin: 0,
            whiteSpace: "pre-wrap",
            overflowX: "auto",
          }}
        >
          {manifestation}
        </pre>
      </Expandable>
    </div>
  );
}

// ── Menu View ──
function MenuView({
  topics,
  topicCounts,
  totalPrograms,
  onSelectTopic,
}: {
  topics: string[];
  topicCounts: Map<string, { total: number; easy: number; medium: number; hard: number }>;
  totalPrograms: number;
  onSelectTopic: (topic: string) => void;
}) {
  const [search, setSearch] = useState("");

  const visibleTopics = useMemo(() => {
    if (!search.trim()) return topics;
    const q = search.toLowerCase();
    return topics.filter((t) => t.toLowerCase().includes(q));
  }, [search, topics]);

  return (
    <div class="page-reveal">
      <div class="surface-card" style={{ padding: "1.25rem 1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          <p class="eyebrow" style={{ margin: 0 }}>
            Topics
          </p>
          <span
            style={{
              fontSize: "0.66rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              background: "var(--surface-muted)",
              borderRadius: "4px",
              padding: "0.08rem 0.35rem",
              fontFamily: "var(--font-code)",
            }}
          >
            {topics.length}
          </span>
        </div>

        {topics.length > 5 && (
          <div style={{ position: "relative", marginBottom: "0.65rem" }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              style={{
                position: "absolute",
                left: "0.65rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                pointerEvents: "none",
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Filter topics..."
              value={search}
              onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
              class="quiz-search"
            />
          </div>
        )}

        <div class="quiz-topic-grid">
          {visibleTopics.map((t) => {
            const counts = topicCounts.get(t) || { total: 0, easy: 0, medium: 0, hard: 0 };
            return (
              <button
                key={t}
                onClick={() => onSelectTopic(t)}
                class="quiz-topic-card"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.4rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.84rem",
                      fontWeight: 650,
                      color: "var(--text-primary)",
                      lineHeight: "1.3",
                    }}
                  >
                    {t}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    style={{ color: "var(--text-muted)", flexShrink: 0 }}
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      fontFamily: "var(--font-code)",
                      color: "var(--text-muted)",
                      minWidth: "1.6rem",
                    }}
                  >
                    {counts.total}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "3px",
                      borderRadius: "2px",
                      display: "flex",
                      gap: "1px",
                      overflow: "hidden",
                      opacity: 0.6,
                    }}
                  >
                    {counts.easy > 0 && (
                      <div
                        style={{
                          flex: counts.easy,
                          background: "var(--success)",
                          borderRadius: "2px 0 0 2px",
                        }}
                      />
                    )}
                    {counts.medium > 0 && (
                      <div style={{ flex: counts.medium, background: "var(--warning)" }} />
                    )}
                    {counts.hard > 0 && (
                      <div
                        style={{
                          flex: counts.hard,
                          background: "var(--deep)",
                          borderRadius: "0 2px 2px 0",
                        }}
                      />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {visibleTopics.length === 0 && (
          <p
            style={{
              textAlign: "center",
              padding: "1.5rem 0",
              fontSize: "0.82rem",
              color: "var(--text-muted)",
            }}
          >
            No topics match "{search}"
          </p>
        )}

        <div style={{ marginTop: "0.75rem" }}>
          <button
            onClick={() => onSelectTopic("__all__")}
            class="quiz-start-btn"
            style={{ width: "100%" }}
          >
            All Challenges ({totalPrograms})
          </button>
        </div>
      </div>
    </div>
  );
}

// ── List View ──
function ListView({
  topic,
  programs,
  onSelectProgram,
  onShuffleStart,
  onBack,
}: {
  topic: string;
  programs: BuggyProgramHighlighted[];
  onSelectProgram: (index: number) => void;
  onShuffleStart: () => void;
  onBack: () => void;
}) {
  return (
    <div class="page-reveal">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <button
          onClick={onBack}
          class="metric-pill hover-lift"
          style={{
            cursor: "pointer",
            fontSize: "0.78rem",
            fontWeight: 600,
            padding: "0.32rem 0.6rem",
          }}
        >
          ← Topics
        </button>
        <span
          style={{
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "var(--text-muted)",
          }}
        >
          {programs.length} {programs.length === 1 ? "challenge" : "challenges"}
        </span>
      </div>

      <div class="surface-card" style={{ padding: "1.25rem 1.5rem" }}>
        <h2
          class="display-font"
          style={{
            fontSize: "1.15rem",
            fontWeight: 660,
            color: "var(--text-primary)",
            letterSpacing: "-0.015em",
            margin: "0 0 0.75rem 0",
          }}
        >
          {topic}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {programs.map((p, i) => {
            const dStyle = difficultyStyle(p.difficulty);
            return (
              <button
                key={p.id}
                onClick={() => onSelectProgram(i)}
                class="quiz-topic-card"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "0.65rem",
                }}
              >
                <span
                  style={{
                    ...dStyle,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "0.35rem",
                    padding: "0.1rem 0.4rem",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.03em",
                    flexShrink: 0,
                    minWidth: "3.2rem",
                  }}
                >
                  {p.difficulty}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.84rem",
                      fontWeight: 650,
                      color: "var(--text-primary)",
                      lineHeight: "1.3",
                    }}
                  >
                    {p.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.76rem",
                      color: "var(--text-muted)",
                      lineHeight: "1.4",
                      marginTop: "0.1rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.description}
                  </div>
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  style={{ color: "var(--text-muted)", flexShrink: 0 }}
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <button
            onClick={onShuffleStart}
            class="quiz-start-btn"
            style={{ width: "100%" }}
          >
            Shuffle & Start
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Viewer View ──
function ViewerView({
  programs,
  startIndex = 0,
  backLabel = "← Topics",
  onBack,
}: {
  programs: BuggyProgramHighlighted[];
  startIndex?: number;
  backLabel?: string;
  onBack: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [animClass, setAnimClass] = useState("card-enter");

  const program = programs[currentIndex];
  const dStyle = difficultyStyle(program.difficulty);

  const goTo = useCallback(
    (next: number) => {
      if (next === currentIndex) return;
      setAnimClass("card-exit");
      setTimeout(() => {
        setCurrentIndex(next);
        setAnimClass("card-enter");
      }, 200);
    },
    [currentIndex]
  );

  const goPrev = useCallback(() => {
    if (currentIndex > 0) goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  const goNext = useCallback(() => {
    if (currentIndex < programs.length - 1) goTo(currentIndex + 1);
  }, [currentIndex, programs.length, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goPrev();
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        goNext();
        e.preventDefault();
      } else if (e.key === "Escape") {
        onBack();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goPrev, goNext, onBack]);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <button
          onClick={onBack}
          class="metric-pill hover-lift"
          style={{
            cursor: "pointer",
            fontSize: "0.78rem",
            fontWeight: 600,
            padding: "0.32rem 0.6rem",
          }}
        >
          {backLabel}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "var(--text-muted)",
            }}
          >
            {currentIndex + 1} / {programs.length}
          </span>
          <span
            style={{
              ...dStyle,
              display: "inline-flex",
              alignItems: "center",
              borderRadius: "0.4rem",
              padding: "0.15rem 0.45rem",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.03em",
            }}
          >
            {program.difficulty}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: "4px",
          borderRadius: "2px",
          background: "var(--surface-muted)",
          marginBottom: "1rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${((currentIndex + 1) / programs.length) * 100}%`,
            background: "var(--accent)",
            borderRadius: "2px",
            transition: "width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        />
      </div>

      {/* Program Card */}
      <div key={program.id} class={animClass}>
        <div
          class="surface-card"
          style={{ padding: "1.25rem 1.5rem", marginBottom: "0.75rem" }}
        >
          <p class="eyebrow" style={{ marginBottom: "0.2rem" }}>
            {program.topic}
          </p>
          <h2
            class="display-font"
            style={{
              fontSize: "1.15rem",
              fontWeight: 660,
              color: "var(--text-primary)",
              letterSpacing: "-0.015em",
              lineHeight: "1.35",
              margin: 0,
            }}
          >
            {program.title}
          </h2>
          <p
            style={{
              fontSize: "0.86rem",
              color: "var(--text-secondary)",
              marginTop: "0.35rem",
              lineHeight: "1.55",
            }}
          >
            {program.description}
          </p>
        </div>

        <HighlightedCodeBlock html={program.highlightedHtml} />

        <HintsAndExplanation hints={program.hints} explanation={program.explanation} manifestation={program.manifestation} stdlibRefs={program.stdlibRefs} />
      </div>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "0.75rem",
          gap: "0.5rem",
        }}
      >
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          class="metric-pill hover-lift"
          style={{
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: "0.82rem",
            padding: "0.45rem 0.85rem",
            opacity: currentIndex === 0 ? 0.4 : 1,
          }}
        >
          ← Prev
        </button>
        <button
          onClick={goNext}
          disabled={currentIndex === programs.length - 1}
          class="metric-pill hover-lift"
          style={{
            cursor: currentIndex === programs.length - 1 ? "not-allowed" : "pointer",
            background: "var(--accent-soft)",
            color: "var(--accent)",
            borderColor: "var(--accent)",
            fontWeight: 700,
            fontSize: "0.82rem",
            padding: "0.45rem 0.85rem",
            opacity: currentIndex === programs.length - 1 ? 0.4 : 1,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// ── Main Component ──
export default function BuggyCodeViewer({
  programs,
}: {
  programs: BuggyProgramHighlighted[];
}) {
  const [view, setView] = useState<View>("menu");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [listPrograms, setListPrograms] = useState<BuggyProgramHighlighted[]>([]);
  const [viewerPrograms, setViewerPrograms] = useState<BuggyProgramHighlighted[]>([]);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);

  // Derive topics and counts from props
  const { topics, topicCounts } = useMemo(() => {
    const counts = new Map<string, { total: number; easy: number; medium: number; hard: number }>();
    for (const p of programs) {
      const entry = counts.get(p.topic) || { total: 0, easy: 0, medium: 0, hard: 0 };
      entry.total++;
      if (p.difficulty === "Easy") entry.easy++;
      else if (p.difficulty === "Medium") entry.medium++;
      else entry.hard++;
      counts.set(p.topic, entry);
    }
    return { topics: [...counts.keys()].sort(), topicCounts: counts };
  }, [programs]);

  const handleSelectTopic = useCallback(
    (topic: string) => {
      if (topic === "__all__") {
        setViewerPrograms(shuffle(programs));
        setViewerStartIndex(0);
        setSelectedTopic("");
        setView("viewer");
        return;
      }
      const filtered = programs.filter((p) => p.topic === topic);
      if (filtered.length === 0) return;
      setSelectedTopic(topic);
      setListPrograms(filtered);
      setView("list");
    },
    [programs]
  );

  const handleSelectProgram = useCallback(
    (index: number) => {
      setViewerPrograms(listPrograms);
      setViewerStartIndex(index);
      setView("viewer");
    },
    [listPrograms]
  );

  const handleShuffleStart = useCallback(() => {
    setViewerPrograms(shuffle(listPrograms));
    setViewerStartIndex(0);
    setView("viewer");
  }, [listPrograms]);

  return (
    <div>
      {view === "menu" && (
        <MenuView
          topics={topics}
          topicCounts={topicCounts}
          totalPrograms={programs.length}
          onSelectTopic={handleSelectTopic}
        />
      )}
      {view === "list" && (
        <ListView
          topic={selectedTopic}
          programs={listPrograms}
          onSelectProgram={handleSelectProgram}
          onShuffleStart={handleShuffleStart}
          onBack={() => setView("menu")}
        />
      )}
      {view === "viewer" && (
        <ViewerView
          programs={viewerPrograms}
          startIndex={viewerStartIndex}
          backLabel={selectedTopic ? `← ${selectedTopic}` : "← Topics"}
          onBack={() => setView(selectedTopic ? "list" : "menu")}
        />
      )}
    </div>
  );
}
