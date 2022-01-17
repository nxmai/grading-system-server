import mongoose from 'mongoose';

const classScoreSchema = new mongoose.Schema({
    classStudentId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'classStudentId2',
        required: [true, 'Score must have of one Student']
    },
    classAssignment: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'ClassAssignment',
        required: [true, 'Score must have of one Assignment']
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

classScoreSchema.methods.returnScore = async function () {
    const scoreD = this.scoreDraft;
    if (!scoreD) return;
    await this.updateOne({ score: scoreD, scoreDraft: null, isReturned: true });
};

classScoreSchema.methods.updateScore = async function (scoreD) {
    await this.updateOne({ score: scoreD, scoreDraft: null, isReturned: true });
};

const classScore = mongoose.model('ClassScore', classScoreSchema);
export default classScore;
