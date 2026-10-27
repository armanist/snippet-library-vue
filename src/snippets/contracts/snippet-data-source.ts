import type { SnippetDraft } from './create-snippet'
import type { FindSnippetsResult, SnippetListQuery } from './find-snippet'
import type { Snippet } from './snippet'
import type { SnippetUpdate } from './update-snippet'

export interface SnippetDataSource {
    getAll(query: SnippetListQuery, signal?: AbortSignal): Promise<FindSnippetsResult>
    create(draft: SnippetDraft): Promise<Snippet>
    update(id: string, changes: SnippetUpdate): Promise<Snippet>
    delete(id: string): Promise<void>
}