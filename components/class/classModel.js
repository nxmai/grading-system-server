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
    },
    {
        timestamps: true,
    }
);

ClassSchema.pre('save', async function (next) {
    if (this.name) this.name__search = convVie(this.name).toLowerCase();
    return next();
});

const Class = mongoose.model("Class", ClassSchema);

export default Class;
