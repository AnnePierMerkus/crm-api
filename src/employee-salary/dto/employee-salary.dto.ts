export interface EmployeeSalaryDto {
  ID: string;
  type: string;
  amount: number;
  activeFrom: Date;
  isActive: boolean;
}

export interface CreateEmployeeSalaryDto {
  employee: string;
  type: string;
  amount: number;
  activeFrom: Date;
}

export interface QueryEmployeeSalaryDto {
  employee?: string;
}
