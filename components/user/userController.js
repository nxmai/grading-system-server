import UserModel from "./userModel.js";
import { queryToMongo } from "../../utils/queryToMongo.js";

import { hashPw, comparePw } from "../auth/index.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/appError.js";

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

export const updateStudentCardId = catchAsync(async (req, res) => {
    const { studentCardId } = req.body;
    const checkIsUsed = await UserModel.findOne({
        studentCardID: studentCardId
    });
    if (checkIsUsed) throw new AppError("studentCard is used", 403);
    const checkIsMapping = await UserModel.findOne({
        studentCardIDScraft: studentCardId
    });
    if (checkIsMapping) throw new AppError("another student is mapped this studentCard", 403);

    const updated = await UserModel.findByIdAndUpdate(req.user.id,
    {
        studentCardID: studentCardId,
        studentCardIDScraft: "",
    });
    return res.status(200).json(updated);
});

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

export const getUsers = async (req, res) => {
    try {
        const {
            skip, limit, sort, filter,
          } = queryToMongo({})(req.query);
          const result = await UserModel.find(filter).sort(sort).skip(skip).limit(limit);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};
