import { useState, useEffect, useCallback, useMemo } from "preact/hooks";
import type { Question, Topic } from "../../lib/questions";
import { questions as allQuestions, TOPICS } from "../../lib/questions";

type View = "menu" | "quiz" | "results";
type Difficulty = "All" | "Easy" | "Medium" | "Hard";

interface AnswerRecord {
  questionId: number;
  selected: number;
  correct: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LETTERS = ["A", "B", "C", "D"] as const;

const difficultyStyle = (d: Question["difficulty"]) => {
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

function optionStyle(
  idx: number,
  selected: number | null,
  revealed: boolean,
  correctIndex: number
): Record<string, string> {
  const base: Record<string, string> = {
    background: "var(--surface-elevated)",
    border: "1px solid var(--border-soft)",
    color: "var(--text-primary)",
    cursor: revealed ? "default" : "pointer",
    transition: "all 0.22s ease",
  };

  if (!revealed) {
    return base;
  }

  if (idx === correctIndex) {
    return {
      ...base,
      border: "1.5px solid var(--success)",
      background: "color-mix(in srgb, var(--success-soft) 70%, var(--surface-elevated))",
      color: "var(--success)",
      cursor: "default",
    };
  }

  if (idx === selected && idx !== correctIndex) {
    return {
      ...base,
      border: "1.5px solid var(--warning)",
      background: "color-mix(in srgb, var(--warning-soft) 70%, var(--surface-elevated))",
      color: "var(--warning)",
      cursor: "default",
    };
  }

  return { ...base, opacity: "0.5", cursor: "default" };
}

// ── Menu View ──
function MenuView({
  selectedTopics,
  toggleTopic,
  difficulty,
  setDifficulty,
  filteredCount,
  onStart,
  selectAll,
  selectNone,
}: {
  selectedTopics: Set<string>;
  toggleTopic: (t: string) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  filteredCount: number;
  onStart: () => void;
  selectAll: () => void;
  selectNone: () => void;
}) {
  const difficulties: Difficulty[] = ["All", "Easy", "Medium", "Hard"];

  return (
    <div class="page-reveal">
      <div
        class="surface-card p-5 sm:p-6"
        style={{ marginBottom: "1.5rem" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <p class="eyebrow">Topics</p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={selectAll}
              class="chip"
              style={{ cursor: "pointer", fontSize: "0.68rem" }}
            >
              All
            </button>
            <button
              onClick={selectNone}
              class="chip"
              style={{ cursor: "pointer", fontSize: "0.68rem" }}
            >
              None
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {TOPICS.map((t) => {
            const active = selectedTopics.has(t);
            return (
              <button
                key={t}
                onClick={() => toggleTopic(t)}
                class="chip"
                style={{
                  cursor: "pointer",
                  background: active
                    ? "var(--accent-soft)"
                    : "color-mix(in srgb, var(--surface-elevated) 78%, var(--surface-muted))",
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                  borderColor: active ? "var(--accent)" : "var(--border-soft)",
                  fontWeight: active ? "700" : "600",
                  transition: "all 0.18s ease",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div
        class="surface-card p-5 sm:p-6"
        style={{ marginBottom: "1.5rem" }}
      >
        <p class="eyebrow" style={{ marginBottom: "0.75rem" }}>
          Difficulty
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              class="metric-pill"
              style={{
                cursor: "pointer",
                background:
                  d === difficulty
                    ? "var(--accent-soft)"
                    : "color-mix(in srgb, var(--surface-elevated) 82%, var(--surface-muted))",
                color:
                  d === difficulty ? "var(--accent)" : "var(--text-secondary)",
                borderColor:
                  d === difficulty ? "var(--accent)" : "var(--border-soft)",
                fontWeight: d === difficulty ? "700" : "400",
                transition: "all 0.18s ease",
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <p
          class="display-font"
          style={{
            fontSize: "0.9rem",
            fontWeight: "600",
            color: "var(--text-secondary)",
          }}
        >
          {filteredCount} question{filteredCount !== 1 ? "s" : ""} selected
        </p>
        <button
          onClick={onStart}
          disabled={filteredCount === 0}
          class="metric-pill hover-lift"
          style={{
            cursor: filteredCount === 0 ? "not-allowed" : "pointer",
            background:
              filteredCount === 0
                ? "var(--surface-muted)"
                : "var(--accent-soft)",
            color: filteredCount === 0 ? "var(--text-muted)" : "var(--accent)",
            borderColor:
              filteredCount === 0 ? "var(--border-soft)" : "var(--accent)",
            fontWeight: "700",
            fontSize: "0.85rem",
            padding: "0.5rem 1rem",
          }}
        >
          Start Quiz →
        </button>
      </div>
    </div>
  );
}

// ── Quiz View ──
function QuizView({
  question,
  index,
  total,
  selected,
  revealed,
  onSelect,
  onNext,
  animClass,
  score,
}: {
  question: Question;
  index: number;
  total: number;
  selected: number | null;
  revealed: boolean;
  onSelect: (idx: number) => void;
  onNext: () => void;
  animClass: string;
  score: { correct: number; wrong: number };
}) {
  const progress = ((index + 1) / total) * 100;
  const dStyle = difficultyStyle(question.difficulty);

  return (
    <div>
      {/* Progress bar */}
      <div
        style={{
          height: "4px",
          borderRadius: "2px",
          background: "var(--surface-muted)",
          marginBottom: "0.75rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "var(--accent)",
            borderRadius: "2px",
            transition: "width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        />
      </div>

      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: "600",
              color: "var(--text-muted)",
            }}
          >
            {index + 1} / {total}
          </span>
          <span
            style={{
              ...dStyle,
              display: "inline-flex",
              alignItems: "center",
              borderRadius: "0.4rem",
              padding: "0.15rem 0.45rem",
              fontSize: "0.68rem",
              fontWeight: "700",
              letterSpacing: "0.03em",
            }}
          >
            {question.difficulty}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.78rem", fontWeight: "600" }}>
          <span style={{ color: "var(--success)" }}>{score.correct} correct</span>
          <span style={{ color: "var(--warning)" }}>{score.wrong} wrong</span>
        </div>
      </div>

      {/* Card */}
      <div
        key={question.id}
        class={`surface-card ${animClass}`}
        style={{ padding: "1.25rem 1.5rem", marginBottom: "1rem" }}
      >
        <p class="eyebrow" style={{ marginBottom: "0.35rem" }}>
          {question.topic}
        </p>
        <p
          class="display-font"
          style={{
            fontSize: "1.05rem",
            fontWeight: "600",
            lineHeight: "1.5",
            color: "var(--text-primary)",
            marginBottom: question.code ? "0.75rem" : "0",
          }}
        >
          {question.question}
        </p>

        {question.code && (
          <pre
            style={{
              background: "var(--surface-code)",
              color: "var(--text-inverse)",
              padding: "0.85rem 1rem",
              borderRadius: "0.65rem",
              fontSize: "0.82rem",
              lineHeight: "1.6",
              overflowX: "auto",
              fontFamily: "var(--font-code)",
              marginBottom: "0",
              whiteSpace: "pre",
            }}
          >
            {question.code}
          </pre>
        )}
      </div>

      {/* Options */}
      <div
        style={{
          display: "grid",
          gap: "0.55rem",
          marginBottom: "1rem",
        }}
      >
        {question.options.map((opt, i) => {
          const isCorrect = revealed && i === question.correctIndex;
          const isWrong = revealed && i === selected && i !== question.correctIndex;

          return (
            <button
              key={i}
              onClick={() => !revealed && onSelect(i)}
              class={isCorrect || isWrong ? "answer-pop" : ""}
              style={{
                ...optionStyle(i, selected, revealed, question.correctIndex),
                display: "flex",
                alignItems: "flex-start",
                gap: "0.6rem",
                padding: "0.7rem 0.85rem",
                borderRadius: "0.65rem",
                textAlign: "left",
                fontSize: "0.88rem",
                lineHeight: "1.5",
                fontWeight: "500",
              }}
            >
              <span
                class="display-font"
                style={{
                  flexShrink: "0",
                  width: "1.5rem",
                  height: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "0.35rem",
                  fontSize: "0.76rem",
                  fontWeight: "700",
                  background: revealed
                    ? i === question.correctIndex
                      ? "var(--success)"
                      : i === selected
                        ? "var(--warning)"
                        : "var(--surface-muted)"
                    : i === selected
                      ? "var(--accent)"
                      : "var(--surface-muted)",
                  color: revealed
                    ? i === question.correctIndex || i === selected
                      ? "white"
                      : "var(--text-muted)"
                    : i === selected
                      ? "white"
                      : "var(--text-muted)",
                  transition: "all 0.22s ease",
                }}
              >
                {LETTERS[i]}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div
          class="page-reveal"
          style={{
            padding: "0.85rem 1rem",
            borderRadius: "0.65rem",
            borderLeft: `3px solid ${selected === question.correctIndex ? "var(--success)" : "var(--warning)"}`,
            background:
              selected === question.correctIndex
                ? "color-mix(in srgb, var(--success-soft) 60%, var(--surface-elevated))"
                : "color-mix(in srgb, var(--warning-soft) 60%, var(--surface-elevated))",
            marginBottom: "1rem",
            fontSize: "0.88rem",
            lineHeight: "1.6",
            color: "var(--text-secondary)",
          }}
        >
          <p
            class="display-font"
            style={{
              fontWeight: "700",
              fontSize: "0.8rem",
              marginBottom: "0.3rem",
              color: selected === question.correctIndex ? "var(--success)" : "var(--warning)",
            }}
          >
            {selected === question.correctIndex ? "Correct!" : "Incorrect"}
          </p>
          <p>{question.explanation}</p>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {!revealed && selected !== null && (
          <button
            onClick={() => onSelect(selected!)}
            class="metric-pill hover-lift page-reveal"
            style={{
              cursor: "pointer",
              background: "var(--accent-soft)",
              color: "var(--accent)",
              borderColor: "var(--accent)",
              fontWeight: "700",
              fontSize: "0.85rem",
              padding: "0.5rem 1rem",
            }}
          >
            Submit
          </button>
        )}
        {revealed && (
          <button
            onClick={onNext}
            class="metric-pill hover-lift page-reveal"
            style={{
              cursor: "pointer",
              background: "var(--accent-soft)",
              color: "var(--accent)",
              borderColor: "var(--accent)",
              fontWeight: "700",
              fontSize: "0.85rem",
              padding: "0.5rem 1rem",
            }}
          >
            {index < total - 1 ? "Next →" : "See Results →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Results View ──
function ResultsView({
  answers,
  questions,
  onRetry,
  onMenu,
}: {
  answers: AnswerRecord[];
  questions: Question[];
  onRetry: () => void;
  onMenu: () => void;
}) {
  const correct = answers.filter((a) => a.selected === a.correct).length;
  const total = answers.length;
  const pct = Math.round((correct / total) * 100);

  const scoreColor =
    pct >= 80
      ? "var(--success)"
      : pct >= 50
        ? "var(--warning)"
        : "var(--deep)";

  // Per-topic breakdown
  const byTopic = new Map<string, { correct: number; total: number }>();
  for (const a of answers) {
    const q = questions.find((q) => q.id === a.questionId)!;
    const entry = byTopic.get(q.topic) || { correct: 0, total: 0 };
    entry.total++;
    if (a.selected === a.correct) entry.correct++;
    byTopic.set(q.topic, entry);
  }

  return (
    <div class="page-reveal">
      <div
        class="surface-card"
        style={{
          padding: "2rem",
          textAlign: "center",
          marginBottom: "1.5rem",
        }}
      >
        <p
          class="display-font score-enter"
          style={{
            fontSize: "3.5rem",
            fontWeight: "700",
            color: scoreColor,
            lineHeight: "1.1",
          }}
        >
          {pct}%
        </p>
        <p
          class="score-enter"
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary)",
            marginTop: "0.5rem",
            animationDelay: "80ms",
          }}
        >
          {correct} of {total} correct
        </p>
        <p
          class="score-enter"
          style={{
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            marginTop: "0.25rem",
            animationDelay: "160ms",
          }}
        >
          {pct >= 80
            ? "Excellent work!"
            : pct >= 50
              ? "Good effort — review the topics below."
              : "Keep practicing — you'll get there."}
        </p>
      </div>

      {/* Topic breakdown */}
      <div
        class="surface-card-soft"
        style={{ padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}
      >
        <p
          class="eyebrow"
          style={{ marginBottom: "0.75rem" }}
        >
          Breakdown by topic
        </p>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {[...byTopic.entries()].map(([topic, { correct: c, total: t }]) => {
            const topicPct = Math.round((c / t) * 100);
            return (
              <div key={topic}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.82rem",
                    marginBottom: "0.2rem",
                  }}
                >
                  <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                    {topic}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {c}/{t}
                  </span>
                </div>
                <div
                  style={{
                    height: "5px",
                    borderRadius: "3px",
                    background: "var(--surface-muted)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${topicPct}%`,
                      borderRadius: "3px",
                      background:
                        topicPct >= 80
                          ? "var(--success)"
                          : topicPct >= 50
                            ? "var(--warning)"
                            : "var(--deep)",
                      transition: "width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={onRetry}
          class="metric-pill hover-lift"
          style={{
            cursor: "pointer",
            background: "var(--accent-soft)",
            color: "var(--accent)",
            borderColor: "var(--accent)",
            fontWeight: "700",
            fontSize: "0.85rem",
            padding: "0.5rem 1rem",
          }}
        >
          Try Again
        </button>
        <button
          onClick={onMenu}
          class="metric-pill hover-lift"
          style={{
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.85rem",
            padding: "0.5rem 1rem",
          }}
        >
          Back to Topics
        </button>
      </div>
    </div>
  );
}

// ── Main Component ──
export default function FlashcardQuiz() {
  const [view, setView] = useState<View>("menu");
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(
    () => new Set(TOPICS)
  );
  const [difficulty, setDifficulty] = useState<Difficulty>("All");
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [animClass, setAnimClass] = useState("card-enter");

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(
      (q) =>
        selectedTopics.has(q.topic) &&
        (difficulty === "All" || q.difficulty === difficulty)
    );
  }, [selectedTopics, difficulty]);

  const toggleTopic = useCallback((topic: string) => {
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedTopics(new Set(TOPICS));
  }, []);

  const selectNone = useCallback(() => {
    setSelectedTopics(new Set());
  }, []);

  const startQuiz = useCallback(() => {
    const shuffled = shuffle(filteredQuestions);
    setQuizQuestions(shuffled);
    setCurrentIndex(0);
    setSelected(null);
    setRevealed(false);
    setAnswers([]);
    setAnimClass("card-enter");
    setView("quiz");
  }, [filteredQuestions]);

  const handleSelect = useCallback(
    (idx: number) => {
      if (revealed) return;

      if (selected === idx) {
        // Double-click on same option = submit
        setRevealed(true);
        const q = quizQuestions[currentIndex];
        setAnswers((prev) => [
          ...prev,
          { questionId: q.id, selected: idx, correct: q.correctIndex },
        ]);
        return;
      }

      setSelected(idx);
    },
    [revealed, selected, quizQuestions, currentIndex]
  );

  const submitAnswer = useCallback(() => {
    if (selected === null || revealed) return;
    setRevealed(true);
    const q = quizQuestions[currentIndex];
    setAnswers((prev) => [
      ...prev,
      { questionId: q.id, selected: selected, correct: q.correctIndex },
    ]);
  }, [selected, revealed, quizQuestions, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex >= quizQuestions.length - 1) {
      setView("results");
      return;
    }
    setAnimClass("card-exit");
    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
      setAnimClass("card-enter");
    }, 200);
  }, [currentIndex, quizQuestions.length]);

  // Keyboard shortcuts
  useEffect(() => {
    if (view !== "quiz") return;

    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (!revealed) {
        if (key === "1" || key === "a") { setSelected(0); e.preventDefault(); }
        else if (key === "2" || key === "b") { setSelected(1); e.preventDefault(); }
        else if (key === "3" || key === "c") { setSelected(2); e.preventDefault(); }
        else if (key === "4" || key === "d") { setSelected(3); e.preventDefault(); }
        else if ((key === "enter" || key === " ") && selected !== null) {
          submitAnswer();
          e.preventDefault();
        }
      } else {
        if (key === "enter" || key === " " || key === "arrowright") {
          handleNext();
          e.preventDefault();
        }
      }

      if (key === "escape") {
        setView("menu");
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [view, revealed, selected, submitAnswer, handleNext]);

  const currentQuestion = quizQuestions[currentIndex];
  const score = {
    correct: answers.filter((a) => a.selected === a.correct).length,
    wrong: answers.filter((a) => a.selected !== a.correct).length,
  };

  return (
    <div>
      {view === "menu" && (
        <MenuView
          selectedTopics={selectedTopics}
          toggleTopic={toggleTopic}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          filteredCount={filteredQuestions.length}
          onStart={startQuiz}
          selectAll={selectAll}
          selectNone={selectNone}
        />
      )}

      {view === "quiz" && currentQuestion && (
        <QuizView
          question={currentQuestion}
          index={currentIndex}
          total={quizQuestions.length}
          selected={selected}
          revealed={revealed}
          onSelect={(idx) => {
            if (!revealed) {
              if (selected === idx) {
                submitAnswer();
              } else {
                setSelected(idx);
              }
            }
          }}
          onNext={handleNext}
          animClass={animClass}
          score={score}
        />
      )}

      {view === "results" && (
        <ResultsView
          answers={answers}
          questions={quizQuestions}
          onRetry={startQuiz}
          onMenu={() => setView("menu")}
        />
      )}
    </div>
  );
}
