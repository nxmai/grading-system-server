import mongoose from 'mongoose';

const classScoreSchema = new mongoose.Schema({
    classStudentId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'classStudentId',
        required: [true, 'Score must have of one Student']
    },
    classGrade: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'ClassGrade',
        required: [true, 'Score must have of one Grade']
    },
    score: {
        type: Number,
    },
    scoreDraft: {
        type: Number,
    },
    isReturned: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
});

const classScore = mongoose.model('ClassScore', classScoreSchema);
export default classScore;
