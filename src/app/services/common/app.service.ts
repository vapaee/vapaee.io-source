import { Injectable, Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Routes, Route } from '@angular/router';
import { AnalyticsService } from './analytics.service';
import { DomService } from './dom.service';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';

export interface Device {
    fullhd: boolean, // >= 1600px
    full: boolean,   // >= 1200px
    big: boolean,    // < 1200px
    normal: boolean, // < 992px
    medium: boolean, // < 768px
    small: boolean,  // < 576px
    tiny: boolean,   // < 420px
    portrait: boolean,
    wide: boolean,
    height: number,
    width: number,
    class: string
}

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public path: string = "";
    public onStateChange:Subject<string> = new Subject();
    public onWindowResize:Subject<Device> = new Subject();
    public onGlobalEvent:Subject<any> = new Subject();
    // router : Router;
    // route : ActivatedRoute;
    private global: {[key:string]:any} = {};
    state : string = "";
    prev_state : string = "none";
    node: Route | null = null;
    
    // empty device object
    device: Device = {
        fullhd: false,
        full: false,
        big: false,
        normal: false,
        medium: false,
        small: false,
        tiny: false,
        portrait: false,
        wide: false,
        height: 0,
        width: 0,
        class: ""
    }

    loading: boolean = false;
    countdown: number = 0;
    private _verison: string = "";
    private _name:string = "";
    _routes: Routes = [];
    
    
    getNodeForUrl(url:string, nodes: Routes = this._routes): Route {
        console.log("AppService.getNodeForUrl()", url, nodes.length);
        
        // take off the first character if it is "/"
        if (url[0] == "/") url = url.substring(1);

        let parts:string[] = url.split("/");
        let node:Route = nodes[0];

        for (let i=0; i<nodes.length; i++) {
            if (!nodes[i]) continue;
            let path = nodes[i].path;
            if (typeof path != "string") continue;
            let new_parts = path.split("/");
            if (new_parts.length == 0) continue;
            console.log( new_parts[0], parts[0]);

            if (path == "**") {
                node = nodes[i]; break;
            }

            if (new_parts[0] === parts[0]) {
                node = nodes[i]; break;
            }
        }

        if (node.children) {
            node = this.getNodeForUrl(url.substring(parts[0].length+1), node.children);
        }

        console.log("AppService.getNodeForUrl()", url, nodes.length, "------>", node.data? node.data.state : "no-data");

        return node;
    }

    handleUrlChange(url:string) {
        this.prev_state = this.state || "loading";
        this.path = url;
        this.node = this.getNodeForUrl(url);
        this.state = this.node ? (this.node.data ? this.node.data.state : "") : "";
        try {
            console.log("AppService.state: ", this.state);
            this.analytics.sendPageView(window.location.href);
            this.onStateChange.next(this.state);
            if (this.state != this.prev_state) {
                window.document.body.classList.remove(this.prev_state);
                window.document.body.classList.add(this.state);
            }
        } catch(e) {
            console.error("error:", e);
        }        
    }

    constructor(
        private router: Router, 
        private route: ActivatedRoute, 
        private analytics: AnalyticsService,
        private dom: DomService,
        public cookie: CookieService,
        private location: Location
    ) {

        this.router.events.pipe(filter(event=>event instanceof NavigationEnd)).subscribe(event=>{
            let url = (event as NavigationEnd).url;
            
            if (event instanceof NavigationEnd) {
                this.handleUrlChange(url);
            }
            
        });
        /*
        this.router.events.subscribe((event) => {

            console.error(" --- this.router.events.subscribe", event, "-----");

            if (event instanceof NavigationEnd) {
                this.prev_state = this.state;
                this.path = (event as NavigationEnd).url;
                this.state = this.getDeepestChild(this.route.root).snapshot.data.state;
                console.error(" ----> AppService. onRoute()", this.state, [this]);
                this.analytics.sendPageView(window.location.href);
                this.onStateChange.next(this.state);
                if (this.state != this.prev_state) {
                    window.document.body.classList.remove(this.prev_state);
                    window.document.body.classList.add(this.state);
                }
            }
        });
        */
        window.document.body.removeAttribute("loading");
        // console.error('window.document.body.removeAttribute("loading");');
    }

    get version() {
        return this._verison;
    }

    get name() {
        return this._name;
    }

    isOpera:   boolean = false;
    isFirefox: boolean = false;
    isSafari:  boolean = false;
    isIE:      boolean = false;
    isEdge:    boolean = false;
    isChrome:  boolean = false;
    isBlink:   boolean = false;

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

    private triggerOnInit: () => void = ()=>{};
    public onInit: Promise<void> = new Promise((resolve) => {
        this.triggerOnInit = resolve;
    });

    // sidemenu -----------------
    public sidemenu: {opened:boolean, skip:boolean} = {opened:false, skip:false};
    private skipSideMenu() {
        var skip = this.sidemenu.skip;
        this.sidemenu.skip = true;
        setTimeout(() => { this.sidemenu.skip = false; }, 500);
        return skip;
    }
    toggleSideMenu() {
        if (this.skipSideMenu()) return;
        this.sidemenu.opened = !this.sidemenu.opened;
        console.log("toggleSideMenu()", this.sidemenu.opened);
    }
    openSideMenu() {
        if (this.skipSideMenu()) return;
        this.sidemenu.opened = true;
    }
    closeSideMenu() {
        if (this.skipSideMenu()) return;
        this.sidemenu.opened = false;
    }

    // global variables ---------
    getGlobal(key: string, defautl:any = undefined): any {
        // if (!this.global) this.global = {};
        if (!this.global[key]) {
            var cached = this.cookie.get(key);
            if (cached) {
                this.global[key] = cached;
                return cached;
            } else {
                return defautl;
            }
        }
        return this.global[key];
    }

    setGlobal(key:string, value:any, persist:boolean = false) {
        // if (!this.global) this.global = {};
        this.global[key] = value;
        if (persist) {
            this.cookie.set(key, value);
        }
    }

    toggleGlobal(key:string) {
        // if (!this.global) this.global = {};
        this.global[key] = !this.global[key];
    }

    consumeGlobal(key:string) {
        // if (!this.global) this.global = {};
        let aux = this.global[key];
        delete this.global[key];
        return aux;
    }
    
    init(version:string, name:string, routes: Routes) {
        this._verison = version;
        this._name = name;
        this._routes = routes;
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
        this.device.fullhd  = false;
        this.device.full    = false;
        this.device.big     = false;
        this.device.normal  = false;
        this.device.medium  = false;
        this.device.small   = false;
        this.device.tiny    = false;
        this.device.height  = window.innerHeight;
        this.device.width   = window.innerWidth;
        this.device.class   = "";
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
        let words = this.path.split("/");
        for (var i in words){
            if (words[i])  {
                words[i] = prefix;
                break;
            }
        }
        let path: string = words.join("/");
        this.navigate(path);
    }

    navigate(path: string) {
        
        if (path.indexOf("/") == 0) path = path.substring(1);
        
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';

        if (path != this.path) {
            // if (path.indexOf("/") == -1) {
            //     console.log("AppService.navigate() -> ", [path]);
            //     this.router.navigate([path]);
            // } else {
            // }
            console.log("AppService.navigate() -> ", path.split("/"));
            this.router.navigate(path.split("/"));
        } else {
            console.error("AppService.navigate() -> ", path.split("/"), "path repetido");
            this.router.navigate(path.split("/"));
        }

        return path;
    }

    go(path: string) {
        if (path.indexOf("/") == 0) path = path.substring(1);
        
        if (path != this.path) {
            this.location.go(path);
        } else {
            console.error("AppService.go() -> ", path, "path repetido");
            this.location.go(path);
        }
        
        this.handleUrlChange(path);
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
        let _name:string = name || this.getDeepestChild(this.route.root).snapshot.data.state || "guest";
        var data = this.getRouteData(_name, this.router.config);
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