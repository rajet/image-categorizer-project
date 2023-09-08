import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private authService: AuthService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  async login() {
    const email = this.loginForm.controls['email'].value;
    const password = this.loginForm.controls['password'].value;
    if (this.loginForm.invalid) {
      return;
    }
    await this.authService.loginWithEmailAndPassword(
      {
        email: email,
        password: password,
      },
      'dashboard',
    );
  }

  async devLogin() {
    await this.authService.loginWithEmailAndPassword(
      {
        email: 'cplab@hslu.ch',
        password: 'Admin123',
      },
      'dashboard',
    );
  }
}
