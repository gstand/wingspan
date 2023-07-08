// #region jsdoc typedefs and et cetera
/** 
 * @typedef {Object} LoginStatus
 * @property {boolean} okay
 * @property {string} [error]
 * @property {string} [code]
 * @property {string} [redirectTo]
 * @typedef {Object} LoginResponse
 * @property {string} message
 * @property {string} [code]
 * @property {string} [redirectPage]
 */
// #endregion

let loggingIn = false;
CarbonComponents.HeaderNav.init();
window.addEventListener('load', async () => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    if (action === 'logout') {
        const loadingHTML = `
        <div class="bx--loading-overlay" id='logoutProgress'>
        <div data-loading="" class="bx--loading" id="loadingWheel">
        <svg class="bx--loading__svg" viewBox="-75 -75 150 150">
            <title>Loading</title>
            <circle class="bx--loading__stroke" cx="0" cy="0" r="37.5"></circle>
        </svg>
        </div>
            <strong id="loadingMessage">Signing you out...</strong>
        </div>`
        const loadingElement = new DOMParser().parseFromString(loadingHTML, 'text/html').body.firstChild;
        document.body.prepend(loadingElement);
        const logoutResponse = await fetch('//' + window.location.host + '/scripts/php/loginWs.php?action=login')
        try {
            var json = await logoutResponse.json();
        } catch (e) {
            document.getElementById('loadingWheel').remove();
            document.getElementById('loadingMessage').innerText = 'An error occurred while signing you out. Please clear your browser cookies to sign out, or try again later.';
            throw e;
        }
        if (logoutResponse.ok) {
            document.getElementById('logoutProgress').remove();
            const notifHTML = `<div data-notification
            class="bx--inline-notification bx--inline-notification--success"
            role="alert">
            <div class="bx--inline-notification__details">
              <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10,1c-4.9,0-9,4.1-9,9s4.1,9,9,9s9-4,9-9S15,1,10,1z M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z"></path><path fill="none" d="M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z" data-icon-path="inner-path" opacity="0"></path></svg>
              <div class="bx--inline-notification__text-wrapper">
                <p class="bx--inline-notification__title">Logout successful</p>
                <p class="bx--inline-notification__subtitle">You have been logged out successfully. You can now safely close this browser tab, or log back in.</p>
              </div>
            </div>
            <button data-notification-btn class="bx--inline-notification__close-button" type="button"
              aria-label="close">
              <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__close-icon" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z"></path></svg>
            </button>
          </div>`
            const notif = new DOMParser().parseFromString(notifHTML, 'text/html').body.firstChild;
            document.body.appendChild(notif);
        } else {
            document.getElementById('loadingWheel').remove();
            document.getElementById('loadingMessage').innerText = 'An error occurred while signing you out. Please clear your browser cookies to sign out, or try again later.';
        }
    }
    document.getElementById('progress-bar').remove();
    const theme = getCookie('theme');
    if (theme == 'g100') {
        document.getElementById('appearanceToggle').classList.remove("light");
        document.getElementById('appearanceToggle').classList.remove("system");
        document.getElementById('appearanceToggle').classList.add("dark");
        document.getElementById('appearanceToggle').setAttribute('aria-label', 'Enable light mode');
        document.getElementById('appearanceToggle').setAttribute('title', 'Enable light mode');
        document.getElementById('appearanceToggle').setAttribute('data-navigation-menu-panel-label-expand', 'Enable light mode');
    } else if (theme == 'white') {
        document.getElementById('appearanceToggle').classList.remove("dark");
        document.getElementById('appearanceToggle').classList.remove("system");
        document.getElementById('appearanceToggle').classList.add("light");
        document.getElementById('appearanceToggle').setAttribute('aria-label', 'Enable dark mode');
        document.getElementById('appearanceToggle').setAttribute('title', 'Enable dark mode');
        document.getElementById('appearanceToggle').setAttribute('data-navigation-menu-panel-label-expand', 'Enable dark mode');
    } else if (theme == '') {
        document.getElementById('appearanceToggle').classList.remove("dark");
        document.getElementById('appearanceToggle').classList.remove("light");
        document.getElementById('appearanceToggle').classList.add("system");
        document.getElementById('appearanceToggle').setAttribute('aria-label', 'System theme');
        document.getElementById('appearanceToggle').setAttribute('title', 'System theme');
        document.getElementById('appearanceToggle').setAttribute('data-navigation-menu-panel-label-expand', 'System theme');
    }
    document.getElementById('appearanceToggle').addEventListener('click', () => {
        if (document.getElementById('appearanceToggle').classList.contains('system') || document.getElementById('appearanceToggle').classList.contains('light')) {
            document.querySelector(':root').setAttribute('theme', 'g100');
        } else {
            document.querySelector(':root').setAttribute('theme', 'white');
        }
        setCookie('theme', document.querySelector(':root').attributes['theme'].value, 365);
        const theme = document.querySelector(':root').attributes['theme'].value;
        if (theme == 'g100') {
            document.getElementById('appearanceToggle').classList.remove("light");
            document.getElementById('appearanceToggle').classList.remove("system");
            document.getElementById('appearanceToggle').classList.add("dark");
            document.getElementById('appearanceToggle').setAttribute('aria-label', 'Enable light mode');
            document.getElementById('appearanceToggle').setAttribute('title', 'Enable light mode');
            document.getElementById('appearanceToggle').setAttribute('data-navigation-menu-panel-label-expand', 'Enable light mode');
        } else if (theme == 'white') {
            document.getElementById('appearanceToggle').classList.remove("dark");
            document.getElementById('appearanceToggle').classList.remove("system");
            document.getElementById('appearanceToggle').classList.add("light");
            document.getElementById('appearanceToggle').setAttribute('aria-label', 'Enable dark mode');
            document.getElementById('appearanceToggle').setAttribute('title', 'Enable dark mode');
            document.getElementById('appearanceToggle').setAttribute('data-navigation-menu-panel-label-expand', 'Enable dark mode');
        } else if (theme == '') {
            document.getElementById('appearanceToggle').classList.remove("dark");
            document.getElementById('appearanceToggle').classList.remove("light");
            document.getElementById('appearanceToggle').classList.add("system");
            document.getElementById('appearanceToggle').setAttribute('aria-label', 'System theme');
            document.getElementById('appearanceToggle').setAttribute('title', 'System theme');
            document.getElementById('appearanceToggle').setAttribute('data-navigation-menu-panel-label-expand', 'System theme');
        }
    });
    const nextPage = () => {
        document.getElementById('step1').classList.remove('middle');
        document.getElementById('step1').classList.add('left');
        document.getElementById('username').tabIndex = -1;
        document.getElementById('password').removeAttribute('tabindex');
    }
    globalThis.nextPage = nextPage;
    const prevPage = () => {
        document.getElementById('username').removeAttribute('tabindex');
        document.getElementById('password').tabIndex = -1;
        document.getElementById('loginSubtitle').classList.remove('show');
        document.getElementById('step1').classList.remove('left');
        document.getElementById('step1').classList.add('middle');
    }
    globalThis.prevPage = prevPage;
    document.getElementById('username').addEventListener('keyup', (e) => {if (e.key === 'Enter' || e.keyCode === 13) {verifyUsername()}})
    document.getElementById('usernameContinue').addEventListener('click', verifyUsername);
    document.getElementById('password').addEventListener('keyup', (e) => {if (e.key === 'Enter' || e.keyCode === 13) {login(e)}});
    document.getElementById('loginButton').addEventListener('click', login);
})
window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
        window.location.reload();
    }
})

const login = async (e) => {
    loggingIn = true;
    document.getElementById('password').parentElement.removeAttribute('data-invalid');
    if (document.getElementById('password').value.length > 0) {
        document.getElementById('loginButtonContainer').classList.add('load');
        /** @type {LoginStatus} */
        let login;
        const response = await fetch('//' + window.location.host + '/scripts/php/loginWs.php?action=login' + (document.getElementById('persist').checked ? '&persist=yes' : ''), {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "user=" + encodeURIComponent(document.getElementById('username').value) + "&pass=" + encodeURIComponent(document.getElementById('password').value)
        });
        /** @type {LoginResponse} */
        const data = await response.json();
        // if (response.ok === false) {
        //     login = {"okay": false, "error": "Network error", "code": "network"};
        // } else
        if (response.status === 200) {
            login = {"okay": true, "redirectTo": data.redirectPage};
        } else if (response.status === 422) {
            login = {"okay": false, "error": data.message, "code": data.code};
        } else {
            login = {"okay": false, "error": "Unknown error", "code": "unknown"};
        }
        if (login.okay === true) {
            document.querySelector('#loading .bx--inline-loading__text[data-inline-loading-text-active]').setAttribute('hidden', '');
            document.querySelector('#loading .bx--inline-loading__text[data-inline-loading-text-finished]').removeAttribute('hidden');
            let i = 3;
            setInterval(() => {
                i = i - 1;
                if (i === 0) {
                    document.querySelector('#loading .bx--inline-loading__text[data-inline-loading-text-finished]').innerHTML = 'Login successful. Redirecting now...';
                    const params = new URLSearchParams(window.location.search);
                    if (params.has('redirect')) {
                        window.location.href = params.get('redirect');
                    } else {
                        window.location.href = login.redirectTo;
                    }
                } else {
                    document.querySelector('#loading .bx--inline-loading__text[data-inline-loading-text-finished]').innerHTML = 'Login successful. Redirecting in ' + i + ' seconds...';
                }
            }, 1000);
        } else {
            document.getElementById('loginButtonContainer').classList.remove('load');
            if (login.code === 'noUser') {
                prevPage();
                document.getElementById('username').parentElement.setAttribute('data-invalid', 'true');
                document.getElementById('userError').innerHTML = login.error;
            } else {
                document.getElementById('password').parentElement.setAttribute('data-invalid', 'true');
                document.getElementById('passError').innerHTML = login.error;
            }
        }
    } else {
        loggingIn = false;
        document.getElementById('password').parentElement.setAttribute('data-invalid', 'true');
        document.getElementById('passError').innerHTML = 'Password is required';
    }
}

const verifyUsername = () => {
    document.getElementById('username').parentElement.removeAttribute('data-invalid');
    if (document.getElementById('username').value.length > 0) {
        document.getElementById('step1').classList.remove('middle');
        document.getElementById('step1').classList.add('left');
        document.getElementById('password').focus();
        document.getElementById('loginSubtitle').innerHTML = 'You are signing in as ' + document.getElementById('username').value + '. <a href="#" onclick="prevPage()">Not you?</a>';
        document.getElementById('loginSubtitle').classList.add('show');
    } else {
        document.getElementById('username').setAttribute('data-invalid', 'true');
        document.getElementById('userError').innerHTML = 'Username is required';
    }
}