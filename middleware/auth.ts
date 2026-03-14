import { NextFunction, Request, Response } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import { User } from "../generated/prisma/client";
import Prisma from "../lib/prisma";

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(403).json({
        message: "Token header missing.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(403).json({
        message: "Token not provided.",
      });
    }

    const decodedToken = verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const existingUser = await Prisma.user.findUnique({
      where: { id: decodedToken.id },
    });

    if (!existingUser) {
      return res.status(403).json({
        message: "User not found",
      });
    }

    req.user = existingUser;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Error while authorizing the token.",
    });
  }
};
