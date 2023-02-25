import { Injectable } from '@angular/core';
import { MusicKitWrapper } from './music-kit-wrapper';
import * as i0 from "@angular/core";
export class AuthenticationService {
    constructor() { }
    async checkIfUserAuthorized() {
        var authorized = await MusicKitWrapper.checkIfUserIsAuthorized();
        if (authorized)
            return true;
        else
            return this.authorizeUser();
    }
    async authorizeUser() {
        return await MusicKitWrapper.startAuthentication();
    }
}
AuthenticationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: AuthenticationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
AuthenticationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: AuthenticationService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: AuthenticationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aGVudGljYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1hcHBsZS1tdXNpYy9zcmMvbGliL3NlcnZpY2VzL2F1dGhlbnRpY2F0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBS3RELE1BQU0sT0FBTyxxQkFBcUI7SUFFaEMsZ0JBQWdCLENBQUM7SUFFakIsS0FBSyxDQUFDLHFCQUFxQjtRQUN2QixJQUFJLFVBQVUsR0FBRyxNQUFNLGVBQWUsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQ2pFLElBQUksVUFBVTtZQUFFLE9BQU8sSUFBSSxDQUFDOztZQUN2QixPQUFPLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWE7UUFDakIsT0FBTyxNQUFNLGVBQWUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQ3JELENBQUM7O2tIQVpVLHFCQUFxQjtzSEFBckIscUJBQXFCLGNBRnBCLE1BQU07MkZBRVAscUJBQXFCO2tCQUhqQyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE11c2ljS2l0V3JhcHBlciB9IGZyb20gJy4vbXVzaWMta2l0LXdyYXBwZXInO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBBdXRoZW50aWNhdGlvblNlcnZpY2Uge1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgYXN5bmMgY2hlY2tJZlVzZXJBdXRob3JpemVkKCkge1xuICAgICAgdmFyIGF1dGhvcml6ZWQgPSBhd2FpdCBNdXNpY0tpdFdyYXBwZXIuY2hlY2tJZlVzZXJJc0F1dGhvcml6ZWQoKTtcbiAgICAgIGlmIChhdXRob3JpemVkKSByZXR1cm4gdHJ1ZTtcbiAgICAgIGVsc2UgcmV0dXJuIHRoaXMuYXV0aG9yaXplVXNlcigpO1xuICB9XG5cbiAgYXN5bmMgYXV0aG9yaXplVXNlcigpIHtcbiAgICByZXR1cm4gYXdhaXQgTXVzaWNLaXRXcmFwcGVyLnN0YXJ0QXV0aGVudGljYXRpb24oKTtcbiAgfVxufVxuIl19