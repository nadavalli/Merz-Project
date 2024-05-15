import { LightningElement, api,wire} from 'lwc';
import getTrackingDetails from '@salesforce/apex/ShipmentTrackingController.getTrackingInfo';

export default class ShipmentTrackerViaApex extends LightningElement {
    @api recordId;
    trackingStatus;
    statusIcon;
    dataLoaded;
    
    connectedCallback(){
        this.getTrackingInformation();
    }
    
    //Fetch tracking information and set the attributes based on response.
    getTrackingInformation(){
        this.dataLoaded = false;
        getTrackingDetails({shipmentId : this.recordId})
        .then(result =>{
            this.trackingStatus = result;
            this.statusIcon = result == "Shipped- On Time"? "action:approval": "action:priority";
            this.dataLoaded = true;
        }) 
        .catch(error =>{
            this.trackingStatus = "Something went wrong. Click on Refresh button to fetch status.";
            this.statusIcon = "action:close"
            this.dataLoaded = true;
            console.error(JSON.stringify(error));
        })
    }
    
    //Refresh the tracking information.
    refreshTracking(){
        this.getTrackingInformation(); 
    }
}