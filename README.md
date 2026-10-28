# react-snap-reviews

A dependency-free, touch-friendly testimonial carousel for React. Native CSS scroll-snap, mouse drag, tap-to-expand cards, and page dots that follow the scroll.

**Live example:** the "What clients say" section on [startbuilding.nl](https://startbuilding.nl)

## The problem

Testimonials are some of your strongest proof, but most carousels hide them badly:

- Carousel libraries (Swiper, Slick, Embla) add tens of kilobytes and their own touch handling, which often fights the browser's native swipe on phones.
- Paged grids with arrow buttons make people click to read. Most visitors never do.
- Long reviews either get cut off with no way to read the rest, or they stretch every card to the height of the longest one.
- On desktop, dragging a card with the mouse often counts as a click and opens it by accident.

## What it solves

| Problem | How this component handles it |
|---|---|
| Heavy libraries | Zero dependencies. The browser does the scrolling with `scroll-snap-type: x mandatory`. |
| Swiping on phones | Native momentum scrolling. A sliver of the next card shows at the edge to hint that you can swipe. |
| Mouse users | Click-and-drag scrolling on desktop. Snapping pauses during the drag and comes back when you let go. |
| Drag vs. tap | Movement over 6px counts as a drag, so the click is swallowed and the card doesn't open. |
| Long reviews | Cards are clamped to a fixed number of lines. A `ResizeObserver` checks for overflow, and only clipped cards become tappable to expand inline. |
| Where am I? | The dots follow the scroll position and also work as jump buttons. |
| Accessibility | The expand control is a real `<button>` with `aria-expanded` and a descriptive label. The dots use `role="tab"`, and keyboard focus rings are visible. |

## Usage

Copy `src/SnapReviews.tsx` and `src/snap-reviews.css` into your project.

```tsx
import { SnapReviews } from "./SnapReviews";
import "./snap-reviews.css";

const reviews = [
  { name: "Chrissie C.", quote: "…", source: "Google review" },
  { name: "B.E.", quote: "…", source: "Client review" },
];

<SnapReviews reviews={reviews} pageSizeDesktop={4} pageSizeMobile={2} />
```

### Props

| Prop | Default | What it does |
|---|---|---|
| `reviews` | — | Array of `{ name, quote, source? }`. |
| `pageSizeDesktop` | `4` | Cards visible per screen on desktop. |
| `pageSizeMobile` | `2` | Cards visible per screen on mobile (the next card still peeks in). |
| `desktopQuery` | `"(min-width: 768px)"` | Media query that switches to desktop sizing. Keep it in sync with the breakpoint in the CSS. |

## Files

- `src/SnapReviews.tsx`: the component (about 120 lines)
- `src/snap-reviews.css`: plain CSS with no Tailwind needed. Theme it through the CSS variables at the top.

## Design decisions

- **One track instead of paged slides.** Every review is in the page, so search engines see all of them and the content never jumps.
- **Curated first.** Put your four most relevant reviews at the front of the array and append fetched ones (for example from the Google Places API) after them.
- **Fixed card height when collapsed.** This keeps the row tidy, and expanding one card doesn't move the others.

## License

MIT
