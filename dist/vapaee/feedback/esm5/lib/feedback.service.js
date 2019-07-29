/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from "@angular/core";
import * as i0 from "@angular/core";
/**
 * @record
 */
export function Feed() { }
/** @type {?|undefined} */
Feed.prototype.msg;
/** @type {?|undefined} */
Feed.prototype.msgtype;
/** @type {?|undefined} */
Feed.prototype.loading;
/** @type {?|undefined} */
Feed.prototype.start;
/** @type {?|undefined} */
Feed.prototype.marks;
/**
 * @record
 */
export function FeedMap() { }
;
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
        else {
            // console.error("ERROR", key, [this.scopes]);
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
    /** @nocollapse */ Feedback.ngInjectableDef = i0.defineInjectable({ factory: function Feedback_Factory() { return new Feedback(); }, token: Feedback, providedIn: "root" });
    return Feedback;
}());
export { Feedback };
if (false) {
    /** @type {?} */
    Feedback.prototype.keys;
    /** @type {?} */
    Feedback.prototype.scopes;
}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVlZGJhY2suc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0B2YXBhZWUvZmVlZGJhY2svIiwic291cmNlcyI6WyJsaWIvZmVlZGJhY2suc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFhLFVBQVUsRUFBbUIsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJ0RSxDQUFDOztJQVNFO1FBQ0ksSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUE7UUFDZCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztLQUNwQjs7Ozs7SUFFTSxlQUFNOzs7O0lBQWIsVUFBYyxJQUFrQjtRQUFsQixxQkFBQSxFQUFBLFNBQWtCOztRQUM1QixJQUFJLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUM7S0FDZjs7OztJQUVPLCtCQUFZOzs7O1FBQ2hCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtTQUM5RDs7Ozs7O0lBR0cseUJBQU07Ozs7Y0FBQyxHQUFVO1FBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7Ozs7O0lBR3hCLDhCQUFXOzs7O0lBQVgsVUFBWSxHQUFVO1FBQ2xCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFD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Q0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1NBQ3RDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUN0QztLQUNKOzs7OztJQUVELDBCQUFPOzs7O0lBQVAsVUFBUSxHQUFVO1FBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDMUI7Ozs7O0lBRUQsMEJBQU87Ozs7SUFBUCxVQUFRLEdBQVU7UUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7U0FDbkM7UUFBQyxJQUFJLENBQUMsQ0FBQzs7U0FFUDtRQUNELE1BQU0sQ0FBQyxFQUFFLENBQUM7S0FDYjs7Z0JBekhKLFVBQVUsU0FBQztvQkFDUixVQUFVLEVBQUMsTUFBTTtpQkFDcEI7Ozs7O21CQXJCRDs7U0FzQmEsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0YWJsZSwgUGlwZSwgRGlyZWN0aXZlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29tcGlsZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBGZWVkIHtcbiAgICBtc2c/OnN0cmluZztcbiAgICBtc2d0eXBlPzpzdHJpbmc7XG4gICAgbG9hZGluZz86Ym9vbGVhbjtcbiAgICBzdGFydD86RGF0ZTtcbiAgICBtYXJrcz86e1xuICAgICAgICBsYWJlbDpzdHJpbmcsXG4gICAgICAgIHNlYzpudW1iZXIsXG4gICAgICAgIG1pbGxpc2VjOm51bWJlclxuICAgIH1bXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZlZWRNYXAge1xuICAgIFtrZXk6c3RyaW5nXTpGZWVkXG59O1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjpcInJvb3RcIlxufSlcbmV4cG9ydCBjbGFzcyBGZWVkYmFjayB7XG4gICAgcHVibGljIGtleXM6IHN0cmluZ1tdO1xuICAgIHByaXZhdGUgc2NvcGVzOiBGZWVkTWFwO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMua2V5cyA9IFtdXG4gICAgICAgIHRoaXMuc2NvcGVzID0ge307XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZShrZXlzOnN0cmluZ1tdID0gW10pIHtcbiAgICAgICAgdmFyIGZlZWQgPSBuZXcgRmVlZGJhY2soKTtcbiAgICAgICAgZmVlZC5rZXlzID0ga2V5cztcbiAgICAgICAgcmV0dXJuIGZlZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVTY29wZXMoKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5rZXlzKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1t0aGlzLmtleXNbaV1dID0gdGhpcy5zY29wZXNbdGhpcy5rZXlzW2ldXSB8fCB7fVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRLZXkoa2V5OnN0cmluZykge1xuICAgICAgICB0aGlzLmtleXMucHVzaChrZXkpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNjb3BlcygpO1xuICAgIH1cblxuICAgIHN0YXJ0Q2hyb25vKGtleTpzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0uc3RhcnQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5tYXJrcyA9IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRLZXkoa2V5KTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRDaHJvbm8oa2V5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldE1hcmNrKGtleTpzdHJpbmcsIGxhYmVsOnN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgdmFyIGVsYXBzZWRUaW1lOkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdmFyIG1pbGxpc2VjID0gZWxhcHNlZFRpbWUuZ2V0VGltZSgpIC0gdGhpcy5zY29wZXNba2V5XS5zdGFydC5nZXRUaW1lKCk7XG4gICAgICAgICAgICB2YXIgc2VjID0gbWlsbGlzZWMgLyAxMDAwO1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5tYXJrcy5wdXNoKHsgbGFiZWwsIHNlYywgbWlsbGlzZWMgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRVJST1I6IGtleSBub3QgcHJlc2VudFwiLCBrZXksIHRoaXMuc2NvcGVzKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfVxuXG4gICAgcHJpbnRDaHJvbm8oa2V5OnN0cmluZywgbGFzdE1hcms6Ym9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2hyb25vbWV0ZXIgbWFya3MgZm9yIFwiLCBrZXkpO1xuICAgICAgICAgICAgdGhpcy5zZXRNYXJjayhrZXksIFwidG90YWxcIik7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuc2NvcGVzW2tleV0ubWFya3MpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0gXCIsdGhpcy5zY29wZXNba2V5XS5tYXJrc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRVJST1I6IGtleSBub3QgcHJlc2VudFwiLCBrZXksIHRoaXMuc2NvcGVzKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfVxuXG4gICAgc2V0TG9hZGluZyhrZXk6c3RyaW5nLCB2YWx1ZTpib29sZWFuKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLmxvYWRpbmcgPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5KGtleSk7XG4gICAgICAgICAgICB0aGlzLnNldExvYWRpbmcoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2FkaW5nKGtleTpzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjb3Blc1trZXldLmxvYWRpbmc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHNldEVycm9yKGtleTpzdHJpbmcsIGVycjogc3RyaW5nID0gXCJcIikge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5tc2cgPSBlcnI7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLm1zZ3R5cGUgPSBcImVycm9yXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZEtleShrZXkpO1xuICAgICAgICAgICAgdGhpcy5zZXRFcnJvcihrZXksIGVycik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhckVycm9yKGtleTpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zZXRFcnJvcihrZXksIFwiXCIpO1xuICAgIH1cblxuXG4gICAgZXJyb3Ioa2V5OnN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGVzW2tleV0ubXNnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxuICAgIHNldE1lc3NhZ2Uoa2V5OnN0cmluZywgbXNnOiBzdHJpbmcsIG1zZ3R5cGU6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5tc2cgPSBtc2c7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLm1zZ3R5cGUgPSBtc2d0eXBlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRLZXkoa2V5KTtcbiAgICAgICAgICAgIHRoaXMuc2V0TWVzc2FnZShrZXksIG1zZywgbXNndHlwZSk7XG4gICAgICAgIH1cbiAgICB9ICAgIFxuXG4gICAgbWVzc2FnZShrZXk6c3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVycm9yKGtleSk7XG4gICAgfVxuXG4gICAgbXNnVHlwZShrZXk6c3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZXNba2V5XS5tc2d0eXBlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihcIkVSUk9SXCIsIGtleSwgW3RoaXMuc2NvcGVzXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG59XG5cbi8qXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogXCJyb290XCJcbn0pXG5leHBvcnQgY2xhc3MgRmVlZGJhY2tTZXJ2aWNlIHtcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcigpe31cblxuICAgIGNyZWF0ZShrZXlzOnN0cmluZ1tdID0gW10pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGZWVkYmFjayhrZXlzKTtcbiAgICB9XG59XG4qLyJdfQ==