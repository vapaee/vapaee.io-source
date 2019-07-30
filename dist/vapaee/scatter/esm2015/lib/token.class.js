/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
export class Token {
    /**
     * @param {?=} obj
     */
    constructor(obj = null) {
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
    /**
     * @return {?}
     */
    get symbol() { return this._symbol; }
    /**
     * @return {?}
     */
    get precision() { return this._precision; }
    /**
     * @return {?}
     */
    get contract() { return this._contract; }
    /**
     * @return {?}
     */
    get str() {
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
    }
    /**
     * @return {?}
     */
    toString() {
        return this.str;
    }
}
if (false) {
    /** @type {?} */
    Token.prototype._str;
    /** @type {?} */
    Token.prototype._symbol;
    /** @type {?} */
    Token.prototype._precision;
    /** @type {?} */
    Token.prototype._contract;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4uY2xhc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AdmFwYWVlL3NjYXR0ZXIvIiwic291cmNlcyI6WyJsaWIvdG9rZW4uY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLE1BQU07Ozs7SUFNRixZQUFZLE1BQVUsSUFBSTtRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUV0QixFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLHFDQUFxQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1RixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxxQ0FBcUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDL0Y7UUFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ04sRUFBRSxDQUFDLENBQUMsR0FBRyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztnQkFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDO2dCQUNqQyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUM7YUFDbEM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQzFDLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUNuRCxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQzthQUNuRDtTQUNKO1FBRUQsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ25COzs7O0lBRUQsSUFBSSxNQUFNLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTs7OztJQUNyQyxJQUFJLFNBQVMsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFOzs7O0lBQzNDLElBQUksUUFBUSxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7Ozs7SUFFekMsSUFBSSxHQUFHO1FBQ0gsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDcEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7YUFDckU7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7aUJBQzdDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNqQixJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztpQkFDNUM7YUFDSjtTQUNKO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDcEI7Ozs7SUFFRCxRQUFRO1FBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDbkI7Q0FFSiIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5leHBvcnQgY2xhc3MgVG9rZW4ge1xuICAgIHByaXZhdGUgX3N0cj86IHN0cmluZztcbiAgICBwcml2YXRlIF9zeW1ib2w6IHN0cmluZztcbiAgICBwcml2YXRlIF9wcmVjaXNpb24/OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfY29udHJhY3Q/OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihvYmo6YW55ID0gbnVsbCkge1xuICAgICAgICB0aGlzLl9zeW1ib2wgPSBcIkFVWFwiO1xuICAgICAgICB0aGlzLl9wcmVjaXNpb24gPSBudWxsO1xuICAgICAgICB0aGlzLl9jb250cmFjdCA9IG51bGw7XG4gICAgXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRoaXMuX3N5bWJvbCA9IG9iajtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHRoaXMuc3ltYm9sLmxlbmd0aCA+IDAsIFwiRVJST1I6IHN5bWJvbCBub3QgdmFsaWQgZm9yIHRva2VuOiBcIiwgdGhpcy5fc3ltYm9sKTtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHRoaXMuc3ltYm9sLmxlbmd0aCA8IDksIFwiRVJST1I6IHN5bWJvbCBub3QgdmFsaWQgZm9yIHRva2VuOiBcIiwgdGhpcy5fc3ltYm9sKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIFRva2VuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3ltYm9sID0gb2JqLl9zeW1ib2w7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlY2lzaW9uID0gb2JqLl9wcmVjaXNpb247XG4gICAgICAgICAgICAgICAgdGhpcy5fY29udHJhY3QgPSBvYmouX2NvbnRyYWN0O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zeW1ib2wgPSBvYmouc3ltYm9sIHx8IHRoaXMuX3N5bWJvbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmVjaXNpb24gPSBvYmoucHJlY2lzaW9uIHx8IHRoaXMuX3ByZWNpc2lvbjtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250cmFjdCA9IG9iai5jb250cmFjdCB8fCB0aGlzLl9jb250cmFjdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBnZXQgc3ltYm9sKCkgeyByZXR1cm4gdGhpcy5fc3ltYm9sOyB9XG4gICAgZ2V0IHByZWNpc2lvbigpIHsgcmV0dXJuIHRoaXMuX3ByZWNpc2lvbjsgfVxuICAgIGdldCBjb250cmFjdCgpIHsgcmV0dXJuIHRoaXMuX2NvbnRyYWN0OyB9XG5cbiAgICBnZXQgc3RyKCkge1xuICAgICAgICBpZiAodGhpcy5fc3RyKSByZXR1cm4gdGhpcy5fc3RyO1xuICAgICAgICB0aGlzLl9zdHIgPSB0aGlzLnN5bWJvbDtcbiAgICAgICAgaWYgKHRoaXMuX3ByZWNpc2lvbiAhPSBudWxsIHx8IHRoaXMuX2NvbnRyYWN0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wcmVjaXNpb24gJiYgdGhpcy5fY29udHJhY3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdHIgKz0gXCIgKFwiICsgdGhpcy5fcHJlY2lzaW9uICsgXCIsIFwiICsgdGhpcy5fY29udHJhY3QgKyBcIilcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ByZWNpc2lvbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHIgKz0gXCIgKFwiICsgdGhpcy5fcHJlY2lzaW9uICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jb250cmFjdCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHIgKz0gXCIgKFwiICsgdGhpcy5fY29udHJhY3QgKyBcIilcIjtcbiAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fc3RyO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdHI7XG4gICAgfVxuXG59Il19