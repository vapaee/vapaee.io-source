import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Locals, LocalString } from './datatypes.service';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscriber } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

declare var navigator:any;

export interface StringMap {[key:string]: string};

@Injectable()
export class LocalStringsService  {
    public waitReady:Promise<any>;
    public string: LocalString;
    locals:Locals;
    localKey:string;
    public onLocalChange:Subject<string> = new Subject();

    constructor(
        private http: HttpClient,
        public cookie: CookieService
    ) {
        this.string = {};
        this.locals = {};

        var userLang = navigator.language || navigator.userLanguage;
        var cached = this.cookie.get("locals");
        if (cached) {
            this.localKey = cached;
        } else {
            switch (userLang.substr(0,2)) {
                case "es":
                    this.localKey = "es_ES";
                    break;
                default:
                    this.localKey = "en_US";
            }    
        }
        this.waitReady = this.fetchLocals(this.localKey);
    }

    async fetchLocals(localKey:string) {
        return this.http.get<any>("assets/locals/" + localKey + ".json").toPromise().then((response) => {
            this.string = response;
            this.locals[this.localKey] = this.string;
        });
    }

    async setLocal(localKey:string) {
        if (this.localKey != localKey) {
            this.localKey = localKey;
            this.cookie.set("locals", this.localKey);
            return this.fetchLocals(this.localKey).then(_ => {
                this.onLocalChange.next(this.localKey);
                return this.localKey;
            });
        }
    }

    merge(template:string, data:StringMap) {
        if(!template) return "";
        if(!data) return template;
        var str = template;
        for (var prop in data) {
            var key = "{{" + prop + "}}";
            str = str.split(key).join(data[prop]);
        }
        return str;
    }

}