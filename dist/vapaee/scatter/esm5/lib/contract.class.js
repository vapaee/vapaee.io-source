/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function TableParams() { }
/** @type {?|undefined} */
TableParams.prototype.contract;
/** @type {?|undefined} */
TableParams.prototype.scope;
/** @type {?|undefined} */
TableParams.prototype.table_key;
/** @type {?|undefined} */
TableParams.prototype.lower_bound;
/** @type {?|undefined} */
TableParams.prototype.upper_bound;
/** @type {?|undefined} */
TableParams.prototype.limit;
/** @type {?|undefined} */
TableParams.prototype.key_type;
/** @type {?|undefined} */
TableParams.prototype.index_position;
/**
 * @record
 */
export function TableResult() { }
/** @type {?} */
TableResult.prototype.more;
/** @type {?} */
TableResult.prototype.rows;
var SmartContract = /** @class */ (function () {
    function SmartContract(contract, scatter) {
        if (contract === void 0) { contract = ""; }
        if (scatter === void 0) { scatter = null; }
        this.contract = contract;
        this.scatter = scatter;
    }
    /*
    // eosjs2
    excecute(action: string, params: any) {
        console.log("Utils.excecute()", action, [params]);
        return new Promise<any>((resolve, reject) => {
            try {
                this.scatter.executeTransaction(this.contract, action, params).then(result => {
                    resolve(result);
                }).catch(err => {
                    console.error("ERROR: ", err);
                    reject(err);
                });
            } catch (err) { console.error(err); reject(err); }
        }); // .catch(err => console.error(err) );
    }
    /*/
    /**
     * @param {?} action
     * @param {?} params
     * @return {?}
     */
    SmartContract.prototype.excecute = /**
     * @param {?} action
     * @param {?} params
     * @return {?}
     */
    function (action, params) {
        var _this = this;
        console.log("Utils.excecute()", action, [params]);
        return new Promise(function (resolve, reject) {
            try {
                _this.scatter.getContractWrapper(_this.contract).then(function (contract) {
                    try {
                        contract[action](params, _this.scatter.authorization).then((function (response) {
                            console.log("Utils.excecute() ---> ", [response]);
                            resolve(response);
                        })).catch(function (err) { reject(err); });
                    }
                    catch (err) {
                        reject(err);
                    }
                }).catch(function (err) { reject(err); });
            }
            catch (err) {
                reject(err);
            }
        }); // .catch(err => console.error(err) );
    };
    //*/
    /**
     * @param {?} table
     * @param {?=} params
     * @return {?}
     */
    SmartContract.prototype.getTable = /**
     * @param {?} table
     * @param {?=} params
     * @return {?}
     */
    function (table, params) {
        if (params === void 0) { params = {}; }
        /** @type {?} */
        var _p = Object.assign({
            contract: this.contract,
            scope: this.contract,
            table_key: "0",
            lower_bound: "0",
            upper_bound: "-1",
            limit: 25,
            key_type: "i64",
            index_position: "1"
        }, params);
        return this.scatter.getTableRows(_p.contract, _p.scope, table, _p.table_key, _p.lower_bound, _p.upper_bound, _p.limit, _p.key_type, _p.index_position);
    };
    return SmartContract;
}());
export { SmartContract };
if (false) {
    /** @type {?} */
    SmartContract.prototype.contract;
    /** @type {?} */
    SmartContract.prototype.scatter;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QuY2xhc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AdmFwYWVlL3NjYXR0ZXIvIiwic291cmNlcyI6WyJsaWIvY29udHJhY3QuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsSUFBQTtJQUlJLHVCQUFZLFFBQXFCLEVBQUUsT0FBNkI7UUFBcEQseUJBQUEsRUFBQSxhQUFxQjtRQUFFLHdCQUFBLEVBQUEsY0FBNkI7UUFDNUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7S0FDMUI7SUFDRDs7Ozs7Ozs7Ozs7Ozs7O09BZUc7Ozs7OztJQUNILGdDQUFROzs7OztJQUFSLFVBQVMsTUFBYyxFQUFFLE1BQVc7UUFBcEMsaUJBY0M7UUFiRyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFNLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDcEMsSUFBSSxDQUFDO2dCQUNELEtBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7b0JBQ3hELElBQUksQ0FBQzt3QkFDRCxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBQSxRQUFROzRCQUMvRCxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs0QkFDbEQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3lCQUNyQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQSxHQUFHLElBQU0sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUN0QztvQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQUU7aUJBQ2pDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQSxHQUFHLElBQU0sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ3JDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQUU7U0FDakMsQ0FBQyxDQUFDO0tBQ047SUFDRCxJQUFJOzs7Ozs7SUFFSixnQ0FBUTs7Ozs7SUFBUixVQUFTLEtBQVksRUFBRSxNQUF1QjtRQUF2Qix1QkFBQSxFQUFBLFdBQXVCOztRQUUxQyxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ25CLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDcEIsU0FBUyxFQUFFLEdBQUc7WUFDZCxXQUFXLEVBQUUsR0FBRztZQUNoQixXQUFXLEVBQUUsSUFBSTtZQUNqQixLQUFLLEVBQUUsRUFBRTtZQUNULFFBQVEsRUFBRSxLQUFLO1lBQ2YsY0FBYyxFQUFFLEdBQUc7U0FDdEIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVYLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FDNUIsRUFBRSxDQUFDLFFBQVEsRUFDWCxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFDZixFQUFFLENBQUMsU0FBUyxFQUNaLEVBQUUsQ0FBQyxXQUFXLEVBQ2QsRUFBRSxDQUFDLFdBQVcsRUFDZCxFQUFFLENBQUMsS0FBSyxFQUNSLEVBQUUsQ0FBQyxRQUFRLEVBQ1gsRUFBRSxDQUFDLGNBQWMsQ0FDcEIsQ0FBQztLQUNMO3dCQW5GTDtJQXFGQyxDQUFBO0FBbEVELHlCQWtFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZhcGFlZVNjYXR0ZXIgfSBmcm9tIFwiLi9zY2F0dGVyLnNlcnZpY2VcIjtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgaW50ZXJmYWNlIFRhYmxlUGFyYW1zIHtcbiAgICBjb250cmFjdD86c3RyaW5nLCBcbiAgICBzY29wZT86c3RyaW5nLCBcbiAgICB0YWJsZV9rZXk/OnN0cmluZywgXG4gICAgbG93ZXJfYm91bmQ/OnN0cmluZywgXG4gICAgdXBwZXJfYm91bmQ/OnN0cmluZywgXG4gICAgbGltaXQ/Om51bWJlciwgXG4gICAga2V5X3R5cGU/OnN0cmluZywgXG4gICAgaW5kZXhfcG9zaXRpb24/OnN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRhYmxlUmVzdWx0IHtcbiAgICBtb3JlOiBib29sZWFuO1xuICAgIHJvd3M6IGFueVtdO1xufVxuXG5leHBvcnQgY2xhc3MgU21hcnRDb250cmFjdCB7XG4gICAgY29udHJhY3Q6IHN0cmluZztcbiAgICBzY2F0dGVyOiBWYXBhZWVTY2F0dGVyO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKGNvbnRyYWN0OiBzdHJpbmcgPSBcIlwiLCBzY2F0dGVyOiBWYXBhZWVTY2F0dGVyID0gbnVsbCkge1xuICAgICAgICB0aGlzLmNvbnRyYWN0ID0gY29udHJhY3Q7XG4gICAgICAgIHRoaXMuc2NhdHRlciA9IHNjYXR0ZXI7XG4gICAgfSAgICBcbiAgICAvKlxuICAgIC8vIGVvc2pzMlxuICAgIGV4Y2VjdXRlKGFjdGlvbjogc3RyaW5nLCBwYXJhbXM6IGFueSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlV0aWxzLmV4Y2VjdXRlKClcIiwgYWN0aW9uLCBbcGFyYW1zXSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2F0dGVyLmV4ZWN1dGVUcmFuc2FjdGlvbih0aGlzLmNvbnRyYWN0LCBhY3Rpb24sIHBhcmFtcykudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVSUk9SOiBcIiwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHsgY29uc29sZS5lcnJvcihlcnIpOyByZWplY3QoZXJyKTsgfVxuICAgICAgICB9KTsgLy8gLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKGVycikgKTtcbiAgICB9XG4gICAgLyovXG4gICAgZXhjZWN1dGUoYWN0aW9uOiBzdHJpbmcsIHBhcmFtczogYW55KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVXRpbHMuZXhjZWN1dGUoKVwiLCBhY3Rpb24sIFtwYXJhbXNdKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjYXR0ZXIuZ2V0Q29udHJhY3RXcmFwcGVyKHRoaXMuY29udHJhY3QpLnRoZW4oY29udHJhY3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJhY3RbYWN0aW9uXShwYXJhbXMsIHRoaXMuc2NhdHRlci5hdXRob3JpemF0aW9uKS50aGVuKChyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVdGlscy5leGNlY3V0ZSgpIC0tLT4gXCIsIFtyZXNwb25zZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkpLmNhdGNoKGVyciA9PiB7IHJlamVjdChlcnIpOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7IHJlamVjdChlcnIpOyB9XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IHsgcmVqZWN0KGVycik7IH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7IHJlamVjdChlcnIpOyB9XG4gICAgICAgIH0pOyAvLyAuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoZXJyKSApO1xuICAgIH1cbiAgICAvLyovXG5cbiAgICBnZXRUYWJsZSh0YWJsZTpzdHJpbmcsIHBhcmFtczpUYWJsZVBhcmFtcyA9IHt9KTogUHJvbWlzZTxUYWJsZVJlc3VsdD4ge1xuXG4gICAgICAgIHZhciBfcCA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgY29udHJhY3Q6IHRoaXMuY29udHJhY3QsIFxuICAgICAgICAgICAgc2NvcGU6IHRoaXMuY29udHJhY3QsIFxuICAgICAgICAgICAgdGFibGVfa2V5OiBcIjBcIiwgXG4gICAgICAgICAgICBsb3dlcl9ib3VuZDogXCIwXCIsIFxuICAgICAgICAgICAgdXBwZXJfYm91bmQ6IFwiLTFcIiwgXG4gICAgICAgICAgICBsaW1pdDogMjUsIFxuICAgICAgICAgICAga2V5X3R5cGU6IFwiaTY0XCIsIFxuICAgICAgICAgICAgaW5kZXhfcG9zaXRpb246IFwiMVwiXG4gICAgICAgIH0sIHBhcmFtcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhdHRlci5nZXRUYWJsZVJvd3MoXG4gICAgICAgICAgICBfcC5jb250cmFjdCxcbiAgICAgICAgICAgIF9wLnNjb3BlLCB0YWJsZSxcbiAgICAgICAgICAgIF9wLnRhYmxlX2tleSxcbiAgICAgICAgICAgIF9wLmxvd2VyX2JvdW5kLFxuICAgICAgICAgICAgX3AudXBwZXJfYm91bmQsXG4gICAgICAgICAgICBfcC5saW1pdCxcbiAgICAgICAgICAgIF9wLmtleV90eXBlLFxuICAgICAgICAgICAgX3AuaW5kZXhfcG9zaXRpb25cbiAgICAgICAgKTtcbiAgICB9ICAgIFxuICAgIFxufSJdfQ==