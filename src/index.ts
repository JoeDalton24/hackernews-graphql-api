import {ApolloServer} from 'apollo-server'
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

import { context } from './context';
import { schema } from './schema'
import { PORT } from '../config/config'


const server=new ApolloServer({
    schema,
    context,
    introspection:true,
    plugins:[ApolloServerPluginLandingPageLocalDefault()]
})

server.listen(PORT||5000,()=>{
    console.log('server is running')
})