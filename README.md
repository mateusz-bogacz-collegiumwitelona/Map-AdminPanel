# Map-AdminPanel

Admin panel for the Map platform.

## Tech stack

- [Vite](https://vite.dev) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4 + [shadcn/ui](https://ui.shadcn.com) + [Lucide](https://lucide.dev) icons
- [React Router](https://reactrouter.com) for routing
- [Axios](https://axios-http.com) for HTTP
- [TanStack Query](https://tanstack.com/query) and [TanStack Table](https://tanstack.com/table) for the data layer
- [Prettier](https://prettier.io) (with `prettier-plugin-tailwindcss`) and [oxlint](https://oxc.rs) for code quality

## Getting started

Requires Node.js 24 (see `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # then adjust VITE_API_BASE_URL
npm run dev
```

## Scripts

| Script                 | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start the dev server                 |
| `npm run build`        | Type-check and build for production  |
| `npm run typecheck`    | Type-check only                      |
| `npm run lint`         | Lint with oxlint                     |
| `npm run format`       | Format all files with Prettier       |
| `npm run format:check` | Check formatting (used in CI)        |
| `npm run preview`      | Preview the production build locally |

## Environment variables

| Variable            | Description                 |
| ------------------- | --------------------------- |
| `VITE_API_BASE_URL` | Base URL of the backend API |

`VITE_*` variables are embedded into the client bundle at build time, so never put secrets in them.

## Project structure

```
src/
  components/      app components (sidebar, ...)
    ui/            shadcn/ui components (add more with `npx shadcn@latest add <name>`)
  hooks/           shared React hooks
  layouts/         route layouts
  lib/             axios instance, query client, utilities
  pages/           route pages
  providers/       app-wide React providers
  router.tsx       route definitions
```
