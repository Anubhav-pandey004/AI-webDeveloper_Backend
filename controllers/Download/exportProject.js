const archiver = require("archiver");
const Project = require("../../models/project");

module.exports = async (req, res) => {
  try {
    const { ProjectId } = req.body;

    const project = await Project.findById(ProjectId);
    if (!project || !project.fileTree) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${project.projectName}.zip"`,
    });

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    addFilesToArchive(archive, project.fileTree, "");

    await archive.finalize();
  } catch (error) {
    console.error(error);
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
