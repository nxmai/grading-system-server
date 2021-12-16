import ClassUser from './classUserModel.js';
import { EnumUserRoll } from './userClassRollEnum.js';

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
