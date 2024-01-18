import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeIncomeController } from './employee-income.controller';

describe('EmployeeIncomeController', () => {
  let controller: EmployeeIncomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeIncomeController],
    }).compile();

    controller = module.get<EmployeeIncomeController>(EmployeeIncomeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
