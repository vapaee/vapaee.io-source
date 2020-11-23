

export class Token {
    private _str?: string;
    protected _symbol: string;
    protected _precision?: number;
    protected _contract?: string;

    constructor(obj:any = null) {
        this._symbol = "AUX";
        this._precision = 0;
        this._contract = null;
    
        if (typeof obj == "string") {
            this._symbol = obj;
            console.assert(this.symbol.length > 0, "ERROR: symbol not valid for token: ", this._symbol);
            console.assert(this.symbol.length < 9, "ERROR: symbol not valid for token: ", this._symbol);
        }
        
        if (obj) {
            if (obj instanceof Token) {
                this._symbol = obj._symbol;
                this._precision = obj._precision;
                this._contract = obj._contract;
            } else if (typeof obj == "object") {
                this._symbol = obj.symbol || this._symbol;
                this._precision = obj.precision || this._precision;
                this._contract = obj.contract || this._contract;
            }
        }

        this.toString();
    }

    get symbol() { return this._symbol; }
    get precision() { return this._precision; }
    get contract() { return this._contract; }

    get str() {
        if (this._str) return this._str;
        this._str = this.symbol;
        if (this._precision != null || this._contract != null) {
            if (this._precision && this._contract) {
                this._str += " (" + this._precision + ", " + this._contract + ")";
            } else {
                if (this._precision) {
                    this._str += " (" + this._precision + ")";
                }
                if (this._contract) {
                    this._str += " (" + this._contract + ")";
                }  
            }
        }
        return this._str;
    }

    clear() {
        delete this._str;
    }

    toString() {
        return this.str;
    }

    basecopy(): Token {
        var cp = new Token(this);
        cp._symbol = this._symbol;
        cp._precision = this._precision;
        cp._contract = this._contract;
        cp.clear();
        cp.toString();
        return cp;
    }

}