import { Injectable, NgModule, defineInjectable } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Feedback = /** @class */ (function () {
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
        if (keys === void 0) { keys = []; }
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
        if (lastMark === void 0) { lastMark = true; }
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
        if (err === void 0) { err = ""; }
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
        { type: Injectable, args: [{
                    providedIn: "root"
                },] },
    ];
    /** @nocollapse */
    Feedback.ctorParameters = function () { return []; };
    /** @nocollapse */ Feedback.ngInjectableDef = defineInjectable({ factory: function Feedback_Factory() { return new Feedback(); }, token: Feedback, providedIn: "root" });
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
var VapaeeFeedbackModule = /** @class */ (function () {
    function VapaeeFeedbackModule() {
    }
    VapaeeFeedbackModule.decorators = [
        { type: NgModule, args: [{
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

export { Feedback, VapaeeFeedbackModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFwYWVlLWZlZWRiYWNrLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9AdmFwYWVlL2ZlZWRiYWNrL2xpYi9mZWVkYmFjay5zZXJ2aWNlLnRzIiwibmc6Ly9AdmFwYWVlL2ZlZWRiYWNrL2xpYi9mZWVkYmFjay5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3RhYmxlLCBQaXBlLCBEaXJlY3RpdmUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCJAYW5ndWxhci9jb21waWxlclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZlZWQge1xuICAgIG1zZz86c3RyaW5nO1xuICAgIG1zZ3R5cGU/OnN0cmluZztcbiAgICBsb2FkaW5nPzpib29sZWFuO1xuICAgIHN0YXJ0PzpEYXRlO1xuICAgIG1hcmtzPzp7XG4gICAgICAgIGxhYmVsOnN0cmluZyxcbiAgICAgICAgc2VjOm51bWJlcixcbiAgICAgICAgbWlsbGlzZWM6bnVtYmVyXG4gICAgfVtdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmVlZE1hcCB7XG4gICAgW2tleTpzdHJpbmddOkZlZWRcbn07XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOlwicm9vdFwiXG59KVxuZXhwb3J0IGNsYXNzIEZlZWRiYWNrIHtcbiAgICBwdWJsaWMga2V5czogc3RyaW5nW107XG4gICAgcHJpdmF0ZSBzY29wZXM6IEZlZWRNYXA7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5rZXlzID0gW11cbiAgICAgICAgdGhpcy5zY29wZXMgPSB7fTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlKGtleXM6c3RyaW5nW10gPSBbXSkge1xuICAgICAgICB2YXIgZmVlZCA9IG5ldyBGZWVkYmFjaygpO1xuICAgICAgICBmZWVkLmtleXMgPSBrZXlzO1xuICAgICAgICByZXR1cm4gZmVlZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVNjb3BlcygpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmtleXMpIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW3RoaXMua2V5c1tpXV0gPSB0aGlzLnNjb3Blc1t0aGlzLmtleXNbaV1dIHx8IHt9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZEtleShrZXk6c3RyaW5nKSB7XG4gICAgICAgIHRoaXMua2V5cy5wdXNoKGtleSk7XG4gICAgICAgIHRoaXMudXBkYXRlU2NvcGVzKCk7XG4gICAgfVxuXG4gICAgc3RhcnRDaHJvbm8oa2V5OnN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5zdGFydCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLm1hcmtzID0gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZEtleShrZXkpO1xuICAgICAgICAgICAgdGhpcy5zdGFydENocm9ubyhrZXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0TWFyY2soa2V5OnN0cmluZywgbGFiZWw6c3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICB2YXIgZWxhcHNlZFRpbWU6RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB2YXIgbWlsbGlzZWMgPSBlbGFwc2VkVGltZS5nZXRUaW1lKCkgLSB0aGlzLnNjb3Blc1trZXldLnN0YXJ0LmdldFRpbWUoKTtcbiAgICAgICAgICAgIHZhciBzZWMgPSBtaWxsaXNlYyAvIDEwMDA7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLm1hcmtzLnB1c2goeyBsYWJlbCwgc2VjLCBtaWxsaXNlYyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjoga2V5IG5vdCBwcmVzZW50XCIsIGtleSwgdGhpcy5zY29wZXMpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9XG5cbiAgICBwcmludENocm9ubyhrZXk6c3RyaW5nLCBsYXN0TWFyazpib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDaHJvbm9tZXRlciBtYXJrcyBmb3IgXCIsIGtleSk7XG4gICAgICAgICAgICB0aGlzLnNldE1hcmNrKGtleSwgXCJ0b3RhbFwiKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5zY29wZXNba2V5XS5tYXJrcykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLSBcIix0aGlzLnNjb3Blc1trZXldLm1hcmtzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjoga2V5IG5vdCBwcmVzZW50XCIsIGtleSwgdGhpcy5zY29wZXMpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9XG5cbiAgICBzZXRMb2FkaW5nKGtleTpzdHJpbmcsIHZhbHVlOmJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubG9hZGluZyA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRLZXkoa2V5KTtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9hZGluZyhrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvYWRpbmcoa2V5OnN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGVzW2tleV0ubG9hZGluZztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgc2V0RXJyb3Ioa2V5OnN0cmluZywgZXJyOiBzdHJpbmcgPSBcIlwiKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLm1zZyA9IGVycjtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubXNndHlwZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5KGtleSk7XG4gICAgICAgICAgICB0aGlzLnNldEVycm9yKGtleSwgZXJyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyRXJyb3Ioa2V5OnN0cmluZykge1xuICAgICAgICB0aGlzLnNldEVycm9yKGtleSwgXCJcIik7XG4gICAgfVxuXG5cbiAgICBlcnJvcihrZXk6c3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZXNba2V5XS5tc2c7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG4gICAgc2V0TWVzc2FnZShrZXk6c3RyaW5nLCBtc2c6IHN0cmluZywgbXNndHlwZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLm1zZyA9IG1zZztcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubXNndHlwZSA9IG1zZ3R5cGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZEtleShrZXkpO1xuICAgICAgICAgICAgdGhpcy5zZXRNZXNzYWdlKGtleSwgbXNnLCBtc2d0eXBlKTtcbiAgICAgICAgfVxuICAgIH0gICAgXG5cbiAgICBtZXNzYWdlKGtleTpzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3Ioa2V5KTtcbiAgICB9XG5cbiAgICBtc2dUeXBlKGtleTpzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjb3Blc1trZXldLm1zZ3R5cGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKFwiRVJST1JcIiwga2V5LCBbdGhpcy5zY29wZXNdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbn1cblxuLypcbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiBcInJvb3RcIlxufSlcbmV4cG9ydCBjbGFzcyBGZWVkYmFja1NlcnZpY2Uge1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKCl7fVxuXG4gICAgY3JlYXRlKGtleXM6c3RyaW5nW10gPSBbXSkge1xuICAgICAgICByZXR1cm4gbmV3IEZlZWRiYWNrKGtleXMpO1xuICAgIH1cbn1cbiovIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZlZWRiYWNrIH0gZnJvbSAnLi9mZWVkYmFjay5zZXJ2aWNlJztcblxuXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXSxcbiAgcHJvdmlkZXJzOltGZWVkYmFja10sXG4gIGV4cG9ydHM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFZhcGFlZUZlZWRiYWNrTW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0lBMEJJO1FBQ0ksSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUE7UUFDZCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztLQUNwQjs7Ozs7SUFFTSxlQUFNOzs7O0lBQWIsVUFBYyxJQUFrQjtRQUFsQixxQkFBQSxFQUFBLFNBQWtCOztRQUM1QixJQUFJLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLE9BQU8sSUFBSSxDQUFD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