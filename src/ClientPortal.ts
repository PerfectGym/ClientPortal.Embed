
import "src/ClientPortal.less"

export interface ClientPortalStateInfo {
    auth: boolean,
    name: string,
    params: Object
}

export interface ClientPortalChangeStateInfo {
    fromState: ClientPortalStateInfo,
    toState: ClientPortalStateInfo,
    isVirtual: boolean
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

export interface ClientPortalOptions {
    /**
     * Client Portal application url.
     */
    url: string;

    /**
     * First state showed to user after load. Unauthenticated users are redirected to ClientPortal.State.Login.
     */
    defaultState?: string;

    /**
     * State params from which client portal will be loaded.
     */
    defaultStateParams?: any;

    /**
     * [DEPRECATED]
     * Navbar height in pixels.
     */
    // navbarHeight: number;

    /**
     * Laguage code standarized by ISO 639-1
     */
    language?: string;

    /**
     * Callback fired when iframe connects to Client Portal.
     */
    onConnect?(): void;

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
     * Callback fired when dropdown opens on mobile mode.
     */
    onMobileDropdownOpen?(): void;

    /**
     * Callback fired when dropdown closes on mobile mode.
     */
    onMobileDropdownClose?(): void;
    
    /**
     * Callback on content scroll.
     * 
     * @returns ScrollTop value which normally would be used to scroll window object. 
     */
    onContentScroll?(scrollTop: number): void;
}

interface IframeMessage {
    isResponse: boolean,
    data: any,
    action: string,
    id: number
}

let loadMaskEl: HTMLElement;
let iframeResize = (window as any).iFrameResize

function addLoadMask() {
    if (loadMaskEl)
        return;

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

    private _wasConnectedBefore:boolean = false;

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
        ProfileFamily: 'Profile.Family'
    }


    constructor(wrapper: HTMLElement, options : ClientPortalOptions) {
                if (!options || !options.url)
            throw new Error("url is not defined");

        this._createIframe(wrapper, options);

        window.addEventListener('message', (event: MessageEvent) => {
            if (!event.data)
                return;

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

        if (!options.hideLoadMask) {
            addLoadMask();
            if(!options.hideInitLoadMask)
                showLoadMask();
        }

        let iframe = iframeResize({
            checkOrigin: false,
            warningTimeout: 15000
        }, this._element);
    }

    private _onMessage(msg: IframeMessage, options: ClientPortalOptions, event: MessageEvent) {
        let result = this.recieveMsg(msg , options);
        
        let response = JSON.stringify({
            id: msg.id,
            isResponse: true,
            data: result,
            action: msg.action
        });

        // If there wasn't any action performed it means that the communication comes from 
        // other liblary (seamless) it means that we shouldn't send response
        if (msg.action && msg.id)
            event.source.postMessage(response, event.origin);
    }

    private _onResponse(msg: IframeMessage) {
        if (!this._promiseResolveMap[msg.id])
            throw new Error("No callback was specified");

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
    }

    private _getViewport(options: ClientPortalOptions) {
        let boundingRect = this._element.getBoundingClientRect();

        return {
            navbarHeight: this._getIframeTopOffset(),
            top: boundingRect.top + window.scrollY,
            bottom: boundingRect.bottom,
            windowHeight: window.innerHeight,
            scrollTop: window.scrollY
        }
    };

    private recieveMsg(msg: IframeMessage, options: ClientPortalOptions) {
        let action = msg.action;
        let data = msg.data;
        let result: any;

        switch(action)
        {
            case 'child-connected':
                this._sendData('parent-connected');
                if (!this._wasConnectedBefore) {
                  this.goTo(options.defaultState || "Profile", options.defaultStateParams);
                  this._wasConnectedBefore = true;
                }
                options.onConnect && options.onConnect();
                break;
            case 'showLoadMask':
                if(!options.hideLoadMask)
                    showLoadMask();
                options.onShowLoadMask && options.onShowLoadMask();
                break;
            case 'hideLoadMask':
                if(!options.hideLoadMask)
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
                let offsetTop = this._getIframeTopOffset();
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
                    options.onContentScroll(data + this._getIframeTopOffset());
                } else {
                    window.scroll({ top: data + this._getIframeTopOffset(), left: 0, behavior: 'smooth' });
                }
                break;
        }

        return result;
    }

    private _createModalOverlay(): HTMLElement {
        let overlayEl: HTMLElement = document.createElement("DIV");
        overlayEl.classList.add(this._modalOverlaySelector);

        return overlayEl;
    };

    private _showModalOverlay() {
        let boundingRect = this._element.getBoundingClientRect();
        let bodyRect = document.body.getBoundingClientRect();

        let topOverlay = this._createModalOverlay();
        topOverlay.style.top = '-1000px';
        topOverlay.style.height = '1000px';

        let bottomOverlay = this._createModalOverlay();
        let bottomOverlayHeight: number = (bodyRect.bottom - boundingRect.bottom);
        // todo: find out why -4 is needed
        bottomOverlay.style.bottom = (bottomOverlayHeight - 4) * -1 + 'px';
        bottomOverlay.style.height = bottomOverlayHeight + 'px';

        if (!this._elementWrapper)
            return;
        this._elementWrapper.appendChild(topOverlay);
        this._elementWrapper.appendChild(bottomOverlay);

    }

    private _hideModalOverlay() {
        let parentElement = document.getElementsByClassName(this._elementWrapperSelector)[0] as HTMLElement;
        let overlayElements = document.getElementsByClassName(this._modalOverlaySelector);

        let len = overlayElements.length;
        for (let i = 0; i < len; i += 1) {
          parentElement.removeChild(overlayElements[0]);
        }
    }

    private _createIframe(elementWrapper: HTMLElement, options: ClientPortalOptions) {
        let iframeElement: HTMLIFrameElement = document.createElement("iframe");
        let language = options && options.language ? `&lang=${options.language}` : "";
       // iframeElement.setAttribute("sandbox", "allow-scripts allow-same-origin");
        let isMobile = window.innerWidth < 500 || window.innerHeight < 500;
        let mode = isMobile ? '?mode=mobile' : '?mode=desktop';
        let url = (options as any).url;

        url = url[url.length-1] === "/" ? url : url + "/";
        let defaultState = (options as any).defaultState || "Profile";

        let params = '?' + this._serializeParams(options.defaultStateParams) || "";

        iframeElement.src = url + mode + language + '#/' + defaultState + params;

        iframeElement.style.width = '100%';
        iframeElement.style.border = 'none';

        elementWrapper.appendChild(iframeElement);
        elementWrapper.classList.add(this._elementWrapperSelector);

        this._element = iframeElement;
        this._elementWrapper = elementWrapper;
    }

    private _serializeParams(paramsObject: any) {
        let paramsString = "";
        for (let key in paramsObject) {
            if (paramsString != "") {
                paramsString += "&";
            }
            paramsString += key + "=" + encodeURIComponent(paramsObject[key]);
        }
        return paramsString;
    }

    // because of communication now liblary supports only one iframe support
    private _sendData(action: string, data?: any) {
        return new Promise((resolve: Function) => {
            let id = Math.round(Math.random() * 999999);

            while(this._promiseResolveMap[id])
                id = Math.round(Math.random() * 999999);

            let msg = {
                isResponse: false,
                action,
                data,
                id
            };

            this._element.contentWindow.postMessage(JSON.stringify(msg), '*');

            this._promiseResolveMap[id] = resolve;

        })
    }

    public goTo(state: string, params?: Object) {

        let data = {
            state,
            params
        }

        return this._sendData('goToState', data);
    }

    public logout() {
        return this._sendData('logout');
    }

    public changeLanguage(languageCode: string) {
        return this._sendData('changeLanguage', languageCode)
    }

    public isUserLoggedIn() {
        return this._sendData('isUserLogged');
    }

    public getElement():HTMLIFrameElement {
      return this._element;
    }
}
