import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { FILE_STORAGE_SERVICE } from './constants/storage.tokens';
import type {
  FileStorageService,
  UploadFileResult,
} from './interfaces/file-storage.interface';

@Injectable()
export class UploadsService {
  constructor(
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorageService: FileStorageService,
  ) {}

  async uploadActivityImage(file: Express.Multer.File): Promise<UploadFileResult> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('File is required');
    }

    const key = `activities/${this.generateFileName(file)}`;

    return this.fileStorageService.uploadFile({
      buffer: file.buffer,
      contentType: file.mimetype,
      key,
    });
  }

  private generateFileName(file: Express.Multer.File): string {
    const extension =
      this.normalizeExtension(extname(file.originalname)) ??
      this.mimeTypeToExtension(file.mimetype);

    return `activity-${Date.now()}-${randomUUID()}${extension}`;
  }

  private normalizeExtension(extension: string): string | null {
    const normalized = extension.trim().toLowerCase();

    if (['.jpg', '.jpeg', '.png', '.webp'].includes(normalized)) {
      return normalized;
    }

    return null;
  }

  private mimeTypeToExtension(mimeType: string): string {
    switch (mimeType) {
      case 'image/jpeg':
        return '.jpg';
      case 'image/png':
        return '.png';
      case 'image/webp':
        return '.webp';
      default:
        throw new BadRequestException('Unsupported file type');
    }
  }
}
