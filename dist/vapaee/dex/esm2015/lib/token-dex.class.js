/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Token } from '@vapaee/scatter';
export class TokenDEX extends Token {
    /**
     * @param {?=} obj
     */
    constructor(obj = null) {
        super(obj);
        if (typeof obj == "object") {
            delete obj.symbol;
            delete obj.precision;
            delete obj.contract;
            Object.assign(this, obj);
        }
        this.toString();
    }
}
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
    /** @type {?} */
    TokenDEX.prototype.markets;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4tZGV4LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHZhcGFlZS9kZXgvIiwic291cmNlcyI6WyJsaWIvdG9rZW4tZGV4LmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFrQ3hDLE1BQU0sZUFBZ0IsU0FBUSxLQUFLOzs7O0lBaUMvQixZQUFZLE1BQVUsSUFBSTtRQUN0QixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNsQixPQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUM7WUFDckIsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQzVCO1FBQ0QsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ25CO0NBR0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUb2tlbiB9IGZyb20gJ0B2YXBhZWUvc2NhdHRlcic7XG5pbXBvcnQgeyBBc3NldERFWCB9IGZyb20gXCIuL2Fzc2V0LWRleC5jbGFzc1wiO1xuaW1wb3J0IHsgTWFya2V0IH0gZnJvbSAnLi90eXBlcy1kZXgnO1xuXG4vKlxuZXhwb3J0IGludGVyZmFjZSBUb2tlbiB7XG4gICAgc3ltYm9sOiBzdHJpbmcsXG4gICAgcHJlY2lzaW9uPzogbnVtYmVyLFxuICAgIGNvbnRyYWN0Pzogc3RyaW5nLFxuICAgIGFwcG5hbWU/OiBzdHJpbmcsXG4gICAgd2Vic2l0ZT86IHN0cmluZyxcbiAgICBsb2dvPzogc3RyaW5nLFxuICAgIGxvZ29sZz86IHN0cmluZyxcbiAgICB2ZXJpZmllZD86IGJvb2xlYW4sXG4gICAgZmFrZT86IGJvb2xlYW4sXG4gICAgb2ZmY2hhaW4/OiBib29sZWFuLFxuICAgIHNjb3BlPzogc3RyaW5nLFxuICAgIHN0YXQ/OiB7XG4gICAgICAgIHN1cHBseTogc3RyaW5nLFxuICAgICAgICBtYXhfc3VwcGx5OiBzdHJpbmcsXG4gICAgICAgIGlzc3Vlcj86IHN0cmluZyxcbiAgICAgICAgb3duZXI/OiBzdHJpbmcsXG4gICAgICAgIGlzc3VlcnM/OiBzdHJpbmdbXVxuICAgIH0sXG4gICAgc3VtbWFyeT86IHtcbiAgICAgICAgdm9sdW1lOiBBc3NldCxcbiAgICAgICAgcHJpY2U6IEFzc2V0LFxuICAgICAgICBwcmljZV8yNGhfYWdvOiBBc3NldCxcbiAgICAgICAgcGVyY2VudD86bnVtYmVyLFxuICAgICAgICBwZXJjZW50X3N0cj86c3RyaW5nXG4gICAgfVxuXG59XG4qL1xuZXhwb3J0IGNsYXNzIFRva2VuREVYIGV4dGVuZHMgVG9rZW4ge1xuICAgIC8vIHByaXZhdGUgX3N0cjogc3RyaW5nO1xuICAgIC8vIHByaXZhdGUgX3N5bWJvbDogc3RyaW5nO1xuICAgIC8vIHByaXZhdGUgX3ByZWNpc2lvbjogbnVtYmVyO1xuICAgIC8vIHByaXZhdGUgX2NvbnRyYWN0OiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgYXBwbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyB3ZWJzaXRlOiBzdHJpbmc7XG4gICAgcHVibGljIGxvZ286IHN0cmluZztcbiAgICBwdWJsaWMgbG9nb2xnOiBzdHJpbmc7XG4gICAgcHVibGljIHZlcmlmaWVkOiBib29sZWFuO1xuICAgIHB1YmxpYyBmYWtlOiBib29sZWFuO1xuICAgIHB1YmxpYyBvZmZjaGFpbjogYm9vbGVhbjtcbiAgICBwdWJsaWMgc2NvcGU6IHN0cmluZztcblxuICAgIHN0YXQ/OiB7XG4gICAgICAgIHN1cHBseTogc3RyaW5nLFxuICAgICAgICBtYXhfc3VwcGx5OiBzdHJpbmcsXG4gICAgICAgIGlzc3Vlcj86IHN0cmluZyxcbiAgICAgICAgb3duZXI/OiBzdHJpbmcsXG4gICAgICAgIGlzc3VlcnM/OiBzdHJpbmdbXVxuICAgIH07XG5cbiAgICBzdW1tYXJ5Pzoge1xuICAgICAgICB2b2x1bWU6IEFzc2V0REVYLFxuICAgICAgICBwcmljZTogQXNzZXRERVgsXG4gICAgICAgIHByaWNlXzI0aF9hZ286IEFzc2V0REVYLFxuICAgICAgICBwZXJjZW50PzpudW1iZXIsXG4gICAgICAgIHBlcmNlbnRfc3RyPzpzdHJpbmdcbiAgICB9XG4gICAgXG4gICAgbWFya2V0czogTWFya2V0W107XG5cbiAgICBjb25zdHJ1Y3RvcihvYmo6YW55ID0gbnVsbCkge1xuICAgICAgICBzdXBlcihvYmopO1xuICAgICAgICBpZiAodHlwZW9mIG9iaiA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBkZWxldGUgb2JqLnN5bWJvbDtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmoucHJlY2lzaW9uO1xuICAgICAgICAgICAgZGVsZXRlIG9iai5jb250cmFjdDtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuXG5cbn0iXX0=