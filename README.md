# Save Page Now

A Firefox Web Extension to archive files to the Wayback Machine (https://web.archive.org).

Available for Firefox here: https://addons.mozilla.org/firefox/addon/save-page-now-unofficial/

## Usage

Either:

- Click on the toolbar icon to archive the current page
- Right-click on a page and select "Save Page Now" to archive the current page
- Right-click on a link and select "Save Page Now (link)" to archive the linked URL

## See also

This addon is kept really simple on purpose. For more advanced features, see the following addons:

- [Save To The Wayback Machine][save-to-the-wayback-machine] by "VerifiedJoseph": provides a nice popup with the date of the last time the page was archived, as well as links to the Wayback Machine
- [archive-webextension][archive-webextension] by "zPlus": supports multiple backends in addition to the Internet Archive such as Archive Today or WebCite

[save-to-the-wayback-machine]: https://addons.mozilla.org/firefox/addon/save-to-the-wayback-machine/
[archive-webextension]: https://addons.mozilla.org/firefox/addon/archive-webextension/

## Development notes

- Strict minimum version is Firefox 55 for the tabs and contextMenus APIs.

### Permissions

We need the `activeTab` permission to retrieve the current tab's URL. We also need the `contextMenus` permission to add an entry to right-click menus.

### How it works

When the user clicks on the browser action, we temporarily store (in memory) the current tab's URL and open <https://web.archive.org/save> in a new tab (background.js function onBrowserActionClicked()).
From the new tab, we ask the background script what URL to save (save.js calls runtime.postMessage()).
The background script replies with the previously noted URL, or null if we didn't open that tab (background.js function onMessageReceived()).
Back in the new tab, we fill in the Save Page Now form and submit it on behalf of the user. (save.js)

## License

Licensed under the MIT License.
