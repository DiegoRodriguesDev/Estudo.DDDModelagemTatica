import Order from "../order";
import OrderItem from "../order_item";

describe("Order unity tests", () => {

    it("Should throw error when id is empty", () => {
        expect(() => {
            new Order("", "123", []);
        }).toThrow("Id is required");
    })

    it("Should throw error when costumerId is empty", () => {
        expect(() => {
            new Order("1", "", []);
        }).toThrow("CustomerId is required");
    })

    it("Should throw error when items is empty", () => {
        expect(() => {
            new Order("1", "123", []);
        }).toThrow("Items are required");
    })

    it("Should calculate total", () => {
        const item = new OrderItem("1","item",10,"1",2);
        const item2 = new OrderItem("2","item",30,"1",2);

        const order = new Order("1", "123", [item]);
        
        let total = order.total();

        expect(total).toBe(20);

        const order2 = new Order("o1", "c1",[item,item2]);
        total = order2.total();
        expect(total).toBe(80);
    })

    it("should throw when the quantity item is less or equal zero than 0",() => {
        expect(() => {
            const item = new OrderItem("i1","Item 1", 100, "p1", 0);
            const order = new Order("o1","c1",[item]);
        }).toThrow("Quantity must be greater than 0")
    })

})