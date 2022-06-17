var PerfectGym;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ClientPortal.less":
/*!*******************************!*\
  !*** ./src/ClientPortal.less ***!
  \*******************************/
/***/ (() => {

// extracted by mini-css-extract-plugin

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*****************************!*\
  !*** ./src/ClientPortal.ts ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClientPortal": () => (/* binding */ ClientPortal)
/* harmony export */ });
/* harmony import */ var _ClientPortal_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ClientPortal.less */ "./src/ClientPortal.less");
/* harmony import */ var _ClientPortal_less__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ClientPortal_less__WEBPACK_IMPORTED_MODULE_0__);

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
            throw new Error('url is not defined');
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
        if (!options.hideLoadMask && options.loadMask && !options.loadMask.disable) {
            addLoadMask();
            if (!options.hideInitLoadMask && options.loadMask && options.loadMask.disableOnInit)
                showLoadMask();
        }
        var iframe = iframeResize({
            checkOrigin: false,
            warningTimeout: 15000,
        }, this._element);
    }
    ClientPortal.prototype._onMessage = function (msg, options, event) {
        var result = this.recieveMsg(msg, options);
        var response = JSON.stringify({
            id: msg.id,
            isResponse: true,
            data: result,
            action: msg.action,
        });
        // If there wasn't any action performed it means that the communication comes from
        // other library (seamless) it means that we shouldn't send response
        if (msg.action && msg.id)
            event.source.postMessage(response, '*');
    };
    ClientPortal.prototype._onResponse = function (msg) {
        if (!this._promiseResolveMap[msg.id])
            throw new Error('No callback was specified');
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
                if (styles.overflow === 'auto' || styles.overflowY === 'auto')
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
            scrollTop: window.scrollY,
        };
    };
    ClientPortal.prototype.recieveMsg = function (msg, options) {
        var action = msg.action;
        var data = msg.data;
        var result;
        switch (action) {
            case 'child-connected':
                var connectOptions = {
                    loginPage: options.loginPage || {},
                    navigation: options.navigation || {},
                    registration: options.registration || {},
                    calendarPage: options.calendarPage || {},
                    minHeight: options.minHeight,
                };
                this._sendData('parent-connected', connectOptions);
                if (!this._wasConnectedBefore) {
                    if (!options.forceUrl)
                        this.goTo(options.defaultState || 'Profile', options.defaultStateParams);
                    this._wasConnectedBefore = true;
                }
                options.onConnect && options.onConnect();
                break;
            case 'showLoadMask':
                if (!options.hideLoadMask && options.loadMask && !options.loadMask.disable) {
                    showLoadMask();
                }
                options.onShowLoadMask && options.onShowLoadMask();
                options.loadMask && options.loadMask.onShow && options.loadMask.onShow();
                break;
            case 'hideLoadMask':
                if (!options.hideLoadMask && options.loadMask && !options.loadMask.disable) {
                    hideLoadMask();
                }
                options.onHideLoadMask && options.onHideLoadMask();
                options.loadMask && options.loadMask.onHide && options.loadMask.onHide();
                break;
            case 'showModalOverlay':
                if (!options.hideModalOverlay || (options.modal && !options.modal.disableOverlay))
                    this._showModalOverlay();
                options.onShowModal && options.onShowModal();
                options.modal && options.modal.onShow && options.modal.onShow();
                result = this._getViewport(options);
                break;
            case 'hideModalOverlay':
                if (!options.hideModalOverlay || (options.modal && !options.modal.disableOverlay))
                    this._hideModalOverlay();
                options.onHideModal && options.onHideModal();
                options.modal && options.modal.onHide && options.modal.onHide();
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
                var offsetTop = this._getIframeTopOffset() - (options.topOffset || 0);
                if (document.body.scrollTop > offsetTop ||
                    document.documentElement.scrollTop > offsetTop) {
                    window.scroll({ top: offsetTop, left: 0, behavior: 'smooth' });
                }
                if (data.toState.name == 'Auth.Login')
                    this._forceResize();
                if (!options.enableVirtualStates && data.isVirtual)
                    break;
                options.onStateChangeSuccess && options.onStateChangeSuccess(data);
                break;
            case 'mobileDropdownOpen':
                options.onMobileDropdownOpen && options.onMobileDropdownOpen();
                options.modal && options.modal.onMobileOpen && options.modal.onMobileOpen();
                result = this._getViewport(options);
                break;
            case 'mobileDropdownClose':
                options.onMobileDropdownClose && options.onMobileDropdownClose();
                options.modal && options.modal.onMobileClose && options.modal.onMobileClose();
                break;
            case 'scrollWindow':
                var topOffset = this._getIframeTopOffset() - (options.topOffset || 0);
                if (options.onContentScroll) {
                    options.onContentScroll(data + offsetTop);
                }
                else {
                    window.scroll({ top: data + offsetTop, left: 0, behavior: 'smooth' });
                }
                break;
            case 'setCookieOnParent':
                this._setCookieOnParent();
                break;
        }
        return result;
    };
    ClientPortal.prototype._createModalOverlay = function () {
        var overlayEl = document.createElement('DIV');
        overlayEl.classList.add(this._modalOverlaySelector);
        return overlayEl;
    };
    ClientPortal.prototype._showModalOverlay = function () {
        var boundingRect = this._element.getBoundingClientRect();
        var bodyRect = document.body.getBoundingClientRect();
        var topOverlay = this._createModalOverlay();
        topOverlay.style.top = '-1000px';
        topOverlay.style.height = '1000px';
        var bottomOverlay = this._createModalOverlay();
        var bottomOverlayHeight = bodyRect.bottom - boundingRect.bottom;
        // todo: find out why -4 is needed
        bottomOverlay.style.bottom = (bottomOverlayHeight - 4) * -1 + 'px';
        bottomOverlay.style.height = bottomOverlayHeight + 'px';
        var leftOverlay = this._createModalOverlay();
        leftOverlay.style.top = topOverlay.style.top;
        leftOverlay.style.bottom = bottomOverlay.style.bottom;
        leftOverlay.style.left = bodyRect.left - boundingRect.left + 'px';
        leftOverlay.style.right = boundingRect.width + 'px';
        var rightOverlay = this._createModalOverlay();
        rightOverlay.style.top = topOverlay.style.top;
        rightOverlay.style.bottom = bottomOverlay.style.bottom;
        rightOverlay.style.left = boundingRect.width + 'px';
        rightOverlay.style.right = -(bodyRect.right - boundingRect.right) + 'px';
        if (!this._elementWrapper)
            return;
        this._elementWrapper.appendChild(topOverlay);
        this._elementWrapper.appendChild(bottomOverlay);
        this._elementWrapper.appendChild(leftOverlay);
        this._elementWrapper.appendChild(rightOverlay);
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
        var _this = this;
        var iframeElement = document.createElement('iframe');
        var language = options && options.language ? "&lang=".concat(options.language) : '';
        // iframeElement.setAttribute("sandbox", "allow-scripts allow-same-origin");
        var isMobile = window.innerWidth < 500 || window.innerHeight < 500;
        var mode = isMobile ? '?mode=mobile' : '?mode=desktop';
        var url = options.url;
        url = url[url.length - 1] === '/' ? url : url + '/';
        this._companyUrl = url;
        var defaultState = options.defaultState || 'Profile';
        var params = '?' + this._serializeParams(options.defaultStateParams) || 0;
        iframeElement.src =
            options.forceUrl || url + mode + language + '#/' + defaultState + params;
        iframeElement.style.border = 'none';
        iframeElement.style.width = '1px';
        iframeElement.style.maxWidth = '100%';
        iframeElement.style.minWidth = '100%';
        elementWrapper.appendChild(iframeElement);
        elementWrapper.classList.add(this._elementWrapperSelector);
        iframeElement.onload = function () {
            var topOffset = _this._getIframeTopOffset() - (options.topOffset || 0);
            window.scroll({ top: topOffset, left: 0, behavior: 'smooth' });
        };
        this._element = iframeElement;
        this._elementWrapper = elementWrapper;
    };
    ClientPortal.prototype._serializeParams = function (paramsObject) {
        var paramsString = '';
        for (var key in paramsObject) {
            if (paramsString != '') {
                paramsString += '&';
            }
            paramsString += key + '=' + encodeURIComponent(paramsObject[key]);
        }
        return paramsString;
    };
    // because of communication now library supports only one iframe support
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
                id: id,
            };
            _this._element.contentWindow.postMessage(JSON.stringify(msg), '*');
            _this._promiseResolveMap[id] = resolve;
        });
    };
    ClientPortal.prototype._setCookieOnParent = function () {
        var _this = this;
        var url = this._companyUrl + 'EmbedMode/SetCookie';
        var onClickAction = "window.open('" + url + "', '_blank');removeInput();";
        var cookieInputEl = document.createElement('input');
        cookieInputEl.setAttribute('onclick', onClickAction);
        cookieInputEl.style.position = 'absolute';
        cookieInputEl.style.top = '0';
        cookieInputEl.style.bottom = '0';
        cookieInputEl.style.left = '0';
        cookieInputEl.style.right = '0';
        cookieInputEl.style.width = '100%';
        cookieInputEl.style.opacity = '0.000001';
        this._elementWrapper.style.position = 'relative';
        this._elementWrapper.appendChild(cookieInputEl);
        window.removeInput = function () {
            _this._elementWrapper.removeChild(cookieInputEl);
            setTimeout(function () {
                _this._element.contentWindow.location.replace(_this._element.src);
            }, 300);
        };
    };
    ClientPortal.prototype._forceResize = function () {
        var element = this._element;
        element.style.height = '';
        element.iFrameResizer.resize();
    };
    ClientPortal.prototype.goTo = function (state, params) {
        var data = {
            state: state,
            params: params,
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
        ProfileFamily: 'Profile.Family',
    };
    return ClientPortal;
}());


})();

PerfectGym = __webpack_exports__;
/******/ })()
;