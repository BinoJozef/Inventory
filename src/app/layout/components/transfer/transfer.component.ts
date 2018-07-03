import * as _ from 'underscore';
import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Subscription } from 'rxjs/Subscription';
import { Message } from 'primeng/primeng';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../shared/services/data.service';
import { SaveTransfer, Transfer, Notes } from '../../../shared/models/inventory';
import { PermissionGroup } from '../../../shared/models/enums/permission-group.enum';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../../../shared/services/authentication.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {

  subscription: Subscription;
  userPermissions: any = {};

  transferActive: boolean = true;
  returnActive:boolean= false;



  disabledGroup:boolean=false;//id parapeter geldikde form kom.leri disable olacag

  formActive: boolean = true; // temp mesaji cixaranda lazimdir
 // saveButtonActive:boolean=true; // sifaris verildikde lazimdir
  templateMessage: string;
  
  statuses:any[];
  customers: any[];
  customerItems:any[];
  notes: Notes[];


 
  customerCategory: string = '';

  msgs: Message[] = [];

  transfer:SaveTransfer={
    masterId:0,
    customerCode:null,
    oldCustomerCode:null,
    companyId:0,
    flowTypeId:2,
    statusId:1,
    reasonId:null,
    itemCode:null,
    sequenceNumber:1,
    userId:0,
    note:''
  };
 
  constructor( private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private inventoryService: InventoryService,
    private authService:AuthenticationService) { 

      this.subscription = this.dataService.sharedData$.subscribe(data => { this.userPermissions = data });
      route.params.subscribe(p => {
        this.transfer.masterId = +p['id'] || 0;
      });
    }


  ngOnInit() {
    if (this.userPermissions.GroupCode !== PermissionGroup.BogeMudiri && !this.transfer.masterId)
      this.router.navigate(['/home']);

    if (this.userPermissions.CompanyId == 2)
      this.userPermissions.CompanyId =1;

    this.transfer.userId = this.userPermissions.Id;
    this.transfer.companyId = this.userPermissions.CompanyId;

    var sources = [
      this.inventoryService.getReasonStatus()
    ];
    
    if (this.transfer.masterId)
      sources.push(this.inventoryService.getTransfer(this.transfer.masterId));
    else 
      sources.push(this.authService.getSupervisorCode(2024,2));  ///id ile deyis 

    Observable.forkJoin(sources).subscribe(data => {

      this.statuses = data[0];

      if (!this.transfer.masterId) 
          this.getCustomersWithItemsBySupervisor(data[1]);
    
      if (this.transfer.masterId) {
        this.disabledGroup=true;
       this.checkTransfer(data[1]);
       // this.applyButtonText = "Təsdiq Et";
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
  private checkTransfer(t: Transfer) {

   if(t.flowTypeId===2)
   {
     this.returnActive=false;
     this.transferActive=true;
    this.inventoryService.getCustomersWithItems(t.companyId,t.oldCustomerCode,t.customerCode).subscribe(c => this.customers = c,
      null,
      () => {
        if (t.sequenceNumber == 4) {
          this.formActive = false;
          this.templateMessage = "Təsdiqlənmə bitmisdir!";
        }
        else if (((t.sequenceNumber == 1 || t.sequenceNumber == 2 || t.sequenceNumber == 3) && this.userPermissions.GroupCode == PermissionGroup.BogeMudiri) || 
        ((t.sequenceNumber == 2 || t.sequenceNumber == 3) && this.userPermissions.GroupCode == PermissionGroup.TicariMarketinq) ||
        (t.sequenceNumber == 3 && this.userPermissions.GroupCode == PermissionGroup.Marketinq)) {
          this.formActive = false;
          this.templateMessage = "Təsdiqlənmə mərhələsi davam edir!";
        }
        else if (t.sequenceNumber == 1 && this.userPermissions.GroupCode == PermissionGroup.TicariMarketinq) {
        
          this.setOrder(t);
          this.populateForm();
        
          this.transfer.statusId = 8;//applied
          this.transfer.sequenceNumber = 2;//ticari marketiq testiqi
        }
        else if (t.sequenceNumber == 2 && this.userPermissions.GroupCode == PermissionGroup.Marketinq) {
        
          this.setOrder(t);
          this.populateForm();
        
          this.transfer.statusId = 8;//applied
          this.transfer.sequenceNumber = 3;// marketiq testiqi
        }
        else if (t.sequenceNumber == 3 && this.userPermissions.GroupCode == PermissionGroup.Techizat) {
          this.setOrder(t);
          this.populateForm();
         
          this.transfer.statusId = 2;//compleated 
          this.transfer.sequenceNumber = 4;//Techizat testiqi
        }
        else
          this.router.navigate(['/home']);
      });
    }
    if(t.flowTypeId === 3){
      this.transferActive=false;
      this.returnActive=true;
      this.inventoryService.getCustomerWithItems(t.companyId,t.oldCustomerCode).subscribe(c=> this.customers = c,
      null,
      ()=>{
        if (t.sequenceNumber == 4) {
          this.formActive = false;
          this.templateMessage = "Təsdiqlənmə bitmisdir!";
        }
        else if (t.sequenceNumber == 1  && this.userPermissions.GroupCode == PermissionGroup.BogeMudiri){
          this.formActive = false;
          this.templateMessage = "Təsdiqlənmə mərhələsi davam edir!";
        }
        else if (t.sequenceNumber == 1 && this.userPermissions.GroupCode == PermissionGroup.Techizat) {
          this.setOrder(t);
          this.populateForm();
         
          this.transfer.statusId = 2;//compleated 
          this.transfer.sequenceNumber = 4;//Techizat testiqi
        }
        else
        this.router.navigate(['/home']);
      });
    }
  }
  private setOrder(t: Transfer) {
      this.transfer.masterId = t.masterId,
      this.transfer.customerCode = t.customerCode,
      this.transfer.oldCustomerCode=t.oldCustomerCode,
      this.transfer.companyId = t.companyId,
      this.transfer.flowTypeId=t.flowTypeId,
      this.transfer.itemCode=t.itemCode,
      this.transfer.sequenceNumber=t.sequenceNumber,
      this.transfer.reasonId=t.reasonId,
      this.populateNotes(t.notes);


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
            for(let j=0;j<names.length;j++){
              if(n[i].userId===names[j].Id)
                n[i].userName=names[j].Name;
            }
        }
        this.notes = n;
      });

  }
  private getCustomersWithItemsBySupervisor(supCode:string){
    if(supCode!="bos")
    this.inventoryService.GetCustomersWithItemsBySupCode(this.transfer.companyId,supCode).subscribe(
      c=>{this.customers=c});
    else
      this.customers=[];
  }
 
  
  transferChecked(e){
    this.transfer={
      masterId:0,
      customerCode:null,
      oldCustomerCode:null,
      companyId:this.transfer.companyId,
      flowTypeId:0,
      statusId:1,
      reasonId:null,
      itemCode:null,
      sequenceNumber:1,
      userId:this.userPermissions.Id,
      note:''
    };
    this.customerCategory='';
    if(e.target.checked){
      this.returnActive=false;
      this.transferActive=true;
      this.transfer.flowTypeId=2;
    }
    else
    {
      this.returnActive = true;
      this.transferActive = false;
      this.transfer.flowTypeId=3;
    }
    
  }
  returnChecked(e){
    this.transfer={
      masterId:0,
      customerCode:null,
      oldCustomerCode:null,
      companyId:this.transfer.companyId,
      flowTypeId:0,
      statusId:1,
      reasonId:null,
      itemCode:null,
      sequenceNumber:1,
      userId:this.userPermissions.Id,
      note:''
    };
    this.customerCategory='';
    if(e.target.checked){
      this.returnActive=true;
      this.transferActive=false;
      this.transfer.flowTypeId=3;
    }
    else
    {
      this.returnActive=false;
      this.transferActive=true;
      this.transfer.flowTypeId=2;
    }

  }
  
  onCustomerCodeChange(){
   this.populateForm();
   this.transfer.itemCode=null;
  }
  private populateForm() { 
    var selectedCustomer = this.customers.find(c => c.code == this.transfer.oldCustomerCode);
    this.customerCategory = selectedCustomer ? selectedCustomer.customerCategory : null;
    this.customerItems = selectedCustomer ? selectedCustomer.items : null;
  }
  
  submit() {
    //this.saveButtonActive = false;
    if(this.transfer.customerCode===this.transfer.oldCustomerCode && !this.transfer.masterId){
      this.msgs = [{ severity: 'warn', summary: 'Diqqət!', detail: 'Eyni müştəri adı daxil olunub!' }];
      return;
    }
    
this.formActive=false;
this.templateMessage="Zəhmət olmasa gözləyin..."
    if(this.transfer.flowTypeId==3)
    this.transfer.customerCode=this.transfer.oldCustomerCode;

    var result$ = (this.transfer.masterId) ? this.inventoryService.updateTransfer(this.transfer) : this.inventoryService.createTransfer(this.transfer);
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
    ()=>{
      this.formActive=false;
      this.templateMessage="Əməliyyat uğurla icra edildi!"
    });
  }
  cancelTransfer() {
    if (confirm("Əminsinizmi?")) {
      this.transfer.statusId = 3;
      this.formActive=false;
      this.templateMessage="Zəhmət olmasa gözləyin..."
      this.inventoryService.cancelTransfer(this.transfer).subscribe(data => {
        this.msgs = [{ severity: 'success', summary: 'UĞURLU!', detail: 'Əməliyyat müvəffəqiyyətlə tamamlandı!' }];
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
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
