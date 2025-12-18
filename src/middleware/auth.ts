import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.headers.authorization;

    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Please Login first",
      });
    }

    const decode = jwt.verify(token, config.jwt_secret as string);
    req.user = decode as JwtPayload;

    console.log({ decode: decode });

    next();
        
    } catch (error: any) {

        res.status(500).json({
            success: false,
            message: error.message
        })
        
    }
    
  };
};

export default auth;
