export class BrandModel{
  constructor(
    public name:string,
    public id:string,
    public image: string,
    public info : string,
    public year : string
  ){}

  static fromJson(data:any){
    if(!data.name || !data.id ){
      throw(new Error("Invalid argument: argument structure do not match with model"));
    }

    return new BrandModel(data.name,data.image,data.info,data.year,data.id);
  }
}
