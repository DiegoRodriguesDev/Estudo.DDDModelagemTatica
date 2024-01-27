import Customer from "../../domain/entity/customer";
import CustomerRepositoryInterface from "../../domain/repository/customer-repository.interface";
import CustomerModel from "../db/sequelize/models/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {
    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
            street: entity.address.street,
            number: entity.address.number,
            zipCode: entity.address.zip,
            city: entity.address.city
        });
    }
    update(entity: Customer): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<Customer> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<Customer[]> {
        throw new Error("Method not implemented.");
    }

}