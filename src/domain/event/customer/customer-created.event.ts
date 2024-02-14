import EventInterface from "../@shared/event.interface";

export default class CustomerCreatedEvent implements EventInterface {
    dataTimeOcccurred: Date;
    eventData: any;

    constructor(eventData: any) {
        this.eventData = eventData;
        this.dataTimeOcccurred = new Date();
    }
}