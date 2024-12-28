import { IDownload } from "../services/interfaces/download.interface";
import { IStorage } from "../storage/interfaces/storage.interface";
import { IUseCase } from "../interfaces/use-case";
import { InternalError } from "../errors/internal-error";

interface IExecuteInput {
  url: string;
}

interface IExecuteOutput {
  stream: NodeJS.ReadableStream;
  fileName: string;
  videoPath: string;
}

export class DownloadVideoUseCase
  implements IUseCase<IExecuteInput, IExecuteOutput>
{
  constructor(
    private readonly downloadService: IDownload,
    private readonly storage: IStorage
  ) {}

  async execute({ url }: IExecuteInput): Promise<IExecuteOutput> {
    if (!url) throw new InternalError("O parâmetro 'url' é obrigatório.", 404);

    const { path: videoPath, fileName } =
      await this.downloadService.downloadMedia({
        url,
      });

    const stream = await this.storage.getFile({
      fileName: videoPath,
    });

    return { stream, fileName, videoPath };
  }
}
