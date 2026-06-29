import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { ApiError } from "../utils/AppError.js";
import {
    getPaginationParams,
    buildPaginationMeta,
    type IPaginationQuery,
    type IPaginatedResult,
} from "../utils/pagination.js";
import type { IMessage } from "../models/message.model.js";
import type { IConversation } from "../models/conversation.model.js";

class MessageService {
    async getConversations(userId: string): Promise<IConversation[]> {
        return Conversation.find({ participants: userId })
            .populate("participants", "name email avatar")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });
    }

    async getMessages(
        userId: string,
        receiverId: string,
        query: IPaginationQuery
    ): Promise<IPaginatedResult<IMessage>> {
        const { page, limit, skip } = getPaginationParams(query);

        const filter = {
            $or: [
                { sender: userId, receiver: receiverId },
                { sender: receiverId, receiver: userId },
            ],
        };

        const [data, total] = await Promise.all([
            Message.find(filter)
                .populate("sender", "name email avatar")
                .populate("receiver", "name email avatar")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Message.countDocuments(filter),
        ]);

        return {
            data: data.reverse(),
            meta: buildPaginationMeta(total, page, limit),
        };
    }

    async deleteMessage(messageId: string, userId: string): Promise<void> {
        const message = await Message.findById(messageId);

        if (!message) {
            throw new ApiError("Message not found", 404);
        }

        if (String(message.sender) !== userId) {
            throw new ApiError("You can only delete your own messages", 403);
        }

        await Message.findByIdAndDelete(messageId);
    }

    async getUnreadCount(userId: string): Promise<number> {
        return Message.countDocuments({ receiver: userId, isRead: false });
    }
}

const messageService = new MessageService();
export default messageService;