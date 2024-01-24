import Address from "./entity/address";
import Customer from "./entity/customer";
import Order from "./entity/order";
import OrderItem from "./entity/order_item";

let custumer = new Customer("123", "Diego Rodrigues");
const address = new Address("Rua teste",123,"12321-123","BH");
custumer.Address = address;
custumer.activate();

const item1 = new OrderItem("1","Item 1", 10, "prod1",1);
const item2 = new OrderItem("2","Item 2", 15, "prod1",1);
const item3 = new OrderItem("3","Item 3", 20, "prod1",1);
const order = new Order("1","123",[item1, item2, item3]);

