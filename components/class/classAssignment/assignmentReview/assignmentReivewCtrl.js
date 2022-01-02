import ReviewRequestModel from "./reviewRequestModel.js";
import catchAsync from "../../../../utils/catchAsync.js";
import UserModel from "../../../user/userModel.js";
import classStudentIdModel from "../../classScore/classStudentIdModel.js";
import sendResponse from "../../../../utils/sendResponse.js";
import AppError from "../../../../utils/appError.js";

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
        classStudentId: classStudentId
    })

    if(existReviewRequest) {
        res.status(404).json({ message: 'review already exist' });
        return new AppError('review already exist', 404);
    }
    
    const data = { ...req.body, classStudentId: classStudentId };
    
    const resp = await ReviewRequestModel.create(data);
    return sendResponse(resp, 201, res);
});

export const getOneAssignmentReviewRequest = catchAsync(async function (
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
    const classAssignmentId = req.params.assignmentId;

    const existReviewRequest = await ReviewRequestModel.findOne({
        classAssignment: classAssignmentId,
        classStudentId: classStudentId
    })

    return sendResponse(existReviewRequest, 201, res);
});
