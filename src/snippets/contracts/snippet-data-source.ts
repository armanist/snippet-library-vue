import type {
    FindSnippetsResult,
    Snippet,
    SnippetDraft,
    SnippetListQuery,
    SnippetUpdate,
} from '../snippet'

export interface SnippetDataSource {
    getAll(query: SnippetListQuery, signal?: AbortSignal): Promise<FindSnippetsResult>
    create(draft: SnippetDraft): Promise<Snippet>
    update(id: string, changes: SnippetUpdate): Promise<Snippet>
    delete(id: string): Promise<void>
}