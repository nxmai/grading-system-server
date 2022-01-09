import ReviewRequestModel from "./reviewRequestModel.js";
import catchAsync from "../../../../utils/catchAsync.js";
import UserModel from "../../../user/userModel.js";
import RvChatModel from "./reviewChatModel.js";
import classStudentIdModel from "../../classScore/classStudentIdModel.js";

import sendResponse from "../../../../utils/sendResponse.js";
import AppError from "../../../../utils/appError.js";
import classScore from "../../classScore/classScoreModel.js";

export const createAssignmentReviewRequest = catchAsync(async function (
    req,
    res,
    next
) {
    const classId = req.classUser.class._id;
    if (!classId) return new AppError("class not found", 404);

    const user = await UserModel.findById(req.classUser.user._id);
    const studentId = user.studentCardID;

    const classStudent = await classStudentIdModel.findOne({
        class: classId,
        studentId: studentId,
    });

    const classStudentId = classStudent._id;

    const existReviewRequest = await ReviewRequestModel.findOne({
        classAssignment: req.body.classAssignment,
        classStudentId: classStudentId,
    });

    if (existReviewRequest) {
        res.status(404).json({ message: "review already exist" });
        return new AppError("review already exist", 404);
    }

    const data = { ...req.body, classStudentId: classStudentId };

    const resp = await ReviewRequestModel.create(data);
    return sendResponse(resp, 201, res);
});

export const getOneAssignmentReviewRequestForStudent = catchAsync(
    async function (req, res, next) {
        const classId = req.classUser.class._id;
        if (!classId) return new AppError("class not found", 404);

        const user = await UserModel.findById(req.classUser.user._id);
        const studentId = user.studentCardID;

        const classStudent = await classStudentIdModel.findOne({
            class: classId,
            studentId: studentId,
        });

        const classStudentId = classStudent._id;
        const classAssignmentId = req.params.assignmentId;

        const existReviewRequest = await ReviewRequestModel.findOne({
            classAssignment: classAssignmentId,
            classStudentId: classStudentId,
        });

        return sendResponse(existReviewRequest, 201, res);
    }
);

export const getAllReviewRequestsInOneAssignment = catchAsync(async function (
    req,
    res,
    next
) {
    const classId = req.classUser.class._id;
    if (!classId) return new AppError("class not found", 404);

    const classAssignmentId = req.params.assignmentId;

    const reviewRequests = await ReviewRequestModel.find({
        classAssignment: classAssignmentId,
    }).populate("classStudentId");

    return sendResponse(reviewRequests, 201, res);
});

export const getOneAssignmentReviewRequest = catchAsync(async function (
    req,
    res,
    next
) {
    const classId = req.classUser.class._id;
    if (!classId) return new AppError("class not found", 404);

    const classAssignmentId = req.params.assignmentId;
    const classStudentId = req.params.classStudentId;

    const reviewRequests = await ReviewRequestModel.findOne({
        classAssignment: classAssignmentId,
        classStudentId: classStudentId,
    }).populate("classStudentId");

    return sendResponse(reviewRequests, 201, res);
});

export const getReviewChatByReviewRequestId = catchAsync(async function (
    req,
    res,
    next
) {
    const reviewRequestId = req.params.reviewRequestId;
    const rvReq = await ReviewRequestModel.findById(reviewRequestId);
    if (!rvReq) throw new AppError("review Request not found", 404);

    const listChat = await RvChatModel.find({
        reviewRequest: rvReq._id,
    }).sort("created_at");

    return sendResponse(listChat, 200, res);
});

export const createReviewChat = catchAsync(async function (req, res, next) {
    const reviewRequestId = req.params.reviewRequestId;
    const rvReq = await ReviewRequestModel.findById(reviewRequestId);
    if (!rvReq) throw new AppError("review Request not found", 404);
    const content = req.body.content;

    const rvChat = await RvChatModel.create({
        user: req.user._id,
        reviewRequest: rvReq._id,
        content,
    });

    return sendResponse(rvChat, 200, res);
});

export const acceptScoreRequestByStudent = catchAsync(async function (
    req,
    res,
    next
) {
    const classId = req.classUser.class._id;
    if (!classId) return new AppError("class not found", 404);

    const classAssignmentId = req.params.assignmentId;
    const classStudentId = req.params.classStudentId;

    const filter = {
        classAssignment: classAssignmentId,
        classStudentId: classStudentId,
    };

    const StudentNewScore = await ReviewRequestModel.findOne(filter);

    const newScore = StudentNewScore.scoreExpectation;
    const updatedData = { score: newScore, isAccept: true };

    const updatedScore = await classScore.findOneAndUpdate(filter, updatedData);

    return sendResponse(updatedScore, 200, res);
});

export const ignoreScoreRequestByStudent = catchAsync(async function (
    req,
    res,
    next
) {
    const classId = req.classUser.class._id;
    if (!classId) return new AppError("class not found", 404);

    const classAssignmentId = req.params.assignmentId;
    const classStudentId = req.params.classStudentId;

    const filter = {
        classAssignment: classAssignmentId,
        classStudentId: classStudentId,
    };

    const StudentNewScore = await ReviewRequestModel.findOneAndUpdate(filter, {isAccept: false});

    return sendResponse(StudentNewScore, 200, res);
});

