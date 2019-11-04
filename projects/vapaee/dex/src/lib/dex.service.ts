import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import BigNumber from "bignumber.js";
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { TokenDEX, TokenData, TokenEvent } from './token-dex.class';
import { AssetDEX } from './asset-dex.class';
import { Feedback } from '@vapaee/feedback';
import { VapaeeScatter, Account, AccountData, SmartContract, TableResult, TableParams, Asset } from '@vapaee/scatter';
import { MarketMap, UserOrdersMap, MarketSummary, EventLog, Market, HistoryTx, TokenOrders, Order, UserOrders, OrderRow, HistoryBlock, DEXdata } from './types-dex';


@Injectable({
    providedIn: "root"
})
export class VapaeeDEX {

    public id;

    public loginState: string;
    /*
    public loginState: string;
    - 'no-scatter': Scatter no detected
    - 'no-logged': Scatter detected but user is not logged
    - 'account-ok': user logger with scatter
    */
    private _markets: MarketMap;
    private _reverse: MarketMap;
    private _dexdata: DEXdata;
    public topmarkets: Market[];

    public zero_telos: AssetDEX;
    public telos: TokenDEX;
    public tokens: TokenDEX[];
    public currencies: TokenDEX[];
    public contract: SmartContract;
    public feed: Feedback;
    public current: Account;
    public last_logged: string;
    public contract_name: string;   
    public deposits: AssetDEX[];
    public balances: AssetDEX[];
    public inorders: AssetDEX[];
    public userorders: UserOrdersMap;
    public onLoggedAccountChange:Subject<string> = new Subject();
    public onCurrentAccountChange:Subject<string> = new Subject();
    public onHistoryChange:Subject<string> = new Subject();
    public onMarketSummary:Subject<MarketSummary> = new Subject();
    // public onBlocklistChange:Subject<any[][]> = new Subject();
    public onTokensReady:Subject<TokenDEX[]> = new Subject();
    public onTopMarketsReady:Subject<Market[]> = new Subject();
    public onTradeUpdated:Subject<any> = new Subject();
    vapaeetokens:string = "vapaeetokens";

    activityPagesize:number = 10;
    
    activity:{
        total:number;
        events:{[id:string]:EventLog};
        list:EventLog[];
    };
    
    private setOrderSummary: Function;
    public waitOrderSummary: Promise<any> = new Promise((resolve) => {
        this.setOrderSummary = resolve;
    });

    private setTokenStats: Function;
    public waitTokenStats: Promise<any> = new Promise((resolve) => {
        this.setTokenStats = resolve;
    });

    private setTokenEvents: Function;
    public waitTokenEvents: Promise<any> = new Promise((resolve) => {
        this.setTokenEvents = resolve;
    });

    private setTokenData: Function;
    public waitTokenData: Promise<any> = new Promise((resolve) => {
        this.setTokenData = resolve;
    });

    private setMarketSummary: Function;
    public waitMarketSummary: Promise<any> = new Promise((resolve) => {
        this.setMarketSummary = resolve;
    });

    private setTokenSummary: Function;
    public waitTokenSummary: Promise<any> = new Promise((resolve) => {
        this.setTokenSummary = resolve;
    });

    private setTokensLoaded: Function;
    public waitTokensLoaded: Promise<any> = new Promise((resolve) => {
        this.setTokensLoaded = resolve;
    });
    constructor(
        private scatter: VapaeeScatter,
        private cookies: CookieService,
        private datePipe: DatePipe
    ) {
        this.id = Math.floor( 10 * Math.random());
        this._markets = {};
        this._reverse = {};
        this.activity = {total:0, events:{}, list:[]};
        this.current = this.default;
        this.contract_name = this.vapaeetokens;
        this.contract = this.scatter.getSmartContract(this.contract_name);
        this.feed = new Feedback();
        this.scatter.onLogggedStateChange.subscribe(this.onLoggedChange.bind(this));
        this.updateLogState();
        this.updateTokens().then(data => {
            this.zero_telos = new AssetDEX("0.0000 TLOS", this);
            this.setTokensLoaded();
            this.getOrderSummary();
            this.getAllTablesSumaries();
        });

        // this.waitTokensLoaded.then(_ => {
        // })


        let timer;
        this.onMarketSummary.subscribe(summary => {
            clearTimeout(timer);
            timer = setTimeout(_ => {
                this.updateTokensSummary();
                this.updateTokensMarkets();
            }, 100);
        });
    }

    updateTokens() {
        return this.fetchTokens().then(data => {
            this.tokens = [];
            this.currencies = [ ];
            for (let i in data.tokens) {
                let tdata = data.tokens[i];
                let token = new TokenDEX(tdata);
                this.tokens.push(token);
                if (token.symbol == "TLOS") {
                    this.telos = token;
                } else if (token.currency) {
                    this.currencies.push(token);
                }
            }
            this.currencies.unshift(this.telos);
            this.fetchTokensStats();
            this.fetchTokensEvents();
            this.fetchTokensData();
        });
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

    get dexdata(): DEXdata {
        if (!this._dexdata) {
            this._dexdata = {
                deposits: this.deposits,
                userorders: this.userorders,
                inorders: this.inorders,
                balances: this.balances
            }
        };
        return this._dexdata;
    }    

    // -- User Log State ---------------------------------------------------
    login() {
        this.feed.setLoading("login", true);
        this.feed.setLoading("log-state", true);
        console.log("VapaeeDEX.login() this.feed.loading('log-state')", this.feed.loading('log-state'));
        this.logout();
        this.updateLogState();
        console.log("VapaeeDEX.login() this.feed.loading('log-state')", this.feed.loading('log-state'));
        this.feed.setLoading("logout", false);
        return this.scatter.login().then(() => {
            this.updateLogState();
            this.feed.setLoading("login", false);
        }).catch(e => {
            this.feed.setLoading("login", false);
            throw e;
        });
    }

    logout() {
        this.feed.setLoading("logout", true);
        this.scatter.logout();
    }

    onLogout() {
        this.feed.setLoading("logout", false);
        console.log("VapaeeDEX.onLogout()");
        this.resetCurrentAccount(this.default.name);
        this.updateLogState();
        this.onLoggedAccountChange.next(this.logged);
        this.cookies.delete("login");
        setTimeout(_  => { this.last_logged = this.logged; }, 400);
    }
    
    onLogin(name:string) {
        console.log("VapaeeDEX.onLogin()", name);
        this.resetCurrentAccount(name);
        this.getDeposits();
        this.getBalances();
        this.updateLogState();
        this.getUserOrders();
        this.onLoggedAccountChange.next(this.logged);
        this.last_logged = this.logged;
        this.cookies.set("login", this.logged);
    }

    onLoggedChange() {
        console.log("VapaeeDEX.onLoggedChange()");
        if (this.scatter.logged) {
            this.onLogin(this.scatter.account.name);
        } else {
            this.onLogout();
        }
    }

    async resetCurrentAccount(profile:string) {
        console.log("VapaeeDEX.resetCurrentAccount()", this.current.name, "->", profile);
        if (this.current.name != profile && (this.current.name == this.last_logged || profile != "guest")) {
            this.feed.setLoading("account", true);
            this.current = this.default;
            this.current.name = profile;
            if (profile != "guest") {
                this.current.data = await this.getAccountData(this.current.name);
            } else {
                console.error("------------------------------------------");
                console.error("------------------------------------------");
                console.error("WARNING!!! current is guest", [profile, this.account, this.current]);
                console.error("------------------------------------------");
                console.error("------------------------------------------");
            }
            // this.scopes = {};
            this.balances = [];
            this.userorders = {};
            this.inorders = [];
            delete this._dexdata;
            // console.log("this.onCurrentAccountChange.next(this.current.name) !!!!!!");
            this.onCurrentAccountChange.next(this.current.name);
            this.updateCurrentUser();
            this.feed.setLoading("account", false);
        }       
    }

    private updateLogState() {
        this.loginState = "no-scatter";
        this.feed.setLoading("log-state", true);
        console.log("VapaeeDEX.updateLogState() ", this.loginState, this.feed.loading("log-state"));
        this.scatter.waitConnected.then(() => {
            this.loginState = "no-logged";
            // console.log("VapaeeDEX.updateLogState()   ", this.loginState);
            if (this.scatter.logged) {
                this.loginState = "account-ok";
                // console.log("VapaeeDEX.updateLogState()     ", this.loginState);
            }
            this.feed.setLoading("log-state", false);
            console.log("VapaeeDEX.updateLogState() ", this.loginState, this.feed.loading("log-state"));
        });

        let timer2;
        let timer1 = setInterval(_ => {
            if (!this.scatter.feed.loading("connect")) {
                this.feed.setLoading("log-state", false);
                clearInterval(timer1);
                clearInterval(timer2);
            }
        }, 200);

        timer2 = setTimeout(_ => {
            clearInterval(timer1);
            this.feed.setLoading("log-state", false);
        }, 6000);
        
    }

    private async getAccountData(name: string): Promise<AccountData>  {
        return this.scatter.queryAccountData(name).catch(async _ => {
            return this.default.data;
        });
    }

    // Actions --------------------------------------------------------------
    createOrder(type:string, amount:AssetDEX, price:AssetDEX) {
        // "alice", "buy", "2.50000000 CNT", "0.40000000 TLOS"
        // name owner, name type, const asset & total, const asset & price
        this.feed.setLoading("order-"+type, true);
        return this.contract.excecute("order", {
            owner:  this.scatter.account.name,
            type: type,
            total: amount.toString(8),
            price: price.toString(8)
        }).then(async result => {
            this.updateTrade(amount.token, price.token);
            this.feed.setLoading("order-"+type, false);
            return result;
        }).catch(e => {
            this.feed.setLoading("order-"+type, false);
            console.error(e);
            throw e;
        });
    }

    cancelOrder(type:string, commodity:TokenDEX, currency:TokenDEX, orders:number[]) {
        // '["alice", "buy", "CNT", "TLOS", [1,0]]'
        // name owner, name type, const asset & total, const asset & price
        this.feed.setLoading("cancel-"+type, true);
        for (let i in orders) { this.feed.setLoading("cancel-"+type+"-"+orders[i], true); }
        return this.contract.excecute("cancel", {
            owner:  this.scatter.account.name,
            type: type,
            commodity: commodity.symbol,
            currency: currency.symbol,
            orders: orders
        }).then(async result => {
            this.updateTrade(commodity, currency);
            this.feed.setLoading("cancel-"+type, false);
            for (let i in orders) { this.feed.setLoading("cancel-"+type+"-"+orders[i], false); }    
            return result;
        }).catch(e => {
            this.feed.setLoading("cancel-"+type, false);
            for (let i in orders) { this.feed.setLoading("cancel-"+type+"-"+orders[i], false); }    
            console.error(e);
            throw e;
        });
    }

    deposit(quantity:AssetDEX) {
        // name owner, name type, const asset & total, const asset & price
        let contract = this.scatter.getSmartContract(quantity.token.contract);
        this.feed.setError("deposit", null);
        this.feed.setLoading("deposit", true);
        this.feed.setLoading("deposit-"+quantity.token.symbol.toLowerCase(), true);
        return contract.excecute("transfer", {
            from:  this.scatter.account.name,
            to: this.vapaeetokens,
            quantity: quantity.toString(),
            memo: "deposit"
        }).then(async result => {
            this.feed.setLoading("deposit", false);
            this.feed.setLoading("deposit-"+quantity.token.symbol.toLowerCase(), false);    
            /*await*/ this.getDeposits();
            /*await*/ this.getBalances();
            return result;
        }).catch(e => {
            this.feed.setLoading("deposit", false);
            this.feed.setLoading("deposit-"+quantity.token.symbol.toLowerCase(), false);
            this.feed.setError("deposit", typeof e == "string" ? e : JSON.stringify(e,null,4));
            console.error(e);
            throw e;
        });
    }    

    withdraw(quantity:AssetDEX) {
        this.feed.setError("withdraw", null);
        this.feed.setLoading("withdraw", true);
        this.feed.setLoading("withdraw-"+quantity.token.symbol.toLowerCase(), true);   
        return this.contract.excecute("withdraw", {
            owner:  this.scatter.account.name,
            quantity: quantity.toString()
        }).then(async result => {
            this.feed.setLoading("withdraw", false);
            this.feed.setLoading("withdraw-"+quantity.token.symbol.toLowerCase(), false);
            this.getDeposits();
            this.getBalances();
            this.scatter.updateAccountData();
            return result;
        }).catch(e => {
            this.feed.setLoading("withdraw", false);
            this.feed.setLoading("withdraw-"+quantity.token.symbol.toLowerCase(), false);
            this.feed.setError("withdraw", typeof e == "string" ? e : JSON.stringify(e,null,4));
            throw e;
        });
    }

    // Tokens Action --------------------------------------------------------------

    addtoken(token:TokenDEX) {
        let feedid = "addtoken";
        this.feed.setError(feedid, null);
        this.feed.setLoading(feedid, true);

        return this.contract.excecute("addtoken", {
            contract:  token.contract,
            symbol: token.symbol,
            precision: token.precision,
            owner: this.logged,
            title: token.title,
            website: token.website,
            brief: token.brief,
            banner: token.banner,
            logo: token.logo,
            logolg: token.logolg,
            tradeable: token.tradeable ? 1 : 0,
        }).then(async result => {
            await this.updateTokens();
            this.feed.setLoading(feedid, false);
            return result;
        }).catch(e => {
            this.feed.setLoading(feedid, false);
            this.feed.setError(feedid, typeof e == "string" ? e : JSON.stringify(e,null,4));
            throw e;
        });
    }

    updatetoken(token:TokenDEX) {
        let feedid = "updatetoken";
        this.feed.setError(feedid, null);
        this.feed.setLoading(feedid, true);
        return this.contract.excecute("updatetoken", {
            sym_code: token.symbol,
            title: token.title,
            website: token.website,
            brief: token.brief,
            banner: token.banner,
            logo: token.logo,
            logolg: token.logolg,
            tradeable: token.tradeable,
        }).then(async result => {
            this.feed.setLoading(feedid, false);
            return result;
        }).catch(e => {
            this.feed.setLoading(feedid, false);
            this.feed.setError(feedid, typeof e == "string" ? e : JSON.stringify(e,null,4));
            throw e;
        });
    }

    settokeninfo(action:string, info:TokenData) {
        let feedid = "settokeninfo";
        this.feed.setError(feedid, null);
        this.feed.setLoading(feedid, true);
        return this.contract.excecute("settokendata", {
            symbol: info.symbol, 
            id:info.id,
            action:action,
            category:info.category,
            text:info.text,
            link:info.link
        }).then(async result => {
            this.feed.setLoading(feedid, false);
            return result;
        }).catch(e => {
            this.feed.setLoading(feedid, false);
            this.feed.setError(feedid, typeof e == "string" ? e : JSON.stringify(e,null,4));
            throw e;
        });
    }

    edittkevent(action:string, symbol:string, evt:TokenEvent) {
        let feedid = "edittkevent";
        this.feed.setError(feedid, null);
        this.feed.setLoading(feedid, true);
        return this.contract.excecute("edittkevent", {
            symbol:symbol,
            event:evt.event,
            action:action,
            contract: evt.receptor
        }).then(async result => {
            this.feed.setLoading(feedid, false);
            return result;
        }).catch(e => {
            this.feed.setLoading(feedid, false);
            this.feed.setError(feedid, typeof e == "string" ? e : JSON.stringify(e,null,4));
            throw e;
        });
    }    


    createtoken(asset:AssetDEX) {
        let feedid = "createtoken";
        this.feed.setError(feedid, null);
        this.feed.setLoading(feedid, true);
        return this.contract.excecute("create", {
            issuer:  this.logged,
            maximum_supply: asset.toString()
        }).then(async result => {
            this.feed.setLoading(feedid, false);
            return result;
        }).catch(e => {
            this.feed.setLoading(feedid, false);
            this.feed.setError(feedid, typeof e == "string" ? e : JSON.stringify(e,null,4));
            throw e;
        });
    }

    // Tokens --------------------------------------------------------------

    addOffChainToken(offchain: TokenDEX) {
        this.waitTokensLoaded.then(_ => {
            this.tokens.push(new TokenDEX({
                symbol: offchain.symbol,
                precision: offchain.precision || 4,
                contract: "nocontract",
                title: offchain.title,
                website: "",
                logo:"",
                logolg: "",
                scope: "",
                stat: null,
                tradeable: false,
                offchain: true
            }));
        });
    }


    // --------------------------------------------------------------
    // Scopes / Tables 
    public hasScopes() {
        return !!this._markets;
    }

    public market(scope:string): Market {
        if (this._markets[scope]) return this._markets[scope];        // ---> direct
        let reverse = this.inverseScope(scope);
        if (this._reverse[reverse]) return this._reverse[reverse];    // ---> reverse
        if (!this._markets[reverse]) return null;                     // ---> table does not exist (or has not been loaded yet)
        return this.reverse(scope);
    }

    public table(scope:string): Market {
        //console.error("table("+scope+") DEPRECATED");
        return this.market(scope);
    }    

    private reverse(scope:string): Market {
        let canonical = this.canonicalScope(scope);
        let reverse_scope = this.inverseScope(canonical);
        console.assert(canonical != reverse_scope, "ERROR: ", canonical, reverse_scope);
        let reverse_table:Market = this._reverse[reverse_scope];
        if (!reverse_table && this._markets[canonical]) {
            this._reverse[reverse_scope] = this.createReverseTableFor(reverse_scope);
        }
        return this._reverse[reverse_scope];
    }

    public marketFor(commodity:TokenDEX, currency:TokenDEX): Market {
        let scope = this.getScopeFor(commodity, currency);
        return this.table(scope);
    }

    public tableFor(commodity:TokenDEX, currency:TokenDEX): Market {
        console.error("tableFor()",commodity.symbol,currency.symbol," DEPRECATED");
        return this.marketFor(commodity, currency);
    }

    public createReverseTableFor(scope:string): Market {
        let canonical = this.canonicalScope(scope);
        let reverse_scope = this.inverseScope(canonical);
        let table:Market = this._markets[canonical];

        let inverse_history:HistoryTx[] = [];

        for (let i in table.history) {
            let hTx:HistoryTx = {
                id: table.history[i].id,
                str: "",
                price: table.history[i].inverse.clone(),
                inverse: table.history[i].price.clone(),
                amount: table.history[i].payment.clone(),
                payment: table.history[i].amount.clone(),
                buyer: table.history[i].seller,
                seller: table.history[i].buyer,
                buyfee: table.history[i].sellfee.clone(),
                sellfee: table.history[i].buyfee.clone(),
                date: table.history[i].date,
                isbuy: !table.history[i].isbuy,
            };
            hTx.str = hTx.price.str + " " + hTx.amount.str;
            inverse_history.push(hTx);
        }
        
    
        let inverse_orders:TokenOrders = {
            buy: [], sell: []
        };

        for (let type in {buy:"buy", sell:"sell"}) {
            let row_orders:Order[];
            let row_order:Order;

            for (let i in table.orders[type]) {
                let row = table.orders[type][i];

                row_orders = [];
                for (let j=0; j<row.orders.length; j++) {
                    row_order = {
                        deposit: row.orders[j].deposit.clone(),
                        id: row.orders[j].id,
                        inverse: row.orders[j].price.clone(),
                        price: row.orders[j].inverse.clone(),
                        owner: row.orders[j].owner,
                        telos: row.orders[j].total,
                        total: row.orders[j].telos
                    }
                    row_orders.push(row_order);
                }

                let newrow:OrderRow = {
                    inverse: row.price.clone(),
                    orders: row_orders,
                    owners: row.owners,
                    price: row.inverse.clone(),
                    str: row.inverse.str,
                    sum: row.sumtelos.clone(),
                    sumtelos: row.sum.clone(),
                    telos: row.total.clone(),
                    total: row.telos.clone(),
                    // amount: row.sumtelos.total(), // <-- extra
                };
                inverse_orders[type].push(newrow);
            }
        }

        let reverse:Market = {
            scope: reverse_scope,
            commodity: table.currency,
            currency: table.commodity,
            block: table.block,
            blocklist: table.reverseblocks,
            reverseblocks: table.blocklist,
            blocklevels: table.reverselevels,
            reverselevels: table.blocklevels,
            blocks: table.blocks,
            deals: table.deals,
            direct: table.inverse,
            inverse: table.direct,
            header: {
                sell: {
                    total:table.header.buy.total.clone(),
                    orders:table.header.buy.orders
                },
                buy: {
                    total:table.header.sell.total.clone(),
                    orders:table.header.sell.orders
                }
            },
            history: inverse_history,
            orders: {
                sell: inverse_orders.buy,  // <<-- esto funciona así como está?
                buy: inverse_orders.sell   // <<-- esto funciona así como está?
            },
            summary: {
                scope: this.inverseScope(table.summary.scope),
                price: table.summary.inverse,
                price_24h_ago: table.summary.inverse_24h_ago,
                inverse: table.summary.price,
                inverse_24h_ago: table.summary.price_24h_ago,
                max_inverse: table.summary.max_price,
                max_price: table.summary.max_inverse,
                min_inverse: table.summary.min_price,
                min_price: table.summary.min_inverse,
                records: table.summary.records,
                volume: table.summary.amount,
                amount: table.summary.volume,
                percent: table.summary.ipercent,
                ipercent: table.summary.percent,
                percent_str: table.summary.ipercent_str,
                ipercent_str: table.summary.percent_str,
            },
            tx: table.tx
        }
        return reverse;
    }

    public getScopeFor(commodity:TokenDEX, currency:TokenDEX) {
        if (!commodity || !currency) return "";
        return commodity.symbol.toLowerCase() + "." + currency.symbol.toLowerCase();
    }

    public inverseScope(scope:string) {
        if (!scope) return scope;
        console.assert(typeof scope =="string", "ERROR: string scope expected, got ", typeof scope, scope);
        let parts = scope.split(".");
        console.assert(parts.length == 2, "ERROR: scope format expected is xxx.yyy, got: ", typeof scope, scope);
        let inverse = parts[1] + "." + parts[0];
        return inverse;
    }

    public canonicalScope(scope:string) {
        if (!scope) return scope;
        console.assert(typeof scope =="string", "ERROR: string scope expected, got ", typeof scope, scope);
        let parts = scope.split(".");
        console.assert(parts.length == 2, "ERROR: scope format expected is xxx.yyy, got: ", typeof scope, scope);
        let inverse = parts[1] + "." + parts[0];
        if (parts[1] == "tlos") {
            return scope;
        }
        if (parts[0] == "tlos") {
            return inverse;
        }
        if (parts[0] < parts[1]) {
            return scope;
        } else {
            return inverse;
        }
    }

    public isCanonical(scope:string) {
        return this.canonicalScope(scope) == scope;
    }

    
    
    // --------------------------------------------------------------
    // Getters 

    getBalance(token:TokenDEX) {
        for (let i in this.balances) {
            if (this.balances[i].token.symbol == token.symbol) {
                return this.balances[i];
            }
        }
        return new AssetDEX("0 " + token.symbol, this);
    }

    getInOrders(token: TokenDEX) {
        for (let i in this.inorders) {
            if (this.inorders[i].token.symbol == token.symbol) {
                return this.inorders[i];
            }
        }
        return new AssetDEX("0 " + token.symbol, this);
    }

    getTokenNow(sym:string): TokenDEX {
        if (!sym) return null;
        for (let i in this.tokens) {
            // there's a little bug. This is a justa  work arround
            if (this.tokens[i].symbol.toUpperCase() == "TLOS" && this.tokens[i].offchain) {
                // this solves attaching wrong tlos token to asset
                continue;
            }
             
            if (this.tokens[i].symbol.toUpperCase() == sym.toUpperCase()) {
                return this.tokens[i];
            }
        }
        return null;
    }

    async getToken(sym:string): Promise<TokenDEX> {
        return this.waitTokensLoaded.then(_ => {
            return this.getTokenNow(sym);
        });
    }

    async getDeposits(account:string = null): Promise<any> {
        console.log("VapaeeDEX.getDeposits()");
        this.feed.setLoading("deposits", true);
        return this.waitTokensLoaded.then(async _ => {
            let deposits: AssetDEX[] = [];
            if (!account && this.current.name) {
                account = this.current.name;
            }
            if (account) {
                let result = await this.fetchDeposits(account);
                for (let i in result.rows) {
                    deposits.push(new AssetDEX(result.rows[i].amount, this));
                }
            }
            this.deposits = deposits;
            delete this._dexdata;
            this.feed.setLoading("deposits", false);
            return this.deposits;
        });
    }

    async getBalances(account:string = null): Promise<any> {
        console.log("VapaeeDEX.getBalances()");
        this.feed.setLoading("balances", true);
        return this.waitTokensLoaded.then(async _ => {
            let _balances: AssetDEX[];
            if (!account && this.current.name) {
                account = this.current.name;
            }            
            if (account) {
                await this.fetchBalances(account);
            }
            // this.balances = _balances;
            // console.log("VapaeeDEX balances updated");
            this.feed.setLoading("balances", false);
            return this.balances;
        });
    }

    async getThisSellOrders(table:string, ids:number[]): Promise<any[]> {
        this.feed.setLoading("thisorders", true);
        return this.waitTokensLoaded.then(async _ => {
            let result = [];
            for (let i in ids) {
                let id = ids[i];
                let gotit = false;
                for (let j in result) {
                    if (result[j].id == id) {
                        gotit = true;
                        break;
                    }
                }
                if (gotit) {
                    continue;
                }
                let res:TableResult = await this.fetchOrders({scope:table, limit:1, lower_bound:id.toString()});

                result = result.concat(res.rows);
            }
            this.feed.setLoading("thisorders", false);
            return result;
        });    
    }

    async getUserOrders(account:string = null) {
        console.log("VapaeeDEX.getUserOrders()");
        this.feed.setLoading("userorders", true);
        return this.waitTokensLoaded.then(async _ => {
            let userorders: TableResult;
            if (!account && this.current.name) {
                account = this.current.name;
            }            
            if (account) {
                userorders = await this.fetchUserOrders(account);
            }
            let list: UserOrders[] = <UserOrders[]>userorders.rows;
            let map: UserOrdersMap = {};
            for (let i=0; i<list.length; i++) {
                let ids = list[i].ids;
                let table = list[i].table;
                let orders = await this.getThisSellOrders(table, ids);
                map[table] = {
                    table: table,
                    orders: this.auxProcessRowsToOrders(orders),
                    ids:ids
                };
            }
            this.userorders = map;

            // calculate inorders array
            let inorders_map = {};
            for (let i in this.userorders) {
                for (let o in this.userorders[i].orders) {
                    let _deposit = this.userorders[i].orders[o].deposit;
                    if (!inorders_map[_deposit.token.symbol]) {
                        inorders_map[_deposit.token.symbol] = new Asset("0 " + _deposit.token.symbol, this);
                    }
                    inorders_map[_deposit.token.symbol] = inorders_map[_deposit.token.symbol].plus(_deposit);
                }
            }
            this.inorders = [];
            for (let i in inorders_map) {
                this.inorders.push(inorders_map[i]);
            }

            delete this._dexdata;
            // console.log(this.userorders);
            this.feed.setLoading("userorders", false);
            return this.userorders;
        });
                
    }

    async updateActivity() {
        this.feed.setLoading("activity", true);
        let pagesize = this.activityPagesize;
        let pages = await this.getActivityTotalPages(pagesize);
        await Promise.all([
            this.fetchActivity(pages-2, pagesize),
            this.fetchActivity(pages-1, pagesize),
            this.fetchActivity(pages-0, pagesize)
        ]);
        this.feed.setLoading("activity", false);
    }

    async loadMoreActivity() {
        if (this.activity.list.length == 0) return;
        this.feed.setLoading("activity", true);
        let pagesize = this.activityPagesize;
        let first = this.activity.list[this.activity.list.length-1];
        let id = first.id - pagesize;
        let page = Math.floor((id-1) / pagesize);

        await this.fetchActivity(page, pagesize);
        this.feed.setLoading("activity", false);
    }

    async updateTrade(commodity:TokenDEX, currency:TokenDEX, updateUser:boolean = true): Promise<any> {
        console.log("VapaeeDEX.updateTrade()");
        let chrono_key = "updateTrade";
        this.feed.startChrono(chrono_key);

        if(updateUser) this.updateCurrentUser();
        return Promise.all([
            this.getTransactionHistory(commodity, currency, -1, -1, true).then(_ => this.feed.setMarck(chrono_key, "getTransactionHistory()")),
            this.getBlockHistory(commodity, currency, -1, -1, true).then(_ => this.feed.setMarck(chrono_key, "getBlockHistory()")),
            this.getSellOrders(commodity, currency, true).then(_ => this.feed.setMarck(chrono_key, "getSellOrders()")),
            this.getBuyOrders(commodity, currency, true).then(_ => this.feed.setMarck(chrono_key, "getBuyOrders()")),
            this.getMarketSummary(commodity, currency, true).then(_ => this.feed.setMarck(chrono_key, "getMarketSummary()")),
            this.getOrderSummary().then(_ => this.feed.setMarck(chrono_key, "getOrderSummary()")),
        ]).then(r => {
            this._reverse = {};
            this.resortTokens();
            this.resortTopMarkets();
            // this.feed.printChrono(chrono_key);
            this.onTradeUpdated.next(null);
            return r;
        });
    }

    async updateCurrentUser(): Promise<any> {
        // console.log("VapaeeDEX.updateCurrentUser()");
        this.feed.setLoading("current", true);        
        return Promise.all([
            this.getUserOrders(),
            this.getDeposits(),
            this.getBalances()
        ]).then(_ => {
            this.feed.setLoading("current", false);
            return _;
        }).catch(e => {
            this.feed.setLoading("current", false);
            throw e;
        });
    }

    private getBlockHistoryTotalPagesFor(scope:string, pagesize: number) {
        if (!this._markets) return 0;
        let market = this.market(scope);
        if (!market) return 0;
        let total = market.blocks;
        let mod = total % pagesize;
        let dif = total - mod;
        let pages = dif / pagesize;
        if (mod > 0) {
            pages +=1;
        }
        // console.log("getBlockHistoryTotalPagesFor() total:", total, " pages:", pages);
        return pages;
    }

    private getHistoryTotalPagesFor(scope:string, pagesize: number) {
        if (!this._markets) return 0;
        let market = this.market(scope);
        if (!market) return 0;
        let total = market.deals;
        let mod = total % pagesize;
        let dif = total - mod;
        let pages = dif / pagesize;
        if (mod > 0) {
            pages +=1;
        }
        return pages;
    }

    private async getActivityTotalPages(pagesize: number) {
        return this.contract.getTable("events", {
            limit: 1
        }).then(result => {
            if (result.rows.length == 0) return 0;
            let params = result.rows[0].params;
            let total = parseInt(params.split(" ")[0])-1;
            let mod = total % pagesize;
            let dif = total - mod;
            let pages = dif / pagesize;
            if (mod > 0) {
                pages +=1;
            }
            this.activity.total = total;
            console.log("VapaeeDEX.getActivityTotalPages() total: ", total, " pages: ", pages);
            return pages;
        });
    }

    async getTransactionHistory(commodity:TokenDEX, currency:TokenDEX, page:number = -1, pagesize:number = -1, force:boolean = false): Promise<any> {
        let scope:string = this.canonicalScope(this.getScopeFor(commodity, currency));
        let aux = null;
        let result = null;
        this.feed.setLoading("history."+scope, true);
        aux = this.waitOrderSummary.then(async _ => {
            if (pagesize == -1) {
                pagesize = 10;                
            }
            if (page == -1) {
                let pages = this.getHistoryTotalPagesFor(scope, pagesize);
                page = pages-3;
                if (page < 0) page = 0;
            }

            return Promise.all([
                this.fetchHistory(scope, page+0, pagesize),
                this.fetchHistory(scope, page+1, pagesize),
                this.fetchHistory(scope, page+2, pagesize)
            ]).then(_ => {
                this.feed.setLoading("history."+scope, false);
                return this.market(scope).history;
            }).catch(e => {
                this.feed.setLoading("history."+scope, false);
                throw e;
            });
        });

        if (this.market(scope) && !force) {
            result = this.market(scope).history;
        } else {
            result = aux;
        }

        this.onHistoryChange.next(result);

        return result;
    }

    private auxHourToLabel(hour:number): string {
        let d = new Date(hour * 1000 * 60 * 60);
        let label = d.getHours() == 0 ? this.datePipe.transform(d, 'dd/MM') : d.getHours() + "h";
        
        return label;
    }

    async getBlockHistory(commodity:TokenDEX, currency:TokenDEX, page:number = -1, pagesize:number = -1, force:boolean = false): Promise<any> {
        console.log("VapaeeDEX.getBlockHistory()", commodity.symbol, page, pagesize);
        // // elapsed time
        // let startTime:Date = new Date();
        // let diff:number;
        // let sec:number;

        let scope:string = this.canonicalScope(this.getScopeFor(commodity, currency));
        let aux = null;
        let result = null;
        this.feed.setLoading("block-history."+scope, true);

        aux = this.waitOrderSummary.then(async _ => {
            let fetchBlockHistoryStart:Date = new Date();
            let pages = 0;
            if (pagesize == -1) {
                pagesize = 10;
            }
            if (page == -1) {
                pages = this.getBlockHistoryTotalPagesFor(scope, pagesize);
                page = pages-3;
                if (page < 0) page = 0;
            }
            let promises = [];
            for (let i=0; i<=pages; i++) {
                let promise = this.fetchBlockHistory(scope, i, pagesize);
                promises.push(promise);
            }

            return Promise.all(promises).then(_ => {
                // // elapsed time
                // let fetchBlockHistoryTime:Date = new Date();
                // diff = fetchBlockHistoryTime.getTime() - fetchBlockHistoryStart.getTime();
                // sec = diff / 1000;
                // console.log("** VapaeeDEX.getBlockHistory() fetchBlockHistoryTime sec: ", sec, "(",diff,")");


                this.feed.setLoading("block-history."+scope, false);
                let market: Market = this.market(scope);
                market.blocklist = [];
                market.reverseblocks = [];
                let now = new Date();
                let hora = 1000 * 60 * 60;
                let hour = Math.floor(now.getTime()/hora);
                // console.log("->", hour);
                let last_block = null;
                let last_hour = null;

                let ordered_blocks = [];
                for (let i in market.block) {
                    ordered_blocks.push(market.block[i]);
                }

                ordered_blocks.sort(function(a:HistoryBlock, b:HistoryBlock) {
                    if(a.hour < b.hour) return -11;
                    return 1;
                });



                for (let i in ordered_blocks) {
                    let block:HistoryBlock = ordered_blocks[i];
                    let label = this.auxHourToLabel(block.hour);
                    /*
                    // console.log("->", i, label, block);
                    let date = block.date;
                    let dif = now.getTime() - block.date.getTime();
                    let mes = 30 * 24 * hora;
                    let elapsed_months = dif / mes;
                    if (elapsed_months > 3) {
                        console.log("dropping block too old", [block, block.date.toUTCString()]);
                        continue;
                    }
                    */
                   let aux;
                    if (last_block) {
                        let dif = block.hour - last_block.hour;
                        for (let j=1; j<dif; j++) {
                            let label_i = this.auxHourToLabel(last_block.hour+j);
                            // console.log("-->", j, label_i, block);

                            // coninical ----------------------------
                            let price = last_block.price.amount.toNumber();
                            aux = [label_i, price, price, price, price];
                            market.blocklist.push(aux);
                            // reverse ----------------------------
                            let inverse = last_block.inverse.amount.toNumber();
                            aux = [label_i, inverse, inverse, inverse, inverse];
                            market.reverseblocks.push(aux);
                        }
                    }
                    let obj:any[];
                    // coninical ----------------------------
                    obj = [label];
                    obj.push(block.max.amount.toNumber());
                    obj.push(block.entrance.amount.toNumber());
                    obj.push(block.price.amount.toNumber());
                    obj.push(block.min.amount.toNumber());
                    market.blocklist.push(obj);
                    // reverse ----------------------------
                    obj = [label];
                    obj.push(1.0/block.max.amount.toNumber());
                    obj.push(1.0/block.entrance.amount.toNumber());
                    obj.push(1.0/block.price.amount.toNumber());
                    obj.push(1.0/block.min.amount.toNumber());
                    market.reverseblocks.push(obj);
                    last_block = block;
                }

                let aux;
                if (last_block && hour != last_block.hour) {
                    let dif = hour - last_block.hour;
                    for (let j=1; j<=dif; j++) {
                        let label_i = this.auxHourToLabel(last_block.hour+j);

                        // coninical ----------------------------
                        let price = last_block.price.amount.toNumber();
                        aux = [label_i, price, price, price, price];
                        market.blocklist.push(aux);

                        // reverse ----------------------------
                        let inverse = last_block.inverse.amount.toNumber();
                        aux = [label_i, inverse, inverse, inverse, inverse];
                        market.reverseblocks.push(aux);
                    }
                }

                // // elapsed time
                // let firstLevelTime:Date = new Date();
                // diff = firstLevelTime.getTime() - fetchBlockHistoryTime.getTime();
                // sec = diff / 1000;
                // console.log("** VapaeeDEX.getBlockHistory() firstLevelTime sec: ", sec, "(",diff,")");                
                
                // console.log("---------------->", market.blocklist);
                // this.onBlocklistChange.next(market.blocklist);
                return market;
            }).then(market => {
                // // elapsed time
                // let allLevelsStart:Date = new Date();                
                
                let limit = 256;
                let levels = [market.blocklist];
                let reverses = [market.reverseblocks];
                for (let current = 0; levels[current].length > limit; current++) {
                    // console.log(current ,levels[current].length);
                    let newlevel:any[][] = [];
                    let newreverse:any[][] = [];
                    let merged:any[] = [];
                    for (let i=0; i<levels[current].length; i+=2) {
                        // canonical -----------------------------
                        let v_1:any[] = levels[current][i];
                        let v_2 = levels[current][i+1];
                        let merged = [];
                        for (let x=0; x<5; x++) merged[x] = v_1[x]; // clean copy
                        if (v_2) {
                            merged[0] = v_1[0].split("/").length > 1 ? v_1[0] : v_2[0];
                            merged[1] = Math.max(v_1[1], v_2[1]);
                            merged[2] = v_1[2];
                            merged[3] = v_2[3];
                            merged[4] = Math.min(v_1[4], v_2[4]);
                        }
                        newlevel.push(merged);

                        // reverse ------------------------------
                        v_1 = reverses[current][i];
                        v_2 = reverses[current][i+1];
                        merged = [];
                        for (let x=0; x<5; x++) merged[x] = v_1[x]; // clean copy
                        if (v_2) {
                            merged[0] = v_1[0].split("/").length > 1 ? v_1[0] : v_2[0];
                            merged[1] = Math.min(v_1[1], v_2[1]);
                            merged[2] = v_1[2];
                            merged[3] = v_2[3];
                            merged[4] = Math.max(v_1[4], v_2[4]);
                        }

                        
                        newreverse.push(merged);
                    }

                    levels.push(newlevel);
                    reverses.push(newreverse);
                }
                

                market.blocklevels = levels;
                market.reverselevels = reverses;
                
                // ---------------------
                // market.blocklevels = [market.blocklist];
                // market.reverselevels = [market.reverseblocks];
                

                
                // // elapsed time
                // let allLevelsTime:Date = new Date();
                // diff = allLevelsTime.getTime() - allLevelsStart.getTime();
                // sec = diff / 1000;
                // console.log("** VapaeeDEX.getBlockHistory() allLevelsTime sec: ", sec, "(",diff,")");

                return market.block;
            }).catch(e => {
                this.feed.setLoading("block-history."+scope, false);
                throw e;
            });
        });

        if (this.market(scope) && !force) {
            result = this.market(scope).block;
        } else {
            result = aux;
        }

        this.onHistoryChange.next(result);

        return result;
    }

    async getSellOrders(commodity:TokenDEX, currency:TokenDEX, force:boolean = false): Promise<any> {
        let scope:string = this.getScopeFor(commodity, currency);
        let canonical:string = this.canonicalScope(scope);
        let reverse:string = this.inverseScope(canonical);
        let aux = null;
        let result = null;
        this.feed.setLoading("sellorders", true);
        aux = this.waitTokensLoaded.then(async _ => {
            let orders = await this.fetchOrders({scope:canonical, limit:100, index_position: "2", key_type: "i64"});
            this._markets[canonical] = this.auxAssertScope(canonical);
            // if(scope=="vpe.tlos" || scope=="cnt.tlos")console.log("-------------");
            // if(scope=="vpe.tlos" || scope=="cnt.tlos")console.log("Sell crudo:", orders);
            let sell: Order[] = this.auxProcessRowsToOrders(orders.rows);
            sell.sort(function(a:Order, b:Order) {
                if(a.price.amount.isLessThan(b.price.amount)) return -11;
                if(a.price.amount.isGreaterThan(b.price.amount)) return 1;
                return 0;
            });
            // if(scope=="vpe.tlos" || scope=="cnt.tlos")console.log("sorted:", sell);
            // grouping together orders with the same price.
            let list: OrderRow[] = [];
            let row: OrderRow;
            if (sell.length > 0) {
                for(let i=0; i<sell.length; i++) {
                    let order: Order = sell[i];
                    if (list.length > 0) {
                        row = list[list.length-1];
                        if (row.price.amount.eq(order.price.amount)) {
                            row.total.amount = row.total.amount.plus(order.total.amount);
                            row.telos.amount = row.telos.amount.plus(order.telos.amount);
                            row.owners[order.owner] = true;
                            row.orders.push(order);
                            continue;
                        }    
                    }
                    row = {
                        str: order.price.toString(),
                        price: order.price,
                        orders: [],
                        total: order.total.clone(),
                        telos: order.telos.clone(),
                        inverse: order.inverse,
                        sum: null,
                        sumtelos: null,
                        owners: {}
                    }

                    row.owners[order.owner] = true;
                    row.orders.push(order);
                    list.push(row);
                }
            }

            let sum = new BigNumber(0);
            let sumtelos = new BigNumber(0);
            for (let j in list) {
                let order_row = list[j];
                sumtelos = sumtelos.plus(order_row.telos.amount);
                sum = sum.plus(order_row.total.amount);
                order_row.sumtelos = new AssetDEX(sumtelos, order_row.telos.token);
                order_row.sum = new AssetDEX(sum, order_row.total.token);
            }

            this._markets[canonical].orders.sell = list;
            // if(scope=="vpe.tlos" || scope=="cnt.tlos")console.log("Sell final:", this.scopes[scope].orders.sell);
            // if(scope=="vpe.tlos" || scope=="cnt.tlos")console.log("-------------");

            this.feed.setLoading("sellorders", false);            
            return this._markets[canonical].orders.sell;
        });

        if (this._markets[canonical] && !force) {
            result = this._markets[canonical].orders.sell;
        } else {
            result = aux;
        }
        return result;
    }
    
    async getBuyOrders(commodity:TokenDEX, currency:TokenDEX, force:boolean = false): Promise<any> {
        let scope:string = this.getScopeFor(commodity, currency);
        let canonical:string = this.canonicalScope(scope);
        let reverse:string = this.inverseScope(canonical);


        let aux = null;
        let result = null;
        this.feed.setLoading("buyorders", true);
        aux = this.waitTokensLoaded.then(async _ => {
            let orders = await await this.fetchOrders({scope:reverse, limit:50, index_position: "2", key_type: "i64"});
            this._markets[canonical] = this.auxAssertScope(canonical);
            // console.log("-------------");
            // console.log("Buy crudo:", orders);            
            let buy: Order[] = this.auxProcessRowsToOrders(orders.rows);
            buy.sort(function(a:Order, b:Order){
                if(a.price.amount.isLessThan(b.price.amount)) return 1;
                if(a.price.amount.isGreaterThan(b.price.amount)) return -1;
                return 0;
            });

            // console.log("buy sorteado:", buy);

            // grouping together orders with the same price.
            let list: OrderRow[] = [];
            let row: OrderRow;
            if (buy.length > 0) {
                for(let i=0; i<buy.length; i++) {
                    let order: Order = buy[i];
                    if (list.length > 0) {
                        row = list[list.length-1];
                        if (row.price.amount.eq(order.price.amount)) {
                            row.total.amount = row.total.amount.plus(order.total.amount);
                            row.telos.amount = row.telos.amount.plus(order.telos.amount);
                            row.owners[order.owner] = true;
                            row.orders.push(order);
                            continue;
                        }    
                    }
                    row = {
                        str: order.price.toString(),
                        price: order.price,
                        orders: [],
                        total: order.total.clone(),
                        telos: order.telos.clone(),
                        inverse: order.inverse,
                        sum: null,
                        sumtelos: null,
                        owners: {}
                    }

                    row.owners[order.owner] = true;
                    row.orders.push(order);
                    list.push(row);
                }
            }            

            let sum = new BigNumber(0);
            let sumtelos = new BigNumber(0);
            for (let j in list) {
                let order_row = list[j];
                sumtelos = sumtelos.plus(order_row.telos.amount);
                sum = sum.plus(order_row.total.amount);
                order_row.sumtelos = new AssetDEX(sumtelos, order_row.telos.token);
                order_row.sum = new AssetDEX(sum, order_row.total.token);
            }

            this._markets[canonical].orders.buy = list;
            // console.log("Buy final:", this.scopes[scope].orders.buy);
            // console.log("-------------");
            this.feed.setLoading("buyorders", false);
            return this._markets[canonical].orders.buy;
        });

        if (this._markets[canonical] && !force) {
            result = this._markets[canonical].orders.buy;
        } else {
            result = aux;
        }
        return result;
    }
    
    async getOrderSummary(): Promise<any> {
        console.log("VapaeeDEX.getOrderSummary()");
        let tables = await this.fetchOrderSummary();

        for (let i in tables.rows) {
            let scope:string = tables.rows[i].table;
            let canonical = this.canonicalScope(scope);
            console.assert(scope == canonical, "ERROR: scope is not canonical", scope, [i, tables]);
            this._markets[canonical] = this.auxAssertScope(canonical);

            // console.log(i, tables.rows[i]);

            this._markets[canonical].header.sell.total = new AssetDEX(tables.rows[i].supply.total, this);
            this._markets[canonical].header.sell.orders = tables.rows[i].supply.orders;
            this._markets[canonical].header.buy.total = new AssetDEX(tables.rows[i].demand.total, this);
            this._markets[canonical].header.buy.orders = tables.rows[i].demand.orders;
            this._markets[canonical].deals = tables.rows[i].deals;
            this._markets[canonical].blocks = tables.rows[i].blocks;
            this._markets[canonical].direct = tables.rows[i].demand.ascurrency;
            this._markets[canonical].inverse = tables.rows[i].supply.ascurrency;
        }
        
        this.setOrderSummary();
    }

    async getMarketSummary(token_a:TokenDEX, token_b:TokenDEX, force:boolean = false): Promise<MarketSummary> {
        let scope:string = this.getScopeFor(token_a, token_b);
        let canonical:string = this.canonicalScope(scope);
        let inverse:string = this.inverseScope(canonical);

        let commodity = this.auxGetcommodityToken(canonical); 
        let currency = this.auxGetCurrencyToken(canonical);

        let ZERO_commodity = "0.00000000 " + commodity.symbol;
        let ZERO_CURRENCY = "0.00000000 " + currency.symbol;

        this.feed.setLoading("summary."+canonical, true);
        this.feed.setLoading("summary."+inverse, true);
        let aux = null;
        let result:MarketSummary = null;
        aux = this.waitTokensLoaded.then(async _ => {
            let summary = await this.fetchSummary(canonical);
            //if(canonical=="telosd.tlos")console.log(scope, "---------------------------------------------------");
            //if(canonical=="telosd.tlos")console.log("Summary crudo:", summary.rows);

            this._markets[canonical] = this.auxAssertScope(canonical);
            this._markets[canonical].summary = {
                scope: canonical,
                price: new AssetDEX(new BigNumber(0), currency),
                price_24h_ago: new AssetDEX(new BigNumber(0), currency),
                inverse: new AssetDEX(new BigNumber(0), commodity),
                inverse_24h_ago: new AssetDEX(new BigNumber(0), commodity),
                volume: new AssetDEX(new BigNumber(0), currency),
                amount: new AssetDEX(new BigNumber(0), commodity),
                percent: 0.3,
                records: summary.rows
            };

            let now:Date = new Date();
            let now_sec: number = Math.floor(now.getTime() / 1000);
            let now_hour: number = Math.floor(now_sec / 3600);
            let start_hour = now_hour - 23;
            //if(canonical=="telosd.tlos")console.log("now_hour:", now_hour);
            //if(canonical=="telosd.tlos")console.log("start_hour:", start_hour);

            // proceso los datos crudos 
            let price = ZERO_CURRENCY;
            let inverse = ZERO_commodity;
            let crude = {};
            let last_hh = 0;
            for (let i=0; i<summary.rows.length; i++) {
                let hh = summary.rows[i].hour;
                if (summary.rows[i].label == "lastone") {
                    // price = summary.rows[i].price;
                } else {
                    crude[hh] = summary.rows[i];
                    if (last_hh < hh && hh < start_hour) {
                        last_hh = hh;
                        price = summary.rows[i].price;
                        inverse = summary.rows[i].inverse;

                        // price = (scope == canonical) ? summary.rows[i].price : summary.rows[i].inverse;
                        // inverse = (scope == canonical) ? summary.rows[i].inverse : summary.rows[i].price;
                        //if(canonical=="telosd.tlos")console.log("hh:", hh, "last_hh:", last_hh, "price:", price);
                    }    
                }
                /*
                */
            }
            //if(canonical=="telosd.tlos")console.log("crude:", crude);
            //if(canonical=="telosd.tlos")console.log("price:", price);

            // genero una entrada por cada una de las últimas 24 horas
            let last_24h = {};
            let volume = new AssetDEX(ZERO_CURRENCY, this);
            let amount = new AssetDEX(ZERO_commodity, this);
            let price_asset = new AssetDEX(price, this);
            let inverse_asset = new AssetDEX(inverse, this);
            // if(canonical=="cnt.tlos")console.log("price ", price);
            let max_price = price_asset.clone();
            let min_price = price_asset.clone();
            let max_inverse = inverse_asset.clone();
            let min_inverse = inverse_asset.clone();
            let price_fst:AssetDEX = null;
            let inverse_fst:AssetDEX = null;
            for (let i=0; i<24; i++) {
                let current = start_hour+i;
                let current_date = new Date(current * 3600 * 1000);
                let nuevo:any = crude[current];
                if (nuevo) {
                    
                } else {
                    nuevo = {
                        label: this.auxGetLabelForHour(current % 24),
                        price: price,
                        inverse: inverse,
                        volume: ZERO_CURRENCY,
                        amount: ZERO_commodity,
                        date: current_date.toISOString().split(".")[0],
                        hour: current
                    };
                }
                last_24h[current] = crude[current] || nuevo;
                //if(canonical=="telosd.tlos")console.log("current_date:", current_date.toISOString(), current, last_24h[current]);

                // coninical ----------------------------
                price = last_24h[current].price;
                let vol = new AssetDEX(last_24h[current].volume, this);
                console.assert(vol.token.symbol == volume.token.symbol, "ERROR: different tokens", vol.str, volume.str);
                volume.amount = volume.amount.plus(vol.amount);
                if (price != ZERO_CURRENCY && !price_fst) {
                    price_fst = new AssetDEX(price, this);
                }
                price_asset = new AssetDEX(price, this);
                console.assert(price_asset.token.symbol == max_price.token.symbol, "ERROR: different tokens", price_asset.str, max_price.str);
                if (price_asset.amount.isGreaterThan(max_price.amount)) {
                    max_price = price_asset.clone();
                }
                console.assert(price_asset.token.symbol == min_price.token.symbol, "ERROR: different tokens", price_asset.str, min_price.str);
                if (min_price.amount.isEqualTo(0) || price_asset.amount.isLessThan(min_price.amount)) {
                    min_price = price_asset.clone();
                }

                // reverse ----------------------------
                inverse = last_24h[current].inverse;
                let amo = new AssetDEX(last_24h[current].amount, this);
                console.assert(amo.token.symbol == amount.token.symbol, "ERROR: different tokens", amo.str, amount.str);
                amount.amount = amount.amount.plus(amo.amount);
                if (inverse != ZERO_commodity && !inverse_fst) {
                    inverse_fst = new AssetDEX(inverse, this);
                }
                inverse_asset = new AssetDEX(inverse, this);
                console.assert(inverse_asset.token.symbol == max_inverse.token.symbol, "ERROR: different tokens", inverse_asset.str, max_inverse.str);
                if (inverse_asset.amount.isGreaterThan(max_inverse.amount)) {
                    max_inverse = inverse_asset.clone();
                }
                console.assert(inverse_asset.token.symbol == min_inverse.token.symbol, "ERROR: different tokens", inverse_asset.str, min_inverse.str);
                if (min_inverse.amount.isEqualTo(0) || inverse_asset.amount.isLessThan(min_inverse.amount)) {
                    min_inverse = inverse_asset.clone();
                }
            }            
            // coninical ----------------------------
            if (!price_fst) {
                price_fst = new AssetDEX(last_24h[start_hour].price, this);
            }
            let last_price =  new AssetDEX(last_24h[now_hour].price, this);
            let diff = last_price.clone();
            // diff.amount 
            diff.amount = last_price.amount.minus(price_fst.amount);
            let ratio:number = 0;
            if (price_fst.amount.toNumber() != 0) {
                ratio = diff.amount.dividedBy(price_fst.amount).toNumber();
            }
            let percent = Math.floor(ratio * 10000) / 100;

            // reverse ----------------------------
            if (!inverse_fst) {
                inverse_fst = new AssetDEX(last_24h[start_hour].inverse, this);
            }
            let last_inverse =  new AssetDEX(last_24h[now_hour].inverse, this);
            let idiff = last_inverse.clone();
            // diff.amount 
            idiff.amount = last_inverse.amount.minus(inverse_fst.amount);
            ratio = 0;
            if (inverse_fst.amount.toNumber() != 0) {
                ratio = idiff.amount.dividedBy(inverse_fst.amount).toNumber();
            }
            let ipercent = Math.floor(ratio * 10000) / 100;
            //if(canonical=="telosd.tlos")console.log("price_fst:", price_fst.str);
            //if(canonical=="telosd.tlos")console.log("inverse_fst:", inverse_fst.str);

            //if(canonical=="telosd.tlos")console.log("last_24h:", [last_24h]);
            //if(canonical=="telosd.tlos")console.log("diff:", diff.toString(8));
            //if(canonical=="telosd.tlos")console.log("percent:", percent);
            //if(canonical=="telosd.tlos")console.log("ratio:", ratio);
            //if(canonical=="telosd.tlos")console.log("volume:", volume.str);

            this._markets[canonical].summary.price = last_price;
            this._markets[canonical].summary.inverse = last_inverse;
            this._markets[canonical].summary.price_24h_ago = price_fst || last_price;
            this._markets[canonical].summary.inverse_24h_ago = inverse_fst;
            this._markets[canonical].summary.percent_str = (isNaN(percent) ? 0 : percent) + "%";
            this._markets[canonical].summary.percent = isNaN(percent) ? 0 : percent;
            this._markets[canonical].summary.ipercent_str = (isNaN(ipercent) ? 0 : ipercent) + "%";
            this._markets[canonical].summary.ipercent = isNaN(ipercent) ? 0 : ipercent;
            this._markets[canonical].summary.volume = volume;
            this._markets[canonical].summary.amount = amount;
            this._markets[canonical].summary.min_price = min_price;
            this._markets[canonical].summary.max_price = max_price;
            this._markets[canonical].summary.min_inverse = min_inverse;
            this._markets[canonical].summary.max_inverse = max_inverse;

            //if(canonical=="telosd.tlos")console.log("Summary final:", this._markets[canonical].summary);
            //if(canonical=="telosd.tlos")console.log("---------------------------------------------------");
            this.feed.setLoading("summary."+canonical, false);
            this.feed.setLoading("summary."+inverse, false);
            return this._markets[canonical].summary;
        });

        if (this._markets[canonical] && !force) {
            result = this._markets[canonical].summary;
        } else {
            result = await aux;
        }

        this.resortTopMarkets();
        this.setMarketSummary();
        this.onMarketSummary.next(result);

        return result;
    }

    async getAllTablesSumaries(): Promise<any> {
        return this.waitOrderSummary.then(async _ => {
            let promises = [];

            for (let i in this._markets) {
                if (i.indexOf(".") == -1) continue;
                let p = this.getMarketSummary(this._markets[i].commodity, this._markets[i].currency, true);
                promises.push(p);
            }

            return Promise.all(promises).then(_ => {
                this.updateTokensSummary();
            });
        })
    }
    

    //
    // --------------------------------------------------------------
    // Aux functions
    private auxProcessRowsToOrders(rows:any[]): Order[] {
        let result: Order[] = [];
        for (let i=0; i < rows.length; i++) {
            let price = new AssetDEX(rows[i].price, this);
            let inverse = new AssetDEX(rows[i].inverse, this);
            let selling = new AssetDEX(rows[i].selling, this);
            let total = new AssetDEX(rows[i].total, this);
            let order:Order;

            let scope = this.getScopeFor(price.token, inverse.token);
            let canonical = this.canonicalScope(scope);
            let reverse_scope = this.inverseScope(canonical);
            

            if (reverse_scope == scope) {
                order = {
                    id: rows[i].id,
                    price: price,
                    inverse: inverse,
                    total: selling,
                    deposit: selling,
                    telos: total,
                    owner: rows[i].owner
                }
            } else {
                order = {
                    id: rows[i].id,
                    price: inverse,
                    inverse: price,
                    total: total,
                    deposit: selling,
                    telos: selling,
                    owner: rows[i].owner
                }
            }
            result.push(order);
        }
        return result;
    }

    private auxGetLabelForHour(hh:number): string {
        let hours = [
            "h.zero",
            "h.one",
            "h.two",
            "h.three",
            "h.four",
            "h.five",
            "h.six",
            "h.seven",
            "h.eight",
            "h.nine",
            "h.ten",
            "h.eleven",
            "h.twelve",
            "h.thirteen",
            "h.fourteen",
            "h.fifteen",
            "h.sixteen",
            "h.seventeen",
            "h.eighteen",
            "h.nineteen",
            "h.twenty",
            "h.twentyone",
            "h.twentytwo",
            "h.twentythree"
        ]
        return hours[hh];
    }

    private auxGetCurrencyToken(scope: string) {
        console.assert(!!scope, "ERROR: invalid scope: '"+ scope +"'");
        console.assert(scope.split(".").length == 2, "ERROR: invalid scope: '"+ scope +"'");
        let currency_sym = scope.split(".")[1].toUpperCase();
        let currency = this.getTokenNow(currency_sym);
        return currency;
    }

    private auxGetcommodityToken(scope: string) {
        console.assert(!!scope, "ERROR: invalid scope: '"+ scope +"'");
        console.assert(scope.split(".").length == 2, "ERROR: invalid scope: '"+ scope +"'");
        let commodity_sym = scope.split(".")[0].toUpperCase();
        let commodity = this.getTokenNow(commodity_sym);
        return commodity;        
    }

    private auxAssertScope(scope:string): Market {
        let commodity = this.auxGetcommodityToken(scope);
        let currency = this.auxGetCurrencyToken(scope);
        let aux_asset_com = new AssetDEX(0, commodity);
        let aux_asset_cur = new AssetDEX(0, currency);

        let market_summary:MarketSummary = {
            scope: scope,
            price: aux_asset_cur,
            price_24h_ago: aux_asset_cur,
            inverse: aux_asset_com,
            inverse_24h_ago: aux_asset_com,
            max_inverse: aux_asset_com,
            max_price: aux_asset_cur,
            min_inverse: aux_asset_com,
            min_price: aux_asset_cur,
            records: [],
            volume: aux_asset_cur,
            amount: aux_asset_com,
            percent: 0,
            ipercent: 0,
            percent_str: "0%",
            ipercent_str: "0%",
        }

        return this._markets[scope] || {
            scope: scope,
            commodity: commodity,
            currency: currency,
            orders: { sell: [], buy: [] },
            deals: 0,
            direct: 0,
            inverse: 0,
            history: [],
            tx: {},
            blocks: 0,
            block: {},
            blocklist: [],
            blocklevels: [[]],
            reverseblocks: [],
            reverselevels: [[]],
            summary: market_summary,
            header: { 
                sell: {total:aux_asset_com, orders:0}, 
                buy: {total:aux_asset_cur, orders:0}
            },
        };        
    }

    private fetchDeposits(account): Promise<TableResult> {
        return this.contract.getTable("deposits", {scope:account}).then(result => {
            return result;
        });
    }

    private async fetchBalances(account): Promise<any> {
        console.log("VapaeeDex.fetchBalances() ------ (ini)");
        return this.waitTokensLoaded.then(async _ => {
            let contracts = {};
            for (let i in this.tokens) {
                if (this.tokens[i].offchain) continue;
                contracts[this.tokens[i].contract] = true;
            }
            let promises:Promise<any>[] = [];         
            for (let contract in contracts) {
                promises.push(this.fetchBalancesOnContract(account, contract));
            }
            return Promise.all(promises).then(result => {
                console.log("VapaeeDex.fetchBalances() ------ (fin 1) -----");
                let _balances = [];
                for (let i=0; i<result.length; i++) {
                    _balances = _balances.concat(result[i]);
                }
                console.log(_balances);
                this.balances = _balances;
                delete this._dexdata;
                console.log("VapaeeDex.fetchBalances() ------ (fin 2) -----");
            }).then(_ => this.balances);
        });
    }

    private async fetchBalancesOnContract(account:string, contract:string) {
        // console.log("VapaeeDex.fetchBalancesOnContract()", account, contract);
        this.feed.setLoading("balances-"+contract, true);
        let result = await this.contract.getTable("accounts", {
            contract:contract,
            scope: account || this.current.name
        });
        let _balances = [];
        for (let i in result.rows) {
            let _balance = new AssetDEX(result.rows[i].balance, this);
            if (_balance.token) {
                console.log("adding balance: ", result.rows[i].balance, "(" + contract + ")");
                _balances.push(_balance);
            } else {
                console.warn("Token found but not registered on contract", contract, result.rows[i].balance);
            }
        }
        // this.balances = _balances.concat(this.balances);
        // delete this._dexdata
        this.feed.setLoading("balances-"+contract, false);
        return _balances;
    }

    private fetchOrders(params:TableParams): Promise<TableResult> {
        return this.contract.getTable("sellorders", params).then(result => {
            return result;
        });
    }

    private fetchOrderSummary(): Promise<TableResult> {
        return this.contract.getTable("ordersummary").then(result => {
            return result;
        });
    }

    private fetchBlockHistory(scope:string, page:number = 0, pagesize:number = 25): Promise<TableResult> {
        let canonical:string = this.canonicalScope(scope);
        let pages = this.getBlockHistoryTotalPagesFor(canonical, pagesize);
        let id = page*pagesize;
        // console.log("VapaeeDEX.fetchBlockHistory(", scope, ",",page,",",pagesize,"): id:", id, "pages:", pages);
        if (page < pages) {
            if (this._markets && this._markets[canonical] && this._markets[canonical].block["id-" + id]) {
                let result:TableResult = {more:false,rows:[]};
                for (let i=0; i<pagesize; i++) {
                    let id_i = id+i;
                    let block = this._markets[canonical].block["id-" + id_i];
                    if (block) {
                        result.rows.push(block);
                    } else {
                        break;
                    }
                }
                if (result.rows.length == pagesize) {
                    // we have the complete page in memory
                    // console.log("VapaeeDEX.fetchHistory(", scope, ",",page,",",pagesize,"): result:", result.rows.map(({ id }) => id));
                    return Promise.resolve(result);
                }                
            }
        }

        return this.contract.getTable("blockhistory", {scope:canonical, limit:pagesize, lower_bound:""+(page*pagesize)}).then(result => {
            // console.log("block History crudo:", result);
            this._markets[canonical] = this.auxAssertScope(canonical);
            this._markets[canonical].block = this._markets[canonical].block || {}; 
            // console.log("this._markets[scope].block:", this._markets[scope].block);
            for (let i=0; i < result.rows.length; i++) {
                let block:HistoryBlock = {
                    id: result.rows[i].id,
                    hour: result.rows[i].hour,
                    str: "",
                    price: new AssetDEX(result.rows[i].price, this),
                    inverse: new AssetDEX(result.rows[i].inverse, this),
                    entrance: new AssetDEX(result.rows[i].entrance, this),
                    max: new AssetDEX(result.rows[i].max, this),
                    min: new AssetDEX(result.rows[i].min, this),
                    volume: new AssetDEX(result.rows[i].volume, this),
                    amount: new AssetDEX(result.rows[i].amount, this),
                    date: new Date(result.rows[i].date)
                }
                block.str = JSON.stringify([block.max.str, block.entrance.str, block.price.str, block.min.str]);
                this._markets[canonical].block["id-" + block.id] = block;
            }   
            // console.log("block History final:", this._markets[scope].block);
            // console.log("-------------");
            return result;
        });
    }    

    private fetchHistory(scope:string, page:number = 0, pagesize:number = 25): Promise<TableResult> {
        let canonical:string = this.canonicalScope(scope);
        let pages = this.getHistoryTotalPagesFor(canonical, pagesize);
        let id = page*pagesize;
        // console.log("VapaeeDEX.fetchHistory(", scope, ",",page,",",pagesize,"): id:", id, "pages:", pages);
        if (page < pages) {
            if (this._markets && this._markets[canonical] && this._markets[canonical].tx["id-" + id]) {
                let result:TableResult = {more:false,rows:[]};
                for (let i=0; i<pagesize; i++) {
                    let id_i = id+i;
                    let trx = this._markets[canonical].tx["id-" + id_i];
                    if (trx) {
                        result.rows.push(trx);
                    } else {
                        break;
                    }
                }
                if (result.rows.length == pagesize) {
                    // we have the complete page in memory
                    // console.log("VapaeeDEX.fetchHistory(", scope, ",",page,",",pagesize,"): result:", result.rows.map(({ id }) => id));
                    return Promise.resolve(result);
                }                
            }
        }

        return this.contract.getTable("history", {scope:scope, limit:pagesize, lower_bound:""+(page*pagesize)}).then(result => {
            // console.log("History crudo:", result);
            
            this._markets[canonical] = this.auxAssertScope(canonical);
            this._markets[canonical].history = [];
            this._markets[canonical].tx = this._markets[canonical].tx || {}; 

            // console.log("this.scopes[scope].tx:", this.scopes[scope].tx);

            for (let i=0; i < result.rows.length; i++) {
                let transaction:HistoryTx = {
                    id: result.rows[i].id,
                    str: "",
                    amount: new AssetDEX(result.rows[i].amount, this),
                    payment: new AssetDEX(result.rows[i].payment, this),
                    buyfee: new AssetDEX(result.rows[i].buyfee, this),
                    sellfee: new AssetDEX(result.rows[i].sellfee, this),
                    price: new AssetDEX(result.rows[i].price, this),
                    inverse: new AssetDEX(result.rows[i].inverse, this),
                    buyer: result.rows[i].buyer,
                    seller: result.rows[i].seller,
                    date: new Date(result.rows[i].date),
                    isbuy: !!result.rows[i].isbuy
                }
                transaction.str = transaction.price.str + " " + transaction.amount.str;
                this._markets[canonical].tx["id-" + transaction.id] = transaction;
            }

            for (let j in this._markets[canonical].tx) {
                this._markets[canonical].history.push(this._markets[canonical].tx[j]);
            }

            this._markets[canonical].history.sort(function(a:HistoryTx, b:HistoryTx){
                if(a.date < b.date) return 1;
                if(a.date > b.date) return -1;
                if(a.id < b.id) return 1;
                if(a.id > b.id) return -1;
            });            

            // console.log("History final:", this.scopes[scope].history);
            // console.log("-------------");
            return result;
        });
    }
    
    private async fetchActivity(page:number = 0, pagesize:number = 25) {
        let id = page*pagesize+1;
        // console.log("VapaeeDEX.fetchActivity(", page,",",pagesize,"): id:", id);
        
        if (this.activity.events["id-" + id]) {
            let pageEvents = [];
            for (let i=0; i<pagesize; i++) {
                let id_i = id+i;
                let event = this.activity.events["id-" + id_i];
                if (!event) {
                    break;
                }
            }
            if (pageEvents.length == pagesize) {
                return;
            }                
        }        

        return this.contract.getTable("events", {limit:pagesize, lower_bound:""+id}).then(result => {
            // console.log("Activity crudo:", result);
            let list:EventLog[] = [];

            for (let i=0; i < result.rows.length; i++) {
                let id = result.rows[i].id;
                let event:EventLog = <EventLog>result.rows[i];
                if (!this.activity.events["id-" + id]) {
                    this.activity.events["id-" + id] = event;
                    list.push(event);
                }
            }

            this.activity.list = [].concat(this.activity.list).concat(list);
            this.activity.list.sort(function(a:EventLog, b:EventLog){
                if(a.date < b.date) return 1;
                if(a.date > b.date) return -1;
                if(a.id < b.id) return 1;
                if(a.id > b.id) return -1;
            });

        });

    }

    private fetchUserOrders(user:string): Promise<TableResult> {
        return this.contract.getTable("userorders", {scope:user, limit:200}).then(result => {
            return result;
        });
    }
    
    private fetchSummary(scope): Promise<TableResult> {
        return this.contract.getTable("tablesummary", {scope:scope}).then(result => {
            return result;
        });
    }

    public fetchTokenStats(token): Promise<TableResult> {
        this.feed.setLoading("token-stat-"+token.symbol, true);
        return this.contract.getTable("stat", {contract:token.contract, scope:token.symbol}).then(result => {
            token.stat = result.rows[0];
            this.feed.setLoading("token-stat-"+token.symbol, false);
            return token;
        });
    }

    public fetchTokenEvents(token): Promise<TableResult> {
        this.feed.setLoading("token-events-"+token.symbol, true);
        return this.contract.getTable("tokenevents", {scope:token.symbol}).then(result => {
            token.events = result.rows;
            this.feed.setLoading("token-events-"+token.symbol, false);
            return token;
        });
    }


    private fetchTokenData(token): Promise<TableResult> {
        this.feed.setLoading("token-data-"+token.symbol, true);
        return this.contract.getTable("tokendata", {scope:token.symbol}).then(result => {
            token.data = result.rows;
            this.feed.setLoading("token-data-"+token.symbol, false);
            return token;
        });
    }

    private fetchTokensStats(extended: boolean = true) {
        console.log("Vapaee.fetchTokensStats()");
        this.feed.setLoading("token-stats", true);
        return this.waitTokensLoaded.then(_ => {

            let priomises = [];
            for (let i in this.tokens) {
                if (this.tokens[i].offchain) continue;
                priomises.push(this.fetchTokenStats(this.tokens[i]));
            }

            return Promise.all<any>(priomises).then(result => {
                this.setTokenStats(this.tokens);
                this.feed.setLoading("token-stats", false);
                return this.tokens;
            });            
        });
    }

    private fetchTokensEvents() {
        console.log("Vapaee.fetchTokensEvents()");
        this.feed.setLoading("token-events", true);
        return this.waitTokensLoaded.then(_ => {

            let priomises = [];
            for (let i in this.tokens) {
                if (this.tokens[i].offchain) continue;
                priomises.push(this.fetchTokenEvents(this.tokens[i]));
            }

            return Promise.all<any>(priomises).then(result => {
                this.setTokenEvents(this.tokens);
                this.feed.setLoading("token-events", false);
                return this.tokens;
            });            
        });
    }

    private fetchTokensData() {
        console.log("Vapaee.fetchTokensData()");
        this.feed.setLoading("token-data", true);
        return this.waitTokensLoaded.then(_ => {

            let priomises = [];
            for (let i in this.tokens) {
                if (this.tokens[i].offchain) continue;
                priomises.push(this.fetchTokenData(this.tokens[i]));
            }

            return Promise.all<any>(priomises).then(result => {
                this.setTokenData(this.tokens);
                this.feed.setLoading("token-data", false);
                return this.tokens;
            });            
        });
    }

    // for each tokens this sorts its markets based on volume
    private updateTokensMarkets() {
        return Promise.all([
            this.waitTokensLoaded,
            this.waitMarketSummary
        ]).then(_ => {
            // a cada token le asigno un price que sale de verificar su price en el mercado principal XXX/TLOS
            let token;
            for (let i in this.tokens) {
                if (this.tokens[i].offchain) continue; // discard tokens that are not on-chain
                
                token = this.tokens[i];
                let quantity:AssetDEX = new AssetDEX(0, token);
                token.markets = [];

                for (let scope in this._markets) {
                    if (scope.indexOf(".") == -1) continue;
                    let table:Market = this._markets[scope];

                    if (table.currency.symbol == token.symbol) {
                        table = this.market(this.inverseScope(scope));
                    }

                    if (table.commodity.symbol == token.symbol) {
                        token.markets.push(table);
                    }
                }

                token.markets.sort((a:Market, b:Market) => {
                    // push offchain tokens to the end of the token list
                    let a_amount = a.summary ? a.summary.amount : new AssetDEX();
                    let b_amount = b.summary ? b.summary.amount : new AssetDEX();
        
                    console.assert(a_amount.token.symbol == b_amount.token.symbol, "ERROR: comparing two different tokens " + a_amount.str + ", " + b_amount.str)
                    if(a_amount.amount.isGreaterThan(b_amount.amount)) return -1;
                    if(a_amount.amount.isLessThan(b_amount.amount)) return 1;
    
                    return 0;
                });
    
            }
        });   
    }
    
    private updateTokensSummary(times: number = 20) {
        if (times > 1) {
            for (let i = times; i>0; i--) this.updateTokensSummary(1);
            this.resortTokens();
            return;
        }
        return Promise.all([
            this.waitTokensLoaded,
            this.waitMarketSummary
        ]).then(_ => {
            // console.log("(ini) ---------------------------------------------");
            // console.log("Vapaee.updateTokensSummary()"); 

            // mapping of how much (amount of) tokens have been traded agregated in all markets
            let amount_map:{[key:string]:AssetDEX} = {};

            // a cada token le asigno un price que sale de verificar su price en el mercado principal XXX/TLOS
            for (let i in this.tokens) {
                if (this.tokens[i].offchain) continue; // discard tokens that are not on-chain
                
                let token = this.tokens[i];
                let quantity:AssetDEX = new AssetDEX(0, token);

                for (let j in this._markets) {
                    if (j.indexOf(".") == -1) continue;
                    let table:Market = this._markets[j];
                    
                    if (table.commodity.symbol == token.symbol) {
                        quantity = quantity.plus(table.summary.amount);
                    }
                    if (table.currency.symbol == token.symbol) {
                        quantity = quantity.plus(table.summary.volume);
                    }

                    if (table.commodity.symbol == token.symbol && table.currency.symbol == this.telos.symbol) {
                        if (token.summary && token.summary.price.amount.toNumber() == 0) {
                            delete token.summary;
                        }
                        
                        token.summary = token.summary || {
                            price: table.summary.price.clone(),
                            price_24h_ago: table.summary.price_24h_ago.clone(),
                            volume: table.summary.volume.clone(),
                            percent: table.summary.percent,
                            percent_str: table.summary.percent_str,
                        }
                    }
                }

                token.summary = token.summary || {
                    price: new AssetDEX(0, this.telos),
                    price_24h_ago: new AssetDEX(0, this.telos),
                    volume: new AssetDEX(0, this.telos),
                    percent: 0,
                    percent_str: "0%",
                }

                amount_map[token.symbol] = quantity;
            }

            this.telos.summary = {
                price: new AssetDEX(1, this.telos),
                price_24h_ago: new AssetDEX(1, this.telos),
                volume: new AssetDEX(-1, this.telos),
                percent: 0,
                percent_str: "0%"
            }

            // console.log("amount_map: ", amount_map);


            
            let ONE = new BigNumber(1);

            for (let i in this.tokens) {
                let token = this.tokens[i];
                if (token.offchain) continue;
                if (!token.summary) continue;
                if (token.symbol == this.telos.symbol) continue;
                // console.log("TOKEN: -------- ", token.symbol, token.summary.price.str, token.summary.price_24h_ago.str );
                
                let volume = new AssetDEX(0, this.telos);
                let price = new AssetDEX(0, this.telos);
                let price_init = new AssetDEX(0, this.telos);
                let total_quantity = amount_map[token.symbol];

                if (total_quantity.toNumber() == 0) continue;

                // if (token.symbol == "ACORN") console.log("TOKEN: -------- ", token.symbol, token.summary.price.str, token.summary.price_24h_ago.str );
                for (let j in this._markets) {
                    if (j.indexOf(".") == -1) continue;
                    let table = this._markets[j];
                    let currency_price = table.currency.symbol == "TLOS" ? ONE : table.currency.summary.price.amount;
                    let currency_price_24h_ago = table.currency.symbol == "TLOS" ? ONE : table.currency.summary.price_24h_ago.amount;
                    if (table.commodity.symbol == token.symbol || table.currency.symbol == token.symbol) {

                        // how much quantity is involved in this market
                        let quantity = new AssetDEX();
                        if (table.commodity.symbol == token.symbol) {
                            quantity = table.summary.amount.clone();
                        } else if (table.currency.symbol == token.symbol) {
                            quantity = table.summary.volume.clone();
                        }

                        // calculate the influence-weight of this market over the token
                        let weight = quantity.amount.dividedBy(total_quantity.amount);

                        // calculate the price of this token in this market (expressed in TLOS)
                        let price_amount;
                        if (table.commodity.symbol == token.symbol) {
                            price_amount = table.summary.price.amount.multipliedBy(table.currency.summary.price.amount);
                        } else if (table.currency.symbol == token.symbol) {
                            price_amount = table.summary.inverse.amount.multipliedBy(table.commodity.summary.price.amount);
                        }

                        // calculate this market token price multiplied by the wight of this market (ponderated price)
                        let price_i = new AssetDEX(price_amount.multipliedBy(weight), this.telos);

                        // calculate the price of this token in this market 24h ago (expressed in TLOS)
                        let price_init_amount;
                        if (table.commodity.symbol == token.symbol) {
                            price_init_amount = table.summary.price_24h_ago.amount.multipliedBy(table.currency.summary.price_24h_ago.amount);
                        } else if (table.currency.symbol == token.symbol) {
                            price_init_amount = table.summary.inverse_24h_ago.amount.multipliedBy(table.commodity.summary.price_24h_ago.amount);
                        }

                        // calculate this market token price 24h ago multiplied by the weight of this market (ponderated init_price)
                        let price_init_i = new AssetDEX(price_init_amount.multipliedBy(weight), this.telos);

                        // how much volume is involved in this market
                        let volume_i;
                        if (table.commodity.symbol == token.symbol) {
                            volume_i = table.summary.volume.clone();
                        } else if (table.currency.symbol == token.symbol) {
                            volume_i = table.summary.amount.clone();
                        }

                        // if this market does not mesure the volume in TLOS, then convert quantity to TLOS by multiplied By volume's token price
                        if (volume_i.token.symbol != this.telos.symbol) {
                            volume_i = new AssetDEX(quantity.amount.multipliedBy(quantity.token.summary.price.amount), this.telos);
                        }
                        

                        price = price.plus(new AssetDEX(price_i, this.telos));
                        price_init = price_init.plus(new AssetDEX(price_init_i, this.telos));
                        volume = volume.plus(new AssetDEX(volume_i, this.telos));

                        // console.log("-i",i, table);
                        // console.log("- weight:", weight.toNumber());
                        // console.log("- table.summary.price.str", table.summary.price.str);
                        // console.log("- table.summary.price.amount.multipliedBy(weight).toNumber()", table.summary.price.amount.multipliedBy(weight).toNumber());
                        // console.log("- currency_price.toNumber()", currency_price.toNumber());
                        // console.log("- price_i:", price_i.toNumber());
                        // console.log("- price ->", price.str);
                        // console.log("- currency_price_24h_ago:", currency_price_24h_ago.toNumber());
                        // console.log("- table.summary.price_24h_ago:", table.summary.price_24h_ago.str);
                        // console.log("- price_init_i:", price_init_i.toNumber());
                        // console.log("- price_init ->", price_init.str);
                        

                    }
                }

                let diff = price.minus(price_init);
                let ratio:number = 0;
                if (price_init.amount.toNumber() != 0) {
                    ratio = diff.amount.dividedBy(price_init.amount).toNumber();
                }
                let percent = Math.floor(ratio * 10000) / 100;
                let percent_str = (isNaN(percent) ? 0 : percent) + "%";

                // console.log("price", price.str);
                // console.log("price_24h_ago", price_init.str);
                // console.log("volume", volume.str);
                // console.log("percent", percent);
                // console.log("percent_str", percent_str);
                // console.log("ratio", ratio);
                // console.log("diff", diff.str);

                token.summary.price = price;
                token.summary.price_24h_ago = price_init;
                token.summary.percent = percent;
                token.summary.percent_str = percent_str;
                token.summary.volume = volume;

            }
            
            // console.log("(end) ---------------------------------------------");
            this.setTokenSummary();
        });
    }

    private fetchTokens(extended: boolean = true) {
        console.log("Vapaee.fetchTokens()");

        return this.contract.getTable("tokens").then(result => {
            let data = {
                tokens: <TokenDEX[]>result.rows
            }

            for (let i in data.tokens) {
                data.tokens[i].scope = data.tokens[i].symbol.toLowerCase() + ".tlos";
            }

            return data;
        });
    }

    private resortTokens() {
        // console.log("(ini) ------------------------------------------------------------");
        // console.log("resortTokens()");
        // console.log("this.tokens[0]", this.tokens[0].summary);
        this.tokens.sort((a:TokenDEX, b:TokenDEX) => {
            // push offchain tokens to the end of the token list
            if (a.offchain || !a.tradeable) return 1;
            if (b.offchain || !b.tradeable) return -1;

            // console.log(" --- ", a.symbol, "-", b.symbol, " --- ");
            // console.log("     ", a.summary ? a.summary.volume.str : "0", "-", b.summary ? b.summary.volume.str : "0");
            
            let a_vol = a.summary ? a.summary.volume : new AssetDEX();
            let b_vol = b.summary ? b.summary.volume : new AssetDEX();

            if(a_vol.amount.isGreaterThan(b_vol.amount)) return -1;
            if(a_vol.amount.isLessThan(b_vol.amount)) return 1;

            if(a.title < b.title) return -1;
            if(a.title > b.title) return 1;
            return 0;
        }); 

        // console.log("resortTokens()", this.tokens);
        // console.log("(end) ------------------------------------------------------------");

        this.onTokensReady.next(this.tokens);        
    }

    private resortTopMarkets() {
        this.waitTokenSummary.then(_ => {

            this.topmarkets = [];
            let inverse: string;
            let market:Market;
            for (let scope in this._markets) {
                market = this._markets[scope];
                if (market.direct >= market.inverse) {
                    this.topmarkets.push(market);
                } else {
                    inverse = this.inverseScope(scope);
                    market = this.market(inverse);
                    this.topmarkets.push(market);
                }
            }

            this.topmarkets.sort((a:Market, b:Market) => {
                
                let a_vol = a.summary ? a.summary.volume : new AssetDEX();
                let b_vol = b.summary ? b.summary.volume : new AssetDEX();

                if (a_vol.token != this.telos) {
                    a_vol = new AssetDEX(a_vol.amount.multipliedBy(a_vol.token.summary.price.amount),this.telos);
                }
                if (b_vol.token != this.telos) {
                    b_vol = new AssetDEX(b_vol.amount.multipliedBy(b_vol.token.summary.price.amount),this.telos);
                }

                console.assert(b_vol.token == this.telos, "ERROR: volume misscalculated");
                console.assert(a_vol.token == this.telos, "ERROR: volume misscalculated");

                if(a_vol.amount.isGreaterThan(b_vol.amount)) return -1;
                if(a_vol.amount.isLessThan(b_vol.amount)) return 1;

                if(a.currency == this.telos && b.currency != this.telos) return -1;
                if(b.currency == this.telos && a.currency != this.telos) return 1;

                if(a.commodity.title < b.commodity.title) return -1;
                if(a.commodity.title > b.commodity.title) return 1;
    
            });

            this.onTopMarketsReady.next(this.topmarkets); 
        });

    }


}



