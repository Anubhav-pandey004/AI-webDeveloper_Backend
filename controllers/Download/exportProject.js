const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const os = require("os"); // Import os module to get user's Downloads folder
const Project = require("../../models/project");

module.exports = exportProject = async (req, res) => {
  try {
    const projectId = req.body.ProjectId;


    const project = await Project.findById(projectId);
    if (!project || !project.fileTree) {

      return;
    }

    const downloadsPath = path.join(os.homedir(), "Downloads"); // System's Downloads folder
    const projectDir = path.join(downloadsPath, project.projectName);
    fs.mkdirSync(projectDir, { recursive: true });

    await saveFiles(projectDir, project.fileTree);
    console.log(project.projectName);
    res.status(200).json({
        message: "Project saved to your device",
        error: false,
        success: true,
    });
  } catch (error) {
    res.status(500).json({
        message: "Internal server error",
        error: true,
        success: false,
    });
  } 
};


async function saveFiles(directory, fileTree) {
  for (const [key, value] of Object.entries(fileTree)) {
    const filePath = path.join(directory, key);

    if (typeof value === "object" && value !== null) {
      if (value.content) {
        fs.writeFileSync(filePath, value.content);
      } else {
        fs.mkdirSync(filePath, { recursive: true });
        await saveFiles(filePath, value);
      }
    }
  }
}

