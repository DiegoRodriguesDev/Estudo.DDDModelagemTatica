import { Sequelize } from "sequelize-typescript"
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";
import OrderRepository from "./order.repository";
import OrderModel from "./order.model";

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
        const customer = new Customer("1", "Customer");
        const address = new Address("Street 1", 123, "zip123", "City");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);

        const order = new Order("1", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order)

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "1",
            customer_id: "1",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    order_id: "1",
                    product_id: orderItem.productId,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                }
            ]
        })
    })

    it("should update a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer");
        const address = new Address("Street 1", 123, "zip123", "City");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 10);
        const product2 = new Product("2", "Product 2", 20);
        await productRepository.create(product);
        await productRepository.create(product2);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 4);
        const order = new Order("1", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        order.AddItem(orderItem2);
        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        })

        expect(orderModel.toJSON()).toStrictEqual(
        {
            id: "1",
            customer_id: "1",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    order_id: "1",
                    product_id: orderItem.productId,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                },
                {
                    id: orderItem2.id,
                    name: orderItem2.name,
                    order_id: "1",
                    product_id: orderItem2.productId,
                    price: orderItem2.price,
                    quantity: orderItem2.quantity,
                }
            ]
        })
    })

    it("should find a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer");
        const address = new Address("Street 1", 123, "zip123", "City");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);

        const order = new Order("1", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order)
        const foundedOrder = await orderRepository.findById(order.id);

        expect(order).toStrictEqual(foundedOrder);
    })

    it("Should find all orders",async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer");
        const address = new Address("Street 1", 123, "zip123", "City");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const orderItem2 = new OrderItem("2", product.name, product.price, product.id, 2);

        const order = new Order("1", customer.id, [orderItem]);
        const order2 = new Order("2", customer.id, [orderItem2]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order)
        await orderRepository.create(order2)

        const foundedOrders = await orderRepository.findAll();

        expect(foundedOrders).toHaveLength(2);
        expect(foundedOrders).toContainEqual(order);
        expect(foundedOrders).toContainEqual(order2);
    })
})