import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Platform, LoadingController } from 'ionic-angular';
import {CarsModel} from "../../../providers/CarsModel";
import {CarService} from "../../../providers/car-service";
import {BrandModel} from "../../../providers/brandModel";
import {AddCarModalPage} from "../../add-car-modal/add-car-modal";

/*
  Generated class for the Todos page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-cars',
  templateUrl: 'cars.html'
})
export class CarsPage {

  private toogleCarTimeout = null;
  public brand:BrandModel;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public carService: CarService,
    public platform: Platform,
    private loadingCtrl: LoadingController) {
      this.brand = this.navParams.get('brand');
    console.log('Constructor pagina de cars perteneciente a '+this.brand.name+' cuyo id es '+this.brand.id);
    }

  ionViewDidLoad() {

  }


  ionViewWillUnload(){
  }

  setCarsStyles(item:CarsModel){
    let styles = {
      'text-decoration': item.seen ? 'line-through' : 'none',
    };
    return styles;
  }

  toogleCar(car:CarsModel){
    if(this.toogleCarTimeout)
      return;
    this.toogleCarTimeout = setTimeout(()=>{
      this.carService.toogleCar(car);
      this.toogleCarTimeout = null;
    }, this.platform.is('ios') ? 0 : 300);
  }

  removeCar(car:CarsModel){
    this.carService.removeCar(car);
  }

  addCar(car:CarsModel){
    console.log('add car metod');
    let loader = this.loadingCtrl.create();
    loader.present();
    this.carService.addCar(car)
    .then(()=>loader.dismiss())
    .catch(()=>loader.dismiss());
  }

  updateCar(originalCar:CarsModel, modifiedCar:CarsModel){
    let loader = this.loadingCtrl.create();
    loader.present();
    this.carService.updateTodo(originalCar, modifiedCar)
    .then(()=>loader.dismiss(), () =>loader.dismiss());
  }

  showAddCar(){
    let modal = this.modalCtrl.create(AddCarModalPage, {brandId: this.brand.id});
    modal.present();

    modal.onDidDismiss(data => {
      console.log('back to cars list');
      if(data){
        console.log('there are a new car');
        this.addCar(data);
      }
      this.carService.loadFromBrand(this.brand.id);
    });
  }

  showEditCar(car: CarsModel){
    let modal = this.modalCtrl.create(AddCarModalPage, {car});
    modal.present();

    modal.onDidDismiss(data=>{
      if(data){
        this.updateCar(car, data);
      }
    })
  }

}
