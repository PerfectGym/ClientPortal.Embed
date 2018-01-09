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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClientPortal", function() { return ClientPortal; });
var loadMaskEl;
var iframeResize = window.iFrameResize;
function addLoadMask() {
    if (loadMaskEl)
        return;
    var loadMaskSVG = "<svg class='cp-load-mask-spinner'\n        width='65px'\n        height='65px' viewBox='0 0 66 66' xmlns='http://www.w3.org/2000/svg'>\n    <circle fill='none' stroke-width='6' stroke-linecap='round' cx='33' cy='33' r='30'></circle>\n    </svg>";
    loadMaskEl = document.createElement('DIV');
    loadMaskEl.classList.add('cp-load-mask');
    loadMaskEl.innerHTML = loadMaskSVG;
    document.body.appendChild(loadMaskEl);
}
function showLoadMask() {
    loadMaskEl.classList.add('is-visible');
}
function hideLoadMask() {
    loadMaskEl.classList.remove('is-visible');
}
var ClientPortal = /** @class */ (function () {
    function ClientPortal(wrapper, options) {
        var _this = this;
        this._elementWrapperSelector = 'cp-iframe-wrapper';
        this._modalOverlaySelector = 'cp-modal-overlay';
        this._promiseResolveMap = {};
        this._wasConnectedBefore = false;
        if (!options || !options.url)
            throw new Error("url is not defined");
        this._createIframe(wrapper, options);
        window.addEventListener('message', function (event) {
            if (!event.data)
                return;
            // other liblaries has their own mechanism for parsing data which isn't compoatibile 
            // with JSON.parse method if we cant parse message with json we can assume that this info 
            // doesn't interest us
            var msg;
            try {
                msg = JSON.parse(event.data);
            }
            catch (e) {
                return;
            }
            if (msg.isResponse) {
                _this._onResponse(msg);
            }
            else {
                _this._onMessage(msg, options, event);
            }
        });
        if (!options.hideLoadMask) {
            addLoadMask();
            if (!options.hideInitLoadMask)
                showLoadMask();
        }
        // seamless(this._element, {
        //   showLoadingIndicator: false,
        //   fallback: false
        // });
        var iframe = iframeResize({
            checkOrigin: false,
            warningTimeout: 15000
        }, this._element);
    }
    ClientPortal.prototype._onMessage = function (msg, options, event) {
        var result = this.recieveMsg(msg, options);
        var response = JSON.stringify({
            id: msg.id,
            isResponse: true,
            data: result,
            action: msg.action
        });
        // If there wasn't any action performed it means that the communication comes from 
        // other liblary (seamless) it means that we shouldn't send response
        if (msg.action && msg.id)
            event.source.postMessage(response, event.origin);
    };
    ClientPortal.prototype._onResponse = function (msg) {
        if (!this._promiseResolveMap[msg.id])
            throw new Error("No callback was specified");
        this._promiseResolveMap[msg.id](msg.data);
        delete this._promiseResolveMap[msg.id];
    };
    ClientPortal.prototype._getIframeTopOffset = function () {
        var elem = this._element;
        var offsetTop = elem.offsetTop;
        var offsetParent = elem.offsetParent;
        while (elem) {
            if (elem.clientHeight !== elem.scrollHeight) {
                // Additional if is needed bacause sometiome element's scrollHeight is larger than clientHeight
                // event if there isn't any scroll. 
                // This situation can be observed when absolutely positioned child is added to an element.
                var styles = getComputedStyle(elem);
                if (styles.overflow === "auto" || styles.overflowY === "auto")
                    return offsetTop - elem.offsetTop;
            }
            if (elem === offsetParent) {
                offsetTop += elem.offsetTop;
                offsetParent = elem.offsetParent;
            }
            elem = elem.parentElement;
        }
        return offsetTop;
    };
    ClientPortal.prototype._getViewport = function (options) {
        var boundingRect = this._element.getBoundingClientRect();
        return {
            navbarHeight: this._getIframeTopOffset(),
            top: boundingRect.top + window.scrollY,
            bottom: boundingRect.bottom,
            windowHeight: window.innerHeight,
            scrollTop: window.scrollY
        };
    };
    ;
    ClientPortal.prototype.recieveMsg = function (msg, options) {
        var action = msg.action;
        var data = msg.data;
        var result;
        switch (action) {
            case 'child-connected':
                this._sendData('parent-connected');
                if (!this._wasConnectedBefore) {
                    this.goTo(options.defaultState || "Profile", options.defaultStateParams);
                    this._wasConnectedBefore = true;
                }
                options.onConnect && options.onConnect();
                break;
            case 'showLoadMask':
                if (!options.hideLoadMask)
                    showLoadMask();
                options.onShowLoadMask && options.onShowLoadMask();
                break;
            case 'hideLoadMask':
                if (!options.hideLoadMask)
                    hideLoadMask();
                options.onHideLoadMask && options.onHideLoadMask();
                break;
            case 'showModalOverlay':
                if (!options.hideModalOverlay)
                    this._showModalOverlay();
                options.onShowModal && options.onShowModal();
                result = this._getViewport(options);
                break;
            case 'hideModalOverlay':
                if (!options.hideModalOverlay)
                    this._hideModalOverlay();
                options.onHideModal && options.onHideModal();
                break;
            case 'userLoggedIn':
                options.onUserLoggedIn && options.onUserLoggedIn(data);
                break;
            case 'userLoggedOut':
                options.onUserLoggedOut && options.onUserLoggedOut(data);
                break;
            case 'stateChangeSuccess':
                // some browsers add scroll to html, some to body 
                // that's why I scroll on both elements
                var offsetTop = this._getIframeTopOffset();
                if (document.body.scrollTop > offsetTop || document.documentElement.scrollTop > offsetTop) {
                    window.scroll({ top: offsetTop, left: 0, behavior: 'smooth' });
                }
                if (!options.enableVirtualStates && data.isVirtual)
                    break;
                options.onStateChangeSuccess && options.onStateChangeSuccess(data);
                break;
            case 'mobileDropdownOpen':
                options.onMobileDropdownOpen && options.onMobileDropdownOpen();
                result = this._getViewport(options);
                break;
            case 'mobileDropdownClose':
                options.onMobileDropdownClose && options.onMobileDropdownClose();
                break;
            case 'scrollWindow':
                if (options.onContentScroll) {
                    options.onContentScroll(data);
                }
                else {
                    window.scroll({ top: data + this._getIframeTopOffset(), left: 0, behavior: 'smooth' });
                }
                break;
        }
        return result;
    };
    ClientPortal.prototype._createModalOverlay = function () {
        var overlayEl = document.createElement("DIV");
        overlayEl.classList.add(this._modalOverlaySelector);
        return overlayEl;
    };
    ;
    ClientPortal.prototype._showModalOverlay = function () {
        var boundingRect = this._element.getBoundingClientRect();
        var bodyRect = document.body.getBoundingClientRect();
        var topOverlay = this._createModalOverlay();
        topOverlay.style.top = '-1000px';
        topOverlay.style.height = '1000px';
        var bottomOverlay = this._createModalOverlay();
        var bottomOverlayHeight = (bodyRect.bottom - boundingRect.bottom);
        // todo: find out why -4 is needed
        bottomOverlay.style.bottom = (bottomOverlayHeight - 4) * -1 + 'px';
        bottomOverlay.style.height = bottomOverlayHeight + 'px';
        if (!this._elementWrapper)
            return;
        this._elementWrapper.appendChild(topOverlay);
        this._elementWrapper.appendChild(bottomOverlay);
    };
    ClientPortal.prototype._hideModalOverlay = function () {
        var parentElement = document.getElementsByClassName(this._elementWrapperSelector)[0];
        var overlayElements = document.getElementsByClassName(this._modalOverlaySelector);
        var len = overlayElements.length;
        for (var i = 0; i < len; i += 1) {
            parentElement.removeChild(overlayElements[0]);
        }
    };
    ClientPortal.prototype._createIframe = function (elementWrapper, options) {
        var iframeElement = document.createElement("iframe");
        var language = options && options.language ? "&lang=" + options.language : "";
        // iframeElement.setAttribute("sandbox", "allow-scripts allow-same-origin");
        var isMobile = window.innerWidth < 500 || window.innerHeight < 500;
        var mode = isMobile ? '?mode=mobile' : '?mode=desktop';
        var url = options.url;
        url = url[url.length - 1] === "/" ? url : url + "/";
        var defaultState = options.defaultState || "Profile";
        var params = '?' + this._serializeParams(options.defaultStateParams) || "";
        iframeElement.src = url + mode + language + '#/' + defaultState + params;
        iframeElement.style.width = '100%';
        iframeElement.style.border = 'none';
        elementWrapper.appendChild(iframeElement);
        elementWrapper.classList.add(this._elementWrapperSelector);
        this._element = iframeElement;
        this._elementWrapper = elementWrapper;
    };
    ClientPortal.prototype._serializeParams = function (paramsObject) {
        var paramsString = "";
        for (var key in paramsObject) {
            if (paramsString != "") {
                paramsString += "&";
            }
            paramsString += key + "=" + encodeURIComponent(paramsObject[key]);
        }
        return paramsString;
    };
    // because of communication now liblary supports only one iframe support
    ClientPortal.prototype._sendData = function (action, data) {
        var _this = this;
        return new Promise(function (resolve) {
            var id = Math.round(Math.random() * 999999);
            while (_this._promiseResolveMap[id])
                id = Math.round(Math.random() * 999999);
            var msg = {
                isResponse: false,
                action: action,
                data: data,
                id: id
            };
            _this._element.contentWindow.postMessage(JSON.stringify(msg), '*');
            _this._promiseResolveMap[id] = resolve;
        });
    };
    ClientPortal.prototype.goTo = function (state, params) {
        var data = {
            state: state,
            params: params
        };
        return this._sendData('goToState', data);
    };
    ClientPortal.prototype.logout = function () {
        return this._sendData('logout');
    };
    ClientPortal.prototype.changeLanguage = function (languageCode) {
        return this._sendData('changeLanguage', languageCode);
    };
    ClientPortal.prototype.isUserLoggedIn = function () {
        return this._sendData('isUserLogged');
    };
    ClientPortal.prototype.getElement = function () {
        return this._element;
    };
    ClientPortal.State = {
        Login: 'Auth.Login',
        Registration: 'Registration',
        Classes: 'Classes',
        ClassesList: 'Classes.List',
        PersonalTraining: 'PersonalTraining',
        ReservedClasses: 'MyCalendar.AllActivities',
        Products: 'MyProducts',
        BuyProducts: 'BuyProducts',
        Profile: 'Profile',
        ProfileEdit: 'Profile.Edit',
        ProfilePayment: 'Profile.Payment',
        ProfileContract: 'Profile.Contract',
        ProfileFreeze: 'Profile.Freeze',
        ProfilePrepaid: 'Profile.Prepaid',
        ProfileChangePassword: 'Profile.ChangePassword',
        ProfilePayments: 'Profile.Payments',
        ProfileFamily: 'Profile.Family'
    };
    return ClientPortal;
}());



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ClientPortal__ = __webpack_require__(0);
/* THIS IS DEMO */

window.onload = function () {
    var userInfo;
    var options = {
        language: "en",
        url: "https://presentation.perfectgym.pl/ClientPortal2/#/Login",
        defaultState: __WEBPACK_IMPORTED_MODULE_0__ClientPortal__["ClientPortal"].State.Registration,
        defaultStateParams: { trainingModel: 'PayAsYouGo' },
        onConnect: function () {
            console.info('Connected to Client Portal');
        },
        onStateChangeSuccess: function (data) {
            console.log('state change', data);
        },
        onUserLoggedIn: function (data) {
            console.log('logged in', data);
        },
        onUserLoggedOut: function (data) {
            console.log('logged out', data);
        }
    };
    var element = document.getElementById('pg-client-portal');
    var CP;
    if (element instanceof HTMLElement) {
        CP = new __WEBPACK_IMPORTED_MODULE_0__ClientPortal__["ClientPortal"](element, options);
        window.CP = CP;
        window.ClientPortal = __WEBPACK_IMPORTED_MODULE_0__ClientPortal__["ClientPortal"];
    }
    window.getUserData = function () {
        CP.isUserLoggedIn()
            .then(function (data) {
            var user = data.user;
            var userInfoElement = document.getElementById('user-name');
            userInfo = user;
            if (userInfoElement) {
                userInfoElement.innerText = user.Email;
            }
        })
            .catch(function () {
            var userInfoElement = document.getElementById('user-name');
            if (userInfoElement) {
                userInfoElement.innerText = "User not logged in";
            }
        });
    };
    window.logout = function () {
        CP.logout()
            .then(function () {
            var userInfoElement = document.getElementById('user-name');
            if (userInfoElement) {
                userInfoElement.innerText = "";
            }
        });
    };
};


/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map