const archiver = require("archiver");
const Project = require("../../models/project");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  try {
    const { ProjectId } = req.body;

    const project = await Project.findById(ProjectId);
    if (!project || !project.fileTree) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const zipFilePath = path.join("/tmp", `${project.projectName}.zip`);

    // If ZIP already exists, serve it directly
    if (fs.existsSync(zipFilePath)) {
      return res.download(zipFilePath);
    }

    // Otherwise, generate the ZIP and save to /tmp
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      return res.download(zipFilePath);
    });

    archive.on("error", (err) => {
      console.error("Archive error:", err);
      return res.status(500).json({ success: false, message: "Archiving failed" });
    });

    archive.pipe(output);
    addFilesToArchive(archive, project.fileTree, "");
    await archive.finalize();
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

function addFilesToArchive(archive, fileTree, currentPath) {
  for (const [name, value] of Object.entries(fileTree)) {
    const filePath = currentPath ? `${currentPath}/${name}` : name;
    if (value.content) {
      archive.append(value.content, { name: filePath });
    } else {
      addFilesToArchive(archive, value, filePath);
    }
  }
}
