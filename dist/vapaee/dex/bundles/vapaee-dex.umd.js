(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@vapaee/scatter'), require('bignumber.js'), require('@angular/core'), require('rxjs'), require('ngx-cookie-service'), require('@angular/common'), require('@vapaee/feedback'), require('ngx-cookie-service/cookie-service/cookie.service')) :
    typeof define === 'function' && define.amd ? define('@vapaee/dex', ['exports', '@vapaee/scatter', 'bignumber.js', '@angular/core', 'rxjs', 'ngx-cookie-service', '@angular/common', '@vapaee/feedback', 'ngx-cookie-service/cookie-service/cookie.service'], factory) :
    (factory((global.vapaee = global.vapaee || {}, global.vapaee.dex = {}),null,null,global.ng.core,global.rxjs,null,global.ng.common,null,null));
}(this, (function (exports,i1,BigNumber,i0,rxjs,ngxCookieService,i3,feedback,i2) { 'use strict';

    BigNumber = BigNumber && BigNumber.hasOwnProperty('default') ? BigNumber['default'] : BigNumber;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var TokenDEX = (function (_super) {
        __extends(TokenDEX, _super);
        function TokenDEX(obj) {
            if (obj === void 0) {
                obj = null;
            }
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
    }(i1.Token));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var AssetDEX = (function (_super) {
        __extends(AssetDEX, _super);
        function AssetDEX(a, b) {
            if (a === void 0) {
                a = null;
            }
            if (b === void 0) {
                b = null;
            }
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
                if (decimals === void 0) {
                    decimals = -1;
                }
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
    }(i1.Asset));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var VapaeeDEX = (function () {
        function VapaeeDEX(scatter, cookies, datePipe) {
            var _this = this;
            this.scatter = scatter;
            this.cookies = cookies;
            this.datePipe = datePipe;
            this.onLoggedAccountChange = new rxjs.Subject();
            this.onCurrentAccountChange = new rxjs.Subject();
            this.onHistoryChange = new rxjs.Subject();
            this.onMarketSummary = new rxjs.Subject();
            this.onTokensReady = new rxjs.Subject();
            this.onTopMarketsReady = new rxjs.Subject();
            this.onTradeUpdated = new rxjs.Subject();
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
            this.feed = new feedback.Feedback();
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
             */ function () {
                return this.scatter.default;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VapaeeDEX.prototype, "logged", {
            get: /**
             * @return {?}
             */ function () {
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
             */ function () {
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
                                if (!(this.current.name != profile && (this.current.name == this.last_logged || profile != "guest")))
                                    return [3 /*break*/, 4];
                                this.feed.setLoading("account", true);
                                this.current = this.default;
                                this.current.name = profile;
                                if (!(profile != "guest"))
                                    return [3 /*break*/, 2];
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
                        return [2 /*return*/, this.scatter.queryAccountData(name).catch(function (_) {
                                return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, this.default.data];
                                    });
                                });
                            })];
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
                }).then(function (result) {
                    return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            this.updateTrade(amount.token, price.token);
                            this.feed.setLoading("order-" + type, false);
                            return [2 /*return*/, result];
                        });
                    });
                }).catch(function (e) {
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
                }).then(function (result) {
                    return __awaiter(_this, void 0, void 0, function () {
                        var i;
                        return __generator(this, function (_a) {
                            this.updateTrade(comodity, currency);
                            this.feed.setLoading("cancel-" + type, false);
                            for (i in orders) {
                                this.feed.setLoading("cancel-" + type + "-" + orders[i], false);
                            }
                            return [2 /*return*/, result];
                        });
                    });
                }).catch(function (e) {
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
                }).then(function (result) {
                    return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            this.feed.setLoading("deposit", false);
                            this.feed.setLoading("deposit-" + quantity.token.symbol.toLowerCase(), false);
                            /*await*/ this.getDeposits();
                            /*await*/ this.getBalances();
                            return [2 /*return*/, result];
                        });
                    });
                }).catch(function (e) {
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
                }).then(function (result) {
                    return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            this.feed.setLoading("withdraw", false);
                            this.feed.setLoading("withdraw-" + quantity.token.symbol.toLowerCase(), false);
                            /*await*/ this.getDeposits();
                            /*await*/ this.getBalances();
                            return [2 /*return*/, result];
                        });
                    });
                }).catch(function (e) {
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
                if (symbol === void 0) {
                    symbol = null;
                }
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
                if (account === void 0) {
                    account = null;
                }
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        console.log("VapaeeDEX.getDeposits()");
                        this.feed.setLoading("deposits", true);
                        return [2 /*return*/, this.waitTokensLoaded.then(function (_) {
                                return __awaiter(_this, void 0, void 0, function () {
                                    var deposits, result, i;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                deposits = [];
                                                if (!account && this.current.name) {
                                                    account = this.current.name;
                                                }
                                                if (!account)
                                                    return [3 /*break*/, 2];
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
                                });
                            })];
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
                if (account === void 0) {
                    account = null;
                }
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        console.log("VapaeeDEX.getBalances()");
                        this.feed.setLoading("balances", true);
                        return [2 /*return*/, this.waitTokensLoaded.then(function (_) {
                                return __awaiter(_this, void 0, void 0, function () {
                                    var _balances;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!account && this.current.name) {
                                                    account = this.current.name;
                                                }
                                                if (!account)
                                                    return [3 /*break*/, 2];
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
                                });
                            })];
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
                        return [2 /*return*/, this.waitTokensLoaded.then(function (_) {
                                return __awaiter(_this, void 0, void 0, function () {
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
                                                if (!(_i < _a.length))
                                                    return [3 /*break*/, 4];
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
                                });
                            })];
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
                if (account === void 0) {
                    account = null;
                }
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        console.log("VapaeeDEX.getUserOrders()");
                        this.feed.setLoading("userorders", true);
                        return [2 /*return*/, this.waitTokensLoaded.then(function (_) {
                                return __awaiter(_this, void 0, void 0, function () {
                                    var userorders, list, map, i, ids, table, orders;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!account && this.current.name) {
                                                    account = this.current.name;
                                                }
                                                if (!account)
                                                    return [3 /*break*/, 2];
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
                                                if (!(i < list.length))
                                                    return [3 /*break*/, 6];
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
                                });
                            })];
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
                if (updateUser === void 0) {
                    updateUser = true;
                }
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
                if (page === void 0) {
                    page = -1;
                }
                if (pagesize === void 0) {
                    pagesize = -1;
                }
                if (force === void 0) {
                    force = false;
                }
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    var scope, aux, result;
                    return __generator(this, function (_a) {
                        scope = this.canonicalScope(this.getScopeFor(comodity, currency));
                        aux = null;
                        result = null;
                        this.feed.setLoading("history." + scope, true);
                        aux = this.waitOrderSummary.then(function (_) {
                            return __awaiter(_this, void 0, void 0, function () {
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
                            });
                        });
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
                if (page === void 0) {
                    page = -1;
                }
                if (pagesize === void 0) {
                    pagesize = -1;
                }
                if (force === void 0) {
                    force = false;
                }
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    var scope, aux, result;
                    return __generator(this, function (_a) {
                        console.log("VapaeeDEX.getBlockHistory()", comodity.symbol, page, pagesize);
                        scope = this.canonicalScope(this.getScopeFor(comodity, currency));
                        aux = null;
                        result = null;
                        this.feed.setLoading("block-history." + scope, true);
                        aux = this.waitOrderSummary.then(function (_) {
                            return __awaiter(_this, void 0, void 0, function () {
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
                            });
                        });
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
                if (force === void 0) {
                    force = false;
                }
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
                        aux = this.waitTokensLoaded.then(function (_) {
                            return __awaiter(_this, void 0, void 0, function () {
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
                            });
                        });
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
                if (force === void 0) {
                    force = false;
                }
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
                        aux = this.waitTokensLoaded.then(function (_) {
                            return __awaiter(_this, void 0, void 0, function () {
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
                            });
                        });
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
                    var tables, i, scope, canonical;
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
                if (force === void 0) {
                    force = false;
                }
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    var scope, canonical, inverse, comodity, currency, ZERO_COMODITY, ZERO_CURRENCY, aux, result;
                    return __generator(this, function (_a) {
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
                                aux = this.waitTokensLoaded.then(function (_) {
                                    return __awaiter(_this, void 0, void 0, function () {
                                        var summary, now, now_sec, now_hour, start_hour, price, inverse, crude, last_hh, i, hh, last_24h, volume, amount, price_asset, inverse_asset, max_price, min_price, max_inverse, min_inverse, price_fst, inverse_fst, i, current, current_date, nuevo, vol, amo, last_price, diff, ratio, percent, last_inverse, idiff, ipercent;
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
                                    });
                                });
                                if (!(this._markets[canonical] && !force))
                                    return [3 /*break*/, 1];
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
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        return [2 /*return*/, this.waitOrderSummary.then(function (_) {
                                return __awaiter(_this, void 0, void 0, function () {
                                    var _this = this;
                                    var promises, i, p;
                                    return __generator(this, function (_a) {
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
                                });
                            })];
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
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        return [2 /*return*/, this.waitTokensLoaded.then(function (_) {
                                return __awaiter(_this, void 0, void 0, function () {
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
                                                if (!(_i < _a.length))
                                                    return [3 /*break*/, 4];
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
                                });
                            })];
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
                if (page === void 0) {
                    page = 0;
                }
                if (pagesize === void 0) {
                    pagesize = 25;
                }
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
                if (page === void 0) {
                    page = 0;
                }
                if (pagesize === void 0) {
                    pagesize = 25;
                }
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
                if (page === void 0) {
                    page = 0;
                }
                if (pagesize === void 0) {
                    pagesize = 25;
                }
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
                                    var event = (result.rows[i]);
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
                if (extended === void 0) {
                    extended = true;
                }
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
                if (times === void 0) {
                    times = 20;
                }
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
                if (extended === void 0) {
                    extended = true;
                }
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
            { type: i0.Injectable, args: [{
                        providedIn: "root"
                    },] },
        ];
        /** @nocollapse */
        VapaeeDEX.ctorParameters = function () {
            return [
                { type: i1.VapaeeScatter },
                { type: ngxCookieService.CookieService },
                { type: i3.DatePipe }
            ];
        };
        /** @nocollapse */ VapaeeDEX.ngInjectableDef = i0.defineInjectable({ factory: function VapaeeDEX_Factory() { return new VapaeeDEX(i0.inject(i1.VapaeeScatter), i0.inject(i2.CookieService), i0.inject(i3.DatePipe)); }, token: VapaeeDEX, providedIn: "root" });
        return VapaeeDEX;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var VapaeeDexModule = (function () {
        function VapaeeDexModule() {
        }
        VapaeeDexModule.decorators = [
            { type: i0.NgModule, args: [{
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

    exports.VapaeeDEX = VapaeeDEX;
    exports.VapaeeDexModule = VapaeeDexModule;
    exports.TokenDEX = TokenDEX;
    exports.AssetDEX = AssetDEX;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFwYWVlLWRleC51bWQuanMubWFwIiwic291cmNlcyI6W251bGwsIm5nOi8vQHZhcGFlZS9kZXgvbGliL3Rva2VuLWRleC5jbGFzcy50cyIsIm5nOi8vQHZhcGFlZS9kZXgvbGliL2Fzc2V0LWRleC5jbGFzcy50cyIsIm5nOi8vQHZhcGFlZS9kZXgvbGliL2RleC5zZXJ2aWNlLnRzIiwibmc6Ly9AdmFwYWVlL2RleC9saWIvZGV4Lm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDApXHJcbiAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHQuZGVmYXVsdCA9IG1vZDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcbiIsImltcG9ydCB7IFRva2VuIH0gZnJvbSAnQHZhcGFlZS9zY2F0dGVyJztcbmltcG9ydCB7IEFzc2V0REVYIH0gZnJvbSBcIi4vYXNzZXQtZGV4LmNsYXNzXCI7XG5pbXBvcnQgeyBNYXJrZXQgfSBmcm9tICcuL3R5cGVzLWRleCc7XG5cbi8qXG5leHBvcnQgaW50ZXJmYWNlIFRva2VuIHtcbiAgICBzeW1ib2w6IHN0cmluZyxcbiAgICBwcmVjaXNpb24/OiBudW1iZXIsXG4gICAgY29udHJhY3Q/OiBzdHJpbmcsXG4gICAgYXBwbmFtZT86IHN0cmluZyxcbiAgICB3ZWJzaXRlPzogc3RyaW5nLFxuICAgIGxvZ28/OiBzdHJpbmcsXG4gICAgbG9nb2xnPzogc3RyaW5nLFxuICAgIHZlcmlmaWVkPzogYm9vbGVhbixcbiAgICBmYWtlPzogYm9vbGVhbixcbiAgICBvZmZjaGFpbj86IGJvb2xlYW4sXG4gICAgc2NvcGU/OiBzdHJpbmcsXG4gICAgc3RhdD86IHtcbiAgICAgICAgc3VwcGx5OiBzdHJpbmcsXG4gICAgICAgIG1heF9zdXBwbHk6IHN0cmluZyxcbiAgICAgICAgaXNzdWVyPzogc3RyaW5nLFxuICAgICAgICBvd25lcj86IHN0cmluZyxcbiAgICAgICAgaXNzdWVycz86IHN0cmluZ1tdXG4gICAgfSxcbiAgICBzdW1tYXJ5Pzoge1xuICAgICAgICB2b2x1bWU6IEFzc2V0LFxuICAgICAgICBwcmljZTogQXNzZXQsXG4gICAgICAgIHByaWNlXzI0aF9hZ286IEFzc2V0LFxuICAgICAgICBwZXJjZW50PzpudW1iZXIsXG4gICAgICAgIHBlcmNlbnRfc3RyPzpzdHJpbmdcbiAgICB9XG5cbn1cbiovXG5leHBvcnQgY2xhc3MgVG9rZW5ERVggZXh0ZW5kcyBUb2tlbiB7XG4gICAgLy8gcHJpdmF0ZSBfc3RyOiBzdHJpbmc7XG4gICAgLy8gcHJpdmF0ZSBfc3ltYm9sOiBzdHJpbmc7XG4gICAgLy8gcHJpdmF0ZSBfcHJlY2lzaW9uOiBudW1iZXI7XG4gICAgLy8gcHJpdmF0ZSBfY29udHJhY3Q6IHN0cmluZztcblxuICAgIHB1YmxpYyBhcHBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIHdlYnNpdGU6IHN0cmluZztcbiAgICBwdWJsaWMgbG9nbzogc3RyaW5nO1xuICAgIHB1YmxpYyBsb2dvbGc6IHN0cmluZztcbiAgICBwdWJsaWMgdmVyaWZpZWQ6IGJvb2xlYW47XG4gICAgcHVibGljIGZha2U6IGJvb2xlYW47XG4gICAgcHVibGljIG9mZmNoYWluOiBib29sZWFuO1xuICAgIHB1YmxpYyBzY29wZTogc3RyaW5nO1xuXG4gICAgc3RhdD86IHtcbiAgICAgICAgc3VwcGx5OiBzdHJpbmcsXG4gICAgICAgIG1heF9zdXBwbHk6IHN0cmluZyxcbiAgICAgICAgaXNzdWVyPzogc3RyaW5nLFxuICAgICAgICBvd25lcj86IHN0cmluZyxcbiAgICAgICAgaXNzdWVycz86IHN0cmluZ1tdXG4gICAgfTtcblxuICAgIHN1bW1hcnk/OiB7XG4gICAgICAgIHZvbHVtZTogQXNzZXRERVgsXG4gICAgICAgIHByaWNlOiBBc3NldERFWCxcbiAgICAgICAgcHJpY2VfMjRoX2FnbzogQXNzZXRERVgsXG4gICAgICAgIHBlcmNlbnQ/Om51bWJlcixcbiAgICAgICAgcGVyY2VudF9zdHI/OnN0cmluZ1xuICAgIH1cbiAgICBcbiAgICBtYXJrZXRzOiBNYXJrZXRbXTtcblxuICAgIGNvbnN0cnVjdG9yKG9iajphbnkgPSBudWxsKSB7XG4gICAgICAgIHN1cGVyKG9iaik7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmouc3ltYm9sO1xuICAgICAgICAgICAgZGVsZXRlIG9iai5wcmVjaXNpb247XG4gICAgICAgICAgICBkZWxldGUgb2JqLmNvbnRyYWN0O1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG5cblxufSIsImltcG9ydCBCaWdOdW1iZXIgZnJvbSAnYmlnbnVtYmVyLmpzJztcbmltcG9ydCB7IFRva2VuREVYIH0gZnJvbSAnLi90b2tlbi1kZXguY2xhc3MnO1xuaW1wb3J0IHsgQXNzZXQgfSBmcm9tICdAdmFwYWVlL3NjYXR0ZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIElWYXBhZWVERVgge1xuICAgIGdldFRva2VuTm93KHN5bWJvbDpzdHJpbmcpOiBUb2tlbkRFWDtcbn1cblxuZXhwb3J0IGNsYXNzIEFzc2V0REVYIGV4dGVuZHMgQXNzZXQge1xuICAgIGFtb3VudDpCaWdOdW1iZXI7XG4gICAgdG9rZW46VG9rZW5ERVg7XG4gICAgXG4gICAgY29uc3RydWN0b3IoYTogYW55ID0gbnVsbCwgYjogYW55ID0gbnVsbCkge1xuICAgICAgICBzdXBlcihhLGIpO1xuXG4gICAgICAgIGlmIChhIGluc3RhbmNlb2YgQXNzZXRERVgpIHtcbiAgICAgICAgICAgIHRoaXMuYW1vdW50ID0gYS5hbW91bnQ7XG4gICAgICAgICAgICB0aGlzLnRva2VuID0gYjtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghIWIgJiYgYlsnZ2V0VG9rZW5Ob3cnXSkge1xuICAgICAgICAgICAgdGhpcy5wYXJzZURleChhLGIpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjbG9uZSgpOiBBc3NldERFWCB7XG4gICAgICAgIHJldHVybiBuZXcgQXNzZXRERVgodGhpcy5hbW91bnQsIHRoaXMudG9rZW4pO1xuICAgIH1cblxuICAgIHBsdXMoYjpBc3NldERFWCkge1xuICAgICAgICBjb25zb2xlLmFzc2VydCghIWIsIFwiRVJST1I6IGIgaXMgbm90IGFuIEFzc2V0XCIsIGIsIHRoaXMuc3RyKTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoYi50b2tlbi5zeW1ib2wgPT0gdGhpcy50b2tlbi5zeW1ib2wsIFwiRVJST1I6IHRyeWluZyB0byBzdW0gYXNzZXRzIHdpdGggZGlmZmVyZW50IHRva2VuczogXCIgKyB0aGlzLnN0ciArIFwiIGFuZCBcIiArIGIuc3RyKTtcbiAgICAgICAgdmFyIGFtb3VudCA9IHRoaXMuYW1vdW50LnBsdXMoYi5hbW91bnQpO1xuICAgICAgICByZXR1cm4gbmV3IEFzc2V0REVYKGFtb3VudCwgdGhpcy50b2tlbik7XG4gICAgfVxuXG4gICAgbWludXMoYjpBc3NldERFWCkge1xuICAgICAgICBjb25zb2xlLmFzc2VydCghIWIsIFwiRVJST1I6IGIgaXMgbm90IGFuIEFzc2V0XCIsIGIsIHRoaXMuc3RyKTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoYi50b2tlbi5zeW1ib2wgPT0gdGhpcy50b2tlbi5zeW1ib2wsIFwiRVJST1I6IHRyeWluZyB0byBzdWJzdHJhY3QgYXNzZXRzIHdpdGggZGlmZmVyZW50IHRva2VuczogXCIgKyB0aGlzLnN0ciArIFwiIGFuZCBcIiArIGIuc3RyKTtcbiAgICAgICAgdmFyIGFtb3VudCA9IHRoaXMuYW1vdW50Lm1pbnVzKGIuYW1vdW50KTtcbiAgICAgICAgcmV0dXJuIG5ldyBBc3NldERFWChhbW91bnQsIHRoaXMudG9rZW4pO1xuICAgIH0gICAgXG5cbiAgICBwYXJzZURleCh0ZXh0OiBzdHJpbmcsIGRleDogSVZhcGFlZURFWCkge1xuICAgICAgICBpZiAodGV4dCA9PSBcIlwiKSByZXR1cm47XG4gICAgICAgIHZhciBzeW0gPSB0ZXh0LnNwbGl0KFwiIFwiKVsxXTtcbiAgICAgICAgdGhpcy50b2tlbiA9IGRleC5nZXRUb2tlbk5vdyhzeW0pO1xuICAgICAgICB2YXIgYW1vdW50X3N0ciA9IHRleHQuc3BsaXQoXCIgXCIpWzBdO1xuICAgICAgICB0aGlzLmFtb3VudCA9IG5ldyBCaWdOdW1iZXIoYW1vdW50X3N0cik7XG4gICAgfVxuXG4gICAgXG4gICAgdG9TdHJpbmcoZGVjaW1hbHM6bnVtYmVyID0gLTEpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMudG9rZW4pIHJldHVybiBcIjAuMDAwMFwiO1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVRvU3RyaW5nKGRlY2ltYWxzKSArIFwiIFwiICsgdGhpcy50b2tlbi5zeW1ib2wudG9VcHBlckNhc2UoKTtcbiAgICB9XG5cbiAgICBpbnZlcnNlKHRva2VuOiBUb2tlbkRFWCk6IEFzc2V0REVYIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBCaWdOdW1iZXIoMSkuZGl2aWRlZEJ5KHRoaXMuYW1vdW50KTtcbiAgICAgICAgdmFyIGFzc2V0ID0gIG5ldyBBc3NldERFWChyZXN1bHQsIHRva2VuKTtcbiAgICAgICAgcmV0dXJuIGFzc2V0O1xuICAgIH1cbn0iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgQmlnTnVtYmVyIGZyb20gXCJiaWdudW1iZXIuanNcIjtcbmltcG9ydCB7IENvb2tpZVNlcnZpY2UgfSBmcm9tICduZ3gtY29va2llLXNlcnZpY2UnO1xuaW1wb3J0IHsgRGF0ZVBpcGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgVG9rZW5ERVggfSBmcm9tICcuL3Rva2VuLWRleC5jbGFzcyc7XG5pbXBvcnQgeyBBc3NldERFWCB9IGZyb20gJy4vYXNzZXQtZGV4LmNsYXNzJztcbmltcG9ydCB7IEZlZWRiYWNrIH0gZnJvbSAnQHZhcGFlZS9mZWVkYmFjayc7XG5pbXBvcnQgeyBWYXBhZWVTY2F0dGVyLCBBY2NvdW50LCBBY2NvdW50RGF0YSwgU21hcnRDb250cmFjdCwgVGFibGVSZXN1bHQsIFRhYmxlUGFyYW1zIH0gZnJvbSAnQHZhcGFlZS9zY2F0dGVyJztcbmltcG9ydCB7IE1hcmtldE1hcCwgVXNlck9yZGVyc01hcCwgTWFya2V0U3VtbWFyeSwgRXZlbnRMb2csIE1hcmtldCwgSGlzdG9yeVR4LCBUb2tlbk9yZGVycywgT3JkZXIsIFVzZXJPcmRlcnMsIE9yZGVyUm93LCBIaXN0b3J5QmxvY2sgfSBmcm9tICcuL3R5cGVzLWRleCc7XG5cblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46IFwicm9vdFwiXG59KVxuZXhwb3J0IGNsYXNzIFZhcGFlZURFWCB7XG5cbiAgICBwdWJsaWMgbG9naW5TdGF0ZTogc3RyaW5nO1xuICAgIC8qXG4gICAgcHVibGljIGxvZ2luU3RhdGU6IHN0cmluZztcbiAgICAtICduby1zY2F0dGVyJzogU2NhdHRlciBubyBkZXRlY3RlZFxuICAgIC0gJ25vLWxvZ2dlZCc6IFNjYXR0ZXIgZGV0ZWN0ZWQgYnV0IHVzZXIgaXMgbm90IGxvZ2dlZFxuICAgIC0gJ2FjY291bnQtb2snOiB1c2VyIGxvZ2dlciB3aXRoIHNjYXR0ZXJcbiAgICAqL1xuICAgIHByaXZhdGUgX21hcmtldHM6IE1hcmtldE1hcDtcbiAgICBwcml2YXRlIF9yZXZlcnNlOiBNYXJrZXRNYXA7XG4gICAgcHVibGljIHRvcG1hcmtldHM6IE1hcmtldFtdO1xuXG4gICAgcHVibGljIHplcm9fdGVsb3M6IEFzc2V0REVYO1xuICAgIHB1YmxpYyB0ZWxvczogVG9rZW5ERVg7XG4gICAgcHVibGljIHRva2VuczogVG9rZW5ERVhbXTtcbiAgICBwdWJsaWMgY3VycmVuY2llczogVG9rZW5ERVhbXTtcbiAgICBwdWJsaWMgY29udHJhY3Q6IFNtYXJ0Q29udHJhY3Q7XG4gICAgcHVibGljIGZlZWQ6IEZlZWRiYWNrO1xuICAgIHB1YmxpYyBjdXJyZW50OiBBY2NvdW50O1xuICAgIHB1YmxpYyBsYXN0X2xvZ2dlZDogc3RyaW5nO1xuICAgIHB1YmxpYyBjb250cmFjdF9uYW1lOiBzdHJpbmc7ICAgXG4gICAgcHVibGljIGRlcG9zaXRzOiBBc3NldERFWFtdO1xuICAgIHB1YmxpYyBiYWxhbmNlczogQXNzZXRERVhbXTtcbiAgICBwdWJsaWMgdXNlcm9yZGVyczogVXNlck9yZGVyc01hcDtcbiAgICBwdWJsaWMgb25Mb2dnZWRBY2NvdW50Q2hhbmdlOlN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIG9uQ3VycmVudEFjY291bnRDaGFuZ2U6U3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3QoKTtcbiAgICBwdWJsaWMgb25IaXN0b3J5Q2hhbmdlOlN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIG9uTWFya2V0U3VtbWFyeTpTdWJqZWN0PE1hcmtldFN1bW1hcnk+ID0gbmV3IFN1YmplY3QoKTtcbiAgICAvLyBwdWJsaWMgb25CbG9ja2xpc3RDaGFuZ2U6U3ViamVjdDxhbnlbXVtdPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIG9uVG9rZW5zUmVhZHk6U3ViamVjdDxUb2tlbkRFWFtdPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIG9uVG9wTWFya2V0c1JlYWR5OlN1YmplY3Q8TWFya2V0W10+ID0gbmV3IFN1YmplY3QoKTtcbiAgICBwdWJsaWMgb25UcmFkZVVwZGF0ZWQ6U3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3QoKTtcbiAgICB2YXBhZWV0b2tlbnM6c3RyaW5nID0gXCJ2YXBhZWV0b2tlbnNcIjtcblxuICAgIGFjdGl2aXR5UGFnZXNpemU6bnVtYmVyID0gMTA7XG4gICAgXG4gICAgYWN0aXZpdHk6e1xuICAgICAgICB0b3RhbDpudW1iZXI7XG4gICAgICAgIGV2ZW50czp7W2lkOnN0cmluZ106RXZlbnRMb2d9O1xuICAgICAgICBsaXN0OkV2ZW50TG9nW107XG4gICAgfTtcbiAgICBcbiAgICBwcml2YXRlIHNldE9yZGVyU3VtbWFyeTogRnVuY3Rpb247XG4gICAgcHVibGljIHdhaXRPcmRlclN1bW1hcnk6IFByb21pc2U8YW55PiA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0T3JkZXJTdW1tYXJ5ID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIHByaXZhdGUgc2V0VG9rZW5TdGF0czogRnVuY3Rpb247XG4gICAgcHVibGljIHdhaXRUb2tlblN0YXRzOiBQcm9taXNlPGFueT4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0aGlzLnNldFRva2VuU3RhdHMgPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgcHJpdmF0ZSBzZXRNYXJrZXRTdW1tYXJ5OiBGdW5jdGlvbjtcbiAgICBwdWJsaWMgd2FpdE1hcmtldFN1bW1hcnk6IFByb21pc2U8YW55PiA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0TWFya2V0U3VtbWFyeSA9IHJlc29sdmU7XG4gICAgfSk7XG5cbiAgICBwcml2YXRlIHNldFRva2VuU3VtbWFyeTogRnVuY3Rpb247XG4gICAgcHVibGljIHdhaXRUb2tlblN1bW1hcnk6IFByb21pc2U8YW55PiA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0VG9rZW5TdW1tYXJ5ID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIHByaXZhdGUgc2V0VG9rZW5zTG9hZGVkOiBGdW5jdGlvbjtcbiAgICBwdWJsaWMgd2FpdFRva2Vuc0xvYWRlZDogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRUb2tlbnNMb2FkZWQgPSByZXNvbHZlO1xuICAgIH0pO1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHNjYXR0ZXI6IFZhcGFlZVNjYXR0ZXIsXG4gICAgICAgIHByaXZhdGUgY29va2llczogQ29va2llU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBkYXRlUGlwZTogRGF0ZVBpcGVcbiAgICApIHtcbiAgICAgICAgdGhpcy5fbWFya2V0cyA9IHt9O1xuICAgICAgICB0aGlzLl9yZXZlcnNlID0ge307XG4gICAgICAgIHRoaXMuYWN0aXZpdHkgPSB7dG90YWw6MCwgZXZlbnRzOnt9LCBsaXN0OltdfTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5kZWZhdWx0O1xuICAgICAgICB0aGlzLmNvbnRyYWN0X25hbWUgPSB0aGlzLnZhcGFlZXRva2VucztcbiAgICAgICAgdGhpcy5jb250cmFjdCA9IHRoaXMuc2NhdHRlci5nZXRTbWFydENvbnRyYWN0KHRoaXMuY29udHJhY3RfbmFtZSk7XG4gICAgICAgIHRoaXMuZmVlZCA9IG5ldyBGZWVkYmFjaygpO1xuICAgICAgICB0aGlzLnNjYXR0ZXIub25Mb2dnZ2VkU3RhdGVDaGFuZ2Uuc3Vic2NyaWJlKHRoaXMub25Mb2dnZWRDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMudXBkYXRlTG9nU3RhdGUoKTtcbiAgICAgICAgdGhpcy5mZXRjaFRva2VucygpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRva2VucyA9IFtdO1xuICAgICAgICAgICAgbGV0IGNhcmJvbjtcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gZGF0YS50b2tlbnMpIHtcbiAgICAgICAgICAgICAgICBsZXQgdGRhdGEgPSBkYXRhLnRva2Vuc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgdG9rZW4gPSBuZXcgVG9rZW5ERVgodGRhdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5zeW1ib2wgPT0gXCJUTE9TXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZWxvcyA9IHRva2VuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodG9rZW4uc3ltYm9sID09IFwiQ1VTRFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhcmJvbiA9IHRva2VuO1xuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGhhcmRvZGVkIHRlbXBvcmFyeSBpbnNlcnRlZCB0b2tlbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgbGV0IGNhcmJvbiA9IG5ldyBUb2tlbkRFWCh7XG4gICAgICAgICAgICAgICAgYXBwbmFtZTogXCJDYXJib25cIixcbiAgICAgICAgICAgICAgICBjb250cmFjdDogXCJzdGFibGVjYXJib25cIixcbiAgICAgICAgICAgICAgICBsb2dvOiBcIi9hc3NldHMvbG9nb3MvY2FyYm9uLnN2Z1wiLFxuICAgICAgICAgICAgICAgIGxvZ29sZzogXCIvYXNzZXRzL2xvZ29zL2NhcmJvbi5zdmdcIixcbiAgICAgICAgICAgICAgICBwcmVjaXNpb246IDIsXG4gICAgICAgICAgICAgICAgc2NvcGU6IFwiY3VzZC50bG9zXCIsXG4gICAgICAgICAgICAgICAgc3ltYm9sOiBcIkNVU0RcIixcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgd2Vic2l0ZTogXCJodHRwczovL3d3dy5jYXJib24ubW9uZXlcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKGNhcmJvbik7XG4gICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBtYWtlIHRoaXMgZHluYW1pYyBhbmQgbm90IGhhcmRjb2RlZCAtLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICB0aGlzLmN1cnJlbmNpZXMgPSBbIHRoaXMudGVsb3MsIGNhcmJvbiBdO1xuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuREVYKHtcbiAgICAgICAgICAgICAgICBhcHBuYW1lOiBcIlZpaXRhc3BoZXJlXCIsXG4gICAgICAgICAgICAgICAgY29udHJhY3Q6IFwidmlpdGFzcGhlcmUxXCIsXG4gICAgICAgICAgICAgICAgbG9nbzogXCIvYXNzZXRzL2xvZ29zL3ZpaXRhc3BoZXJlLnBuZ1wiLFxuICAgICAgICAgICAgICAgIGxvZ29sZzogXCIvYXNzZXRzL2xvZ29zL3ZpaXRhc3BoZXJlLWxnLnBuZ1wiLFxuICAgICAgICAgICAgICAgIHByZWNpc2lvbjogNCxcbiAgICAgICAgICAgICAgICBzY29wZTogXCJ2aWl0Y3QudGxvc1wiLFxuICAgICAgICAgICAgICAgIHN5bWJvbDogXCJWSUlUQVwiLFxuICAgICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3ZWJzaXRlOiBcImh0dHBzOi8vdmlpdGFzcGhlcmUuY29tXCJcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuREVYKHtcbiAgICAgICAgICAgICAgICBhcHBuYW1lOiBcIlZpaXRhc3BoZXJlXCIsXG4gICAgICAgICAgICAgICAgY29udHJhY3Q6IFwidmlpdGFzcGhlcmUxXCIsXG4gICAgICAgICAgICAgICAgbG9nbzogXCIvYXNzZXRzL2xvZ29zL3ZpaXRhc3BoZXJlLnBuZ1wiLFxuICAgICAgICAgICAgICAgIGxvZ29sZzogXCIvYXNzZXRzL2xvZ29zL3ZpaXRhc3BoZXJlLWxnLnBuZ1wiLFxuICAgICAgICAgICAgICAgIHByZWNpc2lvbjogMCxcbiAgICAgICAgICAgICAgICBzY29wZTogXCJ2aWl0Y3QudGxvc1wiLFxuICAgICAgICAgICAgICAgIHN5bWJvbDogXCJWSUlDVFwiLFxuICAgICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3ZWJzaXRlOiBcImh0dHBzOi8vdmlpdGFzcGhlcmUuY29tXCJcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHRoaXMuemVyb190ZWxvcyA9IG5ldyBBc3NldERFWChcIjAuMDAwMCBUTE9TXCIsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zZXRUb2tlbnNMb2FkZWQoKTtcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hUb2tlbnNTdGF0cygpO1xuICAgICAgICAgICAgdGhpcy5nZXRPcmRlclN1bW1hcnkoKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0QWxsVGFibGVzU3VtYXJpZXMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oXyA9PiB7XG4gICAgICAgIC8vIH0pXG5cblxuICAgICAgICB2YXIgdGltZXI7XG4gICAgICAgIHRoaXMub25NYXJrZXRTdW1tYXJ5LnN1YnNjcmliZShzdW1tYXJ5ID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoXyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVUb2tlbnNTdW1tYXJ5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVUb2tlbnNNYXJrZXRzKCk7XG4gICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBnZXR0ZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgZGVmYXVsdCgpOiBBY2NvdW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhdHRlci5kZWZhdWx0O1xuICAgIH1cblxuICAgIGdldCBsb2dnZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLnNjYXR0ZXIubG9nZ2VkICYmICF0aGlzLnNjYXR0ZXIuYWNjb3VudCkge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJXQVJOSU5HISEhXCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5zY2F0dGVyKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2NhdHRlci51c2VybmFtZSk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiKioqKioqKioqKioqKioqKioqKlwiKTtcbiAgICAgICAgICAgICovXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhdHRlci5sb2dnZWQgP1xuICAgICAgICAgICAgKHRoaXMuc2NhdHRlci5hY2NvdW50ID8gdGhpcy5zY2F0dGVyLmFjY291bnQubmFtZSA6IHRoaXMuc2NhdHRlci5kZWZhdWx0Lm5hbWUpIDpcbiAgICAgICAgICAgIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IGFjY291bnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjYXR0ZXIubG9nZ2VkID8gXG4gICAgICAgIHRoaXMuc2NhdHRlci5hY2NvdW50IDpcbiAgICAgICAgdGhpcy5zY2F0dGVyLmRlZmF1bHQ7XG4gICAgfVxuXG4gICAgLy8gLS0gVXNlciBMb2cgU3RhdGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgbG9naW4oKSB7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwibG9naW5cIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwibG9nLXN0YXRlXCIsIHRydWUpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5sb2dpbigpIHRoaXMuZmVlZC5sb2FkaW5nKCdsb2ctc3RhdGUnKVwiLCB0aGlzLmZlZWQubG9hZGluZygnbG9nLXN0YXRlJykpO1xuICAgICAgICB0aGlzLmxvZ291dCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZUxvZ1N0YXRlKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmxvZ2luKCkgdGhpcy5mZWVkLmxvYWRpbmcoJ2xvZy1zdGF0ZScpXCIsIHRoaXMuZmVlZC5sb2FkaW5nKCdsb2ctc3RhdGUnKSk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwibG9nb3V0XCIsIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhdHRlci5sb2dpbigpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVMb2dTdGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dpblwiLCBmYWxzZSk7XG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dpblwiLCBmYWxzZSk7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2dvdXQoKSB7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwibG9nb3V0XCIsIHRydWUpO1xuICAgICAgICB0aGlzLnNjYXR0ZXIubG9nb3V0KCk7XG4gICAgfVxuXG4gICAgb25Mb2dvdXQoKSB7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwibG9nb3V0XCIsIGZhbHNlKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgub25Mb2dvdXQoKVwiKTtcbiAgICAgICAgdGhpcy5yZXNldEN1cnJlbnRBY2NvdW50KHRoaXMuZGVmYXVsdC5uYW1lKTtcbiAgICAgICAgdGhpcy51cGRhdGVMb2dTdGF0ZSgpO1xuICAgICAgICB0aGlzLm9uTG9nZ2VkQWNjb3VudENoYW5nZS5uZXh0KHRoaXMubG9nZ2VkKTtcbiAgICAgICAgdGhpcy5jb29raWVzLmRlbGV0ZShcImxvZ2luXCIpO1xuICAgICAgICBzZXRUaW1lb3V0KF8gID0+IHsgdGhpcy5sYXN0X2xvZ2dlZCA9IHRoaXMubG9nZ2VkOyB9LCA0MDApO1xuICAgIH1cbiAgICBcbiAgICBvbkxvZ2luKG5hbWU6c3RyaW5nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLm9uTG9naW4oKVwiLCBuYW1lKTtcbiAgICAgICAgdGhpcy5yZXNldEN1cnJlbnRBY2NvdW50KG5hbWUpO1xuICAgICAgICB0aGlzLmdldERlcG9zaXRzKCk7XG4gICAgICAgIHRoaXMuZ2V0QmFsYW5jZXMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVMb2dTdGF0ZSgpO1xuICAgICAgICB0aGlzLmdldFVzZXJPcmRlcnMoKTtcbiAgICAgICAgdGhpcy5vbkxvZ2dlZEFjY291bnRDaGFuZ2UubmV4dCh0aGlzLmxvZ2dlZCk7XG4gICAgICAgIHRoaXMubGFzdF9sb2dnZWQgPSB0aGlzLmxvZ2dlZDtcbiAgICAgICAgdGhpcy5jb29raWVzLnNldChcImxvZ2luXCIsIHRoaXMubG9nZ2VkKTtcbiAgICB9XG5cbiAgICBvbkxvZ2dlZENoYW5nZSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgub25Mb2dnZWRDaGFuZ2UoKVwiKTtcbiAgICAgICAgaWYgKHRoaXMuc2NhdHRlci5sb2dnZWQpIHtcbiAgICAgICAgICAgIHRoaXMub25Mb2dpbih0aGlzLnNjYXR0ZXIuYWNjb3VudC5uYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub25Mb2dvdXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHJlc2V0Q3VycmVudEFjY291bnQocHJvZmlsZTpzdHJpbmcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgucmVzZXRDdXJyZW50QWNjb3VudCgpXCIsIHRoaXMuY3VycmVudC5uYW1lLCBcIi0+XCIsIHByb2ZpbGUpO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50Lm5hbWUgIT0gcHJvZmlsZSAmJiAodGhpcy5jdXJyZW50Lm5hbWUgPT0gdGhpcy5sYXN0X2xvZ2dlZCB8fCBwcm9maWxlICE9IFwiZ3Vlc3RcIikpIHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYWNjb3VudFwiLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMuZGVmYXVsdDtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5uYW1lID0gcHJvZmlsZTtcbiAgICAgICAgICAgIGlmIChwcm9maWxlICE9IFwiZ3Vlc3RcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudC5kYXRhID0gYXdhaXQgdGhpcy5nZXRBY2NvdW50RGF0YSh0aGlzLmN1cnJlbnQubmFtZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiV0FSTklORyEhISBjdXJyZW50IGlzIGd1ZXN0XCIsIFtwcm9maWxlLCB0aGlzLmFjY291bnQsIHRoaXMuY3VycmVudF0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRoaXMuc2NvcGVzID0ge307XG4gICAgICAgICAgICB0aGlzLmJhbGFuY2VzID0gW107XG4gICAgICAgICAgICB0aGlzLnVzZXJvcmRlcnMgPSB7fTsgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGhpcy5vbkN1cnJlbnRBY2NvdW50Q2hhbmdlLm5leHQodGhpcy5jdXJyZW50Lm5hbWUpICEhISEhIVwiKTtcbiAgICAgICAgICAgIHRoaXMub25DdXJyZW50QWNjb3VudENoYW5nZS5uZXh0KHRoaXMuY3VycmVudC5uYW1lKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ3VycmVudFVzZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYWNjb3VudFwiLCBmYWxzZSk7XG4gICAgICAgIH0gICAgICAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVMb2dTdGF0ZSgpIHtcbiAgICAgICAgdGhpcy5sb2dpblN0YXRlID0gXCJuby1zY2F0dGVyXCI7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwibG9nLXN0YXRlXCIsIHRydWUpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC51cGRhdGVMb2dTdGF0ZSgpIFwiLCB0aGlzLmxvZ2luU3RhdGUsIHRoaXMuZmVlZC5sb2FkaW5nKFwibG9nLXN0YXRlXCIpKTtcbiAgICAgICAgdGhpcy5zY2F0dGVyLndhaXRDb25uZWN0ZWQudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvZ2luU3RhdGUgPSBcIm5vLWxvZ2dlZFwiO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWVERVgudXBkYXRlTG9nU3RhdGUoKSAgIFwiLCB0aGlzLmxvZ2luU3RhdGUpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2NhdHRlci5sb2dnZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2luU3RhdGUgPSBcImFjY291bnQtb2tcIjtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC51cGRhdGVMb2dTdGF0ZSgpICAgICBcIiwgdGhpcy5sb2dpblN0YXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwibG9nLXN0YXRlXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnVwZGF0ZUxvZ1N0YXRlKCkgXCIsIHRoaXMubG9naW5TdGF0ZSwgdGhpcy5mZWVkLmxvYWRpbmcoXCJsb2ctc3RhdGVcIikpO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgdGltZXIyO1xuICAgICAgICB2YXIgdGltZXIxID0gc2V0SW50ZXJ2YWwoXyA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuc2NhdHRlci5mZWVkLmxvYWRpbmcoXCJjb25uZWN0XCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2ctc3RhdGVcIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIxKTtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyMik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDIwMCk7XG5cbiAgICAgICAgdGltZXIyID0gc2V0VGltZW91dChfID0+IHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIxKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwibG9nLXN0YXRlXCIsIGZhbHNlKTtcbiAgICAgICAgfSwgNjAwMCk7XG4gICAgICAgIFxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZ2V0QWNjb3VudERhdGEobmFtZTogc3RyaW5nKTogUHJvbWlzZTxBY2NvdW50RGF0YT4gIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhdHRlci5xdWVyeUFjY291bnREYXRhKG5hbWUpLmNhdGNoKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVmYXVsdC5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBY3Rpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY3JlYXRlT3JkZXIodHlwZTpzdHJpbmcsIGFtb3VudDpBc3NldERFWCwgcHJpY2U6QXNzZXRERVgpIHtcbiAgICAgICAgLy8gXCJhbGljZVwiLCBcImJ1eVwiLCBcIjIuNTAwMDAwMDAgQ05UXCIsIFwiMC40MDAwMDAwMCBUTE9TXCJcbiAgICAgICAgLy8gbmFtZSBvd25lciwgbmFtZSB0eXBlLCBjb25zdCBhc3NldCAmIHRvdGFsLCBjb25zdCBhc3NldCAmIHByaWNlXG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwib3JkZXItXCIrdHlwZSwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmV4Y2VjdXRlKFwib3JkZXJcIiwge1xuICAgICAgICAgICAgb3duZXI6ICB0aGlzLnNjYXR0ZXIuYWNjb3VudC5uYW1lLFxuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIHRvdGFsOiBhbW91bnQudG9TdHJpbmcoOCksXG4gICAgICAgICAgICBwcmljZTogcHJpY2UudG9TdHJpbmcoOClcbiAgICAgICAgfSkudGhlbihhc3luYyByZXN1bHQgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUcmFkZShhbW91bnQudG9rZW4sIHByaWNlLnRva2VuKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwib3JkZXItXCIrdHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIm9yZGVyLVwiK3R5cGUsIGZhbHNlKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjYW5jZWxPcmRlcih0eXBlOnN0cmluZywgY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYLCBvcmRlcnM6bnVtYmVyW10pIHtcbiAgICAgICAgLy8gJ1tcImFsaWNlXCIsIFwiYnV5XCIsIFwiQ05UXCIsIFwiVExPU1wiLCBbMSwwXV0nXG4gICAgICAgIC8vIG5hbWUgb3duZXIsIG5hbWUgdHlwZSwgY29uc3QgYXNzZXQgJiB0b3RhbCwgY29uc3QgYXNzZXQgJiBwcmljZVxuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImNhbmNlbC1cIit0eXBlLCB0cnVlKTtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBvcmRlcnMpIHsgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZStcIi1cIitvcmRlcnNbaV0sIHRydWUpOyB9XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmV4Y2VjdXRlKFwiY2FuY2VsXCIsIHtcbiAgICAgICAgICAgIG93bmVyOiAgdGhpcy5zY2F0dGVyLmFjY291bnQubmFtZSxcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICBjb21vZGl0eTogY29tb2RpdHkuc3ltYm9sLFxuICAgICAgICAgICAgY3VycmVuY3k6IGN1cnJlbmN5LnN5bWJvbCxcbiAgICAgICAgICAgIG9yZGVyczogb3JkZXJzXG4gICAgICAgIH0pLnRoZW4oYXN5bmMgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVHJhZGUoY29tb2RpdHksIGN1cnJlbmN5KTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY2FuY2VsLVwiK3R5cGUsIGZhbHNlKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gb3JkZXJzKSB7IHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY2FuY2VsLVwiK3R5cGUrXCItXCIrb3JkZXJzW2ldLCBmYWxzZSk7IH0gICAgXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY2FuY2VsLVwiK3R5cGUsIGZhbHNlKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gb3JkZXJzKSB7IHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY2FuY2VsLVwiK3R5cGUrXCItXCIrb3JkZXJzW2ldLCBmYWxzZSk7IH0gICAgXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGVwb3NpdChxdWFudGl0eTpBc3NldERFWCkge1xuICAgICAgICAvLyBuYW1lIG93bmVyLCBuYW1lIHR5cGUsIGNvbnN0IGFzc2V0ICYgdG90YWwsIGNvbnN0IGFzc2V0ICYgcHJpY2VcbiAgICAgICAgdmFyIGNvbnRyYWN0ID0gdGhpcy5zY2F0dGVyLmdldFNtYXJ0Q29udHJhY3QocXVhbnRpdHkudG9rZW4uY29udHJhY3QpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0RXJyb3IoXCJkZXBvc2l0XCIsIG51bGwpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImRlcG9zaXRcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdC1cIitxdWFudGl0eS50b2tlbi5zeW1ib2wudG9Mb3dlckNhc2UoKSwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBjb250cmFjdC5leGNlY3V0ZShcInRyYW5zZmVyXCIsIHtcbiAgICAgICAgICAgIGZyb206ICB0aGlzLnNjYXR0ZXIuYWNjb3VudC5uYW1lLFxuICAgICAgICAgICAgdG86IHRoaXMudmFwYWVldG9rZW5zLFxuICAgICAgICAgICAgcXVhbnRpdHk6IHF1YW50aXR5LnRvU3RyaW5nKCksXG4gICAgICAgICAgICBtZW1vOiBcImRlcG9zaXRcIlxuICAgICAgICB9KS50aGVuKGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImRlcG9zaXRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0LVwiK3F1YW50aXR5LnRva2VuLnN5bWJvbC50b0xvd2VyQ2FzZSgpLCBmYWxzZSk7ICAgIFxuICAgICAgICAgICAgLyphd2FpdCovIHRoaXMuZ2V0RGVwb3NpdHMoKTtcbiAgICAgICAgICAgIC8qYXdhaXQqLyB0aGlzLmdldEJhbGFuY2VzKCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdFwiLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImRlcG9zaXQtXCIrcXVhbnRpdHkudG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCksIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRFcnJvcihcImRlcG9zaXRcIiwgdHlwZW9mIGUgPT0gXCJzdHJpbmdcIiA/IGUgOiBKU09OLnN0cmluZ2lmeShlLG51bGwsNCkpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH0gICAgXG5cbiAgICB3aXRoZHJhdyhxdWFudGl0eTpBc3NldERFWCkge1xuICAgICAgICB0aGlzLmZlZWQuc2V0RXJyb3IoXCJ3aXRoZHJhd1wiLCBudWxsKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ3aXRoZHJhd1wiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ3aXRoZHJhdy1cIitxdWFudGl0eS50b2tlbi5zeW1ib2wudG9Mb3dlckNhc2UoKSwgdHJ1ZSk7ICAgXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmV4Y2VjdXRlKFwid2l0aGRyYXdcIiwge1xuICAgICAgICAgICAgb3duZXI6ICB0aGlzLnNjYXR0ZXIuYWNjb3VudC5uYW1lLFxuICAgICAgICAgICAgcXVhbnRpdHk6IHF1YW50aXR5LnRvU3RyaW5nKClcbiAgICAgICAgfSkudGhlbihhc3luYyByZXN1bHQgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ3aXRoZHJhd1wiLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3LVwiK3F1YW50aXR5LnRva2VuLnN5bWJvbC50b0xvd2VyQ2FzZSgpLCBmYWxzZSk7XG4gICAgICAgICAgICAvKmF3YWl0Ki8gdGhpcy5nZXREZXBvc2l0cygpO1xuICAgICAgICAgICAgLyphd2FpdCovIHRoaXMuZ2V0QmFsYW5jZXMoKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ3aXRoZHJhd1wiLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIndpdGhkcmF3LVwiK3F1YW50aXR5LnRva2VuLnN5bWJvbC50b0xvd2VyQ2FzZSgpLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0RXJyb3IoXCJ3aXRoZHJhd1wiLCB0eXBlb2YgZSA9PSBcInN0cmluZ1wiID8gZSA6IEpTT04uc3RyaW5naWZ5KGUsbnVsbCw0KSk7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBUb2tlbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBhZGRPZmZDaGFpblRva2VuKG9mZmNoYWluOiBUb2tlbkRFWCkge1xuICAgICAgICB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihfID0+IHtcbiAgICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuREVYKHtcbiAgICAgICAgICAgICAgICBzeW1ib2w6IG9mZmNoYWluLnN5bWJvbCxcbiAgICAgICAgICAgICAgICBwcmVjaXNpb246IG9mZmNoYWluLnByZWNpc2lvbiB8fCA0LFxuICAgICAgICAgICAgICAgIGNvbnRyYWN0OiBcIm5vY29udHJhY3RcIixcbiAgICAgICAgICAgICAgICBhcHBuYW1lOiBvZmZjaGFpbi5hcHBuYW1lLFxuICAgICAgICAgICAgICAgIHdlYnNpdGU6IFwiXCIsXG4gICAgICAgICAgICAgICAgbG9nbzpcIlwiLFxuICAgICAgICAgICAgICAgIGxvZ29sZzogXCJcIixcbiAgICAgICAgICAgICAgICBzY29wZTogXCJcIixcbiAgICAgICAgICAgICAgICBzdGF0OiBudWxsLFxuICAgICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBvZmZjaGFpbjogdHJ1ZVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2NvcGVzIC8gVGFibGVzIFxuICAgIHB1YmxpYyBoYXNTY29wZXMoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX21hcmtldHM7XG4gICAgfVxuXG4gICAgcHVibGljIG1hcmtldChzY29wZTpzdHJpbmcpOiBNYXJrZXQge1xuICAgICAgICBpZiAodGhpcy5fbWFya2V0c1tzY29wZV0pIHJldHVybiB0aGlzLl9tYXJrZXRzW3Njb3BlXTsgICAgICAgIC8vIC0tLT4gZGlyZWN0XG4gICAgICAgIHZhciByZXZlcnNlID0gdGhpcy5pbnZlcnNlU2NvcGUoc2NvcGUpO1xuICAgICAgICBpZiAodGhpcy5fcmV2ZXJzZVtyZXZlcnNlXSkgcmV0dXJuIHRoaXMuX3JldmVyc2VbcmV2ZXJzZV07ICAgIC8vIC0tLT4gcmV2ZXJzZVxuICAgICAgICBpZiAoIXRoaXMuX21hcmtldHNbcmV2ZXJzZV0pIHJldHVybiBudWxsOyAgICAgICAgICAgICAgICAgICAgIC8vIC0tLT4gdGFibGUgZG9lcyBub3QgZXhpc3QgKG9yIGhhcyBub3QgYmVlbiBsb2FkZWQgeWV0KVxuICAgICAgICByZXR1cm4gdGhpcy5yZXZlcnNlKHNjb3BlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdGFibGUoc2NvcGU6c3RyaW5nKTogTWFya2V0IHtcbiAgICAgICAgLy9jb25zb2xlLmVycm9yKFwidGFibGUoXCIrc2NvcGUrXCIpIERFUFJFQ0FURURcIik7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcmtldChzY29wZSk7XG4gICAgfSAgICBcblxuICAgIHByaXZhdGUgcmV2ZXJzZShzY29wZTpzdHJpbmcpOiBNYXJrZXQge1xuICAgICAgICB2YXIgY2Fub25pY2FsID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgIHZhciByZXZlcnNlX3Njb3BlID0gdGhpcy5pbnZlcnNlU2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoY2Fub25pY2FsICE9IHJldmVyc2Vfc2NvcGUsIFwiRVJST1I6IFwiLCBjYW5vbmljYWwsIHJldmVyc2Vfc2NvcGUpO1xuICAgICAgICB2YXIgcmV2ZXJzZV90YWJsZTpNYXJrZXQgPSB0aGlzLl9yZXZlcnNlW3JldmVyc2Vfc2NvcGVdO1xuICAgICAgICBpZiAoIXJldmVyc2VfdGFibGUgJiYgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXZlcnNlW3JldmVyc2Vfc2NvcGVdID0gdGhpcy5jcmVhdGVSZXZlcnNlVGFibGVGb3IocmV2ZXJzZV9zY29wZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3JldmVyc2VbcmV2ZXJzZV9zY29wZV07XG4gICAgfVxuXG4gICAgcHVibGljIG1hcmtldEZvcihjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgpOiBNYXJrZXQge1xuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLmdldFNjb3BlRm9yKGNvbW9kaXR5LCBjdXJyZW5jeSk7XG4gICAgICAgIHJldHVybiB0aGlzLnRhYmxlKHNjb3BlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdGFibGVGb3IoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYKTogTWFya2V0IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcInRhYmxlRm9yKClcIixjb21vZGl0eS5zeW1ib2wsY3VycmVuY3kuc3ltYm9sLFwiIERFUFJFQ0FURURcIik7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcmtldEZvcihjb21vZGl0eSwgY3VycmVuY3kpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGVSZXZlcnNlVGFibGVGb3Ioc2NvcGU6c3RyaW5nKTogTWFya2V0IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcIiwgc2NvcGUpO1xuICAgICAgICB2YXIgY2Fub25pY2FsID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgIHZhciByZXZlcnNlX3Njb3BlID0gdGhpcy5pbnZlcnNlU2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgdmFyIHRhYmxlOk1hcmtldCA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXTtcblxuICAgICAgICB2YXIgaW52ZXJzZV9oaXN0b3J5Okhpc3RvcnlUeFtdID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSBpbiB0YWJsZS5oaXN0b3J5KSB7XG4gICAgICAgICAgICB2YXIgaFR4Okhpc3RvcnlUeCA9IHtcbiAgICAgICAgICAgICAgICBpZDogdGFibGUuaGlzdG9yeVtpXS5pZCxcbiAgICAgICAgICAgICAgICBzdHI6IFwiXCIsXG4gICAgICAgICAgICAgICAgcHJpY2U6IHRhYmxlLmhpc3RvcnlbaV0uaW52ZXJzZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgIGludmVyc2U6IHRhYmxlLmhpc3RvcnlbaV0ucHJpY2UuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICBhbW91bnQ6IHRhYmxlLmhpc3RvcnlbaV0ucGF5bWVudC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgIHBheW1lbnQ6IHRhYmxlLmhpc3RvcnlbaV0uYW1vdW50LmNsb25lKCksXG4gICAgICAgICAgICAgICAgYnV5ZXI6IHRhYmxlLmhpc3RvcnlbaV0uc2VsbGVyLFxuICAgICAgICAgICAgICAgIHNlbGxlcjogdGFibGUuaGlzdG9yeVtpXS5idXllcixcbiAgICAgICAgICAgICAgICBidXlmZWU6IHRhYmxlLmhpc3RvcnlbaV0uc2VsbGZlZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgIHNlbGxmZWU6IHRhYmxlLmhpc3RvcnlbaV0uYnV5ZmVlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgZGF0ZTogdGFibGUuaGlzdG9yeVtpXS5kYXRlLFxuICAgICAgICAgICAgICAgIGlzYnV5OiAhdGFibGUuaGlzdG9yeVtpXS5pc2J1eSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBoVHguc3RyID0gaFR4LnByaWNlLnN0ciArIFwiIFwiICsgaFR4LmFtb3VudC5zdHI7XG4gICAgICAgICAgICBpbnZlcnNlX2hpc3RvcnkucHVzaChoVHgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIFxuICAgICAgICB2YXIgaW52ZXJzZV9vcmRlcnM6VG9rZW5PcmRlcnMgPSB7XG4gICAgICAgICAgICBidXk6IFtdLCBzZWxsOiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAodmFyIHR5cGUgaW4ge2J1eTpcImJ1eVwiLCBzZWxsOlwic2VsbFwifSkge1xuICAgICAgICAgICAgdmFyIHJvd19vcmRlcnM6T3JkZXJbXTtcbiAgICAgICAgICAgIHZhciByb3dfb3JkZXI6T3JkZXI7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGFibGUub3JkZXJzW3R5cGVdKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJvdyA9IHRhYmxlLm9yZGVyc1t0eXBlXVtpXTtcblxuICAgICAgICAgICAgICAgIHJvd19vcmRlcnMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqPTA7IGo8cm93Lm9yZGVycy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICByb3dfb3JkZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXBvc2l0OiByb3cub3JkZXJzW2pdLmRlcG9zaXQuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByb3cub3JkZXJzW2pdLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogcm93Lm9yZGVyc1tqXS5wcmljZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHJvdy5vcmRlcnNbal0uaW52ZXJzZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXI6IHJvdy5vcmRlcnNbal0ub3duZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWxvczogcm93Lm9yZGVyc1tqXS50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiByb3cub3JkZXJzW2pdLnRlbG9zXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcm93X29yZGVycy5wdXNoKHJvd19vcmRlcik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIG5ld3JvdzpPcmRlclJvdyA9IHtcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogcm93LnByaWNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyczogcm93X29yZGVycyxcbiAgICAgICAgICAgICAgICAgICAgb3duZXJzOiByb3cub3duZXJzLFxuICAgICAgICAgICAgICAgICAgICBwcmljZTogcm93LmludmVyc2UuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgc3RyOiByb3cuaW52ZXJzZS5zdHIsXG4gICAgICAgICAgICAgICAgICAgIHN1bTogcm93LnN1bXRlbG9zLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgIHN1bXRlbG9zOiByb3cuc3VtLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgIHRlbG9zOiByb3cudG90YWwuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHJvdy50ZWxvcy5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAvLyBhbW91bnQ6IHJvdy5zdW10ZWxvcy50b3RhbCgpLCAvLyA8LS0gZXh0cmFcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGludmVyc2Vfb3JkZXJzW3R5cGVdLnB1c2gobmV3cm93KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXZlcnNlOk1hcmtldCA9IHtcbiAgICAgICAgICAgIHNjb3BlOiByZXZlcnNlX3Njb3BlLFxuICAgICAgICAgICAgY29tb2RpdHk6IHRhYmxlLmN1cnJlbmN5LFxuICAgICAgICAgICAgY3VycmVuY3k6IHRhYmxlLmNvbW9kaXR5LFxuICAgICAgICAgICAgYmxvY2s6IHRhYmxlLmJsb2NrLFxuICAgICAgICAgICAgYmxvY2tsaXN0OiB0YWJsZS5yZXZlcnNlYmxvY2tzLFxuICAgICAgICAgICAgcmV2ZXJzZWJsb2NrczogdGFibGUuYmxvY2tsaXN0LFxuICAgICAgICAgICAgYmxvY2tsZXZlbHM6IHRhYmxlLnJldmVyc2VsZXZlbHMsXG4gICAgICAgICAgICByZXZlcnNlbGV2ZWxzOiB0YWJsZS5ibG9ja2xldmVscyxcbiAgICAgICAgICAgIGJsb2NrczogdGFibGUuYmxvY2tzLFxuICAgICAgICAgICAgZGVhbHM6IHRhYmxlLmRlYWxzLFxuICAgICAgICAgICAgZGlyZWN0OiB0YWJsZS5pbnZlcnNlLFxuICAgICAgICAgICAgaW52ZXJzZTogdGFibGUuZGlyZWN0LFxuICAgICAgICAgICAgaGVhZGVyOiB7XG4gICAgICAgICAgICAgICAgc2VsbDoge1xuICAgICAgICAgICAgICAgICAgICB0b3RhbDp0YWJsZS5oZWFkZXIuYnV5LnRvdGFsLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyczp0YWJsZS5oZWFkZXIuYnV5Lm9yZGVyc1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYnV5OiB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOnRhYmxlLmhlYWRlci5zZWxsLnRvdGFsLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyczp0YWJsZS5oZWFkZXIuc2VsbC5vcmRlcnNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGlzdG9yeTogaW52ZXJzZV9oaXN0b3J5LFxuICAgICAgICAgICAgb3JkZXJzOiB7XG4gICAgICAgICAgICAgICAgc2VsbDogaW52ZXJzZV9vcmRlcnMuYnV5LCAgLy8gPDwtLSBlc3RvIGZ1bmNpb25hIGFzw4PCrSBjb21vIGVzdMODwqE/XG4gICAgICAgICAgICAgICAgYnV5OiBpbnZlcnNlX29yZGVycy5zZWxsICAgLy8gPDwtLSBlc3RvIGZ1bmNpb25hIGFzw4PCrSBjb21vIGVzdMODwqE/XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VtbWFyeToge1xuICAgICAgICAgICAgICAgIHNjb3BlOiB0aGlzLmludmVyc2VTY29wZSh0YWJsZS5zdW1tYXJ5LnNjb3BlKSxcbiAgICAgICAgICAgICAgICBwcmljZTogdGFibGUuc3VtbWFyeS5pbnZlcnNlLFxuICAgICAgICAgICAgICAgIHByaWNlXzI0aF9hZ286IHRhYmxlLnN1bW1hcnkuaW52ZXJzZV8yNGhfYWdvLFxuICAgICAgICAgICAgICAgIGludmVyc2U6IHRhYmxlLnN1bW1hcnkucHJpY2UsXG4gICAgICAgICAgICAgICAgaW52ZXJzZV8yNGhfYWdvOiB0YWJsZS5zdW1tYXJ5LnByaWNlXzI0aF9hZ28sXG4gICAgICAgICAgICAgICAgbWF4X2ludmVyc2U6IHRhYmxlLnN1bW1hcnkubWF4X3ByaWNlLFxuICAgICAgICAgICAgICAgIG1heF9wcmljZTogdGFibGUuc3VtbWFyeS5tYXhfaW52ZXJzZSxcbiAgICAgICAgICAgICAgICBtaW5faW52ZXJzZTogdGFibGUuc3VtbWFyeS5taW5fcHJpY2UsXG4gICAgICAgICAgICAgICAgbWluX3ByaWNlOiB0YWJsZS5zdW1tYXJ5Lm1pbl9pbnZlcnNlLFxuICAgICAgICAgICAgICAgIHJlY29yZHM6IHRhYmxlLnN1bW1hcnkucmVjb3JkcyxcbiAgICAgICAgICAgICAgICB2b2x1bWU6IHRhYmxlLnN1bW1hcnkuYW1vdW50LFxuICAgICAgICAgICAgICAgIGFtb3VudDogdGFibGUuc3VtbWFyeS52b2x1bWUsXG4gICAgICAgICAgICAgICAgcGVyY2VudDogdGFibGUuc3VtbWFyeS5pcGVyY2VudCxcbiAgICAgICAgICAgICAgICBpcGVyY2VudDogdGFibGUuc3VtbWFyeS5wZXJjZW50LFxuICAgICAgICAgICAgICAgIHBlcmNlbnRfc3RyOiB0YWJsZS5zdW1tYXJ5LmlwZXJjZW50X3N0cixcbiAgICAgICAgICAgICAgICBpcGVyY2VudF9zdHI6IHRhYmxlLnN1bW1hcnkucGVyY2VudF9zdHIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHg6IHRhYmxlLnR4XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldmVyc2U7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFNjb3BlRm9yKGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCkge1xuICAgICAgICBpZiAoIWNvbW9kaXR5IHx8ICFjdXJyZW5jeSkgcmV0dXJuIFwiXCI7XG4gICAgICAgIHJldHVybiBjb21vZGl0eS5zeW1ib2wudG9Mb3dlckNhc2UoKSArIFwiLlwiICsgY3VycmVuY3kuc3ltYm9sLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGludmVyc2VTY29wZShzY29wZTpzdHJpbmcpIHtcbiAgICAgICAgaWYgKCFzY29wZSkgcmV0dXJuIHNjb3BlO1xuICAgICAgICBjb25zb2xlLmFzc2VydCh0eXBlb2Ygc2NvcGUgPT1cInN0cmluZ1wiLCBcIkVSUk9SOiBzdHJpbmcgc2NvcGUgZXhwZWN0ZWQsIGdvdCBcIiwgdHlwZW9mIHNjb3BlLCBzY29wZSk7XG4gICAgICAgIHZhciBwYXJ0cyA9IHNjb3BlLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQocGFydHMubGVuZ3RoID09IDIsIFwiRVJST1I6IHNjb3BlIGZvcm1hdCBleHBlY3RlZCBpcyB4eHgueXl5LCBnb3Q6IFwiLCB0eXBlb2Ygc2NvcGUsIHNjb3BlKTtcbiAgICAgICAgdmFyIGludmVyc2UgPSBwYXJ0c1sxXSArIFwiLlwiICsgcGFydHNbMF07XG4gICAgICAgIHJldHVybiBpbnZlcnNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBjYW5vbmljYWxTY29wZShzY29wZTpzdHJpbmcpIHtcbiAgICAgICAgaWYgKCFzY29wZSkgcmV0dXJuIHNjb3BlO1xuICAgICAgICBjb25zb2xlLmFzc2VydCh0eXBlb2Ygc2NvcGUgPT1cInN0cmluZ1wiLCBcIkVSUk9SOiBzdHJpbmcgc2NvcGUgZXhwZWN0ZWQsIGdvdCBcIiwgdHlwZW9mIHNjb3BlLCBzY29wZSk7XG4gICAgICAgIHZhciBwYXJ0cyA9IHNjb3BlLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQocGFydHMubGVuZ3RoID09IDIsIFwiRVJST1I6IHNjb3BlIGZvcm1hdCBleHBlY3RlZCBpcyB4eHgueXl5LCBnb3Q6IFwiLCB0eXBlb2Ygc2NvcGUsIHNjb3BlKTtcbiAgICAgICAgdmFyIGludmVyc2UgPSBwYXJ0c1sxXSArIFwiLlwiICsgcGFydHNbMF07XG4gICAgICAgIGlmIChwYXJ0c1sxXSA9PSBcInRsb3NcIikge1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJ0c1swXSA9PSBcInRsb3NcIikge1xuICAgICAgICAgICAgcmV0dXJuIGludmVyc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcnRzWzBdIDwgcGFydHNbMV0pIHtcbiAgICAgICAgICAgIHJldHVybiBzY29wZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbnZlcnNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGlzQ2Fub25pY2FsKHNjb3BlOnN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSkgPT0gc2NvcGU7XG4gICAgfVxuXG4gICAgXG4gICAgXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBHZXR0ZXJzIFxuXG4gICAgZ2V0QmFsYW5jZSh0b2tlbjpUb2tlbkRFWCkge1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuYmFsYW5jZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJhbGFuY2VzW2ldLnRva2VuLnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5iYWxhbmNlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEFzc2V0REVYKFwiMCBcIiArIHRva2VuLnN5bWJvbCwgdGhpcyk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0U29tZUZyZWVGYWtlVG9rZW5zKHN5bWJvbDpzdHJpbmcgPSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldFNvbWVGcmVlRmFrZVRva2VucygpXCIpO1xuICAgICAgICB2YXIgX3Rva2VuID0gc3ltYm9sOyAgICBcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJmcmVlZmFrZS1cIitfdG9rZW4gfHwgXCJ0b2tlblwiLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2VuU3RhdHMudGhlbihfID0+IHtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IG51bGw7XG4gICAgICAgICAgICB2YXIgY291bnRzID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTwxMDA7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChzeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudG9rZW5zW2ldLnN5bWJvbCA9PSBzeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgdmFyIHJhbmRvbSA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaSwgXCJSYW5kb206IFwiLCByYW5kb20pO1xuICAgICAgICAgICAgICAgIGlmICghdG9rZW4gJiYgcmFuZG9tID4gMC41KSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50b2tlbnNbaSAlIHRoaXMudG9rZW5zLmxlbmd0aF07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbi5mYWtlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmRvbSA+IDAuNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50ZWxvcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpPDEwMCAmJiB0b2tlbiAmJiB0aGlzLmdldEJhbGFuY2UodG9rZW4pLmFtb3VudC50b051bWJlcigpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaSwgXCJ0b2tlbjogXCIsIHRva2VuKTtcblxuICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICByYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbW9udG8gPSBNYXRoLmZsb29yKDEwMDAwICogcmFuZG9tKSAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHF1YW50aXR5ID0gbmV3IEFzc2V0REVYKFwiXCIgKyBtb250byArIFwiIFwiICsgdG9rZW4uc3ltYm9sICx0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lbW8gPSBcInlvdSBnZXQgXCIgKyBxdWFudGl0eS52YWx1ZVRvU3RyaW5nKCkrIFwiIGZyZWUgZmFrZSBcIiArIHRva2VuLnN5bWJvbCArIFwiIHRva2VucyB0byBwbGF5IG9uIHZhcGFlZS5pbyBERVhcIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZXhjZWN1dGUoXCJpc3N1ZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0bzogIHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogcXVhbnRpdHkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW86IG1lbW9cbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihfID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0QmFsYW5jZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZnJlZWZha2UtXCIrX3Rva2VuIHx8IFwidG9rZW5cIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1lbW87XG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJmcmVlZmFrZS1cIitfdG9rZW4gfHwgXCJ0b2tlblwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgICAgICB9KTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdldFRva2VuTm93KHN5bTpzdHJpbmcpOiBUb2tlbkRFWCB7XG4gICAgICAgIGlmICghc3ltKSByZXR1cm4gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnRva2Vucykge1xuICAgICAgICAgICAgLy8gdGhlcmUncyBhIGxpdHRsZSBidWcuIFRoaXMgaXMgYSBqdXN0YSAgd29yayBhcnJvdW5kXG4gICAgICAgICAgICBpZiAodGhpcy50b2tlbnNbaV0uc3ltYm9sLnRvVXBwZXJDYXNlKCkgPT0gXCJUTE9TXCIgJiYgdGhpcy50b2tlbnNbaV0ub2ZmY2hhaW4pIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHNvbHZlcyBhdHRhY2hpbmcgd3JvbmcgdGxvcyB0b2tlbiB0byBhc3NldFxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRoaXMudG9rZW5zW2ldLnN5bWJvbC50b1VwcGVyQ2FzZSgpID09IHN5bS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGFzeW5jIGdldFRva2VuKHN5bTpzdHJpbmcpOiBQcm9taXNlPFRva2VuREVYPiB7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihfID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFRva2VuTm93KHN5bSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGdldERlcG9zaXRzKGFjY291bnQ6c3RyaW5nID0gbnVsbCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldERlcG9zaXRzKClcIik7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdHNcIiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciBkZXBvc2l0czogQXNzZXRERVhbXSA9IFtdO1xuICAgICAgICAgICAgaWYgKCFhY2NvdW50ICYmIHRoaXMuY3VycmVudC5uYW1lKSB7XG4gICAgICAgICAgICAgICAgYWNjb3VudCA9IHRoaXMuY3VycmVudC5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFjY291bnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gYXdhaXQgdGhpcy5mZXRjaERlcG9zaXRzKGFjY291bnQpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gcmVzdWx0LnJvd3MpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVwb3NpdHMucHVzaChuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uYW1vdW50LCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kZXBvc2l0cyA9IGRlcG9zaXRzO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0c1wiLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZXBvc2l0cztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QmFsYW5jZXMoYWNjb3VudDpzdHJpbmcgPSBudWxsKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVguZ2V0QmFsYW5jZXMoKVwiKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJiYWxhbmNlc1wiLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIF9iYWxhbmNlczogQXNzZXRERVhbXTtcbiAgICAgICAgICAgIGlmICghYWNjb3VudCAmJiB0aGlzLmN1cnJlbnQubmFtZSkge1xuICAgICAgICAgICAgICAgIGFjY291bnQgPSB0aGlzLmN1cnJlbnQubmFtZTtcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChhY2NvdW50KSB7XG4gICAgICAgICAgICAgICAgX2JhbGFuY2VzID0gYXdhaXQgdGhpcy5mZXRjaEJhbGFuY2VzKGFjY291bnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5iYWxhbmNlcyA9IF9iYWxhbmNlcztcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYIGJhbGFuY2VzIHVwZGF0ZWRcIik7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJhbGFuY2VzXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJhbGFuY2VzO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRUaGlzU2VsbE9yZGVycyh0YWJsZTpzdHJpbmcsIGlkczpudW1iZXJbXSk6IFByb21pc2U8YW55W10+IHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ0aGlzb3JkZXJzXCIsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGlkcykge1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IGlkc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgZ290aXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqIGluIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0W2pdLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnb3RpdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZ290aXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciByZXM6VGFibGVSZXN1bHQgPSBhd2FpdCB0aGlzLmZldGNoT3JkZXJzKHtzY29wZTp0YWJsZSwgbGltaXQ6MSwgbG93ZXJfYm91bmQ6aWQudG9TdHJpbmcoKX0pO1xuXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdChyZXMucm93cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInRoaXNvcmRlcnNcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7ICAgIFxuICAgIH1cblxuICAgIGFzeW5jIGdldFVzZXJPcmRlcnMoYWNjb3VudDpzdHJpbmcgPSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldFVzZXJPcmRlcnMoKVwiKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ1c2Vyb3JkZXJzXCIsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgdXNlcm9yZGVyczogVGFibGVSZXN1bHQ7XG4gICAgICAgICAgICBpZiAoIWFjY291bnQgJiYgdGhpcy5jdXJyZW50Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICBhY2NvdW50ID0gdGhpcy5jdXJyZW50Lm5hbWU7XG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoYWNjb3VudCkge1xuICAgICAgICAgICAgICAgIHVzZXJvcmRlcnMgPSBhd2FpdCB0aGlzLmZldGNoVXNlck9yZGVycyhhY2NvdW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsaXN0OiBVc2VyT3JkZXJzW10gPSA8VXNlck9yZGVyc1tdPnVzZXJvcmRlcnMucm93cztcbiAgICAgICAgICAgIHZhciBtYXA6IFVzZXJPcmRlcnNNYXAgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkcyA9IGxpc3RbaV0uaWRzO1xuICAgICAgICAgICAgICAgIHZhciB0YWJsZSA9IGxpc3RbaV0udGFibGU7XG4gICAgICAgICAgICAgICAgdmFyIG9yZGVycyA9IGF3YWl0IHRoaXMuZ2V0VGhpc1NlbGxPcmRlcnModGFibGUsIGlkcyk7XG4gICAgICAgICAgICAgICAgbWFwW3RhYmxlXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGU6IHRhYmxlLFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnM6IHRoaXMuYXV4UHJvY2Vzc1Jvd3NUb09yZGVycyhvcmRlcnMpLFxuICAgICAgICAgICAgICAgICAgICBpZHM6aWRzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudXNlcm9yZGVycyA9IG1hcDtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMudXNlcm9yZGVycyk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInVzZXJvcmRlcnNcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlcm9yZGVycztcbiAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlQWN0aXZpdHkoKSB7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYWN0aXZpdHlcIiwgdHJ1ZSk7XG4gICAgICAgIHZhciBwYWdlc2l6ZSA9IHRoaXMuYWN0aXZpdHlQYWdlc2l6ZTtcbiAgICAgICAgdmFyIHBhZ2VzID0gYXdhaXQgdGhpcy5nZXRBY3Rpdml0eVRvdGFsUGFnZXMocGFnZXNpemUpO1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0aGlzLmZldGNoQWN0aXZpdHkocGFnZXMtMiwgcGFnZXNpemUpLFxuICAgICAgICAgICAgdGhpcy5mZXRjaEFjdGl2aXR5KHBhZ2VzLTEsIHBhZ2VzaXplKSxcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hBY3Rpdml0eShwYWdlcy0wLCBwYWdlc2l6ZSlcbiAgICAgICAgXSk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYWN0aXZpdHlcIiwgZmFsc2UpO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRNb3JlQWN0aXZpdHkoKSB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2aXR5Lmxpc3QubGVuZ3RoID09IDApIHJldHVybjtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJhY3Rpdml0eVwiLCB0cnVlKTtcbiAgICAgICAgdmFyIHBhZ2VzaXplID0gdGhpcy5hY3Rpdml0eVBhZ2VzaXplO1xuICAgICAgICB2YXIgZmlyc3QgPSB0aGlzLmFjdGl2aXR5Lmxpc3RbdGhpcy5hY3Rpdml0eS5saXN0Lmxlbmd0aC0xXTtcbiAgICAgICAgdmFyIGlkID0gZmlyc3QuaWQgLSBwYWdlc2l6ZTtcbiAgICAgICAgdmFyIHBhZ2UgPSBNYXRoLmZsb29yKChpZC0xKSAvIHBhZ2VzaXplKTtcblxuICAgICAgICBhd2FpdCB0aGlzLmZldGNoQWN0aXZpdHkocGFnZSwgcGFnZXNpemUpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImFjdGl2aXR5XCIsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGVUcmFkZShjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgsIHVwZGF0ZVVzZXI6Ym9vbGVhbiA9IHRydWUpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC51cGRhdGVUcmFkZSgpXCIpO1xuICAgICAgICB2YXIgY2hyb25vX2tleSA9IFwidXBkYXRlVHJhZGVcIjtcbiAgICAgICAgdGhpcy5mZWVkLnN0YXJ0Q2hyb25vKGNocm9ub19rZXkpO1xuXG4gICAgICAgIGlmKHVwZGF0ZVVzZXIpIHRoaXMudXBkYXRlQ3VycmVudFVzZXIoKTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMuZ2V0VHJhbnNhY3Rpb25IaXN0b3J5KGNvbW9kaXR5LCBjdXJyZW5jeSwgLTEsIC0xLCB0cnVlKS50aGVuKF8gPT4gdGhpcy5mZWVkLnNldE1hcmNrKGNocm9ub19rZXksIFwiZ2V0VHJhbnNhY3Rpb25IaXN0b3J5KClcIikpLFxuICAgICAgICAgICAgdGhpcy5nZXRCbG9ja0hpc3RvcnkoY29tb2RpdHksIGN1cnJlbmN5LCAtMSwgLTEsIHRydWUpLnRoZW4oXyA9PiB0aGlzLmZlZWQuc2V0TWFyY2soY2hyb25vX2tleSwgXCJnZXRCbG9ja0hpc3RvcnkoKVwiKSksXG4gICAgICAgICAgICB0aGlzLmdldFNlbGxPcmRlcnMoY29tb2RpdHksIGN1cnJlbmN5LCB0cnVlKS50aGVuKF8gPT4gdGhpcy5mZWVkLnNldE1hcmNrKGNocm9ub19rZXksIFwiZ2V0U2VsbE9yZGVycygpXCIpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0QnV5T3JkZXJzKGNvbW9kaXR5LCBjdXJyZW5jeSwgdHJ1ZSkudGhlbihfID0+IHRoaXMuZmVlZC5zZXRNYXJjayhjaHJvbm9fa2V5LCBcImdldEJ1eU9yZGVycygpXCIpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0TWFya2V0U3VtbWFyeShjb21vZGl0eSwgY3VycmVuY3ksIHRydWUpLnRoZW4oXyA9PiB0aGlzLmZlZWQuc2V0TWFyY2soY2hyb25vX2tleSwgXCJnZXRNYXJrZXRTdW1tYXJ5KClcIikpLFxuICAgICAgICAgICAgdGhpcy5nZXRPcmRlclN1bW1hcnkoKS50aGVuKF8gPT4gdGhpcy5mZWVkLnNldE1hcmNrKGNocm9ub19rZXksIFwiZ2V0T3JkZXJTdW1tYXJ5KClcIikpLFxuICAgICAgICBdKS50aGVuKHIgPT4ge1xuICAgICAgICAgICAgdGhpcy5fcmV2ZXJzZSA9IHt9O1xuICAgICAgICAgICAgdGhpcy5yZXNvcnRUb2tlbnMoKTtcbiAgICAgICAgICAgIHRoaXMucmVzb3J0VG9wTWFya2V0cygpO1xuICAgICAgICAgICAgLy8gdGhpcy5mZWVkLnByaW50Q2hyb25vKGNocm9ub19rZXkpO1xuICAgICAgICAgICAgdGhpcy5vblRyYWRlVXBkYXRlZC5uZXh0KG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZUN1cnJlbnRVc2VyKCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnVwZGF0ZUN1cnJlbnRVc2VyKClcIik7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY3VycmVudFwiLCB0cnVlKTsgICAgICAgIFxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGhpcy5nZXRVc2VyT3JkZXJzKCksXG4gICAgICAgICAgICB0aGlzLmdldERlcG9zaXRzKCksXG4gICAgICAgICAgICB0aGlzLmdldEJhbGFuY2VzKClcbiAgICAgICAgXSkudGhlbihfID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY3VycmVudFwiLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gXztcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImN1cnJlbnRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRCbG9ja0hpc3RvcnlUb3RhbFBhZ2VzRm9yKHNjb3BlOnN0cmluZywgcGFnZXNpemU6IG51bWJlcikge1xuICAgICAgICBpZiAoIXRoaXMuX21hcmtldHMpIHJldHVybiAwO1xuICAgICAgICB2YXIgbWFya2V0ID0gdGhpcy5tYXJrZXQoc2NvcGUpO1xuICAgICAgICBpZiAoIW1hcmtldCkgcmV0dXJuIDA7XG4gICAgICAgIHZhciB0b3RhbCA9IG1hcmtldC5ibG9ja3M7XG4gICAgICAgIHZhciBtb2QgPSB0b3RhbCAlIHBhZ2VzaXplO1xuICAgICAgICB2YXIgZGlmID0gdG90YWwgLSBtb2Q7XG4gICAgICAgIHZhciBwYWdlcyA9IGRpZiAvIHBhZ2VzaXplO1xuICAgICAgICBpZiAobW9kID4gMCkge1xuICAgICAgICAgICAgcGFnZXMgKz0xO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZ2V0QmxvY2tIaXN0b3J5VG90YWxQYWdlc0ZvcigpIHRvdGFsOlwiLCB0b3RhbCwgXCIgcGFnZXM6XCIsIHBhZ2VzKTtcbiAgICAgICAgcmV0dXJuIHBhZ2VzO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SGlzdG9yeVRvdGFsUGFnZXNGb3Ioc2NvcGU6c3RyaW5nLCBwYWdlc2l6ZTogbnVtYmVyKSB7XG4gICAgICAgIGlmICghdGhpcy5fbWFya2V0cykgcmV0dXJuIDA7XG4gICAgICAgIHZhciBtYXJrZXQgPSB0aGlzLm1hcmtldChzY29wZSk7XG4gICAgICAgIGlmICghbWFya2V0KSByZXR1cm4gMDtcbiAgICAgICAgdmFyIHRvdGFsID0gbWFya2V0LmRlYWxzO1xuICAgICAgICB2YXIgbW9kID0gdG90YWwgJSBwYWdlc2l6ZTtcbiAgICAgICAgdmFyIGRpZiA9IHRvdGFsIC0gbW9kO1xuICAgICAgICB2YXIgcGFnZXMgPSBkaWYgLyBwYWdlc2l6ZTtcbiAgICAgICAgaWYgKG1vZCA+IDApIHtcbiAgICAgICAgICAgIHBhZ2VzICs9MTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFnZXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRBY3Rpdml0eVRvdGFsUGFnZXMocGFnZXNpemU6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcImV2ZW50c1wiLCB7XG4gICAgICAgICAgICBsaW1pdDogMVxuICAgICAgICB9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gcmVzdWx0LnJvd3NbMF0ucGFyYW1zO1xuICAgICAgICAgICAgdmFyIHRvdGFsID0gcGFyc2VJbnQocGFyYW1zLnNwbGl0KFwiIFwiKVswXSktMTtcbiAgICAgICAgICAgIHZhciBtb2QgPSB0b3RhbCAlIHBhZ2VzaXplO1xuICAgICAgICAgICAgdmFyIGRpZiA9IHRvdGFsIC0gbW9kO1xuICAgICAgICAgICAgdmFyIHBhZ2VzID0gZGlmIC8gcGFnZXNpemU7XG4gICAgICAgICAgICBpZiAobW9kID4gMCkge1xuICAgICAgICAgICAgICAgIHBhZ2VzICs9MTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdHkudG90YWwgPSB0b3RhbDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldEFjdGl2aXR5VG90YWxQYWdlcygpIHRvdGFsOiBcIiwgdG90YWwsIFwiIHBhZ2VzOiBcIiwgcGFnZXMpO1xuICAgICAgICAgICAgcmV0dXJuIHBhZ2VzO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRUcmFuc2FjdGlvbkhpc3RvcnkoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYLCBwYWdlOm51bWJlciA9IC0xLCBwYWdlc2l6ZTpudW1iZXIgPSAtMSwgZm9yY2U6Ym9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgdmFyIHNjb3BlOnN0cmluZyA9IHRoaXMuY2Fub25pY2FsU2NvcGUodGhpcy5nZXRTY29wZUZvcihjb21vZGl0eSwgY3VycmVuY3kpKTtcbiAgICAgICAgdmFyIGF1eCA9IG51bGw7XG4gICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImhpc3RvcnkuXCIrc2NvcGUsIHRydWUpO1xuICAgICAgICBhdXggPSB0aGlzLndhaXRPcmRlclN1bW1hcnkudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIGlmIChwYWdlc2l6ZSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIHBhZ2VzaXplID0gMTA7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhZ2UgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLmdldEhpc3RvcnlUb3RhbFBhZ2VzRm9yKHNjb3BlLCBwYWdlc2l6ZSk7XG4gICAgICAgICAgICAgICAgcGFnZSA9IHBhZ2VzLTM7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UgPCAwKSBwYWdlID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoSGlzdG9yeShzY29wZSwgcGFnZSswLCBwYWdlc2l6ZSksXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaEhpc3Rvcnkoc2NvcGUsIHBhZ2UrMSwgcGFnZXNpemUpLFxuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hIaXN0b3J5KHNjb3BlLCBwYWdlKzIsIHBhZ2VzaXplKVxuICAgICAgICAgICAgXSkudGhlbihfID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImhpc3RvcnkuXCIrc2NvcGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXJrZXQoc2NvcGUpLmhpc3Rvcnk7XG4gICAgICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImhpc3RvcnkuXCIrc2NvcGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLm1hcmtldChzY29wZSkgJiYgIWZvcmNlKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLm1hcmtldChzY29wZSkuaGlzdG9yeTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGF1eDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub25IaXN0b3J5Q2hhbmdlLm5leHQocmVzdWx0KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXV4SG91clRvTGFiZWwoaG91cjpudW1iZXIpOiBzdHJpbmcge1xuICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKGhvdXIgKiAxMDAwICogNjAgKiA2MCk7XG4gICAgICAgIHZhciBsYWJlbCA9IGQuZ2V0SG91cnMoKSA9PSAwID8gdGhpcy5kYXRlUGlwZS50cmFuc2Zvcm0oZCwgJ2RkL01NJykgOiBkLmdldEhvdXJzKCkgKyBcImhcIjtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBsYWJlbDtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRCbG9ja0hpc3RvcnkoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYLCBwYWdlOm51bWJlciA9IC0xLCBwYWdlc2l6ZTpudW1iZXIgPSAtMSwgZm9yY2U6Ym9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVguZ2V0QmxvY2tIaXN0b3J5KClcIiwgY29tb2RpdHkuc3ltYm9sLCBwYWdlLCBwYWdlc2l6ZSk7XG4gICAgICAgIC8vIC8vIGVsYXBzZWQgdGltZVxuICAgICAgICAvLyB2YXIgc3RhcnRUaW1lOkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAvLyB2YXIgZGlmZjpudW1iZXI7XG4gICAgICAgIC8vIHZhciBzZWM6bnVtYmVyO1xuXG4gICAgICAgIHZhciBzY29wZTpzdHJpbmcgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHRoaXMuZ2V0U2NvcGVGb3IoY29tb2RpdHksIGN1cnJlbmN5KSk7XG4gICAgICAgIHZhciBhdXggPSBudWxsO1xuICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJibG9jay1oaXN0b3J5LlwiK3Njb3BlLCB0cnVlKTtcblxuICAgICAgICBhdXggPSB0aGlzLndhaXRPcmRlclN1bW1hcnkudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciBmZXRjaEJsb2NrSGlzdG9yeVN0YXJ0OkRhdGUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgICAgICBpZiAocGFnZXNpemUgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBwYWdlc2l6ZSA9IDEwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhZ2UgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLmdldEJsb2NrSGlzdG9yeVRvdGFsUGFnZXNGb3Ioc2NvcGUsIHBhZ2VzaXplKTtcbiAgICAgICAgICAgICAgICBwYWdlID0gcGFnZXMtMztcbiAgICAgICAgICAgICAgICBpZiAocGFnZSA8IDApIHBhZ2UgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHByb21pc2VzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8PXBhZ2VzOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IHRoaXMuZmV0Y2hCbG9ja0hpc3Rvcnkoc2NvcGUsIGksIHBhZ2VzaXplKTtcbiAgICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICAgICAgLy8gLy8gZWxhcHNlZCB0aW1lXG4gICAgICAgICAgICAgICAgLy8gdmFyIGZldGNoQmxvY2tIaXN0b3J5VGltZTpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAvLyBkaWZmID0gZmV0Y2hCbG9ja0hpc3RvcnlUaW1lLmdldFRpbWUoKSAtIGZldGNoQmxvY2tIaXN0b3J5U3RhcnQuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIC8vIHNlYyA9IGRpZmYgLyAxMDAwO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKiogVmFwYWVlREVYLmdldEJsb2NrSGlzdG9yeSgpIGZldGNoQmxvY2tIaXN0b3J5VGltZSBzZWM6IFwiLCBzZWMsIFwiKFwiLGRpZmYsXCIpXCIpO1xuXG5cbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJsb2NrLWhpc3RvcnkuXCIrc2NvcGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB2YXIgbWFya2V0OiBNYXJrZXQgPSB0aGlzLm1hcmtldChzY29wZSk7XG4gICAgICAgICAgICAgICAgbWFya2V0LmJsb2NrbGlzdCA9IFtdO1xuICAgICAgICAgICAgICAgIG1hcmtldC5yZXZlcnNlYmxvY2tzID0gW107XG4gICAgICAgICAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgdmFyIGhvcmEgPSAxMDAwICogNjAgKiA2MDtcbiAgICAgICAgICAgICAgICB2YXIgaG91ciA9IE1hdGguZmxvb3Iobm93LmdldFRpbWUoKS9ob3JhKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0+XCIsIGhvdXIpO1xuICAgICAgICAgICAgICAgIHZhciBsYXN0X2Jsb2NrID0gbnVsbDtcbiAgICAgICAgICAgICAgICB2YXIgbGFzdF9ob3VyID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIHZhciBvcmRlcmVkX2Jsb2NrcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gbWFya2V0LmJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgIG9yZGVyZWRfYmxvY2tzLnB1c2gobWFya2V0LmJsb2NrW2ldKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBvcmRlcmVkX2Jsb2Nrcy5zb3J0KGZ1bmN0aW9uKGE6SGlzdG9yeUJsb2NrLCBiOkhpc3RvcnlCbG9jaykge1xuICAgICAgICAgICAgICAgICAgICBpZihhLmhvdXIgPCBiLmhvdXIpIHJldHVybiAtMTE7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH0pO1xuXG5cblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gb3JkZXJlZF9ibG9ja3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJsb2NrOkhpc3RvcnlCbG9jayA9IG9yZGVyZWRfYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLmF1eEhvdXJUb0xhYmVsKGJsb2NrLmhvdXIpO1xuICAgICAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0+XCIsIGksIGxhYmVsLCBibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRlID0gYmxvY2suZGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpZiA9IG5vdy5nZXRUaW1lKCkgLSBibG9jay5kYXRlLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lcyA9IDMwICogMjQgKiBob3JhO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWxhcHNlZF9tb250aHMgPSBkaWYgLyBtZXM7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGFwc2VkX21vbnRocyA+IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZHJvcHBpbmcgYmxvY2sgdG9vIG9sZFwiLCBbYmxvY2ssIGJsb2NrLmRhdGUudG9VVENTdHJpbmcoKV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdF9ibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpZiA9IGJsb2NrLmhvdXIgLSBsYXN0X2Jsb2NrLmhvdXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqPTE7IGo8ZGlmOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWxfaSA9IHRoaXMuYXV4SG91clRvTGFiZWwobGFzdF9ibG9jay5ob3VyK2opO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0+XCIsIGosIGxhYmVsX2ksIGJsb2NrKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbmluaWNhbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlID0gbGFzdF9ibG9jay5wcmljZS5hbW91bnQudG9OdW1iZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXV4ID0gW2xhYmVsX2ksIHByaWNlLCBwcmljZSwgcHJpY2UsIHByaWNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXQuYmxvY2tsaXN0LnB1c2goYXV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXZlcnNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW52ZXJzZSA9IGxhc3RfYmxvY2suaW52ZXJzZS5hbW91bnQudG9OdW1iZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXV4ID0gW2xhYmVsX2ksIGludmVyc2UsIGludmVyc2UsIGludmVyc2UsIGludmVyc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtldC5yZXZlcnNlYmxvY2tzLnB1c2goYXV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqOmFueVtdO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25pbmljYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICBvYmogPSBbbGFiZWxdO1xuICAgICAgICAgICAgICAgICAgICBvYmoucHVzaChibG9jay5tYXguYW1vdW50LnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICBvYmoucHVzaChibG9jay5lbnRyYW5jZS5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKGJsb2NrLnByaWNlLmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goYmxvY2subWluLmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2V0LmJsb2NrbGlzdC5wdXNoKG9iaik7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJldmVyc2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICBvYmogPSBbbGFiZWxdO1xuICAgICAgICAgICAgICAgICAgICBvYmoucHVzaCgxLjAvYmxvY2subWF4LmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goMS4wL2Jsb2NrLmVudHJhbmNlLmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goMS4wL2Jsb2NrLnByaWNlLmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goMS4wL2Jsb2NrLm1pbi5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtldC5yZXZlcnNlYmxvY2tzLnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgICAgICAgbGFzdF9ibG9jayA9IGJsb2NrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChsYXN0X2Jsb2NrICYmIGhvdXIgIT0gbGFzdF9ibG9jay5ob3VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaWYgPSBob3VyIC0gbGFzdF9ibG9jay5ob3VyO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqPTE7IGo8PWRpZjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWxfaSA9IHRoaXMuYXV4SG91clRvTGFiZWwobGFzdF9ibG9jay5ob3VyK2opO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25pbmljYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlID0gbGFzdF9ibG9jay5wcmljZS5hbW91bnQudG9OdW1iZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdXggPSBbbGFiZWxfaSwgcHJpY2UsIHByaWNlLCBwcmljZSwgcHJpY2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2V0LmJsb2NrbGlzdC5wdXNoKGF1eCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJldmVyc2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGludmVyc2UgPSBsYXN0X2Jsb2NrLmludmVyc2UuYW1vdW50LnRvTnVtYmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXV4ID0gW2xhYmVsX2ksIGludmVyc2UsIGludmVyc2UsIGludmVyc2UsIGludmVyc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2V0LnJldmVyc2VibG9ja3MucHVzaChhdXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gLy8gZWxhcHNlZCB0aW1lXG4gICAgICAgICAgICAgICAgLy8gdmFyIGZpcnN0TGV2ZWxUaW1lOkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIC8vIGRpZmYgPSBmaXJzdExldmVsVGltZS5nZXRUaW1lKCkgLSBmZXRjaEJsb2NrSGlzdG9yeVRpbWUuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIC8vIHNlYyA9IGRpZmYgLyAxMDAwO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKiogVmFwYWVlREVYLmdldEJsb2NrSGlzdG9yeSgpIGZpcnN0TGV2ZWxUaW1lIHNlYzogXCIsIHNlYywgXCIoXCIsZGlmZixcIilcIik7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLT5cIiwgbWFya2V0LmJsb2NrbGlzdCk7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5vbkJsb2NrbGlzdENoYW5nZS5uZXh0KG1hcmtldC5ibG9ja2xpc3QpO1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXJrZXQ7XG4gICAgICAgICAgICB9KS50aGVuKG1hcmtldCA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgICAgICAgLy8gLy8gZWxhcHNlZCB0aW1lXG4gICAgICAgICAgICAgICAgLy8gdmFyIGFsbExldmVsc1N0YXJ0OkRhdGUgPSBuZXcgRGF0ZSgpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgbGltaXQgPSAyNTY7XG4gICAgICAgICAgICAgICAgdmFyIGxldmVscyA9IFttYXJrZXQuYmxvY2tsaXN0XTtcbiAgICAgICAgICAgICAgICB2YXIgcmV2ZXJzZXMgPSBbbWFya2V0LnJldmVyc2VibG9ja3NdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGN1cnJlbnQgPSAwOyBsZXZlbHNbY3VycmVudF0ubGVuZ3RoID4gbGltaXQ7IGN1cnJlbnQrKykge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjdXJyZW50ICxsZXZlbHNbY3VycmVudF0ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld2xldmVsOmFueVtdW10gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld3JldmVyc2U6YW55W11bXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWVyZ2VkOmFueVtdID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxsZXZlbHNbY3VycmVudF0ubGVuZ3RoOyBpKz0yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYW5vbmljYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2XzE6YW55W10gPSBsZXZlbHNbY3VycmVudF1baV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdl8yID0gbGV2ZWxzW2N1cnJlbnRdW2krMV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVyZ2VkID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4PTA7IHg8NTsgeCsrKSBtZXJnZWRbeF0gPSB2XzFbeF07IC8vIGNsZWFuIGNvcHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2XzIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbMF0gPSB2XzFbMF0uc3BsaXQoXCIvXCIpLmxlbmd0aCA+IDEgPyB2XzFbMF0gOiB2XzJbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzFdID0gTWF0aC5tYXgodl8xWzFdLCB2XzJbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFsyXSA9IHZfMVsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbM10gPSB2XzJbM107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzRdID0gTWF0aC5taW4odl8xWzRdLCB2XzJbNF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3bGV2ZWwucHVzaChtZXJnZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZXZlcnNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICAgICAgdl8xID0gcmV2ZXJzZXNbY3VycmVudF1baV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2XzIgPSByZXZlcnNlc1tjdXJyZW50XVtpKzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4PTA7IHg8NTsgeCsrKSBtZXJnZWRbeF0gPSB2XzFbeF07IC8vIGNsZWFuIGNvcHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2XzIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbMF0gPSB2XzFbMF0uc3BsaXQoXCIvXCIpLmxlbmd0aCA+IDEgPyB2XzFbMF0gOiB2XzJbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzFdID0gTWF0aC5taW4odl8xWzFdLCB2XzJbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFsyXSA9IHZfMVsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbM10gPSB2XzJbM107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzRdID0gTWF0aC5tYXgodl8xWzRdLCB2XzJbNF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld3JldmVyc2UucHVzaChtZXJnZWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV2ZWxzLnB1c2gobmV3bGV2ZWwpO1xuICAgICAgICAgICAgICAgICAgICByZXZlcnNlcy5wdXNoKG5ld3JldmVyc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgIG1hcmtldC5ibG9ja2xldmVscyA9IGxldmVscztcbiAgICAgICAgICAgICAgICBtYXJrZXQucmV2ZXJzZWxldmVscyA9IHJldmVyc2VzO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIC8vIG1hcmtldC5ibG9ja2xldmVscyA9IFttYXJrZXQuYmxvY2tsaXN0XTtcbiAgICAgICAgICAgICAgICAvLyBtYXJrZXQucmV2ZXJzZWxldmVscyA9IFttYXJrZXQucmV2ZXJzZWJsb2Nrc107XG4gICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAvLyBlbGFwc2VkIHRpbWVcbiAgICAgICAgICAgICAgICAvLyB2YXIgYWxsTGV2ZWxzVGltZTpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAvLyBkaWZmID0gYWxsTGV2ZWxzVGltZS5nZXRUaW1lKCkgLSBhbGxMZXZlbHNTdGFydC5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgLy8gc2VjID0gZGlmZiAvIDEwMDA7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKiBWYXBhZWVERVguZ2V0QmxvY2tIaXN0b3J5KCkgYWxsTGV2ZWxzVGltZSBzZWM6IFwiLCBzZWMsIFwiKFwiLGRpZmYsXCIpXCIpOyAgIFxuICAgICAgICAgICAgICAgIC8vIC8vIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIsIG1hcmtldC5ibG9ja2xldmVscyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbWFya2V0LmJsb2NrO1xuICAgICAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJibG9jay1oaXN0b3J5LlwiK3Njb3BlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5tYXJrZXQoc2NvcGUpICYmICFmb3JjZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5tYXJrZXQoc2NvcGUpLmJsb2NrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gYXV4O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vbkhpc3RvcnlDaGFuZ2UubmV4dChyZXN1bHQpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0U2VsbE9yZGVycyhjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgsIGZvcmNlOmJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHZhciBzY29wZTpzdHJpbmcgPSB0aGlzLmdldFNjb3BlRm9yKGNvbW9kaXR5LCBjdXJyZW5jeSk7XG4gICAgICAgIHZhciBjYW5vbmljYWw6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgIHZhciByZXZlcnNlOnN0cmluZyA9IHRoaXMuaW52ZXJzZVNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgIHZhciBhdXggPSBudWxsO1xuICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJzZWxsb3JkZXJzXCIsIHRydWUpO1xuICAgICAgICBhdXggPSB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciBvcmRlcnMgPSBhd2FpdCB0aGlzLmZldGNoT3JkZXJzKHtzY29wZTpjYW5vbmljYWwsIGxpbWl0OjEwMCwgaW5kZXhfcG9zaXRpb246IFwiMlwiLCBrZXlfdHlwZTogXCJpNjRcIn0pO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdID0gdGhpcy5hdXhBc3NlcnRTY29wZShjYW5vbmljYWwpO1xuICAgICAgICAgICAgLy8gaWYoc2NvcGU9PVwidnBlLnRsb3NcIiB8fCBzY29wZT09XCJjbnQudGxvc1wiKWNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cInZwZS50bG9zXCIgfHwgc2NvcGU9PVwiY250LnRsb3NcIiljb25zb2xlLmxvZyhcIlNlbGwgY3J1ZG86XCIsIG9yZGVycyk7XG4gICAgICAgICAgICB2YXIgc2VsbDogT3JkZXJbXSA9IHRoaXMuYXV4UHJvY2Vzc1Jvd3NUb09yZGVycyhvcmRlcnMucm93cyk7XG4gICAgICAgICAgICBzZWxsLnNvcnQoZnVuY3Rpb24oYTpPcmRlciwgYjpPcmRlcikge1xuICAgICAgICAgICAgICAgIGlmKGEucHJpY2UuYW1vdW50LmlzTGVzc1RoYW4oYi5wcmljZS5hbW91bnQpKSByZXR1cm4gLTExO1xuICAgICAgICAgICAgICAgIGlmKGEucHJpY2UuYW1vdW50LmlzR3JlYXRlclRoYW4oYi5wcmljZS5hbW91bnQpKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gaWYoc2NvcGU9PVwidnBlLnRsb3NcIiB8fCBzY29wZT09XCJjbnQudGxvc1wiKWNvbnNvbGUubG9nKFwic29ydGVkOlwiLCBzZWxsKTtcbiAgICAgICAgICAgIC8vIGdyb3VwaW5nIHRvZ2V0aGVyIG9yZGVycyB3aXRoIHRoZSBzYW1lIHByaWNlLlxuICAgICAgICAgICAgdmFyIGxpc3Q6IE9yZGVyUm93W10gPSBbXTtcbiAgICAgICAgICAgIHZhciByb3c6IE9yZGVyUm93O1xuICAgICAgICAgICAgaWYgKHNlbGwubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPHNlbGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9yZGVyOiBPcmRlciA9IHNlbGxbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdyA9IGxpc3RbbGlzdC5sZW5ndGgtMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93LnByaWNlLmFtb3VudC5lcShvcmRlci5wcmljZS5hbW91bnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LnRvdGFsLmFtb3VudCA9IHJvdy50b3RhbC5hbW91bnQucGx1cyhvcmRlci50b3RhbC5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy50ZWxvcy5hbW91bnQgPSByb3cudGVsb3MuYW1vdW50LnBsdXMob3JkZXIudGVsb3MuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cub3duZXJzW29yZGVyLm93bmVyXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93Lm9yZGVycy5wdXNoKG9yZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gICAgXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcm93ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyOiBvcmRlci5wcmljZS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IG9yZGVyLnByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiBvcmRlci50b3RhbC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVsb3M6IG9yZGVyLnRlbG9zLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiBvcmRlci5pbnZlcnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VtOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VtdGVsb3M6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcnM6IHt9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByb3cub3duZXJzW29yZGVyLm93bmVyXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJvdy5vcmRlcnMucHVzaChvcmRlcik7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHN1bSA9IG5ldyBCaWdOdW1iZXIoMCk7XG4gICAgICAgICAgICB2YXIgc3VtdGVsb3MgPSBuZXcgQmlnTnVtYmVyKDApO1xuICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBsaXN0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG9yZGVyX3JvdyA9IGxpc3Rbal07XG4gICAgICAgICAgICAgICAgc3VtdGVsb3MgPSBzdW10ZWxvcy5wbHVzKG9yZGVyX3Jvdy50ZWxvcy5hbW91bnQpO1xuICAgICAgICAgICAgICAgIHN1bSA9IHN1bS5wbHVzKG9yZGVyX3Jvdy50b3RhbC5hbW91bnQpO1xuICAgICAgICAgICAgICAgIG9yZGVyX3Jvdy5zdW10ZWxvcyA9IG5ldyBBc3NldERFWChzdW10ZWxvcywgb3JkZXJfcm93LnRlbG9zLnRva2VuKTtcbiAgICAgICAgICAgICAgICBvcmRlcl9yb3cuc3VtID0gbmV3IEFzc2V0REVYKHN1bSwgb3JkZXJfcm93LnRvdGFsLnRva2VuKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLm9yZGVycy5zZWxsID0gbGlzdDtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cInZwZS50bG9zXCIgfHwgc2NvcGU9PVwiY250LnRsb3NcIiljb25zb2xlLmxvZyhcIlNlbGwgZmluYWw6XCIsIHRoaXMuc2NvcGVzW3Njb3BlXS5vcmRlcnMuc2VsbCk7XG4gICAgICAgICAgICAvLyBpZihzY29wZT09XCJ2cGUudGxvc1wiIHx8IHNjb3BlPT1cImNudC50bG9zXCIpY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tXCIpO1xuXG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInNlbGxvcmRlcnNcIiwgZmFsc2UpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5vcmRlcnMuc2VsbDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSAmJiAhZm9yY2UpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5vcmRlcnMuc2VsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGF1eDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBcbiAgICBhc3luYyBnZXRCdXlPcmRlcnMoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYLCBmb3JjZTpib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB2YXIgc2NvcGU6c3RyaW5nID0gdGhpcy5nZXRTY29wZUZvcihjb21vZGl0eSwgY3VycmVuY3kpO1xuICAgICAgICB2YXIgY2Fub25pY2FsOnN0cmluZyA9IHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpO1xuICAgICAgICB2YXIgcmV2ZXJzZTpzdHJpbmcgPSB0aGlzLmludmVyc2VTY29wZShjYW5vbmljYWwpO1xuXG5cbiAgICAgICAgdmFyIGF1eCA9IG51bGw7XG4gICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJ1eW9yZGVyc1wiLCB0cnVlKTtcbiAgICAgICAgYXV4ID0gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgb3JkZXJzID0gYXdhaXQgYXdhaXQgdGhpcy5mZXRjaE9yZGVycyh7c2NvcGU6cmV2ZXJzZSwgbGltaXQ6NTAsIGluZGV4X3Bvc2l0aW9uOiBcIjJcIiwga2V5X3R5cGU6IFwiaTY0XCJ9KTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSA9IHRoaXMuYXV4QXNzZXJ0U2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQnV5IGNydWRvOlwiLCBvcmRlcnMpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGJ1eTogT3JkZXJbXSA9IHRoaXMuYXV4UHJvY2Vzc1Jvd3NUb09yZGVycyhvcmRlcnMucm93cyk7XG4gICAgICAgICAgICBidXkuc29ydChmdW5jdGlvbihhOk9yZGVyLCBiOk9yZGVyKXtcbiAgICAgICAgICAgICAgICBpZihhLnByaWNlLmFtb3VudC5pc0xlc3NUaGFuKGIucHJpY2UuYW1vdW50KSkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgaWYoYS5wcmljZS5hbW91bnQuaXNHcmVhdGVyVGhhbihiLnByaWNlLmFtb3VudCkpIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImJ1eSBzb3J0ZWFkbzpcIiwgYnV5KTtcblxuICAgICAgICAgICAgLy8gZ3JvdXBpbmcgdG9nZXRoZXIgb3JkZXJzIHdpdGggdGhlIHNhbWUgcHJpY2UuXG4gICAgICAgICAgICB2YXIgbGlzdDogT3JkZXJSb3dbXSA9IFtdO1xuICAgICAgICAgICAgdmFyIHJvdzogT3JkZXJSb3c7XG4gICAgICAgICAgICBpZiAoYnV5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxidXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9yZGVyOiBPcmRlciA9IGJ1eVtpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93ID0gbGlzdFtsaXN0Lmxlbmd0aC0xXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3cucHJpY2UuYW1vdW50LmVxKG9yZGVyLnByaWNlLmFtb3VudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cudG90YWwuYW1vdW50ID0gcm93LnRvdGFsLmFtb3VudC5wbHVzKG9yZGVyLnRvdGFsLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LnRlbG9zLmFtb3VudCA9IHJvdy50ZWxvcy5hbW91bnQucGx1cyhvcmRlci50ZWxvcy5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5vd25lcnNbb3JkZXIub3duZXJdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cub3JkZXJzLnB1c2gob3JkZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByb3cgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHI6IG9yZGVyLnByaWNlLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogb3JkZXIucHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcnM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IG9yZGVyLnRvdGFsLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWxvczogb3JkZXIudGVsb3MuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2U6IG9yZGVyLmludmVyc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdW06IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdW10ZWxvczogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyczoge31cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJvdy5vd25lcnNbb3JkZXIub3duZXJdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcm93Lm9yZGVycy5wdXNoKG9yZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuXG4gICAgICAgICAgICB2YXIgc3VtID0gbmV3IEJpZ051bWJlcigwKTtcbiAgICAgICAgICAgIHZhciBzdW10ZWxvcyA9IG5ldyBCaWdOdW1iZXIoMCk7XG4gICAgICAgICAgICBmb3IgKHZhciBqIGluIGxpc3QpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3JkZXJfcm93ID0gbGlzdFtqXTtcbiAgICAgICAgICAgICAgICBzdW10ZWxvcyA9IHN1bXRlbG9zLnBsdXMob3JkZXJfcm93LnRlbG9zLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgc3VtID0gc3VtLnBsdXMob3JkZXJfcm93LnRvdGFsLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgb3JkZXJfcm93LnN1bXRlbG9zID0gbmV3IEFzc2V0REVYKHN1bXRlbG9zLCBvcmRlcl9yb3cudGVsb3MudG9rZW4pO1xuICAgICAgICAgICAgICAgIG9yZGVyX3Jvdy5zdW0gPSBuZXcgQXNzZXRERVgoc3VtLCBvcmRlcl9yb3cudG90YWwudG9rZW4pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0ub3JkZXJzLmJ1eSA9IGxpc3Q7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJ1eSBmaW5hbDpcIiwgdGhpcy5zY29wZXNbc2NvcGVdLm9yZGVycy5idXkpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJidXlvcmRlcnNcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5vcmRlcnMuYnV5O1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5fbWFya2V0c1tjYW5vbmljYWxdICYmICFmb3JjZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLm9yZGVycy5idXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhdXg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgZ2V0T3JkZXJTdW1tYXJ5KCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldE9yZGVyU3VtbWFyeSgpXCIpO1xuICAgICAgICB2YXIgdGFibGVzID0gYXdhaXQgdGhpcy5mZXRjaE9yZGVyU3VtbWFyeSgpO1xuXG4gICAgICAgIGZvciAodmFyIGkgaW4gdGFibGVzLnJvd3MpIHtcbiAgICAgICAgICAgIHZhciBzY29wZTpzdHJpbmcgPSB0YWJsZXMucm93c1tpXS50YWJsZTtcbiAgICAgICAgICAgIHZhciBjYW5vbmljYWwgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHNjb3BlID09IGNhbm9uaWNhbCwgXCJFUlJPUjogc2NvcGUgaXMgbm90IGNhbm9uaWNhbFwiLCBzY29wZSwgW2ksIHRhYmxlc10pO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdID0gdGhpcy5hdXhBc3NlcnRTY29wZShjYW5vbmljYWwpO1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpLCB0YWJsZXMucm93c1tpXSk7XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5oZWFkZXIuc2VsbC50b3RhbCA9IG5ldyBBc3NldERFWCh0YWJsZXMucm93c1tpXS5zdXBwbHkudG90YWwsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmhlYWRlci5zZWxsLm9yZGVycyA9IHRhYmxlcy5yb3dzW2ldLnN1cHBseS5vcmRlcnM7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uaGVhZGVyLmJ1eS50b3RhbCA9IG5ldyBBc3NldERFWCh0YWJsZXMucm93c1tpXS5kZW1hbmQudG90YWwsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmhlYWRlci5idXkub3JkZXJzID0gdGFibGVzLnJvd3NbaV0uZGVtYW5kLm9yZGVycztcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5kZWFscyA9IHRhYmxlcy5yb3dzW2ldLmRlYWxzO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmJsb2NrcyA9IHRhYmxlcy5yb3dzW2ldLmJsb2NrcztcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5kaXJlY3QgPSB0YWJsZXMucm93c1tpXS5kZW1hbmQuYXNjdXJyZW5jeTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5pbnZlcnNlID0gdGFibGVzLnJvd3NbaV0uc3VwcGx5LmFzY3VycmVuY3k7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0T3JkZXJTdW1tYXJ5KCk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0TWFya2V0U3VtbWFyeSh0b2tlbl9hOlRva2VuREVYLCB0b2tlbl9iOlRva2VuREVYLCBmb3JjZTpib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPE1hcmtldFN1bW1hcnk+IHtcbiAgICAgICAgdmFyIHNjb3BlOnN0cmluZyA9IHRoaXMuZ2V0U2NvcGVGb3IodG9rZW5fYSwgdG9rZW5fYik7XG4gICAgICAgIHZhciBjYW5vbmljYWw6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgIHZhciBpbnZlcnNlOnN0cmluZyA9IHRoaXMuaW52ZXJzZVNjb3BlKGNhbm9uaWNhbCk7XG5cbiAgICAgICAgdmFyIGNvbW9kaXR5ID0gdGhpcy5hdXhHZXRDb21vZGl0eVRva2VuKGNhbm9uaWNhbCk7IFxuICAgICAgICB2YXIgY3VycmVuY3kgPSB0aGlzLmF1eEdldEN1cnJlbmN5VG9rZW4oY2Fub25pY2FsKTtcblxuICAgICAgICB2YXIgWkVST19DT01PRElUWSA9IFwiMC4wMDAwMDAwMCBcIiArIGNvbW9kaXR5LnN5bWJvbDtcbiAgICAgICAgdmFyIFpFUk9fQ1VSUkVOQ1kgPSBcIjAuMDAwMDAwMDAgXCIgKyBjdXJyZW5jeS5zeW1ib2w7XG5cbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJzdW1tYXJ5LlwiK2Nhbm9uaWNhbCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwic3VtbWFyeS5cIitpbnZlcnNlLCB0cnVlKTtcbiAgICAgICAgdmFyIGF1eCA9IG51bGw7XG4gICAgICAgIHZhciByZXN1bHQ6TWFya2V0U3VtbWFyeSA9IG51bGw7XG4gICAgICAgIGF1eCA9IHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIHN1bW1hcnkgPSBhd2FpdCB0aGlzLmZldGNoU3VtbWFyeShjYW5vbmljYWwpO1xuICAgICAgICAgICAgLy8gaWYoc2NvcGU9PVwib2xpdmUudGxvc1wiKWNvbnNvbGUubG9nKHNjb3BlLCBcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cIm9saXZlLnRsb3NcIiljb25zb2xlLmxvZyhcIlN1bW1hcnkgY3J1ZG86XCIsIHN1bW1hcnkucm93cyk7XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSA9IHRoaXMuYXV4QXNzZXJ0U2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5ID0ge1xuICAgICAgICAgICAgICAgIHNjb3BlOiBjYW5vbmljYWwsXG4gICAgICAgICAgICAgICAgcHJpY2U6IG5ldyBBc3NldERFWChuZXcgQmlnTnVtYmVyKDApLCBjdXJyZW5jeSksXG4gICAgICAgICAgICAgICAgcHJpY2VfMjRoX2FnbzogbmV3IEFzc2V0REVYKG5ldyBCaWdOdW1iZXIoMCksIGN1cnJlbmN5KSxcbiAgICAgICAgICAgICAgICBpbnZlcnNlOiBuZXcgQXNzZXRERVgobmV3IEJpZ051bWJlcigwKSwgY29tb2RpdHkpLFxuICAgICAgICAgICAgICAgIGludmVyc2VfMjRoX2FnbzogbmV3IEFzc2V0REVYKG5ldyBCaWdOdW1iZXIoMCksIGNvbW9kaXR5KSxcbiAgICAgICAgICAgICAgICB2b2x1bWU6IG5ldyBBc3NldERFWChuZXcgQmlnTnVtYmVyKDApLCBjdXJyZW5jeSksXG4gICAgICAgICAgICAgICAgYW1vdW50OiBuZXcgQXNzZXRERVgobmV3IEJpZ051bWJlcigwKSwgY29tb2RpdHkpLFxuICAgICAgICAgICAgICAgIHBlcmNlbnQ6IDAuMyxcbiAgICAgICAgICAgICAgICByZWNvcmRzOiBzdW1tYXJ5LnJvd3NcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBub3c6RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB2YXIgbm93X3NlYzogbnVtYmVyID0gTWF0aC5mbG9vcihub3cuZ2V0VGltZSgpIC8gMTAwMCk7XG4gICAgICAgICAgICB2YXIgbm93X2hvdXI6IG51bWJlciA9IE1hdGguZmxvb3Iobm93X3NlYyAvIDM2MDApO1xuICAgICAgICAgICAgdmFyIHN0YXJ0X2hvdXIgPSBub3dfaG91ciAtIDIzO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcIm5vd19ob3VyOlwiLCBub3dfaG91cik7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwic3RhcnRfaG91cjpcIiwgc3RhcnRfaG91cik7XG5cbiAgICAgICAgICAgIC8vIHByb2Nlc28gbG9zIGRhdG9zIGNydWRvcyBcbiAgICAgICAgICAgIHZhciBwcmljZSA9IFpFUk9fQ1VSUkVOQ1k7XG4gICAgICAgICAgICB2YXIgaW52ZXJzZSA9IFpFUk9fQ09NT0RJVFk7XG4gICAgICAgICAgICB2YXIgY3J1ZGUgPSB7fTtcbiAgICAgICAgICAgIHZhciBsYXN0X2hoID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxzdW1tYXJ5LnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaGggPSBzdW1tYXJ5LnJvd3NbaV0uaG91cjtcbiAgICAgICAgICAgICAgICBpZiAoc3VtbWFyeS5yb3dzW2ldLmxhYmVsID09IFwibGFzdG9uZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHByaWNlID0gc3VtbWFyeS5yb3dzW2ldLnByaWNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNydWRlW2hoXSA9IHN1bW1hcnkucm93c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RfaGggPCBoaCAmJiBoaCA8IHN0YXJ0X2hvdXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RfaGggPSBoaDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlID0gc3VtbWFyeS5yb3dzW2ldLnByaWNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzZSA9IHN1bW1hcnkucm93c1tpXS5pbnZlcnNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwcmljZSA9IChzY29wZSA9PSBjYW5vbmljYWwpID8gc3VtbWFyeS5yb3dzW2ldLnByaWNlIDogc3VtbWFyeS5yb3dzW2ldLmludmVyc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnZlcnNlID0gKHNjb3BlID09IGNhbm9uaWNhbCkgPyBzdW1tYXJ5LnJvd3NbaV0uaW52ZXJzZSA6IHN1bW1hcnkucm93c1tpXS5wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJoaDpcIiwgaGgsIFwibGFzdF9oaDpcIiwgbGFzdF9oaCwgXCJwcmljZTpcIiwgcHJpY2UpO1xuICAgICAgICAgICAgICAgICAgICB9ICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiY3J1ZGU6XCIsIGNydWRlKTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJwcmljZTpcIiwgcHJpY2UpO1xuXG4gICAgICAgICAgICAvLyBnZW5lcm8gdW5hIGVudHJhZGEgcG9yIGNhZGEgdW5hIGRlIGxhcyDDg8K6bHRpbWFzIDI0IGhvcmFzXG4gICAgICAgICAgICB2YXIgbGFzdF8yNGggPSB7fTtcbiAgICAgICAgICAgIHZhciB2b2x1bWUgPSBuZXcgQXNzZXRERVgoWkVST19DVVJSRU5DWSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYW1vdW50ID0gbmV3IEFzc2V0REVYKFpFUk9fQ09NT0RJVFksIHRoaXMpO1xuICAgICAgICAgICAgdmFyIHByaWNlX2Fzc2V0ID0gbmV3IEFzc2V0REVYKHByaWNlLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBpbnZlcnNlX2Fzc2V0ID0gbmV3IEFzc2V0REVYKGludmVyc2UsIHRoaXMpO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImNudC50bG9zXCIpY29uc29sZS5sb2coXCJwcmljZSBcIiwgcHJpY2UpO1xuICAgICAgICAgICAgdmFyIG1heF9wcmljZSA9IHByaWNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICB2YXIgbWluX3ByaWNlID0gcHJpY2VfYXNzZXQuY2xvbmUoKTtcbiAgICAgICAgICAgIHZhciBtYXhfaW52ZXJzZSA9IGludmVyc2VfYXNzZXQuY2xvbmUoKTtcbiAgICAgICAgICAgIHZhciBtaW5faW52ZXJzZSA9IGludmVyc2VfYXNzZXQuY2xvbmUoKTtcbiAgICAgICAgICAgIHZhciBwcmljZV9mc3Q6QXNzZXRERVggPSBudWxsO1xuICAgICAgICAgICAgdmFyIGludmVyc2VfZnN0OkFzc2V0REVYID0gbnVsbDtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTwyNDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBzdGFydF9ob3VyK2k7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRfZGF0ZSA9IG5ldyBEYXRlKGN1cnJlbnQgKiAzNjAwICogMTAwMCk7XG4gICAgICAgICAgICAgICAgdmFyIG51ZXZvOmFueSA9IGNydWRlW2N1cnJlbnRdO1xuICAgICAgICAgICAgICAgIGlmIChudWV2bykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBudWV2byA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiB0aGlzLmF1eEdldExhYmVsRm9ySG91cihjdXJyZW50ICUgMjQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogaW52ZXJzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZTogWkVST19DVVJSRU5DWSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFtb3VudDogWkVST19DT01PRElUWSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU6IGN1cnJlbnRfZGF0ZS50b0lTT1N0cmluZygpLnNwbGl0KFwiLlwiKVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdXI6IGN1cnJlbnRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGFzdF8yNGhbY3VycmVudF0gPSBjcnVkZVtjdXJyZW50XSB8fCBudWV2bztcbiAgICAgICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiY3VycmVudF9kYXRlOlwiLCBjdXJyZW50X2RhdGUudG9JU09TdHJpbmcoKSwgY3VycmVudCwgbGFzdF8yNGhbY3VycmVudF0pO1xuXG4gICAgICAgICAgICAgICAgLy8gY29uaW5pY2FsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICBwcmljZSA9IGxhc3RfMjRoW2N1cnJlbnRdLnByaWNlO1xuICAgICAgICAgICAgICAgIHZhciB2b2wgPSBuZXcgQXNzZXRERVgobGFzdF8yNGhbY3VycmVudF0udm9sdW1lLCB0aGlzKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydCh2b2wudG9rZW4uc3ltYm9sID09IHZvbHVtZS50b2tlbi5zeW1ib2wsIFwiRVJST1I6IGRpZmZlcmVudCB0b2tlbnNcIiwgdm9sLnN0ciwgdm9sdW1lLnN0cik7XG4gICAgICAgICAgICAgICAgdm9sdW1lLmFtb3VudCA9IHZvbHVtZS5hbW91bnQucGx1cyh2b2wuYW1vdW50KTtcbiAgICAgICAgICAgICAgICBpZiAocHJpY2UgIT0gWkVST19DVVJSRU5DWSAmJiAhcHJpY2VfZnN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHByaWNlX2ZzdCA9IG5ldyBBc3NldERFWChwcmljZSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByaWNlX2Fzc2V0ID0gbmV3IEFzc2V0REVYKHByaWNlLCB0aGlzKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChwcmljZV9hc3NldC50b2tlbi5zeW1ib2wgPT0gbWF4X3ByaWNlLnRva2VuLnN5bWJvbCwgXCJFUlJPUjogZGlmZmVyZW50IHRva2Vuc1wiLCBwcmljZV9hc3NldC5zdHIsIG1heF9wcmljZS5zdHIpO1xuICAgICAgICAgICAgICAgIGlmIChwcmljZV9hc3NldC5hbW91bnQuaXNHcmVhdGVyVGhhbihtYXhfcHJpY2UuYW1vdW50KSkge1xuICAgICAgICAgICAgICAgICAgICBtYXhfcHJpY2UgPSBwcmljZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChwcmljZV9hc3NldC50b2tlbi5zeW1ib2wgPT0gbWluX3ByaWNlLnRva2VuLnN5bWJvbCwgXCJFUlJPUjogZGlmZmVyZW50IHRva2Vuc1wiLCBwcmljZV9hc3NldC5zdHIsIG1pbl9wcmljZS5zdHIpO1xuICAgICAgICAgICAgICAgIGlmIChtaW5fcHJpY2UuYW1vdW50LmlzRXF1YWxUbygwKSB8fCBwcmljZV9hc3NldC5hbW91bnQuaXNMZXNzVGhhbihtaW5fcHJpY2UuYW1vdW50KSkge1xuICAgICAgICAgICAgICAgICAgICBtaW5fcHJpY2UgPSBwcmljZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHJldmVyc2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIGludmVyc2UgPSBsYXN0XzI0aFtjdXJyZW50XS5pbnZlcnNlO1xuICAgICAgICAgICAgICAgIHZhciBhbW8gPSBuZXcgQXNzZXRERVgobGFzdF8yNGhbY3VycmVudF0uYW1vdW50LCB0aGlzKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChhbW8udG9rZW4uc3ltYm9sID09IGFtb3VudC50b2tlbi5zeW1ib2wsIFwiRVJST1I6IGRpZmZlcmVudCB0b2tlbnNcIiwgYW1vLnN0ciwgYW1vdW50LnN0cik7XG4gICAgICAgICAgICAgICAgYW1vdW50LmFtb3VudCA9IGFtb3VudC5hbW91bnQucGx1cyhhbW8uYW1vdW50KTtcbiAgICAgICAgICAgICAgICBpZiAoaW52ZXJzZSAhPSBaRVJPX0NPTU9ESVRZICYmICFpbnZlcnNlX2ZzdCkge1xuICAgICAgICAgICAgICAgICAgICBpbnZlcnNlX2ZzdCA9IG5ldyBBc3NldERFWChpbnZlcnNlLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW52ZXJzZV9hc3NldCA9IG5ldyBBc3NldERFWChpbnZlcnNlLCB0aGlzKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChpbnZlcnNlX2Fzc2V0LnRva2VuLnN5bWJvbCA9PSBtYXhfaW52ZXJzZS50b2tlbi5zeW1ib2wsIFwiRVJST1I6IGRpZmZlcmVudCB0b2tlbnNcIiwgaW52ZXJzZV9hc3NldC5zdHIsIG1heF9pbnZlcnNlLnN0cik7XG4gICAgICAgICAgICAgICAgaWYgKGludmVyc2VfYXNzZXQuYW1vdW50LmlzR3JlYXRlclRoYW4obWF4X2ludmVyc2UuYW1vdW50KSkge1xuICAgICAgICAgICAgICAgICAgICBtYXhfaW52ZXJzZSA9IGludmVyc2VfYXNzZXQuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoaW52ZXJzZV9hc3NldC50b2tlbi5zeW1ib2wgPT0gbWluX2ludmVyc2UudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiBkaWZmZXJlbnQgdG9rZW5zXCIsIGludmVyc2VfYXNzZXQuc3RyLCBtaW5faW52ZXJzZS5zdHIpO1xuICAgICAgICAgICAgICAgIGlmIChtaW5faW52ZXJzZS5hbW91bnQuaXNFcXVhbFRvKDApIHx8IGludmVyc2VfYXNzZXQuYW1vdW50LmlzTGVzc1RoYW4obWluX2ludmVyc2UuYW1vdW50KSkge1xuICAgICAgICAgICAgICAgICAgICBtaW5faW52ZXJzZSA9IGludmVyc2VfYXNzZXQuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBjb25pbmljYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgaWYgKCFwcmljZV9mc3QpIHtcbiAgICAgICAgICAgICAgICBwcmljZV9mc3QgPSBuZXcgQXNzZXRERVgobGFzdF8yNGhbc3RhcnRfaG91cl0ucHJpY2UsIHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGxhc3RfcHJpY2UgPSAgbmV3IEFzc2V0REVYKGxhc3RfMjRoW25vd19ob3VyXS5wcmljZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgZGlmZiA9IGxhc3RfcHJpY2UuY2xvbmUoKTtcbiAgICAgICAgICAgIC8vIGRpZmYuYW1vdW50IFxuICAgICAgICAgICAgZGlmZi5hbW91bnQgPSBsYXN0X3ByaWNlLmFtb3VudC5taW51cyhwcmljZV9mc3QuYW1vdW50KTtcbiAgICAgICAgICAgIHZhciByYXRpbzpudW1iZXIgPSAwO1xuICAgICAgICAgICAgaWYgKHByaWNlX2ZzdC5hbW91bnQudG9OdW1iZXIoKSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgcmF0aW8gPSBkaWZmLmFtb3VudC5kaXZpZGVkQnkocHJpY2VfZnN0LmFtb3VudCkudG9OdW1iZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwZXJjZW50ID0gTWF0aC5mbG9vcihyYXRpbyAqIDEwMDAwKSAvIDEwMDtcblxuICAgICAgICAgICAgLy8gcmV2ZXJzZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBpZiAoIWludmVyc2VfZnN0KSB7XG4gICAgICAgICAgICAgICAgaW52ZXJzZV9mc3QgPSBuZXcgQXNzZXRERVgobGFzdF8yNGhbc3RhcnRfaG91cl0uaW52ZXJzZSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbGFzdF9pbnZlcnNlID0gIG5ldyBBc3NldERFWChsYXN0XzI0aFtub3dfaG91cl0uaW52ZXJzZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgaWRpZmYgPSBsYXN0X2ludmVyc2UuY2xvbmUoKTtcbiAgICAgICAgICAgIC8vIGRpZmYuYW1vdW50IFxuICAgICAgICAgICAgaWRpZmYuYW1vdW50ID0gbGFzdF9pbnZlcnNlLmFtb3VudC5taW51cyhpbnZlcnNlX2ZzdC5hbW91bnQpO1xuICAgICAgICAgICAgcmF0aW8gPSAwO1xuICAgICAgICAgICAgaWYgKGludmVyc2VfZnN0LmFtb3VudC50b051bWJlcigpICE9IDApIHtcbiAgICAgICAgICAgICAgICByYXRpbyA9IGRpZmYuYW1vdW50LmRpdmlkZWRCeShpbnZlcnNlX2ZzdC5hbW91bnQpLnRvTnVtYmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaXBlcmNlbnQgPSBNYXRoLmZsb29yKHJhdGlvICogMTAwMDApIC8gMTAwO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcInByaWNlX2ZzdDpcIiwgcHJpY2VfZnN0LnN0cik7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiaW52ZXJzZV9mc3Q6XCIsIGludmVyc2VfZnN0LnN0cik7XG5cbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJsYXN0XzI0aDpcIiwgW2xhc3RfMjRoXSk7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiZGlmZjpcIiwgZGlmZi50b1N0cmluZyg4KSk7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwicGVyY2VudDpcIiwgcGVyY2VudCk7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwicmF0aW86XCIsIHJhdGlvKTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJ2b2x1bWU6XCIsIHZvbHVtZS5zdHIpO1xuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5wcmljZSA9IGxhc3RfcHJpY2U7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5pbnZlcnNlID0gbGFzdF9pbnZlcnNlO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkucHJpY2VfMjRoX2FnbyA9IHByaWNlX2ZzdCB8fCBsYXN0X3ByaWNlO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkuaW52ZXJzZV8yNGhfYWdvID0gaW52ZXJzZV9mc3Q7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5wZXJjZW50X3N0ciA9IChpc05hTihwZXJjZW50KSA/IDAgOiBwZXJjZW50KSArIFwiJVwiO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkucGVyY2VudCA9IGlzTmFOKHBlcmNlbnQpID8gMCA6IHBlcmNlbnQ7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5pcGVyY2VudF9zdHIgPSAoaXNOYU4oaXBlcmNlbnQpID8gMCA6IGlwZXJjZW50KSArIFwiJVwiO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkuaXBlcmNlbnQgPSBpc05hTihpcGVyY2VudCkgPyAwIDogaXBlcmNlbnQ7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS52b2x1bWUgPSB2b2x1bWU7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5hbW91bnQgPSBhbW91bnQ7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5taW5fcHJpY2UgPSBtaW5fcHJpY2U7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5tYXhfcHJpY2UgPSBtYXhfcHJpY2U7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5taW5faW52ZXJzZSA9IG1pbl9pbnZlcnNlO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkubWF4X2ludmVyc2UgPSBtYXhfaW52ZXJzZTtcblxuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcIlN1bW1hcnkgZmluYWw6XCIsIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5KTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInN1bW1hcnkuXCIrY2Fub25pY2FsLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInN1bW1hcnkuXCIraW52ZXJzZSwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5O1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5fbWFya2V0c1tjYW5vbmljYWxdICYmICFmb3JjZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhd2FpdCBhdXg7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlc29ydFRvcE1hcmtldHMoKTtcbiAgICAgICAgdGhpcy5zZXRNYXJrZXRTdW1tYXJ5KCk7XG4gICAgICAgIHRoaXMub25NYXJrZXRTdW1tYXJ5Lm5leHQocmVzdWx0KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGFzeW5jIGdldEFsbFRhYmxlc1N1bWFyaWVzKCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRPcmRlclN1bW1hcnkudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciBwcm9taXNlcyA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuX21hcmtldHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoaS5pbmRleE9mKFwiLlwiKSA9PSAtMSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgdmFyIHAgPSB0aGlzLmdldE1hcmtldFN1bW1hcnkodGhpcy5fbWFya2V0c1tpXS5jb21vZGl0eSwgdGhpcy5fbWFya2V0c1tpXS5jdXJyZW5jeSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVG9rZW5zU3VtbWFyeSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgfVxuICAgIFxuXG4gICAgLy9cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEF1eCBmdW5jdGlvbnNcbiAgICBwcml2YXRlIGF1eFByb2Nlc3NSb3dzVG9PcmRlcnMocm93czphbnlbXSk6IE9yZGVyW10ge1xuICAgICAgICB2YXIgcmVzdWx0OiBPcmRlcltdID0gW107XG4gICAgICAgIGZvciAodmFyIGk9MDsgaSA8IHJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwcmljZSA9IG5ldyBBc3NldERFWChyb3dzW2ldLnByaWNlLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBpbnZlcnNlID0gbmV3IEFzc2V0REVYKHJvd3NbaV0uaW52ZXJzZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgc2VsbGluZyA9IG5ldyBBc3NldERFWChyb3dzW2ldLnNlbGxpbmcsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIHRvdGFsID0gbmV3IEFzc2V0REVYKHJvd3NbaV0udG90YWwsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIG9yZGVyOk9yZGVyO1xuXG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLmdldFNjb3BlRm9yKHByaWNlLnRva2VuLCBpbnZlcnNlLnRva2VuKTtcbiAgICAgICAgICAgIHZhciBjYW5vbmljYWwgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgICAgIHZhciByZXZlcnNlX3Njb3BlID0gdGhpcy5pbnZlcnNlU2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBpZiAocmV2ZXJzZV9zY29wZSA9PSBzY29wZSkge1xuICAgICAgICAgICAgICAgIG9yZGVyID0ge1xuICAgICAgICAgICAgICAgICAgICBpZDogcm93c1tpXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHByaWNlLFxuICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiBpbnZlcnNlLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogc2VsbGluZyxcbiAgICAgICAgICAgICAgICAgICAgZGVwb3NpdDogc2VsbGluZyxcbiAgICAgICAgICAgICAgICAgICAgdGVsb3M6IHRvdGFsLFxuICAgICAgICAgICAgICAgICAgICBvd25lcjogcm93c1tpXS5vd25lclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3JkZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiByb3dzW2ldLmlkLFxuICAgICAgICAgICAgICAgICAgICBwcmljZTogaW52ZXJzZSxcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgZGVwb3NpdDogc2VsbGluZyxcbiAgICAgICAgICAgICAgICAgICAgdGVsb3M6IHNlbGxpbmcsXG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiByb3dzW2ldLm93bmVyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0LnB1c2gob3JkZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhdXhHZXRMYWJlbEZvckhvdXIoaGg6bnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGhvdXJzID0gW1xuICAgICAgICAgICAgXCJoLnplcm9cIixcbiAgICAgICAgICAgIFwiaC5vbmVcIixcbiAgICAgICAgICAgIFwiaC50d29cIixcbiAgICAgICAgICAgIFwiaC50aHJlZVwiLFxuICAgICAgICAgICAgXCJoLmZvdXJcIixcbiAgICAgICAgICAgIFwiaC5maXZlXCIsXG4gICAgICAgICAgICBcImguc2l4XCIsXG4gICAgICAgICAgICBcImguc2V2ZW5cIixcbiAgICAgICAgICAgIFwiaC5laWdodFwiLFxuICAgICAgICAgICAgXCJoLm5pbmVcIixcbiAgICAgICAgICAgIFwiaC50ZW5cIixcbiAgICAgICAgICAgIFwiaC5lbGV2ZW5cIixcbiAgICAgICAgICAgIFwiaC50d2VsdmVcIixcbiAgICAgICAgICAgIFwiaC50aGlydGVlblwiLFxuICAgICAgICAgICAgXCJoLmZvdXJ0ZWVuXCIsXG4gICAgICAgICAgICBcImguZmlmdGVlblwiLFxuICAgICAgICAgICAgXCJoLnNpeHRlZW5cIixcbiAgICAgICAgICAgIFwiaC5zZXZlbnRlZW5cIixcbiAgICAgICAgICAgIFwiaC5laWdodGVlblwiLFxuICAgICAgICAgICAgXCJoLm5pbmV0ZWVuXCIsXG4gICAgICAgICAgICBcImgudHdlbnR5XCIsXG4gICAgICAgICAgICBcImgudHdlbnR5b25lXCIsXG4gICAgICAgICAgICBcImgudHdlbnR5dHdvXCIsXG4gICAgICAgICAgICBcImgudHdlbnR5dGhyZWVcIlxuICAgICAgICBdXG4gICAgICAgIHJldHVybiBob3Vyc1toaF07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhdXhHZXRDdXJyZW5jeVRva2VuKHNjb3BlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoISFzY29wZSwgXCJFUlJPUjogaW52YWxpZCBzY29wZTogJ1wiKyBzY29wZSArXCInXCIpO1xuICAgICAgICBjb25zb2xlLmFzc2VydChzY29wZS5zcGxpdChcIi5cIikubGVuZ3RoID09IDIsIFwiRVJST1I6IGludmFsaWQgc2NvcGU6ICdcIisgc2NvcGUgK1wiJ1wiKTtcbiAgICAgICAgdmFyIGN1cnJlbmN5X3N5bSA9IHNjb3BlLnNwbGl0KFwiLlwiKVsxXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICB2YXIgY3VycmVuY3kgPSB0aGlzLmdldFRva2VuTm93KGN1cnJlbmN5X3N5bSk7XG4gICAgICAgIHJldHVybiBjdXJyZW5jeTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGF1eEdldENvbW9kaXR5VG9rZW4oc2NvcGU6IHN0cmluZykge1xuICAgICAgICBjb25zb2xlLmFzc2VydCghIXNjb3BlLCBcIkVSUk9SOiBpbnZhbGlkIHNjb3BlOiAnXCIrIHNjb3BlICtcIidcIik7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KHNjb3BlLnNwbGl0KFwiLlwiKS5sZW5ndGggPT0gMiwgXCJFUlJPUjogaW52YWxpZCBzY29wZTogJ1wiKyBzY29wZSArXCInXCIpO1xuICAgICAgICB2YXIgY29tb2RpdHlfc3ltID0gc2NvcGUuc3BsaXQoXCIuXCIpWzBdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIHZhciBjb21vZGl0eSA9IHRoaXMuZ2V0VG9rZW5Ob3coY29tb2RpdHlfc3ltKTtcbiAgICAgICAgcmV0dXJuIGNvbW9kaXR5OyAgICAgICAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhdXhBc3NlcnRTY29wZShzY29wZTpzdHJpbmcpOiBNYXJrZXQge1xuICAgICAgICB2YXIgY29tb2RpdHkgPSB0aGlzLmF1eEdldENvbW9kaXR5VG9rZW4oc2NvcGUpO1xuICAgICAgICB2YXIgY3VycmVuY3kgPSB0aGlzLmF1eEdldEN1cnJlbmN5VG9rZW4oc2NvcGUpO1xuICAgICAgICB2YXIgYXV4X2Fzc2V0X2NvbSA9IG5ldyBBc3NldERFWCgwLCBjb21vZGl0eSk7XG4gICAgICAgIHZhciBhdXhfYXNzZXRfY3VyID0gbmV3IEFzc2V0REVYKDAsIGN1cnJlbmN5KTtcblxuICAgICAgICB2YXIgbWFya2V0X3N1bW1hcnk6TWFya2V0U3VtbWFyeSA9IHtcbiAgICAgICAgICAgIHNjb3BlOiBzY29wZSxcbiAgICAgICAgICAgIHByaWNlOiBhdXhfYXNzZXRfY3VyLFxuICAgICAgICAgICAgcHJpY2VfMjRoX2FnbzogYXV4X2Fzc2V0X2N1cixcbiAgICAgICAgICAgIGludmVyc2U6IGF1eF9hc3NldF9jb20sXG4gICAgICAgICAgICBpbnZlcnNlXzI0aF9hZ286IGF1eF9hc3NldF9jb20sXG4gICAgICAgICAgICBtYXhfaW52ZXJzZTogYXV4X2Fzc2V0X2NvbSxcbiAgICAgICAgICAgIG1heF9wcmljZTogYXV4X2Fzc2V0X2N1cixcbiAgICAgICAgICAgIG1pbl9pbnZlcnNlOiBhdXhfYXNzZXRfY29tLFxuICAgICAgICAgICAgbWluX3ByaWNlOiBhdXhfYXNzZXRfY3VyLFxuICAgICAgICAgICAgcmVjb3JkczogW10sXG4gICAgICAgICAgICB2b2x1bWU6IGF1eF9hc3NldF9jdXIsXG4gICAgICAgICAgICBhbW91bnQ6IGF1eF9hc3NldF9jb20sXG4gICAgICAgICAgICBwZXJjZW50OiAwLFxuICAgICAgICAgICAgaXBlcmNlbnQ6IDAsXG4gICAgICAgICAgICBwZXJjZW50X3N0cjogXCIwJVwiLFxuICAgICAgICAgICAgaXBlcmNlbnRfc3RyOiBcIjAlXCIsXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fbWFya2V0c1tzY29wZV0gfHwge1xuICAgICAgICAgICAgc2NvcGU6IHNjb3BlLFxuICAgICAgICAgICAgY29tb2RpdHk6IGNvbW9kaXR5LFxuICAgICAgICAgICAgY3VycmVuY3k6IGN1cnJlbmN5LFxuICAgICAgICAgICAgb3JkZXJzOiB7IHNlbGw6IFtdLCBidXk6IFtdIH0sXG4gICAgICAgICAgICBkZWFsczogMCxcbiAgICAgICAgICAgIGRpcmVjdDogMCxcbiAgICAgICAgICAgIGludmVyc2U6IDAsXG4gICAgICAgICAgICBoaXN0b3J5OiBbXSxcbiAgICAgICAgICAgIHR4OiB7fSxcbiAgICAgICAgICAgIGJsb2NrczogMCxcbiAgICAgICAgICAgIGJsb2NrOiB7fSxcbiAgICAgICAgICAgIGJsb2NrbGlzdDogW10sXG4gICAgICAgICAgICBibG9ja2xldmVsczogW1tdXSxcbiAgICAgICAgICAgIHJldmVyc2VibG9ja3M6IFtdLFxuICAgICAgICAgICAgcmV2ZXJzZWxldmVsczogW1tdXSxcbiAgICAgICAgICAgIHN1bW1hcnk6IG1hcmtldF9zdW1tYXJ5LFxuICAgICAgICAgICAgaGVhZGVyOiB7IFxuICAgICAgICAgICAgICAgIHNlbGw6IHt0b3RhbDphdXhfYXNzZXRfY29tLCBvcmRlcnM6MH0sIFxuICAgICAgICAgICAgICAgIGJ1eToge3RvdGFsOmF1eF9hc3NldF9jdXIsIG9yZGVyczowfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTsgICAgICAgIFxuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hEZXBvc2l0cyhhY2NvdW50KTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcImRlcG9zaXRzXCIsIHtzY29wZTphY2NvdW50fSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBmZXRjaEJhbGFuY2VzKGFjY291bnQpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgY29udHJhY3RzID0ge307XG4gICAgICAgICAgICB2YXIgYmFsYW5jZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy50b2tlbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50b2tlbnNbaV0ub2ZmY2hhaW4pIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNvbnRyYWN0c1t0aGlzLnRva2Vuc1tpXS5jb250cmFjdF0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgY29udHJhY3QgaW4gY29udHJhY3RzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJiYWxhbmNlcy1cIitjb250cmFjdCwgdHJ1ZSk7XG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgKHZhciBjb250cmFjdCBpbiBjb250cmFjdHMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gYXdhaXQgdGhpcy5jb250cmFjdC5nZXRUYWJsZShcImFjY291bnRzXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJhY3Q6Y29udHJhY3QsXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOiBhY2NvdW50IHx8IHRoaXMuY3VycmVudC5uYW1lXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiByZXN1bHQucm93cykge1xuICAgICAgICAgICAgICAgICAgICBiYWxhbmNlcy5wdXNoKG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5iYWxhbmNlLCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYmFsYW5jZXMtXCIrY29udHJhY3QsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBiYWxhbmNlcztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaE9yZGVycyhwYXJhbXM6VGFibGVQYXJhbXMpOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwic2VsbG9yZGVyc1wiLCBwYXJhbXMpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hPcmRlclN1bW1hcnkoKTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcIm9yZGVyc3VtbWFyeVwiKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZldGNoQmxvY2tIaXN0b3J5KHNjb3BlOnN0cmluZywgcGFnZTpudW1iZXIgPSAwLCBwYWdlc2l6ZTpudW1iZXIgPSAyNSk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgdmFyIGNhbm9uaWNhbDpzdHJpbmcgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgdmFyIHBhZ2VzID0gdGhpcy5nZXRCbG9ja0hpc3RvcnlUb3RhbFBhZ2VzRm9yKGNhbm9uaWNhbCwgcGFnZXNpemUpO1xuICAgICAgICB2YXIgaWQgPSBwYWdlKnBhZ2VzaXplO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5mZXRjaEJsb2NrSGlzdG9yeShcIiwgc2NvcGUsIFwiLFwiLHBhZ2UsXCIsXCIscGFnZXNpemUsXCIpOiBpZDpcIiwgaWQsIFwicGFnZXM6XCIsIHBhZ2VzKTtcbiAgICAgICAgaWYgKHBhZ2UgPCBwYWdlcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX21hcmtldHMgJiYgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdICYmIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5ibG9ja1tcImlkLVwiICsgaWRdKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdDpUYWJsZVJlc3VsdCA9IHttb3JlOmZhbHNlLHJvd3M6W119O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxwYWdlc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpZF9pID0gaWQraTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJsb2NrID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmJsb2NrW1wiaWQtXCIgKyBpZF9pXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucm93cy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucm93cy5sZW5ndGggPT0gcGFnZXNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgaGF2ZSB0aGUgY29tcGxldGUgcGFnZSBpbiBtZW1vcnlcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWVERVguZmV0Y2hIaXN0b3J5KFwiLCBzY29wZSwgXCIsXCIscGFnZSxcIixcIixwYWdlc2l6ZSxcIik6IHJlc3VsdDpcIiwgcmVzdWx0LnJvd3MubWFwKCh7IGlkIH0pID0+IGlkKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJibG9ja2hpc3RvcnlcIiwge3Njb3BlOmNhbm9uaWNhbCwgbGltaXQ6cGFnZXNpemUsIGxvd2VyX2JvdW5kOlwiXCIrKHBhZ2UqcGFnZXNpemUpfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKlwiKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYmxvY2sgSGlzdG9yeSBjcnVkbzpcIiwgcmVzdWx0KTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSA9IHRoaXMuYXV4QXNzZXJ0U2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5ibG9jayA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5ibG9jayB8fCB7fTsgXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRoaXMuX21hcmtldHNbc2NvcGVdLmJsb2NrOlwiLCB0aGlzLl9tYXJrZXRzW3Njb3BlXS5ibG9jayk7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGkgPCByZXN1bHQucm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBibG9jazpIaXN0b3J5QmxvY2sgPSB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiByZXN1bHQucm93c1tpXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgaG91cjogcmVzdWx0LnJvd3NbaV0uaG91cixcbiAgICAgICAgICAgICAgICAgICAgc3RyOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICBwcmljZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLnByaWNlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmludmVyc2UsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBlbnRyYW5jZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmVudHJhbmNlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgbWF4OiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0ubWF4LCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgbWluOiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0ubWluLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgdm9sdW1lOiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0udm9sdW1lLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgYW1vdW50OiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uYW1vdW50LCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUocmVzdWx0LnJvd3NbaV0uZGF0ZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYmxvY2suc3RyID0gSlNPTi5zdHJpbmdpZnkoW2Jsb2NrLm1heC5zdHIsIGJsb2NrLmVudHJhbmNlLnN0ciwgYmxvY2sucHJpY2Uuc3RyLCBibG9jay5taW4uc3RyXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmJsb2NrW1wiaWQtXCIgKyBibG9jay5pZF0gPSBibG9jaztcbiAgICAgICAgICAgIH0gICBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYmxvY2sgSGlzdG9yeSBmaW5hbDpcIiwgdGhpcy5fbWFya2V0c1tzY29wZV0uYmxvY2spO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfSAgICBcblxuICAgIHByaXZhdGUgZmV0Y2hIaXN0b3J5KHNjb3BlOnN0cmluZywgcGFnZTpudW1iZXIgPSAwLCBwYWdlc2l6ZTpudW1iZXIgPSAyNSk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgdmFyIGNhbm9uaWNhbDpzdHJpbmcgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgdmFyIHBhZ2VzID0gdGhpcy5nZXRIaXN0b3J5VG90YWxQYWdlc0ZvcihjYW5vbmljYWwsIHBhZ2VzaXplKTtcbiAgICAgICAgdmFyIGlkID0gcGFnZSpwYWdlc2l6ZTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWVERVguZmV0Y2hIaXN0b3J5KFwiLCBzY29wZSwgXCIsXCIscGFnZSxcIixcIixwYWdlc2l6ZSxcIik6IGlkOlwiLCBpZCwgXCJwYWdlczpcIiwgcGFnZXMpO1xuICAgICAgICBpZiAocGFnZSA8IHBhZ2VzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbWFya2V0cyAmJiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gJiYgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnR4W1wiaWQtXCIgKyBpZF0pIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0OlRhYmxlUmVzdWx0ID0ge21vcmU6ZmFsc2Uscm93czpbXX07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHBhZ2VzaXplOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkX2kgPSBpZCtpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHJ4ID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnR4W1wiaWQtXCIgKyBpZF9pXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnJvd3MucHVzaCh0cngpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5yb3dzLmxlbmd0aCA9PSBwYWdlc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBoYXZlIHRoZSBjb21wbGV0ZSBwYWdlIGluIG1lbW9yeVxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5mZXRjaEhpc3RvcnkoXCIsIHNjb3BlLCBcIixcIixwYWdlLFwiLFwiLHBhZ2VzaXplLFwiKTogcmVzdWx0OlwiLCByZXN1bHQucm93cy5tYXAoKHsgaWQgfSkgPT4gaWQpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcImhpc3RvcnlcIiwge3Njb3BlOnNjb3BlLCBsaW1pdDpwYWdlc2l6ZSwgbG93ZXJfYm91bmQ6XCJcIisocGFnZSpwYWdlc2l6ZSl9KS50aGVuKHJlc3VsdCA9PiB7XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkhpc3RvcnkgY3J1ZG86XCIsIHJlc3VsdCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSA9IHRoaXMuYXV4QXNzZXJ0U2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5oaXN0b3J5ID0gW107XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0udHggPSB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0udHggfHwge307IFxuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRoaXMuc2NvcGVzW3Njb3BlXS50eDpcIiwgdGhpcy5zY29wZXNbc2NvcGVdLnR4KTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgcmVzdWx0LnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgdHJhbnNhY3Rpb246SGlzdG9yeVR4ID0ge1xuICAgICAgICAgICAgICAgICAgICBpZDogcmVzdWx0LnJvd3NbaV0uaWQsXG4gICAgICAgICAgICAgICAgICAgIHN0cjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgYW1vdW50OiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uYW1vdW50LCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgcGF5bWVudDogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLnBheW1lbnQsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBidXlmZWU6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5idXlmZWUsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBzZWxsZmVlOiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uc2VsbGZlZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHByaWNlOiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0ucHJpY2UsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uaW52ZXJzZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGJ1eWVyOiByZXN1bHQucm93c1tpXS5idXllcixcbiAgICAgICAgICAgICAgICAgICAgc2VsbGVyOiByZXN1bHQucm93c1tpXS5zZWxsZXIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKHJlc3VsdC5yb3dzW2ldLmRhdGUpLFxuICAgICAgICAgICAgICAgICAgICBpc2J1eTogISFyZXN1bHQucm93c1tpXS5pc2J1eVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cmFuc2FjdGlvbi5zdHIgPSB0cmFuc2FjdGlvbi5wcmljZS5zdHIgKyBcIiBcIiArIHRyYW5zYWN0aW9uLmFtb3VudC5zdHI7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnR4W1wiaWQtXCIgKyB0cmFuc2FjdGlvbi5pZF0gPSB0cmFuc2FjdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgaiBpbiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0udHgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uaGlzdG9yeS5wdXNoKHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eFtqXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5oaXN0b3J5LnNvcnQoZnVuY3Rpb24oYTpIaXN0b3J5VHgsIGI6SGlzdG9yeVR4KXtcbiAgICAgICAgICAgICAgICBpZihhLmRhdGUgPCBiLmRhdGUpIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmKGEuZGF0ZSA+IGIuZGF0ZSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIGlmKGEuaWQgPCBiLmlkKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBpZihhLmlkID4gYi5pZCkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfSk7ICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiSGlzdG9yeSBmaW5hbDpcIiwgdGhpcy5zY29wZXNbc2NvcGVdLmhpc3RvcnkpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgYXN5bmMgZmV0Y2hBY3Rpdml0eShwYWdlOm51bWJlciA9IDAsIHBhZ2VzaXplOm51bWJlciA9IDI1KSB7XG4gICAgICAgIHZhciBpZCA9IHBhZ2UqcGFnZXNpemUrMTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWVERVguZmV0Y2hBY3Rpdml0eShcIiwgcGFnZSxcIixcIixwYWdlc2l6ZSxcIik6IGlkOlwiLCBpZCk7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5hY3Rpdml0eS5ldmVudHNbXCJpZC1cIiArIGlkXSkge1xuICAgICAgICAgICAgdmFyIHBhZ2VFdmVudHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxwYWdlc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkX2kgPSBpZCtpO1xuICAgICAgICAgICAgICAgIHZhciBldmVudCA9IHRoaXMuYWN0aXZpdHkuZXZlbnRzW1wiaWQtXCIgKyBpZF9pXTtcbiAgICAgICAgICAgICAgICBpZiAoIWV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYWdlRXZlbnRzLmxlbmd0aCA9PSBwYWdlc2l6ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXG4gICAgICAgIH0gICAgICAgIFxuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwiZXZlbnRzXCIsIHtsaW1pdDpwYWdlc2l6ZSwgbG93ZXJfYm91bmQ6XCJcIitpZH0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkFjdGl2aXR5IGNydWRvOlwiLCByZXN1bHQpO1xuICAgICAgICAgICAgdmFyIGxpc3Q6RXZlbnRMb2dbXSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGkgPCByZXN1bHQucm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IHJlc3VsdC5yb3dzW2ldLmlkO1xuICAgICAgICAgICAgICAgIHZhciBldmVudDpFdmVudExvZyA9IDxFdmVudExvZz5yZXN1bHQucm93c1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYWN0aXZpdHkuZXZlbnRzW1wiaWQtXCIgKyBpZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3Rpdml0eS5ldmVudHNbXCJpZC1cIiArIGlkXSA9IGV2ZW50O1xuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqPj4+Pj5cIiwgaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hY3Rpdml0eS5saXN0ID0gW10uY29uY2F0KHRoaXMuYWN0aXZpdHkubGlzdCkuY29uY2F0KGxpc3QpO1xuICAgICAgICAgICAgdGhpcy5hY3Rpdml0eS5saXN0LnNvcnQoZnVuY3Rpb24oYTpFdmVudExvZywgYjpFdmVudExvZyl7XG4gICAgICAgICAgICAgICAgaWYoYS5kYXRlIDwgYi5kYXRlKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBpZihhLmRhdGUgPiBiLmRhdGUpIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICBpZihhLmlkIDwgYi5pZCkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgaWYoYS5pZCA+IGIuaWQpIHJldHVybiAtMTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaFVzZXJPcmRlcnModXNlcjpzdHJpbmcpOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwidXNlcm9yZGVyc1wiLCB7c2NvcGU6dXNlciwgbGltaXQ6MjAwfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgZmV0Y2hTdW1tYXJ5KHNjb3BlKTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcInRhYmxlc3VtbWFyeVwiLCB7c2NvcGU6c2NvcGV9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZldGNoVG9rZW5TdGF0cyh0b2tlbik6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ0b2tlbi1zdGF0LVwiK3Rva2VuLnN5bWJvbCwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwic3RhdFwiLCB7Y29udHJhY3Q6dG9rZW4uY29udHJhY3QsIHNjb3BlOnRva2VuLnN5bWJvbH0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHRva2VuLnN0YXQgPSByZXN1bHQucm93c1swXTtcbiAgICAgICAgICAgIGlmICh0b2tlbi5zdGF0Lmlzc3VlcnMgJiYgdG9rZW4uc3RhdC5pc3N1ZXJzWzBdID09IFwiZXZlcnlvbmVcIikge1xuICAgICAgICAgICAgICAgIHRva2VuLmZha2UgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ0b2tlbi1zdGF0LVwiK3Rva2VuLnN5bWJvbCwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZldGNoVG9rZW5zU3RhdHMoZXh0ZW5kZWQ6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlLmZldGNoVG9rZW5zKClcIik7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidG9rZW4tc3RhdHNcIiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihfID0+IHtcblxuICAgICAgICAgICAgdmFyIHByaW9taXNlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnRva2Vucykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRva2Vuc1tpXS5vZmZjaGFpbikgY29udGludWU7XG4gICAgICAgICAgICAgICAgcHJpb21pc2VzLnB1c2godGhpcy5mZXRjaFRva2VuU3RhdHModGhpcy50b2tlbnNbaV0pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsPGFueT4ocHJpb21pc2VzKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUb2tlblN0YXRzKHRoaXMudG9rZW5zKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInRva2VuLXN0YXRzXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbnM7XG4gICAgICAgICAgICB9KTsgICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvLyBmb3IgZWFjaCB0b2tlbnMgdGhpcyBzb3J0cyBpdHMgbWFya2V0cyBiYXNlZCBvbiB2b2x1bWVcbiAgICBwcml2YXRlIHVwZGF0ZVRva2Vuc01hcmtldHMoKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0aGlzLndhaXRUb2tlbnNMb2FkZWQsXG4gICAgICAgICAgICB0aGlzLndhaXRNYXJrZXRTdW1tYXJ5XG4gICAgICAgIF0pLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICAvLyBhIGNhZGEgdG9rZW4gbGUgYXNpZ25vIHVuIHByaWNlIHF1ZSBzYWxlIGRlIHZlcmlmaWNhciBzdSBwcmljZSBlbiBlbCBtZXJjYWRvIHByaW5jaXBhbCBYWFgvVExPU1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnRva2Vucykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRva2Vuc1tpXS5vZmZjaGFpbikgY29udGludWU7IC8vIGRpc2NhcmQgdG9rZW5zIHRoYXQgYXJlIG5vdCBvbi1jaGFpblxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IHRoaXMudG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgIHZhciBxdWFudGl0eTpBc3NldERFWCA9IG5ldyBBc3NldERFWCgwLCB0b2tlbik7XG4gICAgICAgICAgICAgICAgdG9rZW4ubWFya2V0cyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgc2NvcGUgaW4gdGhpcy5fbWFya2V0cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2NvcGUuaW5kZXhPZihcIi5cIikgPT0gLTEpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGU6TWFya2V0ID0gdGhpcy5fbWFya2V0c1tzY29wZV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlID0gdGhpcy5tYXJrZXQodGhpcy5pbnZlcnNlU2NvcGUoc2NvcGUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbi5tYXJrZXRzLnB1c2godGFibGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0b2tlbi5tYXJrZXRzLnNvcnQoKGE6TWFya2V0LCBiOk1hcmtldCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIHB1c2ggb2ZmY2hhaW4gdG9rZW5zIHRvIHRoZSBlbmQgb2YgdGhlIHRva2VuIGxpc3RcbiAgICAgICAgICAgICAgICB2YXIgYV9hbW91bnQgPSBhLnN1bW1hcnkgPyBhLnN1bW1hcnkuYW1vdW50IDogbmV3IEFzc2V0REVYKCk7XG4gICAgICAgICAgICAgICAgdmFyIGJfYW1vdW50ID0gYi5zdW1tYXJ5ID8gYi5zdW1tYXJ5LmFtb3VudCA6IG5ldyBBc3NldERFWCgpO1xuICAgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGFfYW1vdW50LnRva2VuLnN5bWJvbCA9PSBiX2Ftb3VudC50b2tlbi5zeW1ib2wsIFwiRVJST1I6IGNvbXBhcmluZyB0d28gZGlmZmVyZW50IHRva2VucyBcIiArIGFfYW1vdW50LnN0ciArIFwiLCBcIiArIGJfYW1vdW50LnN0cilcbiAgICAgICAgICAgICAgICBpZihhX2Ftb3VudC5hbW91bnQuaXNHcmVhdGVyVGhhbihiX2Ftb3VudC5hbW91bnQpKSByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgaWYoYV9hbW91bnQuYW1vdW50LmlzTGVzc1RoYW4oYl9hbW91bnQuYW1vdW50KSkgcmV0dXJuIDE7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pOyAgIFxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHVwZGF0ZVRva2Vuc1N1bW1hcnkodGltZXM6IG51bWJlciA9IDIwKSB7XG4gICAgICAgIGlmICh0aW1lcyA+IDEpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSB0aW1lczsgaT4wOyBpLS0pIHRoaXMudXBkYXRlVG9rZW5zU3VtbWFyeSgxKTtcbiAgICAgICAgICAgIHRoaXMucmVzb3J0VG9rZW5zKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMud2FpdFRva2Vuc0xvYWRlZCxcbiAgICAgICAgICAgIHRoaXMud2FpdE1hcmtldFN1bW1hcnlcbiAgICAgICAgXSkudGhlbihfID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKGluaSkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWUudXBkYXRlVG9rZW5zU3VtbWFyeSgpXCIpOyBcblxuICAgICAgICAgICAgLy8gbWFwcGluZyBvZiBob3cgbXVjaCAoYW1vdW50IG9mKSB0b2tlbnMgaGF2ZSBiZWVuIHRyYWRlZCBhZ3JlZ2F0ZWQgaW4gYWxsIG1hcmtldHNcbiAgICAgICAgICAgIHZhciBhbW91bnRfbWFwOntba2V5OnN0cmluZ106QXNzZXRERVh9ID0ge307XG5cbiAgICAgICAgICAgIC8vIGEgY2FkYSB0b2tlbiBsZSBhc2lnbm8gdW4gcHJpY2UgcXVlIHNhbGUgZGUgdmVyaWZpY2FyIHN1IHByaWNlIGVuIGVsIG1lcmNhZG8gcHJpbmNpcGFsIFhYWC9UTE9TXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMudG9rZW5zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudG9rZW5zW2ldLm9mZmNoYWluKSBjb250aW51ZTsgLy8gZGlzY2FyZCB0b2tlbnMgdGhhdCBhcmUgbm90IG9uLWNoYWluXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHRva2VuID0gdGhpcy50b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgdmFyIHF1YW50aXR5OkFzc2V0REVYID0gbmV3IEFzc2V0REVYKDAsIHRva2VuKTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gdGhpcy5fbWFya2V0cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoai5pbmRleE9mKFwiLlwiKSA9PSAtMSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZTpNYXJrZXQgPSB0aGlzLl9tYXJrZXRzW2pdO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmNvbW9kaXR5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gcXVhbnRpdHkucGx1cyh0YWJsZS5zdW1tYXJ5LmFtb3VudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gcXVhbnRpdHkucGx1cyh0YWJsZS5zdW1tYXJ5LnZvbHVtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY29tb2RpdHkuc3ltYm9sID09IHRva2VuLnN5bWJvbCAmJiB0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdGhpcy50ZWxvcy5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbi5zdW1tYXJ5ICYmIHRva2VuLnN1bW1hcnkucHJpY2UuYW1vdW50LnRvTnVtYmVyKCkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0b2tlbi5zdW1tYXJ5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbi5zdW1tYXJ5ID0gdG9rZW4uc3VtbWFyeSB8fCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHRhYmxlLnN1bW1hcnkucHJpY2UuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZV8yNGhfYWdvOiB0YWJsZS5zdW1tYXJ5LnByaWNlXzI0aF9hZ28uY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWU6IHRhYmxlLnN1bW1hcnkudm9sdW1lLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyY2VudDogdGFibGUuc3VtbWFyeS5wZXJjZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmNlbnRfc3RyOiB0YWJsZS5zdW1tYXJ5LnBlcmNlbnRfc3RyLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdG9rZW4uc3VtbWFyeSA9IHRva2VuLnN1bW1hcnkgfHwge1xuICAgICAgICAgICAgICAgICAgICBwcmljZTogbmV3IEFzc2V0REVYKDAsIHRoaXMudGVsb3MpLFxuICAgICAgICAgICAgICAgICAgICBwcmljZV8yNGhfYWdvOiBuZXcgQXNzZXRERVgoMCwgdGhpcy50ZWxvcyksXG4gICAgICAgICAgICAgICAgICAgIHZvbHVtZTogbmV3IEFzc2V0REVYKDAsIHRoaXMudGVsb3MpLFxuICAgICAgICAgICAgICAgICAgICBwZXJjZW50OiAwLFxuICAgICAgICAgICAgICAgICAgICBwZXJjZW50X3N0cjogXCIwJVwiLFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGFtb3VudF9tYXBbdG9rZW4uc3ltYm9sXSA9IHF1YW50aXR5O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnRlbG9zLnN1bW1hcnkgPSB7XG4gICAgICAgICAgICAgICAgcHJpY2U6IG5ldyBBc3NldERFWCgxLCB0aGlzLnRlbG9zKSxcbiAgICAgICAgICAgICAgICBwcmljZV8yNGhfYWdvOiBuZXcgQXNzZXRERVgoMSwgdGhpcy50ZWxvcyksXG4gICAgICAgICAgICAgICAgdm9sdW1lOiBuZXcgQXNzZXRERVgoLTEsIHRoaXMudGVsb3MpLFxuICAgICAgICAgICAgICAgIHBlcmNlbnQ6IDAsXG4gICAgICAgICAgICAgICAgcGVyY2VudF9zdHI6IFwiMCVcIlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImFtb3VudF9tYXA6IFwiLCBhbW91bnRfbWFwKTtcblxuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBPTkUgPSBuZXcgQmlnTnVtYmVyKDEpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMudG9rZW5zKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRva2VuID0gdGhpcy50b2tlbnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuLm9mZmNoYWluKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAoIXRva2VuLnN1bW1hcnkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5zeW1ib2wgPT0gdGhpcy50ZWxvcy5zeW1ib2wpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVE9LRU46IC0tLS0tLS0tIFwiLCB0b2tlbi5zeW1ib2wsIHRva2VuLnN1bW1hcnkucHJpY2Uuc3RyLCB0b2tlbi5zdW1tYXJ5LnByaWNlXzI0aF9hZ28uc3RyICk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHZvbHVtZSA9IG5ldyBBc3NldERFWCgwLCB0aGlzLnRlbG9zKTtcbiAgICAgICAgICAgICAgICB2YXIgcHJpY2UgPSBuZXcgQXNzZXRERVgoMCwgdGhpcy50ZWxvcyk7XG4gICAgICAgICAgICAgICAgdmFyIHByaWNlX2luaXQgPSBuZXcgQXNzZXRERVgoMCwgdGhpcy50ZWxvcyk7XG4gICAgICAgICAgICAgICAgdmFyIHRvdGFsX3F1YW50aXR5ID0gYW1vdW50X21hcFt0b2tlbi5zeW1ib2xdO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRvdGFsX3F1YW50aXR5LnRvTnVtYmVyKCkgPT0gMCkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiAodG9rZW4uc3ltYm9sID09IFwiQUNPUk5cIikgY29uc29sZS5sb2coXCJUT0tFTjogLS0tLS0tLS0gXCIsIHRva2VuLnN5bWJvbCwgdG9rZW4uc3VtbWFyeS5wcmljZS5zdHIsIHRva2VuLnN1bW1hcnkucHJpY2VfMjRoX2Fnby5zdHIgKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqIGluIHRoaXMuX21hcmtldHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGouaW5kZXhPZihcIi5cIikgPT0gLTEpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGUgPSB0aGlzLl9tYXJrZXRzW2pdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVuY3lfcHJpY2UgPSB0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gXCJUTE9TXCIgPyBPTkUgOiB0YWJsZS5jdXJyZW5jeS5zdW1tYXJ5LnByaWNlLmFtb3VudDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbmN5X3ByaWNlXzI0aF9hZ28gPSB0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gXCJUTE9TXCIgPyBPTkUgOiB0YWJsZS5jdXJyZW5jeS5zdW1tYXJ5LnByaWNlXzI0aF9hZ28uYW1vdW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY29tb2RpdHkuc3ltYm9sID09IHRva2VuLnN5bWJvbCB8fCB0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhvdyBtdWNoIHF1YW50aXR5IGlzIGludm9sdmVkIGluIHRoaXMgbWFya2V0XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcXVhbnRpdHkgPSBuZXcgQXNzZXRERVgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkgPSB0YWJsZS5zdW1tYXJ5LmFtb3VudC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkgPSB0YWJsZS5zdW1tYXJ5LnZvbHVtZS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIGluZmx1ZW5jZS13ZWlnaHQgb2YgdGhpcyBtYXJrZXQgb3ZlciB0aGUgdG9rZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3ZWlnaHQgPSBxdWFudGl0eS5hbW91bnQuZGl2aWRlZEJ5KHRvdGFsX3F1YW50aXR5LmFtb3VudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgcHJpY2Ugb2YgdGhpcyB0b2tlbiBpbiB0aGlzIG1hcmtldCAoZXhwcmVzc2VkIGluIFRMT1MpXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJpY2VfYW1vdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmNvbW9kaXR5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZV9hbW91bnQgPSB0YWJsZS5zdW1tYXJ5LnByaWNlLmFtb3VudC5tdWx0aXBsaWVkQnkodGFibGUuY3VycmVuY3kuc3VtbWFyeS5wcmljZS5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfYW1vdW50ID0gdGFibGUuc3VtbWFyeS5pbnZlcnNlLmFtb3VudC5tdWx0aXBsaWVkQnkodGFibGUuY29tb2RpdHkuc3VtbWFyeS5wcmljZS5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhpcyBtYXJrZXQgdG9rZW4gcHJpY2UgbXVsdGlwbGllZCBieSB0aGUgd2lnaHQgb2YgdGhpcyBtYXJrZXQgKHBvbmRlcmF0ZWQgcHJpY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJpY2VfaSA9IG5ldyBBc3NldERFWChwcmljZV9hbW91bnQubXVsdGlwbGllZEJ5KHdlaWdodCksIHRoaXMudGVsb3MpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIHByaWNlIG9mIHRoaXMgdG9rZW4gaW4gdGhpcyBtYXJrZXQgMjRoIGFnbyAoZXhwcmVzc2VkIGluIFRMT1MpXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJpY2VfaW5pdF9hbW91bnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY29tb2RpdHkuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2luaXRfYW1vdW50ID0gdGFibGUuc3VtbWFyeS5wcmljZV8yNGhfYWdvLmFtb3VudC5tdWx0aXBsaWVkQnkodGFibGUuY3VycmVuY3kuc3VtbWFyeS5wcmljZV8yNGhfYWdvLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZV9pbml0X2Ftb3VudCA9IHRhYmxlLnN1bW1hcnkuaW52ZXJzZV8yNGhfYWdvLmFtb3VudC5tdWx0aXBsaWVkQnkodGFibGUuY29tb2RpdHkuc3VtbWFyeS5wcmljZV8yNGhfYWdvLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGlzIG1hcmtldCB0b2tlbiBwcmljZSAyNGggYWdvIG11bHRpcGxpZWQgYnkgdGhlIHdlaWdodCBvZiB0aGlzIG1hcmtldCAocG9uZGVyYXRlZCBpbml0X3ByaWNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlX2luaXRfaSA9IG5ldyBBc3NldERFWChwcmljZV9pbml0X2Ftb3VudC5tdWx0aXBsaWVkQnkod2VpZ2h0KSwgdGhpcy50ZWxvcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhvdyBtdWNoIHZvbHVtZSBpcyBpbnZvbHZlZCBpbiB0aGlzIG1hcmtldFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZvbHVtZV9pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmNvbW9kaXR5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWVfaSA9IHRhYmxlLnN1bW1hcnkudm9sdW1lLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWVfaSA9IHRhYmxlLnN1bW1hcnkuYW1vdW50LmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoaXMgbWFya2V0IGRvZXMgbm90IG1lc3VyZSB0aGUgdm9sdW1lIGluIFRMT1MsIHRoZW4gY29udmVydCBxdWFudGl0eSB0byBUTE9TIGJ5IG11bHRpcGxpZWQgQnkgdm9sdW1lJ3MgdG9rZW4gcHJpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2b2x1bWVfaS50b2tlbi5zeW1ib2wgIT0gdGhpcy50ZWxvcy5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWVfaSA9IG5ldyBBc3NldERFWChxdWFudGl0eS5hbW91bnQubXVsdGlwbGllZEJ5KHF1YW50aXR5LnRva2VuLnN1bW1hcnkucHJpY2UuYW1vdW50KSwgdGhpcy50ZWxvcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2UgPSBwcmljZS5wbHVzKG5ldyBBc3NldERFWChwcmljZV9pLCB0aGlzLnRlbG9zKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZV9pbml0ID0gcHJpY2VfaW5pdC5wbHVzKG5ldyBBc3NldERFWChwcmljZV9pbml0X2ksIHRoaXMudGVsb3MpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZSA9IHZvbHVtZS5wbHVzKG5ldyBBc3NldERFWCh2b2x1bWVfaSwgdGhpcy50ZWxvcykpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi1pXCIsaSwgdGFibGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHdlaWdodDpcIiwgd2VpZ2h0LnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHRhYmxlLnN1bW1hcnkucHJpY2Uuc3RyXCIsIHRhYmxlLnN1bW1hcnkucHJpY2Uuc3RyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSB0YWJsZS5zdW1tYXJ5LnByaWNlLmFtb3VudC5tdWx0aXBsaWVkQnkod2VpZ2h0KS50b051bWJlcigpXCIsIHRhYmxlLnN1bW1hcnkucHJpY2UuYW1vdW50Lm11bHRpcGxpZWRCeSh3ZWlnaHQpLnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIGN1cnJlbmN5X3ByaWNlLnRvTnVtYmVyKClcIiwgY3VycmVuY3lfcHJpY2UudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gcHJpY2VfaTpcIiwgcHJpY2VfaS50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSBwcmljZSAtPlwiLCBwcmljZS5zdHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIGN1cnJlbmN5X3ByaWNlXzI0aF9hZ286XCIsIGN1cnJlbmN5X3ByaWNlXzI0aF9hZ28udG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gdGFibGUuc3VtbWFyeS5wcmljZV8yNGhfYWdvOlwiLCB0YWJsZS5zdW1tYXJ5LnByaWNlXzI0aF9hZ28uc3RyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSBwcmljZV9pbml0X2k6XCIsIHByaWNlX2luaXRfaS50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSBwcmljZV9pbml0IC0+XCIsIHByaWNlX2luaXQuc3RyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgZGlmZiA9IHByaWNlLm1pbnVzKHByaWNlX2luaXQpO1xuICAgICAgICAgICAgICAgIHZhciByYXRpbzpudW1iZXIgPSAwO1xuICAgICAgICAgICAgICAgIGlmIChwcmljZV9pbml0LmFtb3VudC50b051bWJlcigpICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmF0aW8gPSBkaWZmLmFtb3VudC5kaXZpZGVkQnkocHJpY2VfaW5pdC5hbW91bnQpLnRvTnVtYmVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50ID0gTWF0aC5mbG9vcihyYXRpbyAqIDEwMDAwKSAvIDEwMDtcbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudF9zdHIgPSAoaXNOYU4ocGVyY2VudCkgPyAwIDogcGVyY2VudCkgKyBcIiVcIjtcblxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicHJpY2VcIiwgcHJpY2Uuc3RyKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInByaWNlXzI0aF9hZ29cIiwgcHJpY2VfaW5pdC5zdHIpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidm9sdW1lXCIsIHZvbHVtZS5zdHIpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicGVyY2VudFwiLCBwZXJjZW50KTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInBlcmNlbnRfc3RyXCIsIHBlcmNlbnRfc3RyKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJhdGlvXCIsIHJhdGlvKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImRpZmZcIiwgZGlmZi5zdHIpO1xuXG4gICAgICAgICAgICAgICAgdG9rZW4uc3VtbWFyeS5wcmljZSA9IHByaWNlO1xuICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkucHJpY2VfMjRoX2FnbyA9IHByaWNlX2luaXQ7XG4gICAgICAgICAgICAgICAgdG9rZW4uc3VtbWFyeS5wZXJjZW50ID0gcGVyY2VudDtcbiAgICAgICAgICAgICAgICB0b2tlbi5zdW1tYXJ5LnBlcmNlbnRfc3RyID0gcGVyY2VudF9zdHI7XG4gICAgICAgICAgICAgICAgdG9rZW4uc3VtbWFyeS52b2x1bWUgPSB2b2x1bWU7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIoZW5kKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICB0aGlzLnNldFRva2VuU3VtbWFyeSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZldGNoVG9rZW5zKGV4dGVuZGVkOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZS5mZXRjaFRva2VucygpXCIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwidG9rZW5zXCIpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHRva2VuczogPFRva2VuREVYW10+cmVzdWx0LnJvd3NcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBkYXRhLnRva2Vucykge1xuICAgICAgICAgICAgICAgIGRhdGEudG9rZW5zW2ldLnNjb3BlID0gZGF0YS50b2tlbnNbaV0uc3ltYm9sLnRvTG93ZXJDYXNlKCkgKyBcIi50bG9zXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc29ydFRva2VucygpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCIoaW5pKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmVzb3J0VG9rZW5zKClcIik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGhpcy50b2tlbnNbMF1cIiwgdGhpcy50b2tlbnNbMF0uc3VtbWFyeSk7XG4gICAgICAgIHRoaXMudG9rZW5zLnNvcnQoKGE6VG9rZW5ERVgsIGI6VG9rZW5ERVgpID0+IHtcbiAgICAgICAgICAgIC8vIHB1c2ggb2ZmY2hhaW4gdG9rZW5zIHRvIHRoZSBlbmQgb2YgdGhlIHRva2VuIGxpc3RcbiAgICAgICAgICAgIGlmIChhLm9mZmNoYWluIHx8ICFhLnZlcmlmaWVkKSByZXR1cm4gMTtcbiAgICAgICAgICAgIGlmIChiLm9mZmNoYWluIHx8ICFiLnZlcmlmaWVkKSByZXR1cm4gLTE7XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiIC0tLSBcIiwgYS5zeW1ib2wsIFwiLVwiLCBiLnN5bWJvbCwgXCIgLS0tIFwiKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiICAgICBcIiwgYS5zdW1tYXJ5ID8gYS5zdW1tYXJ5LnZvbHVtZS5zdHIgOiBcIjBcIiwgXCItXCIsIGIuc3VtbWFyeSA/IGIuc3VtbWFyeS52b2x1bWUuc3RyIDogXCIwXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgYV92b2wgPSBhLnN1bW1hcnkgPyBhLnN1bW1hcnkudm9sdW1lIDogbmV3IEFzc2V0REVYKCk7XG4gICAgICAgICAgICB2YXIgYl92b2wgPSBiLnN1bW1hcnkgPyBiLnN1bW1hcnkudm9sdW1lIDogbmV3IEFzc2V0REVYKCk7XG5cbiAgICAgICAgICAgIGlmKGFfdm9sLmFtb3VudC5pc0dyZWF0ZXJUaGFuKGJfdm9sLmFtb3VudCkpIHJldHVybiAtMTtcbiAgICAgICAgICAgIGlmKGFfdm9sLmFtb3VudC5pc0xlc3NUaGFuKGJfdm9sLmFtb3VudCkpIHJldHVybiAxO1xuXG4gICAgICAgICAgICBpZihhLmFwcG5hbWUgPCBiLmFwcG5hbWUpIHJldHVybiAtMTtcbiAgICAgICAgICAgIGlmKGEuYXBwbmFtZSA+IGIuYXBwbmFtZSkgcmV0dXJuIDE7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSk7IFxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmVzb3J0VG9rZW5zKClcIiwgdGhpcy50b2tlbnMpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIihlbmQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcblxuICAgICAgICB0aGlzLm9uVG9rZW5zUmVhZHkubmV4dCh0aGlzLnRva2Vucyk7ICAgICAgICBcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc29ydFRvcE1hcmtldHMoKSB7XG4gICAgICAgIHRoaXMud2FpdFRva2VuU3VtbWFyeS50aGVuKF8gPT4ge1xuXG4gICAgICAgICAgICB0aGlzLnRvcG1hcmtldHMgPSBbXTtcbiAgICAgICAgICAgIHZhciBpbnZlcnNlOiBzdHJpbmc7XG4gICAgICAgICAgICB2YXIgbWFya2V0Ok1hcmtldDtcbiAgICAgICAgICAgIGZvciAodmFyIHNjb3BlIGluIHRoaXMuX21hcmtldHMpIHtcbiAgICAgICAgICAgICAgICBtYXJrZXQgPSB0aGlzLl9tYXJrZXRzW3Njb3BlXTtcbiAgICAgICAgICAgICAgICBpZiAobWFya2V0LmRpcmVjdCA+PSBtYXJrZXQuaW52ZXJzZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvcG1hcmtldHMucHVzaChtYXJrZXQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGludmVyc2UgPSB0aGlzLmludmVyc2VTY29wZShzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtldCA9IHRoaXMubWFya2V0KGludmVyc2UpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvcG1hcmtldHMucHVzaChtYXJrZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy50b3BtYXJrZXRzLnNvcnQoKGE6TWFya2V0LCBiOk1hcmtldCkgPT4ge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBhX3ZvbCA9IGEuc3VtbWFyeSA/IGEuc3VtbWFyeS52b2x1bWUgOiBuZXcgQXNzZXRERVgoKTtcbiAgICAgICAgICAgICAgICB2YXIgYl92b2wgPSBiLnN1bW1hcnkgPyBiLnN1bW1hcnkudm9sdW1lIDogbmV3IEFzc2V0REVYKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoYV92b2wudG9rZW4gIT0gdGhpcy50ZWxvcykge1xuICAgICAgICAgICAgICAgICAgICBhX3ZvbCA9IG5ldyBBc3NldERFWChhX3ZvbC5hbW91bnQubXVsdGlwbGllZEJ5KGFfdm9sLnRva2VuLnN1bW1hcnkucHJpY2UuYW1vdW50KSx0aGlzLnRlbG9zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJfdm9sLnRva2VuICE9IHRoaXMudGVsb3MpIHtcbiAgICAgICAgICAgICAgICAgICAgYl92b2wgPSBuZXcgQXNzZXRERVgoYl92b2wuYW1vdW50Lm11bHRpcGxpZWRCeShiX3ZvbC50b2tlbi5zdW1tYXJ5LnByaWNlLmFtb3VudCksdGhpcy50ZWxvcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoYl92b2wudG9rZW4gPT0gdGhpcy50ZWxvcywgXCJFUlJPUjogdm9sdW1lIG1pc3NjYWxjdWxhdGVkXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGFfdm9sLnRva2VuID09IHRoaXMudGVsb3MsIFwiRVJST1I6IHZvbHVtZSBtaXNzY2FsY3VsYXRlZFwiKTtcblxuICAgICAgICAgICAgICAgIGlmKGFfdm9sLmFtb3VudC5pc0dyZWF0ZXJUaGFuKGJfdm9sLmFtb3VudCkpIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICBpZihhX3ZvbC5hbW91bnQuaXNMZXNzVGhhbihiX3ZvbC5hbW91bnQpKSByZXR1cm4gMTtcblxuICAgICAgICAgICAgICAgIGlmKGEuY3VycmVuY3kgPT0gdGhpcy50ZWxvcyAmJiBiLmN1cnJlbmN5ICE9IHRoaXMudGVsb3MpIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICBpZihiLmN1cnJlbmN5ID09IHRoaXMudGVsb3MgJiYgYS5jdXJyZW5jeSAhPSB0aGlzLnRlbG9zKSByZXR1cm4gMTtcblxuICAgICAgICAgICAgICAgIGlmKGEuY29tb2RpdHkuYXBwbmFtZSA8IGIuY29tb2RpdHkuYXBwbmFtZSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIGlmKGEuY29tb2RpdHkuYXBwbmFtZSA+IGIuY29tb2RpdHkuYXBwbmFtZSkgcmV0dXJuIDE7XG4gICAgXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5vblRvcE1hcmtldHNSZWFkeS5uZXh0KHRoaXMudG9wbWFya2V0cyk7IFxuICAgICAgICB9KTtcblxuICAgIH1cblxuXG59XG5cblxuXG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVmFwYWVlREVYIH0gZnJvbSAnLi9kZXguc2VydmljZSdcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtdLFxuICBwcm92aWRlcnM6IFtWYXBhZWVERVhdLFxuICBleHBvcnRzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBWYXBhZWVEZXhNb2R1bGUgeyB9XG4iXSwibmFtZXMiOlsidHNsaWJfMS5fX2V4dGVuZHMiLCJUb2tlbiIsIkFzc2V0IiwiU3ViamVjdCIsIkZlZWRiYWNrIiwiSW5qZWN0YWJsZSIsIlZhcGFlZVNj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QUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN4QyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ1QsS0FBSyxDQUFDLENBQUM7d0JBQUMsS0FBSyxDQUFDOzRCQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7NEJBQUMsTUFBTTt3QkFDOUIsS0FBSyxDQUFDOzRCQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs0QkFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7d0JBQ3hELEtBQUssQ0FBQzs0QkFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7NEJBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFBQyxTQUFTO3dCQUNqRCxLQUFLLENBQUM7NEJBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7NEJBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzs0QkFBQyxTQUFTO3dCQUNqRDs0QkFDSSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0NBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQ0FBQyxTQUFTOzZCQUFFOzRCQUM1RyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FB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QUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTt3REFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29EQUMzQyxJQUFJLEdBQUcsRUFBRTt3REFDTCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0RBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3REFDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3REFDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3REFDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FEQUN4QztvREFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztvREFHdEIsR0FBRyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvREFDM0IsR0FBRyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7b0RBQzdCLE1BQU0sR0FBRyxFQUFFLENBQUM7b0RBQ1osS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7d0RBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FB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LEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO29DQUM3RixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztvQ0FDM0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7b0NBQzVGLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO29DQUMxRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztvQ0FDdEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7b0NBQ3hELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztvQ0FDbkUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMs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QyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUM7b0RBQ3hFLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxJQUFJLEdBQUcsQ0FBQztvREFDdkYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDO29EQUMzRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO29EQUNqRCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO29EQUNqRCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO29EQUN2RCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO29EQUN2RCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO29EQUMzRCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDOzs7b0RBSTNELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsR0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7b0RBQ2xELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsR0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7b0RBQ2hELHNCQUFPLElBQUksQ0FB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SSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUMxRCxLQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7O29CQUV0RSxLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O3dCQUN2QyxJQUFJLEtBQUssR0FBZ0I7NEJBQ3JCLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7NEJBQ3JCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7NEJBQ3pCLEdBQUcsRUFBRSxFQUFFOzRCQUNQLEtBQUssRUFBRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFJLENBQUM7NEJBQy9DLE9BQU8sRUFBRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFJLENBQUM7NEJBQ25ELFFBQVEsRUFBRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxLQUFJLENBQUM7NEJBQ3JELEdBQUcsRUFBRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFJLENBQUM7NEJBQzNDLEdBQUcsRUFBRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFJLENBQUM7NEJBQzNDLE1BQU0sRUFBRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENB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QUMzQixNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNOzRCQUM3QixJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7NEJBQ25DLEtBQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO3lCQUNoQyxDQUFBO3dCQUNELFdBQVcsQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO3dCQUN2RSxLQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQztxQkFDckU7b0JBRUQsS0FBSyxJQUFJLENBQUMsSUFBSSxLQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRTt3QkFDdkMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3pFO29CQUVELEtBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFTLENBQVcsRUFBRSxDQUFXO3dCQUNuRSxJQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUk7NEJBQUUsT0FBTyxDQUFDLENBQUM7d0JBQzdCLElBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSTs0QkFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUM5QixJQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUU7NEJBQUUsT0FBTyxDQUFD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