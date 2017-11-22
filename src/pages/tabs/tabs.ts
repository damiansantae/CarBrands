import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {NavController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {BrandsPage} from "../home/home/brand";


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = BrandsPage;
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
