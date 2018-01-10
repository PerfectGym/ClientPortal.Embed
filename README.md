

# Perfect Gym Client Portal Embed 
[![NPM version](https://badge.fury.io/js/perfect-gym-client-portal.svg)](http://badge.fury.io/js/iframe-resizer)
[![NPM Downloads](https://img.shields.io/npm/dt/perfect-gym-client-portal.svg)](https://www.npmjs.com/package/iframe-resizer)

This liblary is the best way for your company to embed PerfectGym's Client Portal on your site. It assumes that when embeding you want to use your own navigation. It provides a range of features which covers intergration needs:

* Changing states from your site.
* Showing loader on data load.
* Callbacks on authentication state changes.
* Callbacks on changing states.

## Installation:

Package can be installed via NPM

`npm install perfect-gym-client-portal`

## Getting started
The simplest way of embeding Client Portal on your site:

```js

import ClientPortal from "perfect-gym-client-portal";
or
var ClientPortal = window.PerfectGym.ClientPortal;

var clientPortalElement = document.getElementById('pg-client-portal');
var options = {
    url: "https://YOUR_COMPANY.perfectgym.com/ClientPortal2"
}

var embededClientPortal = new ClientPortal(clientPortalElement, options);

```

# API

## ClientPortal internal objects.

### ClientPortal.State

This state are used in ClientPortal.State object.

* Login
* Registration
* ClassesCalendar
* ClassesList
* PersonalTraining
* ReservedClasses
* Products
* BuyProducts
* ProfileEdit
* ProfileContract
* ProfileFreeze
* ProfilePrepaid
* ProfileChangePassword
* ProfilePayments
* ProfileFamily

## ClentPortal types

### ClientPortalAuthInfo

    isAuthenticated: boolean
    user: ClientPortalUserInfo

### ClientPortalUserInfo

    FirstName: string
    LastName: string
    Email: string
    HomeClubId: number
    PhotoUrl: string
    Type: string

### ClientPortalChangeStateInfo

    fromState: ClientPortalStateInfo
    toState: ClientPortalStateInfo
    isVirtual: boolean

### ClientPortalStateInfo

    auth: boolean
    name: string
    params: Object

## Options

Options which are passed to new ClientPortal constructor.

### url [REQUIRED]

    type: url

Client Portal application url. Correct url looks like: https://YOUR_COMPANY.perfectgym.com/ClientPortal2

### defaultState

    type: ClientPortal.State
    default: ClientPortal.State.Profile

First state showed to user after load. Unauthenticated users are redirected to ClientPortal.State.Login.

### defaultStateParams

    type: Object
    default: undefined

State params from with which Client Portal will be loaded.

### language

    type: string // Laguage code standarized by ISO 639-1
    default: '' // default Client Portal language

For list of avaliable languages in your company please contact PerfectGym support.

### onConnect() 

    type: function

Callback fired when iframe connects to Client Portal.

### hideLoadMask

    type: boolean
    dafault: false

Decides whether to show default Client Portal load mask.

### hideInitLoadMask
    
    type: boolean
    default: false

Decides whether to hide load mask on initializing iframe.

### onShowLoadMask()

Callback fired when Client Portal normally shows load mask.

### onHideLoadMask()

Callback fired when Client Portal normally hides load mask.

### hideModalOverlay

    type: boolean
    default: false

Decides whether to show modal overlay layer on top and bottom of the iframe. 

Overlay covers elements outside of iframe on parent element to focus user attention on popups and other elements opened in Client Portal.

### onShowModal()

    type: function

Callback fired when Client Portal shows modal (popup).

### onHideModal()

    type: function

Callback fired when Client Portal hides modal (popup).

### onUserLoggedIn(data)

    type: function
    params:
        data: {
            type: ClientPortalAuthInfo
        }

### onUserLoggedOut(data)

    type: function
    params:
        data: {
            type: ClientPortalAuthInfo
        }

### onStateChangeSuccess(data)

    type: function
    params:
        data: {
            type: ClientPortalChangeStateInfo
        }

### onMobileDropdownOpen()

Some dropdowns opens fullscreen on mobile mode. This callback fires when fullscreen dropdown opens on mobile mode.

### onMobileDropdownClose() 

Callback fires when fullscreen dropdown closes on mobile mode.

### onStateChangeSuccess(data)

    type: function
    params:
        data: {
            type: ClientPortalChangeStateInfo
        }

### onContentScroll(scrollTop)

    type: function
    params:
        scrollTop: {
            type: number
        }

This function is used to override default liblary scroll behaviour. `scrollTop` is scroll value which normally would be used to scroll parent page window.




## Methods

Metods can be used on embeded Client Portal object. All methods returns promise which is resolved on response from server.

### goTo(state)

Navigates through ClientPortal. States are held in 
`ClientPortal.State` object. 

Usage:

`CP = new ClientPortal(element, options)`

`CP.goTo(ClientPortal.State.Login)`

### logout()

    returns: Promise<>

Logouts user.

### changeLanguage(languageCode)

    params: {
        languageCode: {
            type: string //Laguage code standarized by ISO 639-1
        }
    }
    returns: Promise<>

Changes client portal language. For list of avaliable languages please contact PerfectGym support.

### isUserLoggedIn()

    returns: Promise<data: ClientPortalAuthInfo>

Returns info if user is authenticated.

### getElement() 

    returns: Promise<element: HTMLIFrameElement>

Returns iframe element.