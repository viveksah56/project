import { type IPaginationQuery, type IPaginatedResult } from "../utils/pagination.js";
import type { IMessage } from "../models/message.model.js";
import type { IConversation } from "../models/conversation.model.js";
declare class MessageService {
    getConversations(userId: string): Promise<IConversation[]>;
    getMessages(userId: string, receiverId: string, query: IPaginationQuery): Promise<IPaginatedResult<IMessage>>;
    deleteMessage(messageId: string, userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
}
declare const messageService: MessageService;
export default messageService;
//# sourceMappingURL=message.service.d.ts.map