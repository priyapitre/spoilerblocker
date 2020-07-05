// Initialize stored values on installation.
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.clear(function(){
        chrome.storage.sync.set({"toggle": true});
        chrome.storage.sync.set({"blockList": null});
    })
})

//Listen for messages from content scripts and popup.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getStorage") {
        chrome.storage.sync.get(request.key, function(obj){
            sendResponse({data: obj[request.key]});
        })
        return true;
    } else if (request.method == "updateRules") {
        chrome.tabs.executeScript(null, {"file": "jquery-3.5.1.min.js"});
        chrome.tabs.executeScript(null, {"file": "content_on.js"});
    } else if (request.method == "off") {
        chrome.tabs.executeScript(null, {"file": "content_off.js"});
    } else {
        sendResponse({});
    }
});


// The following apply extension settings when user
// switches or updates tabs:

//Listen for page updates
chrome.tabs.onUpdated.addListener(function(){
    toggle();
})

//Listen for change in active tab
chrome.tabs.onActivated.addListener(function() {
    toggle();
})

// Inject appropriate content scripts depending on
// ON/OFF staus of extension
function toggle() {
    chrome.storage.sync.get("toggle", function(data){
        if (data["toggle"] == true) {
            chrome.tabs.executeScript(null, {"file": "jquery-3.5.1.min.js"});
            chrome.tabs.executeScript(null, {"file": "content_on.js"});
        } else {
            chrome.tabs.executeScript(null, {"file": "content_off.js"});
        }
    })
}
