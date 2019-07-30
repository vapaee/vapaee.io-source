import BigNumber from 'bignumber.js';
import { __values } from 'tslib';
import { fromString } from 'long';
import { Injectable, NgModule, defineInjectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Feedback } from '@vapaee/feedback';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Token = /** @class */ (function () {
    function Token(obj) {
        if (obj === void 0) { obj = null; }
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
         */
        function () { return this._symbol; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Token.prototype, "precision", {
        get: /**
         * @return {?}
         */
        function () { return this._precision; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Token.prototype, "contract", {
        get: /**
         * @return {?}
         */
        function () { return this._contract; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Token.prototype, "str", {
        get: /**
         * @return {?}
         */
        function () {
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
var Asset = /** @class */ (function () {
    function Asset(a, b) {
        if (a === void 0) { a = null; }
        if (b === void 0) { b = null; }
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
        if (decimals === void 0) { decimals = -1; }
        if (total === void 0) { total = false; }
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
         */
        function () {
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
        if (decimals === void 0) { decimals = -1; }
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
var SmartContract = /** @class */ (function () {
    function SmartContract(contract, scatter) {
        if (contract === void 0) { contract = ""; }
        if (scatter === void 0) { scatter = null; }
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
        if (params === void 0) { params = {}; }
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ScatterUtils = /** @class */ (function () {
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
        if (littleEndian === void 0) { littleEndian = false; }
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
        var value = fromString(bitstr, true, 2);
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
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (bytes_1_1 && !bytes_1_1.done && (_a = bytes_1.return)) _a.call(bytes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        /** @type {?} */
        var ulName = fromString(leHex, true, 16).toString();
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
var VapaeeScatter = /** @class */ (function () {
    function VapaeeScatter() {
        var _this = this;
        this.scatterutils = new ScatterUtils();
        this.onNetworkChange = new Subject();
        this.onLogggedStateChange = new Subject();
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
        this.feed = new Feedback();
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
         */
        function () {
            return this.scatterutils;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VapaeeScatter.prototype, "account", {
        // Acount, Identity and authentication -----------------
        get: /**
         * @return {?}
         */
        function () {
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
         */
        function () {
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
        if (index === void 0) { index = 0; }
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
        if (index === void 0) { index = 0; }
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
         */
        function () {
            return this._networks_slugs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VapaeeScatter.prototype, "network", {
        get: /**
         * @return {?}
         */
        function () {
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
        if ((/** @type {?} */ (window)).ScatterJS) {
            this.ScatterJS = (/** @type {?} */ (window)).ScatterJS;
            this.ScatterJS.plugins(new ScatterEOS());
            this.lib = this.ScatterJS.scatter;
            (/** @type {?} */ (window)).ScatterJS = null;
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
        if (appTitle === void 0) { appTitle = ""; }
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
                    var account_data = /** @type {?} */ (response);
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
         */
        function () {
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
         */
        function () {
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
         */
        function () {
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
         */
        function () {
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
        { type: Injectable, args: [{
                    providedIn: "root"
                },] },
    ];
    /** @nocollapse */
    VapaeeScatter.ctorParameters = function () { return []; };
    /** @nocollapse */ VapaeeScatter.ngInjectableDef = defineInjectable({ factory: function VapaeeScatter_Factory() { return new VapaeeScatter(); }, token: VapaeeScatter, providedIn: "root" });
    return VapaeeScatter;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var VapaeeScatterModule = /** @class */ (function () {
    function VapaeeScatterModule() {
    }
    VapaeeScatterModule.decorators = [
        { type: NgModule, args: [{
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

export { VapaeeScatter, VapaeeScatterModule, Asset, SmartContract, Token, ScatterUtils };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFwYWVlLXNjYXR0ZXIuanMubWFwIiwic291cmNlcyI6WyJuZzovL0B2YXBhZWUvc2NhdHRlci9saWIvdG9rZW4uY2xhc3MudHMiLCJuZzovL0B2YXBhZWUvc2NhdHRlci9saWIvYXNzZXQuY2xhc3MudHMiLCJuZzovL0B2YXBhZWUvc2NhdHRlci9saWIvY29udHJhY3QuY2xhc3MudHMiLCJuZzovL0B2YXBhZWUvc2NhdHRlci9saWIvdXRpbHMuY2xhc3MudHMiLCJuZzovL0B2YXBhZWUvc2NhdHRlci9saWIvc2NhdHRlci5zZXJ2aWNlLnRzIiwibmc6Ly9AdmFwYWVlL3NjYXR0ZXIvbGliL3NjYXR0ZXIubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuXG5leHBvcnQgY2xhc3MgVG9rZW4ge1xuICAgIHByaXZhdGUgX3N0cj86IHN0cmluZztcbiAgICBwcml2YXRlIF9zeW1ib2w6IHN0cmluZztcbiAgICBwcml2YXRlIF9wcmVjaXNpb24/OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfY29udHJhY3Q/OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihvYmo6YW55ID0gbnVsbCkge1xuICAgICAgICB0aGlzLl9zeW1ib2wgPSBcIkFVWFwiO1xuICAgICAgICB0aGlzLl9wcmVjaXNpb24gPSBudWxsO1xuICAgICAgICB0aGlzLl9jb250cmFjdCA9IG51bGw7XG4gICAgXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRoaXMuX3N5bWJvbCA9IG9iajtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHRoaXMuc3ltYm9sLmxlbmd0aCA+IDAsIFwiRVJST1I6IHN5bWJvbCBub3QgdmFsaWQgZm9yIHRva2VuOiBcIiwgdGhpcy5fc3ltYm9sKTtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHRoaXMuc3ltYm9sLmxlbmd0aCA8IDksIFwiRVJST1I6IHN5bWJvbCBub3QgdmFsaWQgZm9yIHRva2VuOiBcIiwgdGhpcy5fc3ltYm9sKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIFRva2VuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3ltYm9sID0gb2JqLl9zeW1ib2w7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlY2lzaW9uID0gb2JqLl9wcmVjaXNpb247XG4gICAgICAgICAgICAgICAgdGhpcy5fY29udHJhY3QgPSBvYmouX2NvbnRyYWN0O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zeW1ib2wgPSBvYmouc3ltYm9sIHx8IHRoaXMuX3N5bWJvbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmVjaXNpb24gPSBvYmoucHJlY2lzaW9uIHx8IHRoaXMuX3ByZWNpc2lvbjtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250cmFjdCA9IG9iai5jb250cmFjdCB8fCB0aGlzLl9jb250cmFjdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBnZXQgc3ltYm9sKCkgeyByZXR1cm4gdGhpcy5fc3ltYm9sOyB9XG4gICAgZ2V0IHByZWNpc2lvbigpIHsgcmV0dXJuIHRoaXMuX3ByZWNpc2lvbjsgfVxuICAgIGdldCBjb250cmFjdCgpIHsgcmV0dXJuIHRoaXMuX2NvbnRyYWN0OyB9XG5cbiAgICBnZXQgc3RyKCkge1xuICAgICAgICBpZiAodGhpcy5fc3RyKSByZXR1cm4gdGhpcy5fc3RyO1xuICAgICAgICB0aGlzLl9zdHIgPSB0aGlzLnN5bWJvbDtcbiAgICAgICAgaWYgKHRoaXMuX3ByZWNpc2lvbiAhPSBudWxsIHx8IHRoaXMuX2NvbnRyYWN0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wcmVjaXNpb24gJiYgdGhpcy5fY29udHJhY3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdHIgKz0gXCIgKFwiICsgdGhpcy5fcHJlY2lzaW9uICsgXCIsIFwiICsgdGhpcy5fY29udHJhY3QgKyBcIilcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ByZWNpc2lvbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHIgKz0gXCIgKFwiICsgdGhpcy5fcHJlY2lzaW9uICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jb250cmFjdCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHIgKz0gXCIgKFwiICsgdGhpcy5fY29udHJhY3QgKyBcIilcIjtcbiAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fc3RyO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdHI7XG4gICAgfVxuXG59IiwiaW1wb3J0IEJpZ051bWJlciBmcm9tIFwiYmlnbnVtYmVyLmpzXCI7XG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuL3Rva2VuLmNsYXNzXCI7XG5cbmV4cG9ydCBjbGFzcyBBc3NldCB7XG4gICAgYW1vdW50OkJpZ051bWJlcjtcbiAgICB0b2tlbjpUb2tlbjtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihhOiBhbnkgPSBudWxsLCBiOiBhbnkgPSBudWxsKSB7XG4gICAgICAgIGlmIChhID09IG51bGwgJiYgYiA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmFtb3VudCA9IG5ldyBCaWdOdW1iZXIoMCk7XG4gICAgICAgICAgICB0aGlzLnRva2VuID0gbmV3IFRva2VuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEJpZ051bWJlcikge1xuICAgICAgICAgICAgdGhpcy5hbW91bnQgPSBhO1xuICAgICAgICAgICAgdGhpcy50b2tlbiA9IGI7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEFzc2V0KSB7XG4gICAgICAgICAgICB0aGlzLmFtb3VudCA9IGEuYW1vdW50O1xuICAgICAgICAgICAgdGhpcy50b2tlbiA9IGI7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGEgPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgdGhpcy5hbW91bnQgPSBuZXcgQmlnTnVtYmVyKGEpO1xuICAgICAgICAgICAgdGhpcy50b2tlbiA9IGI7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGEgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhpcy5wYXJzZShhKTtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHRoaXMuYW1vdW50IGluc3RhbmNlb2YgQmlnTnVtYmVyLCBcIkVSUk9SOiBBc3NldCBzdHJpbmcgbWFsZm9ybWVkOiAnXCIrYStcIidcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwbHVzKGI6QXNzZXQpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoISFiLCBcIkVSUk9SOiBiIGlzIG5vdCBhbiBBc3NldFwiLCBiLCB0aGlzLnN0cik7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGIudG9rZW4uc3ltYm9sID09IHRoaXMudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiB0cnlpbmcgdG8gc3VtIGFzc2V0cyB3aXRoIGRpZmZlcmVudCB0b2tlbnM6IFwiICsgdGhpcy5zdHIgKyBcIiBhbmQgXCIgKyBiLnN0cik7XG4gICAgICAgIHZhciBhbW91bnQgPSB0aGlzLmFtb3VudC5wbHVzKGIuYW1vdW50KTtcbiAgICAgICAgcmV0dXJuIG5ldyBBc3NldChhbW91bnQsIHRoaXMudG9rZW4pO1xuICAgIH1cblxuICAgIG1pbnVzKGI6QXNzZXQpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoISFiLCBcIkVSUk9SOiBiIGlzIG5vdCBhbiBBc3NldFwiLCBiLCB0aGlzLnN0cik7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGIudG9rZW4uc3ltYm9sID09IHRoaXMudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiB0cnlpbmcgdG8gc3Vic3RyYWN0IGFzc2V0cyB3aXRoIGRpZmZlcmVudCB0b2tlbnM6IFwiICsgdGhpcy5zdHIgKyBcIiBhbmQgXCIgKyBiLnN0cik7XG4gICAgICAgIHZhciBhbW91bnQgPSB0aGlzLmFtb3VudC5taW51cyhiLmFtb3VudCk7XG4gICAgICAgIHJldHVybiBuZXcgQXNzZXQoYW1vdW50LCB0aGlzLnRva2VuKTtcbiAgICB9XG5cbiAgICBjbG9uZSgpOiBBc3NldCB7XG4gICAgICAgIHJldHVybiBuZXcgQXNzZXQodGhpcy5hbW91bnQsIHRoaXMudG9rZW4pO1xuICAgIH1cblxuICAgIHBhcnNlKHRleHQ6IHN0cmluZykge1xuICAgICAgICBpZiAodGV4dCA9PSBcIlwiKSByZXR1cm47XG4gICAgICAgIHZhciBzeW0gPSB0ZXh0LnNwbGl0KFwiIFwiKVsxXTtcbiAgICAgICAgdmFyIGFtb3VudF9zdHIgPSB0ZXh0LnNwbGl0KFwiIFwiKVswXTtcbiAgICAgICAgdGhpcy5hbW91bnQgPSBuZXcgQmlnTnVtYmVyKGFtb3VudF9zdHIpO1xuXG4gICAgICAgIHZhciBwcmVjaXNpb24gPSAwO1xuICAgICAgICBpZiAoYW1vdW50X3N0ci5zcGxpdChcIi5cIikubGVuZ3RoID09IDIpIHtcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IGFtb3VudF9zdHIuc3BsaXQoXCIuXCIpWzFdLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIGlmIChhbW91bnRfc3RyLnNwbGl0KFwiLlwiKS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgaWYgKGlzTmFOKHBhcnNlSW50KGFtb3VudF9zdHIpKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjogQXNzZXQgbWFsZm9ybWVkIHN0cmluZzogJ1wiK3RleHQrXCInXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLnRva2VuID0gbmV3IFRva2VuKHtcbiAgICAgICAgICAgIHN5bWJvbDogc3ltLFxuICAgICAgICAgICAgcHJlY2lzaW9uOiBwcmVjaXNpb25cbiAgICAgICAgfSk7IFxuICAgIH1cblxuICAgIHZhbHVlVG9TdHJpbmcoZGVjaW1hbHM6bnVtYmVyID0gLTEsIHRvdGFsOmJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy50b2tlbikgcmV0dXJuIFwiMFwiO1xuICAgICAgICB2YXIgcGFydHMgPSB0aGlzLmFtb3VudC50b0ZpeGVkKCkuc3BsaXQoXCIuXCIpO1xuICAgICAgICB2YXIgaW50ZWdlciA9IHBhcnRzWzBdO1xuICAgICAgICB2YXIgcHJlY2lzaW9uID0gdGhpcy50b2tlbi5wcmVjaXNpb247XG4gICAgICAgIHZhciBkZWNpbWFsID0gKHBhcnRzLmxlbmd0aD09MiA/IHBhcnRzWzFdIDogXCJcIik7XG4gICAgICAgIGlmIChkZWNpbWFscyAhPSAtMSkge1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gZGVjaW1hbHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRvdGFsKSB7XG4gICAgICAgICAgICBwcmVjaXNpb24gLT0gcGFydHNbMF0ubGVuZ3RoLTE7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSBwcmVjaXNpb24gPiAwID8gcHJlY2lzaW9uIDogMDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpPWRlY2ltYWwubGVuZ3RoOyBpPHByZWNpc2lvbjsgaSsrKSB7XG4gICAgICAgICAgICBkZWNpbWFsICs9IFwiMFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkZWNpbWFsLmxlbmd0aCA+IHByZWNpc2lvbikge1xuICAgICAgICAgICAgZGVjaW1hbCA9IGRlY2ltYWwuc3Vic3RyKDAsIHByZWNpc2lvbik7XG4gICAgICAgIH0gICAgXG5cbiAgICAgICAgaWYgKHByZWNpc2lvbiA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gaW50ZWdlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbnRlZ2VyICsgXCIuXCIgKyBkZWNpbWFsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9OdW1iZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy50b2tlbikgcmV0dXJuIDA7XG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHRoaXMudmFsdWVUb1N0cmluZyg4KSk7XG4gICAgfVxuXG4gICAgZ2V0IHN0ciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoZGVjaW1hbHM6bnVtYmVyID0gLTEpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMudG9rZW4pIHJldHVybiBcIjAuMDAwMFwiO1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVRvU3RyaW5nKGRlY2ltYWxzKSArIFwiIFwiICsgdGhpcy50b2tlbi5zeW1ib2wudG9VcHBlckNhc2UoKTtcbiAgICB9XG5cbiAgICBpbnZlcnNlKHRva2VuOiBUb2tlbik6IEFzc2V0IHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBCaWdOdW1iZXIoMSkuZGl2aWRlZEJ5KHRoaXMuYW1vdW50KTtcbiAgICAgICAgdmFyIGFzc2V0ID0gIG5ldyBBc3NldChyZXN1bHQsIHRva2VuKTtcbiAgICAgICAgcmV0dXJuIGFzc2V0O1xuICAgIH1cbn0iLCJpbXBvcnQgeyBWYXBhZWVTY2F0dGVyIH0gZnJvbSBcIi4vc2NhdHRlci5zZXJ2aWNlXCI7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGludGVyZmFjZSBUYWJsZVBhcmFtcyB7XG4gICAgY29udHJhY3Q/OnN0cmluZywgXG4gICAgc2NvcGU/OnN0cmluZywgXG4gICAgdGFibGVfa2V5PzpzdHJpbmcsIFxuICAgIGxvd2VyX2JvdW5kPzpzdHJpbmcsIFxuICAgIHVwcGVyX2JvdW5kPzpzdHJpbmcsIFxuICAgIGxpbWl0PzpudW1iZXIsIFxuICAgIGtleV90eXBlPzpzdHJpbmcsIFxuICAgIGluZGV4X3Bvc2l0aW9uPzpzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUYWJsZVJlc3VsdCB7XG4gICAgbW9yZTogYm9vbGVhbjtcbiAgICByb3dzOiBhbnlbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFNtYXJ0Q29udHJhY3Qge1xuICAgIGNvbnRyYWN0OiBzdHJpbmc7XG4gICAgc2NhdHRlcjogVmFwYWVlU2NhdHRlcjtcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcihjb250cmFjdDogc3RyaW5nID0gXCJcIiwgc2NhdHRlcjogVmFwYWVlU2NhdHRlciA9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb250cmFjdCA9IGNvbnRyYWN0O1xuICAgICAgICB0aGlzLnNjYXR0ZXIgPSBzY2F0dGVyO1xuICAgIH0gICAgXG4gICAgLypcbiAgICAvLyBlb3NqczJcbiAgICBleGNlY3V0ZShhY3Rpb246IHN0cmluZywgcGFyYW1zOiBhbnkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJVdGlscy5leGNlY3V0ZSgpXCIsIGFjdGlvbiwgW3BhcmFtc10pO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NhdHRlci5leGVjdXRlVHJhbnNhY3Rpb24odGhpcy5jb250cmFjdCwgYWN0aW9uLCBwYXJhbXMpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjogXCIsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7IGNvbnNvbGUuZXJyb3IoZXJyKTsgcmVqZWN0KGVycik7IH1cbiAgICAgICAgfSk7IC8vIC5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpICk7XG4gICAgfVxuICAgIC8qL1xuICAgIGV4Y2VjdXRlKGFjdGlvbjogc3RyaW5nLCBwYXJhbXM6IGFueSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlV0aWxzLmV4Y2VjdXRlKClcIiwgYWN0aW9uLCBbcGFyYW1zXSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2F0dGVyLmdldENvbnRyYWN0V3JhcHBlcih0aGlzLmNvbnRyYWN0KS50aGVuKGNvbnRyYWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0W2FjdGlvbl0ocGFyYW1zLCB0aGlzLnNjYXR0ZXIuYXV0aG9yaXphdGlvbikudGhlbigocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXRpbHMuZXhjZWN1dGUoKSAtLS0+IFwiLCBbcmVzcG9uc2VdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKS5jYXRjaChlcnIgPT4geyByZWplY3QoZXJyKTsgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikgeyByZWplY3QoZXJyKTsgfVxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7IHJlamVjdChlcnIpOyB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikgeyByZWplY3QoZXJyKTsgfVxuICAgICAgICB9KTsgLy8gLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKGVycikgKTtcbiAgICB9XG4gICAgLy8qL1xuXG4gICAgZ2V0VGFibGUodGFibGU6c3RyaW5nLCBwYXJhbXM6VGFibGVQYXJhbXMgPSB7fSk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcblxuICAgICAgICB2YXIgX3AgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIGNvbnRyYWN0OiB0aGlzLmNvbnRyYWN0LCBcbiAgICAgICAgICAgIHNjb3BlOiB0aGlzLmNvbnRyYWN0LCBcbiAgICAgICAgICAgIHRhYmxlX2tleTogXCIwXCIsIFxuICAgICAgICAgICAgbG93ZXJfYm91bmQ6IFwiMFwiLCBcbiAgICAgICAgICAgIHVwcGVyX2JvdW5kOiBcIi0xXCIsIFxuICAgICAgICAgICAgbGltaXQ6IDI1LCBcbiAgICAgICAgICAgIGtleV90eXBlOiBcImk2NFwiLCBcbiAgICAgICAgICAgIGluZGV4X3Bvc2l0aW9uOiBcIjFcIlxuICAgICAgICB9LCBwYXJhbXMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnNjYXR0ZXIuZ2V0VGFibGVSb3dzKFxuICAgICAgICAgICAgX3AuY29udHJhY3QsXG4gICAgICAgICAgICBfcC5zY29wZSwgdGFibGUsXG4gICAgICAgICAgICBfcC50YWJsZV9rZXksXG4gICAgICAgICAgICBfcC5sb3dlcl9ib3VuZCxcbiAgICAgICAgICAgIF9wLnVwcGVyX2JvdW5kLFxuICAgICAgICAgICAgX3AubGltaXQsXG4gICAgICAgICAgICBfcC5rZXlfdHlwZSxcbiAgICAgICAgICAgIF9wLmluZGV4X3Bvc2l0aW9uXG4gICAgICAgICk7XG4gICAgfSAgICBcbiAgICBcbn0iLCJpbXBvcnQgQmlnTnVtYmVyIGZyb20gXCJiaWdudW1iZXIuanNcIjtcbmltcG9ydCAqIGFzIExvbmcgZnJvbSAnbG9uZyc7XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgaW50ZXJmYWNlIFNsdWdJZCB7XG4gICAgbG93Pzogc3RyaW5nO1xuICAgIHN0cj86IHN0cmluZztcbiAgICB0b3A/OiBzdHJpbmc7XG59XG5leHBvcnQgaW50ZXJmYWNlIFdvcmsge1xuICAgIGl0ZW1zOiBhbnlbXTtcbiAgICBjb250YWluZXJzOiBhbnlbXTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgUHJvZmlsZSB7XG4gICAgaWQ/OnN0cmluZztcbiAgICBzbHVnaWQ6IFNsdWdJZDtcbiAgICBhY2NvdW50OiBzdHJpbmc7XG4gICAgY29udGFpbmVycz86IGFueVtdLFxuICAgIHdvcms/OiBXb3JrO1xufVxuXG5leHBvcnQgY2xhc3MgU2NhdHRlclV0aWxzIHtcbiAgICBjb2RlXzA6bnVtYmVyO1xuICAgIGNvZGVfMTpudW1iZXI7XG4gICAgY29kZV80Om51bWJlcjtcbiAgICBjb2RlXzk6bnVtYmVyO1xuICAgIGNvZGVfYTpudW1iZXI7XG4gICAgY29kZV9mOm51bWJlcjtcbiAgICBjb2RlX3o6bnVtYmVyO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNvZGVfMCA9IFwiMFwiLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIHRoaXMuY29kZV8xID0gXCIxXCIuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgdGhpcy5jb2RlXzQgPSBcIjRcIi5jaGFyQ29kZUF0KDApO1xuICAgICAgICB0aGlzLmNvZGVfOSA9IFwiOVwiLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIHRoaXMuY29kZV9hID0gXCJhXCIuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgdGhpcy5jb2RlX2YgPSBcImZcIi5jaGFyQ29kZUF0KDApOyAgICAgICAgXG4gICAgICAgIHRoaXMuY29kZV96ID0gXCJ6XCIuY2hhckNvZGVBdCgwKTsgICAgICAgIFxuICAgIH0gICAgXG5cbiAgICAvLyB0aGlzIHBhcnQgaXMgc3RpbGwgZXhwZXJpbWVudGFsIChpbml0KSAtLS0tLS0tLS0tLS0tLS0tLVxuICAgIGRlY29kZU5pYmJsZShuaWI6bnVtYmVyKSB7XG4gICAgICAgIHZhciBuaWJibGUgPSBbMCwwLDAsMF07XG4gICAgICAgIHZhciB2YWx1ZSA9IDA7XG4gICAgICAgIGlmICh0aGlzLmNvZGVfMCA8PSBuaWIgJiYgbmliIDw9IHRoaXMuY29kZV85KSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG5pYiAtIHRoaXMuY29kZV8wO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29kZV9hIDw9IG5pYiAmJiBuaWIgPD0gdGhpcy5jb2RlX2YpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbmliIC0gdGhpcy5jb2RlX2EgKyAxMDtcbiAgICAgICAgfVxuICAgICAgICBuaWJibGVbMF0gPSAodmFsdWUgJiA4KSA+IDAgPyAxIDogMDtcbiAgICAgICAgbmliYmxlWzFdID0gKHZhbHVlICYgNCkgPiAwID8gMSA6IDA7XG4gICAgICAgIG5pYmJsZVsyXSA9ICh2YWx1ZSAmIDIpID4gMCA/IDEgOiAwO1xuICAgICAgICBuaWJibGVbM10gPSAodmFsdWUgJiAxKSA+IDAgPyAxIDogMDtcbiAgICAgICAgcmV0dXJuIG5pYmJsZTtcbiAgICB9XG5cbiAgICBlbmNvZGVOaWJibGUoaW5kZXg6bnVtYmVyLCBiaXRzOm51bWJlcltdKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IDA7XG4gICAgICAgIHZhbHVlICs9IGJpdHNbaW5kZXggKyAwXSA9PSAxID8gOCA6IDA7XG4gICAgICAgIHZhbHVlICs9IGJpdHNbaW5kZXggKyAxXSA9PSAxID8gNCA6IDA7XG4gICAgICAgIHZhbHVlICs9IGJpdHNbaW5kZXggKyAyXSA9PSAxID8gMiA6IDA7XG4gICAgICAgIHZhbHVlICs9IGJpdHNbaW5kZXggKyAzXSA9PSAxID8gMSA6IDA7XG4gICAgICAgIGlmICgwIDw9IHZhbHVlICYmIHZhbHVlIDw9IDkpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiICsgdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoKHZhbHVlKSB7XG4gICAgICAgICAgICBjYXNlIDEwOiByZXR1cm4gXCJhXCI7XG4gICAgICAgICAgICBjYXNlIDExOiByZXR1cm4gXCJiXCI7XG4gICAgICAgICAgICBjYXNlIDEyOiByZXR1cm4gXCJjXCI7XG4gICAgICAgICAgICBjYXNlIDEzOiByZXR1cm4gXCJkXCI7XG4gICAgICAgICAgICBjYXNlIDE0OiByZXR1cm4gXCJlXCI7XG4gICAgICAgICAgICBjYXNlIDE1OiByZXR1cm4gXCJmXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiP1wiO1xuICAgIH1cblxuICAgIC8vIF9udW0gaXMgYW4gaGV4YVxuICAgIGRlY29kZVVpbnQ2NChfbnVtOiBzdHJpbmcpIHtcbiAgICAgICAgdmFyIGJpdHM6bnVtYmVyW10gPSBbXTtcbiAgICAgICAgdmFyIG51bTpzdHJpbmcgPSBfbnVtLnN1YnN0cigyKTtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPG51bS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYml0cyA9IGJpdHMuY29uY2F0KHRoaXMuZGVjb2RlTmliYmxlKG51bS5jaGFyQ29kZUF0KGkpKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJpdHM7XG4gICAgfVxuXG4gICAgZW5jb2RlVW5pdDY0KGJpdHM6bnVtYmVyW10pIHtcbiAgICAgICAgdmFyIHNsdWdpZDpTbHVnSWQgPSB7dG9wOlwiMHhcIixsb3c6XCIweFwifTtcbiAgICAgICAgdmFyIHN0ciA9IFwidG9wXCI7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxiaXRzLmxlbmd0aDsgaSs9NCkge1xuICAgICAgICAgICAgaWYgKGk+PTEyOCkgc3RyID0gXCJsb3dcIjtcbiAgICAgICAgICAgIHNsdWdpZFtzdHJdICs9IHRoaXMuZW5jb2RlTmliYmxlKGksIGJpdHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzbHVnaWQ7XG4gICAgfVxuXG4gICAgZXh0cmFjdExlbmd0aChiaXRzOm51bWJlcltdKSB7XG4gICAgICAgIGlmKGJpdHMubGVuZ3RoICE9IDI1NikgY29uc29sZS5lcnJvcihcIkVSUk9SOiBleHRyYWN0TGVuZ3RoKGJpdHMpIGJpdHMgbXVzdCBiZSBhbiBhcnJheSBvZiAyNTYgYml0c1wiKTtcbiAgICAgICAgcmV0dXJuIGJpdHNbMjUwXSAqIDMyICsgYml0c1syNTFdICogMTYgKyBiaXRzWzI1Ml0gKiA4ICsgYml0c1syNTNdICogNCArIGJpdHNbMjU0XSAqIDIgKyBiaXRzWzI1NV0gKiAxO1xuICAgIH1cblxuICAgIGluc2VydExlbmd0aChiaXRzOm51bWJlcltdLCBsZW5ndGg6IG51bWJlcikge1xuICAgICAgICBpZihiaXRzLmxlbmd0aCAhPSAyNTYpIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjogZXh0cmFjdExlbmd0aChiaXRzKSBiaXRzIG11c3QgYmUgYW4gYXJyYXkgb2YgMjU2IGJpdHNcIik7XG4gICAgICAgIGJpdHNbMjUwXSA9IChsZW5ndGggJiAzMikgPyAxIDogMDtcbiAgICAgICAgYml0c1syNTFdID0gKGxlbmd0aCAmIDE2KSA/IDEgOiAwO1xuICAgICAgICBiaXRzWzI1Ml0gPSAobGVuZ3RoICYgIDgpID8gMSA6IDA7XG4gICAgICAgIGJpdHNbMjUzXSA9IChsZW5ndGggJiAgNCkgPyAxIDogMDtcbiAgICAgICAgYml0c1syNTRdID0gKGxlbmd0aCAmICAyKSA/IDEgOiAwO1xuICAgICAgICBiaXRzWzI1NV0gPSAobGVuZ3RoICYgIDEpID8gMSA6IDA7XG4gICAgfVxuXG4gICAgdmFsdWVUb0NoYXIodjpudW1iZXIpIHtcbiAgICAgICAgaWYgKHYgPT0gMCkgcmV0dXJuICcuJztcbiAgICAgICAgaWYgKHYgPT0gMSkgcmV0dXJuICctJztcbiAgICAgICAgaWYgKHYgPCA2KSByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSh2ICsgdGhpcy5jb2RlXzAgLSAxKTtcbiAgICAgICAgaWYgKHYgPCAzMikgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUodiArIHRoaXMuY29kZV9hIC0gNik7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCBcIkVSUk9SOiB2YWx1ZSBvdXQgb2YgcmFuZ2UgWzAtMzFdXCIsIHYpO1xuICAgICAgICByZXR1cm4gJz8nOyAgICAgICAgICAgICAgICAgICBcbiAgICB9XG5cbiAgICBjaGFyVG9WYWx1ZShjOnN0cmluZykge1xuICAgICAgICBjb25zb2xlLmFzc2VydChjLmxlbmd0aCA9PSAxLCBcIkVSUk9SOiBjIE1VU1QgYmUgYSBjaGFyYWN0ZXIgKHN0cmluZyB3aXRoIGxlbmd0aCA9PSAxKS4gR290XCIsIHR5cGVvZiBjLCBjKTtcbiAgICAgICAgaWYgKGMgPT0gXCIuXCIpIHJldHVybiAwO1xuICAgICAgICBpZiAoYyA9PSBcIi1cIikgcmV0dXJuIDE7XG4gICAgICAgIGlmICh0aGlzLmNvZGVfMCA8IGMuY2hhckNvZGVBdCgwKSAmJiBjLmNoYXJDb2RlQXQoMCkgPD0gdGhpcy5jb2RlXzQpIHJldHVybiBjLmNoYXJDb2RlQXQoMCkgLSB0aGlzLmNvZGVfMSArIDI7XG4gICAgICAgIGlmICh0aGlzLmNvZGVfYSA8PSBjLmNoYXJDb2RlQXQoMCkgJiYgYy5jaGFyQ29kZUF0KDApIDw9IHRoaXMuY29kZV96KSByZXR1cm4gYy5jaGFyQ29kZUF0KDApIC0gdGhpcy5jb2RlX2EgKyA2O1xuICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgXCJFUlJPUjogY2hhcmFjdGVyICdcIiArIGMgKyBcIicgaXMgbm90IGluIGFsbG93ZWQgY2hhcmFjdGVyIHNldCBmb3Igc2x1Z2lkIFwiKTtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGV4dHJhY3RDaGFyKGM6bnVtYmVyLCBiaXRzOm51bWJlcltdKSB7XG4gICAgICAgIHZhciBlbmNvZGUgPSA1O1xuICAgICAgICB2YXIgcG90ID0gTWF0aC5wb3coMiwgZW5jb2RlLTEpOyAvLyAxNlxuICAgICAgICB2YXIgdmFsdWUgPSAwO1xuICAgICAgICB2YXIgaW5kZXggPSBjICogZW5jb2RlO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8ZW5jb2RlOyBpKyssIHBvdCA9IHBvdC8yKSB7XG4gICAgICAgICAgICB2YWx1ZSArPSBiaXRzW2luZGV4ICsgaV0gKiBwb3Q7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNoYXIgPSB0aGlzLnZhbHVlVG9DaGFyKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIGNoYXI7XG4gICAgfVxuXG4gICAgaW5zZXJ0Q2hhcih2YWx1ZTpudW1iZXIsIGo6bnVtYmVyLCBiaXRzOm51bWJlcltdKSB7XG4gICAgICAgIHZhciBlbmNvZGUgPSA1O1xuICAgICAgICB2YXIgaW5kZXggPSBqICogZW5jb2RlO1xuICAgICAgICBiaXRzW2luZGV4ICsgMF0gPSAodmFsdWUgJiAxNikgPiAwID8gMSA6IDA7XG4gICAgICAgIGJpdHNbaW5kZXggKyAxXSA9ICh2YWx1ZSAmICA4KSA+IDAgPyAxIDogMDtcbiAgICAgICAgYml0c1tpbmRleCArIDJdID0gKHZhbHVlICYgIDQpID4gMCA/IDEgOiAwO1xuICAgICAgICBiaXRzW2luZGV4ICsgM10gPSAodmFsdWUgJiAgMikgPiAwID8gMSA6IDA7ICAgICAgICAgICAgXG4gICAgICAgIGJpdHNbaW5kZXggKyA0XSA9ICh2YWx1ZSAmICAxKSA+IDAgPyAxIDogMDtcbiAgICB9XG5cbiAgICBkZWNvZGVTbHVnKHNsdWlnOlNsdWdJZCkge1xuICAgICAgICAvLyBkZWNvZGVTbHVnKCkgMHg0MWFlOWMwNGQzNDg3MzQ4MmE3ODAwMDAwMDAwMDAwMCAweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZGVjb2RlU2x1ZygpXCIsIG5pY2sudG9wLCBuaWNrLmxvdyk7XG4gICAgICAgIHZhciBiaXRzOm51bWJlcltdID0gW107XG4gICAgICAgIGJpdHMgPSB0aGlzLmRlY29kZVVpbnQ2NChzbHVpZy50b3ApLmNvbmNhdCh0aGlzLmRlY29kZVVpbnQ2NChzbHVpZy5sb3cpKTtcbiAgICAgICAgdmFyIGxlbmd0aCA9IGJpdHNbMjUwXSAqIDMyICsgYml0c1syNTFdICogMTYgKyBiaXRzWzI1Ml0gKiA4ICsgYml0c1syNTNdICogNCArIGJpdHNbMjU0XSAqIDIgKyBiaXRzWzI1NV0gKiAxO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImxlbmd0aDogXCIsIGxlbmd0aCk7XG4gICAgICAgIHZhciBzdHI6c3RyaW5nID0gXCJcIjtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzdHIgKz0gdGhpcy5leHRyYWN0Q2hhcihpLCBiaXRzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInN0cjogXCIsIHN0cik7XG4gICAgICAgIHNsdWlnLnN0ciA9IHN0cjtcbiAgICAgICAgcmV0dXJuIHNsdWlnO1xuICAgIH1cblxuICAgIGVuY29kZVNsdWcobmFtZTpzdHJpbmcpOlNsdWdJZCB7XG4gICAgICAgIHZhciBiaXRzID0gW107XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTwyNTY7IGkrKykge1xuICAgICAgICAgICAgYml0cy5wdXNoKDApO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxuYW1lLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmNoYXJUb1ZhbHVlKG5hbWVbaV0pO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRDaGFyKHZhbHVlLCBpLCBiaXRzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluc2VydExlbmd0aChiaXRzLCBuYW1lLmxlbmd0aCk7XG4gICAgICAgIHZhciBzbHVnID0gdGhpcy5lbmNvZGVVbml0NjQoYml0cyk7XG5cbiAgICAgICAgc2x1ZyA9IHRoaXMuZGVjb2RlU2x1ZyhzbHVnKTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoc2x1Zy5zdHIgPT0gbmFtZSwgXCJFUlJPUjogc2x1Zy5zdHI6IFwiLCBzbHVnLnN0ciwgW3NsdWcuc3RyXSwgW25hbWVdKTtcblxuICAgICAgICByZXR1cm4gc2x1ZztcbiAgICB9XG5cbiAgICBzbHVnVG8xMjhiaXRzKHNsdWc6U2x1Z0lkKTpzdHJpbmcge1xuICAgICAgICB2YXIgc3RyID0gXCIweFwiO1xuICAgICAgICB2YXIgdG9wYml0cyA9IHRoaXMuZGVjb2RlVWludDY0KHNsdWcudG9wKTtcbiAgICAgICAgdmFyIGxvd2JpdHMgPSB0aGlzLmRlY29kZVVpbnQ2NChzbHVnLmxvdyk7XG4gICAgICAgIHZhciBtaXhiaXRzID0gW107XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0b3BiaXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBtaXhiaXRzLnB1c2godG9wYml0c1tpXSBeIGxvd2JpdHNbaV0gPyAxIDogMCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPG1peGJpdHMubGVuZ3RoOyBpKz00KSB7XG4gICAgICAgICAgICBzdHIgKz0gdGhpcy5lbmNvZGVOaWJibGUoaSwgbWl4Yml0cyk7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICAvLyAoZW5kKSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8vIE9MRCBlb3NqcyBlbmNvZGVOYW1lIHNvbHV0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNoYXJtYXAgPSAnLjEyMzQ1YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonO1xuICAgIGNoYXJpZHggPSBjaCA9PiB7XG4gICAgICAgIGNvbnN0IGlkeCA9IHRoaXMuY2hhcm1hcC5pbmRleE9mKGNoKVxuICAgICAgICBpZihpZHggPT09IC0xKVxuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEludmFsaWQgY2hhcmFjdGVyOiAnJHtjaH0nYClcbiAgICAgIFxuICAgICAgICByZXR1cm4gaWR4O1xuICAgIH1cbiAgICBvbGRFb3Nqc0VuY29kZU5hbWUobmFtZSwgbGl0dGxlRW5kaWFuID0gZmFsc2UpIHtcbiAgICAgICAgaWYodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKVxuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ25hbWUgcGFyYW1ldGVyIGlzIGEgcmVxdWlyZWQgc3RyaW5nJylcbiAgICAgIFxuICAgICAgICBpZihuYW1lLmxlbmd0aCA+IDEyKVxuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0EgbmFtZSBjYW4gYmUgdXAgdG8gMTIgY2hhcmFjdGVycyBsb25nJylcbiAgICAgIFxuICAgICAgICBsZXQgYml0c3RyID0gJydcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8PSAxMjsgaSsrKSB7IC8vIHByb2Nlc3MgYWxsIDY0IGJpdHMgKGV2ZW4gaWYgbmFtZSBpcyBzaG9ydClcbiAgICAgICAgICBjb25zdCBjID0gaSA8IG5hbWUubGVuZ3RoID8gdGhpcy5jaGFyaWR4KG5hbWVbaV0pIDogMFxuICAgICAgICAgIGNvbnN0IGJpdGxlbiA9IGkgPCAxMiA/IDUgOiA0XG4gICAgICAgICAgbGV0IGJpdHMgPSBOdW1iZXIoYykudG9TdHJpbmcoMilcbiAgICAgICAgICBpZihiaXRzLmxlbmd0aCA+IGJpdGxlbikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBuYW1lICcgKyBuYW1lKVxuICAgICAgICAgIH1cbiAgICAgICAgICBiaXRzID0gJzAnLnJlcGVhdChiaXRsZW4gLSBiaXRzLmxlbmd0aCkgKyBiaXRzXG4gICAgICAgICAgYml0c3RyICs9IGJpdHNcbiAgICAgICAgfVxuICAgICAgXG4gICAgICAgIGNvbnN0IHZhbHVlID0gTG9uZy5mcm9tU3RyaW5nKGJpdHN0ciwgdHJ1ZSwgMilcbiAgICAgIFxuICAgICAgICAvLyBjb252ZXJ0IHRvIExJVFRMRV9FTkRJQU5cbiAgICAgICAgbGV0IGxlSGV4ID0gJydcbiAgICAgICAgY29uc3QgYnl0ZXMgPSBsaXR0bGVFbmRpYW4gPyB2YWx1ZS50b0J5dGVzTEUoKSA6IHZhbHVlLnRvQnl0ZXNCRSgpXG4gICAgICAgIGZvcihjb25zdCBiIG9mIGJ5dGVzKSB7XG4gICAgICAgICAgY29uc3QgbiA9IE51bWJlcihiKS50b1N0cmluZygxNilcbiAgICAgICAgICBsZUhleCArPSAobi5sZW5ndGggPT09IDEgPyAnMCcgOiAnJykgKyBuXG4gICAgICAgIH1cbiAgICAgIFxuICAgICAgICBjb25zdCB1bE5hbWUgPSBMb25nLmZyb21TdHJpbmcobGVIZXgsIHRydWUsIDE2KS50b1N0cmluZygpXG4gICAgICBcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2VuY29kZU5hbWUnLCBuYW1lLCB2YWx1ZS50b1N0cmluZygpLCB1bE5hbWUudG9TdHJpbmcoKSwgSlNPTi5zdHJpbmdpZnkoYml0c3RyLnNwbGl0KC8oLi4uLi4pLykuc2xpY2UoMSkpKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHVsTmFtZS50b1N0cmluZygpXG4gICAgfVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGVuY29kZU5hbWUobmFtZTpzdHJpbmcpOkJpZ051bWJlciB7XG4gICAgICAgIC8qXG4gICAgICAgIGNvbnN0IGJ1ZmZlcjogU2VyaWFsaXplLlNlcmlhbEJ1ZmZlciA9IG5ldyBTZXJpYWxpemUuU2VyaWFsQnVmZmVyKCk7XG4gICAgICAgIGJ1ZmZlci5wdXNoTmFtZShuYW1lKTtcbiAgICAgICAgdmFyIG51bWJlciA9IGJ1ZmZlci5nZXRVaW50NjRBc051bWJlcigpO1xuICAgICAgICAqL1xuICAgICAgICB2YXIgbnVtYmVyID0gdGhpcy5vbGRFb3Nqc0VuY29kZU5hbWUobmFtZSk7XG4gICAgICAgIHJldHVybiBuZXcgQmlnTnVtYmVyKG51bWJlcik7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuLy8gaW1wb3J0IHsgRW9zaW9Ub2tlbk1hdGhTZXJ2aWNlIH0gZnJvbSAnLi9lb3Npby50b2tlbi1tYXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmVlZGJhY2sgfSBmcm9tICdAdmFwYWVlL2ZlZWRiYWNrJztcblxuLy8gc2NhdHRlciBsaWJyYXJpZXNcbi8qL1xuLy8gZW9zanMyXG5pbXBvcnQgU2NhdHRlckpTIGZyb20gJ0BzY2F0dGVyanMvY29yZSc7XG5pbXBvcnQgU2NhdHRlckVPUyBmcm9tICdAc2NhdHRlcmpzL2Vvc2pzMic7XG5pbXBvcnQgU2NhdHRlckx5bnggZnJvbSAnQHNjYXR0ZXJqcy9seW54JztcbmltcG9ydCB7SnNvblJwYywgQXBpfSBmcm9tICdlb3Nqcyc7XG4vKi9cbmltcG9ydCBTY2F0dGVySlMgZnJvbSAnc2NhdHRlcmpzLWNvcmUnO1xuaW1wb3J0IFNjYXR0ZXJFT1MgZnJvbSAnc2NhdHRlcmpzLXBsdWdpbi1lb3NqcydcbmltcG9ydCBFb3MgZnJvbSAnZW9zanMnO1xuaW1wb3J0IHsgQXNzZXQgfSBmcm9tICcuL2Fzc2V0LmNsYXNzJztcbmltcG9ydCB7IFNtYXJ0Q29udHJhY3QgfSBmcm9tICcuL2NvbnRyYWN0LmNsYXNzJztcbmltcG9ydCB7IFNjYXR0ZXJVdGlscyB9IGZyb20gJy4vdXRpbHMuY2xhc3MnO1xuLy8qL1xuXG4vLyBkZWNsYXJlIHZhciBTY2F0dGVySlM6YW55O1xuXG4vLyBlb3NqcyAvIGVvc2pzMlxuZXhwb3J0IGludGVyZmFjZSBSUEMge1xuICAgIGVuZHBvaW50OiBzdHJpbmc7XG4gICAgZmV0Y2hCdWlsdGluOiBGdW5jdGlvbjtcbiAgICBmZXRjaDogRnVuY3Rpb247XG4gICAgZ2V0X2FiaTogRnVuY3Rpb247XG4gICAgZ2V0X2FjY291bnQ6IEZ1bmN0aW9uO1xuICAgIGdldF9ibG9ja19oZWFkZXJfc3RhdGU6IEZ1bmN0aW9uO1xuICAgIGdldF9ibG9jazogRnVuY3Rpb247XG4gICAgZ2V0X2NvZGU6IEZ1bmN0aW9uO1xuICAgIGdldF9jdXJyZW5jeV9iYWxhbmNlOiBGdW5jdGlvbjtcbiAgICBnZXRfY3VycmVuY3lfc3RhdHM6IEZ1bmN0aW9uO1xuICAgIGdldF9pbmZvOiBGdW5jdGlvbjtcbiAgICBnZXRfcHJvZHVjZXJfc2NoZWR1bGU6IEZ1bmN0aW9uO1xuICAgIGdldF9wcm9kdWNlcnM6IEZ1bmN0aW9uO1xuICAgIGdldF9yYXdfY29kZV9hbmRfYWJpOiBGdW5jdGlvbjtcbiAgICBnZXRSYXdBYmk6IEZ1bmN0aW9uO1xuICAgIGdldF90YWJsZV9yb3dzOiBGdW5jdGlvbjtcbiAgICBnZXRSZXF1aXJlZEtleXM6IEZ1bmN0aW9uO1xuICAgIHB1c2hfdHJhbnNhY3Rpb246IEZ1bmN0aW9uO1xuICAgIGRiX3NpemVfZ2V0OiBGdW5jdGlvbjtcbiAgICBoaXN0b3J5X2dldF9hY3Rpb25zOiBGdW5jdGlvbjtcbiAgICBoaXN0b3J5X2dldF90cmFuc2FjdGlvbjogRnVuY3Rpb247XG4gICAgaGlzdG9yeV9nZXRfa2V5X2FjY291bnRzOiBGdW5jdGlvbjtcbiAgICBoaXN0b3J5X2dldF9jb250cm9sbGVkX2FjY291bnRzOiBGdW5jdGlvbjsgICAgXG59XG5cbi8qXG4vLyBlb3NqczJcbmV4cG9ydCBpbnRlcmZhY2UgRU9TIHtcbiAgICBjb250cmFjdHM6IEZ1bmN0aW9uO1xuICAgIGNhY2hlZEFiaXM6IEZ1bmN0aW9uO1xuICAgIHJwYzogRnVuY3Rpb247XG4gICAgYXV0aG9yaXR5UHJvdmlkZXI6IEZ1bmN0aW9uO1xuICAgIGFiaVByb3ZpZGVyOiBGdW5jdGlvbjtcbiAgICBzaWduYXR1cmVQcm92aWRlcjogRnVuY3Rpb247XG4gICAgY2hhaW5JZDogRnVuY3Rpb247XG4gICAgdGV4dEVuY29kZXI6IEZ1bmN0aW9uO1xuICAgIHRleHREZWNvZGVyOiBGdW5jdGlvbjtcbiAgICBhYmlUeXBlczogRnVuY3Rpb247XG4gICAgdHJhbnNhY3Rpb25UeXBlczogRnVuY3Rpb247XG4gICAgcmF3QWJpVG9Kc29uOiBGdW5jdGlvbjtcbiAgICBnZXRDYWNoZWRBYmk6IEZ1bmN0aW9uO1xuICAgIGdldEFiaTogRnVuY3Rpb247XG4gICAgZ2V0VHJhbnNhY3Rpb25BYmlzOiBGdW5jdGlvbjtcbiAgICBnZXRDb250cmFjdDogRnVuY3Rpb247XG4gICAgc2VyaWFsaXplOiBGdW5jdGlvbjtcbiAgICBkZXNlcmlhbGl6ZTogRnVuY3Rpb247XG4gICAgc2VyaWFsaXplVHJhbnNhY3Rpb246IEZ1bmN0aW9uO1xuICAgIGRlc2VyaWFsaXplVHJhbnNhY3Rpb246IEZ1bmN0aW9uO1xuICAgIHNlcmlhbGl6ZUFjdGlvbnM6IEZ1bmN0aW9uO1xuICAgIGRlc2VyaWFsaXplQWN0aW9uczogRnVuY3Rpb247XG4gICAgZGVzZXJpYWxpemVUcmFuc2FjdGlvbldpdGhBY3Rpb25zOiBGdW5jdGlvbjtcbiAgICB0cmFuc2FjdDogRnVuY3Rpb247XG4gICAgcHVzaFNpZ25lZFRyYW5zYWN0aW9uOiBGdW5jdGlvbjtcbiAgICBoYXNSZXF1aXJlZFRhcG9zRmllbGRzOiBGdW5jdGlvbjsgICAgXG59XG4vKi9cbi8vIGVvc2pzXG5leHBvcnQgaW50ZXJmYWNlIEVPUyB7XG4gICAgZ2V0SW5mbzpGdW5jdGlvbixcbiAgICBnZXRBY2NvdW50OkZ1bmN0aW9uLFxuICAgIGdldENvZGU6RnVuY3Rpb24sXG4gICAgZ2V0Q29kZUhhc2g6RnVuY3Rpb24sXG4gICAgZ2V0QWJpOkZ1bmN0aW9uLFxuICAgIGdldFJhd0NvZGVBbmRBYmk6RnVuY3Rpb24sXG4gICAgYWJpSnNvblRvQmluOkZ1bmN0aW9uLFxuICAgIGFiaUJpblRvSnNvbjpGdW5jdGlvbixcbiAgICBnZXRSZXF1aXJlZEtleXM6RnVuY3Rpb24sXG4gICAgZ2V0QmxvY2s6RnVuY3Rpb24sXG4gICAgZ2V0QmxvY2tIZWFkZXJTdGF0ZTpGdW5jdGlvbixcbiAgICBnZXRUYWJsZVJvd3M6RnVuY3Rpb24sXG4gICAgZ2V0Q3VycmVuY3lCYWxhbmNlOkZ1bmN0aW9uLFxuICAgIGdldEN1cnJlbmN5U3RhdHM6RnVuY3Rpb24sXG4gICAgZ2V0UHJvZHVjZXJzOkZ1bmN0aW9uLFxuICAgIGdldFByb2R1Y2VyU2NoZWR1bGU6RnVuY3Rpb24sXG4gICAgZ2V0U2NoZWR1bGVkVHJhbnNhY3Rpb25zOkZ1bmN0aW9uLFxuICAgIHB1c2hCbG9jazpGdW5jdGlvbixcbiAgICBwdXNoVHJhbnNhY3Rpb246RnVuY3Rpb24sXG4gICAgcHVzaFRyYW5zYWN0aW9uczpGdW5jdGlvbixcbiAgICBnZXRBY3Rpb25zOkZ1bmN0aW9uLFxuICAgIGdldFRyYW5zYWN0aW9uOkZ1bmN0aW9uLFxuICAgIGdldEtleUFjY291bnRzOkZ1bmN0aW9uLFxuICAgIGdldENvbnRyb2xsZWRBY2NvdW50czpGdW5jdGlvbixcbiAgICBjcmVhdGVUcmFuc2FjdGlvbjpGdW5jdGlvbixcbiAgICB0cmFuc2FjdGlvbjpGdW5jdGlvbixcbiAgICBub25jZTpGdW5jdGlvbixcbiAgICB0cmFuc2ZlcjpGdW5jdGlvbixcbiAgICBjcmVhdGU6RnVuY3Rpb24sXG4gICAgaXNzdWU6RnVuY3Rpb24sXG4gICAgYmlkbmFtZTpGdW5jdGlvbixcbiAgICBuZXdhY2NvdW50OkZ1bmN0aW9uLFxuICAgIHNldGNvZGU6RnVuY3Rpb24sXG4gICAgc2V0YWJpOkZ1bmN0aW9uLFxuICAgIHVwZGF0ZWF1dGg6RnVuY3Rpb24sXG4gICAgZGVsZXRlYXV0aDpGdW5jdGlvbixcbiAgICBsaW5rYXV0aDpGdW5jdGlvbixcbiAgICB1bmxpbmthdXRoOkZ1bmN0aW9uLFxuICAgIGNhbmNlbGRlbGF5OkZ1bmN0aW9uLFxuICAgIG9uZXJyb3I6RnVuY3Rpb24sXG4gICAgYnV5cmFtYnl0ZXM6RnVuY3Rpb24sXG4gICAgc2VsbHJhbTpGdW5jdGlvbixcbiAgICBidXlyYW06RnVuY3Rpb24sXG4gICAgZGVsZWdhdGVidzpGdW5jdGlvbixcbiAgICB1bmRlbGVnYXRlYnc6RnVuY3Rpb24sXG4gICAgcmVmdW5kOkZ1bmN0aW9uLFxuICAgIHJlZ3Byb2R1Y2VyOkZ1bmN0aW9uLFxuICAgIHVucmVncHJvZDpGdW5jdGlvbixcbiAgICBzZXRyYW06RnVuY3Rpb24sXG4gICAgcmVncHJveHk6RnVuY3Rpb24sXG4gICAgdm90ZXByb2R1Y2VyOkZ1bmN0aW9uLFxuICAgIGNsYWltcmV3YXJkczpGdW5jdGlvbixcbiAgICBzZXRwcml2OkZ1bmN0aW9uLFxuICAgIHJtdnByb2R1Y2VyOkZ1bmN0aW9uLFxuICAgIHNldGFsaW1pdHM6RnVuY3Rpb24sXG4gICAgc2V0Z2xpbWl0czpGdW5jdGlvbixcbiAgICBzZXRwcm9kczpGdW5jdGlvbixcbiAgICByZXFhdXRoOkZ1bmN0aW9uLFxuICAgIHNldHBhcmFtczpGdW5jdGlvbixcbiAgICBjb250cmFjdDpGdW5jdGlvblxufVxuLy8qL1xuXG5leHBvcnQgaW50ZXJmYWNlIFNjYXR0ZXIge1xuICAgIGlkZW50aXR5OiBhbnksXG4gICAgZW9zSG9vazogRnVuY3Rpb247XG4gICAgZW9zPzpGdW5jdGlvbixcbiAgICBuZXR3b3JrOiBhbnk7XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBcbiAgICBmb3Jnb3R0ZW4/OmJvb2xlYW4sIC8vIHdhcyBmb3JnZXRJZGVudGl0eSBleGVjdXRlZD9cbiAgICBcbiAgICBpc0V4dGVuc2lvbjogYm9vbGVhbixcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuICAgIGF1dGhlbnRpY2F0ZTogRnVuY3Rpb24sXG4gICAgY29ubmVjdDogRnVuY3Rpb24sXG4gICAgY29uc3RydWN0b3I6IEZ1bmN0aW9uLFxuICAgIGNyZWF0ZVRyYW5zYWN0aW9uOiBGdW5jdGlvbixcbiAgICBkaXNjb25uZWN0OiBGdW5jdGlvbixcbiAgICBmb3JnZXRJZGVudGl0eTogRnVuY3Rpb24sXG4gICAgZ2V0QXJiaXRyYXJ5U2lnbmF0dXJlOiBGdW5jdGlvbixcbiAgICBnZXRJZGVudGl0eTogRnVuY3Rpb24sXG4gICAgZ2V0SWRlbnRpdHlGcm9tUGVybWlzc2lvbnM6IEZ1bmN0aW9uLFxuICAgIGdldFB1YmxpY0tleTogRnVuY3Rpb24sXG4gICAgZ2V0VmVyc2lvbjogRnVuY3Rpb24sXG4gICAgaGFzQWNjb3VudEZvcjogRnVuY3Rpb24sXG4gICAgaXNDb25uZWN0ZWQ6IEZ1bmN0aW9uLFxuICAgIGlzUGFpcmVkOiBGdW5jdGlvbixcbiAgICBsaW5rQWNjb3VudDogRnVuY3Rpb24sXG4gICAgbG9hZFBsdWdpbjogRnVuY3Rpb24sXG4gICAgcmVxdWVzdFNpZ25hdHVyZTogRnVuY3Rpb24sXG4gICAgcmVxdWVzdFRyYW5zZmVyOiBGdW5jdGlvbixcbiAgICBzdWdnZXN0TmV0d29yazogRnVuY3Rpb25cbn1cblxuZXhwb3J0IGludGVyZmFjZSBBY2NvdW50RGF0YSB7XG4gICAgYWNjb3VudF9uYW1lPzogc3RyaW5nLFxuICAgIGhlYWRfYmxvY2tfbnVtPzogbnVtYmVyLFxuICAgIGhlYWRfYmxvY2tfdGltZT86IHN0cmluZyxcbiAgICBwcml2aWxlZ2VkPzogZmFsc2UsXG4gICAgbGFzdF9jb2RlX3VwZGF0ZT86IHN0cmluZyxcbiAgICBjcmVhdGVkPzogc3RyaW5nLFxuICAgIGNvcmVfbGlxdWlkX2JhbGFuY2U/OiBzdHJpbmcsXG4gICAgY29yZV9saXF1aWRfYmFsYW5jZV9hc3NldD86IEFzc2V0LFxuICAgIHJhbV9xdW90YT86IG51bWJlcixcbiAgICBuZXRfd2VpZ2h0PzogbnVtYmVyLFxuICAgIGNwdV93ZWlnaHQ/OiBudW1iZXIsXG4gICAgdG90YWxfYmFsYW5jZTogc3RyaW5nLFxuICAgIHRvdGFsX2JhbGFuY2VfYXNzZXQ6IEFzc2V0LFxuICAgIHJhbV9saW1pdD86IHtcbiAgICAgICAgcGVyY2VudFN0cj86IHN0cmluZyxcbiAgICAgICAgdXNlZD86IG51bWJlcixcbiAgICAgICAgYXZhaWxhYmxlPzogbnVtYmVyLFxuICAgICAgICBtYXg/OiBudW1iZXJcbiAgICB9LFxuICAgIG5ldF9saW1pdD86IHtcbiAgICAgICAgcGVyY2VudFN0cj86IHN0cmluZyxcbiAgICAgICAgdXNlZD86IG51bWJlcixcbiAgICAgICAgYXZhaWxhYmxlPzogbnVtYmVyLFxuICAgICAgICBtYXg/OiBudW1iZXJcbiAgICB9LFxuICAgIGNwdV9saW1pdD86IHtcbiAgICAgICAgcGVyY2VudFN0cj86IHN0cmluZyxcbiAgICAgICAgdXNlZD86IG51bWJlcixcbiAgICAgICAgYXZhaWxhYmxlPzogbnVtYmVyLFxuICAgICAgICBtYXg/OiBudW1iZXJcbiAgICB9LFxuICAgIHJhbV91c2FnZT86IG51bWJlcixcbiAgICBwZXJtaXNzaW9ucz86IHtcbiAgICAgICAgcGVybV9uYW1lPzogc3RyaW5nLFxuICAgICAgICBwYXJlbnQ/OiBzdHJpbmcsXG4gICAgICAgIHJlcXVpcmVkX2F1dGg/OiB7XG4gICAgICAgICAgICB0aHJlc2hvbGQ/OiAxLFxuICAgICAgICAgICAga2V5cz86IHtcbiAgICAgICAgICAgICAgICBrZXk/OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgd2VpZ2h0PzogMVxuICAgICAgICAgICAgfVtdLFxuICAgICAgICAgICAgYWNjb3VudHM/OiBhbnlbXSxcbiAgICAgICAgICAgIHdhaXRzPzogYW55W11cbiAgICAgICAgfVxuICAgIH1bXSxcbiAgICB0b3RhbF9yZXNvdXJjZXM/OiB7XG4gICAgICAgIG93bmVyPzogc3RyaW5nLFxuICAgICAgICBuZXRfd2VpZ2h0Pzogc3RyaW5nLFxuICAgICAgICBuZXRfd2VpZ2h0X2Fzc2V0PzogQXNzZXQsXG4gICAgICAgIGNwdV93ZWlnaHQ/OiBzdHJpbmcsXG4gICAgICAgIGNwdV93ZWlnaHRfYXNzZXQ/OiBBc3NldCxcbiAgICAgICAgcmFtX2J5dGVzPzogbnVtYmVyXG4gICAgfSxcbiAgICBzZWxmX2RlbGVnYXRlZF9iYW5kd2lkdGg/OiB7XG4gICAgICAgIGZyb20/OiBzdHJpbmcsXG4gICAgICAgIHRvPzogc3RyaW5nLFxuICAgICAgICB0b3RhbD86IHN0cmluZyxcbiAgICAgICAgdG90YWxfYXNzZXQ/OiBBc3NldCxcbiAgICAgICAgbmV0X3dlaWdodD86IHN0cmluZyxcbiAgICAgICAgbmV0X3dlaWdodF9hc3NldD86IEFzc2V0LFxuICAgICAgICBjcHVfd2VpZ2h0Pzogc3RyaW5nLFxuICAgICAgICBjcHVfd2VpZ2h0X2Fzc2V0PzogQXNzZXQsXG4gICAgfSxcbiAgICByZWZ1bmRfcmVxdWVzdD86IHtcbiAgICAgICAgb3duZXI/OiBzdHJpbmcsXG4gICAgICAgIHJlcXVlc3RfdGltZT86IHN0cmluZyxcbiAgICAgICAgdG90YWw/OiBzdHJpbmcsXG4gICAgICAgIHRvdGFsX2Fzc2V0PzogQXNzZXQsXG4gICAgICAgIG5ldF9hbW91bnQ/OiBzdHJpbmcsXG4gICAgICAgIG5ldF9hbW91bnRfYXNzZXQ/OiBBc3NldCxcbiAgICAgICAgY3B1X2Ftb3VudD86IHN0cmluZyxcbiAgICAgICAgY3B1X2Ftb3VudF9hc3NldD86IEFzc2V0XG4gICAgfSxcbiAgICB2b3Rlcl9pbmZvPzoge1xuICAgICAgICBvd25lcj86IHN0cmluZyxcbiAgICAgICAgcHJveHk/OiBzdHJpbmcsXG4gICAgICAgIHByb2R1Y2Vycz86IHN0cmluZ1tdLFxuICAgICAgICBzdGFrZWQ/OiBudW1iZXIsXG4gICAgICAgIGxhc3Rfdm90ZV93ZWlnaHQ/OiBzdHJpbmcsXG4gICAgICAgIHByb3hpZWRfdm90ZV93ZWlnaHQ/OiBzdHJpbmcsXG4gICAgICAgIGlzX3Byb3h5PzogbnVtYmVyXG4gICAgfSxcbiAgICByZXR1cm5lZEZpZWxkcz86IG51bGxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBY2NvdW50IHtcbiAgICBhdXRob3JpdHk/OiBzdHJpbmcsXG4gICAgYmxvY2tjaGFpbj86IHN0cmluZyxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgcHVibGljS2V5Pzogc3RyaW5nLFxuICAgIGRhdGE/OiBBY2NvdW50RGF0YVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEVuZHBvaW50IHtcbiAgICBwcm90b2NvbDpzdHJpbmcsXG4gICAgaG9zdDpzdHJpbmcsXG4gICAgcG9ydDpudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFb3Njb25mIHtcbiAgICBibG9ja2NoYWluOnN0cmluZyxcbiAgICBwcm90b2NvbDpzdHJpbmcsXG4gICAgaG9zdDpzdHJpbmcsXG4gICAgcG9ydDpudW1iZXIsXG4gICAgY2hhaW5JZDpzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBOZXR3b3JrIHtcbiAgICBzbHVnPzogc3RyaW5nLFxuICAgIGluZGV4PzogbnVtYmVyLFxuICAgIGVvc2NvbmY/OiBFb3Njb25mLFxuICAgIGV4cGxvcmVyPzogc3RyaW5nLFxuICAgIHN5bWJvbDogc3RyaW5nLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBjaGFpbklkOnN0cmluZyxcbiAgICBlbmRwb2ludHM6IEVuZHBvaW50W11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBOZXR3b3JrTWFwIHtcbiAgICBba2V5OnN0cmluZ106TmV0d29ya1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBTY2F0dGVySlNEZWYge1xuICAgIHBsdWdpbnM/OmFueSxcbiAgICBzY2F0dGVyPzphbnlcbn1cblxuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogXCJyb290XCJcbn0pXG5leHBvcnQgY2xhc3MgVmFwYWVlU2NhdHRlciB7XG4gICAgXG4gICAgcHJpdmF0ZSBzY2F0dGVydXRpbHMgPSBuZXcgU2NhdHRlclV0aWxzKCk7XG4gICAgcHVibGljIGVycm9yOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBhcHBUaXRsZTogc3RyaW5nO1xuICAgIHByaXZhdGUgc3ltYm9sOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfY29ubmVjdGVkOiBib29sZWFuO1xuICAgIHByaXZhdGUgbGliOiBTY2F0dGVyO1xuICAgIHByaXZhdGUgcnBjOiBSUEM7IC8vIGVvc2pzMlxuICAgIHB1YmxpYyBmZWVkOiBGZWVkYmFjaztcbiAgICBwcml2YXRlIFNjYXR0ZXJKUzogU2NhdHRlckpTRGVmO1xuICAgIHByaXZhdGUgX25ldHdvcms6IE5ldHdvcms7XG4gICAgcHJpdmF0ZSBfbmV0d29ya3M6IE5ldHdvcmtNYXA7XG4gICAgcHJpdmF0ZSBfbmV0d29ya3Nfc2x1Z3M6IHN0cmluZ1tdO1xuICAgIHByaXZhdGUgX2FjY291bnRfcXVlcmllczoge1trZXk6c3RyaW5nXTpQcm9taXNlPEFjY291bnREYXRhPn07XG4gICAgcHJpdmF0ZSBlb3M6IEVPUztcbiAgICBwdWJsaWMgb25OZXR3b3JrQ2hhbmdlOlN1YmplY3Q8TmV0d29yaz4gPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBvbkxvZ2dnZWRTdGF0ZUNoYW5nZTpTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IFN1YmplY3QoKTtcbiAgICBwdWJsaWMgX2FjY291bnQ6IEFjY291bnQ7XG4gICAgcHJpdmF0ZSBzZXRSZWFkeTogRnVuY3Rpb247XG4gICAgcHVibGljIHdhaXRSZWFkeTogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRSZWFkeSA9IHJlc29sdmU7XG4gICAgfSk7XG4gICAgcHJpdmF0ZSBzZXRMb2dnZWQ6IEZ1bmN0aW9uO1xuICAgIHB1YmxpYyB3YWl0TG9nZ2VkOiBQcm9taXNlPGFueT4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0aGlzLnNldExvZ2dlZCA9IHJlc29sdmU7XG4gICAgfSk7XG4gICAgcHJpdmF0ZSBzZXRDb25uZWN0ZWQ6IEZ1bmN0aW9uO1xuICAgIHB1YmxpYyB3YWl0Q29ubmVjdGVkOiBQcm9taXNlPGFueT4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0aGlzLnNldENvbm5lY3RlZCA9IHJlc29sdmU7XG4gICAgfSk7XG4gICAgcHJpdmF0ZSBzZXRFb3NqczogRnVuY3Rpb247XG4gICAgcHVibGljIHdhaXRFb3NqczogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5zZXRFb3NqcyA9IHJlc29sdmU7XG4gICAgfSk7XG4gICAgcHJpdmF0ZSBzZXRFbmRwb2ludHNSZWFkeTogRnVuY3Rpb247XG4gICAgcHVibGljIHdhaXRFbmRwb2ludHM6IFByb21pc2U8YW55PiA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0RW5kcG9pbnRzUmVhZHkgPSByZXNvbHZlO1xuICAgIH0pOyAgICBcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihcbiAgICApIHtcbiAgICAgICAgdGhpcy5mZWVkID0gbmV3IEZlZWRiYWNrKCk7XG4gICAgICAgIHRoaXMuX25ldHdvcmtzX3NsdWdzID0gW107XG4gICAgICAgIHRoaXMuX25ldHdvcmtzID0ge307XG4gICAgICAgIHRoaXMuX25ldHdvcmsgPSB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJFT1MgTWFpbk5ldFwiLFxuICAgICAgICAgICAgXCJzeW1ib2xcIjogXCJFT1NcIixcbiAgICAgICAgICAgIFwiZXhwbG9yZXJcIjogXCJodHRwczovL3d3dy5ibG9rcy5pb1wiLFxuICAgICAgICAgICAgXCJjaGFpbklkXCI6XCJhY2EzNzZmMjA2YjhmYzI1YTZlZDQ0ZGJkYzY2NTQ3YzM2YzZjMzNlM2ExMTlmZmJlYWVmOTQzNjQyZjBlOTA2XCIsXG4gICAgICAgICAgICBcImVuZHBvaW50c1wiOiBbe1xuICAgICAgICAgICAgICAgIFwicHJvdG9jb2xcIjpcImh0dHBzXCIsXG4gICAgICAgICAgICAgICAgXCJob3N0XCI6XCJub2Rlcy5nZXQtc2NhdHRlci5jb21cIixcbiAgICAgICAgICAgICAgICBcInBvcnRcIjo0NDNcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICB0aGlzLnN5bWJvbCA9IFwiRU9TXCI7XG4gICAgICAgIC8vIHRoaXMud2FpdFJlYWR5LnRoZW4oKCkgPT4gY29uc29sZS5sb2coXCJTY2F0dGVyU2VydmljZS5zZXRSZWFkeSgpXCIpKTtcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcihcInNjYXR0ZXIgaW50ZXJydW1waWRvIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5fYWNjb3VudF9xdWVyaWVzID0ge307XG4gICAgfVxuXG4gICAgZ2V0IHV0aWxzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2F0dGVydXRpbHM7XG4gICAgfVxuXG4gICAgLy8gQWNvdW50LCBJZGVudGl0eSBhbmQgYXV0aGVudGljYXRpb24gLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgYWNjb3VudCgpOiBBY2NvdW50IHtcbiAgICAgICAgaWYgKCF0aGlzLl9hY2NvdW50IHx8ICF0aGlzLl9hY2NvdW50Lm5hbWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpYiAmJiB0aGlzLmxpYi5pZGVudGl0eSAmJiB0aGlzLmxpYi5pZGVudGl0eS5hY2NvdW50cykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FjY291bnQgPSB0aGlzLmxpYi5pZGVudGl0eS5hY2NvdW50cy5maW5kKHggPT4geC5ibG9ja2NoYWluID09PSBcImVvc1wiIHx8IHguYmxvY2tjaGFpbiA9PT0gXCJ0bG9zXCIpO1xuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FjY291bnQ7XG4gICAgfVxuXG4gICAgZ2V0IGRlZmF1bHQoKTogQWNjb3VudCB7XG4gICAgICAgIC8vIGRlZmF1bHQgZGF0YSBiZWZvcmUgbG9hZGluZyBkYXRhXG4gICAgICAgIC8vIFRPRE86IGZpbGwgb3V0IHdpdGggYmV0dGVyIGRlZmF1bHQgZGF0YS5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6J2d1ZXN0JyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICB0b3RhbF9iYWxhbmNlOiBcIlwiLFxuICAgICAgICAgICAgICAgIHRvdGFsX2JhbGFuY2VfYXNzZXQ6IG5ldyBBc3NldCgpLFxuICAgICAgICAgICAgICAgIGNwdV9saW1pdDoge30sXG4gICAgICAgICAgICAgICAgbmV0X2xpbWl0OiB7fSxcbiAgICAgICAgICAgICAgICByYW1fbGltaXQ6IHt9LFxuICAgICAgICAgICAgICAgIHJlZnVuZF9yZXF1ZXN0OiB7fSxcbiAgICAgICAgICAgICAgICB0b3RhbF9yZXNvdXJjZXM6IHt9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldElkZW50aXR5KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNjYXR0ZXJTZXJ2aWNlLnJlc2V0SWRlbnRpdHkoKVwiKTtcbiAgICAgICAgdGhpcy5lcnJvciA9IFwiXCI7XG4gICAgICAgIGlmICh0aGlzLmxpYikge1xuICAgICAgICAgICAgdGhpcy5saWIuaWRlbnRpdHkgPSBudWxsO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxpYi5mb3Jnb3R0ZW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpYi5mb3Jnb3R0ZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubGliLmZvcmdldElkZW50aXR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vbkxvZ2dnZWRTdGF0ZUNoYW5nZS5uZXh0KHRydWUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0SWRlbnRpdHkoaWRlbnRpdHk6YW55KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2NhdHRlclNlcnZpY2Uuc2V0SWRlbnRpdHkoKVwiLCBbaWRlbnRpdHldKTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoISF0aGlzLmxpYiwgXCJFUlJPUjogbm8gaW5zdGFuY2Ugb2Ygc2NhdHRlciBmb3VuZFwiKTtcbiAgICAgICAgdGhpcy5lcnJvciA9IFwiXCI7XG4gICAgICAgIHRoaXMubGliLmlkZW50aXR5ID0gaWRlbnRpdHk7XG4gICAgICAgIHRoaXMubGliLmZvcmdvdHRlbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9hY2NvdW50ID0gdGhpcy5saWIuaWRlbnRpdHkuYWNjb3VudHMuZmluZCh4ID0+IHguYmxvY2tjaGFpbiA9PT0gXCJlb3NcIiB8fCB4LmJsb2NrY2hhaW4gPT09IFwidGxvc1wiKTtcbiAgICAgICAgaWYgKCF0aGlzLmFjY291bnQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJTY2F0dGVyU2VydmljZS5zZXRJZGVudGl0eSgpXCIsIFtpZGVudGl0eV0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2NhdHRlclNlcnZpY2Uuc2V0SWRlbnRpdHkoKSAtPiBTY2F0dGVyU2VydmljZS5xdWVyeUFjY291bnREYXRhKCkgOiBcIiAsIFt0aGlzLmFjY291bnQubmFtZV0pO1xuICAgICAgICB0aGlzLnF1ZXJ5QWNjb3VudERhdGEodGhpcy5hY2NvdW50Lm5hbWUpLnRoZW4oYWNjb3VudCA9PiB7XG4gICAgICAgICAgICB0aGlzLmFjY291bnQuZGF0YSA9IGFjY291bnQ7XG4gICAgICAgICAgICB0aGlzLm9uTG9nZ2dlZFN0YXRlQ2hhbmdlLm5leHQodHJ1ZSk7XG4gICAgICAgIH0pLmNhdGNoKF8gPT4ge1xuICAgICAgICAgICAgdGhpcy5hY2NvdW50LmRhdGEgPSB0aGlzLmRlZmF1bHQuZGF0YTtcbiAgICAgICAgICAgIHRoaXMub25Mb2dnZ2VkU3RhdGVDaGFuZ2UubmV4dCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSAgICBcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBOZXR3b3JrcyAoZW9zaW8gYmxvY2tjaGFpbnMpICYgRW5kcG9pbnRzIC0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcHVibGljIHNldEVuZHBvaW50cyhlbmRwb2ludHM6IE5ldHdvcmtNYXApIHtcbiAgICAgICAgdGhpcy5fbmV0d29ya3MgPSBlbmRwb2ludHMgfHwgdGhpcy5fbmV0d29ya3M7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5fbmV0d29ya3MpIHtcbiAgICAgICAgICAgIHRoaXMuX25ldHdvcmtzX3NsdWdzLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRFbmRwb2ludHNSZWFkeSgpO1xuICAgIH1cblxuICAgIHNldE5ldHdvcmsobmFtZTpzdHJpbmcsIGluZGV4OiBudW1iZXIgPSAwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2NhdHRlclNlcnZpY2Uuc2V0TmV0d29yayhcIituYW1lK1wiLFwiK2luZGV4K1wiKVwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdEVuZHBvaW50cy50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHZhciBuID0gdGhpcy5nZXROZXR3b3JrKG5hbWUsIGluZGV4KTtcbiAgICAgICAgICAgIGlmIChuKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX25ldHdvcmsubmFtZSAhPSBuLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmV0d29yayA9IG47XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRJZGVudGl0eSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRTY2F0dGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25OZXR3b3JrQ2hhbmdlLm5leHQodGhpcy5nZXROZXR3b3JrKG5hbWUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjogU2NhdHRlci5zZXROZXR3b3JrKCkgdW5rbm93biBuZXR3b3JrIG5hbWUtaW5kZXguIEdvdCAoXCJcbiAgICAgICAgICAgICAgICAgICAgKyBuYW1lICsgXCIsIFwiICsgaW5kZXggKyBcIikuIEF2YWlsYWJsZXMgYXJlOlwiLCB0aGlzLl9uZXR3b3Jrcyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhbGxpbmcgYmFjayB0byBlb3MgbWFpbm5ldFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXROZXR3b3JrKFwiZW9zXCIpO1xuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0TmV0d29yayhzbHVnOnN0cmluZywgaW5kZXg6IG51bWJlciA9IDApOiBOZXR3b3JrIHtcbiAgICAgICAgaWYgKHRoaXMuX25ldHdvcmtzW3NsdWddKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbmV0d29ya3Nbc2x1Z10uZW5kcG9pbnRzLmxlbmd0aCA+IGluZGV4ICYmIGluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV0d29yazogTmV0d29yayA9IHRoaXMuX25ldHdvcmtzW3NsdWddO1xuICAgICAgICAgICAgICAgIHZhciBlbmRwb2ludDpFbmRwb2ludCA9IG5ldHdvcmsuZW5kcG9pbnRzW2luZGV4XTtcbiAgICAgICAgICAgICAgICBuZXR3b3JrLnNsdWcgPSBzbHVnO1xuICAgICAgICAgICAgICAgIG5ldHdvcmsuaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICBuZXR3b3JrLmVvc2NvbmYgPSB7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrY2hhaW46IFwiZW9zXCIsXG4gICAgICAgICAgICAgICAgICAgIGNoYWluSWQ6IG5ldHdvcmsuY2hhaW5JZCxcbiAgICAgICAgICAgICAgICAgICAgaG9zdDogZW5kcG9pbnQuaG9zdCxcbiAgICAgICAgICAgICAgICAgICAgcG9ydDogZW5kcG9pbnQucG9ydCxcbiAgICAgICAgICAgICAgICAgICAgcHJvdG9jb2w6IGVuZHBvaW50LnByb3RvY29sLFxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldHdvcms7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjogU2NhdHRlci5nZXROZXR3b3JrKCkgaW5kZXggb3V0IG9mIHJhbmdlLiBHb3QgXCJcbiAgICAgICAgICAgICAgICAgICAgKyBpbmRleCArIFwiIGV4cGVjdGVkIG51bWJlciBiZXR3ZWVuIFswLi5cIit0aGlzLl9uZXR3b3Jrc1tzbHVnXS5lbmRwb2ludHMubGVuZ3RoK1wiXVwiLCApO1xuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVSUk9SOiBTY2F0dGVyLmdldE5ldHdvcmsoKSB1bmtub3duIG5ldHdvcmsgc2x1Zy4gR290IFwiXG4gICAgICAgICAgICAgICAgKyBzbHVnICsgXCIgZXhwZWN0ZWQgb25lIG9mXCIsIHRoaXMubmV0d29ya3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldCBuZXR3b3Jrcygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fbmV0d29ya3Nfc2x1Z3M7XG4gICAgfVxuXG4gICAgZ2V0IG5ldHdvcmsoKTogTmV0d29yayB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uZXR3b3JrO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVzZXRQcm9taXNlcygpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlNjYXR0ZXJTZXJ2aWNlLnJlc2V0UHJvbWlzZXMoKVwiKTtcbiAgICAgICAgdGhpcy53YWl0RW9zanMudGhlbihyID0+IHtcbiAgICAgICAgICAgIHRoaXMud2FpdEVvc2pzID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBwID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53YWl0RW9zanMpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLndhaXRFb3NqcyA9IHA7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFb3NqcyA9IHJlc29sdmU7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldFByb21pc2VzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMud2FpdENvbm5lY3RlZC50aGVuKHIgPT4ge1xuICAgICAgICAgICAgdGhpcy53YWl0Q29ubmVjdGVkID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBwID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53YWl0Q29ubmVjdGVkKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy53YWl0Q29ubmVjdGVkID0gcDtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENvbm5lY3RlZCA9IHJlc29sdmU7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldFByb21pc2VzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMud2FpdFJlYWR5LnRoZW4ociA9PiB7XG4gICAgICAgICAgICB0aGlzLndhaXRSZWFkeSA9IG51bGw7XG4gICAgICAgICAgICB2YXIgcCA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMud2FpdFJlYWR5KSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy53YWl0UmVhZHkgPSBwO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0UmVhZHkgPSByZXNvbHZlO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRQcm9taXNlcygpO1xuICAgICAgICAgICAgICAgIC8vdGhpcy53YWl0UmVhZHkudGhlbigoKSA9PiBjb25zb2xlLmxvZyhcIlNjYXR0ZXJTZXJ2aWNlLnNldFJlYWR5KClcIikpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy53YWl0TG9nZ2VkLnRoZW4ociA9PiB7XG4gICAgICAgICAgICB0aGlzLndhaXRMb2dnZWQgPSBudWxsO1xuICAgICAgICAgICAgdmFyIHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLndhaXRMb2dnZWQpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLndhaXRMb2dnZWQgPSBwO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TG9nZ2VkID0gcmVzb2x2ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0UHJvbWlzZXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2NhdHRlciBpbml0aWFsaXphdGlvbiBhbmQgQXBwQ29ubmVjdGlvbiAtLS0tLS0tLS0tLS0tLS0tLVxuICAgIGluaXRTY2F0dGVyKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNjYXR0ZXJTZXJ2aWNlLmluaXRTY2F0dGVyKClcIik7XG4gICAgICAgIC8qL1xuICAgICAgICAvLyBlb3NqczJcbiAgICAgICAgdGhpcy5lcnJvciA9IFwiXCI7XG4gICAgICAgIGlmICgoPGFueT53aW5kb3cpLlNjYXR0ZXJKUykge1xuICAgICAgICAgICAgdGhpcy5TY2F0dGVySlMgPSAoPGFueT53aW5kb3cpLlNjYXR0ZXJKUztcbiAgICAgICAgICAgICg8YW55PndpbmRvdykuU2NhdHRlckpTID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBTY2F0dGVySlMucGx1Z2lucyggbmV3IFNjYXR0ZXJFT1MoKSApO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRVJST1I6XCIsIGUubWVzc2FnZSwgW2VdKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWxsaW5nIGJhY2sgdG8gbm9ybWFsIFNjYXR0ZXJFT1MgcGx1Z2luXCIpO1xuICAgICAgICAgICAgU2NhdHRlckpTLnBsdWdpbnMoIG5ldyBTY2F0dGVyRU9TKCkgKTtcbiAgICAgICAgfVxuICAgICAgICAgXG4gICAgICAgIHRoaXMubGliID0gU2NhdHRlckpTLnNjYXR0ZXI7XG5cbiAgICAgICAgY29uc3QgbmV0d29yayA9IFNjYXR0ZXJKUy5OZXR3b3JrLmZyb21Kc29uKHRoaXMubmV0d29yay5lb3Njb25mKTtcbiAgICAgICAgdGhpcy5ycGMgPSBuZXcgSnNvblJwYyhuZXR3b3JrLmZ1bGxob3N0KCkpO1xuICAgICAgICB0aGlzLmVvcyA9IHRoaXMubGliLmVvcyhuZXR3b3JrLCBBcGksIHtycGM6dGhpcy5ycGN9KTtcblxuICAgICAgICB0aGlzLnNldEVvc2pzKFwiZW9zanNcIik7XG4gICAgICAgIC8qL1xuICAgICAgICAvLyBlb3Nqc1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNjYXR0ZXJTZXJ2aWNlLmluaXRTY2F0dGVyKClcIik7XG4gICAgICAgIHRoaXMuZXJyb3IgPSBcIlwiO1xuICAgICAgICBpZiAoKDxhbnk+d2luZG93KS5TY2F0dGVySlMpIHtcbiAgICAgICAgICAgIHRoaXMuU2NhdHRlckpTID0gKDxhbnk+d2luZG93KS5TY2F0dGVySlM7XG4gICAgICAgICAgICB0aGlzLlNjYXR0ZXJKUy5wbHVnaW5zKCBuZXcgU2NhdHRlckVPUygpICk7XG4gICAgICAgICAgICB0aGlzLmxpYiA9IHRoaXMuU2NhdHRlckpTLnNjYXR0ZXI7ICBcbiAgICAgICAgICAgICg8YW55PndpbmRvdykuU2NhdHRlckpTID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIkVPU0pTKClcIixbdGhpcy5uZXR3b3JrLmVvc2NvbmZdKTtcbiAgICAgICAgdGhpcy5lb3MgPSB0aGlzLmxpYi5lb3ModGhpcy5uZXR3b3JrLmVvc2NvbmYsIEVvcywgeyBleHBpcmVJblNlY29uZHM6NjAgfSk7XG4gICAgICAgIHRoaXMuc2V0RW9zanMoXCJlb3Nqc1wiKTtcbiAgICAgICAgLy8qL1xuICAgIH1cblxuICAgIHJlY29ubmVjdFRpbWVyO1xuICAgIHJlY29ubmVjdFRpbWUgPSAxMDA7XG4gICAgcmV0cnlDb25uZWN0aW5nQXBwKCkge1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMucmVjb25uZWN0VGltZXIpO1xuICAgICAgICB0aGlzLnJlY29ubmVjdFRpbWVyID0gc2V0SW50ZXJ2YWwoXyA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNjYXR0ZXJTZXJ2aWNlLnJlY29ubmVjdFRpbWVyKClcIik7XG4gICAgICAgICAgICBpZiAodGhpcy5fY29ubmVjdGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihcIlNjYXR0ZXJTZXJ2aWNlLnJldHJ5Q29ubmVjdGluZ0FwcCgpIGxpbXBpbyBlbCBpbnRlcnZhbG9cIik7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnJlY29ubmVjdFRpbWVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYWNjb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKFwiU2NhdHRlclNlcnZpY2UucmV0cnlDb25uZWN0aW5nQXBwKCkgIGV4aXN0ZSBhY2NvdW50IHBlcm8gbm8gZXN0w4PCoSBjb25lY3RhZG9cIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdEFwcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSx0aGlzLnJlY29ubmVjdFRpbWUpO1xuICAgICAgICB0aGlzLnJlY29ubmVjdFRpbWUgKz0gMTAwMCpNYXRoLnJhbmRvbSgpO1xuICAgICAgICBpZiAodGhpcy5yZWNvbm5lY3RUaW1lID4gNDAwMCkgdGhpcy5yZWNvbm5lY3RUaW1lID0gNDAwMDtcbiAgICB9XG5cbiAgICBjb25uZWN0QXBwKGFwcFRpdGxlOnN0cmluZyA9IFwiXCIpIHtcbiAgICAgICAgLy8gdGhpcy5jb25uZWN0X2NvdW50Kys7XG4gICAgICAgIC8vIHZhciByZXNvbHZlX251bSA9IHRoaXMuY29ubmVjdF9jb3VudDtcbiAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjb25uZWN0XCIsIHRydWUpO1xuICAgICAgICBpZiAoYXBwVGl0bGUgIT0gXCJcIikgdGhpcy5hcHBUaXRsZSA9IGFwcFRpdGxlO1xuICAgICAgICBjb25zb2xlLmxvZyhgU2NhdHRlclNlcnZpY2UuY29ubmVjdEFwcCgke3RoaXMuYXBwVGl0bGV9KWApO1xuICAgICAgICBjb25zdCBjb25uZWN0aW9uT3B0aW9ucyA9IHtpbml0VGltZW91dDoxODAwfVxuICAgICAgICBpZiAodGhpcy5fY29ubmVjdGVkKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7IC8vIDwtLS0tIGF2b2lkcyBhIGxvb3BcbiAgICAgICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMud2FpdENvbm5lY3RlZC50aGVuKHJlc29sdmUpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3RlZCkgcmV0dXJuOyAvLyA8LS0tLSBhdm9pZHMgYSBsb29wXG4gICAgICAgICAgICB0aGlzLndhaXRFb3Nqcy50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNjYXR0ZXJTZXJ2aWNlLndhaXRFb3NqcygpIGVvcyBPS1wiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxpYi5jb25uZWN0KHRoaXMuYXBwVGl0bGUsIGNvbm5lY3Rpb25PcHRpb25zKS50aGVuKGNvbm5lY3RlZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNpIGVzdMODwqEgbG9ndWVhZG8gdGhpcy5saWIuaWRlbnRpdHkgc2UgY2FyZ2Egc8ODwrNsbyB5IHlhIGVzdMODwqEgZGlzcG9uaWJsZVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNjYXR0ZXJTZXJ2aWNlLmxpYi5jb25uZWN0KClcIiwgY29ubmVjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29ubmVjdGVkID0gY29ubmVjdGVkO1xuICAgICAgICAgICAgICAgICAgICBpZighY29ubmVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZlZWQuc2V0RXJyb3IoXCJjb25uZWN0XCIsIFwiRVJST1I6IGNhbiBub3QgY29ubmVjdCB0byBTY2F0dGVyLiBJcyBpdCB1cCBhbmQgcnVubmluZz9cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHRoaXMuZmVlZC5lcnJvcihcImNvbm5lY3RcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHRoaXMuZmVlZC5lcnJvcihcImNvbm5lY3RcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJjb25uZWN0XCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmV0cnlDb25uZWN0aW5nQXBwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGEgcHJveHkgcmVmZXJlbmNlIHRvIGVvc2pzIHdoaWNoIHlvdSBjYW4gdXNlIHRvIHNpZ24gdHJhbnNhY3Rpb25zIHdpdGggYSB1c2VyJ3MgU2NhdHRlci5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTY2F0dGVyU2VydmljZS5zZXRDb25uZWN0ZWQoKVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRDb25uZWN0ZWQoXCJjb25uZWN0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY29ubmVjdFwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmxvZ2dlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dpbigpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2NhdHRlclNlcnZpY2Uuc2V0UmVhZHkoKVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFJlYWR5KFwicmVhZHlcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTY2F0dGVyU2VydmljZS5zZXRSZWFkeSgpXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRSZWFkeShcInJlYWR5XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwiY29ubmVjdFwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICAgICAgfSk7ICAgIFxuICAgICAgICAgICAgfSk7ICAgIFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQWNjb3VudERhdGEgYW5kIEJhbGFuY2VzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNhbGN1bGF0ZVRvdGFsQmFsYW5jZShhY2NvdW50KSB7XG4gICAgICAgIHJldHVybiBuZXcgQXNzZXQoXCIwLjAwMDAgXCIgKyB0aGlzLnN5bWJvbClcbiAgICAgICAgICAgIC5wbHVzKGFjY291bnQuY29yZV9saXF1aWRfYmFsYW5jZV9hc3NldClcbiAgICAgICAgICAgIC5wbHVzKGFjY291bnQucmVmdW5kX3JlcXVlc3QubmV0X2Ftb3VudF9hc3NldClcbiAgICAgICAgICAgIC5wbHVzKGFjY291bnQucmVmdW5kX3JlcXVlc3QuY3B1X2Ftb3VudF9hc3NldClcbiAgICAgICAgICAgIC5wbHVzKGFjY291bnQuc2VsZl9kZWxlZ2F0ZWRfYmFuZHdpZHRoLmNwdV93ZWlnaHRfYXNzZXQpXG4gICAgICAgICAgICAucGx1cyhhY2NvdW50LnNlbGZfZGVsZWdhdGVkX2JhbmR3aWR0aC5uZXRfd2VpZ2h0X2Fzc2V0KTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVSZXNvdXJjZUxpbWl0KGxpbWl0KSB7XG4gICAgICAgIGxpbWl0ID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICBtYXg6IDAsIHVzZWQ6IDBcbiAgICAgICAgfSwgbGltaXQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGxpbWl0Lm1heCAhPSAwKSB7XG4gICAgICAgICAgICBsaW1pdC5wZXJjZW50ID0gMSAtIChNYXRoLm1pbihsaW1pdC51c2VkLCBsaW1pdC5tYXgpIC8gbGltaXQubWF4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpbWl0LnBlcmNlbnQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGxpbWl0LnBlcmNlbnRTdHIgPSBNYXRoLnJvdW5kKGxpbWl0LnBlcmNlbnQqMTAwKSArIFwiJVwiO1xuICAgICAgICByZXR1cm4gbGltaXQ7XG4gICAgfVxuXG4gICAgcXVlcnlBY2NvdW50RGF0YShuYW1lOnN0cmluZyk6IFByb21pc2U8QWNjb3VudERhdGE+IHtcbiAgICAgICAgLypcbiAgICAgICAgLy8gZ2V0X3RhYmxlX3Jvd3NcbiAgICAgICAgICAgIGNvZGU6IFwiZW9zaW9cIlxuICAgICAgICAgICAgaW5kZXhfcG9zaXRpb246IDFcbiAgICAgICAgICAgIGpzb246IHRydWVcbiAgICAgICAgICAgIGtleV90eXBlOiBcImk2NFwiXG4gICAgICAgICAgICBsaW1pdDogLTFcbiAgICAgICAgICAgIGxvd2VyX2JvdW5kOiBudWxsXG4gICAgICAgICAgICBzY29wZTogXCJncXlkb29idWhlZ2VcIlxuICAgICAgICAgICAgdGFibGU6IFwiZGVsYmFuZFwiXG4gICAgICAgICAgICB0YWJsZV9rZXk6IFwiXCJcbiAgICAgICAgKi9cbiAgICAgICAgY29uc29sZS5sb2coXCJTY2F0dGVyU2VydmljZS5xdWVyeUFjY291bnREYXRhKFwiK25hbWUrXCIpIFwiKTtcbiAgICAgICAgdGhpcy5fYWNjb3VudF9xdWVyaWVzW25hbWVdID0gdGhpcy5fYWNjb3VudF9xdWVyaWVzW25hbWVdIHx8IG5ldyBQcm9taXNlPEFjY291bnREYXRhPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlBBU08gMSAtLS0tLS1cIiwgW3RoaXMuX2FjY291bnRfcXVlcmllc10pXG4gICAgICAgICAgICB0aGlzLndhaXRFb3Nqcy50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlBBU08gMiAoZW9zanMpIC0tLS0tLVwiKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIC8vIGVvc2pzMlxuICAgICAgICAgICAgICAgIHRoaXMucnBjLmdldF9hY2NvdW50KG5hbWUpLlxuICAgICAgICAgICAgICAgIC8qL1xuICAgICAgICAgICAgICAgIC8vIGVvc2pzXG4gICAgICAgICAgICAgICAgdGhpcy5lb3MuZ2V0QWNjb3VudCh7YWNjb3VudF9uYW1lOiBuYW1lfSkuXG4gICAgICAgICAgICAgICAgLy8qL1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUEFTTyAzIChlb3Nqcy5nZXRBY2NvdW50KSAtLS0tLS1cIiwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWNjb3VudF9kYXRhOiBBY2NvdW50RGF0YSA9IDxBY2NvdW50RGF0YT5yZXNwb25zZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYWNjb3VudF9kYXRhLmNvcmVfbGlxdWlkX2JhbGFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3ltYm9sID0gYWNjb3VudF9kYXRhLmNvcmVfbGlxdWlkX2JhbGFuY2Uuc3BsaXQoXCIgXCIpWzFdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNjb3VudF9kYXRhLmNvcmVfbGlxdWlkX2JhbGFuY2UgPSBcIjAuMDAwMCBcIiArIHRoaXMuc3ltYm9sO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGFjY291bnRfZGF0YS5jb3JlX2xpcXVpZF9iYWxhbmNlX2Fzc2V0ID0gbmV3IEFzc2V0KGFjY291bnRfZGF0YS5jb3JlX2xpcXVpZF9iYWxhbmNlKTtcbiAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gLS0tLS0gcmVmdW5kX3JlcXVlc3QgLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudF9kYXRhLnJlZnVuZF9yZXF1ZXN0ID0gYWNjb3VudF9kYXRhLnJlZnVuZF9yZXF1ZXN0IHx8IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiBcIjAuMDAwMCBcIiArIHRoaXMuc3ltYm9sLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV0X2Ftb3VudDogXCIwLjAwMDAgXCIgKyB0aGlzLnN5bWJvbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNwdV9hbW91bnQ6IFwiMC4wMDAwIFwiICsgdGhpcy5zeW1ib2wsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0X3RpbWU6IFwiMjAxOC0xMS0xOFQxODowOTo1M1wiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudF9kYXRhLnJlZnVuZF9yZXF1ZXN0LmNwdV9hbW91bnRfYXNzZXQgPSBuZXcgQXNzZXQoYWNjb3VudF9kYXRhLnJlZnVuZF9yZXF1ZXN0LmNwdV9hbW91bnQpO1xuICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEucmVmdW5kX3JlcXVlc3QubmV0X2Ftb3VudF9hc3NldCA9IG5ldyBBc3NldChhY2NvdW50X2RhdGEucmVmdW5kX3JlcXVlc3QubmV0X2Ftb3VudCk7XG4gICAgICAgICAgICAgICAgICAgIGFjY291bnRfZGF0YS5yZWZ1bmRfcmVxdWVzdC50b3RhbF9hc3NldCA9IFxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjb3VudF9kYXRhLnJlZnVuZF9yZXF1ZXN0LmNwdV9hbW91bnRfYXNzZXQucGx1cyhhY2NvdW50X2RhdGEucmVmdW5kX3JlcXVlc3QubmV0X2Ftb3VudF9hc3NldClcbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudF9kYXRhLnJlZnVuZF9yZXF1ZXN0LnRvdGFsID0gYWNjb3VudF9kYXRhLnJlZnVuZF9yZXF1ZXN0LnRvdGFsX2Fzc2V0LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gLS0tLS0gc2VsZl9kZWxlZ2F0ZWRfYmFuZHdpZHRoIC0tLS1cbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudF9kYXRhLnNlbGZfZGVsZWdhdGVkX2JhbmR3aWR0aCA9IGFjY291bnRfZGF0YS5zZWxmX2RlbGVnYXRlZF9iYW5kd2lkdGggfHwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IFwiMC4wMDAwIFwiICsgdGhpcy5zeW1ib2wsXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXRfd2VpZ2h0OiBcIjAuMDAwMCBcIiArIHRoaXMuc3ltYm9sLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3B1X3dlaWdodDogXCIwLjAwMDAgXCIgKyB0aGlzLnN5bWJvbFxuICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudF9kYXRhLnNlbGZfZGVsZWdhdGVkX2JhbmR3aWR0aC5uZXRfd2VpZ2h0X2Fzc2V0ID0gbmV3IEFzc2V0KGFjY291bnRfZGF0YS5zZWxmX2RlbGVnYXRlZF9iYW5kd2lkdGgubmV0X3dlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIGFjY291bnRfZGF0YS5zZWxmX2RlbGVnYXRlZF9iYW5kd2lkdGguY3B1X3dlaWdodF9hc3NldCA9IG5ldyBBc3NldChhY2NvdW50X2RhdGEuc2VsZl9kZWxlZ2F0ZWRfYmFuZHdpZHRoLmNwdV93ZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEuc2VsZl9kZWxlZ2F0ZWRfYmFuZHdpZHRoLnRvdGFsX2Fzc2V0ID0gXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEuc2VsZl9kZWxlZ2F0ZWRfYmFuZHdpZHRoLmNwdV93ZWlnaHRfYXNzZXQucGx1cyhhY2NvdW50X2RhdGEuc2VsZl9kZWxlZ2F0ZWRfYmFuZHdpZHRoLm5ldF93ZWlnaHRfYXNzZXQpO1xuICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEuc2VsZl9kZWxlZ2F0ZWRfYmFuZHdpZHRoLnRvdGFsID0gYWNjb3VudF9kYXRhLnNlbGZfZGVsZWdhdGVkX2JhbmR3aWR0aC50b3RhbF9hc3NldC50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgICAgICAvLyAtLS0tLSB0b3RhbF9yZXNvdXJjZXMgLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudF9kYXRhLnRvdGFsX3Jlc291cmNlcyA9IGFjY291bnRfZGF0YS50b3RhbF9yZXNvdXJjZXMgfHwge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV0X3dlaWdodDogXCIwLjAwMDAgXCIgKyB0aGlzLnN5bWJvbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNwdV93ZWlnaHQ6IFwiMC4wMDAwIFwiICsgdGhpcy5zeW1ib2xcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEudG90YWxfcmVzb3VyY2VzLm5ldF93ZWlnaHRfYXNzZXQgPSBuZXcgQXNzZXQoYWNjb3VudF9kYXRhLnRvdGFsX3Jlc291cmNlcy5uZXRfd2VpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudF9kYXRhLnRvdGFsX3Jlc291cmNlcy5jcHVfd2VpZ2h0X2Fzc2V0ID0gbmV3IEFzc2V0KGFjY291bnRfZGF0YS50b3RhbF9yZXNvdXJjZXMuY3B1X3dlaWdodCk7XG5cbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudF9kYXRhLnRvdGFsX2JhbGFuY2VfYXNzZXQgPSB0aGlzLmNhbGN1bGF0ZVRvdGFsQmFsYW5jZShhY2NvdW50X2RhdGEpO1xuICAgICAgICAgICAgICAgICAgICBhY2NvdW50X2RhdGEudG90YWxfYmFsYW5jZSA9IGFjY291bnRfZGF0YS50b3RhbF9iYWxhbmNlX2Fzc2V0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudF9kYXRhLmNwdV9saW1pdCA9IHRoaXMuY2FsY3VsYXRlUmVzb3VyY2VMaW1pdChhY2NvdW50X2RhdGEuY3B1X2xpbWl0KTtcbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudF9kYXRhLm5ldF9saW1pdCA9IHRoaXMuY2FsY3VsYXRlUmVzb3VyY2VMaW1pdChhY2NvdW50X2RhdGEubmV0X2xpbWl0KTtcbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudF9kYXRhLnJhbV9saW1pdCA9IHRoaXMuY2FsY3VsYXRlUmVzb3VyY2VMaW1pdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXg6IGFjY291bnRfZGF0YS5yYW1fcXVvdGEsIHVzZWQ6IGFjY291bnRfZGF0YS5yYW1fdXNhZ2VcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYWNjb3VudF9kYXRhOiBcIiwgYWNjb3VudF9kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYWNjb3VudF9kYXRhKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgcHJvbWlzZSA9IHRoaXMuX2FjY291bnRfcXVlcmllc1tuYW1lXTtcbiAgICAgICAgcHJvbWlzZS50aGVuKChyKSA9PiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fYWNjb3VudF9xdWVyaWVzW3IuYWNjb3VudF9uYW1lXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIC8qXG4gICAgLy8gZW9zanMyXG4gICAgYXN5bmMgZXhlY3V0ZVRyYW5zYWN0aW9uKGNvbnRyYWN0OnN0cmluZywgYWN0aW9uOnN0cmluZywgZGF0YTphbnkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9naW4oKS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMud2FpdFJlYWR5LnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lb3MudHJhbnNhY3QoXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjb3VudDogY29udHJhY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGFjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0aG9yaXphdGlvbjogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdG9yOiB0aGlzLmFjY291bnQubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb246IHRoaXMuYWNjb3VudC5hdXRob3JpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfV0sICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrc0JlaGluZDogMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBpcmVTZWNvbmRzOiAzMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICApLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVhJVE8gISEhIVwiLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUiAhISEhXCIsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH0pOyBcblxuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7ICAgXG4gICAgICAgIH0pOyBcbiAgICB9XG4gICAgKi9cblxuXG4gICAgLypcbiAgICBcbiAgICB7XG4gICAgICAgIGFjdGlvbnM6IFt7XG4gICAgICAgICAgICBhY2NvdW50OiB0aGlzLmNvbnRyYWN0QWNjb3VudCxcbiAgICAgICAgICAgIG5hbWU6IGFjdGlvbixcbiAgICAgICAgICAgIGF1dGhvcml6YXRpb246IFt7XG4gICAgICAgICAgICAgICAgYWN0b3I6IHRoaXMuYWNjb3VudC5uYW1lLFxuICAgICAgICAgICAgICAgIHBlcm1pc3Npb246IHRoaXMuYWNjb3VudC5hdXRob3JpdHlcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAuLi5kYXRhXG4gICAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGJsb2Nrc0JlaGluZDogMyxcbiAgICAgICAgZXhwaXJlU2Vjb25kczogMzBcbiAgICB9ICAgIFxuICAgICovXG5cbiAgICBnZXRTbWFydENvbnRyYWN0KGFjY291bnRfbmFtZSkge1xuICAgICAgICByZXR1cm4gbmV3IFNtYXJ0Q29udHJhY3QoYWNjb3VudF9uYW1lLCB0aGlzKTtcbiAgICB9XG4gICAgXG4gICAgZ2V0Q29udHJhY3RXcmFwcGVyKGFjY291bnRfbmFtZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBTY2F0dGVyU2VydmljZS5nZXRDb250cmFjdCgke2FjY291bnRfbmFtZX0pYCk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvZ2luKCkudGhlbigoYSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGhpcy5sb2dpbigpLnRoZW4oKGEpID0+IHsgLS0+XCIsIGEgKTtcbiAgICAgICAgICAgICAgICB0aGlzLndhaXRSZWFkeS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW9zLmNvbnRyYWN0KGFjY291bnRfbmFtZSkudGhlbihjb250cmFjdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgLS0gY29udHJhY3QgJHthY2NvdW50X25hbWV9IC0tYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGNvbnRyYWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIGNvbnRyYWN0W2ldID09IFwiZnVuY3Rpb25cIikgY29uc29sZS5sb2coXCJjb250cmFjdC5cIitpK1wiKClcIiwgW2NvbnRyYWN0W2ldXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNvbnRyYWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTsgICBcbiAgICAgICAgfSk7IFxuICAgIH1cbiAgICBcblxuICAgIC8qXG4gICAgdHJhbnNmZXIoZnJvbTpzdHJpbmcsIHRvOnN0cmluZywgYW1vdW50OnN0cmluZywgbWVtbzpzdHJpbmcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTY2F0dGVyU2VydmljZS50cmFuc2ZlcigpXCIsIGZyb20sIHRvLCBhbW91bnQsIG1lbW8pO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy53YWl0RW9zanMudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTY2F0dGVyLnRyYW5zZmVyKCk6XCIsIGZyb20sIHRvLCBhbW91bnQsIG1lbW8sIHRoaXMuYXV0aG9yaXphdGlvbik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5lb3MudHJhbnNmZXIoZnJvbSwgdG8sIGFtb3VudCwgbWVtbywgdGhpcy5hdXRob3JpemF0aW9uKS50aGVuKHRyeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoYXQncyBpdCFcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFRyYW5zYWN0aW9uIElEOiAke3RyeC50cmFuc2FjdGlvbl9pZH1gLCB0cngpO1xuICAgICAgICAgICAgICAgICAgICAvLyBlbiBOb3RhcyBlc3TDg8KhIGVsIGpzb24gcXVlIGRlc2NyaWJlIGVsIG9iamV0byB0cnhcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cngpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7ICAgXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAqL1xuXG4gICAgLy8gbG9naW5UaW1lcjtcbiAgICBsb2dpbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTY2F0dGVyU2VydmljZS5sb2dpbigpXCIpO1xuICAgICAgICB0aGlzLmZlZWQuc2V0TG9hZGluZyhcImxvZ2luXCIsIHRydWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5saWIuaWRlbnRpdHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldElkZW50aXR5KHRoaXMubGliLmlkZW50aXR5KTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMubGliLmlkZW50aXR5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGxvZ2luVGltZXIgPSBzZXRUaW1lb3V0KCBfID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dpblwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChcImNvbm5lY3Rpb24gdGltZW91dFwiKTtcbiAgICAgICAgICAgICAgICB9LCA1MDAwKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3RBcHAoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saWIuZ2V0SWRlbnRpdHkoe1wiYWNjb3VudHNcIjpbdGhpcy5uZXR3b3JrLmVvc2NvbmZdfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCAoaWRlbnRpdHkpICA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGxvZ2luVGltZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0SWRlbnRpdHkoaWRlbnRpdHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TG9nZ2VkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dpblwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShpZGVudGl0eSk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKHJlamVjdCk7ICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2dvdXQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2NhdHRlclNlcnZpY2UubG9nb3V0KClcIik7XG4gICAgICAgIHRoaXMuZmVlZC5zZXRMb2FkaW5nKFwibG9naW5cIiwgZmFsc2UpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3RBcHAoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpYi5mb3Jnb3R0ZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubGliLmZvcmdldElkZW50aXR5KClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oIChlcnIpICA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRpc2Nvbm5lY3RcIiwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRJZGVudGl0eSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mZWVkLnNldExvYWRpbmcoXCJsb2dpblwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFwibG9nb3V0XCIpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKHJlamVjdCk7ICAgIFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXQgbG9nZ2VkKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXRoaXMubGliKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiAhIXRoaXMubGliLmlkZW50aXR5O1xuICAgIH1cblxuICAgIGdldCB1c2VybmFtZSgpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMubGliKSByZXR1cm4gXCJcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMubGliLmlkZW50aXR5ID8gdGhpcy5saWIuaWRlbnRpdHkubmFtZSA6IFwiXCI7XG4gICAgfVxuXG4gICAgZ2V0IGF1dGhvcml6YXRpb24oKTogYW55IHtcbiAgICAgICAgaWYgKCF0aGlzLmFjY291bnQpICB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiU2NhdHRlclNlcnZpY2UuYXV0aG9yaXphdGlvbigpXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHsgYXV0aG9yaXphdGlvbjpbXCJ1bmtub3duQHVua25vd25cIl0gfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhdXRob3JpemF0aW9uOltgJHt0aGlzLmFjY291bnQubmFtZX1AJHt0aGlzLmFjY291bnQuYXV0aG9yaXR5fWBdXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0IGNvbm5lY3RlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3RlZDtcbiAgICB9XG5cbiAgICBnZXRUYWJsZVJvd3MoY29udHJhY3QsIHNjb3BlLCB0YWJsZSwgdGtleSwgbG93ZXJiLCB1cHBlcmIsIGxpbWl0LCBrdHlwZSwgaXBvcyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIC8qXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2NhdHRlclNlcnZpY2UuZ2V0VGFibGVSb3dzKClcIik7XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9FT1NJTy9lb3Nqcy1hcGkvYmxvYi9tYXN0ZXIvZG9jcy9hcGkubWQjZW9zLmdldFRhYmxlUm93c1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLndhaXRFb3Nqcy50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIganNvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogY29udHJhY3QsXG4gICAgICAgICAgICAgICAgICAgIGluZGV4X3Bvc2l0aW9uOiBpcG9zLFxuICAgICAgICAgICAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBrZXlfdHlwZToga3R5cGUsXG4gICAgICAgICAgICAgICAgICAgIGxpbWl0OiBsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgbG93ZXJfYm91bmQ6IGxvd2VyYixcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6IHNjb3BlLFxuICAgICAgICAgICAgICAgICAgICB0YWJsZTogdGFibGUsXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlX2tleTogdGtleSxcbiAgICAgICAgICAgICAgICAgICAgdXBwZXJfYm91bmQ6IHVwcGVyYlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLnJwYy5nZXRfdGFibGVfcm93cyhqc29uKS50aGVuKF9kYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShfZGF0YSk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pOyAgIFxuICAgICAgICB9KTtcbiAgICAgICAgLyovXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2NhdHRlclNlcnZpY2UuZ2V0VGFibGVSb3dzKClcIik7XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9FT1NJTy9lb3Nqcy1hcGkvYmxvYi9tYXN0ZXIvZG9jcy9hcGkubWQjZW9zLmdldFRhYmxlUm93c1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLndhaXRFb3Nqcy50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVvcy5nZXRUYWJsZVJvd3ModHJ1ZSwgY29udHJhY3QsIHNjb3BlLCB0YWJsZSwgdGtleSwgbG93ZXJiLCB1cHBlcmIsIGxpbWl0LCBrdHlwZSwgaXBvcykudGhlbihmdW5jdGlvbiAoX2RhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShfZGF0YSk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTsgICBcbiAgICAgICAgfSk7XG4gICAgICAgIC8vKi9cblxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFZhcGFlZVNjYXR0ZXIgfSBmcm9tICcuL3NjYXR0ZXIuc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXSxcbiAgcHJvdmlkZXJzOiBbVmFwYWVlU2NhdHRlcl0sXG4gIGV4cG9ydHM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFZhcGFlZVNjYXR0ZXJNb2R1bGUgeyB9XG4iXSwibmFtZXMiOlsiTG9uZy5mcm9tU3RyaW5nIiwidHNsaWJfMS5fX3ZhbHVlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUVBLElBQUE7SUFNSSxlQUFZLEdBQWM7UUFBZCxvQkFBQSxFQUFBLFVBQWM7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFFdEIsSUFBSSxPQUFPLEdBQUcsSUFBSSxRQUFRLEVBQUU7WUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7WUFDbkIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUscUNBQXFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzVGLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLHFDQUFxQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUMvRjtRQUVELElBQUksR0FBRyxFQUFFO1lBQ0wsSUFBSSxHQUFHLFlBQVksS0FBSyxFQUFFO2dCQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQztnQkFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO2FBQ2xDO2lCQUFNLElBQUksT0FBTyxHQUFHLElBQUksUUFBUSxFQUFFO2dCQUMvQixJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDMUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDO2FBQ25EO1NBQ0o7UUFFRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDbkI7SUFFRCxzQkFBSSx5QkFBTTs7OztRQUFWLGNBQWUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7OztPQUFBO0lBQ3JDLHNCQUFJLDRCQUFTOzs7O1FBQWIsY0FBa0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7OztPQUFBO0lBQzNDLHNCQUFJLDJCQUFROzs7O1FBQVosY0FBaUIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7OztPQUFBO0lBRXpDLHNCQUFJLHNCQUFHOzs7O1FBQVA7WUFDSSxJQUFJLElBQUksQ0FBQyxJQUFJO2dCQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztZQUNoQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDeEIsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksRUFBRTtnQkFDbkQsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ25DLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO2lCQUNyRTtxQkFBTTtvQkFDSCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7d0JBQ2pCLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO3FCQUM3QztvQkFDRCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7d0JBQ2hCLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO3FCQUM1QztpQkFDSjthQUNKO1lBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ3BCOzs7T0FBQTs7OztJQUVELHdCQUFROzs7SUFBUjtRQUNJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztLQUNuQjtnQkExREw7SUE0REM7Ozs7OztBQzVERCxJQUdBO0lBSUksZUFBWSxDQUFhLEVBQUUsQ0FBYTtRQUE1QixrQkFBQSxFQUFBLFFBQWE7UUFBRSxrQkFBQSxFQUFBLFFBQWE7UUFDcEMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7WUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7WUFDekIsT0FBTztTQUNWO1FBRUQsSUFBSSxDQUFDLFlBQVksU0FBUyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsT0FBTztTQUNWO1FBRUQsSUFBSSxDQUFDLFlBQVksS0FBSyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNmLE9BQU87U0FDVjtRQUVELElBQUksT0FBTyxDQUFDLElBQUksUUFBUSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDZixPQUFPO1NBQ1Y7UUFFRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLFFBQVEsRUFBRTtZQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2QsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxZQUFZLFNBQVMsRUFBRSxrQ0FBa0MsR0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0YsT0FBTztTQUNWO0tBQ0o7Ozs7O0lBRUQsb0JBQUk7Ozs7SUFBSixVQUFLLENBQU87UUFDUixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsMEJBQTBCLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3RCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLHFEQUFxRCxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFDeEksSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN4Qzs7Ozs7SUFFRCxxQkFBSzs7OztJQUFMLFVBQU0sQ0FBTztRQUNULE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSwwQkFBMEIsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdELE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsMkRBQTJELEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztRQUM5SSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekMsT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3hDOzs7O0lBRUQscUJBQUs7OztJQUFMO1FBQ0ksT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUM3Qzs7Ozs7SUFFRCxxQkFBSzs7OztJQUFMLFVBQU0sSUFBWTtRQUNkLElBQUksSUFBSSxJQUFJLEVBQUU7WUFBRSxPQUFPOztRQUN2QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztRQUM3QixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7O1FBRXhDLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNuQyxTQUFTLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7U0FDL0M7YUFBTSxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUMxQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTtnQkFDN0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsR0FBQyxJQUFJLEdBQUMsR0FBRyxDQUFDLENBQUM7YUFDOUQ7U0FDSjtRQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUM7WUFDbkIsTUFBTSxFQUFFLEdBQUc7WUFDWCxTQUFTLEVBQUUsU0FBUztTQUN2QixDQUFDLENBQUM7S0FDTjs7Ozs7O0lBRUQsNkJBQWE7Ozs7O0lBQWIsVUFBYyxRQUFvQixFQUFFLEtBQXFCO1FBQTNDLHlCQUFBLEVBQUEsWUFBbUIsQ0FBQztRQUFFLHNCQUFBLEVBQUEsYUFBcUI7UUFDckQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTyxHQUFHLENBQUM7O1FBQzVCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztRQUM3QyxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7O1FBQ3ZCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDOztRQUNyQyxJQUFJLE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDaEQsSUFBSSxRQUFRLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDaEIsU0FBUyxHQUFHLFFBQVEsQ0FBQztTQUN4QjtRQUNELElBQUksS0FBSyxFQUFFO1lBQ1AsU0FBUyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDO1lBQy9CLFNBQVMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUM7U0FDN0M7UUFDRCxLQUFLLElBQUksQ0FBQyxHQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN6QyxPQUFPLElBQUksR0FBRyxDQUFDO1NBQ2xCO1FBQ0QsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLFNBQVMsRUFBRTtZQUM1QixPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDMUM7UUFFRCxJQUFJLFNBQVMsSUFBSSxDQUFDLEVBQUU7WUFDaEIsT0FBTyxPQUFPLENBQUM7U0FDbEI7YUFBTTtZQUNILE9BQU8sT0FBTyxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUM7U0FDbEM7S0FDSjs7OztJQUVELHdCQUFROzs7SUFBUjtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztZQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzFCLE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM1QztJQUVELHNCQUFJLHNCQUFHOzs7O1FBQVA7WUFDSSxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUMxQjs7O09BQUE7Ozs7O0lBRUQsd0JBQVE7Ozs7SUFBUixVQUFTLFFBQW9CO1FBQXBCLHlCQUFBLEVBQUEsWUFBbUIsQ0FBQztRQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7WUFBRSxPQUFPLFFBQVEsQ0FBQztRQUNqQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQy9FOzs7OztJQUVELHVCQUFPOzs7O0lBQVAsVUFBUSxLQUFZOztRQUNoQixJQUFJLE1BQU0sR0FBRyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztRQUNyRCxJQUFJLEtBQUssR0FBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEMsT0FBTyxLQUFLLENBQUM7S0FDaEI7Z0JBM0hMO0lBNEhDOzs7Ozs7SUN6R0Q7SUFJSSx1QkFBWSxRQUFxQixFQUFFLE9BQTZCO1FBQXBELHlCQUFBLEVBQUEsYUFBcUI7UUFBRSx3QkFBQSxFQUFBLGNBQTZCO1FBQzVELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0tBQzFCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBaUJELGdDQUFROzs7OztJQUFSLFVBQVMsTUFBYyxFQUFFLE1BQVc7UUFBcEMsaUJBY0M7UUFiRyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDbEQsT0FBTyxJQUFJLE9BQU8sQ0FBTSxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ3BDLElBQUk7Z0JBQ0EsS0FBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUTtvQkFDeEQsSUFBSTt3QkFDQSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxFQUFFLFVBQUEsUUFBUTs0QkFDL0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7NEJBQ2xELE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzt5QkFDckIsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFBLEdBQUcsSUFBTSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQ3RDO29CQUFDLE9BQU8sR0FBRyxFQUFFO3dCQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFBRTtpQkFDakMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLEdBQUcsSUFBTSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDckM7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7YUFBRTtTQUNqQyxDQUFDLENBQUM7S0FDTjs7Ozs7OztJQUdELGdDQUFROzs7OztJQUFSLFVBQVMsS0FBWSxFQUFFLE1BQXVCO1FBQXZCLHVCQUFBLEVBQUEsV0FBdUI7O1FBRTFDLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDbkIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUTtZQUNwQixTQUFTLEVBQUUsR0FBRztZQUNkLFdBQVcsRUFBRSxHQUFHO1lBQ2hCLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLEtBQUssRUFBRSxFQUFFO1lBQ1QsUUFBUSxFQUFFLEtBQUs7WUFDZixjQUFjLEVBQUUsR0FBRztTQUN0QixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRVgsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FDNUIsRUFBRSxDQUFDLFFBQVEsRUFDWCxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFDZixFQUFFLENBQUMsU0FBUyxFQUNaLEVBQUUsQ0FBQyxXQUFXLEVBQ2QsRUFBRSxDQUFDLFdBQVcsRUFDZCxFQUFFLENBQUMsS0FBSyxFQUNSLEVBQUUsQ0FBQyxRQUFRLEVBQ1gsRUFBRSxDQUFDLGNBQWMsQ0FDcEIsQ0FBQztLQUNMO3dCQW5GTDtJQXFGQzs7Ozs7O0lDL0REO0lBU0k7UUFBQSxpQkFRQzs7O3VCQW9LUyxrQ0FBa0M7dUJBQ2xDLFVBQUEsRUFBRTs7WUFDUixJQUFNLEdBQUcsR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUNwQyxJQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7Z0JBQ1gsTUFBTSxJQUFJLFNBQVMsQ0FBQyx5QkFBdUIsRUFBRSxNQUFHLENBQUMsQ0FBQTtZQUVuRCxPQUFPLEdBQUcsQ0FBQztTQUNkO1FBbExHLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuQzs7Ozs7O0lBR0QsbUNBQVk7Ozs7SUFBWixVQUFhLEdBQVU7O1FBQ25CLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7O1FBQ3ZCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDMUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQzdCO2FBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNqRCxLQUFLLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1NBQ2xDO1FBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQyxPQUFPLE1BQU0sQ0FBQztLQUNqQjs7Ozs7O0lBRUQsbUNBQVk7Ozs7O0lBQVosVUFBYSxLQUFZLEVBQUUsSUFBYTs7UUFDcEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFDMUIsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDO1NBQ3JCO1FBQ0QsUUFBTyxLQUFLO1lBQ1IsS0FBSyxFQUFFLEVBQUUsT0FBTyxHQUFHLENBQUM7WUFDcEIsS0FBSyxFQUFFLEVBQUUsT0FBTyxHQUFHLENBQUM7WUFDcEIsS0FBSyxFQUFFLEVBQUUsT0FBTyxHQUFHLENBQUM7WUFDcEIsS0FBSyxFQUFFLEVBQUUsT0FBTyxHQUFHLENBQUM7WUFDcEIsS0FBSyxFQUFFLEVBQUUsT0FBTyxHQUFHLENBQUM7WUFDcEIsS0FBSyxFQUFFLEVBQUUsT0FBTyxHQUFHLENBQUM7U0FDdkI7UUFDRCxPQUFPLEdBQUcsQ0FBQztLQUNkOzs7Ozs7SUFHRCxtQ0FBWTs7OztJQUFaLFVBQWEsSUFBWTs7UUFDckIsSUFBSSxJQUFJLEdBQVksRUFBRSxDQUFDOztRQUN2QixJQUFJLEdBQUcsR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzdCLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUQ7UUFDRCxPQUFPLElBQUksQ0FBQztLQUNmOzs7OztJQUVELG1DQUFZOzs7O0lBQVosVUFBYSxJQUFhOztRQUN0QixJQUFJLE1BQU0sR0FBVSxFQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBQyxDQUFDOztRQUN4QyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUM7UUFDaEIsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFFLENBQUMsRUFBRTtZQUMvQixJQUFJLENBQUMsSUFBRSxHQUFHO2dCQUFFLEdBQUcsR0FBRyxLQUFLLENBQUM7WUFDeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzdDO1FBQ0QsT0FBTyxNQUFNLENBQUM7S0FDakI7Ozs7O0lBRUQsb0NBQWE7Ozs7SUFBYixVQUFjLElBQWE7UUFDdkIsSUFBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEdBQUc7WUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLDhEQUE4RCxDQUFDLENBQUM7UUFDckcsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMxRzs7Ozs7O0lBRUQsbUNBQVk7Ozs7O0lBQVosVUFBYSxJQUFhLEVBQUUsTUFBYztRQUN0QyxJQUFHLElBQUksQ0FBQyxNQUFNLElBQUksR0FBRztZQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsOERBQThELENBQUMsQ0FBQztRQUNyRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNyQzs7Ozs7SUFFRCxrQ0FBVzs7OztJQUFYLFVBQVksQ0FBUTtRQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDO1lBQUUsT0FBTyxHQUFHLENBQUM7UUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQztZQUFFLE9BQU8sR0FBRyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUM7WUFBRSxPQUFPLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUFFLE9BQU8sTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM1RCxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxrQ0FBa0MsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3RCxPQUFPLEdBQUcsQ0FBQztLQUNkOzs7OztJQUVELGtDQUFXOzs7O0lBQVgsVUFBWSxDQUFRO1FBQ2hCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsNkRBQTZELEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUcsSUFBSSxDQUFDLElBQUksR0FBRztZQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUc7WUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2QixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQzlHLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU07WUFBRSxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDL0csT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsb0JBQW9CLEdBQUcsQ0FBQyxHQUFHLCtDQUErQyxDQUFDLENBQUM7UUFDbEcsT0FBTyxDQUFDLENBQUMsQ0FBQztLQUNiOzs7Ozs7SUFFRCxrQ0FBVzs7Ozs7SUFBWCxVQUFZLENBQVEsRUFBRSxJQUFhOztRQUMvQixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7O1FBQ2YsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDOztRQUNoQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7O1FBQ2QsSUFBSSxLQUFLLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUN2QixLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsR0FBRyxHQUFHLEdBQUMsQ0FBQyxFQUFFO1lBQ3RDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztTQUNsQzs7UUFDRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7Ozs7Ozs7SUFFRCxpQ0FBVTs7Ozs7O0lBQVYsVUFBVyxLQUFZLEVBQUUsQ0FBUSxFQUFFLElBQWE7O1FBQzVDLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQzs7UUFDZixJQUFJLEtBQUssR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzlDOzs7OztJQUVELGlDQUFVOzs7O0lBQVYsVUFBVyxLQUFZOztRQUduQixJQUFJLElBQUksR0FBWSxFQUFFLENBQUM7UUFDdkIsSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztRQUN6RSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFFN0csSUFBSSxHQUFHLEdBQVUsRUFBRSxDQUFDO1FBQ3BCLEtB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