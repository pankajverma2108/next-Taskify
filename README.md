<div align="center">

<img src="./public/logo.svg" width="72" alt="Taskify logo" />

# TASKIFY

### Big ideas. Clear next moves.

An expressive, dark-first workspace where small teams can turn rough ideas into visible momentum.

[Explore the product](#the-product) &nbsp;&middot;&nbsp; [Run the demo](#run-it-locally) &nbsp;&middot;&nbsp; [Understand the system](#how-it-holds-together) &nbsp;&middot;&nbsp; [See what comes next](#the-next-move)

![Next.js](https://img.shields.io/badge/Next.js-16.3-0B111B?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.3-0B111B?style=flat-square&logo=react&logoColor=8DCDFF)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-0B111B?style=flat-square&logo=typescript&logoColor=8DCDFF)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-0B111B?style=flat-square&logo=postgresql&logoColor=8DCDFF)
![NeoPOP](https://img.shields.io/badge/NeoPOP-Taskify-0D0D0D?style=flat-square)

</div>

---

> Taskify is designed around one feeling: the team should always know what matters, what is moving, and what to do next.

## The Product

![Taskify's dark interactive board with four project lanes](./public/readme/board-desktop.png)

Taskify is a working project workspace built around a fast Kanban core. Its current interface is powered by a local Taskify NeoPOP compatibility layer, a resilient board engine, and a public interactive demo that can be explored without an account or database writes.

| Move | What it feels like |
| --- | --- |
| **Capture** | Add a task without leaving the board or breaking focus. |
| **Shape** | Open a focused task panel, clarify the outcome, and choose its lane. |
| **Move** | Drag cards and lists with immediate feedback and explicit save state. |
| **Find** | Search the board and switch between spatial Board and focused List views. |
| **Recover** | Roll back failed optimistic changes and refresh safely after reconnecting. |

<details>
<summary><strong>What works today</strong></summary>

- Authenticated Clerk organizations and workspace navigation
- Boards, lists, tasks, descriptions, ordering, deletion, and audit history
- Cross-list and list-level drag with optimistic queues and rollback
- Order-version conflict detection and serializable database transactions
- Clerk-authenticated private Supabase Realtime invalidation with reconnect reconciliation
- Board and List modes, search, URL-backed task deep links, and responsive mobile navigation
- Stripe subscription entry points and organization billing/settings surfaces
- A local-only `/demo` experience with realistic data and zero persistence
- A custom dark Taskify NeoPOP system with sharp geometry, semantic state colors, and reduced-motion support

</details>

<details>
<summary><strong>What is intentionally next</strong></summary>

- Assignees, due dates, labels, and comments remain deferred
- Attachment UI with private Supabase Storage upload, download, and delete flows
- Board/task Presence (cursors are intentionally deferred)
- Dedicated two-browser conflict, reconnect, RLS, and storage-authorization proof

</details>

## Designed For Momentum

Taskify's visual system is a local React 19-compatible adaptation of NeoPOP rather than a theme layered over generic controls. The interface uses a `#0D0D0D` canvas, sharp zero-radius surfaces, 3 px / 45-degree plunk edges, 120 ms press motion, visible keyboard focus, and reduced-motion fallbacks.

| Product state | Visual role |
| --- | --- |
| **Next move** | Yellow marks the primary action and immediate opportunity. |
| **Active work** | Blue carries focus, selection, and work in motion. |
| **Progress** | Green confirms healthy, live, and completed states. |
| **Celebration** | Pink is reserved for meaningful milestones. |
| **Failure** | Red is reserved for destructive actions and explicit errors. |

The component authority lives in `components/neopop/`; product compositions live in `app/globals.css`. CRED's Apache-2.0 source is pinned and attributed in `THIRD_PARTY_NOTICES.md`. Taskify keeps its own brand, copy, information architecture, and geometry.

| Typography role | Runtime face | Use |
| --- | --- | --- |
| **UI and body** | Urbanist variable, standing in for Gilroy | Navigation, controls, dense board content, and long-form copy |
| **Display** | Urbanist variable, standing in for Gilroy | Product headings with compact tracking and strong weight |
| **Editorial display** | Libre Bodoni variable, standing in for Cirka | Oversized campaign and marketing statements |

The role mapping follows the shared Phase V-0 NeoPOP foundations contract. Gilroy and Cirka remain the target faces, but their commercial binaries are not redistributed in this public repository. Urbanist and Libre Bodoni provide license-safe, locally self-hosted Next.js fallbacks until licensed webfont files are supplied.

## Built To Move

The board does not pretend a request succeeded. Every mutation travels through one authenticated command boundary, checks workspace ownership, validates the expected ordering version, and returns a canonical board snapshot.

```mermaid
sequenceDiagram
    participant P as Person
    participant UI as Optimistic board
    participant A as Board command
    participant DB as PostgreSQL

    P->>UI: Move a task
    UI->>UI: Render the new position now
    UI->>A: Command + expected order version
    A->>DB: Serializable transaction
    alt accepted
        DB-->>A: Canonical board snapshot
        A-->>UI: Confirm and drain next command
    else conflict or failure
        A-->>UI: Explicit error
        UI->>UI: Roll back to last confirmed board
    end
```

That gives Taskify the speed of a local interaction with the honesty of a server-confirmed state.

## Two Views, One Context

The same project can be scanned spatially or read sequentially. Search state and open-task state live in the URL, so a teammate can share the exact context instead of describing where to click.

<div align="center">
  <img src="./public/readme/board-mobile.png" width="390" alt="Taskify board on a mobile viewport" />
</div>

## How It Holds Together

```mermaid
flowchart LR
    Browser[Next.js App Router UI] --> Clerk[Clerk identity + organizations]
    Browser --> Actions[Authenticated Server Actions]
    Actions --> Guard[Ownership + Zod validation]
    Guard --> Prisma[Prisma transaction layer]
    Prisma --> Postgres[(PostgreSQL)]
    Actions --> Audit[Audit log]

    Postgres -->|row-change triggers| Realtime[Private Supabase Realtime Broadcast]
    Clerk -->|session JWT| Realtime
    Realtime -->|board invalidation| Browser
    Browser -. attachment UI next .-> Storage[Private Supabase Storage bucket]
```

| Layer | Choice | Why |
| --- | --- | --- |
| Product shell | Next.js 16 App Router + React 19 | Server rendering, colocated routes, and server-side mutation boundaries |
| Visual language | Taskify NeoPOP compatibility layer | CRED NeoPOP geometry adapted locally for React 19, Next.js 16, and Taskify semantics |
| Identity | Clerk organizations | Existing team, invitation, and workspace model |
| Data | Prisma 5 + PostgreSQL | Typed relations and transactional ordering |
| Motion | `@hello-pangea/dnd` + CSS motion tokens | Accessible drag primitives, 120 ms press feedback, and reduced-motion support |
| Billing | Stripe | Existing subscription and billing portal flow |
| Collaboration | Supabase Realtime + Storage | Private live invalidation now; Presence and attachment UI next |

The local NeoPOP layer is adapted from CRED's Apache-2.0 `@cred/neopop-web` source at pinned commit `1f4b3d2`. Taskify keeps its own brand, copy, information architecture, and geometric compositions. Gilroy and Cirka are the target typography roles; until licensed local font files are supplied, the runtime uses Urbanist and Libre Bodoni fallbacks. Exact font parity is intentionally not claimed yet.

## Run It Locally

### 1. Prerequisites

- [Node.js 24 LTS](https://nodejs.org/en/about/previous-releases) (`24.19.0` for this checkout)
- npm
- PostgreSQL
- Clerk application credentials
- Supabase project URL and publishable key

The supported runtime is pinned to Node `24.19.0` in `.nvmrc` and `.node-version`, with the allowed LTS major enforced by `package.json`. `engine-strict=true` prevents installing dependencies under the wrong major version. On Windows, use `fnm` side-by-side instead of uninstalling a machine-wide Node version: switching applies to the current shell, so existing projects and their installed packages remain untouched.

### 2. Install

```powershell
git clone https://github.com/pankajverma2108/next-Taskify.git
cd next-Taskify

winget install --id Schniz.fnm --exact
# Reopen PowerShell once after the first fnm installation.
fnm env --shell powershell | Out-String | Invoke-Expression
fnm install 24.19.0
fnm use 24.19.0

node --version  # must print v24.19.0
npm install
```

The machine-wide Node installation is not downgraded. Open a separate terminal or run `fnm use system` when another project needs the existing system runtime.

### 3. Configure

Copy `.env.example` to `.env` and fill the values you use:

| Variable | Required for |
| --- | --- |
| `DATABASE_URL` | Prisma and PostgreSQL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk browser integration |
| `CLERK_SECRET_KEY` | Clerk server authorization |
| `STRIPE_API_KEY` | Subscription checkout and portal |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification |
| `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` | Optional board-cover discovery |
| `NEXT_PUBLIC_SUPABASE_URL` | Realtime and Storage client |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser-safe Supabase project access |
| `SUPABASE_PROJECT_REF` | Optional Supabase CLI project linkage |
| `NEXT_PUBLIC_APP_URL` | Redirect and application URLs |

Never commit `.env` files or service-role credentials.

### 4. Prepare and start

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

`npm run dev` runs a development preflight before starting Next.js. It requires Node 24, at least 1 GiB of free physical memory, and an available port 3000. It then starts exactly one compiler on `http://localhost:3000`; it will not silently create a second server on port 3001.

Open `http://localhost:3000/demo` for the zero-write interactive board, or create an account to use a database-backed workspace.

## Useful Commands

```bash
npm run dev          # guarded Turbopack development server on port 3000
npm run dev:check    # run the Node, memory, and port preflight only
npm run dev:webpack  # guarded Webpack fallback for Turbopack-specific diagnosis
npm run lint         # ESLint
npm run typecheck    # TypeScript without emitting files
npm run build        # optimized production build
npm run db:seed      # seed a local database when needed
npx supabase db push --dry-run --linked  # preview pending cloud migrations
```

### Development server troubleshooting

If the preflight reports that port 3000 is occupied, an earlier dev server is still running. Inspect the listener before stopping anything:

```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen | Select-Object OwningProcess
Get-CimInstance Win32_Process -Filter "ProcessId=<PID>" | Select-Object ProcessId,CommandLine
```

Stop only the process you recognize, then rerun `npm run dev`. If the preflight reports low memory, close stale dev servers, browser automation, or other memory-heavy tools first. A PostCSS/Turbopack message that says `Node.js subprocess crashed` after a V8 out-of-memory error means the loader worker died; it does not by itself prove that `app/globals.css` is invalid.

Use `npm run dev:webpack` only after Node, memory, and port checks pass. It is a diagnostic fallback, not a reason to leave duplicate servers running. `TASKIFY_ALLOW_LOW_MEMORY=1` bypasses only the 1 GiB guard and should be used only when the OOM risk is understood.

## Project Map

```text
app/                    routes, layouts, marketing, demo, workspace surfaces
actions/                authenticated server actions and board command boundary
components/board/       board, list, task editor, and demo adapters
components/neopop/      Taskify-owned NeoPOP primitives, tokens, and SSR style registry
hooks/                  client collaboration and product hooks
scripts/                development runtime and resource preflight checks
lib/board-model.ts      serializable board contract and pure move logic
lib/board-data.ts       authorized Prisma board reader
lib/supabase/           Clerk-token Supabase browser client
.21st/                  local design context for UI work
THIRD_PARTY_NOTICES.md  NeoPOP source attribution and license note
prisma/                 PostgreSQL schema and migrations
supabase/               private Realtime, Storage, and RLS configuration
public/readme/          verified product captures used by this README
```

## Quality Bar

The current milestone passes:

- ESLint
- TypeScript type checking
- Next.js production build
- Supabase database lint and linked migration parity
- Production dependency audit with zero known vulnerabilities
- Desktop and mobile browser inspection
- Search, view switching, task create/edit, and cross-list pointer drag flows
- Guarded single-server development compilation on Node 24 LTS

## The Next Move

The collaboration foundation is live. The remaining product slice expands what teammates can coordinate:

1. Add attachment metadata and resumable private upload, download, and delete UI on the provisioned bucket.
2. Add board/task Presence to private channels; teammate cursors remain intentionally deferred.
3. Prove two-user/outsider two-browser Broadcast, conflict, reconnect, RLS, and storage-policy behavior end to end.
4. Add accessibility automation, performance budgets, and hosted-environment verification.

Assignees, due dates, labels, and comments remain intentionally deferred until this collaboration slice is proven.

---

<div align="center">

**Less noise. More flow.**

Built for teams with more ideas than ceremony.

</div>
