import mongoose from 'mongoose';

const reviewRequestSchema = new mongoose.Schema({
    classStudentId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'classStudentId2',
        required: [true, 'Review request must belong to one Student']
    },
    classAssignment: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'ClassAssignment',
        required: [true, 'Review request must belong to one Assignment']
    },
    scoreExpectation: {
        type: Number,
    },
    explanation: {
        type: String,
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
});

const classScore = mongoose.model('ReviewRequest', reviewRequestSchema);
export default classScore;
