
/* THIS IS DEMO */

import {ClientPortal, ClientPortalOptions, ClientPortalUserInfo} from "./ClientPortal";


window.onload = function () {
    let userInfo: any;
    let options: ClientPortalOptions = {
        language: "en",
        url: "https://demo.perfectgym.pl/ClientPortal2/",
        defaultState: ClientPortal.State.Registration,
        defaultStateParams: {trainingModel: 'PayAsYouGo'},
        onConnect() {
            console.info('Connected to Client Portal')
        },
        onStateChangeSuccess(data) {
            console.log('state change', data);
        },
        onUserLoggedIn(data) {
            console.log('logged in', data)
        },
        onUserLoggedOut(data) {
            console.log('logged out', data)
        }
    };

    let element = document.getElementById('pg-client-portal');

    let CP:ClientPortal;

    if (element instanceof HTMLElement) {
      CP = new ClientPortal(element, options);
      (window as any).CP = CP;
      (window as any).ClientPortal = ClientPortal;
    }

    (window as any).getUserData = () => {
        CP.isUserLoggedIn()
            .then((data: any) => {
                var user: ClientPortalUserInfo = data.user;
                var userInfoElement = document.getElementById('user-name');

                userInfo = user;

                if (userInfoElement) {
                    userInfoElement.innerText = user.Email;
                }
            })
            .catch(() => {
                var userInfoElement = document.getElementById('user-name');
                if (userInfoElement) {
                    userInfoElement.innerText = "User not logged in";
                }
            });

    }

    (window as any).logout = () => {
        CP.logout()
            .then(() => {
                var userInfoElement = document.getElementById('user-name');

                if (userInfoElement) {
                    userInfoElement.innerText = "";
                }
            })
    }
}

