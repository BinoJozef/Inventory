import { AppComponent } from './app.component';
import { AppConfig } from './app.config';

import { DataService } from './shared/services/data.service';
import { AuthGuard } from './shared/guards/auth.guard';
import { AuthenticationService } from './shared/services/authentication.service';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { GrowlModule } from 'primeng/primeng';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';



export function tokenGetter() {
  return localStorage.getItem('currentUser');
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    GrowlModule,
    HttpModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4200']
      }
    })
  ],
  providers: [
    DataService,
    AppConfig, 
    AuthGuard,  
    AuthenticationService  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
