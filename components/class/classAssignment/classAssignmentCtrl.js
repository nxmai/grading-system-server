import { LexoRank } from "lexorank";

import AssignmentModel from "./classAssignmentModel.js";

export const createAssignment = async function(req, res, next){
    const classId = req.params.classId;
    let data = req.body;
    data = {...data, class: classId};
    // get last assignment
    const assignments = await AssignmentModel.find({
        class: classId,
    }).sort("-order").limit(1);

    const lexoRank = LexoRank.middle();
    let nextOrder = lexoRank.toString();

    if (assignments.length !== 0) {
        const orderLast = assignments[0].order;
        const parsedLexoRank = LexoRank.parse(orderLast);
        const lexoRankNextGne = parsedLexoRank.genNext();
        nextOrder = lexoRankNextGne.toString();
    }

    const test = await AssignmentModel.create({
        ...data, order: nextOrder
    })
    return res.status(200).json(test);
};

export const updateAssignmentById =  async function(req, res, next) {
    const id = req.params.id;
    const data = req.body;

    const assignment = await AssignmentModel.findByIdAndUpdate(
        id,
        data
    )
    return res.json(assignment);
};

export const updateOrderAssignment = async function(req, res, next) {
    const classId = req.params.classId;
    const { from, to } = req.body;

    const assignments = await AssignmentModel.find({
        class: classId,
    }).sort("order");
    const fromInt = parseInt(from, 10);
    const toInt = parseInt(to, 10);
    const assignmentFrom = assignments[fromInt];
    
    let updateOrder = '';
    if (toInt == 0) { // get beforeOrder
        const orderTo = assignments[toInt].order;
        const orderToLexoRank = LexoRank.parse(orderTo);
        const lexoRankGen = orderToLexoRank.genPrev();
        updateOrder = lexoRankGen.toString();
    } else { // get between
        const orderTo = assignments[toInt].order;
        const orderToPre = assignments[toInt -1].order;
        const orderToLexoRank = LexoRank.parse(orderTo);
        const orderToPreLexoRank = LexoRank.parse(orderToPre);
        const lexoRankGen = orderToPreLexoRank.between(orderToLexoRank);
        updateOrder = lexoRankGen.toString();
    }
    const assignment = await AssignmentModel.findByIdAndUpdate(
        assignmentFrom.id,
        {
            order: updateOrder
        }
    )
    const assignmentsUpdated = await AssignmentModel.find({
        class: classId,
    }).sort("order");
    return res.json(assignmentsUpdated);
};

export const getAssignmentByClassId = async function(req, res, next) {
    const classId = req.params.classId;

    const assignments = await AssignmentModel.find({class: classId}).sort("order");
    return res.json(assignments);
};

export const deleteAssignmentById = async function(req, res, next) {
    const id = req.params.id;

    const assignment = await AssignmentModel.findByIdAndDelete(id);
    return res.json(assignment);
};
