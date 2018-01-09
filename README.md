

# Client Portal 1.0.0

## Installation:
`npm install seamless` 

`npm install client-portal`

## Documentation
```js
var options = {
    language: "en"
}

var element = document.getElementById('pg-client-portal');

window['CP'] = new ClientPortal(element, options);
```

## Methods


### goTo(state)

Navigates through ClientPortal. States are held in 
`ClientPortal.State` object. 

Usage:

`CP = new ClientPortal(element, options)`

`CP.goTo(ClientPortal.State.Login)`

Avaliable states:

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

### logout()

Logouts user.

### getUser()

Gets user data.

### changeLanguage(languageCode)

Changes client portal language. For list of avaliable languages please contact 

### isUserAuthenticated()

Returns info if user is authenticated.