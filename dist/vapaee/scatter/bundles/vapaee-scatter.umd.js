(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('bignumber.js'), require('long'), require('@angular/core'), require('rxjs'), require('@vapaee/feedback'), require('scatterjs-plugin-eosjs'), require('eosjs')) :
    typeof define === 'function' && define.amd ? define('@vapaee/scatter', ['exports', 'bignumber.js', 'long', '@angular/core', 'rxjs', '@vapaee/feedback', 'scatterjs-plugin-eosjs', 'eosjs'], factory) :
    (factory((global.vapaee = global.vapaee || {}, global.vapaee.scatter = {}),null,null,global.ng.core,global.rxjs,null,null,null));
}(this, (function (exports,BigNumber,Long,i0,rxjs,feedback,ScatterEOS,Eos) { 'use strict';

    BigNumber = BigNumber && BigNumber.hasOwnProperty('default') ? BigNumber['default'] : BigNumber;
    ScatterEOS = ScatterEOS && ScatterEOS.hasOwnProperty('default') ? ScatterEOS['default'] : ScatterEOS;
    Eos = Eos && Eos.hasOwnProperty('default') ? Eos['default'] : Eos;

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var Token = (function () {
        function Token(obj) {
            if (obj === void 0) {
                obj = null;
            }
            this._symbol = "AUX";
            this._precision = null;
            this._contract = null;
            if (typeof obj == "string") {
                this._symbol = obj;
                console.assert(this.symbol.length > 0, "ERROR: symbol not valid for token: ", this._symbol);
                console.assert(this.symbol.length < 9, "ERROR: symbol not valid for token: ", this._symbol);
            }
            if (obj) {
                if (obj instanceof Token) {
                    this._symbol = obj._symbol;
                    this._precision = obj._precision;
                    this._contract = obj._contract;
                }
                else if (typeof obj == "object") {
                    this._symbol = obj.symbol || this._symbol;
                    this._precision = obj.precision || this._precision;
                    this._contract = obj.contract || this._contract;
                }
            }
            this.toString();
        }
        Object.defineProperty(Token.prototype, "symbol", {
            get: /**
             * @return {?}
             */ function () { return this._symbol; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Token.prototype, "precision", {
            get: /**
             * @return {?}
             */ function () { return this._precision; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Token.prototype, "contract", {
            get: /**
             * @return {?}
             */ function () { return this._contract; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Token.prototype, "str", {
            get: /**
             * @return {?}
             */ function () {
                if (this._str)
                    return this._str;
                this._str = this.symbol;
                if (this._precision != null || this._contract != null) {
                    if (this._precision && this._contract) {
                        this._str += " (" + this._precision + ", " + this._contract + ")";
                    }
                    else {
                        if (this._precision) {
                            this._str += " (" + this._precision + ")";
                        }
                        if (this._contract) {
                            this._str += " (" + this._contract + ")";
                        }
                    }
                }
                return this._str;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        Token.prototype.toString = /**
         * @return {?}
         */
            function () {
                return this.str;
            };
        return Token;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var Asset = (function () {
        function Asset(a, b) {
            if (a === void 0) {
                a = null;
            }
            if (b === void 0) {
                b = null;
            }
            if (a == null && b == null) {
                this.amount = new BigNumber(0);
                this.token = new Token();
                return;
            }
            if (a instanceof BigNumber) {
                this.amount = a;
                this.token = b;
                return;
            }
            if (a instanceof Asset) {
                this.amount = a.amount;
                this.token = b;
                return;
            }
            if (typeof a == "number") {
                this.amount = new BigNumber(a);
                this.token = b;
                return;
            }
            if (typeof a == "string") {
                this.parse(a);
                console.assert(this.amount instanceof BigNumber, "ERROR: Asset string malformed: '" + a + "'");
                return;
            }
        }
        /**
         * @param {?} b
         * @return {?}
         */
        Asset.prototype.plus = /**
         * @param {?} b
         * @return {?}
         */
            function (b) {
                console.assert(!!b, "ERROR: b is not an Asset", b, this.str);
                console.assert(b.token.symbol == this.token.symbol, "ERROR: trying to sum assets with different tokens: " + this.str + " and " + b.str);
                /** @type {?} */
                var amount = this.amount.plus(b.amount);
                return new Asset(amount, this.token);
            };
        /**
         * @param {?} b
         * @return {?}
         */
        Asset.prototype.minus = /**
         * @param {?} b
         * @return {?}
         */
            function (b) {
                console.assert(!!b, "ERROR: b is not an Asset", b, this.str);
                console.assert(b.token.symbol == this.token.symbol, "ERROR: trying to substract assets with different tokens: " + this.str + " and " + b.str);
                /** @type {?} */
                var amount = this.amount.minus(b.amount);
                return new Asset(amount, this.token);
            };
        /**
         * @return {?}
         */
        Asset.prototype.clone = /**
         * @return {?}
         */
            function () {
                return new Asset(this.amount, this.token);
            };
        /**
         * @param {?} text
         * @return {?}
         */
        Asset.prototype.parse = /**
         * @param {?} text
         * @return {?}
         */
            function (text) {
                if (text == "")
                    return;
                /** @type {?} */
                var sym = text.split(" ")[1];
                /** @type {?} */
                var amount_str = text.split(" ")[0];
                this.amount = new BigNumber(amount_str);
                /** @type {?} */
                var precision = 0;
                if (amount_str.split(".").length == 2) {
                    precision = amount_str.split(".")[1].length;
                }
                else if (amount_str.split(".").length == 1) {
                    if (isNaN(parseInt(amount_str))) {
                        console.error("ERROR: Asset malformed string: '" + text + "'");
                    }
                }
                this.token = new Token({
                    symbol: sym,
                    precision: precision
                });
            };
        /**
         * @param {?=} decimals
         * @param {?=} total
         * @return {?}
         */
        Asset.prototype.valueToString = /**
         * @param {?=} decimals
         * @param {?=} total
         * @return {?}
         */
            function (decimals, total) {
                if (decimals === void 0) {
                    decimals = -1;
                }
                if (total === void 0) {
                    total = false;
                }
                if (!this.token)
                    return "0";
                /** @type {?} */
                var parts = this.amount.toFixed().split(".");
                /** @type {?} */
                var integer = parts[0];
                /** @type {?} */
                var precision = this.token.precision;
                /** @type {?} */
                var decimal = (parts.length == 2 ? parts[1] : "");
                if (decimals != -1) {
                    precision = decimals;
                }
                if (total) {
                    precision -= parts[0].length - 1;
                    precision = precision > 0 ? precision : 0;
                }
                for (var i = decimal.length; i < precision; i++) {
                    decimal += "0";
                }
                if (decimal.length > precision) {
                    decimal = decimal.substr(0, precision);
                }
                if (precision == 0) {
                    return integer;
                }
                else {
                    return integer + "." + decimal;
                }
            };
        /**
         * @return {?}
         */
        Asset.prototype.toNumber = /**
         * @return {?}
         */
            function () {
                if (!this.token)
                    return 0;
                return parseFloat(this.valueToString(8));
            };
        Object.defineProperty(Asset.prototype, "str", {
            get: /**
             * @return {?}
             */ function () {
                return this.toString();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?=} decimals
         * @return {?}
         */
        Asset.prototype.toString = /**
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
        Asset.prototype.inverse = /**
         * @param {?} token
         * @return {?}
         */
            function (token) {
                /** @type {?} */
                var result = new BigNumber(1).dividedBy(this.amount);
                /** @type {?} */
                var asset = new Asset(result, token);
                return asset;
            };
        return Asset;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var SmartContract = (function () {
        function SmartContract(contract, scatter) {
            if (contract === void 0) {
                contract = "";
            }
            if (scatter === void 0) {
                scatter = null;
            }
            this.contract = contract;
            this.scatter = scatter;
        }
        /*
        // eosjs2
        excecute(action: string, params: any) {
            console.log("Utils.excecute()", action, [params]);
            return new Promise<any>((resolve, reject) => {
                try {
                    this.scatter.executeTransaction(this.contract, action, params).then(result => {
                        resolve(result);
                    }).catch(err => {
                        console.error("ERROR: ", err);
                        reject(err);
                    });
                } catch (err) { console.error(err); reject(err); }
            }); // .catch(err => console.error(err) );
        }
        /*/
        /**
         * @param {?} action
         * @param {?} params
         * @return {?}
         */
        SmartContract.prototype.excecute = /**
         * @param {?} action
         * @param {?} params
         * @return {?}
         */
            function (action, params) {
                var _this = this;
                console.log("Utils.excecute()", action, [params]);
                return new Promise(function (resolve, reject) {
                    try {
                        _this.scatter.getContractWrapper(_this.contract).then(function (contract) {
                            try {
                                contract[action](params, _this.scatter.authorization).then((function (response) {
                                    console.log("Utils.excecute() ---> ", [response]);
                                    resolve(response);
                                })).catch(function (err) { reject(err); });
                            }
                            catch (err) {
                                reject(err);
                            }
                        }).catch(function (err) { reject(err); });
                    }
                    catch (err) {
                        reject(err);
                    }
                }); // .catch(err => console.error(err) );
            };
        //*/
        /**
         * @param {?} table
         * @param {?=} params
         * @return {?}
         */
        SmartContract.prototype.getTable = /**
         * @param {?} table
         * @param {?=} params
         * @return {?}
         */
            function (table, params) {
                if (params === void 0) {
                    params = {};
                }
                /** @type {?} */
                var _p = Object.assign({
                    contract: this.contract,
                    scope: this.contract,
                    table_key: "0",
                    lower_bound: "0",
                    upper_bound: "-1",
                    limit: 25,
                    key_type: "i64",
                    index_position: "1"
                }, params);
                return this.scatter.getTableRows(_p.contract, _p.scope, table, _p.table_key, _p.lower_bound, _p.upper_bound, _p.limit, _p.key_type, _p.index_position);
            };
        return SmartContract;
    }());

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
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var ScatterUtils = (function () {
        function ScatterUtils() {
            var _this = this;
            // (end) ---------------------------------------------------
            // OLD eosjs encodeName solution ------------------------------------------------------
            this.charmap = '.12345abcdefghijklmnopqrstuvwxyz';
            this.charidx = function (ch) {
                /** @type {?} */
                var idx = _this.charmap.indexOf(ch);
                if (idx === -1)
                    throw new TypeError("Invalid character: '" + ch + "'");
                return idx;
            };
            this.code_0 = "0".charCodeAt(0);
            this.code_1 = "1".charCodeAt(0);
            this.code_4 = "4".charCodeAt(0);
            this.code_9 = "9".charCodeAt(0);
            this.code_a = "a".charCodeAt(0);
            this.code_f = "f".charCodeAt(0);
            this.code_z = "z".charCodeAt(0);
        }
        // this part is still experimental (init) -----------------
        /**
         * @param {?} nib
         * @return {?}
         */
        ScatterUtils.prototype.decodeNibble = /**
         * @param {?} nib
         * @return {?}
         */
            function (nib) {
                /** @type {?} */
                var nibble = [0, 0, 0, 0];
                /** @type {?} */
                var value = 0;
                if (this.code_0 <= nib && nib <= this.code_9) {
                    value = nib - this.code_0;
                }
                else if (this.code_a <= nib && nib <= this.code_f) {
                    value = nib - this.code_a + 10;
                }
                nibble[0] = (value & 8) > 0 ? 1 : 0;
                nibble[1] = (value & 4) > 0 ? 1 : 0;
                nibble[2] = (value & 2) > 0 ? 1 : 0;
                nibble[3] = (value & 1) > 0 ? 1 : 0;
                return nibble;
            };
        /**
         * @param {?} index
         * @param {?} bits
         * @return {?}
         */
        ScatterUtils.prototype.encodeNibble = /**
         * @param {?} index
         * @param {?} bits
         * @return {?}
         */
            function (index, bits) {
                /** @type {?} */
                var value = 0;
                value += bits[index + 0] == 1 ? 8 : 0;
                value += bits[index + 1] == 1 ? 4 : 0;
                value += bits[index + 2] == 1 ? 2 : 0;
                value += bits[index + 3] == 1 ? 1 : 0;
                if (0 <= value && value <= 9) {
                    return "" + value;
                }
                switch (value) {
                    case 10: return "a";
                    case 11: return "b";
                    case 12: return "c";
                    case 13: return "d";
                    case 14: return "e";
                    case 15: return "f";
                }
                return "?";
            };
        // _num is an hexa
        /**
         * @param {?} _num
         * @return {?}
         */
        ScatterUtils.prototype.decodeUint64 = /**
         * @param {?} _num
         * @return {?}
         */
            function (_num) {
                /** @type {?} */
                var bits = [];
                /** @type {?} */
                var num = _num.substr(2);
                for (var i = 0; i < num.length; i++) {
                    bits = bits.concat(this.decodeNibble(num.charCodeAt(i)));
                }
                return bits;
            };
        /**
         * @param {?} bits
         * @return {?}
         */
        ScatterUtils.prototype.encodeUnit64 = /**
         * @param {?} bits
         * @return {?}
         */
            function (bits) {
                /** @type {?} */
                var slugid = { top: "0x", low: "0x" };
                /** @type {?} */
                var str = "top";
                for (var i = 0; i < bits.length; i += 4) {
                    if (i >= 128)
                        str = "low";
                    slugid[str] += this.encodeNibble(i, bits);
                }
                return slugid;
            };
        /**
         * @param {?} bits
         * @return {?}
         */
        ScatterUtils.prototype.extractLength = /**
         * @param {?} bits
         * @return {?}
         */
            function (bits) {
                if (bits.length != 256)
                    console.error("ERROR: extractLength(bits) bits must be an array of 256 bits");
                return bits[250] * 32 + bits[251] * 16 + bits[252] * 8 + bits[253] * 4 + bits[254] * 2 + bits[255] * 1;
            };
        /**
         * @param {?} bits
         * @param {?} length
         * @return {?}
         */
        ScatterUtils.prototype.insertLength = /**
         * @param {?} bits
         * @param {?} length
         * @return {?}
         */
            function (bits, length) {
                if (bits.length != 256)
                    console.error("ERROR: extractLength(bits) bits must be an array of 256 bits");
                bits[250] = (length & 32) ? 1 : 0;
                bits[251] = (length & 16) ? 1 : 0;
                bits[252] = (length & 8) ? 1 : 0;
                bits[253] = (length & 4) ? 1 : 0;
                bits[254] = (length & 2) ? 1 : 0;
                bits[255] = (length & 1) ? 1 : 0;
            };
        /**
         * @param {?} v
         * @return {?}
         */
        ScatterUtils.prototype.valueToChar = /**
         * @param {?} v
         * @return {?}
         */
            function (v) {
                if (v == 0)
                    return '.';
                if (v == 1)
                    return '-';
                if (v < 6)
                    return String.fromCharCode(v + this.code_0 - 1);
                if (v < 32)
                    return String.fromCharCode(v + this.code_a - 6);
                console.assert(false, "ERROR: value out of range [0-31]", v);
                return '?';
            };
        /**
         * @param {?} c
         * @return {?}
         */
        ScatterUtils.prototype.charToValue = /**
         * @param {?} c
         * @return {?}
         */
            function (c) {
                console.assert(c.length == 1, "ERROR: c MUST be a character (string with length == 1). Got", typeof c, c);
                if (c == ".")
                    return 0;
                if (c == "-")
                    return 1;
                if (this.code_0 < c.charCodeAt(0) && c.charCodeAt(0) <= this.code_4)
                    return c.charCodeAt(0) - this.code_1 + 2;
                if (this.code_a <= c.charCodeAt(0) && c.charCodeAt(0) <= this.code_z)
                    return c.charCodeAt(0) - this.code_a + 6;
                console.assert(false, "ERROR: character '" + c + "' is not in allowed character set for slugid ");
                return -1;
            };
        /**
         * @param {?} c
         * @param {?} bits
         * @return {?}
         */
        ScatterUtils.prototype.extractChar = /**
         * @param {?} c
         * @param {?} bits
         * @return {?}
         */
            function (c, bits) {
                /** @type {?} */
                var encode = 5;
                /** @type {?} */
                var pot = Math.pow(2, encode - 1);
                /** @type {?} */
                var value = 0;
                /** @type {?} */
                var index = c * encode;
                for (var i = 0; i < encode; i++, pot = pot / 2) {
                    value += bits[index + i] * pot;
                }
                /** @type {?} */
                var char = this.valueToChar(value);
                return char;
            };
        /**
         * @param {?} value
         * @param {?} j
         * @param {?} bits
         * @return {?}
         */
        ScatterUtils.prototype.insertChar = /**
         * @param {?} value
         * @param {?} j
         * @param {?} bits
         * @return {?}
         */
            function (value, j, bits) {
                /** @type {?} */
                var encode = 5;
                /** @type {?} */
                var index = j * encode;
                bits[index + 0] = (value & 16) > 0 ? 1 : 0;
                bits[index + 1] = (value & 8) > 0 ? 1 : 0;
                bits[index + 2] = (value & 4) > 0 ? 1 : 0;
                bits[index + 3] = (value & 2) > 0 ? 1 : 0;
                bits[index + 4] = (value & 1) > 0 ? 1 : 0;
            };
        /**
         * @param {?} sluig
         * @return {?}
         */
        ScatterUtils.prototype.decodeSlug = /**
         * @param {?} sluig
         * @return {?}
         */
            function (sluig) {
                /** @type {?} */
                var bits = [];
                bits = this.decodeUint64(sluig.top).concat(this.decodeUint64(sluig.low));
                /** @type {?} */
                var length = bits[250] * 32 + bits[251] * 16 + bits[252] * 8 + bits[253] * 4 + bits[254] * 2 + bits[255] * 1;
                /** @type {?} */
                var str = "";
                for (var i = 0; i < length; i++) {
                    str += this.extractChar(i, bits);
                }
                // console.log("str: ", str);
                sluig.str = str;
                return sluig;
            };
        /**
         * @param {?} name
         * @return {?}
         */
        ScatterUtils.prototype.encodeSlug = /**
         * @param {?} name
         * @return {?}
         */
            function (name) {
                /** @type {?} */
                var bits = [];
                for (var i = 0; i < 256; i++) {
                    bits.push(0);
                }
                for (var i = 0; i < name.length; i++) {
                    /** @type {?} */
                    var value = this.charToValue(name[i]);
                    this.insertChar(value, i, bits);
                }
                this.insertLength(bits, name.length);
                /** @type {?} */
                var slug = this.encodeUnit64(bits);
                slug = this.decodeSlug(slug);
                console.assert(slug.str == name, "ERROR: slug.str: ", slug.str, [slug.str], [name]);
                return slug;
            };
        /**
         * @param {?} slug
         * @return {?}
         */
        ScatterUtils.prototype.slugTo128bits = /**
         * @param {?} slug
         * @return {?}
         */
            function (slug) {
                /** @type {?} */
                var str = "0x";
                /** @type {?} */
                var topbits = this.decodeUint64(slug.top);
                /** @type {?} */
                var lowbits = this.decodeUint64(slug.low);
                /** @type {?} */
                var mixbits = [];
                for (var i = 0; i < topbits.length; i++) {
                    mixbits.push(topbits[i] ^ lowbits[i] ? 1 : 0);
                }
                for (var i = 0; i < mixbits.length; i += 4) {
                    str += this.encodeNibble(i, mixbits);
                }
                return str;
            };
        /**
         * @param {?} name
         * @param {?=} littleEndian
         * @return {?}
         */
        ScatterUtils.prototype.oldEosjsEncodeName = /**
         * @param {?} name
         * @param {?=} littleEndian
         * @return {?}
         */
            function (name, littleEndian) {
                if (littleEndian === void 0) {
                    littleEndian = false;
                }
                if (typeof name !== 'string')
                    throw new TypeError('name parameter is a required string');
                if (name.length > 12)
                    throw new TypeError('A name can be up to 12 characters long');
                /** @type {?} */
                var bitstr = '';
                for (var i = 0; i <= 12; i++) {
                    /** @type {?} */
                    var c = i < name.length ? this.charidx(name[i]) : 0;
                    /** @type {?} */
                    var bitlen = i < 12 ? 5 : 4;
                    /** @type {?} */
                    var bits = Number(c).toString(2);
                    if (bits.length > bitlen) {
                        throw new TypeError('Invalid name ' + name);
                    }
                    bits = '0'.repeat(bitlen - bits.length) + bits;
                    bitstr += bits;
                }
                /** @type {?} */
                var value = Long.fromString(bitstr, true, 2);
                /** @type {?} */
                var leHex = '';
                /** @type {?} */
                var bytes = littleEndian ? value.toBytesLE() : value.toBytesBE();
                try {
                    for (var bytes_1 = __values(bytes), bytes_1_1 = bytes_1.next(); !bytes_1_1.done; bytes_1_1 = bytes_1.next()) {
                        var b = bytes_1_1.value;
                        /** @type {?} */
                        var n = Number(b).toString(16);
                        leHex += (n.length === 1 ? '0' : '') + n;
                    }
                }
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (bytes_1_1 && !bytes_1_1.done && (_a = bytes_1.return))
                            _a.call(bytes_1);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
                }
                /** @type {?} */
                var ulName = Long.fromString(leHex, true, 16).toString();
                // console.log('encodeName', name, value.toString(), ulName.toString(), JSON.stringify(bitstr.split(/(.....)/).slice(1)))
                return ulName.toString();
                var e_1, _a;
            };
        // -------------------------------------------------------
        /**
         * @param {?} name
         * @return {?}
         */
        ScatterUtils.prototype.encodeName = /**
         * @param {?} name
         * @return {?}
         */
            function (name) {
                /** @type {?} */
                var number = this.oldEosjsEncodeName(name);
                return new BigNumber(number);
            };
        return ScatterUtils;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var VapaeeScatter = (function () {
        function VapaeeScatter() {
            var _this = this;
            this.scatterutils = new ScatterUtils();
            this.onNetworkChange = new rxjs.Subject();
            this.onLogggedStateChange = new rxjs.Subject();
            this.waitReady = new Promise(function (resolve) {
                _this.setReady = resolve;
            });
            this.waitLogged = new Promise(function (resolve) {
                _this.setLogged = resolve;
            });
            this.waitConnected = new Promise(function (resolve) {
                _this.setConnected = resolve;
            });
            this.waitEosjs = new Promise(function (resolve) {
                _this.setEosjs = resolve;
            });
            this.waitEndpoints = new Promise(function (resolve) {
                _this.setEndpointsReady = resolve;
            });
            this.reconnectTime = 100;
            this.feed = new feedback.Feedback();
            this._networks_slugs = [];
            this._networks = {};
            this._network = {
                "name": "EOS MainNet",
                "symbol": "EOS",
                "explorer": "https://www.bloks.io",
                "chainId": "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
                "endpoints": [{
                        "protocol": "https",
                        "host": "nodes.get-scatter.com",
                        "port": 443
                    }]
            };
            this.symbol = "EOS";
            // this.waitReady.then(() => console.log("ScatterService.setReady()"));
            // console.error("scatter interrumpido --------------------------------");
            this._account_queries = {};
        }
        Object.defineProperty(VapaeeScatter.prototype, "utils", {
            get: /**
             * @return {?}
             */ function () {
                return this.scatterutils;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VapaeeScatter.prototype, "account", {
            // Acount, Identity and authentication -----------------
            get: /**
             * @return {?}
             */ function () {
                if (!this._account || !this._account.name) {
                    if (this.lib && this.lib.identity && this.lib.identity.accounts) {
                        this._account = this.lib.identity.accounts.find(function (x) { return x.blockchain === "eos" || x.blockchain === "tlos"; });
                    }
                }
                return this._account;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VapaeeScatter.prototype, "default", {
            get: /**
             * @return {?}
             */ function () {
                // default data before loading data
                // TODO: fill out with better default data.
                return {
                    name: 'guest',
                    data: {
                        total_balance: "",
                        total_balance_asset: new Asset(),
                        cpu_limit: {},
                        net_limit: {},
                        ram_limit: {},
                        refund_request: {},
                        total_resources: {}
                    }
                };
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        VapaeeScatter.prototype.resetIdentity = /**
         * @return {?}
         */
            function () {
                console.log("ScatterService.resetIdentity()");
                this.error = "";
                if (this.lib) {
                    this.lib.identity = null;
                    if (!this.lib.forgotten) {
                        this.lib.forgotten = true;
                        this.lib.forgetIdentity();
                    }
                }
                this.onLogggedStateChange.next(true);
            };
        /**
         * @param {?} identity
         * @return {?}
         */
        VapaeeScatter.prototype.setIdentity = /**
         * @param {?} identity
         * @return {?}
         */
            function (identity) {
                var _this = this;
                console.log("ScatterService.setIdentity()", [identity]);
                console.assert(!!this.lib, "ERROR: no instance of scatter found");
                this.error = "";
                this.lib.identity = identity;
                this.lib.forgotten = false;
                this._account = this.lib.identity.accounts.find(function (x) { return x.blockchain === "eos" || x.blockchain === "tlos"; });
                if (!this.account) {
                    console.error("ScatterService.setIdentity()", [identity]);
                }
                // console.log("ScatterService.setIdentity() -> ScatterService.queryAccountData() : " , [this.account.name]);
                this.queryAccountData(this.account.name).then(function (account) {
                    _this.account.data = account;
                    _this.onLogggedStateChange.next(true);
                }).catch(function (_) {
                    _this.account.data = _this.default.data;
                    _this.onLogggedStateChange.next(true);
                });
            };
        /**
         * @param {?} endpoints
         * @return {?}
         */
        VapaeeScatter.prototype.setEndpoints = /**
         * @param {?} endpoints
         * @return {?}
         */
            function (endpoints) {
                this._networks = endpoints || this._networks;
                for (var i in this._networks) {
                    this._networks_slugs.push(i);
                }
                this.setEndpointsReady();
            };
        /**
         * @param {?} name
         * @param {?=} index
         * @return {?}
         */
        VapaeeScatter.prototype.setNetwork = /**
         * @param {?} name
         * @param {?=} index
         * @return {?}
         */
            function (name, index) {
                var _this = this;
                if (index === void 0) {
                    index = 0;
                }
                console.log("ScatterService.setNetwork(" + name + "," + index + ")");
                return this.waitEndpoints.then(function () {
                    /** @type {?} */
                    var n = _this.getNetwork(name, index);
                    if (n) {
                        if (_this._network.name != n.name) {
                            _this._network = n;
                            _this.resetIdentity();
                            _this.initScatter();
                            _this.onNetworkChange.next(_this.getNetwork(name));
                        }
                    }
                    else {
                        console.error("ERROR: Scatter.setNetwork() unknown network name-index. Got ("
                            + name + ", " + index + "). Availables are:", _this._networks);
                        console.error("Falling back to eos mainnet");
                        return _this.setNetwork("eos");
                    }
                });
            };
        /**
         * @param {?} slug
         * @param {?=} index
         * @return {?}
         */
        VapaeeScatter.prototype.getNetwork = /**
         * @param {?} slug
         * @param {?=} index
         * @return {?}
         */
            function (slug, index) {
                if (index === void 0) {
                    index = 0;
                }
                if (this._networks[slug]) {
                    if (this._networks[slug].endpoints.length > index && index >= 0) {
                        /** @type {?} */
                        var network = this._networks[slug];
                        /** @type {?} */
                        var endpoint = network.endpoints[index];
                        network.slug = slug;
                        network.index = index;
                        network.eosconf = {
                            blockchain: "eos",
                            chainId: network.chainId,
                            host: endpoint.host,
                            port: endpoint.port,
                            protocol: endpoint.protocol,
                        };
                        return network;
                    }
                    else {
                        console.error("ERROR: Scatter.getNetwork() index out of range. Got "
                            + index + " expected number between [0.." + this._networks[slug].endpoints.length + "]");
                    }
                }
                else {
                    console.error("ERROR: Scatter.getNetwork() unknown network slug. Got "
                        + slug + " expected one of", this.networks);
                }
                return null;
            };
        Object.defineProperty(VapaeeScatter.prototype, "networks", {
            get: /**
             * @return {?}
             */ function () {
                return this._networks_slugs;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VapaeeScatter.prototype, "network", {
            get: /**
             * @return {?}
             */ function () {
                return this._network;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        VapaeeScatter.prototype.resetPromises = /**
         * @return {?}
         */
            function () {
                var _this = this;
                console.error("ScatterService.resetPromises()");
                this.waitEosjs.then(function (r) {
                    _this.waitEosjs = null;
                    /** @type {?} */
                    var p = new Promise(function (resolve) {
                        if (_this.waitEosjs)
                            return;
                        _this.waitEosjs = p;
                        _this.setEosjs = resolve;
                        _this.resetPromises();
                    });
                });
                this.waitConnected.then(function (r) {
                    _this.waitConnected = null;
                    /** @type {?} */
                    var p = new Promise(function (resolve) {
                        if (_this.waitConnected)
                            return;
                        _this.waitConnected = p;
                        _this.setConnected = resolve;
                        _this.resetPromises();
                    });
                });
                this.waitReady.then(function (r) {
                    _this.waitReady = null;
                    /** @type {?} */
                    var p = new Promise(function (resolve) {
                        if (_this.waitReady)
                            return;
                        _this.waitReady = p;
                        _this.setReady = resolve;
                        _this.resetPromises();
                        //this.waitReady.then(() => console.log("ScatterService.setReady()"));
                    });
                });
                this.waitLogged.then(function (r) {
                    _this.waitLogged = null;
                    /** @type {?} */
                    var p = new Promise(function (resolve) {
                        if (_this.waitLogged)
                            return;
                        _this.waitLogged = p;
                        _this.setLogged = resolve;
                        _this.resetPromises();
                    });
                });
            };
        // ----------------------------------------------------------
        // Scatter initialization and AppConnection -----------------
        /**
         * @return {?}
         */
        VapaeeScatter.prototype.initScatter = /**
         * @return {?}
         */
            function () {
                console.log("ScatterService.initScatter()");
                /*/
                        // eosjs2
                        this.error = "";
                        if ((<any>window).ScatterJS) {
                            this.ScatterJS = (<any>window).ScatterJS;
                            (<any>window).ScatterJS = null;
                        }
                
                        try {
                            ScatterJS.plugins( new ScatterEOS() );
                        } catch (e) {
                            console.error("ERROR:", e.message, [e]);
                            console.error("Falling back to normal ScatterEOS plugin");
                            ScatterJS.plugins( new ScatterEOS() );
                        }
                         
                        this.lib = ScatterJS.scatter;
                
                        const network = ScatterJS.Network.fromJson(this.network.eosconf);
                        this.rpc = new JsonRpc(network.fullhost());
                        this.eos = this.lib.eos(network, Api, {rpc:this.rpc});
                
                        this.setEosjs("eosjs");
                        /*/
                // eosjs
                console.log("ScatterService.initScatter()");
                this.error = "";
                if (((window)).ScatterJS) {
                    this.ScatterJS = ((window)).ScatterJS;
                    this.ScatterJS.plugins(new ScatterEOS());
                    this.lib = this.ScatterJS.scatter;
                    ((window)).ScatterJS = null;
                }
                console.log("EOSJS()", [this.network.eosconf]);
                this.eos = this.lib.eos(this.network.eosconf, Eos, { expireInSeconds: 60 });
                this.setEosjs("eosjs");
                //*/
            };
        /**
         * @return {?}
         */
        VapaeeScatter.prototype.retryConnectingApp = /**
         * @return {?}
         */
            function () {
                var _this = this;
                clearInterval(this.reconnectTimer);
                this.reconnectTimer = setInterval(function (_) {
                    // console.log("ScatterService.reconnectTimer()");
                    if (_this._connected) {
                        // console.error("ScatterService.retryConnectingApp() limpio el intervalo");
                        clearInterval(_this.reconnectTimer);
                    }
                    else {
                        if (_this.account) {
                            // console.error("ScatterService.retryConnectingApp()  existe account pero no está conectado");
                            // console.error("ScatterService.retryConnectingApp()  existe account pero no está conectado");
                            _this.connectApp();
                        }
                    }
                }, this.reconnectTime);
                this.reconnectTime += 1000 * Math.random();
                if (this.reconnectTime > 4000)
                    this.reconnectTime = 4000;
            };
        /**
         * @param {?=} appTitle
         * @return {?}
         */
        VapaeeScatter.prototype.connectApp = /**
         * @param {?=} appTitle
         * @return {?}
         */
            function (appTitle) {
                var _this = this;
                if (appTitle === void 0) {
                    appTitle = "";
                }
                // this.connect_count++;
                // var resolve_num = this.connect_count;
                this.feed.setLoading("connect", true);
                if (appTitle != "")
                    this.appTitle = appTitle;
                console.log("ScatterService.connectApp(" + this.appTitle + ")");
                /** @type {?} */
                var connectionOptions = { initTimeout: 1800 };
                if (this._connected)
                    return Promise.resolve();
                /** @type {?} */
                var promise = new Promise(function (resolve, reject) {
                    _this.waitConnected.then(resolve);
                    if (_this._connected)
                        return; // <---- avoids a loop
                    _this.waitEosjs.then(function () {
                        console.log("ScatterService.waitEosjs() eos OK");
                        _this.lib.connect(_this.appTitle, connectionOptions).then(function (connected) {
                            // si está logueado this.lib.identity se carga sólo y ya está disponible
                            console.log("ScatterService.lib.connect()", connected);
                            _this._connected = connected;
                            if (!connected) {
                                _this.feed.setError("connect", "ERROR: can not connect to Scatter. Is it up and running?");
                                console.error(_this.feed.error("connect"));
                                reject(_this.feed.error("connect"));
                                _this.feed.setLoading("connect", false);
                                _this.retryConnectingApp();
                                return false;
                            }
                            // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
                            console.log("ScatterService.setConnected()");
                            _this.setConnected("connected");
                            _this.feed.setLoading("connect", false);
                            if (_this.logged) {
                                _this.login().then(function () {
                                    console.log("ScatterService.setReady()");
                                    _this.setReady("ready");
                                }).catch(reject);
                            }
                            else {
                                console.log("ScatterService.setReady()");
                                _this.setReady("ready");
                            }
                        }).catch(function (e) {
                            console.error(e);
                            _this.feed.setLoading("connect", false);
                            throw e;
                        });
                    });
                });
                return promise;
            };
        // ----------------------------------------------------------
        // AccountData and Balances ---------------------------------
        /**
         * @param {?} account
         * @return {?}
         */
        VapaeeScatter.prototype.calculateTotalBalance = /**
         * @param {?} account
         * @return {?}
         */
            function (account) {
                return new Asset("0.0000 " + this.symbol)
                    .plus(account.core_liquid_balance_asset)
                    .plus(account.refund_request.net_amount_asset)
                    .plus(account.refund_request.cpu_amount_asset)
                    .plus(account.self_delegated_bandwidth.cpu_weight_asset)
                    .plus(account.self_delegated_bandwidth.net_weight_asset);
            };
        /**
         * @param {?} limit
         * @return {?}
         */
        VapaeeScatter.prototype.calculateResourceLimit = /**
         * @param {?} limit
         * @return {?}
         */
            function (limit) {
                limit = Object.assign({
                    max: 0, used: 0
                }, limit);
                if (limit.max != 0) {
                    limit.percent = 1 - (Math.min(limit.used, limit.max) / limit.max);
                }
                else {
                    limit.percent = 0;
                }
                limit.percentStr = Math.round(limit.percent * 100) + "%";
                return limit;
            };
        /**
         * @param {?} name
         * @return {?}
         */
        VapaeeScatter.prototype.queryAccountData = /**
         * @param {?} name
         * @return {?}
         */
            function (name) {
                var _this = this;
                /*
                        // get_table_rows
                            code: "eosio"
                            index_position: 1
                            json: true
                            key_type: "i64"
                            limit: -1
                            lower_bound: null
                            scope: "gqydoobuhege"
                            table: "delband"
                            table_key: ""
                        */
                console.log("ScatterService.queryAccountData(" + name + ") ");
                this._account_queries[name] = this._account_queries[name] || new Promise(function (resolve, reject) {
                    // console.log("PASO 1 ------", [this._account_queries])
                    // console.log("PASO 1 ------", [this._account_queries])
                    _this.waitEosjs.then(function () {
                        // console.log("PASO 2 (eosjs) ------");
                        /*
                                        // eosjs2
                                        this.rpc.get_account(name).
                                        /*/
                        // eosjs
                        // console.log("PASO 2 (eosjs) ------");
                        /*
                        // eosjs2
                        this.rpc.get_account(name).
                        /*/
                        // eosjs
                        _this.eos.getAccount({ account_name: name }).
                            then(function (response) {
                            /** @type {?} */
                            var account_data = (response);
                            if (account_data.core_liquid_balance) {
                                _this.symbol = account_data.core_liquid_balance.split(" ")[1];
                            }
                            else {
                                account_data.core_liquid_balance = "0.0000 " + _this.symbol;
                            }
                            account_data.core_liquid_balance_asset = new Asset(account_data.core_liquid_balance);
                            // ----- refund_request -----
                            account_data.refund_request = account_data.refund_request || {
                                total: "0.0000 " + _this.symbol,
                                net_amount: "0.0000 " + _this.symbol,
                                cpu_amount: "0.0000 " + _this.symbol,
                                request_time: "2018-11-18T18:09:53"
                            };
                            account_data.refund_request.cpu_amount_asset = new Asset(account_data.refund_request.cpu_amount);
                            account_data.refund_request.net_amount_asset = new Asset(account_data.refund_request.net_amount);
                            account_data.refund_request.total_asset =
                                account_data.refund_request.cpu_amount_asset.plus(account_data.refund_request.net_amount_asset);
                            account_data.refund_request.total = account_data.refund_request.total_asset.toString();
                            // ----- self_delegated_bandwidth ----
                            account_data.self_delegated_bandwidth = account_data.self_delegated_bandwidth || {
                                total: "0.0000 " + _this.symbol,
                                net_weight: "0.0000 " + _this.symbol,
                                cpu_weight: "0.0000 " + _this.symbol
                            };
                            account_data.self_delegated_bandwidth.net_weight_asset = new Asset(account_data.self_delegated_bandwidth.net_weight);
                            account_data.self_delegated_bandwidth.cpu_weight_asset = new Asset(account_data.self_delegated_bandwidth.cpu_weight);
                            account_data.self_delegated_bandwidth.total_asset =
                                account_data.self_delegated_bandwidth.cpu_weight_asset.plus(account_data.self_delegated_bandwidth.net_weight_asset);
                            account_data.self_delegated_bandwidth.total = account_data.self_delegated_bandwidth.total_asset.toString();
                            // ----- total_resources -----
                            account_data.total_resources = account_data.total_resources || {
                                net_weight: "0.0000 " + _this.symbol,
                                cpu_weight: "0.0000 " + _this.symbol
                            };
                            account_data.total_resources.net_weight_asset = new Asset(account_data.total_resources.net_weight);
                            account_data.total_resources.cpu_weight_asset = new Asset(account_data.total_resources.cpu_weight);
                            account_data.total_balance_asset = _this.calculateTotalBalance(account_data);
                            account_data.total_balance = account_data.total_balance_asset.toString();
                            account_data.cpu_limit = _this.calculateResourceLimit(account_data.cpu_limit);
                            account_data.net_limit = _this.calculateResourceLimit(account_data.net_limit);
                            account_data.ram_limit = _this.calculateResourceLimit({
                                max: account_data.ram_quota, used: account_data.ram_usage
                            });
                            // console.log("-------------------------------");
                            // console.log("account_data: ", account_data);
                            // console.log("-------------------------------");
                            resolve(account_data);
                        }).catch(function (err) {
                            reject(err);
                        });
                    }).catch(function (error) {
                        console.error(error);
                        reject(error);
                    });
                });
                /** @type {?} */
                var promise = this._account_queries[name];
                promise.then(function (r) {
                    setTimeout(function () {
                        delete _this._account_queries[r.account_name];
                    });
                });
                return promise;
            };
        /*
        // eosjs2
        async executeTransaction(contract:string, action:string, data:any) {
            return new Promise((resolve, reject) => {
                this.login().then(_ => {
                    this.waitReady.then(() => {
                        
                        this.eos.transact(
                            {
                                actions: [{
                                    account: contract,
                                    name: action,
                                    data: data,
                                    authorization: [{
                                        actor: this.account.name,
                                        permission: this.account.authority
                                    }],
                                }]
                            },
                            {
                                blocksBehind: 3,
                                expireSeconds: 30
                            }
                        ).then(result => {
                            console.log("EXITO !!!!", result);
                            resolve(result);
                        }).catch((error) => {
                            console.error("ERROR !!!!", error);
                            reject(error);
                        });


                    });
                }).catch((error) => {
                    console.error(error);
                    reject(error);
                });
            });
        }
        */
        /*
        
        {
            actions: [{
                account: this.contractAccount,
                name: action,
                authorization: [{
                    actor: this.account.name,
                    permission: this.account.authority
                }],
                data: {
                  ...data
                }
            }]
        },
        {
            blocksBehind: 3,
            expireSeconds: 30
        }
        */
        /**
         * @param {?} account_name
         * @return {?}
         */
        VapaeeScatter.prototype.getSmartContract = /**
         * @param {?} account_name
         * @return {?}
         */
            function (account_name) {
                return new SmartContract(account_name, this);
            };
        /**
         * @param {?} account_name
         * @return {?}
         */
        VapaeeScatter.prototype.getContractWrapper = /**
         * @param {?} account_name
         * @return {?}
         */
            function (account_name) {
                var _this = this;
                console.log("ScatterService.getContract(" + account_name + ")");
                return new Promise(function (resolve, reject) {
                    _this.login().then(function (a) {
                        console.log("this.login().then((a) => { -->", a);
                        _this.waitReady.then(function () {
                            _this.eos.contract(account_name).then(function (contract) {
                                console.log("-- contract " + account_name + " --");
                                for (var i in contract) {
                                    if (typeof contract[i] == "function")
                                        console.log("contract." + i + "()", [contract[i]]);
                                }
                                resolve(contract);
                            }).catch(function (error) {
                                console.error(error);
                            });
                        });
                    }).catch(function (error) {
                        console.error(error);
                        reject(error);
                    });
                });
            };
        /*
        transfer(from:string, to:string, amount:string, memo:string) {
            console.log("ScatterService.transfer()", from, to, amount, memo);
            return new Promise((resolve, reject) => {
                this.waitEosjs.then(() => {
                    console.log("Scatter.transfer():", from, to, amount, memo, this.authorization);
                    
                    this.eos.transfer(from, to, amount, memo, this.authorization).then(trx => {
                        // That's it!
                        console.log(`Transaction ID: ${trx.transaction_id}`, trx);
                        // en Notas está el json que describe el objeto trx
                        resolve(trx);
                    }).catch(error => {
                        console.error(error);
                    });
                    
                }).catch((error) => {
                    console.error(error);
                    reject(error);
                });
            });
        }
        */
        // loginTimer;
        /**
         * @return {?}
         */
        VapaeeScatter.prototype.login = /**
         * @return {?}
         */
            function () {
                var _this = this;
                console.log("ScatterService.login()");
                this.feed.setLoading("login", true);
                return new Promise(function (resolve, reject) {
                    if (_this.lib.identity) {
                        _this.setIdentity(_this.lib.identity);
                        resolve(_this.lib.identity);
                    }
                    else {
                        /** @type {?} */
                        var loginTimer = setTimeout(function (_) {
                            _this.feed.setLoading("login", false);
                            reject("connection timeout");
                        }, 5000);
                        _this.connectApp().then(function () {
                            _this.lib.getIdentity({ "accounts": [_this.network.eosconf] })
                                .then(function (identity) {
                                clearTimeout(loginTimer);
                                _this.setIdentity(identity);
                                _this.setLogged();
                                _this.feed.setLoading("login", false);
                                resolve(identity);
                            })
                                .catch(reject);
                        }).catch(reject);
                    }
                });
            };
        /**
         * @return {?}
         */
        VapaeeScatter.prototype.logout = /**
         * @return {?}
         */
            function () {
                var _this = this;
                console.log("ScatterService.logout()");
                this.feed.setLoading("login", false);
                return new Promise(function (resolve, reject) {
                    _this.connectApp().then(function () {
                        _this.lib.forgotten = true;
                        _this.lib.forgetIdentity()
                            .then(function (err) {
                            console.log("disconnect", err);
                            _this.resetIdentity();
                            _this.feed.setLoading("login", false);
                            resolve("logout");
                        })
                            .catch(reject);
                    }).catch(reject);
                });
            };
        Object.defineProperty(VapaeeScatter.prototype, "logged", {
            get: /**
             * @return {?}
             */ function () {
                if (!this.lib)
                    return false;
                return !!this.lib.identity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VapaeeScatter.prototype, "username", {
            get: /**
             * @return {?}
             */ function () {
                if (!this.lib)
                    return "";
                return this.lib.identity ? this.lib.identity.name : "";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VapaeeScatter.prototype, "authorization", {
            get: /**
             * @return {?}
             */ function () {
                if (!this.account) {
                    console.error("ScatterService.authorization()");
                    return { authorization: ["unknown@unknown"] };
                }
                return {
                    authorization: [this.account.name + "@" + this.account.authority]
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VapaeeScatter.prototype, "connected", {
            get: /**
             * @return {?}
             */ function () {
                return this._connected;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} contract
         * @param {?} scope
         * @param {?} table
         * @param {?} tkey
         * @param {?} lowerb
         * @param {?} upperb
         * @param {?} limit
         * @param {?} ktype
         * @param {?} ipos
         * @return {?}
         */
        VapaeeScatter.prototype.getTableRows = /**
         * @param {?} contract
         * @param {?} scope
         * @param {?} table
         * @param {?} tkey
         * @param {?} lowerb
         * @param {?} upperb
         * @param {?} limit
         * @param {?} ktype
         * @param {?} ipos
         * @return {?}
         */
            function (contract, scope, table, tkey, lowerb, upperb, limit, ktype, ipos) {
                var _this = this;
                /*
                        // console.log("ScatterService.getTableRows()");
                        // https://github.com/EOSIO/eosjs-api/blob/master/docs/api.md#eos.getTableRows
                        return new Promise<any>((resolve, reject) => {
                            this.waitEosjs.then(() => {
                                var json = {
                                    code: contract,
                                    index_position: ipos,
                                    json: true,
                                    key_type: ktype,
                                    limit: limit,
                                    lower_bound: lowerb,
                                    scope: scope,
                                    table: table,
                                    table_key: tkey,
                                    upper_bound: upperb
                                }
                                
                                this.rpc.get_table_rows(json).then(_data => {
                                    resolve(_data);
                                }).catch(error => {
                                    console.error(error);
                                });
                
                                
                            }).catch((error) => {
                                console.error(error);
                                reject(error);
                            });
                        });
                        /*/
                // console.log("ScatterService.getTableRows()");
                // https://github.com/EOSIO/eosjs-api/blob/master/docs/api.md#eos.getTableRows
                return new Promise(function (resolve, reject) {
                    _this.waitEosjs.then(function () {
                        _this.eos.getTableRows(true, contract, scope, table, tkey, lowerb, upperb, limit, ktype, ipos).then(function (_data) {
                            resolve(_data);
                        }).catch(function (error) {
                            console.error(error);
                        });
                    }).catch(function (error) {
                        console.error(error);
                        reject(error);
                    });
                });
                //*/
            };
        VapaeeScatter.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: "root"
                    },] },
        ];
        /** @nocollapse */
        VapaeeScatter.ctorParameters = function () { return []; };
        /** @nocollapse */ VapaeeScatter.ngInjectableDef = i0.defineInjectable({ factory: function VapaeeScatter_Factory() { return new VapaeeScatter(); }, token: VapaeeScatter, providedIn: "root" });
        return VapaeeScatter;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var VapaeeScatterModule = (function () {
        function VapaeeScatterModule() {
        }
        VapaeeScatterModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [],
                        declarations: [],
                        providers: [VapaeeScatter],
                        exports: []
                    },] },
        ];
        return VapaeeScatterModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.VapaeeScatter = VapaeeScatter;
    exports.VapaeeScatterModule = VapaeeScatterModule;
    exports.Asset = Asset;
    exports.SmartContract = SmartContract;
    exports.Token = Token;
    exports.ScatterUtils = ScatterUtils;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFwYWVlLXNjYXR0ZXIudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9AdmFwYWVlL3NjYXR0ZXIvbGliL3Rva2VuLmNsYXNzLnRzIiwibmc6Ly9AdmFwYWVlL3NjYXR0ZXIvbGliL2Fzc2V0LmNsYXNzLnRzIiwibmc6Ly9AdmFwYWVlL3NjYXR0ZXIvbGliL2NvbnRyYWN0LmNsYXNzLnRzIixudWxsLCJuZzovL0B2YXBhZWUvc2NhdHRlci9saWIvdXRpbHMuY2xhc3MudHMiLCJuZzovL0B2YXBhZWUvc2NhdHRlci9saWIvc2NhdHRlci5zZXJ2aWNlLnRzIiwibmc6Ly9AdmFwYWVlL3NjYXR0ZXIvbGliL3NjYXR0ZXIubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuXG5leHBvcnQgY2xhc3MgVG9rZW4ge1xuICAgIHByaXZhdGUgX3N0cj86IHN0cmluZztcbiAgICBwcml2YXRlIF9zeW1ib2w6IHN0cmluZztcbiAgICBwcml2YXRlIF9wcmVjaXNpb24/OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfY29udHJhY3Q/OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihvYmo6YW55ID0gbnVsbCkge1xuICAgICAgICB0aGlzLl9zeW1ib2wgPSBcIkFVWFwiO1xuICAgICAgICB0aGlzLl9wcmVjaXNpb24gPSBudWxsO1xuICAgICAgICB0aGlzLl9jb250cmFjdCA9IG51bGw7XG4gICAgXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRoaXMuX3N5bWJvbCA9IG9iajtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHRoaXMuc3ltYm9sLmxlbmd0aCA+IDAsIFwiRVJST1I6IHN5bWJvbCBub3QgdmFsaWQgZm9yIHRva2VuOiBcIiwgdGhpcy5fc3ltYm9sKTtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHRoaXMuc3ltYm9sLmxlbmd0aCA8IDksIFwiRVJST1I6IHN5bWJvbCBub3QgdmFsaWQgZm9yIHRva2VuOiBcIiwgdGhpcy5fc3ltYm9sKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIFRva2VuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3ltYm9sID0gb2JqLl9zeW1ib2w7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlY2lzaW9uID0gb2JqLl9wcmVjaXNpb247XG4gICAgICAgICAgICAgICAgdGhpcy5fY29udHJhY3QgPSBvYmouX2NvbnRyYWN0O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zeW1ib2wgPSBvYmouc3ltYm9sIHx8IHRoaXMuX3N5bWJvbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmVjaXNpb24gPSBvYmoucHJlY2lzaW9uIHx8IHRoaXMuX3ByZWNpc2lvbjtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250cmFjdCA9IG9iai5jb250cmFjdCB8fCB0aGlzLl9jb250cmFjdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBnZXQgc3ltYm9sKCkgeyByZXR1cm4gdGhpcy5fc3ltYm9sOyB9XG4gICAgZ2V0IHByZWNpc2lvbigpIHsgcmV0dXJuIHRoaXMuX3ByZWNpc2lvbjsgfVxuICAgIGdldCBjb250cmFjdCgpIHsgcmV0dXJuIHRoaXMuX2NvbnRyYWN0OyB9XG5cbiAgICBnZXQgc3RyKCkge1xuICAgICAgICBpZiAodGhpcy5fc3RyKSByZXR1cm4gdGhpcy5fc3RyO1xuICAgICAgICB0aGlzLl9zdHIgPSB0aGlzLnN5bWJvbDtcbiAgICAgICAgaWYgKHRoaXMuX3ByZWNpc2lvbiAhPSBudWxsIHx8IHRoaXMuX2NvbnRyYWN0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wcmVjaXNpb24gJiYgdGhpcy5fY29udHJhY3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdHIgKz0gXCIgKFwiICsgdGhpcy5fcHJlY2lzaW9uICsgXCIsIFwiICsgdGhpcy5fY29udHJhY3QgKyBcIilcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ByZWNpc2lvbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHIgKz0gXCIgKFwiICsgdGhpcy5fcHJlY2lzaW9uICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jb250cmFjdCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHIgKz0gXCIgKFwiICsgdGhpcy5fY29udHJhY3QgKyBcIilcIjtcbiAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fc3RyO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdHI7XG4gICAgfVxuXG59IiwiaW1wb3J0IEJpZ051bWJlciBmcm9tIFwiYmlnbnVtYmVyLmpzXCI7XG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuL3Rva2VuLmNsYXNzXCI7XG5cbmV4cG9ydCBjbGFzcyBBc3NldCB7XG4gICAgYW1vdW50OkJpZ051bWJlcjtcbiAgICB0b2tlbjpUb2tlbjtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihhOiBhbnkgPSBudWxsLCBiOiBhbnkgPSBudWxsKSB7XG4gICAgICAgIGlmIChhID09IG51bGwgJiYgYiA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmFtb3VudCA9IG5ldyBCaWdOdW1iZXIoMCk7XG4gICAgICAgICAgICB0aGlzLnRva2VuID0gbmV3IFRva2VuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEJpZ051bWJlcikge1xuICAgICAgICAgICAgdGhpcy5hbW91bnQgPSBhO1xuICAgICAgICAgICAgdGhpcy50b2tlbiA9IGI7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEFzc2V0KSB7XG4gICAgICAgICAgICB0aGlzLmFtb3VudCA9IGEuYW1vdW50O1xuICAgICAgICAgICAgdGhpcy50b2tlbiA9IGI7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGEgPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgdGhpcy5hbW91bnQgPSBuZXcgQmlnTnVtYmVyKGEpO1xuICAgICAgICAgICAgdGhpcy50b2tlbiA9IGI7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGEgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhpcy5wYXJzZShhKTtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHRoaXMuYW1vdW50IGluc3RhbmNlb2YgQmlnTnVtYmVyLCBcIkVSUk9SOiBBc3NldCBzdHJpbmcgbWFsZm9ybWVkOiAnXCIrYStcIidcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwbHVzKGI6QXNzZXQpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoISFiLCBcIkVSUk9SOiBiIGlzIG5vdCBhbiBBc3NldFwiLCBiLCB0aGlzLnN0cik7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGIudG9rZW4uc3ltYm9sID09IHRoaXMudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiB0cnlpbmcgdG8gc3VtIGFzc2V0cyB3aXRoIGRpZmZlcmVudCB0b2tlbnM6IFwiICsgdGhpcy5zdHIgKyBcIiBhbmQgXCIgKyBiLnN0cik7XG4gICAgICAgIHZhciBhbW91bnQgPSB0aGlzLmFtb3VudC5wbHVzKGIuYW1vdW50KTtcbiAgICAgICAgcmV0dXJuIG5ldyBBc3NldChhbW91bnQsIHRoaXMudG9rZW4pO1xuICAgIH1cblxuICAgIG1pbnVzKGI6QXNzZXQpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoISFiLCBcIkVSUk9SOiBiIGlzIG5vdCBhbiBBc3NldFwiLCBiLCB0aGlzLnN0cik7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGIudG9rZW4uc3ltYm9sID09IHRoaXMudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiB0cnlpbmcgdG8gc3Vic3RyYWN0IGFzc2V0cyB3aXRoIGRpZmZlcmVudCB0b2tlbnM6IFwiICsgdGhpcy5zdHIgKyBcIiBhbmQgXCIgKyBiLnN0cik7XG4gICAgICAgIHZhciBhbW91bnQgPSB0aGlzLmFtb3VudC5taW51cyhiLmFtb3VudCk7XG4gICAgICAgIHJldHVybiBuZXcgQXNzZXQoYW1vdW50LCB0aGlzLnRva2VuKTtcbiAgICB9XG5cbiAgICBjbG9uZSgpOiBBc3NldCB7XG4gICAgICAgIHJldHVybiBuZXcgQXNzZXQodGhpcy5hbW91bnQsIHRoaXMudG9rZW4pO1xuICAgIH1cblxuICAgIHBhcnNlKHRleHQ6IHN0cmluZykge1xuICAgICAgICBpZiAodGV4dCA9PSBcIlwiKSByZXR1cm47XG4gICAgICAgIHZhciBzeW0gPSB0ZXh0LnNwbGl0KFwiIFwiKVsxXTtcbiAgICAgICAgdmFyIGFtb3VudF9zdHIgPSB0ZXh0LnNwbGl0KFwiIFwiKVswXTtcbiAgICAgICAgdGhpcy5hbW91bnQgPSBuZXcgQmlnTnVtYmVyKGFtb3VudF9zdHIpO1xuXG4gICAgICAgIHZhciBwcmVjaXNpb24gPSAwO1xuICAgICAgICBpZiAoYW1vdW50X3N0ci5zcGxpdChcIi5cIikubGVuZ3RoID09IDIpIHtcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IGFtb3VudF9zdHIuc3BsaXQoXCIuXCIpWzFdLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIGlmIChhbW91bnRfc3RyLnNwbGl0KFwiLlwiKS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgaWYgKGlzTmFOKHBhcnNlSW50KGFtb3VudF9zdHIpKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjogQXNzZXQgbWFsZm9ybWVkIHN0cmluZzogJ1wiK3RleHQrXCInXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLnRva2VuID0gbmV3IFRva2VuKHtcbiAgICAgICAgICAgIHN5bWJvbDogc3ltLFxuICAgICAgICAgICAgcHJlY2lzaW9uOiBwcmVjaXNpb25cbiAgICAgICAgfSk7IFxuICAgIH1cblxuICAgIHZhbHVlVG9TdHJpbmcoZGVjaW1hbHM6bnVtYmVyID0gLTEsIHRvdGFsOmJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy50b2tlbikgcmV0dXJuIFwiMFwiO1xuICAgICAgICB2YXIgcGFydHMgPSB0aGlzLmFtb3VudC50b0ZpeGVkKCkuc3BsaXQoXCIuXCIpO1xuICAgICAgICB2YXIgaW50ZWdlciA9IHBhcnRzWzBdO1xuICAgICAgICB2YXIgcHJlY2lzaW9uID0gdGhpcy50b2tlbi5wcmVjaXNpb247XG4gICAgICAgIHZhciBkZWNpbWFsID0gKHBhcnRzLmxlbmd0aD09MiA/IHBhcnRzWzFdIDogXCJcIik7XG4gICAgICAgIGlmIChkZWNpbWFscyAhPSAtMSkge1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gZGVjaW1hbHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRvdGFsKSB7XG4gICAgICAgICAgICBwcmVjaXNpb24gLT0gcGFydHNbMF0ubGVuZ3RoLTE7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSBwcmVjaXNpb24gPiAwID8gcHJlY2lzaW9uIDogMDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpPWRlY2ltYWwubGVuZ3RoOyBpPHByZWNpc2lvbjsgaSsrKSB7XG4gICAgICAgICAgICBkZWNpbWFsICs9IFwiMFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkZWNpbWFsLmxlbmd0aCA+IHByZWNpc2lvbikge1xuICAgICAgICAgICAgZGVjaW1hbCA9IGRlY2ltYWwuc3Vic3RyKDAsIHByZWNpc2lvbik7XG4gICAgICAgIH0gICAgXG5cbiAgICAgICAgaWYgKHByZWNpc2lvbiA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gaW50ZWdlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbnRlZ2VyICsgXCIuXCIgKyBkZWNpbWFsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9OdW1iZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy50b2tlbikgcmV0dXJuIDA7XG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHRoaXMudmFsdWVUb1N0cmluZyg4KSk7XG4gICAgfVxuXG4gICAgZ2V0IHN0ciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoZGVjaW1hbHM6bnVtYmVyID0gLTEpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMudG9rZW4pIHJldHVybiBcIjAuMDAwMFwiO1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVRvU3RyaW5nKGRlY2ltYWxzKSArIFwiIFwiICsgdGhpcy50b2tlbi5zeW1ib2wudG9VcHBlckNhc2UoKTtcbiAgICB9XG5cbiAgICBpbnZlcnNlKHRva2VuOiBUb2tlbik6IEFzc2V0IHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBCaWdOdW1iZXIoMSkuZGl2aWRlZEJ5KHRoaXMuYW1vdW50KTtcbiAgICAgICAgdmFyIGFzc2V0ID0gIG5ldyBBc3NldChyZXN1bHQsIHRva2VuKTtcbiAgICAgICAgcmV0dXJuIGFzc2V0O1xuICAgIH1cbn0iLCJpbXBvcnQgeyBWYXBhZWVTY2F0dGVyIH0gZnJvbSBcIi4vc2NhdHRlci5zZXJ2aWNlXCI7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGludGVyZmFjZSBUYWJsZVBhcmFtcyB7XG4gICAgY29udHJhY3Q/OnN0cmluZywgXG4gICAgc2NvcGU/OnN0cmluZywgXG4gICAgdGFibGVfa2V5PzpzdHJpbmcsIFxuICAgIGxvd2VyX2JvdW5kPzpzdHJpbmcsIFxuICAgIHVwcGVyX2JvdW5kPzpzdHJpbmcsIFxuICAgIGxpbWl0PzpudW1iZXIsIFxuICAgIGtleV90eXBlPzpzdHJpbmcsIFxuICAgIGluZGV4X3Bvc2l0aW9uPzpzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUYWJsZVJlc3VsdCB7XG4gICAgbW9yZTogYm9vbGVhbjtcbiAgICByb3dzOiBhbnlbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFNtYXJ0Q29udHJhY3Qge1xuICAgIGNvbnRyYWN0OiBzdHJpbmc7XG4gICAgc2NhdHRlcjogVmFwYWVlU2NhdHRlcjtcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcihjb250cmFjdDogc3RyaW5nID0gXCJcIiwgc2NhdHRlcjogVmFwYWVlU2NhdHRlciA9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb250cmFjdCA9IGNvbnRyYWN0O1xuICAgICAgICB0aGlzLnNjYXR0ZXIgPSBzY2F0dGVyO1xuICAgIH0gICAgXG4gICAgLypcbiAgICAvLyBlb3NqczJcbiAgICBleGNlY3V0ZShhY3Rpb246IHN0cmluZywgcGFyYW1zOiBhbnkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJVdGlscy5leGNlY3V0ZSgpXCIsIGFjdGlvbiwgW3BhcmFtc10pO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NhdHRlci5leGVjdXRlVHJhbnNhY3Rpb24odGhpcy5jb250cmFjdCwgYWN0aW9uLCBwYXJhbXMpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjogXCIsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7IGNvbnNvbGUuZXJyb3IoZXJyKTsgcmVqZWN0KGVycik7IH1cbiAgICAgICAgfSk7IC8vIC5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpICk7XG4gICAgfVxuICAgIC8qL1xuICAgIGV4Y2VjdXRlKGFjdGlvbjogc3RyaW5nLCBwYXJhbXM6IGFueSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlV0aWxzLmV4Y2VjdXRlKClcIiwgYWN0aW9uLCBbcGFyYW1zXSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2F0dGVyLmdldENvbnRyYWN0V3JhcHBlcih0aGlzLmNvbnRyYWN0KS50aGVuKGNvbnRyYWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0W2FjdGlvbl0ocGFyYW1zLCB0aGlzLnNjYXR0ZXIuYXV0aG9yaXphdGlvbikudGhlbigocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXRpbHMuZXhjZWN1dGUoKSAtLS0+IFwiLCBbcmVzcG9uc2VdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKS5jYXRjaChlcnIgPT4geyByZWplY3QoZXJyKTsgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikgeyByZWplY3QoZXJyKTsgfVxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7IHJlamVjdChlcnIpOyB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikgeyByZWplY3QoZXJyKTsgfVxuICAgICAgICB9KTsgLy8gLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKGVycikgKTtcbiAgICB9XG4gICAgLy8qL1xuXG4gICAgZ2V0VGFibGUodGFibGU6c3RyaW5nLCBwYXJhbXM6VGFibGVQYXJhbXMgPSB7fSk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcblxuICAgICAgICB2YXIgX3AgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIGNvbnRyYWN0OiB0aGlzLmNvbnRyYWN0LCBcbiAgICAgICAgICAgIHNjb3BlOiB0aGlzLmNvbnRyYWN0LCBcbiAgICAgICAgICAgIHRhYmxlX2tleTogXCIwXCIsIFxuICAgICAgICAgICAgbG93ZXJfYm91bmQ6IFwiMFwiLCBcbiAgICAgICAgICAgIHVwcGVyX2JvdW5kOiBcIi0xXCIsIFxuICAgICAgICAgICAgbGltaXQ6IDI1LCBcbiAgICAgICAgICAgIGtleV90eXBlOiBcImk2NFwiLCBcbiAgICAgICAgICAgIGluZGV4X3Bvc2l0aW9uOiBcIjFcIlxuICAgICAgICB9LCBwYXJhbXMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnNjYXR0ZXIuZ2V0VGFibGVSb3dzKFxuICAgICAgICAgICAgX3AuY29udHJhY3QsXG4gICAgICAgICAgICBfcC5zY29wZSwgdGFibGUsXG4gICAgICAgICAgICBfcC50YWJsZV9rZXksXG4gICAgICAgICAgICBfcC5sb3dlcl9ib3VuZCxcbiAgICAgICAgICAgIF9wLnVwcGVyX2JvdW5kLFxuICAgICAgICAgICAgX3AubGltaXQsXG4gICAgICAgICAgICBfcC5rZXlfdHlwZSxcbiAgICAgICAgICAgIF9wLmluZGV4X3Bvc2l0aW9uXG4gICAgICAgICk7XG4gICAgfSAgICBcbiAgICBcbn0iLCIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDApXHJcbiAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHQuZGVmYXVsdCA9IG1vZDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcbiIsImltcG9ydCBCaWdOdW1iZXIgZnJvbSBcImJpZ251bWJlci5qc1wiO1xuaW1wb3J0ICogYXMgTG9uZyBmcm9tICdsb25nJztcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBpbnRlcmZhY2UgU2x1Z0lkIHtcbiAgICBsb3c/OiBzdHJpbmc7XG4gICAgc3RyPzogc3RyaW5nO1xuICAgIHRvcD86IHN0cmluZztcbn1cbmV4cG9ydCBpbnRlcmZhY2UgV29yayB7XG4gICAgaXRlbXM6IGFueVtdO1xuICAgIGNvbnRhaW5lcnM6IGFueVtdO1xufVxuZXhwb3J0IGludGVyZmFjZSBQcm9maWxlIHtcbiAgICBpZD86c3RyaW5nO1xuICAgIHNsdWdpZDogU2x1Z0lkO1xuICAgIGFjY291bnQ6IHN0cmluZztcbiAgICBjb250YWluZXJzPzogYW55W10sXG4gICAgd29yaz86IFdvcms7XG59XG5cbmV4cG9ydCBjbGFzcyBTY2F0dGVyVXRpbHMge1xuICAgIGNvZGVfMDpudW1iZXI7XG4gICAgY29kZV8xOm51bWJlcjtcbiAgICBjb2RlXzQ6bnVtYmVyO1xuICAgIGNvZGVfOTpudW1iZXI7XG4gICAgY29kZV9hOm51bWJlcjtcbiAgICBjb2RlX2Y6bnVtYmVyO1xuICAgIGNvZGVfejpudW1iZXI7XG4gICAgXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY29kZV8wID0gXCIwXCIuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgdGhpcy5jb2RlXzEgPSBcIjFcIi5jaGFyQ29kZUF0KDApO1xuICAgICAgICB0aGlzLmNvZGVfNCA9IFwiNFwiLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIHRoaXMuY29kZV85ID0gXCI5XCIuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgdGhpcy5jb2RlX2EgPSBcImFcIi5jaGFyQ29kZUF0KDApO1xuICAgICAgICB0aGlzLmNvZGVfZiA9IFwiZlwiLmNoYXJDb2RlQXQoMCk7ICAgICAgICBcbiAgICAgICAgdGhpcy5jb2RlX3ogPSBcInpcIi5jaGFyQ29kZUF0KDApOyAgICAgICAgXG4gICAgfSAgICBcblxuICAgIC8vIHRoaXMgcGFydCBpcyBzdGlsbCBleHBlcmltZW50YWwgKGluaXQpIC0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZGVjb2RlTmliYmxlKG5pYjpudW1iZXIpIHtcbiAgICAgICAgdmFyIG5pYmJsZSA9IFswLDAsMCwwXTtcbiAgICAgICAgdmFyIHZhbHVlID0gMDtcbiAgICAgICAgaWYgKHRoaXMuY29kZV8wIDw9IG5pYiAmJiBuaWIgPD0gdGhpcy5jb2RlXzkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbmliIC0gdGhpcy5jb2RlXzA7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb2RlX2EgPD0gbmliICYmIG5pYiA8PSB0aGlzLmNvZGVfZikge1xuICAgICAgICAgICAgdmFsdWUgPSBuaWIgLSB0aGlzLmNvZGVfYSArIDEwO1xuICAgICAgICB9XG4gICAgICAgIG5pYmJsZVswXSA9ICh2YWx1ZSAmIDgpID4gMCA/IDEgOiAwO1xuICAgICAgICBuaWJibGVbMV0gPSAodmFsdWUgJiA0KSA+IDAgPyAxIDogMDtcbiAgICAgICAgbmliYmxlWzJdID0gKHZhbHVlICYgMikgPiAwID8gMSA6IDA7XG4gICAgICAgIG5pYmJsZVszXSA9ICh2YWx1ZSAmIDEpID4gMCA/IDEgOiAwO1xuICAgICAgICByZXR1cm4gbmliYmxlO1xuICAgIH1cblxuICAgIGVuY29kZU5pYmJsZShpbmRleDpudW1iZXIsIGJpdHM6bnVtYmVyW10pIHtcbiAgICAgICAgdmFyIHZhbHVlID0gMDtcbiAgICAgICAgdmFsdWUgKz0gYml0c1tpbmRleCArIDBdID09IDEgPyA4IDogMDtcbiAgICAgICAgdmFsdWUgKz0gYml0c1tpbmRleCArIDFdID09IDEgPyA0IDogMDtcbiAgICAgICAgdmFsdWUgKz0gYml0c1tpbmRleCArIDJdID09IDEgPyAyIDogMDtcbiAgICAgICAgdmFsdWUgKz0gYml0c1tpbmRleCArIDNdID09IDEgPyAxIDogMDtcbiAgICAgICAgaWYgKDAgPD0gdmFsdWUgJiYgdmFsdWUgPD0gOSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCIgKyB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2godmFsdWUpIHtcbiAgICAgICAgICAgIGNhc2UgMTA6IHJldHVybiBcImFcIjtcbiAgICAgICAgICAgIGNhc2UgMTE6IHJldHVybiBcImJcIjtcbiAgICAgICAgICAgIGNhc2UgMTI6IHJldHVybiBcImNcIjtcbiAgICAgICAgICAgIGNhc2UgMTM6IHJldHVybiBcImRcIjtcbiAgICAgICAgICAgIGNhc2UgMTQ6IHJldHVybiBcImVcIjtcbiAgICAgICAgICAgIGNhc2UgMTU6IHJldHVybiBcImZcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCI/XCI7XG4gICAgfVxuXG4gICAgLy8gX251bSBpcyBhbiBoZXhhXG4gICAgZGVjb2RlVWludDY0KF9udW06IHN0cmluZykge1xuICAgICAgICB2YXIgYml0czpudW1iZXJbXSA9IFtdO1xuICAgICAgICB2YXIgbnVtOnN0cmluZyA9IF9udW0uc3Vic3RyKDIpO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8bnVtLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBiaXRzID0gYml0cy5jb25jYXQodGhpcy5kZWNvZGVOaWJibGUobnVtLmNoYXJDb2RlQXQoaSkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYml0cztcbiAgICB9XG5cbiAgICBlbmNvZGVVbml0NjQoYml0czpudW1iZXJbXSkge1xuICAgICAgICB2YXIgc2x1Z2lkOlNsdWdJZCA9IHt0b3A6XCIweFwiLGxvdzpcIjB4XCJ9O1xuICAgICAgICB2YXIgc3RyID0gXCJ0b3BcIjtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPGJpdHMubGVuZ3RoOyBpKz00KSB7XG4gICAgICAgICAgICBpZiAoaT49MTI4KSBzdHIgPSBcImxvd1wiO1xuICAgICAgICAgICAgc2x1Z2lkW3N0cl0gKz0gdGhpcy5lbmNvZGVOaWJibGUoaSwgYml0cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNsdWdpZDtcbiAgICB9XG5cbiAgICBleHRyYWN0TGVuZ3RoKGJpdHM6bnVtYmVyW10pIHtcbiAgICAgICAgaWYoYml0cy5sZW5ndGggIT0gMjU2KSBjb25zb2xlLmVycm9yKFwiRVJST1I6IGV4dHJhY3RMZW5ndGgoYml0cykgYml0cyBtdXN0IGJlIGFuIGFycmF5IG9mIDI1NiBiaXRzXCIpO1xuICAgICAgICByZXR1cm4gYml0c1syNTBdICogMzIgKyBiaXRzWzI1MV0gKiAxNiArIGJpdHNbMjUyXSAqIDggKyBiaXRzWzI1M10gKiA0ICsgYml0c1syNTRdICogMiArIGJpdHNbMjU1XSAqIDE7XG4gICAgfVxuXG4gICAgaW5zZXJ0TGVuZ3RoKGJpdHM6bnVtYmVyW10sIGxlbmd0aDogbnVtYmVyKSB7XG4gICAgICAgIGlmKGJpdHMubGVuZ3RoICE9IDI1NikgY29uc29sZS5lcnJvcihcIkVSUk9SOiBleHRyYWN0TGVuZ3RoKGJpdHMpIGJpdHMgbXVzdCBiZSBhbiBhcnJheSBvZiAyNTYgYml0c1wiKTtcbiAgICAgICAgYml0c1syNTBdID0gKGxlbmd0aCAmIDMyKSA/IDEgOiAwO1xuICAgICAgICBiaXRzWzI1MV0gPSAobGVuZ3RoICYgMTYpID8gMSA6IDA7XG4gICAgICAgIGJpdHNbMjUyXSA9IChsZW5ndGggJiAgOCkgPyAxIDogMDtcbiAgICAgICAgYml0c1syNTNdID0gKGxlbmd0aCAmICA0KSA/IDEgOiAwO1xuICAgICAgICBiaXRzWzI1NF0gPSAobGVuZ3RoICYgIDIpID8gMSA6IDA7XG4gICAgICAgIGJpdHNbMjU1XSA9IChsZW5ndGggJiAgMSkgPyAxIDogMDtcbiAgICB9XG5cbiAgICB2YWx1ZVRvQ2hhcih2Om51bWJlcikge1xuICAgICAgICBpZiAodiA9PSAwKSByZXR1cm4gJy4nO1xuICAgICAgICBpZiAodiA9PSAxKSByZXR1cm4gJy0nO1xuICAgICAgICBpZiAodiA8IDYpIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHYgKyB0aGlzLmNvZGVfMCAtIDEpO1xuICAgICAgICBpZiAodiA8IDMyKSByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSh2ICsgdGhpcy5jb2RlX2EgLSA2KTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIFwiRVJST1I6IHZhbHVlIG91dCBvZiByYW5nZSBbMC0zMV1cIiwgdik7XG4gICAgICAgIHJldHVybiAnPyc7ICAgICAgICAgICAgICAgICAgIFxuICAgIH1cblxuICAgIGNoYXJUb1ZhbHVlKGM6c3RyaW5nKSB7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGMubGVuZ3RoID09IDEsIFwiRVJST1I6IGMgTVVTVCBiZSBhIGNoYXJhY3RlciAoc3RyaW5nIHdpdGggbGVuZ3RoID09IDEpLiBHb3RcIiwgdHlwZW9mIGMsIGMpO1xuICAgICAgICBpZiAoYyA9PSBcIi5cIikgcmV0dXJuIDA7XG4gICAgICAgIGlmIChjID09IFwiLVwiKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKHRoaXMuY29kZV8wIDwgYy5jaGFyQ29kZUF0KDApICYmIGMuY2hhckNvZGVBdCgwKSA8PSB0aGlzLmNvZGVfNCkgcmV0dXJuIGMuY2hhckNvZGVBdCgwKSAtIHRoaXMuY29kZV8xICsgMjtcbiAgICAgICAgaWYgKHRoaXMuY29kZV9hIDw9IGMuY2hhckNvZGVBdCgwKSAmJiBjLmNoYXJDb2RlQXQoMCkgPD0gdGhpcy5jb2RlX3opIHJldHVybiBjLmNoYXJDb2RlQXQoMCkgLSB0aGlzLmNvZGVfYSArIDY7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCBcIkVSUk9SOiBjaGFyYWN0ZXIgJ1wiICsgYyArIFwiJyBpcyBub3QgaW4gYWxsb3dlZCBjaGFyYWN0ZXIgc2V0IGZvciBzbHVnaWQgXCIpO1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgZXh0cmFjdENoYXIoYzpudW1iZXIsIGJpdHM6bnVtYmVyW10pIHtcbiAgICAgICAgdmFyIGVuY29kZSA9IDU7XG4gICAgICAgIHZhciBwb3QgPSBNYXRoLnBvdygyLCBlbmNvZGUtMSk7IC8vIDE2XG4gICAgICAgIHZhciB2YWx1ZSA9IDA7XG4gICAgICAgIHZhciBpbmRleCA9IGMgKiBlbmNvZGU7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxlbmNvZGU7IGkrKywgcG90ID0gcG90LzIpIHtcbiAgICAgICAgICAgIHZhbHVlICs9IGJpdHNbaW5kZXggKyBpXSAqIHBvdDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY2hhciA9IHRoaXMudmFsdWVUb0NoYXIodmFsdWUpO1xuICAgICAgICByZXR1cm4gY2hhcjtcbiAgICB9XG5cbiAgICBpbnNlcnRDaGFyKHZhbHVlOm51bWJlciwgajpudW1iZXIsIGJpdHM6bnVtYmVyW10pIHtcbiAgICAgICAgdmFyIGVuY29kZSA9IDU7XG4gICAgICAgIHZhciBpbmRleCA9IGogKiBlbmNvZGU7XG4gICAgICAgIGJpdHNbaW5kZXggKyAwXSA9ICh2YWx1ZSAmIDE2KSA+IDAgPyAxIDogMDtcbiAgICAgICAgYml0c1tpbmRleCArIDFdID0gKHZhbHVlICYgIDgpID4gMCA/IDEgOiAwO1xuICAgICAgICBiaXRzW2luZGV4ICsgMl0gPSAodmFsdWUgJiAgNCkgPiAwID8gMSA6IDA7XG4gICAgICAgIGJpdHNbaW5kZXggKyAzXSA9ICh2YWx1ZSAmICAyKSA+IDAgPyAxIDogMDsgICAgICAgICAgICBcbiAgICAgICAgYml0c1tpbmRleCArIDRdID0gKHZhbHVlICYgIDEpID4gMCA/IDEgOiAwO1xuICAgIH1cblxuICAgIGRlY29kZVNsdWcoc2x1aWc6U2x1Z0lkKSB7XG4gICAgICAgIC8vIGRlY29kZVNsdWcoKSAweDQxYWU5YzA0ZDM0ODczNDgyYTc4MDAwMDAwMDAwMDAwIDB4MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMTBcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJkZWNvZGVTbHVnKClcIiwgbmljay50b3AsIG5pY2subG93KTtcbiAgICAgICAgdmFyIGJpdHM6bnVtYmVyW10gPSBbXTtcbiAgICAgICAgYml0cyA9IHRoaXMuZGVjb2RlVWludDY0KHNsdWlnLnRvcCkuY29uY2F0KHRoaXMuZGVjb2RlVWludDY0KHNsdWlnLmxvdykpO1xuICAgICAgICB2YXIgbGVuZ3RoID0gYml0c1syNTBdICogMzIgKyBiaXRzWzI1MV0gKiAxNiArIGJpdHNbMjUyXSAqIDggKyBiaXRzWzI1M10gKiA0ICsgYml0c1syNTRdICogMiArIGJpdHNbMjU1XSAqIDE7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwibGVuZ3RoOiBcIiwgbGVuZ3RoKTtcbiAgICAgICAgdmFyIHN0cjpzdHJpbmcgPSBcIlwiO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8bGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHN0ciArPSB0aGlzLmV4dHJhY3RDaGFyKGksIGJpdHMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwic3RyOiBcIiwgc3RyKTtcbiAgICAgICAgc2x1aWcuc3RyID0gc3RyO1xuICAgICAgICByZXR1cm4gc2x1aWc7XG4gICAgfVxuXG4gICAgZW5jb2RlU2x1ZyhuYW1lOnN0cmluZyk6U2x1Z0lkIHtcbiAgICAgICAgdmFyIGJpdHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPDI1NjsgaSsrKSB7XG4gICAgICAgICAgICBiaXRzLnB1c2goMCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPG5hbWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuY2hhclRvVmFsdWUobmFtZVtpXSk7XG4gICAgICAgICAgICB0aGlzLmluc2VydENoYXIodmFsdWUsIGksIGJpdHMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5zZXJ0TGVuZ3RoKGJpdHMsIG5hbWUubGVuZ3RoKTtcbiAgICAgICAgdmFyIHNsdWcgPSB0aGlzLmVuY29kZVVuaXQ2NChiaXRzKTtcblxuICAgICAgICBzbHVnID0gdGhpcy5kZWNvZGVTbHVnKHNsdWcpO1xuICAgICAgICBjb25zb2xlLmFzc2VydChzbHVnLnN0ciA9PSBuYW1lLCBcIkVSUk9SOiBzbHVnLnN0cjogXCIsIHNsdWcuc3RyLCBbc2x1Zy5zdHJdLCBbbmFtZV0pO1xuXG4gICAgICAgIHJldHVybiBzbHVnO1xuICAgIH1cblxuICAgIHNsdWdUbzEyOGJpdHMoc2x1ZzpTbHVnSWQpOnN0cmluZyB7XG4gICAgICAgIHZhciBzdHIgPSBcIjB4XCI7XG4gICAgICAgIHZhciB0b3BiaXRzID0gdGhpcy5kZWNvZGVVaW50NjQoc2x1Zy50b3ApO1xuICAgICAgICB2YXIgbG93Yml0cyA9IHRoaXMuZGVjb2RlVWludDY0KHNsdWcubG93KTtcbiAgICAgICAgdmFyIG1peGJpdHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRvcGJpdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG1peGJpdHMucHVzaCh0b3BiaXRzW2ldIF4gbG93Yml0c1tpXSA/IDEgOiAwKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpPTA7IGk8bWl4Yml0cy5sZW5ndGg7IGkrPTQpIHtcbiAgICAgICAgICAgIHN0ciArPSB0aGlzLmVuY29kZU5pYmJsZShpLCBtaXhiaXRzKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIC8vIChlbmQpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLy8gT0xEIGVvc2pzIGVuY29kZU5hbWUgc29sdXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2hhcm1hcCA9ICcuMTIzNDVhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eic7XG4gICAgY2hhcmlkeCA9IGNoID0+IHtcbiAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5jaGFybWFwLmluZGV4T2YoY2gpXG4gICAgICAgIGlmKGlkeCA9PT0gLTEpXG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgSW52YWxpZCBjaGFyYWN0ZXI6ICcke2NofSdgKVxuICAgICAgXG4gICAgICAgIHJldHVybiBpZHg7XG4gICAgfVxuICAgIG9sZEVvc2pzRW5jb2RlTmFtZShuYW1lLCBsaXR0bGVFbmRpYW4gPSBmYWxzZSkge1xuICAgICAgICBpZih0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpXG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbmFtZSBwYXJhbWV0ZXIgaXMgYSByZXF1aXJlZCBzdHJpbmcnKVxuICAgICAgXG4gICAgICAgIGlmKG5hbWUubGVuZ3RoID4gMTIpXG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQSBuYW1lIGNhbiBiZSB1cCB0byAxMiBjaGFyYWN0ZXJzIGxvbmcnKVxuICAgICAgXG4gICAgICAgIGxldCBiaXRzdHIgPSAnJ1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDw9IDEyOyBpKyspIHsgLy8gcHJvY2VzcyBhbGwgNjQgYml0cyAoZXZlbiBpZiBuYW1lIGlzIHNob3J0KVxuICAgICAgICAgIGNvbnN0IGMgPSBpIDwgbmFtZS5sZW5ndGggPyB0aGlzLmNoYXJpZHgobmFtZVtpXSkgOiAwXG4gICAgICAgICAgY29uc3QgYml0bGVuID0gaSA8IDEyID8gNSA6IDRcbiAgICAgICAgICBsZXQgYml0cyA9IE51bWJlcihjKS50b1N0cmluZygyKVxuICAgICAgICAgIGlmKGJpdHMubGVuZ3RoID4gYml0bGVuKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG5hbWUgJyArIG5hbWUpXG4gICAgICAgICAgfVxuICAgICAgICAgIGJpdHMgPSAnMCcucmVwZWF0KGJpdGxlbiAtIGJpdHMubGVuZ3RoKSArIGJpdHNcbiAgICAgICAgICBiaXRzdHIgKz0gYml0c1xuICAgICAgICB9XG4gICAgICBcbiAgICAgICAgY29uc3QgdmFsdWUgPSBMb25nLmZyb21TdHJpbmcoYml0c3RyLCB0cnVlLCAyKVxuICAgICAgXG4gICAgICAgIC8vIGNvbnZlcnQgdG8gTElUVExFX0VORElBTlxuICAgICAgICBsZXQgbGVIZXggPSAnJ1xuICAgICAgICBjb25zdCBieXRlcyA9IGxpdHRsZUVuZGlhbiA/IHZhbHVlLnRvQnl0ZXNMRSgpIDogdmFsdWUudG9CeXRlc0JFKClcbiAgICAgICAgZm9yKGNvbnN0IGIgb2YgYnl0ZXMpIHtcbiAgICAgICAgICBjb25zdCBuID0gTnVtYmVyKGIpLnRvU3RyaW5nKDE2KVxuICAgICAgICAgIGxlSGV4ICs9IChuLmxlbmd0aCA9PT0gMSA/ICcwJyA6ICcnKSArIG5cbiAgICAgICAgfVxuICAgICAgXG4gICAgICAgIGNvbnN0IHVsTmFtZSA9IExvbmcuZnJvbVN0cmluZyhsZUhleCwgdHJ1ZSwgMTYpLnRvU3RyaW5nKClcbiAgICAgIFxuICAgICAgICAvLyBjb25zb2xlLmxvZygnZW5jb2RlTmFtZScsIG5hbWUsIHZhbHVlLnRvU3RyaW5nKCksIHVsTmFtZS50b1N0cmluZygpLCBKU09OLnN0cmluZ2lmeShiaXRzdHIuc3BsaXQoLyguLi4uLikvKS5zbGljZSgxKSkpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdWxOYW1lLnRvU3RyaW5nKClcbiAgICB9XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgZW5jb2RlTmFtZShuYW1lOnN0cmluZyk6QmlnTnVtYmVyIHtcbiAgICAgICAgLypcbiAgICAgICAgY29uc3QgYnVmZmVyOiBTZXJpYWxpemUuU2VyaWFsQnVmZmVyID0gbmV3IFNlcmlhbGl6ZS5TZXJpYWxCdWZmZXIoKTtcbiAgICAgICAgYnVmZmVyLnB1c2hOYW1lKG5hbWUpO1xuICAgICAgICB2YXIgbnVtYmVyID0gYnVmZmVyLmdldFVpbnQ2NEFzTnVtYmVyKCk7XG4gICAgICAgICovXG4gICAgICAgIHZhciBudW1iZXIgPSB0aGlzLm9sZEVvc2pzRW5jb2RlTmFtZShuYW1lKTtcbiAgICAgICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIobnVtYmVyKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG4vLyBpbXBvcnQgeyBFb3Npb1Rva2VuTWF0aFNlcnZpY2UgfSBmcm9tICcuL2Vvc2lvLnRva2VuLW1hdGguc2VydmljZSc7XG5pbXBvcnQgeyBGZWVkYmFjayB9IGZyb20gJ0B2YXBhZWUvZmVlZGJhY2snO1xuXG4vLyBzY2F0dGVyIGxpYnJhcmllc1xuLyovXG4vLyBlb3NqczJcbmltcG9ydCBTY2F0dGVySlMgZnJvbSAnQHNjYXR0ZXJqcy9jb3JlJztcbmltcG9ydCBTY2F0dGVyRU9TIGZyb20gJ0BzY2F0dGVyanMvZW9zanMyJztcbmltcG9ydCBTY2F0dGVyTHlueCBmcm9tICdAc2NhdHRlcmpzL2x5bngnO1xuaW1wb3J0IHtKc29uUnBjLCBBcGl9IGZyb20gJ2Vvc2pzJztcbi8qL1xuaW1wb3J0IFNjYXR0ZXJKUyBmcm9tICdzY2F0dGVyanMtY29yZSc7XG5pbXBvcnQgU2NhdHRlckVPUyBmcm9tICdzY2F0dGVyanMtcGx1Z2luLWVvc2pzJ1xuaW1wb3J0IEVvcyBmcm9tICdlb3Nqcyc7XG5pbXBvcnQgeyBBc3NldCB9IGZyb20gJy4vYXNzZXQuY2xhc3MnO1xuaW1wb3J0IHsgU21hcnRDb250cmFjdCB9IGZyb20gJy4vY29udHJhY3QuY2xhc3MnO1xuaW1wb3J0IHsgU2NhdHRlclV0aWxzIH0gZnJvbSAnLi91dGlscy5jbGFzcyc7XG4vLyovXG5cbi8vIGRlY2xhcmUgdmFyIFNjYXR0ZXJKUzphbnk7XG5cbi8vIGVvc2pzIC8gZW9zanMyXG5leHBvcnQgaW50ZXJmYWNlIFJQQyB7XG4gICAgZW5kcG9pbnQ6IHN0cmluZztcbiAgICBmZXRjaEJ1aWx0aW46IEZ1bmN0aW9uO1xuICAgIGZldGNoOiBGdW5jdGlvbjtcbiAgICBnZXRfYWJpOiBGdW5jdGlvbjtcbiAgICBnZXRfYWNjb3VudDogRnVuY3Rpb247XG4gICAgZ2V0X2Jsb2NrX2hlYWRlcl9zdGF0ZTogRnVuY3Rpb247XG4gICAgZ2V0X2Jsb2NrOiBGdW5jdGlvbjtcbiAgICBnZXRfY29kZTogRnVuY3Rpb247XG4gICAgZ2V0X2N1cnJlbmN5X2JhbGFuY2U6IEZ1bmN0aW9uO1xuICAgIGdldF9jdXJyZW5jeV9zdGF0czogRnVuY3Rpb247XG4gICAgZ2V0X2luZm86IEZ1bmN0aW9uO1xuICAgIGdldF9wcm9kdWNlcl9zY2hlZHVsZTogRnVuY3Rpb247XG4gICAgZ2V0X3Byb2R1Y2VyczogRnVuY3Rpb247XG4gICAgZ2V0X3Jhd19jb2RlX2FuZF9hYmk6IEZ1bmN0aW9uO1xuICAgIGdldFJhd0FiaTogRnVuY3Rpb247XG4gICAgZ2V0X3RhYmxlX3Jvd3M6IEZ1bmN0aW9uO1xuICAgIGdldFJlcXVpcmVkS2V5czogRnVuY3Rpb247XG4gICAgcHVzaF90cmFuc2FjdGlvbjogRnVuY3Rpb247XG4gICAgZGJfc2l6ZV9nZXQ6IEZ1bmN0aW9uO1xuICAgIGhpc3RvcnlfZ2V0X2FjdGlvbnM6IEZ1bmN0aW9uO1xuICAgIGhpc3RvcnlfZ2V0X3RyYW5zYWN0aW9uOiBGdW5jdGlvbjtcbiAgICBoaXN0b3J5X2dldF9rZXlfYWNjb3VudHM6IEZ1bmN0aW9uO1xuICAgIGhpc3RvcnlfZ2V0X2NvbnRyb2xsZWRfYWNjb3VudHM6IEZ1bmN0aW9uOyAgICBcbn1cblxuLypcbi8vIGVvc2pzMlxuZXhwb3J0IGludGVyZmFjZSBFT1Mge1xuICAgIGNvbnRyYWN0czogRnVuY3Rpb247XG4gICAgY2FjaGVkQWJpczogRnVuY3Rpb247XG4gICAgcnBjOiBGdW5jdGlvbjtcbiAgICBhdXRob3JpdHlQcm92aWRlcjogRnVuY3Rpb247XG4gICAgYWJpUHJvdmlkZXI6IEZ1bmN0aW9uO1xuICAgIHNpZ25hdHVyZVByb3ZpZGVyOiBGdW5jdGlvbjtcbiAgICBjaGFpbklkOiBGdW5jdGlvbjtcbiAgICB0ZXh0RW5jb2RlcjogRnVuY3Rpb247XG4gICAgdGV4dERlY29kZXI6IEZ1bmN0aW9uO1xuICAgIGFiaVR5cGVzOiBGdW5jdGlvbjtcbiAgICB0cmFuc2FjdGlvblR5cGVzOiBGdW5jdGlvbjtcbiAgICByYXdBYmlUb0pzb246IEZ1bmN0aW9uO1xuICAgIGdldENhY2hlZEFiaTogRnVuY3Rpb247XG4gICAgZ2V0QWJpOiBGdW5jdGlvbjtcbiAgICBnZXRUcmFuc2FjdGlvbkFiaXM6IEZ1bmN0aW9uO1xuICAgIGdldENvbnRyYWN0OiBGdW5jdGlvbjtcbiAgICBzZXJpYWxpemU6IEZ1bmN0aW9uO1xuICAgIGRlc2VyaWFsaXplOiBGdW5jdGlvbjtcbiAgICBzZXJpYWxpemVUcmFuc2FjdGlvbjogRnVuY3Rpb247XG4gICAgZGVzZXJpYWxpemVUcmFuc2FjdGlvbjogRnVuY3Rpb247XG4gICAgc2VyaWFsaXplQWN0aW9uczogRnVuY3Rpb247XG4gICAgZGVzZXJpYWxpemVBY3Rpb25zOiBGdW5jdGlvbjtcbiAgICBkZXNlcmlhbGl6ZVRyYW5zYWN0aW9uV2l0aEFjdGlvbnM6IEZ1bmN0aW9uO1xuICAgIHRyYW5zYWN0OiBGdW5jdGlvbjtcbiAgICBwdXNoU2lnbmVkVHJhbnNhY3Rpb246IEZ1bmN0aW9uO1xuICAgIGhhc1JlcXVpcmVkVGFwb3NGaWVsZHM6IEZ1bmN0aW9uOyAgICBcbn1cbi8qL1xuLy8gZW9zanNcbmV4cG9ydCBpbnRlcmZhY2UgRU9TIHtcbiAgICBnZXRJbmZvOkZ1bmN0aW9uLFxuICAgIGdldEFjY291bnQ6RnVuY3Rpb24sXG4gICAgZ2V0Q29kZTpGdW5jdGlvbixcbiAgICBnZXRDb2RlSGFzaDpGdW5jdGlvbixcbiAgICBnZXRBYmk6RnVuY3Rpb24sXG4gICAgZ2V0UmF3Q29kZUFuZEFiaTpGdW5jdGlvbixcbiAgICBhYmlKc29uVG9CaW46RnVuY3Rpb24sXG4gICAgYWJpQmluVG9Kc29uOkZ1bmN0aW9uLFxuICAgIGdldFJlcXVpcmVkS2V5czpGdW5jdGlvbixcbiAgICBnZXRCbG9jazpGdW5jdGlvbixcbiAgICBnZXRCbG9ja0hlYWRlclN0YXRlOkZ1bmN0aW9uLFxuICAgIGdldFRhYmxlUm93czpGdW5jdGlvbixcbiAgICBnZXRDdXJyZW5jeUJhbGFuY2U6RnVuY3Rpb24sXG4gICAgZ2V0Q3VycmVuY3lTdGF0czpGdW5jdGlvbixcbiAgICBnZXRQcm9kdWNlcnM6RnVuY3Rpb24sXG4gICAgZ2V0UHJvZHVjZXJTY2hlZHVsZTpGdW5jdGlvbixcbiAgICBnZXRTY2hlZHVsZWRUcmFuc2FjdGlvbnM6RnVuY3Rpb24sXG4gICAgcHVzaEJsb2NrOkZ1bmN0aW9uLFxuICAgIHB1c2hUcmFuc2FjdGlvbjpGdW5jdGlvbixcbiAgICBwdXNoVHJhbnNhY3Rpb25zOkZ1bmN0aW9uLFxuICAgIGdldEFjdGlvbnM6RnVuY3Rpb24sXG4gICAgZ2V0VHJhbnNhY3Rpb246RnVuY3Rpb24sXG4gICAgZ2V0S2V5QWNjb3VudHM6RnVuY3Rpb24sXG4gICAgZ2V0Q29udHJvbGxlZEFjY291bnRzOkZ1bmN0aW9uLFxuICAgIGNyZWF0ZVRyYW5zYWN0aW9uOkZ1bmN0aW9uLFxuICAgIHRyYW5zYWN0aW9uOkZ1bmN0aW9uLFxuICAgIG5vbmNlOkZ1bmN0aW9uLFxuICAgIHRyYW5zZmVyOkZ1bmN0aW9uLFxuICAgIGNyZWF0ZTpGdW5jdGlvbixcbiAgICBpc3N1ZTpGdW5jdGlvbixcbiAgICBiaWRuYW1lOkZ1bmN0aW9uLFxuICAgIG5ld2FjY291bnQ6RnVuY3Rpb24sXG4gICAgc2V0Y29kZTpGdW5jdGlvbixcbiAgICBzZXRhYmk6RnVuY3Rpb24sXG4gICAgdXBkYXRlYXV0aDpGdW5jdGlvbixcbiAgICBkZWxldGVhdXRoOkZ1bmN0aW9uLFxuICAgIGxpbmthdXRoOkZ1bmN0aW9uLFxuICAgIHVubGlua2F1dGg6RnVuY3Rpb24sXG4gICAgY2FuY2VsZGVsYXk6RnVuY3Rpb24sXG4gICAgb25lcnJvcjpGdW5jdGlvbixcbiAgICBidXlyYW1ieXRlczpGdW5jdGlvbixcbiAgICBzZWxscmFtOkZ1bmN0aW9uLFxuICAgIGJ1eXJhbTpGdW5jdGlvbixcbiAgICBkZWxlZ2F0ZWJ3OkZ1bmN0aW9uLFxuICAgIHVuZGVsZWdhdGVidzpGdW5jdGlvbixcbiAgICByZWZ1bmQ6RnVuY3Rpb24sXG4gICAgcmVncHJvZHVjZXI6RnVuY3Rpb24sXG4gICAgdW5yZWdwcm9kOkZ1bmN0aW9uLFxuICAgIHNldHJhbTpGdW5jdGlvbixcbiAgICByZWdwcm94eTpGdW5jdGlvbixcbiAgICB2b3RlcHJvZHVjZXI6RnVuY3Rpb24sXG4gICAgY2xhaW1yZXdhcmRzOkZ1bmN0aW9uLFxuICAgIHNldHByaXY6RnVuY3Rpb24sXG4gICAgcm12cHJvZHVjZXI6RnVuY3Rpb24sXG4gICAgc2V0YWxpbWl0czpGdW5jdGlvbixcbiAgICBzZXRnbGltaXRzOkZ1bmN0aW9uLFxuICAgIHNldHByb2RzOkZ1bmN0aW9uLFxuICAgIHJlcWF1dGg6RnVuY3Rpb24sXG4gICAgc2V0cGFyYW1zOkZ1bmN0aW9uLFxuICAgIGNvbnRyYWN0OkZ1bmN0aW9uXG59XG4vLyovXG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NhdHRlciB7XG4gICAgaWRlbnRpdHk6IGFueSxcbiAgICBlb3NIb29rOiBGdW5jdGlvbjtcbiAgICBlb3M/OkZ1bmN0aW9uLFxuICAgIG5ldHdvcms6IGFueTtcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuICAgIFxuICAgIGZvcmdvdHRlbj86Ym9vbGVhbiwgLy8gd2FzIGZvcmdldElkZW50aXR5IGV4ZWN1dGVkP1xuICAgIFxuICAgIGlzRXh0ZW5zaW9uOiBib29sZWFuLFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYXV0aGVudGljYXRlOiBGdW5jdGlvbixcbiAgICBjb25uZWN0OiBGdW5jdGlvbixcbiAgICBjb25zdHJ1Y3RvcjogRnVuY3Rpb24sXG4gICAgY3JlYXRlVHJhbnNhY3Rpb246IEZ1bmN0aW9uLFxuICAgIGRpc2Nvbm5lY3Q6IEZ1bmN0aW9uLFxuICAgIGZvcmdldElkZW50aXR5OiBGdW5jdGlvbixcbiAgICBnZXRBcmJpdHJhcnlTaWduYXR1cmU6IEZ1bmN0aW9uLFxuICAgIGdldElkZW50aXR5OiBGdW5jdGlvbixcbiAgICBnZXRJZGVudGl0eUZyb21QZXJtaXNzaW9uczogRnVuY3Rpb24sXG4gICAgZ2V0UHVibGljS2V5OiBGdW5jdGlvbixcbiAgICBnZXRWZXJzaW9uOiBGdW5jdGlvbixcbiAgICBoYXNBY2NvdW50Rm9yOiBGdW5jdGlvbixcbiAgICBpc0Nvbm5lY3RlZDogRnVuY3Rpb24sXG4gICAgaXNQYWlyZWQ6IEZ1bmN0aW9uLFxuICAgIGxpbmtBY2NvdW50OiBGdW5jdGlvbixcbiAgICBsb2FkUGx1Z2luOiBGdW5jdGlvbixcbiAgICByZXF1ZXN0U2lnbmF0dXJlOiBGdW5jdGlvbixcbiAgICByZXF1ZXN0VHJhbnNmZXI6IEZ1bmN0aW9uLFxuICAgIHN1Z2dlc3ROZXR3b3JrOiBGdW5jdGlvblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFjY291bnREYXRhIHtcbiAgICBhY2NvdW50X25hbWU/OiBzdHJpbmcsXG4gICAgaGVhZF9ibG9ja19udW0/OiBudW1iZXIsXG4gICAgaGVhZF9ibG9ja190aW1lPzogc3RyaW5nLFxuICAgIHByaXZpbGVnZWQ/OiBmYWxzZSxcbiAgICBsYXN0X2NvZGVfdXBkYXRlPzogc3RyaW5nLFxuICAgIGNyZWF0ZWQ/OiBzdHJpbmcsXG4gICAgY29yZV9saXF1aWRfYmFsYW5jZT86IHN0cmluZyxcbiAgICBjb3JlX2xpcXVpZF9iYWxhbmNlX2Fzc2V0PzogQXNzZXQsXG4gICAgcmFtX3F1b3RhPzogbnVtYmVyLFxuICAgIG5ldF93ZWlnaHQ/OiBudW1iZXIsXG4gICAgY3B1X3dlaWdodD86IG51bWJlcixcbiAgICB0b3RhbF9iYWxhbmNlOiBzdHJpbmcsXG4gICAgdG90YWxfYmFsYW5jZV9hc3NldDogQXNzZXQsXG4gICAgcmFtX2xpbWl0Pzoge1xuICAgICAgICBwZXJjZW50U3RyPzogc3RyaW5nLFxuICAgICAgICB1c2VkPzogbnVtYmVyLFxuICAgICAgICBhdmFpbGFibGU/OiBudW1iZXIsXG4gICAgICAgIG1heD86IG51bWJlclxuICAgIH0sXG4gICAgbmV0X2xpbWl0Pzoge1xuICAgICAgICBwZXJjZW50U3RyPzogc3RyaW5nLFxuICAgICAgICB1c2VkPzogbnVtYmVyLFxuICAgICAgICBhdmFpbGFibGU/OiBudW1iZXIsXG4gICAgICAgIG1heD86IG51bWJlclxuICAgIH0sXG4gICAgY3B1X2xpbWl0Pzoge1xuICAgICAgICBwZXJjZW50U3RyPzogc3RyaW5nLFxuICAgICAgICB1c2VkPzogbnVtYmVyLFxuICAgICAgICBhdmFpbGFibGU/OiBudW1iZXIsXG4gICAgICAgIG1heD86IG51bWJlclxuICAgIH0sXG4gICAgcmFtX3VzYWdlPzogbnVtYmVyLFxuICAgIHBlcm1pc3Npb25zPzoge1xuICAgICAgICBwZXJtX25hbWU/OiBzdHJpbmcsXG4gICAgICAgIHBhcmVudD86IHN0cmluZyxcbiAgICAgICAgcmVxdWlyZWRfYXV0aD86IHtcbiAgICAgICAgICAgIHRocmVzaG9sZD86IDEsXG4gICAgICAgICAgICBrZXlzPzoge1xuICAgICAgICAgICAgICAgIGtleT86IHN0cmluZyxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ/OiAxXG4gICAgICAgICAgICB9W10sXG4gICAgICAgICAgICBhY2NvdW50cz86IGFueVtdLFxuICAgICAgICAgICAgd2FpdHM/OiBhbnlbXVxuICAgICAgICB9XG4gICAgfVtdLFxuICAgIHRvdGFsX3Jlc291cmNlcz86IHtcbiAgICAgICAgb3duZXI/OiBzdHJpbmcsXG4gICAgICAgIG5ldF93ZWlnaHQ/OiBzdHJpbmcsXG4gICAgICAgIG5ldF93ZWlnaHRfYXNzZXQ/OiBBc3NldCxcbiAgICAgICAgY3B1X3dlaWdodD86IHN0cmluZyxcbiAgICAgICAgY3B1X3dlaWdodF9hc3NldD86IEFzc2V0LFxuICAgICAgICByYW1fYnl0ZXM/OiBudW1iZXJcbiAgICB9LFxuICAgIHNlbGZfZGVsZWdhdGVkX2JhbmR3aWR0aD86IHtcbiAgICAgICAgZnJvbT86IHN0cmluZyxcbiAgICAgICAgdG8/OiBzdHJpbmcsXG4gICAgICAgIHRvdGFsPzogc3RyaW5nLFxuICAgICAgICB0b3RhbF9hc3NldD86IEFzc2V0LFxuICAgICAgICBuZXRfd2VpZ2h0Pzogc3RyaW5nLFxuICAgICAgICBuZXRfd2VpZ2h0X2Fzc2V0PzogQXNzZXQsXG4gICAgICAgIGNwdV93ZWlnaHQ/OiBzdHJpbmcsXG4gICAgICAgIGNwdV93ZWlnaHRfYXNzZXQ/OiBBc3NldCxcbiAgICB9LFxuICAgIHJlZnVuZF9yZXF1ZXN0Pzoge1xuICAgICAgICBvd25lcj86IHN0cmluZyxcbiAgICAgICAgcmVxdWVzdF90aW1lPzogc3RyaW5nLFxuICAgICAgICB0b3RhbD86IHN0cmluZyxcbiAgICAgICAgdG90YWxfYXNzZXQ/OiBBc3NldCxcbiAgICAgICAgbmV0X2Ftb3VudD86IHN0cmluZyxcbiAgICAgICAgbmV0X2Ftb3VudF9hc3NldD86IEFzc2V0LFxuICAgICAgICBjcHVfYW1vdW50Pzogc3RyaW5nLFxuICAgICAgICBjcHVfYW1vdW50X2Fzc2V0PzogQXNzZXRcbiAgICB9LFxuICAgIHZvdGVyX2luZm8/OiB7XG4gICAgICAgIG93bmVyPzogc3RyaW5nLFxuICAgICAgICBwcm94eT86IHN0cmluZyxcbiAgICAgICAgcHJvZHVjZXJzPzogc3RyaW5nW10sXG4gICAgICAgIHN0YWtlZD86IG51bWJlcixcbiAgICAgICAgbGFzdF92b3RlX3dlaWdodD86IHN0cmluZyxcbiAgICAgICAgcHJveGllZF92b3RlX3dlaWdodD86IHN0cmluZyxcbiAgICAgICAgaXNfcHJveHk/OiBudW1iZXJcbiAgICB9LFxuICAgIHJldHVybmVkRmllbGRzPzogbnVsbFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFjY291bnQge1xuICAgIGF1dGhvcml0eT86IHN0cmluZyxcbiAgICBibG9ja2NoYWluPzogc3RyaW5nLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBwdWJsaWNLZXk/OiBzdHJpbmcsXG4gICAgZGF0YT86IEFjY291bnREYXRhXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW5kcG9pbnQge1xuICAgIHByb3RvY29sOnN0cmluZyxcbiAgICBob3N0OnN0cmluZyxcbiAgICBwb3J0Om51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEVvc2NvbmYge1xuICAgIGJsb2NrY2hhaW46c3RyaW5nLFxuICAgIHByb3RvY29sOnN0cmluZyxcbiAgICBob3N0OnN0cmluZyxcbiAgICBwb3J0Om51bWJlcixcbiAgICBjaGFpbklkOnN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5ldHdvcmsge1xuICAgIHNsdWc/OiBzdHJpbmcsXG4gICAgaW5kZXg/OiBudW1iZXIsXG4gICAgZW9zY29uZj86IEVvc2NvbmYsXG4gICAgZXhwbG9yZXI/OiBzdHJpbmcsXG4gICAgc3ltYm9sOiBzdHJpbmcsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGNoYWluSWQ6c3RyaW5nLFxuICAgIGVuZHBvaW50czogRW5kcG9pbnRbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5ldHdvcmtNYXAge1xuICAgIFtrZXk6c3RyaW5nXTpOZXR3b3JrXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFNjYXR0ZXJKU0RlZiB7XG4gICAgcGx1Z2lucz86YW55LFxuICAgIHNjYXR0ZXI/OmFueVxufVxuXG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiBcInJvb3RcIlxufSlcbmV4cG9ydCBjbGFzcyBWYXBhZWVTY2F0dGVyIHtcbiAgICBcbiAgICBwcml2YXRlIHNjYXR0ZXJ1dGlscyA9IG5ldyBTY2F0dGVyVXRpbHMoKTtcbiAgICBwdWJsaWMgZXJyb3I6IHN0cmluZztcbiAgICBwcml2YXRlIGFwcFRpdGxlOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBzeW1ib2w6IHN0cmluZztcbiAgICBwcml2YXRlIF9jb25uZWN0ZWQ6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBsaWI6IFNjYXR0ZXI7XG4gICAgcHJpdmF0ZSBycGM6IFJQQzsgLy8gZW9zanMyXG4gICAgcHVibGljIGZlZWQ6IEZlZWRiYWNrO1xuICAgIHByaXZhdGUgU2NhdHRlckpTOiBTY2F0dGVySlNEZWY7XG4gICAgcHJpdmF0ZSBfbmV0d29yazogTmV0d29yaztcbiAgICBwcml2YXRlIF9uZXR3b3JrczogTmV0d29ya01hcDtcbiAgICBwcml2YXRlIF9uZXR3b3Jrc19zbHVnczogc3RyaW5nW107XG4gICAgcHJpdmF0ZSBfYWNjb3VudF9xdWVyaWVzOiB7W2tleTpzdHJpbmddOlByb21pc2U8QWNjb3VudERhdGE+fTtcbiAgICBwcml2YXRlIGVvczogRU9TO1xuICAgIHB1YmxpYyBvbk5ldHdvcmtDaGFuZ2U6U3ViamVjdDxOZXR3b3JrPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIG9uTG9nZ2dlZFN0YXRlQ2hhbmdlOlN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBfYWNjb3VudDogQWNjb3VudDtcbiAgICBwcml2YXRlIHNldFJlYWR5OiBGdW5jdGlvbjtcbiAgICBwdWJsaWMgd2FpdFJlYWR5OiBQcm9taXNlPGFueT4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0aGlzLnNldFJlYWR5ID0gcmVzb2x2ZTtcbiAgICB9KTtcbiAgICBwcml2YXRlIHNldExvZ2dlZDogRnVuY3Rpb247XG4gICAgcHVibGljIHdhaXRMb2dnZWQ6IFByb21pc2U8YW55PiA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0TG9nZ2VkID0gcmVzb2x2ZTtcbiAgICB9KTtcbiAgICBwcml2YXRlIHNldENvbm5lY3RlZDogRnVuY3Rpb247XG4gICAgcHVibGljIHdhaXRDb25uZWN0ZWQ6IFByb21pc2U8YW55PiA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0Q29ubmVjdGVkID0gcmVzb2x2ZTtcbiAgICB9KTtcbiAgICBwcml2YXRlIHNldEVvc2pzOiBGdW5jdGlvbjtcbiAgICBwdWJsaWMgd2FpdEVvc2pzOiBQcm9taXNlPGFueT4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0aGlzLnNldEVvc2pzID0gcmVzb2x2ZTtcbiAgICB9KTtcbiAgICBwcml2YXRlIHNldEVuZHBvaW50c1JlYWR5OiBGdW5jdGlvbjtcbiAgICBwdWJsaWMgd2FpdEVuZHBvaW50czogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRFbmRwb2ludHNSZWFkeSA9IHJlc29sdmU7XG4gICAgfSk7ICAgIFxuICAgIFxuICAgIGNvbnN0cnVjdG9yKFxuICAgICkge1xuICAgICAgICB0aGlzLmZlZWQgPSBuZXcgRmVlZGJhY2soKTtcbiAgICAgICAgdGhpcy5fbmV0d29ya3Nfc2x1Z3MgPSBbXTtcbiAgICAgICAgdGhpcy5fbmV0d29ya3MgPSB7fTtcbiAgICAgICAgdGhpcy5fbmV0d29yayA9IHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIkVPUyBNYWluTmV0XCIsXG4gICAgICAgICAgICBcInN5bWJvbFwiOiBcIkVPU1wiLFxuICAgICAgICAgICAgXCJleHBsb3JlclwiOiBcImh0dHBzOi8vd3d3LmJsb2tzLmlvXCIsXG4gICAgICAgICAgICBcImNoYWluSWRcIjpcImFjYTM3NmYyMDZiOGZjMjVhNmVkNDRkYmRjNjY1NDdjMzZjNmMzM2UzYTExOWZmYmVhZWY5NDM2NDJmMGU5MDZcIixcbiAgICAgICAgICAgIFwiZW5kcG9pbnRzXCI6IFt7XG4gICAgICAgICAgICAgICAgXCJwcm90b2NvbFwiOlwiaHR0cHNcIixcbiAgICAgICAgICAgICAgICBcImhvc3RcIjpcIm5vZGVzLmdldC1zY2F0dGVyLmNvbVwiLFxuICAgICAgICAgICAgICAgIFwicG9ydFwiOjQ0M1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc3ltYm9sID0gXCJFT1NcIjtcbiAgICAgICAgLy8gdGhpcy53YWl0UmVhZHkudGhlbigoKSA9PiBjb25zb2xlLmxvZyhcIlNjYXR0ZXJTZXJ2aWNlLnNldFJlYWR5KClcIikpO1xuICAgICAgICAvLyBjb25zb2xlLmVycm9yKFwic2NhdHRlciBpbnRlcnJ1bXBpZG8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9hY2NvdW50X3F1ZXJpZXMgPSB7fTtcbiAgICB9XG5cbiAgICBnZXQgdXRpbHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjYXR0ZXJ1dGlscztcbiAgICB9XG5cbiAgICAvLyBBY291bnQsIElkZW50aXR5IGFuZCBhdXRoZW50aWNhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBhY2NvdW50KCk6IEFjY291bnQge1xuICAgICAgICBpZiAoIXRoaXMuX2FjY291bnQgfHwgIXRoaXMuX2FjY291bnQubmFtZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubGliICYmIHRoaXMubGliLmlkZW50aXR5ICYmIHRoaXMubGliLmlkZW50aXR5LmFjY291bnRzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYWNjb3VudCA9IHRoaXMubGliLmlkZW50aXR5LmFjY291bnRzLmZpbmQoeCA9PiB4LmJsb2NrY2hhaW4gPT09IFwiZW9zXCIgfHwgeC5ibG9ja2NoYWluID09PSBcInRsb3NcIik7XG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpcy5fYWNjb3VudDtcbiAgICB9XG5cbiAgICBnZXQgZGVmYXVsdCgpOiBBY2NvdW50IHtcbiAgICAgICAgLy8gZGVmYXVsdCBkYXRhIGJlZm9yZSBsb2FkaW5nIGRhdGFcbiAgICAgICAgLy8gVE9ETzogZmlsbCBvdXQgd2l0aCBiZXR0ZXIgZGVmYXVsdCBkYXRhLlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTonZ3Vlc3QnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHRvdGFsX2JhbGFuY2U6IFwiXCIsXG4gICAgICAgICAgICAgICAgdG90YWxfYmFsYW5jZV9hc3NldDogbmV3IEFzc2V0KCksXG4gICAgICAgICAgICAgICAgY3B1X2xpbWl0OiB7fSxcbiAgICAgICAgICAgICAgICBuZXRfbGltaXQ6IHt9LFxuICAgICAgICAgICAgICAgIHJhbV9saW1pdDoge30sXG4gICAgICAgICAgICAgICAgcmVmdW5kX3JlcXVlc3Q6IHt9LFxuICAgICAgICAgICAgICAgIHRvdGFsX3Jlc291cmNlczoge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0SWRlbnRpdHkoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2NhdHRlclNlcnZpY2UucmVzZXRJZGVudGl0eSgpXCIpO1xuICAgICAgICB0aGlzLmVycm9yID0gXCJcIjtcbiAgICAgICAgaWYgKHRoaXMubGliKSB7XG4gICAgICAgICAgICB0aGlzLmxpYi5pZGVudGl0eSA9IG51bGw7XG4gICAgICAgICAgICBpZiAoIXRoaXMubGliLmZvcmdvdHRlbikge1xuICAgICAgICAgICAgICAgIHRoaXMubGliLmZvcmdvdHRlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5saWIuZm9yZ2V0SWRlbnRpdHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uTG9nZ2dlZFN0YXRlQ2hhbmdlLm5leHQodHJ1ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRJZGVudGl0eShpZGVudGl0eTphbnkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTY2F0dGVyU2VydmljZS5zZXRJZGVudGl0eSgpXCIsIFtpZGVudGl0eV0pO1xuICAgICAgICBjb25zb2xlLmFzc2VydCghIXRoaXMubGliLCBcIkVSUk9SOiBubyBpbnN0YW5jZSBvZiBzY2F0dGVyIGZvdW5kXCIpO1xuICAgICAgICB0aGlzLmVycm9yID0gXCJcIjtcbiAgICAgICAgdGhpcy5saWIuaWRlbnRpdHkgPSBpZGVudGl0eTtcbiAgICAgICAgdGhpcy5saWIuZm9yZ290dGVuID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2FjY291bnQgPSB0aGlzLmxpYi5pZGVudGl0eS5hY2NvdW50cy5maW5kKHggPT4geC5ibG9ja2NoYWluID09PSBcImVvc1wiIHx8IHguYmxvY2tjaGFpbiA9PT0gXCJ0bG9zXCIpO1xuICAgICAgICBpZiAoIXRoaXMuYWNjb3VudCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlNjYXR0ZXJTZXJ2aWNlLnNldElkZW50aXR5KClcIiwgW2lkZW50aXR5XSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJTY2F0dGVyU2VydmljZS5zZXRJZGVudGl0eSgpIC0+IFNjYXR0ZXJTZXJ2aWNlLnF1ZXJ5QWNjb3VudERhdGEoKSA6IFwiICwgW3RoaXMuYWNjb3VudC5uYW1lXSk7XG4gICAgICAgIHRoaXMucXVlcnlBY2NvdW50RGF0YSh0aGlzLmFjY291bnQubmFtZSkudGhlbihhY2NvdW50ID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWNjb3VudC5kYXRhID0gYWNjb3VudDtcbiAgICAgICAgICAgIHRoaXMub25Mb2dnZ2VkU3RhdGVDaGFuZ2UubmV4dCh0cnVlKTtcbiAgICAgICAgfSkuY2F0Y2goXyA9PiB7XG4gICAgICAgICAgICB0aGlzLmFjY291bnQuZGF0YSA9IHRoaXMuZGVmYXVsdC5kYXRhO1xuICAgICAgICAgICAgdGhpcy5vbkxvZ2dnZWRTdGF0ZUNoYW5nZS5uZXh0KHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9ICAgIFxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIE5ldHdvcmtzIChlb3NpbyBibG9ja2NoYWlucykgJiBFbmRwb2ludHMgLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBwdWJsaWMgc2V0RW5kcG9pbnRzKGVuZHBvaW50czogTmV0d29ya01hcCkge1xuICAgICAgICB0aGlzLl9uZXR3b3JrcyA9IGVuZHBvaW50cyB8fCB0aGlzLl9uZXR3b3JrcztcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLl9uZXR3b3Jrcykge1xuICAgICAgICAgICAgdGhpcy5fbmV0d29ya3Nfc2x1Z3MucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEVuZHBvaW50c1JlYWR5KCk7XG4gICAgfVxuXG4gICAgc2V0TmV0d29yayhuYW1lOnN0cmluZywgaW5kZXg6IG51bWJlciA9IDApIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTY2F0dGVyU2VydmljZS5zZXROZXR3b3JrKFwiK25hbWUrXCIsXCIraW5kZXgrXCIpXCIpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWl0RW5kcG9pbnRzLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdmFyIG4gPSB0aGlzLmdldE5ldHdvcmsobmFtZSwgaW5kZXgpO1xuICAgICAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbmV0d29yay5uYW1lICE9IG4ubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9uZXR3b3JrID0gbjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldElkZW50aXR5KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdFNjYXR0ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk5ldHdvcmtDaGFuZ2UubmV4dCh0aGlzLmdldE5ldHdvcmsobmFtZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVSUk9SOiBTY2F0dGVyLnNldE5ldHdvcmsoKSB1bmtub3duIG5ldHdvcmsgbmFtZS1pbmRleC4gR290IChcIlxuICAgICAgICAgICAgICAgICAgICArIG5hbWUgKyBcIiwgXCIgKyBpbmRleCArIFwiKS4gQXZhaWxhYmxlcyBhcmU6XCIsIHRoaXMuX25ldHdvcmtzKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFsbGluZyBiYWNrIHRvIGVvcyBtYWlubmV0XCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNldE5ldHdvcmsoXCJlb3NcIik7XG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXROZXR3b3JrKHNsdWc6c3RyaW5nLCBpbmRleDogbnVtYmVyID0gMCk6IE5ldHdvcmsge1xuICAgICAgICBpZiAodGhpcy5fbmV0d29ya3Nbc2x1Z10pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9uZXR3b3Jrc1tzbHVnXS5lbmRwb2ludHMubGVuZ3RoID4gaW5kZXggJiYgaW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgIHZhciBuZXR3b3JrOiBOZXR3b3JrID0gdGhpcy5fbmV0d29ya3Nbc2x1Z107XG4gICAgICAgICAgICAgICAgdmFyIGVuZHBvaW50OkVuZHBvaW50ID0gbmV0d29yay5lbmRwb2ludHNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIG5ldHdvcmsuc2x1ZyA9IHNsdWc7XG4gICAgICAgICAgICAgICAgbmV0d29yay5pbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIG5ldHdvcmsuZW9zY29uZiA9IHtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tjaGFpbjogXCJlb3NcIixcbiAgICAgICAgICAgICAgICAgICAgY2hhaW5JZDogbmV0d29yay5jaGFpbklkLFxuICAgICAgICAgICAgICAgICAgICBob3N0OiBlbmRwb2ludC5ob3N0LFxuICAgICAgICAgICAgICAgICAgICBwb3J0OiBlbmRwb2ludC5wb3J0LFxuICAgICAgICAgICAgICAgICAgICBwcm90b2NvbDogZW5kcG9pbnQucHJvdG9jb2wsXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV0d29yaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVSUk9SOiBTY2F0dGVyLmdldE5ldHdvcmsoKSBpbmRleCBvdXQgb2YgcmFuZ2UuIEdvdCBcIlxuICAgICAgICAgICAgICAgICAgICArIGluZGV4ICsgXCIgZXhwZWN0ZWQgbnVtYmVyIGJldHdlZW4gWzAuLlwiK3RoaXMuX25ldHdvcmtzW3NsdWddLmVuZHBvaW50cy5sZW5ndGgrXCJdXCIsICk7XG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRVJST1I6IFNjYXR0ZXIuZ2V0TmV0d29yaygpIHVua25vd24gbmV0d29yayBzbHVnLiBHb3QgXCJcbiAgICAgICAgICAgICAgICArIHNsdWcgKyBcIiBleHBlY3RlZCBvbmUgb2ZcIiwgdGhpcy5uZXR3b3Jrcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IG5ldHdvcmtzKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9uZXR3b3Jrc19zbHVncztcbiAgICB9XG5cbiAgICBnZXQgbmV0d29yaygpOiBOZXR3b3JrIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25ldHdvcms7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNldFByb21pc2VzKCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiU2NhdHRlclNlcnZpY2UucmVzZXRQcm9taXNlcygpXCIpO1xuICAgICAgICB0aGlzLndhaXRFb3Nqcy50aGVuKHIgPT4ge1xuICAgICAgICAgICAgdGhpcy53YWl0RW9zanMgPSBudWxsO1xuICAgICAgICAgICAgdmFyIHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLndhaXRFb3NqcykgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHRoaXMud2FpdEVvc2pzID0gcDtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVvc2pzID0gcmVzb2x2ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0UHJvbWlzZXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy53YWl0Q29ubmVjdGVkLnRoZW4ociA9PiB7XG4gICAgICAgICAgICB0aGlzLndhaXRDb25uZWN0ZWQgPSBudWxsO1xuICAgICAgICAgICAgdmFyIHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLndhaXRDb25uZWN0ZWQpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLndhaXRDb25uZWN0ZWQgPSBwO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q29ubmVjdGVkID0gcmVzb2x2ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0UHJvbWlzZXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy53YWl0UmVhZHkudGhlbihyID0+IHtcbiAgICAgICAgICAgIHRoaXMud2FpdFJlYWR5ID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBwID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53YWl0UmVhZHkpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLndhaXRSZWFkeSA9IHA7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRSZWFkeSA9IHJlc29sdmU7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldFByb21pc2VzKCk7XG4gICAgICAgICAgICAgICAgLy90aGlzLndhaXRSZWFkeS50aGVuKCgpID0+IGNvbnNvbGUubG9nKFwiU2NhdHRlclNlcnZpY2Uuc2V0UmVhZHkoKVwiKSk7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLndhaXRMb2dnZWQudGhlbihyID0+IHtcbiAgICAgICAgICAgIHRoaXMud2FpdExvZ2dlZCA9IG51bGw7XG4gICAgICAgICAgICB2YXIgcCA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMud2FpdExvZ2dlZCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHRoaXMud2FpdExvZ2dlZCA9IHA7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRMb2dnZWQgPSByZXNvbHZlO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRQcm9taXNlcygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTY2F0dGVyIGluaXRpYWxpemF0aW9uIGFuZCBBcHBDb25uZWN0aW9uIC0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdFNjYXR0ZXIoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2NhdHRlclNlcnZpY2UuaW5pdFNjYXR0ZXIoKVwiKTtcbiAgICAgICAgLyovXG4gICAgICAgIC8vIGVvc2pzMlxuICAgICAgICB0aGlzLmVycm9yID0gXCJcIjtcbiAgICAgICAgaWYgKCg8YW55PndpbmRvdykuU2NhdHRlckpTKSB7XG4gICAgICAgICAgICB0aGlzLlNjYXR0ZXJKUyA9ICg8YW55PndpbmRvdykuU2NhdHRlckpTO1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5TY2F0dGVySlMgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFNjYXR0ZXJKUy5wbHVnaW5zKCBuZXcgU2NhdHRlckVPUygpICk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjpcIiwgZS5tZXNzYWdlLCBbZV0pO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhbGxpbmcgYmFjayB0byBub3JtYWwgU2NhdHRlckVPUyBwbHVnaW5cIik7XG4gICAgICAgICAgICBTY2F0dGVySlMucGx1Z2lucyggbmV3IFNjYXR0ZXJFT1MoKSApO1xuICAgICAgICB9XG4gICAgICAgICBcbiAgICAgICAgdGhpcy5saWIgPSBTY2F0dGVySlMuc2NhdHRlcjtcblxuICAgICAgICBjb25zdCBuZXR3b3JrID0gU2NhdHRlckpTLk5ldHdvcmsuZnJvbUpzb24odGhpcy5uZXR3b3JrLmVvc2NvbmYpO1xuICAgICAgICB0aGlzLnJwYyA9IG5ldyBKc29uUnBjKG5ldHdvcmsuZnVsbGhvc3QoKSk7XG4gICAgICAgIHRoaXMuZW9zID0gdGhpcy5saWIuZW9zKG5ldHdvcmssIEFwaSwge3JwYzp0aGlzLnJwY30pO1xuXG4gICAgICAgIHRoaXMuc2V0RW9zanMoXCJlb3Nqc1wiKTtcbiAgICAgICAgLyovXG4gICAgICAgIC8vIGVvc2pzXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2NhdHRlclNlcnZpY2UuaW5pdFNjYXR0ZXIoKVwiKTtcbiAgICAgICAgdGhpcy5lcnJvciA9IFwiXCI7XG4gICAgICAgIGlmICgoPGFueT53aW5kb3cpLlNjYXR0ZXJKUykge1xuICAgICAgICAgICAgdGhpcy5TY2F0dGVySlMgPSAoPGFueT53aW5kb3cpLlNjYXR0ZXJKUztcbiAgICAgICAgICAgIHRoaXMuU2NhdHRlckpTLnBsdWdpbnMoIG5ldyBTY2F0dGVyRU9TKCkgKTtcbiAgICAgICAgICAgIHRoaXMubGliID0gdGhpcy5TY2F0dGVySlMuc2NhdHRlcjsgIFxuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5TY2F0dGVySlMgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRU9TSlMoKVwiLFt0aGlzLm5ldHdvcmsuZW9zY29uZl0pO1xuICAgICAgICB0aGlzLmVvcyA9IHRoaXMubGliLmVvcyh0aGlzLm5ldHdvcmsuZW9zY29uZiwgRW9zLCB7IGV4cGlyZUluU2Vjb25kczo2MCB9KTtcbiAgICAgICAgdGhpcy5zZXRFb3NqcyhcImVvc2pzXCIpO1xuICAgICAgICAvLyovXG4gICAgfVxuXG4gICAgcmVjb25uZWN0VGltZXI7XG4gICAgcmVjb25uZWN0VGltZSA9IDEwMDtcbiAgICByZXRyeUNvbm5lY3RpbmdBcHAoKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5yZWNvbm5lY3RUaW1lcik7XG4gICAgICAgIHRoaXMucmVjb25uZWN0VGltZXIgPSBzZXRJbnRlcnZhbChfID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2NhdHRlclNlcnZpY2UucmVjb25uZWN0VGltZXIoKVwiKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jb25uZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKFwiU2NhdHRlclNlcnZpY2UucmV0cnlDb25uZWN0aW5nQXBwKCkgbGltcGlvIGVsIGludGVydmFsb1wiKTtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMucmVjb25uZWN0VGltZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hY2NvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJTY2F0dGVyU2VydmljZS5yZXRyeUNvbm5lY3RpbmdBcHAoKSAgZXhpc3RlIGFjY291bnQgcGVybyBubyBlc3TDg8KhIGNvbmVjdGFkb1wiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0QXBwKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LHRoaXMucmVjb25uZWN0VGltZSk7XG4gICAgICAgIHRoaXMucmVjb25uZWN0VGltZSArPSAxMDAwKk1hdGgucmFuZG9tKCk7XG4gICAgICAgIGlmICh0aGlzLnJlY29ubmVjdFRpbWUgPiA0MDAwKSB0aGlzLnJlY29ubmVjdFRpbWUgPSA0MDAwO1xuICAgIH1cblxuICAgIGNvbm5lY3RBcHAoYXBwVGl0bGU6c3RyaW5nID0gXCJcIikge1xuICAgICAgICAvLyB0aGlzLmNvbm5lY3RfY291bnQrKztcbiAgICAgICAgLy8gdmFyIHJlc29sdmVfbnVtID0gdGhpcy5jb25uZWN0X2NvdW50O1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImNvbm5lY3RcIiwgdHJ1ZSk7XG4gICAgICAgIGlmIChhcHBUaXRsZSAhPSBcIlwiKSB0aGlzLmFwcFRpdGxlID0gYXBwVGl0bGU7XG4gICAgICAgIGNvbnNvbGUubG9nKGBTY2F0dGVyU2VydmljZS5jb25uZWN0QXBwKCR7dGhpcy5hcHBUaXRsZX0pYCk7XG4gICAgICAgIGNvbnN0IGNvbm5lY3Rpb25PcHRpb25zID0ge2luaXRUaW1lb3V0OjE4MDB9XG4gICAgICAgIGlmICh0aGlzLl9jb25uZWN0ZWQpIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTsgLy8gPC0tLS0gYXZvaWRzIGEgbG9vcFxuICAgICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy53YWl0Q29ubmVjdGVkLnRoZW4ocmVzb2x2ZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5fY29ubmVjdGVkKSByZXR1cm47IC8vIDwtLS0tIGF2b2lkcyBhIGxvb3BcbiAgICAgICAgICAgIHRoaXMud2FpdEVvc2pzLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2NhdHRlclNlcnZpY2Uud2FpdEVvc2pzKCkgZW9zIE9LXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMubGliLmNvbm5lY3QodGhpcy5hcHBUaXRsZSwgY29ubmVjdGlvbk9wdGlvbnMpLnRoZW4oY29ubmVjdGVkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2kgZXN0w4PCoSBsb2d1ZWFkbyB0aGlzLmxpYi5pZGVudGl0eSBzZSBjYXJnYSBzw4PCs2xvIHkgeWEgZXN0w4PCoSBkaXNwb25pYmxlXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2NhdHRlclNlcnZpY2UubGliLmNvbm5lY3QoKVwiLCBjb25uZWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0ZWQgPSBjb25uZWN0ZWQ7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFjb25uZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRFcnJvcihcImNvbm5lY3RcIiwgXCJFUlJPUjogY2FuIG5vdCBjb25uZWN0IHRvIFNjYXR0ZXIuIElzIGl0IHVwIGFuZCBydW5uaW5nP1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5mZWVkLmVycm9yKFwiY29ubmVjdFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QodGhpcy5mZWVkLmVycm9yKFwiY29ubmVjdFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImNvbm5lY3RcIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXRyeUNvbm5lY3RpbmdBcHAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgYSBwcm94eSByZWZlcmVuY2UgdG8gZW9zanMgd2hpY2ggeW91IGNhbiB1c2UgdG8gc2lnbiB0cmFuc2FjdGlvbnMgd2l0aCBhIHVzZXIncyBTY2F0dGVyLlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNjYXR0ZXJTZXJ2aWNlLnNldENvbm5lY3RlZCgpXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldENvbm5lY3RlZChcImNvbm5lY3RlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjb25uZWN0XCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubG9nZ2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2luKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTY2F0dGVyU2VydmljZS5zZXRSZWFkeSgpXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0UmVhZHkoXCJyZWFkeVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNjYXR0ZXJTZXJ2aWNlLnNldFJlYWR5KClcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFJlYWR5KFwicmVhZHlcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjb25uZWN0XCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgICB9KTsgICAgXG4gICAgICAgICAgICB9KTsgICAgXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG5cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBY2NvdW50RGF0YSBhbmQgQmFsYW5jZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2FsY3VsYXRlVG90YWxCYWxhbmNlKGFjY291bnQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBc3NldChcIjAuMDAwMCBcIiArIHRoaXMuc3ltYm9sKVxuICAgICAgICAgICAgLnBsdXMoYWNjb3VudC5jb3JlX2xpcXVpZF9iYWxhbmNlX2Fzc2V0KVxuICAgICAgICAgICAgLnBsdXMoYWNjb3VudC5yZWZ1bmRfcmVxdWVzdC5uZXRfYW1vdW50X2Fzc2V0KVxuICAgICAgICAgICAgLnBsdXMoYWNjb3VudC5yZWZ1bmRfcmVxdWVzdC5jcHVfYW1vdW50X2Fzc2V0KVxuICAgICAgICAgICAgLnBsdXMoYWNjb3VudC5zZWxmX2RlbGVnYXRlZF9iYW5kd2lkdGguY3B1X3dlaWdodF9hc3NldClcbiAgICAgICAgICAgIC5wbHVzKGFjY291bnQuc2VsZl9kZWxlZ2F0ZWRfYmFuZHdpZHRoLm5ldF93ZWlnaHRfYXNzZXQpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZVJlc291cmNlTGltaXQobGltaXQpIHtcbiAgICAgICAgbGltaXQgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIG1heDogMCwgdXNlZDogMFxuICAgICAgICB9LCBsaW1pdCk7XG4gICAgICAgIFxuICAgICAgICBpZiAobGltaXQubWF4ICE9IDApIHtcbiAgICAgICAgICAgIGxpbWl0LnBlcmNlbnQgPSAxIC0gKE1hdGgubWluKGxpbWl0LnVzZWQsIGxpbWl0Lm1heCkgLyBsaW1pdC5tYXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGltaXQucGVyY2VudCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgbGltaXQucGVyY2VudFN0ciA9IE1hdGgucm91bmQobGltaXQucGVyY2VudCoxMDApICsgXCIlXCI7XG4gICAgICAgIHJldHVybiBsaW1pdDtcbiAgICB9XG5cbiAgICBxdWVyeUFjY291bnREYXRhKG5hbWU6c3RyaW5nKTogUHJvbWlzZTxBY2NvdW50RGF0YT4ge1xuICAgICAgICAvKlxuICAgICAgICAvLyBnZXRfdGFibGVfcm93c1xuICAgICAgICAgICAgY29kZTogXCJlb3Npb1wiXG4gICAgICAgICAgICBpbmRleF9wb3NpdGlvbjogMVxuICAgICAgICAgICAganNvbjogdHJ1ZVxuICAgICAgICAgICAga2V5X3R5cGU6IFwiaTY0XCJcbiAgICAgICAgICAgIGxpbWl0OiAtMVxuICAgICAgICAgICAgbG93ZXJfYm91bmQ6IG51bGxcbiAgICAgICAgICAgIHNjb3BlOiBcImdxeWRvb2J1aGVnZVwiXG4gICAgICAgICAgICB0YWJsZTogXCJkZWxiYW5kXCJcbiAgICAgICAgICAgIHRhYmxlX2tleTogXCJcIlxuICAgICAgICAqL1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNjYXR0ZXJTZXJ2aWNlLnF1ZXJ5QWNjb3VudERhdGEoXCIrbmFtZStcIikgXCIpO1xuICAgICAgICB0aGlzLl9hY2NvdW50X3F1ZXJpZXNbbmFtZV0gPSB0aGlzLl9hY2NvdW50X3F1ZXJpZXNbbmFtZV0gfHwgbmV3IFByb21pc2U8QWNjb3VudERhdGE+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUEFTTyAxIC0tLS0tLVwiLCBbdGhpcy5fYWNjb3VudF9xdWVyaWVzXSlcbiAgICAgICAgICAgIHRoaXMud2FpdEVvc2pzLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUEFTTyAyIChlb3NqcykgLS0tLS0tXCIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgLy8gZW9zanMyXG4gICAgICAgICAgICAgICAgdGhpcy5ycGMuZ2V0X2FjY291bnQobmFtZSkuXG4gICAgICAgICAgICAgICAgLyovXG4gICAgICAgICAgICAgICAgLy8gZW9zanNcbiAgICAgICAgICAgICAgICB0aGlzLmVvcy5nZXRBY2NvdW50KHthY2NvdW50X25hbWU6IG5hbWV9KS5cbiAgICAgICAgICAgICAgICAvLyovXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJQQVNPIDMgKGVvc2pzLmdldEFjY291bnQpIC0tLS0tLVwiLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhY2NvdW50X2RhdGE6IEFjY291bnREYXRhID0gPEFjY291bnREYXRhPnJlc3BvbnNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY2NvdW50X2RhdGEuY29yZV9saXF1aWRfYmFsYW5jZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zeW1ib2wgPSBhY2NvdW50X2RhdGEuY29yZV9saXF1aWRfYmFsYW5jZS5zcGxpdChcIiBcIilbMV07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEuY29yZV9saXF1aWRfYmFsYW5jZSA9IFwiMC4wMDAwIFwiICsgdGhpcy5zeW1ib2w7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudF9kYXRhLmNvcmVfbGlxdWlkX2JhbGFuY2VfYXNzZXQgPSBuZXcgQXNzZXQoYWNjb3VudF9kYXRhLmNvcmVfbGlxdWlkX2JhbGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgICAgICAvLyAtLS0tLSByZWZ1bmRfcmVxdWVzdCAtLS0tLVxuICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEucmVmdW5kX3JlcXVlc3QgPSBhY2NvdW50X2RhdGEucmVmdW5kX3JlcXVlc3QgfHwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IFwiMC4wMDAwIFwiICsgdGhpcy5zeW1ib2wsXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXRfYW1vdW50OiBcIjAuMDAwMCBcIiArIHRoaXMuc3ltYm9sLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3B1X2Ftb3VudDogXCIwLjAwMDAgXCIgKyB0aGlzLnN5bWJvbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RfdGltZTogXCIyMDE4LTExLTE4VDE4OjA5OjUzXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEucmVmdW5kX3JlcXVlc3QuY3B1X2Ftb3VudF9hc3NldCA9IG5ldyBBc3NldChhY2NvdW50X2RhdGEucmVmdW5kX3JlcXVlc3QuY3B1X2Ftb3VudCk7XG4gICAgICAgICAgICAgICAgICAgIGFjY291bnRfZGF0YS5yZWZ1bmRfcmVxdWVzdC5uZXRfYW1vdW50X2Fzc2V0ID0gbmV3IEFzc2V0KGFjY291bnRfZGF0YS5yZWZ1bmRfcmVxdWVzdC5uZXRfYW1vdW50KTtcbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudF9kYXRhLnJlZnVuZF9yZXF1ZXN0LnRvdGFsX2Fzc2V0ID0gXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEucmVmdW5kX3JlcXVlc3QuY3B1X2Ftb3VudF9hc3NldC5wbHVzKGFjY291bnRfZGF0YS5yZWZ1bmRfcmVxdWVzdC5uZXRfYW1vdW50X2Fzc2V0KVxuICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEucmVmdW5kX3JlcXVlc3QudG90YWwgPSBhY2NvdW50X2RhdGEucmVmdW5kX3JlcXVlc3QudG90YWxfYXNzZXQudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyAtLS0tLSBzZWxmX2RlbGVnYXRlZF9iYW5kd2lkdGggLS0tLVxuICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEuc2VsZl9kZWxlZ2F0ZWRfYmFuZHdpZHRoID0gYWNjb3VudF9kYXRhLnNlbGZfZGVsZWdhdGVkX2JhbmR3aWR0aCB8fCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogXCIwLjAwMDAgXCIgKyB0aGlzLnN5bWJvbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldF93ZWlnaHQ6IFwiMC4wMDAwIFwiICsgdGhpcy5zeW1ib2wsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHVfd2VpZ2h0OiBcIjAuMDAwMCBcIiArIHRoaXMuc3ltYm9sXG4gICAgICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEuc2VsZl9kZWxlZ2F0ZWRfYmFuZHdpZHRoLm5ldF93ZWlnaHRfYXNzZXQgPSBuZXcgQXNzZXQoYWNjb3VudF9kYXRhLnNlbGZfZGVsZWdhdGVkX2JhbmR3aWR0aC5uZXRfd2VpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudF9kYXRhLnNlbGZfZGVsZWdhdGVkX2JhbmR3aWR0aC5jcHVfd2VpZ2h0X2Fzc2V0ID0gbmV3IEFzc2V0KGFjY291bnRfZGF0YS5zZWxmX2RlbGVnYXRlZF9iYW5kd2lkdGguY3B1X3dlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIGFjY291bnRfZGF0YS5zZWxmX2RlbGVnYXRlZF9iYW5kd2lkdGgudG90YWxfYXNzZXQgPSBcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY291bnRfZGF0YS5zZWxmX2RlbGVnYXRlZF9iYW5kd2lkdGguY3B1X3dlaWdodF9hc3NldC5wbHVzKGFjY291bnRfZGF0YS5zZWxmX2RlbGVnYXRlZF9iYW5kd2lkdGgubmV0X3dlaWdodF9hc3NldCk7XG4gICAgICAgICAgICAgICAgICAgIGFjY291bnRfZGF0YS5zZWxmX2RlbGVnYXRlZF9iYW5kd2lkdGgudG90YWwgPSBhY2NvdW50X2RhdGEuc2VsZl9kZWxlZ2F0ZWRfYmFuZHdpZHRoLnRvdGFsX2Fzc2V0LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgICAgIC8vIC0tLS0tIHRvdGFsX3Jlc291cmNlcyAtLS0tLVxuICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEudG90YWxfcmVzb3VyY2VzID0gYWNjb3VudF9kYXRhLnRvdGFsX3Jlc291cmNlcyB8fCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXRfd2VpZ2h0OiBcIjAuMDAwMCBcIiArIHRoaXMuc3ltYm9sLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3B1X3dlaWdodDogXCIwLjAwMDAgXCIgKyB0aGlzLnN5bWJvbFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGFjY291bnRfZGF0YS50b3RhbF9yZXNvdXJjZXMubmV0X3dlaWdodF9hc3NldCA9IG5ldyBBc3NldChhY2NvdW50X2RhdGEudG90YWxfcmVzb3VyY2VzLm5ldF93ZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEudG90YWxfcmVzb3VyY2VzLmNwdV93ZWlnaHRfYXNzZXQgPSBuZXcgQXNzZXQoYWNjb3VudF9kYXRhLnRvdGFsX3Jlc291cmNlcy5jcHVfd2VpZ2h0KTtcblxuICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEudG90YWxfYmFsYW5jZV9hc3NldCA9IHRoaXMuY2FsY3VsYXRlVG90YWxCYWxhbmNlKGFjY291bnRfZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGFjY291bnRfZGF0YS50b3RhbF9iYWxhbmNlID0gYWNjb3VudF9kYXRhLnRvdGFsX2JhbGFuY2VfYXNzZXQudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEuY3B1X2xpbWl0ID0gdGhpcy5jYWxjdWxhdGVSZXNvdXJjZUxpbWl0KGFjY291bnRfZGF0YS5jcHVfbGltaXQpO1xuICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEubmV0X2xpbWl0ID0gdGhpcy5jYWxjdWxhdGVSZXNvdXJjZUxpbWl0KGFjY291bnRfZGF0YS5uZXRfbGltaXQpO1xuICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEucmFtX2xpbWl0ID0gdGhpcy5jYWxjdWxhdGVSZXNvdXJjZUxpbWl0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heDogYWNjb3VudF9kYXRhLnJhbV9xdW90YSwgdXNlZDogYWNjb3VudF9kYXRhLnJhbV91c2FnZVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJhY2NvdW50X2RhdGE6IFwiLCBhY2NvdW50X2RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhY2NvdW50X2RhdGEpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBwcm9taXNlID0gdGhpcy5fYWNjb3VudF9xdWVyaWVzW25hbWVdO1xuICAgICAgICBwcm9taXNlLnRoZW4oKHIpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9hY2NvdW50X3F1ZXJpZXNbci5hY2NvdW50X25hbWVdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgLypcbiAgICAvLyBlb3NqczJcbiAgICBhc3luYyBleGVjdXRlVHJhbnNhY3Rpb24oY29udHJhY3Q6c3RyaW5nLCBhY3Rpb246c3RyaW5nLCBkYXRhOmFueSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2dpbigpLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy53YWl0UmVhZHkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVvcy50cmFuc2FjdChcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2NvdW50OiBjb250cmFjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRob3JpemF0aW9uOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0b3I6IHRoaXMuYWNjb3VudC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbjogdGhpcy5hY2NvdW50LmF1dGhvcml0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzQmVoaW5kOiAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGlyZVNlY29uZHM6IDMwXG4gICAgICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFWElUTyAhISEhXCIsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVSUk9SICEhISFcIiwgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7IFxuXG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTsgICBcbiAgICAgICAgfSk7IFxuICAgIH1cbiAgICAqL1xuXG5cbiAgICAvKlxuICAgIFxuICAgIHtcbiAgICAgICAgYWN0aW9uczogW3tcbiAgICAgICAgICAgIGFjY291bnQ6IHRoaXMuY29udHJhY3RBY2NvdW50LFxuICAgICAgICAgICAgbmFtZTogYWN0aW9uLFxuICAgICAgICAgICAgYXV0aG9yaXphdGlvbjogW3tcbiAgICAgICAgICAgICAgICBhY3RvcjogdGhpcy5hY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbjogdGhpcy5hY2NvdW50LmF1dGhvcml0eVxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIC4uLmRhdGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfV1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgYmxvY2tzQmVoaW5kOiAzLFxuICAgICAgICBleHBpcmVTZWNvbmRzOiAzMFxuICAgIH0gICAgXG4gICAgKi9cblxuICAgIGdldFNtYXJ0Q29udHJhY3QoYWNjb3VudF9uYW1lKSB7XG4gICAgICAgIHJldHVybiBuZXcgU21hcnRDb250cmFjdChhY2NvdW50X25hbWUsIHRoaXMpO1xuICAgIH1cbiAgICBcbiAgICBnZXRDb250cmFjdFdyYXBwZXIoYWNjb3VudF9uYW1lKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc29sZS5sb2coYFNjYXR0ZXJTZXJ2aWNlLmdldENvbnRyYWN0KCR7YWNjb3VudF9uYW1lfSlgKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9naW4oKS50aGVuKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0aGlzLmxvZ2luKCkudGhlbigoYSkgPT4geyAtLT5cIiwgYSApO1xuICAgICAgICAgICAgICAgIHRoaXMud2FpdFJlYWR5LnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lb3MuY29udHJhY3QoYWNjb3VudF9uYW1lKS50aGVuKGNvbnRyYWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAtLSBjb250cmFjdCAke2FjY291bnRfbmFtZX0gLS1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gY29udHJhY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgY29udHJhY3RbaV0gPT0gXCJmdW5jdGlvblwiKSBjb25zb2xlLmxvZyhcImNvbnRyYWN0LlwiK2krXCIoKVwiLCBbY29udHJhY3RbaV1dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY29udHJhY3QpO1xuICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pOyAgIFxuICAgICAgICB9KTsgXG4gICAgfVxuICAgIFxuXG4gICAgLypcbiAgICB0cmFuc2Zlcihmcm9tOnN0cmluZywgdG86c3RyaW5nLCBhbW91bnQ6c3RyaW5nLCBtZW1vOnN0cmluZykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNjYXR0ZXJTZXJ2aWNlLnRyYW5zZmVyKClcIiwgZnJvbSwgdG8sIGFtb3VudCwgbWVtbyk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLndhaXRFb3Nqcy50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNjYXR0ZXIudHJhbnNmZXIoKTpcIiwgZnJvbSwgdG8sIGFtb3VudCwgbWVtbywgdGhpcy5hdXRob3JpemF0aW9uKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLmVvcy50cmFuc2Zlcihmcm9tLCB0bywgYW1vdW50LCBtZW1vLCB0aGlzLmF1dGhvcml6YXRpb24pLnRoZW4odHJ4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhhdCdzIGl0IVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgVHJhbnNhY3Rpb24gSUQ6ICR7dHJ4LnRyYW5zYWN0aW9uX2lkfWAsIHRyeCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVuIE5vdGFzIGVzdMODwqEgZWwganNvbiBxdWUgZGVzY3JpYmUgZWwgb2JqZXRvIHRyeFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRyeCk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTsgICBcbiAgICAgICAgfSk7XG4gICAgfVxuICAgICovXG5cbiAgICAvLyBsb2dpblRpbWVyO1xuICAgIGxvZ2luKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNjYXR0ZXJTZXJ2aWNlLmxvZ2luKClcIik7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwibG9naW5cIiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpYi5pZGVudGl0eSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SWRlbnRpdHkodGhpcy5saWIuaWRlbnRpdHkpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5saWIuaWRlbnRpdHkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgbG9naW5UaW1lciA9IHNldFRpbWVvdXQoIF8gPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ2luXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KFwiY29ubmVjdGlvbiB0aW1lb3V0XCIpO1xuICAgICAgICAgICAgICAgIH0sIDUwMDApO1xuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdEFwcCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpYi5nZXRJZGVudGl0eSh7XCJhY2NvdW50c1wiOlt0aGlzLm5ldHdvcmsuZW9zY29uZl19KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oIChpZGVudGl0eSkgID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQobG9naW5UaW1lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRJZGVudGl0eShpZGVudGl0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRMb2dnZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ2luXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGlkZW50aXR5KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2gocmVqZWN0KTsgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTY2F0dGVyU2VydmljZS5sb2dvdXQoKVwiKTtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dpblwiLCBmYWxzZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdEFwcCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubGliLmZvcmdvdHRlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5saWIuZm9yZ2V0SWRlbnRpdHkoKVxuICAgICAgICAgICAgICAgICAgICAudGhlbiggKGVycikgID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGlzY29ubmVjdFwiLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldElkZW50aXR5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ2luXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoXCJsb2dvdXRcIik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgfSkuY2F0Y2gocmVqZWN0KTsgICAgXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldCBsb2dnZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy5saWIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5saWIuaWRlbnRpdHk7XG4gICAgfVxuXG4gICAgZ2V0IHVzZXJuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5saWIpIHJldHVybiBcIlwiO1xuICAgICAgICByZXR1cm4gdGhpcy5saWIuaWRlbnRpdHkgPyB0aGlzLmxpYi5pZGVudGl0eS5uYW1lIDogXCJcIjtcbiAgICB9XG5cbiAgICBnZXQgYXV0aG9yaXphdGlvbigpOiBhbnkge1xuICAgICAgICBpZiAoIXRoaXMuYWNjb3VudCkgIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJTY2F0dGVyU2VydmljZS5hdXRob3JpemF0aW9uKClcIik7XG4gICAgICAgICAgICByZXR1cm4geyBhdXRob3JpemF0aW9uOltcInVua25vd25AdW5rbm93blwiXSB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGF1dGhvcml6YXRpb246W2Ake3RoaXMuYWNjb3VudC5uYW1lfUAke3RoaXMuYWNjb3VudC5hdXRob3JpdHl9YF1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXQgY29ubmVjdGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29ubmVjdGVkO1xuICAgIH1cblxuICAgIGdldFRhYmxlUm93cyhjb250cmFjdCwgc2NvcGUsIHRhYmxlLCB0a2V5LCBsb3dlcmIsIHVwcGVyYiwgbGltaXQsIGt0eXBlLCBpcG9zKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgLypcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJTY2F0dGVyU2VydmljZS5nZXRUYWJsZVJvd3MoKVwiKTtcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL0VPU0lPL2Vvc2pzLWFwaS9ibG9iL21hc3Rlci9kb2NzL2FwaS5tZCNlb3MuZ2V0VGFibGVSb3dzXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMud2FpdEVvc2pzLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBqc29uID0ge1xuICAgICAgICAgICAgICAgICAgICBjb2RlOiBjb250cmFjdCxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhfcG9zaXRpb246IGlwb3MsXG4gICAgICAgICAgICAgICAgICAgIGpzb246IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGtleV90eXBlOiBrdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgbGltaXQ6IGxpbWl0LFxuICAgICAgICAgICAgICAgICAgICBsb3dlcl9ib3VuZDogbG93ZXJiLFxuICAgICAgICAgICAgICAgICAgICBzY29wZTogc2NvcGUsXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlOiB0YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgdGFibGVfa2V5OiB0a2V5LFxuICAgICAgICAgICAgICAgICAgICB1cHBlcl9ib3VuZDogdXBwZXJiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMucnBjLmdldF90YWJsZV9yb3dzKGpzb24pLnRoZW4oX2RhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKF9kYXRhKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7ICAgXG4gICAgICAgIH0pO1xuICAgICAgICAvKi9cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJTY2F0dGVyU2VydmljZS5nZXRUYWJsZVJvd3MoKVwiKTtcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL0VPU0lPL2Vvc2pzLWFwaS9ibG9iL21hc3Rlci9kb2NzL2FwaS5tZCNlb3MuZ2V0VGFibGVSb3dzXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMud2FpdEVvc2pzLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZW9zLmdldFRhYmxlUm93cyh0cnVlLCBjb250cmFjdCwgc2NvcGUsIHRhYmxlLCB0a2V5LCBsb3dlcmIsIHVwcGVyYiwgbGltaXQsIGt0eXBlLCBpcG9zKS50aGVuKGZ1bmN0aW9uIChfZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKF9kYXRhKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pOyAgIFxuICAgICAgICB9KTtcbiAgICAgICAgLy8qL1xuXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVmFwYWVlU2NhdHRlciB9IGZyb20gJy4vc2NhdHRlci5zZXJ2aWNlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtdLFxuICBwcm92aWRlcnM6IFtWYXBhZWVTY2F0dGVyXSxcbiAgZXhwb3J0czogW11cbn0pXG5leHBvcnQgY2xhc3MgVmFwYWVlU2NhdHRlck1vZHVsZSB7IH1cbiJdLCJuYW1lcyI6WyJMb25nLmZyb21TdHJpbmciLCJ0c2xpYl8xLl9fdmFs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