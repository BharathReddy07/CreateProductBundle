public class ProductBundleProduct {
    @AuraEnabled
    public static String getTreeData(){
      //  List<Account> accs = [Select Id , Name,Rating,Type,(Select Id , Name,FirstName ,LastName,Email from Contacts) from Account];
       List<Product_Bundle__c> accs = [Select Id,Parent_Product__c,Child_Product__c,Quantity__c from Product_Bundle__c];
        List<AccountWrapper> aooo = new List<AccountWrapper>();
        for(Product_Bundle__c a : accs){
            AccountWrapper aWraper = new AccountWrapper() ; 
            aWraper.name =a.Id ;
            aWraper.label =a.Parent_Product__c ;
            aWraper.expanded =false ;
            List<Items> co = new List<Items>();
            for(Product_Bundle__c c : accs){
                Items conWrapp = new Items();
                conWrapp.name =c.Id ;
                system.debug('conWrapp.name:::'+conWrapp.name);
                conWrapp.label =c.Child_Product__c ;
                system.debug('conWrapp.label:::'+conWrapp.label);
                conWrapp.expanded =false ;
                co.add(conWrapp);
            }
            aWraper.items = co;
            aooo.add(aWraper);
            
        }
        return JSON.serializePretty(aooo) ;
    } 
    public Class AccountWrapper{
        @AuraEnabled
        public String name {get;set;}
        @AuraEnabled
        public String label {get;set;}       
        @AuraEnabled
        public Boolean expanded {get;set;}
        @AuraEnabled
        public List<Items> items {get;set;}
        
    }
    public Class Items{
        @AuraEnabled
        public String name {get;set;}
        @AuraEnabled
        public String label {get;set;}
        @AuraEnabled
        public Boolean expanded {get;set;}
        @AuraEnabled
        public List<Items> items {get;set;}
    }


    @AuraEnabled
    public static List<AggregateResult> getParentUniqueProductBundle(){
        List<AggregateResult> parentBundle = [Select Parent_Product__r.Name from Product_Bundle__c 
                                              where Parent_Product__c <> null group by Parent_Product__r.Name];
        system.debug('parentBundle:'+parentBundle);
        
        return parentBundle;
    }   
    
    @AuraEnabled
    public static List<Product_Bundle__c> getChildproductlist(){
        return [Select Id,Parent_Product__r.Name,Child_Product__r.Name,Quantity__c from Product_Bundle__c where Parent_Product__c <> null];
    }
    
    
    
    @Auraenabled
    public static List<Product_Bundle__c> delteChildProdById(String accid)
    {
        system.debug('accid :'+accid);
        System.debug('In controller delteAccountById method..');
        Product_Bundle__c delAccount=[Select Id from Product_Bundle__c where id=:accid];
        system.Debug('delAccount :'+delAccount);
        delete delAccount;
        return [Select ID,Parent_Product__c,Child_Product__c from Product_Bundle__c ORDER BY CREATEDDATE DESC LIMIT 10];
    }
    
    @AuraEnabled 

    public static Boolean updateQty(String solilistjson) {

        Boolean updateStatus = true;

        try{

            system.debug('solilistjson:::'+solilistjson);            

            list<Product_Bundle__c> SolilistUpdated = (List<Product_Bundle__c>)JSON.deserialize(solilistjson, List<Product_Bundle__c>.class);            

            system.debug('SolilistUpdated:::'+SolilistUpdated);

            upsert SolilistUpdated;

        }

        catch (Exception e) {

            updateStatus = false;

            System.debug('e:::'+e);

            System.debug(LoggingLevel.ERROR, e.getMessage());

        }

        return updateStatus;

    }
    
}