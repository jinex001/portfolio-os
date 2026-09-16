"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { motion } from "framer-motion";
import type {
  AnswerBlock,
  ArtifactType,
  ArtifactVisual,
  CareerTimelineEntry,
  DesignLog,
  DiscoveryCardData,
  EvidenceItem,
  PerspectiveLens,
  SourceReference,
} from "@/data/portfolio-response";

const blockVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

type MotionBlockProps = {
  delay: number;
  eyebrow: string;
  children: React.ReactNode;
};

export function MotionBlock({ delay, eyebrow, children }: MotionBlockProps) {
  return (
    <motion.section
      variants={blockVariants}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay }}
      className="bg-white"
      data-state="completed"
    >
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">{eyebrow}</div>
      {children}
    </motion.section>
  );
}

export function AnswerBlockRenderer({
  block,
  delay,
  onQuestionSelect,
}: {
  block: AnswerBlock;
  delay: number;
  onQuestionSelect: (question: string) => void;
}) {
  if (block.type === "summary") {
    return (
      <MotionBlock delay={delay} eyebrow={block.label}>
        <div className="max-w-3xl">
          <TypewriterText
            as="h1"
            text={block.title}
            speed={14}
            className="text-2xl font-semibold leading-tight text-black md:text-3xl"
          />
          <TypewriterText
            as="p"
            text={block.body}
            speed={18}
            className="mt-4 max-w-2xl text-base leading-7 text-black"
          />
        </div>
        {block.signals ? (
          <div className="mt-7 flex flex-wrap gap-2">
            {block.signals.map((signal) => (
              <span key={signal} className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm text-zinc-700">
                {signal}
              </span>
            ))}
          </div>
        ) : null}
      </MotionBlock>
    );
  }

  if (block.type === "perspectiveLens") {
    return <PerspectiveLensBlock delay={delay} title={block.title} label={block.label} lenses={block.lenses} />;
  }

  if (block.type === "designReasoning") {
    return (
      <MotionBlock delay={delay} eyebrow={block.label}>
        <TypewriterText as="h2" text={block.title} speed={14} className="text-xl font-semibold text-black" />
        <div className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-2">
          {block.steps.map((step, index) => (
            <div key={step} className="rounded-[18px] p-1 transition hover:bg-zinc-50" data-state="related">
              <div className="text-xs font-semibold text-zinc-400">0{index + 1}</div>
              <TypewriterText as="p" text={step} speed={16} className="mt-2 text-base leading-7 text-black" />
            </div>
          ))}
        </div>
      </MotionBlock>
    );
  }

  if (block.type === "careerEvolution") {
    return (
      <CareerEvolutionBlock
        delay={delay}
        label={block.label}
        introLines={block.introLines}
        fastPathLabel={block.fastPathLabel}
        primaryTrack={block.primaryTrack}
        creativeTrack={block.creativeTrack}
        mergeHeadline={block.mergeHeadline}
        mergeFallback={block.mergeFallback}
        aiHeadline={block.aiHeadline}
        aiLinkLabel={block.aiLinkLabel}
        aiLinkTargetQuestion={block.aiLinkTargetQuestion}
        endingHeadline={block.endingHeadline}
        onQuestionSelect={onQuestionSelect}
      />
    );
  }

  if (block.type === "evidence") {
    return (
      <EvidenceBlock
        delay={delay}
        label={block.label}
        title={block.title}
        items={block.items}
        onQuestionSelect={onQuestionSelect}
      />
    );
  }

  if (block.type === "relatedWork") {
    return (
      <MotionBlock delay={delay} eyebrow={block.label}>
        <TypewriterText as="h2" text={block.title} speed={14} className="text-xl font-semibold text-black" />
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {block.cases.map((item) => (
            <article key={item.title} className="rounded-[22px] bg-zinc-100 p-5 transition hover:bg-zinc-200/70">
              <TypewriterText as="h3" text={item.title} speed={14} className="text-base font-semibold text-black" />
              <TypewriterText as="p" text={item.summary} speed={18} className="mt-3 text-sm leading-6 text-zinc-600" />
              <div className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">Outcome</div>
              <TypewriterText as="p" text={item.outcome} speed={18} className="mt-2 text-sm leading-6 text-black" />
            </article>
          ))}
        </div>
      </MotionBlock>
    );
  }

  if (block.type === "decisionLog") {
    return <DesignLogPreview delay={delay} label={block.label} log={block.log} />;
  }

  return (
    <MotionBlock delay={delay} eyebrow={block.label}>
      <TypewriterText as="h2" text={block.title} speed={14} className="text-xl font-semibold text-black" />
      <div className="mt-5 flex flex-wrap gap-2">
        {block.questions.map((question) => (
          <button
            key={question}
            onClick={() => onQuestionSelect(question)}
            className="rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-700 transition hover:bg-black hover:text-white"
            type="button"
            data-state="related"
          >
            {question}
          </button>
        ))}
      </div>
    </MotionBlock>
  );
}

export function AssemblingState({ question }: { question: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mt-24 max-w-3xl"
      data-state="loading"
    >
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">Assembling</div>
      <h1 className="mt-4 text-2xl font-semibold text-black">Building a structured answer.</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-500">
        Mapping "{question}" into summary, reasoning, evidence, and related paths.
      </p>
      <div className="mt-7 flex gap-2">
        {[0, 1, 2].map((item) => (
          <motion.span
            key={item}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: item * 0.18 }}
            className="size-2 rounded-full bg-zinc-400"
          />
        ))}
      </div>
    </motion.div>
  );
}

export function PerspectiveLensBlock({
  delay,
  label,
  title,
  lenses,
}: {
  delay: number;
  label: string;
  title: string;
  lenses: PerspectiveLens[];
}) {
  return (
    <MotionBlock delay={delay} eyebrow={label}>
      <TypewriterText as="h2" text={title} speed={14} className="text-xl font-semibold text-black" />
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {lenses.map((lens) => (
          <article key={lens.audience} className="rounded-[20px] bg-zinc-100 p-4 transition hover:bg-zinc-200/70">
            <div className="text-sm font-semibold text-black">{lens.audience}</div>
            <TypewriterText as="p" text={lens.takeaway} speed={18} className="mt-2 text-sm leading-6 text-zinc-600" />
          </article>
        ))}
      </div>
    </MotionBlock>
  );
}

export function EvidenceBlock({
  delay,
  label,
  title,
  items,
  onQuestionSelect,
}: {
  delay: number;
  label: string;
  title: string;
  items: EvidenceItem[];
  onQuestionSelect: (question: string) => void;
}) {
  return (
    <MotionBlock delay={delay} eyebrow={label}>
      <TypewriterText as="h2" text={title} speed={14} className="text-xl font-semibold text-black" />
      <ArtifactGallery items={items} onQuestionSelect={onQuestionSelect} />
    </MotionBlock>
  );
}

export function ArtifactGallery({
  items,
  onQuestionSelect,
}: {
  items: EvidenceItem[];
  onQuestionSelect: (question: string) => void;
}) {
  const artifacts = items.flatMap((item) =>
    item.references.map((reference) => ({
      item,
      reference,
      targetQuestion: getArtifactTargetQuestion(item, reference),
    })),
  );

  return (
    <div className="mt-6 grid gap-x-6 gap-y-9 md:grid-cols-2" data-state="artifact-gallery">
      {artifacts.map((artifact) => (
        <ArtifactCard
          key={`${artifact.item.title}-${artifact.reference.label}`}
          item={artifact.item}
          reference={artifact.reference}
          targetQuestion={artifact.targetQuestion}
          onQuestionSelect={onQuestionSelect}
        />
      ))}
    </div>
  );
}

function ArtifactCard({
  reference,
  targetQuestion,
  onQuestionSelect,
}: {
  item: EvidenceItem;
  reference: SourceReference;
  targetQuestion?: string;
  onQuestionSelect: (question: string) => void;
}) {
  const cardLabel = formatArtifactType(reference.type);
  const isFeatured = isFeaturedArtifact(reference);

  return (
    <article className={isFeatured ? "group md:col-span-2" : "group"}>
      <div className="mb-3 min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">{cardLabel}</div>
        <h3 className={isFeatured ? "mt-2 text-xl font-semibold leading-7 text-black" : "mt-2 text-base font-semibold leading-6 text-black"}>
          {reference.label}
        </h3>
      </div>

      <ArtifactMedia
        isFeatured={isFeatured}
        reference={reference}
        targetQuestion={targetQuestion}
        onQuestionSelect={onQuestionSelect}
      />

      <div className="mt-3">
        {reference.href ? (
          <a
            href={reference.href}
            className="text-sm font-medium text-zinc-500 underline-offset-4 transition hover:text-black hover:underline"
          >
            View artifact &rarr;
          </a>
        ) : targetQuestion ? (
          <button
            onClick={() => onQuestionSelect(targetQuestion)}
            className="text-left text-sm font-medium text-zinc-500 underline-offset-4 transition hover:text-black hover:underline"
            type="button"
          >
            View artifact &rarr;
          </button>
        ) : (
          <span className="text-sm font-medium text-zinc-400" aria-disabled="true">
            View artifact &rarr;
          </span>
        )}
      </div>
    </article>
  );
}

function ArtifactMedia({
  isFeatured,
  reference,
  targetQuestion,
  onQuestionSelect,
}: {
  isFeatured: boolean;
  reference: SourceReference;
  targetQuestion?: string;
  onQuestionSelect: (question: string) => void;
}) {
  const visuals = getArtifactVisuals(reference);

  if (visuals.length > 1) {
    return (
      <ArtifactCarousel
        isFeatured={isFeatured}
        reference={reference}
        targetQuestion={targetQuestion}
        visuals={visuals}
        onQuestionSelect={onQuestionSelect}
      />
    );
  }

  return (
    <ArtifactSinglePreview
      isFeatured={isFeatured}
      reference={reference}
      targetQuestion={targetQuestion}
      visual={visuals[0]}
      onQuestionSelect={onQuestionSelect}
    />
  );
}

function ArtifactSinglePreview({
  isFeatured,
  reference,
  targetQuestion,
  visual,
  onQuestionSelect,
}: {
  isFeatured: boolean;
  reference: SourceReference;
  targetQuestion?: string;
  visual?: ArtifactVisual;
  onQuestionSelect: (question: string) => void;
}) {
  const preview = (
    <ArtifactPreviewFrame isFeatured={isFeatured} reference={reference} visual={visual} />
  );

  if (reference.href) {
    return (
      <a href={reference.href} className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4">
        {preview}
      </a>
    );
  }

  if (targetQuestion) {
    return (
      <button
        onClick={() => onQuestionSelect(targetQuestion)}
        className="block w-full rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4"
        type="button"
      >
        {preview}
      </button>
    );
  }

  return preview;
}

function ArtifactCarousel({
  isFeatured,
  reference,
  targetQuestion,
  visuals,
  onQuestionSelect,
}: {
  isFeatured: boolean;
  reference: SourceReference;
  targetQuestion?: string;
  visuals: ArtifactVisual[];
  onQuestionSelect: (question: string) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const activeVisual = visuals[activeIndex];
  const goToPrevious = () => setActiveIndex((current) => (current === 0 ? visuals.length - 1 : current - 1));
  const goToNext = () => setActiveIndex((current) => (current === visuals.length - 1 ? 0 : current + 1));

  function openArtifact() {
    if (!targetQuestion) return;
    onQuestionSelect(targetQuestion);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }

    if ((event.key === "Enter" || event.key === " ") && !reference.href) {
      event.preventDefault();
      openArtifact();
    }
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStartX;
    setTouchStartX(null);

    if (Math.abs(deltaX) < 40) return;
    if (deltaX > 0) goToPrevious();
    else goToNext();
  }

  return (
    <div
      className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 transition group-hover:border-zinc-300"
      onKeyDown={handleKeyDown}
      onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="region"
      aria-label={`${reference.label} design process carousel`}
    >
      <div className="relative">
        {reference.href ? (
          <a href={reference.href} className="block focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
            <ArtifactVisualImage isFeatured={isFeatured} title={reference.label} visual={activeVisual} />
          </a>
        ) : targetQuestion ? (
          <button
            onClick={openArtifact}
            className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
            type="button"
          >
            <ArtifactVisualImage isFeatured={isFeatured} title={reference.label} visual={activeVisual} />
          </button>
        ) : (
          <ArtifactVisualImage isFeatured={isFeatured} title={reference.label} visual={activeVisual} />
        )}

        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <div className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-600 shadow-sm">
            {activeVisual.stage ?? `Step ${activeIndex + 1}`}
          </div>
          <div className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-zinc-500 shadow-sm">
            {activeIndex + 1}/{visuals.length}
          </div>
        </div>

        <div className="absolute inset-y-0 left-3 flex items-center">
          <button
            onClick={(event) => {
              event.stopPropagation();
              goToPrevious();
            }}
            className="flex size-9 items-center justify-center rounded-full bg-white/90 text-lg text-black shadow-sm transition hover:bg-white"
            type="button"
            aria-label="Previous artifact image"
          >
            &larr;
          </button>
        </div>
        <div className="absolute inset-y-0 right-3 flex items-center">
          <button
            onClick={(event) => {
              event.stopPropagation();
              goToNext();
            }}
            className="flex size-9 items-center justify-center rounded-full bg-white/90 text-lg text-black shadow-sm transition hover:bg-white"
            type="button"
            aria-label="Next artifact image"
          >
            &rarr;
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 bg-white px-4 py-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-black">{activeVisual.stage ?? `Step ${activeIndex + 1}`}</div>
          {activeVisual.note ? <div className="mt-1 truncate text-xs text-zinc-500">{activeVisual.note}</div> : null}
        </div>
        <div className="flex shrink-0 gap-1.5" aria-label="Artifact image pagination">
          {visuals.map((visual, index) => (
            <button
              key={`${visual.src}-${index}`}
              onClick={(event) => {
                event.stopPropagation();
                setActiveIndex(index);
              }}
              className={`size-2.5 rounded-full transition ${
                index === activeIndex ? "bg-black" : "bg-zinc-300 hover:bg-zinc-500"
              }`}
              type="button"
              aria-label={`Show ${visual.stage ?? `artifact image ${index + 1}`}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ArtifactPreviewFrame({
  isFeatured,
  reference,
  visual,
}: {
  isFeatured: boolean;
  reference: SourceReference;
  visual?: ArtifactVisual;
}) {
  const variant = getArtifactPreviewVariant(reference.type, reference.label);

  if (visual) {
    return (
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 transition group-hover:border-zinc-300">
        <ArtifactVisualImage isFeatured={isFeatured} title={reference.label} visual={visual} />
      </div>
    );
  }

  return <ArtifactFallbackPreview isFeatured={isFeatured} variant={variant} />;
}

function ArtifactVisualImage({
  isFeatured,
  title,
  visual,
}: {
  isFeatured: boolean;
  title: string;
  visual: ArtifactVisual;
}) {
  const aspectClass = isFeatured ? "aspect-[16/10]" : "aspect-[4/3]";

  return (
    <img
      src={visual.src}
      alt={visual.alt || `${title} preview`}
      className={`${aspectClass} w-full object-cover object-top`}
      loading="lazy"
    />
  );
}

function ArtifactFallbackPreview({ isFeatured, variant }: { isFeatured: boolean; variant: string }) {
  const aspectClass = isFeatured ? "aspect-[16/10]" : "aspect-[4/3]";

  if (variant === "timeline") {
    return (
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 p-5 transition group-hover:border-zinc-300" aria-hidden="true">
        <div className={`flex ${aspectClass} items-center gap-2`}>
          {[32, 58, 44, 70].map((width, index) => (
            <div key={index} className="flex flex-1 flex-col justify-center gap-2">
              <div className="h-px bg-zinc-300" />
              <div className="h-2 rounded-full bg-black" style={{ width: `${width}%` }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "screen") {
    return (
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition group-hover:border-zinc-300" aria-hidden="true">
        <div className={`${aspectClass} rounded-md border border-zinc-200 bg-white p-3`}>
          <div className="h-3 w-20 rounded-full bg-black" />
          <div className="mt-4 grid grid-cols-[1fr_2fr] gap-3">
            <div className="h-16 rounded-md bg-zinc-200" />
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-zinc-300" />
              <div className="h-2 w-4/5 rounded-full bg-zinc-300" />
              <div className="h-8 rounded-md bg-zinc-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "log") {
    return (
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 p-5 transition group-hover:border-zinc-300" aria-hidden="true">
        <div className="space-y-2">
          <div className="h-2 w-24 rounded-full bg-black" />
          <div className="h-2 rounded-full bg-zinc-300" />
          <div className="h-2 w-5/6 rounded-full bg-zinc-300" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="h-9 rounded-md bg-white ring-1 ring-zinc-200" />
            <div className="h-9 rounded-md bg-white ring-1 ring-zinc-200" />
            <div className="h-9 rounded-md bg-zinc-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 p-5 transition group-hover:border-zinc-300" aria-hidden="true">
      <div className={`grid ${aspectClass} grid-cols-3 gap-2`}>
        <div className="rounded-md bg-white ring-1 ring-zinc-200" />
        <div className="rounded-md bg-zinc-200" />
        <div className="rounded-md bg-white ring-1 ring-zinc-200" />
      </div>
      <div className="mt-3 h-2 w-2/3 rounded-full bg-black" />
    </div>
  );
}

function isFeaturedArtifact(reference: SourceReference) {
  return reference.label === "Current Time Timeline State";
}

function getArtifactVisuals(reference: SourceReference): ArtifactVisual[] {
  if (reference.previewImages && reference.previewImages.length > 0) return reference.previewImages;
  if (!reference.previewImage) return [];

  return [
    {
      src: reference.previewImage,
      alt: `${reference.label} preview`,
      stage: "Artifact preview",
    },
  ];
}

function getArtifactPreviewVariant(type: ArtifactType, title: string) {
  const value = `${type} ${title}`.toLowerCase();

  if (value.includes("timeline") || value.includes("flow")) return "timeline";
  if (value.includes("prototype") || value.includes("screen") || value.includes("figma")) return "screen";
  if (value.includes("log") || value.includes("note") || value.includes("rule")) return "log";

  return "map";
}

function formatArtifactType(type: ArtifactType) {
  if (type === "Figma UI / Timeline behavior") return "Figma UI / Timeline Behavior";

  return type
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getArtifactTargetQuestion(item: EvidenceItem, reference: SourceReference) {
  const value = `${item.title} ${reference.label}`.toLowerCase();

  if (value.includes("decision log #12")) return "Open Decision Log #12.";
  if (value.includes("meeting room")) return "Show me the Meeting Room App Redesign case.";

  return undefined;
}

export function DesignLogPreview({ delay, label, log }: { delay: number; label: string; log: DesignLog }) {
  return (
    <MotionBlock delay={delay} eyebrow={label}>
      <article className="rounded-[28px] bg-zinc-100 p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <TypewriterText as="h2" text={log.title} speed={14} className="text-xl font-semibold text-black" />
            <TypewriterText
              as="p"
              text={log.decisionSummary}
              speed={18}
              className="mt-3 max-w-2xl text-base leading-7 text-black"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white px-3 py-1.5 text-zinc-600">{log.version}</span>
            <span className="rounded-full bg-white px-3 py-1.5 text-zinc-600">{log.date}</span>
            <span className="rounded-full bg-black px-3 py-1.5 text-white">{log.status}</span>
          </div>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-[1fr_1fr]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">Why this matters</div>
            <TypewriterText as="p" text={log.whyItMatters} speed={18} className="mt-2 text-sm leading-6 text-zinc-700" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">Related project</div>
            <TypewriterText as="p" text={log.relatedProject} speed={18} className="mt-2 text-sm leading-6 text-zinc-700" />
          </div>
        </div>
      </article>
    </MotionBlock>
  );
}

const timelineEntryVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const timelineFieldVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const } },
};

function CareerTimelineNode({
  entry,
  variant,
  onQuestionSelect,
}: {
  entry: CareerTimelineEntry;
  variant: "primary" | "creative";
  onQuestionSelect: (question: string) => void;
}) {
  const isCreative = variant === "creative";

  return (
    <motion.div
      className="grid grid-cols-[32px_1fr] gap-4 md:grid-cols-[64px_1fr]"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={timelineEntryVariants}
    >
      <div className="relative flex flex-col items-center">
        <motion.span
          variants={timelineFieldVariants}
          className={
            isCreative
              ? "z-10 mt-0.5 h-2 w-2 rounded-full border-[1.5px] border-zinc-400 bg-white"
              : "z-10 mt-0.5 h-2 w-2 rounded-full bg-black"
          }
        />
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "top" }}
          className={
            isCreative
              ? "absolute top-3 w-px flex-1 border-l border-dashed border-zinc-300"
              : "absolute top-3 w-px flex-1 bg-zinc-200"
          }
        />
      </div>

      <div className={isCreative ? "pb-16" : entry.emphasis ? "pb-24" : "pb-16"}>
        <motion.div variants={timelineFieldVariants} className="text-xs tabular-nums text-zinc-400">
          {entry.year}
        </motion.div>
        <motion.div
          variants={timelineFieldVariants}
          className={
            isCreative
              ? "mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400"
              : "mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-black"
          }
        >
          {entry.chapterLabel}
        </motion.div>

        {entry.headline ? (
          <motion.h3
            variants={timelineFieldVariants}
            className={`mt-3 font-title font-medium text-black ${entry.emphasis ? "text-2xl" : "text-xl"}`}
          >
            {entry.headline}
          </motion.h3>
        ) : null}

        {entry.entries.map((sub, index) => (
          <motion.div key={sub.company + index} variants={timelineFieldVariants} className={index > 0 ? "mt-5" : "mt-3"}>
            <div className={isCreative ? "text-base font-medium text-black" : entry.emphasis ? "font-title text-xl text-black" : "text-base font-medium text-black"}>
              {sub.company}
            </div>
            {sub.context ? <div className="mt-1 text-sm text-zinc-500">{sub.context}</div> : null}
            <p className={isCreative ? "mt-2 max-w-[46ch] text-sm leading-6 text-zinc-600" : "mt-2 max-w-[52ch] text-base leading-7 text-zinc-700 whitespace-pre-line"}>
              {sub.narrative}
            </p>
          </motion.div>
        ))}

        {entry.tags ? (
          <motion.div variants={timelineFieldVariants} className="mt-5 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                {tag}
              </span>
            ))}
          </motion.div>
        ) : null}

        {entry.tagGroups
          ? entry.tagGroups.map((group, gi) => (
              <motion.div key={gi} variants={timelineFieldVariants} className="mt-3 flex flex-wrap gap-2">
                {group.map((tag) => (
                  <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                    {tag}
                  </span>
                ))}
              </motion.div>
            ))
          : null}

        {entry.links ? (
          <motion.div variants={timelineFieldVariants} className="mt-5 flex flex-col gap-1.5">
            {entry.links.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => onQuestionSelect(link.targetQuestion)}
                className="w-fit border-b border-zinc-200 pb-0.5 text-left text-sm text-zinc-600 transition hover:border-black hover:text-black"
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}

function CareerEvolutionBlock({
  delay,
  label,
  introLines,
  fastPathLabel,
  primaryTrack,
  creativeTrack,
  mergeHeadline,
  mergeFallback,
  aiHeadline,
  aiLinkLabel,
  aiLinkTargetQuestion,
  endingHeadline,
  onQuestionSelect,
}: {
  delay: number;
  label: string;
  introLines: string[];
  fastPathLabel: string;
  primaryTrack: CareerTimelineEntry[];
  creativeTrack: CareerTimelineEntry[];
  mergeHeadline: string;
  mergeFallback: string;
  aiHeadline: string;
  aiLinkLabel: string;
  aiLinkTargetQuestion?: string;
  endingHeadline: string;
  onQuestionSelect: (question: string) => void;
}) {
  const nowRef = useRef<HTMLDivElement | null>(null);
  const creativeByAlignAfter = new Map<string, CareerTimelineEntry[]>();
  creativeTrack.forEach((entry) => {
    const key = entry.alignAfter ?? "";
    const list = creativeByAlignAfter.get(key) ?? [];
    list.push(entry);
    creativeByAlignAfter.set(key, list);
  });

  return (
    <MotionBlock delay={delay} eyebrow={label}>
      <div className="max-w-2xl">
        {introLines.map((line, i) => (
          <TypewriterText
            key={i}
            as={i === 0 ? "h2" : "h2"}
            text={line}
            speed={14}
            className={i === 0 ? "font-title text-3xl font-medium text-black md:text-4xl" : "mt-1 font-title text-2xl font-medium text-zinc-500 md:text-3xl"}
          />
        ))}
        <button
          type="button"
          onClick={() => nowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="mt-6 border-b border-zinc-200 pb-0.5 text-sm text-zinc-500 transition hover:border-black hover:text-black"
        >
          {fastPathLabel}
        </button>
      </div>

      <div className="mt-16 space-y-0">
        {primaryTrack.map((entry) => (
          <div key={entry.id} className={isWide(creativeByAlignAfter, entry.id) ? "grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,280px)]" : ""}>
            <CareerTimelineNode entry={entry} variant="primary" onQuestionSelect={onQuestionSelect} />
            {(creativeByAlignAfter.get(entry.id) ?? []).map((creativeEntry) => (
              <div key={creativeEntry.id} className="hidden md:block">
                <CareerTimelineNode entry={creativeEntry} variant="creative" onQuestionSelect={onQuestionSelect} />
              </div>
            ))}
          </div>
        ))}

        {/* Mobile: render creative entries inline, branching off the main line */}
        <div className="md:hidden">
          {creativeTrack.map((entry) => (
            <div key={entry.id} className="ml-8 border-l border-dashed border-zinc-300 pl-6">
              <CareerTimelineNode entry={entry} variant="creative" onQuestionSelect={onQuestionSelect} />
            </div>
          ))}
        </div>
      </div>

      <div ref={nowRef} className="mt-8 flex flex-col items-center py-16 text-center">
        <svg viewBox="0 0 480 200" className="mb-6 h-auto w-full max-w-[420px]" fill="none">
          <motion.path
            d="M120 0 C120 80, 230 100, 240 160"
            stroke="#111111"
            strokeWidth={1.5}
            pathLength={1}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            d="M360 0 C360 80, 250 100, 240 160"
            stroke="#A1A1AA"
            strokeWidth={1.5}
            pathLength={1}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.circle
            cx={240}
            cy={164}
            r={5}
            fill="#111111"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          />
        </svg>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
          className="text-xs uppercase tracking-[0.16em] text-zinc-400"
        >
          Now
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.78 }}
          className="mt-3 font-title text-2xl font-medium text-black md:text-3xl"
        >
          {mergeHeadline}
        </motion.h3>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.86 }}
          className="mt-2 text-sm text-zinc-500"
        >
          {mergeFallback}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.96 }}
          className="mt-10 flex flex-col items-center"
        >
          <div className="h-8 w-px bg-zinc-200" />
          <div className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-400">+ AI</div>
          <h4 className="mt-3 font-title text-xl font-medium text-black md:text-2xl">{aiHeadline}</h4>
          {aiLinkTargetQuestion ? (
            <button
              type="button"
              onClick={() => onQuestionSelect(aiLinkTargetQuestion)}
              className="mt-3 border-b border-zinc-200 pb-0.5 text-sm text-zinc-500 transition hover:border-black hover:text-black"
            >
              {aiLinkLabel}
            </button>
          ) : (
            <span className="mt-3 text-sm text-zinc-500">{aiLinkLabel}</span>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 max-w-xl border-t border-zinc-100 pt-10 text-center text-lg leading-8 text-black md:text-xl"
      >
        {endingHeadline}
      </motion.div>
    </MotionBlock>
  );
}

/** True if this primary entry has at least one aligned creative entry (desktop two-column layout). */
function isWide(map: Map<string, CareerTimelineEntry[]>, id: string) {
  const list = map.get(id);
  return !!list && list.length > 0;
}

function TypewriterText({
  as: Component = "p",
  className,
  speed = 18,
  text,
}: {
  as?: "div" | "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  speed?: number;
  text: string;
}) {
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    setVisibleLength(0);

    if (!text) return;

    let frameId: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    function tick(length: number) {
      if (cancelled) return;

      const nextLength = Math.min(text.length, length + 1);
      setVisibleLength(nextLength);

      if (nextLength >= text.length) return;

      frameId = setTimeout(() => {
        tick(nextLength);
      }, speed);
    }

    frameId = setTimeout(() => {
      tick(0);
    }, Math.min(speed * 2, 50));

    return () => {
      cancelled = true;
      if (frameId) clearTimeout(frameId);
    };
  }, [speed, text]);

  return (
    <Component className={className}>
      {text.slice(0, visibleLength)}
      {visibleLength < text.length ? <span className="inline-block w-[0.55ch] animate-pulse text-zinc-400">|</span> : null}
    </Component>
  );
}

export function DiscoveryRail({
  cards,
  onSelect,
}: {
  cards: DiscoveryCardData[];
  onSelect: (question: string) => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.86 }}
      className="mt-12"
      aria-label="Discovery rail"
      data-state="related-exploration"
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">Discovery Rail</div>
          <h2 className="mt-2 text-xl font-semibold text-black">Contextual next paths</h2>
        </div>
        <div className="hidden text-sm text-zinc-500 md:block">Generated from the current conversation context.</div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <DiscoveryCard key={card.id} card={card} index={index} onSelect={onSelect} />
        ))}
      </div>
    </motion.section>
  );
}

export function DiscoveryCard({
  card,
  index,
  onSelect,
}: {
  card: DiscoveryCardData;
  index: number;
  onSelect: (question: string) => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.38,
        ease: [0.22, 1, 0.36, 1],
        delay: 1 + index * 0.08,
      }}
      onClick={() => onSelect(card.targetQuestion)}
      className="flex min-h-[170px] flex-col items-start justify-start rounded-[24px] bg-zinc-100 p-4 text-left transition hover:-translate-y-0.5 hover:bg-zinc-200/70 focus:outline-none focus:ring-2 focus:ring-black"
      type="button"
      data-state="related"
    >
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{card.type}</div>
      <h3 className="mt-4 text-lg font-semibold leading-6 text-black">{card.title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{card.reason}</p>
      <div className="mt-5 text-sm font-semibold text-black">Open path &rarr;</div>
    </motion.button>
  );
}
