import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { IonCard, IonLabel, IonItem, IonList, IonInput, IonButton, AlertController, IonInputPasswordToggle } from "@ionic/angular/standalone";
import { UserLoginService } from 'src/app/core/services/user-login.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginRequestInterface, RegisterRequestInterface } from 'src/app/core/model/user-login-interface';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  standalone: true,
  styleUrls: ['./user-register.component.scss'],
  imports: [IonButton, IonInput, IonList, IonItem, IonCard,
    MaterialModule, IonInputPasswordToggle]
})
export class UserRegisterComponent implements OnInit {
  registerForm: FormGroup;
  registerRequest!: RegisterRequestInterface;
  loginService: UserLoginService;

  
  constructor(private fb: FormBuilder, lgin: UserLoginService, private router: Router, public authService: AuthService, private alertController: AlertController) {
    this.registerForm = this.fb.group({
      username: [''],
      password: [''],
      email: [''],
      name: ['']
    });

    this.loginService = lgin;
  }

  ngOnInit() {
  }

  register(form: FormGroup) {
    this.registerRequest = {
      username: form.value.username,
      password: form.value.password,
      email: form.value.email,
      name: form.value.name
    };

    this.loginService.register(this.registerRequest).subscribe({
      next: res => {
        this.alertAdvice(true);
      },
      error: err => {
        this.alertAdvice(false);
      }
    });

  }

  alertAdvice(isSuccess: boolean) {
    if (isSuccess) {
      this.presentAlert('Register Successful', 'You can access!');
    } else {
      this.presentAlert('Register Failed', 'Please retry.');
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
