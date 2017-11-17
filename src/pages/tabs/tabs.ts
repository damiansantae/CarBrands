import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {NavController} from "ionic-angular";
import {LoginPage} from "../login/login";


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  public displayError: string;

  constructor(public _AUTH: AuthenticationProvider,
              public navCtrl: NavController,) {

  }


  logOut() {
    this._AUTH.logOut()
      .then((val) => {
      alert("hola");
        this.navCtrl.setRoot(LoginPage);

      })
      .catch((error) => {
        this.displayError = error.message;
      });
  }
}
