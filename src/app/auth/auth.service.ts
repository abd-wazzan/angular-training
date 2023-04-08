import {Injectable} from "@angular/core";
import {map, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthData} from "./auth-data.model";

@Injectable({providedIn: 'root'})
export class AuthService {
    constructor(private httpClient: HttpClient, private router: Router) {
    }


    addUser(email: string, password: string) {
        const authData: AuthData = {
            email: email,
            password: password
        };
        this.httpClient.post<{ message: string, data: any }>('http://localhost:3000/api/auth/signup', authData)
            .subscribe((res) => {
                console.log(res)
                this.router.navigate(["/"]);
            });
    }
}