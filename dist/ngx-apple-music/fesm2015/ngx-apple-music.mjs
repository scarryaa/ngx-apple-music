import * as i0 from '@angular/core';
import { Injectable, NgModule } from '@angular/core';
import { __awaiter } from 'tslib';

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
    function getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            return MusicKit.getInstance();
        });
    }
    MusicKitWrapper.getInstance = getInstance;
    //media playback & management
    function play() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('called');
            setQueue(queue);
            let instance = MusicKit.getInstance();
            instance.player.play();
        });
    }
    MusicKitWrapper.play = play;
    function getUserPlaylists() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('called');
            let instance = yield MusicKit.getInstance();
            console.log('me: ' + (yield MusicKit.getInstance().me));
            let playlists = yield instance.api.library.playlists(null);
            console.log(playlists);
            let playlistId = playlists[1].id;
            yield instance.setQueue({
                playlist: playlistId,
            }).then(() => __awaiter(this, void 0, void 0, function* () { return yield instance.player.prepareToPlay().then(() => __awaiter(this, void 0, void 0, function* () { return yield instance.player.play(); })); }));
        });
    }
    MusicKitWrapper.getUserPlaylists = getUserPlaylists;
    function setQueue(queue, _) {
        return __awaiter(this, void 0, void 0, function* () {
            let instance = MusicKit.getInstance();
            queue.push(new Album({ id: '1', href: '' }));
            return instance.setQueue(queue);
        });
    }
    MusicKitWrapper.setQueue = setQueue;
    function playNext(queue, _) {
        return __awaiter(this, void 0, void 0, function* () {
            let instance = MusicKit.getInstance();
            return instance.player.queue.prepend(queue);
        });
    }
    MusicKitWrapper.playNext = playNext;
    function playLast(queue, _) {
        return __awaiter(this, void 0, void 0, function* () {
            let instance = MusicKit.getInstance();
            return instance.player.queue.append(queue);
        });
    }
    MusicKitWrapper.playLast = playLast;
    //init
    function configureMusicKit(devToken, appName, buildVer) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(yield initMusicKit(devToken, appName, buildVer).then(() => __awaiter(this, void 0, void 0, function* () {
                return yield checkIfUserIsAuthorized()
                    .then((res) => __awaiter(this, void 0, void 0, function* () { console.log(yield MusicKit.getInstance().musicUserToken); return !res ? yield startAuthentication() : null; }));
            })));
        });
    }
    MusicKitWrapper.configureMusicKit = configureMusicKit;
    ;
    function initMusicKit(devToken, appName, buildVer) {
        return __awaiter(this, void 0, void 0, function* () {
            yield MusicKit.configure({
                developerToken: devToken,
                app: {
                    name: appName,
                    build: buildVer,
                },
            });
        });
    }
    MusicKitWrapper.initMusicKit = initMusicKit;
    // export async function internalInit() {
    //     queue = new Array<MediaItem>();
    //     queuePosition = 0;
    // }
    //auth
    function startAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MusicKit.getInstance().authorize();
        });
    }
    MusicKitWrapper.startAuthentication = startAuthentication;
    function checkIfUserIsAuthorized() {
        return __awaiter(this, void 0, void 0, function* () {
            return MusicKit.getInstance().isAuthorized;
        });
    }
    MusicKitWrapper.checkIfUserIsAuthorized = checkIfUserIsAuthorized;
})(MusicKitWrapper || (MusicKitWrapper = {}));

class PlaybackService {
    constructor() { }
    play() {
        return __awaiter(this, void 0, void 0, function* () {
            MusicKitWrapper.play();
        });
    }
    getUserPlaylists() {
        return __awaiter(this, void 0, void 0, function* () {
            yield MusicKitWrapper.getUserPlaylists();
        });
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
    checkIfUserAuthorized() {
        return __awaiter(this, void 0, void 0, function* () {
            var authorized = yield MusicKitWrapper.checkIfUserIsAuthorized();
            if (authorized)
                return true;
            else
                return this.authorizeUser();
        });
    }
    authorizeUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MusicKitWrapper.startAuthentication();
        });
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
