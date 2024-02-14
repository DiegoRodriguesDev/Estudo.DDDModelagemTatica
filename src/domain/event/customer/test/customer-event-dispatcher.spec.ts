import Address from "../../../entity/address";
import Customer from "../../../entity/customer";
import { EventDispatcher } from "../../@shared/event-dispatcher"
import CustomerAddressChangedEvent from "../customer-address-changed.event";
import CustomerCreatedEvent from "../customer-created.event";
import SendLogWhenCustomerAddressIsChangedHandler from "../handler/send-log-when-customer-address-is-changed.handler";
import SendLogWhenCustomerIsCreatedHandler from "../handler/send-log-when-customer-is-created.handler";
import SendLogWhenCustomerIsCreatedHandler2 from "../handler/send-log-when-customer-is-created.handler2";

describe("Customer events unity tests", () => {
    
    it("should create a customer event", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendLogWhenCustomerIsCreatedHandler();

        eventDispatcher.register("CustomerCreatedEvent",eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toMatchObject(eventHandler);
    })

    it("should notify customer created event",() => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendLogWhenCustomerIsCreatedHandler();
        const eventHandler2 = new SendLogWhenCustomerIsCreatedHandler2();
        const spyEventHandler1 = jest.spyOn(eventHandler, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        const customer = new Customer("1","Customer name");
        
        eventDispatcher.register("CustomerCreatedEvent", eventHandler);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);

        const customerCreatedEvent = new CustomerCreatedEvent({
            name: "CustomerCreatedEvent",
            data: customer
        })

        eventDispatcher.notify(customerCreatedEvent);
        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    })

    it("should notify customer address changed event",() => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendLogWhenCustomerAddressIsChangedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        
        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(eventHandler);
        
        const customer = new Customer("1","Test Customer Name");
        const address = new Address("Rua Teste", 123, "ZIP-123-123","Cidade Teste");
        
        customer.changeAddress(address);

        const customerAddressChangedEvent = new CustomerAddressChangedEvent({
            name: "CustomerAddressChangedEvent",
            data: {
                id: customer.id,
                name: customer.name,
                address: customer.address.toString()
            }
        });

        eventDispatcher.notify(customerAddressChangedEvent);
        expect(spyEventHandler).toHaveBeenCalled();
    })

}) 