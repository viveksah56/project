import mongoose, { Document } from "mongoose";
export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    lastMessage?: mongoose.Types.ObjectId;
    updatedAt: Date;
    createdAt: Date;
}
declare const Conversation: mongoose.Model<IConversation, {}, {}, {}, mongoose.Document<unknown, {}, IConversation, {}, mongoose.DefaultSchemaOptions> & IConversation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IConversation>;
export default Conversation;
//# sourceMappingURL=conversation.model.d.ts.map