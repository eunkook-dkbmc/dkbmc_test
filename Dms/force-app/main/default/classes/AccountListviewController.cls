/**
 * @description       : 
 * @author            : yoseong.kang@dkbmc.com
 * @group             : 
 * @last modified on  : 2024-08-22
 * @last modified by  : yoseong.kang@dkbmc.com
 * Modifications Log
 * Ver   Date         Author                   Modification
 * 1.0   2024-08-22   yoseong.kang@dkbmc.com   Initial Version
**/
public with sharing class AccountListviewController {
    @AuraEnabled
    public static List<Account> getCusList(String searchValue){
        List<Account> cusList = New List<Account>();
        String queryString = 'SELECT Id, Name FROM Account ';
        if(searchValue != null){
            queryString +=  ' WHERE Name LIKE \'%' + searchValue + '%\'';
        }
        cusList = Database.query(queryString);

        return cusList;
    }
}