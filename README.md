![Logo](assets/lockup.svg)

# Wingspan - IA Events Redesign

This is my entry for redesigning [Innovation Academy's](https://www.fultonschools.org/innovationacademy) Flex Friday event signup page. This is part of the V1 "facelift" MVP, aiming to utilize the existing backend/code as is, but demangling the PHP (eugh) code that currently exists to further be refactored in the future. The frontend is being redesigned with using (relatively) the same service/data layers.

## How it works

This application is designed using the Carbon Design System by IBM and constructed with the accompanying Carbon Components packages as detailed [here.](https://carbondesignsystem.com/) The pages are running off of the VanillaJS framework that CC provides along with custom code written for the page that ensures compliance with the redesign guidelines. It is a completely standalone application that is designed with implementation into the existing code in forefront. There are some of the benefits of this implementation, as seen here...

### Rich UI and UX without the overhead

Most of the code and markup on the pages are static and plug-and-playable with the existing PHP presentation layer. No transpiled code is used nor any SSR technologies like React or et cetera, as those are outside of the redesign guidelines. It is essentially like Bootstrap in this manner—a component-esque UI without the overhead of other technologies. Additionally, CDS is natively responsive and this allows for this redesign to also be mobile-oriented in the process, one of the many sore-spots in the existing frontend. I personally also chose CDS for this app as I feel its design philosophy align with the aestetic of IA; modern, sleek, and streamline.

#### How it works

CDS' VanillaJS implementation comes with components from the 10th version of CDS itself. These are plain HTML elements that are styled with classes that are exposed from the Carbon stylesheet (example: `bx--header`) and are given basic UI logic (navbar button triggers navbar, et cetera) on initialization from the Carbon vJS module using data atrributes (example: `data-header`) and other properties of the "components" to enable an easy but rich UX at the convenience to the developer. This aforementioned module is imported on page initalization and the `common.js` initialization routines kickstart it's watch functions that allow elements rendered to the DOM post-initialization (example: the `<common-header>` or table rows that are generated from page context) to get bootstrapped with the CDS logic as well. Page styles also include specific styles that fix issues with the existing Carbon styles or otherwise fine tune properties and layouts to the page flow. `assets/frame/common.css`  includes a part that enables a `theme` attrribute on the `<html>` root element that, per the name, sets the page theme between the 4 Carbon themes, `white`, `g10`, `g90`, and `g100`—this can and is driven by the end user with the toggle switch in the user sidebar, toggling between `white` and `g100` themes.

### Context system: achieving a data-driven application

All page context and session information is passed on via JSON to the page on render by the PHP code, as demonstrated with the redesign samples in AngularJS. A rudimentary context system has been constructed for this use, as seen in `assets/frame/common.js`. Pages can use and consume data passed onto them using this system. A good example of this is the universal page frame on all pages (except login); user session context is passed as a part of every page and the frame consumes this context to determine the menus that are rendered/destroyed and fill in the user information panel. This is adventageous as this allows pages to handle context-dependent situations—such as hiding menus as aforementioned—using this system, which allows further flexibility then having to implement these functionalities in PHP, as well as modernizing the presentation layer as a whole, making it more independent from the older existing code as well as easier to work with for further development efforts.

#### How it works

There are a few structures defined in the `globalThis` namespace that is available globally on all pages where the `assets/frame/common.js` file is imported, as well as a `CustomElement` that exist for actually interfacing with the system in the DOM on serve, `<page-context>`. Once context is defined in `<page-context>` or otherwise using the `loadContext(context: Object)` method. Let's start with the former method as it'll roll into the second method in the process. Context is handled like this starting from the beginning of page load:

1. As soon as `common.js` loads, the `ContextTag` class is loaded and once the DOM is defined, `customElements.define('page-context', ContextTag)` is called to define the element.
    - The reason for the slightly late initialization is due to the fact that if the element is attempted to be initialized prior to the DOM being loaded, it'll attempt to read its `innerHTML` but fail since... nothings there.
2. The browser initalizes the element which is a very simple three statements; setting the element to be invisible (since the browser kicks it from the `<head>` to the `<body>` occasonally), parsing the JSON object in the element's `innerHTML` and handing it over to the aforementioned `loadContext` method.
3. This is where the second method starts if you directly define context using the JS method... for some reason. On load of `common.js`, it defines `globalThis.context: Object`, a simple object that is the page's context thats availible to all JavaScript scopes. This routine is again a very simple two methods, setting the context object and more importantly, firing the `contextProvided: Event` event to the `document` object.
4. Any page specific scripts, which have to be loaded between `common.js` and the invocation of `page-context`, subscribe the event and thus execute their specific handling routines to render the page and whatever else the page needs with the context.
    - Example: Another custom element called `<common-header>` is used for, per the name, loading the header template thats universal accross all pages onto the page—without the 263 line chunk of header code that would otherwise have to be copy and pasted across all the pages and also causing me much development pain having to maintain it as well across said pages. `common.js` itself subscribes to `contextProvided` and fills in the `userSession` details in the user side menu and omits certain nav menus on firing depending on permission levels.

#### How to implement

As aforementioned, this app uses on-render context that exists as JSON data in the `<page-context>` tag in the `<head>` of the page to allow for statefulness and dynamic interfaces. As it stands, the current boilerplate redesign implementation in Angular.JS can be migrated to this design fairly easily. By JSON-encoding any relevant session data into the `<page-context>` tag as the page is being served, it will be handled accordingly on the client-side. All pages also share a common `<head>` aside from page unique JS and CSS files. However, the head must be structured in a specific order as follows:

1. shared universal header:

```html
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="/assets/carbon.css">
<link rel="stylesheet" href="/assets/frame/common.css">
<script src="/assets/carbon.js"></script>
<script src="/assets/frame/common.js"></script>
```

2. any page specific logic/styles and et cetera
3. `<page-context>` tag

This is required due to the fact that the `common.js` initalization runtimes are required to run before any page specific code is ran but after Carbon initalizes so it can initalize the structures detailed above without issue. All `contextProvided` handlers need to be registered and subscribed before `<page-context>` is defined because otherwise, the event is fired before those handlers exist or are otherwise subscribed to the event itself.

##### Development mode

You can furthermore place a `<script>` tag at the absolute top of the head (or at the least, before `common.js` is declared) that contains `globalThis.devMode = true;`—this decleration enables a special routine to run that adds a button to the user sidebar menu (given the `<common-header>` is initalized) to present a similar context viewing system like the one that exists in the Angular.JS boilerplate.

### Keeping the future in mind

CDS provides VanillaJS functionality but its bread and butter implementation is in React. Using this framework and structuring the redesign with more modern development methodolgies as it is now allows the eventual jump to a entirely different application stack very streamlined for both the development team and the end-user. Additionally, effort has been made to consolidate reused surfaces and elements into easily reusable components, along with CDS' flexibility allowing easier development of new features/flows.

## Where to go from here

- [ ] Complete EventWorkshop flows, such as viewing other sessions and adding attendees (pending view model at time of writing)
- [ ] Consolidate CSS files into `common.css` for shared styles between pages, most stylesheets are overlapping between pages
- [ ] Migrate other flows/pages that weren't included in the initial haul and/or are pending view models

---

*Development credit [Garret Stand](https://github.com/gstand); all rights and obligations to the code and graphical designs/layouts herein (excluding the Garret Stand logo and Carbon Design System code) as well as the Phoenix branding above are released to Innovation Academy, Fulton County Schools, and its agents for use in their Flex Friday events app, with the request of design credit in the final application. The Garret Stand logo is the property and Copyright © 2023 of Garret Stand under [SP Holdings LLC.](https://www.spholdings.us/); all rights reserved. The [Carbon Design System](https://carbondesignsystem.com/) code, graphical designs, and layouts is the Copyright © 2016, 2023 [IBM Corporation](https://ibm.com/), relased under the Apache-2.0 license.*
