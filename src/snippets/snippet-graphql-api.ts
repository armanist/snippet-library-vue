import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { GET_SNIPPETS_QUERY } from "./graphql/snippet-queries"
import type { FindSnippetsResult, SnippetListQuery } from "./snippet"
import { API_BASE_URL } from "@/api-config"

export class SnippetGraphqlApi {
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

}