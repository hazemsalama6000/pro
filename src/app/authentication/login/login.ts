import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { form, FormField, submit } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ILoginModel, initialLoginModel, loginSchema } from '../../models/loginModel';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ButtonModule, InputTextModule, PasswordModule, FormField],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {

  loginModel = signal<ILoginModel>(initialLoginModel);
  loginForm = form(this.loginModel, loginSchema);
  router = inject(Router);

  authenticationService: AuthenticationService = inject(AuthenticationService);

  addNewLink() {
    this.loginModel.update((item: any) => {
      return { ...item, socialLinks: [...item.socialLinks, ''] };
    });
  }

  removeLink(index: number) {
    this.loginModel.update((item) => {
      return {
        ...item,
        socialLinks: item.socialLinks.filter((a, i) => i != index)
      }
    });
  }

  constructor() {

  }


  ngOnInit(): void {}


  submit(event: any) {
    event.preventDefault();

    submit(this.loginForm, async (form: any) => {
      let formData:{username:string,password:string} = {username:form().value().email,password:form().value().password};
      let x = await firstValueFrom(this.authenticationService.login(formData));
       this.router.navigate(['/employee'])
    });

  }

}
