<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Taskify continuity

Read `.taskify-context/00-START-HERE.md` and `11-HANDOFF.md` before changes. Keep the decision log, implementation log, validation evidence and handoff current after every coherent batch. This local folder is Git-ignored; never store secrets in it.

## Taskify NeoPOP design authority

The local compatibility layer in `components/neopop/` and its tokens are the design-system authority. It is adapted from CRED's Apache-2.0 `@cred/neopop-web` source at pinned commit `1f4b3d2`, then modified for React 19, Next.js 16, keyboard access, desktop workspaces, and Taskify semantics. Keep the attribution in `THIRD_PARTY_NOTICES.md`.

- Use `components/neopop` primitives before creating one-off controls or layout systems.
- Preserve the exact NeoPOP foundations: `#0d0d0d`, sharp geometry, 3px/45-degree plunk edges, high-contrast state palettes, and 120ms press motion.
- Taskify remains the brand. Use the affirmative momentum semantics: yellow for the next move, blue for active work/focus, green for progress, and pink for celebration.
- Keep the experience dark-first, responsive, keyboard accessible, hydration-safe, and respectful of reduced motion.
- Gilroy and Cirka are the target typography. Until licensed local files are supplied, use the declared fallback roles; never hotlink CRED's font CDN or copy CRED brand artwork.
- Astryx is historical only. Do not add new Astryx dependencies, imports, generated themes, or component usage.
