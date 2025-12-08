import Router from "express";
import { todoController } from "./todos.controller";

const router = Router();

router.post("/", todoController.createTodo);
router.get("/", todoController.getTodos);
router.get("/:id", todoController.getTodosById);
router.get("/user/:id", todoController.getTodosByUser);
router.put("/:id", todoController.editTodo);
router.delete("/:id", todoController.deleteTodo);

export const todosRouter = router;
