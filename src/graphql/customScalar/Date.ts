import {GraphQLDateTime} from 'graphql-scalars';
import {asNexusMethod} from 'nexus'

export const GrphDate = asNexusMethod(GraphQLDateTime,"dateTime")