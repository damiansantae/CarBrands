import { Injectable } from '@angular/core';

import { DatabaseService } from "./database-service";
import {CarsModel} from "./CarsModel";

/*
  Generated class for the TodoService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CarService {

  public cars: CarsModel[] = [];
  public newCars : CarsModel[] = [];

  constructor(public database: DatabaseService) {

  }

  public loadFromBrand(id:string){
    console.log('Load from brand cuyo id es '+id);
    this.getCars(id);
  }

  private getCars(id:string){
    console.log('getCars de car-service');
    return this.database.getCarsFromBrand(id)
    .then((data:any) => {
      console.log('se ha accedido correctamente a la tabla de coches');
        if(!data){
          console.log('pero no se ha encontrado ningún coche con ese id');
          this.cars = [];
          return;
        } else{
          console.log('si se han encontrado coches ');
          let localCars:CarsModel[] =[];
          for(let car of data){
            console.log('se inserta dentro de un array local el coche '+car.name +'with brandID'+car.brandId);
            localCars.push(CarsModel.clone(car));
          }
          this.cars = localCars;
        }

      }
    )
  }

  public getNewCars(){
    return this.database.getNewCars()
      .then((data:any) =>{
        let localCars:CarsModel[] = [];
        if(data){
          for(let car of data){
            console.log('metiendo brand con id '+car.id+' en array local ');
          localCars.push(CarsModel.clone(car))
          }
        }
        this.newCars = localCars;
      });
  }

  toogleCar(car:CarsModel){
    let updatedCar = CarsModel.clone(car);
    updatedCar.seen = ! car.seen;

    return this.updateTodo(car, updatedCar);
  }

  removeCar(car: CarsModel){
    return this.database.removeCar(car.id)
    .then(()=>{
      return this.getCars(car.brandId);
    })
  }

  updateTodo(originalCar:CarsModel, modifiedCar:CarsModel){
    return this.database.modifyCar(modifiedCar.name, modifiedCar.seen, modifiedCar.type,modifiedCar.image, modifiedCar.id)
    .then(()=>{
      return this.getCars(modifiedCar.brandId);
    })
  }

  addCar(car:CarsModel){
    console.log('open add car database service to add car'+car.name+'with brandId'+car.brandId);

    return this.database.addCar(car.name, car.type,car.image, car.brandId)
    .then((car)=>{
      return this.getCars(car.brandId);
    })
  }



}
