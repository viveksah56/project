import mongoose, { Document, Schema } from "mongoose";
const conversationSchema = new Schema({
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
}, {
    timestamps: true,
    versionKey: false,
});
conversationSchema.index({ participants: 1 });
const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
//# sourceMappingURL=conversation.model.js.map