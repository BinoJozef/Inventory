
import { ApprovesComponent } from './components/approves/approves.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './components/orders/orders.component';
import { HomeComponent } from './components/home/home.component';
import { OrderGuard } from './guards/order.guard';
import { NeworderComponent } from './components/orders/neworder/neworder.component';
import { InventoryoperationComponent } from './components/inventoryoperation/inventoryoperation.component';
import { ReportsComponent } from './components/reports/reports.component';
import { LayoutComponent } from './layout.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { TransferGuard } from './guards/transfer.guard';
import { NeworderGuard } from './guards/neworder.guard';
import { OrderidGuard } from './guards/orderid.guard';
import { TransferidGuard } from './guards/transferid.guard';
import { ApproveGuard } from './guards/approve.guard';
import { InventoryGuard } from './guards/inventory.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
        { path: '', redirectTo: 'home' },
        { path: 'home', component: HomeComponent },
        // { path: 'home', redirectTo: "/", pathMatch: "full" },
        {
          path: 'appeals', 
          component: OrdersComponent,
          canActivate: [OrderGuard]
        },
        {
          path: 'order/new',
          component: NeworderComponent,
          canActivate: [NeworderGuard]
        },
        {
          path: 'order/:id',
          component: NeworderComponent,
          canActivate: [OrderidGuard]
      
        },
        {
          path:'transfer/new',
          component:TransferComponent,
          canActivate:[TransferGuard]
        },
        {
          path:'transfer/:id',
          component:TransferComponent,
          canActivate:[TransferidGuard]
        },
        {
          path: 'inventoryoperation',
          component: InventoryoperationComponent,
          canActivate: [InventoryGuard]
        },
        {
          path: 'approves',
          component: ApprovesComponent,
          canActivate:[ApproveGuard]
        },
        {
          path: 'reports',
          component: ReportsComponent
      
        }
     
        // { path: '**', redirectTo: '' }
       
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
