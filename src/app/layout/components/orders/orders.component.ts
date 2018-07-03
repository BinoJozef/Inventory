import { PrintResource } from './../../../shared/models/inventory';
import { Message } from 'primeng/components/common/message';
import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Subscription } from 'rxjs/Subscription';
import { Appeal, AppealLine, TimeLine } from '../../../shared/models/inventory';
import { DataService } from '../../../shared/services/data.service';
import { PermissionGroup } from '../../../shared/models/enums/permission-group.enum';
import {SelectItem} from 'primeng/api';  
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Printd } from 'printd';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent  implements OnInit {

  subscription: Subscription;
  getUserAppeals: Subscription;
  
  newOrderButtonActive:boolean=false;
  marketingCssActive:boolean=true;
  supervisorCode:string;
  userPermissions: any = {};
  sequenceNumber:number;
  msgs: Message[] = [];

  

  appeals:Appeal[];
  today = Date.now();

  ownAppeals:Appeal[];
  groupNames:SelectItem[];
  printResource:PrintResource={
    companyName:'',
    itemCode:'',
    itemName:'',
    customerCode:'',
    customerName:''
  }

  selectedAppeal:Appeal;
  appealLines:AppealLine[];

  deleteBtnActive:boolean=false;
  pdfBtnActive:boolean=false;
  timeLineActive:boolean=false;
  
  bM:TimeLine={
    date:'......',
    status:'',
    class:''
  };
  tm:TimeLine={
    date:'......',
    status:'',
    class:''
  };
  m:TimeLine={
    date:'......',
    status:'',
    class:''
  };
  t:TimeLine={
    date:'......',
    status:'',
    class:''
  };
 
  constructor(
    private dataService: DataService,
    private inventoryService: InventoryService,
    private authService:AuthenticationService
  ) {this.subscription = this.dataService.sharedData$.subscribe(data => { this.userPermissions = data }); }

  ngOnInit() {
    this.groupNames = [
            { label: 'Hamısı', value: null },
            { label: 'Müraciətim', value: 'Müraciətim' },
            { label: 'Bölgə Müdiri', value: 'Bölgə Müdiri' },
            { label: 'Marketinq', value: 'Ticari Marketinq' }
            
  ];
    if (this.userPermissions.CompanyId == 2)
      this.userPermissions.CompanyId = 1

    //  if(this.userPermissions.GroupCode == PermissionGroup.BogeMudiri || this.userPermissions.GroupCode == PermissionGroup.Marketinq)
    //  this.newOrderButtonActive=true;

    if (this.userPermissions.GroupCode === PermissionGroup.Marketinq)
      this.sequenceNumber = 3;
      else if (this.userPermissions.GroupCode === PermissionGroup.TicariMarketinq)
        this.sequenceNumber = 2;

    else if (this.userPermissions.GroupCode === PermissionGroup.Techizat)
      this.sequenceNumber = 4;

    if (this.userPermissions.GroupCode === PermissionGroup.BogeMudiri) {
      this.sequenceNumber = 1;

      this.authService.getSupervisorCode(2024, 2).subscribe(c => {
        this.supervisorCode = c;
      },
        err => {
          this.msgs = [{ severity: 'error', summary: 'UĞURSUZ!', detail: err }];
        },
        () => {
          this.getUserAppeals = this.inventoryService.getUserAppealsBySupervisor(this.sequenceNumber, this.userPermissions.Id, this.userPermissions.CompanyId, this.supervisorCode).subscribe(
            a => { this.groupNameProcess(a), this.appeals = a },
            err => {
              if (err.status == 404) { }//userin hec bir sifarisi olmadiqda
            });
        });

    }

    else {
      this.getUserAppeals = this.inventoryService.getUserAppeals(this.sequenceNumber, this.userPermissions.Id, this.userPermissions.CompanyId).subscribe(
        a => { this.groupNameProcess(a), this.appeals = a },
        err => {
          if (err.status == 404) { }//userin hec bir sifarisi olmadiqda
        });
    }

  }
 

  onRowSelect(event) {
    this.bM={
      date:'......',
      status:'',
      class:''
    };
    this.tm={
      date:'......',
      status:'',
      class:''
    };
    this.m={
      date:'......',
      status:'',
      class:''
    };
    this.t={
      date:'......',
      status:'',
      class:''
    };
    this.pdfBtnActive=false;
    if(this.selectedAppeal.statusId === 2)//compleated
     this.pdfBtnActive=true;

    this.appealLines=event.data.appealLines;
    if(event.data.appealType==="Qaytarma")
    this.marketingCssActive=false;
    else
    this.marketingCssActive=true;
    
    this.timeLineProcess(this.appealLines);

    this.timeLineActive=true;
   
  }
  
  groupNameProcess(appeals:Appeal[]){
    for(let a=0;a<appeals.length;a++){
      for(let al=0;al<appeals[a].appealLines.length;al++){

        if(appeals[a].appealLines[al].sequenceNumber===1){
          appeals[a].groupName='Bölgə Müdiri';
          break;
        }
        else if(appeals[a].appealLines[al].sequenceNumber===2){
          appeals[a].groupName='Ticari Marketinq';
          break;
        }
      }
      if(appeals[a].userId===this.userPermissions.Id){
        appeals[a].groupName='Müraciətim';
      }
    }
  }



  timeLineProcess(appealLine:AppealLine[]){
    for (let i = 0; i < this.appealLines.length; i++){
        if(appealLine[i].sequenceNumber===1 && appealLine[i].statusId===1 ){ //user id elave edilecek ki ona uygun dayandir eml.ti olsun
          this.bM.date=appealLine[i].executedDate;
          this.bM.status='Başladılıb';
          this.bM.class='complete';
          this.tm.status='Təsdiq gözləyir';
          this.m.status='Təsdiq gözləyir';          
          this.t.status='Təsdiq gözləyir';
          if(appealLine[i].userId===this.userPermissions.Id)
          this.deleteBtnActive=true;
          else
          this.deleteBtnActive=false;
        
          
        }
        else if(appealLine[i].sequenceNumber===2 && appealLine[i].statusId===1 ){ //user id elave edilecek ona uygun dayandir eml.ti olacaq
          this.tm.date=appealLine[i].executedDate;
          this.tm.status='Başladılıb';
          this.tm.class='complete';
          this.bM.status='İştirak edilməyib';
          this.m.status='Təsdiq gözləyir';
          this.t.status='Təsdiq gözləyir';
          if(appealLine[i].userId===this.userPermissions.Id)
          this.deleteBtnActive=true;
          else
          this.deleteBtnActive=false;
        }

        else if(appealLine[i].sequenceNumber===2 && appealLine[i].statusId===8){
          this.tm.date=appealLine[i].executedDate;
          this.tm.status='Təsdiqlənib';
          this.tm.class='complete';
          this.m.status='Təsdiq gözləyir';
          this.t.status='Təsdiq gözləyir';
          this.deleteBtnActive=false;
        }
        else if(appealLine[i].sequenceNumber===2 && appealLine[i].statusId===3){
          this.tm.date=appealLine[i].executedDate;
          this.tm.status='İmtina edilib';
          this.tm.class='cancel';
          this.m.status='İştirak edilməyib';
          this.t.status='İştirak edilməyib';
          this.deleteBtnActive=false;
        }

        else if(appealLine[i].sequenceNumber===3 && appealLine[i].statusId===8){
          this.m.date=appealLine[i].executedDate;
          this.m.status='Təsdiqlənib';
          this.m.class='complete';
          this.t.status='Təsdiq gözləyir'
          this.deleteBtnActive=false;
        }
        else if(appealLine[i].sequenceNumber===3 && appealLine[i].statusId===3){
          this.m.date=appealLine[i].executedDate;
          this.m.status='İmtina edilib';
          this.m.class='cancel';
          this.t.status='İştirak edilməyib'
          this.deleteBtnActive=false;
        }
      
        else if(appealLine[i].sequenceNumber===4 && appealLine[i].statusId===2){
          this.t.date=appealLine[i].executedDate;
          this.t.status='Təsdiqlənib';
          this.t.class='complete';
          this.deleteBtnActive=false;
        }
        else if(appealLine[i].sequenceNumber===4 && appealLine[i].statusId===3){
          this.t.date=appealLine[i].executedDate;
          this.t.status='İmtina edilib';
          this.t.class='cancel';
          this.deleteBtnActive=false;
        }
       

    }

  }

  endProcess() {
    if (confirm("Əminsinizmi?")) {
      if (this.selectedAppeal)
       this.inventoryService.removeAppeal(this.selectedAppeal.masterId).subscribe(
          () => {
            //listi temizle
            this.appeals = this.appeals.filter(
              (element: Appeal) => element.masterId !== this.selectedAppeal.masterId);
             this.deleteBtnActive=false;
            this.msgs = [{ severity: 'success', summary: 'UĞURLU!', detail: 'Əməliyyat uğurla dayandırıldı!' }];
          },
          err => {
          this.msgs = [{ severity: 'error', summary: 'UĞURSUZ!', detail: err.text() }];
          });
    }
  }

  pdfDownload() {
    this.inventoryService.getPrintResource(this.selectedAppeal.masterId).subscribe(a => {
      this.printResource = a;
    },
      err => {
        if (err.status == 400)
          this.msgs = [{ severity: 'error', summary: 'UĞURSUZ!', detail: 'Məlumat tapılmdı!' }];
        else
          this.msgs = [{ severity: 'error', summary: 'UĞURSUZ!', detail: err }];
      },
      () => {
        setTimeout(() => {
          const cssText: string = `
  @page {
             size: A4;
             margin: 0;
           }
           @media print {
             html, body {
               width: 210mm;
               height: 297mm;
             }
            /* ... the rest of the rules ... */
         }
`

          const d: Printd = new Printd();
          d.print(document.getElementById('demo'), cssText);
        }, 200);

      });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
    this.getUserAppeals.unsubscribe();
  }

}
