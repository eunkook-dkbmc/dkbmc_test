/**
 * @description       : 
 * @author            : yoseong.kang@dkbmc.com
 * @group             : 
 * @last modified on  : 09-04-2024
 * @last modified by  : kyunghoon.kim@dkbmc.com
 * Modifications Log
 * Ver   Date         Author                   Modification
 * 1.0   2024-09-03   yoseong.kang@dkbmc.com   Initial Version
**/
import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import insertSales from '@salesforce/apex/SalesRevenueController.insertSales';

import SALES_OBJECT from '@salesforce/schema/SalesRevenue__c';

export default class NewModal extends LightningElement {
    @track isLoading = true; //스피너
    @track sales;

    connectedCallback(){
        console.log('안녕 newModal 이야');
        this.sales = {
            'Name': null,
            'SoldtoAccount__c': null,
            'AmountKRW__c': null,
            'NetPriceKRW__c': null,
            'Quantity__c': null,
            'BillDate__c': null,
        };
        this.isLoading = false;

    }

    lookupRecord(event){
        this.sales['SoldtoAccount__c'] = event.detail.selectedRecord;
    }
    handleNameChange(event){
        this.sales['Name'] = event.target.value;
    }
    handleAmountChange(event){
        this.sales['AmountKRW__c'] = event.target.value;
    }
    handlePriceChange(event){
        this.sales['NetPriceKRW__c'] = event.target.value;
    }
    handleQuantityChange(event){
        this.sales['Quantity__c'] = event.target.value;
    }
    handleBillChange(event){
        this.sales['BillDate__c'] = event.target.value;
    } 

    handleSaveNew(){
        if(this.isInputValid()){
            console.log('sales:::',JSON.stringify(this.sales));
            insertSales({salesRevenue: this.sales})
            .then(result => {
                if(result === 'Successful'){
                    this.sales = {
                        'Name': null,
                        'SoldtoAccount__c': null,
                        'AmountKRW__c': null,
                        'NetPriceKRW__c': null,
                        'Quantity__c': null,
                        'BillDate__c': null,
                    };
                    const toastEvent = new ShowToastEvent({
                        title: 'SalesRevenue Creation',
                        message: 'Successfully processed',
                        variant: 'success',
                    });
                    this.dispatchEvent(toastEvent);
                } else{
                    const toastEvent = new ShowToastEvent({
                        title: 'SalesRevenue Error Apex',
                        message: result,
                        variant: 'error',
                    });
                    this.dispatchEvent(toastEvent);
                }
            }).catch(error =>{
                const toastEvent = new ShowToastEvent({
                    title: 'SalesRevenue Error',
                    message: error,
                    variant: 'error',
                });
                this.dispatchEvent(toastEvent);
            });

        }
    }

    handleSave(){
        if(this.isInputValid()){
            console.log('sales:::',JSON.stringify(this.sales));
            if(this.sales['SoldtoAccount__c'] != null) this.sales['SoldtoAccount__c'] = this.sales['SoldtoAccount__c'].Id;
            insertSales({salesRevenue: this.sales})
            .then(result => {
                if(result === 'Successful'){
                    const toastEvent = new ShowToastEvent({
                        title: 'SalesRevenue Creation',
                        message: 'Successfully processed',
                        variant: 'success',
                    });
                    this.dispatchEvent(toastEvent);
                    this.handleClose();
                } else{
                    const toastEvent = new ShowToastEvent({
                        title: 'SalesRevenue Error Apex',
                        message: result,
                        variant: 'error',
                    });
                    this.dispatchEvent(toastEvent);
                }
            }).catch(error =>{
                const toastEvent = new ShowToastEvent({
                    title: 'SalesRevenue Error',
                    message: error,
                    variant: 'error',
                });
                this.dispatchEvent(toastEvent);
            });

        }
    }

    isInputValid() {    
        let isValid = true;
        let inputFields = this.template.querySelectorAll('lightning-input');
        inputFields.forEach(inputField => {
            if(!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });
        // let lookupField = this.template.querySelector('c-custom-lookup');
        // if(!lookupField.checkValidity()) {
        //     lookupField.reportValidity();
        //     isValid = false;
        // }
        console.log('valid 여긴 지나갔어');
        return isValid;
    }

    /**
     * 닫기 버튼을 누르면 모달이 닫히도록 한다.
     */    
    handleClose(){
        console.log('닫는다');
        const selectedEvent = new CustomEvent("close", { 
            detail: { refreshList: true }
        });
        this.dispatchEvent(selectedEvent);
    }
    
}