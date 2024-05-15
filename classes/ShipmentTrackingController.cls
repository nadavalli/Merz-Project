/* 
Name        :   ShipmentTrackingController
Description :   This class is used to fetch the shipment tracking status based on the tracking number of the shipment.
Author      :   Nihar Adavalli
*/
public with sharing class ShipmentTrackingController {
    @AuraEnabled
    public static string getTrackingInfo(Id shipmentId){
        String trackingStatus;
        String END_POINT = 'https://merzcommunities--tina.sandbox.my.salesforce-sites.com/services/apexrest/mockShipmentStatus';
        try{
            Shipment__c shipment = [SELECT Id, Tracking_Number__c FROM Shipment__c WHERE Id =:shipmentId];
            
            //Append the tracking number to the end point only when their is a value available.
            END_POINT = String.isNotBlank(shipment.Tracking_Number__c) ? END_POINT + '?trackingNumber=' + shipment.Tracking_Number__c : END_POINT; 
            
            HttpRequest req = new HttpRequest();
            req.setEndpoint(END_POINT);
            req.setMethod('GET');
            
            Http http = new Http();
            HTTPResponse res = http.send(req);
            
            //Cleaning up the body to just return the status without " at the start and end.
            trackingStatus = res.getBody().remove('"');
            return trackingStatus;
        }catch(Exception ex){
            throw new AuraHandledException('Something went wrong while fetching the status: '+ex.getMessage());
        }
    }
}