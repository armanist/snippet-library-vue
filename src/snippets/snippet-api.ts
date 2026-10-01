import type { FindSnippetsResult, Snippet, SnippetDraft } from './snippet'

export class SnippetApi {
  private readonly apiBaseUrl = 'http://localhost:3000'

  async getAll(): Promise<FindSnippetsResult> {
    const response = await fetch(`${this.apiBaseUrl}/snippets`)

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

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/snippets/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Failed to delete snippet (${response.status})`)
    }
  }
}
