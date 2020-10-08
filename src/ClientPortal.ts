import './ClientPortal.less';

export interface ClientPortalStateInfo {
    auth: boolean;
    name: string;
    params: Object;
}

export interface ClientPortalChangeStateInfo {
    fromState: ClientPortalStateInfo;
    toState: ClientPortalStateInfo;
    isVirtual: boolean;
}

export interface ClientPortalUserInfo {
    FirstName: string;
    LastName: string;
    Email: string;
    HomeClubId: number;
    PhotoUrl: string;
    Type: string;
}

export interface ClientPortalAuthInfo {
    isAuthenticated: boolean;
    user: ClientPortalUserInfo;
}

export interface LoginViewOptions {
    navbar?: boolean;
    logo?: boolean;
    backgroundImage?: boolean;
}

export interface CalendarPageOptions {
    hideBookingIfNotLogged?: boolean;
    disableCourseEnrollment?: boolean;
}

export interface AfterLoginOptions {
    hide?: boolean;
    logo?: boolean;
}

export interface RegistrationOptions {
    logo?: boolean;
}

export interface LoadMaskOptions {
    // Decides whether to show default Client Portal load mask.
    disable?: boolean;
    // Decides whether to hide load mask on initializing iframe.
    disableOnInit?: boolean;
    // Callback fired when Client Portal normally shows load mask.
    onShow?: Function;
    // Callback fired when Client Portal normally hides load mask.
    onHide?: Function;
}

export interface ModalOptions {
    // Decides whether to show modal overlay layer on top and bottom of the iframe.
    // Overlay covers elements outside of iframe on parent element to focus user attention
    // on popups and other elements opened in Client Portal.
    disableOverlay: boolean;
    // Callback fired when Client Portal shows modal.
    onShow: Function;
    // Callback fired when Client Portal hides modal.
    onHide: Function;
    // Callback fired when dropdown opens on mobile mode.
    onMobileOpen: Function;
    // Callback fired when dropdown closes on mobile mode.
    onMobileClose: Function;
}

export interface ClientPortalOptions {
    /**
     * Client Portal application url.
     */
    url: string;

    /**
     * Url that will be loaded regarding `url`, `defaultState` and `defaultStateParams`.
     */
    forceUrl?: string;

    /**
     * First state showed to user after load. Unauthenticated users are redirected to ClientPortal.State.Login.
     */
    defaultState?: string;

    /**
     * State params from which client portal will be loaded.
     */
    defaultStateParams?: any;

    /**
     * Laguage code standarized by ISO 639-1
     */
    language?: string;

    /**
     * Min iframe height
     */
    minHeight: number;

    /**
     * Callback fired when iframe connects to Client Portal.
     */
    onConnect?(): void;

    /**
     * Callback fired when user logs in to Client Portal.
     */
    onUserLoggedIn?(data: ClientPortalAuthInfo): void;

    /**
     * Callback fired when user logs out from Client Portal.
     */
    onUserLoggedOut?(data: ClientPortalAuthInfo): void;

    /**
     * Callback fired when Client Portal finished transition to other state.
     */
    onStateChangeSuccess?(data: ClientPortalChangeStateInfo): void;

    /**
     * Some of Client Portal states are virtual - they shouldn't be added to browser history.
     * Setting this flag to true means that in onStateChangeSuccess() callback function
     * you will get object with property isVirtual which means that state is virtual.
     *
     * @default false
     */
    enableVirtualStates?: boolean;

    /**
     * If you have floating navigation which isn't pinned when page is scrolled to top then you needd to
     * define `topOffset` property with floating navigation height.
     */
    topOffset?: number;

    /**
     * Callback on content scroll.
     *
     * @returns ScrollTop value which normally would be used to scroll window object.
     */
    onContentScroll?(scrollTop: number): void;

    /**
     * login/register view.
     */
    loginPage?: LoginViewOptions;

    /**
     * calendar page view.
     */
    calendarPage?: CalendarPageOptions;

    /**
     * Views visible after user login options.
     */
    navigation?: AfterLoginOptions;

    /**
     * Registration options.
     */
    registration?: RegistrationOptions;

    /**
     * Load mask options.
     */
    loadMask?: LoadMaskOptions;

    /**
     * Modal options.
     */
    modal?: ModalOptions;

    // OPTIONS BELOW ARE DEPRECATED

    /**
     * Decides whether to show default Client Portal load mask.
     */
    hideLoadMask?: boolean;

    /**
     * Decides whether to hide load mask on initializing iframe.
     */
    hideInitLoadMask?: boolean;

    /**
     * Callback fired when Client Portal normally shows load mask.
     */
    onShowLoadMask?(): void;

    /**
     * Callback fired when Client Portal normally hides load mask.
     */
    onHideLoadMask?(): void;

    /**
     * Decides whether to show modal overlay layer on top and bottom of the iframe.
     * Overlay covers elements outside of iframe on parent element to focus user attention
     * on popups and other elements opened in Client Portal.
     */
    hideModalOverlay?: boolean;

    /**
     * Callback fired when Client Portal shows modal.
     */
    onShowModal?(): void;

    /**
     * Callback fired when Client Portal hides modal.
     */
    onHideModal?(): void;

    /**
     * Callback fired when dropdown opens on mobile mode.
     */
    onMobileDropdownOpen?(): void;

    /**
     * Callback fired when dropdown closes on mobile mode.
     */
    onMobileDropdownClose?(): void;
}

interface IConnectOptions {
    loginPage: LoginViewOptions;
    navigation: AfterLoginOptions;
    registration: RegistrationOptions;
    calendarPage: CalendarPageOptions;
    minHeight: number;
}

interface IframeMessage {
    isResponse: boolean;
    data: any;
    action: string;
    id: number;
}

let loadMaskEl: HTMLElement;
let iframeResize = (window as any).iFrameResize;

function addLoadMask() {
    if (loadMaskEl) return;

    let loadMaskSVG = `<svg class='cp-load-mask-spinner'
        width='65px'
        height='65px' viewBox='0 0 66 66' xmlns='http://www.w3.org/2000/svg'>
    <circle fill='none' stroke-width='6' stroke-linecap='round' cx='33' cy='33' r='30'></circle>
    </svg>`;
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

export class ClientPortal {
    // Client Portal iframe element
    private _element: HTMLIFrameElement;

    private _elementWrapper: HTMLElement;

    private _elementWrapperSelector: string = 'cp-iframe-wrapper';

    private _modalOverlaySelector: string = 'cp-modal-overlay';

    private _promiseResolveMap: any = {};

    private _wasConnectedBefore: boolean = false;

    private _companyUrl: string;

    public static readonly State = {
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

    constructor(wrapper: HTMLElement, options: ClientPortalOptions) {
        if (!options || !options.url) throw new Error('url is not defined');

        this._createIframe(wrapper, options);

        window.addEventListener('message', (event: MessageEvent) => {
            if (!event.data) return;

            // other liblaries has their own mechanism for parsing data which isn't compoatibile
            // with JSON.parse method if we cant parse message with json we can assume that this info
            // doesn't interest us
            let msg: IframeMessage;
            try {
                msg = JSON.parse(event.data);
            } catch (e) {
                return;
            }

            if (msg.isResponse) {
                this._onResponse(msg);
            } else {
                this._onMessage(msg, options, event);
            }
        });

        if (!options.hideLoadMask && options.loadMask && !options.loadMask.disable) {
            addLoadMask();
            if (!options.hideInitLoadMask && options.loadMask && options.loadMask.disableOnInit)
                showLoadMask();
        }

        let iframe = iframeResize(
            {
                checkOrigin: false,
                warningTimeout: 15000,
            },
            this._element
        );
    }

    private _onMessage(msg: IframeMessage, options: ClientPortalOptions, event: MessageEvent) {
        let result = this.recieveMsg(msg, options);

        let response = JSON.stringify({
            id: msg.id,
            isResponse: true,
            data: result,
            action: msg.action,
        });

        // If there wasn't any action performed it means that the communication comes from
        // other library (seamless) it means that we shouldn't send response
        if (msg.action && msg.id) (event.source.postMessage as any)(response, '*');
    }

    private _onResponse(msg: IframeMessage) {
        if (!this._promiseResolveMap[msg.id]) throw new Error('No callback was specified');

        this._promiseResolveMap[msg.id](msg.data);
        delete this._promiseResolveMap[msg.id];
    }

    private _getIframeTopOffset() {
        let elem = this._element as Element & HTMLElement;
        let offsetTop = elem.offsetTop;
        let offsetParent = elem.offsetParent;

        while (elem) {
            if (elem.clientHeight !== elem.scrollHeight) {
                // Additional if is needed bacause sometiome element's scrollHeight is larger than clientHeight
                // event if there isn't any scroll.
                // This situation can be observed when absolutely positioned child is added to an element.
                let styles = getComputedStyle(elem);
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
    }

    private _getViewport(options: ClientPortalOptions) {
        let boundingRect = this._element.getBoundingClientRect();

        return {
            navbarHeight: this._getIframeTopOffset(),
            top: boundingRect.top + window.scrollY,
            bottom: boundingRect.bottom,
            windowHeight: window.innerHeight,
            scrollTop: window.scrollY,
        };
    }

    private recieveMsg(msg: IframeMessage, options: ClientPortalOptions) {
        let action = msg.action;
        let data = msg.data;
        let result: any;

        switch (action) {
            case 'child-connected':
                var connectOptions: IConnectOptions = {
                    loginPage: options.loginPage || {},
                    navigation: options.navigation || {},
                    registration: options.registration || {},
                    calendarPage: options.calendarPage || {},
                    minHeight: options.minHeight,
                };

                this._sendData('parent-connected', connectOptions);
                if (!this._wasConnectedBefore) {
                    if (!(options as any).forceUrl)
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
                let offsetTop = this._getIframeTopOffset() - (options.topOffset || 0);
                if (
                    document.body.scrollTop > offsetTop ||
                    document.documentElement.scrollTop > offsetTop
                ) {
                    window.scroll({ top: offsetTop, left: 0, behavior: 'smooth' });
                }

                if (data.toState.name == 'Auth.Login') this._forceResize();

                if (!options.enableVirtualStates && data.isVirtual) break;
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
                let topOffset = this._getIframeTopOffset() - (options.topOffset || 0);
                if (options.onContentScroll) {
                    options.onContentScroll(data + offsetTop);
                } else {
                    window.scroll({ top: data + offsetTop, left: 0, behavior: 'smooth' });
                }
                break;
            case 'setCookieOnParent':
                this._setCookieOnParent();
                break;
        }

        return result;
    }

    private _createModalOverlay(): HTMLElement {
        let overlayEl: HTMLElement = document.createElement('DIV');
        overlayEl.classList.add(this._modalOverlaySelector);

        return overlayEl;
    }

    private _showModalOverlay() {
        let boundingRect = this._element.getBoundingClientRect();
        let bodyRect = document.body.getBoundingClientRect();

        let topOverlay = this._createModalOverlay();
        topOverlay.style.top = '-1000px';
        topOverlay.style.height = '1000px';

        let bottomOverlay = this._createModalOverlay();
        let bottomOverlayHeight: number = bodyRect.bottom - boundingRect.bottom;
        // todo: find out why -4 is needed
        bottomOverlay.style.bottom = (bottomOverlayHeight - 4) * -1 + 'px';
        bottomOverlay.style.height = bottomOverlayHeight + 'px';

        let leftOverlay = this._createModalOverlay();
        leftOverlay.style.top = topOverlay.style.top;
        leftOverlay.style.bottom = bottomOverlay.style.bottom;
        leftOverlay.style.left = bodyRect.left - boundingRect.left + 'px';
        leftOverlay.style.right = boundingRect.width + 'px';

        let rightOverlay = this._createModalOverlay();
        rightOverlay.style.top = topOverlay.style.top;
        rightOverlay.style.bottom = bottomOverlay.style.bottom;
        rightOverlay.style.left = boundingRect.width + 'px';
        rightOverlay.style.right = -(bodyRect.right - boundingRect.right) + 'px';

        if (!this._elementWrapper) return;
        this._elementWrapper.appendChild(topOverlay);
        this._elementWrapper.appendChild(bottomOverlay);
        this._elementWrapper.appendChild(leftOverlay);
        this._elementWrapper.appendChild(rightOverlay);
    }

    private _hideModalOverlay() {
        let parentElement = document.getElementsByClassName(
            this._elementWrapperSelector
        )[0] as HTMLElement;
        let overlayElements = document.getElementsByClassName(this._modalOverlaySelector);

        let len = overlayElements.length;
        for (let i = 0; i < len; i += 1) {
            parentElement.removeChild(overlayElements[0]);
        }
    }

    private _createIframe(elementWrapper: HTMLElement, options: ClientPortalOptions) {
        let iframeElement: HTMLIFrameElement = document.createElement('iframe');
        let language = options && options.language ? `&lang=${options.language}` : '';
        // iframeElement.setAttribute("sandbox", "allow-scripts allow-same-origin");
        let isMobile = window.innerWidth < 500 || window.innerHeight < 500;
        let mode = isMobile ? '?mode=mobile' : '?mode=desktop';

        let url = (options as any).url;
        url = url[url.length - 1] === '/' ? url : url + '/';
        this._companyUrl = url;

        let defaultState = (options as any).defaultState || 'Profile';

        let params = '?' + this._serializeParams(options.defaultStateParams) || '';

        iframeElement.src =
            (options as any).forceUrl || url + mode + language + '#/' + defaultState + params;

        iframeElement.style.border = 'none';
        iframeElement.style.width = '1px';
        iframeElement.style.maxWidth = '100%';
        iframeElement.style.minWidth = '100%';

        elementWrapper.appendChild(iframeElement);
        elementWrapper.classList.add(this._elementWrapperSelector);

        iframeElement.onload = () => {
            let topOffset = this._getIframeTopOffset() - (options.topOffset || 0);

            window.scroll({ top: topOffset, left: 0, behavior: 'smooth' });
        };

        this._element = iframeElement;
        this._elementWrapper = elementWrapper;
    }

    private _serializeParams(paramsObject: any) {
        let paramsString = '';
        for (let key in paramsObject) {
            if (paramsString != '') {
                paramsString += '&';
            }
            paramsString += key + '=' + encodeURIComponent(paramsObject[key]);
        }
        return paramsString;
    }

    // because of communication now library supports only one iframe support
    private _sendData(action: string, data?: any) {
        return new Promise((resolve: Function) => {
            let id = Math.round(Math.random() * 999999);

            while (this._promiseResolveMap[id]) id = Math.round(Math.random() * 999999);

            let msg = {
                isResponse: false,
                action,
                data,
                id,
            };

            this._element.contentWindow.postMessage(JSON.stringify(msg), '*');

            this._promiseResolveMap[id] = resolve;
        });
    }

    private _setCookieOnParent() {
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

        (window as any).removeInput = () => {
            this._elementWrapper.removeChild(cookieInputEl);
            setTimeout(() => {
                this._element.contentWindow.location.replace(this._element.src);
            }, 300);
        };
    }

    private _forceResize() {
        var element: any = this._element;

        element.style.height = '';
        element.iFrameResizer.resize();
    }

    public goTo(state: string, params?: Object) {
        let data = {
            state,
            params,
        };

        return this._sendData('goToState', data);
    }

    public logout() {
        return this._sendData('logout');
    }

    public changeLanguage(languageCode: string) {
        return this._sendData('changeLanguage', languageCode);
    }

    public isUserLoggedIn() {
        return this._sendData('isUserLogged');
    }

    public getElement(): HTMLIFrameElement {
        return this._element;
    }
}
