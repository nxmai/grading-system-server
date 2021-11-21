import mongoose from 'mongoose';
import { userRollEnum } from './userRollEnum.js';

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
    role: {
        type: String,
        enum: userRollEnum,
        default: userRollEnum[0],
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
