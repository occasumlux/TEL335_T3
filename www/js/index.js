/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function target(hash) {
    window.location.hash = hash;
}

function assignOnSelect() {
    let radios = document.forms["the_form"].elements["option"];
    for(let i = 0, max = radios.length; i < max; i++) {
        radios[i].addEventListener("click", function(){target(radios[i].value);}, false);
        console.log(radios[i].value);
    }

}

function testDraw() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    context.beginPath();
    context.arc(95,50,40,0,2*Math.PI);
    context.stroke();
}

function getPolConstants() {
    let a = parseFloat(document.getElementById("poly_a").value);
    let b = parseFloat(document.getElementById("poly_b").value);
    let c = parseFloat(document.getElementById("poly_c").value);
    //console.log({a: a, b: b, c: c});
    return {a: a, b: b, c: c};
}

function getTrianConstants() {
    let a = parseFloat(document.getElementById("trian_a").value);
    let b = parseFloat(document.getElementById("trian_b").value);
    //console.log({a: a, b: b, c: c});
    return {a: a, b: b};
}

function solvePol() {
    let {a,b,c} = getPolConstants();
    let test = (a !== 0.0 && !isNaN(a) && !isNaN(b) && !isNaN(c));
    let x1 = null, x2 = null;
    if (test) {
        let discriminant = Math.pow(b, 2) - 4 * a * c;
        if (discriminant >= 0) {
            x2 = (-b + Math.sqrt(discriminant)) / 2 * a;
            x1 = (-b - Math.sqrt(discriminant)) / 2 * a;
        }
        else{
            x1 = NaN;
            x2 = NaN;
        }
    }
    document.getElementById("pol_result").innerHTML = "{x1: " + x1 + ", x2: " + x2 + "}";
    return {x1: x1, x2: x2};
}

function evaluatePol(x) {
    let {a,b,c} = getPolConstants();
    let test = (a !== 0.0 && !isNaN(a) && !isNaN(b) && !isNaN(c));
    let result = null;
    if (test){
        result = a*Math.pow(x,2) + b*x + c;
    }
    return result;
}

function setCoordinates(xScale, yScale) {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, width, height);
    context.setTransform(xScale, 0, 0, yScale, width/2, height/2);
    context.beginPath();
    context.lineWidth = -1 / yScale;
    console.log(context.lineWidth);
    context.moveTo(-width/2,0);
    context.strokeStyle = "blue";
    context.lineTo(width/2,0);
    context.stroke();
    context.beginPath();
    context.lineWidth = 1 / xScale;
    console.log(context.lineWidth);
    context.moveTo(0, height/2);
    context.lineTo(0, -height/2);
    context.stroke();
}

function drawOnCanvas() {
    let {x1,x2} = solvePol();
    if (x1 !== null) {
        let canvas = document.getElementById("canvas");
        let context = canvas.getContext("2d");
        let width = canvas.width;
        let height = canvas.height;
        setCoordinates(1, -1);
        console.log(x1);
        console.log(x2);
        console.log(canvas.width);
        context.beginPath();
        context.strokeStyle = "red";
        for (let x = -width / 2; x <= width / 2; x += 0.1) {
            context.lineTo(x, evaluatePol(x));
        }
        context.stroke();
    }
}

function solveTriangle() {
    let a = parseFloat(document.getElementById("trian_a").value);
    let b = parseFloat(document.getElementById("trian_b").value);
    let c = null;// = parseFloat(document.getElementById("trian_c").value);
    console.log(a);
    console.log(b);
    //console.log(c);
    let test = (a !== 0.0 && !isNaN(a) && b !== 0.0 && !isNaN(b));// && c !== 0.0 && !isNaN(c));
    if (test) {
        c = Math.pow(Math.pow(a,2) + Math.pow(b,2),0.5);
    }
    document.getElementById("trian_result").innerHTML = "{c: " + c + "}";
    return {c: c};
}

function drawOnCanvasTri() {
    let {a,b} = getTrianConstants();
    let {c} = solveTriangle();
    if (c !== null){
        let canvas = document.getElementById("canvas");
        let context = canvas.getContext("2d");
        setCoordinates(1, -1);
        context.beginPath();
        context.strokeStyle = "red";
        context.moveTo(-a/2,-b/2);
        context.lineTo(a/2,-b/2);
        context.lineTo(a/2,b/2);
        context.lineTo(-a/2,-b/2);
        context.stroke();

    }
}

let app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        assignOnSelect();
        document.getElementById("poly_bu").addEventListener("click", drawOnCanvas, false);
        document.getElementById("trian_bu").addEventListener("click", drawOnCanvasTri, false);
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        let parentElement = document.getElementById(id);
        let listeningElement = parentElement.querySelector('.listening');
        let receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();