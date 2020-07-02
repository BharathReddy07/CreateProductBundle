({
    /*
     * This finction defined column header
     * and calls getChildproductlist helper method for column data
     * editable:'true' will make the column editable
     * */
    doInit : function(component, event, helper) {        
        component.set('v.columns', [
            {label: 'Child Product', fieldName: 'Child_Product__c', editable:'true', type: 'text'},
            {label: 'Quantity', fieldName: 'Quantity__c', editable:'true', type: 'text'}
        ]);        
        helper.getUniqueParentProds(component,event, helper);
        helper.getAccounts(component,event, helper);
    },

    
    
    doOnLoad : function(component, event, helper) {
        helper.loadAccounts(component, event);
	},
    
    delete : function(component, event, helper) {        
        if(confirm('Are you sure?'))
    	helper.deleteAccount(component, event);        
    },
 
  CalculateBoxQty : function(component, event,helper) 
    {
        //var index=event.getSource().get("v.name");
        component.set("v.PlaceorderBtn",true);
    },
        
  UpdateQuantity : function(component, event,helper) 
    {
        helper.Updatecart(component, event,helper);
        //component.set("v.PlaceorderBtn",true);
        //helper.CalBoxQty(component, event,helper);
    },
})