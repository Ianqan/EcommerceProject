import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { map } from 'rxjs/operators'
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl = "http://localhost:8080/api/countries";
  private statesUrl = "http://localhost:8080/api/states";

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(countryCode: string): Observable<State[]> {

    const searchStateUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStateUrl).pipe(
      map(response => response._embedded.states)
    );
  }
  getMonths(start: number): Observable<number[]> {
    
    let data: number[] = [];
    // build an array for "Month" dropdown list
    // start at current month and loop 
    for (let month = start; month <= 12; month++) {
      data.push(month);
    }

    return of(data);
  }

  getYears(): Observable<number[]> {
    let data: number[] = [];
    // build an array for "Year" dropdown list
    // loop for the next ten years
    const start: number = new Date().getFullYear();
    const end: number = start + 10;

    for (let year = start; year <= end; year++) {
      data.push(year);
    }

    return of(data);
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}