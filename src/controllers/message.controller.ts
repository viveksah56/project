import type { Request, Response, NextFunction } from "express";
import messageService from "../services/message.service.js";
import { ApiError } from "../utils/AppError.js";

class MessageController {
    async getConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new ApiError("Unauthorized", 401);
            const conversations = await messageService.getConversations(req.user._id as string);
            res.status(200).json({ success: true, data: conversations });
        } catch (error) {
            next(error);
        }
    }

    async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new ApiError("Unauthorized", 401);

            const { receiverId } = req.params as { receiverId: string };
            if (!receiverId) {
                res.status(400).json({ success: false, message: "Receiver ID is required" });
                return;
            }

            const result = await messageService.getMessages(req.user._id as string, receiverId, req.query);
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    }

    async deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new ApiError("Unauthorized", 401);
            const {messageId}=req.params as {messageId: string};
            await messageService.deleteMessage(messageId, req.user._id as string);
            res.status(200).json({ success: true, message: "Message deleted", data: null });
        } catch (error) {
            next(error);
        }
    }

    async getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) throw new ApiError("Unauthorized", 401);
            const count = await messageService.getUnreadCount(req.user._id as string);
            res.status(200).json({ success: true, data: { unreadCount: count } });
        } catch (error) {
            next(error);
        }
    }
}

const messageController = new MessageController();
export default messageController;