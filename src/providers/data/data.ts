import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  httpHeaders: HttpHeaders = new HttpHeaders().set('user-key', '581cab38f83a2982dba69ea140f89f24');

  // https://alligator.io/angular/httpclient-intro/
  limit: number = 50;

  constructor(public http: HttpClient) {
    console.log('Hello DataProvider Provider');
  }

  getGames(genre: string, offset_num: number) {
    const genre_id = genre;
    const offset = offset_num;
    const headers = this.httpHeaders;

    return this.http.get(`/games/?fields=name,release_dates,screenshots&limit=${this.limit}&offset=${offset}&order=release_dates.date:desc&filter[genres][eq]=${genre_id}&filter[screenshots][exists]`, { headers });
  }

}
