import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const q = await userServices.createUserInDb(name, email);

    res.status(201).json({
      success: true,
      message: q.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getUsers = async (req: Request, res: Response) => {
  try {
    const usersData = await userServices.getUsers();

    res.status(201).json({
      success: true,
      message: "Data fetched successfully",
      data: usersData.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);

  try {
    const user = await userServices.getUserById(id);

    if (user.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Data not found",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Data fetched successfully",
        data: user.rows,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const editUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);

  try {
    const user = await userServices.editUser(
      req.body.name,
      req.body.email,
      req.params.id
    );

    if (user.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Data not found",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Data updated successfully",
        data: user.rows,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);

  try {
    const user = await userServices.deleteUser(id);

    if (user.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Data not found",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Data Deleted successfully",
        data: user.rows,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userController = {
  createUser,
  getUsers,
  getUserById,
  editUser,
  deleteUser,
};
