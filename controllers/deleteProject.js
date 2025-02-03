const Project = require('../models/project')
module.exports = deleteProject = async(req,res)=>{
    try {
        const {projectId} = req.body
        const project = await Project.findByIdAndDelete(projectId)
        res.status(200).json({
            message: "Project deleted successfully", 
            data:project,
            success:true,
            error:false
        })
    } catch (error) {
        res.status(500).json({
            message: "Error in deleting project",
            data:error,
            success:false,
            error:true
        })
    }
}