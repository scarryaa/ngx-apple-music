import { Observable } from "rxjs";
import * as i0 from "@angular/core";
export declare abstract class Store<T> {
    private _state;
    constructor(initialState: T);
    get state$(): Observable<T>;
    get state(): T;
    setState<K extends keyof T, E extends Partial<Pick<T, K>>>(fn: (state: T) => E): void;
    select<K>(selector: (state: T) => K): Observable<K>;
    static ɵfac: i0.ɵɵFactoryDeclaration<Store<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Store<any>>;
}
