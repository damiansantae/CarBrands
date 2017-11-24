import { Injectable } from '@angular/core';
import { DatabaseService } from "./database-service";
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

  public brands:BrandModel[] = [];
  public newBrands : BrandModel[] = [];

  constructor(public database:DatabaseService , public FB_DB : AngularFireDatabaseService) {
    this.getBrands();
  }

  public addBrand(name:string, image:string){
    console.log('tratando de añadir '+name);
    return this.database.addBrand(name,image).then((brand)=>{
      //update list of items, and then return the added list
      return this.getBrands().then(()=>{
        return brand;
      })
    });
  }

  public getBrands(){
    return this.database.getBrands()
    .then((data:any) =>{
          let localBrands:BrandModel[] = [];
          if(data){
            for(let brand of data){
              console.log('metiendo brand con id '+brand.id+' en array local ');
              let newBrand = new BrandModel(brand.name,brand.id,brand.image);
              console.log('se confirma que el nuevo brand tiene un id '+newBrand.id);
              localBrands.push(newBrand);
            }
          }
          this.brands = localBrands;
        });
  }

  public getNewBrands(){
    console.log('getNewBrands brand-service');
    return this.database.getNewBrands()
      .then((data:any) =>{
      console.log('se han recuperado nuevos brands');
        let localBrands:BrandModel[] = [];
        if(data){
          for(let brand of data){
            console.log('metiendo brand con id '+brand.id+' en array local ');
            let newBrand = new BrandModel(brand.name,brand.id,brand.image);
            console.log('se confirma que el nuevo brand tiene un id '+newBrand.id);
            localBrands.push(newBrand);
          }
        }
        this.newBrands = localBrands;
      });
  }



  public removeBrand(brand:BrandModel){
    return this.database.deleteBrand(brand.id).then(()=>{
      return this.getBrands();
    });
  }
  public deleteAllBrands(){
    console.log('deleteBrands brand-service');
    this.database.deleteAllBrands();
  }
 public  setDataFromFireBase(){
    console.log('setDataFromFireBase brand-service');
return this.FB_DB.getBrands().then((data:any) =>{
  console.log('brands extraidos de Fb');
  let localBrands:BrandModel[] = [];
  if(data){
    for(let brand of data){
      console.log('metiendo brand con id '+brand.sqliteID+' en array local y nombre '+brand.name);
      let newBrand = new BrandModel(brand.name,brand.sqliteID,brand.image);
      console.log('se confirma que el nuevo brand tiene un id '+newBrand.id);
      localBrands.push(newBrand);
    }
  }
  this.brands = localBrands;
});
 }

}
