import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { GET_SNIPPETS_QUERY } from "./graphql/snippet-queries"
import { API_BASE_URL } from "@/api-config"
import { 
    CREATE_SNIPPET_MUTATION, 
    DELETE_SNIPPET_MUTATION, 
    UPDATE_SNIPPET_MUTATION 
} from "./graphql/snippet-mutations";
import type {
    FindSnippetsResult,
    Snippet,
    SnippetDraft,
    SnippetListQuery,
    SnippetUpdate
} from "./snippet"
import type { SnippetDataSource } from "./contracts/snippet-data-source";

export class SnippetGraphqlApi implements SnippetDataSource {
    private readonly apiBaseUrl = API_BASE_URL;

    private readonly client = new ApolloClient({
        link: new HttpLink({ uri: `${this.apiBaseUrl}/graphql` }),
        cache: new InMemoryCache()
    })

    async getAll(query: SnippetListQuery = {}, signal?: AbortSignal): Promise<FindSnippetsResult> {
        const result = await this.client.query<{ snippets: FindSnippetsResult }>({
            query: GET_SNIPPETS_QUERY,
            variables: {
                search: query.search,
                page: query.page,
                limit: query.limit,
            },
            fetchPolicy: 'network-only',
            context: { fetchOptions: { signal } }
        })

        return result.data!.snippets
    }

    async create(draft: SnippetDraft): Promise<Snippet> {
        const result = await this.client.mutate<{ createSnippet: Snippet }>({
            mutation: CREATE_SNIPPET_MUTATION,
            variables: { input: draft }
        })

        return result.data!.createSnippet
    }

    async update(id: string, changes: SnippetUpdate): Promise<Snippet> {
        const result = await this.client.mutate<{ updateSnippet: Snippet }>({
            mutation: UPDATE_SNIPPET_MUTATION,
            variables: { id, input: changes },
        })

        return result.data!.updateSnippet
    }

    async delete(id: string): Promise<void> {
        await this.client.mutate<{ deleteSnippet: string }>({
            mutation: DELETE_SNIPPET_MUTATION,
            variables: { id }
        })
    }

}