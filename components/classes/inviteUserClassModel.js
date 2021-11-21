import mongoose from 'mongoose';
import { userClassRollEnum } from './userClassRollEnum.js';

const InviteUserClassSchema = new mongoose.Schema({
    link: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'InviteClassLink',
        required: [true, 'invite with class which has invite link'],
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
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

InviteUserClassSchema.index({ link: 1, user: 1 }, { unique: true });

const InviteUserClass = mongoose.model('InviteUserClass', InviteUserClassSchema);
export default InviteUserClass;
