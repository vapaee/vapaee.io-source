import { Injectable } from '@angular/core';

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
        for (let i in this._map) {
            this._map[i] = false;
        }
    }

    drop(menuid:string) {
        let state = !this._map[menuid];
        this.close();
        this._map[menuid] = state;
    }

}

