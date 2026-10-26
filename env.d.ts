/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SNIPPET_TRANSPORT: 'rest' | 'graphql'
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}