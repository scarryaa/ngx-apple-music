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
    startPlayingMedia(id: string, type: string, shuffle: boolean): Promise<void>;
    playStation(id: string): Promise<void>;
    authorizeUser(): Promise<string | void>;
    checkUserAuthorization(): Promise<boolean>;
    getRecentlyPlayed(): Promise<Array<MusicKit.Albums | MusicKit.Stations>>;
    getUserRecommendations(): Promise<Array<MusicKit.PersonalRecommendation>>;
    getPlaylistInfo(playlistId: string, isLibraryPlaylist: boolean): Promise<MusicKit.LibraryPlaylists | MusicKit.Playlists>;
    getAlbumInfo(albumId: string, isLibraryAlbum: boolean): Promise<MusicKit.LibraryAlbums | MusicKit.Albums>;
    getUserPlaylists(): Promise<MusicKit.LibraryPlaylists[]>;
    getSong(songId: string): Promise<MusicKit.Songs>;
    skipToPreviousItem(): Promise<void>;
    skipToNextItem(): Promise<void>;
    putPlaylist(playlistId: string, data: MusicKit.Songs[]): Promise<void>;
    togglePlayback(): void;
    seekToTime(time: number): Promise<void>;
    setVolume(volume: number): void;
    replaceValue(item: any): void;
    toggleShuffleMode(): void;
    toggleRepeatMode(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MusickitStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MusickitStore>;
}
