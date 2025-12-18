import express from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", userController.createUser);
router.get("/", auth(),userController.getUsers);
router.get("/:id",auth(), userController.getUserById);
router.put("/:id",auth(), userController.editUser);
router.delete("/:id",auth(), userController.deleteUser);

export const userRoutes = router;
