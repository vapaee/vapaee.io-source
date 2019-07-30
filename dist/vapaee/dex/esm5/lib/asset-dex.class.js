/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import BigNumber from 'bignumber.js';
import { Asset } from '@vapaee/scatter';
/**
 * @record
 */
export function IVapaeeDEX() { }
/** @type {?} */
IVapaeeDEX.prototype.getTokenNow;
var AssetDEX = /** @class */ (function (_super) {
    tslib_1.__extends(AssetDEX, _super);
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
export { AssetDEX };
if (false) {
    /** @type {?} */
    AssetDEX.prototype.amount;
    /** @type {?} */
    AssetDEX.prototype.token;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXQtZGV4LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHZhcGFlZS9kZXgvIiwic291cmNlcyI6WyJsaWIvYXNzZXQtZGV4LmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxTQUFTLE1BQU0sY0FBYyxDQUFDO0FBRXJDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7OztBQU14QyxJQUFBO0lBQThCLG9DQUFLO0lBSS9CLGtCQUFZLENBQWEsRUFBRSxDQUFhO1FBQTVCLGtCQUFBLEVBQUEsUUFBYTtRQUFFLGtCQUFBLEVBQUEsUUFBYTtRQUF4QyxZQUNJLGtCQUFNLENBQUMsRUFBQyxDQUFDLENBQUMsU0FZYjtRQVZHLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLEtBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUN2QixLQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQzs7U0FFbEI7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdEI7O0tBRUo7Ozs7SUFFRCx3QkFBSzs7O0lBQUw7UUFDSSxNQUFNLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDaEQ7Ozs7O0lBRUQsdUJBQUk7Ozs7SUFBSixVQUFLLENBQVU7UUFDWCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsMEJBQTBCLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3RCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLHFEQUFxRCxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFDeEksSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzNDOzs7OztJQUVELHdCQUFLOzs7O0lBQUwsVUFBTSxDQUFVO1FBQ1osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLDBCQUEwQixFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0QsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSwyREFBMkQsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O1FBQzlJLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMzQzs7Ozs7O0lBRUQsMkJBQVE7Ozs7O0lBQVIsVUFBUyxJQUFZLEVBQUUsR0FBZTtRQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQUMsTUFBTSxDQUFDOztRQUN2QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFDbEMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzNDOzs7OztJQUdELDJCQUFROzs7O0lBQVIsVUFBUyxRQUFvQjtRQUFwQix5QkFBQSxFQUFBLFlBQW1CLENBQUM7UUFDekIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDL0U7Ozs7O0lBRUQsMEJBQU87Ozs7SUFBUCxVQUFRLEtBQWU7O1FBQ25CLElBQUksTUFBTSxHQUFHLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O1FBQ3JELElBQUksS0FBSyxHQUFJLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsS0FBSyxDQUFDO0tBQ2hCO21CQS9ETDtFQVE4QixLQUFLLEVBd0RsQyxDQUFBO0FBeERELG9CQXdEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCaWdOdW1iZXIgZnJvbSAnYmlnbnVtYmVyLmpzJztcbmltcG9ydCB7IFRva2VuREVYIH0gZnJvbSAnLi90b2tlbi1kZXguY2xhc3MnO1xuaW1wb3J0IHsgQXNzZXQgfSBmcm9tICdAdmFwYWVlL3NjYXR0ZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIElWYXBhZWVERVgge1xuICAgIGdldFRva2VuTm93KHN5bWJvbDpzdHJpbmcpOiBUb2tlbkRFWDtcbn1cblxuZXhwb3J0IGNsYXNzIEFzc2V0REVYIGV4dGVuZHMgQXNzZXQge1xuICAgIGFtb3VudDpCaWdOdW1iZXI7XG4gICAgdG9rZW46VG9rZW5ERVg7XG4gICAgXG4gICAgY29uc3RydWN0b3IoYTogYW55ID0gbnVsbCwgYjogYW55ID0gbnVsbCkge1xuICAgICAgICBzdXBlcihhLGIpO1xuXG4gICAgICAgIGlmIChhIGluc3RhbmNlb2YgQXNzZXRERVgpIHtcbiAgICAgICAgICAgIHRoaXMuYW1vdW50ID0gYS5hbW91bnQ7XG4gICAgICAgICAgICB0aGlzLnRva2VuID0gYjtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghIWIgJiYgYlsnZ2V0VG9rZW5Ob3cnXSkge1xuICAgICAgICAgICAgdGhpcy5wYXJzZURleChhLGIpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjbG9uZSgpOiBBc3NldERFWCB7XG4gICAgICAgIHJldHVybiBuZXcgQXNzZXRERVgodGhpcy5hbW91bnQsIHRoaXMudG9rZW4pO1xuICAgIH1cblxuICAgIHBsdXMoYjpBc3NldERFWCkge1xuICAgICAgICBjb25zb2xlLmFzc2VydCghIWIsIFwiRVJST1I6IGIgaXMgbm90IGFuIEFzc2V0XCIsIGIsIHRoaXMuc3RyKTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoYi50b2tlbi5zeW1ib2wgPT0gdGhpcy50b2tlbi5zeW1ib2wsIFwiRVJST1I6IHRyeWluZyB0byBzdW0gYXNzZXRzIHdpdGggZGlmZmVyZW50IHRva2VuczogXCIgKyB0aGlzLnN0ciArIFwiIGFuZCBcIiArIGIuc3RyKTtcbiAgICAgICAgdmFyIGFtb3VudCA9IHRoaXMuYW1vdW50LnBsdXMoYi5hbW91bnQpO1xuICAgICAgICByZXR1cm4gbmV3IEFzc2V0REVYKGFtb3VudCwgdGhpcy50b2tlbik7XG4gICAgfVxuXG4gICAgbWludXMoYjpBc3NldERFWCkge1xuICAgICAgICBjb25zb2xlLmFzc2VydCghIWIsIFwiRVJST1I6IGIgaXMgbm90IGFuIEFzc2V0XCIsIGIsIHRoaXMuc3RyKTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoYi50b2tlbi5zeW1ib2wgPT0gdGhpcy50b2tlbi5zeW1ib2wsIFwiRVJST1I6IHRyeWluZyB0byBzdWJzdHJhY3QgYXNzZXRzIHdpdGggZGlmZmVyZW50IHRva2VuczogXCIgKyB0aGlzLnN0ciArIFwiIGFuZCBcIiArIGIuc3RyKTtcbiAgICAgICAgdmFyIGFtb3VudCA9IHRoaXMuYW1vdW50Lm1pbnVzKGIuYW1vdW50KTtcbiAgICAgICAgcmV0dXJuIG5ldyBBc3NldERFWChhbW91bnQsIHRoaXMudG9rZW4pO1xuICAgIH0gICAgXG5cbiAgICBwYXJzZURleCh0ZXh0OiBzdHJpbmcsIGRleDogSVZhcGFlZURFWCkge1xuICAgICAgICBpZiAodGV4dCA9PSBcIlwiKSByZXR1cm47XG4gICAgICAgIHZhciBzeW0gPSB0ZXh0LnNwbGl0KFwiIFwiKVsxXTtcbiAgICAgICAgdGhpcy50b2tlbiA9IGRleC5nZXRUb2tlbk5vdyhzeW0pO1xuICAgICAgICB2YXIgYW1vdW50X3N0ciA9IHRleHQuc3BsaXQoXCIgXCIpWzBdO1xuICAgICAgICB0aGlzLmFtb3VudCA9IG5ldyBCaWdOdW1iZXIoYW1vdW50X3N0cik7XG4gICAgfVxuXG4gICAgXG4gICAgdG9TdHJpbmcoZGVjaW1hbHM6bnVtYmVyID0gLTEpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMudG9rZW4pIHJldHVybiBcIjAuMDAwMFwiO1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVRvU3RyaW5nKGRlY2ltYWxzKSArIFwiIFwiICsgdGhpcy50b2tlbi5zeW1ib2wudG9VcHBlckNhc2UoKTtcbiAgICB9XG5cbiAgICBpbnZlcnNlKHRva2VuOiBUb2tlbkRFWCk6IEFzc2V0REVYIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBCaWdOdW1iZXIoMSkuZGl2aWRlZEJ5KHRoaXMuYW1vdW50KTtcbiAgICAgICAgdmFyIGFzc2V0ID0gIG5ldyBBc3NldERFWChyZXN1bHQsIHRva2VuKTtcbiAgICAgICAgcmV0dXJuIGFzc2V0O1xuICAgIH1cbn0iXX0=