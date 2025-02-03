const mongoose = require('mongoose')
const projectSchema = new mongoose.Schema(
    {
        projectName: {
            type: String,
            required: [true, "Project name is required"],
            lowercase: true,
            trim: true,
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        fileTree: {
            type: Object,
            default: {},
        },
        commands:{
            type: Object,
            default: {},
        }
        
    },
    { 
        timestamps: true,
        collation: { locale: 'en', strength: 2 }
    }
);

// Compound unique index for projectName and users
projectSchema.index({ projectName: 1, users: 1 }, { unique: true });

module.exports = mongoose.model("Project", projectSchema);
