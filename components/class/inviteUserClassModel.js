import mongoose from 'mongoose';
import { userClassRollEnum } from './userClassRollEnum.js';

const InviteUserClassSchema = new mongoose.Schema({
    link: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'InviteClassLink',
        required: [true, 'invite with class which has invite link'],
    },
    email: {
        type: String,
        required: [true, 'invite with class which has email'],
    },
    role: {
        type: String,
        enum: userClassRollEnum,
        default: userClassRollEnum[0],
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
});

InviteUserClassSchema.index({ link: 1, email: 1 }, { unique: true });

const InviteUserClass = mongoose.model('InviteUserClass', InviteUserClassSchema);
export default InviteUserClass;
