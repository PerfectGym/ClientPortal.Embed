
/* THIS IS DEMO */

import {ClientPortal, ClientPortalOptions} from "ClientPortal";


window.onload = function () {
    let userInfo;
    let options = {
        url: "http://pure.waw-parzyszek7.creadhoc.local/ClientPortal2",
        onConnect() {
            console.info('Connected to Client Portal');

            getUserData();
        },
        onStateChangeSuccess(data) {
            console.log('state change', data);
        },
        onUserLoggedIn(data) {
            var navigationElement = document.getElementById('page-header');

            navigationElement.classList.add('user-logged-in');
        },
        onUserLoggedOut(data) {
            var navigationElement = document.getElementById('page-header');

            navigationElement.classList.remove('user-logged-in');
        }
    };

    let element = document.getElementById('pg-client-portal');

    let CP;

    if (element instanceof HTMLElement) {
      CP = new ClientPortal(element, options);
      window.CP = CP;
      window.ClientPortal = ClientPortal;
    }

    getUserData = () => {
        CP.isUserLoggedIn()
            .then((data) => {
                console.log(data)
                var user = data.user;

                var navigationElement = document.getElementById('page-header');
                
                if (data.isAuthenticated) {
                    navigationElement.classList.add('.user-logged-inXXX');
                } else {
                    navigationElement.classList.remove('.user-logged-inXXX');
                }
            });

    }

    logout = () => {
        CP.logout()
            .then(() => {
                var userInfoElement = document.getElementById('user-name');

                if (userInfoElement) {
                    userInfoElement.innerText = "";
                }
            })
    }
}

