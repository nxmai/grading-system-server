import NotificationModel from "./notificationModel.js";
import { io } from "../../../index.js";
import UserModel from "../userModel.js"
import ClassModel from "../../class/classModel.js"
import AssignmentModel from "../../class/classAssignment/classAssignmentModel.js"
import ClassUserModel from "../../class/classUser/classUserModel.js"
import { EnumUserRoll } from "../../class/classUser/userClassRollEnum.js";
import ClassStudentIdModel from "../../class/classScore/classStudentIdModel.js";
import catchAsync from "../../../utils/catchAsync.js";
import AppError from "../../../utils/appError.js";

export const responseToStudentGradeReviewNotification = catchAsync(async (req, res, next) => {
    const trigger = req.user;
    const { classId, assignmentId, classStudentId } = req.body;
    if (!(trigger && classId && assignmentId && classStudentId)) {
        throw new AppError("Missing information", 400);
    }
    const classStudent = await ClassStudentIdModel.findById(classStudentId);
    const user = await UserModel.find({ studentCardID: classStudent.studentId });
    const classDetail = await ClassModel.findById(classId);
    const assignment = await AssignmentModel.findById(assignmentId);
    createNotifications(trigger, "responsed to your grade review", `of ${assignment.title} in ${classDetail.name}`, `/class/${classId}/assignment/${assignmentId}/request/${classStudentId}`, user);
    res.status(200).json({ message: "success" });
})

export const returnScoreNotification = catchAsync(async (req, res, next) => {
    const trigger = req.user;
    const { classId, assignmentId } = req.body;
    if (!(trigger && classId && assignmentId)) {
        throw new AppError("Missing information", 400);
    }
    const classUsers = await ClassUserModel.find({ class: classId }).populate({
        path: "user",
    });
    const students = classUsers
        .filter((classUser) => classUser.role === EnumUserRoll.STUDENT)
        .map((classUser) => classUser.user);
    
    const classDetail = await ClassModel.findById(classId);
    const assignment = await AssignmentModel.findById(assignmentId);

    // createNotifications(trigger, "finalized all grades", `of ${assignment.title} in ${classDetail.name}`, `/class/${classId}/assignment/${assignmentId}/request/${classStudentId._id}`, students);
    students.forEach(async (student) => {
        const classStudentId = await ClassStudentIdModel.findOne({ studentId: student.studentCardID, class: classId })
        const notification = {
            user: student._id,
            content: `${trigger.firstName} ${trigger.lastName} finalized all grades of ${assignment.title} in ${classDetail.name} `,
            link: `/class/${classId}/assignment/${assignmentId}/request/${classStudentId._id}`,
        };
        const newNotification = await NotificationModel.create({ ...notification });
        io.emit(newNotification.user, newNotification);
    });
    res.status(200).json({ message: "success" });
})

export const requestGradeReviewNotification = catchAsync(async (req, res, next) => {
    const trigger = req.user;
    const { classId, assignmentId, classStudentId } = req.body;
    if (!(trigger && classId && assignmentId && classStudentId)) {
        throw new AppError("Missing information", 400);
    }
    const classUsers = await ClassUserModel.find({ class: classId }).populate({
        path: "user",
    });
    const teachers = classUsers
        .filter((classUser) => classUser.role === EnumUserRoll.TEACHER)
        .map((classUser) => classUser.user);

    const classDetail = await ClassModel.findById(classId);
    const assignment = await AssignmentModel.findById(assignmentId);

    createNotifications(trigger, "requested a grade review", `of ${assignment.title} in ${classDetail.name}`, `/class/${classId}/assignment/${assignmentId}/request/${classStudentId}`, teachers);
    res.status(200).json({ message: "success" });
})

function createNotifications(trigger, didWhat, inWhere, link, notifiedUsers) {
    notifiedUsers.forEach(async (notifiedUser) => {
        const notification = {
            user: notifiedUser._id,
            content: `${trigger.firstName} ${trigger.lastName} ${didWhat} ${inWhere}`,
            link,
        };
        const newNotification = await NotificationModel.create({ ...notification });
        io.emit(newNotification.user, newNotification);
    });
}

export const getNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await NotificationModel.find({ user: userId });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(400).json(error);
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