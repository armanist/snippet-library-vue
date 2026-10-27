# Snippet Library - Vue

A Vue 3 frontend for creating, finding, editing, and deleting code snippets.

## Features

- Create, edit, and delete snippets.
- Search snippets by title, language, code, and tags.
- Browse paginated results, ordered newest first.
- Receive success and error notifications.
- Confirm deletions in a dialog.
- Talks to the API through REST or GraphQL, selected with one setting.

## Requirements

- Node.js `^22.18.0` or `>=24.12.0`.
- The Snippet Library API running at `http://localhost:3000`.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Start the API separately before using the app.

## Choose the API transport

The app can use the REST or the GraphQL endpoints of the API. Set it in `.env.development` (used by `npm run dev`) or `.env.production` (used by `npm run build`):

```sh
VITE_SNIPPET_TRANSPORT=graphql
```

Allowed values are `rest` and `graphql`. Restart `npm run dev` after changing it.

## Regenerate GraphQL types

With the API running:

```sh
npm run codegen
```

This reads the API schema and writes `src/snippets/graphql/generated.ts`. Do not edit that file by hand.

## Verify

```sh
npm run type-check
npm run build
```

Built with Vue 3, TypeScript, Vite, and Tailwind CSS.
