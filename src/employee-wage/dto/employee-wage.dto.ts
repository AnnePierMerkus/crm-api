export interface EmployeeWageDto {
  ID: string;
  type: string;
  amount: number;
  activeFrom: Date;
  isActive: boolean;
}

export interface CreateEmployeeWageDto {
  employee: string;
  type: string;
  amount: number;
  activeFrom: Date;
}

export interface QueryEmployeeWageDto {
  employee?: string;
}
