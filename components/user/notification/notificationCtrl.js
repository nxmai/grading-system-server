import NotificationModel from "./notificationModel.js";
import { io } from "../../../index.js";
import UserModel from "../userModel.js"
import ClassModel from "../../class/classModel.js"
import AssignmentModel from "../../class/classAssignment/classAssignmentModel.js"

export const responseToStudentGradeReviewNotification = async (req, res) => {
    // const notification = {
    //     user: teacherId,
    //     content: `${userName} has requested a grade review of ${assignmentName} in ${className}`
    //     link: `/class/${classId}/assignment/${assignmentId}/request/${requestId}`
    // }
    // const info = {
    //     classId,
    //     assignmentId,
    //     classStudentId,
    //     trigger
    // }
    const { classId, assignmentId, classStudentId } = req.body;
    const classStudent = await classStudentIdModel.findById(classStudentId);
    const user = await UserModel.findOne({ studentCardID: classStudent.studentId });
    const classDetail = ClassModel.findById(classId);
    const assignment = AssignmentModel.findById(assignmentId);
    const teacher = UserModel.findById(trigger);
    const notification = {
        user: user._id,
        content: `${teacher.firstName} ${teacher.lastName} responsed to your grade review of ${assignment.title} in ${classDetail.name}`,
        link: `/class/${classId}/assignment/${assignmentId}/request/${classStudentId}`,
    }
    const newNotification = await NotificationModel.create({ ...notification });
    io.emit(notification.user, newNotification);
}

export const createNotification = async (req, res) => {
    // req.body: List of notifications
    const data = req.body;
    if (data.length !== 0) {
        data.forEach(async notification => {
            const newNotification = await NotificationModel.create({ ...notification });
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
        const notifications = await NotificationModel.find({ user: userId });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateNotificationRead = async (req, res) => {
    try {
        const { notificationId } = req.body;
        if (notificationId) {
            await NotificationModel.findByIdAndUpdate(notificationId, { isRead: true }).then(result => {
                res.status(200).json(result);
            })
        } else {
            res.status(404).json({ message: "Missing notification id" });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}