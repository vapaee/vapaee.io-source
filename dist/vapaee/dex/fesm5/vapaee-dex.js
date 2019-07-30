import { __extends, __awaiter, __generator } from 'tslib';
import { Token, Asset, VapaeeScatter } from '@vapaee/scatter';
import BigNumber from 'bignumber.js';
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
var TokenDEX = /** @class */ (function (_super) {
    __extends(TokenDEX, _super);
    function TokenDEX(obj) {
        if (obj === void 0) { obj = null; }
        var _this = _super.call(this, obj) || this;
        if (typeof obj == "object") {
            delete obj.symbol;
            delete obj.precision;
            delete obj.contract;
            Object.assign(_this, obj);
        }
        _this.toString();
        return _this;
    }
    return TokenDEX;
}(Token));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var AssetDEX = /** @class */ (function (_super) {
    __extends(AssetDEX, _super);
    function AssetDEX(a, b) {
        if (a === void 0) { a = null; }
        if (b === void 0) { b = null; }
        var _this = _super.call(this, a, b) || this;
        if (a instanceof AssetDEX) {
            _this.amount = a.amount;
            _this.token = b;
            return _this;
        }
        if (!!b && b['getTokenNow']) {
            _this.parseDex(a, b);
        }
        return _this;
    }
    /**
     * @return {?}
     */
    AssetDEX.prototype.clone = /**
     * @return {?}
     */
    function () {
        return new AssetDEX(this.amount, this.token);
    };
    /**
     * @param {?} b
     * @return {?}
     */
    AssetDEX.prototype.plus = /**
     * @param {?} b
     * @return {?}
     */
    function (b) {
        console.assert(!!b, "ERROR: b is not an Asset", b, this.str);
        console.assert(b.token.symbol == this.token.symbol, "ERROR: trying to sum assets with different tokens: " + this.str + " and " + b.str);
        /** @type {?} */
        var amount = this.amount.plus(b.amount);
        return new AssetDEX(amount, this.token);
    };
    /**
     * @param {?} b
     * @return {?}
     */
    AssetDEX.prototype.minus = /**
     * @param {?} b
     * @return {?}
     */
    function (b) {
        console.assert(!!b, "ERROR: b is not an Asset", b, this.str);
        console.assert(b.token.symbol == this.token.symbol, "ERROR: trying to substract assets with different tokens: " + this.str + " and " + b.str);
        /** @type {?} */
        var amount = this.amount.minus(b.amount);
        return new AssetDEX(amount, this.token);
    };
    /**
     * @param {?} text
     * @param {?} dex
     * @return {?}
     */
    AssetDEX.prototype.parseDex = /**
     * @param {?} text
     * @param {?} dex
     * @return {?}
     */
    function (text, dex) {
        if (text == "")
            return;
        /** @type {?} */
        var sym = text.split(" ")[1];
        this.token = dex.getTokenNow(sym);
        /** @type {?} */
        var amount_str = text.split(" ")[0];
        this.amount = new BigNumber(amount_str);
    };
    /**
     * @param {?=} decimals
     * @return {?}
     */
    AssetDEX.prototype.toString = /**
     * @param {?=} decimals
     * @return {?}
     */
    function (decimals) {
        if (decimals === void 0) { decimals = -1; }
        if (!this.token)
            return "0.0000";
        return this.valueToString(decimals) + " " + this.token.symbol.toUpperCase();
    };
    /**
     * @param {?} token
     * @return {?}
     */
    AssetDEX.prototype.inverse = /**
     * @param {?} token
     * @return {?}
     */
    function (token) {
        /** @type {?} */
        var result = new BigNumber(1).dividedBy(this.amount);
        /** @type {?} */
        var asset = new AssetDEX(result, token);
        return asset;
    };
    return AssetDEX;
}(Asset));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
        this.onMarketReady = new Subject();
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
            _this.tokens = data.tokens;
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
            if (this.scatter.logged && !this.scatter.account) ;
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
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.scatter.queryAccountData(name).catch(function (_) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
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
        }).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        }).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
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
        }).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        }).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        return this._markets[scope] || this.reverse(scope);
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _token;
            return __generator(this, function (_a) {
                console.log("VapaeeDEX.getSomeFreeFakeTokens()");
                _token = symbol;
                this.feed.setLoading("freefake-" + _token || "token", true);
                return [2 /*return*/, this.waitTokenStats.then(function (_) {
                        /** @type {?} */
                        var token = null;
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log("VapaeeDEX.getDeposits()");
                this.feed.setLoading("deposits", true);
                return [2 /*return*/, this.waitTokensLoaded.then(function (_) { return __awaiter(_this, void 0, void 0, function () {
                        var deposits, result, i;
                        return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log("VapaeeDEX.getBalances()");
                this.feed.setLoading("balances", true);
                return [2 /*return*/, this.waitTokensLoaded.then(function (_) { return __awaiter(_this, void 0, void 0, function () {
                        var _balances;
                        return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.feed.setLoading("thisorders", true);
                return [2 /*return*/, this.waitTokensLoaded.then(function (_) { return __awaiter(_this, void 0, void 0, function () {
                        var result, _a, _b, _i, i, id, gotit, j, res;
                        return __generator(this, function (_c) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log("VapaeeDEX.getUserOrders()");
                this.feed.setLoading("userorders", true);
                return [2 /*return*/, this.waitTokensLoaded.then(function (_) { return __awaiter(_this, void 0, void 0, function () {
                        var userorders, list, map, i, ids, table, orders;
                        return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var pagesize, pages;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var pagesize, first, id, page;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var chrono_key;
            return __generator(this, function (_a) {
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
                        this.getTableSummary(comodity, currency, true).then(function (_) { return _this.feed.setMarck(chrono_key, "getTableSummary()"); }),
                        this.getOrderSummary().then(function (_) { return _this.feed.setMarck(chrono_key, "getOrderSummary()"); }),
                    ]).then(function (r) {
                        _this._reverse = {};
                        _this.resortTokens();
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var scope, aux, result;
            return __generator(this, function (_a) {
                scope = this.canonicalScope(this.getScopeFor(comodity, currency));
                aux = null;
                result = null;
                this.feed.setLoading("history." + scope, true);
                aux = this.waitOrderSummary.then(function (_) { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    var pages;
                    return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var scope, aux, result;
            return __generator(this, function (_a) {
                console.log("VapaeeDEX.getBlockHistory()", comodity.symbol, page, pagesize);
                scope = this.canonicalScope(this.getScopeFor(comodity, currency));
                aux = null;
                result = null;
                this.feed.setLoading("block-history." + scope, true);
                aux = this.waitOrderSummary.then(function (_) { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    var pages, promises, i, promise;
                    return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var scope, canonical, reverse, aux, result;
            return __generator(this, function (_a) {
                scope = this.getScopeFor(comodity, currency);
                canonical = this.canonicalScope(scope);
                reverse = this.inverseScope(canonical);
                aux = null;
                result = null;
                this.feed.setLoading("sellorders", true);
                aux = this.waitTokensLoaded.then(function (_) { return __awaiter(_this, void 0, void 0, function () {
                    var orders, sell, list, row, i, order, sum, sumtelos, j, order_row;
                    return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var scope, canonical, reverse, aux, result;
            return __generator(this, function (_a) {
                scope = this.getScopeFor(comodity, currency);
                canonical = this.canonicalScope(scope);
                reverse = this.inverseScope(canonical);
                aux = null;
                result = null;
                this.feed.setLoading("buyorders", true);
                aux = this.waitTokensLoaded.then(function (_) { return __awaiter(_this, void 0, void 0, function () {
                    var orders, buy, list, row, i, order, sum, sumtelos, j, order_row;
                    return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var tables, i, scope, canonical, comodity, currency;
            return __generator(this, function (_a) {
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
                            comodity = scope.split(".")[0].toUpperCase();
                            currency = scope.split(".")[1].toUpperCase();
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
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} force
     * @return {?}
     */
    VapaeeDEX.prototype.getTableSummary = /**
     * @param {?} comodity
     * @param {?} currency
     * @param {?=} force
     * @return {?}
     */
    function (comodity, currency, force) {
        if (force === void 0) { force = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var scope, canonical, inverse, ZERO_COMODITY, ZERO_CURRENCY, aux, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scope = this.getScopeFor(comodity, currency);
                        canonical = this.canonicalScope(scope);
                        inverse = this.inverseScope(canonical);
                        ZERO_COMODITY = "0.00000000 " + comodity.symbol;
                        ZERO_CURRENCY = "0.00000000 " + currency.symbol;
                        this.feed.setLoading("summary." + canonical, true);
                        this.feed.setLoading("summary." + inverse, true);
                        aux = null;
                        result = null;
                        aux = this.waitTokensLoaded.then(function (_) { return __awaiter(_this, void 0, void 0, function () {
                            var summary, now, now_sec, now_hour, start_hour, price, inverse, crude, last_hh, i, hh, last_24h, volume, amount, price_asset, inverse_asset, max_price, min_price, max_inverse, min_inverse, price_fst, inverse_fst, i, current, current_date, nuevo, s_price, s_inverse, s_volume, s_amount, vol, amo, last_price, diff, ratio, percent, last_inverse, idiff, ipercent;
                            return __generator(this, function (_a) {
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
                                                s_price = (scope == canonical) ? nuevo.price : nuevo.inverse;
                                                s_inverse = (scope == canonical) ? nuevo.inverse : nuevo.price;
                                                s_volume = (scope == canonical) ? nuevo.volume : nuevo.amount;
                                                s_amount = (scope == canonical) ? nuevo.amount : nuevo.volume;
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.waitOrderSummary.then(function (_) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        var promises, i, p;
                        return __generator(this, function (_a) {
                            promises = [];
                            for (i in this._markets) {
                                if (i.indexOf(".") == -1)
                                    continue;
                                p = this.getTableSummary(this._markets[i].comodity, this._markets[i].currency, true);
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
    VapaeeDEX.prototype.auxAssertScope = /**
     * @param {?} scope
     * @return {?}
     */
    function (scope) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.waitTokensLoaded.then(function (_) { return __awaiter(_this, void 0, void 0, function () {
                        var contracts, balances, i, contract, _a, _b, _i, contract, result, i;
                        return __generator(this, function (_c) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var id, pageEvents, i, id_i, event;
            return __generator(this, function (_a) {
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
            _this.resortTokens();
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
        var _this = this;
        if (extended === void 0) { extended = true; }
        console.log("Vapaee.fetchTokens()");
        return this.contract.getTable("tokens").then(function (result) {
            /** @type {?} */
            var data = {
                tokens: /** @type {?} */ (result.rows)
            };
            for (var i in data.tokens) {
                data.tokens[i].scope = data.tokens[i].symbol.toLowerCase() + ".tlos";
                if (data.tokens[i].symbol == "TLOS") {
                    _this.telos = data.tokens[i];
                }
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
    /** @nocollapse */ VapaeeDEX.ngInjectableDef = defineInjectable({ factory: function VapaeeDEX_Factory() { return new VapaeeDEX(inject(VapaeeScatter), inject(CookieService$1), inject(DatePipe)); }, token: VapaeeDEX, providedIn: "root" });
    return VapaeeDEX;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var VapaeeDexModule = /** @class */ (function () {
    function VapaeeDexModule() {
    }
    VapaeeDexModule.decorators = [
        { type: NgModule, args: [{
                    imports: [],
                    declarations: [],
                    providers: [VapaeeDEX],
                    exports: []
                },] },
    ];
    return VapaeeDexModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { VapaeeDEX, VapaeeDexModule, TokenDEX, AssetDEX };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFwYWVlLWRleC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQHZhcGFlZS9kZXgvbGliL3Rva2VuLWRleC5jbGFzcy50cyIsIm5nOi8vQHZhcGFlZS9kZXgvbGliL2Fzc2V0LWRleC5jbGFzcy50cyIsIm5nOi8vQHZhcGFlZS9kZXgvbGliL2RleC5zZXJ2aWNlLnRzIiwibmc6Ly9AdmFwYWVlL2RleC9saWIvZGV4Lm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUb2tlbiB9IGZyb20gJ0B2YXBhZWUvc2NhdHRlcic7XG5pbXBvcnQgeyBBc3NldERFWCB9IGZyb20gXCIuL2Fzc2V0LWRleC5jbGFzc1wiO1xuXG4vKlxuZXhwb3J0IGludGVyZmFjZSBUb2tlbiB7XG4gICAgc3ltYm9sOiBzdHJpbmcsXG4gICAgcHJlY2lzaW9uPzogbnVtYmVyLFxuICAgIGNvbnRyYWN0Pzogc3RyaW5nLFxuICAgIGFwcG5hbWU/OiBzdHJpbmcsXG4gICAgd2Vic2l0ZT86IHN0cmluZyxcbiAgICBsb2dvPzogc3RyaW5nLFxuICAgIGxvZ29sZz86IHN0cmluZyxcbiAgICB2ZXJpZmllZD86IGJvb2xlYW4sXG4gICAgZmFrZT86IGJvb2xlYW4sXG4gICAgb2ZmY2hhaW4/OiBib29sZWFuLFxuICAgIHNjb3BlPzogc3RyaW5nLFxuICAgIHN0YXQ/OiB7XG4gICAgICAgIHN1cHBseTogc3RyaW5nLFxuICAgICAgICBtYXhfc3VwcGx5OiBzdHJpbmcsXG4gICAgICAgIGlzc3Vlcj86IHN0cmluZyxcbiAgICAgICAgb3duZXI/OiBzdHJpbmcsXG4gICAgICAgIGlzc3VlcnM/OiBzdHJpbmdbXVxuICAgIH0sXG4gICAgc3VtbWFyeT86IHtcbiAgICAgICAgdm9sdW1lOiBBc3NldCxcbiAgICAgICAgcHJpY2U6IEFzc2V0LFxuICAgICAgICBwcmljZV8yNGhfYWdvOiBBc3NldCxcbiAgICAgICAgcGVyY2VudD86bnVtYmVyLFxuICAgICAgICBwZXJjZW50X3N0cj86c3RyaW5nXG4gICAgfVxuXG59XG4qL1xuZXhwb3J0IGNsYXNzIFRva2VuREVYIGV4dGVuZHMgVG9rZW4ge1xuICAgIC8vIHByaXZhdGUgX3N0cjogc3RyaW5nO1xuICAgIC8vIHByaXZhdGUgX3N5bWJvbDogc3RyaW5nO1xuICAgIC8vIHByaXZhdGUgX3ByZWNpc2lvbjogbnVtYmVyO1xuICAgIC8vIHByaXZhdGUgX2NvbnRyYWN0OiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgYXBwbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyB3ZWJzaXRlOiBzdHJpbmc7XG4gICAgcHVibGljIGxvZ286IHN0cmluZztcbiAgICBwdWJsaWMgbG9nb2xnOiBzdHJpbmc7XG4gICAgcHVibGljIHZlcmlmaWVkOiBib29sZWFuO1xuICAgIHB1YmxpYyBmYWtlOiBib29sZWFuO1xuICAgIHB1YmxpYyBvZmZjaGFpbjogYm9vbGVhbjtcbiAgICBwdWJsaWMgc2NvcGU6IHN0cmluZztcblxuICAgIHN0YXQ/OiB7XG4gICAgICAgIHN1cHBseTogc3RyaW5nLFxuICAgICAgICBtYXhfc3VwcGx5OiBzdHJpbmcsXG4gICAgICAgIGlzc3Vlcj86IHN0cmluZyxcbiAgICAgICAgb3duZXI/OiBzdHJpbmcsXG4gICAgICAgIGlzc3VlcnM/OiBzdHJpbmdbXVxuICAgIH07XG5cbiAgICBzdW1tYXJ5Pzoge1xuICAgICAgICB2b2x1bWU6IEFzc2V0REVYLFxuICAgICAgICBwcmljZTogQXNzZXRERVgsXG4gICAgICAgIHByaWNlXzI0aF9hZ286IEFzc2V0REVYLFxuICAgICAgICBwZXJjZW50PzpudW1iZXIsXG4gICAgICAgIHBlcmNlbnRfc3RyPzpzdHJpbmdcbiAgICB9ICAgIFxuXG4gICAgY29uc3RydWN0b3Iob2JqOmFueSA9IG51bGwpIHtcbiAgICAgICAgc3VwZXIob2JqKTtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmogPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgZGVsZXRlIG9iai5zeW1ib2w7XG4gICAgICAgICAgICBkZWxldGUgb2JqLnByZWNpc2lvbjtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmouY29udHJhY3Q7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50b1N0cmluZygpO1xuICAgIH1cblxuXG59IiwiaW1wb3J0IEJpZ051bWJlciBmcm9tICdiaWdudW1iZXIuanMnO1xuaW1wb3J0IHsgVG9rZW5ERVggfSBmcm9tICcuL3Rva2VuLWRleC5jbGFzcyc7XG5pbXBvcnQgeyBBc3NldCB9IGZyb20gJ0B2YXBhZWUvc2NhdHRlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVZhcGFlZURFWCB7XG4gICAgZ2V0VG9rZW5Ob3coc3ltYm9sOnN0cmluZyk6IFRva2VuREVYO1xufVxuXG5leHBvcnQgY2xhc3MgQXNzZXRERVggZXh0ZW5kcyBBc3NldCB7XG4gICAgYW1vdW50OkJpZ051bWJlcjtcbiAgICB0b2tlbjpUb2tlbkRFWDtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihhOiBhbnkgPSBudWxsLCBiOiBhbnkgPSBudWxsKSB7XG4gICAgICAgIHN1cGVyKGEsYik7XG5cbiAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBBc3NldERFWCkge1xuICAgICAgICAgICAgdGhpcy5hbW91bnQgPSBhLmFtb3VudDtcbiAgICAgICAgICAgIHRoaXMudG9rZW4gPSBiO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEhYiAmJiBiWydnZXRUb2tlbk5vdyddKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlRGV4KGEsYik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNsb25lKCk6IEFzc2V0REVYIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBc3NldERFWCh0aGlzLmFtb3VudCwgdGhpcy50b2tlbik7XG4gICAgfVxuXG4gICAgcGx1cyhiOkFzc2V0REVYKSB7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KCEhYiwgXCJFUlJPUjogYiBpcyBub3QgYW4gQXNzZXRcIiwgYiwgdGhpcy5zdHIpO1xuICAgICAgICBjb25zb2xlLmFzc2VydChiLnRva2VuLnN5bWJvbCA9PSB0aGlzLnRva2VuLnN5bWJvbCwgXCJFUlJPUjogdHJ5aW5nIHRvIHN1bSBhc3NldHMgd2l0aCBkaWZmZXJlbnQgdG9rZW5zOiBcIiArIHRoaXMuc3RyICsgXCIgYW5kIFwiICsgYi5zdHIpO1xuICAgICAgICB2YXIgYW1vdW50ID0gdGhpcy5hbW91bnQucGx1cyhiLmFtb3VudCk7XG4gICAgICAgIHJldHVybiBuZXcgQXNzZXRERVgoYW1vdW50LCB0aGlzLnRva2VuKTtcbiAgICB9XG5cbiAgICBtaW51cyhiOkFzc2V0REVYKSB7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KCEhYiwgXCJFUlJPUjogYiBpcyBub3QgYW4gQXNzZXRcIiwgYiwgdGhpcy5zdHIpO1xuICAgICAgICBjb25zb2xlLmFzc2VydChiLnRva2VuLnN5bWJvbCA9PSB0aGlzLnRva2VuLnN5bWJvbCwgXCJFUlJPUjogdHJ5aW5nIHRvIHN1YnN0cmFjdCBhc3NldHMgd2l0aCBkaWZmZXJlbnQgdG9rZW5zOiBcIiArIHRoaXMuc3RyICsgXCIgYW5kIFwiICsgYi5zdHIpO1xuICAgICAgICB2YXIgYW1vdW50ID0gdGhpcy5hbW91bnQubWludXMoYi5hbW91bnQpO1xuICAgICAgICByZXR1cm4gbmV3IEFzc2V0REVYKGFtb3VudCwgdGhpcy50b2tlbik7XG4gICAgfSAgICBcblxuICAgIHBhcnNlRGV4KHRleHQ6IHN0cmluZywgZGV4OiBJVmFwYWVlREVYKSB7XG4gICAgICAgIGlmICh0ZXh0ID09IFwiXCIpIHJldHVybjtcbiAgICAgICAgdmFyIHN5bSA9IHRleHQuc3BsaXQoXCIgXCIpWzFdO1xuICAgICAgICB0aGlzLnRva2VuID0gZGV4LmdldFRva2VuTm93KHN5bSk7XG4gICAgICAgIHZhciBhbW91bnRfc3RyID0gdGV4dC5zcGxpdChcIiBcIilbMF07XG4gICAgICAgIHRoaXMuYW1vdW50ID0gbmV3IEJpZ051bWJlcihhbW91bnRfc3RyKTtcbiAgICB9XG5cbiAgICBcbiAgICB0b1N0cmluZyhkZWNpbWFsczpudW1iZXIgPSAtMSk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy50b2tlbikgcmV0dXJuIFwiMC4wMDAwXCI7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlVG9TdHJpbmcoZGVjaW1hbHMpICsgXCIgXCIgKyB0aGlzLnRva2VuLnN5bWJvbC50b1VwcGVyQ2FzZSgpO1xuICAgIH1cblxuICAgIGludmVyc2UodG9rZW46IFRva2VuREVYKTogQXNzZXRERVgge1xuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEJpZ051bWJlcigxKS5kaXZpZGVkQnkodGhpcy5hbW91bnQpO1xuICAgICAgICB2YXIgYXNzZXQgPSAgbmV3IEFzc2V0REVYKHJlc3VsdCwgdG9rZW4pO1xuICAgICAgICByZXR1cm4gYXNzZXQ7XG4gICAgfVxufSIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCBCaWdOdW1iZXIgZnJvbSBcImJpZ251bWJlci5qc1wiO1xuaW1wb3J0IHsgQ29va2llU2VydmljZSB9IGZyb20gJ25neC1jb29raWUtc2VydmljZSc7XG5pbXBvcnQgeyBEYXRlUGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBUb2tlbkRFWCB9IGZyb20gJy4vdG9rZW4tZGV4LmNsYXNzJztcbmltcG9ydCB7IEFzc2V0REVYIH0gZnJvbSAnLi9hc3NldC1kZXguY2xhc3MnO1xuaW1wb3J0IHsgRmVlZGJhY2sgfSBmcm9tICdAdmFwYWVlL2ZlZWRiYWNrJztcbmltcG9ydCB7IFZhcGFlZVNjYXR0ZXIsIEFjY291bnQsIEFjY291bnREYXRhLCBTbWFydENvbnRyYWN0LCBUYWJsZVJlc3VsdCwgVGFibGVQYXJhbXMgfSBmcm9tICdAdmFwYWVlL3NjYXR0ZXInO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogXCJyb290XCJcbn0pXG5leHBvcnQgY2xhc3MgVmFwYWVlREVYIHtcblxuICAgIHB1YmxpYyBsb2dpblN0YXRlOiBzdHJpbmc7XG4gICAgLypcbiAgICBwdWJsaWMgbG9naW5TdGF0ZTogc3RyaW5nO1xuICAgIC0gJ25vLXNjYXR0ZXInOiBTY2F0dGVyIG5vIGRldGVjdGVkXG4gICAgLSAnbm8tbG9nZ2VkJzogU2NhdHRlciBkZXRlY3RlZCBidXQgdXNlciBpcyBub3QgbG9nZ2VkXG4gICAgLSAnYWNjb3VudC1vayc6IHVzZXIgbG9nZ2VyIHdpdGggc2NhdHRlclxuICAgICovXG4gICAgcHJpdmF0ZSBfbWFya2V0czogTWFya2V0TWFwO1xuICAgIHByaXZhdGUgX3JldmVyc2U6IE1hcmtldE1hcDtcblxuICAgIHB1YmxpYyB6ZXJvX3RlbG9zOiBBc3NldERFWDtcbiAgICBwdWJsaWMgdGVsb3M6IFRva2VuREVYO1xuICAgIHB1YmxpYyB0b2tlbnM6IFRva2VuREVYW107XG4gICAgcHVibGljIGNvbnRyYWN0OiBTbWFydENvbnRyYWN0O1xuICAgIHB1YmxpYyBmZWVkOiBGZWVkYmFjaztcbiAgICBwdWJsaWMgY3VycmVudDogQWNjb3VudDtcbiAgICBwdWJsaWMgbGFzdF9sb2dnZWQ6IHN0cmluZztcbiAgICBwdWJsaWMgY29udHJhY3RfbmFtZTogc3RyaW5nOyAgIFxuICAgIHB1YmxpYyBkZXBvc2l0czogQXNzZXRERVhbXTtcbiAgICBwdWJsaWMgYmFsYW5jZXM6IEFzc2V0REVYW107XG4gICAgcHVibGljIHVzZXJvcmRlcnM6IFVzZXJPcmRlcnNNYXA7XG4gICAgcHVibGljIG9uTG9nZ2VkQWNjb3VudENoYW5nZTpTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvbkN1cnJlbnRBY2NvdW50Q2hhbmdlOlN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIG9uSGlzdG9yeUNoYW5nZTpTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvbk1hcmtldFN1bW1hcnk6U3ViamVjdDxNYXJrZXRTdW1tYXJ5PiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgLy8gcHVibGljIG9uQmxvY2tsaXN0Q2hhbmdlOlN1YmplY3Q8YW55W11bXT4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvblRva2Vuc1JlYWR5OlN1YmplY3Q8VG9rZW5ERVhbXT4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvbk1hcmtldFJlYWR5OlN1YmplY3Q8VG9rZW5ERVhbXT4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvblRyYWRlVXBkYXRlZDpTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHZhcGFlZXRva2VuczpzdHJpbmcgPSBcInZhcGFlZXRva2Vuc1wiO1xuXG4gICAgYWN0aXZpdHlQYWdlc2l6ZTpudW1iZXIgPSAxMDtcbiAgICBcbiAgICBhY3Rpdml0eTp7XG4gICAgICAgIHRvdGFsOm51bWJlcjtcbiAgICAgICAgZXZlbnRzOntbaWQ6c3RyaW5nXTpFdmVudExvZ307XG4gICAgICAgIGxpc3Q6RXZlbnRMb2dbXTtcbiAgICB9O1xuICAgIFxuICAgIHByaXZhdGUgc2V0T3JkZXJTdW1tYXJ5OiBGdW5jdGlvbjtcbiAgICBwdWJsaWMgd2FpdE9yZGVyU3VtbWFyeTogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRPcmRlclN1bW1hcnkgPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgcHJpdmF0ZSBzZXRUb2tlblN0YXRzOiBGdW5jdGlvbjtcbiAgICBwdWJsaWMgd2FpdFRva2VuU3RhdHM6IFByb21pc2U8YW55PiA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0VG9rZW5TdGF0cyA9IHJlc29sdmU7XG4gICAgfSk7XG5cbiAgICBwcml2YXRlIHNldE1hcmtldFN1bW1hcnk6IEZ1bmN0aW9uO1xuICAgIHB1YmxpYyB3YWl0TWFya2V0U3VtbWFyeTogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRNYXJrZXRTdW1tYXJ5ID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIHByaXZhdGUgc2V0VG9rZW5TdW1tYXJ5OiBGdW5jdGlvbjtcbiAgICBwdWJsaWMgd2FpdFRva2VuU3VtbWFyeTogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRUb2tlblN1bW1hcnkgPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgcHJpdmF0ZSBzZXRUb2tlbnNMb2FkZWQ6IEZ1bmN0aW9uO1xuICAgIHB1YmxpYyB3YWl0VG9rZW5zTG9hZGVkOiBQcm9taXNlPGFueT4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0aGlzLnNldFRva2Vuc0xvYWRlZCA9IHJlc29sdmU7XG4gICAgfSk7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgc2NhdHRlcjogVmFwYWVlU2NhdHRlcixcbiAgICAgICAgcHJpdmF0ZSBjb29raWVzOiBDb29raWVTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIGRhdGVQaXBlOiBEYXRlUGlwZVxuICAgICkge1xuICAgICAgICB0aGlzLl9tYXJrZXRzID0ge307XG4gICAgICAgIHRoaXMuX3JldmVyc2UgPSB7fTtcbiAgICAgICAgdGhpcy5hY3Rpdml0eSA9IHt0b3RhbDowLCBldmVudHM6e30sIGxpc3Q6W119O1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLmRlZmF1bHQ7XG4gICAgICAgIHRoaXMuY29udHJhY3RfbmFtZSA9IHRoaXMudmFwYWVldG9rZW5zO1xuICAgICAgICB0aGlzLmNvbnRyYWN0ID0gdGhpcy5zY2F0dGVyLmdldFNtYXJ0Q29udHJhY3QodGhpcy5jb250cmFjdF9uYW1lKTtcbiAgICAgICAgdGhpcy5mZWVkID0gbmV3IEZlZWRiYWNrKCk7XG4gICAgICAgIHRoaXMuc2NhdHRlci5vbkxvZ2dnZWRTdGF0ZUNoYW5nZS5zdWJzY3JpYmUodGhpcy5vbkxvZ2dlZENoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy51cGRhdGVMb2dTdGF0ZSgpO1xuICAgICAgICB0aGlzLmZldGNoVG9rZW5zKCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgIHRoaXMudG9rZW5zID0gZGF0YS50b2tlbnM7XG4gICAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbkRFWCh7XG4gICAgICAgICAgICAgICAgYXBwbmFtZTogXCJWaWl0YXNwaGVyZVwiLFxuICAgICAgICAgICAgICAgIGNvbnRyYWN0OiBcInZpaXRhc3BoZXJlMVwiLFxuICAgICAgICAgICAgICAgIGxvZ286IFwiL2Fzc2V0cy9sb2dvcy92aWl0YXNwaGVyZS5wbmdcIixcbiAgICAgICAgICAgICAgICBsb2dvbGc6IFwiL2Fzc2V0cy9sb2dvcy92aWl0YXNwaGVyZS1sZy5wbmdcIixcbiAgICAgICAgICAgICAgICBwcmVjaXNpb246IDQsXG4gICAgICAgICAgICAgICAgc2NvcGU6IFwidmlpdGN0LnRsb3NcIixcbiAgICAgICAgICAgICAgICBzeW1ib2w6IFwiVklJVEFcIixcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgd2Vic2l0ZTogXCJodHRwczovL3ZpaXRhc3BoZXJlLmNvbVwiXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbkRFWCh7XG4gICAgICAgICAgICAgICAgYXBwbmFtZTogXCJWaWl0YXNwaGVyZVwiLFxuICAgICAgICAgICAgICAgIGNvbnRyYWN0OiBcInZpaXRhc3BoZXJlMVwiLFxuICAgICAgICAgICAgICAgIGxvZ286IFwiL2Fzc2V0cy9sb2dvcy92aWl0YXNwaGVyZS5wbmdcIixcbiAgICAgICAgICAgICAgICBsb2dvbGc6IFwiL2Fzc2V0cy9sb2dvcy92aWl0YXNwaGVyZS1sZy5wbmdcIixcbiAgICAgICAgICAgICAgICBwcmVjaXNpb246IDAsXG4gICAgICAgICAgICAgICAgc2NvcGU6IFwidmlpdGN0LnRsb3NcIixcbiAgICAgICAgICAgICAgICBzeW1ib2w6IFwiVklJQ1RcIixcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgd2Vic2l0ZTogXCJodHRwczovL3ZpaXRhc3BoZXJlLmNvbVwiXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB0aGlzLnplcm9fdGVsb3MgPSBuZXcgQXNzZXRERVgoXCIwLjAwMDAgVExPU1wiLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VG9rZW5zTG9hZGVkKCk7XG4gICAgICAgICAgICB0aGlzLmZldGNoVG9rZW5zU3RhdHMoKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0T3JkZXJTdW1tYXJ5KCk7XG4gICAgICAgICAgICB0aGlzLmdldEFsbFRhYmxlc1N1bWFyaWVzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKF8gPT4ge1xuICAgICAgICAvLyB9KVxuXG5cbiAgICAgICAgdmFyIHRpbWVyO1xuICAgICAgICB0aGlzLm9uTWFya2V0U3VtbWFyeS5zdWJzY3JpYmUoc3VtbWFyeSA9PiB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVG9rZW5zU3VtbWFyeSgpO1xuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgfSk7ICAgIFxuXG5cblxuICAgIH1cblxuICAgIC8vIGdldHRlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBkZWZhdWx0KCk6IEFjY291bnQge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLmRlZmF1bHQ7XG4gICAgfVxuXG4gICAgZ2V0IGxvZ2dlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NhdHRlci5sb2dnZWQgJiYgIXRoaXMuc2NhdHRlci5hY2NvdW50KSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIldBUk5JTkchISFcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnNjYXR0ZXIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5zY2F0dGVyLnVzZXJuYW1lKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCIqKioqKioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgKi9cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLmxvZ2dlZCA/XG4gICAgICAgICAgICAodGhpcy5zY2F0dGVyLmFjY291bnQgPyB0aGlzLnNjYXR0ZXIuYWNjb3VudC5uYW1lIDogdGhpcy5zY2F0dGVyLmRlZmF1bHQubmFtZSkgOlxuICAgICAgICAgICAgbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgYWNjb3VudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhdHRlci5sb2dnZWQgPyBcbiAgICAgICAgdGhpcy5zY2F0dGVyLmFjY291bnQgOlxuICAgICAgICB0aGlzLnNjYXR0ZXIuZGVmYXVsdDtcbiAgICB9XG5cbiAgICAvLyAtLSBVc2VyIExvZyBTdGF0ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsb2dpbigpIHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dpblwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2ctc3RhdGVcIiwgdHJ1ZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmxvZ2luKCkgdGhpcy5mZWVkLmxvYWRpbmcoJ2xvZy1zdGF0ZScpXCIsIHRoaXMuZmVlZC5sb2FkaW5nKCdsb2ctc3RhdGUnKSk7XG4gICAgICAgIHRoaXMubG9nb3V0KCk7XG4gICAgICAgIHRoaXMudXBkYXRlTG9nU3RhdGUoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgubG9naW4oKSB0aGlzLmZlZWQubG9hZGluZygnbG9nLXN0YXRlJylcIiwgdGhpcy5mZWVkLmxvYWRpbmcoJ2xvZy1zdGF0ZScpKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dvdXRcIiwgZmFsc2UpO1xuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLmxvZ2luKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxvZ1N0YXRlKCk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ2luXCIsIGZhbHNlKTtcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ2luXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dvdXRcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc2NhdHRlci5sb2dvdXQoKTtcbiAgICB9XG5cbiAgICBvbkxvZ291dCgpIHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dvdXRcIiwgZmFsc2UpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5vbkxvZ291dCgpXCIpO1xuICAgICAgICB0aGlzLnJlc2V0Q3VycmVudEFjY291bnQodGhpcy5kZWZhdWx0Lm5hbWUpO1xuICAgICAgICB0aGlzLnVwZGF0ZUxvZ1N0YXRlKCk7XG4gICAgICAgIHRoaXMub25Mb2dnZWRBY2NvdW50Q2hhbmdlLm5leHQodGhpcy5sb2dnZWQpO1xuICAgICAgICB0aGlzLmNvb2tpZXMuZGVsZXRlKFwibG9naW5cIik7XG4gICAgICAgIHNldFRpbWVvdXQoXyAgPT4geyB0aGlzLmxhc3RfbG9nZ2VkID0gdGhpcy5sb2dnZWQ7IH0sIDQwMCk7XG4gICAgfVxuICAgIFxuICAgIG9uTG9naW4obmFtZTpzdHJpbmcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgub25Mb2dpbigpXCIsIG5hbWUpO1xuICAgICAgICB0aGlzLnJlc2V0Q3VycmVudEFjY291bnQobmFtZSk7XG4gICAgICAgIHRoaXMuZ2V0RGVwb3NpdHMoKTtcbiAgICAgICAgdGhpcy5nZXRCYWxhbmNlcygpO1xuICAgICAgICB0aGlzLnVwZGF0ZUxvZ1N0YXRlKCk7XG4gICAgICAgIHRoaXMuZ2V0VXNlck9yZGVycygpO1xuICAgICAgICB0aGlzLm9uTG9nZ2VkQWNjb3VudENoYW5nZS5uZXh0KHRoaXMubG9nZ2VkKTtcbiAgICAgICAgdGhpcy5sYXN0X2xvZ2dlZCA9IHRoaXMubG9nZ2VkO1xuICAgICAgICB0aGlzLmNvb2tpZXMuc2V0KFwibG9naW5cIiwgdGhpcy5sb2dnZWQpO1xuICAgIH1cblxuICAgIG9uTG9nZ2VkQ2hhbmdlKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5vbkxvZ2dlZENoYW5nZSgpXCIpO1xuICAgICAgICBpZiAodGhpcy5zY2F0dGVyLmxvZ2dlZCkge1xuICAgICAgICAgICAgdGhpcy5vbkxvZ2luKHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vbkxvZ291dCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgcmVzZXRDdXJyZW50QWNjb3VudChwcm9maWxlOnN0cmluZykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5yZXNldEN1cnJlbnRBY2NvdW50KClcIiwgdGhpcy5jdXJyZW50Lm5hbWUsIFwiLT5cIiwgcHJvZmlsZSk7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnQubmFtZSAhPSBwcm9maWxlICYmICh0aGlzLmN1cnJlbnQubmFtZSA9PSB0aGlzLmxhc3RfbG9nZ2VkIHx8IHByb2ZpbGUgIT0gXCJndWVzdFwiKSkge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJhY2NvdW50XCIsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5kZWZhdWx0O1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Lm5hbWUgPSBwcm9maWxlO1xuICAgICAgICAgICAgaWYgKHByb2ZpbGUgIT0gXCJndWVzdFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50LmRhdGEgPSBhd2FpdCB0aGlzLmdldEFjY291bnREYXRhKHRoaXMuY3VycmVudC5uYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJXQVJOSU5HISEhIGN1cnJlbnQgaXMgZ3Vlc3RcIiwgW3Byb2ZpbGUsIHRoaXMuYWNjb3VudCwgdGhpcy5jdXJyZW50XSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGhpcy5zY29wZXMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuYmFsYW5jZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMudXNlcm9yZGVycyA9IHt9OyAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLm9uQ3VycmVudEFjY291bnRDaGFuZ2UubmV4dCh0aGlzLmN1cnJlbnQubmFtZSkgISEhISEhXCIpO1xuICAgICAgICAgICAgdGhpcy5vbkN1cnJlbnRBY2NvdW50Q2hhbmdlLm5leHQodGhpcy5jdXJyZW50Lm5hbWUpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50VXNlcigpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJhY2NvdW50XCIsIGZhbHNlKTtcbiAgICAgICAgfSAgICAgICBcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUxvZ1N0YXRlKCkge1xuICAgICAgICB0aGlzLmxvZ2luU3RhdGUgPSBcIm5vLXNjYXR0ZXJcIjtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2ctc3RhdGVcIiwgdHJ1ZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnVwZGF0ZUxvZ1N0YXRlKCkgXCIsIHRoaXMubG9naW5TdGF0ZSwgdGhpcy5mZWVkLmxvYWRpbmcoXCJsb2ctc3RhdGVcIikpO1xuICAgICAgICB0aGlzLnNjYXR0ZXIud2FpdENvbm5lY3RlZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9naW5TdGF0ZSA9IFwibm8tbG9nZ2VkXCI7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC51cGRhdGVMb2dTdGF0ZSgpICAgXCIsIHRoaXMubG9naW5TdGF0ZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5zY2F0dGVyLmxvZ2dlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9naW5TdGF0ZSA9IFwiYWNjb3VudC1va1wiO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnVwZGF0ZUxvZ1N0YXRlKCkgICAgIFwiLCB0aGlzLmxvZ2luU3RhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2ctc3RhdGVcIiwgZmFsc2UpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgudXBkYXRlTG9nU3RhdGUoKSBcIiwgdGhpcy5sb2dpblN0YXRlLCB0aGlzLmZlZWQubG9hZGluZyhcImxvZy1zdGF0ZVwiKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciB0aW1lcjI7XG4gICAgICAgIHZhciB0aW1lcjEgPSBzZXRJbnRlcnZhbChfID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zY2F0dGVyLmZlZWQubG9hZGluZyhcImNvbm5lY3RcIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZy1zdGF0ZVwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcjEpO1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMjAwKTtcblxuICAgICAgICB0aW1lcjIgPSBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcjEpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2ctc3RhdGVcIiwgZmFsc2UpO1xuICAgICAgICB9LCA2MDAwKTtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRBY2NvdW50RGF0YShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPEFjY291bnREYXRhPiAge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLnF1ZXJ5QWNjb3VudERhdGEobmFtZSkuY2F0Y2goYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWZhdWx0LmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFjdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjcmVhdGVPcmRlcih0eXBlOnN0cmluZywgYW1vdW50OkFzc2V0REVYLCBwcmljZTpBc3NldERFWCkge1xuICAgICAgICAvLyBcImFsaWNlXCIsIFwiYnV5XCIsIFwiMi41MDAwMDAwMCBDTlRcIiwgXCIwLjQwMDAwMDAwIFRMT1NcIlxuICAgICAgICAvLyBuYW1lIG93bmVyLCBuYW1lIHR5cGUsIGNvbnN0IGFzc2V0ICYgdG90YWwsIGNvbnN0IGFzc2V0ICYgcHJpY2VcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJvcmRlci1cIit0eXBlLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZXhjZWN1dGUoXCJvcmRlclwiLCB7XG4gICAgICAgICAgICBvd25lcjogIHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgdG90YWw6IGFtb3VudC50b1N0cmluZyg4KSxcbiAgICAgICAgICAgIHByaWNlOiBwcmljZS50b1N0cmluZyg4KVxuICAgICAgICB9KS50aGVuKGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRyYWRlKGFtb3VudC50b2tlbiwgcHJpY2UudG9rZW4pO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJvcmRlci1cIit0eXBlLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwib3JkZXItXCIrdHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNhbmNlbE9yZGVyKHR5cGU6c3RyaW5nLCBjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgsIG9yZGVyczpudW1iZXJbXSkge1xuICAgICAgICAvLyAnW1wiYWxpY2VcIiwgXCJidXlcIiwgXCJDTlRcIiwgXCJUTE9TXCIsIFsxLDBdXSdcbiAgICAgICAgLy8gbmFtZSBvd25lciwgbmFtZSB0eXBlLCBjb25zdCBhc3NldCAmIHRvdGFsLCBjb25zdCBhc3NldCAmIHByaWNlXG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY2FuY2VsLVwiK3R5cGUsIHRydWUpO1xuICAgICAgICBmb3IgKHZhciBpIGluIG9yZGVycykgeyB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImNhbmNlbC1cIit0eXBlK1wiLVwiK29yZGVyc1tpXSwgdHJ1ZSk7IH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZXhjZWN1dGUoXCJjYW5jZWxcIiwge1xuICAgICAgICAgICAgb3duZXI6ICB0aGlzLnNjYXR0ZXIuYWNjb3VudC5uYW1lLFxuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIGNvbW9kaXR5OiBjb21vZGl0eS5zeW1ib2wsXG4gICAgICAgICAgICBjdXJyZW5jeTogY3VycmVuY3kuc3ltYm9sLFxuICAgICAgICAgICAgb3JkZXJzOiBvcmRlcnNcbiAgICAgICAgfSkudGhlbihhc3luYyByZXN1bHQgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUcmFkZShjb21vZGl0eSwgY3VycmVuY3kpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBvcmRlcnMpIHsgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZStcIi1cIitvcmRlcnNbaV0sIGZhbHNlKTsgfSAgICBcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBvcmRlcnMpIHsgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZStcIi1cIitvcmRlcnNbaV0sIGZhbHNlKTsgfSAgICBcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXBvc2l0KHF1YW50aXR5OkFzc2V0REVYKSB7XG4gICAgICAgIC8vIG5hbWUgb3duZXIsIG5hbWUgdHlwZSwgY29uc3QgYXNzZXQgJiB0b3RhbCwgY29uc3QgYXNzZXQgJiBwcmljZVxuICAgICAgICB2YXIgY29udHJhY3QgPSB0aGlzLnNjYXR0ZXIuZ2V0U21hcnRDb250cmFjdChxdWFudGl0eS50b2tlbi5jb250cmFjdCk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRFcnJvcihcImRlcG9zaXRcIiwgbnVsbCk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdFwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0LVwiK3F1YW50aXR5LnRva2VuLnN5bWJvbC50b0xvd2VyQ2FzZSgpLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIGNvbnRyYWN0LmV4Y2VjdXRlKFwidHJhbnNmZXJcIiwge1xuICAgICAgICAgICAgZnJvbTogIHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICB0bzogdGhpcy52YXBhZWV0b2tlbnMsXG4gICAgICAgICAgICBxdWFudGl0eTogcXVhbnRpdHkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIG1lbW86IFwiZGVwb3NpdFwiXG4gICAgICAgIH0pLnRoZW4oYXN5bmMgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdFwiLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImRlcG9zaXQtXCIrcXVhbnRpdHkudG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCksIGZhbHNlKTsgICAgXG4gICAgICAgICAgICAvKmF3YWl0Ki8gdGhpcy5nZXREZXBvc2l0cygpO1xuICAgICAgICAgICAgLyphd2FpdCovIHRoaXMuZ2V0QmFsYW5jZXMoKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdC1cIitxdWFudGl0eS50b2tlbi5zeW1ib2wudG9Mb3dlckNhc2UoKSwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldEVycm9yKFwiZGVwb3NpdFwiLCB0eXBlb2YgZSA9PSBcInN0cmluZ1wiID8gZSA6IEpTT04uc3RyaW5naWZ5KGUsbnVsbCw0KSk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSk7XG4gICAgfSAgICBcblxuICAgIHdpdGhkcmF3KHF1YW50aXR5OkFzc2V0REVYKSB7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRFcnJvcihcIndpdGhkcmF3XCIsIG51bGwpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3XCIsIHRydWUpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3LVwiK3F1YW50aXR5LnRva2VuLnN5bWJvbC50b0xvd2VyQ2FzZSgpLCB0cnVlKTsgICBcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZXhjZWN1dGUoXCJ3aXRoZHJhd1wiLCB7XG4gICAgICAgICAgICBvd25lcjogIHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICBxdWFudGl0eTogcXVhbnRpdHkudG9TdHJpbmcoKVxuICAgICAgICB9KS50aGVuKGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwid2l0aGRyYXctXCIrcXVhbnRpdHkudG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCksIGZhbHNlKTtcbiAgICAgICAgICAgIC8qYXdhaXQqLyB0aGlzLmdldERlcG9zaXRzKCk7XG4gICAgICAgICAgICAvKmF3YWl0Ki8gdGhpcy5nZXRCYWxhbmNlcygpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwid2l0aGRyYXctXCIrcXVhbnRpdHkudG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCksIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRFcnJvcihcIndpdGhkcmF3XCIsIHR5cGVvZiBlID09IFwic3RyaW5nXCIgPyBlIDogSlNPTi5zdHJpbmdpZnkoZSxudWxsLDQpKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFRva2VucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGFkZE9mZkNoYWluVG9rZW4ob2ZmY2hhaW46IFRva2VuREVYKSB7XG4gICAgICAgIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKF8gPT4ge1xuICAgICAgICAgICAgdGhpcy50b2tlbnMucHVzaChuZXcgVG9rZW5ERVgoe1xuICAgICAgICAgICAgICAgIHN5bWJvbDogb2ZmY2hhaW4uc3ltYm9sLFxuICAgICAgICAgICAgICAgIHByZWNpc2lvbjogb2ZmY2hhaW4ucHJlY2lzaW9uIHx8IDQsXG4gICAgICAgICAgICAgICAgY29udHJhY3Q6IFwibm9jb250cmFjdFwiLFxuICAgICAgICAgICAgICAgIGFwcG5hbWU6IG9mZmNoYWluLmFwcG5hbWUsXG4gICAgICAgICAgICAgICAgd2Vic2l0ZTogXCJcIixcbiAgICAgICAgICAgICAgICBsb2dvOlwiXCIsXG4gICAgICAgICAgICAgICAgbG9nb2xnOiBcIlwiLFxuICAgICAgICAgICAgICAgIHNjb3BlOiBcIlwiLFxuICAgICAgICAgICAgICAgIHN0YXQ6IG51bGwsXG4gICAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG9mZmNoYWluOiB0cnVlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTY29wZXMgLyBUYWJsZXMgXG4gICAgcHVibGljIGhhc1Njb3BlcygpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fbWFya2V0cztcbiAgICB9XG5cbiAgICBwdWJsaWMgbWFya2V0KHNjb3BlOnN0cmluZyk6IE1hcmtldCB7XG4gICAgICAgIGlmICh0aGlzLl9tYXJrZXRzW3Njb3BlXSkgcmV0dXJuIHRoaXMuX21hcmtldHNbc2NvcGVdOyAgICAgICAgLy8gLS0tPiBkaXJlY3RcbiAgICAgICAgdmFyIHJldmVyc2UgPSB0aGlzLmludmVyc2VTY29wZShzY29wZSk7XG4gICAgICAgIGlmICh0aGlzLl9yZXZlcnNlW3JldmVyc2VdKSByZXR1cm4gdGhpcy5fcmV2ZXJzZVtyZXZlcnNlXTsgIC8vIC0tLT4gcmV2ZXJzZVxuICAgICAgICBpZiAoIXRoaXMuX21hcmtldHNbcmV2ZXJzZV0pIHJldHVybiBudWxsOyAgICAgICAgICAgICAgICAgICAgLy8gLS0tPiB0YWJsZSBkb2VzIG5vdCBleGlzdCAob3IgaGFzIG5vdCBiZWVuIGxvYWRlZCB5ZXQpXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXJrZXRzW3Njb3BlXSB8fCB0aGlzLnJldmVyc2Uoc2NvcGUpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0YWJsZShzY29wZTpzdHJpbmcpOiBNYXJrZXQge1xuICAgICAgICAvL2NvbnNvbGUuZXJyb3IoXCJ0YWJsZShcIitzY29wZStcIikgREVQUkVDQVRFRFwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFya2V0KHNjb3BlKTtcbiAgICB9ICAgIFxuXG4gICAgcHJpdmF0ZSByZXZlcnNlKHNjb3BlOnN0cmluZyk6IE1hcmtldCB7XG4gICAgICAgIHZhciBjYW5vbmljYWwgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgdmFyIHJldmVyc2Vfc2NvcGUgPSB0aGlzLmludmVyc2VTY29wZShjYW5vbmljYWwpO1xuICAgICAgICBjb25zb2xlLmFzc2VydChjYW5vbmljYWwgIT0gcmV2ZXJzZV9zY29wZSwgXCJFUlJPUjogXCIsIGNhbm9uaWNhbCwgcmV2ZXJzZV9zY29wZSk7XG4gICAgICAgIHZhciByZXZlcnNlX3RhYmxlOk1hcmtldCA9IHRoaXMuX3JldmVyc2VbcmV2ZXJzZV9zY29wZV07XG4gICAgICAgIGlmICghcmV2ZXJzZV90YWJsZSAmJiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0pIHtcbiAgICAgICAgICAgIHRoaXMuX3JldmVyc2VbcmV2ZXJzZV9zY29wZV0gPSB0aGlzLmNyZWF0ZVJldmVyc2VUYWJsZUZvcihyZXZlcnNlX3Njb3BlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fcmV2ZXJzZVtyZXZlcnNlX3Njb3BlXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWFya2V0Rm9yKGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCk6IE1hcmtldCB7XG4gICAgICAgIHZhciBzY29wZSA9IHRoaXMuZ2V0U2NvcGVGb3IoY29tb2RpdHksIGN1cnJlbmN5KTtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFibGUoc2NvcGUpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0YWJsZUZvcihjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgpOiBNYXJrZXQge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwidGFibGVGb3IoKVwiLGNvbW9kaXR5LnN5bWJvbCxjdXJyZW5jeS5zeW1ib2wsXCIgREVQUkVDQVRFRFwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFya2V0Rm9yKGNvbW9kaXR5LCBjdXJyZW5jeSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZVJldmVyc2VUYWJsZUZvcihzY29wZTpzdHJpbmcpOiBNYXJrZXQge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiLCBzY29wZSk7XG4gICAgICAgIHZhciBjYW5vbmljYWwgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgdmFyIHJldmVyc2Vfc2NvcGUgPSB0aGlzLmludmVyc2VTY29wZShjYW5vbmljYWwpO1xuICAgICAgICB2YXIgdGFibGU6TWFya2V0ID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdO1xuXG4gICAgICAgIHZhciBpbnZlcnNlX2hpc3Rvcnk6SGlzdG9yeVR4W10gPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpIGluIHRhYmxlLmhpc3RvcnkpIHtcbiAgICAgICAgICAgIHZhciBoVHg6SGlzdG9yeVR4ID0ge1xuICAgICAgICAgICAgICAgIGlkOiB0YWJsZS5oaXN0b3J5W2ldLmlkLFxuICAgICAgICAgICAgICAgIHN0cjogXCJcIixcbiAgICAgICAgICAgICAgICBwcmljZTogdGFibGUuaGlzdG9yeVtpXS5pbnZlcnNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgaW52ZXJzZTogdGFibGUuaGlzdG9yeVtpXS5wcmljZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgIGFtb3VudDogdGFibGUuaGlzdG9yeVtpXS5wYXltZW50LmNsb25lKCksXG4gICAgICAgICAgICAgICAgcGF5bWVudDogdGFibGUuaGlzdG9yeVtpXS5hbW91bnQuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICBidXllcjogdGFibGUuaGlzdG9yeVtpXS5zZWxsZXIsXG4gICAgICAgICAgICAgICAgc2VsbGVyOiB0YWJsZS5oaXN0b3J5W2ldLmJ1eWVyLFxuICAgICAgICAgICAgICAgIGJ1eWZlZTogdGFibGUuaGlzdG9yeVtpXS5zZWxsZmVlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgc2VsbGZlZTogdGFibGUuaGlzdG9yeVtpXS5idXlmZWUuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICBkYXRlOiB0YWJsZS5oaXN0b3J5W2ldLmRhdGUsXG4gICAgICAgICAgICAgICAgaXNidXk6ICF0YWJsZS5oaXN0b3J5W2ldLmlzYnV5LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGhUeC5zdHIgPSBoVHgucHJpY2Uuc3RyICsgXCIgXCIgKyBoVHguYW1vdW50LnN0cjtcbiAgICAgICAgICAgIGludmVyc2VfaGlzdG9yeS5wdXNoKGhUeCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgXG4gICAgICAgIHZhciBpbnZlcnNlX29yZGVyczpUb2tlbk9yZGVycyA9IHtcbiAgICAgICAgICAgIGJ1eTogW10sIHNlbGw6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yICh2YXIgdHlwZSBpbiB7YnV5OlwiYnV5XCIsIHNlbGw6XCJzZWxsXCJ9KSB7XG4gICAgICAgICAgICB2YXIgcm93X29yZGVyczpPcmRlcltdO1xuICAgICAgICAgICAgdmFyIHJvd19vcmRlcjpPcmRlcjtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0YWJsZS5vcmRlcnNbdHlwZV0pIHtcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gdGFibGUub3JkZXJzW3R5cGVdW2ldO1xuXG4gICAgICAgICAgICAgICAgcm93X29yZGVycyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGo9MDsgajxyb3cub3JkZXJzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd19vcmRlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcG9zaXQ6IHJvdy5vcmRlcnNbal0uZGVwb3NpdC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJvdy5vcmRlcnNbal0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiByb3cub3JkZXJzW2pdLnByaWNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogcm93Lm9yZGVyc1tqXS5pbnZlcnNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcjogcm93Lm9yZGVyc1tqXS5vd25lcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbG9zOiByb3cub3JkZXJzW2pdLnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IHJvdy5vcmRlcnNbal0udGVsb3NcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByb3dfb3JkZXJzLnB1c2gocm93X29yZGVyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgbmV3cm93Ok9yZGVyUm93ID0ge1xuICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiByb3cucHJpY2UuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiByb3dfb3JkZXJzLFxuICAgICAgICAgICAgICAgICAgICBvd25lcnM6IHJvdy5vd25lcnMsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlOiByb3cuaW52ZXJzZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICBzdHI6IHJvdy5pbnZlcnNlLnN0cixcbiAgICAgICAgICAgICAgICAgICAgc3VtOiByb3cuc3VtdGVsb3MuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgc3VtdGVsb3M6IHJvdy5zdW0uY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgdGVsb3M6IHJvdy50b3RhbC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogcm93LnRlbG9zLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgIC8vIGFtb3VudDogcm93LnN1bXRlbG9zLnRvdGFsKCksIC8vIDwtLSBleHRyYVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaW52ZXJzZV9vcmRlcnNbdHlwZV0ucHVzaChuZXdyb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJldmVyc2U6TWFya2V0ID0ge1xuICAgICAgICAgICAgc2NvcGU6IHJldmVyc2Vfc2NvcGUsXG4gICAgICAgICAgICBjb21vZGl0eTogdGFibGUuY3VycmVuY3ksXG4gICAgICAgICAgICBjdXJyZW5jeTogdGFibGUuY29tb2RpdHksXG4gICAgICAgICAgICBibG9jazogdGFibGUuYmxvY2ssXG4gICAgICAgICAgICBibG9ja2xpc3Q6IHRhYmxlLnJldmVyc2VibG9ja3MsXG4gICAgICAgICAgICByZXZlcnNlYmxvY2tzOiB0YWJsZS5ibG9ja2xpc3QsXG4gICAgICAgICAgICBibG9ja2xldmVsczogdGFibGUucmV2ZXJzZWxldmVscyxcbiAgICAgICAgICAgIHJldmVyc2VsZXZlbHM6IHRhYmxlLmJsb2NrbGV2ZWxzLFxuICAgICAgICAgICAgYmxvY2tzOiB0YWJsZS5ibG9ja3MsXG4gICAgICAgICAgICBkZWFsczogdGFibGUuZGVhbHMsXG4gICAgICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgICAgICBzZWxsOiB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOnRhYmxlLmhlYWRlci5idXkudG90YWwuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOnRhYmxlLmhlYWRlci5idXkub3JkZXJzXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBidXk6IHtcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6dGFibGUuaGVhZGVyLnNlbGwudG90YWwuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOnRhYmxlLmhlYWRlci5zZWxsLm9yZGVyc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoaXN0b3J5OiBpbnZlcnNlX2hpc3RvcnksXG4gICAgICAgICAgICBvcmRlcnM6IHtcbiAgICAgICAgICAgICAgICBzZWxsOiBpbnZlcnNlX29yZGVycy5idXksICAvLyA8PC0tIGVzdG8gZnVuY2lvbmEgYXPDg8KtIGNvbW8gZXN0w4PCoT9cbiAgICAgICAgICAgICAgICBidXk6IGludmVyc2Vfb3JkZXJzLnNlbGwgICAvLyA8PC0tIGVzdG8gZnVuY2lvbmEgYXPDg8KtIGNvbW8gZXN0w4PCoT9cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdW1tYXJ5OiB7XG4gICAgICAgICAgICAgICAgc2NvcGU6IHRoaXMuaW52ZXJzZVNjb3BlKHRhYmxlLnN1bW1hcnkuc2NvcGUpLFxuICAgICAgICAgICAgICAgIHByaWNlOiB0YWJsZS5zdW1tYXJ5LmludmVyc2UsXG4gICAgICAgICAgICAgICAgcHJpY2VfMjRoX2FnbzogdGFibGUuc3VtbWFyeS5pbnZlcnNlXzI0aF9hZ28sXG4gICAgICAgICAgICAgICAgaW52ZXJzZTogdGFibGUuc3VtbWFyeS5wcmljZSxcbiAgICAgICAgICAgICAgICBpbnZlcnNlXzI0aF9hZ286IHRhYmxlLnN1bW1hcnkucHJpY2VfMjRoX2FnbyxcbiAgICAgICAgICAgICAgICBtYXhfaW52ZXJzZTogdGFibGUuc3VtbWFyeS5tYXhfcHJpY2UsXG4gICAgICAgICAgICAgICAgbWF4X3ByaWNlOiB0YWJsZS5zdW1tYXJ5Lm1heF9pbnZlcnNlLFxuICAgICAgICAgICAgICAgIG1pbl9pbnZlcnNlOiB0YWJsZS5zdW1tYXJ5Lm1pbl9wcmljZSxcbiAgICAgICAgICAgICAgICBtaW5fcHJpY2U6IHRhYmxlLnN1bW1hcnkubWluX2ludmVyc2UsXG4gICAgICAgICAgICAgICAgcmVjb3JkczogdGFibGUuc3VtbWFyeS5yZWNvcmRzLFxuICAgICAgICAgICAgICAgIHZvbHVtZTogdGFibGUuc3VtbWFyeS5hbW91bnQsXG4gICAgICAgICAgICAgICAgYW1vdW50OiB0YWJsZS5zdW1tYXJ5LnZvbHVtZSxcbiAgICAgICAgICAgICAgICBwZXJjZW50OiB0YWJsZS5zdW1tYXJ5LmlwZXJjZW50LFxuICAgICAgICAgICAgICAgIGlwZXJjZW50OiB0YWJsZS5zdW1tYXJ5LnBlcmNlbnQsXG4gICAgICAgICAgICAgICAgcGVyY2VudF9zdHI6IHRhYmxlLnN1bW1hcnkuaXBlcmNlbnRfc3RyLFxuICAgICAgICAgICAgICAgIGlwZXJjZW50X3N0cjogdGFibGUuc3VtbWFyeS5wZXJjZW50X3N0cixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eDogdGFibGUudHhcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV2ZXJzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0U2NvcGVGb3IoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYKSB7XG4gICAgICAgIGlmICghY29tb2RpdHkgfHwgIWN1cnJlbmN5KSByZXR1cm4gXCJcIjtcbiAgICAgICAgcmV0dXJuIGNvbW9kaXR5LnN5bWJvbC50b0xvd2VyQ2FzZSgpICsgXCIuXCIgKyBjdXJyZW5jeS5zeW1ib2wudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW52ZXJzZVNjb3BlKHNjb3BlOnN0cmluZykge1xuICAgICAgICBpZiAoIXNjb3BlKSByZXR1cm4gc2NvcGU7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KHR5cGVvZiBzY29wZSA9PVwic3RyaW5nXCIsIFwiRVJST1I6IHN0cmluZyBzY29wZSBleHBlY3RlZCwgZ290IFwiLCB0eXBlb2Ygc2NvcGUsIHNjb3BlKTtcbiAgICAgICAgdmFyIHBhcnRzID0gc2NvcGUuc3BsaXQoXCIuXCIpO1xuICAgICAgICBjb25zb2xlLmFzc2VydChwYXJ0cy5sZW5ndGggPT0gMiwgXCJFUlJPUjogc2NvcGUgZm9ybWF0IGV4cGVjdGVkIGlzIHh4eC55eXksIGdvdDogXCIsIHR5cGVvZiBzY29wZSwgc2NvcGUpO1xuICAgICAgICB2YXIgaW52ZXJzZSA9IHBhcnRzWzFdICsgXCIuXCIgKyBwYXJ0c1swXTtcbiAgICAgICAgcmV0dXJuIGludmVyc2U7XG4gICAgfVxuXG4gICAgcHVibGljIGNhbm9uaWNhbFNjb3BlKHNjb3BlOnN0cmluZykge1xuICAgICAgICBpZiAoIXNjb3BlKSByZXR1cm4gc2NvcGU7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KHR5cGVvZiBzY29wZSA9PVwic3RyaW5nXCIsIFwiRVJST1I6IHN0cmluZyBzY29wZSBleHBlY3RlZCwgZ290IFwiLCB0eXBlb2Ygc2NvcGUsIHNjb3BlKTtcbiAgICAgICAgdmFyIHBhcnRzID0gc2NvcGUuc3BsaXQoXCIuXCIpO1xuICAgICAgICBjb25zb2xlLmFzc2VydChwYXJ0cy5sZW5ndGggPT0gMiwgXCJFUlJPUjogc2NvcGUgZm9ybWF0IGV4cGVjdGVkIGlzIHh4eC55eXksIGdvdDogXCIsIHR5cGVvZiBzY29wZSwgc2NvcGUpO1xuICAgICAgICB2YXIgaW52ZXJzZSA9IHBhcnRzWzFdICsgXCIuXCIgKyBwYXJ0c1swXTtcbiAgICAgICAgaWYgKHBhcnRzWzFdID09IFwidGxvc1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NvcGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcnRzWzBdID09IFwidGxvc1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gaW52ZXJzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFydHNbMF0gPCBwYXJ0c1sxXSkge1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGludmVyc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG5cbiAgICBwdWJsaWMgaXNDYW5vbmljYWwoc2NvcGU6c3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKSA9PSBzY29wZTtcbiAgICB9XG5cbiAgICBcbiAgICBcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEdldHRlcnMgXG5cbiAgICBnZXRCYWxhbmNlKHRva2VuOlRva2VuREVYKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5iYWxhbmNlcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYmFsYW5jZXNbaV0udG9rZW4uc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJhbGFuY2VzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQXNzZXRERVgoXCIwIFwiICsgdG9rZW4uc3ltYm9sLCB0aGlzKTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRTb21lRnJlZUZha2VUb2tlbnMoc3ltYm9sOnN0cmluZyA9IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVguZ2V0U29tZUZyZWVGYWtlVG9rZW5zKClcIik7XG4gICAgICAgIHZhciBfdG9rZW4gPSBzeW1ib2w7ICAgIFxuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImZyZWVmYWtlLVwiK190b2tlbiB8fCBcInRva2VuXCIsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5TdGF0cy50aGVuKF8gPT4ge1xuICAgICAgICAgICAgdmFyIHRva2VuID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBjb3VudHMgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPDEwMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50b2tlbnNbaV0uc3ltYm9sID09IHN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRva2Vuc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICB2YXIgcmFuZG9tID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpLCBcIlJhbmRvbTogXCIsIHJhbmRvbSk7XG4gICAgICAgICAgICAgICAgaWYgKCF0b2tlbiAmJiByYW5kb20gPiAwLjUpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRva2Vuc1tpICUgdGhpcy50b2tlbnMubGVuZ3RoXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuLmZha2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmRvbSA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmFuZG9tID4gMC41KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRlbG9zO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGk8MTAwICYmIHRva2VuICYmIHRoaXMuZ2V0QmFsYW5jZSh0b2tlbikuYW1vdW50LnRvTnVtYmVyKCkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpLCBcInRva2VuOiBcIiwgdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhbmRvbSA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtb250byA9IE1hdGguZmxvb3IoMTAwMDAgKiByYW5kb20pIC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcXVhbnRpdHkgPSBuZXcgQXNzZXRERVgoXCJcIiArIG1vbnRvICsgXCIgXCIgKyB0b2tlbi5zeW1ib2wgLHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWVtbyA9IFwieW91IGdldCBcIiArIHF1YW50aXR5LnZhbHVlVG9TdHJpbmcoKSsgXCIgZnJlZSBmYWtlIFwiICsgdG9rZW4uc3ltYm9sICsgXCIgdG9rZW5zIHRvIHBsYXkgb24gdmFwYWVlLmlvIERFWFwiO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5leGNlY3V0ZShcImlzc3VlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiAgdGhpcy5zY2F0dGVyLmFjY291bnQubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiBxdWFudGl0eS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVtbzogbWVtb1xuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRCYWxhbmNlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJmcmVlZmFrZS1cIitfdG9rZW4gfHwgXCJ0b2tlblwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWVtbztcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImZyZWVmYWtlLVwiK190b2tlbiB8fCBcInRva2VuXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICAgICAgICAgIH0pOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZ2V0VG9rZW5Ob3coc3ltOnN0cmluZyk6IFRva2VuREVYIHtcbiAgICAgICAgaWYgKCFzeW0pIHJldHVybiBudWxsO1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMudG9rZW5zKSB7XG4gICAgICAgICAgICAvLyB0aGVyZSdzIGEgbGl0dGxlIGJ1Zy4gVGhpcyBpcyBhIGp1c3RhICB3b3JrIGFycm91bmRcbiAgICAgICAgICAgIGlmICh0aGlzLnRva2Vuc1tpXS5zeW1ib2wudG9VcHBlckNhc2UoKSA9PSBcIlRMT1NcIiAmJiB0aGlzLnRva2Vuc1tpXS5vZmZjaGFpbikge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgc29sdmVzIGF0dGFjaGluZyB3cm9uZyB0bG9zIHRva2VuIHRvIGFzc2V0XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodGhpcy50b2tlbnNbaV0uc3ltYm9sLnRvVXBwZXJDYXNlKCkgPT0gc3ltLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0VG9rZW4oc3ltOnN0cmluZyk6IFByb21pc2U8VG9rZW5ERVg+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKF8gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VG9rZW5Ob3coc3ltKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0RGVwb3NpdHMoYWNjb3VudDpzdHJpbmcgPSBudWxsKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVguZ2V0RGVwb3NpdHMoKVwiKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0c1wiLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIGRlcG9zaXRzOiBBc3NldERFWFtdID0gW107XG4gICAgICAgICAgICBpZiAoIWFjY291bnQgJiYgdGhpcy5jdXJyZW50Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICBhY2NvdW50ID0gdGhpcy5jdXJyZW50Lm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYWNjb3VudCkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBhd2FpdCB0aGlzLmZldGNoRGVwb3NpdHMoYWNjb3VudCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiByZXN1bHQucm93cykge1xuICAgICAgICAgICAgICAgICAgICBkZXBvc2l0cy5wdXNoKG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5hbW91bnQsIHRoaXMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRlcG9zaXRzID0gZGVwb3NpdHM7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImRlcG9zaXRzXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlcG9zaXRzO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRCYWxhbmNlcyhhY2NvdW50OnN0cmluZyA9IG51bGwpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5nZXRCYWxhbmNlcygpXCIpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJhbGFuY2VzXCIsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgX2JhbGFuY2VzOiBBc3NldERFWFtdO1xuICAgICAgICAgICAgaWYgKCFhY2NvdW50ICYmIHRoaXMuY3VycmVudC5uYW1lKSB7XG4gICAgICAgICAgICAgICAgYWNjb3VudCA9IHRoaXMuY3VycmVudC5uYW1lO1xuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGFjY291bnQpIHtcbiAgICAgICAgICAgICAgICBfYmFsYW5jZXMgPSBhd2FpdCB0aGlzLmZldGNoQmFsYW5jZXMoYWNjb3VudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJhbGFuY2VzID0gX2JhbGFuY2VzO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWVERVggYmFsYW5jZXMgdXBkYXRlZFwiKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYmFsYW5jZXNcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFsYW5jZXM7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGdldFRoaXNTZWxsT3JkZXJzKHRhYmxlOnN0cmluZywgaWRzOm51bWJlcltdKTogUHJvbWlzZTxhbnlbXT4ge1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInRoaXNvcmRlcnNcIiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gaWRzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gaWRzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBnb3RpdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbal0uaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvdGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChnb3RpdCkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHJlczpUYWJsZVJlc3VsdCA9IGF3YWl0IHRoaXMuZmV0Y2hPcmRlcnMoe3Njb3BlOnRhYmxlLCBsaW1pdDoxLCBsb3dlcl9ib3VuZDppZC50b1N0cmluZygpfSk7XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuY29uY2F0KHJlcy5yb3dzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidGhpc29yZGVyc1wiLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTsgICAgXG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0VXNlck9yZGVycyhhY2NvdW50OnN0cmluZyA9IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVguZ2V0VXNlck9yZGVycygpXCIpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInVzZXJvcmRlcnNcIiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciB1c2Vyb3JkZXJzOiBUYWJsZVJlc3VsdDtcbiAgICAgICAgICAgIGlmICghYWNjb3VudCAmJiB0aGlzLmN1cnJlbnQubmFtZSkge1xuICAgICAgICAgICAgICAgIGFjY291bnQgPSB0aGlzLmN1cnJlbnQubmFtZTtcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChhY2NvdW50KSB7XG4gICAgICAgICAgICAgICAgdXNlcm9yZGVycyA9IGF3YWl0IHRoaXMuZmV0Y2hVc2VyT3JkZXJzKGFjY291bnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGxpc3Q6IFVzZXJPcmRlcnNbXSA9IDxVc2VyT3JkZXJzW10+dXNlcm9yZGVycy5yb3dzO1xuICAgICAgICAgICAgdmFyIG1hcDogVXNlck9yZGVyc01hcCA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaWRzID0gbGlzdFtpXS5pZHM7XG4gICAgICAgICAgICAgICAgdmFyIHRhYmxlID0gbGlzdFtpXS50YWJsZTtcbiAgICAgICAgICAgICAgICB2YXIgb3JkZXJzID0gYXdhaXQgdGhpcy5nZXRUaGlzU2VsbE9yZGVycyh0YWJsZSwgaWRzKTtcbiAgICAgICAgICAgICAgICBtYXBbdGFibGVdID0ge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZTogdGFibGUsXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyczogdGhpcy5hdXhQcm9jZXNzUm93c1RvT3JkZXJzKG9yZGVycyksXG4gICAgICAgICAgICAgICAgICAgIGlkczppZHNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy51c2Vyb3JkZXJzID0gbWFwO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy51c2Vyb3JkZXJzKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidXNlcm9yZGVyc1wiLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51c2Vyb3JkZXJzO1xuICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGVBY3Rpdml0eSgpIHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJhY3Rpdml0eVwiLCB0cnVlKTtcbiAgICAgICAgdmFyIHBhZ2VzaXplID0gdGhpcy5hY3Rpdml0eVBhZ2VzaXplO1xuICAgICAgICB2YXIgcGFnZXMgPSBhd2FpdCB0aGlzLmdldEFjdGl2aXR5VG90YWxQYWdlcyhwYWdlc2l6ZSk7XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hBY3Rpdml0eShwYWdlcy0yLCBwYWdlc2l6ZSksXG4gICAgICAgICAgICB0aGlzLmZldGNoQWN0aXZpdHkocGFnZXMtMSwgcGFnZXNpemUpLFxuICAgICAgICAgICAgdGhpcy5mZXRjaEFjdGl2aXR5KHBhZ2VzLTAsIHBhZ2VzaXplKVxuICAgICAgICBdKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJhY3Rpdml0eVwiLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZE1vcmVBY3Rpdml0eSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZpdHkubGlzdC5sZW5ndGggPT0gMCkgcmV0dXJuO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImFjdGl2aXR5XCIsIHRydWUpO1xuICAgICAgICB2YXIgcGFnZXNpemUgPSB0aGlzLmFjdGl2aXR5UGFnZXNpemU7XG4gICAgICAgIHZhciBmaXJzdCA9IHRoaXMuYWN0aXZpdHkubGlzdFt0aGlzLmFjdGl2aXR5Lmxpc3QubGVuZ3RoLTFdO1xuICAgICAgICB2YXIgaWQgPSBmaXJzdC5pZCAtIHBhZ2VzaXplO1xuICAgICAgICB2YXIgcGFnZSA9IE1hdGguZmxvb3IoKGlkLTEpIC8gcGFnZXNpemUpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuZmV0Y2hBY3Rpdml0eShwYWdlLCBwYWdlc2l6ZSk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYWN0aXZpdHlcIiwgZmFsc2UpO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZVRyYWRlKGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCwgdXBkYXRlVXNlcjpib29sZWFuID0gdHJ1ZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnVwZGF0ZVRyYWRlKClcIik7XG4gICAgICAgIHZhciBjaHJvbm9fa2V5ID0gXCJ1cGRhdGVUcmFkZVwiO1xuICAgICAgICB0aGlzLmZlZWQuc3RhcnRDaHJvbm8oY2hyb25vX2tleSk7XG5cbiAgICAgICAgaWYodXBkYXRlVXNlcikgdGhpcy51cGRhdGVDdXJyZW50VXNlcigpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGhpcy5nZXRUcmFuc2FjdGlvbkhpc3RvcnkoY29tb2RpdHksIGN1cnJlbmN5LCAtMSwgLTEsIHRydWUpLnRoZW4oXyA9PiB0aGlzLmZlZWQuc2V0TWFyY2soY2hyb25vX2tleSwgXCJnZXRUcmFuc2FjdGlvbkhpc3RvcnkoKVwiKSksXG4gICAgICAgICAgICB0aGlzLmdldEJsb2NrSGlzdG9yeShjb21vZGl0eSwgY3VycmVuY3ksIC0xLCAtMSwgdHJ1ZSkudGhlbihfID0+IHRoaXMuZmVlZC5zZXRNYXJjayhjaHJvbm9fa2V5LCBcImdldEJsb2NrSGlzdG9yeSgpXCIpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0U2VsbE9yZGVycyhjb21vZGl0eSwgY3VycmVuY3ksIHRydWUpLnRoZW4oXyA9PiB0aGlzLmZlZWQuc2V0TWFyY2soY2hyb25vX2tleSwgXCJnZXRTZWxsT3JkZXJzKClcIikpLFxuICAgICAgICAgICAgdGhpcy5nZXRCdXlPcmRlcnMoY29tb2RpdHksIGN1cnJlbmN5LCB0cnVlKS50aGVuKF8gPT4gdGhpcy5mZWVkLnNldE1hcmNrKGNocm9ub19rZXksIFwiZ2V0QnV5T3JkZXJzKClcIikpLFxuICAgICAgICAgICAgdGhpcy5nZXRUYWJsZVN1bW1hcnkoY29tb2RpdHksIGN1cnJlbmN5LCB0cnVlKS50aGVuKF8gPT4gdGhpcy5mZWVkLnNldE1hcmNrKGNocm9ub19rZXksIFwiZ2V0VGFibGVTdW1tYXJ5KClcIikpLFxuICAgICAgICAgICAgdGhpcy5nZXRPcmRlclN1bW1hcnkoKS50aGVuKF8gPT4gdGhpcy5mZWVkLnNldE1hcmNrKGNocm9ub19rZXksIFwiZ2V0T3JkZXJTdW1tYXJ5KClcIikpLFxuICAgICAgICBdKS50aGVuKHIgPT4ge1xuICAgICAgICAgICAgdGhpcy5fcmV2ZXJzZSA9IHt9O1xuICAgICAgICAgICAgdGhpcy5yZXNvcnRUb2tlbnMoKTtcbiAgICAgICAgICAgIC8vIHRoaXMuZmVlZC5wcmludENocm9ubyhjaHJvbm9fa2V5KTtcbiAgICAgICAgICAgIHRoaXMub25UcmFkZVVwZGF0ZWQubmV4dChudWxsKTtcbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGVDdXJyZW50VXNlcigpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC51cGRhdGVDdXJyZW50VXNlcigpXCIpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImN1cnJlbnRcIiwgdHJ1ZSk7ICAgICAgICBcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMuZ2V0VXNlck9yZGVycygpLFxuICAgICAgICAgICAgdGhpcy5nZXREZXBvc2l0cygpLFxuICAgICAgICAgICAgdGhpcy5nZXRCYWxhbmNlcygpXG4gICAgICAgIF0pLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImN1cnJlbnRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIF87XG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjdXJyZW50XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0QmxvY2tIaXN0b3J5VG90YWxQYWdlc0ZvcihzY29wZTpzdHJpbmcsIHBhZ2VzaXplOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9tYXJrZXRzKSByZXR1cm4gMDtcbiAgICAgICAgdmFyIG1hcmtldCA9IHRoaXMubWFya2V0KHNjb3BlKTtcbiAgICAgICAgaWYgKCFtYXJrZXQpIHJldHVybiAwO1xuICAgICAgICB2YXIgdG90YWwgPSBtYXJrZXQuYmxvY2tzO1xuICAgICAgICB2YXIgbW9kID0gdG90YWwgJSBwYWdlc2l6ZTtcbiAgICAgICAgdmFyIGRpZiA9IHRvdGFsIC0gbW9kO1xuICAgICAgICB2YXIgcGFnZXMgPSBkaWYgLyBwYWdlc2l6ZTtcbiAgICAgICAgaWYgKG1vZCA+IDApIHtcbiAgICAgICAgICAgIHBhZ2VzICs9MTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImdldEJsb2NrSGlzdG9yeVRvdGFsUGFnZXNGb3IoKSB0b3RhbDpcIiwgdG90YWwsIFwiIHBhZ2VzOlwiLCBwYWdlcyk7XG4gICAgICAgIHJldHVybiBwYWdlcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEhpc3RvcnlUb3RhbFBhZ2VzRm9yKHNjb3BlOnN0cmluZywgcGFnZXNpemU6IG51bWJlcikge1xuICAgICAgICBpZiAoIXRoaXMuX21hcmtldHMpIHJldHVybiAwO1xuICAgICAgICB2YXIgbWFya2V0ID0gdGhpcy5tYXJrZXQoc2NvcGUpO1xuICAgICAgICBpZiAoIW1hcmtldCkgcmV0dXJuIDA7XG4gICAgICAgIHZhciB0b3RhbCA9IG1hcmtldC5kZWFscztcbiAgICAgICAgdmFyIG1vZCA9IHRvdGFsICUgcGFnZXNpemU7XG4gICAgICAgIHZhciBkaWYgPSB0b3RhbCAtIG1vZDtcbiAgICAgICAgdmFyIHBhZ2VzID0gZGlmIC8gcGFnZXNpemU7XG4gICAgICAgIGlmIChtb2QgPiAwKSB7XG4gICAgICAgICAgICBwYWdlcyArPTE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZ2VzO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZ2V0QWN0aXZpdHlUb3RhbFBhZ2VzKHBhZ2VzaXplOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJldmVudHNcIiwge1xuICAgICAgICAgICAgbGltaXQ6IDFcbiAgICAgICAgfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHJlc3VsdC5yb3dzWzBdLnBhcmFtcztcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IHBhcnNlSW50KHBhcmFtcy5zcGxpdChcIiBcIilbMF0pLTE7XG4gICAgICAgICAgICB2YXIgbW9kID0gdG90YWwgJSBwYWdlc2l6ZTtcbiAgICAgICAgICAgIHZhciBkaWYgPSB0b3RhbCAtIG1vZDtcbiAgICAgICAgICAgIHZhciBwYWdlcyA9IGRpZiAvIHBhZ2VzaXplO1xuICAgICAgICAgICAgaWYgKG1vZCA+IDApIHtcbiAgICAgICAgICAgICAgICBwYWdlcyArPTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFjdGl2aXR5LnRvdGFsID0gdG90YWw7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5nZXRBY3Rpdml0eVRvdGFsUGFnZXMoKSB0b3RhbDogXCIsIHRvdGFsLCBcIiBwYWdlczogXCIsIHBhZ2VzKTtcbiAgICAgICAgICAgIHJldHVybiBwYWdlcztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0VHJhbnNhY3Rpb25IaXN0b3J5KGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCwgcGFnZTpudW1iZXIgPSAtMSwgcGFnZXNpemU6bnVtYmVyID0gLTEsIGZvcmNlOmJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHZhciBzY29wZTpzdHJpbmcgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHRoaXMuZ2V0U2NvcGVGb3IoY29tb2RpdHksIGN1cnJlbmN5KSk7XG4gICAgICAgIHZhciBhdXggPSBudWxsO1xuICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJoaXN0b3J5LlwiK3Njb3BlLCB0cnVlKTtcbiAgICAgICAgYXV4ID0gdGhpcy53YWl0T3JkZXJTdW1tYXJ5LnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICBpZiAocGFnZXNpemUgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBwYWdlc2l6ZSA9IDEwOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYWdlID09IC0xKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhZ2VzID0gdGhpcy5nZXRIaXN0b3J5VG90YWxQYWdlc0ZvcihzY29wZSwgcGFnZXNpemUpO1xuICAgICAgICAgICAgICAgIHBhZ2UgPSBwYWdlcy0zO1xuICAgICAgICAgICAgICAgIGlmIChwYWdlIDwgMCkgcGFnZSA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaEhpc3Rvcnkoc2NvcGUsIHBhZ2UrMCwgcGFnZXNpemUpLFxuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hIaXN0b3J5KHNjb3BlLCBwYWdlKzEsIHBhZ2VzaXplKSxcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoSGlzdG9yeShzY29wZSwgcGFnZSsyLCBwYWdlc2l6ZSlcbiAgICAgICAgICAgIF0pLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJoaXN0b3J5LlwiK3Njb3BlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFya2V0KHNjb3BlKS5oaXN0b3J5O1xuICAgICAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJoaXN0b3J5LlwiK3Njb3BlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5tYXJrZXQoc2NvcGUpICYmICFmb3JjZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5tYXJrZXQoc2NvcGUpLmhpc3Rvcnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhdXg7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uSGlzdG9yeUNoYW5nZS5uZXh0KHJlc3VsdCk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGF1eEhvdXJUb0xhYmVsKGhvdXI6bnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShob3VyICogMTAwMCAqIDYwICogNjApO1xuICAgICAgICB2YXIgbGFiZWwgPSBkLmdldEhvdXJzKCkgPT0gMCA/IHRoaXMuZGF0ZVBpcGUudHJhbnNmb3JtKGQsICdkZC9NTScpIDogZC5nZXRIb3VycygpICsgXCJoXCI7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbGFiZWw7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QmxvY2tIaXN0b3J5KGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCwgcGFnZTpudW1iZXIgPSAtMSwgcGFnZXNpemU6bnVtYmVyID0gLTEsIGZvcmNlOmJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldEJsb2NrSGlzdG9yeSgpXCIsIGNvbW9kaXR5LnN5bWJvbCwgcGFnZSwgcGFnZXNpemUpO1xuICAgICAgICAvLyAvLyBlbGFwc2VkIHRpbWVcbiAgICAgICAgLy8gdmFyIHN0YXJ0VGltZTpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgLy8gdmFyIGRpZmY6bnVtYmVyO1xuICAgICAgICAvLyB2YXIgc2VjOm51bWJlcjtcblxuICAgICAgICB2YXIgc2NvcGU6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZSh0aGlzLmdldFNjb3BlRm9yKGNvbW9kaXR5LCBjdXJyZW5jeSkpO1xuICAgICAgICB2YXIgYXV4ID0gbnVsbDtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYmxvY2staGlzdG9yeS5cIitzY29wZSwgdHJ1ZSk7XG5cbiAgICAgICAgYXV4ID0gdGhpcy53YWl0T3JkZXJTdW1tYXJ5LnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgZmV0Y2hCbG9ja0hpc3RvcnlTdGFydDpEYXRlID0gbmV3IERhdGUoKTtcblxuICAgICAgICAgICAgaWYgKHBhZ2VzaXplID09IC0xKSB7XG4gICAgICAgICAgICAgICAgcGFnZXNpemUgPSAxMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYWdlID09IC0xKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhZ2VzID0gdGhpcy5nZXRCbG9ja0hpc3RvcnlUb3RhbFBhZ2VzRm9yKHNjb3BlLCBwYWdlc2l6ZSk7XG4gICAgICAgICAgICAgICAgcGFnZSA9IHBhZ2VzLTM7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UgPCAwKSBwYWdlID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwcm9taXNlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPD1wYWdlczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByb21pc2UgPSB0aGlzLmZldGNoQmxvY2tIaXN0b3J5KHNjb3BlLCBpLCBwYWdlc2l6ZSk7XG4gICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgICAgIC8vIC8vIGVsYXBzZWQgdGltZVxuICAgICAgICAgICAgICAgIC8vIHZhciBmZXRjaEJsb2NrSGlzdG9yeVRpbWU6RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgLy8gZGlmZiA9IGZldGNoQmxvY2tIaXN0b3J5VGltZS5nZXRUaW1lKCkgLSBmZXRjaEJsb2NrSGlzdG9yeVN0YXJ0LmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAvLyBzZWMgPSBkaWZmIC8gMTAwMDtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqIFZhcGFlZURFWC5nZXRCbG9ja0hpc3RvcnkoKSBmZXRjaEJsb2NrSGlzdG9yeVRpbWUgc2VjOiBcIiwgc2VjLCBcIihcIixkaWZmLFwiKVwiKTtcblxuXG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJibG9jay1oaXN0b3J5LlwiK3Njb3BlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgdmFyIG1hcmtldDogTWFya2V0ID0gdGhpcy5tYXJrZXQoc2NvcGUpO1xuICAgICAgICAgICAgICAgIG1hcmtldC5ibG9ja2xpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICBtYXJrZXQucmV2ZXJzZWJsb2NrcyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIHZhciBob3JhID0gMTAwMCAqIDYwICogNjA7XG4gICAgICAgICAgICAgICAgdmFyIGhvdXIgPSBNYXRoLmZsb29yKG5vdy5nZXRUaW1lKCkvaG9yYSk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItPlwiLCBob3VyKTtcbiAgICAgICAgICAgICAgICB2YXIgbGFzdF9ibG9jayA9IG51bGw7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RfaG91ciA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICB2YXIgb3JkZXJlZF9ibG9ja3MgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG1hcmtldC5ibG9jaykge1xuICAgICAgICAgICAgICAgICAgICBvcmRlcmVkX2Jsb2Nrcy5wdXNoKG1hcmtldC5ibG9ja1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgb3JkZXJlZF9ibG9ja3Muc29ydChmdW5jdGlvbihhOkhpc3RvcnlCbG9jaywgYjpIaXN0b3J5QmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoYS5ob3VyIDwgYi5ob3VyKSByZXR1cm4gLTExO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG9yZGVyZWRfYmxvY2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBibG9jazpIaXN0b3J5QmxvY2sgPSBvcmRlcmVkX2Jsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gdGhpcy5hdXhIb3VyVG9MYWJlbChibG9jay5ob3VyKTtcbiAgICAgICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItPlwiLCBpLCBsYWJlbCwgYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0ZSA9IGJsb2NrLmRhdGU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaWYgPSBub3cuZ2V0VGltZSgpIC0gYmxvY2suZGF0ZS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtZXMgPSAzMCAqIDI0ICogaG9yYTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsYXBzZWRfbW9udGhzID0gZGlmIC8gbWVzO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxhcHNlZF9tb250aHMgPiAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRyb3BwaW5nIGJsb2NrIHRvbyBvbGRcIiwgW2Jsb2NrLCBibG9jay5kYXRlLnRvVVRDU3RyaW5nKCldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RfYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaWYgPSBibG9jay5ob3VyIC0gbGFzdF9ibG9jay5ob3VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaj0xOyBqPGRpZjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsX2kgPSB0aGlzLmF1eEhvdXJUb0xhYmVsKGxhc3RfYmxvY2suaG91citqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tPlwiLCBqLCBsYWJlbF9pLCBibG9jayk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25pbmljYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IGxhc3RfYmxvY2sucHJpY2UuYW1vdW50LnRvTnVtYmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF1eCA9IFtsYWJlbF9pLCBwcmljZSwgcHJpY2UsIHByaWNlLCBwcmljZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFya2V0LmJsb2NrbGlzdC5wdXNoKGF1eCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV2ZXJzZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGludmVyc2UgPSBsYXN0X2Jsb2NrLmludmVyc2UuYW1vdW50LnRvTnVtYmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF1eCA9IFtsYWJlbF9pLCBpbnZlcnNlLCBpbnZlcnNlLCBpbnZlcnNlLCBpbnZlcnNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXQucmV2ZXJzZWJsb2Nrcy5wdXNoKGF1eCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIG9iajphbnlbXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uaW5pY2FsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgb2JqID0gW2xhYmVsXTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goYmxvY2subWF4LmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goYmxvY2suZW50cmFuY2UuYW1vdW50LnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICBvYmoucHVzaChibG9jay5wcmljZS5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKGJsb2NrLm1pbi5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtldC5ibG9ja2xpc3QucHVzaChvYmopO1xuICAgICAgICAgICAgICAgICAgICAvLyByZXZlcnNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgb2JqID0gW2xhYmVsXTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goMS4wL2Jsb2NrLm1heC5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKDEuMC9ibG9jay5lbnRyYW5jZS5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKDEuMC9ibG9jay5wcmljZS5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKDEuMC9ibG9jay5taW4uYW1vdW50LnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXQucmV2ZXJzZWJsb2Nrcy5wdXNoKG9iaik7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RfYmxvY2sgPSBibG9jaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobGFzdF9ibG9jayAmJiBob3VyICE9IGxhc3RfYmxvY2suaG91cikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGlmID0gaG91ciAtIGxhc3RfYmxvY2suaG91cjtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaj0xOyBqPD1kaWY7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsX2kgPSB0aGlzLmF1eEhvdXJUb0xhYmVsKGxhc3RfYmxvY2suaG91citqKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uaW5pY2FsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IGxhc3RfYmxvY2sucHJpY2UuYW1vdW50LnRvTnVtYmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXV4ID0gW2xhYmVsX2ksIHByaWNlLCBwcmljZSwgcHJpY2UsIHByaWNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtldC5ibG9ja2xpc3QucHVzaChhdXgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZXZlcnNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnZlcnNlID0gbGFzdF9ibG9jay5pbnZlcnNlLmFtb3VudC50b051bWJlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF1eCA9IFtsYWJlbF9pLCBpbnZlcnNlLCBpbnZlcnNlLCBpbnZlcnNlLCBpbnZlcnNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtldC5yZXZlcnNlYmxvY2tzLnB1c2goYXV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIC8vIGVsYXBzZWQgdGltZVxuICAgICAgICAgICAgICAgIC8vIHZhciBmaXJzdExldmVsVGltZTpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAvLyBkaWZmID0gZmlyc3RMZXZlbFRpbWUuZ2V0VGltZSgpIC0gZmV0Y2hCbG9ja0hpc3RvcnlUaW1lLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAvLyBzZWMgPSBkaWZmIC8gMTAwMDtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqIFZhcGFlZURFWC5nZXRCbG9ja0hpc3RvcnkoKSBmaXJzdExldmVsVGltZSBzZWM6IFwiLCBzZWMsIFwiKFwiLGRpZmYsXCIpXCIpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0+XCIsIG1hcmtldC5ibG9ja2xpc3QpO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMub25CbG9ja2xpc3RDaGFuZ2UubmV4dChtYXJrZXQuYmxvY2tsaXN0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFya2V0O1xuICAgICAgICAgICAgfSkudGhlbihtYXJrZXQgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgICAgIC8vIC8vIGVsYXBzZWQgdGltZVxuICAgICAgICAgICAgICAgIC8vIHZhciBhbGxMZXZlbHNTdGFydDpEYXRlID0gbmV3IERhdGUoKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIGxpbWl0ID0gMjU2O1xuICAgICAgICAgICAgICAgIHZhciBsZXZlbHMgPSBbbWFya2V0LmJsb2NrbGlzdF07XG4gICAgICAgICAgICAgICAgdmFyIHJldmVyc2VzID0gW21hcmtldC5yZXZlcnNlYmxvY2tzXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBjdXJyZW50ID0gMDsgbGV2ZWxzW2N1cnJlbnRdLmxlbmd0aCA+IGxpbWl0OyBjdXJyZW50KyspIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coY3VycmVudCAsbGV2ZWxzW2N1cnJlbnRdLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdsZXZlbDphbnlbXVtdID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdyZXZlcnNlOmFueVtdW10gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lcmdlZDphbnlbXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bGV2ZWxzW2N1cnJlbnRdLmxlbmd0aDsgaSs9Mikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2Fub25pY2FsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdl8xOmFueVtdID0gbGV2ZWxzW2N1cnJlbnRdW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZfMiA9IGxldmVsc1tjdXJyZW50XVtpKzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1lcmdlZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeD0wOyB4PDU7IHgrKykgbWVyZ2VkW3hdID0gdl8xW3hdOyAvLyBjbGVhbiBjb3B5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodl8yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzBdID0gdl8xWzBdLnNwbGl0KFwiL1wiKS5sZW5ndGggPiAxID8gdl8xWzBdIDogdl8yWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFsxXSA9IE1hdGgubWF4KHZfMVsxXSwgdl8yWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbMl0gPSB2XzFbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzNdID0gdl8yWzNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFs0XSA9IE1hdGgubWluKHZfMVs0XSwgdl8yWzRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld2xldmVsLnB1c2gobWVyZ2VkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV2ZXJzZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZfMSA9IHJldmVyc2VzW2N1cnJlbnRdW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdl8yID0gcmV2ZXJzZXNbY3VycmVudF1baSsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeD0wOyB4PDU7IHgrKykgbWVyZ2VkW3hdID0gdl8xW3hdOyAvLyBjbGVhbiBjb3B5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodl8yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzBdID0gdl8xWzBdLnNwbGl0KFwiL1wiKS5sZW5ndGggPiAxID8gdl8xWzBdIDogdl8yWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFsxXSA9IE1hdGgubWluKHZfMVsxXSwgdl8yWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbMl0gPSB2XzFbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzNdID0gdl8yWzNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFs0XSA9IE1hdGgubWF4KHZfMVs0XSwgdl8yWzRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdyZXZlcnNlLnB1c2gobWVyZ2VkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldmVscy5wdXNoKG5ld2xldmVsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZXMucHVzaChuZXdyZXZlcnNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICBtYXJrZXQuYmxvY2tsZXZlbHMgPSBsZXZlbHM7XG4gICAgICAgICAgICAgICAgbWFya2V0LnJldmVyc2VsZXZlbHMgPSByZXZlcnNlcztcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAvLyBtYXJrZXQuYmxvY2tsZXZlbHMgPSBbbWFya2V0LmJsb2NrbGlzdF07XG4gICAgICAgICAgICAgICAgLy8gbWFya2V0LnJldmVyc2VsZXZlbHMgPSBbbWFya2V0LnJldmVyc2VibG9ja3NdO1xuICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gLy8gZWxhcHNlZCB0aW1lXG4gICAgICAgICAgICAgICAgLy8gdmFyIGFsbExldmVsc1RpbWU6RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgLy8gZGlmZiA9IGFsbExldmVsc1RpbWUuZ2V0VGltZSgpIC0gYWxsTGV2ZWxzU3RhcnQuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIC8vIHNlYyA9IGRpZmYgLyAxMDAwO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKiogVmFwYWVlREVYLmdldEJsb2NrSGlzdG9yeSgpIGFsbExldmVsc1RpbWUgc2VjOiBcIiwgc2VjLCBcIihcIixkaWZmLFwiKVwiKTsgICBcbiAgICAgICAgICAgICAgICAvLyAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiLCBtYXJrZXQuYmxvY2tsZXZlbHMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcmtldC5ibG9jaztcbiAgICAgICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYmxvY2staGlzdG9yeS5cIitzY29wZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMubWFya2V0KHNjb3BlKSAmJiAhZm9yY2UpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMubWFya2V0KHNjb3BlKS5ibG9jaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGF1eDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub25IaXN0b3J5Q2hhbmdlLm5leHQocmVzdWx0KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGFzeW5jIGdldFNlbGxPcmRlcnMoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYLCBmb3JjZTpib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB2YXIgc2NvcGU6c3RyaW5nID0gdGhpcy5nZXRTY29wZUZvcihjb21vZGl0eSwgY3VycmVuY3kpO1xuICAgICAgICB2YXIgY2Fub25pY2FsOnN0cmluZyA9IHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpO1xuICAgICAgICB2YXIgcmV2ZXJzZTpzdHJpbmcgPSB0aGlzLmludmVyc2VTY29wZShjYW5vbmljYWwpO1xuICAgICAgICB2YXIgYXV4ID0gbnVsbDtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwic2VsbG9yZGVyc1wiLCB0cnVlKTtcbiAgICAgICAgYXV4ID0gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgb3JkZXJzID0gYXdhaXQgdGhpcy5mZXRjaE9yZGVycyh7c2NvcGU6Y2Fub25pY2FsLCBsaW1pdDoxMDAsIGluZGV4X3Bvc2l0aW9uOiBcIjJcIiwga2V5X3R5cGU6IFwiaTY0XCJ9KTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSA9IHRoaXMuYXV4QXNzZXJ0U2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cInZwZS50bG9zXCIgfHwgc2NvcGU9PVwiY250LnRsb3NcIiljb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICAvLyBpZihzY29wZT09XCJ2cGUudGxvc1wiIHx8IHNjb3BlPT1cImNudC50bG9zXCIpY29uc29sZS5sb2coXCJTZWxsIGNydWRvOlwiLCBvcmRlcnMpO1xuICAgICAgICAgICAgdmFyIHNlbGw6IE9yZGVyW10gPSB0aGlzLmF1eFByb2Nlc3NSb3dzVG9PcmRlcnMob3JkZXJzLnJvd3MpO1xuICAgICAgICAgICAgc2VsbC5zb3J0KGZ1bmN0aW9uKGE6T3JkZXIsIGI6T3JkZXIpIHtcbiAgICAgICAgICAgICAgICBpZihhLnByaWNlLmFtb3VudC5pc0xlc3NUaGFuKGIucHJpY2UuYW1vdW50KSkgcmV0dXJuIC0xMTtcbiAgICAgICAgICAgICAgICBpZihhLnByaWNlLmFtb3VudC5pc0dyZWF0ZXJUaGFuKGIucHJpY2UuYW1vdW50KSkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cInZwZS50bG9zXCIgfHwgc2NvcGU9PVwiY250LnRsb3NcIiljb25zb2xlLmxvZyhcInNvcnRlZDpcIiwgc2VsbCk7XG4gICAgICAgICAgICAvLyBncm91cGluZyB0b2dldGhlciBvcmRlcnMgd2l0aCB0aGUgc2FtZSBwcmljZS5cbiAgICAgICAgICAgIHZhciBsaXN0OiBPcmRlclJvd1tdID0gW107XG4gICAgICAgICAgICB2YXIgcm93OiBPcmRlclJvdztcbiAgICAgICAgICAgIGlmIChzZWxsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxzZWxsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcmRlcjogT3JkZXIgPSBzZWxsW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3cgPSBsaXN0W2xpc3QubGVuZ3RoLTFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvdy5wcmljZS5hbW91bnQuZXEob3JkZXIucHJpY2UuYW1vdW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy50b3RhbC5hbW91bnQgPSByb3cudG90YWwuYW1vdW50LnBsdXMob3JkZXIudG90YWwuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cudGVsb3MuYW1vdW50ID0gcm93LnRlbG9zLmFtb3VudC5wbHVzKG9yZGVyLnRlbG9zLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93Lm93bmVyc1tvcmRlci5vd25lcl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5vcmRlcnMucHVzaChvcmRlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJvdyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cjogb3JkZXIucHJpY2UudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBvcmRlci5wcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyczogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogb3JkZXIudG90YWwuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbG9zOiBvcmRlci50ZWxvcy5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogb3JkZXIuaW52ZXJzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1bTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1bXRlbG9zOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXJzOiB7fVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcm93Lm93bmVyc1tvcmRlci5vd25lcl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByb3cub3JkZXJzLnB1c2gob3JkZXIpO1xuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdW0gPSBuZXcgQmlnTnVtYmVyKDApO1xuICAgICAgICAgICAgdmFyIHN1bXRlbG9zID0gbmV3IEJpZ051bWJlcigwKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogaW4gbGlzdCkge1xuICAgICAgICAgICAgICAgIHZhciBvcmRlcl9yb3cgPSBsaXN0W2pdO1xuICAgICAgICAgICAgICAgIHN1bXRlbG9zID0gc3VtdGVsb3MucGx1cyhvcmRlcl9yb3cudGVsb3MuYW1vdW50KTtcbiAgICAgICAgICAgICAgICBzdW0gPSBzdW0ucGx1cyhvcmRlcl9yb3cudG90YWwuYW1vdW50KTtcbiAgICAgICAgICAgICAgICBvcmRlcl9yb3cuc3VtdGVsb3MgPSBuZXcgQXNzZXRERVgoc3VtdGVsb3MsIG9yZGVyX3Jvdy50ZWxvcy50b2tlbik7XG4gICAgICAgICAgICAgICAgb3JkZXJfcm93LnN1bSA9IG5ldyBBc3NldERFWChzdW0sIG9yZGVyX3Jvdy50b3RhbC50b2tlbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5vcmRlcnMuc2VsbCA9IGxpc3Q7XG4gICAgICAgICAgICAvLyBpZihzY29wZT09XCJ2cGUudGxvc1wiIHx8IHNjb3BlPT1cImNudC50bG9zXCIpY29uc29sZS5sb2coXCJTZWxsIGZpbmFsOlwiLCB0aGlzLnNjb3Blc1tzY29wZV0ub3JkZXJzLnNlbGwpO1xuICAgICAgICAgICAgLy8gaWYoc2NvcGU9PVwidnBlLnRsb3NcIiB8fCBzY29wZT09XCJjbnQudGxvc1wiKWNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcblxuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJzZWxsb3JkZXJzXCIsIGZhbHNlKTsgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0ub3JkZXJzLnNlbGw7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gJiYgIWZvcmNlKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0ub3JkZXJzLnNlbGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhdXg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgZ2V0QnV5T3JkZXJzKGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCwgZm9yY2U6Ym9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgdmFyIHNjb3BlOnN0cmluZyA9IHRoaXMuZ2V0U2NvcGVGb3IoY29tb2RpdHksIGN1cnJlbmN5KTtcbiAgICAgICAgdmFyIGNhbm9uaWNhbDpzdHJpbmcgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgdmFyIHJldmVyc2U6c3RyaW5nID0gdGhpcy5pbnZlcnNlU2NvcGUoY2Fub25pY2FsKTtcblxuXG4gICAgICAgIHZhciBhdXggPSBudWxsO1xuICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJidXlvcmRlcnNcIiwgdHJ1ZSk7XG4gICAgICAgIGF1eCA9IHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIG9yZGVycyA9IGF3YWl0IGF3YWl0IHRoaXMuZmV0Y2hPcmRlcnMoe3Njb3BlOnJldmVyc2UsIGxpbWl0OjUwLCBpbmRleF9wb3NpdGlvbjogXCIyXCIsIGtleV90eXBlOiBcImk2NFwifSk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gPSB0aGlzLmF1eEFzc2VydFNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJ1eSBjcnVkbzpcIiwgb3JkZXJzKTsgICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBidXk6IE9yZGVyW10gPSB0aGlzLmF1eFByb2Nlc3NSb3dzVG9PcmRlcnMob3JkZXJzLnJvd3MpO1xuICAgICAgICAgICAgYnV5LnNvcnQoZnVuY3Rpb24oYTpPcmRlciwgYjpPcmRlcil7XG4gICAgICAgICAgICAgICAgaWYoYS5wcmljZS5hbW91bnQuaXNMZXNzVGhhbihiLnByaWNlLmFtb3VudCkpIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmKGEucHJpY2UuYW1vdW50LmlzR3JlYXRlclRoYW4oYi5wcmljZS5hbW91bnQpKSByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJidXkgc29ydGVhZG86XCIsIGJ1eSk7XG5cbiAgICAgICAgICAgIC8vIGdyb3VwaW5nIHRvZ2V0aGVyIG9yZGVycyB3aXRoIHRoZSBzYW1lIHByaWNlLlxuICAgICAgICAgICAgdmFyIGxpc3Q6IE9yZGVyUm93W10gPSBbXTtcbiAgICAgICAgICAgIHZhciByb3c6IE9yZGVyUm93O1xuICAgICAgICAgICAgaWYgKGJ1eS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8YnV5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcmRlcjogT3JkZXIgPSBidXlbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdyA9IGxpc3RbbGlzdC5sZW5ndGgtMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93LnByaWNlLmFtb3VudC5lcShvcmRlci5wcmljZS5hbW91bnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LnRvdGFsLmFtb3VudCA9IHJvdy50b3RhbC5hbW91bnQucGx1cyhvcmRlci50b3RhbC5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy50ZWxvcy5hbW91bnQgPSByb3cudGVsb3MuYW1vdW50LnBsdXMob3JkZXIudGVsb3MuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cub3duZXJzW29yZGVyLm93bmVyXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93Lm9yZGVycy5wdXNoKG9yZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gICAgXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcm93ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyOiBvcmRlci5wcmljZS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IG9yZGVyLnByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiBvcmRlci50b3RhbC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVsb3M6IG9yZGVyLnRlbG9zLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiBvcmRlci5pbnZlcnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VtOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VtdGVsb3M6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcnM6IHt9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByb3cub3duZXJzW29yZGVyLm93bmVyXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJvdy5vcmRlcnMucHVzaChvcmRlcik7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gICAgICAgICAgICBcblxuICAgICAgICAgICAgdmFyIHN1bSA9IG5ldyBCaWdOdW1iZXIoMCk7XG4gICAgICAgICAgICB2YXIgc3VtdGVsb3MgPSBuZXcgQmlnTnVtYmVyKDApO1xuICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBsaXN0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG9yZGVyX3JvdyA9IGxpc3Rbal07XG4gICAgICAgICAgICAgICAgc3VtdGVsb3MgPSBzdW10ZWxvcy5wbHVzKG9yZGVyX3Jvdy50ZWxvcy5hbW91bnQpO1xuICAgICAgICAgICAgICAgIHN1bSA9IHN1bS5wbHVzKG9yZGVyX3Jvdy50b3RhbC5hbW91bnQpO1xuICAgICAgICAgICAgICAgIG9yZGVyX3Jvdy5zdW10ZWxvcyA9IG5ldyBBc3NldERFWChzdW10ZWxvcywgb3JkZXJfcm93LnRlbG9zLnRva2VuKTtcbiAgICAgICAgICAgICAgICBvcmRlcl9yb3cuc3VtID0gbmV3IEFzc2V0REVYKHN1bSwgb3JkZXJfcm93LnRvdGFsLnRva2VuKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLm9yZGVycy5idXkgPSBsaXN0O1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJCdXkgZmluYWw6XCIsIHRoaXMuc2NvcGVzW3Njb3BlXS5vcmRlcnMuYnV5KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYnV5b3JkZXJzXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0ub3JkZXJzLmJ1eTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSAmJiAhZm9yY2UpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5vcmRlcnMuYnV5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gYXV4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIGdldE9yZGVyU3VtbWFyeSgpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5nZXRPcmRlclN1bW1hcnkoKVwiKTtcbiAgICAgICAgdmFyIHRhYmxlcyA9IGF3YWl0IHRoaXMuZmV0Y2hPcmRlclN1bW1hcnkoKTtcblxuICAgICAgICBmb3IgKHZhciBpIGluIHRhYmxlcy5yb3dzKSB7XG4gICAgICAgICAgICB2YXIgc2NvcGU6c3RyaW5nID0gdGFibGVzLnJvd3NbaV0udGFibGU7XG4gICAgICAgICAgICB2YXIgY2Fub25pY2FsID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgICAgICBjb25zb2xlLmFzc2VydChzY29wZSA9PSBjYW5vbmljYWwsIFwiRVJST1I6IHNjb3BlIGlzIG5vdCBjYW5vbmljYWxcIiwgc2NvcGUsIFtpLCB0YWJsZXNdKTtcbiAgICAgICAgICAgIHZhciBjb21vZGl0eSA9IHNjb3BlLnNwbGl0KFwiLlwiKVswXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgdmFyIGN1cnJlbmN5ID0gc2NvcGUuc3BsaXQoXCIuXCIpWzFdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW3Njb3BlXSA9IHRoaXMuYXV4QXNzZXJ0U2NvcGUoc2NvcGUpO1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpLCB0YWJsZXMucm93c1tpXSk7XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbc2NvcGVdLmhlYWRlci5zZWxsLnRvdGFsID0gbmV3IEFzc2V0REVYKHRhYmxlcy5yb3dzW2ldLnN1cHBseS50b3RhbCwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW3Njb3BlXS5oZWFkZXIuc2VsbC5vcmRlcnMgPSB0YWJsZXMucm93c1tpXS5zdXBwbHkub3JkZXJzO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tzY29wZV0uaGVhZGVyLmJ1eS50b3RhbCA9IG5ldyBBc3NldERFWCh0YWJsZXMucm93c1tpXS5kZW1hbmQudG90YWwsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tzY29wZV0uaGVhZGVyLmJ1eS5vcmRlcnMgPSB0YWJsZXMucm93c1tpXS5kZW1hbmQub3JkZXJzO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tzY29wZV0uZGVhbHMgPSB0YWJsZXMucm93c1tpXS5kZWFscztcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbc2NvcGVdLmJsb2NrcyA9IHRhYmxlcy5yb3dzW2ldLmJsb2NrcztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5zZXRPcmRlclN1bW1hcnkoKTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRUYWJsZVN1bW1hcnkoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYLCBmb3JjZTpib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPE1hcmtldFN1bW1hcnk+IHtcbiAgICAgICAgdmFyIHNjb3BlOnN0cmluZyA9IHRoaXMuZ2V0U2NvcGVGb3IoY29tb2RpdHksIGN1cnJlbmN5KTtcbiAgICAgICAgdmFyIGNhbm9uaWNhbDpzdHJpbmcgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgdmFyIGludmVyc2U6c3RyaW5nID0gdGhpcy5pbnZlcnNlU2NvcGUoY2Fub25pY2FsKTtcblxuICAgICAgICB2YXIgWkVST19DT01PRElUWSA9IFwiMC4wMDAwMDAwMCBcIiArIGNvbW9kaXR5LnN5bWJvbDtcbiAgICAgICAgdmFyIFpFUk9fQ1VSUkVOQ1kgPSBcIjAuMDAwMDAwMDAgXCIgKyBjdXJyZW5jeS5zeW1ib2w7XG5cbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJzdW1tYXJ5LlwiK2Nhbm9uaWNhbCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwic3VtbWFyeS5cIitpbnZlcnNlLCB0cnVlKTtcbiAgICAgICAgdmFyIGF1eCA9IG51bGw7XG4gICAgICAgIHZhciByZXN1bHQ6TWFya2V0U3VtbWFyeSA9IG51bGw7XG4gICAgICAgIGF1eCA9IHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIHN1bW1hcnkgPSBhd2FpdCB0aGlzLmZldGNoU3VtbWFyeShjYW5vbmljYWwpO1xuICAgICAgICAgICAgLy8gaWYoc2NvcGU9PVwib2xpdmUudGxvc1wiKWNvbnNvbGUubG9nKHNjb3BlLCBcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cIm9saXZlLnRsb3NcIiljb25zb2xlLmxvZyhcIlN1bW1hcnkgY3J1ZG86XCIsIHN1bW1hcnkucm93cyk7XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSA9IHRoaXMuYXV4QXNzZXJ0U2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5ID0ge1xuICAgICAgICAgICAgICAgIHNjb3BlOiBjYW5vbmljYWwsXG4gICAgICAgICAgICAgICAgcHJpY2U6IG5ldyBBc3NldERFWChuZXcgQmlnTnVtYmVyKDApLCBjdXJyZW5jeSksXG4gICAgICAgICAgICAgICAgcHJpY2VfMjRoX2FnbzogbmV3IEFzc2V0REVYKG5ldyBCaWdOdW1iZXIoMCksIGN1cnJlbmN5KSxcbiAgICAgICAgICAgICAgICBpbnZlcnNlOiBuZXcgQXNzZXRERVgobmV3IEJpZ051bWJlcigwKSwgY29tb2RpdHkpLFxuICAgICAgICAgICAgICAgIGludmVyc2VfMjRoX2FnbzogbmV3IEFzc2V0REVYKG5ldyBCaWdOdW1iZXIoMCksIGNvbW9kaXR5KSxcbiAgICAgICAgICAgICAgICB2b2x1bWU6IG5ldyBBc3NldERFWChuZXcgQmlnTnVtYmVyKDApLCBjdXJyZW5jeSksXG4gICAgICAgICAgICAgICAgYW1vdW50OiBuZXcgQXNzZXRERVgobmV3IEJpZ051bWJlcigwKSwgY29tb2RpdHkpLFxuICAgICAgICAgICAgICAgIHBlcmNlbnQ6IDAuMyxcbiAgICAgICAgICAgICAgICByZWNvcmRzOiBzdW1tYXJ5LnJvd3NcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBub3c6RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB2YXIgbm93X3NlYzogbnVtYmVyID0gTWF0aC5mbG9vcihub3cuZ2V0VGltZSgpIC8gMTAwMCk7XG4gICAgICAgICAgICB2YXIgbm93X2hvdXI6IG51bWJlciA9IE1hdGguZmxvb3Iobm93X3NlYyAvIDM2MDApO1xuICAgICAgICAgICAgdmFyIHN0YXJ0X2hvdXIgPSBub3dfaG91ciAtIDIzO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcIm5vd19ob3VyOlwiLCBub3dfaG91cik7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwic3RhcnRfaG91cjpcIiwgc3RhcnRfaG91cik7XG5cbiAgICAgICAgICAgIC8vIHByb2Nlc28gbG9zIGRhdG9zIGNydWRvcyBcbiAgICAgICAgICAgIHZhciBwcmljZSA9IFpFUk9fQ1VSUkVOQ1k7XG4gICAgICAgICAgICB2YXIgaW52ZXJzZSA9IFpFUk9fQ09NT0RJVFk7XG4gICAgICAgICAgICB2YXIgY3J1ZGUgPSB7fTtcbiAgICAgICAgICAgIHZhciBsYXN0X2hoID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxzdW1tYXJ5LnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaGggPSBzdW1tYXJ5LnJvd3NbaV0uaG91cjtcbiAgICAgICAgICAgICAgICBpZiAoc3VtbWFyeS5yb3dzW2ldLmxhYmVsID09IFwibGFzdG9uZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHByaWNlID0gc3VtbWFyeS5yb3dzW2ldLnByaWNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNydWRlW2hoXSA9IHN1bW1hcnkucm93c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RfaGggPCBoaCAmJiBoaCA8IHN0YXJ0X2hvdXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RfaGggPSBoaDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlID0gKHNjb3BlID09IGNhbm9uaWNhbCkgPyBzdW1tYXJ5LnJvd3NbaV0ucHJpY2UgOiBzdW1tYXJ5LnJvd3NbaV0uaW52ZXJzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2UgPSAoc2NvcGUgPT0gY2Fub25pY2FsKSA/IHN1bW1hcnkucm93c1tpXS5pbnZlcnNlIDogc3VtbWFyeS5yb3dzW2ldLnByaWNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcImhoOlwiLCBoaCwgXCJsYXN0X2hoOlwiLCBsYXN0X2hoLCBcInByaWNlOlwiLCBwcmljZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJjcnVkZTpcIiwgY3J1ZGUpO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcInByaWNlOlwiLCBwcmljZSk7XG5cbiAgICAgICAgICAgIC8vIGdlbmVybyB1bmEgZW50cmFkYSBwb3IgY2FkYSB1bmEgZGUgbGFzIMODwrpsdGltYXMgMjQgaG9yYXNcbiAgICAgICAgICAgIHZhciBsYXN0XzI0aCA9IHt9O1xuICAgICAgICAgICAgdmFyIHZvbHVtZSA9IG5ldyBBc3NldERFWChaRVJPX0NVUlJFTkNZLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBhbW91bnQgPSBuZXcgQXNzZXRERVgoWkVST19DT01PRElUWSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgcHJpY2VfYXNzZXQgPSBuZXcgQXNzZXRERVgocHJpY2UsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGludmVyc2VfYXNzZXQgPSBuZXcgQXNzZXRERVgoaW52ZXJzZSwgdGhpcyk7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiY250LnRsb3NcIiljb25zb2xlLmxvZyhcInByaWNlIFwiLCBwcmljZSk7XG4gICAgICAgICAgICB2YXIgbWF4X3ByaWNlID0gcHJpY2VfYXNzZXQuY2xvbmUoKTtcbiAgICAgICAgICAgIHZhciBtaW5fcHJpY2UgPSBwcmljZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgdmFyIG1heF9pbnZlcnNlID0gaW52ZXJzZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgdmFyIG1pbl9pbnZlcnNlID0gaW52ZXJzZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgdmFyIHByaWNlX2ZzdDpBc3NldERFWCA9IG51bGw7XG4gICAgICAgICAgICB2YXIgaW52ZXJzZV9mc3Q6QXNzZXRERVggPSBudWxsO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPDI0OyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudCA9IHN0YXJ0X2hvdXIraTtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudF9kYXRlID0gbmV3IERhdGUoY3VycmVudCAqIDM2MDAgKiAxMDAwKTtcbiAgICAgICAgICAgICAgICB2YXIgbnVldm86YW55ID0gY3J1ZGVbY3VycmVudF07XG4gICAgICAgICAgICAgICAgaWYgKG51ZXZvKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzX3ByaWNlID0gKHNjb3BlID09IGNhbm9uaWNhbCkgPyBudWV2by5wcmljZSA6IG51ZXZvLmludmVyc2U7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzX2ludmVyc2UgPSAoc2NvcGUgPT0gY2Fub25pY2FsKSA/IG51ZXZvLmludmVyc2UgOiBudWV2by5wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNfdm9sdW1lID0gKHNjb3BlID09IGNhbm9uaWNhbCkgPyBudWV2by52b2x1bWUgOiBudWV2by5hbW91bnQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzX2Ftb3VudCA9IChzY29wZSA9PSBjYW5vbmljYWwpID8gbnVldm8uYW1vdW50IDogbnVldm8udm9sdW1lO1xuICAgICAgICAgICAgICAgICAgICBudWV2by5wcmljZSA9IHNfcHJpY2U7XG4gICAgICAgICAgICAgICAgICAgIG51ZXZvLmludmVyc2UgPSBzX2ludmVyc2U7XG4gICAgICAgICAgICAgICAgICAgIG51ZXZvLnZvbHVtZSA9IHNfdm9sdW1lO1xuICAgICAgICAgICAgICAgICAgICBudWV2by5hbW91bnQgPSBzX2Ftb3VudDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBudWV2byA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiB0aGlzLmF1eEdldExhYmVsRm9ySG91cihjdXJyZW50ICUgMjQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogaW52ZXJzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZTogWkVST19DVVJSRU5DWSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFtb3VudDogWkVST19DT01PRElUWSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IGN1cnJlbnRfZGF0ZS50b0lTT1N0cmluZygpLnNwbGl0KFwiLlwiKVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdXI6IGN1cnJlbnRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGFzdF8yNGhbY3VycmVudF0gPSBjcnVkZVtjdXJyZW50XSB8fCBudWV2bztcbiAgICAgICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiY3VycmVudF9kYXRlOlwiLCBjdXJyZW50X2RhdGUudG9JU09TdHJpbmcoKSwgY3VycmVudCwgbGFzdF8yNGhbY3VycmVudF0pO1xuXG4gICAgICAgICAgICAgICAgLy8gY29uaW5pY2FsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICBwcmljZSA9IGxhc3RfMjRoW2N1cnJlbnRdLnByaWNlO1xuICAgICAgICAgICAgICAgIHZhciB2b2wgPSBuZXcgQXNzZXRERVgobGFzdF8yNGhbY3VycmVudF0udm9sdW1lLCB0aGlzKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydCh2b2wudG9rZW4uc3ltYm9sID09IHZvbHVtZS50b2tlbi5zeW1ib2wsIFwiRVJST1I6IGRpZmZlcmVudCB0b2tlbnNcIiwgdm9sLnN0ciwgdm9sdW1lLnN0cik7XG4gICAgICAgICAgICAgICAgdm9sdW1lLmFtb3VudCA9IHZvbHVtZS5hbW91bnQucGx1cyh2b2wuYW1vdW50KTtcbiAgICAgICAgICAgICAgICBpZiAocHJpY2UgIT0gWkVST19DVVJSRU5DWSAmJiAhcHJpY2VfZnN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHByaWNlX2ZzdCA9IG5ldyBBc3NldERFWChwcmljZSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByaWNlX2Fzc2V0ID0gbmV3IEFzc2V0REVYKHByaWNlLCB0aGlzKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChwcmljZV9hc3NldC50b2tlbi5zeW1ib2wgPT0gbWF4X3ByaWNlLnRva2VuLnN5bWJvbCwgXCJFUlJPUjogZGlmZmVyZW50IHRva2Vuc1wiLCBwcmljZV9hc3NldC5zdHIsIG1heF9wcmljZS5zdHIpO1xuICAgICAgICAgICAgICAgIGlmIChwcmljZV9hc3NldC5hbW91bnQuaXNHcmVhdGVyVGhhbihtYXhfcHJpY2UuYW1vdW50KSkge1xuICAgICAgICAgICAgICAgICAgICBtYXhfcHJpY2UgPSBwcmljZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChwcmljZV9hc3NldC50b2tlbi5zeW1ib2wgPT0gbWluX3ByaWNlLnRva2VuLnN5bWJvbCwgXCJFUlJPUjogZGlmZmVyZW50IHRva2Vuc1wiLCBwcmljZV9hc3NldC5zdHIsIG1pbl9wcmljZS5zdHIpO1xuICAgICAgICAgICAgICAgIGlmIChtaW5fcHJpY2UuYW1vdW50LmlzRXF1YWxUbygwKSB8fCBwcmljZV9hc3NldC5hbW91bnQuaXNMZXNzVGhhbihtaW5fcHJpY2UuYW1vdW50KSkge1xuICAgICAgICAgICAgICAgICAgICBtaW5fcHJpY2UgPSBwcmljZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHJldmVyc2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIGludmVyc2UgPSBsYXN0XzI0aFtjdXJyZW50XS5pbnZlcnNlO1xuICAgICAgICAgICAgICAgIHZhciBhbW8gPSBuZXcgQXNzZXRERVgobGFzdF8yNGhbY3VycmVudF0uYW1vdW50LCB0aGlzKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChhbW8udG9rZW4uc3ltYm9sID09IGFtb3VudC50b2tlbi5zeW1ib2wsIFwiRVJST1I6IGRpZmZlcmVudCB0b2tlbnNcIiwgYW1vLnN0ciwgYW1vdW50LnN0cik7XG4gICAgICAgICAgICAgICAgYW1vdW50LmFtb3VudCA9IGFtb3VudC5hbW91bnQucGx1cyhhbW8uYW1vdW50KTtcbiAgICAgICAgICAgICAgICBpZiAoaW52ZXJzZSAhPSBaRVJPX0NPTU9ESVRZICYmICFpbnZlcnNlX2ZzdCkge1xuICAgICAgICAgICAgICAgICAgICBpbnZlcnNlX2ZzdCA9IG5ldyBBc3NldERFWChpbnZlcnNlLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW52ZXJzZV9hc3NldCA9IG5ldyBBc3NldERFWChpbnZlcnNlLCB0aGlzKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChpbnZlcnNlX2Fzc2V0LnRva2VuLnN5bWJvbCA9PSBtYXhfaW52ZXJzZS50b2tlbi5zeW1ib2wsIFwiRVJST1I6IGRpZmZlcmVudCB0b2tlbnNcIiwgaW52ZXJzZV9hc3NldC5zdHIsIG1heF9pbnZlcnNlLnN0cik7XG4gICAgICAgICAgICAgICAgaWYgKGludmVyc2VfYXNzZXQuYW1vdW50LmlzR3JlYXRlclRoYW4obWF4X2ludmVyc2UuYW1vdW50KSkge1xuICAgICAgICAgICAgICAgICAgICBtYXhfaW52ZXJzZSA9IGludmVyc2VfYXNzZXQuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoaW52ZXJzZV9hc3NldC50b2tlbi5zeW1ib2wgPT0gbWluX2ludmVyc2UudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiBkaWZmZXJlbnQgdG9rZW5zXCIsIGludmVyc2VfYXNzZXQuc3RyLCBtaW5faW52ZXJzZS5zdHIpO1xuICAgICAgICAgICAgICAgIGlmIChtaW5faW52ZXJzZS5hbW91bnQuaXNFcXVhbFRvKDApIHx8IGludmVyc2VfYXNzZXQuYW1vdW50LmlzTGVzc1RoYW4obWluX2ludmVyc2UuYW1vdW50KSkge1xuICAgICAgICAgICAgICAgICAgICBtaW5faW52ZXJzZSA9IGludmVyc2VfYXNzZXQuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBjb25pbmljYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgaWYgKCFwcmljZV9mc3QpIHtcbiAgICAgICAgICAgICAgICBwcmljZV9mc3QgPSBuZXcgQXNzZXRERVgobGFzdF8yNGhbc3RhcnRfaG91cl0ucHJpY2UsIHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGxhc3RfcHJpY2UgPSAgbmV3IEFzc2V0REVYKGxhc3RfMjRoW25vd19ob3VyXS5wcmljZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgZGlmZiA9IGxhc3RfcHJpY2UuY2xvbmUoKTtcbiAgICAgICAgICAgIC8vIGRpZmYuYW1vdW50IFxuICAgICAgICAgICAgZGlmZi5hbW91bnQgPSBsYXN0X3ByaWNlLmFtb3VudC5taW51cyhwcmljZV9mc3QuYW1vdW50KTtcbiAgICAgICAgICAgIHZhciByYXRpbzpudW1iZXIgPSAwO1xuICAgICAgICAgICAgaWYgKHByaWNlX2ZzdC5hbW91bnQudG9OdW1iZXIoKSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgcmF0aW8gPSBkaWZmLmFtb3VudC5kaXZpZGVkQnkocHJpY2VfZnN0LmFtb3VudCkudG9OdW1iZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwZXJjZW50ID0gTWF0aC5mbG9vcihyYXRpbyAqIDEwMDAwKSAvIDEwMDtcblxuICAgICAgICAgICAgLy8gcmV2ZXJzZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBpZiAoIWludmVyc2VfZnN0KSB7XG4gICAgICAgICAgICAgICAgaW52ZXJzZV9mc3QgPSBuZXcgQXNzZXRERVgobGFzdF8yNGhbc3RhcnRfaG91cl0uaW52ZXJzZSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbGFzdF9pbnZlcnNlID0gIG5ldyBBc3NldERFWChsYXN0XzI0aFtub3dfaG91cl0uaW52ZXJzZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgaWRpZmYgPSBsYXN0X2ludmVyc2UuY2xvbmUoKTtcbiAgICAgICAgICAgIC8vIGRpZmYuYW1vdW50IFxuICAgICAgICAgICAgaWRpZmYuYW1vdW50ID0gbGFzdF9pbnZlcnNlLmFtb3VudC5taW51cyhpbnZlcnNlX2ZzdC5hbW91bnQpO1xuICAgICAgICAgICAgcmF0aW8gPSAwO1xuICAgICAgICAgICAgaWYgKGludmVyc2VfZnN0LmFtb3VudC50b051bWJlcigpICE9IDApIHtcbiAgICAgICAgICAgICAgICByYXRpbyA9IGRpZmYuYW1vdW50LmRpdmlkZWRCeShpbnZlcnNlX2ZzdC5hbW91bnQpLnRvTnVtYmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaXBlcmNlbnQgPSBNYXRoLmZsb29yKHJhdGlvICogMTAwMDApIC8gMTAwO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcInByaWNlX2ZzdDpcIiwgcHJpY2VfZnN0LnN0cik7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiaW52ZXJzZV9mc3Q6XCIsIGludmVyc2VfZnN0LnN0cik7XG5cbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJsYXN0XzI0aDpcIiwgW2xhc3RfMjRoXSk7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiZGlmZjpcIiwgZGlmZi50b1N0cmluZyg4KSk7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwicGVyY2VudDpcIiwgcGVyY2VudCk7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwicmF0aW86XCIsIHJhdGlvKTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJ2b2x1bWU6XCIsIHZvbHVtZS5zdHIpO1xuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5wcmljZSA9IGxhc3RfcHJpY2U7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5pbnZlcnNlID0gbGFzdF9pbnZlcnNlO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkucHJpY2VfMjRoX2FnbyA9IHByaWNlX2ZzdCB8fCBsYXN0X3ByaWNlO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkuaW52ZXJzZV8yNGhfYWdvID0gaW52ZXJzZV9mc3Q7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5wZXJjZW50X3N0ciA9IChpc05hTihwZXJjZW50KSA/IDAgOiBwZXJjZW50KSArIFwiJVwiO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkucGVyY2VudCA9IGlzTmFOKHBlcmNlbnQpID8gMCA6IHBlcmNlbnQ7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5pcGVyY2VudF9zdHIgPSAoaXNOYU4oaXBlcmNlbnQpID8gMCA6IGlwZXJjZW50KSArIFwiJVwiO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkuaXBlcmNlbnQgPSBpc05hTihpcGVyY2VudCkgPyAwIDogaXBlcmNlbnQ7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS52b2x1bWUgPSB2b2x1bWU7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5hbW91bnQgPSBhbW91bnQ7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5taW5fcHJpY2UgPSBtaW5fcHJpY2U7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5tYXhfcHJpY2UgPSBtYXhfcHJpY2U7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5taW5faW52ZXJzZSA9IG1pbl9pbnZlcnNlO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkubWF4X2ludmVyc2UgPSBtYXhfaW52ZXJzZTtcblxuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcIlN1bW1hcnkgZmluYWw6XCIsIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5KTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInN1bW1hcnkuXCIrY2Fub25pY2FsLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInN1bW1hcnkuXCIraW52ZXJzZSwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5O1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5fbWFya2V0c1tjYW5vbmljYWxdICYmICFmb3JjZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhd2FpdCBhdXg7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldE1hcmtldFN1bW1hcnkoKTtcbiAgICAgICAgdGhpcy5vbk1hcmtldFN1bW1hcnkubmV4dChyZXN1bHQpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QWxsVGFibGVzU3VtYXJpZXMoKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdE9yZGVyU3VtbWFyeS50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIHByb21pc2VzID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5fbWFya2V0cykge1xuICAgICAgICAgICAgICAgIGlmIChpLmluZGV4T2YoXCIuXCIpID09IC0xKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHRoaXMuZ2V0VGFibGVTdW1tYXJ5KHRoaXMuX21hcmtldHNbaV0uY29tb2RpdHksIHRoaXMuX21hcmtldHNbaV0uY3VycmVuY3ksIHRydWUpO1xuICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2gocCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihfID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRva2Vuc1N1bW1hcnkoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgIH1cbiAgICBcblxuICAgIC8vXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBdXggZnVuY3Rpb25zXG4gICAgcHJpdmF0ZSBhdXhQcm9jZXNzUm93c1RvT3JkZXJzKHJvd3M6YW55W10pOiBPcmRlcltdIHtcbiAgICAgICAgdmFyIHJlc3VsdDogT3JkZXJbXSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGkgPCByb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcHJpY2UgPSBuZXcgQXNzZXRERVgocm93c1tpXS5wcmljZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgaW52ZXJzZSA9IG5ldyBBc3NldERFWChyb3dzW2ldLmludmVyc2UsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNlbGxpbmcgPSBuZXcgQXNzZXRERVgocm93c1tpXS5zZWxsaW5nLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IG5ldyBBc3NldERFWChyb3dzW2ldLnRvdGFsLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBvcmRlcjpPcmRlcjtcblxuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcy5nZXRTY29wZUZvcihwcmljZS50b2tlbiwgaW52ZXJzZS50b2tlbik7XG4gICAgICAgICAgICB2YXIgY2Fub25pY2FsID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgICAgICB2YXIgcmV2ZXJzZV9zY29wZSA9IHRoaXMuaW52ZXJzZVNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgaWYgKHJldmVyc2Vfc2NvcGUgPT0gc2NvcGUpIHtcbiAgICAgICAgICAgICAgICBvcmRlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHJvd3NbaV0uaWQsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlOiBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogaW52ZXJzZSxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHNlbGxpbmcsXG4gICAgICAgICAgICAgICAgICAgIGRlcG9zaXQ6IHNlbGxpbmcsXG4gICAgICAgICAgICAgICAgICAgIHRlbG9zOiB0b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IHJvd3NbaV0ub3duZXJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9yZGVyID0ge1xuICAgICAgICAgICAgICAgICAgICBpZDogcm93c1tpXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGludmVyc2UsXG4gICAgICAgICAgICAgICAgICAgIGludmVyc2U6IHByaWNlLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwsXG4gICAgICAgICAgICAgICAgICAgIGRlcG9zaXQ6IHNlbGxpbmcsXG4gICAgICAgICAgICAgICAgICAgIHRlbG9zOiBzZWxsaW5nLFxuICAgICAgICAgICAgICAgICAgICBvd25lcjogcm93c1tpXS5vd25lclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG9yZGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXV4R2V0TGFiZWxGb3JIb3VyKGhoOm51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIHZhciBob3VycyA9IFtcbiAgICAgICAgICAgIFwiaC56ZXJvXCIsXG4gICAgICAgICAgICBcImgub25lXCIsXG4gICAgICAgICAgICBcImgudHdvXCIsXG4gICAgICAgICAgICBcImgudGhyZWVcIixcbiAgICAgICAgICAgIFwiaC5mb3VyXCIsXG4gICAgICAgICAgICBcImguZml2ZVwiLFxuICAgICAgICAgICAgXCJoLnNpeFwiLFxuICAgICAgICAgICAgXCJoLnNldmVuXCIsXG4gICAgICAgICAgICBcImguZWlnaHRcIixcbiAgICAgICAgICAgIFwiaC5uaW5lXCIsXG4gICAgICAgICAgICBcImgudGVuXCIsXG4gICAgICAgICAgICBcImguZWxldmVuXCIsXG4gICAgICAgICAgICBcImgudHdlbHZlXCIsXG4gICAgICAgICAgICBcImgudGhpcnRlZW5cIixcbiAgICAgICAgICAgIFwiaC5mb3VydGVlblwiLFxuICAgICAgICAgICAgXCJoLmZpZnRlZW5cIixcbiAgICAgICAgICAgIFwiaC5zaXh0ZWVuXCIsXG4gICAgICAgICAgICBcImguc2V2ZW50ZWVuXCIsXG4gICAgICAgICAgICBcImguZWlnaHRlZW5cIixcbiAgICAgICAgICAgIFwiaC5uaW5ldGVlblwiLFxuICAgICAgICAgICAgXCJoLnR3ZW50eVwiLFxuICAgICAgICAgICAgXCJoLnR3ZW50eW9uZVwiLFxuICAgICAgICAgICAgXCJoLnR3ZW50eXR3b1wiLFxuICAgICAgICAgICAgXCJoLnR3ZW50eXRocmVlXCJcbiAgICAgICAgXVxuICAgICAgICByZXR1cm4gaG91cnNbaGhdO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXV4QXNzZXJ0U2NvcGUoc2NvcGU6c3RyaW5nKTogTWFya2V0IHtcbiAgICAgICAgdmFyIGNvbW9kaXR5X3N5bSA9IHNjb3BlLnNwbGl0KFwiLlwiKVswXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICB2YXIgY3VycmVuY3lfc3ltID0gc2NvcGUuc3BsaXQoXCIuXCIpWzFdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIHZhciBjb21vZGl0eSA9IHRoaXMuZ2V0VG9rZW5Ob3coY29tb2RpdHlfc3ltKTtcbiAgICAgICAgdmFyIGN1cnJlbmN5ID0gdGhpcy5nZXRUb2tlbk5vdyhjdXJyZW5jeV9zeW0pO1xuICAgICAgICB2YXIgYXV4X2Fzc2V0X2NvbSA9IG5ldyBBc3NldERFWCgwLCBjb21vZGl0eSk7XG4gICAgICAgIHZhciBhdXhfYXNzZXRfY3VyID0gbmV3IEFzc2V0REVYKDAsIGN1cnJlbmN5KTtcblxuICAgICAgICB2YXIgbWFya2V0X3N1bW1hcnk6TWFya2V0U3VtbWFyeSA9IHtcbiAgICAgICAgICAgIHNjb3BlOiBzY29wZSxcbiAgICAgICAgICAgIHByaWNlOiBhdXhfYXNzZXRfY3VyLFxuICAgICAgICAgICAgcHJpY2VfMjRoX2FnbzogYXV4X2Fzc2V0X2N1cixcbiAgICAgICAgICAgIGludmVyc2U6IGF1eF9hc3NldF9jb20sXG4gICAgICAgICAgICBpbnZlcnNlXzI0aF9hZ286IGF1eF9hc3NldF9jb20sXG4gICAgICAgICAgICBtYXhfaW52ZXJzZTogYXV4X2Fzc2V0X2NvbSxcbiAgICAgICAgICAgIG1heF9wcmljZTogYXV4X2Fzc2V0X2N1cixcbiAgICAgICAgICAgIG1pbl9pbnZlcnNlOiBhdXhfYXNzZXRfY29tLFxuICAgICAgICAgICAgbWluX3ByaWNlOiBhdXhfYXNzZXRfY3VyLFxuICAgICAgICAgICAgcmVjb3JkczogW10sXG4gICAgICAgICAgICB2b2x1bWU6IGF1eF9hc3NldF9jdXIsXG4gICAgICAgICAgICBhbW91bnQ6IGF1eF9hc3NldF9jb20sXG4gICAgICAgICAgICBwZXJjZW50OiAwLFxuICAgICAgICAgICAgaXBlcmNlbnQ6IDAsXG4gICAgICAgICAgICBwZXJjZW50X3N0cjogXCIwJVwiLFxuICAgICAgICAgICAgaXBlcmNlbnRfc3RyOiBcIjAlXCIsXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fbWFya2V0c1tzY29wZV0gfHwge1xuICAgICAgICAgICAgc2NvcGU6IHNjb3BlLFxuICAgICAgICAgICAgY29tb2RpdHk6IGNvbW9kaXR5LFxuICAgICAgICAgICAgY3VycmVuY3k6IGN1cnJlbmN5LFxuICAgICAgICAgICAgb3JkZXJzOiB7IHNlbGw6IFtdLCBidXk6IFtdIH0sXG4gICAgICAgICAgICBkZWFsczogMCxcbiAgICAgICAgICAgIGhpc3Rvcnk6IFtdLFxuICAgICAgICAgICAgdHg6IHt9LFxuICAgICAgICAgICAgYmxvY2tzOiAwLFxuICAgICAgICAgICAgYmxvY2s6IHt9LFxuICAgICAgICAgICAgYmxvY2tsaXN0OiBbXSxcbiAgICAgICAgICAgIGJsb2NrbGV2ZWxzOiBbW11dLFxuICAgICAgICAgICAgcmV2ZXJzZWJsb2NrczogW10sXG4gICAgICAgICAgICByZXZlcnNlbGV2ZWxzOiBbW11dLFxuICAgICAgICAgICAgc3VtbWFyeTogbWFya2V0X3N1bW1hcnksXG4gICAgICAgICAgICBoZWFkZXI6IHsgXG4gICAgICAgICAgICAgICAgc2VsbDoge3RvdGFsOmF1eF9hc3NldF9jb20sIG9yZGVyczowfSwgXG4gICAgICAgICAgICAgICAgYnV5OiB7dG90YWw6YXV4X2Fzc2V0X2N1ciwgb3JkZXJzOjB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9OyAgICAgICAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaERlcG9zaXRzKGFjY291bnQpOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwiZGVwb3NpdHNcIiwge3Njb3BlOmFjY291bnR9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGZldGNoQmFsYW5jZXMoYWNjb3VudCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciBjb250cmFjdHMgPSB7fTtcbiAgICAgICAgICAgIHZhciBiYWxhbmNlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnRva2Vucykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRva2Vuc1tpXS5vZmZjaGFpbikgY29udGludWU7XG4gICAgICAgICAgICAgICAgY29udHJhY3RzW3RoaXMudG9rZW5zW2ldLmNvbnRyYWN0XSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBjb250cmFjdCBpbiBjb250cmFjdHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJhbGFuY2VzLVwiK2NvbnRyYWN0LCB0cnVlKTtcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAodmFyIGNvbnRyYWN0IGluIGNvbnRyYWN0cykge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBhd2FpdCB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwiYWNjb3VudHNcIiwge1xuICAgICAgICAgICAgICAgICAgICBjb250cmFjdDpjb250cmFjdCxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6IGFjY291bnQgfHwgdGhpcy5jdXJyZW50Lm5hbWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHJlc3VsdC5yb3dzKSB7XG4gICAgICAgICAgICAgICAgICAgIGJhbGFuY2VzLnB1c2gobmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmJhbGFuY2UsIHRoaXMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJiYWxhbmNlcy1cIitjb250cmFjdCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGJhbGFuY2VzO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZldGNoT3JkZXJzKHBhcmFtczpUYWJsZVBhcmFtcyk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJzZWxsb3JkZXJzXCIsIHBhcmFtcykudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaE9yZGVyU3VtbWFyeSgpOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwib3JkZXJzdW1tYXJ5XCIpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hCbG9ja0hpc3Rvcnkoc2NvcGU6c3RyaW5nLCBwYWdlOm51bWJlciA9IDAsIHBhZ2VzaXplOm51bWJlciA9IDI1KTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuICAgICAgICB2YXIgY2Fub25pY2FsOnN0cmluZyA9IHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpO1xuICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLmdldEJsb2NrSGlzdG9yeVRvdGFsUGFnZXNGb3IoY2Fub25pY2FsLCBwYWdlc2l6ZSk7XG4gICAgICAgIHZhciBpZCA9IHBhZ2UqcGFnZXNpemU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmZldGNoQmxvY2tIaXN0b3J5KFwiLCBzY29wZSwgXCIsXCIscGFnZSxcIixcIixwYWdlc2l6ZSxcIik6IGlkOlwiLCBpZCwgXCJwYWdlczpcIiwgcGFnZXMpO1xuICAgICAgICBpZiAocGFnZSA8IHBhZ2VzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbWFya2V0cyAmJiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gJiYgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmJsb2NrW1wiaWQtXCIgKyBpZF0pIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0OlRhYmxlUmVzdWx0ID0ge21vcmU6ZmFsc2Uscm93czpbXX07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHBhZ2VzaXplOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkX2kgPSBpZCtpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmxvY2sgPSB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uYmxvY2tbXCJpZC1cIiArIGlkX2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5yb3dzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5yb3dzLmxlbmd0aCA9PSBwYWdlc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBoYXZlIHRoZSBjb21wbGV0ZSBwYWdlIGluIG1lbW9yeVxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5mZXRjaEhpc3RvcnkoXCIsIHNjb3BlLCBcIixcIixwYWdlLFwiLFwiLHBhZ2VzaXplLFwiKTogcmVzdWx0OlwiLCByZXN1bHQucm93cy5tYXAoKHsgaWQgfSkgPT4gaWQpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcImJsb2NraGlzdG9yeVwiLCB7c2NvcGU6Y2Fub25pY2FsLCBsaW1pdDpwYWdlc2l6ZSwgbG93ZXJfYm91bmQ6XCJcIisocGFnZSpwYWdlc2l6ZSl9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJibG9jayBIaXN0b3J5IGNydWRvOlwiLCByZXN1bHQpO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdID0gdGhpcy5hdXhBc3NlcnRTY29wZShjYW5vbmljYWwpO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmJsb2NrID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmJsb2NrIHx8IHt9OyBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGhpcy5fbWFya2V0c1tzY29wZV0uYmxvY2s6XCIsIHRoaXMuX21hcmtldHNbc2NvcGVdLmJsb2NrKTtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaSA8IHJlc3VsdC5yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJsb2NrOkhpc3RvcnlCbG9jayA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHJlc3VsdC5yb3dzW2ldLmlkLFxuICAgICAgICAgICAgICAgICAgICBob3VyOiByZXN1bHQucm93c1tpXS5ob3VyLFxuICAgICAgICAgICAgICAgICAgICBzdHI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIHByaWNlOiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0ucHJpY2UsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uaW52ZXJzZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGVudHJhbmNlOiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uZW50cmFuY2UsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBtYXg6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5tYXgsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBtaW46IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5taW4sIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICB2b2x1bWU6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS52b2x1bWUsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBhbW91bnQ6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5hbW91bnQsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShyZXN1bHQucm93c1tpXS5kYXRlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBibG9jay5zdHIgPSBKU09OLnN0cmluZ2lmeShbYmxvY2subWF4LnN0ciwgYmxvY2suZW50cmFuY2Uuc3RyLCBibG9jay5wcmljZS5zdHIsIGJsb2NrLm1pbi5zdHJdKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uYmxvY2tbXCJpZC1cIiArIGJsb2NrLmlkXSA9IGJsb2NrO1xuICAgICAgICAgICAgfSAgIFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJibG9jayBIaXN0b3J5IGZpbmFsOlwiLCB0aGlzLl9tYXJrZXRzW3Njb3BlXS5ibG9jayk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICB9ICAgIFxuXG4gICAgcHJpdmF0ZSBmZXRjaEhpc3Rvcnkoc2NvcGU6c3RyaW5nLCBwYWdlOm51bWJlciA9IDAsIHBhZ2VzaXplOm51bWJlciA9IDI1KTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuICAgICAgICB2YXIgY2Fub25pY2FsOnN0cmluZyA9IHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpO1xuICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLmdldEhpc3RvcnlUb3RhbFBhZ2VzRm9yKGNhbm9uaWNhbCwgcGFnZXNpemUpO1xuICAgICAgICB2YXIgaWQgPSBwYWdlKnBhZ2VzaXplO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5mZXRjaEhpc3RvcnkoXCIsIHNjb3BlLCBcIixcIixwYWdlLFwiLFwiLHBhZ2VzaXplLFwiKTogaWQ6XCIsIGlkLCBcInBhZ2VzOlwiLCBwYWdlcyk7XG4gICAgICAgIGlmIChwYWdlIDwgcGFnZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXJrZXRzICYmIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSAmJiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0udHhbXCJpZC1cIiArIGlkXSkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQ6VGFibGVSZXN1bHQgPSB7bW9yZTpmYWxzZSxyb3dzOltdfTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8cGFnZXNpemU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWRfaSA9IGlkK2k7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0cnggPSB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0udHhbXCJpZC1cIiArIGlkX2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHJ4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucm93cy5wdXNoKHRyeCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnJvd3MubGVuZ3RoID09IHBhZ2VzaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGhhdmUgdGhlIGNvbXBsZXRlIHBhZ2UgaW4gbWVtb3J5XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmZldGNoSGlzdG9yeShcIiwgc2NvcGUsIFwiLFwiLHBhZ2UsXCIsXCIscGFnZXNpemUsXCIpOiByZXN1bHQ6XCIsIHJlc3VsdC5yb3dzLm1hcCgoeyBpZCB9KSA9PiBpZCkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwiaGlzdG9yeVwiLCB7c2NvcGU6c2NvcGUsIGxpbWl0OnBhZ2VzaXplLCBsb3dlcl9ib3VuZDpcIlwiKyhwYWdlKnBhZ2VzaXplKX0pLnRoZW4ocmVzdWx0ID0+IHtcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKlwiKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiSGlzdG9yeSBjcnVkbzpcIiwgcmVzdWx0KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdID0gdGhpcy5hdXhBc3NlcnRTY29wZShjYW5vbmljYWwpO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmhpc3RvcnkgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eCA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eCB8fCB7fTsgXG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGhpcy5zY29wZXNbc2NvcGVdLnR4OlwiLCB0aGlzLnNjb3Blc1tzY29wZV0udHgpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGkgPCByZXN1bHQucm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciB0cmFuc2FjdGlvbjpIaXN0b3J5VHggPSB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiByZXN1bHQucm93c1tpXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgc3RyOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICBhbW91bnQ6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5hbW91bnQsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBwYXltZW50OiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0ucGF5bWVudCwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGJ1eWZlZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmJ1eWZlZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHNlbGxmZWU6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5zZWxsZmVlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5wcmljZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGludmVyc2U6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5pbnZlcnNlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgYnV5ZXI6IHJlc3VsdC5yb3dzW2ldLmJ1eWVyLFxuICAgICAgICAgICAgICAgICAgICBzZWxsZXI6IHJlc3VsdC5yb3dzW2ldLnNlbGxlcixcbiAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUocmVzdWx0LnJvd3NbaV0uZGF0ZSksXG4gICAgICAgICAgICAgICAgICAgIGlzYnV5OiAhIXJlc3VsdC5yb3dzW2ldLmlzYnV5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRyYW5zYWN0aW9uLnN0ciA9IHRyYW5zYWN0aW9uLnByaWNlLnN0ciArIFwiIFwiICsgdHJhbnNhY3Rpb24uYW1vdW50LnN0cjtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0udHhbXCJpZC1cIiArIHRyYW5zYWN0aW9uLmlkXSA9IHRyYW5zYWN0aW9uO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBqIGluIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5oaXN0b3J5LnB1c2godGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnR4W2pdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmhpc3Rvcnkuc29ydChmdW5jdGlvbihhOkhpc3RvcnlUeCwgYjpIaXN0b3J5VHgpe1xuICAgICAgICAgICAgICAgIGlmKGEuZGF0ZSA8IGIuZGF0ZSkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgaWYoYS5kYXRlID4gYi5kYXRlKSByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgaWYoYS5pZCA8IGIuaWQpIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmKGEuaWQgPiBiLmlkKSByZXR1cm4gLTE7XG4gICAgICAgICAgICB9KTsgICAgICAgICAgICBcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJIaXN0b3J5IGZpbmFsOlwiLCB0aGlzLnNjb3Blc1tzY29wZV0uaGlzdG9yeSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBhc3luYyBmZXRjaEFjdGl2aXR5KHBhZ2U6bnVtYmVyID0gMCwgcGFnZXNpemU6bnVtYmVyID0gMjUpIHtcbiAgICAgICAgdmFyIGlkID0gcGFnZSpwYWdlc2l6ZSsxO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5mZXRjaEFjdGl2aXR5KFwiLCBwYWdlLFwiLFwiLHBhZ2VzaXplLFwiKTogaWQ6XCIsIGlkKTtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLmFjdGl2aXR5LmV2ZW50c1tcImlkLVwiICsgaWRdKSB7XG4gICAgICAgICAgICB2YXIgcGFnZUV2ZW50cyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHBhZ2VzaXplOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaWRfaSA9IGlkK2k7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gdGhpcy5hY3Rpdml0eS5ldmVudHNbXCJpZC1cIiArIGlkX2ldO1xuICAgICAgICAgICAgICAgIGlmICghZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhZ2VFdmVudHMubGVuZ3RoID09IHBhZ2VzaXplKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcbiAgICAgICAgfSAgICAgICAgXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJldmVudHNcIiwge2xpbWl0OnBhZ2VzaXplLCBsb3dlcl9ib3VuZDpcIlwiK2lkfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKlwiKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQWN0aXZpdHkgY3J1ZG86XCIsIHJlc3VsdCk7XG4gICAgICAgICAgICB2YXIgbGlzdDpFdmVudExvZ1tdID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaSA8IHJlc3VsdC5yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcmVzdWx0LnJvd3NbaV0uaWQ7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50OkV2ZW50TG9nID0gPEV2ZW50TG9nPnJlc3VsdC5yb3dzW2ldO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5hY3Rpdml0eS5ldmVudHNbXCJpZC1cIiArIGlkXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2aXR5LmV2ZW50c1tcImlkLVwiICsgaWRdID0gZXZlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKio+Pj4+PlwiLCBpZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmFjdGl2aXR5Lmxpc3QgPSBbXS5jb25jYXQodGhpcy5hY3Rpdml0eS5saXN0KS5jb25jYXQobGlzdCk7XG4gICAgICAgICAgICB0aGlzLmFjdGl2aXR5Lmxpc3Quc29ydChmdW5jdGlvbihhOkV2ZW50TG9nLCBiOkV2ZW50TG9nKXtcbiAgICAgICAgICAgICAgICBpZihhLmRhdGUgPCBiLmRhdGUpIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmKGEuZGF0ZSA+IGIuZGF0ZSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIGlmKGEuaWQgPCBiLmlkKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBpZihhLmlkID4gYi5pZCkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIGZldGNoVXNlck9yZGVycyh1c2VyOnN0cmluZyk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJ1c2Vyb3JkZXJzXCIsIHtzY29wZTp1c2VyLCBsaW1pdDoyMDB9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBmZXRjaFN1bW1hcnkoc2NvcGUpOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwidGFibGVzdW1tYXJ5XCIsIHtzY29wZTpzY29wZX0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hUb2tlblN0YXRzKHRva2VuKTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInRva2VuLXN0YXQtXCIrdG9rZW4uc3ltYm9sLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJzdGF0XCIsIHtjb250cmFjdDp0b2tlbi5jb250cmFjdCwgc2NvcGU6dG9rZW4uc3ltYm9sfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgdG9rZW4uc3RhdCA9IHJlc3VsdC5yb3dzWzBdO1xuICAgICAgICAgICAgaWYgKHRva2VuLnN0YXQuaXNzdWVycyAmJiB0b2tlbi5zdGF0Lmlzc3VlcnNbMF0gPT0gXCJldmVyeW9uZVwiKSB7XG4gICAgICAgICAgICAgICAgdG9rZW4uZmFrZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInRva2VuLXN0YXQtXCIrdG9rZW4uc3ltYm9sLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hUb2tlbnNTdGF0cyhleHRlbmRlZDogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWUuZmV0Y2hUb2tlbnMoKVwiKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ0b2tlbi1zdGF0c1wiLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKF8gPT4ge1xuXG4gICAgICAgICAgICB2YXIgcHJpb21pc2VzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMudG9rZW5zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudG9rZW5zW2ldLm9mZmNoYWluKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBwcmlvbWlzZXMucHVzaCh0aGlzLmZldGNoVG9rZW5TdGF0cyh0aGlzLnRva2Vuc1tpXSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGw8YW55PihwcmlvbWlzZXMpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRva2VuU3RhdHModGhpcy50b2tlbnMpO1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidG9rZW4tc3RhdHNcIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2VucztcbiAgICAgICAgICAgIH0pOyAgICAgICAgICAgIFxuICAgICAgICB9KTtcblxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHVwZGF0ZVRva2Vuc1N1bW1hcnkodGltZXM6IG51bWJlciA9IDIwKSB7XG4gICAgICAgIGlmICh0aW1lcyA+IDEpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSB0aW1lczsgaT4wOyBpLS0pIHRoaXMudXBkYXRlVG9rZW5zU3VtbWFyeSgxKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMud2FpdFRva2Vuc0xvYWRlZCxcbiAgICAgICAgICAgIHRoaXMud2FpdE1hcmtldFN1bW1hcnlcbiAgICAgICAgXSkudGhlbihfID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKGluaSkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWUudXBkYXRlVG9rZW5zU3VtbWFyeSgpXCIpOyBcblxuICAgICAgICAgICAgLy8gbWFwcGluZyBvZiBob3cgbXVjaCAoYW1vdW50IG9mKSB0b2tlbnMgaGF2ZSBiZWVuIHRyYWRlZCBhZ3JlZ2F0ZWQgaW4gYWxsIG1hcmtldHNcbiAgICAgICAgICAgIHZhciBhbW91bnRfbWFwOntba2V5OnN0cmluZ106QXNzZXRERVh9ID0ge307XG5cbiAgICAgICAgICAgIC8vIGEgY2FkYSB0b2tlbiBsZSBhc2lnbm8gdW4gcHJpY2UgcXVlIHNhbGUgZGUgdmVyaWZpY2FyIHN1IHByaWNlIGVuIGVsIG1lcmNhZG8gcHJpbmNpcGFsIFhYWC9UTE9TXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMudG9rZW5zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudG9rZW5zW2ldLm9mZmNoYWluKSBjb250aW51ZTsgLy8gZGlzY2FyZCB0b2tlbnMgdGhhdCBhcmUgbm90IG9uLWNoYWluXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHRva2VuID0gdGhpcy50b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgdmFyIHF1YW50aXR5OkFzc2V0REVYID0gbmV3IEFzc2V0REVYKDAsIHRva2VuKTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gdGhpcy5fbWFya2V0cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoai5pbmRleE9mKFwiLlwiKSA9PSAtMSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZTpNYXJrZXQgPSB0aGlzLl9tYXJrZXRzW2pdO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmNvbW9kaXR5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gcXVhbnRpdHkucGx1cyh0YWJsZS5zdW1tYXJ5LmFtb3VudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gcXVhbnRpdHkucGx1cyh0YWJsZS5zdW1tYXJ5LnZvbHVtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY29tb2RpdHkuc3ltYm9sID09IHRva2VuLnN5bWJvbCAmJiB0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdGhpcy50ZWxvcy5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbi5zdW1tYXJ5ICYmIHRva2VuLnN1bW1hcnkucHJpY2UuYW1vdW50LnRvTnVtYmVyKCkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5zdW1tYXJ5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbi5zdW1tYXJ5ID0gdG9rZW4uc3VtbWFyeSB8fCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHRhYmxlLnN1bW1hcnkucHJpY2UuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZV8yNGhfYWdvOiB0YWJsZS5zdW1tYXJ5LnByaWNlXzI0aF9hZ28uY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWU6IHRhYmxlLnN1bW1hcnkudm9sdW1lLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyY2VudDogdGFibGUuc3VtbWFyeS5wZXJjZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmNlbnRfc3RyOiB0YWJsZS5zdW1tYXJ5LnBlcmNlbnRfc3RyLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYW1vdW50X21hcFt0b2tlbi5zeW1ib2xdID0gcXVhbnRpdHk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudGVsb3Muc3VtbWFyeSA9IHtcbiAgICAgICAgICAgICAgICBwcmljZTogbmV3IEFzc2V0REVYKDEsIHRoaXMudGVsb3MpLFxuICAgICAgICAgICAgICAgIHByaWNlXzI0aF9hZ286IG5ldyBBc3NldERFWCgxLCB0aGlzLnRlbG9zKSxcbiAgICAgICAgICAgICAgICB2b2x1bWU6IG5ldyBBc3NldERFWCgtMSwgdGhpcy50ZWxvcyksXG4gICAgICAgICAgICAgICAgcGVyY2VudDogMCxcbiAgICAgICAgICAgICAgICBwZXJjZW50X3N0cjogXCIwJVwiXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYW1vdW50X21hcDogXCIsIGFtb3VudF9tYXApO1xuXG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIE9ORSA9IG5ldyBCaWdOdW1iZXIoMSk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy50b2tlbnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLnRva2Vuc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4ub2ZmY2hhaW4pIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmICghdG9rZW4uc3VtbWFyeSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuLnN5bWJvbCA9PSB0aGlzLnRlbG9zLnN5bWJvbCkgY29udGludWU7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJUT0tFTjogLS0tLS0tLS0gXCIsIHRva2VuLnN5bWJvbCwgdG9rZW4uc3VtbWFyeS5wcmljZS5zdHIsIHRva2VuLnN1bW1hcnkucHJpY2VfMjRoX2Fnby5zdHIgKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgdm9sdW1lID0gbmV3IEFzc2V0REVYKDAsIHRoaXMudGVsb3MpO1xuICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IG5ldyBBc3NldERFWCgwLCB0aGlzLnRlbG9zKTtcbiAgICAgICAgICAgICAgICB2YXIgcHJpY2VfaW5pdCA9IG5ldyBBc3NldERFWCgwLCB0aGlzLnRlbG9zKTtcbiAgICAgICAgICAgICAgICB2YXIgdG90YWxfcXVhbnRpdHkgPSBhbW91bnRfbWFwW3Rva2VuLnN5bWJvbF07XG5cbiAgICAgICAgICAgICAgICBpZiAodG90YWxfcXVhbnRpdHkudG9OdW1iZXIoKSA9PSAwKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIC8vIGlmICh0b2tlbi5zeW1ib2wgPT0gXCJBQ09STlwiKSBjb25zb2xlLmxvZyhcIlRPS0VOOiAtLS0tLS0tLSBcIiwgdG9rZW4uc3ltYm9sLCB0b2tlbi5zdW1tYXJ5LnByaWNlLnN0ciwgdG9rZW4uc3VtbWFyeS5wcmljZV8yNGhfYWdvLnN0ciApO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gdGhpcy5fbWFya2V0cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoai5pbmRleE9mKFwiLlwiKSA9PSAtMSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZSA9IHRoaXMuX21hcmtldHNbal07XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW5jeV9wcmljZSA9IHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSBcIlRMT1NcIiA/IE9ORSA6IHRhYmxlLmN1cnJlbmN5LnN1bW1hcnkucHJpY2UuYW1vdW50O1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVuY3lfcHJpY2VfMjRoX2FnbyA9IHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSBcIlRMT1NcIiA/IE9ORSA6IHRhYmxlLmN1cnJlbmN5LnN1bW1hcnkucHJpY2VfMjRoX2Fnby5hbW91bnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sIHx8IHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaG93IG11Y2ggcXVhbnRpdHkgaXMgaW52b2x2ZWQgaW4gdGhpcyBtYXJrZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBxdWFudGl0eSA9IG5ldyBBc3NldERFWCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmNvbW9kaXR5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eSA9IHRhYmxlLnN1bW1hcnkuYW1vdW50LmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eSA9IHRhYmxlLnN1bW1hcnkudm9sdW1lLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgaW5mbHVlbmNlLXdlaWdodCBvZiB0aGlzIG1hcmtldCBvdmVyIHRoZSB0b2tlblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHdlaWdodCA9IHF1YW50aXR5LmFtb3VudC5kaXZpZGVkQnkodG90YWxfcXVhbnRpdHkuYW1vdW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBwcmljZSBvZiB0aGlzIHRva2VuIGluIHRoaXMgbWFya2V0IChleHByZXNzZWQgaW4gVExPUylcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmljZV9hbW91bnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY29tb2RpdHkuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2Ftb3VudCA9IHRhYmxlLnN1bW1hcnkucHJpY2UuYW1vdW50Lm11bHRpcGxpZWRCeSh0YWJsZS5jdXJyZW5jeS5zdW1tYXJ5LnByaWNlLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZV9hbW91bnQgPSB0YWJsZS5zdW1tYXJ5LmludmVyc2UuYW1vdW50Lm11bHRpcGxpZWRCeSh0YWJsZS5jb21vZGl0eS5zdW1tYXJ5LnByaWNlLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGlzIG1hcmtldCB0b2tlbiBwcmljZSBtdWx0aXBsaWVkIGJ5IHRoZSB3aWdodCBvZiB0aGlzIG1hcmtldCAocG9uZGVyYXRlZCBwcmljZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmljZV9pID0gbmV3IEFzc2V0REVYKHByaWNlX2Ftb3VudC5tdWx0aXBsaWVkQnkod2VpZ2h0KSwgdGhpcy50ZWxvcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgcHJpY2Ugb2YgdGhpcyB0b2tlbiBpbiB0aGlzIG1hcmtldCAyNGggYWdvIChleHByZXNzZWQgaW4gVExPUylcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmljZV9pbml0X2Ftb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfaW5pdF9hbW91bnQgPSB0YWJsZS5zdW1tYXJ5LnByaWNlXzI0aF9hZ28uYW1vdW50Lm11bHRpcGxpZWRCeSh0YWJsZS5jdXJyZW5jeS5zdW1tYXJ5LnByaWNlXzI0aF9hZ28uYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2luaXRfYW1vdW50ID0gdGFibGUuc3VtbWFyeS5pbnZlcnNlXzI0aF9hZ28uYW1vdW50Lm11bHRpcGxpZWRCeSh0YWJsZS5jb21vZGl0eS5zdW1tYXJ5LnByaWNlXzI0aF9hZ28uYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoaXMgbWFya2V0IHRva2VuIHByaWNlIDI0aCBhZ28gbXVsdGlwbGllZCBieSB0aGUgd2VpZ2h0IG9mIHRoaXMgbWFya2V0IChwb25kZXJhdGVkIGluaXRfcHJpY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJpY2VfaW5pdF9pID0gbmV3IEFzc2V0REVYKHByaWNlX2luaXRfYW1vdW50Lm11bHRpcGxpZWRCeSh3ZWlnaHQpLCB0aGlzLnRlbG9zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaG93IG11Y2ggdm9sdW1lIGlzIGludm9sdmVkIGluIHRoaXMgbWFya2V0XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdm9sdW1lX2k7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY29tb2RpdHkuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZV9pID0gdGFibGUuc3VtbWFyeS52b2x1bWUuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZV9pID0gdGFibGUuc3VtbWFyeS5hbW91bnQuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhpcyBtYXJrZXQgZG9lcyBub3QgbWVzdXJlIHRoZSB2b2x1bWUgaW4gVExPUywgdGhlbiBjb252ZXJ0IHF1YW50aXR5IHRvIFRMT1MgYnkgbXVsdGlwbGllZCBCeSB2b2x1bWUncyB0b2tlbiBwcmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZvbHVtZV9pLnRva2VuLnN5bWJvbCAhPSB0aGlzLnRlbG9zLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZV9pID0gbmV3IEFzc2V0REVYKHF1YW50aXR5LmFtb3VudC5tdWx0aXBsaWVkQnkocXVhbnRpdHkudG9rZW4uc3VtbWFyeS5wcmljZS5hbW91bnQpLCB0aGlzLnRlbG9zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZSA9IHByaWNlLnBsdXMobmV3IEFzc2V0REVYKHByaWNlX2ksIHRoaXMudGVsb3MpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2luaXQgPSBwcmljZV9pbml0LnBsdXMobmV3IEFzc2V0REVYKHByaWNlX2luaXRfaSwgdGhpcy50ZWxvcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lID0gdm9sdW1lLnBsdXMobmV3IEFzc2V0REVYKHZvbHVtZV9pLCB0aGlzLnRlbG9zKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLWlcIixpLCB0YWJsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gd2VpZ2h0OlwiLCB3ZWlnaHQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gdGFibGUuc3VtbWFyeS5wcmljZS5zdHJcIiwgdGFibGUuc3VtbWFyeS5wcmljZS5zdHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHRhYmxlLnN1bW1hcnkucHJpY2UuYW1vdW50Lm11bHRpcGxpZWRCeSh3ZWlnaHQpLnRvTnVtYmVyKClcIiwgdGFibGUuc3VtbWFyeS5wcmljZS5hbW91bnQubXVsdGlwbGllZEJ5KHdlaWdodCkudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gY3VycmVuY3lfcHJpY2UudG9OdW1iZXIoKVwiLCBjdXJyZW5jeV9wcmljZS50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSBwcmljZV9pOlwiLCBwcmljZV9pLnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHByaWNlIC0+XCIsIHByaWNlLnN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gY3VycmVuY3lfcHJpY2VfMjRoX2FnbzpcIiwgY3VycmVuY3lfcHJpY2VfMjRoX2Fnby50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSB0YWJsZS5zdW1tYXJ5LnByaWNlXzI0aF9hZ286XCIsIHRhYmxlLnN1bW1hcnkucHJpY2VfMjRoX2Fnby5zdHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHByaWNlX2luaXRfaTpcIiwgcHJpY2VfaW5pdF9pLnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHByaWNlX2luaXQgLT5cIiwgcHJpY2VfaW5pdC5zdHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBkaWZmID0gcHJpY2UubWludXMocHJpY2VfaW5pdCk7XG4gICAgICAgICAgICAgICAgdmFyIHJhdGlvOm51bWJlciA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKHByaWNlX2luaXQuYW1vdW50LnRvTnVtYmVyKCkgIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByYXRpbyA9IGRpZmYuYW1vdW50LmRpdmlkZWRCeShwcmljZV9pbml0LmFtb3VudCkudG9OdW1iZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnQgPSBNYXRoLmZsb29yKHJhdGlvICogMTAwMDApIC8gMTAwO1xuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50X3N0ciA9IChpc05hTihwZXJjZW50KSA/IDAgOiBwZXJjZW50KSArIFwiJVwiO1xuXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwcmljZVwiLCBwcmljZS5zdHIpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicHJpY2VfMjRoX2Fnb1wiLCBwcmljZV9pbml0LnN0cik7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ2b2x1bWVcIiwgdm9sdW1lLnN0cik7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwZXJjZW50XCIsIHBlcmNlbnQpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicGVyY2VudF9zdHJcIiwgcGVyY2VudF9zdHIpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmF0aW9cIiwgcmF0aW8pO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZGlmZlwiLCBkaWZmLnN0cik7XG5cbiAgICAgICAgICAgICAgICB0b2tlbi5zdW1tYXJ5LnByaWNlID0gcHJpY2U7XG4gICAgICAgICAgICAgICAgdG9rZW4uc3VtbWFyeS5wcmljZV8yNGhfYWdvID0gcHJpY2VfaW5pdDtcbiAgICAgICAgICAgICAgICB0b2tlbi5zdW1tYXJ5LnBlcmNlbnQgPSBwZXJjZW50O1xuICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkucGVyY2VudF9zdHIgPSBwZXJjZW50X3N0cjtcbiAgICAgICAgICAgICAgICB0b2tlbi5zdW1tYXJ5LnZvbHVtZSA9IHZvbHVtZTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIihlbmQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIHRoaXMucmVzb3J0VG9rZW5zKCk7XG4gICAgICAgICAgICB0aGlzLnNldFRva2VuU3VtbWFyeSgpO1xuICAgICAgICB9KTsgICAgICAgIFxuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hUb2tlbnMoZXh0ZW5kZWQ6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlLmZldGNoVG9rZW5zKClcIik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJ0b2tlbnNcIikudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgdG9rZW5zOiA8VG9rZW5ERVhbXT5yZXN1bHQucm93c1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGRhdGEudG9rZW5zKSB7XG4gICAgICAgICAgICAgICAgZGF0YS50b2tlbnNbaV0uc2NvcGUgPSBkYXRhLnRva2Vuc1tpXS5zeW1ib2wudG9Mb3dlckNhc2UoKSArIFwiLnRsb3NcIjtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS50b2tlbnNbaV0uc3ltYm9sID09IFwiVExPU1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGVsb3MgPSBkYXRhLnRva2Vuc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc29ydFRva2VucygpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCIoaW5pKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmVzb3J0VG9rZW5zKClcIik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGhpcy50b2tlbnNbMF1cIiwgdGhpcy50b2tlbnNbMF0uc3VtbWFyeSk7XG4gICAgICAgIHRoaXMudG9rZW5zLnNvcnQoKGE6VG9rZW5ERVgsIGI6VG9rZW5ERVgpID0+IHtcbiAgICAgICAgICAgIC8vIHB1c2ggb2ZmY2hhaW4gdG9rZW5zIHRvIHRoZSBlbmQgb2YgdGhlIHRva2VuIGxpc3RcbiAgICAgICAgICAgIGlmIChhLm9mZmNoYWluKSByZXR1cm4gMTtcbiAgICAgICAgICAgIGlmIChiLm9mZmNoYWluKSByZXR1cm4gLTE7XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiIC0tLSBcIiwgYS5zeW1ib2wsIFwiLVwiLCBiLnN5bWJvbCwgXCIgLS0tIFwiKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiICAgICBcIiwgYS5zdW1tYXJ5ID8gYS5zdW1tYXJ5LnZvbHVtZS5zdHIgOiBcIjBcIiwgXCItXCIsIGIuc3VtbWFyeSA/IGIuc3VtbWFyeS52b2x1bWUuc3RyIDogXCIwXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgYV92b2wgPSBhLnN1bW1hcnkgPyBhLnN1bW1hcnkudm9sdW1lIDogbmV3IEFzc2V0REVYKCk7XG4gICAgICAgICAgICB2YXIgYl92b2wgPSBiLnN1bW1hcnkgPyBiLnN1bW1hcnkudm9sdW1lIDogbmV3IEFzc2V0REVYKCk7XG5cbiAgICAgICAgICAgIGlmKGFfdm9sLmFtb3VudC5pc0dyZWF0ZXJUaGFuKGJfdm9sLmFtb3VudCkpIHJldHVybiAtMTtcbiAgICAgICAgICAgIGlmKGFfdm9sLmFtb3VudC5pc0xlc3NUaGFuKGJfdm9sLmFtb3VudCkpIHJldHVybiAxO1xuXG4gICAgICAgICAgICBpZihhLmFwcG5hbWUgPCBiLmFwcG5hbWUpIHJldHVybiAtMTtcbiAgICAgICAgICAgIGlmKGEuYXBwbmFtZSA+IGIuYXBwbmFtZSkgcmV0dXJuIDE7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSk7IFxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmVzb3J0VG9rZW5zKClcIiwgdGhpcy50b2tlbnMpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIihlbmQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcblxuICAgICAgICB0aGlzLm9uVG9rZW5zUmVhZHkubmV4dCh0aGlzLnRva2Vucyk7ICAgICAgICBcbiAgICB9XG5cblxufVxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFya2V0TWFwIHtcbiAgICBba2V5OnN0cmluZ106IE1hcmtldDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNYXJrZXQge1xuICAgIHNjb3BlOiBzdHJpbmc7XG4gICAgY29tb2RpdHk6IFRva2VuREVYLFxuICAgIGN1cnJlbmN5OiBUb2tlbkRFWCxcbiAgICBkZWFsczogbnVtYmVyO1xuICAgIGJsb2NrczogbnVtYmVyO1xuICAgIGJsb2NrbGV2ZWxzOiBhbnlbXVtdW107XG4gICAgYmxvY2tsaXN0OiBhbnlbXVtdO1xuICAgIHJldmVyc2VsZXZlbHM6IGFueVtdW11bXTtcbiAgICByZXZlcnNlYmxvY2tzOiBhbnlbXVtdO1xuICAgIGJsb2NrOiB7W2lkOnN0cmluZ106SGlzdG9yeUJsb2NrfTtcbiAgICBvcmRlcnM6IFRva2VuT3JkZXJzO1xuICAgIGhpc3Rvcnk6IEhpc3RvcnlUeFtdO1xuICAgIHR4OiB7W2lkOnN0cmluZ106SGlzdG9yeVR4fTtcbiAgICBcbiAgICBzdW1tYXJ5OiBNYXJrZXRTdW1tYXJ5O1xuICAgIGhlYWRlcjogTWFya2V0SGVhZGVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1hcmtldFN1bW1hcnkge1xuICAgIHNjb3BlOnN0cmluZyxcbiAgICBwcmljZTpBc3NldERFWCxcbiAgICBpbnZlcnNlOkFzc2V0REVYLFxuICAgIHByaWNlXzI0aF9hZ286QXNzZXRERVgsXG4gICAgaW52ZXJzZV8yNGhfYWdvOkFzc2V0REVYLFxuICAgIG1pbl9wcmljZT86QXNzZXRERVgsXG4gICAgbWF4X3ByaWNlPzpBc3NldERFWCxcbiAgICBtaW5faW52ZXJzZT86QXNzZXRERVgsXG4gICAgbWF4X2ludmVyc2U/OkFzc2V0REVYLFxuICAgIHZvbHVtZTpBc3NldERFWCxcbiAgICBhbW91bnQ/OkFzc2V0REVYLFxuICAgIHBlcmNlbnQ/Om51bWJlcixcbiAgICBwZXJjZW50X3N0cj86c3RyaW5nLFxuICAgIGlwZXJjZW50PzpudW1iZXIsXG4gICAgaXBlcmNlbnRfc3RyPzpzdHJpbmcsXG4gICAgcmVjb3Jkcz86IGFueVtdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFya2V0SGVhZGVyIHtcbiAgICBzZWxsOk9yZGVyc1N1bW1hcnksXG4gICAgYnV5Ok9yZGVyc1N1bW1hcnlcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPcmRlcnNTdW1tYXJ5IHtcbiAgICB0b3RhbDogQXNzZXRERVg7XG4gICAgb3JkZXJzOiBudW1iZXI7ICAgIFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRva2VuT3JkZXJzIHtcbiAgICBzZWxsOk9yZGVyUm93W10sXG4gICAgYnV5Ok9yZGVyUm93W11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBIaXN0b3J5VHgge1xuICAgIGlkOiBudW1iZXI7XG4gICAgc3RyOiBzdHJpbmc7XG4gICAgcHJpY2U6IEFzc2V0REVYO1xuICAgIGludmVyc2U6IEFzc2V0REVYO1xuICAgIGFtb3VudDogQXNzZXRERVg7XG4gICAgcGF5bWVudDogQXNzZXRERVg7XG4gICAgYnV5ZmVlOiBBc3NldERFWDtcbiAgICBzZWxsZmVlOiBBc3NldERFWDtcbiAgICBidXllcjogc3RyaW5nO1xuICAgIHNlbGxlcjogc3RyaW5nO1xuICAgIGRhdGU6IERhdGU7XG4gICAgaXNidXk6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRMb2cge1xuICAgIGlkOiBudW1iZXI7XG4gICAgdXNlcjogc3RyaW5nO1xuICAgIGV2ZW50OiBzdHJpbmc7XG4gICAgcGFyYW1zOiBzdHJpbmc7XG4gICAgZGF0ZTogRGF0ZTtcbiAgICBwcm9jZXNzZWQ/OiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSGlzdG9yeUJsb2NrIHtcbiAgICBpZDogbnVtYmVyO1xuICAgIGhvdXI6IG51bWJlcjtcbiAgICBzdHI6IHN0cmluZztcbiAgICBwcmljZTogQXNzZXRERVg7XG4gICAgaW52ZXJzZTogQXNzZXRERVg7XG4gICAgZW50cmFuY2U6IEFzc2V0REVYO1xuICAgIG1heDogQXNzZXRERVg7XG4gICAgbWluOiBBc3NldERFWDtcbiAgICB2b2x1bWU6IEFzc2V0REVYO1xuICAgIGFtb3VudDogQXNzZXRERVg7XG4gICAgZGF0ZTogRGF0ZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPcmRlciB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICBwcmljZTogQXNzZXRERVg7XG4gICAgaW52ZXJzZTogQXNzZXRERVg7XG4gICAgdG90YWw6IEFzc2V0REVYO1xuICAgIGRlcG9zaXQ6IEFzc2V0REVYO1xuICAgIHRlbG9zOiBBc3NldERFWDtcbiAgICBvd25lcjogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJPcmRlcnNNYXAge1xuICAgIFtrZXk6c3RyaW5nXTogVXNlck9yZGVycztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVc2VyT3JkZXJzIHtcbiAgICB0YWJsZTogc3RyaW5nO1xuICAgIGlkczogbnVtYmVyW107XG4gICAgb3JkZXJzPzphbnlbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPcmRlclJvdyB7XG4gICAgc3RyOiBzdHJpbmc7XG4gICAgcHJpY2U6IEFzc2V0REVYO1xuICAgIG9yZGVyczogT3JkZXJbXTtcbiAgICBpbnZlcnNlOiBBc3NldERFWDtcbiAgICB0b3RhbDogQXNzZXRERVg7XG4gICAgc3VtOiBBc3NldERFWDtcbiAgICBzdW10ZWxvczogQXNzZXRERVg7XG4gICAgdGVsb3M6IEFzc2V0REVYO1xuICAgIG93bmVyczoge1trZXk6c3RyaW5nXTpib29sZWFufVxufSIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBWYXBhZWVERVggfSBmcm9tICcuL2RleC5zZXJ2aWNlJ1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW10sXG4gIHByb3ZpZGVyczogW1ZhcGFlZURFWF0sXG4gIGV4cG9ydHM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFZhcGFlZURleE1vZHVsZSB7IH1cbiJdLCJuYW1lcyI6WyJ0c2xpYl8xLl9fZXh0ZW5kcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFpQ0E7SUFBOEJBLDRCQUFLO0lBK0IvQixrQkFBWSxHQUFjO1FBQWQsb0JBQUEsRUFBQSxVQUFjO1FBQTFCLFlBQ0ksa0JBQU0sR0FBRyxDQUFDLFNBUWI7UUFQRyxJQUFJLE9BQU8sR0FBRyxJQUFJLFFBQVEsRUFBRTtZQUN4QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUM7WUFDbEIsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDO1lBQ3JCLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQztZQUNwQixNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztTQUM1QjtRQUNELEtBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7S0FDbkI7bUJBekVMO0VBaUM4QixLQUFLLEVBMkNsQzs7Ozs7O0lDcEVEO0lBQThCQSw0QkFBSztJQUkvQixrQkFBWSxDQUFhLEVBQUUsQ0FBYTtRQUE1QixrQkFBQSxFQUFBLFFBQWE7UUFBRSxrQkFBQSxFQUFBLFFBQWE7UUFBeEMsWUFDSSxrQkFBTSxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBWWI7UUFWRyxJQUFJLENBQUMsWUFBWSxRQUFRLEVBQUU7WUFDdkIsS0FBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ3ZCLEtBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDOztTQUVsQjtRQUVELElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDekIsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFD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QUFFO1NBQ3BCLENBQUM7UUFFRixLQUFLLElBQUksSUFBSSxJQUFJLEVBQUMsR0FBRyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsTUFBTSxFQUFDLEVBQUU7O1lBQ3ZDLElBQUksVUFBVSxDQUFTOztZQUN2QixJQUFJLFNBQVMsQ0FBTztZQUVwQixLQUFLLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7O2dCQUM5QixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVoQyxVQUFVLEdBQUcsRUFBRSxDQUFDO2dCQUNoQixLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3BDLFNBQVMsR0FBRzt3QkFDUixPQUFPLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO3dCQUN0QyxFQUFFLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUNwQixPQUFPLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO3dCQUNwQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO3dCQUNwQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO3dCQUMxQixLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO3dCQUMxQixLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO3FCQUM3QixDQUFBO29CQUNELFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7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QUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0NBQzNDLElBQUksR0FBRyxFQUFFOzRDQUNMLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0Q0FDM0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRDQUNyQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRDQUNuQixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRDQUNuQixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7eUNBQ3hDO3dDQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O3dDQUd0QixHQUFHLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dDQUMzQixHQUFHLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQzt3Q0FDN0IsTUFBTSxHQUFHLEVBQUUsQ0FBQzt3Q0FDWixLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTs0Q0FBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dDQUMzQyxJQUFJLEdBQUcsRUFBRTs0Q0FDTCxNQUFNLENBQUMs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QUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSSxDQUFDO29CQUMvQyxPQUFPLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDO29CQUNuRCxRQUFRLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsS0FBSSxDQUFDO29CQUNyRCxHQUFHLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSSxDQUFDO29CQUMzQyxHQUFHLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSSxDQUFDO29CQUMzQyxNQUFNLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDO29CQUNqRCxNQUFNLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDO29CQUNqRCxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7aUJBQ3RDLENBQUE7Z0JBQ0QsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNoRyxLQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQzthQUM1RDs7O1lBR0QsT0FBTyxNQUFNLENBQUM7U0FDakIsQ0FBQyxDQUFDOzs7Ozs7OztJQUdDLGdDQUFZOzs7Ozs7Y0FBQyxLQUFZLEVBQUUsSUFBZSxFQUFFLFFBQW9COztRQUFyQyxxQkFBQSxFQUFBLFFBQWU7UUFBRSx5QkFBQSxFQUFBLGFBQW9COztRQUNwRSxJQUFJLFNBQVMsR0FBVSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDOztRQUNsRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDOztRQUM5RCxJQUFJLEVBQUUsR0FBRyxJQUFJLEdBQUMsUUFBUSxDQUFDOztRQUV2QixJQUFJLElBQUksR0FBRyxLQUFLLEVBQUU7WUFDZCxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUU7O2dCQUN0RixJQUFJLE1BQU0sR0FBZSxFQUFDLElBQUksRUFBQyxLQUFLLEVBQUMsSUFBSSxFQUFDLEVBQUUsRUFBQyxDQUFDO2dCQUM5QyxLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFOztvQkFDM0IsSUFBSSxJQUFJLEdBQUcsRUFBRSxHQUFDLENBQUMsQ0FBQzs7b0JBQ2hCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQztvQkFDcEQsSUFBSSxHQUFHLEVBQUU7d0JBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ3pCO3lCQUFNO3dCQUNILE1BQU07cUJBQ1Q7aUJBQ0o7Z0JBQ0QsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxRQUFRLEVBQUU7OztvQkFHaEMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUNsQzthQUNKO1NBQ0o7UUFFRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUMsRUFBRSxJQUFFLElBQUksR0FBQyxRQUFRLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTs7Ozs7WUFLL0csS0FBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFELEtBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUN0QyxLQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUM7O1lBSWhFLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs7Z0JBQ3ZDLElBQUksV0FBVyxHQUFhO29CQUN4QixFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUNyQixHQUFHLEVBQUUsRUFBRTtvQkFDUCxNQUFNLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDO29CQUNqRCxPQUFPLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDO29CQUNuRCxNQUFNLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDO29CQUNqRCxPQUFPLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDO29CQUNuRCxLQUFLLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSSxDQUFDO29CQUMvQyxPQUFPLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDO29CQUNuRCxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO29CQUMzQixNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNO29CQUM3QixJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQ25DLEtBQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO2lCQUNoQyxDQUFBO2dCQUNELFdBQVcsQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUN2RSxLQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQzthQUNyRTtZQUVELEtBQUssSUFBSSxDQUFDLElBQUksS0FBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3ZDLEtBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3pFO1lBRUQsS0FBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVMsQ0FBVyxFQUFFLENBQVc7Z0JBQ25FLElBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSTtvQkFBRSxPQUFPLENBQUMsQ0FBQztnQkFDN0IsSUFBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJO29CQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLElBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRTtvQkFBRSxPQUFPLENBQUMsQ0FBQztnQkFDekIsSUFBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFO29CQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDN0IsQ0FBQyxDQUFDOzs7WUFJSCxPQUFPLE1BQU0sQ0FBQztTQUNqQixDQUFDLENBQUM7Ozs7Ozs7SUFHTyxpQ0FBYTs7Ozs7Y0FBQyxJQUFlLEVBQUUsUUFBb0I7UUFBckMscUJBQUEsRUFBQSxRQUFlO1FBQUUseUJBQUEsRUFBQSxhQUFvQjs7Ozs7Z0JBQ3pELEVBQUUsR0FBRyxJQUFJLEdBQUMsUUFBUSxHQUFDLENBQUMsQ0FBQzs7Z0JBR3pCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFO29CQUM5QixVQUFVLEdBQUcsRUFBRSxDQUFDO29CQUNwQixLQUFTLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDdkIsSUFBSSxHQUFHLEVBQUUsR0FBQyxDQUFDLENBQUM7d0JBQ1osS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQzt3QkFDL0MsSUFBSSxDQUFDLEtBQUssRUFBRTs0QkFDUixNQUFNO3lCQUNUO3FCQUNKO29CQUNELElBQUksVUFBVSxDQUFDLE1BQU0sSUFBSSxRQUFRLEVBQUU7d0JBQy9CLHNCQUFPO3FCQUNWO2lCQUNKO2dCQUVELHNCQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUUsV0FBVyxFQUFDLEVBQUUsR0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU07O3dCQUdwRixJQUFJLElBQUksR0FBYyxFQUFFLENBQUM7d0JBRXpCLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs7NEJBQ3ZDLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDOzs0QkFDM0IsSUFBSSxLQUFLLHFCQUFzQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDOzRCQUM5QyxJQUFJLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFO2dDQUNuQyxLQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDO2dDQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOzs2QkFFcEI7eUJBQ0o7d0JBRUQsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDaEUsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVMsQ0FBVSxFQUFFLENBQVU7NEJBQ25ELElBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSTtnQ0FBRSxPQUFPLENBQUMsQ0FBQzs0QkFDN0IsSUFBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJO2dDQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7NEJBQzlCLElBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRTtnQ0FBRSxPQUFPLENBQUMsQ0FBQzs0QkFDekIsSUFBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFO2dDQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7eUJBQzdCLENBQUMsQ0FBQztxQkFFTixDQUFDLEVBQUM7Ozs7Ozs7O0lBSUMsbUNBQWU7Ozs7Y0FBQyxJQUFXO1FBQy9CLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLEVBQUMsS0FBSyxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO1lBQzVFLE9BQU8sTUFBTSxDQUFDO1NBQ2pCLENBQUMsQ0FBQzs7Ozs7O0lBR0MsZ0NBQVk7Ozs7Y0FBQyxLQUFLO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTtZQUNwRSxPQUFPLE1BQU0sQ0FBQztTQUNqQixDQUFDLENBQUM7Ozs7OztJQUdDLG1DQUFlOzs7O2NBQUMsS0FBSzs7UUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxHQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBQyxRQUFRLEVBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUMsS0FBSyxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTtZQUM1RixLQUFLLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxVQUFVLEVBQUU7Z0JBQzNELEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2FBQ3JCO1lBQ0QsS0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxHQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDeEQsT0FBTyxLQUFLLENBQUM7U0FDaEIsQ0FBQyxDQUFDOzs7Ozs7SUFHQyxvQ0FBZ0I7Ozs7Y0FBQyxRQUF3Qjs7UUFBeEIseUJBQUEsRUFBQSxlQUF3QjtRQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFDLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFBLENBQUM7O1lBRS9CLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUNuQixLQUFLLElBQUksQ0FBQyxJQUFJLEtBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ3ZCLElBQUksS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRO29CQUFFLFNBQVM7Z0JBQ3RDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLGVBQWUsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN4RDtZQUVELE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBTSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO2dCQUMxQyxLQUFJLENBQUMsYUFBYSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDaEMsS0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMzQyxPQUFPLEtBQUksQ0FBQyxNQUFNLENBQUM7YUFDdEIsQ0FBQyxDQUFDO1NBQ04sQ0FBQyxDQUFDOzs7Ozs7SUFJQyx1Q0FBbUI7Ozs7Y0FBQyxLQUFrQjs7UUFBbEIsc0JBQUEsRUFBQSxVQUFrQjtRQUMxQyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDWCxLQUFLLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUQsT0FBTztTQUNWO1FBQ0QsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQ2YsSUFBSSxDQUFDLGdCQUFnQjtZQUNyQixJQUFJLENBQUMsaUJBQWlCO1NBQ3pCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDOztZQUtMLElBQUksVUFBVSxHQUEyQixFQUFFLENBQUM7O1lBRzVDLEtBQUssSUFBSSxDQUFDLElBQUksS0FBSSxDQUFDLE1BQU0sRUFBRTtnQkFDdkIsSUFBSSxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVE7b0JBQUUsU0FBUzs7Z0JBRXRDLElBQUksS0FBSyxHQUFHLEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7O2dCQUMzQixJQUFJLFFBQVEsR0FBWSxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBRS9DLEtBQUssSUFBSSxDQUFDLElBQUksS0FBSSxDQUFDLFFBQVEsRUFBRTtvQkFDekIsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFBRSxTQUFTOztvQkFDbkMsSUFBSSxLQUFLLEdBQVUsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFcEMsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO3dCQUN2QyxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUNsRDtvQkFDRCxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7d0JBQ3ZDLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7cUJBQ2xEO29CQUVELElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTt3QkFDckYsSUFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUU7NEJBQzdELE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQzt5QkFDeEI7d0JBRUQsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxJQUFJOzRCQUM3QixLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFOzRCQUNsQyxhQUFhLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFOzRCQUNsRCxNQUFNLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFOzRCQUNwQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPOzRCQUM5QixXQUFXLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXO3lCQUN6QyxDQUFBO3FCQUNKO2lCQUNKO2dCQUVELFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDO2FBQ3ZDO1lBRUQsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUc7Z0JBQ2pCLEtBQUssRUFBRSxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQztnQkFDbEMsYUFBYSxFQUFFLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxLQUFJLENBQUMsS0FBSyxDQUFDO2dCQUMxQyxNQUFNLEVBQUUsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQztnQkFDcEMsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsV0FBVyxFQUFFLElBQUk7YUFDcEIsQ0FBQTs7WUFNRCxJQUFJLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUzQixLQUFLLElBQUksQ0FBQyxJQUFJLEtBQUksQ0FBQyxNQUFNLEVBQUU7O2dCQUN2QixJQUFJLEtBQUssR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLEtBQUssQ0FBQyxRQUFRO29CQUFFLFNBQVM7Z0JBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTztvQkFBRSxTQUFTO2dCQUM3QixJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO29CQUFFLFNBQVM7O2dCQUdoRCxJQUFJLE1BQU0sR0FBRyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztnQkFDekMsSUFBSSxLQUFLLEdBQUcsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7Z0JBQ3hDLElBQUksVUFBVSxHQUFHLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O2dCQUM3QyxJQUFJLGNBQWMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUU5QyxJQUFJLGNBQWMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDO29CQUFFLFNBQVM7O2dCQUc3QyxLQUFLLElBQUksQ0FBQyxJQUFJLEtBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQ3pCLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQUUsU0FBUzs7b0JBQ25DLElBQUksS0FBSyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7O29CQUM3QixJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxNQUFNLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7O29CQUNqRyxJQUFJLHNCQUFzQixHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLE1BQU0sR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztvQkFDakgsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7O3dCQUdoRixJQUFJLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO3dCQUM5QixJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7NEJBQ3ZDLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQzt5QkFDM0M7NkJBQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFOzRCQUM5QyxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7eUJBQzNDOzt3QkFHRCxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7O3dCQUc5RCxJQUFJLFlBQVksQ0FBQzt3QkFDakIsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFOzRCQUN2QyxZQUFZLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7eUJBQy9GOzZCQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTs0QkFDOUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3lCQUNqRzs7d0JBR0QsSUFBSSxPQUFPLEdBQUcsSUFBSSxRQUFRLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O3dCQUcxRSxJQUFJLGlCQUFpQixDQUFDO3dCQUN0QixJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7NEJBQ3ZDLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3lCQUNwSDs2QkFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7NEJBQzlDLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3lCQUN0SDs7d0JBR0QsSUFBSSxZQUFZLEdBQUcsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7d0JBR3BGLElBQUksUUFBUSxDQUFDO3dCQUNiLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTs0QkFDdkMsUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO3lCQUMzQzs2QkFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7NEJBQzlDLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQzt5QkFDM0M7O3dCQUdELElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7NEJBQzVDLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3lCQUMxRzt3QkFHRCxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ3RELFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLFlBQVksRUFBRSxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDckUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7cUJBZTVEO2lCQUNKOztnQkFFRCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztnQkFDbkMsSUFBSSxLQUFLLEdBQVUsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFO29CQUNuQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2lCQUMvRDs7Z0JBQ0QsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDOztnQkFDOUMsSUFBSSxXQUFXLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sSUFBSSxHQUFHLENBQUM7Ozs7Ozs7O2dCQVV2RCxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Z0JBQzVCLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQztnQkFDekMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO2dCQUNoQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7Z0JBQ3hDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzthQUVqQzs7O1lBR0QsS0FBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BCLEtBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUMxQixDQUFDLENBQUM7Ozs7OztJQUdDLCtCQUFXOzs7O2NBQUMsUUFBd0I7O1FBQXhCLHlCQUFBLEVBQUEsZUFBd0I7UUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBRXBDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTs7WUFDL0MsSUFBSSxJQUFJLEdBQUc7Z0JBQ1AsTUFBTSxvQkFBYyxNQUFNLENBQUMsSUFBSSxDQUFBO2FBQ2xDLENBQUE7WUFFRCxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFHLE9BQU8sQ0FBQztnQkFDckUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLEVBQUU7b0JBQ2pDLEtBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDL0I7YUFDSjtZQUVELE9BQU8sSUFBSSxDQUFDO1NBQ2YsQ0FBQyxDQUFDOzs7OztJQUdDLGdDQUFZOzs7Ozs7O1FBSWhCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBVSxFQUFFLENBQVU7O1lBRXBDLElBQUksQ0FBQyxDQUFDLFFBQVE7Z0JBQUUsT0FBTyxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLENBQUMsUUFBUTtnQkFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDOztZQUsxQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7O1lBQzFELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztZQUUxRCxJQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7Z0JBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN2RCxJQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7Z0JBQUUsT0FBTyxDQUFDLENBQUM7WUFFbkQsSUFBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPO2dCQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDcEMsSUFBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPO2dCQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ25DLE9BQU8sQ0FBQyxDQUFDO1NBQ1osQ0FBQyxDQUFDOzs7UUFLSCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7OztnQkE3bUU1QyxVQUFVLFNBQUM7b0JBQ1IsVUFBVSxFQUFFLE1BQU07aUJBQ3JCOzs7O2dCQUpRLGFBQWE7Z0JBTGIsYUFBYTtnQkFDYixRQUFROzs7b0JBSmpCOzs7Ozs7O0FDQUE7Ozs7Z0JBR0MsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBRSxFQUNSO29CQUNELFlBQVksRUFBRSxFQUFFO29CQUNoQixTQUFTLEVBQUUsQ0FBQyxTQUFTLENBQUM7b0JBQ3RCLE9BQU8sRUFBRSxFQUFFO2lCQUNaOzswQkFURDs7Ozs7Ozs7Ozs7Ozs7OyJ9