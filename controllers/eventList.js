window.addEventListener('load', async () => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (type === 'open') {
        document.getElementById('titleName').innerText = 'Open Events';
        document.getElementById('createEvent').remove();
    }
    await getUserSession();
    const response = await fetch('//' + window.location.host + '/scripts/php/event-listWs.php' + (type === "open" ? '?type=Open' : ''));
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
            throwContextError('HTTP error when fetching event list: ' + response.status + ' ' + response.statusText);
            throw new Error('HTTP error ' + response.status);
        }
    }
    globalThis.context.myEventList = json;
    document.dispatchEvent(contextProvided);
    document.getElementById('progress-bar').remove();
})
document.addEventListener('contextProvided', () => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (context.myEventList.allowAdd) {
        document.getElementById('createEvent').style.display = 'inline';
    } else if (type !== 'open') { // in case of open type precontext above alr removed this so no need to do it twice, error will get thrown
        document.getElementById('createEvent').remove()
    }
    if (context.myEventList.events) {
        const eventElements = context.myEventList.events.map((event) => {
            const htmlString = `<tr>
            <td>
                <a href="Event.html?id=${event.id}">${event.name}</a>
            </td>
            <td>
                ${event.title ? event.title : "No title"}
            </td>
            <td class="bx--table-column-menu">
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
                        <li class="bx--overflow-menu-options__option bx--table-row--menu-option" id='register'>
                            <button class="bx--overflow-menu-options__btn"
                                onclick="window.location.href = 'EventRegister.html?id=${event.id}'">
                                <div class="bx--overflow-menu-options__option-content">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" width="16" height="16" focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;">
                                <polygon points="30,22 24,22 24,16 22,16 22,22 16,22 16,24 22,24 22,30 24,30 24,24 30,24 		" style="fill: #525252;"/>
                                <path d="M28,6c0-1.1-0.9-2-2-2h-4V2h-2v2h-8V2h-2v2H6C4.9,4,4,4.9,4,6v20c0,1.1,0.9,2,2,2h8v-2H6V6h4v2h2V6h8v2h2V6h4v8h2V6z" style="fill: #525252;"/>
                            </svg> Register
                                </div>
                            </button>
                        </li>
                        <li class="bx--overflow-menu-options__option bx--table-row--menu-option" id='edit'>
                            <button class="bx--overflow-menu-options__btn"
                                onclick="window.location.href = '/event_create.php?action=edit&id=${event.id}'">
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
                        <li class="bx--overflow-menu-options__option bx--table-row--menu-option" id='delete'>
                            <button class="bx--overflow-menu-options__btn"
                                onclick="window.location.href = '/events.php?type=event&action=delete&id=${event.id}'">
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
            </td>
        </tr>`
            const wrapperElement = document.createElement('table').createTBody()
            wrapperElement.innerHTML = htmlString
            const parsed = wrapperElement.firstChild
            if (!event.allowRegister) {
                parsed.getElementById('register').remove()
            }
            if (!event.allowEdit) {
                parsed.getElementById('edit').remove()
            }
            if (!event.allowDelete) {
                parsed.getElementById('delete').remove()
            }
            return parsed
        })
        const table = document.getElementById('eventRowContainer')
        table.innerHTML = ''
        eventElements.forEach((element) => { table.appendChild(element) })
        document.querySelector('#eventTable table').classList.remove('bx--skeleton')
    } else {
        throwContextError('No events found/returned')
    }
})