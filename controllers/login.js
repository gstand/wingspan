CarbonComponents.HeaderNav.init();
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('LoginWait').style.display = 'block';
    }, 500);
    setTimeout(() => {
        document.getElementById('LoginWait').style.zIndex = 'unset';
    }, 1750);
    // document.getElementById('login').addEventListener('click', () => {
    //     document.getElementById('LoginWait').classList.remove('login-phase_hidden')
    //     document.getElementById('LoginWait').classList.add('login-phase_current')
    //     setTimeout(() => {
    //         document.getElementById('LoginForm').submit();
    //     }, 500);
    // })
    document.getElementById('LoginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('LoginWait').classList.remove('login-phase_hidden')
        document.getElementById('LoginWait').classList.add('login-phase_current')
        setTimeout(() => {
            e.target.submit();
        }, 500);
    })
})
window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
        window.location.reload();
    }
})