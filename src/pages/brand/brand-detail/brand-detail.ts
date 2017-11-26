import { Component } from '@angular/core';
import { NavParams, Platform} from 'ionic-angular';

import {BrandModel} from "../../../providers/brandModel";


@Component({
  selector: 'page-cars',
  templateUrl: 'brand-detail.html'
})
export class BrandDetailPage {

  public brand:BrandModel;


  constructor(

    public navParams: NavParams,
    public platform: Platform,) {
      this.brand = this.navParams.get('brand');
    console.log('Constructor pagina de brand-detail perteneciente a '+this.brand.name+' cuyo id es '+this.brand.id);
    }

}
