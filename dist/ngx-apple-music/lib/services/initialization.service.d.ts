import * as i0 from "@angular/core";
export declare class InitializationService {
    constructor();
    initMusicKit(devToken: string, appName: string, buildVer: string): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<InitializationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<InitializationService>;
}
export declare function initProvider(provider: InitializationService, devToken: string, appName: string, buildVer: string): () => Promise<void>;
