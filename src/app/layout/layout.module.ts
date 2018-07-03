
import { InventoryService } from './services/inventory.service';
import { InventoryGuard } from './guards/inventory.guard';
import { OrderGuard } from './guards/order.guard';
import { TransferGuard } from './guards/transfer.guard';
import { NeworderGuard } from './guards/neworder.guard';
import { ApproveGuard } from './guards/approve.guard';

import { LayoutRoutingModule } from './layout-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule as Ng2Charts } from 'ng2-charts';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { InputTextModule } from 'primeng/inputtext';
import { DataTableModule } from 'primeng/datatable';
import { GrowlModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';

import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { HomeComponent } from './components/home/home.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ReportsComponent } from './components/reports/reports.component';
import { LoadingspinnerComponent } from './components/loadingspinner/loadingspinner.component';
import { InventoryoperationComponent } from './components/inventoryoperation/inventoryoperation.component'
import { NeworderComponent } from './components/orders/neworder/neworder.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { OrderidGuard } from './guards/orderid.guard';
import { TransferidGuard } from './guards/transferid.guard';
import { ApprovesComponent } from './components/approves/approves.component';


@NgModule({
  declarations: [
    SidebarComponent,
    LayoutComponent,
    HomeComponent,
    OrdersComponent,
    ReportsComponent,
    LoadingspinnerComponent,
    InventoryoperationComponent,
    NeworderComponent,
    NavbarComponent,
    TransferComponent,
    ApprovesComponent
  ],
  imports: [
    LayoutRoutingModule,
    CommonModule,
    FormsModule,
    HttpModule,
    CustomFormsModule,
    GrowlModule,
    InputTextModule,
    DataTableModule ,
    Ng2Charts,
    NgSelectModule,
    DropdownModule,
    TableModule,
    ButtonModule,
    NgbDropdownModule.forRoot()
   
  ],
  providers: [ 
    OrderGuard,
    InventoryGuard,
    TransferGuard,
    NeworderGuard,
    OrderidGuard,
    TransferidGuard,
    ApproveGuard,
    InventoryService
  ]
})
export class LayoutModule { }
