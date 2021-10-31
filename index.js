import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors()); 

import connectDB from "./data/configData.js";
connectDB();

import classesRouter from './components/classes/index.js';

app.use('/', classesRouter); 

app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running on port', process.env.PORT);
})

// mongoose.connect( process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology:true })
//     .then(() => app.listen( process.env.PORT, () => console.log(`Server running on port ${ process.env.PORT}`)))
//     .catch((error) => console.log('error', error.message));
    
// mongoose.set('useFindAndModify', false);
