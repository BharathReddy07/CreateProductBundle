({
    openModal: function(component, event, helper) {                                                                             
        var modal = component.find("addModal");
        var modalBackdrop = component.find("addModalBackdrop");
        $A.util.addClass(modal,"slds-fade-in-open");
        $A.util.addClass(modalBackdrop,"slds-backdrop_open");
    },
    closeModal: function(component, event, helper) {
        
        
        var modal = component.find("addModal");
        var modalBackdrop = component.find("addModalBackdrop");
        $A.util.removeClass(modal,"slds-fade-in-open");
        $A.util.removeClass(modalBackdrop,"slds-backdrop_open");
    },
    
    searchParentHelper : function(component,event,getInputkeyWord) {
        
        // call the apex class method 
        var action = component.get("c.fetchLookupParentProduct"); 
        action.setParams({
            'enteredValue': getInputkeyWord
            
        });
        //alert('enteredValue :'+enteredValue);
        // set a callBack    
        action.setCallback(this, function(response) {
            $A.util.removeClass(component.find("mySpinner"), "slds-show");
            var state = response.getState();
            if (state === "SUCCESS") {                
                var storeResponse = response.getReturnValue();
                // alert(response.getReturnValue());
                // if storeResponse size is equal 0 ,display No Result Found... message on screen.                }
                if (storeResponse.length == 0) {
                    component.set("v.Message", 'No Result Found...');
                } else {
                    component.set("v.Message", '');
                }
                // set searchResult list with return value from server.
                component.set("v.listOfSearchRecords", storeResponse);
            }
            
        });
        $A.enqueueAction(action);        
    },
    searchChildHelper : function(component,event,getInputkeyWord) {
        
        // call the apex class method 
        var action = component.get("c.fetchLookupChildProduct"); 
        action.setParams({
            'enteredValue': getInputkeyWord
        });
        // set a callBack    
        action.setCallback(this, function(response) {
            $A.util.removeClass(component.find("mySpinner"), "slds-show");
            var state = response.getState();
            if (state === "SUCCESS") {                
                var storeResponse = response.getReturnValue();
                // if storeResponse size is equal 0 ,display No Result Found... message on screen.                }
                if (storeResponse.length == 0) {
                    component.set("v.Message", 'No Result Found...');
                } else {
                    component.set("v.Message", '');
                }
                // set searchResult list with return value from server.
                component.set("v.listOfUserSearchRecords", storeResponse);
            }
            
        });
        $A.enqueueAction(action);        
    },
    selectErrorToast: function(component,event,helper,text){
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: "Error",
            message: text,
            type: "error",
            mode:"sticky"
        });
        toastEvent.fire();
    },
    successToast: function(component,event,helper,text){
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: "Success!",
            message: text,
            type: "success",
            mode:"pester"
        });
        toastEvent.fire();
    },
    // function to clear the selected retailer 
    clear :function(component,event,helper){
        var pillTarget = component.find("lookup-pill");
        var lookUpTarget = component.find("lookupField"); 
        
        $A.util.addClass(pillTarget, 'slds-hide');
        $A.util.removeClass(pillTarget, 'slds-show');
        
        $A.util.addClass(lookUpTarget, 'slds-show');
        $A.util.removeClass(lookUpTarget, 'slds-hide');
        
        component.set("v.SearchKeyWord",null);
        component.set("v.listOfSearchRecords", null );
        component.set("v.selectedProductData", {} );   
    },
})