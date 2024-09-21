chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "closeTab" && sender.tab) {
    console.log("close tab called");
    chrome.tabs.remove(sender.tab.id);
  }
});

chrome.runtime.onStartup.addListener(() => {
  //checking for each site
  createTab("https://hfw.vitap.ac.in:8090/httpclient.html");
  createTab("https://hfw2.vitap.ac.in:8090/httpclient.html");
  createTab("https://hfw3.vitap.ac.in:8090/httpclient.html");
  createTab("http://172.18.10.10:1000/logout?");
});
function createTab(webURL) {
  chrome.tabs.create({ url: webURL }, (tab) => {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tabInfo) {
      if (tabId === tab.id) {
        // Check if the tab encounters an error
        if (changeInfo.status === "complete" && changeInfo.url === undefined) {
          // If the page couldn't load, remove the tab (e.g., ERR_CONNECTION_TIMED_OUT)
          setTimeout(() => chrome.tabs.remove(tabId), 400);
        }
      }
    });
  });
}
chrome.commands.onCommand.addListener((command) => {
  if (command === "executeScriptCommand") {
    chrome.storage.sync.get("page", (res) => {
      if (res.page === "hostel") {
        chrome.storage.sync.get("TabId", (result) => {
          if (result.tabId) {
            // Check if the tab still exists
            chrome.tabs.get(result.tabId, (tab) => {
              if (chrome.runtime.lastError || !tab) {
                // Tab doesn't exist, create a new one
                createAndInjectScript();
              } else {
                console.log("tab exists");
                // Tab exists, focus on it and inject script
                chrome.tabs.update(result.tabId, { active: true });
                injectScriptIntoTab(result.tabId);
              }
            });
          } else {
            // No tabId found, create a new tab
            createAndInjectScript();
          }
        });
      } else {
        chrome.storage.sync.get("TabId", (result) => {
          if (result.tabId) {
            console.log("inside UNI tabs exists");
            // Check if the tab still exists
            chrome.tabs.get(result.tabId, (tab) => {
              if (chrome.runtime.lastError || !tab) {
                // Tab doesn't exist, create a new one
                chrome.tabs.create({ url: "http://172.18.10.10:1000/logout?" });
              } else {
                console.log("tab exists");
                // Tab exists, focus on it and inject script
                chrome.tabs.update(result.tabId, { active: true });
                chrome.tabs.update(undefined, {
                  url: "http://172.18.10.10:1000/logout?",
                });
              }
            });
          } else {
            // No tabId found, create a new tab
            chrome.tabs.create({ url: "http://172.18.10.10:1000/logout?" });
          }
        });
      }
    });
  }
});

function createAndInjectScript() {
  console.log("tab does not exists");
  chrome.tabs.create(
    { url: "https://hfw.vitap.ac.in:8090/httpclient.html" },
    (tab) => {
      chrome.storage.sync.set({ tabId: tab.id });
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === tab.id && changeInfo.status === "complete") {
          chrome.tabs.onUpdated.removeListener(listener);
          injectScriptIntoTab(tab.id);
        }
      });
    }
  );
}

function injectScriptIntoTab(tabId) {
  chrome.tabs.sendMessage(tabId, { action: "injectScript" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError);
    }
  });
}
