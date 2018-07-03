import { Component, OnInit } from '@angular/core';

import { InventoryService } from '../../services/inventory.service';
import { Report } from '../../../shared/models/inventory';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../../../shared/services/data.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  subscription: Subscription;
  reportItems:Report[];

  userPermissions: any = {};
 
  constructor(
    private dataService: DataService,
    private inventoryService: InventoryService) {
    this.subscription = this.dataService.sharedData$.subscribe(data => { this.userPermissions = data });}

  ngOnInit() {  
    if(this.userPermissions.CompanyId==2)
    this.userPermissions.CompanyId=1 
    this.inventoryService.getInventaryReport(this.userPermissions.CompanyId).subscribe(r=>this.reportItems=r)
  }
 
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();   
  }

}
