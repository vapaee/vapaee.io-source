import { Component, Input, OnChanges, OnDestroy, ElementRef, Renderer } from '@angular/core';
import { VapaeeDEX } from 'projects/vapaee/dex/src/lib/dex.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { GoogleChartInterface, GoogleChartComponentInterface } from 'src/app/components/vpe-panel-chart/google-chart-service/google-charts-interfaces';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';



// https://www.devrandom.it/software/ng2-google-charts/
// import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';




@Component({
    selector: 'vpe-panel-chart',
    templateUrl: './vpe-panel-chart.component.html',
    styleUrls: ['./vpe-panel-chart.component.scss']
})
export class VpePanelChartComponent implements OnChanges, OnDestroy {

    @Input() data:any[];
    
    closed:boolean;
    component:GoogleChartComponentInterface;
    zoom_min: number = 5;
    bgStyle: any;
    limit: number;

    @Input() public height: number;
    @Input() public zoom: number;
    @Input() public hideheader: boolean;
    @Input() public margintop: boolean;
    @Input() public expanded: boolean;


    // @ViewContainerRef('vpe-panel-chart', {read: ElementRef}) elref: ElementRef;

    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        private _element:ElementRef,
        private renderer:Renderer,
        private service: VpeComponentsService
    ) {
        this.zoom = 24*30; // one month of chart
        this.closed = false;
        this.hideheader = false;
        this.margintop = true;
        this.expanded = true; 
        this.bgStyle = {"height": this.height + "px"};
        if (this.service.device.width >= 1200) {
            this.height = 298;
            this.limit = 1024;
        } else {
            this.height = 295;
            if (this.service.device.width >= 700) {
                this.limit = 512;
            } else {
                this.limit = 256;
            }
        }        
    }
    
    public _chartData:GoogleChartInterface;
    
    // counter = 0;
    get chartData(): GoogleChartInterface {
        return this._chartData;
    }

    onResize(event:ResizeEvent) {
        this.closed = false;
        if (this.service.device.width >= 1200) {
            this.height = 298;
            this.limit = 1024;
        } else {
            this.height = 295;
            if (this.service.device.width >= 700) {
                this.limit = 512;
            } else {
                this.limit = 256;
            }
        }
        // console.log("event.width", event.width, "event.device.width",  event.device.width);
        var data = this.recreateDataTable();
        setTimeout(_ => {
            if (this._chartData && this._chartData.options && this._chartData.options.height != this.height) {
                this.ngOnChanges();
            } else {
                if (this.component) this.component.redraw(data, null);
            }
        }, 0);
        
        // console.log(this._element.nativeElement.offsetWidth);
        // console.log(this._element.nativeElement.offsetHeight);
    }  

    onClose(device) {
        if (this.component) this.component.destroy();
        this.closed = true;
        // console.log(this._element.nativeElement.offsetHeight);
    }  

    ready(event) {
        this.component = event.component;
        // console.assert(!!this.component, "ERROR: ", event);
    }

    error(event) {
        //console.log("error", event);
    }

    select(event) {
        //console.log("select", event);
    }

    mouseOver(event) {
        //console.log("mouseOver", event);
    }

    mouseOut(event) {
        //console.log("mouseOut", event);
    }

    
    level: number;
    private updateLevel() {
        var lev;
        var zoom = this.zoom;
        for (lev = 0; lev < this.data.length-1 &&zoom > this.limit; lev++) {
            zoom = Math.floor(zoom/2);
        }
        this.level = lev;
    }
    private getLevel() {
        this.updateLevel();
        return this.data[this.level];
    }    
    private recreateDataTable() {
        var level = this.getLevel();
        var data = [];
        var zoom = this.zoom;
        if (zoom > this.data[0].length) zoom = this.data[0].length;
        if (zoom < this.zoom_min) zoom = this.zoom_min;
        for (var i=0; i<this.level; i++) {
            zoom = Math.floor(zoom/2);
        }
        if (zoom > level.length) zoom = level.length;
        for (var i=0; i<zoom; i++) {
            data.push(level[level.length - zoom + i]);    
        }
        return data;
    }

    mouseWheel(event) {
        this.zoom -= Math.floor(event.delta * (this.zoom / 10));
        if (this.zoom > this.data[0].length) this.zoom = this.data[0].length;
        if (this.zoom < this.zoom_min) this.zoom = this.zoom_min;
        if (this.component) this.component.redraw(this.recreateDataTable(), null);
    }

    ngOnDestroy() {
        if (this.component) this.component.destroy();
    }

    timer;
    cache: any;
    ngOnChanges() {
        this.bgStyle = {"height": this.height + "px"};
        // if (this.data && this.data.length > 0) {
        
        this.cache = this.cache || {};
        if (this.data) {
            if (this.cache.data_length == this.data[0].length) {
                var last = this.data[0][this.data[0].length-1];
                var equals = true;
                for (var i in this.cache.last_block) {
                    if (this.cache.last_block[i] != last[i]) {
                        equals = false;
                        break;
                    }
                }
                if (this._chartData.options.height != this.height) {
                    equals = false;
                }
                if (equals) {
                    console.log("skip", [this.cache]);
                    return;    
                } 
            }
            this.cache.data_length =  this.data[0].length;
            this.cache.last_block =  this.data[0][this.data[0].length-1];    
        
            this._chartData = null;
            clearTimeout(this.timer);
            this.timer = setTimeout(_ => {
                /*
                if (this.data.length > 0 && this.data[0].length > 0 && this.data[0][0].length == 5 ){
                    this.prepareChartDataStyles();
                }
                */
                var data = this.recreateDataTable();
                var baseline = 0; 
                if (data.length > 0) {
                    baseline = data[data.length-1][3]
                    // console.log("--------------------------------------->", data[data.length-1], baseline);
                }
                
                this._chartData = {        
                    chartType: 'CandlestickChart',
                    dataTable: data,
                    opt_firstRowIsData: true,
                    // opt_onresize: true,
    
                    // https://developers.google.com/chart/interactive/docs/gallery/candlestickchart#data-format
                    options: {
                        legend:'none',
                        backgroundColor: "#0e1110",
                        candlestick: {
                            fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
                            risingColor: { strokeWidth: 0, fill: '#0f9d58' }   // green
                        },
                        colors: ["#444400"],
                        height: this.height,
                        bar: {
                            groupWidth: "80%"
                        },
                        hAxis: {
                            textStyle: {
                                color: "#AAA"
                            }
                        },
                        vAxis: {
                            gridlines: {
                                color: '#888',
                                // count: 10
                            },
                            minorGridlines: {
                                color: '#222',
                                // count: 10
                            },
                            textStyle: {
                                color: "white"
                            },
                            baseline: baseline,
                            baselineColor: "#dddd00",
                            // format: "#,### TLOS",
                            title: 'Price',
                            titleTextStyle: {
                                color: 'white'
                            }
                        }
                        
                    }
                }
            }, 20);
        }
    }
}
