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
window.addEventListener('load', () => {
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
    }
    globalThis.nextPage = nextPage;
    const prevPage = () => {
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
        const response = await fetch('//' + window.location.host + '/scripts/php/loginWs.php?action=login', {
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
        document.getElementById('loginSubtitle').innerHTML = 'You are signing in as ' + document.getElementById('username').value + '. <a href="#" onclick="prevPage()">Not you?</a>';
        document.getElementById('loginSubtitle').classList.add('show');
    } else {
        document.getElementById('username').setAttribute('data-invalid', 'true');
        document.getElementById('userError').innerHTML = 'Username is required';
    }
}