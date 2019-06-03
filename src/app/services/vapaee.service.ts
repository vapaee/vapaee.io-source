import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ScatterService, Account, AccountData } from './scatter.service';
import { Utils, Token, TableResult, TableParams } from './utils.service';
import BigNumber from "bignumber.js";
import { Feedback } from './feedback.service';
import { AnalyticsService } from './common/common.services';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';

@Injectable()
export class VapaeeService {

    public loginState: string;
    /*
    public loginState: string;
    - 'no-scatter': Scatter no detected
    - 'no-logged': Scatter detected but user is not logged
    - 'account-ok': user logger with scatter
    */

    public zero_telos: Asset;
    public telos: Token;
    public tokens: Token[];
    public scopes: TableMap;
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
    public onSummaryChange:Subject<string> = new Subject();
    public onBlocklistChange:Subject<any[][]> = new Subject();
    public onTokensReady:Subject<Token[]> = new Subject();
    vapaeetokens:string = "vapaeetokens";    
    
    private setOrdertables: Function;
    public waitOrdertables: Promise<any> = new Promise((resolve) => {
        this.setOrdertables = resolve;
    });

    private setTokenstats: Function;
    public waitTokenstats: Promise<any> = new Promise((resolve) => {
        this.setTokenstats = resolve;
    });

    private setReady: Function;
    public waitReady: Promise<any> = new Promise((resolve) => {
        this.setReady = resolve;
    });
    constructor(
        private scatter: ScatterService,
        private cookies: CookieService, 
        public analytics: AnalyticsService,
        private datePipe: DatePipe
    ) {
        this.scopes = {};
        this.current = this.default;
        this.contract = this.vapaeetokens;
        this.utils = new Utils(this.contract, this.scatter);
        this.feed = new Feedback();
        this.scatter.onLogggedStateChange.subscribe(this.onLoggedChange.bind(this));
        this.updateLogState();
        this.fetchTokens().then(data => {
            this.tokens = data.tokens;
            console.log("********************************");
            console.log("********************************");
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
            console.log(JSON.parse(JSON.stringify(this.tokens)));
            console.log("********************************");
            console.log("********************************");
            this.resortTokens();
            this.zero_telos = new Asset("0.0000 TLOS", this);
            this.setReady();
            this.fetchTokensStats();
            this.getAllTablesSumaries();
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

    inverseScope(scope:string) {
        if (!scope) return scope;
        console.assert(typeof scope =="string", "ERROR: string scope expected, got ", typeof scope, scope);
        var parts = scope.split(".");
        console.assert(parts.length == 2, "ERROR: scope format expected is xxx.yyy, got: ", typeof scope, scope);
        var inverse = parts[1] + "." + parts[0];
        return inverse;
    }

    // -- User Log State ---------------------------------------------------
    login() {
        this.feed.setLoading("login", true);
        this.logout();
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
            console.log("this.onCurrentAccountChange.next(this.current.name) !!!!!!");
            this.onCurrentAccountChange.next(this.current.name);
            this.updateCurrentUser();
            this.feed.setLoading("account", false);
        }       
    }

    private updateLogState() {
        this.loginState = "no-scatter";
        this.feed.setLoading("log-state", true);
        // console.error("VapaeeService.updateLogState() ", this.loginState);
        this.scatter.waitConnected.then(() => {
            this.loginState = "no-logged";
            // console.error("VapaeeService.updateLogState()   ", this.loginState);
            if (this.scatter.logged) {
                this.loginState = "account-ok";
                // console.error("VapaeeService.updateLogState()     ", this.loginState);
            }
            this.feed.setLoading("log-state", false);
        });

        var timer = setInterval(_ => {
            if (!this.feed.loading("connect")) {
                this.feed.setLoading("log-state", false);
                clearInterval(timer);
            }
        }, 200);
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
        return this.utils.excecute("order", {
            owner:  this.scatter.account.name,
            type: type,
            total: amount.toString(8),
            price: price.toString(8)
        }).then(async result => {
            this.updateTrade(amount.token, price.token);
            return result;
        });
    }

    cancelOrder(type:string, comodity:Token, currency:Token, orders:number[]) {
        // '["alice", "buy", "CNT", "TLOS", [1,0]]'
        // name owner, name type, const asset & total, const asset & price
        return this.utils.excecute("cancel", {
            owner:  this.scatter.account.name,
            type: type,
            comodity: comodity.symbol,
            currency: currency.symbol,
            orders: orders
        }).then(async result => {
            this.updateTrade(comodity, currency);
            return result;
        });
    }

    deposit(quantity:Asset) {
        // name owner, name type, const asset & total, const asset & price
        var util = new Utils(quantity.token.contract, this.scatter);
        return util.excecute("transfer", {
            from:  this.scatter.account.name,
            to: this.vapaeetokens,
            quantity: quantity.toString(),
            memo: "deposit"
        }).then(async result => {
            await this.getDeposits();
            await this.getBalances();
            return result;
        });
    }    

    withdraw(quantity:Asset) {
        return this.utils.excecute("withdraw", {
            owner:  this.scatter.account.name,
            quantity: quantity.toString()
        }).then(async result => {
            await this.getDeposits();
            await this.getBalances();
            return result;
        });
    }

    // Tokens --------------------------------------------------------------
    addFiatToken(fiat: Token) {
        console.log("VapaeeService.addFiatToken()", fiat);
        this.waitReady.then(_ => {
            this.tokens.push({
                symbol: fiat.symbol,
                precision: fiat.precision || 4,
                contract: "nocontract",
                appname: fiat.appname,
                website: "",
                logo:"",
                logolg: "",
                scope: "",
                stat: null,
                verified: false,
                fiat: true
            });
        });        
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
        for (var i in this.tokens) {
            if (this.tokens[i].symbol.toUpperCase() == sym.toUpperCase()) {
                return this.tokens[i];
            }
        }
        return null;
    }

    async getToken(sym:string): Promise<Token> {
        return this.waitReady.then(_ => {
            return this.getTokenNow(sym);
        });
    }

    async getDeposits(account:string = null): Promise<any> {
        console.log("VapaeeService.getDeposits()");
        this.feed.setLoading("deposits", true);
        return this.waitReady.then(async _ => {
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
        return this.waitReady.then(async _ => {
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
        return this.waitReady.then(async _ => {
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
        return this.waitReady.then(async _ => {
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

    async updateTrade(comodity:Token, currency:Token, updateUser:boolean = true): Promise<any> {
        console.log("VapaeeService.updateTrade()");
        return Promise.all([
            this.getTransactionHistory(comodity, currency, -1, -1, true),
            this.getBlockHistory(comodity, currency, -1, -1, true),
            this.getSellOrders(comodity, currency, true),
            this.getBuyOrders(comodity, currency, true),
            this.getTableSummary(comodity, currency, true),
            this.getOrderTables(),
            updateUser ? this.updateCurrentUser(): null
        ]).then(r => {
            this.resortTokens();
            return r;
        });
    }

    async updateCurrentUser(): Promise<any> {
        console.log("VapaeeService.updateCurrentUser()");
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

    getBlockHistoryTotalPagesFor(scope:string, pagesize: number) {
        if (!this.scopes || !this.scopes[scope]) return 0;
        var total = this.scopes[scope].blocks;
        var mod = total % pagesize;
        var dif = total - mod;
        var pages = dif / pagesize;
        if (mod > 0) {
            pages +=1;
        }
        return pages;
    }

    getHistoryTotalPagesFor(scope:string, pagesize: number) {
        if (!this.scopes || !this.scopes[scope]) return 0;
        var total = this.scopes[scope].deals;
        var mod = total % pagesize;
        var dif = total - mod;
        var pages = dif / pagesize;
        if (mod > 0) {
            pages +=1;
        }
        return pages;
    }

    async getTransactionHistory(comodity:Token, currency:Token, page:number = -1, pagesize:number = -1, force:boolean = false): Promise<any> {
        var scope:string = comodity.symbol.toLowerCase() + "." + currency.symbol.toLowerCase();
        if (comodity == this.telos) {
            scope = currency.symbol.toLowerCase() + "." + comodity.symbol.toLowerCase();
        }        
        var aux = null;
        var result = null;
        this.feed.setLoading("history."+scope, true);
        aux = this.waitOrdertables.then(async _ => {
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
                return this.scopes[scope].history;
            }).catch(e => {
                this.feed.setLoading("history."+scope, false);
                throw e;
            });
        });

        if (this.scopes[scope] && !force) {
            result = this.scopes[scope].history;
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
        console.log("VapaeeService.getBlockHistory()", comodity.symbol);
        var scope:string = comodity.symbol.toLowerCase() + "." + currency.symbol.toLowerCase();
        if (comodity == this.telos) {
            scope = currency.symbol.toLowerCase() + "." + comodity.symbol.toLowerCase();
        }
        var aux = null;
        var result = null;
        this.feed.setLoading("block-history."+scope, true);

        aux = this.waitOrdertables.then(async _ => {
            if (pagesize == -1) {
                pagesize = 10;
            }
            if (page == -1) {
                var pages = this.getBlockHistoryTotalPagesFor(scope, pagesize); /// aaaaaaaaaaaaaaa
                page = pages-3;
                if (page < 0) page = 0;
            }
            var promises = [];
            for (var i=0; i<pages; i++) {
                var promise = this.fetchBlockHistory(scope, i, pagesize);
                promises.push(promise);
            }

            return Promise.all(promises).then(_ => {
                this.feed.setLoading("block-history."+scope, false);
                this.scopes[scope].blocklist = [];
                var now = new Date();
                var hora = 1000 * 60 * 60;
                var hour = Math.floor(now.getTime()/hora);
                // console.log("->", hour);
                var last_block = null;
                var last_hour = null;
                for (var i in this.scopes[scope].block) {
                    var block:HistoryBlock = this.scopes[scope].block[i];
                    var label = this.auxHourToLabel(block.hour);
                    // console.log("->", i, label, block);
                    var obj:any[] = [label];
                    if (last_block) {
                        var dif = block.hour - last_block.hour;
                        for (var j=1; j<dif; j++) {
                            var label_i = this.auxHourToLabel(last_block.hour+j);
                            // console.log("-->", j, label_i, block);
                            var price = last_block.price.amount.toNumber();
                            var aux = [label_i, price, price, price, price];
                            this.scopes[scope].blocklist.push(aux);
                        }
                    }
                    obj.push(block.max.amount.toNumber());
                    obj.push(block.entrance.amount.toNumber());
                    obj.push(block.price.amount.toNumber());
                    obj.push(block.min.amount.toNumber());
                    this.scopes[scope].blocklist.push(obj);
                    last_block = block;
                }

                if (last_block && hour != last_block.hour) {
                    var dif = hour - last_block.hour;
                    for (var j=1; j<=dif; j++) {
                        var label_i = this.auxHourToLabel(last_block.hour+j);
                        var price = last_block.price.amount.toNumber();
                        var aux = [label_i, price, price, price, price];
                        this.scopes[scope].blocklist.push(aux);
                    }
                }
                
                // console.log("---------------->", this.scopes[scope].blocklist);
                this.onBlocklistChange.next(this.scopes[scope].blocklist);
                return this.scopes[scope].block;
            }).catch(e => {
                this.feed.setLoading("block-history."+scope, false);
                throw e;
            });
        });

        if (this.scopes[scope] && !force) {
            result = this.scopes[scope].block;
        } else {
            result = aux;
        }

        this.onHistoryChange.next(result);

        return result;
    }

    async getSellOrders(comodity:Token, currency:Token, force:boolean = false): Promise<any> {
        var scope:string = comodity.symbol.toLowerCase() + "." + currency.symbol.toLowerCase();
        var aux = null;
        var result = null;
        this.feed.setLoading("sellorders", true);
        aux = this.waitReady.then(async _ => {
            var orders = await this.fetchOrders({scope:scope, limit:50, index_position: "2", key_type: "i64"});
            this.scopes[scope] = this.auxAssertScope(scope);
            // if(scope=="vpe.tlos" || scope=="cnt.tlos")console.log("-------------");
            // if(scope=="vpe.tlos" || scope=="cnt.tlos")console.log("Sell crudo:", orders);
            var sell: Order[] = this.auxProcessRowsToOrders(orders.rows);
            sell.sort(function(a:Order, b:Order){
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

            this.scopes[scope].orders.sell = list;
            // if(scope=="vpe.tlos" || scope=="cnt.tlos")console.log("Sell final:", this.scopes[scope].orders.sell);
            // if(scope=="vpe.tlos" || scope=="cnt.tlos")console.log("-------------");

            this.feed.setLoading("sellorders", false);            
            return orders;
        });

        if (this.scopes[scope] && !force) {
            result = this.scopes[scope].orders.sell;
        } else {
            result = aux;
        }
        return result;
    }
    
    async getBuyOrders(comodity:Token, currency:Token, force:boolean = false): Promise<any> {
        var invere_scope:string = currency.symbol.toLowerCase() + "." + comodity.symbol.toLowerCase();
        var scope:string = comodity.symbol.toLowerCase() + "." + currency.symbol.toLowerCase();
        var aux = null;
        var result = null;
        this.feed.setLoading("buyorders", true);
        aux = this.waitReady.then(async _ => {
            var orders = await await this.fetchOrders({scope:invere_scope, limit:50, index_position: "2", key_type: "i64"});
            this.scopes[scope] = this.auxAssertScope(scope);
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

            this.scopes[scope].orders.buy = list;
            // console.log("Buy final:", this.scopes[scope].orders.buy);
            // console.log("-------------");
            this.feed.setLoading("buyorders", false);
            return orders;
        });

        if (this.scopes[scope] && !force) {
            result = this.scopes[scope].orders.buy;
        } else {
            result = aux;
        }
        return result;
    }
    
    async getOrderTables(): Promise<any> {
        // console.log("VapaeeService.getOrderTables()");
        var tables = await this.fetchOrderTables();

        for (var i in tables.rows) {
            var scope:string = tables.rows[i].table;
            var comodity = scope.split(".")[0].toUpperCase();
            var currency = scope.split(".")[1].toUpperCase();
            this.scopes[scope] = this.auxAssertScope(scope);
            if (tables.rows[i].pay == comodity && tables.rows[i].sell == currency) {
                this.scopes[scope].header.buy.total = new Asset(tables.rows[i].total, this);
                this.scopes[scope].header.buy.orders = tables.rows[i].orders;
            }
            if (tables.rows[i].pay == currency && tables.rows[i].sell == comodity) {
                this.scopes[scope].header.sell.total = new Asset(tables.rows[i].total, this);
                this.scopes[scope].header.sell.orders = tables.rows[i].orders;
                this.scopes[scope].deals = tables.rows[i].deals;
                this.scopes[scope].blocks = tables.rows[i].blocks;
            }
        }

        // if (tables.rows.length > 0) {
            this.setOrdertables();
            this.waitOrdertables = new Promise((resolve) => {
                this.setOrdertables = resolve;
            });
        // }
    }

    async getTableSummary(comodity:Token, currency:Token, force:boolean = false): Promise<any> {
        var scope:string = comodity.symbol.toLowerCase() + "." + currency.symbol.toLowerCase();
        if (comodity == this.telos) {
            scope = currency.symbol.toLowerCase() + "." + comodity.symbol.toLowerCase();
        }
        this.feed.setLoading("summary."+scope, true);
        var aux = null;
        var result = null;
        aux = this.waitReady.then(async _ => {
            var summary = await this.fetchSummary(scope);
            // if(scope=="olive.tlos")console.log(scope, "---------------------------------------------------");
            // if(scope=="olive.tlos")console.log("Summary crudo:", summary.rows);

            this.scopes[scope] = this.auxAssertScope(scope);
            this.scopes[scope].summary = {
                price: new Asset("0.0000 TLOS", this),
                volume: new Asset("0.0000 TLOS", this),
                percent: 0.3,
                records: summary.rows
            };

            var now:Date = new Date();
            var now_sec: number = Math.floor(now.getTime() / 1000);
            var now_hour: number = Math.floor(now_sec / 3600);
            var start_hour = now_hour - 23;
            // if(scope=="olive.tlos")console.log("now_hour:", now_hour);
            // if(scope=="olive.tlos")console.log("start_hour:", start_hour);

            // proceso los datos crudos 
            var ZERO_TLOS = "0.00000000 TLOS";
            var price = ZERO_TLOS;
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
                        price = summary.rows[i].price;
                        // if(scope=="olive.tlos")console.log("hh:", hh, "last_hh:", last_hh, "price:", price);
                    }    
                }
                /*
                */
            }
            // if(scope=="olive.tlos")console.log("crude:", crude);
            // if(scope=="olive.tlos")console.log("price:", price);

            // genero una entrada por cada una de las últimas 24 horas
            var last_24h = {};
            var volume = new Asset(ZERO_TLOS, this);
            var price_asset = new Asset(price, this);
            var max_price = price_asset.clone();
            var min_price = price_asset.clone();
            var first:Asset = null;
            for (var i=0; i<24; i++) {
                var current = start_hour+i;
                var current_date = new Date(current * 3600 * 1000);
                last_24h[current] = crude[current] || {
                    label: this.auxGetLabelForHour(current % 24),
                    price: price,
                    volume: ZERO_TLOS,
                    date: current_date.toISOString().split(".")[0],
                    hour: current
                };
                // if(scope=="olive.tlos")console.log("current_date:", current_date.toISOString(), current, last_24h[current]);
                price = last_24h[current].price;
                var vol = new Asset(last_24h[current].volume, this);
                volume.amount = volume.amount.plus(vol.amount);
                if (price != ZERO_TLOS && !first) {
                    first = new Asset(price, this);
                }
                price_asset = new Asset(price, this);
                if (price_asset.amount.isGreaterThan(max_price.amount)) {
                    max_price = price_asset.clone();
                }
                if (price_asset.amount.isLessThan(min_price.amount)) {
                    min_price = price_asset.clone();
                }
            }
            if (!first) {
                first = new Asset(last_24h[start_hour].price, this);
            }
            var last =  new Asset(last_24h[now_hour].price, this);
            var diff = last.clone();
            // diff.amount 
            diff.amount = last.amount.minus(first.amount);
            var ratio:number = 0;
            if (first.amount.toNumber() != 0) {
                ratio = diff.amount.dividedBy(first.amount).toNumber();
            }            
            var percent = Math.floor(ratio * 10000) / 100;

            // if(scope=="olive.tlos")console.log("last_24h:", [last_24h]);
            // if(scope=="olive.tlos")console.log("first:", first.toString(8));
            // if(scope=="olive.tlos")console.log("last:", last.toString(8));
            // if(scope=="olive.tlos")console.log("diff:", diff.toString(8));
            // if(scope=="olive.tlos")console.log("percent:", percent);
            // if(scope=="olive.tlos")console.log("ratio:", ratio);
            // if(scope=="olive.tlos")console.log("volume:", volume.str);

            this.scopes[scope].summary.price = last;
            this.scopes[scope].summary.percent_str = (isNaN(percent) ? 0 : percent) + "%";
            this.scopes[scope].summary.percent = isNaN(percent) ? 0 : percent;
            this.scopes[scope].summary.volume = volume;
            this.scopes[scope].summary.min_price = min_price;
            this.scopes[scope].summary.max_price = max_price;

            // if(scope=="olive.tlos")console.log("Summary final:", this.scopes[scope].summary);
            // if(scope=="olive.tlos")console.log("---------------------------------------------------");
            this.feed.setLoading("summary."+scope, false);
            return summary;
        });

        if (this.scopes[scope] && !force) {
            result = this.scopes[scope].summary;
        } else {
            result = aux;
        }

        this.onSummaryChange.next(result);

        return result;
    }

    async getAllTablesSumaries(): Promise<any> {
        return this.waitReady.then(async _ => {
            var promises = [];

            for (var i in this.tokens) {
                var token = this.tokens[i];
                if (token != this.telos) {
                    var p = this.getTableSummary(token, this.telos, true);
                    promises.push(p);
                }
            }

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

            if (this.telos.symbol == price.token.symbol) {
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
        return this.scopes[scope] || {
            scope: scope,
            orders: { sell: [], buy: [] },
            deals: 0,
            history: [],
            tx: {},
            blocks: 0,
            block: {},
            blocklist: [],
            summary: {},
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
        return this.waitReady.then(async _ => {
            var contracts = {};
            var balances = [];
            for (var i in this.tokens) {
                if (this.tokens[i].fiat) continue;
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

    private fetchOrderTables(): Promise<TableResult> {
        return this.utils.getTable("ordertables").then(result => {
            return result;
        });
    }

    private fetchBlockHistory(scope:string, page:number = 0, pagesize:number = 25): Promise<TableResult> {
        var pages = this.getBlockHistoryTotalPagesFor(scope, pagesize);
        var id = page*pagesize;
        // console.log("VapaeeService.fetchBlockHistory(", scope, ",",page,",",pagesize,"): id:", id, "pages:", pages);
        if (page < pages) {
            if (this.scopes[scope].block["id-" + id]) {
                var result:TableResult = {more:false,rows:[]};
                for (var i=0; i<pagesize; i++) {
                    var id_i = id+i;
                    var block = this.scopes[scope].block["id-" + id_i];
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

        return this.utils.getTable("blockhistory", {scope:scope, limit:pagesize, lower_bound:""+(page*pagesize)}).then(result => {
            // console.log("**************");
            // console.log("block History crudo:", result);
            this.scopes[scope] = this.auxAssertScope(scope);
            this.scopes[scope].block = this.scopes[scope].block || {}; 
            // console.log("this.scopes[scope].block:", this.scopes[scope].block);
            for (var i=0; i < result.rows.length; i++) {
                var block:HistoryBlock = {
                    id: result.rows[i].id,
                    hour: result.rows[i].hour,
                    price: new Asset(result.rows[i].price, this),
                    entrance: new Asset(result.rows[i].entrance, this),
                    max: new Asset(result.rows[i].max, this),
                    min: new Asset(result.rows[i].min, this),
                    volume: new Asset(result.rows[i].volume, this),
                    date: new Date(result.rows[i].date)
                }
                this.scopes[scope].block["id-" + block.id] = block;
            }   
            // console.log("block History final:", this.scopes[scope].block);
            // console.log("-------------");
            return result;
        });
    }    

    private fetchHistory(scope:string, page:number = 0, pagesize:number = 25): Promise<TableResult> {
        var pages = this.getHistoryTotalPagesFor(scope, pagesize);
        var id = page*pagesize;
        // console.log("VapaeeService.fetchHistory(", scope, ",",page,",",pagesize,"): id:", id, "pages:", pages);
        if (page < pages) {
            if (this.scopes[scope].tx["id-" + id]) {
                var result:TableResult = {more:false,rows:[]};
                for (var i=0; i<pagesize; i++) {
                    var id_i = id+i;
                    var trx = this.scopes[scope].tx["id-" + id_i];
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
            
            this.scopes[scope] = this.auxAssertScope(scope);
            this.scopes[scope].history = [];
            this.scopes[scope].tx = this.scopes[scope].tx || {}; 

            // console.log("this.scopes[scope].tx:", this.scopes[scope].tx);

            for (var i=0; i < result.rows.length; i++) {
                var transaction:HistoryTx = {
                    id: result.rows[i].id,
                    amount: new Asset(result.rows[i].amount, this),
                    payment: new Asset(result.rows[i].payment, this),
                    buyfee: new Asset(result.rows[i].buyfee, this),
                    sellfee: new Asset(result.rows[i].sellfee, this),
                    price: new Asset(result.rows[i].price, this),
                    buyer: result.rows[i].buyer,
                    seller: result.rows[i].seller,
                    date: new Date(result.rows[i].date),
                    isbuy: !!result.rows[i].isbuy
                }
                this.scopes[scope].tx["id-" + transaction.id] = transaction;
            }

            for (var j in this.scopes[scope].tx) {
                this.scopes[scope].history.push(this.scopes[scope].tx[j]);
            }

            this.scopes[scope].history.sort(function(a:HistoryTx, b:HistoryTx){
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
        return this.waitReady.then(_ => {

            var priomises = [];
            for (var i in this.tokens) {
                if (this.tokens[i].fiat) continue;
                priomises.push(this.fetchTokenStats(this.tokens[i]));
            }

            return Promise.all<any>(priomises).then(result => {
                this.setTokenstats(this.tokens);
                this.feed.setLoading("token-stats", false);
                return this.tokens;
            });            
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
        this.tokens.sort((a:Token, b:Token) => {
            if (this.scopes && this.scopes[a.scope] && this.scopes[b.scope]) {
                var a_vol = this.scopes[a.scope].summary.volume;
                var b_vol = this.scopes[b.scope].summary.volume;
                if(a_vol.amount.isGreaterThan(b_vol.amount)) return -1;
                if(a_vol.amount.isLessThan(b_vol.amount)) return 1;    
            }
            if(a.appname < b.appname) return -1;
            if(a.appname > b.appname) return 1;
            return 0;
        }); 

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

    clone(): Asset {
        return new Asset(this.amount, this.token);
    }

    parse(text: string, vapaee: VapaeeService) {
        if (text == "") return;
        var sym = text.split(" ")[1];
        this.token = vapaee.getTokenNow(sym);
        var amount_str = text.split(" ")[0];
        this.amount = new BigNumber(amount_str);
        console.assert(!!this.token, "ERROR: string malformed of token not found:", text);
    }

    valueToString(decimals:number = -1): string {
        if (!this.token) return "0";
        var parts = ("" + this.amount).split(".");
        var integer = parts[0];
        var precision = this.token.precision;
        var decimal = (parts.length==2 ? parts[1] : "");
        if (decimals != -1) {
            precision = decimals;
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
    deals: number;
    blocks: number;
    blocklist: any[][];
    block: {[id:string]:HistoryBlock};
    orders: TokenOrders;
    history: HistoryTx[];
    tx: {[id:string]:HistoryTx};
    
    summary: Summary;
    header: TableHeader;
}

export interface Summary {
    price?:Asset,
    min_price?:Asset,
    max_price?:Asset,
    volume?:Asset,
    percent?:number,
    percent_str?:string,
    records?: any[]
}

export interface TableHeader {
    sell:TableSummary,
    buy:TableSummary
}

export interface TableSummary {
    total: Asset;
    orders: number;    
}

export interface TokenOrders {
    sell:OrderRow[],
    buy:OrderRow[]
}

export interface HistoryTx {
    id: number;
    price: Asset;
    amount: Asset;
    payment: Asset;
    buyfee: Asset;
    sellfee: Asset;
    buyer: string;
    seller: string;
    date: Date;
    isbuy: boolean;
}

export interface HistoryBlock {
    id: number;
    hour: number;
    price: Asset;
    entrance: Asset;
    max: Asset;
    min: Asset;
    volume: Asset;
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