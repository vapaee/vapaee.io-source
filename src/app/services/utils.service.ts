import BigNumber from "bignumber.js";
// import Eos from 'eosjs';
import { Scatter, ScatterService } from "./scatter.service";
import { Serialize } from "eosjs";

// vapaee exchange -------------------


export interface Token {
    symbol: string,
    precision?: number,
    contract?: string,
    appname?: string,
    website?: string,
    logo?: string,
    logolg?: string,
    verified?: boolean,
    fake?: boolean,
    fiat?: boolean,
    scope?: string,
    stat?: {
        supply: string,
        max_supply: string,
        issuer?: string,
        owner?: string,
        issuers?: string[]
    }
}

// -------------------

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

export interface SlugId {
    low?: string;
    str?: string;
    top?: string;
}
export interface Work {
    items: any[];
    containers: any[];
}
export interface Profile {
    id?:string;
    slugid: SlugId;
    account: string;
    containers?: any[],
    work?: Work;
}

export class Utils {
    contract: string;
    scatter: ScatterService;
    code_0:number;
    code_1:number;
    code_4:number;
    code_9:number;
    code_a:number;
    code_f:number;
    code_z:number;
    
    constructor(contract: string, scatter: ScatterService) {
        this.contract = contract;
        this.scatter = scatter;
        this.code_0 = "0".charCodeAt(0);
        this.code_1 = "1".charCodeAt(0);
        this.code_4 = "4".charCodeAt(0);
        this.code_9 = "9".charCodeAt(0);
        this.code_a = "a".charCodeAt(0);
        this.code_f = "f".charCodeAt(0);        
        this.code_z = "z".charCodeAt(0);        
    }    

    decodeNibble(nib:number) {
        var nibble = [0,0,0,0];
        var value = 0;
        if (this.code_0 <= nib && nib <= this.code_9) {
            value = nib - this.code_0;
        } else if (this.code_a <= nib && nib <= this.code_f) {
            value = nib - this.code_a + 10;
        }
        nibble[0] = (value & 8) > 0 ? 1 : 0;
        nibble[1] = (value & 4) > 0 ? 1 : 0;
        nibble[2] = (value & 2) > 0 ? 1 : 0;
        nibble[3] = (value & 1) > 0 ? 1 : 0;
        return nibble;
    }

    encodeNibble(index:number, bits:number[]) {
        var value = 0;
        value += bits[index + 0] == 1 ? 8 : 0;
        value += bits[index + 1] == 1 ? 4 : 0;
        value += bits[index + 2] == 1 ? 2 : 0;
        value += bits[index + 3] == 1 ? 1 : 0;
        if (0 <= value && value <= 9) {
            return "" + value;
        }
        switch(value) {
            case 10: return "a";
            case 11: return "b";
            case 12: return "c";
            case 13: return "d";
            case 14: return "e";
            case 15: return "f";
        }
        return "?";
    }

    decodeUint64(_num: string) {
        var bits:number[] = [];
        var num:string = _num.substr(2);
        for (var i=0; i<num.length; i++) {
            bits = bits.concat(this.decodeNibble(num.charCodeAt(i)));
        }
        return bits;
    }

    encodeUnit64(bits:number[]) {
        var slugid:SlugId = {top:"0x",low:"0x"};
        var str = "top";
        for (var i=0; i<bits.length; i+=4) {
            if (i>=128) str = "low";
            slugid[str] += this.encodeNibble(i, bits);
        }
        return slugid;
    }

    extractLength(bits:number[]) {
        if(bits.length != 256) console.error("ERROR: extractLength(bits) bits must be an array of 256 bits");
        return bits[250] * 32 + bits[251] * 16 + bits[252] * 8 + bits[253] * 4 + bits[254] * 2 + bits[255] * 1;
    }

    insertLength(bits:number[], length: number) {
        if(bits.length != 256) console.error("ERROR: extractLength(bits) bits must be an array of 256 bits");
        bits[250] = (length & 32) ? 1 : 0;
        bits[251] = (length & 16) ? 1 : 0;
        bits[252] = (length &  8) ? 1 : 0;
        bits[253] = (length &  4) ? 1 : 0;
        bits[254] = (length &  2) ? 1 : 0;
        bits[255] = (length &  1) ? 1 : 0;
    }

    valueToChar(v:number) {
        if (v == 0) return '.';
        if (v == 1) return '-';
        if (v < 6) return String.fromCharCode(v + this.code_0 - 1);
        if (v < 32) return String.fromCharCode(v + this.code_a - 6);
        console.assert(false, "ERROR: value out of range [0-31]", v);
        return '?';                   
    }

    charToValue(c:string) {
        console.assert(c.length == 1, "ERROR: c MUST be a character (string with length == 1). Got", typeof c, c);
        if (c == ".") return 0;
        if (c == "-") return 1;
        if (this.code_0 < c.charCodeAt(0) && c.charCodeAt(0) <= this.code_4) return c.charCodeAt(0) - this.code_1 + 2;
        if (this.code_a <= c.charCodeAt(0) && c.charCodeAt(0) <= this.code_z) return c.charCodeAt(0) - this.code_a + 6;
        console.assert(false, "ERROR: character '" + c + "' is not in allowed character set for slugid ");
        return -1;
    }

    extractChar(c:number, bits:number[]) {
        var encode = 5;
        var pot = Math.pow(2, encode-1); // 16
        var value = 0;
        var index = c * encode;
        for (var i=0; i<encode; i++, pot = pot/2) {
            value += bits[index + i] * pot;
        }
        var char = this.valueToChar(value);
        return char;
    }

    insertChar(value:number, j:number, bits:number[]) {
        var encode = 5;
        var index = j * encode;
        bits[index + 0] = (value & 16) > 0 ? 1 : 0;
        bits[index + 1] = (value &  8) > 0 ? 1 : 0;
        bits[index + 2] = (value &  4) > 0 ? 1 : 0;
        bits[index + 3] = (value &  2) > 0 ? 1 : 0;            
        bits[index + 4] = (value &  1) > 0 ? 1 : 0;
    }

    decodeSlug(sluig:SlugId) {
        // decodeSlug() 0x41ae9c04d34873482a78000000000000 0x00000000000000000000000000000010
        // console.log("decodeSlug()", nick.top, nick.low);
        var bits:number[] = [];
        bits = this.decodeUint64(sluig.top).concat(this.decodeUint64(sluig.low));
        var length = bits[250] * 32 + bits[251] * 16 + bits[252] * 8 + bits[253] * 4 + bits[254] * 2 + bits[255] * 1;
        // console.log("length: ", length);
        var str:string = "";
        for (var i=0; i<length; i++) {
            str += this.extractChar(i, bits);
        }
        // console.log("str: ", str);
        sluig.str = str;
        return sluig;
    }

    encodeSlug(name:string):SlugId {
        var bits = [];
        for (var i=0; i<256; i++) {
            bits.push(0);
        }
        for (var i=0; i<name.length; i++) {
            var value = this.charToValue(name[i]);
            this.insertChar(value, i, bits);
        }
        this.insertLength(bits, name.length);
        var slug = this.encodeUnit64(bits);

        slug = this.decodeSlug(slug);
        console.assert(slug.str == name, "ERROR: slug.str: ", slug.str, [slug.str], [name]);

        return slug;
    }

    slugTo128bits(slug:SlugId):string {
        var str = "0x";
        var topbits = this.decodeUint64(slug.top);
        var lowbits = this.decodeUint64(slug.low);
        var mixbits = [];
        for (var i=0; i<topbits.length; i++) {
            mixbits.push(topbits[i] ^ lowbits[i] ? 1 : 0);
        }
        for (var i=0; i<mixbits.length; i+=4) {
            str += this.encodeNibble(i, mixbits);
        }        
        return str;
    }

    encodeName(name:string):BigNumber {
        console.error("WARNING!!! esta nueva implementación nunca fue probada y no se si funciona", name);
        const buffer: Serialize.SerialBuffer = new Serialize.SerialBuffer();
        buffer.pushName(name);
        return new BigNumber(buffer.getUint64AsNumber());
    }

    // smart contract ---------------------
    excecute(action: string, params: any) {
        console.log("Utils.excecute()", action, [params]);
        return new Promise<any>((resolve, reject) => {
            try {
                this.scatter.executeTransaction(this.contract, action, params).then(result => {
                    resolve(result);
                }).catch(err => { console.error(err); reject(err); });
            } catch (err) { console.error(err); reject(err); }
        }); // .catch(err => console.error(err) );
    } 

    /*
    excecute(action: string, params: any) {
        console.log("Utils.excecute()", action, [params]);
        return new Promise<any>((resolve, reject) => {
            try {
                this.scatter.getContract(this.contract).then(contract => {
                    try {
console.log("*************************************************");
console.log("https://eosio.github.io/eosjs/guides/2.-Transaction-Examples.html");
console.log("*************************************************");
                        contract[action](params, this.scatter.authorization).then((response => {
                            console.log("Utils.excecute() ---> ", [response]);
                            resolve(response);
                        })).catch(err => { reject(err); });
                    } catch (err) { reject(err); }
                }).catch(err => { reject(err); });
            } catch (err) { reject(err); }
        }); // .catch(err => console.error(err) );
    }
    */

    getTable(table:string, params:TableParams = {}): Promise<TableResult> {

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
    }    
    
}