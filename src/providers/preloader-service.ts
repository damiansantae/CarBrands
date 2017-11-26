import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';



@Injectable()
export class PreloaderProvider {

  private loading : any;

  constructor( public http        : Http,
               public loadingCtrl : LoadingController)
  {
  }



  displayPreloader() : void
  {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();
  }



  hidePreloader() : void
  {
    this.loading.dismiss();
  }

}
