import { Injectable } from '@angular/core';
import { MusicKitWrapper } from './music-kit-wrapper';

@Injectable({
  providedIn: 'root'
})
export class PlaybackService {

  constructor() { }

  async play() {
    MusicKitWrapper.play();
  }

  async getUserPlaylists() {
    await MusicKitWrapper.getUserPlaylists();
  }
}
