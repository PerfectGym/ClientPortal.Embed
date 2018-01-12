
/* THIS IS SIMPLE DEMO */

window.onload = function () {
    var ClientPortal = PerfectGym.ClientPortal;

    var options = {
        url: "https://presentation.perfectgym.pl/ClientPortal2/",
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

    window.getUserData = () => {
        CP.isUserLoggedIn()
            .then((data) => {
                var navigationElement = document.getElementById('page-header');
                
                if (data.isAuthenticated) {
                    navigationElement.classList.add('.user-logged-in');
                } else {
                    navigationElement.classList.remove('.user-logged-in');
                }
            });

    }

    window.logout = () => {
        CP.logout()
            .then(() => {
                var navigationElement = document.getElementById('page-header');
                
                navigationElement.classList.remove('.user-logged-in');
            })
    }

    window.goTo = (stateName, params) => {
        CP.goTo(ClientPortal.State[stateName], params)
    }
}

