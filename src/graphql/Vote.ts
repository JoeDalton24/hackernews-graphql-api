// un vote est lier a un seul link

import {objectType,extendType,intArg, nonNull} from "nexus";
import { User } from "@prisma/client";

export const Vote=objectType({
    name:"Vote",
    definition(t){
        t.nonNull.field("link",{
            type:"Link",
        })
        t.nonNull.field("voter",{
            type:"User",
        })
    }
})

export const CreateVote=extendType({
    type:"Mutation",
    definition(t){
        t.field("vote", {
            type: "Vote",
            args: {
                linkId: nonNull(intArg()),
            },
            async resolve(parent,args,{prisma,userId},info){
                if(!userId){
                    throw new Error("Authentification Required!!")
                }

                const link = await prisma.link.update({
                    where:{
                        id:args.linkId
                    },
                    data:{
                        voters:{
                            connect:{
                                id:userId
                            }
                        }
                    }
                })
                console.log(link)
                const user = await prisma.user.findUnique({where:{id:userId}});

                return {
                    link,
                    voter:user as User
                }
            }
        })
    }
})