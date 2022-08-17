import { Injectable } from '@angular/core';

declare var ga:Function;
declare var ga_id:string;

@Injectable()
export class AnalyticsService {
    pageviewTimer: number | null = null;
    waitReady: Promise<any>;
    active:boolean = false;
    constructor() {
        if (typeof ga_id == "string") {
            console.debug("Analytics() active");
            this.active = true;
            this.waitReady = new Promise((resolve)=> {

                (function(i:any,s:any,o:any,g:any,r:any,a:any=null,m:any=null){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new (<any>i).Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                }) (
                    window,
                    document,
                    'script',
                    '//www.google-analytics.com/analytics.js',
                    'ga'
                );
                ga('create', ga_id, 'auto');
                var interval = 0;
                window.setTimeout(() => {
                    if (typeof ga === 'function') {
                        resolve(ga);
                    } else {
                        console.error("ERROR: AnalyticsService() ga not found");
                    }    
                    window.clearInterval(interval);
                }, 10000);
                interval = window.setInterval(() => {
                    if (typeof ga === 'function') {
                        resolve(ga);
                        window.clearInterval(interval);
                    } else {
                        console.debug("Analytics() not ga found");
                    }               
                }, 250);
            });
        } else {
            console.debug("Analytics() off - ga_id not found");
            this.waitReady = new Promise(_ => {});
        }
    }
    
    setUserId(id:string) {
        if (this.active) {
            this.waitReady.then(ga => {
                console.debug("Analytics::UserId --> ", id);
                ga('set', 'userId', id);
            });    
        }
    }

    sendPageView(url:string) {
        if (this.active) {
            this.waitReady.then(ga => {
                if (this.pageviewTimer) {
                    window.clearTimeout(this.pageviewTimer);
                    this.pageviewTimer = 0;
                };
        
                this.pageviewTimer = window.setTimeout(() => {
                    console.debug("Analytics::Pageview --> ", url);
                    ga('set', 'page', url);
                    ga('send', 'pageview');
                }, 1000);    
            });
        }
    }

    public emitEvent(
        category: string,
        action: string,
        label: string | null = null,
        value: number | null = null
    ) {
        if (this.active) {
            this.waitReady.then(ga => {
                console.debug("Analytics::Event --> ", category, action, label, value);
                ga('send', 'event', category, action, label, value); 
            });
        }
    }
    
}
