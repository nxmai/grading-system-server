import ClassUser from './classUserModel.js';
import { EnumUserRoll } from './userClassRollEnum.js';
import classStudentIdModel from "../classScore/classStudentIdModel.js";
import AppError from "../../../utils/appError.js";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";

export const getTeacherOfClass = async (req, res) => {
    try {
        const classId = req.params.classId;
        const classUsers = await ClassUser.find({ class: classId }).populate({
            path: "user",
            // select: 'firstName lastName email'
        });

        const result = classUsers
            .filter((classUser) => classUser.role === EnumUserRoll.TEACHER)
            .map((classUser) => classUser.user);

        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getStudentOfClass = async (req, res) => {
    try {
        const classId = req.params.classId;
        const classUsers = await ClassUser.find({ class: classId }).populate({
            path: "user",
            // select: 'firstName lastName email'
        });

        const result = classUsers
            .filter((classUser) => classUser.role === EnumUserRoll.STUDENT)
            .map((classUser) => classUser.user);

        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getUserRoleByClassId = (req, res) => {
    return res.status(200).json({role: req.classUser.role});
};

export const getStudentClassId = catchAsync( async (req, res, next) => {
    const classId = req.params.classId;
    const studentCardID = req.user.studentCardID;
    const studentClassId = await classStudentIdModel.findOne({
        studentId: studentCardID,
        class: classId
    })
    
    if(!studentClassId) {
        throw new AppError("classstudentid not found", 404);
    }
    return res.status(200).json(studentClassId._id);
});
