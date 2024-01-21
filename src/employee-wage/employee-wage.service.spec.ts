import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeWageService } from './employee-wage.service';

describe('EmployeeWageService', () => {
  let service: EmployeeWageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeWageService],
    }).compile();

    service = module.get<EmployeeWageService>(EmployeeWageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
