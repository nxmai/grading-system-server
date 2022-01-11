import Notification from "./notificationModel.js";
import { io } from "../../../socket.js";

export const createNotification = async (req, res) => {
    // req.body: List of notifications
    const data = req.body;
    if (data.length !== 0) {
        data.forEach(async notification => {
            const newNotification = await Notification.create({ ...notification });
            io.emit(notification.user, newNotification);
        });
        res.status(200);
    } else {
        res.status(404).json({ message: "Notification data missing" });
    }
};

export const getNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ user: userId });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateNotificationRead = async (req, res) => {
    try {
        const { notificationId } = req.body;
        if (notificationId) {
            await Notification.findByIdAndUpdate(notificationId, { isRead: true }).then(result => {
                res.status(200).json(result);
            })
        } else {
            res.status(404).json({ message: "Missing notification id" });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}