/**
 * @description       : 
 * @author            : yoseong.kang@dkbmc.com
 * @group             : 
 * @last modified on  : 2024-09-04
 * @last modified by  : yoseong.kang@dkbmc.com
 * Modifications Log
 * Ver   Date         Author                   Modification
 * 1.0   2024-09-03   yoseong.kang@dkbmc.com   Initial Version
**/
public with sharing class SalesRevenueController {
    @AuraEnabled
    public static String insertSales(SalesRevenue__c salesRevenue){
        try {
            insert salesRevenue;
            System.debug('sales:::' + salesRevenue);
            return 'Successful';
        } catch (Exception e) {
            System.debug('error:::' + e.getMessage());
            return e.getMessage();
        }
    }
}