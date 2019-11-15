import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VapaeeDEX } from 'projects/vapaee/dex/src';
import { CookieService } from 'ngx-cookie-service';
import { Subscriber } from 'rxjs';
import { SmartContract, VapaeeScatter } from '@vapaee/scatter';
import { Feedback } from '@vapaee/feedback';

@Component({
    selector: 'vpe-wp-page',
    templateUrl: './wp.page.html',
    styleUrls: ['./wp.page.scss']
})
export class WPPage implements OnInit, OnDestroy {

    public new_version: boolean;
    public contract: SmartContract;
    public feed: Feedback;
    public proposalID: string = "17";
    public user_is_registered: boolean;
    public user_voted_us: boolean;
    public user_dismiss: boolean;
    private subscriber: Subscriber<string>;
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public scatter: VapaeeScatter,
        public dex: VapaeeDEX,
        public cookie: CookieService
    ) {
        this.subscriber = new Subscriber<string>(this.onAccountChange.bind(this));
        this.user_dismiss = !!this.cookie.get("user_dismiss");
        this.contract = this.scatter.getSmartContract("eosio.trail");
        this.feed = new Feedback();
        this.new_version = true;
        this.onAccountChange(null);
    }

    ngOnDestroy() {
        this.subscriber.unsubscribe();
    }

    ngOnInit() {
         this.dex.onCurrentAccountChange.subscribe(this.subscriber);
    }

    resetError() {
        this.feed.setError("voting", null);
    }

    get error() {
        return this.feed.error("voting");
    }

    private _voteForUs() {
        this.feed.setError("voting", "");
        this.feed.setLoading("voting", true);
        this.feed.setLoading("mirrorcast", true);
        this.feed.setLoading("regvoter", true);
        // mirrorcast	{ "voter" : "gqydoobuhege", "token_symbol" : "4,TLOS" }
        // telosmain push action eosio.trail castvote '["viterbotelos",16,1]' -p viterbotelos
        // { "voter" : "viterbotelos", "ballot_id" : 16, "direction" : 1 }
        var wait_registered = new Promise<any>(resolve => {
            
        });

        if (this.user_is_registered) {
            wait_registered = Promise.resolve();
            this.feed.setLoading("regvoter", false);
        } else {
            if (this.user_voted_us) return this.feed.setLoading("voting", false);
            wait_registered = this.contract.excecute("regvoter", {
                voter:  this.scatter.account.name,
                token_symbol: "4,VOTE"
            }).then(_ => {
                this.feed.setLoading("regvoter", false);
                return _;
            }).catch(e => {
                if (typeof e == "string") {
                    this.feed.setError("voting", e);
                } else {
                    this.feed.setError("voting", JSON.stringify(e));
                }
                this.feed.setLoading("voting", false);
                this.feed.setLoading("regvoter", false);
                throw e;
            });
        }

        return wait_registered.then(_ => {
            if (this.user_voted_us) return this.feed.setLoading("voting", false);
            return this.contract.excecute("mirrorcast", {
                voter:  this.scatter.account.name,
                token_symbol: "4,TLOS"
            }).then(async result => {
                this.feed.setLoading("mirrorcast", false);
                if (this.user_voted_us) return this.feed.setLoading("voting", false);
                return this.contract.excecute("castvote", {
                    voter:  this.scatter.account.name,
                    ballot_id: this.proposalID,
                    direction: 1
                }).then(async result => {
                    var _ = await this.findOutIfUserVotedUs();
                    this.feed.setLoading("voting", false);
                    return result;
                }).catch(e => {
                    if (typeof e == "string") {
                        this.feed.setError("voting", e);
                    } else {
                        this.feed.setError("voting", JSON.stringify(e));
                    }
                    this.feed.setLoading("voting", false);
                });            
    
    
            }).catch(e => {
                if (typeof e == "string") {
                    this.feed.setError("voting", e);
                } else {
                    this.feed.setError("voting", JSON.stringify(e));
                }
                this.feed.setLoading("mirrorcast", false);
                this.feed.setLoading("voting", false);
                throw e;
            });

        });
    }

    voteForUs() {
        this.feed.setError("voting", "");
        console.log("voteForUs()");
        if (this.feed.loading("voting")) {
            console.log("cancel voteForUs()");
            return;
        }
        this.feed.setLoading("voting", true);
        this.feed.setLoading("mirrorcast", true);
        this.feed.setLoading("regvoter", true);
        if (this.dex.logged) {
            return this._voteForUs();
        }
        return this.dex.login().then(_ => {
            this.onAccountChange(this.dex.logged).then(_ => {
                if (this.user_voted_us) return this.feed.setLoading("voting", false);
                return this._voteForUs();
            });
        }).catch(e => {
            if (typeof e == "string") {
                this.feed.setError("voting", e);
            } else {
                this.feed.setError("voting", JSON.stringify(e));
            }
            this.feed.setLoading("voting", false);
            this.feed.setLoading("mirrorcast", false);
            this.feed.setLoading("regvoter", false);
        });;
    }


    dismiss() {
        this.user_dismiss = true;
        // this.cookie.set("user_dismiss", "dismiss");
    }

    findOutIfUserIsRegistered(account:string = null){
        console.log("findOutIfUserIsRegistered(",account,")");
        this.user_is_registered = false;
        this.feed.setLoading("user-registered", true);

        var encodedName = this.scatter.utils.encodeName(account || this.dex.current.name);
        
        return this.contract.getTable("balances", {
            scope:"VOTE",
            lower_bound: encodedName.toString(), 
            upper_bound: encodedName.toString(), 
            limit: 1
        }).then(result => {
            if (result.rows.length > 0) {
                console.log(result.rows[0]);
                this.user_is_registered = true;
            }
            this.feed.setLoading("user-registered", false);
        }).catch(e => {
            console.error(e);
            this.feed.setLoading("user-registered", false);
        });        
    }

    findOutIfUserVotedUs(account:string = null){
        console.log("findOutIfUserVotedUs(",account,")");
        this.user_voted_us = false;
        this.feed.setLoading("user-voted", true);
        return this.contract.getTable("votereceipts", {scope:account || this.dex.current.name, limit:1, lower_bound:this.proposalID}).then(result => {
            if (result.rows.length > 0) {
                console.assert(result.rows[0].ballot_id == this.proposalID, result.rows[0].ballot_id, typeof result.rows[0].ballot_id, this.proposalID, typeof this.proposalID);
                if (result.rows[0].directions.length == 1 && result.rows[0].directions[0] == 1 && result.rows[0].expiration > 1571155349) {
                    this.user_voted_us = true;
                } else {
                    this.cookie.delete("user_dismiss");
                }
            }
            this.feed.setLoading("user-voted", false);
        }).catch(e => {
            console.error(e);
            this.feed.setLoading("user-voted", false);
        });
    }

    onAccountChange(account: string) {
        console.log("onAccountChange()", account);
        this.feed.setError("voting", "");
        return Promise.all([
            this.findOutIfUserVotedUs(account),
            this.findOutIfUserIsRegistered(account)
        ]);
    }

}
