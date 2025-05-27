const Project = require("../models/project");

module.exports = saveProject = async(req,res)=>{
    try {
        const {fileTree, projectID , commands} = req.body;
        
        const response = await Project.findOneAndUpdate(
            { _id: projectID },  // Corrected query
            { fileTree , commands },         // Updating fileTree
            { new: true }         // Return the updated document
        );
        

        
        res.status(200).json({
            success: true,
            data: response,
            error: false,
          });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
            error: true,
          });
        
    }
}