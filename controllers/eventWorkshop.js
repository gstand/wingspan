window.addEventListener('load', async () => {
    await getUserSession();
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (!sessionId) {
        throwContextError("No session ID provided in URL.");
        throw new Error('No session ID provided');
    }
    const workshopId = params.get('workshop_id');
    if (!workshopId) {
        throwContextError("No workshop ID provided in URL.");
        throw new Error('No workshop ID provided');
    }
    const response = await fetch('//' + window.location.host + '/scripts/php/event_workshopWs.php?session_id=' + sessionId + '&workshop_id=' + workshopId);
    try {
        var json = await response.json();
    } catch (error) {
        throwContextError('Error parsing JSON response from server.');
        throw error;
    }
    if (response.status !== 200) {
        if (json && json.code === 'unauthenticated') {
            window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href.replace(window.location.origin, ''));
        } else {
            throwContextError('HTTP error when fetching workshop data: ' + response.status + ' ' + response.statusText);
            throw new Error('HTTP error ' + response.status);
        }
    }
    globalThis.context.workshop = json;
    document.dispatchEvent(contextProvided);
    document.getElementById('progress-bar').remove();
})

document.addEventListener('contextProvided', () => {
    document.getElementById('titleName').innerText = "Workshop Management - " + context.workshop.name;
    document.getElementById('titleName').classList.remove('bx--skeleton__text')
    document.getElementById('titleName').classList.remove('bx--skeleton__heading')
    document.getElementById('mobileEventName').innerText = context.workshop.name;
    document.getElementById('mobileEventName').classList.remove('bx--skeleton__text')
    document.getElementById('mobileEventName').classList.remove('bx--skeleton__heading')
    document.getElementById('pagePrev').addEventListener('click', () => { window.location.href = "EventOwner.html?id=" + context.workshop.id; })
    document.getElementById('description').innerHTML = `<svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16"><polygon points="17 22 17 14 13 14 13 16 15 16 15 22 12 22 12 24 20 24 20 22 17 22" /><path d="M16,8a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,16,8Z" /><path d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z" /></svg> ${context.workshop.description}`;
    document.getElementById('description').classList.remove('bx--skeleton__text')
    document.getElementById('time').innerHTML = `<svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16"><path d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z" /><polygon points="20.59 22 15 16.41 15 7 17 7 17 15.58 22 20.59 20.59 22" /></svg> ${context.workshop.session_name} at ${context.workshop.session_start_time} - ${context.workshop.session_end_time} on ${context.workshop.event_date}`;
    document.getElementById('time').classList.remove('bx--skeleton__text')
    document.getElementById('capacity').innerHTML = `<svg id="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path d="M26,14H24v2h2a3.0033,3.0033,0,0,1,3,3v4h2V19A5.0058,5.0058,0,0,0,26,14Z" transform="translate(0 0)" /><path d="M24,4a3,3,0,1,1-3,3,3,3,0,0,1,3-3m0-2a5,5,0,1,0,5,5A5,5,0,0,0,24,2Z" transform="translate(0 0)" /><path d="M23,30H21V28a3.0033,3.0033,0,0,0-3-3H14a3.0033,3.0033,0,0,0-3,3v2H9V28a5.0059,5.0059,0,0,1,5-5h4a5.0059,5.0059,0,0,1,5,5Z" transform="translate(0 0)" /><path d="M16,13a3,3,0,1,1-3,3,3,3,0,0,1,3-3m0-2a5,5,0,1,0,5,5A5,5,0,0,0,16,11Z" transform="translate(0 0)" /><path d="M8,14H6a5.0059,5.0059,0,0,0-5,5v4H3V19a3.0033,3.0033,0,0,1,3-3H8Z" transform="translate(0 0)" /><path d="M8,4A3,3,0,1,1,5,7,3,3,0,0,1,8,4M8,2a5,5,0,1,0,5,5A5,5,0,0,0,8,2Z" transform="translate(0 0)" /></svg> ${context.workshop.attendees.length} / ${context.workshop.max_attendees}`;
    document.getElementById('capacity').classList.remove('bx--skeleton__text')
    document.getElementById('owners').innerHTML = `<svg id="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path d="M16,22a4,4,0,1,0-4-4A4,4,0,0,0,16,22Zm0-6a2,2,0,1,1-2,2A2,2,0,0,1,16,16Z" /><rect x="14" y="6" width="4" height="2" /><path d="M24,2H8A2.002,2.002,0,0,0,6,4V28a2.0023,2.0023,0,0,0,2,2H24a2.0027,2.0027,0,0,0,2-2V4A2.0023,2.0023,0,0,0,24,2ZM20,28H12V26a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Zm2,0V26a3,3,0,0,0-3-3H13a3,3,0,0,0-3,3v2H8V4H24V28Z" /></svg> ${context.workshop.owner_first} ${context.workshop.owner_last} (${context.workshop.owner_email})`;
    document.getElementById('owners').classList.remove('bx--skeleton__text')
    document.getElementById('rowTarget').innerHTML = '';
    document.getElementById('rowTarget').parentElement.classList.remove('bx--skeleton')
    context.workshop.attendees.forEach(attendee => {
        const rowHTML = `<table><tbody><tr id="attendee-${attendee.id}">
        <td>
            ${attendee.last_name}, ${attendee.first_name}
        </td>
        <td>
            ${attendee.participate_type}
        </td>
        <td>
            ${attendee.required ? 'Yes' : 'No'}
        </td>
        <td style="width: 25.3604rem;">
        <div class="bx--form-item attdOptions">
        <div class="bx--radio-button-group ">
                <div class="bx--radio-button-wrapper">
                <input id="radio-button-${attendee.id}-present" class="bx--radio-button" type="radio" value="present" name="radio-button${attendee.id}" tabindex="0" ${attendee.attendance == 'Present' ? 'checked' : ''} onchange="updateAttendance(${attendee.user_id}, ${context.workshop.session_id}, ${context.workshop.id}, 'Present')">
                <label for="radio-button-${attendee.id}-present" class="bx--radio-button__label">
                    <span class="bx--radio-button__appearance"></span>
                    <span class="bx--radio-button__label-text">Present</span>
                </label>
                </div>
                <div class="bx--radio-button-wrapper">
                <input id="radio-button-${attendee.id}-absent" class="bx--radio-button" type="radio" value="absent" name="radio-button${attendee.id}" tabindex="0" ${attendee.attendance == 'Absent' ? 'checked' : ''} onchange="updateAttendance(${attendee.user_id}, ${context.workshop.session_id}, ${context.workshop.id}, 'Absent')">
                <label for="radio-button-${attendee.id}-absent" class="bx--radio-button__label">
                    <span class="bx--radio-button__appearance"></span>
                    <span class="bx--radio-button__label-text">Absent</span>
                </label>
                </div>
                <div class="bx--radio-button-wrapper">
                <input id="radio-button-${attendee.id}-tardy" class="bx--radio-button" type="radio" value="tardy" name="radio-button${attendee.id}" tabindex="0" ${attendee.attendance == 'Tardy' ? 'checked' : ''} onchange="updateAttendance(${attendee.user_id}, ${context.workshop.session_id}, ${context.workshop.id}, 'Tardy')">
                <label for="radio-button-${attendee.id}-tardy" class="bx--radio-button__label">
                    <span class="bx--radio-button__appearance"></span>
                    <span class="bx--radio-button__label-text">Tardy</span>
                </label>
                </div>
            </div>
        </div>
              <button
                class="bx--btn bx--btn--danger bx--btn--sm"
                aria-label="danger"  type="button" onclick="deleteAttendance(${attendee.user_id}, ${context.workshop.session_id}, ${context.workshop.id})">
                Remove
                </button>
                <div 
                class="bx--form-item bx--text-input-wrapper">
                <div class="bx--text-input__field-wrapper">
                    <input id="attd-note-${attendee.id}" type="text"
                    class="bx--text-input attd-note" placeholder="Attendance note" onkeyup="updateNote(event, ${attendee.user_id}, ${context.workshop.session_id}, ${context.workshop.id})" onblur="noteBlur(event, ${attendee.id})">
                </div>
                </div>
        </td>
    </tr></tbody></table>`
        const rowElement = new DOMParser().parseFromString(rowHTML, 'text/html').querySelector('tr');
        rowElement.querySelector(`#attd-note-${attendee.id}`).value = attendee.note;
        document.getElementById('rowTarget').appendChild(rowElement);
    })
    document.getElementById('sessionRowTarget').innerHTML = '';
    document.getElementById('sessionsTable').classList.remove('bx--skeleton')
    context.workshop.sessions.forEach(session => {
        const rowHTML = `<table><tbody><tr>
        <td>
          <div class="bx--radio-button-wrapper bx--radio-button-wrapper--label-left">
            <input id="session-rb-${session.session_id}" class="bx--radio-button" type="radio" value="${session.session_id}" name="session-rb" tabindex="0" ${context.workshop.session_id === session.session_id ? "checked" : ""}>
            <label for="session-rb-${session.session_id}" class="bx--radio-button__label">
              <span class="bx--radio-button__appearance"></span>
            </label>
          </div>
        </td>
        <td>
          ${session.event_name}
        </td>
        <td>
          ${new Date(Date.parse(session.event_date.date) + 14400000).toLocaleDateString()}
        </td>
        <td>
          ${session.session_name}
        </td>
        <td>
          ${new Date(Date.parse(session.session_start.date)).toLocaleTimeString()}
        </td>
        <td>
            ${new Date(Date.parse(session.session_end.date)).toLocaleTimeString()}
        </td>
      </tr></tbody></table>`
        const rowElement = new DOMParser().parseFromString(rowHTML, 'text/html').querySelector('tr');
        document.getElementById('sessionRowTarget').appendChild(rowElement);
    })
    document.getElementById('sessionSwitch').addEventListener("click", () => { window.location.href = `eventWorkshop.html?workshop_id=${context.workshop.id}&session_id=${document.querySelector('input[name=session-rb]:checked').value}` })
    document.getElementById('addAttendee').addEventListener("click", async () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.id = 'progress-bar';
        const progressBarValue = document.createElement('div');
        progressBarValue.className = 'progress-bar-value';
        progressBar.appendChild(progressBarValue);
        document.body.prepend(progressBar);
        const modal = CarbonComponents.Modal.create(document.getElementById('modal-addAttendee'));
        const response = await fetch('//' + window.location.host + `/scripts/php/attendanceWs.php?action=GetUsers`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `workshop_id=${context.workshop.id}&session_id=${context.workshop.session_id}`
        })
        try {
            var users = await response.json();
        } catch (error) {
            throwContextError('Error parsing JSON response from server.');
            throw error;
        }
        if (response.status !== 200) {
            if (users && users.code === 'unauthenticated') {
                window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href.replace(window.location.origin, ''));
            } else {
                throwContextError('HTTP error when fetching user data: ' + response.status + ' ' + response.statusText);
                throw new Error('HTTP error ' + response.status);
            }
        }
        globalThis.attendingUsers = [];
        globalThis.requiredUsers = [];
        document.getElementById('attendeeRowTarget').innerHTML = '';
        users.forEach(user => {
            if (user.attending) {
                globalThis.attendingUsers.push(user.id);
            }
            if (user.required) {
                globalThis.requiredUsers.push(user.id);
            }
            const rowHTML = `<table><tbody><tr>
              <td>${user.last_name}</td>
              <td>${user.first_name}</td>
              <td>${user.id_num}</td>
              <td>${user.user_type}</td>
              <td>${user.user_type === "Student" ? user.grade : "N/A"}</td>
              <td>${user.user_type === "Student" ? user.major : "N/A"}</td>
              <td>${user.user_type === "Student" ? user.minor : "N/A"}</td>
              <td>
                <div class="bx--radio-button-group ">
                  <div class="bx--radio-button-wrapper">
                    <input id="radio-button-${user.id}-notattd" class="bx--radio-button" type="radio"
                      value="notattd" name="radio-button${user.id}" tabindex="0" ${!user.attending && !user.required ? "checked" : ""} onchange="addAttendee(${user.id}, this.value)">
                    <label for="radio-button-${user.id}-notattd" class="bx--radio-button__label">
                      <span class="bx--radio-button__appearance"></span>
                      <span class="bx--radio-button__label-text">Not Attending</span>
                    </label>
                  </div>
                  <div class="bx--radio-button-wrapper">
                    <input id="radio-button-${user.id}-attd" class="bx--radio-button" type="radio" value="attd"
                      name="radio-button${user.id}" tabindex="0" ${user.attending && !user.required ? "checked" : ""} onchange="addAttendee(${user.id}, this.value)">
                    <label for="radio-button-${user.id}-attd" class="bx--radio-button__label">
                      <span class="bx--radio-button__appearance"></span>
                      <span class="bx--radio-button__label-text">Attending</span>
                    </label>
                  </div>
                  <div class="bx--radio-button-wrapper">
                    <input id="radio-button-${user.id}-reqd" class="bx--radio-button" type="radio" value="reqd"
                      name="radio-button${user.id}" tabindex="0" ${user.attending && user.required ? "checked" : ""} onchange="addAttendee(${user.id}, this.value)">
                    <label for="radio-button-${user.id}-reqd" class="bx--radio-button__label">
                      <span class="bx--radio-button__appearance"></span>
                      <span class="bx--radio-button__label-text">Required</span>
                    </label>
                  </div>
                </div>
              </td>
            </tr></tbody></table>`
            const rowElement = new DOMParser().parseFromString(rowHTML, 'text/html').querySelector('tr');
            document.getElementById('attendeeRowTarget').appendChild(rowElement);
        })
        document.getElementById('submitAttendees').addEventListener("click", async () => {
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.id = 'progress-bar';
            const progressBarValue = document.createElement('div');
            progressBarValue.className = 'progress-bar-value';
            progressBar.appendChild(progressBarValue);
            document.body.prepend(progressBar);
            document.getElementById('submitAttendees').disabled = true;
            document.getElementById('submitAttendees').innerHTML = 'Submitting...';
            document.getElementById('closeAttendees').disabled = true;
            const response = await fetch('//' + window.location.host + `/scripts/php/attendanceWs.php?action=add`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `workshop_id=${context.workshop.id}&session_id=${context.workshop.session_id}&attending_users=${globalThis.attendingUsers.join(',')}&required_users=${globalThis.requiredUsers.join(',')}&event_id=${context.workshop.event_id}`
            })
            try {
                var result = await response.json();
            } catch (error) {
                document.getElementById('progress-bar').classList.add('error')
                const notifHTML = `<div data-notification
        class="bx--inline-notification bx--inline-notification--error"
        role="alert">
        <div class="bx--inline-notification__details">
          <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z"></path><path d="M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z" data-icon-path="inner-path" opacity="0"></path></svg>
          <div class="bx--inline-notification__text-wrapper">
            <p class="bx--inline-notification__title">Error adding attendees</p>
            <p class="bx--inline-notification__subtitle">There was an error setting the requested attendance data. This can be caused by a variety of issues; which may include network issues, authentication issues, or et cetera. Try reloading the page, signing out and signing back in, and if issues persist, contact us here. Error details: endpoint returned bad data </p> <!--TODO: actually add this form(?) or whatever it'll be--> 
          </div>
        </div>
      </div>`
                const notif = new DOMParser().parseFromString(notifHTML, 'text/html').body.firstChild;
                document.body.appendChild(notif);
                throw error;
            }
            if (response.status !== 200) {
                if (result && result.code === 'unauthenticated') {
                    window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href.replace(window.location.origin, ''));
                } else {
                    document.getElementById('progress-bar').classList.add('error')
                    const notifHTML = `<div data-notification
        class="bx--inline-notification bx--inline-notification--error"
        role="alert">
        <div class="bx--inline-notification__details">
          <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z"></path><path d="M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z" data-icon-path="inner-path" opacity="0"></path></svg>
          <div class="bx--inline-notification__text-wrapper">
            <p class="bx--inline-notification__title">Error adding attendees</p>
            <p class="bx--inline-notification__subtitle">There was an error setting the requested attendance data. This can be caused by a variety of issues; which may include network issues, authentication issues, or et cetera. Try reloading the page, signing out and signing back in, and if issues persist, contact us here. Error details: endpoint returned non success status </p> <!--TODO: actually add this form(?) or whatever it'll be--> 
          </div>
        </div>
      </div>`
                    const notif = new DOMParser().parseFromString(notifHTML, 'text/html').body.firstChild;
                    document.body.appendChild(notif);
                    throw new Error('HTTP error ' + response.status);
                }
            }
            const newContext = await fetch('//' + window.location.host + '/scripts/php/event_workshopWs.php?session_id=' + context.workshop.session_id + '&workshop_id=' + context.workshop.id);
            try {
                var json = await newContext.json();
            } catch (error) {
                throwContextError('Error parsing JSON response from server.');
                throw error;
            }
            if (newContext.status !== 200) {
                if (json && json.code === 'unauthenticated') {
                    window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href.replace(window.location.origin, ''));
                } else {
                    throwContextError('HTTP error when fetching workshop data: ' + newContext.status + ' ' + newContext.statusText);
                    throw new Error('HTTP error ' + newContext.status);
                }
            }
            globalThis.context.workshop = json;
            document.dispatchEvent(contextProvided);
            document.getElementById('progress-bar').remove();
            modal.hide();
            Array.from(document.querySelectorAll('.bx--inline-notification')).forEach(el => el.remove());
            const notifHTML = `<div data-notification
            class="bx--inline-notification bx--inline-notification--success"
            role="alert">
            <div class="bx--inline-notification__details">
              <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10,1c-4.9,0-9,4.1-9,9s4.1,9,9,9s9-4,9-9S15,1,10,1z M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z"></path><path fill="none" d="M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z" data-icon-path="inner-path" opacity="0"></path></svg>
              <div class="bx--inline-notification__text-wrapper">
                <p class="bx--inline-notification__title">Attendees added</p>
                <p class="bx--inline-notification__subtitle">The attendees have been added.</p>
              </div>
            </div>
            <button data-notification-btn class="bx--inline-notification__close-button" type="button"
              aria-label="close">
              <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__close-icon" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z"></path></svg>
            </button>
          </div>`
            const notif = new DOMParser().parseFromString(notifHTML, 'text/html').body.firstChild;
            document.body.appendChild(notif);
            setTimeout(() => {
                notif.remove();
            }, 5000);
            document.getElementById('submitAttendees').disabled = false;
            document.getElementById('submitAttendees').innerText = 'Submit attendees';
            document.getElementById('closeAttendees').disabled = false;
        })
        document.getElementById('progress-bar').remove();
        modal.show();
    })
})

const addAttendee = (user_id, state) => {
    globalThis.attendingUsers = globalThis.attendingUsers.filter(id => id != user_id);
    globalThis.requiredUsers = globalThis.requiredUsers.filter(id => id != user_id);
    if (state == 'attd') {
        globalThis.attendingUsers.push(user_id);
    } else if (state == 'reqd') {
        globalThis.requiredUsers.push(user_id);
        globalThis.attendingUsers.push(user_id);
    }
}
globalThis.addAttendee = addAttendee;

const updateAttendance = async (attendee_id, session_id, workshop_id, value) => {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.id = 'progress-bar';
    const progressBarValue = document.createElement('div');
    progressBarValue.className = 'progress-bar-value';
    progressBar.appendChild(progressBarValue);
    document.body.prepend(progressBar);
    Array.from(document.querySelectorAll('input[type=radio], .bx--btn--danger')).forEach(el => el.disabled = true);
    const response = await fetch('//' + window.location.host + `/scripts/php/attendanceWs.php?action=Attendance`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `attendee_id=${attendee_id}&session_id=${session_id}&workshop_id=${workshop_id}&value=${value}`
    })
    try {
        var data = await response.json();
    } catch (error) {
        document.getElementById('progress-bar').classList.add('error')
        const notifHTML = `<div data-notification
        class="bx--inline-notification bx--inline-notification--error"
        role="alert">
        <div class="bx--inline-notification__details">
          <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z"></path><path d="M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z" data-icon-path="inner-path" opacity="0"></path></svg>
          <div class="bx--inline-notification__text-wrapper">
            <p class="bx--inline-notification__title">Error setting attendance</p>
            <p class="bx--inline-notification__subtitle">There was an error setting the requested attendance data. This can be caused by a variety of issues; which may include network issues, authentication issues, or et cetera. Try reloading the page, signing out and signing back in, and if issues persist, contact us here. Error details: endpoint returned bad data </p> <!--TODO: actually add this form(?) or whatever it'll be--> 
          </div>
        </div>
      </div>`
        const notif = new DOMParser().parseFromString(notifHTML, 'text/html').body.firstChild;
        document.body.appendChild(notif);
        throw error;
    }
    if (data.success) {
        const attendee = context.workshop.attendees.find(attendee => attendee.user_id == attendee_id);
        const oldAttd = attendee.attendance || 'Empty';
        attendee.attendance = value;
        Array.from(document.querySelectorAll('input[type=radio], .bx--btn--danger')).forEach(el => el.disabled = false);
        document.getElementById('progress-bar').remove();
        Array.from(document.querySelectorAll('.bx--inline-notification')).forEach(el => el.remove());
        const notifHTML = `<div data-notification
            class="bx--inline-notification bx--inline-notification--success"
            role="alert">
            <div class="bx--inline-notification__details">
              <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10,1c-4.9,0-9,4.1-9,9s4.1,9,9,9s9-4,9-9S15,1,10,1z M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z"></path><path fill="none" d="M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z" data-icon-path="inner-path" opacity="0"></path></svg>
              <div class="bx--inline-notification__text-wrapper">
                <p class="bx--inline-notification__title">Attendance recorded</p>
                <p class="bx--inline-notification__subtitle">The attendance record for ${attendee.first_name} has successfully been updated from ${oldAttd} to ${value}.</p>
              </div>
            </div>
            <button data-notification-btn class="bx--inline-notification__close-button" type="button"
              aria-label="close">
              <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__close-icon" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z"></path></svg>
            </button>
          </div>`
        const notif = new DOMParser().parseFromString(notifHTML, 'text/html').body.firstChild;
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.remove();
        }, 5000);
    } else {
        document.getElementById('progress-bar').classList.add('error')
        const notifHTML = `<div data-notification
        class="bx--inline-notification bx--inline-notification--error"
        role="alert">
        <div class="bx--inline-notification__details">
          <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z"></path><path d="M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z" data-icon-path="inner-path" opacity="0"></path></svg>
          <div class="bx--inline-notification__text-wrapper">
            <p class="bx--inline-notification__title">Error setting attendance</p>
            <p class="bx--inline-notification__subtitle">There was an error setting the requested attendance data. This can be caused by a variety of issues; which may include network issues, authentication issues, or et cetera. Try reloading the page, signing out and signing back in, and if issues persist, contact us here. Error details: endpoint returned non success status </p> <!--TODO: actually add this form(?) or whatever it'll be--> 
          </div>
        </div>
      </div>`
        const notif = new DOMParser().parseFromString(notifHTML, 'text/html').body.firstChild;
        throw new Error('Endpoint returned non success status');
    }
}
globalThis.updateAttendance = updateAttendance;

const deleteAttendance = async (attendee_id, session_id, workshop_id) => {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.id = 'progress-bar';
    const progressBarValue = document.createElement('div');
    progressBarValue.className = 'progress-bar-value';
    progressBar.appendChild(progressBarValue);
    document.body.prepend(progressBar);
    Array.from(document.querySelectorAll('input[type=radio], .bx--btn--danger')).forEach(el => el.disabled = true);
    const response = await fetch('//' + window.location.host + `/scripts/php/attendanceWs.php?action=Delete`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `attendee_id=${attendee_id}&session_id=${session_id}&workshop_id=${workshop_id}`
    })
    try {
        var data = await response.json();
    } catch (error) {
        document.getElementById('progress-bar').classList.add('error')
        const notifHTML = `<div data-notification
        class="bx--inline-notification bx--inline-notification--error"
        role="alert">
        <div class="bx--inline-notification__details">
          <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z"></path><path d="M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z" data-icon-path="inner-path" opacity="0"></path></svg>
          <div class="bx--inline-notification__text-wrapper">
            <p class="bx--inline-notification__title">Error setting attendance</p>
            <p class="bx--inline-notification__subtitle">There was an error setting the requested attendance data. This can be caused by a variety of issues; which may include network issues, authentication issues, or et cetera. Try reloading the page, signing out and signing back in, and if issues persist, contact us here. Error details: endpoint returned bad data </p> <!--TODO: actually add this form(?) or whatever it'll be--> 
          </div>
        </div>
      </div>`
        const notif = new DOMParser().parseFromString(notifHTML, 'text/html').body.firstChild;
        document.body.appendChild(notif);
        throw error
    }
    if (data.success) {
        const attendee = context.workshop.attendees.find(attendee => attendee.user_id == attendee_id);
        context.workshop.attendees.splice(context.workshop.attendees.indexOf(attendee), 1);
        document.getElementById('attendee-' + attendee.id).remove();
        Array.from(document.querySelectorAll('input[type=radio], .bx--btn--danger')).forEach(el => el.disabled = false);
        document.getElementById('progress-bar').remove();
        Array.from(document.querySelectorAll('.bx--inline-notification')).forEach(el => el.remove());
        const notifHTML = `<div data-notification
            class="bx--inline-notification bx--inline-notification--success"
            role="alert">
            <div class="bx--inline-notification__details">
              <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10,1c-4.9,0-9,4.1-9,9s4.1,9,9,9s9-4,9-9S15,1,10,1z M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z"></path><path fill="none" d="M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z" data-icon-path="inner-path" opacity="0"></path></svg>
              <div class="bx--inline-notification__text-wrapper">
                <p class="bx--inline-notification__title">Entry deleted</p>
                <p class="bx--inline-notification__subtitle">${attendee.first_name} has successfully been removed from the workshop.</p>
              </div>
            </div>
            <button data-notification-btn class="bx--inline-notification__close-button" type="button"
              aria-label="close">
              <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__close-icon" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z"></path></svg>
            </button>
          </div>`
        const notif = new DOMParser().parseFromString(notifHTML, 'text/html').body.firstChild;
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.remove();
        }, 5000);
    } else {
        document.getElementById('progress-bar').classList.add('error')
        const notifHTML = `<div data-notification
        class="bx--inline-notification bx--inline-notification--error"
        role="alert">
        <div class="bx--inline-notification__details">
          <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z"></path><path d="M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z" data-icon-path="inner-path" opacity="0"></path></svg>
          <div class="bx--inline-notification__text-wrapper">
            <p class="bx--inline-notification__title">Error removing student</p>
            <p class="bx--inline-notification__subtitle">There was an error setting the requested attendance data. This can be caused by a variety of issues; which may include network issues, authentication issues, or et cetera. Try reloading the page, signing out and signing back in, and if issues persist, contact us here. Error details: endpoint returned non success status </p> <!--TODO: actually add this form(?) or whatever it'll be--> 
          </div>
        </div>
      </div>`
        const notif = new DOMParser().parseFromString(notifHTML, 'text/html').body.firstChild;
        throw new Error('Error setting attendance data');
    }
}
globalThis.deleteAttendance = deleteAttendance;

const updateNote = async (event, attendee_id, session_id, workshop_id) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.id = 'progress-bar';
        const progressBarValue = document.createElement('div');
        progressBarValue.className = 'progress-bar-value';
        progressBar.appendChild(progressBarValue);
        document.body.prepend(progressBar);
        Array.from(document.querySelectorAll('input[type=radio], .bx--btn--danger')).forEach(el => el.disabled = true);
        const response = await fetch('//' + window.location.host + `/scripts/php/attendanceWs.php?action=Note`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `attendee_id=${attendee_id}&session_id=${session_id}&workshop_id=${workshop_id}&value=${event.target.value}`
        })
        try {
            var data = await response.json();
        } catch (error) {
            document.getElementById('progress-bar').classList.add('error')
            const notifHTML = `<div data-notification
            class="bx--inline-notification bx--inline-notification--error"
            role="alert">
            <div class="bx--inline-notification__details">
              <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z"></path><path d="M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z" data-icon-path="inner-path" opacity="0"></path></svg>
              <div class="bx--inline-notification__text-wrapper">
                <p class="bx--inline-notification__title">Error setting attendance</p>
                <p class="bx--inline-notification__subtitle">There was an error setting the requested attendance data. This can be caused by a variety of issues; which may include network issues, authentication issues, or et cetera. Try reloading the page, signing out and signing back in, and if issues persist, contact us here. Error details: endpoint returned bad data </p> <!--TODO: actually add this form(?) or whatever it'll be--> 
              </div>
            </div>
          </div>`
            const notif = new DOMParser().parseFromString(notifHTML, 'text/html').body.firstChild;
            document.body.appendChild(notif);
            throw error
        }
        if (data.success) {
            const attendee = context.workshop.attendees.find(attendee => attendee.user_id == attendee_id);
            attendee.note = event.target.value;
            event.target.blur();
            Array.from(document.querySelectorAll('input[type=radio], .bx--btn--danger')).forEach(el => el.disabled = false);
            document.getElementById('progress-bar').remove();
            Array.from(document.querySelectorAll('.bx--inline-notification')).forEach(el => el.remove());
            const notifHTML = `<div data-notification
                class="bx--inline-notification bx--inline-notification--success"
                role="alert">
                <div class="bx--inline-notification__details">
                  <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10,1c-4.9,0-9,4.1-9,9s4.1,9,9,9s9-4,9-9S15,1,10,1z M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z"></path><path fill="none" d="M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z" data-icon-path="inner-path" opacity="0"></path></svg>
                  <div class="bx--inline-notification__text-wrapper">
                    <p class="bx--inline-notification__title">Note updated</p>
                    <p class="bx--inline-notification__subtitle">The attendance record for ${attendee.first_name} has successfully been updated with note "${event.target.value}".</p>
                  </div>
                </div>
                <button data-notification-btn class="bx--inline-notification__close-button" type="button"
                  aria-label="close">
                  <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__close-icon" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z"></path></svg>
                </button>
              </div>`
            const notif = new DOMParser().parseFromString(notifHTML, 'text/html').body.firstChild;
            document.body.appendChild(notif);
            setTimeout(() => {
                notif.remove();
            }, 5000);
        } else {
            document.getElementById('progress-bar').classList.add('error')
            const notifHTML = `<div data-notification
            class="bx--inline-notification bx--inline-notification--error"
            role="alert">
            <div class="bx--inline-notification__details">
              <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z"></path><path d="M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z" data-icon-path="inner-path" opacity="0"></path></svg>
              <div class="bx--inline-notification__text-wrapper">
                <p class="bx--inline-notification__title">Error setting note</p>
                <p class="bx--inline-notification__subtitle">There was an error setting the requested attendance data. This can be caused by a variety of issues; which may include network issues, authentication issues, or et cetera. Try reloading the page, signing out and signing back in, and if issues persist, contact us here. Error details: endpoint returned non success status </p> <!--TODO: actually add this form(?) or whatever it'll be--> 
              </div>
            </div>
          </div>`
            const notif = new DOMParser().parseFromString(notifHTML, 'text/html').body.firstChild;
            document.body.appendChild(notif);
            throw new Error('Endpoint returned non success status')
        }
    }
}
globalThis.updateNote = updateNote;

const noteBlur = async (event, attendee_id) => {
    const attendee = context.workshop.attendees.find(attendee => attendee.id == attendee_id);
    event.target.value = attendee.note;
}
globalThis.noteBlur = noteBlur;