import { MediaItem } from "../ngx-apple-music.interface";
import { Album } from "../ngx-apple-music.models";

declare let MusicKit: any;

export module MusicKitWrapper {
    var queue: Array<Album> = new Array<Album>();

    export async function getInstance() {
        return MusicKit.getInstance();
    }

    //media playback & management

    export async function play() {
        console.log('called');
        setQueue(queue);
        let instance = MusicKit.getInstance();
        instance.player.play();
    }

    export async function getUserPlaylists() {
        console.log('called');
        let instance = await MusicKit.getInstance();
        console.log('me: ' + await MusicKit.getInstance().me);
        let playlists = await instance.api.library.playlists(null);
        console.log(playlists);
        let playlistId = playlists[1].id;
        await instance.setQueue({
            playlist: playlistId,
        }).then(async () => await instance.player.prepareToPlay().then(async () => 
        await instance.player.play()));
    }

    export async function setQueue(queue: Array<Album>, _?: any) {
        let instance = MusicKit.getInstance();
        queue.push(new Album({id: '1', href: ''}));
        return instance.setQueue(queue);
    }

    export async function playNext (queue: any, _?: any) {
        let instance = MusicKit.getInstance();
        return instance.player.queue.prepend(queue);
    }

    export async function playLast(queue: any, _?: any) {
        let instance = MusicKit.getInstance();  
        return instance.player.queue.append(queue);
    }

    //init

    export async function configureMusicKit(devToken: string, appName: string, buildVer: string) {
        console.log(await initMusicKit(devToken, appName, buildVer).then(async () => await checkIfUserIsAuthorized()
        .then(async (res) => { console.log(await MusicKit.getInstance().musicUserToken); return !res ? await startAuthentication() : null})));
    };

    export async function initMusicKit(devToken: string, appName: string, buildVer: string) {
        await MusicKit.configure({
            developerToken: devToken,
            app: {
                name: appName,
                build: buildVer,
            },
        });
        
    }

    // export async function internalInit() {
    //     queue = new Array<MediaItem>();
    //     queuePosition = 0;
    // }

    //auth

    export async function startAuthentication() {
        return await MusicKit.getInstance().authorize();
    }

    export async function checkIfUserIsAuthorized() {
        return MusicKit.getInstance().isAuthorized;
    }
}