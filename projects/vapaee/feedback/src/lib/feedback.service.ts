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


export interface Mark {
    label:string,
    sec:number,
    millisec:number
}

export interface Chrono {
    start:Date;
    marks:Mark[]
}

export interface BooleanMap {
    [key:string]:boolean
};

export interface StringMap {
    [key:string]:string
};

export interface ChronoMap {
    [key:string]:Chrono
};

export class Feedback {
    public loadings:BooleanMap;
    public errors:StringMap;
    public chrono:ChronoMap;

    constructor() {}

    startChrono(key:string) {
        this.chrono = this.chrono || {};
        this.chrono[key] = {
            start: new Date(), marks:[]
        };
    }

    setMarck(key:string, label:string) {
        this.chrono = this.chrono || {};
        if (this.chrono[key]) {
            let elapsedTime:Date = new Date();
            let millisec = elapsedTime.getTime() - this.chrono[key].start.getTime();
            let sec = millisec / 1000;
            this.chrono[key].marks.push({ label, sec, millisec });
        } else {
            console.error("ERROR: key not present", key, this.chrono);
        }        
    }

    printChrono(key:string, lastMark:boolean = true) {
        this.chrono = this.chrono || {};
        if (this.chrono[key]) {
            console.log("Chronometer marks for ", key);
            this.setMarck(key, "total");
            for (let i in this.chrono[key].marks) {
                console.log("- ",this.chrono[key].marks[i]);
            }
        } else {
            console.error("ERROR: key not present", key, this.chrono);
        }        
    }

    setLoading(key:string, value:boolean = true) {
        this.loadings = this.loadings || {};
        if (value) {
            this.loadings[key] = value;
        } else {
            /*
            this.loadings[key] = false;
            /*/
            delete this.loadings[key];
            //*/
        }        
    }

    loading(key: string) {
        if (!this.loadings) return false;
        return !!this.loadings[key];
    }

    error(key: string) {
        if (!this.errors) return null;
        return this.errors[key];
    }

    setError(key:string, err: string = "") {
        this.errors = this.errors || {};
        this.errors[key] = err;
    }

    clearError(key:string) {
        this.setError(key, "");
    }

    clearErrors() {
        this.errors = {};
    }
    
}