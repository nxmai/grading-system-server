import classUserModel from "./classUserModel.js";
import { userClassRollEnum } from './userClassRollEnum.js';

export async function checkTeacherClass(req, res, next) {
    try {
        const classId = req.params.classId;
        const userId = req.user._id;
        const userClass = await classUserModel.findOne({
            class: classId,
            user: userId,
        })
        if (!userClass) throw Error("user not in class");
        if (userClass.role !== userClassRollEnum[1]) throw Error("permission deny")
        return next();
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export async function checkJoinedClass(req, res, next) {
    try {
        const classId = req.params.classId;
        const userId = req.user._id;
        const userClass = await classUserModel.findOne({
            class: classId,
            user: userId,
        })
        if (!userClass) throw Error("user not in class");
        return next();
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}