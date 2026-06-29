import mongoose, { Document } from "mongoose";
export interface IMessage extends Document {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    content: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const Message: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}, mongoose.DefaultSchemaOptions> & IMessage & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMessage>;
export default Message;
//# sourceMappingURL=message.model.d.ts.map