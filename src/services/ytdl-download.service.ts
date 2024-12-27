import ytdl from "@distube/ytdl-core";
import {
  IDownloadMedia,
  IDownloadMediaOutput,
  IDownload,
} from "./interfaces/download.interface";
import { IStorage } from "../storage/interfaces/storage.interface";
import { InternalError } from "../errors/internal-error";

export class YtdlDownloadService implements IDownload {
  private readonly headers = this.getDefaultHeaders();
  private readonly cookies = this.getDefaultCookies();

  constructor(private readonly storage: IStorage) {}

  private getDefaultHeaders(): Record<string, string> {
    return {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    };
  }

  private getDefaultCookies(): { name: string; value: string }[] {
    return [
      {
        name: "__Secure-1PSIDTS",
        value:
          "sidts-CjEBQT4rX9qLAXE_ibmNsz7gqSJO5Ue0yS_-fLvjSC7gBxaMc8Ld8b0p90UdWiJ3jNzmEAA",
      },
      {
        name: "__Secure-3PAPISID",
        value: "A8CK1MgF8g0irnZz/A3QIDW_f_D9pEToJs",
      },
      {
        name: "__Secure-3PSID",
        value:
          "g.a000nghNALlnXJ_dVSVLWbMw7db6hKumq8zGlyfoK52XsgBJrV9AvNptmR9Tp5GKBbM9CCICsQACgYKAaASARISFQHGX2MixAaxnJx3MDi1Ayi1dl3LKBoVAUF8yKqzKMyawmQWYoB5oEelttGB0076",
      },
      {
        name: "__Secure-3PSIDCC",
        value:
          "AKEyXzW_7G6PK-hOPPOKmIYFtZc9WJN1bX5W9dkIGkZgR1u5mXYZtTfMWtcAc98jtmodQckC-TI",
      },
      {
        name: "LOGIN_INFO",
        value:
          "AFmmF2swRgIhAIof808vDUjhbNrGQLT5ik7IgAAG_8xHGnfBzI9c_d65AiEAmM3BTT_OhgxUN-KZkktqI9TPa5sECB_mPRNpr13tVIc...",
      },
    ];
  }

  private validateParams({ url }: IDownloadMedia): void {
    if (!url) throw new InternalError("O parâmetro 'url' é obrigatório.", 404);
  }

  private async findFormat(
    videoInfo: ytdl.videoInfo
  ): Promise<ytdl.videoFormat> {
    const format = ytdl.chooseFormat(videoInfo.formats, {
      quality: "highest",
      filter: "videoandaudio",
    });

    if (!format) {
      throw new InternalError(
        `O video não possui formatos de download compatíveis.`,
        404
      );
    }

    return format;
  }

  private sanitizeFileName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9]/g, "_")
      .replace(/[<>:"\/\\|?*#]+/g, "")
      .replace(/[😀-🫿☀-➿]/gu, "");
  }

  async downloadMedia({ url }: IDownloadMedia): Promise<IDownloadMediaOutput> {
    this.validateParams({ url });

    try {
      const agent = ytdl.createAgent(this.cookies);

      const videoInfo = await ytdl.getInfo(url, {
        requestOptions: { headers: this.headers },
        agent,
      });

      const format = await this.findFormat(videoInfo);

      const title = this.sanitizeFileName(videoInfo.videoDetails.title);
      const fileName = `${title}.mp4`;

      console.log("Iniciando download...", fileName);

      const ytdlStream = ytdl(url, {
        format,
        requestOptions: { headers: this.headers },
        agent,
      });

      const totalSize = Number(format.contentLength);
      let downloadedSize = 0;

      ytdlStream.on("data", (chunk: Buffer) => {
        downloadedSize += chunk.length;
        const progress = ((downloadedSize / totalSize) * 100).toFixed(2);
        console.log(
          `Progresso do download: ${progress}% (${downloadedSize}/${totalSize} bytes)`
        );
      });

      ytdlStream.on("error", (error: Error) => {
        console.error("Erro ao baixar o vídeo:", error);
        throw new InternalError("Falha ao baixar o vídeo.", 503);
      });

      await this.storage.uploadFile({
        fileName,
        folderName: "media",
        fileStream: ytdlStream,
        fileSize: totalSize,
      });

      return { path: `media/${fileName}`, fileName };
    } catch (error) {
      console.error("Erro ao processar o download de mídia:", error);
      throw new InternalError("Falha ao baixar ou processar a mídia.", 503);
    }
  }
}
