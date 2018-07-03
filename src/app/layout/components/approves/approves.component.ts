import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/message';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../../../shared/services/data.service';
import { InventoryService } from '../../services/inventory.service';
import { NeededApprove} from '../../../shared/models/inventory';
import { PermissionGroup } from '../../../shared/models/enums/permission-group.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approves',
  templateUrl: './approves.component.html',
  styleUrls: ['./approves.component.css']
})
export class ApprovesComponent implements OnInit {

  subscription: Subscription;
  userPermissions: any = {};

  cols: any[];
  approves: NeededApprove[];
  msgs: Message[] = [];

  constructor(
    private dataService: DataService,
    private inventoryService: InventoryService, 
    private router: Router,) 
    { this.subscription = this.dataService.sharedData$.subscribe(data => { this.userPermissions = data }); }

  ngOnInit() {
    if (this.userPermissions.GroupCode === PermissionGroup.TicariMarketinq)
      this.inventoryService.neededApproves(1).subscribe(
        a => { this.approves = a },
        err => {
          if (err.status == 400)
            this.msgs = [{ severity: 'info', summary: 'MƏLUMAT!', detail: err.text() }];
          else
            this.msgs = [{ severity: 'error', summary: 'UĞURSUZ!', detail: err }];
            this.approves=[];
        });

     else if(this.userPermissions.GroupCode === PermissionGroup.Marketinq)
     this.inventoryService.neededApproves(2).subscribe(
      a => { this.approves = a },
      err => {
        if (err.status == 400)
         this.msgs = [{ severity: 'info', summary: 'MƏLUMAT!', detail: err.text() }];
        else
          this.msgs = [{ severity: 'error', summary: 'UĞURSUZ!', detail: err }];
         this.approves=[];
      });

      else if(this.userPermissions.GroupCode === PermissionGroup.Techizat)
      this.inventoryService.neededApproves(3).subscribe(
       a => { this.approves = a },
       err => {
         if (err.status == 400)
          this.msgs = [{ severity: 'info', summary: 'MƏLUMAT!', detail: err.text() }];
         else
           this.msgs = [{ severity: 'error', summary: 'UĞURSUZ!', detail: err }];
          this.approves=[];
       });
      else 
      this.router.navigate(['/home']);


    this.cols = [
      { field: 'masterId', header: 'Müraciət No.' },
      { field: 'appealType', header: 'Müraciət Növü' },
      { field: 'createdDate', header: 'Başlanma Tarixi' }
    ];
  }

  selectApprove(approve: NeededApprove) {
      if(approve.appealType==="Sifariş")
      this.router.navigate(['/order/'+approve.masterId]);
      else if(approve.appealType==="Transfer")
      this.router.navigate(['/transfer/'+approve.masterId]);
      else if(approve.appealType==="Qaytarma")
      this.router.navigate(['/transfer/'+approve.masterId]);

  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }


}
