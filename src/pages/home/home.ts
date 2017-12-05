import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataProvider } from '../../providers/data/data';
import { GenresPage } from '../genres/genres';

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
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController) {

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

          this._data.getGames(this.genre, 0)
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

  openGenres() {
    let genreModal = this.modalCtrl.create(GenresPage);
    genreModal.onDidDismiss(genre => {
      let loader = this.loadingCtrl.create({
        content: 'Getting genres...'
      });
      if (genre) {
        loader.present().then(() => {
          this.storage.get('genre').then((val) => {
            this.genre = val.id;
            this.genreName = val.name;
            this._data.getGames(this.genre, 0)
              .subscribe(res => this.games = res);
          })
        });
      }
      setTimeout(() => {
        loader.dismiss();
      }, 1200);
    });

    genreModal.present();
  }

  openFavorites() {
    this.storage.get('favorites')
      .then((val) => {
        this.genreName = 'Favorites';
        if (val.length != 0) {
          this._data.getFavorites(val)
            .subscribe(res => this.games = res);
        } else {
          this.games.length = 0;
        }
      })
  }

  addFavorite(gameId) {
    this.favorites.push(gameId);
    this.favorites = this.favorites.filter(function (item, i, ar) {
      return ar.indexOf(item) === i;
    });
    this.storage.set('favorites', this.favorites);
    console.log('favs: ', this.favorites);
  }

  removeFavorite(gameId) {
    this.favorites = this.favorites.filter(function(item) {
      return item !== gameId;
    });
    this.storage.set('favorites', this.favorites);
    console.log('favs: ', this.favorites);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

}
