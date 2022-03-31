import { objectType, extendType, inputObjectType } from "nexus";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
    t.nonNull.field("postedBy", {
      type: "User",
      resolve(parent, args, { prisma }, info) {
        console.log(parent);
        return prisma.link.findUnique({ where: { id: parent.id } }).postedBy();
      },
    });
  },
});

export const CreateLinkInput = inputObjectType({
  name: "CreateLinkInput",
  definition(t) {
    t.nonNull.string("description");
    t.nonNull.string("url");
  },
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      resolve(parent, args, { prisma }, info) {
        return prisma.link.findMany();
      },
    });
  },
});

export const LinkMutation = extendType({
  // 1
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
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
          data: { ...args.data, postedBy: { connect: { id: userId } } },
        });
      },
    });
  },
});
