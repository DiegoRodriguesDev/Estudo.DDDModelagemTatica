import Product from "../product";

describe("Product unity tests", () => {

    it("Should throw error when id is empty", () => {
        expect(() => {
            new Product("","Product 1", 100);
        }).toThrow("Id is required");
    })

    it("Should throw error when name is empty", () => {
        expect(() => {
            new Product("123","", 100);
        }).toThrow("Name is required");
    })
    
    it("Should throw error when price is zero or less", () => {
        expect(() => {
            new Product("123","Description", -1);
        }).toThrow("Price must be greater than zero");
    })

    it("Should change name",() => {
        const product = new Product("123","product",10);
        product.changeName("Product 2");
        expect(product.name).toBe("Product 2");
    })

    it("Should change price",() => {
        const product = new Product("123","product",10);
        product.changePrice(20);
        expect(product.price).toBe(20);
    })

})