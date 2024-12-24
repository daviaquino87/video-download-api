const ytdl = require("@distube/ytdl-core");
const fs = require("fs");
const path = require("path");
const { cookies, headers } = require("../utils/validation");
const tempDir = path.join(__dirname, "..", "temp");

const validateUrl = (url) => {
  if (!url || typeof url !== "string") {
    throw new Error("URL inválida!");
  }
};

const downloadMedia = async (url, mediaType = "video") => {
  validateUrl(url);

  try {
    const info = await ytdl.getInfo(url, {
      requestOptions: { headers, cookies },
    });

    const format = ytdl.chooseFormat(info.formats, {
      quality: "highest",
      filter: mediaType === "audio" ? "audio" : "videoandaudio",
    });

    if (!format) {
      throw new Error(`Nenhum formato de ${mediaType} encontrado.`);
    }

    const title = info.videoDetails.title
      .replace(/[<>:"\/\\|?*#]+/g, "")
      .replace(/[\u{1F600}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "");
    const outputDir = path.join(
      tempDir,
      mediaType === "audio" ? "audios" : "videos"
    );

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const outputPath = path.join(
      outputDir,
      `${title}.${mediaType === "audio" ? "mp3" : "mp4"}`
    );

    return new Promise((resolve, reject) => {
      ytdl(url, { format, requestOptions: { headers, cookies } })
        .pipe(fs.createWriteStream(outputPath))
        .on("finish", () => resolve(outputPath))
        .on("error", (err) => {
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
          reject(err);
        });
    });
  } catch (err) {
    console.error(`Erro ao baixar ${mediaType}: ${err.message}`);
    throw err;
  }
};

module.exports = { downloadMedia };
