import { Router } from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";


const routerConfig = Router();

routerConfig.use("/auth", authRoutes);
routerConfig.use("/users", userRoutes);

export default routerConfig;