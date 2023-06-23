let currentTabId;
let currentWinId;
let taskboardTabId;
let taskboardWinId;
let previousTab;
let previousWin;
const BASE_URL = "tasksboard.com";

function queryTab() {
    return browser.tabs.query({ url: `*://${BASE_URL}/*`, currentWindow: true });
}

function onError(e) {
    console.log("***Error: " + e);
};

function setButtonIcon(imageURL) {
    try {
        browser.browserAction.setIcon({ path: imageURL });
    } catch (e) {
        onError(e);
    }
};

function createPinnedTab() {
    browser.tabs.create(
        {
            url: `https://${BASE_URL}`,
            pinned: true,
            active: true
        }
    )
};

function handleSearch(taskboardTabs) {
    //console.log("currentTabId: " + currentTabId);
    //console.log("currentWinId: " + currentWinId);
    if (taskboardTabs.length > 0) {
        //console.log("there is a taskboard tab");
        taskboardTabId = taskboardTabs[0].id;
        taskboardWinId = taskboardTabs[0].windowId;
        if (taskboardTabId === currentTabId) {
            //console.log("I'm in the taskboard tab");
            browser.windows.update(previousWin, { focused: true })
            browser.tabs.update(previousTab, { active: true, });
        } else {
            //console.log("I'm NOT in the taskboard tab");
            previousTab = currentTabId;
            previousWin = currentWinId;
            browser.windows.update(taskboardWinId, { focused: true, });
            browser.tabs.update(taskboardTabId, { active: true, });
        }
        setButtonIcon(taskboardTabs[0].favIconUrl);
    } else {
        //console.log("there is NO taskboard tab");
        previousTab = currentTabId;
        createPinnedTab();
    }
};

function handleClick(tab) {
    //console.log("*********Button clicked*********");
    currentTabId = tab.id;
    currentWinId = tab.windowId;
    let querying = queryTab();
    querying.then(handleSearch, onError);
};

function update(details) {
    if (details.reason === "install" || details.reason === "update") {
        browser.runtime.openOptionsPage();
    }
};

browser.browserAction.onClicked.addListener(handleClick);
browser.runtime.onInstalled.addListener(update);