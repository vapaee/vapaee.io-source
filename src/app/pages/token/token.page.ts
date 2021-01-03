import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { DropdownService } from 'src/app/services/dropdown.service';

import { VapaeeDEX, TokenDEX, TokenData, TokenEvent, AssetDEX } from '@vapaee/dex';
import { Feedback } from '@vapaee/feedback';

declare const twttr: any;
declare const gapi: any;


@Component({
    selector: 'token-page',
    templateUrl: './token.page.html',
    styleUrls: ['./token.page.scss', '../common.page.scss']
})
export class TokenPage implements OnInit, OnDestroy, AfterViewInit {

    token: TokenDEX;
    editing: boolean;
    newadmin: boolean;
    adminname: string;
    feed: Feedback;
    events: string[];
    editevent: TokenEvent;
    showactions: boolean;
    action: string;
    params: any;
    _safe_url_cache = {};
    
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public dex: VapaeeDEX,
        public route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        public dropdown: DropdownService,
        private http: HttpClient
    ) {
        
        var symbol = this.route.snapshot.paramMap.get('symbol');
        this.editing = !!this.app.getGlobal("edit-token");
        this.app.setGlobal("edit-token", false);
        this.feed = new Feedback();

        this.params = {}
        this.showactions = false;
        this.action = this.app.consumeGlobal("action");
        
        this.dex.waitTokenData.then(_ => {
            this.token = this.dex.getTokenNow(symbol.toUpperCase());
            if (this.token.brief == "") {
                this.token.brief = null;
            }
            for (let i in this.token.data) {
                if (this.token.data[i].category == "youtube") {
                    this.tryToExtractVideoLink(this.token.data[i]);
                    this.tryToExtractChannelId(this.token.data[i]);
                }
            }
            console.log("TokenPage() token: ", [this.token]);
            this.params.quantity = new AssetDEX(0, this.token);
            this.renderEntries();
        });
    }

    toggleActions() {
        this.showactions = !this.showactions;
        this.action = "transfer";
    }

    fetchTwitter(info: TokenData) {
        let clean_link = info.link.match(/^(https:\/\/twitter.com\/[^\/]*\/status\/\d*)/i);
        if (!clean_link) {
            clean_link = info.link.match(/^(https:\/\/twitter.com\/[^\/]*)/i);
        }

        if (clean_link) {
            var url = "https://publish.twitter.com/oembed?url="+clean_link[1];
            this.http.jsonp<any>(url, 'callback').toPromise().then(result => {
                info.html = result.html;

                info.extras = result.html.match(/https:\/\/twitter.com\/([^\?]*)/i);
                if (info.extras) {
                    info.extras = info.extras[1];
                }

                this.renderTweets(info, 1000);
                this.renderTweets(info, 2000);
                this.renderTweets(info, 5000);
            });
        } else {
            console.error("ERROR: No se pudo extraer un link linpio para twitter", info.link);
        }
    }


    renderTweets(info: TokenData, delay:number) {
        setTimeout(_ => {
            console.log("renderTweets("+delay+")", typeof twttr, [twttr, document.querySelector("a.twitter-timeline")]);
            
            if (twttr) {
                console.log(info.extras);
                twttr.widgets.createTimeline(
                    {
                      sourceType: "profile",
                      screenName: info?info.extras:""
                    },
                    document.querySelector("a.twitter-timeline")
                )

                twttr.widgets.load();
            }

        }, delay);
    }

    renderYoutube(info: TokenData, delay:number) {
        setTimeout(_ => {
            
            if (gapi) {                
                // Este código lo encontré en el final del archivo https://apis.google.com/js/platform.js
                // Es lo que hace que se renderice el widget
                gapi.load("", {
                    callback: window["gapi_onload"],
                    _c: {
                        "jsl": {
                            "ci": {
                                "deviceType": "desktop",
                                "oauth-flow": {
                                    "authUrl": "https://accounts.google.com/o/oauth2/auth",
                                    "proxyUrl": "https://accounts.google.com/o/oauth2/postmessageRelay",
                                    "disableOpt": true,
                                    "idpIframeUrl": "https://accounts.google.com/o/oauth2/iframe",
                                    "usegapi": false
                                },
                                "debug": {
                                    "reportExceptionRate": 0.05,
                                    "forceIm": false,
                                    "rethrowException": false,
                                    "host": "https://apis.google.com"
                                },
                                "enableMultilogin": true,
                                "googleapis.config": {
                                    "auth": {
                                        "useFirstPartyAuthV2": true
                                    }
                                },
                                "isPlusUser": false,
                                "inline": {
                                    "css": 1
                                },
                                "disableRealtimeCallback": false,
                                "drive_share": {
                                    "skipInitCommand": true
                                },
                                "csi": {
                                    "rate": 0.01
                                },
                                "client": {
                                    "cors": false
                                },
                                "isLoggedIn": true,
                                "signInDeprecation": {
                                    "rate": 0.0
                                },
                                "include_granted_scopes": true,
                                "llang": "es",
                                "iframes": {
                                    "youtube": {
                                        "params": {
                                            "location": ["search", "hash"]
                                        },
                                        "url": ":socialhost:/:session_prefix:_/widget/render/youtube?usegapi\u003d1",
                                        "methods": ["scroll", "openwindow"]
                                    },
                                    "ytsubscribe": {
                                        "url": "https://www.youtube.com/subscribe_embed?usegapi\u003d1"
                                    },
                                    "plus_circle": {
                                        "params": {
                                            "url": ""
                                        },
                                        "url": ":socialhost:/:session_prefix::se:_/widget/plus/circle?usegapi\u003d1"
                                    },
                                    "plus_share": {
                                        "params": {
                                            "url": ""
                                        },
                                        "url": ":socialhost:/:session_prefix::se:_/+1/sharebutton?plusShare\u003dtrue\u0026usegapi\u003d1"
                                    },
                                    "rbr_s": {
                                        "params": {
                                            "url": ""
                                        },
                                        "url": ":socialhost:/:session_prefix::se:_/widget/render/recobarsimplescroller"
                                    },
                                    ":source:": "3p",
                                    "playemm": {
                                        "url": "https://play.google.com/work/embedded/search?usegapi\u003d1\u0026usegapi\u003d1"
                                    },
                                    "savetoandroidpay": {
                                        "url": "https://pay.google.com/gp/v/widget/save"
                                    },
                                    "blogger": {
                                        "params": {
                                            "location": ["search", "hash"]
                                        },
                                        "url": ":socialhost:/:session_prefix:_/widget/render/blogger?usegapi\u003d1",
                                        "methods": ["scroll", "openwindow"]
                                    },
                                    "evwidget": {
                                        "params": {
                                            "url": ""
                                        },
                                        "url": ":socialhost:/:session_prefix:_/events/widget?usegapi\u003d1"
                                    },
                                    "partnersbadge": {
                                        "url": "https://www.gstatic.com/partners/badge/templates/badge.html?usegapi\u003d1"
                                    },
                                    "dataconnector": {
                                        "url": "https://dataconnector.corp.google.com/:session_prefix:ui/widgetview?usegapi\u003d1"
                                    },
                                    "surveyoptin": {
                                        "url": "https://www.google.com/shopping/customerreviews/optin?usegapi\u003d1"
                                    },
                                    ":socialhost:": "https://apis.google.com",
                                    "shortlists": {
                                        "url": ""
                                    },
                                    "hangout": {
                                        "url": "https://talkgadget.google.com/:session_prefix:talkgadget/_/widget"
                                    },
                                    "plus_followers": {
                                        "params": {
                                            "url": ""
                                        },
                                        "url": ":socialhost:/_/im/_/widget/render/plus/followers?usegapi\u003d1"
                                    },
                                    "post": {
                                        "params": {
                                            "url": ""
                                        },
                                        "url": ":socialhost:/:session_prefix::im_prefix:_/widget/render/post?usegapi\u003d1"
                                    },
                                    ":gplus_url:": "https://plus.google.com",
                                    "signin": {
                                        "params": {
                                            "url": ""
                                        },
                                        "url": ":socialhost:/:session_prefix:_/widget/render/signin?usegapi\u003d1",
                                        "methods": ["onauth"]
                                    },
                                    "rbr_i": {
                                        "params": {
                                            "url": ""
                                        },
                                        "url": ":socialhost:/:session_prefix::se:_/widget/render/recobarinvitation"
                                    },
                                    "share": {
                                        "url": ":socialhost:/:session_prefix::im_prefix:_/widget/render/share?usegapi\u003d1"
                                    },
                                    "plusone": {
                                        "params": {
                                            "count": "",
                                            "size": "",
                                            "url": ""
                                        },
                                        "url": ":socialhost:/:session_prefix::se:_/+1/fastbutton?usegapi\u003d1"
                                    },
                                    "comments": {
                                        "params": {
                                            "location": ["search", "hash"]
                                        },
                                        "url": ":socialhost:/:session_prefix:_/widget/render/comments?usegapi\u003d1",
                                        "methods": ["scroll", "openwindow"]
                                    },
                                    ":im_socialhost:": "https://plus.googleapis.com",
                                    "backdrop": {
                                        "url": "https://clients3.google.com/cast/chromecast/home/widget/backdrop?usegapi\u003d1"
                                    },
                                    "visibility": {
                                        "params": {
                                            "url": ""
                                        },
                                        "url": ":socialhost:/:session_prefix:_/widget/render/visibility?usegapi\u003d1"
                                    },
                                    "autocomplete": {
                                        "params": {
                                            "url": ""
                                        },
                                        "url": ":socialhost:/:session_prefix:_/widget/render/autocomplete"
                                    },
                                    "additnow": {
                                        "url": "https://apis.google.com/marketplace/button?usegapi\u003d1",
                                        "methods": ["launchurl"]
                                    },
                                    ":signuphost:": "https://plus.google.com",
                                    "ratingbadge": {
                                        "url": "https://www.google.com/shopping/customerreviews/badge?usegapi\u003d1"
                                    },
                                    "appcirclepicker": {
                                        "url": ":socialhost:/:session_prefix:_/widget/render/appcirclepicker"
                                    },
                                    "follow": {
                                        "url": ":socialhost:/:session_prefix:_/widget/render/follow?usegapi\u003d1"
                                    },
                                    "community": {
                                        "url": ":ctx_socialhost:/:session_prefix::im_prefix:_/widget/render/community?usegapi\u003d1"
                                    },
                                    "sharetoclassroom": {
                                        "url": "https://classroom.google.com/sharewidget?usegapi\u003d1"
                                    },
                                    "ytshare": {
                                        "params": {
                                            "url": ""
                                        },
                                        "url": ":socialhost:/:session_prefix:_/widget/render/ytshare?usegapi\u003d1"
                                    },
                                    "plus": {
                                        "url": ":socialhost:/:session_prefix:_/widget/render/badge?usegapi\u003d1"
                                    },
                                    "family_creation": {
                                        "params": {
                                            "url": ""
                                        },
                                        "url": "https://families.google.com/webcreation?usegapi\u003d1\u0026usegapi\u003d1"
                                    },
                                    "commentcount": {
                                        "url": ":socialhost:/:session_prefix:_/widget/render/commentcount?usegapi\u003d1"
                                    },
                                    "configurator": {
                                        "url": ":socialhost:/:session_prefix:_/plusbuttonconfigurator?usegapi\u003d1"
                                    },
                                    "zoomableimage": {
                                        "url": "https://ssl.gstatic.com/microscope/embed/"
                                    },
                                    "appfinder": {
                                        "url": "https://workspace.google.com/:session_prefix:marketplace/appfinder?usegapi\u003d1"
                                    },
                                    "savetowallet": {
                                        "url": "https://pay.google.com/gp/v/widget/save"
                                    },
                                    "person": {
                                        "url": ":socialhost:/:session_prefix:_/widget/render/person?usegapi\u003d1"
                                    },
                                    "savetodrive": {
                                        "url": "https://drive.google.com/savetodrivebutton?usegapi\u003d1",
                                        "methods": ["save"]
                                    },
                                    "page": {
                                        "url": ":socialhost:/:session_prefix:_/widget/render/page?usegapi\u003d1"
                                    },
                                    "card": {
                                        "url": ":socialhost:/:session_prefix:_/hovercard/card"
                                    }
                                }
                            },
                            "h": "m;/_/scs/apps-static/_/js/k\u003doz.gapi.es_419.MiJ6lPKnD-A.O/am\u003dwQE/d\u003d1/ct\u003dzgms/rs\u003dAGLTcCOA_u-Z8ez-QGrMiteP91CNWaWPiw/m\u003d__features__",
                            "u": "https://apis.google.com/js/platform.js",
                            "hee": true,
                            "fp": "821a251b140e4add32f87f4a7a08f044a59aa0e9",
                            "dpo": false
                        },
                        "platform": ["additnow", "backdrop", "blogger", "comments", "commentcount", "community", "donation", "family_creation", "follow", "hangout", "health", "page", "partnersbadge", "person", "playemm", "playreview", "plus", "plusone", "post", "ratingbadge", "savetoandroidpay", "savetodrive", "savetowallet", "sharetoclassroom", "shortlists", "signin2", "surveyoptin", "visibility", "youtube", "ytsubscribe", "zoomableimage"],
                        "fp": "821a251b140e4add32f87f4a7a08f044a59aa0e9",
                        "annotation": ["interactivepost", "recobar", "signin2", "autocomplete", "profile"],
                        "bimodal": ["signin", "share"]
                    }
                });

            }

        }, delay);
    }

    ngAfterViewInit () {
        this.renderTweets(null, 1000);
    }

    tradeToken(token:TokenDEX) {
        this.app.navigate('/exchange/trade/'+token.symbol.toLowerCase()+'.tlos');
    }

    ngOnDestroy() {
    }

    ngOnInit() {
    }

    renderEntries() {
        for (let i in this.token.data) {
            let info = this.token.data[i];
            if (info.category == "twitter") {
                this.fetchTwitter(info);
            }
            if (info.category == "youtube") {
                this.renderYoutube(info, 1000);
                this.renderYoutube(info, 2000);
                this.renderYoutube(info, 3000);  
                this.renderYoutube(info, 5000);
            }
        }        
    }


    tradeMarket(table:string) {
        this.app.navigate('/exchange/trade/'+table);
    }

    setAction(act:string) {
        switch (act) {
            case "transfer":
                this.params.from = this.dex.logged;
            case "issue":
            case "open":
                break;
            default:
                console.error("ERROR: token action unknown: ",act);
                return;
        }
        this.action = act;
    }

    perform() {
        this.feed.setLoading("perform", true);
        this.feed.clearError("perform");

        // aaaaaaaaaaaaaaaaa

        // this.feed.setLoading("perform", false);
        this.feed.clearError("perform");
    }

    tryToExtractChannelId(info:TokenData) {
        console.error(" ------------------> getChannelId()", info);
        var channel_id = null;
        var finalsrc:SafeResourceUrl = null;
        if(info.category == "youtube") {            
            // ----- https://www.youtube.com/channel/UCLGRZ0xSaBMIUmtn8wkPP3w
            var result = info.link.match(/channel\/(.*)$/);
            if (result) {
                channel_id = result[1];
                console.log( channel_id);
                info.extras = {type: "channel", channelid:channel_id};
            }
        }
    }

    tryToExtractVideoLink(info:TokenData) {
        this._safe_url_cache = this._safe_url_cache || {};
        var info_id = "id-"+info.id;
        
        if (this._safe_url_cache[info_id]) {
            return this._safe_url_cache[info_id];
        }
        if(info.category == "youtube") {
            var finalsrc:SafeResourceUrl = null;
            var link = "https://www.youtube.com/embed/";
            var video_id = null;
            var result = null;
            
            
            // ----- https://youtu.be/YSVJgKsSobA ------
            result = info.link.match(/https:\/\/youtu.be\/(.+)/);
            if (result && !finalsrc) {
                video_id = result[1];
                finalsrc = this.sanitizer.bypassSecurityTrustResourceUrl(link + video_id);
                this._safe_url_cache[info_id] = finalsrc;
                
            }
            // ----- https://www.youtube.com/watch?v=jhL1KyifGEs ------
            result = info.link.match(/\?v=([^&]+)$/);
            if (result && !finalsrc) {
                info.extras = "video";
                video_id = result[1];
                finalsrc = this.sanitizer.bypassSecurityTrustResourceUrl(link + video_id);
                this._safe_url_cache[info_id] = finalsrc;
               
            }
            // ----- https://www.youtube.com/watch?v=jhL1KyifGEs&list=PLIv5p7BTy5wxqwqs0fGyjtOahoO3YWX0x&index=1 ------
            result = info.link.match(/\?v=([^&]+)&.*/);
            if (result && !finalsrc) {
                info.extras = "video";
                video_id = result[1];
                finalsrc = this.sanitizer.bypassSecurityTrustResourceUrl(link + video_id);
                this._safe_url_cache[info_id] = finalsrc;
                
            }

            if (finalsrc) {
                info.extras = {type: "video", safelink:finalsrc};
            }

        }
    }

    // Token edition ----------------------------------------------------


    get exploreUrl() {
        if (this.token) return "https://telos.eosx.io/account/" + this.token.contract;
        return null;
    }
    get actionsUrl() {
        if (this.token) return "https://telos.eosx.io/tools/contract?contractAccount=" + this.token.contract;
        return null;
    }

    get lgicon() {
        if (!this.token) return "";
        if (this.token.icon) return this.token.icon;
        if (this.token.icon) return this.token.icon;
        return "/assets/logos/no-icon.png";
    }
    

    get hide_edit_btn(): boolean {
        if (this.dex.logged) {
            if (!this.editing) {
                if (this.token) {
                    if (this.token.admin == this.dex.logged) {
                        // console.log("TokenPage.hide_edit_btn() -> false");
                        return false;
                    }
                }
            }
        }
        // console.log("TokenPage.hide_edit_btn() -> true");
        return true;
    }

    get error() {
        return this.dex.feed.error("updatetoken");
    }

    clearError() {
        this.showerrors = false;
        this.dex.feed.clearError("updatetoken");
    }

    editToken() {
        console.log("TokenPage.editToken()");
        this.editing = true;
    }

    quitEditing() {
        console.log("TokenPage.quitEditing()");
        this.editing = false;
        this.renderEntries();
    }

    onTokenInfoChange() {
        console.log("TokenPage.onTokenInfoChange()");
    }

    showerrors: boolean;
    confirm() {
        this.clearError();
        if (!this.token.title || !this.token.brief) {
            this.showerrors = true;
            return;
        }
        this.token.icon = this.token.icon || "/assets/logos/no-icon.png";
        this.token.iconlg = this.token.iconlg || "/assets/logos/no-icon.png";
        this.token.banner = this.token.banner || "";
        this.token.website = this.token.website || "";
        this.dex.updatetoken(this.token).then(_ => {
            console.log("EXITO:", _);
            this.editing = false;
        }).catch(e => { console.error(e); });        
    }

    // Token Data Entries -----------------------
    changeAdmin() {
        this.feed.setLoading("new-admin", true);
        this.feed.clearError("new-admin");
        this.dex.tokenadmin(this.token, this.adminname).then(_ => {
            console.log("EXITO:", _);
            this.newadmin = false;
            this.feed.setLoading("new-admin", false);
            this.renderEntries();
            this.token.admin = this.adminname;
        }).catch(e => {
            console.error(e);
            this.feed.setLoading("new-admin", false);
            this.feed.setError("new-admin", typeof e == "string" ? e : JSON.stringify(e,null,4));
        });
    }

    confirmData(info:TokenData) {
        console.log("TokenPage.confirmData()", [info]);
        var action = "modify";
        info.symbol = this.token.symbol;
        if (info.id == -1) {
            action = "modify";
            action = "add";
            info.id = 0;
        }
        this.feed.setLoading("info-" + info.id, true);
        this.feed.clearError("info-" + info.id);
        this.dex.settokeninfo(action, info).then(_ => {
            console.log("EXITO:", _);
            info.editing = false;
            this.feed.setLoading("info-" + info.id, false);
            this.renderEntries();            
        }).catch(e => {
            console.error(e);
            this.feed.setLoading("info-" + info.id, false);
            this.feed.setError("info-" + info.id, typeof e == "string" ? e : JSON.stringify(e,null,4));
        });
    }

    removeData(info:TokenData) {
        console.log("TokenPage.removeData()", [info]);
        var action = "remove";
        info.symbol = this.token.symbol;
        this.feed.setLoading("info-" + info.id, true);
        this.feed.clearError("info-" + info.id);
        this.dex.settokeninfo(action, info).then(_ => {
            console.log("EXITO:", _);
            for (var i=0; i<this.token.data.length; i++) {
                if (this.token.data[i].id == info.id) {
                    this.token.data.splice(i, 1);
                }
            }
            this.feed.setLoading("info-" + info.id, false);
            this.renderEntries();            
        }).catch(e => {
            console.error(e);
            this.feed.setLoading("info-" + info.id, false);
            this.feed.setError("info-" + info.id, typeof e == "string" ? e : JSON.stringify(e,null,4));
        });
    }

    createDataEntry() {
        var entry: TokenData = {
            id:-1,
            category: "youtube",
            editing: true,
            symbol: this.token.symbol,
            link: "",
            text: "New Data Entry",
            date: new Date(),
        };

        var found = false;
        for (var i in this.token.data) {
            if (this.token.data[i].id == -1) {
                found = true;
                entry = this.token.data[i];
            }
        }
        if (!found) {
            this.token.data.push(entry);
        }
        
        setTimeout(_ => {
            entry.editing = true;
            window.document.getElementById("input-1").focus();
        }, 100);
    }

    // Token Events -----------------------

    editTokenEvent(evt:TokenEvent) {
        this.cancelTokenEvent();
        this.editevent = evt;
        this.editevent.editing = true;
        setTimeout(_ => {
            window.document.getElementById("new-event").focus();
        }, 100);        
    }

    cancelTokenEvent() {
        console.log("TokenPage.cancelTokenEvent()", [this.editevent]);
        if (this.editevent) {
            if (this.editevent.new) {
                for (var i=0; i<this.token.events.length; i++) {
                    if (this.token.events[i].event == this.editevent.event) {
                        this.token.events.splice(i, 1);
                    }
                }    
            }
            delete this.editevent.editing;    
        }
        this.editevent = null;
    }

    confirmEvent(evt:TokenEvent) {
        console.log("TokenPage.confirmEvent()", [evt]);
        var action = "modify";
        if (evt.new) action = "add";
        var feedid = "event-save";
        this.feed.setLoading(feedid, true);
        this.feed.clearError("event");
        this.dex.edittkevent(action, this.token.symbol, evt).then(_ => {
            console.log("EXITO:", _);
            delete evt.editing;
            delete evt.new;
            delete this.editevent;
            this.feed.setLoading(feedid, false);
        }).catch(e => {
            console.error(e);
            this.feed.setLoading(feedid, false);
            this.feed.setError("event", typeof e == "string" ? e : JSON.stringify(e,null,4));
        });
    }

    removeEvent(evt:TokenEvent) {
        console.log("TokenPage.removeEvent()", [evt]);
        var feedid = "event-remove";
        this.feed.setLoading(feedid, true);
        this.feed.clearError("event");
        this.dex.edittkevent("remove", this.token.symbol, evt).then(_ => {
            console.log("EXITO:", _);
            for (var i=0; i<this.token.events.length; i++) {
                if (this.token.events[i].event == evt.event) {
                    this.token.events.splice(i, 1);
                }
            }
            this.editevent = null;
            this.feed.setLoading(feedid, false);
        }).catch(e => {
            console.error(e);
            this.feed.setLoading(feedid, false);
            this.feed.setError("event", typeof e == "string" ? e : JSON.stringify(e,null,4));
        });
    }

    createTokenEvent() {
        this.cancelTokenEvent();
        this.events = ["cancel", "deal", "deposit", "order", "swapdeposit", "withdraw"];
        for (var i in this.token.events) {
            var event = this.token.events[i].event;
            this.events = this.events.filter(e => e != event);
        }

        this.editevent = {
            new: true,
            editing: true,
            receptor: "",
            event: this.events[0]
        };

        this.token.events.push(this.editevent);

        setTimeout(_ => {
            window.document.getElementById("new-event").focus();
        }, 100);
    }

    debug() {
        console.log(this.token);
        this.renderEntries();
    }

}
