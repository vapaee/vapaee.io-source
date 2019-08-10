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
        this.onTopMarketsReady = new Subject();
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
            this.tokens = [];
            /** @type {?} */
            let carbon;
            for (let i in data.tokens) {
                /** @type {?} */
                let tdata = data.tokens[i];
                /** @type {?} */
                let token = new TokenDEX(tdata);
                this.tokens.push(token);
                if (token.symbol == "TLOS") {
                    this.telos = token;
                }
                if (token.symbol == "CUSD") {
                    carbon = token;
                }
            }
            // hardoded temporary inserted tokens ------------------------------
            /*
                        let carbon = new TokenDEX({
                            appname: "Carbon",
                            contract: "stablecarbon",
                            logo: "/assets/logos/carbon.svg",
                            logolg: "/assets/logos/carbon.svg",
                            precision: 2,
                            scope: "cusd.tlos",
                            symbol: "CUSD",
                            verified: false,
                            website: "https://www.carbon.money"
                        });
                        this.tokens.push(carbon);
                        */
            // TODO: make this dynamic and not hardcoded ----------------
            this.currencies = [this.telos, carbon];
            // ----------------------------------------------------------
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
                this.updateTokensMarkets();
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
        return this.reverse(scope);
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
            direct: table.inverse,
            inverse: table.direct,
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
                this.getMarketSummary(comodity, currency, true).then(_ => this.feed.setMarck(chrono_key, "getMarketSummary()")),
                this.getOrderSummary().then(_ => this.feed.setMarck(chrono_key, "getOrderSummary()")),
            ]).then(r => {
                this._reverse = {};
                this.resortTokens();
                this.resortTopMarkets();
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
        });
    }
    /**
     * @param {?} token_a
     * @param {?} token_b
     * @param {?=} force
     * @return {?}
     */
    getMarketSummary(token_a, token_b, force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            var scope = this.getScopeFor(token_a, token_b);
            /** @type {?} */
            var canonical = this.canonicalScope(scope);
            /** @type {?} */
            var inverse = this.inverseScope(canonical);
            /** @type {?} */
            var comodity = this.auxGetComodityToken(canonical);
            /** @type {?} */
            var currency = this.auxGetCurrencyToken(canonical);
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
                            price = summary.rows[i].price;
                            inverse = summary.rows[i].inverse;
                            // price = (scope == canonical) ? summary.rows[i].price : summary.rows[i].inverse;
                            // inverse = (scope == canonical) ? summary.rows[i].inverse : summary.rows[i].price;
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
                    if (nuevo) ;
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
            this.resortTopMarkets();
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
                    var p = this.getMarketSummary(this._markets[i].comodity, this._markets[i].currency, true);
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
    auxGetCurrencyToken(scope) {
        console.assert(!!scope, "ERROR: invalid scope: '" + scope + "'");
        console.assert(scope.split(".").length == 2, "ERROR: invalid scope: '" + scope + "'");
        /** @type {?} */
        var currency_sym = scope.split(".")[1].toUpperCase();
        /** @type {?} */
        var currency = this.getTokenNow(currency_sym);
        return currency;
    }
    /**
     * @param {?} scope
     * @return {?}
     */
    auxGetComodityToken(scope) {
        console.assert(!!scope, "ERROR: invalid scope: '" + scope + "'");
        console.assert(scope.split(".").length == 2, "ERROR: invalid scope: '" + scope + "'");
        /** @type {?} */
        var comodity_sym = scope.split(".")[0].toUpperCase();
        /** @type {?} */
        var comodity = this.getTokenNow(comodity_sym);
        return comodity;
    }
    /**
     * @param {?} scope
     * @return {?}
     */
    auxAssertScope(scope) {
        /** @type {?} */
        var comodity = this.auxGetComodityToken(scope);
        /** @type {?} */
        var currency = this.auxGetCurrencyToken(scope);
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
     * @return {?}
     */
    updateTokensMarkets() {
        return Promise.all([
            this.waitTokensLoaded,
            this.waitMarketSummary
        ]).then(_ => {
            // a cada token le asigno un price que sale de verificar su price en el mercado principal XXX/TLOS
            for (var i in this.tokens) {
                if (this.tokens[i].offchain)
                    continue;
                /** @type {?} */
                var token = this.tokens[i];
                /** @type {?} */
                var quantity = new AssetDEX(0, token);
                token.markets = [];
                for (var scope in this._markets) {
                    if (scope.indexOf(".") == -1)
                        continue;
                    /** @type {?} */
                    var table = this._markets[scope];
                    if (table.currency.symbol == token.symbol) {
                        table = this.market(this.inverseScope(scope));
                    }
                    if (table.comodity.symbol == token.symbol) {
                        token.markets.push(table);
                    }
                }
            }
            token.markets.sort((a, b) => {
                /** @type {?} */
                var a_amount = a.summary ? a.summary.amount : new AssetDEX();
                /** @type {?} */
                var b_amount = b.summary ? b.summary.amount : new AssetDEX();
                console.assert(a_amount.token.symbol == b_amount.token.symbol, "ERROR: comparing two different tokens " + a_amount.str + ", " + b_amount.str);
                if (a_amount.amount.isGreaterThan(b_amount.amount))
                    return -1;
                if (a_amount.amount.isLessThan(b_amount.amount))
                    return 1;
                return 0;
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
            this.resortTokens();
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
                token.summary = token.summary || {
                    price: new AssetDEX(0, this.telos),
                    price_24h_ago: new AssetDEX(0, this.telos),
                    volume: new AssetDEX(0, this.telos),
                    percent: 0,
                    percent_str: "0%",
                };
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
            if (a.offchain || !a.verified)
                return 1;
            if (b.offchain || !b.verified)
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
    /**
     * @return {?}
     */
    resortTopMarkets() {
        this.waitTokenSummary.then(_ => {
            this.topmarkets = [];
            /** @type {?} */
            var inverse;
            /** @type {?} */
            var market;
            for (var scope in this._markets) {
                market = this._markets[scope];
                if (market.direct >= market.inverse) {
                    this.topmarkets.push(market);
                }
                else {
                    inverse = this.inverseScope(scope);
                    market = this.market(inverse);
                    this.topmarkets.push(market);
                }
            }
            this.topmarkets.sort((a, b) => {
                /** @type {?} */
                var a_vol = a.summary ? a.summary.volume : new AssetDEX();
                /** @type {?} */
                var b_vol = b.summary ? b.summary.volume : new AssetDEX();
                if (a_vol.token != this.telos) {
                    a_vol = new AssetDEX(a_vol.amount.multipliedBy(a_vol.token.summary.price.amount), this.telos);
                }
                if (b_vol.token != this.telos) {
                    b_vol = new AssetDEX(b_vol.amount.multipliedBy(b_vol.token.summary.price.amount), this.telos);
                }
                console.assert(b_vol.token == this.telos, "ERROR: volume misscalculated");
                console.assert(a_vol.token == this.telos, "ERROR: volume misscalculated");
                if (a_vol.amount.isGreaterThan(b_vol.amount))
                    return -1;
                if (a_vol.amount.isLessThan(b_vol.amount))
                    return 1;
                if (a.currency == this.telos && b.currency != this.telos)
                    return -1;
                if (b.currency == this.telos && a.currency != this.telos)
                    return 1;
                if (a.comodity.appname < b.comodity.appname)
                    return -1;
                if (a.comodity.appname > b.comodity.appname)
                    return 1;
            });
            this.onTopMarketsReady.next(this.topmarkets);
        });
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFwYWVlLWRleC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQHZhcGFlZS9kZXgvbGliL3Rva2VuLWRleC5jbGFzcy50cyIsIm5nOi8vQHZhcGFlZS9kZXgvbGliL2Fzc2V0LWRleC5jbGFzcy50cyIsIm5nOi8vQHZhcGFlZS9kZXgvbGliL2RleC5zZXJ2aWNlLnRzIiwibmc6Ly9AdmFwYWVlL2RleC9saWIvZGV4Lm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUb2tlbiB9IGZyb20gJ0B2YXBhZWUvc2NhdHRlcic7XG5pbXBvcnQgeyBBc3NldERFWCB9IGZyb20gXCIuL2Fzc2V0LWRleC5jbGFzc1wiO1xuaW1wb3J0IHsgTWFya2V0IH0gZnJvbSAnLi90eXBlcy1kZXgnO1xuXG4vKlxuZXhwb3J0IGludGVyZmFjZSBUb2tlbiB7XG4gICAgc3ltYm9sOiBzdHJpbmcsXG4gICAgcHJlY2lzaW9uPzogbnVtYmVyLFxuICAgIGNvbnRyYWN0Pzogc3RyaW5nLFxuICAgIGFwcG5hbWU/OiBzdHJpbmcsXG4gICAgd2Vic2l0ZT86IHN0cmluZyxcbiAgICBsb2dvPzogc3RyaW5nLFxuICAgIGxvZ29sZz86IHN0cmluZyxcbiAgICB2ZXJpZmllZD86IGJvb2xlYW4sXG4gICAgZmFrZT86IGJvb2xlYW4sXG4gICAgb2ZmY2hhaW4/OiBib29sZWFuLFxuICAgIHNjb3BlPzogc3RyaW5nLFxuICAgIHN0YXQ/OiB7XG4gICAgICAgIHN1cHBseTogc3RyaW5nLFxuICAgICAgICBtYXhfc3VwcGx5OiBzdHJpbmcsXG4gICAgICAgIGlzc3Vlcj86IHN0cmluZyxcbiAgICAgICAgb3duZXI/OiBzdHJpbmcsXG4gICAgICAgIGlzc3VlcnM/OiBzdHJpbmdbXVxuICAgIH0sXG4gICAgc3VtbWFyeT86IHtcbiAgICAgICAgdm9sdW1lOiBBc3NldCxcbiAgICAgICAgcHJpY2U6IEFzc2V0LFxuICAgICAgICBwcmljZV8yNGhfYWdvOiBBc3NldCxcbiAgICAgICAgcGVyY2VudD86bnVtYmVyLFxuICAgICAgICBwZXJjZW50X3N0cj86c3RyaW5nXG4gICAgfVxuXG59XG4qL1xuZXhwb3J0IGNsYXNzIFRva2VuREVYIGV4dGVuZHMgVG9rZW4ge1xuICAgIC8vIHByaXZhdGUgX3N0cjogc3RyaW5nO1xuICAgIC8vIHByaXZhdGUgX3N5bWJvbDogc3RyaW5nO1xuICAgIC8vIHByaXZhdGUgX3ByZWNpc2lvbjogbnVtYmVyO1xuICAgIC8vIHByaXZhdGUgX2NvbnRyYWN0OiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgYXBwbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyB3ZWJzaXRlOiBzdHJpbmc7XG4gICAgcHVibGljIGxvZ286IHN0cmluZztcbiAgICBwdWJsaWMgbG9nb2xnOiBzdHJpbmc7XG4gICAgcHVibGljIHZlcmlmaWVkOiBib29sZWFuO1xuICAgIHB1YmxpYyBmYWtlOiBib29sZWFuO1xuICAgIHB1YmxpYyBvZmZjaGFpbjogYm9vbGVhbjtcbiAgICBwdWJsaWMgc2NvcGU6IHN0cmluZztcblxuICAgIHN0YXQ/OiB7XG4gICAgICAgIHN1cHBseTogc3RyaW5nLFxuICAgICAgICBtYXhfc3VwcGx5OiBzdHJpbmcsXG4gICAgICAgIGlzc3Vlcj86IHN0cmluZyxcbiAgICAgICAgb3duZXI/OiBzdHJpbmcsXG4gICAgICAgIGlzc3VlcnM/OiBzdHJpbmdbXVxuICAgIH07XG5cbiAgICBzdW1tYXJ5Pzoge1xuICAgICAgICB2b2x1bWU6IEFzc2V0REVYLFxuICAgICAgICBwcmljZTogQXNzZXRERVgsXG4gICAgICAgIHByaWNlXzI0aF9hZ286IEFzc2V0REVYLFxuICAgICAgICBwZXJjZW50PzpudW1iZXIsXG4gICAgICAgIHBlcmNlbnRfc3RyPzpzdHJpbmdcbiAgICB9XG4gICAgXG4gICAgbWFya2V0czogTWFya2V0W107XG5cbiAgICBjb25zdHJ1Y3RvcihvYmo6YW55ID0gbnVsbCkge1xuICAgICAgICBzdXBlcihvYmopO1xuICAgICAgICBpZiAodHlwZW9mIG9iaiA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBkZWxldGUgb2JqLnN5bWJvbDtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmoucHJlY2lzaW9uO1xuICAgICAgICAgICAgZGVsZXRlIG9iai5jb250cmFjdDtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuXG5cbn0iLCJpbXBvcnQgQmlnTnVtYmVyIGZyb20gJ2JpZ251bWJlci5qcyc7XG5pbXBvcnQgeyBUb2tlbkRFWCB9IGZyb20gJy4vdG9rZW4tZGV4LmNsYXNzJztcbmltcG9ydCB7IEFzc2V0IH0gZnJvbSAnQHZhcGFlZS9zY2F0dGVyJztcblxuZXhwb3J0IGludGVyZmFjZSBJVmFwYWVlREVYIHtcbiAgICBnZXRUb2tlbk5vdyhzeW1ib2w6c3RyaW5nKTogVG9rZW5ERVg7XG59XG5cbmV4cG9ydCBjbGFzcyBBc3NldERFWCBleHRlbmRzIEFzc2V0IHtcbiAgICBhbW91bnQ6QmlnTnVtYmVyO1xuICAgIHRva2VuOlRva2VuREVYO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKGE6IGFueSA9IG51bGwsIGI6IGFueSA9IG51bGwpIHtcbiAgICAgICAgc3VwZXIoYSxiKTtcblxuICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEFzc2V0REVYKSB7XG4gICAgICAgICAgICB0aGlzLmFtb3VudCA9IGEuYW1vdW50O1xuICAgICAgICAgICAgdGhpcy50b2tlbiA9IGI7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoISFiICYmIGJbJ2dldFRva2VuTm93J10pIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VEZXgoYSxiKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgY2xvbmUoKTogQXNzZXRERVgge1xuICAgICAgICByZXR1cm4gbmV3IEFzc2V0REVYKHRoaXMuYW1vdW50LCB0aGlzLnRva2VuKTtcbiAgICB9XG5cbiAgICBwbHVzKGI6QXNzZXRERVgpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoISFiLCBcIkVSUk9SOiBiIGlzIG5vdCBhbiBBc3NldFwiLCBiLCB0aGlzLnN0cik7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGIudG9rZW4uc3ltYm9sID09IHRoaXMudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiB0cnlpbmcgdG8gc3VtIGFzc2V0cyB3aXRoIGRpZmZlcmVudCB0b2tlbnM6IFwiICsgdGhpcy5zdHIgKyBcIiBhbmQgXCIgKyBiLnN0cik7XG4gICAgICAgIHZhciBhbW91bnQgPSB0aGlzLmFtb3VudC5wbHVzKGIuYW1vdW50KTtcbiAgICAgICAgcmV0dXJuIG5ldyBBc3NldERFWChhbW91bnQsIHRoaXMudG9rZW4pO1xuICAgIH1cblxuICAgIG1pbnVzKGI6QXNzZXRERVgpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoISFiLCBcIkVSUk9SOiBiIGlzIG5vdCBhbiBBc3NldFwiLCBiLCB0aGlzLnN0cik7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGIudG9rZW4uc3ltYm9sID09IHRoaXMudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiB0cnlpbmcgdG8gc3Vic3RyYWN0IGFzc2V0cyB3aXRoIGRpZmZlcmVudCB0b2tlbnM6IFwiICsgdGhpcy5zdHIgKyBcIiBhbmQgXCIgKyBiLnN0cik7XG4gICAgICAgIHZhciBhbW91bnQgPSB0aGlzLmFtb3VudC5taW51cyhiLmFtb3VudCk7XG4gICAgICAgIHJldHVybiBuZXcgQXNzZXRERVgoYW1vdW50LCB0aGlzLnRva2VuKTtcbiAgICB9ICAgIFxuXG4gICAgcGFyc2VEZXgodGV4dDogc3RyaW5nLCBkZXg6IElWYXBhZWVERVgpIHtcbiAgICAgICAgaWYgKHRleHQgPT0gXCJcIikgcmV0dXJuO1xuICAgICAgICB2YXIgc3ltID0gdGV4dC5zcGxpdChcIiBcIilbMV07XG4gICAgICAgIHRoaXMudG9rZW4gPSBkZXguZ2V0VG9rZW5Ob3coc3ltKTtcbiAgICAgICAgdmFyIGFtb3VudF9zdHIgPSB0ZXh0LnNwbGl0KFwiIFwiKVswXTtcbiAgICAgICAgdGhpcy5hbW91bnQgPSBuZXcgQmlnTnVtYmVyKGFtb3VudF9zdHIpO1xuICAgIH1cblxuICAgIFxuICAgIHRvU3RyaW5nKGRlY2ltYWxzOm51bWJlciA9IC0xKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLnRva2VuKSByZXR1cm4gXCIwLjAwMDBcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVUb1N0cmluZyhkZWNpbWFscykgKyBcIiBcIiArIHRoaXMudG9rZW4uc3ltYm9sLnRvVXBwZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgaW52ZXJzZSh0b2tlbjogVG9rZW5ERVgpOiBBc3NldERFWCB7XG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQmlnTnVtYmVyKDEpLmRpdmlkZWRCeSh0aGlzLmFtb3VudCk7XG4gICAgICAgIHZhciBhc3NldCA9ICBuZXcgQXNzZXRERVgocmVzdWx0LCB0b2tlbik7XG4gICAgICAgIHJldHVybiBhc3NldDtcbiAgICB9XG59IiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IEJpZ051bWJlciBmcm9tIFwiYmlnbnVtYmVyLmpzXCI7XG5pbXBvcnQgeyBDb29raWVTZXJ2aWNlIH0gZnJvbSAnbmd4LWNvb2tpZS1zZXJ2aWNlJztcbmltcG9ydCB7IERhdGVQaXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFRva2VuREVYIH0gZnJvbSAnLi90b2tlbi1kZXguY2xhc3MnO1xuaW1wb3J0IHsgQXNzZXRERVggfSBmcm9tICcuL2Fzc2V0LWRleC5jbGFzcyc7XG5pbXBvcnQgeyBGZWVkYmFjayB9IGZyb20gJ0B2YXBhZWUvZmVlZGJhY2snO1xuaW1wb3J0IHsgVmFwYWVlU2NhdHRlciwgQWNjb3VudCwgQWNjb3VudERhdGEsIFNtYXJ0Q29udHJhY3QsIFRhYmxlUmVzdWx0LCBUYWJsZVBhcmFtcyB9IGZyb20gJ0B2YXBhZWUvc2NhdHRlcic7XG5pbXBvcnQgeyBNYXJrZXRNYXAsIFVzZXJPcmRlcnNNYXAsIE1hcmtldFN1bW1hcnksIEV2ZW50TG9nLCBNYXJrZXQsIEhpc3RvcnlUeCwgVG9rZW5PcmRlcnMsIE9yZGVyLCBVc2VyT3JkZXJzLCBPcmRlclJvdywgSGlzdG9yeUJsb2NrIH0gZnJvbSAnLi90eXBlcy1kZXgnO1xuXG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiBcInJvb3RcIlxufSlcbmV4cG9ydCBjbGFzcyBWYXBhZWVERVgge1xuXG4gICAgcHVibGljIGxvZ2luU3RhdGU6IHN0cmluZztcbiAgICAvKlxuICAgIHB1YmxpYyBsb2dpblN0YXRlOiBzdHJpbmc7XG4gICAgLSAnbm8tc2NhdHRlcic6IFNjYXR0ZXIgbm8gZGV0ZWN0ZWRcbiAgICAtICduby1sb2dnZWQnOiBTY2F0dGVyIGRldGVjdGVkIGJ1dCB1c2VyIGlzIG5vdCBsb2dnZWRcbiAgICAtICdhY2NvdW50LW9rJzogdXNlciBsb2dnZXIgd2l0aCBzY2F0dGVyXG4gICAgKi9cbiAgICBwcml2YXRlIF9tYXJrZXRzOiBNYXJrZXRNYXA7XG4gICAgcHJpdmF0ZSBfcmV2ZXJzZTogTWFya2V0TWFwO1xuICAgIHB1YmxpYyB0b3BtYXJrZXRzOiBNYXJrZXRbXTtcblxuICAgIHB1YmxpYyB6ZXJvX3RlbG9zOiBBc3NldERFWDtcbiAgICBwdWJsaWMgdGVsb3M6IFRva2VuREVYO1xuICAgIHB1YmxpYyB0b2tlbnM6IFRva2VuREVYW107XG4gICAgcHVibGljIGN1cnJlbmNpZXM6IFRva2VuREVYW107XG4gICAgcHVibGljIGNvbnRyYWN0OiBTbWFydENvbnRyYWN0O1xuICAgIHB1YmxpYyBmZWVkOiBGZWVkYmFjaztcbiAgICBwdWJsaWMgY3VycmVudDogQWNjb3VudDtcbiAgICBwdWJsaWMgbGFzdF9sb2dnZWQ6IHN0cmluZztcbiAgICBwdWJsaWMgY29udHJhY3RfbmFtZTogc3RyaW5nOyAgIFxuICAgIHB1YmxpYyBkZXBvc2l0czogQXNzZXRERVhbXTtcbiAgICBwdWJsaWMgYmFsYW5jZXM6IEFzc2V0REVYW107XG4gICAgcHVibGljIHVzZXJvcmRlcnM6IFVzZXJPcmRlcnNNYXA7XG4gICAgcHVibGljIG9uTG9nZ2VkQWNjb3VudENoYW5nZTpTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvbkN1cnJlbnRBY2NvdW50Q2hhbmdlOlN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIG9uSGlzdG9yeUNoYW5nZTpTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvbk1hcmtldFN1bW1hcnk6U3ViamVjdDxNYXJrZXRTdW1tYXJ5PiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgLy8gcHVibGljIG9uQmxvY2tsaXN0Q2hhbmdlOlN1YmplY3Q8YW55W11bXT4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvblRva2Vuc1JlYWR5OlN1YmplY3Q8VG9rZW5ERVhbXT4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvblRvcE1hcmtldHNSZWFkeTpTdWJqZWN0PE1hcmtldFtdPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIG9uVHJhZGVVcGRhdGVkOlN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgdmFwYWVldG9rZW5zOnN0cmluZyA9IFwidmFwYWVldG9rZW5zXCI7XG5cbiAgICBhY3Rpdml0eVBhZ2VzaXplOm51bWJlciA9IDEwO1xuICAgIFxuICAgIGFjdGl2aXR5OntcbiAgICAgICAgdG90YWw6bnVtYmVyO1xuICAgICAgICBldmVudHM6e1tpZDpzdHJpbmddOkV2ZW50TG9nfTtcbiAgICAgICAgbGlzdDpFdmVudExvZ1tdO1xuICAgIH07XG4gICAgXG4gICAgcHJpdmF0ZSBzZXRPcmRlclN1bW1hcnk6IEZ1bmN0aW9uO1xuICAgIHB1YmxpYyB3YWl0T3JkZXJTdW1tYXJ5OiBQcm9taXNlPGFueT4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0aGlzLnNldE9yZGVyU3VtbWFyeSA9IHJlc29sdmU7XG4gICAgfSk7XG5cbiAgICBwcml2YXRlIHNldFRva2VuU3RhdHM6IEZ1bmN0aW9uO1xuICAgIHB1YmxpYyB3YWl0VG9rZW5TdGF0czogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRUb2tlblN0YXRzID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIHByaXZhdGUgc2V0TWFya2V0U3VtbWFyeTogRnVuY3Rpb247XG4gICAgcHVibGljIHdhaXRNYXJrZXRTdW1tYXJ5OiBQcm9taXNlPGFueT4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0aGlzLnNldE1hcmtldFN1bW1hcnkgPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgcHJpdmF0ZSBzZXRUb2tlblN1bW1hcnk6IEZ1bmN0aW9uO1xuICAgIHB1YmxpYyB3YWl0VG9rZW5TdW1tYXJ5OiBQcm9taXNlPGFueT4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0aGlzLnNldFRva2VuU3VtbWFyeSA9IHJlc29sdmU7XG4gICAgfSk7XG5cbiAgICBwcml2YXRlIHNldFRva2Vuc0xvYWRlZDogRnVuY3Rpb247XG4gICAgcHVibGljIHdhaXRUb2tlbnNMb2FkZWQ6IFByb21pc2U8YW55PiA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0VG9rZW5zTG9hZGVkID0gcmVzb2x2ZTtcbiAgICB9KTtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBzY2F0dGVyOiBWYXBhZWVTY2F0dGVyLFxuICAgICAgICBwcml2YXRlIGNvb2tpZXM6IENvb2tpZVNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgZGF0ZVBpcGU6IERhdGVQaXBlXG4gICAgKSB7XG4gICAgICAgIHRoaXMuX21hcmtldHMgPSB7fTtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZSA9IHt9O1xuICAgICAgICB0aGlzLmFjdGl2aXR5ID0ge3RvdGFsOjAsIGV2ZW50czp7fSwgbGlzdDpbXX07XG4gICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMuZGVmYXVsdDtcbiAgICAgICAgdGhpcy5jb250cmFjdF9uYW1lID0gdGhpcy52YXBhZWV0b2tlbnM7XG4gICAgICAgIHRoaXMuY29udHJhY3QgPSB0aGlzLnNjYXR0ZXIuZ2V0U21hcnRDb250cmFjdCh0aGlzLmNvbnRyYWN0X25hbWUpO1xuICAgICAgICB0aGlzLmZlZWQgPSBuZXcgRmVlZGJhY2soKTtcbiAgICAgICAgdGhpcy5zY2F0dGVyLm9uTG9nZ2dlZFN0YXRlQ2hhbmdlLnN1YnNjcmliZSh0aGlzLm9uTG9nZ2VkQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnVwZGF0ZUxvZ1N0YXRlKCk7XG4gICAgICAgIHRoaXMuZmV0Y2hUb2tlbnMoKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgdGhpcy50b2tlbnMgPSBbXTtcbiAgICAgICAgICAgIGxldCBjYXJib247XG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIGRhdGEudG9rZW5zKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRkYXRhID0gZGF0YS50b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgbGV0IHRva2VuID0gbmV3IFRva2VuREVYKHRkYXRhKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4uc3ltYm9sID09IFwiVExPU1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGVsb3MgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuLnN5bWJvbCA9PSBcIkNVU0RcIikge1xuICAgICAgICAgICAgICAgICAgICBjYXJib24gPSB0b2tlbjtcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBoYXJkb2RlZCB0ZW1wb3JhcnkgaW5zZXJ0ZWQgdG9rZW5zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGxldCBjYXJib24gPSBuZXcgVG9rZW5ERVgoe1xuICAgICAgICAgICAgICAgIGFwcG5hbWU6IFwiQ2FyYm9uXCIsXG4gICAgICAgICAgICAgICAgY29udHJhY3Q6IFwic3RhYmxlY2FyYm9uXCIsXG4gICAgICAgICAgICAgICAgbG9nbzogXCIvYXNzZXRzL2xvZ29zL2NhcmJvbi5zdmdcIixcbiAgICAgICAgICAgICAgICBsb2dvbGc6IFwiL2Fzc2V0cy9sb2dvcy9jYXJib24uc3ZnXCIsXG4gICAgICAgICAgICAgICAgcHJlY2lzaW9uOiAyLFxuICAgICAgICAgICAgICAgIHNjb3BlOiBcImN1c2QudGxvc1wiLFxuICAgICAgICAgICAgICAgIHN5bWJvbDogXCJDVVNEXCIsXG4gICAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdlYnNpdGU6IFwiaHR0cHM6Ly93d3cuY2FyYm9uLm1vbmV5XCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy50b2tlbnMucHVzaChjYXJib24pO1xuICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgLy8gVE9ETzogbWFrZSB0aGlzIGR5bmFtaWMgYW5kIG5vdCBoYXJkY29kZWQgLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgdGhpcy5jdXJyZW5jaWVzID0gWyB0aGlzLnRlbG9zLCBjYXJib24gXTtcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbkRFWCh7XG4gICAgICAgICAgICAgICAgYXBwbmFtZTogXCJWaWl0YXNwaGVyZVwiLFxuICAgICAgICAgICAgICAgIGNvbnRyYWN0OiBcInZpaXRhc3BoZXJlMVwiLFxuICAgICAgICAgICAgICAgIGxvZ286IFwiL2Fzc2V0cy9sb2dvcy92aWl0YXNwaGVyZS5wbmdcIixcbiAgICAgICAgICAgICAgICBsb2dvbGc6IFwiL2Fzc2V0cy9sb2dvcy92aWl0YXNwaGVyZS1sZy5wbmdcIixcbiAgICAgICAgICAgICAgICBwcmVjaXNpb246IDQsXG4gICAgICAgICAgICAgICAgc2NvcGU6IFwidmlpdGN0LnRsb3NcIixcbiAgICAgICAgICAgICAgICBzeW1ib2w6IFwiVklJVEFcIixcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgd2Vic2l0ZTogXCJodHRwczovL3ZpaXRhc3BoZXJlLmNvbVwiXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbkRFWCh7XG4gICAgICAgICAgICAgICAgYXBwbmFtZTogXCJWaWl0YXNwaGVyZVwiLFxuICAgICAgICAgICAgICAgIGNvbnRyYWN0OiBcInZpaXRhc3BoZXJlMVwiLFxuICAgICAgICAgICAgICAgIGxvZ286IFwiL2Fzc2V0cy9sb2dvcy92aWl0YXNwaGVyZS5wbmdcIixcbiAgICAgICAgICAgICAgICBsb2dvbGc6IFwiL2Fzc2V0cy9sb2dvcy92aWl0YXNwaGVyZS1sZy5wbmdcIixcbiAgICAgICAgICAgICAgICBwcmVjaXNpb246IDAsXG4gICAgICAgICAgICAgICAgc2NvcGU6IFwidmlpdGN0LnRsb3NcIixcbiAgICAgICAgICAgICAgICBzeW1ib2w6IFwiVklJQ1RcIixcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgd2Vic2l0ZTogXCJodHRwczovL3ZpaXRhc3BoZXJlLmNvbVwiXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB0aGlzLnplcm9fdGVsb3MgPSBuZXcgQXNzZXRERVgoXCIwLjAwMDAgVExPU1wiLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VG9rZW5zTG9hZGVkKCk7XG4gICAgICAgICAgICB0aGlzLmZldGNoVG9rZW5zU3RhdHMoKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0T3JkZXJTdW1tYXJ5KCk7XG4gICAgICAgICAgICB0aGlzLmdldEFsbFRhYmxlc1N1bWFyaWVzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKF8gPT4ge1xuICAgICAgICAvLyB9KVxuXG5cbiAgICAgICAgdmFyIHRpbWVyO1xuICAgICAgICB0aGlzLm9uTWFya2V0U3VtbWFyeS5zdWJzY3JpYmUoc3VtbWFyeSA9PiB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVG9rZW5zU3VtbWFyeSgpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVG9rZW5zTWFya2V0cygpO1xuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gZ2V0dGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGRlZmF1bHQoKTogQWNjb3VudCB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjYXR0ZXIuZGVmYXVsdDtcbiAgICB9XG5cbiAgICBnZXQgbG9nZ2VkKCkge1xuICAgICAgICBpZiAodGhpcy5zY2F0dGVyLmxvZ2dlZCAmJiAhdGhpcy5zY2F0dGVyLmFjY291bnQpIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiV0FSTklORyEhIVwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2NhdHRlcik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnNjYXR0ZXIudXNlcm5hbWUpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIioqKioqKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgICAqL1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNjYXR0ZXIubG9nZ2VkID9cbiAgICAgICAgICAgICh0aGlzLnNjYXR0ZXIuYWNjb3VudCA/IHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUgOiB0aGlzLnNjYXR0ZXIuZGVmYXVsdC5uYW1lKSA6XG4gICAgICAgICAgICBudWxsO1xuICAgIH1cblxuICAgIGdldCBhY2NvdW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLmxvZ2dlZCA/IFxuICAgICAgICB0aGlzLnNjYXR0ZXIuYWNjb3VudCA6XG4gICAgICAgIHRoaXMuc2NhdHRlci5kZWZhdWx0O1xuICAgIH1cblxuICAgIC8vIC0tIFVzZXIgTG9nIFN0YXRlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxvZ2luKCkge1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ2luXCIsIHRydWUpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZy1zdGF0ZVwiLCB0cnVlKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgubG9naW4oKSB0aGlzLmZlZWQubG9hZGluZygnbG9nLXN0YXRlJylcIiwgdGhpcy5mZWVkLmxvYWRpbmcoJ2xvZy1zdGF0ZScpKTtcbiAgICAgICAgdGhpcy5sb2dvdXQoKTtcbiAgICAgICAgdGhpcy51cGRhdGVMb2dTdGF0ZSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5sb2dpbigpIHRoaXMuZmVlZC5sb2FkaW5nKCdsb2ctc3RhdGUnKVwiLCB0aGlzLmZlZWQubG9hZGluZygnbG9nLXN0YXRlJykpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ291dFwiLCBmYWxzZSk7XG4gICAgICAgIHJldHVybiB0aGlzLnNjYXR0ZXIubG9naW4oKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTG9nU3RhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwibG9naW5cIiwgZmFsc2UpO1xuICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwibG9naW5cIiwgZmFsc2UpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9nb3V0KCkge1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ291dFwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5zY2F0dGVyLmxvZ291dCgpO1xuICAgIH1cblxuICAgIG9uTG9nb3V0KCkge1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ291dFwiLCBmYWxzZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLm9uTG9nb3V0KClcIik7XG4gICAgICAgIHRoaXMucmVzZXRDdXJyZW50QWNjb3VudCh0aGlzLmRlZmF1bHQubmFtZSk7XG4gICAgICAgIHRoaXMudXBkYXRlTG9nU3RhdGUoKTtcbiAgICAgICAgdGhpcy5vbkxvZ2dlZEFjY291bnRDaGFuZ2UubmV4dCh0aGlzLmxvZ2dlZCk7XG4gICAgICAgIHRoaXMuY29va2llcy5kZWxldGUoXCJsb2dpblwiKTtcbiAgICAgICAgc2V0VGltZW91dChfICA9PiB7IHRoaXMubGFzdF9sb2dnZWQgPSB0aGlzLmxvZ2dlZDsgfSwgNDAwKTtcbiAgICB9XG4gICAgXG4gICAgb25Mb2dpbihuYW1lOnN0cmluZykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5vbkxvZ2luKClcIiwgbmFtZSk7XG4gICAgICAgIHRoaXMucmVzZXRDdXJyZW50QWNjb3VudChuYW1lKTtcbiAgICAgICAgdGhpcy5nZXREZXBvc2l0cygpO1xuICAgICAgICB0aGlzLmdldEJhbGFuY2VzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlTG9nU3RhdGUoKTtcbiAgICAgICAgdGhpcy5nZXRVc2VyT3JkZXJzKCk7XG4gICAgICAgIHRoaXMub25Mb2dnZWRBY2NvdW50Q2hhbmdlLm5leHQodGhpcy5sb2dnZWQpO1xuICAgICAgICB0aGlzLmxhc3RfbG9nZ2VkID0gdGhpcy5sb2dnZWQ7XG4gICAgICAgIHRoaXMuY29va2llcy5zZXQoXCJsb2dpblwiLCB0aGlzLmxvZ2dlZCk7XG4gICAgfVxuXG4gICAgb25Mb2dnZWRDaGFuZ2UoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLm9uTG9nZ2VkQ2hhbmdlKClcIik7XG4gICAgICAgIGlmICh0aGlzLnNjYXR0ZXIubG9nZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLm9uTG9naW4odGhpcy5zY2F0dGVyLmFjY291bnQubmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9uTG9nb3V0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyByZXNldEN1cnJlbnRBY2NvdW50KHByb2ZpbGU6c3RyaW5nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnJlc2V0Q3VycmVudEFjY291bnQoKVwiLCB0aGlzLmN1cnJlbnQubmFtZSwgXCItPlwiLCBwcm9maWxlKTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudC5uYW1lICE9IHByb2ZpbGUgJiYgKHRoaXMuY3VycmVudC5uYW1lID09IHRoaXMubGFzdF9sb2dnZWQgfHwgcHJvZmlsZSAhPSBcImd1ZXN0XCIpKSB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImFjY291bnRcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLmRlZmF1bHQ7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQubmFtZSA9IHByb2ZpbGU7XG4gICAgICAgICAgICBpZiAocHJvZmlsZSAhPSBcImd1ZXN0XCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQuZGF0YSA9IGF3YWl0IHRoaXMuZ2V0QWNjb3VudERhdGEodGhpcy5jdXJyZW50Lm5hbWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIldBUk5JTkchISEgY3VycmVudCBpcyBndWVzdFwiLCBbcHJvZmlsZSwgdGhpcy5hY2NvdW50LCB0aGlzLmN1cnJlbnRdKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0aGlzLnNjb3BlcyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5iYWxhbmNlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy51c2Vyb3JkZXJzID0ge307ICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRoaXMub25DdXJyZW50QWNjb3VudENoYW5nZS5uZXh0KHRoaXMuY3VycmVudC5uYW1lKSAhISEhISFcIik7XG4gICAgICAgICAgICB0aGlzLm9uQ3VycmVudEFjY291bnRDaGFuZ2UubmV4dCh0aGlzLmN1cnJlbnQubmFtZSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUN1cnJlbnRVc2VyKCk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImFjY291bnRcIiwgZmFsc2UpO1xuICAgICAgICB9ICAgICAgIFxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlTG9nU3RhdGUoKSB7XG4gICAgICAgIHRoaXMubG9naW5TdGF0ZSA9IFwibm8tc2NhdHRlclwiO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZy1zdGF0ZVwiLCB0cnVlKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgudXBkYXRlTG9nU3RhdGUoKSBcIiwgdGhpcy5sb2dpblN0YXRlLCB0aGlzLmZlZWQubG9hZGluZyhcImxvZy1zdGF0ZVwiKSk7XG4gICAgICAgIHRoaXMuc2NhdHRlci53YWl0Q29ubmVjdGVkLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2dpblN0YXRlID0gXCJuby1sb2dnZWRcIjtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnVwZGF0ZUxvZ1N0YXRlKCkgICBcIiwgdGhpcy5sb2dpblN0YXRlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNjYXR0ZXIubG9nZ2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dpblN0YXRlID0gXCJhY2NvdW50LW9rXCI7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWVERVgudXBkYXRlTG9nU3RhdGUoKSAgICAgXCIsIHRoaXMubG9naW5TdGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZy1zdGF0ZVwiLCBmYWxzZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC51cGRhdGVMb2dTdGF0ZSgpIFwiLCB0aGlzLmxvZ2luU3RhdGUsIHRoaXMuZmVlZC5sb2FkaW5nKFwibG9nLXN0YXRlXCIpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHRpbWVyMjtcbiAgICAgICAgdmFyIHRpbWVyMSA9IHNldEludGVydmFsKF8gPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnNjYXR0ZXIuZmVlZC5sb2FkaW5nKFwiY29ubmVjdFwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwibG9nLXN0YXRlXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyMSk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcjIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAyMDApO1xuXG4gICAgICAgIHRpbWVyMiA9IHNldFRpbWVvdXQoXyA9PiB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyMSk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZy1zdGF0ZVwiLCBmYWxzZSk7XG4gICAgICAgIH0sIDYwMDApO1xuICAgICAgICBcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGdldEFjY291bnREYXRhKG5hbWU6IHN0cmluZyk6IFByb21pc2U8QWNjb3VudERhdGE+ICB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjYXR0ZXIucXVlcnlBY2NvdW50RGF0YShuYW1lKS5jYXRjaChhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlZmF1bHQuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNyZWF0ZU9yZGVyKHR5cGU6c3RyaW5nLCBhbW91bnQ6QXNzZXRERVgsIHByaWNlOkFzc2V0REVYKSB7XG4gICAgICAgIC8vIFwiYWxpY2VcIiwgXCJidXlcIiwgXCIyLjUwMDAwMDAwIENOVFwiLCBcIjAuNDAwMDAwMDAgVExPU1wiXG4gICAgICAgIC8vIG5hbWUgb3duZXIsIG5hbWUgdHlwZSwgY29uc3QgYXNzZXQgJiB0b3RhbCwgY29uc3QgYXNzZXQgJiBwcmljZVxuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIm9yZGVyLVwiK3R5cGUsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5leGNlY3V0ZShcIm9yZGVyXCIsIHtcbiAgICAgICAgICAgIG93bmVyOiAgdGhpcy5zY2F0dGVyLmFjY291bnQubmFtZSxcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICB0b3RhbDogYW1vdW50LnRvU3RyaW5nKDgpLFxuICAgICAgICAgICAgcHJpY2U6IHByaWNlLnRvU3RyaW5nKDgpXG4gICAgICAgIH0pLnRoZW4oYXN5bmMgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVHJhZGUoYW1vdW50LnRva2VuLCBwcmljZS50b2tlbik7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIm9yZGVyLVwiK3R5cGUsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJvcmRlci1cIit0eXBlLCBmYWxzZSk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY2FuY2VsT3JkZXIodHlwZTpzdHJpbmcsIGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCwgb3JkZXJzOm51bWJlcltdKSB7XG4gICAgICAgIC8vICdbXCJhbGljZVwiLCBcImJ1eVwiLCBcIkNOVFwiLCBcIlRMT1NcIiwgWzEsMF1dJ1xuICAgICAgICAvLyBuYW1lIG93bmVyLCBuYW1lIHR5cGUsIGNvbnN0IGFzc2V0ICYgdG90YWwsIGNvbnN0IGFzc2V0ICYgcHJpY2VcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZSwgdHJ1ZSk7XG4gICAgICAgIGZvciAodmFyIGkgaW4gb3JkZXJzKSB7IHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY2FuY2VsLVwiK3R5cGUrXCItXCIrb3JkZXJzW2ldLCB0cnVlKTsgfVxuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5leGNlY3V0ZShcImNhbmNlbFwiLCB7XG4gICAgICAgICAgICBvd25lcjogIHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgY29tb2RpdHk6IGNvbW9kaXR5LnN5bWJvbCxcbiAgICAgICAgICAgIGN1cnJlbmN5OiBjdXJyZW5jeS5zeW1ib2wsXG4gICAgICAgICAgICBvcmRlcnM6IG9yZGVyc1xuICAgICAgICB9KS50aGVuKGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRyYWRlKGNvbW9kaXR5LCBjdXJyZW5jeSk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImNhbmNlbC1cIit0eXBlLCBmYWxzZSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG9yZGVycykgeyB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImNhbmNlbC1cIit0eXBlK1wiLVwiK29yZGVyc1tpXSwgZmFsc2UpOyB9ICAgIFxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImNhbmNlbC1cIit0eXBlLCBmYWxzZSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG9yZGVycykgeyB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImNhbmNlbC1cIit0eXBlK1wiLVwiK29yZGVyc1tpXSwgZmFsc2UpOyB9ICAgIFxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRlcG9zaXQocXVhbnRpdHk6QXNzZXRERVgpIHtcbiAgICAgICAgLy8gbmFtZSBvd25lciwgbmFtZSB0eXBlLCBjb25zdCBhc3NldCAmIHRvdGFsLCBjb25zdCBhc3NldCAmIHByaWNlXG4gICAgICAgIHZhciBjb250cmFjdCA9IHRoaXMuc2NhdHRlci5nZXRTbWFydENvbnRyYWN0KHF1YW50aXR5LnRva2VuLmNvbnRyYWN0KTtcbiAgICAgICAgdGhpcy5mZWVkLnNldEVycm9yKFwiZGVwb3NpdFwiLCBudWxsKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0XCIsIHRydWUpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImRlcG9zaXQtXCIrcXVhbnRpdHkudG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCksIHRydWUpO1xuICAgICAgICByZXR1cm4gY29udHJhY3QuZXhjZWN1dGUoXCJ0cmFuc2ZlclwiLCB7XG4gICAgICAgICAgICBmcm9tOiAgdGhpcy5zY2F0dGVyLmFjY291bnQubmFtZSxcbiAgICAgICAgICAgIHRvOiB0aGlzLnZhcGFlZXRva2VucyxcbiAgICAgICAgICAgIHF1YW50aXR5OiBxdWFudGl0eS50b1N0cmluZygpLFxuICAgICAgICAgICAgbWVtbzogXCJkZXBvc2l0XCJcbiAgICAgICAgfSkudGhlbihhc3luYyByZXN1bHQgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdC1cIitxdWFudGl0eS50b2tlbi5zeW1ib2wudG9Mb3dlckNhc2UoKSwgZmFsc2UpOyAgICBcbiAgICAgICAgICAgIC8qYXdhaXQqLyB0aGlzLmdldERlcG9zaXRzKCk7XG4gICAgICAgICAgICAvKmF3YWl0Ki8gdGhpcy5nZXRCYWxhbmNlcygpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImRlcG9zaXRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0LVwiK3F1YW50aXR5LnRva2VuLnN5bWJvbC50b0xvd2VyQ2FzZSgpLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0RXJyb3IoXCJkZXBvc2l0XCIsIHR5cGVvZiBlID09IFwic3RyaW5nXCIgPyBlIDogSlNPTi5zdHJpbmdpZnkoZSxudWxsLDQpKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9KTtcbiAgICB9ICAgIFxuXG4gICAgd2l0aGRyYXcocXVhbnRpdHk6QXNzZXRERVgpIHtcbiAgICAgICAgdGhpcy5mZWVkLnNldEVycm9yKFwid2l0aGRyYXdcIiwgbnVsbCk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwid2l0aGRyYXdcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwid2l0aGRyYXctXCIrcXVhbnRpdHkudG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCksIHRydWUpOyAgIFxuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5leGNlY3V0ZShcIndpdGhkcmF3XCIsIHtcbiAgICAgICAgICAgIG93bmVyOiAgdGhpcy5zY2F0dGVyLmFjY291bnQubmFtZSxcbiAgICAgICAgICAgIHF1YW50aXR5OiBxdWFudGl0eS50b1N0cmluZygpXG4gICAgICAgIH0pLnRoZW4oYXN5bmMgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwid2l0aGRyYXdcIiwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ3aXRoZHJhdy1cIitxdWFudGl0eS50b2tlbi5zeW1ib2wudG9Mb3dlckNhc2UoKSwgZmFsc2UpO1xuICAgICAgICAgICAgLyphd2FpdCovIHRoaXMuZ2V0RGVwb3NpdHMoKTtcbiAgICAgICAgICAgIC8qYXdhaXQqLyB0aGlzLmdldEJhbGFuY2VzKCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwid2l0aGRyYXdcIiwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ3aXRoZHJhdy1cIitxdWFudGl0eS50b2tlbi5zeW1ib2wudG9Mb3dlckNhc2UoKSwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldEVycm9yKFwid2l0aGRyYXdcIiwgdHlwZW9mIGUgPT0gXCJzdHJpbmdcIiA/IGUgOiBKU09OLnN0cmluZ2lmeShlLG51bGwsNCkpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVG9rZW5zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYWRkT2ZmQ2hhaW5Ub2tlbihvZmZjaGFpbjogVG9rZW5ERVgpIHtcbiAgICAgICAgdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbkRFWCh7XG4gICAgICAgICAgICAgICAgc3ltYm9sOiBvZmZjaGFpbi5zeW1ib2wsXG4gICAgICAgICAgICAgICAgcHJlY2lzaW9uOiBvZmZjaGFpbi5wcmVjaXNpb24gfHwgNCxcbiAgICAgICAgICAgICAgICBjb250cmFjdDogXCJub2NvbnRyYWN0XCIsXG4gICAgICAgICAgICAgICAgYXBwbmFtZTogb2ZmY2hhaW4uYXBwbmFtZSxcbiAgICAgICAgICAgICAgICB3ZWJzaXRlOiBcIlwiLFxuICAgICAgICAgICAgICAgIGxvZ286XCJcIixcbiAgICAgICAgICAgICAgICBsb2dvbGc6IFwiXCIsXG4gICAgICAgICAgICAgICAgc2NvcGU6IFwiXCIsXG4gICAgICAgICAgICAgICAgc3RhdDogbnVsbCxcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgb2ZmY2hhaW46IHRydWVcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNjb3BlcyAvIFRhYmxlcyBcbiAgICBwdWJsaWMgaGFzU2NvcGVzKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9tYXJrZXRzO1xuICAgIH1cblxuICAgIHB1YmxpYyBtYXJrZXQoc2NvcGU6c3RyaW5nKTogTWFya2V0IHtcbiAgICAgICAgaWYgKHRoaXMuX21hcmtldHNbc2NvcGVdKSByZXR1cm4gdGhpcy5fbWFya2V0c1tzY29wZV07ICAgICAgICAvLyAtLS0+IGRpcmVjdFxuICAgICAgICB2YXIgcmV2ZXJzZSA9IHRoaXMuaW52ZXJzZVNjb3BlKHNjb3BlKTtcbiAgICAgICAgaWYgKHRoaXMuX3JldmVyc2VbcmV2ZXJzZV0pIHJldHVybiB0aGlzLl9yZXZlcnNlW3JldmVyc2VdOyAgICAvLyAtLS0+IHJldmVyc2VcbiAgICAgICAgaWYgKCF0aGlzLl9tYXJrZXRzW3JldmVyc2VdKSByZXR1cm4gbnVsbDsgICAgICAgICAgICAgICAgICAgICAvLyAtLS0+IHRhYmxlIGRvZXMgbm90IGV4aXN0IChvciBoYXMgbm90IGJlZW4gbG9hZGVkIHlldClcbiAgICAgICAgcmV0dXJuIHRoaXMucmV2ZXJzZShzY29wZSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRhYmxlKHNjb3BlOnN0cmluZyk6IE1hcmtldCB7XG4gICAgICAgIC8vY29uc29sZS5lcnJvcihcInRhYmxlKFwiK3Njb3BlK1wiKSBERVBSRUNBVEVEXCIpO1xuICAgICAgICByZXR1cm4gdGhpcy5tYXJrZXQoc2NvcGUpO1xuICAgIH0gICAgXG5cbiAgICBwcml2YXRlIHJldmVyc2Uoc2NvcGU6c3RyaW5nKTogTWFya2V0IHtcbiAgICAgICAgdmFyIGNhbm9uaWNhbCA9IHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpO1xuICAgICAgICB2YXIgcmV2ZXJzZV9zY29wZSA9IHRoaXMuaW52ZXJzZVNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGNhbm9uaWNhbCAhPSByZXZlcnNlX3Njb3BlLCBcIkVSUk9SOiBcIiwgY2Fub25pY2FsLCByZXZlcnNlX3Njb3BlKTtcbiAgICAgICAgdmFyIHJldmVyc2VfdGFibGU6TWFya2V0ID0gdGhpcy5fcmV2ZXJzZVtyZXZlcnNlX3Njb3BlXTtcbiAgICAgICAgaWYgKCFyZXZlcnNlX3RhYmxlICYmIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSkge1xuICAgICAgICAgICAgdGhpcy5fcmV2ZXJzZVtyZXZlcnNlX3Njb3BlXSA9IHRoaXMuY3JlYXRlUmV2ZXJzZVRhYmxlRm9yKHJldmVyc2Vfc2NvcGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXZlcnNlW3JldmVyc2Vfc2NvcGVdO1xuICAgIH1cblxuICAgIHB1YmxpYyBtYXJrZXRGb3IoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYKTogTWFya2V0IHtcbiAgICAgICAgdmFyIHNjb3BlID0gdGhpcy5nZXRTY29wZUZvcihjb21vZGl0eSwgY3VycmVuY3kpO1xuICAgICAgICByZXR1cm4gdGhpcy50YWJsZShzY29wZSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRhYmxlRm9yKGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCk6IE1hcmtldCB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0YWJsZUZvcigpXCIsY29tb2RpdHkuc3ltYm9sLGN1cnJlbmN5LnN5bWJvbCxcIiBERVBSRUNBVEVEXCIpO1xuICAgICAgICByZXR1cm4gdGhpcy5tYXJrZXRGb3IoY29tb2RpdHksIGN1cnJlbmN5KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlUmV2ZXJzZVRhYmxlRm9yKHNjb3BlOnN0cmluZyk6IE1hcmtldCB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIsIHNjb3BlKTtcbiAgICAgICAgdmFyIGNhbm9uaWNhbCA9IHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpO1xuICAgICAgICB2YXIgcmV2ZXJzZV9zY29wZSA9IHRoaXMuaW52ZXJzZVNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgIHZhciB0YWJsZTpNYXJrZXQgPSB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF07XG5cbiAgICAgICAgdmFyIGludmVyc2VfaGlzdG9yeTpIaXN0b3J5VHhbXSA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgaW4gdGFibGUuaGlzdG9yeSkge1xuICAgICAgICAgICAgdmFyIGhUeDpIaXN0b3J5VHggPSB7XG4gICAgICAgICAgICAgICAgaWQ6IHRhYmxlLmhpc3RvcnlbaV0uaWQsXG4gICAgICAgICAgICAgICAgc3RyOiBcIlwiLFxuICAgICAgICAgICAgICAgIHByaWNlOiB0YWJsZS5oaXN0b3J5W2ldLmludmVyc2UuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICBpbnZlcnNlOiB0YWJsZS5oaXN0b3J5W2ldLnByaWNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgYW1vdW50OiB0YWJsZS5oaXN0b3J5W2ldLnBheW1lbnQuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICBwYXltZW50OiB0YWJsZS5oaXN0b3J5W2ldLmFtb3VudC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgIGJ1eWVyOiB0YWJsZS5oaXN0b3J5W2ldLnNlbGxlcixcbiAgICAgICAgICAgICAgICBzZWxsZXI6IHRhYmxlLmhpc3RvcnlbaV0uYnV5ZXIsXG4gICAgICAgICAgICAgICAgYnV5ZmVlOiB0YWJsZS5oaXN0b3J5W2ldLnNlbGxmZWUuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICBzZWxsZmVlOiB0YWJsZS5oaXN0b3J5W2ldLmJ1eWZlZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgIGRhdGU6IHRhYmxlLmhpc3RvcnlbaV0uZGF0ZSxcbiAgICAgICAgICAgICAgICBpc2J1eTogIXRhYmxlLmhpc3RvcnlbaV0uaXNidXksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaFR4LnN0ciA9IGhUeC5wcmljZS5zdHIgKyBcIiBcIiArIGhUeC5hbW91bnQuc3RyO1xuICAgICAgICAgICAgaW52ZXJzZV9oaXN0b3J5LnB1c2goaFR4KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICBcbiAgICAgICAgdmFyIGludmVyc2Vfb3JkZXJzOlRva2VuT3JkZXJzID0ge1xuICAgICAgICAgICAgYnV5OiBbXSwgc2VsbDogW11cbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKHZhciB0eXBlIGluIHtidXk6XCJidXlcIiwgc2VsbDpcInNlbGxcIn0pIHtcbiAgICAgICAgICAgIHZhciByb3dfb3JkZXJzOk9yZGVyW107XG4gICAgICAgICAgICB2YXIgcm93X29yZGVyOk9yZGVyO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRhYmxlLm9yZGVyc1t0eXBlXSkge1xuICAgICAgICAgICAgICAgIHZhciByb3cgPSB0YWJsZS5vcmRlcnNbdHlwZV1baV07XG5cbiAgICAgICAgICAgICAgICByb3dfb3JkZXJzID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaj0wOyBqPHJvdy5vcmRlcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcm93X29yZGVyID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVwb3NpdDogcm93Lm9yZGVyc1tqXS5kZXBvc2l0LmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogcm93Lm9yZGVyc1tqXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2U6IHJvdy5vcmRlcnNbal0ucHJpY2UuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiByb3cub3JkZXJzW2pdLmludmVyc2UuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyOiByb3cub3JkZXJzW2pdLm93bmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVsb3M6IHJvdy5vcmRlcnNbal0udG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogcm93Lm9yZGVyc1tqXS50ZWxvc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJvd19vcmRlcnMucHVzaChyb3dfb3JkZXIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBuZXdyb3c6T3JkZXJSb3cgPSB7XG4gICAgICAgICAgICAgICAgICAgIGludmVyc2U6IHJvdy5wcmljZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnM6IHJvd19vcmRlcnMsXG4gICAgICAgICAgICAgICAgICAgIG93bmVyczogcm93Lm93bmVycyxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHJvdy5pbnZlcnNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgIHN0cjogcm93LmludmVyc2Uuc3RyLFxuICAgICAgICAgICAgICAgICAgICBzdW06IHJvdy5zdW10ZWxvcy5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICBzdW10ZWxvczogcm93LnN1bS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICB0ZWxvczogcm93LnRvdGFsLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiByb3cudGVsb3MuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgLy8gYW1vdW50OiByb3cuc3VtdGVsb3MudG90YWwoKSwgLy8gPC0tIGV4dHJhXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpbnZlcnNlX29yZGVyc1t0eXBlXS5wdXNoKG5ld3Jvdyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmV2ZXJzZTpNYXJrZXQgPSB7XG4gICAgICAgICAgICBzY29wZTogcmV2ZXJzZV9zY29wZSxcbiAgICAgICAgICAgIGNvbW9kaXR5OiB0YWJsZS5jdXJyZW5jeSxcbiAgICAgICAgICAgIGN1cnJlbmN5OiB0YWJsZS5jb21vZGl0eSxcbiAgICAgICAgICAgIGJsb2NrOiB0YWJsZS5ibG9jayxcbiAgICAgICAgICAgIGJsb2NrbGlzdDogdGFibGUucmV2ZXJzZWJsb2NrcyxcbiAgICAgICAgICAgIHJldmVyc2VibG9ja3M6IHRhYmxlLmJsb2NrbGlzdCxcbiAgICAgICAgICAgIGJsb2NrbGV2ZWxzOiB0YWJsZS5yZXZlcnNlbGV2ZWxzLFxuICAgICAgICAgICAgcmV2ZXJzZWxldmVsczogdGFibGUuYmxvY2tsZXZlbHMsXG4gICAgICAgICAgICBibG9ja3M6IHRhYmxlLmJsb2NrcyxcbiAgICAgICAgICAgIGRlYWxzOiB0YWJsZS5kZWFscyxcbiAgICAgICAgICAgIGRpcmVjdDogdGFibGUuaW52ZXJzZSxcbiAgICAgICAgICAgIGludmVyc2U6IHRhYmxlLmRpcmVjdCxcbiAgICAgICAgICAgIGhlYWRlcjoge1xuICAgICAgICAgICAgICAgIHNlbGw6IHtcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6dGFibGUuaGVhZGVyLmJ1eS50b3RhbC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnM6dGFibGUuaGVhZGVyLmJ1eS5vcmRlcnNcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJ1eToge1xuICAgICAgICAgICAgICAgICAgICB0b3RhbDp0YWJsZS5oZWFkZXIuc2VsbC50b3RhbC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnM6dGFibGUuaGVhZGVyLnNlbGwub3JkZXJzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhpc3Rvcnk6IGludmVyc2VfaGlzdG9yeSxcbiAgICAgICAgICAgIG9yZGVyczoge1xuICAgICAgICAgICAgICAgIHNlbGw6IGludmVyc2Vfb3JkZXJzLmJ1eSwgIC8vIDw8LS0gZXN0byBmdW5jaW9uYSBhc8ODwq0gY29tbyBlc3TDg8KhP1xuICAgICAgICAgICAgICAgIGJ1eTogaW52ZXJzZV9vcmRlcnMuc2VsbCAgIC8vIDw8LS0gZXN0byBmdW5jaW9uYSBhc8ODwq0gY29tbyBlc3TDg8KhP1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1bW1hcnk6IHtcbiAgICAgICAgICAgICAgICBzY29wZTogdGhpcy5pbnZlcnNlU2NvcGUodGFibGUuc3VtbWFyeS5zY29wZSksXG4gICAgICAgICAgICAgICAgcHJpY2U6IHRhYmxlLnN1bW1hcnkuaW52ZXJzZSxcbiAgICAgICAgICAgICAgICBwcmljZV8yNGhfYWdvOiB0YWJsZS5zdW1tYXJ5LmludmVyc2VfMjRoX2FnbyxcbiAgICAgICAgICAgICAgICBpbnZlcnNlOiB0YWJsZS5zdW1tYXJ5LnByaWNlLFxuICAgICAgICAgICAgICAgIGludmVyc2VfMjRoX2FnbzogdGFibGUuc3VtbWFyeS5wcmljZV8yNGhfYWdvLFxuICAgICAgICAgICAgICAgIG1heF9pbnZlcnNlOiB0YWJsZS5zdW1tYXJ5Lm1heF9wcmljZSxcbiAgICAgICAgICAgICAgICBtYXhfcHJpY2U6IHRhYmxlLnN1bW1hcnkubWF4X2ludmVyc2UsXG4gICAgICAgICAgICAgICAgbWluX2ludmVyc2U6IHRhYmxlLnN1bW1hcnkubWluX3ByaWNlLFxuICAgICAgICAgICAgICAgIG1pbl9wcmljZTogdGFibGUuc3VtbWFyeS5taW5faW52ZXJzZSxcbiAgICAgICAgICAgICAgICByZWNvcmRzOiB0YWJsZS5zdW1tYXJ5LnJlY29yZHMsXG4gICAgICAgICAgICAgICAgdm9sdW1lOiB0YWJsZS5zdW1tYXJ5LmFtb3VudCxcbiAgICAgICAgICAgICAgICBhbW91bnQ6IHRhYmxlLnN1bW1hcnkudm9sdW1lLFxuICAgICAgICAgICAgICAgIHBlcmNlbnQ6IHRhYmxlLnN1bW1hcnkuaXBlcmNlbnQsXG4gICAgICAgICAgICAgICAgaXBlcmNlbnQ6IHRhYmxlLnN1bW1hcnkucGVyY2VudCxcbiAgICAgICAgICAgICAgICBwZXJjZW50X3N0cjogdGFibGUuc3VtbWFyeS5pcGVyY2VudF9zdHIsXG4gICAgICAgICAgICAgICAgaXBlcmNlbnRfc3RyOiB0YWJsZS5zdW1tYXJ5LnBlcmNlbnRfc3RyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR4OiB0YWJsZS50eFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXZlcnNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTY29wZUZvcihjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgpIHtcbiAgICAgICAgaWYgKCFjb21vZGl0eSB8fCAhY3VycmVuY3kpIHJldHVybiBcIlwiO1xuICAgICAgICByZXR1cm4gY29tb2RpdHkuc3ltYm9sLnRvTG93ZXJDYXNlKCkgKyBcIi5cIiArIGN1cnJlbmN5LnN5bWJvbC50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbnZlcnNlU2NvcGUoc2NvcGU6c3RyaW5nKSB7XG4gICAgICAgIGlmICghc2NvcGUpIHJldHVybiBzY29wZTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQodHlwZW9mIHNjb3BlID09XCJzdHJpbmdcIiwgXCJFUlJPUjogc3RyaW5nIHNjb3BlIGV4cGVjdGVkLCBnb3QgXCIsIHR5cGVvZiBzY29wZSwgc2NvcGUpO1xuICAgICAgICB2YXIgcGFydHMgPSBzY29wZS5zcGxpdChcIi5cIik7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KHBhcnRzLmxlbmd0aCA9PSAyLCBcIkVSUk9SOiBzY29wZSBmb3JtYXQgZXhwZWN0ZWQgaXMgeHh4Lnl5eSwgZ290OiBcIiwgdHlwZW9mIHNjb3BlLCBzY29wZSk7XG4gICAgICAgIHZhciBpbnZlcnNlID0gcGFydHNbMV0gKyBcIi5cIiArIHBhcnRzWzBdO1xuICAgICAgICByZXR1cm4gaW52ZXJzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2Fub25pY2FsU2NvcGUoc2NvcGU6c3RyaW5nKSB7XG4gICAgICAgIGlmICghc2NvcGUpIHJldHVybiBzY29wZTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQodHlwZW9mIHNjb3BlID09XCJzdHJpbmdcIiwgXCJFUlJPUjogc3RyaW5nIHNjb3BlIGV4cGVjdGVkLCBnb3QgXCIsIHR5cGVvZiBzY29wZSwgc2NvcGUpO1xuICAgICAgICB2YXIgcGFydHMgPSBzY29wZS5zcGxpdChcIi5cIik7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KHBhcnRzLmxlbmd0aCA9PSAyLCBcIkVSUk9SOiBzY29wZSBmb3JtYXQgZXhwZWN0ZWQgaXMgeHh4Lnl5eSwgZ290OiBcIiwgdHlwZW9mIHNjb3BlLCBzY29wZSk7XG4gICAgICAgIHZhciBpbnZlcnNlID0gcGFydHNbMV0gKyBcIi5cIiArIHBhcnRzWzBdO1xuICAgICAgICBpZiAocGFydHNbMV0gPT0gXCJ0bG9zXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBzY29wZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFydHNbMF0gPT0gXCJ0bG9zXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnZlcnNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJ0c1swXSA8IHBhcnRzWzFdKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NvcGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaW52ZXJzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBpc0Nhbm9uaWNhbChzY29wZTpzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpID09IHNjb3BlO1xuICAgIH1cblxuICAgIFxuICAgIFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gR2V0dGVycyBcblxuICAgIGdldEJhbGFuY2UodG9rZW46VG9rZW5ERVgpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmJhbGFuY2VzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5iYWxhbmNlc1tpXS50b2tlbi5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFsYW5jZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBBc3NldERFWChcIjAgXCIgKyB0b2tlbi5zeW1ib2wsIHRoaXMpO1xuICAgIH1cblxuICAgIGFzeW5jIGdldFNvbWVGcmVlRmFrZVRva2VucyhzeW1ib2w6c3RyaW5nID0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5nZXRTb21lRnJlZUZha2VUb2tlbnMoKVwiKTtcbiAgICAgICAgdmFyIF90b2tlbiA9IHN5bWJvbDsgICAgXG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZnJlZWZha2UtXCIrX3Rva2VuIHx8IFwidG9rZW5cIiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRUb2tlblN0YXRzLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgdmFyIGNvdW50cyA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8MTAwOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRva2Vuc1tpXS5zeW1ib2wgPT0gc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgIHZhciByYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGksIFwiUmFuZG9tOiBcIiwgcmFuZG9tKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRva2VuICYmIHJhbmRvbSA+IDAuNSkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG9rZW5zW2kgJSB0aGlzLnRva2Vucy5sZW5ndGhdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4uZmFrZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZG9tID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyYW5kb20gPiAwLjUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudGVsb3M7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaTwxMDAgJiYgdG9rZW4gJiYgdGhpcy5nZXRCYWxhbmNlKHRva2VuKS5hbW91bnQudG9OdW1iZXIoKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGksIFwidG9rZW46IFwiLCB0b2tlbik7XG5cbiAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmFuZG9tID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vbnRvID0gTWF0aC5mbG9vcigxMDAwMCAqIHJhbmRvbSkgLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBxdWFudGl0eSA9IG5ldyBBc3NldERFWChcIlwiICsgbW9udG8gKyBcIiBcIiArIHRva2VuLnN5bWJvbCAsdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtZW1vID0gXCJ5b3UgZ2V0IFwiICsgcXVhbnRpdHkudmFsdWVUb1N0cmluZygpKyBcIiBmcmVlIGZha2UgXCIgKyB0b2tlbi5zeW1ib2wgKyBcIiB0b2tlbnMgdG8gcGxheSBvbiB2YXBhZWUuaW8gREVYXCI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmV4Y2VjdXRlKFwiaXNzdWVcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG86ICB0aGlzLnNjYXR0ZXIuYWNjb3VudC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IHF1YW50aXR5LnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vOiBtZW1vXG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldEJhbGFuY2VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImZyZWVmYWtlLVwiK190b2tlbiB8fCBcInRva2VuXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtZW1vO1xuICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZnJlZWZha2UtXCIrX3Rva2VuIHx8IFwidG9rZW5cIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBnZXRUb2tlbk5vdyhzeW06c3RyaW5nKTogVG9rZW5ERVgge1xuICAgICAgICBpZiAoIXN5bSkgcmV0dXJuIG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy50b2tlbnMpIHtcbiAgICAgICAgICAgIC8vIHRoZXJlJ3MgYSBsaXR0bGUgYnVnLiBUaGlzIGlzIGEganVzdGEgIHdvcmsgYXJyb3VuZFxuICAgICAgICAgICAgaWYgKHRoaXMudG9rZW5zW2ldLnN5bWJvbC50b1VwcGVyQ2FzZSgpID09IFwiVExPU1wiICYmIHRoaXMudG9rZW5zW2ldLm9mZmNoYWluKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBzb2x2ZXMgYXR0YWNoaW5nIHdyb25nIHRsb3MgdG9rZW4gdG8gYXNzZXRcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0aGlzLnRva2Vuc1tpXS5zeW1ib2wudG9VcHBlckNhc2UoKSA9PSBzeW0udG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRUb2tlbihzeW06c3RyaW5nKTogUHJvbWlzZTxUb2tlbkRFWD4ge1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRUb2tlbk5vdyhzeW0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXREZXBvc2l0cyhhY2NvdW50OnN0cmluZyA9IG51bGwpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5nZXREZXBvc2l0cygpXCIpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImRlcG9zaXRzXCIsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgZGVwb3NpdHM6IEFzc2V0REVYW10gPSBbXTtcbiAgICAgICAgICAgIGlmICghYWNjb3VudCAmJiB0aGlzLmN1cnJlbnQubmFtZSkge1xuICAgICAgICAgICAgICAgIGFjY291bnQgPSB0aGlzLmN1cnJlbnQubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhY2NvdW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGF3YWl0IHRoaXMuZmV0Y2hEZXBvc2l0cyhhY2NvdW50KTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHJlc3VsdC5yb3dzKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlcG9zaXRzLnB1c2gobmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmFtb3VudCwgdGhpcykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGVwb3NpdHMgPSBkZXBvc2l0cztcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdHNcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVwb3NpdHM7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGdldEJhbGFuY2VzKGFjY291bnQ6c3RyaW5nID0gbnVsbCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldEJhbGFuY2VzKClcIik7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYmFsYW5jZXNcIiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciBfYmFsYW5jZXM6IEFzc2V0REVYW107XG4gICAgICAgICAgICBpZiAoIWFjY291bnQgJiYgdGhpcy5jdXJyZW50Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICBhY2NvdW50ID0gdGhpcy5jdXJyZW50Lm5hbWU7XG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoYWNjb3VudCkge1xuICAgICAgICAgICAgICAgIF9iYWxhbmNlcyA9IGF3YWl0IHRoaXMuZmV0Y2hCYWxhbmNlcyhhY2NvdW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYmFsYW5jZXMgPSBfYmFsYW5jZXM7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWCBiYWxhbmNlcyB1cGRhdGVkXCIpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJiYWxhbmNlc1wiLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5iYWxhbmNlcztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0VGhpc1NlbGxPcmRlcnModGFibGU6c3RyaW5nLCBpZHM6bnVtYmVyW10pOiBQcm9taXNlPGFueVtdPiB7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidGhpc29yZGVyc1wiLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBpZHMpIHtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBpZHNbaV07XG4gICAgICAgICAgICAgICAgdmFyIGdvdGl0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdFtqXS5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ290aXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGdvdGl0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcmVzOlRhYmxlUmVzdWx0ID0gYXdhaXQgdGhpcy5mZXRjaE9yZGVycyh7c2NvcGU6dGFibGUsIGxpbWl0OjEsIGxvd2VyX2JvdW5kOmlkLnRvU3RyaW5nKCl9KTtcblxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQocmVzLnJvd3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ0aGlzb3JkZXJzXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pOyAgICBcbiAgICB9XG5cbiAgICBhc3luYyBnZXRVc2VyT3JkZXJzKGFjY291bnQ6c3RyaW5nID0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5nZXRVc2VyT3JkZXJzKClcIik7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidXNlcm9yZGVyc1wiLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIHVzZXJvcmRlcnM6IFRhYmxlUmVzdWx0O1xuICAgICAgICAgICAgaWYgKCFhY2NvdW50ICYmIHRoaXMuY3VycmVudC5uYW1lKSB7XG4gICAgICAgICAgICAgICAgYWNjb3VudCA9IHRoaXMuY3VycmVudC5uYW1lO1xuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGFjY291bnQpIHtcbiAgICAgICAgICAgICAgICB1c2Vyb3JkZXJzID0gYXdhaXQgdGhpcy5mZXRjaFVzZXJPcmRlcnMoYWNjb3VudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbGlzdDogVXNlck9yZGVyc1tdID0gPFVzZXJPcmRlcnNbXT51c2Vyb3JkZXJzLnJvd3M7XG4gICAgICAgICAgICB2YXIgbWFwOiBVc2VyT3JkZXJzTWFwID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpZHMgPSBsaXN0W2ldLmlkcztcbiAgICAgICAgICAgICAgICB2YXIgdGFibGUgPSBsaXN0W2ldLnRhYmxlO1xuICAgICAgICAgICAgICAgIHZhciBvcmRlcnMgPSBhd2FpdCB0aGlzLmdldFRoaXNTZWxsT3JkZXJzKHRhYmxlLCBpZHMpO1xuICAgICAgICAgICAgICAgIG1hcFt0YWJsZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlOiB0YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiB0aGlzLmF1eFByb2Nlc3NSb3dzVG9PcmRlcnMob3JkZXJzKSxcbiAgICAgICAgICAgICAgICAgICAgaWRzOmlkc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnVzZXJvcmRlcnMgPSBtYXA7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnVzZXJvcmRlcnMpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ1c2Vyb3JkZXJzXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZXJvcmRlcnM7XG4gICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZUFjdGl2aXR5KCkge1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImFjdGl2aXR5XCIsIHRydWUpO1xuICAgICAgICB2YXIgcGFnZXNpemUgPSB0aGlzLmFjdGl2aXR5UGFnZXNpemU7XG4gICAgICAgIHZhciBwYWdlcyA9IGF3YWl0IHRoaXMuZ2V0QWN0aXZpdHlUb3RhbFBhZ2VzKHBhZ2VzaXplKTtcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGhpcy5mZXRjaEFjdGl2aXR5KHBhZ2VzLTIsIHBhZ2VzaXplKSxcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hBY3Rpdml0eShwYWdlcy0xLCBwYWdlc2l6ZSksXG4gICAgICAgICAgICB0aGlzLmZldGNoQWN0aXZpdHkocGFnZXMtMCwgcGFnZXNpemUpXG4gICAgICAgIF0pO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImFjdGl2aXR5XCIsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkTW9yZUFjdGl2aXR5KCkge1xuICAgICAgICBpZiAodGhpcy5hY3Rpdml0eS5saXN0Lmxlbmd0aCA9PSAwKSByZXR1cm47XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYWN0aXZpdHlcIiwgdHJ1ZSk7XG4gICAgICAgIHZhciBwYWdlc2l6ZSA9IHRoaXMuYWN0aXZpdHlQYWdlc2l6ZTtcbiAgICAgICAgdmFyIGZpcnN0ID0gdGhpcy5hY3Rpdml0eS5saXN0W3RoaXMuYWN0aXZpdHkubGlzdC5sZW5ndGgtMV07XG4gICAgICAgIHZhciBpZCA9IGZpcnN0LmlkIC0gcGFnZXNpemU7XG4gICAgICAgIHZhciBwYWdlID0gTWF0aC5mbG9vcigoaWQtMSkgLyBwYWdlc2l6ZSk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5mZXRjaEFjdGl2aXR5KHBhZ2UsIHBhZ2VzaXplKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJhY3Rpdml0eVwiLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlVHJhZGUoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYLCB1cGRhdGVVc2VyOmJvb2xlYW4gPSB0cnVlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgudXBkYXRlVHJhZGUoKVwiKTtcbiAgICAgICAgdmFyIGNocm9ub19rZXkgPSBcInVwZGF0ZVRyYWRlXCI7XG4gICAgICAgIHRoaXMuZmVlZC5zdGFydENocm9ubyhjaHJvbm9fa2V5KTtcblxuICAgICAgICBpZih1cGRhdGVVc2VyKSB0aGlzLnVwZGF0ZUN1cnJlbnRVc2VyKCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0aGlzLmdldFRyYW5zYWN0aW9uSGlzdG9yeShjb21vZGl0eSwgY3VycmVuY3ksIC0xLCAtMSwgdHJ1ZSkudGhlbihfID0+IHRoaXMuZmVlZC5zZXRNYXJjayhjaHJvbm9fa2V5LCBcImdldFRyYW5zYWN0aW9uSGlzdG9yeSgpXCIpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0QmxvY2tIaXN0b3J5KGNvbW9kaXR5LCBjdXJyZW5jeSwgLTEsIC0xLCB0cnVlKS50aGVuKF8gPT4gdGhpcy5mZWVkLnNldE1hcmNrKGNocm9ub19rZXksIFwiZ2V0QmxvY2tIaXN0b3J5KClcIikpLFxuICAgICAgICAgICAgdGhpcy5nZXRTZWxsT3JkZXJzKGNvbW9kaXR5LCBjdXJyZW5jeSwgdHJ1ZSkudGhlbihfID0+IHRoaXMuZmVlZC5zZXRNYXJjayhjaHJvbm9fa2V5LCBcImdldFNlbGxPcmRlcnMoKVwiKSksXG4gICAgICAgICAgICB0aGlzLmdldEJ1eU9yZGVycyhjb21vZGl0eSwgY3VycmVuY3ksIHRydWUpLnRoZW4oXyA9PiB0aGlzLmZlZWQuc2V0TWFyY2soY2hyb25vX2tleSwgXCJnZXRCdXlPcmRlcnMoKVwiKSksXG4gICAgICAgICAgICB0aGlzLmdldE1hcmtldFN1bW1hcnkoY29tb2RpdHksIGN1cnJlbmN5LCB0cnVlKS50aGVuKF8gPT4gdGhpcy5mZWVkLnNldE1hcmNrKGNocm9ub19rZXksIFwiZ2V0TWFya2V0U3VtbWFyeSgpXCIpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0T3JkZXJTdW1tYXJ5KCkudGhlbihfID0+IHRoaXMuZmVlZC5zZXRNYXJjayhjaHJvbm9fa2V5LCBcImdldE9yZGVyU3VtbWFyeSgpXCIpKSxcbiAgICAgICAgXSkudGhlbihyID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3JldmVyc2UgPSB7fTtcbiAgICAgICAgICAgIHRoaXMucmVzb3J0VG9rZW5zKCk7XG4gICAgICAgICAgICB0aGlzLnJlc29ydFRvcE1hcmtldHMoKTtcbiAgICAgICAgICAgIC8vIHRoaXMuZmVlZC5wcmludENocm9ubyhjaHJvbm9fa2V5KTtcbiAgICAgICAgICAgIHRoaXMub25UcmFkZVVwZGF0ZWQubmV4dChudWxsKTtcbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGVDdXJyZW50VXNlcigpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC51cGRhdGVDdXJyZW50VXNlcigpXCIpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImN1cnJlbnRcIiwgdHJ1ZSk7ICAgICAgICBcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMuZ2V0VXNlck9yZGVycygpLFxuICAgICAgICAgICAgdGhpcy5nZXREZXBvc2l0cygpLFxuICAgICAgICAgICAgdGhpcy5nZXRCYWxhbmNlcygpXG4gICAgICAgIF0pLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImN1cnJlbnRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIF87XG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjdXJyZW50XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0QmxvY2tIaXN0b3J5VG90YWxQYWdlc0ZvcihzY29wZTpzdHJpbmcsIHBhZ2VzaXplOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9tYXJrZXRzKSByZXR1cm4gMDtcbiAgICAgICAgdmFyIG1hcmtldCA9IHRoaXMubWFya2V0KHNjb3BlKTtcbiAgICAgICAgaWYgKCFtYXJrZXQpIHJldHVybiAwO1xuICAgICAgICB2YXIgdG90YWwgPSBtYXJrZXQuYmxvY2tzO1xuICAgICAgICB2YXIgbW9kID0gdG90YWwgJSBwYWdlc2l6ZTtcbiAgICAgICAgdmFyIGRpZiA9IHRvdGFsIC0gbW9kO1xuICAgICAgICB2YXIgcGFnZXMgPSBkaWYgLyBwYWdlc2l6ZTtcbiAgICAgICAgaWYgKG1vZCA+IDApIHtcbiAgICAgICAgICAgIHBhZ2VzICs9MTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImdldEJsb2NrSGlzdG9yeVRvdGFsUGFnZXNGb3IoKSB0b3RhbDpcIiwgdG90YWwsIFwiIHBhZ2VzOlwiLCBwYWdlcyk7XG4gICAgICAgIHJldHVybiBwYWdlcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEhpc3RvcnlUb3RhbFBhZ2VzRm9yKHNjb3BlOnN0cmluZywgcGFnZXNpemU6IG51bWJlcikge1xuICAgICAgICBpZiAoIXRoaXMuX21hcmtldHMpIHJldHVybiAwO1xuICAgICAgICB2YXIgbWFya2V0ID0gdGhpcy5tYXJrZXQoc2NvcGUpO1xuICAgICAgICBpZiAoIW1hcmtldCkgcmV0dXJuIDA7XG4gICAgICAgIHZhciB0b3RhbCA9IG1hcmtldC5kZWFscztcbiAgICAgICAgdmFyIG1vZCA9IHRvdGFsICUgcGFnZXNpemU7XG4gICAgICAgIHZhciBkaWYgPSB0b3RhbCAtIG1vZDtcbiAgICAgICAgdmFyIHBhZ2VzID0gZGlmIC8gcGFnZXNpemU7XG4gICAgICAgIGlmIChtb2QgPiAwKSB7XG4gICAgICAgICAgICBwYWdlcyArPTE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZ2VzO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZ2V0QWN0aXZpdHlUb3RhbFBhZ2VzKHBhZ2VzaXplOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJldmVudHNcIiwge1xuICAgICAgICAgICAgbGltaXQ6IDFcbiAgICAgICAgfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHJlc3VsdC5yb3dzWzBdLnBhcmFtcztcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IHBhcnNlSW50KHBhcmFtcy5zcGxpdChcIiBcIilbMF0pLTE7XG4gICAgICAgICAgICB2YXIgbW9kID0gdG90YWwgJSBwYWdlc2l6ZTtcbiAgICAgICAgICAgIHZhciBkaWYgPSB0b3RhbCAtIG1vZDtcbiAgICAgICAgICAgIHZhciBwYWdlcyA9IGRpZiAvIHBhZ2VzaXplO1xuICAgICAgICAgICAgaWYgKG1vZCA+IDApIHtcbiAgICAgICAgICAgICAgICBwYWdlcyArPTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFjdGl2aXR5LnRvdGFsID0gdG90YWw7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5nZXRBY3Rpdml0eVRvdGFsUGFnZXMoKSB0b3RhbDogXCIsIHRvdGFsLCBcIiBwYWdlczogXCIsIHBhZ2VzKTtcbiAgICAgICAgICAgIHJldHVybiBwYWdlcztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0VHJhbnNhY3Rpb25IaXN0b3J5KGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCwgcGFnZTpudW1iZXIgPSAtMSwgcGFnZXNpemU6bnVtYmVyID0gLTEsIGZvcmNlOmJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHZhciBzY29wZTpzdHJpbmcgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHRoaXMuZ2V0U2NvcGVGb3IoY29tb2RpdHksIGN1cnJlbmN5KSk7XG4gICAgICAgIHZhciBhdXggPSBudWxsO1xuICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJoaXN0b3J5LlwiK3Njb3BlLCB0cnVlKTtcbiAgICAgICAgYXV4ID0gdGhpcy53YWl0T3JkZXJTdW1tYXJ5LnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICBpZiAocGFnZXNpemUgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBwYWdlc2l6ZSA9IDEwOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYWdlID09IC0xKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhZ2VzID0gdGhpcy5nZXRIaXN0b3J5VG90YWxQYWdlc0ZvcihzY29wZSwgcGFnZXNpemUpO1xuICAgICAgICAgICAgICAgIHBhZ2UgPSBwYWdlcy0zO1xuICAgICAgICAgICAgICAgIGlmIChwYWdlIDwgMCkgcGFnZSA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaEhpc3Rvcnkoc2NvcGUsIHBhZ2UrMCwgcGFnZXNpemUpLFxuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hIaXN0b3J5KHNjb3BlLCBwYWdlKzEsIHBhZ2VzaXplKSxcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoSGlzdG9yeShzY29wZSwgcGFnZSsyLCBwYWdlc2l6ZSlcbiAgICAgICAgICAgIF0pLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJoaXN0b3J5LlwiK3Njb3BlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFya2V0KHNjb3BlKS5oaXN0b3J5O1xuICAgICAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJoaXN0b3J5LlwiK3Njb3BlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5tYXJrZXQoc2NvcGUpICYmICFmb3JjZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5tYXJrZXQoc2NvcGUpLmhpc3Rvcnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhdXg7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uSGlzdG9yeUNoYW5nZS5uZXh0KHJlc3VsdCk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGF1eEhvdXJUb0xhYmVsKGhvdXI6bnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShob3VyICogMTAwMCAqIDYwICogNjApO1xuICAgICAgICB2YXIgbGFiZWwgPSBkLmdldEhvdXJzKCkgPT0gMCA/IHRoaXMuZGF0ZVBpcGUudHJhbnNmb3JtKGQsICdkZC9NTScpIDogZC5nZXRIb3VycygpICsgXCJoXCI7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbGFiZWw7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QmxvY2tIaXN0b3J5KGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCwgcGFnZTpudW1iZXIgPSAtMSwgcGFnZXNpemU6bnVtYmVyID0gLTEsIGZvcmNlOmJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldEJsb2NrSGlzdG9yeSgpXCIsIGNvbW9kaXR5LnN5bWJvbCwgcGFnZSwgcGFnZXNpemUpO1xuICAgICAgICAvLyAvLyBlbGFwc2VkIHRpbWVcbiAgICAgICAgLy8gdmFyIHN0YXJ0VGltZTpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgLy8gdmFyIGRpZmY6bnVtYmVyO1xuICAgICAgICAvLyB2YXIgc2VjOm51bWJlcjtcblxuICAgICAgICB2YXIgc2NvcGU6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZSh0aGlzLmdldFNjb3BlRm9yKGNvbW9kaXR5LCBjdXJyZW5jeSkpO1xuICAgICAgICB2YXIgYXV4ID0gbnVsbDtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYmxvY2staGlzdG9yeS5cIitzY29wZSwgdHJ1ZSk7XG5cbiAgICAgICAgYXV4ID0gdGhpcy53YWl0T3JkZXJTdW1tYXJ5LnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgZmV0Y2hCbG9ja0hpc3RvcnlTdGFydDpEYXRlID0gbmV3IERhdGUoKTtcblxuICAgICAgICAgICAgaWYgKHBhZ2VzaXplID09IC0xKSB7XG4gICAgICAgICAgICAgICAgcGFnZXNpemUgPSAxMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYWdlID09IC0xKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhZ2VzID0gdGhpcy5nZXRCbG9ja0hpc3RvcnlUb3RhbFBhZ2VzRm9yKHNjb3BlLCBwYWdlc2l6ZSk7XG4gICAgICAgICAgICAgICAgcGFnZSA9IHBhZ2VzLTM7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UgPCAwKSBwYWdlID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwcm9taXNlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPD1wYWdlczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByb21pc2UgPSB0aGlzLmZldGNoQmxvY2tIaXN0b3J5KHNjb3BlLCBpLCBwYWdlc2l6ZSk7XG4gICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgICAgIC8vIC8vIGVsYXBzZWQgdGltZVxuICAgICAgICAgICAgICAgIC8vIHZhciBmZXRjaEJsb2NrSGlzdG9yeVRpbWU6RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgLy8gZGlmZiA9IGZldGNoQmxvY2tIaXN0b3J5VGltZS5nZXRUaW1lKCkgLSBmZXRjaEJsb2NrSGlzdG9yeVN0YXJ0LmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAvLyBzZWMgPSBkaWZmIC8gMTAwMDtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqIFZhcGFlZURFWC5nZXRCbG9ja0hpc3RvcnkoKSBmZXRjaEJsb2NrSGlzdG9yeVRpbWUgc2VjOiBcIiwgc2VjLCBcIihcIixkaWZmLFwiKVwiKTtcblxuXG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJibG9jay1oaXN0b3J5LlwiK3Njb3BlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgdmFyIG1hcmtldDogTWFya2V0ID0gdGhpcy5tYXJrZXQoc2NvcGUpO1xuICAgICAgICAgICAgICAgIG1hcmtldC5ibG9ja2xpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICBtYXJrZXQucmV2ZXJzZWJsb2NrcyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIHZhciBob3JhID0gMTAwMCAqIDYwICogNjA7XG4gICAgICAgICAgICAgICAgdmFyIGhvdXIgPSBNYXRoLmZsb29yKG5vdy5nZXRUaW1lKCkvaG9yYSk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItPlwiLCBob3VyKTtcbiAgICAgICAgICAgICAgICB2YXIgbGFzdF9ibG9jayA9IG51bGw7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RfaG91ciA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICB2YXIgb3JkZXJlZF9ibG9ja3MgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG1hcmtldC5ibG9jaykge1xuICAgICAgICAgICAgICAgICAgICBvcmRlcmVkX2Jsb2Nrcy5wdXNoKG1hcmtldC5ibG9ja1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgb3JkZXJlZF9ibG9ja3Muc29ydChmdW5jdGlvbihhOkhpc3RvcnlCbG9jaywgYjpIaXN0b3J5QmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoYS5ob3VyIDwgYi5ob3VyKSByZXR1cm4gLTExO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG9yZGVyZWRfYmxvY2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBibG9jazpIaXN0b3J5QmxvY2sgPSBvcmRlcmVkX2Jsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gdGhpcy5hdXhIb3VyVG9MYWJlbChibG9jay5ob3VyKTtcbiAgICAgICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItPlwiLCBpLCBsYWJlbCwgYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0ZSA9IGJsb2NrLmRhdGU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaWYgPSBub3cuZ2V0VGltZSgpIC0gYmxvY2suZGF0ZS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtZXMgPSAzMCAqIDI0ICogaG9yYTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsYXBzZWRfbW9udGhzID0gZGlmIC8gbWVzO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxhcHNlZF9tb250aHMgPiAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRyb3BwaW5nIGJsb2NrIHRvbyBvbGRcIiwgW2Jsb2NrLCBibG9jay5kYXRlLnRvVVRDU3RyaW5nKCldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RfYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaWYgPSBibG9jay5ob3VyIC0gbGFzdF9ibG9jay5ob3VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaj0xOyBqPGRpZjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsX2kgPSB0aGlzLmF1eEhvdXJUb0xhYmVsKGxhc3RfYmxvY2suaG91citqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tPlwiLCBqLCBsYWJlbF9pLCBibG9jayk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25pbmljYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IGxhc3RfYmxvY2sucHJpY2UuYW1vdW50LnRvTnVtYmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF1eCA9IFtsYWJlbF9pLCBwcmljZSwgcHJpY2UsIHByaWNlLCBwcmljZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFya2V0LmJsb2NrbGlzdC5wdXNoKGF1eCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV2ZXJzZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGludmVyc2UgPSBsYXN0X2Jsb2NrLmludmVyc2UuYW1vdW50LnRvTnVtYmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF1eCA9IFtsYWJlbF9pLCBpbnZlcnNlLCBpbnZlcnNlLCBpbnZlcnNlLCBpbnZlcnNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXQucmV2ZXJzZWJsb2Nrcy5wdXNoKGF1eCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIG9iajphbnlbXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uaW5pY2FsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgb2JqID0gW2xhYmVsXTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goYmxvY2subWF4LmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goYmxvY2suZW50cmFuY2UuYW1vdW50LnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICBvYmoucHVzaChibG9jay5wcmljZS5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKGJsb2NrLm1pbi5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtldC5ibG9ja2xpc3QucHVzaChvYmopO1xuICAgICAgICAgICAgICAgICAgICAvLyByZXZlcnNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgb2JqID0gW2xhYmVsXTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goMS4wL2Jsb2NrLm1heC5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKDEuMC9ibG9jay5lbnRyYW5jZS5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKDEuMC9ibG9jay5wcmljZS5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKDEuMC9ibG9jay5taW4uYW1vdW50LnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXQucmV2ZXJzZWJsb2Nrcy5wdXNoKG9iaik7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RfYmxvY2sgPSBibG9jaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobGFzdF9ibG9jayAmJiBob3VyICE9IGxhc3RfYmxvY2suaG91cikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGlmID0gaG91ciAtIGxhc3RfYmxvY2suaG91cjtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaj0xOyBqPD1kaWY7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsX2kgPSB0aGlzLmF1eEhvdXJUb0xhYmVsKGxhc3RfYmxvY2suaG91citqKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uaW5pY2FsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IGxhc3RfYmxvY2sucHJpY2UuYW1vdW50LnRvTnVtYmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXV4ID0gW2xhYmVsX2ksIHByaWNlLCBwcmljZSwgcHJpY2UsIHByaWNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtldC5ibG9ja2xpc3QucHVzaChhdXgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZXZlcnNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnZlcnNlID0gbGFzdF9ibG9jay5pbnZlcnNlLmFtb3VudC50b051bWJlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF1eCA9IFtsYWJlbF9pLCBpbnZlcnNlLCBpbnZlcnNlLCBpbnZlcnNlLCBpbnZlcnNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtldC5yZXZlcnNlYmxvY2tzLnB1c2goYXV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIC8vIGVsYXBzZWQgdGltZVxuICAgICAgICAgICAgICAgIC8vIHZhciBmaXJzdExldmVsVGltZTpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAvLyBkaWZmID0gZmlyc3RMZXZlbFRpbWUuZ2V0VGltZSgpIC0gZmV0Y2hCbG9ja0hpc3RvcnlUaW1lLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAvLyBzZWMgPSBkaWZmIC8gMTAwMDtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqIFZhcGFlZURFWC5nZXRCbG9ja0hpc3RvcnkoKSBmaXJzdExldmVsVGltZSBzZWM6IFwiLCBzZWMsIFwiKFwiLGRpZmYsXCIpXCIpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0+XCIsIG1hcmtldC5ibG9ja2xpc3QpO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMub25CbG9ja2xpc3RDaGFuZ2UubmV4dChtYXJrZXQuYmxvY2tsaXN0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFya2V0O1xuICAgICAgICAgICAgfSkudGhlbihtYXJrZXQgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgICAgIC8vIC8vIGVsYXBzZWQgdGltZVxuICAgICAgICAgICAgICAgIC8vIHZhciBhbGxMZXZlbHNTdGFydDpEYXRlID0gbmV3IERhdGUoKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIGxpbWl0ID0gMjU2O1xuICAgICAgICAgICAgICAgIHZhciBsZXZlbHMgPSBbbWFya2V0LmJsb2NrbGlzdF07XG4gICAgICAgICAgICAgICAgdmFyIHJldmVyc2VzID0gW21hcmtldC5yZXZlcnNlYmxvY2tzXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBjdXJyZW50ID0gMDsgbGV2ZWxzW2N1cnJlbnRdLmxlbmd0aCA+IGxpbWl0OyBjdXJyZW50KyspIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coY3VycmVudCAsbGV2ZWxzW2N1cnJlbnRdLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdsZXZlbDphbnlbXVtdID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdyZXZlcnNlOmFueVtdW10gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lcmdlZDphbnlbXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bGV2ZWxzW2N1cnJlbnRdLmxlbmd0aDsgaSs9Mikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2Fub25pY2FsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdl8xOmFueVtdID0gbGV2ZWxzW2N1cnJlbnRdW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZfMiA9IGxldmVsc1tjdXJyZW50XVtpKzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1lcmdlZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeD0wOyB4PDU7IHgrKykgbWVyZ2VkW3hdID0gdl8xW3hdOyAvLyBjbGVhbiBjb3B5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodl8yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzBdID0gdl8xWzBdLnNwbGl0KFwiL1wiKS5sZW5ndGggPiAxID8gdl8xWzBdIDogdl8yWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFsxXSA9IE1hdGgubWF4KHZfMVsxXSwgdl8yWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbMl0gPSB2XzFbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzNdID0gdl8yWzNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFs0XSA9IE1hdGgubWluKHZfMVs0XSwgdl8yWzRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld2xldmVsLnB1c2gobWVyZ2VkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV2ZXJzZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZfMSA9IHJldmVyc2VzW2N1cnJlbnRdW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdl8yID0gcmV2ZXJzZXNbY3VycmVudF1baSsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeD0wOyB4PDU7IHgrKykgbWVyZ2VkW3hdID0gdl8xW3hdOyAvLyBjbGVhbiBjb3B5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodl8yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzBdID0gdl8xWzBdLnNwbGl0KFwiL1wiKS5sZW5ndGggPiAxID8gdl8xWzBdIDogdl8yWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFsxXSA9IE1hdGgubWluKHZfMVsxXSwgdl8yWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbMl0gPSB2XzFbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzNdID0gdl8yWzNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFs0XSA9IE1hdGgubWF4KHZfMVs0XSwgdl8yWzRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdyZXZlcnNlLnB1c2gobWVyZ2VkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldmVscy5wdXNoKG5ld2xldmVsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZXMucHVzaChuZXdyZXZlcnNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICBtYXJrZXQuYmxvY2tsZXZlbHMgPSBsZXZlbHM7XG4gICAgICAgICAgICAgICAgbWFya2V0LnJldmVyc2VsZXZlbHMgPSByZXZlcnNlcztcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAvLyBtYXJrZXQuYmxvY2tsZXZlbHMgPSBbbWFya2V0LmJsb2NrbGlzdF07XG4gICAgICAgICAgICAgICAgLy8gbWFya2V0LnJldmVyc2VsZXZlbHMgPSBbbWFya2V0LnJldmVyc2VibG9ja3NdO1xuICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gLy8gZWxhcHNlZCB0aW1lXG4gICAgICAgICAgICAgICAgLy8gdmFyIGFsbExldmVsc1RpbWU6RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgLy8gZGlmZiA9IGFsbExldmVsc1RpbWUuZ2V0VGltZSgpIC0gYWxsTGV2ZWxzU3RhcnQuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIC8vIHNlYyA9IGRpZmYgLyAxMDAwO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKiogVmFwYWVlREVYLmdldEJsb2NrSGlzdG9yeSgpIGFsbExldmVsc1RpbWUgc2VjOiBcIiwgc2VjLCBcIihcIixkaWZmLFwiKVwiKTsgICBcbiAgICAgICAgICAgICAgICAvLyAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiLCBtYXJrZXQuYmxvY2tsZXZlbHMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcmtldC5ibG9jaztcbiAgICAgICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYmxvY2staGlzdG9yeS5cIitzY29wZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMubWFya2V0KHNjb3BlKSAmJiAhZm9yY2UpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMubWFya2V0KHNjb3BlKS5ibG9jaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGF1eDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub25IaXN0b3J5Q2hhbmdlLm5leHQocmVzdWx0KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGFzeW5jIGdldFNlbGxPcmRlcnMoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYLCBmb3JjZTpib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB2YXIgc2NvcGU6c3RyaW5nID0gdGhpcy5nZXRTY29wZUZvcihjb21vZGl0eSwgY3VycmVuY3kpO1xuICAgICAgICB2YXIgY2Fub25pY2FsOnN0cmluZyA9IHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpO1xuICAgICAgICB2YXIgcmV2ZXJzZTpzdHJpbmcgPSB0aGlzLmludmVyc2VTY29wZShjYW5vbmljYWwpO1xuICAgICAgICB2YXIgYXV4ID0gbnVsbDtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwic2VsbG9yZGVyc1wiLCB0cnVlKTtcbiAgICAgICAgYXV4ID0gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgb3JkZXJzID0gYXdhaXQgdGhpcy5mZXRjaE9yZGVycyh7c2NvcGU6Y2Fub25pY2FsLCBsaW1pdDoxMDAsIGluZGV4X3Bvc2l0aW9uOiBcIjJcIiwga2V5X3R5cGU6IFwiaTY0XCJ9KTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSA9IHRoaXMuYXV4QXNzZXJ0U2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cInZwZS50bG9zXCIgfHwgc2NvcGU9PVwiY250LnRsb3NcIiljb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICAvLyBpZihzY29wZT09XCJ2cGUudGxvc1wiIHx8IHNjb3BlPT1cImNudC50bG9zXCIpY29uc29sZS5sb2coXCJTZWxsIGNydWRvOlwiLCBvcmRlcnMpO1xuICAgICAgICAgICAgdmFyIHNlbGw6IE9yZGVyW10gPSB0aGlzLmF1eFByb2Nlc3NSb3dzVG9PcmRlcnMob3JkZXJzLnJvd3MpO1xuICAgICAgICAgICAgc2VsbC5zb3J0KGZ1bmN0aW9uKGE6T3JkZXIsIGI6T3JkZXIpIHtcbiAgICAgICAgICAgICAgICBpZihhLnByaWNlLmFtb3VudC5pc0xlc3NUaGFuKGIucHJpY2UuYW1vdW50KSkgcmV0dXJuIC0xMTtcbiAgICAgICAgICAgICAgICBpZihhLnByaWNlLmFtb3VudC5pc0dyZWF0ZXJUaGFuKGIucHJpY2UuYW1vdW50KSkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cInZwZS50bG9zXCIgfHwgc2NvcGU9PVwiY250LnRsb3NcIiljb25zb2xlLmxvZyhcInNvcnRlZDpcIiwgc2VsbCk7XG4gICAgICAgICAgICAvLyBncm91cGluZyB0b2dldGhlciBvcmRlcnMgd2l0aCB0aGUgc2FtZSBwcmljZS5cbiAgICAgICAgICAgIHZhciBsaXN0OiBPcmRlclJvd1tdID0gW107XG4gICAgICAgICAgICB2YXIgcm93OiBPcmRlclJvdztcbiAgICAgICAgICAgIGlmIChzZWxsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxzZWxsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcmRlcjogT3JkZXIgPSBzZWxsW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3cgPSBsaXN0W2xpc3QubGVuZ3RoLTFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvdy5wcmljZS5hbW91bnQuZXEob3JkZXIucHJpY2UuYW1vdW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy50b3RhbC5hbW91bnQgPSByb3cudG90YWwuYW1vdW50LnBsdXMob3JkZXIudG90YWwuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cudGVsb3MuYW1vdW50ID0gcm93LnRlbG9zLmFtb3VudC5wbHVzKG9yZGVyLnRlbG9zLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93Lm93bmVyc1tvcmRlci5vd25lcl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5vcmRlcnMucHVzaChvcmRlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJvdyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cjogb3JkZXIucHJpY2UudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBvcmRlci5wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyczogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogb3JkZXIudG90YWwuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbG9zOiBvcmRlci50ZWxvcy5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogb3JkZXIuaW52ZXJzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1bTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1bXRlbG9zOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXJzOiB7fVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcm93Lm93bmVyc1tvcmRlci5vd25lcl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByb3cub3JkZXJzLnB1c2gob3JkZXIpO1xuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdW0gPSBuZXcgQmlnTnVtYmVyKDApO1xuICAgICAgICAgICAgdmFyIHN1bXRlbG9zID0gbmV3IEJpZ051bWJlcigwKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogaW4gbGlzdCkge1xuICAgICAgICAgICAgICAgIHZhciBvcmRlcl9yb3cgPSBsaXN0W2pdO1xuICAgICAgICAgICAgICAgIHN1bXRlbG9zID0gc3VtdGVsb3MucGx1cyhvcmRlcl9yb3cudGVsb3MuYW1vdW50KTtcbiAgICAgICAgICAgICAgICBzdW0gPSBzdW0ucGx1cyhvcmRlcl9yb3cudG90YWwuYW1vdW50KTtcbiAgICAgICAgICAgICAgICBvcmRlcl9yb3cuc3VtdGVsb3MgPSBuZXcgQXNzZXRERVgoc3VtdGVsb3MsIG9yZGVyX3Jvdy50ZWxvcy50b2tlbik7XG4gICAgICAgICAgICAgICAgb3JkZXJfcm93LnN1bSA9IG5ldyBBc3NldERFWChzdW0sIG9yZGVyX3Jvdy50b3RhbC50b2tlbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5vcmRlcnMuc2VsbCA9IGxpc3Q7XG4gICAgICAgICAgICAvLyBpZihzY29wZT09XCJ2cGUudGxvc1wiIHx8IHNjb3BlPT1cImNudC50bG9zXCIpY29uc29sZS5sb2coXCJTZWxsIGZpbmFsOlwiLCB0aGlzLnNjb3Blc1tzY29wZV0ub3JkZXJzLnNlbGwpO1xuICAgICAgICAgICAgLy8gaWYoc2NvcGU9PVwidnBlLnRsb3NcIiB8fCBzY29wZT09XCJjbnQudGxvc1wiKWNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcblxuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJzZWxsb3JkZXJzXCIsIGZhbHNlKTsgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0ub3JkZXJzLnNlbGw7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gJiYgIWZvcmNlKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0ub3JkZXJzLnNlbGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhdXg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgZ2V0QnV5T3JkZXJzKGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCwgZm9yY2U6Ym9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgdmFyIHNjb3BlOnN0cmluZyA9IHRoaXMuZ2V0U2NvcGVGb3IoY29tb2RpdHksIGN1cnJlbmN5KTtcbiAgICAgICAgdmFyIGNhbm9uaWNhbDpzdHJpbmcgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgdmFyIHJldmVyc2U6c3RyaW5nID0gdGhpcy5pbnZlcnNlU2NvcGUoY2Fub25pY2FsKTtcblxuXG4gICAgICAgIHZhciBhdXggPSBudWxsO1xuICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJidXlvcmRlcnNcIiwgdHJ1ZSk7XG4gICAgICAgIGF1eCA9IHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIG9yZGVycyA9IGF3YWl0IGF3YWl0IHRoaXMuZmV0Y2hPcmRlcnMoe3Njb3BlOnJldmVyc2UsIGxpbWl0OjUwLCBpbmRleF9wb3NpdGlvbjogXCIyXCIsIGtleV90eXBlOiBcImk2NFwifSk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gPSB0aGlzLmF1eEFzc2VydFNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJ1eSBjcnVkbzpcIiwgb3JkZXJzKTsgICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBidXk6IE9yZGVyW10gPSB0aGlzLmF1eFByb2Nlc3NSb3dzVG9PcmRlcnMob3JkZXJzLnJvd3MpO1xuICAgICAgICAgICAgYnV5LnNvcnQoZnVuY3Rpb24oYTpPcmRlciwgYjpPcmRlcil7XG4gICAgICAgICAgICAgICAgaWYoYS5wcmljZS5hbW91bnQuaXNMZXNzVGhhbihiLnByaWNlLmFtb3VudCkpIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmKGEucHJpY2UuYW1vdW50LmlzR3JlYXRlclRoYW4oYi5wcmljZS5hbW91bnQpKSByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJidXkgc29ydGVhZG86XCIsIGJ1eSk7XG5cbiAgICAgICAgICAgIC8vIGdyb3VwaW5nIHRvZ2V0aGVyIG9yZGVycyB3aXRoIHRoZSBzYW1lIHByaWNlLlxuICAgICAgICAgICAgdmFyIGxpc3Q6IE9yZGVyUm93W10gPSBbXTtcbiAgICAgICAgICAgIHZhciByb3c6IE9yZGVyUm93O1xuICAgICAgICAgICAgaWYgKGJ1eS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8YnV5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcmRlcjogT3JkZXIgPSBidXlbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdyA9IGxpc3RbbGlzdC5sZW5ndGgtMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93LnByaWNlLmFtb3VudC5lcShvcmRlci5wcmljZS5hbW91bnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LnRvdGFsLmFtb3VudCA9IHJvdy50b3RhbC5hbW91bnQucGx1cyhvcmRlci50b3RhbC5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy50ZWxvcy5hbW91bnQgPSByb3cudGVsb3MuYW1vdW50LnBsdXMob3JkZXIudGVsb3MuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cub3duZXJzW29yZGVyLm93bmVyXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93Lm9yZGVycy5wdXNoKG9yZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gICAgXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcm93ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyOiBvcmRlci5wcmljZS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IG9yZGVyLnByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiBvcmRlci50b3RhbC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVsb3M6IG9yZGVyLnRlbG9zLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiBvcmRlci5pbnZlcnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VtOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VtdGVsb3M6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcnM6IHt9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByb3cub3duZXJzW29yZGVyLm93bmVyXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJvdy5vcmRlcnMucHVzaChvcmRlcik7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gICAgICAgICAgICBcblxuICAgICAgICAgICAgdmFyIHN1bSA9IG5ldyBCaWdOdW1iZXIoMCk7XG4gICAgICAgICAgICB2YXIgc3VtdGVsb3MgPSBuZXcgQmlnTnVtYmVyKDApO1xuICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBsaXN0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG9yZGVyX3JvdyA9IGxpc3Rbal07XG4gICAgICAgICAgICAgICAgc3VtdGVsb3MgPSBzdW10ZWxvcy5wbHVzKG9yZGVyX3Jvdy50ZWxvcy5hbW91bnQpO1xuICAgICAgICAgICAgICAgIHN1bSA9IHN1bS5wbHVzKG9yZGVyX3Jvdy50b3RhbC5hbW91bnQpO1xuICAgICAgICAgICAgICAgIG9yZGVyX3Jvdy5zdW10ZWxvcyA9IG5ldyBBc3NldERFWChzdW10ZWxvcywgb3JkZXJfcm93LnRlbG9zLnRva2VuKTtcbiAgICAgICAgICAgICAgICBvcmRlcl9yb3cuc3VtID0gbmV3IEFzc2V0REVYKHN1bSwgb3JkZXJfcm93LnRvdGFsLnRva2VuKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLm9yZGVycy5idXkgPSBsaXN0O1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJCdXkgZmluYWw6XCIsIHRoaXMuc2NvcGVzW3Njb3BlXS5vcmRlcnMuYnV5KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYnV5b3JkZXJzXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0ub3JkZXJzLmJ1eTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSAmJiAhZm9yY2UpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5vcmRlcnMuYnV5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gYXV4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIGdldE9yZGVyU3VtbWFyeSgpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5nZXRPcmRlclN1bW1hcnkoKVwiKTtcbiAgICAgICAgdmFyIHRhYmxlcyA9IGF3YWl0IHRoaXMuZmV0Y2hPcmRlclN1bW1hcnkoKTtcblxuICAgICAgICBmb3IgKHZhciBpIGluIHRhYmxlcy5yb3dzKSB7XG4gICAgICAgICAgICB2YXIgc2NvcGU6c3RyaW5nID0gdGFibGVzLnJvd3NbaV0udGFibGU7XG4gICAgICAgICAgICB2YXIgY2Fub25pY2FsID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgICAgICBjb25zb2xlLmFzc2VydChzY29wZSA9PSBjYW5vbmljYWwsIFwiRVJST1I6IHNjb3BlIGlzIG5vdCBjYW5vbmljYWxcIiwgc2NvcGUsIFtpLCB0YWJsZXNdKTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSA9IHRoaXMuYXV4QXNzZXJ0U2NvcGUoY2Fub25pY2FsKTtcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaSwgdGFibGVzLnJvd3NbaV0pO1xuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uaGVhZGVyLnNlbGwudG90YWwgPSBuZXcgQXNzZXRERVgodGFibGVzLnJvd3NbaV0uc3VwcGx5LnRvdGFsLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5oZWFkZXIuc2VsbC5vcmRlcnMgPSB0YWJsZXMucm93c1tpXS5zdXBwbHkub3JkZXJzO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmhlYWRlci5idXkudG90YWwgPSBuZXcgQXNzZXRERVgodGFibGVzLnJvd3NbaV0uZGVtYW5kLnRvdGFsLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5oZWFkZXIuYnV5Lm9yZGVycyA9IHRhYmxlcy5yb3dzW2ldLmRlbWFuZC5vcmRlcnM7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uZGVhbHMgPSB0YWJsZXMucm93c1tpXS5kZWFscztcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5ibG9ja3MgPSB0YWJsZXMucm93c1tpXS5ibG9ja3M7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uZGlyZWN0ID0gdGFibGVzLnJvd3NbaV0uZGVtYW5kLmFzY3VycmVuY3k7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uaW52ZXJzZSA9IHRhYmxlcy5yb3dzW2ldLnN1cHBseS5hc2N1cnJlbmN5O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNldE9yZGVyU3VtbWFyeSgpO1xuICAgIH1cblxuICAgIGFzeW5jIGdldE1hcmtldFN1bW1hcnkodG9rZW5fYTpUb2tlbkRFWCwgdG9rZW5fYjpUb2tlbkRFWCwgZm9yY2U6Ym9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxNYXJrZXRTdW1tYXJ5PiB7XG4gICAgICAgIHZhciBzY29wZTpzdHJpbmcgPSB0aGlzLmdldFNjb3BlRm9yKHRva2VuX2EsIHRva2VuX2IpO1xuICAgICAgICB2YXIgY2Fub25pY2FsOnN0cmluZyA9IHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpO1xuICAgICAgICB2YXIgaW52ZXJzZTpzdHJpbmcgPSB0aGlzLmludmVyc2VTY29wZShjYW5vbmljYWwpO1xuXG4gICAgICAgIHZhciBjb21vZGl0eSA9IHRoaXMuYXV4R2V0Q29tb2RpdHlUb2tlbihjYW5vbmljYWwpOyBcbiAgICAgICAgdmFyIGN1cnJlbmN5ID0gdGhpcy5hdXhHZXRDdXJyZW5jeVRva2VuKGNhbm9uaWNhbCk7XG5cbiAgICAgICAgdmFyIFpFUk9fQ09NT0RJVFkgPSBcIjAuMDAwMDAwMDAgXCIgKyBjb21vZGl0eS5zeW1ib2w7XG4gICAgICAgIHZhciBaRVJPX0NVUlJFTkNZID0gXCIwLjAwMDAwMDAwIFwiICsgY3VycmVuY3kuc3ltYm9sO1xuXG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwic3VtbWFyeS5cIitjYW5vbmljYWwsIHRydWUpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInN1bW1hcnkuXCIraW52ZXJzZSwgdHJ1ZSk7XG4gICAgICAgIHZhciBhdXggPSBudWxsO1xuICAgICAgICB2YXIgcmVzdWx0Ok1hcmtldFN1bW1hcnkgPSBudWxsO1xuICAgICAgICBhdXggPSB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciBzdW1tYXJ5ID0gYXdhaXQgdGhpcy5mZXRjaFN1bW1hcnkoY2Fub25pY2FsKTtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cIm9saXZlLnRsb3NcIiljb25zb2xlLmxvZyhzY29wZSwgXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICAvLyBpZihzY29wZT09XCJvbGl2ZS50bG9zXCIpY29uc29sZS5sb2coXCJTdW1tYXJ5IGNydWRvOlwiLCBzdW1tYXJ5LnJvd3MpO1xuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gPSB0aGlzLmF1eEFzc2VydFNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeSA9IHtcbiAgICAgICAgICAgICAgICBzY29wZTogY2Fub25pY2FsLFxuICAgICAgICAgICAgICAgIHByaWNlOiBuZXcgQXNzZXRERVgobmV3IEJpZ051bWJlcigwKSwgY3VycmVuY3kpLFxuICAgICAgICAgICAgICAgIHByaWNlXzI0aF9hZ286IG5ldyBBc3NldERFWChuZXcgQmlnTnVtYmVyKDApLCBjdXJyZW5jeSksXG4gICAgICAgICAgICAgICAgaW52ZXJzZTogbmV3IEFzc2V0REVYKG5ldyBCaWdOdW1iZXIoMCksIGNvbW9kaXR5KSxcbiAgICAgICAgICAgICAgICBpbnZlcnNlXzI0aF9hZ286IG5ldyBBc3NldERFWChuZXcgQmlnTnVtYmVyKDApLCBjb21vZGl0eSksXG4gICAgICAgICAgICAgICAgdm9sdW1lOiBuZXcgQXNzZXRERVgobmV3IEJpZ051bWJlcigwKSwgY3VycmVuY3kpLFxuICAgICAgICAgICAgICAgIGFtb3VudDogbmV3IEFzc2V0REVYKG5ldyBCaWdOdW1iZXIoMCksIGNvbW9kaXR5KSxcbiAgICAgICAgICAgICAgICBwZXJjZW50OiAwLjMsXG4gICAgICAgICAgICAgICAgcmVjb3Jkczogc3VtbWFyeS5yb3dzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgbm93OkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdmFyIG5vd19zZWM6IG51bWJlciA9IE1hdGguZmxvb3Iobm93LmdldFRpbWUoKSAvIDEwMDApO1xuICAgICAgICAgICAgdmFyIG5vd19ob3VyOiBudW1iZXIgPSBNYXRoLmZsb29yKG5vd19zZWMgLyAzNjAwKTtcbiAgICAgICAgICAgIHZhciBzdGFydF9ob3VyID0gbm93X2hvdXIgLSAyMztcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJub3dfaG91cjpcIiwgbm93X2hvdXIpO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcInN0YXJ0X2hvdXI6XCIsIHN0YXJ0X2hvdXIpO1xuXG4gICAgICAgICAgICAvLyBwcm9jZXNvIGxvcyBkYXRvcyBjcnVkb3MgXG4gICAgICAgICAgICB2YXIgcHJpY2UgPSBaRVJPX0NVUlJFTkNZO1xuICAgICAgICAgICAgdmFyIGludmVyc2UgPSBaRVJPX0NPTU9ESVRZO1xuICAgICAgICAgICAgdmFyIGNydWRlID0ge307XG4gICAgICAgICAgICB2YXIgbGFzdF9oaCA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8c3VtbWFyeS5yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhoID0gc3VtbWFyeS5yb3dzW2ldLmhvdXI7XG4gICAgICAgICAgICAgICAgaWYgKHN1bW1hcnkucm93c1tpXS5sYWJlbCA9PSBcImxhc3RvbmVcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBwcmljZSA9IHN1bW1hcnkucm93c1tpXS5wcmljZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjcnVkZVtoaF0gPSBzdW1tYXJ5LnJvd3NbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0X2hoIDwgaGggJiYgaGggPCBzdGFydF9ob3VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0X2hoID0gaGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZSA9IHN1bW1hcnkucm93c1tpXS5wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2UgPSBzdW1tYXJ5LnJvd3NbaV0uaW52ZXJzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHJpY2UgPSAoc2NvcGUgPT0gY2Fub25pY2FsKSA/IHN1bW1hcnkucm93c1tpXS5wcmljZSA6IHN1bW1hcnkucm93c1tpXS5pbnZlcnNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW52ZXJzZSA9IChzY29wZSA9PSBjYW5vbmljYWwpID8gc3VtbWFyeS5yb3dzW2ldLmludmVyc2UgOiBzdW1tYXJ5LnJvd3NbaV0ucHJpY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiaGg6XCIsIGhoLCBcImxhc3RfaGg6XCIsIGxhc3RfaGgsIFwicHJpY2U6XCIsIHByaWNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcImNydWRlOlwiLCBjcnVkZSk7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwicHJpY2U6XCIsIHByaWNlKTtcblxuICAgICAgICAgICAgLy8gZ2VuZXJvIHVuYSBlbnRyYWRhIHBvciBjYWRhIHVuYSBkZSBsYXMgw4PCumx0aW1hcyAyNCBob3Jhc1xuICAgICAgICAgICAgdmFyIGxhc3RfMjRoID0ge307XG4gICAgICAgICAgICB2YXIgdm9sdW1lID0gbmV3IEFzc2V0REVYKFpFUk9fQ1VSUkVOQ1ksIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGFtb3VudCA9IG5ldyBBc3NldERFWChaRVJPX0NPTU9ESVRZLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBwcmljZV9hc3NldCA9IG5ldyBBc3NldERFWChwcmljZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgaW52ZXJzZV9hc3NldCA9IG5ldyBBc3NldERFWChpbnZlcnNlLCB0aGlzKTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJjbnQudGxvc1wiKWNvbnNvbGUubG9nKFwicHJpY2UgXCIsIHByaWNlKTtcbiAgICAgICAgICAgIHZhciBtYXhfcHJpY2UgPSBwcmljZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgdmFyIG1pbl9wcmljZSA9IHByaWNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICB2YXIgbWF4X2ludmVyc2UgPSBpbnZlcnNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICB2YXIgbWluX2ludmVyc2UgPSBpbnZlcnNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICB2YXIgcHJpY2VfZnN0OkFzc2V0REVYID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBpbnZlcnNlX2ZzdDpBc3NldERFWCA9IG51bGw7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8MjQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gc3RhcnRfaG91citpO1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50X2RhdGUgPSBuZXcgRGF0ZShjdXJyZW50ICogMzYwMCAqIDEwMDApO1xuICAgICAgICAgICAgICAgIHZhciBudWV2bzphbnkgPSBjcnVkZVtjdXJyZW50XTtcbiAgICAgICAgICAgICAgICBpZiAobnVldm8pIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbnVldm8gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogdGhpcy5hdXhHZXRMYWJlbEZvckhvdXIoY3VycmVudCAlIDI0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2U6IGludmVyc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWU6IFpFUk9fQ1VSUkVOQ1ksXG4gICAgICAgICAgICAgICAgICAgICAgICBhbW91bnQ6IFpFUk9fQ09NT0RJVFksXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBjdXJyZW50X2RhdGUudG9JU09TdHJpbmcoKS5zcGxpdChcIi5cIilbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBob3VyOiBjdXJyZW50XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhc3RfMjRoW2N1cnJlbnRdID0gY3J1ZGVbY3VycmVudF0gfHwgbnVldm87XG4gICAgICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcImN1cnJlbnRfZGF0ZTpcIiwgY3VycmVudF9kYXRlLnRvSVNPU3RyaW5nKCksIGN1cnJlbnQsIGxhc3RfMjRoW2N1cnJlbnRdKTtcblxuICAgICAgICAgICAgICAgIC8vIGNvbmluaWNhbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgcHJpY2UgPSBsYXN0XzI0aFtjdXJyZW50XS5wcmljZTtcbiAgICAgICAgICAgICAgICB2YXIgdm9sID0gbmV3IEFzc2V0REVYKGxhc3RfMjRoW2N1cnJlbnRdLnZvbHVtZSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQodm9sLnRva2VuLnN5bWJvbCA9PSB2b2x1bWUudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiBkaWZmZXJlbnQgdG9rZW5zXCIsIHZvbC5zdHIsIHZvbHVtZS5zdHIpO1xuICAgICAgICAgICAgICAgIHZvbHVtZS5hbW91bnQgPSB2b2x1bWUuYW1vdW50LnBsdXModm9sLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgaWYgKHByaWNlICE9IFpFUk9fQ1VSUkVOQ1kgJiYgIXByaWNlX2ZzdCkge1xuICAgICAgICAgICAgICAgICAgICBwcmljZV9mc3QgPSBuZXcgQXNzZXRERVgocHJpY2UsIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcmljZV9hc3NldCA9IG5ldyBBc3NldERFWChwcmljZSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQocHJpY2VfYXNzZXQudG9rZW4uc3ltYm9sID09IG1heF9wcmljZS50b2tlbi5zeW1ib2wsIFwiRVJST1I6IGRpZmZlcmVudCB0b2tlbnNcIiwgcHJpY2VfYXNzZXQuc3RyLCBtYXhfcHJpY2Uuc3RyKTtcbiAgICAgICAgICAgICAgICBpZiAocHJpY2VfYXNzZXQuYW1vdW50LmlzR3JlYXRlclRoYW4obWF4X3ByaWNlLmFtb3VudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4X3ByaWNlID0gcHJpY2VfYXNzZXQuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQocHJpY2VfYXNzZXQudG9rZW4uc3ltYm9sID09IG1pbl9wcmljZS50b2tlbi5zeW1ib2wsIFwiRVJST1I6IGRpZmZlcmVudCB0b2tlbnNcIiwgcHJpY2VfYXNzZXQuc3RyLCBtaW5fcHJpY2Uuc3RyKTtcbiAgICAgICAgICAgICAgICBpZiAobWluX3ByaWNlLmFtb3VudC5pc0VxdWFsVG8oMCkgfHwgcHJpY2VfYXNzZXQuYW1vdW50LmlzTGVzc1RoYW4obWluX3ByaWNlLmFtb3VudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWluX3ByaWNlID0gcHJpY2VfYXNzZXQuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyByZXZlcnNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICBpbnZlcnNlID0gbGFzdF8yNGhbY3VycmVudF0uaW52ZXJzZTtcbiAgICAgICAgICAgICAgICB2YXIgYW1vID0gbmV3IEFzc2V0REVYKGxhc3RfMjRoW2N1cnJlbnRdLmFtb3VudCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoYW1vLnRva2VuLnN5bWJvbCA9PSBhbW91bnQudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiBkaWZmZXJlbnQgdG9rZW5zXCIsIGFtby5zdHIsIGFtb3VudC5zdHIpO1xuICAgICAgICAgICAgICAgIGFtb3VudC5hbW91bnQgPSBhbW91bnQuYW1vdW50LnBsdXMoYW1vLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgaWYgKGludmVyc2UgIT0gWkVST19DT01PRElUWSAmJiAhaW52ZXJzZV9mc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJzZV9mc3QgPSBuZXcgQXNzZXRERVgoaW52ZXJzZSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGludmVyc2VfYXNzZXQgPSBuZXcgQXNzZXRERVgoaW52ZXJzZSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoaW52ZXJzZV9hc3NldC50b2tlbi5zeW1ib2wgPT0gbWF4X2ludmVyc2UudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiBkaWZmZXJlbnQgdG9rZW5zXCIsIGludmVyc2VfYXNzZXQuc3RyLCBtYXhfaW52ZXJzZS5zdHIpO1xuICAgICAgICAgICAgICAgIGlmIChpbnZlcnNlX2Fzc2V0LmFtb3VudC5pc0dyZWF0ZXJUaGFuKG1heF9pbnZlcnNlLmFtb3VudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4X2ludmVyc2UgPSBpbnZlcnNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGludmVyc2VfYXNzZXQudG9rZW4uc3ltYm9sID09IG1pbl9pbnZlcnNlLnRva2VuLnN5bWJvbCwgXCJFUlJPUjogZGlmZmVyZW50IHRva2Vuc1wiLCBpbnZlcnNlX2Fzc2V0LnN0ciwgbWluX2ludmVyc2Uuc3RyKTtcbiAgICAgICAgICAgICAgICBpZiAobWluX2ludmVyc2UuYW1vdW50LmlzRXF1YWxUbygwKSB8fCBpbnZlcnNlX2Fzc2V0LmFtb3VudC5pc0xlc3NUaGFuKG1pbl9pbnZlcnNlLmFtb3VudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWluX2ludmVyc2UgPSBpbnZlcnNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gY29uaW5pY2FsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIGlmICghcHJpY2VfZnN0KSB7XG4gICAgICAgICAgICAgICAgcHJpY2VfZnN0ID0gbmV3IEFzc2V0REVYKGxhc3RfMjRoW3N0YXJ0X2hvdXJdLnByaWNlLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsYXN0X3ByaWNlID0gIG5ldyBBc3NldERFWChsYXN0XzI0aFtub3dfaG91cl0ucHJpY2UsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGRpZmYgPSBsYXN0X3ByaWNlLmNsb25lKCk7XG4gICAgICAgICAgICAvLyBkaWZmLmFtb3VudCBcbiAgICAgICAgICAgIGRpZmYuYW1vdW50ID0gbGFzdF9wcmljZS5hbW91bnQubWludXMocHJpY2VfZnN0LmFtb3VudCk7XG4gICAgICAgICAgICB2YXIgcmF0aW86bnVtYmVyID0gMDtcbiAgICAgICAgICAgIGlmIChwcmljZV9mc3QuYW1vdW50LnRvTnVtYmVyKCkgIT0gMCkge1xuICAgICAgICAgICAgICAgIHJhdGlvID0gZGlmZi5hbW91bnQuZGl2aWRlZEJ5KHByaWNlX2ZzdC5hbW91bnQpLnRvTnVtYmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcGVyY2VudCA9IE1hdGguZmxvb3IocmF0aW8gKiAxMDAwMCkgLyAxMDA7XG5cbiAgICAgICAgICAgIC8vIHJldmVyc2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgaWYgKCFpbnZlcnNlX2ZzdCkge1xuICAgICAgICAgICAgICAgIGludmVyc2VfZnN0ID0gbmV3IEFzc2V0REVYKGxhc3RfMjRoW3N0YXJ0X2hvdXJdLmludmVyc2UsIHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGxhc3RfaW52ZXJzZSA9ICBuZXcgQXNzZXRERVgobGFzdF8yNGhbbm93X2hvdXJdLmludmVyc2UsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGlkaWZmID0gbGFzdF9pbnZlcnNlLmNsb25lKCk7XG4gICAgICAgICAgICAvLyBkaWZmLmFtb3VudCBcbiAgICAgICAgICAgIGlkaWZmLmFtb3VudCA9IGxhc3RfaW52ZXJzZS5hbW91bnQubWludXMoaW52ZXJzZV9mc3QuYW1vdW50KTtcbiAgICAgICAgICAgIHJhdGlvID0gMDtcbiAgICAgICAgICAgIGlmIChpbnZlcnNlX2ZzdC5hbW91bnQudG9OdW1iZXIoKSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgcmF0aW8gPSBkaWZmLmFtb3VudC5kaXZpZGVkQnkoaW52ZXJzZV9mc3QuYW1vdW50KS50b051bWJlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGlwZXJjZW50ID0gTWF0aC5mbG9vcihyYXRpbyAqIDEwMDAwKSAvIDEwMDtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJwcmljZV9mc3Q6XCIsIHByaWNlX2ZzdC5zdHIpO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcImludmVyc2VfZnN0OlwiLCBpbnZlcnNlX2ZzdC5zdHIpO1xuXG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwibGFzdF8yNGg6XCIsIFtsYXN0XzI0aF0pO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcImRpZmY6XCIsIGRpZmYudG9TdHJpbmcoOCkpO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcInBlcmNlbnQ6XCIsIHBlcmNlbnQpO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcInJhdGlvOlwiLCByYXRpbyk7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwidm9sdW1lOlwiLCB2b2x1bWUuc3RyKTtcblxuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkucHJpY2UgPSBsYXN0X3ByaWNlO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkuaW52ZXJzZSA9IGxhc3RfaW52ZXJzZTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LnByaWNlXzI0aF9hZ28gPSBwcmljZV9mc3QgfHwgbGFzdF9wcmljZTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LmludmVyc2VfMjRoX2FnbyA9IGludmVyc2VfZnN0O1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkucGVyY2VudF9zdHIgPSAoaXNOYU4ocGVyY2VudCkgPyAwIDogcGVyY2VudCkgKyBcIiVcIjtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LnBlcmNlbnQgPSBpc05hTihwZXJjZW50KSA/IDAgOiBwZXJjZW50O1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkuaXBlcmNlbnRfc3RyID0gKGlzTmFOKGlwZXJjZW50KSA/IDAgOiBpcGVyY2VudCkgKyBcIiVcIjtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LmlwZXJjZW50ID0gaXNOYU4oaXBlcmNlbnQpID8gMCA6IGlwZXJjZW50O1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkudm9sdW1lID0gdm9sdW1lO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkuYW1vdW50ID0gYW1vdW50O1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkubWluX3ByaWNlID0gbWluX3ByaWNlO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkubWF4X3ByaWNlID0gbWF4X3ByaWNlO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkubWluX2ludmVyc2UgPSBtaW5faW52ZXJzZTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5Lm1heF9pbnZlcnNlID0gbWF4X2ludmVyc2U7XG5cbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJTdW1tYXJ5IGZpbmFsOlwiLCB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeSk7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJzdW1tYXJ5LlwiK2Nhbm9uaWNhbCwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJzdW1tYXJ5LlwiK2ludmVyc2UsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSAmJiAhZm9yY2UpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgYXV4O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXNvcnRUb3BNYXJrZXRzKCk7XG4gICAgICAgIHRoaXMuc2V0TWFya2V0U3VtbWFyeSgpO1xuICAgICAgICB0aGlzLm9uTWFya2V0U3VtbWFyeS5uZXh0KHJlc3VsdCk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRBbGxUYWJsZXNTdW1hcmllcygpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0T3JkZXJTdW1tYXJ5LnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZXMgPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLl9tYXJrZXRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkuaW5kZXhPZihcIi5cIikgPT0gLTEpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIHZhciBwID0gdGhpcy5nZXRNYXJrZXRTdW1tYXJ5KHRoaXMuX21hcmtldHNbaV0uY29tb2RpdHksIHRoaXMuX21hcmtldHNbaV0uY3VycmVuY3ksIHRydWUpO1xuICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2gocCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihfID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRva2Vuc1N1bW1hcnkoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgIH1cbiAgICBcblxuICAgIC8vXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBdXggZnVuY3Rpb25zXG4gICAgcHJpdmF0ZSBhdXhQcm9jZXNzUm93c1RvT3JkZXJzKHJvd3M6YW55W10pOiBPcmRlcltdIHtcbiAgICAgICAgdmFyIHJlc3VsdDogT3JkZXJbXSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGkgPCByb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcHJpY2UgPSBuZXcgQXNzZXRERVgocm93c1tpXS5wcmljZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgaW52ZXJzZSA9IG5ldyBBc3NldERFWChyb3dzW2ldLmludmVyc2UsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNlbGxpbmcgPSBuZXcgQXNzZXRERVgocm93c1tpXS5zZWxsaW5nLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IG5ldyBBc3NldERFWChyb3dzW2ldLnRvdGFsLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBvcmRlcjpPcmRlcjtcblxuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcy5nZXRTY29wZUZvcihwcmljZS50b2tlbiwgaW52ZXJzZS50b2tlbik7XG4gICAgICAgICAgICB2YXIgY2Fub25pY2FsID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgICAgICB2YXIgcmV2ZXJzZV9zY29wZSA9IHRoaXMuaW52ZXJzZVNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgaWYgKHJldmVyc2Vfc2NvcGUgPT0gc2NvcGUpIHtcbiAgICAgICAgICAgICAgICBvcmRlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHJvd3NbaV0uaWQsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlOiBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogaW52ZXJzZSxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHNlbGxpbmcsXG4gICAgICAgICAgICAgICAgICAgIGRlcG9zaXQ6IHNlbGxpbmcsXG4gICAgICAgICAgICAgICAgICAgIHRlbG9zOiB0b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IHJvd3NbaV0ub3duZXJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9yZGVyID0ge1xuICAgICAgICAgICAgICAgICAgICBpZDogcm93c1tpXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGludmVyc2UsXG4gICAgICAgICAgICAgICAgICAgIGludmVyc2U6IHByaWNlLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwsXG4gICAgICAgICAgICAgICAgICAgIGRlcG9zaXQ6IHNlbGxpbmcsXG4gICAgICAgICAgICAgICAgICAgIHRlbG9zOiBzZWxsaW5nLFxuICAgICAgICAgICAgICAgICAgICBvd25lcjogcm93c1tpXS5vd25lclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG9yZGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXV4R2V0TGFiZWxGb3JIb3VyKGhoOm51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIHZhciBob3VycyA9IFtcbiAgICAgICAgICAgIFwiaC56ZXJvXCIsXG4gICAgICAgICAgICBcImgub25lXCIsXG4gICAgICAgICAgICBcImgudHdvXCIsXG4gICAgICAgICAgICBcImgudGhyZWVcIixcbiAgICAgICAgICAgIFwiaC5mb3VyXCIsXG4gICAgICAgICAgICBcImguZml2ZVwiLFxuICAgICAgICAgICAgXCJoLnNpeFwiLFxuICAgICAgICAgICAgXCJoLnNldmVuXCIsXG4gICAgICAgICAgICBcImguZWlnaHRcIixcbiAgICAgICAgICAgIFwiaC5uaW5lXCIsXG4gICAgICAgICAgICBcImgudGVuXCIsXG4gICAgICAgICAgICBcImguZWxldmVuXCIsXG4gICAgICAgICAgICBcImgudHdlbHZlXCIsXG4gICAgICAgICAgICBcImgudGhpcnRlZW5cIixcbiAgICAgICAgICAgIFwiaC5mb3VydGVlblwiLFxuICAgICAgICAgICAgXCJoLmZpZnRlZW5cIixcbiAgICAgICAgICAgIFwiaC5zaXh0ZWVuXCIsXG4gICAgICAgICAgICBcImguc2V2ZW50ZWVuXCIsXG4gICAgICAgICAgICBcImguZWlnaHRlZW5cIixcbiAgICAgICAgICAgIFwiaC5uaW5ldGVlblwiLFxuICAgICAgICAgICAgXCJoLnR3ZW50eVwiLFxuICAgICAgICAgICAgXCJoLnR3ZW50eW9uZVwiLFxuICAgICAgICAgICAgXCJoLnR3ZW50eXR3b1wiLFxuICAgICAgICAgICAgXCJoLnR3ZW50eXRocmVlXCJcbiAgICAgICAgXVxuICAgICAgICByZXR1cm4gaG91cnNbaGhdO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXV4R2V0Q3VycmVuY3lUb2tlbihzY29wZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KCEhc2NvcGUsIFwiRVJST1I6IGludmFsaWQgc2NvcGU6ICdcIisgc2NvcGUgK1wiJ1wiKTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoc2NvcGUuc3BsaXQoXCIuXCIpLmxlbmd0aCA9PSAyLCBcIkVSUk9SOiBpbnZhbGlkIHNjb3BlOiAnXCIrIHNjb3BlICtcIidcIik7XG4gICAgICAgIHZhciBjdXJyZW5jeV9zeW0gPSBzY29wZS5zcGxpdChcIi5cIilbMV0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgdmFyIGN1cnJlbmN5ID0gdGhpcy5nZXRUb2tlbk5vdyhjdXJyZW5jeV9zeW0pO1xuICAgICAgICByZXR1cm4gY3VycmVuY3k7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhdXhHZXRDb21vZGl0eVRva2VuKHNjb3BlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoISFzY29wZSwgXCJFUlJPUjogaW52YWxpZCBzY29wZTogJ1wiKyBzY29wZSArXCInXCIpO1xuICAgICAgICBjb25zb2xlLmFzc2VydChzY29wZS5zcGxpdChcIi5cIikubGVuZ3RoID09IDIsIFwiRVJST1I6IGludmFsaWQgc2NvcGU6ICdcIisgc2NvcGUgK1wiJ1wiKTtcbiAgICAgICAgdmFyIGNvbW9kaXR5X3N5bSA9IHNjb3BlLnNwbGl0KFwiLlwiKVswXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICB2YXIgY29tb2RpdHkgPSB0aGlzLmdldFRva2VuTm93KGNvbW9kaXR5X3N5bSk7XG4gICAgICAgIHJldHVybiBjb21vZGl0eTsgICAgICAgIFxuICAgIH1cblxuICAgIHByaXZhdGUgYXV4QXNzZXJ0U2NvcGUoc2NvcGU6c3RyaW5nKTogTWFya2V0IHtcbiAgICAgICAgdmFyIGNvbW9kaXR5ID0gdGhpcy5hdXhHZXRDb21vZGl0eVRva2VuKHNjb3BlKTtcbiAgICAgICAgdmFyIGN1cnJlbmN5ID0gdGhpcy5hdXhHZXRDdXJyZW5jeVRva2VuKHNjb3BlKTtcbiAgICAgICAgdmFyIGF1eF9hc3NldF9jb20gPSBuZXcgQXNzZXRERVgoMCwgY29tb2RpdHkpO1xuICAgICAgICB2YXIgYXV4X2Fzc2V0X2N1ciA9IG5ldyBBc3NldERFWCgwLCBjdXJyZW5jeSk7XG5cbiAgICAgICAgdmFyIG1hcmtldF9zdW1tYXJ5Ok1hcmtldFN1bW1hcnkgPSB7XG4gICAgICAgICAgICBzY29wZTogc2NvcGUsXG4gICAgICAgICAgICBwcmljZTogYXV4X2Fzc2V0X2N1cixcbiAgICAgICAgICAgIHByaWNlXzI0aF9hZ286IGF1eF9hc3NldF9jdXIsXG4gICAgICAgICAgICBpbnZlcnNlOiBhdXhfYXNzZXRfY29tLFxuICAgICAgICAgICAgaW52ZXJzZV8yNGhfYWdvOiBhdXhfYXNzZXRfY29tLFxuICAgICAgICAgICAgbWF4X2ludmVyc2U6IGF1eF9hc3NldF9jb20sXG4gICAgICAgICAgICBtYXhfcHJpY2U6IGF1eF9hc3NldF9jdXIsXG4gICAgICAgICAgICBtaW5faW52ZXJzZTogYXV4X2Fzc2V0X2NvbSxcbiAgICAgICAgICAgIG1pbl9wcmljZTogYXV4X2Fzc2V0X2N1cixcbiAgICAgICAgICAgIHJlY29yZHM6IFtdLFxuICAgICAgICAgICAgdm9sdW1lOiBhdXhfYXNzZXRfY3VyLFxuICAgICAgICAgICAgYW1vdW50OiBhdXhfYXNzZXRfY29tLFxuICAgICAgICAgICAgcGVyY2VudDogMCxcbiAgICAgICAgICAgIGlwZXJjZW50OiAwLFxuICAgICAgICAgICAgcGVyY2VudF9zdHI6IFwiMCVcIixcbiAgICAgICAgICAgIGlwZXJjZW50X3N0cjogXCIwJVwiLFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcmtldHNbc2NvcGVdIHx8IHtcbiAgICAgICAgICAgIHNjb3BlOiBzY29wZSxcbiAgICAgICAgICAgIGNvbW9kaXR5OiBjb21vZGl0eSxcbiAgICAgICAgICAgIGN1cnJlbmN5OiBjdXJyZW5jeSxcbiAgICAgICAgICAgIG9yZGVyczogeyBzZWxsOiBbXSwgYnV5OiBbXSB9LFxuICAgICAgICAgICAgZGVhbHM6IDAsXG4gICAgICAgICAgICBkaXJlY3Q6IDAsXG4gICAgICAgICAgICBpbnZlcnNlOiAwLFxuICAgICAgICAgICAgaGlzdG9yeTogW10sXG4gICAgICAgICAgICB0eDoge30sXG4gICAgICAgICAgICBibG9ja3M6IDAsXG4gICAgICAgICAgICBibG9jazoge30sXG4gICAgICAgICAgICBibG9ja2xpc3Q6IFtdLFxuICAgICAgICAgICAgYmxvY2tsZXZlbHM6IFtbXV0sXG4gICAgICAgICAgICByZXZlcnNlYmxvY2tzOiBbXSxcbiAgICAgICAgICAgIHJldmVyc2VsZXZlbHM6IFtbXV0sXG4gICAgICAgICAgICBzdW1tYXJ5OiBtYXJrZXRfc3VtbWFyeSxcbiAgICAgICAgICAgIGhlYWRlcjogeyBcbiAgICAgICAgICAgICAgICBzZWxsOiB7dG90YWw6YXV4X2Fzc2V0X2NvbSwgb3JkZXJzOjB9LCBcbiAgICAgICAgICAgICAgICBidXk6IHt0b3RhbDphdXhfYXNzZXRfY3VyLCBvcmRlcnM6MH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07ICAgICAgICBcbiAgICB9XG5cbiAgICBwcml2YXRlIGZldGNoRGVwb3NpdHMoYWNjb3VudCk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJkZXBvc2l0c1wiLCB7c2NvcGU6YWNjb3VudH0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZmV0Y2hCYWxhbmNlcyhhY2NvdW50KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIGNvbnRyYWN0cyA9IHt9O1xuICAgICAgICAgICAgdmFyIGJhbGFuY2VzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMudG9rZW5zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudG9rZW5zW2ldLm9mZmNoYWluKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjb250cmFjdHNbdGhpcy50b2tlbnNbaV0uY29udHJhY3RdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGNvbnRyYWN0IGluIGNvbnRyYWN0cykge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYmFsYW5jZXMtXCIrY29udHJhY3QsIHRydWUpO1xuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yICh2YXIgY29udHJhY3QgaW4gY29udHJhY3RzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGF3YWl0IHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJhY2NvdW50c1wiLCB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0OmNvbnRyYWN0LFxuICAgICAgICAgICAgICAgICAgICBzY29wZTogYWNjb3VudCB8fCB0aGlzLmN1cnJlbnQubmFtZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gcmVzdWx0LnJvd3MpIHtcbiAgICAgICAgICAgICAgICAgICAgYmFsYW5jZXMucHVzaChuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uYmFsYW5jZSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJhbGFuY2VzLVwiK2NvbnRyYWN0LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYmFsYW5jZXM7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hPcmRlcnMocGFyYW1zOlRhYmxlUGFyYW1zKTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcInNlbGxvcmRlcnNcIiwgcGFyYW1zKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZldGNoT3JkZXJTdW1tYXJ5KCk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJvcmRlcnN1bW1hcnlcIikudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaEJsb2NrSGlzdG9yeShzY29wZTpzdHJpbmcsIHBhZ2U6bnVtYmVyID0gMCwgcGFnZXNpemU6bnVtYmVyID0gMjUpOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHZhciBjYW5vbmljYWw6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgIHZhciBwYWdlcyA9IHRoaXMuZ2V0QmxvY2tIaXN0b3J5VG90YWxQYWdlc0ZvcihjYW5vbmljYWwsIHBhZ2VzaXplKTtcbiAgICAgICAgdmFyIGlkID0gcGFnZSpwYWdlc2l6ZTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWVERVguZmV0Y2hCbG9ja0hpc3RvcnkoXCIsIHNjb3BlLCBcIixcIixwYWdlLFwiLFwiLHBhZ2VzaXplLFwiKTogaWQ6XCIsIGlkLCBcInBhZ2VzOlwiLCBwYWdlcyk7XG4gICAgICAgIGlmIChwYWdlIDwgcGFnZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXJrZXRzICYmIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSAmJiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uYmxvY2tbXCJpZC1cIiArIGlkXSkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQ6VGFibGVSZXN1bHQgPSB7bW9yZTpmYWxzZSxyb3dzOltdfTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8cGFnZXNpemU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWRfaSA9IGlkK2k7XG4gICAgICAgICAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5ibG9ja1tcImlkLVwiICsgaWRfaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnJvd3MucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnJvd3MubGVuZ3RoID09IHBhZ2VzaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGhhdmUgdGhlIGNvbXBsZXRlIHBhZ2UgaW4gbWVtb3J5XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmZldGNoSGlzdG9yeShcIiwgc2NvcGUsIFwiLFwiLHBhZ2UsXCIsXCIscGFnZXNpemUsXCIpOiByZXN1bHQ6XCIsIHJlc3VsdC5yb3dzLm1hcCgoeyBpZCB9KSA9PiBpZCkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwiYmxvY2toaXN0b3J5XCIsIHtzY29wZTpjYW5vbmljYWwsIGxpbWl0OnBhZ2VzaXplLCBsb3dlcl9ib3VuZDpcIlwiKyhwYWdlKnBhZ2VzaXplKX0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImJsb2NrIEhpc3RvcnkgY3J1ZG86XCIsIHJlc3VsdCk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gPSB0aGlzLmF1eEFzc2VydFNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uYmxvY2sgPSB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uYmxvY2sgfHwge307IFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLl9tYXJrZXRzW3Njb3BlXS5ibG9jazpcIiwgdGhpcy5fbWFya2V0c1tzY29wZV0uYmxvY2spO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgcmVzdWx0LnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYmxvY2s6SGlzdG9yeUJsb2NrID0ge1xuICAgICAgICAgICAgICAgICAgICBpZDogcmVzdWx0LnJvd3NbaV0uaWQsXG4gICAgICAgICAgICAgICAgICAgIGhvdXI6IHJlc3VsdC5yb3dzW2ldLmhvdXIsXG4gICAgICAgICAgICAgICAgICAgIHN0cjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5wcmljZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGludmVyc2U6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5pbnZlcnNlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgZW50cmFuY2U6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5lbnRyYW5jZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIG1heDogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLm1heCwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIG1pbjogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLm1pbiwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHZvbHVtZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLnZvbHVtZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudDogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmFtb3VudCwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKHJlc3VsdC5yb3dzW2ldLmRhdGUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJsb2NrLnN0ciA9IEpTT04uc3RyaW5naWZ5KFtibG9jay5tYXguc3RyLCBibG9jay5lbnRyYW5jZS5zdHIsIGJsb2NrLnByaWNlLnN0ciwgYmxvY2subWluLnN0cl0pO1xuICAgICAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5ibG9ja1tcImlkLVwiICsgYmxvY2suaWRdID0gYmxvY2s7XG4gICAgICAgICAgICB9ICAgXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImJsb2NrIEhpc3RvcnkgZmluYWw6XCIsIHRoaXMuX21hcmtldHNbc2NvcGVdLmJsb2NrKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH0gICAgXG5cbiAgICBwcml2YXRlIGZldGNoSGlzdG9yeShzY29wZTpzdHJpbmcsIHBhZ2U6bnVtYmVyID0gMCwgcGFnZXNpemU6bnVtYmVyID0gMjUpOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHZhciBjYW5vbmljYWw6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgIHZhciBwYWdlcyA9IHRoaXMuZ2V0SGlzdG9yeVRvdGFsUGFnZXNGb3IoY2Fub25pY2FsLCBwYWdlc2l6ZSk7XG4gICAgICAgIHZhciBpZCA9IHBhZ2UqcGFnZXNpemU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmZldGNoSGlzdG9yeShcIiwgc2NvcGUsIFwiLFwiLHBhZ2UsXCIsXCIscGFnZXNpemUsXCIpOiBpZDpcIiwgaWQsIFwicGFnZXM6XCIsIHBhZ2VzKTtcbiAgICAgICAgaWYgKHBhZ2UgPCBwYWdlcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX21hcmtldHMgJiYgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdICYmIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eFtcImlkLVwiICsgaWRdKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdDpUYWJsZVJlc3VsdCA9IHttb3JlOmZhbHNlLHJvd3M6W119O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxwYWdlc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpZF9pID0gaWQraTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRyeCA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eFtcImlkLVwiICsgaWRfaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0cngpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5yb3dzLnB1c2godHJ4KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucm93cy5sZW5ndGggPT0gcGFnZXNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgaGF2ZSB0aGUgY29tcGxldGUgcGFnZSBpbiBtZW1vcnlcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWVERVguZmV0Y2hIaXN0b3J5KFwiLCBzY29wZSwgXCIsXCIscGFnZSxcIixcIixwYWdlc2l6ZSxcIik6IHJlc3VsdDpcIiwgcmVzdWx0LnJvd3MubWFwKCh7IGlkIH0pID0+IGlkKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJoaXN0b3J5XCIsIHtzY29wZTpzY29wZSwgbGltaXQ6cGFnZXNpemUsIGxvd2VyX2JvdW5kOlwiXCIrKHBhZ2UqcGFnZXNpemUpfSkudGhlbihyZXN1bHQgPT4ge1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJIaXN0b3J5IGNydWRvOlwiLCByZXN1bHQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gPSB0aGlzLmF1eEFzc2VydFNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uaGlzdG9yeSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnR4ID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnR4IHx8IHt9OyBcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLnNjb3Blc1tzY29wZV0udHg6XCIsIHRoaXMuc2NvcGVzW3Njb3BlXS50eCk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaSA8IHJlc3VsdC5yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zYWN0aW9uOkhpc3RvcnlUeCA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHJlc3VsdC5yb3dzW2ldLmlkLFxuICAgICAgICAgICAgICAgICAgICBzdHI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudDogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmFtb3VudCwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHBheW1lbnQ6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5wYXltZW50LCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgYnV5ZmVlOiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uYnV5ZmVlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgc2VsbGZlZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLnNlbGxmZWUsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBwcmljZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLnByaWNlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmludmVyc2UsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBidXllcjogcmVzdWx0LnJvd3NbaV0uYnV5ZXIsXG4gICAgICAgICAgICAgICAgICAgIHNlbGxlcjogcmVzdWx0LnJvd3NbaV0uc2VsbGVyLFxuICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShyZXN1bHQucm93c1tpXS5kYXRlKSxcbiAgICAgICAgICAgICAgICAgICAgaXNidXk6ICEhcmVzdWx0LnJvd3NbaV0uaXNidXlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb24uc3RyID0gdHJhbnNhY3Rpb24ucHJpY2Uuc3RyICsgXCIgXCIgKyB0cmFuc2FjdGlvbi5hbW91bnQuc3RyO1xuICAgICAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eFtcImlkLVwiICsgdHJhbnNhY3Rpb24uaWRdID0gdHJhbnNhY3Rpb247XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogaW4gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnR4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmhpc3RvcnkucHVzaCh0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0udHhbal0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uaGlzdG9yeS5zb3J0KGZ1bmN0aW9uKGE6SGlzdG9yeVR4LCBiOkhpc3RvcnlUeCl7XG4gICAgICAgICAgICAgICAgaWYoYS5kYXRlIDwgYi5kYXRlKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBpZihhLmRhdGUgPiBiLmRhdGUpIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICBpZihhLmlkIDwgYi5pZCkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgaWYoYS5pZCA+IGIuaWQpIHJldHVybiAtMTtcbiAgICAgICAgICAgIH0pOyAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkhpc3RvcnkgZmluYWw6XCIsIHRoaXMuc2NvcGVzW3Njb3BlXS5oaXN0b3J5KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGFzeW5jIGZldGNoQWN0aXZpdHkocGFnZTpudW1iZXIgPSAwLCBwYWdlc2l6ZTpudW1iZXIgPSAyNSkge1xuICAgICAgICB2YXIgaWQgPSBwYWdlKnBhZ2VzaXplKzE7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmZldGNoQWN0aXZpdHkoXCIsIHBhZ2UsXCIsXCIscGFnZXNpemUsXCIpOiBpZDpcIiwgaWQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZpdHkuZXZlbnRzW1wiaWQtXCIgKyBpZF0pIHtcbiAgICAgICAgICAgIHZhciBwYWdlRXZlbnRzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8cGFnZXNpemU7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpZF9pID0gaWQraTtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnQgPSB0aGlzLmFjdGl2aXR5LmV2ZW50c1tcImlkLVwiICsgaWRfaV07XG4gICAgICAgICAgICAgICAgaWYgKCFldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFnZUV2ZW50cy5sZW5ndGggPT0gcGFnZXNpemUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxuICAgICAgICB9ICAgICAgICBcblxuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcImV2ZW50c1wiLCB7bGltaXQ6cGFnZXNpemUsIGxvd2VyX2JvdW5kOlwiXCIraWR9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJBY3Rpdml0eSBjcnVkbzpcIiwgcmVzdWx0KTtcbiAgICAgICAgICAgIHZhciBsaXN0OkV2ZW50TG9nW10gPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgcmVzdWx0LnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSByZXN1bHQucm93c1tpXS5pZDtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnQ6RXZlbnRMb2cgPSA8RXZlbnRMb2c+cmVzdWx0LnJvd3NbaV07XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmFjdGl2aXR5LmV2ZW50c1tcImlkLVwiICsgaWRdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZpdHkuZXZlbnRzW1wiaWQtXCIgKyBpZF0gPSBldmVudDtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKj4+Pj4+XCIsIGlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdHkubGlzdCA9IFtdLmNvbmNhdCh0aGlzLmFjdGl2aXR5Lmxpc3QpLmNvbmNhdChsaXN0KTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdHkubGlzdC5zb3J0KGZ1bmN0aW9uKGE6RXZlbnRMb2csIGI6RXZlbnRMb2cpe1xuICAgICAgICAgICAgICAgIGlmKGEuZGF0ZSA8IGIuZGF0ZSkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgaWYoYS5kYXRlID4gYi5kYXRlKSByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgaWYoYS5pZCA8IGIuaWQpIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmKGEuaWQgPiBiLmlkKSByZXR1cm4gLTE7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hVc2VyT3JkZXJzKHVzZXI6c3RyaW5nKTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcInVzZXJvcmRlcnNcIiwge3Njb3BlOnVzZXIsIGxpbWl0OjIwMH0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGZldGNoU3VtbWFyeShzY29wZSk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJ0YWJsZXN1bW1hcnlcIiwge3Njb3BlOnNjb3BlfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaFRva2VuU3RhdHModG9rZW4pOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidG9rZW4tc3RhdC1cIit0b2tlbi5zeW1ib2wsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcInN0YXRcIiwge2NvbnRyYWN0OnRva2VuLmNvbnRyYWN0LCBzY29wZTp0b2tlbi5zeW1ib2x9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB0b2tlbi5zdGF0ID0gcmVzdWx0LnJvd3NbMF07XG4gICAgICAgICAgICBpZiAodG9rZW4uc3RhdC5pc3N1ZXJzICYmIHRva2VuLnN0YXQuaXNzdWVyc1swXSA9PSBcImV2ZXJ5b25lXCIpIHtcbiAgICAgICAgICAgICAgICB0b2tlbi5mYWtlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidG9rZW4tc3RhdC1cIit0b2tlbi5zeW1ib2wsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaFRva2Vuc1N0YXRzKGV4dGVuZGVkOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZS5mZXRjaFRva2VucygpXCIpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInRva2VuLXN0YXRzXCIsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oXyA9PiB7XG5cbiAgICAgICAgICAgIHZhciBwcmlvbWlzZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy50b2tlbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50b2tlbnNbaV0ub2ZmY2hhaW4pIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIHByaW9taXNlcy5wdXNoKHRoaXMuZmV0Y2hUb2tlblN0YXRzKHRoaXMudG9rZW5zW2ldKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbDxhbnk+KHByaW9taXNlcykudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VG9rZW5TdGF0cyh0aGlzLnRva2Vucyk7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ0b2tlbi1zdGF0c1wiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zO1xuICAgICAgICAgICAgfSk7ICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLy8gZm9yIGVhY2ggdG9rZW5zIHRoaXMgc29ydHMgaXRzIG1hcmtldHMgYmFzZWQgb24gdm9sdW1lXG4gICAgcHJpdmF0ZSB1cGRhdGVUb2tlbnNNYXJrZXRzKCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGhpcy53YWl0VG9rZW5zTG9hZGVkLFxuICAgICAgICAgICAgdGhpcy53YWl0TWFya2V0U3VtbWFyeVxuICAgICAgICBdKS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgLy8gYSBjYWRhIHRva2VuIGxlIGFzaWdubyB1biBwcmljZSBxdWUgc2FsZSBkZSB2ZXJpZmljYXIgc3UgcHJpY2UgZW4gZWwgbWVyY2FkbyBwcmluY2lwYWwgWFhYL1RMT1NcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy50b2tlbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50b2tlbnNbaV0ub2ZmY2hhaW4pIGNvbnRpbnVlOyAvLyBkaXNjYXJkIHRva2VucyB0aGF0IGFyZSBub3Qgb24tY2hhaW5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLnRva2Vuc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgcXVhbnRpdHk6QXNzZXRERVggPSBuZXcgQXNzZXRERVgoMCwgdG9rZW4pO1xuICAgICAgICAgICAgICAgIHRva2VuLm1hcmtldHMgPSBbXTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIHNjb3BlIGluIHRoaXMuX21hcmtldHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjb3BlLmluZGV4T2YoXCIuXCIpID09IC0xKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlOk1hcmtldCA9IHRoaXMuX21hcmtldHNbc2NvcGVdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJsZSA9IHRoaXMubWFya2V0KHRoaXMuaW52ZXJzZVNjb3BlKHNjb3BlKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY29tb2RpdHkuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4ubWFya2V0cy5wdXNoKHRhYmxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdG9rZW4ubWFya2V0cy5zb3J0KChhOk1hcmtldCwgYjpNYXJrZXQpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBwdXNoIG9mZmNoYWluIHRva2VucyB0byB0aGUgZW5kIG9mIHRoZSB0b2tlbiBsaXN0XG4gICAgICAgICAgICAgICAgdmFyIGFfYW1vdW50ID0gYS5zdW1tYXJ5ID8gYS5zdW1tYXJ5LmFtb3VudCA6IG5ldyBBc3NldERFWCgpO1xuICAgICAgICAgICAgICAgIHZhciBiX2Ftb3VudCA9IGIuc3VtbWFyeSA/IGIuc3VtbWFyeS5hbW91bnQgOiBuZXcgQXNzZXRERVgoKTtcbiAgICBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChhX2Ftb3VudC50b2tlbi5zeW1ib2wgPT0gYl9hbW91bnQudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiBjb21wYXJpbmcgdHdvIGRpZmZlcmVudCB0b2tlbnMgXCIgKyBhX2Ftb3VudC5zdHIgKyBcIiwgXCIgKyBiX2Ftb3VudC5zdHIpXG4gICAgICAgICAgICAgICAgaWYoYV9hbW91bnQuYW1vdW50LmlzR3JlYXRlclRoYW4oYl9hbW91bnQuYW1vdW50KSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIGlmKGFfYW1vdW50LmFtb3VudC5pc0xlc3NUaGFuKGJfYW1vdW50LmFtb3VudCkpIHJldHVybiAxO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTsgICBcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSB1cGRhdGVUb2tlbnNTdW1tYXJ5KHRpbWVzOiBudW1iZXIgPSAyMCkge1xuICAgICAgICBpZiAodGltZXMgPiAxKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gdGltZXM7IGk+MDsgaS0tKSB0aGlzLnVwZGF0ZVRva2Vuc1N1bW1hcnkoMSk7XG4gICAgICAgICAgICB0aGlzLnJlc29ydFRva2VucygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0aGlzLndhaXRUb2tlbnNMb2FkZWQsXG4gICAgICAgICAgICB0aGlzLndhaXRNYXJrZXRTdW1tYXJ5XG4gICAgICAgIF0pLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIihpbmkpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlLnVwZGF0ZVRva2Vuc1N1bW1hcnkoKVwiKTsgXG5cbiAgICAgICAgICAgIC8vIG1hcHBpbmcgb2YgaG93IG11Y2ggKGFtb3VudCBvZikgdG9rZW5zIGhhdmUgYmVlbiB0cmFkZWQgYWdyZWdhdGVkIGluIGFsbCBtYXJrZXRzXG4gICAgICAgICAgICB2YXIgYW1vdW50X21hcDp7W2tleTpzdHJpbmddOkFzc2V0REVYfSA9IHt9O1xuXG4gICAgICAgICAgICAvLyBhIGNhZGEgdG9rZW4gbGUgYXNpZ25vIHVuIHByaWNlIHF1ZSBzYWxlIGRlIHZlcmlmaWNhciBzdSBwcmljZSBlbiBlbCBtZXJjYWRvIHByaW5jaXBhbCBYWFgvVExPU1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnRva2Vucykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRva2Vuc1tpXS5vZmZjaGFpbikgY29udGludWU7IC8vIGRpc2NhcmQgdG9rZW5zIHRoYXQgYXJlIG5vdCBvbi1jaGFpblxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IHRoaXMudG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgIHZhciBxdWFudGl0eTpBc3NldERFWCA9IG5ldyBBc3NldERFWCgwLCB0b2tlbik7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqIGluIHRoaXMuX21hcmtldHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGouaW5kZXhPZihcIi5cIikgPT0gLTEpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGU6TWFya2V0ID0gdGhpcy5fbWFya2V0c1tqXTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eSA9IHF1YW50aXR5LnBsdXModGFibGUuc3VtbWFyeS5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eSA9IHF1YW50aXR5LnBsdXModGFibGUuc3VtbWFyeS52b2x1bWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmNvbW9kaXR5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wgJiYgdGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRoaXMudGVsb3Muc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4uc3VtbWFyeSAmJiB0b2tlbi5zdW1tYXJ5LnByaWNlLmFtb3VudC50b051bWJlcigpID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4uc3VtbWFyeTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4uc3VtbWFyeSA9IHRva2VuLnN1bW1hcnkgfHwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiB0YWJsZS5zdW1tYXJ5LnByaWNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfMjRoX2FnbzogdGFibGUuc3VtbWFyeS5wcmljZV8yNGhfYWdvLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lOiB0YWJsZS5zdW1tYXJ5LnZvbHVtZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmNlbnQ6IHRhYmxlLnN1bW1hcnkucGVyY2VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJjZW50X3N0cjogdGFibGUuc3VtbWFyeS5wZXJjZW50X3N0cixcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkgPSB0b2tlbi5zdW1tYXJ5IHx8IHtcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IG5ldyBBc3NldERFWCgwLCB0aGlzLnRlbG9zKSxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2VfMjRoX2FnbzogbmV3IEFzc2V0REVYKDAsIHRoaXMudGVsb3MpLFxuICAgICAgICAgICAgICAgICAgICB2b2x1bWU6IG5ldyBBc3NldERFWCgwLCB0aGlzLnRlbG9zKSxcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudDogMCxcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudF9zdHI6IFwiMCVcIixcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBhbW91bnRfbWFwW3Rva2VuLnN5bWJvbF0gPSBxdWFudGl0eTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy50ZWxvcy5zdW1tYXJ5ID0ge1xuICAgICAgICAgICAgICAgIHByaWNlOiBuZXcgQXNzZXRERVgoMSwgdGhpcy50ZWxvcyksXG4gICAgICAgICAgICAgICAgcHJpY2VfMjRoX2FnbzogbmV3IEFzc2V0REVYKDEsIHRoaXMudGVsb3MpLFxuICAgICAgICAgICAgICAgIHZvbHVtZTogbmV3IEFzc2V0REVYKC0xLCB0aGlzLnRlbG9zKSxcbiAgICAgICAgICAgICAgICBwZXJjZW50OiAwLFxuICAgICAgICAgICAgICAgIHBlcmNlbnRfc3RyOiBcIjAlXCJcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJhbW91bnRfbWFwOiBcIiwgYW1vdW50X21hcCk7XG5cblxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgT05FID0gbmV3IEJpZ051bWJlcigxKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnRva2Vucykge1xuICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IHRoaXMudG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5vZmZjaGFpbikgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKCF0b2tlbi5zdW1tYXJ5KSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4uc3ltYm9sID09IHRoaXMudGVsb3Muc3ltYm9sKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlRPS0VOOiAtLS0tLS0tLSBcIiwgdG9rZW4uc3ltYm9sLCB0b2tlbi5zdW1tYXJ5LnByaWNlLnN0ciwgdG9rZW4uc3VtbWFyeS5wcmljZV8yNGhfYWdvLnN0ciApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciB2b2x1bWUgPSBuZXcgQXNzZXRERVgoMCwgdGhpcy50ZWxvcyk7XG4gICAgICAgICAgICAgICAgdmFyIHByaWNlID0gbmV3IEFzc2V0REVYKDAsIHRoaXMudGVsb3MpO1xuICAgICAgICAgICAgICAgIHZhciBwcmljZV9pbml0ID0gbmV3IEFzc2V0REVYKDAsIHRoaXMudGVsb3MpO1xuICAgICAgICAgICAgICAgIHZhciB0b3RhbF9xdWFudGl0eSA9IGFtb3VudF9tYXBbdG9rZW4uc3ltYm9sXTtcblxuICAgICAgICAgICAgICAgIGlmICh0b3RhbF9xdWFudGl0eS50b051bWJlcigpID09IDApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgKHRva2VuLnN5bWJvbCA9PSBcIkFDT1JOXCIpIGNvbnNvbGUubG9nKFwiVE9LRU46IC0tLS0tLS0tIFwiLCB0b2tlbi5zeW1ib2wsIHRva2VuLnN1bW1hcnkucHJpY2Uuc3RyLCB0b2tlbi5zdW1tYXJ5LnByaWNlXzI0aF9hZ28uc3RyICk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiB0aGlzLl9tYXJrZXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqLmluZGV4T2YoXCIuXCIpID09IC0xKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlID0gdGhpcy5fbWFya2V0c1tqXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbmN5X3ByaWNlID0gdGFibGUuY3VycmVuY3kuc3ltYm9sID09IFwiVExPU1wiID8gT05FIDogdGFibGUuY3VycmVuY3kuc3VtbWFyeS5wcmljZS5hbW91bnQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW5jeV9wcmljZV8yNGhfYWdvID0gdGFibGUuY3VycmVuY3kuc3ltYm9sID09IFwiVExPU1wiID8gT05FIDogdGFibGUuY3VycmVuY3kuc3VtbWFyeS5wcmljZV8yNGhfYWdvLmFtb3VudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmNvbW9kaXR5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wgfHwgdGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBob3cgbXVjaCBxdWFudGl0eSBpcyBpbnZvbHZlZCBpbiB0aGlzIG1hcmtldFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHF1YW50aXR5ID0gbmV3IEFzc2V0REVYKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY29tb2RpdHkuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gdGFibGUuc3VtbWFyeS5hbW91bnQuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gdGFibGUuc3VtbWFyeS52b2x1bWUuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBpbmZsdWVuY2Utd2VpZ2h0IG9mIHRoaXMgbWFya2V0IG92ZXIgdGhlIHRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgd2VpZ2h0ID0gcXVhbnRpdHkuYW1vdW50LmRpdmlkZWRCeSh0b3RhbF9xdWFudGl0eS5hbW91bnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIHByaWNlIG9mIHRoaXMgdG9rZW4gaW4gdGhpcyBtYXJrZXQgKGV4cHJlc3NlZCBpbiBUTE9TKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlX2Ftb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfYW1vdW50ID0gdGFibGUuc3VtbWFyeS5wcmljZS5hbW91bnQubXVsdGlwbGllZEJ5KHRhYmxlLmN1cnJlbmN5LnN1bW1hcnkucHJpY2UuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2Ftb3VudCA9IHRhYmxlLnN1bW1hcnkuaW52ZXJzZS5hbW91bnQubXVsdGlwbGllZEJ5KHRhYmxlLmNvbW9kaXR5LnN1bW1hcnkucHJpY2UuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoaXMgbWFya2V0IHRva2VuIHByaWNlIG11bHRpcGxpZWQgYnkgdGhlIHdpZ2h0IG9mIHRoaXMgbWFya2V0IChwb25kZXJhdGVkIHByaWNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlX2kgPSBuZXcgQXNzZXRERVgocHJpY2VfYW1vdW50Lm11bHRpcGxpZWRCeSh3ZWlnaHQpLCB0aGlzLnRlbG9zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBwcmljZSBvZiB0aGlzIHRva2VuIGluIHRoaXMgbWFya2V0IDI0aCBhZ28gKGV4cHJlc3NlZCBpbiBUTE9TKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlX2luaXRfYW1vdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmNvbW9kaXR5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZV9pbml0X2Ftb3VudCA9IHRhYmxlLnN1bW1hcnkucHJpY2VfMjRoX2Fnby5hbW91bnQubXVsdGlwbGllZEJ5KHRhYmxlLmN1cnJlbmN5LnN1bW1hcnkucHJpY2VfMjRoX2Fnby5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfaW5pdF9hbW91bnQgPSB0YWJsZS5zdW1tYXJ5LmludmVyc2VfMjRoX2Fnby5hbW91bnQubXVsdGlwbGllZEJ5KHRhYmxlLmNvbW9kaXR5LnN1bW1hcnkucHJpY2VfMjRoX2Fnby5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhpcyBtYXJrZXQgdG9rZW4gcHJpY2UgMjRoIGFnbyBtdWx0aXBsaWVkIGJ5IHRoZSB3ZWlnaHQgb2YgdGhpcyBtYXJrZXQgKHBvbmRlcmF0ZWQgaW5pdF9wcmljZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmljZV9pbml0X2kgPSBuZXcgQXNzZXRERVgocHJpY2VfaW5pdF9hbW91bnQubXVsdGlwbGllZEJ5KHdlaWdodCksIHRoaXMudGVsb3MpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBob3cgbXVjaCB2b2x1bWUgaXMgaW52b2x2ZWQgaW4gdGhpcyBtYXJrZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2b2x1bWVfaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lX2kgPSB0YWJsZS5zdW1tYXJ5LnZvbHVtZS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lX2kgPSB0YWJsZS5zdW1tYXJ5LmFtb3VudC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGlzIG1hcmtldCBkb2VzIG5vdCBtZXN1cmUgdGhlIHZvbHVtZSBpbiBUTE9TLCB0aGVuIGNvbnZlcnQgcXVhbnRpdHkgdG8gVExPUyBieSBtdWx0aXBsaWVkIEJ5IHZvbHVtZSdzIHRva2VuIHByaWNlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodm9sdW1lX2kudG9rZW4uc3ltYm9sICE9IHRoaXMudGVsb3Muc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lX2kgPSBuZXcgQXNzZXRERVgocXVhbnRpdHkuYW1vdW50Lm11bHRpcGxpZWRCeShxdWFudGl0eS50b2tlbi5zdW1tYXJ5LnByaWNlLmFtb3VudCksIHRoaXMudGVsb3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlID0gcHJpY2UucGx1cyhuZXcgQXNzZXRERVgocHJpY2VfaSwgdGhpcy50ZWxvcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfaW5pdCA9IHByaWNlX2luaXQucGx1cyhuZXcgQXNzZXRERVgocHJpY2VfaW5pdF9pLCB0aGlzLnRlbG9zKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWUgPSB2b2x1bWUucGx1cyhuZXcgQXNzZXRERVgodm9sdW1lX2ksIHRoaXMudGVsb3MpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItaVwiLGksIHRhYmxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSB3ZWlnaHQ6XCIsIHdlaWdodC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSB0YWJsZS5zdW1tYXJ5LnByaWNlLnN0clwiLCB0YWJsZS5zdW1tYXJ5LnByaWNlLnN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gdGFibGUuc3VtbWFyeS5wcmljZS5hbW91bnQubXVsdGlwbGllZEJ5KHdlaWdodCkudG9OdW1iZXIoKVwiLCB0YWJsZS5zdW1tYXJ5LnByaWNlLmFtb3VudC5tdWx0aXBsaWVkQnkod2VpZ2h0KS50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSBjdXJyZW5jeV9wcmljZS50b051bWJlcigpXCIsIGN1cnJlbmN5X3ByaWNlLnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHByaWNlX2k6XCIsIHByaWNlX2kudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gcHJpY2UgLT5cIiwgcHJpY2Uuc3RyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSBjdXJyZW5jeV9wcmljZV8yNGhfYWdvOlwiLCBjdXJyZW5jeV9wcmljZV8yNGhfYWdvLnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHRhYmxlLnN1bW1hcnkucHJpY2VfMjRoX2FnbzpcIiwgdGFibGUuc3VtbWFyeS5wcmljZV8yNGhfYWdvLnN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gcHJpY2VfaW5pdF9pOlwiLCBwcmljZV9pbml0X2kudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gcHJpY2VfaW5pdCAtPlwiLCBwcmljZV9pbml0LnN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGRpZmYgPSBwcmljZS5taW51cyhwcmljZV9pbml0KTtcbiAgICAgICAgICAgICAgICB2YXIgcmF0aW86bnVtYmVyID0gMDtcbiAgICAgICAgICAgICAgICBpZiAocHJpY2VfaW5pdC5hbW91bnQudG9OdW1iZXIoKSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhdGlvID0gZGlmZi5hbW91bnQuZGl2aWRlZEJ5KHByaWNlX2luaXQuYW1vdW50KS50b051bWJlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudCA9IE1hdGguZmxvb3IocmF0aW8gKiAxMDAwMCkgLyAxMDA7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRfc3RyID0gKGlzTmFOKHBlcmNlbnQpID8gMCA6IHBlcmNlbnQpICsgXCIlXCI7XG5cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInByaWNlXCIsIHByaWNlLnN0cik7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwcmljZV8yNGhfYWdvXCIsIHByaWNlX2luaXQuc3RyKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInZvbHVtZVwiLCB2b2x1bWUuc3RyKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInBlcmNlbnRcIiwgcGVyY2VudCk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwZXJjZW50X3N0clwiLCBwZXJjZW50X3N0cik7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJyYXRpb1wiLCByYXRpbyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJkaWZmXCIsIGRpZmYuc3RyKTtcblxuICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkucHJpY2UgPSBwcmljZTtcbiAgICAgICAgICAgICAgICB0b2tlbi5zdW1tYXJ5LnByaWNlXzI0aF9hZ28gPSBwcmljZV9pbml0O1xuICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkucGVyY2VudCA9IHBlcmNlbnQ7XG4gICAgICAgICAgICAgICAgdG9rZW4uc3VtbWFyeS5wZXJjZW50X3N0ciA9IHBlcmNlbnRfc3RyO1xuICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkudm9sdW1lID0gdm9sdW1lO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKGVuZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgdGhpcy5zZXRUb2tlblN1bW1hcnkoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaFRva2VucyhleHRlbmRlZDogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWUuZmV0Y2hUb2tlbnMoKVwiKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcInRva2Vuc1wiKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICB0b2tlbnM6IDxUb2tlbkRFWFtdPnJlc3VsdC5yb3dzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gZGF0YS50b2tlbnMpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnRva2Vuc1tpXS5zY29wZSA9IGRhdGEudG9rZW5zW2ldLnN5bWJvbC50b0xvd2VyQ2FzZSgpICsgXCIudGxvc1wiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNvcnRUb2tlbnMoKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKGluaSkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJlc29ydFRva2VucygpXCIpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRoaXMudG9rZW5zWzBdXCIsIHRoaXMudG9rZW5zWzBdLnN1bW1hcnkpO1xuICAgICAgICB0aGlzLnRva2Vucy5zb3J0KChhOlRva2VuREVYLCBiOlRva2VuREVYKSA9PiB7XG4gICAgICAgICAgICAvLyBwdXNoIG9mZmNoYWluIHRva2VucyB0byB0aGUgZW5kIG9mIHRoZSB0b2tlbiBsaXN0XG4gICAgICAgICAgICBpZiAoYS5vZmZjaGFpbiB8fCAhYS52ZXJpZmllZCkgcmV0dXJuIDE7XG4gICAgICAgICAgICBpZiAoYi5vZmZjaGFpbiB8fCAhYi52ZXJpZmllZCkgcmV0dXJuIC0xO1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIiAtLS0gXCIsIGEuc3ltYm9sLCBcIi1cIiwgYi5zeW1ib2wsIFwiIC0tLSBcIik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIiAgICAgXCIsIGEuc3VtbWFyeSA/IGEuc3VtbWFyeS52b2x1bWUuc3RyIDogXCIwXCIsIFwiLVwiLCBiLnN1bW1hcnkgPyBiLnN1bW1hcnkudm9sdW1lLnN0ciA6IFwiMFwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGFfdm9sID0gYS5zdW1tYXJ5ID8gYS5zdW1tYXJ5LnZvbHVtZSA6IG5ldyBBc3NldERFWCgpO1xuICAgICAgICAgICAgdmFyIGJfdm9sID0gYi5zdW1tYXJ5ID8gYi5zdW1tYXJ5LnZvbHVtZSA6IG5ldyBBc3NldERFWCgpO1xuXG4gICAgICAgICAgICBpZihhX3ZvbC5hbW91bnQuaXNHcmVhdGVyVGhhbihiX3ZvbC5hbW91bnQpKSByZXR1cm4gLTE7XG4gICAgICAgICAgICBpZihhX3ZvbC5hbW91bnQuaXNMZXNzVGhhbihiX3ZvbC5hbW91bnQpKSByZXR1cm4gMTtcblxuICAgICAgICAgICAgaWYoYS5hcHBuYW1lIDwgYi5hcHBuYW1lKSByZXR1cm4gLTE7XG4gICAgICAgICAgICBpZihhLmFwcG5hbWUgPiBiLmFwcG5hbWUpIHJldHVybiAxO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0pOyBcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJlc29ydFRva2VucygpXCIsIHRoaXMudG9rZW5zKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCIoZW5kKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG5cbiAgICAgICAgdGhpcy5vblRva2Vuc1JlYWR5Lm5leHQodGhpcy50b2tlbnMpOyAgICAgICAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNvcnRUb3BNYXJrZXRzKCkge1xuICAgICAgICB0aGlzLndhaXRUb2tlblN1bW1hcnkudGhlbihfID0+IHtcblxuICAgICAgICAgICAgdGhpcy50b3BtYXJrZXRzID0gW107XG4gICAgICAgICAgICB2YXIgaW52ZXJzZTogc3RyaW5nO1xuICAgICAgICAgICAgdmFyIG1hcmtldDpNYXJrZXQ7XG4gICAgICAgICAgICBmb3IgKHZhciBzY29wZSBpbiB0aGlzLl9tYXJrZXRzKSB7XG4gICAgICAgICAgICAgICAgbWFya2V0ID0gdGhpcy5fbWFya2V0c1tzY29wZV07XG4gICAgICAgICAgICAgICAgaWYgKG1hcmtldC5kaXJlY3QgPj0gbWFya2V0LmludmVyc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BtYXJrZXRzLnB1c2gobWFya2V0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnZlcnNlID0gdGhpcy5pbnZlcnNlU2NvcGUoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXQgPSB0aGlzLm1hcmtldChpbnZlcnNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BtYXJrZXRzLnB1c2gobWFya2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudG9wbWFya2V0cy5zb3J0KChhOk1hcmtldCwgYjpNYXJrZXQpID0+IHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgYV92b2wgPSBhLnN1bW1hcnkgPyBhLnN1bW1hcnkudm9sdW1lIDogbmV3IEFzc2V0REVYKCk7XG4gICAgICAgICAgICAgICAgdmFyIGJfdm9sID0gYi5zdW1tYXJ5ID8gYi5zdW1tYXJ5LnZvbHVtZSA6IG5ldyBBc3NldERFWCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGFfdm9sLnRva2VuICE9IHRoaXMudGVsb3MpIHtcbiAgICAgICAgICAgICAgICAgICAgYV92b2wgPSBuZXcgQXNzZXRERVgoYV92b2wuYW1vdW50Lm11bHRpcGxpZWRCeShhX3ZvbC50b2tlbi5zdW1tYXJ5LnByaWNlLmFtb3VudCksdGhpcy50ZWxvcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiX3ZvbC50b2tlbiAhPSB0aGlzLnRlbG9zKSB7XG4gICAgICAgICAgICAgICAgICAgIGJfdm9sID0gbmV3IEFzc2V0REVYKGJfdm9sLmFtb3VudC5tdWx0aXBsaWVkQnkoYl92b2wudG9rZW4uc3VtbWFyeS5wcmljZS5hbW91bnQpLHRoaXMudGVsb3MpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGJfdm9sLnRva2VuID09IHRoaXMudGVsb3MsIFwiRVJST1I6IHZvbHVtZSBtaXNzY2FsY3VsYXRlZFwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChhX3ZvbC50b2tlbiA9PSB0aGlzLnRlbG9zLCBcIkVSUk9SOiB2b2x1bWUgbWlzc2NhbGN1bGF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICBpZihhX3ZvbC5hbW91bnQuaXNHcmVhdGVyVGhhbihiX3ZvbC5hbW91bnQpKSByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgaWYoYV92b2wuYW1vdW50LmlzTGVzc1RoYW4oYl92b2wuYW1vdW50KSkgcmV0dXJuIDE7XG5cbiAgICAgICAgICAgICAgICBpZihhLmN1cnJlbmN5ID09IHRoaXMudGVsb3MgJiYgYi5jdXJyZW5jeSAhPSB0aGlzLnRlbG9zKSByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgaWYoYi5jdXJyZW5jeSA9PSB0aGlzLnRlbG9zICYmIGEuY3VycmVuY3kgIT0gdGhpcy50ZWxvcykgcmV0dXJuIDE7XG5cbiAgICAgICAgICAgICAgICBpZihhLmNvbW9kaXR5LmFwcG5hbWUgPCBiLmNvbW9kaXR5LmFwcG5hbWUpIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICBpZihhLmNvbW9kaXR5LmFwcG5hbWUgPiBiLmNvbW9kaXR5LmFwcG5hbWUpIHJldHVybiAxO1xuICAgIFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMub25Ub3BNYXJrZXRzUmVhZHkubmV4dCh0aGlzLnRvcG1hcmtldHMpOyBcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cblxufVxuXG5cblxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFZhcGFlZURFWCB9IGZyb20gJy4vZGV4LnNlcnZpY2UnXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXSxcbiAgcHJvdmlkZXJzOiBbVmFwYWVlREVYXSxcbiAgZXhwb3J0czogW11cbn0pXG5leHBvcnQgY2xhc3MgVmFwYWVlRGV4TW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsY0FrQ3NCLFNBQVEsS0FBSzs7OztJQWlDL0IsWUFBWSxNQUFVLElBQUk7UUFDdEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxPQUFPLEdBQUcsSUFBSSxRQUFRLEVBQUU7WUFDeEIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQ2xCLE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQztZQUNyQixPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUM7WUFDcEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDNUI7UUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDbkI7Q0FHSjs7Ozs7O0FDL0VELGNBUXNCLFNBQVEsS0FBSzs7Ozs7SUFJL0IsWUFBWSxJQUFTLElBQUksRUFBRSxJQUFTLElBQUk7UUFDcEMsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUVYLElBQUksQ0FBQyxZQUFZLFFBQVEsRUFBRTtZQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDZixPQUFPO1NBQ1Y7UUFFRCxJQUFJ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LENBQUMsQ0FBQzt3QkFDZCxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7d0JBQ3RDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzt3QkFDM0MsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO3dCQUN4QyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7d0JBQ3RDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzt3QkFFM0IsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ2QsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzt3QkFDMUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzt3QkFDL0MsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzt3QkFDNUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzt3QkFDMUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQy9CLFVBQVUsR0FBRyxLQUFLLENBQUM7cUJBQ3RCO29CQUVELElBQUksVUFBVSxJQUFJLElBQUksSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFOzt3QkFDdkMsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7d0JBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsSUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7OzRCQUN2QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUMsQ0FBQyxDQUFDLENBQUM7OzRCQUdyRCxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7NEJBQy9DLElBQUksR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDOzRCQUNoRCxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7NEJBRzNCLElBQUksT0FBTyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDOzs0QkFDbkQsSUFBSSxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7NEJBQ3hELE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3lCQUNsQztxQkFDSjs7Ozs7Ozs7b0JBVUQsT0FBTyxNQUFNLENBQUM7aUJBQ2pCLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTTs7b0JBS1YsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDOztvQkFDaEIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7O29CQUNoQyxJQUFJLFFBQVEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDdEMsS0FBSyxJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sR0FBRyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUU7O3dCQUU3RCxJQUFJLFFBQVEsR0FBVyxFQUFFLENBQUM7O3dCQUMxQixJQUFJLFVBQVUsR0FBVyxFQUFFLENBQUM7O3dCQUM1QixJQUFJLE1BQU0sR0FBUyxFQUFFLENBQUM7d0JBQ3RCLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBRSxDQUFDLEVBQUU7OzRCQUUxQyxJQUFJLEdBQUcsR0FBUyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7OzRCQUNuQyxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDOzs0QkFDL0IsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDOzRCQUNoQixLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQ0FBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMzQyxJQUFJLEdBQUcsRUFBRTtnQ0FDTCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUN4Qzs0QkFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs0QkFHdEIsR0FBRyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDM0IsR0FBRyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzdCLE1BQU0sR0FBRyxFQUFFLENBQUM7NEJBQ1osS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0NBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDM0MsSUFBSSxHQUFHLEVBQUU7Z0NBQ0wsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUMzRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ3JDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ25CLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ25CLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFH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QkFDL0MsT0FBTyxFQUFFLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQztvQkFDbkQsUUFBUSxFQUFFLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQztvQkFDckQsR0FBRyxFQUFFLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztvQkFDM0MsR0FBRyxFQUFFLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztvQkFDM0MsTUFBTSxFQUFFLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztvQkFDakQsTUFBTSxFQUFFLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztvQkFDakQsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2lCQUN0QyxDQUFBO2dCQUNELEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDaEcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUM7YUFDNUQ7OztZQUdE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