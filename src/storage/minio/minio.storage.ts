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

    this.ensureBucketExists(defaultBucketName);
  }

  private async ensureBucketExists(bucketName: string): Promise<void> {
    const exists = await this.client.bucketExists(bucketName);
    if (!exists) {
      await this.client.makeBucket(bucketName);
      console.log(`Bucket '${bucketName}' criado com sucesso.`);
    } else {
      console.log(`Bucket '${bucketName}' já existe.`);
    }
  }

  async verifyBucketExists(bucketName: string): Promise<boolean> {
    const exists = await this.client.bucketExists(bucketName);
    return exists;
  }

  async createBucket(bucketName: string): Promise<void> {
    const exists = await this.verifyBucketExists(bucketName);
    if (!exists) {
      await this.client.makeBucket(bucketName);
    }
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
