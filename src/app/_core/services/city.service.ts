import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable} from 'rxjs';
import { ICity } from 'src/app/_shared/models/city';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  API = environment.postcodeAPI;

  constructor(private http: HttpClient) { }

  getCitiesFromZipcode(zipcode: string): Observable<ICity[]> {
    return this.http.get<{[key:string]: ICity}[]>(`${this.API}${zipcode}.json`).pipe(
      map(data => {
        if (data.length > 0) {
          return data.map((obj) => {
            return obj['Postcode'];
          });
        }
        else {
          return [];
        }
      })
    )
  }
}
