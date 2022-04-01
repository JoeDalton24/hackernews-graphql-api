import { Prisma } from "@prisma/client";
import { objectType, extendType, inputObjectType, stringArg, intArg,enumType, arg, list, nonNull } from "nexus";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
    t.nonNull.dateTime("createdAt")
    t.nonNull.field("User", {
      type: "User",
      //@ts-ignore
      resolve(parent, args, { prisma }, info) {
        return prisma.link.findUnique({ where: { id: parent.id } }).User();
      },
    });
    t.nonNull.list.nonNull.field("voters",{
      type:"User",
      resolve(parent,args,{prisma},info){
        return prisma.link.findUnique({where:{id:parent.id}}).voters()
      }
    })
  },
});

export const Feed=objectType({
  name:"Feed",
  definition(t){
    t.nonNull.list.nonNull.field("links",{type:"Link"});
    t.nonNull.int("count")
  }
})

export const CreateLinkInput = inputObjectType({
  name: "CreateLinkInput",
  definition(t) {
    t.nonNull.string("description");
    t.nonNull.string("url");
  },
});

export const LinkOrderByInput = inputObjectType({
  name: "LinkOrderByInput",
  definition(t) {
      t.field("description", { type: Sort });
      t.field("url", { type: Sort });
      t.field("createdAt", { type: Sort });
  },
});

export const Sort = enumType({
  name: "Sort",
  members: ["asc", "desc"],
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feed", {
      type: "Feed",
      args:{
        filter:stringArg(),
        skip:intArg(),
        take:intArg(),
        orderBy:arg({type:list(nonNull(LinkOrderByInput))})
      },
      //@ts-ignore
      async resolve(parent, args, { prisma }, info) {

        const optionArgs=args.filter?{
          where:{
            OR:[
              //@ts-ignore
              {description:{contains:args.filter}},
              //@ts-ignore
              {url:{contains:args.filter}},
            ]
          }
        }:{}
        //@ts-ignore
        const links= await prisma.link.findMany({
          ...optionArgs,
          skip:args?.skip as number || 0,
          take:args?.take as number || 10,
          orderBy: args?.orderBy as Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput> | undefined,
        });
        //@ts-ignore
        const count = await prisma.link.count({...optionArgs}); 

        return{
          links,
          count
        }
      },
    });
  },
});

export const LinkMutation = extendType({
  // 1
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createPost", {
      // 2
      type: "Link",
      args: { data: CreateLinkInput },
      //@ts-ignore
      resolve(parent, args, { prisma, userId }, info) {
        if (!userId) {
          throw new Error("Require Authentification");
        }
        //@ts-ignore
        return prisma.link.create({
          //@ts-ignore
          data: { ...args.data, User: { connect: { id: userId } } },
        });
      },
    });
  },
});
