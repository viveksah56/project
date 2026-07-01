import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "node:http";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import routerConfig from "./routes/route.config.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import { env } from "./config/env.js";
import { initSocket } from "./socket/socket.js";

const app = express();
const server = http.createServer(app);

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1", routerConfig);
app.use(errorMiddleware);

const startServer = async (): Promise<void> => {
  await connectDB();

  initSocket(server);

  server.listen(env.PORT, () => {
    console.log(`[Server] Running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

const gracefulShutdown = (signal: string): void => {
  console.log(`[Server] ${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("[Server] HTTP server closed");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("[Server] Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("unhandledRejection", (err: Error) => {
  console.error(`[Server] Unhandled Rejection: ${err.message}`);
  gracefulShutdown("unhandledRejection");
});

process.on("uncaughtException", (err: Error) => {
  console.error(`[Server] Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

startServer();