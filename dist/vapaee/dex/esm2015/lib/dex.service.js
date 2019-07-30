/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import BigNumber from "bignumber.js";
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { TokenDEX } from './token-dex.class';
import { AssetDEX } from './asset-dex.class';
import { Feedback } from '@vapaee/feedback';
import { VapaeeScatter } from '@vapaee/scatter';
import * as i0 from "@angular/core";
import * as i1 from "@vapaee/scatter";
import * as i2 from "ngx-cookie-service/cookie-service/cookie.service";
import * as i3 from "@angular/common";
export class VapaeeDEX {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.scatter.queryAccountData(name).catch((_) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        }).then((result) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        }).then((result) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        }).then((result) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        }).then((result) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("VapaeeDEX.getSomeFreeFakeTokens()");
            /** @type {?} */
            var _token = symbol;
            this.feed.setLoading("freefake-" + _token || "token", true);
            return this.waitTokenStats.then(_ => {
                /** @type {?} */
                var token = null;
                /** @type {?} */
                var counts = 0;
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("VapaeeDEX.getDeposits()");
            this.feed.setLoading("deposits", true);
            return this.waitTokensLoaded.then((_) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("VapaeeDEX.getBalances()");
            this.feed.setLoading("balances", true);
            return this.waitTokensLoaded.then((_) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.feed.setLoading("thisorders", true);
            return this.waitTokensLoaded.then((_) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("VapaeeDEX.getUserOrders()");
            this.feed.setLoading("userorders", true);
            return this.waitTokensLoaded.then((_) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            var scope = this.canonicalScope(this.getScopeFor(comodity, currency));
            /** @type {?} */
            var aux = null;
            /** @type {?} */
            var result = null;
            this.feed.setLoading("history." + scope, true);
            aux = this.waitOrderSummary.then((_) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("VapaeeDEX.getBlockHistory()", comodity.symbol, page, pagesize);
            /** @type {?} */
            var scope = this.canonicalScope(this.getScopeFor(comodity, currency));
            /** @type {?} */
            var aux = null;
            /** @type {?} */
            var result = null;
            this.feed.setLoading("block-history." + scope, true);
            aux = this.waitOrderSummary.then((_) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                /** @type {?} */
                var fetchBlockHistoryStart = new Date();
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
                    var last_hour = null;
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            aux = this.waitTokensLoaded.then((_) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            aux = this.waitTokensLoaded.then((_) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            aux = this.waitTokensLoaded.then((_) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
                    if (summary.rows[i].label == "lastone") {
                        // price = summary.rows[i].price;
                    }
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.waitOrderSummary.then((_) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.waitTokensLoaded.then((_) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
/** @nocollapse */ VapaeeDEX.ngInjectableDef = i0.defineInjectable({ factory: function VapaeeDEX_Factory() { return new VapaeeDEX(i0.inject(i1.VapaeeScatter), i0.inject(i2.CookieService), i0.inject(i3.DatePipe)); }, token: VapaeeDEX, providedIn: "root" });
if (false) {
    /** @type {?} */
    VapaeeDEX.prototype.loginState;
    /** @type {?} */
    VapaeeDEX.prototype._markets;
    /** @type {?} */
    VapaeeDEX.prototype._reverse;
    /** @type {?} */
    VapaeeDEX.prototype.zero_telos;
    /** @type {?} */
    VapaeeDEX.prototype.telos;
    /** @type {?} */
    VapaeeDEX.prototype.tokens;
    /** @type {?} */
    VapaeeDEX.prototype.contract;
    /** @type {?} */
    VapaeeDEX.prototype.feed;
    /** @type {?} */
    VapaeeDEX.prototype.current;
    /** @type {?} */
    VapaeeDEX.prototype.last_logged;
    /** @type {?} */
    VapaeeDEX.prototype.contract_name;
    /** @type {?} */
    VapaeeDEX.prototype.deposits;
    /** @type {?} */
    VapaeeDEX.prototype.balances;
    /** @type {?} */
    VapaeeDEX.prototype.userorders;
    /** @type {?} */
    VapaeeDEX.prototype.onLoggedAccountChange;
    /** @type {?} */
    VapaeeDEX.prototype.onCurrentAccountChange;
    /** @type {?} */
    VapaeeDEX.prototype.onHistoryChange;
    /** @type {?} */
    VapaeeDEX.prototype.onMarketSummary;
    /** @type {?} */
    VapaeeDEX.prototype.onTokensReady;
    /** @type {?} */
    VapaeeDEX.prototype.onMarketReady;
    /** @type {?} */
    VapaeeDEX.prototype.onTradeUpdated;
    /** @type {?} */
    VapaeeDEX.prototype.vapaeetokens;
    /** @type {?} */
    VapaeeDEX.prototype.activityPagesize;
    /** @type {?} */
    VapaeeDEX.prototype.activity;
    /** @type {?} */
    VapaeeDEX.prototype.setOrderSummary;
    /** @type {?} */
    VapaeeDEX.prototype.waitOrderSummary;
    /** @type {?} */
    VapaeeDEX.prototype.setTokenStats;
    /** @type {?} */
    VapaeeDEX.prototype.waitTokenStats;
    /** @type {?} */
    VapaeeDEX.prototype.setMarketSummary;
    /** @type {?} */
    VapaeeDEX.prototype.waitMarketSummary;
    /** @type {?} */
    VapaeeDEX.prototype.setTokenSummary;
    /** @type {?} */
    VapaeeDEX.prototype.waitTokenSummary;
    /** @type {?} */
    VapaeeDEX.prototype.setTokensLoaded;
    /** @type {?} */
    VapaeeDEX.prototype.waitTokensLoaded;
    /** @type {?} */
    VapaeeDEX.prototype.scatter;
    /** @type {?} */
    VapaeeDEX.prototype.cookies;
    /** @type {?} */
    VapaeeDEX.prototype.datePipe;
}
/**
 * @record
 */
export function MarketMap() { }
/**
 * @record
 */
export function Market() { }
/** @type {?} */
Market.prototype.scope;
/** @type {?} */
Market.prototype.comodity;
/** @type {?} */
Market.prototype.currency;
/** @type {?} */
Market.prototype.deals;
/** @type {?} */
Market.prototype.blocks;
/** @type {?} */
Market.prototype.blocklevels;
/** @type {?} */
Market.prototype.blocklist;
/** @type {?} */
Market.prototype.reverselevels;
/** @type {?} */
Market.prototype.reverseblocks;
/** @type {?} */
Market.prototype.block;
/** @type {?} */
Market.prototype.orders;
/** @type {?} */
Market.prototype.history;
/** @type {?} */
Market.prototype.tx;
/** @type {?} */
Market.prototype.summary;
/** @type {?} */
Market.prototype.header;
/**
 * @record
 */
export function MarketSummary() { }
/** @type {?} */
MarketSummary.prototype.scope;
/** @type {?} */
MarketSummary.prototype.price;
/** @type {?} */
MarketSummary.prototype.inverse;
/** @type {?} */
MarketSummary.prototype.price_24h_ago;
/** @type {?} */
MarketSummary.prototype.inverse_24h_ago;
/** @type {?|undefined} */
MarketSummary.prototype.min_price;
/** @type {?|undefined} */
MarketSummary.prototype.max_price;
/** @type {?|undefined} */
MarketSummary.prototype.min_inverse;
/** @type {?|undefined} */
MarketSummary.prototype.max_inverse;
/** @type {?} */
MarketSummary.prototype.volume;
/** @type {?|undefined} */
MarketSummary.prototype.amount;
/** @type {?|undefined} */
MarketSummary.prototype.percent;
/** @type {?|undefined} */
MarketSummary.prototype.percent_str;
/** @type {?|undefined} */
MarketSummary.prototype.ipercent;
/** @type {?|undefined} */
MarketSummary.prototype.ipercent_str;
/** @type {?|undefined} */
MarketSummary.prototype.records;
/**
 * @record
 */
export function MarketHeader() { }
/** @type {?} */
MarketHeader.prototype.sell;
/** @type {?} */
MarketHeader.prototype.buy;
/**
 * @record
 */
export function OrdersSummary() { }
/** @type {?} */
OrdersSummary.prototype.total;
/** @type {?} */
OrdersSummary.prototype.orders;
/**
 * @record
 */
export function TokenOrders() { }
/** @type {?} */
TokenOrders.prototype.sell;
/** @type {?} */
TokenOrders.prototype.buy;
/**
 * @record
 */
export function HistoryTx() { }
/** @type {?} */
HistoryTx.prototype.id;
/** @type {?} */
HistoryTx.prototype.str;
/** @type {?} */
HistoryTx.prototype.price;
/** @type {?} */
HistoryTx.prototype.inverse;
/** @type {?} */
HistoryTx.prototype.amount;
/** @type {?} */
HistoryTx.prototype.payment;
/** @type {?} */
HistoryTx.prototype.buyfee;
/** @type {?} */
HistoryTx.prototype.sellfee;
/** @type {?} */
HistoryTx.prototype.buyer;
/** @type {?} */
HistoryTx.prototype.seller;
/** @type {?} */
HistoryTx.prototype.date;
/** @type {?} */
HistoryTx.prototype.isbuy;
/**
 * @record
 */
export function EventLog() { }
/** @type {?} */
EventLog.prototype.id;
/** @type {?} */
EventLog.prototype.user;
/** @type {?} */
EventLog.prototype.event;
/** @type {?} */
EventLog.prototype.params;
/** @type {?} */
EventLog.prototype.date;
/** @type {?|undefined} */
EventLog.prototype.processed;
/**
 * @record
 */
export function HistoryBlock() { }
/** @type {?} */
HistoryBlock.prototype.id;
/** @type {?} */
HistoryBlock.prototype.hour;
/** @type {?} */
HistoryBlock.prototype.str;
/** @type {?} */
HistoryBlock.prototype.price;
/** @type {?} */
HistoryBlock.prototype.inverse;
/** @type {?} */
HistoryBlock.prototype.entrance;
/** @type {?} */
HistoryBlock.prototype.max;
/** @type {?} */
HistoryBlock.prototype.min;
/** @type {?} */
HistoryBlock.prototype.volume;
/** @type {?} */
HistoryBlock.prototype.amount;
/** @type {?} */
HistoryBlock.prototype.date;
/**
 * @record
 */
export function Order() { }
/** @type {?} */
Order.prototype.id;
/** @type {?} */
Order.prototype.price;
/** @type {?} */
Order.prototype.inverse;
/** @type {?} */
Order.prototype.total;
/** @type {?} */
Order.prototype.deposit;
/** @type {?} */
Order.prototype.telos;
/** @type {?} */
Order.prototype.owner;
/**
 * @record
 */
export function UserOrdersMap() { }
/**
 * @record
 */
export function UserOrders() { }
/** @type {?} */
UserOrders.prototype.table;
/** @type {?} */
UserOrders.prototype.ids;
/** @type {?|undefined} */
UserOrders.prototype.orders;
/**
 * @record
 */
export function OrderRow() { }
/** @type {?} */
OrderRow.prototype.str;
/** @type {?} */
OrderRow.prototype.price;
/** @type {?} */
OrderRow.prototype.orders;
/** @type {?} */
OrderRow.prototype.inverse;
/** @type {?} */
OrderRow.prototype.total;
/** @type {?} */
OrderRow.prototype.sum;
/** @type {?} */
OrderRow.prototype.sumtelos;
/** @type {?} */
OrderRow.prototype.telos;
/** @type {?} */
OrderRow.prototype.owners;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV4LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AdmFwYWVlL2RleC8iLCJzb3VyY2VzIjpbImxpYi9kZXguc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLFNBQVMsTUFBTSxjQUFjLENBQUM7QUFDckMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUsYUFBYSxFQUFpRSxNQUFNLGlCQUFpQixDQUFDOzs7OztBQUsvRyxNQUFNOzs7Ozs7SUFpRUYsWUFDWSxTQUNBLFNBQ0E7UUFGQSxZQUFPLEdBQVAsT0FBTztRQUNQLFlBQU8sR0FBUCxPQUFPO1FBQ1AsYUFBUSxHQUFSLFFBQVE7cUNBN0MyQixJQUFJLE9BQU8sRUFBRTtzQ0FDWixJQUFJLE9BQU8sRUFBRTsrQkFDcEIsSUFBSSxPQUFPLEVBQUU7K0JBQ04sSUFBSSxPQUFPLEVBQUU7NkJBRWxCLElBQUksT0FBTyxFQUFFOzZCQUNiLElBQUksT0FBTyxFQUFFOzhCQUNuQixJQUFJLE9BQU8sRUFBRTs0QkFDNUIsY0FBYztnQ0FFVixFQUFFO2dDQVNZLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDNUQsSUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUM7U0FDbEMsQ0FBQzs4QkFHb0MsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVB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QyxHQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFFLENBQUMsRUFBRSxDQUFDOzs0QkFFM0MsSUFBSSxHQUFHLEdBQVMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs0QkFDbkMsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQzs7NEJBQy9CLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQzs0QkFDaEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dDQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzNDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0NBQ04sTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUN4Qzs0QkFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs0QkFHdEIsR0FBRyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDM0IsR0FBRyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzdCLE1BQU0sR0FBRyxFQUFFLENBQUM7NEJBQ1osR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dDQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzNDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0NBQ04sTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUN4Qzs0QkFHRCxVQUFV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Q0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQzs7WUFFdEUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDOztnQkFDeEMsSUFBSSxLQUFLLEdBQWdCO29CQUNyQixFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUNyQixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO29CQUN6QixHQUFHLEVBQUUsRUFBRTtvQkFDUCxLQUFLLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO29CQUMvQyxPQUFPLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDO29CQUNuRCxRQUFRLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDO29CQUNyRCxHQUFHLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO29CQUMzQyxHQUFHLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO29CQUMzQyxNQUFNLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO29CQUNqRCxNQUFNLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMs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LENBQUMsQ0FBQztZQUVuRCxFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDWixDQUFDLENBQUM7OztRQUtILElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7OztZQTdtRTVDLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7OztZQUpRLGFBQWE7WUFMYixhQUFhO1lBQ2IsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCBCaWdOdW1iZXIgZnJvbSBcImJpZ251bWJlci5qc1wiO1xuaW1wb3J0IHsgQ29va2llU2VydmljZSB9IGZyb20gJ25neC1jb29raWUtc2VydmljZSc7XG5pbXBvcnQgeyBEYXRlUGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBUb2tlbkRFWCB9IGZyb20gJy4vdG9rZW4tZGV4LmNsYXNzJztcbmltcG9ydCB7IEFzc2V0REVYIH0gZnJvbSAnLi9hc3NldC1kZXguY2xhc3MnO1xuaW1wb3J0IHsgRmVlZGJhY2sgfSBmcm9tICdAdmFwYWVlL2ZlZWRiYWNrJztcbmltcG9ydCB7IFZhcGFlZVNjYXR0ZXIsIEFjY291bnQsIEFjY291bnREYXRhLCBTbWFydENvbnRyYWN0LCBUYWJsZVJlc3VsdCwgVGFibGVQYXJhbXMgfSBmcm9tICdAdmFwYWVlL3NjYXR0ZXInO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogXCJyb290XCJcbn0pXG5leHBvcnQgY2xhc3MgVmFwYWVlREVYIHtcblxuICAgIHB1YmxpYyBsb2dpblN0YXRlOiBzdHJpbmc7XG4gICAgLypcbiAgICBwdWJsaWMgbG9naW5TdGF0ZTogc3RyaW5nO1xuICAgIC0gJ25vLXNjYXR0ZXInOiBTY2F0dGVyIG5vIGRldGVjdGVkXG4gICAgLSAnbm8tbG9nZ2VkJzogU2NhdHRlciBkZXRlY3RlZCBidXQgdXNlciBpcyBub3QgbG9nZ2VkXG4gICAgLSAnYWNjb3VudC1vayc6IHVzZXIgbG9nZ2VyIHdpdGggc2NhdHRlclxuICAgICovXG4gICAgcHJpdmF0ZSBfbWFya2V0czogTWFya2V0TWFwO1xuICAgIHByaXZhdGUgX3JldmVyc2U6IE1hcmtldE1hcDtcblxuICAgIHB1YmxpYyB6ZXJvX3RlbG9zOiBBc3NldERFWDtcbiAgICBwdWJsaWMgdGVsb3M6IFRva2VuREVYO1xuICAgIHB1YmxpYyB0b2tlbnM6IFRva2VuREVYW107XG4gICAgcHVibGljIGNvbnRyYWN0OiBTbWFydENvbnRyYWN0O1xuICAgIHB1YmxpYyBmZWVkOiBGZWVkYmFjaztcbiAgICBwdWJsaWMgY3VycmVudDogQWNjb3VudDtcbiAgICBwdWJsaWMgbGFzdF9sb2dnZWQ6IHN0cmluZztcbiAgICBwdWJsaWMgY29udHJhY3RfbmFtZTogc3RyaW5nOyAgIFxuICAgIHB1YmxpYyBkZXBvc2l0czogQXNzZXRERVhbXTtcbiAgICBwdWJsaWMgYmFsYW5jZXM6IEFzc2V0REVYW107XG4gICAgcHVibGljIHVzZXJvcmRlcnM6IFVzZXJPcmRlcnNNYXA7XG4gICAgcHVibGljIG9uTG9nZ2VkQWNjb3VudENoYW5nZTpTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvbkN1cnJlbnRBY2NvdW50Q2hhbmdlOlN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIG9uSGlzdG9yeUNoYW5nZTpTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvbk1hcmtldFN1bW1hcnk6U3ViamVjdDxNYXJrZXRTdW1tYXJ5PiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgLy8gcHVibGljIG9uQmxvY2tsaXN0Q2hhbmdlOlN1YmplY3Q8YW55W11bXT4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvblRva2Vuc1JlYWR5OlN1YmplY3Q8VG9rZW5ERVhbXT4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvbk1hcmtldFJlYWR5OlN1YmplY3Q8VG9rZW5ERVhbXT4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvblRyYWRlVXBkYXRlZDpTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHZhcGFlZXRva2VuczpzdHJpbmcgPSBcInZhcGFlZXRva2Vuc1wiO1xuXG4gICAgYWN0aXZpdHlQYWdlc2l6ZTpudW1iZXIgPSAxMDtcbiAgICBcbiAgICBhY3Rpdml0eTp7XG4gICAgICAgIHRvdGFsOm51bWJlcjtcbiAgICAgICAgZXZlbnRzOntbaWQ6c3RyaW5nXTpFdmVudExvZ307XG4gICAgICAgIGxpc3Q6RXZlbnRMb2dbXTtcbiAgICB9O1xuICAgIFxuICAgIHByaXZhdGUgc2V0T3JkZXJTdW1tYXJ5OiBGdW5jdGlvbjtcbiAgICBwdWJsaWMgd2FpdE9yZGVyU3VtbWFyeTogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRPcmRlclN1bW1hcnkgPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgcHJpdmF0ZSBzZXRUb2tlblN0YXRzOiBGdW5jdGlvbjtcbiAgICBwdWJsaWMgd2FpdFRva2VuU3RhdHM6IFByb21pc2U8YW55PiA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0VG9rZW5TdGF0cyA9IHJlc29sdmU7XG4gICAgfSk7XG5cbiAgICBwcml2YXRlIHNldE1hcmtldFN1bW1hcnk6IEZ1bmN0aW9uO1xuICAgIHB1YmxpYyB3YWl0TWFya2V0U3VtbWFyeTogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRNYXJrZXRTdW1tYXJ5ID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIHByaXZhdGUgc2V0VG9rZW5TdW1tYXJ5OiBGdW5jdGlvbjtcbiAgICBwdWJsaWMgd2FpdFRva2VuU3VtbWFyeTogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRUb2tlblN1bW1hcnkgPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgcHJpdmF0ZSBzZXRUb2tlbnNMb2FkZWQ6IEZ1bmN0aW9uO1xuICAgIHB1YmxpYyB3YWl0VG9rZW5zTG9hZGVkOiBQcm9taXNlPGFueT4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0aGlzLnNldFRva2Vuc0xvYWRlZCA9IHJlc29sdmU7XG4gICAgfSk7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgc2NhdHRlcjogVmFwYWVlU2NhdHRlcixcbiAgICAgICAgcHJpdmF0ZSBjb29raWVzOiBDb29raWVTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIGRhdGVQaXBlOiBEYXRlUGlwZVxuICAgICkge1xuICAgICAgICB0aGlzLl9tYXJrZXRzID0ge307XG4gICAgICAgIHRoaXMuX3JldmVyc2UgPSB7fTtcbiAgICAgICAgdGhpcy5hY3Rpdml0eSA9IHt0b3RhbDowLCBldmVudHM6e30sIGxpc3Q6W119O1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLmRlZmF1bHQ7XG4gICAgICAgIHRoaXMuY29udHJhY3RfbmFtZSA9IHRoaXMudmFwYWVldG9rZW5zO1xuICAgICAgICB0aGlzLmNvbnRyYWN0ID0gdGhpcy5zY2F0dGVyLmdldFNtYXJ0Q29udHJhY3QodGhpcy5jb250cmFjdF9uYW1lKTtcbiAgICAgICAgdGhpcy5mZWVkID0gbmV3IEZlZWRiYWNrKCk7XG4gICAgICAgIHRoaXMuc2NhdHRlci5vbkxvZ2dnZWRTdGF0ZUNoYW5nZS5zdWJzY3JpYmUodGhpcy5vbkxvZ2dlZENoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy51cGRhdGVMb2dTdGF0ZSgpO1xuICAgICAgICB0aGlzLmZldGNoVG9rZW5zKCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgIHRoaXMudG9rZW5zID0gZGF0YS50b2tlbnM7XG4gICAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbkRFWCh7XG4gICAgICAgICAgICAgICAgYXBwbmFtZTogXCJWaWl0YXNwaGVyZVwiLFxuICAgICAgICAgICAgICAgIGNvbnRyYWN0OiBcInZpaXRhc3BoZXJlMVwiLFxuICAgICAgICAgICAgICAgIGxvZ286IFwiL2Fzc2V0cy9sb2dvcy92aWl0YXNwaGVyZS5wbmdcIixcbiAgICAgICAgICAgICAgICBsb2dvbGc6IFwiL2Fzc2V0cy9sb2dvcy92aWl0YXNwaGVyZS1sZy5wbmdcIixcbiAgICAgICAgICAgICAgICBwcmVjaXNpb246IDQsXG4gICAgICAgICAgICAgICAgc2NvcGU6IFwidmlpdGN0LnRsb3NcIixcbiAgICAgICAgICAgICAgICBzeW1ib2w6IFwiVklJVEFcIixcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgd2Vic2l0ZTogXCJodHRwczovL3ZpaXRhc3BoZXJlLmNvbVwiXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbkRFWCh7XG4gICAgICAgICAgICAgICAgYXBwbmFtZTogXCJWaWl0YXNwaGVyZVwiLFxuICAgICAgICAgICAgICAgIGNvbnRyYWN0OiBcInZpaXRhc3BoZXJlMVwiLFxuICAgICAgICAgICAgICAgIGxvZ286IFwiL2Fzc2V0cy9sb2dvcy92aWl0YXNwaGVyZS5wbmdcIixcbiAgICAgICAgICAgICAgICBsb2dvbGc6IFwiL2Fzc2V0cy9sb2dvcy92aWl0YXNwaGVyZS1sZy5wbmdcIixcbiAgICAgICAgICAgICAgICBwcmVjaXNpb246IDAsXG4gICAgICAgICAgICAgICAgc2NvcGU6IFwidmlpdGN0LnRsb3NcIixcbiAgICAgICAgICAgICAgICBzeW1ib2w6IFwiVklJQ1RcIixcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgd2Vic2l0ZTogXCJodHRwczovL3ZpaXRhc3BoZXJlLmNvbVwiXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB0aGlzLnplcm9fdGVsb3MgPSBuZXcgQXNzZXRERVgoXCIwLjAwMDAgVExPU1wiLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VG9rZW5zTG9hZGVkKCk7XG4gICAgICAgICAgICB0aGlzLmZldGNoVG9rZW5zU3RhdHMoKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0T3JkZXJTdW1tYXJ5KCk7XG4gICAgICAgICAgICB0aGlzLmdldEFsbFRhYmxlc1N1bWFyaWVzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKF8gPT4ge1xuICAgICAgICAvLyB9KVxuXG5cbiAgICAgICAgdmFyIHRpbWVyO1xuICAgICAgICB0aGlzLm9uTWFya2V0U3VtbWFyeS5zdWJzY3JpYmUoc3VtbWFyeSA9PiB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVG9rZW5zU3VtbWFyeSgpO1xuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgfSk7ICAgIFxuXG5cblxuICAgIH1cblxuICAgIC8vIGdldHRlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBkZWZhdWx0KCk6IEFjY291bnQge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLmRlZmF1bHQ7XG4gICAgfVxuXG4gICAgZ2V0IGxvZ2dlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NhdHRlci5sb2dnZWQgJiYgIXRoaXMuc2NhdHRlci5hY2NvdW50KSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIldBUk5JTkchISFcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnNjYXR0ZXIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5zY2F0dGVyLnVzZXJuYW1lKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCIqKioqKioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgKi9cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLmxvZ2dlZCA/XG4gICAgICAgICAgICAodGhpcy5zY2F0dGVyLmFjY291bnQgPyB0aGlzLnNjYXR0ZXIuYWNjb3VudC5uYW1lIDogdGhpcy5zY2F0dGVyLmRlZmF1bHQubmFtZSkgOlxuICAgICAgICAgICAgbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgYWNjb3VudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhdHRlci5sb2dnZWQgPyBcbiAgICAgICAgdGhpcy5zY2F0dGVyLmFjY291bnQgOlxuICAgICAgICB0aGlzLnNjYXR0ZXIuZGVmYXVsdDtcbiAgICB9XG5cbiAgICAvLyAtLSBVc2VyIExvZyBTdGF0ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsb2dpbigpIHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dpblwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2ctc3RhdGVcIiwgdHJ1ZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmxvZ2luKCkgdGhpcy5mZWVkLmxvYWRpbmcoJ2xvZy1zdGF0ZScpXCIsIHRoaXMuZmVlZC5sb2FkaW5nKCdsb2ctc3RhdGUnKSk7XG4gICAgICAgIHRoaXMubG9nb3V0KCk7XG4gICAgICAgIHRoaXMudXBkYXRlTG9nU3RhdGUoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgubG9naW4oKSB0aGlzLmZlZWQubG9hZGluZygnbG9nLXN0YXRlJylcIiwgdGhpcy5mZWVkLmxvYWRpbmcoJ2xvZy1zdGF0ZScpKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dvdXRcIiwgZmFsc2UpO1xuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLmxvZ2luKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxvZ1N0YXRlKCk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ2luXCIsIGZhbHNlKTtcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ2luXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dvdXRcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc2NhdHRlci5sb2dvdXQoKTtcbiAgICB9XG5cbiAgICBvbkxvZ291dCgpIHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dvdXRcIiwgZmFsc2UpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5vbkxvZ291dCgpXCIpO1xuICAgICAgICB0aGlzLnJlc2V0Q3VycmVudEFjY291bnQodGhpcy5kZWZhdWx0Lm5hbWUpO1xuICAgICAgICB0aGlzLnVwZGF0ZUxvZ1N0YXRlKCk7XG4gICAgICAgIHRoaXMub25Mb2dnZWRBY2NvdW50Q2hhbmdlLm5leHQodGhpcy5sb2dnZWQpO1xuICAgICAgICB0aGlzLmNvb2tpZXMuZGVsZXRlKFwibG9naW5cIik7XG4gICAgICAgIHNldFRpbWVvdXQoXyAgPT4geyB0aGlzLmxhc3RfbG9nZ2VkID0gdGhpcy5sb2dnZWQ7IH0sIDQwMCk7XG4gICAgfVxuICAgIFxuICAgIG9uTG9naW4obmFtZTpzdHJpbmcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgub25Mb2dpbigpXCIsIG5hbWUpO1xuICAgICAgICB0aGlzLnJlc2V0Q3VycmVudEFjY291bnQobmFtZSk7XG4gICAgICAgIHRoaXMuZ2V0RGVwb3NpdHMoKTtcbiAgICAgICAgdGhpcy5nZXRCYWxhbmNlcygpO1xuICAgICAgICB0aGlzLnVwZGF0ZUxvZ1N0YXRlKCk7XG4gICAgICAgIHRoaXMuZ2V0VXNlck9yZGVycygpO1xuICAgICAgICB0aGlzLm9uTG9nZ2VkQWNjb3VudENoYW5nZS5uZXh0KHRoaXMubG9nZ2VkKTtcbiAgICAgICAgdGhpcy5sYXN0X2xvZ2dlZCA9IHRoaXMubG9nZ2VkO1xuICAgICAgICB0aGlzLmNvb2tpZXMuc2V0KFwibG9naW5cIiwgdGhpcy5sb2dnZWQpO1xuICAgIH1cblxuICAgIG9uTG9nZ2VkQ2hhbmdlKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5vbkxvZ2dlZENoYW5nZSgpXCIpO1xuICAgICAgICBpZiAodGhpcy5zY2F0dGVyLmxvZ2dlZCkge1xuICAgICAgICAgICAgdGhpcy5vbkxvZ2luKHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vbkxvZ291dCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgcmVzZXRDdXJyZW50QWNjb3VudChwcm9maWxlOnN0cmluZykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5yZXNldEN1cnJlbnRBY2NvdW50KClcIiwgdGhpcy5jdXJyZW50Lm5hbWUsIFwiLT5cIiwgcHJvZmlsZSk7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnQubmFtZSAhPSBwcm9maWxlICYmICh0aGlzLmN1cnJlbnQubmFtZSA9PSB0aGlzLmxhc3RfbG9nZ2VkIHx8IHByb2ZpbGUgIT0gXCJndWVzdFwiKSkge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJhY2NvdW50XCIsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5kZWZhdWx0O1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Lm5hbWUgPSBwcm9maWxlO1xuICAgICAgICAgICAgaWYgKHByb2ZpbGUgIT0gXCJndWVzdFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50LmRhdGEgPSBhd2FpdCB0aGlzLmdldEFjY291bnREYXRhKHRoaXMuY3VycmVudC5uYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJXQVJOSU5HISEhIGN1cnJlbnQgaXMgZ3Vlc3RcIiwgW3Byb2ZpbGUsIHRoaXMuYWNjb3VudCwgdGhpcy5jdXJyZW50XSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGhpcy5zY29wZXMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuYmFsYW5jZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMudXNlcm9yZGVycyA9IHt9OyAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLm9uQ3VycmVudEFjY291bnRDaGFuZ2UubmV4dCh0aGlzLmN1cnJlbnQubmFtZSkgISEhISEhXCIpO1xuICAgICAgICAgICAgdGhpcy5vbkN1cnJlbnRBY2NvdW50Q2hhbmdlLm5leHQodGhpcy5jdXJyZW50Lm5hbWUpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50VXNlcigpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJhY2NvdW50XCIsIGZhbHNlKTtcbiAgICAgICAgfSAgICAgICBcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUxvZ1N0YXRlKCkge1xuICAgICAgICB0aGlzLmxvZ2luU3RhdGUgPSBcIm5vLXNjYXR0ZXJcIjtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2ctc3RhdGVcIiwgdHJ1ZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnVwZGF0ZUxvZ1N0YXRlKCkgXCIsIHRoaXMubG9naW5TdGF0ZSwgdGhpcy5mZWVkLmxvYWRpbmcoXCJsb2ctc3RhdGVcIikpO1xuICAgICAgICB0aGlzLnNjYXR0ZXIud2FpdENvbm5lY3RlZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9naW5TdGF0ZSA9IFwibm8tbG9nZ2VkXCI7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC51cGRhdGVMb2dTdGF0ZSgpICAgXCIsIHRoaXMubG9naW5TdGF0ZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5zY2F0dGVyLmxvZ2dlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9naW5TdGF0ZSA9IFwiYWNjb3VudC1va1wiO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnVwZGF0ZUxvZ1N0YXRlKCkgICAgIFwiLCB0aGlzLmxvZ2luU3RhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2ctc3RhdGVcIiwgZmFsc2UpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgudXBkYXRlTG9nU3RhdGUoKSBcIiwgdGhpcy5sb2dpblN0YXRlLCB0aGlzLmZlZWQubG9hZGluZyhcImxvZy1zdGF0ZVwiKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciB0aW1lcjI7XG4gICAgICAgIHZhciB0aW1lcjEgPSBzZXRJbnRlcnZhbChfID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zY2F0dGVyLmZlZWQubG9hZGluZyhcImNvbm5lY3RcIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZy1zdGF0ZVwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcjEpO1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMjAwKTtcblxuICAgICAgICB0aW1lcjIgPSBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcjEpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2ctc3RhdGVcIiwgZmFsc2UpO1xuICAgICAgICB9LCA2MDAwKTtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRBY2NvdW50RGF0YShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPEFjY291bnREYXRhPiAge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLnF1ZXJ5QWNjb3VudERhdGEobmFtZSkuY2F0Y2goYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWZhdWx0LmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFjdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjcmVhdGVPcmRlcih0eXBlOnN0cmluZywgYW1vdW50OkFzc2V0REVYLCBwcmljZTpBc3NldERFWCkge1xuICAgICAgICAvLyBcImFsaWNlXCIsIFwiYnV5XCIsIFwiMi41MDAwMDAwMCBDTlRcIiwgXCIwLjQwMDAwMDAwIFRMT1NcIlxuICAgICAgICAvLyBuYW1lIG93bmVyLCBuYW1lIHR5cGUsIGNvbnN0IGFzc2V0ICYgdG90YWwsIGNvbnN0IGFzc2V0ICYgcHJpY2VcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJvcmRlci1cIit0eXBlLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZXhjZWN1dGUoXCJvcmRlclwiLCB7XG4gICAgICAgICAgICBvd25lcjogIHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgdG90YWw6IGFtb3VudC50b1N0cmluZyg4KSxcbiAgICAgICAgICAgIHByaWNlOiBwcmljZS50b1N0cmluZyg4KVxuICAgICAgICB9KS50aGVuKGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRyYWRlKGFtb3VudC50b2tlbiwgcHJpY2UudG9rZW4pO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJvcmRlci1cIit0eXBlLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwib3JkZXItXCIrdHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNhbmNlbE9yZGVyKHR5cGU6c3RyaW5nLCBjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgsIG9yZGVyczpudW1iZXJbXSkge1xuICAgICAgICAvLyAnW1wiYWxpY2VcIiwgXCJidXlcIiwgXCJDTlRcIiwgXCJUTE9TXCIsIFsxLDBdXSdcbiAgICAgICAgLy8gbmFtZSBvd25lciwgbmFtZSB0eXBlLCBjb25zdCBhc3NldCAmIHRvdGFsLCBjb25zdCBhc3NldCAmIHByaWNlXG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY2FuY2VsLVwiK3R5cGUsIHRydWUpO1xuICAgICAgICBmb3IgKHZhciBpIGluIG9yZGVycykgeyB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImNhbmNlbC1cIit0eXBlK1wiLVwiK29yZGVyc1tpXSwgdHJ1ZSk7IH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZXhjZWN1dGUoXCJjYW5jZWxcIiwge1xuICAgICAgICAgICAgb3duZXI6ICB0aGlzLnNjYXR0ZXIuYWNjb3VudC5uYW1lLFxuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIGNvbW9kaXR5OiBjb21vZGl0eS5zeW1ib2wsXG4gICAgICAgICAgICBjdXJyZW5jeTogY3VycmVuY3kuc3ltYm9sLFxuICAgICAgICAgICAgb3JkZXJzOiBvcmRlcnNcbiAgICAgICAgfSkudGhlbihhc3luYyByZXN1bHQgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUcmFkZShjb21vZGl0eSwgY3VycmVuY3kpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBvcmRlcnMpIHsgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZStcIi1cIitvcmRlcnNbaV0sIGZhbHNlKTsgfSAgICBcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBvcmRlcnMpIHsgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZStcIi1cIitvcmRlcnNbaV0sIGZhbHNlKTsgfSAgICBcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXBvc2l0KHF1YW50aXR5OkFzc2V0REVYKSB7XG4gICAgICAgIC8vIG5hbWUgb3duZXIsIG5hbWUgdHlwZSwgY29uc3QgYXNzZXQgJiB0b3RhbCwgY29uc3QgYXNzZXQgJiBwcmljZVxuICAgICAgICB2YXIgY29udHJhY3QgPSB0aGlzLnNjYXR0ZXIuZ2V0U21hcnRDb250cmFjdChxdWFudGl0eS50b2tlbi5jb250cmFjdCk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRFcnJvcihcImRlcG9zaXRcIiwgbnVsbCk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdFwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0LVwiK3F1YW50aXR5LnRva2VuLnN5bWJvbC50b0xvd2VyQ2FzZSgpLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIGNvbnRyYWN0LmV4Y2VjdXRlKFwidHJhbnNmZXJcIiwge1xuICAgICAgICAgICAgZnJvbTogIHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICB0bzogdGhpcy52YXBhZWV0b2tlbnMsXG4gICAgICAgICAgICBxdWFudGl0eTogcXVhbnRpdHkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIG1lbW86IFwiZGVwb3NpdFwiXG4gICAgICAgIH0pLnRoZW4oYXN5bmMgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdFwiLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImRlcG9zaXQtXCIrcXVhbnRpdHkudG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCksIGZhbHNlKTsgICAgXG4gICAgICAgICAgICAvKmF3YWl0Ki8gdGhpcy5nZXREZXBvc2l0cygpO1xuICAgICAgICAgICAgLyphd2FpdCovIHRoaXMuZ2V0QmFsYW5jZXMoKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdC1cIitxdWFudGl0eS50b2tlbi5zeW1ib2wudG9Mb3dlckNhc2UoKSwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldEVycm9yKFwiZGVwb3NpdFwiLCB0eXBlb2YgZSA9PSBcInN0cmluZ1wiID8gZSA6IEpTT04uc3RyaW5naWZ5KGUsbnVsbCw0KSk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSk7XG4gICAgfSAgICBcblxuICAgIHdpdGhkcmF3KHF1YW50aXR5OkFzc2V0REVYKSB7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRFcnJvcihcIndpdGhkcmF3XCIsIG51bGwpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3XCIsIHRydWUpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3LVwiK3F1YW50aXR5LnRva2VuLnN5bWJvbC50b0xvd2VyQ2FzZSgpLCB0cnVlKTsgICBcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZXhjZWN1dGUoXCJ3aXRoZHJhd1wiLCB7XG4gICAgICAgICAgICBvd25lcjogIHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICBxdWFudGl0eTogcXVhbnRpdHkudG9TdHJpbmcoKVxuICAgICAgICB9KS50aGVuKGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwid2l0aGRyYXctXCIrcXVhbnRpdHkudG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCksIGZhbHNlKTtcbiAgICAgICAgICAgIC8qYXdhaXQqLyB0aGlzLmdldERlcG9zaXRzKCk7XG4gICAgICAgICAgICAvKmF3YWl0Ki8gdGhpcy5nZXRCYWxhbmNlcygpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwid2l0aGRyYXctXCIrcXVhbnRpdHkudG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCksIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRFcnJvcihcIndpdGhkcmF3XCIsIHR5cGVvZiBlID09IFwic3RyaW5nXCIgPyBlIDogSlNPTi5zdHJpbmdpZnkoZSxudWxsLDQpKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFRva2VucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGFkZE9mZkNoYWluVG9rZW4ob2ZmY2hhaW46IFRva2VuREVYKSB7XG4gICAgICAgIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKF8gPT4ge1xuICAgICAgICAgICAgdGhpcy50b2tlbnMucHVzaChuZXcgVG9rZW5ERVgoe1xuICAgICAgICAgICAgICAgIHN5bWJvbDogb2ZmY2hhaW4uc3ltYm9sLFxuICAgICAgICAgICAgICAgIHByZWNpc2lvbjogb2ZmY2hhaW4ucHJlY2lzaW9uIHx8IDQsXG4gICAgICAgICAgICAgICAgY29udHJhY3Q6IFwibm9jb250cmFjdFwiLFxuICAgICAgICAgICAgICAgIGFwcG5hbWU6IG9mZmNoYWluLmFwcG5hbWUsXG4gICAgICAgICAgICAgICAgd2Vic2l0ZTogXCJcIixcbiAgICAgICAgICAgICAgICBsb2dvOlwiXCIsXG4gICAgICAgICAgICAgICAgbG9nb2xnOiBcIlwiLFxuICAgICAgICAgICAgICAgIHNjb3BlOiBcIlwiLFxuICAgICAgICAgICAgICAgIHN0YXQ6IG51bGwsXG4gICAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG9mZmNoYWluOiB0cnVlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTY29wZXMgLyBUYWJsZXMgXG4gICAgcHVibGljIGhhc1Njb3BlcygpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fbWFya2V0cztcbiAgICB9XG5cbiAgICBwdWJsaWMgbWFya2V0KHNjb3BlOnN0cmluZyk6IE1hcmtldCB7XG4gICAgICAgIGlmICh0aGlzLl9tYXJrZXRzW3Njb3BlXSkgcmV0dXJuIHRoaXMuX21hcmtldHNbc2NvcGVdOyAgICAgICAgLy8gLS0tPiBkaXJlY3RcbiAgICAgICAgdmFyIHJldmVyc2UgPSB0aGlzLmludmVyc2VTY29wZShzY29wZSk7XG4gICAgICAgIGlmICh0aGlzLl9yZXZlcnNlW3JldmVyc2VdKSByZXR1cm4gdGhpcy5fcmV2ZXJzZVtyZXZlcnNlXTsgIC8vIC0tLT4gcmV2ZXJzZVxuICAgICAgICBpZiAoIXRoaXMuX21hcmtldHNbcmV2ZXJzZV0pIHJldHVybiBudWxsOyAgICAgICAgICAgICAgICAgICAgLy8gLS0tPiB0YWJsZSBkb2VzIG5vdCBleGlzdCAob3IgaGFzIG5vdCBiZWVuIGxvYWRlZCB5ZXQpXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXJrZXRzW3Njb3BlXSB8fCB0aGlzLnJldmVyc2Uoc2NvcGUpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0YWJsZShzY29wZTpzdHJpbmcpOiBNYXJrZXQge1xuICAgICAgICAvL2NvbnNvbGUuZXJyb3IoXCJ0YWJsZShcIitzY29wZStcIikgREVQUkVDQVRFRFwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFya2V0KHNjb3BlKTtcbiAgICB9ICAgIFxuXG4gICAgcHJpdmF0ZSByZXZlcnNlKHNjb3BlOnN0cmluZyk6IE1hcmtldCB7XG4gICAgICAgIHZhciBjYW5vbmljYWwgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgdmFyIHJldmVyc2Vfc2NvcGUgPSB0aGlzLmludmVyc2VTY29wZShjYW5vbmljYWwpO1xuICAgICAgICBjb25zb2xlLmFzc2VydChjYW5vbmljYWwgIT0gcmV2ZXJzZV9zY29wZSwgXCJFUlJPUjogXCIsIGNhbm9uaWNhbCwgcmV2ZXJzZV9zY29wZSk7XG4gICAgICAgIHZhciByZXZlcnNlX3RhYmxlOk1hcmtldCA9IHRoaXMuX3JldmVyc2VbcmV2ZXJzZV9zY29wZV07XG4gICAgICAgIGlmICghcmV2ZXJzZV90YWJsZSAmJiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0pIHtcbiAgICAgICAgICAgIHRoaXMuX3JldmVyc2VbcmV2ZXJzZV9zY29wZV0gPSB0aGlzLmNyZWF0ZVJldmVyc2VUYWJsZUZvcihyZXZlcnNlX3Njb3BlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fcmV2ZXJzZVtyZXZlcnNlX3Njb3BlXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWFya2V0Rm9yKGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCk6IE1hcmtldCB7XG4gICAgICAgIHZhciBzY29wZSA9IHRoaXMuZ2V0U2NvcGVGb3IoY29tb2RpdHksIGN1cnJlbmN5KTtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFibGUoc2NvcGUpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0YWJsZUZvcihjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgpOiBNYXJrZXQge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwidGFibGVGb3IoKVwiLGNvbW9kaXR5LnN5bWJvbCxjdXJyZW5jeS5zeW1ib2wsXCIgREVQUkVDQVRFRFwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFya2V0Rm9yKGNvbW9kaXR5LCBjdXJyZW5jeSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZVJldmVyc2VUYWJsZUZvcihzY29wZTpzdHJpbmcpOiBNYXJrZXQge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiLCBzY29wZSk7XG4gICAgICAgIHZhciBjYW5vbmljYWwgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgdmFyIHJldmVyc2Vfc2NvcGUgPSB0aGlzLmludmVyc2VTY29wZShjYW5vbmljYWwpO1xuICAgICAgICB2YXIgdGFibGU6TWFya2V0ID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdO1xuXG4gICAgICAgIHZhciBpbnZlcnNlX2hpc3Rvcnk6SGlzdG9yeVR4W10gPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpIGluIHRhYmxlLmhpc3RvcnkpIHtcbiAgICAgICAgICAgIHZhciBoVHg6SGlzdG9yeVR4ID0ge1xuICAgICAgICAgICAgICAgIGlkOiB0YWJsZS5oaXN0b3J5W2ldLmlkLFxuICAgICAgICAgICAgICAgIHN0cjogXCJcIixcbiAgICAgICAgICAgICAgICBwcmljZTogdGFibGUuaGlzdG9yeVtpXS5pbnZlcnNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgaW52ZXJzZTogdGFibGUuaGlzdG9yeVtpXS5wcmljZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgIGFtb3VudDogdGFibGUuaGlzdG9yeVtpXS5wYXltZW50LmNsb25lKCksXG4gICAgICAgICAgICAgICAgcGF5bWVudDogdGFibGUuaGlzdG9yeVtpXS5hbW91bnQuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICBidXllcjogdGFibGUuaGlzdG9yeVtpXS5zZWxsZXIsXG4gICAgICAgICAgICAgICAgc2VsbGVyOiB0YWJsZS5oaXN0b3J5W2ldLmJ1eWVyLFxuICAgICAgICAgICAgICAgIGJ1eWZlZTogdGFibGUuaGlzdG9yeVtpXS5zZWxsZmVlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgc2VsbGZlZTogdGFibGUuaGlzdG9yeVtpXS5idXlmZWUuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICBkYXRlOiB0YWJsZS5oaXN0b3J5W2ldLmRhdGUsXG4gICAgICAgICAgICAgICAgaXNidXk6ICF0YWJsZS5oaXN0b3J5W2ldLmlzYnV5LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGhUeC5zdHIgPSBoVHgucHJpY2Uuc3RyICsgXCIgXCIgKyBoVHguYW1vdW50LnN0cjtcbiAgICAgICAgICAgIGludmVyc2VfaGlzdG9yeS5wdXNoKGhUeCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgXG4gICAgICAgIHZhciBpbnZlcnNlX29yZGVyczpUb2tlbk9yZGVycyA9IHtcbiAgICAgICAgICAgIGJ1eTogW10sIHNlbGw6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yICh2YXIgdHlwZSBpbiB7YnV5OlwiYnV5XCIsIHNlbGw6XCJzZWxsXCJ9KSB7XG4gICAgICAgICAgICB2YXIgcm93X29yZGVyczpPcmRlcltdO1xuICAgICAgICAgICAgdmFyIHJvd19vcmRlcjpPcmRlcjtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0YWJsZS5vcmRlcnNbdHlwZV0pIHtcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gdGFibGUub3JkZXJzW3R5cGVdW2ldO1xuXG4gICAgICAgICAgICAgICAgcm93X29yZGVycyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGo9MDsgajxyb3cub3JkZXJzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd19vcmRlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcG9zaXQ6IHJvdy5vcmRlcnNbal0uZGVwb3NpdC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJvdy5vcmRlcnNbal0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiByb3cub3JkZXJzW2pdLnByaWNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogcm93Lm9yZGVyc1tqXS5pbnZlcnNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcjogcm93Lm9yZGVyc1tqXS5vd25lcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbG9zOiByb3cub3JkZXJzW2pdLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IHJvdy5vcmRlcnNbal0udGVsb3NcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByb3dfb3JkZXJzLnB1c2gocm93X29yZGVyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgbmV3cm93Ok9yZGVyUm93ID0ge1xuICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiByb3cucHJpY2UuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiByb3dfb3JkZXJzLFxuICAgICAgICAgICAgICAgICAgICBvd25lcnM6IHJvdy5vd25lcnMsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlOiByb3cuaW52ZXJzZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICBzdHI6IHJvdy5pbnZlcnNlLnN0cixcbiAgICAgICAgICAgICAgICAgICAgc3VtOiByb3cuc3VtdGVsb3MuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgc3VtdGVsb3M6IHJvdy5zdW0uY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgdGVsb3M6IHJvdy50b3RhbC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogcm93LnRlbG9zLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgIC8vIGFtb3VudDogcm93LnN1bXRlbG9zLnRvdGFsKCksIC8vIDwtLSBleHRyYVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaW52ZXJzZV9vcmRlcnNbdHlwZV0ucHVzaChuZXdyb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJldmVyc2U6TWFya2V0ID0ge1xuICAgICAgICAgICAgc2NvcGU6IHJldmVyc2Vfc2NvcGUsXG4gICAgICAgICAgICBjb21vZGl0eTogdGFibGUuY3VycmVuY3ksXG4gICAgICAgICAgICBjdXJyZW5jeTogdGFibGUuY29tb2RpdHksXG4gICAgICAgICAgICBibG9jazogdGFibGUuYmxvY2ssXG4gICAgICAgICAgICBibG9ja2xpc3Q6IHRhYmxlLnJldmVyc2VibG9ja3MsXG4gICAgICAgICAgICByZXZlcnNlYmxvY2tzOiB0YWJsZS5ibG9ja2xpc3QsXG4gICAgICAgICAgICBibG9ja2xldmVsczogdGFibGUucmV2ZXJzZWxldmVscyxcbiAgICAgICAgICAgIHJldmVyc2VsZXZlbHM6IHRhYmxlLmJsb2NrbGV2ZWxzLFxuICAgICAgICAgICAgYmxvY2tzOiB0YWJsZS5ibG9ja3MsXG4gICAgICAgICAgICBkZWFsczogdGFibGUuZGVhbHMsXG4gICAgICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgICAgICBzZWxsOiB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOnRhYmxlLmhlYWRlci5idXkudG90YWwuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOnRhYmxlLmhlYWRlci5idXkub3JkZXJzXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBidXk6IHtcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6dGFibGUuaGVhZGVyLnNlbGwudG90YWwuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOnRhYmxlLmhlYWRlci5zZWxsLm9yZGVyc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoaXN0b3J5OiBpbnZlcnNlX2hpc3RvcnksXG4gICAgICAgICAgICBvcmRlcnM6IHtcbiAgICAgICAgICAgICAgICBzZWxsOiBpbnZlcnNlX29yZGVycy5idXksICAvLyA8PC0tIGVzdG8gZnVuY2lvbmEgYXPDrSBjb21vIGVzdMOhP1xuICAgICAgICAgICAgICAgIGJ1eTogaW52ZXJzZV9vcmRlcnMuc2VsbCAgIC8vIDw8LS0gZXN0byBmdW5jaW9uYSBhc8OtIGNvbW8gZXN0w6E/XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VtbWFyeToge1xuICAgICAgICAgICAgICAgIHNjb3BlOiB0aGlzLmludmVyc2VTY29wZSh0YWJsZS5zdW1tYXJ5LnNjb3BlKSxcbiAgICAgICAgICAgICAgICBwcmljZTogdGFibGUuc3VtbWFyeS5pbnZlcnNlLFxuICAgICAgICAgICAgICAgIHByaWNlXzI0aF9hZ286IHRhYmxlLnN1bW1hcnkuaW52ZXJzZV8yNGhfYWdvLFxuICAgICAgICAgICAgICAgIGludmVyc2U6IHRhYmxlLnN1bW1hcnkucHJpY2UsXG4gICAgICAgICAgICAgICAgaW52ZXJzZV8yNGhfYWdvOiB0YWJsZS5zdW1tYXJ5LnByaWNlXzI0aF9hZ28sXG4gICAgICAgICAgICAgICAgbWF4X2ludmVyc2U6IHRhYmxlLnN1bW1hcnkubWF4X3ByaWNlLFxuICAgICAgICAgICAgICAgIG1heF9wcmljZTogdGFibGUuc3VtbWFyeS5tYXhfaW52ZXJzZSxcbiAgICAgICAgICAgICAgICBtaW5faW52ZXJzZTogdGFibGUuc3VtbWFyeS5taW5fcHJpY2UsXG4gICAgICAgICAgICAgICAgbWluX3ByaWNlOiB0YWJsZS5zdW1tYXJ5Lm1pbl9pbnZlcnNlLFxuICAgICAgICAgICAgICAgIHJlY29yZHM6IHRhYmxlLnN1bW1hcnkucmVjb3JkcyxcbiAgICAgICAgICAgICAgICB2b2x1bWU6IHRhYmxlLnN1bW1hcnkuYW1vdW50LFxuICAgICAgICAgICAgICAgIGFtb3VudDogdGFibGUuc3VtbWFyeS52b2x1bWUsXG4gICAgICAgICAgICAgICAgcGVyY2VudDogdGFibGUuc3VtbWFyeS5pcGVyY2VudCxcbiAgICAgICAgICAgICAgICBpcGVyY2VudDogdGFibGUuc3VtbWFyeS5wZXJjZW50LFxuICAgICAgICAgICAgICAgIHBlcmNlbnRfc3RyOiB0YWJsZS5zdW1tYXJ5LmlwZXJjZW50X3N0cixcbiAgICAgICAgICAgICAgICBpcGVyY2VudF9zdHI6IHRhYmxlLnN1bW1hcnkucGVyY2VudF9zdHIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHg6IHRhYmxlLnR4XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldmVyc2U7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFNjb3BlRm9yKGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCkge1xuICAgICAgICBpZiAoIWNvbW9kaXR5IHx8ICFjdXJyZW5jeSkgcmV0dXJuIFwiXCI7XG4gICAgICAgIHJldHVybiBjb21vZGl0eS5zeW1ib2wudG9Mb3dlckNhc2UoKSArIFwiLlwiICsgY3VycmVuY3kuc3ltYm9sLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGludmVyc2VTY29wZShzY29wZTpzdHJpbmcpIHtcbiAgICAgICAgaWYgKCFzY29wZSkgcmV0dXJuIHNjb3BlO1xuICAgICAgICBjb25zb2xlLmFzc2VydCh0eXBlb2Ygc2NvcGUgPT1cInN0cmluZ1wiLCBcIkVSUk9SOiBzdHJpbmcgc2NvcGUgZXhwZWN0ZWQsIGdvdCBcIiwgdHlwZW9mIHNjb3BlLCBzY29wZSk7XG4gICAgICAgIHZhciBwYXJ0cyA9IHNjb3BlLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQocGFydHMubGVuZ3RoID09IDIsIFwiRVJST1I6IHNjb3BlIGZvcm1hdCBleHBlY3RlZCBpcyB4eHgueXl5LCBnb3Q6IFwiLCB0eXBlb2Ygc2NvcGUsIHNjb3BlKTtcbiAgICAgICAgdmFyIGludmVyc2UgPSBwYXJ0c1sxXSArIFwiLlwiICsgcGFydHNbMF07XG4gICAgICAgIHJldHVybiBpbnZlcnNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBjYW5vbmljYWxTY29wZShzY29wZTpzdHJpbmcpIHtcbiAgICAgICAgaWYgKCFzY29wZSkgcmV0dXJuIHNjb3BlO1xuICAgICAgICBjb25zb2xlLmFzc2VydCh0eXBlb2Ygc2NvcGUgPT1cInN0cmluZ1wiLCBcIkVSUk9SOiBzdHJpbmcgc2NvcGUgZXhwZWN0ZWQsIGdvdCBcIiwgdHlwZW9mIHNjb3BlLCBzY29wZSk7XG4gICAgICAgIHZhciBwYXJ0cyA9IHNjb3BlLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQocGFydHMubGVuZ3RoID09IDIsIFwiRVJST1I6IHNjb3BlIGZvcm1hdCBleHBlY3RlZCBpcyB4eHgueXl5LCBnb3Q6IFwiLCB0eXBlb2Ygc2NvcGUsIHNjb3BlKTtcbiAgICAgICAgdmFyIGludmVyc2UgPSBwYXJ0c1sxXSArIFwiLlwiICsgcGFydHNbMF07XG4gICAgICAgIGlmIChwYXJ0c1sxXSA9PSBcInRsb3NcIikge1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJ0c1swXSA9PSBcInRsb3NcIikge1xuICAgICAgICAgICAgcmV0dXJuIGludmVyc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcnRzWzBdIDwgcGFydHNbMV0pIHtcbiAgICAgICAgICAgIHJldHVybiBzY29wZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbnZlcnNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuXG4gICAgcHVibGljIGlzQ2Fub25pY2FsKHNjb3BlOnN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSkgPT0gc2NvcGU7XG4gICAgfVxuXG4gICAgXG4gICAgXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBHZXR0ZXJzIFxuXG4gICAgZ2V0QmFsYW5jZSh0b2tlbjpUb2tlbkRFWCkge1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuYmFsYW5jZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJhbGFuY2VzW2ldLnRva2VuLnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5iYWxhbmNlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEFzc2V0REVYKFwiMCBcIiArIHRva2VuLnN5bWJvbCwgdGhpcyk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0U29tZUZyZWVGYWtlVG9rZW5zKHN5bWJvbDpzdHJpbmcgPSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldFNvbWVGcmVlRmFrZVRva2VucygpXCIpO1xuICAgICAgICB2YXIgX3Rva2VuID0gc3ltYm9sOyAgICBcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJmcmVlZmFrZS1cIitfdG9rZW4gfHwgXCJ0b2tlblwiLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2VuU3RhdHMudGhlbihfID0+IHtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IG51bGw7XG4gICAgICAgICAgICB2YXIgY291bnRzID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTwxMDA7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChzeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudG9rZW5zW2ldLnN5bWJvbCA9PSBzeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgdmFyIHJhbmRvbSA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaSwgXCJSYW5kb206IFwiLCByYW5kb20pO1xuICAgICAgICAgICAgICAgIGlmICghdG9rZW4gJiYgcmFuZG9tID4gMC41KSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50b2tlbnNbaSAlIHRoaXMudG9rZW5zLmxlbmd0aF07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbi5mYWtlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmRvbSA+IDAuNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50ZWxvcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpPDEwMCAmJiB0b2tlbiAmJiB0aGlzLmdldEJhbGFuY2UodG9rZW4pLmFtb3VudC50b051bWJlcigpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaSwgXCJ0b2tlbjogXCIsIHRva2VuKTtcblxuICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICByYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbW9udG8gPSBNYXRoLmZsb29yKDEwMDAwICogcmFuZG9tKSAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHF1YW50aXR5ID0gbmV3IEFzc2V0REVYKFwiXCIgKyBtb250byArIFwiIFwiICsgdG9rZW4uc3ltYm9sICx0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lbW8gPSBcInlvdSBnZXQgXCIgKyBxdWFudGl0eS52YWx1ZVRvU3RyaW5nKCkrIFwiIGZyZWUgZmFrZSBcIiArIHRva2VuLnN5bWJvbCArIFwiIHRva2VucyB0byBwbGF5IG9uIHZhcGFlZS5pbyBERVhcIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZXhjZWN1dGUoXCJpc3N1ZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0bzogIHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogcXVhbnRpdHkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW86IG1lbW9cbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihfID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0QmFsYW5jZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZnJlZWZha2UtXCIrX3Rva2VuIHx8IFwidG9rZW5cIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1lbW87XG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJmcmVlZmFrZS1cIitfdG9rZW4gfHwgXCJ0b2tlblwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgICAgICB9KTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdldFRva2VuTm93KHN5bTpzdHJpbmcpOiBUb2tlbkRFWCB7XG4gICAgICAgIGlmICghc3ltKSByZXR1cm4gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnRva2Vucykge1xuICAgICAgICAgICAgLy8gdGhlcmUncyBhIGxpdHRsZSBidWcuIFRoaXMgaXMgYSBqdXN0YSAgd29yayBhcnJvdW5kXG4gICAgICAgICAgICBpZiAodGhpcy50b2tlbnNbaV0uc3ltYm9sLnRvVXBwZXJDYXNlKCkgPT0gXCJUTE9TXCIgJiYgdGhpcy50b2tlbnNbaV0ub2ZmY2hhaW4pIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHNvbHZlcyBhdHRhY2hpbmcgd3JvbmcgdGxvcyB0b2tlbiB0byBhc3NldFxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRoaXMudG9rZW5zW2ldLnN5bWJvbC50b1VwcGVyQ2FzZSgpID09IHN5bS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGFzeW5jIGdldFRva2VuKHN5bTpzdHJpbmcpOiBQcm9taXNlPFRva2VuREVYPiB7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihfID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFRva2VuTm93KHN5bSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGdldERlcG9zaXRzKGFjY291bnQ6c3RyaW5nID0gbnVsbCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldERlcG9zaXRzKClcIik7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdHNcIiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciBkZXBvc2l0czogQXNzZXRERVhbXSA9IFtdO1xuICAgICAgICAgICAgaWYgKCFhY2NvdW50ICYmIHRoaXMuY3VycmVudC5uYW1lKSB7XG4gICAgICAgICAgICAgICAgYWNjb3VudCA9IHRoaXMuY3VycmVudC5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFjY291bnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gYXdhaXQgdGhpcy5mZXRjaERlcG9zaXRzKGFjY291bnQpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gcmVzdWx0LnJvd3MpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVwb3NpdHMucHVzaChuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uYW1vdW50LCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kZXBvc2l0cyA9IGRlcG9zaXRzO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0c1wiLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZXBvc2l0cztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QmFsYW5jZXMoYWNjb3VudDpzdHJpbmcgPSBudWxsKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVguZ2V0QmFsYW5jZXMoKVwiKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJiYWxhbmNlc1wiLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIF9iYWxhbmNlczogQXNzZXRERVhbXTtcbiAgICAgICAgICAgIGlmICghYWNjb3VudCAmJiB0aGlzLmN1cnJlbnQubmFtZSkge1xuICAgICAgICAgICAgICAgIGFjY291bnQgPSB0aGlzLmN1cnJlbnQubmFtZTtcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChhY2NvdW50KSB7XG4gICAgICAgICAgICAgICAgX2JhbGFuY2VzID0gYXdhaXQgdGhpcy5mZXRjaEJhbGFuY2VzKGFjY291bnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5iYWxhbmNlcyA9IF9iYWxhbmNlcztcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYIGJhbGFuY2VzIHVwZGF0ZWRcIik7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJhbGFuY2VzXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJhbGFuY2VzO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRUaGlzU2VsbE9yZGVycyh0YWJsZTpzdHJpbmcsIGlkczpudW1iZXJbXSk6IFByb21pc2U8YW55W10+IHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ0aGlzb3JkZXJzXCIsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGlkcykge1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IGlkc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgZ290aXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqIGluIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0W2pdLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnb3RpdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZ290aXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciByZXM6VGFibGVSZXN1bHQgPSBhd2FpdCB0aGlzLmZldGNoT3JkZXJzKHtzY29wZTp0YWJsZSwgbGltaXQ6MSwgbG93ZXJfYm91bmQ6aWQudG9TdHJpbmcoKX0pO1xuXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdChyZXMucm93cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInRoaXNvcmRlcnNcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7ICAgIFxuICAgIH1cblxuICAgIGFzeW5jIGdldFVzZXJPcmRlcnMoYWNjb3VudDpzdHJpbmcgPSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldFVzZXJPcmRlcnMoKVwiKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ1c2Vyb3JkZXJzXCIsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgdXNlcm9yZGVyczogVGFibGVSZXN1bHQ7XG4gICAgICAgICAgICBpZiAoIWFjY291bnQgJiYgdGhpcy5jdXJyZW50Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICBhY2NvdW50ID0gdGhpcy5jdXJyZW50Lm5hbWU7XG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoYWNjb3VudCkge1xuICAgICAgICAgICAgICAgIHVzZXJvcmRlcnMgPSBhd2FpdCB0aGlzLmZldGNoVXNlck9yZGVycyhhY2NvdW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsaXN0OiBVc2VyT3JkZXJzW10gPSA8VXNlck9yZGVyc1tdPnVzZXJvcmRlcnMucm93cztcbiAgICAgICAgICAgIHZhciBtYXA6IFVzZXJPcmRlcnNNYXAgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkcyA9IGxpc3RbaV0uaWRzO1xuICAgICAgICAgICAgICAgIHZhciB0YWJsZSA9IGxpc3RbaV0udGFibGU7XG4gICAgICAgICAgICAgICAgdmFyIG9yZGVycyA9IGF3YWl0IHRoaXMuZ2V0VGhpc1NlbGxPcmRlcnModGFibGUsIGlkcyk7XG4gICAgICAgICAgICAgICAgbWFwW3RhYmxlXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGU6IHRhYmxlLFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnM6IHRoaXMuYXV4UHJvY2Vzc1Jvd3NUb09yZGVycyhvcmRlcnMpLFxuICAgICAgICAgICAgICAgICAgICBpZHM6aWRzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudXNlcm9yZGVycyA9IG1hcDtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMudXNlcm9yZGVycyk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInVzZXJvcmRlcnNcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlcm9yZGVycztcbiAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlQWN0aXZpdHkoKSB7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYWN0aXZpdHlcIiwgdHJ1ZSk7XG4gICAgICAgIHZhciBwYWdlc2l6ZSA9IHRoaXMuYWN0aXZpdHlQYWdlc2l6ZTtcbiAgICAgICAgdmFyIHBhZ2VzID0gYXdhaXQgdGhpcy5nZXRBY3Rpdml0eVRvdGFsUGFnZXMocGFnZXNpemUpO1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0aGlzLmZldGNoQWN0aXZpdHkocGFnZXMtMiwgcGFnZXNpemUpLFxuICAgICAgICAgICAgdGhpcy5mZXRjaEFjdGl2aXR5KHBhZ2VzLTEsIHBhZ2VzaXplKSxcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hBY3Rpdml0eShwYWdlcy0wLCBwYWdlc2l6ZSlcbiAgICAgICAgXSk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYWN0aXZpdHlcIiwgZmFsc2UpO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRNb3JlQWN0aXZpdHkoKSB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2aXR5Lmxpc3QubGVuZ3RoID09IDApIHJldHVybjtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJhY3Rpdml0eVwiLCB0cnVlKTtcbiAgICAgICAgdmFyIHBhZ2VzaXplID0gdGhpcy5hY3Rpdml0eVBhZ2VzaXplO1xuICAgICAgICB2YXIgZmlyc3QgPSB0aGlzLmFjdGl2aXR5Lmxpc3RbdGhpcy5hY3Rpdml0eS5saXN0Lmxlbmd0aC0xXTtcbiAgICAgICAgdmFyIGlkID0gZmlyc3QuaWQgLSBwYWdlc2l6ZTtcbiAgICAgICAgdmFyIHBhZ2UgPSBNYXRoLmZsb29yKChpZC0xKSAvIHBhZ2VzaXplKTtcblxuICAgICAgICBhd2FpdCB0aGlzLmZldGNoQWN0aXZpdHkocGFnZSwgcGFnZXNpemUpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImFjdGl2aXR5XCIsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGVUcmFkZShjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgsIHVwZGF0ZVVzZXI6Ym9vbGVhbiA9IHRydWUpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC51cGRhdGVUcmFkZSgpXCIpO1xuICAgICAgICB2YXIgY2hyb25vX2tleSA9IFwidXBkYXRlVHJhZGVcIjtcbiAgICAgICAgdGhpcy5mZWVkLnN0YXJ0Q2hyb25vKGNocm9ub19rZXkpO1xuXG4gICAgICAgIGlmKHVwZGF0ZVVzZXIpIHRoaXMudXBkYXRlQ3VycmVudFVzZXIoKTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMuZ2V0VHJhbnNhY3Rpb25IaXN0b3J5KGNvbW9kaXR5LCBjdXJyZW5jeSwgLTEsIC0xLCB0cnVlKS50aGVuKF8gPT4gdGhpcy5mZWVkLnNldE1hcmNrKGNocm9ub19rZXksIFwiZ2V0VHJhbnNhY3Rpb25IaXN0b3J5KClcIikpLFxuICAgICAgICAgICAgdGhpcy5nZXRCbG9ja0hpc3RvcnkoY29tb2RpdHksIGN1cnJlbmN5LCAtMSwgLTEsIHRydWUpLnRoZW4oXyA9PiB0aGlzLmZlZWQuc2V0TWFyY2soY2hyb25vX2tleSwgXCJnZXRCbG9ja0hpc3RvcnkoKVwiKSksXG4gICAgICAgICAgICB0aGlzLmdldFNlbGxPcmRlcnMoY29tb2RpdHksIGN1cnJlbmN5LCB0cnVlKS50aGVuKF8gPT4gdGhpcy5mZWVkLnNldE1hcmNrKGNocm9ub19rZXksIFwiZ2V0U2VsbE9yZGVycygpXCIpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0QnV5T3JkZXJzKGNvbW9kaXR5LCBjdXJyZW5jeSwgdHJ1ZSkudGhlbihfID0+IHRoaXMuZmVlZC5zZXRNYXJjayhjaHJvbm9fa2V5LCBcImdldEJ1eU9yZGVycygpXCIpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0VGFibGVTdW1tYXJ5KGNvbW9kaXR5LCBjdXJyZW5jeSwgdHJ1ZSkudGhlbihfID0+IHRoaXMuZmVlZC5zZXRNYXJjayhjaHJvbm9fa2V5LCBcImdldFRhYmxlU3VtbWFyeSgpXCIpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0T3JkZXJTdW1tYXJ5KCkudGhlbihfID0+IHRoaXMuZmVlZC5zZXRNYXJjayhjaHJvbm9fa2V5LCBcImdldE9yZGVyU3VtbWFyeSgpXCIpKSxcbiAgICAgICAgXSkudGhlbihyID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3JldmVyc2UgPSB7fTtcbiAgICAgICAgICAgIHRoaXMucmVzb3J0VG9rZW5zKCk7XG4gICAgICAgICAgICAvLyB0aGlzLmZlZWQucHJpbnRDaHJvbm8oY2hyb25vX2tleSk7XG4gICAgICAgICAgICB0aGlzLm9uVHJhZGVVcGRhdGVkLm5leHQobnVsbCk7XG4gICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlQ3VycmVudFVzZXIoKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWVERVgudXBkYXRlQ3VycmVudFVzZXIoKVwiKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjdXJyZW50XCIsIHRydWUpOyAgICAgICAgXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0aGlzLmdldFVzZXJPcmRlcnMoKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0RGVwb3NpdHMoKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0QmFsYW5jZXMoKVxuICAgICAgICBdKS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjdXJyZW50XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiBfO1xuICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY3VycmVudFwiLCBmYWxzZSk7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEJsb2NrSGlzdG9yeVRvdGFsUGFnZXNGb3Ioc2NvcGU6c3RyaW5nLCBwYWdlc2l6ZTogbnVtYmVyKSB7XG4gICAgICAgIGlmICghdGhpcy5fbWFya2V0cykgcmV0dXJuIDA7XG4gICAgICAgIHZhciBtYXJrZXQgPSB0aGlzLm1hcmtldChzY29wZSk7XG4gICAgICAgIGlmICghbWFya2V0KSByZXR1cm4gMDtcbiAgICAgICAgdmFyIHRvdGFsID0gbWFya2V0LmJsb2NrcztcbiAgICAgICAgdmFyIG1vZCA9IHRvdGFsICUgcGFnZXNpemU7XG4gICAgICAgIHZhciBkaWYgPSB0b3RhbCAtIG1vZDtcbiAgICAgICAgdmFyIHBhZ2VzID0gZGlmIC8gcGFnZXNpemU7XG4gICAgICAgIGlmIChtb2QgPiAwKSB7XG4gICAgICAgICAgICBwYWdlcyArPTE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJnZXRCbG9ja0hpc3RvcnlUb3RhbFBhZ2VzRm9yKCkgdG90YWw6XCIsIHRvdGFsLCBcIiBwYWdlczpcIiwgcGFnZXMpO1xuICAgICAgICByZXR1cm4gcGFnZXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRIaXN0b3J5VG90YWxQYWdlc0ZvcihzY29wZTpzdHJpbmcsIHBhZ2VzaXplOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9tYXJrZXRzKSByZXR1cm4gMDtcbiAgICAgICAgdmFyIG1hcmtldCA9IHRoaXMubWFya2V0KHNjb3BlKTtcbiAgICAgICAgaWYgKCFtYXJrZXQpIHJldHVybiAwO1xuICAgICAgICB2YXIgdG90YWwgPSBtYXJrZXQuZGVhbHM7XG4gICAgICAgIHZhciBtb2QgPSB0b3RhbCAlIHBhZ2VzaXplO1xuICAgICAgICB2YXIgZGlmID0gdG90YWwgLSBtb2Q7XG4gICAgICAgIHZhciBwYWdlcyA9IGRpZiAvIHBhZ2VzaXplO1xuICAgICAgICBpZiAobW9kID4gMCkge1xuICAgICAgICAgICAgcGFnZXMgKz0xO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYWdlcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGdldEFjdGl2aXR5VG90YWxQYWdlcyhwYWdlc2l6ZTogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwiZXZlbnRzXCIsIHtcbiAgICAgICAgICAgIGxpbWl0OiAxXG4gICAgICAgIH0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSByZXN1bHQucm93c1swXS5wYXJhbXM7XG4gICAgICAgICAgICB2YXIgdG90YWwgPSBwYXJzZUludChwYXJhbXMuc3BsaXQoXCIgXCIpWzBdKS0xO1xuICAgICAgICAgICAgdmFyIG1vZCA9IHRvdGFsICUgcGFnZXNpemU7XG4gICAgICAgICAgICB2YXIgZGlmID0gdG90YWwgLSBtb2Q7XG4gICAgICAgICAgICB2YXIgcGFnZXMgPSBkaWYgLyBwYWdlc2l6ZTtcbiAgICAgICAgICAgIGlmIChtb2QgPiAwKSB7XG4gICAgICAgICAgICAgICAgcGFnZXMgKz0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hY3Rpdml0eS50b3RhbCA9IHRvdGFsO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVguZ2V0QWN0aXZpdHlUb3RhbFBhZ2VzKCkgdG90YWw6IFwiLCB0b3RhbCwgXCIgcGFnZXM6IFwiLCBwYWdlcyk7XG4gICAgICAgICAgICByZXR1cm4gcGFnZXM7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGdldFRyYW5zYWN0aW9uSGlzdG9yeShjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgsIHBhZ2U6bnVtYmVyID0gLTEsIHBhZ2VzaXplOm51bWJlciA9IC0xLCBmb3JjZTpib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB2YXIgc2NvcGU6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZSh0aGlzLmdldFNjb3BlRm9yKGNvbW9kaXR5LCBjdXJyZW5jeSkpO1xuICAgICAgICB2YXIgYXV4ID0gbnVsbDtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiaGlzdG9yeS5cIitzY29wZSwgdHJ1ZSk7XG4gICAgICAgIGF1eCA9IHRoaXMud2FpdE9yZGVyU3VtbWFyeS50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgaWYgKHBhZ2VzaXplID09IC0xKSB7XG4gICAgICAgICAgICAgICAgcGFnZXNpemUgPSAxMDsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFnZSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIHZhciBwYWdlcyA9IHRoaXMuZ2V0SGlzdG9yeVRvdGFsUGFnZXNGb3Ioc2NvcGUsIHBhZ2VzaXplKTtcbiAgICAgICAgICAgICAgICBwYWdlID0gcGFnZXMtMztcbiAgICAgICAgICAgICAgICBpZiAocGFnZSA8IDApIHBhZ2UgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hIaXN0b3J5KHNjb3BlLCBwYWdlKzAsIHBhZ2VzaXplKSxcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoSGlzdG9yeShzY29wZSwgcGFnZSsxLCBwYWdlc2l6ZSksXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaEhpc3Rvcnkoc2NvcGUsIHBhZ2UrMiwgcGFnZXNpemUpXG4gICAgICAgICAgICBdKS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiaGlzdG9yeS5cIitzY29wZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcmtldChzY29wZSkuaGlzdG9yeTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiaGlzdG9yeS5cIitzY29wZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMubWFya2V0KHNjb3BlKSAmJiAhZm9yY2UpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMubWFya2V0KHNjb3BlKS5oaXN0b3J5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gYXV4O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vbkhpc3RvcnlDaGFuZ2UubmV4dChyZXN1bHQpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhdXhIb3VyVG9MYWJlbChob3VyOm51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIHZhciBkID0gbmV3IERhdGUoaG91ciAqIDEwMDAgKiA2MCAqIDYwKTtcbiAgICAgICAgdmFyIGxhYmVsID0gZC5nZXRIb3VycygpID09IDAgPyB0aGlzLmRhdGVQaXBlLnRyYW5zZm9ybShkLCAnZGQvTU0nKSA6IGQuZ2V0SG91cnMoKSArIFwiaFwiO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGxhYmVsO1xuICAgIH1cblxuICAgIGFzeW5jIGdldEJsb2NrSGlzdG9yeShjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgsIHBhZ2U6bnVtYmVyID0gLTEsIHBhZ2VzaXplOm51bWJlciA9IC0xLCBmb3JjZTpib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5nZXRCbG9ja0hpc3RvcnkoKVwiLCBjb21vZGl0eS5zeW1ib2wsIHBhZ2UsIHBhZ2VzaXplKTtcbiAgICAgICAgLy8gLy8gZWxhcHNlZCB0aW1lXG4gICAgICAgIC8vIHZhciBzdGFydFRpbWU6RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIC8vIHZhciBkaWZmOm51bWJlcjtcbiAgICAgICAgLy8gdmFyIHNlYzpudW1iZXI7XG5cbiAgICAgICAgdmFyIHNjb3BlOnN0cmluZyA9IHRoaXMuY2Fub25pY2FsU2NvcGUodGhpcy5nZXRTY29wZUZvcihjb21vZGl0eSwgY3VycmVuY3kpKTtcbiAgICAgICAgdmFyIGF1eCA9IG51bGw7XG4gICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJsb2NrLWhpc3RvcnkuXCIrc2NvcGUsIHRydWUpO1xuXG4gICAgICAgIGF1eCA9IHRoaXMud2FpdE9yZGVyU3VtbWFyeS50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIGZldGNoQmxvY2tIaXN0b3J5U3RhcnQ6RGF0ZSA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgICAgIGlmIChwYWdlc2l6ZSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIHBhZ2VzaXplID0gMTA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFnZSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIHZhciBwYWdlcyA9IHRoaXMuZ2V0QmxvY2tIaXN0b3J5VG90YWxQYWdlc0ZvcihzY29wZSwgcGFnZXNpemUpO1xuICAgICAgICAgICAgICAgIHBhZ2UgPSBwYWdlcy0zO1xuICAgICAgICAgICAgICAgIGlmIChwYWdlIDwgMCkgcGFnZSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcHJvbWlzZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTw9cGFnZXM7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gdGhpcy5mZXRjaEJsb2NrSGlzdG9yeShzY29wZSwgaSwgcGFnZXNpemUpO1xuICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihfID0+IHtcbiAgICAgICAgICAgICAgICAvLyAvLyBlbGFwc2VkIHRpbWVcbiAgICAgICAgICAgICAgICAvLyB2YXIgZmV0Y2hCbG9ja0hpc3RvcnlUaW1lOkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIC8vIGRpZmYgPSBmZXRjaEJsb2NrSGlzdG9yeVRpbWUuZ2V0VGltZSgpIC0gZmV0Y2hCbG9ja0hpc3RvcnlTdGFydC5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgLy8gc2VjID0gZGlmZiAvIDEwMDA7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKiBWYXBhZWVERVguZ2V0QmxvY2tIaXN0b3J5KCkgZmV0Y2hCbG9ja0hpc3RvcnlUaW1lIHNlYzogXCIsIHNlYywgXCIoXCIsZGlmZixcIilcIik7XG5cblxuICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYmxvY2staGlzdG9yeS5cIitzY29wZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHZhciBtYXJrZXQ6IE1hcmtldCA9IHRoaXMubWFya2V0KHNjb3BlKTtcbiAgICAgICAgICAgICAgICBtYXJrZXQuYmxvY2tsaXN0ID0gW107XG4gICAgICAgICAgICAgICAgbWFya2V0LnJldmVyc2VibG9ja3MgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICB2YXIgaG9yYSA9IDEwMDAgKiA2MCAqIDYwO1xuICAgICAgICAgICAgICAgIHZhciBob3VyID0gTWF0aC5mbG9vcihub3cuZ2V0VGltZSgpL2hvcmEpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLT5cIiwgaG91cik7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RfYmxvY2sgPSBudWxsO1xuICAgICAgICAgICAgICAgIHZhciBsYXN0X2hvdXIgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgdmFyIG9yZGVyZWRfYmxvY2tzID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBtYXJrZXQuYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJlZF9ibG9ja3MucHVzaChtYXJrZXQuYmxvY2tbaV0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG9yZGVyZWRfYmxvY2tzLnNvcnQoZnVuY3Rpb24oYTpIaXN0b3J5QmxvY2ssIGI6SGlzdG9yeUJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGEuaG91ciA8IGIuaG91cikgcmV0dXJuIC0xMTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfSk7XG5cblxuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBvcmRlcmVkX2Jsb2Nrcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmxvY2s6SGlzdG9yeUJsb2NrID0gb3JkZXJlZF9ibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IHRoaXMuYXV4SG91clRvTGFiZWwoYmxvY2suaG91cik7XG4gICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLT5cIiwgaSwgbGFiZWwsIGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBibG9jay5kYXRlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGlmID0gbm93LmdldFRpbWUoKSAtIGJsb2NrLmRhdGUuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWVzID0gMzAgKiAyNCAqIGhvcmE7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGFwc2VkX21vbnRocyA9IGRpZiAvIG1lcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsYXBzZWRfbW9udGhzID4gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkcm9wcGluZyBibG9jayB0b28gb2xkXCIsIFtibG9jaywgYmxvY2suZGF0ZS50b1VUQ1N0cmluZygpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0X2Jsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGlmID0gYmxvY2suaG91ciAtIGxhc3RfYmxvY2suaG91cjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGo9MTsgajxkaWY7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbF9pID0gdGhpcy5hdXhIb3VyVG9MYWJlbChsYXN0X2Jsb2NrLmhvdXIraik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItLT5cIiwgaiwgbGFiZWxfaSwgYmxvY2spO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uaW5pY2FsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJpY2UgPSBsYXN0X2Jsb2NrLnByaWNlLmFtb3VudC50b051bWJlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdXggPSBbbGFiZWxfaSwgcHJpY2UsIHByaWNlLCBwcmljZSwgcHJpY2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtldC5ibG9ja2xpc3QucHVzaChhdXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJldmVyc2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnZlcnNlID0gbGFzdF9ibG9jay5pbnZlcnNlLmFtb3VudC50b051bWJlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdXggPSBbbGFiZWxfaSwgaW52ZXJzZSwgaW52ZXJzZSwgaW52ZXJzZSwgaW52ZXJzZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFya2V0LnJldmVyc2VibG9ja3MucHVzaChhdXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBvYmo6YW55W107XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbmluaWNhbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgIG9iaiA9IFtsYWJlbF07XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKGJsb2NrLm1heC5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKGJsb2NrLmVudHJhbmNlLmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goYmxvY2sucHJpY2UuYW1vdW50LnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICBvYmoucHVzaChibG9jay5taW4uYW1vdW50LnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXQuYmxvY2tsaXN0LnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV2ZXJzZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgIG9iaiA9IFtsYWJlbF07XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKDEuMC9ibG9jay5tYXguYW1vdW50LnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICBvYmoucHVzaCgxLjAvYmxvY2suZW50cmFuY2UuYW1vdW50LnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICBvYmoucHVzaCgxLjAvYmxvY2sucHJpY2UuYW1vdW50LnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICBvYmoucHVzaCgxLjAvYmxvY2subWluLmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2V0LnJldmVyc2VibG9ja3MucHVzaChvYmopO1xuICAgICAgICAgICAgICAgICAgICBsYXN0X2Jsb2NrID0gYmxvY2s7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGxhc3RfYmxvY2sgJiYgaG91ciAhPSBsYXN0X2Jsb2NrLmhvdXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpZiA9IGhvdXIgLSBsYXN0X2Jsb2NrLmhvdXI7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGo9MTsgajw9ZGlmOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbF9pID0gdGhpcy5hdXhIb3VyVG9MYWJlbChsYXN0X2Jsb2NrLmhvdXIraik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbmluaWNhbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJpY2UgPSBsYXN0X2Jsb2NrLnByaWNlLmFtb3VudC50b051bWJlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF1eCA9IFtsYWJlbF9pLCBwcmljZSwgcHJpY2UsIHByaWNlLCBwcmljZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXQuYmxvY2tsaXN0LnB1c2goYXV4KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV2ZXJzZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW52ZXJzZSA9IGxhc3RfYmxvY2suaW52ZXJzZS5hbW91bnQudG9OdW1iZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdXggPSBbbGFiZWxfaSwgaW52ZXJzZSwgaW52ZXJzZSwgaW52ZXJzZSwgaW52ZXJzZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXQucmV2ZXJzZWJsb2Nrcy5wdXNoKGF1eCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyAvLyBlbGFwc2VkIHRpbWVcbiAgICAgICAgICAgICAgICAvLyB2YXIgZmlyc3RMZXZlbFRpbWU6RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgLy8gZGlmZiA9IGZpcnN0TGV2ZWxUaW1lLmdldFRpbWUoKSAtIGZldGNoQmxvY2tIaXN0b3J5VGltZS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgLy8gc2VjID0gZGlmZiAvIDEwMDA7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKiBWYXBhZWVERVguZ2V0QmxvY2tIaXN0b3J5KCkgZmlyc3RMZXZlbFRpbWUgc2VjOiBcIiwgc2VjLCBcIihcIixkaWZmLFwiKVwiKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tPlwiLCBtYXJrZXQuYmxvY2tsaXN0KTtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLm9uQmxvY2tsaXN0Q2hhbmdlLm5leHQobWFya2V0LmJsb2NrbGlzdCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcmtldDtcbiAgICAgICAgICAgIH0pLnRoZW4obWFya2V0ID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiKTtcbiAgICAgICAgICAgICAgICAvLyAvLyBlbGFwc2VkIHRpbWVcbiAgICAgICAgICAgICAgICAvLyB2YXIgYWxsTGV2ZWxzU3RhcnQ6RGF0ZSA9IG5ldyBEYXRlKCk7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBsaW1pdCA9IDI1NjtcbiAgICAgICAgICAgICAgICB2YXIgbGV2ZWxzID0gW21hcmtldC5ibG9ja2xpc3RdO1xuICAgICAgICAgICAgICAgIHZhciByZXZlcnNlcyA9IFttYXJrZXQucmV2ZXJzZWJsb2Nrc107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgY3VycmVudCA9IDA7IGxldmVsc1tjdXJyZW50XS5sZW5ndGggPiBsaW1pdDsgY3VycmVudCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGN1cnJlbnQgLGxldmVsc1tjdXJyZW50XS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3bGV2ZWw6YW55W11bXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3cmV2ZXJzZTphbnlbXVtdID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBtZXJnZWQ6YW55W10gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGxldmVsc1tjdXJyZW50XS5sZW5ndGg7IGkrPTIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbm9uaWNhbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZfMTphbnlbXSA9IGxldmVsc1tjdXJyZW50XVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2XzIgPSBsZXZlbHNbY3VycmVudF1baSsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZXJnZWQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHg9MDsgeDw1OyB4KyspIG1lcmdlZFt4XSA9IHZfMVt4XTsgLy8gY2xlYW4gY29weVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZfMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFswXSA9IHZfMVswXS5zcGxpdChcIi9cIikubGVuZ3RoID4gMSA/IHZfMVswXSA6IHZfMlswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbMV0gPSBNYXRoLm1heCh2XzFbMV0sIHZfMlsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzJdID0gdl8xWzJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFszXSA9IHZfMlszXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbNF0gPSBNYXRoLm1pbih2XzFbNF0sIHZfMls0XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdsZXZlbC5wdXNoKG1lcmdlZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJldmVyc2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgICAgICB2XzEgPSByZXZlcnNlc1tjdXJyZW50XVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZfMiA9IHJldmVyc2VzW2N1cnJlbnRdW2krMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHg9MDsgeDw1OyB4KyspIG1lcmdlZFt4XSA9IHZfMVt4XTsgLy8gY2xlYW4gY29weVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZfMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFswXSA9IHZfMVswXS5zcGxpdChcIi9cIikubGVuZ3RoID4gMSA/IHZfMVswXSA6IHZfMlswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbMV0gPSBNYXRoLm1pbih2XzFbMV0sIHZfMlsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzJdID0gdl8xWzJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFszXSA9IHZfMlszXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbNF0gPSBNYXRoLm1heCh2XzFbNF0sIHZfMls0XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3cmV2ZXJzZS5wdXNoKG1lcmdlZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXZlbHMucHVzaChuZXdsZXZlbCk7XG4gICAgICAgICAgICAgICAgICAgIHJldmVyc2VzLnB1c2gobmV3cmV2ZXJzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgbWFya2V0LmJsb2NrbGV2ZWxzID0gbGV2ZWxzO1xuICAgICAgICAgICAgICAgIG1hcmtldC5yZXZlcnNlbGV2ZWxzID0gcmV2ZXJzZXM7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgLy8gbWFya2V0LmJsb2NrbGV2ZWxzID0gW21hcmtldC5ibG9ja2xpc3RdO1xuICAgICAgICAgICAgICAgIC8vIG1hcmtldC5yZXZlcnNlbGV2ZWxzID0gW21hcmtldC5yZXZlcnNlYmxvY2tzXTtcbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIC8vIGVsYXBzZWQgdGltZVxuICAgICAgICAgICAgICAgIC8vIHZhciBhbGxMZXZlbHNUaW1lOkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIC8vIGRpZmYgPSBhbGxMZXZlbHNUaW1lLmdldFRpbWUoKSAtIGFsbExldmVsc1N0YXJ0LmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAvLyBzZWMgPSBkaWZmIC8gMTAwMDtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqIFZhcGFlZURFWC5nZXRCbG9ja0hpc3RvcnkoKSBhbGxMZXZlbHNUaW1lIHNlYzogXCIsIHNlYywgXCIoXCIsZGlmZixcIilcIik7ICAgXG4gICAgICAgICAgICAgICAgLy8gLy8gY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcIiwgbWFya2V0LmJsb2NrbGV2ZWxzKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBtYXJrZXQuYmxvY2s7XG4gICAgICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJsb2NrLWhpc3RvcnkuXCIrc2NvcGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLm1hcmtldChzY29wZSkgJiYgIWZvcmNlKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLm1hcmtldChzY29wZSkuYmxvY2s7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhdXg7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uSGlzdG9yeUNoYW5nZS5uZXh0KHJlc3VsdCk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRTZWxsT3JkZXJzKGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCwgZm9yY2U6Ym9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgdmFyIHNjb3BlOnN0cmluZyA9IHRoaXMuZ2V0U2NvcGVGb3IoY29tb2RpdHksIGN1cnJlbmN5KTtcbiAgICAgICAgdmFyIGNhbm9uaWNhbDpzdHJpbmcgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgdmFyIHJldmVyc2U6c3RyaW5nID0gdGhpcy5pbnZlcnNlU2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgdmFyIGF1eCA9IG51bGw7XG4gICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInNlbGxvcmRlcnNcIiwgdHJ1ZSk7XG4gICAgICAgIGF1eCA9IHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIG9yZGVycyA9IGF3YWl0IHRoaXMuZmV0Y2hPcmRlcnMoe3Njb3BlOmNhbm9uaWNhbCwgbGltaXQ6MTAwLCBpbmRleF9wb3NpdGlvbjogXCIyXCIsIGtleV90eXBlOiBcImk2NFwifSk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gPSB0aGlzLmF1eEFzc2VydFNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICAvLyBpZihzY29wZT09XCJ2cGUudGxvc1wiIHx8IHNjb3BlPT1cImNudC50bG9zXCIpY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgLy8gaWYoc2NvcGU9PVwidnBlLnRsb3NcIiB8fCBzY29wZT09XCJjbnQudGxvc1wiKWNvbnNvbGUubG9nKFwiU2VsbCBjcnVkbzpcIiwgb3JkZXJzKTtcbiAgICAgICAgICAgIHZhciBzZWxsOiBPcmRlcltdID0gdGhpcy5hdXhQcm9jZXNzUm93c1RvT3JkZXJzKG9yZGVycy5yb3dzKTtcbiAgICAgICAgICAgIHNlbGwuc29ydChmdW5jdGlvbihhOk9yZGVyLCBiOk9yZGVyKSB7XG4gICAgICAgICAgICAgICAgaWYoYS5wcmljZS5hbW91bnQuaXNMZXNzVGhhbihiLnByaWNlLmFtb3VudCkpIHJldHVybiAtMTE7XG4gICAgICAgICAgICAgICAgaWYoYS5wcmljZS5hbW91bnQuaXNHcmVhdGVyVGhhbihiLnByaWNlLmFtb3VudCkpIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBpZihzY29wZT09XCJ2cGUudGxvc1wiIHx8IHNjb3BlPT1cImNudC50bG9zXCIpY29uc29sZS5sb2coXCJzb3J0ZWQ6XCIsIHNlbGwpO1xuICAgICAgICAgICAgLy8gZ3JvdXBpbmcgdG9nZXRoZXIgb3JkZXJzIHdpdGggdGhlIHNhbWUgcHJpY2UuXG4gICAgICAgICAgICB2YXIgbGlzdDogT3JkZXJSb3dbXSA9IFtdO1xuICAgICAgICAgICAgdmFyIHJvdzogT3JkZXJSb3c7XG4gICAgICAgICAgICBpZiAoc2VsbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8c2VsbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3JkZXI6IE9yZGVyID0gc2VsbFtpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93ID0gbGlzdFtsaXN0Lmxlbmd0aC0xXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3cucHJpY2UuYW1vdW50LmVxKG9yZGVyLnByaWNlLmFtb3VudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cudG90YWwuYW1vdW50ID0gcm93LnRvdGFsLmFtb3VudC5wbHVzKG9yZGVyLnRvdGFsLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LnRlbG9zLmFtb3VudCA9IHJvdy50ZWxvcy5hbW91bnQucGx1cyhvcmRlci50ZWxvcy5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5vd25lcnNbb3JkZXIub3duZXJdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cub3JkZXJzLnB1c2gob3JkZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByb3cgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHI6IG9yZGVyLnByaWNlLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogb3JkZXIucHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcnM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IG9yZGVyLnRvdGFsLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWxvczogb3JkZXIudGVsb3MuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2U6IG9yZGVyLmludmVyc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdW06IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdW10ZWxvczogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyczoge31cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJvdy5vd25lcnNbb3JkZXIub3duZXJdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcm93Lm9yZGVycy5wdXNoKG9yZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc3VtID0gbmV3IEJpZ051bWJlcigwKTtcbiAgICAgICAgICAgIHZhciBzdW10ZWxvcyA9IG5ldyBCaWdOdW1iZXIoMCk7XG4gICAgICAgICAgICBmb3IgKHZhciBqIGluIGxpc3QpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3JkZXJfcm93ID0gbGlzdFtqXTtcbiAgICAgICAgICAgICAgICBzdW10ZWxvcyA9IHN1bXRlbG9zLnBsdXMob3JkZXJfcm93LnRlbG9zLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgc3VtID0gc3VtLnBsdXMob3JkZXJfcm93LnRvdGFsLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgb3JkZXJfcm93LnN1bXRlbG9zID0gbmV3IEFzc2V0REVYKHN1bXRlbG9zLCBvcmRlcl9yb3cudGVsb3MudG9rZW4pO1xuICAgICAgICAgICAgICAgIG9yZGVyX3Jvdy5zdW0gPSBuZXcgQXNzZXRERVgoc3VtLCBvcmRlcl9yb3cudG90YWwudG9rZW4pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0ub3JkZXJzLnNlbGwgPSBsaXN0O1xuICAgICAgICAgICAgLy8gaWYoc2NvcGU9PVwidnBlLnRsb3NcIiB8fCBzY29wZT09XCJjbnQudGxvc1wiKWNvbnNvbGUubG9nKFwiU2VsbCBmaW5hbDpcIiwgdGhpcy5zY29wZXNbc2NvcGVdLm9yZGVycy5zZWxsKTtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cInZwZS50bG9zXCIgfHwgc2NvcGU9PVwiY250LnRsb3NcIiljb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS1cIik7XG5cbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwic2VsbG9yZGVyc1wiLCBmYWxzZSk7ICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLm9yZGVycy5zZWxsO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5fbWFya2V0c1tjYW5vbmljYWxdICYmICFmb3JjZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLm9yZGVycy5zZWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gYXV4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIGdldEJ1eU9yZGVycyhjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgsIGZvcmNlOmJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHZhciBzY29wZTpzdHJpbmcgPSB0aGlzLmdldFNjb3BlRm9yKGNvbW9kaXR5LCBjdXJyZW5jeSk7XG4gICAgICAgIHZhciBjYW5vbmljYWw6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgIHZhciByZXZlcnNlOnN0cmluZyA9IHRoaXMuaW52ZXJzZVNjb3BlKGNhbm9uaWNhbCk7XG5cblxuICAgICAgICB2YXIgYXV4ID0gbnVsbDtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYnV5b3JkZXJzXCIsIHRydWUpO1xuICAgICAgICBhdXggPSB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciBvcmRlcnMgPSBhd2FpdCBhd2FpdCB0aGlzLmZldGNoT3JkZXJzKHtzY29wZTpyZXZlcnNlLCBsaW1pdDo1MCwgaW5kZXhfcG9zaXRpb246IFwiMlwiLCBrZXlfdHlwZTogXCJpNjRcIn0pO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdID0gdGhpcy5hdXhBc3NlcnRTY29wZShjYW5vbmljYWwpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJCdXkgY3J1ZG86XCIsIG9yZGVycyk7ICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgYnV5OiBPcmRlcltdID0gdGhpcy5hdXhQcm9jZXNzUm93c1RvT3JkZXJzKG9yZGVycy5yb3dzKTtcbiAgICAgICAgICAgIGJ1eS5zb3J0KGZ1bmN0aW9uKGE6T3JkZXIsIGI6T3JkZXIpe1xuICAgICAgICAgICAgICAgIGlmKGEucHJpY2UuYW1vdW50LmlzTGVzc1RoYW4oYi5wcmljZS5hbW91bnQpKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBpZihhLnByaWNlLmFtb3VudC5pc0dyZWF0ZXJUaGFuKGIucHJpY2UuYW1vdW50KSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYnV5IHNvcnRlYWRvOlwiLCBidXkpO1xuXG4gICAgICAgICAgICAvLyBncm91cGluZyB0b2dldGhlciBvcmRlcnMgd2l0aCB0aGUgc2FtZSBwcmljZS5cbiAgICAgICAgICAgIHZhciBsaXN0OiBPcmRlclJvd1tdID0gW107XG4gICAgICAgICAgICB2YXIgcm93OiBPcmRlclJvdztcbiAgICAgICAgICAgIGlmIChidXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGJ1eS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3JkZXI6IE9yZGVyID0gYnV5W2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3cgPSBsaXN0W2xpc3QubGVuZ3RoLTFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvdy5wcmljZS5hbW91bnQuZXEob3JkZXIucHJpY2UuYW1vdW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy50b3RhbC5hbW91bnQgPSByb3cudG90YWwuYW1vdW50LnBsdXMob3JkZXIudG90YWwuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cudGVsb3MuYW1vdW50ID0gcm93LnRlbG9zLmFtb3VudC5wbHVzKG9yZGVyLnRlbG9zLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93Lm93bmVyc1tvcmRlci5vd25lcl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5vcmRlcnMucHVzaChvcmRlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJvdyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cjogb3JkZXIucHJpY2UudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBvcmRlci5wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyczogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogb3JkZXIudG90YWwuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbG9zOiBvcmRlci50ZWxvcy5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogb3JkZXIuaW52ZXJzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1bTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1bXRlbG9zOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXJzOiB7fVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcm93Lm93bmVyc1tvcmRlci5vd25lcl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByb3cub3JkZXJzLnB1c2gob3JkZXIpO1xuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIHZhciBzdW0gPSBuZXcgQmlnTnVtYmVyKDApO1xuICAgICAgICAgICAgdmFyIHN1bXRlbG9zID0gbmV3IEJpZ051bWJlcigwKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogaW4gbGlzdCkge1xuICAgICAgICAgICAgICAgIHZhciBvcmRlcl9yb3cgPSBsaXN0W2pdO1xuICAgICAgICAgICAgICAgIHN1bXRlbG9zID0gc3VtdGVsb3MucGx1cyhvcmRlcl9yb3cudGVsb3MuYW1vdW50KTtcbiAgICAgICAgICAgICAgICBzdW0gPSBzdW0ucGx1cyhvcmRlcl9yb3cudG90YWwuYW1vdW50KTtcbiAgICAgICAgICAgICAgICBvcmRlcl9yb3cuc3VtdGVsb3MgPSBuZXcgQXNzZXRERVgoc3VtdGVsb3MsIG9yZGVyX3Jvdy50ZWxvcy50b2tlbik7XG4gICAgICAgICAgICAgICAgb3JkZXJfcm93LnN1bSA9IG5ldyBBc3NldERFWChzdW0sIG9yZGVyX3Jvdy50b3RhbC50b2tlbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5vcmRlcnMuYnV5ID0gbGlzdDtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQnV5IGZpbmFsOlwiLCB0aGlzLnNjb3Blc1tzY29wZV0ub3JkZXJzLmJ1eSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJ1eW9yZGVyc1wiLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLm9yZGVycy5idXk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gJiYgIWZvcmNlKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0ub3JkZXJzLmJ1eTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGF1eDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBcbiAgICBhc3luYyBnZXRPcmRlclN1bW1hcnkoKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVguZ2V0T3JkZXJTdW1tYXJ5KClcIik7XG4gICAgICAgIHZhciB0YWJsZXMgPSBhd2FpdCB0aGlzLmZldGNoT3JkZXJTdW1tYXJ5KCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSBpbiB0YWJsZXMucm93cykge1xuICAgICAgICAgICAgdmFyIHNjb3BlOnN0cmluZyA9IHRhYmxlcy5yb3dzW2ldLnRhYmxlO1xuICAgICAgICAgICAgdmFyIGNhbm9uaWNhbCA9IHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpO1xuICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoc2NvcGUgPT0gY2Fub25pY2FsLCBcIkVSUk9SOiBzY29wZSBpcyBub3QgY2Fub25pY2FsXCIsIHNjb3BlLCBbaSwgdGFibGVzXSk7XG4gICAgICAgICAgICB2YXIgY29tb2RpdHkgPSBzY29wZS5zcGxpdChcIi5cIilbMF0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIHZhciBjdXJyZW5jeSA9IHNjb3BlLnNwbGl0KFwiLlwiKVsxXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tzY29wZV0gPSB0aGlzLmF1eEFzc2VydFNjb3BlKHNjb3BlKTtcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaSwgdGFibGVzLnJvd3NbaV0pO1xuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW3Njb3BlXS5oZWFkZXIuc2VsbC50b3RhbCA9IG5ldyBBc3NldERFWCh0YWJsZXMucm93c1tpXS5zdXBwbHkudG90YWwsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tzY29wZV0uaGVhZGVyLnNlbGwub3JkZXJzID0gdGFibGVzLnJvd3NbaV0uc3VwcGx5Lm9yZGVycztcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbc2NvcGVdLmhlYWRlci5idXkudG90YWwgPSBuZXcgQXNzZXRERVgodGFibGVzLnJvd3NbaV0uZGVtYW5kLnRvdGFsLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbc2NvcGVdLmhlYWRlci5idXkub3JkZXJzID0gdGFibGVzLnJvd3NbaV0uZGVtYW5kLm9yZGVycztcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbc2NvcGVdLmRlYWxzID0gdGFibGVzLnJvd3NbaV0uZGVhbHM7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW3Njb3BlXS5ibG9ja3MgPSB0YWJsZXMucm93c1tpXS5ibG9ja3M7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0T3JkZXJTdW1tYXJ5KCk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0VGFibGVTdW1tYXJ5KGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCwgZm9yY2U6Ym9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxNYXJrZXRTdW1tYXJ5PiB7XG4gICAgICAgIHZhciBzY29wZTpzdHJpbmcgPSB0aGlzLmdldFNjb3BlRm9yKGNvbW9kaXR5LCBjdXJyZW5jeSk7XG4gICAgICAgIHZhciBjYW5vbmljYWw6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgIHZhciBpbnZlcnNlOnN0cmluZyA9IHRoaXMuaW52ZXJzZVNjb3BlKGNhbm9uaWNhbCk7XG5cbiAgICAgICAgdmFyIFpFUk9fQ09NT0RJVFkgPSBcIjAuMDAwMDAwMDAgXCIgKyBjb21vZGl0eS5zeW1ib2w7XG4gICAgICAgIHZhciBaRVJPX0NVUlJFTkNZID0gXCIwLjAwMDAwMDAwIFwiICsgY3VycmVuY3kuc3ltYm9sO1xuXG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwic3VtbWFyeS5cIitjYW5vbmljYWwsIHRydWUpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInN1bW1hcnkuXCIraW52ZXJzZSwgdHJ1ZSk7XG4gICAgICAgIHZhciBhdXggPSBudWxsO1xuICAgICAgICB2YXIgcmVzdWx0Ok1hcmtldFN1bW1hcnkgPSBudWxsO1xuICAgICAgICBhdXggPSB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciBzdW1tYXJ5ID0gYXdhaXQgdGhpcy5mZXRjaFN1bW1hcnkoY2Fub25pY2FsKTtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cIm9saXZlLnRsb3NcIiljb25zb2xlLmxvZyhzY29wZSwgXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICAvLyBpZihzY29wZT09XCJvbGl2ZS50bG9zXCIpY29uc29sZS5sb2coXCJTdW1tYXJ5IGNydWRvOlwiLCBzdW1tYXJ5LnJvd3MpO1xuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gPSB0aGlzLmF1eEFzc2VydFNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeSA9IHtcbiAgICAgICAgICAgICAgICBzY29wZTogY2Fub25pY2FsLFxuICAgICAgICAgICAgICAgIHByaWNlOiBuZXcgQXNzZXRERVgobmV3IEJpZ051bWJlcigwKSwgY3VycmVuY3kpLFxuICAgICAgICAgICAgICAgIHByaWNlXzI0aF9hZ286IG5ldyBBc3NldERFWChuZXcgQmlnTnVtYmVyKDApLCBjdXJyZW5jeSksXG4gICAgICAgICAgICAgICAgaW52ZXJzZTogbmV3IEFzc2V0REVYKG5ldyBCaWdOdW1iZXIoMCksIGNvbW9kaXR5KSxcbiAgICAgICAgICAgICAgICBpbnZlcnNlXzI0aF9hZ286IG5ldyBBc3NldERFWChuZXcgQmlnTnVtYmVyKDApLCBjb21vZGl0eSksXG4gICAgICAgICAgICAgICAgdm9sdW1lOiBuZXcgQXNzZXRERVgobmV3IEJpZ051bWJlcigwKSwgY3VycmVuY3kpLFxuICAgICAgICAgICAgICAgIGFtb3VudDogbmV3IEFzc2V0REVYKG5ldyBCaWdOdW1iZXIoMCksIGNvbW9kaXR5KSxcbiAgICAgICAgICAgICAgICBwZXJjZW50OiAwLjMsXG4gICAgICAgICAgICAgICAgcmVjb3Jkczogc3VtbWFyeS5yb3dzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgbm93OkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdmFyIG5vd19zZWM6IG51bWJlciA9IE1hdGguZmxvb3Iobm93LmdldFRpbWUoKSAvIDEwMDApO1xuICAgICAgICAgICAgdmFyIG5vd19ob3VyOiBudW1iZXIgPSBNYXRoLmZsb29yKG5vd19zZWMgLyAzNjAwKTtcbiAgICAgICAgICAgIHZhciBzdGFydF9ob3VyID0gbm93X2hvdXIgLSAyMztcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJub3dfaG91cjpcIiwgbm93X2hvdXIpO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcInN0YXJ0X2hvdXI6XCIsIHN0YXJ0X2hvdXIpO1xuXG4gICAgICAgICAgICAvLyBwcm9jZXNvIGxvcyBkYXRvcyBjcnVkb3MgXG4gICAgICAgICAgICB2YXIgcHJpY2UgPSBaRVJPX0NVUlJFTkNZO1xuICAgICAgICAgICAgdmFyIGludmVyc2UgPSBaRVJPX0NPTU9ESVRZO1xuICAgICAgICAgICAgdmFyIGNydWRlID0ge307XG4gICAgICAgICAgICB2YXIgbGFzdF9oaCA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8c3VtbWFyeS5yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhoID0gc3VtbWFyeS5yb3dzW2ldLmhvdXI7XG4gICAgICAgICAgICAgICAgaWYgKHN1bW1hcnkucm93c1tpXS5sYWJlbCA9PSBcImxhc3RvbmVcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBwcmljZSA9IHN1bW1hcnkucm93c1tpXS5wcmljZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjcnVkZVtoaF0gPSBzdW1tYXJ5LnJvd3NbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0X2hoIDwgaGggJiYgaGggPCBzdGFydF9ob3VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0X2hoID0gaGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZSA9IChzY29wZSA9PSBjYW5vbmljYWwpID8gc3VtbWFyeS5yb3dzW2ldLnByaWNlIDogc3VtbWFyeS5yb3dzW2ldLmludmVyc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNlID0gKHNjb3BlID09IGNhbm9uaWNhbCkgPyBzdW1tYXJ5LnJvd3NbaV0uaW52ZXJzZSA6IHN1bW1hcnkucm93c1tpXS5wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJoaDpcIiwgaGgsIFwibGFzdF9oaDpcIiwgbGFzdF9oaCwgXCJwcmljZTpcIiwgcHJpY2UpO1xuICAgICAgICAgICAgICAgICAgICB9ICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiY3J1ZGU6XCIsIGNydWRlKTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJwcmljZTpcIiwgcHJpY2UpO1xuXG4gICAgICAgICAgICAvLyBnZW5lcm8gdW5hIGVudHJhZGEgcG9yIGNhZGEgdW5hIGRlIGxhcyDDumx0aW1hcyAyNCBob3Jhc1xuICAgICAgICAgICAgdmFyIGxhc3RfMjRoID0ge307XG4gICAgICAgICAgICB2YXIgdm9sdW1lID0gbmV3IEFzc2V0REVYKFpFUk9fQ1VSUkVOQ1ksIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGFtb3VudCA9IG5ldyBBc3NldERFWChaRVJPX0NPTU9ESVRZLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBwcmljZV9hc3NldCA9IG5ldyBBc3NldERFWChwcmljZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgaW52ZXJzZV9hc3NldCA9IG5ldyBBc3NldERFWChpbnZlcnNlLCB0aGlzKTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJjbnQudGxvc1wiKWNvbnNvbGUubG9nKFwicHJpY2UgXCIsIHByaWNlKTtcbiAgICAgICAgICAgIHZhciBtYXhfcHJpY2UgPSBwcmljZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgdmFyIG1pbl9wcmljZSA9IHByaWNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICB2YXIgbWF4X2ludmVyc2UgPSBpbnZlcnNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICB2YXIgbWluX2ludmVyc2UgPSBpbnZlcnNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICB2YXIgcHJpY2VfZnN0OkFzc2V0REVYID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBpbnZlcnNlX2ZzdDpBc3NldERFWCA9IG51bGw7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8MjQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gc3RhcnRfaG91citpO1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50X2RhdGUgPSBuZXcgRGF0ZShjdXJyZW50ICogMzYwMCAqIDEwMDApO1xuICAgICAgICAgICAgICAgIHZhciBudWV2bzphbnkgPSBjcnVkZVtjdXJyZW50XTtcbiAgICAgICAgICAgICAgICBpZiAobnVldm8pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNfcHJpY2UgPSAoc2NvcGUgPT0gY2Fub25pY2FsKSA/IG51ZXZvLnByaWNlIDogbnVldm8uaW52ZXJzZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNfaW52ZXJzZSA9IChzY29wZSA9PSBjYW5vbmljYWwpID8gbnVldm8uaW52ZXJzZSA6IG51ZXZvLnByaWNlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc192b2x1bWUgPSAoc2NvcGUgPT0gY2Fub25pY2FsKSA/IG51ZXZvLnZvbHVtZSA6IG51ZXZvLmFtb3VudDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNfYW1vdW50ID0gKHNjb3BlID09IGNhbm9uaWNhbCkgPyBudWV2by5hbW91bnQgOiBudWV2by52b2x1bWU7XG4gICAgICAgICAgICAgICAgICAgIG51ZXZvLnByaWNlID0gc19wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgbnVldm8uaW52ZXJzZSA9IHNfaW52ZXJzZTtcbiAgICAgICAgICAgICAgICAgICAgbnVldm8udm9sdW1lID0gc192b2x1bWU7XG4gICAgICAgICAgICAgICAgICAgIG51ZXZvLmFtb3VudCA9IHNfYW1vdW50O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG51ZXZvID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHRoaXMuYXV4R2V0TGFiZWxGb3JIb3VyKGN1cnJlbnQgJSAyNCksXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiBpbnZlcnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lOiBaRVJPX0NVUlJFTkNZLFxuICAgICAgICAgICAgICAgICAgICAgICAgYW1vdW50OiBaRVJPX0NPTU9ESVRZLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogY3VycmVudF9kYXRlLnRvSVNPU3RyaW5nKCkuc3BsaXQoXCIuXCIpWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgaG91cjogY3VycmVudFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsYXN0XzI0aFtjdXJyZW50XSA9IGNydWRlW2N1cnJlbnRdIHx8IG51ZXZvO1xuICAgICAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJjdXJyZW50X2RhdGU6XCIsIGN1cnJlbnRfZGF0ZS50b0lTT1N0cmluZygpLCBjdXJyZW50LCBsYXN0XzI0aFtjdXJyZW50XSk7XG5cbiAgICAgICAgICAgICAgICAvLyBjb25pbmljYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIHByaWNlID0gbGFzdF8yNGhbY3VycmVudF0ucHJpY2U7XG4gICAgICAgICAgICAgICAgdmFyIHZvbCA9IG5ldyBBc3NldERFWChsYXN0XzI0aFtjdXJyZW50XS52b2x1bWUsIHRoaXMpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHZvbC50b2tlbi5zeW1ib2wgPT0gdm9sdW1lLnRva2VuLnN5bWJvbCwgXCJFUlJPUjogZGlmZmVyZW50IHRva2Vuc1wiLCB2b2wuc3RyLCB2b2x1bWUuc3RyKTtcbiAgICAgICAgICAgICAgICB2b2x1bWUuYW1vdW50ID0gdm9sdW1lLmFtb3VudC5wbHVzKHZvbC5hbW91bnQpO1xuICAgICAgICAgICAgICAgIGlmIChwcmljZSAhPSBaRVJPX0NVUlJFTkNZICYmICFwcmljZV9mc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpY2VfZnN0ID0gbmV3IEFzc2V0REVYKHByaWNlLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJpY2VfYXNzZXQgPSBuZXcgQXNzZXRERVgocHJpY2UsIHRoaXMpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHByaWNlX2Fzc2V0LnRva2VuLnN5bWJvbCA9PSBtYXhfcHJpY2UudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiBkaWZmZXJlbnQgdG9rZW5zXCIsIHByaWNlX2Fzc2V0LnN0ciwgbWF4X3ByaWNlLnN0cik7XG4gICAgICAgICAgICAgICAgaWYgKHByaWNlX2Fzc2V0LmFtb3VudC5pc0dyZWF0ZXJUaGFuKG1heF9wcmljZS5hbW91bnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heF9wcmljZSA9IHByaWNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHByaWNlX2Fzc2V0LnRva2VuLnN5bWJvbCA9PSBtaW5fcHJpY2UudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiBkaWZmZXJlbnQgdG9rZW5zXCIsIHByaWNlX2Fzc2V0LnN0ciwgbWluX3ByaWNlLnN0cik7XG4gICAgICAgICAgICAgICAgaWYgKG1pbl9wcmljZS5hbW91bnQuaXNFcXVhbFRvKDApIHx8IHByaWNlX2Fzc2V0LmFtb3VudC5pc0xlc3NUaGFuKG1pbl9wcmljZS5hbW91bnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbl9wcmljZSA9IHByaWNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcmV2ZXJzZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgaW52ZXJzZSA9IGxhc3RfMjRoW2N1cnJlbnRdLmludmVyc2U7XG4gICAgICAgICAgICAgICAgdmFyIGFtbyA9IG5ldyBBc3NldERFWChsYXN0XzI0aFtjdXJyZW50XS5hbW91bnQsIHRoaXMpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGFtby50b2tlbi5zeW1ib2wgPT0gYW1vdW50LnRva2VuLnN5bWJvbCwgXCJFUlJPUjogZGlmZmVyZW50IHRva2Vuc1wiLCBhbW8uc3RyLCBhbW91bnQuc3RyKTtcbiAgICAgICAgICAgICAgICBhbW91bnQuYW1vdW50ID0gYW1vdW50LmFtb3VudC5wbHVzKGFtby5hbW91bnQpO1xuICAgICAgICAgICAgICAgIGlmIChpbnZlcnNlICE9IFpFUk9fQ09NT0RJVFkgJiYgIWludmVyc2VfZnN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGludmVyc2VfZnN0ID0gbmV3IEFzc2V0REVYKGludmVyc2UsIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbnZlcnNlX2Fzc2V0ID0gbmV3IEFzc2V0REVYKGludmVyc2UsIHRoaXMpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGludmVyc2VfYXNzZXQudG9rZW4uc3ltYm9sID09IG1heF9pbnZlcnNlLnRva2VuLnN5bWJvbCwgXCJFUlJPUjogZGlmZmVyZW50IHRva2Vuc1wiLCBpbnZlcnNlX2Fzc2V0LnN0ciwgbWF4X2ludmVyc2Uuc3RyKTtcbiAgICAgICAgICAgICAgICBpZiAoaW52ZXJzZV9hc3NldC5hbW91bnQuaXNHcmVhdGVyVGhhbihtYXhfaW52ZXJzZS5hbW91bnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heF9pbnZlcnNlID0gaW52ZXJzZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChpbnZlcnNlX2Fzc2V0LnRva2VuLnN5bWJvbCA9PSBtaW5faW52ZXJzZS50b2tlbi5zeW1ib2wsIFwiRVJST1I6IGRpZmZlcmVudCB0b2tlbnNcIiwgaW52ZXJzZV9hc3NldC5zdHIsIG1pbl9pbnZlcnNlLnN0cik7XG4gICAgICAgICAgICAgICAgaWYgKG1pbl9pbnZlcnNlLmFtb3VudC5pc0VxdWFsVG8oMCkgfHwgaW52ZXJzZV9hc3NldC5hbW91bnQuaXNMZXNzVGhhbihtaW5faW52ZXJzZS5hbW91bnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbl9pbnZlcnNlID0gaW52ZXJzZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGNvbmluaWNhbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBpZiAoIXByaWNlX2ZzdCkge1xuICAgICAgICAgICAgICAgIHByaWNlX2ZzdCA9IG5ldyBBc3NldERFWChsYXN0XzI0aFtzdGFydF9ob3VyXS5wcmljZSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbGFzdF9wcmljZSA9ICBuZXcgQXNzZXRERVgobGFzdF8yNGhbbm93X2hvdXJdLnByaWNlLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBkaWZmID0gbGFzdF9wcmljZS5jbG9uZSgpO1xuICAgICAgICAgICAgLy8gZGlmZi5hbW91bnQgXG4gICAgICAgICAgICBkaWZmLmFtb3VudCA9IGxhc3RfcHJpY2UuYW1vdW50Lm1pbnVzKHByaWNlX2ZzdC5hbW91bnQpO1xuICAgICAgICAgICAgdmFyIHJhdGlvOm51bWJlciA9IDA7XG4gICAgICAgICAgICBpZiAocHJpY2VfZnN0LmFtb3VudC50b051bWJlcigpICE9IDApIHtcbiAgICAgICAgICAgICAgICByYXRpbyA9IGRpZmYuYW1vdW50LmRpdmlkZWRCeShwcmljZV9mc3QuYW1vdW50KS50b051bWJlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHBlcmNlbnQgPSBNYXRoLmZsb29yKHJhdGlvICogMTAwMDApIC8gMTAwO1xuXG4gICAgICAgICAgICAvLyByZXZlcnNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIGlmICghaW52ZXJzZV9mc3QpIHtcbiAgICAgICAgICAgICAgICBpbnZlcnNlX2ZzdCA9IG5ldyBBc3NldERFWChsYXN0XzI0aFtzdGFydF9ob3VyXS5pbnZlcnNlLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsYXN0X2ludmVyc2UgPSAgbmV3IEFzc2V0REVYKGxhc3RfMjRoW25vd19ob3VyXS5pbnZlcnNlLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBpZGlmZiA9IGxhc3RfaW52ZXJzZS5jbG9uZSgpO1xuICAgICAgICAgICAgLy8gZGlmZi5hbW91bnQgXG4gICAgICAgICAgICBpZGlmZi5hbW91bnQgPSBsYXN0X2ludmVyc2UuYW1vdW50Lm1pbnVzKGludmVyc2VfZnN0LmFtb3VudCk7XG4gICAgICAgICAgICByYXRpbyA9IDA7XG4gICAgICAgICAgICBpZiAoaW52ZXJzZV9mc3QuYW1vdW50LnRvTnVtYmVyKCkgIT0gMCkge1xuICAgICAgICAgICAgICAgIHJhdGlvID0gZGlmZi5hbW91bnQuZGl2aWRlZEJ5KGludmVyc2VfZnN0LmFtb3VudCkudG9OdW1iZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBpcGVyY2VudCA9IE1hdGguZmxvb3IocmF0aW8gKiAxMDAwMCkgLyAxMDA7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwicHJpY2VfZnN0OlwiLCBwcmljZV9mc3Quc3RyKTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJpbnZlcnNlX2ZzdDpcIiwgaW52ZXJzZV9mc3Quc3RyKTtcblxuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcImxhc3RfMjRoOlwiLCBbbGFzdF8yNGhdKTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJkaWZmOlwiLCBkaWZmLnRvU3RyaW5nKDgpKTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJwZXJjZW50OlwiLCBwZXJjZW50KTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJyYXRpbzpcIiwgcmF0aW8pO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcInZvbHVtZTpcIiwgdm9sdW1lLnN0cik7XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LnByaWNlID0gbGFzdF9wcmljZTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LmludmVyc2UgPSBsYXN0X2ludmVyc2U7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5wcmljZV8yNGhfYWdvID0gcHJpY2VfZnN0IHx8IGxhc3RfcHJpY2U7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5pbnZlcnNlXzI0aF9hZ28gPSBpbnZlcnNlX2ZzdDtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LnBlcmNlbnRfc3RyID0gKGlzTmFOKHBlcmNlbnQpID8gMCA6IHBlcmNlbnQpICsgXCIlXCI7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5wZXJjZW50ID0gaXNOYU4ocGVyY2VudCkgPyAwIDogcGVyY2VudDtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LmlwZXJjZW50X3N0ciA9IChpc05hTihpcGVyY2VudCkgPyAwIDogaXBlcmNlbnQpICsgXCIlXCI7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5pcGVyY2VudCA9IGlzTmFOKGlwZXJjZW50KSA/IDAgOiBpcGVyY2VudDtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LnZvbHVtZSA9IHZvbHVtZTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LmFtb3VudCA9IGFtb3VudDtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5Lm1pbl9wcmljZSA9IG1pbl9wcmljZTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5Lm1heF9wcmljZSA9IG1heF9wcmljZTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5Lm1pbl9pbnZlcnNlID0gbWluX2ludmVyc2U7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5tYXhfaW52ZXJzZSA9IG1heF9pbnZlcnNlO1xuXG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiU3VtbWFyeSBmaW5hbDpcIiwgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkpO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwic3VtbWFyeS5cIitjYW5vbmljYWwsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwic3VtbWFyeS5cIitpbnZlcnNlLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gJiYgIWZvcmNlKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IGF1eDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0TWFya2V0U3VtbWFyeSgpO1xuICAgICAgICB0aGlzLm9uTWFya2V0U3VtbWFyeS5uZXh0KHJlc3VsdCk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRBbGxUYWJsZXNTdW1hcmllcygpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0T3JkZXJTdW1tYXJ5LnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZXMgPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLl9tYXJrZXRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkuaW5kZXhPZihcIi5cIikgPT0gLTEpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIHZhciBwID0gdGhpcy5nZXRUYWJsZVN1bW1hcnkodGhpcy5fbWFya2V0c1tpXS5jb21vZGl0eSwgdGhpcy5fbWFya2V0c1tpXS5jdXJyZW5jeSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVG9rZW5zU3VtbWFyeSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgfVxuICAgIFxuXG4gICAgLy9cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEF1eCBmdW5jdGlvbnNcbiAgICBwcml2YXRlIGF1eFByb2Nlc3NSb3dzVG9PcmRlcnMocm93czphbnlbXSk6IE9yZGVyW10ge1xuICAgICAgICB2YXIgcmVzdWx0OiBPcmRlcltdID0gW107XG4gICAgICAgIGZvciAodmFyIGk9MDsgaSA8IHJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwcmljZSA9IG5ldyBBc3NldERFWChyb3dzW2ldLnByaWNlLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBpbnZlcnNlID0gbmV3IEFzc2V0REVYKHJvd3NbaV0uaW52ZXJzZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgc2VsbGluZyA9IG5ldyBBc3NldERFWChyb3dzW2ldLnNlbGxpbmcsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIHRvdGFsID0gbmV3IEFzc2V0REVYKHJvd3NbaV0udG90YWwsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIG9yZGVyOk9yZGVyO1xuXG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLmdldFNjb3BlRm9yKHByaWNlLnRva2VuLCBpbnZlcnNlLnRva2VuKTtcbiAgICAgICAgICAgIHZhciBjYW5vbmljYWwgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgICAgIHZhciByZXZlcnNlX3Njb3BlID0gdGhpcy5pbnZlcnNlU2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBpZiAocmV2ZXJzZV9zY29wZSA9PSBzY29wZSkge1xuICAgICAgICAgICAgICAgIG9yZGVyID0ge1xuICAgICAgICAgICAgICAgICAgICBpZDogcm93c1tpXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHByaWNlLFxuICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiBpbnZlcnNlLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogc2VsbGluZyxcbiAgICAgICAgICAgICAgICAgICAgZGVwb3NpdDogc2VsbGluZyxcbiAgICAgICAgICAgICAgICAgICAgdGVsb3M6IHRvdGFsLFxuICAgICAgICAgICAgICAgICAgICBvd25lcjogcm93c1tpXS5vd25lclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3JkZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiByb3dzW2ldLmlkLFxuICAgICAgICAgICAgICAgICAgICBwcmljZTogaW52ZXJzZSxcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgZGVwb3NpdDogc2VsbGluZyxcbiAgICAgICAgICAgICAgICAgICAgdGVsb3M6IHNlbGxpbmcsXG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiByb3dzW2ldLm93bmVyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0LnB1c2gob3JkZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhdXhHZXRMYWJlbEZvckhvdXIoaGg6bnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGhvdXJzID0gW1xuICAgICAgICAgICAgXCJoLnplcm9cIixcbiAgICAgICAgICAgIFwiaC5vbmVcIixcbiAgICAgICAgICAgIFwiaC50d29cIixcbiAgICAgICAgICAgIFwiaC50aHJlZVwiLFxuICAgICAgICAgICAgXCJoLmZvdXJcIixcbiAgICAgICAgICAgIFwiaC5maXZlXCIsXG4gICAgICAgICAgICBcImguc2l4XCIsXG4gICAgICAgICAgICBcImguc2V2ZW5cIixcbiAgICAgICAgICAgIFwiaC5laWdodFwiLFxuICAgICAgICAgICAgXCJoLm5pbmVcIixcbiAgICAgICAgICAgIFwiaC50ZW5cIixcbiAgICAgICAgICAgIFwiaC5lbGV2ZW5cIixcbiAgICAgICAgICAgIFwiaC50d2VsdmVcIixcbiAgICAgICAgICAgIFwiaC50aGlydGVlblwiLFxuICAgICAgICAgICAgXCJoLmZvdXJ0ZWVuXCIsXG4gICAgICAgICAgICBcImguZmlmdGVlblwiLFxuICAgICAgICAgICAgXCJoLnNpeHRlZW5cIixcbiAgICAgICAgICAgIFwiaC5zZXZlbnRlZW5cIixcbiAgICAgICAgICAgIFwiaC5laWdodGVlblwiLFxuICAgICAgICAgICAgXCJoLm5pbmV0ZWVuXCIsXG4gICAgICAgICAgICBcImgudHdlbnR5XCIsXG4gICAgICAgICAgICBcImgudHdlbnR5b25lXCIsXG4gICAgICAgICAgICBcImgudHdlbnR5dHdvXCIsXG4gICAgICAgICAgICBcImgudHdlbnR5dGhyZWVcIlxuICAgICAgICBdXG4gICAgICAgIHJldHVybiBob3Vyc1toaF07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhdXhBc3NlcnRTY29wZShzY29wZTpzdHJpbmcpOiBNYXJrZXQge1xuICAgICAgICB2YXIgY29tb2RpdHlfc3ltID0gc2NvcGUuc3BsaXQoXCIuXCIpWzBdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIHZhciBjdXJyZW5jeV9zeW0gPSBzY29wZS5zcGxpdChcIi5cIilbMV0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgdmFyIGNvbW9kaXR5ID0gdGhpcy5nZXRUb2tlbk5vdyhjb21vZGl0eV9zeW0pO1xuICAgICAgICB2YXIgY3VycmVuY3kgPSB0aGlzLmdldFRva2VuTm93KGN1cnJlbmN5X3N5bSk7XG4gICAgICAgIHZhciBhdXhfYXNzZXRfY29tID0gbmV3IEFzc2V0REVYKDAsIGNvbW9kaXR5KTtcbiAgICAgICAgdmFyIGF1eF9hc3NldF9jdXIgPSBuZXcgQXNzZXRERVgoMCwgY3VycmVuY3kpO1xuXG4gICAgICAgIHZhciBtYXJrZXRfc3VtbWFyeTpNYXJrZXRTdW1tYXJ5ID0ge1xuICAgICAgICAgICAgc2NvcGU6IHNjb3BlLFxuICAgICAgICAgICAgcHJpY2U6IGF1eF9hc3NldF9jdXIsXG4gICAgICAgICAgICBwcmljZV8yNGhfYWdvOiBhdXhfYXNzZXRfY3VyLFxuICAgICAgICAgICAgaW52ZXJzZTogYXV4X2Fzc2V0X2NvbSxcbiAgICAgICAgICAgIGludmVyc2VfMjRoX2FnbzogYXV4X2Fzc2V0X2NvbSxcbiAgICAgICAgICAgIG1heF9pbnZlcnNlOiBhdXhfYXNzZXRfY29tLFxuICAgICAgICAgICAgbWF4X3ByaWNlOiBhdXhfYXNzZXRfY3VyLFxuICAgICAgICAgICAgbWluX2ludmVyc2U6IGF1eF9hc3NldF9jb20sXG4gICAgICAgICAgICBtaW5fcHJpY2U6IGF1eF9hc3NldF9jdXIsXG4gICAgICAgICAgICByZWNvcmRzOiBbXSxcbiAgICAgICAgICAgIHZvbHVtZTogYXV4X2Fzc2V0X2N1cixcbiAgICAgICAgICAgIGFtb3VudDogYXV4X2Fzc2V0X2NvbSxcbiAgICAgICAgICAgIHBlcmNlbnQ6IDAsXG4gICAgICAgICAgICBpcGVyY2VudDogMCxcbiAgICAgICAgICAgIHBlcmNlbnRfc3RyOiBcIjAlXCIsXG4gICAgICAgICAgICBpcGVyY2VudF9zdHI6IFwiMCVcIixcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXJrZXRzW3Njb3BlXSB8fCB7XG4gICAgICAgICAgICBzY29wZTogc2NvcGUsXG4gICAgICAgICAgICBjb21vZGl0eTogY29tb2RpdHksXG4gICAgICAgICAgICBjdXJyZW5jeTogY3VycmVuY3ksXG4gICAgICAgICAgICBvcmRlcnM6IHsgc2VsbDogW10sIGJ1eTogW10gfSxcbiAgICAgICAgICAgIGRlYWxzOiAwLFxuICAgICAgICAgICAgaGlzdG9yeTogW10sXG4gICAgICAgICAgICB0eDoge30sXG4gICAgICAgICAgICBibG9ja3M6IDAsXG4gICAgICAgICAgICBibG9jazoge30sXG4gICAgICAgICAgICBibG9ja2xpc3Q6IFtdLFxuICAgICAgICAgICAgYmxvY2tsZXZlbHM6IFtbXV0sXG4gICAgICAgICAgICByZXZlcnNlYmxvY2tzOiBbXSxcbiAgICAgICAgICAgIHJldmVyc2VsZXZlbHM6IFtbXV0sXG4gICAgICAgICAgICBzdW1tYXJ5OiBtYXJrZXRfc3VtbWFyeSxcbiAgICAgICAgICAgIGhlYWRlcjogeyBcbiAgICAgICAgICAgICAgICBzZWxsOiB7dG90YWw6YXV4X2Fzc2V0X2NvbSwgb3JkZXJzOjB9LCBcbiAgICAgICAgICAgICAgICBidXk6IHt0b3RhbDphdXhfYXNzZXRfY3VyLCBvcmRlcnM6MH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07ICAgICAgICBcbiAgICB9XG5cbiAgICBwcml2YXRlIGZldGNoRGVwb3NpdHMoYWNjb3VudCk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJkZXBvc2l0c1wiLCB7c2NvcGU6YWNjb3VudH0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZmV0Y2hCYWxhbmNlcyhhY2NvdW50KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIGNvbnRyYWN0cyA9IHt9O1xuICAgICAgICAgICAgdmFyIGJhbGFuY2VzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMudG9rZW5zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudG9rZW5zW2ldLm9mZmNoYWluKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjb250cmFjdHNbdGhpcy50b2tlbnNbaV0uY29udHJhY3RdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGNvbnRyYWN0IGluIGNvbnRyYWN0cykge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYmFsYW5jZXMtXCIrY29udHJhY3QsIHRydWUpO1xuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yICh2YXIgY29udHJhY3QgaW4gY29udHJhY3RzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGF3YWl0IHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJhY2NvdW50c1wiLCB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0OmNvbnRyYWN0LFxuICAgICAgICAgICAgICAgICAgICBzY29wZTogYWNjb3VudCB8fCB0aGlzLmN1cnJlbnQubmFtZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gcmVzdWx0LnJvd3MpIHtcbiAgICAgICAgICAgICAgICAgICAgYmFsYW5jZXMucHVzaChuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uYmFsYW5jZSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJhbGFuY2VzLVwiK2NvbnRyYWN0LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYmFsYW5jZXM7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hPcmRlcnMocGFyYW1zOlRhYmxlUGFyYW1zKTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcInNlbGxvcmRlcnNcIiwgcGFyYW1zKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZldGNoT3JkZXJTdW1tYXJ5KCk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJvcmRlcnN1bW1hcnlcIikudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaEJsb2NrSGlzdG9yeShzY29wZTpzdHJpbmcsIHBhZ2U6bnVtYmVyID0gMCwgcGFnZXNpemU6bnVtYmVyID0gMjUpOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHZhciBjYW5vbmljYWw6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgIHZhciBwYWdlcyA9IHRoaXMuZ2V0QmxvY2tIaXN0b3J5VG90YWxQYWdlc0ZvcihjYW5vbmljYWwsIHBhZ2VzaXplKTtcbiAgICAgICAgdmFyIGlkID0gcGFnZSpwYWdlc2l6ZTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWVERVguZmV0Y2hCbG9ja0hpc3RvcnkoXCIsIHNjb3BlLCBcIixcIixwYWdlLFwiLFwiLHBhZ2VzaXplLFwiKTogaWQ6XCIsIGlkLCBcInBhZ2VzOlwiLCBwYWdlcyk7XG4gICAgICAgIGlmIChwYWdlIDwgcGFnZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXJrZXRzICYmIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSAmJiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uYmxvY2tbXCJpZC1cIiArIGlkXSkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQ6VGFibGVSZXN1bHQgPSB7bW9yZTpmYWxzZSxyb3dzOltdfTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8cGFnZXNpemU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWRfaSA9IGlkK2k7XG4gICAgICAgICAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5ibG9ja1tcImlkLVwiICsgaWRfaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnJvd3MucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnJvd3MubGVuZ3RoID09IHBhZ2VzaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGhhdmUgdGhlIGNvbXBsZXRlIHBhZ2UgaW4gbWVtb3J5XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmZldGNoSGlzdG9yeShcIiwgc2NvcGUsIFwiLFwiLHBhZ2UsXCIsXCIscGFnZXNpemUsXCIpOiByZXN1bHQ6XCIsIHJlc3VsdC5yb3dzLm1hcCgoeyBpZCB9KSA9PiBpZCkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwiYmxvY2toaXN0b3J5XCIsIHtzY29wZTpjYW5vbmljYWwsIGxpbWl0OnBhZ2VzaXplLCBsb3dlcl9ib3VuZDpcIlwiKyhwYWdlKnBhZ2VzaXplKX0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImJsb2NrIEhpc3RvcnkgY3J1ZG86XCIsIHJlc3VsdCk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gPSB0aGlzLmF1eEFzc2VydFNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uYmxvY2sgPSB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uYmxvY2sgfHwge307IFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLl9tYXJrZXRzW3Njb3BlXS5ibG9jazpcIiwgdGhpcy5fbWFya2V0c1tzY29wZV0uYmxvY2spO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgcmVzdWx0LnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYmxvY2s6SGlzdG9yeUJsb2NrID0ge1xuICAgICAgICAgICAgICAgICAgICBpZDogcmVzdWx0LnJvd3NbaV0uaWQsXG4gICAgICAgICAgICAgICAgICAgIGhvdXI6IHJlc3VsdC5yb3dzW2ldLmhvdXIsXG4gICAgICAgICAgICAgICAgICAgIHN0cjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5wcmljZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGludmVyc2U6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5pbnZlcnNlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgZW50cmFuY2U6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5lbnRyYW5jZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIG1heDogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLm1heCwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIG1pbjogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLm1pbiwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHZvbHVtZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLnZvbHVtZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudDogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmFtb3VudCwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKHJlc3VsdC5yb3dzW2ldLmRhdGUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJsb2NrLnN0ciA9IEpTT04uc3RyaW5naWZ5KFtibG9jay5tYXguc3RyLCBibG9jay5lbnRyYW5jZS5zdHIsIGJsb2NrLnByaWNlLnN0ciwgYmxvY2subWluLnN0cl0pO1xuICAgICAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5ibG9ja1tcImlkLVwiICsgYmxvY2suaWRdID0gYmxvY2s7XG4gICAgICAgICAgICB9ICAgXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImJsb2NrIEhpc3RvcnkgZmluYWw6XCIsIHRoaXMuX21hcmtldHNbc2NvcGVdLmJsb2NrKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH0gICAgXG5cbiAgICBwcml2YXRlIGZldGNoSGlzdG9yeShzY29wZTpzdHJpbmcsIHBhZ2U6bnVtYmVyID0gMCwgcGFnZXNpemU6bnVtYmVyID0gMjUpOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHZhciBjYW5vbmljYWw6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgIHZhciBwYWdlcyA9IHRoaXMuZ2V0SGlzdG9yeVRvdGFsUGFnZXNGb3IoY2Fub25pY2FsLCBwYWdlc2l6ZSk7XG4gICAgICAgIHZhciBpZCA9IHBhZ2UqcGFnZXNpemU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmZldGNoSGlzdG9yeShcIiwgc2NvcGUsIFwiLFwiLHBhZ2UsXCIsXCIscGFnZXNpemUsXCIpOiBpZDpcIiwgaWQsIFwicGFnZXM6XCIsIHBhZ2VzKTtcbiAgICAgICAgaWYgKHBhZ2UgPCBwYWdlcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX21hcmtldHMgJiYgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdICYmIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eFtcImlkLVwiICsgaWRdKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdDpUYWJsZVJlc3VsdCA9IHttb3JlOmZhbHNlLHJvd3M6W119O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxwYWdlc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpZF9pID0gaWQraTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRyeCA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eFtcImlkLVwiICsgaWRfaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0cngpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5yb3dzLnB1c2godHJ4KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucm93cy5sZW5ndGggPT0gcGFnZXNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgaGF2ZSB0aGUgY29tcGxldGUgcGFnZSBpbiBtZW1vcnlcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWVERVguZmV0Y2hIaXN0b3J5KFwiLCBzY29wZSwgXCIsXCIscGFnZSxcIixcIixwYWdlc2l6ZSxcIik6IHJlc3VsdDpcIiwgcmVzdWx0LnJvd3MubWFwKCh7IGlkIH0pID0+IGlkKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJoaXN0b3J5XCIsIHtzY29wZTpzY29wZSwgbGltaXQ6cGFnZXNpemUsIGxvd2VyX2JvdW5kOlwiXCIrKHBhZ2UqcGFnZXNpemUpfSkudGhlbihyZXN1bHQgPT4ge1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJIaXN0b3J5IGNydWRvOlwiLCByZXN1bHQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gPSB0aGlzLmF1eEFzc2VydFNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uaGlzdG9yeSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnR4ID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnR4IHx8IHt9OyBcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLnNjb3Blc1tzY29wZV0udHg6XCIsIHRoaXMuc2NvcGVzW3Njb3BlXS50eCk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaSA8IHJlc3VsdC5yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zYWN0aW9uOkhpc3RvcnlUeCA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHJlc3VsdC5yb3dzW2ldLmlkLFxuICAgICAgICAgICAgICAgICAgICBzdHI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudDogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmFtb3VudCwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHBheW1lbnQ6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5wYXltZW50LCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgYnV5ZmVlOiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uYnV5ZmVlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgc2VsbGZlZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLnNlbGxmZWUsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBwcmljZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLnByaWNlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmludmVyc2UsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBidXllcjogcmVzdWx0LnJvd3NbaV0uYnV5ZXIsXG4gICAgICAgICAgICAgICAgICAgIHNlbGxlcjogcmVzdWx0LnJvd3NbaV0uc2VsbGVyLFxuICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShyZXN1bHQucm93c1tpXS5kYXRlKSxcbiAgICAgICAgICAgICAgICAgICAgaXNidXk6ICEhcmVzdWx0LnJvd3NbaV0uaXNidXlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb24uc3RyID0gdHJhbnNhY3Rpb24ucHJpY2Uuc3RyICsgXCIgXCIgKyB0cmFuc2FjdGlvbi5hbW91bnQuc3RyO1xuICAgICAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eFtcImlkLVwiICsgdHJhbnNhY3Rpb24uaWRdID0gdHJhbnNhY3Rpb247XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogaW4gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnR4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmhpc3RvcnkucHVzaCh0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0udHhbal0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uaGlzdG9yeS5zb3J0KGZ1bmN0aW9uKGE6SGlzdG9yeVR4LCBiOkhpc3RvcnlUeCl7XG4gICAgICAgICAgICAgICAgaWYoYS5kYXRlIDwgYi5kYXRlKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBpZihhLmRhdGUgPiBiLmRhdGUpIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICBpZihhLmlkIDwgYi5pZCkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgaWYoYS5pZCA+IGIuaWQpIHJldHVybiAtMTtcbiAgICAgICAgICAgIH0pOyAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkhpc3RvcnkgZmluYWw6XCIsIHRoaXMuc2NvcGVzW3Njb3BlXS5oaXN0b3J5KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGFzeW5jIGZldGNoQWN0aXZpdHkocGFnZTpudW1iZXIgPSAwLCBwYWdlc2l6ZTpudW1iZXIgPSAyNSkge1xuICAgICAgICB2YXIgaWQgPSBwYWdlKnBhZ2VzaXplKzE7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmZldGNoQWN0aXZpdHkoXCIsIHBhZ2UsXCIsXCIscGFnZXNpemUsXCIpOiBpZDpcIiwgaWQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZpdHkuZXZlbnRzW1wiaWQtXCIgKyBpZF0pIHtcbiAgICAgICAgICAgIHZhciBwYWdlRXZlbnRzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8cGFnZXNpemU7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpZF9pID0gaWQraTtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnQgPSB0aGlzLmFjdGl2aXR5LmV2ZW50c1tcImlkLVwiICsgaWRfaV07XG4gICAgICAgICAgICAgICAgaWYgKCFldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFnZUV2ZW50cy5sZW5ndGggPT0gcGFnZXNpemUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxuICAgICAgICB9ICAgICAgICBcblxuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcImV2ZW50c1wiLCB7bGltaXQ6cGFnZXNpemUsIGxvd2VyX2JvdW5kOlwiXCIraWR9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJBY3Rpdml0eSBjcnVkbzpcIiwgcmVzdWx0KTtcbiAgICAgICAgICAgIHZhciBsaXN0OkV2ZW50TG9nW10gPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgcmVzdWx0LnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSByZXN1bHQucm93c1tpXS5pZDtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnQ6RXZlbnRMb2cgPSA8RXZlbnRMb2c+cmVzdWx0LnJvd3NbaV07XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmFjdGl2aXR5LmV2ZW50c1tcImlkLVwiICsgaWRdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZpdHkuZXZlbnRzW1wiaWQtXCIgKyBpZF0gPSBldmVudDtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKj4+Pj4+XCIsIGlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdHkubGlzdCA9IFtdLmNvbmNhdCh0aGlzLmFjdGl2aXR5Lmxpc3QpLmNvbmNhdChsaXN0KTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdHkubGlzdC5zb3J0KGZ1bmN0aW9uKGE6RXZlbnRMb2csIGI6RXZlbnRMb2cpe1xuICAgICAgICAgICAgICAgIGlmKGEuZGF0ZSA8IGIuZGF0ZSkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgaWYoYS5kYXRlID4gYi5kYXRlKSByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgaWYoYS5pZCA8IGIuaWQpIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmKGEuaWQgPiBiLmlkKSByZXR1cm4gLTE7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hVc2VyT3JkZXJzKHVzZXI6c3RyaW5nKTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcInVzZXJvcmRlcnNcIiwge3Njb3BlOnVzZXIsIGxpbWl0OjIwMH0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGZldGNoU3VtbWFyeShzY29wZSk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJ0YWJsZXN1bW1hcnlcIiwge3Njb3BlOnNjb3BlfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaFRva2VuU3RhdHModG9rZW4pOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidG9rZW4tc3RhdC1cIit0b2tlbi5zeW1ib2wsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcInN0YXRcIiwge2NvbnRyYWN0OnRva2VuLmNvbnRyYWN0LCBzY29wZTp0b2tlbi5zeW1ib2x9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB0b2tlbi5zdGF0ID0gcmVzdWx0LnJvd3NbMF07XG4gICAgICAgICAgICBpZiAodG9rZW4uc3RhdC5pc3N1ZXJzICYmIHRva2VuLnN0YXQuaXNzdWVyc1swXSA9PSBcImV2ZXJ5b25lXCIpIHtcbiAgICAgICAgICAgICAgICB0b2tlbi5mYWtlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidG9rZW4tc3RhdC1cIit0b2tlbi5zeW1ib2wsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaFRva2Vuc1N0YXRzKGV4dGVuZGVkOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZS5mZXRjaFRva2VucygpXCIpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInRva2VuLXN0YXRzXCIsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oXyA9PiB7XG5cbiAgICAgICAgICAgIHZhciBwcmlvbWlzZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy50b2tlbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50b2tlbnNbaV0ub2ZmY2hhaW4pIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIHByaW9taXNlcy5wdXNoKHRoaXMuZmV0Y2hUb2tlblN0YXRzKHRoaXMudG9rZW5zW2ldKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbDxhbnk+KHByaW9taXNlcykudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VG9rZW5TdGF0cyh0aGlzLnRva2Vucyk7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ0b2tlbi1zdGF0c1wiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zO1xuICAgICAgICAgICAgfSk7ICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgdXBkYXRlVG9rZW5zU3VtbWFyeSh0aW1lczogbnVtYmVyID0gMjApIHtcbiAgICAgICAgaWYgKHRpbWVzID4gMSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHRpbWVzOyBpPjA7IGktLSkgdGhpcy51cGRhdGVUb2tlbnNTdW1tYXJ5KDEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IFxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGhpcy53YWl0VG9rZW5zTG9hZGVkLFxuICAgICAgICAgICAgdGhpcy53YWl0TWFya2V0U3VtbWFyeVxuICAgICAgICBdKS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIoaW5pKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZS51cGRhdGVUb2tlbnNTdW1tYXJ5KClcIik7IFxuXG4gICAgICAgICAgICAvLyBtYXBwaW5nIG9mIGhvdyBtdWNoIChhbW91bnQgb2YpIHRva2VucyBoYXZlIGJlZW4gdHJhZGVkIGFncmVnYXRlZCBpbiBhbGwgbWFya2V0c1xuICAgICAgICAgICAgdmFyIGFtb3VudF9tYXA6e1trZXk6c3RyaW5nXTpBc3NldERFWH0gPSB7fTtcblxuICAgICAgICAgICAgLy8gYSBjYWRhIHRva2VuIGxlIGFzaWdubyB1biBwcmljZSBxdWUgc2FsZSBkZSB2ZXJpZmljYXIgc3UgcHJpY2UgZW4gZWwgbWVyY2FkbyBwcmluY2lwYWwgWFhYL1RMT1NcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy50b2tlbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50b2tlbnNbaV0ub2ZmY2hhaW4pIGNvbnRpbnVlOyAvLyBkaXNjYXJkIHRva2VucyB0aGF0IGFyZSBub3Qgb24tY2hhaW5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLnRva2Vuc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgcXVhbnRpdHk6QXNzZXRERVggPSBuZXcgQXNzZXRERVgoMCwgdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiB0aGlzLl9tYXJrZXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqLmluZGV4T2YoXCIuXCIpID09IC0xKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlOk1hcmtldCA9IHRoaXMuX21hcmtldHNbal07XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY29tb2RpdHkuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkgPSBxdWFudGl0eS5wbHVzKHRhYmxlLnN1bW1hcnkuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkgPSBxdWFudGl0eS5wbHVzKHRhYmxlLnN1bW1hcnkudm9sdW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sICYmIHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSB0aGlzLnRlbG9zLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuLnN1bW1hcnkgJiYgdG9rZW4uc3VtbWFyeS5wcmljZS5hbW91bnQudG9OdW1iZXIoKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLnN1bW1hcnk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkgPSB0b2tlbi5zdW1tYXJ5IHx8IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogdGFibGUuc3VtbWFyeS5wcmljZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlXzI0aF9hZ286IHRhYmxlLnN1bW1hcnkucHJpY2VfMjRoX2Fnby5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZTogdGFibGUuc3VtbWFyeS52b2x1bWUuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJjZW50OiB0YWJsZS5zdW1tYXJ5LnBlcmNlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyY2VudF9zdHI6IHRhYmxlLnN1bW1hcnkucGVyY2VudF9zdHIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBhbW91bnRfbWFwW3Rva2VuLnN5bWJvbF0gPSBxdWFudGl0eTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy50ZWxvcy5zdW1tYXJ5ID0ge1xuICAgICAgICAgICAgICAgIHByaWNlOiBuZXcgQXNzZXRERVgoMSwgdGhpcy50ZWxvcyksXG4gICAgICAgICAgICAgICAgcHJpY2VfMjRoX2FnbzogbmV3IEFzc2V0REVYKDEsIHRoaXMudGVsb3MpLFxuICAgICAgICAgICAgICAgIHZvbHVtZTogbmV3IEFzc2V0REVYKC0xLCB0aGlzLnRlbG9zKSxcbiAgICAgICAgICAgICAgICBwZXJjZW50OiAwLFxuICAgICAgICAgICAgICAgIHBlcmNlbnRfc3RyOiBcIjAlXCJcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJhbW91bnRfbWFwOiBcIiwgYW1vdW50X21hcCk7XG5cblxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgT05FID0gbmV3IEJpZ051bWJlcigxKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnRva2Vucykge1xuICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IHRoaXMudG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5vZmZjaGFpbikgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKCF0b2tlbi5zdW1tYXJ5KSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4uc3ltYm9sID09IHRoaXMudGVsb3Muc3ltYm9sKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlRPS0VOOiAtLS0tLS0tLSBcIiwgdG9rZW4uc3ltYm9sLCB0b2tlbi5zdW1tYXJ5LnByaWNlLnN0ciwgdG9rZW4uc3VtbWFyeS5wcmljZV8yNGhfYWdvLnN0ciApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciB2b2x1bWUgPSBuZXcgQXNzZXRERVgoMCwgdGhpcy50ZWxvcyk7XG4gICAgICAgICAgICAgICAgdmFyIHByaWNlID0gbmV3IEFzc2V0REVYKDAsIHRoaXMudGVsb3MpO1xuICAgICAgICAgICAgICAgIHZhciBwcmljZV9pbml0ID0gbmV3IEFzc2V0REVYKDAsIHRoaXMudGVsb3MpO1xuICAgICAgICAgICAgICAgIHZhciB0b3RhbF9xdWFudGl0eSA9IGFtb3VudF9tYXBbdG9rZW4uc3ltYm9sXTtcblxuICAgICAgICAgICAgICAgIGlmICh0b3RhbF9xdWFudGl0eS50b051bWJlcigpID09IDApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgKHRva2VuLnN5bWJvbCA9PSBcIkFDT1JOXCIpIGNvbnNvbGUubG9nKFwiVE9LRU46IC0tLS0tLS0tIFwiLCB0b2tlbi5zeW1ib2wsIHRva2VuLnN1bW1hcnkucHJpY2Uuc3RyLCB0b2tlbi5zdW1tYXJ5LnByaWNlXzI0aF9hZ28uc3RyICk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiB0aGlzLl9tYXJrZXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqLmluZGV4T2YoXCIuXCIpID09IC0xKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlID0gdGhpcy5fbWFya2V0c1tqXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbmN5X3ByaWNlID0gdGFibGUuY3VycmVuY3kuc3ltYm9sID09IFwiVExPU1wiID8gT05FIDogdGFibGUuY3VycmVuY3kuc3VtbWFyeS5wcmljZS5hbW91bnQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW5jeV9wcmljZV8yNGhfYWdvID0gdGFibGUuY3VycmVuY3kuc3ltYm9sID09IFwiVExPU1wiID8gT05FIDogdGFibGUuY3VycmVuY3kuc3VtbWFyeS5wcmljZV8yNGhfYWdvLmFtb3VudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmNvbW9kaXR5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wgfHwgdGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBob3cgbXVjaCBxdWFudGl0eSBpcyBpbnZvbHZlZCBpbiB0aGlzIG1hcmtldFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHF1YW50aXR5ID0gbmV3IEFzc2V0REVYKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY29tb2RpdHkuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gdGFibGUuc3VtbWFyeS5hbW91bnQuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gdGFibGUuc3VtbWFyeS52b2x1bWUuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBpbmZsdWVuY2Utd2VpZ2h0IG9mIHRoaXMgbWFya2V0IG92ZXIgdGhlIHRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgd2VpZ2h0ID0gcXVhbnRpdHkuYW1vdW50LmRpdmlkZWRCeSh0b3RhbF9xdWFudGl0eS5hbW91bnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIHByaWNlIG9mIHRoaXMgdG9rZW4gaW4gdGhpcyBtYXJrZXQgKGV4cHJlc3NlZCBpbiBUTE9TKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlX2Ftb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfYW1vdW50ID0gdGFibGUuc3VtbWFyeS5wcmljZS5hbW91bnQubXVsdGlwbGllZEJ5KHRhYmxlLmN1cnJlbmN5LnN1bW1hcnkucHJpY2UuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2Ftb3VudCA9IHRhYmxlLnN1bW1hcnkuaW52ZXJzZS5hbW91bnQubXVsdGlwbGllZEJ5KHRhYmxlLmNvbW9kaXR5LnN1bW1hcnkucHJpY2UuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoaXMgbWFya2V0IHRva2VuIHByaWNlIG11bHRpcGxpZWQgYnkgdGhlIHdpZ2h0IG9mIHRoaXMgbWFya2V0IChwb25kZXJhdGVkIHByaWNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlX2kgPSBuZXcgQXNzZXRERVgocHJpY2VfYW1vdW50Lm11bHRpcGxpZWRCeSh3ZWlnaHQpLCB0aGlzLnRlbG9zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBwcmljZSBvZiB0aGlzIHRva2VuIGluIHRoaXMgbWFya2V0IDI0aCBhZ28gKGV4cHJlc3NlZCBpbiBUTE9TKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlX2luaXRfYW1vdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmNvbW9kaXR5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZV9pbml0X2Ftb3VudCA9IHRhYmxlLnN1bW1hcnkucHJpY2VfMjRoX2Fnby5hbW91bnQubXVsdGlwbGllZEJ5KHRhYmxlLmN1cnJlbmN5LnN1bW1hcnkucHJpY2VfMjRoX2Fnby5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfaW5pdF9hbW91bnQgPSB0YWJsZS5zdW1tYXJ5LmludmVyc2VfMjRoX2Fnby5hbW91bnQubXVsdGlwbGllZEJ5KHRhYmxlLmNvbW9kaXR5LnN1bW1hcnkucHJpY2VfMjRoX2Fnby5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhpcyBtYXJrZXQgdG9rZW4gcHJpY2UgMjRoIGFnbyBtdWx0aXBsaWVkIGJ5IHRoZSB3ZWlnaHQgb2YgdGhpcyBtYXJrZXQgKHBvbmRlcmF0ZWQgaW5pdF9wcmljZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmljZV9pbml0X2kgPSBuZXcgQXNzZXRERVgocHJpY2VfaW5pdF9hbW91bnQubXVsdGlwbGllZEJ5KHdlaWdodCksIHRoaXMudGVsb3MpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBob3cgbXVjaCB2b2x1bWUgaXMgaW52b2x2ZWQgaW4gdGhpcyBtYXJrZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2b2x1bWVfaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lX2kgPSB0YWJsZS5zdW1tYXJ5LnZvbHVtZS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lX2kgPSB0YWJsZS5zdW1tYXJ5LmFtb3VudC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGlzIG1hcmtldCBkb2VzIG5vdCBtZXN1cmUgdGhlIHZvbHVtZSBpbiBUTE9TLCB0aGVuIGNvbnZlcnQgcXVhbnRpdHkgdG8gVExPUyBieSBtdWx0aXBsaWVkIEJ5IHZvbHVtZSdzIHRva2VuIHByaWNlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodm9sdW1lX2kudG9rZW4uc3ltYm9sICE9IHRoaXMudGVsb3Muc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lX2kgPSBuZXcgQXNzZXRERVgocXVhbnRpdHkuYW1vdW50Lm11bHRpcGxpZWRCeShxdWFudGl0eS50b2tlbi5zdW1tYXJ5LnByaWNlLmFtb3VudCksIHRoaXMudGVsb3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlID0gcHJpY2UucGx1cyhuZXcgQXNzZXRERVgocHJpY2VfaSwgdGhpcy50ZWxvcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfaW5pdCA9IHByaWNlX2luaXQucGx1cyhuZXcgQXNzZXRERVgocHJpY2VfaW5pdF9pLCB0aGlzLnRlbG9zKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWUgPSB2b2x1bWUucGx1cyhuZXcgQXNzZXRERVgodm9sdW1lX2ksIHRoaXMudGVsb3MpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItaVwiLGksIHRhYmxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSB3ZWlnaHQ6XCIsIHdlaWdodC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSB0YWJsZS5zdW1tYXJ5LnByaWNlLnN0clwiLCB0YWJsZS5zdW1tYXJ5LnByaWNlLnN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gdGFibGUuc3VtbWFyeS5wcmljZS5hbW91bnQubXVsdGlwbGllZEJ5KHdlaWdodCkudG9OdW1iZXIoKVwiLCB0YWJsZS5zdW1tYXJ5LnByaWNlLmFtb3VudC5tdWx0aXBsaWVkQnkod2VpZ2h0KS50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSBjdXJyZW5jeV9wcmljZS50b051bWJlcigpXCIsIGN1cnJlbmN5X3ByaWNlLnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHByaWNlX2k6XCIsIHByaWNlX2kudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gcHJpY2UgLT5cIiwgcHJpY2Uuc3RyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSBjdXJyZW5jeV9wcmljZV8yNGhfYWdvOlwiLCBjdXJyZW5jeV9wcmljZV8yNGhfYWdvLnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHRhYmxlLnN1bW1hcnkucHJpY2VfMjRoX2FnbzpcIiwgdGFibGUuc3VtbWFyeS5wcmljZV8yNGhfYWdvLnN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gcHJpY2VfaW5pdF9pOlwiLCBwcmljZV9pbml0X2kudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gcHJpY2VfaW5pdCAtPlwiLCBwcmljZV9pbml0LnN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGRpZmYgPSBwcmljZS5taW51cyhwcmljZV9pbml0KTtcbiAgICAgICAgICAgICAgICB2YXIgcmF0aW86bnVtYmVyID0gMDtcbiAgICAgICAgICAgICAgICBpZiAocHJpY2VfaW5pdC5hbW91bnQudG9OdW1iZXIoKSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhdGlvID0gZGlmZi5hbW91bnQuZGl2aWRlZEJ5KHByaWNlX2luaXQuYW1vdW50KS50b051bWJlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudCA9IE1hdGguZmxvb3IocmF0aW8gKiAxMDAwMCkgLyAxMDA7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRfc3RyID0gKGlzTmFOKHBlcmNlbnQpID8gMCA6IHBlcmNlbnQpICsgXCIlXCI7XG5cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInByaWNlXCIsIHByaWNlLnN0cik7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwcmljZV8yNGhfYWdvXCIsIHByaWNlX2luaXQuc3RyKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInZvbHVtZVwiLCB2b2x1bWUuc3RyKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInBlcmNlbnRcIiwgcGVyY2VudCk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwZXJjZW50X3N0clwiLCBwZXJjZW50X3N0cik7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJyYXRpb1wiLCByYXRpbyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJkaWZmXCIsIGRpZmYuc3RyKTtcblxuICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkucHJpY2UgPSBwcmljZTtcbiAgICAgICAgICAgICAgICB0b2tlbi5zdW1tYXJ5LnByaWNlXzI0aF9hZ28gPSBwcmljZV9pbml0O1xuICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkucGVyY2VudCA9IHBlcmNlbnQ7XG4gICAgICAgICAgICAgICAgdG9rZW4uc3VtbWFyeS5wZXJjZW50X3N0ciA9IHBlcmNlbnRfc3RyO1xuICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkudm9sdW1lID0gdm9sdW1lO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKGVuZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgdGhpcy5yZXNvcnRUb2tlbnMoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VG9rZW5TdW1tYXJ5KCk7XG4gICAgICAgIH0pOyAgICAgICAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaFRva2VucyhleHRlbmRlZDogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWUuZmV0Y2hUb2tlbnMoKVwiKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcInRva2Vuc1wiKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICB0b2tlbnM6IDxUb2tlbkRFWFtdPnJlc3VsdC5yb3dzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gZGF0YS50b2tlbnMpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnRva2Vuc1tpXS5zY29wZSA9IGRhdGEudG9rZW5zW2ldLnN5bWJvbC50b0xvd2VyQ2FzZSgpICsgXCIudGxvc1wiO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnRva2Vuc1tpXS5zeW1ib2wgPT0gXCJUTE9TXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZWxvcyA9IGRhdGEudG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVzb3J0VG9rZW5zKCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIihpbmkpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJyZXNvcnRUb2tlbnMoKVwiKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLnRva2Vuc1swXVwiLCB0aGlzLnRva2Vuc1swXS5zdW1tYXJ5KTtcbiAgICAgICAgdGhpcy50b2tlbnMuc29ydCgoYTpUb2tlbkRFWCwgYjpUb2tlbkRFWCkgPT4ge1xuICAgICAgICAgICAgLy8gcHVzaCBvZmZjaGFpbiB0b2tlbnMgdG8gdGhlIGVuZCBvZiB0aGUgdG9rZW4gbGlzdFxuICAgICAgICAgICAgaWYgKGEub2ZmY2hhaW4pIHJldHVybiAxO1xuICAgICAgICAgICAgaWYgKGIub2ZmY2hhaW4pIHJldHVybiAtMTtcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIgLS0tIFwiLCBhLnN5bWJvbCwgXCItXCIsIGIuc3ltYm9sLCBcIiAtLS0gXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIgICAgIFwiLCBhLnN1bW1hcnkgPyBhLnN1bW1hcnkudm9sdW1lLnN0ciA6IFwiMFwiLCBcIi1cIiwgYi5zdW1tYXJ5ID8gYi5zdW1tYXJ5LnZvbHVtZS5zdHIgOiBcIjBcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBhX3ZvbCA9IGEuc3VtbWFyeSA/IGEuc3VtbWFyeS52b2x1bWUgOiBuZXcgQXNzZXRERVgoKTtcbiAgICAgICAgICAgIHZhciBiX3ZvbCA9IGIuc3VtbWFyeSA/IGIuc3VtbWFyeS52b2x1bWUgOiBuZXcgQXNzZXRERVgoKTtcblxuICAgICAgICAgICAgaWYoYV92b2wuYW1vdW50LmlzR3JlYXRlclRoYW4oYl92b2wuYW1vdW50KSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgaWYoYV92b2wuYW1vdW50LmlzTGVzc1RoYW4oYl92b2wuYW1vdW50KSkgcmV0dXJuIDE7XG5cbiAgICAgICAgICAgIGlmKGEuYXBwbmFtZSA8IGIuYXBwbmFtZSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgaWYoYS5hcHBuYW1lID4gYi5hcHBuYW1lKSByZXR1cm4gMTtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9KTsgXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJyZXNvcnRUb2tlbnMoKVwiLCB0aGlzLnRva2Vucyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKGVuZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuXG4gICAgICAgIHRoaXMub25Ub2tlbnNSZWFkeS5uZXh0KHRoaXMudG9rZW5zKTsgICAgICAgIFxuICAgIH1cblxuXG59XG5cblxuZXhwb3J0IGludGVyZmFjZSBNYXJrZXRNYXAge1xuICAgIFtrZXk6c3RyaW5nXTogTWFya2V0O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1hcmtldCB7XG4gICAgc2NvcGU6IHN0cmluZztcbiAgICBjb21vZGl0eTogVG9rZW5ERVgsXG4gICAgY3VycmVuY3k6IFRva2VuREVYLFxuICAgIGRlYWxzOiBudW1iZXI7XG4gICAgYmxvY2tzOiBudW1iZXI7XG4gICAgYmxvY2tsZXZlbHM6IGFueVtdW11bXTtcbiAgICBibG9ja2xpc3Q6IGFueVtdW107XG4gICAgcmV2ZXJzZWxldmVsczogYW55W11bXVtdO1xuICAgIHJldmVyc2VibG9ja3M6IGFueVtdW107XG4gICAgYmxvY2s6IHtbaWQ6c3RyaW5nXTpIaXN0b3J5QmxvY2t9O1xuICAgIG9yZGVyczogVG9rZW5PcmRlcnM7XG4gICAgaGlzdG9yeTogSGlzdG9yeVR4W107XG4gICAgdHg6IHtbaWQ6c3RyaW5nXTpIaXN0b3J5VHh9O1xuICAgIFxuICAgIHN1bW1hcnk6IE1hcmtldFN1bW1hcnk7XG4gICAgaGVhZGVyOiBNYXJrZXRIZWFkZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFya2V0U3VtbWFyeSB7XG4gICAgc2NvcGU6c3RyaW5nLFxuICAgIHByaWNlOkFzc2V0REVYLFxuICAgIGludmVyc2U6QXNzZXRERVgsXG4gICAgcHJpY2VfMjRoX2FnbzpBc3NldERFWCxcbiAgICBpbnZlcnNlXzI0aF9hZ286QXNzZXRERVgsXG4gICAgbWluX3ByaWNlPzpBc3NldERFWCxcbiAgICBtYXhfcHJpY2U/OkFzc2V0REVYLFxuICAgIG1pbl9pbnZlcnNlPzpBc3NldERFWCxcbiAgICBtYXhfaW52ZXJzZT86QXNzZXRERVgsXG4gICAgdm9sdW1lOkFzc2V0REVYLFxuICAgIGFtb3VudD86QXNzZXRERVgsXG4gICAgcGVyY2VudD86bnVtYmVyLFxuICAgIHBlcmNlbnRfc3RyPzpzdHJpbmcsXG4gICAgaXBlcmNlbnQ/Om51bWJlcixcbiAgICBpcGVyY2VudF9zdHI/OnN0cmluZyxcbiAgICByZWNvcmRzPzogYW55W11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBNYXJrZXRIZWFkZXIge1xuICAgIHNlbGw6T3JkZXJzU3VtbWFyeSxcbiAgICBidXk6T3JkZXJzU3VtbWFyeVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9yZGVyc1N1bW1hcnkge1xuICAgIHRvdGFsOiBBc3NldERFWDtcbiAgICBvcmRlcnM6IG51bWJlcjsgICAgXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVG9rZW5PcmRlcnMge1xuICAgIHNlbGw6T3JkZXJSb3dbXSxcbiAgICBidXk6T3JkZXJSb3dbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEhpc3RvcnlUeCB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICBzdHI6IHN0cmluZztcbiAgICBwcmljZTogQXNzZXRERVg7XG4gICAgaW52ZXJzZTogQXNzZXRERVg7XG4gICAgYW1vdW50OiBBc3NldERFWDtcbiAgICBwYXltZW50OiBBc3NldERFWDtcbiAgICBidXlmZWU6IEFzc2V0REVYO1xuICAgIHNlbGxmZWU6IEFzc2V0REVYO1xuICAgIGJ1eWVyOiBzdHJpbmc7XG4gICAgc2VsbGVyOiBzdHJpbmc7XG4gICAgZGF0ZTogRGF0ZTtcbiAgICBpc2J1eTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFdmVudExvZyB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICB1c2VyOiBzdHJpbmc7XG4gICAgZXZlbnQ6IHN0cmluZztcbiAgICBwYXJhbXM6IHN0cmluZztcbiAgICBkYXRlOiBEYXRlO1xuICAgIHByb2Nlc3NlZD86IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBIaXN0b3J5QmxvY2sge1xuICAgIGlkOiBudW1iZXI7XG4gICAgaG91cjogbnVtYmVyO1xuICAgIHN0cjogc3RyaW5nO1xuICAgIHByaWNlOiBBc3NldERFWDtcbiAgICBpbnZlcnNlOiBBc3NldERFWDtcbiAgICBlbnRyYW5jZTogQXNzZXRERVg7XG4gICAgbWF4OiBBc3NldERFWDtcbiAgICBtaW46IEFzc2V0REVYO1xuICAgIHZvbHVtZTogQXNzZXRERVg7XG4gICAgYW1vdW50OiBBc3NldERFWDtcbiAgICBkYXRlOiBEYXRlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9yZGVyIHtcbiAgICBpZDogbnVtYmVyO1xuICAgIHByaWNlOiBBc3NldERFWDtcbiAgICBpbnZlcnNlOiBBc3NldERFWDtcbiAgICB0b3RhbDogQXNzZXRERVg7XG4gICAgZGVwb3NpdDogQXNzZXRERVg7XG4gICAgdGVsb3M6IEFzc2V0REVYO1xuICAgIG93bmVyOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXNlck9yZGVyc01hcCB7XG4gICAgW2tleTpzdHJpbmddOiBVc2VyT3JkZXJzO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJPcmRlcnMge1xuICAgIHRhYmxlOiBzdHJpbmc7XG4gICAgaWRzOiBudW1iZXJbXTtcbiAgICBvcmRlcnM/OmFueVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9yZGVyUm93IHtcbiAgICBzdHI6IHN0cmluZztcbiAgICBwcmljZTogQXNzZXRERVg7XG4gICAgb3JkZXJzOiBPcmRlcltdO1xuICAgIGludmVyc2U6IEFzc2V0REVYO1xuICAgIHRvdGFsOiBBc3NldERFWDtcbiAgICBzdW06IEFzc2V0REVYO1xuICAgIHN1bXRlbG9zOiBBc3NldERFWDtcbiAgICB0ZWxvczogQXNzZXRERVg7XG4gICAgb3duZXJzOiB7W2tleTpzdHJpbmddOmJvb2xlYW59XG59Il19