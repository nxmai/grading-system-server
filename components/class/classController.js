import Class from "./classModel.js";
import ClassUser from "./classUser/classUserModel.js";
import { EnumUserRoll} from "./classUser/userClassRollEnum.js";

export const getClasses = async (req, res) => {
    try {
        const userId = req.user._id;
        const classByUserId = await ClassUser.find({ user: userId }).populate({
            path: "class",
            select: "name subject description",
        });
        
        const total = classByUserId.map((item) => item.class);

        res.status(200).json(total);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getClassById = async (req, res) => {
    try {
        const classId = req.params.classId;
        const classData = await Class.findById(classId);
        if (!classData) throw Error("class not found");

        return res.status(200).json(classData);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createClass = async (req, res) => {
    try {
        const userId = req.user._id;
        const newClass = new Class({ ...req.body });
        await newClass.save();

        const newClassUser = new ClassUser({
            class: newClass._id,
            user: userId,
            role: EnumUserRoll.TEACHER,
        });
        await newClassUser.save();

        res.status(201).json(newClass);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};
