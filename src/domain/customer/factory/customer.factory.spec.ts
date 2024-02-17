import Address from "../value-object/address";
import CustomerFactory from "./customer.factory";

describe("Customer factory unit test",() => {

    it("should create a customer with factory", () => {
        let customer = CustomerFactory.create("John");

        expect(customer).toBeDefined();
        expect(customer.name).toBe("John");
        expect(customer.address).toBeUndefined();
    });

    it("should create a customer with with an address", () => {
        const address = new Address("Street",123,"ZIP1232","City");
        let customer = CustomerFactory.createWithAddress("John", address);

        expect(customer).toBeDefined();
        expect(customer.name).toBe("John");
        expect(customer.address).toBeDefined();
    });

});