import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDb, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { todosRouter } from "./modules/todos/todos.router";
import { authRouter } from "./modules/auth/auth.router";

const app = express();
const port = config.port;
//parser
app.use(express.json());
// app.use(express.urlencoded());

initDb();

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello sadman!");
});

//users CRUD
app.use("/users", logger, userRoutes);

//todo CRUD
app.use("/todos", logger, todosRouter);

//auth
app.use("/auth",logger,authRouter);

app.use(logger, (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
