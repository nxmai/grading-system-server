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

import UserModel from "../../user/userModel.js";

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

export const getStudentByClassId = catchAsync( async function(req, res, next) {
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

    const classId = req.classUser.class._id;
    if (!classId) return new AppError('class not found', 404);

    const studentList = await ClassStudentIdModel.find({
        class: classId
    });

    const assignments = await ClassAssignmentModel.find({ class: classId }).sort("order");
    const assignmentsIds = assignments.map(e=>e._id);
    
    const scores = await ClassScoreModel.find({
        classAssignment: {
            $in: assignmentsIds
        },
    })

    let data = ['student_id'];
    data = [...data, ...assignments.map(e=> e.title), 'ava'];

    let dataStr = data.join(',') + '\n';
    studentList.forEach(student => {
        const scoreOfStudent = scores.filter(e => e.classStudentId == student.id);
        let avarage = 0;
        const dataRow = assignments.map((ass, i)=>{
            const index = scoreOfStudent.findIndex(e=> e.classAssignment == ass.id);
            if (index == -1) return ' ';
            const e = scoreOfStudent[index];
            avarage += (e.score ?? 0) /10*ass.grade;
            return `${e.score}`;
        });
        dataRow.unshift(student.studentId);
        dataRow.push(`${avarage}`);
        let strTemp = dataRow.join(',') + '\n';
        dataStr += strTemp;
    })

    // write and return file
    const randomStr = nanoid();
    const fileName = `full_score_of_class_${classId}_no_${randomStr}.csv`;
    const writeStream = fs.createWriteStream('tempt/'+ fileName);
    writeStream.write(dataStr, ()=>{
        // TODO : save file name to dtabase
        return res.download('tempt/' + fileName);
    });
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
    const listStudentHadScoreOfGrade = await ClassScoreModel.find({ classAssignment: classAssignmentId});
    // convert to csv

    // loop data element for writing data into file
    const data = ['student_id', 'score'];
    let dataStr = data.join(',') + '\n';
    listStudentOfClass.forEach(e => {
        let score = ' ';
        const index = listStudentHadScoreOfGrade.findIndex(e2=> e2.classStudentId == e.id);
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
export const createClassScore = catchAsync( async function(req, res, next){
    // TODO
    /**
     * create score of classStudent
     */
    const classId = req.classUser.class._id;
    if (!classId) return new AppError('class not found', 404);

    const resp = await ClassScoreModel.create({...req.body});
    return sendResponse( resp, 201, res );
});

export const updateClassScoreById = catchAsync( async function(req, res, next){
    // TODO
    /**
     * update specifi score
     * update returned
     * update score-draft
     */
    const scoreId = req.params.scoreId;
    const scoreStudent = await ClassScoreModel.findByIdAndUpdate(scoreId, req.body);
    return sendResponse( scoreStudent, 200, res );
});

export const uploadScoreByAssignmentId = catchAsync( async function(req, res, next){
    // TODO
    /**
     * create or update score of classStudent
     * check -> dont update classAssignmentId, classStudentId
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
    const classId = req.classUser.class._id;
    if (!classId) return new AppError('class not found', 404);
    const classAssignmentId = req.params.assignmentId;
    if (!classAssignmentId) return new AppError('assignment not found', 404);

    await ClassScoreModel.updateMany({
        classAssignment: classAssignmentId
    }, {
        isReturned: true
    })
    return sendResponse( null, 200, res );
});

export const getAssignmentsScoreByClassId = catchAsync( async function(req, res, next){
    const classId = req.params.classId;
    if (!classId) return new AppError('class not found', 404);

    const assignments = await ClassAssignmentModel.find({ class: classId }).sort("order");
    const assignmentsIds = assignments.map((e)=>e.id);

    const assignmentsScore = await ClassScoreModel.find({classAssignment: {
        $in: assignmentsIds
    }}).populate('classAssignment');

    return res.json(assignmentsScore);
});

export const getAssignmentsScoreByClassIdByStudentIdAndCountTotal = catchAsync( async function(req, res, next){
    const classId = req.params.classId;
    if (!classId) return new AppError('class not found', 404);
    const studentIdId = req.params.studentIdId;
    if (!studentIdId) return new AppError('studentId not found', 404);

    const assignments = await ClassAssignmentModel.find({ class: classId }).sort("order");
    const assignmentsIds = assignments.map((e)=>e.id);

    const assignmentsScoreData = await ClassScoreModel.find(
        {
            classAssignment: {
                $in: assignmentsIds
            },
            classStudentId: studentIdId
    }).populate('classAssignment');

    let avarage = 0;

    const data = assignments.map(ele=> {
        const index = assignmentsScoreData.findIndex(e=> e.classAssignment.id == ele.id);
        if (index == -1) return {
            _id: '',
            id: '',
            classStudentId: studentIdId,
            classAssignment: ele,
            score: 0,
            scoreDraft: 0,
            isReturned: false,
        };
        const e = assignmentsScoreData[index];
        avarage += (e.score ?? 0) /10*e.classAssignment.grade;
        return e;
    });

    const assignmentsScoreResp = {
        assignmentsScore: data,
        avarage: avarage
    };
    return res.json(assignmentsScoreResp);
});

export const getAssignmentsScoreByClassStudentId = catchAsync( async function(req, res, next){
    const classId = req.params.classId;
    if (!classId) return new AppError('class not found', 404);

    const classStudentId = req.params.classStudentId;
    const classAssignmentId = req.params.assignmentId;

    const assignmentsScoreData = await ClassScoreModel.findOne({
            classAssignment: classAssignmentId,
            classStudentId: classStudentId
    });

    return res.json(assignmentsScoreData);
});

export const upload = multer({ dest: "./uploads/" });
