import { NgModule } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Feedback {
    constructor() {
        this.keys = [];
        this.scopes = {};
    }
    /**
     * @param {?=} keys
     * @return {?}
     */
    static create(keys = []) {
        /** @type {?} */
        var feed = new Feedback();
        feed.keys = keys;
        return feed;
    }
    /**
     * @return {?}
     */
    updateScopes() {
        for (var i in this.keys) {
            this.scopes[this.keys[i]] = this.scopes[this.keys[i]] || {};
        }
    }
    /**
     * @param {?} key
     * @return {?}
     */
    addKey(key) {
        this.keys.push(key);
        this.updateScopes();
    }
    /**
     * @param {?} key
     * @return {?}
     */
    startChrono(key) {
        if (this.scopes[key]) {
            this.scopes[key].start = new Date();
            this.scopes[key].marks = [];
        }
        else {
            this.addKey(key);
            this.startChrono(key);
        }
    }
    /**
     * @param {?} key
     * @param {?} label
     * @return {?}
     */
    setMarck(key, label) {
        if (this.scopes[key]) {
            /** @type {?} */
            var elapsedTime = new Date();
            /** @type {?} */
            var millisec = elapsedTime.getTime() - this.scopes[key].start.getTime();
            /** @type {?} */
            var sec = millisec / 1000;
            this.scopes[key].marks.push({ label, sec, millisec });
        }
        else {
            console.error("ERROR: key not present", key, this.scopes);
        }
    }
    /**
     * @param {?} key
     * @param {?=} lastMark
     * @return {?}
     */
    printChrono(key, lastMark = true) {
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
    }
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    setLoading(key, value) {
        if (this.scopes[key]) {
            this.scopes[key].loading = value;
        }
        else {
            this.addKey(key);
            this.setLoading(key, value);
        }
    }
    /**
     * @param {?} key
     * @return {?}
     */
    loading(key) {
        if (this.scopes[key]) {
            return this.scopes[key].loading;
        }
        return false;
    }
    /**
     * @param {?} key
     * @param {?=} err
     * @return {?}
     */
    setError(key, err = "") {
        if (this.scopes[key]) {
            this.scopes[key].msg = err;
            this.scopes[key].msgtype = "error";
        }
        else {
            this.addKey(key);
            this.setError(key, err);
        }
    }
    /**
     * @param {?} key
     * @return {?}
     */
    clearError(key) {
        this.setError(key, "");
    }
    /**
     * @param {?} key
     * @return {?}
     */
    error(key) {
        if (this.scopes[key]) {
            return this.scopes[key].msg;
        }
        return "";
    }
    /**
     * @param {?} key
     * @param {?} msg
     * @param {?} msgtype
     * @return {?}
     */
    setMessage(key, msg, msgtype) {
        if (this.scopes[key]) {
            this.scopes[key].msg = msg;
            this.scopes[key].msgtype = msgtype;
        }
        else {
            this.addKey(key);
            this.setMessage(key, msg, msgtype);
        }
    }
    /**
     * @param {?} key
     * @return {?}
     */
    message(key) {
        return this.error(key);
    }
    /**
     * @param {?} key
     * @return {?}
     */
    msgType(key) {
        if (this.scopes[key]) {
            return this.scopes[key].msgtype;
        }
        return "";
    }
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class VapaeeFeedbackModule {
}
VapaeeFeedbackModule.decorators = [
    { type: NgModule, args: [{
                imports: [],
                declarations: [],
                providers: [Feedback],
                exports: []
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { Feedback, VapaeeFeedbackModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFwYWVlLWZlZWRiYWNrLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9AdmFwYWVlL2ZlZWRiYWNrL2xpYi9mZWVkYmFjay5zZXJ2aWNlLnRzIiwibmc6Ly9AdmFwYWVlL2ZlZWRiYWNrL2xpYi9mZWVkYmFjay5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBGZWVkIHtcbiAgICBtc2c/OnN0cmluZztcbiAgICBtc2d0eXBlPzpzdHJpbmc7XG4gICAgbG9hZGluZz86Ym9vbGVhbjtcbiAgICBzdGFydD86RGF0ZTtcbiAgICBtYXJrcz86e1xuICAgICAgICBsYWJlbDpzdHJpbmcsXG4gICAgICAgIHNlYzpudW1iZXIsXG4gICAgICAgIG1pbGxpc2VjOm51bWJlclxuICAgIH1bXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZlZWRNYXAge1xuICAgIFtrZXk6c3RyaW5nXTpGZWVkXG59O1xuXG5leHBvcnQgY2xhc3MgRmVlZGJhY2sge1xuICAgIHB1YmxpYyBrZXlzOiBzdHJpbmdbXTtcbiAgICBwcml2YXRlIHNjb3BlczogRmVlZE1hcDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmtleXMgPSBbXVxuICAgICAgICB0aGlzLnNjb3BlcyA9IHt9O1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGUoa2V5czpzdHJpbmdbXSA9IFtdKSB7XG4gICAgICAgIHZhciBmZWVkID0gbmV3IEZlZWRiYWNrKCk7XG4gICAgICAgIGZlZWQua2V5cyA9IGtleXM7XG4gICAgICAgIHJldHVybiBmZWVkO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlU2NvcGVzKCkge1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMua2V5cykge1xuICAgICAgICAgICAgdGhpcy5zY29wZXNbdGhpcy5rZXlzW2ldXSA9IHRoaXMuc2NvcGVzW3RoaXMua2V5c1tpXV0gfHwge31cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkS2V5KGtleTpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcbiAgICAgICAgdGhpcy51cGRhdGVTY29wZXMoKTtcbiAgICB9XG5cbiAgICBzdGFydENocm9ubyhrZXk6c3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLnN0YXJ0ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubWFya3MgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5KGtleSk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0Q2hyb25vKGtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRNYXJjayhrZXk6c3RyaW5nLCBsYWJlbDpzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHZhciBlbGFwc2VkVGltZTpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciBtaWxsaXNlYyA9IGVsYXBzZWRUaW1lLmdldFRpbWUoKSAtIHRoaXMuc2NvcGVzW2tleV0uc3RhcnQuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdmFyIHNlYyA9IG1pbGxpc2VjIC8gMTAwMDtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubWFya3MucHVzaCh7IGxhYmVsLCBzZWMsIG1pbGxpc2VjIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVSUk9SOiBrZXkgbm90IHByZXNlbnRcIiwga2V5LCB0aGlzLnNjb3Blcyk7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH1cblxuICAgIHByaW50Q2hyb25vKGtleTpzdHJpbmcsIGxhc3RNYXJrOmJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNocm9ub21ldGVyIG1hcmtzIGZvciBcIiwga2V5KTtcbiAgICAgICAgICAgIHRoaXMuc2V0TWFyY2soa2V5LCBcInRvdGFsXCIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnNjb3Blc1trZXldLm1hcmtzKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCItIFwiLHRoaXMuc2NvcGVzW2tleV0ubWFya3NbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVSUk9SOiBrZXkgbm90IHByZXNlbnRcIiwga2V5LCB0aGlzLnNjb3Blcyk7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH1cblxuICAgIHNldExvYWRpbmcoa2V5OnN0cmluZywgdmFsdWU6Ym9vbGVhbikge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5sb2FkaW5nID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZEtleShrZXkpO1xuICAgICAgICAgICAgdGhpcy5zZXRMb2FkaW5nKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZGluZyhrZXk6c3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZXNba2V5XS5sb2FkaW5nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBzZXRFcnJvcihrZXk6c3RyaW5nLCBlcnI6IHN0cmluZyA9IFwiXCIpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubXNnID0gZXJyO1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5tc2d0eXBlID0gXCJlcnJvclwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRLZXkoa2V5KTtcbiAgICAgICAgICAgIHRoaXMuc2V0RXJyb3Ioa2V5LCBlcnIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJFcnJvcihrZXk6c3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2V0RXJyb3Ioa2V5LCBcIlwiKTtcbiAgICB9XG5cblxuICAgIGVycm9yKGtleTpzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjb3Blc1trZXldLm1zZztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICBzZXRNZXNzYWdlKGtleTpzdHJpbmcsIG1zZzogc3RyaW5nLCBtc2d0eXBlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubXNnID0gbXNnO1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5tc2d0eXBlID0gbXNndHlwZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5KGtleSk7XG4gICAgICAgICAgICB0aGlzLnNldE1lc3NhZ2Uoa2V5LCBtc2csIG1zZ3R5cGUpO1xuICAgICAgICB9XG4gICAgfSAgICBcblxuICAgIG1lc3NhZ2Uoa2V5OnN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5lcnJvcihrZXkpO1xuICAgIH1cblxuICAgIG1zZ1R5cGUoa2V5OnN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGVzW2tleV0ubXNndHlwZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJFUlJPUlwiLCBrZXksIFt0aGlzLnNjb3Blc10pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxufVxuXG4vKlxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46IFwicm9vdFwiXG59KVxuZXhwb3J0IGNsYXNzIEZlZWRiYWNrU2VydmljZSB7XG4gICAgXG4gICAgY29uc3RydWN0b3IoKXt9XG5cbiAgICBjcmVhdGUoa2V5czpzdHJpbmdbXSA9IFtdKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmVlZGJhY2soa2V5cyk7XG4gICAgfVxufVxuKi8iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRmVlZGJhY2sgfSBmcm9tICcuL2ZlZWRiYWNrLnNlcnZpY2UnO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtdLFxuICAgIGRlY2xhcmF0aW9uczogW10sXG4gICAgcHJvdmlkZXJzOltGZWVkYmFja10sXG4gICAgZXhwb3J0czogW11cbn0pXG5leHBvcnQgY2xhc3MgVmFwYWVlRmVlZGJhY2tNb2R1bGUgeyB9XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztJQW9CSTtRQUNJLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7S0FDcEI7Ozs7O0lBRUQsT0FBTyxNQUFNLENBQUMsT0FBZ0IsRUFBRTs7UUFDNUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixPQUFPLElBQUksQ0FBQztLQUNmOzs7O0lBRU8sWUFBWTtRQUNoQixLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxD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