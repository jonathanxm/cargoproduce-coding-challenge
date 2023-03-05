import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UIUtilsService {

  constructor() { }


  public secondsToPlainMinutes(seconds: number): string{
    return ('0' + Math.floor(seconds / 60)).slice(-2) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2) + "m";
  }
}
