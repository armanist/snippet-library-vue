import type { FindSnippetsResult } from './snippet'

export class SnippetApi {
  private readonly apiBaseUrl = 'http://localhost:3000'

  async getAll(): Promise<FindSnippetsResult> {
    const response = await fetch(`${this.apiBaseUrl}/snippets`)

    if (!response.ok) {
      throw new Error(`Failed to load snippets (${response.status})`)
    }

    return (await response.json()) as FindSnippetsResult
  }
}
