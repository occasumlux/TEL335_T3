"use strict";

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
    var radios = document.forms["the_form"].elements["option"];

    var _loop = function _loop(i, max) {
        radios[i].addEventListener("click", function () {
            target(radios[i].value);
        }, false);
        console.log(radios[i].value);
    };

    for (var i = 0, max = radios.length; i < max; i++) {
        _loop(i, max);
    }
}

function testDraw() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.beginPath();
    context.arc(95, 50, 40, 0, 2 * Math.PI);
    context.stroke();
}

function getPolConstants() {
    var a = parseFloat(document.getElementById("poly_a").value);
    var b = parseFloat(document.getElementById("poly_b").value);
    var c = parseFloat(document.getElementById("poly_c").value);
    //console.log({a: a, b: b, c: c});
    return { a: a, b: b, c: c };
}

function getTrianConstants() {
    var a = parseFloat(document.getElementById("trian_a").value);
    var b = parseFloat(document.getElementById("trian_b").value);
    //console.log({a: a, b: b, c: c});
    return { a: a, b: b };
}

function solvePol() {
    var _getPolConstants = getPolConstants(),
        a = _getPolConstants.a,
        b = _getPolConstants.b,
        c = _getPolConstants.c;

    var test = a !== 0.0 && !isNaN(a) && !isNaN(b) && !isNaN(c);
    var x1 = null,
        x2 = null;
    if (test) {
        var discriminant = Math.pow(b, 2) - 4 * a * c;
        if (discriminant >= 0) {
            x2 = (-b + Math.sqrt(discriminant)) / 2 * a;
            x1 = (-b - Math.sqrt(discriminant)) / 2 * a;
        } else {
            x1 = NaN;
            x2 = NaN;
        }
    }
    document.getElementById("pol_result").innerHTML = "{x1: " + x1 + ", x2: " + x2 + "}";
    return { x1: x1, x2: x2 };
}

function evaluatePol(x) {
    var _getPolConstants2 = getPolConstants(),
        a = _getPolConstants2.a,
        b = _getPolConstants2.b,
        c = _getPolConstants2.c;

    var test = a !== 0.0 && !isNaN(a) && !isNaN(b) && !isNaN(c);
    var result = null;
    if (test) {
        result = a * Math.pow(x, 2) + b * x + c;
    }
    return result;
}

function setCoordinates(xScale, yScale) {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, width, height);
    context.setTransform(xScale, 0, 0, yScale, width / 2, height / 2);
    context.beginPath();
    context.lineWidth = -1 / yScale;
    console.log(context.lineWidth);
    context.moveTo(-width / 2, 0);
    context.strokeStyle = "blue";
    context.lineTo(width / 2, 0);
    context.stroke();
    context.beginPath();
    context.lineWidth = 1 / xScale;
    console.log(context.lineWidth);
    context.moveTo(0, height / 2);
    context.lineTo(0, -height / 2);
    context.stroke();
}

function drawOnCanvas() {
    var _solvePol = solvePol(),
        x1 = _solvePol.x1,
        x2 = _solvePol.x2;

    if (x1 !== null) {
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        var width = canvas.width;
        var height = canvas.height;
        setCoordinates(1, -1);
        console.log(x1);
        console.log(x2);
        console.log(canvas.width);
        context.beginPath();
        context.strokeStyle = "red";
        for (var x = -width / 2; x <= width / 2; x += 0.1) {
            context.lineTo(x, evaluatePol(x));
        }
        context.stroke();
    }
}

function solveTriangle() {
    var a = parseFloat(document.getElementById("trian_a").value);
    var b = parseFloat(document.getElementById("trian_b").value);
    var c = null; // = parseFloat(document.getElementById("trian_c").value);
    console.log(a);
    console.log(b);
    //console.log(c);
    var test = a !== 0.0 && !isNaN(a) && b !== 0.0 && !isNaN(b); // && c !== 0.0 && !isNaN(c));
    if (test) {
        c = Math.pow(Math.pow(a, 2) + Math.pow(b, 2), 0.5);
    }
    document.getElementById("trian_result").innerHTML = "{c: " + c + "}";
    return { c: c };
}

function drawOnCanvasTri() {
    var _getTrianConstants = getTrianConstants(),
        a = _getTrianConstants.a,
        b = _getTrianConstants.b;

    var _solveTriangle = solveTriangle(),
        c = _solveTriangle.c;

    if (c !== null) {
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        setCoordinates(1, -1);
        context.beginPath();
        context.strokeStyle = "red";
        context.moveTo(-a / 2, -b / 2);
        context.lineTo(a / 2, -b / 2);
        context.lineTo(a / 2, b / 2);
        context.lineTo(-a / 2, -b / 2);
        context.stroke();
    }
}

var app = {
    // Application Constructor
    initialize: function initialize() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function onDeviceReady() {
        this.receivedEvent('deviceready');
        assignOnSelect();
        document.getElementById("poly_bu").addEventListener("click", drawOnCanvas, false);
        document.getElementById("trian_bu").addEventListener("click", drawOnCanvasTri, false);
    },

    // Update DOM on a Received Event
    receivedEvent: function receivedEvent(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
//# sourceMappingURL=index.js.map