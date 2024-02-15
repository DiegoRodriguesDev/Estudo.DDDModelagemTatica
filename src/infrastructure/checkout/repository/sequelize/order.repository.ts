import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
            })),
        },
            {
                include: [{ model: OrderItemModel }]
            });
    }

    async update(entity: Order): Promise<void> {

        await OrderModel.update({
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
            })),
        },
            {
                where: {
                    id: entity.id
                }
            });

        const orderUpdated = await OrderModel.findByPk(entity.id, {
            include: [OrderItemModel],
        });

        entity.items.forEach(async (item) => {
            const indexItem = orderUpdated.items.findIndex((currentItem) => currentItem.id == item.id);
            if (indexItem === -1) {
                await OrderItemModel.create({
                    id: item.id,
                    order_id: entity.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity
                })
            }
        })
    }

    async findById(id: string): Promise<Order> {
        const order = await OrderModel.findByPk(id, {
            include: [OrderItemModel]
        });

        let items: OrderItem[] = order.items.map(
            (item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity));

        return new Order(order.id, order.customer_id, items);
    }

    async findAll(): Promise<Order[]> {
        let ordersModel = await OrderModel.findAll({
            include: [OrderItemModel]
        });

        let orders: Order[] = [];

        ordersModel.forEach((order) => {
            let items = order.items.map(
                (item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity));
            orders.push(new Order(order.id, order.customer_id, items));
        })

        return orders;
    }

}