/// <reference types="MusicKit" />
/// <reference types="MusicKit" />
/// <reference types="MusicKit" />
/// <reference types="MusicKit" />
import { OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Store } from "./store";
import * as i0 from "@angular/core";
export interface MusickitState {
    initialized: boolean;
    volume: number;
    storefront: string;
    queue: Array<MusicKit.MediaItem>;
    history: Array<MusicKit.MediaItem>;
    queuePosition: number;
    shuffleMode: MusicKit.PlayerShuffleMode;
    repeatMode: MusicKit.PlayerRepeatMode;
    currentTrack: MusicKit.MediaItem | null;
    currentTrackArtworkURL: string;
    currentPlaybackTime: number;
    currentPlaybackDuration: number;
    isPlaying: boolean;
    playbackState: MusicKit.PlaybackStates | null;
    userPlaylists: MusicKit.LibraryPlaylists[];
}
export declare class MusickitStore extends Store<MusickitState> implements OnDestroy {
    subs: Subscription;
    instance: MusicKit.MusicKitInstance;
    constructor();
    ngOnDestroy(): void;
    addEventListener(listener: any): void;
    reconfigure(devToken: string, appName: string, buildVer: string): Promise<void>;
    initMusicKit(devToken: string, appName: string, buildVer: string): Promise<void>;
    startPlayingSong(id: string): Promise<void>;
    authorizeUser(): Promise<string | void>;
    checkUserAuthorization(): Promise<boolean>;
    getPlaylistInfo(playlistId: string): Promise<MusicKit.LibraryPlaylists | MusicKit.Playlists>;
    getUserPlaylists(): Promise<MusicKit.LibraryPlaylists[]>;
    getSong(): Promise<void>;
    skipToPreviousItem(): Promise<void>;
    skipToNextItem(): Promise<void>;
    togglePlayback(): void;
    seekToTime(time: number): Promise<void>;
    setVolume(volume: number): void;
    toggleShuffleMode(): void;
    toggleRepeatMode(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MusickitStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MusickitStore>;
}
