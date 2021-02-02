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

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst constants_json_1 = __importDefault(__webpack_require__(/*! ./constants.json */ \"./src/constants.json\"));\nconst LOOP_MAX = 1000;\nclass Complex {\n    constructor(re, im) {\n        this.re = re;\n        this.im = im;\n    }\n    add(rhs) { return new Complex(this.re + rhs.re, this.im + rhs.im); }\n    mult(rhs) { return new Complex(this.re * rhs.re - this.im * rhs.im, this.re * rhs.im + this.im * rhs.re); }\n    sqrd() { return this.mult(this); }\n    abs() { return this.re * this.re + this.im * this.im; }\n    toPoint() { return ({ x: this.re, y: this.im }); }\n}\nconst MBtransform = (z, c) => z.sqrd().add(c);\nconst isInnerMBSet = (c) => {\n    const LOOP_MAX = 300;\n    let z = new Complex(0, 0);\n    for (let i = 0; i < LOOP_MAX; i++) {\n        z = MBtransform(z, c);\n        if (z.abs() > 2) {\n            return false;\n        }\n    }\n    return true;\n};\nconst calculateDivergeSpeed = (c) => {\n    if (c.abs() >= 2) {\n        return LOOP_MAX;\n    }\n    let z = new Complex(0, 0);\n    for (let i = 1; i < LOOP_MAX; i++) {\n        z = MBtransform(z, c);\n        if (z.abs() > 2) {\n            return LOOP_MAX - i;\n        }\n    }\n    return 0;\n};\nclass AffineTransformer {\n    constructor(matrix) {\n        this.matrix = matrix;\n    }\n    transform({ x: _x, y: _y }) {\n        const [[a, b, c], [d, e, f]] = this.matrix;\n        return { x: a * _x + b * _y + c, y: d * _x + e * _y + f };\n    }\n    inverse({ x: _x, y: _y }) {\n        const [[a, b, c], [d, e, f]] = this.matrix;\n        const det = a * e - b * d;\n        return { x: (e * _x - b * _y - c * e + b * f) / det, y: (-d * _x + a * _y + c * d - a * f) / det };\n    }\n}\nconst renderMB = (context, centerPoint, expansionRate) => {\n    const CanvasWidth = context.canvas.width;\n    const CanvasHeight = context.canvas.height;\n    context.clearRect(0, 0, CanvasWidth, CanvasWidth);\n    const canvasTF = new AffineTransformer([[expansionRate, 0, CanvasWidth / 2 - expansionRate * centerPoint.x], [0, -expansionRate, CanvasHeight / 2 + expansionRate * centerPoint.y]]);\n    for (let canv_x = 0; canv_x < CanvasWidth; canv_x++) {\n        for (let canv_y = 0; canv_y < CanvasWidth; canv_y++) {\n            const { x: re, y: im } = canvasTF.inverse({ x: canv_x, y: canv_y });\n            const divergeSpeed = calculateDivergeSpeed(new Complex(re, im));\n            switch (true) {\n                case divergeSpeed === 0:\n                    context.fillStyle = `rgb(0, 0, 0)`;\n                    break;\n                case divergeSpeed <= LOOP_MAX * 0.5: //  1/2\n                    context.fillStyle = `rgb(255, 255, 255)`;\n                    break;\n                case divergeSpeed <= LOOP_MAX * 0.75: //  3/4\n                    context.fillStyle = `rgb(100, 250, 200)`;\n                    break;\n                case divergeSpeed <= LOOP_MAX * 0.875: //  7/8\n                    context.fillStyle = `rgb(80, 150, 150)`;\n                    break;\n                case divergeSpeed <= LOOP_MAX * 0.9375: // 15/16\n                    context.fillStyle = `rgb(50, 150, 230)`;\n                    break;\n                case divergeSpeed <= LOOP_MAX * 0.96875: // 31/32\n                    context.fillStyle = `rgb(0, 130, 255)`;\n                    break;\n                case divergeSpeed <= LOOP_MAX - 1:\n                    context.fillStyle = `rgb(0, 100, 255)`;\n                    break;\n                default:\n                    context.fillStyle = `rgb(0, 0, 255)`;\n                    break;\n            }\n            context.fillRect(canv_x, canv_y, 1, 1);\n        }\n    }\n};\nfunction onClickReload() {\n    const x = Number.parseFloat(document.getElementById(constants_json_1.default.Inputs.CenterX.ID).value);\n    const y = Number.parseFloat(document.getElementById(constants_json_1.default.Inputs.CenterY.ID).value);\n    const expansionRate = Number.parseFloat(document.getElementById(constants_json_1.default.Inputs.ExpansionRate.ID).value);\n    window.history.pushState(undefined, \"\", `?x=${x}&y=${y}&expansionRate=${expansionRate}`);\n    main(false);\n}\nfunction onClickDownload(ev) {\n    const canvas = document.getElementById(constants_json_1.default.Canvas.ID);\n    canvas.toBlob((blob) => {\n        const { x, y, expansionRate } = pickParams();\n        const url = URL.createObjectURL(blob);\n        const atag = document.createElement(\"a\");\n        document.body.appendChild(atag);\n        atag.download = `mandelbrot_${x}_${y}_${expansionRate}.png`;\n        atag.href = url;\n        atag.click();\n        atag.remove();\n        setTimeout(() => { URL.revokeObjectURL(url); }, 100);\n    }, \"image/png\");\n}\nfunction pickParams() {\n    const params = new URL(document.location.toString()).searchParams;\n    const x = Number.parseFloat(params.get(\"x\") ?? \"0\");\n    const y = Number.parseFloat(params.get(\"y\") ?? \"0\");\n    const expansionRate = Number.parseFloat(params.get(\"expansionRate\") ?? \"400\");\n    return { x, y, expansionRate };\n}\nfunction main(initialize) {\n    if (initialize) {\n        document.getElementById(constants_json_1.default.Inputs.Reload.ID).onclick = onClickReload;\n        document.getElementById(constants_json_1.default.Inputs.Download.ID).onclick = onClickDownload;\n        window.onpopstate = () => main(false);\n    }\n    const { x, y, expansionRate } = pickParams();\n    console.log(x, y, expansionRate);\n    document.getElementById(constants_json_1.default.Inputs.CenterX.ID).value = x.toString();\n    document.getElementById(constants_json_1.default.Inputs.CenterY.ID).value = y.toString();\n    document.getElementById(constants_json_1.default.Inputs.ExpansionRate.ID).value = expansionRate.toString();\n    const canvas = document.getElementById(constants_json_1.default.Canvas.ID);\n    renderMB(canvas.getContext(\"2d\"), { x, y }, expansionRate);\n}\nmain(true);\n\n\n//# sourceURL=webpack://mandelbrot-set-playground/./src/app.ts?");

/***/ }),

/***/ "./src/constants.json":
/*!****************************!*\
  !*** ./src/constants.json ***!
  \****************************/
/***/ ((module) => {

eval("module.exports = JSON.parse(\"{\\\"Canvas\\\":{\\\"ID\\\":\\\"canvas-area\\\",\\\"Width\\\":800,\\\"Height\\\":800},\\\"Inputs\\\":{\\\"CenterX\\\":{\\\"ID\\\":\\\"CenterX\\\"},\\\"CenterY\\\":{\\\"ID\\\":\\\"CenterY\\\"},\\\"ExpansionRate\\\":{\\\"ID\\\":\\\"ExpansionRate\\\"},\\\"Reload\\\":{\\\"ID\\\":\\\"Relaod\\\"},\\\"Download\\\":{\\\"ID\\\":\\\"Download\\\"}}}\");\n\n//# sourceURL=webpack://mandelbrot-set-playground/./src/constants.json?");

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