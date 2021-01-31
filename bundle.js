/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst constants_json_1 = __importDefault(__webpack_require__(/*! ./constants.json */ \"./src/constants.json\"));\nconst LOOP_MAX = 1000;\nclass Complex {\n    constructor(re, im) {\n        this.re = re;\n        this.im = im;\n    }\n    add(rhs) { return new Complex(this.re + rhs.re, this.im + rhs.im); }\n    mult(rhs) { return new Complex(this.re * rhs.re - this.im * rhs.im, this.re * rhs.im + this.im * rhs.re); }\n    sqrd() { return this.mult(this); }\n    abs() { return this.re * this.re + this.im * this.im; }\n    toPoint() { return ({ x: this.re, y: this.im }); }\n}\nconst MBtransform = (z, c) => z.sqrd().add(c);\nconst isInnerMBSet = (c) => {\n    const LOOP_MAX = 300;\n    let z = new Complex(0, 0);\n    for (let i = 0; i < LOOP_MAX; i++) {\n        z = MBtransform(z, c);\n        if (z.abs() > 2) {\n            return false;\n        }\n    }\n    return true;\n};\nconst calculateDivergeSpeed = (c) => {\n    if (c.abs() >= 2) {\n        return LOOP_MAX;\n    }\n    let z = new Complex(0, 0);\n    for (let i = 1; i < LOOP_MAX; i++) {\n        z = MBtransform(z, c);\n        if (z.abs() > 2) {\n            return LOOP_MAX - i;\n        }\n    }\n    return 0;\n};\nclass AffineTransformer {\n    constructor(matrix) {\n        this.matrix = matrix;\n    }\n    transform({ x: _x, y: _y }) {\n        const [[a, b, c], [d, e, f]] = this.matrix;\n        return { x: a * _x + b * _y + c, y: d * _x + e * _y + f };\n    }\n    inverse({ x: _x, y: _y }) {\n        const [[a, b, c], [d, e, f]] = this.matrix;\n        const det = a * e - b * d;\n        return { x: (e * _x - b * _y - c * e + b * f) / det, y: (-d * _x + a * _y + c * d - a * f) / det };\n    }\n}\nconst renderMB = (context, centerPoint, expansionRate) => {\n    const CanvasWidth = context.canvas.width;\n    const CanvasHeight = context.canvas.height;\n    context.clearRect(0, 0, CanvasWidth, CanvasWidth);\n    const canvasTF = new AffineTransformer([[expansionRate, 0, CanvasWidth / 2 - expansionRate * centerPoint.x], [0, -expansionRate, CanvasHeight / 2 + expansionRate * centerPoint.y]]);\n    const { x: edge_x1, y: edge_y1 } = canvasTF.inverse({ x: 0, y: 0 });\n    const { x: edge_x2, y: edge_y2 } = canvasTF.inverse({ x: CanvasWidth, y: CanvasHeight });\n    const max_x = Math.max(edge_x1, edge_x2);\n    const max_y = Math.max(edge_y1, edge_y2);\n    const min_x = Math.min(edge_x1, edge_x2);\n    const min_y = Math.min(edge_y1, edge_y2);\n    const delta_x = (max_x - min_x) / CanvasWidth;\n    const delta_y = (max_y - min_y) / CanvasHeight;\n    for (let x = min_x; x < max_x; x += delta_x) {\n        for (let y = min_y; y < max_y; y += delta_y) {\n            const divergeSpeed = calculateDivergeSpeed(new Complex(x, y));\n            switch (true) {\n                case divergeSpeed === 0:\n                    context.fillStyle = `rgb(0, 0, 0)`;\n                    break;\n                case divergeSpeed <= LOOP_MAX * 0.5: //  1/2\n                    context.fillStyle = `rgb(255, 255, 255)`;\n                    break;\n                case divergeSpeed <= LOOP_MAX * 0.75: //  3/4\n                    context.fillStyle = `rgb(100, 250, 200)`;\n                    break;\n                case divergeSpeed <= LOOP_MAX * 0.875: //  7/8\n                    context.fillStyle = `rgb(80, 150, 150)`;\n                    break;\n                case divergeSpeed <= LOOP_MAX * 0.9375: // 15/16\n                    context.fillStyle = `rgb(50, 150, 230)`;\n                    break;\n                case divergeSpeed <= LOOP_MAX * 0.96875: // 31/32\n                    context.fillStyle = `rgb(0, 130, 255)`;\n                    break;\n                case divergeSpeed <= LOOP_MAX - 1:\n                    context.fillStyle = `rgb(0, 100, 255)`;\n                    break;\n                default:\n                    context.fillStyle = `rgb(0, 0, 255)`;\n                    break;\n            }\n            const { x: _x, y: _y } = canvasTF.transform({ x, y });\n            context.fillRect(_x, _y, 1, 1);\n        }\n    }\n};\nfunction onClickReload() {\n    const center_x = Number.parseFloat(document.getElementById(constants_json_1.default.Inputs.CenterX.ID).value);\n    const center_y = Number.parseFloat(document.getElementById(constants_json_1.default.Inputs.CenterY.ID).value);\n    const expansionRate = Number.parseFloat(document.getElementById(constants_json_1.default.Inputs.ExpansionRate.ID).value);\n    window.location.hash = `center_x=${center_x}&center_y=${center_y}&expansionRate=${expansionRate}`;\n}\nconst pickParams = () => {\n    const hash = window.location.hash.slice(1);\n    const [_center_x, _center_y, _expansionRate] = hash.split(\"&\");\n    const center_x = Number.parseFloat(_center_x.split(\"=\")[1]);\n    const center_y = Number.parseFloat(_center_y.split(\"=\")[1]);\n    const expansionRate = Number.parseFloat(_expansionRate.split(\"=\")[1]);\n    return { center_x, center_y, expansionRate };\n};\nfunction main() {\n    document.getElementById(constants_json_1.default.Inputs.Reload.ID).onclick = onClickReload;\n    window.onhashchange = main;\n    const { center_x, center_y, expansionRate } = window.location.hash?.length ? pickParams()\n        : { center_x: 0, center_y: 0, expansionRate: 400 };\n    document.getElementById(constants_json_1.default.Inputs.CenterX.ID).value = center_x.toString();\n    document.getElementById(constants_json_1.default.Inputs.CenterY.ID).value = center_y.toString();\n    document.getElementById(constants_json_1.default.Inputs.ExpansionRate.ID).value = expansionRate.toString();\n    const canvas = document.getElementById(constants_json_1.default.Canvas.ID);\n    renderMB(canvas.getContext(\"2d\"), { x: center_x, y: center_y }, expansionRate);\n}\nmain();\n\n\n//# sourceURL=webpack://mandelbrot-set-playground/./src/app.ts?");

/***/ }),

/***/ "./src/constants.json":
/*!****************************!*\
  !*** ./src/constants.json ***!
  \****************************/
/***/ ((module) => {

eval("module.exports = JSON.parse(\"{\\\"Canvas\\\":{\\\"ID\\\":\\\"canvas-area\\\",\\\"Width\\\":800,\\\"Height\\\":800},\\\"Inputs\\\":{\\\"CenterX\\\":{\\\"ID\\\":\\\"CenterX\\\"},\\\"CenterY\\\":{\\\"ID\\\":\\\"CenterY\\\"},\\\"ExpansionRate\\\":{\\\"ID\\\":\\\"ExpansionRate\\\"},\\\"Reload\\\":{\\\"ID\\\":\\\"Relaod\\\"}}}\");\n\n//# sourceURL=webpack://mandelbrot-set-playground/./src/constants.json?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./src/app.ts");
/******/ })()
;