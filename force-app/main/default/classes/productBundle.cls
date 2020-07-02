public class productBundle {
    
    
    @AuraEnabled
    public static List<Product2> fetchLookupParentProduct(String enteredValue) {
        
        String searchKey = '%' + enteredValue + '%';
        List <Product2> lstOfValues = [Select Name from Product2 where Name <> null and Product_Type__c != 'Component'and Product_Type__c != 'Bundle' and Name like : searchKey LIMIT 10];
        system.debug('Parent Poduct:'+lstOfValues);
        return lstOfValues;
    }
    @AuraEnabled
    public static List<Product2> fetchLookupChildProduct(String enteredValue) {
        
        String searchKey = '%' + enteredValue + '%';
        List <Product2> lstOfValues = [Select Name from Product2 where Name <> null and Product_Type__c = 'Component' and Name like : searchKey LIMIT 10];
        system.debug('Child Product:'+lstOfValues);
        return lstOfValues;
    }
    @AuraEnabled
    public static List<Product2> getchildProduct(String childproduct) { 
        List<Product2> userList= new List<Product2>();
        List<Product2> lstOfUsers = [Select Name, ProductCode, Family, Product_image_url__c,Product_Type__c,Description from Product2 where Name <> null and Product_Type__c = 'Component'and Name =:childproduct];        
        system.debug('lstOfUsers:'+lstOfUsers);
        return lstOfUsers;
    }
    @AuraEnabled
    public static List<Product2> fetchparentProduct(String parentproduct) {
        List <Product2> lstOfValues = [Select Name, ProductCode, Family, Product_image_url__c,Product_Type__c,Description from Product2 where Name <> null and Product_Type__c != 'Component'and Product_Type__c != 'Bundle'and Name =: parentproduct LIMIT 1];
        system.debug('lstOfValues:'+lstOfValues);
        return lstOfValues;
    }
    
    @AuraEnabled
    public static boolean saveData(Product2 ParentProductitem, List<Product2> ChildProductItemList) {
        boolean saveStatus = false;
        system.debug('ParentProductitem:'+ParentProductitem);
        system.debug('ChildProductItemList:'+ChildProductItemList);
        Product2 parentProduct = [Select Name, ProductCode, Family, Product_image_url__c,Product_Type__c,Description from Product2 where Id =:ParentProductitem.id]; 
        Product2 parentProductclone = new  Product2();
        list<Product2> validateProduct = [Select Product_Type__c from Product2 where Name =: ParentProductitem.Name and Product_Type__c='Bundle' ];
        system.debug(' validateProduct :'+validateProduct);
        
        List<Product_Bundle__c> insertList = new List<Product_Bundle__c>();
        if(validateProduct.size() == 0){
            parentProductclone = parentProduct.clone(false, false, false, false);
            parentProductclone.Product_Type__c ='Bundle';
            parentProductclone.Description = 'Bundle Product';
            insert parentProductclone;
            
            
            for (Product2 fetch : ChildProductItemList){
                Product_Bundle__c objInsert = new Product_Bundle__c(Parent_Product__c = parentProductclone.Id, Child_Product__c = fetch.Id,Quantity__c =fetch.Quantity_temp_holder__c);
                insertList.add(objInsert);
                
            }
        } else{            
             ID AccSel=validateProduct[0].id;
            system.debug('AccSel :'+AccSel);
            for (Product2 fetch : ChildProductItemList){
                Product_Bundle__c objInsert = new Product_Bundle__c(Parent_Product__c = AccSel, Child_Product__c = fetch.Id,Quantity__c =fetch.Quantity_temp_holder__c);
                insertList.add(objInsert);
                
            }
        }
        
        
        
        
        if(!insertList.isEmpty()){
            try{
                insert insertList;
                saveStatus = true;
            }catch(Exception e){
                system.debug('Insertion failed:'+e.getMessage());
            }            
        }
        return saveStatus;
    }
    
}