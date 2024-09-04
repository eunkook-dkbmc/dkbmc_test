/**
 * @description       : 
 * @author            : yoseong.kang@dkbmc.com
 * @group             : 
 * @last modified on  : 09-04-2024
 * @last modified by  : kyunghoon.kim@dkbmc.com
 * Modifications Log
 * Ver   Date         Author                   Modification
 * 1.0   2024-08-30   yoseong.kang@dkbmc.com   Initial Version
**/
import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getCamList from '@salesforce/apex/CampaignListViewController.getCamList';
import deleteRecord from '@salesforce/apex/CampaignListViewController.deleteRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class ProductListView extends NavigationMixin(LightningElement) {
    @track sortedBy;
    @track sortedDirection = 'asc';
    @track products;
    @track searchKey = '';
    @track showModal = false;

    @track columns = [
        { label: 'Sold to Account', fieldName: 'SoldtoAccountName', sortable: true },
        { label: 'Sales Revenue Name', 
            fieldName: 'recordLink', 
            type: 'url', 
            typeAttributes: { 
                label: { fieldName: 'Name' }, 
                target: '_self' 
            } ,
            sortable: true
        },
        { label: 'Amount KRW', fieldName: 'AmountKRW__c', type: 'currency' },
        { label: 'Net Price KRW', fieldName: 'NetPriceKRW__c', type: 'currency' },
        { label: 'Quantity', fieldName: 'Quantity__c' },
        { label: 'Bill Date', fieldName: 'BillDate__c', sortable: true },
        {
            type: 'action',
            typeAttributes: { rowActions: this.getRowActions }
        }
    ];

    connectedCallback() {
        this.getCamList();
    }

    getCamList() {
        getCamList({
            searchKey: this.searchKey,
        })
        .then(result => {
            this.products = result.map(record => {
                let recordLink = '/dms/s/detail/' + record.Id;
                return {
                    ...record,
                    SoldtoAccountName: record.SoldtoAccount__r ? record.SoldtoAccount__r.Name : '',
                    recordLink: recordLink,
                };
            });
        })
        .catch(error => {
            console.log('error', error);
        });
    }

    handleSearch(event) {
        if (event.keyCode === 13) {
            this.searchKey = event.target.value;
            console.log('searchKey>>>', this.searchKey);
            this.getCamList();
        }
    }

    handleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.products];

        cloneData.sort((a, b) => {
            let aValue = a[sortedBy] ? a[sortedBy].toLowerCase() : '';
            let bValue = b[sortedBy] ? b[sortedBy].toLowerCase() : '';
            return aValue > bValue ? 1 : -1;
        });

        this.products = sortDirection === 'asc' ? cloneData : cloneData.reverse();
        this.sortedBy = sortedBy;
        this.sortedDirection = sortDirection;
    }


    // handleNew() {
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__objectPage',
    //         attributes: {
    //             objectApiName: 'SalesRevenue__c',
    //             actionName: 'new'
    //         }
    //     });
    // }
    handleNew() {
        this.showModal = true;
    }

    handleCloseModal() {
        this.showModal = false;
    }
 
    getRowActions(row, doneCallback) {
        const actions = [
            { label: 'Edit', name: 'edit' },
            { label: 'Delete', name: 'delete' }
        ];
        doneCallback(actions);
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'edit':
                this.handleEdit(row);
                break;
            case 'delete':
                this.handleDelete(row);
                break;
            default:
        }
    }

    handleEdit(row) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                objectApiName: 'SalesRevenue__c',
                actionName: 'edit'
            }
        });
    }

    handleDelete(row) {
        deleteRecord({ recordId: row.Id })
            .then(() => {
                this.showToast('Success', 'Record deleted', 'success');
                this.getCamList();
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }

    handleCloseModal(event) {
        this.showModal = false;
    
        if (event.detail.refreshList) {
            this.getCamList();
        }
    }
}