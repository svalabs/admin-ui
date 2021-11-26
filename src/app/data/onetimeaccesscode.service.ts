import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerResponse } from './serverresponse';
import { combineAll, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { atou } from '../unicode';
import { from, of } from 'rxjs';
import { OneTimeAccessCode } from './onetimeaccesscode';
import { ScheduledEvent } from './scheduledevent';

@Injectable({
  providedIn: 'root'
})
export class OnetimeaccesscodeService {

  constructor(public http: HttpClient) { }

  public list(accessCode: string) {
    return this.http.get(environment.server+ "/a/scheduledevent/list/" + accessCode + "/otac")
      .pipe(
        switchMap((response: ServerResponse) => {
          return from(JSON.parse(atou(response.content)))
        }),
        map((otac: OneTimeAccessCode) => {
          otac.access_code_identifer = atou(otac.access_code_identifer);
          otac.code = atou(otac.code);
          otac.timestamp = new Date(otac.timestamp);
          otac.user_name = atou(otac.user_name);
          return of(otac);
        }),
        combineAll()
      )
  }

  // might delete the get methode, because at current state isn't needed
  public get(accessCode: string) {
    return this.http.get(environment.server + "/a/scheduledevent/" + accessCode + "/otac")
      .pipe(
        switchMap((response: ServerResponse) => {
          let se = JSON.parse(atou(response.content));
          se.access_code_identifer = atou(se.access_code_identifer);
          se.code = atou(se.code);
          se.user_name = atou(se.user_name);
          se.timestamp = new Date(se.timestamp);
          return of(se);
        })
      )
  }

  public create(quantity: number, accessCode: string) {
    var params = new HttpParams()
      .set("quantity", JSON.stringify(quantity))
      .set("accessCode", accessCode)

    return this.http.post(environment.server + "/a/scheduledevent/" + accessCode + "/otac", params)
    .pipe(
      switchMap((response: ServerResponse) => {
        return from (JSON.parse(atou(response.message)))
      })
    )
  }
}
