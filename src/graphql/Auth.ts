import {
  extendType,
  inputObjectType,
  objectType,
  nonNull,
  stringArg,
} from "nexus";
import AuthService from "../utils/AuthService";

const authService = new AuthService();

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.nonNull.string("token");
    t.nonNull.field("user", {
      type: "User",
    });
  },
});

export const CreateUserInput = inputObjectType({
  name: "CreateUserInput",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.string("password");
  },
});

export const SignUp = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signup", {
      type: "AuthPayload",
      args: { data: CreateUserInput },
      async resolve(parent, args, { prisma }, info) {
        //@ts-ignore
        const password = await authService.hashpassword(args.data.password);
        //@ts-ignore
        const user = await prisma.user.create({
          data: { ...args.data, password },
        });

        return {
          token: authService.signToken(user.id),
          user,
        };
      },
    });
  },
});

export const Login = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("login", {
      type: "AuthPayload",
      args: { email: nonNull(stringArg()), password: nonNull(stringArg()) },
      async resolve(parent, args, { prisma }, info) {
        const { email, password } = args;
        const user = await prisma.user.findUnique({ where: { email: email } });

        if (!user) {
          throw new Error("Unauthorizeted !!");
        }

        const isMatch = await authService.comparePassword(
          password,
          user.password
        );

        if (!isMatch) {
          throw new Error("Unauthorizeted !!");
        }

        return {
          token: authService.signToken(user.id),
          user,
        };
      },
    });
  },
});
