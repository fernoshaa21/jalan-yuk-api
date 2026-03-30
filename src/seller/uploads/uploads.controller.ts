import {
  BadRequestException,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { UploadsService } from '../../admin/uploads/uploads.service';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

@Controller('seller/uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('seller')
export class SellerUploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('activity-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    }),
  )
  async uploadActivityImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^(image\/jpeg|image\/png|image\/webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: MAX_FILE_SIZE,
        })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
          exceptionFactory: (errors) =>
            new BadRequestException(
              Array.isArray(errors) ? errors.join(', ') : errors,
            ),
        }),
    )
    file: Express.Multer.File,
  ) {
    const uploadedFile = await this.uploadsService.uploadActivityImage(file);

    return {
      data: {
        url: uploadedFile.url,
      },
      message: 'Image uploaded successfully',
      meta: null,
    };
  }
}
