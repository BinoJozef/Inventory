import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Location } from '@angular/common';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  location: Location;
  title = 'app';

  ngOnInit(): void {
    // if (localStorage.getItem('currentUser'))
    // localStorage.removeItem('currentUser'); 
     
      if (location.protocol === 'http:') {
       window.location.href = location.href.replace('http', 'https');
      }
       
  }
 
}
