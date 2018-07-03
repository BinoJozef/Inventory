import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { GrowlModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    GrowlModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
