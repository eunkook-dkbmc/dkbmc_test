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
import { LightningElement, track, wire } from 'lwc';
import getCusList from '@salesforce/apex/AccountListviewController.getCusList';

const columns = [
    { label: 'Name' ,fieldName: 'ConName' ,type:'url', typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'}},
    // { label: TodayContent, fieldName: 'Age__c', editable: true },
    // { label: 'Address', fieldName: 'Address__c', editable: true },
    // { label: 'Telephone', fieldName: 'Telephone__c', editable: true },
    // { label: 'Sex', fieldName: 'Sex__c', editable: true },
    // { label: 'Height', fieldName: 'Height__c', editable: true },
    // { label: 'Weight', fieldName: 'Weight__c', editable: true },
    // { label: 'BmiCalculator', fieldName: 'BmiCalculator__c', editable: true },
    // { label: 'BmiExplain', fieldName: 'BmiExplain__c', editable: true },
    // { type: 'action', typeAttributes: { rowActions: actions, menuAlignment: 'right' } },
];

export default class AccountListview extends LightningElement {
    @track data = [];
    @track columns = columns;
    wiredGetCusListResult;
    @track searchValue = '';

    @wire(getCusList, { searchValue: '$searchValue' })
    customer(result) {
        this.wiredGetCusListResult = result;
        if (result.data) {
            let tempConList = [];
            result.data.forEach((record) => {
                let tempConRec = Object.assign({}, record);  
                tempConRec.ConName = 'dms/s/detail/' + tempConRec.Id;
                tempConList.push(tempConRec);
            });
            console.log('this.data:::',this.data);
            this.data = tempConList;
            this.error = undefined;
        }
        else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }

    async handleEnter(event) {
        if (event.keyCode === 13) {
            if (event.target.value == "") {
                let tempConList = [];
                this.wiredGetCusListResult.data.forEach((record) => {
                    let tempConRec = Object.assign({}, record);  
                    tempConRec.ConName = 'dms/s/detail/' + tempConRec.Id;
                    tempConList.push(tempConRec);
                    
                });
                this.data = tempConList;
                console.log(JSON.stringify(this.data));
            } else {
                try {
                    this.data = await getCusList({ searchValue: event.target.value});
                    let tempConList = [];
                    this.data.forEach((record) => {
                        let tempConRec = Object.assign({}, record);  
                        tempConRec.ConName = 'dms/s/detail/' + tempConRec.Id;
                        tempConList.push(tempConRec);
                    });
                    this.data = tempConList;
                    console.log(JSON.stringify(this.data));
                } catch (error) {
                    console.log('error:::' + JSON.stringify(error));
                }
            }
            
        }
    }
   

    
    
}