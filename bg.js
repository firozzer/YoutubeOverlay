// if for whatever reason you get "Service Worker failed" error, wrap this whole below code in try...catch & log the error & then click on the "inspect views service worker" & see what error.

chrome.action.onClicked.addListener(function (tab) {  
	chrome.scripting.executeScript({
			target: {tabId: tab.id},
			files: ['yt.js'],
	});
});