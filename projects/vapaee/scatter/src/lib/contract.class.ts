import { VapaeeScatter } from "./scatter.service";

// ------------------
export interface TableParams {
    contract?:string, 
    scope?:string, 
    table_key?:string, 
    lower_bound?:string, 
    upper_bound?:string, 
    limit?:number, 
    key_type?:string, 
    index_position?:string
}

export interface TableResult {
    more: boolean;
    rows: any[];
}

export class SmartContract {
    contract: string;
    scatter: VapaeeScatter;
    
    constructor(contract: string = "", scatter: VapaeeScatter = null) {
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
    excecute(action: string, params: any) {
        console.log("Utils.excecute()", action, [params]);
        return new Promise<any>((resolve, reject) => {
            try {
                this.scatter.getContractWrapper(this.contract).then(contract => {
                    try {
                        contract[action](params, this.scatter.authorization).then((response => {
                            console.log("Utils.excecute() ---> ", [response]);
                            resolve(response);
                        })).catch(err => { reject(err); });
                    } catch (err) { reject(err); }
                }).catch(err => { reject(err); });
            } catch (err) { reject(err); }
        }); // .catch(err => console.error(err) );
    }
    //*/

    getTable(table:string, params:TableParams = {}): Promise<TableResult> {

        return this.scatter.waitEosjs.then(async _ => {

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

            return this.scatter.getTableRows(
                _p.contract,
                _p.scope, table,
                _p.table_key,
                _p.lower_bound,
                _p.upper_bound,
                _p.limit,
                _p.key_type,
                _p.index_position
            );

        });

    }
    
    getTableAll(table:string, params:TableParams = {}): Promise<TableResult> {
        let rows = [];
        params.limit = params.limit || 200;
        let result:TableResult = { more:true, rows: [] };

        return this.scatter.waitEosjs.then(async _ => {
            while(result.more) {
                if (result.rows.length > 0) {
                    let symbol = result.rows[result.rows.length-1].symbol;
                    params.lower_bound = symbol;
                    rows.splice(rows.length-1, 1);
                }
                result = await this.getTable(table, params);
                rows = rows.concat(result.rows);
            }
    
            return {
                more: false,
                rows: rows
            };    
        });        
    }
    
}