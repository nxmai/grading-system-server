import Notification from "./notificationModel";

export const getNotification = async (req, res) => {
    try {
        const { userId } = req;
        const notification = await Notification.find({ user: userId });
        res.status(200).json(notification);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}