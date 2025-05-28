const archiver = require("archiver");

module.exports = exportProject = async (req, res) => {
  try {
    const projectId = req.body.ProjectId;
    const project = await Project.findById(projectId);
    if (!project || !project.fileTree) {
      return res.status(404).json({ message: "Project not found", success: false });
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename=${project.projectName}.zip`);

    const archive = archiver("zip");
    archive.pipe(res);

    await zipFiles(archive, project.fileTree, "");
    archive.finalize();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error exporting project", success: false });
  }
};

async function zipFiles(archive, fileTree, basePath) {
  for (const [name, value] of Object.entries(fileTree)) {
    const currentPath = basePath ? `${basePath}/${name}` : name;
    if (value.content) {
      archive.append(value.content, { name: currentPath });
    } else {
      await zipFiles(archive, value, currentPath);
    }
  }
}
