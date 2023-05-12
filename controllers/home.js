window.addEventListener('load', () => {
    const bgs = document.getElementsByClassName('bgImages')[0];
    const bgImages = bgs.children;
    setInterval(() => {
        for (let i = 0; i < bgImages.length; i++) {
            if (bgImages[i].classList.contains('show')) {
                bgImages[i].classList.remove('show');
                if (i + 1 < bgImages.length) {
                    bgImages[i + 1].classList.add('show');
                } else {
                    bgImages[0].classList.add('show');
                }
                break;
            }
        }
    }, 5000)
})

document.addEventListener('contextProvided', () => {
    if (context.userSession) {
        if (context.userSession.accessLevel > 1) {
            document.getElementById('teacherLinks').style.display = 'block';
        } else {
            document.getElementById('teacherLinks').remove()
        }
        if (context.userSession.accessLevel > 3) {
            document.getElementById('adminLinks').style.display = 'block';
        } else {
            document.getElementById('adminLinks').remove()
        }
        const currrentHour = new Date().getHours();
        if (currrentHour < 12) {
            document.getElementById('home-greeting').innerHTML = `Good morning, ${context.userSession.firstName}.`;
        } else if (currrentHour < 18) {
            document.getElementById('home-greeting').innerHTML = `Good afternoon, ${context.userSession.firstName}.`;
        } else {
            document.getElementById('home-greeting').innerHTML = `Good evening, ${context.userSession.firstName}.`;
        }
    } else {
        window.location.href = '/Login.html';
    }
})