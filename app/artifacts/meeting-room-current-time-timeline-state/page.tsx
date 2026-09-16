import Link from "next/link";

const timelineImages = [
  {
    src: "/artifacts/meeting-room-timeline-booking-buffer-current.png",
    alt: "Meeting Room App timeline showing the current booking buffer state before a meeting",
    title: "Booking buffer",
    caption: "Current slot is blocked by buffer logic before the scheduled meeting.",
  },
  {
    src: "/artifacts/meeting-room-timeline-meeting-current.png",
    alt: "Meeting Room App timeline showing an active meeting as not bookable",
    title: "Meeting in progress",
    caption: "Current meeting is highlighted while the room remains not bookable.",
  },
  {
    src: "/artifacts/meeting-room-timeline-available-current.png",
    alt: "Meeting Room App timeline showing the current available slot",
    title: "Available slot",
    caption: "Current available period is highlighted and supports instant reservation.",
  },
];

export default function CurrentTimeTimelineStateArtifact() {
  return (
    <main className="min-h-screen bg-[#fafaf8] px-4 py-8 text-black md:px-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-medium text-zinc-500 underline-offset-4 transition hover:text-black hover:underline">
          Back to Portfolio OS
        </Link>

        <div className="mt-10 max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Figma UI / Timeline behavior
          </div>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-black md:text-5xl">
            Current Time Timeline State
          </h1>
          <p className="mt-5 text-base leading-7 text-zinc-700 md:text-lg md:leading-8">
            Admin-defined booking buffers make the room temporarily not bookable. A highlighted timeline frame helps users
            identify the current time slot.
          </p>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            Introduced after first-version customer feedback showed that users needed a clearer way to identify the
            current time slot.
          </p>
        </div>

        <div className="mt-10 grid gap-8">
          {timelineImages.map((image) => (
            <figure key={image.src} className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
              <img src={image.src} alt={image.alt} className="w-full object-contain" />
              <figcaption className="border-t border-zinc-200 px-5 py-4">
                <div className="text-sm font-semibold text-black">{image.title}</div>
                <p className="mt-1 text-sm leading-6 text-zinc-600">{image.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
