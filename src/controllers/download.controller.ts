import { Request, Response } from "express";
import { IController } from "../interfaces/controller";
import { DownloadVideoUseCase } from "../use-cases/download-video.usecase";
import { InternalError } from "../errors/internal-error";
import { RemoveFileFromStorageUseCase } from "../use-cases/remove-file-from-storage.usecase";

export class DownloadController implements IController<void> {
  constructor(
    private readonly downloadVideoUseCase: DownloadVideoUseCase,
    private readonly removeFileFromStorageUseCase: RemoveFileFromStorageUseCase
  ) {}

  async handler(req: Request, res: Response): Promise<void> {
    const { url } = req.query;

    const { stream, fileName, videoPath } =
      await this.downloadVideoUseCase.execute({
        url: url as string,
      });

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "video/mp4");

    stream
      .pipe(res)
      .on("finish", async () => {
        await this.removeFileFromStorageUseCase.execute({
          videoPath,
        });
      })
      .on("error", (error) => {
        console.error("Stream error:", error);
        throw new InternalError(
          "An error occurred while streaming the video",
          503
        );
      });
  }
}
