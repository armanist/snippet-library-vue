import type { SnippetDataSource } from "./contracts/snippet-data-source"
import { SnippetApi } from "./snippet-api"
import { SnippetGraphqlApi } from "./snippet-graphql-api"

export const SNIPPET_DATA_SOURCE: SnippetDataSource = 
    import.meta.env.VITE_SNIPPET_TRANSPORT === 'graphql' 
    ? new SnippetGraphqlApi()
    : new SnippetApi()
