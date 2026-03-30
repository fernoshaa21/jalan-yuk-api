import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  FileStorageService,
  UploadFileParams,
  UploadFileResult,
} from '../interfaces/file-storage.interface';

@Injectable()
export class S3StorageService implements FileStorageService {
  private client: S3Client | null = null;

  constructor(private readonly configService: ConfigService) {
  }

  async uploadFile(params: UploadFileParams): Promise<UploadFileResult> {
    const client = this.getClient();

    await client.send(
      new PutObjectCommand({
        Bucket: this.getBucket(),
        Key: params.key,
        Body: params.buffer,
        ContentType: params.contentType,
      }),
    );

    return {
      key: params.key,
      url: this.buildPublicUrl(params.key),
    };
  }

  private buildPublicUrl(key: string): string {
    const region = this.getRegion();
    const bucket = this.getBucket();

    if (region === 'us-east-1') {
      return `https://${bucket}.s3.amazonaws.com/${key}`;
    }

    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  }

  private getClient(): S3Client {
    if (this.client) {
      return this.client;
    }

    this.client = new S3Client({
      region: this.getRegion(),
      credentials: {
        accessKeyId: this.getRequiredConfig('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.getRequiredConfig('AWS_SECRET_ACCESS_KEY'),
      },
    });

    return this.client;
  }

  private getRegion(): string {
    return this.getRequiredConfig('AWS_REGION');
  }

  private getBucket(): string {
    return this.getRequiredConfig('AWS_S3_BUCKET');
  }

  private getRequiredConfig(key: string): string {
    const value = this.configService.get<string>(key);

    if (!value?.trim()) {
      throw new InternalServerErrorException(`${key} is not configured`);
    }

    return value;
  }
}
