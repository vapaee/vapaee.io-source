import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ScatterService, Account, AccountData } from './scatter.service';
import { Utils, Token, TableResult, TableParams } from './utils.service';
import BigNumber from "bignumber.js";
import { Feedback } from './feedback.service';
import { AnalyticsService } from './common/common.services';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { NullTemplateVisitor } from '@angular/compiler';

@Injectable()
export class VapaeeService {

    public loginState: string;
    /*
    public loginState: string;
    - 'no-scatter': Scatter no detected
    - 'no-logged': Scatter detected but user is not logged
    - 'account-ok': user logger with scatter
    */
    private _tables: TableMap;
    private _reverse: TableMap;

    public zero_telos: Asset;
    public telos: Token;
    public tokens: Token[];
    public utils: Utils;
    public feed: Feedback;
    public current: Account;
    public last_logged: string;
    public contract: string;   
    public deposits: Asset[];
    public balances: Asset[];
    public userorders: UserOrdersMap;
    public onLoggedAccountChange:Subject<string> = new Subject();
    public onCurrentAccountChange:Subject<string> = new Subject();
    public onHistoryChange:Subject<string> = new Subject();
    public onSummaryChange:Subject<MarketSummary> = new Subject();
    // public onBlocklistChange:Subject<any[][]> = new Subject();
    public onTokensReady:Subject<Token[]> = new Subject();
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

    private setTokenstats: Function;
    public waitTokenstats: Promise<any> = new Promise((resolve) => {
        this.setTokenstats = resolve;
    });

    private setTokensLoaded: Function;
    public waitTokensLoaded: Promise<any> = new Promise((resolve) => {
        this.setTokensLoaded = resolve;
    });
    constructor(
        private scatter: ScatterService,
        private cookies: CookieService, 
        public analytics: AnalyticsService,
        private datePipe: DatePipe
    ) {
        this._tables = {};
        this._reverse = {};
        this.activity = {total:0, events:{}, list:[]};
        this.current = this.default;
        this.contract = this.vapaeetokens;
        this.utils = new Utils(this.contract, this.scatter);
        this.feed = new Feedback();
        this.scatter.onLogggedStateChange.subscribe(this.onLoggedChange.bind(this));
        this.updateLogState();
        this.fetchTokens().then(data => {
            this.tokens = data.tokens;
            this.tokens.push({
                appname: "Viitasphere",
                contract: "viitasphere1",
                logo: "/assets/logos/viitasphere.png",
                logolg: "/assets/logos/viitasphere-lg.png",
                precision: 4,
                scope: "viitct.tlos",
                symbol: "VIITA",
                verified: false,
                website: "https://viitasphere.com"
            });
            this.tokens.push({
                appname: "Viitasphere",
                contract: "viitasphere1",
                logo: "/assets/logos/viitasphere.png",
                logolg: "/assets/logos/viitasphere-lg.png",
                precision: 0,
                scope: "viitct.tlos",
                symbol: "VIICT",
                verified: false,
                website: "https://viitasphere.com"
            });
            this.resortTokens();
            this.zero_telos = new Asset("0.0000 TLOS", this);
            this.setTokensLoaded();
            this.fetchTokensStats();
            this.getOrderSummary();
            this.getAllTablesSumaries();
        });

        // this.waitTokensLoaded.then(_ => {
        // })


        var timer;
        this.onSummaryChange.subscribe(summary => {
            clearTimeout(timer);
            timer = setTimeout(_ => {
                this.updateTokensSummary();
            }, 100);
        });    



    }

    // getters -------------------------------------------------------------
    get default(): Account {
        return this.scatter.default;
    }

    get logged() {
        if (this.scatter.logged && !this.scatter.account) {
            /*
            console.error("WARNING!!!");
            console.log(this.scatter);
            console.log(this.scatter.username);
            console.error("*******************");
            */
        }
        return this.scatter.logged ?
            (this.scatter.account ? this.scatter.account.name : this.scatter.default.name) :
            null;
    }

    get account() {
        return this.scatter.logged ? 
        this.scatter.account :
        this.scatter.default;
    }

    // -- User Log State ---------------------------------------------------
    login() {
        this.feed.setLoading("login", true);
        this.feed.setLoading("log-state", true);
        console.log("VapaeeService.login() this.feed.loading('log-state')", this.feed.loading('log-state'));
        this.logout();
        this.updateLogState();
        console.log("VapaeeService.login() this.feed.loading('log-state')", this.feed.loading('log-state'));
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
        console.log("VapaeeService.onLogout()");
        this.resetCurrentAccount(this.default.name);
        this.updateLogState();
        this.onLoggedAccountChange.next(this.logged);
        this.analytics.setUserId(0);
        this.cookies.delete("login");
        setTimeout(_  => { this.last_logged = this.logged; }, 400);
    }
    
    onLogin(name:string) {
        console.log("VapaeeService.onLogin()", name);
        this.resetCurrentAccount(name);
        this.getDeposits();
        this.getBalances();
        this.updateLogState();
        this.getUserOrders();
        this.onLoggedAccountChange.next(this.logged);
        this.last_logged = this.logged;
        this.analytics.setUserId(this.logged);
        this.cookies.set("login", this.logged);
    }

    onLoggedChange() {
        console.log("VapaeeService.onLoggedChange()");
        if (this.scatter.logged) {
            this.onLogin(this.scatter.account.name);
        } else {
            this.onLogout();
        }
    }

    async resetCurrentAccount(profile:string) {
        console.log("VapaeeService.resetCurrentAccount() current:", this.current, "next:", profile);
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
            // console.log("this.onCurrentAccountChange.next(this.current.name) !!!!!!");
            this.onCurrentAccountChange.next(this.current.name);
            this.updateCurrentUser();
            this.feed.setLoading("account", false);
        }       
    }

    private updateLogState() {
        this.loginState = "no-scatter";
        this.feed.setLoading("log-state", true);
        console.log("VapaeeService.updateLogState() ", this.loginState, this.feed.loading("log-state"));
        this.scatter.waitConnected.then(() => {
            this.loginState = "no-logged";
            // console.log("VapaeeService.updateLogState()   ", this.loginState);
            if (this.scatter.logged) {
                this.loginState = "account-ok";
                // console.log("VapaeeService.updateLogState()     ", this.loginState);
            }
            this.feed.setLoading("log-state", false);
            console.log("VapaeeService.updateLogState() ", this.loginState, this.feed.loading("log-state"));
        });

        var timer2;
        var timer1 = setInterval(_ => {
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
    createOrder(type:string, amount:Asset, price:Asset) {
        // "alice", "buy", "2.50000000 CNT", "0.40000000 TLOS"
        // name owner, name type, const asset & total, const asset & price
        this.feed.setLoading("order-"+type, true);
        return this.utils.excecute("order", {
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

    cancelOrder(type:string, comodity:Token, currency:Token, orders:number[]) {
        // '["alice", "buy", "CNT", "TLOS", [1,0]]'
        // name owner, name type, const asset & total, const asset & price
        this.feed.setLoading("cancel-"+type, true);
        for (var i in orders) { this.feed.setLoading("cancel-"+type+"-"+orders[i], true); }
        return this.utils.excecute("cancel", {
            owner:  this.scatter.account.name,
            type: type,
            comodity: comodity.symbol,
            currency: currency.symbol,
            orders: orders
        }).then(async result => {
            this.updateTrade(comodity, currency);
            this.feed.setLoading("cancel-"+type, false);
            for (var i in orders) { this.feed.setLoading("cancel-"+type+"-"+orders[i], false); }    
            return result;
        }).catch(e => {
            this.feed.setLoading("cancel-"+type, false);
            for (var i in orders) { this.feed.setLoading("cancel-"+type+"-"+orders[i], false); }    
            console.error(e);
            throw e;
        });
    }

    deposit(quantity:Asset) {
        // name owner, name type, const asset & total, const asset & price
        var util = new Utils(quantity.token.contract, this.scatter);
        this.feed.setError("deposit", null);
        this.feed.setLoading("deposit", true);
        this.feed.setLoading("deposit-"+quantity.token.symbol.toLowerCase(), true);
        return util.excecute("transfer", {
            from:  this.scatter.account.name,
            to: this.vapaeetokens,
            quantity: quantity.toString(),
            memo: "deposit"
        }).then(async result => {
            this.feed.setLoading("deposit", false);
            this.feed.setLoading("deposit-"+quantity.token.symbol.toLowerCase(), false);    
            await this.getDeposits();
            await this.getBalances();
            return result;
        }).catch(e => {
            this.feed.setLoading("deposit", false);
            this.feed.setLoading("deposit-"+quantity.token.symbol.toLowerCase(), false);
            this.feed.setError("deposit", typeof e == "string" ? e : JSON.stringify(e,null,4));
            console.error(e);
            throw e;
        });
    }    

    withdraw(quantity:Asset) {
        this.feed.setError("withdraw", null);
        this.feed.setLoading("withdraw", true);
        this.feed.setLoading("withdraw-"+quantity.token.symbol.toLowerCase(), true);   
        return this.utils.excecute("withdraw", {
            owner:  this.scatter.account.name,
            quantity: quantity.toString()
        }).then(async result => {
            this.feed.setLoading("withdraw", false);
            this.feed.setLoading("withdraw-"+quantity.token.symbol.toLowerCase(), false);
            await this.getDeposits();
            await this.getBalances();
            return result;
        }).catch(e => {
            this.feed.setLoading("withdraw", false);
            this.feed.setLoading("withdraw-"+quantity.token.symbol.toLowerCase(), false);
            this.feed.setError("withdraw", typeof e == "string" ? e : JSON.stringify(e,null,4));
            throw e;
        });
    }

    // Tokens --------------------------------------------------------------
    addOffChainToken(offchain: Token) {
        this.waitTokensLoaded.then(_ => {
            this.tokens.push({
                symbol: offchain.symbol,
                precision: offchain.precision || 4,
                contract: "nocontract",
                appname: offchain.appname,
                website: "",
                logo:"",
                logolg: "",
                scope: "",
                stat: null,
                verified: false,
                offchain: true
            });
        });        
    }


    // --------------------------------------------------------------
    // Scopes / Tables 
    public hasScopes() {
        return !!this._tables;
    }

    public table(scope:string): Table {
        if (this._tables[scope]) return this._tables[scope];        // ---> direct
        var reverse = this.inverseScope(scope);
        if (this._reverse[reverse]) return this._reverse[reverse];  // ---> reverse
        if (!this._tables[reverse]) return null;                    // ---> table does not exist (or has not been loaded yet)
        return this._tables[scope] || this.reverse(scope);
    }

    private reverse(scope:string): Table {
        var canonical = this.canonicalScope(scope);
        var reverse_scope = this.inverseScope(canonical);
        console.assert(canonical != reverse_scope, "ERROR: ", canonical, reverse_scope);
        var reverse_table:Table = this._reverse[reverse_scope];
        if (!reverse_table && this._tables[canonical]) {
            this._reverse[reverse_scope] = this.createReverseTableFor(reverse_scope);
        }
        return this._reverse[reverse_scope];
    }

    public tableFor(comodity:Token, currency:Token): Table {
        var scope = this.getScopeFor(comodity, currency);
        return this.table(scope);
    }

    public createReverseTableFor(scope:string): Table {
        // console.log("******************************************", scope);
        var canonical = this.canonicalScope(scope);
        var reverse_scope = this.inverseScope(canonical);
        var table:Table = this._tables[canonical];

        var inverse_history:HistoryTx[] = [];

        for (var i in table.history) {
            var hTx:HistoryTx = {
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
        
    
        var inverse_orders:TokenOrders = {
            buy: [], sell: []
        };

        for (var type in {buy:"buy", sell:"sell"}) {
            var row_orders:Order[];
            var row_order:Order;

            for (var i in table.orders[type]) {
                var row = table.orders[type][i];

                row_orders = [];
                for (var j=0; j<row.orders.length; j++) {
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

                var newrow:OrderRow = {
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

        var reverse:Table = {
            scope: reverse_scope,
            comodity: table.currency,
            currency: table.comodity,
            block: table.block,
            blocklist: table.reverseblocks,
            reverseblocks: table.blocklist,
            blocklevels: table.reverselevels,
            reverselevels: table.blocklevels,
            blocks: table.blocks,
            deals: table.deals,
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
                inverse: table.summary.price,
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

    public getScopeFor(comodity:Token, currency:Token) {
        if (!comodity || !currency) return "";
        return comodity.symbol.toLowerCase() + "." + currency.symbol.toLowerCase();
    }

    public inverseScope(scope:string) {
        if (!scope) return scope;
        console.assert(typeof scope =="string", "ERROR: string scope expected, got ", typeof scope, scope);
        var parts = scope.split(".");
        console.assert(parts.length == 2, "ERROR: scope format expected is xxx.yyy, got: ", typeof scope, scope);
        var inverse = parts[1] + "." + parts[0];
        return inverse;
    }

    public canonicalScope(scope:string) {
        if (!scope) return scope;
        console.assert(typeof scope =="string", "ERROR: string scope expected, got ", typeof scope, scope);
        var parts = scope.split(".");
        console.assert(parts.length == 2, "ERROR: scope format expected is xxx.yyy, got: ", typeof scope, scope);
        var inverse = parts[1] + "." + parts[0];
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

    getBalance(token:Token) {
        for (var i in this.balances) {
            if (this.balances[i].token.symbol == token.symbol) {
                return this.balances[i];
            }
        }
        return new Asset("0 " + token.symbol, this);
    }

    async getSomeFreeFakeTokens(symbol:string = null) {
        console.log("VapaeeService.getSomeFreeFakeTokens()");
        var _token = symbol;    
        this.feed.setLoading("freefake-"+_token || "token", true);
        return this.waitTokenstats.then(_ => {
            var token = null;
            var counts = 0;
            for (var i=0; i<100; i++) {
                if (symbol) {
                    if (this.tokens[i].symbol == symbol) {
                        token = this.tokens[i];
                    }
                }                

                var random = Math.random();
                // console.log(i, "Random: ", random);
                if (!token && random > 0.5) {
                    token = this.tokens[i % this.tokens.length];
                    if (token.fake) {
                        random = Math.random();
                        if (random > 0.5) {
                            token = this.telos;
                        }
                    } else {
                        token = null;
                    }
                }

                if (i<100 && token && this.getBalance(token).amount.toNumber() > 0) {
                    token = null;
                }

                // console.log(i, "token: ", token);

                if (token) {
                    random = Math.random();
                    var monto = Math.floor(10000 * random) / 100;
                    var quantity = new Asset("" + monto + " " + token.symbol ,this);
                    var memo = "you get " + quantity.valueToString()+ " free fake " + token.symbol + " tokens to play on vapaee.io DEX";
                    return this.utils.excecute("issue", {
                        to:  this.scatter.account.name,
                        quantity: quantity.toString(),
                        memo: memo
                    }).then(_ => {
                        this.getBalances();
                        this.feed.setLoading("freefake-"+_token || "token", false);
                        return memo;
                    }).catch(e => {
                        this.feed.setLoading("freefake-"+_token || "token", false);
                        throw e;
                    });                
                }               
            }
        })
    }

    getTokenNow(sym:string): Token {
        if (!sym) return null;
        for (var i in this.tokens) {
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

    async getToken(sym:string): Promise<Token> {
        return this.waitTokensLoaded.then(_ => {
            return this.getTokenNow(sym);
        });
    }

    async getDeposits(account:string = null): Promise<any> {
        console.log("VapaeeService.getDeposits()");
        this.feed.setLoading("deposits", true);
        return this.waitTokensLoaded.then(async _ => {
            var deposits: Asset[] = [];
            if (!account && this.current.name) {
                account = this.current.name;
            }
            if (account) {
                var result = await this.fetchDeposits(account);
                for (var i in result.rows) {
                    deposits.push(new Asset(result.rows[i].amount, this));
                }
            }
            this.deposits = deposits;
            this.feed.setLoading("deposits", false);
            return this.deposits;
        });
    }

    async getBalances(account:string = null): Promise<any> {
        console.log("VapaeeService.getBalances()");
        this.feed.setLoading("balances", true);
        return this.waitTokensLoaded.then(async _ => {
            var balances: Asset[];
            if (!account && this.current.name) {
                account = this.current.name;
            }            
            if (account) {
                balances = await this.fetchBalances(account);
            }
            this.balances = balances;
            // console.log("VapaeeService balances updated");
            this.feed.setLoading("balances", false);
            return this.balances;
        });
    }

    async getThisSellOrders(table:string, ids:number[]): Promise<any[]> {
        this.feed.setLoading("thisorders", true);
        return this.waitTokensLoaded.then(async _ => {
            var result = [];
            for (var i in ids) {
                var id = ids[i];
                var gotit = false;
                for (var j in result) {
                    if (result[j].id == id) {
                        gotit = true;
                        break;
                    }
                }
                if (gotit) {
                    continue;
                }
                var res:TableResult = await this.fetchOrders({scope:table, limit:1, lower_bound:id.toString()});

                result = result.concat(res.rows);
            }
            this.feed.setLoading("thisorders", false);
            return result;
        });    
    }

    async getUserOrders(account:string = null) {
        console.log("VapaeeService.getUserOrders()");
        this.feed.setLoading("userorders", true);
        return this.waitTokensLoaded.then(async _ => {
            var userorders: TableResult;
            if (!account && this.current.name) {
                account = this.current.name;
            }            
            if (account) {
                userorders = await this.fetchUserOrders(account);
            }
            var list: UserOrders[] = <UserOrders[]>userorders.rows;
            var map: UserOrdersMap = {};
            for (var i=0; i<list.length; i++) {
                var ids = list[i].ids;
                var table = list[i].table;
                var orders = await this.getThisSellOrders(table, ids);
                map[table] = {
                    table: table,
                    orders: this.auxProcessRowsToOrders(orders),
                    ids:ids
                };
            }
            this.userorders = map;
            // console.log(this.userorders);
            this.feed.setLoading("userorders", false);
            return this.userorders;
        });
                
    }

    async updateActivity() {
        this.feed.setLoading("activity", true);
        var pagesize = this.activityPagesize;
        var pages = await this.getActivityTotalPages(pagesize);
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
        var pagesize = this.activityPagesize;
        var first = this.activity.list[this.activity.list.length-1];
        var id = first.id - pagesize;
        var page = Math.floor((id-1) / pagesize);

        await this.fetchActivity(page, pagesize);
        this.feed.setLoading("activity", false);
    }

    async updateTrade(comodity:Token, currency:Token, updateUser:boolean = true): Promise<any> {
        console.log("VapaeeService.updateTrade()");
        var chrono_key = "updateTrade";
        this.feed.startChrono(chrono_key);

        if(updateUser) this.updateCurrentUser();
        return Promise.all([
            this.getTransactionHistory(comodity, currency, -1, -1, true).then(_ => this.feed.setMarck(chrono_key, "getTransactionHistory()")),
            this.getBlockHistory(comodity, currency, -1, -1, true).then(_ => this.feed.setMarck(chrono_key, "getBlockHistory()")),
            this.getSellOrders(comodity, currency, true).then(_ => this.feed.setMarck(chrono_key, "getSellOrders()")),
            this.getBuyOrders(comodity, currency, true).then(_ => this.feed.setMarck(chrono_key, "getBuyOrders()")),
            this.getTableSummary(comodity, currency, true).then(_ => this.feed.setMarck(chrono_key, "getTableSummary()")),
            this.getOrderSummary().then(_ => this.feed.setMarck(chrono_key, "getOrderSummary()")),
        ]).then(r => {
            this._reverse = {};
            this.resortTokens();
            // this.feed.printChrono(chrono_key);
            this.onTradeUpdated.next(null);
            return r;
        });
    }

    async updateCurrentUser(): Promise<any> {
        // console.log("VapaeeService.updateCurrentUser()");
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
        if (!this._tables) return 0;
        var table = this.table(scope);
        if (!table) return 0;
        var total = table.blocks;
        var mod = total % pagesize;
        var dif = total - mod;
        var pages = dif / pagesize;
        if (mod > 0) {
            pages +=1;
        }
        // console.log("getBlockHistoryTotalPagesFor() total:", total, " pages:", pages);
        return pages;
    }

    private getHistoryTotalPagesFor(scope:string, pagesize: number) {
        if (!this._tables) return 0;
        var table = this.table(scope);
        if (!table) return 0;
        var total = table.deals;
        var mod = total % pagesize;
        var dif = total - mod;
        var pages = dif / pagesize;
        if (mod > 0) {
            pages +=1;
        }
        return pages;
    }

    private async getActivityTotalPages(pagesize: number) {
        return this.utils.getTable("events", {
            limit: 1
        }).then(result => {
            var params = result.rows[0].params;
            var total = parseInt(params.split(" ")[0])-1;
            var mod = total % pagesize;
            var dif = total - mod;
            var pages = dif / pagesize;
            if (mod > 0) {
                pages +=1;
            }
            this.activity.total = total;
            console.log("VapaeeService.getActivityTotalPages() total: ", total, " pages: ", pages);
            return pages;
        });
    }

    async getTransactionHistory(comodity:Token, currency:Token, page:number = -1, pagesize:number = -1, force:boolean = false): Promise<any> {
        var scope:string = this.canonicalScope(this.getScopeFor(comodity, currency));
        var aux = null;
        var result = null;
        this.feed.setLoading("history."+scope, true);
        aux = this.waitOrderSummary.then(async _ => {
            if (pagesize == -1) {
                pagesize = 10;                
            }
            if (page == -1) {
                var pages = this.getHistoryTotalPagesFor(scope, pagesize);
                page = pages-3;
                if (page < 0) page = 0;
            }

            return Promise.all([
                this.fetchHistory(scope, page+0, pagesize),
                this.fetchHistory(scope, page+1, pagesize),
                this.fetchHistory(scope, page+2, pagesize)
            ]).then(_ => {
                this.feed.setLoading("history."+scope, false);
                return this.table(scope).history;
            }).catch(e => {
                this.feed.setLoading("history."+scope, false);
                throw e;
            });
        });

        if (this.table(scope) && !force) {
            result = this.table(scope).history;
        } else {
            result = aux;
        }

        this.onHistoryChange.next(result);

        return result;
    }

    private auxHourToLabel(hour:number): string {
        var d = new Date(hour * 1000 * 60 * 60);
        var label = d.getHours() == 0 ? this.datePipe.transform(d, 'dd/MM') : d.getHours() + "h";
        
        return label;
    }

    async getBlockHistory(comodity:Token, currency:Token, page:number = -1, pagesize:number = -1, force:boolean = false): Promise<any> {
        console.log("VapaeeService.getBlockHistory()", comodity.symbol, page, pagesize);
        // // elapsed time
        // var startTime:Date = new Date();
        // var diff:number;
        // var sec:number;

        var scope:string = this.canonicalScope(this.getScopeFor(comodity, currency));
        var aux = null;
        var result = null;
        this.feed.setLoading("block-history."+scope, true);

        aux = this.waitOrderSummary.then(async _ => {
            var fetchBlockHistoryStart:Date = new Date();

            if (pagesize == -1) {
                pagesize = 10;
            }
            if (page == -1) {
                var pages = this.getBlockHistoryTotalPagesFor(scope, pagesize);
                page = pages-3;
                if (page < 0) page = 0;
            }
            var promises = [];
            for (var i=0; i<=pages; i++) {
                var promise = this.fetchBlockHistory(scope, i, pagesize);
                promises.push(promise);
            }

            return Promise.all(promises).then(_ => {
                // // elapsed time
                // var fetchBlockHistoryTime:Date = new Date();
                // diff = fetchBlockHistoryTime.getTime() - fetchBlockHistoryStart.getTime();
                // sec = diff / 1000;
                // console.log("** VapaeeService.getBlockHistory() fetchBlockHistoryTime sec: ", sec, "(",diff,")");


                this.feed.setLoading("block-history."+scope, false);
                var table: Table = this.table(scope);
                table.blocklist = [];
                table.reverseblocks = [];
                var now = new Date();
                var hora = 1000 * 60 * 60;
                var hour = Math.floor(now.getTime()/hora);
                // console.log("->", hour);
                var last_block = null;
                var last_hour = null;

                var ordered_blocks = [];
                for (var i in table.block) {
                    ordered_blocks.push(table.block[i]);
                }

                ordered_blocks.sort(function(a:HistoryBlock, b:HistoryBlock) {
                    if(a.hour < b.hour) return -11;
                    return 1;
                });



                for (var i in ordered_blocks) {
                    var block:HistoryBlock = ordered_blocks[i];
                    var label = this.auxHourToLabel(block.hour);
                    /*
                    // console.log("->", i, label, block);
                    var date = block.date;
                    var dif = now.getTime() - block.date.getTime();
                    var mes = 30 * 24 * hora;
                    var elapsed_months = dif / mes;
                    if (elapsed_months > 3) {
                        console.log("dropping block too old", [block, block.date.toUTCString()]);
                        continue;
                    }
                    */

                    if (last_block) {
                        var dif = block.hour - last_block.hour;
                        for (var j=1; j<dif; j++) {
                            var label_i = this.auxHourToLabel(last_block.hour+j);
                            // console.log("-->", j, label_i, block);

                            // coninical ----------------------------
                            var price = last_block.price.amount.toNumber();
                            var aux = [label_i, price, price, price, price];
                            table.blocklist.push(aux);
                            // reverse ----------------------------
                            var inverse = last_block.inverse.amount.toNumber();
                            var aux = [label_i, inverse, inverse, inverse, inverse];
                            table.reverseblocks.push(aux);
                        }
                    }
                    var obj:any[];
                    // coninical ----------------------------
                    obj = [label];
                    obj.push(block.max.amount.toNumber());
                    obj.push(block.entrance.amount.toNumber());
                    obj.push(block.price.amount.toNumber());
                    obj.push(block.min.amount.toNumber());
                    table.blocklist.push(obj);
                    // reverse ----------------------------
                    obj = [label];
                    obj.push(1.0/block.max.amount.toNumber());
                    obj.push(1.0/block.entrance.amount.toNumber());
                    obj.push(1.0/block.price.amount.toNumber());
                    obj.push(1.0/block.min.amount.toNumber());
                    table.reverseblocks.push(obj);
                    last_block = block;
                }

                if (last_block && hour != last_block.hour) {
                    var dif = hour - last_block.hour;
                    for (var j=1; j<=dif; j++) {
                        var label_i = this.auxHourToLabel(last_block.hour+j);

                        // coninical ----------------------------
                        var price = last_block.price.amount.toNumber();
                        var aux = [label_i, price, price, price, price];
                        table.blocklist.push(aux);

                        // reverse ----------------------------
                        var inverse = last_block.inverse.amount.toNumber();
                        var aux = [label_i, inverse, inverse, inverse, inverse];
                        table.reverseblocks.push(aux);
                    }
                }

                // // elapsed time
                // var firstLevelTime:Date = new Date();
                // diff = firstLevelTime.getTime() - fetchBlockHistoryTime.getTime();
                // sec = diff / 1000;
                // console.log("** VapaeeService.getBlockHistory() firstLevelTime sec: ", sec, "(",diff,")");                
                
                // console.log("---------------->", table.blocklist);
                // this.onBlocklistChange.next(table.blocklist);
                return table;
            }).then(table => {
                // console.log("***************************************************************************");
                // // elapsed time
                // var allLevelsStart:Date = new Date();                
                
                var limit = 256;
                var levels = [table.blocklist];
                var reverses = [table.reverseblocks];
                for (var current = 0; levels[current].length > limit; current++) {
                    // console.log(current ,levels[current].length);
                    var newlevel:any[][] = [];
                    var newreverse:any[][] = [];
                    var merged:any[] = [];
                    for (var i=0; i<levels[current].length; i+=2) {
                        // canonical -----------------------------
                        var v_1:any[] = levels[current][i];
                        var v_2 = levels[current][i+1];
                        var merged = [];
                        for (var x=0; x<5; x++) merged[x] = v_1[x]; // clean copy
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
                        for (var x=0; x<5; x++) merged[x] = v_1[x]; // clean copy
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
                

                table.blocklevels = levels;
                table.reverselevels = reverses;
                
                // ---------------------
                // table.blocklevels = [table.blocklist];
                // table.reverselevels = [table.reverseblocks];
                

                
                // // elapsed time
                // var allLevelsTime:Date = new Date();
                // diff = allLevelsTime.getTime() - allLevelsStart.getTime();
                // sec = diff / 1000;
                // console.log("** VapaeeService.getBlockHistory() allLevelsTime sec: ", sec, "(",diff,")");   
                // // console.log("***************************************************************************", table.blocklevels);

                return table.block;
            }).catch(e => {
                this.feed.setLoading("block-history."+scope, false);
                throw e;
            });
        });

        if (this.table(scope) && !force) {
            result = this.table(scope).block;
        } else {
            result = aux;
        }

        this.onHistoryChange.next(result);

        return result;
    }

    async getSellOrders(comodity:Token, currency:Token, force:boolean = false): Promise<any> {
        var scope:string = this.getScopeFor(comodity, currency);
        var canonical:string = this.canonicalScope(scope);
        var reverse:string = this.inverseScope(canonical);
        var aux = null;
        var result = null;
        this.feed.setLoading("sellorders", true);
        aux = this.waitTokensLoaded.then(async _ => {
            var orders = await this.fetchOrders({scope:canonical, limit:100, index_position: "2", key_type: "i64"});
            this._tables[canonical] = this.auxAssertScope(canonical);
            // if(scope=="vpe.tlos" || scope=="cnt.tlos")console.log("-------------");
            // if(scope=="vpe.tlos" || scope=="cnt.tlos")console.log("Sell crudo:", orders);
            var sell: Order[] = this.auxProcessRowsToOrders(orders.rows);
            sell.sort(function(a:Order, b:Order) {
                if(a.price.amount.isLessThan(b.price.amount)) return -11;
                if(a.price.amount.isGreaterThan(b.price.amount)) return 1;
                return 0;
            });
            // if(scope=="vpe.tlos" || scope=="cnt.tlos")console.log("sorted:", sell);
            // grouping together orders with the same price.
            var list: OrderRow[] = [];
            var row: OrderRow;
            if (sell.length > 0) {
                for(var i=0; i<sell.length; i++) {
                    var order: Order = sell[i];
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

            var sum = new BigNumber(0);
            var sumtelos = new BigNumber(0);
            for (var j in list) {
                var order_row = list[j];
                sumtelos = sumtelos.plus(order_row.telos.amount);
                sum = sum.plus(order_row.total.amount);
                order_row.sumtelos = new Asset(sumtelos, order_row.telos.token);
                order_row.sum = new Asset(sum, order_row.total.token);
            }

            this._tables[canonical].orders.sell = list;
            // if(scope=="vpe.tlos" || scope=="cnt.tlos")console.log("Sell final:", this.scopes[scope].orders.sell);
            // if(scope=="vpe.tlos" || scope=="cnt.tlos")console.log("-------------");

            this.feed.setLoading("sellorders", false);            
            return this._tables[canonical].orders.sell;
        });

        if (this._tables[canonical] && !force) {
            result = this._tables[canonical].orders.sell;
        } else {
            result = aux;
        }
        return result;
    }
    
    async getBuyOrders(comodity:Token, currency:Token, force:boolean = false): Promise<any> {
        var scope:string = this.getScopeFor(comodity, currency);
        var canonical:string = this.canonicalScope(scope);
        var reverse:string = this.inverseScope(canonical);


        var aux = null;
        var result = null;
        this.feed.setLoading("buyorders", true);
        aux = this.waitTokensLoaded.then(async _ => {
            var orders = await await this.fetchOrders({scope:reverse, limit:50, index_position: "2", key_type: "i64"});
            this._tables[canonical] = this.auxAssertScope(canonical);
            // console.log("-------------");
            // console.log("Buy crudo:", orders);            
            var buy: Order[] = this.auxProcessRowsToOrders(orders.rows);
            buy.sort(function(a:Order, b:Order){
                if(a.price.amount.isLessThan(b.price.amount)) return 1;
                if(a.price.amount.isGreaterThan(b.price.amount)) return -1;
                return 0;
            });

            // console.log("buy sorteado:", buy);

            // grouping together orders with the same price.
            var list: OrderRow[] = [];
            var row: OrderRow;
            if (buy.length > 0) {
                for(var i=0; i<buy.length; i++) {
                    var order: Order = buy[i];
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

            var sum = new BigNumber(0);
            var sumtelos = new BigNumber(0);
            for (var j in list) {
                var order_row = list[j];
                sumtelos = sumtelos.plus(order_row.telos.amount);
                sum = sum.plus(order_row.total.amount);
                order_row.sumtelos = new Asset(sumtelos, order_row.telos.token);
                order_row.sum = new Asset(sum, order_row.total.token);
            }

            this._tables[canonical].orders.buy = list;
            // console.log("Buy final:", this.scopes[scope].orders.buy);
            // console.log("-------------");
            this.feed.setLoading("buyorders", false);
            return this._tables[canonical].orders.buy;
        });

        if (this._tables[canonical] && !force) {
            result = this._tables[canonical].orders.buy;
        } else {
            result = aux;
        }
        return result;
    }
    
    async getOrderSummary(): Promise<any> {
        console.log("VapaeeService.getOrderSummary()");
        var tables = await this.fetchOrderSummary();

        for (var i in tables.rows) {
            var scope:string = tables.rows[i].table;
            var canonical = this.canonicalScope(scope);
            console.assert(scope == canonical, "ERROR: scope is not canonical", scope, [i, tables]);
            var comodity = scope.split(".")[0].toUpperCase();
            var currency = scope.split(".")[1].toUpperCase();
            this._tables[scope] = this.auxAssertScope(scope);

            // console.log(i, tables.rows[i]);

            this._tables[scope].header.sell.total = new Asset(tables.rows[i].supply.total, this);
            this._tables[scope].header.sell.orders = tables.rows[i].supply.orders;
            this._tables[scope].header.buy.total = new Asset(tables.rows[i].demand.total, this);
            this._tables[scope].header.buy.orders = tables.rows[i].demand.orders;
            this._tables[scope].deals = tables.rows[i].deals;
            this._tables[scope].blocks = tables.rows[i].blocks;
        }
        
        this.setOrderSummary();
    }

    async getTableSummary(comodity:Token, currency:Token, force:boolean = false): Promise<MarketSummary> {
        var scope:string = this.getScopeFor(comodity, currency);
        var canonical:string = this.canonicalScope(scope);
        var inverse:string = this.inverseScope(canonical);

        var ZERO_COMODITY = "0.00000000 " + comodity.symbol;
        var ZERO_CURRENCY = "0.00000000 " + currency.symbol;

        this.feed.setLoading("summary."+canonical, true);
        this.feed.setLoading("summary."+inverse, true);
        var aux = null;
        var result:MarketSummary = null;
        aux = this.waitTokensLoaded.then(async _ => {
            var summary = await this.fetchSummary(canonical);
            // if(scope=="olive.tlos")console.log(scope, "---------------------------------------------------");
            // if(scope=="olive.tlos")console.log("Summary crudo:", summary.rows);

            this._tables[canonical] = this.auxAssertScope(canonical);
            this._tables[canonical].summary = {
                scope: canonical,
                price: new Asset(new BigNumber(0), currency),
                inverse: new Asset(new BigNumber(0), comodity),
                volume: new Asset(new BigNumber(0), currency),
                amount: new Asset(new BigNumber(0), comodity),
                percent: 0.3,
                records: summary.rows
            };

            var now:Date = new Date();
            var now_sec: number = Math.floor(now.getTime() / 1000);
            var now_hour: number = Math.floor(now_sec / 3600);
            var start_hour = now_hour - 23;
            // if(canonical=="olive.tlos")console.log("now_hour:", now_hour);
            // if(canonical=="olive.tlos")console.log("start_hour:", start_hour);

            // proceso los datos crudos 
            var price = ZERO_CURRENCY;
            var inverse = ZERO_COMODITY;
            var crude = {};
            var last_hh = 0;
            for (var i=0; i<summary.rows.length; i++) {
                var hh = summary.rows[i].hour;
                if (summary.rows[i].label == "lastone") {
                    // price = summary.rows[i].price;
                } else {
                    crude[hh] = summary.rows[i];
                    if (last_hh < hh && hh < start_hour) {
                        last_hh = hh;
                        price = (scope == canonical) ? summary.rows[i].price : summary.rows[i].inverse;
                        inverse = (scope == canonical) ? summary.rows[i].inverse : summary.rows[i].price;
                        // if(canonical=="olive.tlos")console.log("hh:", hh, "last_hh:", last_hh, "price:", price);
                    }    
                }
                /*
                */
            }
            // if(canonical=="olive.tlos")console.log("crude:", crude);
            // if(canonical=="olive.tlos")console.log("price:", price);

            // genero una entrada por cada una de las últimas 24 horas
            var last_24h = {};
            var volume = new Asset(ZERO_CURRENCY, this);
            var amount = new Asset(ZERO_COMODITY, this);
            var price_asset = new Asset(price, this);
            var inverse_asset = new Asset(inverse, this);
            // if(canonical=="cnt.tlos")console.log("price ", price);
            var max_price = price_asset.clone();
            var min_price = price_asset.clone();
            var max_inverse = inverse_asset.clone();
            var min_inverse = inverse_asset.clone();
            var price_fst:Asset = null;
            var inverse_fst:Asset = null;
            for (var i=0; i<24; i++) {
                var current = start_hour+i;
                var current_date = new Date(current * 3600 * 1000);
                var nuevo:any = crude[current];
                if (nuevo) {
                    var s_price = (scope == canonical) ? nuevo.price : nuevo.inverse;
                    var s_inverse = (scope == canonical) ? nuevo.inverse : nuevo.price;
                    var s_volume = (scope == canonical) ? nuevo.volume : nuevo.amount;
                    var s_amount = (scope == canonical) ? nuevo.amount : nuevo.volume;
                    nuevo.price = s_price;
                    nuevo.inverse = s_inverse;
                    nuevo.volume = s_volume;
                    nuevo.amount = s_amount;
                } else {
                    nuevo = {
                        label: this.auxGetLabelForHour(current % 24),
                        price: price,
                        inverse: inverse,
                        volume: ZERO_CURRENCY,
                        amount: ZERO_COMODITY,
                        date: current_date.toISOString().split(".")[0],
                        hour: current
                    };
                }
                last_24h[current] = crude[current] || nuevo;
                // if(canonical=="olive.tlos")console.log("current_date:", current_date.toISOString(), current, last_24h[current]);

                // coninical ----------------------------
                price = last_24h[current].price;
                var vol = new Asset(last_24h[current].volume, this);
                console.assert(vol.token.symbol == volume.token.symbol, "ERROR: different tokens", vol.str, volume.str);
                volume.amount = volume.amount.plus(vol.amount);
                if (price != ZERO_CURRENCY && !price_fst) {
                    price_fst = new Asset(price, this);
                }
                price_asset = new Asset(price, this);
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
                var amo = new Asset(last_24h[current].amount, this);
                console.assert(amo.token.symbol == amount.token.symbol, "ERROR: different tokens", amo.str, amount.str);
                amount.amount = amount.amount.plus(amo.amount);
                if (inverse != ZERO_COMODITY && !inverse_fst) {
                    inverse_fst = new Asset(inverse, this);
                }
                inverse_asset = new Asset(inverse, this);
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
                price_fst = new Asset(last_24h[start_hour].price, this);
            }
            var last_price =  new Asset(last_24h[now_hour].price, this);
            var diff = last_price.clone();
            // diff.amount 
            diff.amount = last_price.amount.minus(price_fst.amount);
            var ratio:number = 0;
            if (price_fst.amount.toNumber() != 0) {
                ratio = diff.amount.dividedBy(price_fst.amount).toNumber();
            }
            var percent = Math.floor(ratio * 10000) / 100;

            // reverse ----------------------------
            if (!inverse_fst) {
                inverse_fst = new Asset(last_24h[start_hour].inverse, this);
            }
            var last_inverse =  new Asset(last_24h[now_hour].inverse, this);
            var idiff = last_inverse.clone();
            // diff.amount 
            idiff.amount = last_inverse.amount.minus(inverse_fst.amount);
            ratio = 0;
            if (inverse_fst.amount.toNumber() != 0) {
                ratio = diff.amount.dividedBy(inverse_fst.amount).toNumber();
            }
            var ipercent = Math.floor(ratio * 10000) / 100;

            // if(canonical=="olive.tlos")console.log("last_24h:", [last_24h]);
            // if(canonical=="olive.tlos")console.log("first:", first.toString(8));
            // if(canonical=="olive.tlos")console.log("last:", last.toString(8));
            // if(canonical=="olive.tlos")console.log("diff:", diff.toString(8));
            // if(canonical=="olive.tlos")console.log("percent:", percent);
            // if(canonical=="olive.tlos")console.log("ratio:", ratio);
            // if(canonical=="olive.tlos")console.log("volume:", volume.str);

            this._tables[canonical].summary.price = last_price;
            this._tables[canonical].summary.inverse = last_inverse;
            this._tables[canonical].summary.price_24h_ago = price_fst;
            this._tables[canonical].summary.inverse_24h_ago = inverse_fst;
            this._tables[canonical].summary.percent_str = (isNaN(percent) ? 0 : percent) + "%";
            this._tables[canonical].summary.percent = isNaN(percent) ? 0 : percent;
            this._tables[canonical].summary.ipercent_str = (isNaN(ipercent) ? 0 : ipercent) + "%";
            this._tables[canonical].summary.ipercent = isNaN(ipercent) ? 0 : ipercent;
            this._tables[canonical].summary.volume = volume;
            this._tables[canonical].summary.amount = amount;
            this._tables[canonical].summary.min_price = min_price;
            this._tables[canonical].summary.max_price = max_price;
            this._tables[canonical].summary.min_inverse = min_inverse;
            this._tables[canonical].summary.max_inverse = max_inverse;

            // if(canonical=="olive.tlos")console.log("Summary final:", this._tables[canonical].summary);
            // if(canonical=="olive.tlos")console.log("---------------------------------------------------");
            this.feed.setLoading("summary."+canonical, false);
            this.feed.setLoading("summary."+inverse, false);
            return this._tables[canonical].summary;
        });

        if (this._tables[canonical] && !force) {
            result = this._tables[canonical].summary;
        } else {
            result = await aux;
        }

        this.onSummaryChange.next(result);

        return result;
    }

    async getAllTablesSumaries(): Promise<any> {
        return this.waitOrderSummary.then(async _ => {
            var promises = [];

            for (var i in this._tables) {
                if (i.indexOf(".") == -1) continue;
                var p = this.getTableSummary(this._tables[i].comodity, this._tables[i].currency, true);
                promises.push(p);
            }

            /*for (var i in this.tokens) {
                var token = this.tokens[i];
                if (token != this.telos) {
                    var p = this.getTableSummary(token, this.telos, true);
                    promises.push(p);
                }
            }*/

            return Promise.all(promises).then(_ => {
                this.resortTokens();    
            });
        })
    }
    

    //
    // --------------------------------------------------------------
    // Aux functions
    private auxProcessRowsToOrders(rows:any[]): Order[] {
        var result: Order[] = [];
        for (var i=0; i < rows.length; i++) {
            var price = new Asset(rows[i].price, this);
            var inverse = new Asset(rows[i].inverse, this);
            var selling = new Asset(rows[i].selling, this);
            var total = new Asset(rows[i].total, this);
            var order:Order;

            var scope = this.getScopeFor(price.token, inverse.token);
            var canonical = this.canonicalScope(scope);
            var reverse_scope = this.inverseScope(canonical);
            

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
        var hours = [
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

    private auxAssertScope(scope:string): Table {
        var comodity_sym = scope.split(".")[0].toUpperCase();
        var currency_sym = scope.split(".")[1].toUpperCase();
        return this._tables[scope] || {
            scope: scope,
            comodity: this.getTokenNow(comodity_sym),
            currency: this.getTokenNow(currency_sym),
            orders: { sell: [], buy: [] },
            deals: 0,
            history: [],
            tx: {},
            blocks: 0,
            block: {},
            blocklist: [],
            blocklevels: [[]],
            reverseblocks: [],
            reverselevels: [[]],
            summary: {
                scope: scope
            },
            header: { 
                sell: {total:new Asset("0.0 " + comodity_sym, this), orders:0}, 
                buy: {total:new Asset("0.0 " + currency_sym, this), orders:0}
            },
        };        
    }

    private fetchDeposits(account): Promise<TableResult> {
        return this.utils.getTable("deposits", {scope:account}).then(result => {
            return result;
        });
    }

    private async fetchBalances(account): Promise<any> {
        return this.waitTokensLoaded.then(async _ => {
            var contracts = {};
            var balances = [];
            for (var i in this.tokens) {
                if (this.tokens[i].offchain) continue;
                contracts[this.tokens[i].contract] = true;
            }
            for (var contract in contracts) {
                this.feed.setLoading("balances-"+contract, true);
            }            
            for (var contract in contracts) {
                var result = await this.utils.getTable("accounts", {
                    contract:contract,
                    scope: account || this.current.name
                });
                for (var i in result.rows) {
                    balances.push(new Asset(result.rows[i].balance, this));
                }
                this.feed.setLoading("balances-"+contract, false);
            }
            return balances;
        });
    }

    private fetchOrders(params:TableParams): Promise<TableResult> {
        return this.utils.getTable("sellorders", params).then(result => {
            return result;
        });
    }

    private fetchOrderSummary(): Promise<TableResult> {
        return this.utils.getTable("ordersummary").then(result => {
            return result;
        });
    }

    private fetchBlockHistory(scope:string, page:number = 0, pagesize:number = 25): Promise<TableResult> {
        var canonical:string = this.canonicalScope(scope);
        var pages = this.getBlockHistoryTotalPagesFor(canonical, pagesize);
        var id = page*pagesize;
        // console.log("VapaeeService.fetchBlockHistory(", scope, ",",page,",",pagesize,"): id:", id, "pages:", pages);
        if (page < pages) {
            if (this._tables && this._tables[canonical] && this._tables[canonical].block["id-" + id]) {
                var result:TableResult = {more:false,rows:[]};
                for (var i=0; i<pagesize; i++) {
                    var id_i = id+i;
                    var block = this._tables[canonical].block["id-" + id_i];
                    if (block) {
                        result.rows.push(block);
                    } else {
                        break;
                    }
                }
                if (result.rows.length == pagesize) {
                    // we have the complete page in memory
                    // console.log("VapaeeService.fetchHistory(", scope, ",",page,",",pagesize,"): result:", result.rows.map(({ id }) => id));
                    return Promise.resolve(result);
                }                
            }
        }

        return this.utils.getTable("blockhistory", {scope:canonical, limit:pagesize, lower_bound:""+(page*pagesize)}).then(result => {
            // console.log("**************");
            // console.log("block History crudo:", result);
            this._tables[canonical] = this.auxAssertScope(canonical);
            this._tables[canonical].block = this._tables[canonical].block || {}; 
            // console.log("this._tables[scope].block:", this._tables[scope].block);
            for (var i=0; i < result.rows.length; i++) {
                var block:HistoryBlock = {
                    id: result.rows[i].id,
                    hour: result.rows[i].hour,
                    str: "",
                    price: new Asset(result.rows[i].price, this),
                    inverse: new Asset(result.rows[i].inverse, this),
                    entrance: new Asset(result.rows[i].entrance, this),
                    max: new Asset(result.rows[i].max, this),
                    min: new Asset(result.rows[i].min, this),
                    volume: new Asset(result.rows[i].volume, this),
                    amount: new Asset(result.rows[i].amount, this),
                    date: new Date(result.rows[i].date)
                }
                block.str = JSON.stringify([block.max.str, block.entrance.str, block.price.str, block.min.str]);
                this._tables[canonical].block["id-" + block.id] = block;
            }   
            // console.log("block History final:", this._tables[scope].block);
            // console.log("-------------");
            return result;
        });
    }    

    private fetchHistory(scope:string, page:number = 0, pagesize:number = 25): Promise<TableResult> {
        var canonical:string = this.canonicalScope(scope);
        var pages = this.getHistoryTotalPagesFor(canonical, pagesize);
        var id = page*pagesize;
        // console.log("VapaeeService.fetchHistory(", scope, ",",page,",",pagesize,"): id:", id, "pages:", pages);
        if (page < pages) {
            if (this._tables && this._tables[canonical] && this._tables[canonical].tx["id-" + id]) {
                var result:TableResult = {more:false,rows:[]};
                for (var i=0; i<pagesize; i++) {
                    var id_i = id+i;
                    var trx = this._tables[canonical].tx["id-" + id_i];
                    if (trx) {
                        result.rows.push(trx);
                    } else {
                        break;
                    }
                }
                if (result.rows.length == pagesize) {
                    // we have the complete page in memory
                    // console.log("VapaeeService.fetchHistory(", scope, ",",page,",",pagesize,"): result:", result.rows.map(({ id }) => id));
                    return Promise.resolve(result);
                }                
            }
        }

        return this.utils.getTable("history", {scope:scope, limit:pagesize, lower_bound:""+(page*pagesize)}).then(result => {

            // console.log("**************");
            // console.log("History crudo:", result);
            
            this._tables[canonical] = this.auxAssertScope(canonical);
            this._tables[canonical].history = [];
            this._tables[canonical].tx = this._tables[canonical].tx || {}; 

            // console.log("this.scopes[scope].tx:", this.scopes[scope].tx);

            for (var i=0; i < result.rows.length; i++) {
                var transaction:HistoryTx = {
                    id: result.rows[i].id,
                    str: "",
                    amount: new Asset(result.rows[i].amount, this),
                    payment: new Asset(result.rows[i].payment, this),
                    buyfee: new Asset(result.rows[i].buyfee, this),
                    sellfee: new Asset(result.rows[i].sellfee, this),
                    price: new Asset(result.rows[i].price, this),
                    inverse: new Asset(result.rows[i].inverse, this),
                    buyer: result.rows[i].buyer,
                    seller: result.rows[i].seller,
                    date: new Date(result.rows[i].date),
                    isbuy: !!result.rows[i].isbuy
                }
                transaction.str = transaction.price.str + " " + transaction.amount.str;
                this._tables[canonical].tx["id-" + transaction.id] = transaction;
            }

            for (var j in this._tables[canonical].tx) {
                this._tables[canonical].history.push(this._tables[canonical].tx[j]);
            }

            this._tables[canonical].history.sort(function(a:HistoryTx, b:HistoryTx){
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
        var id = page*pagesize+1;
        // console.log("VapaeeService.fetchActivity(", page,",",pagesize,"): id:", id);
        
        if (this.activity.events["id-" + id]) {
            var pageEvents = [];
            for (var i=0; i<pagesize; i++) {
                var id_i = id+i;
                var event = this.activity.events["id-" + id_i];
                if (!event) {
                    break;
                }
            }
            if (pageEvents.length == pagesize) {
                return;
            }                
        }        

        return this.utils.getTable("events", {limit:pagesize, lower_bound:""+id}).then(result => {
            // console.log("**************");
            // console.log("Activity crudo:", result);
            var list:EventLog[] = [];

            for (var i=0; i < result.rows.length; i++) {
                var id = result.rows[i].id;
                var event:EventLog = <EventLog>result.rows[i];
                if (!this.activity.events["id-" + id]) {
                    this.activity.events["id-" + id] = event;
                    list.push(event);
                    // console.log("**************>>>>>", id);
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
        return this.utils.getTable("userorders", {scope:user, limit:200}).then(result => {
            return result;
        });
    }
    
    private fetchSummary(scope): Promise<TableResult> {
        return this.utils.getTable("tablesummary", {scope:scope}).then(result => {
            return result;
        });
    }

    private fetchTokenStats(token): Promise<TableResult> {
        this.feed.setLoading("token-stat-"+token.symbol, true);
        return this.utils.getTable("stat", {contract:token.contract, scope:token.symbol}).then(result => {
            token.stat = result.rows[0];
            if (token.stat.issuers && token.stat.issuers[0] == "everyone") {
                token.fake = true;
            }
            this.feed.setLoading("token-stat-"+token.symbol, false);
            return token;
        });
    }

    private fetchTokensStats(extended: boolean = true) {
        console.log("Vapaee.fetchTokens()");
        this.feed.setLoading("token-stats", true);
        return this.waitTokensLoaded.then(_ => {

            var priomises = [];
            for (var i in this.tokens) {
                if (this.tokens[i].offchain) continue;
                priomises.push(this.fetchTokenStats(this.tokens[i]));
            }

            return Promise.all<any>(priomises).then(result => {
                this.setTokenstats(this.tokens);
                this.feed.setLoading("token-stats", false);
                return this.tokens;
            });            
        });

    }
    
    private updateTokensSummary() {
        console.log("**********************************");
        console.log("Vapaee.updateTokensSummary()"); 
        console.log("**********************************");
        return Promise.all([
            this.waitTokensLoaded,
            this.waitOrderSummary
        ]).then(_ => {

            // mapping of how much (amount of) tokens have been traded agregated in all markets
            var amount_map:{[key:string]:Asset} = {};

            // a cada token le asigno un price que sale de verificar su price en el mercado principal XXX/TLOS
            for (var i in this.tokens) {
                if (this.tokens[i].offchain) continue; // discard tokens that are not on-chain
                
                var token = this.tokens[i];
                var quantity:Asset = new Asset(0, token);

                for (var j in this._tables) {
                    if (j.indexOf(".") == -1) continue;
                    var table:Table = this._tables[j];
                    
                    if (table.comodity.symbol == token.symbol) {
                        quantity = quantity.plus(table.summary.amount);
                    }
                    if (table.currency.symbol == token.symbol) {
                        quantity = quantity.plus(table.summary.volume);
                    }

                    if (table.currency.symbol == this.telos.symbol) {
                        token.summary = token.summary || {
                            price: table.summary.price.clone(),
                            volume: table.summary.volume.clone(),
                            percent: table.summary.percent,
                            percent_str: table.summary.percent_str,
                        }
                    }
                }

                amount_map[token.symbol] = quantity;
            }
            
            for (var i in this.tokens) {
                if (this.tokens[i].offchain) continue;
                var token = this.tokens[i];
                

                if (token.symbol == "ACORN") console.log("TOKEN: -------- ", [token] );
                for (var j in this._tables) {
                    if (j.indexOf(".") == -1) continue;
                    var table = this._tables[j];
                    if (table.comodity.symbol == token.symbol || table.currency.symbol == token.symbol) {
                        if (token.symbol == "ACORN") if (table.comodity.symbol == "ACORN" || table.currency.symbol == "ACRON") {
                            console.log("table ", [table] );
                        }

                        // ---


                    }
                }

            }
        });        
    }

    private fetchTokens(extended: boolean = true) {
        console.log("Vapaee.fetchTokens()");

        return this.utils.getTable("tokens").then(result => {
            var data = {
                tokens: <Token[]>result.rows
            }

            for (var i in data.tokens) {
                data.tokens[i].scope = data.tokens[i].symbol.toLowerCase() + ".tlos";
                if (data.tokens[i].symbol == "TLOS") {
                    this.telos = data.tokens[i];
                }
            }

            return data;
        });
    }

    private resortTokens() {
        console.log("resortTokens()");
        this.tokens.sort((a:Token, b:Token) => {
            if (this._tables && this._tables[a.scope] && this._tables[b.scope]) {
                var a_vol = this._tables[a.scope].summary.volume;
                var b_vol = this._tables[b.scope].summary.volume;

                if (!a_vol) console.error("a_vol es undefined: ", a.scope);
                if (!b_vol) console.error("b_vol es undefined: ", b.scope);

                if(a_vol.amount.isGreaterThan(b_vol.amount)) return -1;
                if(a_vol.amount.isLessThan(b_vol.amount)) return 1;    
            }

            if (!a.scope) return -1;
            if (!b.scope) return 1;
            if(a.appname < b.appname) return -1;
            if(a.appname > b.appname) return 1;
            return 0;
        }); 

        // console.log("resortTokens()", this.tokens);

        this.onTokensReady.next(this.tokens);        
    }

}

export class Asset {
    amount:BigNumber;
    token:Token;
    
    constructor(a: any = null, b: any = null) {
        if (a == null && b == null) {
            this.amount = new BigNumber(0);
            this.token = {symbol:"SYS"};
            return;
        }

        if (a instanceof BigNumber) {
            this.amount = a;
            this.token = b;
            return;
        }

        if (typeof a == "number") {
            this.amount = new BigNumber(a);
            this.token = b;
            return;
        }

        if (b instanceof VapaeeService) {
            this.parse(a,b);
        }
    }

    plus(b:Asset) {
        console.assert(b.token.symbol == this.token.symbol, "ERROR: trying to sum assets with different tokens: " + this.str + " and " + b.str);
        var amount = this.amount.plus(b.amount);
        return new Asset(amount, this.token);
    }

    minus(b:Asset) {
        console.assert(b.token.symbol == this.token.symbol, "ERROR: trying to substract assets with different tokens: " + this.str + " and " + b.str);
        var amount = this.amount.minus(b.amount);
        return new Asset(amount, this.token);
    }

    clone(): Asset {
        return new Asset(this.amount, this.token);
    }

    parse(text: string, vapaee: VapaeeService) {
        if (text == "") return;
        var sym = text.split(" ")[1];
        this.token = vapaee.getTokenNow(sym);
        var amount_str = text.split(" ")[0];
        this.amount = new BigNumber(amount_str);
        console.assert(!!this.token || !vapaee.tokens, "ERROR: string malformed of token not found:", text);
    }

    valueToString(decimals:number = -1, total:boolean = false): string {
        if (!this.token) return "0";
        var parts = this.amount.toFixed().split(".");
        var integer = parts[0];
        var precision = this.token.precision;
        var decimal = (parts.length==2 ? parts[1] : "");
        if (decimals != -1) {
            precision = decimals;
        }
        if (total) {
            precision -= parts[0].length-1;
            precision = precision > 0 ? precision : 0;
        }
        for (var i=decimal.length; i<precision; i++) {
            decimal += "0";
        }
        if (decimal.length > precision) {
            decimal = decimal.substr(0, precision);
        }    

        if (precision == 0) {
            return integer;
        } else {
            return integer + "." + decimal;
        }
    }

    toNumber() {
        if (!this.token) return 0;
        return parseFloat(this.valueToString(8));
    }

    get str () {
        return this.toString();
    }

    toString(decimals:number = -1): string {
        if (!this.token) return "0.0000";
        return this.valueToString(decimals) + " " + this.token.symbol.toUpperCase();
    }

    inverse(token: Token): Asset {
        var result = new BigNumber(1).dividedBy(this.amount);
        var asset =  new Asset(result, token);
        return asset;
    }
}

export interface TableMap {
    [key:string]: Table;
}

export interface Table {
    scope: string;
    comodity: Token,
    currency: Token,
    deals: number;
    blocks: number;
    blocklevels: any[][][];
    blocklist: any[][];
    reverselevels: any[][][];
    reverseblocks: any[][];
    block: {[id:string]:HistoryBlock};
    orders: TokenOrders;
    history: HistoryTx[];
    tx: {[id:string]:HistoryTx};
    
    summary: MarketSummary;
    header: TableHeader;
}

export interface MarketSummary {
    scope:string,
    price?:Asset,
    inverse?:Asset,
    price_24h_ago?:Asset,
    inverse_24h_ago?:Asset,
    min_price?:Asset,
    max_price?:Asset,
    min_inverse?:Asset,
    max_inverse?:Asset,
    volume?:Asset,
    amount?:Asset,
    percent?:number,
    percent_str?:string,
    ipercent?:number,
    ipercent_str?:string,
    records?: any[]
}

export interface TableHeader {
    sell:OrdersSummary,
    buy:OrdersSummary
}

export interface OrdersSummary {
    total: Asset;
    orders: number;    
}

export interface TokenOrders {
    sell:OrderRow[],
    buy:OrderRow[]
}

export interface HistoryTx {
    id: number;
    str: string;
    price: Asset;
    inverse: Asset;
    amount: Asset;
    payment: Asset;
    buyfee: Asset;
    sellfee: Asset;
    buyer: string;
    seller: string;
    date: Date;
    isbuy: boolean;
}

export interface EventLog {
    id: number;
    user: string;
    event: string;
    params: string;
    date: Date;
    processed?: any;
}

export interface HistoryBlock {
    id: number;
    hour: number;
    str: string;
    price: Asset;
    inverse: Asset;
    entrance: Asset;
    max: Asset;
    min: Asset;
    volume: Asset;
    amount: Asset;
    date: Date;
}

export interface Order {
    id: number;
    price: Asset;
    inverse: Asset;
    total: Asset;
    deposit: Asset;
    telos: Asset;
    owner: string;
}

export interface UserOrdersMap {
    [key:string]: UserOrders;
}

export interface UserOrders {
    table: string;
    ids: number[];
    orders?:any[];
}

export interface OrderRow {
    str: string;
    price: Asset;
    orders: Order[];
    inverse: Asset;
    total: Asset;
    sum: Asset;
    sumtelos: Asset;
    telos: Asset;
    owners: {[key:string]:boolean}
}