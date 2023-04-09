import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private authStatusListener = new Subject<boolean>();
    private tokenTimer: NodeJS.Timer;
    private userId: string;

    constructor(private httpClient: HttpClient, private router: Router) {
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.userId = null;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(["/"]);
    }


    addUser(email: string, password: string) {
        const authData: AuthData = {
            email: email,
            password: password
        };
        this.httpClient.post<{ message: string, data: any }>('http://localhost:3000/api/auth/signup', authData)
            .subscribe((res) => {
                this.router.navigate(["/"]);
            }, error => {
                this.authStatusListener.next(false)
            });
    }

    login(email: string, password: string) {
        const authData: AuthData = {
            email: email,
            password: password
        };
        this.httpClient.post<{
            message: string,
            token: string,
            expiresIn: number,
            userId: string
        }>('http://localhost:3000/api/auth/login', authData)
            .subscribe((res) => {
                this.token = res.token;
                if (this.token) {
                    this.userId = res.userId;
                    const expiresIn = res.expiresIn;
                    this.setAuthTimer(expiresIn);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresIn * 1000);
                    this.saveAuthData(this.token, expirationDate, this.userId);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    this.router.navigate(["/"]);
                }
            }, error => {
                this.authStatusListener.next(false)
            });
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', userId);
        localStorage.setItem('token_expiry', expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('token_expiry');
    }

    private getAuthData(): { token: string, expiry: Date, userId: string } | void {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('token_expiry');
        const userId = localStorage.getItem('user_id');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expiry: new Date(expirationDate),
            userId: userId
        }
    }

    autoAuthUser() {
        const authData = this.getAuthData();
        if (!authData) {
            return;
        }
        const now = new Date();
        const expiresIn = authData.expiry.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authData.token;
            this.isAuthenticated = true;
            this.userId = authData.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }
}