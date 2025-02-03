const Project = require("../models/project");
module.exports=fetchProjects = async(req,res)=>{
  try {
     console.log("fetch projects of user",req.body.user);
    
    const projects = await Project.find({
      $or: [
        { owner: req.body.user },
        { users: { $in: [req.body.user] } }
      ]
    }).populate('owner users');
    
    console.log(projects);
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