import { LightningElement,api,wire,track } from 'lwc';
import { getRecord } from "lightning/uiRecordApi";
import TRACKING_NUMBER_FIELD from "@salesforce/schema/Shipment__c.Tracking_Number__c";
const TRACKING_ENDPOINT = 'https://merzcommunities--tina.sandbox.my.salesforce-sites.com/services/apexrest/mockShipmentStatus';

export default class ShipmentTracker extends LightningElement {
    @api recordId;
    @track record;
    trackingStatus;
    statusIcon;
    dataLoaded;// To toggle lightning spinner.
    currentTrackingNum;//Used to keep track of changes happening to tracking nuumber.
    
    //Wire operation to fetch the record data including shipment tracking number.
    @wire(getRecord, {recordId: "$recordId",fields: [TRACKING_NUMBER_FIELD]})
    shipmentRecord({ error, data }) {
        if (data) {
            this.record = data;
            //Only make the fetch call when the tracking number is updated and ignore all other field updates.
            if(this.currentTrackingNum !== this.record.fields.Tracking_Number__c.value){
                this.currentTrackingNum = this.record.fields.Tracking_Number__c.value;
                this.fetchData(this.currentTrackingNum);
            }
        } else if (error) {
            this.record = undefined;
            this.trackingStatus = "There's a problem with the wire operation. Please try refreshing the page.";
            this.statusIcon = "action:close";
            console.error("There's a problem with the wire operation:", error);
        }
    }
    
    //Fetching the data from the endpoint and setting the attributes based on the data.
    async fetchData(ipTrackingNum){
        this.dataLoaded = false;
        let endpoint = TRACKING_ENDPOINT;
        //Only add tracking number if it is available on the record.
        if(ipTrackingNum){
            endpoint += '?trackingNumber='+ipTrackingNum;
        }
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
              throw Error(response);
            }
            const result = await response.json();
            this.trackingStatus = result;
            this.statusIcon = result == "Shipped- On Time"? "action:approval": "action:priority";
        } catch (error) {
            console.error("There's a problem with your fetch operation:", error);
            this.trackingStatus = "There's a problem with your fetch operation. Please try refreshing the page.";
            this.statusIcon = "action:close"
        }
        this.dataLoaded = true;
    }
}