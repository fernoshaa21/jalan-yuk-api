import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { GetAdminUsersDto } from './dto/get-admin-users.dto';
import { AdminUsersService } from './users.service';

@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: AdminUsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async getUsers(@Query() query: GetAdminUsersDto) {
    const result = await this.usersService.getUsers(query);

    return {
      data: result.data,
      message: 'Admin users retrieved successfully',
      meta: result.meta,
    };
  }
}
