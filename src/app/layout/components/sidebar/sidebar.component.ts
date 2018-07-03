import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { DataService } from '../../../shared/services/data.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { PermissionGroup } from '../../../shared/models/enums/permission-group.enum';
import { PermissionModule } from '../../../shared/models/enums/permission-module.enum';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  showMenu: string = '';
  pushRightClass: string = 'push-right';

  userPermissions: any = {};
  subscription: Subscription;
  
  constructor(public router: Router,public authService: AuthenticationService,public dataService:DataService) {
    this.router.events.subscribe(val => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });
  }

  ngOnInit() {
    
    this.subscription= this.dataService.sharedData$.subscribe(data =>{ this.userPermissions = data});
  }
  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }
  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
  onLogoutClick() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  get appealModuleVisibility(){
    if ((this.userPermissions.GroupCode == PermissionGroup.BogeMudiri ||
       this.userPermissions.GroupCode == PermissionGroup.Marketinq || 
       this.userPermissions.GroupCode == PermissionGroup.TicariMarketinq ||
       this.userPermissions.GroupCode == PermissionGroup.Techizat) && 
    this.userPermissions.ModuleTypes.find(m => m.Module == PermissionModule.Sifarisler)) {
      return true;
    }
    return false;
  }
  get inventoryModuleVisibility(){
    if ((this.userPermissions.GroupCode == PermissionGroup.Techizat) && 
    this.userPermissions.ModuleTypes.find(m => m.Module == PermissionModule.InventarEmeliyyati)) {
      return true;
    }
    return false;
  }
  get transferModuleVisibility(){
    if ((this.userPermissions.GroupCode == PermissionGroup.BogeMudiri) && 
    this.userPermissions.ModuleTypes.find(m => m.Module == PermissionModule.Transfer)) {
      return true;
    }
    return false;
  }
  get newOrderModuleVisibility(){
    if((this.userPermissions.GroupCode == PermissionGroup.BogeMudiri || this.userPermissions.GroupCode == PermissionGroup.TicariMarketinq) && 
    this.userPermissions.ModuleTypes.find(m => m.Module == PermissionModule.SifarisFormu)){
      return true;
    }
    return false;
  }
  get approveModuleVisibility(){
    if (( this.userPermissions.GroupCode == PermissionGroup.Marketinq ||
      this.userPermissions.GroupCode == PermissionGroup.TicariMarketinq || 
      this.userPermissions.GroupCode == PermissionGroup.Techizat) && 
    this.userPermissions.ModuleTypes.find(m => m.Module == PermissionModule.TesdiqYoxlama)) {
      return true;
    }
    return false;
  }

  get processMainModuleVisibility(){
    if(this.newOrderModuleVisibility || this.transferModuleVisibility || this.appealModuleVisibility || this.approveModuleVisibility)
     return true;
     return false;
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
