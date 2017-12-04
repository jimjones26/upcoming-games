import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  games: any = [];
  genre: '5';
  genreName: string = 'Upcoming Games';
  favorites = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _data: DataProvider,
    private storage: Storage,
    public loadingCtrl: LoadingController) {

    let loading = this.loadingCtrl.create({
      content: 'Getting games...'
    });

    loading.present().then(() => {
      this.storage.get('genre')
        .then((val) => {
          if (val) {
            this.genre = val.id;
            this.genreName = val.name;
          } else {
            this.genreName = 'Shooter';
            this.storage.set('genre', this.genre);
          }

          this._data.getGames('5', 0)
            .subscribe(res => {
              this.games = res;
              loading.dismiss();
            });
        });

      this.storage.get('favorites').then((val) => {
        if (!val)
          this.storage.set('favorites', this.favorites);
        else
          this.favorites = val;
      });

    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

}
