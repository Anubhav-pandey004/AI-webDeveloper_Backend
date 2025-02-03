const Project = require('../models/project'); // Adjust path to your actual model

// Create a project
module.exports=createProject = async (req, res) => {
    let users = [];
    try {
        // Extract project details from the request body
        const { projectName, owner } = req.body;  // 'users' as an array of ObjectIds
        
        // Validate the input (you can add more validations as needed)
        if (!projectName || !owner ) {
            return res.status(400).json({ 
                message: 'Missing required fields or users list is empty' ,
                success: false,
                error : true
            });
        }
        if (!projectName || typeof projectName !== "string" || projectName.trim() === "") {
            return res.status(400).json({
                message: "Invalid project name",
                error: true,
                success: false,
            });
        }

        // Create a new project
        const newProject = new Project({
            projectName,
            users,  // 'users' array should contain valid user ObjectIds
            owner,
            createdAt: new Date(),
        });

        // Save the project to the database
        await newProject.save();

        // Send a success response
        res.status(201).json({
            message: 'Project created successfully',
            project: newProject,
            success: true,
            error : false
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Project name already exists. Please choose another name.",
                error: true,
                success: false, 
            });
        }
        console.error(error);
        res.status(500).json({ 
            message: 'Server error', 
            error: true,
            success: false, 
        });
    }
};
