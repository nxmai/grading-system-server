import ClassScoreModel from "./classScoreModel.js";
import ClassStudentIdModel from "./classStudentIdModel.js";

import AppError from "../../../utils/appError.js";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";

export const uploadStudentList = catchAsync( async function(req, res, next){
    // TODO
    /**
     * parse csv
     * import to classStudentId
     * return list sucess or fail
     */
    return sendResponse( null, 200, res );
});

export const downloadTemplateStudentList = catchAsync( async function(req, res, next){
    // TODO
    /**
     * return csv file with structure
     * 2 columns
     * studentId
     * fullname
     */
    return sendResponse( null, 200, res );
});

export const getFullScoreByClassId = catchAsync( async function(req, res, next){
    // TODO
    /**
     * get all board
     * NOTE: make it to function for reusing in bellow function
     */
    return sendResponse( null, 200, res );
});

export const downloadFullScoreByClassId = catchAsync( async function(req, res, next){
    // TODO
    /**
     * download to csv file
     * get all board return
     */
    return sendResponse( null, 200, res );
});

export const updateClassScoreById = catchAsync( async function(req, res, next){
    // TODO
    /**
     * update specifi score
     * update returned
     * update score-draft
     */
    return sendResponse( null, 200, res );
});

export const downloadTemplateScoreByGradeId = catchAsync( async function(req, res, next){
    // TODO
    /**
     * download score template of one grade
     * in board -> it is one column
     */
    return sendResponse( null, 200, res );
});

export const uploadScoreByGradeId = catchAsync( async function(req, res, next){
    // TODO
    /**
     * create or update score of classStudent
     */
    return sendResponse( null, 200, res );
});

export const markReturnedByGradeId = catchAsync( async function(req, res, next){
    //TODO
    /**
     * mark all score in grade is returned
     */
    return sendResponse( null, 200, res );
});
