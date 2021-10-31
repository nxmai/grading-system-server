import dotenv from "dotenv";
dotenv.config();

import data from './dummy.js';
import connectDB from './configData.js';
import Class from '../components/classes/classModel.js';

const classData = data;

connectDB();

const importData = async() => {
    try {
        await Class.deleteMany();
        await Class.insertMany(classData);

        console.log('Data import success');
        process.exit();
    } catch(error){
        console.error('Error with data import', error);
        process.exit(1);
    }
};

importData();
//use to import fake data for frontend, delete when complete backend