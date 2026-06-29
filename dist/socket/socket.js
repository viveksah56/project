import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
const onlineUsers = new Map();
const getUserSocketId = (userId) => {
    return onlineUsers.get(userId);
};
export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: env.CLIENT_URL,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication token missing"));
        }
        try {
            const decoded = jwt.verify(token, env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        }
        catch {
            next(new Error("Invalid or expired token"));
        }
    });
    io.on("connection", (socket) => {
        const userId = socket.userId;
        onlineUsers.set(userId, socket.id);
        io.emit("online_users", Array.from(onlineUsers.keys()));
        socket.on("send_message", async (data) => {
            try {
                const { receiverId, content } = data;
                if (!content?.trim())
                    return;
                let conversation = await Conversation.findOne({
                    participants: { $all: [userId, receiverId] },
                });
                if (!conversation) {
                    conversation = await Conversation.create({
                        participants: [userId, receiverId],
                    });
                }
                const message = await Message.create({
                    sender: userId,
                    receiver: receiverId,
                    content: content.trim(),
                });
                await Conversation.findByIdAndUpdate(conversation._id, {
                    lastMessage: message._id,
                    updatedAt: new Date(),
                });
                const populatedMessage = await message.populate("sender", "name email avatar");
                const receiverSocketId = getUserSocketId(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", populatedMessage);
                }
                socket.emit("message_sent", populatedMessage);
            }
            catch {
                socket.emit("error", { message: "Failed to send message" });
            }
        });
        socket.on("mark_as_read", async (data) => {
            try {
                await Message.updateMany({ sender: data.senderId, receiver: userId, isRead: false }, { isRead: true });
                const senderSocketId = getUserSocketId(data.senderId);
                if (senderSocketId) {
                    io.to(senderSocketId).emit("messages_read", { by: userId });
                }
            }
            catch {
                socket.emit("error", { message: "Failed to mark messages as read" });
            }
        });
        socket.on("typing", (data) => {
            const receiverSocketId = getUserSocketId(data.receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("user_typing", { senderId: userId });
            }
        });
        socket.on("stop_typing", (data) => {
            const receiverSocketId = getUserSocketId(data.receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("user_stop_typing", { senderId: userId });
            }
        });
        socket.on("disconnect", () => {
            onlineUsers.delete(userId);
            io.emit("online_users", Array.from(onlineUsers.keys()));
        });
    });
    return io;
};
//# sourceMappingURL=socket.js.map