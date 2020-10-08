var PerfectGym =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ClientPortal.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ClientPortal.less":
/*!*******************************!*\
  !*** ./src/ClientPortal.less ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack://PerfectGym/./src/ClientPortal.less?");

/***/ }),

/***/ "./src/ClientPortal.ts":
/*!*****************************!*\
  !*** ./src/ClientPortal.ts ***!
  \*****************************/
/*! exports provided: ClientPortal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ClientPortal\", function() { return ClientPortal; });\n/* harmony import */ var _ClientPortal_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ClientPortal.less */ \"./src/ClientPortal.less\");\n/* harmony import */ var _ClientPortal_less__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ClientPortal_less__WEBPACK_IMPORTED_MODULE_0__);\n\r\nvar loadMaskEl;\r\nvar iframeResize = window.iFrameResize;\r\nfunction addLoadMask() {\r\n    if (loadMaskEl)\r\n        return;\r\n    var loadMaskSVG = \"<svg class='cp-load-mask-spinner'\\n        width='65px'\\n        height='65px' viewBox='0 0 66 66' xmlns='http://www.w3.org/2000/svg'>\\n    <circle fill='none' stroke-width='6' stroke-linecap='round' cx='33' cy='33' r='30'></circle>\\n    </svg>\";\r\n    loadMaskEl = document.createElement('DIV');\r\n    loadMaskEl.classList.add('cp-load-mask');\r\n    loadMaskEl.innerHTML = loadMaskSVG;\r\n    document.body.appendChild(loadMaskEl);\r\n}\r\nfunction showLoadMask() {\r\n    loadMaskEl.classList.add('is-visible');\r\n}\r\nfunction hideLoadMask() {\r\n    loadMaskEl.classList.remove('is-visible');\r\n}\r\nvar ClientPortal = /** @class */ (function () {\r\n    function ClientPortal(wrapper, options) {\r\n        var _this = this;\r\n        this._elementWrapperSelector = 'cp-iframe-wrapper';\r\n        this._modalOverlaySelector = 'cp-modal-overlay';\r\n        this._promiseResolveMap = {};\r\n        this._wasConnectedBefore = false;\r\n        if (!options || !options.url)\r\n            throw new Error('url is not defined');\r\n        this._createIframe(wrapper, options);\r\n        window.addEventListener('message', function (event) {\r\n            if (!event.data)\r\n                return;\r\n            // other liblaries has their own mechanism for parsing data which isn't compoatibile\r\n            // with JSON.parse method if we cant parse message with json we can assume that this info\r\n            // doesn't interest us\r\n            var msg;\r\n            try {\r\n                msg = JSON.parse(event.data);\r\n            }\r\n            catch (e) {\r\n                return;\r\n            }\r\n            if (msg.isResponse) {\r\n                _this._onResponse(msg);\r\n            }\r\n            else {\r\n                _this._onMessage(msg, options, event);\r\n            }\r\n        });\r\n        if (!options.hideLoadMask && options.loadMask && !options.loadMask.disable) {\r\n            addLoadMask();\r\n            if (!options.hideInitLoadMask && options.loadMask && options.loadMask.disableOnInit)\r\n                showLoadMask();\r\n        }\r\n        var iframe = iframeResize({\r\n            checkOrigin: false,\r\n            warningTimeout: 15000,\r\n        }, this._element);\r\n    }\r\n    ClientPortal.prototype._onMessage = function (msg, options, event) {\r\n        var result = this.recieveMsg(msg, options);\r\n        var response = JSON.stringify({\r\n            id: msg.id,\r\n            isResponse: true,\r\n            data: result,\r\n            action: msg.action,\r\n        });\r\n        // If there wasn't any action performed it means that the communication comes from\r\n        // other library (seamless) it means that we shouldn't send response\r\n        if (msg.action && msg.id)\r\n            event.source.postMessage(response, event.origin);\r\n    };\r\n    ClientPortal.prototype._onResponse = function (msg) {\r\n        if (!this._promiseResolveMap[msg.id])\r\n            throw new Error('No callback was specified');\r\n        this._promiseResolveMap[msg.id](msg.data);\r\n        delete this._promiseResolveMap[msg.id];\r\n    };\r\n    ClientPortal.prototype._getIframeTopOffset = function () {\r\n        var elem = this._element;\r\n        var offsetTop = elem.offsetTop;\r\n        var offsetParent = elem.offsetParent;\r\n        while (elem) {\r\n            if (elem.clientHeight !== elem.scrollHeight) {\r\n                // Additional if is needed bacause sometiome element's scrollHeight is larger than clientHeight\r\n                // event if there isn't any scroll.\r\n                // This situation can be observed when absolutely positioned child is added to an element.\r\n                var styles = getComputedStyle(elem);\r\n                if (styles.overflow === 'auto' || styles.overflowY === 'auto')\r\n                    return offsetTop - elem.offsetTop;\r\n            }\r\n            if (elem === offsetParent) {\r\n                offsetTop += elem.offsetTop;\r\n                offsetParent = elem.offsetParent;\r\n            }\r\n            elem = elem.parentElement;\r\n        }\r\n        return offsetTop;\r\n    };\r\n    ClientPortal.prototype._getViewport = function (options) {\r\n        var boundingRect = this._element.getBoundingClientRect();\r\n        return {\r\n            navbarHeight: this._getIframeTopOffset(),\r\n            top: boundingRect.top + window.scrollY,\r\n            bottom: boundingRect.bottom,\r\n            windowHeight: window.innerHeight,\r\n            scrollTop: window.scrollY,\r\n        };\r\n    };\r\n    ClientPortal.prototype.recieveMsg = function (msg, options) {\r\n        var action = msg.action;\r\n        var data = msg.data;\r\n        var result;\r\n        switch (action) {\r\n            case 'child-connected':\r\n                var connectOptions = {\r\n                    loginPage: options.loginPage || {},\r\n                    navigation: options.navigation || {},\r\n                    registration: options.registration || {},\r\n                    calendarPage: options.calendarPage || {},\r\n                    minHeight: options.minHeight,\r\n                };\r\n                this._sendData('parent-connected', connectOptions);\r\n                if (!this._wasConnectedBefore) {\r\n                    if (!options.forceUrl)\r\n                        this.goTo(options.defaultState || 'Profile', options.defaultStateParams);\r\n                    this._wasConnectedBefore = true;\r\n                }\r\n                options.onConnect && options.onConnect();\r\n                break;\r\n            case 'showLoadMask':\r\n                if (!options.hideLoadMask && options.loadMask && !options.loadMask.disable) {\r\n                    showLoadMask();\r\n                }\r\n                options.onShowLoadMask && options.onShowLoadMask();\r\n                options.loadMask && options.loadMask.onShow && options.loadMask.onShow();\r\n                break;\r\n            case 'hideLoadMask':\r\n                if (!options.hideLoadMask && options.loadMask && !options.loadMask.disable) {\r\n                    hideLoadMask();\r\n                }\r\n                options.onHideLoadMask && options.onHideLoadMask();\r\n                options.loadMask && options.loadMask.onHide && options.loadMask.onHide();\r\n                break;\r\n            case 'showModalOverlay':\r\n                if (!options.hideModalOverlay || (options.modal && !options.modal.disableOverlay))\r\n                    this._showModalOverlay();\r\n                options.onShowModal && options.onShowModal();\r\n                options.modal && options.modal.onShow && options.modal.onShow();\r\n                result = this._getViewport(options);\r\n                break;\r\n            case 'hideModalOverlay':\r\n                if (!options.hideModalOverlay || (options.modal && !options.modal.disableOverlay))\r\n                    this._hideModalOverlay();\r\n                options.onHideModal && options.onHideModal();\r\n                options.modal && options.modal.onHide && options.modal.onHide();\r\n                break;\r\n            case 'userLoggedIn':\r\n                options.onUserLoggedIn && options.onUserLoggedIn(data);\r\n                break;\r\n            case 'userLoggedOut':\r\n                options.onUserLoggedOut && options.onUserLoggedOut(data);\r\n                break;\r\n            case 'stateChangeSuccess':\r\n                // some browsers add scroll to html, some to body\r\n                // that's why I scroll on both elements\r\n                var offsetTop = this._getIframeTopOffset() - (options.topOffset || 0);\r\n                if (document.body.scrollTop > offsetTop ||\r\n                    document.documentElement.scrollTop > offsetTop) {\r\n                    window.scroll({ top: offsetTop, left: 0, behavior: 'smooth' });\r\n                }\r\n                if (data.toState.name == 'Auth.Login')\r\n                    this._forceResize();\r\n                if (!options.enableVirtualStates && data.isVirtual)\r\n                    break;\r\n                options.onStateChangeSuccess && options.onStateChangeSuccess(data);\r\n                break;\r\n            case 'mobileDropdownOpen':\r\n                options.onMobileDropdownOpen && options.onMobileDropdownOpen();\r\n                options.modal && options.modal.onMobileOpen && options.modal.onMobileOpen();\r\n                result = this._getViewport(options);\r\n                break;\r\n            case 'mobileDropdownClose':\r\n                options.onMobileDropdownClose && options.onMobileDropdownClose();\r\n                options.modal && options.modal.onMobileClose && options.modal.onMobileClose();\r\n                break;\r\n            case 'scrollWindow':\r\n                var topOffset = this._getIframeTopOffset() - (options.topOffset || 0);\r\n                if (options.onContentScroll) {\r\n                    options.onContentScroll(data + offsetTop);\r\n                }\r\n                else {\r\n                    window.scroll({ top: data + offsetTop, left: 0, behavior: 'smooth' });\r\n                }\r\n                break;\r\n            case 'setCookieOnParent':\r\n                this._setCookieOnParent();\r\n                break;\r\n        }\r\n        return result;\r\n    };\r\n    ClientPortal.prototype._createModalOverlay = function () {\r\n        var overlayEl = document.createElement('DIV');\r\n        overlayEl.classList.add(this._modalOverlaySelector);\r\n        return overlayEl;\r\n    };\r\n    ClientPortal.prototype._showModalOverlay = function () {\r\n        var boundingRect = this._element.getBoundingClientRect();\r\n        var bodyRect = document.body.getBoundingClientRect();\r\n        var topOverlay = this._createModalOverlay();\r\n        topOverlay.style.top = '-1000px';\r\n        topOverlay.style.height = '1000px';\r\n        var bottomOverlay = this._createModalOverlay();\r\n        var bottomOverlayHeight = bodyRect.bottom - boundingRect.bottom;\r\n        // todo: find out why -4 is needed\r\n        bottomOverlay.style.bottom = (bottomOverlayHeight - 4) * -1 + 'px';\r\n        bottomOverlay.style.height = bottomOverlayHeight + 'px';\r\n        var leftOverlay = this._createModalOverlay();\r\n        leftOverlay.style.top = topOverlay.style.top;\r\n        leftOverlay.style.bottom = bottomOverlay.style.bottom;\r\n        leftOverlay.style.left = bodyRect.left - boundingRect.left + 'px';\r\n        leftOverlay.style.right = boundingRect.width + 'px';\r\n        var rightOverlay = this._createModalOverlay();\r\n        rightOverlay.style.top = topOverlay.style.top;\r\n        rightOverlay.style.bottom = bottomOverlay.style.bottom;\r\n        rightOverlay.style.left = boundingRect.width + 'px';\r\n        rightOverlay.style.right = -(bodyRect.right - boundingRect.right) + 'px';\r\n        if (!this._elementWrapper)\r\n            return;\r\n        this._elementWrapper.appendChild(topOverlay);\r\n        this._elementWrapper.appendChild(bottomOverlay);\r\n        this._elementWrapper.appendChild(leftOverlay);\r\n        this._elementWrapper.appendChild(rightOverlay);\r\n    };\r\n    ClientPortal.prototype._hideModalOverlay = function () {\r\n        var parentElement = document.getElementsByClassName(this._elementWrapperSelector)[0];\r\n        var overlayElements = document.getElementsByClassName(this._modalOverlaySelector);\r\n        var len = overlayElements.length;\r\n        for (var i = 0; i < len; i += 1) {\r\n            parentElement.removeChild(overlayElements[0]);\r\n        }\r\n    };\r\n    ClientPortal.prototype._createIframe = function (elementWrapper, options) {\r\n        var _this = this;\r\n        var iframeElement = document.createElement('iframe');\r\n        var language = options && options.language ? \"&lang=\" + options.language : '';\r\n        // iframeElement.setAttribute(\"sandbox\", \"allow-scripts allow-same-origin\");\r\n        var isMobile = window.innerWidth < 500 || window.innerHeight < 500;\r\n        var mode = isMobile ? '?mode=mobile' : '?mode=desktop';\r\n        var url = options.url;\r\n        url = url[url.length - 1] === '/' ? url : url + '/';\r\n        this._companyUrl = url;\r\n        var defaultState = options.defaultState || 'Profile';\r\n        var params = '?' + this._serializeParams(options.defaultStateParams) || false;\r\n        iframeElement.src =\r\n            options.forceUrl || url + mode + language + '#/' + defaultState + params;\r\n        iframeElement.style.border = 'none';\r\n        iframeElement.style.width = '1px';\r\n        iframeElement.style.maxWidth = '100%';\r\n        iframeElement.style.minWidth = '100%';\r\n        elementWrapper.appendChild(iframeElement);\r\n        elementWrapper.classList.add(this._elementWrapperSelector);\r\n        iframeElement.onload = function () {\r\n            var topOffset = _this._getIframeTopOffset() - (options.topOffset || 0);\r\n            window.scroll({ top: topOffset, left: 0, behavior: 'smooth' });\r\n        };\r\n        this._element = iframeElement;\r\n        this._elementWrapper = elementWrapper;\r\n    };\r\n    ClientPortal.prototype._serializeParams = function (paramsObject) {\r\n        var paramsString = '';\r\n        for (var key in paramsObject) {\r\n            if (paramsString != '') {\r\n                paramsString += '&';\r\n            }\r\n            paramsString += key + '=' + encodeURIComponent(paramsObject[key]);\r\n        }\r\n        return paramsString;\r\n    };\r\n    // because of communication now library supports only one iframe support\r\n    ClientPortal.prototype._sendData = function (action, data) {\r\n        var _this = this;\r\n        return new Promise(function (resolve) {\r\n            var id = Math.round(Math.random() * 999999);\r\n            while (_this._promiseResolveMap[id])\r\n                id = Math.round(Math.random() * 999999);\r\n            var msg = {\r\n                isResponse: false,\r\n                action: action,\r\n                data: data,\r\n                id: id,\r\n            };\r\n            _this._element.contentWindow.postMessage(JSON.stringify(msg), '*');\r\n            _this._promiseResolveMap[id] = resolve;\r\n        });\r\n    };\r\n    ClientPortal.prototype._setCookieOnParent = function () {\r\n        var _this = this;\r\n        var url = this._companyUrl + 'EmbedMode/SetCookie';\r\n        var onClickAction = \"window.open('\" + url + \"', '_blank');removeInput();\";\r\n        var cookieInputEl = document.createElement('input');\r\n        cookieInputEl.setAttribute('onclick', onClickAction);\r\n        cookieInputEl.style.position = 'absolute';\r\n        cookieInputEl.style.top = '0';\r\n        cookieInputEl.style.bottom = '0';\r\n        cookieInputEl.style.left = '0';\r\n        cookieInputEl.style.right = '0';\r\n        cookieInputEl.style.width = '100%';\r\n        cookieInputEl.style.opacity = '0.000001';\r\n        this._elementWrapper.style.position = 'relative';\r\n        this._elementWrapper.appendChild(cookieInputEl);\r\n        window.removeInput = function () {\r\n            _this._elementWrapper.removeChild(cookieInputEl);\r\n            setTimeout(function () {\r\n                _this._element.contentWindow.location.replace(_this._element.src);\r\n            }, 300);\r\n        };\r\n    };\r\n    ClientPortal.prototype._forceResize = function () {\r\n        var element = this._element;\r\n        element.style.height = '';\r\n        element.iFrameResizer.resize();\r\n    };\r\n    ClientPortal.prototype.goTo = function (state, params) {\r\n        var data = {\r\n            state: state,\r\n            params: params,\r\n        };\r\n        return this._sendData('goToState', data);\r\n    };\r\n    ClientPortal.prototype.logout = function () {\r\n        return this._sendData('logout');\r\n    };\r\n    ClientPortal.prototype.changeLanguage = function (languageCode) {\r\n        return this._sendData('changeLanguage', languageCode);\r\n    };\r\n    ClientPortal.prototype.isUserLoggedIn = function () {\r\n        return this._sendData('isUserLogged');\r\n    };\r\n    ClientPortal.prototype.getElement = function () {\r\n        return this._element;\r\n    };\r\n    ClientPortal.State = {\r\n        Login: 'Auth.Login',\r\n        Registration: 'Registration',\r\n        Classes: 'Classes',\r\n        ClassesList: 'Classes.List',\r\n        PersonalTraining: 'PersonalTraining',\r\n        ReservedClasses: 'MyCalendar.AllActivities',\r\n        Products: 'MyProducts',\r\n        BuyProducts: 'BuyProducts',\r\n        Profile: 'Profile',\r\n        ProfileEdit: 'Profile.Edit',\r\n        ProfilePayment: 'Profile.Payment',\r\n        ProfileContract: 'Profile.Contract',\r\n        ProfileFreeze: 'Profile.Freeze',\r\n        ProfilePrepaid: 'Profile.Prepaid',\r\n        ProfileChangePassword: 'Profile.ChangePassword',\r\n        ProfilePayments: 'Profile.Payments',\r\n        ProfileFamily: 'Profile.Family',\r\n    };\r\n    return ClientPortal;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack://PerfectGym/./src/ClientPortal.ts?");

/***/ })

/******/ });