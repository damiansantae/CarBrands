import { Component } from '@angular/core';

import { AboutPage } from '../seen-brands-list/seen-brands-list';
import {BrandsPage} from "../brand/master-list/brand-master-list";


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = BrandsPage;
  tab2Root = AboutPage;

  constructor() {

  }

}
