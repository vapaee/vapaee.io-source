import { NgModule } from '@angular/core';

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

export { Feedback, VapaeeFeedbackModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFwYWVlLWZlZWRiYWNrLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9AdmFwYWVlL2ZlZWRiYWNrL2xpYi9mZWVkYmFjay5zZXJ2aWNlLnRzIiwibmc6Ly9AdmFwYWVlL2ZlZWRiYWNrL2xpYi9mZWVkYmFjay5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBGZWVkIHtcbiAgICBtc2c/OnN0cmluZztcbiAgICBtc2d0eXBlPzpzdHJpbmc7XG4gICAgbG9hZGluZz86Ym9vbGVhbjtcbiAgICBzdGFydD86RGF0ZTtcbiAgICBtYXJrcz86e1xuICAgICAgICBsYWJlbDpzdHJpbmcsXG4gICAgICAgIHNlYzpudW1iZXIsXG4gICAgICAgIG1pbGxpc2VjOm51bWJlclxuICAgIH1bXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZlZWRNYXAge1xuICAgIFtrZXk6c3RyaW5nXTpGZWVkXG59O1xuXG5leHBvcnQgY2xhc3MgRmVlZGJhY2sge1xuICAgIHB1YmxpYyBrZXlzOiBzdHJpbmdbXTtcbiAgICBwcml2YXRlIHNjb3BlczogRmVlZE1hcDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmtleXMgPSBbXVxuICAgICAgICB0aGlzLnNjb3BlcyA9IHt9O1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGUoa2V5czpzdHJpbmdbXSA9IFtdKSB7XG4gICAgICAgIHZhciBmZWVkID0gbmV3IEZlZWRiYWNrKCk7XG4gICAgICAgIGZlZWQua2V5cyA9IGtleXM7XG4gICAgICAgIHJldHVybiBmZWVkO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlU2NvcGVzKCkge1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMua2V5cykge1xuICAgICAgICAgICAgdGhpcy5zY29wZXNbdGhpcy5rZXlzW2ldXSA9IHRoaXMuc2NvcGVzW3RoaXMua2V5c1tpXV0gfHwge31cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkS2V5KGtleTpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcbiAgICAgICAgdGhpcy51cGRhdGVTY29wZXMoKTtcbiAgICB9XG5cbiAgICBzdGFydENocm9ubyhrZXk6c3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLnN0YXJ0ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubWFya3MgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5KGtleSk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0Q2hyb25vKGtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRNYXJjayhrZXk6c3RyaW5nLCBsYWJlbDpzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHZhciBlbGFwc2VkVGltZTpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciBtaWxsaXNlYyA9IGVsYXBzZWRUaW1lLmdldFRpbWUoKSAtIHRoaXMuc2NvcGVzW2tleV0uc3RhcnQuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdmFyIHNlYyA9IG1pbGxpc2VjIC8gMTAwMDtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubWFya3MucHVzaCh7IGxhYmVsLCBzZWMsIG1pbGxpc2VjIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVSUk9SOiBrZXkgbm90IHByZXNlbnRcIiwga2V5LCB0aGlzLnNjb3Blcyk7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH1cblxuICAgIHByaW50Q2hyb25vKGtleTpzdHJpbmcsIGxhc3RNYXJrOmJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNocm9ub21ldGVyIG1hcmtzIGZvciBcIiwga2V5KTtcbiAgICAgICAgICAgIHRoaXMuc2V0TWFyY2soa2V5LCBcInRvdGFsXCIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnNjb3Blc1trZXldLm1hcmtzKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCItIFwiLHRoaXMuc2NvcGVzW2tleV0ubWFya3NbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVSUk9SOiBrZXkgbm90IHByZXNlbnRcIiwga2V5LCB0aGlzLnNjb3Blcyk7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH1cblxuICAgIHNldExvYWRpbmcoa2V5OnN0cmluZywgdmFsdWU6Ym9vbGVhbikge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5sb2FkaW5nID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZEtleShrZXkpO1xuICAgICAgICAgICAgdGhpcy5zZXRMb2FkaW5nKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZGluZyhrZXk6c3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZXNba2V5XS5sb2FkaW5nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBzZXRFcnJvcihrZXk6c3RyaW5nLCBlcnI6IHN0cmluZyA9IFwiXCIpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubXNnID0gZXJyO1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5tc2d0eXBlID0gXCJlcnJvclwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRLZXkoa2V5KTtcbiAgICAgICAgICAgIHRoaXMuc2V0RXJyb3Ioa2V5LCBlcnIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJFcnJvcihrZXk6c3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2V0RXJyb3Ioa2V5LCBcIlwiKTtcbiAgICB9XG5cblxuICAgIGVycm9yKGtleTpzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjb3Blc1trZXldLm1zZztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICBzZXRNZXNzYWdlKGtleTpzdHJpbmcsIG1zZzogc3RyaW5nLCBtc2d0eXBlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubXNnID0gbXNnO1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5tc2d0eXBlID0gbXNndHlwZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5KGtleSk7XG4gICAgICAgICAgICB0aGlzLnNldE1lc3NhZ2Uoa2V5LCBtc2csIG1zZ3R5cGUpO1xuICAgICAgICB9XG4gICAgfSAgICBcblxuICAgIG1lc3NhZ2Uoa2V5OnN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5lcnJvcihrZXkpO1xuICAgIH1cblxuICAgIG1zZ1R5cGUoa2V5OnN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGVzW2tleV0ubXNndHlwZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJFUlJPUlwiLCBrZXksIFt0aGlzLnNjb3Blc10pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxufVxuXG4vKlxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46IFwicm9vdFwiXG59KVxuZXhwb3J0IGNsYXNzIEZlZWRiYWNrU2VydmljZSB7XG4gICAgXG4gICAgY29uc3RydWN0b3IoKXt9XG5cbiAgICBjcmVhdGUoa2V5czpzdHJpbmdbXSA9IFtdKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmVlZGJhY2soa2V5cyk7XG4gICAgfVxufVxuKi8iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtdLFxuICAgIGRlY2xhcmF0aW9uczogW10sXG4gICAgcHJvdmlkZXJzOltdLFxuICAgIGV4cG9ydHM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFZhcGFlZUZlZWRiYWNrTW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQWdCQTtJQUlJO1FBQ0ksSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUE7UUFDZCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztLQUNwQjs7Ozs7SUFFTSxlQUFNOzs7O0lBQWIsVUFBYyxJQUFrQjtRQUFsQixxQkFBQSxFQUFBLFNBQWtCOztRQUM1QixJQUFJLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7Ozs7SUFFTywrQkFBWTs7OztRQUNoQixLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO1NBQzlEOzs7Ozs7SUFHRyx5QkFBTTs7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