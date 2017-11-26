import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {Platform} from "ionic-angular";
import * as firebase from "firebase";

@Injectable()
export class AngularFireDatabaseService {


  constructor(private platform: Platform) {

  }

  private isReady() {
    return this.platform.ready();
  }

  getBrands() {
    var brands: any[] = [];
    console.log('getBrands firebase-service');
    let database = firebase.database();
    return this.isReady().then(() => {
      return database.ref('/brands').once('value').then(function (snapshot) {
        console.log('numero de marcas encontradas: ' + snapshot.numChildren());
        let jason = snapshot.toJSON();
        for (var key in jason) {
          let i = 0;
          if (jason.hasOwnProperty(key)) {
            console.log('brand tiene la clave ' + key);
            var object = jason[key];
            brands.push(object);
          }
        }
        console.log('se ha terminado de recorrer el bucle de brands');
        if (brands.length == 0) {
          console.log('no hay brands nuevas');
        } else {
          console.log('se han encontrado nuevos brands');

        }
        return brands;
      })
    })

  }

  getUserBrands() {
    let uid = firebase.auth().currentUser.uid;
    var brandsID: any[] = [];
    let userBrands: any[] = [];
    console.log('getUserBrands firebase-service');
    let database = firebase.database();
    this.isReady().then(() => {

    })
    return database.ref('/users/' + uid + '/brands-seen').once('value').then(function (snapshot) {
      console.log('numero de marcas encontradas: ' + snapshot.numChildren());
      let jason = snapshot.toJSON();
      for (var key in jason) {
        if (jason.hasOwnProperty(key)) {
          console.log('brand tiene la clave ' + key);
          var object = jason[key];
          brandsID.push(key);
        }
      }
      console.log('se ha terminado de recorrer el bucle de brands');
      if (brandsID.length == 0) {
        console.log('no hay brands nuevas');
      } else {
        console.log('se han encontrado nuevos brands');

      }
      return brandsID;
    }).then(() => {
      return database.ref('/brands').once('value').then(function (snapshot) {
        console.log('numero de marcas encontradas: ' + snapshot.numChildren());
        let jason = snapshot.toJSON();
        for (let key in jason) {
          if (jason.hasOwnProperty(key)) {
            for (let i = 0; i <= brandsID.length; i++) {
              if (jason[key].sqliteID == brandsID[i]) {
                userBrands.push(jason[key]);
                break;
              }
            }

          }
        }
        console.log('se ha terminado de recorrer el bucle de brands');
        if (userBrands.length == 0) {
          console.log('no hay userbrands nuevas');
        } else {
          console.log('se han encontrado nuevos user brands');

        }
        return userBrands;
      })
    });
  }

  /*  getBrands() {
      var brands: any[] = [];
      console.log('getBrands firebase-service');
      let database = firebase.database();
      return database.ref('/brands').once('value').then(function (snapshot) {
        console.log('numero de marcas encontradas: ' + snapshot.numChildren());
        let jason = snapshot.toJSON();
        for (var key in jason) {
          let i = 0;
          if (jason.hasOwnProperty(key)) {
            console.log('brand tiene la clave ' + key);
            var object = jason[key];
            brands.push(object);
          }
        }
        console.log('se ha terminado de recorrer el bucle de brands');
        if (brands.length == 0) {
          console.log('no hay brands nuevas');
        } else {
          console.log('se han encontrado nuevos brands');

        }
        return brands;
      })
    }

    getUserBrands() {
      let uid = firebase.auth().currentUser.uid;
      var brandsID: any[] = [];
      let userBrands: any[] = [];
      console.log('getUserBrands firebase-service');
      let database = firebase.database();
      return database.ref('/users/' + uid + '/brands-seen').once('value').then(function (snapshot) {
        console.log('numero de marcas encontradas: ' + snapshot.numChildren());
        let jason = snapshot.toJSON();
        for (var key in jason) {
          if (jason.hasOwnProperty(key)) {
            console.log('brand tiene la clave ' + key);
            var object = jason[key];
            brandsID.push(key);
          }
        }
        console.log('se ha terminado de recorrer el bucle de brands');
        if (brandsID.length == 0) {
          console.log('no hay brands nuevas');
        } else {
          console.log('se han encontrado nuevos brands');

        }
        return brandsID;
      }).then(() => {

        return database.ref('/brands').once('value').then(function (snapshot) {
          console.log('numero de marcas encontradas: ' + snapshot.numChildren());
          let jason = snapshot.toJSON();
          for (let key in jason) {
            if (jason.hasOwnProperty(key)) {
              for (let i = 0; i <= brandsID.length; i++) {
                if (jason[key].sqliteID == brandsID[i]) {
                  userBrands.push(jason[key]);
                  break;
                }
              }

            }
          }
          console.log('se ha terminado de recorrer el bucle de brands');
          if (userBrands.length == 0) {
            console.log('no hay userbrands nuevas');
          } else {
            console.log('se han encontrado nuevos user brands');

          }
          return userBrands;
        })
      });
    }*/


  addNewBrands(brands: any[]) {
    console.log('addNewBrands databasese-firebase-service');
    let database = firebase.database();
    for (let brand of brands) {
      console.log('metiendo en la bd de firebase el brand con id' + brand.id);
      database.ref('/brands/' + brand.id).set({
        name: brand.name,
        image: brand.image,
        sqliteID: brand.id,
        info: brand.info,
        year: brand.year,
        type: brand.type
      })
    }
  }

  removeBrand(brands: any[]) {
    for (let brand of brands) {
      console.log('eliminando de FB el brand con id' + brand.id);
      this.remove(brand);
    }
  }

  remove(brand) {
    let database = firebase.database();
    this.isReady().then(()=>{
      return database.ref('/brands/' + brand.id).remove();
    })

  }
/*  remove(brand) {
    let database = firebase.database();
    return database.ref('/brands/' + brand.id).remove();
  }*/

  removeBrandsFromUser(deletedUserBrands: any []) {
    let uid = firebase.auth().currentUser.uid;
    for (let brand of deletedUserBrands) {
      console.log('quitando al usuario ' + uid + ' el brand con id' + brand.id + ' de la lista de vistos');
      this.removeSeenBrand(brand, uid);
    }
  }

  removeSeenBrand(brand, uid) {
    let database = firebase.database();
    this.isReady().then(()=>{
      return database.ref('/users/' + uid + '/brands-seen/' + brand.id).remove();
    })

  }

 /* removeSeenBrand(brand, uid) {
    let database = firebase.database();
    return database.ref('/users/' + uid + '/brands-seen/' + brand.id).remove();
  }
*/
  addNewUserBrands(brands: any[]) {
    let uid = firebase.auth().currentUser.uid;
    console.log('addNewUserBrands databasese-firebase-service');
    let database = firebase.database();
    for (let brand of brands) {
      let brandID = brand.id;
      console.log('metoendo al usuario ' + uid + 'el brand con id ' + brand.id);
      database.ref('/users/' + uid + '/brands-seen/' + brandID).set({
        brandID: brandID
      })
    }
  }
}
