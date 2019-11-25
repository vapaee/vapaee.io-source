export interface Feed {
    msg?:string;
    msgtype?:string;
    loading?:boolean;
    start?:Date;
    marks?:{
        label:string,
        sec:number,
        millisec:number
    }[]
}

export interface FeedMap {
    [key:string]:Feed
};

export class Feedback {
    public keys: string[];
    private scopes: FeedMap;

    constructor() {
        this.keys = []
        this.scopes = {};
    }

    static create(keys:string[] = []) {
        let feed = new Feedback();
        feed.keys = keys;
        return feed;
    }

    private updateScopes() {
        for (let i in this.keys) {
            this.scopes[this.keys[i]] = this.scopes[this.keys[i]] || {}
        }
    }

    private addKey(key:string) {
        this.keys.push(key);
        this.updateScopes();
    }

    startChrono(key:string) {
        if (this.scopes[key]) {
            this.scopes[key].start = new Date();
            this.scopes[key].marks = [];
        } else {
            this.addKey(key);
            this.startChrono(key);
        }
    }

    setMarck(key:string, label:string) {
        if (this.scopes[key]) {
            let elapsedTime:Date = new Date();
            let millisec = elapsedTime.getTime() - this.scopes[key].start.getTime();
            let sec = millisec / 1000;
            this.scopes[key].marks.push({ label, sec, millisec });
        } else {
            console.error("ERROR: key not present", key, this.scopes);
        }        
    }

    printChrono(key:string, lastMark:boolean = true) {
        if (this.scopes[key]) {
            console.log("Chronometer marks for ", key);
            this.setMarck(key, "total");
            for (let i in this.scopes[key].marks) {
                console.log("- ",this.scopes[key].marks[i]);
            }
        } else {
            console.error("ERROR: key not present", key, this.scopes);
        }        
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

    clearErrors() {
        for (let key in this.scopes) {
            if (this.scopes[key].msgtype == "error") {
                this.clearError(key);
            }
        }
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