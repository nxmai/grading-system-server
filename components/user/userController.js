import UserModel from "./userModel.js";

export const getMe = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await UserModel.findById(userId);
        if(!user) throw Error('user not found');
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
        if(!user) throw Error('user not found');

        return res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};