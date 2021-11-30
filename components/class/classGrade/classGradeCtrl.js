import { LexoRank } from "lexorank";

import ClassGradeModel from "./classGradeModel.js";

export const createClassGrade = async function(req, res, next){
    const classId = req.params.classId;
    let data = req.body;
    data = {...data, class: classId};
    // get last grade
    const grades = await ClassGradeModel.find({
        class: classId,
    }).sort("-order").limit(1);

    const lexoRank = LexoRank.middle();
    let nextOrder = lexoRank.toString();

    if (grades.length !== 0) {
        const orderLast = grades[0].order;
        const parsedLexoRank = LexoRank.parse(orderLast);
        const lexoRankNextGne = parsedLexoRank.genNext();
        nextOrder = lexoRankNextGne.toString();
    }

    const test = await ClassGradeModel.create({
        ...data, order: nextOrder
    })
    return res.status(200).json(test);
};

export const updateClassGradeById =  async function(req, res, next) {
    const id = req.params.id;
    const data = req.body;

    const grade = await ClassGradeModel.findByIdAndUpdate(
        id,
        data
    )
    return res.json(grade);
};

export const updateOrderClassGrade = async function(req, res, next) {
    const classId = req.params.classId;
    const { from, to } = req.body;

    const grades = await ClassGradeModel.find({
        class: classId,
    }).sort("order");
    const fromInt = parseInt(from, 10);
    const toInt = parseInt(to, 10);
    const gradeFrom = grades[fromInt];
    
    let updateOrder = '';
    if (toInt == 0) { // get beforeOrder
        const orderTo = grades[toInt].order;
        const orderToLexoRank = LexoRank.parse(orderTo);
        const lexoRankGen = orderToLexoRank.genPrev();
        updateOrder = lexoRankGen.toString();
    } else { // get between
        const orderTo = grades[toInt].order;
        const orderToPre = grades[toInt -1].order;
        const orderToLexoRank = LexoRank.parse(orderTo);
        const orderToPreLexoRank = LexoRank.parse(orderToPre);
        const lexoRankGen = orderToPreLexoRank.between(orderToLexoRank);
        updateOrder = lexoRankGen.toString();
    }
    const grade = await ClassGradeModel.findByIdAndUpdate(
        gradeFrom.id,
        {
            order: updateOrder
        }
    )
    const gradesUpdated = await ClassGradeModel.find({
        class: classId,
    }).sort("order");
    return res.json(gradesUpdated);
};

export const getClassGradeByClassId = async function(req, res, next) {
    const classId = req.params.classId;

    const grades = await ClassGradeModel.find({class: classId}).sort("order");
    return res.json(grades);
};

export const deleteClassGradeById = async function(req, res, next) {
    const id = req.params.id;

    const grade = await ClassGradeModel.findByIdAndDelete(id);
    return res.json(grade);
};
