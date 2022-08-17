import { Injectable } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

@Injectable()
export class DropdownService {

    private _map:{[key:string]:boolean}
    constructor(
        
    ) {
        this._map = {};
    }

    isOpen(menuid:string) {
        return this._map[menuid] == true;
    }

    close() {
        console.debug("DropdownService.close()");
        for (let i in this._map) {
            this._map[i] = false;
        }
        this.stopListeningMouse();
    }

    drop(menuid:string) {
        console.debug("DropdownService.drop('"+menuid+"')");
        let state = !this._map[menuid];
        this.close();
        this._map[menuid] = state;
        this.startListeningMouse();
    }

    // if the mouse clicks outside the dropdown, close it
    private _listeningMouse:boolean = false;
    subscription: Subscription | null = null;
    private startListeningMouse() {
        console.debug("DropdownService.startListeningMouse()");
        if (this.subscription) return;
        this.subscription = fromEvent(document, 'click').subscribe(this.onClickOutside.bind(this));
    }

    private stopListeningMouse() {
        console.debug("DropdownService.stopListeningMouse()");
        if (!this.subscription) return;
        this.subscription.unsubscribe();
        this.subscription = null;
    }

    private onClickOutside(e:Event) {
        let target = e.target as HTMLElement;
        let dropdown = target.closest('.dropdown');
        console.debug("DropdownService.onClickOutside()", [target, dropdown]);
        if (!dropdown) {
            this.close();
        }
    }

}

