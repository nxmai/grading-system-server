import mongoose from "mongoose";
import Class from "./classModel.js";

export const getClasses = async (req, res) => {
  try {
    const total = await Class.find();

    res.status(200).json(total);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createClass = async (req, res) => {
  try{
    const newClass = new Class({...req.body});
    await newClass.save();

    res.status(201).json(newClass);
  } catch{
    res.status(404).json({ message: error.message });
  }
}
