import {
  App, NavController, Refresher
} from 'ionic-angular';
import {BrandService} from "../../providers/brand-service";
import {AngularFireDatabaseService} from "../../providers/database-firebase-service";
import {BrandModel} from "../../providers/brandModel";
import {Component} from "@angular/core";
import {BrandDetailPage} from "../brand/brand-detail/brand-detail";
import {AuthenticationProvider} from "../../providers/authentication";
import {LoginPage} from "../login/login";


@Component({
  selector: 'page-about',
  templateUrl: 'seen-brands-list.html'
})
export class AboutPage {

  public selectedBrand: BrandModel = null;

  constructor(public navCtrl: NavController,
              public brandService: BrandService,
              public DB_FIRE: AngularFireDatabaseService,
              private _AUTH: AuthenticationProvider,
              private appCrtl: App) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad UserBrandsPage');
  }


  refreshUserBrands(refresher: Refresher) {
    console.log('onRefresh');
    var deletedUserBrands = this.brandService.deletedUserBrands;
    if (deletedUserBrands.length > 0) {
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

  public removeUserSeenBrand(brand: BrandModel) {
    this.brandService.removeBrandForUser(brand).then(() => {
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
}
