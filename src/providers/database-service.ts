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
        id TEXT PRIMARY KEY,
        name TEXT,
        image TEXT,
        isNew INTEGER
      );`
    ,{})
    .then(()=>{
      return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS car (
        id TEXT PRIMARY KEY,
        name TEXT,
        inStock INTEGER,
        type TEXT,
        image TEXT,
        isNew INTEGER,
        brandId TEXT,
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
    console.log('addBrand('+name+','+image+') database-service');
    var uuid = this.getuid();
    console.log(uuid);
    return this.isReady()
    .then(()=>{
      console.log('isReady');
      return this.database.executeSql(`INSERT INTO brand(name,image,isNew,id) VALUES ('${name}','${image}',1,'${uuid}');`, {}).then((result)=>{
        if(result.insertId){
          console.log('insertao con exito');
          return this.getBrand(result.insertId);
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

  deleteAllBrands(){
    console.log('deleteAllBrands database-service');
    return this.isReady()
      .then(()=>{
      return this.database.executeSql(`DELETE FROM brand`,[]);
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

  addCar(name: string,inStock:boolean,type:string,image: string,brandId: number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`INSERT INTO car 
        (name, inStock, type, image,isNew, brandId) VALUES (?, ?, ?, ?, 1, ?);`,
        //cast booleans to binary numbers
        [name, inStock?1:0, type,image, brandId]);
    });
  }

  modifyCar(name: string, inStock:boolean,type:string,image: string, id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`UPDATE todo 
        SET name = ?, 
            inStock = ?,
            type = ?,
            isNew = 1,
            image = ?
           
        WHERE id = ?`,
        //cast booleans to binary numbers
        [name, inStock?1:0,type,image, id]);
    });
  }

  removeCar(id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`DELETE FROM car WHERE id = ${id}`, [])
    })
  }


}
