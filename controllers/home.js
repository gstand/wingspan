// window.addEventListener('load', () => {
//     document.querySelector('.bx--body').setAttribute('bg-img', 1)
//     setInterval(() => {
//         if (document.querySelector('.bx--body').getAttribute('bg-img') == 4) {
//             document.querySelector('.bx--body').setAttribute('bg-img', 1)
//         } else {
//             document.querySelector('.bx--body').setAttribute('bg-img', Number(document.querySelector('.bx--body').getAttribute('bg-img')) + 1)
//         }
//     }, 10000)
// })

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