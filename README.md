# Snippet Library - Vue

A Vue 3 frontend for saving, finding, editing, and deleting small code snippets. It talks to the Snippet Library Express API through either REST or GraphQL, selected with one setting.

## Features

- Create, edit, and delete snippets with a title, language, code, and comma-separated tags.
- Search snippets by title, language, code, and tags. Search is debounced and cancels stale requests.
- Browse paginated results, ordered newest first.
- Confirm deletions in a dialog.
- See success and error notifications.
- Switch between the REST and GraphQL transports without changing any component code.

## Tech stack

- Vue 3 (`<script setup>`, composables) and TypeScript
- Vite and Tailwind CSS
- Apollo Client for GraphQL, `fetch` for REST
- GraphQL Code Generator for operation types

## Requirements

- Node.js `^22.18.0` or `>=24.12.0`
- The Snippet Library API running at `http://localhost:3000`. See the API's README for setup. It allows requests from `http://localhost:5173`, which is the Vite dev server address.

## Quick start

1. Start the API (from the API project):

   ```sh
   npm run dev
   ```

2. Start this app:

   ```sh
   npm install
   npm run dev
   ```

3. Open `http://localhost:5173`.

## Configuration

The only setting is the transport the app uses to talk to the API. It is read from a Vite env file:

| File | Used by |
| --- | --- |
| `.env.development` | `npm run dev` |
| `.env.production` | `npm run build` |

```sh
VITE_SNIPPET_TRANSPORT=graphql
```

Allowed values are `rest` and `graphql`. Restart `npm run dev` after changing it. The API address is set in `src/api-config.ts`.

Do not put secrets in these files. Values starting with `VITE_` are embedded in the browser bundle. Personal overrides belong in `*.local` files, which are ignored by Git.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check, then build for production |
| `npm run preview` | Serve the production build locally |
| `npm run type-check` | Type-check the project with `vue-tsc` |
| `npm run lint` | Run oxlint and ESLint with fixes |
| `npm run format` | Format `src/` with Prettier |
| `npm run codegen` | Regenerate GraphQL types (needs the API running) |

## How it is organized

```text
src/
  App.vue                        Page layout: form panel, list panel, toast, dialog
  api-config.ts                  API base URL
  shared/
    toast/                       Toast.vue, use-toast.ts
    confirm-dialog/              ConfirmDialog.vue, use-confirm-dialog.ts
  snippets/
    contracts/                   Types, and the SnippetDataSource interface
    services/                    REST and GraphQL data sources, transport selection,
                                 and the "snippets changed" signal
    graphql/                     Query and mutation documents, generated types
    snippet-list/                SnippetList.vue (search, cards, pagination),
                                 SnippetCard.vue, Pagination.vue, use-snippet-list.ts
    snippet-form/                SnippetForm.vue, use-snippet-form.ts (create and edit)
    snippet-delete/              use-snippet-delete.ts
```

## How it works

### One contract, two transports

Every component and composable talks to a `SnippetDataSource` (`getAll`, `create`, `update`, `delete`). Two classes implement it: `SnippetRestApi` and `SnippetGraphqlApi`. `src/snippets/services/snippet-data-source.ts` is the single place that reads `VITE_SNIPPET_TRANSPORT` and picks one. Nothing else knows which transport is active.

### Each responsibility has one home

| Unit | Responsibility |
| --- | --- |
| `useSnippetList` | Loads snippets for the current search term and page, with debounce and request cancellation. Corrects the page if it no longer exists. |
| `useSnippetForm` | Which snippet is being edited, and saving (create or update). |
| `useSnippetDelete` | The delete confirmation dialog and the delete itself. |
| `useToast` | The notification message and type, shared across the app. |

`App.vue` only wires these units to the template.

### Keeping the list up to date

After a snippet is created, updated, or deleted, the form and delete units call `notifySnippetChanges()` from `snippet-changes.ts`. The list watches that signal and reloads itself. No unit calls another unit directly, so the form and delete logic never depend on the list.

## GraphQL types

The types in `src/snippets/graphql/generated.ts` are generated from the API schema and the operation documents in `src/snippets/graphql/`. With the API running:

```sh
npm run codegen
```

Do not edit the generated file by hand. Run the command again whenever the schema or an operation document changes.

## Notes

- The page size is 2 snippets, set in `use-snippet-list.ts`.
- The REST and GraphQL transports return the same data, so switching between them should not change what you see.
