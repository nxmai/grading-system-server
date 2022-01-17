import mongoose from "mongoose";
import { convVie } from "../../utils/convVie.js";

const ClassSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        subject: {
            type: String,
            trim: true,
        },
        coverUrl: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        name__search: {
            type: String,
            select: false,
        },
        description__search: {
            type: String,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

ClassSchema.index({ name__search: 'text', description__search: 'text'});

ClassSchema.pre('save', async function (next) {
    if (this.name) this.name__search = convVie(this.name).toLowerCase();
    if (this.description) this.description__search = convVie(this.description).toLowerCase();
    return next();
});

ClassSchema.pre(/findOneAndUpdate|updateOne|update/, function (next) {
    const docUpdate = this.getUpdate();
    // return if not update search
    if (!docUpdate) return next();
    const updateDocs = {};
    if (docUpdate.name) {
        updateDocs.name__search = convVie(docUpdate.name).toLowerCase();
    }
    if (docUpdate.description) {
        updateDocs.description__search = convVie(docUpdate.description).toLowerCase();
    }
    // update
    this.findOneAndUpdate({}, updateDocs);
    return next();
});

const Class = mongoose.model("Class", ClassSchema);

export default Class;
