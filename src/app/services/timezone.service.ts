import { Injectable } from '@angular/core';

@Injectable()
export class TimezoneService {

    private offset: number;
    private map: {[key:string]: Date};

    constructor(
        
    ) {
        this.map = {};
        try {
            var aux = new Date().toString().match(/([-\+][0-9]+)\s/)[1];
            var hh = parseInt(aux.substr(0, aux.length-2));
            var mm = parseInt(aux.substr(-2));
            var mult = 1;
            if (hh<0) {
                mult = -1;
                hh = -hh;
            }
            this.offset = mult * ((hh * 60) + mm) * 60000;
        } catch (e) {
            console.error("ERROR: something happened when trying to get the local timezone", e);
        }        
    }


    toLocal(d:Date | string) {
        var id = d.toString();
        if (!this.map[id]) {
            if (typeof d == "string") {
                d = new Date(d);
            }
            var time = d.getTime();
            var local = new Date();
            local.setTime(time + this.offset);
            this.map[id] = local;
            // console.log(local);
        }
        return this.map[id];
    }

}

