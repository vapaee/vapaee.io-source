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
var VapaeeDEX = /** @class */ (function () {
    function VapaeeDEX(scatter, cookies, datePipe) {
        var _this = this;
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
        this.waitOrderSummary = new Promise(function (resolve) {
            _this.setOrderSummary = resolve;
        });
        this.waitTokenStats = new Promise(function (resolve) {
            _this.setTokenStats = resolve;
        });
        this.waitMarketSummary = new Promise(function (resolve) {
            _this.setMarketSummary = resolve;
        });
        this.waitTokenSummary = new Promise(function (resolve) {
            _this.setTokenSummary = resolve;
        });
        this.waitTokensLoaded = new Promise(function (resolve) {
            _this.setTokensLoaded = resolve;
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
        this.fetchTokens().then(function (data) {
            _this.tokens = [];
            /** @type {?} */
            var carbon;
            for (var i in data.tokens) {
                /** @type {?} */
                var tdata = data.tokens[i];
                /** @type {?} */
                var token = new TokenDEX(tdata);
                _this.tokens.push(token);
                if (token.symbol == "TLOS") {
                    _this.telos = token;
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
            _this.currencies = [_this.telos, carbon];
            // ----------------------------------------------------------
            // ----------------------------------------------------------
            _this.tokens.push(new TokenDEX({
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
            _this.tokens.push(new TokenDEX({
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
            _this.zero_telos = new AssetDEX("0.0000 TLOS", _this);
            _this.setTokensLoaded();
            _this.fetchTokensStats();
            _this.getOrderSummary();
            _this.getAllTablesSumaries();
        });
        /** @type {?} */
        var timer;
        this.onMarketSummary.subscribe(function (summary) {
            clearTimeout(timer);
            timer = setTimeout(function (_) {
                _this.updateTokensSummary();
                _this.updateTokensMarkets();
            }, 100);
        });
    }
    Object.defineProperty(VapaeeDEX.prototype, "default", {
        // getters -------------------------------------------------------------
        get: /**
         * @return {?}
         */
        function () {
            return this.scatter.default;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VapaeeDEX.prototype, "logged", {
        get: /**
         * @return {?}
         */
        function () {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VapaeeDEX.prototype, "account", {
        get: /**
         * @return {?}
         */
        function () {
            return this.scatter.logged ?
                this.scatter.account :
                this.scatter.default;
        },
        enumerable: true,
        configurable: true
    });
    // -- User Log State ---------------------------------------------------
    /**
     * @return {?}
     */
    VapaeeDEX.prototype.login = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.feed.setLoading("login", true);
        this.feed.setLoading("log-state", true);
        console.log("VapaeeDEX.login() this.feed.loading('log-state')", this.feed.loading('log-state'));
        this.logout();
        this.updateLogState();
        console.log("VapaeeDEX.login() this.feed.loading('log-state')", this.feed.loading('log-state'));
        this.feed.setLoading("logout", false);
        return this.scatter.login().then(function () {
            _this.updateLogState();
            _this.feed.setLoading("login", false);
        }).catch(function (e) {
            _this.feed.setLoading("login", false);
            throw e;
        });
    };
    /**
     * @return {?}
     */
    VapaeeDEX.prototype.logout = /**
     * @return {?}
     */
    function () {
        this.feed.setLoading("logout", true);
        this.scatter.logout();
    };
    /**
     * @return {?}
     */
    VapaeeDEX.prototype.onLogout = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.feed.setLoading("logout", false);
        console.log("VapaeeDEX.onLogout()");
        this.resetCurrentAccount(this.default.name);
        this.updateLogState();
        this.onLoggedAccountChange.next(this.logged);
        this.cookies.delete("login");
        setTimeout(function (_) { _this.last_logged = _this.logged; }, 400);
    };
    /**
     * @param {?} name
     * @return {?}
     */
    VapaeeDEX.prototype.onLogin = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        console.log("VapaeeDEX.onLogin()", name);
        this.resetCurrentAccount(name);
        this.getDeposits();
        this.getBalances();
        this.updateLogState();
        this.getUserOrders();
        this.onLoggedAccountChange.next(this.logged);
        this.last_logged = this.logged;
        this.cookies.set("login", this.logged);
    };
    /**
     * @return {?}
     */
    VapaeeDEX.prototype.onLoggedChange = /**
     * @return {?}
     */
    function () {
        console.log("VapaeeDEX.onLoggedChange()");
        if (this.scatter.logged) {
            this.onLogin(this.scatter.account.name);
        }
        else {
            this.onLogout();
        }
    };
    /**
     * @param {?} profile
     * @return {?}
     */
    VapaeeDEX.prototype.resetCurrentAccount = /**
     * @param {?} profile
     * @return {?}
     */
    function (profile) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("VapaeeDEX.resetCurrentAccount()", this.current.name, "->", profile);
                        if (!(this.current.name != profile && (this.current.name == this.last_logged || profile != "guest"))) return [3 /*break*/, 4];
                        this.feed.setLoading("account", true);
                        this.current = this.default;
                        this.current.name = profile;
                        if (!(profile != "guest")) return [3 /*break*/, 2];
                        _a = this.current;
                        return [4 /*yield*/, this.getAccountData(this.current.name)];
                    case 1:
                        _a.data = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        console.error("------------------------------------------");
                        console.error("------------------------------------------");
                        console.error("WARNING!!! current is guest", [profile, this.account, this.current]);
                        console.error("------------------------------------------");
                        console.error("------------------------------------------");
                        _b.label = 3;
                    case 3:
                        // this.scopes = {};
                        this.balances = [];
                        this.userorders = {};
                        // console.log("this.onCurrentAccountChange.next(this.current.name) !!!!!!");
                        this.onCurrentAccountChange.next(this.current.name);
                        this.updateCurrentUser();
                        this.feed.setLoading("account", false);
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @return {?}
     */
    VapaeeDEX.prototype.updateLogState = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.loginState = "no-scatter";
        this.feed.setLoading("log-state", true);
        console.log("VapaeeDEX.updateLogState() ", this.loginState, this.feed.loading("log-state"));
        this.scatter.waitConnected.then(function () {
            _this.loginState = "no-logged";
            // console.log("VapaeeDEX.updateLogState()   ", this.loginState);
            if (_this.scatter.logged) {
                _this.loginState = "account-ok";
                // console.log("VapaeeDEX.updateLogState()     ", this.loginState);
            }
            _this.feed.setLoading("log-state", false);
            console.log("VapaeeDEX.updateLogState() ", _this.loginState, _this.feed.loading("log-state"));
        });
        /** @type {?} */
        var timer2;
        /** @type {?} */
        var timer1 = setInterval(function (_) {
            if (!_this.scatter.feed.loading("connect")) {
                _this.feed.setLoading("log-state", false);
                clearInterval(timer1);
                clearInterval(timer2);
            }
        }, 200);
        timer2 = setTimeout(function (_) {
            clearInterval(timer1);
            _this.feed.setLoading("log-state", false);
        }, 6000);
    };
    /**
     * @param {?} name
     * @return {?}
     */
    VapaeeDEX.prototype.getAccountData = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.scatter.queryAccountData(name).catch(function (_) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            return [2 /*return*/, this.default.data];
                        });
                    }); })];
            });
        });
    };
    // Actions --------------------------------------------------------------
    /**
     * @param {?} type
     * @param {?} amount
     * @param {?} price
     * @return {?}
     */
    VapaeeDEX.prototype.createOrder = /**
     * @param {?} type
     * @param {?} amount
     * @param {?} price
     * @return {?}
     */
    function (type, amount, price) {
        var _this = this;
        // "alice", "buy", "2.50000000 CNT", "0.40000000 TLOS"
        // name owner, name type, const asset & total, const asset & price
        this.feed.setLoading("order-" + type, true);
        return this.contract.excecute("order", {
            owner: this.scatter.account.name,
            type: type,
            total: amount.toString(8),
            price: price.toString(8)
        }).then(function (result) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.updateTrade(amount.token, price.token);
                this.feed.setLoading("order-" + type, false);
                return [2 /*return*/, result];
            });
        }); }).catch(function (e) {
            _this.feed.setLoading("order-" + type, false);
            console.error(e);
            throw e;
        });
    };
    /**
     * @param {?} type
     * @param {?} comodity
     * @param {?} currency
     * @param {?} orders
     * @return {?}
     */
    VapaeeDEX.prototype.cancelOrder = /**
     * @param {?} type
     * @param {?} comodity
     * @param {?} currency
     * @param {?} orders
     * @return {?}
     */
    function (type, comodity, currency, orders) {
        var _this = this;
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
        }).then(function (result) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var i;
            return tslib_1.__generator(this, function (_a) {
                this.updateTrade(comodity, currency);
                this.feed.setLoading("cancel-" + type, false);
                for (i in orders) {
                    this.feed.setLoading("cancel-" + type + "-" + orders[i], false);
                }
                return [2 /*return*/, result];
            });
        }); }).catch(function (e) {
            _this.feed.setLoading("cancel-" + type, false);
            for (var i in orders) {
                _this.feed.setLoading("cancel-" + type + "-" + orders[i], false);
            }
            console.error(e);
            throw e;
        });
    };
    /**
     * @param {?} quantity
     * @return {?}
     */
    VapaeeDEX.prototype.deposit = /**
     * @param {?} quantity
     * @return {?}
     */
    function (quantity) {
        var _this = this;
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
        }).then(function (result) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.feed.setLoading("deposit", false);
                this.feed.setLoading("deposit-" + quantity.token.symbol.toLowerCase(), false);
                /*await*/ this.getDeposits();
                /*await*/ this.getBalances();
                return [2 /*return*/, result];
            });
        }); }).catch(function (e) {
            _this.feed.setLoading("deposit", false);
            _this.feed.setLoading("deposit-" + quantity.token.symbol.toLowerCase(), false);
            _this.feed.setError("deposit", typeof e == "string" ? e : JSON.stringify(e, null, 4));
            console.error(e);
            throw e;
        });
    };
    /**
     * @param {?} quantity
     * @return {?}
     */
    VapaeeDEX.prototype.withdraw = /**
     * @param {?} quantity
     * @return {?}
     */
    function (quantity) {
        var _this = this;
        this.feed.setError("withdraw", null);
        this.feed.setLoading("withdraw", true);
        this.feed.setLoading("withdraw-" + quantity.token.symbol.toLowerCase(), true);
        return this.contract.excecute("withdraw", {
            owner: this.scatter.account.name,
            quantity: quantity.toString()
        }).then(function (result) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.feed.setLoading("withdraw", false);
                this.feed.setLoading("withdraw-" + quantity.token.symbol.toLowerCase(), false);
                /*await*/ this.getDeposits();
                /*await*/ this.getBalances();
                return [2 /*return*/, result];
            });
        }); }).catch(function (e) {
            _this.feed.setLoading("withdraw", false);
            _this.feed.setLoading("withdraw-" + quantity.token.symbol.toLowerCase(), false);
            _this.feed.setError("withdraw", typeof e == "string" ? e : JSON.stringify(e, null, 4));
            throw e;
        });
    };
    // Tokens --------------------------------------------------------------
    /**
     * @param {?} offchain
     * @return {?}
     */
    VapaeeDEX.prototype.addOffChainToken = /**
     * @param {?} offchain
     * @return {?}
     */
    function (offchain) {
        var _this = this;
        this.waitTokensLoaded.then(function (_) {
            _this.tokens.push(new TokenDEX({
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
    };
    /**
     * @return {?}
     */
    VapaeeDEX.prototype.hasScopes = /**
     * @return {?}
     */
    function () {
        return !!this._markets;
    };
    /**
     * @param {?} scope
     * @return {?}
     */
    VapaeeDEX.prototype.market = /**
     * @param {?} scope
     * @return {?}
     */
    function (scope) {
        if (this._markets[scope])
            return this._markets[scope];
        /** @type {?} */
        var reverse = this.inverseScope(scope);
        if (this._reverse[reverse])
            return this._reverse[reverse]; // ---> reverse
        if (!this._markets[reverse])
            return null; // ---> table does not exist (or has not been loaded yet)
        return this.reverse(scope);
    };
    /**
     * @param {?} scope
     * @return {?}
     */
    VapaeeDEX.prototype.table = /**
     * @param {?} scope
     * @return {?}
     */
    function (scope) {
        //console.error("table("+scope+") DEPRECATED");
        return this.market(scope);
    };
    /**
     * @param {?} scope
     * @return {?}
     */
    VapaeeDEX.prototype.reverse = /**
     * @param {?} scope
     * @return {?}
     */
    function (scope) {
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
    };
    /**
     * @param {?} comodity
     * @param {?} currency
     * @return {?}
     */
    VapaeeDEX.prototype.marketFor = /**
     * @param {?} comodity
     * @param {?} currency
     * @return {?}
     */
    function (comodity, currency) {
        /** @type {?} */
        var scope = this.getScopeFor(comodity, currency);
        return this.table(scope);
    };
    /**
     * @param {?} comodity
     * @param {?} currency
     * @return {?}
     */
    VapaeeDEX.prototype.tableFor = /**
     * @param {?} comodity
     * @param {?} currency
     * @return {?}
     */
    function (comodity, currency) {
        console.error("tableFor()", comodity.symbol, currency.symbol, " DEPRECATED");
        return this.marketFor(comodity, currency);
    };
    /**
     * @param {?} scope
     * @return {?}
     */
    VapaeeDEX.prototype.createReverseTableFor = /**
     * @param {?} scope
     * @return {?}
     */
    function (scope) {
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
    };
    /**
     * @param {?} comodity
     * @param {?} currency
     * @return {?}
     */
    VapaeeDEX.prototype.getScopeFor = /**
     * @param {?} comodity
     * @param {?} currency
     * @return {?}
     */
    function (comodity, currency) {
        if (!comodity || !currency)
            return "";
        return comodity.symbol.toLowerCase() + "." + currency.symbol.toLowerCase();
    };
    /**
     * @param {?} scope
     * @return {?}
     */
    VapaeeDEX.prototype.inverseScope = /**
     * @param {?} scope
     * @return {?}
     */
    function (scope) {
        if (!scope)
            return scope;
        console.assert(typeof scope == "string", "ERROR: string scope expected, got ", typeof scope, scope);
        /** @type {?} */
        var parts = scope.split(".");
        console.assert(parts.length == 2, "ERROR: scope format expected is xxx.yyy, got: ", typeof scope, scope);
        /** @type {?} */
        var inverse = parts[1] + "." + parts[0];
        return inverse;
    };
    /**
     * @param {?} scope
     * @return {?}
     */
    VapaeeDEX.prototype.canonicalScope = /**
     * @param {?} scope
     * @return {?}
     */
    function (scope) {
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
    };
    /**
     * @param {?} scope
     * @return {?}
     */
    VapaeeDEX.prototype.isCanonical = /**
     * @param {?} scope
     * @return {?}
     */
    function (scope) {
        return this.canonicalScope(scope) == scope;
    };
    // --------------------------------------------------------------
    // Getters 
    /**
     * @param {?} token
     * @return {?}
     */
    VapaeeDEX.prototype.getBalance = /**
     * @param {?} token
     * @return {?}
     */
    function (token) {
        for (var i in this.balances) {
            if (this.balances[i].token.symbol == token.symbol) {
                return this.balances[i];
            }
        }
        return new AssetDEX("0 " + token.symbol, this);
    };
    /**
     * @param {?=} symbol
     * @return {?}
     */
    VapaeeDEX.prototype.getSomeFreeFakeTokens = /**
     * @param {?=} symbol
     * @return {?}
     */
    function (symbol) {
        if (symbol === void 0) { symbol = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _token;
            return tslib_1.__generator(this, function (_a) {
                console.log("VapaeeDEX.getSomeFreeFakeTokens()");
                _token = symbol;
                this.feed.setLoading("freefake-" + _token || "token", true);
                return [2 /*return*/, this.waitTokenStats.then(function (_) {
                        /** @type {?} */
                        var token = null;
                        /** @type {?} */
                        var counts = 0;
                        for (var i = 0; i < 100; i++) {
                            if (symbol) {
                                if (_this.tokens[i].symbol == symbol) {
                                    token = _this.tokens[i];
                                }
                            }
                            /** @type {?} */
                            var random = Math.random();
                            // console.log(i, "Random: ", random);
                            if (!token && random > 0.5) {
                                token = _this.tokens[i % _this.tokens.length];
                                if (token.fake) {
                                    random = Math.random();
                                    if (random > 0.5) {
                                        token = _this.telos;
                                    }
                                }
                                else {
                                    token = null;
                                }
                            }
                            if (i < 100 && token && _this.getBalance(token).amount.toNumber() > 0) {
                                token = null;
                            }
                            // console.log(i, "token: ", token);
                            if (token) {
                                random = Math.random();
                                /** @type {?} */
                                var monto = Math.floor(10000 * random) / 100;
                                /** @type {?} */
                                var quantity = new AssetDEX("" + monto + " " + token.symbol, _this);
                                /** @type {?} */
                                var memo = "you get " + quantity.valueToString() + " free fake " + token.symbol + " tokens to play on vapaee.io DEX";
                                return _this.contract.excecute("issue", {
                                    to: _this.scatter.account.name,
                                    quantity: quantity.toString(),
                                    memo: memo
                                }).then(function (_) {
                                    _this.getBalances();
                                    _this.feed.setLoading("freefake-" + _token || "token", false);
                                    return memo;
                                }).catch(function (e) {
                                    _this.feed.setLoading("freefake-" + _token || "token", false);
                                    throw e;
                                });
                            }
                        }
                    })];
            });
        });
    };
    /**
     * @param {?} sym
     * @return {?}
     */
    VapaeeDEX.prototype.getTokenNow = /**
     * @param {?} sym
     * @return {?}
     */
    function (sym) {
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
    };
    /**
     * @param {?} sym
     * @return {?}
     */
    VapaeeDEX.prototype.getToken = /**
     * @param {?} sym
     * @return {?}
     */
    function (sym) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.waitTokensLoaded.then(function (_) {
                        return _this.getTokenNow(sym);
                    })];
            });
        });
    };
    /**
     * @param {?=} account
     * @return {?}
     */
    VapaeeDEX.prototype.getDeposits = /**
     * @param {?=} account
     * @return {?}
     */
    function (account) {
        if (account === void 0) { account = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                console.log("VapaeeDEX.getDeposits()");
                this.feed.setLoading("deposits", true);
                return [2 /*return*/, this.waitTokensLoaded.then(function (_) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var deposits, result, i;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    deposits = [];
                                    if (!account && this.current.name) {
                                        account = this.current.name;
                                    }
                                    if (!account) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.fetchDeposits(account)];
                                case 1:
                                    result = _a.sent();
                                    for (i in result.rows) {
                                        deposits.push(new AssetDEX(result.rows[i].amount, this));
                                    }
                                    _a.label = 2;
                                case 2:
                                    this.deposits = deposits;
                                    this.feed.setLoading("deposits", false);
                                    return [2 /*return*/, this.deposits];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * @param {?=} account
     * @return {?}
     */
    VapaeeDEX.prototype.getBalances = /**
     * @param {?=} account
     * @return {?}
     */
    function (account) {
        if (account === void 0) { account = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                console.log("VapaeeDEX.getBalances()");
                this.feed.setLoading("balances", true);
                return [2 /*return*/, this.waitTokensLoaded.then(function (_) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var _balances;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!account && this.current.name) {
                                        account = this.current.name;
                                    }
                                    if (!account) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.fetchBalances(account)];
                                case 1:
                                    _balances = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    this.balances = _balances;
                                    // console.log("VapaeeDEX balances updated");
                                    this.feed.setLoading("balances", false);
                                    return [2 /*return*/, this.balances];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * @param {?} table
     * @param {?} ids
     * @return {?}
     */
    VapaeeDEX.prototype.getThisSellOrders = /**
     * @param {?} table
     * @param {?} ids
     * @return {?}
     */
    function (table, ids) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                this.feed.setLoading("thisorders", true);
                return [2 /*return*/, this.waitTokensLoaded.then(function (_) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var result, _a, _b, _i, i, id, gotit, j, res;
                        return tslib_1.__generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    result = [];
                                    _a = [];
                                    for (_b in ids)
                                        _a.push(_b);
                                    _i = 0;
                                    _c.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                                    i = _a[_i];
                                    id = ids[i];
                                    gotit = false;
                                    for (j in result) {
                                        if (result[j].id == id) {
                                            gotit = true;
                                            break;
                                        }
                                    }
                                    if (gotit) {
                                        return [3 /*break*/, 3];
                                    }
                                    return [4 /*yield*/, this.fetchOrders({ scope: table, limit: 1, lower_bound: id.toString() })];
                                case 2:
                                    res = _c.sent();
                                    result = result.concat(res.rows);
                                    _c.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4:
                                    this.feed.setLoading("thisorders", false);
                                    return [2 /*return*/, result];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * @param {?=} account
     * @return {?}
     */
    VapaeeDEX.prototype.getUserOrders = /**
     * @param {?=} account
     * @return {?}
     */
    function (account) {
        if (account === void 0) { account = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                console.log("VapaeeDEX.getUserOrders()");
                this.feed.setLoading("userorders", true);
                return [2 /*return*/, this.waitTokensLoaded.then(function (_) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var userorders, list, map, i, ids, table, orders;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!account && this.current.name) {
                                        account = this.current.name;
                                    }
                                    if (!account) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.fetchUserOrders(account)];
                                case 1:
                                    userorders = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    list = /** @type {?} */ (userorders.rows);
                                    map = {};
                                    i = 0;
                                    _a.label = 3;
                                case 3:
                                    if (!(i < list.length)) return [3 /*break*/, 6];
                                    ids = list[i].ids;
                                    table = list[i].table;
                                    return [4 /*yield*/, this.getThisSellOrders(table, ids)];
                                case 4:
                                    orders = _a.sent();
                                    map[table] = {
                                        table: table,
                                        orders: this.auxProcessRowsToOrders(orders),
                                        ids: ids
                                    };
                                    _a.label = 5;
                                case 5:
                                    i++;
                                    return [3 /*break*/, 3];
                                case 6:
                                    this.userorders = map;
                                    // console.log(this.userorders);
                                    this.feed.setLoading("userorders", false);
                                    return [2 /*return*/, this.userorders];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * @return {?}
     */
    VapaeeDEX.prototype.updateActivity = /**
     * @return {?}
     */
    function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var pagesize, pages;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.feed.setLoading("activity", true);
                        pagesize = this.activityPagesize;
                        return [4 /*yield*/, this.getActivityTotalPages(pagesize)];
                    case 1:
                        pages = _a.sent();
                        return [4 /*yield*/, Promise.all([
                                this.fetchActivity(pages - 2, pagesize),
                                this.fetchActivity(pages - 1, pagesize),
                                this.fetchActivity(pages - 0, pagesize)
                            ])];
                    case 2:
                        _a.sent();
                        this.feed.setLoading("activity", false);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @return {?}
     */
    VapaeeDEX.prototype.loadMoreActivity = /**
     * @return {?}
     */
    function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var pagesize, first, id, page;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.activity.list.length == 0)
                            return [2 /*return*/];
                        this.feed.setLoading("activity", true);
                        pagesize = this.activityPagesize;
                        first = this.activity.list[this.activity.list.length - 1];
                        id = first.id - pagesize;
                        page = Math.floor((id - 1) / pagesize);
                        return [4 /*yield*/, this.fetchActivity(page, pagesize)];
                    case 1:
                        _a.sent();
                        this.feed.setLoading("activity", false);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} updateUser
     * @return {?}
     */
    VapaeeDEX.prototype.updateTrade = /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} updateUser
     * @return {?}
     */
    function (comodity, currency, updateUser) {
        if (updateUser === void 0) { updateUser = true; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var chrono_key;
            return tslib_1.__generator(this, function (_a) {
                console.log("VapaeeDEX.updateTrade()");
                chrono_key = "updateTrade";
                this.feed.startChrono(chrono_key);
                if (updateUser)
                    this.updateCurrentUser();
                return [2 /*return*/, Promise.all([
                        this.getTransactionHistory(comodity, currency, -1, -1, true).then(function (_) { return _this.feed.setMarck(chrono_key, "getTransactionHistory()"); }),
                        this.getBlockHistory(comodity, currency, -1, -1, true).then(function (_) { return _this.feed.setMarck(chrono_key, "getBlockHistory()"); }),
                        this.getSellOrders(comodity, currency, true).then(function (_) { return _this.feed.setMarck(chrono_key, "getSellOrders()"); }),
                        this.getBuyOrders(comodity, currency, true).then(function (_) { return _this.feed.setMarck(chrono_key, "getBuyOrders()"); }),
                        this.getMarketSummary(comodity, currency, true).then(function (_) { return _this.feed.setMarck(chrono_key, "getMarketSummary()"); }),
                        this.getOrderSummary().then(function (_) { return _this.feed.setMarck(chrono_key, "getOrderSummary()"); }),
                    ]).then(function (r) {
                        _this._reverse = {};
                        _this.resortTokens();
                        _this.resortTopMarkets();
                        // this.feed.printChrono(chrono_key);
                        // this.feed.printChrono(chrono_key);
                        _this.onTradeUpdated.next(null);
                        return r;
                    })];
            });
        });
    };
    /**
     * @return {?}
     */
    VapaeeDEX.prototype.updateCurrentUser = /**
     * @return {?}
     */
    function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                // console.log("VapaeeDEX.updateCurrentUser()");
                this.feed.setLoading("current", true);
                return [2 /*return*/, Promise.all([
                        this.getUserOrders(),
                        this.getDeposits(),
                        this.getBalances()
                    ]).then(function (_) {
                        _this.feed.setLoading("current", false);
                        return _;
                    }).catch(function (e) {
                        _this.feed.setLoading("current", false);
                        throw e;
                    })];
            });
        });
    };
    /**
     * @param {?} scope
     * @param {?} pagesize
     * @return {?}
     */
    VapaeeDEX.prototype.getBlockHistoryTotalPagesFor = /**
     * @param {?} scope
     * @param {?} pagesize
     * @return {?}
     */
    function (scope, pagesize) {
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
    };
    /**
     * @param {?} scope
     * @param {?} pagesize
     * @return {?}
     */
    VapaeeDEX.prototype.getHistoryTotalPagesFor = /**
     * @param {?} scope
     * @param {?} pagesize
     * @return {?}
     */
    function (scope, pagesize) {
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
    };
    /**
     * @param {?} pagesize
     * @return {?}
     */
    VapaeeDEX.prototype.getActivityTotalPages = /**
     * @param {?} pagesize
     * @return {?}
     */
    function (pagesize) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.contract.getTable("events", {
                        limit: 1
                    }).then(function (result) {
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
                        _this.activity.total = total;
                        console.log("VapaeeDEX.getActivityTotalPages() total: ", total, " pages: ", pages);
                        return pages;
                    })];
            });
        });
    };
    /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} page
     * @param {?=} pagesize
     * @param {?=} force
     * @return {?}
     */
    VapaeeDEX.prototype.getTransactionHistory = /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} page
     * @param {?=} pagesize
     * @param {?=} force
     * @return {?}
     */
    function (comodity, currency, page, pagesize, force) {
        if (page === void 0) { page = -1; }
        if (pagesize === void 0) { pagesize = -1; }
        if (force === void 0) { force = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var scope, aux, result;
            return tslib_1.__generator(this, function (_a) {
                scope = this.canonicalScope(this.getScopeFor(comodity, currency));
                aux = null;
                result = null;
                this.feed.setLoading("history." + scope, true);
                aux = this.waitOrderSummary.then(function (_) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    var pages;
                    return tslib_1.__generator(this, function (_a) {
                        if (pagesize == -1) {
                            pagesize = 10;
                        }
                        if (page == -1) {
                            pages = this.getHistoryTotalPagesFor(scope, pagesize);
                            page = pages - 3;
                            if (page < 0)
                                page = 0;
                        }
                        return [2 /*return*/, Promise.all([
                                this.fetchHistory(scope, page + 0, pagesize),
                                this.fetchHistory(scope, page + 1, pagesize),
                                this.fetchHistory(scope, page + 2, pagesize)
                            ]).then(function (_) {
                                _this.feed.setLoading("history." + scope, false);
                                return _this.market(scope).history;
                            }).catch(function (e) {
                                _this.feed.setLoading("history." + scope, false);
                                throw e;
                            })];
                    });
                }); });
                if (this.market(scope) && !force) {
                    result = this.market(scope).history;
                }
                else {
                    result = aux;
                }
                this.onHistoryChange.next(result);
                return [2 /*return*/, result];
            });
        });
    };
    /**
     * @param {?} hour
     * @return {?}
     */
    VapaeeDEX.prototype.auxHourToLabel = /**
     * @param {?} hour
     * @return {?}
     */
    function (hour) {
        /** @type {?} */
        var d = new Date(hour * 1000 * 60 * 60);
        /** @type {?} */
        var label = d.getHours() == 0 ? this.datePipe.transform(d, 'dd/MM') : d.getHours() + "h";
        return label;
    };
    /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} page
     * @param {?=} pagesize
     * @param {?=} force
     * @return {?}
     */
    VapaeeDEX.prototype.getBlockHistory = /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} page
     * @param {?=} pagesize
     * @param {?=} force
     * @return {?}
     */
    function (comodity, currency, page, pagesize, force) {
        if (page === void 0) { page = -1; }
        if (pagesize === void 0) { pagesize = -1; }
        if (force === void 0) { force = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var scope, aux, result;
            return tslib_1.__generator(this, function (_a) {
                console.log("VapaeeDEX.getBlockHistory()", comodity.symbol, page, pagesize);
                scope = this.canonicalScope(this.getScopeFor(comodity, currency));
                aux = null;
                result = null;
                this.feed.setLoading("block-history." + scope, true);
                aux = this.waitOrderSummary.then(function (_) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    var fetchBlockHistoryStart, pages, promises, i, promise;
                    return tslib_1.__generator(this, function (_a) {
                        fetchBlockHistoryStart = new Date();
                        if (pagesize == -1) {
                            pagesize = 10;
                        }
                        if (page == -1) {
                            pages = this.getBlockHistoryTotalPagesFor(scope, pagesize);
                            page = pages - 3;
                            if (page < 0)
                                page = 0;
                        }
                        promises = [];
                        for (i = 0; i <= pages; i++) {
                            promise = this.fetchBlockHistory(scope, i, pagesize);
                            promises.push(promise);
                        }
                        return [2 /*return*/, Promise.all(promises).then(function (_) {
                                // // elapsed time
                                // var fetchBlockHistoryTime:Date = new Date();
                                // diff = fetchBlockHistoryTime.getTime() - fetchBlockHistoryStart.getTime();
                                // sec = diff / 1000;
                                // console.log("** VapaeeDEX.getBlockHistory() fetchBlockHistoryTime sec: ", sec, "(",diff,")");
                                // // elapsed time
                                // var fetchBlockHistoryTime:Date = new Date();
                                // diff = fetchBlockHistoryTime.getTime() - fetchBlockHistoryStart.getTime();
                                // sec = diff / 1000;
                                // console.log("** VapaeeDEX.getBlockHistory() fetchBlockHistoryTime sec: ", sec, "(",diff,")");
                                _this.feed.setLoading("block-history." + scope, false);
                                /** @type {?} */
                                var market = _this.market(scope);
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
                                    var label = _this.auxHourToLabel(block.hour);
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
                                            var label_i = _this.auxHourToLabel(last_block.hour + j);
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
                                        var label_i = _this.auxHourToLabel(last_block.hour + j);
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
                            }).then(function (market) {
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
                            }).catch(function (e) {
                                _this.feed.setLoading("block-history." + scope, false);
                                throw e;
                            })];
                    });
                }); });
                if (this.market(scope) && !force) {
                    result = this.market(scope).block;
                }
                else {
                    result = aux;
                }
                this.onHistoryChange.next(result);
                return [2 /*return*/, result];
            });
        });
    };
    /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} force
     * @return {?}
     */
    VapaeeDEX.prototype.getSellOrders = /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} force
     * @return {?}
     */
    function (comodity, currency, force) {
        if (force === void 0) { force = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var scope, canonical, reverse, aux, result;
            return tslib_1.__generator(this, function (_a) {
                scope = this.getScopeFor(comodity, currency);
                canonical = this.canonicalScope(scope);
                reverse = this.inverseScope(canonical);
                aux = null;
                result = null;
                this.feed.setLoading("sellorders", true);
                aux = this.waitTokensLoaded.then(function (_) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var orders, sell, list, row, i, order, sum, sumtelos, j, order_row;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.fetchOrders({ scope: canonical, limit: 100, index_position: "2", key_type: "i64" })];
                            case 1:
                                orders = _a.sent();
                                this._markets[canonical] = this.auxAssertScope(canonical);
                                sell = this.auxProcessRowsToOrders(orders.rows);
                                sell.sort(function (a, b) {
                                    if (a.price.amount.isLessThan(b.price.amount))
                                        return -11;
                                    if (a.price.amount.isGreaterThan(b.price.amount))
                                        return 1;
                                    return 0;
                                });
                                list = [];
                                if (sell.length > 0) {
                                    for (i = 0; i < sell.length; i++) {
                                        order = sell[i];
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
                                sum = new BigNumber(0);
                                sumtelos = new BigNumber(0);
                                for (j in list) {
                                    order_row = list[j];
                                    sumtelos = sumtelos.plus(order_row.telos.amount);
                                    sum = sum.plus(order_row.total.amount);
                                    order_row.sumtelos = new AssetDEX(sumtelos, order_row.telos.token);
                                    order_row.sum = new AssetDEX(sum, order_row.total.token);
                                }
                                this._markets[canonical].orders.sell = list;
                                // if(scope=="vpe.tlos" || scope=="cnt.tlos")console.log("Sell final:", this.scopes[scope].orders.sell);
                                // if(scope=="vpe.tlos" || scope=="cnt.tlos")console.log("-------------");
                                this.feed.setLoading("sellorders", false);
                                return [2 /*return*/, this._markets[canonical].orders.sell];
                        }
                    });
                }); });
                if (this._markets[canonical] && !force) {
                    result = this._markets[canonical].orders.sell;
                }
                else {
                    result = aux;
                }
                return [2 /*return*/, result];
            });
        });
    };
    /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} force
     * @return {?}
     */
    VapaeeDEX.prototype.getBuyOrders = /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} force
     * @return {?}
     */
    function (comodity, currency, force) {
        if (force === void 0) { force = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var scope, canonical, reverse, aux, result;
            return tslib_1.__generator(this, function (_a) {
                scope = this.getScopeFor(comodity, currency);
                canonical = this.canonicalScope(scope);
                reverse = this.inverseScope(canonical);
                aux = null;
                result = null;
                this.feed.setLoading("buyorders", true);
                aux = this.waitTokensLoaded.then(function (_) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var orders, buy, list, row, i, order, sum, sumtelos, j, order_row;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.fetchOrders({ scope: reverse, limit: 50, index_position: "2", key_type: "i64" })];
                            case 1: return [4 /*yield*/, _a.sent()];
                            case 2:
                                orders = _a.sent();
                                this._markets[canonical] = this.auxAssertScope(canonical);
                                buy = this.auxProcessRowsToOrders(orders.rows);
                                buy.sort(function (a, b) {
                                    if (a.price.amount.isLessThan(b.price.amount))
                                        return 1;
                                    if (a.price.amount.isGreaterThan(b.price.amount))
                                        return -1;
                                    return 0;
                                });
                                list = [];
                                if (buy.length > 0) {
                                    for (i = 0; i < buy.length; i++) {
                                        order = buy[i];
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
                                sum = new BigNumber(0);
                                sumtelos = new BigNumber(0);
                                for (j in list) {
                                    order_row = list[j];
                                    sumtelos = sumtelos.plus(order_row.telos.amount);
                                    sum = sum.plus(order_row.total.amount);
                                    order_row.sumtelos = new AssetDEX(sumtelos, order_row.telos.token);
                                    order_row.sum = new AssetDEX(sum, order_row.total.token);
                                }
                                this._markets[canonical].orders.buy = list;
                                // console.log("Buy final:", this.scopes[scope].orders.buy);
                                // console.log("-------------");
                                this.feed.setLoading("buyorders", false);
                                return [2 /*return*/, this._markets[canonical].orders.buy];
                        }
                    });
                }); });
                if (this._markets[canonical] && !force) {
                    result = this._markets[canonical].orders.buy;
                }
                else {
                    result = aux;
                }
                return [2 /*return*/, result];
            });
        });
    };
    /**
     * @return {?}
     */
    VapaeeDEX.prototype.getOrderSummary = /**
     * @return {?}
     */
    function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tables, i, scope, canonical;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("VapaeeDEX.getOrderSummary()");
                        return [4 /*yield*/, this.fetchOrderSummary()];
                    case 1:
                        tables = _a.sent();
                        for (i in tables.rows) {
                            scope = tables.rows[i].table;
                            canonical = this.canonicalScope(scope);
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
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @param {?} token_a
     * @param {?} token_b
     * @param {?=} force
     * @return {?}
     */
    VapaeeDEX.prototype.getMarketSummary = /**
     * @param {?} token_a
     * @param {?} token_b
     * @param {?=} force
     * @return {?}
     */
    function (token_a, token_b, force) {
        if (force === void 0) { force = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var scope, canonical, inverse, comodity, currency, ZERO_COMODITY, ZERO_CURRENCY, aux, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scope = this.getScopeFor(token_a, token_b);
                        canonical = this.canonicalScope(scope);
                        inverse = this.inverseScope(canonical);
                        comodity = this.auxGetComodityToken(canonical);
                        currency = this.auxGetCurrencyToken(canonical);
                        ZERO_COMODITY = "0.00000000 " + comodity.symbol;
                        ZERO_CURRENCY = "0.00000000 " + currency.symbol;
                        this.feed.setLoading("summary." + canonical, true);
                        this.feed.setLoading("summary." + inverse, true);
                        aux = null;
                        result = null;
                        aux = this.waitTokensLoaded.then(function (_) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var summary, now, now_sec, now_hour, start_hour, price, inverse, crude, last_hh, i, hh, last_24h, volume, amount, price_asset, inverse_asset, max_price, min_price, max_inverse, min_inverse, price_fst, inverse_fst, i, current, current_date, nuevo, vol, amo, last_price, diff, ratio, percent, last_inverse, idiff, ipercent;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.fetchSummary(canonical)];
                                    case 1:
                                        summary = _a.sent();
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
                                        now = new Date();
                                        now_sec = Math.floor(now.getTime() / 1000);
                                        now_hour = Math.floor(now_sec / 3600);
                                        start_hour = now_hour - 23;
                                        price = ZERO_CURRENCY;
                                        inverse = ZERO_COMODITY;
                                        crude = {};
                                        last_hh = 0;
                                        for (i = 0; i < summary.rows.length; i++) {
                                            hh = summary.rows[i].hour;
                                            if (summary.rows[i].label == "lastone") {
                                                // price = summary.rows[i].price;
                                            }
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
                                        last_24h = {};
                                        volume = new AssetDEX(ZERO_CURRENCY, this);
                                        amount = new AssetDEX(ZERO_COMODITY, this);
                                        price_asset = new AssetDEX(price, this);
                                        inverse_asset = new AssetDEX(inverse, this);
                                        max_price = price_asset.clone();
                                        min_price = price_asset.clone();
                                        max_inverse = inverse_asset.clone();
                                        min_inverse = inverse_asset.clone();
                                        price_fst = null;
                                        inverse_fst = null;
                                        for (i = 0; i < 24; i++) {
                                            current = start_hour + i;
                                            current_date = new Date(current * 3600 * 1000);
                                            nuevo = crude[current];
                                            if (nuevo) {
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
                                            vol = new AssetDEX(last_24h[current].volume, this);
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
                                            amo = new AssetDEX(last_24h[current].amount, this);
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
                                        last_price = new AssetDEX(last_24h[now_hour].price, this);
                                        diff = last_price.clone();
                                        // diff.amount
                                        diff.amount = last_price.amount.minus(price_fst.amount);
                                        ratio = 0;
                                        if (price_fst.amount.toNumber() != 0) {
                                            ratio = diff.amount.dividedBy(price_fst.amount).toNumber();
                                        }
                                        percent = Math.floor(ratio * 10000) / 100;
                                        // reverse ----------------------------
                                        if (!inverse_fst) {
                                            inverse_fst = new AssetDEX(last_24h[start_hour].inverse, this);
                                        }
                                        last_inverse = new AssetDEX(last_24h[now_hour].inverse, this);
                                        idiff = last_inverse.clone();
                                        // diff.amount
                                        idiff.amount = last_inverse.amount.minus(inverse_fst.amount);
                                        ratio = 0;
                                        if (inverse_fst.amount.toNumber() != 0) {
                                            ratio = diff.amount.dividedBy(inverse_fst.amount).toNumber();
                                        }
                                        ipercent = Math.floor(ratio * 10000) / 100;
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
                                        return [2 /*return*/, this._markets[canonical].summary];
                                }
                            });
                        }); });
                        if (!(this._markets[canonical] && !force)) return [3 /*break*/, 1];
                        result = this._markets[canonical].summary;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, aux];
                    case 2:
                        result = _a.sent();
                        _a.label = 3;
                    case 3:
                        this.resortTopMarkets();
                        this.setMarketSummary();
                        this.onMarketSummary.next(result);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * @return {?}
     */
    VapaeeDEX.prototype.getAllTablesSumaries = /**
     * @return {?}
     */
    function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.waitOrderSummary.then(function (_) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        var promises, i, p;
                        return tslib_1.__generator(this, function (_a) {
                            promises = [];
                            for (i in this._markets) {
                                if (i.indexOf(".") == -1)
                                    continue;
                                p = this.getMarketSummary(this._markets[i].comodity, this._markets[i].currency, true);
                                promises.push(p);
                            }
                            return [2 /*return*/, Promise.all(promises).then(function (_) {
                                    _this.updateTokensSummary();
                                })];
                        });
                    }); })];
            });
        });
    };
    /**
     * @param {?} rows
     * @return {?}
     */
    VapaeeDEX.prototype.auxProcessRowsToOrders = /**
     * @param {?} rows
     * @return {?}
     */
    function (rows) {
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
    };
    /**
     * @param {?} hh
     * @return {?}
     */
    VapaeeDEX.prototype.auxGetLabelForHour = /**
     * @param {?} hh
     * @return {?}
     */
    function (hh) {
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
    };
    /**
     * @param {?} scope
     * @return {?}
     */
    VapaeeDEX.prototype.auxGetCurrencyToken = /**
     * @param {?} scope
     * @return {?}
     */
    function (scope) {
        console.assert(!!scope, "ERROR: invalid scope: '" + scope + "'");
        console.assert(scope.split(".").length == 2, "ERROR: invalid scope: '" + scope + "'");
        /** @type {?} */
        var currency_sym = scope.split(".")[1].toUpperCase();
        /** @type {?} */
        var currency = this.getTokenNow(currency_sym);
        return currency;
    };
    /**
     * @param {?} scope
     * @return {?}
     */
    VapaeeDEX.prototype.auxGetComodityToken = /**
     * @param {?} scope
     * @return {?}
     */
    function (scope) {
        console.assert(!!scope, "ERROR: invalid scope: '" + scope + "'");
        console.assert(scope.split(".").length == 2, "ERROR: invalid scope: '" + scope + "'");
        /** @type {?} */
        var comodity_sym = scope.split(".")[0].toUpperCase();
        /** @type {?} */
        var comodity = this.getTokenNow(comodity_sym);
        return comodity;
    };
    /**
     * @param {?} scope
     * @return {?}
     */
    VapaeeDEX.prototype.auxAssertScope = /**
     * @param {?} scope
     * @return {?}
     */
    function (scope) {
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
    };
    /**
     * @param {?} account
     * @return {?}
     */
    VapaeeDEX.prototype.fetchDeposits = /**
     * @param {?} account
     * @return {?}
     */
    function (account) {
        return this.contract.getTable("deposits", { scope: account }).then(function (result) {
            return result;
        });
    };
    /**
     * @param {?} account
     * @return {?}
     */
    VapaeeDEX.prototype.fetchBalances = /**
     * @param {?} account
     * @return {?}
     */
    function (account) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.waitTokensLoaded.then(function (_) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var contracts, balances, i, contract, _a, _b, _i, contract, result, i;
                        return tslib_1.__generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    contracts = {};
                                    balances = [];
                                    for (i in this.tokens) {
                                        if (this.tokens[i].offchain)
                                            continue;
                                        contracts[this.tokens[i].contract] = true;
                                    }
                                    for (contract in contracts) {
                                        this.feed.setLoading("balances-" + contract, true);
                                    }
                                    _a = [];
                                    for (_b in contracts)
                                        _a.push(_b);
                                    _i = 0;
                                    _c.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                                    contract = _a[_i];
                                    return [4 /*yield*/, this.contract.getTable("accounts", {
                                            contract: contract,
                                            scope: account || this.current.name
                                        })];
                                case 2:
                                    result = _c.sent();
                                    for (i in result.rows) {
                                        balances.push(new AssetDEX(result.rows[i].balance, this));
                                    }
                                    this.feed.setLoading("balances-" + contract, false);
                                    _c.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/, balances];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * @param {?} params
     * @return {?}
     */
    VapaeeDEX.prototype.fetchOrders = /**
     * @param {?} params
     * @return {?}
     */
    function (params) {
        return this.contract.getTable("sellorders", params).then(function (result) {
            return result;
        });
    };
    /**
     * @return {?}
     */
    VapaeeDEX.prototype.fetchOrderSummary = /**
     * @return {?}
     */
    function () {
        return this.contract.getTable("ordersummary").then(function (result) {
            return result;
        });
    };
    /**
     * @param {?} scope
     * @param {?=} page
     * @param {?=} pagesize
     * @return {?}
     */
    VapaeeDEX.prototype.fetchBlockHistory = /**
     * @param {?} scope
     * @param {?=} page
     * @param {?=} pagesize
     * @return {?}
     */
    function (scope, page, pagesize) {
        var _this = this;
        if (page === void 0) { page = 0; }
        if (pagesize === void 0) { pagesize = 25; }
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
        return this.contract.getTable("blockhistory", { scope: canonical, limit: pagesize, lower_bound: "" + (page * pagesize) }).then(function (result) {
            // console.log("**************");
            // console.log("block History crudo:", result);
            // console.log("**************");
            // console.log("block History crudo:", result);
            _this._markets[canonical] = _this.auxAssertScope(canonical);
            _this._markets[canonical].block = _this._markets[canonical].block || {};
            // console.log("this._markets[scope].block:", this._markets[scope].block);
            for (var i = 0; i < result.rows.length; i++) {
                /** @type {?} */
                var block = {
                    id: result.rows[i].id,
                    hour: result.rows[i].hour,
                    str: "",
                    price: new AssetDEX(result.rows[i].price, _this),
                    inverse: new AssetDEX(result.rows[i].inverse, _this),
                    entrance: new AssetDEX(result.rows[i].entrance, _this),
                    max: new AssetDEX(result.rows[i].max, _this),
                    min: new AssetDEX(result.rows[i].min, _this),
                    volume: new AssetDEX(result.rows[i].volume, _this),
                    amount: new AssetDEX(result.rows[i].amount, _this),
                    date: new Date(result.rows[i].date)
                };
                block.str = JSON.stringify([block.max.str, block.entrance.str, block.price.str, block.min.str]);
                _this._markets[canonical].block["id-" + block.id] = block;
            }
            // console.log("block History final:", this._markets[scope].block);
            // console.log("-------------");
            return result;
        });
    };
    /**
     * @param {?} scope
     * @param {?=} page
     * @param {?=} pagesize
     * @return {?}
     */
    VapaeeDEX.prototype.fetchHistory = /**
     * @param {?} scope
     * @param {?=} page
     * @param {?=} pagesize
     * @return {?}
     */
    function (scope, page, pagesize) {
        var _this = this;
        if (page === void 0) { page = 0; }
        if (pagesize === void 0) { pagesize = 25; }
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
        return this.contract.getTable("history", { scope: scope, limit: pagesize, lower_bound: "" + (page * pagesize) }).then(function (result) {
            // console.log("**************");
            // console.log("History crudo:", result);
            // console.log("**************");
            // console.log("History crudo:", result);
            _this._markets[canonical] = _this.auxAssertScope(canonical);
            _this._markets[canonical].history = [];
            _this._markets[canonical].tx = _this._markets[canonical].tx || {};
            // console.log("this.scopes[scope].tx:", this.scopes[scope].tx);
            for (var i = 0; i < result.rows.length; i++) {
                /** @type {?} */
                var transaction = {
                    id: result.rows[i].id,
                    str: "",
                    amount: new AssetDEX(result.rows[i].amount, _this),
                    payment: new AssetDEX(result.rows[i].payment, _this),
                    buyfee: new AssetDEX(result.rows[i].buyfee, _this),
                    sellfee: new AssetDEX(result.rows[i].sellfee, _this),
                    price: new AssetDEX(result.rows[i].price, _this),
                    inverse: new AssetDEX(result.rows[i].inverse, _this),
                    buyer: result.rows[i].buyer,
                    seller: result.rows[i].seller,
                    date: new Date(result.rows[i].date),
                    isbuy: !!result.rows[i].isbuy
                };
                transaction.str = transaction.price.str + " " + transaction.amount.str;
                _this._markets[canonical].tx["id-" + transaction.id] = transaction;
            }
            for (var j in _this._markets[canonical].tx) {
                _this._markets[canonical].history.push(_this._markets[canonical].tx[j]);
            }
            _this._markets[canonical].history.sort(function (a, b) {
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
    };
    /**
     * @param {?=} page
     * @param {?=} pagesize
     * @return {?}
     */
    VapaeeDEX.prototype.fetchActivity = /**
     * @param {?=} page
     * @param {?=} pagesize
     * @return {?}
     */
    function (page, pagesize) {
        if (page === void 0) { page = 0; }
        if (pagesize === void 0) { pagesize = 25; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var id, pageEvents, i, id_i, event;
            return tslib_1.__generator(this, function (_a) {
                id = page * pagesize + 1;
                // console.log("VapaeeDEX.fetchActivity(", page,",",pagesize,"): id:", id);
                if (this.activity.events["id-" + id]) {
                    pageEvents = [];
                    for (i = 0; i < pagesize; i++) {
                        id_i = id + i;
                        event = this.activity.events["id-" + id_i];
                        if (!event) {
                            break;
                        }
                    }
                    if (pageEvents.length == pagesize) {
                        return [2 /*return*/];
                    }
                }
                return [2 /*return*/, this.contract.getTable("events", { limit: pagesize, lower_bound: "" + id }).then(function (result) {
                        /** @type {?} */
                        var list = [];
                        for (var i = 0; i < result.rows.length; i++) {
                            /** @type {?} */
                            var id = result.rows[i].id;
                            /** @type {?} */
                            var event = /** @type {?} */ (result.rows[i]);
                            if (!_this.activity.events["id-" + id]) {
                                _this.activity.events["id-" + id] = event;
                                list.push(event);
                                // console.log("**************>>>>>", id);
                            }
                        }
                        _this.activity.list = [].concat(_this.activity.list).concat(list);
                        _this.activity.list.sort(function (a, b) {
                            if (a.date < b.date)
                                return 1;
                            if (a.date > b.date)
                                return -1;
                            if (a.id < b.id)
                                return 1;
                            if (a.id > b.id)
                                return -1;
                        });
                    })];
            });
        });
    };
    /**
     * @param {?} user
     * @return {?}
     */
    VapaeeDEX.prototype.fetchUserOrders = /**
     * @param {?} user
     * @return {?}
     */
    function (user) {
        return this.contract.getTable("userorders", { scope: user, limit: 200 }).then(function (result) {
            return result;
        });
    };
    /**
     * @param {?} scope
     * @return {?}
     */
    VapaeeDEX.prototype.fetchSummary = /**
     * @param {?} scope
     * @return {?}
     */
    function (scope) {
        return this.contract.getTable("tablesummary", { scope: scope }).then(function (result) {
            return result;
        });
    };
    /**
     * @param {?} token
     * @return {?}
     */
    VapaeeDEX.prototype.fetchTokenStats = /**
     * @param {?} token
     * @return {?}
     */
    function (token) {
        var _this = this;
        this.feed.setLoading("token-stat-" + token.symbol, true);
        return this.contract.getTable("stat", { contract: token.contract, scope: token.symbol }).then(function (result) {
            token.stat = result.rows[0];
            if (token.stat.issuers && token.stat.issuers[0] == "everyone") {
                token.fake = true;
            }
            _this.feed.setLoading("token-stat-" + token.symbol, false);
            return token;
        });
    };
    /**
     * @param {?=} extended
     * @return {?}
     */
    VapaeeDEX.prototype.fetchTokensStats = /**
     * @param {?=} extended
     * @return {?}
     */
    function (extended) {
        var _this = this;
        if (extended === void 0) { extended = true; }
        console.log("Vapaee.fetchTokens()");
        this.feed.setLoading("token-stats", true);
        return this.waitTokensLoaded.then(function (_) {
            /** @type {?} */
            var priomises = [];
            for (var i in _this.tokens) {
                if (_this.tokens[i].offchain)
                    continue;
                priomises.push(_this.fetchTokenStats(_this.tokens[i]));
            }
            return Promise.all(priomises).then(function (result) {
                _this.setTokenStats(_this.tokens);
                _this.feed.setLoading("token-stats", false);
                return _this.tokens;
            });
        });
    };
    /**
     * @return {?}
     */
    VapaeeDEX.prototype.updateTokensMarkets = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return Promise.all([
            this.waitTokensLoaded,
            this.waitMarketSummary
        ]).then(function (_) {
            // a cada token le asigno un price que sale de verificar su price en el mercado principal XXX/TLOS
            for (var i in _this.tokens) {
                if (_this.tokens[i].offchain)
                    continue;
                /** @type {?} */
                var token = _this.tokens[i];
                /** @type {?} */
                var quantity = new AssetDEX(0, token);
                token.markets = [];
                for (var scope in _this._markets) {
                    if (scope.indexOf(".") == -1)
                        continue;
                    /** @type {?} */
                    var table = _this._markets[scope];
                    if (table.currency.symbol == token.symbol) {
                        table = _this.market(_this.inverseScope(scope));
                    }
                    if (table.comodity.symbol == token.symbol) {
                        token.markets.push(table);
                    }
                }
            }
            token.markets.sort(function (a, b) {
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
    };
    /**
     * @param {?=} times
     * @return {?}
     */
    VapaeeDEX.prototype.updateTokensSummary = /**
     * @param {?=} times
     * @return {?}
     */
    function (times) {
        var _this = this;
        if (times === void 0) { times = 20; }
        if (times > 1) {
            for (var i = times; i > 0; i--)
                this.updateTokensSummary(1);
            this.resortTokens();
            return;
        }
        return Promise.all([
            this.waitTokensLoaded,
            this.waitMarketSummary
        ]).then(function (_) {
            /** @type {?} */
            var amount_map = {};
            // a cada token le asigno un price que sale de verificar su price en el mercado principal XXX/TLOS
            for (var i in _this.tokens) {
                if (_this.tokens[i].offchain)
                    continue;
                /** @type {?} */
                var token = _this.tokens[i];
                /** @type {?} */
                var quantity = new AssetDEX(0, token);
                for (var j in _this._markets) {
                    if (j.indexOf(".") == -1)
                        continue;
                    /** @type {?} */
                    var table = _this._markets[j];
                    if (table.comodity.symbol == token.symbol) {
                        quantity = quantity.plus(table.summary.amount);
                    }
                    if (table.currency.symbol == token.symbol) {
                        quantity = quantity.plus(table.summary.volume);
                    }
                    if (table.comodity.symbol == token.symbol && table.currency.symbol == _this.telos.symbol) {
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
                    price: new AssetDEX(0, _this.telos),
                    price_24h_ago: new AssetDEX(0, _this.telos),
                    volume: new AssetDEX(0, _this.telos),
                    percent: 0,
                    percent_str: "0%",
                };
                amount_map[token.symbol] = quantity;
            }
            _this.telos.summary = {
                price: new AssetDEX(1, _this.telos),
                price_24h_ago: new AssetDEX(1, _this.telos),
                volume: new AssetDEX(-1, _this.telos),
                percent: 0,
                percent_str: "0%"
            };
            /** @type {?} */
            var ONE = new BigNumber(1);
            for (var i in _this.tokens) {
                /** @type {?} */
                var token = _this.tokens[i];
                if (token.offchain)
                    continue;
                if (!token.summary)
                    continue;
                if (token.symbol == _this.telos.symbol)
                    continue;
                /** @type {?} */
                var volume = new AssetDEX(0, _this.telos);
                /** @type {?} */
                var price = new AssetDEX(0, _this.telos);
                /** @type {?} */
                var price_init = new AssetDEX(0, _this.telos);
                /** @type {?} */
                var total_quantity = amount_map[token.symbol];
                if (total_quantity.toNumber() == 0)
                    continue;
                // if (token.symbol == "ACORN") console.log("TOKEN: -------- ", token.symbol, token.summary.price.str, token.summary.price_24h_ago.str );
                for (var j in _this._markets) {
                    if (j.indexOf(".") == -1)
                        continue;
                    /** @type {?} */
                    var table = _this._markets[j];
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
                        var price_i = new AssetDEX(price_amount.multipliedBy(weight), _this.telos);
                        /** @type {?} */
                        var price_init_amount;
                        if (table.comodity.symbol == token.symbol) {
                            price_init_amount = table.summary.price_24h_ago.amount.multipliedBy(table.currency.summary.price_24h_ago.amount);
                        }
                        else if (table.currency.symbol == token.symbol) {
                            price_init_amount = table.summary.inverse_24h_ago.amount.multipliedBy(table.comodity.summary.price_24h_ago.amount);
                        }
                        /** @type {?} */
                        var price_init_i = new AssetDEX(price_init_amount.multipliedBy(weight), _this.telos);
                        /** @type {?} */
                        var volume_i;
                        if (table.comodity.symbol == token.symbol) {
                            volume_i = table.summary.volume.clone();
                        }
                        else if (table.currency.symbol == token.symbol) {
                            volume_i = table.summary.amount.clone();
                        }
                        // if this market does not mesure the volume in TLOS, then convert quantity to TLOS by multiplied By volume's token price
                        if (volume_i.token.symbol != _this.telos.symbol) {
                            volume_i = new AssetDEX(quantity.amount.multipliedBy(quantity.token.summary.price.amount), _this.telos);
                        }
                        price = price.plus(new AssetDEX(price_i, _this.telos));
                        price_init = price_init.plus(new AssetDEX(price_init_i, _this.telos));
                        volume = volume.plus(new AssetDEX(volume_i, _this.telos));
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
            // console.log("(end) ---------------------------------------------");
            _this.setTokenSummary();
        });
    };
    /**
     * @param {?=} extended
     * @return {?}
     */
    VapaeeDEX.prototype.fetchTokens = /**
     * @param {?=} extended
     * @return {?}
     */
    function (extended) {
        if (extended === void 0) { extended = true; }
        console.log("Vapaee.fetchTokens()");
        return this.contract.getTable("tokens").then(function (result) {
            /** @type {?} */
            var data = {
                tokens: /** @type {?} */ (result.rows)
            };
            for (var i in data.tokens) {
                data.tokens[i].scope = data.tokens[i].symbol.toLowerCase() + ".tlos";
            }
            return data;
        });
    };
    /**
     * @return {?}
     */
    VapaeeDEX.prototype.resortTokens = /**
     * @return {?}
     */
    function () {
        // console.log("(ini) ------------------------------------------------------------");
        // console.log("resortTokens()");
        // console.log("this.tokens[0]", this.tokens[0].summary);
        this.tokens.sort(function (a, b) {
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
    };
    /**
     * @return {?}
     */
    VapaeeDEX.prototype.resortTopMarkets = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.waitTokenSummary.then(function (_) {
            _this.topmarkets = [];
            /** @type {?} */
            var inverse;
            /** @type {?} */
            var market;
            for (var scope in _this._markets) {
                market = _this._markets[scope];
                if (market.direct >= market.inverse) {
                    _this.topmarkets.push(market);
                }
                else {
                    inverse = _this.inverseScope(scope);
                    market = _this.market(inverse);
                    _this.topmarkets.push(market);
                }
            }
            _this.topmarkets.sort(function (a, b) {
                /** @type {?} */
                var a_vol = a.summary ? a.summary.volume : new AssetDEX();
                /** @type {?} */
                var b_vol = b.summary ? b.summary.volume : new AssetDEX();
                if (a_vol.token != _this.telos) {
                    a_vol = new AssetDEX(a_vol.amount.multipliedBy(a_vol.token.summary.price.amount), _this.telos);
                }
                if (b_vol.token != _this.telos) {
                    b_vol = new AssetDEX(b_vol.amount.multipliedBy(b_vol.token.summary.price.amount), _this.telos);
                }
                console.assert(b_vol.token == _this.telos, "ERROR: volume misscalculated");
                console.assert(a_vol.token == _this.telos, "ERROR: volume misscalculated");
                if (a_vol.amount.isGreaterThan(b_vol.amount))
                    return -1;
                if (a_vol.amount.isLessThan(b_vol.amount))
                    return 1;
                if (a.currency == _this.telos && b.currency != _this.telos)
                    return -1;
                if (b.currency == _this.telos && a.currency != _this.telos)
                    return 1;
                if (a.comodity.appname < b.comodity.appname)
                    return -1;
                if (a.comodity.appname > b.comodity.appname)
                    return 1;
            });
            _this.onTopMarketsReady.next(_this.topmarkets);
        });
    };
    VapaeeDEX.decorators = [
        { type: Injectable, args: [{
                    providedIn: "root"
                },] },
    ];
    /** @nocollapse */
    VapaeeDEX.ctorParameters = function () { return [
        { type: VapaeeScatter },
        { type: CookieService },
        { type: DatePipe }
    ]; };
    /** @nocollapse */ VapaeeDEX.ngInjectableDef = i0.defineInjectable({ factory: function VapaeeDEX_Factory() { return new VapaeeDEX(i0.inject(i1.VapaeeScatter), i0.inject(i2.CookieService), i0.inject(i3.DatePipe)); }, token: VapaeeDEX, providedIn: "root" });
    return VapaeeDEX;
}());
export { VapaeeDEX };
if (false) {
    /** @type {?} */
    VapaeeDEX.prototype.loginState;
    /** @type {?} */
    VapaeeDEX.prototype._markets;
    /** @type {?} */
    VapaeeDEX.prototype._reverse;
    /** @type {?} */
    VapaeeDEX.prototype.topmarkets;
    /** @type {?} */
    VapaeeDEX.prototype.zero_telos;
    /** @type {?} */
    VapaeeDEX.prototype.telos;
    /** @type {?} */
    VapaeeDEX.prototype.tokens;
    /** @type {?} */
    VapaeeDEX.prototype.currencies;
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
    VapaeeDEX.prototype.onTopMarketsReady;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV4LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AdmFwYWVlL2RleC8iLCJzb3VyY2VzIjpbImxpYi9kZXguc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLFNBQVMsTUFBTSxjQUFjLENBQUM7QUFDckMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUsYUFBYSxFQUFpRSxNQUFNLGlCQUFpQixDQUFDOzs7Ozs7SUEwRTNHLG1CQUNZLFNBQ0EsU0FDQTtRQUhaLGlCQTJGQztRQTFGVyxZQUFPLEdBQVAsT0FBTztRQUNQLFlBQU8sR0FBUCxPQUFPO1FBQ1AsYUFBUSxHQUFSLFFBQVE7cUNBN0MyQixJQUFJLE9BQU8sRUFBRTtzQ0FDWixJQUFJLE9BQU8sRUFBRTsrQkFDcEIsSUFBSSxPQUFPLEVBQUU7K0JBQ04sSUFBSSxPQUFPLEVBQUU7NkJBRWxCLElBQUksT0FBTyxFQUFFO2lDQUNYLElBQUksT0FBTyxFQUFFOzhCQUNyQixJQUFJLE9BQU8sRUFBRTs0QkFDNUIsY0FBYztnQ0FFVixFQUFFO2dDQVNZLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTztZQUN4RCxLQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQztTQUNsQyxDQUFDOzhCQUdvQyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU87WUFDdEQsS0FBSSxD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Q0FBTzs7b0NBRWQsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7b0NBQ2QsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO29DQUN0QyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7b0NBQzNDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztvQ0FDeEMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO29DQUN0QyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7b0NBRTNCLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO29DQUNkLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7b0NBQzFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7b0NBQy9DLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7b0NBQzVDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7b0NBQzFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29DQUMvQixVQUFVLEdBQUcsS0FBSyxDQUFDO2lDQUN0QjtnQ0FFRCxFQUFFLENBQUMsQ0FBQyxVQUFVLElB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QUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0Q0FDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0Q0FDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0Q0FDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3lDQUN4Qzt3Q0FDRCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzt3Q0FHdEIsR0FBRyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3Q0FDM0IsR0FBRyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7d0NBQzdCLE1BQU0sR0FBRyxFQUFFLENBQUM7d0NBQ1osR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFOzRDQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0NBQzNDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7NENBQ04sTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NENBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFD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LENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7NEJBSTFELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDOzRCQUM3RixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQzs0QkFDM0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7NEJBQzVGLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOzRCQUMxRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzs0QkFDdEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7NEJBQ3hELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFD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QWlCLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNoRCxDQUFDLENBQUM7OztnQkFod0VWLFVBQVUsU0FBQztvQkFDUixVQUFVLEVBQUUsTUFBTTtpQkFDckI7Ozs7Z0JBTlEsYUFBYTtnQkFMYixhQUFhO2dCQUNiLFFBQVE7OztvQkFKakI7O1NBZWEsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCBCaWdOdW1iZXIgZnJvbSBcImJpZ251bWJlci5qc1wiO1xuaW1wb3J0IHsgQ29va2llU2VydmljZSB9IGZyb20gJ25neC1jb29raWUtc2VydmljZSc7XG5pbXBvcnQgeyBEYXRlUGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBUb2tlbkRFWCB9IGZyb20gJy4vdG9rZW4tZGV4LmNsYXNzJztcbmltcG9ydCB7IEFzc2V0REVYIH0gZnJvbSAnLi9hc3NldC1kZXguY2xhc3MnO1xuaW1wb3J0IHsgRmVlZGJhY2sgfSBmcm9tICdAdmFwYWVlL2ZlZWRiYWNrJztcbmltcG9ydCB7IFZhcGFlZVNjYXR0ZXIsIEFjY291bnQsIEFjY291bnREYXRhLCBTbWFydENvbnRyYWN0LCBUYWJsZVJlc3VsdCwgVGFibGVQYXJhbXMgfSBmcm9tICdAdmFwYWVlL3NjYXR0ZXInO1xuaW1wb3J0IHsgTWFya2V0TWFwLCBVc2VyT3JkZXJzTWFwLCBNYXJrZXRTdW1tYXJ5LCBFdmVudExvZywgTWFya2V0LCBIaXN0b3J5VHgsIFRva2VuT3JkZXJzLCBPcmRlciwgVXNlck9yZGVycywgT3JkZXJSb3csIEhpc3RvcnlCbG9jayB9IGZyb20gJy4vdHlwZXMtZGV4JztcblxuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogXCJyb290XCJcbn0pXG5leHBvcnQgY2xhc3MgVmFwYWVlREVYIHtcblxuICAgIHB1YmxpYyBsb2dpblN0YXRlOiBzdHJpbmc7XG4gICAgLypcbiAgICBwdWJsaWMgbG9naW5TdGF0ZTogc3RyaW5nO1xuICAgIC0gJ25vLXNjYXR0ZXInOiBTY2F0dGVyIG5vIGRldGVjdGVkXG4gICAgLSAnbm8tbG9nZ2VkJzogU2NhdHRlciBkZXRlY3RlZCBidXQgdXNlciBpcyBub3QgbG9nZ2VkXG4gICAgLSAnYWNjb3VudC1vayc6IHVzZXIgbG9nZ2VyIHdpdGggc2NhdHRlclxuICAgICovXG4gICAgcHJpdmF0ZSBfbWFya2V0czogTWFya2V0TWFwO1xuICAgIHByaXZhdGUgX3JldmVyc2U6IE1hcmtldE1hcDtcbiAgICBwdWJsaWMgdG9wbWFya2V0czogTWFya2V0W107XG5cbiAgICBwdWJsaWMgemVyb190ZWxvczogQXNzZXRERVg7XG4gICAgcHVibGljIHRlbG9zOiBUb2tlbkRFWDtcbiAgICBwdWJsaWMgdG9rZW5zOiBUb2tlbkRFWFtdO1xuICAgIHB1YmxpYyBjdXJyZW5jaWVzOiBUb2tlbkRFWFtdO1xuICAgIHB1YmxpYyBjb250cmFjdDogU21hcnRDb250cmFjdDtcbiAgICBwdWJsaWMgZmVlZDogRmVlZGJhY2s7XG4gICAgcHVibGljIGN1cnJlbnQ6IEFjY291bnQ7XG4gICAgcHVibGljIGxhc3RfbG9nZ2VkOiBzdHJpbmc7XG4gICAgcHVibGljIGNvbnRyYWN0X25hbWU6IHN0cmluZzsgICBcbiAgICBwdWJsaWMgZGVwb3NpdHM6IEFzc2V0REVYW107XG4gICAgcHVibGljIGJhbGFuY2VzOiBBc3NldERFWFtdO1xuICAgIHB1YmxpYyB1c2Vyb3JkZXJzOiBVc2VyT3JkZXJzTWFwO1xuICAgIHB1YmxpYyBvbkxvZ2dlZEFjY291bnRDaGFuZ2U6U3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3QoKTtcbiAgICBwdWJsaWMgb25DdXJyZW50QWNjb3VudENoYW5nZTpTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvbkhpc3RvcnlDaGFuZ2U6U3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3QoKTtcbiAgICBwdWJsaWMgb25NYXJrZXRTdW1tYXJ5OlN1YmplY3Q8TWFya2V0U3VtbWFyeT4gPSBuZXcgU3ViamVjdCgpO1xuICAgIC8vIHB1YmxpYyBvbkJsb2NrbGlzdENoYW5nZTpTdWJqZWN0PGFueVtdW10+ID0gbmV3IFN1YmplY3QoKTtcbiAgICBwdWJsaWMgb25Ub2tlbnNSZWFkeTpTdWJqZWN0PFRva2VuREVYW10+ID0gbmV3IFN1YmplY3QoKTtcbiAgICBwdWJsaWMgb25Ub3BNYXJrZXRzUmVhZHk6U3ViamVjdDxNYXJrZXRbXT4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvblRyYWRlVXBkYXRlZDpTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHZhcGFlZXRva2VuczpzdHJpbmcgPSBcInZhcGFlZXRva2Vuc1wiO1xuXG4gICAgYWN0aXZpdHlQYWdlc2l6ZTpudW1iZXIgPSAxMDtcbiAgICBcbiAgICBhY3Rpdml0eTp7XG4gICAgICAgIHRvdGFsOm51bWJlcjtcbiAgICAgICAgZXZlbnRzOntbaWQ6c3RyaW5nXTpFdmVudExvZ307XG4gICAgICAgIGxpc3Q6RXZlbnRMb2dbXTtcbiAgICB9O1xuICAgIFxuICAgIHByaXZhdGUgc2V0T3JkZXJTdW1tYXJ5OiBGdW5jdGlvbjtcbiAgICBwdWJsaWMgd2FpdE9yZGVyU3VtbWFyeTogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRPcmRlclN1bW1hcnkgPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgcHJpdmF0ZSBzZXRUb2tlblN0YXRzOiBGdW5jdGlvbjtcbiAgICBwdWJsaWMgd2FpdFRva2VuU3RhdHM6IFByb21pc2U8YW55PiA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0VG9rZW5TdGF0cyA9IHJlc29sdmU7XG4gICAgfSk7XG5cbiAgICBwcml2YXRlIHNldE1hcmtldFN1bW1hcnk6IEZ1bmN0aW9uO1xuICAgIHB1YmxpYyB3YWl0TWFya2V0U3VtbWFyeTogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRNYXJrZXRTdW1tYXJ5ID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIHByaXZhdGUgc2V0VG9rZW5TdW1tYXJ5OiBGdW5jdGlvbjtcbiAgICBwdWJsaWMgd2FpdFRva2VuU3VtbWFyeTogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRUb2tlblN1bW1hcnkgPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgcHJpdmF0ZSBzZXRUb2tlbnNMb2FkZWQ6IEZ1bmN0aW9uO1xuICAgIHB1YmxpYyB3YWl0VG9rZW5zTG9hZGVkOiBQcm9taXNlPGFueT4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0aGlzLnNldFRva2Vuc0xvYWRlZCA9IHJlc29sdmU7XG4gICAgfSk7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgc2NhdHRlcjogVmFwYWVlU2NhdHRlcixcbiAgICAgICAgcHJpdmF0ZSBjb29raWVzOiBDb29raWVTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIGRhdGVQaXBlOiBEYXRlUGlwZVxuICAgICkge1xuICAgICAgICB0aGlzLl9tYXJrZXRzID0ge307XG4gICAgICAgIHRoaXMuX3JldmVyc2UgPSB7fTtcbiAgICAgICAgdGhpcy5hY3Rpdml0eSA9IHt0b3RhbDowLCBldmVudHM6e30sIGxpc3Q6W119O1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLmRlZmF1bHQ7XG4gICAgICAgIHRoaXMuY29udHJhY3RfbmFtZSA9IHRoaXMudmFwYWVldG9rZW5zO1xuICAgICAgICB0aGlzLmNvbnRyYWN0ID0gdGhpcy5zY2F0dGVyLmdldFNtYXJ0Q29udHJhY3QodGhpcy5jb250cmFjdF9uYW1lKTtcbiAgICAgICAgdGhpcy5mZWVkID0gbmV3IEZlZWRiYWNrKCk7XG4gICAgICAgIHRoaXMuc2NhdHRlci5vbkxvZ2dnZWRTdGF0ZUNoYW5nZS5zdWJzY3JpYmUodGhpcy5vbkxvZ2dlZENoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy51cGRhdGVMb2dTdGF0ZSgpO1xuICAgICAgICB0aGlzLmZldGNoVG9rZW5zKCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgIHRoaXMudG9rZW5zID0gW107XG4gICAgICAgICAgICBsZXQgY2FyYm9uO1xuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBkYXRhLnRva2Vucykge1xuICAgICAgICAgICAgICAgIGxldCB0ZGF0YSA9IGRhdGEudG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgIGxldCB0b2tlbiA9IG5ldyBUb2tlbkRFWCh0ZGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy50b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuLnN5bWJvbCA9PSBcIlRMT1NcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRlbG9zID0gdG9rZW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5zeW1ib2wgPT0gXCJDVVNEXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FyYm9uID0gdG9rZW47XG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaGFyZG9kZWQgdGVtcG9yYXJ5IGluc2VydGVkIHRva2VucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBsZXQgY2FyYm9uID0gbmV3IFRva2VuREVYKHtcbiAgICAgICAgICAgICAgICBhcHBuYW1lOiBcIkNhcmJvblwiLFxuICAgICAgICAgICAgICAgIGNvbnRyYWN0OiBcInN0YWJsZWNhcmJvblwiLFxuICAgICAgICAgICAgICAgIGxvZ286IFwiL2Fzc2V0cy9sb2dvcy9jYXJib24uc3ZnXCIsXG4gICAgICAgICAgICAgICAgbG9nb2xnOiBcIi9hc3NldHMvbG9nb3MvY2FyYm9uLnN2Z1wiLFxuICAgICAgICAgICAgICAgIHByZWNpc2lvbjogMixcbiAgICAgICAgICAgICAgICBzY29wZTogXCJjdXNkLnRsb3NcIixcbiAgICAgICAgICAgICAgICBzeW1ib2w6IFwiQ1VTRFwiLFxuICAgICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3ZWJzaXRlOiBcImh0dHBzOi8vd3d3LmNhcmJvbi5tb25leVwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2goY2FyYm9uKTtcbiAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIC8vIFRPRE86IG1ha2UgdGhpcyBkeW5hbWljIGFuZCBub3QgaGFyZGNvZGVkIC0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIHRoaXMuY3VycmVuY2llcyA9IFsgdGhpcy50ZWxvcywgY2FyYm9uIF07XG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy50b2tlbnMucHVzaChuZXcgVG9rZW5ERVgoe1xuICAgICAgICAgICAgICAgIGFwcG5hbWU6IFwiVmlpdGFzcGhlcmVcIixcbiAgICAgICAgICAgICAgICBjb250cmFjdDogXCJ2aWl0YXNwaGVyZTFcIixcbiAgICAgICAgICAgICAgICBsb2dvOiBcIi9hc3NldHMvbG9nb3MvdmlpdGFzcGhlcmUucG5nXCIsXG4gICAgICAgICAgICAgICAgbG9nb2xnOiBcIi9hc3NldHMvbG9nb3MvdmlpdGFzcGhlcmUtbGcucG5nXCIsXG4gICAgICAgICAgICAgICAgcHJlY2lzaW9uOiA0LFxuICAgICAgICAgICAgICAgIHNjb3BlOiBcInZpaXRjdC50bG9zXCIsXG4gICAgICAgICAgICAgICAgc3ltYm9sOiBcIlZJSVRBXCIsXG4gICAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdlYnNpdGU6IFwiaHR0cHM6Ly92aWl0YXNwaGVyZS5jb21cIlxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdGhpcy50b2tlbnMucHVzaChuZXcgVG9rZW5ERVgoe1xuICAgICAgICAgICAgICAgIGFwcG5hbWU6IFwiVmlpdGFzcGhlcmVcIixcbiAgICAgICAgICAgICAgICBjb250cmFjdDogXCJ2aWl0YXNwaGVyZTFcIixcbiAgICAgICAgICAgICAgICBsb2dvOiBcIi9hc3NldHMvbG9nb3MvdmlpdGFzcGhlcmUucG5nXCIsXG4gICAgICAgICAgICAgICAgbG9nb2xnOiBcIi9hc3NldHMvbG9nb3MvdmlpdGFzcGhlcmUtbGcucG5nXCIsXG4gICAgICAgICAgICAgICAgcHJlY2lzaW9uOiAwLFxuICAgICAgICAgICAgICAgIHNjb3BlOiBcInZpaXRjdC50bG9zXCIsXG4gICAgICAgICAgICAgICAgc3ltYm9sOiBcIlZJSUNUXCIsXG4gICAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdlYnNpdGU6IFwiaHR0cHM6Ly92aWl0YXNwaGVyZS5jb21cIlxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdGhpcy56ZXJvX3RlbG9zID0gbmV3IEFzc2V0REVYKFwiMC4wMDAwIFRMT1NcIiwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLnNldFRva2Vuc0xvYWRlZCgpO1xuICAgICAgICAgICAgdGhpcy5mZXRjaFRva2Vuc1N0YXRzKCk7XG4gICAgICAgICAgICB0aGlzLmdldE9yZGVyU3VtbWFyeSgpO1xuICAgICAgICAgICAgdGhpcy5nZXRBbGxUYWJsZXNTdW1hcmllcygpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihfID0+IHtcbiAgICAgICAgLy8gfSlcblxuXG4gICAgICAgIHZhciB0aW1lcjtcbiAgICAgICAgdGhpcy5vbk1hcmtldFN1bW1hcnkuc3Vic2NyaWJlKHN1bW1hcnkgPT4ge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgICAgIHRpbWVyID0gc2V0VGltZW91dChfID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRva2Vuc1N1bW1hcnkoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRva2Vuc01hcmtldHMoKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIGdldHRlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBkZWZhdWx0KCk6IEFjY291bnQge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLmRlZmF1bHQ7XG4gICAgfVxuXG4gICAgZ2V0IGxvZ2dlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NhdHRlci5sb2dnZWQgJiYgIXRoaXMuc2NhdHRlci5hY2NvdW50KSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIldBUk5JTkchISFcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnNjYXR0ZXIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5zY2F0dGVyLnVzZXJuYW1lKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCIqKioqKioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgKi9cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLmxvZ2dlZCA/XG4gICAgICAgICAgICAodGhpcy5zY2F0dGVyLmFjY291bnQgPyB0aGlzLnNjYXR0ZXIuYWNjb3VudC5uYW1lIDogdGhpcy5zY2F0dGVyLmRlZmF1bHQubmFtZSkgOlxuICAgICAgICAgICAgbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgYWNjb3VudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhdHRlci5sb2dnZWQgPyBcbiAgICAgICAgdGhpcy5zY2F0dGVyLmFjY291bnQgOlxuICAgICAgICB0aGlzLnNjYXR0ZXIuZGVmYXVsdDtcbiAgICB9XG5cbiAgICAvLyAtLSBVc2VyIExvZyBTdGF0ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsb2dpbigpIHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dpblwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2ctc3RhdGVcIiwgdHJ1ZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmxvZ2luKCkgdGhpcy5mZWVkLmxvYWRpbmcoJ2xvZy1zdGF0ZScpXCIsIHRoaXMuZmVlZC5sb2FkaW5nKCdsb2ctc3RhdGUnKSk7XG4gICAgICAgIHRoaXMubG9nb3V0KCk7XG4gICAgICAgIHRoaXMudXBkYXRlTG9nU3RhdGUoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgubG9naW4oKSB0aGlzLmZlZWQubG9hZGluZygnbG9nLXN0YXRlJylcIiwgdGhpcy5mZWVkLmxvYWRpbmcoJ2xvZy1zdGF0ZScpKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dvdXRcIiwgZmFsc2UpO1xuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLmxvZ2luKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxvZ1N0YXRlKCk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ2luXCIsIGZhbHNlKTtcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ2luXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dvdXRcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc2NhdHRlci5sb2dvdXQoKTtcbiAgICB9XG5cbiAgICBvbkxvZ291dCgpIHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dvdXRcIiwgZmFsc2UpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5vbkxvZ291dCgpXCIpO1xuICAgICAgICB0aGlzLnJlc2V0Q3VycmVudEFjY291bnQodGhpcy5kZWZhdWx0Lm5hbWUpO1xuICAgICAgICB0aGlzLnVwZGF0ZUxvZ1N0YXRlKCk7XG4gICAgICAgIHRoaXMub25Mb2dnZWRBY2NvdW50Q2hhbmdlLm5leHQodGhpcy5sb2dnZWQpO1xuICAgICAgICB0aGlzLmNvb2tpZXMuZGVsZXRlKFwibG9naW5cIik7XG4gICAgICAgIHNldFRpbWVvdXQoXyAgPT4geyB0aGlzLmxhc3RfbG9nZ2VkID0gdGhpcy5sb2dnZWQ7IH0sIDQwMCk7XG4gICAgfVxuICAgIFxuICAgIG9uTG9naW4obmFtZTpzdHJpbmcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgub25Mb2dpbigpXCIsIG5hbWUpO1xuICAgICAgICB0aGlzLnJlc2V0Q3VycmVudEFjY291bnQobmFtZSk7XG4gICAgICAgIHRoaXMuZ2V0RGVwb3NpdHMoKTtcbiAgICAgICAgdGhpcy5nZXRCYWxhbmNlcygpO1xuICAgICAgICB0aGlzLnVwZGF0ZUxvZ1N0YXRlKCk7XG4gICAgICAgIHRoaXMuZ2V0VXNlck9yZGVycygpO1xuICAgICAgICB0aGlzLm9uTG9nZ2VkQWNjb3VudENoYW5nZS5uZXh0KHRoaXMubG9nZ2VkKTtcbiAgICAgICAgdGhpcy5sYXN0X2xvZ2dlZCA9IHRoaXMubG9nZ2VkO1xuICAgICAgICB0aGlzLmNvb2tpZXMuc2V0KFwibG9naW5cIiwgdGhpcy5sb2dnZWQpO1xuICAgIH1cblxuICAgIG9uTG9nZ2VkQ2hhbmdlKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5vbkxvZ2dlZENoYW5nZSgpXCIpO1xuICAgICAgICBpZiAodGhpcy5zY2F0dGVyLmxvZ2dlZCkge1xuICAgICAgICAgICAgdGhpcy5vbkxvZ2luKHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vbkxvZ291dCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgcmVzZXRDdXJyZW50QWNjb3VudChwcm9maWxlOnN0cmluZykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5yZXNldEN1cnJlbnRBY2NvdW50KClcIiwgdGhpcy5jdXJyZW50Lm5hbWUsIFwiLT5cIiwgcHJvZmlsZSk7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnQubmFtZSAhPSBwcm9maWxlICYmICh0aGlzLmN1cnJlbnQubmFtZSA9PSB0aGlzLmxhc3RfbG9nZ2VkIHx8IHByb2ZpbGUgIT0gXCJndWVzdFwiKSkge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJhY2NvdW50XCIsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5kZWZhdWx0O1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Lm5hbWUgPSBwcm9maWxlO1xuICAgICAgICAgICAgaWYgKHByb2ZpbGUgIT0gXCJndWVzdFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50LmRhdGEgPSBhd2FpdCB0aGlzLmdldEFjY291bnREYXRhKHRoaXMuY3VycmVudC5uYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJXQVJOSU5HISEhIGN1cnJlbnQgaXMgZ3Vlc3RcIiwgW3Byb2ZpbGUsIHRoaXMuYWNjb3VudCwgdGhpcy5jdXJyZW50XSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGhpcy5zY29wZXMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuYmFsYW5jZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMudXNlcm9yZGVycyA9IHt9OyAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLm9uQ3VycmVudEFjY291bnRDaGFuZ2UubmV4dCh0aGlzLmN1cnJlbnQubmFtZSkgISEhISEhXCIpO1xuICAgICAgICAgICAgdGhpcy5vbkN1cnJlbnRBY2NvdW50Q2hhbmdlLm5leHQodGhpcy5jdXJyZW50Lm5hbWUpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50VXNlcigpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJhY2NvdW50XCIsIGZhbHNlKTtcbiAgICAgICAgfSAgICAgICBcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUxvZ1N0YXRlKCkge1xuICAgICAgICB0aGlzLmxvZ2luU3RhdGUgPSBcIm5vLXNjYXR0ZXJcIjtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2ctc3RhdGVcIiwgdHJ1ZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnVwZGF0ZUxvZ1N0YXRlKCkgXCIsIHRoaXMubG9naW5TdGF0ZSwgdGhpcy5mZWVkLmxvYWRpbmcoXCJsb2ctc3RhdGVcIikpO1xuICAgICAgICB0aGlzLnNjYXR0ZXIud2FpdENvbm5lY3RlZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9naW5TdGF0ZSA9IFwibm8tbG9nZ2VkXCI7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC51cGRhdGVMb2dTdGF0ZSgpICAgXCIsIHRoaXMubG9naW5TdGF0ZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5zY2F0dGVyLmxvZ2dlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9naW5TdGF0ZSA9IFwiYWNjb3VudC1va1wiO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnVwZGF0ZUxvZ1N0YXRlKCkgICAgIFwiLCB0aGlzLmxvZ2luU3RhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2ctc3RhdGVcIiwgZmFsc2UpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgudXBkYXRlTG9nU3RhdGUoKSBcIiwgdGhpcy5sb2dpblN0YXRlLCB0aGlzLmZlZWQubG9hZGluZyhcImxvZy1zdGF0ZVwiKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciB0aW1lcjI7XG4gICAgICAgIHZhciB0aW1lcjEgPSBzZXRJbnRlcnZhbChfID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zY2F0dGVyLmZlZWQubG9hZGluZyhcImNvbm5lY3RcIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZy1zdGF0ZVwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcjEpO1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMjAwKTtcblxuICAgICAgICB0aW1lcjIgPSBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcjEpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2ctc3RhdGVcIiwgZmFsc2UpO1xuICAgICAgICB9LCA2MDAwKTtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRBY2NvdW50RGF0YShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPEFjY291bnREYXRhPiAge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLnF1ZXJ5QWNjb3VudERhdGEobmFtZSkuY2F0Y2goYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWZhdWx0LmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFjdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjcmVhdGVPcmRlcih0eXBlOnN0cmluZywgYW1vdW50OkFzc2V0REVYLCBwcmljZTpBc3NldERFWCkge1xuICAgICAgICAvLyBcImFsaWNlXCIsIFwiYnV5XCIsIFwiMi41MDAwMDAwMCBDTlRcIiwgXCIwLjQwMDAwMDAwIFRMT1NcIlxuICAgICAgICAvLyBuYW1lIG93bmVyLCBuYW1lIHR5cGUsIGNvbnN0IGFzc2V0ICYgdG90YWwsIGNvbnN0IGFzc2V0ICYgcHJpY2VcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJvcmRlci1cIit0eXBlLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZXhjZWN1dGUoXCJvcmRlclwiLCB7XG4gICAgICAgICAgICBvd25lcjogIHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgdG90YWw6IGFtb3VudC50b1N0cmluZyg4KSxcbiAgICAgICAgICAgIHByaWNlOiBwcmljZS50b1N0cmluZyg4KVxuICAgICAgICB9KS50aGVuKGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRyYWRlKGFtb3VudC50b2tlbiwgcHJpY2UudG9rZW4pO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJvcmRlci1cIit0eXBlLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwib3JkZXItXCIrdHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNhbmNlbE9yZGVyKHR5cGU6c3RyaW5nLCBjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgsIG9yZGVyczpudW1iZXJbXSkge1xuICAgICAgICAvLyAnW1wiYWxpY2VcIiwgXCJidXlcIiwgXCJDTlRcIiwgXCJUTE9TXCIsIFsxLDBdXSdcbiAgICAgICAgLy8gbmFtZSBvd25lciwgbmFtZSB0eXBlLCBjb25zdCBhc3NldCAmIHRvdGFsLCBjb25zdCBhc3NldCAmIHByaWNlXG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY2FuY2VsLVwiK3R5cGUsIHRydWUpO1xuICAgICAgICBmb3IgKHZhciBpIGluIG9yZGVycykgeyB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImNhbmNlbC1cIit0eXBlK1wiLVwiK29yZGVyc1tpXSwgdHJ1ZSk7IH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZXhjZWN1dGUoXCJjYW5jZWxcIiwge1xuICAgICAgICAgICAgb3duZXI6ICB0aGlzLnNjYXR0ZXIuYWNjb3VudC5uYW1lLFxuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIGNvbW9kaXR5OiBjb21vZGl0eS5zeW1ib2wsXG4gICAgICAgICAgICBjdXJyZW5jeTogY3VycmVuY3kuc3ltYm9sLFxuICAgICAgICAgICAgb3JkZXJzOiBvcmRlcnNcbiAgICAgICAgfSkudGhlbihhc3luYyByZXN1bHQgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUcmFkZShjb21vZGl0eSwgY3VycmVuY3kpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBvcmRlcnMpIHsgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZStcIi1cIitvcmRlcnNbaV0sIGZhbHNlKTsgfSAgICBcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBvcmRlcnMpIHsgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZStcIi1cIitvcmRlcnNbaV0sIGZhbHNlKTsgfSAgICBcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXBvc2l0KHF1YW50aXR5OkFzc2V0REVYKSB7XG4gICAgICAgIC8vIG5hbWUgb3duZXIsIG5hbWUgdHlwZSwgY29uc3QgYXNzZXQgJiB0b3RhbCwgY29uc3QgYXNzZXQgJiBwcmljZVxuICAgICAgICB2YXIgY29udHJhY3QgPSB0aGlzLnNjYXR0ZXIuZ2V0U21hcnRDb250cmFjdChxdWFudGl0eS50b2tlbi5jb250cmFjdCk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRFcnJvcihcImRlcG9zaXRcIiwgbnVsbCk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdFwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0LVwiK3F1YW50aXR5LnRva2VuLnN5bWJvbC50b0xvd2VyQ2FzZSgpLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIGNvbnRyYWN0LmV4Y2VjdXRlKFwidHJhbnNmZXJcIiwge1xuICAgICAgICAgICAgZnJvbTogIHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICB0bzogdGhpcy52YXBhZWV0b2tlbnMsXG4gICAgICAgICAgICBxdWFudGl0eTogcXVhbnRpdHkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIG1lbW86IFwiZGVwb3NpdFwiXG4gICAgICAgIH0pLnRoZW4oYXN5bmMgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdFwiLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImRlcG9zaXQtXCIrcXVhbnRpdHkudG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCksIGZhbHNlKTsgICAgXG4gICAgICAgICAgICAvKmF3YWl0Ki8gdGhpcy5nZXREZXBvc2l0cygpO1xuICAgICAgICAgICAgLyphd2FpdCovIHRoaXMuZ2V0QmFsYW5jZXMoKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdC1cIitxdWFudGl0eS50b2tlbi5zeW1ib2wudG9Mb3dlckNhc2UoKSwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldEVycm9yKFwiZGVwb3NpdFwiLCB0eXBlb2YgZSA9PSBcInN0cmluZ1wiID8gZSA6IEpTT04uc3RyaW5naWZ5KGUsbnVsbCw0KSk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSk7XG4gICAgfSAgICBcblxuICAgIHdpdGhkcmF3KHF1YW50aXR5OkFzc2V0REVYKSB7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRFcnJvcihcIndpdGhkcmF3XCIsIG51bGwpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3XCIsIHRydWUpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3LVwiK3F1YW50aXR5LnRva2VuLnN5bWJvbC50b0xvd2VyQ2FzZSgpLCB0cnVlKTsgICBcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZXhjZWN1dGUoXCJ3aXRoZHJhd1wiLCB7XG4gICAgICAgICAgICBvd25lcjogIHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICBxdWFudGl0eTogcXVhbnRpdHkudG9TdHJpbmcoKVxuICAgICAgICB9KS50aGVuKGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwid2l0aGRyYXctXCIrcXVhbnRpdHkudG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCksIGZhbHNlKTtcbiAgICAgICAgICAgIC8qYXdhaXQqLyB0aGlzLmdldERlcG9zaXRzKCk7XG4gICAgICAgICAgICAvKmF3YWl0Ki8gdGhpcy5nZXRCYWxhbmNlcygpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwid2l0aGRyYXctXCIrcXVhbnRpdHkudG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCksIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRFcnJvcihcIndpdGhkcmF3XCIsIHR5cGVvZiBlID09IFwic3RyaW5nXCIgPyBlIDogSlNPTi5zdHJpbmdpZnkoZSxudWxsLDQpKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFRva2VucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGFkZE9mZkNoYWluVG9rZW4ob2ZmY2hhaW46IFRva2VuREVYKSB7XG4gICAgICAgIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKF8gPT4ge1xuICAgICAgICAgICAgdGhpcy50b2tlbnMucHVzaChuZXcgVG9rZW5ERVgoe1xuICAgICAgICAgICAgICAgIHN5bWJvbDogb2ZmY2hhaW4uc3ltYm9sLFxuICAgICAgICAgICAgICAgIHByZWNpc2lvbjogb2ZmY2hhaW4ucHJlY2lzaW9uIHx8IDQsXG4gICAgICAgICAgICAgICAgY29udHJhY3Q6IFwibm9jb250cmFjdFwiLFxuICAgICAgICAgICAgICAgIGFwcG5hbWU6IG9mZmNoYWluLmFwcG5hbWUsXG4gICAgICAgICAgICAgICAgd2Vic2l0ZTogXCJcIixcbiAgICAgICAgICAgICAgICBsb2dvOlwiXCIsXG4gICAgICAgICAgICAgICAgbG9nb2xnOiBcIlwiLFxuICAgICAgICAgICAgICAgIHNjb3BlOiBcIlwiLFxuICAgICAgICAgICAgICAgIHN0YXQ6IG51bGwsXG4gICAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG9mZmNoYWluOiB0cnVlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTY29wZXMgLyBUYWJsZXMgXG4gICAgcHVibGljIGhhc1Njb3BlcygpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fbWFya2V0cztcbiAgICB9XG5cbiAgICBwdWJsaWMgbWFya2V0KHNjb3BlOnN0cmluZyk6IE1hcmtldCB7XG4gICAgICAgIGlmICh0aGlzLl9tYXJrZXRzW3Njb3BlXSkgcmV0dXJuIHRoaXMuX21hcmtldHNbc2NvcGVdOyAgICAgICAgLy8gLS0tPiBkaXJlY3RcbiAgICAgICAgdmFyIHJldmVyc2UgPSB0aGlzLmludmVyc2VTY29wZShzY29wZSk7XG4gICAgICAgIGlmICh0aGlzLl9yZXZlcnNlW3JldmVyc2VdKSByZXR1cm4gdGhpcy5fcmV2ZXJzZVtyZXZlcnNlXTsgICAgLy8gLS0tPiByZXZlcnNlXG4gICAgICAgIGlmICghdGhpcy5fbWFya2V0c1tyZXZlcnNlXSkgcmV0dXJuIG51bGw7ICAgICAgICAgICAgICAgICAgICAgLy8gLS0tPiB0YWJsZSBkb2VzIG5vdCBleGlzdCAob3IgaGFzIG5vdCBiZWVuIGxvYWRlZCB5ZXQpXG4gICAgICAgIHJldHVybiB0aGlzLnJldmVyc2Uoc2NvcGUpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0YWJsZShzY29wZTpzdHJpbmcpOiBNYXJrZXQge1xuICAgICAgICAvL2NvbnNvbGUuZXJyb3IoXCJ0YWJsZShcIitzY29wZStcIikgREVQUkVDQVRFRFwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFya2V0KHNjb3BlKTtcbiAgICB9ICAgIFxuXG4gICAgcHJpdmF0ZSByZXZlcnNlKHNjb3BlOnN0cmluZyk6IE1hcmtldCB7XG4gICAgICAgIHZhciBjYW5vbmljYWwgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgdmFyIHJldmVyc2Vfc2NvcGUgPSB0aGlzLmludmVyc2VTY29wZShjYW5vbmljYWwpO1xuICAgICAgICBjb25zb2xlLmFzc2VydChjYW5vbmljYWwgIT0gcmV2ZXJzZV9zY29wZSwgXCJFUlJPUjogXCIsIGNhbm9uaWNhbCwgcmV2ZXJzZV9zY29wZSk7XG4gICAgICAgIHZhciByZXZlcnNlX3RhYmxlOk1hcmtldCA9IHRoaXMuX3JldmVyc2VbcmV2ZXJzZV9zY29wZV07XG4gICAgICAgIGlmICghcmV2ZXJzZV90YWJsZSAmJiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0pIHtcbiAgICAgICAgICAgIHRoaXMuX3JldmVyc2VbcmV2ZXJzZV9zY29wZV0gPSB0aGlzLmNyZWF0ZVJldmVyc2VUYWJsZUZvcihyZXZlcnNlX3Njb3BlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fcmV2ZXJzZVtyZXZlcnNlX3Njb3BlXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWFya2V0Rm9yKGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCk6IE1hcmtldCB7XG4gICAgICAgIHZhciBzY29wZSA9IHRoaXMuZ2V0U2NvcGVGb3IoY29tb2RpdHksIGN1cnJlbmN5KTtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFibGUoc2NvcGUpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0YWJsZUZvcihjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgpOiBNYXJrZXQge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwidGFibGVGb3IoKVwiLGNvbW9kaXR5LnN5bWJvbCxjdXJyZW5jeS5zeW1ib2wsXCIgREVQUkVDQVRFRFwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFya2V0Rm9yKGNvbW9kaXR5LCBjdXJyZW5jeSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZVJldmVyc2VUYWJsZUZvcihzY29wZTpzdHJpbmcpOiBNYXJrZXQge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiLCBzY29wZSk7XG4gICAgICAgIHZhciBjYW5vbmljYWwgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgdmFyIHJldmVyc2Vfc2NvcGUgPSB0aGlzLmludmVyc2VTY29wZShjYW5vbmljYWwpO1xuICAgICAgICB2YXIgdGFibGU6TWFya2V0ID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdO1xuXG4gICAgICAgIHZhciBpbnZlcnNlX2hpc3Rvcnk6SGlzdG9yeVR4W10gPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpIGluIHRhYmxlLmhpc3RvcnkpIHtcbiAgICAgICAgICAgIHZhciBoVHg6SGlzdG9yeVR4ID0ge1xuICAgICAgICAgICAgICAgIGlkOiB0YWJsZS5oaXN0b3J5W2ldLmlkLFxuICAgICAgICAgICAgICAgIHN0cjogXCJcIixcbiAgICAgICAgICAgICAgICBwcmljZTogdGFibGUuaGlzdG9yeVtpXS5pbnZlcnNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgaW52ZXJzZTogdGFibGUuaGlzdG9yeVtpXS5wcmljZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgIGFtb3VudDogdGFibGUuaGlzdG9yeVtpXS5wYXltZW50LmNsb25lKCksXG4gICAgICAgICAgICAgICAgcGF5bWVudDogdGFibGUuaGlzdG9yeVtpXS5hbW91bnQuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICBidXllcjogdGFibGUuaGlzdG9yeVtpXS5zZWxsZXIsXG4gICAgICAgICAgICAgICAgc2VsbGVyOiB0YWJsZS5oaXN0b3J5W2ldLmJ1eWVyLFxuICAgICAgICAgICAgICAgIGJ1eWZlZTogdGFibGUuaGlzdG9yeVtpXS5zZWxsZmVlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgc2VsbGZlZTogdGFibGUuaGlzdG9yeVtpXS5idXlmZWUuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICBkYXRlOiB0YWJsZS5oaXN0b3J5W2ldLmRhdGUsXG4gICAgICAgICAgICAgICAgaXNidXk6ICF0YWJsZS5oaXN0b3J5W2ldLmlzYnV5LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGhUeC5zdHIgPSBoVHgucHJpY2Uuc3RyICsgXCIgXCIgKyBoVHguYW1vdW50LnN0cjtcbiAgICAgICAgICAgIGludmVyc2VfaGlzdG9yeS5wdXNoKGhUeCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgXG4gICAgICAgIHZhciBpbnZlcnNlX29yZGVyczpUb2tlbk9yZGVycyA9IHtcbiAgICAgICAgICAgIGJ1eTogW10sIHNlbGw6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yICh2YXIgdHlwZSBpbiB7YnV5OlwiYnV5XCIsIHNlbGw6XCJzZWxsXCJ9KSB7XG4gICAgICAgICAgICB2YXIgcm93X29yZGVyczpPcmRlcltdO1xuICAgICAgICAgICAgdmFyIHJvd19vcmRlcjpPcmRlcjtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0YWJsZS5vcmRlcnNbdHlwZV0pIHtcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gdGFibGUub3JkZXJzW3R5cGVdW2ldO1xuXG4gICAgICAgICAgICAgICAgcm93X29yZGVycyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGo9MDsgajxyb3cub3JkZXJzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd19vcmRlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcG9zaXQ6IHJvdy5vcmRlcnNbal0uZGVwb3NpdC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJvdy5vcmRlcnNbal0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiByb3cub3JkZXJzW2pdLnByaWNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogcm93Lm9yZGVyc1tqXS5pbnZlcnNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcjogcm93Lm9yZGVyc1tqXS5vd25lcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbG9zOiByb3cub3JkZXJzW2pdLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IHJvdy5vcmRlcnNbal0udGVsb3NcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByb3dfb3JkZXJzLnB1c2gocm93X29yZGVyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgbmV3cm93Ok9yZGVyUm93ID0ge1xuICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiByb3cucHJpY2UuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiByb3dfb3JkZXJzLFxuICAgICAgICAgICAgICAgICAgICBvd25lcnM6IHJvdy5vd25lcnMsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlOiByb3cuaW52ZXJzZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICBzdHI6IHJvdy5pbnZlcnNlLnN0cixcbiAgICAgICAgICAgICAgICAgICAgc3VtOiByb3cuc3VtdGVsb3MuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgc3VtdGVsb3M6IHJvdy5zdW0uY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgdGVsb3M6IHJvdy50b3RhbC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogcm93LnRlbG9zLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgIC8vIGFtb3VudDogcm93LnN1bXRlbG9zLnRvdGFsKCksIC8vIDwtLSBleHRyYVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaW52ZXJzZV9vcmRlcnNbdHlwZV0ucHVzaChuZXdyb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJldmVyc2U6TWFya2V0ID0ge1xuICAgICAgICAgICAgc2NvcGU6IHJldmVyc2Vfc2NvcGUsXG4gICAgICAgICAgICBjb21vZGl0eTogdGFibGUuY3VycmVuY3ksXG4gICAgICAgICAgICBjdXJyZW5jeTogdGFibGUuY29tb2RpdHksXG4gICAgICAgICAgICBibG9jazogdGFibGUuYmxvY2ssXG4gICAgICAgICAgICBibG9ja2xpc3Q6IHRhYmxlLnJldmVyc2VibG9ja3MsXG4gICAgICAgICAgICByZXZlcnNlYmxvY2tzOiB0YWJsZS5ibG9ja2xpc3QsXG4gICAgICAgICAgICBibG9ja2xldmVsczogdGFibGUucmV2ZXJzZWxldmVscyxcbiAgICAgICAgICAgIHJldmVyc2VsZXZlbHM6IHRhYmxlLmJsb2NrbGV2ZWxzLFxuICAgICAgICAgICAgYmxvY2tzOiB0YWJsZS5ibG9ja3MsXG4gICAgICAgICAgICBkZWFsczogdGFibGUuZGVhbHMsXG4gICAgICAgICAgICBkaXJlY3Q6IHRhYmxlLmludmVyc2UsXG4gICAgICAgICAgICBpbnZlcnNlOiB0YWJsZS5kaXJlY3QsXG4gICAgICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgICAgICBzZWxsOiB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOnRhYmxlLmhlYWRlci5idXkudG90YWwuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOnRhYmxlLmhlYWRlci5idXkub3JkZXJzXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBidXk6IHtcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6dGFibGUuaGVhZGVyLnNlbGwudG90YWwuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOnRhYmxlLmhlYWRlci5zZWxsLm9yZGVyc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoaXN0b3J5OiBpbnZlcnNlX2hpc3RvcnksXG4gICAgICAgICAgICBvcmRlcnM6IHtcbiAgICAgICAgICAgICAgICBzZWxsOiBpbnZlcnNlX29yZGVycy5idXksICAvLyA8PC0tIGVzdG8gZnVuY2lvbmEgYXPDrSBjb21vIGVzdMOhP1xuICAgICAgICAgICAgICAgIGJ1eTogaW52ZXJzZV9vcmRlcnMuc2VsbCAgIC8vIDw8LS0gZXN0byBmdW5jaW9uYSBhc8OtIGNvbW8gZXN0w6E/XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VtbWFyeToge1xuICAgICAgICAgICAgICAgIHNjb3BlOiB0aGlzLmludmVyc2VTY29wZSh0YWJsZS5zdW1tYXJ5LnNjb3BlKSxcbiAgICAgICAgICAgICAgICBwcmljZTogdGFibGUuc3VtbWFyeS5pbnZlcnNlLFxuICAgICAgICAgICAgICAgIHByaWNlXzI0aF9hZ286IHRhYmxlLnN1bW1hcnkuaW52ZXJzZV8yNGhfYWdvLFxuICAgICAgICAgICAgICAgIGludmVyc2U6IHRhYmxlLnN1bW1hcnkucHJpY2UsXG4gICAgICAgICAgICAgICAgaW52ZXJzZV8yNGhfYWdvOiB0YWJsZS5zdW1tYXJ5LnByaWNlXzI0aF9hZ28sXG4gICAgICAgICAgICAgICAgbWF4X2ludmVyc2U6IHRhYmxlLnN1bW1hcnkubWF4X3ByaWNlLFxuICAgICAgICAgICAgICAgIG1heF9wcmljZTogdGFibGUuc3VtbWFyeS5tYXhfaW52ZXJzZSxcbiAgICAgICAgICAgICAgICBtaW5faW52ZXJzZTogdGFibGUuc3VtbWFyeS5taW5fcHJpY2UsXG4gICAgICAgICAgICAgICAgbWluX3ByaWNlOiB0YWJsZS5zdW1tYXJ5Lm1pbl9pbnZlcnNlLFxuICAgICAgICAgICAgICAgIHJlY29yZHM6IHRhYmxlLnN1bW1hcnkucmVjb3JkcyxcbiAgICAgICAgICAgICAgICB2b2x1bWU6IHRhYmxlLnN1bW1hcnkuYW1vdW50LFxuICAgICAgICAgICAgICAgIGFtb3VudDogdGFibGUuc3VtbWFyeS52b2x1bWUsXG4gICAgICAgICAgICAgICAgcGVyY2VudDogdGFibGUuc3VtbWFyeS5pcGVyY2VudCxcbiAgICAgICAgICAgICAgICBpcGVyY2VudDogdGFibGUuc3VtbWFyeS5wZXJjZW50LFxuICAgICAgICAgICAgICAgIHBlcmNlbnRfc3RyOiB0YWJsZS5zdW1tYXJ5LmlwZXJjZW50X3N0cixcbiAgICAgICAgICAgICAgICBpcGVyY2VudF9zdHI6IHRhYmxlLnN1bW1hcnkucGVyY2VudF9zdHIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHg6IHRhYmxlLnR4XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldmVyc2U7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFNjb3BlRm9yKGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCkge1xuICAgICAgICBpZiAoIWNvbW9kaXR5IHx8ICFjdXJyZW5jeSkgcmV0dXJuIFwiXCI7XG4gICAgICAgIHJldHVybiBjb21vZGl0eS5zeW1ib2wudG9Mb3dlckNhc2UoKSArIFwiLlwiICsgY3VycmVuY3kuc3ltYm9sLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGludmVyc2VTY29wZShzY29wZTpzdHJpbmcpIHtcbiAgICAgICAgaWYgKCFzY29wZSkgcmV0dXJuIHNjb3BlO1xuICAgICAgICBjb25zb2xlLmFzc2VydCh0eXBlb2Ygc2NvcGUgPT1cInN0cmluZ1wiLCBcIkVSUk9SOiBzdHJpbmcgc2NvcGUgZXhwZWN0ZWQsIGdvdCBcIiwgdHlwZW9mIHNjb3BlLCBzY29wZSk7XG4gICAgICAgIHZhciBwYXJ0cyA9IHNjb3BlLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQocGFydHMubGVuZ3RoID09IDIsIFwiRVJST1I6IHNjb3BlIGZvcm1hdCBleHBlY3RlZCBpcyB4eHgueXl5LCBnb3Q6IFwiLCB0eXBlb2Ygc2NvcGUsIHNjb3BlKTtcbiAgICAgICAgdmFyIGludmVyc2UgPSBwYXJ0c1sxXSArIFwiLlwiICsgcGFydHNbMF07XG4gICAgICAgIHJldHVybiBpbnZlcnNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBjYW5vbmljYWxTY29wZShzY29wZTpzdHJpbmcpIHtcbiAgICAgICAgaWYgKCFzY29wZSkgcmV0dXJuIHNjb3BlO1xuICAgICAgICBjb25zb2xlLmFzc2VydCh0eXBlb2Ygc2NvcGUgPT1cInN0cmluZ1wiLCBcIkVSUk9SOiBzdHJpbmcgc2NvcGUgZXhwZWN0ZWQsIGdvdCBcIiwgdHlwZW9mIHNjb3BlLCBzY29wZSk7XG4gICAgICAgIHZhciBwYXJ0cyA9IHNjb3BlLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQocGFydHMubGVuZ3RoID09IDIsIFwiRVJST1I6IHNjb3BlIGZvcm1hdCBleHBlY3RlZCBpcyB4eHgueXl5LCBnb3Q6IFwiLCB0eXBlb2Ygc2NvcGUsIHNjb3BlKTtcbiAgICAgICAgdmFyIGludmVyc2UgPSBwYXJ0c1sxXSArIFwiLlwiICsgcGFydHNbMF07XG4gICAgICAgIGlmIChwYXJ0c1sxXSA9PSBcInRsb3NcIikge1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJ0c1swXSA9PSBcInRsb3NcIikge1xuICAgICAgICAgICAgcmV0dXJuIGludmVyc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcnRzWzBdIDwgcGFydHNbMV0pIHtcbiAgICAgICAgICAgIHJldHVybiBzY29wZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbnZlcnNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGlzQ2Fub25pY2FsKHNjb3BlOnN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSkgPT0gc2NvcGU7XG4gICAgfVxuXG4gICAgXG4gICAgXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBHZXR0ZXJzIFxuXG4gICAgZ2V0QmFsYW5jZSh0b2tlbjpUb2tlbkRFWCkge1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuYmFsYW5jZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJhbGFuY2VzW2ldLnRva2VuLnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5iYWxhbmNlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEFzc2V0REVYKFwiMCBcIiArIHRva2VuLnN5bWJvbCwgdGhpcyk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0U29tZUZyZWVGYWtlVG9rZW5zKHN5bWJvbDpzdHJpbmcgPSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldFNvbWVGcmVlRmFrZVRva2VucygpXCIpO1xuICAgICAgICB2YXIgX3Rva2VuID0gc3ltYm9sOyAgICBcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJmcmVlZmFrZS1cIitfdG9rZW4gfHwgXCJ0b2tlblwiLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2VuU3RhdHMudGhlbihfID0+IHtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IG51bGw7XG4gICAgICAgICAgICB2YXIgY291bnRzID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTwxMDA7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChzeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudG9rZW5zW2ldLnN5bWJvbCA9PSBzeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgdmFyIHJhbmRvbSA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaSwgXCJSYW5kb206IFwiLCByYW5kb20pO1xuICAgICAgICAgICAgICAgIGlmICghdG9rZW4gJiYgcmFuZG9tID4gMC41KSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50b2tlbnNbaSAlIHRoaXMudG9rZW5zLmxlbmd0aF07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbi5mYWtlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmRvbSA+IDAuNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50ZWxvcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpPDEwMCAmJiB0b2tlbiAmJiB0aGlzLmdldEJhbGFuY2UodG9rZW4pLmFtb3VudC50b051bWJlcigpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaSwgXCJ0b2tlbjogXCIsIHRva2VuKTtcblxuICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICByYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbW9udG8gPSBNYXRoLmZsb29yKDEwMDAwICogcmFuZG9tKSAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHF1YW50aXR5ID0gbmV3IEFzc2V0REVYKFwiXCIgKyBtb250byArIFwiIFwiICsgdG9rZW4uc3ltYm9sICx0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lbW8gPSBcInlvdSBnZXQgXCIgKyBxdWFudGl0eS52YWx1ZVRvU3RyaW5nKCkrIFwiIGZyZWUgZmFrZSBcIiArIHRva2VuLnN5bWJvbCArIFwiIHRva2VucyB0byBwbGF5IG9uIHZhcGFlZS5pbyBERVhcIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZXhjZWN1dGUoXCJpc3N1ZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0bzogIHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogcXVhbnRpdHkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW86IG1lbW9cbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihfID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0QmFsYW5jZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZnJlZWZha2UtXCIrX3Rva2VuIHx8IFwidG9rZW5cIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1lbW87XG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJmcmVlZmFrZS1cIitfdG9rZW4gfHwgXCJ0b2tlblwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgICAgICB9KTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdldFRva2VuTm93KHN5bTpzdHJpbmcpOiBUb2tlbkRFWCB7XG4gICAgICAgIGlmICghc3ltKSByZXR1cm4gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnRva2Vucykge1xuICAgICAgICAgICAgLy8gdGhlcmUncyBhIGxpdHRsZSBidWcuIFRoaXMgaXMgYSBqdXN0YSAgd29yayBhcnJvdW5kXG4gICAgICAgICAgICBpZiAodGhpcy50b2tlbnNbaV0uc3ltYm9sLnRvVXBwZXJDYXNlKCkgPT0gXCJUTE9TXCIgJiYgdGhpcy50b2tlbnNbaV0ub2ZmY2hhaW4pIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHNvbHZlcyBhdHRhY2hpbmcgd3JvbmcgdGxvcyB0b2tlbiB0byBhc3NldFxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRoaXMudG9rZW5zW2ldLnN5bWJvbC50b1VwcGVyQ2FzZSgpID09IHN5bS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGFzeW5jIGdldFRva2VuKHN5bTpzdHJpbmcpOiBQcm9taXNlPFRva2VuREVYPiB7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihfID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFRva2VuTm93KHN5bSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGdldERlcG9zaXRzKGFjY291bnQ6c3RyaW5nID0gbnVsbCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldERlcG9zaXRzKClcIik7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdHNcIiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciBkZXBvc2l0czogQXNzZXRERVhbXSA9IFtdO1xuICAgICAgICAgICAgaWYgKCFhY2NvdW50ICYmIHRoaXMuY3VycmVudC5uYW1lKSB7XG4gICAgICAgICAgICAgICAgYWNjb3VudCA9IHRoaXMuY3VycmVudC5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFjY291bnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gYXdhaXQgdGhpcy5mZXRjaERlcG9zaXRzKGFjY291bnQpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gcmVzdWx0LnJvd3MpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVwb3NpdHMucHVzaChuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uYW1vdW50LCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kZXBvc2l0cyA9IGRlcG9zaXRzO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0c1wiLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZXBvc2l0cztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QmFsYW5jZXMoYWNjb3VudDpzdHJpbmcgPSBudWxsKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVguZ2V0QmFsYW5jZXMoKVwiKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJiYWxhbmNlc1wiLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIF9iYWxhbmNlczogQXNzZXRERVhbXTtcbiAgICAgICAgICAgIGlmICghYWNjb3VudCAmJiB0aGlzLmN1cnJlbnQubmFtZSkge1xuICAgICAgICAgICAgICAgIGFjY291bnQgPSB0aGlzLmN1cnJlbnQubmFtZTtcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChhY2NvdW50KSB7XG4gICAgICAgICAgICAgICAgX2JhbGFuY2VzID0gYXdhaXQgdGhpcy5mZXRjaEJhbGFuY2VzKGFjY291bnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5iYWxhbmNlcyA9IF9iYWxhbmNlcztcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYIGJhbGFuY2VzIHVwZGF0ZWRcIik7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJhbGFuY2VzXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJhbGFuY2VzO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRUaGlzU2VsbE9yZGVycyh0YWJsZTpzdHJpbmcsIGlkczpudW1iZXJbXSk6IFByb21pc2U8YW55W10+IHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ0aGlzb3JkZXJzXCIsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGlkcykge1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IGlkc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgZ290aXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqIGluIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0W2pdLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnb3RpdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZ290aXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciByZXM6VGFibGVSZXN1bHQgPSBhd2FpdCB0aGlzLmZldGNoT3JkZXJzKHtzY29wZTp0YWJsZSwgbGltaXQ6MSwgbG93ZXJfYm91bmQ6aWQudG9TdHJpbmcoKX0pO1xuXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdChyZXMucm93cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInRoaXNvcmRlcnNcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7ICAgIFxuICAgIH1cblxuICAgIGFzeW5jIGdldFVzZXJPcmRlcnMoYWNjb3VudDpzdHJpbmcgPSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldFVzZXJPcmRlcnMoKVwiKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ1c2Vyb3JkZXJzXCIsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgdXNlcm9yZGVyczogVGFibGVSZXN1bHQ7XG4gICAgICAgICAgICBpZiAoIWFjY291bnQgJiYgdGhpcy5jdXJyZW50Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICBhY2NvdW50ID0gdGhpcy5jdXJyZW50Lm5hbWU7XG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoYWNjb3VudCkge1xuICAgICAgICAgICAgICAgIHVzZXJvcmRlcnMgPSBhd2FpdCB0aGlzLmZldGNoVXNlck9yZGVycyhhY2NvdW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsaXN0OiBVc2VyT3JkZXJzW10gPSA8VXNlck9yZGVyc1tdPnVzZXJvcmRlcnMucm93cztcbiAgICAgICAgICAgIHZhciBtYXA6IFVzZXJPcmRlcnNNYXAgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkcyA9IGxpc3RbaV0uaWRzO1xuICAgICAgICAgICAgICAgIHZhciB0YWJsZSA9IGxpc3RbaV0udGFibGU7XG4gICAgICAgICAgICAgICAgdmFyIG9yZGVycyA9IGF3YWl0IHRoaXMuZ2V0VGhpc1NlbGxPcmRlcnModGFibGUsIGlkcyk7XG4gICAgICAgICAgICAgICAgbWFwW3RhYmxlXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGU6IHRhYmxlLFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnM6IHRoaXMuYXV4UHJvY2Vzc1Jvd3NUb09yZGVycyhvcmRlcnMpLFxuICAgICAgICAgICAgICAgICAgICBpZHM6aWRzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudXNlcm9yZGVycyA9IG1hcDtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMudXNlcm9yZGVycyk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInVzZXJvcmRlcnNcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlcm9yZGVycztcbiAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlQWN0aXZpdHkoKSB7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYWN0aXZpdHlcIiwgdHJ1ZSk7XG4gICAgICAgIHZhciBwYWdlc2l6ZSA9IHRoaXMuYWN0aXZpdHlQYWdlc2l6ZTtcbiAgICAgICAgdmFyIHBhZ2VzID0gYXdhaXQgdGhpcy5nZXRBY3Rpdml0eVRvdGFsUGFnZXMocGFnZXNpemUpO1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0aGlzLmZldGNoQWN0aXZpdHkocGFnZXMtMiwgcGFnZXNpemUpLFxuICAgICAgICAgICAgdGhpcy5mZXRjaEFjdGl2aXR5KHBhZ2VzLTEsIHBhZ2VzaXplKSxcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hBY3Rpdml0eShwYWdlcy0wLCBwYWdlc2l6ZSlcbiAgICAgICAgXSk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYWN0aXZpdHlcIiwgZmFsc2UpO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRNb3JlQWN0aXZpdHkoKSB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2aXR5Lmxpc3QubGVuZ3RoID09IDApIHJldHVybjtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJhY3Rpdml0eVwiLCB0cnVlKTtcbiAgICAgICAgdmFyIHBhZ2VzaXplID0gdGhpcy5hY3Rpdml0eVBhZ2VzaXplO1xuICAgICAgICB2YXIgZmlyc3QgPSB0aGlzLmFjdGl2aXR5Lmxpc3RbdGhpcy5hY3Rpdml0eS5saXN0Lmxlbmd0aC0xXTtcbiAgICAgICAgdmFyIGlkID0gZmlyc3QuaWQgLSBwYWdlc2l6ZTtcbiAgICAgICAgdmFyIHBhZ2UgPSBNYXRoLmZsb29yKChpZC0xKSAvIHBhZ2VzaXplKTtcblxuICAgICAgICBhd2FpdCB0aGlzLmZldGNoQWN0aXZpdHkocGFnZSwgcGFnZXNpemUpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImFjdGl2aXR5XCIsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGVUcmFkZShjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgsIHVwZGF0ZVVzZXI6Ym9vbGVhbiA9IHRydWUpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC51cGRhdGVUcmFkZSgpXCIpO1xuICAgICAgICB2YXIgY2hyb25vX2tleSA9IFwidXBkYXRlVHJhZGVcIjtcbiAgICAgICAgdGhpcy5mZWVkLnN0YXJ0Q2hyb25vKGNocm9ub19rZXkpO1xuXG4gICAgICAgIGlmKHVwZGF0ZVVzZXIpIHRoaXMudXBkYXRlQ3VycmVudFVzZXIoKTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMuZ2V0VHJhbnNhY3Rpb25IaXN0b3J5KGNvbW9kaXR5LCBjdXJyZW5jeSwgLTEsIC0xLCB0cnVlKS50aGVuKF8gPT4gdGhpcy5mZWVkLnNldE1hcmNrKGNocm9ub19rZXksIFwiZ2V0VHJhbnNhY3Rpb25IaXN0b3J5KClcIikpLFxuICAgICAgICAgICAgdGhpcy5nZXRCbG9ja0hpc3RvcnkoY29tb2RpdHksIGN1cnJlbmN5LCAtMSwgLTEsIHRydWUpLnRoZW4oXyA9PiB0aGlzLmZlZWQuc2V0TWFyY2soY2hyb25vX2tleSwgXCJnZXRCbG9ja0hpc3RvcnkoKVwiKSksXG4gICAgICAgICAgICB0aGlzLmdldFNlbGxPcmRlcnMoY29tb2RpdHksIGN1cnJlbmN5LCB0cnVlKS50aGVuKF8gPT4gdGhpcy5mZWVkLnNldE1hcmNrKGNocm9ub19rZXksIFwiZ2V0U2VsbE9yZGVycygpXCIpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0QnV5T3JkZXJzKGNvbW9kaXR5LCBjdXJyZW5jeSwgdHJ1ZSkudGhlbihfID0+IHRoaXMuZmVlZC5zZXRNYXJjayhjaHJvbm9fa2V5LCBcImdldEJ1eU9yZGVycygpXCIpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0TWFya2V0U3VtbWFyeShjb21vZGl0eSwgY3VycmVuY3ksIHRydWUpLnRoZW4oXyA9PiB0aGlzLmZlZWQuc2V0TWFyY2soY2hyb25vX2tleSwgXCJnZXRNYXJrZXRTdW1tYXJ5KClcIikpLFxuICAgICAgICAgICAgdGhpcy5nZXRPcmRlclN1bW1hcnkoKS50aGVuKF8gPT4gdGhpcy5mZWVkLnNldE1hcmNrKGNocm9ub19rZXksIFwiZ2V0T3JkZXJTdW1tYXJ5KClcIikpLFxuICAgICAgICBdKS50aGVuKHIgPT4ge1xuICAgICAgICAgICAgdGhpcy5fcmV2ZXJzZSA9IHt9O1xuICAgICAgICAgICAgdGhpcy5yZXNvcnRUb2tlbnMoKTtcbiAgICAgICAgICAgIHRoaXMucmVzb3J0VG9wTWFya2V0cygpO1xuICAgICAgICAgICAgLy8gdGhpcy5mZWVkLnByaW50Q2hyb25vKGNocm9ub19rZXkpO1xuICAgICAgICAgICAgdGhpcy5vblRyYWRlVXBkYXRlZC5uZXh0KG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZUN1cnJlbnRVc2VyKCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnVwZGF0ZUN1cnJlbnRVc2VyKClcIik7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY3VycmVudFwiLCB0cnVlKTsgICAgICAgIFxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGhpcy5nZXRVc2VyT3JkZXJzKCksXG4gICAgICAgICAgICB0aGlzLmdldERlcG9zaXRzKCksXG4gICAgICAgICAgICB0aGlzLmdldEJhbGFuY2VzKClcbiAgICAgICAgXSkudGhlbihfID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY3VycmVudFwiLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gXztcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImN1cnJlbnRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRCbG9ja0hpc3RvcnlUb3RhbFBhZ2VzRm9yKHNjb3BlOnN0cmluZywgcGFnZXNpemU6IG51bWJlcikge1xuICAgICAgICBpZiAoIXRoaXMuX21hcmtldHMpIHJldHVybiAwO1xuICAgICAgICB2YXIgbWFya2V0ID0gdGhpcy5tYXJrZXQoc2NvcGUpO1xuICAgICAgICBpZiAoIW1hcmtldCkgcmV0dXJuIDA7XG4gICAgICAgIHZhciB0b3RhbCA9IG1hcmtldC5ibG9ja3M7XG4gICAgICAgIHZhciBtb2QgPSB0b3RhbCAlIHBhZ2VzaXplO1xuICAgICAgICB2YXIgZGlmID0gdG90YWwgLSBtb2Q7XG4gICAgICAgIHZhciBwYWdlcyA9IGRpZiAvIHBhZ2VzaXplO1xuICAgICAgICBpZiAobW9kID4gMCkge1xuICAgICAgICAgICAgcGFnZXMgKz0xO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZ2V0QmxvY2tIaXN0b3J5VG90YWxQYWdlc0ZvcigpIHRvdGFsOlwiLCB0b3RhbCwgXCIgcGFnZXM6XCIsIHBhZ2VzKTtcbiAgICAgICAgcmV0dXJuIHBhZ2VzO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SGlzdG9yeVRvdGFsUGFnZXNGb3Ioc2NvcGU6c3RyaW5nLCBwYWdlc2l6ZTogbnVtYmVyKSB7XG4gICAgICAgIGlmICghdGhpcy5fbWFya2V0cykgcmV0dXJuIDA7XG4gICAgICAgIHZhciBtYXJrZXQgPSB0aGlzLm1hcmtldChzY29wZSk7XG4gICAgICAgIGlmICghbWFya2V0KSByZXR1cm4gMDtcbiAgICAgICAgdmFyIHRvdGFsID0gbWFya2V0LmRlYWxzO1xuICAgICAgICB2YXIgbW9kID0gdG90YWwgJSBwYWdlc2l6ZTtcbiAgICAgICAgdmFyIGRpZiA9IHRvdGFsIC0gbW9kO1xuICAgICAgICB2YXIgcGFnZXMgPSBkaWYgLyBwYWdlc2l6ZTtcbiAgICAgICAgaWYgKG1vZCA+IDApIHtcbiAgICAgICAgICAgIHBhZ2VzICs9MTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFnZXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRBY3Rpdml0eVRvdGFsUGFnZXMocGFnZXNpemU6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcImV2ZW50c1wiLCB7XG4gICAgICAgICAgICBsaW1pdDogMVxuICAgICAgICB9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gcmVzdWx0LnJvd3NbMF0ucGFyYW1zO1xuICAgICAgICAgICAgdmFyIHRvdGFsID0gcGFyc2VJbnQocGFyYW1zLnNwbGl0KFwiIFwiKVswXSktMTtcbiAgICAgICAgICAgIHZhciBtb2QgPSB0b3RhbCAlIHBhZ2VzaXplO1xuICAgICAgICAgICAgdmFyIGRpZiA9IHRvdGFsIC0gbW9kO1xuICAgICAgICAgICAgdmFyIHBhZ2VzID0gZGlmIC8gcGFnZXNpemU7XG4gICAgICAgICAgICBpZiAobW9kID4gMCkge1xuICAgICAgICAgICAgICAgIHBhZ2VzICs9MTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdHkudG90YWwgPSB0b3RhbDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldEFjdGl2aXR5VG90YWxQYWdlcygpIHRvdGFsOiBcIiwgdG90YWwsIFwiIHBhZ2VzOiBcIiwgcGFnZXMpO1xuICAgICAgICAgICAgcmV0dXJuIHBhZ2VzO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRUcmFuc2FjdGlvbkhpc3RvcnkoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYLCBwYWdlOm51bWJlciA9IC0xLCBwYWdlc2l6ZTpudW1iZXIgPSAtMSwgZm9yY2U6Ym9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgdmFyIHNjb3BlOnN0cmluZyA9IHRoaXMuY2Fub25pY2FsU2NvcGUodGhpcy5nZXRTY29wZUZvcihjb21vZGl0eSwgY3VycmVuY3kpKTtcbiAgICAgICAgdmFyIGF1eCA9IG51bGw7XG4gICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImhpc3RvcnkuXCIrc2NvcGUsIHRydWUpO1xuICAgICAgICBhdXggPSB0aGlzLndhaXRPcmRlclN1bW1hcnkudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIGlmIChwYWdlc2l6ZSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIHBhZ2VzaXplID0gMTA7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhZ2UgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLmdldEhpc3RvcnlUb3RhbFBhZ2VzRm9yKHNjb3BlLCBwYWdlc2l6ZSk7XG4gICAgICAgICAgICAgICAgcGFnZSA9IHBhZ2VzLTM7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UgPCAwKSBwYWdlID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoSGlzdG9yeShzY29wZSwgcGFnZSswLCBwYWdlc2l6ZSksXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaEhpc3Rvcnkoc2NvcGUsIHBhZ2UrMSwgcGFnZXNpemUpLFxuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hIaXN0b3J5KHNjb3BlLCBwYWdlKzIsIHBhZ2VzaXplKVxuICAgICAgICAgICAgXSkudGhlbihfID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImhpc3RvcnkuXCIrc2NvcGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXJrZXQoc2NvcGUpLmhpc3Rvcnk7XG4gICAgICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImhpc3RvcnkuXCIrc2NvcGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLm1hcmtldChzY29wZSkgJiYgIWZvcmNlKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLm1hcmtldChzY29wZSkuaGlzdG9yeTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGF1eDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub25IaXN0b3J5Q2hhbmdlLm5leHQocmVzdWx0KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXV4SG91clRvTGFiZWwoaG91cjpudW1iZXIpOiBzdHJpbmcge1xuICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKGhvdXIgKiAxMDAwICogNjAgKiA2MCk7XG4gICAgICAgIHZhciBsYWJlbCA9IGQuZ2V0SG91cnMoKSA9PSAwID8gdGhpcy5kYXRlUGlwZS50cmFuc2Zvcm0oZCwgJ2RkL01NJykgOiBkLmdldEhvdXJzKCkgKyBcImhcIjtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBsYWJlbDtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRCbG9ja0hpc3RvcnkoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYLCBwYWdlOm51bWJlciA9IC0xLCBwYWdlc2l6ZTpudW1iZXIgPSAtMSwgZm9yY2U6Ym9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVguZ2V0QmxvY2tIaXN0b3J5KClcIiwgY29tb2RpdHkuc3ltYm9sLCBwYWdlLCBwYWdlc2l6ZSk7XG4gICAgICAgIC8vIC8vIGVsYXBzZWQgdGltZVxuICAgICAgICAvLyB2YXIgc3RhcnRUaW1lOkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAvLyB2YXIgZGlmZjpudW1iZXI7XG4gICAgICAgIC8vIHZhciBzZWM6bnVtYmVyO1xuXG4gICAgICAgIHZhciBzY29wZTpzdHJpbmcgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHRoaXMuZ2V0U2NvcGVGb3IoY29tb2RpdHksIGN1cnJlbmN5KSk7XG4gICAgICAgIHZhciBhdXggPSBudWxsO1xuICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJibG9jay1oaXN0b3J5LlwiK3Njb3BlLCB0cnVlKTtcblxuICAgICAgICBhdXggPSB0aGlzLndhaXRPcmRlclN1bW1hcnkudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciBmZXRjaEJsb2NrSGlzdG9yeVN0YXJ0OkRhdGUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgICAgICBpZiAocGFnZXNpemUgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBwYWdlc2l6ZSA9IDEwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhZ2UgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLmdldEJsb2NrSGlzdG9yeVRvdGFsUGFnZXNGb3Ioc2NvcGUsIHBhZ2VzaXplKTtcbiAgICAgICAgICAgICAgICBwYWdlID0gcGFnZXMtMztcbiAgICAgICAgICAgICAgICBpZiAocGFnZSA8IDApIHBhZ2UgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHByb21pc2VzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8PXBhZ2VzOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IHRoaXMuZmV0Y2hCbG9ja0hpc3Rvcnkoc2NvcGUsIGksIHBhZ2VzaXplKTtcbiAgICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICAgICAgLy8gLy8gZWxhcHNlZCB0aW1lXG4gICAgICAgICAgICAgICAgLy8gdmFyIGZldGNoQmxvY2tIaXN0b3J5VGltZTpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAvLyBkaWZmID0gZmV0Y2hCbG9ja0hpc3RvcnlUaW1lLmdldFRpbWUoKSAtIGZldGNoQmxvY2tIaXN0b3J5U3RhcnQuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIC8vIHNlYyA9IGRpZmYgLyAxMDAwO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKiogVmFwYWVlREVYLmdldEJsb2NrSGlzdG9yeSgpIGZldGNoQmxvY2tIaXN0b3J5VGltZSBzZWM6IFwiLCBzZWMsIFwiKFwiLGRpZmYsXCIpXCIpO1xuXG5cbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJsb2NrLWhpc3RvcnkuXCIrc2NvcGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB2YXIgbWFya2V0OiBNYXJrZXQgPSB0aGlzLm1hcmtldChzY29wZSk7XG4gICAgICAgICAgICAgICAgbWFya2V0LmJsb2NrbGlzdCA9IFtdO1xuICAgICAgICAgICAgICAgIG1hcmtldC5yZXZlcnNlYmxvY2tzID0gW107XG4gICAgICAgICAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgdmFyIGhvcmEgPSAxMDAwICogNjAgKiA2MDtcbiAgICAgICAgICAgICAgICB2YXIgaG91ciA9IE1hdGguZmxvb3Iobm93LmdldFRpbWUoKS9ob3JhKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0+XCIsIGhvdXIpO1xuICAgICAgICAgICAgICAgIHZhciBsYXN0X2Jsb2NrID0gbnVsbDtcbiAgICAgICAgICAgICAgICB2YXIgbGFzdF9ob3VyID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIHZhciBvcmRlcmVkX2Jsb2NrcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gbWFya2V0LmJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgIG9yZGVyZWRfYmxvY2tzLnB1c2gobWFya2V0LmJsb2NrW2ldKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBvcmRlcmVkX2Jsb2Nrcy5zb3J0KGZ1bmN0aW9uKGE6SGlzdG9yeUJsb2NrLCBiOkhpc3RvcnlCbG9jaykge1xuICAgICAgICAgICAgICAgICAgICBpZihhLmhvdXIgPCBiLmhvdXIpIHJldHVybiAtMTE7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH0pO1xuXG5cblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gb3JkZXJlZF9ibG9ja3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJsb2NrOkhpc3RvcnlCbG9jayA9IG9yZGVyZWRfYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLmF1eEhvdXJUb0xhYmVsKGJsb2NrLmhvdXIpO1xuICAgICAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0+XCIsIGksIGxhYmVsLCBibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRlID0gYmxvY2suZGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpZiA9IG5vdy5nZXRUaW1lKCkgLSBibG9jay5kYXRlLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lcyA9IDMwICogMjQgKiBob3JhO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWxhcHNlZF9tb250aHMgPSBkaWYgLyBtZXM7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGFwc2VkX21vbnRocyA+IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZHJvcHBpbmcgYmxvY2sgdG9vIG9sZFwiLCBbYmxvY2ssIGJsb2NrLmRhdGUudG9VVENTdHJpbmcoKV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdF9ibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpZiA9IGJsb2NrLmhvdXIgLSBsYXN0X2Jsb2NrLmhvdXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqPTE7IGo8ZGlmOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWxfaSA9IHRoaXMuYXV4SG91clRvTGFiZWwobGFzdF9ibG9jay5ob3VyK2opO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0+XCIsIGosIGxhYmVsX2ksIGJsb2NrKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbmluaWNhbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlID0gbGFzdF9ibG9jay5wcmljZS5hbW91bnQudG9OdW1iZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXV4ID0gW2xhYmVsX2ksIHByaWNlLCBwcmljZSwgcHJpY2UsIHByaWNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXQuYmxvY2tsaXN0LnB1c2goYXV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXZlcnNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW52ZXJzZSA9IGxhc3RfYmxvY2suaW52ZXJzZS5hbW91bnQudG9OdW1iZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXV4ID0gW2xhYmVsX2ksIGludmVyc2UsIGludmVyc2UsIGludmVyc2UsIGludmVyc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtldC5yZXZlcnNlYmxvY2tzLnB1c2goYXV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqOmFueVtdO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25pbmljYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICBvYmogPSBbbGFiZWxdO1xuICAgICAgICAgICAgICAgICAgICBvYmoucHVzaChibG9jay5tYXguYW1vdW50LnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICBvYmoucHVzaChibG9jay5lbnRyYW5jZS5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKGJsb2NrLnByaWNlLmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goYmxvY2subWluLmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2V0LmJsb2NrbGlzdC5wdXNoKG9iaik7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJldmVyc2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICBvYmogPSBbbGFiZWxdO1xuICAgICAgICAgICAgICAgICAgICBvYmoucHVzaCgxLjAvYmxvY2subWF4LmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goMS4wL2Jsb2NrLmVudHJhbmNlLmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goMS4wL2Jsb2NrLnByaWNlLmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goMS4wL2Jsb2NrLm1pbi5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtldC5yZXZlcnNlYmxvY2tzLnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgICAgICAgbGFzdF9ibG9jayA9IGJsb2NrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChsYXN0X2Jsb2NrICYmIGhvdXIgIT0gbGFzdF9ibG9jay5ob3VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaWYgPSBob3VyIC0gbGFzdF9ibG9jay5ob3VyO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqPTE7IGo8PWRpZjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWxfaSA9IHRoaXMuYXV4SG91clRvTGFiZWwobGFzdF9ibG9jay5ob3VyK2opO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25pbmljYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlID0gbGFzdF9ibG9jay5wcmljZS5hbW91bnQudG9OdW1iZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdXggPSBbbGFiZWxfaSwgcHJpY2UsIHByaWNlLCBwcmljZSwgcHJpY2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2V0LmJsb2NrbGlzdC5wdXNoKGF1eCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJldmVyc2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGludmVyc2UgPSBsYXN0X2Jsb2NrLmludmVyc2UuYW1vdW50LnRvTnVtYmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXV4ID0gW2xhYmVsX2ksIGludmVyc2UsIGludmVyc2UsIGludmVyc2UsIGludmVyc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2V0LnJldmVyc2VibG9ja3MucHVzaChhdXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gLy8gZWxhcHNlZCB0aW1lXG4gICAgICAgICAgICAgICAgLy8gdmFyIGZpcnN0TGV2ZWxUaW1lOkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIC8vIGRpZmYgPSBmaXJzdExldmVsVGltZS5nZXRUaW1lKCkgLSBmZXRjaEJsb2NrSGlzdG9yeVRpbWUuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIC8vIHNlYyA9IGRpZmYgLyAxMDAwO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKiogVmFwYWVlREVYLmdldEJsb2NrSGlzdG9yeSgpIGZpcnN0TGV2ZWxUaW1lIHNlYzogXCIsIHNlYywgXCIoXCIsZGlmZixcIilcIik7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLT5cIiwgbWFya2V0LmJsb2NrbGlzdCk7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5vbkJsb2NrbGlzdENoYW5nZS5uZXh0KG1hcmtldC5ibG9ja2xpc3QpO1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXJrZXQ7XG4gICAgICAgICAgICB9KS50aGVuKG1hcmtldCA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgICAgICAgLy8gLy8gZWxhcHNlZCB0aW1lXG4gICAgICAgICAgICAgICAgLy8gdmFyIGFsbExldmVsc1N0YXJ0OkRhdGUgPSBuZXcgRGF0ZSgpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgbGltaXQgPSAyNTY7XG4gICAgICAgICAgICAgICAgdmFyIGxldmVscyA9IFttYXJrZXQuYmxvY2tsaXN0XTtcbiAgICAgICAgICAgICAgICB2YXIgcmV2ZXJzZXMgPSBbbWFya2V0LnJldmVyc2VibG9ja3NdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGN1cnJlbnQgPSAwOyBsZXZlbHNbY3VycmVudF0ubGVuZ3RoID4gbGltaXQ7IGN1cnJlbnQrKykge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjdXJyZW50ICxsZXZlbHNbY3VycmVudF0ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld2xldmVsOmFueVtdW10gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld3JldmVyc2U6YW55W11bXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWVyZ2VkOmFueVtdID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxsZXZlbHNbY3VycmVudF0ubGVuZ3RoOyBpKz0yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYW5vbmljYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2XzE6YW55W10gPSBsZXZlbHNbY3VycmVudF1baV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdl8yID0gbGV2ZWxzW2N1cnJlbnRdW2krMV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVyZ2VkID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4PTA7IHg8NTsgeCsrKSBtZXJnZWRbeF0gPSB2XzFbeF07IC8vIGNsZWFuIGNvcHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2XzIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbMF0gPSB2XzFbMF0uc3BsaXQoXCIvXCIpLmxlbmd0aCA+IDEgPyB2XzFbMF0gOiB2XzJbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzFdID0gTWF0aC5tYXgodl8xWzFdLCB2XzJbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFsyXSA9IHZfMVsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbM10gPSB2XzJbM107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzRdID0gTWF0aC5taW4odl8xWzRdLCB2XzJbNF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3bGV2ZWwucHVzaChtZXJnZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZXZlcnNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICAgICAgdl8xID0gcmV2ZXJzZXNbY3VycmVudF1baV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2XzIgPSByZXZlcnNlc1tjdXJyZW50XVtpKzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4PTA7IHg8NTsgeCsrKSBtZXJnZWRbeF0gPSB2XzFbeF07IC8vIGNsZWFuIGNvcHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2XzIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbMF0gPSB2XzFbMF0uc3BsaXQoXCIvXCIpLmxlbmd0aCA+IDEgPyB2XzFbMF0gOiB2XzJbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzFdID0gTWF0aC5taW4odl8xWzFdLCB2XzJbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFsyXSA9IHZfMVsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbM10gPSB2XzJbM107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzRdID0gTWF0aC5tYXgodl8xWzRdLCB2XzJbNF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld3JldmVyc2UucHVzaChtZXJnZWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV2ZWxzLnB1c2gobmV3bGV2ZWwpO1xuICAgICAgICAgICAgICAgICAgICByZXZlcnNlcy5wdXNoKG5ld3JldmVyc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgIG1hcmtldC5ibG9ja2xldmVscyA9IGxldmVscztcbiAgICAgICAgICAgICAgICBtYXJrZXQucmV2ZXJzZWxldmVscyA9IHJldmVyc2VzO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIC8vIG1hcmtldC5ibG9ja2xldmVscyA9IFttYXJrZXQuYmxvY2tsaXN0XTtcbiAgICAgICAgICAgICAgICAvLyBtYXJrZXQucmV2ZXJzZWxldmVscyA9IFttYXJrZXQucmV2ZXJzZWJsb2Nrc107XG4gICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAvLyBlbGFwc2VkIHRpbWVcbiAgICAgICAgICAgICAgICAvLyB2YXIgYWxsTGV2ZWxzVGltZTpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAvLyBkaWZmID0gYWxsTGV2ZWxzVGltZS5nZXRUaW1lKCkgLSBhbGxMZXZlbHNTdGFydC5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgLy8gc2VjID0gZGlmZiAvIDEwMDA7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKiBWYXBhZWVERVguZ2V0QmxvY2tIaXN0b3J5KCkgYWxsTGV2ZWxzVGltZSBzZWM6IFwiLCBzZWMsIFwiKFwiLGRpZmYsXCIpXCIpOyAgIFxuICAgICAgICAgICAgICAgIC8vIC8vIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIsIG1hcmtldC5ibG9ja2xldmVscyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbWFya2V0LmJsb2NrO1xuICAgICAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJibG9jay1oaXN0b3J5LlwiK3Njb3BlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5tYXJrZXQoc2NvcGUpICYmICFmb3JjZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5tYXJrZXQoc2NvcGUpLmJsb2NrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gYXV4O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vbkhpc3RvcnlDaGFuZ2UubmV4dChyZXN1bHQpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0U2VsbE9yZGVycyhjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgsIGZvcmNlOmJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHZhciBzY29wZTpzdHJpbmcgPSB0aGlzLmdldFNjb3BlRm9yKGNvbW9kaXR5LCBjdXJyZW5jeSk7XG4gICAgICAgIHZhciBjYW5vbmljYWw6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgIHZhciByZXZlcnNlOnN0cmluZyA9IHRoaXMuaW52ZXJzZVNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgIHZhciBhdXggPSBudWxsO1xuICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJzZWxsb3JkZXJzXCIsIHRydWUpO1xuICAgICAgICBhdXggPSB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciBvcmRlcnMgPSBhd2FpdCB0aGlzLmZldGNoT3JkZXJzKHtzY29wZTpjYW5vbmljYWwsIGxpbWl0OjEwMCwgaW5kZXhfcG9zaXRpb246IFwiMlwiLCBrZXlfdHlwZTogXCJpNjRcIn0pO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdID0gdGhpcy5hdXhBc3NlcnRTY29wZShjYW5vbmljYWwpO1xuICAgICAgICAgICAgLy8gaWYoc2NvcGU9PVwidnBlLnRsb3NcIiB8fCBzY29wZT09XCJjbnQudGxvc1wiKWNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cInZwZS50bG9zXCIgfHwgc2NvcGU9PVwiY250LnRsb3NcIiljb25zb2xlLmxvZyhcIlNlbGwgY3J1ZG86XCIsIG9yZGVycyk7XG4gICAgICAgICAgICB2YXIgc2VsbDogT3JkZXJbXSA9IHRoaXMuYXV4UHJvY2Vzc1Jvd3NUb09yZGVycyhvcmRlcnMucm93cyk7XG4gICAgICAgICAgICBzZWxsLnNvcnQoZnVuY3Rpb24oYTpPcmRlciwgYjpPcmRlcikge1xuICAgICAgICAgICAgICAgIGlmKGEucHJpY2UuYW1vdW50LmlzTGVzc1RoYW4oYi5wcmljZS5hbW91bnQpKSByZXR1cm4gLTExO1xuICAgICAgICAgICAgICAgIGlmKGEucHJpY2UuYW1vdW50LmlzR3JlYXRlclRoYW4oYi5wcmljZS5hbW91bnQpKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gaWYoc2NvcGU9PVwidnBlLnRsb3NcIiB8fCBzY29wZT09XCJjbnQudGxvc1wiKWNvbnNvbGUubG9nKFwic29ydGVkOlwiLCBzZWxsKTtcbiAgICAgICAgICAgIC8vIGdyb3VwaW5nIHRvZ2V0aGVyIG9yZGVycyB3aXRoIHRoZSBzYW1lIHByaWNlLlxuICAgICAgICAgICAgdmFyIGxpc3Q6IE9yZGVyUm93W10gPSBbXTtcbiAgICAgICAgICAgIHZhciByb3c6IE9yZGVyUm93O1xuICAgICAgICAgICAgaWYgKHNlbGwubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPHNlbGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9yZGVyOiBPcmRlciA9IHNlbGxbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdyA9IGxpc3RbbGlzdC5sZW5ndGgtMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93LnByaWNlLmFtb3VudC5lcShvcmRlci5wcmljZS5hbW91bnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LnRvdGFsLmFtb3VudCA9IHJvdy50b3RhbC5hbW91bnQucGx1cyhvcmRlci50b3RhbC5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy50ZWxvcy5hbW91bnQgPSByb3cudGVsb3MuYW1vdW50LnBsdXMob3JkZXIudGVsb3MuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cub3duZXJzW29yZGVyLm93bmVyXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93Lm9yZGVycy5wdXNoKG9yZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gICAgXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcm93ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyOiBvcmRlci5wcmljZS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IG9yZGVyLnByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiBvcmRlci50b3RhbC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVsb3M6IG9yZGVyLnRlbG9zLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiBvcmRlci5pbnZlcnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VtOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VtdGVsb3M6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcnM6IHt9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByb3cub3duZXJzW29yZGVyLm93bmVyXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJvdy5vcmRlcnMucHVzaChvcmRlcik7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHN1bSA9IG5ldyBCaWdOdW1iZXIoMCk7XG4gICAgICAgICAgICB2YXIgc3VtdGVsb3MgPSBuZXcgQmlnTnVtYmVyKDApO1xuICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBsaXN0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG9yZGVyX3JvdyA9IGxpc3Rbal07XG4gICAgICAgICAgICAgICAgc3VtdGVsb3MgPSBzdW10ZWxvcy5wbHVzKG9yZGVyX3Jvdy50ZWxvcy5hbW91bnQpO1xuICAgICAgICAgICAgICAgIHN1bSA9IHN1bS5wbHVzKG9yZGVyX3Jvdy50b3RhbC5hbW91bnQpO1xuICAgICAgICAgICAgICAgIG9yZGVyX3Jvdy5zdW10ZWxvcyA9IG5ldyBBc3NldERFWChzdW10ZWxvcywgb3JkZXJfcm93LnRlbG9zLnRva2VuKTtcbiAgICAgICAgICAgICAgICBvcmRlcl9yb3cuc3VtID0gbmV3IEFzc2V0REVYKHN1bSwgb3JkZXJfcm93LnRvdGFsLnRva2VuKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLm9yZGVycy5zZWxsID0gbGlzdDtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cInZwZS50bG9zXCIgfHwgc2NvcGU9PVwiY250LnRsb3NcIiljb25zb2xlLmxvZyhcIlNlbGwgZmluYWw6XCIsIHRoaXMuc2NvcGVzW3Njb3BlXS5vcmRlcnMuc2VsbCk7XG4gICAgICAgICAgICAvLyBpZihzY29wZT09XCJ2cGUudGxvc1wiIHx8IHNjb3BlPT1cImNudC50bG9zXCIpY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tXCIpO1xuXG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInNlbGxvcmRlcnNcIiwgZmFsc2UpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5vcmRlcnMuc2VsbDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSAmJiAhZm9yY2UpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5vcmRlcnMuc2VsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGF1eDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBcbiAgICBhc3luYyBnZXRCdXlPcmRlcnMoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYLCBmb3JjZTpib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB2YXIgc2NvcGU6c3RyaW5nID0gdGhpcy5nZXRTY29wZUZvcihjb21vZGl0eSwgY3VycmVuY3kpO1xuICAgICAgICB2YXIgY2Fub25pY2FsOnN0cmluZyA9IHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpO1xuICAgICAgICB2YXIgcmV2ZXJzZTpzdHJpbmcgPSB0aGlzLmludmVyc2VTY29wZShjYW5vbmljYWwpO1xuXG5cbiAgICAgICAgdmFyIGF1eCA9IG51bGw7XG4gICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJ1eW9yZGVyc1wiLCB0cnVlKTtcbiAgICAgICAgYXV4ID0gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgb3JkZXJzID0gYXdhaXQgYXdhaXQgdGhpcy5mZXRjaE9yZGVycyh7c2NvcGU6cmV2ZXJzZSwgbGltaXQ6NTAsIGluZGV4X3Bvc2l0aW9uOiBcIjJcIiwga2V5X3R5cGU6IFwiaTY0XCJ9KTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSA9IHRoaXMuYXV4QXNzZXJ0U2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQnV5IGNydWRvOlwiLCBvcmRlcnMpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGJ1eTogT3JkZXJbXSA9IHRoaXMuYXV4UHJvY2Vzc1Jvd3NUb09yZGVycyhvcmRlcnMucm93cyk7XG4gICAgICAgICAgICBidXkuc29ydChmdW5jdGlvbihhOk9yZGVyLCBiOk9yZGVyKXtcbiAgICAgICAgICAgICAgICBpZihhLnByaWNlLmFtb3VudC5pc0xlc3NUaGFuKGIucHJpY2UuYW1vdW50KSkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgaWYoYS5wcmljZS5hbW91bnQuaXNHcmVhdGVyVGhhbihiLnByaWNlLmFtb3VudCkpIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImJ1eSBzb3J0ZWFkbzpcIiwgYnV5KTtcblxuICAgICAgICAgICAgLy8gZ3JvdXBpbmcgdG9nZXRoZXIgb3JkZXJzIHdpdGggdGhlIHNhbWUgcHJpY2UuXG4gICAgICAgICAgICB2YXIgbGlzdDogT3JkZXJSb3dbXSA9IFtdO1xuICAgICAgICAgICAgdmFyIHJvdzogT3JkZXJSb3c7XG4gICAgICAgICAgICBpZiAoYnV5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxidXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9yZGVyOiBPcmRlciA9IGJ1eVtpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93ID0gbGlzdFtsaXN0Lmxlbmd0aC0xXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3cucHJpY2UuYW1vdW50LmVxKG9yZGVyLnByaWNlLmFtb3VudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cudG90YWwuYW1vdW50ID0gcm93LnRvdGFsLmFtb3VudC5wbHVzKG9yZGVyLnRvdGFsLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LnRlbG9zLmFtb3VudCA9IHJvdy50ZWxvcy5hbW91bnQucGx1cyhvcmRlci50ZWxvcy5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5vd25lcnNbb3JkZXIub3duZXJdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cub3JkZXJzLnB1c2gob3JkZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByb3cgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHI6IG9yZGVyLnByaWNlLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogb3JkZXIucHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcnM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IG9yZGVyLnRvdGFsLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWxvczogb3JkZXIudGVsb3MuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2U6IG9yZGVyLmludmVyc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdW06IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdW10ZWxvczogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyczoge31cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJvdy5vd25lcnNbb3JkZXIub3duZXJdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcm93Lm9yZGVycy5wdXNoKG9yZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuXG4gICAgICAgICAgICB2YXIgc3VtID0gbmV3IEJpZ051bWJlcigwKTtcbiAgICAgICAgICAgIHZhciBzdW10ZWxvcyA9IG5ldyBCaWdOdW1iZXIoMCk7XG4gICAgICAgICAgICBmb3IgKHZhciBqIGluIGxpc3QpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3JkZXJfcm93ID0gbGlzdFtqXTtcbiAgICAgICAgICAgICAgICBzdW10ZWxvcyA9IHN1bXRlbG9zLnBsdXMob3JkZXJfcm93LnRlbG9zLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgc3VtID0gc3VtLnBsdXMob3JkZXJfcm93LnRvdGFsLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgb3JkZXJfcm93LnN1bXRlbG9zID0gbmV3IEFzc2V0REVYKHN1bXRlbG9zLCBvcmRlcl9yb3cudGVsb3MudG9rZW4pO1xuICAgICAgICAgICAgICAgIG9yZGVyX3Jvdy5zdW0gPSBuZXcgQXNzZXRERVgoc3VtLCBvcmRlcl9yb3cudG90YWwudG9rZW4pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0ub3JkZXJzLmJ1eSA9IGxpc3Q7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJ1eSBmaW5hbDpcIiwgdGhpcy5zY29wZXNbc2NvcGVdLm9yZGVycy5idXkpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJidXlvcmRlcnNcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5vcmRlcnMuYnV5O1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5fbWFya2V0c1tjYW5vbmljYWxdICYmICFmb3JjZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLm9yZGVycy5idXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhdXg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgZ2V0T3JkZXJTdW1tYXJ5KCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldE9yZGVyU3VtbWFyeSgpXCIpO1xuICAgICAgICB2YXIgdGFibGVzID0gYXdhaXQgdGhpcy5mZXRjaE9yZGVyU3VtbWFyeSgpO1xuXG4gICAgICAgIGZvciAodmFyIGkgaW4gdGFibGVzLnJvd3MpIHtcbiAgICAgICAgICAgIHZhciBzY29wZTpzdHJpbmcgPSB0YWJsZXMucm93c1tpXS50YWJsZTtcbiAgICAgICAgICAgIHZhciBjYW5vbmljYWwgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHNjb3BlID09IGNhbm9uaWNhbCwgXCJFUlJPUjogc2NvcGUgaXMgbm90IGNhbm9uaWNhbFwiLCBzY29wZSwgW2ksIHRhYmxlc10pO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdID0gdGhpcy5hdXhBc3NlcnRTY29wZShjYW5vbmljYWwpO1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpLCB0YWJsZXMucm93c1tpXSk7XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5oZWFkZXIuc2VsbC50b3RhbCA9IG5ldyBBc3NldERFWCh0YWJsZXMucm93c1tpXS5zdXBwbHkudG90YWwsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmhlYWRlci5zZWxsLm9yZGVycyA9IHRhYmxlcy5yb3dzW2ldLnN1cHBseS5vcmRlcnM7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uaGVhZGVyLmJ1eS50b3RhbCA9IG5ldyBBc3NldERFWCh0YWJsZXMucm93c1tpXS5kZW1hbmQudG90YWwsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmhlYWRlci5idXkub3JkZXJzID0gdGFibGVzLnJvd3NbaV0uZGVtYW5kLm9yZGVycztcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5kZWFscyA9IHRhYmxlcy5yb3dzW2ldLmRlYWxzO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmJsb2NrcyA9IHRhYmxlcy5yb3dzW2ldLmJsb2NrcztcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5kaXJlY3QgPSB0YWJsZXMucm93c1tpXS5kZW1hbmQuYXNjdXJyZW5jeTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5pbnZlcnNlID0gdGFibGVzLnJvd3NbaV0uc3VwcGx5LmFzY3VycmVuY3k7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0T3JkZXJTdW1tYXJ5KCk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0TWFya2V0U3VtbWFyeSh0b2tlbl9hOlRva2VuREVYLCB0b2tlbl9iOlRva2VuREVYLCBmb3JjZTpib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPE1hcmtldFN1bW1hcnk+IHtcbiAgICAgICAgdmFyIHNjb3BlOnN0cmluZyA9IHRoaXMuZ2V0U2NvcGVGb3IodG9rZW5fYSwgdG9rZW5fYik7XG4gICAgICAgIHZhciBjYW5vbmljYWw6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgIHZhciBpbnZlcnNlOnN0cmluZyA9IHRoaXMuaW52ZXJzZVNjb3BlKGNhbm9uaWNhbCk7XG5cbiAgICAgICAgdmFyIGNvbW9kaXR5ID0gdGhpcy5hdXhHZXRDb21vZGl0eVRva2VuKGNhbm9uaWNhbCk7IFxuICAgICAgICB2YXIgY3VycmVuY3kgPSB0aGlzLmF1eEdldEN1cnJlbmN5VG9rZW4oY2Fub25pY2FsKTtcblxuICAgICAgICB2YXIgWkVST19DT01PRElUWSA9IFwiMC4wMDAwMDAwMCBcIiArIGNvbW9kaXR5LnN5bWJvbDtcbiAgICAgICAgdmFyIFpFUk9fQ1VSUkVOQ1kgPSBcIjAuMDAwMDAwMDAgXCIgKyBjdXJyZW5jeS5zeW1ib2w7XG5cbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJzdW1tYXJ5LlwiK2Nhbm9uaWNhbCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwic3VtbWFyeS5cIitpbnZlcnNlLCB0cnVlKTtcbiAgICAgICAgdmFyIGF1eCA9IG51bGw7XG4gICAgICAgIHZhciByZXN1bHQ6TWFya2V0U3VtbWFyeSA9IG51bGw7XG4gICAgICAgIGF1eCA9IHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIHN1bW1hcnkgPSBhd2FpdCB0aGlzLmZldGNoU3VtbWFyeShjYW5vbmljYWwpO1xuICAgICAgICAgICAgLy8gaWYoc2NvcGU9PVwib2xpdmUudGxvc1wiKWNvbnNvbGUubG9nKHNjb3BlLCBcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cIm9saXZlLnRsb3NcIiljb25zb2xlLmxvZyhcIlN1bW1hcnkgY3J1ZG86XCIsIHN1bW1hcnkucm93cyk7XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSA9IHRoaXMuYXV4QXNzZXJ0U2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5ID0ge1xuICAgICAgICAgICAgICAgIHNjb3BlOiBjYW5vbmljYWwsXG4gICAgICAgICAgICAgICAgcHJpY2U6IG5ldyBBc3NldERFWChuZXcgQmlnTnVtYmVyKDApLCBjdXJyZW5jeSksXG4gICAgICAgICAgICAgICAgcHJpY2VfMjRoX2FnbzogbmV3IEFzc2V0REVYKG5ldyBCaWdOdW1iZXIoMCksIGN1cnJlbmN5KSxcbiAgICAgICAgICAgICAgICBpbnZlcnNlOiBuZXcgQXNzZXRERVgobmV3IEJpZ051bWJlcigwKSwgY29tb2RpdHkpLFxuICAgICAgICAgICAgICAgIGludmVyc2VfMjRoX2FnbzogbmV3IEFzc2V0REVYKG5ldyBCaWdOdW1iZXIoMCksIGNvbW9kaXR5KSxcbiAgICAgICAgICAgICAgICB2b2x1bWU6IG5ldyBBc3NldERFWChuZXcgQmlnTnVtYmVyKDApLCBjdXJyZW5jeSksXG4gICAgICAgICAgICAgICAgYW1vdW50OiBuZXcgQXNzZXRERVgobmV3IEJpZ051bWJlcigwKSwgY29tb2RpdHkpLFxuICAgICAgICAgICAgICAgIHBlcmNlbnQ6IDAuMyxcbiAgICAgICAgICAgICAgICByZWNvcmRzOiBzdW1tYXJ5LnJvd3NcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBub3c6RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB2YXIgbm93X3NlYzogbnVtYmVyID0gTWF0aC5mbG9vcihub3cuZ2V0VGltZSgpIC8gMTAwMCk7XG4gICAgICAgICAgICB2YXIgbm93X2hvdXI6IG51bWJlciA9IE1hdGguZmxvb3Iobm93X3NlYyAvIDM2MDApO1xuICAgICAgICAgICAgdmFyIHN0YXJ0X2hvdXIgPSBub3dfaG91ciAtIDIzO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcIm5vd19ob3VyOlwiLCBub3dfaG91cik7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwic3RhcnRfaG91cjpcIiwgc3RhcnRfaG91cik7XG5cbiAgICAgICAgICAgIC8vIHByb2Nlc28gbG9zIGRhdG9zIGNydWRvcyBcbiAgICAgICAgICAgIHZhciBwcmljZSA9IFpFUk9fQ1VSUkVOQ1k7XG4gICAgICAgICAgICB2YXIgaW52ZXJzZSA9IFpFUk9fQ09NT0RJVFk7XG4gICAgICAgICAgICB2YXIgY3J1ZGUgPSB7fTtcbiAgICAgICAgICAgIHZhciBsYXN0X2hoID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxzdW1tYXJ5LnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaGggPSBzdW1tYXJ5LnJvd3NbaV0uaG91cjtcbiAgICAgICAgICAgICAgICBpZiAoc3VtbWFyeS5yb3dzW2ldLmxhYmVsID09IFwibGFzdG9uZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHByaWNlID0gc3VtbWFyeS5yb3dzW2ldLnByaWNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNydWRlW2hoXSA9IHN1bW1hcnkucm93c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RfaGggPCBoaCAmJiBoaCA8IHN0YXJ0X2hvdXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RfaGggPSBoaDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlID0gc3VtbWFyeS5yb3dzW2ldLnByaWNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzZSA9IHN1bW1hcnkucm93c1tpXS5pbnZlcnNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwcmljZSA9IChzY29wZSA9PSBjYW5vbmljYWwpID8gc3VtbWFyeS5yb3dzW2ldLnByaWNlIDogc3VtbWFyeS5yb3dzW2ldLmludmVyc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnZlcnNlID0gKHNjb3BlID09IGNhbm9uaWNhbCkgPyBzdW1tYXJ5LnJvd3NbaV0uaW52ZXJzZSA6IHN1bW1hcnkucm93c1tpXS5wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJoaDpcIiwgaGgsIFwibGFzdF9oaDpcIiwgbGFzdF9oaCwgXCJwcmljZTpcIiwgcHJpY2UpO1xuICAgICAgICAgICAgICAgICAgICB9ICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiY3J1ZGU6XCIsIGNydWRlKTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJwcmljZTpcIiwgcHJpY2UpO1xuXG4gICAgICAgICAgICAvLyBnZW5lcm8gdW5hIGVudHJhZGEgcG9yIGNhZGEgdW5hIGRlIGxhcyDDumx0aW1hcyAyNCBob3Jhc1xuICAgICAgICAgICAgdmFyIGxhc3RfMjRoID0ge307XG4gICAgICAgICAgICB2YXIgdm9sdW1lID0gbmV3IEFzc2V0REVYKFpFUk9fQ1VSUkVOQ1ksIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGFtb3VudCA9IG5ldyBBc3NldERFWChaRVJPX0NPTU9ESVRZLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBwcmljZV9hc3NldCA9IG5ldyBBc3NldERFWChwcmljZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgaW52ZXJzZV9hc3NldCA9IG5ldyBBc3NldERFWChpbnZlcnNlLCB0aGlzKTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJjbnQudGxvc1wiKWNvbnNvbGUubG9nKFwicHJpY2UgXCIsIHByaWNlKTtcbiAgICAgICAgICAgIHZhciBtYXhfcHJpY2UgPSBwcmljZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgdmFyIG1pbl9wcmljZSA9IHByaWNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICB2YXIgbWF4X2ludmVyc2UgPSBpbnZlcnNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICB2YXIgbWluX2ludmVyc2UgPSBpbnZlcnNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICB2YXIgcHJpY2VfZnN0OkFzc2V0REVYID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBpbnZlcnNlX2ZzdDpBc3NldERFWCA9IG51bGw7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8MjQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gc3RhcnRfaG91citpO1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50X2RhdGUgPSBuZXcgRGF0ZShjdXJyZW50ICogMzYwMCAqIDEwMDApO1xuICAgICAgICAgICAgICAgIHZhciBudWV2bzphbnkgPSBjcnVkZVtjdXJyZW50XTtcbiAgICAgICAgICAgICAgICBpZiAobnVldm8pIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbnVldm8gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogdGhpcy5hdXhHZXRMYWJlbEZvckhvdXIoY3VycmVudCAlIDI0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2U6IGludmVyc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWU6IFpFUk9fQ1VSUkVOQ1ksXG4gICAgICAgICAgICAgICAgICAgICAgICBhbW91bnQ6IFpFUk9fQ09NT0RJVFksXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlOiBjdXJyZW50X2RhdGUudG9JU09TdHJpbmcoKS5zcGxpdChcIi5cIilbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBob3VyOiBjdXJyZW50XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhc3RfMjRoW2N1cnJlbnRdID0gY3J1ZGVbY3VycmVudF0gfHwgbnVldm87XG4gICAgICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcImN1cnJlbnRfZGF0ZTpcIiwgY3VycmVudF9kYXRlLnRvSVNPU3RyaW5nKCksIGN1cnJlbnQsIGxhc3RfMjRoW2N1cnJlbnRdKTtcblxuICAgICAgICAgICAgICAgIC8vIGNvbmluaWNhbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgcHJpY2UgPSBsYXN0XzI0aFtjdXJyZW50XS5wcmljZTtcbiAgICAgICAgICAgICAgICB2YXIgdm9sID0gbmV3IEFzc2V0REVYKGxhc3RfMjRoW2N1cnJlbnRdLnZvbHVtZSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQodm9sLnRva2VuLnN5bWJvbCA9PSB2b2x1bWUudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiBkaWZmZXJlbnQgdG9rZW5zXCIsIHZvbC5zdHIsIHZvbHVtZS5zdHIpO1xuICAgICAgICAgICAgICAgIHZvbHVtZS5hbW91bnQgPSB2b2x1bWUuYW1vdW50LnBsdXModm9sLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgaWYgKHByaWNlICE9IFpFUk9fQ1VSUkVOQ1kgJiYgIXByaWNlX2ZzdCkge1xuICAgICAgICAgICAgICAgICAgICBwcmljZV9mc3QgPSBuZXcgQXNzZXRERVgocHJpY2UsIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcmljZV9hc3NldCA9IG5ldyBBc3NldERFWChwcmljZSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQocHJpY2VfYXNzZXQudG9rZW4uc3ltYm9sID09IG1heF9wcmljZS50b2tlbi5zeW1ib2wsIFwiRVJST1I6IGRpZmZlcmVudCB0b2tlbnNcIiwgcHJpY2VfYXNzZXQuc3RyLCBtYXhfcHJpY2Uuc3RyKTtcbiAgICAgICAgICAgICAgICBpZiAocHJpY2VfYXNzZXQuYW1vdW50LmlzR3JlYXRlclRoYW4obWF4X3ByaWNlLmFtb3VudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4X3ByaWNlID0gcHJpY2VfYXNzZXQuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQocHJpY2VfYXNzZXQudG9rZW4uc3ltYm9sID09IG1pbl9wcmljZS50b2tlbi5zeW1ib2wsIFwiRVJST1I6IGRpZmZlcmVudCB0b2tlbnNcIiwgcHJpY2VfYXNzZXQuc3RyLCBtaW5fcHJpY2Uuc3RyKTtcbiAgICAgICAgICAgICAgICBpZiAobWluX3ByaWNlLmFtb3VudC5pc0VxdWFsVG8oMCkgfHwgcHJpY2VfYXNzZXQuYW1vdW50LmlzTGVzc1RoYW4obWluX3ByaWNlLmFtb3VudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWluX3ByaWNlID0gcHJpY2VfYXNzZXQuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyByZXZlcnNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICBpbnZlcnNlID0gbGFzdF8yNGhbY3VycmVudF0uaW52ZXJzZTtcbiAgICAgICAgICAgICAgICB2YXIgYW1vID0gbmV3IEFzc2V0REVYKGxhc3RfMjRoW2N1cnJlbnRdLmFtb3VudCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoYW1vLnRva2VuLnN5bWJvbCA9PSBhbW91bnQudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiBkaWZmZXJlbnQgdG9rZW5zXCIsIGFtby5zdHIsIGFtb3VudC5zdHIpO1xuICAgICAgICAgICAgICAgIGFtb3VudC5hbW91bnQgPSBhbW91bnQuYW1vdW50LnBsdXMoYW1vLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgaWYgKGludmVyc2UgIT0gWkVST19DT01PRElUWSAmJiAhaW52ZXJzZV9mc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJzZV9mc3QgPSBuZXcgQXNzZXRERVgoaW52ZXJzZSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGludmVyc2VfYXNzZXQgPSBuZXcgQXNzZXRERVgoaW52ZXJzZSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoaW52ZXJzZV9hc3NldC50b2tlbi5zeW1ib2wgPT0gbWF4X2ludmVyc2UudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiBkaWZmZXJlbnQgdG9rZW5zXCIsIGludmVyc2VfYXNzZXQuc3RyLCBtYXhfaW52ZXJzZS5zdHIpO1xuICAgICAgICAgICAgICAgIGlmIChpbnZlcnNlX2Fzc2V0LmFtb3VudC5pc0dyZWF0ZXJUaGFuKG1heF9pbnZlcnNlLmFtb3VudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4X2ludmVyc2UgPSBpbnZlcnNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGludmVyc2VfYXNzZXQudG9rZW4uc3ltYm9sID09IG1pbl9pbnZlcnNlLnRva2VuLnN5bWJvbCwgXCJFUlJPUjogZGlmZmVyZW50IHRva2Vuc1wiLCBpbnZlcnNlX2Fzc2V0LnN0ciwgbWluX2ludmVyc2Uuc3RyKTtcbiAgICAgICAgICAgICAgICBpZiAobWluX2ludmVyc2UuYW1vdW50LmlzRXF1YWxUbygwKSB8fCBpbnZlcnNlX2Fzc2V0LmFtb3VudC5pc0xlc3NUaGFuKG1pbl9pbnZlcnNlLmFtb3VudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWluX2ludmVyc2UgPSBpbnZlcnNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gY29uaW5pY2FsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIGlmICghcHJpY2VfZnN0KSB7XG4gICAgICAgICAgICAgICAgcHJpY2VfZnN0ID0gbmV3IEFzc2V0REVYKGxhc3RfMjRoW3N0YXJ0X2hvdXJdLnByaWNlLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsYXN0X3ByaWNlID0gIG5ldyBBc3NldERFWChsYXN0XzI0aFtub3dfaG91cl0ucHJpY2UsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGRpZmYgPSBsYXN0X3ByaWNlLmNsb25lKCk7XG4gICAgICAgICAgICAvLyBkaWZmLmFtb3VudCBcbiAgICAgICAgICAgIGRpZmYuYW1vdW50ID0gbGFzdF9wcmljZS5hbW91bnQubWludXMocHJpY2VfZnN0LmFtb3VudCk7XG4gICAgICAgICAgICB2YXIgcmF0aW86bnVtYmVyID0gMDtcbiAgICAgICAgICAgIGlmIChwcmljZV9mc3QuYW1vdW50LnRvTnVtYmVyKCkgIT0gMCkge1xuICAgICAgICAgICAgICAgIHJhdGlvID0gZGlmZi5hbW91bnQuZGl2aWRlZEJ5KHByaWNlX2ZzdC5hbW91bnQpLnRvTnVtYmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcGVyY2VudCA9IE1hdGguZmxvb3IocmF0aW8gKiAxMDAwMCkgLyAxMDA7XG5cbiAgICAgICAgICAgIC8vIHJldmVyc2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgaWYgKCFpbnZlcnNlX2ZzdCkge1xuICAgICAgICAgICAgICAgIGludmVyc2VfZnN0ID0gbmV3IEFzc2V0REVYKGxhc3RfMjRoW3N0YXJ0X2hvdXJdLmludmVyc2UsIHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGxhc3RfaW52ZXJzZSA9ICBuZXcgQXNzZXRERVgobGFzdF8yNGhbbm93X2hvdXJdLmludmVyc2UsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGlkaWZmID0gbGFzdF9pbnZlcnNlLmNsb25lKCk7XG4gICAgICAgICAgICAvLyBkaWZmLmFtb3VudCBcbiAgICAgICAgICAgIGlkaWZmLmFtb3VudCA9IGxhc3RfaW52ZXJzZS5hbW91bnQubWludXMoaW52ZXJzZV9mc3QuYW1vdW50KTtcbiAgICAgICAgICAgIHJhdGlvID0gMDtcbiAgICAgICAgICAgIGlmIChpbnZlcnNlX2ZzdC5hbW91bnQudG9OdW1iZXIoKSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgcmF0aW8gPSBkaWZmLmFtb3VudC5kaXZpZGVkQnkoaW52ZXJzZV9mc3QuYW1vdW50KS50b051bWJlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGlwZXJjZW50ID0gTWF0aC5mbG9vcihyYXRpbyAqIDEwMDAwKSAvIDEwMDtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJwcmljZV9mc3Q6XCIsIHByaWNlX2ZzdC5zdHIpO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcImludmVyc2VfZnN0OlwiLCBpbnZlcnNlX2ZzdC5zdHIpO1xuXG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwibGFzdF8yNGg6XCIsIFtsYXN0XzI0aF0pO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcImRpZmY6XCIsIGRpZmYudG9TdHJpbmcoOCkpO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcInBlcmNlbnQ6XCIsIHBlcmNlbnQpO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcInJhdGlvOlwiLCByYXRpbyk7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwidm9sdW1lOlwiLCB2b2x1bWUuc3RyKTtcblxuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkucHJpY2UgPSBsYXN0X3ByaWNlO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkuaW52ZXJzZSA9IGxhc3RfaW52ZXJzZTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LnByaWNlXzI0aF9hZ28gPSBwcmljZV9mc3QgfHwgbGFzdF9wcmljZTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LmludmVyc2VfMjRoX2FnbyA9IGludmVyc2VfZnN0O1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkucGVyY2VudF9zdHIgPSAoaXNOYU4ocGVyY2VudCkgPyAwIDogcGVyY2VudCkgKyBcIiVcIjtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LnBlcmNlbnQgPSBpc05hTihwZXJjZW50KSA/IDAgOiBwZXJjZW50O1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkuaXBlcmNlbnRfc3RyID0gKGlzTmFOKGlwZXJjZW50KSA/IDAgOiBpcGVyY2VudCkgKyBcIiVcIjtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LmlwZXJjZW50ID0gaXNOYU4oaXBlcmNlbnQpID8gMCA6IGlwZXJjZW50O1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkudm9sdW1lID0gdm9sdW1lO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkuYW1vdW50ID0gYW1vdW50O1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkubWluX3ByaWNlID0gbWluX3ByaWNlO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkubWF4X3ByaWNlID0gbWF4X3ByaWNlO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkubWluX2ludmVyc2UgPSBtaW5faW52ZXJzZTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5Lm1heF9pbnZlcnNlID0gbWF4X2ludmVyc2U7XG5cbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJTdW1tYXJ5IGZpbmFsOlwiLCB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeSk7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJzdW1tYXJ5LlwiK2Nhbm9uaWNhbCwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJzdW1tYXJ5LlwiK2ludmVyc2UsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSAmJiAhZm9yY2UpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgYXV4O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXNvcnRUb3BNYXJrZXRzKCk7XG4gICAgICAgIHRoaXMuc2V0TWFya2V0U3VtbWFyeSgpO1xuICAgICAgICB0aGlzLm9uTWFya2V0U3VtbWFyeS5uZXh0KHJlc3VsdCk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRBbGxUYWJsZXNTdW1hcmllcygpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0T3JkZXJTdW1tYXJ5LnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZXMgPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLl9tYXJrZXRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkuaW5kZXhPZihcIi5cIikgPT0gLTEpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIHZhciBwID0gdGhpcy5nZXRNYXJrZXRTdW1tYXJ5KHRoaXMuX21hcmtldHNbaV0uY29tb2RpdHksIHRoaXMuX21hcmtldHNbaV0uY3VycmVuY3ksIHRydWUpO1xuICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2gocCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihfID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRva2Vuc1N1bW1hcnkoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgIH1cbiAgICBcblxuICAgIC8vXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBdXggZnVuY3Rpb25zXG4gICAgcHJpdmF0ZSBhdXhQcm9jZXNzUm93c1RvT3JkZXJzKHJvd3M6YW55W10pOiBPcmRlcltdIHtcbiAgICAgICAgdmFyIHJlc3VsdDogT3JkZXJbXSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGkgPCByb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcHJpY2UgPSBuZXcgQXNzZXRERVgocm93c1tpXS5wcmljZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgaW52ZXJzZSA9IG5ldyBBc3NldERFWChyb3dzW2ldLmludmVyc2UsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNlbGxpbmcgPSBuZXcgQXNzZXRERVgocm93c1tpXS5zZWxsaW5nLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IG5ldyBBc3NldERFWChyb3dzW2ldLnRvdGFsLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBvcmRlcjpPcmRlcjtcblxuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcy5nZXRTY29wZUZvcihwcmljZS50b2tlbiwgaW52ZXJzZS50b2tlbik7XG4gICAgICAgICAgICB2YXIgY2Fub25pY2FsID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgICAgICB2YXIgcmV2ZXJzZV9zY29wZSA9IHRoaXMuaW52ZXJzZVNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgaWYgKHJldmVyc2Vfc2NvcGUgPT0gc2NvcGUpIHtcbiAgICAgICAgICAgICAgICBvcmRlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHJvd3NbaV0uaWQsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlOiBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogaW52ZXJzZSxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHNlbGxpbmcsXG4gICAgICAgICAgICAgICAgICAgIGRlcG9zaXQ6IHNlbGxpbmcsXG4gICAgICAgICAgICAgICAgICAgIHRlbG9zOiB0b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IHJvd3NbaV0ub3duZXJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9yZGVyID0ge1xuICAgICAgICAgICAgICAgICAgICBpZDogcm93c1tpXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGludmVyc2UsXG4gICAgICAgICAgICAgICAgICAgIGludmVyc2U6IHByaWNlLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwsXG4gICAgICAgICAgICAgICAgICAgIGRlcG9zaXQ6IHNlbGxpbmcsXG4gICAgICAgICAgICAgICAgICAgIHRlbG9zOiBzZWxsaW5nLFxuICAgICAgICAgICAgICAgICAgICBvd25lcjogcm93c1tpXS5vd25lclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG9yZGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXV4R2V0TGFiZWxGb3JIb3VyKGhoOm51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIHZhciBob3VycyA9IFtcbiAgICAgICAgICAgIFwiaC56ZXJvXCIsXG4gICAgICAgICAgICBcImgub25lXCIsXG4gICAgICAgICAgICBcImgudHdvXCIsXG4gICAgICAgICAgICBcImgudGhyZWVcIixcbiAgICAgICAgICAgIFwiaC5mb3VyXCIsXG4gICAgICAgICAgICBcImguZml2ZVwiLFxuICAgICAgICAgICAgXCJoLnNpeFwiLFxuICAgICAgICAgICAgXCJoLnNldmVuXCIsXG4gICAgICAgICAgICBcImguZWlnaHRcIixcbiAgICAgICAgICAgIFwiaC5uaW5lXCIsXG4gICAgICAgICAgICBcImgudGVuXCIsXG4gICAgICAgICAgICBcImguZWxldmVuXCIsXG4gICAgICAgICAgICBcImgudHdlbHZlXCIsXG4gICAgICAgICAgICBcImgudGhpcnRlZW5cIixcbiAgICAgICAgICAgIFwiaC5mb3VydGVlblwiLFxuICAgICAgICAgICAgXCJoLmZpZnRlZW5cIixcbiAgICAgICAgICAgIFwiaC5zaXh0ZWVuXCIsXG4gICAgICAgICAgICBcImguc2V2ZW50ZWVuXCIsXG4gICAgICAgICAgICBcImguZWlnaHRlZW5cIixcbiAgICAgICAgICAgIFwiaC5uaW5ldGVlblwiLFxuICAgICAgICAgICAgXCJoLnR3ZW50eVwiLFxuICAgICAgICAgICAgXCJoLnR3ZW50eW9uZVwiLFxuICAgICAgICAgICAgXCJoLnR3ZW50eXR3b1wiLFxuICAgICAgICAgICAgXCJoLnR3ZW50eXRocmVlXCJcbiAgICAgICAgXVxuICAgICAgICByZXR1cm4gaG91cnNbaGhdO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXV4R2V0Q3VycmVuY3lUb2tlbihzY29wZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KCEhc2NvcGUsIFwiRVJST1I6IGludmFsaWQgc2NvcGU6ICdcIisgc2NvcGUgK1wiJ1wiKTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoc2NvcGUuc3BsaXQoXCIuXCIpLmxlbmd0aCA9PSAyLCBcIkVSUk9SOiBpbnZhbGlkIHNjb3BlOiAnXCIrIHNjb3BlICtcIidcIik7XG4gICAgICAgIHZhciBjdXJyZW5jeV9zeW0gPSBzY29wZS5zcGxpdChcIi5cIilbMV0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgdmFyIGN1cnJlbmN5ID0gdGhpcy5nZXRUb2tlbk5vdyhjdXJyZW5jeV9zeW0pO1xuICAgICAgICByZXR1cm4gY3VycmVuY3k7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhdXhHZXRDb21vZGl0eVRva2VuKHNjb3BlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoISFzY29wZSwgXCJFUlJPUjogaW52YWxpZCBzY29wZTogJ1wiKyBzY29wZSArXCInXCIpO1xuICAgICAgICBjb25zb2xlLmFzc2VydChzY29wZS5zcGxpdChcIi5cIikubGVuZ3RoID09IDIsIFwiRVJST1I6IGludmFsaWQgc2NvcGU6ICdcIisgc2NvcGUgK1wiJ1wiKTtcbiAgICAgICAgdmFyIGNvbW9kaXR5X3N5bSA9IHNjb3BlLnNwbGl0KFwiLlwiKVswXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICB2YXIgY29tb2RpdHkgPSB0aGlzLmdldFRva2VuTm93KGNvbW9kaXR5X3N5bSk7XG4gICAgICAgIHJldHVybiBjb21vZGl0eTsgICAgICAgIFxuICAgIH1cblxuICAgIHByaXZhdGUgYXV4QXNzZXJ0U2NvcGUoc2NvcGU6c3RyaW5nKTogTWFya2V0IHtcbiAgICAgICAgdmFyIGNvbW9kaXR5ID0gdGhpcy5hdXhHZXRDb21vZGl0eVRva2VuKHNjb3BlKTtcbiAgICAgICAgdmFyIGN1cnJlbmN5ID0gdGhpcy5hdXhHZXRDdXJyZW5jeVRva2VuKHNjb3BlKTtcbiAgICAgICAgdmFyIGF1eF9hc3NldF9jb20gPSBuZXcgQXNzZXRERVgoMCwgY29tb2RpdHkpO1xuICAgICAgICB2YXIgYXV4X2Fzc2V0X2N1ciA9IG5ldyBBc3NldERFWCgwLCBjdXJyZW5jeSk7XG5cbiAgICAgICAgdmFyIG1hcmtldF9zdW1tYXJ5Ok1hcmtldFN1bW1hcnkgPSB7XG4gICAgICAgICAgICBzY29wZTogc2NvcGUsXG4gICAgICAgICAgICBwcmljZTogYXV4X2Fzc2V0X2N1cixcbiAgICAgICAgICAgIHByaWNlXzI0aF9hZ286IGF1eF9hc3NldF9jdXIsXG4gICAgICAgICAgICBpbnZlcnNlOiBhdXhfYXNzZXRfY29tLFxuICAgICAgICAgICAgaW52ZXJzZV8yNGhfYWdvOiBhdXhfYXNzZXRfY29tLFxuICAgICAgICAgICAgbWF4X2ludmVyc2U6IGF1eF9hc3NldF9jb20sXG4gICAgICAgICAgICBtYXhfcHJpY2U6IGF1eF9hc3NldF9jdXIsXG4gICAgICAgICAgICBtaW5faW52ZXJzZTogYXV4X2Fzc2V0X2NvbSxcbiAgICAgICAgICAgIG1pbl9wcmljZTogYXV4X2Fzc2V0X2N1cixcbiAgICAgICAgICAgIHJlY29yZHM6IFtdLFxuICAgICAgICAgICAgdm9sdW1lOiBhdXhfYXNzZXRfY3VyLFxuICAgICAgICAgICAgYW1vdW50OiBhdXhfYXNzZXRfY29tLFxuICAgICAgICAgICAgcGVyY2VudDogMCxcbiAgICAgICAgICAgIGlwZXJjZW50OiAwLFxuICAgICAgICAgICAgcGVyY2VudF9zdHI6IFwiMCVcIixcbiAgICAgICAgICAgIGlwZXJjZW50X3N0cjogXCIwJVwiLFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcmtldHNbc2NvcGVdIHx8IHtcbiAgICAgICAgICAgIHNjb3BlOiBzY29wZSxcbiAgICAgICAgICAgIGNvbW9kaXR5OiBjb21vZGl0eSxcbiAgICAgICAgICAgIGN1cnJlbmN5OiBjdXJyZW5jeSxcbiAgICAgICAgICAgIG9yZGVyczogeyBzZWxsOiBbXSwgYnV5OiBbXSB9LFxuICAgICAgICAgICAgZGVhbHM6IDAsXG4gICAgICAgICAgICBkaXJlY3Q6IDAsXG4gICAgICAgICAgICBpbnZlcnNlOiAwLFxuICAgICAgICAgICAgaGlzdG9yeTogW10sXG4gICAgICAgICAgICB0eDoge30sXG4gICAgICAgICAgICBibG9ja3M6IDAsXG4gICAgICAgICAgICBibG9jazoge30sXG4gICAgICAgICAgICBibG9ja2xpc3Q6IFtdLFxuICAgICAgICAgICAgYmxvY2tsZXZlbHM6IFtbXV0sXG4gICAgICAgICAgICByZXZlcnNlYmxvY2tzOiBbXSxcbiAgICAgICAgICAgIHJldmVyc2VsZXZlbHM6IFtbXV0sXG4gICAgICAgICAgICBzdW1tYXJ5OiBtYXJrZXRfc3VtbWFyeSxcbiAgICAgICAgICAgIGhlYWRlcjogeyBcbiAgICAgICAgICAgICAgICBzZWxsOiB7dG90YWw6YXV4X2Fzc2V0X2NvbSwgb3JkZXJzOjB9LCBcbiAgICAgICAgICAgICAgICBidXk6IHt0b3RhbDphdXhfYXNzZXRfY3VyLCBvcmRlcnM6MH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07ICAgICAgICBcbiAgICB9XG5cbiAgICBwcml2YXRlIGZldGNoRGVwb3NpdHMoYWNjb3VudCk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJkZXBvc2l0c1wiLCB7c2NvcGU6YWNjb3VudH0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZmV0Y2hCYWxhbmNlcyhhY2NvdW50KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIGNvbnRyYWN0cyA9IHt9O1xuICAgICAgICAgICAgdmFyIGJhbGFuY2VzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMudG9rZW5zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudG9rZW5zW2ldLm9mZmNoYWluKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjb250cmFjdHNbdGhpcy50b2tlbnNbaV0uY29udHJhY3RdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGNvbnRyYWN0IGluIGNvbnRyYWN0cykge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYmFsYW5jZXMtXCIrY29udHJhY3QsIHRydWUpO1xuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yICh2YXIgY29udHJhY3QgaW4gY29udHJhY3RzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGF3YWl0IHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJhY2NvdW50c1wiLCB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0OmNvbnRyYWN0LFxuICAgICAgICAgICAgICAgICAgICBzY29wZTogYWNjb3VudCB8fCB0aGlzLmN1cnJlbnQubmFtZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gcmVzdWx0LnJvd3MpIHtcbiAgICAgICAgICAgICAgICAgICAgYmFsYW5jZXMucHVzaChuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uYmFsYW5jZSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJhbGFuY2VzLVwiK2NvbnRyYWN0LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYmFsYW5jZXM7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hPcmRlcnMocGFyYW1zOlRhYmxlUGFyYW1zKTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcInNlbGxvcmRlcnNcIiwgcGFyYW1zKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZldGNoT3JkZXJTdW1tYXJ5KCk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJvcmRlcnN1bW1hcnlcIikudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaEJsb2NrSGlzdG9yeShzY29wZTpzdHJpbmcsIHBhZ2U6bnVtYmVyID0gMCwgcGFnZXNpemU6bnVtYmVyID0gMjUpOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHZhciBjYW5vbmljYWw6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgIHZhciBwYWdlcyA9IHRoaXMuZ2V0QmxvY2tIaXN0b3J5VG90YWxQYWdlc0ZvcihjYW5vbmljYWwsIHBhZ2VzaXplKTtcbiAgICAgICAgdmFyIGlkID0gcGFnZSpwYWdlc2l6ZTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWVERVguZmV0Y2hCbG9ja0hpc3RvcnkoXCIsIHNjb3BlLCBcIixcIixwYWdlLFwiLFwiLHBhZ2VzaXplLFwiKTogaWQ6XCIsIGlkLCBcInBhZ2VzOlwiLCBwYWdlcyk7XG4gICAgICAgIGlmIChwYWdlIDwgcGFnZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXJrZXRzICYmIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSAmJiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uYmxvY2tbXCJpZC1cIiArIGlkXSkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQ6VGFibGVSZXN1bHQgPSB7bW9yZTpmYWxzZSxyb3dzOltdfTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8cGFnZXNpemU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWRfaSA9IGlkK2k7XG4gICAgICAgICAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5ibG9ja1tcImlkLVwiICsgaWRfaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnJvd3MucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnJvd3MubGVuZ3RoID09IHBhZ2VzaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGhhdmUgdGhlIGNvbXBsZXRlIHBhZ2UgaW4gbWVtb3J5XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmZldGNoSGlzdG9yeShcIiwgc2NvcGUsIFwiLFwiLHBhZ2UsXCIsXCIscGFnZXNpemUsXCIpOiByZXN1bHQ6XCIsIHJlc3VsdC5yb3dzLm1hcCgoeyBpZCB9KSA9PiBpZCkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwiYmxvY2toaXN0b3J5XCIsIHtzY29wZTpjYW5vbmljYWwsIGxpbWl0OnBhZ2VzaXplLCBsb3dlcl9ib3VuZDpcIlwiKyhwYWdlKnBhZ2VzaXplKX0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImJsb2NrIEhpc3RvcnkgY3J1ZG86XCIsIHJlc3VsdCk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gPSB0aGlzLmF1eEFzc2VydFNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uYmxvY2sgPSB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uYmxvY2sgfHwge307IFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLl9tYXJrZXRzW3Njb3BlXS5ibG9jazpcIiwgdGhpcy5fbWFya2V0c1tzY29wZV0uYmxvY2spO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgcmVzdWx0LnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYmxvY2s6SGlzdG9yeUJsb2NrID0ge1xuICAgICAgICAgICAgICAgICAgICBpZDogcmVzdWx0LnJvd3NbaV0uaWQsXG4gICAgICAgICAgICAgICAgICAgIGhvdXI6IHJlc3VsdC5yb3dzW2ldLmhvdXIsXG4gICAgICAgICAgICAgICAgICAgIHN0cjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5wcmljZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGludmVyc2U6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5pbnZlcnNlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgZW50cmFuY2U6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5lbnRyYW5jZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIG1heDogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLm1heCwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIG1pbjogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLm1pbiwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHZvbHVtZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLnZvbHVtZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudDogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmFtb3VudCwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKHJlc3VsdC5yb3dzW2ldLmRhdGUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJsb2NrLnN0ciA9IEpTT04uc3RyaW5naWZ5KFtibG9jay5tYXguc3RyLCBibG9jay5lbnRyYW5jZS5zdHIsIGJsb2NrLnByaWNlLnN0ciwgYmxvY2subWluLnN0cl0pO1xuICAgICAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5ibG9ja1tcImlkLVwiICsgYmxvY2suaWRdID0gYmxvY2s7XG4gICAgICAgICAgICB9ICAgXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImJsb2NrIEhpc3RvcnkgZmluYWw6XCIsIHRoaXMuX21hcmtldHNbc2NvcGVdLmJsb2NrKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH0gICAgXG5cbiAgICBwcml2YXRlIGZldGNoSGlzdG9yeShzY29wZTpzdHJpbmcsIHBhZ2U6bnVtYmVyID0gMCwgcGFnZXNpemU6bnVtYmVyID0gMjUpOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHZhciBjYW5vbmljYWw6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgIHZhciBwYWdlcyA9IHRoaXMuZ2V0SGlzdG9yeVRvdGFsUGFnZXNGb3IoY2Fub25pY2FsLCBwYWdlc2l6ZSk7XG4gICAgICAgIHZhciBpZCA9IHBhZ2UqcGFnZXNpemU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmZldGNoSGlzdG9yeShcIiwgc2NvcGUsIFwiLFwiLHBhZ2UsXCIsXCIscGFnZXNpemUsXCIpOiBpZDpcIiwgaWQsIFwicGFnZXM6XCIsIHBhZ2VzKTtcbiAgICAgICAgaWYgKHBhZ2UgPCBwYWdlcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX21hcmtldHMgJiYgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdICYmIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eFtcImlkLVwiICsgaWRdKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdDpUYWJsZVJlc3VsdCA9IHttb3JlOmZhbHNlLHJvd3M6W119O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxwYWdlc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpZF9pID0gaWQraTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRyeCA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eFtcImlkLVwiICsgaWRfaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0cngpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5yb3dzLnB1c2godHJ4KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucm93cy5sZW5ndGggPT0gcGFnZXNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgaGF2ZSB0aGUgY29tcGxldGUgcGFnZSBpbiBtZW1vcnlcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWVERVguZmV0Y2hIaXN0b3J5KFwiLCBzY29wZSwgXCIsXCIscGFnZSxcIixcIixwYWdlc2l6ZSxcIik6IHJlc3VsdDpcIiwgcmVzdWx0LnJvd3MubWFwKCh7IGlkIH0pID0+IGlkKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJoaXN0b3J5XCIsIHtzY29wZTpzY29wZSwgbGltaXQ6cGFnZXNpemUsIGxvd2VyX2JvdW5kOlwiXCIrKHBhZ2UqcGFnZXNpemUpfSkudGhlbihyZXN1bHQgPT4ge1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJIaXN0b3J5IGNydWRvOlwiLCByZXN1bHQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gPSB0aGlzLmF1eEFzc2VydFNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uaGlzdG9yeSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnR4ID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnR4IHx8IHt9OyBcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLnNjb3Blc1tzY29wZV0udHg6XCIsIHRoaXMuc2NvcGVzW3Njb3BlXS50eCk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaSA8IHJlc3VsdC5yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zYWN0aW9uOkhpc3RvcnlUeCA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHJlc3VsdC5yb3dzW2ldLmlkLFxuICAgICAgICAgICAgICAgICAgICBzdHI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudDogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmFtb3VudCwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHBheW1lbnQ6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5wYXltZW50LCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgYnV5ZmVlOiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uYnV5ZmVlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgc2VsbGZlZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLnNlbGxmZWUsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBwcmljZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLnByaWNlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmludmVyc2UsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBidXllcjogcmVzdWx0LnJvd3NbaV0uYnV5ZXIsXG4gICAgICAgICAgICAgICAgICAgIHNlbGxlcjogcmVzdWx0LnJvd3NbaV0uc2VsbGVyLFxuICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShyZXN1bHQucm93c1tpXS5kYXRlKSxcbiAgICAgICAgICAgICAgICAgICAgaXNidXk6ICEhcmVzdWx0LnJvd3NbaV0uaXNidXlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb24uc3RyID0gdHJhbnNhY3Rpb24ucHJpY2Uuc3RyICsgXCIgXCIgKyB0cmFuc2FjdGlvbi5hbW91bnQuc3RyO1xuICAgICAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eFtcImlkLVwiICsgdHJhbnNhY3Rpb24uaWRdID0gdHJhbnNhY3Rpb247XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogaW4gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnR4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmhpc3RvcnkucHVzaCh0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0udHhbal0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uaGlzdG9yeS5zb3J0KGZ1bmN0aW9uKGE6SGlzdG9yeVR4LCBiOkhpc3RvcnlUeCl7XG4gICAgICAgICAgICAgICAgaWYoYS5kYXRlIDwgYi5kYXRlKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBpZihhLmRhdGUgPiBiLmRhdGUpIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICBpZihhLmlkIDwgYi5pZCkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgaWYoYS5pZCA+IGIuaWQpIHJldHVybiAtMTtcbiAgICAgICAgICAgIH0pOyAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkhpc3RvcnkgZmluYWw6XCIsIHRoaXMuc2NvcGVzW3Njb3BlXS5oaXN0b3J5KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGFzeW5jIGZldGNoQWN0aXZpdHkocGFnZTpudW1iZXIgPSAwLCBwYWdlc2l6ZTpudW1iZXIgPSAyNSkge1xuICAgICAgICB2YXIgaWQgPSBwYWdlKnBhZ2VzaXplKzE7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmZldGNoQWN0aXZpdHkoXCIsIHBhZ2UsXCIsXCIscGFnZXNpemUsXCIpOiBpZDpcIiwgaWQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZpdHkuZXZlbnRzW1wiaWQtXCIgKyBpZF0pIHtcbiAgICAgICAgICAgIHZhciBwYWdlRXZlbnRzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8cGFnZXNpemU7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpZF9pID0gaWQraTtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnQgPSB0aGlzLmFjdGl2aXR5LmV2ZW50c1tcImlkLVwiICsgaWRfaV07XG4gICAgICAgICAgICAgICAgaWYgKCFldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFnZUV2ZW50cy5sZW5ndGggPT0gcGFnZXNpemUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxuICAgICAgICB9ICAgICAgICBcblxuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcImV2ZW50c1wiLCB7bGltaXQ6cGFnZXNpemUsIGxvd2VyX2JvdW5kOlwiXCIraWR9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJBY3Rpdml0eSBjcnVkbzpcIiwgcmVzdWx0KTtcbiAgICAgICAgICAgIHZhciBsaXN0OkV2ZW50TG9nW10gPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgcmVzdWx0LnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSByZXN1bHQucm93c1tpXS5pZDtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnQ6RXZlbnRMb2cgPSA8RXZlbnRMb2c+cmVzdWx0LnJvd3NbaV07XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmFjdGl2aXR5LmV2ZW50c1tcImlkLVwiICsgaWRdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZpdHkuZXZlbnRzW1wiaWQtXCIgKyBpZF0gPSBldmVudDtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKj4+Pj4+XCIsIGlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdHkubGlzdCA9IFtdLmNvbmNhdCh0aGlzLmFjdGl2aXR5Lmxpc3QpLmNvbmNhdChsaXN0KTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdHkubGlzdC5zb3J0KGZ1bmN0aW9uKGE6RXZlbnRMb2csIGI6RXZlbnRMb2cpe1xuICAgICAgICAgICAgICAgIGlmKGEuZGF0ZSA8IGIuZGF0ZSkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgaWYoYS5kYXRlID4gYi5kYXRlKSByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgaWYoYS5pZCA8IGIuaWQpIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmKGEuaWQgPiBiLmlkKSByZXR1cm4gLTE7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hVc2VyT3JkZXJzKHVzZXI6c3RyaW5nKTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcInVzZXJvcmRlcnNcIiwge3Njb3BlOnVzZXIsIGxpbWl0OjIwMH0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGZldGNoU3VtbWFyeShzY29wZSk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJ0YWJsZXN1bW1hcnlcIiwge3Njb3BlOnNjb3BlfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaFRva2VuU3RhdHModG9rZW4pOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidG9rZW4tc3RhdC1cIit0b2tlbi5zeW1ib2wsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcInN0YXRcIiwge2NvbnRyYWN0OnRva2VuLmNvbnRyYWN0LCBzY29wZTp0b2tlbi5zeW1ib2x9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB0b2tlbi5zdGF0ID0gcmVzdWx0LnJvd3NbMF07XG4gICAgICAgICAgICBpZiAodG9rZW4uc3RhdC5pc3N1ZXJzICYmIHRva2VuLnN0YXQuaXNzdWVyc1swXSA9PSBcImV2ZXJ5b25lXCIpIHtcbiAgICAgICAgICAgICAgICB0b2tlbi5mYWtlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidG9rZW4tc3RhdC1cIit0b2tlbi5zeW1ib2wsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaFRva2Vuc1N0YXRzKGV4dGVuZGVkOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZS5mZXRjaFRva2VucygpXCIpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInRva2VuLXN0YXRzXCIsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oXyA9PiB7XG5cbiAgICAgICAgICAgIHZhciBwcmlvbWlzZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy50b2tlbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50b2tlbnNbaV0ub2ZmY2hhaW4pIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIHByaW9taXNlcy5wdXNoKHRoaXMuZmV0Y2hUb2tlblN0YXRzKHRoaXMudG9rZW5zW2ldKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbDxhbnk+KHByaW9taXNlcykudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VG9rZW5TdGF0cyh0aGlzLnRva2Vucyk7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ0b2tlbi1zdGF0c1wiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zO1xuICAgICAgICAgICAgfSk7ICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLy8gZm9yIGVhY2ggdG9rZW5zIHRoaXMgc29ydHMgaXRzIG1hcmtldHMgYmFzZWQgb24gdm9sdW1lXG4gICAgcHJpdmF0ZSB1cGRhdGVUb2tlbnNNYXJrZXRzKCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGhpcy53YWl0VG9rZW5zTG9hZGVkLFxuICAgICAgICAgICAgdGhpcy53YWl0TWFya2V0U3VtbWFyeVxuICAgICAgICBdKS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgLy8gYSBjYWRhIHRva2VuIGxlIGFzaWdubyB1biBwcmljZSBxdWUgc2FsZSBkZSB2ZXJpZmljYXIgc3UgcHJpY2UgZW4gZWwgbWVyY2FkbyBwcmluY2lwYWwgWFhYL1RMT1NcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy50b2tlbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50b2tlbnNbaV0ub2ZmY2hhaW4pIGNvbnRpbnVlOyAvLyBkaXNjYXJkIHRva2VucyB0aGF0IGFyZSBub3Qgb24tY2hhaW5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLnRva2Vuc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgcXVhbnRpdHk6QXNzZXRERVggPSBuZXcgQXNzZXRERVgoMCwgdG9rZW4pO1xuICAgICAgICAgICAgICAgIHRva2VuLm1hcmtldHMgPSBbXTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIHNjb3BlIGluIHRoaXMuX21hcmtldHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjb3BlLmluZGV4T2YoXCIuXCIpID09IC0xKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlOk1hcmtldCA9IHRoaXMuX21hcmtldHNbc2NvcGVdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJsZSA9IHRoaXMubWFya2V0KHRoaXMuaW52ZXJzZVNjb3BlKHNjb3BlKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY29tb2RpdHkuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4ubWFya2V0cy5wdXNoKHRhYmxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdG9rZW4ubWFya2V0cy5zb3J0KChhOk1hcmtldCwgYjpNYXJrZXQpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBwdXNoIG9mZmNoYWluIHRva2VucyB0byB0aGUgZW5kIG9mIHRoZSB0b2tlbiBsaXN0XG4gICAgICAgICAgICAgICAgdmFyIGFfYW1vdW50ID0gYS5zdW1tYXJ5ID8gYS5zdW1tYXJ5LmFtb3VudCA6IG5ldyBBc3NldERFWCgpO1xuICAgICAgICAgICAgICAgIHZhciBiX2Ftb3VudCA9IGIuc3VtbWFyeSA/IGIuc3VtbWFyeS5hbW91bnQgOiBuZXcgQXNzZXRERVgoKTtcbiAgICBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChhX2Ftb3VudC50b2tlbi5zeW1ib2wgPT0gYl9hbW91bnQudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiBjb21wYXJpbmcgdHdvIGRpZmZlcmVudCB0b2tlbnMgXCIgKyBhX2Ftb3VudC5zdHIgKyBcIiwgXCIgKyBiX2Ftb3VudC5zdHIpXG4gICAgICAgICAgICAgICAgaWYoYV9hbW91bnQuYW1vdW50LmlzR3JlYXRlclRoYW4oYl9hbW91bnQuYW1vdW50KSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIGlmKGFfYW1vdW50LmFtb3VudC5pc0xlc3NUaGFuKGJfYW1vdW50LmFtb3VudCkpIHJldHVybiAxO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTsgICBcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSB1cGRhdGVUb2tlbnNTdW1tYXJ5KHRpbWVzOiBudW1iZXIgPSAyMCkge1xuICAgICAgICBpZiAodGltZXMgPiAxKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gdGltZXM7IGk+MDsgaS0tKSB0aGlzLnVwZGF0ZVRva2Vuc1N1bW1hcnkoMSk7XG4gICAgICAgICAgICB0aGlzLnJlc29ydFRva2VucygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0aGlzLndhaXRUb2tlbnNMb2FkZWQsXG4gICAgICAgICAgICB0aGlzLndhaXRNYXJrZXRTdW1tYXJ5XG4gICAgICAgIF0pLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIihpbmkpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlLnVwZGF0ZVRva2Vuc1N1bW1hcnkoKVwiKTsgXG5cbiAgICAgICAgICAgIC8vIG1hcHBpbmcgb2YgaG93IG11Y2ggKGFtb3VudCBvZikgdG9rZW5zIGhhdmUgYmVlbiB0cmFkZWQgYWdyZWdhdGVkIGluIGFsbCBtYXJrZXRzXG4gICAgICAgICAgICB2YXIgYW1vdW50X21hcDp7W2tleTpzdHJpbmddOkFzc2V0REVYfSA9IHt9O1xuXG4gICAgICAgICAgICAvLyBhIGNhZGEgdG9rZW4gbGUgYXNpZ25vIHVuIHByaWNlIHF1ZSBzYWxlIGRlIHZlcmlmaWNhciBzdSBwcmljZSBlbiBlbCBtZXJjYWRvIHByaW5jaXBhbCBYWFgvVExPU1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnRva2Vucykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRva2Vuc1tpXS5vZmZjaGFpbikgY29udGludWU7IC8vIGRpc2NhcmQgdG9rZW5zIHRoYXQgYXJlIG5vdCBvbi1jaGFpblxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IHRoaXMudG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgIHZhciBxdWFudGl0eTpBc3NldERFWCA9IG5ldyBBc3NldERFWCgwLCB0b2tlbik7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqIGluIHRoaXMuX21hcmtldHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGouaW5kZXhPZihcIi5cIikgPT0gLTEpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGU6TWFya2V0ID0gdGhpcy5fbWFya2V0c1tqXTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eSA9IHF1YW50aXR5LnBsdXModGFibGUuc3VtbWFyeS5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eSA9IHF1YW50aXR5LnBsdXModGFibGUuc3VtbWFyeS52b2x1bWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmNvbW9kaXR5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wgJiYgdGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRoaXMudGVsb3Muc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4uc3VtbWFyeSAmJiB0b2tlbi5zdW1tYXJ5LnByaWNlLmFtb3VudC50b051bWJlcigpID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdG9rZW4uc3VtbWFyeTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4uc3VtbWFyeSA9IHRva2VuLnN1bW1hcnkgfHwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiB0YWJsZS5zdW1tYXJ5LnByaWNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfMjRoX2FnbzogdGFibGUuc3VtbWFyeS5wcmljZV8yNGhfYWdvLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lOiB0YWJsZS5zdW1tYXJ5LnZvbHVtZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmNlbnQ6IHRhYmxlLnN1bW1hcnkucGVyY2VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJjZW50X3N0cjogdGFibGUuc3VtbWFyeS5wZXJjZW50X3N0cixcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkgPSB0b2tlbi5zdW1tYXJ5IHx8IHtcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IG5ldyBBc3NldERFWCgwLCB0aGlzLnRlbG9zKSxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2VfMjRoX2FnbzogbmV3IEFzc2V0REVYKDAsIHRoaXMudGVsb3MpLFxuICAgICAgICAgICAgICAgICAgICB2b2x1bWU6IG5ldyBBc3NldERFWCgwLCB0aGlzLnRlbG9zKSxcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudDogMCxcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudF9zdHI6IFwiMCVcIixcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBhbW91bnRfbWFwW3Rva2VuLnN5bWJvbF0gPSBxdWFudGl0eTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy50ZWxvcy5zdW1tYXJ5ID0ge1xuICAgICAgICAgICAgICAgIHByaWNlOiBuZXcgQXNzZXRERVgoMSwgdGhpcy50ZWxvcyksXG4gICAgICAgICAgICAgICAgcHJpY2VfMjRoX2FnbzogbmV3IEFzc2V0REVYKDEsIHRoaXMudGVsb3MpLFxuICAgICAgICAgICAgICAgIHZvbHVtZTogbmV3IEFzc2V0REVYKC0xLCB0aGlzLnRlbG9zKSxcbiAgICAgICAgICAgICAgICBwZXJjZW50OiAwLFxuICAgICAgICAgICAgICAgIHBlcmNlbnRfc3RyOiBcIjAlXCJcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJhbW91bnRfbWFwOiBcIiwgYW1vdW50X21hcCk7XG5cblxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgT05FID0gbmV3IEJpZ051bWJlcigxKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnRva2Vucykge1xuICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IHRoaXMudG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5vZmZjaGFpbikgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKCF0b2tlbi5zdW1tYXJ5KSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4uc3ltYm9sID09IHRoaXMudGVsb3Muc3ltYm9sKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlRPS0VOOiAtLS0tLS0tLSBcIiwgdG9rZW4uc3ltYm9sLCB0b2tlbi5zdW1tYXJ5LnByaWNlLnN0ciwgdG9rZW4uc3VtbWFyeS5wcmljZV8yNGhfYWdvLnN0ciApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciB2b2x1bWUgPSBuZXcgQXNzZXRERVgoMCwgdGhpcy50ZWxvcyk7XG4gICAgICAgICAgICAgICAgdmFyIHByaWNlID0gbmV3IEFzc2V0REVYKDAsIHRoaXMudGVsb3MpO1xuICAgICAgICAgICAgICAgIHZhciBwcmljZV9pbml0ID0gbmV3IEFzc2V0REVYKDAsIHRoaXMudGVsb3MpO1xuICAgICAgICAgICAgICAgIHZhciB0b3RhbF9xdWFudGl0eSA9IGFtb3VudF9tYXBbdG9rZW4uc3ltYm9sXTtcblxuICAgICAgICAgICAgICAgIGlmICh0b3RhbF9xdWFudGl0eS50b051bWJlcigpID09IDApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgKHRva2VuLnN5bWJvbCA9PSBcIkFDT1JOXCIpIGNvbnNvbGUubG9nKFwiVE9LRU46IC0tLS0tLS0tIFwiLCB0b2tlbi5zeW1ib2wsIHRva2VuLnN1bW1hcnkucHJpY2Uuc3RyLCB0b2tlbi5zdW1tYXJ5LnByaWNlXzI0aF9hZ28uc3RyICk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiB0aGlzLl9tYXJrZXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqLmluZGV4T2YoXCIuXCIpID09IC0xKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlID0gdGhpcy5fbWFya2V0c1tqXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbmN5X3ByaWNlID0gdGFibGUuY3VycmVuY3kuc3ltYm9sID09IFwiVExPU1wiID8gT05FIDogdGFibGUuY3VycmVuY3kuc3VtbWFyeS5wcmljZS5hbW91bnQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW5jeV9wcmljZV8yNGhfYWdvID0gdGFibGUuY3VycmVuY3kuc3ltYm9sID09IFwiVExPU1wiID8gT05FIDogdGFibGUuY3VycmVuY3kuc3VtbWFyeS5wcmljZV8yNGhfYWdvLmFtb3VudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmNvbW9kaXR5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wgfHwgdGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBob3cgbXVjaCBxdWFudGl0eSBpcyBpbnZvbHZlZCBpbiB0aGlzIG1hcmtldFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHF1YW50aXR5ID0gbmV3IEFzc2V0REVYKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY29tb2RpdHkuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gdGFibGUuc3VtbWFyeS5hbW91bnQuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gdGFibGUuc3VtbWFyeS52b2x1bWUuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBpbmZsdWVuY2Utd2VpZ2h0IG9mIHRoaXMgbWFya2V0IG92ZXIgdGhlIHRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgd2VpZ2h0ID0gcXVhbnRpdHkuYW1vdW50LmRpdmlkZWRCeSh0b3RhbF9xdWFudGl0eS5hbW91bnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIHByaWNlIG9mIHRoaXMgdG9rZW4gaW4gdGhpcyBtYXJrZXQgKGV4cHJlc3NlZCBpbiBUTE9TKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlX2Ftb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfYW1vdW50ID0gdGFibGUuc3VtbWFyeS5wcmljZS5hbW91bnQubXVsdGlwbGllZEJ5KHRhYmxlLmN1cnJlbmN5LnN1bW1hcnkucHJpY2UuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2Ftb3VudCA9IHRhYmxlLnN1bW1hcnkuaW52ZXJzZS5hbW91bnQubXVsdGlwbGllZEJ5KHRhYmxlLmNvbW9kaXR5LnN1bW1hcnkucHJpY2UuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoaXMgbWFya2V0IHRva2VuIHByaWNlIG11bHRpcGxpZWQgYnkgdGhlIHdpZ2h0IG9mIHRoaXMgbWFya2V0IChwb25kZXJhdGVkIHByaWNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlX2kgPSBuZXcgQXNzZXRERVgocHJpY2VfYW1vdW50Lm11bHRpcGxpZWRCeSh3ZWlnaHQpLCB0aGlzLnRlbG9zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBwcmljZSBvZiB0aGlzIHRva2VuIGluIHRoaXMgbWFya2V0IDI0aCBhZ28gKGV4cHJlc3NlZCBpbiBUTE9TKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlX2luaXRfYW1vdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmNvbW9kaXR5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZV9pbml0X2Ftb3VudCA9IHRhYmxlLnN1bW1hcnkucHJpY2VfMjRoX2Fnby5hbW91bnQubXVsdGlwbGllZEJ5KHRhYmxlLmN1cnJlbmN5LnN1bW1hcnkucHJpY2VfMjRoX2Fnby5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfaW5pdF9hbW91bnQgPSB0YWJsZS5zdW1tYXJ5LmludmVyc2VfMjRoX2Fnby5hbW91bnQubXVsdGlwbGllZEJ5KHRhYmxlLmNvbW9kaXR5LnN1bW1hcnkucHJpY2VfMjRoX2Fnby5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhpcyBtYXJrZXQgdG9rZW4gcHJpY2UgMjRoIGFnbyBtdWx0aXBsaWVkIGJ5IHRoZSB3ZWlnaHQgb2YgdGhpcyBtYXJrZXQgKHBvbmRlcmF0ZWQgaW5pdF9wcmljZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmljZV9pbml0X2kgPSBuZXcgQXNzZXRERVgocHJpY2VfaW5pdF9hbW91bnQubXVsdGlwbGllZEJ5KHdlaWdodCksIHRoaXMudGVsb3MpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBob3cgbXVjaCB2b2x1bWUgaXMgaW52b2x2ZWQgaW4gdGhpcyBtYXJrZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2b2x1bWVfaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lX2kgPSB0YWJsZS5zdW1tYXJ5LnZvbHVtZS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lX2kgPSB0YWJsZS5zdW1tYXJ5LmFtb3VudC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGlzIG1hcmtldCBkb2VzIG5vdCBtZXN1cmUgdGhlIHZvbHVtZSBpbiBUTE9TLCB0aGVuIGNvbnZlcnQgcXVhbnRpdHkgdG8gVExPUyBieSBtdWx0aXBsaWVkIEJ5IHZvbHVtZSdzIHRva2VuIHByaWNlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodm9sdW1lX2kudG9rZW4uc3ltYm9sICE9IHRoaXMudGVsb3Muc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lX2kgPSBuZXcgQXNzZXRERVgocXVhbnRpdHkuYW1vdW50Lm11bHRpcGxpZWRCeShxdWFudGl0eS50b2tlbi5zdW1tYXJ5LnByaWNlLmFtb3VudCksIHRoaXMudGVsb3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlID0gcHJpY2UucGx1cyhuZXcgQXNzZXRERVgocHJpY2VfaSwgdGhpcy50ZWxvcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfaW5pdCA9IHByaWNlX2luaXQucGx1cyhuZXcgQXNzZXRERVgocHJpY2VfaW5pdF9pLCB0aGlzLnRlbG9zKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWUgPSB2b2x1bWUucGx1cyhuZXcgQXNzZXRERVgodm9sdW1lX2ksIHRoaXMudGVsb3MpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItaVwiLGksIHRhYmxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSB3ZWlnaHQ6XCIsIHdlaWdodC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSB0YWJsZS5zdW1tYXJ5LnByaWNlLnN0clwiLCB0YWJsZS5zdW1tYXJ5LnByaWNlLnN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gdGFibGUuc3VtbWFyeS5wcmljZS5hbW91bnQubXVsdGlwbGllZEJ5KHdlaWdodCkudG9OdW1iZXIoKVwiLCB0YWJsZS5zdW1tYXJ5LnByaWNlLmFtb3VudC5tdWx0aXBsaWVkQnkod2VpZ2h0KS50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSBjdXJyZW5jeV9wcmljZS50b051bWJlcigpXCIsIGN1cnJlbmN5X3ByaWNlLnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHByaWNlX2k6XCIsIHByaWNlX2kudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gcHJpY2UgLT5cIiwgcHJpY2Uuc3RyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSBjdXJyZW5jeV9wcmljZV8yNGhfYWdvOlwiLCBjdXJyZW5jeV9wcmljZV8yNGhfYWdvLnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHRhYmxlLnN1bW1hcnkucHJpY2VfMjRoX2FnbzpcIiwgdGFibGUuc3VtbWFyeS5wcmljZV8yNGhfYWdvLnN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gcHJpY2VfaW5pdF9pOlwiLCBwcmljZV9pbml0X2kudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gcHJpY2VfaW5pdCAtPlwiLCBwcmljZV9pbml0LnN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGRpZmYgPSBwcmljZS5taW51cyhwcmljZV9pbml0KTtcbiAgICAgICAgICAgICAgICB2YXIgcmF0aW86bnVtYmVyID0gMDtcbiAgICAgICAgICAgICAgICBpZiAocHJpY2VfaW5pdC5hbW91bnQudG9OdW1iZXIoKSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhdGlvID0gZGlmZi5hbW91bnQuZGl2aWRlZEJ5KHByaWNlX2luaXQuYW1vdW50KS50b051bWJlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudCA9IE1hdGguZmxvb3IocmF0aW8gKiAxMDAwMCkgLyAxMDA7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRfc3RyID0gKGlzTmFOKHBlcmNlbnQpID8gMCA6IHBlcmNlbnQpICsgXCIlXCI7XG5cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInByaWNlXCIsIHByaWNlLnN0cik7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwcmljZV8yNGhfYWdvXCIsIHByaWNlX2luaXQuc3RyKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInZvbHVtZVwiLCB2b2x1bWUuc3RyKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInBlcmNlbnRcIiwgcGVyY2VudCk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwZXJjZW50X3N0clwiLCBwZXJjZW50X3N0cik7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJyYXRpb1wiLCByYXRpbyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJkaWZmXCIsIGRpZmYuc3RyKTtcblxuICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkucHJpY2UgPSBwcmljZTtcbiAgICAgICAgICAgICAgICB0b2tlbi5zdW1tYXJ5LnByaWNlXzI0aF9hZ28gPSBwcmljZV9pbml0O1xuICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkucGVyY2VudCA9IHBlcmNlbnQ7XG4gICAgICAgICAgICAgICAgdG9rZW4uc3VtbWFyeS5wZXJjZW50X3N0ciA9IHBlcmNlbnRfc3RyO1xuICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkudm9sdW1lID0gdm9sdW1lO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKGVuZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgdGhpcy5zZXRUb2tlblN1bW1hcnkoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaFRva2VucyhleHRlbmRlZDogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWUuZmV0Y2hUb2tlbnMoKVwiKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcInRva2Vuc1wiKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICB0b2tlbnM6IDxUb2tlbkRFWFtdPnJlc3VsdC5yb3dzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gZGF0YS50b2tlbnMpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnRva2Vuc1tpXS5zY29wZSA9IGRhdGEudG9rZW5zW2ldLnN5bWJvbC50b0xvd2VyQ2FzZSgpICsgXCIudGxvc1wiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNvcnRUb2tlbnMoKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKGluaSkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJlc29ydFRva2VucygpXCIpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRoaXMudG9rZW5zWzBdXCIsIHRoaXMudG9rZW5zWzBdLnN1bW1hcnkpO1xuICAgICAgICB0aGlzLnRva2Vucy5zb3J0KChhOlRva2VuREVYLCBiOlRva2VuREVYKSA9PiB7XG4gICAgICAgICAgICAvLyBwdXNoIG9mZmNoYWluIHRva2VucyB0byB0aGUgZW5kIG9mIHRoZSB0b2tlbiBsaXN0XG4gICAgICAgICAgICBpZiAoYS5vZmZjaGFpbiB8fCAhYS52ZXJpZmllZCkgcmV0dXJuIDE7XG4gICAgICAgICAgICBpZiAoYi5vZmZjaGFpbiB8fCAhYi52ZXJpZmllZCkgcmV0dXJuIC0xO1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIiAtLS0gXCIsIGEuc3ltYm9sLCBcIi1cIiwgYi5zeW1ib2wsIFwiIC0tLSBcIik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIiAgICAgXCIsIGEuc3VtbWFyeSA/IGEuc3VtbWFyeS52b2x1bWUuc3RyIDogXCIwXCIsIFwiLVwiLCBiLnN1bW1hcnkgPyBiLnN1bW1hcnkudm9sdW1lLnN0ciA6IFwiMFwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGFfdm9sID0gYS5zdW1tYXJ5ID8gYS5zdW1tYXJ5LnZvbHVtZSA6IG5ldyBBc3NldERFWCgpO1xuICAgICAgICAgICAgdmFyIGJfdm9sID0gYi5zdW1tYXJ5ID8gYi5zdW1tYXJ5LnZvbHVtZSA6IG5ldyBBc3NldERFWCgpO1xuXG4gICAgICAgICAgICBpZihhX3ZvbC5hbW91bnQuaXNHcmVhdGVyVGhhbihiX3ZvbC5hbW91bnQpKSByZXR1cm4gLTE7XG4gICAgICAgICAgICBpZihhX3ZvbC5hbW91bnQuaXNMZXNzVGhhbihiX3ZvbC5hbW91bnQpKSByZXR1cm4gMTtcblxuICAgICAgICAgICAgaWYoYS5hcHBuYW1lIDwgYi5hcHBuYW1lKSByZXR1cm4gLTE7XG4gICAgICAgICAgICBpZihhLmFwcG5hbWUgPiBiLmFwcG5hbWUpIHJldHVybiAxO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0pOyBcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJlc29ydFRva2VucygpXCIsIHRoaXMudG9rZW5zKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCIoZW5kKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG5cbiAgICAgICAgdGhpcy5vblRva2Vuc1JlYWR5Lm5leHQodGhpcy50b2tlbnMpOyAgICAgICAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNvcnRUb3BNYXJrZXRzKCkge1xuICAgICAgICB0aGlzLndhaXRUb2tlblN1bW1hcnkudGhlbihfID0+IHtcblxuICAgICAgICAgICAgdGhpcy50b3BtYXJrZXRzID0gW107XG4gICAgICAgICAgICB2YXIgaW52ZXJzZTogc3RyaW5nO1xuICAgICAgICAgICAgdmFyIG1hcmtldDpNYXJrZXQ7XG4gICAgICAgICAgICBmb3IgKHZhciBzY29wZSBpbiB0aGlzLl9tYXJrZXRzKSB7XG4gICAgICAgICAgICAgICAgbWFya2V0ID0gdGhpcy5fbWFya2V0c1tzY29wZV07XG4gICAgICAgICAgICAgICAgaWYgKG1hcmtldC5kaXJlY3QgPj0gbWFya2V0LmludmVyc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BtYXJrZXRzLnB1c2gobWFya2V0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnZlcnNlID0gdGhpcy5pbnZlcnNlU2NvcGUoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXQgPSB0aGlzLm1hcmtldChpbnZlcnNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BtYXJrZXRzLnB1c2gobWFya2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudG9wbWFya2V0cy5zb3J0KChhOk1hcmtldCwgYjpNYXJrZXQpID0+IHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgYV92b2wgPSBhLnN1bW1hcnkgPyBhLnN1bW1hcnkudm9sdW1lIDogbmV3IEFzc2V0REVYKCk7XG4gICAgICAgICAgICAgICAgdmFyIGJfdm9sID0gYi5zdW1tYXJ5ID8gYi5zdW1tYXJ5LnZvbHVtZSA6IG5ldyBBc3NldERFWCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGFfdm9sLnRva2VuICE9IHRoaXMudGVsb3MpIHtcbiAgICAgICAgICAgICAgICAgICAgYV92b2wgPSBuZXcgQXNzZXRERVgoYV92b2wuYW1vdW50Lm11bHRpcGxpZWRCeShhX3ZvbC50b2tlbi5zdW1tYXJ5LnByaWNlLmFtb3VudCksdGhpcy50ZWxvcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiX3ZvbC50b2tlbiAhPSB0aGlzLnRlbG9zKSB7XG4gICAgICAgICAgICAgICAgICAgIGJfdm9sID0gbmV3IEFzc2V0REVYKGJfdm9sLmFtb3VudC5tdWx0aXBsaWVkQnkoYl92b2wudG9rZW4uc3VtbWFyeS5wcmljZS5hbW91bnQpLHRoaXMudGVsb3MpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGJfdm9sLnRva2VuID09IHRoaXMudGVsb3MsIFwiRVJST1I6IHZvbHVtZSBtaXNzY2FsY3VsYXRlZFwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChhX3ZvbC50b2tlbiA9PSB0aGlzLnRlbG9zLCBcIkVSUk9SOiB2b2x1bWUgbWlzc2NhbGN1bGF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICBpZihhX3ZvbC5hbW91bnQuaXNHcmVhdGVyVGhhbihiX3ZvbC5hbW91bnQpKSByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgaWYoYV92b2wuYW1vdW50LmlzTGVzc1RoYW4oYl92b2wuYW1vdW50KSkgcmV0dXJuIDE7XG5cbiAgICAgICAgICAgICAgICBpZihhLmN1cnJlbmN5ID09IHRoaXMudGVsb3MgJiYgYi5jdXJyZW5jeSAhPSB0aGlzLnRlbG9zKSByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgaWYoYi5jdXJyZW5jeSA9PSB0aGlzLnRlbG9zICYmIGEuY3VycmVuY3kgIT0gdGhpcy50ZWxvcykgcmV0dXJuIDE7XG5cbiAgICAgICAgICAgICAgICBpZihhLmNvbW9kaXR5LmFwcG5hbWUgPCBiLmNvbW9kaXR5LmFwcG5hbWUpIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICBpZihhLmNvbW9kaXR5LmFwcG5hbWUgPiBiLmNvbW9kaXR5LmFwcG5hbWUpIHJldHVybiAxO1xuICAgIFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMub25Ub3BNYXJrZXRzUmVhZHkubmV4dCh0aGlzLnRvcG1hcmtldHMpOyBcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cblxufVxuXG5cblxuIl19