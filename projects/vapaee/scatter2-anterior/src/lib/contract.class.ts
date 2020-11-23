import { EOSNetworkConnexion } from './eos-connexion.class';
import { VapaeeScatter2 } from "./scatter2.service";
import { TableParams, TableResult, Action, Transaction } from './types-scatter2';

// ------------------


export class SmartContract {

    
    constructor(
        public contract: string = "",
        public connexion: EOSNetworkConnexion = null
    ) {

    }    
    
    async excecute(action: string | Action | Transaction, payload: any = null) {
        console.log("SmartContract.excecute()", [action, payload]);
        if (
            typeof payload != null &&
            typeof action == "string"
        ) {
            // backward compatibility
            return this.executeAction({action, payload, contract: this.contract, blockchain: this.connexion.slug});
        }

        if (
            typeof (<Action>action).action == "string"
        ) {
            // backward compatibility
            return this.executeAction(<Action>action);
        }

        if (
            typeof (<Transaction>action).length == "number" &&
            (<Transaction>action).length > 0
        ) {
            // backward compatibility
            return this.executeTransaction(<Transaction>action);
        }

        throw "Contract.excecute() error: Unknown action type (" + typeof action + "): " + JSON.stringify(action);
    }

    private async executeAction(action: Action) {
        this.executeTransaction([action]);
    }

    private async executeTransaction(trx: Transaction) {
        for (let i=0; i<trx.length; i++) {
            trx[i].contract = this.contract;
        }
        return this.connexion.sendTransaction(trx);
    }


    

    getTable(table:string, params:TableParams = {}): Promise<TableResult> {

        // borro los campos que puedan estar en undefined
        for (let i in params) {
            if (typeof params[i] == "undefined") {
                delete params[i];
            }
        }

        /*/

        return this.scatter.waitEosjs.then(async _ => {

            var _p = Object.assign({
                contract: this.contract, 
                scope: this.contract,
                table: table, 
                table_key: "0", 
                lower_bound: "0", 
                upper_bound: "-1", 
                limit: 25, 
                key_type: "i64", 
                index_position: "1"
            }, params);

            return this.scatter.getTableRows(
                _p.contract,
                _p.scope,
                _p.table,
                _p.table_key,
                _p.lower_bound,
                _p.upper_bound,
                _p.limit,
                _p.key_type,
                _p.index_position
            );

        });
        /*/
        return null;
        //*/

    }
    
    getTableAll(table:string, params:TableParams = {}): Promise<TableResult> {
        let rows = [];
        params.limit = params.limit || 200;
        let result:TableResult = { more:true, rows: [] };

        // return this.scatter.waitEosjs.then(async _ => {
        //     while(result.more) {
        //         if (result.rows.length > 0) {
        //             let symbol = result.rows[result.rows.length-1].symbol;
        //             params.lower_bound = symbol;
        //             rows.splice(rows.length-1, 1);
        //         }
        //         result = await this.getTable(table, params);
        //         rows = rows.concat(result.rows);
        //     }
    // 
        //     return {
        //         more: false,
        //         rows: rows
        //     };    
        // }); 
        return null;       
    }
    
}