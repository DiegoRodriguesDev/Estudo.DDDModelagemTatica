import Address from "./address";
import Customer from "./customer";

describe("Custumer unit tests",() => {

    it("should throw error when id is empty", () => {
        expect(() => {
            new Customer("","John");
        }).toThrow("Id is required");
    })
    
    it("should throw error when name is empty", () => {
        expect(() => {
            new Customer("123","");
        }).toThrow("Name is required");
    })

    it("should change name",() => {
        // Arrange
        const customer = new Customer("123","John");
        // Act
        customer.changeName("Mary");
        // Assert
        expect(customer.name).toBe("Mary");
    })

    it("should activate customer", () => {
        const customer = new Customer("1","Customer 1");
        const address = new Address("Street 1", 123, "123123-123", "São Paulo");
        customer.Address = address;

        customer.activate();
        
        expect(customer.isActive()).toBe(true);
    })

    it("should throw error when address is undefined", () => {
        expect(() => {
            new Customer("1","Customer 1").activate();
        }).toThrow("Address is mandatory to activate a customer")
    })

    it("should deactivate customer", () => {
        const customer = new Customer("1","Customer 1");
        
        customer.deactivate();
        
        expect(customer.isActive()).toBe(false);
    })
    
});