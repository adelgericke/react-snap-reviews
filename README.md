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

```tsx
import { SnapReviews } from "./SnapReviews";
import "./snap-reviews.css";

// Fictional sample data for a dog-grooming business. Replace with your own.
const reviews = [
  { name: "Sarah M. (Milo's human)", quote: "Milo used to dread grooming day. Now he pulls me to the door.", source: "Google review" },
  { name: "Tom R. (Biscuit's dad)", quote: "Gentle, patient and on time. Biscuit came home calm and fluffy.", source: "Trustpilot" },
  { name: "Priya K. (owner of Luna)", quote: "They noticed a skin issue early and told us straight away. Grateful.", source: "Google review" },
  { name: "Daan V.", quote: "Easy booking, fair price, happy dog.", source: "Client review" },
];

<SnapReviews reviews={reviews} pageSizeDesktop={4} pageSizeMobile={2} />
```

## Where the reviews come from

The component only displays an array, so you choose the source. When setting this up (or prompting an AI builder like Lovable), decide first:

1. **Static list (start here).** Paste testimonials into the array. No keys, no backend. Always get permission and use first name + initial.
2. **Google reviews.** Fetch from the Google Business Profile API on a server or edge function (never expose the key in the browser), map each review to `{ name, quote, source: "Google review" }`, and pass the array in.
3. **Trustpilot.** Use Trustpilot's Business API or widget data the same way, mapped to `{ name, quote, source: "Trustpilot" }`.
4. **Skip for now.** Launch with 2–3 static quotes and connect a live source later; the component doesn't change.

Suggested prompt: *"Add this reviews carousel. Ask me whether to use a static list, connect Google reviews, connect Trustpilot, or skip for now."*

## Files

- `src/SnapReviews.tsx`: the component (about 120 lines)
- `src/snap-reviews.css`: plain CSS with no Tailwind needed. Theme it through the CSS variables at the top.

## Design decisions

- **One track instead of paged slides.** Every review is in the page, so search engines see all of them and the content never jumps.
- **Curated first.** Put your four most relevant reviews at the front of the array and append fetched ones (for example from Google or Trustpilot) after them.
- **Fixed card height when collapsed.** This keeps the row tidy, and expanding one card doesn't move the others.

## License

MIT
