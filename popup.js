// Read blockList from storage and create list of blocked elements
// on the popup
function buildPopupList() {
    var list = document.getElementById('list');
    chrome.storage.sync.get("blockList", function(data){
        var titles = data["blockList"] || [];
        for (i = 0; i < titles.length; ++i) {
            var newTitle = document.createElement('LI');
            newTitle.id = i;
            newTitle.innerHTML = "<img src='x.png' id='" + i + "'>  " + titles[i];
            list.appendChild(newTitle);
        }
    })
}

// Remove all LI elements from popup list
function emptyList() {
    var list = document.getElementById('list');
    while(list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

// Check whether extension is ON or OFF, then send message to
// inject appropriate content script on the current page.
function updateRules() {
    chrome.storage.sync.get("toggle", function(data){
        if (data["toggle"]  == true) {
            chrome.runtime.sendMessage({method: "updateRules"}, function(response){})
        } else {
            chrome.runtime.sendMessage({method: "off"}, function(response){})
        }
    })
}

// When user submits a new title to block, update stored blockList,
// update popup list, rerun content script on current page.
function addTitle() {
    chrome.storage.sync.get("blockList", function(data){
        var titles = data["blockList"] || [];
        var input = document.getElementById('title').value;
        titles.push(input);
        chrome.storage.sync.set({"blockList": titles}, function() {
            emptyList();
            buildPopupList();
            updateRules();
        })
    })
}

//Called when user removes title from popup list.
function removeTitle(e) {
    if (e.target.id) {
        // remove node from popup list
        node = document.getElementById(e.target.id);
        nodeText = document.getElementById(e.target.id).textContent;
        node.remove();

        // remove title from master list
        removeFromBlockList(nodeText);
    }
}

//Remove title from stored blockList
function removeFromBlockList(text) {
    chrome.storage.sync.get("blockList", function(data){
        var titles = data["blockList"] || [];
        var index = titles.indexOf(text);
        titles.splice(index, 1);
        chrome.storage.sync.set({"blockList": titles}, function() {
           updateRules();         //update current page
        })
    })
}


function checkBox() {
    //Read from storage whether extension is on or off
    //and set checkbox accordingly.
    var input = document.getElementById('toggle');
    chrome.storage.sync.get("toggle", function(data){
        if (data["toggle"] == true) {
            input.checked = true;
        } else {
            input.checked = false;
        }
    })

    //Listen for and save changes in ON/OFF status.
    //Trigger apropriate content scripts.
    input.addEventListener("change", function() {
        chrome.storage.sync.set({"toggle": input.checked}, function() {
            updateRules();
        })
    })
}

//Add listeners to loading of popup.
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add').addEventListener('click', addTitle);
    checkBox();
    buildPopupList();
    document.getElementById('list').addEventListener('click', removeTitle);
});
