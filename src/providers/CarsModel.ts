export class CarsModel {
  constructor(public name: string,
              public brandId: string,
              public seen: boolean = false,
              public type: string,
              public image: string,
              public id: string = "0",) {
  }

  static clone(car: CarsModel) {
    return new CarsModel(car.name, car.brandId, car.seen, car.type, car.image, car.id);
  }

  static fromJson(data: any) {
    if (!data.name || !data.id || !data.brandId || !data.type || !data.image) {
      throw(new Error("Invalid argument: argument structure do not match with model"));
    }

    return new CarsModel(data.name, data.brandId, data.seen, data.type, data.image, data.id)
  }
}
