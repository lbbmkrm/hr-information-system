import EmployeeRepository from "../repositories/employee.repository.js";
import UserRepository from "../repositories/user.repository.js";
import AppError from "../utils/AppError.js";
import type {CreateEmployeeData, UpdateEmployeeData, EmployeeResponse, EmployeeFilter} from "../types/employeeTypes.js";

export default class EmployeeService{
    private employeeRepository: EmployeeRepository;
    private userRepository: UserRepository;

    constructor(){
        this.employeeRepository = new EmployeeRepository();
        this.userRepository = new UserRepository();
    }

    async createEmployee(data: CreateEmployeeData) : Promise<EmployeeResponse>{
        if(data.userId){
            const user = await this.userRepository.findById(data.userId);
            if(!user){
                throw new AppError("User not found", 404);
            }
            const employee = await this.employeeRepository.findByUserId(data.userId);
            if(employee){
                throw new AppError("User already has employee data", 409);
            }
        }
        return this.employeeRepository.addEmployee(data);
    }

    async getAllEmployees(filter: EmployeeFilter):Promise<EmployeeResponse[]>{
        return this.employeeRepository.findAll(filter);
    }

    async getEmployeeById(id:string):Promise<EmployeeResponse>{
        const employee = await this.employeeRepository.findById(id);
        if(!employee){
            throw new AppError("Employee not found", 404);
        }
        return employee;
    }

    async getEmployeeByUserId(id:string):Promise<EmployeeResponse>{
        const employee = await this.employeeRepository.findByUserId(id);
        if(!employee){
            throw new AppError("Employee not found", 404);
        }
        return employee;
    }

    async updateEmployee(id:string, data: UpdateEmployeeData): Promise<EmployeeResponse>{
        await this.getEmployeeById(id);
        return this.employeeRepository.update(id, data);
    }

    async deleteEmployee(id:string):Promise<void>{
        await this.getEmployeeById(id);
        await this.employeeRepository.delete(id);
        return;
    }
}