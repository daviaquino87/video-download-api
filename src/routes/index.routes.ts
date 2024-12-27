import { Router } from "express";
import { DownloadController } from "../controllers/download.controller";
import { DownloadVideoUseCase } from "../use-cases/download-video.usecase";
import { YtdlDownloadService } from "../services/ytdl-download.service";
import { MinioStorage } from "../storage/minio/minio.storage";
import { env } from "../config/env.config";
import { InternalError } from "../errors/internal-error";

export const indexRoutes = Router();

const storageService = new MinioStorage({
  endPoint: env.STORAGE_ENDPOINT,
  accessKey: env.STORAGE_ACCESS_KEY,
  secretKey: env.STORAGE_SECRET_KEY,
  port: env.STORAGE_PORT,
  useSSL: env.STORAGE_USE_SSL,
  defaultBucketName: env.STORAGE_DEFAULT_BUCKET_NAME,
});

const downloadService = new YtdlDownloadService(storageService);

const downloadVideoUseCase = new DownloadVideoUseCase(
  downloadService,
  storageService
);

const downloadController = new DownloadController(downloadVideoUseCase);

indexRoutes.get("/download", (req, res) =>
  downloadController.handler(req, res)
);

indexRoutes.get("/", (req, res) => {
  throw new InternalError("Teste", 404);
});
