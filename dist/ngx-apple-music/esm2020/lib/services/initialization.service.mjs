import { Injectable } from '@angular/core';
import { MusicKitWrapper } from './music-kit-wrapper';
import * as i0 from "@angular/core";
export class InitializationService {
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
export function initProvider(provider, devToken, appName, buildVer) {
    return () => provider.initMusicKit(devToken, appName, buildVer);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdGlhbGl6YXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1hcHBsZS1tdXNpYy9zcmMvbGliL3NlcnZpY2VzL2luaXRpYWxpemF0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBS3RELE1BQU0sT0FBTyxxQkFBcUI7SUFFaEMsZ0JBQWdCLENBQUM7SUFFakIsWUFBWSxDQUFDLFFBQWdCLEVBQUUsT0FBZSxFQUFFLFFBQWdCO1FBQzlELE9BQU8sZUFBZSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDMUUsQ0FBQzs7a0hBTlkscUJBQXFCO3NIQUFyQixxQkFBcUIsY0FGcEIsTUFBTTsyRkFFUCxxQkFBcUI7a0JBSGpDLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COztBQVVELE1BQU0sVUFBVSxZQUFZLENBQUMsUUFBK0IsRUFBRSxRQUFnQixFQUFFLE9BQWUsRUFBRSxRQUFnQjtJQUMvRyxPQUFPLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNsRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTXVzaWNLaXRXcmFwcGVyIH0gZnJvbSAnLi9tdXNpYy1raXQtd3JhcHBlcic7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEluaXRpYWxpemF0aW9uU2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICBpbml0TXVzaWNLaXQoZGV2VG9rZW46IHN0cmluZywgYXBwTmFtZTogc3RyaW5nLCBidWlsZFZlcjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIE11c2ljS2l0V3JhcHBlci5jb25maWd1cmVNdXNpY0tpdChkZXZUb2tlbiwgYXBwTmFtZSwgYnVpbGRWZXIpO1xufVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdFByb3ZpZGVyKHByb3ZpZGVyOiBJbml0aWFsaXphdGlvblNlcnZpY2UsIGRldlRva2VuOiBzdHJpbmcsIGFwcE5hbWU6IHN0cmluZywgYnVpbGRWZXI6IHN0cmluZykge1xuICByZXR1cm4gKCkgPT4gcHJvdmlkZXIuaW5pdE11c2ljS2l0KGRldlRva2VuLCBhcHBOYW1lLCBidWlsZFZlcik7XG59Il19