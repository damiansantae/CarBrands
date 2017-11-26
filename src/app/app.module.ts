import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {HttpModule} from "@angular/http";
import { AboutPage } from '../pages/seen-brands-list/seen-brands-list';
import { TabsPage } from '../pages/tabs/tabs';
import {LoginPage} from "../pages/login/login";
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule }  from 'angularfire2/database';
import { AuthenticationProvider } from '../providers/authentication';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { environment } from '../enviroments/environment';
import {SQLite} from "@ionic-native/sqlite";
import {BrandDetailPage} from "../pages/brand/brand-detail/brand-detail";
import {DatabaseService} from "../providers/database-service";
import {BrandService} from "../providers/brand-service";
import {BrandsPage} from "../pages/brand/master-list/brand-master-list";
import {SignupPage} from "../pages/signup/signup";
import {ResetPasswordPage} from "../pages/reset-pwd/reset-pwd";
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
    BrandsPage,
    BrandDetailPage,
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
    BrandsPage,
    BrandDetailPage,
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
