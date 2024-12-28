import { Router } from "express";
import { DownloadController } from "../controllers/download.controller";
import { DownloadVideoUseCase } from "../use-cases/download-video.usecase";
import { YtdlDownloadService } from "../services/ytdl-download.service";
import { MinioStorage } from "../storage/minio/minio.storage";
import { RemoveFileFromStorageUseCase } from "../use-cases/remove-file-from-storage.usecase";

export const indexRoutes = Router();

const storageService = MinioStorage.getInstance();
const downloadService = new YtdlDownloadService(storageService);
const removeFileFromStorageUseCase = new RemoveFileFromStorageUseCase(
  storageService
);

const downloadController = new DownloadController(
  new DownloadVideoUseCase(downloadService, storageService),
  removeFileFromStorageUseCase
);

indexRoutes.get("/download", (req, res) =>
  downloadController.handler(req, res)
);
