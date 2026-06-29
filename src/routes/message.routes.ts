import { Router } from "express";
import messageController from "../controllers/message.controller.js";
import { protectRoutes } from "../middlewares/auth.middleware.js";

const messageRoutes = Router();

messageRoutes.use(protectRoutes);

messageRoutes.get("/conversations", messageController.getConversations.bind(messageController));
messageRoutes.get("/unread-count", messageController.getUnreadCount.bind(messageController));
messageRoutes.get("/:receiverId", messageController.getMessages.bind(messageController));
messageRoutes.delete("/:messageId", messageController.deleteMessage.bind(messageController));

export default messageRoutes;