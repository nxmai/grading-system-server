import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    class: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Class',
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    content: {
        type: String,
        default: "",
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    at: {
        type: Date,
        default: Date.now,
    }
})

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;