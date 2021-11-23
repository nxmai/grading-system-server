import UserModel from "./userModel.js";

export const getMe = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await UserModel.findById(userId);
        if (!user) throw Error("user not found");
        return res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateMe = async (req, res) => {
    try {
        const userId = req.user._id;
        // TODO
        const user = await UserModel.findById(userId);
        if (!user) throw Error("user not found");

        return res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateStudentCardId = async (req, res) => {
    try {
        const userId = req.user._id;
        const { studentCardId } = req.body;
        const user = await UserModel.findById(userId);

        const isExist = await UserModel.findOne({
            studentCardID: studentCardId,
        });
        if (!isExist) {
            const updatedUser = await UserModel.findOneAndUpdate(
                { _id: userId },
                { ...user._doc, studentCardID: studentCardId },
                { new: true }
            );
        } else {
            throw Error("Student card exists");
        }

        return res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
