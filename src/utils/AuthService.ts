//@ts-ignore
import bcrypt from "bcryptjs";
//@ts-ignore
import jwt from "jsonwebtoken";
import { ACCES_TOKEN } from "../../config/config";

export interface AuthTokenPayload {
  userId: number;
}

class AuthService {
  constructor() {}

  async hashpassword(password: string) {
    if (typeof password !== "string" || password.length < 8) {
      throw new Error("Invalid Input");
    }
    return bcrypt.hash(password, 10);
  }

  async signToken(userId: number) {
    if (typeof userId !== "number") {
      throw new Error("Invalid Input");
    }
    const expiresIn = "7 days";
    return jwt.sign({ userId }, ACCES_TOKEN, { expiresIn });
  }

  async comparePassword(providedPassword: string, storedPassword: string) {
    if (
      typeof providedPassword !== "string" ||
      typeof storedPassword !== "string"
    ) {
      throw new Error("Invalid Input");
    }
    return bcrypt.compare(providedPassword, storedPassword);
  }

  decodeAuthHeader(authHeader: String): AuthTokenPayload {
    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new Error("Unautorizeted connection !!");
    }

    return jwt.verify(token, ACCES_TOKEN) as AuthTokenPayload;
  }
}

export default AuthService;
