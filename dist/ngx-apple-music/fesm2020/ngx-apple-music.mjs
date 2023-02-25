import * as i0 from '@angular/core';
import { Injectable, NgModule } from '@angular/core';

class NgxAppleMusicService {
    constructor() { }
}
NgxAppleMusicService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: NgxAppleMusicService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgxAppleMusicService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: NgxAppleMusicService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: NgxAppleMusicService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class NgxAppleMusicModule {
}
NgxAppleMusicModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: NgxAppleMusicModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgxAppleMusicModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.5", ngImport: i0, type: NgxAppleMusicModule });
NgxAppleMusicModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: NgxAppleMusicModule, providers: [NgxAppleMusicService] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: NgxAppleMusicModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [],
                    exports: [],
                    providers: [NgxAppleMusicService]
                }]
        }] });

var MediaItemType;
(function (MediaItemType) {
    MediaItemType[MediaItemType["albums"] = 0] = "albums";
    MediaItemType[MediaItemType["songs"] = 1] = "songs";
    MediaItemType[MediaItemType["artists"] = 2] = "artists";
    MediaItemType[MediaItemType["musicVideos"] = 3] = "musicVideos";
    MediaItemType[MediaItemType["playlists"] = 4] = "playlists";
    MediaItemType[MediaItemType["stations"] = 5] = "stations";
})(MediaItemType || (MediaItemType = {}));
var PlaylistType;
(function (PlaylistType) {
    PlaylistType[PlaylistType["editorial"] = 0] = "editorial";
    PlaylistType[PlaylistType["external"] = 1] = "external";
    PlaylistType[PlaylistType["personalMix"] = 2] = "personalMix";
    PlaylistType[PlaylistType["replay"] = 3] = "replay";
    PlaylistType[PlaylistType["userShared"] = 4] = "userShared";
})(PlaylistType || (PlaylistType = {}));
var TrackTypes;
(function (TrackTypes) {
    TrackTypes[TrackTypes["musicVideos"] = 0] = "musicVideos";
    TrackTypes[TrackTypes["songs"] = 1] = "songs";
})(TrackTypes || (TrackTypes = {}));
var MediaKind;
(function (MediaKind) {
    MediaKind[MediaKind["audio"] = 0] = "audio";
    MediaKind[MediaKind["video"] = 1] = "video";
})(MediaKind || (MediaKind = {}));
var ContentRating;
(function (ContentRating) {
    ContentRating[ContentRating["clean"] = 0] = "clean";
    ContentRating[ContentRating["explicit"] = 1] = "explicit";
})(ContentRating || (ContentRating = {}));

class Album {
    constructor(data) {
        let defaults = {
            type: MediaItemType.albums
        };
        return Object.assign(this, data, defaults);
    }
}
class Artist {
    constructor(data) {
        let defaults = {
            type: MediaItemType.artists
        };
        return Object.assign(this, data, defaults);
    }
}
class Song {
    constructor(data) {
        let defaults = {
            type: MediaItemType.songs
        };
        return Object.assign(this, data, defaults);
    }
}
class MusicVideo {
    constructor(data) {
        let defaults = {
            type: MediaItemType.musicVideos,
            attributes: { videoSubType: 'preview' }
        };
        let merged = Object.assign({}, data.attributes, defaults.attributes);
        data.attributes = merged;
        defaults.attributes = merged;
        return Object.assign(this, data, defaults);
    }
}
class Playlist {
    constructor(data) {
        let defaults = {
            type: MediaItemType.playlists
        };
        return Object.assign(this, data, defaults);
    }
}
class Station {
    constructor(data) {
        let defaults = {
            type: MediaItemType.stations
        };
        return Object.assign(this, data, defaults);
    }
}

var MusicKitWrapper;
(function (MusicKitWrapper) {
    var queue = new Array();
    async function getInstance() {
        return MusicKit.getInstance();
    }
    MusicKitWrapper.getInstance = getInstance;
    //media playback & management
    async function play() {
        console.log('called');
        setQueue(queue);
        let instance = MusicKit.getInstance();
        instance.player.play();
    }
    MusicKitWrapper.play = play;
    async function getUserPlaylists() {
        console.log('called');
        let instance = await MusicKit.getInstance();
        console.log('me: ' + await MusicKit.getInstance().me);
        let playlists = await instance.api.library.playlists(null);
        console.log(playlists);
        let playlistId = playlists[1].id;
        await instance.setQueue({
            playlist: playlistId,
        }).then(async () => await instance.player.prepareToPlay().then(async () => await instance.player.play()));
    }
    MusicKitWrapper.getUserPlaylists = getUserPlaylists;
    async function setQueue(queue, _) {
        let instance = MusicKit.getInstance();
        queue.push(new Album({ id: '1', href: '' }));
        return instance.setQueue(queue);
    }
    MusicKitWrapper.setQueue = setQueue;
    async function playNext(queue, _) {
        let instance = MusicKit.getInstance();
        return instance.player.queue.prepend(queue);
    }
    MusicKitWrapper.playNext = playNext;
    async function playLast(queue, _) {
        let instance = MusicKit.getInstance();
        return instance.player.queue.append(queue);
    }
    MusicKitWrapper.playLast = playLast;
    //init
    async function configureMusicKit(devToken, appName, buildVer) {
        console.log(await initMusicKit(devToken, appName, buildVer).then(async () => await checkIfUserIsAuthorized()
            .then(async (res) => { console.log(await MusicKit.getInstance().musicUserToken); return !res ? await startAuthentication() : null; })));
    }
    MusicKitWrapper.configureMusicKit = configureMusicKit;
    ;
    async function initMusicKit(devToken, appName, buildVer) {
        await MusicKit.configure({
            developerToken: devToken,
            app: {
                name: appName,
                build: buildVer,
            },
        });
    }
    MusicKitWrapper.initMusicKit = initMusicKit;
    // export async function internalInit() {
    //     queue = new Array<MediaItem>();
    //     queuePosition = 0;
    // }
    //auth
    async function startAuthentication() {
        return await MusicKit.getInstance().authorize();
    }
    MusicKitWrapper.startAuthentication = startAuthentication;
    async function checkIfUserIsAuthorized() {
        return MusicKit.getInstance().isAuthorized;
    }
    MusicKitWrapper.checkIfUserIsAuthorized = checkIfUserIsAuthorized;
})(MusicKitWrapper || (MusicKitWrapper = {}));

class PlaybackService {
    constructor() { }
    async play() {
        MusicKitWrapper.play();
    }
    async getUserPlaylists() {
        await MusicKitWrapper.getUserPlaylists();
    }
}
PlaybackService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: PlaybackService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PlaybackService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: PlaybackService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: PlaybackService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class AuthenticationService {
    constructor() { }
    async checkIfUserAuthorized() {
        var authorized = await MusicKitWrapper.checkIfUserIsAuthorized();
        if (authorized)
            return true;
        else
            return this.authorizeUser();
    }
    async authorizeUser() {
        return await MusicKitWrapper.startAuthentication();
    }
}
AuthenticationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: AuthenticationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
AuthenticationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: AuthenticationService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: AuthenticationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class InitializationService {
    constructor() { }
    initMusicKit(devToken, appName, buildVer) {
        return MusicKitWrapper.configureMusicKit(devToken, appName, buildVer);
    }
}
InitializationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: InitializationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
InitializationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: InitializationService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: InitializationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
function initProvider(provider, devToken, appName, buildVer) {
    return () => provider.initMusicKit(devToken, appName, buildVer);
}

/*
 * Public API Surface of ngx-apple-music
 */

/**
 * Generated bundle index. Do not edit.
 */

export { Album, Artist, AuthenticationService, InitializationService, MusicVideo, NgxAppleMusicModule, NgxAppleMusicService, PlaybackService, Playlist, Song, Station, initProvider };
//# sourceMappingURL=ngx-apple-music.mjs.map
