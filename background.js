'use strict';

var urls = new Map() // map of tab ids to urls to save
var menuEntryId = "page-menu-entry"
var linkMenuEntryId = "link-menu-entry"

// Start the archiving process
async function archive(url, openerTabId) {
	console.info(`Archiving ${url}`)
	let created_tab = await browser.tabs.create({
		url: 'https://web.archive.org/save',
		openerTabId,
	})
	urls.set(created_tab.id, url)
}

// Event listeners

async function onBrowserActionClicked(tab) {
	console.debug("Browser action clicked")
	await archive(tab.url, tab.id)
}

async function onMenuClicked(info, tab) {
	if (info.menuItemId === menuEntryId) {
		console.debug("Menu entry clicked on page or tab")
		await archive(info.pageUrl, tab.id)
	} else if (info.menuItemId === linkMenuEntryId) {
		console.debug("Menu entry clicked on link")
		await archive(info.linkUrl, tab.id)
	} else {
		return
	}
}

function onMessageReceived(message, sender, sendResponse) {
	if (typeof(message) === 'object' && message !== null) {
		let {type, value} = message
		if (type === undefined) {
			return
		}
		
		if (type === 'get_url_to_save') {
			let tab_id = sender.tab.id
			let url = urls.get(tab_id)
			if (url === undefined) {
				sendResponse(null)
			} else {
				sendResponse(url)
				urls.delete(tab_id)
			}
		}
	}
}

// Create menu entries

let menuEntry = {
	id: menuEntryId,
	title: "Archive Page Now",
	contexts: ["page", "tab"],
}
let linkMenuEntry = {
	id: linkMenuEntryId,
	title: "Archive Link Now",
	contexts: ["link"],
}

function createMenuEntryCallback() {
	let error = browser.runtime.lastError
	if (error !== null) {
		console.error(`Failed to create menu item: ${error.message}`)
		return 
	}
}

browser.contextMenus.create(menuEntry, createMenuEntryCallback)
browser.contextMenus.create(linkMenuEntry, createMenuEntryCallback)

// Register listeners
browser.contextMenus.onClicked.addListener(onMenuClicked)
browser.browserAction.onClicked.addListener(onBrowserActionClicked)
browser.runtime.onMessage.addListener(onMessageReceived)

console.log("Registered listeners in background.js")
