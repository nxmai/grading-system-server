import mongoose from 'mongoose';
import { userClassRollEnum } from './userClassRollEnum.js';

const ClassUserSchema = new mongoose.Schema({
    class: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Class',
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

ClassUserSchema.index({ class: 1, user: 1 }, { unique: true });

const ClassUser = mongoose.model('ClassUser', ClassUserSchema);
export default ClassUser;
