import mongoose, { Document, Schema } from "mongoose";

export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    lastMessage?: mongoose.Types.ObjectId;
    updatedAt: Date;
    createdAt: Date;
}

const conversationSchema = new Schema<IConversation>(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

conversationSchema.index({ participants: 1 });

const Conversation = mongoose.model<IConversation>("Conversation", conversationSchema);

export default Conversation;