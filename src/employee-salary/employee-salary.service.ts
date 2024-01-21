import { Injectable, Query } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { EmployeeSalaryInterface } from './interfaces/employee-salary.interface';
import { InjectModel } from '@nestjs/mongoose';
import {
    CreateEmployeeSalaryDto,
    EmployeeSalaryDto,
    QueryEmployeeSalaryDto,
} from './dto/employee-salary.dto';
import { InvoiceService } from 'src/invoice/invoice.service';
import { InvoiceInterface } from 'src/invoice/interfaces/invoice.interface';
import { EmployeeWageService } from 'src/employee-wage/employee-wage.service';

@Injectable()
export class EmployeeSalaryService {
    constructor(
        @InjectModel('EmployeeSalary')
        private EmployeeSalaryModel: Model<EmployeeSalaryInterface>,
        private userService: UserService,
        private invoiceService: InvoiceService,
        private employeeWageService: EmployeeWageService,
    ) { }

    getTimeDifference(date1, date2) {
        const diffInMilliseconds = Math.abs(date2 - date1);
        return Math.floor(diffInMilliseconds / 60000);
    }

    async create(createEmployeeSalaryDto: CreateEmployeeSalaryDto): Promise<any> {
        const user = await this.userService.findById(
            createEmployeeSalaryDto.employee,
        );

        if (!user) {
            throw new Error('Employee not found');
        }

        let invoice: InvoiceInterface;
        try {
            invoice = await this.invoiceService.findById(
                createEmployeeSalaryDto.invoice,
            );
        } catch (error) {
            invoice = null;
        }

        const EmployeeSalary = await new this.EmployeeSalaryModel({
            employee: user,
            invoice: invoice,
            amount: createEmployeeSalaryDto.amount,
            description: createEmployeeSalaryDto.description,
            date: createEmployeeSalaryDto.date,
        }).save();

        return {
            ID: EmployeeSalary._id,
            employee: EmployeeSalary.employee,
            invoice: EmployeeSalary.invoice,
            amount: EmployeeSalary.amount,
            description: EmployeeSalary.description,
            date: EmployeeSalary.date,
        };
    }

    async createSalaryFromInvoices(employee: string): Promise<any> {
        const user = await this.userService.findById(employee);
        if (!user) {
            throw new Error('Employee not found');
        }

        const invoices = await this.invoiceService.findAllBy({
            employee: user._id,
        });
        if (!invoices) {
            throw new Error('Invoices not found');
        }
        let total = 0;
        for (const invoice of invoices) {
            const existingEmployeeSalary = await this.EmployeeSalaryModel.findOne({
                invoice: invoice._id,
                employee: user._id,
            }).exec();

            if (existingEmployeeSalary) {
                continue;
            }

            const date = invoice.start;
            const employeeWage = await this.employeeWageService.findActiveByDate(
                { employee },
                date,
            );

            let amount = 0;
            if (employeeWage.type === '%') {
                amount = invoice.price * (employeeWage.amount / 100);
            } else {
                const time = this.getTimeDifference(invoice.start, invoice.end);
                amount = time * (employeeWage.amount / 60);
            }

            await this.create({
                employee: user._id,
                invoice: invoice._id,
                amount: amount,
                description: 'Salary for invoice ' + invoice.number,
                date: invoice.start,
            });

            total++;
        }
        return total;
    }

    async findAllBy(query: QueryEmployeeSalaryDto): Promise<EmployeeSalaryDto[]> {
        const findQuery: any = {};
        if (query.start) {
            findQuery.start = { $gte: query.start };
        }

        if (query.end && findQuery.start) {
            findQuery.start = { ...findQuery.start, $lte: query.end };
        }

        if (query.employee) {
            findQuery.employee = query.employee;
        }

        const employeeSalaries = await this.EmployeeSalaryModel.find(findQuery)
            .populate('invoice')
            .populate('employee')
            .sort({ date: -1 })
            .exec();

        return employeeSalaries.map((employeeSalary) => {
            return {
                ID: employeeSalary._id,
                invoiceNumber: employeeSalary.invoice?.number,
                amount: employeeSalary.amount,
                description: employeeSalary.description,
                date: employeeSalary.date,
                employee: employeeSalary.employee,
            };
        });
    }
}
