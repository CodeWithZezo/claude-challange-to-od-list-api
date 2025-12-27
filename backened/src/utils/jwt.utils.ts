import jwt from "jsonwebtoken";
import { JWTPayload } from "../types/auth.types";
import { authConfig } from "../config/auth.config";

export class JWTUtils {
  static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, authConfig.jwt.accessTokenSecret, {
      expiresIn: authConfig.jwt.accessTokenExpiry,
    });
  }

  static generateRefreshToken(payload: JWTPayload):string{
    return jwt.sign(payload,authConfig.jwt.refreshTokenSecret,{
        expiresIn:authConfig.jwt.refreshTokenExpiry,
    })
  }

  static verifyAcessToken(token: string):JWTPayload{
    return jwt.verify(token, authConfig.jwt.accessTokenSecret) as JWTPayload;
  }

  static verifyRefreshToken(token:string):JWTPayload {
    return jwt.verify(token, authConfig.jwt.refreshTokenSecret) as JWTPayload;
  }
}


