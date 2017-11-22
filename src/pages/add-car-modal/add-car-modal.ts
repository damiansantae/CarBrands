import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import {CarsModel} from "../../providers/CarsModel";

/*
  Generated class for the AddTaskModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-task-modal',
  templateUrl: 'add-car-modal.html'
})
export class AddCarModalPage {

  public model:CarsModel;
  public title:string = "Add new Car";
  public buttonText:string = "ADD";

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    console.log('dentro de constructor modal');
    if(this.navParams.get('car')){
      console.log('dentro de modo edicion');
      this.model = CarsModel.clone(this.navParams.get('car'));
      this.title = "Edit car";
      this.buttonText = "Save changes";
    }
    else{
      console.log('dentro de modo crear');
      let brandId = this.navParams.get('brandId');
      console.log('el id del brand es'+brandId);
     this.model = new CarsModel('',brandId, false,'','');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCarModalPage');
  }

  dismiss(){
    console.log('dismiss to add new car');
    this.viewCtrl.dismiss();

  }

  submit(){
    console.log('submit new car');
    this.viewCtrl.dismiss(this.model);
  }

}
