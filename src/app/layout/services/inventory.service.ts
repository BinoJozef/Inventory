
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AppConfig } from '../../app.config';
import { SaveOrder, SaveTransfer } from '../../shared/models/inventory';

@Injectable()
export class InventoryService {

  constructor(private http: Http, private config: AppConfig) { }

  getCustomers(companyId,skipSize,takeSize){
    return this.http.get(this.config.inventoryUrl+'/api/customers/'+companyId+'/'+skipSize+'/'+takeSize,this.jwt()).map(res => res.json());
  }
  getCustomersBySupervisor(companyId,supCode){
    return this.http.get(this.config.inventoryUrl+'/api/customersbysupcode/'+companyId+'/'+supCode,this.jwt()).map(res => res.json());
  }
  GetCustomersWithItemsBySupCode(companyId,supCode){
    return this.http.get(this.config.inventoryUrl+'/api/customerswithitemsbysupcode/'+companyId+'/'+supCode,this.jwt()).map(res => res.json());
  }
  getCustomer(companyId,customerCode){
    return this.http.get(this.config.inventoryUrl+'/api/customer/'+companyId+'/'+customerCode,this.jwt()).map(res => res.json());
  }
  getCustomerCount(companyId){
     return this.http.get(this.config.inventoryUrl+'/api/customers/count/'+companyId,this.jwt()).map(res=>res.json());
  }
  getCustomersWithItems(companyId,oldCustomerCode,customerCode){
    return this.http.get(this.config.inventoryUrl+'/api/customerswithitems/'+companyId+'/'+oldCustomerCode+'/'+customerCode,this.jwt()).map(res => res.json());
  }
  getCustomerWithItems(companyId,oldCustomerCode){
    return this.http.get(this.config.inventoryUrl+'/api/customerwithitems/'+companyId+'/'+oldCustomerCode,this.jwt()).map(res => res.json());
  }

  
  getCategories(){
    return this.http.get(this.config.inventoryUrl+'/api/categories',this.jwt()).map(res => res.json());
  }
  addCategory(category){
    return this.http.post(this.config.inventoryUrl+'/api/categories/add',category,this.jwt()).map(res=>res.json());
  }
  addSubCategory(subCategory){
    return this.http.post(this.config.inventoryUrl+'/api/subCategories/add',subCategory,this.jwt()).map(res=>res.json());
  }
  deleteCategory(id){
    return this.http.delete(this.config.inventoryUrl+'/api/categories/delete/'+id,this.jwt()).map(res=>res.json());
  }
  deleteSubCategory(catId,subCatId){
    return this.http.delete(this.config.inventoryUrl+'/api/subcategories/delete/'+catId+'/'+subCatId,this.jwt()).map(res=>res.json());
  }

  getItems(companyId,subCatId){
    return this.http.get(this.config.inventoryUrl+'/api/items/'+companyId+'/'+subCatId,this.jwt()).map(res => res.json());
  }
  getStock(companyId,subCatId){
    return this.http.get(this.config.inventoryUrl+'/api/items/stock/'+companyId+'/'+subCatId,this.jwt()).map(res=>res.json());
  }
  getAllitems(){
    return this.http.get(this.config.inventoryUrl+'/api/items',this.jwt()).map(res=>res.json());
  }


  getItemStatus(){
    return this.http.get(this.config.inventoryUrl+'/api/itemstatus',this.jwt()).map(res=>res.json());
  } 
  getReasonStatus(){
    return this.http.get(this.config.inventoryUrl+'/api/reasonstatus',this.jwt()).map(res=>res.json());
  } 



  getInventaryReport(companyId){
    return this.http.get(this.config.inventoryUrl+'/api/reports/inventoryReport/'+companyId,this.jwt()).map(res=>res.json());
  }

  getUserAppeals(seqNum,userId,companyId){
    return this.http.get(this.config.inventoryUrl+'/api/orderflow/getappeals/'+seqNum+'/'+userId+'/'+companyId,this.jwt()).map(res=>res.json());
  }
  getUserAppealsBySupervisor(seqNum,userId,companyId,supCode){
    return this.http.get(this.config.inventoryUrl+'/api/orderflow/getAppealsBySupervisor/'+seqNum+'/'+userId+'/'+companyId+'/'+supCode,this.jwt()).map(res=>res.json());
  }

  removeAppeal(masterId){
    return this.http.delete(this.config.inventoryUrl+'/api/orderflow/endAppealProcess/'+masterId,this.jwt()).map(res=>res.json());
  }
  neededApproves(seqNumber){
    return this.http.get(this.config.inventoryUrl+'/api/orderflow/getNeededApproves/'+seqNumber,this.jwt()).map(res=>res.json());
  }

  getAllFreeInventories(){
    return this.http.get(this.config.inventoryUrl+'/api/items/freeInventories',this.jwt()).map(res=>res.json());
  }
  getAllAssignedInventories(){
    return this.http.get(this.config.inventoryUrl+'/api/items/assignedInventories',this.jwt()).map(res=>res.json());
  }
  getPrintResource(masterId){
    return this.http.get(this.config.inventoryUrl+'/api/orderflow/getPrintResources/'+masterId,this.jwt()).map(res=>res.json());
  }
  updateItems(items){
    return this.http.post(this.config.inventoryUrl+'/api/items/update',items,this.jwt()).map(res=>res.json());
  }

  getOrder(masterId){
    return this.http.get(this.config.inventoryUrl+'/api/orderflow/getorder/'+masterId,this.jwt()).map(res=>res.json());
  }
  
  createOrder(order){
    return this.http.post(this.config.inventoryUrl+'/api/orderflow/postorder',order,this.jwt()).map(res=>res.json());
  }

  createTransfer(transfer){
    return this.http.post(this.config.inventoryUrl+'/api/transferflow/postTransfer',transfer,this.jwt()).map(res=>res.json());
  }
 
  
  updateOrder(order:SaveOrder){
    return this.http.post(this.config.inventoryUrl+'/api/orderflow/updateorder/'+order.masterId,order,this.jwt()).map(res=>res.json());
  }
  cancelOrder(order:SaveOrder){
    return this.http.post(this.config.inventoryUrl+'/api/orderflow/cancelorder/'+order.masterId,order,this.jwt()).map(res=>res.json());
  }

  cancelTransfer(transfer:SaveTransfer){
    return this.http.post(this.config.inventoryUrl+'/api/transferflow/cancelTransfer/'+transfer.masterId,transfer,this.jwt()).map(res=>res.json());
  }
  getTransfer(masterId){
    return this.http.get(this.config.inventoryUrl+'/api/transferflow/getTransfer/'+masterId,this.jwt()).map(res=>res.json());
  }
  updateTransfer(transfer:SaveTransfer){
    return this.http.post(this.config.inventoryUrl+'/api/transferflow/updateTransfer/'+transfer.masterId,transfer,this.jwt()).map(res=>res.json());
  }
  private jwt() {
    // create authorization header with jwt token
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser });
      return new RequestOptions({ headers: headers });
    }
  }

}
