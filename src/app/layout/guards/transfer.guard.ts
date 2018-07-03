import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../../shared/services/data.service';
import { PermissionGroup } from '../../shared/models/enums/permission-group.enum';
import { PermissionModule } from '../../shared/models/enums/permission-module.enum';

@Injectable()
export class TransferGuard implements CanActivate, OnDestroy {
  subscription: Subscription;
  userPermissions: any = {};
  constructor(private dataService: DataService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    this.subscription = this.dataService.sharedData$.subscribe(data => { this.userPermissions = data });

    if ((this.userPermissions.GroupCode == PermissionGroup.BogeMudiri) &&
      this.userPermissions.ModuleTypes.find(m => m.Module == PermissionModule.Transfer)) {
      return true;
    }

    this.router.navigate(['/home']);
    return false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
