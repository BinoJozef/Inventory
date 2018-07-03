import { InventoryService } from './../../services/inventory.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
};
 // Pie
 public pieChartLabels: string[] = [
  'Veysəloğlu',
  'Tru Vega',
  'Vesta Horeka'
];
public pieChartData: number[] = [123,232,545];
public pieChartType: string = 'pie';
public _backgroundColorsPie:any[] = [{backgroundColor: ["#e84351",  "#f3af37", "#4d86dc"]}];



// Doughnut
public doughnutChartLabels: string[] = [
  'Veysəloğlu',
  'Tru Vega',
  'Vesta Horeka'
];
public doughnutChartData: number[] = [350, 450, 100];
public doughnutChartType: string = 'doughnut';
public _backgroundColorsDoughnut:any[] = [{backgroundColor: ["#434a54", "#3ebf9b", "#4d86dc"]}];



  constructor(private inventoryService:InventoryService) { }

  ngOnInit() {
    this.inventoryService.getAllFreeInventories().subscribe(i=>this.pieChartData=i)
    this.inventoryService.getAllAssignedInventories().subscribe(i=>this.doughnutChartData=i);
  }

}
