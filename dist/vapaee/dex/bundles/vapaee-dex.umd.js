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
            this.onMarketReady = new rxjs.Subject();
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
                if (force === void 0) {
                    force = false;
                }
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
                                aux = this.waitTokensLoaded.then(function (_) {
                                    return __awaiter(_this, void 0, void 0, function () {
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
                                            p = this.getTableSummary(this._markets[i].comodity, this._markets[i].currency, true);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFwYWVlLWRleC51bWQuanMubWFwIiwic291cmNlcyI6W251bGwsIm5nOi8vQHZhcGFlZS9kZXgvbGliL3Rva2VuLWRleC5jbGFzcy50cyIsIm5nOi8vQHZhcGFlZS9kZXgvbGliL2Fzc2V0LWRleC5jbGFzcy50cyIsIm5nOi8vQHZhcGFlZS9kZXgvbGliL2RleC5zZXJ2aWNlLnRzIiwibmc6Ly9AdmFwYWVlL2RleC9saWIvZGV4Lm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDApXHJcbiAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHQuZGVmYXVsdCA9IG1vZDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcbiIsImltcG9ydCB7IFRva2VuIH0gZnJvbSAnQHZhcGFlZS9zY2F0dGVyJztcbmltcG9ydCB7IEFzc2V0REVYIH0gZnJvbSBcIi4vYXNzZXQtZGV4LmNsYXNzXCI7XG5cbi8qXG5leHBvcnQgaW50ZXJmYWNlIFRva2VuIHtcbiAgICBzeW1ib2w6IHN0cmluZyxcbiAgICBwcmVjaXNpb24/OiBudW1iZXIsXG4gICAgY29udHJhY3Q/OiBzdHJpbmcsXG4gICAgYXBwbmFtZT86IHN0cmluZyxcbiAgICB3ZWJzaXRlPzogc3RyaW5nLFxuICAgIGxvZ28/OiBzdHJpbmcsXG4gICAgbG9nb2xnPzogc3RyaW5nLFxuICAgIHZlcmlmaWVkPzogYm9vbGVhbixcbiAgICBmYWtlPzogYm9vbGVhbixcbiAgICBvZmZjaGFpbj86IGJvb2xlYW4sXG4gICAgc2NvcGU/OiBzdHJpbmcsXG4gICAgc3RhdD86IHtcbiAgICAgICAgc3VwcGx5OiBzdHJpbmcsXG4gICAgICAgIG1heF9zdXBwbHk6IHN0cmluZyxcbiAgICAgICAgaXNzdWVyPzogc3RyaW5nLFxuICAgICAgICBvd25lcj86IHN0cmluZyxcbiAgICAgICAgaXNzdWVycz86IHN0cmluZ1tdXG4gICAgfSxcbiAgICBzdW1tYXJ5Pzoge1xuICAgICAgICB2b2x1bWU6IEFzc2V0LFxuICAgICAgICBwcmljZTogQXNzZXQsXG4gICAgICAgIHByaWNlXzI0aF9hZ286IEFzc2V0LFxuICAgICAgICBwZXJjZW50PzpudW1iZXIsXG4gICAgICAgIHBlcmNlbnRfc3RyPzpzdHJpbmdcbiAgICB9XG5cbn1cbiovXG5leHBvcnQgY2xhc3MgVG9rZW5ERVggZXh0ZW5kcyBUb2tlbiB7XG4gICAgLy8gcHJpdmF0ZSBfc3RyOiBzdHJpbmc7XG4gICAgLy8gcHJpdmF0ZSBfc3ltYm9sOiBzdHJpbmc7XG4gICAgLy8gcHJpdmF0ZSBfcHJlY2lzaW9uOiBudW1iZXI7XG4gICAgLy8gcHJpdmF0ZSBfY29udHJhY3Q6IHN0cmluZztcblxuICAgIHB1YmxpYyBhcHBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIHdlYnNpdGU6IHN0cmluZztcbiAgICBwdWJsaWMgbG9nbzogc3RyaW5nO1xuICAgIHB1YmxpYyBsb2dvbGc6IHN0cmluZztcbiAgICBwdWJsaWMgdmVyaWZpZWQ6IGJvb2xlYW47XG4gICAgcHVibGljIGZha2U6IGJvb2xlYW47XG4gICAgcHVibGljIG9mZmNoYWluOiBib29sZWFuO1xuICAgIHB1YmxpYyBzY29wZTogc3RyaW5nO1xuXG4gICAgc3RhdD86IHtcbiAgICAgICAgc3VwcGx5OiBzdHJpbmcsXG4gICAgICAgIG1heF9zdXBwbHk6IHN0cmluZyxcbiAgICAgICAgaXNzdWVyPzogc3RyaW5nLFxuICAgICAgICBvd25lcj86IHN0cmluZyxcbiAgICAgICAgaXNzdWVycz86IHN0cmluZ1tdXG4gICAgfTtcblxuICAgIHN1bW1hcnk/OiB7XG4gICAgICAgIHZvbHVtZTogQXNzZXRERVgsXG4gICAgICAgIHByaWNlOiBBc3NldERFWCxcbiAgICAgICAgcHJpY2VfMjRoX2FnbzogQXNzZXRERVgsXG4gICAgICAgIHBlcmNlbnQ/Om51bWJlcixcbiAgICAgICAgcGVyY2VudF9zdHI/OnN0cmluZ1xuICAgIH0gICAgXG5cbiAgICBjb25zdHJ1Y3RvcihvYmo6YW55ID0gbnVsbCkge1xuICAgICAgICBzdXBlcihvYmopO1xuICAgICAgICBpZiAodHlwZW9mIG9iaiA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBkZWxldGUgb2JqLnN5bWJvbDtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmoucHJlY2lzaW9uO1xuICAgICAgICAgICAgZGVsZXRlIG9iai5jb250cmFjdDtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuXG5cbn0iLCJpbXBvcnQgQmlnTnVtYmVyIGZyb20gJ2JpZ251bWJlci5qcyc7XG5pbXBvcnQgeyBUb2tlbkRFWCB9IGZyb20gJy4vdG9rZW4tZGV4LmNsYXNzJztcbmltcG9ydCB7IEFzc2V0IH0gZnJvbSAnQHZhcGFlZS9zY2F0dGVyJztcblxuZXhwb3J0IGludGVyZmFjZSBJVmFwYWVlREVYIHtcbiAgICBnZXRUb2tlbk5vdyhzeW1ib2w6c3RyaW5nKTogVG9rZW5ERVg7XG59XG5cbmV4cG9ydCBjbGFzcyBBc3NldERFWCBleHRlbmRzIEFzc2V0IHtcbiAgICBhbW91bnQ6QmlnTnVtYmVyO1xuICAgIHRva2VuOlRva2VuREVYO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKGE6IGFueSA9IG51bGwsIGI6IGFueSA9IG51bGwpIHtcbiAgICAgICAgc3VwZXIoYSxiKTtcblxuICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEFzc2V0REVYKSB7XG4gICAgICAgICAgICB0aGlzLmFtb3VudCA9IGEuYW1vdW50O1xuICAgICAgICAgICAgdGhpcy50b2tlbiA9IGI7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoISFiICYmIGJbJ2dldFRva2VuTm93J10pIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VEZXgoYSxiKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgY2xvbmUoKTogQXNzZXRERVgge1xuICAgICAgICByZXR1cm4gbmV3IEFzc2V0REVYKHRoaXMuYW1vdW50LCB0aGlzLnRva2VuKTtcbiAgICB9XG5cbiAgICBwbHVzKGI6QXNzZXRERVgpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoISFiLCBcIkVSUk9SOiBiIGlzIG5vdCBhbiBBc3NldFwiLCBiLCB0aGlzLnN0cik7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGIudG9rZW4uc3ltYm9sID09IHRoaXMudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiB0cnlpbmcgdG8gc3VtIGFzc2V0cyB3aXRoIGRpZmZlcmVudCB0b2tlbnM6IFwiICsgdGhpcy5zdHIgKyBcIiBhbmQgXCIgKyBiLnN0cik7XG4gICAgICAgIHZhciBhbW91bnQgPSB0aGlzLmFtb3VudC5wbHVzKGIuYW1vdW50KTtcbiAgICAgICAgcmV0dXJuIG5ldyBBc3NldERFWChhbW91bnQsIHRoaXMudG9rZW4pO1xuICAgIH1cblxuICAgIG1pbnVzKGI6QXNzZXRERVgpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoISFiLCBcIkVSUk9SOiBiIGlzIG5vdCBhbiBBc3NldFwiLCBiLCB0aGlzLnN0cik7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGIudG9rZW4uc3ltYm9sID09IHRoaXMudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiB0cnlpbmcgdG8gc3Vic3RyYWN0IGFzc2V0cyB3aXRoIGRpZmZlcmVudCB0b2tlbnM6IFwiICsgdGhpcy5zdHIgKyBcIiBhbmQgXCIgKyBiLnN0cik7XG4gICAgICAgIHZhciBhbW91bnQgPSB0aGlzLmFtb3VudC5taW51cyhiLmFtb3VudCk7XG4gICAgICAgIHJldHVybiBuZXcgQXNzZXRERVgoYW1vdW50LCB0aGlzLnRva2VuKTtcbiAgICB9ICAgIFxuXG4gICAgcGFyc2VEZXgodGV4dDogc3RyaW5nLCBkZXg6IElWYXBhZWVERVgpIHtcbiAgICAgICAgaWYgKHRleHQgPT0gXCJcIikgcmV0dXJuO1xuICAgICAgICB2YXIgc3ltID0gdGV4dC5zcGxpdChcIiBcIilbMV07XG4gICAgICAgIHRoaXMudG9rZW4gPSBkZXguZ2V0VG9rZW5Ob3coc3ltKTtcbiAgICAgICAgdmFyIGFtb3VudF9zdHIgPSB0ZXh0LnNwbGl0KFwiIFwiKVswXTtcbiAgICAgICAgdGhpcy5hbW91bnQgPSBuZXcgQmlnTnVtYmVyKGFtb3VudF9zdHIpO1xuICAgIH1cblxuICAgIFxuICAgIHRvU3RyaW5nKGRlY2ltYWxzOm51bWJlciA9IC0xKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLnRva2VuKSByZXR1cm4gXCIwLjAwMDBcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVUb1N0cmluZyhkZWNpbWFscykgKyBcIiBcIiArIHRoaXMudG9rZW4uc3ltYm9sLnRvVXBwZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgaW52ZXJzZSh0b2tlbjogVG9rZW5ERVgpOiBBc3NldERFWCB7XG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQmlnTnVtYmVyKDEpLmRpdmlkZWRCeSh0aGlzLmFtb3VudCk7XG4gICAgICAgIHZhciBhc3NldCA9ICBuZXcgQXNzZXRERVgocmVzdWx0LCB0b2tlbik7XG4gICAgICAgIHJldHVybiBhc3NldDtcbiAgICB9XG59IiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IEJpZ051bWJlciBmcm9tIFwiYmlnbnVtYmVyLmpzXCI7XG5pbXBvcnQgeyBDb29raWVTZXJ2aWNlIH0gZnJvbSAnbmd4LWNvb2tpZS1zZXJ2aWNlJztcbmltcG9ydCB7IERhdGVQaXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFRva2VuREVYIH0gZnJvbSAnLi90b2tlbi1kZXguY2xhc3MnO1xuaW1wb3J0IHsgQXNzZXRERVggfSBmcm9tICcuL2Fzc2V0LWRleC5jbGFzcyc7XG5pbXBvcnQgeyBGZWVkYmFjayB9IGZyb20gJ0B2YXBhZWUvZmVlZGJhY2snO1xuaW1wb3J0IHsgVmFwYWVlU2NhdHRlciwgQWNjb3VudCwgQWNjb3VudERhdGEsIFNtYXJ0Q29udHJhY3QsIFRhYmxlUmVzdWx0LCBUYWJsZVBhcmFtcyB9IGZyb20gJ0B2YXBhZWUvc2NhdHRlcic7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiBcInJvb3RcIlxufSlcbmV4cG9ydCBjbGFzcyBWYXBhZWVERVgge1xuXG4gICAgcHVibGljIGxvZ2luU3RhdGU6IHN0cmluZztcbiAgICAvKlxuICAgIHB1YmxpYyBsb2dpblN0YXRlOiBzdHJpbmc7XG4gICAgLSAnbm8tc2NhdHRlcic6IFNjYXR0ZXIgbm8gZGV0ZWN0ZWRcbiAgICAtICduby1sb2dnZWQnOiBTY2F0dGVyIGRldGVjdGVkIGJ1dCB1c2VyIGlzIG5vdCBsb2dnZWRcbiAgICAtICdhY2NvdW50LW9rJzogdXNlciBsb2dnZXIgd2l0aCBzY2F0dGVyXG4gICAgKi9cbiAgICBwcml2YXRlIF9tYXJrZXRzOiBNYXJrZXRNYXA7XG4gICAgcHJpdmF0ZSBfcmV2ZXJzZTogTWFya2V0TWFwO1xuXG4gICAgcHVibGljIHplcm9fdGVsb3M6IEFzc2V0REVYO1xuICAgIHB1YmxpYyB0ZWxvczogVG9rZW5ERVg7XG4gICAgcHVibGljIHRva2VuczogVG9rZW5ERVhbXTtcbiAgICBwdWJsaWMgY29udHJhY3Q6IFNtYXJ0Q29udHJhY3Q7XG4gICAgcHVibGljIGZlZWQ6IEZlZWRiYWNrO1xuICAgIHB1YmxpYyBjdXJyZW50OiBBY2NvdW50O1xuICAgIHB1YmxpYyBsYXN0X2xvZ2dlZDogc3RyaW5nO1xuICAgIHB1YmxpYyBjb250cmFjdF9uYW1lOiBzdHJpbmc7ICAgXG4gICAgcHVibGljIGRlcG9zaXRzOiBBc3NldERFWFtdO1xuICAgIHB1YmxpYyBiYWxhbmNlczogQXNzZXRERVhbXTtcbiAgICBwdWJsaWMgdXNlcm9yZGVyczogVXNlck9yZGVyc01hcDtcbiAgICBwdWJsaWMgb25Mb2dnZWRBY2NvdW50Q2hhbmdlOlN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIG9uQ3VycmVudEFjY291bnRDaGFuZ2U6U3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3QoKTtcbiAgICBwdWJsaWMgb25IaXN0b3J5Q2hhbmdlOlN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIG9uTWFya2V0U3VtbWFyeTpTdWJqZWN0PE1hcmtldFN1bW1hcnk+ID0gbmV3IFN1YmplY3QoKTtcbiAgICAvLyBwdWJsaWMgb25CbG9ja2xpc3RDaGFuZ2U6U3ViamVjdDxhbnlbXVtdPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIG9uVG9rZW5zUmVhZHk6U3ViamVjdDxUb2tlbkRFWFtdPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIG9uTWFya2V0UmVhZHk6U3ViamVjdDxUb2tlbkRFWFtdPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIG9uVHJhZGVVcGRhdGVkOlN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgdmFwYWVldG9rZW5zOnN0cmluZyA9IFwidmFwYWVldG9rZW5zXCI7XG5cbiAgICBhY3Rpdml0eVBhZ2VzaXplOm51bWJlciA9IDEwO1xuICAgIFxuICAgIGFjdGl2aXR5OntcbiAgICAgICAgdG90YWw6bnVtYmVyO1xuICAgICAgICBldmVudHM6e1tpZDpzdHJpbmddOkV2ZW50TG9nfTtcbiAgICAgICAgbGlzdDpFdmVudExvZ1tdO1xuICAgIH07XG4gICAgXG4gICAgcHJpdmF0ZSBzZXRPcmRlclN1bW1hcnk6IEZ1bmN0aW9uO1xuICAgIHB1YmxpYyB3YWl0T3JkZXJTdW1tYXJ5OiBQcm9taXNlPGFueT4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0aGlzLnNldE9yZGVyU3VtbWFyeSA9IHJlc29sdmU7XG4gICAgfSk7XG5cbiAgICBwcml2YXRlIHNldFRva2VuU3RhdHM6IEZ1bmN0aW9uO1xuICAgIHB1YmxpYyB3YWl0VG9rZW5TdGF0czogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRUb2tlblN0YXRzID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIHByaXZhdGUgc2V0TWFya2V0U3VtbWFyeTogRnVuY3Rpb247XG4gICAgcHVibGljIHdhaXRNYXJrZXRTdW1tYXJ5OiBQcm9taXNlPGFueT4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0aGlzLnNldE1hcmtldFN1bW1hcnkgPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgcHJpdmF0ZSBzZXRUb2tlblN1bW1hcnk6IEZ1bmN0aW9uO1xuICAgIHB1YmxpYyB3YWl0VG9rZW5TdW1tYXJ5OiBQcm9taXNlPGFueT4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0aGlzLnNldFRva2VuU3VtbWFyeSA9IHJlc29sdmU7XG4gICAgfSk7XG5cbiAgICBwcml2YXRlIHNldFRva2Vuc0xvYWRlZDogRnVuY3Rpb247XG4gICAgcHVibGljIHdhaXRUb2tlbnNMb2FkZWQ6IFByb21pc2U8YW55PiA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0VG9rZW5zTG9hZGVkID0gcmVzb2x2ZTtcbiAgICB9KTtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBzY2F0dGVyOiBWYXBhZWVTY2F0dGVyLFxuICAgICAgICBwcml2YXRlIGNvb2tpZXM6IENvb2tpZVNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgZGF0ZVBpcGU6IERhdGVQaXBlXG4gICAgKSB7XG4gICAgICAgIHRoaXMuX21hcmtldHMgPSB7fTtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZSA9IHt9O1xuICAgICAgICB0aGlzLmFjdGl2aXR5ID0ge3RvdGFsOjAsIGV2ZW50czp7fSwgbGlzdDpbXX07XG4gICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMuZGVmYXVsdDtcbiAgICAgICAgdGhpcy5jb250cmFjdF9uYW1lID0gdGhpcy52YXBhZWV0b2tlbnM7XG4gICAgICAgIHRoaXMuY29udHJhY3QgPSB0aGlzLnNjYXR0ZXIuZ2V0U21hcnRDb250cmFjdCh0aGlzLmNvbnRyYWN0X25hbWUpO1xuICAgICAgICB0aGlzLmZlZWQgPSBuZXcgRmVlZGJhY2soKTtcbiAgICAgICAgdGhpcy5zY2F0dGVyLm9uTG9nZ2dlZFN0YXRlQ2hhbmdlLnN1YnNjcmliZSh0aGlzLm9uTG9nZ2VkQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnVwZGF0ZUxvZ1N0YXRlKCk7XG4gICAgICAgIHRoaXMuZmV0Y2hUb2tlbnMoKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgdGhpcy50b2tlbnMgPSBkYXRhLnRva2VucztcbiAgICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuREVYKHtcbiAgICAgICAgICAgICAgICBhcHBuYW1lOiBcIlZpaXRhc3BoZXJlXCIsXG4gICAgICAgICAgICAgICAgY29udHJhY3Q6IFwidmlpdGFzcGhlcmUxXCIsXG4gICAgICAgICAgICAgICAgbG9nbzogXCIvYXNzZXRzL2xvZ29zL3ZpaXRhc3BoZXJlLnBuZ1wiLFxuICAgICAgICAgICAgICAgIGxvZ29sZzogXCIvYXNzZXRzL2xvZ29zL3ZpaXRhc3BoZXJlLWxnLnBuZ1wiLFxuICAgICAgICAgICAgICAgIHByZWNpc2lvbjogNCxcbiAgICAgICAgICAgICAgICBzY29wZTogXCJ2aWl0Y3QudGxvc1wiLFxuICAgICAgICAgICAgICAgIHN5bWJvbDogXCJWSUlUQVwiLFxuICAgICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3ZWJzaXRlOiBcImh0dHBzOi8vdmlpdGFzcGhlcmUuY29tXCJcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuREVYKHtcbiAgICAgICAgICAgICAgICBhcHBuYW1lOiBcIlZpaXRhc3BoZXJlXCIsXG4gICAgICAgICAgICAgICAgY29udHJhY3Q6IFwidmlpdGFzcGhlcmUxXCIsXG4gICAgICAgICAgICAgICAgbG9nbzogXCIvYXNzZXRzL2xvZ29zL3ZpaXRhc3BoZXJlLnBuZ1wiLFxuICAgICAgICAgICAgICAgIGxvZ29sZzogXCIvYXNzZXRzL2xvZ29zL3ZpaXRhc3BoZXJlLWxnLnBuZ1wiLFxuICAgICAgICAgICAgICAgIHByZWNpc2lvbjogMCxcbiAgICAgICAgICAgICAgICBzY29wZTogXCJ2aWl0Y3QudGxvc1wiLFxuICAgICAgICAgICAgICAgIHN5bWJvbDogXCJWSUlDVFwiLFxuICAgICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3ZWJzaXRlOiBcImh0dHBzOi8vdmlpdGFzcGhlcmUuY29tXCJcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHRoaXMuemVyb190ZWxvcyA9IG5ldyBBc3NldERFWChcIjAuMDAwMCBUTE9TXCIsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zZXRUb2tlbnNMb2FkZWQoKTtcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hUb2tlbnNTdGF0cygpO1xuICAgICAgICAgICAgdGhpcy5nZXRPcmRlclN1bW1hcnkoKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0QWxsVGFibGVzU3VtYXJpZXMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oXyA9PiB7XG4gICAgICAgIC8vIH0pXG5cblxuICAgICAgICB2YXIgdGltZXI7XG4gICAgICAgIHRoaXMub25NYXJrZXRTdW1tYXJ5LnN1YnNjcmliZShzdW1tYXJ5ID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoXyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVUb2tlbnNTdW1tYXJ5KCk7XG4gICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICB9KTsgICAgXG5cblxuXG4gICAgfVxuXG4gICAgLy8gZ2V0dGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGRlZmF1bHQoKTogQWNjb3VudCB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjYXR0ZXIuZGVmYXVsdDtcbiAgICB9XG5cbiAgICBnZXQgbG9nZ2VkKCkge1xuICAgICAgICBpZiAodGhpcy5zY2F0dGVyLmxvZ2dlZCAmJiAhdGhpcy5zY2F0dGVyLmFjY291bnQpIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiV0FSTklORyEhIVwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2NhdHRlcik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnNjYXR0ZXIudXNlcm5hbWUpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIioqKioqKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgICAqL1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNjYXR0ZXIubG9nZ2VkID9cbiAgICAgICAgICAgICh0aGlzLnNjYXR0ZXIuYWNjb3VudCA/IHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUgOiB0aGlzLnNjYXR0ZXIuZGVmYXVsdC5uYW1lKSA6XG4gICAgICAgICAgICBudWxsO1xuICAgIH1cblxuICAgIGdldCBhY2NvdW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVyLmxvZ2dlZCA/IFxuICAgICAgICB0aGlzLnNjYXR0ZXIuYWNjb3VudCA6XG4gICAgICAgIHRoaXMuc2NhdHRlci5kZWZhdWx0O1xuICAgIH1cblxuICAgIC8vIC0tIFVzZXIgTG9nIFN0YXRlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxvZ2luKCkge1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ2luXCIsIHRydWUpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZy1zdGF0ZVwiLCB0cnVlKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgubG9naW4oKSB0aGlzLmZlZWQubG9hZGluZygnbG9nLXN0YXRlJylcIiwgdGhpcy5mZWVkLmxvYWRpbmcoJ2xvZy1zdGF0ZScpKTtcbiAgICAgICAgdGhpcy5sb2dvdXQoKTtcbiAgICAgICAgdGhpcy51cGRhdGVMb2dTdGF0ZSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5sb2dpbigpIHRoaXMuZmVlZC5sb2FkaW5nKCdsb2ctc3RhdGUnKVwiLCB0aGlzLmZlZWQubG9hZGluZygnbG9nLXN0YXRlJykpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ291dFwiLCBmYWxzZSk7XG4gICAgICAgIHJldHVybiB0aGlzLnNjYXR0ZXIubG9naW4oKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTG9nU3RhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwibG9naW5cIiwgZmFsc2UpO1xuICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwibG9naW5cIiwgZmFsc2UpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9nb3V0KCkge1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ291dFwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5zY2F0dGVyLmxvZ291dCgpO1xuICAgIH1cblxuICAgIG9uTG9nb3V0KCkge1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ291dFwiLCBmYWxzZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLm9uTG9nb3V0KClcIik7XG4gICAgICAgIHRoaXMucmVzZXRDdXJyZW50QWNjb3VudCh0aGlzLmRlZmF1bHQubmFtZSk7XG4gICAgICAgIHRoaXMudXBkYXRlTG9nU3RhdGUoKTtcbiAgICAgICAgdGhpcy5vbkxvZ2dlZEFjY291bnRDaGFuZ2UubmV4dCh0aGlzLmxvZ2dlZCk7XG4gICAgICAgIHRoaXMuY29va2llcy5kZWxldGUoXCJsb2dpblwiKTtcbiAgICAgICAgc2V0VGltZW91dChfICA9PiB7IHRoaXMubGFzdF9sb2dnZWQgPSB0aGlzLmxvZ2dlZDsgfSwgNDAwKTtcbiAgICB9XG4gICAgXG4gICAgb25Mb2dpbihuYW1lOnN0cmluZykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5vbkxvZ2luKClcIiwgbmFtZSk7XG4gICAgICAgIHRoaXMucmVzZXRDdXJyZW50QWNjb3VudChuYW1lKTtcbiAgICAgICAgdGhpcy5nZXREZXBvc2l0cygpO1xuICAgICAgICB0aGlzLmdldEJhbGFuY2VzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlTG9nU3RhdGUoKTtcbiAgICAgICAgdGhpcy5nZXRVc2VyT3JkZXJzKCk7XG4gICAgICAgIHRoaXMub25Mb2dnZWRBY2NvdW50Q2hhbmdlLm5leHQodGhpcy5sb2dnZWQpO1xuICAgICAgICB0aGlzLmxhc3RfbG9nZ2VkID0gdGhpcy5sb2dnZWQ7XG4gICAgICAgIHRoaXMuY29va2llcy5zZXQoXCJsb2dpblwiLCB0aGlzLmxvZ2dlZCk7XG4gICAgfVxuXG4gICAgb25Mb2dnZWRDaGFuZ2UoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLm9uTG9nZ2VkQ2hhbmdlKClcIik7XG4gICAgICAgIGlmICh0aGlzLnNjYXR0ZXIubG9nZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLm9uTG9naW4odGhpcy5zY2F0dGVyLmFjY291bnQubmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9uTG9nb3V0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyByZXNldEN1cnJlbnRBY2NvdW50KHByb2ZpbGU6c3RyaW5nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnJlc2V0Q3VycmVudEFjY291bnQoKVwiLCB0aGlzLmN1cnJlbnQubmFtZSwgXCItPlwiLCBwcm9maWxlKTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudC5uYW1lICE9IHByb2ZpbGUgJiYgKHRoaXMuY3VycmVudC5uYW1lID09IHRoaXMubGFzdF9sb2dnZWQgfHwgcHJvZmlsZSAhPSBcImd1ZXN0XCIpKSB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImFjY291bnRcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLmRlZmF1bHQ7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQubmFtZSA9IHByb2ZpbGU7XG4gICAgICAgICAgICBpZiAocHJvZmlsZSAhPSBcImd1ZXN0XCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQuZGF0YSA9IGF3YWl0IHRoaXMuZ2V0QWNjb3VudERhdGEodGhpcy5jdXJyZW50Lm5hbWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIldBUk5JTkchISEgY3VycmVudCBpcyBndWVzdFwiLCBbcHJvZmlsZSwgdGhpcy5hY2NvdW50LCB0aGlzLmN1cnJlbnRdKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0aGlzLnNjb3BlcyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5iYWxhbmNlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy51c2Vyb3JkZXJzID0ge307ICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRoaXMub25DdXJyZW50QWNjb3VudENoYW5nZS5uZXh0KHRoaXMuY3VycmVudC5uYW1lKSAhISEhISFcIik7XG4gICAgICAgICAgICB0aGlzLm9uQ3VycmVudEFjY291bnRDaGFuZ2UubmV4dCh0aGlzLmN1cnJlbnQubmFtZSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUN1cnJlbnRVc2VyKCk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImFjY291bnRcIiwgZmFsc2UpO1xuICAgICAgICB9ICAgICAgIFxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlTG9nU3RhdGUoKSB7XG4gICAgICAgIHRoaXMubG9naW5TdGF0ZSA9IFwibm8tc2NhdHRlclwiO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZy1zdGF0ZVwiLCB0cnVlKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgudXBkYXRlTG9nU3RhdGUoKSBcIiwgdGhpcy5sb2dpblN0YXRlLCB0aGlzLmZlZWQubG9hZGluZyhcImxvZy1zdGF0ZVwiKSk7XG4gICAgICAgIHRoaXMuc2NhdHRlci53YWl0Q29ubmVjdGVkLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2dpblN0YXRlID0gXCJuby1sb2dnZWRcIjtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnVwZGF0ZUxvZ1N0YXRlKCkgICBcIiwgdGhpcy5sb2dpblN0YXRlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNjYXR0ZXIubG9nZ2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dpblN0YXRlID0gXCJhY2NvdW50LW9rXCI7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWVERVgudXBkYXRlTG9nU3RhdGUoKSAgICAgXCIsIHRoaXMubG9naW5TdGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZy1zdGF0ZVwiLCBmYWxzZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC51cGRhdGVMb2dTdGF0ZSgpIFwiLCB0aGlzLmxvZ2luU3RhdGUsIHRoaXMuZmVlZC5sb2FkaW5nKFwibG9nLXN0YXRlXCIpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHRpbWVyMjtcbiAgICAgICAgdmFyIHRpbWVyMSA9IHNldEludGVydmFsKF8gPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnNjYXR0ZXIuZmVlZC5sb2FkaW5nKFwiY29ubmVjdFwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwibG9nLXN0YXRlXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyMSk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcjIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAyMDApO1xuXG4gICAgICAgIHRpbWVyMiA9IHNldFRpbWVvdXQoXyA9PiB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyMSk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZy1zdGF0ZVwiLCBmYWxzZSk7XG4gICAgICAgIH0sIDYwMDApO1xuICAgICAgICBcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGdldEFjY291bnREYXRhKG5hbWU6IHN0cmluZyk6IFByb21pc2U8QWNjb3VudERhdGE+ICB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjYXR0ZXIucXVlcnlBY2NvdW50RGF0YShuYW1lKS5jYXRjaChhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlZmF1bHQuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNyZWF0ZU9yZGVyKHR5cGU6c3RyaW5nLCBhbW91bnQ6QXNzZXRERVgsIHByaWNlOkFzc2V0REVYKSB7XG4gICAgICAgIC8vIFwiYWxpY2VcIiwgXCJidXlcIiwgXCIyLjUwMDAwMDAwIENOVFwiLCBcIjAuNDAwMDAwMDAgVExPU1wiXG4gICAgICAgIC8vIG5hbWUgb3duZXIsIG5hbWUgdHlwZSwgY29uc3QgYXNzZXQgJiB0b3RhbCwgY29uc3QgYXNzZXQgJiBwcmljZVxuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIm9yZGVyLVwiK3R5cGUsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5leGNlY3V0ZShcIm9yZGVyXCIsIHtcbiAgICAgICAgICAgIG93bmVyOiAgdGhpcy5zY2F0dGVyLmFjY291bnQubmFtZSxcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICB0b3RhbDogYW1vdW50LnRvU3RyaW5nKDgpLFxuICAgICAgICAgICAgcHJpY2U6IHByaWNlLnRvU3RyaW5nKDgpXG4gICAgICAgIH0pLnRoZW4oYXN5bmMgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVHJhZGUoYW1vdW50LnRva2VuLCBwcmljZS50b2tlbik7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcIm9yZGVyLVwiK3R5cGUsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJvcmRlci1cIit0eXBlLCBmYWxzZSk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY2FuY2VsT3JkZXIodHlwZTpzdHJpbmcsIGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCwgb3JkZXJzOm51bWJlcltdKSB7XG4gICAgICAgIC8vICdbXCJhbGljZVwiLCBcImJ1eVwiLCBcIkNOVFwiLCBcIlRMT1NcIiwgWzEsMF1dJ1xuICAgICAgICAvLyBuYW1lIG93bmVyLCBuYW1lIHR5cGUsIGNvbnN0IGFzc2V0ICYgdG90YWwsIGNvbnN0IGFzc2V0ICYgcHJpY2VcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjYW5jZWwtXCIrdHlwZSwgdHJ1ZSk7XG4gICAgICAgIGZvciAodmFyIGkgaW4gb3JkZXJzKSB7IHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY2FuY2VsLVwiK3R5cGUrXCItXCIrb3JkZXJzW2ldLCB0cnVlKTsgfVxuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5leGNlY3V0ZShcImNhbmNlbFwiLCB7XG4gICAgICAgICAgICBvd25lcjogIHRoaXMuc2NhdHRlci5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgY29tb2RpdHk6IGNvbW9kaXR5LnN5bWJvbCxcbiAgICAgICAgICAgIGN1cnJlbmN5OiBjdXJyZW5jeS5zeW1ib2wsXG4gICAgICAgICAgICBvcmRlcnM6IG9yZGVyc1xuICAgICAgICB9KS50aGVuKGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRyYWRlKGNvbW9kaXR5LCBjdXJyZW5jeSk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImNhbmNlbC1cIit0eXBlLCBmYWxzZSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG9yZGVycykgeyB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImNhbmNlbC1cIit0eXBlK1wiLVwiK29yZGVyc1tpXSwgZmFsc2UpOyB9ICAgIFxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImNhbmNlbC1cIit0eXBlLCBmYWxzZSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG9yZGVycykgeyB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImNhbmNlbC1cIit0eXBlK1wiLVwiK29yZGVyc1tpXSwgZmFsc2UpOyB9ICAgIFxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRlcG9zaXQocXVhbnRpdHk6QXNzZXRERVgpIHtcbiAgICAgICAgLy8gbmFtZSBvd25lciwgbmFtZSB0eXBlLCBjb25zdCBhc3NldCAmIHRvdGFsLCBjb25zdCBhc3NldCAmIHByaWNlXG4gICAgICAgIHZhciBjb250cmFjdCA9IHRoaXMuc2NhdHRlci5nZXRTbWFydENvbnRyYWN0KHF1YW50aXR5LnRva2VuLmNvbnRyYWN0KTtcbiAgICAgICAgdGhpcy5mZWVkLnNldEVycm9yKFwiZGVwb3NpdFwiLCBudWxsKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0XCIsIHRydWUpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImRlcG9zaXQtXCIrcXVhbnRpdHkudG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCksIHRydWUpO1xuICAgICAgICByZXR1cm4gY29udHJhY3QuZXhjZWN1dGUoXCJ0cmFuc2ZlclwiLCB7XG4gICAgICAgICAgICBmcm9tOiAgdGhpcy5zY2F0dGVyLmFjY291bnQubmFtZSxcbiAgICAgICAgICAgIHRvOiB0aGlzLnZhcGFlZXRva2VucyxcbiAgICAgICAgICAgIHF1YW50aXR5OiBxdWFudGl0eS50b1N0cmluZygpLFxuICAgICAgICAgICAgbWVtbzogXCJkZXBvc2l0XCJcbiAgICAgICAgfSkudGhlbihhc3luYyByZXN1bHQgPT4ge1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdC1cIitxdWFudGl0eS50b2tlbi5zeW1ib2wudG9Mb3dlckNhc2UoKSwgZmFsc2UpOyAgICBcbiAgICAgICAgICAgIC8qYXdhaXQqLyB0aGlzLmdldERlcG9zaXRzKCk7XG4gICAgICAgICAgICAvKmF3YWl0Ki8gdGhpcy5nZXRCYWxhbmNlcygpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImRlcG9zaXRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJkZXBvc2l0LVwiK3F1YW50aXR5LnRva2VuLnN5bWJvbC50b0xvd2VyQ2FzZSgpLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0RXJyb3IoXCJkZXBvc2l0XCIsIHR5cGVvZiBlID09IFwic3RyaW5nXCIgPyBlIDogSlNPTi5zdHJpbmdpZnkoZSxudWxsLDQpKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9KTtcbiAgICB9ICAgIFxuXG4gICAgd2l0aGRyYXcocXVhbnRpdHk6QXNzZXRERVgpIHtcbiAgICAgICAgdGhpcy5mZWVkLnNldEVycm9yKFwid2l0aGRyYXdcIiwgbnVsbCk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwid2l0aGRyYXdcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwid2l0aGRyYXctXCIrcXVhbnRpdHkudG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCksIHRydWUpOyAgIFxuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5leGNlY3V0ZShcIndpdGhkcmF3XCIsIHtcbiAgICAgICAgICAgIG93bmVyOiAgdGhpcy5zY2F0dGVyLmFjY291bnQubmFtZSxcbiAgICAgICAgICAgIHF1YW50aXR5OiBxdWFudGl0eS50b1N0cmluZygpXG4gICAgICAgIH0pLnRoZW4oYXN5bmMgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwid2l0aGRyYXdcIiwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ3aXRoZHJhdy1cIitxdWFudGl0eS50b2tlbi5zeW1ib2wudG9Mb3dlckNhc2UoKSwgZmFsc2UpO1xuICAgICAgICAgICAgLyphd2FpdCovIHRoaXMuZ2V0RGVwb3NpdHMoKTtcbiAgICAgICAgICAgIC8qYXdhaXQqLyB0aGlzLmdldEJhbGFuY2VzKCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwid2l0aGRyYXdcIiwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ3aXRoZHJhdy1cIitxdWFudGl0eS50b2tlbi5zeW1ib2wudG9Mb3dlckNhc2UoKSwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldEVycm9yKFwid2l0aGRyYXdcIiwgdHlwZW9mIGUgPT0gXCJzdHJpbmdcIiA/IGUgOiBKU09OLnN0cmluZ2lmeShlLG51bGwsNCkpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVG9rZW5zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYWRkT2ZmQ2hhaW5Ub2tlbihvZmZjaGFpbjogVG9rZW5ERVgpIHtcbiAgICAgICAgdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbkRFWCh7XG4gICAgICAgICAgICAgICAgc3ltYm9sOiBvZmZjaGFpbi5zeW1ib2wsXG4gICAgICAgICAgICAgICAgcHJlY2lzaW9uOiBvZmZjaGFpbi5wcmVjaXNpb24gfHwgNCxcbiAgICAgICAgICAgICAgICBjb250cmFjdDogXCJub2NvbnRyYWN0XCIsXG4gICAgICAgICAgICAgICAgYXBwbmFtZTogb2ZmY2hhaW4uYXBwbmFtZSxcbiAgICAgICAgICAgICAgICB3ZWJzaXRlOiBcIlwiLFxuICAgICAgICAgICAgICAgIGxvZ286XCJcIixcbiAgICAgICAgICAgICAgICBsb2dvbGc6IFwiXCIsXG4gICAgICAgICAgICAgICAgc2NvcGU6IFwiXCIsXG4gICAgICAgICAgICAgICAgc3RhdDogbnVsbCxcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgb2ZmY2hhaW46IHRydWVcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNjb3BlcyAvIFRhYmxlcyBcbiAgICBwdWJsaWMgaGFzU2NvcGVzKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9tYXJrZXRzO1xuICAgIH1cblxuICAgIHB1YmxpYyBtYXJrZXQoc2NvcGU6c3RyaW5nKTogTWFya2V0IHtcbiAgICAgICAgaWYgKHRoaXMuX21hcmtldHNbc2NvcGVdKSByZXR1cm4gdGhpcy5fbWFya2V0c1tzY29wZV07ICAgICAgICAvLyAtLS0+IGRpcmVjdFxuICAgICAgICB2YXIgcmV2ZXJzZSA9IHRoaXMuaW52ZXJzZVNjb3BlKHNjb3BlKTtcbiAgICAgICAgaWYgKHRoaXMuX3JldmVyc2VbcmV2ZXJzZV0pIHJldHVybiB0aGlzLl9yZXZlcnNlW3JldmVyc2VdOyAgLy8gLS0tPiByZXZlcnNlXG4gICAgICAgIGlmICghdGhpcy5fbWFya2V0c1tyZXZlcnNlXSkgcmV0dXJuIG51bGw7ICAgICAgICAgICAgICAgICAgICAvLyAtLS0+IHRhYmxlIGRvZXMgbm90IGV4aXN0IChvciBoYXMgbm90IGJlZW4gbG9hZGVkIHlldClcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcmtldHNbc2NvcGVdIHx8IHRoaXMucmV2ZXJzZShzY29wZSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRhYmxlKHNjb3BlOnN0cmluZyk6IE1hcmtldCB7XG4gICAgICAgIC8vY29uc29sZS5lcnJvcihcInRhYmxlKFwiK3Njb3BlK1wiKSBERVBSRUNBVEVEXCIpO1xuICAgICAgICByZXR1cm4gdGhpcy5tYXJrZXQoc2NvcGUpO1xuICAgIH0gICAgXG5cbiAgICBwcml2YXRlIHJldmVyc2Uoc2NvcGU6c3RyaW5nKTogTWFya2V0IHtcbiAgICAgICAgdmFyIGNhbm9uaWNhbCA9IHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpO1xuICAgICAgICB2YXIgcmV2ZXJzZV9zY29wZSA9IHRoaXMuaW52ZXJzZVNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGNhbm9uaWNhbCAhPSByZXZlcnNlX3Njb3BlLCBcIkVSUk9SOiBcIiwgY2Fub25pY2FsLCByZXZlcnNlX3Njb3BlKTtcbiAgICAgICAgdmFyIHJldmVyc2VfdGFibGU6TWFya2V0ID0gdGhpcy5fcmV2ZXJzZVtyZXZlcnNlX3Njb3BlXTtcbiAgICAgICAgaWYgKCFyZXZlcnNlX3RhYmxlICYmIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSkge1xuICAgICAgICAgICAgdGhpcy5fcmV2ZXJzZVtyZXZlcnNlX3Njb3BlXSA9IHRoaXMuY3JlYXRlUmV2ZXJzZVRhYmxlRm9yKHJldmVyc2Vfc2NvcGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXZlcnNlW3JldmVyc2Vfc2NvcGVdO1xuICAgIH1cblxuICAgIHB1YmxpYyBtYXJrZXRGb3IoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYKTogTWFya2V0IHtcbiAgICAgICAgdmFyIHNjb3BlID0gdGhpcy5nZXRTY29wZUZvcihjb21vZGl0eSwgY3VycmVuY3kpO1xuICAgICAgICByZXR1cm4gdGhpcy50YWJsZShzY29wZSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRhYmxlRm9yKGNvbW9kaXR5OlRva2VuREVYLCBjdXJyZW5jeTpUb2tlbkRFWCk6IE1hcmtldCB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0YWJsZUZvcigpXCIsY29tb2RpdHkuc3ltYm9sLGN1cnJlbmN5LnN5bWJvbCxcIiBERVBSRUNBVEVEXCIpO1xuICAgICAgICByZXR1cm4gdGhpcy5tYXJrZXRGb3IoY29tb2RpdHksIGN1cnJlbmN5KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlUmV2ZXJzZVRhYmxlRm9yKHNjb3BlOnN0cmluZyk6IE1hcmtldCB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIsIHNjb3BlKTtcbiAgICAgICAgdmFyIGNhbm9uaWNhbCA9IHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpO1xuICAgICAgICB2YXIgcmV2ZXJzZV9zY29wZSA9IHRoaXMuaW52ZXJzZVNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgIHZhciB0YWJsZTpNYXJrZXQgPSB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF07XG5cbiAgICAgICAgdmFyIGludmVyc2VfaGlzdG9yeTpIaXN0b3J5VHhbXSA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgaW4gdGFibGUuaGlzdG9yeSkge1xuICAgICAgICAgICAgdmFyIGhUeDpIaXN0b3J5VHggPSB7XG4gICAgICAgICAgICAgICAgaWQ6IHRhYmxlLmhpc3RvcnlbaV0uaWQsXG4gICAgICAgICAgICAgICAgc3RyOiBcIlwiLFxuICAgICAgICAgICAgICAgIHByaWNlOiB0YWJsZS5oaXN0b3J5W2ldLmludmVyc2UuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICBpbnZlcnNlOiB0YWJsZS5oaXN0b3J5W2ldLnByaWNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgYW1vdW50OiB0YWJsZS5oaXN0b3J5W2ldLnBheW1lbnQuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICBwYXltZW50OiB0YWJsZS5oaXN0b3J5W2ldLmFtb3VudC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgIGJ1eWVyOiB0YWJsZS5oaXN0b3J5W2ldLnNlbGxlcixcbiAgICAgICAgICAgICAgICBzZWxsZXI6IHRhYmxlLmhpc3RvcnlbaV0uYnV5ZXIsXG4gICAgICAgICAgICAgICAgYnV5ZmVlOiB0YWJsZS5oaXN0b3J5W2ldLnNlbGxmZWUuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICBzZWxsZmVlOiB0YWJsZS5oaXN0b3J5W2ldLmJ1eWZlZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgIGRhdGU6IHRhYmxlLmhpc3RvcnlbaV0uZGF0ZSxcbiAgICAgICAgICAgICAgICBpc2J1eTogIXRhYmxlLmhpc3RvcnlbaV0uaXNidXksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaFR4LnN0ciA9IGhUeC5wcmljZS5zdHIgKyBcIiBcIiArIGhUeC5hbW91bnQuc3RyO1xuICAgICAgICAgICAgaW52ZXJzZV9oaXN0b3J5LnB1c2goaFR4KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICBcbiAgICAgICAgdmFyIGludmVyc2Vfb3JkZXJzOlRva2VuT3JkZXJzID0ge1xuICAgICAgICAgICAgYnV5OiBbXSwgc2VsbDogW11cbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKHZhciB0eXBlIGluIHtidXk6XCJidXlcIiwgc2VsbDpcInNlbGxcIn0pIHtcbiAgICAgICAgICAgIHZhciByb3dfb3JkZXJzOk9yZGVyW107XG4gICAgICAgICAgICB2YXIgcm93X29yZGVyOk9yZGVyO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRhYmxlLm9yZGVyc1t0eXBlXSkge1xuICAgICAgICAgICAgICAgIHZhciByb3cgPSB0YWJsZS5vcmRlcnNbdHlwZV1baV07XG5cbiAgICAgICAgICAgICAgICByb3dfb3JkZXJzID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaj0wOyBqPHJvdy5vcmRlcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcm93X29yZGVyID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVwb3NpdDogcm93Lm9yZGVyc1tqXS5kZXBvc2l0LmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogcm93Lm9yZGVyc1tqXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2U6IHJvdy5vcmRlcnNbal0ucHJpY2UuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiByb3cub3JkZXJzW2pdLmludmVyc2UuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyOiByb3cub3JkZXJzW2pdLm93bmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVsb3M6IHJvdy5vcmRlcnNbal0udG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogcm93Lm9yZGVyc1tqXS50ZWxvc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJvd19vcmRlcnMucHVzaChyb3dfb3JkZXIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBuZXdyb3c6T3JkZXJSb3cgPSB7XG4gICAgICAgICAgICAgICAgICAgIGludmVyc2U6IHJvdy5wcmljZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnM6IHJvd19vcmRlcnMsXG4gICAgICAgICAgICAgICAgICAgIG93bmVyczogcm93Lm93bmVycyxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHJvdy5pbnZlcnNlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgIHN0cjogcm93LmludmVyc2Uuc3RyLFxuICAgICAgICAgICAgICAgICAgICBzdW06IHJvdy5zdW10ZWxvcy5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICBzdW10ZWxvczogcm93LnN1bS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICB0ZWxvczogcm93LnRvdGFsLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiByb3cudGVsb3MuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgLy8gYW1vdW50OiByb3cuc3VtdGVsb3MudG90YWwoKSwgLy8gPC0tIGV4dHJhXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpbnZlcnNlX29yZGVyc1t0eXBlXS5wdXNoKG5ld3Jvdyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmV2ZXJzZTpNYXJrZXQgPSB7XG4gICAgICAgICAgICBzY29wZTogcmV2ZXJzZV9zY29wZSxcbiAgICAgICAgICAgIGNvbW9kaXR5OiB0YWJsZS5jdXJyZW5jeSxcbiAgICAgICAgICAgIGN1cnJlbmN5OiB0YWJsZS5jb21vZGl0eSxcbiAgICAgICAgICAgIGJsb2NrOiB0YWJsZS5ibG9jayxcbiAgICAgICAgICAgIGJsb2NrbGlzdDogdGFibGUucmV2ZXJzZWJsb2NrcyxcbiAgICAgICAgICAgIHJldmVyc2VibG9ja3M6IHRhYmxlLmJsb2NrbGlzdCxcbiAgICAgICAgICAgIGJsb2NrbGV2ZWxzOiB0YWJsZS5yZXZlcnNlbGV2ZWxzLFxuICAgICAgICAgICAgcmV2ZXJzZWxldmVsczogdGFibGUuYmxvY2tsZXZlbHMsXG4gICAgICAgICAgICBibG9ja3M6IHRhYmxlLmJsb2NrcyxcbiAgICAgICAgICAgIGRlYWxzOiB0YWJsZS5kZWFscyxcbiAgICAgICAgICAgIGhlYWRlcjoge1xuICAgICAgICAgICAgICAgIHNlbGw6IHtcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6dGFibGUuaGVhZGVyLmJ1eS50b3RhbC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnM6dGFibGUuaGVhZGVyLmJ1eS5vcmRlcnNcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJ1eToge1xuICAgICAgICAgICAgICAgICAgICB0b3RhbDp0YWJsZS5oZWFkZXIuc2VsbC50b3RhbC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICBvcmRlcnM6dGFibGUuaGVhZGVyLnNlbGwub3JkZXJzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhpc3Rvcnk6IGludmVyc2VfaGlzdG9yeSxcbiAgICAgICAgICAgIG9yZGVyczoge1xuICAgICAgICAgICAgICAgIHNlbGw6IGludmVyc2Vfb3JkZXJzLmJ1eSwgIC8vIDw8LS0gZXN0byBmdW5jaW9uYSBhc8ODwq0gY29tbyBlc3TDg8KhP1xuICAgICAgICAgICAgICAgIGJ1eTogaW52ZXJzZV9vcmRlcnMuc2VsbCAgIC8vIDw8LS0gZXN0byBmdW5jaW9uYSBhc8ODwq0gY29tbyBlc3TDg8KhP1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1bW1hcnk6IHtcbiAgICAgICAgICAgICAgICBzY29wZTogdGhpcy5pbnZlcnNlU2NvcGUodGFibGUuc3VtbWFyeS5zY29wZSksXG4gICAgICAgICAgICAgICAgcHJpY2U6IHRhYmxlLnN1bW1hcnkuaW52ZXJzZSxcbiAgICAgICAgICAgICAgICBwcmljZV8yNGhfYWdvOiB0YWJsZS5zdW1tYXJ5LmludmVyc2VfMjRoX2FnbyxcbiAgICAgICAgICAgICAgICBpbnZlcnNlOiB0YWJsZS5zdW1tYXJ5LnByaWNlLFxuICAgICAgICAgICAgICAgIGludmVyc2VfMjRoX2FnbzogdGFibGUuc3VtbWFyeS5wcmljZV8yNGhfYWdvLFxuICAgICAgICAgICAgICAgIG1heF9pbnZlcnNlOiB0YWJsZS5zdW1tYXJ5Lm1heF9wcmljZSxcbiAgICAgICAgICAgICAgICBtYXhfcHJpY2U6IHRhYmxlLnN1bW1hcnkubWF4X2ludmVyc2UsXG4gICAgICAgICAgICAgICAgbWluX2ludmVyc2U6IHRhYmxlLnN1bW1hcnkubWluX3ByaWNlLFxuICAgICAgICAgICAgICAgIG1pbl9wcmljZTogdGFibGUuc3VtbWFyeS5taW5faW52ZXJzZSxcbiAgICAgICAgICAgICAgICByZWNvcmRzOiB0YWJsZS5zdW1tYXJ5LnJlY29yZHMsXG4gICAgICAgICAgICAgICAgdm9sdW1lOiB0YWJsZS5zdW1tYXJ5LmFtb3VudCxcbiAgICAgICAgICAgICAgICBhbW91bnQ6IHRhYmxlLnN1bW1hcnkudm9sdW1lLFxuICAgICAgICAgICAgICAgIHBlcmNlbnQ6IHRhYmxlLnN1bW1hcnkuaXBlcmNlbnQsXG4gICAgICAgICAgICAgICAgaXBlcmNlbnQ6IHRhYmxlLnN1bW1hcnkucGVyY2VudCxcbiAgICAgICAgICAgICAgICBwZXJjZW50X3N0cjogdGFibGUuc3VtbWFyeS5pcGVyY2VudF9zdHIsXG4gICAgICAgICAgICAgICAgaXBlcmNlbnRfc3RyOiB0YWJsZS5zdW1tYXJ5LnBlcmNlbnRfc3RyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR4OiB0YWJsZS50eFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXZlcnNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTY29wZUZvcihjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgpIHtcbiAgICAgICAgaWYgKCFjb21vZGl0eSB8fCAhY3VycmVuY3kpIHJldHVybiBcIlwiO1xuICAgICAgICByZXR1cm4gY29tb2RpdHkuc3ltYm9sLnRvTG93ZXJDYXNlKCkgKyBcIi5cIiArIGN1cnJlbmN5LnN5bWJvbC50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbnZlcnNlU2NvcGUoc2NvcGU6c3RyaW5nKSB7XG4gICAgICAgIGlmICghc2NvcGUpIHJldHVybiBzY29wZTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQodHlwZW9mIHNjb3BlID09XCJzdHJpbmdcIiwgXCJFUlJPUjogc3RyaW5nIHNjb3BlIGV4cGVjdGVkLCBnb3QgXCIsIHR5cGVvZiBzY29wZSwgc2NvcGUpO1xuICAgICAgICB2YXIgcGFydHMgPSBzY29wZS5zcGxpdChcIi5cIik7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KHBhcnRzLmxlbmd0aCA9PSAyLCBcIkVSUk9SOiBzY29wZSBmb3JtYXQgZXhwZWN0ZWQgaXMgeHh4Lnl5eSwgZ290OiBcIiwgdHlwZW9mIHNjb3BlLCBzY29wZSk7XG4gICAgICAgIHZhciBpbnZlcnNlID0gcGFydHNbMV0gKyBcIi5cIiArIHBhcnRzWzBdO1xuICAgICAgICByZXR1cm4gaW52ZXJzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2Fub25pY2FsU2NvcGUoc2NvcGU6c3RyaW5nKSB7XG4gICAgICAgIGlmICghc2NvcGUpIHJldHVybiBzY29wZTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQodHlwZW9mIHNjb3BlID09XCJzdHJpbmdcIiwgXCJFUlJPUjogc3RyaW5nIHNjb3BlIGV4cGVjdGVkLCBnb3QgXCIsIHR5cGVvZiBzY29wZSwgc2NvcGUpO1xuICAgICAgICB2YXIgcGFydHMgPSBzY29wZS5zcGxpdChcIi5cIik7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KHBhcnRzLmxlbmd0aCA9PSAyLCBcIkVSUk9SOiBzY29wZSBmb3JtYXQgZXhwZWN0ZWQgaXMgeHh4Lnl5eSwgZ290OiBcIiwgdHlwZW9mIHNjb3BlLCBzY29wZSk7XG4gICAgICAgIHZhciBpbnZlcnNlID0gcGFydHNbMV0gKyBcIi5cIiArIHBhcnRzWzBdO1xuICAgICAgICBpZiAocGFydHNbMV0gPT0gXCJ0bG9zXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBzY29wZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFydHNbMF0gPT0gXCJ0bG9zXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnZlcnNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJ0c1swXSA8IHBhcnRzWzFdKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NvcGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaW52ZXJzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcblxuICAgIHB1YmxpYyBpc0Nhbm9uaWNhbChzY29wZTpzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpID09IHNjb3BlO1xuICAgIH1cblxuICAgIFxuICAgIFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gR2V0dGVycyBcblxuICAgIGdldEJhbGFuY2UodG9rZW46VG9rZW5ERVgpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmJhbGFuY2VzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5iYWxhbmNlc1tpXS50b2tlbi5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFsYW5jZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBBc3NldERFWChcIjAgXCIgKyB0b2tlbi5zeW1ib2wsIHRoaXMpO1xuICAgIH1cblxuICAgIGFzeW5jIGdldFNvbWVGcmVlRmFrZVRva2VucyhzeW1ib2w6c3RyaW5nID0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5nZXRTb21lRnJlZUZha2VUb2tlbnMoKVwiKTtcbiAgICAgICAgdmFyIF90b2tlbiA9IHN5bWJvbDsgICAgXG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZnJlZWZha2UtXCIrX3Rva2VuIHx8IFwidG9rZW5cIiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRUb2tlblN0YXRzLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgdmFyIGNvdW50cyA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8MTAwOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRva2Vuc1tpXS5zeW1ib2wgPT0gc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgIHZhciByYW5kb20gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGksIFwiUmFuZG9tOiBcIiwgcmFuZG9tKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRva2VuICYmIHJhbmRvbSA+IDAuNSkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG9rZW5zW2kgJSB0aGlzLnRva2Vucy5sZW5ndGhdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4uZmFrZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZG9tID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyYW5kb20gPiAwLjUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudGVsb3M7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaTwxMDAgJiYgdG9rZW4gJiYgdGhpcy5nZXRCYWxhbmNlKHRva2VuKS5hbW91bnQudG9OdW1iZXIoKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGksIFwidG9rZW46IFwiLCB0b2tlbik7XG5cbiAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmFuZG9tID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vbnRvID0gTWF0aC5mbG9vcigxMDAwMCAqIHJhbmRvbSkgLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBxdWFudGl0eSA9IG5ldyBBc3NldERFWChcIlwiICsgbW9udG8gKyBcIiBcIiArIHRva2VuLnN5bWJvbCAsdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtZW1vID0gXCJ5b3UgZ2V0IFwiICsgcXVhbnRpdHkudmFsdWVUb1N0cmluZygpKyBcIiBmcmVlIGZha2UgXCIgKyB0b2tlbi5zeW1ib2wgKyBcIiB0b2tlbnMgdG8gcGxheSBvbiB2YXBhZWUuaW8gREVYXCI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmV4Y2VjdXRlKFwiaXNzdWVcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG86ICB0aGlzLnNjYXR0ZXIuYWNjb3VudC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IHF1YW50aXR5LnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vOiBtZW1vXG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldEJhbGFuY2VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImZyZWVmYWtlLVwiK190b2tlbiB8fCBcInRva2VuXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtZW1vO1xuICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZnJlZWZha2UtXCIrX3Rva2VuIHx8IFwidG9rZW5cIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBnZXRUb2tlbk5vdyhzeW06c3RyaW5nKTogVG9rZW5ERVgge1xuICAgICAgICBpZiAoIXN5bSkgcmV0dXJuIG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy50b2tlbnMpIHtcbiAgICAgICAgICAgIC8vIHRoZXJlJ3MgYSBsaXR0bGUgYnVnLiBUaGlzIGlzIGEganVzdGEgIHdvcmsgYXJyb3VuZFxuICAgICAgICAgICAgaWYgKHRoaXMudG9rZW5zW2ldLnN5bWJvbC50b1VwcGVyQ2FzZSgpID09IFwiVExPU1wiICYmIHRoaXMudG9rZW5zW2ldLm9mZmNoYWluKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBzb2x2ZXMgYXR0YWNoaW5nIHdyb25nIHRsb3MgdG9rZW4gdG8gYXNzZXRcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0aGlzLnRva2Vuc1tpXS5zeW1ib2wudG9VcHBlckNhc2UoKSA9PSBzeW0udG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRUb2tlbihzeW06c3RyaW5nKTogUHJvbWlzZTxUb2tlbkRFWD4ge1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRUb2tlbk5vdyhzeW0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXREZXBvc2l0cyhhY2NvdW50OnN0cmluZyA9IG51bGwpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5nZXREZXBvc2l0cygpXCIpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImRlcG9zaXRzXCIsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgZGVwb3NpdHM6IEFzc2V0REVYW10gPSBbXTtcbiAgICAgICAgICAgIGlmICghYWNjb3VudCAmJiB0aGlzLmN1cnJlbnQubmFtZSkge1xuICAgICAgICAgICAgICAgIGFjY291bnQgPSB0aGlzLmN1cnJlbnQubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhY2NvdW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGF3YWl0IHRoaXMuZmV0Y2hEZXBvc2l0cyhhY2NvdW50KTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHJlc3VsdC5yb3dzKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlcG9zaXRzLnB1c2gobmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmFtb3VudCwgdGhpcykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGVwb3NpdHMgPSBkZXBvc2l0cztcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiZGVwb3NpdHNcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVwb3NpdHM7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGdldEJhbGFuY2VzKGFjY291bnQ6c3RyaW5nID0gbnVsbCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldEJhbGFuY2VzKClcIik7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYmFsYW5jZXNcIiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciBfYmFsYW5jZXM6IEFzc2V0REVYW107XG4gICAgICAgICAgICBpZiAoIWFjY291bnQgJiYgdGhpcy5jdXJyZW50Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICBhY2NvdW50ID0gdGhpcy5jdXJyZW50Lm5hbWU7XG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoYWNjb3VudCkge1xuICAgICAgICAgICAgICAgIF9iYWxhbmNlcyA9IGF3YWl0IHRoaXMuZmV0Y2hCYWxhbmNlcyhhY2NvdW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYmFsYW5jZXMgPSBfYmFsYW5jZXM7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZURFWCBiYWxhbmNlcyB1cGRhdGVkXCIpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJiYWxhbmNlc1wiLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5iYWxhbmNlcztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0VGhpc1NlbGxPcmRlcnModGFibGU6c3RyaW5nLCBpZHM6bnVtYmVyW10pOiBQcm9taXNlPGFueVtdPiB7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidGhpc29yZGVyc1wiLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBpZHMpIHtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBpZHNbaV07XG4gICAgICAgICAgICAgICAgdmFyIGdvdGl0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdFtqXS5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ290aXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGdvdGl0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcmVzOlRhYmxlUmVzdWx0ID0gYXdhaXQgdGhpcy5mZXRjaE9yZGVycyh7c2NvcGU6dGFibGUsIGxpbWl0OjEsIGxvd2VyX2JvdW5kOmlkLnRvU3RyaW5nKCl9KTtcblxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQocmVzLnJvd3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ0aGlzb3JkZXJzXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pOyAgICBcbiAgICB9XG5cbiAgICBhc3luYyBnZXRVc2VyT3JkZXJzKGFjY291bnQ6c3RyaW5nID0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZURFWC5nZXRVc2VyT3JkZXJzKClcIik7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidXNlcm9yZGVyc1wiLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIHVzZXJvcmRlcnM6IFRhYmxlUmVzdWx0O1xuICAgICAgICAgICAgaWYgKCFhY2NvdW50ICYmIHRoaXMuY3VycmVudC5uYW1lKSB7XG4gICAgICAgICAgICAgICAgYWNjb3VudCA9IHRoaXMuY3VycmVudC5uYW1lO1xuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGFjY291bnQpIHtcbiAgICAgICAgICAgICAgICB1c2Vyb3JkZXJzID0gYXdhaXQgdGhpcy5mZXRjaFVzZXJPcmRlcnMoYWNjb3VudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbGlzdDogVXNlck9yZGVyc1tdID0gPFVzZXJPcmRlcnNbXT51c2Vyb3JkZXJzLnJvd3M7XG4gICAgICAgICAgICB2YXIgbWFwOiBVc2VyT3JkZXJzTWFwID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8bGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpZHMgPSBsaXN0W2ldLmlkcztcbiAgICAgICAgICAgICAgICB2YXIgdGFibGUgPSBsaXN0W2ldLnRhYmxlO1xuICAgICAgICAgICAgICAgIHZhciBvcmRlcnMgPSBhd2FpdCB0aGlzLmdldFRoaXNTZWxsT3JkZXJzKHRhYmxlLCBpZHMpO1xuICAgICAgICAgICAgICAgIG1hcFt0YWJsZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlOiB0YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiB0aGlzLmF1eFByb2Nlc3NSb3dzVG9PcmRlcnMob3JkZXJzKSxcbiAgICAgICAgICAgICAgICAgICAgaWRzOmlkc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnVzZXJvcmRlcnMgPSBtYXA7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnVzZXJvcmRlcnMpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ1c2Vyb3JkZXJzXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZXJvcmRlcnM7XG4gICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZUFjdGl2aXR5KCkge1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImFjdGl2aXR5XCIsIHRydWUpO1xuICAgICAgICB2YXIgcGFnZXNpemUgPSB0aGlzLmFjdGl2aXR5UGFnZXNpemU7XG4gICAgICAgIHZhciBwYWdlcyA9IGF3YWl0IHRoaXMuZ2V0QWN0aXZpdHlUb3RhbFBhZ2VzKHBhZ2VzaXplKTtcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGhpcy5mZXRjaEFjdGl2aXR5KHBhZ2VzLTIsIHBhZ2VzaXplKSxcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hBY3Rpdml0eShwYWdlcy0xLCBwYWdlc2l6ZSksXG4gICAgICAgICAgICB0aGlzLmZldGNoQWN0aXZpdHkocGFnZXMtMCwgcGFnZXNpemUpXG4gICAgICAgIF0pO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImFjdGl2aXR5XCIsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkTW9yZUFjdGl2aXR5KCkge1xuICAgICAgICBpZiAodGhpcy5hY3Rpdml0eS5saXN0Lmxlbmd0aCA9PSAwKSByZXR1cm47XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYWN0aXZpdHlcIiwgdHJ1ZSk7XG4gICAgICAgIHZhciBwYWdlc2l6ZSA9IHRoaXMuYWN0aXZpdHlQYWdlc2l6ZTtcbiAgICAgICAgdmFyIGZpcnN0ID0gdGhpcy5hY3Rpdml0eS5saXN0W3RoaXMuYWN0aXZpdHkubGlzdC5sZW5ndGgtMV07XG4gICAgICAgIHZhciBpZCA9IGZpcnN0LmlkIC0gcGFnZXNpemU7XG4gICAgICAgIHZhciBwYWdlID0gTWF0aC5mbG9vcigoaWQtMSkgLyBwYWdlc2l6ZSk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5mZXRjaEFjdGl2aXR5KHBhZ2UsIHBhZ2VzaXplKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJhY3Rpdml0eVwiLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlVHJhZGUoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYLCB1cGRhdGVVc2VyOmJvb2xlYW4gPSB0cnVlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVgudXBkYXRlVHJhZGUoKVwiKTtcbiAgICAgICAgdmFyIGNocm9ub19rZXkgPSBcInVwZGF0ZVRyYWRlXCI7XG4gICAgICAgIHRoaXMuZmVlZC5zdGFydENocm9ubyhjaHJvbm9fa2V5KTtcblxuICAgICAgICBpZih1cGRhdGVVc2VyKSB0aGlzLnVwZGF0ZUN1cnJlbnRVc2VyKCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0aGlzLmdldFRyYW5zYWN0aW9uSGlzdG9yeShjb21vZGl0eSwgY3VycmVuY3ksIC0xLCAtMSwgdHJ1ZSkudGhlbihfID0+IHRoaXMuZmVlZC5zZXRNYXJjayhjaHJvbm9fa2V5LCBcImdldFRyYW5zYWN0aW9uSGlzdG9yeSgpXCIpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0QmxvY2tIaXN0b3J5KGNvbW9kaXR5LCBjdXJyZW5jeSwgLTEsIC0xLCB0cnVlKS50aGVuKF8gPT4gdGhpcy5mZWVkLnNldE1hcmNrKGNocm9ub19rZXksIFwiZ2V0QmxvY2tIaXN0b3J5KClcIikpLFxuICAgICAgICAgICAgdGhpcy5nZXRTZWxsT3JkZXJzKGNvbW9kaXR5LCBjdXJyZW5jeSwgdHJ1ZSkudGhlbihfID0+IHRoaXMuZmVlZC5zZXRNYXJjayhjaHJvbm9fa2V5LCBcImdldFNlbGxPcmRlcnMoKVwiKSksXG4gICAgICAgICAgICB0aGlzLmdldEJ1eU9yZGVycyhjb21vZGl0eSwgY3VycmVuY3ksIHRydWUpLnRoZW4oXyA9PiB0aGlzLmZlZWQuc2V0TWFyY2soY2hyb25vX2tleSwgXCJnZXRCdXlPcmRlcnMoKVwiKSksXG4gICAgICAgICAgICB0aGlzLmdldFRhYmxlU3VtbWFyeShjb21vZGl0eSwgY3VycmVuY3ksIHRydWUpLnRoZW4oXyA9PiB0aGlzLmZlZWQuc2V0TWFyY2soY2hyb25vX2tleSwgXCJnZXRUYWJsZVN1bW1hcnkoKVwiKSksXG4gICAgICAgICAgICB0aGlzLmdldE9yZGVyU3VtbWFyeSgpLnRoZW4oXyA9PiB0aGlzLmZlZWQuc2V0TWFyY2soY2hyb25vX2tleSwgXCJnZXRPcmRlclN1bW1hcnkoKVwiKSksXG4gICAgICAgIF0pLnRoZW4ociA9PiB7XG4gICAgICAgICAgICB0aGlzLl9yZXZlcnNlID0ge307XG4gICAgICAgICAgICB0aGlzLnJlc29ydFRva2VucygpO1xuICAgICAgICAgICAgLy8gdGhpcy5mZWVkLnByaW50Q2hyb25vKGNocm9ub19rZXkpO1xuICAgICAgICAgICAgdGhpcy5vblRyYWRlVXBkYXRlZC5uZXh0KG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZUN1cnJlbnRVc2VyKCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLnVwZGF0ZUN1cnJlbnRVc2VyKClcIik7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY3VycmVudFwiLCB0cnVlKTsgICAgICAgIFxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGhpcy5nZXRVc2VyT3JkZXJzKCksXG4gICAgICAgICAgICB0aGlzLmdldERlcG9zaXRzKCksXG4gICAgICAgICAgICB0aGlzLmdldEJhbGFuY2VzKClcbiAgICAgICAgXSkudGhlbihfID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY3VycmVudFwiLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gXztcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImN1cnJlbnRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRCbG9ja0hpc3RvcnlUb3RhbFBhZ2VzRm9yKHNjb3BlOnN0cmluZywgcGFnZXNpemU6IG51bWJlcikge1xuICAgICAgICBpZiAoIXRoaXMuX21hcmtldHMpIHJldHVybiAwO1xuICAgICAgICB2YXIgbWFya2V0ID0gdGhpcy5tYXJrZXQoc2NvcGUpO1xuICAgICAgICBpZiAoIW1hcmtldCkgcmV0dXJuIDA7XG4gICAgICAgIHZhciB0b3RhbCA9IG1hcmtldC5ibG9ja3M7XG4gICAgICAgIHZhciBtb2QgPSB0b3RhbCAlIHBhZ2VzaXplO1xuICAgICAgICB2YXIgZGlmID0gdG90YWwgLSBtb2Q7XG4gICAgICAgIHZhciBwYWdlcyA9IGRpZiAvIHBhZ2VzaXplO1xuICAgICAgICBpZiAobW9kID4gMCkge1xuICAgICAgICAgICAgcGFnZXMgKz0xO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZ2V0QmxvY2tIaXN0b3J5VG90YWxQYWdlc0ZvcigpIHRvdGFsOlwiLCB0b3RhbCwgXCIgcGFnZXM6XCIsIHBhZ2VzKTtcbiAgICAgICAgcmV0dXJuIHBhZ2VzO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SGlzdG9yeVRvdGFsUGFnZXNGb3Ioc2NvcGU6c3RyaW5nLCBwYWdlc2l6ZTogbnVtYmVyKSB7XG4gICAgICAgIGlmICghdGhpcy5fbWFya2V0cykgcmV0dXJuIDA7XG4gICAgICAgIHZhciBtYXJrZXQgPSB0aGlzLm1hcmtldChzY29wZSk7XG4gICAgICAgIGlmICghbWFya2V0KSByZXR1cm4gMDtcbiAgICAgICAgdmFyIHRvdGFsID0gbWFya2V0LmRlYWxzO1xuICAgICAgICB2YXIgbW9kID0gdG90YWwgJSBwYWdlc2l6ZTtcbiAgICAgICAgdmFyIGRpZiA9IHRvdGFsIC0gbW9kO1xuICAgICAgICB2YXIgcGFnZXMgPSBkaWYgLyBwYWdlc2l6ZTtcbiAgICAgICAgaWYgKG1vZCA+IDApIHtcbiAgICAgICAgICAgIHBhZ2VzICs9MTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFnZXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRBY3Rpdml0eVRvdGFsUGFnZXMocGFnZXNpemU6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcImV2ZW50c1wiLCB7XG4gICAgICAgICAgICBsaW1pdDogMVxuICAgICAgICB9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gcmVzdWx0LnJvd3NbMF0ucGFyYW1zO1xuICAgICAgICAgICAgdmFyIHRvdGFsID0gcGFyc2VJbnQocGFyYW1zLnNwbGl0KFwiIFwiKVswXSktMTtcbiAgICAgICAgICAgIHZhciBtb2QgPSB0b3RhbCAlIHBhZ2VzaXplO1xuICAgICAgICAgICAgdmFyIGRpZiA9IHRvdGFsIC0gbW9kO1xuICAgICAgICAgICAgdmFyIHBhZ2VzID0gZGlmIC8gcGFnZXNpemU7XG4gICAgICAgICAgICBpZiAobW9kID4gMCkge1xuICAgICAgICAgICAgICAgIHBhZ2VzICs9MTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdHkudG90YWwgPSB0b3RhbDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldEFjdGl2aXR5VG90YWxQYWdlcygpIHRvdGFsOiBcIiwgdG90YWwsIFwiIHBhZ2VzOiBcIiwgcGFnZXMpO1xuICAgICAgICAgICAgcmV0dXJuIHBhZ2VzO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRUcmFuc2FjdGlvbkhpc3RvcnkoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYLCBwYWdlOm51bWJlciA9IC0xLCBwYWdlc2l6ZTpudW1iZXIgPSAtMSwgZm9yY2U6Ym9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgdmFyIHNjb3BlOnN0cmluZyA9IHRoaXMuY2Fub25pY2FsU2NvcGUodGhpcy5nZXRTY29wZUZvcihjb21vZGl0eSwgY3VycmVuY3kpKTtcbiAgICAgICAgdmFyIGF1eCA9IG51bGw7XG4gICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImhpc3RvcnkuXCIrc2NvcGUsIHRydWUpO1xuICAgICAgICBhdXggPSB0aGlzLndhaXRPcmRlclN1bW1hcnkudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIGlmIChwYWdlc2l6ZSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIHBhZ2VzaXplID0gMTA7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhZ2UgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLmdldEhpc3RvcnlUb3RhbFBhZ2VzRm9yKHNjb3BlLCBwYWdlc2l6ZSk7XG4gICAgICAgICAgICAgICAgcGFnZSA9IHBhZ2VzLTM7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UgPCAwKSBwYWdlID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoSGlzdG9yeShzY29wZSwgcGFnZSswLCBwYWdlc2l6ZSksXG4gICAgICAgICAgICAgICAgdGhpcy5mZXRjaEhpc3Rvcnkoc2NvcGUsIHBhZ2UrMSwgcGFnZXNpemUpLFxuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hIaXN0b3J5KHNjb3BlLCBwYWdlKzIsIHBhZ2VzaXplKVxuICAgICAgICAgICAgXSkudGhlbihfID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImhpc3RvcnkuXCIrc2NvcGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXJrZXQoc2NvcGUpLmhpc3Rvcnk7XG4gICAgICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImhpc3RvcnkuXCIrc2NvcGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLm1hcmtldChzY29wZSkgJiYgIWZvcmNlKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLm1hcmtldChzY29wZSkuaGlzdG9yeTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGF1eDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub25IaXN0b3J5Q2hhbmdlLm5leHQocmVzdWx0KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgYXV4SG91clRvTGFiZWwoaG91cjpudW1iZXIpOiBzdHJpbmcge1xuICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKGhvdXIgKiAxMDAwICogNjAgKiA2MCk7XG4gICAgICAgIHZhciBsYWJlbCA9IGQuZ2V0SG91cnMoKSA9PSAwID8gdGhpcy5kYXRlUGlwZS50cmFuc2Zvcm0oZCwgJ2RkL01NJykgOiBkLmdldEhvdXJzKCkgKyBcImhcIjtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBsYWJlbDtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRCbG9ja0hpc3RvcnkoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYLCBwYWdlOm51bWJlciA9IC0xLCBwYWdlc2l6ZTpudW1iZXIgPSAtMSwgZm9yY2U6Ym9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWVERVguZ2V0QmxvY2tIaXN0b3J5KClcIiwgY29tb2RpdHkuc3ltYm9sLCBwYWdlLCBwYWdlc2l6ZSk7XG4gICAgICAgIC8vIC8vIGVsYXBzZWQgdGltZVxuICAgICAgICAvLyB2YXIgc3RhcnRUaW1lOkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAvLyB2YXIgZGlmZjpudW1iZXI7XG4gICAgICAgIC8vIHZhciBzZWM6bnVtYmVyO1xuXG4gICAgICAgIHZhciBzY29wZTpzdHJpbmcgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHRoaXMuZ2V0U2NvcGVGb3IoY29tb2RpdHksIGN1cnJlbmN5KSk7XG4gICAgICAgIHZhciBhdXggPSBudWxsO1xuICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJibG9jay1oaXN0b3J5LlwiK3Njb3BlLCB0cnVlKTtcblxuICAgICAgICBhdXggPSB0aGlzLndhaXRPcmRlclN1bW1hcnkudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciBmZXRjaEJsb2NrSGlzdG9yeVN0YXJ0OkRhdGUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgICAgICBpZiAocGFnZXNpemUgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBwYWdlc2l6ZSA9IDEwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhZ2UgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLmdldEJsb2NrSGlzdG9yeVRvdGFsUGFnZXNGb3Ioc2NvcGUsIHBhZ2VzaXplKTtcbiAgICAgICAgICAgICAgICBwYWdlID0gcGFnZXMtMztcbiAgICAgICAgICAgICAgICBpZiAocGFnZSA8IDApIHBhZ2UgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHByb21pc2VzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8PXBhZ2VzOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IHRoaXMuZmV0Y2hCbG9ja0hpc3Rvcnkoc2NvcGUsIGksIHBhZ2VzaXplKTtcbiAgICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICAgICAgLy8gLy8gZWxhcHNlZCB0aW1lXG4gICAgICAgICAgICAgICAgLy8gdmFyIGZldGNoQmxvY2tIaXN0b3J5VGltZTpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAvLyBkaWZmID0gZmV0Y2hCbG9ja0hpc3RvcnlUaW1lLmdldFRpbWUoKSAtIGZldGNoQmxvY2tIaXN0b3J5U3RhcnQuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIC8vIHNlYyA9IGRpZmYgLyAxMDAwO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKiogVmFwYWVlREVYLmdldEJsb2NrSGlzdG9yeSgpIGZldGNoQmxvY2tIaXN0b3J5VGltZSBzZWM6IFwiLCBzZWMsIFwiKFwiLGRpZmYsXCIpXCIpO1xuXG5cbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJsb2NrLWhpc3RvcnkuXCIrc2NvcGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB2YXIgbWFya2V0OiBNYXJrZXQgPSB0aGlzLm1hcmtldChzY29wZSk7XG4gICAgICAgICAgICAgICAgbWFya2V0LmJsb2NrbGlzdCA9IFtdO1xuICAgICAgICAgICAgICAgIG1hcmtldC5yZXZlcnNlYmxvY2tzID0gW107XG4gICAgICAgICAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgdmFyIGhvcmEgPSAxMDAwICogNjAgKiA2MDtcbiAgICAgICAgICAgICAgICB2YXIgaG91ciA9IE1hdGguZmxvb3Iobm93LmdldFRpbWUoKS9ob3JhKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0+XCIsIGhvdXIpO1xuICAgICAgICAgICAgICAgIHZhciBsYXN0X2Jsb2NrID0gbnVsbDtcbiAgICAgICAgICAgICAgICB2YXIgbGFzdF9ob3VyID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIHZhciBvcmRlcmVkX2Jsb2NrcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gbWFya2V0LmJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgIG9yZGVyZWRfYmxvY2tzLnB1c2gobWFya2V0LmJsb2NrW2ldKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBvcmRlcmVkX2Jsb2Nrcy5zb3J0KGZ1bmN0aW9uKGE6SGlzdG9yeUJsb2NrLCBiOkhpc3RvcnlCbG9jaykge1xuICAgICAgICAgICAgICAgICAgICBpZihhLmhvdXIgPCBiLmhvdXIpIHJldHVybiAtMTE7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH0pO1xuXG5cblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gb3JkZXJlZF9ibG9ja3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJsb2NrOkhpc3RvcnlCbG9jayA9IG9yZGVyZWRfYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLmF1eEhvdXJUb0xhYmVsKGJsb2NrLmhvdXIpO1xuICAgICAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0+XCIsIGksIGxhYmVsLCBibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRlID0gYmxvY2suZGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpZiA9IG5vdy5nZXRUaW1lKCkgLSBibG9jay5kYXRlLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lcyA9IDMwICogMjQgKiBob3JhO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWxhcHNlZF9tb250aHMgPSBkaWYgLyBtZXM7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGFwc2VkX21vbnRocyA+IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZHJvcHBpbmcgYmxvY2sgdG9vIG9sZFwiLCBbYmxvY2ssIGJsb2NrLmRhdGUudG9VVENTdHJpbmcoKV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdF9ibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpZiA9IGJsb2NrLmhvdXIgLSBsYXN0X2Jsb2NrLmhvdXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqPTE7IGo8ZGlmOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWxfaSA9IHRoaXMuYXV4SG91clRvTGFiZWwobGFzdF9ibG9jay5ob3VyK2opO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0+XCIsIGosIGxhYmVsX2ksIGJsb2NrKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbmluaWNhbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlID0gbGFzdF9ibG9jay5wcmljZS5hbW91bnQudG9OdW1iZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXV4ID0gW2xhYmVsX2ksIHByaWNlLCBwcmljZSwgcHJpY2UsIHByaWNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXQuYmxvY2tsaXN0LnB1c2goYXV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXZlcnNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW52ZXJzZSA9IGxhc3RfYmxvY2suaW52ZXJzZS5hbW91bnQudG9OdW1iZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXV4ID0gW2xhYmVsX2ksIGludmVyc2UsIGludmVyc2UsIGludmVyc2UsIGludmVyc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtldC5yZXZlcnNlYmxvY2tzLnB1c2goYXV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqOmFueVtdO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25pbmljYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICBvYmogPSBbbGFiZWxdO1xuICAgICAgICAgICAgICAgICAgICBvYmoucHVzaChibG9jay5tYXguYW1vdW50LnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICBvYmoucHVzaChibG9jay5lbnRyYW5jZS5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG9iai5wdXNoKGJsb2NrLnByaWNlLmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goYmxvY2subWluLmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2V0LmJsb2NrbGlzdC5wdXNoKG9iaik7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJldmVyc2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICBvYmogPSBbbGFiZWxdO1xuICAgICAgICAgICAgICAgICAgICBvYmoucHVzaCgxLjAvYmxvY2subWF4LmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goMS4wL2Jsb2NrLmVudHJhbmNlLmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goMS4wL2Jsb2NrLnByaWNlLmFtb3VudC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnB1c2goMS4wL2Jsb2NrLm1pbi5hbW91bnQudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtldC5yZXZlcnNlYmxvY2tzLnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgICAgICAgbGFzdF9ibG9jayA9IGJsb2NrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChsYXN0X2Jsb2NrICYmIGhvdXIgIT0gbGFzdF9ibG9jay5ob3VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaWYgPSBob3VyIC0gbGFzdF9ibG9jay5ob3VyO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqPTE7IGo8PWRpZjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWxfaSA9IHRoaXMuYXV4SG91clRvTGFiZWwobGFzdF9ibG9jay5ob3VyK2opO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25pbmljYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlID0gbGFzdF9ibG9jay5wcmljZS5hbW91bnQudG9OdW1iZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdXggPSBbbGFiZWxfaSwgcHJpY2UsIHByaWNlLCBwcmljZSwgcHJpY2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2V0LmJsb2NrbGlzdC5wdXNoKGF1eCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJldmVyc2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGludmVyc2UgPSBsYXN0X2Jsb2NrLmludmVyc2UuYW1vdW50LnRvTnVtYmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXV4ID0gW2xhYmVsX2ksIGludmVyc2UsIGludmVyc2UsIGludmVyc2UsIGludmVyc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2V0LnJldmVyc2VibG9ja3MucHVzaChhdXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gLy8gZWxhcHNlZCB0aW1lXG4gICAgICAgICAgICAgICAgLy8gdmFyIGZpcnN0TGV2ZWxUaW1lOkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIC8vIGRpZmYgPSBmaXJzdExldmVsVGltZS5nZXRUaW1lKCkgLSBmZXRjaEJsb2NrSGlzdG9yeVRpbWUuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIC8vIHNlYyA9IGRpZmYgLyAxMDAwO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKiogVmFwYWVlREVYLmdldEJsb2NrSGlzdG9yeSgpIGZpcnN0TGV2ZWxUaW1lIHNlYzogXCIsIHNlYywgXCIoXCIsZGlmZixcIilcIik7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLT5cIiwgbWFya2V0LmJsb2NrbGlzdCk7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5vbkJsb2NrbGlzdENoYW5nZS5uZXh0KG1hcmtldC5ibG9ja2xpc3QpO1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXJrZXQ7XG4gICAgICAgICAgICB9KS50aGVuKG1hcmtldCA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgICAgICAgLy8gLy8gZWxhcHNlZCB0aW1lXG4gICAgICAgICAgICAgICAgLy8gdmFyIGFsbExldmVsc1N0YXJ0OkRhdGUgPSBuZXcgRGF0ZSgpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgbGltaXQgPSAyNTY7XG4gICAgICAgICAgICAgICAgdmFyIGxldmVscyA9IFttYXJrZXQuYmxvY2tsaXN0XTtcbiAgICAgICAgICAgICAgICB2YXIgcmV2ZXJzZXMgPSBbbWFya2V0LnJldmVyc2VibG9ja3NdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGN1cnJlbnQgPSAwOyBsZXZlbHNbY3VycmVudF0ubGVuZ3RoID4gbGltaXQ7IGN1cnJlbnQrKykge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjdXJyZW50ICxsZXZlbHNbY3VycmVudF0ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld2xldmVsOmFueVtdW10gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld3JldmVyc2U6YW55W11bXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWVyZ2VkOmFueVtdID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxsZXZlbHNbY3VycmVudF0ubGVuZ3RoOyBpKz0yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYW5vbmljYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2XzE6YW55W10gPSBsZXZlbHNbY3VycmVudF1baV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdl8yID0gbGV2ZWxzW2N1cnJlbnRdW2krMV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVyZ2VkID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4PTA7IHg8NTsgeCsrKSBtZXJnZWRbeF0gPSB2XzFbeF07IC8vIGNsZWFuIGNvcHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2XzIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbMF0gPSB2XzFbMF0uc3BsaXQoXCIvXCIpLmxlbmd0aCA+IDEgPyB2XzFbMF0gOiB2XzJbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzFdID0gTWF0aC5tYXgodl8xWzFdLCB2XzJbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFsyXSA9IHZfMVsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbM10gPSB2XzJbM107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzRdID0gTWF0aC5taW4odl8xWzRdLCB2XzJbNF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3bGV2ZWwucHVzaChtZXJnZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZXZlcnNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICAgICAgdl8xID0gcmV2ZXJzZXNbY3VycmVudF1baV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2XzIgPSByZXZlcnNlc1tjdXJyZW50XVtpKzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4PTA7IHg8NTsgeCsrKSBtZXJnZWRbeF0gPSB2XzFbeF07IC8vIGNsZWFuIGNvcHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2XzIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbMF0gPSB2XzFbMF0uc3BsaXQoXCIvXCIpLmxlbmd0aCA+IDEgPyB2XzFbMF0gOiB2XzJbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzFdID0gTWF0aC5taW4odl8xWzFdLCB2XzJbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZFsyXSA9IHZfMVsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZWRbM10gPSB2XzJbM107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2VkWzRdID0gTWF0aC5tYXgodl8xWzRdLCB2XzJbNF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld3JldmVyc2UucHVzaChtZXJnZWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV2ZWxzLnB1c2gobmV3bGV2ZWwpO1xuICAgICAgICAgICAgICAgICAgICByZXZlcnNlcy5wdXNoKG5ld3JldmVyc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgIG1hcmtldC5ibG9ja2xldmVscyA9IGxldmVscztcbiAgICAgICAgICAgICAgICBtYXJrZXQucmV2ZXJzZWxldmVscyA9IHJldmVyc2VzO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIC8vIG1hcmtldC5ibG9ja2xldmVscyA9IFttYXJrZXQuYmxvY2tsaXN0XTtcbiAgICAgICAgICAgICAgICAvLyBtYXJrZXQucmV2ZXJzZWxldmVscyA9IFttYXJrZXQucmV2ZXJzZWJsb2Nrc107XG4gICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAvLyBlbGFwc2VkIHRpbWVcbiAgICAgICAgICAgICAgICAvLyB2YXIgYWxsTGV2ZWxzVGltZTpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAvLyBkaWZmID0gYWxsTGV2ZWxzVGltZS5nZXRUaW1lKCkgLSBhbGxMZXZlbHNTdGFydC5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgLy8gc2VjID0gZGlmZiAvIDEwMDA7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKiBWYXBhZWVERVguZ2V0QmxvY2tIaXN0b3J5KCkgYWxsTGV2ZWxzVGltZSBzZWM6IFwiLCBzZWMsIFwiKFwiLGRpZmYsXCIpXCIpOyAgIFxuICAgICAgICAgICAgICAgIC8vIC8vIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIsIG1hcmtldC5ibG9ja2xldmVscyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbWFya2V0LmJsb2NrO1xuICAgICAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJibG9jay1oaXN0b3J5LlwiK3Njb3BlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5tYXJrZXQoc2NvcGUpICYmICFmb3JjZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5tYXJrZXQoc2NvcGUpLmJsb2NrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gYXV4O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vbkhpc3RvcnlDaGFuZ2UubmV4dChyZXN1bHQpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0U2VsbE9yZGVycyhjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgsIGZvcmNlOmJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHZhciBzY29wZTpzdHJpbmcgPSB0aGlzLmdldFNjb3BlRm9yKGNvbW9kaXR5LCBjdXJyZW5jeSk7XG4gICAgICAgIHZhciBjYW5vbmljYWw6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgIHZhciByZXZlcnNlOnN0cmluZyA9IHRoaXMuaW52ZXJzZVNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgIHZhciBhdXggPSBudWxsO1xuICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJzZWxsb3JkZXJzXCIsIHRydWUpO1xuICAgICAgICBhdXggPSB0aGlzLndhaXRUb2tlbnNMb2FkZWQudGhlbihhc3luYyBfID0+IHtcbiAgICAgICAgICAgIHZhciBvcmRlcnMgPSBhd2FpdCB0aGlzLmZldGNoT3JkZXJzKHtzY29wZTpjYW5vbmljYWwsIGxpbWl0OjEwMCwgaW5kZXhfcG9zaXRpb246IFwiMlwiLCBrZXlfdHlwZTogXCJpNjRcIn0pO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdID0gdGhpcy5hdXhBc3NlcnRTY29wZShjYW5vbmljYWwpO1xuICAgICAgICAgICAgLy8gaWYoc2NvcGU9PVwidnBlLnRsb3NcIiB8fCBzY29wZT09XCJjbnQudGxvc1wiKWNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cInZwZS50bG9zXCIgfHwgc2NvcGU9PVwiY250LnRsb3NcIiljb25zb2xlLmxvZyhcIlNlbGwgY3J1ZG86XCIsIG9yZGVycyk7XG4gICAgICAgICAgICB2YXIgc2VsbDogT3JkZXJbXSA9IHRoaXMuYXV4UHJvY2Vzc1Jvd3NUb09yZGVycyhvcmRlcnMucm93cyk7XG4gICAgICAgICAgICBzZWxsLnNvcnQoZnVuY3Rpb24oYTpPcmRlciwgYjpPcmRlcikge1xuICAgICAgICAgICAgICAgIGlmKGEucHJpY2UuYW1vdW50LmlzTGVzc1RoYW4oYi5wcmljZS5hbW91bnQpKSByZXR1cm4gLTExO1xuICAgICAgICAgICAgICAgIGlmKGEucHJpY2UuYW1vdW50LmlzR3JlYXRlclRoYW4oYi5wcmljZS5hbW91bnQpKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gaWYoc2NvcGU9PVwidnBlLnRsb3NcIiB8fCBzY29wZT09XCJjbnQudGxvc1wiKWNvbnNvbGUubG9nKFwic29ydGVkOlwiLCBzZWxsKTtcbiAgICAgICAgICAgIC8vIGdyb3VwaW5nIHRvZ2V0aGVyIG9yZGVycyB3aXRoIHRoZSBzYW1lIHByaWNlLlxuICAgICAgICAgICAgdmFyIGxpc3Q6IE9yZGVyUm93W10gPSBbXTtcbiAgICAgICAgICAgIHZhciByb3c6IE9yZGVyUm93O1xuICAgICAgICAgICAgaWYgKHNlbGwubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPHNlbGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9yZGVyOiBPcmRlciA9IHNlbGxbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdyA9IGxpc3RbbGlzdC5sZW5ndGgtMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93LnByaWNlLmFtb3VudC5lcShvcmRlci5wcmljZS5hbW91bnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LnRvdGFsLmFtb3VudCA9IHJvdy50b3RhbC5hbW91bnQucGx1cyhvcmRlci50b3RhbC5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy50ZWxvcy5hbW91bnQgPSByb3cudGVsb3MuYW1vdW50LnBsdXMob3JkZXIudGVsb3MuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cub3duZXJzW29yZGVyLm93bmVyXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93Lm9yZGVycy5wdXNoKG9yZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gICAgXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcm93ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyOiBvcmRlci5wcmljZS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IG9yZGVyLnByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiBvcmRlci50b3RhbC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVsb3M6IG9yZGVyLnRlbG9zLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiBvcmRlci5pbnZlcnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VtOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VtdGVsb3M6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcnM6IHt9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByb3cub3duZXJzW29yZGVyLm93bmVyXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJvdy5vcmRlcnMucHVzaChvcmRlcik7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHN1bSA9IG5ldyBCaWdOdW1iZXIoMCk7XG4gICAgICAgICAgICB2YXIgc3VtdGVsb3MgPSBuZXcgQmlnTnVtYmVyKDApO1xuICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBsaXN0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG9yZGVyX3JvdyA9IGxpc3Rbal07XG4gICAgICAgICAgICAgICAgc3VtdGVsb3MgPSBzdW10ZWxvcy5wbHVzKG9yZGVyX3Jvdy50ZWxvcy5hbW91bnQpO1xuICAgICAgICAgICAgICAgIHN1bSA9IHN1bS5wbHVzKG9yZGVyX3Jvdy50b3RhbC5hbW91bnQpO1xuICAgICAgICAgICAgICAgIG9yZGVyX3Jvdy5zdW10ZWxvcyA9IG5ldyBBc3NldERFWChzdW10ZWxvcywgb3JkZXJfcm93LnRlbG9zLnRva2VuKTtcbiAgICAgICAgICAgICAgICBvcmRlcl9yb3cuc3VtID0gbmV3IEFzc2V0REVYKHN1bSwgb3JkZXJfcm93LnRvdGFsLnRva2VuKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLm9yZGVycy5zZWxsID0gbGlzdDtcbiAgICAgICAgICAgIC8vIGlmKHNjb3BlPT1cInZwZS50bG9zXCIgfHwgc2NvcGU9PVwiY250LnRsb3NcIiljb25zb2xlLmxvZyhcIlNlbGwgZmluYWw6XCIsIHRoaXMuc2NvcGVzW3Njb3BlXS5vcmRlcnMuc2VsbCk7XG4gICAgICAgICAgICAvLyBpZihzY29wZT09XCJ2cGUudGxvc1wiIHx8IHNjb3BlPT1cImNudC50bG9zXCIpY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tXCIpO1xuXG4gICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInNlbGxvcmRlcnNcIiwgZmFsc2UpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5vcmRlcnMuc2VsbDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSAmJiAhZm9yY2UpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5vcmRlcnMuc2VsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGF1eDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBcbiAgICBhc3luYyBnZXRCdXlPcmRlcnMoY29tb2RpdHk6VG9rZW5ERVgsIGN1cnJlbmN5OlRva2VuREVYLCBmb3JjZTpib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB2YXIgc2NvcGU6c3RyaW5nID0gdGhpcy5nZXRTY29wZUZvcihjb21vZGl0eSwgY3VycmVuY3kpO1xuICAgICAgICB2YXIgY2Fub25pY2FsOnN0cmluZyA9IHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpO1xuICAgICAgICB2YXIgcmV2ZXJzZTpzdHJpbmcgPSB0aGlzLmludmVyc2VTY29wZShjYW5vbmljYWwpO1xuXG5cbiAgICAgICAgdmFyIGF1eCA9IG51bGw7XG4gICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJ1eW9yZGVyc1wiLCB0cnVlKTtcbiAgICAgICAgYXV4ID0gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgb3JkZXJzID0gYXdhaXQgYXdhaXQgdGhpcy5mZXRjaE9yZGVycyh7c2NvcGU6cmV2ZXJzZSwgbGltaXQ6NTAsIGluZGV4X3Bvc2l0aW9uOiBcIjJcIiwga2V5X3R5cGU6IFwiaTY0XCJ9KTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSA9IHRoaXMuYXV4QXNzZXJ0U2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQnV5IGNydWRvOlwiLCBvcmRlcnMpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGJ1eTogT3JkZXJbXSA9IHRoaXMuYXV4UHJvY2Vzc1Jvd3NUb09yZGVycyhvcmRlcnMucm93cyk7XG4gICAgICAgICAgICBidXkuc29ydChmdW5jdGlvbihhOk9yZGVyLCBiOk9yZGVyKXtcbiAgICAgICAgICAgICAgICBpZihhLnByaWNlLmFtb3VudC5pc0xlc3NUaGFuKGIucHJpY2UuYW1vdW50KSkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgaWYoYS5wcmljZS5hbW91bnQuaXNHcmVhdGVyVGhhbihiLnByaWNlLmFtb3VudCkpIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImJ1eSBzb3J0ZWFkbzpcIiwgYnV5KTtcblxuICAgICAgICAgICAgLy8gZ3JvdXBpbmcgdG9nZXRoZXIgb3JkZXJzIHdpdGggdGhlIHNhbWUgcHJpY2UuXG4gICAgICAgICAgICB2YXIgbGlzdDogT3JkZXJSb3dbXSA9IFtdO1xuICAgICAgICAgICAgdmFyIHJvdzogT3JkZXJSb3c7XG4gICAgICAgICAgICBpZiAoYnV5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxidXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9yZGVyOiBPcmRlciA9IGJ1eVtpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93ID0gbGlzdFtsaXN0Lmxlbmd0aC0xXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3cucHJpY2UuYW1vdW50LmVxKG9yZGVyLnByaWNlLmFtb3VudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cudG90YWwuYW1vdW50ID0gcm93LnRvdGFsLmFtb3VudC5wbHVzKG9yZGVyLnRvdGFsLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LnRlbG9zLmFtb3VudCA9IHJvdy50ZWxvcy5hbW91bnQucGx1cyhvcmRlci50ZWxvcy5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5vd25lcnNbb3JkZXIub3duZXJdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cub3JkZXJzLnB1c2gob3JkZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByb3cgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHI6IG9yZGVyLnByaWNlLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogb3JkZXIucHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcnM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IG9yZGVyLnRvdGFsLmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWxvczogb3JkZXIudGVsb3MuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmVyc2U6IG9yZGVyLmludmVyc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdW06IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdW10ZWxvczogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyczoge31cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJvdy5vd25lcnNbb3JkZXIub3duZXJdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcm93Lm9yZGVycy5wdXNoKG9yZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuXG4gICAgICAgICAgICB2YXIgc3VtID0gbmV3IEJpZ051bWJlcigwKTtcbiAgICAgICAgICAgIHZhciBzdW10ZWxvcyA9IG5ldyBCaWdOdW1iZXIoMCk7XG4gICAgICAgICAgICBmb3IgKHZhciBqIGluIGxpc3QpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3JkZXJfcm93ID0gbGlzdFtqXTtcbiAgICAgICAgICAgICAgICBzdW10ZWxvcyA9IHN1bXRlbG9zLnBsdXMob3JkZXJfcm93LnRlbG9zLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgc3VtID0gc3VtLnBsdXMob3JkZXJfcm93LnRvdGFsLmFtb3VudCk7XG4gICAgICAgICAgICAgICAgb3JkZXJfcm93LnN1bXRlbG9zID0gbmV3IEFzc2V0REVYKHN1bXRlbG9zLCBvcmRlcl9yb3cudGVsb3MudG9rZW4pO1xuICAgICAgICAgICAgICAgIG9yZGVyX3Jvdy5zdW0gPSBuZXcgQXNzZXRERVgoc3VtLCBvcmRlcl9yb3cudG90YWwudG9rZW4pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0ub3JkZXJzLmJ1eSA9IGxpc3Q7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJ1eSBmaW5hbDpcIiwgdGhpcy5zY29wZXNbc2NvcGVdLm9yZGVycy5idXkpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJidXlvcmRlcnNcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5vcmRlcnMuYnV5O1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5fbWFya2V0c1tjYW5vbmljYWxdICYmICFmb3JjZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLm9yZGVycy5idXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhdXg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgZ2V0T3JkZXJTdW1tYXJ5KCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmdldE9yZGVyU3VtbWFyeSgpXCIpO1xuICAgICAgICB2YXIgdGFibGVzID0gYXdhaXQgdGhpcy5mZXRjaE9yZGVyU3VtbWFyeSgpO1xuXG4gICAgICAgIGZvciAodmFyIGkgaW4gdGFibGVzLnJvd3MpIHtcbiAgICAgICAgICAgIHZhciBzY29wZTpzdHJpbmcgPSB0YWJsZXMucm93c1tpXS50YWJsZTtcbiAgICAgICAgICAgIHZhciBjYW5vbmljYWwgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHNjb3BlID09IGNhbm9uaWNhbCwgXCJFUlJPUjogc2NvcGUgaXMgbm90IGNhbm9uaWNhbFwiLCBzY29wZSwgW2ksIHRhYmxlc10pO1xuICAgICAgICAgICAgdmFyIGNvbW9kaXR5ID0gc2NvcGUuc3BsaXQoXCIuXCIpWzBdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB2YXIgY3VycmVuY3kgPSBzY29wZS5zcGxpdChcIi5cIilbMV0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbc2NvcGVdID0gdGhpcy5hdXhBc3NlcnRTY29wZShzY29wZSk7XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGksIHRhYmxlcy5yb3dzW2ldKTtcblxuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tzY29wZV0uaGVhZGVyLnNlbGwudG90YWwgPSBuZXcgQXNzZXRERVgodGFibGVzLnJvd3NbaV0uc3VwcGx5LnRvdGFsLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbc2NvcGVdLmhlYWRlci5zZWxsLm9yZGVycyA9IHRhYmxlcy5yb3dzW2ldLnN1cHBseS5vcmRlcnM7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW3Njb3BlXS5oZWFkZXIuYnV5LnRvdGFsID0gbmV3IEFzc2V0REVYKHRhYmxlcy5yb3dzW2ldLmRlbWFuZC50b3RhbCwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW3Njb3BlXS5oZWFkZXIuYnV5Lm9yZGVycyA9IHRhYmxlcy5yb3dzW2ldLmRlbWFuZC5vcmRlcnM7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW3Njb3BlXS5kZWFscyA9IHRhYmxlcy5yb3dzW2ldLmRlYWxzO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tzY29wZV0uYmxvY2tzID0gdGFibGVzLnJvd3NbaV0uYmxvY2tzO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNldE9yZGVyU3VtbWFyeSgpO1xuICAgIH1cblxuICAgIGFzeW5jIGdldFRhYmxlU3VtbWFyeShjb21vZGl0eTpUb2tlbkRFWCwgY3VycmVuY3k6VG9rZW5ERVgsIGZvcmNlOmJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8TWFya2V0U3VtbWFyeT4ge1xuICAgICAgICB2YXIgc2NvcGU6c3RyaW5nID0gdGhpcy5nZXRTY29wZUZvcihjb21vZGl0eSwgY3VycmVuY3kpO1xuICAgICAgICB2YXIgY2Fub25pY2FsOnN0cmluZyA9IHRoaXMuY2Fub25pY2FsU2NvcGUoc2NvcGUpO1xuICAgICAgICB2YXIgaW52ZXJzZTpzdHJpbmcgPSB0aGlzLmludmVyc2VTY29wZShjYW5vbmljYWwpO1xuXG4gICAgICAgIHZhciBaRVJPX0NPTU9ESVRZID0gXCIwLjAwMDAwMDAwIFwiICsgY29tb2RpdHkuc3ltYm9sO1xuICAgICAgICB2YXIgWkVST19DVVJSRU5DWSA9IFwiMC4wMDAwMDAwMCBcIiArIGN1cnJlbmN5LnN5bWJvbDtcblxuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInN1bW1hcnkuXCIrY2Fub25pY2FsLCB0cnVlKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJzdW1tYXJ5LlwiK2ludmVyc2UsIHRydWUpO1xuICAgICAgICB2YXIgYXV4ID0gbnVsbDtcbiAgICAgICAgdmFyIHJlc3VsdDpNYXJrZXRTdW1tYXJ5ID0gbnVsbDtcbiAgICAgICAgYXV4ID0gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgc3VtbWFyeSA9IGF3YWl0IHRoaXMuZmV0Y2hTdW1tYXJ5KGNhbm9uaWNhbCk7XG4gICAgICAgICAgICAvLyBpZihzY29wZT09XCJvbGl2ZS50bG9zXCIpY29uc29sZS5sb2coc2NvcGUsIFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgLy8gaWYoc2NvcGU9PVwib2xpdmUudGxvc1wiKWNvbnNvbGUubG9nKFwiU3VtbWFyeSBjcnVkbzpcIiwgc3VtbWFyeS5yb3dzKTtcblxuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdID0gdGhpcy5hdXhBc3NlcnRTY29wZShjYW5vbmljYWwpO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkgPSB7XG4gICAgICAgICAgICAgICAgc2NvcGU6IGNhbm9uaWNhbCxcbiAgICAgICAgICAgICAgICBwcmljZTogbmV3IEFzc2V0REVYKG5ldyBCaWdOdW1iZXIoMCksIGN1cnJlbmN5KSxcbiAgICAgICAgICAgICAgICBwcmljZV8yNGhfYWdvOiBuZXcgQXNzZXRERVgobmV3IEJpZ051bWJlcigwKSwgY3VycmVuY3kpLFxuICAgICAgICAgICAgICAgIGludmVyc2U6IG5ldyBBc3NldERFWChuZXcgQmlnTnVtYmVyKDApLCBjb21vZGl0eSksXG4gICAgICAgICAgICAgICAgaW52ZXJzZV8yNGhfYWdvOiBuZXcgQXNzZXRERVgobmV3IEJpZ051bWJlcigwKSwgY29tb2RpdHkpLFxuICAgICAgICAgICAgICAgIHZvbHVtZTogbmV3IEFzc2V0REVYKG5ldyBCaWdOdW1iZXIoMCksIGN1cnJlbmN5KSxcbiAgICAgICAgICAgICAgICBhbW91bnQ6IG5ldyBBc3NldERFWChuZXcgQmlnTnVtYmVyKDApLCBjb21vZGl0eSksXG4gICAgICAgICAgICAgICAgcGVyY2VudDogMC4zLFxuICAgICAgICAgICAgICAgIHJlY29yZHM6IHN1bW1hcnkucm93c1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIG5vdzpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciBub3dfc2VjOiBudW1iZXIgPSBNYXRoLmZsb29yKG5vdy5nZXRUaW1lKCkgLyAxMDAwKTtcbiAgICAgICAgICAgIHZhciBub3dfaG91cjogbnVtYmVyID0gTWF0aC5mbG9vcihub3dfc2VjIC8gMzYwMCk7XG4gICAgICAgICAgICB2YXIgc3RhcnRfaG91ciA9IG5vd19ob3VyIC0gMjM7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwibm93X2hvdXI6XCIsIG5vd19ob3VyKTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJzdGFydF9ob3VyOlwiLCBzdGFydF9ob3VyKTtcblxuICAgICAgICAgICAgLy8gcHJvY2VzbyBsb3MgZGF0b3MgY3J1ZG9zIFxuICAgICAgICAgICAgdmFyIHByaWNlID0gWkVST19DVVJSRU5DWTtcbiAgICAgICAgICAgIHZhciBpbnZlcnNlID0gWkVST19DT01PRElUWTtcbiAgICAgICAgICAgIHZhciBjcnVkZSA9IHt9O1xuICAgICAgICAgICAgdmFyIGxhc3RfaGggPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHN1bW1hcnkucm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBoaCA9IHN1bW1hcnkucm93c1tpXS5ob3VyO1xuICAgICAgICAgICAgICAgIGlmIChzdW1tYXJ5LnJvd3NbaV0ubGFiZWwgPT0gXCJsYXN0b25lXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcHJpY2UgPSBzdW1tYXJ5LnJvd3NbaV0ucHJpY2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3J1ZGVbaGhdID0gc3VtbWFyeS5yb3dzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdF9oaCA8IGhoICYmIGhoIDwgc3RhcnRfaG91cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdF9oaCA9IGhoO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2UgPSAoc2NvcGUgPT0gY2Fub25pY2FsKSA/IHN1bW1hcnkucm93c1tpXS5wcmljZSA6IHN1bW1hcnkucm93c1tpXS5pbnZlcnNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJzZSA9IChzY29wZSA9PSBjYW5vbmljYWwpID8gc3VtbWFyeS5yb3dzW2ldLmludmVyc2UgOiBzdW1tYXJ5LnJvd3NbaV0ucHJpY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiaGg6XCIsIGhoLCBcImxhc3RfaGg6XCIsIGxhc3RfaGgsIFwicHJpY2U6XCIsIHByaWNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcImNydWRlOlwiLCBjcnVkZSk7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwicHJpY2U6XCIsIHByaWNlKTtcblxuICAgICAgICAgICAgLy8gZ2VuZXJvIHVuYSBlbnRyYWRhIHBvciBjYWRhIHVuYSBkZSBsYXMgw4PCumx0aW1hcyAyNCBob3Jhc1xuICAgICAgICAgICAgdmFyIGxhc3RfMjRoID0ge307XG4gICAgICAgICAgICB2YXIgdm9sdW1lID0gbmV3IEFzc2V0REVYKFpFUk9fQ1VSUkVOQ1ksIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGFtb3VudCA9IG5ldyBBc3NldERFWChaRVJPX0NPTU9ESVRZLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBwcmljZV9hc3NldCA9IG5ldyBBc3NldERFWChwcmljZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgaW52ZXJzZV9hc3NldCA9IG5ldyBBc3NldERFWChpbnZlcnNlLCB0aGlzKTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJjbnQudGxvc1wiKWNvbnNvbGUubG9nKFwicHJpY2UgXCIsIHByaWNlKTtcbiAgICAgICAgICAgIHZhciBtYXhfcHJpY2UgPSBwcmljZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgdmFyIG1pbl9wcmljZSA9IHByaWNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICB2YXIgbWF4X2ludmVyc2UgPSBpbnZlcnNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICB2YXIgbWluX2ludmVyc2UgPSBpbnZlcnNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICB2YXIgcHJpY2VfZnN0OkFzc2V0REVYID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBpbnZlcnNlX2ZzdDpBc3NldERFWCA9IG51bGw7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8MjQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gc3RhcnRfaG91citpO1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50X2RhdGUgPSBuZXcgRGF0ZShjdXJyZW50ICogMzYwMCAqIDEwMDApO1xuICAgICAgICAgICAgICAgIHZhciBudWV2bzphbnkgPSBjcnVkZVtjdXJyZW50XTtcbiAgICAgICAgICAgICAgICBpZiAobnVldm8pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNfcHJpY2UgPSAoc2NvcGUgPT0gY2Fub25pY2FsKSA/IG51ZXZvLnByaWNlIDogbnVldm8uaW52ZXJzZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNfaW52ZXJzZSA9IChzY29wZSA9PSBjYW5vbmljYWwpID8gbnVldm8uaW52ZXJzZSA6IG51ZXZvLnByaWNlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc192b2x1bWUgPSAoc2NvcGUgPT0gY2Fub25pY2FsKSA/IG51ZXZvLnZvbHVtZSA6IG51ZXZvLmFtb3VudDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNfYW1vdW50ID0gKHNjb3BlID09IGNhbm9uaWNhbCkgPyBudWV2by5hbW91bnQgOiBudWV2by52b2x1bWU7XG4gICAgICAgICAgICAgICAgICAgIG51ZXZvLnByaWNlID0gc19wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgbnVldm8uaW52ZXJzZSA9IHNfaW52ZXJzZTtcbiAgICAgICAgICAgICAgICAgICAgbnVldm8udm9sdW1lID0gc192b2x1bWU7XG4gICAgICAgICAgICAgICAgICAgIG51ZXZvLmFtb3VudCA9IHNfYW1vdW50O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG51ZXZvID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHRoaXMuYXV4R2V0TGFiZWxGb3JIb3VyKGN1cnJlbnQgJSAyNCksXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiBpbnZlcnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lOiBaRVJPX0NVUlJFTkNZLFxuICAgICAgICAgICAgICAgICAgICAgICAgYW1vdW50OiBaRVJPX0NPTU9ESVRZLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZTogY3VycmVudF9kYXRlLnRvSVNPU3RyaW5nKCkuc3BsaXQoXCIuXCIpWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgaG91cjogY3VycmVudFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsYXN0XzI0aFtjdXJyZW50XSA9IGNydWRlW2N1cnJlbnRdIHx8IG51ZXZvO1xuICAgICAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJjdXJyZW50X2RhdGU6XCIsIGN1cnJlbnRfZGF0ZS50b0lTT1N0cmluZygpLCBjdXJyZW50LCBsYXN0XzI0aFtjdXJyZW50XSk7XG5cbiAgICAgICAgICAgICAgICAvLyBjb25pbmljYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIHByaWNlID0gbGFzdF8yNGhbY3VycmVudF0ucHJpY2U7XG4gICAgICAgICAgICAgICAgdmFyIHZvbCA9IG5ldyBBc3NldERFWChsYXN0XzI0aFtjdXJyZW50XS52b2x1bWUsIHRoaXMpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHZvbC50b2tlbi5zeW1ib2wgPT0gdm9sdW1lLnRva2VuLnN5bWJvbCwgXCJFUlJPUjogZGlmZmVyZW50IHRva2Vuc1wiLCB2b2wuc3RyLCB2b2x1bWUuc3RyKTtcbiAgICAgICAgICAgICAgICB2b2x1bWUuYW1vdW50ID0gdm9sdW1lLmFtb3VudC5wbHVzKHZvbC5hbW91bnQpO1xuICAgICAgICAgICAgICAgIGlmIChwcmljZSAhPSBaRVJPX0NVUlJFTkNZICYmICFwcmljZV9mc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpY2VfZnN0ID0gbmV3IEFzc2V0REVYKHByaWNlLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJpY2VfYXNzZXQgPSBuZXcgQXNzZXRERVgocHJpY2UsIHRoaXMpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHByaWNlX2Fzc2V0LnRva2VuLnN5bWJvbCA9PSBtYXhfcHJpY2UudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiBkaWZmZXJlbnQgdG9rZW5zXCIsIHByaWNlX2Fzc2V0LnN0ciwgbWF4X3ByaWNlLnN0cik7XG4gICAgICAgICAgICAgICAgaWYgKHByaWNlX2Fzc2V0LmFtb3VudC5pc0dyZWF0ZXJUaGFuKG1heF9wcmljZS5hbW91bnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heF9wcmljZSA9IHByaWNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHByaWNlX2Fzc2V0LnRva2VuLnN5bWJvbCA9PSBtaW5fcHJpY2UudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiBkaWZmZXJlbnQgdG9rZW5zXCIsIHByaWNlX2Fzc2V0LnN0ciwgbWluX3ByaWNlLnN0cik7XG4gICAgICAgICAgICAgICAgaWYgKG1pbl9wcmljZS5hbW91bnQuaXNFcXVhbFRvKDApIHx8IHByaWNlX2Fzc2V0LmFtb3VudC5pc0xlc3NUaGFuKG1pbl9wcmljZS5hbW91bnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbl9wcmljZSA9IHByaWNlX2Fzc2V0LmNsb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcmV2ZXJzZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgaW52ZXJzZSA9IGxhc3RfMjRoW2N1cnJlbnRdLmludmVyc2U7XG4gICAgICAgICAgICAgICAgdmFyIGFtbyA9IG5ldyBBc3NldERFWChsYXN0XzI0aFtjdXJyZW50XS5hbW91bnQsIHRoaXMpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGFtby50b2tlbi5zeW1ib2wgPT0gYW1vdW50LnRva2VuLnN5bWJvbCwgXCJFUlJPUjogZGlmZmVyZW50IHRva2Vuc1wiLCBhbW8uc3RyLCBhbW91bnQuc3RyKTtcbiAgICAgICAgICAgICAgICBhbW91bnQuYW1vdW50ID0gYW1vdW50LmFtb3VudC5wbHVzKGFtby5hbW91bnQpO1xuICAgICAgICAgICAgICAgIGlmIChpbnZlcnNlICE9IFpFUk9fQ09NT0RJVFkgJiYgIWludmVyc2VfZnN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGludmVyc2VfZnN0ID0gbmV3IEFzc2V0REVYKGludmVyc2UsIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbnZlcnNlX2Fzc2V0ID0gbmV3IEFzc2V0REVYKGludmVyc2UsIHRoaXMpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGludmVyc2VfYXNzZXQudG9rZW4uc3ltYm9sID09IG1heF9pbnZlcnNlLnRva2VuLnN5bWJvbCwgXCJFUlJPUjogZGlmZmVyZW50IHRva2Vuc1wiLCBpbnZlcnNlX2Fzc2V0LnN0ciwgbWF4X2ludmVyc2Uuc3RyKTtcbiAgICAgICAgICAgICAgICBpZiAoaW52ZXJzZV9hc3NldC5hbW91bnQuaXNHcmVhdGVyVGhhbihtYXhfaW52ZXJzZS5hbW91bnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heF9pbnZlcnNlID0gaW52ZXJzZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChpbnZlcnNlX2Fzc2V0LnRva2VuLnN5bWJvbCA9PSBtaW5faW52ZXJzZS50b2tlbi5zeW1ib2wsIFwiRVJST1I6IGRpZmZlcmVudCB0b2tlbnNcIiwgaW52ZXJzZV9hc3NldC5zdHIsIG1pbl9pbnZlcnNlLnN0cik7XG4gICAgICAgICAgICAgICAgaWYgKG1pbl9pbnZlcnNlLmFtb3VudC5pc0VxdWFsVG8oMCkgfHwgaW52ZXJzZV9hc3NldC5hbW91bnQuaXNMZXNzVGhhbihtaW5faW52ZXJzZS5hbW91bnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbl9pbnZlcnNlID0gaW52ZXJzZV9hc3NldC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGNvbmluaWNhbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBpZiAoIXByaWNlX2ZzdCkge1xuICAgICAgICAgICAgICAgIHByaWNlX2ZzdCA9IG5ldyBBc3NldERFWChsYXN0XzI0aFtzdGFydF9ob3VyXS5wcmljZSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbGFzdF9wcmljZSA9ICBuZXcgQXNzZXRERVgobGFzdF8yNGhbbm93X2hvdXJdLnByaWNlLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBkaWZmID0gbGFzdF9wcmljZS5jbG9uZSgpO1xuICAgICAgICAgICAgLy8gZGlmZi5hbW91bnQgXG4gICAgICAgICAgICBkaWZmLmFtb3VudCA9IGxhc3RfcHJpY2UuYW1vdW50Lm1pbnVzKHByaWNlX2ZzdC5hbW91bnQpO1xuICAgICAgICAgICAgdmFyIHJhdGlvOm51bWJlciA9IDA7XG4gICAgICAgICAgICBpZiAocHJpY2VfZnN0LmFtb3VudC50b051bWJlcigpICE9IDApIHtcbiAgICAgICAgICAgICAgICByYXRpbyA9IGRpZmYuYW1vdW50LmRpdmlkZWRCeShwcmljZV9mc3QuYW1vdW50KS50b051bWJlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHBlcmNlbnQgPSBNYXRoLmZsb29yKHJhdGlvICogMTAwMDApIC8gMTAwO1xuXG4gICAgICAgICAgICAvLyByZXZlcnNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIGlmICghaW52ZXJzZV9mc3QpIHtcbiAgICAgICAgICAgICAgICBpbnZlcnNlX2ZzdCA9IG5ldyBBc3NldERFWChsYXN0XzI0aFtzdGFydF9ob3VyXS5pbnZlcnNlLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsYXN0X2ludmVyc2UgPSAgbmV3IEFzc2V0REVYKGxhc3RfMjRoW25vd19ob3VyXS5pbnZlcnNlLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBpZGlmZiA9IGxhc3RfaW52ZXJzZS5jbG9uZSgpO1xuICAgICAgICAgICAgLy8gZGlmZi5hbW91bnQgXG4gICAgICAgICAgICBpZGlmZi5hbW91bnQgPSBsYXN0X2ludmVyc2UuYW1vdW50Lm1pbnVzKGludmVyc2VfZnN0LmFtb3VudCk7XG4gICAgICAgICAgICByYXRpbyA9IDA7XG4gICAgICAgICAgICBpZiAoaW52ZXJzZV9mc3QuYW1vdW50LnRvTnVtYmVyKCkgIT0gMCkge1xuICAgICAgICAgICAgICAgIHJhdGlvID0gZGlmZi5hbW91bnQuZGl2aWRlZEJ5KGludmVyc2VfZnN0LmFtb3VudCkudG9OdW1iZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBpcGVyY2VudCA9IE1hdGguZmxvb3IocmF0aW8gKiAxMDAwMCkgLyAxMDA7XG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwicHJpY2VfZnN0OlwiLCBwcmljZV9mc3Quc3RyKTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJpbnZlcnNlX2ZzdDpcIiwgaW52ZXJzZV9mc3Quc3RyKTtcblxuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcImxhc3RfMjRoOlwiLCBbbGFzdF8yNGhdKTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJkaWZmOlwiLCBkaWZmLnRvU3RyaW5nKDgpKTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJwZXJjZW50OlwiLCBwZXJjZW50KTtcbiAgICAgICAgICAgIC8vIGlmKGNhbm9uaWNhbD09XCJhY29ybi50bG9zXCIpY29uc29sZS5sb2coXCJyYXRpbzpcIiwgcmF0aW8pO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcInZvbHVtZTpcIiwgdm9sdW1lLnN0cik7XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LnByaWNlID0gbGFzdF9wcmljZTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LmludmVyc2UgPSBsYXN0X2ludmVyc2U7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5wcmljZV8yNGhfYWdvID0gcHJpY2VfZnN0IHx8IGxhc3RfcHJpY2U7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5pbnZlcnNlXzI0aF9hZ28gPSBpbnZlcnNlX2ZzdDtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LnBlcmNlbnRfc3RyID0gKGlzTmFOKHBlcmNlbnQpID8gMCA6IHBlcmNlbnQpICsgXCIlXCI7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5wZXJjZW50ID0gaXNOYU4ocGVyY2VudCkgPyAwIDogcGVyY2VudDtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LmlwZXJjZW50X3N0ciA9IChpc05hTihpcGVyY2VudCkgPyAwIDogaXBlcmNlbnQpICsgXCIlXCI7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5pcGVyY2VudCA9IGlzTmFOKGlwZXJjZW50KSA/IDAgOiBpcGVyY2VudDtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LnZvbHVtZSA9IHZvbHVtZTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5LmFtb3VudCA9IGFtb3VudDtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5Lm1pbl9wcmljZSA9IG1pbl9wcmljZTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5Lm1heF9wcmljZSA9IG1heF9wcmljZTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5zdW1tYXJ5Lm1pbl9pbnZlcnNlID0gbWluX2ludmVyc2U7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeS5tYXhfaW52ZXJzZSA9IG1heF9pbnZlcnNlO1xuXG4gICAgICAgICAgICAvLyBpZihjYW5vbmljYWw9PVwiYWNvcm4udGxvc1wiKWNvbnNvbGUubG9nKFwiU3VtbWFyeSBmaW5hbDpcIiwgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnkpO1xuICAgICAgICAgICAgLy8gaWYoY2Fub25pY2FsPT1cImFjb3JuLnRsb3NcIiljb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwic3VtbWFyeS5cIitjYW5vbmljYWwsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwic3VtbWFyeS5cIitpbnZlcnNlLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnN1bW1hcnk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gJiYgIWZvcmNlKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uc3VtbWFyeTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IGF1eDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0TWFya2V0U3VtbWFyeSgpO1xuICAgICAgICB0aGlzLm9uTWFya2V0U3VtbWFyeS5uZXh0KHJlc3VsdCk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRBbGxUYWJsZXNTdW1hcmllcygpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0T3JkZXJTdW1tYXJ5LnRoZW4oYXN5bmMgXyA9PiB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZXMgPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLl9tYXJrZXRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkuaW5kZXhPZihcIi5cIikgPT0gLTEpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIHZhciBwID0gdGhpcy5nZXRUYWJsZVN1bW1hcnkodGhpcy5fbWFya2V0c1tpXS5jb21vZGl0eSwgdGhpcy5fbWFya2V0c1tpXS5jdXJyZW5jeSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVG9rZW5zU3VtbWFyeSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgfVxuICAgIFxuXG4gICAgLy9cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEF1eCBmdW5jdGlvbnNcbiAgICBwcml2YXRlIGF1eFByb2Nlc3NSb3dzVG9PcmRlcnMocm93czphbnlbXSk6IE9yZGVyW10ge1xuICAgICAgICB2YXIgcmVzdWx0OiBPcmRlcltdID0gW107XG4gICAgICAgIGZvciAodmFyIGk9MDsgaSA8IHJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwcmljZSA9IG5ldyBBc3NldERFWChyb3dzW2ldLnByaWNlLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBpbnZlcnNlID0gbmV3IEFzc2V0REVYKHJvd3NbaV0uaW52ZXJzZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgc2VsbGluZyA9IG5ldyBBc3NldERFWChyb3dzW2ldLnNlbGxpbmcsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIHRvdGFsID0gbmV3IEFzc2V0REVYKHJvd3NbaV0udG90YWwsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIG9yZGVyOk9yZGVyO1xuXG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLmdldFNjb3BlRm9yKHByaWNlLnRva2VuLCBpbnZlcnNlLnRva2VuKTtcbiAgICAgICAgICAgIHZhciBjYW5vbmljYWwgPSB0aGlzLmNhbm9uaWNhbFNjb3BlKHNjb3BlKTtcbiAgICAgICAgICAgIHZhciByZXZlcnNlX3Njb3BlID0gdGhpcy5pbnZlcnNlU2NvcGUoY2Fub25pY2FsKTtcbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBpZiAocmV2ZXJzZV9zY29wZSA9PSBzY29wZSkge1xuICAgICAgICAgICAgICAgIG9yZGVyID0ge1xuICAgICAgICAgICAgICAgICAgICBpZDogcm93c1tpXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHByaWNlLFxuICAgICAgICAgICAgICAgICAgICBpbnZlcnNlOiBpbnZlcnNlLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogc2VsbGluZyxcbiAgICAgICAgICAgICAgICAgICAgZGVwb3NpdDogc2VsbGluZyxcbiAgICAgICAgICAgICAgICAgICAgdGVsb3M6IHRvdGFsLFxuICAgICAgICAgICAgICAgICAgICBvd25lcjogcm93c1tpXS5vd25lclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3JkZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiByb3dzW2ldLmlkLFxuICAgICAgICAgICAgICAgICAgICBwcmljZTogaW52ZXJzZSxcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgZGVwb3NpdDogc2VsbGluZyxcbiAgICAgICAgICAgICAgICAgICAgdGVsb3M6IHNlbGxpbmcsXG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiByb3dzW2ldLm93bmVyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0LnB1c2gob3JkZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhdXhHZXRMYWJlbEZvckhvdXIoaGg6bnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGhvdXJzID0gW1xuICAgICAgICAgICAgXCJoLnplcm9cIixcbiAgICAgICAgICAgIFwiaC5vbmVcIixcbiAgICAgICAgICAgIFwiaC50d29cIixcbiAgICAgICAgICAgIFwiaC50aHJlZVwiLFxuICAgICAgICAgICAgXCJoLmZvdXJcIixcbiAgICAgICAgICAgIFwiaC5maXZlXCIsXG4gICAgICAgICAgICBcImguc2l4XCIsXG4gICAgICAgICAgICBcImguc2V2ZW5cIixcbiAgICAgICAgICAgIFwiaC5laWdodFwiLFxuICAgICAgICAgICAgXCJoLm5pbmVcIixcbiAgICAgICAgICAgIFwiaC50ZW5cIixcbiAgICAgICAgICAgIFwiaC5lbGV2ZW5cIixcbiAgICAgICAgICAgIFwiaC50d2VsdmVcIixcbiAgICAgICAgICAgIFwiaC50aGlydGVlblwiLFxuICAgICAgICAgICAgXCJoLmZvdXJ0ZWVuXCIsXG4gICAgICAgICAgICBcImguZmlmdGVlblwiLFxuICAgICAgICAgICAgXCJoLnNpeHRlZW5cIixcbiAgICAgICAgICAgIFwiaC5zZXZlbnRlZW5cIixcbiAgICAgICAgICAgIFwiaC5laWdodGVlblwiLFxuICAgICAgICAgICAgXCJoLm5pbmV0ZWVuXCIsXG4gICAgICAgICAgICBcImgudHdlbnR5XCIsXG4gICAgICAgICAgICBcImgudHdlbnR5b25lXCIsXG4gICAgICAgICAgICBcImgudHdlbnR5dHdvXCIsXG4gICAgICAgICAgICBcImgudHdlbnR5dGhyZWVcIlxuICAgICAgICBdXG4gICAgICAgIHJldHVybiBob3Vyc1toaF07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhdXhBc3NlcnRTY29wZShzY29wZTpzdHJpbmcpOiBNYXJrZXQge1xuICAgICAgICB2YXIgY29tb2RpdHlfc3ltID0gc2NvcGUuc3BsaXQoXCIuXCIpWzBdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIHZhciBjdXJyZW5jeV9zeW0gPSBzY29wZS5zcGxpdChcIi5cIilbMV0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgdmFyIGNvbW9kaXR5ID0gdGhpcy5nZXRUb2tlbk5vdyhjb21vZGl0eV9zeW0pO1xuICAgICAgICB2YXIgY3VycmVuY3kgPSB0aGlzLmdldFRva2VuTm93KGN1cnJlbmN5X3N5bSk7XG4gICAgICAgIHZhciBhdXhfYXNzZXRfY29tID0gbmV3IEFzc2V0REVYKDAsIGNvbW9kaXR5KTtcbiAgICAgICAgdmFyIGF1eF9hc3NldF9jdXIgPSBuZXcgQXNzZXRERVgoMCwgY3VycmVuY3kpO1xuXG4gICAgICAgIHZhciBtYXJrZXRfc3VtbWFyeTpNYXJrZXRTdW1tYXJ5ID0ge1xuICAgICAgICAgICAgc2NvcGU6IHNjb3BlLFxuICAgICAgICAgICAgcHJpY2U6IGF1eF9hc3NldF9jdXIsXG4gICAgICAgICAgICBwcmljZV8yNGhfYWdvOiBhdXhfYXNzZXRfY3VyLFxuICAgICAgICAgICAgaW52ZXJzZTogYXV4X2Fzc2V0X2NvbSxcbiAgICAgICAgICAgIGludmVyc2VfMjRoX2FnbzogYXV4X2Fzc2V0X2NvbSxcbiAgICAgICAgICAgIG1heF9pbnZlcnNlOiBhdXhfYXNzZXRfY29tLFxuICAgICAgICAgICAgbWF4X3ByaWNlOiBhdXhfYXNzZXRfY3VyLFxuICAgICAgICAgICAgbWluX2ludmVyc2U6IGF1eF9hc3NldF9jb20sXG4gICAgICAgICAgICBtaW5fcHJpY2U6IGF1eF9hc3NldF9jdXIsXG4gICAgICAgICAgICByZWNvcmRzOiBbXSxcbiAgICAgICAgICAgIHZvbHVtZTogYXV4X2Fzc2V0X2N1cixcbiAgICAgICAgICAgIGFtb3VudDogYXV4X2Fzc2V0X2NvbSxcbiAgICAgICAgICAgIHBlcmNlbnQ6IDAsXG4gICAgICAgICAgICBpcGVyY2VudDogMCxcbiAgICAgICAgICAgIHBlcmNlbnRfc3RyOiBcIjAlXCIsXG4gICAgICAgICAgICBpcGVyY2VudF9zdHI6IFwiMCVcIixcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXJrZXRzW3Njb3BlXSB8fCB7XG4gICAgICAgICAgICBzY29wZTogc2NvcGUsXG4gICAgICAgICAgICBjb21vZGl0eTogY29tb2RpdHksXG4gICAgICAgICAgICBjdXJyZW5jeTogY3VycmVuY3ksXG4gICAgICAgICAgICBvcmRlcnM6IHsgc2VsbDogW10sIGJ1eTogW10gfSxcbiAgICAgICAgICAgIGRlYWxzOiAwLFxuICAgICAgICAgICAgaGlzdG9yeTogW10sXG4gICAgICAgICAgICB0eDoge30sXG4gICAgICAgICAgICBibG9ja3M6IDAsXG4gICAgICAgICAgICBibG9jazoge30sXG4gICAgICAgICAgICBibG9ja2xpc3Q6IFtdLFxuICAgICAgICAgICAgYmxvY2tsZXZlbHM6IFtbXV0sXG4gICAgICAgICAgICByZXZlcnNlYmxvY2tzOiBbXSxcbiAgICAgICAgICAgIHJldmVyc2VsZXZlbHM6IFtbXV0sXG4gICAgICAgICAgICBzdW1tYXJ5OiBtYXJrZXRfc3VtbWFyeSxcbiAgICAgICAgICAgIGhlYWRlcjogeyBcbiAgICAgICAgICAgICAgICBzZWxsOiB7dG90YWw6YXV4X2Fzc2V0X2NvbSwgb3JkZXJzOjB9LCBcbiAgICAgICAgICAgICAgICBidXk6IHt0b3RhbDphdXhfYXNzZXRfY3VyLCBvcmRlcnM6MH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07ICAgICAgICBcbiAgICB9XG5cbiAgICBwcml2YXRlIGZldGNoRGVwb3NpdHMoYWNjb3VudCk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJkZXBvc2l0c1wiLCB7c2NvcGU6YWNjb3VudH0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZmV0Y2hCYWxhbmNlcyhhY2NvdW50KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdFRva2Vuc0xvYWRlZC50aGVuKGFzeW5jIF8gPT4ge1xuICAgICAgICAgICAgdmFyIGNvbnRyYWN0cyA9IHt9O1xuICAgICAgICAgICAgdmFyIGJhbGFuY2VzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMudG9rZW5zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudG9rZW5zW2ldLm9mZmNoYWluKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjb250cmFjdHNbdGhpcy50b2tlbnNbaV0uY29udHJhY3RdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGNvbnRyYWN0IGluIGNvbnRyYWN0cykge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiYmFsYW5jZXMtXCIrY29udHJhY3QsIHRydWUpO1xuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yICh2YXIgY29udHJhY3QgaW4gY29udHJhY3RzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGF3YWl0IHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJhY2NvdW50c1wiLCB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0OmNvbnRyYWN0LFxuICAgICAgICAgICAgICAgICAgICBzY29wZTogYWNjb3VudCB8fCB0aGlzLmN1cnJlbnQubmFtZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gcmVzdWx0LnJvd3MpIHtcbiAgICAgICAgICAgICAgICAgICAgYmFsYW5jZXMucHVzaChuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uYmFsYW5jZSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImJhbGFuY2VzLVwiK2NvbnRyYWN0LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYmFsYW5jZXM7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hPcmRlcnMocGFyYW1zOlRhYmxlUGFyYW1zKTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcInNlbGxvcmRlcnNcIiwgcGFyYW1zKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZldGNoT3JkZXJTdW1tYXJ5KCk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJvcmRlcnN1bW1hcnlcIikudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaEJsb2NrSGlzdG9yeShzY29wZTpzdHJpbmcsIHBhZ2U6bnVtYmVyID0gMCwgcGFnZXNpemU6bnVtYmVyID0gMjUpOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHZhciBjYW5vbmljYWw6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgIHZhciBwYWdlcyA9IHRoaXMuZ2V0QmxvY2tIaXN0b3J5VG90YWxQYWdlc0ZvcihjYW5vbmljYWwsIHBhZ2VzaXplKTtcbiAgICAgICAgdmFyIGlkID0gcGFnZSpwYWdlc2l6ZTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWVERVguZmV0Y2hCbG9ja0hpc3RvcnkoXCIsIHNjb3BlLCBcIixcIixwYWdlLFwiLFwiLHBhZ2VzaXplLFwiKTogaWQ6XCIsIGlkLCBcInBhZ2VzOlwiLCBwYWdlcyk7XG4gICAgICAgIGlmIChwYWdlIDwgcGFnZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXJrZXRzICYmIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXSAmJiB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uYmxvY2tbXCJpZC1cIiArIGlkXSkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQ6VGFibGVSZXN1bHQgPSB7bW9yZTpmYWxzZSxyb3dzOltdfTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8cGFnZXNpemU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWRfaSA9IGlkK2k7XG4gICAgICAgICAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5ibG9ja1tcImlkLVwiICsgaWRfaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnJvd3MucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnJvd3MubGVuZ3RoID09IHBhZ2VzaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGhhdmUgdGhlIGNvbXBsZXRlIHBhZ2UgaW4gbWVtb3J5XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmZldGNoSGlzdG9yeShcIiwgc2NvcGUsIFwiLFwiLHBhZ2UsXCIsXCIscGFnZXNpemUsXCIpOiByZXN1bHQ6XCIsIHJlc3VsdC5yb3dzLm1hcCgoeyBpZCB9KSA9PiBpZCkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyYWN0LmdldFRhYmxlKFwiYmxvY2toaXN0b3J5XCIsIHtzY29wZTpjYW5vbmljYWwsIGxpbWl0OnBhZ2VzaXplLCBsb3dlcl9ib3VuZDpcIlwiKyhwYWdlKnBhZ2VzaXplKX0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKipcIik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImJsb2NrIEhpc3RvcnkgY3J1ZG86XCIsIHJlc3VsdCk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gPSB0aGlzLmF1eEFzc2VydFNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uYmxvY2sgPSB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uYmxvY2sgfHwge307IFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLl9tYXJrZXRzW3Njb3BlXS5ibG9jazpcIiwgdGhpcy5fbWFya2V0c1tzY29wZV0uYmxvY2spO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgcmVzdWx0LnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYmxvY2s6SGlzdG9yeUJsb2NrID0ge1xuICAgICAgICAgICAgICAgICAgICBpZDogcmVzdWx0LnJvd3NbaV0uaWQsXG4gICAgICAgICAgICAgICAgICAgIGhvdXI6IHJlc3VsdC5yb3dzW2ldLmhvdXIsXG4gICAgICAgICAgICAgICAgICAgIHN0cjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5wcmljZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGludmVyc2U6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5pbnZlcnNlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgZW50cmFuY2U6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5lbnRyYW5jZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIG1heDogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLm1heCwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIG1pbjogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLm1pbiwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHZvbHVtZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLnZvbHVtZSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudDogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmFtb3VudCwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKHJlc3VsdC5yb3dzW2ldLmRhdGUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJsb2NrLnN0ciA9IEpTT04uc3RyaW5naWZ5KFtibG9jay5tYXguc3RyLCBibG9jay5lbnRyYW5jZS5zdHIsIGJsb2NrLnByaWNlLnN0ciwgYmxvY2subWluLnN0cl0pO1xuICAgICAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS5ibG9ja1tcImlkLVwiICsgYmxvY2suaWRdID0gYmxvY2s7XG4gICAgICAgICAgICB9ICAgXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImJsb2NrIEhpc3RvcnkgZmluYWw6XCIsIHRoaXMuX21hcmtldHNbc2NvcGVdLmJsb2NrKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH0gICAgXG5cbiAgICBwcml2YXRlIGZldGNoSGlzdG9yeShzY29wZTpzdHJpbmcsIHBhZ2U6bnVtYmVyID0gMCwgcGFnZXNpemU6bnVtYmVyID0gMjUpOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHZhciBjYW5vbmljYWw6c3RyaW5nID0gdGhpcy5jYW5vbmljYWxTY29wZShzY29wZSk7XG4gICAgICAgIHZhciBwYWdlcyA9IHRoaXMuZ2V0SGlzdG9yeVRvdGFsUGFnZXNGb3IoY2Fub25pY2FsLCBwYWdlc2l6ZSk7XG4gICAgICAgIHZhciBpZCA9IHBhZ2UqcGFnZXNpemU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmZldGNoSGlzdG9yeShcIiwgc2NvcGUsIFwiLFwiLHBhZ2UsXCIsXCIscGFnZXNpemUsXCIpOiBpZDpcIiwgaWQsIFwicGFnZXM6XCIsIHBhZ2VzKTtcbiAgICAgICAgaWYgKHBhZ2UgPCBwYWdlcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX21hcmtldHMgJiYgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdICYmIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eFtcImlkLVwiICsgaWRdKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdDpUYWJsZVJlc3VsdCA9IHttb3JlOmZhbHNlLHJvd3M6W119O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxwYWdlc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpZF9pID0gaWQraTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRyeCA9IHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eFtcImlkLVwiICsgaWRfaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0cngpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5yb3dzLnB1c2godHJ4KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucm93cy5sZW5ndGggPT0gcGFnZXNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgaGF2ZSB0aGUgY29tcGxldGUgcGFnZSBpbiBtZW1vcnlcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYXBhZWVERVguZmV0Y2hIaXN0b3J5KFwiLCBzY29wZSwgXCIsXCIscGFnZSxcIixcIixwYWdlc2l6ZSxcIik6IHJlc3VsdDpcIiwgcmVzdWx0LnJvd3MubWFwKCh7IGlkIH0pID0+IGlkKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJoaXN0b3J5XCIsIHtzY29wZTpzY29wZSwgbGltaXQ6cGFnZXNpemUsIGxvd2VyX2JvdW5kOlwiXCIrKHBhZ2UqcGFnZXNpemUpfSkudGhlbihyZXN1bHQgPT4ge1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJIaXN0b3J5IGNydWRvOlwiLCByZXN1bHQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0gPSB0aGlzLmF1eEFzc2VydFNjb3BlKGNhbm9uaWNhbCk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uaGlzdG9yeSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnR4ID0gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnR4IHx8IHt9OyBcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLnNjb3Blc1tzY29wZV0udHg6XCIsIHRoaXMuc2NvcGVzW3Njb3BlXS50eCk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaSA8IHJlc3VsdC5yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zYWN0aW9uOkhpc3RvcnlUeCA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHJlc3VsdC5yb3dzW2ldLmlkLFxuICAgICAgICAgICAgICAgICAgICBzdHI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudDogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmFtb3VudCwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHBheW1lbnQ6IG5ldyBBc3NldERFWChyZXN1bHQucm93c1tpXS5wYXltZW50LCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgYnV5ZmVlOiBuZXcgQXNzZXRERVgocmVzdWx0LnJvd3NbaV0uYnV5ZmVlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgc2VsbGZlZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLnNlbGxmZWUsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBwcmljZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLnByaWNlLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogbmV3IEFzc2V0REVYKHJlc3VsdC5yb3dzW2ldLmludmVyc2UsIHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBidXllcjogcmVzdWx0LnJvd3NbaV0uYnV5ZXIsXG4gICAgICAgICAgICAgICAgICAgIHNlbGxlcjogcmVzdWx0LnJvd3NbaV0uc2VsbGVyLFxuICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShyZXN1bHQucm93c1tpXS5kYXRlKSxcbiAgICAgICAgICAgICAgICAgICAgaXNidXk6ICEhcmVzdWx0LnJvd3NbaV0uaXNidXlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb24uc3RyID0gdHJhbnNhY3Rpb24ucHJpY2Uuc3RyICsgXCIgXCIgKyB0cmFuc2FjdGlvbi5hbW91bnQuc3RyO1xuICAgICAgICAgICAgICAgIHRoaXMuX21hcmtldHNbY2Fub25pY2FsXS50eFtcImlkLVwiICsgdHJhbnNhY3Rpb24uaWRdID0gdHJhbnNhY3Rpb247XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogaW4gdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLnR4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFya2V0c1tjYW5vbmljYWxdLmhpc3RvcnkucHVzaCh0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0udHhbal0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXRzW2Nhbm9uaWNhbF0uaGlzdG9yeS5zb3J0KGZ1bmN0aW9uKGE6SGlzdG9yeVR4LCBiOkhpc3RvcnlUeCl7XG4gICAgICAgICAgICAgICAgaWYoYS5kYXRlIDwgYi5kYXRlKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICBpZihhLmRhdGUgPiBiLmRhdGUpIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICBpZihhLmlkIDwgYi5pZCkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgaWYoYS5pZCA+IGIuaWQpIHJldHVybiAtMTtcbiAgICAgICAgICAgIH0pOyAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkhpc3RvcnkgZmluYWw6XCIsIHRoaXMuc2NvcGVzW3Njb3BlXS5oaXN0b3J5KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGFzeW5jIGZldGNoQWN0aXZpdHkocGFnZTpudW1iZXIgPSAwLCBwYWdlc2l6ZTpudW1iZXIgPSAyNSkge1xuICAgICAgICB2YXIgaWQgPSBwYWdlKnBhZ2VzaXplKzE7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVmFwYWVlREVYLmZldGNoQWN0aXZpdHkoXCIsIHBhZ2UsXCIsXCIscGFnZXNpemUsXCIpOiBpZDpcIiwgaWQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZpdHkuZXZlbnRzW1wiaWQtXCIgKyBpZF0pIHtcbiAgICAgICAgICAgIHZhciBwYWdlRXZlbnRzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8cGFnZXNpemU7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpZF9pID0gaWQraTtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnQgPSB0aGlzLmFjdGl2aXR5LmV2ZW50c1tcImlkLVwiICsgaWRfaV07XG4gICAgICAgICAgICAgICAgaWYgKCFldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFnZUV2ZW50cy5sZW5ndGggPT0gcGFnZXNpemUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxuICAgICAgICB9ICAgICAgICBcblxuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcImV2ZW50c1wiLCB7bGltaXQ6cGFnZXNpemUsIGxvd2VyX2JvdW5kOlwiXCIraWR9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJBY3Rpdml0eSBjcnVkbzpcIiwgcmVzdWx0KTtcbiAgICAgICAgICAgIHZhciBsaXN0OkV2ZW50TG9nW10gPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgcmVzdWx0LnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSByZXN1bHQucm93c1tpXS5pZDtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnQ6RXZlbnRMb2cgPSA8RXZlbnRMb2c+cmVzdWx0LnJvd3NbaV07XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmFjdGl2aXR5LmV2ZW50c1tcImlkLVwiICsgaWRdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZpdHkuZXZlbnRzW1wiaWQtXCIgKyBpZF0gPSBldmVudDtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKj4+Pj4+XCIsIGlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdHkubGlzdCA9IFtdLmNvbmNhdCh0aGlzLmFjdGl2aXR5Lmxpc3QpLmNvbmNhdChsaXN0KTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdHkubGlzdC5zb3J0KGZ1bmN0aW9uKGE6RXZlbnRMb2csIGI6RXZlbnRMb2cpe1xuICAgICAgICAgICAgICAgIGlmKGEuZGF0ZSA8IGIuZGF0ZSkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgaWYoYS5kYXRlID4gYi5kYXRlKSByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgaWYoYS5pZCA8IGIuaWQpIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIGlmKGEuaWQgPiBiLmlkKSByZXR1cm4gLTE7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgZmV0Y2hVc2VyT3JkZXJzKHVzZXI6c3RyaW5nKTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcInVzZXJvcmRlcnNcIiwge3Njb3BlOnVzZXIsIGxpbWl0OjIwMH0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGZldGNoU3VtbWFyeShzY29wZSk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3QuZ2V0VGFibGUoXCJ0YWJsZXN1bW1hcnlcIiwge3Njb3BlOnNjb3BlfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaFRva2VuU3RhdHModG9rZW4pOiBQcm9taXNlPFRhYmxlUmVzdWx0PiB7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidG9rZW4tc3RhdC1cIit0b2tlbi5zeW1ib2wsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcInN0YXRcIiwge2NvbnRyYWN0OnRva2VuLmNvbnRyYWN0LCBzY29wZTp0b2tlbi5zeW1ib2x9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB0b2tlbi5zdGF0ID0gcmVzdWx0LnJvd3NbMF07XG4gICAgICAgICAgICBpZiAodG9rZW4uc3RhdC5pc3N1ZXJzICYmIHRva2VuLnN0YXQuaXNzdWVyc1swXSA9PSBcImV2ZXJ5b25lXCIpIHtcbiAgICAgICAgICAgICAgICB0b2tlbi5mYWtlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwidG9rZW4tc3RhdC1cIit0b2tlbi5zeW1ib2wsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaFRva2Vuc1N0YXRzKGV4dGVuZGVkOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZhcGFlZS5mZXRjaFRva2VucygpXCIpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcInRva2VuLXN0YXRzXCIsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0VG9rZW5zTG9hZGVkLnRoZW4oXyA9PiB7XG5cbiAgICAgICAgICAgIHZhciBwcmlvbWlzZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy50b2tlbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50b2tlbnNbaV0ub2ZmY2hhaW4pIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIHByaW9taXNlcy5wdXNoKHRoaXMuZmV0Y2hUb2tlblN0YXRzKHRoaXMudG9rZW5zW2ldKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbDxhbnk+KHByaW9taXNlcykudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VG9rZW5TdGF0cyh0aGlzLnRva2Vucyk7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJ0b2tlbi1zdGF0c1wiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zO1xuICAgICAgICAgICAgfSk7ICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgdXBkYXRlVG9rZW5zU3VtbWFyeSh0aW1lczogbnVtYmVyID0gMjApIHtcbiAgICAgICAgaWYgKHRpbWVzID4gMSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHRpbWVzOyBpPjA7IGktLSkgdGhpcy51cGRhdGVUb2tlbnNTdW1tYXJ5KDEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IFxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGhpcy53YWl0VG9rZW5zTG9hZGVkLFxuICAgICAgICAgICAgdGhpcy53YWl0TWFya2V0U3VtbWFyeVxuICAgICAgICBdKS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIoaW5pKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlZhcGFlZS51cGRhdGVUb2tlbnNTdW1tYXJ5KClcIik7IFxuXG4gICAgICAgICAgICAvLyBtYXBwaW5nIG9mIGhvdyBtdWNoIChhbW91bnQgb2YpIHRva2VucyBoYXZlIGJlZW4gdHJhZGVkIGFncmVnYXRlZCBpbiBhbGwgbWFya2V0c1xuICAgICAgICAgICAgdmFyIGFtb3VudF9tYXA6e1trZXk6c3RyaW5nXTpBc3NldERFWH0gPSB7fTtcblxuICAgICAgICAgICAgLy8gYSBjYWRhIHRva2VuIGxlIGFzaWdubyB1biBwcmljZSBxdWUgc2FsZSBkZSB2ZXJpZmljYXIgc3UgcHJpY2UgZW4gZWwgbWVyY2FkbyBwcmluY2lwYWwgWFhYL1RMT1NcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy50b2tlbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50b2tlbnNbaV0ub2ZmY2hhaW4pIGNvbnRpbnVlOyAvLyBkaXNjYXJkIHRva2VucyB0aGF0IGFyZSBub3Qgb24tY2hhaW5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLnRva2Vuc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgcXVhbnRpdHk6QXNzZXRERVggPSBuZXcgQXNzZXRERVgoMCwgdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiB0aGlzLl9tYXJrZXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqLmluZGV4T2YoXCIuXCIpID09IC0xKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlOk1hcmtldCA9IHRoaXMuX21hcmtldHNbal07XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY29tb2RpdHkuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkgPSBxdWFudGl0eS5wbHVzKHRhYmxlLnN1bW1hcnkuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkgPSBxdWFudGl0eS5wbHVzKHRhYmxlLnN1bW1hcnkudm9sdW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sICYmIHRhYmxlLmN1cnJlbmN5LnN5bWJvbCA9PSB0aGlzLnRlbG9zLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuLnN1bW1hcnkgJiYgdG9rZW4uc3VtbWFyeS5wcmljZS5hbW91bnQudG9OdW1iZXIoKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRva2VuLnN1bW1hcnk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkgPSB0b2tlbi5zdW1tYXJ5IHx8IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogdGFibGUuc3VtbWFyeS5wcmljZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlXzI0aF9hZ286IHRhYmxlLnN1bW1hcnkucHJpY2VfMjRoX2Fnby5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZTogdGFibGUuc3VtbWFyeS52b2x1bWUuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJjZW50OiB0YWJsZS5zdW1tYXJ5LnBlcmNlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyY2VudF9zdHI6IHRhYmxlLnN1bW1hcnkucGVyY2VudF9zdHIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBhbW91bnRfbWFwW3Rva2VuLnN5bWJvbF0gPSBxdWFudGl0eTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy50ZWxvcy5zdW1tYXJ5ID0ge1xuICAgICAgICAgICAgICAgIHByaWNlOiBuZXcgQXNzZXRERVgoMSwgdGhpcy50ZWxvcyksXG4gICAgICAgICAgICAgICAgcHJpY2VfMjRoX2FnbzogbmV3IEFzc2V0REVYKDEsIHRoaXMudGVsb3MpLFxuICAgICAgICAgICAgICAgIHZvbHVtZTogbmV3IEFzc2V0REVYKC0xLCB0aGlzLnRlbG9zKSxcbiAgICAgICAgICAgICAgICBwZXJjZW50OiAwLFxuICAgICAgICAgICAgICAgIHBlcmNlbnRfc3RyOiBcIjAlXCJcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJhbW91bnRfbWFwOiBcIiwgYW1vdW50X21hcCk7XG5cblxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgT05FID0gbmV3IEJpZ051bWJlcigxKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnRva2Vucykge1xuICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IHRoaXMudG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5vZmZjaGFpbikgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKCF0b2tlbi5zdW1tYXJ5KSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4uc3ltYm9sID09IHRoaXMudGVsb3Muc3ltYm9sKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlRPS0VOOiAtLS0tLS0tLSBcIiwgdG9rZW4uc3ltYm9sLCB0b2tlbi5zdW1tYXJ5LnByaWNlLnN0ciwgdG9rZW4uc3VtbWFyeS5wcmljZV8yNGhfYWdvLnN0ciApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciB2b2x1bWUgPSBuZXcgQXNzZXRERVgoMCwgdGhpcy50ZWxvcyk7XG4gICAgICAgICAgICAgICAgdmFyIHByaWNlID0gbmV3IEFzc2V0REVYKDAsIHRoaXMudGVsb3MpO1xuICAgICAgICAgICAgICAgIHZhciBwcmljZV9pbml0ID0gbmV3IEFzc2V0REVYKDAsIHRoaXMudGVsb3MpO1xuICAgICAgICAgICAgICAgIHZhciB0b3RhbF9xdWFudGl0eSA9IGFtb3VudF9tYXBbdG9rZW4uc3ltYm9sXTtcblxuICAgICAgICAgICAgICAgIGlmICh0b3RhbF9xdWFudGl0eS50b051bWJlcigpID09IDApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgKHRva2VuLnN5bWJvbCA9PSBcIkFDT1JOXCIpIGNvbnNvbGUubG9nKFwiVE9LRU46IC0tLS0tLS0tIFwiLCB0b2tlbi5zeW1ib2wsIHRva2VuLnN1bW1hcnkucHJpY2Uuc3RyLCB0b2tlbi5zdW1tYXJ5LnByaWNlXzI0aF9hZ28uc3RyICk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiB0aGlzLl9tYXJrZXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqLmluZGV4T2YoXCIuXCIpID09IC0xKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlID0gdGhpcy5fbWFya2V0c1tqXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbmN5X3ByaWNlID0gdGFibGUuY3VycmVuY3kuc3ltYm9sID09IFwiVExPU1wiID8gT05FIDogdGFibGUuY3VycmVuY3kuc3VtbWFyeS5wcmljZS5hbW91bnQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW5jeV9wcmljZV8yNGhfYWdvID0gdGFibGUuY3VycmVuY3kuc3ltYm9sID09IFwiVExPU1wiID8gT05FIDogdGFibGUuY3VycmVuY3kuc3VtbWFyeS5wcmljZV8yNGhfYWdvLmFtb3VudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmNvbW9kaXR5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wgfHwgdGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBob3cgbXVjaCBxdWFudGl0eSBpcyBpbnZvbHZlZCBpbiB0aGlzIG1hcmtldFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHF1YW50aXR5ID0gbmV3IEFzc2V0REVYKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFibGUuY29tb2RpdHkuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gdGFibGUuc3VtbWFyeS5hbW91bnQuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gdGFibGUuc3VtbWFyeS52b2x1bWUuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBpbmZsdWVuY2Utd2VpZ2h0IG9mIHRoaXMgbWFya2V0IG92ZXIgdGhlIHRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgd2VpZ2h0ID0gcXVhbnRpdHkuYW1vdW50LmRpdmlkZWRCeSh0b3RhbF9xdWFudGl0eS5hbW91bnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIHByaWNlIG9mIHRoaXMgdG9rZW4gaW4gdGhpcyBtYXJrZXQgKGV4cHJlc3NlZCBpbiBUTE9TKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlX2Ftb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfYW1vdW50ID0gdGFibGUuc3VtbWFyeS5wcmljZS5hbW91bnQubXVsdGlwbGllZEJ5KHRhYmxlLmN1cnJlbmN5LnN1bW1hcnkucHJpY2UuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFibGUuY3VycmVuY3kuc3ltYm9sID09IHRva2VuLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2Ftb3VudCA9IHRhYmxlLnN1bW1hcnkuaW52ZXJzZS5hbW91bnQubXVsdGlwbGllZEJ5KHRhYmxlLmNvbW9kaXR5LnN1bW1hcnkucHJpY2UuYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoaXMgbWFya2V0IHRva2VuIHByaWNlIG11bHRpcGxpZWQgYnkgdGhlIHdpZ2h0IG9mIHRoaXMgbWFya2V0IChwb25kZXJhdGVkIHByaWNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlX2kgPSBuZXcgQXNzZXRERVgocHJpY2VfYW1vdW50Lm11bHRpcGxpZWRCeSh3ZWlnaHQpLCB0aGlzLnRlbG9zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBwcmljZSBvZiB0aGlzIHRva2VuIGluIHRoaXMgbWFya2V0IDI0aCBhZ28gKGV4cHJlc3NlZCBpbiBUTE9TKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlX2luaXRfYW1vdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlLmNvbW9kaXR5LnN5bWJvbCA9PSB0b2tlbi5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZV9pbml0X2Ftb3VudCA9IHRhYmxlLnN1bW1hcnkucHJpY2VfMjRoX2Fnby5hbW91bnQubXVsdGlwbGllZEJ5KHRhYmxlLmN1cnJlbmN5LnN1bW1hcnkucHJpY2VfMjRoX2Fnby5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfaW5pdF9hbW91bnQgPSB0YWJsZS5zdW1tYXJ5LmludmVyc2VfMjRoX2Fnby5hbW91bnQubXVsdGlwbGllZEJ5KHRhYmxlLmNvbW9kaXR5LnN1bW1hcnkucHJpY2VfMjRoX2Fnby5hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhpcyBtYXJrZXQgdG9rZW4gcHJpY2UgMjRoIGFnbyBtdWx0aXBsaWVkIGJ5IHRoZSB3ZWlnaHQgb2YgdGhpcyBtYXJrZXQgKHBvbmRlcmF0ZWQgaW5pdF9wcmljZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmljZV9pbml0X2kgPSBuZXcgQXNzZXRERVgocHJpY2VfaW5pdF9hbW91bnQubXVsdGlwbGllZEJ5KHdlaWdodCksIHRoaXMudGVsb3MpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBob3cgbXVjaCB2b2x1bWUgaXMgaW52b2x2ZWQgaW4gdGhpcyBtYXJrZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2b2x1bWVfaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZS5jb21vZGl0eS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lX2kgPSB0YWJsZS5zdW1tYXJ5LnZvbHVtZS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YWJsZS5jdXJyZW5jeS5zeW1ib2wgPT0gdG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lX2kgPSB0YWJsZS5zdW1tYXJ5LmFtb3VudC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGlzIG1hcmtldCBkb2VzIG5vdCBtZXN1cmUgdGhlIHZvbHVtZSBpbiBUTE9TLCB0aGVuIGNvbnZlcnQgcXVhbnRpdHkgdG8gVExPUyBieSBtdWx0aXBsaWVkIEJ5IHZvbHVtZSdzIHRva2VuIHByaWNlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodm9sdW1lX2kudG9rZW4uc3ltYm9sICE9IHRoaXMudGVsb3Muc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lX2kgPSBuZXcgQXNzZXRERVgocXVhbnRpdHkuYW1vdW50Lm11bHRpcGxpZWRCeShxdWFudGl0eS50b2tlbi5zdW1tYXJ5LnByaWNlLmFtb3VudCksIHRoaXMudGVsb3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlID0gcHJpY2UucGx1cyhuZXcgQXNzZXRERVgocHJpY2VfaSwgdGhpcy50ZWxvcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfaW5pdCA9IHByaWNlX2luaXQucGx1cyhuZXcgQXNzZXRERVgocHJpY2VfaW5pdF9pLCB0aGlzLnRlbG9zKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWUgPSB2b2x1bWUucGx1cyhuZXcgQXNzZXRERVgodm9sdW1lX2ksIHRoaXMudGVsb3MpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItaVwiLGksIHRhYmxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSB3ZWlnaHQ6XCIsIHdlaWdodC50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSB0YWJsZS5zdW1tYXJ5LnByaWNlLnN0clwiLCB0YWJsZS5zdW1tYXJ5LnByaWNlLnN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gdGFibGUuc3VtbWFyeS5wcmljZS5hbW91bnQubXVsdGlwbGllZEJ5KHdlaWdodCkudG9OdW1iZXIoKVwiLCB0YWJsZS5zdW1tYXJ5LnByaWNlLmFtb3VudC5tdWx0aXBsaWVkQnkod2VpZ2h0KS50b051bWJlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSBjdXJyZW5jeV9wcmljZS50b051bWJlcigpXCIsIGN1cnJlbmN5X3ByaWNlLnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHByaWNlX2k6XCIsIHByaWNlX2kudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gcHJpY2UgLT5cIiwgcHJpY2Uuc3RyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLSBjdXJyZW5jeV9wcmljZV8yNGhfYWdvOlwiLCBjdXJyZW5jeV9wcmljZV8yNGhfYWdvLnRvTnVtYmVyKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItIHRhYmxlLnN1bW1hcnkucHJpY2VfMjRoX2FnbzpcIiwgdGFibGUuc3VtbWFyeS5wcmljZV8yNGhfYWdvLnN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gcHJpY2VfaW5pdF9pOlwiLCBwcmljZV9pbml0X2kudG9OdW1iZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0gcHJpY2VfaW5pdCAtPlwiLCBwcmljZV9pbml0LnN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGRpZmYgPSBwcmljZS5taW51cyhwcmljZV9pbml0KTtcbiAgICAgICAgICAgICAgICB2YXIgcmF0aW86bnVtYmVyID0gMDtcbiAgICAgICAgICAgICAgICBpZiAocHJpY2VfaW5pdC5hbW91bnQudG9OdW1iZXIoKSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhdGlvID0gZGlmZi5hbW91bnQuZGl2aWRlZEJ5KHByaWNlX2luaXQuYW1vdW50KS50b051bWJlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudCA9IE1hdGguZmxvb3IocmF0aW8gKiAxMDAwMCkgLyAxMDA7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRfc3RyID0gKGlzTmFOKHBlcmNlbnQpID8gMCA6IHBlcmNlbnQpICsgXCIlXCI7XG5cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInByaWNlXCIsIHByaWNlLnN0cik7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwcmljZV8yNGhfYWdvXCIsIHByaWNlX2luaXQuc3RyKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInZvbHVtZVwiLCB2b2x1bWUuc3RyKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInBlcmNlbnRcIiwgcGVyY2VudCk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwZXJjZW50X3N0clwiLCBwZXJjZW50X3N0cik7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJyYXRpb1wiLCByYXRpbyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJkaWZmXCIsIGRpZmYuc3RyKTtcblxuICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkucHJpY2UgPSBwcmljZTtcbiAgICAgICAgICAgICAgICB0b2tlbi5zdW1tYXJ5LnByaWNlXzI0aF9hZ28gPSBwcmljZV9pbml0O1xuICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkucGVyY2VudCA9IHBlcmNlbnQ7XG4gICAgICAgICAgICAgICAgdG9rZW4uc3VtbWFyeS5wZXJjZW50X3N0ciA9IHBlcmNlbnRfc3RyO1xuICAgICAgICAgICAgICAgIHRva2VuLnN1bW1hcnkudm9sdW1lID0gdm9sdW1lO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKGVuZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICAgICAgdGhpcy5yZXNvcnRUb2tlbnMoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VG9rZW5TdW1tYXJ5KCk7XG4gICAgICAgIH0pOyAgICAgICAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmZXRjaFRva2VucyhleHRlbmRlZDogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXBhZWUuZmV0Y2hUb2tlbnMoKVwiKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5jb250cmFjdC5nZXRUYWJsZShcInRva2Vuc1wiKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICB0b2tlbnM6IDxUb2tlbkRFWFtdPnJlc3VsdC5yb3dzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gZGF0YS50b2tlbnMpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnRva2Vuc1tpXS5zY29wZSA9IGRhdGEudG9rZW5zW2ldLnN5bWJvbC50b0xvd2VyQ2FzZSgpICsgXCIudGxvc1wiO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnRva2Vuc1tpXS5zeW1ib2wgPT0gXCJUTE9TXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZWxvcyA9IGRhdGEudG9rZW5zW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVzb3J0VG9rZW5zKCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIihpbmkpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJyZXNvcnRUb2tlbnMoKVwiKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLnRva2Vuc1swXVwiLCB0aGlzLnRva2Vuc1swXS5zdW1tYXJ5KTtcbiAgICAgICAgdGhpcy50b2tlbnMuc29ydCgoYTpUb2tlbkRFWCwgYjpUb2tlbkRFWCkgPT4ge1xuICAgICAgICAgICAgLy8gcHVzaCBvZmZjaGFpbiB0b2tlbnMgdG8gdGhlIGVuZCBvZiB0aGUgdG9rZW4gbGlzdFxuICAgICAgICAgICAgaWYgKGEub2ZmY2hhaW4pIHJldHVybiAxO1xuICAgICAgICAgICAgaWYgKGIub2ZmY2hhaW4pIHJldHVybiAtMTtcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIgLS0tIFwiLCBhLnN5bWJvbCwgXCItXCIsIGIuc3ltYm9sLCBcIiAtLS0gXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIgICAgIFwiLCBhLnN1bW1hcnkgPyBhLnN1bW1hcnkudm9sdW1lLnN0ciA6IFwiMFwiLCBcIi1cIiwgYi5zdW1tYXJ5ID8gYi5zdW1tYXJ5LnZvbHVtZS5zdHIgOiBcIjBcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBhX3ZvbCA9IGEuc3VtbWFyeSA/IGEuc3VtbWFyeS52b2x1bWUgOiBuZXcgQXNzZXRERVgoKTtcbiAgICAgICAgICAgIHZhciBiX3ZvbCA9IGIuc3VtbWFyeSA/IGIuc3VtbWFyeS52b2x1bWUgOiBuZXcgQXNzZXRERVgoKTtcblxuICAgICAgICAgICAgaWYoYV92b2wuYW1vdW50LmlzR3JlYXRlclRoYW4oYl92b2wuYW1vdW50KSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgaWYoYV92b2wuYW1vdW50LmlzTGVzc1RoYW4oYl92b2wuYW1vdW50KSkgcmV0dXJuIDE7XG5cbiAgICAgICAgICAgIGlmKGEuYXBwbmFtZSA8IGIuYXBwbmFtZSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgaWYoYS5hcHBuYW1lID4gYi5hcHBuYW1lKSByZXR1cm4gMTtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9KTsgXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJyZXNvcnRUb2tlbnMoKVwiLCB0aGlzLnRva2Vucyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKGVuZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuXG4gICAgICAgIHRoaXMub25Ub2tlbnNSZWFkeS5uZXh0KHRoaXMudG9rZW5zKTsgICAgICAgIFxuICAgIH1cblxuXG59XG5cblxuZXhwb3J0IGludGVyZmFjZSBNYXJrZXRNYXAge1xuICAgIFtrZXk6c3RyaW5nXTogTWFya2V0O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1hcmtldCB7XG4gICAgc2NvcGU6IHN0cmluZztcbiAgICBjb21vZGl0eTogVG9rZW5ERVgsXG4gICAgY3VycmVuY3k6IFRva2VuREVYLFxuICAgIGRlYWxzOiBudW1iZXI7XG4gICAgYmxvY2tzOiBudW1iZXI7XG4gICAgYmxvY2tsZXZlbHM6IGFueVtdW11bXTtcbiAgICBibG9ja2xpc3Q6IGFueVtdW107XG4gICAgcmV2ZXJzZWxldmVsczogYW55W11bXVtdO1xuICAgIHJldmVyc2VibG9ja3M6IGFueVtdW107XG4gICAgYmxvY2s6IHtbaWQ6c3RyaW5nXTpIaXN0b3J5QmxvY2t9O1xuICAgIG9yZGVyczogVG9rZW5PcmRlcnM7XG4gICAgaGlzdG9yeTogSGlzdG9yeVR4W107XG4gICAgdHg6IHtbaWQ6c3RyaW5nXTpIaXN0b3J5VHh9O1xuICAgIFxuICAgIHN1bW1hcnk6IE1hcmtldFN1bW1hcnk7XG4gICAgaGVhZGVyOiBNYXJrZXRIZWFkZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFya2V0U3VtbWFyeSB7XG4gICAgc2NvcGU6c3RyaW5nLFxuICAgIHByaWNlOkFzc2V0REVYLFxuICAgIGludmVyc2U6QXNzZXRERVgsXG4gICAgcHJpY2VfMjRoX2FnbzpBc3NldERFWCxcbiAgICBpbnZlcnNlXzI0aF9hZ286QXNzZXRERVgsXG4gICAgbWluX3ByaWNlPzpBc3NldERFWCxcbiAgICBtYXhfcHJpY2U/OkFzc2V0REVYLFxuICAgIG1pbl9pbnZlcnNlPzpBc3NldERFWCxcbiAgICBtYXhfaW52ZXJzZT86QXNzZXRERVgsXG4gICAgdm9sdW1lOkFzc2V0REVYLFxuICAgIGFtb3VudD86QXNzZXRERVgsXG4gICAgcGVyY2VudD86bnVtYmVyLFxuICAgIHBlcmNlbnRfc3RyPzpzdHJpbmcsXG4gICAgaXBlcmNlbnQ/Om51bWJlcixcbiAgICBpcGVyY2VudF9zdHI/OnN0cmluZyxcbiAgICByZWNvcmRzPzogYW55W11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBNYXJrZXRIZWFkZXIge1xuICAgIHNlbGw6T3JkZXJzU3VtbWFyeSxcbiAgICBidXk6T3JkZXJzU3VtbWFyeVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9yZGVyc1N1bW1hcnkge1xuICAgIHRvdGFsOiBBc3NldERFWDtcbiAgICBvcmRlcnM6IG51bWJlcjsgICAgXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVG9rZW5PcmRlcnMge1xuICAgIHNlbGw6T3JkZXJSb3dbXSxcbiAgICBidXk6T3JkZXJSb3dbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEhpc3RvcnlUeCB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICBzdHI6IHN0cmluZztcbiAgICBwcmljZTogQXNzZXRERVg7XG4gICAgaW52ZXJzZTogQXNzZXRERVg7XG4gICAgYW1vdW50OiBBc3NldERFWDtcbiAgICBwYXltZW50OiBBc3NldERFWDtcbiAgICBidXlmZWU6IEFzc2V0REVYO1xuICAgIHNlbGxmZWU6IEFzc2V0REVYO1xuICAgIGJ1eWVyOiBzdHJpbmc7XG4gICAgc2VsbGVyOiBzdHJpbmc7XG4gICAgZGF0ZTogRGF0ZTtcbiAgICBpc2J1eTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFdmVudExvZyB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICB1c2VyOiBzdHJpbmc7XG4gICAgZXZlbnQ6IHN0cmluZztcbiAgICBwYXJhbXM6IHN0cmluZztcbiAgICBkYXRlOiBEYXRlO1xuICAgIHByb2Nlc3NlZD86IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBIaXN0b3J5QmxvY2sge1xuICAgIGlkOiBudW1iZXI7XG4gICAgaG91cjogbnVtYmVyO1xuICAgIHN0cjogc3RyaW5nO1xuICAgIHByaWNlOiBBc3NldERFWDtcbiAgICBpbnZlcnNlOiBBc3NldERFWDtcbiAgICBlbnRyYW5jZTogQXNzZXRERVg7XG4gICAgbWF4OiBBc3NldERFWDtcbiAgICBtaW46IEFzc2V0REVYO1xuICAgIHZvbHVtZTogQXNzZXRERVg7XG4gICAgYW1vdW50OiBBc3NldERFWDtcbiAgICBkYXRlOiBEYXRlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9yZGVyIHtcbiAgICBpZDogbnVtYmVyO1xuICAgIHByaWNlOiBBc3NldERFWDtcbiAgICBpbnZlcnNlOiBBc3NldERFWDtcbiAgICB0b3RhbDogQXNzZXRERVg7XG4gICAgZGVwb3NpdDogQXNzZXRERVg7XG4gICAgdGVsb3M6IEFzc2V0REVYO1xuICAgIG93bmVyOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXNlck9yZGVyc01hcCB7XG4gICAgW2tleTpzdHJpbmddOiBVc2VyT3JkZXJzO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJPcmRlcnMge1xuICAgIHRhYmxlOiBzdHJpbmc7XG4gICAgaWRzOiBudW1iZXJbXTtcbiAgICBvcmRlcnM/OmFueVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9yZGVyUm93IHtcbiAgICBzdHI6IHN0cmluZztcbiAgICBwcmljZTogQXNzZXRERVg7XG4gICAgb3JkZXJzOiBPcmRlcltdO1xuICAgIGludmVyc2U6IEFzc2V0REVYO1xuICAgIHRvdGFsOiBBc3NldERFWDtcbiAgICBzdW06IEFzc2V0REVYO1xuICAgIHN1bXRlbG9zOiBBc3NldERFWDtcbiAgICB0ZWxvczogQXNzZXRERVg7XG4gICAgb3duZXJzOiB7W2tleTpzdHJpbmddOmJvb2xlYW59XG59IiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFZhcGFlZURFWCB9IGZyb20gJy4vZGV4LnNlcnZpY2UnXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXSxcbiAgcHJvdmlkZXJzOiBbVmFwYWVlREVYXSxcbiAgZXhwb3J0czogW11cbn0pXG5leHBvcnQgY2xhc3MgVmFwYWVlRGV4TW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbInRzbGliXzEuX19leHRlbmRzIiwiVG9rZW4iLCJBc3NldCIsIlN1YmplY3QiLCJGZWVkYmFjayIsIkluamVjdGFibGUiLCJWYXBhZWVTY2F0dGVyIiwiQ29va2llU2VydmljZSIsIkRhdGVQaXBlIiwiTmdNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0lBQUE7Ozs7Ozs7Ozs7Ozs7O0lBY0E7SUFFQSxJQUFJLGFBQWEsR0FBRyxVQUFTLENBQUMsRUFBRSxDQUFDO1FBQzdCLGFBQWEsR0FBRyxNQUFN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QUFDOzRCQUFDLE1BQU07d0JBQzlCLEtBQUssQ0FBQzs0QkFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7NEJBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO3dCQUN4RCxLQUFLLENBQUM7NEJBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDOzRCQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQUMsU0FBUzt3QkFDakQsS0FBSyxDQUFDOzRCQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDOzRCQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7NEJBQUMsU0FBUzt3QkFDakQ7NEJBQ0ksSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dDQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7Z0NBQUMsU0FBUzs2QkFBRTs0QkFDNUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0NBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQUMsTUFBTTs2QkFBRTs0QkFDdEYsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dDQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0NBQUMsTUFBTTs2QkFBRTs0QkFDckUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0NBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0NBQUMsTUFBTTs2QkFBRTs0QkFDbkUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7NEJBQ3RCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7NEJBQUMsU0FBUztxQkFDOUI7b0JBQ0QsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUM5QjtnQkFBQyxPQUFPLENBQUMsRUFBRTtvQkFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFBRTt3QkFBUztvQkFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFBRTtZQUMxRCxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2dCQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztTQUNwRjtJQUNMLENBQUM7Ozs7OztRQ25FRDtRQUE4QkEsNEJBQUs7UUErQi9CLGtCQUFZLEdBQWM7WUFBZCxvQkFBQTtnQkFBQSxVQUFjOztZQUExQixZQUNJLGtCQUFNLEdBQUcsQ0FBQyxTQVFiO1lBUEcsSUFBSSxPQUFPLEdBQUcsSUFBSSxRQUFRLEVBQUU7Z0JBQ3hCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFDbEIsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDO2dCQUNyQixPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQzVCO1lBQ0QsS0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOztTQUNuQjt1QkF6RUw7TUFpQzhCQyxRQUFLLEVBMkNsQzs7Ozs7O1FDcEVEO1FBQThCRCw0QkFBSztRQUkvQixrQkFBWSxDQUFhLEVBQUUsQ0FBYTtZQUE1QixrQkFBQTtnQkFBQSxRQUFhOztZQUFFLGtCQUFBO2dCQUFBLFFBQWE7O1lBQXhDLFlBQ0ksa0JBQU0sQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQVliO1lBVkcsSUFBSSxDQUFDLFlBQVksUUFBUSxFQUFFO2dCQUN2QixLQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ3ZCLEtBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDOzthQUVsQjtZQUVELElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQ3pCLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3RCOztTQUVKOzs7O1FBRUQsd0JBQUs7OztZQUFMO2dCQUNJLE9BQU8sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDaEQ7Ozs7O1FBRUQsdUJBQUk7Ozs7WUFBSixVQUFLLENBQVU7Z0JBQ1gsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLDBCQUEwQixFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzdELE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUscURBQXFELEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztnQkFDeEksSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN4QyxPQUFPLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDM0M7Ozs7O1FBRUQsd0JBQUs7Ozs7WUFBTCxVQUFNLENBQVU7Z0JBQ1osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLDBCQUEwQixFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzdELE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsMkRBQTJELEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztnQkFDOUksSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN6QyxPQUFPLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDM0M7Ozs7OztRQUVELDJCQUFROzs7OztZQUFSLFVBQVMsSUFBWSxFQUFFLEdBQWU7Z0JBQ2xDLElBQUksSUFBSSxJQUFJLEVBQUU7b0JBQUUsT0FBTzs7Z0JBQ3ZCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7Z0JBQ2xDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDM0M7Ozs7O1FBR0QsMkJBQVE7Ozs7WUFBUixVQUFTLFFBQW9CO2dCQUFwQix5QkFBQTtvQkFBQSxZQUFtQixDQUFDOztnQkFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO29CQUFFLE9BQU8sUUFBUSxDQUFDO2dCQUNqQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQy9FOzs7OztRQUVELDBCQUFPOzs7O1lBQVAsVUFBUSxLQUFlOztnQkFDbkIsSUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Z0JBQ3JELElBQUksS0FBSyxHQUFJLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDekMsT0FBTyxLQUFLLENBQUM7YUFDaEI7dUJBL0RMO01BUThCRSxRQUFLLEVBd0RsQzs7Ozs7OztRQ2NHLG1CQUNZLFNBQ0EsU0FDQTtZQUhaLGlCQTJEQztZQTFEVyxZQUFPLEdBQVAsT0FBTztZQUNQLFlBQU8sR0FBUCxPQUFPO1lBQ1AsYUFBUSxHQUFSLFFBQVE7eUNBN0MyQixJQUFJQyxZQUFPLEVBQUU7MENBQ1osSUFBSUEsWUFBTyxFQUFFO21DQUNwQixJQUFJQSxZQUFPLEVBQUU7bUNBQ04sSUFBSUEsWUFBTyxFQUFFO2lDQUVsQixJQUFJQSxZQUFPLEVBQUU7aUNBQ2IsSUFBSUEsWUFBTyxFQUFFO2tDQUNuQixJQUFJQSxZQUFPLEVBQUU7Z0NBQzVCLGNBQWM7b0NBRVYsRUFBRTtvQ0FTWSxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU87Z0JBQ3hELEtBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDO2FBQ2xDLENBQUM7a0NBR29DLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTztnQkFDdEQsS0FBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUM7YUFDaEMsQ0FBQztxQ0FHdUMsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPO2dCQUN6RCxLQUFJLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDO2FBQ25DLENBQUM7b0NBR3NDLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTztnQkFDeEQsS0FBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUM7YUFDbEMsQ0FBQztvQ0FHc0MsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPO2dCQUN4RCxLQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQzthQUNsQyxDQUFDO1lBTUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFDLEtBQUssRUFBQyxDQUFDLEVBQUUsTUFBTSxFQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQzVCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUN2QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSUMsaUJBQVEsRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDNUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO2dCQUN4QixLQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQzFCLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDO29CQUMxQixPQUFPLEVBQUUsYUFBYTtvQkFDdEIsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLElBQUksRUFBRSwrQkFBK0I7b0JBQ3JDLE1BQU0sRUFBRSxrQ0FBa0M7b0JBQzFDLFNBQVMsRUFBRSxDQUFDO29CQUNaLEtBQUssRUFBRSxhQUFhO29CQUNwQixNQUFNLEVBQUUsT0FBTztvQkFDZixRQUFRLEVBQUUsS0FBSztvQkFDZixPQUFPLEVBQUUseUJBQXlCO2lCQUNyQyxDQUFDLENBQUMsQ0FBQztnQkFDSixLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQztvQkFDMUIsT0FBTyxFQUFFLGFBQWE7b0JBQ3RCLFFBQVEsRUFBRSxjQUFjO29CQUN4QixJQUFJLEVBQUUsK0JBQStCO29CQUNyQyxNQUFNLEVBQUUsa0NBQWtDO29CQUMxQyxTQUFTLEVBQUUsQ0FBQztvQkFDWixLQUFLLEVBQUUsYUFBYTtvQkFDcEIsTUFBTSxFQUFFLE9BQU87b0JBQ2YsUUFBUSxFQUFFLEtBQUs7b0JBQ2YsT0FBTyxFQUFFLHlCQUF5QjtpQkFDckMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0osS0FBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLFFBQVEsQ0FBQyxhQUFhLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQ3BELEtBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDdkIsS0FBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3hCLEtBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDdkIsS0FBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7YUFDL0IsQ0FBQyxDQUFDOztZQU1ILElBQUksS0FBSyxDQUFDO1lBQ1YsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsVUFBQSxPQUFPO2dCQUNsQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3BCLEtBQUssR0FBRyxVQUFVLENBQUMsVUFBQSxDQUFDO29CQUNoQixLQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztpQkFDOUIsRUFBRSxHQUFHLENBQUMsQ0FBQzthQUNYLENBQUMsQ0FBQztTQUlOO1FBR0Qsc0JBQUksOEJBQU87Ozs7Z0JBQVg7Z0JBQ0ksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQzthQUMvQjs7O1dBQUE7UUFFRCxzQkFBSSw2QkFBTTs7O2dCQUFWO2dCQUNJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQU9qRDtnQkFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTTtxQkFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUk7b0JBQzdFLElBQUksQ0FBQzthQUNaOzs7V0FBQTtRQUVELHNCQUFJLDhCQUFPOzs7Z0JBQVg7Z0JBQ0ksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU07b0JBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTztvQkFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7YUFDeEI7OztXQUFBOzs7OztRQUdELHlCQUFLOzs7WUFBTDtnQkFBQSxpQkFlQztnQkFkRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrREFBa0QsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNoRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2QsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLGtEQUFrRCxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDdEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQztvQkFDN0IsS0FBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN0QixLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQ3hDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQSxDQUFDO29CQUNOLEtBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDckMsTUFBTSxDQUFDLENBQUM7aUJBQ1gsQ0FBQyxDQUFDO2FBQ047Ozs7UUFFRCwwQkFBTTs7O1lBQU47Z0JBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ3pCOzs7O1FBRUQsNEJBQVE7OztZQUFSO2dCQUFBLGlCQVFDO2dCQVBHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN0QixJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzdCLFVBQVUsQ0FBQyxVQUFBLENBQUMsSUFBTyxLQUFJLENBQUMsV0FBVyxHQUFHLEtBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQzlEOzs7OztRQUVELDJCQUFPOzs7O1lBQVAsVUFBUSxJQUFXO2dCQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNuQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzFDOzs7O1FBRUQsa0NBQWM7OztZQUFkO2dCQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtvQkFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDM0M7cUJBQU07b0JBQ0gsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2lCQUNuQjthQUNKOzs7OztRQUVLLHVDQUFtQjs7OztZQUF6QixVQUEwQixPQUFjOzs7Ozs7Z0NBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO3NDQUM3RSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLENBQUE7b0NBQTdGLHdCQUE2RjtnQ0FDN0YsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO2dDQUN0QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7Z0NBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztzQ0FDeEIsT0FBTyxJQUFJLE9BQU8sQ0FBQTtvQ0FBbEIsd0JBQWtCO2dDQUNsQixLQUFBLElBQUksQ0FBQyxPQUFPLENBQUE7Z0NBQVEscUJBQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFBOztnQ0FBaEUsR0FBYSxJQUFJLEdBQUcsU0FBNEMsQ0FBQzs7O2dDQUVqRSxPQUFPLENBQUMsS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7Z0NBQzVELE9BQU8sQ0FBQyxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztnQ0FDNUQsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dDQUNwRixPQUFPLENBQUMsS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7Z0NBQzVELE9BQU8sQ0FBQyxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQzs7OztnQ0FHaEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7Z0NBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDOztnQ0FFckIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dDQUNwRCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztnQ0FDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDOzs7Ozs7YUFFOUM7Ozs7UUFFTyxrQ0FBYzs7Ozs7Z0JBQ2xCLElBQUksQ0FBQyxVQUFVLEdBQUcsWUFBWSxDQUFDO2dCQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUM1RixJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7b0JBQzVCLEtBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDOztvQkFFOUIsSUFBSSxLQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTt3QkFDckIsS0FBSSxDQUFDLFVBQVUsR0FBRyxZQUFZLENBQUM7O3FCQUVsQztvQkFDRCxLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsS0FBSSxDQUFDLFVBQVUsRUFBRSxLQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2lCQUMvRixDQUFDLENBQUM7O2dCQUVILElBQUksTUFBTSxDQUFDOztnQkFDWCxJQUFJLE1BQU0sR0FBRyxXQUFXLENBQUMsVUFBQSxDQUFDO29CQUN0QixJQUFJLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO3dCQUN2QyxLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQ3pDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDdEIsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUN6QjtpQkFDSixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUVSLE1BQU0sR0FBRyxVQUFVLENBQUMsVUFBQSxDQUFDO29CQUNqQixhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3RCLEtBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDNUMsRUFBRSxJQUFJLENBQUMsQ0FBQzs7Ozs7O1FBSUMsa0NBQWM7Ozs7c0JBQUMsSUFBWTs7Ozt3QkFDckMsc0JBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBTSxDQUFDOzs7d0NBQ3BELHNCQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFDOzs7NkJBQzVCLENBQUMsRUFBQzs7Ozs7Ozs7Ozs7UUFJUCwrQkFBVzs7Ozs7O1lBQVgsVUFBWSxJQUFXLEVBQUUsTUFBZSxFQUFFLEtBQWM7Z0JBQXhELGlCQWtCQzs7O2dCQWZHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzFDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO29CQUNuQyxLQUFLLEVBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSTtvQkFDakMsSUFBSSxFQUFFLElBQUk7b0JBQ1YsS0FBSyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUN6QixLQUFLLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7aUJBQzNCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBTSxNQUFNOzs7NEJBQ2hCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7NEJBQzNDLHNCQUFPLE1BQU0sRUFBQzs7O2lCQUNqQixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsQ0FBQztvQkFDTixLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEdBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUMzQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqQixNQUFNLENBQUMsQ0FBQztpQkFDWCxDQUFDLENBQUM7YUFDTjs7Ozs7Ozs7UUFFRCwrQkFBVzs7Ozs7OztZQUFYLFVBQVksSUFBVyxFQUFFLFFBQWlCLEVBQUUsUUFBaUIsRUFBRSxNQUFlO2dCQUE5RSxpQkFzQkM7OztnQkFuQkcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDM0MsS0FBSyxJQUFJLENBQUMsSUFBSSxNQUFNLEVBQUU7b0JBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFDLElBQUksR0FBQyxHQUFHLEdBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUFFO2dCQUNuRixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtvQkFDcEMsS0FBSyxFQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUk7b0JBQ2pDLElBQUksRUFBRSxJQUFJO29CQUNWLFFBQVEsRUFBRSxRQUFRLENBQUMsTUFBTTtvQkFDekIsUUFBUSxFQUFFLFFBQVEsQ0FBQyxNQUFNO29CQUN6QixNQUFNLEVBQUUsTUFBTTtpQkFDakIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFNLE1BQU07Ozs7NEJBQ2hCLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDOzRCQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEdBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDOzRCQUM1QyxLQUFTLENBQUMsSUFBSSxNQUFNLEVBQUU7Z0NBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFDLElBQUksR0FBQyxHQUFHLEdBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDOzZCQUFFOzRCQUNwRixzQkFBTyxNQUFNLEVBQUM7OztpQkFDakIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLENBQUM7b0JBQ04sS0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDNUMsS0FBSyxJQUFJLENBQUMsSUFBSSxNQUFNLEVBQUU7d0JBQUUsS0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFDLElBQUksR0FBQyxHQUFHLEdBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO3FCQUFFO29CQUNwRixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqQixNQUFNLENBQUMsQ0FBQztpQkFDWCxDQUFDLENBQUM7YUFDTjs7Ozs7UUFFRCwyQkFBTzs7OztZQUFQLFVBQVEsUUFBaUI7Z0JBQXpCLGlCQXdCQzs7Z0JBdEJHLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdEUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsR0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDM0UsT0FBTyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRTtvQkFDakMsSUFBSSxFQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUk7b0JBQ2hDLEVBQUUsRUFBRSxJQUFJLENBQUMsWUFBWTtvQkFDckIsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUU7b0JBQzdCLElBQUksRUFBRSxTQUFTO2lCQUNsQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQU0sTUFBTTs7OzRCQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7NEJBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsR0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztzQ0FDbEUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO3NDQUNuQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7NEJBQzdCLHNCQUFPLE1BQU0sRUFBQzs7O2lCQUNqQixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsQ0FBQztvQkFDTixLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ3ZDLEtBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsR0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDNUUsS0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25GLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLE1BQU0sQ0FBQyxDQUFDO2lCQUNYLENBQUMsQ0FBQzthQUNOOzs7OztRQUVELDRCQUFROzs7O1lBQVIsVUFBUyxRQUFpQjtnQkFBMUIsaUJBbUJDO2dCQWxCRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxHQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM1RSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRTtvQkFDdEMsS0FBSyxFQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUk7b0JBQ2pDLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFO2lCQUNoQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQU0sTUFBTTs7OzRCQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7NEJBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsR0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztzQ0FDbkUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO3NDQUNuQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7NEJBQzdCLHNCQUFPLE1BQU0sRUFBQzs7O2lCQUNqQixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsQ0FBQztvQkFDTixLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ3hDLEtBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsR0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDN0UsS0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BGLE1BQU0sQ0FBQyxDQUFDO2lCQUNYLENBQUMsQ0FBQzthQUNOOzs7Ozs7UUFHRCxvQ0FBZ0I7Ozs7WUFBaEIsVUFBaUIsUUFBa0I7Z0JBQW5DLGlCQWdCQztnQkFmRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQztvQkFDeEIsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxRQUFRLENBQUM7d0JBQzFCLE1BQU0sRUFBRSxRQUFRLENBQUMsTUFBTTt3QkFDdkIsU0FBUyxFQUFFLFFBQVEsQ0FBQyxTQUFTLElBQUksQ0FBQzt3QkFDbEMsUUFBUSxFQUFFLFlBQVk7d0JBQ3RCLE9BQU8sRUFBRSxRQUFRLENBQUMsT0FBTzt3QkFDekIsT0FBTyxFQUFFLEVBQUU7d0JBQ1gsSUFBSSxFQUFDLEVBQUU7d0JBQ1AsTUFBTSxFQUFFLEVBQUU7d0JBQ1YsS0FBSyxFQUFFLEVBQUU7d0JBQ1QsSUFBSSxFQUFFLElBQUk7d0JBQ1YsUUFBUSxFQUFFLEtBQUs7d0JBQ2YsUUFBUSxFQUFFLElBQUk7cUJBQ2pCLENBQUMsQ0FBQyxDQUFDO2lCQUNQLENBQUMsQ0FBQzthQUNOOzs7O1FBS00sNkJBQVM7Ozs7Z0JBQ1osT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQzs7Ozs7O1FBR3BCLDBCQUFNOzs7O3NCQUFDLEtBQVk7Z0JBQ3RCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7b0JBQUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDOztnQkFDdEQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdkMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztvQkFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzFELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztvQkFBRSxPQUFPLElBQUksQ0FBQztnQkFDekMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7OztRQUdoRCx5QkFBSzs7OztzQkFBQyxLQUFZOztnQkFFckIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7Ozs7UUFHdEIsMkJBQU87Ozs7c0JBQUMsS0FBWTs7Z0JBQ3hCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7O2dCQUMzQyxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNqRCxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxhQUFhLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQzs7Z0JBQ2hGLElBQUksYUFBYSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3hELElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtvQkFDNUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDLENBQUM7aUJBQzVFO2dCQUNELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQzs7Ozs7OztRQUdqQyw2QkFBUzs7Ozs7c0JBQUMsUUFBaUIsRUFBRSxRQUFpQjs7Z0JBQ2pELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNqRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7Ozs7UUFHdEIsNEJBQVE7Ozs7O3NCQUFDLFFBQWlCLEVBQUUsUUFBaUI7Z0JBQ2hELE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUMsUUFBUSxDQUFDLE1BQU0sRUFBQyxhQUFhLENBQUMsQ0FBQztnQkFDMUUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzs7Ozs7O1FBR3ZDLHlDQUFxQjs7OztzQkFBQyxLQUFZOztnQkFFckMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7Z0JBQzNDLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7O2dCQUNqRCxJQUFJLEtBQUssR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztnQkFFNUMsSUFBSSxlQUFlLEdBQWUsRUFBRSxDQUFDO2dCQUVyQyxLQUFLLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7O29CQUN6QixJQUFJLEdBQUcsR0FBYTt3QkFDaEIsRUFBRSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDdkIsR0FBRyxFQUFFLEVBQUU7d0JBQ1AsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTt3QkFDdkMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTt3QkFDdkMsTUFBTSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTt3QkFDeEMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTt3QkFDeEMsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTTt3QkFDOUIsTUFBTSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSzt3QkFDOUIsTUFBTSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTt3QkFDeEMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTt3QkFDeEMsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTt3QkFDM0IsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO3FCQUNqQyxDQUFDO29CQUNGLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO29CQUMvQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUM3Qjs7Z0JBR0QsSUFBSSxjQUFjLEdBQWU7b0JBQzdCLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUU7aUJBQ3BCLENBQUM7Z0JBRUYsS0FBSyxJQUFJLElBQUksSUFBSSxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLE1BQU0sRUFBQyxFQUFFOztvQkFDdkMsSUFBSSxVQUFVLENBQVM7O29CQUN2QixJQUFJLFNBQVMsQ0FBTztvQkFFcEIsS0FBSyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFOzt3QkFDOUIsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFaEMsVUFBVSxHQUFHLEVBQUUsQ0FBQzt3QkFDaEIsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUNwQyxTQUFTLEdBQUc7Z0NBQ1IsT0FBTyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtnQ0FDdEMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQ0FDcEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtnQ0FDcEMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtnQ0FDcEMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSztnQ0FDMUIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSztnQ0FDMUIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSzs2QkFDN0IsQ0FBQTs0QkFDRCxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3lCQUM5Qjs7d0JBRUQsSUFBSSxNQUFNLEdBQVk7NEJBQ2xCLE9BQU8sRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTs0QkFDMUIsTUFBTSxFQUFFLFVBQVU7NEJBQ2xCLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTs0QkFDbEIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFOzRCQUMxQixHQUFHLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHOzRCQUNwQixHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUU7NEJBQ3pCLFFBQVEsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTs0QkFDekIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFOzRCQUN4QixLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7eUJBRTNCLENBQUM7d0JBQ0YsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztxQkFDckM7aUJBQ0o7O2dCQUVELElBQUksT0FBTyxHQUFVO29CQUNqQixLQUFLLEVBQUUsYUFBYTtvQkFDcEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO29CQUN4QixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7b0JBQ3hCLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztvQkFDbEIsU0FBUyxFQUFFLEtBQUssQ0FBQyxhQUFhO29CQUM5QixhQUFhLEVBQUUsS0FBSyxDQUFDLFNBQVM7b0JBQzlCLFdBQVcsRUFBRSxLQUFLLENBQUMsYUFBYTtvQkFDaEMsYUFBYSxFQUFFLEtBQUssQ0FBQyxXQUFXO29CQUNoQyxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07b0JBQ3BCLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztvQkFDbEIsTUFBTSxFQUFFO3dCQUNKLElBQUksRUFBRTs0QkFDRixLQUFLLEVBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTs0QkFDcEMsTUFBTSxFQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU07eUJBQ2pDO3dCQUNELEdBQUcsRUFBRTs0QkFDRCxLQUFLLEVBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTs0QkFDckMsTUFBTSxFQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU07eUJBQ2xDO3FCQUNKO29CQUNELE9BQU8sRUFBRSxlQUFlO29CQUN4QixNQUFNLEVBQUU7d0JBQ0osSUFBSSxFQUFFLGNBQWMsQ0FBQyxHQUFHOzt3QkFDeEIsR0FBRyxFQUFFLGNBQWMsQ0FBQyxJQUFJO3FCQUMzQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7d0JBQzdDLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU87d0JBQzVCLGFBQWEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQWU7d0JBQzVDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUs7d0JBQzVCLGVBQWUsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWE7d0JBQzVDLFdBQVcsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVM7d0JBQ3BDLFNBQVMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVc7d0JBQ3BDLFdBQVcsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVM7d0JBQ3BDLFNBQVMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVc7d0JBQ3BDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU87d0JBQzlCLE1BQU0sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU07d0JBQzVCLE1BQU0sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU07d0JBQzVCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVE7d0JBQy9CLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU87d0JBQy9CLFdBQVcsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVk7d0JBQ3ZDLFlBQVksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVc7cUJBQzFDO29CQUNELEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRTtpQkFDZixDQUFBO2dCQUNELE9BQU8sT0FBTyxDQUFDOzs7Ozs7O1FBR1osK0JBQVc7Ozs7O3NCQUFDLFFBQWlCLEVBQUUsUUFBaUI7Z0JBQ25ELElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRO29CQUFFLE9BQU8sRUFBRSxDQUFDO2dCQUN0QyxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7Ozs7OztRQUd4RSxnQ0FBWTs7OztzQkFBQyxLQUFZO2dCQUM1QixJQUFJLENBQUMsS0FBSztvQkFBRSxPQUFPLEtBQUssQ0FBQztnQkFDekIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssSUFBRyxRQUFRLEVBQUUsb0NBQW9DLEVBQUUsT0FBTyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7O2dCQUNuRyxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFLGdEQUFnRCxFQUFFLE9BQU8sS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDOztnQkFDekcsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLE9BQU8sT0FBTyxDQUFDOzs7Ozs7UUFHWixrQ0FBYzs7OztzQkFBQyxLQUFZO2dCQUM5QixJQUFJLENBQUMsS0FBSztvQkFBRSxPQUFPLEtBQUssQ0FBQztnQkFDekIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssSUFBRyxRQUFRLEVBQUUsb0NBQW9DLEVBQUUsT0FBTyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7O2dCQUNuRyxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFLGdEQUFnRCxFQUFFLE9BQU8sS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDOztnQkFDekcsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sRUFBRTtvQkFDcEIsT0FBTyxLQUFLLENBQUM7aUJBQ2hCO2dCQUNELElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sRUFBRTtvQkFDcEIsT0FBTyxPQUFPLENBQUM7aUJBQ2xCO2dCQUNELElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDckIsT0FBTyxLQUFLLENBQUM7aUJBQ2hCO3FCQUFNO29CQUNILE9BQU8sT0FBTyxDQUFDO2lCQUNsQjs7Ozs7O1FBSUUsK0JBQVc7Ozs7c0JBQUMsS0FBWTtnQkFDM0IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQzs7Ozs7Ozs7UUFRL0MsOEJBQVU7Ozs7WUFBVixVQUFXLEtBQWM7Z0JBQ3JCLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDekIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTt3QkFDL0MsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMzQjtpQkFDSjtnQkFDRCxPQUFPLElBQUksUUFBUSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ2xEOzs7OztRQUVLLHlDQUFxQjs7OztZQUEzQixVQUE0QixNQUFvQjtnQkFBcEIsdUJBQUE7b0JBQUEsYUFBb0I7Ozs7Ozt3QkFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO3dCQUM3QyxNQUFNLEdBQUcsTUFBTSxDQUFDO3dCQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUMsTUFBTSxJQUFJLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDMUQsc0JBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDOztnQ0FDN0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO2dDQUVqQixLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO29DQUN0QixJQUFJLE1BQU0sRUFBRTt3Q0FDUixJQUFJLEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sRUFBRTs0Q0FDakMsS0FBSyxHQUFHLEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7eUNBQzFCO3FDQUNKOztvQ0FFRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7O29DQUUzQixJQUFJLENBQUMsS0FBSyxJQUFJLE1BQU0sR0FBRyxHQUFHLEVBQUU7d0NBQ3hCLEtBQUssR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dDQUM1QyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUU7NENBQ1osTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs0Q0FDdkIsSUFBSSxNQUFNLEdBQUcsR0FBRyxFQUFFO2dEQUNkLEtBQUssR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDOzZDQUN0Qjt5Q0FDSjs2Q0FBTTs0Q0FDSCxLQUFLLEdBQUcsSUFBSSxDQUFDO3lDQUNoQjtxQ0FDSjtvQ0FFRCxJQUFJLENBQUMsR0FBQyxHQUFHLElBQUksS0FBSyxJQUFJLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFBRTt3Q0FDaEUsS0FBSyxHQUFHLElBQUksQ0FBQztxQ0FDaEI7O29DQUlELElBQUksS0FBSyxFQUFFO3dDQUNQLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7O3dDQUN2QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUM7O3dDQUM3QyxJQUFJLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxFQUFFLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUksQ0FBQyxDQUFDOzt3Q0FDbkUsSUFBSSxJQUFJLEdBQUcsVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLEVBQUUsR0FBRSxhQUFhLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxrQ0FBa0MsQ0FBQzt3Q0FDcEgsT0FBTyxLQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7NENBQ25DLEVBQUUsRUFBRyxLQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJOzRDQUM5QixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRTs0Q0FDN0IsSUFBSSxFQUFFLElBQUk7eUNBQ2IsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUM7NENBQ0wsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDOzRDQUNuQixLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUMsTUFBTSxJQUFJLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQzs0Q0FDM0QsT0FBTyxJQUFJLENBQUM7eUNBQ2YsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLENBQUM7NENBQ04sS0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxHQUFDLE1BQU0sSUFBSSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7NENBQzNELE1BQU0sQ0FBQyxDQUFDO3lDQUNYLENBQUMsQ0FBQztxQ0FDTjtpQ0FDSjs2QkFDSixDQUFDLEVBQUE7OzthQUNMOzs7OztRQUVELCtCQUFXOzs7O1lBQVgsVUFBWSxHQUFVO2dCQUNsQixJQUFJLENBQUMsR0FBRztvQkFBRSxPQUFPLElBQUksQ0FBQztnQkFDdEIsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFOztvQkFFdkIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7O3dCQUUxRSxTQUFTO3FCQUNaO29CQUVELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFFO3dCQUMxRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3pCO2lCQUNKO2dCQUNELE9BQU8sSUFBSSxDQUFDO2FBQ2Y7Ozs7O1FBRUssNEJBQVE7Ozs7WUFBZCxVQUFlLEdBQVU7Ozs7d0JBQ3JCLHNCQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDO2dDQUMvQixPQUFPLEtBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7NkJBQ2hDLENBQUMsRUFBQzs7O2FBQ047Ozs7O1FBRUssK0JBQVc7Ozs7WUFBakIsVUFBa0IsT0FBcUI7Z0JBQXJCLHdCQUFBO29CQUFBLGNBQXFCOzs7Ozt3QkFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO3dCQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ3ZDLHNCQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBTSxDQUFDOzs7Ozs7Z0RBQ2pDLFFBQVEsR0FBZSxFQUFFLENBQUM7Z0RBQzlCLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7b0RBQy9CLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztpREFDL0I7cURBQ0csT0FBTztvREFBUCx3QkFBTztnREFDTSxxQkFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFBOztnREFBMUMsTUFBTSxHQUFHLFNBQWlDO2dEQUM5QyxLQUFTLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO29EQUN2QixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7aURBQzVEOzs7Z0RBRUwsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7Z0RBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztnREFDeEMsc0JBQU8sSUFBSSxDQUFDLFFBQVEsRUFBQzs7Ozs2QkFDeEIsQ0FBQyxFQUFDOzs7YUFDTjs7Ozs7UUFFSywrQkFBVzs7OztZQUFqQixVQUFrQixPQUFxQjtnQkFBckIsd0JBQUE7b0JBQUEsY0FBcUI7Ozs7O3dCQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7d0JBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDdkMsc0JBQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFNLENBQUM7Ozs7OztnREFFckMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtvREFDL0IsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2lEQUMvQjtxREFDRyxPQUFPO29EQUFQLHdCQUFPO2dEQUNLLHFCQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUE7O2dEQUE3QyxTQUFTLEdBQUcsU0FBaUMsQ0FBQzs7O2dEQUVsRCxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQzs7Z0RBRTFCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztnREFDeEMsc0JBQU8sSUFBSSxDQUFDLFFBQVEsRUFBQzs7Ozs2QkFDeEIsQ0FBQyxFQUFDOzs7YUFDTjs7Ozs7O1FBRUsscUNBQWlCOzs7OztZQUF2QixVQUF3QixLQUFZLEVBQUUsR0FBWTs7Ozt3QkFDOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUN6QyxzQkFBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQU0sQ0FBQzs7Ozs7O2dEQUNqQyxNQUFNLEdBQUcsRUFBRSxDQUFDOzsyREFDRixHQUFHOzs7Ozs7OztnREFDVCxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dEQUNaLEtBQUssR0FBRyxLQUFLLENBQUM7Z0RBQ2xCLEtBQVMsQ0FBQyxJQUFJLE1BQU0sRUFBRTtvREFDbEIsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRTt3REFDcEIsS0FBSyxHQUFHLElBQUksQ0FBQzt3REFDYixNQUFNO3FEQUNUO2lEQUNKO2dEQUNELElBQUksS0FBSyxFQUFFO29EQUNQLHdCQUFTO2lEQUNaO2dEQUNxQixxQkFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBQyxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUMsQ0FBQyxFQUFBOztnREFBM0YsR0FBRyxHQUFlLFNBQXlFO2dEQUUvRixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7OztnREFFckMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dEQUMxQyxzQkFBTyxNQUFNLEVBQUM7Ozs7NkJBQ2pCLENBQUMsRUFBQzs7O2FBQ047Ozs7O1FBRUssaUNBQWE7Ozs7WUFBbkIsVUFBb0IsT0FBcUI7Z0JBQXJCLHdCQUFBO29CQUFBLGNBQXFCOzs7Ozt3QkFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO3dCQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ3pDLHNCQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBTSxDQUFDOzs7Ozs7Z0RBRXJDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7b0RBQy9CLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztpREFDL0I7cURBQ0csT0FBTztvREFBUCx3QkFBTztnREFDTSxxQkFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxFQUFBOztnREFBaEQsVUFBVSxHQUFHLFNBQW1DLENBQUM7OztnREFFakQsSUFBSSxxQkFBK0IsVUFBVSxDQUFDLElBQUksRUFBQztnREFDbkQsR0FBRyxHQUFrQixFQUFFLENBQUM7Z0RBQ25CLENBQUMsR0FBQyxDQUFDOzs7c0RBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxNQUFNLENBQUE7O2dEQUNuQixHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnREFDbEIsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0RBQ2IscUJBQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsRUFBQTs7Z0RBQWpELE1BQU0sR0FBRyxTQUF3QztnREFDckQsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHO29EQUNULEtBQUssRUFBRSxLQUFLO29EQUNaLE1BQU0sRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDO29EQUMzQyxHQUFHLEVBQUMsR0FBRztpREFDVixDQUFDOzs7Z0RBUnVCLENBQUMsRUFBRSxDQUFBOzs7Z0RBVWhDLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDOztnREFFdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dEQUMxQyxzQkFBTyxJQUFJLENBQUMsVUFBVSxFQUFDOzs7OzZCQUMxQixDQUFDLEVBQUM7OzthQUVOOzs7O1FBRUssa0NBQWM7OztZQUFwQjs7Ozs7O2dDQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQ0FDbkMsUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztnQ0FDekIscUJBQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxFQUFBOztnQ0FBbEQsS0FBSyxHQUFHLFNBQTBDO2dDQUN0RCxxQkFBTSxPQUFPLENBQUMsR0FBRyxDQUFDO3dDQUNkLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFDLENBQUMsRUFBRSxRQUFRLENBQUM7d0NBQ3JDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFDLENBQUMsRUFBRSxRQUFRLENBQUM7d0NBQ3JDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFDLENBQUMsRUFBRSxRQUFRLENBQUM7cUNBQ3hDLENBQUMsRUFBQTs7Z0NBSkYsU0FJRSxDQUFDO2dDQUNILElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQzs7Ozs7YUFDM0M7Ozs7UUFFSyxvQ0FBZ0I7OztZQUF0Qjs7Ozs7O2dDQUNJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUM7b0NBQUUsc0JBQU87Z0NBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQ0FDbkMsUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztnQ0FDakMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDeEQsRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDO2dDQUN6QixJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUM7Z0NBRXpDLHFCQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxFQUFBOztnQ0FBeEMsU0FBd0MsQ0FBQztnQ0FDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDOzs7OzthQUMzQzs7Ozs7OztRQUVLLCtCQUFXOzs7Ozs7WUFBakIsVUFBa0IsUUFBaUIsRUFBRSxRQUFpQixFQUFFLFVBQXlCO2dCQUF6QiwyQkFBQTtvQkFBQSxpQkFBeUI7Ozs7Ozt3QkFDN0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO3dCQUNuQyxVQUFVLEdBQUcsYUFBYSxDQUFDO3dCQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQzt3QkFFbEMsSUFBRyxVQUFVOzRCQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO3dCQUN4QyxzQkFBTyxPQUFPLENBQUMsR0FBRyxDQUFDO2dDQUNmLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSx5QkFBeUIsQ0FBQyxHQUFBLENBQUM7Z0NBQ2pJLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsbUJBQW1CLENBQUMsR0FBQSxDQUFDO2dDQUNySCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDLEdBQUEsQ0FBQztnQ0FDekcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxHQUFBLENBQUM7Z0NBQ3ZHLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsbUJBQW1CLENBQUMsR0FBQSxDQUFDO2dDQUM3RyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLG1CQUFtQixDQUFDLEdBQUEsQ0FBQzs2QkFDeEYsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUM7Z0NBQ0wsS0FBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7Z0NBQ25CLEtBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7O2dDQUVwQixLQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQ0FDL0IsT0FBTyxDQUFDLENBQUM7NkJBQ1osQ0FBQyxFQUFDOzs7YUFDTjs7OztRQUVLLHFDQUFpQjs7O1lBQXZCOzs7Ozt3QkFFSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ3RDLHNCQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUM7Z0NBQ2YsSUFBSSxDQUFDLGFBQWEsRUFBRTtnQ0FDcEIsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQ0FDbEIsSUFBSSxDQUFDLFdBQVcsRUFBRTs2QkFDckIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUM7Z0NBQ0wsS0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dDQUN2QyxPQUFPLENBQUMsQ0FBQzs2QkFDWixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsQ0FBQztnQ0FDTixLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0NBQ3ZDLE1BQU0sQ0FBQyxDQUFDOzZCQUNYLENBQUMsRUFBQzs7O2FBQ047Ozs7OztRQUVPLGdEQUE0Qjs7Ozs7c0JBQUMsS0FBWSxFQUFFLFFBQWdCO2dCQUMvRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7b0JBQUUsT0FBTyxDQUFDLENBQUM7O2dCQUM3QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsTUFBTTtvQkFBRSxPQUFPLENBQUMsQ0FBQzs7Z0JBQ3RCLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7O2dCQUMxQixJQUFJLEdBQUcsR0FBRyxLQUFLLEdBQUcsUUFBUSxDQUFDOztnQkFDM0IsSUFBSSxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQzs7Z0JBQ3RCLElBQUksS0FBSyxHQUFHLEdBQUcsR0FBRyxRQUFRLENBQUM7Z0JBQzNCLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtvQkFDVCxLQUFLLElBQUcsQ0FBQyxDQUFDO2lCQUNiOztnQkFFRCxPQUFPLEtBQUssQ0FBQzs7Ozs7OztRQUdULDJDQUF1Qjs7Ozs7c0JBQUMsS0FBWSxFQUFFLFFBQWdCO2dCQUMxRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7b0JBQUUsT0FBTyxDQUFDLENBQUM7O2dCQUM3QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsTUFBTTtvQkFBRSxPQUFPLENBQUMsQ0FBQzs7Z0JBQ3RCLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7O2dCQUN6QixJQUFJLEdBQUcsR0FBRyxLQUFLLEdBQUcsUUFBUSxDQUFDOztnQkFDM0IsSUFBSSxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQzs7Z0JBQ3RCLElBQUksS0FBSyxHQUFHLEdBQUcsR0FBRyxRQUFRLENBQUM7Z0JBQzNCLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtvQkFDVCxLQUFLLElBQUcsQ0FBQyxDQUFDO2lCQUNiO2dCQUNELE9BQU8sS0FBSyxDQUFDOzs7Ozs7UUFHSCx5Q0FBcUI7Ozs7c0JBQUMsUUFBZ0I7Ozs7d0JBQ2hELHNCQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtnQ0FDcEMsS0FBSyxFQUFFLENBQUM7NkJBQ1gsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU07O2dDQUNWLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDOztnQ0FDbkMsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7O2dDQUM3QyxJQUFJLEdBQUcsR0FBRyxLQUFLLEdBQUcsUUFBUSxDQUFDOztnQ0FDM0IsSUFBSSxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQzs7Z0NBQ3RCLElBQUksS0FBSyxHQUFHLEdBQUcsR0FBRyxRQUFRLENBQUM7Z0NBQzNCLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtvQ0FDVCxLQUFLLElBQUcsQ0FBQyxDQUFDO2lDQUNiO2dDQUNELEtBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztnQ0FDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQ0FBMkMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dDQUNuRixPQUFPLEtBQUssQ0FBQzs2QkFDaEIsQ0FBQyxFQUFDOzs7Ozs7Ozs7Ozs7UUFHRCx5Q0FBcUI7Ozs7Ozs7O1lBQTNCLFVBQTRCLFFBQWlCLEVBQUUsUUFBaUIsRUFBRSxJQUFnQixFQUFFLFFBQW9CLEVBQUUsS0FBcUI7Z0JBQTdELHFCQUFBO29CQUFBLFFBQWUsQ0FBQzs7Z0JBQUUseUJBQUE7b0JBQUEsWUFBbUIsQ0FBQzs7Z0JBQUUsc0JBQUE7b0JBQUEsYUFBcUI7Ozs7Ozt3QkFDdkgsS0FBSyxHQUFVLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFDekUsR0FBRyxHQUFHLElBQUksQ0FBQzt3QkFDWCxNQUFNLEdBQUcsSUFBSSxDQUFDO3dCQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUM3QyxHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFNLENBQUM7Ozs7O29DQUNwQyxJQUFJLFFBQVEsSUFBSSxDQUFDLENBQUMsRUFBRTt3Q0FDaEIsUUFBUSxHQUFHLEVBQUUsQ0FBQztxQ0FDakI7b0NBQ0QsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUU7d0NBQ1IsS0FBSyxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7d0NBQzFELElBQUksR0FBRyxLQUFLLEdBQUMsQ0FBQyxDQUFDO3dDQUNmLElBQUksSUFBSSxHQUFHLENBQUM7NENBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQztxQ0FDMUI7b0NBRUQsc0JBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQzs0Q0FDZixJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLEdBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQzs0Q0FDMUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxHQUFDLENBQUMsRUFBRSxRQUFRLENBQUM7NENBQzFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksR0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDO3lDQUM3QyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQzs0Q0FDTCxLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDOzRDQUM5QyxPQUFPLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDO3lDQUNyQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsQ0FBQzs0Q0FDTixLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDOzRDQUM5QyxNQUFNLENBQUMsQ0FBQzt5Q0FDWCxDQUFDLEVBQUM7Ozt5QkFDTixDQUFDLENBQUM7d0JBRUgsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFOzRCQUM5QixNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUM7eUJBQ3ZDOzZCQUFNOzRCQUNILE1BQU0sR0FBRyxHQUFHLENBQUM7eUJBQ2hCO3dCQUVELElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUVsQyxzQkFBTyxNQUFNLEVBQUM7OzthQUNqQjs7Ozs7UUFFTyxrQ0FBYzs7OztzQkFBQyxJQUFXOztnQkFDOUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7O2dCQUN4QyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDO2dCQUV6RixPQUFPLEtBQUssQ0FBQzs7Ozs7Ozs7OztRQUdYLG1DQUFlOzs7Ozs7OztZQUFyQixVQUFzQixRQUFpQixFQUFFLFFBQWlCLEVBQUUsSUFBZ0IsRUFBRSxRQUFvQixFQUFFLEtBQXFCO2dCQUE3RCxxQkFBQTtvQkFBQSxRQUFlLENBQUM7O2dCQUFFLHlCQUFBO29CQUFBLFlBQW1CLENBQUM7O2dCQUFFLHNCQUFBO29CQUFBLGFBQXFCOzs7Ozs7d0JBQ3JILE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7d0JBTXhFLEtBQUssR0FBVSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7d0JBQ3pFLEdBQUcsR0FBRyxJQUFJLENBQUM7d0JBQ1gsTUFBTSxHQUFHLElBQUksQ0FBQzt3QkFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEdBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUVuRCxHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFNLENBQUM7Ozs7O29DQUdwQyxJQUFJLFFBQVEsSUFBSSxDQUFDLENBQUMsRUFBRTt3Q0FDaEIsUUFBUSxHQUFHLEVBQUUsQ0FBQztxQ0FDakI7b0NBQ0QsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUU7d0NBQ1IsS0FBSyxHQUFHLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7d0NBQy9ELElBQUksR0FBRyxLQUFLLEdBQUMsQ0FBQyxDQUFDO3dDQUNmLElBQUksSUFBSSxHQUFHLENBQUM7NENBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQztxQ0FDMUI7b0NBQ0csUUFBUSxHQUFHLEVBQUUsQ0FBQztvQ0FDbEIsS0FBUyxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsSUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0NBQ3JCLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQzt3Q0FDekQsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztxQ0FDMUI7b0NBRUQsc0JBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDOzs7Ozs7Ozs7Ozs0Q0FRL0IsS0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEdBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDOzs0Q0FDcEQsSUFBSSxNQUFNLEdBQVcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzs0Q0FDeEMsTUFBTSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7NENBQ3RCLE1BQU0sQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDOzs0Q0FDMUIsSUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQzs7NENBQ3JCLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDOzs0Q0FDMUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUMsSUFBSSxDQUFDLENBQUM7OzRDQUUxQyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7OzRDQUd0QixJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7NENBQ3hCLEtBQUssSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtnREFDeEIsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NkNBQ3hDOzRDQUVELGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBUyxDQUFjLEVBQUUsQ0FBYztnREFDdkQsSUFBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJO29EQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0RBQy9CLE9BQU8sQ0FBQyxDQUFDOzZDQUNaLENBQUMsQ0FBQzs0Q0FJSCxLQUFLLElBQUksQ0FBQyxJQUFJLGNBQWMsRUFBRTs7Z0RBQzFCLElBQUksS0FBSyxHQUFnQixjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7O2dEQUMzQyxJQUFJLEtBQUssR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7O2dEQWE1QyxJQUFJLFVBQVUsRUFBRTs7b0RBQ1osSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO29EQUN2QyxLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFOzt3REFDdEIsSUFBSSxPQUFPLEdBQUcsS0FBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFDLENBQUMsQ0FBQyxDQUFDOzt3REFJckQsSUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7O3dEQUMvQyxJQUFJLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzt3REFDaEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O3dEQUUzQixJQUFJLE9BQU8sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7d0RBQ25ELElBQUksR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO3dEQUN4RCxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztxREFDbEM7aURBQ0o7O2dEQUNELElBQUksR0FBRyxDQUFPOztnREFFZCxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnREFDZCxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0RBQ3RDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnREFDM0MsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dEQUN4QyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0RBQ3RDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztnREFFM0IsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0RBQ2QsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnREFDMUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnREFDL0MsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnREFDNUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnREFDMUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0RBQy9CLFVBQVUsR0FBRyxLQUFLLENBQUM7NkNBQ3RCOzRDQUVELElBQUksVUFBVSxJQUFJLElBQUksSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFOztnREFDdkMsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7Z0RBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsSUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O29EQUN2QixJQUFJLE9BQU8sR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUMsQ0FBQyxDQUFDLENBQUM7O29EQUdyRCxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7b0RBQy9DLElBQUksR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO29EQUNoRCxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7b0RBRzNCLElBQUksT0FBTyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDOztvREFDbkQsSUFBSSxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7b0RBQ3hELE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lEQUNsQzs2Q0FDSjs7Ozs7Ozs7NENBVUQsT0FBTyxNQUFNLENBQUM7eUNBQ2pCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNOzs0Q0FLVixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUM7OzRDQUNoQixJQUFJLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7NENBQ2hDLElBQUksUUFBUSxHQUFHLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDOzRDQUN0QyxLQUFLLElBQUksT0FBTyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRTs7Z0RBRTdELElBQUksUUFBUSxHQUFXLEVBQUUsQ0FBQzs7Z0RBQzFCLElBQUksVUFBVSxHQUFXLEVBQUUsQ0FBQzs7Z0RBQzVCLElBQUksTUFBTSxHQUFTLEVBQUUsQ0FBQztnREFDdEIsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFFLENBQUMsRUFBRTs7b0RBRTFDLElBQUksR0FBRyxHQUFTLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7b0RBQ25DLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7O29EQUMvQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7b0RBQ2hCLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO3dEQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0RBQzNDLElBQUksR0FBRyxFQUFFO3dEQUNMLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3REFDM0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dEQUNyQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dEQUNuQixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dEQUNuQixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cURBQ3hDO29EQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O29EQUd0QixHQUFHLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29EQUMzQixHQUFHLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztvREFDN0IsTUFBTSxHQUFHLEVBQUUsQ0FBQztvREFDWixLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTt3REFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29EQUMzQyxJQUFJLEdBQUcsRUFBRTt3REFDTCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0RBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3REFDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3REFDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3REFDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FEQUN4QztvREFHRCxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lEQUMzQjtnREFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dEQUN0QixRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDOzZDQUM3Qjs0Q0FHRCxNQUFNLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQzs0Q0FDNUIsTUFBTSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUM7Ozs7Ozs7Ozs7NENBZWhDLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQzt5Q0FDdkIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLENBQUM7NENBQ04sS0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEdBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDOzRDQUNwRCxNQUFNLENBQUMsQ0FBQzt5Q0FDWCxDQUFDLEVBQUM7Ozt5QkFDTixDQUFDLENBQUM7d0JBRUgsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFOzRCQUM5QixNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUM7eUJBQ3JDOzZCQUFNOzRCQUNILE1BQU0sR0FBRyxHQUFHLENBQUM7eUJBQ2hCO3dCQUVELElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUVsQyxzQkFBTyxNQUFNLEVBQUM7OzthQUNqQjs7Ozs7OztRQUVLLGlDQUFhOzs7Ozs7WUFBbkIsVUFBb0IsUUFBaUIsRUFBRSxRQUFpQixFQUFFLEtBQXFCO2dCQUFyQixzQkFBQTtvQkFBQSxhQUFxQjs7Ozs7O3dCQUN2RSxLQUFLLEdBQVUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7d0JBQ3BELFNBQVMsR0FBVSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUM5QyxPQUFPLEdBQVUsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDOUMsR0FBRyxHQUFHLElBQUksQ0FBQzt3QkFDWCxNQUFNLEdBQUcsSUFBSSxDQUFDO3dCQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ3pDLEdBQUcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQU0sQ0FBQzs7Ozs7Z0RBQ3ZCLHFCQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBQyxLQUFLLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxHQUFHLEVBQUUsY0FBYyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQTs7NENBQW5HLE1BQU0sR0FBRyxTQUEwRjs0Q0FDdkcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzRDQUd0RCxJQUFJLEdBQVksSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs0Q0FDN0QsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFTLENBQU8sRUFBRSxDQUFPO2dEQUMvQixJQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztvREFBRSxPQUFPLENBQUMsRUFBRSxDQUFDO2dEQUN6RCxJQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztvREFBRSxPQUFPLENBQUMsQ0FBQztnREFDMUQsT0FBTyxDQUFDLENBQUM7NkNBQ1osQ0FBQyxDQUFDOzRDQUdDLElBQUksR0FBZSxFQUFFLENBQUM7NENBRTFCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0RBQ2pCLEtBQVEsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvREFDekIsS0FBSyxHQUFVLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvREFDM0IsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3REFDakIsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDO3dEQUMxQixJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFOzREQUN6QyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzs0REFDN0QsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7NERBQzdELEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQzs0REFDL0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7NERBQ3ZCLFNBQVM7eURBQ1o7cURBQ0o7b0RBQ0QsR0FBRyxHQUFHO3dEQUNGLEdBQUcsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTt3REFDM0IsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO3dEQUNsQixNQUFNLEVBQUUsRUFBRTt3REFDVixLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7d0RBQzFCLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTt3REFDMUIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO3dEQUN0QixHQUFHLEVBQUUsSUFBSTt3REFDVCxRQUFRLEVBQUUsSUFBSTt3REFDZCxNQUFNLEVBQUUsRUFBRTtxREFDYixDQUFBO29EQUVELEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztvREFDL0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0RBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aURBQ2xCOzZDQUNKOzRDQUVHLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0Q0FDdkIsUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRDQUNoQyxLQUFTLENBQUMsSUFBSSxJQUFJLEVBQUU7Z0RBQ1osU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnREFDeEIsUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztnREFDakQsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztnREFDdkMsU0FBUyxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztnREFDbkUsU0FBUyxDQUFDLEdBQUcsR0FBRyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzs2Q0FDNUQ7NENBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7OzRDQUk1QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7NENBQzFDLHNCQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBQzs7Ozt5QkFDL0MsQ0FBQyxDQUFDO3dCQUVILElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTs0QkFDcEMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQzt5QkFDakQ7NkJBQU07NEJBQ0gsTUFBTSxHQUFHLEdBQUcsQ0FBQzt5QkFDaEI7d0JBQ0Qsc0JBQU8sTUFBTSxFQUFDOzs7YUFDakI7Ozs7Ozs7UUFFSyxnQ0FBWTs7Ozs7O1lBQWxCLFVBQW1CLFFBQWlCLEVBQUUsUUFBaUIsRUFBRSxLQUFxQjtnQkFBckIsc0JBQUE7b0JBQUEsYUFBcUI7Ozs7Ozt3QkFDdEUsS0FBSyxHQUFVLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO3dCQUNwRCxTQUFTLEdBQVUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDOUMsT0FBTyxHQUFVLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBRzlDLEdBQUcsR0FBRyxJQUFJLENBQUM7d0JBQ1gsTUFBTSxHQUFHLElBQUksQ0FBQzt3QkFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUN4QyxHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFNLENBQUM7Ozs7O2dEQUNqQixxQkFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUMsS0FBSyxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsRUFBRSxFQUFFLGNBQWMsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUE7Z0RBQTdGLHFCQUFNLFNBQXVGLEVBQUE7OzRDQUF0RyxNQUFNLEdBQUcsU0FBNkY7NENBQzFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs0Q0FHdEQsR0FBRyxHQUFZLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7NENBQzVELEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBUyxDQUFPLEVBQUUsQ0FBTztnREFDOUIsSUFBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7b0RBQUUsT0FBTyxDQUFDLENBQUM7Z0RBQ3ZELElBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO29EQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0RBQzNELE9BQU8sQ0FBQyxDQUFDOzZDQUNaLENBQUMsQ0FBQzs0Q0FLQyxJQUFJLEdBQWUsRUFBRSxDQUFDOzRDQUUxQixJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dEQUNoQixLQUFRLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0RBQ3hCLEtBQUssR0FBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0RBQzFCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7d0RBQ2pCLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQzt3REFDMUIsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTs0REFDekMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7NERBQzdELEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzREQUM3RCxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7NERBQy9CLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOzREQUN2QixTQUFTO3lEQUNaO3FEQUNKO29EQUNELEdBQUcsR0FBRzt3REFDRixHQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7d0RBQzNCLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSzt3REFDbEIsTUFBTSxFQUFFLEVBQUU7d0RBQ1YsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO3dEQUMxQixLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7d0RBQzFCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTzt3REFDdEIsR0FBRyxFQUFFLElBQUk7d0RBQ1QsUUFBUSxFQUFFLElBQUk7d0RBQ2QsTUFBTSxFQUFFLEVBQUU7cURBQ2IsQ0FBQTtvREFFRCxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7b0RBQy9CLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29EQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lEQUNsQjs2Q0FDSjs0Q0FFRyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7NENBQ3ZCLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0Q0FDaEMsS0FBUyxDQUFDLElBQUksSUFBSSxFQUFFO2dEQUNaLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0RBQ3hCLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7Z0RBQ2pELEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7Z0RBQ3ZDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0RBQ25FLFNBQVMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7NkNBQzVEOzRDQUVELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7Ozs0Q0FHM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDOzRDQUN6QyxzQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUM7Ozs7eUJBQzlDLENBQUMsQ0FBQzt3QkFFSCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7NEJBQ3BDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7eUJBQ2hEOzZCQUFNOzRCQUNILE1BQU0sR0FBRyxHQUFHLENBQUM7eUJBQ2hCO3dCQUNELHNCQUFPLE1BQU0sRUFBQzs7O2FBQ2pCOzs7O1FBRUssbUNBQWU7OztZQUFyQjs7Ozs7O2dDQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztnQ0FDOUIscUJBQU0sSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUE7O2dDQUF2QyxNQUFNLEdBQUcsU0FBOEI7Z0NBRTNDLEtBQVMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUU7b0NBQ25CLEtBQUssR0FBVSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztvQ0FDcEMsU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7b0NBQzNDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLFNBQVMsRUFBRSwrQkFBK0IsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztvQ0FDcEYsUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7b0NBQzdDLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO29DQUNqRCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7O29DQUlsRCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztvQ0FDekYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7b0NBQ3ZFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO29DQUN4RixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztvQ0FDdEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0NBQ2xELElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2lDQUN2RDtnQ0FFRCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7Ozs7O2FBQzFCOzs7Ozs7O1FBRUssbUNBQWU7Ozs7OztZQUFyQixVQUFzQixRQUFpQixFQUFFLFFBQWlCLEVBQUUsS0FBcUI7Z0JBQXJCLHNCQUFBO29CQUFBLGFBQXFCOzs7Ozs7OztnQ0FDekUsS0FBSyxHQUFVLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dDQUNwRCxTQUFTLEdBQVUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQ0FDOUMsT0FBTyxHQUFVLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7Z0NBRTlDLGFBQWEsR0FBRyxhQUFhLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQ0FDaEQsYUFBYSxHQUFHLGFBQWEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dDQUVwRCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO2dDQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO2dDQUMzQyxHQUFHLEdBQUcsSUFBSSxDQUFDO2dDQUNYLE1BQU0sR0FBaUIsSUFBSSxDQUFDO2dDQUNoQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFNLENBQUM7Ozs7O3dEQUN0QixxQkFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFBOztvREFBNUMsT0FBTyxHQUFHLFNBQWtDOzs7b0RBSWhELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztvREFDMUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEdBQUc7d0RBQy9CLEtBQUssRUFBRSxTQUFTO3dEQUNoQixLQUFLLEVBQUUsSUFBSSxRQUFRLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDO3dEQUMvQyxhQUFhLEVBQUUsSUFBSSxRQUFRLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDO3dEQUN2RCxPQUFPLEVBQUUsSUFBSSxRQUFRLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDO3dEQUNqRCxlQUFlLEVBQUUsSUFBSSxRQUFRLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDO3dEQUN6RCxNQUFNLEVBQUUsSUFBSSxRQUFRLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDO3dEQUNoRCxNQUFNLEVBQUUsSUFBSSxRQUFRLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDO3dEQUNoRCxPQUFPLEVBQUUsR0FBRzt3REFDWixPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUk7cURBQ3hCLENBQUM7b0RBRUUsR0FBRyxHQUFRLElBQUksSUFBSSxFQUFFLENBQUM7b0RBQ3RCLE9BQU8sR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztvREFDbkQsUUFBUSxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDO29EQUM5QyxVQUFVLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQztvREFLM0IsS0FBSyxHQUFHLGFBQWEsQ0FBQztvREFDdEIsT0FBTyxHQUFHLGFBQWEsQ0FBQztvREFDeEIsS0FBSyxHQUFHLEVBQUUsQ0FBQztvREFDWCxPQUFPLEdBQUcsQ0FBQyxDQUFDO29EQUNoQixLQUFTLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dEQUNsQyxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7d0RBQzlCLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksU0FBUyxFQUFFLENBRXZDOzZEQUFNOzREQUNILEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzREQUM1QixJQUFJLE9BQU8sR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLFVBQVUsRUFBRTtnRUFDakMsT0FBTyxHQUFHLEVBQUUsQ0FBQztnRUFDYixLQUFLLEdBQUcsQ0FBQyxLQUFLLElBQUksU0FBUyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dFQUMvRSxPQUFPLEdBQUcsQ0FBQyxLQUFLLElBQUksU0FBUyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDOzs2REFFcEY7eURBQ0o7OztxREFHSjtvREFLRyxRQUFRLEdBQUcsRUFBRSxDQUFDO29EQUNkLE1BQU0sR0FBRyxJQUFJLFFBQVEsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7b0RBQzNDLE1BQU0sR0FBRyxJQUFJLFFBQVEsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7b0RBQzNDLFdBQVcsR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7b0RBQ3hDLGFBQWEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7b0RBRTVDLFNBQVMsR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7b0RBQ2hDLFNBQVMsR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7b0RBQ2hDLFdBQVcsR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7b0RBQ3BDLFdBQVcsR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7b0RBQ3BDLFNBQVMsR0FBWSxJQUFJLENBQUM7b0RBQzFCLFdBQVcsR0FBWSxJQUFJLENBQUM7b0RBQ2hDLEtBQVMsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO3dEQUNqQixPQUFPLEdBQUcsVUFBVSxHQUFDLENBQUMsQ0FBQzt3REFDdkIsWUFBWSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7d0RBQy9DLEtBQUssR0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7d0RBQy9CLElBQUksS0FBSyxFQUFFOzREQUNILE9BQU8sR0FBRyxDQUFDLEtBQUssSUFBSSxTQUFTLElBQUksS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDOzREQUM3RCxTQUFTLEdBQUcsQ0FBQyxLQUFLLElBQUksU0FBUyxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQzs0REFDL0QsUUFBUSxHQUFHLENBQUMsS0FBSyxJQUFJLFNBQVMsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7NERBQzlELFFBQVEsR0FBRyxDQUFDLEtBQUssSUFBSSxTQUFTLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDOzREQUNsRSxLQUFLLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQzs0REFDdEIsS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7NERBQzFCLEtBQUssQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDOzREQUN4QixLQUFLLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQzt5REFDM0I7NkRBQU07NERBQ0gsS0FBSyxHQUFHO2dFQUNKLEtBQUssRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztnRUFDNUMsS0FBSyxFQUFFLEtBQUs7Z0VBQ1osT0FBTyxFQUFFLE9BQU87Z0VBQ2hCLE1BQU0sRUFBRSxhQUFhO2dFQUNyQixNQUFNLEVBQUUsYUFBYTtnRUFDckIsSUFBSSxFQUFFLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dFQUM5QyxJQUFJLEVBQUUsT0FBTzs2REFDaEIsQ0FBQzt5REFDTDt3REFDRCxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQzs7O3dEQUk1QyxLQUFLLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQzt3REFDNUIsR0FBRyxHQUFHLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7d0RBQ3ZELE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUseUJBQXlCLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7d0RBQ3hHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dEQUMvQyxJQUFJLEtBQUssSUFBSSxhQUFhLElBQUksQ0FBQyxTQUFTLEVBQUU7NERBQ3RDLFNBQVMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7eURBQ3pDO3dEQUNELFdBQVcsR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7d0RBQ3hDLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUseUJBQXlCLEVBQUUsV0FBVyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7d0RBQzlILElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFOzREQUNwRCxTQUFTLEdBQUcsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO3lEQUNuQzt3REFDRCxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLHlCQUF5QixFQUFFLFdBQVcsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dEQUM5SCxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTs0REFDbEYsU0FBUyxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt5REFDbkM7O3dEQUdELE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDO3dEQUNoQyxHQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQzt3REFDdkQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSx5QkFBeUIsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzt3REFDeEcsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7d0RBQy9DLElBQUksT0FBTyxJQUFJLGFBQWEsSUFBSSxDQUFDLFdBQVcsRUFBRTs0REFDMUMsV0FBVyxHQUFHLElBQUksUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQzt5REFDN0M7d0RBQ0QsYUFBYSxHQUFHLElBQUksUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQzt3REFDNUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSx5QkFBeUIsRUFBRSxhQUFhLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3REFDdEksSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUU7NERBQ3hELFdBQVcsR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7eURBQ3ZDO3dEQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUseUJBQXlCLEVBQUUsYUFBYSxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7d0RBQ3RJLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFOzREQUN4RixXQUFXLEdBQUcsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO3lEQUN2QztxREFDSjs7b0RBRUQsSUFBSSxDQUFDLFNBQVMsRUFBRTt3REFDWixTQUFTLEdBQUcsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztxREFDOUQ7b0RBQ0csVUFBVSxHQUFJLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7b0RBQzNELElBQUksR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7O29EQUU5QixJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztvREFDcEQsS0FBSyxHQUFVLENBQUMsQ0FBQztvREFDckIsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRTt3REFDbEMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztxREFDOUQ7b0RBQ0csT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQzs7b0RBRzlDLElBQUksQ0FBQyxXQUFXLEVBQUU7d0RBQ2QsV0FBVyxHQUFHLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7cURBQ2xFO29EQUNHLFlBQVksR0FBSSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO29EQUMvRCxLQUFLLEdBQUcsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDOztvREFFakMsS0FBSyxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7b0RBQzdELEtBQUssR0FBRyxDQUFDLENBQUM7b0RBQ1YsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRTt3REFDcEMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztxREFDaEU7b0RBQ0csUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQzs7Ozs7Ozs7b0RBVS9DLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUM7b0RBQ3BELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUM7b0RBQ3hELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsR0FBRyxTQUFTLElBQUksVUFBVSxDQUFDO29EQUN6RSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEdBQUcsV0FBVyxDQUFDO29EQUMvRCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sSUFBSSxHQUFHLENBQUM7b0RBQ3BGLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQztvREFDeEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLElBQUksR0FBRyxDQUFDO29EQUN2RixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUM7b0RBQzNFLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7b0RBQ2pELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7b0RBQ2pELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7b0RBQ3ZELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7b0RBQ3ZELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7b0RBQzNELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7OztvREFJM0QsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztvREFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztvREFDaEQsc0JBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUM7Ozs7aUNBQzNDLENBQUMsQ0FBQztzQ0FFQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFBO29DQUFsQyx3QkFBa0M7Z0NBQ2xDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQzs7b0NBRWpDLHFCQUFNLEdBQUcsRUFBQTs7Z0NBQWxCLE1BQU0sR0FBRyxTQUFTLENBQUM7OztnQ0FHdkIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0NBQ3hCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dDQUVsQyxzQkFBTyxNQUFNLEVBQUM7Ozs7YUFDakI7Ozs7UUFFSyx3Q0FBb0I7OztZQUExQjs7Ozt3QkFDSSxzQkFBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQU0sQ0FBQzs7Ozs7d0NBQ2pDLFFBQVEsR0FBRyxFQUFFLENBQUM7d0NBRWxCLEtBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7NENBQ3pCLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Z0RBQUUsU0FBUzs0Q0FDL0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7NENBQ3pGLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7eUNBQ3BCO3dDQUVELHNCQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQztnREFDL0IsS0FBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7NkNBQzlCLENBQUMsRUFBQzs7OzZCQUNOLENBQUMsRUFBQTs7O2FBQ0w7Ozs7O1FBTU8sMENBQXNCOzs7O3NCQUFDLElBQVU7O2dCQUNyQyxJQUFJLE1BQU0sR0FBWSxFQUFFLENBQUM7Z0JBQ3pCLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOztvQkFDaEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQzs7b0JBQzlDLElBQUksT0FBTyxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7O29CQUNsRCxJQUFJLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDOztvQkFDbEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQzs7b0JBQzlDLElBQUksS0FBSyxDQUFPOztvQkFFaEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7b0JBQ3pELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7O29CQUMzQyxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUdqRCxJQUFJLGFBQWEsSUFBSSxLQUFLLEVBQUU7d0JBQ3hCLEtBQUssR0FBRzs0QkFDSixFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7NEJBQ2QsS0FBSyxFQUFFLEtBQUs7NEJBQ1osT0FBTyxFQUFFLE9BQU87NEJBQ2hCLEtBQUssRUFBRSxPQUFPOzRCQUNkLE9BQU8sRUFBRSxPQUFPOzRCQUNoQixLQUFLLEVBQUUsS0FBSzs0QkFDWixLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUs7eUJBQ3ZCLENBQUE7cUJBQ0o7eUJBQU07d0JBQ0gsS0FBSyxHQUFHOzRCQUNKLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTs0QkFDZCxLQUFLLEVBQUUsT0FBTzs0QkFDZCxPQUFPLEVBQUUsS0FBSzs0QkFDZCxLQUFLLEVBQUUsS0FBSzs0QkFDWixPQUFPLEVBQUUsT0FBTzs0QkFDaEIsS0FBSyxFQUFFLE9BQU87NEJBQ2QsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO3lCQUN2QixDQUFBO3FCQUNKO29CQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3RCO2dCQUNELE9BQU8sTUFBTSxDQUFDOzs7Ozs7UUFHVixzQ0FBa0I7Ozs7c0JBQUMsRUFBUzs7Z0JBQ2hDLElBQUksS0FBSyxHQUFHO29CQUNSLFFBQVE7b0JBQ1IsT0FBTztvQkFDUCxPQUFPO29CQUNQLFNBQVM7b0JBQ1QsUUFBUTtvQkFDUixRQUFRO29CQUNSLE9BQU87b0JBQ1AsU0FBUztvQkFDVCxTQUFTO29CQUNULFFBQVE7b0JBQ1IsT0FBTztvQkFDUCxVQUFVO29CQUNWLFVBQVU7b0JBQ1YsWUFBWTtvQkFDWixZQUFZO29CQUNaLFdBQVc7b0JBQ1gsV0FBVztvQkFDWCxhQUFhO29CQUNiLFlBQVk7b0JBQ1osWUFBWTtvQkFDWixVQUFVO29CQUNWLGFBQWE7b0JBQ2IsYUFBYTtvQkFDYixlQUFlO2lCQUNsQixDQUFBO2dCQUNELE9BQU8sS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7UUFHYixrQ0FBYzs7OztzQkFBQyxLQUFZOztnQkFDL0IsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7Z0JBQ3JELElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7O2dCQUNyRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDOztnQkFDOUMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7Z0JBQzlDLElBQUksYUFBYSxHQUFHLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQzs7Z0JBQzlDLElBQUksYUFBYSxHQUFHLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQzs7Z0JBRTlDLElBQUksY0FBYyxHQUFpQjtvQkFDL0IsS0FBSyxFQUFFLEtBQUs7b0JBQ1osS0FBSyxFQUFFLGFBQWE7b0JBQ3BCLGFBQWEsRUFBRSxhQUFhO29CQUM1QixPQUFPLEVBQUUsYUFBYTtvQkFDdEIsZUFBZSxFQUFFLGFBQWE7b0JBQzlCLFdBQVcsRUFBRSxhQUFhO29CQUMxQixTQUFTLEVBQUUsYUFBYTtvQkFDeEIsV0FBVyxFQUFFLGFBQWE7b0JBQzFCLFNBQVMsRUFBRSxhQUFhO29CQUN4QixPQUFPLEVBQUUsRUFBRTtvQkFDWCxNQUFNLEVBQUUsYUFBYTtvQkFDckIsTUFBTSxFQUFFLGFBQWE7b0JBQ3JCLE9BQU8sRUFBRSxDQUFDO29CQUNWLFFBQVEsRUFBRSxDQUFDO29CQUNYLFdBQVcsRUFBRSxJQUFJO29CQUNqQixZQUFZLEVBQUUsSUFBSTtpQkFDckIsQ0FBQTtnQkFFRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUk7b0JBQzNCLEtBQUssRUFBRSxLQUFLO29CQUNaLFFBQVEsRUFBRSxRQUFRO29CQUNsQixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFO29CQUM3QixLQUFLLEVBQUUsQ0FBQztvQkFDUixPQUFPLEVBQUUsRUFBRTtvQkFDWCxFQUFFLEVBQUUsRUFBRTtvQkFDTixNQUFNLEVBQUUsQ0FBQztvQkFDVCxLQUFLLEVBQUUsRUFBRTtvQkFDVCxTQUFTLEVBQUUsRUFBRTtvQkFDYixXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUM7b0JBQ2pCLGFBQWEsRUFBRSxFQUFFO29CQUNqQixhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUM7b0JBQ25CLE9BQU8sRUFBRSxjQUFjO29CQUN2QixNQUFNLEVBQUU7d0JBQ0osSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUMsQ0FBQyxFQUFDO3dCQUNyQyxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUMsYUFBYSxFQUFFLE1BQU0sRUFBQyxDQUFDLEVBQUM7cUJBQ3ZDO2lCQUNKLENBQUM7Ozs7OztRQUdFLGlDQUFhOzs7O3NCQUFDLE9BQU87Z0JBQ3pCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLEVBQUMsS0FBSyxFQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTtvQkFDbEUsT0FBTyxNQUFNLENBQUM7aUJBQ2pCLENBQUMsQ0FBQzs7Ozs7O1FBR08saUNBQWE7Ozs7c0JBQUMsT0FBTzs7Ozt3QkFDL0Isc0JBQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFNLENBQUM7Ozs7OztnREFDakMsU0FBUyxHQUFHLEVBQUUsQ0FBQztnREFDZixRQUFRLEdBQUcsRUFBRSxDQUFDO2dEQUNsQixLQUFTLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO29EQUN2QixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUTt3REFBRSxTQUFTO29EQUN0QyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUM7aURBQzdDO2dEQUNELEtBQVMsUUFBUSxJQUFJLFNBQVMsRUFBRTtvREFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxHQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztpREFDcEQ7OzJEQUNvQixTQUFTOzs7Ozs7OztnREFDYixxQkFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7d0RBQ2xELFFBQVEsRUFBQyxRQUFRO3dEQUNqQixLQUFLLEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSTtxREFDdEMsQ0FBQyxFQUFBOztnREFIRSxNQUFNLEdBQUcsU0FHWDtnREFDRixLQUFTLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO29EQUN2QixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7aURBQzdEO2dEQUNELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsR0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7Ozs7O29EQUV0RCxzQkFBTyxRQUFRLEVBQUM7Ozs7NkJBQ25CLENBQUMsRUFBQzs7Ozs7Ozs7UUFHQywrQkFBVzs7OztzQkFBQyxNQUFrQjtnQkFDbEMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTtvQkFDM0QsT0FBTyxNQUFNLENBQUM7aUJBQ2pCLENBQUMsQ0FBQzs7Ozs7UUFHQyxxQ0FBaUI7Ozs7Z0JBQ3JCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTtvQkFDckQsT0FBTyxNQUFNLENBQUM7aUJBQ2pCLENBQUMsQ0FBQzs7Ozs7Ozs7UUFHQyxxQ0FBaUI7Ozs7OztzQkFBQyxLQUFZLEVBQUUsSUFBZSxFQUFFLFFBQW9COztnQkFBckMscUJBQUE7b0JBQUEsUUFBZTs7Z0JBQUUseUJBQUE7b0JBQUEsYUFBb0I7OztnQkFDekUsSUFBSSxTQUFTLEdBQVUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7Z0JBQ2xELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7O2dCQUNuRSxJQUFJLEVBQUUsR0FBRyxJQUFJLEdBQUMsUUFBUSxDQUFDOztnQkFFdkIsSUFBSSxJQUFJLEdBQUcsS0FBSyxFQUFFO29CQUNkLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRTs7d0JBQ3pGLElBQUksTUFBTSxHQUFlLEVBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsRUFBRSxFQUFDLENBQUM7d0JBQzlDLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7OzRCQUMzQixJQUFJLElBQUksR0FBRyxFQUFFLEdBQUMsQ0FBQyxDQUFDOzs0QkFDaEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDOzRCQUN6RCxJQUFJLEtBQUssRUFBRTtnQ0FDUCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs2QkFDM0I7aUNBQU07Z0NBQ0gsTUFBTTs2QkFDVDt5QkFDSjt3QkFDRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLFFBQVEsRUFBRTs7OzRCQUdoQyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7eUJBQ2xDO3FCQUNKO2lCQUNKO2dCQUVELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLEVBQUMsS0FBSyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsUUFBUSxFQUFFLFdBQVcsRUFBQyxFQUFFLElBQUUsSUFBSSxHQUFDLFFBQVEsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNOzs7OztvQkFHeEgsS0FBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUMxRCxLQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7O29CQUV0RSxLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O3dCQUN2QyxJQUFJLEtBQUssR0FBZ0I7NEJBQ3JCLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7NEJBQ3JCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7NEJBQ3pCLEdBQUcsRUFBRSxFQUFFOzRCQUNQLEtBQUssRUFBRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFJLENBQUM7NEJBQy9DLE9BQU8sRUFBRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFJLENBQUM7NEJBQ25ELFFBQVEsRUFBRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxLQUFJLENBQUM7NEJBQ3JELEdBQUcsRUFBRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFJLENBQUM7NEJBQzNDLEdBQUcsRUFBRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFJLENBQUM7NEJBQzNDLE1BQU0sRUFBRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFJLENBQUM7NEJBQ2pELE1BQU0sRUFBRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFB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UyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7b0JBSWhFLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs7d0JBQ3ZDLElBQUksV0FBVyxHQUFhOzRCQUN4QixFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFOzRCQUNyQixHQUFHLEVBQUUsRUFBRTs0QkFDUCxNQUFNLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDOzRCQUNqRCxPQUFPLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDOzRCQUNuRCxNQUFNLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDOzRCQUNqRCxPQUFPLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDOzRCQUNuRCxLQUFLLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSSxDQUFDOzRCQUMvQyxPQUFPLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDOzRCQUNuRCxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLOzRCQUMzQixNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNOzRCQUM3QixJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7NEJBQ25DLEtBQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO3lCQUNoQyxDQUFBO3dCQUNELFdBQVcsQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO3dCQUN2RSxLQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQztxQkFDckU7b0JBRUQsS0FBSyxJQUFJLENBQUMsSUFBSSxLQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRTt3QkFDdkMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3pFO29CQUVELEtBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFTLENBQVcsRUFBRSxDQUFXO3dCQUNuRSxJQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUk7NEJBQUUsT0FBTyxDQUFDLENBQUM7d0JBQzdCLElBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSTs0QkFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUM5QixJQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUU7NEJBQUUsT0FBTyxDQUFDLENBQUM7d0JBQ3pCLElBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRTs0QkFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO3FCQUM3QixDQUFDLENB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