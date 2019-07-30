/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import BigNumber from 'bignumber.js';
import { Asset } from '@vapaee/scatter';
/**
 * @record
 */
export function IVapaeeDEX() { }
/** @type {?} */
IVapaeeDEX.prototype.getTokenNow;
export class AssetDEX extends Asset {
    /**
     * @param {?=} a
     * @param {?=} b
     */
    constructor(a = null, b = null) {
        super(a, b);
        if (a instanceof AssetDEX) {
            this.amount = a.amount;
            this.token = b;
            return;
        }
        if (!!b && b['getTokenNow']) {
            this.parseDex(a, b);
        }
    }
    /**
     * @return {?}
     */
    clone() {
        return new AssetDEX(this.amount, this.token);
    }
    /**
     * @param {?} b
     * @return {?}
     */
    plus(b) {
        console.assert(!!b, "ERROR: b is not an Asset", b, this.str);
        console.assert(b.token.symbol == this.token.symbol, "ERROR: trying to sum assets with different tokens: " + this.str + " and " + b.str);
        /** @type {?} */
        var amount = this.amount.plus(b.amount);
        return new AssetDEX(amount, this.token);
    }
    /**
     * @param {?} b
     * @return {?}
     */
    minus(b) {
        console.assert(!!b, "ERROR: b is not an Asset", b, this.str);
        console.assert(b.token.symbol == this.token.symbol, "ERROR: trying to substract assets with different tokens: " + this.str + " and " + b.str);
        /** @type {?} */
        var amount = this.amount.minus(b.amount);
        return new AssetDEX(amount, this.token);
    }
    /**
     * @param {?} text
     * @param {?} dex
     * @return {?}
     */
    parseDex(text, dex) {
        if (text == "")
            return;
        /** @type {?} */
        var sym = text.split(" ")[1];
        this.token = dex.getTokenNow(sym);
        /** @type {?} */
        var amount_str = text.split(" ")[0];
        this.amount = new BigNumber(amount_str);
    }
    /**
     * @param {?=} decimals
     * @return {?}
     */
    toString(decimals = -1) {
        if (!this.token)
            return "0.0000";
        return this.valueToString(decimals) + " " + this.token.symbol.toUpperCase();
    }
    /**
     * @param {?} token
     * @return {?}
     */
    inverse(token) {
        /** @type {?} */
        var result = new BigNumber(1).dividedBy(this.amount);
        /** @type {?} */
        var asset = new AssetDEX(result, token);
        return asset;
    }
}
if (false) {
    /** @type {?} */
    AssetDEX.prototype.amount;
    /** @type {?} */
    AssetDEX.prototype.token;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXQtZGV4LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHZhcGFlZS9kZXgvIiwic291cmNlcyI6WyJsaWIvYXNzZXQtZGV4LmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLFNBQVMsTUFBTSxjQUFjLENBQUM7QUFFckMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7Ozs7O0FBTXhDLE1BQU0sZUFBZ0IsU0FBUSxLQUFLOzs7OztJQUkvQixZQUFZLElBQVMsSUFBSSxFQUFFLElBQVMsSUFBSTtRQUNwQyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVgsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxDQUFDO1NBQ1Y7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdEI7S0FFSjs7OztJQUVELEtBQUs7UUFDRCxNQUFNLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDaEQ7Ozs7O0lBRUQsSUFBSSxDQUFDLENBQVU7UUFDWCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsMEJBQTBCLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3RCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLHFEQUFxRCxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFDeEksSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzNDOzs7OztJQUVELEtBQUssQ0FBQyxDQUFVO1FBQ1osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLDBCQUEwQixFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0QsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSwyREFBMkQsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O1FBQzlJLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMzQzs7Ozs7O0lBRUQsUUFBUSxDQUFDLElBQVksRUFBRSxHQUFlO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUM7O1FBQ3ZCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztRQUNsQyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDM0M7Ozs7O0lBR0QsUUFBUSxDQUFDLFdBQWtCLENBQUMsQ0FBQztRQUN6QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUMvRTs7Ozs7SUFFRCxPQUFPLENBQUMsS0FBZTs7UUFDbkIsSUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7UUFDckQsSUFBSSxLQUFLLEdBQUksSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxLQUFLLENBQUM7S0FDaEI7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCaWdOdW1iZXIgZnJvbSAnYmlnbnVtYmVyLmpzJztcbmltcG9ydCB7IFRva2VuREVYIH0gZnJvbSAnLi90b2tlbi1kZXguY2xhc3MnO1xuaW1wb3J0IHsgQXNzZXQgfSBmcm9tICdAdmFwYWVlL3NjYXR0ZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIElWYXBhZWVERVgge1xuICAgIGdldFRva2VuTm93KHN5bWJvbDpzdHJpbmcpOiBUb2tlbkRFWDtcbn1cblxuZXhwb3J0IGNsYXNzIEFzc2V0REVYIGV4dGVuZHMgQXNzZXQge1xuICAgIGFtb3VudDpCaWdOdW1iZXI7XG4gICAgdG9rZW46VG9rZW5ERVg7XG4gICAgXG4gICAgY29uc3RydWN0b3IoYTogYW55ID0gbnVsbCwgYjogYW55ID0gbnVsbCkge1xuICAgICAgICBzdXBlcihhLGIpO1xuXG4gICAgICAgIGlmIChhIGluc3RhbmNlb2YgQXNzZXRERVgpIHtcbiAgICAgICAgICAgIHRoaXMuYW1vdW50ID0gYS5hbW91bnQ7XG4gICAgICAgICAgICB0aGlzLnRva2VuID0gYjtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghIWIgJiYgYlsnZ2V0VG9rZW5Ob3cnXSkge1xuICAgICAgICAgICAgdGhpcy5wYXJzZURleChhLGIpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjbG9uZSgpOiBBc3NldERFWCB7XG4gICAgICAgIHJldHVybiBuZXcgQXNzZXRERVgodGhpcy5hbW91bnQsIHRoaXMudG9rZW4pO1xuICAgIH1cblxuICAgIHBsdXMoYjpBc3NldERFWCkge1xuICAgICAgICBjb25zb2xlLmFzc2VydCghIWIsIFwiRVJST1I6IGIgaXMgbm90IGFuIEFzc2V0XCIsIGIsIHRoaXMuc3RyKTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoYi50b2tlbi5zeW1ib2wgPT0gdGhpcy50b2tlbi5zeW1ib2wsIFwiRVJST1I6IHRyeWluZyB0byBzdW0gYXNzZXRzIHdpdGggZGlmZmVyZW50IHRva2VuczogXCIgKyB0aGlzLnN0ciArIFwiIGFuZCBcIiArIGIuc3RyKTtcbiAgICAgICAgdmFyIGFtb3VudCA9IHRoaXMuYW1vdW50LnBsdXMoYi5hbW91bnQpO1xuICAgICAgICByZXR1cm4gbmV3IEFzc2V0REVYKGFtb3VudCwgdGhpcy50b2tlbik7XG4gICAgfVxuXG4gICAgbWludXMoYjpBc3NldERFWCkge1xuICAgICAgICBjb25zb2xlLmFzc2VydCghIWIsIFwiRVJST1I6IGIgaXMgbm90IGFuIEFzc2V0XCIsIGIsIHRoaXMuc3RyKTtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoYi50b2tlbi5zeW1ib2wgPT0gdGhpcy50b2tlbi5zeW1ib2wsIFwiRVJST1I6IHRyeWluZyB0byBzdWJzdHJhY3QgYXNzZXRzIHdpdGggZGlmZmVyZW50IHRva2VuczogXCIgKyB0aGlzLnN0ciArIFwiIGFuZCBcIiArIGIuc3RyKTtcbiAgICAgICAgdmFyIGFtb3VudCA9IHRoaXMuYW1vdW50Lm1pbnVzKGIuYW1vdW50KTtcbiAgICAgICAgcmV0dXJuIG5ldyBBc3NldERFWChhbW91bnQsIHRoaXMudG9rZW4pO1xuICAgIH0gICAgXG5cbiAgICBwYXJzZURleCh0ZXh0OiBzdHJpbmcsIGRleDogSVZhcGFlZURFWCkge1xuICAgICAgICBpZiAodGV4dCA9PSBcIlwiKSByZXR1cm47XG4gICAgICAgIHZhciBzeW0gPSB0ZXh0LnNwbGl0KFwiIFwiKVsxXTtcbiAgICAgICAgdGhpcy50b2tlbiA9IGRleC5nZXRUb2tlbk5vdyhzeW0pO1xuICAgICAgICB2YXIgYW1vdW50X3N0ciA9IHRleHQuc3BsaXQoXCIgXCIpWzBdO1xuICAgICAgICB0aGlzLmFtb3VudCA9IG5ldyBCaWdOdW1iZXIoYW1vdW50X3N0cik7XG4gICAgfVxuXG4gICAgXG4gICAgdG9TdHJpbmcoZGVjaW1hbHM6bnVtYmVyID0gLTEpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMudG9rZW4pIHJldHVybiBcIjAuMDAwMFwiO1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVRvU3RyaW5nKGRlY2ltYWxzKSArIFwiIFwiICsgdGhpcy50b2tlbi5zeW1ib2wudG9VcHBlckNhc2UoKTtcbiAgICB9XG5cbiAgICBpbnZlcnNlKHRva2VuOiBUb2tlbkRFWCk6IEFzc2V0REVYIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBCaWdOdW1iZXIoMSkuZGl2aWRlZEJ5KHRoaXMuYW1vdW50KTtcbiAgICAgICAgdmFyIGFzc2V0ID0gIG5ldyBBc3NldERFWChyZXN1bHQsIHRva2VuKTtcbiAgICAgICAgcmV0dXJuIGFzc2V0O1xuICAgIH1cbn0iXX0=