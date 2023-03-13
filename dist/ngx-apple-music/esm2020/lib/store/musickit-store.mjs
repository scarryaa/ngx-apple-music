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
    storefront: '',
    queue: [],
    history: [],
    queuePosition: 0,
    shuffleMode: MusicKit.PlayerShuffleMode.off,
    repeatMode: MusicKit.PlayerRepeatMode.none,
    currentTrack: null,
    currentTrackArtworkURL: '',
    currentPlaybackTime: 0,
    currentPlaybackDuration: 0,
    isPlaying: false,
    playbackState: null,
    userPlaylists: []
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
    ;
    async initMusicKit(devToken, appName, buildVer) {
        this.instance = await MusicKit.configure({
            developerToken: devToken,
            app: {
                name: appName,
                build: buildVer,
            },
        });
        // registering events
        this.instance.addEventListener(Events.playbackVolumeDidChange, ((event) => this.setState((state) => ({ volume: this.instance.volume }))));
        this.instance.addEventListener(Events.nowPlayingItemDidChange, ((event) => {
            if (this.instance.nowPlayingItem) {
                this.state.history.push(this.instance.nowPlayingItem);
                return this.setState((state) => ({ ...state, ...{
                        currentTrackArtworkURL: MusicKit.formatArtworkURL(this.instance.nowPlayingItem?.artwork ?? state.currentTrack?.artwork),
                        currentPlaybackTime: 0, currentPlaybackDuration: 0, currentTrack: this.instance.nowPlayingItem
                    } }));
            }
        }));
        this.instance.addEventListener(Events.playbackTimeDidChange, ((event) => this.setState((state) => ({ currentPlaybackTime: this.instance.currentPlaybackTime }))));
        this.instance.addEventListener(Events.playbackDurationDidChange, ((event) => this.setState((state) => ({ currentPlaybackDuration: this.instance.currentPlaybackDuration }))));
        this.instance.addEventListener(Events.playbackStateDidChange, ((event) => {
            this.setState((state) => ({ ...state, ...{ isPlaying: this.instance.isPlaying, playbackState: this.instance.playbackState } }));
        }));
        this.instance.volume = this.state.volume;
        this.instance.autoplayEnabled = true;
        this.instance._autoplayEnabled = true;
        this.instance._bag.features['enhanced-hls'] = true;
        this.instance.bitrate = 2048;
        var playlists = await this.getUserPlaylists().then((res) => res);
        this.setState((state) => ({ userPlaylists: playlists }));
        this.getSong();
    }
    async startPlayingSong(id) {
        await this.instance.setQueue({ song: id, startPlaying: true }).catch((error) => console.error(error));
    }
    async authorizeUser() {
        return await MusicKit.getInstance().authorize();
    }
    async checkUserAuthorization() {
        return MusicKit.getInstance().isAuthorized;
    }
    async getPlaylistInfo(playlistId) {
        var fullPlaylist = await MusicKit.getInstance().api.music(API_PATH.LIBRARY + ResourceType.playlists + '/' + playlistId, { include: ['tracks'] });
        return fullPlaylist.data.data[0];
    }
    async getUserPlaylists() {
        var playlists = await MusicKit.getInstance().api.music(API_PATH.LIBRARY + ResourceType.playlists);
        return playlists.data.data;
    }
    async getSong() {
        const songId = '1498121711';
        const songId2 = '302987568';
        await this.instance.setQueue({ song: songId }).catch((error) => console.error(error));
        await this.instance.playLater({ song: songId2 }).catch((error) => console.error(error));
    }
    async skipToPreviousItem() {
        this.instance.skipToPreviousItem();
    }
    async skipToNextItem() {
        this.instance.skipToNextItem();
    }
    togglePlayback() {
        if (this.instance.isPlaying)
            this.instance.pause();
        else
            this.instance.play();
    }
    async seekToTime(time) {
        if (time > this.instance.currentPlaybackTime)
            this.instance._playbackControllerInternal._playerOptions.services.mediaItemPlayback._currentPlayer.audio.currentTime = time;
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
    toggleShuffleMode() {
        if (this.state.shuffleMode == MusicKit.PlayerShuffleMode.off) {
            this.instance.shuffleMode = MusicKit.PlayerShuffleMode.songs;
            this.setState((state) => ({ shuffleMode: MusicKit.PlayerShuffleMode.songs }));
        }
        else {
            this.instance.shuffleMode = MusicKit.PlayerShuffleMode.off;
            this.setState((state) => ({ shuffleMode: MusicKit.PlayerShuffleMode.off }));
        }
    }
    toggleRepeatMode() {
        switch (this.state.repeatMode.valueOf()) {
            case MusicKit.PlayerRepeatMode.none:
                this.instance.repeatMode = MusicKit.PlayerRepeatMode.all;
                this.setState((state) => ({ repeatMode: MusicKit.PlayerRepeatMode.all }));
                break;
            case MusicKit.PlayerRepeatMode.one:
                this.instance.repeatMode = MusicKit.PlayerRepeatMode.none;
                this.setState((state) => ({ repeatMode: MusicKit.PlayerRepeatMode.none }));
                break;
            case MusicKit.PlayerRepeatMode.all:
                this.instance.repeatMode = MusicKit.PlayerRepeatMode.one;
                this.setState((state) => ({ repeatMode: MusicKit.PlayerRepeatMode.one }));
                break;
        }
    }
}
MusickitStore.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: MusickitStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
MusickitStore.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: MusickitStore, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: MusickitStore, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVzaWNraXQtc3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtYXBwbGUtbXVzaWMvc3JjL2xpYi9zdG9yZS9tdXNpY2tpdC1zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFNBQVMsQ0FBQzs7QUFFaEMsSUFBSyxNQTZDSjtBQTdDRCxXQUFLLE1BQU07SUFDUCw2Q0FBbUMsQ0FBQTtJQUNuQyxpREFBdUMsQ0FBQTtJQUN2QyxpREFBdUMsQ0FBQTtJQUN2Qyx1RUFBNkQsQ0FBQTtJQUM3RCx5RUFBK0QsQ0FBQTtJQUMvRCxpRUFBdUQsQ0FBQTtJQUN2RCxxREFBMkMsQ0FBQTtJQUMzQyxtQ0FBeUIsQ0FBQTtJQUN6QiwyQ0FBaUMsQ0FBQTtJQUNqQywrREFBcUQsQ0FBQTtJQUNyRCwyREFBaUQsQ0FBQTtJQUNqRCwyQkFBaUIsQ0FBQTtJQUNqQix1Q0FBNkIsQ0FBQTtJQUM3QixxREFBMkMsQ0FBQTtJQUMzQyw2REFBbUQsQ0FBQTtJQUNuRCwrREFBcUQsQ0FBQTtJQUNyRCxtREFBeUMsQ0FBQTtJQUN6QyxtREFBeUMsQ0FBQTtJQUN6QyxxQ0FBMkIsQ0FBQTtJQUMzQixpREFBdUMsQ0FBQTtJQUN2QywrREFBcUQsQ0FBQTtJQUNyRCw2REFBbUQsQ0FBQTtJQUNuRCwrREFBcUQsQ0FBQTtJQUNyRCxpRUFBdUQsQ0FBQTtJQUN2RCxpRUFBdUQsQ0FBQTtJQUN2RCx5REFBK0MsQ0FBQTtJQUMvQyw2REFBbUQsQ0FBQTtJQUNuRCwyREFBaUQsQ0FBQTtJQUNqRCwrRUFBcUUsQ0FBQTtJQUNyRSx5REFBK0MsQ0FBQTtJQUMvQyw2REFBbUQsQ0FBQTtJQUNuRCxxREFBMkMsQ0FBQTtJQUMz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QWEsY0FGVixNQUFNOzJGQUVULGFBQWE7a0JBSHpCLFVBQVU7bUJBQUM7b0JBQ1IsVUFBVSxFQUFFLE1BQU07aUJBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT25EZXN0cm95IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSBcInJ4anNcIjtcclxuaW1wb3J0IHsgU3RvcmUgfSBmcm9tIFwiLi9zdG9yZVwiO1xyXG5cclxuZW51bSBFdmVudHMge1xyXG4gICAgYXVkaW9UcmFja0FkZGVkID0gJ2F1ZGlvVHJhY2tBZGRlZCcsXHJcbiAgICBhdWRpb1RyYWNrQ2hhbmdlZCA9ICdhdWRpb1RyYWNrQ2hhbmdlZCcsXHJcbiAgICBhdWRpb1RyYWNrUmVtb3ZlZCA9ICdhdWRpb1RyYWNrUmVtb3ZlZCcsXHJcbiAgICBhdXRob3JpemF0aW9uU3RhdHVzRGlkQ2hhbmdlID0gJ2F1dGhvcml6YXRpb25TdGF0dXNEaWRDaGFuZ2UnLFxyXG4gICAgYXV0aG9yaXphdGlvblN0YXR1c1dpbGxDaGFuZ2UgPSAnYXV0aG9yaXphdGlvblN0YXR1c1dpbGxDaGFuZ2UnLFxyXG4gICAgYnVmZmVyZWRQcm9ncmVzc0RpZENoYW5nZSA9ICdidWZmZXJlZFByb2dyZXNzRGlkQ2hhbmdlJyxcclxuICAgIGNhcGFiaWxpdGllc0NoYW5nZWQgPSAnY2FwYWJpbGl0aWVzQ2hhbmdlZCcsXHJcbiAgICBjb25maWd1cmVkID0gJ2NvbmZpZ3VyZWQnLFxyXG4gICAgZHJtVW5zdXBwb3J0ZWQgPSAnZHJtVW5zdXBwb3J0ZWQnLFxyXG4gICAgZWxpZ2libGVGb3JTdWJzY3JpYmVWaWV3ID0gJ2VsaWdpYmxlRm9yU3Vic2NyaWJlVmlldycsXHJcbiAgICBmb3JjZWRUZXh0VHJhY2tDaGFuZ2VkID0gJ2ZvcmNlZFRleHRUcmFja0NoYW5nZWQnLFxyXG4gICAgbG9hZGVkID0gJ2xvYWRlZCcsXHJcbiAgICBtZWRpYUNhblBsYXkgPSAnbWVkaWFDYW5QbGF5JyxcclxuICAgIG1lZGlhRWxlbWVudENyZWF0ZWQgPSAnbWVkaWFFbGVtZW50Q3JlYXRlZCcsXHJcbiAgICBtZWRpYUl0ZW1TdGF0ZURpZENoYW5nZSA9ICdtZWRpYUl0ZW1TdGF0ZURpZENoYW5nZScsXHJcbiAgICBtZWRpYUl0ZW1TdGF0ZVdpbGxDaGFuZ2UgPSAnbWVkaWFJdGVtU3RhdGVXaWxsQ2hhbmdlJyxcclxuICAgIG1lZGlhUGxheWJhY2tFcnJvciA9ICdtZWRpYVBsYXliYWNrRXJyb3InLFxyXG4gICAgbWVkaWFTa2lwQXZhaWxhYmxlID0gJ21lZGlhU2tpcEF2YWlsYWJsZScsXHJcbiAgICBtZWRpYVVwTmV4dCA9ICdtZWRpYVVwTmV4dCcsXHJcbiAgICBtZXRhZGF0YURpZENoYW5nZSA9ICdtZXRhZGF0YURpZENoYW5nZScsXHJcbiAgICBub3dQbGF5aW5nSXRlbVdpbGxDaGFuZ2UgPSAnbm93UGxheWluZ0l0ZW1XaWxsQ2hhbmdlJyxcclxuICAgIG5vd1BsYXlpbmdJdGVtRGlkQ2hhbmdlID0gJ25vd1BsYXlpbmdJdGVtRGlkQ2hhbmdlJyxcclxuICAgIHBsYXliYWNrQml0cmF0ZURpZENoYW5nZSA9ICdwbGF5YmFja0JpdHJhdGVEaWRDaGFuZ2UnLFxyXG4gICAgcGxheWJhY2tEdXJhdGlvbkRpZENoYW5nZSA9ICdwbGF5YmFja0R1cmF0aW9uRGlkQ2hhbmdlJyxcclxuICAgIHBsYXliYWNrUHJvZ3Jlc3NEaWRDaGFuZ2UgPSAncGxheWJhY2tQcm9ncmVzc0RpZENoYW5nZScsXHJcbiAgICBwbGF5YmFja1JhdGVEaWRDaGFuZ2UgPSAncGxheWJhY2tSYXRlRGlkQ2hhbmdlJyxcclxuICAgIHBsYXliYWNrU3RhdGVXaWxsQ2hhbmdlID0gJ3BsYXliYWNrU3RhdGVXaWxsQ2hhbmdlJyxcclxuICAgIHBsYXliYWNrU3RhdGVEaWRDaGFuZ2UgPSAncGxheWJhY2tTdGF0ZURpZENoYW5nZScsXHJcbiAgICBwbGF5YmFja1RhcmdldEF2YWlsYWJsZURpZENoYW5nZSA9ICdwbGF5YmFja1RhcmdldEF2YWlsYWJsZURpZENoYW5nZScsXHJcbiAgICBwbGF5YmFja1RpbWVEaWRDaGFuZ2UgPSAncGxheWJhY2tUaW1lRGlkQ2hhbmdlJyxcclxuICAgIHBsYXliYWNrVm9sdW1lRGlkQ2hhbmdlID0gJ3BsYXliYWNrVm9sdW1lRGlkQ2hhbmdlJyxcclxuICAgIHBsYXllclR5cGVEaWRDaGFuZ2UgPSAncGxheWVyVHlwZURpZENoYW5nZScsXHJcbiAgICBwcmltYXJ5UGxheWVyRGlkQ2hhbmdlID0gJ3ByaW1hcnlQbGF5ZXJEaWRDaGFuZ2UnLFxyXG4gICAgcXVldWVJc1JlYWR5ID0gJ3F1ZXVlSXNSZWFkeScsXHJcbiAgICBxdWV1ZUl0ZW1zRGlkQ2hhbmdlID0gJ3F1ZXVlSXRlbXNEaWRDaGFuZ2UnLFxyXG4gICAgcXVldWVQb3NpdGlvbkRpZENoYW5nZSA9ICdxdWV1ZVBvc2l0aW9uRGlkQ2hhbmdlJyxcclxuICAgIHNodWZmbGVNb2RlRGlkQ2hhbmdlID0gJ3NodWZmbGVNb2RlRGlkQ2hhbmdlJyxcclxuICAgIHJlcGVhdE1vZGVEaWRDaGFuZ2UgPSAncmVwZWF0TW9kZURpZENoYW5nZScsXHJcbiAgICBzdG9yZWZyb250Q291bnRyeUNvZGVEaWRDaGFuZ2UgPSAnc3RvcmVmcm9udENvdW50cnlDb2RlRGlkQ2hhbmdlJyxcclxuICAgIHN0b3JlZnJvbnRJZGVudGlmaWVyRGlkQ2hhbmdlID0gJ3N0b3JlZnJvbnRJZGVudGlmaWVyRGlkQ2hhbmdlJyxcclxuICAgIHRleHRUcmFja0FkZGVkID0gJ3RleHRUcmFja0FkZGVkJyxcclxuICAgIHRleHRUcmFja0NoYW5nZWQgPSAndGV4dFRyYWNrQ2hhbmdlZCcsXHJcbiAgICB0ZXh0VHJhY2tSZW1vdmVkID0gJ3RleHRUcmFja1JlbW92ZWQnLFxyXG4gICAgdGltZWRNZXRhZGF0YURpZENoYW5nZSA9ICd0aW1lZE1ldGFkYXRhRGlkQ2hhbmdlJ1xyXG59XHJcblxyXG5lbnVtIFJlc291cmNlVHlwZSB7XHJcbiAgICBhY3Rpdml0aWVzID0gJ2FjdGl2aXRpZXMnLFxyXG4gICAgYWxidW1zID0gJ2FsYnVtcycsXHJcbiAgICAnYXBwbGUtY3VyYXRvcnMnID0gJ2FwcGxlLWN1cmF0b3JzJyxcclxuICAgIGFydGlzdHMgPSAnYXJ0aXN0cycsXHJcbiAgICBjaGFydHMgPSAnY2hhcnRzJyxcclxuICAgIGN1cmF0b3JzID0gJ2N1cmF0b3JzJyxcclxuICAgIGdlbnJlcyA9ICdnZW5yZXMnLFxyXG4gICAgJ211c2ljLXZpZGVvcycgPSAnbXVzaWMtdmlkZW9zJyxcclxuICAgIHBsYXlsaXN0cyA9ICdwbGF5bGlzdHMnLFxyXG4gICAgc2VhcmNoID0gJ3NlYXJjaCcsXHJcbiAgICAnc2VhcmNoL2hpbnRzJyA9ICdzZWFyY2gvaGludHMnLFxyXG4gICAgc29uZ3MgPSAnc29uZ3MnLFxyXG4gICAgc3RhdGlvbnMgPSAnc3RhdGlvbnMnLFxyXG5cclxuICAgIC8vcGVyc29uYWxpemVkIGNvbnRlbnRcclxuICAgIGxpYnJhcnkgPSAnbGlicmFyeScsXHJcbiAgICByZWNvbW1lbmRhdGlvbnMgPSAncmVjb21tZW5kYXRpb25zJyxcclxuICAgICdyZWNlbnQvcGxheWVkJyA9ICdyZWNlbnQvcGxheWVkJyxcclxuICAgICdoaXN0b3J5L2hlYXZ5LXJvdGF0aW9uJyA9ICdoaXN0b3J5L2hlYXZ5LXJvdGF0aW9uJyxcclxuXHJcbiAgICAvL3N0b3JlZnJvbnRzXHJcbiAgICBzdG9yZWZyb250cyA9ICdzdG9yZWZyb250cydcclxufVxyXG5cclxuZW51bSBBUElfUEFUSCB7XHJcbiAgICBCQVNFID0gJy92MS8nLFxyXG4gICAgQ0FUQUxPRyA9IGAvdjEvY2F0YWxvZy9gLFxyXG4gICAgTElCUkFSWSA9ICcvdjEvbWUvbGlicmFyeS8nLFxyXG4gICAgU1RPUkVGUk9OVCA9ICcvdjEvc3RvcmVmcm9udHMvJ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE11c2lja2l0U3RhdGUge1xyXG4gICAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW4sXHJcbiAgICB2b2x1bWU6IG51bWJlcixcclxuICAgIHN0b3JlZnJvbnQ6IHN0cmluZyxcclxuICAgIHF1ZXVlOiBBcnJheTxNdXNpY0tpdC5NZWRpYUl0ZW0+O1xyXG4gICAgaGlzdG9yeTogQXJyYXk8TXVzaWNLaXQuTWVkaWFJdGVtPjtcclxuICAgIHF1ZXVlUG9zaXRpb246IG51bWJlcjtcclxuICAgIHNodWZmbGVNb2RlOiBNdXNpY0tpdC5QbGF5ZXJTaHVmZmxlTW9kZTtcclxuICAgIHJlcGVhdE1vZGU6IE11c2ljS2l0LlBsYXllclJlcGVhdE1vZGU7XHJcbiAgICBjdXJyZW50VHJhY2s6IE11c2ljS2l0Lk1lZGlhSXRlbSB8IG51bGw7XHJcbiAgICBjdXJyZW50VHJhY2tBcnR3b3JrVVJMOiBzdHJpbmc7XHJcbiAgICBjdXJyZW50UGxheWJhY2tUaW1lOiBudW1iZXI7XHJcbiAgICBjdXJyZW50UGxheWJhY2tEdXJhdGlvbjogbnVtYmVyO1xyXG4gICAgaXNQbGF5aW5nOiBib29sZWFuO1xyXG4gICAgcGxheWJhY2tTdGF0ZTogTXVzaWNLaXQuUGxheWJhY2tTdGF0ZXMgfCBudWxsO1xyXG4gICAgdXNlclBsYXlsaXN0czogTXVzaWNLaXQuTGlicmFyeVBsYXlsaXN0c1tdO1xyXG59XHJcblxyXG5jb25zdCBpbml0aWFsU3RhdGU6IE11c2lja2l0U3RhdGUgPSB7XHJcbiAgICBpbml0aWFsaXplZDogZmFsc2UsXHJcbiAgICB2b2x1bWU6IDAuMjUsXHJcbiAgICBzdG9yZWZyb250OiAnJyxcclxuICAgIHF1ZXVlOiBbXSxcclxuICAgIGhpc3Rvcnk6IFtdLFxyXG4gICAgcXVldWVQb3NpdGlvbjogMCxcclxuICAgIHNodWZmbGVNb2RlOiBNdXNpY0tpdC5QbGF5ZXJTaHVmZmxlTW9kZS5vZmYsXHJcbiAgICByZXBlYXRNb2RlOiBNdXNpY0tpdC5QbGF5ZXJSZXBlYXRNb2RlLm5vbmUsXHJcbiAgICBjdXJyZW50VHJhY2s6IG51bGwsXHJcbiAgICBjdXJyZW50VHJhY2tBcnR3b3JrVVJMOiAnJyxcclxuICAgIGN1cnJlbnRQbGF5YmFja1RpbWU6IDAsXHJcbiAgICBjdXJyZW50UGxheWJhY2tEdXJhdGlvbjogMCxcclxuICAgIGlzUGxheWluZzogZmFsc2UsXHJcbiAgICBwbGF5YmFja1N0YXRlOiBudWxsLFxyXG4gICAgdXNlclBsYXlsaXN0czogW11cclxufTtcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICAgIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTXVzaWNraXRTdG9yZSBleHRlbmRzIFN0b3JlPE11c2lja2l0U3RhdGU+IGltcGxlbWVudHMgT25EZXN0cm95IHtcclxuICAgIHN1YnM6IFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcclxuICAgIGluc3RhbmNlITogTXVzaWNLaXQuTXVzaWNLaXRJbnN0YW5jZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihpbml0aWFsU3RhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc3Vicy51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEV2ZW50TGlzdGVuZXIobGlzdGVuZXI6IGFueSkge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2UuYWRkRXZlbnRMaXN0ZW5lcihsaXN0ZW5lci5ldmVudCwgbGlzdGVuZXIuZnVuY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHJlY29uZmlndXJlKGRldlRva2VuOiBzdHJpbmcsIGFwcE5hbWU6IHN0cmluZywgYnVpbGRWZXI6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSBhd2FpdCBNdXNpY0tpdC5jb25maWd1cmUoe1xyXG4gICAgICAgICAgICBkZXZlbG9wZXJUb2tlbjogZGV2VG9rZW4sXHJcbiAgICAgICAgICAgIGFwcDoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogYXBwTmFtZSxcclxuICAgICAgICAgICAgICAgIGJ1aWxkOiBidWlsZFZlcixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgYXN5bmMgaW5pdE11c2ljS2l0KGRldlRva2VuOiBzdHJpbmcsIGFwcE5hbWU6IHN0cmluZywgYnVpbGRWZXI6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSBhd2FpdCBNdXNpY0tpdC5jb25maWd1cmUoe1xyXG4gICAgICAgICAgICBkZXZlbG9wZXJUb2tlbjogZGV2VG9rZW4sXHJcbiAgICAgICAgICAgIGFwcDoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogYXBwTmFtZSxcclxuICAgICAgICAgICAgICAgIGJ1aWxkOiBidWlsZFZlcixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gcmVnaXN0ZXJpbmcgZXZlbnRzXHJcblxyXG4gICAgICAgIHRoaXMuaW5zdGFuY2UuYWRkRXZlbnRMaXN0ZW5lcihFdmVudHMucGxheWJhY2tWb2x1bWVEaWRDaGFuZ2UsICgoZXZlbnQ6IGFueSkgPT5cclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSgoc3RhdGUpID0+ICh7IHZvbHVtZTogdGhpcy5pbnN0YW5jZS52b2x1bWUgfSkpXHJcbiAgICAgICAgKSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5zdGFuY2UuYWRkRXZlbnRMaXN0ZW5lcihFdmVudHMubm93UGxheWluZ0l0ZW1EaWRDaGFuZ2UsICgoZXZlbnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pbnN0YW5jZS5ub3dQbGF5aW5nSXRlbSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5oaXN0b3J5LnB1c2godGhpcy5pbnN0YW5jZS5ub3dQbGF5aW5nSXRlbSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSgoc3RhdGUpID0+ICh7IC4uLnN0YXRlLCAuLi57IFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUcmFja0FydHdvcmtVUkw6IE11c2ljS2l0LmZvcm1hdEFydHdvcmtVUkwodGhpcy5pbnN0YW5jZS5ub3dQbGF5aW5nSXRlbT8uYXJ0d29yayA/PyBzdGF0ZS5jdXJyZW50VHJhY2s/LmFydHdvcmshKSwgXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBsYXliYWNrVGltZTogMCwgY3VycmVudFBsYXliYWNrRHVyYXRpb246IDAsIGN1cnJlbnRUcmFjazogdGhpcy5pbnN0YW5jZS5ub3dQbGF5aW5nSXRlbX0gfSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICkpO1xyXG5cclxuICAgICAgICB0aGlzLmluc3RhbmNlLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnRzLnBsYXliYWNrVGltZURpZENoYW5nZSwgKChldmVudDogYW55KSA9PlxyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKChzdGF0ZSkgPT4gKHsgY3VycmVudFBsYXliYWNrVGltZTogdGhpcy5pbnN0YW5jZS5jdXJyZW50UGxheWJhY2tUaW1lIH0pKVxyXG4gICAgICAgICkpO1xyXG5cclxuICAgICAgICB0aGlzLmluc3RhbmNlLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnRzLnBsYXliYWNrRHVyYXRpb25EaWRDaGFuZ2UsICgoZXZlbnQ6IGFueSkgPT5cclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSgoc3RhdGUpID0+ICh7IGN1cnJlbnRQbGF5YmFja0R1cmF0aW9uOiB0aGlzLmluc3RhbmNlLmN1cnJlbnRQbGF5YmFja0R1cmF0aW9uIH0pKVxyXG4gICAgICAgICkpO1xyXG5cclxuICAgICAgICB0aGlzLmluc3RhbmNlLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnRzLnBsYXliYWNrU3RhdGVEaWRDaGFuZ2UsICgoZXZlbnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKChzdGF0ZSkgPT4gKHsgLi4uc3RhdGUsIC4uLnsgaXNQbGF5aW5nOiB0aGlzLmluc3RhbmNlLmlzUGxheWluZywgcGxheWJhY2tTdGF0ZTogdGhpcy5pbnN0YW5jZS5wbGF5YmFja1N0YXRlIH0gfSkpO1xyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZS52b2x1bWUgPSB0aGlzLnN0YXRlLnZvbHVtZTtcclxuXHJcbiAgICAgICAgKHRoaXMuaW5zdGFuY2UgYXMgYW55KS5hdXRvcGxheUVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICh0aGlzLmluc3RhbmNlIGFzIGFueSkuX2F1dG9wbGF5RW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICh0aGlzLmluc3RhbmNlIGFzIGFueSkuX2JhZy5mZWF0dXJlc1snZW5oYW5jZWQtaGxzJ10gPSB0cnVlO1xyXG4gICAgICAgICh0aGlzLmluc3RhbmNlIGFzIGFueSkuYml0cmF0ZSA9IDIwNDg7XHJcblxyXG4gICAgICAgIHZhciBwbGF5bGlzdHMgPSBhd2FpdCB0aGlzLmdldFVzZXJQbGF5bGlzdHMoKS50aGVuKChyZXM6IE11c2ljS2l0LkxpYnJhcnlQbGF5bGlzdHNbXSkgPT4gcmVzKTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKChzdGF0ZSkgPT4gKHsgdXNlclBsYXlsaXN0czogcGxheWxpc3RzIH0pKTtcclxuICAgICAgICB0aGlzLmdldFNvbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBzdGFydFBsYXlpbmdTb25nKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBhd2FpdCB0aGlzLmluc3RhbmNlLnNldFF1ZXVlKHtzb25nOiBpZCwgc3RhcnRQbGF5aW5nOiB0cnVlfSkuY2F0Y2goKGVycm9yOiBhbnkpID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBhdXRob3JpemVVc2VyKCkge1xyXG4gICAgICAgIHJldHVybiBhd2FpdCBNdXNpY0tpdC5nZXRJbnN0YW5jZSgpLmF1dGhvcml6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGNoZWNrVXNlckF1dGhvcml6YXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE11c2ljS2l0LmdldEluc3RhbmNlKCkuaXNBdXRob3JpemVkO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGdldFBsYXlsaXN0SW5mbyhwbGF5bGlzdElkOiBzdHJpbmcpOiBQcm9taXNlPE11c2ljS2l0LkxpYnJhcnlQbGF5bGlzdHMgfCBNdXNpY0tpdC5QbGF5bGlzdHM+IHtcclxuICAgICAgICB2YXIgZnVsbFBsYXlsaXN0ID0gYXdhaXQgTXVzaWNLaXQuZ2V0SW5zdGFuY2UoKS5hcGkubXVzaWMoQVBJX1BBVEguTElCUkFSWSArIFJlc291cmNlVHlwZS5wbGF5bGlzdHMgKyAnLycgKyBwbGF5bGlzdElkLCB7aW5jbHVkZTogWyd0cmFja3MnXX0pO1xyXG4gICAgICAgIHJldHVybiAoKGZ1bGxQbGF5bGlzdC5kYXRhLmRhdGFbMF0gYXMgdW5rbm93bikgYXMgTXVzaWNLaXQuTGlicmFyeVBsYXlsaXN0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZ2V0VXNlclBsYXlsaXN0cygpOiBQcm9taXNlPE11c2ljS2l0LkxpYnJhcnlQbGF5bGlzdHNbXT4ge1xyXG4gICAgICAgIHZhciBwbGF5bGlzdHMgPSBhd2FpdCBNdXNpY0tpdC5nZXRJbnN0YW5jZSgpLmFwaS5tdXNpYyhBUElfUEFUSC5MSUJSQVJZICsgUmVzb3VyY2VUeXBlLnBsYXlsaXN0cyk7XHJcbiAgICAgICAgcmV0dXJuICgocGxheWxpc3RzLmRhdGEuZGF0YSBhcyB1bmtub3duKSBhcyBNdXNpY0tpdC5MaWJyYXJ5UGxheWxpc3RzW10pO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGdldFNvbmcoKSB7XHJcbiAgICAgICAgY29uc3Qgc29uZ0lkID0gJzE0OTgxMjE3MTEnO1xyXG4gICAgICAgIGNvbnN0IHNvbmdJZDIgPSAnMzAyOTg3NTY4JztcclxuICAgICAgICBhd2FpdCB0aGlzLmluc3RhbmNlLnNldFF1ZXVlKHsgc29uZzogc29uZ0lkIH0pLmNhdGNoKChlcnJvcjogYW55KSA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5pbnN0YW5jZS5wbGF5TGF0ZXIoeyBzb25nOiBzb25nSWQyIH0pLmNhdGNoKChlcnJvcjogYW55KSA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgc2tpcFRvUHJldmlvdXNJdGVtKCkge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2Uuc2tpcFRvUHJldmlvdXNJdGVtKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgc2tpcFRvTmV4dEl0ZW0oKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZS5za2lwVG9OZXh0SXRlbSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZVBsYXliYWNrKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmluc3RhbmNlLmlzUGxheWluZykgdGhpcy5pbnN0YW5jZS5wYXVzZSgpO1xyXG4gICAgICAgIGVsc2UgdGhpcy5pbnN0YW5jZS5wbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgc2Vla1RvVGltZSh0aW1lOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGltZSA+IHRoaXMuaW5zdGFuY2UuY3VycmVudFBsYXliYWNrVGltZSkgKHRoaXMuaW5zdGFuY2UgYXMgYW55KS5fcGxheWJhY2tDb250cm9sbGVySW50ZXJuYWwuX3BsYXllck9wdGlvbnMuc2VydmljZXMubWVkaWFJdGVtUGxheWJhY2suX2N1cnJlbnRQbGF5ZXIuYXVkaW8uY3VycmVudFRpbWUgPSB0aW1lO1xyXG4gICAgICAgIGVsc2UgKHRoaXMuaW5zdGFuY2UgYXMgYW55KS5fbWVkaWFJdGVtUGxheWJhY2suX2N1cnJlbnRQbGF5ZXIuc2Vla1RvVGltZSh0aW1lKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhc3luYyB3YWl0U2Vla1JlYWR5KHRpbWU6IG51bWJlcikge1xyXG4gICAgLy8gICAgIGNvbnN0IHByb2dyZXNzID0gc2V0SW50ZXJ2YWwoYXN5bmMgKCkgPT4ge1xyXG4gICAgLy8gICAgICAgICBpZiAoKHRoaXMuaW5zdGFuY2UgYXMgYW55KS5fcGxheWJhY2tDb250cm9sbGVySW50ZXJuYWwuX3BsYXllck9wdGlvbnMuc2VydmljZXMubWVkaWFJdGVtUGxheWJhY2suX2N1cnJlbnRQbGF5ZXIuY3VycmVudEJ1ZmZlcmVkUHJvZ3Jlc3MgPj0gMjApIHtcclxuICAgIC8vICAgICAgICAgICAgICh0aGlzLmluc3RhbmNlIGFzIGFueSkuX3BsYXliYWNrQ29udHJvbGxlckludGVybmFsLl9wbGF5ZXJPcHRpb25zLnNlcnZpY2VzLm1lZGlhSXRlbVBsYXliYWNrLl9jdXJyZW50UGxheWVyLmF1ZGlvLmN1cnJlbnRUaW1lID0gdGltZTtcclxuICAgIC8vICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwocHJvZ3Jlc3MpO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfSwgMjAwKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBzZXRWb2x1bWUodm9sdW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmluc3RhbmNlLnZvbHVtZSA9IHZvbHVtZTtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVTaHVmZmxlTW9kZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5zaHVmZmxlTW9kZSA9PSBNdXNpY0tpdC5QbGF5ZXJTaHVmZmxlTW9kZS5vZmYpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZS5zaHVmZmxlTW9kZSA9IE11c2ljS2l0LlBsYXllclNodWZmbGVNb2RlLnNvbmdzO1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKChzdGF0ZSkgPT4gKHsgc2h1ZmZsZU1vZGU6IE11c2ljS2l0LlBsYXllclNodWZmbGVNb2RlLnNvbmdzIH0pKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlLnNodWZmbGVNb2RlID0gTXVzaWNLaXQuUGxheWVyU2h1ZmZsZU1vZGUub2ZmO1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKChzdGF0ZSkgPT4gKHsgc2h1ZmZsZU1vZGU6IE11c2ljS2l0LlBsYXllclNodWZmbGVNb2RlLm9mZiB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZVJlcGVhdE1vZGUoKSB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLnN0YXRlLnJlcGVhdE1vZGUudmFsdWVPZigpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgTXVzaWNLaXQuUGxheWVyUmVwZWF0TW9kZS5ub25lOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnN0YW5jZS5yZXBlYXRNb2RlID0gTXVzaWNLaXQuUGxheWVyUmVwZWF0TW9kZS5hbGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKChzdGF0ZSkgPT4gKHsgcmVwZWF0TW9kZTogTXVzaWNLaXQuUGxheWVyUmVwZWF0TW9kZS5hbGwgfSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgTXVzaWNLaXQuUGxheWVyUmVwZWF0TW9kZS5vbmU6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluc3RhbmNlLnJlcGVhdE1vZGUgPSBNdXNpY0tpdC5QbGF5ZXJSZXBlYXRNb2RlLm5vbmU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKChzdGF0ZSkgPT4gKHsgcmVwZWF0TW9kZTogTXVzaWNLaXQuUGxheWVyUmVwZWF0TW9kZS5ub25lIH0pKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIE11c2ljS2l0LlBsYXllclJlcGVhdE1vZGUuYWxsOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnN0YW5jZS5yZXBlYXRNb2RlID0gTXVzaWNLaXQuUGxheWVyUmVwZWF0TW9kZS5vbmU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKChzdGF0ZSkgPT4gKHsgcmVwZWF0TW9kZTogTXVzaWNLaXQuUGxheWVyUmVwZWF0TW9kZS5vbmUgfSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19