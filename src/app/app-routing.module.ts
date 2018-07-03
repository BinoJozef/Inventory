import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared/guards/auth.guard';


const routes: Routes = [
    { path: '', loadChildren: 'app/layout/layout.module#LayoutModule', canActivate: [AuthGuard] },
    { path: 'login', loadChildren: 'app/login/login.module#LoginModule'},
    { path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
