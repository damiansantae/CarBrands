import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavController, ViewController, NavParams} from 'ionic-angular';

import * as firebase from 'firebase';
import {ImageProvider} from "../../providers/image-service";
import {PreloaderProvider} from "../../providers/preloader-service";
import {StorageService} from "../../providers/storage-service";
import {BrandService} from "../../providers/brand-service";


@Component({
  selector: 'page-modals',
  templateUrl: 'add-brand-modal.html'
})

export class AddBrandModalPage {

  public form: any;
  public finalImage: any;
  public brands: any;

  public brandName: any = '';
  public brandImage: any = '';
  public brandInfo: any = '';
  public brandYear: any = '';
  public brandType: any = '';
  public brandId: string = '';
  public isEditable: boolean = false;


  constructor(public params: NavParams,
              private _FB: FormBuilder,
              private _IMG: ImageProvider,
              public viewCtrl: ViewController,
              private _LOADER: PreloaderProvider,
              private storageService: StorageService,
              private brandService: BrandService) {


    this.form = _FB.group({
      'name': ['', Validators.required],
      'year': ['', Validators.maxLength(4)],
      'image': ['', Validators.required],
      'type': ['', Validators.required],
      'info': ['', Validators.required]
    });


    if (params.get('isEdited')) {
      let brand = params.get('brand');


      this.brandName = brand.name;
      this.brandInfo = brand.info;
      this.brandImage = brand.image;
      this.brandYear = brand.year;
      this.brandType = brand.type;
      this.brandId = brand.id;
      this.finalImage = this.brandImage;
      this.isEditable = true;
    }
  }


  saveBrand(val) {
    this._LOADER.displayPreloader();

    let name: string = this.form.controls["name"].value,
      info: string = this.form.controls["info"].value,
      type: string = this.form.controls["type"].value,
      year: string = this.form.controls["year"].value,
      image: string = this.finalImage;


    if (this.isEditable) {
      console.log('modo edicion');

      if (image !== this.brandImage) {
        console.log('la imagen NO es la misma que la anterior');
        this.storageService.uploadImage(image)
          .then((snapshot: any) => {
            let uploadedImage: any = snapshot.downloadURL;
            this.brandService.updateBrand(name, uploadedImage, info, year, type, this.brandId)
              .then((data) => {
                this._LOADER.hidePreloader();
              });
          });
      }
      else {
        console.log('la imagen es la misma que la anterior');
        this.brandService.updateBrand(name, image, info, year, type, this.brandId)
          .then((data) => {
            this._LOADER.hidePreloader();
          });


      }

    }
    else {
      console.log('modo adicion');
      this.storageService.uploadImage(image)
        .then((snapshot: any) => {
          let uploadedImage: any = snapshot.downloadURL;


          this.brandService.addBrand(name, uploadedImage, info, year, type)

            .then((data) => {
              this._LOADER.hidePreloader();
            });
        });

    }
    this.closeModal(true);
  }


  closeModal(val = null) {
    this.viewCtrl.dismiss(val);
  }


  selectImage() {
    this._IMG.selectImage()
      .then((data) => {
        this.finalImage = data;
      });
  }


}
