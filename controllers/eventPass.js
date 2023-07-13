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
    const response = await fetch('//' + window.location.host + '/scripts/php/eventWs.php?scope=my&id=' + eventId);
    try {
      var json = await response.json();
    } catch (error) {
      throwContextError('Error parsing JSON response from server. Event might not exist, see issue #.'); // TODO: issue #
      throw error;
    }
    if (response.status !== 200) {
      if (json && json.code === 'unauthenticated') {
        window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href.replace(window.location.origin, ''));
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
    document.getElementById('titleName').innerText = "Event Pass - " + context.myEvent.name;
    document.getElementById('titleName').classList.remove('bx--skeleton__text')
    document.getElementById('titleName').classList.remove('bx--skeleton__heading')
    document.getElementById('mobileEventName').innerText = context.myEvent.name;
    document.getElementById('mobileEventName').classList.remove('bx--skeleton__text')
    document.getElementById('mobileEventName').classList.remove('bx--skeleton__heading')
    document.getElementById('eventDesc').innerHTML = context.myEvent.event_description;
    document.getElementById('eventDesc').classList.remove('bx--skeleton__text')
    document.getElementById('eventType').innerHTML = context.myEvent.ev_type + ' - ' + context.myEvent.ev_type_description;
    document.getElementById('eventType').classList.remove('bx--skeleton__text')
    const eventDate = new Date(Date.parse(context.myEvent.e_date) + 14400000);
    const eventStart = new Date(Date.parse(context.myEvent.start_time) + 14400000);
    const eventEnd = new Date(Date.parse(context.myEvent.end_time) + 14400000);
    const eventTimeString = eventDate.toLocaleDateString() + ' (' + eventStart.toLocaleTimeString() + ' - ' + eventEnd.toLocaleTimeString() + ')';
    document.getElementById('eventDate').innerHTML = eventTimeString;
    document.getElementById('eventDate').classList.remove('bx--skeleton__text')
    const eventRegOpen = new Date(context.myEvent.reg_open);
    const eventRegClose = new Date(context.myEvent.reg_close);
    const eventRegTimeString = eventRegOpen.toLocaleDateString() + ' - ' + eventRegClose.toLocaleDateString();
    document.getElementById('eventRegWindow').innerHTML = eventRegTimeString;
    document.getElementById('eventRegWindow').classList.remove('bx--skeleton__text')
    Array.from(document.querySelectorAll('.secondLevelContainer > .bx--tile')).forEach((tile) => {tile.remove()});
    document.getElementById('modifyReg').addEventListener('click', () => {window.location.href = 'EventRegister.html?id=' + context.myEvent.id});
    if (context.myEvent.sessions.length <= 0) {
        const message = document.createElement('i');
        message.innerHTML = 'You have not registered for this event yet. Please use the modify registration button above to register for this event.';
        document.querySelector('.secondLevelContainer').appendChild(message);
    } else {
        context.myEvent.sessions.forEach((session, index) => {
            const eventHTML = session.workshops.map((workshop) => {
                return `
                <h4>${workshop.name}</h4>
                <p><svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16">
                    <path d="M18,30H14a2,2,0,0,1-2-2V21a2,2,0,0,1-2-2V13a3,3,0,0,1,3-3h6a3,3,0,0,1,3,3v6a2,2,0,0,1-2,2v7A2,2,0,0,1,18,30ZM13,12a.94.94,0,0,0-1,1v6h2v9h4V19h2V13a.94.94,0,0,0-1-1Z"/>
                    <path d="M16,9a4,4,0,1,1,4-4h0A4,4,0,0,1,16,9Zm0-6a2,2,0,1,0,2,2h0a2,2,0,0,0-2-2Z"/>
                </svg>
                ${workshop.owner_first + ' ' + workshop.owner_last}</p>
                <p><svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16">
                    <path d="M16,18a5,5,0,1,1,5-5A5.0057,5.0057,0,0,1,16,18Zm0-8a3,3,0,1,0,3,3A3.0033,3.0033,0,0,0,16,10Z"/>
                    <path d="M16,30,7.5645,20.0513c-.0479-.0571-.3482-.4515-.3482-.4515A10.8888,10.8888,0,0,1,5,13a11,11,0,0,1,22,0,10.8844,10.8844,0,0,1-2.2148,6.5973l-.0015.0025s-.3.3944-.3447.4474ZM8.8125,18.395c.001.0007.2334.3082.2866.3744L16,26.9079l6.91-8.15c.0439-.0552.2783-.3649.2788-.3657A8.901,8.901,0,0,0,25,13,9,9,0,1,0,7,13a8.9054,8.9054,0,0,0,1.8125,5.395Z"/>
                  </svg>
                  ${workshop.location}</p>
                <p><svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16">
                    <polygon points="17 22 17 14 13 14 13 16 15 16 15 22 12 22 12 24 20 24 20 22 17 22"/>
                    <path d="M16,8a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,16,8Z"/>
                    <path d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z"/>
                  </svg>
                  ${workshop.description}</p>`
            })
            let eventHTMLConcat;
            eventHTML.forEach((html) => {
                eventHTMLConcat += html;
            })
            const passTileHTML = `<div class="bx--tile">
            <h1>${index + 1}</h1>
            <h2 class="eventName">${session.name}</h2>
            <h2 class="time">${new Date(Date.parse(session.start_time) + 14400000).toLocaleTimeString() + ' - ' + new Date(Date.parse(session.start_time) + 14400000).toLocaleTimeString()}</h2>
            ${eventHTMLConcat}
        </div>`.replace('undefined', '');
            const passTile = new DOMParser().parseFromString(passTileHTML, 'text/html').body.firstChild;
            document.querySelector('.secondLevelContainer').appendChild(passTile);
        })
    }
})