/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import BigNumber from "bignumber.js";
import { Token } from "./token.class";
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
export { Asset };
if (false) {
    /** @type {?} */
    Asset.prototype.amount;
    /** @type {?} */
    Asset.prototype.token;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXQuY2xhc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AdmFwYWVlL3NjYXR0ZXIvIiwic291cmNlcyI6WyJsaWIvYXNzZXQuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sU0FBUyxNQUFNLGNBQWMsQ0FBQztBQUNyQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXRDLElBQUE7SUFJSSxlQUFZLENBQWEsRUFBRSxDQUFhO1FBQTVCLGtCQUFBLEVBQUEsUUFBYTtRQUFFLGtCQUFBLEVBQUEsUUFBYTtRQUNwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ3pCLE1BQU0sQ0FBQztTQUNWO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDZixNQUFNLENBQUM7U0FDVjtRQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNmLE1BQU0sQ0FBQztTQUNWO1FBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxL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QVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUMvRTs7Ozs7SUFFRCx1QkFBTzs7OztJQUFQLFVBQVEsS0FBWTs7UUFDaEIsSUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7UUFDckQsSUFBSSxLQUFLLEdBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxLQUFLLENBQUM7S0FDaEI7Z0JBM0hMO0lBNEhDLENBQUE7QUF6SEQsaUJBeUhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJpZ051bWJlciBmcm9tIFwiYmlnbnVtYmVyLmpzXCI7XG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuL3Rva2VuLmNsYXNzXCI7XG5cbmV4cG9ydCBjbGFzcyBBc3NldCB7XG4gICAgYW1vdW50OkJpZ051bWJlcjtcbiAgICB0b2tlbjpUb2tlbjtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihhOiBhbnkgPSBudWxsLCBiOiBhbnkgPSBudWxsKSB7XG4gICAgICAgIGlmIChhID09IG51bGwgJiYgYiA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmFtb3VudCA9IG5ldyBCaWdOdW1iZXIoMCk7XG4gICAgICAgICAgICB0aGlzLnRva2VuID0gbmV3IFRva2VuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEJpZ051bWJlcikge1xuICAgICAgICAgICAgdGhpcy5hbW91bnQgPSBhO1xuICAgICAgICAgICAgdGhpcy50b2tlbiA9IGI7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEFzc2V0KSB7XG4gICAgICAgICAgICB0aGlzLmFtb3VudCA9IGEuYW1vdW50O1xuICAgICAgICAgICAgdGhpcy50b2tlbiA9IGI7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGEgPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgdGhpcy5hbW91bnQgPSBuZXcgQmlnTnVtYmVyKGEpO1xuICAgICAgICAgICAgdGhpcy50b2tlbiA9IGI7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGEgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhpcy5wYXJzZShhKTtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHRoaXMuYW1vdW50IGluc3RhbmNlb2YgQmlnTnVtYmVyLCBcIkVSUk9SOiBBc3NldCBzdHJpbmcgbWFsZm9ybWVkOiAnXCIrYStcIidcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwbHVzKGI6QXNzZXQpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoISFiLCBcIkVSUk9SOiBiIGlzIG5vdCBhbiBBc3NldFwiLCBiLCB0aGlzLnN0cik7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGIudG9rZW4uc3ltYm9sID09IHRoaXMudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiB0cnlpbmcgdG8gc3VtIGFzc2V0cyB3aXRoIGRpZmZlcmVudCB0b2tlbnM6IFwiICsgdGhpcy5zdHIgKyBcIiBhbmQgXCIgKyBiLnN0cik7XG4gICAgICAgIHZhciBhbW91bnQgPSB0aGlzLmFtb3VudC5wbHVzKGIuYW1vdW50KTtcbiAgICAgICAgcmV0dXJuIG5ldyBBc3NldChhbW91bnQsIHRoaXMudG9rZW4pO1xuICAgIH1cblxuICAgIG1pbnVzKGI6QXNzZXQpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoISFiLCBcIkVSUk9SOiBiIGlzIG5vdCBhbiBBc3NldFwiLCBiLCB0aGlzLnN0cik7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGIudG9rZW4uc3ltYm9sID09IHRoaXMudG9rZW4uc3ltYm9sLCBcIkVSUk9SOiB0cnlpbmcgdG8gc3Vic3RyYWN0IGFzc2V0cyB3aXRoIGRpZmZlcmVudCB0b2tlbnM6IFwiICsgdGhpcy5zdHIgKyBcIiBhbmQgXCIgKyBiLnN0cik7XG4gICAgICAgIHZhciBhbW91bnQgPSB0aGlzLmFtb3VudC5taW51cyhiLmFtb3VudCk7XG4gICAgICAgIHJldHVybiBuZXcgQXNzZXQoYW1vdW50LCB0aGlzLnRva2VuKTtcbiAgICB9XG5cbiAgICBjbG9uZSgpOiBBc3NldCB7XG4gICAgICAgIHJldHVybiBuZXcgQXNzZXQodGhpcy5hbW91bnQsIHRoaXMudG9rZW4pO1xuICAgIH1cblxuICAgIHBhcnNlKHRleHQ6IHN0cmluZykge1xuICAgICAgICBpZiAodGV4dCA9PSBcIlwiKSByZXR1cm47XG4gICAgICAgIHZhciBzeW0gPSB0ZXh0LnNwbGl0KFwiIFwiKVsxXTtcbiAgICAgICAgdmFyIGFtb3VudF9zdHIgPSB0ZXh0LnNwbGl0KFwiIFwiKVswXTtcbiAgICAgICAgdGhpcy5hbW91bnQgPSBuZXcgQmlnTnVtYmVyKGFtb3VudF9zdHIpO1xuXG4gICAgICAgIHZhciBwcmVjaXNpb24gPSAwO1xuICAgICAgICBpZiAoYW1vdW50X3N0ci5zcGxpdChcIi5cIikubGVuZ3RoID09IDIpIHtcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IGFtb3VudF9zdHIuc3BsaXQoXCIuXCIpWzFdLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIGlmIChhbW91bnRfc3RyLnNwbGl0KFwiLlwiKS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgaWYgKGlzTmFOKHBhcnNlSW50KGFtb3VudF9zdHIpKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjogQXNzZXQgbWFsZm9ybWVkIHN0cmluZzogJ1wiK3RleHQrXCInXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLnRva2VuID0gbmV3IFRva2VuKHtcbiAgICAgICAgICAgIHN5bWJvbDogc3ltLFxuICAgICAgICAgICAgcHJlY2lzaW9uOiBwcmVjaXNpb25cbiAgICAgICAgfSk7IFxuICAgIH1cblxuICAgIHZhbHVlVG9TdHJpbmcoZGVjaW1hbHM6bnVtYmVyID0gLTEsIHRvdGFsOmJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy50b2tlbikgcmV0dXJuIFwiMFwiO1xuICAgICAgICB2YXIgcGFydHMgPSB0aGlzLmFtb3VudC50b0ZpeGVkKCkuc3BsaXQoXCIuXCIpO1xuICAgICAgICB2YXIgaW50ZWdlciA9IHBhcnRzWzBdO1xuICAgICAgICB2YXIgcHJlY2lzaW9uID0gdGhpcy50b2tlbi5wcmVjaXNpb247XG4gICAgICAgIHZhciBkZWNpbWFsID0gKHBhcnRzLmxlbmd0aD09MiA/IHBhcnRzWzFdIDogXCJcIik7XG4gICAgICAgIGlmIChkZWNpbWFscyAhPSAtMSkge1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gZGVjaW1hbHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRvdGFsKSB7XG4gICAgICAgICAgICBwcmVjaXNpb24gLT0gcGFydHNbMF0ubGVuZ3RoLTE7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSBwcmVjaXNpb24gPiAwID8gcHJlY2lzaW9uIDogMDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpPWRlY2ltYWwubGVuZ3RoOyBpPHByZWNpc2lvbjsgaSsrKSB7XG4gICAgICAgICAgICBkZWNpbWFsICs9IFwiMFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkZWNpbWFsLmxlbmd0aCA+IHByZWNpc2lvbikge1xuICAgICAgICAgICAgZGVjaW1hbCA9IGRlY2ltYWwuc3Vic3RyKDAsIHByZWNpc2lvbik7XG4gICAgICAgIH0gICAgXG5cbiAgICAgICAgaWYgKHByZWNpc2lvbiA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gaW50ZWdlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbnRlZ2VyICsgXCIuXCIgKyBkZWNpbWFsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9OdW1iZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy50b2tlbikgcmV0dXJuIDA7XG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHRoaXMudmFsdWVUb1N0cmluZyg4KSk7XG4gICAgfVxuXG4gICAgZ2V0IHN0ciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoZGVjaW1hbHM6bnVtYmVyID0gLTEpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMudG9rZW4pIHJldHVybiBcIjAuMDAwMFwiO1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVRvU3RyaW5nKGRlY2ltYWxzKSArIFwiIFwiICsgdGhpcy50b2tlbi5zeW1ib2wudG9VcHBlckNhc2UoKTtcbiAgICB9XG5cbiAgICBpbnZlcnNlKHRva2VuOiBUb2tlbik6IEFzc2V0IHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBCaWdOdW1iZXIoMSkuZGl2aWRlZEJ5KHRoaXMuYW1vdW50KTtcbiAgICAgICAgdmFyIGFzc2V0ID0gIG5ldyBBc3NldChyZXN1bHQsIHRva2VuKTtcbiAgICAgICAgcmV0dXJuIGFzc2V0O1xuICAgIH1cbn0iXX0=