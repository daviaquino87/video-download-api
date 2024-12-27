import { Readable } from "stream";

export interface IUploadFile {
  bucketName?: string;
  folderName?: string;
  fileName: string;
  fileStream: Readable;
  fileSize: number;
}

export interface IGetFile {
  bucketName?: string;
  fileName: string;
}

export type IDeleteFile = IGetFile;

export interface IStorage {
  verifyBucketExists(bucketName: string): Promise<boolean>;
  createBucket(bucketName: string): Promise<void>;
  uploadFile(params: IUploadFile): Promise<any>;
  getFile(params: IGetFile): Promise<any>;
  deleteFile(params: IDeleteFile): Promise<void>;
}
