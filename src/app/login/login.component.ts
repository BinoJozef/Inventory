import { Message } from 'primeng/components/common/message';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';
import { AuthUser } from '../shared/models/auth-user';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    // model: any = {};

    model: AuthUser = new AuthUser();

    returnUrl: string;
    userPermissions: any = {};
    user: any;

    msgs: Message[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
        
        // private alertService: AlertService
    ) { }

    ngOnInit() {

        // reset login status
         this.authenticationService.logout();

        // // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.authenticationService.login(this.model.username, this.model.password, this.model.categoryid)
            .subscribe(
            user => {
                this.user = user;
                localStorage.setItem('currentUser', this.user.Token);
                this.router.navigate([this.returnUrl]);                           
            },
            error => {
                console.log(error);
                if (error.status == 500 || error.status == 0)
                    this.msgs = [{ severity: 'error', summary: 'XƏTA!', detail: 'Sistem xətası!' }];
                else
                    this.msgs = [{ severity: 'error', summary: 'UĞURSUZ!', detail: 'İstifadəçi adı və ya şifrə yanlışdır!' }];

            });
            // () => {
            //     if (this.user) {
            //         this.authenticationService.getUserPermissions(this.user.Id, this.user.Token).subscribe(
            //             x => this.userPermissions = x,
            //             null,
            //             () => {
            //                 if (this.userPermissions.Apps.find(a => a == 101)) {
            //                     localStorage.setItem('currentUser', JSON.stringify(this.user.Token));
            //                     this.dataService.sendData(this.userPermissions);
            //                     this.router.navigate([this.returnUrl]);
            //                 }
            //                 else {
            //                     this.msgs = [{ severity: 'error', summary: 'UĞURSUZ!', detail: 'Bura yetkiniz yoxdur!' }];

            //                 }
            //             }
            //         );
            //     }
            // });
    }


}

