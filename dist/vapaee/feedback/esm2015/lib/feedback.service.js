/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
export class Feedback {
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
        else {
            // console.error("ERROR", key, [this.scopes]);
        }
        return "";
    }
}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVlZGJhY2suc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0B2YXBhZWUvZmVlZGJhY2svIiwic291cmNlcyI6WyJsaWIvZmVlZGJhY2suc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBY0MsQ0FBQztBQUVGLE1BQU07SUFJRjtRQUNJLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7S0FDcEI7Ozs7O0lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFnQixFQUFFOztRQUM1QixJQUFJLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUM7S0FDZjs7OztJQUVPLFlBQVk7UUFDaEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO1NBQzlEOzs7Ozs7SUFHRyxNQUFNLENBQUMsR0FBVTtRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7Ozs7OztJQUd4QixXQUFXLENBQUMsR0FBVTtRQUNsQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxD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QUFVO1FBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDMUI7Ozs7O0lBRUQsT0FBTyxDQUFDLEdBQVU7UUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7U0FDbkM7UUFBQyxJQUFJLENBQUMsQ0FBQzs7U0FFUDtRQUNELE1BQU0sQ0FBQyxFQUFFLENBQUM7S0FDYjtDQUVKIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBGZWVkIHtcbiAgICBtc2c/OnN0cmluZztcbiAgICBtc2d0eXBlPzpzdHJpbmc7XG4gICAgbG9hZGluZz86Ym9vbGVhbjtcbiAgICBzdGFydD86RGF0ZTtcbiAgICBtYXJrcz86e1xuICAgICAgICBsYWJlbDpzdHJpbmcsXG4gICAgICAgIHNlYzpudW1iZXIsXG4gICAgICAgIG1pbGxpc2VjOm51bWJlclxuICAgIH1bXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZlZWRNYXAge1xuICAgIFtrZXk6c3RyaW5nXTpGZWVkXG59O1xuXG5leHBvcnQgY2xhc3MgRmVlZGJhY2sge1xuICAgIHB1YmxpYyBrZXlzOiBzdHJpbmdbXTtcbiAgICBwcml2YXRlIHNjb3BlczogRmVlZE1hcDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmtleXMgPSBbXVxuICAgICAgICB0aGlzLnNjb3BlcyA9IHt9O1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGUoa2V5czpzdHJpbmdbXSA9IFtdKSB7XG4gICAgICAgIHZhciBmZWVkID0gbmV3IEZlZWRiYWNrKCk7XG4gICAgICAgIGZlZWQua2V5cyA9IGtleXM7XG4gICAgICAgIHJldHVybiBmZWVkO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlU2NvcGVzKCkge1xuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMua2V5cykge1xuICAgICAgICAgICAgdGhpcy5zY29wZXNbdGhpcy5rZXlzW2ldXSA9IHRoaXMuc2NvcGVzW3RoaXMua2V5c1tpXV0gfHwge31cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkS2V5KGtleTpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcbiAgICAgICAgdGhpcy51cGRhdGVTY29wZXMoKTtcbiAgICB9XG5cbiAgICBzdGFydENocm9ubyhrZXk6c3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLnN0YXJ0ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubWFya3MgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5KGtleSk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0Q2hyb25vKGtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRNYXJjayhrZXk6c3RyaW5nLCBsYWJlbDpzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHZhciBlbGFwc2VkVGltZTpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciBtaWxsaXNlYyA9IGVsYXBzZWRUaW1lLmdldFRpbWUoKSAtIHRoaXMuc2NvcGVzW2tleV0uc3RhcnQuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdmFyIHNlYyA9IG1pbGxpc2VjIC8gMTAwMDtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubWFya3MucHVzaCh7IGxhYmVsLCBzZWMsIG1pbGxpc2VjIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVSUk9SOiBrZXkgbm90IHByZXNlbnRcIiwga2V5LCB0aGlzLnNjb3Blcyk7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH1cblxuICAgIHByaW50Q2hyb25vKGtleTpzdHJpbmcsIGxhc3RNYXJrOmJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNocm9ub21ldGVyIG1hcmtzIGZvciBcIiwga2V5KTtcbiAgICAgICAgICAgIHRoaXMuc2V0TWFyY2soa2V5LCBcInRvdGFsXCIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnNjb3Blc1trZXldLm1hcmtzKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCItIFwiLHRoaXMuc2NvcGVzW2tleV0ubWFya3NbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVSUk9SOiBrZXkgbm90IHByZXNlbnRcIiwga2V5LCB0aGlzLnNjb3Blcyk7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH1cblxuICAgIHNldExvYWRpbmcoa2V5OnN0cmluZywgdmFsdWU6Ym9vbGVhbikge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5sb2FkaW5nID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZEtleShrZXkpO1xuICAgICAgICAgICAgdGhpcy5zZXRMb2FkaW5nKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZGluZyhrZXk6c3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZXNba2V5XS5sb2FkaW5nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBzZXRFcnJvcihrZXk6c3RyaW5nLCBlcnI6IHN0cmluZyA9IFwiXCIpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubXNnID0gZXJyO1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5tc2d0eXBlID0gXCJlcnJvclwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRLZXkoa2V5KTtcbiAgICAgICAgICAgIHRoaXMuc2V0RXJyb3Ioa2V5LCBlcnIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJFcnJvcihrZXk6c3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2V0RXJyb3Ioa2V5LCBcIlwiKTtcbiAgICB9XG5cblxuICAgIGVycm9yKGtleTpzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjb3Blc1trZXldLm1zZztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICBzZXRNZXNzYWdlKGtleTpzdHJpbmcsIG1zZzogc3RyaW5nLCBtc2d0eXBlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubXNnID0gbXNnO1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5tc2d0eXBlID0gbXNndHlwZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5KGtleSk7XG4gICAgICAgICAgICB0aGlzLnNldE1lc3NhZ2Uoa2V5LCBtc2csIG1zZ3R5cGUpO1xuICAgICAgICB9XG4gICAgfSAgICBcblxuICAgIG1lc3NhZ2Uoa2V5OnN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5lcnJvcihrZXkpO1xuICAgIH1cblxuICAgIG1zZ1R5cGUoa2V5OnN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGVzW2tleV0ubXNndHlwZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJFUlJPUlwiLCBrZXksIFt0aGlzLnNjb3Blc10pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxufVxuXG4vKlxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46IFwicm9vdFwiXG59KVxuZXhwb3J0IGNsYXNzIEZlZWRiYWNrU2VydmljZSB7XG4gICAgXG4gICAgY29uc3RydWN0b3IoKXt9XG5cbiAgICBjcmVhdGUoa2V5czpzdHJpbmdbXSA9IFtdKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmVlZGJhY2soa2V5cyk7XG4gICAgfVxufVxuKi8iXX0=