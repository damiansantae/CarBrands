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
  public newUserBrands : BrandModel[] = [];
  public deletedBrands: BrandModel[] = [];
  public deletedUserBrands : BrandModel[] =[];

  constructor(public database: DatabaseService, public FB_DB: AngularFireDatabaseService) {
    this.getBrands();
    this.getUserBrands();
  }

  public addBrand(name: string, image: string, info:string, year:string) {
    console.log('tratando de añadir ' + name);
    return this.database.addBrand(name, image,info, year).then((brand) => {
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
            let newBrand = new BrandModel(brand.name, brand.id, brand.image, brand.info,brand.year);
            console.log('se confirma que el nuevo brand tiene un id ' + newBrand.id);
            localBrands.push(newBrand);
          }
          this.brands = localBrands;
        }

      });
  }

  getUserBrands(){
    return this.database.getBrandsOfUser(firebase.auth().currentUser.uid).then(brandsId=>{
      console.log('dentro de then tras getBrandsOfUser');
      let localBrands: BrandModel[] = [];
      if (brandsId) {
        console.log('existen varios brandsId, exactamente: '+brandsId.length);
        for (let brandid of brandsId) {
          for (let i=0; i<this.brands.length;i++){
            console.log('comparando '+brandid+' con '+this.brands[i].id);
            if(brandid == this.brands[i].id){
              console.log('COINCIDEN');
              console.log('se inserta la marca '+this.brands[i].name+' en array local');
              localBrands.push(this.brands[i]);

            }else{
              console.log('NO HAY COINCIDENCIA');
            }
          }
          console.log('SALIMOS DEL FOR');

        }
        console.log('insertando array local dentro array userBrands');
        this.userBrands = localBrands;
      }
    })
  }

  public getNewBrands() {
    console.log('getNewBrands brand-service');
    return this.database.getNewBrands()
      .then((data: any) => {
        console.log('se han recuperado los id de los brands');
        let localBrands: BrandModel[] = [];
        if (data) {
          for (let brand of data) {

            console.log('metiendo brand con id ' + brand.id + ' en array local ');
            let newBrand = new BrandModel(brand.name, brand.id, brand.image, brand.info,brand.year);
            console.log('se confirma que el nuevo brand tiene un id ' + newBrand.id);
            localBrands.push(newBrand);
          }
        }
        this.newBrands = localBrands;

      });
  }
  public getUserNewBrands() {
    console.log('getUserNewBrands brand-service');
    return this.database.getUserNewBrands(firebase.auth().currentUser.uid)
      .then((data: any) => {
        console.log('se han recuperado nuevos brandsid');
        let localBrands: BrandModel[] = [];
        if (data) {
          for (let brandid of data) {
            for (let i=0; i<this.brands.length;i++){
              console.log('comparando '+brandid+' con '+this.brands[i].id);
              if(brandid == this.brands[i].id){
                console.log('COINCIDEN');
                console.log('se inserta la marca '+this.brands[i].name+' en array local');
                localBrands.push(this.brands[i]);

              }else{
                console.log('NO HAY COINCIDENCIA');
              }
            }
          }
        }
        this.newUserBrands = localBrands;


      });
  }

  public removeBrand(brand: BrandModel) {
    console.log('removeBrand brand-service');
    return this.database.deleteBrand(brand.id)
      .then(() => {
      console.log("añadiendo " + brand.name + "con id " + brand.id + " al array de eliminados");
      this.deletedBrands.push(brand);
      return this.getBrands();

    });
  }

  public deleteAllBrands() {
    console.log('deleteBrands brand-service');
    this.database.deleteAllBrands();
  }
  public deleteAllUserBrands() {
    console.log('deleteAllUserBrandsTable brand-service');
    this.database.deleteAllUserBrands(firebase.auth().currentUser.uid);
  }

  public setDataFromFireBase() {
    console.log('setDataFromFireBase brand-service');
    return this.FB_DB.getBrands().then((data: any) => {
      console.log('brands extraidos de Fb');
      let localBrands: BrandModel[] = [];
      if (data) {
        for (let brand of data) {
          console.log('metiendo brand con id ' + brand.sqliteID + ' en array local y nombre ' + brand.name);
          let newBrand = new BrandModel(brand.name, brand.sqliteID, brand.image,brand.info,brand.year);
          console.log('se confirma que el nuevo brand tiene un id ' + newBrand.id);
          localBrands.push(newBrand);
          this.database.addBrandFromFire(newBrand.name,newBrand.image,newBrand.id, newBrand.info,newBrand.year);
        }
      }
      this.brands = localBrands;
    });
  }

  public setUserDataFromFireBase() {
    console.log('setUserDataFromFireBase brand-service');
    return this.FB_DB.getUserBrands().then((data: any) => {
      console.log('user brands extraidos de Fb');
      let localBrands: BrandModel[] = [];
      if (data) {
        for (let brand of data) {
          console.log('metiendo brand con id ' + brand.sqliteID + ' en array local y nombre ' + brand.name);
          let newBrand = new BrandModel(brand.name, brand.sqliteID, brand.image, brand.info,brand.year);
          console.log('se confirma que el nuevo brand tiene un id ' + newBrand.id);
          localBrands.push(newBrand);
          this.database.addUserBrandFromFire(newBrand.id);
        }
      }
      this.userBrands = localBrands;
    });
  }
  public setSeenBrand(brand: BrandModel){
    console.log('setSeenBrand brand-service');
    console.log(firebase.auth().currentUser.uid);
    return this.database.insertSeenBrandIntoCurrentUser(brand.id, firebase.auth().currentUser.uid)
      .then(()=>{
          //update list of items, and then return the added list
          return this.getUserBrands();

      })

  }

  removeBrandForUser(brand : BrandModel){
    console.log('setSeenBrand brand-service');
    console.log(firebase.auth().currentUser.uid);
    return this.database.deleteSeenBrandOutoCurrentUser(brand.id, firebase.auth().currentUser.uid)
      .then(() => {
        console.log("añadiendo " + brand.name + "con id " + brand.id + " al array de brands de usuario eliminados");
        this.deletedUserBrands.push(brand);
        return this.getUserBrands();

      });

  }

}
