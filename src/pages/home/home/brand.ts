import {Component} from '@angular/core';
import {
  AlertController, App, LoadingController, ModalController, NavController, NavParams, Refresher,
  Toast
} from 'ionic-angular';
import {BrandModel} from "../../../providers/brandModel";
import {BrandService} from "../../../providers/brand-service";
import {CarsPage} from "../cars/cars";
import {AngularFireDatabaseService} from "../../../providers/database-firebase-service";
import {LoginPage} from "../../login/login";
import {AuthenticationProvider} from "../../../providers/authentication/authentication";
import {TabsPage} from "../../tabs/tabs";
import {ImageProvider} from "../../../providers/image-service";
import {AddBrandModalPage} from "../../add-brand-modal/add-brand-modal";
import * as firebase from "firebase";

@Component({
  selector: 'page-home',
  templateUrl: 'brand.html'
})
export class BrandsPage {

  public selectedBrand: BrandModel = null;
  private currentUserEmail;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public brandService: BrandService,
              public DB_FIRE: AngularFireDatabaseService,
              private loadingCtrl: LoadingController,
              private _AUTH: AuthenticationProvider,
              private appCrtl: App) {

    this.currentUserEmail = firebase.auth().currentUser.email;

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad BrandsPage');
  }

  goToBrand(brand: BrandModel) {
    console.log('ir a lista de coches del brand cuyo nombre es ' + brand.name + ' y su id es ' + brand.id);
    this.clearSelectedBrand();
    this.navCtrl.push(CarsPage, {brand});
  }

  addNewBrand(name: string, image: string, info: string, year: string, type: string) {
    let loader = this.loadingCtrl.create();
    loader.present().then(() => {
      this.brandService.addBrand(name, image, info, year, type)
        .then(item => {

          console.log('añadido ' + item.name + ' con id ' + item.id);
          //let brand = BrandModel.fromJson(item);
          //this.goToBrand(brand);
          loader.dismiss();
        }, error => {
          console.log('error al añadir el nuevo elemento');
          loader.dismiss();

        });
    });
  }

  goToModalAddBrand() {
    let modal = this.modalCtrl.create(AddBrandModalPage);
    modal.onDidDismiss((data) => {
      if (data) {

      }
    });
    modal.present();
  }

  showAddBrand() {

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
          placeholder: 'url-image'
        },
        {
          name: 'info',
          placeholder: 'Sumary of the brand'
        },
        {
          name: 'year',
          placeholder: 'Year of foundation'
        },
        {
          name: 'type',
          placeholder: 'Type of brand (sport,alimentation,car,etc.)'
        }

      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Add',
          handler: data => {
            this.addNewBrand(data.name, data.image, data.info, data.year, data.type);
          }
        }
      ]
    });

    addBrandAlert.present();

  }

  clearSelectedBrand() {
    this.selectedBrand = null;
  }

  selectBrand(brand: BrandModel) {
    if (this.selectedBrand == brand) {
      this.clearSelectedBrand();
    }
    else {
      this.selectedBrand = brand;
    }
  }

  removeSelectedBrand() {
    this.brandService.removeBrand(this.selectedBrand);
    this.selectedBrand = null;
  }

  refreshBrands(refresher: Refresher) {
    console.log('onRefresh');
    var deletedBrands = this.brandService.deletedBrands;
    if (deletedBrands.length > 0) {
      this.DB_FIRE.removeBrand(deletedBrands);
      this.brandService.deletedBrands = [];
    }
    this.brandService.getNewBrands().then(() => {
      console.log('se han obtenido satisfactoriamente los nuevos brands');
      this.DB_FIRE.addNewBrands(this.brandService.newBrands);
      console.log('se han añadido los nuevos brands a firebase');
      this.brandService.deleteAllBrands();
      console.log('se han eliminado todos los brands');
      this.brandService.setDataFromFireBase();

    });
    refresher.complete();

  }

  public removeBrand(brand: BrandModel) {
    this.brandService.removeBrand(brand).then(() => {
      console.log(brand + ' eliminado con éxito');

    })

  }

  askForLogOut() {
    this._AUTH.logOut()
      .then((val) => {
        this.appCrtl.getRootNav().setRoot(LoginPage);
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  editBrand(brand)
  {
    let params = { brand: brand, isEdited: true },
      modal  = this.modalCtrl.create(AddBrandModalPage, params);

    modal.present();
  }

}
