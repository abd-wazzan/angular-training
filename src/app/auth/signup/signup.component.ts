import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  public isLoading = false;

  constructor(public  authService: AuthService) {
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return
    } else {
      this.authService.addUser(form.value.email, form.value.password);
    }
  }
}
