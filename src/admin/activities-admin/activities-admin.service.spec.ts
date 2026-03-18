import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ActivitiesAdminService } from './activities-admin.service';
import { ActivitiesEntity } from '../../activities/entities/activities.entity';

describe('ActivitiesAdminService', () => {
  let service: ActivitiesAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesAdminService,
        {
          provide: getRepositoryToken(ActivitiesEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ActivitiesAdminService>(ActivitiesAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
