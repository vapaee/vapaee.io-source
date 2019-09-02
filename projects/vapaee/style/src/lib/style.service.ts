import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from "@angular/platform-browser";
import { CookieService } from 'ngx-cookie-service';


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

    constructor(
        @Inject(DOCUMENT) private doc,
        private cookies: CookieService
    ) {
        this.skins = [
            {
                "id": "skin-rain",
                "name": "Gray Rain",
                "url": "/assets/skins/skin-rain.css"
            },
            {
                "id": "skin-jungle",
                "name": "Jungle",
                "url": "/assets/skins/skin-jungle.css"
            },
            {
                "id": "skin-sky",
                "name": "Sky",
                "url": "/assets/skins/skin-sky.css"
            },
        ];

        this.createLinkForStylesheetURL("");
        this.setSkin(this.cookies.get("skin"));
    }

    get current() { return this._current; }

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

    private createLinkForStylesheetURL(url) {
        console.log("VapaeeStyle.createLinkForStylesheetURL()");
        this.link = this.doc.createElement('link');
        this.link.setAttribute('rel', 'stylesheet');
        this.doc.head.appendChild(this.link);
        this.link.setAttribute('href', url);
    }

    private async applySking(skin:Skin) {
        this._current = skin;
        this.cookies.set("skin", skin.id);
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
