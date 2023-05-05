import { ClassWatcher } from "../frame/modules.js";

let signupProgressComponent;
let selectedTeacher;
let tutoringTeachers = [];
let pages = [];
let selectedPage = 0;

globalThis.EventRegister__handleTeacherSelection = (teacherID, sessionID) => {
    const tutoringRow = document.getElementById(`tutorRow-${sessionID}`);
    tutoringRow.children[0].firstElementChild.firstElementChild.value = teacherID;
    tutoringRow.children[4].innerText = tutoringTeachers.find((teacher) => teacher.id == teacherID).attendees + '/' + tutoringTeachers.find((teacher) => teacher.id == teacherID).limit;
    if (tutoringRow.children[0].firstElementChild.firstElementChild.checked) {
        EventRegister__updateSessionWorkshop(teacherID, sessionID);
    }
}

globalThis.EventRegister__updateSessionWorkshop = (workshopID, sessionID) => {
    const progressStep = document.getElementById(`Selector-Session${sessionID}`);
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
        }
        document.getElementById('pagePrev').classList.remove('bx--btn--disabled');
        __setSelectedProgress(selectedPage);
    }
}

const handlePrev = () => {
    if (selectedPage > 0) {
        pages[selectedPage].classList.remove('show');
        selectedPage--;
        pages[selectedPage].classList.add('show');
        if (selectedPage == 0) {
            document.getElementById('pagePrev').classList.add('bx--btn--disabled');
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
        __setSelectedProgress(selectedPage);
    }
}

const gotoPage = (page) => {
    if (page == 'last') {
        page = pages.length - 1;
    }
    if (page < pages.length && page >= 0) {
        pages[selectedPage].classList.remove('show');
        selectedPage = page;
        pages[selectedPage].classList.add('show');
        if (selectedPage == 0) {
            document.getElementById('pagePrev').classList.add('bx--btn--disabled');
        } else {
            document.getElementById('pagePrev').classList.remove('bx--btn--disabled');
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
        __setSelectedProgress(selectedPage);
    }
}
globalThis.EventRegister__gotoPage = gotoPage;
const handleSubmit = () => {
    document.querySelector('form').submit();
}

const __completeSVG = (target) => {
    if (target.classList.contains('bx--progress-step--current')) {
        target.querySelector('svg').innerHTML = `<path d="M7,0C3.1,0,0,3.1,0,7s3.1,7,7,7s7-3.1,7-7S10.9,0,7,0z M6,9.8L3.5,7.3l0.8-0.8L6,8.2l3.7-3.7l0.8,0.8L6,9.8z"/>`;
    } else {
        target.querySelector('svg').innerHTML = `<path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 13c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"></path>`
    }
    if (target.nextSibling.classList.contains('bx--progress-step--disabled')) {
        target.nextSibling.classList.remove('bx--progress-step--disabled');
    }
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
    const formEntries = Array.from(new FormData(document.querySelector('form')));
    formEntries.splice(0, 1);
    const tileSurface = document.getElementById('tileSurface');
    tileSurface.innerHTML = '';
    formEntries.forEach((entry, index) => {
        const sessionID = entry[0].replace('Session_', '');
        const workshopID = entry[1];
        const session = context.myEvent.sessions.find((session) => session.id == sessionID);
        const workshop = session.workshops.find((workshop) => workshop.id == workshopID);
        const passTileHTML = `<div class="bx--tile" onclick="EventRegister__gotoPage(${index + 1})">
        <h1>${index + 1}</h1>
        <h2 class="eventName">${session.name}</h2>
        <h2 class="time">${new Date(session.start_time).toLocaleTimeString() + ' - ' + new Date(session.end_time).toLocaleTimeString()}</h2>
        <h4>${workshop.name}</h4>
            <p><svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16">
                <path d="M18,30H14a2,2,0,0,1-2-2V21a2,2,0,0,1-2-2V13a3,3,0,0,1,3-3h6a3,3,0,0,1,3,3v6a2,2,0,0,1-2,2v7A2,2,0,0,1,18,30ZM13,12a.94.94,0,0,0-1,1v6h2v9h4V19h2V13a.94.94,0,0,0-1-1Z"/>
                <path d="M16,9a4,4,0,1,1,4-4h0A4,4,0,0,1,16,9Zm0-6a2,2,0,1,0,2,2h0a2,2,0,0,0-2-2Z"/>
            </svg>
            ${workshop.owner_first + ' ' + workshop.owner_last}</p>
            <p><svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16">
                <polygon points="17 22 17 14 13 14 13 16 15 16 15 22 12 22 12 24 20 24 20 22 17 22"/>
                <path d="M16,8a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,16,8Z"/>
                <path d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z"/>
              </svg>
              ${workshop.description}</p>
        </div>`
        const passTile = new DOMParser().parseFromString(passTileHTML, 'text/html').querySelector('body > div');
        tileSurface.appendChild(passTile);
    });
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
    document.getElementById('eventDesc').innerHTML = context.myEvent.event_description;
    document.getElementById('eventType').innerHTML = context.myEvent.ev_type + ' - ' + context.myEvent.ev_type_description;
    const eventStart = new Date(context.myEvent.start_time);
    const eventEnd = new Date(context.myEvent.end_time);
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
    context.myEvent.sessions.forEach((session, index) => {
        let selectedSession;
        let hasTutoring = false;
        const sessionHTML = `<div id="Session-${session.id}" class="SessionContents">
        <h2>${session.name}</h2>
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
    ${new Date(session.start_time).toLocaleTimeString() + ' - ' + new Date(session.end_time).toLocaleTimeString()}</h4>
    <h4><svg id="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" title="Description">
        <polygon points="17 22 17 14 13 14 13 16 15 16 15 22 12 22 12 24 20 24 20 22 17 22" style="fill: white;"/>
        <path d="M16,8a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,16,8Z" style="fill: white;"/>
        <path d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z" style="fill: white;"/>
      </svg>
      ${session.description}</h4>
    <section class="bx--structured-list">
        <div class="bx--structured-list-thead">
            <div class="bx--structured-list-row bx--structured-list-row--header-row">
                <div class="bx--structured-list-th"></div>
                <div class="bx--structured-list-th">Name</div>
                <div class="bx--structured-list-th">Teacher</div>
                <div class="bx--structured-list-th">Description</div>
                <div class="bx--structured-list-th">Capacity</div>
            </div>
        </div>
        <div class="bx--structured-list-tbody">

        </div>
    </section>
    </div>`
        const parser = new DOMParser();
        const sessionElement = parser.parseFromString(sessionHTML, 'text/html').querySelector('body > div');
        session.workshops.forEach((workshop) => {
            if (workshop.name != "Tutoring with a Teacher") {
                const workshopHTML = `<div class="bx--structured-list-row">
                <div class="bx--structured-list-td">
                    <div class="bx--radio-button-wrapper">
                        <input id="radio-button-${session.id}-${workshop.id}" class="bx--radio-button" type="radio" value="${workshop.id}"
                            name="Session_${session.id}" tabindex="0" ${workshop.is_attending == 1 ? 'checked' : ''} ${context.myEvent.is_reg_open != 1 ? 'disabled' : ""} onchange="EventRegister__updateSessionWorkshop(${workshop.id}, ${session.id})">
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
                tutoringTeachers.push({
                    id: workshop.id,
                    name: workshop.owner_first + ' ' + workshop.owner_last,
                    attendees: workshop.attendee_count,
                    limit: workshop.max_attendees
                })
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
                    <input id="radio-button-ttDynamic" class="bx--radio-button" type="radio" value="${selectedTeacher.id}"
                        name="Session_${session.id}" tabindex="0" ${check ? 'checked' : ''} ${context.myEvent.is_reg_open != 1 ? 'disabled' : ""} onchange="EventRegister__updateSessionWorkshop(event.target.value, ${session.id})">
                    <label for="radio-button-ttDynamic" class="bx--radio-button__label">
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
                <a class="bx--dropdown-link" href="javascript:EventRegister__handleTeacherSelection(${teacher.id}, ${session.id})"
                    tabindex="-1" role="menuitemradio" aria-checked="true"
                    id="Session-${session.id}-tutor-${teacher.id}">${teacher.name}</a>
            </li>`
                const teacherSelection = parser.parseFromString(teacherSelectionHTML, 'text/html').querySelector('body > li');
                tutoringRow.querySelector('.bx--dropdown-list').appendChild(teacherSelection);
            })
            sessionElement.querySelector('.bx--structured-list-tbody').appendChild(tutoringRow);
        }
        console.log(sessionElement);
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
        new ClassWatcher(document.getElementById(`Selector-Session${session.id}`), 'bx--progress-step--complete', __completeSVG, () => { alert("huh") }); // TODO: remove in submission
    });
    document.querySelectorAll('.SessionContents').forEach((session) => {
        pages.push(session);
    });
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