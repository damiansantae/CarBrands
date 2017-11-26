import {
  AlertController, LoadingController, ModalController, NavController, NavParams, Refresher
} from 'ionic-angular';
import {BrandService} from "../../providers/brand-service";
import {AngularFireDatabaseService} from "../../providers/database-firebase-service";
import {BrandModel} from "../../providers/brandModel";
import {Component} from "@angular/core";
import {CarsPage} from "../home/cars/cars";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {LoginPage} from "../login/login";


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
              private loadingCtrl: LoadingController,
              private _AUTH : AuthenticationProvider) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad UserBrandsPage');
  }

  goToBrand(brand: BrandModel) {
    console.log('ir a lista de coches del brand cuyo nombre es ' + brand.name + ' y su id es ' + brand.id);
    this.navCtrl.push(CarsPage, {brand});
  }


  removeSelectedBrand() {
    this.brandService.removeBrand(this.selectedBrand);
    this.selectedBrand = null;
  }

  refreshUserBrands(refresher: Refresher) {
    console.log('onRefresh');
    var deletedUserBrands = this.brandService.deletedUserBrands;
    if(deletedUserBrands.length>0){
      console.log('hay brands de este usuario borradas');
      this.DB_FIRE.removeBrandsFromUser(deletedUserBrands);
      this.brandService.deletedUserBrands = [];
    }
    this.brandService.getUserNewBrands().then(() => {
      console.log('se han obtenido satisfactoriamente los nuevos brands');
      this.DB_FIRE.addNewUserBrands(this.brandService.newUserBrands);
      console.log('se han añadido los nuevos brands a firebase');
      this.brandService.deleteAllUserBrands();
      console.log('se han eliminado todos los brands');
      this.brandService.setUserDataFromFireBase();

    });
    refresher.complete();
  }

  public removeUserSeenBrand(brand: BrandModel){
    this.brandService.removeBrandForUser(brand).then(()=>{
      console.log(brand + ' eliminado con éxito');

    })

  }

  askForLogOut(){
    this._AUTH.logOut()
      .then((val) => {
        this.navCtrl.setRoot(LoginPage);

      })
      .catch((error) => {
        alert(error.message);
      });
  }
}
