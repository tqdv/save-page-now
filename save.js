(async function () {
// Content script for web.archive.org/save which fills and submits the form for the user

'use strict';

console.info("Running save.js content script");

// 1. Ask the background page what url we should save

let url = await browser.runtime.sendMessage({type: 'get_url_to_save'})
if (url === null) {
	// This page wasn't opened by us, do nothing
	console.info("Nothing to do :)")
	return
}
if (typeof(url) !== 'string') {
	console.error("The url to save isn't a string:")
	console.error(url)
	return
}
if (!url.includes('://')) {
	console.error(`The url to save doesn't seem to be a url: ${url}`)
	return
}

// 2. Wait for the page to load

// NB I _think_ the content script executes after the page has loaded, so this code might never run
if (document.readyState === 'loading') {
	let dom_ready = new Promise((resolve) => {
		document.addEventListener('DOMContentLoaded', resolve)
	})
	console.debug("Aha! We did wait for the page to load!")
	await dom_ready
}

// 3. Find the url text field and set it to the url

let url_field = document.getElementById('web-save-url-input')
if (url_field === null) {
	console.warn("Could not find url text field to fill")
	return
}
url_field.value = url

// 4. Submit the form

let form = document.getElementById('web-save-form')
if (form === null) {
	console.warn("Could not find form element")
	return
}

// NB We don't use form.submit() because it won't trigger the submit event
let submit_button = form.getElementsByClassName('web-save-button')[0]
if (submit_button === undefined) {
	console.log("Could not find the form's submit button")
	return
}
submit_button.click()

})();