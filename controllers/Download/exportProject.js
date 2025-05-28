const archiver = require("archiver");
const path = require("path");
const stream = require("stream");
const Project = require("../../models/project");

module.exports = async (req, res) => {
  try {
    const { ProjectId } = req.body;
    const project = await Project.findById(ProjectId);

    if (!project || !project.fileTree) {
      return res.status(404).json({ message: "Project not found", error: true });
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename=${project.projectName}.zip`);

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    await addFilesToArchive(archive, project.fileTree, project.projectName);

    archive.finalize(); // Finalize the ZIP file
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: true });
  }
};

async function addFilesToArchive(archive, fileTree, basePath = "") {
  for (const [key, value] of Object.entries(fileTree)) {
    const fullPath = path.join(basePath, key);
    if (typeof value === "object" && value !== null) {
      if (value.content !== undefined) {
        archive.append(value.content, { name: fullPath });
      } else {
        await addFilesToArchive(archive, value, fullPath);
      }
    }
  }
}
