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
        customer.Address = address;
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
})