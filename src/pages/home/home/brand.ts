import { Component } from '@angular/core';
import {AlertController, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {BrandModel} from "../../../providers/brandModel";
import {BrandService} from "../../../providers/brand-service";
import {CarsPage} from "../cars/cars";


@Component({
  selector: 'page-home',
  templateUrl: 'brand.html'
})
export class BrandsPage {

  public selectedBrand: BrandModel = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl : ModalController,
              public alertCtrl: AlertController,
              public brandService: BrandService,
              private loadingCtrl: LoadingController) {}



  ionViewDidLoad() {
    console.log('ionViewDidLoad ListsPage');
    let numero =1;
    console.log('numero'+numero);
  }

  goToBrand(brand:BrandModel){
    console.log('ir a lista de coches del brand cuyo nombre es '+brand.name+' y su id es '+brand.id);
    this.clearSelectedBrand();
    this.navCtrl.push(CarsPage, {brand});
  }

  addNewBrand(name:string, image:string){
    let loader = this.loadingCtrl.create();
    loader.present().then(()=>{
      this.brandService.addBrand(name,image)
        .then(item =>{
          let brand = BrandModel.fromJson(item);
          //this.goToBrand(brand);
          loader.dismiss();
        }, error => {
          loader.dismiss();

        });
    });
  }
  goToModalAddBrand(){
    let modal = this.modalCtrl.create(' AddCarModalPage');
    modal.present();
  }

  showAddBrand(){

    // TODO: buscar como añadir una imagen
    let addBrandAlert = this.alertCtrl.create({
      title: 'New brand',
      message: 'Write name of your new brand',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        },
        {
         name: 'image',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {}
        },
        {
          text: 'Add',
          handler: data => {
            this.addNewBrand(data.name, data.image);
          }
        }
      ]
    });

    addBrandAlert.present();

  }

  clearSelectedBrand(){
    this.selectedBrand = null;
  }

  selectBrand(brand:BrandModel){
    if(this.selectedBrand == brand){
      this.clearSelectedBrand();
    }
    else{
      this.selectedBrand = brand;
    }
  }

  removeSelectedBrand(){
    this.brandService.removeBrand(this.selectedBrand);
    this.selectedBrand = null;
  }
  refreshBrands(refresher){


    }

}
