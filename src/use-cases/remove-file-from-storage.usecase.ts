import { IUseCase } from "../interfaces/use-case";
import { IStorage } from "../storage/interfaces/storage.interface";

interface IExecuteInput {
  videoPath: string;
}

export class RemoveFileFromStorageUseCase
  implements IUseCase<IExecuteInput, void>
{
  constructor(private readonly storage: IStorage) {}

  async execute({ videoPath }: IExecuteInput): Promise<void> {
    try {
      await this.storage.deleteFile({ fileName: videoPath });
    } catch (error) {
      console.error("Falha ao limpar o storage: ", error);
    }
  }
}
