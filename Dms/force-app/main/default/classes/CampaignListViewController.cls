/**
 * @description       : 
 * @author            : kyunghoon.kim@dkbmc.com
 * @group             : 
 * @last modified on  : 09-04-2024
 * @last modified by  : kyunghoon.kim@dkbmc.com
**/
public with sharing class CampaignListViewController {

    @AuraEnabled
    public static List<SalesRevenue__c> getCamList(String searchKey){
        
        List<SalesRevenue__c> srList = New List<SalesRevenue__c>();
        
        String currentUser = UserInfo.getUserId();
        // String currentUser = '005dJ000000447ZQAQ'; // 김안녕 [고양대리점 딜러] 테스트
        // String currentUser = '005dJ000000449tQAA'; // 김생민 [고양대리점 관리자] 테스트

        List<User> currentUserList = [SELECT AccountId,Profile.Name FROM User WHERE Id =: currentUser];
        
        String accountId = currentUserList[0].AccountId;
        String profileName = currentUserList[0].Profile.Name;
        String queryString = 'SELECT Id,Name,SoldtoAccount__c,SoldtoAccount__r.Name,AmountKRW__c,NetPriceKRW__c,Quantity__c,BillDate__c FROM SalesRevenue__c ';
        
        if(profileName=='ST_DEALER') {
            queryString += 'WHERE SoldtoAccount__c =: accountId and Ownerid =: currentUser';
        } else if(profileName =='ST_MANAGER' || profileName =='ST_OWNER'){
            queryString += 'WHERE SoldtoAccount__c =: accountId';
        } 
        if(searchKey != null && searchKey != '') {
            if(profileName=='ST_DEALER' || profileName=='ST_MANAGER' || profileName=='ST_OWNER') {
                queryString += ' AND Name LIKE \'%' + String.escapeSingleQuotes(searchKey) + '%\' ';
            }
            else {
                queryString += ' WHERE Name LIKE \'%' + String.escapeSingleQuotes(searchKey) + '%\' ';
            }
        }

        
        srList = Database.query(queryString);
        return srList;
    }
    @AuraEnabled
    public static void deleteRecord(Id recordId) {
        delete [SELECT Id FROM SalesRevenue__c WHERE Id =: recordId];
    }
}