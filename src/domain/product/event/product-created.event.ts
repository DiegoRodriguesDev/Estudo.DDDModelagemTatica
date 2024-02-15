import EventInterface from "../../@shared/event/event.interface";

export default class ProductCreatedEvent implements EventInterface{
    dataTimeOcccurred: Date;
    eventData: any;

    constructor(eventData: any) {
        this.eventData = eventData;
        this.dataTimeOcccurred = new Date();
    }
}