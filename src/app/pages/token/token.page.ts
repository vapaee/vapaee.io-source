import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { DropdownService } from 'src/app/services/dropdown.service';

import { VapaeeDEX, TokenDEX, TokenData, TokenEvent, AssetDEX } from 'projects/vapaee/dex';
import { Feedback } from 'projects/vapaee/feedback';

declare const twttr: any;


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
        var url = "https://publish.twitter.com/oembed?&url="+info.link;
        this.http.jsonp<any>(url, 'callback').toPromise().then(result => {
            info.html = result.html;
            this.renderTweets(1000);
            this.renderTweets(2000);
            this.renderTweets(5000);
            this.renderTweets(10000);
            this.renderTweets(15000);
            this.renderTweets(20000);
        });
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
        }        
    }

    renderTweets(delay) {
        setTimeout(_ => {
            console.log("renderTweets("+delay+")", typeof twttr);
            twttr?twttr.widgets.load():null;
        }, delay);
    }

    ngAfterViewInit () {
        this.renderTweets(1000);
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

    getEmbedLink(info:TokenData) {
        this._safe_url_cache = this._safe_url_cache || {};
        var info_id = "id-"+info.id;
        if (this._safe_url_cache[info_id]) {
            return this._safe_url_cache[info_id];
        }
        if(info.category == "youtube") {
            var finalsrc:SafeResourceUrl = null;
            var link = "https://www.youtube.com/embed/";
            var video_id = null;
            // ----- https://youtu.be/YSVJgKsSobA ------
            var result = info.link.match(/https:\/\/youtu.be\/(.+)/);
            if (result) {
                video_id = result[1];
                finalsrc = this.sanitizer.bypassSecurityTrustResourceUrl(link + video_id);
                this._safe_url_cache[info_id] = finalsrc;
                return finalsrc;
            }
            // ----- https://www.youtube.com/watch?v=jhL1KyifGEs ------
            var result = info.link.match(/\?v=([^&]+)$/);
            if (result) {
                video_id = result[1];
                finalsrc = this.sanitizer.bypassSecurityTrustResourceUrl(link + video_id);
                this._safe_url_cache[info_id] = finalsrc;
                return finalsrc;
            }
            // ----- https://www.youtube.com/watch?v=jhL1KyifGEs&list=PLIv5p7BTy5wxqwqs0fGyjtOahoO3YWX0x&index=1 ------
            var result = info.link.match(/\?v=([^&]+)&.*/);
            if (result) {
                video_id = result[1];
                finalsrc = this.sanitizer.bypassSecurityTrustResourceUrl(link + video_id);
                this._safe_url_cache[info_id] = finalsrc;
                return finalsrc;
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


}
