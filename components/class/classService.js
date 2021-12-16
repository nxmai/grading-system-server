import classUserModel from "./classUser/classUserModel.js";
import { EnumUserRoll } from './classUser/userClassRollEnum.js';

export async function checkTeacherClass(req, res, next) {
    try {
        const classId = req.params.classId;
        const userId = req.user._id;
        const userClass = await classUserModel.findOne({
            class: classId,
            user: userId,
        })
        if (!userClass) throw Error("user not in class");
        if (userClass.role !== EnumUserRoll.TEACHER ) throw Error("permission deny");
        req.classUser = userClass;
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
        if (userClass.role === EnumUserRoll.GUEST ) throw Error("permission deny");
        req.classUser = userClass;
        return next();
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}
