import { Sequelize } from "sequelize-typescript"
import CustomerModel from "../../db/sequelize/models/customer.model";
import CustomerRepository from "../customer.repository";
import Customer from "../../../domain/entity/customer";
import Address from "../../../domain/entity/address";

describe("Costumer unity tests", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })
        await sequelize.addModels([CustomerModel])
        await sequelize.sync();
    })

    afterEach(async () => {
        await sequelize.close();
    })
    
    it("should create a costumer", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer");
        const address = new Address("street",1,"123","city");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "1" } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipCode: address.zip,
            city: address.city,
        });
    })

    it("should update a costumer", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer");
        const address = new Address("street",1,"123","city");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        customer.changeName("Customer Updated");
        await customerRepository.update(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "1" } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: "Customer Updated",
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipCode: address.zip,
            city: address.city,
        });
    })

    it("should find a costumer", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer");
        const address = new Address("street",1,"123","city");
        customer.changeAddress(address);
        customer.addRewardPoints(5);
        await customerRepository.create(customer);

        const customerResult = await customerRepository.findById(customer.id);
        
        expect(customer).toStrictEqual(customerResult);
    })

    it("should find all costumers", async () => {

        const customerRepository = new CustomerRepository();
        
        const customer1 = new Customer("1", "Customer 2");
        const address1 = new Address("street1",1,"zip 1","city 1");
        customer1.changeAddress(address1);
        customer1.addRewardPoints(10);
        customer1.activate();

        const customer2 = new Customer("2", "Customer 2");
        const address2 = new Address("street 2",2,"zip 2","city 2");
        customer2.changeAddress(address2);
        customer2.addRewardPoints(20);
        
        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const customers = await customerRepository.findAll();
        
        expect(customers).toHaveLength(2);
        expect(customers).toContainEqual(customer1);
        expect(customers).toContainEqual(customer2);
    })
})