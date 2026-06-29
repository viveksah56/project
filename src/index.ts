import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";
import connectDB from "./config/db.js";
import routerConfig from "./routes/route.config.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import { env } from "./config/env.js";

const app = express();

const startServer = async () => {
  const PORT = env.PORT || 8000 ;

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  await connectDB();

  app.use("/api/v1", routerConfig);

  app.use(errorMiddleware);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  process.on("unhandledRejection", (err: Error) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    process.exit(1);
  });

  process.on("uncaughtException", (err: Error) => {
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
};

startServer();