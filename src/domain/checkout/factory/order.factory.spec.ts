import { v4 } from "uuid";
import OrderFactory from "./order.factory";

describe("Order factory unit test", () => {

    it("Should create an order", () => {

        const orderProps = {
            id: v4(),
            customerId: v4(),
            items: [
                {
                    id: v4(),
                    name: "Product 1",
                    productId: v4(),
                    quantity: 1,
                    price: 100
                }
            ]
        };

        const order = OrderFactory.create(orderProps);

        expect(order.id).toEqual(orderProps.id);
        expect(order.customerId).toEqual(orderProps.customerId);
        expect(order.items.length).toBe(1);

    });
});