import { Album } from "../ngx-apple-music.models";
export declare module MusicKitWrapper {
    function getInstance(): Promise<any>;
    function play(): Promise<void>;
    function getUserPlaylists(): Promise<void>;
    function setQueue(queue: Array<Album>, _?: any): Promise<any>;
    function playNext(queue: any, _?: any): Promise<any>;
    function playLast(queue: any, _?: any): Promise<any>;
    function configureMusicKit(devToken: string, appName: string, buildVer: string): Promise<void>;
    function initMusicKit(devToken: string, appName: string, buildVer: string): Promise<void>;
    function startAuthentication(): Promise<any>;
    function checkIfUserIsAuthorized(): Promise<any>;
}
