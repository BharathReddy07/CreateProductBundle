({
    doInit : function(component, event, helper) {
        component.set("v.noEmptyRecord",false);
        //helper.initializeRetailer(component,helper);
        component.set("v.SearchKeyWord","");
        component.set("v.SearchUserKeyWord","");
        component.set("v.selectedChildProduct",[]);
    },
    fetchParent : function(component, event, helper) {
        document.getElementById('errorMissingSelected').innerHTML='';
        helper.openModal(component,helper);
    },
    
    addUser : function(component, event, helper) {
        document.getElementById('errorMissingSelected').innerHTML='';
        var parentproduct = component.get("v.SearchKeyWord");
        if(parentproduct == null || parentproduct == ""){
            var text = 'Please select Child Product';
            helper.selectErrorToast(component,event,helper,text);
            return;
        }
        
        
        var actionRetailer = component.get("c.fetchparentProduct"); 
        // alert('retailer :'+retailer);
        actionRetailer.setParams({
            "parentproduct" : parentproduct
        });
        actionRetailer.setCallback(this,function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {                
                var result = response.getReturnValue();
                for (var i = 0; i < result.length; i++) {
                    //alert(result[i].Name);
                    //alert(result[i].Id);
                    component.set("v.selectedProductData.Name",result[i].Name);
                    component.set("v.selectedProductdata.Id",result[i].Id);
                }        
            }else if(state === "ERROR") {
                var errors = response.getError();
                console.error(errors);                
            }
        });
        $A.enqueueAction(actionRetailer);
        
        
        
        var action = component.get("c.getchildProduct"); 
        action.setParams({
            "childproduct" : childproduct
        });
        action.setCallback(this,function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {                
                var result = response.getReturnValue();
                var newList = [];
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                    if (row.User__c) row.User__c = row.User__r.Name;
                    component.set("v.selectedChildProduct",result);
                }
                
                
                helper.openModal(component,helper);
            }else if(state === "ERROR") {
                var errors = response.getError();
                console.error(errors);                
            }
        });
        $A.enqueueAction(action); 
        
        //helper.openModal(component,helper);
    },
    
    
    
    Save: function(component, event, helper) {
        var parentprod = component.get("v.selectedProductData");
        var userList = component.get("v.selectedChildProduct");
        var quant = userList;
        //alert('userList :'+ userList);
        //return;
        // alert('selectedProductData :'+retailer);
        //alert('selectedChildProduct :'+ userList);
        if(Object.keys(parentprod).length === 0){
            document.getElementById('errorMissingSelected').innerHTML='Please Select Parent Product';
            return;
        }
        if(userList == "" || userList == null || userList.length == 0){
            document.getElementById('errorMissingSelected').innerHTML='Please Select Child Product';
            return;
        }
        
        var action = component.get("c.saveData"); 
        //alert('retailer :'+retailer);
        //alert('userList :'+userList);
        
        action.setParams({
            "ParentProductitem" : parentprod,
            "ChildProductItemList" : userList
        });
        action.setCallback(this,function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {                
                var status =response.getReturnValue();
                //alert(response.getReturnValue());
                if(status){
                    component.rerenderList();
                    helper.clear(component,event,helper);
                    helper.closeModal(component, event, helper);
                    var text = 'Created Bundle  successfully.';
                    helper.successToast(component,event,helper,text);
                }
            }else if(state === "ERROR") {
                var errors = response.getError();
                console.error(errors);                
            }
        });
        $A.enqueueAction(action);        
    },
    
    openModal: function(component, event, helper) {
        var modal = component.find("addModal");
        var modalBackdrop = component.find("addModalBackdrop");
        $A.util.addClass(modal,"slds-fade-in-open");
        $A.util.addClass(modalBackdrop,"slds-backdrop_open");
    },
    closeModal: function(component, event, helper) {
        
        helper.clear(component,event,helper);
        component.rerenderList();
        var modal = component.find("addModal");
        var modalBackdrop = component.find("addModalBackdrop");
        $A.util.removeClass(modal,"slds-fade-in-open");
        $A.util.removeClass(modalBackdrop,"slds-backdrop_open");
    },
    
    
    
    keyPressController : function(component, event, helper) {
        var getInputkeyWord = component.get("v.SearchKeyWord");
        // check if getInputKeyWord size id more then 0 then open the lookup result List and 
        // call the helper 
        // else close the lookup result List part.   
        if( getInputkeyWord.length > 0 ){             
            var forOpen = component.find("searchRes");
            $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close');
            helper.searchParentHelper(component,event,getInputkeyWord);
        }
        else{  
            component.set("v.listOfSearchRecords", null ); 
            var forclose = component.find("searchRes");
            $A.util.addClass(forclose, 'slds-is-close');
            $A.util.removeClass(forclose, 'slds-is-open');
        }
    },
    
    keyPressUserController : function(component, event, helper) {
        var getInputkeyWord = component.get("v.SearchUserKeyWord");
        // check if getInputKeyWord size id more then 0 then open the lookup result List and 
        // call the helper 
        // else close the lookup result List part.   
        if( getInputkeyWord.length > 0 ){             
            var forOpen = component.find("searchUserRes");
            $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close');
            helper.searchChildHelper(component,event,getInputkeyWord);
        }
        else{  
            component.set("v.listOfUserSearchRecords", null ); 
            var forclose = component.find("searchUserRes");
            $A.util.addClass(forclose, 'slds-is-close');
            $A.util.removeClass(forclose, 'slds-is-open');
        }
    },
    // function to clear the selected retailer 
    clear :function(component,event,heplper){
        var pillTarget = component.find("lookup-pill");
        var lookUpTarget = component.find("lookupField"); 
        
        $A.util.addClass(pillTarget, 'slds-hide');
        $A.util.removeClass(pillTarget, 'slds-show');
        
        $A.util.addClass(lookUpTarget, 'slds-show');
        $A.util.removeClass(lookUpTarget, 'slds-hide');
        
        component.set("v.SearchKeyWord",null);
        component.set("v.listOfSearchRecords", null );
        component.set("v.selectedRetailerRecord", {} );   
    },
    
    
    // function to clear the selected Product 
    clearUser :function(component,event,heplper){
        
        var productName = event.getSource().get("v.name");    
        var getSelectdProductList = component.get("v.selectedChildProduct");
        console.log("productName:"+productName.Name);
        //var newUserList = [];
        for(var i = 0; i < getSelectdProductList.length; i++){
            if(getSelectdProductList[i].Id == productName){
                getSelectdProductList.splice(i, 1);
                component.set("v.selectedChildProduct", getSelectdProductList);
            }  
        }
        
        component.set("v.SearchUserKeyWord",null);
        component.set("v.listOfUserSearchRecords", null );  
    },
    
    // This function is called when the end User Select any Product.   
    handleComponentEvent : function(component, event, helper) {
        var selectedrecordByEvent = event.getParam("recordByEvent");
        //alert('selectedrecordByEvent :'+selectedrecordByEvent);
        
        if(selectedrecordByEvent != null && selectedrecordByEvent != ""){            
            
            component.set("v.selectedProductData" , selectedrecordByEvent);
            var forclose = component.find("lookup-pill");
            $A.util.addClass(forclose, 'slds-show');
            $A.util.removeClass(forclose, 'slds-hide');
            
            var forclose = component.find("searchRes");
            $A.util.addClass(forclose, 'slds-is-close');
            $A.util.removeClass(forclose, 'slds-is-open');
            
            var lookUpTarget = component.find("lookupField");
            $A.util.addClass(lookUpTarget, 'slds-hide');
            $A.util.removeClass(lookUpTarget, 'slds-show');
        }
        var selectedUserrecordByEvent = event.getParam("recordUserByEvent");
        if(selectedUserrecordByEvent != null && selectedUserrecordByEvent != ""){
            
            var pushToSelectdUser = component.get("v.selectedChildProduct")
            pushToSelectdUser.push(selectedUserrecordByEvent);
            component.set("v.selectedChildProduct" , pushToSelectdUser);
            var forclose = component.find("lookupUser-pill");
            $A.util.addClass(forclose, 'slds-show');
            $A.util.removeClass(forclose, 'slds-hide');
            
            var forclose = component.find("searchUserRes");
            $A.util.addClass(forclose, 'slds-is-close');
            $A.util.removeClass(forclose, 'slds-is-open');
            
            
        }
        
    }
    })