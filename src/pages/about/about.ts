import {
  AlertController, LoadingController, ModalController, NavController, NavParams, Refresher
} from 'ionic-angular';
import {BrandService} from "../../providers/brand-service";
import {AngularFireDatabaseService} from "../../providers/database-firebase-service";
import {BrandModel} from "../../providers/brandModel";
import {Component} from "@angular/core";
import {CarsPage} from "../home/cars/cars";


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  public selectedBrand: BrandModel = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public brandService: BrandService,
              public DB_FIRE: AngularFireDatabaseService,
              private loadingCtrl: LoadingController) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ListsPage');
  }

  goToBrand(brand: BrandModel) {
    console.log('ir a lista de coches del brand cuyo nombre es ' + brand.name + ' y su id es ' + brand.id);
    this.navCtrl.push(CarsPage, {brand});
  }


  removeSelectedBrand() {
    this.brandService.removeBrand(this.selectedBrand);
    this.selectedBrand = null;
  }

  refreshBrands(refresher: Refresher) {

  }

  public removeUserSeenBrand(brand: BrandModel){
    this.brandService.removeBrandForUser(brand).then(()=>{
      console.log(brand + ' eliminado con éxito');

    })

  }
}
