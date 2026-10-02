# Snippet Library - Vue

A Vue 3 frontend for creating, finding, editing, and deleting code snippets.

## Features

- Create, edit, and delete snippets.
- Search snippets by title, language, code, and tags.
- Browse paginated results, ordered newest first.
- Receive success and error notifications.
- Confirm deletions in a dialog.

## Requirements

- Node.js `^22.18.0` or `>=24.12.0`.
- The Snippet Library API running at `http://localhost:3000`.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Start the API separately before using the app.

## Verify

```sh
npm run type-check
npm run build
```

Built with Vue 3, TypeScript, Vite, and Tailwind CSS.
