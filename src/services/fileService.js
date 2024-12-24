const fs = require("fs");
const path = require("path");
const tempDir = path.join(__dirname, "..", "temp");

const ensureDirectoryExists = (dirName) => {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  return tempDir;
};

const getOutputFilePath = (videoPath, extension) => {
  return path.join(
    tempDir,
    "output",
    `${path.basename(videoPath, ".mp4")}_final.${extension}`
  );
};

const getFileName = (filePath) => {
  return path.basename(filePath);
};

const deleteFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Erro ao remover arquivo:", err);
  }
};

module.exports = {
  ensureDirectoryExists,
  getOutputFilePath,
  getFileName,
  deleteFile,
};
