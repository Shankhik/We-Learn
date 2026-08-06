import type { JwtPayload } from "jsonwebtoken"
import { ObjectId } from "mongodb";

export interface SignupToken extends JwtPayload {
    sessionId: string
}

export interface AuthToken extends JwtPayload {
    _id?: ObjectId | string;
    admin?: boolean;
    username?: string;
}