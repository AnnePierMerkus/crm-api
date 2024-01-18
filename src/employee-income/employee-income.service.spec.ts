import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeIncomeService } from './employee-income.service';

describe('EmployeeIncomeService', () => {
  let service: EmployeeIncomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeIncomeService],
    }).compile();

    service = module.get<EmployeeIncomeService>(EmployeeIncomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
