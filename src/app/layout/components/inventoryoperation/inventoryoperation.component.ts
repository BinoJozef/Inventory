import { Router } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/message';
import { InventoryService } from '../../services/inventory.service';
import {SelectItem} from 'primeng/api'; 
import * as $ from 'jquery';
import { Items, DialogItems, UpdateItems } from '../../../shared/models/inventory';
declare var $: any;

@Component({
  selector: 'app-inventoryoperation',
  templateUrl: './inventoryoperation.component.html',
  styleUrls: ['./inventoryoperation.component.css']
})
export class InventoryoperationComponent implements OnInit {

   items:Items[];
   selectedItems: Items[];
   itemsForDialog: DialogItems={
     categoryId:0,
     subCategoryId:0,
     statusId:0
   };
  
   subModel:any={
     catId:0,
     subCatId:0,
     name:''
   };
   catModel:any={
     catId:0,
     name:''
   };
   statusesCol:SelectItem[];
   itemsCol:any[];

   saveItems:UpdateItems[]=[];//sonda update oturulecek obyekt
   
   msgs: Message[] = [];
  
   categoryAddActive:boolean=true;
   categoryDeleteActive:boolean=false;
   subCatAddActive:boolean=true;
   subCatDeleteActive:boolean=false;
   

   categories:any[];
   subCategories: any[];
   itemStatus:any[];


  constructor(
    private router: Router,
    private inventoryService: InventoryService) { }

  ngOnInit() {
    this.itemsCol = [
      { field: 'company', header: 'Şirkət' },
      { field: 'code', header: 'Kod' },
      { field: 'name', header: 'Ad' },
      { field: 'category', header: 'Kateqoriya' },
      { field: 'subCategory', header: 'Alt Kateqoriya' },
      { field: 'status', header: 'Status' },
      { field: 'customerName', header: 'Müştəri' }
    ];

    this.statusesCol = [
      { label: 'Hamısı', value: null },
      { label: 'Boş', value: 'Boş' },
      { label: 'Təhkim olunmuş', value: 'Təhkim olunmuş' },
      { label: 'Təmirdə', value: 'Təmirdə' }
      
];
     this.inventoryService.getAllitems().subscribe(
       i=>this.items=i,
       err=>this.showError(err)
    );
      
    this.inventoryService.getCategories().subscribe(
      c=>this.categories=c,
      err=>this.showError(err)
    );
    
    this.inventoryService.getItemStatus().subscribe(
      s=>this.itemStatus=s,
      err=>this.showError(err)
    );

  }
  
  
  edit() {
   
    this.saveItems=[];

    for (let i = 0; i < this.selectedItems.length; i++) {
      this.saveItems.push({
        companyId:this.selectedItems[i].companyId, 
        code:this.selectedItems[i].code, 
        categoryId:this.itemsForDialog.categoryId, 
        subCategoryId:this.itemsForDialog.subCategoryId,
        statusId:this.itemsForDialog.statusId
       });
    }
    
    this.inventoryService.updateItems(this.saveItems).subscribe(
      i => {

        for (let i = 0; i < this.items.length; i++) {
          for (let t = 0; t < this.saveItems.length; t++) {
            if (this.items[i].companyId == this.saveItems[t].companyId && this.items[i].code == this.saveItems[t].code) {
              var category = this.categories.find(m => m.id == this.saveItems[t].categoryId);
              var subCategory = this.subCategories.find(m => m.id == this.saveItems[t].subCategoryId);
              var status = this.itemStatus.find(i => i.id == this.saveItems[t].statusId);
              this.items[i].category = category.name;
              this.items[i].subCategory = subCategory.name;
              this.items[i].status = status.name;
            }
          }
        }

        this.showSuccess("Məlumatlar uğurla yadda saxlanıldı!")

      },
      err => { this.showError(err) });

    $('#updateModalCenter').modal('hide');
    this.itemsForDialog={
      categoryId:null,
      subCategoryId:null,
      statusId:null
    };
    
  }

 
  addCategory(){

    this.inventoryService.addCategory(this.catModel).subscribe(
      c=>this.categories=c,
      err=> {
        if (err.status == 400) {
          this.msgs = [{ severity: 'warn', summary: 'UĞURSUZ!', detail: err.text() }];         
        }
      },
      ()=>{
      //  $('#categoryModalCenter').modal('hide');
        this.showSuccess("Məlumatlar uğurla yadda saxlanıldı!");
        // this.catModel={
        //   catId:null,
        //   name:''
        // };
      });
    
  }
  deleteCategory(){
    this.inventoryService.deleteCategory(this.catModel.catId).subscribe(
      c=>this.categories=c,
      err=>this.showError(err.text()),
      ()=>{ 
        //$('#categoryModalCenter').modal('hide');
        this.showSuccess("Məlumatlar uğurla silindi!");
        this.catModel={
          catId:null,
          name:''
        };
    });
  }
  deleteSubCategory(){
    this.inventoryService.deleteSubCategory(this.subModel.catId,this.subModel.subCatId).subscribe(
      c=>this.categories=c,
      err=>this.showError(err.text()),
      ()=>{ 
       // $('#subCategoryModalCenter').modal('hide');
        this.showSuccess("Məlumatlar uğurla silindi!");
        this.subModel={
          catId:null,
          subCatId:null,
          name:''
        };
    });
  }
  
  addSubCategory(){
    this.inventoryService.addSubCategory(this.subModel).subscribe(
      c=>this.categories=c,
      err=>{
        if (err.status == 400) {
          this.msgs = [{ severity: 'warn', summary: 'UĞURSUZ!', detail: err.text() }];         
        }
      },
      ()=>{
       // $('#subCategoryModalCenter').modal('hide');
        this.showSuccess("Məlumatlar uğurla yadda saxlanıldı!");
        this.subModel={
          catId:null,
          subCatId:null,
          name:''
        };
      });
  }
  catRemoveClicked(){
    this.categoryAddActive=false;
    this.categoryDeleteActive=true;

  }
  catAddClicked(){
    this.categoryAddActive=true;
    this.categoryDeleteActive=false;
  }

  subCatRemoveClicked(){
    this.subCatAddActive=false;
    this.subCatDeleteActive=true;
  }
  subCatAddClicked(){
    this.subCatDeleteActive=false;
    this.subCatAddActive=true;
  }
  
  onCategoryChange() {
    this.populateSubCategories();
    this.itemsForDialog.subCategoryId = 0;
  }

  private populateSubCategories() {
    var selectedCategory = this.categories.find(m => m.id == this.itemsForDialog.categoryId);
    this.subCategories = selectedCategory ? selectedCategory.subCategories : [];
  }

  onCategoryChangeModal() {
    if(this.subCatDeleteActive){
    this.populateSubCategoriesModal();
    this.subModel.subCatId = 0;
    }
  }

  private populateSubCategoriesModal() {
    var selectedCategory = this.categories.find(m => m.id == this.subModel.catId);
    this.subCategories = selectedCategory ? selectedCategory.subCategories : [];
  }


   private showError(errMsg: string) {
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: 'Xəta baş verdi!', detail: errMsg});
    }
  
    
    private showSuccess(successMsg: string) {
        this.msgs = [];
        this.msgs.push({severity: 'success',summary: 'Uğurlu!', detail: successMsg});
    }
} 


