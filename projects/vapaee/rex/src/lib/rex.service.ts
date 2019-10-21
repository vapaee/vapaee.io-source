import { Injectable } from '@angular/core';
import { SmartContract, VapaeeScatter, Account, Asset } from '@vapaee/scatter';
import { Feedback } from '@vapaee/feedback';

export interface AccountREX {

}

export interface REXpool {
    "version": number,
    "total_lent": Asset,           // TLOS - total amount of CORE_SYMBOL in open rex_loans
    "total_unlent": Asset,         // TLOS - total amount of CORE_SYMBOL available to be lent (connector),
    "total_rent": Asset,           // TLOS - fees received in exchange for lent  (connector),
    "total_lendable": Asset,       // TLOS - total amount of CORE_SYMBOL that have been lent (total_unlent + total_lent),
    "total_rex": Asset,            // REX - total number of REX shares allocated to contributors to total_lendable,
    "namebid_proceeds": Asset,     // TLOS - the amount of CORE_SYMBOL to be transferred from namebids to REX pool,
    "loan_num": 34                 // increments with each new loan.
}

@Injectable({
    providedIn: "root"
})
export class VapaeeRex {

    public contract: SmartContract;
    public contract_name: string;
    public feed: Feedback;
    public current: Account;
    public accountRex: AccountREX;
    
    constructor(
        private scatter: VapaeeScatter
    ) {
        this.contract_name = "eosio";
        this.contract = this.scatter.getSmartContract(this.contract_name);
        this.scatter.onLogggedStateChange.subscribe(this.onLoggedChange.bind(this));
        this.feed = new Feedback();
    }

    // getters -------------------------------------------------------------
    get default(): Account {
        return this.scatter.default;
    }

    get logged() {
        return this.scatter.logged ?
            (this.scatter.account ? this.scatter.account.name : this.scatter.default.name) :
            null;
    }

    get account() {
        return this.scatter.logged ? 
        this.scatter.account :
        this.scatter.default;
    }

    get waitLogged() {
        return this.scatter.waitLogged;
    }

    // Log state

    onLogout() {
        this.feed.setLoading("logout", false);
        console.log("VapaeeDEX.onLogout()");
    }
    
    onLogin(name:string) {
        console.log("VapaeeDEX.onLogin()", name);
        this.resetCurrentAccount(name);
    }

    onLoggedChange() {
        console.log("VapaeeDEX.onLoggedChange()");
        if (this.scatter.logged) {
            this.onLogin(this.scatter.account.name);
        } else {
            this.onLogout();
        }
    }

    async getAccountRexData(account: string) {
        return this.contract.getTable("events", {
            limit: 1
        }).then(result => {
            if (result.rows.length == 0) return 0;
            var params = result.rows[0].params;
            var total = parseInt(params.split(" ")[0])-1;
            var mod = total % pagesize;
            var dif = total - mod;
            var pages = dif / pagesize;
            if (mod > 0) {
                pages +=1;
            }
            this.activity.total = total;
            console.log("VapaeeDEX.getActivityTotalPages() total: ", total, " pages: ", pages);
            return pages;
        });        
    }

    
    async resetCurrentAccount(profile:string) {
        console.log("VapaeeDEX.resetCurrentAccount()", this.current.name, "->", profile);
        if (this.current.name != profile) {
            this.feed.setLoading("account", true);
            this.current = this.default;
            this.current.name = profile;
            if (profile != "guest") {
                this.rexData = await this.getAccountRexData(this.current.name);
            } else {
            }
            this.feed.setLoading("account", false);
        }       
    }

}
