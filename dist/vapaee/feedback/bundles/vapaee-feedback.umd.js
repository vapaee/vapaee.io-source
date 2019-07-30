(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('@vapaee/feedback', ['exports', '@angular/core'], factory) :
    (factory((global.vapaee = global.vapaee || {}, global.vapaee.feedback = {}),global.ng.core));
}(this, (function (exports,core) { 'use strict';

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
            { type: core.NgModule, args: [{
                        imports: [],
                        declarations: [],
                        providers: [],
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFwYWVlLWZlZWRiYWNrLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQHZhcGFlZS9mZWVkYmFjay9saWIvZmVlZGJhY2suc2VydmljZS50cyIsIm5nOi8vQHZhcGFlZS9mZWVkYmFjay9saWIvZmVlZGJhY2subW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgRmVlZCB7XG4gICAgbXNnPzpzdHJpbmc7XG4gICAgbXNndHlwZT86c3RyaW5nO1xuICAgIGxvYWRpbmc/OmJvb2xlYW47XG4gICAgc3RhcnQ/OkRhdGU7XG4gICAgbWFya3M/OntcbiAgICAgICAgbGFiZWw6c3RyaW5nLFxuICAgICAgICBzZWM6bnVtYmVyLFxuICAgICAgICBtaWxsaXNlYzpudW1iZXJcbiAgICB9W11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBGZWVkTWFwIHtcbiAgICBba2V5OnN0cmluZ106RmVlZFxufTtcblxuZXhwb3J0IGNsYXNzIEZlZWRiYWNrIHtcbiAgICBwdWJsaWMga2V5czogc3RyaW5nW107XG4gICAgcHJpdmF0ZSBzY29wZXM6IEZlZWRNYXA7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5rZXlzID0gW11cbiAgICAgICAgdGhpcy5zY29wZXMgPSB7fTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlKGtleXM6c3RyaW5nW10gPSBbXSkge1xuICAgICAgICB2YXIgZmVlZCA9IG5ldyBGZWVkYmFjaygpO1xuICAgICAgICBmZWVkLmtleXMgPSBrZXlzO1xuICAgICAgICByZXR1cm4gZmVlZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVNjb3BlcygpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmtleXMpIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW3RoaXMua2V5c1tpXV0gPSB0aGlzLnNjb3Blc1t0aGlzLmtleXNbaV1dIHx8IHt9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZEtleShrZXk6c3RyaW5nKSB7XG4gICAgICAgIHRoaXMua2V5cy5wdXNoKGtleSk7XG4gICAgICAgIHRoaXMudXBkYXRlU2NvcGVzKCk7XG4gICAgfVxuXG4gICAgc3RhcnRDaHJvbm8oa2V5OnN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5zdGFydCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLm1hcmtzID0gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZEtleShrZXkpO1xuICAgICAgICAgICAgdGhpcy5zdGFydENocm9ubyhrZXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0TWFyY2soa2V5OnN0cmluZywgbGFiZWw6c3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICB2YXIgZWxhcHNlZFRpbWU6RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB2YXIgbWlsbGlzZWMgPSBlbGFwc2VkVGltZS5nZXRUaW1lKCkgLSB0aGlzLnNjb3Blc1trZXldLnN0YXJ0LmdldFRpbWUoKTtcbiAgICAgICAgICAgIHZhciBzZWMgPSBtaWxsaXNlYyAvIDEwMDA7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLm1hcmtzLnB1c2goeyBsYWJlbCwgc2VjLCBtaWxsaXNlYyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjoga2V5IG5vdCBwcmVzZW50XCIsIGtleSwgdGhpcy5zY29wZXMpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9XG5cbiAgICBwcmludENocm9ubyhrZXk6c3RyaW5nLCBsYXN0TWFyazpib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDaHJvbm9tZXRlciBtYXJrcyBmb3IgXCIsIGtleSk7XG4gICAgICAgICAgICB0aGlzLnNldE1hcmNrKGtleSwgXCJ0b3RhbFwiKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5zY29wZXNba2V5XS5tYXJrcykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLSBcIix0aGlzLnNjb3Blc1trZXldLm1hcmtzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjoga2V5IG5vdCBwcmVzZW50XCIsIGtleSwgdGhpcy5zY29wZXMpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9XG5cbiAgICBzZXRMb2FkaW5nKGtleTpzdHJpbmcsIHZhbHVlOmJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubG9hZGluZyA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRLZXkoa2V5KTtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9hZGluZyhrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvYWRpbmcoa2V5OnN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGVzW2tleV0ubG9hZGluZztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgc2V0RXJyb3Ioa2V5OnN0cmluZywgZXJyOiBzdHJpbmcgPSBcIlwiKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLm1zZyA9IGVycjtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubXNndHlwZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5KGtleSk7XG4gICAgICAgICAgICB0aGlzLnNldEVycm9yKGtleSwgZXJyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyRXJyb3Ioa2V5OnN0cmluZykge1xuICAgICAgICB0aGlzLnNldEVycm9yKGtleSwgXCJcIik7XG4gICAgfVxuXG5cbiAgICBlcnJvcihrZXk6c3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZXNba2V5XS5tc2c7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG4gICAgc2V0TWVzc2FnZShrZXk6c3RyaW5nLCBtc2c6IHN0cmluZywgbXNndHlwZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLm1zZyA9IG1zZztcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubXNndHlwZSA9IG1zZ3R5cGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZEtleShrZXkpO1xuICAgICAgICAgICAgdGhpcy5zZXRNZXNzYWdlKGtleSwgbXNnLCBtc2d0eXBlKTtcbiAgICAgICAgfVxuICAgIH0gICAgXG5cbiAgICBtZXNzYWdlKGtleTpzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3Ioa2V5KTtcbiAgICB9XG5cbiAgICBtc2dUeXBlKGtleTpzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjb3Blc1trZXldLm1zZ3R5cGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKFwiRVJST1JcIiwga2V5LCBbdGhpcy5zY29wZXNdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbn1cblxuLypcbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiBcInJvb3RcIlxufSlcbmV4cG9ydCBjbGFzcyBGZWVkYmFja1NlcnZpY2Uge1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKCl7fVxuXG4gICAgY3JlYXRlKGtleXM6c3RyaW5nW10gPSBbXSkge1xuICAgICAgICByZXR1cm4gbmV3IEZlZWRiYWNrKGtleXMpO1xuICAgIH1cbn1cbiovIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtdLFxuICAgIHByb3ZpZGVyczpbXSxcbiAgICBleHBvcnRzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBWYXBhZWVGZWVkYmFja01vZHVsZSB7IH1cbiJdLCJuYW1lcyI6WyJOZ01vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztRQWdCQTtRQUlJO1lBQ0ksSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUE7WUFDZCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztTQUNwQjs7Ozs7UUFFTSxlQUFNOzs7O1lBQWIsVUFBYyxJQUFrQjtnQkFBbEIscUJBQUE7b0JBQUEsU0FBa0I7OztnQkFDNUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ2pCLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7Ozs7UUFFTywrQkFBWTs7OztnQkFDaEIsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO29CQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENB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