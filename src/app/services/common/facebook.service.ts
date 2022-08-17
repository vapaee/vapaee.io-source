import { Injectable } from '@angular/core';

declare var fbq: Function;
declare var fb_id: string;

@Injectable()
export class FacebookService {
    
    waitReady: Promise<void> = Promise.reject();
    constructor() {
        console.log("Facebook()");
        this.init();
    }   

    init(local:string|null = null) {
        this.waitReady = new Promise<void>((resolve)=> {
            var userLang = local || (<any>navigator).language || (<any>navigator).userLanguage; 
            (function(d, s, id) {
                var js:any, fjs:Element | null = d.getElementsByTagName(s)[0];
                if (!fjs) return;
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/"+userLang+"/sdk.js#xfbml=1&version=v2.5&appId="+fb_id;
                if(fjs.parentNode) {
                    fjs.parentNode.insertBefore(js, fjs);
                } else {
                    throw new Error("Facebook: fjs.parentNode is null");
                }
                
            }(document, 'script', 'facebook-jssdk'));
        
            (function(_f:any,b:any,e:any,v:any,n:any=null,t:any=null,s:any=null)
            {var f:any=<any>_f;if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)})(window, document,'script',
            'https://connect.facebook.net/'+userLang+'/fbevents.js');
            fbq('init', fb_id);
            fbq('track', 'PageView');
            resolve();
        });        
    }    
    
}
