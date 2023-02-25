import { Injectable } from '@angular/core';
import { MusicKitWrapper } from './music-kit-wrapper';
import * as i0 from "@angular/core";
export class PlaybackService {
    constructor() { }
    async play() {
        MusicKitWrapper.play();
    }
    async getUserPlaylists() {
        await MusicKitWrapper.getUserPlaylists();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWJhY2suc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1hcHBsZS1tdXNpYy9zcmMvbGliL3NlcnZpY2VzL3BsYXliYWNrLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBS3RELE1BQU0sT0FBTyxlQUFlO0lBRTFCLGdCQUFnQixDQUFDO0lBRWpCLEtBQUssQ0FBQyxJQUFJO1FBQ1IsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxLQUFLLENBQUMsZ0JBQWdCO1FBQ3BCLE1BQU0sZUFBZSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDM0MsQ0FBQzs7NEdBVlUsZUFBZTtnSEFBZixlQUFlLGNBRmQsTUFBTTsyRkFFUCxlQUFlO2tCQUgzQixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE11c2ljS2l0V3JhcHBlciB9IGZyb20gJy4vbXVzaWMta2l0LXdyYXBwZXInO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBQbGF5YmFja1NlcnZpY2Uge1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgYXN5bmMgcGxheSgpIHtcbiAgICBNdXNpY0tpdFdyYXBwZXIucGxheSgpO1xuICB9XG5cbiAgYXN5bmMgZ2V0VXNlclBsYXlsaXN0cygpIHtcbiAgICBhd2FpdCBNdXNpY0tpdFdyYXBwZXIuZ2V0VXNlclBsYXlsaXN0cygpO1xuICB9XG59XG4iXX0=