const Project = require("../models/project"); // Ensure correct import path for your model

module.exports = addColab = async (req, res) => {
  try {
    const { selectedUsers, project } = req.body; // Destructure the incoming request body

    if (!project?._id || !selectedUsers?.length) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    // Extract user IDs from selectedUsers
    const userIds = selectedUsers.map((user) => user._id);

    // Update the project's users array
    const updatedProject = await Project.findByIdAndUpdate(
      project._id,
      { $addToSet: { users: { $each: userIds } } }, // $addToSet avoids duplicate entries
      { new: true } // Return the updated document
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      success: true,
      message: "Collaborators added successfully",
      updatedProject,
    });
  } catch (error) {
    console.error("Error adding collaborators:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
