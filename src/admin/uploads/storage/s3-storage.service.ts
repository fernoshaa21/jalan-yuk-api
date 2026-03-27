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
  private readonly region: string;
  private readonly bucket: string;
  private readonly client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.region = this.getRequiredConfig('AWS_REGION');
    this.bucket = this.getRequiredConfig('AWS_S3_BUCKET');

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.getRequiredConfig('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.getRequiredConfig('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(params: UploadFileParams): Promise<UploadFileResult> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
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
    if (this.region === 'us-east-1') {
      return `https://${this.bucket}.s3.amazonaws.com/${key}`;
    }

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  private getRequiredConfig(key: string): string {
    const value = this.configService.get<string>(key);

    if (!value?.trim()) {
      throw new InternalServerErrorException(`${key} is not configured`);
    }

    return value;
  }
}
