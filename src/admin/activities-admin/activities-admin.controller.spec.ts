import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesAdminController } from './activities-admin.controller';

describe('ActivitiesAdminController', () => {
  let controller: ActivitiesAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesAdminController],
    }).compile();

    controller = module.get<ActivitiesAdminController>(ActivitiesAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
