import mongoose from 'mongoose';
const ClassGradechema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'a grade must title'],
    },
    grade: {
        type: Number,
        required: [true, 'a grade not null'],
    },
    class: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Class',
        required: [true, 'Grade must have a ClassID'],
    },
    order: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toObject: { virtuals: true },
})

const ClassGrade = mongoose.model('ClassGrade', ClassGradechema);
export default ClassGrade;
