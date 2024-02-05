import Address from "../../domain/entity/address";
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

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update(
            {
                name: entity.name,
                active: entity.isActive(),
                rewardPoints: entity.rewardPoints,
                street: entity.address.street,
                number: entity.address.number,
                zipCode: entity.address.zip,
                city: entity.address.city
            },
            {
                where:
                {
                    id: entity.id
                }
            });
    }

    async findById(id: string): Promise<Customer> {

        let customerModel: CustomerModel;
        try {
            customerModel = await CustomerModel.findOne(
                {
                    where: {
                        id: id
                    },
                    rejectOnEmpty: true,
                });
        }
        catch (error) {
            throw new Error("Customer not found");
        }

        const customer = new Customer(id, customerModel.name);
        const address = new Address(
            customerModel.street,
            customerModel.number,
            customerModel.zipCode,
            customerModel.city
        );
        customer.changeAddress(address);
        customer.addRewardPoints(customerModel.rewardPoints);
        if (customerModel.active) {
            customer.activate();
        }
        return customer;
    }

    async findAll(): Promise<Customer[]> {
        const customerModels = CustomerModel.findAll();
        const customers = (await customerModels).map((customerModels) => {
            let customer = new Customer(customerModels.id, customerModels.name);
            customer.addRewardPoints(customerModels.rewardPoints);
            let address = new Address(
                customerModels.street,
                customerModels.number,
                customerModels.zipCode,
                customerModels.city
            );
            customer.changeAddress(address);
            if (customerModels.active) {
                customer.activate();
            }
            return customer;
        });
        return customers;
    }
}