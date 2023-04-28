import { Injectable, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Store } from "./store";

enum Events {
  audioTrackAdded = "audioTrackAdded",
  audioTrackChanged = "audioTrackChanged",
  audioTrackRemoved = "audioTrackRemoved",
  authorizationStatusDidChange = "authorizationStatusDidChange",
  authorizationStatusWillChange = "authorizationStatusWillChange",
  bufferedProgressDidChange = "bufferedProgressDidChange",
  capabilitiesChanged = "capabilitiesChanged",
  configured = "configured",
  drmUnsupported = "drmUnsupported",
  eligibleForSubscribeView = "eligibleForSubscribeView",
  forcedTextTrackChanged = "forcedTextTrackChanged",
  loaded = "loaded",
  mediaCanPlay = "mediaCanPlay",
  mediaElementCreated = "mediaElementCreated",
  mediaItemStateDidChange = "mediaItemStateDidChange",
  mediaItemStateWillChange = "mediaItemStateWillChange",
  mediaPlaybackError = "mediaPlaybackError",
  mediaSkipAvailable = "mediaSkipAvailable",
  mediaUpNext = "mediaUpNext",
  metadataDidChange = "metadataDidChange",
  nowPlayingItemWillChange = "nowPlayingItemWillChange",
  nowPlayingItemDidChange = "nowPlayingItemDidChange",
  playbackBitrateDidChange = "playbackBitrateDidChange",
  playbackDurationDidChange = "playbackDurationDidChange",
  playbackProgressDidChange = "playbackProgressDidChange",
  playbackRateDidChange = "playbackRateDidChange",
  playbackStateWillChange = "playbackStateWillChange",
  playbackStateDidChange = "playbackStateDidChange",
  playbackTargetAvailableDidChange = "playbackTargetAvailableDidChange",
  playbackTimeDidChange = "playbackTimeDidChange",
  playbackVolumeDidChange = "playbackVolumeDidChange",
  playerTypeDidChange = "playerTypeDidChange",
  primaryPlayerDidChange = "primaryPlayerDidChange",
  queueIsReady = "queueIsReady",
  queueItemsDidChange = "queueItemsDidChange",
  queuePositionDidChange = "queuePositionDidChange",
  shuffleModeDidChange = "shuffleModeDidChange",
  repeatModeDidChange = "repeatModeDidChange",
  storefrontCountryCodeDidChange = "storefrontCountryCodeDidChange",
  storefrontIdentifierDidChange = "storefrontIdentifierDidChange",
  textTrackAdded = "textTrackAdded",
  textTrackChanged = "textTrackChanged",
  textTrackRemoved = "textTrackRemoved",
  timedMetadataDidChange = "timedMetadataDidChange",
}

enum ResourceType {
  activities = "activities",
  albums = "albums",
  "apple-curators" = "apple-curators",
  artists = "artists",
  charts = "charts",
  curators = "curators",
  genres = "genres",
  "music-videos" = "music-videos",
  playlists = "playlists",
  search = "search",
  "search/hints" = "search/hints",
  songs = "songs",
  stations = "stations",

  //personalized content
  library = "library",
  recommendations = "recommendations",
  "recent/played" = "recent/played",
  "history/heavy-rotation" = "history/heavy-rotation",

  //storefronts
  storefronts = "storefronts",
}

enum API_PATH {
  BASE = "/v1/",
  CATALOG = `/v1/catalog/`,
  LIBRARY = "/v1/me/library/",
  STOREFRONT = "/v1/storefronts/",
}

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

const initialState: MusickitState = {
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

@Injectable({
  providedIn: "root",
})
export class MusickitStore extends Store<MusickitState> implements OnDestroy {
  subs: Subscription = new Subscription();
  instance!: MusicKit.MusicKitInstance;

  constructor() {
    super(initialState);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  addEventListener(listener: any) {
    this.instance.addEventListener(listener.event, listener.function);
  }

  async reconfigure(devToken: string, appName: string, buildVer: string) {
    this.instance = await MusicKit.configure({
      developerToken: devToken,
      app: {
        name: appName,
        build: buildVer,
      },
    });
  }

  async initMusicKit(devToken: string, appName: string, buildVer: string) {
    this.instance = await MusicKit.configure({
      developerToken: devToken,
      app: {
        name: appName,
        build: buildVer,
      },
    });

    // registering events

    this.instance.addEventListener(
      Events.playbackVolumeDidChange,
      (event: any) =>
        this.setState((state) => ({ volume: this.instance.volume }))
    );

    this.instance.addEventListener(
      Events.nowPlayingItemDidChange,
      (event: any) => {
        if (this.instance.nowPlayingItem) {
          this.state.history.push(this.instance.nowPlayingItem);
          return this.setState((state) => ({
            ...state,
            ...{
              currentTrackArtworkURL: MusicKit.formatArtworkURL(
                this.instance.nowPlayingItem?.artwork ??
                  state.currentTrack?.artwork!
              ),
              currentPlaybackTime: 0,
              currentPlaybackDuration: 0,
              currentTrack: this.instance.nowPlayingItem,
            },
          }));
        }
      }
    );

    this.instance.addEventListener(Events.playbackTimeDidChange, (event: any) =>
      this.setState((state) => ({
        currentPlaybackTime: this.instance.currentPlaybackTime,
      }))
    );

    this.instance.addEventListener(
      Events.playbackDurationDidChange,
      (event: any) =>
        this.setState((state) => ({
          currentPlaybackDuration: this.instance.currentPlaybackDuration,
        }))
    );

    this.instance.addEventListener(
      Events.playbackStateDidChange,
      (event: any) => {
        this.setState((state) => ({
          ...state,
          ...{
            isPlaying: this.instance.isPlaying,
            playbackState: this.instance.playbackState,
          },
        }));
      }
    );

    this.instance.volume = this.state.volume;

    (this.instance as any).autoplayEnabled = true;
    (this.instance as any)._autoplayEnabled = true;

    (this.instance as any)._bag.features["enhanced-hls"] = true;
    (this.instance as any).bitrate = 2048;
    (this.instance as any).api.music.session._config.url =
      "https://amp-api.music.apple.com";

    var playlists = await this.getUserPlaylists().then(
      (res: MusicKit.LibraryPlaylists[]) => res
    );

    this.setState((state) => ({ userPlaylists: playlists }));
  }

  async startPlayingSong(id: string) {
    await MusicKit.getInstance()
      .setQueue({ song: id })
      .finally(() => MusicKit.getInstance().play())
      .catch((error: any) => console.error(error));
  }

  async startPlayingMedia(id: string, type: string, shuffle: boolean) {
    const queueObject = type.includes("albums")
      ? { album: id }
      : { playlist: id };

    if (shuffle) {
      this.setState(() => ({
        shuffleMode: MusicKit.PlayerShuffleMode.songs,
      }));
    } else {
      this.setState(() => ({
        shuffleMode: MusicKit.PlayerShuffleMode.off,
      }));
    }
    MusicKit.getInstance().shuffleMode = this.state.shuffleMode;
    await MusicKit.getInstance()
      .setQueue(queueObject)
      .finally(() => MusicKit.getInstance().changeToMediaAtIndex(0))
      .catch((error: any) => console.error(error));
  }

  async playStation(id: string) {
    await MusicKit.getInstance()
      .setQueue({ station: id })
      .finally(() => MusicKit.getInstance().changeToMediaAtIndex(0))
      .catch((error: any) => console.error(error));
  }

  async authorizeUser() {
    return await MusicKit.getInstance().authorize();
  }

  async checkUserAuthorization() {
    return MusicKit.getInstance().isAuthorized;
  }

  async getRecentlyPlayed(): Promise<
    Array<MusicKit.Albums | MusicKit.Stations>
  > {
    return (
      await MusicKit.getInstance().api.music(
        API_PATH.BASE +
          "me/" +
          ResourceType["recent/played"] +
          "?include[albums]=artists"
      )
    ).data.data as unknown as Array<MusicKit.Albums | MusicKit.Stations>;
  }

  async getUserRecommendations(): Promise<
    Array<MusicKit.PersonalRecommendation>
  > {
    let tmpArray: Array<MusicKit.Resource> = [];
    let result = (
      await MusicKit.getInstance().api.music(
        API_PATH.BASE +
          "me/" +
          ResourceType.recommendations +
          "?include[albums]=artists"
      )
    ).data.data as unknown as Array<MusicKit.PersonalRecommendation>;
    console.log(result);
    return result;
  }

  async getPlaylistInfo(
    playlistId: string,
    isLibraryPlaylist: boolean
  ): Promise<MusicKit.LibraryPlaylists | MusicKit.Playlists> {
    var playlist = await MusicKit.getInstance().api.music(
      (isLibraryPlaylist ? API_PATH.LIBRARY : API_PATH.CATALOG + "us/") +
        ResourceType.playlists +
        "/" +
        playlistId,
      { include: ["tracks", "catalog"] }
    );
    return playlist.data.data[0] as unknown as MusicKit.LibraryPlaylists;
  }

  async getAlbumInfo(
    albumId: string,
    isLibraryAlbum: boolean
  ): Promise<MusicKit.LibraryAlbums | MusicKit.Albums> {
    var album = await MusicKit.getInstance().api.music(
      (isLibraryAlbum ? API_PATH.LIBRARY : API_PATH.CATALOG + "us/") +
        ResourceType.albums +
        "/" +
        albumId,
      { include: ["tracks", "catalog", "artists"] }
    );
    return album.data.data[0] as unknown as
      | MusicKit.Albums
      | MusicKit.LibraryAlbums;
  }

  async getUserPlaylists(): Promise<MusicKit.LibraryPlaylists[]> {
    var playlists = await MusicKit.getInstance().api.music(
      API_PATH.LIBRARY + ResourceType.playlists
    );
    return playlists.data.data as unknown as MusicKit.LibraryPlaylists[];
  }

  async getSong(songId: string): Promise<MusicKit.Songs> {
    var song = await MusicKit.getInstance().api.music(
      API_PATH.CATALOG + "{{storefrontId}}/" + ResourceType.songs + "/" + songId
    );
    return song.data.data[0] as unknown as MusicKit.Songs;
  }

  async skipToPreviousItem() {
    this.instance.skipToPreviousItem();
  }

  async skipToNextItem() {
    this.instance.skipToNextItem();
  }

  async putPlaylist(playlistId: string, data: MusicKit.Songs[]) {
    await MusicKit.getInstance().api.music(
      API_PATH.LIBRARY +
        ResourceType.playlists +
        "/" +
        playlistId +
        "/" +
        "tracks",
      {},
      {
        fetchOptions: {
          method: "PUT",
          body: JSON.stringify({
            data: data,
          }),
        },
      }
    );
  }

  togglePlayback() {
    if (this.instance.isPlaying) this.instance.pause();
    else this.instance.play();
  }

  async seekToTime(time: number) {
    if (time > this.instance.currentPlaybackTime)
      (
        this.instance as any
      )._playbackControllerInternal._playerOptions.services.mediaItemPlayback._currentPlayer.audio.currentTime =
        time;
    else
      (this.instance as any)._mediaItemPlayback._currentPlayer.seekToTime(time);
  }

  // async waitSeekReady(time: number) {
  //     const progress = setInterval(async () => {
  //         if ((this.instance as any)._playbackControllerInternal._playerOptions.services.mediaItemPlayback._currentPlayer.currentBufferedProgress >= 20) {
  //             (this.instance as any)._playbackControllerInternal._playerOptions.services.mediaItemPlayback._currentPlayer.audio.currentTime = time;
  //             clearInterval(progress);
  //         }
  //     }, 200);
  // }

  setVolume(volume: number) {
    this.instance.volume = volume;
  }

  replaceValue(item: any) {
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
    } else {
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
