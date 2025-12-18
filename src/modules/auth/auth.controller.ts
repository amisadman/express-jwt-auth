import { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await authService.login(email, password);
    res.status(201).json({
      success: true,
      message: `${
        result === null
          ? "Email not found"
          : result === false
          ? "Invalid Password"
          : "Login Successful"
      }`,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const authController = {
  loginUser,
};
