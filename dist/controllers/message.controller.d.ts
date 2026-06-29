import type { Request, Response, NextFunction } from "express";
declare class MessageController {
    getConversations(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMessages(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const messageController: MessageController;
export default messageController;
//# sourceMappingURL=message.controller.d.ts.map