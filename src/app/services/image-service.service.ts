import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Entries } from '../interfaces/image.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageServiceService {

  constructor(private readonly http: HttpClient) { }

  getImages(): Observable<Entries[]> {
    return this.http.get<Entries[]>('https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=8');
  }
}
