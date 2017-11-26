import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import {NavController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {BrandsPage} from "../home/home/brand";


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = BrandsPage;
  tab2Root = AboutPage;

  constructor() {

  }

}
