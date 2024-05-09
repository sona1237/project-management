import mongoose from "mongoose";

const task = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    description: String,
    title: String,
    status: { type: Boolean, default: false }, // Assuming false means pending and true means completed
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
});

const project = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: {
        type: String,
        unique: true // `Title` must be unique
    },
    createdDate: { type: Date, default: Date.now },
    Todos: [task]
}, { timestamps: true });

export default mongoose.model('Project', project);