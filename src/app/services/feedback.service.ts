export interface Feed {
    msg?:string;
    msgtype?:string;
    loading?:boolean;
}

export class Feedback {
    public keys: string[];
    private scopes: {[key:string]:Feed};

    constructor(keys:string[] = []) {
        this.keys = keys;
        this.scopes = {};
    }

    private updateScopes() {
        for (var i in this.keys) {
            this.scopes[this.keys[i]] = this.scopes[this.keys[i]] || {
                loading: false
            }
        }
    }

    private addKey(key:string) {
        this.keys.push(key);
        this.updateScopes();
    }

    setLoading(key:string, value:boolean) {
        if (this.scopes[key]) {
            this.scopes[key].loading = value;
        } else {
            this.addKey(key);
            this.setLoading(key, value);
        }
    }

    loading(key:string) {
        if (this.scopes[key]) {
            return this.scopes[key].loading;
        }
        return false;
    }

    setError(key:string, err: string = "") {
        if (this.scopes[key]) {
            this.scopes[key].msg = err;
            this.scopes[key].msgtype = "error";
        } else {
            this.addKey(key);
            this.setError(key, err);
        }
    }

    clearError(key:string) {
        this.setError(key, "");
    }


    error(key:string) {
        if (this.scopes[key]) {
            return this.scopes[key].msg;
        }
        return "";
    }

    setMessage(key:string, msg: string, msgtype: string) {
        if (this.scopes[key]) {
            this.scopes[key].msg = msg;
            this.scopes[key].msgtype = msgtype;
        } else {
            this.addKey(key);
            this.setMessage(key, msg, msgtype);
        }
    }    

    message(key:string) {
        return this.error(key);
    }

    msgType(key:string) {
        if (this.scopes[key]) {
            return this.scopes[key].msgtype;
        } else {
            // console.error("ERROR", key, [this.scopes]);
        }
        return "";
    }

}