

# `Perfect` Gym Client Portal Embed 
[![npm version](https://badge.fury.io/js/%40perfectgym%2Fclient-portal.svg)](https://badge.fury.io/js/%40perfectgym%2Fclient-portal)
[![NPM Downloads](https://img.shields.io/npm/dt/@perfectgym/client-portal.svg)](https://www.npmjs.com/package/@perfectgym/client-portal)

This library is the best way for your company to embed PerfectGym's Client Portal on your site. It provides a range of features which covers intergration needs:

* Navigating from your site.
* Showing loader on data load.
* Callbacks on user log in/out.
* Callbacks on changing states.
* Cookies support on safari.
* Has TypeScript support.

[See demo](https://perfectgym.github.io/ClientPortal.Embed/)

[Calendar embeding demo](https://perfectgym.github.io/ClientPortal.Embed/calendar)

## `Embeding` tips

Embeded Client Portal has transparent background, basic brandings looks best on grey/blurred image background.
To maintain best responsivenes it is recommended to set your Embeded Client Portal width to full page width. 

## `The` simplest way of embeding Client Portal on your site

1. Copy `ClientPortal.min.js` and `ClientPortal.css` files from [ClientPortal.Embed GitHub page](https://github.com/davidjbradshaw/iframe-resizer)  to `/libs` folder on your site.

2. Copy `iframeResizer.min.js` file from [iframe-resizer GitHub page](https://github.com/davidjbradshaw/iframe-resizer/tree/master/js) to `/libs` folder on your site.

3. At the end of `<head>` add:

```html 

<link rel="stylesheet" href="libs/ClientPortal.css"></link>

```

4. At the end of `<body>` tag add:

```html

<script src="libs/iframeResizer.min.js"></script>
<script src="libs/ClientPortal.min.js"></script>
<script>
    window.onload = function () {
        var ClientPortal = window.PerfectGym.ClientPortal;

        // element to which ClientPortal will be appended
        var clientPortalElement = document.getElementById('pg-client-portal');
        var options = {
            url: "CLIENT_PORTAL_URL"
        }

        var embededClientPortal = new ClientPortal(clientPortalElement, options);
    }
</script>

```

5. Reload your page

[Click to find demo code](https://github.com/PerfectGym/ClientPortal.Embed/tree/master/docs) which presents simple embeding Client Portal with own navigation.


## `Installation`

Package can be installed via NPM.

`npm install @perfectgym/client-portal`

It requires [iframe-resizer](https://github.com/davidjbradshaw/iframe-resizer) as dependency.

### `Using`

```js

import ClientPortal from "@perfectgym/client-portal";

// element to which ClientPortal will be appended
var clientPortalElement = document.getElementById('pg-client-portal');
var options = {
    url: "CLIENT_PORTAL_URL"
}

var embededClientPortal = new ClientPortal(clientPortalElement, options);

```

# `API`

API section covers:

1. Constructior options [Core Options](#core-options)
2. Methods
3. Data types

# `Options`

Options object must be passed passed to new ClientPortal constructor. `url` parameter is required. The rest are optional.

```js

var options = {
    url: "CLIENT_PORTAL_URL"
}

new ClientPortal(clientPortalElement, options);

```

## `Core Options`

### `url` [REQUIRED]

* type: string 

Client Portal application url. If Client Portal is hosted on PerfectGym domain correct url looks like: `https://CLUB_NAME.perfectgym.pl/ClientPortal2/`

&nbsp;

### `defaultState`

* type: ClientPortal.State
* default: ClientPortal.State.Profile

First state showed to user after load. Unauthenticated users are redirected to ClientPortal.State.Login.

### `defaultStateParams`

* type: Object
* default: undefined

State params from with which Client Portal will be loaded.

### `language`

* type: string // Laguage code standarized by ISO 639-1

If `language` option is not set Client Portal tries to use user's browser language. If browser language is not supported by Club's Client Portal then language is set to default Client Portal language.
For list of avaliable languages in your company please contact PerfectGym support.

### `onConnect` 

* type: function()

Callback fired when iframe connects to Client Portal.

### `onUserLoggedIn`

* type: function(authInfo: ClientPortalAuthInfo)

Callback fires when user logs in to Client Portal. 

### `onUserLoggedOut`

* type: function(authInfo: ClientPortalAuthInfo)

Callback fires when user logs out from Client Portal. 

### `onStateChangeSuccess`

* type: function(stateInfo: ClientPortalChangeStateInfo)

Callback fires on state (view) change.

### `onContentScroll`

 * type: function(scrollTop: number)

This function is used to override default library scroll behaviour. `scrollTop` is scroll value which normally would be used to scroll parent page window.

***

## `calendarPage` options

### `hideBookingIfNotLogged`
    * type: boolean
    * default: false

Hides "Book now" button on calendar when user is not logged. This function is usefull when you want to elmbed only calendar on your site.

***

## `loginPage` options

``` 
var options = {
    url: "CLIENT_PORTAL_URL",
    loginPage: {
        navbar: true,
        logo: true
    }
}

var embededClientPortal = new ClientPortal(clientPortalElement, options);

```

Object helpful in customizing login page.

### `navbar`
    * type: boolean
    * default: true

Show header.

### `logo`
    * type: boolean
    * default: true

Show logo in header.

***

## `navigation` options

``` 
var options = {
    url: "CLIENT_PORTAL_URL",
    navigation: {
        navbar: true,
        logo: true
    }
}

var embededClientPortal = new ClientPortal(clientPortalElement, options);
```

Options responsible for customizing navigation visible after user logs in.

### `navbar`
    * type: boolean
    * default: true

Show navbar.

### `logo`
    * type: boolean
    * default: true

***

## `registration` options
``` 
var options = {
    url: "CLIENT_PORTAL_URL",
    registration: {
        logo: true
    }
}

var embededClientPortal = new ClientPortal(clientPortalElement, options);
```

Options responsible for customizing registration.

### `logo`
    * type: boolean
    * default: true

***

## `loadMask` options
``` 
var options = {
    url: "CLIENT_PORTAL_URL",
    loadMask: {
        disable: true,
        onShow: () => { console.log('show my load mask')},
        onHide: () => { console.log('hide my load mask')}
    }
}

var embededClientPortal = new ClientPortal(clientPortalElement, options);
```

Options responsible for customizing load mask.

<!-- ### `hideLoadMask` -->
### `disable`

 * type: boolean
 * default: false

Decides whether to show default Client Portal load mask. Load mask shows when Client Portal is requesting server data or on view change.
If changed to true you should use `onShow()` and `onHide()` options to show load mask on your site preventing user from making actions in ClientPortal.

<!-- ### `hideInitLoadMask` -->
### `disableOnInit`
    
 * type: boolean
 * default: false

Decides whether to hide load mask on initializing iframe.

<!-- ### `onShowLoadMask` -->
### `onShow`

* type: function()

Callback fired when Client Portal normally shows load mask.

<!-- ### `onHideLoadMask` -->
### `onHide`

* type: function()

Callback fired when Client Portal normally hides load mask.


***

## `modal` options
``` 
var options = {
    url: "CLIENT_PORTAL_URL",
    modal: {
        disableOverlay: false
    }
}

var embededClientPortal = new ClientPortal(clientPortalElement, options);
```

<!-- ### `hideModalOverlay` -->
### `disableOverlay`

* type: boolean
* default: false

Decides whether to show modal overlay layer on top and bottom of the iframe. 

Overlay covers elements outside of iframe on parent element to focus user attention on popups and other elements opened in Client Portal.

If set to false dark overlay will be used only on elements inside modal.
If you would like to use your own overlay use `onShow()` and `onHide()` callback options.


<!-- ### `onShowModal` -->
### `onShow`

* type: function()

Callback when Client Portal shows modal (popup).

### `onHide`

* type: function()

Callback fires when Client Portal hides modal (popup).


### `onMobileOpen`

* type: function()

Some dropdowns opens only on mobile mode. This callback fires when fullscreen dropdown opens on mobile mode.

<!-- ### `onMobileDropdownClose`  -->
### `onMobileClose` 

* type: function()

Callback fires when dropdown opened only on mobile mode closes.

***


## `Methods`

Metods can be used on embeded Client Portal object. All methods returns promise which is resolved on response from server.

### `goTo`

 * type: function(state: ClientPortal.State)
 * returns: Promise<>

Navigates through ClientPortal. States are held in 
`ClientPortal.State` object. 

Usage:
 ```js
var CP = new ClientPortal(element, options)

CP.goTo(ClientPortal.State.Login)
```

### `logout`
 
 * type: function(state: ClientPortal.State)
 * returns: Promise<>

Logouts user.

### `changeLanguage`

 * type: function(languageCode: string)
 * returns: Promise<>

Changes client portal language.

Laguage code is a two letters string standarized by ISO 639-1.

### `isUserLoggedIn`

* type: function()
* returns: Promise<authInfo: ClientPortalAuthInfo>

Returns info if user is authenticated.

### `getElement`
    
* type: function()
* returns: Promise<element: HTMLIFrameElement>

Returns iframe element.

## `Clent` Portal types

Types listed below are used as retrun types or parameters in options and methods. 

### `ClientPortal`.State

Can be used in implementing own navigation, using goTo() method.

```js

CP.goTo(ClientPortal.State.<STATE_FROM_LIST_BELOW>)

```

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

### `ClientPortalAuthInfo`

```js
{
    isAuthenticated: boolean,
    user: ClientPortalUserInfo
}
```

### `ClientPortalUserInfo`

```js
{
    FirstName: string,
    LastName: string,
    Email: string,
    HomeClubId: number,
    PhotoUrl: string,
    Type: string
}
```

### `ClientPortalChangeStateInfo`

```js
{
    fromState: ClientPortalStateInfo,
    toState: ClientPortalStateInfo,
    isVirtual: boolean
}
```

### `ClientPortalStateInfo`

```js
{
    auth: boolean,
    name: string,
    params: Object //depends on current view
}
```
