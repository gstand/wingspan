document.addEventListener('contextProvided', () => {
    document.getElementById('titleName').innerText = "Event Pass - " + context.myEvent.name;
    document.getElementById('mobileEventName').innerText = context.myEvent.name;
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
        <h2 class="time">${new Date(session.start_time).toLocaleTimeString() + ' - ' + new Date(session.end_time).toLocaleTimeString()}</h2>
        ${eventHTMLConcat}
    </div>`.replace('undefined', '');
        const passTile = new DOMParser().parseFromString(passTileHTML, 'text/html').body.firstChild;
        document.querySelector('.secondLevelContainer').appendChild(passTile);
    })
})