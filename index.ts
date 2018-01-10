
/* THIS IS DEMO */

import {ClientPortal, ClientPortalOptions, ClientPortalUserInfo} from "./ClientPortal";


window.onload = function () {
    let userInfo: any;
    let options: ClientPortalOptions = {
        url: "http://pure.waw-parzyszek7.creadhoc.local/ClientPortal2",
        onConnect() {
            console.info('Connected to Client Portal');

            (window as any).getUserData();
        },
        onStateChangeSuccess(data) {
            console.log('state change', data);
        },
        onUserLoggedIn(data) {
            var navigationElement = document.getElementById('page-navigation');

            navigationElement.classList.add('user-logged-in');
        },
        onUserLoggedOut(data) {
            var navigationElement = document.getElementById('page-navigation');

            navigationElement.classList.remove('user-logged-in');
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
                console.log(data)
                var user: ClientPortalUserInfo = data.user;

                var navigationElement = document.getElementById('page-navigation');
                
                if (data.isAuthenticated) {
                    navigationElement.classList.add('.user-logged-inXXX');
                } else {
                    navigationElement.classList.remove('.user-logged-inXXX');
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

