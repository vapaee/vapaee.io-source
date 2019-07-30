/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Token } from '@vapaee/scatter';
var TokenDEX = /** @class */ (function (_super) {
    tslib_1.__extends(TokenDEX, _super);
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
export { TokenDEX };
if (false) {
    /** @type {?} */
    TokenDEX.prototype.appname;
    /** @type {?} */
    TokenDEX.prototype.website;
    /** @type {?} */
    TokenDEX.prototype.logo;
    /** @type {?} */
    TokenDEX.prototype.logolg;
    /** @type {?} */
    TokenDEX.prototype.verified;
    /** @type {?} */
    TokenDEX.prototype.fake;
    /** @type {?} */
    TokenDEX.prototype.offchain;
    /** @type {?} */
    TokenDEX.prototype.scope;
    /** @type {?} */
    TokenDEX.prototype.stat;
    /** @type {?} */
    TokenDEX.prototype.summary;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4tZGV4LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHZhcGFlZS9kZXgvIiwic291cmNlcyI6WyJsaWIvdG9rZW4tZGV4LmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBaUN4QyxJQUFBO0lBQThCLG9DQUFLO0lBK0IvQixrQkFBWSxHQUFjO1FBQWQsb0JBQUEsRUFBQSxVQUFjO1FBQTFCLFlBQ0ksa0JBQU0sR0FBRyxDQUFDLFNBUWI7UUFQRyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNsQixPQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUM7WUFDckIsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQzVCO1FBQ0QsS0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOztLQUNuQjttQkF6RUw7RUFpQzhCLEtBQUssRUEyQ2xDLENBQUE7QUEzQ0Qsb0JBMkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVG9rZW4gfSBmcm9tICdAdmFwYWVlL3NjYXR0ZXInO1xuaW1wb3J0IHsgQXNzZXRERVggfSBmcm9tIFwiLi9hc3NldC1kZXguY2xhc3NcIjtcblxuLypcbmV4cG9ydCBpbnRlcmZhY2UgVG9rZW4ge1xuICAgIHN5bWJvbDogc3RyaW5nLFxuICAgIHByZWNpc2lvbj86IG51bWJlcixcbiAgICBjb250cmFjdD86IHN0cmluZyxcbiAgICBhcHBuYW1lPzogc3RyaW5nLFxuICAgIHdlYnNpdGU/OiBzdHJpbmcsXG4gICAgbG9nbz86IHN0cmluZyxcbiAgICBsb2dvbGc/OiBzdHJpbmcsXG4gICAgdmVyaWZpZWQ/OiBib29sZWFuLFxuICAgIGZha2U/OiBib29sZWFuLFxuICAgIG9mZmNoYWluPzogYm9vbGVhbixcbiAgICBzY29wZT86IHN0cmluZyxcbiAgICBzdGF0Pzoge1xuICAgICAgICBzdXBwbHk6IHN0cmluZyxcbiAgICAgICAgbWF4X3N1cHBseTogc3RyaW5nLFxuICAgICAgICBpc3N1ZXI/OiBzdHJpbmcsXG4gICAgICAgIG93bmVyPzogc3RyaW5nLFxuICAgICAgICBpc3N1ZXJzPzogc3RyaW5nW11cbiAgICB9LFxuICAgIHN1bW1hcnk/OiB7XG4gICAgICAgIHZvbHVtZTogQXNzZXQsXG4gICAgICAgIHByaWNlOiBBc3NldCxcbiAgICAgICAgcHJpY2VfMjRoX2FnbzogQXNzZXQsXG4gICAgICAgIHBlcmNlbnQ/Om51bWJlcixcbiAgICAgICAgcGVyY2VudF9zdHI/OnN0cmluZ1xuICAgIH1cblxufVxuKi9cbmV4cG9ydCBjbGFzcyBUb2tlbkRFWCBleHRlbmRzIFRva2VuIHtcbiAgICAvLyBwcml2YXRlIF9zdHI6IHN0cmluZztcbiAgICAvLyBwcml2YXRlIF9zeW1ib2w6IHN0cmluZztcbiAgICAvLyBwcml2YXRlIF9wcmVjaXNpb246IG51bWJlcjtcbiAgICAvLyBwcml2YXRlIF9jb250cmFjdDogc3RyaW5nO1xuXG4gICAgcHVibGljIGFwcG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgd2Vic2l0ZTogc3RyaW5nO1xuICAgIHB1YmxpYyBsb2dvOiBzdHJpbmc7XG4gICAgcHVibGljIGxvZ29sZzogc3RyaW5nO1xuICAgIHB1YmxpYyB2ZXJpZmllZDogYm9vbGVhbjtcbiAgICBwdWJsaWMgZmFrZTogYm9vbGVhbjtcbiAgICBwdWJsaWMgb2ZmY2hhaW46IGJvb2xlYW47XG4gICAgcHVibGljIHNjb3BlOiBzdHJpbmc7XG5cbiAgICBzdGF0Pzoge1xuICAgICAgICBzdXBwbHk6IHN0cmluZyxcbiAgICAgICAgbWF4X3N1cHBseTogc3RyaW5nLFxuICAgICAgICBpc3N1ZXI/OiBzdHJpbmcsXG4gICAgICAgIG93bmVyPzogc3RyaW5nLFxuICAgICAgICBpc3N1ZXJzPzogc3RyaW5nW11cbiAgICB9O1xuXG4gICAgc3VtbWFyeT86IHtcbiAgICAgICAgdm9sdW1lOiBBc3NldERFWCxcbiAgICAgICAgcHJpY2U6IEFzc2V0REVYLFxuICAgICAgICBwcmljZV8yNGhfYWdvOiBBc3NldERFWCxcbiAgICAgICAgcGVyY2VudD86bnVtYmVyLFxuICAgICAgICBwZXJjZW50X3N0cj86c3RyaW5nXG4gICAgfSAgICBcblxuICAgIGNvbnN0cnVjdG9yKG9iajphbnkgPSBudWxsKSB7XG4gICAgICAgIHN1cGVyKG9iaik7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmouc3ltYm9sO1xuICAgICAgICAgICAgZGVsZXRlIG9iai5wcmVjaXNpb247XG4gICAgICAgICAgICBkZWxldGUgb2JqLmNvbnRyYWN0O1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG5cblxufSJdfQ==