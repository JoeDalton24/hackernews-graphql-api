import {makeSchema} from 'nexus'
import * as types from './graphql'
import {join} from 'path'


export const schema=makeSchema({
    types,
    outputs:{
        schema: join(process.cwd(),'schema.graphql'),
        typegen: join(process.cwd(),'nexus-typegen.ts'),
    },
    contextType:{
        module:join(process.cwd(),"src/context.ts"),
        export:"Context"
    }
})