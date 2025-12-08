import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";

//logger
const filePath = path.join(process.cwd(), "./src/logger.txt");
const logger = (req: Request, res: Response, next: NextFunction) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.path} \n`;
  fs.appendFile(filePath, log, (err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Log added successfully");
      console.log(log);
    }
  });
  next();
};
export default logger;