import { Router } from "express";
import userController from "../controllers/user.controller.js";
import validate from "../middlewares/validation.middleware.js";
import { createUserSchema, updateUserSchema } from "../validations/user.validation.js";

const userRoutes = Router();

userRoutes
  .route("/")
  .post(validate(createUserSchema), userController.createUser.bind(userController))
  .get(userController.getAllUsers.bind(userController));

userRoutes
  .route("/:id")
  .get(userController.getUserById.bind(userController))
  .patch(validate(updateUserSchema), userController.updateUser.bind(userController))
  .delete(userController.deleteUser.bind(userController));

export default userRoutes;