import { Injectable } from '@angular/core';
import { MusicKitWrapper } from './music-kit-wrapper';

@Injectable({
  providedIn: 'root'
})
export class InitializationService {

  constructor() { }

  initMusicKit(devToken: string, appName: string, buildVer: string) {
    return MusicKitWrapper.configureMusicKit(devToken, appName, buildVer);
}
}

export function initProvider(provider: InitializationService, devToken: string, appName: string, buildVer: string) {
  return () => provider.initMusicKit(devToken, appName, buildVer);
}