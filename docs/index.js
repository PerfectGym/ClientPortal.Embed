
/* THIS IS SIMPLE DEMO */

window.onload = function () {
    var ClientPortal = PerfectGym.ClientPortal;

    var options = {
        url: "https://presentation.perfectgym.pl/ClientPortal2/",
        loginPage: {
            navbar: false,
            image: true
        },
        navigation: {
            navbar: false
        },
        registration: {
            logo: false
        },
        calendarPage: {
            hideBookingIfNotLogged: true
        },
        
        onConnect() {
            console.info('Connected to Client Portal');

            window.getUserData();
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

    var element = document.getElementById('pg-client-portal');

    if (element instanceof HTMLElement) {
        var CP = new ClientPortal(element, options);
    }

    window.getUserData = function() {
        CP.isUserLoggedIn()
            .then(function(data) {
                var navigationElement = document.getElementById('page-header');

                if (data.isAuthenticated) {
                    navigationElement.classList.add('.user-logged-in');
                } else {
                    navigationElement.classList.remove('.user-logged-in');
                }
            });

    }

    window.logout = function() {
        CP.logout()
            .then(function() {
                var navigationElement = document.getElementById('page-header');

                navigationElement.classList.remove('.user-logged-in');
            })
    }

    window.goTo = function(stateName, params) {
        CP.goTo(ClientPortal.State[stateName], params)
    }

    var burger = document.querySelector('.burger img');
    var mobileList = document.querySelector('.mobile-list');

    burger.addEventListener('click', function () {
        if (mobileList.classList.contains('hidden')) {
            mobileList.classList.remove('hidden');
        } else {
            mobileList.classList.add('hidden');
        }
    })

    var links = document.querySelectorAll('.mobile-list .nav-link');

    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function () {
            mobileList.classList.add('hidden');
        })
    }
}