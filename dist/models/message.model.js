import mongoose, { Document, Schema } from "mongoose";
const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ createdAt: -1 });
const Message = mongoose.model("Message", messageSchema);
export default Message;
//# sourceMappingURL=message.model.js.map