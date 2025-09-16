import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonCard, IonIcon, IonInput, IonItem, IonList } from "@ionic/angular/standalone";
import { LoginRequestInterface } from 'src/app/core/model/user-login-interface';
import { UserLoginService } from 'src/app/core/services/user-login.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonCard, 
    IonInput, 
    IonItem, 
    IonList
  ]
})
export class UserLoginComponent implements OnInit {
  loginForm: FormGroup;
  loginRequest!: LoginRequestInterface;

  loginService: UserLoginService

  constructor(private fb: FormBuilder, lgin: UserLoginService, private router: Router) {
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
      next: res => console.log('Login OK', res),
      error: err => console.error('Login fallito', err)
    });
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }



}
