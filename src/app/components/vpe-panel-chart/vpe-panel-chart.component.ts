import { Component, Input, OnChanges, Output, OnInit, OnDestroy, ViewChild, ElementRef, ViewContainerRef, Renderer } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeService } from 'src/app/services/vapaee.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { GoogleChartInterface, GoogleChartComponentInterface } from 'src/app/components/vpe-panel-chart/google-chart-service/google-charts-interfaces';
import { GoogleChartComponent } from 'src/app/components/vpe-panel-chart/google-chart-service';
import { Subscriber } from 'rxjs';
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
    zomm_min: number = 5;
    bgStyle: any;

    @Input() public height: number;
    @Input() public zoom: number;
    @Input() public hideheader: boolean;
    @Input() public margintop: boolean;
    @Input() public expanded: boolean;


    // @ViewContainerRef('vpe-panel-chart', {read: ElementRef}) elref: ElementRef;

    constructor(
        public vapaee: VapaeeService,
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
        } else {
            this.height = 295;
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
        } else {
            this.height = 295;
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

    private recreateDataTable() {        
        var data = [];
        var zoom = this.zoom
        if (zoom > this.data.length) {
            zoom = this.data.length;
        }
        for (var i=0; i<zoom; i++) {
            data.push(this.data[this.data.length - zoom + i]);    
        }
        // console.log("********************* recreateDataTable()", data);
        return data;
    }

    private prepareChartDataStyles() {
        var current = "green";
        for (var i=0; i<this.data.length; i++) {
            var row = this.data[i];
            // console.log("--->", this.data[i]);
            if (row[2] > row[3]) {
                current = "red";
            } else if (row[2] < row[3]) {
                current = "green";
            }
            // this.data[i].push("color: blue");
        }        
    }

    mouseWheel(event) {
        //console.log("mouseWheel", event);
        this.zoom -= Math.floor(event.delta * (this.zoom / 10));
        if (this.zoom < this.zomm_min) this.zoom = this.zomm_min;
        if (this.zoom > this.data.length) this.zoom = this.data.length;
        // this.recreateChartData();
        //console.log(this._chartData);
        if (this.component) this.component.redraw(this.recreateDataTable(), null);
    }

    ngOnDestroy() {
        if (this.component) this.component.destroy();
    }

    timer;
    cache: any;
    ngOnChanges() {
        this.bgStyle = {"height": this.height + "px"};
        // console.log("********************* ngOnChanges()", [this.data, this._chartData.options.height]);
        // if (this.data && this.data.length > 0) {
        
        this.cache = this.cache || {};
        if (this.cache.data_length == this.data.length) {
            var last = this.data[this.data.length-1];
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

        this.cache.data_length =  this.data.length;
        this.cache.last_block =  this.data[this.data.length-1];

        if (this.data) {
            this._chartData = null;
            clearTimeout(this.timer);
            this.timer = setTimeout(_ => {
                if (this.data.length > 0 && this.data[0].length == 5 ){
                    this.prepareChartDataStyles();
                }
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
