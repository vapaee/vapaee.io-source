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
export class SmartContract {
    /**
     * @param {?=} contract
     * @param {?=} scatter
     */
    constructor(contract = "", scatter = null) {
        this.contract = contract;
        this.scatter = scatter;
    }
    /**
     * @param {?} action
     * @param {?} params
     * @return {?}
     */
    excecute(action, params) {
        console.log("Utils.excecute()", action, [params]);
        return new Promise((resolve, reject) => {
            try {
                this.scatter.getContractWrapper(this.contract).then(contract => {
                    try {
                        contract[action](params, this.scatter.authorization).then((response => {
                            console.log("Utils.excecute() ---> ", [response]);
                            resolve(response);
                        })).catch(err => { reject(err); });
                    }
                    catch (err) {
                        reject(err);
                    }
                }).catch(err => { reject(err); });
            }
            catch (err) {
                reject(err);
            }
        }); // .catch(err => console.error(err) );
    }
    /**
     * @param {?} table
     * @param {?=} params
     * @return {?}
     */
    getTable(table, params = {}) {
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
    }
}
if (false) {
    /** @type {?} */
    SmartContract.prototype.contract;
    /** @type {?} */
    SmartContract.prototype.scatter;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QuY2xhc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AdmFwYWVlL3NjYXR0ZXIvIiwic291cmNlcyI6WyJsaWIvY29udHJhY3QuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsTUFBTTs7Ozs7SUFJRixZQUFZLFdBQW1CLEVBQUUsRUFBRSxVQUF5QixJQUFJO1FBQzVELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0tBQzFCOzs7Ozs7SUFpQkQsUUFBUSxDQUFDLE1BQWMsRUFBRSxNQUFXO1FBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsSUFBSSxPQUFPLENBQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDeEMsSUFBSSxDQUFDO2dCQUNELElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDM0QsSUFBSSxDQUFDO3dCQUNELFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRTs0QkFDbEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7NEJBQ2xELE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzt5QkFDckIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUN0QztvQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQUU7aUJBQ2pDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDckM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7YUFBRTtTQUNqQyxDQUFDLENBQUM7S0FDTjs7Ozs7O0lBR0QsUUFBUSxDQUFDLEtBQVksRUFBRSxTQUFxQixFQUFFOztRQUUxQyxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ25CLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDcEIsU0FBUyxFQUFFLEdBQUc7WUFDZCxXQUFXLEVBQUUsR0FBRztZQUNoQixXQUFXLEVBQUUsSUFBSTtZQUNqQixLQUFLLEVBQUUsRUFBRTtZQUNULFFBQVEsRUFBRSxLQUFLO1lBQ2YsY0FBYyxFQUFFLEdBQUc7U0FDdEIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVYLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FDNUIsRUFBRSxDQUFDLFFBQVEsRUFDWCxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFDZixFQUFFLENBQUMsU0FBUyxFQUNaLEVBQUUsQ0FBQyxXQUFXLEVBQ2QsRUFBRSxDQUFDLFdBQVcsRUFDZCxFQUFFLENBQUMsS0FBSyxFQUNSLEVBQUUsQ0FBQyxRQUFRLEVBQ1gsRUFBRSxDQUFDLGNBQWMsQ0FDcEIsQ0FBQztLQUNMO0NBRUoiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWYXBhZWVTY2F0dGVyIH0gZnJvbSBcIi4vc2NhdHRlci5zZXJ2aWNlXCI7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGludGVyZmFjZSBUYWJsZVBhcmFtcyB7XG4gICAgY29udHJhY3Q/OnN0cmluZywgXG4gICAgc2NvcGU/OnN0cmluZywgXG4gICAgdGFibGVfa2V5PzpzdHJpbmcsIFxuICAgIGxvd2VyX2JvdW5kPzpzdHJpbmcsIFxuICAgIHVwcGVyX2JvdW5kPzpzdHJpbmcsIFxuICAgIGxpbWl0PzpudW1iZXIsIFxuICAgIGtleV90eXBlPzpzdHJpbmcsIFxuICAgIGluZGV4X3Bvc2l0aW9uPzpzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUYWJsZVJlc3VsdCB7XG4gICAgbW9yZTogYm9vbGVhbjtcbiAgICByb3dzOiBhbnlbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFNtYXJ0Q29udHJhY3Qge1xuICAgIGNvbnRyYWN0OiBzdHJpbmc7XG4gICAgc2NhdHRlcjogVmFwYWVlU2NhdHRlcjtcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcihjb250cmFjdDogc3RyaW5nID0gXCJcIiwgc2NhdHRlcjogVmFwYWVlU2NhdHRlciA9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb250cmFjdCA9IGNvbnRyYWN0O1xuICAgICAgICB0aGlzLnNjYXR0ZXIgPSBzY2F0dGVyO1xuICAgIH0gICAgXG4gICAgLypcbiAgICAvLyBlb3NqczJcbiAgICBleGNlY3V0ZShhY3Rpb246IHN0cmluZywgcGFyYW1zOiBhbnkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJVdGlscy5leGNlY3V0ZSgpXCIsIGFjdGlvbiwgW3BhcmFtc10pO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NhdHRlci5leGVjdXRlVHJhbnNhY3Rpb24odGhpcy5jb250cmFjdCwgYWN0aW9uLCBwYXJhbXMpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFUlJPUjogXCIsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7IGNvbnNvbGUuZXJyb3IoZXJyKTsgcmVqZWN0KGVycik7IH1cbiAgICAgICAgfSk7IC8vIC5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpICk7XG4gICAgfVxuICAgIC8qL1xuICAgIGV4Y2VjdXRlKGFjdGlvbjogc3RyaW5nLCBwYXJhbXM6IGFueSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlV0aWxzLmV4Y2VjdXRlKClcIiwgYWN0aW9uLCBbcGFyYW1zXSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2F0dGVyLmdldENvbnRyYWN0V3JhcHBlcih0aGlzLmNvbnRyYWN0KS50aGVuKGNvbnRyYWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0W2FjdGlvbl0ocGFyYW1zLCB0aGlzLnNjYXR0ZXIuYXV0aG9yaXphdGlvbikudGhlbigocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXRpbHMuZXhjZWN1dGUoKSAtLS0+IFwiLCBbcmVzcG9uc2VdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKS5jYXRjaChlcnIgPT4geyByZWplY3QoZXJyKTsgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikgeyByZWplY3QoZXJyKTsgfVxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7IHJlamVjdChlcnIpOyB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikgeyByZWplY3QoZXJyKTsgfVxuICAgICAgICB9KTsgLy8gLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKGVycikgKTtcbiAgICB9XG4gICAgLy8qL1xuXG4gICAgZ2V0VGFibGUodGFibGU6c3RyaW5nLCBwYXJhbXM6VGFibGVQYXJhbXMgPSB7fSk6IFByb21pc2U8VGFibGVSZXN1bHQ+IHtcblxuICAgICAgICB2YXIgX3AgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIGNvbnRyYWN0OiB0aGlzLmNvbnRyYWN0LCBcbiAgICAgICAgICAgIHNjb3BlOiB0aGlzLmNvbnRyYWN0LCBcbiAgICAgICAgICAgIHRhYmxlX2tleTogXCIwXCIsIFxuICAgICAgICAgICAgbG93ZXJfYm91bmQ6IFwiMFwiLCBcbiAgICAgICAgICAgIHVwcGVyX2JvdW5kOiBcIi0xXCIsIFxuICAgICAgICAgICAgbGltaXQ6IDI1LCBcbiAgICAgICAgICAgIGtleV90eXBlOiBcImk2NFwiLCBcbiAgICAgICAgICAgIGluZGV4X3Bvc2l0aW9uOiBcIjFcIlxuICAgICAgICB9LCBwYXJhbXMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnNjYXR0ZXIuZ2V0VGFibGVSb3dzKFxuICAgICAgICAgICAgX3AuY29udHJhY3QsXG4gICAgICAgICAgICBfcC5zY29wZSwgdGFibGUsXG4gICAgICAgICAgICBfcC50YWJsZV9rZXksXG4gICAgICAgICAgICBfcC5sb3dlcl9ib3VuZCxcbiAgICAgICAgICAgIF9wLnVwcGVyX2JvdW5kLFxuICAgICAgICAgICAgX3AubGltaXQsXG4gICAgICAgICAgICBfcC5rZXlfdHlwZSxcbiAgICAgICAgICAgIF9wLmluZGV4X3Bvc2l0aW9uXG4gICAgICAgICk7XG4gICAgfSAgICBcbiAgICBcbn0iXX0=