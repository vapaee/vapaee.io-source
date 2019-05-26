import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ScatterService } from './scatter.service';
import BigNumber from "bignumber.js";
import Eos from 'eosjs';
import { Profile, Utils, SlugId } from './utils.service';

export interface AuthorsCache {
    [key:string]:Profile;
}

@Injectable()
export class BGBoxService {

    authors: AuthorsCache;
    public contract:string;
    boardgamebox:string = "boardgamebox";
    vapaeetokens:string = "vapaeetokens";

    public onEvent:Subject<any> = new Subject();
    private setReady: Function;
    public waitReady: Promise<any> = new Promise((resolve) => {
        this.setReady = resolve;
    });
    private setConnected: Function;
    public waitConnected: Promise<any> = new Promise((resolve) => {
        this.setConnected = resolve;
    });
    private setEosjs: Function;
    public waitEosjs: Promise<any> = new Promise((resolve) => {
        this.setEosjs = resolve;
    });
    private setEndpoints: Function;
    public waitEndpoints: Promise<any> = new Promise((resolve) => {
        this.setEndpoints = resolve;
    });    
    
    public utils: Utils;
    constructor(private scatter: ScatterService) {
        this.contract = this.boardgamebox;
        this.authors = {};
        this.utils = new Utils(this.contract, this.scatter);
    }

    decodeSlug(nick:{top:string,low:string,str?:string}) {
        return this.utils.decodeSlug(nick);
    }

    // auxiliar functions -------------------------------------------

    // --------------------------------------------------------------
    // API
    getAuthors() {
        console.log("BGBoxService.getAuthors()");

        return Promise.all<any>([
            this.utils.getTable("authors"),
            this.utils.getTable("profiles"),
            this.utils.getTable("apps"),
        ]).then(result => {
            
            var data = {
                map:{},
                authors:result[0].rows,
                profiles:result[1].rows,
                apps:result[2].rows,
            };

            for (var i in data.authors) {
                data.authors[i].slugid = this.decodeSlug(data.authors[i].slugid);
                var key = "id-" + data.authors[i].id
                data.map[key] = Object.assign({}, data.authors[i]);
                data.authors[i] = data.map[key];
            }

            for (var i in data.profiles) {
                Object.assign(data.map["id-" + data.profiles[i].id], data.profiles[i]);
                data.profiles[i] = data.map["id-" + data.profiles[i].id];
            }

            for (var i in data.apps) {
                Object.assign(data.map["id-" + data.apps[i].id], data.apps[i]);
                data.apps[i] = data.map["id-" + data.apps[i].id];
            }

            for (var i in data.authors) {
                var key = "id-" + data.authors[i].id
                this.authors[data.map[key].slugid.str] = data.map[key];
            }

            console.log("getAuthors() ----------> ", result, data);
            return data;
        });

    }

    getAuthorsFor(account: string) {
        console.log("BGBoxService.getAuthorsFor()", account);
        return new Promise<any>((resolve, reject) => {
            // https://eosio.stackexchange.com/questions/813/eosjs-gettablerows-lower-and-upper-bound-on-account-name
            var encodedName = new BigNumber(Eos.modules.format.encodeName(account, false))
            var params = {
                lower_bound: encodedName.toString(), 
                upper_bound: encodedName.plus(1).toString(), 
                limit: 25, 
                key_type: "i64",
                index_position: "2"
            }
            // console.log("---------------------------------------------");
            // console.log("BGBoxService.getAuthorsFor() params ", params);

            this.utils.getTable("authors", params).then(result => {
                // console.log("BGBoxService.getAuthorsFor() --> ", result.rows);
                var data = {map:{},authors:result.rows,profiles:[]};
                var promises:Promise<any>[] = [];
                for (var i in result.rows) {
                    var author = result.rows[i];
                    author.slugid = this.decodeSlug(author.slugid);

                    data.map["id-"+author.id] = author;
                    var id_p1 = new BigNumber(author.id).plus(1);
                    var i_params = {lower_bound:author.id ,upper_bound: author.id};
                    var promise = this.utils.getTable("profiles", i_params).then(i_result => {
                        // console.log("BGBoxService.getAuthorsFor() --> ", i_result.rows);
                        if (i_result.rows.length == 1) {
                            var profile = i_result.rows[0];
                            var key = "id-"+profile.id;
                            data.map[key] = Object.assign(
                                data.map[key],
                                profile
                            );
                            data.profiles.push(data.map[key]);
                            this.authors[data.map[key].slugid.str] = data.map[key];
                        }
                    });
                    promises.push(promise);
                }

                Promise.all(promises).then(() => {
                    // console.log("BGBoxService.getAuthorsFor() [", account, "] --> ",data);
                    // console.log("data: ", data);
                    // console.log("---------------------------------------------");
                    resolve(data);
                }).catch(err => {
                    console.error("ERROR: ", err);
                    reject(err);
                })
                
            });
        });
    }

    getAuthorBySlug(slugid: string) {
        console.log("BGBoxService.getAuthorBySlug()", slugid);
        if (this.authors[slugid]) return Promise.resolve(this.authors[slugid]);

        return new Promise<any>((resolve, reject) => {
            var author = null;
            
            var slug: SlugId = this.utils.encodeSlug(slugid);
            console.log("---> ", [slug]);
            var big = this.utils.slugTo128bits(slug);
            console.log("---> ", [big.toString()]);
            
            var params = {
                lower_bound: big, 
                upper_bound: big, 
                limit: 1, 
                key_type: "i128",
                index_position: "3"
            }

            this.utils.getTable("authors", params).then(result => {
                // console.log("BGBoxService.getAuthorsFor() --> ", result.rows);
                var data = {map:{},authors:result.rows,profiles:[]};
                
                var promises:Promise<any>[] = [];
                for (var i in result.rows) {
                    var author = result.rows[i];
                    author.slugid = this.decodeSlug(author.slugid);

                    data.map["id-"+author.id] = author;
                    var id_p1 = new BigNumber(author.id).plus(1);
                    var i_params = {lower_bound:author.id ,upper_bound: author.id};
                    var promise = this.utils.getTable("profiles", i_params).then(i_result => {
                        // console.log("BGBoxService.getAuthorsFor() --> ", i_result.rows);
                        
                        if (i_result.rows.length == 1) {
                            var profile = i_result.rows[0];
                            data.map["id-"+profile.id] = Object.assign(
                                data.map["id-"+profile.id],
                                profile
                            );
                            data.profiles.push(data.map["id-"+profile.id]);                                
                        }
                    });
                    promises.push(promise);
                }

                Promise.all(promises).then(() => {
                    // console.log("data: ", data);
                    console.log("---------------------------------------------", data.authors[0]);
                    resolve(data.authors[0]);
                }).catch(err => {
                    console.error("ERROR: ", err);
                    reject(err);
                })
                
            });

            
        });
    }    

    registerProfile(owner:string, slugid:string, name:string) {
        console.log("BGBoxService.registerProfile()", owner, slugid, name);
        return this.utils.excecute("newprofile", {owner:owner, slugid:slugid, name:name})
    }

    registerApp(owner:string, contract:string, slugid:string, title:string, inventory:number) {
        console.log("BGBoxService.registerApp()", owner, contract, slugid, title, inventory);
        return this.utils.excecute("newapp", {
            owner:  owner,
            contract: contract,
            slugid: slugid,
            title: title,
            inventory: inventory
        });
    }

    signUpProfileForApp(owner, profileid, appid, rampayer) {
        console.log("BGBoxService.signUpProfileForApp()", owner, profileid, appid, rampayer);
        return this.utils.excecute("profile4app", {owner:owner, profile: profileid, app:appid, ram_payer:rampayer})
    }

    getProfileContainers(profileid, appid) {
        console.log("BGBoxService.getProfileContainers() profileid: ", profileid, "appid:", appid);

        return Promise.all<any>([
            // all containers for this profile
            this.utils.getTable("containers", {
                scope:profileid, 
                limit:50
            }),
            // all container assets that were registered by the app (and not by another profile/user)
            this.utils.getTable("contasset", {
                lower_bound: appid, 
                upper_bound: appid,
                key_type: "i64",
                index_position: "3" // by publisher
            })
        ]).then(result => {
            var data = {
                containers: result[0].rows,
                app_containers:  result[1].rows
            };

            var map = {}; 

            for (var i in data.app_containers) {
                map["id-"+data.app_containers[i].id] = data.app_containers[i];
            }

            for (var i in data.containers) {
                var asset = map["id-"+data.containers[i].asset];
                if (asset) {
                    data.containers[i].asset_ref = asset;
                }
            }

            // console.log("getProfileContainers() ----------> ", result, data);
            return data;
        });
    }

    // -------------------------
    droptables() {
        console.log("BGBoxService.droptables()");
        return this.utils.excecute("droptables", {});
    }
    

    
}
