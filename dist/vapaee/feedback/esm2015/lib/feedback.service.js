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
Feedback.decorators = [
    { type: Injectable, args: [{
                providedIn: "root"
            },] },
];
/** @nocollapse */
Feedback.ctorParameters = () => [];
/** @nocollapse */ Feedback.ngInjectableDef = i0.defineInjectable({ factory: function Feedback_Factory() { return new Feedback(); }, token: Feedback, providedIn: "root" });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVlZGJhY2suc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0B2YXBhZWUvZmVlZGJhY2svIiwic291cmNlcyI6WyJsaWIvZmVlZGJhY2suc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFhLFVBQVUsRUFBbUIsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJ0RSxDQUFDO0FBS0YsTUFBTTtJQUlGO1FBQ0ksSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUE7UUFDZCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztLQUNwQjs7Ozs7SUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQWdCLEVBQUU7O1FBQzVCLElBQUksSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQztLQUNmOzs7O0lBRU8sWUFBWTtRQUNoQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7U0FDOUQ7Ozs7OztJQUdHLE1BQU0sQ0FBQyxHQUFVO1FBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7Ozs7O0lBR3hCLFdBQVcsQ0FBQyxHQUFVO1FBQ2xCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1NBQy9CO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDekI7S0FDSjs7Ozs7O0lBRUQsUUFBUSxDQUFDLEdBQVUsRUFBRSxLQUFZO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztZQUNuQixJQUFJLFdBQVcsR0FBUSxJQUFJLElBQUksRUFBRSxDQUFDOztZQUNsQyxJQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7O1lBQ3hFLElBQUksR0FBRyxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQ3pEO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixPQUFPLENBQUMsS0FBSyxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDN0Q7S0FDSjs7Ozs7O0lBRUQsV0FBVyxDQUFDLEdBQVUsRUFBRSxXQUFtQixJQUFJO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDNUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQy9DO1NBQ0o7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM3RDtLQUNKOzs7Ozs7SUFFRCxVQUFVLENBQUMsR0FBVSxFQUFFLEtBQWE7UUFDaEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1NBQ3BDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQy9CO0tBQ0o7Ozs7O0lBRUQsT0FBTyxDQUFDLEdBQVU7UUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7U0FDbkM7UUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO0tBQ2hCOzs7Ozs7SUFFRCxRQUFRLENBQUMsR0FBVSxFQUFFLE1BQWMsRUFBRTtRQUNqQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1NBQ3RDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQzNCO0tBQ0o7Ozs7O0lBRUQsVUFBVSxDQUFDLEdBQVU7UUFDakIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDMUI7Ozs7O0lBR0QsS0FBSyxDQUFDLEdBQVU7UUFDWixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7U0FDL0I7UUFDRCxNQUFNLENBQUMsRUFBRSxDQUFDO0tBQ2I7Ozs7Ozs7SUFFRCxVQUFVLENBQUMsR0FBVSxFQUFFLEdBQVcsRUFBRSxPQUFlO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztZQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7U0FDdEM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3RDO0tBQ0o7Ozs7O0lBRUQsT0FBTyxDQUFDLEdBQVU7UUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMxQjs7Ozs7SUFFRCxPQUFPLENBQUMsR0FBVTtRQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztTQUNuQztRQUFDLElBQUksQ0FBQyxDQUFDOztTQUVQO1FBQ0QsTUFBTSxDQUFDLEVBQUUsQ0FBQztLQUNiOzs7WUF6SEosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBQyxNQUFNO2FBQ3BCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3RhYmxlLCBQaXBlLCBEaXJlY3RpdmUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCJAYW5ndWxhci9jb21waWxlclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZlZWQge1xuICAgIG1zZz86c3RyaW5nO1xuICAgIG1zZ3R5cGU/OnN0cmluZztcbiAgICBsb2FkaW5nPzpib29sZWFuO1xuICAgIHN0YXJ0PzpEYXRlO1xuICAgIG1hcmtzPzp7XG4gICAgICAgIGxhYmVsOnN0cmluZyxcbiAgICAgICAgc2VjOm51bWJlcixcbiAgICAgICAgbWlsbGlzZWM6bnVtYmVyXG4gICAgfVtdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmVlZE1hcCB7XG4gICAgW2tleTpzdHJpbmddOkZlZWRcbn07XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOlwicm9vdFwiXG59KVxuZXhwb3J0IGNsYXNzIEZlZWRiYWNrIHtcbiAgICBwdWJsaWMga2V5czogc3RyaW5nW107XG4gICAgcHJpdmF0ZSBzY29wZXM6IEZlZWRNYXA7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5rZXlzID0gW11cbiAgICAgICAgdGhpcy5zY29wZXMgPSB7fTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlKGtleXM6c3RyaW5nW10gPSBbXSkge1xuICAgICAgICB2YXIgZmVlZCA9IG5ldyBGZWVkYmFjaygpO1xuICAgICAgICBmZWVkLmtleXMgPSBrZXlzO1xuICAgICAgICByZXR1cm4gZmVlZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVNjb3BlcygpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmtleXMpIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW3RoaXMua2V5c1tpXV0gPSB0aGlzLnNjb3Blc1t0aGlzLmtleXNbaV1dIHx8IHt9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZEtleShrZXk6c3RyaW5nKSB7XG4gICAgICAgIHRoaXMua2V5cy5wdXNoKGtleSk7XG4gICAgICAgIHRoaXMudXBkYXRlU2NvcGVzKCk7XG4gICAgfVxuXG4gICAgc3RhcnRDaHJvbm8oa2V5OnN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5zY29wZXNba2V5XS5zdGFydCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLm1hcmtzID0gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZEtleShrZXkpO1xuICAgICAgICAgICAgdGhpcy5zdGFydENocm9ubyhrZXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0TWFyY2soa2V5OnN0cmluZywgbGFiZWw6c3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICB2YXIgZWxhcHNlZFRpbWU6RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB2YXIgbWlsbGlzZWMgPSBlbGFwc2VkVGltZS5nZXRUaW1lKCkgLSB0aGlzLnNjb3Blc1trZXldLnN0YXJ0LmdldFRpbWUoKTtcbiAgICAgICAgICAgIHZhciBzZWMgPSBtaWxsaXNlYyAvIDEwMDA7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLm1hcmtzLnB1c2goeyBsYWJlbCwgc2VjLCBtaWxsaXNlYyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjoga2V5IG5vdCBwcmVzZW50XCIsIGtleSwgdGhpcy5zY29wZXMpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9XG5cbiAgICBwcmludENocm9ubyhrZXk6c3RyaW5nLCBsYXN0TWFyazpib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDaHJvbm9tZXRlciBtYXJrcyBmb3IgXCIsIGtleSk7XG4gICAgICAgICAgICB0aGlzLnNldE1hcmNrKGtleSwgXCJ0b3RhbFwiKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5zY29wZXNba2V5XS5tYXJrcykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLSBcIix0aGlzLnNjb3Blc1trZXldLm1hcmtzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjoga2V5IG5vdCBwcmVzZW50XCIsIGtleSwgdGhpcy5zY29wZXMpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9XG5cbiAgICBzZXRMb2FkaW5nKGtleTpzdHJpbmcsIHZhbHVlOmJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubG9hZGluZyA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRLZXkoa2V5KTtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9hZGluZyhrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvYWRpbmcoa2V5OnN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zY29wZXNba2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGVzW2tleV0ubG9hZGluZztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgc2V0RXJyb3Ioa2V5OnN0cmluZywgZXJyOiBzdHJpbmcgPSBcIlwiKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLm1zZyA9IGVycjtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubXNndHlwZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5KGtleSk7XG4gICAgICAgICAgICB0aGlzLnNldEVycm9yKGtleSwgZXJyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyRXJyb3Ioa2V5OnN0cmluZykge1xuICAgICAgICB0aGlzLnNldEVycm9yKGtleSwgXCJcIik7XG4gICAgfVxuXG5cbiAgICBlcnJvcihrZXk6c3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZXNba2V5XS5tc2c7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG4gICAgc2V0TWVzc2FnZShrZXk6c3RyaW5nLCBtc2c6IHN0cmluZywgbXNndHlwZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blc1trZXldKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3Blc1trZXldLm1zZyA9IG1zZztcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzW2tleV0ubXNndHlwZSA9IG1zZ3R5cGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZEtleShrZXkpO1xuICAgICAgICAgICAgdGhpcy5zZXRNZXNzYWdlKGtleSwgbXNnLCBtc2d0eXBlKTtcbiAgICAgICAgfVxuICAgIH0gICAgXG5cbiAgICBtZXNzYWdlKGtleTpzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3Ioa2V5KTtcbiAgICB9XG5cbiAgICBtc2dUeXBlKGtleTpzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVzW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjb3Blc1trZXldLm1zZ3R5cGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKFwiRVJST1JcIiwga2V5LCBbdGhpcy5zY29wZXNdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbn1cblxuLypcbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiBcInJvb3RcIlxufSlcbmV4cG9ydCBjbGFzcyBGZWVkYmFja1NlcnZpY2Uge1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKCl7fVxuXG4gICAgY3JlYXRlKGtleXM6c3RyaW5nW10gPSBbXSkge1xuICAgICAgICByZXR1cm4gbmV3IEZlZWRiYWNrKGtleXMpO1xuICAgIH1cbn1cbiovIl19