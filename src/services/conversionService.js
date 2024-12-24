const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

const convertToMp3 = (inputPath, outputPath) => {
  const outputMp3 = outputPath.replace(".mp3", "_converted.mp3");
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec("libmp3lame")
      .audioBitrate(128)
      .save(outputMp3)
      .on("end", () => {
        fs.unlinkSync(inputPath);
        resolve(outputMp3);
      })
      .on("error", (err) => reject(err));
  });
};

const combineAudioAndVideo = (videoPath, audioPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .output(outputPath)
      .outputOptions("-c:v", "copy")
      .outputOptions("-c:a", "aac")
      .outputOptions("-strict", "experimental")
      .outputOptions("-map", "0:v:0")
      .outputOptions("-map", "1:a:0")
      .on("end", () => {
        try {
          fs.unlinkSync(videoPath);
          fs.unlinkSync(audioPath);
          console.log("Arquivos temporários removidos.");
        } catch (err) {
          console.error("Erro ao remover arquivos temporários:", err);
        }
        resolve(outputPath);
      })
      .on("error", (err) => reject(err))
      .run();
  });
};

module.exports = { convertToMp3, combineAudioAndVideo };
