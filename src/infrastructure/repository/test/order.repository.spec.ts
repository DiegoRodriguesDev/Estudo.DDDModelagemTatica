import { Sequelize } from "sequelize-typescript"
import CustomerModel from "../../db/sequelize/models/customer.model";
import CustomerRepository from "../customer.repository";
import Customer from "../../../domain/entity/customer";
import Address from "../../../domain/entity/address";
import OrderItemModel from "../../db/sequelize/models/order-item.model";
import ProductModel from "../../db/sequelize/models/product.model";
import ProductRepository from "../product.repository";
import Product from "../../../domain/entity/product";
import OrderItem from "../../../domain/entity/order_item";
import Order from "../../../domain/entity/order";
import OrderRepository from "../order.repository";
import OrderModel from "../../db/sequelize/models/order.model";

describe("Order Repository unity tests", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })
        await sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel])
        await sequelize.sync();
    })

    afterEach(async () => {
        await sequelize.close();
    })

    it("should create a new order", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer");
        const address = new Address("Street 1", 123, "zip123", "City");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);

        const order = new Order("123", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order)

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "c1",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    order_id: "123",
                    product_id: orderItem.productId,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                }
            ]
        })
    })
})