import {Injectable} from "@angular/core";
import * as firebase from 'firebase';


@Injectable()
export class StorageService {


  loadData(){

  }



  uploadImage(imageString) : Promise<any>
  {
    let image       : string  = 'brand-' + new Date().getTime() + '.jpg',
      storageRef  : any,
      parseUpload : any;

    return new Promise((resolve, reject) =>
    {
      storageRef       = firebase.storage().ref('brands/' + image);
      parseUpload      = storageRef.putString(imageString, 'data_url');

      parseUpload.on('state_changed', (_snapshot) =>
        {
          console.log('snapshot progess ' + _snapshot);
        },
        (_err) =>
        {
          reject(_err);
        },
        (success) =>
        {
          resolve(parseUpload.snapshot);
        });
    });
  }



}
