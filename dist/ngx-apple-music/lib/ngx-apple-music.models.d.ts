import { MediaItem, MediaItemType, AlbumAttributes, ArtistAttributes, SongAttributes, MusicVideoAttributes, PlaylistAttributes, StationAttributes, AlbumRelationships, AlbumViews, ArtistViews, ArtistRelationships, SongRelationships, MusicVideoRelationships, MusicVideoViews, PlaylistViews, PlaylistRelationships, StationRelationships } from "./ngx-apple-music.interface";
export declare class Album {
    id: string;
    href: string;
    attributes: AlbumAttributes;
    type: MediaItemType.albums;
    relationships: AlbumRelationships;
    views: AlbumViews;
    constructor(data: Required<Pick<MediaItem<Album>, 'id' | 'href'>> & Partial<Pick<MediaItem<Album>, 'attributes' | 'relationships' | 'views'>>);
}
export declare class Artist {
    id: string;
    href: string;
    attributes: ArtistAttributes;
    relationships: ArtistRelationships;
    type: MediaItemType.artists;
    views: ArtistViews;
    constructor(data: Pick<MediaItem<Artist>, 'id' | 'href'> & Partial<MediaItem<Artist>> & {
        attributes: ArtistAttributes;
    });
}
export declare class Song {
    id: string;
    href: string;
    attributes: SongAttributes;
    relationships: SongRelationships;
    type: MediaItemType.songs;
    constructor(data: Pick<MediaItem<Song>, 'id' | 'href'> & Partial<MediaItem<Song>> & {
        attributes: SongAttributes;
    });
}
export declare class MusicVideo {
    id: string;
    href: string;
    attributes: MusicVideoAttributes;
    relationships: MusicVideoRelationships;
    views: MusicVideoViews;
    type: MediaItemType.musicVideos;
    constructor(data: Pick<MediaItem<MusicVideo>, 'id' | 'href'> & Partial<MediaItem<MusicVideo>> & {
        attributes: MusicVideoAttributes;
    });
}
export declare class Playlist {
    id: string;
    href: string;
    attributes: PlaylistAttributes;
    relationships: PlaylistRelationships;
    type: MediaItemType.playlists;
    views: PlaylistViews;
    constructor(data: Pick<MediaItem<Playlist>, 'id' | 'href'> & Partial<MediaItem<Playlist>> & {
        attributes: PlaylistAttributes;
    });
}
export declare class Station {
    id: string;
    href: string;
    attributes: StationAttributes;
    relationships: StationRelationships;
    type: MediaItemType.stations;
    constructor(data: Pick<MediaItem<Station>, 'id' | 'href'> & Partial<MediaItem<Station>> & {
        attributes: StationAttributes;
    });
}
