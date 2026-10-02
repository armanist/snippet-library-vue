import type {
  FindSnippetsResult,
  Snippet,
  SnippetDraft,
  SnippetListQuery,
  SnippetUpdate,
} from './snippet'

export class SnippetApi {
  private readonly apiBaseUrl = 'http://localhost:3000'

  async getAll(query: SnippetListQuery = {}, signal?: AbortSignal): Promise<FindSnippetsResult> {
    const url = new URL(`${this.apiBaseUrl}/snippets`)

    if (query.search !== undefined) {
      url.searchParams.set('search', query.search)
    }

    if (query.page !== undefined) {
      url.searchParams.set('page', String(query.page))
    }

    if (query.limit !== undefined) {
      url.searchParams.set('limit', String(query.limit))
    }

    const response = await fetch(url, { signal })

    if (!response.ok) {
      throw new Error(`Failed to load snippets (${response.status})`)
    }

    return (await response.json()) as FindSnippetsResult
  }

  async create(draft: SnippetDraft): Promise<Snippet> {
    const response = await fetch(`${this.apiBaseUrl}/snippets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(draft),
    })

    if (!response.ok) {
      throw new Error(`Failed to create snippet (${response.status})`)
    }

    return (await response.json()) as Snippet
  }

  async update(id: string, changes: SnippetUpdate): Promise<Snippet> {
    const response = await fetch(`${this.apiBaseUrl}/snippets/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(changes),
    })

    if (!response.ok) {
      throw new Error(`Failed to update snippet (${response.status})`)
    }

    return (await response.json()) as Snippet
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/snippets/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Failed to delete snippet (${response.status})`)
    }
  }
}
