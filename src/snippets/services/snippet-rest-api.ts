import { API_BASE_URL } from '@/api-config'
import type { SnippetDataSource } from '../contracts/snippet-data-source'
import type { SnippetDraft } from '../contracts/create-snippet'
import type { FindSnippetsResult, SnippetListQuery } from '../contracts/find-snippet'
import type { Snippet } from '../contracts/snippet'
import type { SnippetUpdate } from '../contracts/update-snippet'

export class SnippetRestApi implements SnippetDataSource {
  private readonly apiBaseUrl = API_BASE_URL

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

    await this.throwIfFailed(response, 'Failed to load snippets')

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

    await this.throwIfFailed(response, 'Failed to create snippet')

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

    await this.throwIfFailed(response, 'Failed to update snippet')

    return (await response.json()) as Snippet
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/snippets/${id}`, {
      method: 'DELETE',
    })

    await this.throwIfFailed(response, 'Failed to delete snippet')
  }

  private async throwIfFailed(response: Response, fallbackMessage: string): Promise<void> {
    if (response.ok) {
      return
    }

    const body: unknown = await response.json().catch(() => null)

    const message =
      typeof body === 'object' && body !== null && 'message' in body
        ? [body.message].flat().join('; ')
        : `${fallbackMessage} (${response.status})`

    throw new Error(message)
  }
}
