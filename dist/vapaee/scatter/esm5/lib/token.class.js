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
export { Token };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4uY2xhc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AdmFwYWVlL3NjYXR0ZXIvIiwic291cmNlcyI6WyJsaWIvdG9rZW4uY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLElBQUE7SUFNSSxlQUFZLEdBQWM7UUFBZCxvQkFBQSxFQUFBLFVBQWM7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFFdEIsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztZQUNuQixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxxQ0FBcUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUYsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUscUNBQXFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQy9GO1FBRUQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNOLEVBQUUsQ0FBQyxDQUFDLEdBQUcsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQztnQkFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO2FBQ2xDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUMxQyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDbkQsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUM7YUFDbkQ7U0FDSjtRQUVELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUNuQjtJQUVELHNCQUFJLHlCQUFNOzs7O1FBQVYsY0FBZSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFOzs7T0FBQTtJQUNyQyxzQkFBSSw0QkFBUzs7OztRQUFiLGNBQWtCLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7OztPQUFBO0lBQzNDLHNCQUFJLDJCQUFROzs7O1FBQVosY0FBaUIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTs7O09BQUE7SUFFekMsc0JBQUksc0JBQUc7Ozs7UUFBUDtZQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDaEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3hCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDcEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDcEMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7aUJBQ3JFO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO3dCQUNsQixJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztxQkFDN0M7b0JBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pCLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO3FCQUM1QztpQkFDSjthQUNKO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDcEI7OztPQUFBOzs7O0lBRUQsd0JBQVE7OztJQUFSO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDbkI7Z0JBMURMO0lBNERDLENBQUE7QUExREQsaUJBMERDIiwic291cmNlc0NvbnRlbnQiOlsiXG5cbmV4cG9ydCBjbGFzcyBUb2tlbiB7XG4gICAgcHJpdmF0ZSBfc3RyPzogc3RyaW5nO1xuICAgIHByaXZhdGUgX3N5bWJvbDogc3RyaW5nO1xuICAgIHByaXZhdGUgX3ByZWNpc2lvbj86IG51bWJlcjtcbiAgICBwcml2YXRlIF9jb250cmFjdD86IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG9iajphbnkgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3N5bWJvbCA9IFwiQVVYXCI7XG4gICAgICAgIHRoaXMuX3ByZWNpc2lvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NvbnRyYWN0ID0gbnVsbDtcbiAgICBcbiAgICAgICAgaWYgKHR5cGVvZiBvYmogPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhpcy5fc3ltYm9sID0gb2JqO1xuICAgICAgICAgICAgY29uc29sZS5hc3NlcnQodGhpcy5zeW1ib2wubGVuZ3RoID4gMCwgXCJFUlJPUjogc3ltYm9sIG5vdCB2YWxpZCBmb3IgdG9rZW46IFwiLCB0aGlzLl9zeW1ib2wpO1xuICAgICAgICAgICAgY29uc29sZS5hc3NlcnQodGhpcy5zeW1ib2wubGVuZ3RoIDwgOSwgXCJFUlJPUjogc3ltYm9sIG5vdCB2YWxpZCBmb3IgdG9rZW46IFwiLCB0aGlzLl9zeW1ib2wpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAob2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgVG9rZW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zeW1ib2wgPSBvYmouX3N5bWJvbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmVjaXNpb24gPSBvYmouX3ByZWNpc2lvbjtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250cmFjdCA9IG9iai5fY29udHJhY3Q7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmogPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N5bWJvbCA9IG9iai5zeW1ib2wgfHwgdGhpcy5fc3ltYm9sO1xuICAgICAgICAgICAgICAgIHRoaXMuX3ByZWNpc2lvbiA9IG9iai5wcmVjaXNpb24gfHwgdGhpcy5fcHJlY2lzaW9uO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRyYWN0ID0gb2JqLmNvbnRyYWN0IHx8IHRoaXMuX2NvbnRyYWN0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGdldCBzeW1ib2woKSB7IHJldHVybiB0aGlzLl9zeW1ib2w7IH1cbiAgICBnZXQgcHJlY2lzaW9uKCkgeyByZXR1cm4gdGhpcy5fcHJlY2lzaW9uOyB9XG4gICAgZ2V0IGNvbnRyYWN0KCkgeyByZXR1cm4gdGhpcy5fY29udHJhY3Q7IH1cblxuICAgIGdldCBzdHIoKSB7XG4gICAgICAgIGlmICh0aGlzLl9zdHIpIHJldHVybiB0aGlzLl9zdHI7XG4gICAgICAgIHRoaXMuX3N0ciA9IHRoaXMuc3ltYm9sO1xuICAgICAgICBpZiAodGhpcy5fcHJlY2lzaW9uICE9IG51bGwgfHwgdGhpcy5fY29udHJhY3QgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3ByZWNpc2lvbiAmJiB0aGlzLl9jb250cmFjdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0ciArPSBcIiAoXCIgKyB0aGlzLl9wcmVjaXNpb24gKyBcIiwgXCIgKyB0aGlzLl9jb250cmFjdCArIFwiKVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fcHJlY2lzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0ciArPSBcIiAoXCIgKyB0aGlzLl9wcmVjaXNpb24gKyBcIilcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NvbnRyYWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0ciArPSBcIiAoXCIgKyB0aGlzLl9jb250cmFjdCArIFwiKVwiO1xuICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9zdHI7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0cjtcbiAgICB9XG5cbn0iXX0=