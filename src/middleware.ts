import { NextFunction, Request, Response } from "express";

export const checkForIp = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.ip);
  next();
};
