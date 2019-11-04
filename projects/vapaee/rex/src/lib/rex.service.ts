import { Injectable } from '@angular/core';
import { SmartContract, VapaeeScatter, Account, Asset } from '@vapaee/scatter';
import { Feedback } from '@vapaee/feedback';


export interface REXdata {
    "total": Asset,                // TLOS
    "deposits": Asset,             // TLOS
    "balance": Asset,              // TLOS
    "profits": Asset,              // TLOS
    "tables": {
        "rexfund": REXdeposits,
        "rexbal": REXbalance
    }
}

export interface REXdeposits {
    "version": 0,
    "owner": string,
    "balance": Asset,              // TLOS
}

export interface REXbalance {
    "version": number,
    "owner": string,
    "vote_stake": Asset,           // TLOS
    "rex_balance": Asset,          // REX
    "matured_rex": number,
    "rex_maturities": {
        "first": Date,
        "second": number
    }[]
}

export interface REXpool {
    "version": number,
    "total_lent": Asset,           // TLOS - total amount of CORE_SYMBOL in open rex_loans
    "total_unlent": Asset,         // TLOS - total amount of CORE_SYMBOL available to be lent (connector),
    "total_rent": Asset,           // TLOS - fees received in exchange for lent  (connector),
    "total_lendable": Asset,       // TLOS - total amount of CORE_SYMBOL that have been lent (total_unlent + total_lent),
    "total_rex": Asset,            // REX - total number of REX shares allocated to contributors to total_lendable,
    "namebid_proceeds": Asset,     // TLOS - the amount of CORE_SYMBOL to be transferred from namebids to REX pool,
    "loan_num": number             // increments with each new loan.
}

@Injectable({
    providedIn: "root"
})
export class VapaeeREX {

    public contract: SmartContract;
    public contract_name: string;
    public feed: Feedback;
    public pool: REXpool;
    public default: REXdata;
    public balances: {[account:string]:REXbalance};
    public deposits: {[account:string]:REXdeposits};
    
    constructor(
        private scatter: VapaeeScatter
    ) {
        this.contract_name = "eosio";
        this.contract = this.scatter.getSmartContract(this.contract_name);
        this.feed = new Feedback();
        this.balances = {};
        this.deposits = {};
        this.default = {
            "total": new Asset("0.0000 " + this.scatter.symbol),
            "deposits": new Asset("0.0000 " + this.scatter.symbol),
            "balance": new Asset("0.0000 " + this.scatter.symbol),
            "profits": new Asset("0.0000 " + this.scatter.symbol),
            "tables": {
                "rexfund": {
                    "version": 0,
                    "owner": this.scatter.username,
                    "balance": new Asset("0.0000 " + this.scatter.symbol),                  
                },
                "rexbal": {
                    "version": 0,
                    "owner": this.scatter.username,
                    "vote_stake": new Asset("0.0000 " + this.scatter.symbol),
                    "rex_balance": new Asset("0.0000 REX"),
                    "matured_rex": 0,
                    "rex_maturities": []
                }
            }
        }
        this.pool = {
            version: 0,
            loan_num:0,
            namebid_proceeds:new Asset(),
            total_lendable:new Asset(),
            total_lent: new Asset(),
            total_unlent: new Asset(),
            total_rent: new Asset(),
            total_rex: new Asset()
        };
    }

    async updatePoolState() {
        this.feed.setLoading("REXpool", true);
        var result = await this.contract.getTable("rexpool");
        console.assert(result.rows.length == 1, "ERROR: contract is returning more than one pool state");
        var _pool = result.rows[0];
        this.pool.loan_num = _pool.loan_num;
        this.pool.namebid_proceeds = new Asset(_pool.namebid_proceeds);
        this.pool.total_lendable = new Asset(_pool.total_lendable);
        this.pool.total_lent = new Asset(_pool.total_lent);
        this.pool.total_unlent = new Asset(_pool.total_unlent);
        this.pool.total_rent = new Asset(_pool.total_rent);
        this.pool.total_rex = new Asset(_pool.total_rex);
        this.feed.setLoading("REXpool", false);
    }

    async queryAccountREXBalance(account: string) {
        this.feed.setLoading("REXbalance", true);
        var encodedName = this.scatter.utils.encodeName(account);

        return this.contract.getTable("rexbal", {
            lower_bound: encodedName.toString(), 
            upper_bound: encodedName.toString(), 
            limit: 1
        }).then(result => {
            let _row = result.rows[0];
            let _rexbal:REXbalance = {
                version: 0,
                owner: this.scatter.default.name,
                vote_stake: new Asset("0.0000 " + this.scatter.symbol),
                rex_balance: new Asset("0.0000 REX"),
                matured_rex: 0,
                rex_maturities: []
            }            
            if (_row) {
                _rexbal = {
                    version: _row.version,
                    owner: _row.owner,
                    vote_stake: new Asset(_row.vote_stake),
                    rex_balance: new Asset(_row.rex_balance),
                    matured_rex: _row.matured_rex,
                    rex_maturities: _row.rex_maturities
                }

            }
            this.balances[account] = _rexbal;
            this.feed.setLoading("REXbalance", false);
            return _rexbal;
        }).catch(e => {
            console.error("ERROR: ", e);
            this.feed.setLoading("REXbalance", false);
        });        
    }


    async queryAccountREXDeposits(account: string) {
        this.feed.setLoading("REXDeposits", true);
        var encodedName = this.scatter.utils.encodeName(account);

        return this.contract.getTable("rexfund", {
            lower_bound: encodedName.toString(), 
            upper_bound: encodedName.toString(), 
            limit: 1
        }).then(result => {
            let _row = result.rows[0];
            let _rexfund:REXdeposits = {
                version: 0,
                owner: this.scatter.default.name,
                balance: new Asset("0.0000 " + this.scatter.symbol)
            }            
            if (_row) {
                _rexfund = {
                    version: _row.version,
                    owner: _row.owner,
                    balance: new Asset(_row.balance)
                }

            }
            this.deposits[account] = _rexfund;
            this.feed.setLoading("REXDeposits", false);
            return _rexfund;
        }).catch(e => {
            console.error("ERROR: ", e);
            this.feed.setLoading("REXDeposits", false);
        });        
    }


    async getAccountREXData(account: string) {
        this.feed.setLoading("REXData", false);
        delete this.balances[account];
        delete this.deposits[account];
        return Promise.all([
            this.updatePoolState(),
            this.queryAccountREXBalance(account),
            this.queryAccountREXDeposits(account)
        ]).then(result => {
            let _rexbal: REXbalance = this.balances[account];
            let _rexfund: REXdeposits = this.deposits[account];

            let ratio = this.pool.total_lendable.amount.dividedBy(this.pool.total_rex.amount);
            let balance_ammount = _rexbal.rex_balance.amount.multipliedBy(ratio);


            //console.log("------------------------------------");
            //console.log("balance_ammount: ", balance_ammount);

            let balance: Asset = new Asset(balance_ammount.toString() + " TLOS", 4);
            //console.log("balance.toString(): ", balance.toString());
            //console.log("------------------------------------");

            let deposits: Asset = _rexfund.balance;
            let profits: Asset = new Asset(balance.amount.minus(_rexbal.vote_stake.amount), balance.token);

            let total: Asset = balance.plus(deposits);

            let data:REXdata = {
                total: total,
                deposits: deposits,
                balance: balance,
                profits: profits,
                tables: {
                    rexbal: _rexbal,
                    rexfund: _rexfund
                }
            }
            this.feed.setLoading("REXData", false);
            return data;
        }).catch(e => {
            console.error("ERROR: ", e);
            this.feed.setLoading("REXData", false);
            return null;
        });  
    }

}
