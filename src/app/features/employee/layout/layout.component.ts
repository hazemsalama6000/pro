import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthenticationService } from "../../../core/services/authentication.service";
import { TopHeaderComponent } from "../../../shared/top-header/top-header.component";


@Component({
  selector:'app-employee-layout',
  templateUrl:'./layout.component.html',
  styleUrl:'./layout.component.scss',
  imports: [RouterOutlet,TopHeaderComponent],
  standalone:true
})

export class EmployeeLayoutComponent{
 auth = inject(AuthenticationService);
 constructor(){

  this.auth.user$.subscribe(user=>{
      console.log(user);
  });

 }

}
