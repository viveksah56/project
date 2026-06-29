import messageService from "../services/message.service.js";
import { ApiError } from "../utils/AppError.js";
class MessageController {
    async getConversations(req, res, next) {
        try {
            if (!req.user)
                throw new ApiError("Unauthorized", 401);
            const conversations = await messageService.getConversations(req.user._id);
            res.status(200).json({ success: true, data: conversations });
        }
        catch (error) {
            next(error);
        }
    }
    async getMessages(req, res, next) {
        try {
            if (!req.user)
                throw new ApiError("Unauthorized", 401);
            const { receiverId } = req.params;
            if (!receiverId) {
                res.status(400).json({ success: false, message: "Receiver ID is required" });
                return;
            }
            const result = await messageService.getMessages(req.user._id, receiverId, req.query);
            res.status(200).json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteMessage(req, res, next) {
        try {
            if (!req.user)
                throw new ApiError("Unauthorized", 401);
            const { messageId } = req.params;
            await messageService.deleteMessage(messageId, req.user._id);
            res.status(200).json({ success: true, message: "Message deleted", data: null });
        }
        catch (error) {
            next(error);
        }
    }
    async getUnreadCount(req, res, next) {
        try {
            if (!req.user)
                throw new ApiError("Unauthorized", 401);
            const count = await messageService.getUnreadCount(req.user._id);
            res.status(200).json({ success: true, data: { unreadCount: count } });
        }
        catch (error) {
            next(error);
        }
    }
}
const messageController = new MessageController();
export default messageController;
//# sourceMappingURL=message.controller.js.map