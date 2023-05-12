document.addEventListener('contextProvided', () => {
    document.getElementById('titleName').innerText = "Events Owned - " + context.myEvent.name;
    document.getElementById('mobileEventName').innerHTML = context.myEvent.name;
    context.myEvent.sessions.forEach((session) => {
        const accordionRowHTML = `<li data-accordion-item class="bx--accordion__item">
        <button class="bx--accordion__heading" aria-expanded="false" aria-controls="pane${session.id}">
          <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--accordion__arrow" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M11 8L6 13 5.3 12.3 9.6 8 5.3 3.7 6 3z"></path></svg>
          <div class="bx--accordion__title">${session.name}</div>
        </button>
        <div id="pane${session.id}" class="bx--accordion__content">
          <i>No workshops owned.</i>
        </div>
      </li>`
        const accordionRow = new DOMParser().parseFromString(accordionRowHTML, 'text/html').body.firstChild;
        const ownedEvents = session.workshops.map((workshop) => {
            if (workshop.owner_id == context.userSession.id) {
                return `<div class="bx--tile" onclick="window.location.href = '/event_workshop.php?workshop_id=${workshop.id}&session_id=${session.id}'">
                <h4>${workshop.name}</h4>
                <p>${workshop.description}</p>
              </div>`
            }
        })
        if (ownedEvents.filter(Boolean).length > 0) {
            const ownedEventsConcat = ownedEvents.join('');
            accordionRow.querySelector('.bx--accordion__content').innerHTML = ownedEventsConcat;
        }
        document.querySelector('.bx--accordion').appendChild(accordionRow);
    })
})