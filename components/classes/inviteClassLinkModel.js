import mongoose from 'mongoose';
import InviteUserClassSchema from './inviteUserClassModel.js';

const InviteClassLinkSchema = new mongoose.Schema({
    class: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Class',
        required: [true, 'Link must have a ClassID'],
        unique: [true, 'One Class has ONLY one Link'],
    },
    linkText: {
        type: String,
        trim: true,
        unique: [true, 'This link must unique'],
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
})

InviteClassLinkSchema.virtual('inviteUsers', {
    ref: 'InviteUserClass',
    foreignField: 'link',
    localField: '_id',
    match: {
        isActive: true,
    }
  });

InviteClassLinkSchema.post(
    /findOneAndDelete|findOneAndRemove|deleteOne|remove/,
    { document: true, query: true },
    async (result) => {
        await InviteUserClassSchema.deleteMany({ link: result._id });
    },
);

const InviteClassLink = mongoose.model('InviteClassLink', InviteClassLinkSchema);
export default InviteClassLink;
