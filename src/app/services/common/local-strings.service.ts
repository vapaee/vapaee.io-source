import { Injectable } from '@angular/core';
import { LocalList, Locals, LocalString } from './datatypes.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ILocalStorage, LocalStorageStub } from '@vapaee/core';

declare var navigator:any;

export interface StringMap {[key:string]: string};

@Injectable()
export class LocalStringsService  {
    storage: ILocalStorage = new LocalStorageStub();
    public onLocalReady: Observable<boolean> = new Subject<boolean>();
    public string: LocalString;
    list:LocalList;
    locals:Locals;
    localKey:string;
    public onLocalChange:Subject<string> = new Subject();

    constructor(
        private http: HttpClient
    ) {
        this.string = {};
        this.locals = {};
        this.list = [];
        this.localKey = "";

        this.fetchLocalsList();
    }

    init(storage: ILocalStorage): Observable<boolean> {
        this.storage = storage;
        this.load();
        return this.onLocalReady;
    }

    load() {
        let userLang = navigator.language || navigator.userLanguage;
        if (!this.storage) return;
        this.storage.get("locals").subscribe((cached:string) => {
            let localKey = "";
            if (cached) {
                localKey = cached;
            } else {
                switch (userLang.substr(0,2)) {
                    case "en":
                        localKey = "en_US";
                        break;
                    default:
                        localKey = "es_ES";
                }    
            }
            this.setLocal(localKey).subscribe(() => {
                let _onLocalReady: Subject<boolean> = <Subject<boolean>>this.onLocalReady;
                this.onLocalReady = new BehaviorSubject<boolean>(true);
                _onLocalReady.next(true);
            });
        });
    }
    
    fetchLocalsList() {
        return this.http.get<LocalList>("assets/locals/list.json").subscribe((response) => {
            this.list = response;
        });
    }

    fetchLocals(localKey:string): Observable<void>  {
        console.log("LocalStringsService.fetchLocals()", localKey);
        let obs = new Observable<void>(subscriber => {
            this.http.get<any>("assets/locals/" + localKey + ".json").subscribe(response => {
                // console.log("AAAAAAAAAAAAAAAAAAAAAAAAA", response);
                this.string = response;
                this.locals[this.localKey] = this.string;
                subscriber.next();                
            });
        });
        return obs;
    }

    setLocal(localKey:string): Observable<string> {
        console.log("LocalStringsService.setLocal()", localKey, this.localKey);
        let obs = new Observable<string>(subscriber => {
            if (this.localKey != localKey) {
                this.localKey = localKey;
                if (this.storage) this.storage.set("locals", this.localKey);
                this.fetchLocals(this.localKey).subscribe(() => {
                    this.onLocalChange.next(this.localKey);
                    subscriber.next(this.localKey);
                    subscriber.complete(); 
                });
            } else {
                subscriber.next(this.localKey);
                subscriber.complete(); 
            }
             
        });
        obs.subscribe(() => {
            // dummie code to force execution;
        });
        return obs;
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

    toCappitalCase(str:string) {
        if(!str) return "";
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();})
    }

    toSentenceCase(str:string) {
        if(!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    

}