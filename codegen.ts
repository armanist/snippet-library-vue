import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    schema: 'http://localhost:3000/graphql',
    documents: ['src/snippets/graphql/snippet-*.ts'],
    generates: {
        'src/snippets/graphql/generated.ts': {
            plugins: ['typescript-operations'],
            config: {
                scalars: {
                    DateTime: 'string',
                },
            },
        },
    },
}

export default config
