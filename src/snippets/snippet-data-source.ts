import type { SnippetDataSource } from "./contracts/snippet-data-source"
import { SnippetRestApi } from "./snippet-rest-api"
import { SnippetGraphqlApi } from "./snippet-graphql-api"

export const SNIPPET_DATA_SOURCE: SnippetDataSource = 
    import.meta.env.VITE_SNIPPET_TRANSPORT === 'graphql' 
    ? new SnippetGraphqlApi()
    : new SnippetRestApi()
