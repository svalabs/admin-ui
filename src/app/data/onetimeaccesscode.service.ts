import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerResponse } from './serverresponse';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { atou } from '../unicode';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnetimeaccesscodeService {

  constructor(public http: HttpClient) { }

  public get(id: string) {
    return this.http.get(environment.server + "/a/scheduledevent/" + id)
      .pipe(
        switchMap((response: ServerResponse) => {
          let se = JSON.parse(atou(response.content));
          se.start_time = new Date(se.start_time);
          se.end_time = new Date(se.end_time);
          return of(se);
        })
      )
  }
}
