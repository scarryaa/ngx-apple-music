import { __awaiter } from 'tslib';
import * as i0 from '@angular/core';
import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, map, distinctUntilChanged, Subscription } from 'rxjs';

class Store {
    constructor(initialState) {
        this._state = new BehaviorSubject(initialState);
    }
    get state$() {
        return this._state.asObservable();
    }
    get state() {
        return this._state.getValue();
    }
    setState(fn) {
        const state = fn(this.state);
        this._state.next(Object.assign(Object.assign({}, this.state), state));
    }
    select(selector) {
        return this.state$.pipe(map(selector), distinctUntilChanged());
    }
}
Store.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: Store, deps: [{ token: '' }], target: i0.ɵɵFactoryTarget.Injectable });
Store.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: Store, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: Store, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Inject,
                        args: ['']
                    }] }];
    } });

var Events;
(function (Events) {
    Events["audioTrackAdded"] = "audioTrackAdded";
    Events["audioTrackChanged"] = "audioTrackChanged";
    Events["audioTrackRemoved"] = "audioTrackRemoved";
    Events["authorizationStatusDidChange"] = "authorizationStatusDidChange";
    Events["authorizationStatusWillChange"] = "authorizationStatusWillChange";
    Events["bufferedProgressDidChange"] = "bufferedProgressDidChange";
    Events["capabilitiesChanged"] = "capabilitiesChanged";
    Events["configured"] = "configured";
    Events["drmUnsupported"] = "drmUnsupported";
    Events["eligibleForSubscribeView"] = "eligibleForSubscribeView";
    Events["forcedTextTrackChanged"] = "forcedTextTrackChanged";
    Events["loaded"] = "loaded";
    Events["mediaCanPlay"] = "mediaCanPlay";
    Events["mediaElementCreated"] = "mediaElementCreated";
    Events["mediaItemStateDidChange"] = "mediaItemStateDidChange";
    Events["mediaItemStateWillChange"] = "mediaItemStateWillChange";
    Events["mediaPlaybackError"] = "mediaPlaybackError";
    Events["mediaSkipAvailable"] = "mediaSkipAvailable";
    Events["mediaUpNext"] = "mediaUpNext";
    Events["metadataDidChange"] = "metadataDidChange";
    Events["nowPlayingItemWillChange"] = "nowPlayingItemWillChange";
    Events["nowPlayingItemDidChange"] = "nowPlayingItemDidChange";
    Events["playbackBitrateDidChange"] = "playbackBitrateDidChange";
    Events["playbackDurationDidChange"] = "playbackDurationDidChange";
    Events["playbackProgressDidChange"] = "playbackProgressDidChange";
    Events["playbackRateDidChange"] = "playbackRateDidChange";
    Events["playbackStateWillChange"] = "playbackStateWillChange";
    Events["playbackStateDidChange"] = "playbackStateDidChange";
    Events["playbackTargetAvailableDidChange"] = "playbackTargetAvailableDidChange";
    Events["playbackTimeDidChange"] = "playbackTimeDidChange";
    Events["playbackVolumeDidChange"] = "playbackVolumeDidChange";
    Events["playerTypeDidChange"] = "playerTypeDidChange";
    Events["primaryPlayerDidChange"] = "primaryPlayerDidChange";
    Events["queueIsReady"] = "queueIsReady";
    Events["queueItemsDidChange"] = "queueItemsDidChange";
    Events["queuePositionDidChange"] = "queuePositionDidChange";
    Events["shuffleModeDidChange"] = "shuffleModeDidChange";
    Events["repeatModeDidChange"] = "repeatModeDidChange";
    Events["storefrontCountryCodeDidChange"] = "storefrontCountryCodeDidChange";
    Events["storefrontIdentifierDidChange"] = "storefrontIdentifierDidChange";
    Events["textTrackAdded"] = "textTrackAdded";
    Events["textTrackChanged"] = "textTrackChanged";
    Events["textTrackRemoved"] = "textTrackRemoved";
    Events["timedMetadataDidChange"] = "timedMetadataDidChange";
})(Events || (Events = {}));
var ResourceType;
(function (ResourceType) {
    ResourceType["activities"] = "activities";
    ResourceType["albums"] = "albums";
    ResourceType["apple-curators"] = "apple-curators";
    ResourceType["artists"] = "artists";
    ResourceType["charts"] = "charts";
    ResourceType["curators"] = "curators";
    ResourceType["genres"] = "genres";
    ResourceType["music-videos"] = "music-videos";
    ResourceType["playlists"] = "playlists";
    ResourceType["search"] = "search";
    ResourceType["search/hints"] = "search/hints";
    ResourceType["songs"] = "songs";
    ResourceType["stations"] = "stations";
    //personalized content
    ResourceType["library"] = "library";
    ResourceType["recommendations"] = "recommendations";
    ResourceType["recent/played"] = "recent/played";
    ResourceType["history/heavy-rotation"] = "history/heavy-rotation";
    //storefronts
    ResourceType["storefronts"] = "storefronts";
})(ResourceType || (ResourceType = {}));
var API_PATH;
(function (API_PATH) {
    API_PATH["BASE"] = "/v1/";
    API_PATH["CATALOG"] = "/v1/catalog/";
    API_PATH["LIBRARY"] = "/v1/me/library/";
    API_PATH["STOREFRONT"] = "/v1/storefronts/";
})(API_PATH || (API_PATH = {}));
const initialState = {
    initialized: false,
    volume: 0.25,
    storefront: "",
    queue: [],
    history: [],
    queuePosition: 0,
    shuffleMode: MusicKit.PlayerShuffleMode.off,
    repeatMode: MusicKit.PlayerRepeatMode.none,
    currentTrack: null,
    currentTrackArtworkURL: "",
    currentPlaybackTime: 0,
    currentPlaybackDuration: 0,
    isPlaying: false,
    playbackState: 0,
    userPlaylists: [],
};
class MusickitStore extends Store {
    constructor() {
        super(initialState);
        this.subs = new Subscription();
    }
    ngOnDestroy() {
        this.subs.unsubscribe();
    }
    addEventListener(listener) {
        this.instance.addEventListener(listener.event, listener.function);
    }
    reconfigure(devToken, appName, buildVer) {
        return __awaiter(this, void 0, void 0, function* () {
            this.instance = yield MusicKit.configure({
                developerToken: devToken,
                app: {
                    name: appName,
                    build: buildVer,
                },
            });
        });
    }
    initMusicKit(devToken, appName, buildVer) {
        return __awaiter(this, void 0, void 0, function* () {
            this.instance = yield MusicKit.configure({
                developerToken: devToken,
                app: {
                    name: appName,
                    build: buildVer,
                },
            });
            // registering events
            this.instance.addEventListener(Events.playbackVolumeDidChange, (event) => this.setState((state) => ({ volume: this.instance.volume })));
            this.instance.addEventListener(Events.nowPlayingItemDidChange, (event) => {
                if (this.instance.nowPlayingItem) {
                    this.state.history.push(this.instance.nowPlayingItem);
                    return this.setState((state) => {
                        var _a, _b, _c;
                        return (Object.assign(Object.assign({}, state), {
                            currentTrackArtworkURL: MusicKit.formatArtworkURL((_b = (_a = this.instance.nowPlayingItem) === null || _a === void 0 ? void 0 : _a.artwork) !== null && _b !== void 0 ? _b : (_c = state.currentTrack) === null || _c === void 0 ? void 0 : _c.artwork),
                            currentPlaybackTime: 0,
                            currentPlaybackDuration: 0,
                            currentTrack: this.instance.nowPlayingItem,
                        }));
                    });
                }
            });
            this.instance.addEventListener(Events.playbackTimeDidChange, (event) => this.setState((state) => ({
                currentPlaybackTime: this.instance.currentPlaybackTime,
            })));
            this.instance.addEventListener(Events.playbackDurationDidChange, (event) => this.setState((state) => ({
                currentPlaybackDuration: this.instance.currentPlaybackDuration,
            })));
            this.instance.addEventListener(Events.playbackStateDidChange, (event) => {
                this.setState((state) => (Object.assign(Object.assign({}, state), {
                    isPlaying: this.instance.isPlaying,
                    playbackState: this.instance.playbackState,
                })));
            });
            this.instance.volume = this.state.volume;
            this.instance.autoplayEnabled = true;
            this.instance._autoplayEnabled = true;
            this.instance._bag.features["enhanced-hls"] = true;
            this.instance.bitrate = 2048;
            this.instance.api.music.session._config.url =
                "https://amp-api.music.apple.com";
            var playlists = yield this.getUserPlaylists().then((res) => res);
            this.setState((state) => ({ userPlaylists: playlists }));
        });
    }
    startPlayingSong(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield MusicKit.getInstance()
                .setQueue({ song: id })
                .finally(() => MusicKit.getInstance().play())
                .catch((error) => console.error(error));
        });
    }
    startPlayingMedia(id, type, shuffle) {
        return __awaiter(this, void 0, void 0, function* () {
            const queueObject = type.includes("albums")
                ? { album: id }
                : { playlist: id };
            if (shuffle) {
                this.setState(() => ({
                    shuffleMode: MusicKit.PlayerShuffleMode.songs,
                }));
            }
            else {
                this.setState(() => ({
                    shuffleMode: MusicKit.PlayerShuffleMode.off,
                }));
            }
            MusicKit.getInstance().shuffleMode = this.state.shuffleMode;
            yield MusicKit.getInstance()
                .setQueue(queueObject)
                .finally(() => MusicKit.getInstance().changeToMediaAtIndex(0))
                .catch((error) => console.error(error));
        });
    }
    playStation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield MusicKit.getInstance()
                .setQueue({ station: id })
                .finally(() => MusicKit.getInstance().changeToMediaAtIndex(0))
                .catch((error) => console.error(error));
        });
    }
    authorizeUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MusicKit.getInstance().authorize();
        });
    }
    checkUserAuthorization() {
        return __awaiter(this, void 0, void 0, function* () {
            return MusicKit.getInstance().isAuthorized;
        });
    }
    getRecentlyPlayed() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield MusicKit.getInstance().api.music(API_PATH.BASE +
                "me/" +
                ResourceType["recent/played"] +
                "?include[albums]=artists")).data.data;
        });
    }
    getUserRecommendations() {
        return __awaiter(this, void 0, void 0, function* () {
            let tmpArray = [];
            let result = (yield MusicKit.getInstance().api.music(API_PATH.BASE +
                "me/" +
                ResourceType.recommendations +
                "?include[albums]=artists")).data.data;
            console.log(result);
            return result;
        });
    }
    getPlaylistInfo(playlistId, isLibraryPlaylist) {
        return __awaiter(this, void 0, void 0, function* () {
            var playlist = yield MusicKit.getInstance().api.music((isLibraryPlaylist ? API_PATH.LIBRARY : API_PATH.CATALOG + "us/") +
                ResourceType.playlists +
                "/" +
                playlistId, { include: ["tracks", "catalog"] });
            return playlist.data.data[0];
        });
    }
    getAlbumInfo(albumId, isLibraryAlbum) {
        return __awaiter(this, void 0, void 0, function* () {
            var album = yield MusicKit.getInstance().api.music((isLibraryAlbum ? API_PATH.LIBRARY : API_PATH.CATALOG + "us/") +
                ResourceType.albums +
                "/" +
                albumId, { include: ["tracks", "catalog", "artists"] });
            return album.data.data[0];
        });
    }
    getUserPlaylists() {
        return __awaiter(this, void 0, void 0, function* () {
            var playlists = yield MusicKit.getInstance().api.music(API_PATH.LIBRARY + ResourceType.playlists);
            return playlists.data.data;
        });
    }
    getSong(songId) {
        return __awaiter(this, void 0, void 0, function* () {
            var song = yield MusicKit.getInstance().api.music(API_PATH.CATALOG + "{{storefrontId}}/" + ResourceType.songs + "/" + songId);
            return song.data.data[0];
        });
    }
    skipToPreviousItem() {
        return __awaiter(this, void 0, void 0, function* () {
            this.instance.skipToPreviousItem();
        });
    }
    skipToNextItem() {
        return __awaiter(this, void 0, void 0, function* () {
            this.instance.skipToNextItem();
        });
    }
    putPlaylist(playlistId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield MusicKit.getInstance().api.music(API_PATH.LIBRARY +
                ResourceType.playlists +
                "/" +
                playlistId +
                "/" +
                "tracks", {}, {
                fetchOptions: {
                    method: "PUT",
                    body: JSON.stringify({
                        data: data,
                    }),
                },
            });
        });
    }
    togglePlayback() {
        if (this.instance.isPlaying)
            this.instance.pause();
        else
            this.instance.play();
    }
    seekToTime(time) {
        return __awaiter(this, void 0, void 0, function* () {
            if (time > this.instance.currentPlaybackTime)
                this.instance._playbackControllerInternal._playerOptions.services.mediaItemPlayback._currentPlayer.audio.currentTime =
                    time;
            else
                this.instance._mediaItemPlayback._currentPlayer.seekToTime(time);
        });
    }
    // async waitSeekReady(time: number) {
    //     const progress = setInterval(async () => {
    //         if ((this.instance as any)._playbackControllerInternal._playerOptions.services.mediaItemPlayback._currentPlayer.currentBufferedProgress >= 20) {
    //             (this.instance as any)._playbackControllerInternal._playerOptions.services.mediaItemPlayback._currentPlayer.audio.currentTime = time;
    //             clearInterval(progress);
    //         }
    //     }, 200);
    // }
    setVolume(volume) {
        this.instance.volume = volume;
    }
    replaceValue(item) {
        for (var i in item) {
            if (i == "prop") {
                item["value"] = "";
                break;
            }
        }
    }
    toggleShuffleMode() {
        if (this.state.shuffleMode == MusicKit.PlayerShuffleMode.off) {
            this.instance.shuffleMode = MusicKit.PlayerShuffleMode.songs;
            this.setState((state) => ({
                shuffleMode: MusicKit.PlayerShuffleMode.songs,
            }));
        }
        else {
            this.instance.shuffleMode = MusicKit.PlayerShuffleMode.off;
            this.setState((state) => ({
                shuffleMode: MusicKit.PlayerShuffleMode.off,
            }));
        }
    }
    toggleRepeatMode() {
        switch (this.state.repeatMode.valueOf()) {
            case MusicKit.PlayerRepeatMode.none:
                this.instance.repeatMode = MusicKit.PlayerRepeatMode.all;
                this.setState((state) => ({
                    repeatMode: MusicKit.PlayerRepeatMode.all,
                }));
                break;
            case MusicKit.PlayerRepeatMode.one:
                this.instance.repeatMode = MusicKit.PlayerRepeatMode.none;
                this.setState((state) => ({
                    repeatMode: MusicKit.PlayerRepeatMode.none,
                }));
                break;
            case MusicKit.PlayerRepeatMode.all:
                this.instance.repeatMode = MusicKit.PlayerRepeatMode.one;
                this.setState((state) => ({
                    repeatMode: MusicKit.PlayerRepeatMode.one,
                }));
                break;
        }
    }
}
MusickitStore.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: MusickitStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
MusickitStore.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: MusickitStore, providedIn: "root" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: MusickitStore, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: "root",
                }]
        }], ctorParameters: function () { return []; } });

/*
 * Public API Surface of ngx-apple-music
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MusickitStore };
//# sourceMappingURL=ngx-apple-music.mjs.map
