const Project = require("../models/project");
module.exports=fetchProjects = async(req,res)=>{
  try {

    
    const projects = await Project.find({
      $or: [
        { owner: req.body.user },
        { users: { $in: [req.body.user] } }
      ]
    }).populate('owner users');
    
    res.status(200).json({
        success: true,
        data: projects,
        error:false
    });
  } catch (error) {
    res.status(500).json({
        success: false,
        error:error
    });
  }
};