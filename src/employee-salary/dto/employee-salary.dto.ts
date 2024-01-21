export interface EmployeeSalaryDto {
    ID: string;
    invoiceNumber?: string;
    amount: number;
    description: string;
    date: Date;
}

export interface CreateEmployeeSalaryDto {
    invoice: string;
    employee: string;
    amount: number;
    description: string;
    date: Date;
}

export interface QueryEmployeeSalaryDto {
    employee?: string;
    start?: Date;
    end?: Date;
}