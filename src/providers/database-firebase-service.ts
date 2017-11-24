import {Injectable} from "@angular/core";
import {FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database-deprecated";
import {AngularFireDatabase, AngularFireList, AngularFireObject, snapshotChanges} from "angularfire2/database";
import {Platform} from "ionic-angular";
import {query} from "@angular/core/src/animation/dsl";
import {BrandModel} from "./brandModel";
import * as firebase from "firebase";
import DataSnapshot = firebase.database.DataSnapshot;
import {BrandService} from "./brand-service";

@Injectable()
export class AngularFireDatabaseService {


  constructor(private angFireDB: AngularFireDatabase,
              private platform: Platform) {

  }

  private isReady() {
    return this.platform.ready();
  }

  getBrands() {
    var brands : any[] = [];
    console.log('getBrands firebase-service');
    let database = firebase.database();
return database.ref('/brands').once('value').then(function (snapshot) {
console.log('numero de marcas encontradas: '+snapshot.numChildren());
let jason =snapshot.toJSON();
for (var key in jason){
  let i = 0;
  if(jason.hasOwnProperty(key)){
    console.log('brand tiene la clave '+key);
    var object = jason[key];
    brands.push(object);
  }
}
  console.log('se ha terminado de recorrer el bucle de brands');
  if (brands.length ==0){
    console.log('no hay brands nuevas');
  }else{
    console.log('se han encontrado nuevos brands');

  }
  return brands;
})
  }


  addNewBrands(brands : any[]){
    console.log('addNewBrands databasese-firebase-service');
    let  database = firebase.database();
    for(let brand of brands){
      console.log('metiendo en la bd de firebase el brand con id'+brand.id);
      database.ref('/brands/'+brand.id).set({
        name : brand.name,
        image : brand.image,
        sqliteID : brand.id
    })
    }
  }
}
