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
Market.prototype.direct;
/** @type {?} */
Market.prototype.inverse;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMtZGV4LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHZhcGFlZS9kZXgvIiwic291cmNlcyI6WyJsaWIvdHlwZXMtZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUb2tlbkRFWCB9IGZyb20gXCIuL3Rva2VuLWRleC5jbGFzc1wiO1xuaW1wb3J0IHsgQXNzZXRERVggfSBmcm9tIFwiLi9hc3NldC1kZXguY2xhc3NcIjtcblxuZXhwb3J0IGludGVyZmFjZSBNYXJrZXRNYXAge1xuICAgIFtrZXk6c3RyaW5nXTogTWFya2V0O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1hcmtldCB7XG4gICAgc2NvcGU6IHN0cmluZztcbiAgICBjb21vZGl0eTogVG9rZW5ERVgsXG4gICAgY3VycmVuY3k6IFRva2VuREVYLFxuICAgIGRlYWxzOiBudW1iZXI7XG4gICAgYmxvY2tzOiBudW1iZXI7XG4gICAgZGlyZWN0OiBudW1iZXI7XG4gICAgaW52ZXJzZTogbnVtYmVyO1xuICAgIGJsb2NrbGV2ZWxzOiBhbnlbXVtdW107XG4gICAgYmxvY2tsaXN0OiBhbnlbXVtdO1xuICAgIHJldmVyc2VsZXZlbHM6IGFueVtdW11bXTtcbiAgICByZXZlcnNlYmxvY2tzOiBhbnlbXVtdO1xuICAgIGJsb2NrOiB7W2lkOnN0cmluZ106SGlzdG9yeUJsb2NrfTtcbiAgICBvcmRlcnM6IFRva2VuT3JkZXJzO1xuICAgIGhpc3Rvcnk6IEhpc3RvcnlUeFtdO1xuICAgIHR4OiB7W2lkOnN0cmluZ106SGlzdG9yeVR4fTtcbiAgICBcbiAgICBzdW1tYXJ5OiBNYXJrZXRTdW1tYXJ5O1xuICAgIGhlYWRlcjogTWFya2V0SGVhZGVyO1xufVxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFya2V0U3VtbWFyeSB7XG4gICAgc2NvcGU6c3RyaW5nLFxuICAgIHByaWNlOkFzc2V0REVYLFxuICAgIGludmVyc2U6QXNzZXRERVgsXG4gICAgcHJpY2VfMjRoX2FnbzpBc3NldERFWCxcbiAgICBpbnZlcnNlXzI0aF9hZ286QXNzZXRERVgsXG4gICAgbWluX3ByaWNlPzpBc3NldERFWCxcbiAgICBtYXhfcHJpY2U/OkFzc2V0REVYLFxuICAgIG1pbl9pbnZlcnNlPzpBc3NldERFWCxcbiAgICBtYXhfaW52ZXJzZT86QXNzZXRERVgsXG4gICAgdm9sdW1lOkFzc2V0REVYLFxuICAgIGFtb3VudD86QXNzZXRERVgsXG4gICAgcGVyY2VudD86bnVtYmVyLFxuICAgIHBlcmNlbnRfc3RyPzpzdHJpbmcsXG4gICAgaXBlcmNlbnQ/Om51bWJlcixcbiAgICBpcGVyY2VudF9zdHI/OnN0cmluZyxcbiAgICByZWNvcmRzPzogYW55W11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBNYXJrZXRIZWFkZXIge1xuICAgIHNlbGw6T3JkZXJzU3VtbWFyeSxcbiAgICBidXk6T3JkZXJzU3VtbWFyeVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9yZGVyc1N1bW1hcnkge1xuICAgIHRvdGFsOiBBc3NldERFWDtcbiAgICBvcmRlcnM6IG51bWJlcjsgICAgXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVG9rZW5PcmRlcnMge1xuICAgIHNlbGw6T3JkZXJSb3dbXSxcbiAgICBidXk6T3JkZXJSb3dbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEhpc3RvcnlUeCB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICBzdHI6IHN0cmluZztcbiAgICBwcmljZTogQXNzZXRERVg7XG4gICAgaW52ZXJzZTogQXNzZXRERVg7XG4gICAgYW1vdW50OiBBc3NldERFWDtcbiAgICBwYXltZW50OiBBc3NldERFWDtcbiAgICBidXlmZWU6IEFzc2V0REVYO1xuICAgIHNlbGxmZWU6IEFzc2V0REVYO1xuICAgIGJ1eWVyOiBzdHJpbmc7XG4gICAgc2VsbGVyOiBzdHJpbmc7XG4gICAgZGF0ZTogRGF0ZTtcbiAgICBpc2J1eTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFdmVudExvZyB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICB1c2VyOiBzdHJpbmc7XG4gICAgZXZlbnQ6IHN0cmluZztcbiAgICBwYXJhbXM6IHN0cmluZztcbiAgICBkYXRlOiBEYXRlO1xuICAgIHByb2Nlc3NlZD86IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBIaXN0b3J5QmxvY2sge1xuICAgIGlkOiBudW1iZXI7XG4gICAgaG91cjogbnVtYmVyO1xuICAgIHN0cjogc3RyaW5nO1xuICAgIHByaWNlOiBBc3NldERFWDtcbiAgICBpbnZlcnNlOiBBc3NldERFWDtcbiAgICBlbnRyYW5jZTogQXNzZXRERVg7XG4gICAgbWF4OiBBc3NldERFWDtcbiAgICBtaW46IEFzc2V0REVYO1xuICAgIHZvbHVtZTogQXNzZXRERVg7XG4gICAgYW1vdW50OiBBc3NldERFWDtcbiAgICBkYXRlOiBEYXRlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9yZGVyIHtcbiAgICBpZDogbnVtYmVyO1xuICAgIHByaWNlOiBBc3NldERFWDtcbiAgICBpbnZlcnNlOiBBc3NldERFWDtcbiAgICB0b3RhbDogQXNzZXRERVg7XG4gICAgZGVwb3NpdDogQXNzZXRERVg7XG4gICAgdGVsb3M6IEFzc2V0REVYO1xuICAgIG93bmVyOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXNlck9yZGVyc01hcCB7XG4gICAgW2tleTpzdHJpbmddOiBVc2VyT3JkZXJzO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJPcmRlcnMge1xuICAgIHRhYmxlOiBzdHJpbmc7XG4gICAgaWRzOiBudW1iZXJbXTtcbiAgICBvcmRlcnM/OmFueVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9yZGVyUm93IHtcbiAgICBzdHI6IHN0cmluZztcbiAgICBwcmljZTogQXNzZXRERVg7XG4gICAgb3JkZXJzOiBPcmRlcltdO1xuICAgIGludmVyc2U6IEFzc2V0REVYO1xuICAgIHRvdGFsOiBBc3NldERFWDtcbiAgICBzdW06IEFzc2V0REVYO1xuICAgIHN1bXRlbG9zOiBBc3NldERFWDtcbiAgICB0ZWxvczogQXNzZXRERVg7XG4gICAgb3duZXJzOiB7W2tleTpzdHJpbmddOmJvb2xlYW59XG59Il19