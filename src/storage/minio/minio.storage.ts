import { Client } from "minio";
import {
  IDeleteFile,
  IGetFile,
  IStorage,
  IUploadFile,
} from "../interfaces/storage.interface";
import { env } from "../../config/env.config";

interface IStorageParams {
  endPoint: string;
  port: number;
  accessKey: string;
  secretKey: string;
  useSSL: boolean;
  defaultBucketName: string;
}

export class MinioStorage implements IStorage {
  private client: Client;

  constructor({
    accessKey,
    endPoint,
    port,
    secretKey,
    useSSL,
    defaultBucketName,
  }: IStorageParams) {
    this.client = new Client({
      endPoint,
      port,
      accessKey,
      secretKey,
      useSSL,
    });

    (async () => {
      const exists = await this.verifyBucketExists(defaultBucketName);

      if (!exists) {
        await this.createBucket(defaultBucketName);
      }
    })();
  }
  async verifyBucketExists(bucketName: string): Promise<boolean> {
    const exists = await this.client.bucketExists(bucketName);

    if (exists) {
      return true;
    }

    return false;
  }

  async createBucket(bucketName: string): Promise<void> {
    await this.client.makeBucket(bucketName);
  }

  async uploadFile({
    bucketName,
    fileName,
    fileSize,
    fileStream,
    folderName,
  }: IUploadFile): Promise<any> {
    let filePath = fileName;
    let bucket = env.STORAGE_DEFAULT_BUCKET_NAME;

    if (folderName) {
      filePath = `${folderName}/${fileName}`;
    }

    if (bucketName) {
      bucket = bucketName;
    }

    return this.client.putObject(bucket, filePath, fileStream, fileSize);
  }

  async getFile({ bucketName, fileName }: IGetFile): Promise<any> {
    let bucket = env.STORAGE_DEFAULT_BUCKET_NAME;

    if (bucketName) {
      bucket = bucketName;
    }

    return this.client.getObject(bucket, fileName);
  }

  async deleteFile({ bucketName, fileName }: IDeleteFile) {
    let bucket = env.STORAGE_DEFAULT_BUCKET_NAME;

    if (bucketName) {
      bucket = bucketName;
    }

    await this.client.removeObject(bucket, fileName);
  }
}
