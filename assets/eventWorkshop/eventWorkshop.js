document.addEventListener('contextProvided', () => {
    document.getElementById('otherSessions').addEventListener('click', () => {alert('Not implemented yet (lacking view model)')});
    document.getElementById('addAttendee').addEventListener('click', () => {alert('Not implemented yet (lacking view model)')});
    document.getElementById('titleName').innerText = "Workshop Management - " + context.workshop.name;
    document.getElementById('mobileEventName').innerText = context.workshop.name;
    document.getElementById('pagePrev').addEventListener('click', () => {window.location.href = "/event_owner.php?event_id=" + context.workshop.id;})
    document.getElementById('description').innerHTML = `<svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16"><polygon points="17 22 17 14 13 14 13 16 15 16 15 22 12 22 12 24 20 24 20 22 17 22" /><path d="M16,8a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,16,8Z" /><path d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z" /></svg> ${context.workshop.description}`;
    document.getElementById('time').innerHTML = `<svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16"><path d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z" /><polygon points="20.59 22 15 16.41 15 7 17 7 17 15.58 22 20.59 20.59 22" /></svg> ${context.workshop.session_start_time} - ${context.workshop.session_end_time} on ${context.workshop.event_date}`;
    document.getElementById('capacity').innerHTML = `<svg id="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path d="M26,14H24v2h2a3.0033,3.0033,0,0,1,3,3v4h2V19A5.0058,5.0058,0,0,0,26,14Z" transform="translate(0 0)" /><path d="M24,4a3,3,0,1,1-3,3,3,3,0,0,1,3-3m0-2a5,5,0,1,0,5,5A5,5,0,0,0,24,2Z" transform="translate(0 0)" /><path d="M23,30H21V28a3.0033,3.0033,0,0,0-3-3H14a3.0033,3.0033,0,0,0-3,3v2H9V28a5.0059,5.0059,0,0,1,5-5h4a5.0059,5.0059,0,0,1,5,5Z" transform="translate(0 0)" /><path d="M16,13a3,3,0,1,1-3,3,3,3,0,0,1,3-3m0-2a5,5,0,1,0,5,5A5,5,0,0,0,16,11Z" transform="translate(0 0)" /><path d="M8,14H6a5.0059,5.0059,0,0,0-5,5v4H3V19a3.0033,3.0033,0,0,1,3-3H8Z" transform="translate(0 0)" /><path d="M8,4A3,3,0,1,1,5,7,3,3,0,0,1,8,4M8,2a5,5,0,1,0,5,5A5,5,0,0,0,8,2Z" transform="translate(0 0)" /></svg> ${context.workshop.attendees.length} / ${context.workshop.max_attendees}`;
    document.getElementById('owners').innerHTML = `<svg id="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path d="M16,22a4,4,0,1,0-4-4A4,4,0,0,0,16,22Zm0-6a2,2,0,1,1-2,2A2,2,0,0,1,16,16Z" /><rect x="14" y="6" width="4" height="2" /><path d="M24,2H8A2.002,2.002,0,0,0,6,4V28a2.0023,2.0023,0,0,0,2,2H24a2.0027,2.0027,0,0,0,2-2V4A2.0023,2.0023,0,0,0,24,2ZM20,28H12V26a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Zm2,0V26a3,3,0,0,0-3-3H13a3,3,0,0,0-3,3v2H8V4H24V28Z" /></svg> ${context.workshop.owner_first} ${context.workshop.owner_last} (${context.workshop.owner_email})`;
    context.workshop.attendees.forEach(attendee => {
        const rowHTML = `<table><tbody><tr>
        <td>
            ${attendee.last_name}, ${attendee.first_name}
        </td>
        <td>
            ${attendee.participate_type}
        </td>
        <td>
            ${attendee.required ? 'Yes' : 'No'}
        </td>
        <td style="width: 26rem;">
        <div class="bx--form-item">
        <div class="bx--radio-button-group ">
                <div class="bx--radio-button-wrapper">
                <input id="radio-button-${attendee.id}-present" class="bx--radio-button" type="radio" value="present" name="radio-button${attendee.id}" tabindex="0" ${attendee.attendance == 'Present' ? 'checked' : ''} onchange="window.location.href = '/scripts/php/process/events.php?type=workshop&amp;action=attendance&amp;value=Present&amp;attendee_id=${attendee.user_id}&amp;session_id=${context.workshop.session_id}&amp;workshop_id=${context.workshop.id}'">
                <label for="radio-button-${attendee.id}-present" class="bx--radio-button__label">
                    <span class="bx--radio-button__appearance"></span>
                    <span class="bx--radio-button__label-text">Present</span>
                </label>
                </div>
                <div class="bx--radio-button-wrapper">
                <input id="radio-button-${attendee.id}-absent" class="bx--radio-button" type="radio" value="absent" name="radio-button${attendee.id}" tabindex="0" ${attendee.attendance == 'Absent' ? 'checked' : ''} onchange="window.location.href = '/scripts/php/process/events.php?type=workshop&amp;action=attendance&amp;value=Absent&amp;attendee_id=${attendee.user_id}&amp;session_id=${context.workshop.session_id}&amp;workshop_id=${context.workshop.id}'">
                <label for="radio-button-${attendee.id}-absent" class="bx--radio-button__label">
                    <span class="bx--radio-button__appearance"></span>
                    <span class="bx--radio-button__label-text">Absent</span>
                </label>
                </div>
                <div class="bx--radio-button-wrapper">
                <input id="radio-button-${attendee.id}-tardy" class="bx--radio-button" type="radio" value="tardy" name="radio-button${attendee.id}" tabindex="0" ${attendee.attendance == 'Tardy' ? 'checked' : ''} onchange="window.location.href = '/scripts/php/process/events.php?type=workshop&amp;action=attendance&amp;value=Tardy&amp;attendee_id=${attendee.user_id}&amp;session_id=${context.workshop.session_id}&amp;workshop_id=${context.workshop.id}'">
                <label for="radio-button-${attendee.id}-tardy" class="bx--radio-button__label">
                    <span class="bx--radio-button__appearance"></span>
                    <span class="bx--radio-button__label-text">Tardy</span>
                </label>
                </div>
            </div>
        </div>
              <button
                class="bx--btn bx--btn--danger bx--btn--sm"
                aria-label="danger"  type="button" onclick="window.location.href = 'scripts/php/process/events.php?type=workshop&amp;action=delete_attendee&amp;entryi_id=${attendee.id}&amp;session_id=${context.workshop.session_id}&amp;workshop_id=${context.workshop.id}'">
                Remove
                </button>
        </td>
    </tr></tbody></table>`
    console.log(attendee, attendee.attendance, attendee.attendance == 'Present')
        const rowElement = new DOMParser().parseFromString(rowHTML, 'text/html').querySelector('tr');
        document.getElementById('rowTarget').appendChild(rowElement);
    })
})