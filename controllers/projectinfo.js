const project = require("../models/project");

module.exports = projectinfo = async (req, res) => {
  try {
    if (!req.body.project) {
      throw new Error("Project not found");
    }

    // Populate the users array
    const data = await project
      .findById(req.body.project)
      .populate('users'); // Populate user details

    if (!data) {
      throw new Error("Project not found");
    }

    res.status(200).json({
      success: true,
      data: data,
      error: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred",
      error: true,
    });
  }
};
