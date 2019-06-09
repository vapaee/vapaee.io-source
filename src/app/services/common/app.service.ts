import { Injectable, Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AnalyticsService } from './analytics.service';
import { DomService } from './dom.service';
import { Subject } from 'rxjs';
import { Network } from '../scatter.service';

export interface Device {
    fullhd?:boolean, // >= 1600px
    full?:boolean,   // >= 1200px
    big?:boolean,    // < 1200px
    normal?:boolean, // < 992px
    medium?:boolean, // < 768px
    small?:boolean,  // < 576px
    tiny?:boolean,   // < 420px
    portrait?:boolean,
    wide?:boolean,
    height?:number,
    width?: number,
    class?: string
}

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public path: string;
    public onStateChange:Subject<string> = new Subject();
    public onWindowResize:Subject<Device> = new Subject();
    // router : Router;
    // route : ActivatedRoute;
    private global: {[key:string]:any};
    state : string;
    prev_state : string = "none";
    device: Device = {};
    loading: boolean;
    countdown: number;

    constructor(
        private router: Router, 
        private route: ActivatedRoute, 
        private analytics: AnalyticsService,
        private dom: DomService
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.prev_state = this.state;
                this.path = this.router.url;
                this.state = this.getDeepestChild(this.route.root).snapshot.data.state;
                console.log("AppService. onRoute()", [this]);
                this.analytics.sendPageView(window.location.href);
                this.onStateChange.next(this.state);
                window.document.body.classList.add(this.state);
                window.document.body.classList.remove(this.prev_state);
            }
        });
        window.document.body.removeAttribute("loading");
    }

    isOpera:boolean;
    isFirefox:boolean;
    isSafari:boolean;
    isIE:boolean;
    isEdge:boolean;
    isChrome:boolean;
    isBlink:boolean;

    detectBrowser() {
        var _window:any = <any>window;
        // Opera 8.0+
        this.isOpera = (!!_window.opr && !!_window.opr.addons) || !!_window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

        // Firefox 1.0+
        this.isFirefox = typeof _window.InstallTrigger !== 'undefined';

        // Safari 3.0+ "[object HTMLElementConstructor]" 
        this.isSafari = /constructor/i.test(_window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!_window['safari'] || _window.safari.pushNotification);

        // Internet Explorer 6-11
        this.isIE = /*@cc_on!@*/false || !!_window.document.documentMode;

        // Edge 20+
        this.isEdge = !_window.isIE && !!_window.StyleMedia;

        // Chrome 1+
        this.isChrome = !!_window.chrome && !!_window.chrome.webstore;

        // Blink engine detection
        this.isBlink = (this.isChrome || this.isOpera) && !!_window.CSS;

        console.log("isOpera", this.isOpera);
        console.log("isFirefox", this.isFirefox);
        console.log("isSafari", this.isSafari);
        console.log("isIE", this.isIE);
        console.log("isEdge", this.isEdge);
        console.log("isChrome", this.isChrome);
        console.log("isBlink", this.isBlink);
    }

    private triggerOnInit: Function;
    public onInit: Promise<any> = new Promise((resolve) => {
        this.triggerOnInit = resolve;
    });

    getGlobal(key): any {
        if (!this.global) return undefined;
        return this.global[key];
    }

    setGlobal(key:string, value:any) {
        if (!this.global) this.global = {};
        this.global[key] = value;
    }

    init() {
        this.detectBrowser();
        this.dom.appendComponentToBody(LoadingOverall);
        this.triggerOnInit();
    }

    getDeepestChild(node:any):any {
        if (node.firstChild) {
            return this.getDeepestChild(node.firstChild);
        } else {
            return node;
        }
    }

    onWindowsResize() {
        this.device.fullhd = false;
        this.device.full = false;
        this.device.big = false;
        this.device.normal = false;
        this.device.medium = false;
        this.device.small = false;
        this.device.tiny = false;
        this.device.height = window.innerHeight;
        this.device.width = window.innerWidth;
        this.device.class = "";
        var w = this.device.width;
        var h = this.device.height;

        if (w / h > 1) {
            this.device.portrait = false;
            this.device.wide = true;
            this.device.class += "wide ";

            if (1600 <= w) {
                this.device.fullhd = true;
                this.device.class += "fullhd ";
            }

            if (1200 <= w && w < 1600) {
                this.device.full = true;
                this.device.class += "full ";
            }

            if (992 <= w && w < 1200) {
                this.device.big = true;
                this.device.class += "big ";
            }

            if (768 <= w && w < 992) {
                this.device.normal = true;
                this.device.class += "normal ";
            }

            if (576 <= w && w < 768) {
                this.device.medium = true;
                this.device.class += "medium ";
            }

            if (420 <= w && w < 576) {
                this.device.small = true;
                this.device.class += "small ";
            }

            if (w < 420) {
                this.device.tiny = true;
                this.device.class += "tiny ";
            }

        } else {
            this.device.portrait = true;
            this.device.wide = false;
            this.device.class += "portrait ";
        }
        // console.log("onWindowsResize()", this.device);
        this.device.class = this.device.class.trim();
        this.onWindowResize.next(this.device);
    }

    navigatePrefix(prefix:string){
        var words = this.path.split("/");
        for (var i in words){
            if (words[i])  {
                words[i] = prefix;
                break;
            }
        }
        var path = words.join("/");
        this.navigate(path);
    }

    navigate(path) {
        if (path != this.path) {
            console.log("AppService.navigate()", path);
            this.router.navigate([path]);
        }
        return path;
    }

    onCardClose() {
        this.router.navigate(['cards']);
    }


    setLoading(turn:boolean = true) {
        this.loading = turn;
    }

    urlStartsWith (str: any) {
        if (typeof str == "number") str = "" + str;
        if (typeof str == "string") {
            return window.location.pathname.indexOf(str) == 0;
        } else {
            return false;
        }
    }
    
    urlEndsWith (str: any) {
        if (typeof str == "number") str = "" + str;                
        if (typeof str == "string") {
            var len = window.location.pathname.length;
            var substr = window.location.pathname.substr(len-str.length, str.length);
            return substr.indexOf(str) == 0;
        } else {
            return false;
        }
    }
    
    stateStartsWith (str: any) {
        if (!this.state) return false;
        if (typeof str == "number") str = "" + str;                
        if (typeof str == "string") {
            return this.state.indexOf(str) == 0;
        } else {
            return false;
        }
    }
    
    prevStateStartsWith (str: any) {
        if (!this.prev_state) return false;
        if (typeof str == "number") str = "" + str;                
        if (typeof str == "string") {
            return this.prev_state.indexOf(str) == 0;
        } else {
            return false;
        }
    }

    getStateData(name?:string) {
        name = name || this.getDeepestChild(this.route.root).snapshot.data.state;
        var data = this.getRouteData(name, this.router.config);
        return data;
    }

    getRouteData(name:string, obj:any[]) {
        var found:any = null;
        for (let i=0; !found && i<obj.length; i++) {
            if (obj[i].data.state === name) {
                found = obj[i].data;
            } else if (obj[i].children) {
                found = this.getRouteData(name, obj[i].children);
            }
        }
        return found;
    }
    
}

















@Component({
    selector: 'loading-overall',
    template: `
    <div [hidden]="!app.loading" class="animated fadeIn" id="loading-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); z-index: 10000; color: white;">
        <div style="text-align: center; width: 100%; position: absolute; top: 40%; margin-top: -50px;">
            <h1>Proccessing...</h1>
        </div>
    </div>`
})
export class LoadingOverall {
    constructor(public app:AppService) {}
}