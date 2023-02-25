import { Injectable } from '@angular/core';
import { MusicKitWrapper } from './music-kit-wrapper';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  async checkIfUserAuthorized() {
      var authorized = await MusicKitWrapper.checkIfUserIsAuthorized();
      if (authorized) return true;
      else return this.authorizeUser();
  }

  async authorizeUser() {
    return await MusicKitWrapper.startAuthentication();
  }
}
