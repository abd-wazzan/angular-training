import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Subscription} from "rxjs";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
    public isLoading = false;
    private authStatusSub: Subscription;

    constructor(public authService: AuthService) {
    }

    onLogin(form: NgForm) {
        if (form.invalid) {
            return;
        } else {
            this.isLoading = true;
            this.authService.login(form.value.email, form.value.password);
        }
    }


    ngOnInit(): void {
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus => {
                this.isLoading = false;
            }
        );
    }

    ngOnDestroy(): void {
        this.authStatusSub.unsubscribe();
    }
}
