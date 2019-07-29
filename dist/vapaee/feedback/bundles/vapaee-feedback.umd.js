(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('@vapaee/feedback', ['exports', '@angular/core'], factory) :
    (factory((global.vapaee = global.vapaee || {}, global.vapaee.feedback = {}),global.ng.core));
}(this, (function (exports,i0) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var Feedback = (function () {
        function Feedback() {
            this.keys = [];
            this.scopes = {};
        }
        /**
         * @param {?=} keys
         * @return {?}
         */
        Feedback.create = /**
         * @param {?=} keys
         * @return {?}
         */
            function (keys) {
                if (keys === void 0) {
                    keys = [];
                }
                /** @type {?} */
                var feed = new Feedback();
                feed.keys = keys;
                return feed;
            };
        /**
         * @return {?}
         */
        Feedback.prototype.updateScopes = /**
         * @return {?}
         */
            function () {
                for (var i in this.keys) {
                    this.scopes[this.keys[i]] = this.scopes[this.keys[i]] || {};
                }
            };
        /**
         * @param {?} key
         * @return {?}
         */
        Feedback.prototype.addKey = /**
         * @param {?} key
         * @return {?}
         */
            function (key) {
                this.keys.push(key);
                this.updateScopes();
            };
        /**
         * @param {?} key
         * @return {?}
         */
        Feedback.prototype.startChrono = /**
         * @param {?} key
         * @return {?}
         */
            function (key) {
                if (this.scopes[key]) {
                    this.scopes[key].start = new Date();
                    this.scopes[key].marks = [];
                }
                else {
                    this.addKey(key);
                    this.startChrono(key);
                }
            };
        /**
         * @param {?} key
         * @param {?} label
         * @return {?}
         */
        Feedback.prototype.setMarck = /**
         * @param {?} key
         * @param {?} label
         * @return {?}
         */
            function (key, label) {
                if (this.scopes[key]) {
                    /** @type {?} */
                    var elapsedTime = new Date();
                    /** @type {?} */
                    var millisec = elapsedTime.getTime() - this.scopes[key].start.getTime();
                    /** @type {?} */
                    var sec = millisec / 1000;
                    this.scopes[key].marks.push({ label: label, sec: sec, millisec: millisec });
                }
                else {
                    console.error("ERROR: key not present", key, this.scopes);
                }
            };
        /**
         * @param {?} key
         * @param {?=} lastMark
         * @return {?}
         */
        Feedback.prototype.printChrono = /**
         * @param {?} key
         * @param {?=} lastMark
         * @return {?}
         */
            function (key, lastMark) {
                if (lastMark === void 0) {
                    lastMark = true;
                }
                if (this.scopes[key]) {
                    console.log("Chronometer marks for ", key);
                    this.setMarck(key, "total");
                    for (var i in this.scopes[key].marks) {
                        console.log("- ", this.scopes[key].marks[i]);
                    }
                }
                else {
                    console.error("ERROR: key not present", key, this.scopes);
                }
            };
        /**
         * @param {?} key
         * @param {?} value
         * @return {?}
         */
        Feedback.prototype.setLoading = /**
         * @param {?} key
         * @param {?} value
         * @return {?}
         */
            function (key, value) {
                if (this.scopes[key]) {
                    this.scopes[key].loading = value;
                }
                else {
                    this.addKey(key);
                    this.setLoading(key, value);
                }
            };
        /**
         * @param {?} key
         * @return {?}
         */
        Feedback.prototype.loading = /**
         * @param {?} key
         * @return {?}
         */
            function (key) {
                if (this.scopes[key]) {
                    return this.scopes[key].loading;
                }
                return false;
            };
        /**
         * @param {?} key
         * @param {?=} err
         * @return {?}
         */
        Feedback.prototype.setError = /**
         * @param {?} key
         * @param {?=} err
         * @return {?}
         */
            function (key, err) {
                if (err === void 0) {
                    err = "";
                }
                if (this.scopes[key]) {
                    this.scopes[key].msg = err;
                    this.scopes[key].msgtype = "error";
                }
                else {
                    this.addKey(key);
                    this.setError(key, err);
                }
            };
        /**
         * @param {?} key
         * @return {?}
         */
        Feedback.prototype.clearError = /**
         * @param {?} key
         * @return {?}
         */
            function (key) {
                this.setError(key, "");
            };
        /**
         * @param {?} key
         * @return {?}
         */
        Feedback.prototype.error = /**
         * @param {?} key
         * @return {?}
         */
            function (key) {
                if (this.scopes[key]) {
                    return this.scopes[key].msg;
                }
                return "";
            };
        /**
         * @param {?} key
         * @param {?} msg
         * @param {?} msgtype
         * @return {?}
         */
        Feedback.prototype.setMessage = /**
         * @param {?} key
         * @param {?} msg
         * @param {?} msgtype
         * @return {?}
         */
            function (key, msg, msgtype) {
                if (this.scopes[key]) {
                    this.scopes[key].msg = msg;
                    this.scopes[key].msgtype = msgtype;
                }
                else {
                    this.addKey(key);
                    this.setMessage(key, msg, msgtype);
                }
            };
        /**
         * @param {?} key
         * @return {?}
         */
        Feedback.prototype.message = /**
         * @param {?} key
         * @return {?}
         */
            function (key) {
                return this.error(key);
            };
        /**
         * @param {?} key
         * @return {?}
         */
        Feedback.prototype.msgType = /**
         * @param {?} key
         * @return {?}
         */
            function (key) {
                if (this.scopes[key]) {
                    return this.scopes[key].msgtype;
                }
                return "";
            };
        Feedback.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: "root"
                    },] },
        ];
        /** @nocollapse */
        Feedback.ctorParameters = function () { return []; };
        /** @nocollapse */ Feedback.ngInjectableDef = i0.defineInjectable({ factory: function Feedback_Factory() { return new Feedback(); }, token: Feedback, providedIn: "root" });
        return Feedback;
    }());
    /*
    @Injectable({
        providedIn: "root"
    })
    export class FeedbackService {
        
        constructor(){}

        create(keys:string[] = []) {
            return new Feedback(keys);
        }
    }
    */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var VapaeeFeedbackModule = (function () {
        function VapaeeFeedbackModule() {
        }
        VapaeeFeedbackModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [],
                        declarations: [],
                        providers: [Feedback],
                        exports: []
                    },] },
        ];
        return VapaeeFeedbackModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.Feedback = Feedback;
    exports.VapaeeFeedbackModule = VapaeeFeedbackModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFwYWVlLWZlZWRiYWNrLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQHZhcGFlZS9mZWVkYmFjay9saWIvZmVlZGJhY2suc2VydmljZS50cyIsIm5nOi8vQHZhcGFlZS9mZWVkYmFjay9saWIvZmVlZGJhY2subW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0YWJsZSwgUGlwZSwgRGlyZWN0aXZlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29tcGlsZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBGZWVkIHtcbiAgICBtc2c/OnN0cmluZztcbiAgICBtc2d0eXBlPzpzdHJpbmc7XG4gICAgbG9hZGluZz86Ym9vbGVhbjtcbiAgICBzdGFydD86RGF0ZTtcbiAgICBtYXJrcz86e1xuICAgICAgICBsYWJlbDpzdHJpbmcsXG4gICAgICAgIHNlYzpudW1iZXIsXG4gICAgICAgIG1pbGxpc2VjOm51bWJlclxuICAgIH1bXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZlZWRNYXAge1xuICAgIFtrZXk6c3RyaW5nXTpGZWVkXG59O1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjpcInJvb3RcIlxufSlcbmV4cG9ydCBjbGFzcyBGZWVkYmFjayB7XG4gICAgcHVibGljIGtleXM6IHN0cmluZ1tdO1xuICAgIHByaXZhdGUgc2NvcGVzOiBGZWVkTWFwO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMua2V5cyA9IFtdXG4gICAgICAgIHRoaXMuc2NvcGVzID0ge307XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZShrZXlzOnN0cmluZ1tdID0gW10pIHtcbiAgICAgICAgdmFyIGZlZWQgPSBuZXcgRmVlZGJhY2soKTtcbiAgICAgICAgZmVlZC5rZXlzID0ga2V5cztcbiAgICAgICAgcmV0dXJuIGZlZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVTY29wZXMoKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5rZXlzKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1t0aGlzLmtleXNbaV1dID0gdGhpcy5zY29wZXNbdGhpcy5rZXlzW2ldXSB8fCB7fVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRLZXkoa2V5OnN0cmluZykge1xuICAgICAgICB0aGlzLmtleXMucHVzaChrZXkpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNjb3BlcygpO1xuICAgIH1cblxuICAgIHN0YXJ0Q2hyb25vKGtleTpzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0uc3RhcnQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5tYXJrcyA9IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRLZXkoa2V5KTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRDaHJvbm8oa2V5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldE1hcmNrKGtleTpzdHJpbmcsIGxhYmVsOnN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgdmFyIGVsYXBzZWRUaW1lOkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdmFyIG1pbGxpc2VjID0gZWxhcHNlZFRpbWUuZ2V0VGltZSgpIC0gdGhpcy5zY29wZXNba2V5XS5zdGFydC5nZXRUaW1lKCk7XG4gICAgICAgICAgICB2YXIgc2VjID0gbWlsbGlzZWMgLyAxMDAwO1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5tYXJrcy5wdXNoKHsgbGFiZWwsIHNlYywgbWlsbGlzZWMgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRVJST1I6IGtleSBub3QgcHJlc2VudFwiLCBrZXksIHRoaXMuc2NvcGVzKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfVxuXG4gICAgcHJpbnRDaHJvbm8oa2V5OnN0cmluZywgbGFzdE1hcms6Ym9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2hyb25vbWV0ZXIgbWFya3MgZm9yIFwiLCBrZXkpO1xuICAgICAgICAgICAgdGhpcy5zZXRNYXJjayhrZXksIFwidG90YWxcIik7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuc2NvcGVzW2tleV0ubWFya3MpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0gXCIsdGhpcy5zY29wZXNba2V5XS5tYXJrc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRVJST1I6IGtleSBub3QgcHJlc2VudFwiLCBrZXksIHRoaXMuc2NvcGVzKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfVxuXG4gICAgc2V0TG9hZGluZyhrZXk6c3RyaW5nLCB2YWx1ZTpib29sZWFuKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLmxvYWRpbmcgPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5KGtleSk7XG4gICAgICAgICAgICB0aGlzLnNldExvYWRpbmcoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2FkaW5nKGtleTpzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjb3Blc1trZXldLmxvYWRpbmc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHNldEVycm9yKGtleTpzdHJpbmcsIGVycjogc3RyaW5nID0gXCJcIikge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5tc2cgPSBlcnI7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLm1zZ3R5cGUgPSBcImVycm9yXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZEtleShrZXkpO1xuICAgICAgICAgICAgdGhpcy5zZXRFcnJvcihrZXksIGVycik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhckVycm9yKGtleTpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zZXRFcnJvcihrZXksIFwiXCIpO1xuICAgIH1cblxuXG4gICAgZXJyb3Ioa2V5OnN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGVzW2tleV0ubXNnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxuICAgIHNldE1lc3NhZ2Uoa2V5OnN0cmluZywgbXNnOiBzdHJpbmcsIG1zZ3R5cGU6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5tc2cgPSBtc2c7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLm1zZ3R5cGUgPSBtc2d0eXBlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRLZXkoa2V5KTtcbiAgICAgICAgICAgIHRoaXMuc2V0TWVzc2FnZShrZXksIG1zZywgbXNndHlwZSk7XG4gICAgICAgIH1cbiAgICB9ICAgIFxuXG4gICAgbWVzc2FnZShrZXk6c3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVycm9yKGtleSk7XG4gICAgfVxuXG4gICAgbXNnVHlwZShrZXk6c3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZXNba2V5XS5tc2d0eXBlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihcIkVSUk9SXCIsIGtleSwgW3RoaXMuc2NvcGVzXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG59XG5cbi8qXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogXCJyb290XCJcbn0pXG5leHBvcnQgY2xhc3MgRmVlZGJhY2tTZXJ2aWNlIHtcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcigpe31cblxuICAgIGNyZWF0ZShrZXlzOnN0cmluZ1tdID0gW10pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGZWVkYmFjayhrZXlzKTtcbiAgICB9XG59XG4qLyIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGZWVkYmFjayB9IGZyb20gJy4vZmVlZGJhY2suc2VydmljZSc7XG5cblxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW10sXG4gIHByb3ZpZGVyczpbRmVlZGJhY2tdLFxuICBleHBvcnRzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBWYXBhZWVGZWVkYmFja01vZHVsZSB7IH1cbiJdLCJuYW1lcyI6WyJJbmplY3RhYmxlIiwiTmdNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtRQTBCSTtZQUNJLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFBO1lBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7U0FDcEI7Ozs7O1FBRU0sZUFBTTs7OztZQUFiLFVBQWMsSUFBa0I7Z0JBQWxCLHFCQUFBO29CQUFBLFNBQWtCOzs7Z0JBQzVCLElBQUksSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxJQUFJ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