import mongoose from 'mongoose';
import { userRollEnum, getEnum } from './userRollEnum.js';
import { userBlackTypeEnumList, userBlackTypeEnum } from './userBlackTypeEnum.js';
import { convVie } from "../../utils/convVie.js";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    firstName__search: {
        type: String,
        select: false,
    },
    lastName: {
        type: String,
    },
    lastName__search: {
        type: String,
        select: false,
    },
    studentCardID: {
        type: String,
    },
    photoUrl: {
        type: String,
    },
    active: {
        type: Boolean,
        default: false,
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
});

UserSchema.index({ firstName__search: 'text', lastName__search: 'text', email: 'text' });

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

UserSchema.pre('save', async function (next) {
    if (this.firstName) this.firstName__search = convVie(this.firstName).toLowerCase();
    if (this.lastName) this.lastName__search = convVie(this.lastName).toLowerCase();
    return next();
});

UserSchema.pre(/findOneAndUpdate|updateOne|update/, function (next) {
    const docUpdate = this.getUpdate();
    // return if not update search
    if (!docUpdate) return next();
    const updateDocs = {};
    if (docUpdate.firstName) {
        updateDocs.firstName__search = convVie(docUpdate.firstName).toLowerCase();
    }
    if (docUpdate.lastName) {
        updateDocs.lastName__search = convVie(docUpdate.lastName).toLowerCase();
    }
    // update
    this.findOneAndUpdate({}, updateDocs);
    return next();
});

const User = mongoose.model('User', UserSchema);
export default User;
