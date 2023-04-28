import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { Store } from "./store";
import * as i0 from "@angular/core";
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
export class MusickitStore extends Store {
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
    async reconfigure(devToken, appName, buildVer) {
        this.instance = await MusicKit.configure({
            developerToken: devToken,
            app: {
                name: appName,
                build: buildVer,
            },
        });
    }
    async initMusicKit(devToken, appName, buildVer) {
        this.instance = await MusicKit.configure({
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
                return this.setState((state) => ({
                    ...state,
                    ...{
                        currentTrackArtworkURL: MusicKit.formatArtworkURL(this.instance.nowPlayingItem?.artwork ??
                            state.currentTrack?.artwork),
                        currentPlaybackTime: 0,
                        currentPlaybackDuration: 0,
                        currentTrack: this.instance.nowPlayingItem,
                    },
                }));
            }
        });
        this.instance.addEventListener(Events.playbackTimeDidChange, (event) => this.setState((state) => ({
            currentPlaybackTime: this.instance.currentPlaybackTime,
        })));
        this.instance.addEventListener(Events.playbackDurationDidChange, (event) => this.setState((state) => ({
            currentPlaybackDuration: this.instance.currentPlaybackDuration,
        })));
        this.instance.addEventListener(Events.playbackStateDidChange, (event) => {
            this.setState((state) => ({
                ...state,
                ...{
                    isPlaying: this.instance.isPlaying,
                    playbackState: this.instance.playbackState,
                },
            }));
        });
        this.instance.volume = this.state.volume;
        this.instance.autoplayEnabled = true;
        this.instance._autoplayEnabled = true;
        this.instance._bag.features["enhanced-hls"] = true;
        this.instance.bitrate = 2048;
        this.instance.api.music.session._config.url =
            "https://amp-api.music.apple.com";
        var playlists = await this.getUserPlaylists().then((res) => res);
        this.setState((state) => ({ userPlaylists: playlists }));
    }
    async startPlayingSong(id) {
        await MusicKit.getInstance()
            .setQueue({ song: id })
            .finally(() => MusicKit.getInstance().play())
            .catch((error) => console.error(error));
    }
    async startPlayingMedia(id, type, shuffle) {
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
        await MusicKit.getInstance()
            .setQueue(queueObject)
            .finally(() => MusicKit.getInstance().changeToMediaAtIndex(0))
            .catch((error) => console.error(error));
    }
    async playStation(id) {
        await MusicKit.getInstance()
            .setQueue({ station: id })
            .finally(() => MusicKit.getInstance().changeToMediaAtIndex(0))
            .catch((error) => console.error(error));
    }
    async authorizeUser() {
        return await MusicKit.getInstance().authorize();
    }
    async checkUserAuthorization() {
        return MusicKit.getInstance().isAuthorized;
    }
    async getRecentlyPlayed() {
        return (await MusicKit.getInstance().api.music(API_PATH.BASE +
            "me/" +
            ResourceType["recent/played"] +
            "?include[albums]=artists")).data.data;
    }
    async getUserRecommendations() {
        let tmpArray = [];
        let result = (await MusicKit.getInstance().api.music(API_PATH.BASE +
            "me/" +
            ResourceType.recommendations +
            "?include[albums]=artists")).data.data;
        console.log(result);
        return result;
    }
    async getPlaylistInfo(playlistId, isLibraryPlaylist) {
        var playlist = await MusicKit.getInstance().api.music((isLibraryPlaylist ? API_PATH.LIBRARY : API_PATH.CATALOG + "us/") +
            ResourceType.playlists +
            "/" +
            playlistId, { include: ["tracks", "catalog"] });
        return playlist.data.data[0];
    }
    async getAlbumInfo(albumId, isLibraryAlbum) {
        var album = await MusicKit.getInstance().api.music((isLibraryAlbum ? API_PATH.LIBRARY : API_PATH.CATALOG + "us/") +
            ResourceType.albums +
            "/" +
            albumId, { include: ["tracks", "catalog", "artists"] });
        return album.data.data[0];
    }
    async getUserPlaylists() {
        var playlists = await MusicKit.getInstance().api.music(API_PATH.LIBRARY + ResourceType.playlists);
        return playlists.data.data;
    }
    async getSong(songId) {
        var song = await MusicKit.getInstance().api.music(API_PATH.CATALOG + "{{storefrontId}}/" + ResourceType.songs + "/" + songId);
        return song.data.data[0];
    }
    async skipToPreviousItem() {
        this.instance.skipToPreviousItem();
    }
    async skipToNextItem() {
        this.instance.skipToNextItem();
    }
    async putPlaylist(playlistId, data) {
        await MusicKit.getInstance().api.music(API_PATH.LIBRARY +
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
    }
    togglePlayback() {
        if (this.instance.isPlaying)
            this.instance.pause();
        else
            this.instance.play();
    }
    async seekToTime(time) {
        if (time > this.instance.currentPlaybackTime)
            this.instance._playbackControllerInternal._playerOptions.services.mediaItemPlayback._currentPlayer.audio.currentTime =
                time;
        else
            this.instance._mediaItemPlayback._currentPlayer.seekToTime(time);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVzaWNraXQtc3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtYXBwbGUtbXVzaWMvc3JjL2xpYi9zdG9yZS9tdXNpY2tpdC1zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFNBQVMsQ0FBQzs7QUFFaEMsSUFBSyxNQTZDSjtBQTdDRCxXQUFLLE1BQU07SUFDVCw2Q0FBbUMsQ0FBQTtJQUNuQyxpREFBdUMsQ0FBQTtJQUN2QyxpREFBdUMsQ0FBQTtJQUN2Qyx1RUFBNkQsQ0FBQTtJQUM3RCx5RUFBK0QsQ0FBQTtJQUMvRCxpRUFBdUQsQ0FBQTtJQUN2RCxxREFBMkMsQ0FBQTtJQUMzQyxtQ0FBeUIsQ0FBQTtJQUN6QiwyQ0FBaUMsQ0FBQTtJQUNqQywrREFBcUQsQ0FBQTtJQUNyRCwyREFBaUQsQ0FBQTtJQUNqRCwyQkFBaUIsQ0FBQTtJQUNqQix1Q0FBNkIsQ0FBQTtJQUM3QixxREFBMkMsQ0FBQTtJQUMzQyw2REFBbUQsQ0FBQTtJQUNuRCwrREFBcUQsQ0FBQTtJQUNyRCxtREFBeUMsQ0FBQTtJQUN6QyxtREFBeUMsQ0FBQTtJQUN6QyxxQ0FBMkIsQ0FBQTtJQUMzQixpREFBdUMsQ0FBQTtJQUN2QywrREFBcUQsQ0FBQTtJQUNyRCw2REFBbUQsQ0FBQTtJQUNuRCwrREFBcUQsQ0FBQTtJQUNyRCxpRUFBdUQsQ0FBQTtJQUN2RCxpRUFBdUQsQ0FBQTtJQUN2RCx5REFBK0MsQ0FBQTtJQUMvQyw2REFBbUQsQ0FBQTtJQUNuRCwyREFBaUQsQ0FBQTtJQUNqRCwrRUFBcUUsQ0FBQTtJQUNyRSx5REFBK0MsQ0FBQTtJQUMvQyw2REFBbUQsQ0FBQTtJQUNuRCxxREFBMkMsQ0FBQTtJQUMz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QUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ3hCLFVBQVUsRUFBRSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRztpQkFDMUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0osTUFBTTtZQUNSLEtBQUssUUFBUSxDQUFDLGdCQUFnQixDQUFDLEdBQUc7Z0JBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7Z0JBQzFELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ3hCLFVBQVUsRUFBRSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSTtpQkFDM0MsQ0FBQyxDQUFDLENBQUM7Z0JBQ0osTUFBTTtZQUNSLEtBQUssUUFBUSxDQUFDLGdCQUFnQixDQUFDLEdBQUc7Z0JBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUM7Z0JBQ3pELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ3hCLFVBQVUsRUFBRSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRztpQkFDMUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0osTUFBTTtTQUNUO0lBQ0gsQ0FBQzs7MEdBcFVVLGFBQWE7OEdBQWIsYUFBYSxjQUZaLE1BQU07MkZBRVAsYUFBYTtrQkFIekIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPbkRlc3Ryb3kgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tIFwicnhqc1wiO1xyXG5pbXBvcnQgeyBTdG9yZSB9IGZyb20gXCIuL3N0b3JlXCI7XHJcblxyXG5lbnVtIEV2ZW50cyB7XHJcbiAgYXVkaW9UcmFja0FkZGVkID0gXCJhdWRpb1RyYWNrQWRkZWRcIixcclxuICBhdWRpb1RyYWNrQ2hhbmdlZCA9IFwiYXVkaW9UcmFja0NoYW5nZWRcIixcclxuICBhdWRpb1RyYWNrUmVtb3ZlZCA9IFwiYXVkaW9UcmFja1JlbW92ZWRcIixcclxuICBhdXRob3JpemF0aW9uU3RhdHVzRGlkQ2hhbmdlID0gXCJhdXRob3JpemF0aW9uU3RhdHVzRGlkQ2hhbmdlXCIsXHJcbiAgYXV0aG9yaXphdGlvblN0YXR1c1dpbGxDaGFuZ2UgPSBcImF1dGhvcml6YXRpb25TdGF0dXNXaWxsQ2hhbmdlXCIsXHJcbiAgYnVmZmVyZWRQcm9ncmVzc0RpZENoYW5nZSA9IFwiYnVmZmVyZWRQcm9ncmVzc0RpZENoYW5nZVwiLFxyXG4gIGNhcGFiaWxpdGllc0NoYW5nZWQgPSBcImNhcGFiaWxpdGllc0NoYW5nZWRcIixcclxuICBjb25maWd1cmVkID0gXCJjb25maWd1cmVkXCIsXHJcbiAgZHJtVW5zdXBwb3J0ZWQgPSBcImRybVVuc3VwcG9ydGVkXCIsXHJcbiAgZWxpZ2libGVGb3JTdWJzY3JpYmVWaWV3ID0gXCJlbGlnaWJsZUZvclN1YnNjcmliZVZpZXdcIixcclxuICBmb3JjZWRUZXh0VHJhY2tDaGFuZ2VkID0gXCJmb3JjZWRUZXh0VHJhY2tDaGFuZ2VkXCIsXHJcbiAgbG9hZGVkID0gXCJsb2FkZWRcIixcclxuICBtZWRpYUNhblBsYXkgPSBcIm1lZGlhQ2FuUGxheVwiLFxyXG4gIG1lZGlhRWxlbWVudENyZWF0ZWQgPSBcIm1lZGlhRWxlbWVudENyZWF0ZWRcIixcclxuICBtZWRpYUl0ZW1TdGF0ZURpZENoYW5nZSA9IFwibWVkaWFJdGVtU3RhdGVEaWRDaGFuZ2VcIixcclxuICBtZWRpYUl0ZW1TdGF0ZVdpbGxDaGFuZ2UgPSBcIm1lZGlhSXRlbVN0YXRlV2lsbENoYW5nZVwiLFxyXG4gIG1lZGlhUGxheWJhY2tFcnJvciA9IFwibWVkaWFQbGF5YmFja0Vycm9yXCIsXHJcbiAgbWVkaWFTa2lwQXZhaWxhYmxlID0gXCJtZWRpYVNraXBBdmFpbGFibGVcIixcclxuICBtZWRpYVVwTmV4dCA9IFwibWVkaWFVcE5leHRcIixcclxuICBtZXRhZGF0YURpZENoYW5nZSA9IFwibWV0YWRhdGFEaWRDaGFuZ2VcIixcclxuICBub3dQbGF5aW5nSXRlbVdpbGxDaGFuZ2UgPSBcIm5vd1BsYXlpbmdJdGVtV2lsbENoYW5nZVwiLFxyXG4gIG5vd1BsYXlpbmdJdGVtRGlkQ2hhbmdlID0gXCJub3dQbGF5aW5nSXRlbURpZENoYW5nZVwiLFxyXG4gIHBsYXliYWNrQml0cmF0ZURpZENoYW5nZSA9IFwicGxheWJhY2tCaXRyYXRlRGlkQ2hhbmdlXCIsXHJcbiAgcGxheWJhY2tEdXJhdGlvbkRpZENoYW5nZSA9IFwicGxheWJhY2tEdXJhdGlvbkRpZENoYW5nZVwiLFxyXG4gIHBsYXliYWNrUHJvZ3Jlc3NEaWRDaGFuZ2UgPSBcInBsYXliYWNrUHJvZ3Jlc3NEaWRDaGFuZ2VcIixcclxuICBwbGF5YmFja1JhdGVEaWRDaGFuZ2UgPSBcInBsYXliYWNrUmF0ZURpZENoYW5nZVwiLFxyXG4gIHBsYXliYWNrU3RhdGVXaWxsQ2hhbmdlID0gXCJwbGF5YmFja1N0YXRlV2lsbENoYW5nZVwiLFxyXG4gIHBsYXliYWNrU3RhdGVEaWRDaGFuZ2UgPSBcInBsYXliYWNrU3RhdGVEaWRDaGFuZ2VcIixcclxuICBwbGF5YmFja1RhcmdldEF2YWlsYWJsZURpZENoYW5nZSA9IFwicGxheWJhY2tUYXJnZXRBdmFpbGFibGVEaWRDaGFuZ2VcIixcclxuICBwbGF5YmFja1RpbWVEaWRDaGFuZ2UgPSBcInBsYXliYWNrVGltZURpZENoYW5nZVwiLFxyXG4gIHBsYXliYWNrVm9sdW1lRGlkQ2hhbmdlID0gXCJwbGF5YmFja1ZvbHVtZURpZENoYW5nZVwiLFxyXG4gIHBsYXllclR5cGVEaWRDaGFuZ2UgPSBcInBsYXllclR5cGVEaWRDaGFuZ2VcIixcclxuICBwcmltYXJ5UGxheWVyRGlkQ2hhbmdlID0gXCJwcmltYXJ5UGxheWVyRGlkQ2hhbmdlXCIsXHJcbiAgcXVldWVJc1JlYWR5ID0gXCJxdWV1ZUlzUmVhZHlcIixcclxuICBxdWV1ZUl0ZW1zRGlkQ2hhbmdlID0gXCJxdWV1ZUl0ZW1zRGlkQ2hhbmdlXCIsXHJcbiAgcXVldWVQb3NpdGlvbkRpZENoYW5nZSA9IFwicXVldWVQb3NpdGlvbkRpZENoYW5nZVwiLFxyXG4gIHNodWZmbGVNb2RlRGlkQ2hhbmdlID0gXCJzaHVmZmxlTW9kZURpZENoYW5nZVwiLFxyXG4gIHJlcGVhdE1vZGVEaWRDaGFuZ2UgPSBcInJlcGVhdE1vZGVEaWRDaGFuZ2VcIixcclxuICBzdG9yZWZyb250Q291bnRyeUNvZGVEaWRDaGFuZ2UgPSBcInN0b3JlZnJvbnRDb3VudHJ5Q29kZURpZENoYW5nZVwiLFxyXG4gIHN0b3JlZnJvbnRJZGVudGlmaWVyRGlkQ2hhbmdlID0gXCJzdG9yZWZyb250SWRlbnRpZmllckRpZENoYW5nZVwiLFxyXG4gIHRleHRUcmFja0FkZGVkID0gXCJ0ZXh0VHJhY2tBZGRlZFwiLFxyXG4gIHRleHRUcmFja0NoYW5nZWQgPSBcInRleHRUcmFja0NoYW5nZWRcIixcclxuICB0ZXh0VHJhY2tSZW1vdmVkID0gXCJ0ZXh0VHJhY2tSZW1vdmVkXCIsXHJcbiAgdGltZWRNZXRhZGF0YURpZENoYW5nZSA9IFwidGltZWRNZXRhZGF0YURpZENoYW5nZVwiLFxyXG59XHJcblxyXG5lbnVtIFJlc291cmNlVHlwZSB7XHJcbiAgYWN0aXZpdGllcyA9IFwiYWN0aXZpdGllc1wiLFxyXG4gIGFsYnVtcyA9IFwiYWxidW1zXCIsXHJcbiAgXCJhcHBsZS1jdXJhdG9yc1wiID0gXCJhcHBsZS1jdXJhdG9yc1wiLFxyXG4gIGFydGlzdHMgPSBcImFydGlzdHNcIixcclxuICBjaGFydHMgPSBcImNoYXJ0c1wiLFxyXG4gIGN1cmF0b3JzID0gXCJjdXJhdG9yc1wiLFxyXG4gIGdlbnJlcyA9IFwiZ2VucmVzXCIsXHJcbiAgXCJtdXNpYy12aWRlb3NcIiA9IFwibXVzaWMtdmlkZW9zXCIsXHJcbiAgcGxheWxpc3RzID0gXCJwbGF5bGlzdHNcIixcclxuICBzZWFyY2ggPSBcInNlYXJjaFwiLFxyXG4gIFwic2VhcmNoL2hpbnRzXCIgPSBcInNlYXJjaC9oaW50c1wiLFxyXG4gIHNvbmdzID0gXCJzb25nc1wiLFxyXG4gIHN0YXRpb25zID0gXCJzdGF0aW9uc1wiLFxyXG5cclxuICAvL3BlcnNvbmFsaXplZCBjb250ZW50XHJcbiAgbGlicmFyeSA9IFwibGlicmFyeVwiLFxyXG4gIHJlY29tbWVuZGF0aW9ucyA9IFwicmVjb21tZW5kYXRpb25zXCIsXHJcbiAgXCJyZWNlbnQvcGxheWVkXCIgPSBcInJlY2VudC9wbGF5ZWRcIixcclxuICBcImhpc3RvcnkvaGVhdnktcm90YXRpb25cIiA9IFwiaGlzdG9yeS9oZWF2eS1yb3RhdGlvblwiLFxyXG5cclxuICAvL3N0b3JlZnJvbnRzXHJcbiAgc3RvcmVmcm9udHMgPSBcInN0b3JlZnJvbnRzXCIsXHJcbn1cclxuXHJcbmVudW0gQVBJX1BBVEgge1xyXG4gIEJBU0UgPSBcIi92MS9cIixcclxuICBDQVRBTE9HID0gYC92MS9jYXRhbG9nL2AsXHJcbiAgTElCUkFSWSA9IFwiL3YxL21lL2xpYnJhcnkvXCIsXHJcbiAgU1RPUkVGUk9OVCA9IFwiL3YxL3N0b3JlZnJvbnRzL1wiLFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE11c2lja2l0U3RhdGUge1xyXG4gIGluaXRpYWxpemVkOiBib29sZWFuO1xyXG4gIHZvbHVtZTogbnVtYmVyO1xyXG4gIHN0b3JlZnJvbnQ6IHN0cmluZztcclxuICBxdWV1ZTogQXJyYXk8TXVzaWNLaXQuTWVkaWFJdGVtPjtcclxuICBoaXN0b3J5OiBBcnJheTxNdXNpY0tpdC5NZWRpYUl0ZW0+O1xyXG4gIHF1ZXVlUG9zaXRpb246IG51bWJlcjtcclxuICBzaHVmZmxlTW9kZTogTXVzaWNLaXQuUGxheWVyU2h1ZmZsZU1vZGU7XHJcbiAgcmVwZWF0TW9kZTogTXVzaWNLaXQuUGxheWVyUmVwZWF0TW9kZTtcclxuICBjdXJyZW50VHJhY2s6IE11c2ljS2l0Lk1lZGlhSXRlbSB8IG51bGw7XHJcbiAgY3VycmVudFRyYWNrQXJ0d29ya1VSTDogc3RyaW5nO1xyXG4gIGN1cnJlbnRQbGF5YmFja1RpbWU6IG51bWJlcjtcclxuICBjdXJyZW50UGxheWJhY2tEdXJhdGlvbjogbnVtYmVyO1xyXG4gIGlzUGxheWluZzogYm9vbGVhbjtcclxuICBwbGF5YmFja1N0YXRlOiBNdXNpY0tpdC5QbGF5YmFja1N0YXRlcyB8IG51bGw7XHJcbiAgdXNlclBsYXlsaXN0czogTXVzaWNLaXQuTGlicmFyeVBsYXlsaXN0c1tdO1xyXG59XHJcblxyXG5jb25zdCBpbml0aWFsU3RhdGU6IE11c2lja2l0U3RhdGUgPSB7XHJcbiAgaW5pdGlhbGl6ZWQ6IGZhbHNlLFxyXG4gIHZvbHVtZTogMC4yNSxcclxuICBzdG9yZWZyb250OiBcIlwiLFxyXG4gIHF1ZXVlOiBbXSxcclxuICBoaXN0b3J5OiBbXSxcclxuICBxdWV1ZVBvc2l0aW9uOiAwLFxyXG4gIHNodWZmbGVNb2RlOiBNdXNpY0tpdC5QbGF5ZXJTaHVmZmxlTW9kZS5vZmYsXHJcbiAgcmVwZWF0TW9kZTogTXVzaWNLaXQuUGxheWVyUmVwZWF0TW9kZS5ub25lLFxyXG4gIGN1cnJlbnRUcmFjazogbnVsbCxcclxuICBjdXJyZW50VHJhY2tBcnR3b3JrVVJMOiBcIlwiLFxyXG4gIGN1cnJlbnRQbGF5YmFja1RpbWU6IDAsXHJcbiAgY3VycmVudFBsYXliYWNrRHVyYXRpb246IDAsXHJcbiAgaXNQbGF5aW5nOiBmYWxzZSxcclxuICBwbGF5YmFja1N0YXRlOiAwLFxyXG4gIHVzZXJQbGF5bGlzdHM6IFtdLFxyXG59O1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46IFwicm9vdFwiLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTXVzaWNraXRTdG9yZSBleHRlbmRzIFN0b3JlPE11c2lja2l0U3RhdGU+IGltcGxlbWVudHMgT25EZXN0cm95IHtcclxuICBzdWJzOiBTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XHJcbiAgaW5zdGFuY2UhOiBNdXNpY0tpdC5NdXNpY0tpdEluc3RhbmNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKGluaXRpYWxTdGF0ZSk7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHRoaXMuc3Vicy51bnN1YnNjcmliZSgpO1xyXG4gIH1cclxuXHJcbiAgYWRkRXZlbnRMaXN0ZW5lcihsaXN0ZW5lcjogYW55KSB7XHJcbiAgICB0aGlzLmluc3RhbmNlLmFkZEV2ZW50TGlzdGVuZXIobGlzdGVuZXIuZXZlbnQsIGxpc3RlbmVyLmZ1bmN0aW9uKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHJlY29uZmlndXJlKGRldlRva2VuOiBzdHJpbmcsIGFwcE5hbWU6IHN0cmluZywgYnVpbGRWZXI6IHN0cmluZykge1xyXG4gICAgdGhpcy5pbnN0YW5jZSA9IGF3YWl0IE11c2ljS2l0LmNvbmZpZ3VyZSh7XHJcbiAgICAgIGRldmVsb3BlclRva2VuOiBkZXZUb2tlbixcclxuICAgICAgYXBwOiB7XHJcbiAgICAgICAgbmFtZTogYXBwTmFtZSxcclxuICAgICAgICBidWlsZDogYnVpbGRWZXIsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGluaXRNdXNpY0tpdChkZXZUb2tlbjogc3RyaW5nLCBhcHBOYW1lOiBzdHJpbmcsIGJ1aWxkVmVyOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuaW5zdGFuY2UgPSBhd2FpdCBNdXNpY0tpdC5jb25maWd1cmUoe1xyXG4gICAgICBkZXZlbG9wZXJUb2tlbjogZGV2VG9rZW4sXHJcbiAgICAgIGFwcDoge1xyXG4gICAgICAgIG5hbWU6IGFwcE5hbWUsXHJcbiAgICAgICAgYnVpbGQ6IGJ1aWxkVmVyLFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gcmVnaXN0ZXJpbmcgZXZlbnRzXHJcblxyXG4gICAgdGhpcy5pbnN0YW5jZS5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICBFdmVudHMucGxheWJhY2tWb2x1bWVEaWRDaGFuZ2UsXHJcbiAgICAgIChldmVudDogYW55KSA9PlxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoKHN0YXRlKSA9PiAoeyB2b2x1bWU6IHRoaXMuaW5zdGFuY2Uudm9sdW1lIH0pKVxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLmluc3RhbmNlLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgIEV2ZW50cy5ub3dQbGF5aW5nSXRlbURpZENoYW5nZSxcclxuICAgICAgKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5pbnN0YW5jZS5ub3dQbGF5aW5nSXRlbSkge1xyXG4gICAgICAgICAgdGhpcy5zdGF0ZS5oaXN0b3J5LnB1c2godGhpcy5pbnN0YW5jZS5ub3dQbGF5aW5nSXRlbSk7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSgoc3RhdGUpID0+ICh7XHJcbiAgICAgICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgICAgICAuLi57XHJcbiAgICAgICAgICAgICAgY3VycmVudFRyYWNrQXJ0d29ya1VSTDogTXVzaWNLaXQuZm9ybWF0QXJ0d29ya1VSTChcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5zdGFuY2Uubm93UGxheWluZ0l0ZW0/LmFydHdvcmsgPz9cclxuICAgICAgICAgICAgICAgICAgc3RhdGUuY3VycmVudFRyYWNrPy5hcnR3b3JrIVxyXG4gICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgY3VycmVudFBsYXliYWNrVGltZTogMCxcclxuICAgICAgICAgICAgICBjdXJyZW50UGxheWJhY2tEdXJhdGlvbjogMCxcclxuICAgICAgICAgICAgICBjdXJyZW50VHJhY2s6IHRoaXMuaW5zdGFuY2Uubm93UGxheWluZ0l0ZW0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuaW5zdGFuY2UuYWRkRXZlbnRMaXN0ZW5lcihFdmVudHMucGxheWJhY2tUaW1lRGlkQ2hhbmdlLCAoZXZlbnQ6IGFueSkgPT5cclxuICAgICAgdGhpcy5zZXRTdGF0ZSgoc3RhdGUpID0+ICh7XHJcbiAgICAgICAgY3VycmVudFBsYXliYWNrVGltZTogdGhpcy5pbnN0YW5jZS5jdXJyZW50UGxheWJhY2tUaW1lLFxyXG4gICAgICB9KSlcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5pbnN0YW5jZS5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICBFdmVudHMucGxheWJhY2tEdXJhdGlvbkRpZENoYW5nZSxcclxuICAgICAgKGV2ZW50OiBhbnkpID0+XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSgoc3RhdGUpID0+ICh7XHJcbiAgICAgICAgICBjdXJyZW50UGxheWJhY2tEdXJhdGlvbjogdGhpcy5pbnN0YW5jZS5jdXJyZW50UGxheWJhY2tEdXJhdGlvbixcclxuICAgICAgICB9KSlcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5pbnN0YW5jZS5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICBFdmVudHMucGxheWJhY2tTdGF0ZURpZENoYW5nZSxcclxuICAgICAgKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKChzdGF0ZSkgPT4gKHtcclxuICAgICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICBpc1BsYXlpbmc6IHRoaXMuaW5zdGFuY2UuaXNQbGF5aW5nLFxyXG4gICAgICAgICAgICBwbGF5YmFja1N0YXRlOiB0aGlzLmluc3RhbmNlLnBsYXliYWNrU3RhdGUsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLmluc3RhbmNlLnZvbHVtZSA9IHRoaXMuc3RhdGUudm9sdW1lO1xyXG5cclxuICAgICh0aGlzLmluc3RhbmNlIGFzIGFueSkuYXV0b3BsYXlFbmFibGVkID0gdHJ1ZTtcclxuICAgICh0aGlzLmluc3RhbmNlIGFzIGFueSkuX2F1dG9wbGF5RW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgKHRoaXMuaW5zdGFuY2UgYXMgYW55KS5fYmFnLmZlYXR1cmVzW1wiZW5oYW5jZWQtaGxzXCJdID0gdHJ1ZTtcclxuICAgICh0aGlzLmluc3RhbmNlIGFzIGFueSkuYml0cmF0ZSA9IDIwNDg7XHJcbiAgICAodGhpcy5pbnN0YW5jZSBhcyBhbnkpLmFwaS5tdXNpYy5zZXNzaW9uLl9jb25maWcudXJsID1cclxuICAgICAgXCJodHRwczovL2FtcC1hcGkubXVzaWMuYXBwbGUuY29tXCI7XHJcblxyXG4gICAgdmFyIHBsYXlsaXN0cyA9IGF3YWl0IHRoaXMuZ2V0VXNlclBsYXlsaXN0cygpLnRoZW4oXHJcbiAgICAgIChyZXM6IE11c2ljS2l0LkxpYnJhcnlQbGF5bGlzdHNbXSkgPT4gcmVzXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuc2V0U3RhdGUoKHN0YXRlKSA9PiAoeyB1c2VyUGxheWxpc3RzOiBwbGF5bGlzdHMgfSkpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc3RhcnRQbGF5aW5nU29uZyhpZDogc3RyaW5nKSB7XHJcbiAgICBhd2FpdCBNdXNpY0tpdC5nZXRJbnN0YW5jZSgpXHJcbiAgICAgIC5zZXRRdWV1ZSh7IHNvbmc6IGlkIH0pXHJcbiAgICAgIC5maW5hbGx5KCgpID0+IE11c2ljS2l0LmdldEluc3RhbmNlKCkucGxheSgpKVxyXG4gICAgICAuY2F0Y2goKGVycm9yOiBhbnkpID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHN0YXJ0UGxheWluZ01lZGlhKGlkOiBzdHJpbmcsIHR5cGU6IHN0cmluZywgc2h1ZmZsZTogYm9vbGVhbikge1xyXG4gICAgY29uc3QgcXVldWVPYmplY3QgPSB0eXBlLmluY2x1ZGVzKFwiYWxidW1zXCIpXHJcbiAgICAgID8geyBhbGJ1bTogaWQgfVxyXG4gICAgICA6IHsgcGxheWxpc3Q6IGlkIH07XHJcblxyXG4gICAgaWYgKHNodWZmbGUpIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSgoKSA9PiAoe1xyXG4gICAgICAgIHNodWZmbGVNb2RlOiBNdXNpY0tpdC5QbGF5ZXJTaHVmZmxlTW9kZS5zb25ncyxcclxuICAgICAgfSkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSgoKSA9PiAoe1xyXG4gICAgICAgIHNodWZmbGVNb2RlOiBNdXNpY0tpdC5QbGF5ZXJTaHVmZmxlTW9kZS5vZmYsXHJcbiAgICAgIH0pKTtcclxuICAgIH1cclxuICAgIE11c2ljS2l0LmdldEluc3RhbmNlKCkuc2h1ZmZsZU1vZGUgPSB0aGlzLnN0YXRlLnNodWZmbGVNb2RlO1xyXG4gICAgYXdhaXQgTXVzaWNLaXQuZ2V0SW5zdGFuY2UoKVxyXG4gICAgICAuc2V0UXVldWUocXVldWVPYmplY3QpXHJcbiAgICAgIC5maW5hbGx5KCgpID0+IE11c2ljS2l0LmdldEluc3RhbmNlKCkuY2hhbmdlVG9NZWRpYUF0SW5kZXgoMCkpXHJcbiAgICAgIC5jYXRjaCgoZXJyb3I6IGFueSkgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgcGxheVN0YXRpb24oaWQ6IHN0cmluZykge1xyXG4gICAgYXdhaXQgTXVzaWNLaXQuZ2V0SW5zdGFuY2UoKVxyXG4gICAgICAuc2V0UXVldWUoeyBzdGF0aW9uOiBpZCB9KVxyXG4gICAgICAuZmluYWxseSgoKSA9PiBNdXNpY0tpdC5nZXRJbnN0YW5jZSgpLmNoYW5nZVRvTWVkaWFBdEluZGV4KDApKVxyXG4gICAgICAuY2F0Y2goKGVycm9yOiBhbnkpID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGF1dGhvcml6ZVVzZXIoKSB7XHJcbiAgICByZXR1cm4gYXdhaXQgTXVzaWNLaXQuZ2V0SW5zdGFuY2UoKS5hdXRob3JpemUoKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGNoZWNrVXNlckF1dGhvcml6YXRpb24oKSB7XHJcbiAgICByZXR1cm4gTXVzaWNLaXQuZ2V0SW5zdGFuY2UoKS5pc0F1dGhvcml6ZWQ7XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRSZWNlbnRseVBsYXllZCgpOiBQcm9taXNlPFxyXG4gICAgQXJyYXk8TXVzaWNLaXQuQWxidW1zIHwgTXVzaWNLaXQuU3RhdGlvbnM+XHJcbiAgPiB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICBhd2FpdCBNdXNpY0tpdC5nZXRJbnN0YW5jZSgpLmFwaS5tdXNpYyhcclxuICAgICAgICBBUElfUEFUSC5CQVNFICtcclxuICAgICAgICAgIFwibWUvXCIgK1xyXG4gICAgICAgICAgUmVzb3VyY2VUeXBlW1wicmVjZW50L3BsYXllZFwiXSArXHJcbiAgICAgICAgICBcIj9pbmNsdWRlW2FsYnVtc109YXJ0aXN0c1wiXHJcbiAgICAgIClcclxuICAgICkuZGF0YS5kYXRhIGFzIHVua25vd24gYXMgQXJyYXk8TXVzaWNLaXQuQWxidW1zIHwgTXVzaWNLaXQuU3RhdGlvbnM+O1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0VXNlclJlY29tbWVuZGF0aW9ucygpOiBQcm9taXNlPFxyXG4gICAgQXJyYXk8TXVzaWNLaXQuUGVyc29uYWxSZWNvbW1lbmRhdGlvbj5cclxuICA+IHtcclxuICAgIGxldCB0bXBBcnJheTogQXJyYXk8TXVzaWNLaXQuUmVzb3VyY2U+ID0gW107XHJcbiAgICBsZXQgcmVzdWx0ID0gKFxyXG4gICAgICBhd2FpdCBNdXNpY0tpdC5nZXRJbnN0YW5jZSgpLmFwaS5tdXNpYyhcclxuICAgICAgICBBUElfUEFUSC5CQVNFICtcclxuICAgICAgICAgIFwibWUvXCIgK1xyXG4gICAgICAgICAgUmVzb3VyY2VUeXBlLnJlY29tbWVuZGF0aW9ucyArXHJcbiAgICAgICAgICBcIj9pbmNsdWRlW2FsYnVtc109YXJ0aXN0c1wiXHJcbiAgICAgIClcclxuICAgICkuZGF0YS5kYXRhIGFzIHVua25vd24gYXMgQXJyYXk8TXVzaWNLaXQuUGVyc29uYWxSZWNvbW1lbmRhdGlvbj47XHJcbiAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIGFzeW5jIGdldFBsYXlsaXN0SW5mbyhcclxuICAgIHBsYXlsaXN0SWQ6IHN0cmluZyxcclxuICAgIGlzTGlicmFyeVBsYXlsaXN0OiBib29sZWFuXHJcbiAgKTogUHJvbWlzZTxNdXNpY0tpdC5MaWJyYXJ5UGxheWxpc3RzIHwgTXVzaWNLaXQuUGxheWxpc3RzPiB7XHJcbiAgICB2YXIgcGxheWxpc3QgPSBhd2FpdCBNdXNpY0tpdC5nZXRJbnN0YW5jZSgpLmFwaS5tdXNpYyhcclxuICAgICAgKGlzTGlicmFyeVBsYXlsaXN0ID8gQVBJX1BBVEguTElCUkFSWSA6IEFQSV9QQVRILkNBVEFMT0cgKyBcInVzL1wiKSArXHJcbiAgICAgICAgUmVzb3VyY2VUeXBlLnBsYXlsaXN0cyArXHJcbiAgICAgICAgXCIvXCIgK1xyXG4gICAgICAgIHBsYXlsaXN0SWQsXHJcbiAgICAgIHsgaW5jbHVkZTogW1widHJhY2tzXCIsIFwiY2F0YWxvZ1wiXSB9XHJcbiAgICApO1xyXG4gICAgcmV0dXJuIHBsYXlsaXN0LmRhdGEuZGF0YVswXSBhcyB1bmtub3duIGFzIE11c2ljS2l0LkxpYnJhcnlQbGF5bGlzdHM7XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRBbGJ1bUluZm8oXHJcbiAgICBhbGJ1bUlkOiBzdHJpbmcsXHJcbiAgICBpc0xpYnJhcnlBbGJ1bTogYm9vbGVhblxyXG4gICk6IFByb21pc2U8TXVzaWNLaXQuTGlicmFyeUFsYnVtcyB8IE11c2ljS2l0LkFsYnVtcz4ge1xyXG4gICAgdmFyIGFsYnVtID0gYXdhaXQgTXVzaWNLaXQuZ2V0SW5zdGFuY2UoKS5hcGkubXVzaWMoXHJcbiAgICAgIChpc0xpYnJhcnlBbGJ1bSA/IEFQSV9QQVRILkxJQlJBUlkgOiBBUElfUEFUSC5DQVRBTE9HICsgXCJ1cy9cIikgK1xyXG4gICAgICAgIFJlc291cmNlVHlwZS5hbGJ1bXMgK1xyXG4gICAgICAgIFwiL1wiICtcclxuICAgICAgICBhbGJ1bUlkLFxyXG4gICAgICB7IGluY2x1ZGU6IFtcInRyYWNrc1wiLCBcImNhdGFsb2dcIiwgXCJhcnRpc3RzXCJdIH1cclxuICAgICk7XHJcbiAgICByZXR1cm4gYWxidW0uZGF0YS5kYXRhWzBdIGFzIHVua25vd24gYXNcclxuICAgICAgfCBNdXNpY0tpdC5BbGJ1bXNcclxuICAgICAgfCBNdXNpY0tpdC5MaWJyYXJ5QWxidW1zO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0VXNlclBsYXlsaXN0cygpOiBQcm9taXNlPE11c2ljS2l0LkxpYnJhcnlQbGF5bGlzdHNbXT4ge1xyXG4gICAgdmFyIHBsYXlsaXN0cyA9IGF3YWl0IE11c2ljS2l0LmdldEluc3RhbmNlKCkuYXBpLm11c2ljKFxyXG4gICAgICBBUElfUEFUSC5MSUJSQVJZICsgUmVzb3VyY2VUeXBlLnBsYXlsaXN0c1xyXG4gICAgKTtcclxuICAgIHJldHVybiBwbGF5bGlzdHMuZGF0YS5kYXRhIGFzIHVua25vd24gYXMgTXVzaWNLaXQuTGlicmFyeVBsYXlsaXN0c1tdO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0U29uZyhzb25nSWQ6IHN0cmluZyk6IFByb21pc2U8TXVzaWNLaXQuU29uZ3M+IHtcclxuICAgIHZhciBzb25nID0gYXdhaXQgTXVzaWNLaXQuZ2V0SW5zdGFuY2UoKS5hcGkubXVzaWMoXHJcbiAgICAgIEFQSV9QQVRILkNBVEFMT0cgKyBcInt7c3RvcmVmcm9udElkfX0vXCIgKyBSZXNvdXJjZVR5cGUuc29uZ3MgKyBcIi9cIiArIHNvbmdJZFxyXG4gICAgKTtcclxuICAgIHJldHVybiBzb25nLmRhdGEuZGF0YVswXSBhcyB1bmtub3duIGFzIE11c2ljS2l0LlNvbmdzO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc2tpcFRvUHJldmlvdXNJdGVtKCkge1xyXG4gICAgdGhpcy5pbnN0YW5jZS5za2lwVG9QcmV2aW91c0l0ZW0oKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHNraXBUb05leHRJdGVtKCkge1xyXG4gICAgdGhpcy5pbnN0YW5jZS5za2lwVG9OZXh0SXRlbSgpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgcHV0UGxheWxpc3QocGxheWxpc3RJZDogc3RyaW5nLCBkYXRhOiBNdXNpY0tpdC5Tb25nc1tdKSB7XHJcbiAgICBhd2FpdCBNdXNpY0tpdC5nZXRJbnN0YW5jZSgpLmFwaS5tdXNpYyhcclxuICAgICAgQVBJX1BBVEguTElCUkFSWSArXHJcbiAgICAgICAgUmVzb3VyY2VUeXBlLnBsYXlsaXN0cyArXHJcbiAgICAgICAgXCIvXCIgK1xyXG4gICAgICAgIHBsYXlsaXN0SWQgK1xyXG4gICAgICAgIFwiL1wiICtcclxuICAgICAgICBcInRyYWNrc1wiLFxyXG4gICAgICB7fSxcclxuICAgICAge1xyXG4gICAgICAgIGZldGNoT3B0aW9uczoge1xyXG4gICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgfSxcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZVBsYXliYWNrKCkge1xyXG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuaXNQbGF5aW5nKSB0aGlzLmluc3RhbmNlLnBhdXNlKCk7XHJcbiAgICBlbHNlIHRoaXMuaW5zdGFuY2UucGxheSgpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc2Vla1RvVGltZSh0aW1lOiBudW1iZXIpIHtcclxuICAgIGlmICh0aW1lID4gdGhpcy5pbnN0YW5jZS5jdXJyZW50UGxheWJhY2tUaW1lKVxyXG4gICAgICAoXHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZSBhcyBhbnlcclxuICAgICAgKS5fcGxheWJhY2tDb250cm9sbGVySW50ZXJuYWwuX3BsYXllck9wdGlvbnMuc2VydmljZXMubWVkaWFJdGVtUGxheWJhY2suX2N1cnJlbnRQbGF5ZXIuYXVkaW8uY3VycmVudFRpbWUgPVxyXG4gICAgICAgIHRpbWU7XHJcbiAgICBlbHNlXHJcbiAgICAgICh0aGlzLmluc3RhbmNlIGFzIGFueSkuX21lZGlhSXRlbVBsYXliYWNrLl9jdXJyZW50UGxheWVyLnNlZWtUb1RpbWUodGltZSk7XHJcbiAgfVxyXG5cclxuICAvLyBhc3luYyB3YWl0U2Vla1JlYWR5KHRpbWU6IG51bWJlcikge1xyXG4gIC8vICAgICBjb25zdCBwcm9ncmVzcyA9IHNldEludGVydmFsKGFzeW5jICgpID0+IHtcclxuICAvLyAgICAgICAgIGlmICgodGhpcy5pbnN0YW5jZSBhcyBhbnkpLl9wbGF5YmFja0NvbnRyb2xsZXJJbnRlcm5hbC5fcGxheWVyT3B0aW9ucy5zZXJ2aWNlcy5tZWRpYUl0ZW1QbGF5YmFjay5fY3VycmVudFBsYXllci5jdXJyZW50QnVmZmVyZWRQcm9ncmVzcyA+PSAyMCkge1xyXG4gIC8vICAgICAgICAgICAgICh0aGlzLmluc3RhbmNlIGFzIGFueSkuX3BsYXliYWNrQ29udHJvbGxlckludGVybmFsLl9wbGF5ZXJPcHRpb25zLnNlcnZpY2VzLm1lZGlhSXRlbVBsYXliYWNrLl9jdXJyZW50UGxheWVyLmF1ZGlvLmN1cnJlbnRUaW1lID0gdGltZTtcclxuICAvLyAgICAgICAgICAgICBjbGVhckludGVydmFsKHByb2dyZXNzKTtcclxuICAvLyAgICAgICAgIH1cclxuICAvLyAgICAgfSwgMjAwKTtcclxuICAvLyB9XHJcblxyXG4gIHNldFZvbHVtZSh2b2x1bWU6IG51bWJlcikge1xyXG4gICAgdGhpcy5pbnN0YW5jZS52b2x1bWUgPSB2b2x1bWU7XHJcbiAgfVxyXG5cclxuICByZXBsYWNlVmFsdWUoaXRlbTogYW55KSB7XHJcbiAgICBmb3IgKHZhciBpIGluIGl0ZW0pIHtcclxuICAgICAgaWYgKGkgPT0gXCJwcm9wXCIpIHtcclxuICAgICAgICBpdGVtW1widmFsdWVcIl0gPSBcIlwiO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0b2dnbGVTaHVmZmxlTW9kZSgpIHtcclxuICAgIGlmICh0aGlzLnN0YXRlLnNodWZmbGVNb2RlID09IE11c2ljS2l0LlBsYXllclNodWZmbGVNb2RlLm9mZikge1xyXG4gICAgICB0aGlzLmluc3RhbmNlLnNodWZmbGVNb2RlID0gTXVzaWNLaXQuUGxheWVyU2h1ZmZsZU1vZGUuc29uZ3M7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoKHN0YXRlKSA9PiAoe1xyXG4gICAgICAgIHNodWZmbGVNb2RlOiBNdXNpY0tpdC5QbGF5ZXJTaHVmZmxlTW9kZS5zb25ncyxcclxuICAgICAgfSkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5pbnN0YW5jZS5zaHVmZmxlTW9kZSA9IE11c2ljS2l0LlBsYXllclNodWZmbGVNb2RlLm9mZjtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSgoc3RhdGUpID0+ICh7XHJcbiAgICAgICAgc2h1ZmZsZU1vZGU6IE11c2ljS2l0LlBsYXllclNodWZmbGVNb2RlLm9mZixcclxuICAgICAgfSkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdG9nZ2xlUmVwZWF0TW9kZSgpIHtcclxuICAgIHN3aXRjaCAodGhpcy5zdGF0ZS5yZXBlYXRNb2RlLnZhbHVlT2YoKSkge1xyXG4gICAgICBjYXNlIE11c2ljS2l0LlBsYXllclJlcGVhdE1vZGUubm9uZTpcclxuICAgICAgICB0aGlzLmluc3RhbmNlLnJlcGVhdE1vZGUgPSBNdXNpY0tpdC5QbGF5ZXJSZXBlYXRNb2RlLmFsbDtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKChzdGF0ZSkgPT4gKHtcclxuICAgICAgICAgIHJlcGVhdE1vZGU6IE11c2ljS2l0LlBsYXllclJlcGVhdE1vZGUuYWxsLFxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBNdXNpY0tpdC5QbGF5ZXJSZXBlYXRNb2RlLm9uZTpcclxuICAgICAgICB0aGlzLmluc3RhbmNlLnJlcGVhdE1vZGUgPSBNdXNpY0tpdC5QbGF5ZXJSZXBlYXRNb2RlLm5vbmU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSgoc3RhdGUpID0+ICh7XHJcbiAgICAgICAgICByZXBlYXRNb2RlOiBNdXNpY0tpdC5QbGF5ZXJSZXBlYXRNb2RlLm5vbmUsXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIE11c2ljS2l0LlBsYXllclJlcGVhdE1vZGUuYWxsOlxyXG4gICAgICAgIHRoaXMuaW5zdGFuY2UucmVwZWF0TW9kZSA9IE11c2ljS2l0LlBsYXllclJlcGVhdE1vZGUub25lO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoKHN0YXRlKSA9PiAoe1xyXG4gICAgICAgICAgcmVwZWF0TW9kZTogTXVzaWNLaXQuUGxheWVyUmVwZWF0TW9kZS5vbmUsXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=