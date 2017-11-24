import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {BrandModel} from "./brandModel";


@Injectable()
export class DatabaseService {

  private database: SQLiteObject;
  //initially set dbReady status to false
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor(private platform:Platform, private sqlite:SQLite) {
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'cars.db',
        location: 'default'
      })
      .then((db:SQLiteObject)=>{
        this.database = db;

        this.createTables().then(()=>{
          //we loaded or created tables, so, set dbReady to true
          this.dbReady.next(true);
        });
      })

    });
  }

  private createTables(){

    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS brand (
        id TEXT PRIMARY KEY,
        name TEXT,
        image TEXT,
        year TEXT,
        type TEXT,
        info TEXT,
        isNew INTEGER
      );`
    ,{})

      .then(()=>{
        return this.database.executeSql(`CREATE TABLE IF NOT EXISTS users-brands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uid TEXT,
        brandid TEXT,
        FOREIGN KEY(brandid) REFERENCES brand(id)
        );`,{})
      })
      .catch((err)=>console.log("error detected creating tables", err));

  }


  private isReady(){
    return new Promise((resolve, reject) =>{
      //if dbReady is true, resolve
      if(this.dbReady.getValue()){
        resolve();
      }
      //otherwise, wait to resolve until dbReady returns true
      else{
        this.dbReady.subscribe((ready)=>{
          if(ready){
            resolve();
          }
        });
      }
    })
  }


  getBrands(){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql("SELECT * from brand", [])
      .then((data)=>{
        let brands = [];
        for(let i=0; i<data.rows.length; i++){
          console.log('brand encontrado con id '+data.rows.item(i).id);
          brands.push(data.rows.item(i));
        }
        return brands;
      })
    })
  }
  getBrandOfUser(uid){
    var userBrandsId = [];
    var userBrands = [];
    return this.isReady()
      .then(()=>{
        return this.database.executeSql(`SELECT * from brand WHERE uid = '${uid}';`, [])
          .then((data)=>{
            let brands = [];
            for(let i=0; i<data.rows.length; i++){
              console.log('relacion encontrada con id '+data.id);
              userBrandsId.push(data.rows.item(i).brandid);
            }
            for(let i=0; i<userBrandsId.length; i++){
              userBrands.push(this.getBrand(userBrandsId[i]));
            }
            return userBrands;
          })
      })

  }

  insertSeenBrandIntoCurrentUser(brandid, uid){
console.log('inserting brand with id '+brandid+' into seen table of user with id '+uid);
    return this.isReady()
      .then(()=>{
        console.log('isReady');
        return this.database.executeSql(`INSERT INTO users-brands(uid,brandid) VALUES ('${uid}','${brandid}');`, {}).then((result)=>{
          if(result.insertId){
            console.log('insertao con exito');
          }
        })
      });
  }
  deleteSeenBrandOutoCurrentUser(brandid, uid){
    console.log('inserting brand with id '+brandid+' into seen table of user with id '+uid);
    return this.isReady()
      .then(()=>{
        console.log('isReady');
        return this.database.executeSql(`DELETE FROM users-brands WHERE uid = '${uid}' AND brandid = '${brandid}';`, {}).then((result)=>{
          if(result.insertId){
            console.log('insertao con exito');
          }
        })
      });
  }

  addBrand(name:string, image:string){
    console.log('addBrand('+name+','+image+') database-service');
    var uuid : string = this.getuid();
    console.log(uuid);
    return this.isReady()
    .then(()=>{
      console.log('isReady');
      return this.database.executeSql(`INSERT INTO brand(name,image,isNew,id) VALUES ('${name}','${image}',1,'${uuid}');`, {}).then((result)=>{
        if(result.insertId){
          console.log('insertao con exito');
          return this.getBrand(uuid);
        }
      })
    });
  }

  addBrandFromFire(name:string,image:string,id:string){
    console.log('addBrandFromFire method');
    console.log('adding bran with id '+id+' and name '+name);
    return this.isReady()
      .then(()=>{
        console.log('isReady');
        return this.database.executeSql(`INSERT INTO brand(name,image,isNew,id) VALUES ('${name}','${image}',0,'${id}');`, {}).then((result)=>{
          if(result.insertId){
            console.log('insertao con exito');
            return this.getBrand(result.insertId);
          }
        })
      });

  }

  getuid(){
    return '_' + Math.random().toString(36).substr(2, 9);

  }

  getBrand(id:string){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`SELECT * FROM brand WHERE id = '${id}'`, [])
      .then((data)=>{

        if(data.rows.length){
          console.log('se ha encontrado un brand con el id solicitado');
          let brand =data.rows.item(0);
          console.log('se ha encontrado el brand con id '+brand.id);
          return brand
        }
        return null;
      })
    });
  }

  deleteBrand(id:string){
    console.log('deleteBrand database-srvice con id'+id);
    return this.isReady()
    .then(()=>{
      console.log('proceed to execute sqlite delete query');
      return this.database.executeSql(`DELETE FROM brand WHERE id = '${id}'`, [])


    })
  }

  deleteAllBrands(){
    console.log('deleteAllBrands database-service');
    return this.isReady()
      .then(()=>{
      return this.database.executeSql(`DELETE FROM brand`,[]);
      })
  }


  getCarsFromBrand(brandId:string){
    console.log('Tratando de extraer los coches pertenecientes a la marca cuyo id es'+brandId.valueOf());
    return this.isReady()
    .then(()=>{
      console.log('db ready');
      return this.database.executeSql(`SELECT * from car WHERE brandId = '${brandId}'`, [])
            .then((data)=>{
        console.log('se han encontrado coches');
              let cars = [];
              for(let i=0; i<data.rows.length; i++){

                let car = data.rows.item(i);
                console.log('insertamos en array local el coche'+car.name);
                //cast binary numbers back to booleans
                car.inStock = !!car.inStock;
                cars.push(car);
              }
              return cars;
            })
    })
  }

  getNewBrands (){
    console.log('getNewBrands database-service');
    let brands = [];

    return this.isReady()
      .then( ()=> {
        console.log ('db ready');
        return this.database.executeSql('SELECT * from brand WHERE isNew = 1',[])
          .then( (data)=>{

            for(let i=0; i<data.rows.length; i++){
              let brand = data.rows.item(i);
              console.log('insertamos en array local el coche'+brand.name);
              //cast binary numbers back to booleans
              brands.push(brand);
            }
            return brands;
          })

      })

  }

  getNewCars(){
    let cars = [];

    return this.isReady()
      .then( ()=> {
        console.log ('db ready');
        return this.database.executeSql('SELECT * from car WHERE isNew = 1',[])
          .then( (data)=>{

            for(let i=0; i<data.rows.length; i++){
              let car = data.rows.item(i);
              console.log('insertamos en array local el coche'+car.name);
              //cast binary numbers back to booleans
              car.inStock = !!car.inStock;
              cars.push(car);
            }
            return cars;
          })

      })
  }

  addCar(name: string,type:string,image: string,brandId: string, userId:string){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`INSERT INTO car 
        (name, type, image,isNew, brandId) VALUES (?,?, ?, 1, ?);`,
        //cast booleans to binary numbers
        [name,type,image, brandId]);
    }).then(()=>{
        return this.database.executeSql(`INSERT INTO users-car 
        () VALUES ();`,
          //cast booleans to binary numbers
          [name,type,image, brandId]);
      })
  }

  modifyCar( inStock:boolean, id:string){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`UPDATE users-car
        SET 
            inStock = ?,
        WHERE id = ?`,
        //cast booleans to binary numbers
        [inStock?1:0, id]);
    });
  }

  removeCar(id:string){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`DELETE FROM car WHERE id = '${id}'`, [])
    })
  }


}
