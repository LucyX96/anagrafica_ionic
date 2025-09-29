import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { IonAlert, IonButton, IonCard, IonCol, IonGrid, IonIcon, IonInput, IonItem, IonList, IonRow, IonInputPasswordToggle } from "@ionic/angular/standalone";
import { finalize } from 'rxjs';
import { LoginRequestInterface } from 'src/app/core/model/user-login-interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserLoginService } from 'src/app/core/services/user-login.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
  imports: [
    IonButton,
    IonCard,
    IonInput,
    IonItem,
    IonList,
    ReactiveFormsModule,
    IonGrid,
    IonCol,
    IonRow,
    IonIcon,
    IonInputPasswordToggle,
  ]
})
export class UserLoginComponent implements OnInit {
  loginForm: FormGroup;
  loginRequest!: LoginRequestInterface;
  loginService: UserLoginService;

  constructor(private fb: FormBuilder, lgin: UserLoginService, private router: Router, public authService: AuthService, private alertController: AlertController) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });

    this.loginService = lgin;
  }

  ngOnInit(): void {
  }

  login(form: FormGroup) {
    this.loginRequest = {
      username: form.value.username,
      password: form.value.password
    };

    this.loginService.login(this.loginRequest).subscribe({
      next: res => {
        this.loginService.saveToken(res.token);
        this.loginService.saveName(res.name);
        this.authService.setLoggedIn(true);
        this.alertAdvice(true);
      },
      error: err => {
        console.error('Login fallito', err);
        this.authService.setLoggedIn(false);
        this.alertAdvice(false);
      }
    });
  }


  alertAdvice(isSuccess: boolean) {
    if (isSuccess) {
      this.presentAlert('Login Successful', 'Welcome back!');
    } else {
      this.presentAlert('Login Failed', 'Please retry.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navigateAfterAlert();
          }
        }
      ]
    });

    await alert.present();
  }

  navigateAfterAlert() {
    const pathLogged = this.authService.isLoggedIn() ? '/home' : '/userLogin';
    this.router.navigateByUrl(pathLogged);
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}

