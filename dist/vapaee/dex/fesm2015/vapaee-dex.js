import { Token, Asset, VapaeeScatter } from '@vapaee/scatter';
import BigNumber from 'bignumber.js';
import { __awaiter } from 'tslib';
import { Injectable, NgModule, defineInjectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { Feedback } from '@vapaee/feedback';
import { CookieService as CookieService$1 } from 'ngx-cookie-service/cookie-service/cookie.service';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class TokenDEX extends Token {
    /**
     * @param {?=} obj
     */
    constructor(obj = null) {
        super(obj);
        if (typeof obj == "object") {
            delete obj.symbol;
            delete obj.precision;
            delete obj.contract;
            Object.assign(this, obj);
        }
        this.toString();
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class AssetDEX extends Asset {
    /**
     * @param {?=} a
     * @param {?=} b
     */
    constructor(a = null, b = null) {
        super(a, b);
        if (a instanceof AssetDEX) {
            this.amount = a.amount;
            this.token = b;
            return;
        }
        if (!!b && b['getTokenNow']) {
            this.parseDex(a, b);
        }
    }
    /**
     * @return {?}
     */
    clone() {
        return new AssetDEX(this.amount, this.token);
    }
    /**
     * @param {?} b
     * @return {?}
     */
    plus(b) {
        console.assert(!!b, "ERROR: b is not an Asset", b, this.str);
        console.assert(b.token.symbol == this.token.symbol, "ERROR: trying to sum assets with different tokens: " + this.str + " and " + b.str);
        /** @type {?} */
        var amount = this.amount.plus(b.amount);
        return new AssetDEX(amount, this.token);
    }
    /**
     * @param {?} b
     * @return {?}
     */
    minus(b) {
        console.assert(!!b, "ERROR: b is not an Asset", b, this.str);
        console.assert(b.token.symbol == this.token.symbol, "ERROR: trying to substract assets with different tokens: " + this.str + " and " + b.str);
        /** @type {?} */
        var amount = this.amount.minus(b.amount);
        return new AssetDEX(amount, this.token);
    }
    /**
     * @param {?} text
     * @param {?} dex
     * @return {?}
     */
    parseDex(text, dex) {
        if (text == "")
            return;
        /** @type {?} */
        var sym = text.split(" ")[1];
        this.token = dex.getTokenNow(sym);
        /** @type {?} */
        var amount_str = text.split(" ")[0];
        this.amount = new BigNumber(amount_str);
    }
    /**
     * @param {?=} decimals
     * @return {?}
     */
    toString(decimals = -1) {
        if (!this.token)
            return "0.0000";
        return this.valueToString(decimals) + " " + this.token.symbol.toUpperCase();
    }
    /**
     * @param {?} token
     * @return {?}
     */
    inverse(token) {
        /** @type {?} */
        var result = new BigNumber(1).dividedBy(this.amount);
        /** @type {?} */
        var asset = new AssetDEX(result, token);
        return asset;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class VapaeeDEX {
    /**
     * @param {?} scatter
     * @param {?} cookies
     * @param {?} datePipe
     */
    constructor(scatter, cookies, datePipe) {
        this.scatter = scatter;
        this.cookies = cookies;
        this.datePipe = datePipe;
        this.onLoggedAccountChange = new Subject();
        this.onCurrentAccountChange = new Subject();
        this.onHistoryChange = new Subject();
        this.onMarketSummary = new Subject();
        this.onTokensReady = new Subject();
        this.onMarketReady = new Subject();
        this.onTradeUpdated = new Subject();
        this.vapaeetokens = "vapaeetokens";
        this.activityPagesize = 10;
        this.waitOrderSummary = new Promise((resolve) => {
            this.setOrderSummary = resolve;
        });
        this.waitTokenStats = new Promise((resolve) => {
            this.setTokenStats = resolve;
        });
        this.waitMarketSummary = new Promise((resolve) => {
            this.setMarketSummary = resolve;
        });
        this.waitTokenSummary = new Promise((resolve) => {
            this.setTokenSummary = resolve;
        });
        this.waitTokensLoaded = new Promise((resolve) => {
            this.setTokensLoaded = resolve;
        });
        this._markets = {};
        this._reverse = {};
        this.activity = { total: 0, events: {}, list: [] };
        this.current = this.default;
        this.contract_name = this.vapaeetokens;
        this.contract = this.scatter.getSmartContract(this.contract_name);
        this.feed = new Feedback();
        this.scatter.onLogggedStateChange.subscribe(this.onLoggedChange.bind(this));
        this.updateLogState();
        this.fetchTokens().then(data => {
            this.tokens = data.tokens;
            this.tokens.push(new TokenDEX({
                appname: "Viitasphere",
                contract: "viitasphere1",
                logo: "/assets/logos/viitasphere.png",
                logolg: "/assets/logos/viitasphere-lg.png",
                precision: 4,
                scope: "viitct.tlos",
                symbol: "VIITA",
                verified: false,
                website: "https://viitasphere.com"
            }));
            this.tokens.push(new TokenDEX({
                appname: "Viitasphere",
                contract: "viitasphere1",
                logo: "/assets/logos/viitasphere.png",
                logolg: "/assets/logos/viitasphere-lg.png",
                precision: 0,
                scope: "viitct.tlos",
                symbol: "VIICT",
                verified: false,
                website: "https://viitasphere.com"
            }));
            this.zero_telos = new AssetDEX("0.0000 TLOS", this);
            this.setTokensLoaded();
            this.fetchTokensStats();
            this.getOrderSummary();
            this.getAllTablesSumaries();
        });
        /** @type {?} */
        var timer;
        this.onMarketSummary.subscribe(summary => {
            clearTimeout(timer);
            timer = setTimeout(_ => {
                this.updateTokensSummary();
            }, 100);
        });
    }
    /**
     * @return {?}
     */
    get default() {
        return this.scatter.default;
    }
    /**
     * @return {?}
     */
    get logged() {
        if (this.scatter.logged && !this.scatter.account) ;
        return this.scatter.logged ?
            (this.scatter.account ? this.scatter.account.name : this.scatter.default.name) :
            null;
    }
    /**
     * @return {?}
     */
    get account() {
        return this.scatter.logged ?
            this.scatter.account :
            this.scatter.default;
    }
    /**
     * @return {?}
     */
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
    /**
     * @return {?}
     */
    logout() {
        this.feed.setLoading("logout", true);
        this.scatter.logout();
    }
    /**
     * @return {?}
     */
    onLogout() {
        this.feed.setLoading("logout", false);
        console.log("VapaeeDEX.onLogout()");
        this.resetCurrentAccount(this.default.name);
        this.updateLogState();
        this.onLoggedAccountChange.next(this.logged);
        this.cookies.delete("login");
        setTimeout(_ => { this.last_logged = this.logged; }, 400);
    }
    /**
     * @param {?} name
     * @return {?}
     */
    onLogin(name) {
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
    /**
     * @return {?}
     */
    onLoggedChange() {
        console.log("VapaeeDEX.onLoggedChange()");
        if (this.scatter.logged) {
            this.onLogin(this.scatter.account.name);
        }
        else {
            this.onLogout();
        }
    }
    /**
     * @param {?} profile
     * @return {?}
     */
    resetCurrentAccount(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("VapaeeDEX.resetCurrentAccount()", this.current.name, "->", profile);
            if (this.current.name != profile && (this.current.name == this.last_logged || profile != "guest")) {
                this.feed.setLoading("account", true);
                this.current = this.default;
                this.current.name = profile;
                if (profile != "guest") {
                    this.current.data = yield this.getAccountData(this.current.name);
                }
                else {
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
        });
    }
    /**
     * @return {?}
     */
    updateLogState() {
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
        /** @type {?} */
        var timer2;
        /** @type {?} */
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
    /**
     * @param {?} name
     * @return {?}
     */
    getAccountData(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.scatter.queryAccountData(name).catch((_) => __awaiter(this, void 0, void 0, function* () {
                return this.default.data;
            }));
        });
    }
    /**
     * @param {?} type
     * @param {?} amount
     * @param {?} price
     * @return {?}
     */
    createOrder(type, amount, price) {
        // "alice", "buy", "2.50000000 CNT", "0.40000000 TLOS"
        // name owner, name type, const asset & total, const asset & price
        this.feed.setLoading("order-" + type, true);
        return this.contract.excecute("order", {
            owner: this.scatter.account.name,
            type: type,
            total: amount.toString(8),
            price: price.toString(8)
        }).then((result) => __awaiter(this, void 0, void 0, function* () {
            this.updateTrade(amount.token, price.token);
            this.feed.setLoading("order-" + type, false);
            return result;
        })).catch(e => {
            this.feed.setLoading("order-" + type, false);
            console.error(e);
            throw e;
        });
    }
    /**
     * @param {?} type
     * @param {?} comodity
     * @param {?} currency
     * @param {?} orders
     * @return {?}
     */
    cancelOrder(type, comodity, currency, orders) {
        // '["alice", "buy", "CNT", "TLOS", [1,0]]'
        // name owner, name type, const asset & total, const asset & price
        this.feed.setLoading("cancel-" + type, true);
        for (var i in orders) {
            this.feed.setLoading("cancel-" + type + "-" + orders[i], true);
        }
        return this.contract.excecute("cancel", {
            owner: this.scatter.account.name,
            type: type,
            comodity: comodity.symbol,
            currency: currency.symbol,
            orders: orders
        }).then((result) => __awaiter(this, void 0, void 0, function* () {
            this.updateTrade(comodity, currency);
            this.feed.setLoading("cancel-" + type, false);
            for (var i in orders) {
                this.feed.setLoading("cancel-" + type + "-" + orders[i], false);
            }
            return result;
        })).catch(e => {
            this.feed.setLoading("cancel-" + type, false);
            for (var i in orders) {
                this.feed.setLoading("cancel-" + type + "-" + orders[i], false);
            }
            console.error(e);
            throw e;
        });
    }
    /**
     * @param {?} quantity
     * @return {?}
     */
    deposit(quantity) {
        /** @type {?} */
        var contract = this.scatter.getSmartContract(quantity.token.contract);
        this.feed.setError("deposit", null);
        this.feed.setLoading("deposit", true);
        this.feed.setLoading("deposit-" + quantity.token.symbol.toLowerCase(), true);
        return contract.excecute("transfer", {
            from: this.scatter.account.name,
            to: this.vapaeetokens,
            quantity: quantity.toString(),
            memo: "deposit"
        }).then((result) => __awaiter(this, void 0, void 0, function* () {
            this.feed.setLoading("deposit", false);
            this.feed.setLoading("deposit-" + quantity.token.symbol.toLowerCase(), false);
            /*await*/ this.getDeposits();
            /*await*/ this.getBalances();
            return result;
        })).catch(e => {
            this.feed.setLoading("deposit", false);
            this.feed.setLoading("deposit-" + quantity.token.symbol.toLowerCase(), false);
            this.feed.setError("deposit", typeof e == "string" ? e : JSON.stringify(e, null, 4));
            console.error(e);
            throw e;
        });
    }
    /**
     * @param {?} quantity
     * @return {?}
     */
    withdraw(quantity) {
        this.feed.setError("withdraw", null);
        this.feed.setLoading("withdraw", true);
        this.feed.setLoading("withdraw-" + quantity.token.symbol.toLowerCase(), true);
        return this.contract.excecute("withdraw", {
            owner: this.scatter.account.name,
            quantity: quantity.toString()
        }).then((result) => __awaiter(this, void 0, void 0, function* () {
            this.feed.setLoading("withdraw", false);
            this.feed.setLoading("withdraw-" + quantity.token.symbol.toLowerCase(), false);
            /*await*/ this.getDeposits();
            /*await*/ this.getBalances();
            return result;
        })).catch(e => {
            this.feed.setLoading("withdraw", false);
            this.feed.setLoading("withdraw-" + quantity.token.symbol.toLowerCase(), false);
            this.feed.setError("withdraw", typeof e == "string" ? e : JSON.stringify(e, null, 4));
            throw e;
        });
    }
    /**
     * @param {?} offchain
     * @return {?}
     */
    addOffChainToken(offchain) {
        this.waitTokensLoaded.then(_ => {
            this.tokens.push(new TokenDEX({
                symbol: offchain.symbol,
                precision: offchain.precision || 4,
                contract: "nocontract",
                appname: offchain.appname,
                website: "",
                logo: "",
                logolg: "",
                scope: "",
                stat: null,
                verified: false,
                offchain: true
            }));
        });
    }
    /**
     * @return {?}
     */
    hasScopes() {
        return !!this._markets;
    }
    /**
     * @param {?} scope
     * @return {?}
     */
    market(scope) {
        if (this._markets[scope])
            return this._markets[scope];
        /** @type {?} */
        var reverse = this.inverseScope(scope);
        if (this._reverse[reverse])
            return this._reverse[reverse]; // ---> reverse
        if (!this._markets[reverse])
            return null; // ---> table does not exist (or has not been loaded yet)
        return this._markets[scope] || this.reverse(scope);
    }
    /**
     * @param {?} scope
     * @return {?}
     */
    table(scope) {
        //console.error("table("+scope+") DEPRECATED");
        return this.market(scope);
    }
    /**
     * @param {?} scope
     * @return {?}
     */
    reverse(scope) {
        /** @type {?} */
        var canonical = this.canonicalScope(scope);
        /** @type {?} */
        var reverse_scope = this.inverseScope(canonical);
        console.assert(canonical != reverse_scope, "ERROR: ", canonical, reverse_scope);
        /** @type {?} */
        var reverse_table = this._reverse[reverse_scope];
        if (!reverse_table && this._markets[canonical]) {
            this._reverse[reverse_scope] = this.createReverseTableFor(reverse_scope);
        }
        return this._reverse[reverse_scope];
    }
    /**
     * @param {?} comodity
     * @param {?} currency
     * @return {?}
     */
    marketFor(comodity, currency) {
        /** @type {?} */
        var scope = this.getScopeFor(comodity, currency);
        return this.table(scope);
    }
    /**
     * @param {?} comodity
     * @param {?} currency
     * @return {?}
     */
    tableFor(comodity, currency) {
        console.error("tableFor()", comodity.symbol, currency.symbol, " DEPRECATED");
        return this.marketFor(comodity, currency);
    }
    /**
     * @param {?} scope
     * @return {?}
     */
    createReverseTableFor(scope) {
        /** @type {?} */
        var canonical = this.canonicalScope(scope);
        /** @type {?} */
        var reverse_scope = this.inverseScope(canonical);
        /** @type {?} */
        var table = this._markets[canonical];
        /** @type {?} */
        var inverse_history = [];
        for (var i in table.history) {
            /** @type {?} */
            var hTx = {
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
        /** @type {?} */
        var inverse_orders = {
            buy: [], sell: []
        };
        for (var type in { buy: "buy", sell: "sell" }) {
            /** @type {?} */
            var row_orders;
            /** @type {?} */
            var row_order;
            for (var i in table.orders[type]) {
                /** @type {?} */
                var row = table.orders[type][i];
                row_orders = [];
                for (var j = 0; j < row.orders.length; j++) {
                    row_order = {
                        deposit: row.orders[j].deposit.clone(),
                        id: row.orders[j].id,
                        inverse: row.orders[j].price.clone(),
                        price: row.orders[j].inverse.clone(),
                        owner: row.orders[j].owner,
                        telos: row.orders[j].total,
                        total: row.orders[j].telos
                    };
                    row_orders.push(row_order);
                }
                /** @type {?} */
                var newrow = {
                    inverse: row.price.clone(),
                    orders: row_orders,
                    owners: row.owners,
                    price: row.inverse.clone(),
                    str: row.inverse.str,
                    sum: row.sumtelos.clone(),
                    sumtelos: row.sum.clone(),
                    telos: row.total.clone(),
                    total: row.telos.clone(),
                };
                inverse_orders[type].push(newrow);
            }
        }
        /** @type {?} */
        var reverse = {
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
                    total: table.header.buy.total.clone(),
                    orders: table.header.buy.orders
                },
                buy: {
                    total: table.header.sell.total.clone(),
                    orders: table.header.sell.orders
                }
            },
            history: inverse_history,
            orders: {
                sell: inverse_orders.buy,
                // <<-- esto funciona así como está?
                buy: inverse_orders.sell // <<-- esto funciona así como está?
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
        };
        return reverse;
    }
    /**
     * @param {?} comodity
     * @param {?} currency
     * @return {?}
     */
    getScopeFor(comodity, currency) {
        if (!comodity || !currency)
            return "";
        return comodity.symbol.toLowerCase() + "." + currency.symbol.toLowerCase();
    }
    /**
     * @param {?} scope
     * @return {?}
     */
    inverseScope(scope) {
        if (!scope)
            return scope;
        console.assert(typeof scope == "string", "ERROR: string scope expected, got ", typeof scope, scope);
        /** @type {?} */
        var parts = scope.split(".");
        console.assert(parts.length == 2, "ERROR: scope format expected is xxx.yyy, got: ", typeof scope, scope);
        /** @type {?} */
        var inverse = parts[1] + "." + parts[0];
        return inverse;
    }
    /**
     * @param {?} scope
     * @return {?}
     */
    canonicalScope(scope) {
        if (!scope)
            return scope;
        console.assert(typeof scope == "string", "ERROR: string scope expected, got ", typeof scope, scope);
        /** @type {?} */
        var parts = scope.split(".");
        console.assert(parts.length == 2, "ERROR: scope format expected is xxx.yyy, got: ", typeof scope, scope);
        /** @type {?} */
        var inverse = parts[1] + "." + parts[0];
        if (parts[1] == "tlos") {
            return scope;
        }
        if (parts[0] == "tlos") {
            return inverse;
        }
        if (parts[0] < parts[1]) {
            return scope;
        }
        else {
            return inverse;
        }
    }
    /**
     * @param {?} scope
     * @return {?}
     */
    isCanonical(scope) {
        return this.canonicalScope(scope) == scope;
    }
    /**
     * @param {?} token
     * @return {?}
     */
    getBalance(token) {
        for (var i in this.balances) {
            if (this.balances[i].token.symbol == token.symbol) {
                return this.balances[i];
            }
        }
        return new AssetDEX("0 " + token.symbol, this);
    }
    /**
     * @param {?=} symbol
     * @return {?}
     */
    getSomeFreeFakeTokens(symbol = null) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("VapaeeDEX.getSomeFreeFakeTokens()");
            /** @type {?} */
            var _token = symbol;
            this.feed.setLoading("freefake-" + _token || "token", true);
            return this.waitTokenStats.then(_ => {
                /** @type {?} */
                var token = null;
                for (var i = 0; i < 100; i++) {
                    if (symbol) {
                        if (this.tokens[i].symbol == symbol) {
                            token = this.tokens[i];
                        }
                    }
                    /** @type {?} */
                    var random = Math.random();
                    // console.log(i, "Random: ", random);
                    if (!token && random > 0.5) {
                        token = this.tokens[i % this.tokens.length];
                        if (token.fake) {
                            random = Math.random();
                            if (random > 0.5) {
                                token = this.telos;
                            }
                        }
                        else {
                            token = null;
                        }
                    }
                    if (i < 100 && token && this.getBalance(token).amount.toNumber() > 0) {
                        token = null;
                    }
                    // console.log(i, "token: ", token);
                    if (token) {
                        random = Math.random();
                        /** @type {?} */
                        var monto = Math.floor(10000 * random) / 100;
                        /** @type {?} */
                        var quantity = new AssetDEX("" + monto + " " + token.symbol, this);
                        /** @type {?} */
                        var memo = "you get " + quantity.valueToString() + " free fake " + token.symbol + " tokens to play on vapaee.io DEX";
                        return this.contract.excecute("issue", {
                            to: this.scatter.account.name,
                            quantity: quantity.toString(),
                            memo: memo
                        }).then(_ => {
                            this.getBalances();
                            this.feed.setLoading("freefake-" + _token || "token", false);
                            return memo;
                        }).catch(e => {
                            this.feed.setLoading("freefake-" + _token || "token", false);
                            throw e;
                        });
                    }
                }
            });
        });
    }
    /**
     * @param {?} sym
     * @return {?}
     */
    getTokenNow(sym) {
        if (!sym)
            return null;
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
    /**
     * @param {?} sym
     * @return {?}
     */
    getToken(sym) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.waitTokensLoaded.then(_ => {
                return this.getTokenNow(sym);
            });
        });
    }
    /**
     * @param {?=} account
     * @return {?}
     */
    getDeposits(account = null) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("VapaeeDEX.getDeposits()");
            this.feed.setLoading("deposits", true);
            return this.waitTokensLoaded.then((_) => __awaiter(this, void 0, void 0, function* () {
                /** @type {?} */
                var deposits = [];
                if (!account && this.current.name) {
                    account = this.current.name;
                }
                if (account) {
                    /** @type {?} */
                    var result = yield this.fetchDeposits(account);
                    for (var i in result.rows) {
                        deposits.push(new AssetDEX(result.rows[i].amount, this));
                    }
                }
                this.deposits = deposits;
                this.feed.setLoading("deposits", false);
                return this.deposits;
            }));
        });
    }
    /**
     * @param {?=} account
     * @return {?}
     */
    getBalances(account = null) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("VapaeeDEX.getBalances()");
            this.feed.setLoading("balances", true);
            return this.waitTokensLoaded.then((_) => __awaiter(this, void 0, void 0, function* () {
                /** @type {?} */
                var _balances;
                if (!account && this.current.name) {
                    account = this.current.name;
                }
                if (account) {
                    _balances = yield this.fetchBalances(account);
                }
                this.balances = _balances;
                // console.log("VapaeeDEX balances updated");
                this.feed.setLoading("balances", false);
                return this.balances;
            }));
        });
    }
    /**
     * @param {?} table
     * @param {?} ids
     * @return {?}
     */
    getThisSellOrders(table, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            this.feed.setLoading("thisorders", true);
            return this.waitTokensLoaded.then((_) => __awaiter(this, void 0, void 0, function* () {
                /** @type {?} */
                var result = [];
                for (var i in ids) {
                    /** @type {?} */
                    var id = ids[i];
                    /** @type {?} */
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
                    /** @type {?} */
                    var res = yield this.fetchOrders({ scope: table, limit: 1, lower_bound: id.toString() });
                    result = result.concat(res.rows);
                }
                this.feed.setLoading("thisorders", false);
                return result;
            }));
        });
    }
    /**
     * @param {?=} account
     * @return {?}
     */
    getUserOrders(account = null) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("VapaeeDEX.getUserOrders()");
            this.feed.setLoading("userorders", true);
            return this.waitTokensLoaded.then((_) => __awaiter(this, void 0, void 0, function* () {
                /** @type {?} */
                var userorders;
                if (!account && this.current.name) {
                    account = this.current.name;
                }
                if (account) {
                    userorders = yield this.fetchUserOrders(account);
                }
                /** @type {?} */
                var list = /** @type {?} */ (userorders.rows);
                /** @type {?} */
                var map = {};
                for (var i = 0; i < list.length; i++) {
                    /** @type {?} */
                    var ids = list[i].ids;
                    /** @type {?} */
                    var table = list[i].table;
                    /** @type {?} */
                    var orders = yield this.getThisSellOrders(table, ids);
                    map[table] = {
                        table: table,
                        orders: this.auxProcessRowsToOrders(orders),
                        ids: ids
                    };
                }
                this.userorders = map;
                // console.log(this.userorders);
                this.feed.setLoading("userorders", false);
                return this.userorders;
            }));
        });
    }
    /**
     * @return {?}
     */
    updateActivity() {
        return __awaiter(this, void 0, void 0, function* () {
            this.feed.setLoading("activity", true);
            /** @type {?} */
            var pagesize = this.activityPagesize;
            /** @type {?} */
            var pages = yield this.getActivityTotalPages(pagesize);
            yield Promise.all([
                this.fetchActivity(pages - 2, pagesize),
                this.fetchActivity(pages - 1, pagesize),
                this.fetchActivity(pages - 0, pagesize)
            ]);
            this.feed.setLoading("activity", false);
        });
    }
    /**
     * @return {?}
     */
    loadMoreActivity() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.activity.list.length == 0)
                return;
            this.feed.setLoading("activity", true);
            /** @type {?} */
            var pagesize = this.activityPagesize;
            /** @type {?} */
            var first = this.activity.list[this.activity.list.length - 1];
            /** @type {?} */
            var id = first.id - pagesize;
            /** @type {?} */
            var page = Math.floor((id - 1) / pagesize);
            yield this.fetchActivity(page, pagesize);
            this.feed.setLoading("activity", false);
        });
    }
    /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} updateUser
     * @return {?}
     */
    updateTrade(comodity, currency, updateUser = true) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("VapaeeDEX.updateTrade()");
            /** @type {?} */
            var chrono_key = "updateTrade";
            this.feed.startChrono(chrono_key);
            if (updateUser)
                this.updateCurrentUser();
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
        });
    }
    /**
     * @return {?}
     */
    updateCurrentUser() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    /**
     * @param {?} scope
     * @param {?} pagesize
     * @return {?}
     */
    getBlockHistoryTotalPagesFor(scope, pagesize) {
        if (!this._markets)
            return 0;
        /** @type {?} */
        var market = this.market(scope);
        if (!market)
            return 0;
        /** @type {?} */
        var total = market.blocks;
        /** @type {?} */
        var mod = total % pagesize;
        /** @type {?} */
        var dif = total - mod;
        /** @type {?} */
        var pages = dif / pagesize;
        if (mod > 0) {
            pages += 1;
        }
        // console.log("getBlockHistoryTotalPagesFor() total:", total, " pages:", pages);
        return pages;
    }
    /**
     * @param {?} scope
     * @param {?} pagesize
     * @return {?}
     */
    getHistoryTotalPagesFor(scope, pagesize) {
        if (!this._markets)
            return 0;
        /** @type {?} */
        var market = this.market(scope);
        if (!market)
            return 0;
        /** @type {?} */
        var total = market.deals;
        /** @type {?} */
        var mod = total % pagesize;
        /** @type {?} */
        var dif = total - mod;
        /** @type {?} */
        var pages = dif / pagesize;
        if (mod > 0) {
            pages += 1;
        }
        return pages;
    }
    /**
     * @param {?} pagesize
     * @return {?}
     */
    getActivityTotalPages(pagesize) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.contract.getTable("events", {
                limit: 1
            }).then(result => {
                /** @type {?} */
                var params = result.rows[0].params;
                /** @type {?} */
                var total = parseInt(params.split(" ")[0]) - 1;
                /** @type {?} */
                var mod = total % pagesize;
                /** @type {?} */
                var dif = total - mod;
                /** @type {?} */
                var pages = dif / pagesize;
                if (mod > 0) {
                    pages += 1;
                }
                this.activity.total = total;
                console.log("VapaeeDEX.getActivityTotalPages() total: ", total, " pages: ", pages);
                return pages;
            });
        });
    }
    /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} page
     * @param {?=} pagesize
     * @param {?=} force
     * @return {?}
     */
    getTransactionHistory(comodity, currency, page = -1, pagesize = -1, force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            var scope = this.canonicalScope(this.getScopeFor(comodity, currency));
            /** @type {?} */
            var aux = null;
            /** @type {?} */
            var result = null;
            this.feed.setLoading("history." + scope, true);
            aux = this.waitOrderSummary.then((_) => __awaiter(this, void 0, void 0, function* () {
                if (pagesize == -1) {
                    pagesize = 10;
                }
                if (page == -1) {
                    /** @type {?} */
                    var pages = this.getHistoryTotalPagesFor(scope, pagesize);
                    page = pages - 3;
                    if (page < 0)
                        page = 0;
                }
                return Promise.all([
                    this.fetchHistory(scope, page + 0, pagesize),
                    this.fetchHistory(scope, page + 1, pagesize),
                    this.fetchHistory(scope, page + 2, pagesize)
                ]).then(_ => {
                    this.feed.setLoading("history." + scope, false);
                    return this.market(scope).history;
                }).catch(e => {
                    this.feed.setLoading("history." + scope, false);
                    throw e;
                });
            }));
            if (this.market(scope) && !force) {
                result = this.market(scope).history;
            }
            else {
                result = aux;
            }
            this.onHistoryChange.next(result);
            return result;
        });
    }
    /**
     * @param {?} hour
     * @return {?}
     */
    auxHourToLabel(hour) {
        /** @type {?} */
        var d = new Date(hour * 1000 * 60 * 60);
        /** @type {?} */
        var label = d.getHours() == 0 ? this.datePipe.transform(d, 'dd/MM') : d.getHours() + "h";
        return label;
    }
    /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} page
     * @param {?=} pagesize
     * @param {?=} force
     * @return {?}
     */
    getBlockHistory(comodity, currency, page = -1, pagesize = -1, force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("VapaeeDEX.getBlockHistory()", comodity.symbol, page, pagesize);
            /** @type {?} */
            var scope = this.canonicalScope(this.getScopeFor(comodity, currency));
            /** @type {?} */
            var aux = null;
            /** @type {?} */
            var result = null;
            this.feed.setLoading("block-history." + scope, true);
            aux = this.waitOrderSummary.then((_) => __awaiter(this, void 0, void 0, function* () {
                if (pagesize == -1) {
                    pagesize = 10;
                }
                if (page == -1) {
                    /** @type {?} */
                    var pages = this.getBlockHistoryTotalPagesFor(scope, pagesize);
                    page = pages - 3;
                    if (page < 0)
                        page = 0;
                }
                /** @type {?} */
                var promises = [];
                for (var i = 0; i <= pages; i++) {
                    /** @type {?} */
                    var promise = this.fetchBlockHistory(scope, i, pagesize);
                    promises.push(promise);
                }
                return Promise.all(promises).then(_ => {
                    // // elapsed time
                    // var fetchBlockHistoryTime:Date = new Date();
                    // diff = fetchBlockHistoryTime.getTime() - fetchBlockHistoryStart.getTime();
                    // sec = diff / 1000;
                    // console.log("** VapaeeDEX.getBlockHistory() fetchBlockHistoryTime sec: ", sec, "(",diff,")");
                    this.feed.setLoading("block-history." + scope, false);
                    /** @type {?} */
                    var market = this.market(scope);
                    market.blocklist = [];
                    market.reverseblocks = [];
                    /** @type {?} */
                    var now = new Date();
                    /** @type {?} */
                    var hora = 1000 * 60 * 60;
                    /** @type {?} */
                    var hour = Math.floor(now.getTime() / hora);
                    /** @type {?} */
                    var last_block = null;
                    /** @type {?} */
                    var ordered_blocks = [];
                    for (var i in market.block) {
                        ordered_blocks.push(market.block[i]);
                    }
                    ordered_blocks.sort(function (a, b) {
                        if (a.hour < b.hour)
                            return -11;
                        return 1;
                    });
                    for (var i in ordered_blocks) {
                        /** @type {?} */
                        var block = ordered_blocks[i];
                        /** @type {?} */
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
                            /** @type {?} */
                            var dif = block.hour - last_block.hour;
                            for (var j = 1; j < dif; j++) {
                                /** @type {?} */
                                var label_i = this.auxHourToLabel(last_block.hour + j);
                                /** @type {?} */
                                var price = last_block.price.amount.toNumber();
                                /** @type {?} */
                                var aux = [label_i, price, price, price, price];
                                market.blocklist.push(aux);
                                /** @type {?} */
                                var inverse = last_block.inverse.amount.toNumber();
                                /** @type {?} */
                                var aux = [label_i, inverse, inverse, inverse, inverse];
                                market.reverseblocks.push(aux);
                            }
                        }
                        /** @type {?} */
                        var obj;
                        // coninical ----------------------------
                        obj = [label];
                        obj.push(block.max.amount.toNumber());
                        obj.push(block.entrance.amount.toNumber());
                        obj.push(block.price.amount.toNumber());
                        obj.push(block.min.amount.toNumber());
                        market.blocklist.push(obj);
                        // reverse ----------------------------
                        obj = [label];
                        obj.push(1.0 / block.max.amount.toNumber());
                        obj.push(1.0 / block.entrance.amount.toNumber());
                        obj.push(1.0 / block.price.amount.toNumber());
                        obj.push(1.0 / block.min.amount.toNumber());
                        market.reverseblocks.push(obj);
                        last_block = block;
                    }
                    if (last_block && hour != last_block.hour) {
                        /** @type {?} */
                        var dif = hour - last_block.hour;
                        for (var j = 1; j <= dif; j++) {
                            /** @type {?} */
                            var label_i = this.auxHourToLabel(last_block.hour + j);
                            /** @type {?} */
                            var price = last_block.price.amount.toNumber();
                            /** @type {?} */
                            var aux = [label_i, price, price, price, price];
                            market.blocklist.push(aux);
                            /** @type {?} */
                            var inverse = last_block.inverse.amount.toNumber();
                            /** @type {?} */
                            var aux = [label_i, inverse, inverse, inverse, inverse];
                            market.reverseblocks.push(aux);
                        }
                    }
                    // // elapsed time
                    // var firstLevelTime:Date = new Date();
                    // diff = firstLevelTime.getTime() - fetchBlockHistoryTime.getTime();
                    // sec = diff / 1000;
                    // console.log("** VapaeeDEX.getBlockHistory() firstLevelTime sec: ", sec, "(",diff,")");
                    // console.log("---------------->", market.blocklist);
                    // this.onBlocklistChange.next(market.blocklist);
                    return market;
                }).then(market => {
                    /** @type {?} */
                    var limit = 256;
                    /** @type {?} */
                    var levels = [market.blocklist];
                    /** @type {?} */
                    var reverses = [market.reverseblocks];
                    for (var current = 0; levels[current].length > limit; current++) {
                        /** @type {?} */
                        var newlevel = [];
                        /** @type {?} */
                        var newreverse = [];
                        /** @type {?} */
                        var merged = [];
                        for (var i = 0; i < levels[current].length; i += 2) {
                            /** @type {?} */
                            var v_1 = levels[current][i];
                            /** @type {?} */
                            var v_2 = levels[current][i + 1];
                            /** @type {?} */
                            var merged = [];
                            for (var x = 0; x < 5; x++)
                                merged[x] = v_1[x]; // clean copy
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
                            v_2 = reverses[current][i + 1];
                            merged = [];
                            for (var x = 0; x < 5; x++)
                                merged[x] = v_1[x]; // clean copy
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
                    // var allLevelsTime:Date = new Date();
                    // diff = allLevelsTime.getTime() - allLevelsStart.getTime();
                    // sec = diff / 1000;
                    // console.log("** VapaeeDEX.getBlockHistory() allLevelsTime sec: ", sec, "(",diff,")");
                    // // console.log("***************************************************************************", market.blocklevels);
                    return market.block;
                }).catch(e => {
                    this.feed.setLoading("block-history." + scope, false);
                    throw e;
                });
            }));
            if (this.market(scope) && !force) {
                result = this.market(scope).block;
            }
            else {
                result = aux;
            }
            this.onHistoryChange.next(result);
            return result;
        });
    }
    /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} force
     * @return {?}
     */
    getSellOrders(comodity, currency, force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            var scope = this.getScopeFor(comodity, currency);
            /** @type {?} */
            var canonical = this.canonicalScope(scope);
            /** @type {?} */
            var reverse = this.inverseScope(canonical);
            /** @type {?} */
            var aux = null;
            /** @type {?} */
            var result = null;
            this.feed.setLoading("sellorders", true);
            aux = this.waitTokensLoaded.then((_) => __awaiter(this, void 0, void 0, function* () {
                /** @type {?} */
                var orders = yield this.fetchOrders({ scope: canonical, limit: 100, index_position: "2", key_type: "i64" });
                this._markets[canonical] = this.auxAssertScope(canonical);
                /** @type {?} */
                var sell = this.auxProcessRowsToOrders(orders.rows);
                sell.sort(function (a, b) {
                    if (a.price.amount.isLessThan(b.price.amount))
                        return -11;
                    if (a.price.amount.isGreaterThan(b.price.amount))
                        return 1;
                    return 0;
                });
                /** @type {?} */
                var list = [];
                /** @type {?} */
                var row;
                if (sell.length > 0) {
                    for (var i = 0; i < sell.length; i++) {
                        /** @type {?} */
                        var order = sell[i];
                        if (list.length > 0) {
                            row = list[list.length - 1];
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
                        };
                        row.owners[order.owner] = true;
                        row.orders.push(order);
                        list.push(row);
                    }
                }
                /** @type {?} */
                var sum = new BigNumber(0);
                /** @type {?} */
                var sumtelos = new BigNumber(0);
                for (var j in list) {
                    /** @type {?} */
                    var order_row = list[j];
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
            }));
            if (this._markets[canonical] && !force) {
                result = this._markets[canonical].orders.sell;
            }
            else {
                result = aux;
            }
            return result;
        });
    }
    /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} force
     * @return {?}
     */
    getBuyOrders(comodity, currency, force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            var scope = this.getScopeFor(comodity, currency);
            /** @type {?} */
            var canonical = this.canonicalScope(scope);
            /** @type {?} */
            var reverse = this.inverseScope(canonical);
            /** @type {?} */
            var aux = null;
            /** @type {?} */
            var result = null;
            this.feed.setLoading("buyorders", true);
            aux = this.waitTokensLoaded.then((_) => __awaiter(this, void 0, void 0, function* () {
                /** @type {?} */
                var orders = yield yield this.fetchOrders({ scope: reverse, limit: 50, index_position: "2", key_type: "i64" });
                this._markets[canonical] = this.auxAssertScope(canonical);
                /** @type {?} */
                var buy = this.auxProcessRowsToOrders(orders.rows);
                buy.sort(function (a, b) {
                    if (a.price.amount.isLessThan(b.price.amount))
                        return 1;
                    if (a.price.amount.isGreaterThan(b.price.amount))
                        return -1;
                    return 0;
                });
                /** @type {?} */
                var list = [];
                /** @type {?} */
                var row;
                if (buy.length > 0) {
                    for (var i = 0; i < buy.length; i++) {
                        /** @type {?} */
                        var order = buy[i];
                        if (list.length > 0) {
                            row = list[list.length - 1];
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
                        };
                        row.owners[order.owner] = true;
                        row.orders.push(order);
                        list.push(row);
                    }
                }
                /** @type {?} */
                var sum = new BigNumber(0);
                /** @type {?} */
                var sumtelos = new BigNumber(0);
                for (var j in list) {
                    /** @type {?} */
                    var order_row = list[j];
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
            }));
            if (this._markets[canonical] && !force) {
                result = this._markets[canonical].orders.buy;
            }
            else {
                result = aux;
            }
            return result;
        });
    }
    /**
     * @return {?}
     */
    getOrderSummary() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("VapaeeDEX.getOrderSummary()");
            /** @type {?} */
            var tables = yield this.fetchOrderSummary();
            for (var i in tables.rows) {
                /** @type {?} */
                var scope = tables.rows[i].table;
                /** @type {?} */
                var canonical = this.canonicalScope(scope);
                console.assert(scope == canonical, "ERROR: scope is not canonical", scope, [i, tables]);
                /** @type {?} */
                var comodity = scope.split(".")[0].toUpperCase();
                /** @type {?} */
                var currency = scope.split(".")[1].toUpperCase();
                this._markets[scope] = this.auxAssertScope(scope);
                // console.log(i, tables.rows[i]);
                this._markets[scope].header.sell.total = new AssetDEX(tables.rows[i].supply.total, this);
                this._markets[scope].header.sell.orders = tables.rows[i].supply.orders;
                this._markets[scope].header.buy.total = new AssetDEX(tables.rows[i].demand.total, this);
                this._markets[scope].header.buy.orders = tables.rows[i].demand.orders;
                this._markets[scope].deals = tables.rows[i].deals;
                this._markets[scope].blocks = tables.rows[i].blocks;
            }
            this.setOrderSummary();
        });
    }
    /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} force
     * @return {?}
     */
    getTableSummary(comodity, currency, force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            var scope = this.getScopeFor(comodity, currency);
            /** @type {?} */
            var canonical = this.canonicalScope(scope);
            /** @type {?} */
            var inverse = this.inverseScope(canonical);
            /** @type {?} */
            var ZERO_COMODITY = "0.00000000 " + comodity.symbol;
            /** @type {?} */
            var ZERO_CURRENCY = "0.00000000 " + currency.symbol;
            this.feed.setLoading("summary." + canonical, true);
            this.feed.setLoading("summary." + inverse, true);
            /** @type {?} */
            var aux = null;
            /** @type {?} */
            var result = null;
            aux = this.waitTokensLoaded.then((_) => __awaiter(this, void 0, void 0, function* () {
                /** @type {?} */
                var summary = yield this.fetchSummary(canonical);
                // if(scope=="olive.tlos")console.log(scope, "---------------------------------------------------");
                // if(scope=="olive.tlos")console.log("Summary crudo:", summary.rows);
                this._markets[canonical] = this.auxAssertScope(canonical);
                this._markets[canonical].summary = {
                    scope: canonical,
                    price: new AssetDEX(new BigNumber(0), currency),
                    price_24h_ago: new AssetDEX(new BigNumber(0), currency),
                    inverse: new AssetDEX(new BigNumber(0), comodity),
                    inverse_24h_ago: new AssetDEX(new BigNumber(0), comodity),
                    volume: new AssetDEX(new BigNumber(0), currency),
                    amount: new AssetDEX(new BigNumber(0), comodity),
                    percent: 0.3,
                    records: summary.rows
                };
                /** @type {?} */
                var now = new Date();
                /** @type {?} */
                var now_sec = Math.floor(now.getTime() / 1000);
                /** @type {?} */
                var now_hour = Math.floor(now_sec / 3600);
                /** @type {?} */
                var start_hour = now_hour - 23;
                /** @type {?} */
                var price = ZERO_CURRENCY;
                /** @type {?} */
                var inverse = ZERO_COMODITY;
                /** @type {?} */
                var crude = {};
                /** @type {?} */
                var last_hh = 0;
                for (var i = 0; i < summary.rows.length; i++) {
                    /** @type {?} */
                    var hh = summary.rows[i].hour;
                    if (summary.rows[i].label == "lastone") ;
                    else {
                        crude[hh] = summary.rows[i];
                        if (last_hh < hh && hh < start_hour) {
                            last_hh = hh;
                            price = (scope == canonical) ? summary.rows[i].price : summary.rows[i].inverse;
                            inverse = (scope == canonical) ? summary.rows[i].inverse : summary.rows[i].price;
                            // if(canonical=="acorn.tlos")console.log("hh:", hh, "last_hh:", last_hh, "price:", price);
                        }
                    }
                    /*
                                    */
                }
                /** @type {?} */
                var last_24h = {};
                /** @type {?} */
                var volume = new AssetDEX(ZERO_CURRENCY, this);
                /** @type {?} */
                var amount = new AssetDEX(ZERO_COMODITY, this);
                /** @type {?} */
                var price_asset = new AssetDEX(price, this);
                /** @type {?} */
                var inverse_asset = new AssetDEX(inverse, this);
                /** @type {?} */
                var max_price = price_asset.clone();
                /** @type {?} */
                var min_price = price_asset.clone();
                /** @type {?} */
                var max_inverse = inverse_asset.clone();
                /** @type {?} */
                var min_inverse = inverse_asset.clone();
                /** @type {?} */
                var price_fst = null;
                /** @type {?} */
                var inverse_fst = null;
                for (var i = 0; i < 24; i++) {
                    /** @type {?} */
                    var current = start_hour + i;
                    /** @type {?} */
                    var current_date = new Date(current * 3600 * 1000);
                    /** @type {?} */
                    var nuevo = crude[current];
                    if (nuevo) {
                        /** @type {?} */
                        var s_price = (scope == canonical) ? nuevo.price : nuevo.inverse;
                        /** @type {?} */
                        var s_inverse = (scope == canonical) ? nuevo.inverse : nuevo.price;
                        /** @type {?} */
                        var s_volume = (scope == canonical) ? nuevo.volume : nuevo.amount;
                        /** @type {?} */
                        var s_amount = (scope == canonical) ? nuevo.amount : nuevo.volume;
                        nuevo.price = s_price;
                        nuevo.inverse = s_inverse;
                        nuevo.volume = s_volume;
                        nuevo.amount = s_amount;
                    }
                    else {
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
                    // if(canonical=="acorn.tlos")console.log("current_date:", current_date.toISOString(), current, last_24h[current]);
                    // coninical ----------------------------
                    price = last_24h[current].price;
                    /** @type {?} */
                    var vol = new AssetDEX(last_24h[current].volume, this);
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
                    /** @type {?} */
                    var amo = new AssetDEX(last_24h[current].amount, this);
                    console.assert(amo.token.symbol == amount.token.symbol, "ERROR: different tokens", amo.str, amount.str);
                    amount.amount = amount.amount.plus(amo.amount);
                    if (inverse != ZERO_COMODITY && !inverse_fst) {
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
                /** @type {?} */
                var last_price = new AssetDEX(last_24h[now_hour].price, this);
                /** @type {?} */
                var diff = last_price.clone();
                // diff.amount
                diff.amount = last_price.amount.minus(price_fst.amount);
                /** @type {?} */
                var ratio = 0;
                if (price_fst.amount.toNumber() != 0) {
                    ratio = diff.amount.dividedBy(price_fst.amount).toNumber();
                }
                /** @type {?} */
                var percent = Math.floor(ratio * 10000) / 100;
                // reverse ----------------------------
                if (!inverse_fst) {
                    inverse_fst = new AssetDEX(last_24h[start_hour].inverse, this);
                }
                /** @type {?} */
                var last_inverse = new AssetDEX(last_24h[now_hour].inverse, this);
                /** @type {?} */
                var idiff = last_inverse.clone();
                // diff.amount
                idiff.amount = last_inverse.amount.minus(inverse_fst.amount);
                ratio = 0;
                if (inverse_fst.amount.toNumber() != 0) {
                    ratio = diff.amount.dividedBy(inverse_fst.amount).toNumber();
                }
                /** @type {?} */
                var ipercent = Math.floor(ratio * 10000) / 100;
                // if(canonical=="acorn.tlos")console.log("price_fst:", price_fst.str);
                // if(canonical=="acorn.tlos")console.log("inverse_fst:", inverse_fst.str);
                // if(canonical=="acorn.tlos")console.log("last_24h:", [last_24h]);
                // if(canonical=="acorn.tlos")console.log("diff:", diff.toString(8));
                // if(canonical=="acorn.tlos")console.log("percent:", percent);
                // if(canonical=="acorn.tlos")console.log("ratio:", ratio);
                // if(canonical=="acorn.tlos")console.log("volume:", volume.str);
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
                // if(canonical=="acorn.tlos")console.log("Summary final:", this._markets[canonical].summary);
                // if(canonical=="acorn.tlos")console.log("---------------------------------------------------");
                this.feed.setLoading("summary." + canonical, false);
                this.feed.setLoading("summary." + inverse, false);
                return this._markets[canonical].summary;
            }));
            if (this._markets[canonical] && !force) {
                result = this._markets[canonical].summary;
            }
            else {
                result = yield aux;
            }
            this.setMarketSummary();
            this.onMarketSummary.next(result);
            return result;
        });
    }
    /**
     * @return {?}
     */
    getAllTablesSumaries() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.waitOrderSummary.then((_) => __awaiter(this, void 0, void 0, function* () {
                /** @type {?} */
                var promises = [];
                for (var i in this._markets) {
                    if (i.indexOf(".") == -1)
                        continue;
                    /** @type {?} */
                    var p = this.getTableSummary(this._markets[i].comodity, this._markets[i].currency, true);
                    promises.push(p);
                }
                return Promise.all(promises).then(_ => {
                    this.updateTokensSummary();
                });
            }));
        });
    }
    /**
     * @param {?} rows
     * @return {?}
     */
    auxProcessRowsToOrders(rows) {
        /** @type {?} */
        var result = [];
        for (var i = 0; i < rows.length; i++) {
            /** @type {?} */
            var price = new AssetDEX(rows[i].price, this);
            /** @type {?} */
            var inverse = new AssetDEX(rows[i].inverse, this);
            /** @type {?} */
            var selling = new AssetDEX(rows[i].selling, this);
            /** @type {?} */
            var total = new AssetDEX(rows[i].total, this);
            /** @type {?} */
            var order;
            /** @type {?} */
            var scope = this.getScopeFor(price.token, inverse.token);
            /** @type {?} */
            var canonical = this.canonicalScope(scope);
            /** @type {?} */
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
                };
            }
            else {
                order = {
                    id: rows[i].id,
                    price: inverse,
                    inverse: price,
                    total: total,
                    deposit: selling,
                    telos: selling,
                    owner: rows[i].owner
                };
            }
            result.push(order);
        }
        return result;
    }
    /**
     * @param {?} hh
     * @return {?}
     */
    auxGetLabelForHour(hh) {
        /** @type {?} */
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
        ];
        return hours[hh];
    }
    /**
     * @param {?} scope
     * @return {?}
     */
    auxAssertScope(scope) {
        /** @type {?} */
        var comodity_sym = scope.split(".")[0].toUpperCase();
        /** @type {?} */
        var currency_sym = scope.split(".")[1].toUpperCase();
        /** @type {?} */
        var comodity = this.getTokenNow(comodity_sym);
        /** @type {?} */
        var currency = this.getTokenNow(currency_sym);
        /** @type {?} */
        var aux_asset_com = new AssetDEX(0, comodity);
        /** @type {?} */
        var aux_asset_cur = new AssetDEX(0, currency);
        /** @type {?} */
        var market_summary = {
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
        };
        return this._markets[scope] || {
            scope: scope,
            comodity: comodity,
            currency: currency,
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
            summary: market_summary,
            header: {
                sell: { total: aux_asset_com, orders: 0 },
                buy: { total: aux_asset_cur, orders: 0 }
            },
        };
    }
    /**
     * @param {?} account
     * @return {?}
     */
    fetchDeposits(account) {
        return this.contract.getTable("deposits", { scope: account }).then(result => {
            return result;
        });
    }
    /**
     * @param {?} account
     * @return {?}
     */
    fetchBalances(account) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.waitTokensLoaded.then((_) => __awaiter(this, void 0, void 0, function* () {
                /** @type {?} */
                var contracts = {};
                /** @type {?} */
                var balances = [];
                for (var i in this.tokens) {
                    if (this.tokens[i].offchain)
                        continue;
                    contracts[this.tokens[i].contract] = true;
                }
                for (var contract in contracts) {
                    this.feed.setLoading("balances-" + contract, true);
                }
                for (var contract in contracts) {
                    /** @type {?} */
                    var result = yield this.contract.getTable("accounts", {
                        contract: contract,
                        scope: account || this.current.name
                    });
                    for (var i in result.rows) {
                        balances.push(new AssetDEX(result.rows[i].balance, this));
                    }
                    this.feed.setLoading("balances-" + contract, false);
                }
                return balances;
            }));
        });
    }
    /**
     * @param {?} params
     * @return {?}
     */
    fetchOrders(params) {
        return this.contract.getTable("sellorders", params).then(result => {
            return result;
        });
    }
    /**
     * @return {?}
     */
    fetchOrderSummary() {
        return this.contract.getTable("ordersummary").then(result => {
            return result;
        });
    }
    /**
     * @param {?} scope
     * @param {?=} page
     * @param {?=} pagesize
     * @return {?}
     */
    fetchBlockHistory(scope, page = 0, pagesize = 25) {
        /** @type {?} */
        var canonical = this.canonicalScope(scope);
        /** @type {?} */
        var pages = this.getBlockHistoryTotalPagesFor(canonical, pagesize);
        /** @type {?} */
        var id = page * pagesize;
        // console.log("VapaeeDEX.fetchBlockHistory(", scope, ",",page,",",pagesize,"): id:", id, "pages:", pages);
        if (page < pages) {
            if (this._markets && this._markets[canonical] && this._markets[canonical].block["id-" + id]) {
                /** @type {?} */
                var result = { more: false, rows: [] };
                for (var i = 0; i < pagesize; i++) {
                    /** @type {?} */
                    var id_i = id + i;
                    /** @type {?} */
                    var block = this._markets[canonical].block["id-" + id_i];
                    if (block) {
                        result.rows.push(block);
                    }
                    else {
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
        return this.contract.getTable("blockhistory", { scope: canonical, limit: pagesize, lower_bound: "" + (page * pagesize) }).then(result => {
            // console.log("**************");
            // console.log("block History crudo:", result);
            this._markets[canonical] = this.auxAssertScope(canonical);
            this._markets[canonical].block = this._markets[canonical].block || {};
            // console.log("this._markets[scope].block:", this._markets[scope].block);
            for (var i = 0; i < result.rows.length; i++) {
                /** @type {?} */
                var block = {
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
                };
                block.str = JSON.stringify([block.max.str, block.entrance.str, block.price.str, block.min.str]);
                this._markets[canonical].block["id-" + block.id] = block;
            }
            // console.log("block History final:", this._markets[scope].block);
            // console.log("-------------");
            return result;
        });
    }
    /**
     * @param {?} scope
     * @param {?=} page
     * @param {?=} pagesize
     * @return {?}
     */
    fetchHistory(scope, page = 0, pagesize = 25) {
        /** @type {?} */
        var canonical = this.canonicalScope(scope);
        /** @type {?} */
        var pages = this.getHistoryTotalPagesFor(canonical, pagesize);
        /** @type {?} */
        var id = page * pagesize;
        // console.log("VapaeeDEX.fetchHistory(", scope, ",",page,",",pagesize,"): id:", id, "pages:", pages);
        if (page < pages) {
            if (this._markets && this._markets[canonical] && this._markets[canonical].tx["id-" + id]) {
                /** @type {?} */
                var result = { more: false, rows: [] };
                for (var i = 0; i < pagesize; i++) {
                    /** @type {?} */
                    var id_i = id + i;
                    /** @type {?} */
                    var trx = this._markets[canonical].tx["id-" + id_i];
                    if (trx) {
                        result.rows.push(trx);
                    }
                    else {
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
        return this.contract.getTable("history", { scope: scope, limit: pagesize, lower_bound: "" + (page * pagesize) }).then(result => {
            // console.log("**************");
            // console.log("History crudo:", result);
            this._markets[canonical] = this.auxAssertScope(canonical);
            this._markets[canonical].history = [];
            this._markets[canonical].tx = this._markets[canonical].tx || {};
            // console.log("this.scopes[scope].tx:", this.scopes[scope].tx);
            for (var i = 0; i < result.rows.length; i++) {
                /** @type {?} */
                var transaction = {
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
                };
                transaction.str = transaction.price.str + " " + transaction.amount.str;
                this._markets[canonical].tx["id-" + transaction.id] = transaction;
            }
            for (var j in this._markets[canonical].tx) {
                this._markets[canonical].history.push(this._markets[canonical].tx[j]);
            }
            this._markets[canonical].history.sort(function (a, b) {
                if (a.date < b.date)
                    return 1;
                if (a.date > b.date)
                    return -1;
                if (a.id < b.id)
                    return 1;
                if (a.id > b.id)
                    return -1;
            });
            // console.log("History final:", this.scopes[scope].history);
            // console.log("-------------");
            return result;
        });
    }
    /**
     * @param {?=} page
     * @param {?=} pagesize
     * @return {?}
     */
    fetchActivity(page = 0, pagesize = 25) {
        return __awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            var id = page * pagesize + 1;
            // console.log("VapaeeDEX.fetchActivity(", page,",",pagesize,"): id:", id);
            if (this.activity.events["id-" + id]) {
                /** @type {?} */
                var pageEvents = [];
                for (var i = 0; i < pagesize; i++) {
                    /** @type {?} */
                    var id_i = id + i;
                    /** @type {?} */
                    var event = this.activity.events["id-" + id_i];
                    if (!event) {
                        break;
                    }
                }
                if (pageEvents.length == pagesize) {
                    return;
                }
            }
            return this.contract.getTable("events", { limit: pagesize, lower_bound: "" + id }).then(result => {
                /** @type {?} */
                var list = [];
                for (var i = 0; i < result.rows.length; i++) {
                    /** @type {?} */
                    var id = result.rows[i].id;
                    /** @type {?} */
                    var event = /** @type {?} */ (result.rows[i]);
                    if (!this.activity.events["id-" + id]) {
                        this.activity.events["id-" + id] = event;
                        list.push(event);
                        // console.log("**************>>>>>", id);
                    }
                }
                this.activity.list = [].concat(this.activity.list).concat(list);
                this.activity.list.sort(function (a, b) {
                    if (a.date < b.date)
                        return 1;
                    if (a.date > b.date)
                        return -1;
                    if (a.id < b.id)
                        return 1;
                    if (a.id > b.id)
                        return -1;
                });
            });
        });
    }
    /**
     * @param {?} user
     * @return {?}
     */
    fetchUserOrders(user) {
        return this.contract.getTable("userorders", { scope: user, limit: 200 }).then(result => {
            return result;
        });
    }
    /**
     * @param {?} scope
     * @return {?}
     */
    fetchSummary(scope) {
        return this.contract.getTable("tablesummary", { scope: scope }).then(result => {
            return result;
        });
    }
    /**
     * @param {?} token
     * @return {?}
     */
    fetchTokenStats(token) {
        this.feed.setLoading("token-stat-" + token.symbol, true);
        return this.contract.getTable("stat", { contract: token.contract, scope: token.symbol }).then(result => {
            token.stat = result.rows[0];
            if (token.stat.issuers && token.stat.issuers[0] == "everyone") {
                token.fake = true;
            }
            this.feed.setLoading("token-stat-" + token.symbol, false);
            return token;
        });
    }
    /**
     * @param {?=} extended
     * @return {?}
     */
    fetchTokensStats(extended = true) {
        console.log("Vapaee.fetchTokens()");
        this.feed.setLoading("token-stats", true);
        return this.waitTokensLoaded.then(_ => {
            /** @type {?} */
            var priomises = [];
            for (var i in this.tokens) {
                if (this.tokens[i].offchain)
                    continue;
                priomises.push(this.fetchTokenStats(this.tokens[i]));
            }
            return Promise.all(priomises).then(result => {
                this.setTokenStats(this.tokens);
                this.feed.setLoading("token-stats", false);
                return this.tokens;
            });
        });
    }
    /**
     * @param {?=} times
     * @return {?}
     */
    updateTokensSummary(times = 20) {
        if (times > 1) {
            for (var i = times; i > 0; i--)
                this.updateTokensSummary(1);
            return;
        }
        return Promise.all([
            this.waitTokensLoaded,
            this.waitMarketSummary
        ]).then(_ => {
            /** @type {?} */
            var amount_map = {};
            // a cada token le asigno un price que sale de verificar su price en el mercado principal XXX/TLOS
            for (var i in this.tokens) {
                if (this.tokens[i].offchain)
                    continue;
                /** @type {?} */
                var token = this.tokens[i];
                /** @type {?} */
                var quantity = new AssetDEX(0, token);
                for (var j in this._markets) {
                    if (j.indexOf(".") == -1)
                        continue;
                    /** @type {?} */
                    var table = this._markets[j];
                    if (table.comodity.symbol == token.symbol) {
                        quantity = quantity.plus(table.summary.amount);
                    }
                    if (table.currency.symbol == token.symbol) {
                        quantity = quantity.plus(table.summary.volume);
                    }
                    if (table.comodity.symbol == token.symbol && table.currency.symbol == this.telos.symbol) {
                        if (token.summary && token.summary.price.amount.toNumber() == 0) {
                            delete token.summary;
                        }
                        token.summary = token.summary || {
                            price: table.summary.price.clone(),
                            price_24h_ago: table.summary.price_24h_ago.clone(),
                            volume: table.summary.volume.clone(),
                            percent: table.summary.percent,
                            percent_str: table.summary.percent_str,
                        };
                    }
                }
                amount_map[token.symbol] = quantity;
            }
            this.telos.summary = {
                price: new AssetDEX(1, this.telos),
                price_24h_ago: new AssetDEX(1, this.telos),
                volume: new AssetDEX(-1, this.telos),
                percent: 0,
                percent_str: "0%"
            };
            /** @type {?} */
            var ONE = new BigNumber(1);
            for (var i in this.tokens) {
                /** @type {?} */
                var token = this.tokens[i];
                if (token.offchain)
                    continue;
                if (!token.summary)
                    continue;
                if (token.symbol == this.telos.symbol)
                    continue;
                /** @type {?} */
                var volume = new AssetDEX(0, this.telos);
                /** @type {?} */
                var price = new AssetDEX(0, this.telos);
                /** @type {?} */
                var price_init = new AssetDEX(0, this.telos);
                /** @type {?} */
                var total_quantity = amount_map[token.symbol];
                if (total_quantity.toNumber() == 0)
                    continue;
                // if (token.symbol == "ACORN") console.log("TOKEN: -------- ", token.symbol, token.summary.price.str, token.summary.price_24h_ago.str );
                for (var j in this._markets) {
                    if (j.indexOf(".") == -1)
                        continue;
                    /** @type {?} */
                    var table = this._markets[j];
                    /** @type {?} */
                    var currency_price = table.currency.symbol == "TLOS" ? ONE : table.currency.summary.price.amount;
                    /** @type {?} */
                    var currency_price_24h_ago = table.currency.symbol == "TLOS" ? ONE : table.currency.summary.price_24h_ago.amount;
                    if (table.comodity.symbol == token.symbol || table.currency.symbol == token.symbol) {
                        /** @type {?} */
                        var quantity = new AssetDEX();
                        if (table.comodity.symbol == token.symbol) {
                            quantity = table.summary.amount.clone();
                        }
                        else if (table.currency.symbol == token.symbol) {
                            quantity = table.summary.volume.clone();
                        }
                        /** @type {?} */
                        var weight = quantity.amount.dividedBy(total_quantity.amount);
                        /** @type {?} */
                        var price_amount;
                        if (table.comodity.symbol == token.symbol) {
                            price_amount = table.summary.price.amount.multipliedBy(table.currency.summary.price.amount);
                        }
                        else if (table.currency.symbol == token.symbol) {
                            price_amount = table.summary.inverse.amount.multipliedBy(table.comodity.summary.price.amount);
                        }
                        /** @type {?} */
                        var price_i = new AssetDEX(price_amount.multipliedBy(weight), this.telos);
                        /** @type {?} */
                        var price_init_amount;
                        if (table.comodity.symbol == token.symbol) {
                            price_init_amount = table.summary.price_24h_ago.amount.multipliedBy(table.currency.summary.price_24h_ago.amount);
                        }
                        else if (table.currency.symbol == token.symbol) {
                            price_init_amount = table.summary.inverse_24h_ago.amount.multipliedBy(table.comodity.summary.price_24h_ago.amount);
                        }
                        /** @type {?} */
                        var price_init_i = new AssetDEX(price_init_amount.multipliedBy(weight), this.telos);
                        /** @type {?} */
                        var volume_i;
                        if (table.comodity.symbol == token.symbol) {
                            volume_i = table.summary.volume.clone();
                        }
                        else if (table.currency.symbol == token.symbol) {
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
                /** @type {?} */
                var diff = price.minus(price_init);
                /** @type {?} */
                var ratio = 0;
                if (price_init.amount.toNumber() != 0) {
                    ratio = diff.amount.dividedBy(price_init.amount).toNumber();
                }
                /** @type {?} */
                var percent = Math.floor(ratio * 10000) / 100;
                /** @type {?} */
                var percent_str = (isNaN(percent) ? 0 : percent) + "%";
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
            this.resortTokens();
            this.setTokenSummary();
        });
    }
    /**
     * @param {?=} extended
     * @return {?}
     */
    fetchTokens(extended = true) {
        console.log("Vapaee.fetchTokens()");
        return this.contract.getTable("tokens").then(result => {
            /** @type {?} */
            var data = {
                tokens: /** @type {?} */ (result.rows)
            };
            for (var i in data.tokens) {
                data.tokens[i].scope = data.tokens[i].symbol.toLowerCase() + ".tlos";
                if (data.tokens[i].symbol == "TLOS") {
                    this.telos = data.tokens[i];
                }
            }
            return data;
        });
    }
    /**
     * @return {?}
     */
    resortTokens() {
        // console.log("(ini) ------------------------------------------------------------");
        // console.log("resortTokens()");
        // console.log("this.tokens[0]", this.tokens[0].summary);
        this.tokens.sort((a, b) => {
            // push offchain tokens to the end of the token list
            if (a.offchain)
                return 1;
            if (b.offchain)
                return -1;
            /** @type {?} */
            var a_vol = a.summary ? a.summary.volume : new AssetDEX();
            /** @type {?} */
            var b_vol = b.summary ? b.summary.volume : new AssetDEX();
            if (a_vol.amount.isGreaterThan(b_vol.amount))
                return -1;
            if (a_vol.amount.isLessThan(b_vol.amount))
                return 1;
            if (a.appname < b.appname)
                return -1;
            if (a.appname > b.appname)
                return 1;
            return 0;
        });
        // console.log("resortTokens()", this.tokens);
        // console.log("(end) ------------------------------------------------------------");
        this.onTokensReady.next(this.tokens);
    }
}
VapaeeDEX.decorators = [
    { type: Injectable, args: [{
                providedIn: "root"
            },] },
];
/** @nocollapse */
VapaeeDEX.ctorParameters = () => [
    { type: VapaeeScatter },
    { type: CookieService },
    { type: DatePipe }
];
/** @nocollapse */ VapaeeDEX.ngInjectableDef = defineInjectable({ factory: function VapaeeDEX_Factory() { return new VapaeeDEX(inject(VapaeeScatter), inject(CookieService$1), inject(DatePipe)); }, token: VapaeeDEX, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class VapaeeDexModule {
}
VapaeeDexModule.decorators = [
    { type: NgModule, args: [{
                imports: [],
                declarations: [],
                providers: [VapaeeDEX],
                exports: []
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { VapaeeDEX, VapaeeDexModule, TokenDEX, AssetDEX };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFwYWVlLWRleC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQHZhcGFlZS9kZXgvbGliL3Rva2VuLWRleC5jbGFzcy50cyIsIm5nOi8vQHZhcGFlZS9kZXgvbGliL2Fzc2V0LWRleC5jbGFzcy50cyIsIm5nOi8vQHZhcGFlZS9kZXgvbGliL2RleC5zZXJ2aWNlLnRzIiwibmc6Ly9AdmFwYWVlL2RleC9saWIvZGV4Lm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUb2tlbiB9IGZyb20gJ0B2YXBhZWUvc2NhdHRlcic7XG5pbXBvcnQgeyBBc3NldERFWCB9IGZyb20gXCIuL2Fzc2V0LWRleC5jbGFzc1wiO1xuXG4vKlxuZXhwb3J0IGludGVyZmFjZSBUb2tlbiB7XG4gICAgc3ltYm9sOiBzdHJpbmcsXG4gICAgcHJlY2lzaW9uPzogbnVtYmVyLFxuICAgIGNvbnRyYWN0Pzogc3RyaW5nLFxuICAgIGFwcG5hbWU/OiBzdHJpbmcsXG4gICAgd2Vic2l0ZT86IHN0cmluZyxcbiAgICBsb2dvPzogc3RyaW5nLFxuICAgIGxvZ29sZz86IHN0cmluZyxcbiAgICB2ZXJpZmllZD86IGJvb2xlYW4sXG4gICAgZmFrZT86IGJvb2xlYW4sXG4gICAgb2ZmY2hhaW4/OiBib29sZWFuLFxuICAgIHNjb3BlPzogc3RyaW5nLFxuICAgIHN0YXQ/OiB7XG4gICAgICAgIHN1cHBseTogc3RyaW5nLFxuICAgICAgICBtYXhfc3VwcGx5OiBzdHJpbmcsXG4gICAgICAgIGlzc3Vlcj86IHN0cmluZyxcbiAgICAgICAgb3duZXI/OiBzdHJpbmcsXG4gICAgICAgIGlzc3VlcnM/OiBzdHJpbmdbXVxuICAgIH0sXG4gICAgc3VtbWFyeT86IHtcbiAgICAgICAgdm9sdW1lOiBBc3NldCxcbiAgICAgICAgcHJpY2U6IEFzc2V0LFxuICAgICAgICBwcmljZV8yNGhfYWdvOiBBc3NldCxcbiAgICAgICAgcGVyY2VudD86bnVtYmVyLFxuICAgICAgICBwZXJjZW50X3N0cj86c3RyaW5nXG4gICAgfVxuXG59XG4qL1xuZXhwb3J0IGNsYXNzIFRva2VuREVYIGV4dGVuZHMgVG9rZW4ge1xuICAgIC8vIHByaXZhdGUgX3N0cjogc3RyaW5nO1xuICAgIC8vIHByaXZhdGUgX3N5bWJvbDogc3RyaW5nO1xuICAgIC8vIHByaXZhdGUgX3ByZWNpc2lvbjogbnVtYmVyO1xuICAgIC8vIHByaXZhdGUgX2NvbnRyYWN0OiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgYXBwbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyB3ZWJzaXRlOiBzdHJpbmc7XG4gICAgcHVibGljIGxvZ286IHN0cmluZztcbiAgICBwdWJsaWMgbG9nb2xnOiBzdHJpbmc7XG4gICAgcHVibGljIHZlcmlmaWVkOiBib29sZWFuO1xuICAgIHB1YmxpYyBmYWtlOiBib29sZWFuO1xuICAgIHB1YmxpYyBvZmZjaGFpbjogYm9vbGVhbjtcbiAgICBwdWJsaWMgc2NvcGU6IHN0cmluZztcblxuICAgIHN0YXQ/OiB7XG4gICAgICAgIHN1cHBseTogc3RyaW5nLFxuICAgICAgICBtYXhfc3VwcGx5OiBzdHJpbmcsXG4gICAgICAgIGlzc3Vlcj86IHN0cmluZyxcbiAgICAgICAgb3duZXI/OiBzdHJpbmcsXG4gICAgICAgIGlzc3VlcnM/OiBzdHJpbmdbXVxuICAgIH07XG5cbiAgICBzdW1tYXJ5Pzoge1xuICAgICAgICB2b2x1bWU6IEFzc2V0REVYLFxuICAgICAgICBwcmljZTogQXNzZXRERVgsXG4gICAgICAgIHByaWNlXzI0aF9hZ286IEFzc2V0REVYLFxuICAgICAgICBwZXJjZW50PzpudW1iZXIsXG4gICAgICAgIHBlcmNlbnRfc3RyPzpzdHJpbmdcbiAgICB9ICAgIFxuXG4gICAgY29uc3RydWN0b3Iob2JqOmFueSA9IG51bGwpIHtcbiAgICAgICAgc3VwZXIob2JqKTtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmogPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgZGVsZXRlIG9iai5zeW1ib2w7XG4gICAgICAgICAgICBkZWxldGUgb2JqLnByZWNpc2lvbjtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmouY29udHJhY3Q7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50b1N0cmluZygpO1xuICAgIH1cblxuXG59IiwiaW1wb3J0IEJpZ051bWJlciBmcm9tICdiaWdudW1iZXIuanMnO1xuaW1wb3J0IHsgVG9rZW5ERVggfSBmcm9tICcuL3Rva2VuLWRleC5jbGFzcyc7XG5pbXBvcnQgeyBBc3NldCB9IGZyb20gJ0B2YXBhZWUvc2NhdHRlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVZhcGFlZURFWCB7XG4gICAgZ2V0VG9rZW5Ob3coc3ltYm9sOnN0cmluZyk6IFRva2VuREVYO1xufVxuXG5leHBvcnQgY2xhc3MgQXNzZXRERVggZXh0ZW5kcyBBc3NldCB7XG4gICAgYW1vdW50OkJpZ051bWJlcjtcbiAgICB0b2tlbjpUb2tlbkRFWDtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihhOiBhbnkgPSBudWxsLCBiOiBhbnkgPSBudWxsKSB7XG4gICAgICAgIHN1cGVyKGEsYik7XG5cbiAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBBc3NldERFWCkge1xuICAgICAgICAgICAgdGhpcy5hbW91bnQgPSBhLmFtb3VudDtcbiAgICAgICAgICAgIHRoaXMudG9rZW4gPSBiO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEhYiAmJiBiWydnZXRUb2tlbk5vdyddKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlRGV4KGEsYik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNsb25lKCk6IEFzc2V0REVYIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBc3NldERFWCh0aGlzLmFtb3VudCwgdGhpcy50b2tlbik7XG4gICAgfVxuXG4gICAgcGx1cyhiOkFzc2V0REVYKSB7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KCEhYiwgXCJFUlJPUjogYiBpcyBub3QgYW4gQXNzZXRcIiwgYiwgdGhpcy5zdHIpO1xuICAgICAgICBjb25zb2xlLmFzc2VydChiLnRva2VuLnN5bWJvbCA9PSB0aGlzLnRva2VuLnN5bWJvbCwgXCJFUlJPUjogdHJ5aW5nIHRvIHN1bSBhc3NldHMgd2l0aCBkaWZmZXJlbnQgdG9rZW5zOiBcIiArIHRoaXMuc3RyICsgXCIgYW5kIFwiICsgYi5zdHIpO1xuICAgICAgICB2YXIgYW1vdW50ID0gdGhpcy5hbW91bnQucGx1cyhiLmFtb3VudCk7XG4gICAgICAgIHJldHVybiBuZXcgQXNzZXRERVgoYW1vdW50LCB0aGlzLnRva2VuKTtcbiAgICB9XG5cbiAgICBtaW51cyhiOkFzc2V0REVYKSB7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KCEhYiwgXCJFUlJPUjogYiBpcyBub3QgYW4gQXNzZXRcIiwgYiwgdGhpcy5zdHIpO1xuICAgICAgICBjb25zb2xlLmFzc2VydChiLnRva2VuLnN5bWJvbCA9PSB0aGlzLnRva2VuLnN5bWJvbCwgXCJFUlJPUjogdHJ5aW5nIHRvIHN1YnN0cmFjdCBhc3NldHMgd2l0aCBkaWZmZXJlbnQgdG9rZW5zOiBcIiArIHRoaXMuc3RyICsgXCIgYW5kIFwiICsgYi5zdHIpO1xuICAgICAgICB2YXIgYW1vdW50ID0gdGhpcy5hbW91bnQubWludXMoYi5hbW91bnQpO1xuICAgICAgICByZXR1cm4gbmV3IEFzc2V0REVYKGFtb3VudCwgdGhpcy50b2tlbik7XG4gICAgfSAgICBcblxuICAgIHBhcnNlRGV4KHRleHQ6IHN0cmluZywgZGV4OiBJVmFwYWVlREVYKSB7XG4gICAgICAgIGlmICh0ZXh0ID09IFwiXCIpIHJldHVybjtcbiAgICAgICAgdmFyIHN5bSA9IHRleHQuc3BsaXQoXCIgXCIpWzFdO1xuICAgICAgICB0aGlzLnRva2VuID0gZGV4LmdldFRva2VuTm93KHN5bSk7XG4gICAgICAgIHZhciBhbW91bnRfc3RyID0gdGV4dC5zcGxpdChcIiBcIilbMF07XG4gICAgICAgIHRoaXMuYW1vdW50ID0gbmV3IEJpZ051bWJlcihhbW91bnRfc3RyKTtcbiAgICB9XG5cbiAgICBcbiAgICB0b1N0cmluZyhkZWNpbWFsczpudW1iZXIgPSAtMSk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy50b2tlbikgcmV0dXJuIFwiMC4wMDAwXCI7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlVG9TdHJpbmcoZGVjaW1hbHMpICsgXCIgXCIgKyB0aGlzLnRva2VuLnN5bWJvbC50b1VwcGVyQ2FzZSgpO1xuICAgIH1cblxuICAgIGludmVyc2UodG9rZW46IFRva2VuREVYKTogQXNzZXRERVgge1xuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEJpZ051bWJlcigxKS5kaXZpZGVkQnkodGhpcy5hbW91bnQpO1xuICAgICAgICB2YXIgYXNzZXQgPSAgbmV3IEFzc2V0REVYKHJlc3VsdCwgdG9rZW4pO1xuICAgICAgICByZXR1cm4gYXNzZXQ7XG4gICAgfVxufSIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCBCaWdOdW1iZXIgZnJvbSBcImJpZ251bWJlci5qc1wiO1xuaW1wb3J0IHsgQ29va2llU2VydmljZSB9IGZyb20gJ25neC1jb29raWUtc2VydmljZSc7XG5pbXBvcnQgeyBEYXRlUGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBUb2tlbkRFWCB9IGZyb20gJy4vdG9rZW4tZGV4LmNsYXNzJztcbmltcG9ydCB7IEFzc2V0REVYIH0gZnJvbSAnLi9hc3NldC1kZXguY2xhc3MnO1xuaW1wb3J0IHsgRmVlZGJhY2sgfSBmcm9tICdAdmFwYWVlL2ZlZWRiYWNrJztcbmltcG9ydCB7IFZhcGFlZVNjYXR0ZXIsIEFjY291bnQsIEFjY291bnREYXRhLCBTbWFydENvbnRyYWN0LCBUYWJsZVJlc3VsdCwgVGFibGVQYXJhbXMgfSBmcm9tICdAdmFwYWVlL3NjYXR0ZXInO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogXCJyb290XCJcbn0pXG5leHBvcnQgY2xhc3MgVmFwYWVlREVYIHtcblxuICAgIHB1YmxpYyBsb2dpblN0YXRlOiBzdHJpbmc7XG4gICAgLypcbiAgICBwdWJsaWMgbG9naW5TdGF0ZTogc3RyaW5nO1xuICAgIC0gJ25vLXNjYXR0ZXInOiBTY2F0dGVyIG5vIGRldGVjdGVkXG4gICAgLSAnbm8tbG9nZ2VkJzogU2NhdHRlciBkZXRlY3RlZCBidXQgdXNlciBpcyBub3QgbG9nZ2VkXG4gICAgLSAnYWNjb3VudC1vayc6IHVzZXIgbG9nZ2VyIHdpdGggc2NhdHRlclxuICAgICovXG4gICAgcHJpdmF0ZSBfbWFya2V0czogTWFya2V0TWFwO1xuICAgIHByaXZhdGUgX3JldmVyc2U6IE1hcmtldE1hcDtcblxuICAgIHB1YmxpYyB6ZXJvX3RlbG9zOiBBc3NldERFWDtcbiAgICBwdWJsaWMgdGVsb3M6IFRva2VuREVYO1xuICAgIHB1YmxpYyB0b2tlbnM6IFRva2VuREVYW107XG4gICAgcHVibGljIGNvbnRyYWN0OiBTbWFydENvbnRyYWN0O1xuICAgIHB1YmxpYyBmZWVkOiBGZWVkYmFjaztcbiAgICBwdWJsaWMgY3VycmVudDogQWNjb3VudDtcbiAgICBwdWJsaWMgbGFzdF9sb2dnZWQ6IHN0cmluZztcbiAgICBwdWJsaWMgY29udHJhY3RfbmFtZTogc3RyaW5nOyAgIFxuICAgIHB1YmxpYyBkZXBvc2l0czogQXNzZXRERVhbXTtcbiAgICBwdWJsaWMgYmFsYW5jZXM6IEFzc2V0REVYW107XG4gICAgcHVibGljIHVzZXJvcmRlcnM6IFVzZXJPcmRlcnNNYXA7XG4gICAgcHVibGljIG9uTG9nZ2VkQWNjb3VudENoYW5nZTpTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvbkN1cnJlbnRBY2NvdW50Q2hhbmdlOlN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIG9uSGlzdG9yeUNoYW5nZTpTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvbk1hcmtldFN1bW1hcnk6U3ViamVjdDxNYXJrZXRTdW1tYXJ5PiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgLy8gcHVibGljIG9uQmxvY2tsaXN0Q2hhbmdlOlN1YmplY3Q8YW55W11bXT4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvblRva2Vuc1JlYWR5OlN1YmplY3Q8VG9rZW5ERVhbXT4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvbk1hcmtldFJlYWR5OlN1YmplY3Q8VG9rZW5ERVhbXT4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvblRyYWRlVXBkYXRlZDpTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHZhcGFlZXRva2VuczpzdHJpbmcgPSBcInZhcGFlZXRva2Vuc1wiO1xuXG4gICAgYWN0aXZpdHlQYWdlc2l6ZTpudW1iZXIgPSAxMDtcbiAgICBcbiAgICBhY3Rpdml0eTp7XG4gICAgICAgIHRvdGFsOm51bWJlcjtcbiAgICAgICAgZXZlbnRzOntbaWQ6c3RyaW5nXTpFdmVudExvZ307XG4gICAgICAgIGxpc3Q6RXZlbnRMb2dbXTtcbiAgICB9O1xuICAgIFxuICAgIHByaXZhdGUgc2V0T3JkZXJTdW1tYXJ5OiBGdW5jdGlvbjtcbiAgICBwdWJsaWMgd2FpdE9yZGVyU3VtbWFyeTogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRPcmRlclN1bW1hcnkgPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgcHJpdmF0ZSBzZXRUb2tlblN0YXRzOiBGdW5jdGlvbjtcbiAgICBwdWJsaWMgd2FpdFRva2VuU3RhdHM6IFByb21pc2U8YW55PiA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0VG9rZW5TdGF0cyA9IHJlc29sdmU7XG4gICAgfSk7XG5cbiAgICBwcml2YXRlIHNldE1hcmtldFN1bW1hcnk6IEZ1bmN0aW9uO1xuICAgIHB1YmxpYyB3YWl0TWFya2V0U3VtbWFyeTogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRNYXJrZXRTdW1tYXJ5ID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIHByaXZhdGUgc2V0VG9rZW5TdW1tYXJ5OiBGdW5jdGlvbjtcbiAgICBwdWJsaWMgd2FpdFRva2VuU3VtbWFyeTogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRUb2tlblN1bW1hcnkgPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgcHJpdmF0ZSBzZXRUb2tlbnNMb2FkZWQ6IEZ1bmN0aW9uO1xuICAgIHB1YmxpYyB3YWl0VG9rZW5zTG9hZGVkOiBQcm9taXNlPGFueT4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0aGlzLnNldFRva2Vuc0xvYWRlZCA9IHJlc29sdmU7XG4gICAgfSk7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgc2NhdHRlcjogVmFwYWVlU2NhdHRlcixcbiAgICAgICAgcHJpdmF0ZSBjb29raWVzOiBDb29raWVTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIGRhdGVQaXBlOiBEYXRlUGlwZVxuICAgICkge1xuICAgICAgICB0aGlzLl9tYXJrZXRzID0ge307XG4gICAgICAgIHRoaXMuX3JldmVyc2UgPSB7fTtcbiAgICAgICAgdGhpcy5hY3Rpdml0eSA9IHt0b3RhbDowLCBldmVudHM6e30sIGxpc3Q6W119O1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLmRlZmF1bHQ7XG4gICAgICAgIHRoaXMuY29udHJhY3RfbmFtZSA9IHRoaXMudmFwYWVldG9rZW5zO1xuICAgICAgICB0aGlzLmNvbnRyYWN0ID0gdGhpcy5zY2F0dGVyLmdldFNtYXJ0Q29udHJhY3QodGhpcy5jb250cmFjdF9uYW1lKTtcbiAgICAgICAgdGhpcy5mZWVkID0gbmV3IEZlZWRiYWNrKCk7XG4gICAgICAgIHRoaXMuc2NhdHRlci5vbkxvZ2dnZWRTdGF0ZUNoYW5nZS5zdWJzY3JpYmUodGhpcy5vbkxvZ2dlZENoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy51cGRhdGVMb2dTdGF0ZSgpO1xuICAgICAgICB0aGlzLmZldGNoVG9rZW5zKCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgIHRoaXMudG9rZW5zID0gZGF0YS50b2tlbnM7XG4gICAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbkRFWCh7XG4gICAgICAgICAgICAgICAgYXBwbmFtZTogXCJWaWl0YXNwaGVyZVwiLFxuICAgICAgICAgICAgICAgIGNvbnRyYWN0OiBcInZpaXRhc3BoZXJlMVwiLFxuICAgICAgICAgICAgICAgIGxvZ286IFwiL2Fzc2V0cy9sb2dvcy92aWl0YXNwaGVyZS5wbmdcIixcbiAgICAgICAgICAgICAgICBsb2dvbGc6IFwiL2Fzc2V0cy9sb2dvcy92aWl0YXNwaGVyZS1sZy5wbmdcIixcbiAgICAgICAgICAgICAgICBwcmVjaXNpb246IDQsXG4gICAgICAgICAgICAgICAgc2NvcGU6IFwidmlpdGN0LnRsb3NcIixcbiAgICAgICAgICAgICAgICBzeW1ib2w6IFwiVklJVEFcIixcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgd2Vic2l0ZTogXCJodHRwczovL3ZpaXRhc3BoZXJlLmNvbVwiXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbkRFWCh7XG4gICAgICAgICAgICAgICAgYXBwbmFtZTogXCJWaWl0YXNwaGVyZVwiLFxuICAgICAgICAgICAgICAgIGNvbnRyYWN0OiBcInZpaXRhc3BoZXJlMVwiLFxuICAgICAgICAgICAgICAgIGxvZ286IFwiL2Fzc2V0cy9sb2dvcy92aWl0YXNwaGVyZS5wbmdcIixcbiAgICAgICAgICAgICAgICBsb2dvbGc6IFwiL2Fzc2V0cy9sb2dvcy92aWl0YXNwaGVyZS1sZy5wbmdcIixcbiAgICAgICAgICAgICAgICBwcmVjaXNpb246IDAsXG4gICAgICAgICAgICAgICAgc2NvcGU6IFwidmlpdGN0LnRsb3NcIixcbiAgICAgICAgICAgICAgICBzeW1ib2w6IFwiVklJQ1RcIixcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgd2Vic2l0ZTogXCJodHRwczovL3ZpaXRhc3BoZXJlLmNvbVwiXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB0aGlzLnplcm9fdGVsb3MgPSBuZXcgQXNzZXRERVgoXCIwLjAwMDAgVExPU1wiLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VG9rZW5zTG9hZGVkKCk7XG4gICAgICAgICAgICB0aGlzLmZldGNoVG9rZW5zU3RhdHMoKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0T3JkZXJTdW1tYXJ5KCk7XG4gICAgICAgICAgICB0aGlzLmdldEFsbFRhYmxlc1N1bWFyaWVzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKF8gPT4ge1xuICAgICAgICAvLyB9KVxuXG5cbiAgICAgICAgdmFyIHRpbWVyO1xuICAgICAgICB0aGlzLm9uTWFya2V0U3VtbWFyeS5zdWJzY3JpYmUoc3VtbWFyeSA9PiB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVG9rZW5zU3VtbWFyeSgpO1xuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgfSk7ICAgIFxuXG5cblxuICAgIH1cblxuICAgIC8vIGdldHRlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBkZWZhdWx0KCk6IEFjY291bnQge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLmRlZmF1bHQ7XG4gICAgfVxuXG4gICAgZ2V0IGxvZ2dlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NhdHRlci5sb2dnZWQgJiYgIXRoaXMuc2NhdHRlci5hY2NvdW50KSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIldBUk5JTkchISFcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnNjYXR0ZXIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5zY2F0dGVyLnVzZXJuYW1lKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCIqKioqKioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgKi9cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLmxvZ2dlZCA/XG4gICAgICAgICAgICAodGhpcy5zY2F0dGVyLmFjY291bnQgPyB0aGlzLnNjYXR0ZXIuYWNjb3VudC5uYW1lIDogdGhpcy5zY2F0dGVyLmRlZmF1bHQubmFtZSkgOlxuICAgICAgICAgICAgbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgYWNjb3VudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhdHRlci5sb2dnZWQgPyBcbiAgICAgICAgdGhpcy5zY2F0dGVyLmFjY291bnQgOlxuICAgICAgICB0aGlzLnNjYXR0ZXIuZGVmYXVsdDtcbiAgICB9XG5cbiAgICAvLyAtLSBVc2VyIExvZyBTdGF0ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsb2dpbigpIHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dpblwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2ctc3RhdGVcIiwgdHJ1ZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmxvZ2luKCkgdGhpcy5mZWVkLmxvYWRpbmcoJ2xvZy1zdGF0ZScpXCIsIHRoaXMuZmVlZC5sb2FkaW5nKCdsb2ctc3RhdGUnKSk7XG4gICAgICAgIHRoaXMubG9nb3V0KCk7XG4gICAgICAgIHRoaXMudXBkYXRlTG9nU3RhdGUoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgubG9naW4oKSB0aGlzLmZlZWQubG9hZGluZygnbG9nLXN0YXRlJylcIiwgdGhpcy5mZWVkLmxvYWRpbmcoJ2xvZy1zdGF0ZScpKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dvdXRcIiwgZmFsc2UpO1xuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLmxvZ2luKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxvZ1N0YXRlKCk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ2luXCIsIGZhbHNlKTtcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ2luXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dvdXRcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc2NhdHRlci5sb2dvdXQoKTtcbiAgICB9XG5cbiAgICBvbkxvZ291dCgpIHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dvdXRcIiwgZmFsc2UpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5vbkxvZ291dCgpXCIpO1xuICAgICAgICB0aGlzLnJlc2V0Q3VycmVudEFjY291bnQodGhpcy5kZWZhdWx0Lm5hbWUpO1xuICAgICAgICB0aGlzLnVwZGF0ZUxvZ1N0YXRlKCk7XG4gICAgICAgIHRoaXMub25Mb2dnZWRBY2NvdW50Q2hhbmdlLm5leHQodGhpcy5sb2dnZWQpO1xuICAgICAgICB0aGlzLmNvb2tpZXMuZGVsZXRlKFwibG9naW5cIik7XG4gICAgICAgIHNldFRpbWVvdXQoXyAgPT4geyB0aGlzLmxhc3RfbG9nZ2VkID0gdGhpcy5sb2dnZWQ7IH0sIDQwMCk7XG4gICAgfVxuICAgIFxuICAgIG9uTG9naW4obmFtZTpzdHJpbmcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgub25Mb2dpbigpXCIsIG5hbWUpO1xuICAgICAgICB0aGlzLnJlc2V0Q3VycmVudEFjY291bnQobmFtZSk7XG4gICAgICAgIHRoaXMuZ2V0RGVwb3NpdHMoKTtcbiAgICAgICAgdGhpcy5nZXRCYWxhbmNlcygpO1xuICAgICAgICB0aGlzLnVwZGF0ZUxvZ1N0YXRlKCk7XG4gICAgICAgIHRoaXMuZ2V0VXNlck9yZGVycygpO1xuICAgICAgICB0aGlzLm9uTG9nZ2VkQWNjb3VudENoYW5nZS5uZXh0KHRoaXMubG9nZ2VkKTtcbiAgICAgICAgdGhpcy5sYXN0X2xvZ2dlZCA9IHRoaXMubG9nZ2VkO1xuICAgICAgICB0aGlzLmNvb2tpZXMuc2V0KFwibG9naW5cIiwgdGhpcy5sb2dnZWQpO1xuICAgIH1cblxuICAgIG9uTG9nZ2VkQ2hhbmdlKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5vbkxvZ2dlZENoYW5nZSgpXCIpO1xuICAgICAgICBpZiAodGhpcy5zY2F0dGVyLmxvZ2dlZCkge1xuICAgICAgICAgICAgdGhpcy5vbkxvZ2luKHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vbkxvZ291dCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgcmVzZXRDdXJyZW50QWNjb3VudChwcm9maWxlOnN0cmluZykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5yZXNldEN1cnJlbnRBY2NvdW50KClcIiwgdGhpcy5jdXJyZW50Lm5hbWUsIFwiLT5cIiwgcHJvZmlsZSk7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnQubmFtZSAhPSBwcm9maWxlICYmICh0aGlzLmN1cnJlbnQubmFtZSA9PSB0aGlzLmxhc3RfbG9nZ2VkIHx8IHByb2ZpbGUgIT0gXCJndWVzdFwiKSkge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJhY2NvdW50XCIsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5kZWZhdWx0O1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Lm5hbWUgPSBwcm9maWxlO1xuICAgICAgICAgICAgaWYgKHByb2ZpbGUgIT0gXCJndWVzdFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50LmRhdGEgPSBhd2FpdCB0aGlzLmdldEFjY291bnREYXRhKHRoaXMuY3VycmVudC5uYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJXQVJOSU5HISEhIGN1cnJlbnQgaXMgZ3Vlc3RcIiwgW3Byb2ZpbGUsIHRoaXMuYWNjb3VudCwgdGhpcy5jdXJyZW50XSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGhpcy5zY29wZXMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuYmFsYW5jZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMudXNlcm9yZGVycyA9IHt9OyAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLm9uQ3VycmVudEFjY291bnRDaGFuZ2UubmV4dCh0aGlzLmN1cnJlbnQubmFtZSkgISEhISEhXCIpO1xuICAgICAgICAgICAgdGhpcy5vbkN1cnJlbnRBY2NvdW50Q2hhbmdlLm5leHQodGhpcy5jdXJyZW50Lm5hbWUpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50VXNlcigpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJhY2NvdW50XCIsIGZhbHNlKTtcbiAgICAgICAgfSAgICAgICBcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUxvZ1N0YXRlKCkge1xuICAgICAgICB0aGlzLmxvZ2luU3RhdGUgPSBcIm5vLXNjYXR0ZXJcIjtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2ctc3RhdGVcIiwgdHJ1ZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnVwZGF0ZUxvZ1N0YXRlKCkgXCIsIHRoaXMubG9naW5TdGF0ZSwgdGhpcy5mZWVkLmxvYWRpbmcoXCJsb2ctc3RhdGVcIikpO1xuICAgICAgICB0aGlzLnNjYXR0ZXIud2FpdENvbm5lY3RlZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9naW5TdGF0ZSA9IFwibm8tbG9nZ2VkXCI7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC51cGRhdGVMb2dTdGF0ZSgpICAgXCIsIHRoaXMubG9naW5TdGF0ZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5zY2F0dGVyLmxvZ2dlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9naW5TdGF0ZSA9IFwiYWNjb3VudC1va1wiO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnVwZGF0ZUxvZ1N0YXRlKCkgICAgIFwiLCB0aGlzLmxvZ2luU3RhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2ctc3RhdGVcIiwgZmFsc2UpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgudXBkYXRlTG9nU3RhdGUoKSBcIiwgdGhpcy5sb2dpblN0YXRlLCB0aGlzLmZlZWQubG9hZGluZyhcImxvZy1zdGF0ZVwiKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciB0aW1lcjI7XG4gICAgICAgIHZhciB0aW1lcjEgPSBzZXRJbnRlcnZhbChfID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zY2F0dGVyLmZlZWQubG9hZGluZyhcImNvbm5lY3RcIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZy1zdGF0ZVwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcjEpO1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMjAwKTtcblxuICAgICAgICB0aW1lcjIgPSBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcjEpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2ctc3RhdGVcIiwgZmFsc2UpO1xuICAgICAgICB9LCA2MDAwKTtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRBY2NvdW50RGF0YShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPEFjY291bnREYXRhPiAge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLnF1ZXJ5QWNjb3VudERhdGEobmFtZSkuY2F0Y2goYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWZhdWx0LmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFjdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjcmVhdGVPcmRlcih0eXBlOnN0cmluZywgYW1vdW50OkFzc2V0REVYLCBwcmljZTpBc3NldERFWCkge1xuICAgICAgICAvLyBcImFsaWNlXCIsIFwiYnV5XCIsIFwiMi41MDAwMDAwMCBDTlRcIiwgXCIwLjQwMDAwMDAwIFRMT1NcIlxuICAgICAgICAvLyBuYW1lIG93bmVyLCBuYW1lIHR5cGUsIGNvbnN0IGFzc2V0ICYgdG90YWwsIGNvbnN0IGFzc2V0ICYgcHJpY2VcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJvcmRlci1cIit0eXBlLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZXhjZWN1dGUoXCJvcmRlclwiLCB7XG4gICAgICAgICAgICBvd25lcjogIHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgdG90YWw6IGFtb3VudC50b1N0cmluZyg4KSxcbiAgICAgICAgICAgIHByaWNlOiBwcmljZS50b1N0cmluZyg4KVxuICAgICAgICB9KS50aGVuKGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRyYWRlKGFtb3VudC50b2tlbiwgcHJpY2UudG9rZW4pO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJvcmRlci1cIit0eXBlLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwib3JkZXItXCIrdHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNhbmNlbE9yZGVyKHR5cGU6c3RyaW5nLCBjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgsIG9yZGVyczpudW1iZXJbXSkge1xuICAgICAgICAvLyAnW1wiYWxpY2VcIiwgXCJidXlcIiwgXCJDTlRcIiwgXCJUTE9TXCIsIFsxLDBdXSdcbiAgICAgICAgLy8gbmFtZSBvd25lciwgbmFtZSB0eXBlLCBjb25zdCBhc3NldCAmIHRvdGFsLCBjb25zdCBhc3NldCAmIHByaWNlXG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY2FuY2VsLVwiK3R5cGUsIHRydWUpO1xuICAgICAgICBmb3IgKHZhciBpIGluIG9yZGVycykgeyB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImNhbmNlbC1cIit0eXBlK1wiLVwiK29yZGVyc1tpXSwgdHJ1ZSk7IH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZXhjZWN1dGUoXCJjYW5jZWxcIiwge1xuICAgICAgICAgICAgb3duZXI6ICB0aGlzLnNjYXR0ZXIuYWNjb3VudC5uYW1lLFxuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIGNvbW9kaXR5OiBjb21vZGl0eS5zeW1ib2wsXG4gICAgICAgICAgICBjdXJyZW5jeTogY3VycmVuY3kuc3ltYm9sLFxuICAgICAgICAgICAgb3JkZXJzOiBvcmRlcnNcbiAgICAgICAgfSkudGhlbihhc3luYyByZXN1bHQgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUcmFkZShjb21vZGl0eSwgY3VycmVuY3kpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBvcmRlcnMpIHsgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZStcIi1cIitvcmRlcnNbaV0sIGZhbHNlKTsgfSAgICBcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBvcmRlcnMpIHsgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZStcIi1cIitvcmRlcnNbaV0sIGZhbHNlKTsgfSAgICBcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXBvc2l0KHF1YW50aXR5OkFzc2V0REVYKSB7XG4gICAgICAgIC8vIG5hbWUgb3duZXIsIG5hbWUgdHlwZSwgY29uc3QgYXNzZXQgJiB0b3RhbCwgY29uc3QgYXNzZXQgJiBwcmljZVxuICAgICAgICB2YXIgY29udHJhY3QgPSB0aGlzLnNjYXR0ZXIuZ2V0U21hcnRDb250cmFjdChxdWFudGl0eS50b2tlbi5jb250cmFjdCk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRFcnJvcihcImRlcG9zaXRcIiwgbnVsbCk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdFwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0LVwiK3F1YW50aXR5LnRva2VuLnN5bWJvbC50b0xvd2VyQ2FzZSgpLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIGNvbnRyYWN0LmV4Y2VjdXRlKFwidHJhbnNmZXJcIiwge1xuICAgICAgICAgICAgZnJvbTogIHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICB0bzogdGhpcy52YXBhZWV0b2tlbnMsXG4gICAgICAgICAgICBxdWFudGl0eTogcXVhbnRpdHkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIG1lbW86IFwiZGVwb3NpdFwiXG4gICAgICAgIH0pLnRoZW4oYXN5bmMgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdFwiLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImRlcG9zaXQtXCIrcXVhbnRpdHkudG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCksIGZhbHNlKTsgICAgXG4gICAgICAgICAgICAvKmF3YWl0Ki8gdGhpcy5nZXREZXBvc2l0cygpO1xuICAgICAgICAgICAgLyphd2FpdCovIHRoaXMuZ2V0QmFsYW5jZXMoKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdC1cIitxdWFudGl0eS50b2tlbi5zeW1ib2wudG9Mb3dlckNhc2UoKSwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldEVycm9yKFwiZGVwb3NpdFwiLCB0eXBlb2YgZSA9PSBcInN0cmluZ1wiID8gZSA6IEpTT04uc3RyaW5naWZ5KGUsbnVsbCw0KSk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSk7XG4gICAgfSAgICBcblxuICAgIHdpdGhkcmF3KHF1YW50aXR5OkFzc2V0REVYKSB7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRFcnJvcihcIndpdGhkcmF3XCIsIG51bGwpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3XCIsIHRydWUpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3LVwiK3F1YW50aXR5LnRva2VuLnN5bWJvbC50b0xvd2VyQ2FzZSgpLCB0cnVlKTsgICBcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZXhjZWN1dGUoXCJ3aXRoZHJhd1wiLCB7XG4gICAgICAgICAgICBvd25lcjogIHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICBxdWFudGl0eTogcXVhbnRpdHkudG9TdHJpbmcoKVxuICAgICAgICB9KS50aGVuKGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwid2l0aGRyYXctXCIrcXVhbnRpdHkudG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCksIGZhbHNlKTtcbiAgICAgICAgICAgIC8qYXdhaXQqLyB0aGlzLmdldERlcG9zaXRzKCk7XG4gICAgICAgICAgICAvKmF3YWl0Ki8gdGhpcy5nZXRCYWxhbmNlcygpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwid2l0aGRyYXctXCIrcXVhbnRpdHkudG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCksIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRFcnJvcihcIndpdGhkcmF3XCIsIHR5cGVvZiBlID09IFwic3RyaW5nXCIgPyBlIDogSlNPTi5zdHJpbmdpZnkoZSxudWxsLDQpKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFRva2VucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGFkZE9mZkNoYWluVG9rZW4ob2ZmY2hhaW46IFRva2VuREVYKSB7XG4gICAgICAgIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKF8gPT4ge1xuICAgICAgICAgICAgdGhpcy50b2tlbnMucHVzaChuZXcgVG9rZW5ERVgoe1xuICAgICAgICAgICAgICAgIHN5bWJvbDogb2ZmY2hhaW4uc3ltYm9sLFxuICAgICAgICAgICAgICAgIHByZWNpc2lvbjogb2ZmY2hhaW4ucHJlY2lzaW9uIHx8IDQsXG4gICAgICAgICAgICAgICAgY29udHJhY3Q6IFwibm9jb250cmFjdFwiLFxuICAgICAgICAgICAgICAgIGFwcG5hbWU6IG9mZmNoYWluLmFwcG5hbWUsXG4gICAgICAgICAgICAgICAgd2Vic2l0ZTogXCJcIixcbiAgICAgICAgICAgICAgICBsb2dvOlwiXCIsXG4gICAgICAgICAgICAgICAgbG9nb2xnOiBcIlwiLFxuICAgICAgICAgICAgICAgIHNjb3BlOiBcIlwiLFxuICAgICAgICAgICAgICAgIHN0YXQ6IG51bGwsXG4gICAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG9mZmNoYWluOiB0cnVlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTY29wZXMgLyBUYWJsZXMgXG4gICAgcHVibGljIGhhc1Njb3BlcygpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fbWFya2V0cztcbiAgICB9XG5cbiAgICBwdWJsaWMgbWFya2V0KHNjb3BlOnN0cmluZyk6IE1hcmtldCB7XG4gICAgICAgIGlmICh0aGlzLl9tYXJrZXRzW3Njb3BlXSkgcmV0dXJuIHRoaXMuX21hcmtldHNbc2NvcGVdOyAgICAgICAgLy8gLS0tPiBkaXJlY3RcbiAgICAgICAgdmFyIHJldmVyc2UgPSB0aGlzLmludmVyc2VTY29wZShzY29wZSk7XG4gICAgICAgIGlmICh0aGlzLl9yZXZlcnNlW3JldmVyc2VdKSByZXR1cm4gdGhpcy5fcmV2ZXJzZVtyZXZlcnNlXTsgIC8vIC0tLT4gcmV2ZXJzZVxuICAgICAgICBpZiAoIXRoaXMuX21hcmtldHNbcmV2ZXJzZV0pIHJldHVybiBudWxsOyAgICAgICAgICAgICAgICAgICAgLy8gLS0tPiB0YWJsZSBkb2VzIG5vdCBleGlzdCAob3IgaGFzIG5vdCBiZWVuIGxvYWRlZCB5ZXQpXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXJrZXRzW3Njb3BlXSB8fCB0aGlzLnJldmVyc2Uoc2NvcGUpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0YWJsZShzY29wZTpzdHJpbmcpOiBNYXJrZXQge1xuICAgICAgICAvL2NvbnNvbGUuZXJyb3IoXCJ0YWJsZShcIitzY29wZStcIikgREVQUkVDQVRFRFwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFya2V0KHNjb3BlKTtcbiAgICB9ICAgIFxuXG4gICAgcHJpdmF0ZSByZXZlcnNlKHNjb3BlOnN0cmluZyk6IE1hcmtldCB7XG4gICAgICAgIHZhciBjYW5vbmljYWwgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgdmFyIHJldmVyc2Vfc2NvcGUgPSB0aGlzLmludmVyc2VTY29wZShjYW5vbmljYWwpO1xuICAgICAgICBjb25zb2xlLmFzc2VydChjYW5vbmljYWwgIT0gcmV2ZXJzZV9zY29wZSwgXCJFUlJPUjogXCIsIGNhbm9uaWNhbCwgcmV2ZXJzZV9zY29wZSk7XG4gICAgICAgIHZhciByZXZlcnNlX3RhYmxlOk1hcmtldCA9IHRoaXMuX3JldmVyc2VbcmV2ZXJzZV9zY29wZV07XG4gICAgICAgIGlmICghcmV2ZXJzZV90YWJsZSAmJiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0pIHtcbiAgICAgICAgICAgIHRoaXMuX3JldmVyc2VbcmV2ZXJzZV9zY29wZV0gPSB0aGlzLmNyZWF0ZVJldmVyc2VUYWJsZUZvcihyZXZlcnNlX3Njb3BlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fcmV2ZXJzZVtyZXZlcnNlX3Njb3BlXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWFya2V0Rm9yKGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCk6IE1hcmtldCB7XG4gICAgICAgIHZhciBzY29wZSA9IHRoaXMuZ2V0U2NvcGVGb3IoY29tb2RpdHksIGN1cnJlbmN5KTtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFibGUoc2NvcGUpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0YWJsZUZvcihjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgpOiBNYXJrZXQge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwidGFibGVGb3IoKVwiLGNvbW9kaXR5LnN5bWJvbCxjdXJyZW5jeS5zeW1ib2wsXCIgREVQUkVDQVRFRFwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFya2V0Rm9yKGNvbW9kaXR5LCBjdXJyZW5jeSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZVJldmVyc2VUYWJsZUZvcihzY29wZTpzdHJpbmcpOiBNYXJrZXQge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiLCBzY29wZSk7XG4gICAgICAgIHZhciBjYW5vbmljYWwgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgdmFyIHJldmVyc2Vfc2NvcGUgPSB0aGlzLmludmVyc2VTY29wZShjYW5vbmljYWwpO1xuICAgICAgICB2YXIgdGFibGU6TWFya2V0ID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdO1xuXG4gICAgICAgIHZhciBpbnZlcnNlX2hpc3Rvcnk6SGlzdG9yeVR4W10gPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpIGluIHRhYmxlLmhpc3RvcnkpIHtcbiAgICAgICAgICAgIHZhciBoVHg6SGlzdG9yeVR4ID0ge1xuICAgICAgICAgICAgICAgIGlkOiB0YWJsZS5oaXN0b3J5W2ldLmlkLFxuICAgICAgICAgICAgICAgIHN0cjogXCJcIixcbiAgICAgICAgICAgICAgICBwcmljZTogdGFibGUuaGlzdG9yeVtpXS5pbnZlcnNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgaW52ZXJzZTogdGFibGUuaGlzdG9yeVtpXS5wcmljZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgIGFtb3VudDogdGFibGUuaGlzdG9yeVtpXS5wYXltZW50LmNsb25lKCksXG4gICAgICAgICAgICAgICAgcGF5bWVudDogdGFibGUuaGlzdG9yeVtpXS5hbW91bnQuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICBidXllcjogdGFibGUuaGlzdG9yeVtpXS5zZWxsZXIsXG4gICAgICAgICAgICAgICAgc2VsbGVyOiB0YWJsZS5oaXN0b3J5W2ldLmJ1eWVyLFxuICAgICAgICAgICAgICAgIGJ1eWZlZTogdGFibGUuaGlzdG9yeVtpXS5zZWxsZmVlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgc2VsbGZlZTogdGFibGUuaGlzdG9yeVtpXS5idXlmZWUuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICBkYXRlOiB0YWJsZS5oaXN0b3J5W2ldLmRhdGUsXG4gICAgICAgICAgICAgICAgaXNidXk6ICF0YWJsZS5oaXN0b3J5W2ldLmlzYnV5LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGhUeC5zdHIgPSBoVHgucHJpY2Uuc3RyICsgXCIgXCIgKyBoVHguYW1vdW50LnN0cjtcbiAgICAgICAgICAgIGludmVyc2VfaGlzdG9yeS5wdXNoKGhUeCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgXG4gICAgICAgIHZhciBpbnZlcnNlX29yZGVyczpUb2tlbk9yZGVycyA9IHtcbiAgICAgICAgICAgIGJ1eTogW10sIHNlbGw6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yICh2YXIgdHlwZSBpbiB7YnV5OlwiYnV5XCIsIHNlbGw6XCJzZWxsXCJ9KSB7XG4gICAgICAgICAgICB2YXIgcm93X29yZGVyczpPcmRlcltdO1xuICAgICAgICAgICAgdmFyIHJvd19vcmRlcjpPcmRlcjtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0YWJsZS5vcmRlcnNbdHlwZV0pIHtcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gdGFibGUub3JkZXJzW3R5cGVdW2ldO1xuXG4gICAgICAgICAgICAgICAgcm93X29yZGVycyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGo9MDsgajxyb3cub3JkZXJzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd19vcmRlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcG9zaXQ6IHJvdy5vcmRlcnNbal0uZGVwb3NpdC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJvdy5vcmRlcnNbal0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiByb3cub3JkZXJzW2pdLnByaWNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogcm93Lm9yZGVyc1tqXS5pbnZlcnNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcjogcm93Lm9yZGVyc1tqXS5vd25lcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbG9zOiByb3cub3JkZXJzW2pdLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IHJvdy5vcmRlcnNbal0udGVsb3NcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByb3dfb3JkZXJzLnB1c2gocm93X29yZGVyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgbmV3cm93Ok9yZGVyUm93ID0ge1xuICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiByb3cucHJpY2UuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiByb3dfb3JkZXJzLFxuICAgICAgICAgICAgICAgICAgICBvd25lcnM6IHJvdy5vd25lcnMsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlOiByb3cuaW52ZXJzZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICBzdHI6IHJvdy5pbnZlcnNlLnN0cixcbiAgICAgICAgICAgICAgICAgICAgc3VtOiByb3cuc3VtdGVsb3MuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgc3VtdGVsb3M6IHJvdy5zdW0uY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgdGVsb3M6IHJvdy50b3RhbC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogcm93LnRlbG9zLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgIC8vIGFtb3VudDogcm93LnN1bXRlbG9zLnRvdGFsKCksIC8vIDwtLSBleHRyYVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaW52ZXJzZV9vcmRlcnNbdHlwZV0ucHVzaChuZXdyb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJldmVyc2U6TWFya2V0ID0ge1xuICAgICAgICAgICAgc2NvcGU6IHJldmVyc2Vfc2NvcGUsXG4gICAgICAgICAgICBjb21vZGl0eTogdGFibGUuY3VycmVuY3ksXG4gICAgICAgICAgICBjdXJyZW5jeTogdGFibGUuY29tb2RpdHksXG4gICAgICAgICAgICBibG9jazogdGFibGUuYmxvY2ssXG4gICAgICAgICAgICBibG9ja2xpc3Q6IHRhYmxlLnJldmVyc2VibG9ja3MsXG4gICAgICAgICAgICByZXZlcnNlYmxvY2tzOiB0YWJsZS5ibG9ja2xpc3QsXG4gICAgICAgICAgICBibG9ja2xldmVsczogdGFibGUucmV2ZXJzZWxldmVscyxcbiAgICAgICAgICAgIHJldmVyc2VsZXZlbHM6IHRhYmxlLmJsb2NrbGV2ZWxzLFxuICAgICAgICAgICAgYmxvY2tzOiB0YWJsZS5ibG9ja3MsXG4gICAgICAgICAgICBkZWFsczogdGFibGUuZGVhbHMsXG4gICAgICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgICAgICBzZWxsOiB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOnRhYmxlLmhlYWRlci5idXkudG90YWwuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOnRhYmxlLmhlYWRlci5idXkub3JkZXJzXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBidXk6IHtcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6dGFibGUuaGVhZGVyLnNlbGwudG90YWwuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOnRhYmxlLmhlYWRlci5zZWxsLm9yZGVyc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoaXN0b3J5OiBpbnZlcnNlX2hpc3RvcnksXG4gICAgICAgICAgICBvcmRlcnM6IHtcbiAgICAgICAgICAgICAgICBzZWxsOiBpbnZlcnNlX29yZGVycy5idXksICAvLyA8PC0tIGVzdG8gZnVuY2lvbmEgYXPDg8KtIGNvbW8gZXN0w4PCoT9cbiAgICAgICAgICAgICAgICBidXk6IGludmVyc2Vfb3JkZXJzLnNlbGwgICAvLyA8PC0tIGVzdG8gZnVuY2lvbmEgYXPDg8KtIGNvbW8gZXN0w4PCoT9cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdW1tYXJ5OiB7XG4gICAgICAgICAgICAgICAgc2NvcGU6IHRoaXMuaW52ZXJzZVNjb3BlKHRhYmxlLnN1bW1hcnkuc2NvcGUpLFxuICAgICAgICAgICAgICAgIHByaWNlOiB0YWJsZS5zdW1tYXJ5LmludmVyc2UsXG4gICAgICAgICAgICAgICAgcHJpY2VfMjRoX2FnbzogdGFibGUuc3VtbWFyeS5pbnZlcnNlXzI0aF9hZ28sXG4gICAgICAgICAgICAgICAgaW52ZXJzZTogdGFibGUuc3VtbWFyeS5wcmljZSxcbiAgICAgICAgICAgICAgICBpbnZlcnNlXzI0aF9hZ286IHRhYmxlLnN1bW1hcnkucHJpY2VfMjRoX2FnbyxcbiAgICAgICAgICAgICAgICBtYXhfaW52ZXJzZTogdGFibGUuc3VtbWFyeS5tYXhfcHJpY2UsXG4gICAgICAgICAgICAgICAgbWF4X3ByaWNlOiB0YWJsZS5zdW1tYXJ5Lm1heF9pbnZlcnNlLFxuICAgICAgICAgICAgICAgIG1pbl9pbnZlcnNlOiB0YWJsZS5zdW1tYXJ5Lm1pbl9wcmljZSxcbiAgICAgICAgICAgICAgICBtaW5fcHJpY2U6IHRhYmxlLnN1bW1hcnkubWluX2ludmVyc2UsXG4gICAgICAgICAgICAgICAgcmVjb3JkczogdGFibGUuc3VtbWFyeS5yZWNvcmRzLFxuICAgICAgICAgICAgICAgIHZvbHVtZTogdGFibGUuc3VtbWFyeS5hbW91bnQsXG4gICAgICAgICAgICAgICAgYW1vdW50OiB0YWJsZS5zdW1tYXJ5LnZvbHVtZSxcbiAgICAgICAgICAgICAgICBwZXJjZW50OiB0YWJsZS5zdW1tYXJ5LmlwZXJjZW50LFxuICAgICAgICAgICAgICAgIGlwZXJjZW50OiB0YWJsZS5zdW1tYXJ5LnBlcmNlbnQsXG4gICAgICAgICAgICAgICAgcGVyY2VudF9zdHI6IHRhYmxlLnN1bW1hcnkuaXBlcmNlbnRfc3RyLFxuICAgICAgICAgICAgICAgIGlwZXJjZW50X3N0cjogdGFibGUuc3VtbWFyeS5wZXJjZW50X3N0cixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eDogdGFibGUudHhcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV2ZXJzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0U2NvcGVGb3IoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYKSB7XG4gICAgICAgIGlmICghY29tb2RpdHkgfHwgIWN1cnJlbmN5KSByZXR1cm4gXCJcIjtcbiAgICAgICAgcmV0dXJuIGNvbW9kaXR5LnN5bWJvbC50b0xvd2VyQ2FzZSgpICsgXCIuXCIgKyBjdXJyZW5jeS5zeW1ib2wudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW52ZXJzZVNjb3BlKHNjb3BlOnN0cmluZykge1xuICAgICAgICBpZiAoIXNjb3BlKSByZXR1cm4gc2NvcGU7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KHR5cGVvZiBzY29wZSA9PVwic3RyaW5nXCIsIFwiRVJST1I6IHN0cmluZyBzY29wZSBleHBlY3RlZCwgZ290IFwiLCB0eXBlb2Ygc2NvcGUsIHNjb3BlKTtcbiAgICAgICAgdmFyIHBhcnRzID0gc2NvcGUuc3BsaXQoXCIuXCIpO1xuICAgICAgICBjb25zb2xlLmFzc2VydChwYXJ0cy5sZW5ndGggPT0gMiwgXCJFUlJPUjogc2NvcGUgZm9ybWF0IGV4cGVjdGVkIGlzIHh4eC55eXksIGdvdDogXCIsIHR5cGVvZiBzY29wZSwgc2NvcGUpO1xuICAgICAgICB2YXIgaW52ZXJzZSA9IHBhcnRzWzFdICsgXCIuXCIgKyBwYXJ0c1swXTtcbiAgICAgICAgcmV0dXJuIGludmVyc2U7XG4gICAgfVxuXG4gICAgcHVibGljIGNhbm9uaWNhbFNjb3BlKHNjb3BlOnN0cmluZykge1xuICAgICAgICBpZiAoIXNjb3BlKSByZXR1cm4gc2NvcGU7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KHR5cGVvZiBzY29wZSA9PVwic3RyaW5nXCIsIFwiRVJST1I6IHN0cmluZyBzY29wZSBleHBlY3RlZCwgZ290IFwiLCB0eXBlb2Ygc2NvcGUsIHNjb3BlKTtcbiAgICAgICAgdmFyIHBhcnRzID0gc2NvcGUuc3BsaXQoXCIuXCIpO1xuICAgICAgICBjb25zb2xlLmFzc2VydChwYXJ0cy5sZW5ndGggPT0gMiwgXCJFUlJPUjogc2NvcGUgZm9ybWF0IGV4cGVjdGVkIGlzIHh4eC55eXksIGdvdDogXCIsIHR5cGVvZiBzY29wZSwgc2NvcGUpO1xuICAgICAgICB2YXIgaW52ZXJzZSA9IHBhcnRzWzFdICsgXCIuXCIgKyBwYXJ0c1swXTtcbiAgICAgICAgaWYgKHBhcnRzWzFdID09IFwidGxvc1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NvcGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcnRzWzBdID09IFwidGxvc1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gaW52ZXJzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFydHNbMF0gPCBwYXJ0c1sxXSkge1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGludmVyc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG5cbiAgICBwdWJsaWMgaXNDYW5vbmljYWwoc2NvcGU6c3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKSA9PSBzY29wZTtcbiAgICB9XG5cbiAgICBcbiAgICBcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEdldHRlcnMgXG5cbiAgICBnZXRCYWxhbmNlKHRva2VuOlRva2VuREVYKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5iYWxhbmNlcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYmFsYW5jZXNbaV0udG9rZW4uc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJhbGFuY2VzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQXNzZXRERVgoXCIwIFwiICsgdG9rZW4uc3ltYm9sLCB0aGlzKTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRTb21lRnJlZUZha2VUb2tlbnMoc3ltYm9sOnN0cmluZyA9IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVguZ2V0U29tZUZyZWVGYWtlVG9rZW5zKClcIik7XG4gICAgICAgIHZhciBfdG9rZW4gPSBzeW1ib2w7ICAgIFxuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImZyZWVmYWtlLVwiK190b2tlbiB8fCBcInRva2VuXCIsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5TdGF0cy50aGVuKF8gPT4ge1xuICAgICAgICAgICAgdmFyIHRva2VuID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBjb3VudHMgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPDEwMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50b2tlbnNbaV0uc3ltYm9sID09IHN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRva2Vuc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICB2YXIgcmFuZG9tID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpLCBcIlJhbmRvbTogXCIsIHJhbmRvbSk7XG4gICAgICAgICAgICAgICAgaWYgKCF0b2tlbiAmJiByYW5kb20gPiAwLjUpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRva2Vuc1tpICUgdGhpcy50b2tlbnMubGVuZ3RoXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuLmZha2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmRvbSA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmFuZG9tID4gMC41KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRlbG9zO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGk8MTAwICYmIHRva2VuICYmIHRoaXMuZ2V0QmFsYW5jZSh0b2tlbikuYW1vdW50LnRvTnVtYmVyKCkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpLCBcInRva2VuOiBcIiwgdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhbmRvbSA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtb250byA9IE1hdGguZmxvb3IoMTAwMDAgKiByYW5kb20pIC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcXVhbnRpdHkgPSBuZXcgQXNzZXRERVgoXCJcIiArIG1vbnRvICsgXCIgXCIgKyB0b2tlbi5zeW1ib2wgLHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWVtbyA9IFwieW91IGdldCBcIiArIHF1YW50aXR5LnZhbHVlVG9TdHJpbmcoKSsgXCIgZnJlZSBmYWtlIFwiICsgdG9rZW4uc3ltYm9sICsgXCIgdG9rZW5zIHRvIHBsYXkgb24gdmFwYWVlLmlvIERFWFwiO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5leGNlY3V0ZShcImlzc3VlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiAgdGhpcy5zY2F0dGVyLmFjY291bnQubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiBxdWFudGl0eS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVtbzogbWVtb1xuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRCYWxhbmNlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJmcmVlZmFrZS1cIitfdG9rZW4gfHwgXCJ0b2tlblwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWVtbztcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImZyZWVmYWtlLVwiK190b2tlbiB8fCBcInRva2VuXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICAgICAgICAgIH0pOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZ2V0VG9rZW5Ob3coc3ltOnN0cmluZyk6IFRva2VuREVYIHtcbiAgICAgICAgaWYgKCFzeW0pIHJldHVybiBudWxsO1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMudG9rZW5zKSB7XG4gICAgICAgICAgICAvLyB0aGVyZSdzIGEgbGl0dGxlIGJ1Zy4gVGhpcyBpcyBhIGp1c3RhICB3b3JrIGFycm91bmRcbiAgICAgICAgICAgIGlmICh0aGlzLnRva2Vuc1tpXS5zeW1ib2wudG9VcHBlckNhc2UoKSA9PSBcIlRMT1NcIiAmJiB0aGlzLnRva2Vuc1tpXS5vZmZjaGFpbikge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgc29sdmVzIGF0dGFjaGluZyB3cm9uZyB0bG9zIHRva2VuIHRvIGFzc2V0XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodGhpcy50b2tlbnNbaV0uc3ltYm9sLnRvVXBwZXJDYXNlKCkgPT0gc3ltLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0VG9rZW4oc3ltOnN0cmluZyk6IFByb21pc2U8VG9rZW5ERVg+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKF8gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VG9rZW5Ob3coc3ltKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0RGVwb3NpdHMoYWNjb3VudDpzdHJpbmcgPSBudWxsKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVguZ2V0RGVwb3NpdHMoKVwiKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0c1wiLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIGRlcG9zaXRzOiBBc3NldERFWFtdID0gW107XG4gICAgICAgICAgICBpZiAoIWFjY291bnQgJiYgdGhpcy5jdXJyZW50Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICBhY2NvdW50ID0gdGhpcy5jdXJyZW50Lm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYWNjb3VudCkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBhd2FpdCB0aGlzLmZldGNoRGVwb3NpdHMoYWNjb3VudCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiByZXN1bHQucm93cykge1xuICAgICAgICAgICAgICAgICAgICBkZXBvc2l0cy5wdXNoKG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5hbW91bnQsIHRoaXMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRlcG9zaXRzID0gZGVwb3NpdHM7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImRlcG9zaXRzXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlcG9zaXRzO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRCYWxhbmNlcyhhY2NvdW50OnN0cmluZyA9IG51bGwpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5nZXRCYWxhbmNlcygpXCIpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJhbGFuY2VzXCIsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgX2JhbGFuY2VzOiBBc3NldERFWFtdO1xuICAgICAgICAgICAgaWYgKCFhY2NvdW50ICYmIHRoaXMuY3VycmVudC5uYW1lKSB7XG4gICAgICAgICAgICAgICAgYWNjb3VudCA9IHRoaXMuY3VycmVudC5uYW1lO1xuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGFjY291bnQpIHtcbiAgICAgICAgICAgICAgICBfYmFsYW5jZXMgPSBhd2FpdCB0aGlzLmZldGNoQmFsYW5jZXMoYWNjb3VudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJhbGFuY2VzID0gX2JhbGFuY2VzO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWVERVggYmFsYW5jZXMgdXBkYXRlZFwiKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYmFsYW5jZXNcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFsYW5jZXM7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGdldFRoaXNTZWxsT3JkZXJzKHRhYmxlOnN0cmluZywgaWRzOm51bWJlcltdKTogUHJvbWlzZTxhbnlbXT4ge1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInRoaXNvcmRlcnNcIiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gaWRzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gaWRzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBnb3RpdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbal0uaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvdGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChnb3RpdCkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHJlczpUYWJsZVJlc3VsdCA9IGF3YWl0IHRoaXMuZmV0Y2hPcmRlcnMoe3Njb3BlOnRhYmxlLCBsaW1pdDoxLCBsb3dlcl9ib3VuZDppZC50b1N0cmluZygpfSk7XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuY29uY2F0KHJlcy5yb3dzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidGhpc29yZGVyc1wiLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTsgICAgXG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0VXNlck9yZGVycyhhY2NvdW50OnN0cmluZyA9IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVguZ2V0VXNlck9yZGVycygpXCIpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInVzZXJvcmRlcnNcIiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciB1c2Vyb3JkZXJzOiBUYWJsZVJlc3VsdDtcbiAgICAgICAgICAgIGlmICghYWNjb3VudCAmJiB0aGlzLmN1cnJlbnQubmFtZSkge1xuICAgICAgICAgICAgICAgIGFjY291bnQgPSB0aGlzLmN1cnJlbnQubmFtZTtcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChhY2NvdW50KSB7XG4gICAgICAgICAgICAgICAgdXNlcm9yZGVycyA9IGF3YWl0IHRoaXMuZmV0Y2hVc2VyT3JkZXJzKGFjY291bnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGxpc3Q6IFVzZXJPcmRlcnNbXSA9IDxVc2VyT3JkZXJzW10+dXNlcm9yZGVycy5yb3dzO1xuICAgICAgICAgICAgdmFyIG1hcDogVXNlck9yZGVyc01hcCA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaWRzID0gbGlzdFtpXS5pZHM7XG4gICAgICAgICAgICAgICAgdmFyIHRhYmxlID0gbGlzdFtpXS50YWJsZTtcbiAgICAgICAgICAgICAgICB2YXIgb3JkZXJzID0gYXdhaXQgdGhpcy5nZXRUaGlzU2VsbE9yZGVycyh0YWJsZSwgaWRzKTtcbiAgICAgICAgICAgICAgICBtYXBbdGFibGVdID0ge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZTogdGFibGUsXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyczogdGhpcy5hdXhQcm9jZXNzUm93c1RvT3JkZXJzKG9yZGVycyksXG4gICAgICAgICAgICAgICAgICAgIGlkczppZHNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy51c2Vyb3JkZXJzID0gbWFwO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy51c2Vyb3JkZXJzKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidXNlcm9yZGVyc1wiLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51c2Vyb3JkZXJzO1xuICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGVBY3Rpdml0eSgpIHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJhY3Rpdml0eVwiLCB0cnVlKTtcbiAgICAgICAgdmFyIHBhZ2VzaXplID0gdGhpcy5hY3Rpdml0eVBhZ2VzaXplO1xuICAgICAgICB2YXIgcGFnZXMgPSBhd2FpdCB0aGlzLmdldEFjdGl2aXR5VG90YWxQYWdlcyhwYWdlc2l6ZSk7XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hBY3Rpdml0eShwYWdlcy0yLCBwYWdlc2l6ZSksXG4gICAgICAgICAgICB0aGlzLmZldGNoQWN0aXZpdHkocGFnZXMtMSwgcGFnZXNpemUpLFxuICAgICAgICAgICAgdGhpcy5mZXRjaEFjdGl2aXR5KHBhZ2VzLTAsIHBhZ2VzaXplKVxuICAgICAgICBdKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJhY3Rpdml0eVwiLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZE1vcmVBY3Rpdml0eSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZpdHkubGlzdC5sZW5ndGggPT0gMCkgcmV0dXJuO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImFjdGl2aXR5XCIsIHRydWUpO1xuICAgICAgICB2YXIgcGFnZXNpemUgPSB0aGlzLmFjdGl2aXR5UGFnZXNpemU7XG4gICAgICAgIHZhciBmaXJzdCA9IHRoaXMuYWN0aXZpdHkubGlzdFt0aGlzLmFjdGl2aXR5Lmxpc3QubGVuZ3RoLTFdO1xuICAgICAgICB2YXIgaWQgPSBmaXJzdC5pZCAtIHBhZ2VzaXplO1xuICAgICAgICB2YXIgcGFnZSA9IE1hdGguZmxvb3IoKGlkLTEpIC8gcGFnZXNpemUpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuZmV0Y2hBY3Rpdml0eShwYWdlLCBwYWdlc2l6ZSk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYWN0aXZpdHlcIiwgZmFsc2UpO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZVRyYWRlKGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCwgdXBkYXRlVXNlcjpib29sZWFuID0gdHJ1ZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnVwZGF0ZVRyYWRlKClcIik7XG4gICAgICAgIHZhciBjaHJvbm9fa2V5ID0gXCJ1cGRhdGVUcmFkZVwiO1xuICAgICAgICB0aGlzLmZlZWQuc3RhcnRDaHJvbm8oY2hyb25vX2tleSk7XG5cbiAgICAgICAgaWYodXBkYXRlVXNlcikgdGhpcy51cGRhdGVDdXJyZW50VXNlcigpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGhpcy5nZXRUcmFuc2FjdGlvbkhpc3RvcnkoY29tb2RpdHksIGN1cnJlbmN5LCAtMSwgLTEsIHRydWUpLnRoZW4oXyA9PiB0aGlzLmZlZWQuc2V0TWFyY2soY2hyb25vX2tleSwgXCJnZXRUcmFuc2FjdGlvbkhpc3RvcnkoKVwiKSksXG4gICAgICAgICAgICB0aGlzLmdldEJsb2NrSGlzdG9yeShjb21vZGl0eSwgY3VycmVuY3ksIC0xLCAtMSwgdHJ1ZSkudGhlbihfID0+IHRoaXMuZmVlZC5zZXRNYXJjayhjaHJvbm9fa2V5LCBcImdldEJsb2NrSGlzdG9yeSgpXCIpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0U2VsbE9yZGVycyhjb21vZGl0eSwgY3VycmVuY3ksIHRydWUpLnRoZW4oXyA9PiB0aGlzLmZlZWQuc2V0TWFyY2soY2hyb25vX2tleSwgXCJnZXRTZWxsT3JkZXJzKClcIikpLFxuICAgICAgICAgICAgdGhpcy5nZXRCdXlPcmRlcnMoY29tb2RpdHksIGN1cnJlbmN5LCB0cnVlKS50aGVuKF8gPT4gdGhpcy5mZWVkLnNldE1hcmNrKGNocm9ub19rZXksIFwiZ2V0QnV5T3JkZXJzKClcIikpLFxuICAgICAgICAgICAgdGhpcy5nZXRUYWJsZVN1bW1hcnkoY29tb2RpdHksIGN1cnJlbmN5LCB0cnVlKS50aGVuKF8gPT4gdGhpcy5mZWVkLnNldE1hcmNrKGNocm9ub19rZXksIFwiZ2V0VGFibGVTdW1tYXJ5KClcIikpLFxuICAgICAgICAgICAgdGhpcy5nZXRPcmRlclN1bW1hcnkoKS50aGVuKF8gPT4gdGhpcy5mZWVkLnNldE1hcmNrKGNocm9ub19rZXksIFwiZ2V0T3JkZXJTdW1tYXJ5KClcIikpLFxuICAgICAgICBdKS50aGVuKHIgPT4ge1xuICAgICAgICAgICAgdGhpcy5fcmV2ZXJzZSA9IHt9O1xuICAgICAgICAgICAgdGhpcy5yZXNvcnRUb2tlbnMoKTtcbiAgICAgICAgICAgIC8vIHRoaXMuZmVlZC5wcmludENocm9ubyhjaHJvbm9fa2V5KTtcbiAgICAgICAgICAgIHRoaXMub25UcmFkZVVwZGF0ZWQubmV4dChudWxsKTtcbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGVDdXJyZW50VXNlcigpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC51cGRhdGVDdXJyZW50VXNlcigpXCIpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImN1cnJlbnRcIiwgdHJ1ZSk7ICAgICAgICBcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMuZ2V0VXNlck9yZGVycygpLFxuICAgICAgICAgICAgdGhpcy5nZXREZXBvc2l0cygpLFxuICAgICAgICAgICAgdGhpcy5nZXRCYWxhbmNlcygpXG4gICAgICAgIF0pLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImN1cnJlbnRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIF87XG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjdXJyZW50XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0QmxvY2tIaXN0b3J5VG90YWxQYWdlc0ZvcihzY29wZTpzdHJpbmcsIHBhZ2VzaXplOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9tYXJrZXRzKSByZXR1cm4gMDtcbiAgICAgICAgdmFyIG1hcmtldCA9IHRoaXMubWFya2V0KHNjb3BlKTtcbiAgICAgICAgaWYgKCFtYXJrZXQpIHJldHVybiAwO1xuICAgICAgICB2YXIgdG90YWwgPSBtYXJrZXQuYmxvY2tzO1xuICAgICAgICB2YXIgbW9kID0gdG90YWwgJSBwYWdlc2l6ZTtcbiAgICAgICAgdmFyIGRpZiA9IHRvdGFsIC0gbW9kO1xuICAgICAgICB2YXIgcGFnZXMgPSBkaWYgLyBwYWdlc2l6ZTtcbiAgICAgICAgaWYgKG1vZCA+IDApIHtcbiAgICAgICAgICAgIHBhZ2VzICs9MTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImdldEJsb2NrSGlzdG9yeVRvdGFsUGFnZXNGb3IoKSB0b3RhbDpcIiwgdG90YWwsIFwiIHBhZ2VzOlwiLCBwYWdlcyk7XG4gICAgICAgIHJldHVybiBwYWdlcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEhpc3RvcnlUb3RhbFBhZ2VzRm9yKHNjb3BlOnN0cmluZywgcGFnZXNpemU6IG51bWJlcikge1xuICAgICAgICBpZiAoIXRoaXMuX21hcmtldHMpIHJldHVybiAwO1xuICAgICAgICB2YXIgbWFya2V0ID0gdGhpcy5tYXJrZXQoc2NvcGUpO1xuICAgICAgICBpZiAoIW1hcmtldCkgcmV0dXJuIDA7XG4gICAgICAgIHZhciB0b3RhbCA9IG1hcmtldC5kZWFscztcbiAgICAgICAgdmFyIG1vZCA9IHRvdGFsICUgcGFnZXNpemU7XG4gICAgICAgIHZhciBkaWYgPSB0b3RhbCAtIG1vZDtcbiAgICAgICAgdmFyIHBhZ2VzID0gZGlmIC8gcGFnZXNpemU7XG4gICAgICAgIGlmIChtb2QgPiAwKSB7XG4gICAgICAgICAgICBwYWdlcyArPTE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZ2VzO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZ2V0QWN0aXZpdHlUb3RhbFBhZ2VzKHBhZ2VzaXplOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJldmVudHNcIiwge1xuICAgICAgICAgICAgbGltaXQ6IDFcbiAgICAgICAgfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHJlc3VsdC5yb3dzWzBdLnBhcmFtcztcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IHBhcnNlSW50KHBhcmFtcy5zcGxpdChcIiBcIilbMF0pLTE7XG4gICAgICAgICAgICB2YXIgbW9kID0gdG90YWwgJSBwYWdlc2l6ZTtcbiAgICAgICAgICAgIHZhciBkaWYgPSB0b3RhbCAtIG1vZDtcbiAgICAgICAgICAgIHZhciBwYWdlcyA9IGRpZiAvIHBhZ2VzaXplO1xuICAgICAgICAgICAgaWYgKG1vZCA+IDApIHtcbiAgICAgICAgICAgICAgICBwYWdlcyArPTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFjdGl2aXR5LnRvdGFsID0gdG90YWw7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5nZXRBY3Rpdml0eVRvdGFsUGFnZXMoKSB0b3RhbDogXCIsIHRvdGFsLCBcIiBwYWdlczogXCIsIHBhZ2VzKTtcbiAgICAgICAgICAgIHJldHVybiBwYWdlcztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0VHJhbnNhY3Rpb25IaXN0b3J5KGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCwgcGFnZTpudW1iZXIgPSAtMSwgcGFnZXNpemU6bnVtYmVyID0gLTEsIGZvcmNlOmJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHZhciBzY29wZTpzdHJpbmcgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHRoaXMuZ2V0U2NvcGVGb3IoY29tb2RpdHksIGN1cnJlbmN5KSk7XG4gICAgICAgIHZhciBhdXggPSBudWxsO1xuICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJoaXN0b3J5LlwiK3Njb3BlLCB0cnVlKTtcbiAgICAgICAgYXV4ID0gdGhpcy53YWl0T3JkZXJTdW1tYXJ5LnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICBpZiAocGFnZXNpemUgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBwYWdlc2l6ZSA9IDEwOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYWdlID09IC0xKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhZ2VzID0gdGhpcy5nZXRIaXN0b3J5VG90YWxQYWdlc0ZvcihzY29wZSwgcGFnZXNpemUpO1xuICAgICAgICAgICAgICAgIHBhZ2UgPSBwYWdlcy0zO1xuICAgICAgICAgICAgICAgIGlmIChwYWdlIDwgMCkgcGFnZSA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaEhpc3Rvcnkoc2NvcGUsIHBhZ2UrMCwgcGFnZXNpemUpLFxuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hIaXN0b3J5KHNjb3BlLCBwYWdlKzEsIHBhZ2VzaXplKSxcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoSGlzdG9yeShzY29wZSwgcGFnZSsyLCBwYWdlc2l6ZSlcbiAgICAgICAgICAgIF0pLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJoaXN0b3J5LlwiK3Njb3BlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFya2V0KHNjb3BlKS5oaXN0b3J5O1xuICAgICAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJoaXN0b3J5LlwiK3Njb3BlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5tYXJrZXQoc2NvcGUpICYmICFmb3JjZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5tYXJrZXQoc2NvcGUpLmhpc3Rvcnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhdXg7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uSGlzdG9yeUNoYW5nZS5uZXh0KHJlc3VsdCk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGF1eEhvdXJUb0xhYmVsKGhvdXI6bnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShob3VyICogMTAwMCAqIDYwICogNjApO1xuICAgICAgICB2YXIgbGFiZWwgPSBkLmdldEhvdXJzKCkgPT0gMCA/IHRoaXMuZGF0ZVBpcGUudHJhbnNmb3JtKGQsICdkZC9NTScpIDogZC5nZXRIb3VycygpICsgXCJoXCI7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbGFiZWw7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QmxvY2tIaXN0b3J5KGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCwgcGFnZTpudW1iZXIgPSAtMSwgcGFnZXNpemU6bnVtYmVyID0gLTEsIGZvcmNlOmJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldEJsb2NrSGlzdG9yeSgpXCIsIGNvbW9kaXR5LnN5bWJvbCwgcGFnZSwgcGFnZXNpemUpO1xuICAgICAgICAvLyAvLyBlbGFwc2VkIHRpbWVcbiAgICAgICAgLy8gdmFyIHN0YXJ0VGltZTpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgLy8gdmFyIGRpZmY6bnVtYmVyO1xuICAgICAgICAvLyB2YXIgc2VjOm51bWJlcjtcblxuICAgICAgICB2YXIgc2NvcGU6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZSh0aGlzLmdldFNjb3BlRm9yKGNvbW9kaXR5LCBjdXJyZW5jeSkpO1xuICAgICAgICB2YXIgYXV4ID0gbnVsbDtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYmxvY2staGlzdG9yeS5cIitzY29wZSwgdHJ1ZSk7XG5cbiAgICAgICAgYXV4ID0gdGhpcy53YWl0T3JkZXJTdW1tYXJ5LnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgZmV0Y2hCbG9ja0hpc3RvcnlTdGFydDpEYXRlID0gbmV3IERhdGUoKTtcblxuICAgICAgICAgICAgaWYgKHBhZ2VzaXplID09IC0xKSB7XG4gICAgICAgICAgICAgICAgcGFnZXNpemUgPSAxMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYWdlID09IC0xKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhZ2VzID0gdGhpcy5nZXRCbG9ja0hpc3RvcnlUb3RhbFBhZ2VzRm9yKHNjb3BlLCBwYWdlc2l6ZSk7XG4gICAgICAgICAgICAgICAgcGFnZSA9IHBhZ2VzLTM7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UgPCAwKSBwYWdlID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwcm9taXNlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPD1wYWdlczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByb21pc2UgPSB0aGlzLmZldGNoQmxvY2tIaXN0b3J5KHNjb3BlLCBpLCBwYWdlc2l6ZSk7XG4gICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgICAgIC8vIC8vIGVsYXBzZWQgdGltZVxuICAgICAgICAgICAgICAgIC8vIHZhciBmZXRjaEJsb2NrSGlzdG9yeVRpbWU6RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgLy8gZGlmZiA9IGZldGNoQmxvY2tIaXN0b3J5VGltZS5nZXRUaW1lKCkgLSBmZXRjaEJsb2NrSGlzdG9yeVN0YXJ0LmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAvLyBzZWMgPSBkaWZmIC8gMTAwMDtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqIFZhcGFlZURFWC5nZXRCbG9ja0hpc3RvcnkoKSBmZXRjaEJsb2NrSGlzdG9yeVRpbWUgc2VjOiBcIiwgc2VjLCBcIihcIixkaWZmLFwiKVwiKTtcblxuXG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJibG9jay1oaXN0b3J5LlwiK3Njb3BlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgdmFyIG1hcmtldDogTWFya2V0ID0gdGhpcy5tYXJrZXQoc2NvcGUpO1xuICAgICAgICAgICAgICAgIG1hcmtldC5ibG9ja2xpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICBtYXJrZXQucmV2ZXJzZWJsb2NrcyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIHZhciBob3JhID0gMTAwMCAqIDYwICogNjA7XG4gICAgICAgICAgICAgICAgdmFyIGhvdXIgPSBNYXRoLmZsb29yKG5vdy5nZXRUaW1lKCkvaG9yYSk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItPlwiLCBob3VyKTtcbiAgICAgICAgICAgICAgICB2YXIgbGFzdF9ibG9jayA9IG51bGw7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RfaG91ciA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICB2YXIgb3JkZXJlZF9ibG9ja3MgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG1hcmtldC5ibG9jaykge1xuICAgICAgICAgICAgICAgICAgICBvcmRlcmVkX2Jsb2Nrcy5wdXNoKG1hcmtldC5ibG9ja1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgb3JkZXJlZF9ibG9ja3Muc29ydChmdW5jdGlvbihhOkhpc3RvcnlCbG9jaywgYjpIaXN0b3J5QmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoYS5ob3VyIDwgYi5ob3VyKSByZXR1cm4gLTExO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG9yZGVyZWRfYmxvY2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBibG9jazpIaXN0b3J5QmxvY2sgPSBvcmRlcmVkX2Jsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gdGhpcy5hdXhIb3VyVG9MYWJlbChibG9jay5ob3VyKTtcbiAgICAgICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItPlwiLCBpLCBsYWJlbCwgYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0ZSA9IGJsb2NrLmRhdGU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaWYgPSBub3cuZ2V0VGltZSgpIC0gYmxvY2suZGF0ZS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtZXMgPSAzMCAqIDI0ICogaG9yYTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsYXBzZWRfbW9udGhzID0gZGlmIC8gbWVzO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxhcHNlZF9tb250aHMgPiAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRyb3BwaW5nIGJsb2NrIHRvbyBvbGRcIiwgW2Jsb2NrLCBibG9jay5kYXRlLnRvVVRDU3RyaW5nKCldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RfYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaWYgPSBibG9jay5ob3VyIC0gbGFzdF9ibG9jay5ob3VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaj0xOyBqPGRpZjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsX2kgPSB0aGlzLmF1eEhvdXJUb0xhYmVsKGxhc3RfYmxvY2suaG91citqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tPlwiLCBqLCBsYWJlbF9pLCBibG9jayk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25pbmljYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IGxhc3RfYmxvY2sucHJpY2UuYW1vdW50LnRvTnVtYmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF1eCA9IFtsYWJlbF9pLCBwcmljZSwgcHJpY2UsIHByaWNlLCBwcmljZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFya2V0LmJsb2NrbGlzdC5wdXNoKGF1eCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV2ZXJzZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGludmVyc2UgPSBsYXN0X2Jsb2NrLmludmVyc2UuYW1vdW50LnRvTnVtYmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF1eCA9IFtsYWJlbF9pLCBpbnZlcnNlLCBpbnZlcnNlLCBpbnZlcnNlLCBpbnZlcnNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXQucmV2ZXJzZWJsb2Nrcy5wdXNoKGF1eCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIG9iajphbnlbXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uaW5pY2FsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgb2JqID0gW2xhYmVsXTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goYmxvY2subWF4LmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goYmxvY2suZW50cmFuY2UuYW1vdW50LnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICBvYmoucHVzaChibG9jay5wcmljZS5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKGJsb2NrLm1pbi5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtldC5ibG9ja2xpc3QucHVzaChvYmopO1xuICAgICAgICAgICAgICAgICAgICAvLyByZXZlcnNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgb2JqID0gW2xhYmVsXTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goMS4wL2Jsb2NrLm1heC5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKDEuMC9ibG9jay5lbnRyYW5jZS5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKDEuMC9ibG9jay5wcmljZS5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKDEuMC9ibG9jay5taW4uYW1vdW50LnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXQucmV2ZXJzZWJsb2Nrcy5wdXNoKG9iaik7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RfYmxvY2sgPSBibG9jaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobGFzdF9ibG9jayAmJiBob3VyICE9IGxhc3RfYmxvY2suaG91cikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGlmID0gaG91ciAtIGxhc3RfYmxvY2suaG91cjtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaj0xOyBqPD1kaWY7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsX2kgPSB0aGlzLmF1eEhvdXJUb0xhYmVsKGxhc3RfYmxvY2suaG91citqKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uaW5pY2FsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IGxhc3RfYmxvY2sucHJpY2UuYW1vdW50LnRvTnVtYmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXV4ID0gW2xhYmVsX2ksIHByaWNlLCBwcmljZSwgcHJpY2UsIHByaWNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtldC5ibG9ja2xpc3QucHVzaChhdXgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZXZlcnNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnZlcnNlID0gbGFzdF9ibG9jay5pbnZlcnNlLmFtb3VudC50b051bWJlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF1eCA9IFtsYWJlbF9pLCBpbnZlcnNlLCBpbnZlcnNlLCBpbnZlcnNlLCBpbnZlcnNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtldC5yZXZlcnNlYmxvY2tzLnB1c2goYXV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIC8vIGVsYXBzZWQgdGltZVxuICAgICAgICAgICAgICAgIC8vIHZhciBmaXJzdExldmVsVGltZTpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAvLyBkaWZmID0gZmlyc3RMZXZlbFRpbWUuZ2V0VGltZSgpIC0gZmV0Y2hCbG9ja0hpc3RvcnlUaW1lLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAvLyBzZWMgPSBkaWZmIC8gMTAwMDtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqIFZhcGFlZURFWC5nZXRCbG9ja0hpc3RvcnkoKSBmaXJzdExldmVsVGltZSBzZWM6IFwiLCBzZWMsIFwiKFwiLGRpZmYsXCIpXCIpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0+XCIsIG1hcmtldC5ibG9ja2xpc3QpO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMub25CbG9ja2xpc3RDaGFuZ2UubmV4dChtYXJrZXQuYmxvY2tsaXN0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFya2V0O1xuICAgICAgICAgICAgfSkudGhlbihtYXJrZXQgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgICAgIC8vIC8vIGVsYXBzZWQgdGltZVxuICAgICAgICAgICAgICAgIC8vIHZhciBhbGxMZXZlbHNTdGFydDpEYXRlID0gbmV3IERhdGUoKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIGxpbWl0ID0gMjU2O1xuICAgICAgICAgICAgICAgIHZhciBsZXZlbHMgPSBbbWFya2V0LmJsb2NrbGlzdF07XG4gICAgICAgICAgICAgICAgdmFyIHJldmVyc2VzID0gW21hcmtldC5yZXZlcnNlYmxvY2tzXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBjdXJyZW50ID0gMDsgbGV2ZWxzW2N1cnJlbnRdLmxlbmd0aCA+IGxpbWl0OyBjdXJyZW50KyspIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coY3VycmVudCAsbGV2ZWxzW2N1cnJlbnRdLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdsZXZlbDphbnlbXVtdID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdyZXZlcnNlOmFueVtdW10gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lcmdlZDphbnlbXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bGV2ZWxzW2N1cnJlbnRdLmxlbmd0aDsgaSs9Mikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2Fub25pY2FsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdl8xOmFueVtdID0gbGV2ZWxzW2N1cnJlbnRdW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZfMiA9IGxldmVsc1tjdXJyZW50XVtpKzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1lcmdlZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeD0wOyB4PDU7IHgrKykgbWVyZ2VkW3hdID0gdl8xW3hdOyAvLyBjbGVhbiBjb3B5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodl8yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzBdID0gdl8xWzBdLnNwbGl0KFwiL1wiKS5sZW5ndGggPiAxID8gdl8xWzBdIDogdl8yWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFsxXSA9IE1hdGgubWF4KHZfMVsxXSwgdl8yWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbMl0gPSB2XzFbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzNdID0gdl8yWzNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFs0XSA9IE1hdGgubWluKHZfMVs0XSwgdl8yWzRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld2xldmVsLnB1c2gobWVyZ2VkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV2ZXJzZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZfMSA9IHJldmVyc2VzW2N1cnJlbnRdW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdl8yID0gcmV2ZXJzZXNbY3VycmVudF1baSsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeD0wOyB4PDU7IHgrKykgbWVyZ2VkW3hdID0gdl8xW3hdOyAvLyBjbGVhbiBjb3B5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodl8yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzBdID0gdl8xWzBdLnNwbGl0KFwiL1wiKS5sZW5ndGggPiAxID8gdl8xWzBdIDogdl8yWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFsxXSA9IE1hdGgubWluKHZfMVsxXSwgdl8yWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbMl0gPSB2XzFbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzNdID0gdl8yWzNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFs0XSA9IE1hdGgubWF4KHZfMVs0XSwgdl8yWzRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdyZXZlcnNlLnB1c2gobWVyZ2VkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldmVscy5wdXNoKG5ld2xldmVsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZXMucHVzaChuZXdyZXZlcnNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICBtYXJrZXQuYmxvY2tsZXZlbHMgPSBsZXZlbHM7XG4gICAgICAgICAgICAgICAgbWFya2V0LnJldmVyc2VsZXZlbHMgPSByZXZlcnNlcztcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAvLyBtYXJrZXQuYmxvY2tsZXZlbHMgPSBbbWFya2V0LmJsb2NrbGlzdF07XG4gICAgICAgICAgICAgICAgLy8gbWFya2V0LnJldmVyc2VsZXZlbHMgPSBbbWFya2V0LnJldmVyc2VibG9ja3NdO1xuICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gLy8gZWxhcHNlZCB0aW1lXG4gICAgICAgICAgICAgICAgLy8gdmFyIGFsbExldmVsc1RpbWU6RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgLy8gZGlmZiA9IGFsbExldmVsc1RpbWUuZ2V0VGltZSgpIC0gYWxsTGV2ZWxzU3RhcnQuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIC8vIHNlYyA9IGRpZmYgLyAxMDAwO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKiogVmFwYWVlREVYLmdldEJsb2NrSGlzdG9yeSgpIGFsbExldmVsc1RpbWUgc2VjOiBcIiwgc2VjLCBcIihcIixkaWZmLFwiKVwiKTsgICBcbiAgICAgICAgICAgICAgICAvLyAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiLCBtYXJrZXQuYmxvY2tsZXZlbHMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcmtldC5ibG9jaztcbiAgICAgICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYmxvY2staGlzdG9yeS5cIitzY29wZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMubWFya2V0KHNjb3BlKSAmJiAhZm9yY2UpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMubWFya2V0KHNjb3BlKS5ibG9jaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGF1eDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub25IaXN0b3J5Q2hhbmdlLm5leHQocmVzdWx0KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGFzeW5jIGdldFNlbGxPcmRlcnMoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYLCBmb3JjZTpib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB2YXIgc2NvcGU6c3RyaW5nID0gdGhpcy5nZXRTY29wZUZvcihjb21vZGl0eSwgY3VycmVuY3kpO1xuICAgICAgICB2YXIgY2Fub25pY2FsOnN0cmluZyA9IHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpO1xuICAgICAgICB2YXIgcmV2ZXJzZTpzdHJpbmcgPSB0aGlzLmludmVyc2VTY29wZShjYW5vbmljYWwpO1xuICAgICAgICB2YXIgYXV4ID0gbnVsbDtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwic2VsbG9yZGVyc1wiLCB0cnVlKTtcbiAgICAgICAgYXV4ID0gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgb3JkZXJzID0gYXdhaXQgdGhpcy5mZXRjaE9yZGVycyh7c2NvcGU6Y2Fub25pY2FsLCBsaW1pdDoxMDAsIGluZGV4X3Bvc2l0aW9uOiBcIjJcIiwga2V5X3R5cGU6IFwiaTY0XCJ9KTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSA9IHRoaXMuYXV4QXNzZXJ0U2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cInZwZS50bG9zXCIgfHwgc2NvcGU9PVwiY250LnRsb3NcIiljb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICAvLyBpZihzY29wZT09XCJ2cGUudGxvc1wiIHx8IHNjb3BlPT1cImNudC50bG9zXCIpY29uc29sZS5sb2coXCJTZWxsIGNydWRvOlwiLCBvcmRlcnMpO1xuICAgICAgICAgICAgdmFyIHNlbGw6IE9yZGVyW10gPSB0aGlzLmF1eFByb2Nlc3NSb3dzVG9PcmRlcnMob3JkZXJzLnJvd3MpO1xuICAgICAgICAgICAgc2VsbC5zb3J0KGZ1bmN0aW9uKGE6T3JkZXIsIGI6T3JkZXIpIHtcbiAgICAgICAgICAgICAgICBpZihhLnByaWNlLmFtb3VudC5pc0xlc3NUaGFuKGIucHJpY2UuYW1vdW50KSkgcmV0dXJuIC0xMTtcbiAgICAgICAgICAgICAgICBpZihhLnByaWNlLmFtb3VudC5pc0dyZWF0ZXJUaGFuKGIucHJpY2UuYW1vdW50KSkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cInZwZS50bG9zXCIgfHwgc2NvcGU9PVwiY250LnRsb3NcIiljb25zb2xlLmxvZyhcInNvcnRlZDpcIiwgc2VsbCk7XG4gICAgICAgICAgICAvLyBncm91cGluZyB0b2dldGhlciBvcmRlcnMgd2l0aCB0aGUgc2FtZSBwcmljZS5cbiAgICAgICAgICAgIHZhciBsaXN0OiBPcmRlclJvd1tdID0gW107XG4gICAgICAgICAgICB2YXIgcm93OiBPcmRlclJvdztcbiAgICAgICAgICAgIGlmIChzZWxsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxzZWxsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcmRlcjogT3JkZXIgPSBzZWxsW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3cgPSBsaXN0W2xpc3QubGVuZ3RoLTFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvdy5wcmljZS5hbW91bnQuZXEob3JkZXIucHJpY2UuYW1vdW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy50b3RhbC5hbW91bnQgPSByb3cudG90YWwuYW1vdW50LnBsdXMob3JkZXIudG90YWwuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cudGVsb3MuYW1vdW50ID0gcm93LnRlbG9zLmFtb3VudC5wbHVzKG9yZGVyLnRlbG9zLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93Lm93bmVyc1tvcmRlci5vd25lcl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5vcmRlcnMucHVzaChvcmRlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJvdyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cjogb3JkZXIucHJpY2UudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBvcmRlci5wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyczogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogb3JkZXIudG90YWwuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbG9zOiBvcmRlci50ZWxvcy5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogb3JkZXIuaW52ZXJzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1bTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1bXRlbG9zOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXJzOiB7fVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcm93Lm93bmVyc1tvcmRlci5vd25lcl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByb3cub3JkZXJzLnB1c2gob3JkZXIpO1xuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdW0gPSBuZXcgQmlnTnVtYmVyKDApO1xuICAgICAgICAgICAgdmFyIHN1bXRlbG9zID0gbmV3IEJpZ051bWJlcigwKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogaW4gbGlzdCkge1xuICAgICAgICAgICAgICAgIHZhciBvcmRlcl9yb3cgPSBsaXN0W2pdO1xuICAgICAgICAgICAgICAgIHN1bXRlbG9zID0gc3VtdGVsb3MucGx1cyhvcmRlcl9yb3cudGVsb3MuYW1vdW50KTtcbiAgICAgICAgICAgICAgICBzdW0gPSBzdW0ucGx1cyhvcmRlcl9yb3cudG90YWwuYW1vdW50KTtcbiAgICAgICAgICAgICAgICBvcmRlcl9yb3cuc3VtdGVsb3MgPSBuZXcgQXNzZXRERVgoc3VtdGVsb3MsIG9yZGVyX3Jvdy50ZWxvcy50b2tlbik7XG4gICAgICAgICAgICAgICAgb3JkZXJfcm93LnN1bSA9IG5ldyBBc3NldERFWChzdW0sIG9yZGVyX3Jvdy50b3RhbC50b2tlbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5vcmRlcnMuc2VsbCA9IGxpc3Q7XG4gICAgICAgICAgICAvLyBpZihzY29wZT09XCJ2cGUudGxvc1wiIHx8IHNjb3BlPT1cImNudC50bG9zXCIpY29uc29sZS5sb2coXCJTZWxsIGZpbmFsOlwiLCB0aGlzLnNjb3Blc1tzY29wZV0ub3JkZXJzLnNlbGwpO1xuICAgICAgICAgICAgLy8gaWYoc2NvcGU9PVwidnBlLnRsb3NcIiB8fCBzY29wZT09XCJjbnQudGxvc1wiKWNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcblxuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJzZWxsb3JkZXJzXCIsIGZhbHNlKTsgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0ub3JkZXJzLnNlbGw7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gJiYgIWZvcmNlKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0ub3JkZXJzLnNlbGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhdXg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgZ2V0QnV5T3JkZXJzKGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCwgZm9yY2U6Ym9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgdmFyIHNjb3BlOnN0cmluZyA9IHRoaXMuZ2V0U2NvcGVGb3IoY29tb2RpdHksIGN1cnJlbmN5KTtcbiAgICAgICAgdmFyIGNhbm9uaWNhbDpzdHJpbmcgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgdmFyIHJldmVyc2U6c3RyaW5nID0gdGhpcy5pbnZlcnNlU2NvcGUoY2Fub25pY2FsKTtcblxuXG4gICAgICAgIHZhciBhdXggPSBudWxsO1xuICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJidXlvcmRlcnNcIiwgdHJ1ZSk7XG4gICAgICAgIGF1eCA9IHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIG9yZGVycyA9IGF3YWl0IGF3YWl0IHRoaXMuZmV0Y2hPcmRlcnMoe3Njb3BlOnJldmVyc2UsIGxpbWl0OjUwLCBpbmRleF9wb3NpdGlvbjogXCIyXCIsIGtleV90eXBlOiBcImk2NFwifSk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gPSB0aGlzLmF1eEFzc2VydFNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJ1eSBjcnVkbzpcIiwgb3JkZXJzKTsgICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBidXk6IE9yZGVyW10gPSB0aGlzLmF1eFByb2Nlc3NSb3dzVG9PcmRlcnMob3JkZXJzLnJvd3MpO1xuICAgICAgICAgICAgYnV5LnNvcnQoZnVuY3Rpb24oYTpPcmRlciwgYjpPcmRlcil7XG4gICAgICAgICAgICAgICAgaWYoYS5wcmljZS5hbW91bnQuaXNMZXNzVGhhbihiLnByaWNlLmFtb3VudCkpIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmKGEucHJpY2UuYW1vdW50LmlzR3JlYXRlclRoYW4oYi5wcmljZS5hbW91bnQpKSByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJidXkgc29ydGVhZG86XCIsIGJ1eSk7XG5cbiAgICAgICAgICAgIC8vIGdyb3VwaW5nIHRvZ2V0aGVyIG9yZGVycyB3aXRoIHRoZSBzYW1lIHByaWNlLlxuICAgICAgICAgICAgdmFyIGxpc3Q6IE9yZGVyUm93W10gPSBbXTtcbiAgICAgICAgICAgIHZhciByb3c6IE9yZGVyUm93O1xuICAgICAgICAgICAgaWYgKGJ1eS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8YnV5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcmRlcjogT3JkZXIgPSBidXlbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdyA9IGxpc3RbbGlzdC5sZW5ndGgtMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93LnByaWNlLmFtb3VudC5lcShvcmRlci5wcmljZS5hbW91bnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LnRvdGFsLmFtb3VudCA9IHJvdy50b3RhbC5hbW91bnQucGx1cyhvcmRlci50b3RhbC5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy50ZWxvcy5hbW91bnQgPSByb3cudGVsb3MuYW1vdW50LnBsdXMob3JkZXIudGVsb3MuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cub3duZXJzW29yZGVyLm93bmVyXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93Lm9yZGVycy5wdXNoKG9yZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gICAgXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcm93ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyOiBvcmRlci5wcmljZS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IG9yZGVyLnByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiBvcmRlci50b3RhbC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVsb3M6IG9yZGVyLnRlbG9zLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiBvcmRlci5pbnZlcnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VtOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VtdGVsb3M6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcnM6IHt9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByb3cub3duZXJzW29yZGVyLm93bmVyXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJvdy5vcmRlcnMucHVzaChvcmRlcik7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gICAgICAgICAgICBcblxuICAgICAgICAgICAgdmFyIHN1bSA9IG5ldyBCaWdOdW1iZXIoMCk7XG4gICAgICAgICAgICB2YXIgc3VtdGVsb3MgPSBuZXcgQmlnTnVtYmVyKDApO1xuICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBsaXN0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG9yZGVyX3JvdyA9IGxpc3Rbal07XG4gICAgICAgICAgICAgICAgc3VtdGVsb3MgPSBzdW10ZWxvcy5wbHVzKG9yZGVyX3Jvdy50ZWxvcy5hbW91bnQpO1xuICAgICAgICAgICAgICAgIHN1bSA9IHN1bS5wbHVzKG9yZGVyX3Jvdy50b3RhbC5hbW91bnQpO1xuICAgICAgICAgICAgICAgIG9yZGVyX3Jvdy5zdW10ZWxvcyA9IG5ldyBBc3NldERFWChzdW10ZWxvcywgb3JkZXJfcm93LnRlbG9zLnRva2VuKTtcbiAgICAgICAgICAgICAgICBvcmRlcl9yb3cuc3VtID0gbmV3IEFzc2V0REVYKHN1bSwgb3JkZXJfcm93LnRvdGFsLnRva2VuKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLm9yZGVycy5idXkgPSBsaXN0O1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJCdXkgZmluYWw6XCIsIHRoaXMuc2NvcGVzW3Njb3BlXS5vcmRlcnMuYnV5KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYnV5b3JkZXJzXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0ub3JkZXJzLmJ1eTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSAmJiAhZm9yY2UpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5vcmRlcnMuYnV5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gYXV4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIGdldE9yZGVyU3VtbWFyeSgpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5nZXRPcmRlclN1bW1hcnkoKVwiKTtcbiAgICAgICAgdmFyIHRhYmxlcyA9IGF3YWl0IHRoaXMuZmV0Y2hPcmRlclN1bW1hcnkoKTtcblxuICAgICAgICBmb3IgKHZhciBpIGluIHRhYmxlcy5yb3dzKSB7XG4gICAgICAgICAgICB2YXIgc2NvcGU6c3RyaW5nID0gdGFibGVzLnJvd3NbaV0udGFibGU7XG4gICAgICAgICAgICB2YXIgY2Fub25pY2FsID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgICAgICBjb25zb2xlLmFzc2VydChzY29wZSA9PSBjYW5vbmljYWwsIFwiRVJST1I6IHNjb3BlIGlzIG5vdCBjYW5vbmljYWxcIiwgc2NvcGUsIFtpLCB0YWJsZXNdKTtcbiAgICAgICAgICAgIHZhciBjb21vZGl0eSA9IHNjb3BlLnNwbGl0KFwiLlwiKVswXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgdmFyIGN1cnJlbmN5ID0gc2NvcGUuc3BsaXQoXCIuXCIpWzFdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW3Njb3BlXSA9IHRoaXMuYXV4QXNzZXJ0U2NvcGUoc2NvcGUpO1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpLCB0YWJsZXMucm93c1tpXSk7XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbc2NvcGVdLmhlYWRlci5zZWxsLnRvdGFsID0gbmV3IEFzc2V0REVYKHRhYmxlcy5yb3dzW2ldLnN1cHBseS50b3RhbCwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW3Njb3BlXS5oZWFkZXIuc2VsbC5vcmRlcnMgPSB0YWJsZXMucm93c1tpXS5zdXBwbHkub3JkZXJzO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tzY29wZV0uaGVhZGVyLmJ1eS50b3RhbCA9IG5ldyBBc3NldERFWCh0YWJsZXMucm93c1tpXS5kZW1hbmQudG90YWwsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tzY29wZV0uaGVhZGVyLmJ1eS5vcmRlcnMgPSB0YWJsZXMucm93c1tpXS5kZW1hbmQub3JkZXJzO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tzY29wZV0uZGVhbHMgPSB0YWJsZXMucm93c1tpXS5kZWFscztcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbc2NvcGVdLmJsb2NrcyA9IHRhYmxlcy5yb3dzW2ldLmJsb2NrcztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5zZXRPcmRlclN1bW1hcnkoKTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRUYWJsZVN1bW1hcnkoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYLCBmb3JjZTpib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPE1hcmtldFN1bW1hcnk+IHtcbiAgICAgICAgdmFyIHNjb3BlOnN0cmluZyA9IHRoaXMuZ2V0U2NvcGVGb3IoY29tb2RpdHksIGN1cnJlbmN5KTtcbiAgICAgICAgdmFyIGNhbm9uaWNhbDpzdHJpbmcgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgdmFyIGludmVyc2U6c3RyaW5nID0gdGhpcy5pbnZlcnNlU2NvcGUoY2Fub25pY2FsKTtcblxuICAgICAgICB2YXIgWkVST19DT01PRElUWSA9IFwiMC4wMDAwMDAwMCBcIiArIGNvbW9kaXR5LnN5bWJvbDtcbiAgICAgICAgdmFyIFpFUk9fQ1VSUkVOQ1kgPSBcIjAuMDAwMDAwMDAgXCIgKyBjdXJyZW5jeS5zeW1ib2w7XG5cbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJzdW1tYXJ5LlwiK2Nhbm9uaWNhbCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwic3VtbWFyeS5cIitpbnZlcnNlLCB0cnVlKTtcbiAgICAgICAgdmFyIGF1eCA9IG51bGw7XG4gICAgICAgIHZhciByZXN1bHQ6TWFya2V0U3VtbWFyeSA9IG51bGw7XG4gICAgICAgIGF1eCA9IHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIHN1bW1hcnkgPSBhd2FpdCB0aGlzLmZldGNoU3VtbWFyeShjYW5vbmljYWwpO1xuICAgICAgICAgICAgLy8gaWYoc2NvcGU9PVwib2xpdmUudGxvc1wiKWNvbnNvbGUubG9nKHNjb3BlLCBcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cIm9saXZlLnRsb3NcIiljb25zb2xlLmxvZyhcIlN1bW1hcnkgY3J1ZG86XCIsIHN1bW1hcnkucm93cyk7XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSA9IHRoaXMuYXV4QXNzZXJ0U2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5ID0ge1xuICAgICAgICAgICAgICAgIHNjb3BlOiBjYW5vbmljYWwsXG4gICAgICAgICAgICAgICAgcHJpY2U6IG5ldyBBc3NldERFWChuZXcgQmlnTnVtYmVyKDApLCBjdXJyZW5jeSksXG4gICAgICAgICAgICAgICAgcHJpY2VfMjRoX2FnbzogbmV3IEFzc2V0REVYKG5ldyBCaWdOdW1iZXIoMCksIGN1cnJlbmN5KSxcbiAgICAgICAgICAgICAgICBpbnZlcnNlOiBuZXcgQXNzZXRERVgobmV3IEJpZ051bWJlcigwKSwgY29tb2RpdHkpLFxuICAgICAgICAgICAgICAgIGludmVyc2VfMjRoX2FnbzogbmV3IEFzc2V0REVYKG5ldyBCaWdOdW1iZXIoMCksIGNvbW9kaXR5KSxcbiAgICAgICAgICAgICAgICB2b2x1bWU6IG5ldyBBc3NldERFWChuZXcgQmlnTnVtYmVyKDApLCBjdXJyZW5jeSksXG4gICAgICAgICAgICAgICAgYW1vdW50OiBuZXcgQXNzZXRERVgobmV3IEJpZ051bWJlcigwKSwgY29tb2RpdHkpLFxuICAgICAgICAgICAgICAgIHBlcmNlbnQ6IDAuMyxcbiAgICAgICAgICAgICAgICByZWNvcmRzOiBzdW1tYXJ5LnJvd3NcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBub3c6RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB2YXIgbm93X3NlYzogbnVtYmVyID0gTWF0aC5mbG9vcihub3cuZ2V0VGltZSgpIC8gMTAwMCk7XG4gICAgICAgICAgICB2YXIgbm93X2hvdXI6IG51bWJlciA9IE1hdGguZmxvb3Iobm93X3NlYyAvIDM2MDApO1xuICAgICAgICAgICAgdmFyIHN0YXJ0X2hvdXIgPSBub3dfaG91ciAtIDIzO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcIm5vd19ob3VyOlwiLCBub3dfaG91cik7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwic3RhcnRfaG91cjpcIiwgc3RhcnRfaG91cik7XG5cbiAgICAgICAgICAgIC8vIHByb2Nlc28gbG9zIGRhdG9zIGNydWRvcyBcbiAgICAgICAgICAgIHZhciBwcmljZSA9IFpFUk9fQ1VSUkVOQ1k7XG4gICAgICAgICAgICB2YXIgaW52ZXJzZSA9IFpFUk9fQ09NT0RJVFk7XG4gICAgICAgICAgICB2YXIgY3J1ZGUgPSB7fTtcbiAgICAgICAgICAgIHZhciBsYXN0X2hoID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxzdW1tYXJ5LnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaGggPSBzdW1tYXJ5LnJvd3NbaV0uaG91cjtcbiAgICAgICAgICAgICAgICBpZiAoc3VtbWFyeS5yb3dzW2ldLmxhYmVsID09IFwibGFzdG9uZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHByaWNlID0gc3VtbWFyeS5yb3dzW2ldLnByaWNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNydWRlW2hoXSA9IHN1bW1hcnkucm93c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RfaGggPCBoaCAmJiBoaCA8IHN0YXJ0X2hvdXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RfaGggPSBoaDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlID0gKHNjb3BlID09IGNhbm9uaWNhbCkgPyBzdW1tYXJ5LnJvd3NbaV0ucHJpY2UgOiBzdW1tYXJ5LnJvd3NbaV0uaW52ZXJzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2UgPSAoc2NvcGUgPT0gY2Fub25pY2FsKSA/IHN1bW1hcnkucm93c1tpXS5pbnZlcnNlIDogc3VtbWFyeS5yb3dzW2ldLnByaWNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcImhoOlwiLCBoaCwgXCJsYXN0X2hoOlwiLCBsYXN0X2hoLCBcInByaWNlOlwiLCBwcmljZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJjcnVkZTpcIiwgY3J1ZGUpO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcInByaWNlOlwiLCBwcmljZSk7XG5cbiAgICAgICAgICAgIC8vIGdlbmVybyB1bmEgZW50cmFkYSBwb3IgY2FkYSB1bmEgZGUgbGFzIMODwrpsdGltYXMgMjQgaG9yYXNcbiAgICAgICAgICAgIHZhciBsYXN0XzI0aCA9IHt9O1xuICAgICAgICAgICAgdmFyIHZvbHVtZSA9IG5ldyBBc3NldERFWChaRVJPX0NVUlJFTkNZLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBhbW91bnQgPSBuZXcgQXNzZXRERVgoWkVST19DT01PRElUWSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgcHJpY2VfYXNzZXQgPSBuZXcgQXNzZXRERVgocHJpY2UsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGludmVyc2VfYXNzZXQgPSBuZXcgQXNzZXRERVgoaW52ZXJzZSwgdGhpcyk7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiY250LnRsb3NcIiljb25zb2xlLmxvZyhcInByaWNlIFwiLCBwcmljZSk7XG4gICAgICAgICAgICB2YXIgbWF4X3ByaWNlID0gcHJpY2VfYXNzZXQuY2xvbmUoKTtcbiAgICAgICAgICAgIHZhciBtaW5fcHJpY2UgPSBwcmljZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgdmFyIG1heF9pbnZlcnNlID0gaW52ZXJzZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgdmFyIG1pbl9pbnZlcnNlID0gaW52ZXJzZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgdmFyIHByaWNlX2ZzdDpBc3NldERFWCA9IG51bGw7XG4gICAgICAgICAgICB2YXIgaW52ZXJzZV9mc3Q6QXNzZXRERVggPSBudWxsO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPDI0OyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudCA9IHN0YXJ0X2hvdXIraTtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudF9kYXRlID0gbmV3IERhdGUoY3VycmVudCAqIDM2MDAgKiAxMDAwKTtcbiAgICAgICAgICAgICAgICB2YXIgbnVldm86YW55ID0gY3J1ZGVbY3VycmVudF07XG4gICAgICAgICAgICAgICAgaWYgKG51ZXZvKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzX3ByaWNlID0gKHNjb3BlID09IGNhbm9uaWNhbCkgPyBudWV2by5wcmljZSA6IG51ZXZvLmludmVyc2U7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzX2ludmVyc2UgPSAoc2NvcGUgPT0gY2Fub25pY2FsKSA/IG51ZXZvLmludmVyc2UgOiBudWV2by5wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNfdm9sdW1lID0gKHNjb3BlID09IGNhbm9uaWNhbCkgPyBudWV2by52b2x1bWUgOiBudWV2by5hbW91bnQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzX2Ftb3VudCA9IChzY29wZSA9PSBjYW5vbmljYWwpID8gbnVldm8uYW1vdW50IDogbnVldm8udm9sdW1lO1xuICAgICAgICAgICAgICAgICAgICBudWV2by5wcmljZSA9IHNfcHJpY2U7XG4gICAgICAgICAgICAgICAgICAgIG51ZXZvLmludmVyc2UgPSBzX2ludmVyc2U7XG4gICAgICAgICAgICAgICAgICAgIG51ZXZvLnZvbHVtZSA9IHNfdm9sdW1lO1xuICAgICAgICAgICAgICAgICAgICBudWV2by5hbW91bnQgPSBzX2Ftb3VudDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBudWV2byA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiB0aGlzLmF1eEdldExhYmVsRm9ySG91cihjdXJyZW50ICUgMjQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogaW52ZXJzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZTogWkVST19DVVJSRU5DWSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFtb3VudDogWkVST19DT01PRElUWSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IGN1cnJlbnRfZGF0ZS50b0lTT1N0cmluZygpLnNwbGl0KFwiLlwiKVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdXI6IGN1cnJlbnRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGFzdF8yNGhbY3VycmVudF0gPSBjcnVkZVtjdXJyZW50XSB8fCBudWV2bztcbiAgICAgICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiY3VycmVudF9kYXRlOlwiLCBjdXJyZW50X2RhdGUudG9JU09TdHJpbmcoKSwgY3VycmVudCwgbGFzdF8yNGhbY3VycmVudF0pO1xuXG4gICAgICAgICAgICAgICAgLy8gY29uaW5pY2FsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICBwcmljZSA9IGxhc3RfMjRoW2N1cnJlbnRdLnByaWNlO1xuICAgICAgICAgICAgICAgIHZhciB2b2wgPSBuZXcgQXNzZXRERVgobGFzdF8yNGhbY3VycmVudF0udm9sdW1lLCB0aGlzKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydCh2b2wudG9rZW4uc3ltYm9sID09IHZvbHVtZS50b2tlbi5zeW1ib2wsIFwiRVJST1I6IGRpZmZlcmVudCB0b2tlbnNcIiwgdm9sLnN0ciwgdm9sdW1lLnN0cik7XG4gICAgICAgICAgICAgICAgdm9sdW1lLmFtb3VudCA9IHZvbHVtZS5hbW91bnQucGx1cyh2b2wuYW1vdW50KTtcbiAgICAgICAgICAgICAgICBpZiAocHJpY2UgIT0gWkVST19DVVJSRU5DWSAmJiAhcHJpY2VfZnN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHByaWNlX2ZzdCA9IG5ldyBBc3NldERFWChwcmljZSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByaWNlX2Fzc2V0ID0gbmV3IEFzc2V0REVYKHByaWNlLCB0aGlzKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChwcmljZV9hc3NldC50b2tlbi5zeW1ib2wgPT0gbWF4X3ByaWNlLnRva2VuLnN5bWJvbCwgXCJFUlJPUjogZGlmZmVyZW50IHRva2Vuc1wiLCBwcmljZV9hc3NldC5zdHIsIG1heF9wcmljZS5zdHIpO1xuICAgICAgICAgICAgICAgIGlmIChwcmljZV9hc3NldC5hbW91bnQuaXNHcmVhdGVyVGhhbihtYXhfcHJpY2UuYW1vdW50KSkge1xuICAgICAgICAgICAgICAgICAgICBtYXhfcHJpY2UgPSBwcmljZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChwcmljZV9hc3NldC50b2tlbi5zeW1ib2wgPT0gbWluX3ByaWNlLnRva2VuLnN5bWJvbCwgXCJFUlJPUjogZGlmZmVyZW50IHRva2Vuc1wiLCBwcmljZV9hc3NldC5zdHIsIG1pbl9wcmljZS5zdHIpO1xuICAgICAgICAgICAgICAgIGlmIChtaW5fcHJpY2UuYW1vdW50LmlzRXF1YWxUbygwKSB8fCBwcmljZV9hc3NldC5hbW91bnQuaXNMZXNzVGhhbihtaW5fcHJpY2UuYW1vdW50KSkge1xuICAgICAgICAgICAgICAgICAgICBtaW5fcHJpY2UgPSBwcmljZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHJldmVyc2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIGludmVyc2UgPSBsYXN0XzI0aFtjdXJyZW50XS5pbnZlcnNlO1xuICAgICAgICAgICAgICAgIHZhciBhbW8gPSBuZXcgQXNzZXRERVgobGFzdF8yNGhbY3VycmVudF0uYW1vdW50LCB0aGlzKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChhbW8udG9rZW4uc3ltYm9sID09IGFtb3VudC50b2tlbi5zeW1ib2wsIFwiRVJST1I6IGRpZmZlcmVudCB0b2tlbnNcIiwgYW1vLnN0ciwgYW1vdW50LnN0cik7XG4gICAgICAgICAgICAgICAgYW1vdW50LmFtb3VudCA9IGFtb3VudC5hbW91bnQucGx1cyhhbW8uYW1vdW50KTtcbiAgICAgICAgICAgICAgICBpZiAoaW52ZXJzZSAhPSBaRVJPX0NPTU9ESVRZICYmICFpbnZlcnNlX2ZzdCkge1xuICAgICAgICAgICAgICAgICAgICBpbnZlcnNlX2ZzdCA9IG5ldyBBc3NldERFWChpbnZlcnNlLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW52ZXJzZV9hc3NldCA9IG5ldyBBc3NldERFWChpbnZlcnNlLCB0aGlzKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChpbnZlcnNlX2Fzc2V0LnRva2VuLnN5bWJvbCA9PSBtYXhfaW52ZXJzZS50b2tlbi5zeW1ib2wsIFwiRVJST1I6IGRpZmZlcmVudCB0b2tlbnNcIiwgaW52ZXJzZV9hc3NldC5zdHIsIG1heF9pbnZlcnNlLnN0cik7XG4gICAgICAgICAgICAgICAgaWYgKGludmVyc2VfYXNzZXQuYW1vdW50LmlzR3JlYXRlclRoYW4obWF4X2ludmVyc2UuYW1vdW50KSkge1xuICAgICAgICAgICAgICAgICAgICBtYXhfaW52ZXJzZSA9IGludmVyc2VfYXNzZXQuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoaW52ZXJzZV9hc3NldC50b2tlbi5zeW1ib2wgPT0gbWluX2ludmVyc2UudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiBkaWZmZXJlbnQgdG9rZW5zXCIsIGludmVyc2VfYXNzZXQuc3RyLCBtaW5faW52ZXJzZS5zdHIpO1xuICAgICAgICAgICAgICAgIGlmIChtaW5faW52ZXJzZS5hbW91bnQuaXNFcXVhbFRvKDApIHx8IGludmVyc2VfYXNzZXQuYW1vdW50LmlzTGVzc1RoYW4obWluX2ludmVyc2UuYW1vdW50KSkge1xuICAgICAgICAgICAgICAgICAgICBtaW5faW52ZXJzZSA9IGludmVyc2VfYXNzZXQuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBjb25pbmljYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgaWYgKCFwcmljZV9mc3QpIHtcbiAgICAgICAgICAgICAgICBwcmljZV9mc3QgPSBuZXcgQXNzZXRERVgobGFzdF8yNGhbc3RhcnRfaG91cl0ucHJpY2UsIHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGxhc3RfcHJpY2UgPSAgbmV3IEFzc2V0REVYKGxhc3RfMjRoW25vd19ob3VyXS5wcmljZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgZGlmZiA9IGxhc3RfcHJpY2UuY2xvbmUoKTtcbiAgICAgICAgICAgIC8vIGRpZmYuYW1vdW50IFxuICAgICAgICAgICAgZGlmZi5hbW91bnQgPSBsYXN0X3ByaWNlLmFtb3VudC5taW51cyhwcmljZV9mc3QuYW1vdW50KTtcbiAgICAgICAgICAgIHZhciByYXRpbzpudW1iZXIgPSAwO1xuICAgICAgICAgICAgaWYgKHByaWNlX2ZzdC5hbW91bnQudG9OdW1iZXIoKSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgcmF0aW8gPSBkaWZmLmFtb3VudC5kaXZpZGVkQnkocHJpY2VfZnN0LmFtb3VudCkudG9OdW1iZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwZXJjZW50ID0gTWF0aC5mbG9vcihyYXRpbyAqIDEwMDAwKSAvIDEwMDtcblxuICAgICAgICAgICAgLy8gcmV2ZXJzZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBpZiAoIWludmVyc2VfZnN0KSB7XG4gICAgICAgICAgICAgICAgaW52ZXJzZV9mc3QgPSBuZXcgQXNzZXRERVgobGFzdF8yNGhbc3RhcnRfaG91cl0uaW52ZXJzZSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbGFzdF9pbnZlcnNlID0gIG5ldyBBc3NldERFWChsYXN0XzI0aFtub3dfaG91cl0uaW52ZXJzZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgaWRpZmYgPSBsYXN0X2ludmVyc2UuY2xvbmUoKTtcbiAgICAgICAgICAgIC8vIGRpZmYuYW1vdW50IFxuICAgICAgICAgICAgaWRpZmYuYW1vdW50ID0gbGFzdF9pbnZlcnNlLmFtb3VudC5taW51cyhpbnZlcnNlX2ZzdC5hbW91bnQpO1xuICAgICAgICAgICAgcmF0aW8gPSAwO1xuICAgICAgICAgICAgaWYgKGludmVyc2VfZnN0LmFtb3VudC50b051bWJlcigpICE9IDApIHtcbiAgICAgICAgICAgICAgICByYXRpbyA9IGRpZmYuYW1vdW50LmRpdmlkZWRCeShpbnZlcnNlX2ZzdC5hbW91bnQpLnRvTnVtYmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaXBlcmNlbnQgPSBNYXRoLmZsb29yKHJhdGlvICogMTAwMDApIC8gMTAwO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcInByaWNlX2ZzdDpcIiwgcHJpY2VfZnN0LnN0cik7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiaW52ZXJzZV9mc3Q6XCIsIGludmVyc2VfZnN0LnN0cik7XG5cbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJsYXN0XzI0aDpcIiwgW2xhc3RfMjRoXSk7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiZGlmZjpcIiwgZGlmZi50b1N0cmluZyg4KSk7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwicGVyY2VudDpcIiwgcGVyY2VudCk7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwicmF0aW86XCIsIHJhdGlvKTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJ2b2x1bWU6XCIsIHZvbHVtZS5zdHIpO1xuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5wcmljZSA9IGxhc3RfcHJpY2U7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5pbnZlcnNlID0gbGFzdF9pbnZlcnNlO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkucHJpY2VfMjRoX2FnbyA9IHByaWNlX2ZzdCB8fCBsYXN0X3ByaWNlO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkuaW52ZXJzZV8yNGhfYWdvID0gaW52ZXJzZV9mc3Q7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5wZXJjZW50X3N0ciA9IChpc05hTihwZXJjZW50KSA/IDAgOiBwZXJjZW50KSArIFwiJVwiO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkucGVyY2VudCA9IGlzTmFOKHBlcmNlbnQpID8gMCA6IHBlcmNlbnQ7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5pcGVyY2VudF9zdHIgPSAoaXNOYU4oaXBlcmNlbnQpID8gMCA6IGlwZXJjZW50KSArIFwiJVwiO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkuaXBlcmNlbnQgPSBpc05hTihpcGVyY2VudCkgPyAwIDogaXBlcmNlbnQ7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS52b2x1bWUgPSB2b2x1bWU7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5hbW91bnQgPSBhbW91bnQ7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5taW5fcHJpY2UgPSBtaW5fcHJpY2U7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5tYXhfcHJpY2UgPSBtYXhfcHJpY2U7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5taW5faW52ZXJzZSA9IG1pbl9pbnZlcnNlO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkubWF4X2ludmVyc2UgPSBtYXhfaW52ZXJzZTtcblxuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcIlN1bW1hcnkgZmluYWw6XCIsIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5KTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInN1bW1hcnkuXCIrY2Fub25pY2FsLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInN1bW1hcnkuXCIraW52ZXJzZSwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5O1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5fbWFya2V0c1tjYW5vbmljYWxdICYmICFmb3JjZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhd2FpdCBhdXg7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldE1hcmtldFN1bW1hcnkoKTtcbiAgICAgICAgdGhpcy5vbk1hcmtldFN1bW1hcnkubmV4dChyZXN1bHQpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QWxsVGFibGVzU3VtYXJpZXMoKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdE9yZGVyU3VtbWFyeS50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIHByb21pc2VzID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5fbWFya2V0cykge1xuICAgICAgICAgICAgICAgIGlmIChpLmluZGV4T2YoXCIuXCIpID09IC0xKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHRoaXMuZ2V0VGFibGVTdW1tYXJ5KHRoaXMuX21hcmtldHNbaV0uY29tb2RpdHksIHRoaXMuX21hcmtldHNbaV0uY3VycmVuY3ksIHRydWUpO1xuICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2gocCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihfID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRva2Vuc1N1bW1hcnkoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgIH1cbiAgICBcblxuICAgIC8vXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBdXggZnVuY3Rpb25zXG4gICAgcHJpdmF0ZSBhdXhQcm9jZXNzUm93c1RvT3JkZXJzKHJvd3M6YW55W10pOiBPcmRlcltdIHtcbiAgICAgICAgdmFyIHJlc3VsdDogT3JkZXJbXSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGkgPCByb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcHJpY2UgPSBuZXcgQXNzZXRERVgocm93c1tpXS5wcmljZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgaW52ZXJzZSA9IG5ldyBBc3NldERFWChyb3dzW2ldLmludmVyc2UsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNlbGxpbmcgPSBuZXcgQXNzZXRERVgocm93c1tpXS5zZWxsaW5nLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IG5ldyBBc3NldERFWChyb3dzW2ldLnRvdGFsLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBvcmRlcjpPcmRlcjtcblxuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcy5nZXRTY29wZUZvcihwcmljZS50b2tlbiwgaW52ZXJzZS50b2tlbik7XG4gICAgICAgICAgICB2YXIgY2Fub25pY2FsID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgICAgICB2YXIgcmV2ZXJzZV9zY29wZSA9IHRoaXMuaW52ZXJzZVNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgaWYgKHJldmVyc2Vfc2NvcGUgPT0gc2NvcGUpIHtcbiAgICAgICAgICAgICAgICBvcmRlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHJvd3NbaV0uaWQsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlOiBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogaW52ZXJzZSxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHNlbGxpbmcsXG4gICAgICAgICAgICAgICAgICAgIGRlcG9zaXQ6IHNlbGxpbmcsXG4gICAgICAgICAgICAgICAgICAgIHRlbG9zOiB0b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IHJvd3NbaV0ub3duZXJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9yZGVyID0ge1xuICAgICAgICAgICAgICAgICAgICBpZDogcm93c1tpXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGludmVyc2UsXG4gICAgICAgICAgICAgICAgICAgIGludmVyc2U6IHByaWNlLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwsXG4gICAgICAgICAgICAgICAgICAgIGRlcG9zaXQ6IHNlbGxpbmcsXG4gICAgICAgICAgICAgICAgICAgIHRlbG9zOiBzZWxsaW5nLFxuICAgICAgICAgICAgICAgICAgICBvd25lcjogcm93c1tpXS5vd25lclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG9yZGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXV4R2V0TGFiZWxGb3JIb3VyKGhoOm51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIHZhciBob3VycyA9IFtcbiAgICAgICAgICAgIFwiaC56ZXJvXCIsXG4gICAgICAgICAgICBcImgub25lXCIsXG4gICAgICAgICAgICBcImgudHdvXCIsXG4gICAgICAgICAgICBcImgudGhyZWVcIixcbiAgICAgICAgICAgIFwiaC5mb3VyXCIsXG4gICAgICAgICAgICBcImguZml2ZVwiLFxuICAgICAgICAgICAgXCJoLnNpeFwiLFxuICAgICAgICAgICAgXCJoLnNldmVuXCIsXG4gICAgICAgICAgICBcImguZWlnaHRcIixcbiAgICAgICAgICAgIFwiaC5uaW5lXCIsXG4gICAgICAgICAgICBcImgudGVuXCIsXG4gICAgICAgICAgICBcImguZWxldmVuXCIsXG4gICAgICAgICAgICBcImgudHdlbHZlXCIsXG4gICAgICAgICAgICBcImgudGhpcnRlZW5cIixcbiAgICAgICAgICAgIFwiaC5mb3VydGVlblwiLFxuICAgICAgICAgICAgXCJoLmZpZnRlZW5cIixcbiAgICAgICAgICAgIFwiaC5zaXh0ZWVuXCIsXG4gICAgICAgICAgICBcImguc2V2ZW50ZWVuXCIsXG4gICAgICAgICAgICBcImguZWlnaHRlZW5cIixcbiAgICAgICAgICAgIFwiaC5uaW5ldGVlblwiLFxuICAgICAgICAgICAgXCJoLnR3ZW50eVwiLFxuICAgICAgICAgICAgXCJoLnR3ZW50eW9uZVwiLFxuICAgICAgICAgICAgXCJoLnR3ZW50eXR3b1wiLFxuICAgICAgICAgICAgXCJoLnR3ZW50eXRocmVlXCJcbiAgICAgICAgXVxuICAgICAgICByZXR1cm4gaG91cnNbaGhdO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXV4QXNzZXJ0U2NvcGUoc2NvcGU6c3RyaW5nKTogTWFya2V0IHtcbiAgICAgICAgdmFyIGNvbW9kaXR5X3N5bSA9IHNjb3BlLnNwbGl0KFwiLlwiKVswXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICB2YXIgY3VycmVuY3lfc3ltID0gc2NvcGUuc3BsaXQoXCIuXCIpWzFdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIHZhciBjb21vZGl0eSA9IHRoaXMuZ2V0VG9rZW5Ob3coY29tb2RpdHlfc3ltKTtcbiAgICAgICAgdmFyIGN1cnJlbmN5ID0gdGhpcy5nZXRUb2tlbk5vdyhjdXJyZW5jeV9zeW0pO1xuICAgICAgICB2YXIgYXV4X2Fzc2V0X2NvbSA9IG5ldyBBc3NldERFWCgwLCBjb21vZGl0eSk7XG4gICAgICAgIHZhciBhdXhfYXNzZXRfY3VyID0gbmV3IEFzc2V0REVYKDAsIGN1cnJlbmN5KTtcblxuICAgICAgICB2YXIgbWFya2V0X3N1bW1hcnk6TWFya2V0U3VtbWFyeSA9IHtcbiAgICAgICAgICAgIHNjb3BlOiBzY29wZSxcbiAgICAgICAgICAgIHByaWNlOiBhdXhfYXNzZXRfY3VyLFxuICAgICAgICAgICAgcHJpY2VfMjRoX2FnbzogYXV4X2Fzc2V0X2N1cixcbiAgICAgICAgICAgIGludmVyc2U6IGF1eF9hc3NldF9jb20sXG4gICAgICAgICAgICBpbnZlcnNlXzI0aF9hZ286IGF1eF9hc3NldF9jb20sXG4gICAgICAgICAgICBtYXhfaW52ZXJzZTogYXV4X2Fzc2V0X2NvbSxcbiAgICAgICAgICAgIG1heF9wcmljZTogYXV4X2Fzc2V0X2N1cixcbiAgICAgICAgICAgIG1pbl9pbnZlcnNlOiBhdXhfYXNzZXRfY29tLFxuICAgICAgICAgICAgbWluX3ByaWNlOiBhdXhfYXNzZXRfY3VyLFxuICAgICAgICAgICAgcmVjb3JkczogW10sXG4gICAgICAgICAgICB2b2x1bWU6IGF1eF9hc3NldF9jdXIsXG4gICAgICAgICAgICBhbW91bnQ6IGF1eF9hc3NldF9jb20sXG4gICAgICAgICAgICBwZXJjZW50OiAwLFxuICAgICAgICAgICAgaXBlcmNlbnQ6IDAsXG4gICAgICAgICAgICBwZXJjZW50X3N0cjogXCIwJVwiLFxuICAgICAgICAgICAgaXBlcmNlbnRfc3RyOiBcIjAlXCIsXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fbWFya2V0c1tzY29wZV0gfHwge1xuICAgICAgICAgICAgc2NvcGU6IHNjb3BlLFxuICAgICAgICAgICAgY29tb2RpdHk6IGNvbW9kaXR5LFxuICAgICAgICAgICAgY3VycmVuY3k6IGN1cnJlbmN5LFxuICAgICAgICAgICAgb3JkZXJzOiB7IHNlbGw6IFtdLCBidXk6IFtdIH0sXG4gICAgICAgICAgICBkZWFsczogMCxcbiAgICAgICAgICAgIGhpc3Rvcnk6IFtdLFxuICAgICAgICAgICAgdHg6IHt9LFxuICAgICAgICAgICAgYmxvY2tzOiAwLFxuICAgICAgICAgICAgYmxvY2s6IHt9LFxuICAgICAgICAgICAgYmxvY2tsaXN0OiBbXSxcbiAgICAgICAgICAgIGJsb2NrbGV2ZWxzOiBbW11dLFxuICAgICAgICAgICAgcmV2ZXJzZWJsb2NrczogW10sXG4gICAgICAgICAgICByZXZlcnNlbGV2ZWxzOiBbW11dLFxuICAgICAgICAgICAgc3VtbWFyeTogbWFya2V0X3N1bW1hcnksXG4gICAgICAgICAgICBoZWFkZXI6IHsgXG4gICAgICAgICAgICAgICAgc2VsbDoge3RvdGFsOmF1eF9hc3NldF9jb20sIG9yZGVyczowfSwgXG4gICAgICAgICAgICAgICAgYnV5OiB7dG90YWw6YXV4X2Fzc2V0X2N1ciwgb3JkZXJzOjB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9OyAgICAgICAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaERlcG9zaXRzKGFjY291bnQpOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwiZGVwb3NpdHNcIiwge3Njb3BlOmFjY291bnR9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGZldGNoQmFsYW5jZXMoYWNjb3VudCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciBjb250cmFjdHMgPSB7fTtcbiAgICAgICAgICAgIHZhciBiYWxhbmNlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnRva2Vucykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRva2Vuc1tpXS5vZmZjaGFpbikgY29udGludWU7XG4gICAgICAgICAgICAgICAgY29udHJhY3RzW3RoaXMudG9rZW5zW2ldLmNvbnRyYWN0XSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBjb250cmFjdCBpbiBjb250cmFjdHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJhbGFuY2VzLVwiK2NvbnRyYWN0LCB0cnVlKTtcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAodmFyIGNvbnRyYWN0IGluIGNvbnRyYWN0cykge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBhd2FpdCB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwiYWNjb3VudHNcIiwge1xuICAgICAgICAgICAgICAgICAgICBjb250cmFjdDpjb250cmFjdCxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6IGFjY291bnQgfHwgdGhpcy5jdXJyZW50Lm5hbWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHJlc3VsdC5yb3dzKSB7XG4gICAgICAgICAgICAgICAgICAgIGJhbGFuY2VzLnB1c2gobmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmJhbGFuY2UsIHRoaXMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJiYWxhbmNlcy1cIitjb250cmFjdCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGJhbGFuY2VzO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZldGNoT3JkZXJzKHBhcmFtczpUYWJsZVBhcmFtcyk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJzZWxsb3JkZXJzXCIsIHBhcmFtcykudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaE9yZGVyU3VtbWFyeSgpOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwib3JkZXJzdW1tYXJ5XCIpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hCbG9ja0hpc3Rvcnkoc2NvcGU6c3RyaW5nLCBwYWdlOm51bWJlciA9IDAsIHBhZ2VzaXplOm51bWJlciA9IDI1KTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuICAgICAgICB2YXIgY2Fub25pY2FsOnN0cmluZyA9IHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpO1xuICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLmdldEJsb2NrSGlzdG9yeVRvdGFsUGFnZXNGb3IoY2Fub25pY2FsLCBwYWdlc2l6ZSk7XG4gICAgICAgIHZhciBpZCA9IHBhZ2UqcGFnZXNpemU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmZldGNoQmxvY2tIaXN0b3J5KFwiLCBzY29wZSwgXCIsXCIscGFnZSxcIixcIixwYWdlc2l6ZSxcIik6IGlkOlwiLCBpZCwgXCJwYWdlczpcIiwgcGFnZXMpO1xuICAgICAgICBpZiAocGFnZSA8IHBhZ2VzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbWFya2V0cyAmJiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gJiYgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmJsb2NrW1wiaWQtXCIgKyBpZF0pIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0OlRhYmxlUmVzdWx0ID0ge21vcmU6ZmFsc2Uscm93czpbXX07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHBhZ2VzaXplOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkX2kgPSBpZCtpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmxvY2sgPSB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uYmxvY2tbXCJpZC1cIiArIGlkX2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5yb3dzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5yb3dzLmxlbmd0aCA9PSBwYWdlc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBoYXZlIHRoZSBjb21wbGV0ZSBwYWdlIGluIG1lbW9yeVxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5mZXRjaEhpc3RvcnkoXCIsIHNjb3BlLCBcIixcIixwYWdlLFwiLFwiLHBhZ2VzaXplLFwiKTogcmVzdWx0OlwiLCByZXN1bHQucm93cy5tYXAoKHsgaWQgfSkgPT4gaWQpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcImJsb2NraGlzdG9yeVwiLCB7c2NvcGU6Y2Fub25pY2FsLCBsaW1pdDpwYWdlc2l6ZSwgbG93ZXJfYm91bmQ6XCJcIisocGFnZSpwYWdlc2l6ZSl9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJibG9jayBIaXN0b3J5IGNydWRvOlwiLCByZXN1bHQpO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdID0gdGhpcy5hdXhBc3NlcnRTY29wZShjYW5vbmljYWwpO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmJsb2NrID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmJsb2NrIHx8IHt9OyBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGhpcy5fbWFya2V0c1tzY29wZV0uYmxvY2s6XCIsIHRoaXMuX21hcmtldHNbc2NvcGVdLmJsb2NrKTtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaSA8IHJlc3VsdC5yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJsb2NrOkhpc3RvcnlCbG9jayA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHJlc3VsdC5yb3dzW2ldLmlkLFxuICAgICAgICAgICAgICAgICAgICBob3VyOiByZXN1bHQucm93c1tpXS5ob3VyLFxuICAgICAgICAgICAgICAgICAgICBzdHI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlOiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0ucHJpY2UsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uaW52ZXJzZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGVudHJhbmNlOiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uZW50cmFuY2UsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBtYXg6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5tYXgsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBtaW46IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5taW4sIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICB2b2x1bWU6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS52b2x1bWUsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBhbW91bnQ6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5hbW91bnQsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShyZXN1bHQucm93c1tpXS5kYXRlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBibG9jay5zdHIgPSBKU09OLnN0cmluZ2lmeShbYmxvY2subWF4LnN0ciwgYmxvY2suZW50cmFuY2Uuc3RyLCBibG9jay5wcmljZS5zdHIsIGJsb2NrLm1pbi5zdHJdKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uYmxvY2tbXCJpZC1cIiArIGJsb2NrLmlkXSA9IGJsb2NrO1xuICAgICAgICAgICAgfSAgIFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJibG9jayBIaXN0b3J5IGZpbmFsOlwiLCB0aGlzLl9tYXJrZXRzW3Njb3BlXS5ibG9jayk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICB9ICAgIFxuXG4gICAgcHJpdmF0ZSBmZXRjaEhpc3Rvcnkoc2NvcGU6c3RyaW5nLCBwYWdlOm51bWJlciA9IDAsIHBhZ2VzaXplOm51bWJlciA9IDI1KTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuICAgICAgICB2YXIgY2Fub25pY2FsOnN0cmluZyA9IHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpO1xuICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLmdldEhpc3RvcnlUb3RhbFBhZ2VzRm9yKGNhbm9uaWNhbCwgcGFnZXNpemUpO1xuICAgICAgICB2YXIgaWQgPSBwYWdlKnBhZ2VzaXplO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5mZXRjaEhpc3RvcnkoXCIsIHNjb3BlLCBcIixcIixwYWdlLFwiLFwiLHBhZ2VzaXplLFwiKTogaWQ6XCIsIGlkLCBcInBhZ2VzOlwiLCBwYWdlcyk7XG4gICAgICAgIGlmIChwYWdlIDwgcGFnZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXJrZXRzICYmIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSAmJiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0udHhbXCJpZC1cIiArIGlkXSkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQ6VGFibGVSZXN1bHQgPSB7bW9yZTpmYWxzZSxyb3dzOltdfTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8cGFnZXNpemU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWRfaSA9IGlkK2k7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0cnggPSB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0udHhbXCJpZC1cIiArIGlkX2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHJ4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucm93cy5wdXNoKHRyeCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnJvd3MubGVuZ3RoID09IHBhZ2VzaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGhhdmUgdGhlIGNvbXBsZXRlIHBhZ2UgaW4gbWVtb3J5XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmZldGNoSGlzdG9yeShcIiwgc2NvcGUsIFwiLFwiLHBhZ2UsXCIsXCIscGFnZXNpemUsXCIpOiByZXN1bHQ6XCIsIHJlc3VsdC5yb3dzLm1hcCgoeyBpZCB9KSA9PiBpZCkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwiaGlzdG9yeVwiLCB7c2NvcGU6c2NvcGUsIGxpbWl0OnBhZ2VzaXplLCBsb3dlcl9ib3VuZDpcIlwiKyhwYWdlKnBhZ2VzaXplKX0pLnRoZW4ocmVzdWx0ID0+IHtcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKlwiKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiSGlzdG9yeSBjcnVkbzpcIiwgcmVzdWx0KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdID0gdGhpcy5hdXhBc3NlcnRTY29wZShjYW5vbmljYWwpO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmhpc3RvcnkgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eCA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eCB8fCB7fTsgXG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGhpcy5zY29wZXNbc2NvcGVdLnR4OlwiLCB0aGlzLnNjb3Blc1tzY29wZV0udHgpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGkgPCByZXN1bHQucm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciB0cmFuc2FjdGlvbjpIaXN0b3J5VHggPSB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiByZXN1bHQucm93c1tpXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgc3RyOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICBhbW91bnQ6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5hbW91bnQsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBwYXltZW50OiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0ucGF5bWVudCwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGJ1eWZlZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmJ1eWZlZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHNlbGxmZWU6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5zZWxsZmVlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5wcmljZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGludmVyc2U6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5pbnZlcnNlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgYnV5ZXI6IHJlc3VsdC5yb3dzW2ldLmJ1eWVyLFxuICAgICAgICAgICAgICAgICAgICBzZWxsZXI6IHJlc3VsdC5yb3dzW2ldLnNlbGxlcixcbiAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUocmVzdWx0LnJvd3NbaV0uZGF0ZSksXG4gICAgICAgICAgICAgICAgICAgIGlzYnV5OiAhIXJlc3VsdC5yb3dzW2ldLmlzYnV5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRyYW5zYWN0aW9uLnN0ciA9IHRyYW5zYWN0aW9uLnByaWNlLnN0ciArIFwiIFwiICsgdHJhbnNhY3Rpb24uYW1vdW50LnN0cjtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0udHhbXCJpZC1cIiArIHRyYW5zYWN0aW9uLmlkXSA9IHRyYW5zYWN0aW9uO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBqIGluIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5oaXN0b3J5LnB1c2godGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnR4W2pdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmhpc3Rvcnkuc29ydChmdW5jdGlvbihhOkhpc3RvcnlUeCwgYjpIaXN0b3J5VHgpe1xuICAgICAgICAgICAgICAgIGlmKGEuZGF0ZSA8IGIuZGF0ZSkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgaWYoYS5kYXRlID4gYi5kYXRlKSByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgaWYoYS5pZCA8IGIuaWQpIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmKGEuaWQgPiBiLmlkKSByZXR1cm4gLTE7XG4gICAgICAgICAgICB9KTsgICAgICAgICAgICBcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJIaXN0b3J5IGZpbmFsOlwiLCB0aGlzLnNjb3Blc1tzY29wZV0uaGlzdG9yeSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBhc3luYyBmZXRjaEFjdGl2aXR5KHBhZ2U6bnVtYmVyID0gMCwgcGFnZXNpemU6bnVtYmVyID0gMjUpIHtcbiAgICAgICAgdmFyIGlkID0gcGFnZSpwYWdlc2l6ZSsxO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5mZXRjaEFjdGl2aXR5KFwiLCBwYWdlLFwiLFwiLHBhZ2VzaXplLFwiKTogaWQ6XCIsIGlkKTtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLmFjdGl2aXR5LmV2ZW50c1tcImlkLVwiICsgaWRdKSB7XG4gICAgICAgICAgICB2YXIgcGFnZUV2ZW50cyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHBhZ2VzaXplOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaWRfaSA9IGlkK2k7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gdGhpcy5hY3Rpdml0eS5ldmVudHNbXCJpZC1cIiArIGlkX2ldO1xuICAgICAgICAgICAgICAgIGlmICghZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhZ2VFdmVudHMubGVuZ3RoID09IHBhZ2VzaXplKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcbiAgICAgICAgfSAgICAgICAgXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJldmVudHNcIiwge2xpbWl0OnBhZ2VzaXplLCBsb3dlcl9ib3VuZDpcIlwiK2lkfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKlwiKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQWN0aXZpdHkgY3J1ZG86XCIsIHJlc3VsdCk7XG4gICAgICAgICAgICB2YXIgbGlzdDpFdmVudExvZ1tdID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaSA8IHJlc3VsdC5yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcmVzdWx0LnJvd3NbaV0uaWQ7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50OkV2ZW50TG9nID0gPEV2ZW50TG9nPnJlc3VsdC5yb3dzW2ldO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5hY3Rpdml0eS5ldmVudHNbXCJpZC1cIiArIGlkXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2aXR5LmV2ZW50c1tcImlkLVwiICsgaWRdID0gZXZlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKio+Pj4+PlwiLCBpZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmFjdGl2aXR5Lmxpc3QgPSBbXS5jb25jYXQodGhpcy5hY3Rpdml0eS5saXN0KS5jb25jYXQobGlzdCk7XG4gICAgICAgICAgICB0aGlzLmFjdGl2aXR5Lmxpc3Quc29ydChmdW5jdGlvbihhOkV2ZW50TG9nLCBiOkV2ZW50TG9nKXtcbiAgICAgICAgICAgICAgICBpZihhLmRhdGUgPCBiLmRhdGUpIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmKGEuZGF0ZSA+IGIuZGF0ZSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIGlmKGEuaWQgPCBiLmlkKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBpZihhLmlkID4gYi5pZCkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIGZldGNoVXNlck9yZGVycyh1c2VyOnN0cmluZyk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJ1c2Vyb3JkZXJzXCIsIHtzY29wZTp1c2VyLCBsaW1pdDoyMDB9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBmZXRjaFN1bW1hcnkoc2NvcGUpOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwidGFibGVzdW1tYXJ5XCIsIHtzY29wZTpzY29wZX0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hUb2tlblN0YXRzKHRva2VuKTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInRva2VuLXN0YXQtXCIrdG9rZW4uc3ltYm9sLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJzdGF0XCIsIHtjb250cmFjdDp0b2tlbi5jb250cmFjdCwgc2NvcGU6dG9rZW4uc3ltYm9sfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgdG9rZW4uc3RhdCA9IHJlc3VsdC5yb3dzWzBdO1xuICAgICAgICAgICAgaWYgKHRva2VuLnN0YXQuaXNzdWVycyAmJiB0b2tlbi5zdGF0Lmlzc3VlcnNbMF0gPT0gXCJldmVyeW9uZVwiKSB7XG4gICAgICAgICAgICAgICAgdG9rZW4uZmFrZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInRva2VuLXN0YXQtXCIrdG9rZW4uc3ltYm9sLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hUb2tlbnNTdGF0cyhleHRlbmRlZDogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWUuZmV0Y2hUb2tlbnMoKVwiKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ0b2tlbi1zdGF0c1wiLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKF8gPT4ge1xuXG4gICAgICAgICAgICB2YXIgcHJpb21pc2VzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMudG9rZW5zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudG9rZW5zW2ldLm9mZmNoYWluKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBwcmlvbWlzZXMucHVzaCh0aGlzLmZldGNoVG9rZW5TdGF0cyh0aGlzLnRva2Vuc1tpXSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGw8YW55PihwcmlvbWlzZXMpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRva2VuU3RhdHModGhpcy50b2tlbnMpO1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidG9rZW4tc3RhdHNcIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2VucztcbiAgICAgICAgICAgIH0pOyAgICAgICAgICAgIFxuICAgICAgICB9KTtcblxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHVwZGF0ZVRva2Vuc1N1bW1hcnkodGltZXM6IG51bWJlciA9IDIwKSB7XG4gICAgICAgIGlmICh0aW1lcyA+IDEpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSB0aW1lczsgaT4wOyBpLS0pIHRoaXMudXBkYXRlVG9rZW5zU3VtbWFyeSgxKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMud2FpdFRva2Vuc0xvYWRlZCxcbiAgICAgICAgICAgIHRoaXMud2FpdE1hcmtldFN1bW1hcnlcbiAgICAgICAgXSkudGhlbihfID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKGluaSkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWUudXBkYXRlVG9rZW5zU3VtbWFyeSgpXCIpOyBcblxuICAgICAgICAgICAgLy8gbWFwcGluZyBvZiBob3cgbXVjaCAoYW1vdW50IG9mKSB0b2tlbnMgaGF2ZSBiZWVuIHRyYWRlZCBhZ3JlZ2F0ZWQgaW4gYWxsIG1hcmtldHNcbiAgICAgICAgICAgIHZhciBhbW91bnRfbWFwOntba2V5OnN0cmluZ106QXNzZXRERVh9ID0ge307XG5cbiAgICAgICAgICAgIC8vIGEgY2FkYSB0b2tlbiBsZSBhc2lnbm8gdW4gcHJpY2UgcXVlIHNhbGUgZGUgdmVyaWZpY2FyIHN1IHByaWNlIGVuIGVsIG1lcmNhZG8gcHJpbmNpcGFsIFhYWC9UTE9TXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMudG9rZW5zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudG9rZW5zW2ldLm9mZmNoYWluKSBjb250aW51ZTsgLy8gZGlzY2FyZCB0b2tlbnMgdGhhdCBhcmUgbm90IG9uLWNoYWluXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHRva2VuID0gdGhpcy50b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgdmFyIHF1YW50aXR5OkFzc2V0REVYID0gbmV3IEFzc2V0REVYKDAsIHRva2VuKTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gdGhpcy5fbWFya2V0cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoai5pbmRleE9mKFwiLlwiKSA9PSAtMSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZTpNYXJrZXQgPSB0aGlzLl9tYXJrZXRzW2pdO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmNvbW9kaXR5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gcXVhbnRpdHkucGx1cyh0YWJsZS5zdW1tYXJ5LmFtb3VudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gcXVhbnRpdHkucGx1cyh0YWJsZS5zdW1tYXJ5LnZvbHVtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY29tb2RpdHkuc3ltYm9sID09IHRva2VuLnN5bWJvbCAmJiB0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdGhpcy50ZWxvcy5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbi5zdW1tYXJ5ICYmIHRva2VuLnN1bW1hcnkucHJpY2UuYW1vdW50LnRvTnVtYmVyKCkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5zdW1tYXJ5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbi5zdW1tYXJ5ID0gdG9rZW4uc3VtbWFyeSB8fCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHRhYmxlLnN1bW1hcnkucHJpY2UuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZV8yNGhfYWdvOiB0YWJsZS5zdW1tYXJ5LnByaWNlXzI0aF9hZ28uY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWU6IHRhYmxlLnN1bW1hcnkudm9sdW1lLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyY2VudDogdGFibGUuc3VtbWFyeS5wZXJjZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmNlbnRfc3RyOiB0YWJsZS5zdW1tYXJ5LnBlcmNlbnRfc3RyLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYW1vdW50X21hcFt0b2tlbi5zeW1ib2xdID0gcXVhbnRpdHk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudGVsb3Muc3VtbWFyeSA9IHtcbiAgICAgICAgICAgICAgICBwcmljZTogbmV3IEFzc2V0REVYKDEsIHRoaXMudGVsb3MpLFxuICAgICAgICAgICAgICAgIHByaWNlXzI0aF9hZ286IG5ldyBBc3NldERFWCgxLCB0aGlzLnRlbG9zKSxcbiAgICAgICAgICAgICAgICB2b2x1bWU6IG5ldyBBc3NldERFWCgtMSwgdGhpcy50ZWxvcyksXG4gICAgICAgICAgICAgICAgcGVyY2VudDogMCxcbiAgICAgICAgICAgICAgICBwZXJjZW50X3N0cjogXCIwJVwiXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYW1vdW50X21hcDogXCIsIGFtb3VudF9tYXApO1xuXG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIE9ORSA9IG5ldyBCaWdOdW1iZXIoMSk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy50b2tlbnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLnRva2Vuc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4ub2ZmY2hhaW4pIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmICghdG9rZW4uc3VtbWFyeSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuLnN5bWJvbCA9PSB0aGlzLnRlbG9zLnN5bWJvbCkgY29udGludWU7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJUT0tFTjogLS0tLS0tLS0gXCIsIHRva2VuLnN5bWJvbCwgdG9rZW4uc3VtbWFyeS5wcmljZS5zdHIsIHRva2VuLnN1bW1hcnkucHJpY2VfMjRoX2Fnby5zdHIgKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgdm9sdW1lID0gbmV3IEFzc2V0REVYKDAsIHRoaXMudGVsb3MpO1xuICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IG5ldyBBc3NldERFWCgwLCB0aGlzLnRlbG9zKTtcbiAgICAgICAgICAgICAgICB2YXIgcHJpY2VfaW5pdCA9IG5ldyBBc3NldERFWCgwLCB0aGlzLnRlbG9zKTtcbiAgICAgICAgICAgICAgICB2YXIgdG90YWxfcXVhbnRpdHkgPSBhbW91bnRfbWFwW3Rva2VuLnN5bWJvbF07XG5cbiAgICAgICAgICAgICAgICBpZiAodG90YWxfcXVhbnRpdHkudG9OdW1iZXIoKSA9PSAwKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIC8vIGlmICh0b2tlbi5zeW1ib2wgPT0gXCJBQ09STlwiKSBjb25zb2xlLmxvZyhcIlRPS0VOOiAtLS0tLS0tLSBcIiwgdG9rZW4uc3ltYm9sLCB0b2tlbi5zdW1tYXJ5LnByaWNlLnN0ciwgdG9rZW4uc3VtbWFyeS5wcmljZV8yNGhfYWdvLnN0ciApO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gdGhpcy5fbWFya2V0cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoai5pbmRleE9mKFwiLlwiKSA9PSAtMSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZSA9IHRoaXMuX21hcmtldHNbal07XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW5jeV9wcmljZSA9IHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSBcIlRMT1NcIiA/IE9ORSA6IHRhYmxlLmN1cnJlbmN5LnN1bW1hcnkucHJpY2UuYW1vdW50O1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVuY3lfcHJpY2VfMjRoX2FnbyA9IHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSBcIlRMT1NcIiA/IE9ORSA6IHRhYmxlLmN1cnJlbmN5LnN1bW1hcnkucHJpY2VfMjRoX2Fnby5hbW91bnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sIHx8IHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaG93IG11Y2ggcXVhbnRpdHkgaXMgaW52b2x2ZWQgaW4gdGhpcyBtYXJrZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBxdWFudGl0eSA9IG5ldyBBc3NldERFWCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmNvbW9kaXR5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eSA9IHRhYmxlLnN1bW1hcnkuYW1vdW50LmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eSA9IHRhYmxlLnN1bW1hcnkudm9sdW1lLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgaW5mbHVlbmNlLXdlaWdodCBvZiB0aGlzIG1hcmtldCBvdmVyIHRoZSB0b2tlblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHdlaWdodCA9IHF1YW50aXR5LmFtb3VudC5kaXZpZGVkQnkodG90YWxfcXVhbnRpdHkuYW1vdW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBwcmljZSBvZiB0aGlzIHRva2VuIGluIHRoaXMgbWFya2V0IChleHByZXNzZWQgaW4gVExPUylcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmljZV9hbW91bnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY29tb2RpdHkuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2Ftb3VudCA9IHRhYmxlLnN1bW1hcnkucHJpY2UuYW1vdW50Lm11bHRpcGxpZWRCeSh0YWJsZS5jdXJyZW5jeS5zdW1tYXJ5LnByaWNlLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZV9hbW91bnQgPSB0YWJsZS5zdW1tYXJ5LmludmVyc2UuYW1vdW50Lm11bHRpcGxpZWRCeSh0YWJsZS5jb21vZGl0eS5zdW1tYXJ5LnByaWNlLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGlzIG1hcmtldCB0b2tlbiBwcmljZSBtdWx0aXBsaWVkIGJ5IHRoZSB3aWdodCBvZiB0aGlzIG1hcmtldCAocG9uZGVyYXRlZCBwcmljZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmljZV9pID0gbmV3IEFzc2V0REVYKHByaWNlX2Ftb3VudC5tdWx0aXBsaWVkQnkod2VpZ2h0KSwgdGhpcy50ZWxvcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgcHJpY2Ugb2YgdGhpcyB0b2tlbiBpbiB0aGlzIG1hcmtldCAyNGggYWdvIChleHByZXNzZWQgaW4gVExPUylcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmljZV9pbml0X2Ftb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfaW5pdF9hbW91bnQgPSB0YWJsZS5zdW1tYXJ5LnByaWNlXzI0aF9hZ28uYW1vdW50Lm11bHRpcGxpZWRCeSh0YWJsZS5jdXJyZW5jeS5zdW1tYXJ5LnByaWNlXzI0aF9hZ28uYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2luaXRfYW1vdW50ID0gdGFibGUuc3VtbWFyeS5pbnZlcnNlXzI0aF9hZ28uYW1vdW50Lm11bHRpcGxpZWRCeSh0YWJsZS5jb21vZGl0eS5zdW1tYXJ5LnByaWNlXzI0aF9hZ28uYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoaXMgbWFya2V0IHRva2VuIHByaWNlIDI0aCBhZ28gbXVsdGlwbGllZCBieSB0aGUgd2VpZ2h0IG9mIHRoaXMgbWFya2V0IChwb25kZXJhdGVkIGluaXRfcHJpY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJpY2VfaW5pdF9pID0gbmV3IEFzc2V0REVYKHByaWNlX2luaXRfYW1vdW50Lm11bHRpcGxpZWRCeSh3ZWlnaHQpLCB0aGlzLnRlbG9zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaG93IG11Y2ggdm9sdW1lIGlzIGludm9sdmVkIGluIHRoaXMgbWFya2V0XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdm9sdW1lX2k7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY29tb2RpdHkuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZV9pID0gdGFibGUuc3VtbWFyeS52b2x1bWUuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZV9pID0gdGFibGUuc3VtbWFyeS5hbW91bnQuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhpcyBtYXJrZXQgZG9lcyBub3QgbWVzdXJlIHRoZSB2b2x1bWUgaW4gVExPUywgdGhlbiBjb252ZXJ0IHF1YW50aXR5IHRvIFRMT1MgYnkgbXVsdGlwbGllZCBCeSB2b2x1bWUncyB0b2tlbiBwcmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZvbHVtZV9pLnRva2VuLnN5bWJvbCAhPSB0aGlzLnRlbG9zLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZV9pID0gbmV3IEFzc2V0REVYKHF1YW50aXR5LmFtb3VudC5tdWx0aXBsaWVkQnkocXVhbnRpdHkudG9rZW4uc3VtbWFyeS5wcmljZS5hbW91bnQpLCB0aGlzLnRlbG9zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZSA9IHByaWNlLnBsdXMobmV3IEFzc2V0REVYKHByaWNlX2ksIHRoaXMudGVsb3MpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2luaXQgPSBwcmljZV9pbml0LnBsdXMobmV3IEFzc2V0REVYKHByaWNlX2luaXRfaSwgdGhpcy50ZWxvcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lID0gdm9sdW1lLnBsdXMobmV3IEFzc2V0REVYKHZvbHVtZV9pLCB0aGlzLnRlbG9zKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLWlcIixpLCB0YWJsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gd2VpZ2h0OlwiLCB3ZWlnaHQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gdGFibGUuc3VtbWFyeS5wcmljZS5zdHJcIiwgdGFibGUuc3VtbWFyeS5wcmljZS5zdHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHRhYmxlLnN1bW1hcnkucHJpY2UuYW1vdW50Lm11bHRpcGxpZWRCeSh3ZWlnaHQpLnRvTnVtYmVyKClcIiwgdGFibGUuc3VtbWFyeS5wcmljZS5hbW91bnQubXVsdGlwbGllZEJ5KHdlaWdodCkudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gY3VycmVuY3lfcHJpY2UudG9OdW1iZXIoKVwiLCBjdXJyZW5jeV9wcmljZS50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSBwcmljZV9pOlwiLCBwcmljZV9pLnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHByaWNlIC0+XCIsIHByaWNlLnN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gY3VycmVuY3lfcHJpY2VfMjRoX2FnbzpcIiwgY3VycmVuY3lfcHJpY2VfMjRoX2Fnby50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSB0YWJsZS5zdW1tYXJ5LnByaWNlXzI0aF9hZ286XCIsIHRhYmxlLnN1bW1hcnkucHJpY2VfMjRoX2Fnby5zdHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHByaWNlX2luaXRfaTpcIiwgcHJpY2VfaW5pdF9pLnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHByaWNlX2luaXQgLT5cIiwgcHJpY2VfaW5pdC5zdHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBkaWZmID0gcHJpY2UubWludXMocHJpY2VfaW5pdCk7XG4gICAgICAgICAgICAgICAgdmFyIHJhdGlvOm51bWJlciA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKHByaWNlX2luaXQuYW1vdW50LnRvTnVtYmVyKCkgIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByYXRpbyA9IGRpZmYuYW1vdW50LmRpdmlkZWRCeShwcmljZV9pbml0LmFtb3VudCkudG9OdW1iZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnQgPSBNYXRoLmZsb29yKHJhdGlvICogMTAwMDApIC8gMTAwO1xuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50X3N0ciA9IChpc05hTihwZXJjZW50KSA/IDAgOiBwZXJjZW50KSArIFwiJVwiO1xuXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwcmljZVwiLCBwcmljZS5zdHIpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicHJpY2VfMjRoX2Fnb1wiLCBwcmljZV9pbml0LnN0cik7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ2b2x1bWVcIiwgdm9sdW1lLnN0cik7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwZXJjZW50XCIsIHBlcmNlbnQpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicGVyY2VudF9zdHJcIiwgcGVyY2VudF9zdHIpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmF0aW9cIiwgcmF0aW8pO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZGlmZlwiLCBkaWZmLnN0cik7XG5cbiAgICAgICAgICAgICAgICB0b2tlbi5zdW1tYXJ5LnByaWNlID0gcHJpY2U7XG4gICAgICAgICAgICAgICAgdG9rZW4uc3VtbWFyeS5wcmljZV8yNGhfYWdvID0gcHJpY2VfaW5pdDtcbiAgICAgICAgICAgICAgICB0b2tlbi5zdW1tYXJ5LnBlcmNlbnQgPSBwZXJjZW50O1xuICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkucGVyY2VudF9zdHIgPSBwZXJjZW50X3N0cjtcbiAgICAgICAgICAgICAgICB0b2tlbi5zdW1tYXJ5LnZvbHVtZSA9IHZvbHVtZTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIihlbmQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIHRoaXMucmVzb3J0VG9rZW5zKCk7XG4gICAgICAgICAgICB0aGlzLnNldFRva2VuU3VtbWFyeSgpO1xuICAgICAgICB9KTsgICAgICAgIFxuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hUb2tlbnMoZXh0ZW5kZWQ6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlLmZldGNoVG9rZW5zKClcIik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJ0b2tlbnNcIikudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgdG9rZW5zOiA8VG9rZW5ERVhbXT5yZXN1bHQucm93c1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGRhdGEudG9rZW5zKSB7XG4gICAgICAgICAgICAgICAgZGF0YS50b2tlbnNbaV0uc2NvcGUgPSBkYXRhLnRva2Vuc1tpXS5zeW1ib2wudG9Mb3dlckNhc2UoKSArIFwiLnRsb3NcIjtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS50b2tlbnNbaV0uc3ltYm9sID09IFwiVExPU1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGVsb3MgPSBkYXRhLnRva2Vuc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc29ydFRva2VucygpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCIoaW5pKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmVzb3J0VG9rZW5zKClcIik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGhpcy50b2tlbnNbMF1cIiwgdGhpcy50b2tlbnNbMF0uc3VtbWFyeSk7XG4gICAgICAgIHRoaXMudG9rZW5zLnNvcnQoKGE6VG9rZW5ERVgsIGI6VG9rZW5ERVgpID0+IHtcbiAgICAgICAgICAgIC8vIHB1c2ggb2ZmY2hhaW4gdG9rZW5zIHRvIHRoZSBlbmQgb2YgdGhlIHRva2VuIGxpc3RcbiAgICAgICAgICAgIGlmIChhLm9mZmNoYWluKSByZXR1cm4gMTtcbiAgICAgICAgICAgIGlmIChiLm9mZmNoYWluKSByZXR1cm4gLTE7XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiIC0tLSBcIiwgYS5zeW1ib2wsIFwiLVwiLCBiLnN5bWJvbCwgXCIgLS0tIFwiKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiICAgICBcIiwgYS5zdW1tYXJ5ID8gYS5zdW1tYXJ5LnZvbHVtZS5zdHIgOiBcIjBcIiwgXCItXCIsIGIuc3VtbWFyeSA/IGIuc3VtbWFyeS52b2x1bWUuc3RyIDogXCIwXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgYV92b2wgPSBhLnN1bW1hcnkgPyBhLnN1bW1hcnkudm9sdW1lIDogbmV3IEFzc2V0REVYKCk7XG4gICAgICAgICAgICB2YXIgYl92b2wgPSBiLnN1bW1hcnkgPyBiLnN1bW1hcnkudm9sdW1lIDogbmV3IEFzc2V0REVYKCk7XG5cbiAgICAgICAgICAgIGlmKGFfdm9sLmFtb3VudC5pc0dyZWF0ZXJUaGFuKGJfdm9sLmFtb3VudCkpIHJldHVybiAtMTtcbiAgICAgICAgICAgIGlmKGFfdm9sLmFtb3VudC5pc0xlc3NUaGFuKGJfdm9sLmFtb3VudCkpIHJldHVybiAxO1xuXG4gICAgICAgICAgICBpZihhLmFwcG5hbWUgPCBiLmFwcG5hbWUpIHJldHVybiAtMTtcbiAgICAgICAgICAgIGlmKGEuYXBwbmFtZSA+IGIuYXBwbmFtZSkgcmV0dXJuIDE7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSk7IFxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmVzb3J0VG9rZW5zKClcIiwgdGhpcy50b2tlbnMpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIihlbmQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcblxuICAgICAgICB0aGlzLm9uVG9rZW5zUmVhZHkubmV4dCh0aGlzLnRva2Vucyk7ICAgICAgICBcbiAgICB9XG5cblxufVxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFya2V0TWFwIHtcbiAgICBba2V5OnN0cmluZ106IE1hcmtldDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNYXJrZXQge1xuICAgIHNjb3BlOiBzdHJpbmc7XG4gICAgY29tb2RpdHk6IFRva2VuREVYLFxuICAgIGN1cnJlbmN5OiBUb2tlbkRFWCxcbiAgICBkZWFsczogbnVtYmVyO1xuICAgIGJsb2NrczogbnVtYmVyO1xuICAgIGJsb2NrbGV2ZWxzOiBhbnlbXVtdW107XG4gICAgYmxvY2tsaXN0OiBhbnlbXVtdO1xuICAgIHJldmVyc2VsZXZlbHM6IGFueVtdW11bXTtcbiAgICByZXZlcnNlYmxvY2tzOiBhbnlbXVtdO1xuICAgIGJsb2NrOiB7W2lkOnN0cmluZ106SGlzdG9yeUJsb2NrfTtcbiAgICBvcmRlcnM6IFRva2VuT3JkZXJzO1xuICAgIGhpc3Rvcnk6IEhpc3RvcnlUeFtdO1xuICAgIHR4OiB7W2lkOnN0cmluZ106SGlzdG9yeVR4fTtcbiAgICBcbiAgICBzdW1tYXJ5OiBNYXJrZXRTdW1tYXJ5O1xuICAgIGhlYWRlcjogTWFya2V0SGVhZGVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1hcmtldFN1bW1hcnkge1xuICAgIHNjb3BlOnN0cmluZyxcbiAgICBwcmljZTpBc3NldERFWCxcbiAgICBpbnZlcnNlOkFzc2V0REVYLFxuICAgIHByaWNlXzI0aF9hZ286QXNzZXRERVgsXG4gICAgaW52ZXJzZV8yNGhfYWdvOkFzc2V0REVYLFxuICAgIG1pbl9wcmljZT86QXNzZXRERVgsXG4gICAgbWF4X3ByaWNlPzpBc3NldERFWCxcbiAgICBtaW5faW52ZXJzZT86QXNzZXRERVgsXG4gICAgbWF4X2ludmVyc2U/OkFzc2V0REVYLFxuICAgIHZvbHVtZTpBc3NldERFWCxcbiAgICBhbW91bnQ/OkFzc2V0REVYLFxuICAgIHBlcmNlbnQ/Om51bWJlcixcbiAgICBwZXJjZW50X3N0cj86c3RyaW5nLFxuICAgIGlwZXJjZW50PzpudW1iZXIsXG4gICAgaXBlcmNlbnRfc3RyPzpzdHJpbmcsXG4gICAgcmVjb3Jkcz86IGFueVtdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFya2V0SGVhZGVyIHtcbiAgICBzZWxsOk9yZGVyc1N1bW1hcnksXG4gICAgYnV5Ok9yZGVyc1N1bW1hcnlcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPcmRlcnNTdW1tYXJ5IHtcbiAgICB0b3RhbDogQXNzZXRERVg7XG4gICAgb3JkZXJzOiBudW1iZXI7ICAgIFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRva2VuT3JkZXJzIHtcbiAgICBzZWxsOk9yZGVyUm93W10sXG4gICAgYnV5Ok9yZGVyUm93W11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBIaXN0b3J5VHgge1xuICAgIGlkOiBudW1iZXI7XG4gICAgc3RyOiBzdHJpbmc7XG4gICAgcHJpY2U6IEFzc2V0REVYO1xuICAgIGludmVyc2U6IEFzc2V0REVYO1xuICAgIGFtb3VudDogQXNzZXRERVg7XG4gICAgcGF5bWVudDogQXNzZXRERVg7XG4gICAgYnV5ZmVlOiBBc3NldERFWDtcbiAgICBzZWxsZmVlOiBBc3NldERFWDtcbiAgICBidXllcjogc3RyaW5nO1xuICAgIHNlbGxlcjogc3RyaW5nO1xuICAgIGRhdGU6IERhdGU7XG4gICAgaXNidXk6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRMb2cge1xuICAgIGlkOiBudW1iZXI7XG4gICAgdXNlcjogc3RyaW5nO1xuICAgIGV2ZW50OiBzdHJpbmc7XG4gICAgcGFyYW1zOiBzdHJpbmc7XG4gICAgZGF0ZTogRGF0ZTtcbiAgICBwcm9jZXNzZWQ/OiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSGlzdG9yeUJsb2NrIHtcbiAgICBpZDogbnVtYmVyO1xuICAgIGhvdXI6IG51bWJlcjtcbiAgICBzdHI6IHN0cmluZztcbiAgICBwcmljZTogQXNzZXRERVg7XG4gICAgaW52ZXJzZTogQXNzZXRERVg7XG4gICAgZW50cmFuY2U6IEFzc2V0REVYO1xuICAgIG1heDogQXNzZXRERVg7XG4gICAgbWluOiBBc3NldERFWDtcbiAgICB2b2x1bWU6IEFzc2V0REVYO1xuICAgIGFtb3VudDogQXNzZXRERVg7XG4gICAgZGF0ZTogRGF0ZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPcmRlciB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICBwcmljZTogQXNzZXRERVg7XG4gICAgaW52ZXJzZTogQXNzZXRERVg7XG4gICAgdG90YWw6IEFzc2V0REVYO1xuICAgIGRlcG9zaXQ6IEFzc2V0REVYO1xuICAgIHRlbG9zOiBBc3NldERFWDtcbiAgICBvd25lcjogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJPcmRlcnNNYXAge1xuICAgIFtrZXk6c3RyaW5nXTogVXNlck9yZGVycztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVc2VyT3JkZXJzIHtcbiAgICB0YWJsZTogc3RyaW5nO1xuICAgIGlkczogbnVtYmVyW107XG4gICAgb3JkZXJzPzphbnlbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPcmRlclJvdyB7XG4gICAgc3RyOiBzdHJpbmc7XG4gICAgcHJpY2U6IEFzc2V0REVYO1xuICAgIG9yZGVyczogT3JkZXJbXTtcbiAgICBpbnZlcnNlOiBBc3NldERFWDtcbiAgICB0b3RhbDogQXNzZXRERVg7XG4gICAgc3VtOiBBc3NldERFWDtcbiAgICBzdW10ZWxvczogQXNzZXRERVg7XG4gICAgdGVsb3M6IEFzc2V0REVYO1xuICAgIG93bmVyczoge1trZXk6c3RyaW5nXTpib29sZWFufVxufSIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBWYXBhZWVERVggfSBmcm9tICcuL2RleC5zZXJ2aWNlJ1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW10sXG4gIHByb3ZpZGVyczogW1ZhcGFlZURFWF0sXG4gIGV4cG9ydHM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFZhcGFlZURleE1vZHVsZSB7IH1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLGNBaUNzQixTQUFRLEtBQUs7Ozs7SUErQi9CLFlBQVksTUFBVSxJQUFJO1FBQ3RCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksT0FBTyxHQUFHLElBQUksUUFBUSxFQUFFO1lBQ3hCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNsQixPQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUM7WUFDckIsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQzVCO1FBQ0QsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ25CO0NBR0o7Ozs7OztBQzVFRCxjQVFzQixTQUFRLEtBQUs7Ozs7O0lBSS9CLFlBQVksSUFBUyxJQUFJLEVBQUUsSUFBUyxJQUFJO1FBQ3BDLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFFWCxJQUFJLENBQUMsWUFBWSxRQUFRLEVBQUU7WUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsT0FBTztTQUNWO1FBRUQsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztTQUN0QjtLQUVKOzs7O0lBRUQsS0FBSztRQUNELE9BQU8sSUFBSSxRQUFRLENBQUMsSUFB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LEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztnQ0FDeEQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7NkJBQ2xDO3lCQUNKOzt3QkFDRCxJQUFJLEdBQUcsQ0FBTzs7d0JBRWQsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ2QsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO3dCQUN0QyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7d0JBQzNDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzt3QkFDeEMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO3dCQUN0QyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7d0JBRTNCLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNkLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7d0JBQzFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7d0JBQy9DLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7d0JBQzVDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFDLEtBQUssQ0FBQyxH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LEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ3JDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ25CLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ25CLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDeEM7NEJBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7NEJBR3RCLEdBQUcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzNCLEdBQUcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUM3QixNQUFNLEdBQUcsRUFBRSxDQUFDOzRCQUNaLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dDQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzNDLElBQUksR0FBRyxFQUFFO2dDQUNMLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDM0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUNyQyxNQUFN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