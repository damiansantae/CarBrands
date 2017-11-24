import {Injectable} from '@angular/core';
import {DatabaseService} from "./database-service";
import {BrandModel} from "./brandModel";
import * as firebase from "firebase";
import {AngularFireDatabaseService} from "./database-firebase-service";

/*
  Generated class for the ListsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BrandService {

  public brands: BrandModel[] = [];
  public userBrands : BrandModel[] = [];
  public newBrands: BrandModel[] = [];
  public deletedBrands: BrandModel[] = [];

  constructor(public database: DatabaseService, public FB_DB: AngularFireDatabaseService) {
    this.getBrands();
  }

  public addBrand(name: string, image: string) {
    console.log('tratando de añadir ' + name);
    return this.database.addBrand(name, image).then((brand) => {
      //update list of items, and then return the added list
      return this.getBrands().then(() => {
        return brand;
      })
    });
  }

  public getBrands() {
    return this.database.getBrands()
      .then((data: any) => {
        let localBrands: BrandModel[] = [];
        if (data) {
          for (let brand of data) {
            console.log('metiendo brand con id ' + brand.id + ' en array local ');
            let newBrand = new BrandModel(brand.name, brand.id, brand.image);
            console.log('se confirma que el nuevo brand tiene un id ' + newBrand.id);
            localBrands.push(newBrand);
          }
          this.brands = localBrands;
        }

      });
  }

  getUserBrands(){
    return this.database.getBrandOfUser(firebase.auth().currentUser.uid).then(brands=>{
      let localBrands: BrandModel[] = [];
      if (brands) {
        for (let brand of brands) {
          console.log('metiendo brand con id ' + brand.id + ' en array local ');
          let newBrand = new BrandModel(brand.name, brand.id, brand.image);
          console.log('se confirma que el nuevo brand tiene un id ' + newBrand.id);
          localBrands.push(newBrand);
        }
        this.userBrands = localBrands;
      }
    })
  }

  public getNewBrands() {
    console.log('getNewBrands brand-service');
    return this.database.getNewBrands()
      .then((data: any) => {
        console.log('se han recuperado nuevos brands');
        let localBrands: BrandModel[] = [];
        if (data) {
          for (let brand of data) {
            console.log('metiendo brand con id ' + brand.id + ' en array local ');
            let newBrand = new BrandModel(brand.name, brand.id, brand.image);
            console.log('se confirma que el nuevo brand tiene un id ' + newBrand.id);
            localBrands.push(newBrand);
          }
        }
        this.newBrands = localBrands;
      });
  }


  public removeBrand(brand: BrandModel) {
    console.log('removeBrand brand-service');
    return this.database.deleteBrand(brand.id).then(() => {
      console.log("añadiendo " + brand.name + "con id " + brand.id + " al array de eliminados");
      this.deletedBrands.push(brand);
      return this.getBrands();

    });
  }

  public deleteAllBrands() {
    console.log('deleteBrands brand-service');
    this.database.deleteAllBrands();
  }

  public setDataFromFireBase() {
    console.log('setDataFromFireBase brand-service');
    return this.FB_DB.getBrands().then((data: any) => {
      console.log('brands extraidos de Fb');
      let localBrands: BrandModel[] = [];
      if (data) {
        for (let brand of data) {
          console.log('metiendo brand con id ' + brand.sqliteID + ' en array local y nombre ' + brand.name);
          let newBrand = new BrandModel(brand.name, brand.sqliteID, brand.image);
          console.log('se confirma que el nuevo brand tiene un id ' + newBrand.id);
          localBrands.push(newBrand);
          this.database.addBrandFromFire(newBrand.name,newBrand.image,newBrand.id);
        }
      }
      this.brands = localBrands;
    });
  }
  public setSeenBrand(brand: BrandModel){
    console.log('setSeenBrand brand-service');
    console.log(firebase.auth().currentUser.uid);
    return this.database.insertSeenBrandIntoCurrentUser(brand.id, firebase.auth().currentUser.uid)

  }

  removeBrandForUser(brand : BrandModel){
    console.log('setSeenBrand brand-service');
    console.log(firebase.auth().currentUser.uid);
    return this.database.deleteSeenBrandOutoCurrentUser(brand.id, firebase.auth().currentUser.uid)

  }

}
