export interface IDownloadMedia {
  url: string;
}

export interface IDownloadMediaOutput {
  path: string;
  fileName: string;
}

export interface IDownload {
  downloadMedia(params: IDownloadMedia): Promise<IDownloadMediaOutput>;
}
