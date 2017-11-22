import { Injectable } from '@angular/core';
import { DatabaseService } from "./database-service";
import {BrandModel} from "./brandModel";

/*
  Generated class for the ListsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BrandService {

  public brands:BrandModel[] = [];

  constructor(public database:DatabaseService) {
    this.getBrands();
  }

  public addBrand(name:string, image:string){
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


  public removeBrand(brand:BrandModel){
    return this.database.deleteBrand(brand.id).then(()=>{
      return this.getBrands();
    });
  }

}
