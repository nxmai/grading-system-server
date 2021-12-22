import fs from 'fs';
import { parse } from 'csv-parse/sync';
import multer from "multer";
import { nanoid } from 'nanoid';

import AppError from "../../../utils/appError.js";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";

import ClassStudentIdModel from "./classStudentIdModel.js";
import ClassAssignmentModel from '../classAssignment/classAssignmentModel.js';
import ClassScoreModel from "./classScoreModel.js";

export const uploadStudentList = catchAsync( async function(req, res, next){
    const classId = req.classUser.class._id;
    if (!classId) return new AppError('class not found', 404);

    // check file exist
    const filePath = req.file.path;
    if (!filePath) { return new AppError("no file found", 404); }
    // read file
    const input = fs.readFileSync(filePath);
    // parse data
    const records = parse(input, {
        columns: true,
        skip_empty_lines: true
    });
    const dta = [];
    records.forEach(e=> {
        dta.push({
            class: classId,
            studentId: e.student_id,
            fullName: e.full_name,
        })
    })
    // process
    const resp = await ClassStudentIdModel.insertMany(dta, { ordered: false});
    return sendResponse( resp, 200, res );
});

export const getStudentScoreByClassId = catchAsync( async function(req, res, next) {
    const classId = req.classUser.class._id;
    if (!classId) return new AppError('class not found', 404);

    const dta = await ClassStudentIdModel.find({
        class: classId
    }).populate('user');
    return sendResponse( dta, 200, res );
})

export const downloadTemplateStudentList = catchAsync( async function(req, res, next){
    return res.download('samples/upload_student.csv');
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

export const downloadTemplateScoreByAssignmentId = catchAsync( async function(req, res, next){
    /**
     * download score template of one assignment
     * in board -> it is one column
     */
    const classId = req.classUser.class._id;
    if (!classId) return new AppError('class not found', 404);
    const classAssignmentId = req.params.assignmentId;
    if (!classAssignmentId) return new AppError('assignment not found', 404);

    // get student in class
    const listStudentOfClass = await ClassStudentIdModel.find({class: classId});
    // mapping data in score
    const listStudentHadScoreOfGrade = await ClassAssignmentModel.find({ classAssignment: classAssignmentId});

    // convert to csv

    // loop data element for writing data into file
    const data = ['student_id', 'score'];
    let dataStr = data.join(',') + '\n';
    listStudentOfClass.forEach(e => {
        let score = ' ';
        const index = listStudentHadScoreOfGrade.findIndex(e2=> e2.classStudentId == e._id);
        if (index !== -1 ) {
            const stu = listStudentHadScoreOfGrade[index];
            score = `${stu.score}`;
        }
        const dta = [`${e.studentId}`, `${score}`];
        dataStr += dta.join(',') + '\n';
    })

    // write and return file
    const randomStr = nanoid();
    const fileName = `template_score_for_assignment_${classAssignmentId}_of_class_${classId}_no_${randomStr}.csv`;
    const writeStream = fs.createWriteStream('tempt/'+ fileName);
    writeStream.write(dataStr, ()=>{
        // TODO : save file name to dtabase
        return res.download('tempt/' + fileName);
    });
});

export const uploadScoreByAssignmentId = catchAsync( async function(req, res, next){
    // TODO
    /**
     * create or update score of classStudent
     */
    const classId = req.classUser.class._id;
    if (!classId) return new AppError('class not found', 404);
    const classAssignmentId = req.params.assignmentId;
    if (!classAssignmentId) return new AppError('assignment not found', 404);

    // check file exist
    const filePath = req.file.path;
    if (!filePath) { return new AppError("no file found", 404); }
    // read file
    const input = fs.readFileSync(filePath);
    // parse data
    const records = parse(input, {
        columns: true,
        skip_empty_lines: true
    });

    // process
    // get classStudentId
    const listStudentOfClass = await ClassStudentIdModel.find({class: classId});

    let recordsUpdate = [];
    records.forEach(e => {
        const indexClass = listStudentOfClass.findIndex(e2 => e2.studentId == e.student_id);
        if (indexClass == -1) return;
        const studentId_id = listStudentOfClass[indexClass].id;
        recordsUpdate.push({
            classStudentId: studentId_id,
            classAssignment: classAssignmentId,
            score: e.score
        })
    })

    await ClassScoreModel.bulkWrite(
        recordsUpdate.map((stuScore) => 
          ({
            updateOne: {
              filter: { classStudentId : stuScore.classStudentId },
              update: { $set: stuScore },
              upsert: true
            }
          })
        )
    );

    return sendResponse( null, 201, res );
});

export const markReturnedByAssignmentId = catchAsync( async function(req, res, next){
    //TODO
    /**
     * mark all score in assignment is returned
     */
    return sendResponse( null, 200, res );
});

//get all score of all assignment of a class
export const getAssignmentsScoreByClassId = catchAsync( async function(req, res, next){
    const classId = req.params.classId;

    const assignmentsScore = await ClassScoreModel.find({class: classId});
    return res.json(assignmentsScore);
});

export const upload = multer({ dest: "./uploads/" });
