import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginUser } from '../types/user.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: Auth,
    private router: Router,
    private matSnackBar: MatSnackBar,
  ) {}

  async loginWithEmailAndPassword(user: LoginUser, redirectToURL?: string) {
    try {
      console.log('user: ', user);
      const result = await signInWithEmailAndPassword(
        this.afAuth,
        user.email,
        user.password,
      );
      if (result) {
        // Logged in
        if (redirectToURL) {
          await this.router.navigateByUrl(redirectToURL);
        }
      }
    } catch (e) {
      this.matSnackBar.open('Das Login ist leider fehlgeschlagen.', 'x', {
        duration: 10000,
      });
      console.error(`Login failed: ${e}`);
      await this.router.navigateByUrl('/login');
    }
  }
}
