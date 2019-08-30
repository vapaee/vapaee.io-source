import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from "@angular/platform-browser";


export interface Skin {
    id:string;
    name:string;
    url:string;
}

@Injectable({
    providedIn: 'root'
})
export class VapaeeStyle {

    private link: HTMLLinkElement;
    public skins: Skin[];
    private _current: Skin = {id:null, name:null, url:null};

    constructor(@Inject(DOCUMENT) private doc) {
        this.skins = [
            {
                "id": "skin-1",
                "name": "Skin 1",
                "url": "http://localhost:4200/assets/skins/skin-1.css"
            },
            {
                "id": "skin-2",
                "name": "Skin 2",
                "url": "http://localhost:4200/assets/skins/skin-2.css"
            },
            {
                "id": "skin-3",
                "name": "Skin 3",
                "url": "http://localhost:4200/assets/skins/skin-3.css"
            },
        ];

        this.createLinkForStylesheetURL("");
    }

    get current() { return this._current; }

    private createLinkForStylesheetURL(url) {
        this.link = this.doc.createElement('link');
        this.link.setAttribute('rel', 'stylesheet');
        this.doc.head.appendChild(this.link);
        this.link.setAttribute('href', url);
    }

    setSkin(skinid:string) {
        if (this._current.id != skinid) {
            for (let i in this.skins) {
                let skin: Skin = this.skins[i];
                if (skin.id == skinid) {
                    this.applySking(skin);
                    break;
                }
            }
        }
    }

    private async applySking(skin:Skin) {
        this._current = skin;
        console.log("VapaeeStyle.applySking()",skin);
        await this.takeOutCurrentStyle();
        await this.applyStyle(skin);
    }

    private async takeOutCurrentStyle() {
        console.log("VapaeeStyle.applyStyle()",this.current);
    }

    private async applyStyle(skin:Skin) {
        console.log("VapaeeStyle.applyStyle()",skin);
        this.link.setAttribute('href', skin.url);   
    }
}
