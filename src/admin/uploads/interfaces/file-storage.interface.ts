export type UploadFileParams = {
  buffer: Buffer;
  contentType: string;
  key: string;
};

export type UploadFileResult = {
  key: string;
  url: string;
};

export interface FileStorageService {
  uploadFile(params: UploadFileParams): Promise<UploadFileResult>;
}
