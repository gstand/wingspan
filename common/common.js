(async () => {
    const response = await fetch('common/api_manifest.php');
    const json = await response.json();
    globalThis.devmode = json.devmode;
    if (json.devmode) {
        const syntaxHighlight = (json) => {
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        }
        console.log('devmode enabled');
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/json-formatter-js';
        document.head.appendChild(script);
        script.onload = () => {
            document.addEventListener('contextProvided', () => {
                if (document.getElementById('modal-devmode')) {
                    document.getElementById('modal-devmode').remove();
                }
                if (document.getElementById('devmodeButton')) {
                    document.getElementById('devmodeButton').remove();
                }
                document.getElementById('UserIP').parentElement.removeAttribute('hidden')
                const devmodeModalHTML = `<div data-modal id="modal-devmode" class="bx--modal " role="dialog"
                aria-modal="true" aria-labelledby="modal-devmode-label" aria-describedby="modal-devmode-heading"
                tabindex="-1">
                    <div class="bx--modal-container">
                        <div class="bx--modal-header">
                            <p class="bx--modal-header__heading bx--type-beta" id="modal-devmode-heading">Page Context</p>
                            <button class="bx--modal-close" type="button" data-modal-close aria-label="close modal"
                                data-modal-primary-focus>
                                <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;"
                                    xmlns="http://www.w3.org/2000/svg" class="bx--modal-close__icon" width="16" height="16"
                                    viewBox="0 0 16 16" aria-hidden="true">
                                    <path d="M12 4.7L11.3 4 8 7.3 4.7 4 4 4.7 7.3 8 4 11.3 4.7 12 8 8.7 11.3 12 12 11.3 8.7 8z">
                                    </path>
                                </svg>
                            </button>
                        </div>
                        <div class="bx--modal-content" tabindex="0">
                            <div id="devModeJSONFormatter"></div>
                            <div class="bx--snippet bx--snippet--multi"
                                data-code-snippet>
                                <div class="bx--snippet-container"
                                    aria-label="Code Snippet Text">
                                    <pre><code id="devModeContextRaw"></code></pre>
                                </div>
                                <button data-copy-btn class="bx--copy-btn" type="button" tabindex="0">
                                    <span class="bx--assistive-text bx--copy-btn__feedback">Copied!</span>
                                    <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;"
                                        xmlns="http://www.w3.org/2000/svg" class="bx--snippet__icon" width="16" height="16"
                                        viewBox="0 0 16 16" aria-hidden="true">
                                        <path
                                            d="M14,5v9H5V5h9m0-1H5A1,1,0,0,0,4,5v9a1,1,0,0,0,1,1h9a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1Z">
                                        </path>
                                        <path d="M2,9H1V2A1,1,0,0,1,2,1H9V2H2Z"></path>
                                    </svg>
                                </button>
                                <button
                                    class="bx--btn bx--btn--ghost bx--btn--sm bx--snippet-btn--expand"
                                    type="button">
                                    <span class="bx--snippet-btn--text" data-show-more-text="Show more"
                                        data-show-less-text="Show less">Show
                                        more</span>
                                    <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;"
                                        xmlns="http://www.w3.org/2000/svg" aria-label="Show more icon"
                                        class="bx--icon-chevron--down bx--snippet__icon" width="16" height="16" viewBox="0 0 16 16"
                                        role="img">
                                        <path d="M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="bx--modal-content--overflow-indicator"></div>
                    </div>
                    <span tabindex="0"></span>
                </div>`
                const devmodeModal = new DOMParser().parseFromString(devmodeModalHTML, 'text/html').body.firstChild;
                document.body.appendChild(devmodeModal);
                const formatter = new JSONFormatter(context, 1, { "theme": document.querySelector(":root").getAttribute('theme') == 'g100' ? "dark" : "light" });
                const contextString = syntaxHighlight(JSON.stringify(context, null, 2));
                document.getElementById('devModeContextRaw').innerHTML = contextString;
                document.getElementById('devModeJSONFormatter').appendChild(formatter.render());
                const devmodeModalButtonHTML = `<button
                class="bx--btn bx--btn--primary bx--btn--icon-only bx--tooltip__trigger bx--tooltip--a11y bx--tooltip--bottom bx--tooltip--align-center  bx--btn--sm" data-modal-target="#modal-devmode" id="devmodeButton">
                    <span class="bx--assistive-text">Page context</span>
                    <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--btn__icon" width="16" height="16" viewBox="0 0 32 32" aria-hidden="true">
                    <polygon points="18.83 26 21.41 23.42 20 22 16 26 20 30 21.42 28.59 18.83 26" />
                    <polygon points="27.17 26 24.59 28.58 26 30 30 26 26 22 24.58 23.41 27.17 26" />
                    <path d="M14,28H8V4h8v6a2.0058,2.0058,0,0,0,2,2h6v6h2V10a.9092.9092,0,0,0-.3-.7l-7-7A.9087.9087,0,0,0,18,2H8A2.0058,2.0058,0,0,0,6,4V28a2.0058,2.0058,0,0,0,2,2h6ZM18,4.4,23.6,10H18Z" />
                    </svg>
                </button>`
                const devmodeModalButton = new DOMParser().parseFromString(devmodeModalButtonHTML, 'text/html').body.firstChild;
                document.querySelector('.bottomControls').appendChild(devmodeModalButton);
            })
        }
    }
})();

CarbonComponents.settings.disableAutoInit = false;
CarbonComponents.watch();

document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.id = 'progress-bar';
    const progressBarValue = document.createElement('div');
    progressBarValue.className = 'progress-bar-value';
    progressBar.appendChild(progressBarValue);
    document.body.prepend(progressBar);
});

window.addEventListener("beforeunload",() => {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.id = 'progress-bar';
    const progressBarValue = document.createElement('div');
    progressBarValue.className = 'progress-bar-value';
    progressBar.appendChild(progressBarValue);
    document.body.prepend(progressBar);
});
window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
        document.getElementById('progress-bar').remove();
    }
})

// const apiManifest = await (async () => {
//     const response = await fetch('common/api_manifest.php', {
//         method: 'POST',
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded"
//         },
//         data: "user=" + encodeURIComponent(document.getElementById('username').value) + "&pass=" + encodeURIComponent(document.getElementById('password').value)
//     });
//     const data = await response.json();
//     return data;
// })() // fetch() can burn in hell 
// globalThis.apiManifest = apiManifest;

globalThis.context = {};

globalThis.contextProvided = new Event('contextProvided', {
    bubbles: true,
    cancelable: true,
    composed: true
});

globalThis.contextComplete = new Event('contextComplete', {
    bubbles: true,
    cancelable: true,
    composed: true
});

globalThis.loadContext = (context) => {
    globalThis.context = context;
    document.dispatchEvent(contextProvided);
}

globalThis.getJSON = (url) => {
    return (async (url) => {
        const response = await (async () => {
            const response = await fetch(
                url);
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            const json = await response.json();
            return json;
        })()
        return response;
    })(url)
}

const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const theme = getCookie('theme');
const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
if (darkThemeMq.matches && theme === '') {
    document.querySelector(':root').setAttribute('theme', 'g100');
} else if (!darkThemeMq.matches && theme === '') {
    document.querySelector(':root').setAttribute('theme', 'white');
} else if (theme !== '') {
    document.querySelector(':root').setAttribute('theme', theme);
}

const throwContextError = (errorText = 'Unknown error') => {
    const notifHTML = `<div data-notification
  class="bx--inline-notification bx--inline-notification--error"
  role="alert">
  <div class="bx--inline-notification__details">
    <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z"></path><path d="M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z" data-icon-path="inner-path" opacity="0"></path></svg>
    <div class="bx--inline-notification__text-wrapper">
      <p class="bx--inline-notification__title">Error</p>
      <p class="bx--inline-notification__subtitle">There was an error fetching your current page data. This can be caused by a variety of issues; which may include network issues, authentication issues, or et cetera. Try reloading the page, signing out and signing back in, and if issues persist, contact us here. Error details: ${errorText} </p> <!--TODO: actually add this form(?) or whatever it'll be--> 
    </div>
  </div>
</div>`
    const notif = new DOMParser().parseFromString(notifHTML, 'text/html').body.firstChild;
    document.body.appendChild(notif);
    document.getElementById('progress-bar').classList.add('error')
}
globalThis.throwContextError = throwContextError;

const getUserSession = async () => {
    const response = await fetch('//' + window.location.host + '/scripts/php/userSessionWS.php');
    const json = await response.json();
    if (response.status !== 200) {
        if (json && json.code === 'unauthenticated') {
            window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href.replace(window.location.origin, ''));
        } else {
            throwContextError("Error getting user session, details in console.");
            throw new Error('HTTP error ' + response.status);
        }
    }
    globalThis.context.userSession = json;
}
globalThis.getUserSession = getUserSession;

document.addEventListener('contextProvided', () => {
    if (context.userSession) {
        if (document.getElementById('commonHeader')) {
            if (context.userSession.accessLevel > 1) {
                document.getElementById('teacherMenuHeader').style.display = 'block';
            } else {
                document.getElementById('teacherMenuHeader').remove()
            }
            if (context.userSession.accessLevel > 3) {
                document.getElementById('adminMenuHeader').style.display = 'block';
            } else {
                document.getElementById('adminMenuHeader').remove()
            }
        }
        if (document.getElementById('switcher-user')) {
            document.getElementById('UserInformaton').innerHTML = `<strong>${context.userSession.firstName} ${context.userSession.lastName}</strong> (${context.userSession.userName})`;
            document.getElementById('UserRole').innerHTML = context.userSession.accessLevel > 3 ? 'Admin' : context.userSession.accessLevel > 1 ? 'Teacher' : 'Student';
            document.getElementById('UserIP').innerHTML = context.userSession.myIpAddress;
        }
        if (document.getElementById('navigation-menu-left')) {
            if (context.userSession.accessLevel > 1) {
                document.getElementById('teacherMenuSide').style.display = 'block';
            } else {
                document.getElementById('teacherMenuSide').remove()
            }
            if (context.userSession.accessLevel > 3) {
                document.getElementById('adminMenuSide').style.display = 'block';
            } else {
                document.getElementById('adminMenuSide').remove()
            }
        }
    } else {
        debugger
        window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href.replace(window.location.origin, ''));
    }
})

// since some pages have dynamically rendered content and watched with CC, the watch has to be initalized before *any* components are rendered or they just... don't work
// this aims to fix that issue with the page frame, creating a custom element that pretty much initalizes the header and handles initialization of its CC handlers and et cetera
// also helpful as it gets rid of the massive brick of header code in every page
class CommonHeader extends HTMLElement {
    connectedCallback() {
        const theme = getCookie('theme');
        if (theme) {
            document.querySelector('html').setAttribute('theme', theme);
        }
        this.innerHTML = `
<header class="bx--header" role="banner" aria-label="Innovation Academy Events" data-header id="commonHeader">
    <a class="bx--skip-to-content" href="#bx--content" tabindex="0">Skip to main content</a>
    <button class="bx--header__menu-trigger bx--header__action IAE--topnavMenu" aria-label="Open menu"
        title="Open menu"
        data-navigation-menu-panel-label-expand="Open menu" data-navigation-menu-panel-label-collapse="Close menu"
        data-navigation-menu-target="#navigation-menu-left">
        <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;"
            xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="bx--navigation-menu-panel-collapse-icon"
            width="20" height="20" viewBox="0 0 32 32">
            <path
                d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z">
            </path>
        </svg>
        <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;"
            xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="bx--navigation-menu-panel-expand-icon"
            width="20" height="20" viewBox="0 0 20 20">
            <path d="M2 14.8H18V16H2zM2 11.2H18V12.399999999999999H2zM2 7.6H18V8.799999999999999H2zM2 4H18V5.2H2z">
            </path>
        </svg>
    </button>
    <a class="bx--header__name" href="index.html" title="">
        <span class="bx--header__name--prefix">
            Innovation Academy
            &nbsp;
        </span>
        [Events]
    </a>
    <nav class="bx--header__nav" aria-label="IA Events" data-header-nav>
        <ul class="bx--header__menu-bar" aria-label="IA Events">
            <li>
                <a class="bx--header__menu-item" href="EventPass.html" tabindex="0">
                    Your schedule
                </a>
            </li>
            <li>
                <a class="bx--header__menu-item" href="EventRegister.html" tabindex="0">
                    Register
                </a>
            </li>
            <li class="bx--header__submenu" data-header-submenu id="teacherMenuHeader">
                <a class="bx--header__menu-item bx--header__menu-title" aria-haspopup="true"
                    href="javascript:void(0)" tabindex="0">
                    Teacher
                    <svg class="bx--header__menu-arrow" width="12" height="7" aria-hidden="true">
                        <path d="M6.002 5.55L11.27 0l.726.685L6.003 7 0 .685.726 0z" />
                    </svg>
                </a>
                <ul class="bx--header__menu" aria-label="L1 link 3">
                    <li role="none">
                        <a class="bx--header__menu-item" href="EventOwner.html" tabindex="-1">
                            <span class="bx--text-truncate--end">
                                Your events
                            </span>
                        </a>
                    </li>
                </ul>
            </li>
            <li class="bx--header__submenu" data-header-submenu id="adminMenuHeader">
                <a class="bx--header__menu-item bx--header__menu-title" aria-haspopup="true"
                    aria-expanded="false" href="javascript:void(0)" tabindex="0">
                    Admin
                    <svg class="bx--header__menu-arrow" width="12" height="7" aria-hidden="true">
                        <path d="M6.002 5.55L11.27 0l.726.685L6.003 7 0 .685.726 0z" />
                    </svg>
                </a>
                <ul class="bx--header__menu" aria-label="L1 link 4">
                    <li role="none">
                        <a class="bx--header__menu-item" href="EventList.html" tabindex="-1">
                            <span class="bx--text-truncate--end">
                                Event List
                            </span>
                        </a>
                    </li>
                    <li role="none">
                        <a class="bx--header__menu-item" href="javascript:void(0)" tabindex="-1">
                            <span class="bx--text-truncate--end">
                                See User
                            </span>
                        </a>
                    </li>
                    <li role="none">
                        <a class="bx--header__menu-item" href="javascript:void(0)" tabindex="-1">
                            <span class="bx--text-truncate--end">
                                Add Users
                            </span>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
    <div class="bx--header__global">
        <button class="bx--header__menu-trigger bx--header__action" aria-label="User Menu"
            title="User Menu" data-navigation-menu-panel-label-expand="User Menu"
            data-navigation-menu-panel-label-collapse="Close menu"
            data-product-switcher-target="#switcher-user">
            <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;"
                xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="bx--navigation-menu-panel-expand-icon"
                width="20" height="20" viewBox="0 0 32 32">
                <defs>
                    <style>
                        .cls-1 {
                            fill: none;
                        }
                    </style>
                </defs>
                <path id="_inner-path_" data-name="&lt;inner-path&gt;" class="cls-1"
                    d="M8.0071,24.93A4.9958,4.9958,0,0,1,13,20h6a4.9959,4.9959,0,0,1,4.9929,4.93,11.94,11.94,0,0,1-15.9858,0ZM20.5,12.5A4.5,4.5,0,1,1,16,8,4.5,4.5,0,0,1,20.5,12.5Z" />
                <path
                    d="M26.7489,24.93A13.9893,13.9893,0,1,0,2,16a13.899,13.899,0,0,0,3.2511,8.93l-.02.0166c.07.0845.15.1567.2222.2392.09.1036.1864.2.28.3008.28.3033.5674.5952.87.87.0915.0831.1864.1612.28.2417.32.2759.6484.5372.99.7813.0441.0312.0832.0693.1276.1006v-.0127a13.9011,13.9011,0,0,0,16,0V27.48c.0444-.0313.0835-.0694.1276-.1006.3412-.2441.67-.5054.99-.7813.0936-.08.1885-.1586.28-.2417.3025-.2749.59-.5668.87-.87.0933-.1006.1894-.1972.28-.3008.0719-.0825.1522-.1547.2222-.2392ZM16,8a4.5,4.5,0,1,1-4.5,4.5A4.5,4.5,0,0,1,16,8ZM8.0071,24.93A4.9957,4.9957,0,0,1,13,20h6a4.9958,4.9958,0,0,1,4.9929,4.93,11.94,11.94,0,0,1-15.9858,0Z" />
                <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1"
                    width="32" height="32" />
            </svg>
            <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;"
                xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                class="bx--navigation-menu-panel-collapse-icon" width="20" height="20" viewBox="0 0 32 32">
                <path
                    d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z">
                </path>
            </svg>
        </button>
    </div>
</header>
<div class="bx--navigation" id="navigation-menu-left" hidden data-navigation-menu>
    <!--!!!MAKE SURE THIS LINES UP WITH .bx--header__menu-bar!!!-->
    <div class="bx--navigation-section">
        <ul class="bx--navigation-items">
            <li class="bx--navigation-item bx--navigation-item--icon">
                <a class="bx--navigation-link" href="javascript:void(0)">
                    <div class="bx--navigation-icon">
                    <svg version="1.1" id="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    width="20" height="20" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
               <path d="M26,4h-4V2h-2v2h-8V2h-2v2H6C4.9,4,4,4.9,4,6v20c0,1.1,0.9,2,2,2h20c1.1,0,2-0.9,2-2V6C28,4.9,27.1,4,26,4z M26,26H6V12h20 V26z M26,10H6V6h4v2h2V6h8v2h2V6h4V10z" style="fill: white;"/>
               </svg>               
                    </div>
                    Your schedule
                </a>
            </li>
            <li class="bx--navigation-item bx--navigation-item--icon">
                <a class="bx--navigation-link" href="javascript:void(0)">
                    <div class="bx--navigation-icon">
                    <svg version="1.1" id="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" width="20" height="20">
                    <polygon points="30,22 24,22 24,16 22,16 22,22 16,22 16,24 22,24 22,30 24,30 24,24 30,24 		" style="fill: white;"/>
                    <path d="M28,6c0-1.1-0.9-2-2-2h-4V2h-2v2h-8V2h-2v2H6C4.9,4,4,4.9,4,6v20c0,1.1,0.9,2,2,2h8v-2H6V6h4v2h2V6h8v2h2V6h4v8h2V6z" style="fill: white;"/>
                </svg>
                    </div>
                    Register
                </a>
            </li>
            <li class="bx--navigation-item bx--navigation-item--icon" id="teacherMenuSide">
                <div class="bx--navigation__category">
                    <button class="bx--navigation__category-toggle" aria-haspopup="true" aria-expanded="false"
                        aria-controls="category-1-menu">
                        <div class="bx--navigation-icon">
                        <svg id="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
                        <path d="M16,22a4,4,0,1,0-4-4A4,4,0,0,0,16,22Zm0-6a2,2,0,1,1-2,2A2,2,0,0,1,16,16Z" style="fill: white;"/>
                        <rect x="14" y="6" width="4" height="2" style="fill: white;"/>
                        <path
                            d="M24,2H8A2.002,2.002,0,0,0,6,4V28a2.0023,2.0023,0,0,0,2,2H24a2.0027,2.0027,0,0,0,2-2V4A2.0023,2.0023,0,0,0,24,2ZM20,28H12V26a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Zm2,0V26a3,3,0,0,0-3-3H13a3,3,0,0,0-3,3v2H8V4H24V28Z" style="fill: white;"/>
                    </svg>
                        </div>
                        <div class="bx--navigation__category-title">
                            Teacher
                            <svg aria-hidden="true" width="20" height="20" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32 32">
                                <path d="M16 22L6 12l1.414-1.414L16 19.172l8.586-8.586L26 12 16 22z" />
                            </svg>
                        </div>
                    </button>
                    <ul id="category-1-menu" class="bx--navigation__category-items">
                        <li class="bx--navigation__category-item">
                            <a class="bx--navigation-link" href="javascript:void(0)">
                                Your events
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            <li class="bx--navigation-item bx--navigation-item--icon" id="adminMenuSide">
                <div class="bx--navigation__category">
                    <button class="bx--navigation__category-toggle" aria-haspopup="true" aria-expanded="false"
                        aria-controls="category-1-menu">
                        <div class="bx--navigation-icon">
                        <svg id="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
                        <path d="M16,22a4,4,0,1,0-4-4A4,4,0,0,0,16,22Zm0-6a2,2,0,1,1-2,2A2,2,0,0,1,16,16Z" style="fill: white;"/>
                        <rect x="14" y="6" width="4" height="2" style="fill: white;"/>
                        <path
                            d="M24,2H8A2.002,2.002,0,0,0,6,4V28a2.0023,2.0023,0,0,0,2,2H24a2.0027,2.0027,0,0,0,2-2V4A2.0023,2.0023,0,0,0,24,2ZM20,28H12V26a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Zm2,0V26a3,3,0,0,0-3-3H13a3,3,0,0,0-3,3v2H8V4H24V28Z" style="fill: white;"/>
                    </svg>
                        </div>
                        <div class="bx--navigation__category-title">
                            Admin
                            <svg aria-hidden="true" width="20" height="20" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32 32">
                                <path d="M16 22L6 12l1.414-1.414L16 19.172l8.586-8.586L26 12 16 22z" />
                            </svg>
                        </div>
                    </button>
                    <ul id="category-1-menu" class="bx--navigation__category-items">
                        <li class="bx--navigation__category-item">
                            <a class="bx--navigation-link" href="javascript:void(0)">
                                Event List
                            </a>
                        </li>
                        <li
                            class="bx--navigation__category-item">
                            <a class="bx--navigation-link" href="javascript:void(0)">
                                See User
                            </a>
                        </li>
                        <li class="bx--navigation__category-item">
                            <a class="bx--navigation-link" href="javascript:void(0)">
                                Add Users
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
</div>
<aside class="bx--panel--overlay" id="switcher-user" data-product-switcher>
    <div class="bx--product-switcher user-container">
        <h5>
            <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" width="16"
                height="16" viewBox="0 0 32 32" style="fill:white;position: relative;top: 2px;">
                <defs>
                    <style>
                        .cls-1 {
                            fill: none;
                        }
                    </style>
                </defs>
                <path id="_inner-path_" data-name="&lt;inner-path&gt;" class="cls-1"
                    d="M8.0071,24.93A4.9958,4.9958,0,0,1,13,20h6a4.9959,4.9959,0,0,1,4.9929,4.93,11.94,11.94,0,0,1-15.9858,0ZM20.5,12.5A4.5,4.5,0,1,1,16,8,4.5,4.5,0,0,1,20.5,12.5Z" />
                <path
                    d="M26.7489,24.93A13.9893,13.9893,0,1,0,2,16a13.899,13.899,0,0,0,3.2511,8.93l-.02.0166c.07.0845.15.1567.2222.2392.09.1036.1864.2.28.3008.28.3033.5674.5952.87.87.0915.0831.1864.1612.28.2417.32.2759.6484.5372.99.7813.0441.0312.0832.0693.1276.1006v-.0127a13.9011,13.9011,0,0,0,16,0V27.48c.0444-.0313.0835-.0694.1276-.1006.3412-.2441.67-.5054.99-.7813.0936-.08.1885-.1586.28-.2417.3025-.2749.59-.5668.87-.87.0933-.1006.1894-.1972.28-.3008.0719-.0825.1522-.1547.2222-.2392ZM16,8a4.5,4.5,0,1,1-4.5,4.5A4.5,4.5,0,0,1,16,8ZM8.0071,24.93A4.9957,4.9957,0,0,1,13,20h6a4.9958,4.9958,0,0,1,4.9929,4.93,11.94,11.94,0,0,1-15.9858,0Z" />
                <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1"
                    width="32" height="32" />
            </svg>
            User Information
        </h5>
        <p>You are signed in as:</p>
        <p id="UserInformaton"></p>
        <p>Role: <strong id="UserRole"></strong></p>
        <p hidden>IP: <strong id="UserIP"></strong></p>
        <button aria-label="Log out" tabindex="0" class="bx--btn--secondary" onclick="window.location.href = 'Login.html?action=logout&redirect=${encodeURIComponent(window.location.href.replace(window.location.origin, ''))}'">
            Log out
        </button>
        <div class="bottomControls">
            <div class="bx--form-item">
                <input class="bx--toggle-input bx--toggle-input--small" id="appearanceToggle" type="checkbox" ${document.querySelector(':root').getAttribute('theme') == 'g100' ? 'checked' : ''}>
                <label class="bx--toggle-input__label" for="appearanceToggle">
                    Appearance
                    <span class="bx--toggle__switch">
                        <span class="bx--toggle__text--off" aria-hidden="true">Light</span>
                        <span class="bx--toggle__text--on" aria-hidden="true">Dark</span>
                    </span>
                </label>
            </div>
        </div>
    </div>
</aside>`
        this.header = CarbonComponents.HeaderNav.init()
        this.leftNav = CarbonComponents.NavigationMenu.init()
        this.userSwitcher = CarbonComponents.ProductSwitcher.init()
        document.getElementById('appearanceToggle').addEventListener('change', () => {
            if (document.getElementById('appearanceToggle').checked) {
                document.querySelector(':root').setAttribute('theme', 'g100');
            } else {
                document.querySelector(':root').setAttribute('theme', 'white');
            }
            setCookie('theme', document.querySelector(':root').attributes['theme'].value, 365);
        });
        this.classList.add('bx--header')
    }
    disconnectedCallback() {
        this.header.release();
        this.leftNav.release();
        this.userSwitcher.release();
    }
}
customElements.define('common-header', CommonHeader)

class ContextTag extends HTMLElement {
    connectedCallback() {
        this.style.display = 'none';
        const contextObject = JSON.parse(this.innerHTML.replace('\\', ''));
        // document.addEventListener('contextProvided', () => {
        //     console.log('All event listeners should be done')
        // });
        loadContext(contextObject);
    }
}
window.addEventListener('load', () => { customElements.define('page-context', ContextTag) });