"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnswerBlockRenderer, AssemblingState, DiscoveryRail } from "@/components/knowledge-blocks";
import {
  questionCategories,
  resolveQuestion,
  starterQuestions,
  type QuestionCategory,
  type QuestionNode,
} from "@/data/portfolio-response";

type ComposerState = "idle" | "loading" | "disabled";
type TreeNode = QuestionNode & {
  instanceId: string;
  state: "current" | "answered";
};

const AUTO_COLLAPSE_MS = 10000;

export function ConversationWorkspace() {
  const [prompt, setPrompt] = useState("");
  const [activeQuestion, setActiveQuestion] = useState<QuestionNode | null>(null);
  const [history, setHistory] = useState<TreeNode[]>([]);
  const [isTreeOpen, setIsTreeOpen] = useState(false);
  const [composerState, setComposerState] = useState<ComposerState>("idle");
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerTopRef = useRef<HTMLDivElement | null>(null);
  const hasConversation = activeQuestion !== null;
  const isAssembling = composerState === "loading" && activeQuestion === null;
  const isPresentingAnswer = composerState === "disabled" && activeQuestion !== null;

  const groupedHistory = useMemo(() => {
    return questionCategories.map((category) => ({
      category,
      nodes: history.filter((node) => node.category === category),
    }));
  }, [history]);

  useEffect(() => {
    if (!isTreeOpen || history.length === 0) return;
    if (collapseTimer.current) clearTimeout(collapseTimer.current);

    collapseTimer.current = setTimeout(() => {
      setIsTreeOpen(false);
    }, AUTO_COLLAPSE_MS);

    return () => {
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
    };
  }, [isTreeOpen, history.length, activeQuestion?.id]);

  useEffect(() => {
    if (!isAssembling || !answerTopRef.current) return;

    answerTopRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [isAssembling]);

  function activateQuestion(questionText: string) {
    const trimmed = questionText.trim();
    if (!trimmed || composerState === "loading") return;

    const activeElement = document.activeElement as HTMLElement | null;
    activeElement?.blur();

    const resolved = resolveQuestion(trimmed);
    setPrompt("");
    setIsTreeOpen(true);
    setComposerState("loading");
    setActiveQuestion(null);

    window.setTimeout(() => {
      setActiveQuestion(resolved);
      setHistory((current) => {
        const answered = current.map((node) => ({ ...node, state: "answered" as const }));
        return [
          ...answered,
          {
            ...resolved,
            question: trimmed,
            instanceId: `${resolved.id}-${Date.now()}`,
            state: "current",
          },
        ];
      });
      setComposerState("disabled");
    }, 720);
  }

  function handlePresentationComplete() {
    if (!answerTopRef.current) {
      setComposerState("idle");
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        answerTopRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setComposerState("idle");
      });
    });
  }

  function submitPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    activateQuestion(prompt);
  }

  return (
    <main className="min-h-screen bg-white pb-32 text-ink">
      <FloatingQuestionTree
        groupedHistory={groupedHistory}
        hasConversation={hasConversation || history.length > 0}
        isOpen={isTreeOpen}
        onSelectQuestion={activateQuestion}
        onToggle={() => setIsTreeOpen((current) => !current)}
      />

      <section className="main-content min-h-screen min-w-0 px-5 pt-6 md:px-8 lg:px-10">
        {(isAssembling || hasConversation) ? <div ref={answerTopRef} className="answer-top-anchor" /> : null}
        <AnimatePresence mode="wait">
          {!hasConversation && !isAssembling ? (
            <OpeningWorkspace key="opening" onSelectQuestion={activateQuestion} />
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isAssembling ? <AssemblingState key="assembling" question={prompt || "selected path"} /> : null}
        </AnimatePresence>

        {hasConversation && !isAssembling ? (
          <AnswerWorkspace
            key={activeQuestion.id}
            isPresenting={isPresentingAnswer}
            question={activeQuestion}
            onPresentationComplete={handlePresentationComplete}
            onSelectQuestion={activateQuestion}
          />
        ) : null}
      </section>

      <PromptComposer
        value={prompt}
        state={composerState}
        hasConversation={hasConversation || history.length > 0}
        onChange={setPrompt}
        onSubmit={submitPrompt}
        onSelectQuestion={activateQuestion}
      />
    </main>
  );
}

function OpeningWorkspace({ onSelectQuestion }: { onSelectQuestion: (question: string) => void }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-6xl flex-col justify-center pb-24 pt-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-300"
      >
        Blank Workspace
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.64, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
        className="max-w-6xl whitespace-pre-line text-4xl font-semibold uppercase leading-[1.22] tracking-[-0.01em] text-black md:text-6xl"
      >
        <TypedWordGroup words={["Design", "is"]} delay={0.42} />
        <UnderlinePhrase
          words={["not", "presentation."]}
          delay={0.9}
          underlineClassName="bg-[#ff1744]"
        />
        <br />
        <TypedWordGroup words={["Design", "is", "the", "starting", "point", "for"]} delay={1.2} />
        <UnderlinePhrase
          words={["finding", "the", "right", "solution."]}
          delay={1.85}
          underlineClassName="bg-[#39ff14]"
        />
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.05 }}
        className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600"
      >
        Ask a question to explore how I think, decide, design, and ship.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1], delay: 1.45 }}
        className="mt-12"
      >
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">Starter paths</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {starterQuestions.map((starter, index) => (
            <motion.button
              key={starter.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1], delay: 1.62 + index * 0.08 }}
              onClick={() => onSelectQuestion(starter.question)}
              className="flex min-h-[150px] flex-col items-start justify-start rounded-[24px] bg-zinc-100 p-4 text-left transition hover:-translate-y-0.5 hover:bg-zinc-200/70 focus:outline-none focus:ring-2 focus:ring-black"
              type="button"
              data-state="related"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">{starter.category}</div>
              <h2 className="mt-4 text-base font-semibold leading-6 text-black">{starter.question}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{starter.intent}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function TypedWordGroup({ words, delay }: { words: string[]; delay: number }) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-[0.18em] gap-y-0">
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 0.35, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
            delay: delay + index * 0.14,
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

function UnderlinePhrase({
  words,
  delay,
  underlineClassName,
}: {
  words: string[];
  delay: number;
  underlineClassName: string;
}) {
  return (
    <span className="relative ml-[0.18em] inline-flex flex-wrap items-baseline gap-x-[0.18em] gap-y-0">
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 0.35, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
            delay: delay + index * 0.14,
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{
          duration: 0.38,
          ease: [0.22, 1, 0.36, 1],
          delay: delay + words.length * 0.14 + 0.1,
        }}
        className={`absolute inset-x-0 -bottom-[0.02em] h-[0.08em] origin-left ${underlineClassName}`}
      />
    </span>
  );
}

function AnswerWorkspace({
  isPresenting,
  onPresentationComplete,
  question,
  onSelectQuestion,
}: {
  isPresenting: boolean;
  onPresentationComplete: () => void;
  question: QuestionNode;
  onSelectQuestion: (question: string) => void;
}) {
  const answerBlocks = useMemo(
    () => question.answerBlocks.filter((block) => block.type !== "perspectiveLens"),
    [question.answerBlocks],
  );
  const [visibleBlockCount, setVisibleBlockCount] = useState(0);
  const blockRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (!isPresenting) {
      setVisibleBlockCount(answerBlocks.length);
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }

    setVisibleBlockCount(0);

    const durations = answerBlocks.map((block) => estimateBlockDuration(block));

    function revealBlock(index: number) {
      if (cancelled) return;

      setVisibleBlockCount(index + 1);

      if (index === answerBlocks.length - 1) {
        timeoutId = setTimeout(() => {
          if (!cancelled) onPresentationComplete();
        }, durations[index]);
        return;
      }

      timeoutId = setTimeout(() => {
        revealBlock(index + 1);
      }, durations[index]);
    }

    timeoutId = setTimeout(() => {
      revealBlock(0);
    }, 260);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [answerBlocks, isPresenting, onPresentationComplete]);

  useEffect(() => {
    if (!isPresenting || visibleBlockCount === 0) return;

    const currentBlock = blockRefs.current[visibleBlockCount - 1];
    if (!currentBlock) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        currentBlock.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  }, [isPresenting, visibleBlockCount]);

  return (
    <div className="mx-auto max-w-5xl pb-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        className="flex justify-end"
      >
        <div className="relative mr-1 rounded-[3px] bg-black px-5 py-4 text-sm text-white md:mr-5 md:min-w-[300px]">
          {question.question}
          <div className="absolute bottom-[-9px] right-0 h-0 w-0 border-l-[14px] border-t-[14px] border-l-transparent border-t-black" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
        className="mt-12 max-w-2xl"
      >
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">{question.category} / Intent</div>
        <h1 className="mt-3 text-2xl font-semibold text-black md:text-3xl">{question.answerTitle}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">{question.intent}</p>
      </motion.div>

      <div className="mt-10 space-y-10">
        {answerBlocks.slice(0, visibleBlockCount).map((block, index) => (
          <div
            key={block.id}
            ref={(node) => {
              blockRefs.current[index] = node;
            }}
            className="max-w-4xl"
          >
            <AnswerBlockRenderer block={block} delay={0.18} onQuestionSelect={onSelectQuestion} />
          </div>
        ))}
      </div>

      {!isPresenting && visibleBlockCount >= answerBlocks.length ? (
        <DiscoveryRail cards={question.relatedCards} onSelect={onSelectQuestion} />
      ) : null}
    </div>
  );
}

function PromptComposer({
  value,
  state,
  hasConversation,
  onChange,
  onSubmit,
  onSelectQuestion,
}: {
  value: string;
  state: ComposerState;
  hasConversation: boolean;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSelectQuestion: (question: string) => void;
}) {
  const disabled = state !== "idle";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: hasConversation ? 0 : 1.9 }}
      className="fixed inset-x-0 bottom-0 z-20 px-4 pb-4"
    >
      {!hasConversation ? (
        <div className="mx-auto mb-3 hidden max-w-3xl gap-2 md:flex">
          {starterQuestions.slice(0, 3).map((starter) => (
            <button
              key={starter.id}
              onClick={() => onSelectQuestion(starter.question)}
              className="rounded-full border border-white/80 bg-white/75 px-3 py-1.5 text-xs text-zinc-600 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl transition hover:bg-white hover:text-black"
              type="button"
              data-state="related"
            >
              {starter.question}
            </button>
          ))}
        </div>
      ) : null}
      <form
        onSubmit={onSubmit}
        className="mx-auto flex h-14 max-w-3xl items-center gap-2 rounded-full border border-white/80 bg-white/80 pl-5 pr-2 shadow-[0_12px_45px_rgba(0,0,0,0.08)] backdrop-blur-xl md:h-16"
      >
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ask anything about my work..."
          className="h-full min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:text-zinc-400"
          aria-label="Ask anything about my work"
          disabled={disabled}
        />
        <button
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-zinc-300 md:size-11"
          type="submit"
          aria-label="Send"
          disabled={disabled || value.trim().length === 0}
          data-state={disabled ? "disabled" : "default"}
        >
          <span aria-hidden="true">→</span>
        </button>
      </form>
    </motion.div>
  );
}

function estimateBlockDuration(block: QuestionNode["answerBlocks"][number]) {
  const base = 540;
  const perChar = 14;
  const minimum = 850;
  const maximum = 2600;

  const text =
    block.type === "summary"
      ? `${block.title} ${block.body} ${(block.signals ?? []).join(" ")}`
      : block.type === "perspectiveLens"
        ? `${block.title} ${block.lenses.map((lens) => `${lens.audience} ${lens.takeaway}`).join(" ")}`
        : block.type === "designReasoning"
          ? `${block.title} ${block.steps.join(" ")}`
          : block.type === "evidence"
            ? `${block.title} ${block.items.map((item) => `${item.title} ${item.detail}`).join(" ")}`
            : block.type === "relatedWork"
              ? `${block.title} ${block.cases.map((item) => `${item.title} ${item.summary} ${item.outcome}`).join(" ")}`
              : block.type === "decisionLog"
                ? `${block.log.title} ${block.log.decisionSummary} ${block.log.whyItMatters}`
                : block.type === "careerEvolution"
                  ? `${block.introLines.join(" ")} ${block.primaryTrack
                      .concat(block.creativeTrack)
                      .flatMap((entry) => entry.entries.map((sub) => sub.narrative))
                      .join(" ")} ${block.mergeHeadline} ${block.aiHeadline} ${block.endingHeadline}`
                  : `${block.title} ${block.questions.join(" ")}`;

  return Math.min(maximum, Math.max(minimum, base + text.length * perChar));
}

function FloatingQuestionTree({
  groupedHistory,
  hasConversation,
  isOpen,
  onSelectQuestion,
  onToggle,
}: {
  groupedHistory: { category: QuestionCategory; nodes: TreeNode[] }[];
  hasConversation: boolean;
  isOpen: boolean;
  onSelectQuestion: (question: string) => void;
  onToggle: () => void;
}) {
  if (!hasConversation) return null;

  return (
    <div className="fixed left-4 top-4 z-30 md:left-7 md:top-7">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.aside
            key="question-tree-panel"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[calc(100vh-32px)] w-[min(340px,calc(100vw-32px))] overflow-y-auto rounded-[26px] bg-white/78 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-black">Knowledge Map</div>
                <p className="mt-2 text-xs leading-5 text-zinc-500">Conversation history grouped by branch.</p>
              </div>
              <button
                onClick={onToggle}
                className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-200"
                type="button"
              >
                Hide
              </button>
            </div>

            <nav className="mt-6 space-y-5" aria-label="Question tree">
              {groupedHistory.map(({ category, nodes }) => (
                <div key={category}>
                  <div className="flex items-center gap-2 px-2">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">{category}</div>
                    <div className="h-px flex-1 bg-zinc-200/80" />
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {nodes.length > 0 ? (
                      nodes.map((node, index) => (
                        <button
                          key={node.instanceId}
                          onClick={() => onSelectQuestion(node.question)}
                          className={`group block w-full rounded-[18px] px-3 py-2.5 text-left text-sm transition ${
                            node.state === "current" ? "bg-black text-white" : "bg-white/55 text-zinc-700 hover:bg-zinc-100"
                          }`}
                          type="button"
                          data-state={node.state}
                        >
                          <span className="flex items-start gap-2">
                            <span
                              className={`mt-1.5 size-2 rounded-full ${
                                node.state === "current" ? "bg-white" : "bg-zinc-300 group-hover:bg-zinc-500"
                              }`}
                            />
                            <span>
                              <span className="block leading-5">{node.question}</span>
                              <span
                                className={`mt-1 block text-[11px] ${
                                  node.state === "current" ? "text-white/60" : "text-zinc-400"
                                }`}
                              >
                                {node.state === "current" ? "Current node" : `History node ${index + 1}`}
                              </span>
                            </span>
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-xs text-zinc-400" data-state="disabled">
                        No nodes yet
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </nav>
          </motion.aside>
        ) : (
          <motion.button
            key="question-tree-handle"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={onToggle}
            className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white shadow-[0_12px_35px_rgba(0,0,0,0.16)]"
            type="button"
          >
            Knowledge Map
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
