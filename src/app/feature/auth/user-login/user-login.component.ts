import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonCard, IonCol, IonGrid, IonIcon, IonInput, IonItem, IonList, IonRow } from "@ionic/angular/standalone";
import { LoginRequestInterface } from 'src/app/core/model/user-login-interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserLoginService } from 'src/app/core/services/user-login.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
  imports: [IonCol, IonRow, IonGrid,  
    IonButton,
    IonCard, 
    IonInput, 
    IonItem, 
    IonList,
    IonIcon,
    ReactiveFormsModule
  ]
})
export class UserLoginComponent implements OnInit {
  loginForm: FormGroup;
  loginRequest!: LoginRequestInterface;
  loginService: UserLoginService;

  constructor(private fb: FormBuilder, lgin: UserLoginService, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });

    this.loginService = lgin;
  }

  ngOnInit() {
  }

  login(form: FormGroup) {
    this.loginRequest = {
      username: form.value.username,
      password: form.value.password
    };

    this.loginService.login(this.loginRequest).subscribe({
      next: res => {
        console.log('Login OK', res);
        this.authService.setLoggedIn(true);
        this.router.navigateByUrl('/home');
      },
      error: err => {
        console.error('Login fallito', err)
        this.authService.setLoggedIn(true);
        this.router.navigateByUrl('/home');
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }



}
