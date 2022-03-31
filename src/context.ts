import { PrismaClient } from "@prisma/client";
import { Request } from "express"; 
import AuthService from "./utils/AuthService";

const authService=new AuthService()

export const prisma = new PrismaClient();


export interface Context{
    prisma:PrismaClient,
    userId?:number
}

export const context=({req}:{req:Request}):Context=>{
    const token =
        req && req.headers.authorization
            ? authService.decodeAuthHeader(req.headers.authorization)
            : null;

    return {  
        prisma,
        userId: token?.userId, 
    };
}