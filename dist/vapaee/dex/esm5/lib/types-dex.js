/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function MarketMap() { }
/**
 * @record
 */
export function Market() { }
/** @type {?} */
Market.prototype.scope;
/** @type {?} */
Market.prototype.comodity;
/** @type {?} */
Market.prototype.currency;
/** @type {?} */
Market.prototype.deals;
/** @type {?} */
Market.prototype.blocks;
/** @type {?} */
Market.prototype.blocklevels;
/** @type {?} */
Market.prototype.blocklist;
/** @type {?} */
Market.prototype.reverselevels;
/** @type {?} */
Market.prototype.reverseblocks;
/** @type {?} */
Market.prototype.block;
/** @type {?} */
Market.prototype.orders;
/** @type {?} */
Market.prototype.history;
/** @type {?} */
Market.prototype.tx;
/** @type {?} */
Market.prototype.summary;
/** @type {?} */
Market.prototype.header;
/**
 * @record
 */
export function MarketSummary() { }
/** @type {?} */
MarketSummary.prototype.scope;
/** @type {?} */
MarketSummary.prototype.price;
/** @type {?} */
MarketSummary.prototype.inverse;
/** @type {?} */
MarketSummary.prototype.price_24h_ago;
/** @type {?} */
MarketSummary.prototype.inverse_24h_ago;
/** @type {?|undefined} */
MarketSummary.prototype.min_price;
/** @type {?|undefined} */
MarketSummary.prototype.max_price;
/** @type {?|undefined} */
MarketSummary.prototype.min_inverse;
/** @type {?|undefined} */
MarketSummary.prototype.max_inverse;
/** @type {?} */
MarketSummary.prototype.volume;
/** @type {?|undefined} */
MarketSummary.prototype.amount;
/** @type {?|undefined} */
MarketSummary.prototype.percent;
/** @type {?|undefined} */
MarketSummary.prototype.percent_str;
/** @type {?|undefined} */
MarketSummary.prototype.ipercent;
/** @type {?|undefined} */
MarketSummary.prototype.ipercent_str;
/** @type {?|undefined} */
MarketSummary.prototype.records;
/**
 * @record
 */
export function MarketHeader() { }
/** @type {?} */
MarketHeader.prototype.sell;
/** @type {?} */
MarketHeader.prototype.buy;
/**
 * @record
 */
export function OrdersSummary() { }
/** @type {?} */
OrdersSummary.prototype.total;
/** @type {?} */
OrdersSummary.prototype.orders;
/**
 * @record
 */
export function TokenOrders() { }
/** @type {?} */
TokenOrders.prototype.sell;
/** @type {?} */
TokenOrders.prototype.buy;
/**
 * @record
 */
export function HistoryTx() { }
/** @type {?} */
HistoryTx.prototype.id;
/** @type {?} */
HistoryTx.prototype.str;
/** @type {?} */
HistoryTx.prototype.price;
/** @type {?} */
HistoryTx.prototype.inverse;
/** @type {?} */
HistoryTx.prototype.amount;
/** @type {?} */
HistoryTx.prototype.payment;
/** @type {?} */
HistoryTx.prototype.buyfee;
/** @type {?} */
HistoryTx.prototype.sellfee;
/** @type {?} */
HistoryTx.prototype.buyer;
/** @type {?} */
HistoryTx.prototype.seller;
/** @type {?} */
HistoryTx.prototype.date;
/** @type {?} */
HistoryTx.prototype.isbuy;
/**
 * @record
 */
export function EventLog() { }
/** @type {?} */
EventLog.prototype.id;
/** @type {?} */
EventLog.prototype.user;
/** @type {?} */
EventLog.prototype.event;
/** @type {?} */
EventLog.prototype.params;
/** @type {?} */
EventLog.prototype.date;
/** @type {?|undefined} */
EventLog.prototype.processed;
/**
 * @record
 */
export function HistoryBlock() { }
/** @type {?} */
HistoryBlock.prototype.id;
/** @type {?} */
HistoryBlock.prototype.hour;
/** @type {?} */
HistoryBlock.prototype.str;
/** @type {?} */
HistoryBlock.prototype.price;
/** @type {?} */
HistoryBlock.prototype.inverse;
/** @type {?} */
HistoryBlock.prototype.entrance;
/** @type {?} */
HistoryBlock.prototype.max;
/** @type {?} */
HistoryBlock.prototype.min;
/** @type {?} */
HistoryBlock.prototype.volume;
/** @type {?} */
HistoryBlock.prototype.amount;
/** @type {?} */
HistoryBlock.prototype.date;
/**
 * @record
 */
export function Order() { }
/** @type {?} */
Order.prototype.id;
/** @type {?} */
Order.prototype.price;
/** @type {?} */
Order.prototype.inverse;
/** @type {?} */
Order.prototype.total;
/** @type {?} */
Order.prototype.deposit;
/** @type {?} */
Order.prototype.telos;
/** @type {?} */
Order.prototype.owner;
/**
 * @record
 */
export function UserOrdersMap() { }
/**
 * @record
 */
export function UserOrders() { }
/** @type {?} */
UserOrders.prototype.table;
/** @type {?} */
UserOrders.prototype.ids;
/** @type {?|undefined} */
UserOrders.prototype.orders;
/**
 * @record
 */
export function OrderRow() { }
/** @type {?} */
OrderRow.prototype.str;
/** @type {?} */
OrderRow.prototype.price;
/** @type {?} */
OrderRow.prototype.orders;
/** @type {?} */
OrderRow.prototype.inverse;
/** @type {?} */
OrderRow.prototype.total;
/** @type {?} */
OrderRow.prototype.sum;
/** @type {?} */
OrderRow.prototype.sumtelos;
/** @type {?} */
OrderRow.prototype.telos;
/** @type {?} */
OrderRow.prototype.owners;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMtZGV4LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHZhcGFlZS9kZXgvIiwic291cmNlcyI6WyJsaWIvdHlwZXMtZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUb2tlbkRFWCB9IGZyb20gXCIuL3Rva2VuLWRleC5jbGFzc1wiO1xuaW1wb3J0IHsgQXNzZXRERVggfSBmcm9tIFwiLi9hc3NldC1kZXguY2xhc3NcIjtcblxuZXhwb3J0IGludGVyZmFjZSBNYXJrZXRNYXAge1xuICAgIFtrZXk6c3RyaW5nXTogTWFya2V0O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1hcmtldCB7XG4gICAgc2NvcGU6IHN0cmluZztcbiAgICBjb21vZGl0eTogVG9rZW5ERVgsXG4gICAgY3VycmVuY3k6IFRva2VuREVYLFxuICAgIGRlYWxzOiBudW1iZXI7XG4gICAgYmxvY2tzOiBudW1iZXI7XG4gICAgYmxvY2tsZXZlbHM6IGFueVtdW11bXTtcbiAgICBibG9ja2xpc3Q6IGFueVtdW107XG4gICAgcmV2ZXJzZWxldmVsczogYW55W11bXVtdO1xuICAgIHJldmVyc2VibG9ja3M6IGFueVtdW107XG4gICAgYmxvY2s6IHtbaWQ6c3RyaW5nXTpIaXN0b3J5QmxvY2t9O1xuICAgIG9yZGVyczogVG9rZW5PcmRlcnM7XG4gICAgaGlzdG9yeTogSGlzdG9yeVR4W107XG4gICAgdHg6IHtbaWQ6c3RyaW5nXTpIaXN0b3J5VHh9O1xuICAgIFxuICAgIHN1bW1hcnk6IE1hcmtldFN1bW1hcnk7XG4gICAgaGVhZGVyOiBNYXJrZXRIZWFkZXI7XG59XG5cblxuZXhwb3J0IGludGVyZmFjZSBNYXJrZXRTdW1tYXJ5IHtcbiAgICBzY29wZTpzdHJpbmcsXG4gICAgcHJpY2U6QXNzZXRERVgsXG4gICAgaW52ZXJzZTpBc3NldERFWCxcbiAgICBwcmljZV8yNGhfYWdvOkFzc2V0REVYLFxuICAgIGludmVyc2VfMjRoX2FnbzpBc3NldERFWCxcbiAgICBtaW5fcHJpY2U/OkFzc2V0REVYLFxuICAgIG1heF9wcmljZT86QXNzZXRERVgsXG4gICAgbWluX2ludmVyc2U/OkFzc2V0REVYLFxuICAgIG1heF9pbnZlcnNlPzpBc3NldERFWCxcbiAgICB2b2x1bWU6QXNzZXRERVgsXG4gICAgYW1vdW50PzpBc3NldERFWCxcbiAgICBwZXJjZW50PzpudW1iZXIsXG4gICAgcGVyY2VudF9zdHI/OnN0cmluZyxcbiAgICBpcGVyY2VudD86bnVtYmVyLFxuICAgIGlwZXJjZW50X3N0cj86c3RyaW5nLFxuICAgIHJlY29yZHM/OiBhbnlbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1hcmtldEhlYWRlciB7XG4gICAgc2VsbDpPcmRlcnNTdW1tYXJ5LFxuICAgIGJ1eTpPcmRlcnNTdW1tYXJ5XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3JkZXJzU3VtbWFyeSB7XG4gICAgdG90YWw6IEFzc2V0REVYO1xuICAgIG9yZGVyczogbnVtYmVyOyAgICBcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUb2tlbk9yZGVycyB7XG4gICAgc2VsbDpPcmRlclJvd1tdLFxuICAgIGJ1eTpPcmRlclJvd1tdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSGlzdG9yeVR4IHtcbiAgICBpZDogbnVtYmVyO1xuICAgIHN0cjogc3RyaW5nO1xuICAgIHByaWNlOiBBc3NldERFWDtcbiAgICBpbnZlcnNlOiBBc3NldERFWDtcbiAgICBhbW91bnQ6IEFzc2V0REVYO1xuICAgIHBheW1lbnQ6IEFzc2V0REVYO1xuICAgIGJ1eWZlZTogQXNzZXRERVg7XG4gICAgc2VsbGZlZTogQXNzZXRERVg7XG4gICAgYnV5ZXI6IHN0cmluZztcbiAgICBzZWxsZXI6IHN0cmluZztcbiAgICBkYXRlOiBEYXRlO1xuICAgIGlzYnV5OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50TG9nIHtcbiAgICBpZDogbnVtYmVyO1xuICAgIHVzZXI6IHN0cmluZztcbiAgICBldmVudDogc3RyaW5nO1xuICAgIHBhcmFtczogc3RyaW5nO1xuICAgIGRhdGU6IERhdGU7XG4gICAgcHJvY2Vzc2VkPzogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEhpc3RvcnlCbG9jayB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICBob3VyOiBudW1iZXI7XG4gICAgc3RyOiBzdHJpbmc7XG4gICAgcHJpY2U6IEFzc2V0REVYO1xuICAgIGludmVyc2U6IEFzc2V0REVYO1xuICAgIGVudHJhbmNlOiBBc3NldERFWDtcbiAgICBtYXg6IEFzc2V0REVYO1xuICAgIG1pbjogQXNzZXRERVg7XG4gICAgdm9sdW1lOiBBc3NldERFWDtcbiAgICBhbW91bnQ6IEFzc2V0REVYO1xuICAgIGRhdGU6IERhdGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3JkZXIge1xuICAgIGlkOiBudW1iZXI7XG4gICAgcHJpY2U6IEFzc2V0REVYO1xuICAgIGludmVyc2U6IEFzc2V0REVYO1xuICAgIHRvdGFsOiBBc3NldERFWDtcbiAgICBkZXBvc2l0OiBBc3NldERFWDtcbiAgICB0ZWxvczogQXNzZXRERVg7XG4gICAgb3duZXI6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVc2VyT3JkZXJzTWFwIHtcbiAgICBba2V5OnN0cmluZ106IFVzZXJPcmRlcnM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXNlck9yZGVycyB7XG4gICAgdGFibGU6IHN0cmluZztcbiAgICBpZHM6IG51bWJlcltdO1xuICAgIG9yZGVycz86YW55W107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3JkZXJSb3cge1xuICAgIHN0cjogc3RyaW5nO1xuICAgIHByaWNlOiBBc3NldERFWDtcbiAgICBvcmRlcnM6IE9yZGVyW107XG4gICAgaW52ZXJzZTogQXNzZXRERVg7XG4gICAgdG90YWw6IEFzc2V0REVYO1xuICAgIHN1bTogQXNzZXRERVg7XG4gICAgc3VtdGVsb3M6IEFzc2V0REVYO1xuICAgIHRlbG9zOiBBc3NldERFWDtcbiAgICBvd25lcnM6IHtba2V5OnN0cmluZ106Ym9vbGVhbn1cbn0iXX0=