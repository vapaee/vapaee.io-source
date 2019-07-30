/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import BigNumber from "bignumber.js";
import * as Long from 'long';
/**
 * @record
 */
export function SlugId() { }
/** @type {?|undefined} */
SlugId.prototype.low;
/** @type {?|undefined} */
SlugId.prototype.str;
/** @type {?|undefined} */
SlugId.prototype.top;
/**
 * @record
 */
export function Work() { }
/** @type {?} */
Work.prototype.items;
/** @type {?} */
Work.prototype.containers;
/**
 * @record
 */
export function Profile() { }
/** @type {?|undefined} */
Profile.prototype.id;
/** @type {?} */
Profile.prototype.slugid;
/** @type {?} */
Profile.prototype.account;
/** @type {?|undefined} */
Profile.prototype.containers;
/** @type {?|undefined} */
Profile.prototype.work;
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
        var value = Long.fromString(bitstr, true, 2);
        /** @type {?} */
        var leHex = '';
        /** @type {?} */
        var bytes = littleEndian ? value.toBytesLE() : value.toBytesBE();
        try {
            for (var bytes_1 = tslib_1.__values(bytes), bytes_1_1 = bytes_1.next(); !bytes_1_1.done; bytes_1_1 = bytes_1.next()) {
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
export { ScatterUtils };
if (false) {
    /** @type {?} */
    ScatterUtils.prototype.code_0;
    /** @type {?} */
    ScatterUtils.prototype.code_1;
    /** @type {?} */
    ScatterUtils.prototype.code_4;
    /** @type {?} */
    ScatterUtils.prototype.code_9;
    /** @type {?} */
    ScatterUtils.prototype.code_a;
    /** @type {?} */
    ScatterUtils.prototype.code_f;
    /** @type {?} */
    ScatterUtils.prototype.code_z;
    /** @type {?} */
    ScatterUtils.prototype.charmap;
    /** @type {?} */
    ScatterUtils.prototype.charidx;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuY2xhc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AdmFwYWVlL3NjYXR0ZXIvIiwic291cmNlcyI6WyJsaWIvdXRpbHMuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLFNBQVMsTUFBTSxjQUFjLENBQUM7QUFDckMsT0FBTyxLQUFLLElBQUksTUFBTSxNQUFNLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCN0IsSUFBQTtJQVNJO1FBQUEsaUJBUUM7Ozt1QkFvS1Msa0NBQWtDO3VCQUNsQyxVQUFBLEVBQUU7O1lBQ1IsSUFBTSxHQUFHLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDcEMsRUFBRSxDQUFBLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNaLE1BQU0sSUFBSSxTQUFTLENBQUMseUJBQXVCLEVBQUUsTUFBRyxDQUFDLENBQUE7WUFFbkQsTUFBTSxDQUFDLEdBQUcsQ0FBQztTQUNkO1FBbExHLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuQztJQUVELDJEQUEyRDs7Ozs7SUFDM0QsbUNBQVk7Ozs7SUFBWixVQUFhLEdBQVU7O1FBQ25CLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7O1FBQ3ZCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMzQyxLQUFLLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDN0I7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2xELEtBQUssR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7U0FDbEM7UUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUMsTUFBTSxDQUFDO0tBQ2pCOzs7Ozs7SUFFRCxtQ0FBWTs7Ozs7SUFBWixVQUFhLEtBQVksRUFBRSxJQUFhOztRQUNwQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7U0FDckI7UUFDRCxNQUFNLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1gsS0FBSyxFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNwQixLQUFLLEVBQUUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ3BCLEtBQUssRUFBRSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDcEIsS0FBSyxFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNwQixLQUFLLEVBQUUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ3BCLEtBQUssRUFBRSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUM7U0FDdkI7UUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0tBQ2Q7SUFFRCxrQkFBa0I7Ozs7O0lBQ2xCLG1DQUFZOzs7O0lBQVosVUFBYSxJQUFZOztRQUNyQixJQUFJLElBQUksR0FBWSxFQUFFLENBQUM7O1FBQ3ZCLElBQUksR0FBRyxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDOUIsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1RDtRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7S0FDZjs7Ozs7SUFFRCxtQ0FBWTs7OztJQUFaLFVBQWEsSUFBYTs7UUFDdEIsSUFBSSxNQUFNLEdBQVUsRUFBQyxHQUFHLEVBQUMsSUFBSSxFQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUMsQ0FBQzs7UUFDeEMsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUUsQ0FBQyxFQUFFLENBQUM7WUFDaEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFFLEdBQUcsQ0FBQztnQkFBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUM3QztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7S0FDakI7Ozs7O0lBRUQsb0NBQWE7Ozs7SUFBYixVQUFjLElBQWE7UUFDdkIsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUM7WUFBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDhEQUE4RCxDQUFDLENBQUM7UUFDckcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzFHOzs7Ozs7SUFFRCxtQ0FBWTs7Ozs7SUFBWixVQUFhLElBQWEsRUFBRSxNQUFjO1FBQ3RDLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDO1lBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO1FBQ3JHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3JDOzs7OztJQUVELGtDQUFXOzs7O0lBQVgsVUFBWSxDQUFRO1FBQ2hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3ZCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3ZCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMzRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDNUQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsa0NBQWtDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztLQUNkOzs7OztJQUVELGtDQUFXOzs7O0lBQVgsVUFBWSxDQUFRO1FBQ2hCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsNkRBQTZELEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQztZQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDdkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQztZQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQzlHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7WUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUMvRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxvQkFBb0IsR0FBRyxDQUFDLEdBQUcsK0NBQStDLENBQUMsQ0FBQztRQUNsRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDYjs7Ozs7O0lBRUQsa0NBQVc7Ozs7O0lBQVgsVUFBWSxDQUFRLEVBQUUsSUFBYTs7UUFDL0IsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDOztRQUNmLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQzs7UUFDaEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDOztRQUNkLElBQUksS0FBSyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDdkIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFHLEdBQUcsR0FBQyxDQUFDLEVBQUUsQ0FBQztZQUN2QyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7U0FDbEM7O1FBQ0QsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDO0tBQ2Y7Ozs7Ozs7SUFFRCxpQ0FBVTs7Ozs7O0lBQVYsVUFBVyxLQUFZLEVBQUUsQ0FBUSxFQUFFLElBQWE7O1FBQzVDLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQzs7UUFDZixJQUFJLEtBQUssR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDOUM7Ozs7O0lBRUQsaUNBQVU7Ozs7SUFBVixVQUFXLEtBQVk7O1FBR25CLElBQUksSUFBSSxHQUFZLEVBQUUsQ0FBQztRQUN2QixJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O1FBQ3pFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztRQUU3RyxJQUFJLEdBQUcsR0FBVSxFQUFFLENBQUM7UUFDcEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMxQixHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDcEM7O1FBRUQsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDaEIsTUFBTSxDQUFDLEtBQUssQ0FBQztLQUNoQjs7Ozs7SUFFRCxpQ0FBVTs7OztJQUFWLFVBQVcsSUFBVzs7UUFDbEIsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hCO1FBQ0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7O1lBQy9CLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ25DO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztRQUNyQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRW5DLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFcEYsTUFBTSxDQUFDLElBQUksQ0FBQztLQUNmOzs7OztJQUVELG9DQUFhOzs7O0lBQWIsVUFBYyxJQUFXOztRQUNyQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7O1FBQ2YsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O1FBQzFDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztRQUMxQyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDakIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbEMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pEO1FBQ0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNuQyxHQUFHLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDeEM7UUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0tBQ2Q7Ozs7OztJQVlELHlDQUFrQjs7Ozs7SUFBbEIsVUFBbUIsSUFBSSxFQUFFLFlBQW9CO1FBQXBCLDZCQUFBLEVBQUEsb0JBQW9CO1FBQ3pDLEVBQUUsQ0FBQSxDQUFDLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQztZQUMxQixNQUFNLElBQUksU0FBUyxDQUFDLHFDQUFxQyxDQUFDLENBQUE7UUFFNUQsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDbEIsTUFBTSxJQUFJLFNBQVMsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFBOztRQUUvRCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUE7UUFDZixHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDOztZQUM1QixJQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBOztZQUNyRCxJQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTs7WUFDN0IsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNoQyxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLE1BQU0sSUFBSSxTQUFTLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxDQUFBO2FBQzVDO1lBQ0QsSUFBSSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUE7WUFDOUMsTUFBTSxJQUFJLElBQUksQ0FBQTtTQUNmOztRQUVELElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTs7UUFHOUMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFBOztRQUNkLElBQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUE7O1lBQ2xFLEdBQUcsQ0FBQSxDQUFZLElBQUEsVUFBQSxpQkFBQSxLQUFLLENBQUEsNEJBQUE7Z0JBQWhCLElBQU0sQ0FBQyxrQkFBQTs7Z0JBQ1QsSUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtnQkFDaEMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2FBQ3pDOzs7Ozs7Ozs7O1FBRUQsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBOztRQUkxRCxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFBOztLQUMzQjtJQUNELDBEQUEwRDs7Ozs7SUFFMUQsaUNBQVU7Ozs7SUFBVixVQUFXLElBQVc7O1FBTWxCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDaEM7dUJBaFFMO0lBa1FDLENBQUE7QUE1T0Qsd0JBNE9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJpZ051bWJlciBmcm9tIFwiYmlnbnVtYmVyLmpzXCI7XG5pbXBvcnQgKiBhcyBMb25nIGZyb20gJ2xvbmcnO1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGludGVyZmFjZSBTbHVnSWQge1xuICAgIGxvdz86IHN0cmluZztcbiAgICBzdHI/OiBzdHJpbmc7XG4gICAgdG9wPzogc3RyaW5nO1xufVxuZXhwb3J0IGludGVyZmFjZSBXb3JrIHtcbiAgICBpdGVtczogYW55W107XG4gICAgY29udGFpbmVyczogYW55W107XG59XG5leHBvcnQgaW50ZXJmYWNlIFByb2ZpbGUge1xuICAgIGlkPzpzdHJpbmc7XG4gICAgc2x1Z2lkOiBTbHVnSWQ7XG4gICAgYWNjb3VudDogc3RyaW5nO1xuICAgIGNvbnRhaW5lcnM/OiBhbnlbXSxcbiAgICB3b3JrPzogV29yaztcbn1cblxuZXhwb3J0IGNsYXNzIFNjYXR0ZXJVdGlscyB7XG4gICAgY29kZV8wOm51bWJlcjtcbiAgICBjb2RlXzE6bnVtYmVyO1xuICAgIGNvZGVfNDpudW1iZXI7XG4gICAgY29kZV85Om51bWJlcjtcbiAgICBjb2RlX2E6bnVtYmVyO1xuICAgIGNvZGVfZjpudW1iZXI7XG4gICAgY29kZV96Om51bWJlcjtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jb2RlXzAgPSBcIjBcIi5jaGFyQ29kZUF0KDApO1xuICAgICAgICB0aGlzLmNvZGVfMSA9IFwiMVwiLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIHRoaXMuY29kZV80ID0gXCI0XCIuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgdGhpcy5jb2RlXzkgPSBcIjlcIi5jaGFyQ29kZUF0KDApO1xuICAgICAgICB0aGlzLmNvZGVfYSA9IFwiYVwiLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIHRoaXMuY29kZV9mID0gXCJmXCIuY2hhckNvZGVBdCgwKTsgICAgICAgIFxuICAgICAgICB0aGlzLmNvZGVfeiA9IFwielwiLmNoYXJDb2RlQXQoMCk7ICAgICAgICBcbiAgICB9ICAgIFxuXG4gICAgLy8gdGhpcyBwYXJ0IGlzIHN0aWxsIGV4cGVyaW1lbnRhbCAoaW5pdCkgLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkZWNvZGVOaWJibGUobmliOm51bWJlcikge1xuICAgICAgICB2YXIgbmliYmxlID0gWzAsMCwwLDBdO1xuICAgICAgICB2YXIgdmFsdWUgPSAwO1xuICAgICAgICBpZiAodGhpcy5jb2RlXzAgPD0gbmliICYmIG5pYiA8PSB0aGlzLmNvZGVfOSkge1xuICAgICAgICAgICAgdmFsdWUgPSBuaWIgLSB0aGlzLmNvZGVfMDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvZGVfYSA8PSBuaWIgJiYgbmliIDw9IHRoaXMuY29kZV9mKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG5pYiAtIHRoaXMuY29kZV9hICsgMTA7XG4gICAgICAgIH1cbiAgICAgICAgbmliYmxlWzBdID0gKHZhbHVlICYgOCkgPiAwID8gMSA6IDA7XG4gICAgICAgIG5pYmJsZVsxXSA9ICh2YWx1ZSAmIDQpID4gMCA/IDEgOiAwO1xuICAgICAgICBuaWJibGVbMl0gPSAodmFsdWUgJiAyKSA+IDAgPyAxIDogMDtcbiAgICAgICAgbmliYmxlWzNdID0gKHZhbHVlICYgMSkgPiAwID8gMSA6IDA7XG4gICAgICAgIHJldHVybiBuaWJibGU7XG4gICAgfVxuXG4gICAgZW5jb2RlTmliYmxlKGluZGV4Om51bWJlciwgYml0czpudW1iZXJbXSkge1xuICAgICAgICB2YXIgdmFsdWUgPSAwO1xuICAgICAgICB2YWx1ZSArPSBiaXRzW2luZGV4ICsgMF0gPT0gMSA/IDggOiAwO1xuICAgICAgICB2YWx1ZSArPSBiaXRzW2luZGV4ICsgMV0gPT0gMSA/IDQgOiAwO1xuICAgICAgICB2YWx1ZSArPSBiaXRzW2luZGV4ICsgMl0gPT0gMSA/IDIgOiAwO1xuICAgICAgICB2YWx1ZSArPSBiaXRzW2luZGV4ICsgM10gPT0gMSA/IDEgOiAwO1xuICAgICAgICBpZiAoMCA8PSB2YWx1ZSAmJiB2YWx1ZSA8PSA5KSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIiArIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCh2YWx1ZSkge1xuICAgICAgICAgICAgY2FzZSAxMDogcmV0dXJuIFwiYVwiO1xuICAgICAgICAgICAgY2FzZSAxMTogcmV0dXJuIFwiYlwiO1xuICAgICAgICAgICAgY2FzZSAxMjogcmV0dXJuIFwiY1wiO1xuICAgICAgICAgICAgY2FzZSAxMzogcmV0dXJuIFwiZFwiO1xuICAgICAgICAgICAgY2FzZSAxNDogcmV0dXJuIFwiZVwiO1xuICAgICAgICAgICAgY2FzZSAxNTogcmV0dXJuIFwiZlwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIj9cIjtcbiAgICB9XG5cbiAgICAvLyBfbnVtIGlzIGFuIGhleGFcbiAgICBkZWNvZGVVaW50NjQoX251bTogc3RyaW5nKSB7XG4gICAgICAgIHZhciBiaXRzOm51bWJlcltdID0gW107XG4gICAgICAgIHZhciBudW06c3RyaW5nID0gX251bS5zdWJzdHIoMik7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxudW0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJpdHMgPSBiaXRzLmNvbmNhdCh0aGlzLmRlY29kZU5pYmJsZShudW0uY2hhckNvZGVBdChpKSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiaXRzO1xuICAgIH1cblxuICAgIGVuY29kZVVuaXQ2NChiaXRzOm51bWJlcltdKSB7XG4gICAgICAgIHZhciBzbHVnaWQ6U2x1Z0lkID0ge3RvcDpcIjB4XCIsbG93OlwiMHhcIn07XG4gICAgICAgIHZhciBzdHIgPSBcInRvcFwiO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8Yml0cy5sZW5ndGg7IGkrPTQpIHtcbiAgICAgICAgICAgIGlmIChpPj0xMjgpIHN0ciA9IFwibG93XCI7XG4gICAgICAgICAgICBzbHVnaWRbc3RyXSArPSB0aGlzLmVuY29kZU5pYmJsZShpLCBiaXRzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2x1Z2lkO1xuICAgIH1cblxuICAgIGV4dHJhY3RMZW5ndGgoYml0czpudW1iZXJbXSkge1xuICAgICAgICBpZihiaXRzLmxlbmd0aCAhPSAyNTYpIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjogZXh0cmFjdExlbmd0aChiaXRzKSBiaXRzIG11c3QgYmUgYW4gYXJyYXkgb2YgMjU2IGJpdHNcIik7XG4gICAgICAgIHJldHVybiBiaXRzWzI1MF0gKiAzMiArIGJpdHNbMjUxXSAqIDE2ICsgYml0c1syNTJdICogOCArIGJpdHNbMjUzXSAqIDQgKyBiaXRzWzI1NF0gKiAyICsgYml0c1syNTVdICogMTtcbiAgICB9XG5cbiAgICBpbnNlcnRMZW5ndGgoYml0czpudW1iZXJbXSwgbGVuZ3RoOiBudW1iZXIpIHtcbiAgICAgICAgaWYoYml0cy5sZW5ndGggIT0gMjU2KSBjb25zb2xlLmVycm9yKFwiRVJST1I6IGV4dHJhY3RMZW5ndGgoYml0cykgYml0cyBtdXN0IGJlIGFuIGFycmF5IG9mIDI1NiBiaXRzXCIpO1xuICAgICAgICBiaXRzWzI1MF0gPSAobGVuZ3RoICYgMzIpID8gMSA6IDA7XG4gICAgICAgIGJpdHNbMjUxXSA9IChsZW5ndGggJiAxNikgPyAxIDogMDtcbiAgICAgICAgYml0c1syNTJdID0gKGxlbmd0aCAmICA4KSA/IDEgOiAwO1xuICAgICAgICBiaXRzWzI1M10gPSAobGVuZ3RoICYgIDQpID8gMSA6IDA7XG4gICAgICAgIGJpdHNbMjU0XSA9IChsZW5ndGggJiAgMikgPyAxIDogMDtcbiAgICAgICAgYml0c1syNTVdID0gKGxlbmd0aCAmICAxKSA/IDEgOiAwO1xuICAgIH1cblxuICAgIHZhbHVlVG9DaGFyKHY6bnVtYmVyKSB7XG4gICAgICAgIGlmICh2ID09IDApIHJldHVybiAnLic7XG4gICAgICAgIGlmICh2ID09IDEpIHJldHVybiAnLSc7XG4gICAgICAgIGlmICh2IDwgNikgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUodiArIHRoaXMuY29kZV8wIC0gMSk7XG4gICAgICAgIGlmICh2IDwgMzIpIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHYgKyB0aGlzLmNvZGVfYSAtIDYpO1xuICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgXCJFUlJPUjogdmFsdWUgb3V0IG9mIHJhbmdlIFswLTMxXVwiLCB2KTtcbiAgICAgICAgcmV0dXJuICc/JzsgICAgICAgICAgICAgICAgICAgXG4gICAgfVxuXG4gICAgY2hhclRvVmFsdWUoYzpzdHJpbmcpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoYy5sZW5ndGggPT0gMSwgXCJFUlJPUjogYyBNVVNUIGJlIGEgY2hhcmFjdGVyIChzdHJpbmcgd2l0aCBsZW5ndGggPT0gMSkuIEdvdFwiLCB0eXBlb2YgYywgYyk7XG4gICAgICAgIGlmIChjID09IFwiLlwiKSByZXR1cm4gMDtcbiAgICAgICAgaWYgKGMgPT0gXCItXCIpIHJldHVybiAxO1xuICAgICAgICBpZiAodGhpcy5jb2RlXzAgPCBjLmNoYXJDb2RlQXQoMCkgJiYgYy5jaGFyQ29kZUF0KDApIDw9IHRoaXMuY29kZV80KSByZXR1cm4gYy5jaGFyQ29kZUF0KDApIC0gdGhpcy5jb2RlXzEgKyAyO1xuICAgICAgICBpZiAodGhpcy5jb2RlX2EgPD0gYy5jaGFyQ29kZUF0KDApICYmIGMuY2hhckNvZGVBdCgwKSA8PSB0aGlzLmNvZGVfeikgcmV0dXJuIGMuY2hhckNvZGVBdCgwKSAtIHRoaXMuY29kZV9hICsgNjtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIFwiRVJST1I6IGNoYXJhY3RlciAnXCIgKyBjICsgXCInIGlzIG5vdCBpbiBhbGxvd2VkIGNoYXJhY3RlciBzZXQgZm9yIHNsdWdpZCBcIik7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBleHRyYWN0Q2hhcihjOm51bWJlciwgYml0czpudW1iZXJbXSkge1xuICAgICAgICB2YXIgZW5jb2RlID0gNTtcbiAgICAgICAgdmFyIHBvdCA9IE1hdGgucG93KDIsIGVuY29kZS0xKTsgLy8gMTZcbiAgICAgICAgdmFyIHZhbHVlID0gMDtcbiAgICAgICAgdmFyIGluZGV4ID0gYyAqIGVuY29kZTtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPGVuY29kZTsgaSsrLCBwb3QgPSBwb3QvMikge1xuICAgICAgICAgICAgdmFsdWUgKz0gYml0c1tpbmRleCArIGldICogcG90O1xuICAgICAgICB9XG4gICAgICAgIHZhciBjaGFyID0gdGhpcy52YWx1ZVRvQ2hhcih2YWx1ZSk7XG4gICAgICAgIHJldHVybiBjaGFyO1xuICAgIH1cblxuICAgIGluc2VydENoYXIodmFsdWU6bnVtYmVyLCBqOm51bWJlciwgYml0czpudW1iZXJbXSkge1xuICAgICAgICB2YXIgZW5jb2RlID0gNTtcbiAgICAgICAgdmFyIGluZGV4ID0gaiAqIGVuY29kZTtcbiAgICAgICAgYml0c1tpbmRleCArIDBdID0gKHZhbHVlICYgMTYpID4gMCA/IDEgOiAwO1xuICAgICAgICBiaXRzW2luZGV4ICsgMV0gPSAodmFsdWUgJiAgOCkgPiAwID8gMSA6IDA7XG4gICAgICAgIGJpdHNbaW5kZXggKyAyXSA9ICh2YWx1ZSAmICA0KSA+IDAgPyAxIDogMDtcbiAgICAgICAgYml0c1tpbmRleCArIDNdID0gKHZhbHVlICYgIDIpID4gMCA/IDEgOiAwOyAgICAgICAgICAgIFxuICAgICAgICBiaXRzW2luZGV4ICsgNF0gPSAodmFsdWUgJiAgMSkgPiAwID8gMSA6IDA7XG4gICAgfVxuXG4gICAgZGVjb2RlU2x1ZyhzbHVpZzpTbHVnSWQpIHtcbiAgICAgICAgLy8gZGVjb2RlU2x1ZygpIDB4NDFhZTljMDRkMzQ4NzM0ODJhNzgwMDAwMDAwMDAwMDAgMHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMFxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImRlY29kZVNsdWcoKVwiLCBuaWNrLnRvcCwgbmljay5sb3cpO1xuICAgICAgICB2YXIgYml0czpudW1iZXJbXSA9IFtdO1xuICAgICAgICBiaXRzID0gdGhpcy5kZWNvZGVVaW50NjQoc2x1aWcudG9wKS5jb25jYXQodGhpcy5kZWNvZGVVaW50NjQoc2x1aWcubG93KSk7XG4gICAgICAgIHZhciBsZW5ndGggPSBiaXRzWzI1MF0gKiAzMiArIGJpdHNbMjUxXSAqIDE2ICsgYml0c1syNTJdICogOCArIGJpdHNbMjUzXSAqIDQgKyBiaXRzWzI1NF0gKiAyICsgYml0c1syNTVdICogMTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJsZW5ndGg6IFwiLCBsZW5ndGgpO1xuICAgICAgICB2YXIgc3RyOnN0cmluZyA9IFwiXCI7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc3RyICs9IHRoaXMuZXh0cmFjdENoYXIoaSwgYml0cyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJzdHI6IFwiLCBzdHIpO1xuICAgICAgICBzbHVpZy5zdHIgPSBzdHI7XG4gICAgICAgIHJldHVybiBzbHVpZztcbiAgICB9XG5cbiAgICBlbmNvZGVTbHVnKG5hbWU6c3RyaW5nKTpTbHVnSWQge1xuICAgICAgICB2YXIgYml0cyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8MjU2OyBpKyspIHtcbiAgICAgICAgICAgIGJpdHMucHVzaCgwKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpPTA7IGk8bmFtZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5jaGFyVG9WYWx1ZShuYW1lW2ldKTtcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0Q2hhcih2YWx1ZSwgaSwgYml0cyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnNlcnRMZW5ndGgoYml0cywgbmFtZS5sZW5ndGgpO1xuICAgICAgICB2YXIgc2x1ZyA9IHRoaXMuZW5jb2RlVW5pdDY0KGJpdHMpO1xuXG4gICAgICAgIHNsdWcgPSB0aGlzLmRlY29kZVNsdWcoc2x1Zyk7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KHNsdWcuc3RyID09IG5hbWUsIFwiRVJST1I6IHNsdWcuc3RyOiBcIiwgc2x1Zy5zdHIsIFtzbHVnLnN0cl0sIFtuYW1lXSk7XG5cbiAgICAgICAgcmV0dXJuIHNsdWc7XG4gICAgfVxuXG4gICAgc2x1Z1RvMTI4Yml0cyhzbHVnOlNsdWdJZCk6c3RyaW5nIHtcbiAgICAgICAgdmFyIHN0ciA9IFwiMHhcIjtcbiAgICAgICAgdmFyIHRvcGJpdHMgPSB0aGlzLmRlY29kZVVpbnQ2NChzbHVnLnRvcCk7XG4gICAgICAgIHZhciBsb3diaXRzID0gdGhpcy5kZWNvZGVVaW50NjQoc2x1Zy5sb3cpO1xuICAgICAgICB2YXIgbWl4Yml0cyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dG9wYml0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbWl4Yml0cy5wdXNoKHRvcGJpdHNbaV0gXiBsb3diaXRzW2ldID8gMSA6IDApO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxtaXhiaXRzLmxlbmd0aDsgaSs9NCkge1xuICAgICAgICAgICAgc3RyICs9IHRoaXMuZW5jb2RlTmliYmxlKGksIG1peGJpdHMpO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgLy8gKGVuZCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvLyBPTEQgZW9zanMgZW5jb2RlTmFtZSBzb2x1dGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjaGFybWFwID0gJy4xMjM0NWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JztcbiAgICBjaGFyaWR4ID0gY2ggPT4ge1xuICAgICAgICBjb25zdCBpZHggPSB0aGlzLmNoYXJtYXAuaW5kZXhPZihjaClcbiAgICAgICAgaWYoaWR4ID09PSAtMSlcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBJbnZhbGlkIGNoYXJhY3RlcjogJyR7Y2h9J2ApXG4gICAgICBcbiAgICAgICAgcmV0dXJuIGlkeDtcbiAgICB9XG4gICAgb2xkRW9zanNFbmNvZGVOYW1lKG5hbWUsIGxpdHRsZUVuZGlhbiA9IGZhbHNlKSB7XG4gICAgICAgIGlmKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJylcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCduYW1lIHBhcmFtZXRlciBpcyBhIHJlcXVpcmVkIHN0cmluZycpXG4gICAgICBcbiAgICAgICAgaWYobmFtZS5sZW5ndGggPiAxMilcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBIG5hbWUgY2FuIGJlIHVwIHRvIDEyIGNoYXJhY3RlcnMgbG9uZycpXG4gICAgICBcbiAgICAgICAgbGV0IGJpdHN0ciA9ICcnXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPD0gMTI7IGkrKykgeyAvLyBwcm9jZXNzIGFsbCA2NCBiaXRzIChldmVuIGlmIG5hbWUgaXMgc2hvcnQpXG4gICAgICAgICAgY29uc3QgYyA9IGkgPCBuYW1lLmxlbmd0aCA/IHRoaXMuY2hhcmlkeChuYW1lW2ldKSA6IDBcbiAgICAgICAgICBjb25zdCBiaXRsZW4gPSBpIDwgMTIgPyA1IDogNFxuICAgICAgICAgIGxldCBiaXRzID0gTnVtYmVyKGMpLnRvU3RyaW5nKDIpXG4gICAgICAgICAgaWYoYml0cy5sZW5ndGggPiBiaXRsZW4pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgbmFtZSAnICsgbmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgYml0cyA9ICcwJy5yZXBlYXQoYml0bGVuIC0gYml0cy5sZW5ndGgpICsgYml0c1xuICAgICAgICAgIGJpdHN0ciArPSBiaXRzXG4gICAgICAgIH1cbiAgICAgIFxuICAgICAgICBjb25zdCB2YWx1ZSA9IExvbmcuZnJvbVN0cmluZyhiaXRzdHIsIHRydWUsIDIpXG4gICAgICBcbiAgICAgICAgLy8gY29udmVydCB0byBMSVRUTEVfRU5ESUFOXG4gICAgICAgIGxldCBsZUhleCA9ICcnXG4gICAgICAgIGNvbnN0IGJ5dGVzID0gbGl0dGxlRW5kaWFuID8gdmFsdWUudG9CeXRlc0xFKCkgOiB2YWx1ZS50b0J5dGVzQkUoKVxuICAgICAgICBmb3IoY29uc3QgYiBvZiBieXRlcykge1xuICAgICAgICAgIGNvbnN0IG4gPSBOdW1iZXIoYikudG9TdHJpbmcoMTYpXG4gICAgICAgICAgbGVIZXggKz0gKG4ubGVuZ3RoID09PSAxID8gJzAnIDogJycpICsgblxuICAgICAgICB9XG4gICAgICBcbiAgICAgICAgY29uc3QgdWxOYW1lID0gTG9uZy5mcm9tU3RyaW5nKGxlSGV4LCB0cnVlLCAxNikudG9TdHJpbmcoKVxuICAgICAgXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdlbmNvZGVOYW1lJywgbmFtZSwgdmFsdWUudG9TdHJpbmcoKSwgdWxOYW1lLnRvU3RyaW5nKCksIEpTT04uc3RyaW5naWZ5KGJpdHN0ci5zcGxpdCgvKC4uLi4uKS8pLnNsaWNlKDEpKSlcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB1bE5hbWUudG9TdHJpbmcoKVxuICAgIH1cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBlbmNvZGVOYW1lKG5hbWU6c3RyaW5nKTpCaWdOdW1iZXIge1xuICAgICAgICAvKlxuICAgICAgICBjb25zdCBidWZmZXI6IFNlcmlhbGl6ZS5TZXJpYWxCdWZmZXIgPSBuZXcgU2VyaWFsaXplLlNlcmlhbEJ1ZmZlcigpO1xuICAgICAgICBidWZmZXIucHVzaE5hbWUobmFtZSk7XG4gICAgICAgIHZhciBudW1iZXIgPSBidWZmZXIuZ2V0VWludDY0QXNOdW1iZXIoKTtcbiAgICAgICAgKi9cbiAgICAgICAgdmFyIG51bWJlciA9IHRoaXMub2xkRW9zanNFbmNvZGVOYW1lKG5hbWUpO1xuICAgICAgICByZXR1cm4gbmV3IEJpZ051bWJlcihudW1iZXIpO1xuICAgIH1cblxufSJdfQ==