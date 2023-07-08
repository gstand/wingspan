window.addEventListener('load', async () => {
    await getUserSession();
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id');
    if (!eventId) {
        throwContextError("No event ID provided in URL.");
        throw new Error('No event ID provided');
    }
    if (window.location.hash === '#sessions') {
        document.getElementById('sessionsButton').click();
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
            window.location.href = 'Login.html?redirect=' + window.location.href.replace(window.location.origin, '');
        } else {
            throwContextError('HTTP error when fetching event data: ' + response.status + ' ' + response.statusText);
            throw new Error('HTTP error ' + response.status);
        }
    }
    globalThis.context.myEvent = json;
    document.dispatchEvent(contextProvided);
    document.getElementById('progress-bar').remove();
})

document.addEventListener('contextProvided', () => {
    document.getElementById('titleName').innerHTML = "Event Details - " + context.myEvent.name;
    document.querySelector('title').innerHTML = "Event Details - " + context.myEvent.name + " - Innovation Academy Events";
    document.getElementById('titleName').classList.remove(['bx--skeleton__text', 'bx--skeleton__heading']);
    document.getElementById('eventDesc').innerHTML = context.myEvent.event_description;
    document.getElementById('eventDesc').classList.remove('bx--skeleton__text');
    document.getElementById('eventType').innerHTML = context.myEvent.ev_type + ' - ' + context.myEvent.ev_type_description;
    document.getElementById('eventType').classList.remove('bx--skeleton__text');
    const eventDate = new Date(Date.parse(context.myEvent.e_date) + 14400000);
    const eventStart = new Date(Date.parse(context.myEvent.start_time) + 14400000);
    const eventEnd = new Date(Date.parse(context.myEvent.end_time) + 14400000);
    const eventTimeString = eventDate.toLocaleDateString() + ' (' + eventStart.toLocaleTimeString() + ' - ' + eventEnd.toLocaleTimeString() + ')';
    document.getElementById('eventDate').innerHTML = eventTimeString;
    document.getElementById('eventDate').classList.remove('bx--skeleton__text');
    const eventRegOpen = new Date(context.myEvent.reg_open);
    const eventRegClose = new Date(context.myEvent.reg_close);
    const eventRegTimeString = eventRegOpen.toLocaleDateString() + ' - ' + eventRegClose.toLocaleDateString();
    document.getElementById('eventRegWindow').innerHTML = eventRegTimeString;
    document.getElementById('eventRegWindow').classList.remove('bx--skeleton__text');
    document.getElementById('register').onclick = () => { window.location.href = `EventRegister.html?id=${context.myEvent.id}` }
    if (!context.myEvent.can_admin) {
        document.getElementById('adminCol').remove();
        document.getElementById('attendee').remove();
        document.getElementById('edit').remove();
        document.getElementById('delete').remove();
        document.getElementById('addSession').classList.add('bx--btn--disabled')
    } else {
        document.getElementById('attendee').onclick = () => { window.location.href = `https://fcsia-event.codefi.com/samples/event_attendee_report.php?event_id=${context.myEvent.id}` }
        document.getElementById('edit').onclick = () => { window.location.href = `https://fcsia-event.codefi.com/samples/event_create.php?action=edit&id=${context.myEvent.id}` }
        document.getElementById('delete').onclick = () => { window.location.href = `https://fcsia-event.codefi.com/samples/scripts/php/process/events.php?type=event&action=delete&id=${context.myEvent.id}` }
        document.getElementById('addSession').onclick = () => { window.location.href = `https://fcsia-event.codefi.com/samples/event_session_create.php?event_id=${context.myEvent.id}` }
    }
    Array.from(document.getElementById('rowTarget').children).forEach((row) => { row.remove() });
    context.myEvent.sessions.forEach((session) => {
        const rowHTML = `<table><tbody><tr class="bx--parent-row" data-parent-row>
        <td class="bx--table-expand" data-event="expand">
            <button class="bx--table-expand__button">
                <svg focusable="false" preserveAspectRatio="xMidYMid meet"
                    style="will-change: transform;"
                    xmlns="http://www.w3.org/2000/svg" class="bx--table-expand__svg" width="16"
                    height="16"
                    viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M11 8L6 13 5.3 12.3 9.6 8 5.3 3.7 6 3z"></path>
                </svg>
            </button>
        </td>
        <td>
            <a href="https://fcsia-event.codefi.com/samples/event_session.php?id=${session.id}">${session.name}</a>
        </td>
        <td>
            ${session.description}
        </td>
        <td>
            ${new Date(Date.parse(session.start_time) + 14400000).toLocaleTimeString()} - ${new Date(Date.parse(session.end_time) + 14400000).toLocaleTimeString()}
        </td>
        ${context.myEvent.can_admin ? `<td class="bx--table-column-menu">
        <div data-overflow-menu role="menu" tabindex="0" aria-label="Overflow menu description"
            class="bx--overflow-menu">
            <svg focusable="false" preserveAspectRatio="xMidYMid meet"
                style="will-change: transform;"
                xmlns="http://www.w3.org/2000/svg" class="bx--overflow-menu__icon" width="16"
                height="16"
                viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="3" r="1"></circle>
                <circle cx="8" cy="8" r="1"></circle>
                <circle cx="8" cy="13" r="1"></circle>
            </svg>
            <ul class="bx--overflow-menu-options bx--overflow-menu--flip">
                <li class="bx--overflow-menu-options__option bx--table-row--menu-option"
                    id='edit'>
                    <button class="bx--overflow-menu-options__btn"
                        onclick="window.location.href = 'https://fcsia-event.codefi.com/samples/event_session_create.php?action=edit&id=${session.id}'">
                        <div class="bx--overflow-menu-options__option-content">
                            <svg focusable="false" preserveAspectRatio="xMidYMid meet"
                                style="will-change: transform;"
                                xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 16 16" aria-hidden="true">
                                <path
                                    d="M1 13H15V14H1zM12.7 4.5c.4-.4.4-1 0-1.4 0 0 0 0 0 0l-1.8-1.8c-.4-.4-1-.4-1.4 0 0 0 0 0 0 0L2 8.8V12h3.2L12.7 4.5zM10.2 2L12 3.8l-1.5 1.5L8.7 3.5 10.2 2zM3 11V9.2l5-5L9.8 6l-5 5H3z">
                                </path>
                            </svg> Edit
                        </div>
                    </button>
                </li>
                <li class="bx--overflow-menu-options__option bx--table-row--menu-option"
                    id='delete'>
                    <button class="bx--overflow-menu-options__btn"
                        onclick="window.location.href = 'https://fcsia-event.codefi.com/samples/events.php?type=session&action=delete&id=${session.id}'">
                        <div class="bx--overflow-menu-options__option-content">
                            <svg focusable="false" preserveAspectRatio="xMidYMid meet"
                                style="will-change: transform;"
                                xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 16 16" aria-hidden="true">
                                <path d="M6 6H7V12H6zM9 6H10V12H9z"></path>
                                <path
                                    d="M2 3v1h1v10c0 .6.4 1 1 1h8c.6 0 1-.4 1-1V4h1V3H2zM4 14V4h8v10H4zM6 1H10V2H6z">
                                </path>
                            </svg> Delete
                        </div>
                    </button>
                </li>
            </ul>
        </div>
    </td>` : ''}
    </tr>
    <tr class="bx--expandable-row bx--expandable-row--hidden" data-child-row>
        <td colspan="8" class="eventExpandRow" id='eventRow${session.id}'>
            <div class="bx--child-row-inner-container">
                <section class="bx--structured-list">
                    <div class="bx--structured-list-thead">
                        <div class="bx--structured-list-row bx--structured-list-row--header-row">
                            <div class="bx--structured-list-th">Name</div>
                            <div class="bx--structured-list-th">Owner</div>
                            ${context.myEvent.can_admin ? `<div class="bx--structured-list-th"></div>` : ''}
                        </div>
                    </div>
                    <div class="bx--structured-list-tbody">
                    </div>
                </section>
                ${session.name === 'Tutoring Hour' ? `<div class="bx--link" id="showTeacherTutor${session.id}">Show teacher tutoring sessions...</div>` : ''}
            </div>
        </td>
    </tr></tbody></table>`
        const parser = new DOMParser();
        const rowElements = Array.from(parser.parseFromString(rowHTML, 'text/html').querySelectorAll('tr'));
        const workshopRows = session.workshops.map((workshop) => {
            const rowString = `<div class="bx--structured-list-row ${workshop.name === 'Tutoring with a Teacher' ? 'teacherTutor' : ''}">
            <div class="bx--structured-list-td bx--structured-list-content--nowrap">
                ${workshop.name}</div>
            <div class="bx--structured-list-td">
                ${workshop.owner_first + ' ' + workshop.owner_last}
            </div>
            ${context.myEvent.can_admin ? `<div class="bx--structured-list-td">
            <div class="bx--table-column-menu">
                <div data-overflow-menu role="menu" tabindex="0"
                    aria-label="Overflow menu description"
                    class="bx--overflow-menu">
                    <svg focusable="false" preserveAspectRatio="xMidYMid meet"
                        style="will-change: transform;"
                        xmlns="http://www.w3.org/2000/svg"
                        class="bx--overflow-menu__icon" width="16"
                        height="16"
                        viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="3" r="1"></circle>
                        <circle cx="8" cy="8" r="1"></circle>
                        <circle cx="8" cy="13" r="1"></circle>
                    </svg>
                    <ul
                        class="bx--overflow-menu-options bx--overflow-menu--flip">
                        <li class="bx--overflow-menu-options__option bx--table-row--menu-option"
                            id='edit'>
                            <button class="bx--overflow-menu-options__btn"
                                onclick="window.location.href = 'https://fcsia-event.codefi.com/samples/event_workshop_create.php?action=edit&id=${workshop.id}'">
                                <div
                                    class="bx--overflow-menu-options__option-content">
                                    <svg focusable="false"
                                        preserveAspectRatio="xMidYMid meet"
                                        style="will-change: transform;"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16" height="16"
                                        viewBox="0 0 16 16" aria-hidden="true">
                                        <path
                                            d="M1 13H15V14H1zM12.7 4.5c.4-.4.4-1 0-1.4 0 0 0 0 0 0l-1.8-1.8c-.4-.4-1-.4-1.4 0 0 0 0 0 0 0L2 8.8V12h3.2L12.7 4.5zM10.2 2L12 3.8l-1.5 1.5L8.7 3.5 10.2 2zM3 11V9.2l5-5L9.8 6l-5 5H3z">
                                        </path>
                                    </svg> Edit
                                </div>
                            </button>
                        </li>
                        <li class="bx--overflow-menu-options__option bx--table-row--menu-option"
                            id='deleteinstance'>
                            <button class="bx--overflow-menu-options__btn"
                                onclick="window.location.href = 'https://fcsia-event.codefi.com/samples/scripts/php/process/events.php?type=workshop&action=delete_instance&session_id=${session.id}&id=${workshop.id}'">
                                <div
                                    class="bx--overflow-menu-options__option-content">
                                    <svg focusable="false"
                                        preserveAspectRatio="xMidYMid meet"
                                        style="will-change: transform;"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16" height="16"
                                        viewBox="0 0 16 16" aria-hidden="true">
                                        <path d="M6 6H7V12H6zM9 6H10V12H9z">
                                        </path>
                                        <path
                                            d="M2 3v1h1v10c0 .6.4 1 1 1h8c.6 0 1-.4 1-1V4h1V3H2zM4 14V4h8v10H4zM6 1H10V2H6z">
                                        </path>
                                    </svg> Delete instance
                                </div>
                            </button>
                        </li>
                        <li class="bx--overflow-menu-options__option bx--table-row--menu-option"
                            id='deleteseries'>
                            <button class="bx--overflow-menu-options__btn"
                                onclick="window.location.href = 'https://fcsia-event.codefi.com/samples/scripts/php/process/events.php?type=workshop&action=delete_series&id=${workshop.id}'">
                                <div
                                    class="bx--overflow-menu-options__option-content">
                                    <svg focusable="false"
                                        preserveAspectRatio="xMidYMid meet"
                                        style="will-change: transform;"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16" height="16"
                                        viewBox="0 0 16 16" aria-hidden="true">
                                        <path d="M6 6H7V12H6zM9 6H10V12H9z">
                                        </path>
                                        <path
                                            d="M2 3v1h1v10c0 .6.4 1 1 1h8c.6 0 1-.4 1-1V4h1V3H2zM4 14V4h8v10H4zM6 1H10V2H6z">
                                        </path>
                                    </svg> Delete series
                                </div>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>` : ''}
        </div>`
            return parser.parseFromString(rowString, 'text/html').querySelector('div');
        });
        const workshopRowsContainer = rowElements[1].querySelector('.bx--structured-list-tbody');
        workshopRows.forEach((workshopRow) => { workshopRowsContainer.appendChild(workshopRow) });
        rowElements.forEach((rowElement) => { document.getElementById('rowTarget').appendChild(rowElement) });
        if (session.name === 'Tutoring Hour') {
            document.getElementById(`showTeacherTutor${session.id}`).addEventListener('click', () => {
                if (!document.getElementById(`eventRow${session.id}`).classList.contains('showTutor')) {
                    document.getElementById(`eventRow${session.id}`).classList.add('showTutor');
                    document.getElementById(`showTeacherTutor${session.id}`).innerHTML = 'Hide teacher tutoring sessions...';
                } else {
                    document.getElementById(`eventRow${session.id}`).classList.remove('showTutor');
                    document.getElementById(`showTeacherTutor${session.id}`).innerHTML = 'Show teacher tutoring sessions...';
                }
            });
        }
    });
    const rows = document.querySelectorAll('#rowTarget > *')
    rows[rows.length - 1].firstElementChild.classList.add('lastRowNoSpacingRah');
    document.querySelectorAll('button.bx--table-sort').forEach((button) => { button.addEventListener('click', sortTableEvent) });
    document.querySelector('.bx--data-table.bx--skeleton').classList.remove('bx--skeleton');
});

const sortTableEvent = (event) => {
    const rows = Array.from(document.querySelectorAll('.bx--parent-row'))
    const expandableContent = Array.from(document.querySelectorAll('.bx--expandable-row-content'))
    const mergedRows = rows.map((row, index) => {
        if (event.target.querySelector('span').innerHTML === 'Time') {
            let sortedTime = row.children[event.target.parentElement.cellIndex].innerText.split(' - ')[0];
            if (sortedTime.includes(' PM')) {
                if (sortedTime.split(':')[0] !== '12') {
                    sortedTime = sortedTime.replace(' PM', '');
                    let timeChunks = sortedTime.split(':');
                    timeChunks[0] = (parseInt(timeChunks[0]) + 12).toString();
                    sortedTime = timeChunks.join(':');
                } else {
                    sortedTime = sortedTime.replace(' PM', '');
                }
            } else {
                sortedTime = sortedTime.replace(' AM', '');
            }
            let timeChunks = sortedTime.split(':');
            if (timeChunks[0].length === 1) {
                timeChunks[0] = '0' + timeChunks[0];
            }
            sortedTime = timeChunks.join(':');
            const sortedColumn = Date.parse(new Date(Date.parse(context.myEvent.e_date) + 14400000).toISOString().split('T')[0] + 'T' + sortedTime + '.000Z')
            console.log(sortedColumn, sortedTime, row)
            return { row: row, expandableContent: expandableContent[index], sortedColumn: sortedColumn };
        }
        return { row: row, expandableContent: expandableContent[index], sortedColumn: row.children[event.target.parentElement.cellIndex].innerText };
    })
    let sortedRows
    if (!event.target.classList.contains('bx--table-sort--active')) {
        if (globalThis.originalRows === undefined) {
            globalThis.originalRows = mergedRows;
        }
        sortedRows = mergedRows.sort((a, b) => {
            if (a.sortedColumn < b.sortedColumn) {
                return -1;
            }
            if (a.sortedColumn > b.sortedColumn) {
                return 1;
            }
            return 0;
        });
    } else if (event.target.classList.contains('bx--table-sort--ascending')) {
        sortedRows = mergedRows.sort((a, b) => {
            if (a.sortedColumn > b.sortedColumn) {
                return -1;
            }
            if (a.sortedColumn < b.sortedColumn) {
                return 1;
            }
            return 0;
        });
    } else if (event.target.classList.contains('bx--table-sort--active') && !event.target.classList.contains('bx--table-sort--ascending')) {
        sortedRows = globalThis.originalRows;
    }
    document.getElementById('rowTarget').innerHTML = '';
    sortedRows.forEach((row) => {
        document.getElementById('rowTarget').appendChild(row.row);
        document.getElementById('rowTarget').appendChild(row.expandableContent);
    });
}