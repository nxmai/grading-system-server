import mongoose from 'mongoose';
import { userRollEnum, getEnum } from './userRollEnum.js';
import { userBlackTypeEnumList, userBlackTypeEnum } from './userBlackTypeEnum.js';

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    studentCardID: {
        type: String,
    },
    photoUrl: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: userRollEnum,
        default: getEnum.USER
    },
    black_type: {
        type: String,
        enum: userBlackTypeEnumList,
        default: userBlackTypeEnum.NONE
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
})

UserSchema.virtual('inviteClasses', {
    ref: 'InviteUserClass',
    foreignField: 'user',
    localField: '_id',
    match: {
        inviteClasses: {
            isActive: true,
        }
    }
});

const User = mongoose.model('User', UserSchema);
export default User;
