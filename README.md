This project contains files related to the coding assessment from Merz.

**Assumptions made:**
1. Api Name of the shipment object is Shipment__c.
2. Api Name of the tracking number field on Shipment Object is Tracking_Number__c.

The repo contains two approaches to solving the problem:
1. Fetch the status directly from LWC.
2. Fetch the status using an Apex Controller in the back end to make the api call. This approach is also provided as I faced issues related to CORS while trying to use the Fetch function directly in LWC.

**Approach One -** Only using LWC:

This approach only uses LWC and automatically updates the tracking status on the page as a wire adapter is used along with the fetch operation. I faced issues with fetch operation not working due to the CORS issue but worked around that by using a chrome extension to bypass the issue.

**Configurations :**

1. Added the end point to Trusted Urls so that the outbound call can be made.
2. Used a chrome extension to workaround the CORS issue.

**shipmentTracker.html:** A card component with spinner, a status icon and the tracking status. 

* Spinner is displayed during the data load process. 
* Various icons are used in order to provide some visual representation of status to make it easier to understand.
* Tracking status or Error Statuses are displayed based on the response from the fetch call.

**shipmentTracker.js:** Wire adapter along with Ui Api and fetch operation are used.

* recordId attribute is available to use as the component is placed on a record detail page. This recordId attribute is used in the wire adapter call to fetch the record data.
* Wire Adapter along with a ui api function(getRecord) is used to get the tracking number of the record which is then later used to make the fetch call. This also enables automatic refresh of the component whenever the tracking number is updated. The wire component is refreshed anytime any field on record is updated but we only care about the tracking number updates for the fetch call. This is achieved by storing the status of the current and updated tracking number.
* A fetch call is made to the external Api Provided with the tracking number information.
* Various attributes are updated based on the information from the fetch call. These attributes include tracking status, status icon and data load status. Appropriate icons are displayed as per the tracking status for ease of understanding. Error messages are displayed and also additional details are logged in the console window.

**shipmentTracker.js-meta.xml:** 

* isExposed is Set to True in order to expose the component to the platform.
* Target Config lightning__RecordPage is used to allow the component to be used on a lightning detail page as per the requirement.

**Approach Two -** LWC + Apex Controller:

This approach uses LWC and Apex controller in the back end. Api call to fetch the tracking status is made through Apex and the response is parsed and sent back to the LWC which then updates ui attributes based on the response.

**Configurations :**
1. Added the end point to remote site settings to allow the outbound api call. Remote site setting is used instead of Named credentials for simplicity as there is no authentication protocol or authentication parameters are needed. This can be replaced with named credentials if needed.

**shipmentTracker.html:** A card component with spinner, a status icon, a refresh button and the tracking status. 

* Spinner is displayed during the data load process. 
* Various icons are used in order to provide some visual representation of status to make it easier to understand.
* Refresh button to force refresh the tracking status if the user updates the tracking number and wants to update the status based on the new tracking number.
* Tracking status or Error Statuses are displayed based on the response from the fetch call.

**shipmentTracker.js:** Imperative apex is used to call the apex method that makes the api call and sends the response back to LWC.

* recordId attribute is available to use as the component is placed on a record detail page. This recordId attribute is sent to Apex Controller which is then used to fetch the tracking number of shipment and then make the api call.
* Connected Callback is defined in order to kick off the data fetch process immediately when the component is loaded. Connected call back calls the imperative apex process.
* Apex method is called which fetches the tracking status and passes it to the lwc component. Various attributes are updated based on the response from the Apex method. These attributes include tracking status, status icon and data load status. Appropriate icons are displayed as per the tracking status for ease of understanding. Error messages are displayed and also additional details are logged in the console window.
* Refresh button logic is available which triggers the apex fetch logic and refreshes all the attributes on Ui.

**shipmentTracker.js-meta.xml:** 

* isExposed is Set to True in order to expose the component to the platform.
* Target Config lightning__RecordPage is used to allow the component to be used on a lightning detail page as per the requirement.

Testing the components with both approaches: Used account object as I was testing in my personal sandbox. Components are placed on the right side panel of the detail page. Component with refresh button is the component using Approach Two.

https://github.com/nadavalli/Merz-Project/assets/55205333/df5aa2e3-8660-4f81-9ae0-7ce764057bec



