import {Component} from '@angular/core';
import {AlertController, Loading, LoadingController, NavController, Platform} from 'ionic-angular';
import {AuthenticationProvider} from '../../providers/authentication/authentication';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {TabsPage} from "../tabs/tabs";
import {EmailValidator} from "../../validators/email";
import {SignupPage} from "../home/signup/signup";
import {ResetPasswordPage} from "../home/reset-pwd/reset-pwd";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public form: FormGroup;
  public displayForm: boolean = true;
  public displayError: string;
  public loading : Loading;



  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private _FB: FormBuilder,
              private _PLAT: Platform,
              public _AUTH: AuthenticationProvider) {
    console.log('holaaaa');


    this.form = this._FB.group({
      'email': ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      'password': ['', Validators.compose([Validators.required,Validators.minLength(6)])]
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
        this.loading.dismiss().then(()=>{
          this.navCtrl.setRoot(TabsPage);
        });


      })
      .catch((error) => {
      this.loading.dismiss().then( ()=>{
        let alert = this.alertCtrl.create({
          message: error.message,
          buttons:[
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        alert.present();
      });

       // this.displayError = error.message;
      });
    this.loading = this.loadingCtrl.create();
    this.loading.present();

  }

  goToSignup() {
    this.navCtrl.push(SignupPage);
  }
  goToResetPwd() {
    this.navCtrl.push(ResetPasswordPage);
  }



}
