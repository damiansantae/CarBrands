import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {AuthenticationProvider} from '../../providers/authentication/authentication';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {TabsPage} from "../tabs/tabs";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public form: FormGroup;
  public displayForm: boolean = true;
  public displayError: string;



  constructor(public navCtrl: NavController,
              private _FB: FormBuilder,
              private _PLAT: Platform,
              public _AUTH: AuthenticationProvider) {


    this.form = this._FB.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }


  logIn() {

    let email: any = this.form.controls['email'].value,
      password: any = this.form.controls['password'].value;


    this._AUTH.loginWithEmailAndPassword(email, password)
      .then((auth: string) => {
        this.form.reset();
        this.displayForm = false;
        this.displayError = '';
        this.navCtrl.setRoot(TabsPage);

      })
      .catch((error) => {
        this.displayError = error.message;
      });
  }



}
