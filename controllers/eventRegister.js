import { ClassWatcher } from "../common/modules.js";

let signupProgressComponent;
let selectedTeacher;
let tutoringTeachers = [];
let pages = [];
let selectedPage = 0;
let hideIneligible = true;
let selections = []

window.addEventListener('load', async () => {
    await getUserSession();
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id');
    if (!eventId) {
        throwContextError("No event ID provided in URL.");
        throw new Error('No event ID provided');
    }
    const response = await fetch('//' + window.location.host + '/scripts/php/eventWs.php?id=' + eventId);
    try {
        var json = await response.json();
    } catch (error) {
        throwContextError('Error parsing JSON response from server. Event might not exist, see issue #.'); // TODO: issue #
        throw error;
    }
    if (response.status !== 200) {
        if (json && json.code === 'unauthenticated') {
            window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href.replace(window.location.origin, ''));
            throw new Error('Unauthenticated, redirecting to login');
        } else {
            throwContextError('HTTP error when fetching event data: ' + response.status + ' ' + response.statusText);
            throw new Error('HTTP error ' + response.status);
        }
    }
    globalThis.context.myEvent = json;
    document.dispatchEvent(contextProvided);
    document.getElementById('progress-bar').remove();
})

globalThis.EventRegister__handleTeacherSelection = (teacherID, sessionID, page) => {
    const tutoringRow = document.getElementById(`tutorRow-${sessionID}`);
    tutoringRow.children[0].firstElementChild.firstElementChild.value = teacherID;
    tutoringRow.children[4].innerText = tutoringTeachers.find((teacher) => teacher.id == teacherID).attendees + '/' + tutoringTeachers.find((teacher) => teacher.id == teacherID).limit;
    if (tutoringRow.children[0].firstElementChild.firstElementChild.checked) {
        EventRegister__updateSessionWorkshop(teacherID, sessionID);
    }
}

globalThis.EventRegister__updateSessionWorkshop = (workshopID, sessionID, page) => {
    const oldSelection = selections[page];
    selections[page] = context.myEvent.sessions.find((session) => session.id == sessionID).workshops.find((workshop) => workshop.id == workshopID).name
    if (selections[page] === 'Check Out Early') {
        for (let index = context.myEvent.sessions.length - 1; index > page; index--) {
            const session = context.myEvent.sessions[index];
            const checkOutEarlyWS = session.workshops.find((workshop) => workshop.name === 'Check Out Early');
            if (checkOutEarlyWS) {
                EventRegister__updateSessionWorkshop(checkOutEarlyWS.id, session.id, index);
                document.getElementById(`radio-button-${session.id}-${checkOutEarlyWS.id}`).checked = true;
            }
            const notCheckOutEarlyWS = session.workshops.filter((workshop) => workshop.name !== 'Check Out Early');
            if (notCheckOutEarlyWS.length > 0) {
                notCheckOutEarlyWS.forEach((workshop) => {
                    document.getElementById(`radio-button-${session.id}-${workshop.id}`).disabled = true;
                    document.getElementById(`radio-button-${session.id}-${workshop.id}`).nextElementSibling.firstElementChild.title = 'You cannot select this workshop because you have selected Check Out Early before this session.';
                })
            }
            document.getElementById(`Selector-Session${session.id}`).classList.remove('bx--progress-step--disabled');
            document.getElementById(`Selector-Session${session.id}`).classList.remove('bx--progress-step--incomplete');
            document.getElementById(`Selector-Session${session.id}`).classList.add('bx--progress-step--complete');
        }
    } else if (oldSelection === 'Check In Late') {
        for (let index = page; index < context.myEvent.sessions.length; index++) {
            if (selections[index] === 'Check In Late') {
                const session = context.myEvent.sessions[index];
                const checkInLateWS = session.workshops.find((workshop) => workshop.name === 'Check In Late');
                document.getElementById(`radio-button-${session.id}-${checkInLateWS.id}`).checked = false;
                document.getElementById(`radio-button-${session.id}-${checkInLateWS.id}`).disabled = true;
                document.getElementById(`radio-button-${session.id}-${checkInLateWS.id}`).nextElementSibling.firstElementChild.title = 'You cannot select this workshop because you have selected Check In Late and/or another workshop before this session. Select another workshop or select Check In Late for the previous session.';
                selections[index] = undefined;
                if (index !== page) {
                    document.getElementById(`Selector-Session${session.id}`).classList.remove('bx--progress-step--complete');
                    document.getElementById(`Selector-Session${session.id}`).classList.add('bx--progress-step--incomplete');
                    document.getElementById(`Selector-Session${session.id}`).querySelector('.bx--progress-optional').innerText = '';
                }
                if (index > page + 1) {
                    document.getElementById(`Selector-Session${session.id}`).classList.add('bx--progress-step--disabled');
                }
            }
        }
    }
    const progressStep = document.getElementById(`Selector-Session${sessionID}`);
    document.getElementById('pageNext').classList.remove('bx--btn--disabled');
    document.getElementById('pageNext').disabled = false;
    document.getElementById('pageNext').title = '';
    progressStep.querySelector('.bx--progress-optional').innerText = context.myEvent.sessions.find((session) => session.id == sessionID).workshops.find((workshop) => workshop.id == workshopID).name;
    if (progressStep.classList.contains('bx--progress-step--incomplete')) {
        progressStep.classList.remove('bx--progress-step--incomplete');
        progressStep.classList.add('bx--progress-step--complete');
    }
    if (progressStep.nextSibling.classList.contains('.bx--progress-step--disabled')) {
        progressStep.nextSibling.classList.remove('.bx--progress-step--disabled');
    }
}

const __setSelectedProgress = (step) => {
    const progressSteps = document.querySelectorAll('.bx--progress-step');
    progressSteps.forEach((step) => {
        step.classList.remove('bx--progress-step--current');
    });
    progressSteps[step].classList.add('bx--progress-step--current');
}

const handleNext = () => {
    if (selectedPage < pages.length - 1) {
        pages[selectedPage].classList.remove('show');
        selectedPage++;
        const pageSelection = document.querySelector(`input[type=radio][name=${pages[selectedPage].id.replace("-", "_")}]:checked`);
        pages[selectedPage].classList.add('show');
        if (selectedPage == pages.length - 1) {
            document.getElementById('pageNext').removeEventListener('click', handleNext);
            document.getElementById('pageNext').addEventListener('click', handleSubmit);
            document.getElementById('pageNext').innerHTML = `Submit<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;"
            xmlns="http://www.w3.org/2000/svg" class="bx--btn__icon" width="16" height="16" viewBox="0 0 32 32"
            aria-hidden="true">
            <defs>
    <style>
      .cls-1 {
        fill: none;
      }
    </style>
  </defs>
  <polygon points="13 24 4 15 5.414 13.586 13 21.171 26.586 7.586 28 9 13 24"/>
  <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"/>
        </svg>`;
        } else if (pageSelection === null) {
            document.getElementById('pageNext').classList.add('bx--btn--disabled');
            document.getElementById('pageNext').disabled = true;
            document.getElementById('pageNext').title = 'You must select a workshop before continuing.';
        } else if (selectedPage === 0 || selectedPage === pages.length - 1 || pageSelection !== null) {
            document.getElementById('pageNext').classList.remove('bx--btn--disabled');
            document.getElementById('pageNext').disabled = false;
            document.getElementById('pageNext').title = '';
        }
        if (selectedPage < pages.length - 1 && selectedPage > 0) {
            const selectionIndex = selectedPage - 1;
            const session_id = context.myEvent.sessions[selectionIndex].id;
            const checkInLateWSID = context.myEvent.sessions[selectionIndex].workshops.find((workshop) => workshop.name == 'Check In Late');
            const checkOutEarlyWS = context.myEvent.sessions[selectionIndex].workshops.find((workshop) => workshop.name == 'Check Out Early');
            const workshops = context.myEvent.sessions[selectionIndex].workshops;
            if (selections.lastIndexOf('Check In Late') < selectionIndex - 1) {
                if (checkInLateWSID !== undefined) {
                    document.getElementById(`radio-button-${session_id}-${checkInLateWSID.id}`).disabled = true;
                    document.getElementById(`radio-button-${session_id}-${checkInLateWSID.id}`).nextElementSibling.firstElementChild.title = 'You cannot select this workshop because you have selected Check In Late and another workshop after checking in late. Select another workshop or select Check In Late for the previous session.';
                }
            } else if (selections.indexOf('Check Out Early') <= selectionIndex + 1 && selections.indexOf('Check Out Early') !== -1) {
                let teacherTutor = false;
                workshops.forEach((workshop) => {
                    if (workshop.name !== "Teacher Tutoring" && workshop.name !== "Tutoring with a Teacher") {
                        document.getElementById(`radio-button-${session_id}-${workshop.id}`).disabled = false;
                        document.getElementById(`radio-button-${session_id}-${workshop.id}`).nextElementSibling.firstElementChild.title = '';
                    } else {
                        teacherTutor = true;
                    }
                })
                if (teacherTutor) {
                    document.getElementById(`radio-button-${session_id}-ttDynamic`).disabled = false;
                    document.getElementById(`radio-button-${session_id}-ttDynamic`).nextElementSibling.firstElementChild.title = '';
                }
            } else if (selections.lastIndexOf('Check In Late') === selectionIndex - 1 && checkOutEarlyWS !== undefined) {
                document.getElementById(`radio-button-${session_id}-${checkOutEarlyWS.id}`).disabled = true;
                document.getElementById(`radio-button-${session_id}-${checkOutEarlyWS.id}`).nextElementSibling.firstElementChild.title = 'You cannot select this workshop because you have selected Check In Late without another workshop before checking out early. Select another workshop for this or the previous session.';
            }
            if (selections.lastIndexOf('Check In Late') !== selectionIndex - 1 && checkOutEarlyWS !== undefined) {
                document.getElementById(`radio-button-${session_id}-${checkOutEarlyWS.id}`).disabled = false;
                document.getElementById(`radio-button-${session_id}-${checkOutEarlyWS.id}`).nextElementSibling.firstElementChild.title = ''
            }
        }
        document.getElementById('pagePrev').classList.remove('bx--btn--disabled');
        document.getElementById('pagePrev').disabled = false;
        __setSelectedProgress(selectedPage);
    }
}

const handlePrev = () => {
    if (selectedPage > 0) {
        pages[selectedPage].classList.remove('show');
        selectedPage--;
        const pageSelection = document.querySelector(`input[type=radio][name=${pages[selectedPage].id.replace("-", "_")}]:checked`) || selectedPage == 0 || selectedPage == pages.length - 1;
        pages[selectedPage].classList.add('show');
        if (selectedPage == 0) {
            document.getElementById('pagePrev').classList.add('bx--btn--disabled');
            document.getElementById('pagePrev').disabled = true;
        }
        if (selectedPage + 1 == pages.length - 1) {
            document.getElementById('pageNext').removeEventListener('click', handleSubmit);
            document.getElementById('pageNext').addEventListener('click', handleNext);
            document.getElementById('pageNext').innerHTML = `Next<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;"
            xmlns="http://www.w3.org/2000/svg" class="bx--btn__icon" width="16" height="16" viewBox="0 0 32 32"
            aria-hidden="true">
            <defs>
                <style>
                    .cls-1 {
                        fill: none;
                    }
                </style>
            </defs>
            <polygon points="18 6 16.57 7.393 24.15 15 4 15 4 17 24.15 17 16.57 24.573 18 26 28 16 18 6" />
            <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1"
                width="32" height="32" />
        </svg>`;
        }
        if (pageSelection !== null) {
            document.getElementById('pageNext').classList.remove('bx--btn--disabled');
            document.getElementById('pageNext').disabled = false;
            document.getElementById('pageNext').title = '';
        } else {
            document.getElementById('pageNext').classList.add('bx--btn--disabled');
            document.getElementById('pageNext').disabled = true;
        }
        if (selectedPage < pages.length - 1 && selectedPage > 0) {
            const selectionIndex = selectedPage - 1;
            const session_id = context.myEvent.sessions[selectionIndex].id;
            const checkInLateWSID = context.myEvent.sessions[selectionIndex].workshops.find((workshop) => workshop.name == 'Check In Late');
            const checkOutEarlyWS = context.myEvent.sessions[selectionIndex].workshops.find((workshop) => workshop.name == 'Check Out Early');
            const workshops = context.myEvent.sessions[selectionIndex].workshops;
            if (selections.lastIndexOf('Check In Late') < selectionIndex - 1) {
                if (checkInLateWSID !== undefined) {
                    document.getElementById(`radio-button-${session_id}-${checkInLateWSID.id}`).disabled = true;
                    document.getElementById(`radio-button-${session_id}-${checkInLateWSID.id}`).nextElementSibling.firstElementChild.title = 'You cannot select this workshop because you have selected Check In Late and another workshop after checking in late. Select another workshop or select Check In Late for the previous session.';
                }
            } else if (selections.indexOf('Check Out Early') <= selectionIndex + 1 && selections.indexOf('Check Out Early') !== -1) {
                let teacherTutor = false;
                workshops.forEach((workshop) => {
                    if (workshop.name !== "Teacher Tutoring" && workshop.name !== "Tutoring with a Teacher") {
                        document.getElementById(`radio-button-${session_id}-${workshop.id}`).disabled = false;
                        document.getElementById(`radio-button-${session_id}-${workshop.id}`).nextElementSibling.firstElementChild.title = '';
                    } else {
                        teacherTutor = true;
                    }
                })
                if (teacherTutor) {
                    document.getElementById(`radio-button-${session_id}-ttDynamic`).disabled = false;
                    document.getElementById(`radio-button-${session_id}-ttDynamic`).nextElementSibling.firstElementChild.title = '';
                }
            } else if (selections.lastIndexOf('Check In Late') === selectionIndex - 1 && checkOutEarlyWS !== undefined) {
                document.getElementById(`radio-button-${session_id}-${checkOutEarlyWS.id}`).disabled = true;
                document.getElementById(`radio-button-${session_id}-${checkOutEarlyWS.id}`).nextElementSibling.firstElementChild.title = 'You cannot select this workshop because you have selected Check In Late without another workshop before checking out early. Select another workshop for this or the previous session.';
            }
            if (selections.lastIndexOf('Check In Late') !== selectionIndex - 1 && checkOutEarlyWS !== undefined) {
                document.getElementById(`radio-button-${session_id}-${checkOutEarlyWS.id}`).disabled = false;
                document.getElementById(`radio-button-${session_id}-${checkOutEarlyWS.id}`).nextElementSibling.firstElementChild.title = ''
            }
        }
        __setSelectedProgress(selectedPage);
    }
}

const gotoPage = (page) => {
    if (page == 'last') {
        page = pages.length - 1;
    }
    if (page < pages.length && page >= 0 && !document.querySelectorAll(".bx--progress-step")[page].classList.contains("bx--progress-step--disabled")) {
        pages[selectedPage].classList.remove('show');
        selectedPage = page;
        const pageSelection = document.querySelector(`input[type=radio][name=${pages[selectedPage].id.replace("-", "_")}]:checked`)
        pages[selectedPage].classList.add('show');
        if (selectedPage == 0) {
            document.getElementById('pagePrev').classList.add('bx--btn--disabled');
            document.getElementById('pagePrev').disabled = true;
        } else {
            document.getElementById('pagePrev').classList.remove('bx--btn--disabled');
            document.getElementById('pagePrev').disabled = false;
        }
        if (selectedPage == pages.length - 1) {
            document.getElementById('pageNext').removeEventListener('click', handleNext);
            document.getElementById('pageNext').addEventListener('click', handleSubmit);
            document.getElementById('pageNext').innerHTML = `Submit<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;"
            xmlns="http://www.w3.org/2000/svg" class="bx--btn__icon" width="16" height="16" viewBox="0 0 32 32"
            aria-hidden="true">
            <defs>
    <style>
      .cls-1 {
        fill: none;
      }
    </style>
  </defs>
  <polygon points="13 24 4 15 5.414 13.586 13 21.171 26.586 7.586 28 9 13 24"/>
  <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"/>
        </svg>`;
        } else {
            document.getElementById('pageNext').removeEventListener('click', handleSubmit);
            document.getElementById('pageNext').addEventListener('click', handleNext);
            document.getElementById('pageNext').innerHTML = `Next<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;"
            xmlns="http://www.w3.org/2000/svg" class="bx--btn__icon" width="16" height="16" viewBox="0 0 32 32"
            aria-hidden="true">
            <defs>
                <style>
                    .cls-1 {
                        fill: none;
                    }
                </style>
            </defs>
            <polygon points="18 6 16.57 7.393 24.15 15 4 15 4 17 24.15 17 16.57 24.573 18 26 28 16 18 6" />
            <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1"
                width="32" height="32" />
        </svg>`;
        }
        if (selectedPage < pages.length - 1 && selectedPage > 0) {
            if (pageSelection !== null) {
                document.getElementById('pageNext').classList.remove('bx--btn--disabled');
                document.getElementById('pageNext').disabled = false;
                document.getElementById('pageNext').title = '';
            } else {
                document.getElementById('pageNext').classList.add('bx--btn--disabled');
                document.getElementById('pageNext').disabled = true;
                document.getElementById('pageNext').title = 'You must select a workshop before continuing.';
            }
        } else if (selectedPage == 0 || selectedPage === pages.length - 1) {
            document.getElementById('pageNext').classList.remove('bx--btn--disabled');
            document.getElementById('pageNext').disabled = false;
            document.getElementById('pageNext').title = '';
        }
        if (selectedPage < pages.length - 1 && selectedPage > 0) {
            const selectionIndex = selectedPage - 1;
            const session_id = context.myEvent.sessions[selectionIndex].id;
            const checkInLateWSID = context.myEvent.sessions[selectionIndex].workshops.find((workshop) => workshop.name == 'Check In Late');
            const checkOutEarlyWS = context.myEvent.sessions[selectionIndex].workshops.find((workshop) => workshop.name == 'Check Out Early');
            const workshops = context.myEvent.sessions[selectionIndex].workshops;
            if (selections.lastIndexOf('Check In Late') < selectionIndex - 1) {
                if (checkInLateWSID !== undefined) {
                    document.getElementById(`radio-button-${session_id}-${checkInLateWSID.id}`).disabled = true;
                    document.getElementById(`radio-button-${session_id}-${checkInLateWSID.id}`).nextElementSibling.firstElementChild.title = 'You cannot select this workshop because you have selected Check In Late and another workshop after checking in late. Select another workshop or select Check In Late for the previous session.';
                }
            } else if (selections.indexOf('Check Out Early') <= selectionIndex + 1 && selections.indexOf('Check Out Early') !== -1) {
                let teacherTutor = false;
                workshops.forEach((workshop) => {
                    if (workshop.name !== "Teacher Tutoring" && workshop.name !== "Tutoring with a Teacher") {
                        document.getElementById(`radio-button-${session_id}-${workshop.id}`).disabled = false;
                        document.getElementById(`radio-button-${session_id}-${workshop.id}`).nextElementSibling.firstElementChild.title = '';
                    } else {
                        teacherTutor = true;
                    }
                })
                if (teacherTutor) {
                    document.getElementById(`radio-button-${session_id}-ttDynamic`).disabled = false;
                    document.getElementById(`radio-button-${session_id}-ttDynamic`).nextElementSibling.firstElementChild.title = '';
                }
            } else if (selections.lastIndexOf('Check In Late') === selectionIndex - 1 && checkOutEarlyWS !== undefined) {
                document.getElementById(`radio-button-${session_id}-${checkOutEarlyWS.id}`).disabled = true;
                document.getElementById(`radio-button-${session_id}-${checkOutEarlyWS.id}`).nextElementSibling.firstElementChild.title = 'You cannot select this workshop because you have selected Check In Late without another workshop before checking out early. Select another workshop for this or the previous session.';
            }
            if (selections.lastIndexOf('Check In Late') !== selectionIndex - 1 && checkOutEarlyWS !== undefined) {
                document.getElementById(`radio-button-${session_id}-${checkOutEarlyWS.id}`).disabled = false;
                document.getElementById(`radio-button-${session_id}-${checkOutEarlyWS.id}`).nextElementSibling.firstElementChild.title = ''
            }
        }
        __setSelectedProgress(selectedPage);
    }
}
globalThis.EventRegister__gotoPage = gotoPage;
const handleSubmit = async (e) => {
    e.preventDefault();
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.id = 'progress-bar';
    const progressBarValue = document.createElement('div');
    progressBarValue.className = 'progress-bar-value';
    progressBar.appendChild(progressBarValue);
    document.body.prepend(progressBar);
    const loadingComponentHTML = `<div class="bx--loading-overlay">
        <div class="circle-loader" id="submitLoading">
            <div class="checkmark"></div>
        </div>
        <strong>Submitting your registration...</strong>
    </div>`
    const loadingComponent = new DOMParser().parseFromString(loadingComponentHTML, 'text/html').body.firstChild;
    document.body.prepend(loadingComponent);
    const formEntries = Array.from(new FormData(document.querySelector('form')));
    // const disabledOpt = formEntries.find((entry) => entry[0] == 'disabled');
    let formData = "Event_ID=" + context.myEvent.id;
    formEntries.forEach((entry) => {
        formData += "&" + entry[0] + "=" + encodeURIComponent(entry[1]);
    });
    const response = await fetch('//' + window.location.host + "/scripts/php/attendanceWs.php?action=register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    })
    try {
        var json = await response.json();
    } catch (e) {
        document.getElementById('submitLoading').classList.add('load-error');
        document.getElementById('submitLoading').nextElementSibling.innerHTML = 'An error occurred while submitting your registration. Please refresh this page or try again later.';
        document.getElementById('progress-bar').classList.add('error');
        throw error;
    }
    if (json.success && response.ok) {
        document.getElementById('submitLoading').classList.add('load-complete');
        document.getElementById('submitLoading').nextElementSibling.innerHTML = 'Your registration has been submitted. Redirecting in 3...';
        let i = 3;
        setInterval(() => {
            i = i - 1;
            if (i === 0) {
                document.getElementById('submitLoading').nextElementSibling.innerHTML = 'Your registration has been submitted. Redirecting now...';
                window.location.href = "EventPass.html?id=" + context.myEvent.id
            } else {
                document.getElementById('submitLoading').nextElementSibling.innerHTML = 'Your registration has been submitted. Redirecting in ' + i +'...';
            }
        }, 1000);
    } else {
        document.getElementById('submitLoading').classList.add('load-error');
        document.getElementById('submitLoading').nextElementSibling.innerHTML = 'An error occurred while submitting your registration. Please refresh this page or try again later.';
        document.getElementById('progress-bar').classList.add('error');
        throw new Error('Endpoint returned non success status')
    }
}
globalThis.EventRegister__handleSubmit = handleSubmit;
const __completeSVG = (target) => {
    if (target.classList.contains('bx--progress-step--current')) {
        target.querySelector('svg').innerHTML = `<path d="M7,0C3.1,0,0,3.1,0,7s3.1,7,7,7s7-3.1,7-7S10.9,0,7,0z M6,9.8L3.5,7.3l0.8-0.8L6,8.2l3.7-3.7l0.8,0.8L6,9.8z"/>`;
    } else {
        target.querySelector('svg').innerHTML = `<path d="M8,1C4.1,1,1,4.1,1,8s3.1,7,7,7s7-3.1,7-7S11.9,1,8,1z M8,14c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S11.3,14,8,14z"></path><path d="M7 10.8L4.5 8.3 5.3 7.5 7 9.2 10.7 5.5 11.5 6.3z"></path>`
    }
    if (target.nextSibling.classList.contains('bx--progress-step--disabled')) {
        target.nextSibling.classList.remove('bx--progress-step--disabled');
    }
}

const __incompleteSVG = (target) => {
    target.querySelector('svg').innerHTML = `<path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 13c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"></path>`;
}

const __currentSVG = (target) => {
    if (target.classList.contains('bx--progress-step--incomplete')) {
        target.querySelector('svg').innerHTML = `<path d="M 7, 7 m -7, 0 a 7,7 0 1,0 14,0 a 7,7 0 1,0 -14,0"></path>`;
    } else if (target.classList.contains('bx--progress-step--complete')) {
        target.querySelector('svg').innerHTML = `<path d="M7,0C3.1,0,0,3.1,0,7s3.1,7,7,7s7-3.1,7-7S10.9,0,7,0z M6,9.8L3.5,7.3l0.8-0.8L6,8.2l3.7-3.7l0.8,0.8L6,9.8z"/>`;
    }
}

const __unselectSVG = (target) => {
    if (target.classList.contains('bx--progress-step--incomplete')) {
        target.querySelector('svg').innerHTML = `<path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 13c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"></path>`
    } else if (target.classList.contains('bx--progress-step--complete')) {
        target.querySelector('svg').innerHTML = `<path d="M8,1C4.1,1,1,4.1,1,8s3.1,7,7,7s7-3.1,7-7S11.9,1,8,1z M8,14c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S11.3,14,8,14z"></path><path d="M7 10.8L4.5 8.3 5.3 7.5 7 9.2 10.7 5.5 11.5 6.3z"></path>`
    }
}

const updateSummaryPage = () => {
    let disabledRadios = Array.from(document.querySelectorAll('input[type=radio][disabled]'))
    disabledRadios.forEach(radio => radio.disabled = false);
    const formEntries = Array.from(new FormData(document.querySelector('form')));
    disabledRadios.forEach(radio => radio.disabled = true);
    formEntries.splice(0, 1);
    const tileSurface = document.getElementById('tileSurface');
    tileSurface.innerHTML = '';
    let checkInLateFlag = false;
    let checkOutEarlyFlag = false;
    formEntries.forEach((entry, index) => {
        if (selections[index] === 'Check In Late' && selections[index + 1] === 'Check In Late') {
            checkInLateFlag = true;
        } else if (selections[index] === 'Check Out Early' && selections[index - 1] === 'Check Out Early') {
            checkOutEarlyFlag = true;
        }
        const sessionID = entry[0].replace('Session_', '');
        const workshopID = entry[1];
        const session = context.myEvent.sessions.find((session) => session.id == sessionID);
        const workshop = session.workshops.find((workshop) => workshop.id == workshopID);
        const passTileHTML = `<div class="bx--tile ${checkInLateFlag || checkOutEarlyFlag ? "no-hover" : ""}" onclick="${!checkInLateFlag && !checkOutEarlyFlag ? `EventRegister__gotoPage(${index + 1})` : ''}">
        <h1>${index + 1}</h1>
        <h2 class="eventName">${session.name}</h2>
        <h2 class="time">${new Date(Date.parse(session.start_time) + 14400000).toLocaleTimeString() + ' - ' + new Date(Date.parse(session.end_time) + 14400000).toLocaleTimeString()}</h2>
        <h4>${workshop.name}</h4>
            <p><svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16">
                <path d="M18,30H14a2,2,0,0,1-2-2V21a2,2,0,0,1-2-2V13a3,3,0,0,1,3-3h6a3,3,0,0,1,3,3v6a2,2,0,0,1-2,2v7A2,2,0,0,1,18,30ZM13,12a.94.94,0,0,0-1,1v6h2v9h4V19h2V13a.94.94,0,0,0-1-1Z"/>
                <path d="M16,9a4,4,0,1,1,4-4h0A4,4,0,0,1,16,9Zm0-6a2,2,0,1,0,2,2h0a2,2,0,0,0-2-2Z"/>
            </svg>
            ${workshop.owner_first + ' ' + workshop.owner_last}</p>
            <p class="eventName"><svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16">
                <polygon points="17 22 17 14 13 14 13 16 15 16 15 22 12 22 12 24 20 24 20 22 17 22"/>
                <path d="M16,8a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,16,8Z"/>
                <path d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z"/>
              </svg>
              ${workshop.description}</p>
            ${checkOutEarlyFlag ? `<i class="time">You cannot modify this session since you have selected to check out early in a previous session.</i>` : checkInLateFlag ? `<i class="time">You cannot modify this session since you have selected to check in late in a later session.</i>` : ''}
        </div>`
        const passTile = new DOMParser().parseFromString(passTileHTML, 'text/html').querySelector('body > div');
        tileSurface.appendChild(passTile);
    });
}

const toggleDisabledView = (e) => {
    const hideIneligible = e.target.checked;
    document.querySelector('.disabledToggle').firstChild.checked = hideIneligible;
    if (hideIneligible) {
        document.getElementById('registrationWrappedForm').classList.add('hideIneligible');
    } else {
        document.getElementById('registrationWrappedForm').classList.remove('hideIneligible');
    }
}

window.addEventListener('load', () => {
    const eventDetailsClassSelected = () => {
        document.querySelector('#eventDetails svg').innerHTML = `<path d="M 7, 7 m -7, 0 a 7,7 0 1,0 14,0 a 7,7 0 1,0 -14,0"></path>`;
    }
    const eventDetailsClassUnselected = () => {
        document.querySelector('#eventDetails svg').innerHTML = `<path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 13c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"></path>`;
    }
    const eventDetailsClassSelectWatcher = new ClassWatcher(document.getElementById('eventDetails'), 'bx--progress-step--current', eventDetailsClassSelected, eventDetailsClassUnselected)
    document.querySelector('.mobileExpand').addEventListener('click', () => {
        document.querySelector('.leftBar').classList.toggle('showMobile');
    })
});

document.addEventListener('contextProvided', (e) => {
    document.getElementById('titleName').innerText = "Event Registration - " + context.myEvent.name;
    document.getElementById('mobileEventName').innerText = context.myEvent.name;
    document.getElementById('eventDesc').innerHTML = context.myEvent.event_description;
    document.getElementById('eventType').innerHTML = context.myEvent.ev_type + ' - ' + context.myEvent.ev_type_description;
    const eventStart = new Date(Date.parse(context.myEvent.start_time) + 14400000);
    const eventEnd = new Date(Date.parse(context.myEvent.end_time) + 14400000);
    const eventTimeString = eventStart.toLocaleDateString() + ' (' + eventStart.toLocaleTimeString() + ' - ' + eventEnd.toLocaleTimeString() + ')';
    document.getElementById('eventDate').innerHTML = eventTimeString;
    const eventRegOpen = new Date(context.myEvent.reg_open);
    const eventRegClose = new Date(context.myEvent.reg_close);
    const eventRegTimeString = eventRegOpen.toLocaleDateString() + ' - ' + eventRegClose.toLocaleDateString();
    document.getElementById('eventRegWindow').innerHTML = eventRegTimeString;
    if (context.myEvent.is_attending) {
        document.getElementById('viewPass').classList.remove('bx--btn--disabled');
        document.getElementById('viewPass').addEventListener('click', () => {
            window.location.href = 'event_pass.php?id=' + context.myEvent.id;
        });
    }
    if (context.myEvent.sessions.length < 0) {
        const notice = document.createElement('i');
        notice.innerText = 'There are no sessions posted for this event. Please check back later.';
    }
    context.myEvent.sessions.forEach((session, index) => {
        let selectedSession;
        let hasTutoring = false;
        const sessionHTML = `<div id="Session-${session.id}" class="SessionContents">
        <div class="SessionHeader">
        <h2>${session.name}</h2>
        <div class="bx--form-item disabledToggle">
            <input class="bx--toggle-input" id="disabledOpt${session.id}" type="checkbox" ${hideIneligible ? 'checked' : ''}>
            <label class="bx--toggle-input__label" for="disabledOpt${session.id}">
                Hide ineligible sessions
                <span class="bx--toggle__switch">
                <span class="bx--toggle__text--off" aria-hidden="true">Off</span>
                <span class="bx--toggle__text--on" aria-hidden="true">On</span>
                </span>
            </label>
        </div>
      <h4><svg id="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" title="Time">
        <defs>
            <style>.cls-1{fill:none;}</style>
        </defs>
        <title>time</title>
        <path d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z" style="fill: white;"/>
        <polygon points="20.59 22 15 16.41 15 7 17 7 17 15.58 22 20.59 20.59 22" style="fill: white;"/>
        <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1"
            width="32" height="32" />
    </svg>
    ${new Date(Date.parse(session.start_time) + 14400000).toLocaleTimeString() + ' - ' + new Date(Date.parse(session.end_time) + 14400000).toLocaleTimeString()}</h4>
    <h4><svg id="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" title="Description">
        <polygon points="17 22 17 14 13 14 13 16 15 16 15 22 12 22 12 24 20 24 20 22 17 22" style="fill: white;"/>
        <path d="M16,8a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,16,8Z" style="fill: white;"/>
        <path d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z" style="fill: white;"/>
      </svg>
      ${session.description}</h4>
      </div>
    <section class="bx--structured-list">
        <div class="bx--structured-list-thead">
            <div class="bx--structured-list-row bx--structured-list-row--header-row">
                <div class="bx--structured-list-th"></div>
                <div class="bx--structured-list-th">Name</div>
                <div class="bx--structured-list-th">Teacher</div>
                <div class="bx--structured-list-th">Description</div>
                <div class="bx--structured-list-th">Capacity</div>
            </div>
            <div class="bx--structured-list-row bx--structured-list-row--header-row border-bottom"><span></span></div>
        </div>
        <div class="bx--structured-list-tbody">

        </div>
    </section>
    </div>`
        const parser = new DOMParser();
        const sessionElement = parser.parseFromString(sessionHTML, 'text/html').querySelector('body > div');
        if (session.workshops.length < 0) {
            const notice = document.createElement('i');
            notice.innerText = 'There are no workshops posted for this session. You cannot finish registration without all sessions filled. Please contact an administrator or Ms. Taylor and check back later.';
            sessionElement.appendChild(notice);
            sessionElement.querySelector('#disabledOpt' + session.id).remove();
        } else {
            session.workshops.forEach((workshop) => {
                const eligible = context.myEvent.can_admin || (
                    ((context.userSession.it_major && workshop.it_major_allowed)
                        || (context.userSession.it_minor && workshop.it_minor_allowed)
                        || (context.userSession.eng_major && workshop.eng_major_allowed)
                        || (context.userSession.eng_minor && workshop.eng_minor_allowed)
                        || (context.userSession.hc_major && workshop.it_major_allowed)
                        || (context.userSession.hc_minor && workshop.it_minor_allowed)
                    ) &&
                    ((context.userSession.grade_level == 9 && workshop.allow_9)
                        || (context.userSession.grade_level == 10 && workshop.allow_10)
                        || (context.userSession.grade_level == 11 && workshop.allow_11)
                        || (context.userSession.grade_level == 12 && workshop.allow_12)
                    ) && workshop.max_attendees > workshop.attendee_count
                )
                let allowedPathways = [];
                if (workshop.it_major_allowed) allowedPathways.push("IT Major");
                if (workshop.it_minor_allowed) allowedPathways.push("IT Minor");
                if (workshop.eng_major_allowed) allowedPathways.push("Engineering Major");
                if (workshop.eng_minor_allowed) allowedPathways.push("Engineering Minor");
                if (workshop.hc_major_allowed) allowedPathways.push("Healthcare Major");
                if (workshop.hc_minor_allowed) allowedPathways.push("Healthcare Minor");
                allowedPathways = allowedPathways.join(", ");
                let allowedGrades = [];
                if (workshop.allow_9) allowedGrades.push("9th");
                if (workshop.allow_10) allowedGrades.push("10th");
                if (workshop.allow_11) allowedGrades.push("11th");
                if (workshop.allow_12) allowedGrades.push("12th");
                allowedGrades = allowedGrades.join(", ");
                let myPathways = [];
                if (context.userSession.it_major) myPathways.push("IT Major");
                if (context.userSession.it_minor) myPathways.push("IT Minor");
                if (context.userSession.eng_major) myPathways.push("Engineering Major");
                if (context.userSession.eng_minor) myPathways.push("Engineering Minor");
                if (context.userSession.hc_major) myPathways.push("Healthcare Major");
                if (context.userSession.hc_minor) myPathways.push("Healthcare Minor");
                myPathways = myPathways.join(", ");
                let eligiblity = [];
                eligiblity.push(!((context.userSession.it_major && workshop.it_major_allowed)
                    || (context.userSession.it_minor && workshop.it_minor_allowed)
                    || (context.userSession.eng_major && workshop.eng_major_allowed)
                    || (context.userSession.eng_minor && workshop.eng_minor_allowed)
                    || (context.userSession.hc_major && workshop.it_major_allowed)
                    || (context.userSession.hc_minor && workshop.it_minor_allowed)
                ) ? "Restricted by pathway—you are a " + myPathways + ", this workshop only allows " + allowedPathways + "." : "");
                eligiblity.push(!((context.userSession.grade_level == 9 && workshop.allow_9)
                    || (context.userSession.grade_level == 10 && workshop.allow_10)
                    || (context.userSession.grade_level == 11 && workshop.allow_11)
                    || (context.userSession.grade_level == 12 && workshop.allow_12)
                ) ? "Restricted by grade level—you are a " + context.userSession.grade_level + "th grader, this workshop only allows grades " + allowedGrades + "." : "");
                eligiblity.push(workshop.max_attendees <= workshop.attendee_count ? "This workshop is full." : "");
                eligiblity = eligiblity.join(" ")
                if (workshop.name != "Tutoring with a Teacher" && workshop.name != "Teacher Tutoring") {
                    const workshopHTML = `<div class="bx--structured-list-row ${!eligible ? "disabledSelection" : ""}">
                    <div class="bx--structured-list-td">
                        <div class="bx--radio-button-wrapper" ${!eligible ? 'title="' + eligiblity + '"' : ''}>
                            <input id="radio-button-${session.id}-${workshop.id}" class="bx--radio-button" type="radio" value="${workshop.id}"
                                name="Session_${session.id}" tabindex="0" ${workshop.is_attending == 1 ? 'checked' : ''} ${!eligible ? 'disabled title="' + eligiblity + '"' : `onchange="EventRegister__updateSessionWorkshop(${workshop.id}, ${session.id}, ${index})"`}>
                            <label for="radio-button-${session.id}-${workshop.id}" class="bx--radio-button__label">
                                <span class="bx--radio-button__appearance"></span>
                            </label>
                        </div>
                    </div>
                    <div class="bx--structured-list-td">
                        ${workshop.name}
                    </div>
                    <div class="bx--structured-list-td">
                        ${workshop.owner_first + ' ' + workshop.owner_last}
                    </div>
                    <div class="bx--structured-list-td">
                        ${workshop.description}
                    </div>
                    <div class="bx--structured-list-td">
                        ${workshop.attendee_count + '/' + workshop.max_attendees}
                    </div>
                </div>`
                    const workshopRow = parser.parseFromString(workshopHTML, 'text/html').querySelector('body > div');
                    sessionElement.querySelector('.bx--structured-list-tbody').appendChild(workshopRow);
                    if (workshop.is_attending == 1) {
                        selectedSession = workshop.name;
                    }
                } else {
                    if (eligible) {
                        tutoringTeachers.push({
                            id: workshop.id,
                            name: workshop.owner_first + ' ' + workshop.owner_last,
                            attendees: workshop.attendee_count,
                            limit: workshop.max_attendees
                        })
                    }
                    if (workshop.is_attending == 1) {
                        selectedTeacher = {
                            id: workshop.id,
                            name: workshop.owner_first + ' ' + workshop.owner_last,
                            attendees: workshop.attendee_count,
                            limit: workshop.max_attendees
                        };
                    }
                    hasTutoring = true;
                }
                if (workshop.is_attending == 1) {
                    selections[index] = workshop.name;
                }
            });
            if (hasTutoring) {
                let check = false;
                if (selectedTeacher == undefined) {
                    selectedTeacher = tutoringTeachers[0];
                } else {
                    check = true;
                }
                const ttRowHTML = `<div class="bx--structured-list-row" id="tutorRow-${session.id}">
                <div class="bx--structured-list-td">
                    <div class="bx--radio-button-wrapper">
                        <input id="radio-button-${session.id}-ttDynamic" class="bx--radio-button" type="radio" value="${selectedTeacher.id}"
                            name="Session_${session.id}" tabindex="0" ${check ? 'checked' : ''} ${context.myEvent.is_reg_open != 1 ? 'disabled' : ""} onchange="EventRegister__updateSessionWorkshop(event.target.value, ${session.id}, ${index})">
                        <label for="radio-button-${session.id}-ttDynamic" class="bx--radio-button__label">
                            <span class="bx--radio-button__appearance"></span>
                        </label>
                    </div>
                </div>
                <div class="bx--structured-list-td">
                    Tutoring with a Teacher
                </div>
                <div class="bx--structured-list-td" style="width: 20rem;">
                    <div data-dropdown data-dropdown-type="inline"  data-value
                    class="bx--dropdown   bx--dropdown--inline bx--dropdown--up">
                    <button class="bx--dropdown-text" aria-haspopup="true" aria-expanded="false" aria-controls="Session-${session.id}-tutor-menu" aria-labelledby="Session-${session.id}-tutor-value" type="button">
                      <span class="bx--dropdown-text__inner" id="Session-${session.id}-tutor-value">${selectedTeacher.name}</span>
                      <span class="bx--dropdown__arrow-container">
                        <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--dropdown__arrow" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z"></path></svg>
                      </span>
                    </button>
                    <ul class="bx--dropdown-list" id="Session-${session.id}-tutor-menu" role="menu" tabindex="0" id="Session-${session.id}-tutor-menu" aria-hidden="true" wh-menu-anchor="left">
                      
                    </ul>
                  </div>
                </div>
                <div class="bx--structured-list-td">
                    Sign up to attend tutoring with a specific teacher.
                </div>
                <div class="bx--structured-list-td">
                    ${selectedTeacher.attendees}/${selectedTeacher.limit}
                </div>
            </div>`
                const tutoringRow = parser.parseFromString(ttRowHTML, 'text/html').querySelector('body > div');
                tutoringTeachers.forEach((teacher, index) => {
                    const teacherSelectionHTML = `<li data-option data-value="all" class="bx--dropdown-item ${index == 0 ? 'bx--dropdown--selected' : ''}" title="${teacher.name}">
                    <a class="bx--dropdown-link" href="javascript:EventRegister__handleTeacherSelection(${teacher.id}, ${session.id}, ${index})"
                        tabindex="-1" role="menuitemradio" aria-checked="true"
                        id="Session-${session.id}-tutor-${teacher.id}">${teacher.name}</a>
                </li>`
                    const teacherSelection = parser.parseFromString(teacherSelectionHTML, 'text/html').querySelector('body > li');
                    tutoringRow.querySelector('.bx--dropdown-list').appendChild(teacherSelection);
                })
                sessionElement.querySelector('.bx--structured-list-tbody').appendChild(tutoringRow);
            }
            sessionElement.querySelector('#disabledOpt' + session.id).addEventListener('change', toggleDisabledView)
        }
        document.getElementById('registrationWrappedForm').appendChild(sessionElement);
        const progressStepHTML = `<li class="bx--progress-step ${selectedSession ? "bx--progress-step--complete" : "bx--progress-step--incomplete"} ${index != 0 && !selectedSession ? 'bx--progress-step--disabled' : ''}" id="Selector-Session${session.id}">
        <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        ${selectedSession ?
                `<path d="M8,1C4.1,1,1,4.1,1,8s3.1,7,7,7s7-3.1,7-7S11.9,1,8,1z M8,14c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S11.3,14,8,14z"></path><path d="M7 10.8L4.5 8.3 5.3 7.5 7 9.2 10.7 5.5 11.5 6.3z"></path>` :
                `<path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 13c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"></path>`}
            </svg>
            <p tabindex="0" class="bx--progress-label" aria-describedby="label-tooltip${session.id}" onclick="EventRegister__gotoPage(${index + 1})">
                ${session.name}
            </p>
            <div id="label-tooltip${session.id}" role="tooltip" data-floating-menu-direction="bottom"
                class="bx--tooltip" data-avoid-focus-on-open>
                <span class="bx--tooltip__caret"></span>
                <p class="bx--tooltip__text">${session.name}</p>
            </div>
            <p class="bx--progress-optional">${selectedSession ? selectedSession : ''}</p>
            <span class="bx--progress-line"></span>
        </li>`
        const progressStepElement = parser.parseFromString(progressStepHTML, 'text/html').querySelector('body > li');
        document.getElementById('signupProgress').insertBefore(progressStepElement, document.getElementById('summary'));
        if (context.myEvent.sessions.length - 1 == index && selectedSession) {
            document.getElementById('summary').classList.remove('bx--progress-step--disabled');
        }
        new ClassWatcher(document.getElementById(`Selector-Session${session.id}`), 'bx--progress-step--current', __currentSVG, __unselectSVG);
        new ClassWatcher(document.getElementById(`summary`), 'bx--progress-step--current', __currentSVG, __unselectSVG);
        new ClassWatcher(document.getElementById('summaryPage'), 'show', updateSummaryPage, () => { });
        new ClassWatcher(document.getElementById(`Selector-Session${session.id}`), 'bx--progress-step--complete', __completeSVG, __incompleteSVG); 
    });
    document.querySelectorAll('.SessionContents').forEach((session) => {
        pages.push(session);
    });
    if (context.myEvent.can_admin) {
        (() => { })();
    } else if (!context.myEvent.is_reg_open) {
        notice = document.createElement('i');
        notice.innerText = 'Registration has closed for this event. You cannot add or change your registration.';
        document.getElementById('StartPage').appendChild(notice);
        Array.from(document.querySelectorAll('input[type="radio"]')).forEach(radio => radio.disabled = true);
        document.getElementById('pageNext').disabled = true;
        Array.from(document.querySelectorAll('.bx--progress-step')).forEach(progress => progress.classList.add('bx--progress-step--disabled'));
    } else if (!((context.userSession.it_major && context.myEvent.it_major)
        || (context.userSession.it_minor && context.myEvent.it_minor)
        || (context.userSession.eng_major && context.myEvent.eng_major)
        || (context.userSession.eng_minor && context.myEvent.eng_minor)
        || (context.userSession.hc_major && context.myEvent.it_major)
        || (context.userSession.hc_minor && context.myEvent.it_minor)
    )) {
        let eligiblePathways = [];
        if (context.myEvent.it_major) eligiblePathways.push('IT Major');
        if (context.myEvent.it_minor) eligiblePathways.push('IT Minor');
        if (context.myEvent.eng_major) eligiblePathways.push('Engineering Major');
        if (context.myEvent.eng_minor) eligiblePathways.push('Engineering Minor');
        if (context.myEvent.hc_major) eligiblePathways.push('Healthcare Major');
        if (context.myEvent.hc_minor) eligiblePathways.push('Healthcare Minor');
        eligiblePathways = eligiblePathways.join(', ');
        let myPathways = [];
        if (context.userSession.it_major) myPathways.push('IT Major');
        if (context.userSession.it_minor) myPathways.push('IT Minor');
        if (context.userSession.eng_major) myPathways.push('Engineering Major');
        if (context.userSession.eng_minor) myPathways.push('Engineering Minor');
        if (context.userSession.hc_major) myPathways.push('Healthcare Major');
        if (context.userSession.hc_minor) myPathways.push('Healthcare Minor');
        myPathways = myPathways.join(', ');
        notice = document.createElement('i');
        notice.innerText = `You are not eligible to register for this event. You must be enrolled in one of the following pathways: ${eligiblePathways}. You are currently enrolled in: ${myPathways}. If you need to attend a session on this day, such as teacher tutoring or et cetera, please contact the workshop organizer to manually add you to this event. You may not add or change your registration.`;
        document.getElementById('StartPage').appendChild(notice);
        Array.from(document.querySelectorAll('input[type="radio"]')).forEach(radio => radio.disabled = true);
        document.getElementById('pageNext').disabled = true;
        Array.from(document.querySelectorAll('.bx--progress-step')).forEach(progress => progress.classList.add('bx--progress-step--disabled'));
    }
    const sessionString = context.myEvent.sessions.map(session => session.id).join(',');
    document.getElementById('sessionInvis').value = sessionString;
    signupProgressComponent = CarbonComponents.ProgressIndicator.create(document.getElementById('signupProgress'));
    globalThis.signupProgressComponent = signupProgressComponent
    document.getElementById('pageNext').addEventListener('click', handleNext);
    document.getElementById('pagePrev').addEventListener('click', handlePrev);
})

const updateStep = (step, state, subtext) => {
    const signupProgress = document.getElementById('singupProgress');
}