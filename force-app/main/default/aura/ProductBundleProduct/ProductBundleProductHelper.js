({
    getUniqueParentProds : function(component, event, helper) {
        var action = component.get("c.getParentUniqueProductBundle");
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //alert(response.getReturnValue());
                component.set("v.uniqueParentProducts", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    
    getAccounts : function(component, event, helper) {
        var action = component.get("c.getChildproductlist");
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnedResult = response.getReturnValue();
                //component.set("v.data", response.getReturnValue());
                //alert("Inside");
                for(var i=0; i<returnedResult.length; i++){
                    //alert("InsideLoop");
                    //alert(returnedResult[i].Parent_Product__c);
                    var rows = returnedResult[i];
                    if (rows.Parent_Product__c) rows.Parent_Product__r.Name = rows.Parent_Product__r.Name;
                    //alert("rows:"+rows.Parent_Product__r.Name);
                }
                component.set('v.proBunList', response.getReturnValue());
                
            }
        });
        $A.enqueueAction(action);
    },

   
    /*
     * Show toast with provided params
     * */
    showToast : function(params){
        var toastEvent = $A.get("e.force:showToast");
        if(toastEvent){
            toastEvent.setParams(params);
            toastEvent.fire();
        } else{
            alert(params.message);
        }
    },

    /*
     * reload data table
     * */
    reloadDataTable : function(){
    var refreshEvent = $A.get("e.force:refreshView");
        if(refreshEvent){
            refreshEvent.fire();
        }
    },
    loadAccounts : function(component, event) {
        var action = component.get("c.getChildproductlist");
        action.setCallback(this, function(response) {
            component.set("v.accounts",response.getReturnValue());
            //alert('loadAccounts : '+response.getReturnValue())
        });
        $A.enqueueAction(action);
	},
     deleteAccount : function(component, event) {
        console.log('in delete account helper method.');
        var action = component.get("c.delteChildProdById");
        action.setParams({accid:event.target.id});
        action.setCallback(this, function(response) {
        	component.set("v.accounts",response.getReturnValue());
             $A.get('e.force:refreshView').fire();

        });
        $A.enqueueAction(action);
	},
    Updatequantity:function(component, event) {
        
        var qtyval;
        var temp= component.get("v.proBunList");
        alert("inside Upadte");
        for(var i=0;i<temp.length;i++)
        {            
            var newqty= temp[i].Quantity;
            //alert('newqty'+newqty);            
            if(!newqty || newqty<=0)
            {
                qtyval = temp[i].Quantity;
            }
        }
        component.set('v.proBunList',temp);
        if(qtyval || qtyval<=0 )
        {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: "Warning",
                message: 'Entered Product Quantity is not valid',
                type: "warning"
            });
            toastEvent.fire();
            return;
        }
        else{
            var QtyDisplay =JSON.stringify(component.get('v.proBunList'));
            var action = component.get("c.updateQty");
            action.setParams({ 
                "solilistjson":QtyDisplay
            });
            action.setCallback(this, function(response){
                var state = response.getState();
                if (state === "SUCCESS") 
                {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: "success",
                        message: 'Cart Updated Successfully',
                        type: "success"
                    });
                    toastEvent.fire();
                }
                else if (state === "INCOMPLETE") {
                    // do something
                }
                    else if (state === "ERROR") 
                    {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            title: "Error",
                            message: 'Contact System Admin ',
                            type: "Error"
                        });
                        toastEvent.fire();
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.log("Error message: " + 
                                            errors[0].message);
                            }
                        } 
                        else {
                            console.log("Unknown error");
                        }
                    }
            });
            $A.enqueueAction(action);
        }
        component.set("v.PlaceorderBtn",false);
        var PlaceorderBtn=component.find('placeorder');
        $A.util.removeClass(PlaceorderBtn, 'slds-button_disabled');
    },
    
})