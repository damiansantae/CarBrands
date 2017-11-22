import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


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
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        image TEXT
      );`
    ,{})
    .then(()=>{
      return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS car (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        seen INTEGER,
        brandId INTEGER,
        type TEXT,
        image TEXT,
        FOREIGN KEY(brandId) REFERENCES brand(id)
        );`,{} )
    }).catch((err)=>console.log("error detected creating tables", err));

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

  addBrand(name:string, image:string){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`INSERT INTO brand(name,image) VALUES ('${name}','${image}');`, {}).then((result)=>{
        if(result.insertId){
          return this.getBrand(result.insertId);
        }
      })
    });
  }

  getBrand(id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`SELECT * FROM brand WHERE id = ${id}`, [])
      .then((data)=>{
        if(data.rows.length){
          return data.rows.item(0);
        }
        return null;
      })
    });
  }

  deleteBrand(id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`DELETE FROM brand WHERE id = ${id}`, [])
    })
  }


  getCarsFromBrand(brandId:number){
    console.log('Tratando de extraer los coches pertenecientes a la marca cuyo id es'+brandId.valueOf());
    return this.isReady()
    .then(()=>{
      console.log('db ready');
      return this.database.executeSql(`SELECT * from car WHERE brandId = ${brandId}`, [])
            .then((data)=>{
        console.log('se han encontrado coches');
              let cars = [];
              for(let i=0; i<data.rows.length; i++){

                let car = data.rows.item(i);
                console.log('insertamos en array local el coche'+car.name);
                //cast binary numbers back to booleans
                car.seen = !!car.seen;
                cars.push(car);
              }
              return cars;
            })
    })
  }

  addCar(name: string,seen:boolean,type:string,image: string,brandId: number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`INSERT INTO car 
        (name, seen, type, image, brandId) VALUES (?, ?, ?, ?,?);`,
        //cast booleans to binary numbers
        [name, seen?1:0, type,image, brandId]);
    });
  }

  modifyCar(name: string, seen:boolean,type:string,image: string, id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`UPDATE todo 
        SET name = ?, 
            seen = ?,
            type = ?,
            image = ?
           
        WHERE id = ?`,
        //cast booleans to binary numbers
        [name, seen?1:0,type,image, id]);
    });
  }

  removeCar(id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`DELETE FROM car WHERE id = ${id}`, [])
    })
  }


}
