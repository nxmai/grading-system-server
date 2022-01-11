import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, 'A notification must belong to a user']
    },
    // const notification = {
    //     user: teacherId,
    //     content: `${userName} has requested a grade review of ${assignmentName} in ${className}`
    //     link: `${baseURL}/class/${classId}/assignment/${assignmentId}/request/${requestId}`
    // }
    content: {
        type: String,
        default: "",
    },
    link: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;