import mongoose from 'mongoose';

const reviewChatSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, 'reviewChat must belong to one User']
    },
    reviewRequest: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'ReviewRequest',
        required: [true, 'Chat must belong to one Review']
    },
    content: {
        type: String,
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
});

reviewChatSchema.pre(/^find/, function (next)  {
    this.populate({
      path: 'user',
      select: '_id firstName lastName photoUrl studentCardID',
    });
    next();
  });

const reviewChat = mongoose.model('ReviewChat', reviewChatSchema);
export default reviewChat;
