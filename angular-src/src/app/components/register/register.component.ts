import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';

import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private flashMessagesService:FlashMessagesService,
    private authService:AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onRegSubmit(){
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    }

    if(!this.validateService.validateRegister(user)){
      this.flashMessagesService.show('Fill in all fields', {cssClass: 'alert-danger'});
      return false;
    }

    if(!this.validateService.validateEmail(user.email)){
      this.flashMessagesService.show('Incorrect email format.', {cssClass: 'alert-danger'});
      return false;
    }

    this.authService.registerUser(user).subscribe(data => {
      if(data.success){
        this.flashMessagesService.show('Successfully registered.', {cssClass: 'alert-success'});
        this.router.navigate(['/login']);
      } else {
        this.flashMessagesService.show('Failed.', {cssClass: 'alert-danger'});
        this.router.navigate(['/register']);
      }
    });

  }

}


/*remember the 'data' in this.authService.registerUser(user).subscribe(function(data){
  is gotten from the express/node backend part */