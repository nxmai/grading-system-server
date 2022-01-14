import UserModel from "./userModel.js";
import { queryToMongo } from "../../utils/queryToMongo.js";

import { hashPw, comparePw } from "../auth/index.js";

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
        const data = req.body;
        const user = await UserModel.findByIdAndUpdate(userId, data, { new: true });
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
            return res.status(200).json(updatedUser);
        } else {
            throw Error("Student card exists");
        }
        // return res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { oldPw, newPw } = req.body;
        const user = await UserModel.findById(userId);
        if (!user) throw Error("user not found");
        if (user.password) {
            if (!comparePw(oldPw, user.password)) {
                throw Error("old password is not corrected")
            }
        }
        const hash = hashPw(newPw);
        await UserModel.findByIdAndUpdate(userId, {
            password: hash
        })
        return res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateOne = async (req, res) => {
    try {
        const userId = req.params.userId;
        const data = req.body;
        const user = await UserModel.findByIdAndUpdate(userId, data);
        res.status(200).json(user);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

export const searchBy = async (req, res) => {
    try {
        const {
            skip, limit, sort, filter,
          } = queryToMongo({})(request.query);
          const result = await UserModel.find(filter).sort(sort).skip(skip).limit(limit);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};
