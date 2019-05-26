import { Injectable } from '@angular/core';

@Injectable()
export class EosioTokenMathService {
    
    constructor() {}

    add(num1: string, num2: string) {
        console.assert(typeof num1 == "string", "ERROR: EosioTokenMathService.add() num1 is not a string. got: ", typeof num1, num1);
        console.assert(typeof num2 == "string", "ERROR: EosioTokenMathService.add() num2 is not a string. got: ", typeof num2, num2);
        console.assert(num1.split(" ")[1] == num2.split(" ")[1],
            "ERROR: EosioTokenMathService.add() you can't add two values of different Token Simbol: "
            + num1.split(" ")[1] + " !== " + num2.split(" ")[1]);

        var symbol = num2.split(" ")[1];
        var v1 = Math.floor(parseFloat(num1.split(" ")[0]) * 10000);
        var v2 = Math.floor(parseFloat(num2.split(" ")[0]) * 10000);
        var t = v1+v2;
        var tt = t/10000;
        var str = tt + "";
        var i = str.indexOf(".");
        if (i==-1) {
            str += ".0000";
        } else {
            var digits = str.length-i-1;
            if (digits < 4) {
                str += "0".repeat(4-digits);
            }
        }
        return str + " " + symbol;
    }

    addAll(array:string[]) {
        // console.log("EOS-math.addAll()",array);
        var total = array[0];
        for (var i=1; i<array.length; i++) {
            total = this.add(total, array[i]);
        }
        return total;
    }
   
}
