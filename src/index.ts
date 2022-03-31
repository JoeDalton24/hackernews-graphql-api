import {ApolloServer} from 'apollo-server'
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import { context } from './context';
import { schema } from './schema'
import { PORT } from '../config/config'


const server=new ApolloServer({
    schema,
    context,
    plugins:[ApolloServerPluginLandingPageGraphQLPlayground()]
})

server.listen(PORT||5000,()=>{
    console.log('server is running')
})