import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserLoginService } from 'src/app/core/services/user-login.service';

import { UserLoginComponent } from './user-login.component';
import { AuthResponseInterface } from 'src/app/core/model/user-login-interface';

describe('UserLoginComponent', () => {
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;

  // Dichiarazione dei mock per i servizi
  let mockUserLoginService: jasmine.SpyObj<UserLoginService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAlertController: jasmine.SpyObj<AlertController>;
  let mockAlert: jasmine.SpyObj<HTMLIonAlertElement>;

  beforeEach(waitForAsync(() => {
    // Creazione dei mock con i metodi che useremo nei test
    mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['login']);
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'setLoggedIn',
      'isLoggedIn',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    // Mock dell'AlertController
    mockAlert = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
    mockAlertController = jasmine.createSpyObj('AlertController', ['create']);
    mockAlertController.create.and.returnValue(Promise.resolve(mockAlert));

    TestBed.configureTestingModule({
      imports: [UserLoginComponent, ReactiveFormsModule, IonicModule.forRoot()],
      providers: [
        // Forniamo le versioni mockate dei servizi
        { provide: UserLoginService, useValue: mockUserLoginService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: AlertController, useValue: mockAlertController },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Avvia il ciclo di vita del componente
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Test per lo scenario di successo ---
  describe('Login Success', () => {
    beforeEach(() => {
      // Arrange: Simuliamo un login di successo

      const mockAuthResponse: AuthResponseInterface = {
      token: 'mock-jwt-token-for-testing-12345',
      name: 'test'
    };

    
      mockUserLoginService.login.and.returnValue(of(mockAuthResponse));
      mockAuthService.isLoggedIn.and.returnValue(true);

      component.loginForm.setValue({
        username: 'testuser',
        password: 'password123',
      });
    });

    it('should call login service and set auth status on successful login', () => {
      // Act
      component.login(component.loginForm);

      // Assert
      expect(mockUserLoginService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
      expect(mockAuthService.setLoggedIn).toHaveBeenCalledWith(true);
    });

    it('should show success alert and navigate to home on successful login', async () => {
      // Act
      component.login(component.loginForm);
      await fixture.whenStable();

      // Assert
      expect(mockAlertController.create).toHaveBeenCalled();
      const alertConfig = mockAlertController.create.calls.mostRecent().args[0];

      expect(alertConfig).toBeDefined();

      // CORREZIONE: Usiamo '!' per dire a TypeScript che alertConfig non è undefined
      expect(alertConfig!.buttons).toBeDefined();

      const okButton =
        alertConfig!.buttons![0] as import('@ionic/angular').AlertButton;

      expect(okButton.handler).toBeDefined();
      if (okButton.handler) {
        (okButton.handler as () => void)();
      }

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/home');
    });
  });

  // --- Test per lo scenario di fallimento ---
  describe('Login Failure', () => {
    beforeEach(() => {
      // Arrange: Simuliamo un errore di login
      mockUserLoginService.login.and.returnValue(
        throwError(() => new Error('Invalid credentials'))
      );
      mockAuthService.isLoggedIn.and.returnValue(false);

      component.loginForm.setValue({
        username: 'wronguser',
        password: 'wrongpassword',
      });
    });

    it('should call login service and handle error correctly', () => {
      spyOn(console, 'error');
      // Act
      component.login(component.loginForm);

      // Assert
      expect(mockUserLoginService.login).toHaveBeenCalledWith({
        username: 'wronguser',
        password: 'wrongpassword',
      });
      expect(mockAuthService.setLoggedIn).toHaveBeenCalledWith(false);
      expect(console.error).toHaveBeenCalled();
    });

    it('should show failure alert and navigate back to login page on failed login', async () => {
      // Act
      component.login(component.loginForm);
      await fixture.whenStable();

      // Assert
      expect(mockAlertController.create).toHaveBeenCalled();
      const alertConfig =
        mockAlertController.create.calls.mostRecent().args[0];

      expect(alertConfig).toBeDefined();
      
      // CORREZIONE: Usiamo '!' anche qui
      expect(alertConfig!.buttons).toBeDefined();

      const okButton =
        alertConfig!.buttons![0] as import('@ionic/angular').AlertButton;

      expect(okButton.handler).toBeDefined();
      if (okButton.handler) {
        (okButton.handler as () => void)();
      }

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/userLogin');
    });
  });
});