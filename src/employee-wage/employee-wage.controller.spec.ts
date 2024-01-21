import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeWageController } from './employee-wage.controller';

describe('EmployeeWageController', () => {
  let controller: EmployeeWageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeWageController],
    }).compile();

    controller = module.get<EmployeeWageController>(EmployeeWageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
