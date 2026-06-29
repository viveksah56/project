import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
        role: string;
      };
      blog?: {
        _id: string;
        title: string;
        slug: string;
        authorId: string;
      };
      message?: {
        _id: string;
        senderId: string;
        receiverId: string;
        content: string;
        isRead: boolean;
      };
    }
  }
}

export {};