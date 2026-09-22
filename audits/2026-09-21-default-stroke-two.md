# Default markup stroke weight — 2026-09-21

Changed only the shared addMarkup creation default to strokeWidth: 2. All new line, circle, square, and arrow variants use this constructor, including keyboard shortcuts. Saved object weights, historical missing-weight normalization, and project-state are unchanged. The old canonical V1 builders are absent.

Browser check: created a solid line, circle, square, and arrow through their actual toolbar menus in an isolated copy. Each saved/rendered --markup-width was 2; line/circle/square strokes and the main arrow path rendered at 2px. No website files changed and nothing was published.
