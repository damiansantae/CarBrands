import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {HttpModule} from "@angular/http";
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { TabsPage } from '../pages/tabs/tabs';
import {LoginPage} from "../pages/login/login";
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule }  from 'angularfire2/database';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { environment } from '../enviroments/environment';
import {SQLite} from "@ionic-native/sqlite";
import {CarsPage} from "../pages/home/cars/cars";
import {DatabaseService} from "../providers/database-service";
import {BrandService} from "../providers/brand-service";
import {BrandsPage} from "../pages/home/home/brand";
import {SignupPage} from "../pages/home/signup/signup";
import {ResetPasswordPage} from "../pages/home/reset-pwd/reset-pwd";


// for AngularFireDatabase
import { AngularFireDatabase} from 'angularfire2/database/database';
import {AngularFireDatabaseService} from "../providers/database-firebase-service";
import {ImageProvider} from "../providers/image-service";
import {PreloaderProvider} from "../providers/preloader-service";
import {StorageService} from "../providers/storage-service";
import {AddBrandModalPage} from "../pages/add-brand-modal/add-brand-modal";
import {Camera} from "@ionic-native/camera";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    BrandsPage,
    CarsPage,
    AddBrandModalPage,
    LoginPage,
    TabsPage,
    SignupPage,
    ResetPasswordPage,

  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    AboutPage,
    ContactPage,
    BrandsPage,
    CarsPage,
    AddBrandModalPage,
    TabsPage,
    SignupPage,
    ResetPasswordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticationProvider,
    BrandService,
    SQLite,
   DatabaseService,
    AngularFireDatabaseService,
    ImageProvider,
    PreloaderProvider,
    StorageService,
    Camera

  ]
})
export class AppModule {}
