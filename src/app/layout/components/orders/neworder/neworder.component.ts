import * as _ from 'underscore'; 
import { InventoryService } from './../../../services/inventory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Message } from 'primeng/components/common/message';
import 'rxjs/add/observable/forkJoin';
import { SaveOrder, Order, Notes } from '../../../../shared/models/inventory';
import { DataService } from '../../../../shared/services/data.service';
import { PermissionGroup } from '../../../../shared/models/enums/permission-group.enum';
import { AuthenticationService } from '../../../../shared/services/authentication.service';



@Component({
  selector: 'app-neworder',
  templateUrl: './neworder.component.html',
  styleUrls: ['./neworder.component.css']
})
export class NeworderComponent implements OnInit {


  subscription: Subscription;
  userPermissions: any = {};

  formActive: boolean = true;
  templateMessage: string;

  marketingActive: boolean = false;
  outfitActive: boolean = false;
  //saveButtonActive: boolean = true;

  tmDisabledGroup: boolean = false;
  t_mDisabledGroup: boolean = false;

  customerBranch: string = '';
  customerCategory: string = '';
  stock: string = '';
  notes: Notes[];
  noteBy: string;
  applyButtonText: string = 'Sifariş Et'

  customers: any[];
  customersCount = 0;
  customersTotalCount = 0;
  customerSkipSize = 0;

  loading = false;

  categories: any[];
  subCategories: any[];
  items: any[];

  msgs: Message[] = [];

  order: SaveOrder = {
    masterId: 0,
    customerCode: null,
    companyId: 0,
    categoryId: 0,
    subCategoryId: 0,
    userId: 0,
    statusId: 1,
    note: '',
    itemCode: null,
    sequenceNumber: 1,
    flowTypeId: 1
  }


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private inventoryService: InventoryService,
    private authService:AuthenticationService
  ) {

    this.subscription = this.dataService.sharedData$.subscribe(data => { this.userPermissions = data });
    route.params.subscribe(p => {
      this.order.masterId = +p['id'] || 0;
    });
  }

  ngOnInit() {

    if (this.userPermissions.GroupCode == PermissionGroup.Techizat && !this.order.masterId)
      this.router.navigate(['/home']);

    else if (this.userPermissions.GroupCode == PermissionGroup.TicariMarketinq)//ticari marketinq
    {
      this.marketingActive = true;
      this.order.sequenceNumber = 2;
    }
    else if (this.userPermissions.GroupCode == PermissionGroup.Marketinq)// marketinq
    {
      this.marketingActive = true;
    }
    else if (this.userPermissions.GroupCode == PermissionGroup.Techizat)//techizat  :id routu ucun
    {
      this.marketingActive = true;
      this.outfitActive = true;
    }

    //Onsal.de companyId.leri Tiger.de olanla ferqli oldugu ucun.
    if (this.userPermissions.CompanyId == 2)
      this.order.companyId = 1
    else
      this.order.companyId = this.userPermissions.CompanyId;

    this.order.userId = this.userPermissions.Id;

    var sources = [
      this.inventoryService.getCategories() 
    ];


    if (this.order.masterId)
      sources.push(this.inventoryService.getOrder(this.order.masterId));
    else {   
      if(this.userPermissions.GroupCode === PermissionGroup.BogeMudiri)
      sources.push(this.authService.getSupervisorCode(2024,2));
      else
      sources.push(this.inventoryService.getCustomerCount(this.order.companyId));
      // sources.push(this.inventoryService.getCustomers(this.order.companyId,this.bufferSize));
    }


    Observable.forkJoin(sources).subscribe(data => {

      this.categories = data[0];

      if (!this.order.masterId) {
        
        if(this.userPermissions.GroupCode === PermissionGroup.BogeMudiri)
          this.getCustomersBySupervisor(data[1]);

        else{
          this.customersTotalCount = data[1];
          this.getCustomers(data[1]);
        }
      }


      if (this.order.masterId) {
        this.checkOrder(data[1]);
        this.applyButtonText = "Təsdiq Et";
      }
    },
      err => {
        if (err.status == 404) {
          this.formActive = false;
          this.templateMessage = "Əməliyyat nömrəsi tapılmadı və ya bu əməliyyat artıq dayandırılmışdır!";
        }
        else if (err.status == 400) {
          this.formActive = false;
          this.templateMessage = err.text();
        }
        else
          this.router.navigate(['/home']);      
      });

  }
  private getCustomersBySupervisor(supCode:string){
    if(supCode!="bos")
    this.inventoryService.getCustomersBySupervisor(this.order.companyId,supCode).subscribe(
      c=>{this.customers=c});
    else
      this.customers=[];
  }
  private getCustomers(custCount: number) {
    this.customersCount = custCount;

    if (custCount > 10000) {
      this.customersCount = this.customersCount - 10000;
      this.inventoryService.getCustomers(this.order.companyId, this.customerSkipSize, 10000).subscribe(
        c => { this.customers = c; },
        null,
        () => { this.customerSkipSize = this.customerSkipSize + 10000; this.loading = false; });
    }
    else {
      this.inventoryService.getCustomers(this.order.companyId, this.customerSkipSize, this.customersCount).subscribe(
        c => { this.customers = c; },
        null,
        () => { this.customerSkipSize = this.customerSkipSize + this.customersCount; this.customersCount = 0; this.loading = false; });
    }
  }
  private checkOrder(o: Order) {

    this.inventoryService.getCustomer(this.order.companyId, o.customerCode).subscribe(c => this.customers = c,
      null,
      () => {
        if (o.sequenceNumber == 4) {
          this.formActive = false;
          this.templateMessage = "Təsdiqlənmə bitmisdir!";
        }
        else if (((o.sequenceNumber == 1 || o.sequenceNumber == 2 || o.sequenceNumber == 3) && this.userPermissions.GroupCode == PermissionGroup.BogeMudiri) || 
        ((o.sequenceNumber == 2 || o.sequenceNumber == 3) && this.userPermissions.GroupCode == PermissionGroup.TicariMarketinq) ||
        (o.sequenceNumber == 3 && this.userPermissions.GroupCode == PermissionGroup.Marketinq)) {
          this.formActive = false;
          this.templateMessage = "Təsdiqlənmə mərhələsi davam edir!";
        }
        else if (o.sequenceNumber == 1 && this.userPermissions.GroupCode == PermissionGroup.TicariMarketinq) {
          this.tmDisabledGroup = true;
          this.setOrder(o);
          this.populateSubCategories();
          this.populateCustomerCategory();
          this.populateStock();
          this.order.statusId = 8;//applied
          this.order.sequenceNumber = 2;//marketiq testiqi
        }
        else if (o.sequenceNumber == 2 && this.userPermissions.GroupCode == PermissionGroup.Marketinq) {
          this.tmDisabledGroup = true;
          this.t_mDisabledGroup = true;
          this.setOrder(o);
          this.populateSubCategories();
          this.populateCustomerCategory();
          this.populateStock();
          this.order.statusId = 8;//applied
          this.order.sequenceNumber = 3;//marketiq testiqi
        }
        else if (o.sequenceNumber == 3 && this.userPermissions.GroupCode == PermissionGroup.Techizat) {
          this.tmDisabledGroup = true;
          this.t_mDisabledGroup = true;
          this.setOrder(o);
          this.populateSubCategories();
          this.populateCustomerCategory();
          this.populateStock();
          this.populateItems();
          this.order.statusId = 2;//compleated 
          this.order.sequenceNumber = 4;//Techizat testiqi
        }
        else
          this.router.navigate(['/home']);
      });
  }
  private setOrder(o: Order) {
      this.order.masterId = o.masterId,
      this.order.customerCode = o.customerCode,
      this.order.companyId = o.companyId,
      this.order.categoryId = o.categoryId,
      this.order.subCategoryId = o.subCategoryId,
      this.order.sequenceNumber = o.sequenceNumber
      this.populateNotes(o.notes);


  }
  populateNotes(n: Notes[]) {
   
    var users = _.pluck(n, 'userId');
    var names: any[];
    //id serice cagir
    this.authService.getUserNames(users, localStorage.getItem('currentUser')).subscribe(
      n => {
        names = n;
      },
      null,
      () => {

        for (let i = 0; i < n.length; i++) {
          if (n[i].professionId === 1)
            n[i].noteBy = 'Bölgə Müdiri';
          if (n[i].professionId === 2)
            n[i].noteBy = 'Ticari Marketinq';
          if (n[i].professionId === 3)
            n[i].noteBy = 'Marketinq';
          if (n[i].professionId === 4)
            n[i].noteBy = 'Təchizat';
            for(let j=0;j<n.length;j++){
              if(names[j].Id===n[i].userId)
                n[i].userName=names[j].Name;
            }
        }
        this.notes = n;
      });

  }
  onCategoryChange() {
    this.populateSubCategories();
    this.order.subCategoryId = 0;
    this.stock = '';
  }
  onSubCategoryChange() {   
      this.stock = '';
      this.populateStock();
  }
  onCustomerCodeChange() {
    this.populateCustomerCategory();
  }

  private populateCustomerCategory() {

    var selectedCustomer = this.customers.find(c => c.code == this.order.customerCode);

    this.customerCategory = selectedCustomer ? selectedCustomer.customerCategory : '';
    this.customerBranch = selectedCustomer ? selectedCustomer.branchName : '';
  }
  private populateSubCategories() {
    var selectedCategory = this.categories.find(m => m.id == this.order.categoryId);
    this.subCategories = selectedCategory ? selectedCategory.subCategories : [];
  }
  private populateStock() {
    this.inventoryService.getStock(this.order.companyId, this.order.subCategoryId).subscribe(data => this.stock = data);
  }
  private populateItems() {
    this.inventoryService.getItems(this.order.companyId, this.order.subCategoryId).subscribe(data => this.items = data);
  }

  submit() {
   // this.saveButtonActive = false;
   this.formActive=false;
   this.templateMessage="Zəhmət olmasa gözləyin..."
    var result$ = (this.order.masterId) ? this.inventoryService.updateOrder(this.order) : this.inventoryService.createOrder(this.order);
    result$.subscribe(order => {

      this.msgs = [{ severity: 'success', summary: 'UĞURLU!', detail: 'Əməliyyat müvəffəqiyyətlə tamamlandı!' }];
      setTimeout(() => {
          this.router.navigate(['/appeals']);
      }, 2000);
    },
      err => {
        if (err.status == 400) {
          this.msgs = [{ severity: 'error', summary: 'UĞURSUZ!', detail: err.text() }];
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2000);

        }
      },
      () => {
        this.formActive = false;
        this.templateMessage = "Əməliyyat uğurla icra edildi!"
      });
  }

  cancelOrder() {
    if (confirm("Əminsinizmi?")) {
      this.order.statusId = 3;
      this.formActive=false;
      this.templateMessage="Zəhmət olmasa gözləyin..."
      this.inventoryService.cancelOrder(this.order).subscribe(data => {
        this.msgs = [{ severity: 'success', summary: 'UĞURLU!', detail: 'Sifariş uğurla imtina edildi!' }];
        setTimeout(() => {
          this.router.navigate(['/appeals']);
        }, 1000);

      },
        err => {
          if (err.status == 400) {

            this.msgs = [{ severity: 'error', summary: 'UĞURSUZ!', detail: err.text() }];
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 1000);

          }
        },
        () => {
          this.formActive = false;
          this.templateMessage = "Əməliyyat uğurla icra edildi!"
        });
      //this.router.navigate(['/home'])
    }
  }
  fetchMore() {

    if (this.customersCount !== 0) {
      this.loading = true;
      this.getCustomers(this.customersCount);
    }
    else {
      this.customersCount = this.customerSkipSize;
      this.customerSkipSize = 0;
      this.loading = true;
      this.getCustomers(this.customersCount);
    }

  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
  
}
