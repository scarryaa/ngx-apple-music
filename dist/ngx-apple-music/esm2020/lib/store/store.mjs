import { Injectable, Inject } from "@angular/core";
import { BehaviorSubject, map, distinctUntilChanged } from "rxjs";
import * as i0 from "@angular/core";
export class Store {
    constructor(initialState) {
        this._state = new BehaviorSubject(initialState);
    }
    get state$() {
        return this._state.asObservable();
    }
    get state() {
        return this._state.getValue();
    }
    setState(fn) {
        const state = fn(this.state);
        this._state.next({ ...this.state, ...state });
    }
    select(selector) {
        return this.state$.pipe(map(selector), distinctUntilChanged());
    }
}
Store.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Store, deps: [{ token: '' }], target: i0.ɵɵFactoryTarget.Injectable });
Store.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Store, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Store, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: ['']
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtYXBwbGUtbXVzaWMvc3JjL2xpYi9zdG9yZS9zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsZUFBZSxFQUFjLEdBQUcsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFHOUUsTUFBTSxPQUFnQixLQUFLO0lBR3pCLFlBQXdCLFlBQWU7UUFDckMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBSSxZQUFZLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELFFBQVEsQ0FDTixFQUFtQjtRQUVuQixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsTUFBTSxDQUFJLFFBQXlCO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQztJQUNqRSxDQUFDOztrR0F4Qm1CLEtBQUssa0JBR0wsRUFBRTtzR0FIRixLQUFLLGNBREQsTUFBTTsyRkFDVixLQUFLO2tCQUQxQixVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7MEJBSW5CLE1BQU07MkJBQUMsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgbWFwLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCB9IGZyb20gXCJyeGpzXCI7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3RvcmU8VD4ge1xyXG4gIHByaXZhdGUgX3N0YXRlOiBCZWhhdmlvclN1YmplY3Q8VD47XHJcblxyXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoJycpIGluaXRpYWxTdGF0ZTogVCkge1xyXG4gICAgdGhpcy5fc3RhdGUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFQ+KGluaXRpYWxTdGF0ZSk7XHJcbiAgfVxyXG5cclxuICBnZXQgc3RhdGUkKCk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHN0YXRlKCk6IFQge1xyXG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlLmdldFZhbHVlKCk7XHJcbiAgfVxyXG5cclxuICBzZXRTdGF0ZTxLIGV4dGVuZHMga2V5b2YgVCwgRSBleHRlbmRzIFBhcnRpYWw8UGljazxULCBLPj4+KFxyXG4gICAgZm46IChzdGF0ZTogVCkgPT4gRVxyXG4gICk6IHZvaWQge1xyXG4gICAgY29uc3Qgc3RhdGUgPSBmbih0aGlzLnN0YXRlKTtcclxuICAgIHRoaXMuX3N0YXRlLm5leHQoeyAuLi50aGlzLnN0YXRlLCAuLi5zdGF0ZSB9KTtcclxuICB9XHJcblxyXG4gIHNlbGVjdDxLPihzZWxlY3RvcjogKHN0YXRlOiBUKSA9PiBLKTogT2JzZXJ2YWJsZTxLPiB7XHJcbiAgICByZXR1cm4gdGhpcy5zdGF0ZSQucGlwZShtYXAoc2VsZWN0b3IpLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKTtcclxuICB9XHJcbn0iXX0=