import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../../shared/services/data.service';
import { PermissionGroup } from '../../shared/models/enums/permission-group.enum';
import { PermissionModule } from '../../shared/models/enums/permission-module.enum';

@Injectable()
export class ApproveGuard implements CanActivate {
  subscription: Subscription;
  userPermissions: any = {};
  constructor(private dataService: DataService, private router: Router) { }

 
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
      this.subscription = this.dataService.sharedData$.subscribe(data => { this.userPermissions = data });

      if ((this.userPermissions.GroupCode == PermissionGroup.Techizat || 
        this.userPermissions.GroupCode == PermissionGroup.Marketinq ||
        this.userPermissions.GroupCode == PermissionGroup.TicariMarketinq) && 
      this.userPermissions.ModuleTypes.find(m => m.Module == PermissionModule.TesdiqYoxlama)) {
        return true;
      }
      
        this.router.navigate(['/home']);
        return false;
      
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
