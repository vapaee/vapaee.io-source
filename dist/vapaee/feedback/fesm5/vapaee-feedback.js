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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFwYWVlLWZlZWRiYWNrLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9AdmFwYWVlL2ZlZWRiYWNrL2xpYi9mZWVkYmFjay5zZXJ2aWNlLnRzIiwibmc6Ly9AdmFwYWVlL2ZlZWRiYWNrL2xpYi9mZWVkYmFjay5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBGZWVkIHtcbiAgICBtc2c/OnN0cmluZztcbiAgICBtc2d0eXBlPzpzdHJpbmc7XG4gICAgbG9hZGluZz86Ym9vbGVhbjtcbiAgICBzdGFydD86RGF0ZTtcbiAgICBtYXJrcz86e1xuICAgICAgICBsYWJlbDpzdHJpbmcsXG4gICAgICAgIHNlYzpudW1iZXIsXG4gICAgICAgIG1pbGxpc2VjOm51bWJlclxuICAgIH1bXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZlZWRNYXAge1xuICAgIFtrZXk6c3RyaW5nXTpGZWVkXG59O1xuXG5leHBvcnQgY2xhc3MgRmVlZGJhY2sge1xuICAgIHB1YmxpYyBrZXlzOiBzdHJpbmdbXTtcbiAgICBwcml2YXRlIHNjb3BlczogRmVlZE1hcDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmtleXMgPSBbXVxuICAgICAgICB0aGlzLnNjb3BlcyA9IHt9O1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGUoa2V5czpzdHJpbmdbXSA9IFtdKSB7XG4gICAgICAgIHZhciBmZWVkID0gbmV3IEZlZWRiYWNrKCk7XG4gICAgICAgIGZlZWQua2V5cyA9IGtleXM7XG4gICAgICAgIHJldHVybiBmZWVkO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlU2NvcGVzKCkge1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMua2V5cykge1xuICAgICAgICAgICAgdGhpcy5zY29wZXNbdGhpcy5rZXlzW2ldXSA9IHRoaXMuc2NvcGVzW3RoaXMua2V5c1tpXV0gfHwge31cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkS2V5KGtleTpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcbiAgICAgICAgdGhpcy51cGRhdGVTY29wZXMoKTtcbiAgICB9XG5cbiAgICBzdGFydENocm9ubyhrZXk6c3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLnN0YXJ0ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubWFya3MgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5KGtleSk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0Q2hyb25vKGtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRNYXJjayhrZXk6c3RyaW5nLCBsYWJlbDpzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHZhciBlbGFwc2VkVGltZTpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciBtaWxsaXNlYyA9IGVsYXBzZWRUaW1lLmdldFRpbWUoKSAtIHRoaXMuc2NvcGVzW2tleV0uc3RhcnQuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdmFyIHNlYyA9IG1pbGxpc2VjIC8gMTAwMDtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubWFya3MucHVzaCh7IGxhYmVsLCBzZWMsIG1pbGxpc2VjIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVSUk9SOiBrZXkgbm90IHByZXNlbnRcIiwga2V5LCB0aGlzLnNjb3Blcyk7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH1cblxuICAgIHByaW50Q2hyb25vKGtleTpzdHJpbmcsIGxhc3RNYXJrOmJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNocm9ub21ldGVyIG1hcmtzIGZvciBcIiwga2V5KTtcbiAgICAgICAgICAgIHRoaXMuc2V0TWFyY2soa2V5LCBcInRvdGFsXCIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnNjb3Blc1trZXldLm1hcmtzKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCItIFwiLHRoaXMuc2NvcGVzW2tleV0ubWFya3NbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVSUk9SOiBrZXkgbm90IHByZXNlbnRcIiwga2V5LCB0aGlzLnNjb3Blcyk7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH1cblxuICAgIHNldExvYWRpbmcoa2V5OnN0cmluZywgdmFsdWU6Ym9vbGVhbikge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5sb2FkaW5nID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZEtleShrZXkpO1xuICAgICAgICAgICAgdGhpcy5zZXRMb2FkaW5nKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZGluZyhrZXk6c3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZXNba2V5XS5sb2FkaW5nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBzZXRFcnJvcihrZXk6c3RyaW5nLCBlcnI6IHN0cmluZyA9IFwiXCIpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubXNnID0gZXJyO1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5tc2d0eXBlID0gXCJlcnJvclwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRLZXkoa2V5KTtcbiAgICAgICAgICAgIHRoaXMuc2V0RXJyb3Ioa2V5LCBlcnIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJFcnJvcihrZXk6c3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2V0RXJyb3Ioa2V5LCBcIlwiKTtcbiAgICB9XG5cblxuICAgIGVycm9yKGtleTpzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjb3Blc1trZXldLm1zZztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICBzZXRNZXNzYWdlKGtleTpzdHJpbmcsIG1zZzogc3RyaW5nLCBtc2d0eXBlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubXNnID0gbXNnO1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5tc2d0eXBlID0gbXNndHlwZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5KGtleSk7XG4gICAgICAgICAgICB0aGlzLnNldE1lc3NhZ2Uoa2V5LCBtc2csIG1zZ3R5cGUpO1xuICAgICAgICB9XG4gICAgfSAgICBcblxuICAgIG1lc3NhZ2Uoa2V5OnN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5lcnJvcihrZXkpO1xuICAgIH1cblxuICAgIG1zZ1R5cGUoa2V5OnN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGVzW2tleV0ubXNndHlwZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJFUlJPUlwiLCBrZXksIFt0aGlzLnNjb3Blc10pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxufVxuXG4vKlxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46IFwicm9vdFwiXG59KVxuZXhwb3J0IGNsYXNzIEZlZWRiYWNrU2VydmljZSB7XG4gICAgXG4gICAgY29uc3RydWN0b3IoKXt9XG5cbiAgICBjcmVhdGUoa2V5czpzdHJpbmdbXSA9IFtdKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmVlZGJhY2soa2V5cyk7XG4gICAgfVxufVxuKi8iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRmVlZGJhY2sgfSBmcm9tICcuL2ZlZWRiYWNrLnNlcnZpY2UnO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtdLFxuICAgIGRlY2xhcmF0aW9uczogW10sXG4gICAgcHJvdmlkZXJzOltGZWVkYmFja10sXG4gICAgZXhwb3J0czogW11cbn0pXG5leHBvcnQgY2xhc3MgVmFwYWVlRmVlZGJhY2tNb2R1bGUgeyB9XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBZ0JBO0lBSUk7UUFDSSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUNkLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0tBQ3BCOzs7OztJQUVNLGVBQU07Ozs7SUFBYixVQUFjLElBQWtCO1FBQWxCLHFCQUFBLEVBQUEsU0FBa0I7O1FBQzVCLElBQUksSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUM7S0FDZjs7OztJQUVPLCtCQUFZOzs7O1FBQ2hCLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENB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