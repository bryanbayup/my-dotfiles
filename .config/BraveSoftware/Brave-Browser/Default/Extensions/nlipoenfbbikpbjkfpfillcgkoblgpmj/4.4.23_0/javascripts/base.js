function _getCurrentTab(n){chrome.tabs.query({active:!0,currentWindow:!0},(function(e){n(e[0])}))}function sendMessage(n,e){chrome.runtime.sendMessage(n,e)}function openNewTab(n){_getCurrentTab((function(e){var i={url:n};e&&e.incognito||!e?chrome.windows.getAll((function(n){n.forEach((function(n){n.incognito||"normal"!==n.type||(i.windowId=n.id)})),createTabWithInfo(i)})):(i.index=(e?e.index:currentTabIndex||0)+1,i.windowId=e?e.windowId:currentWindowId,createTabWithInfo(i))}))}function createTabWithInfo(n){n&&n.url&&(n.hasOwnProperty("index")&&!n.index&&delete n.index,chrome.tabs.create(n,(function(n){tabids[n.id]=tabid,tabid=n.id,chrome.windows.update(n.windowId,{focused:!0})})))}