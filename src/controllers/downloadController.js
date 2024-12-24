const downloadService = require("../services/downloadService");
const conversionService = require("../services/conversionService");
const fileService = require("../services/fileService");
const fs = require("fs");

const processDownload = async (videoUrl, res) => {
  try {
    const videoPath = await downloadService.downloadMedia(videoUrl, "video");
    const audioPath = await downloadService.downloadMedia(videoUrl, "audio");
    const mp3Path = await conversionService.convertToMp3(audioPath, audioPath);

    fileService.ensureDirectoryExists("output");
    const outputPath = fileService.getOutputFilePath(videoPath, "mp4");

    await conversionService.combineAudioAndVideo(
      videoPath,
      mp3Path,
      outputPath
    );

    res.writeHead(200, {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="${fileService.getFileName(
        outputPath
      )}"`,
    });

    const readStream = fs.createReadStream(outputPath);
    readStream.pipe(res);

    readStream.on("end", () => {
      fileService.deleteFile(outputPath);
    });
  } catch (err) {
    console.error("Erro durante o processo de download e combinação:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(`Erro: ${err.message}`);
  }
};

module.exports = { processDownload };
