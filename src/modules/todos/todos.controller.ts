import { Request, Response } from "express";
import { todosService } from "./todos.service";

const createTodo = async (req: Request, res: Response) => {
  const todo = req.body;
  console.log(todo);
  try {
    const result = await todosService.createTodo(
      req.body.userid,
      req.body.title
    );
    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getTodos = async (req: Request, res: Response) => {
  try {
    const todoData = await todosService.getTodos();

    res.status(201).json({
      success: true,
      message: "Data fetched successfully",
      data: todoData.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getTodosById = async (req: Request, res: Response) => {
  console.log(req.params.id);
  try {
    const todoData = await todosService.getTodosById(req.params.id);

    res.status(201).json({
      success: true,
      message: "Data fetched successfully",
      data: todoData.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTodosByUser = async (req: Request, res: Response) => {
  console.log(req.params.id);
  try {
    const todoData = await todosService.getTodosByUser(req.params.id);

    res.status(201).json({
      success: true,
      message: "Data fetched successfully",
      data: todoData.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const editTodo = async (req: Request, res: Response) => {
  console.log(req.params.id);
  try {
    const todoData = await todosService.editTodo(req.body.title, req.params.id);

    res.status(201).json({
      success: true,
      message: "Data updated successfully",
      data: todoData.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteTodo = async (req: Request, res: Response) => {
  console.log(req.params.id);
  try {
    const todoData = await todosService.deleteTodo(req.params.id);

    if (todoData.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Data not found",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Data Deleted successfully",
        data: todoData.rows,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const todoController = {
  createTodo,
  getTodos,
  getTodosById,
  getTodosByUser,
  editTodo,
  deleteTodo,
};
