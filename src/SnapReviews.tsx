import { useEffect, useRef, useState } from "react";

export type Review = { name: string; quote: string; source?: string };

type Props = {
  reviews: Review[];
  pageSizeDesktop?: number;
  pageSizeMobile?: number;
  desktopQuery?: string;
};

const useMedia = (query: string) => {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
};

const ReviewCard = ({ review, open, onToggle }: { review: Review; open: boolean; onToggle: () => void }) => {
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const [clipped, setClipped] = useState(false);

  useEffect(() => {
    const el = quoteRef.current;
    if (!el) return;
    const measure = () => { if (!open) setClipped(el.scrollHeight - el.clientHeight > 2); };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [review.quote, open]);

  return (
    <figure className={clipped ? "snap-review openable" : "snap-review"}>
      <blockquote ref={quoteRef} className={open ? "full" : undefined}>“{review.quote}”</blockquote>
      {clipped && (
        <button
          type="button"
          className="snap-review-hit"
          aria-expanded={open}
          aria-label={open ? `Hide the full review from ${review.name}` : `Read the full review from ${review.name}`}
          onClick={onToggle}
        />
      )}
      <figcaption>
        <span>{review.name}</span>
        {review.source && <span className="snap-review-src">{review.source}</span>}
      </figcaption>
    </figure>
  );
};

export const SnapReviews = ({ reviews, pageSizeDesktop = 4, pageSizeMobile = 2, desktopQuery = "(min-width: 768px)" }: Props) => {
  const isDesktop = useMedia(desktopQuery);
  const pageSize = isDesktop ? pageSizeDesktop : pageSizeMobile;
  const pageCount = Math.ceil(reviews.length / pageSize);
  const [page, setPage] = useState(0);
  const [openName, setOpenName] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: 0 });

  // Dots follow the scroll position.
  const onScroll = () => {
    const el = trackRef.current;
    if (!el || el.children.length < 2) return;
    const step = (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft;
    if (step <= 0) return;
    const max = el.scrollWidth - el.clientWidth;
    const index = max - el.scrollLeft < 2 ? (pageCount - 1) * pageSize : el.scrollLeft / step;
    setPage(Math.min(pageCount - 1, Math.max(0, Math.floor(index / pageSize))));
  };

  const goPage = (i: number) => {
    const target = trackRef.current?.children[i * pageSize] as HTMLElement | undefined;
    target?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setOpenName(null);
  };

  // Mouse drag (touch already scrolls natively).
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || e.pointerType !== "mouse") return;
    drag.current = { down: true, x: e.clientX, left: el.scrollLeft, moved: 0 };
    el.style.scrollSnapType = "none";
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    const d = drag.current;
    if (!el || !d.down) return;
    const dx = e.clientX - d.x;
    d.moved = Math.max(d.moved, Math.abs(dx));
    el.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const el = trackRef.current;
    if (!el || !drag.current.down) return;
    drag.current.down = false;
    requestAnimationFrame(() => { el.style.scrollSnapType = ""; });
  };
  // A drag must never open a card.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved > 6) { e.preventDefault(); e.stopPropagation(); drag.current.moved = 0; }
  };

  return (
    <div className="snap-reviews">
      <div
        ref={trackRef}
        className="snap-reviews-track"
        style={{ ["--per-page" as string]: pageSize }}
        aria-label="Reviews — swipe or scroll to see more"
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {reviews.map((r) => (
          <ReviewCard key={r.name} review={r} open={openName === r.name} onToggle={() => setOpenName(openName === r.name ? null : r.name)} />
        ))}
      </div>
      {pageCount > 1 && (
        <div className="snap-reviews-dots" role="tablist" aria-label="Review pages">
          {Array.from({ length: pageCount }, (_, i) => (
            <button key={i} type="button" role="tab" aria-selected={i === page} aria-label={`Show reviews, page ${i + 1}`} className={i === page ? "on" : ""} onClick={() => goPage(i)} />
          ))}
        </div>
      )}
    </div>
  );
};
