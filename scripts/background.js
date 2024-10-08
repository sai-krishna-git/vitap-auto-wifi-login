chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "closeTab" && sender.tab) {
    console.log("close tab called");
    chrome.tabs.remove(sender.tab.id);
  }
});

chrome.runtime.onStartup.addListener(() => {
  //checking for each site
  chrome.storage.sync.get("startup", (res) => {
    if (res.startup === "true") {
      createTab("https://hfw.vitap.ac.in:8090/httpclient.html");
      createTab("https://hfw2.vitap.ac.in:8090/httpclient.html");
      createTab("https://172.18.10.10:1000/login?");
    }
  });
});
function createTab(webURL) {
  chrome.tabs.create({ url: webURL }, (tab) => {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tabInfo) {
      if (tabId === tab.id) {
        // Check if the tab encounters an error
        if (changeInfo.status === "complete" && changeInfo.url === undefined) {
          // If the page couldn't load, remove the tab (e.g., ERR_CONNECTION_TIMED_OUT)
          setTimeout(() => chrome.tabs.remove(tabId), 1500);
        }
      }
    });
  });
}
chrome.commands.onCommand.addListener((command) => {
  if (command === "executeScriptCommand") {
    chrome.storage.sync.get("page", (res) => {
      if (res.page === "hostel1") {
        createAndInjectScript("https://hfw.vitap.ac.in:8090/httpclient.html");
      } else if (res.page === "hostel2") {
        createAndInjectScript("https://hfw2.vitap.ac.in:8090/httpclient.html");
      } else {
        chrome.tabs.create({ url: "https://172.18.10.10:1000/logout?" });
      }
    });
  } else if (command === "loginToHostel1") {
    chrome.tabs.create({ url: "https://hfw.vitap.ac.in:8090/httpclient.html" });
  } else if (command === "loginToHostel2") {
    chrome.tabs.create({
      url: "https://hfw2.vitap.ac.in:8090/httpclient.html",
    });
  } else if (command === "loginToUniversity") {
    chrome.tabs.create({ url: "https://172.18.10.10:1000/login?" });
  }
});

function createAndInjectScript(webURL) {
  chrome.storage.sync.set({ logout: "true" });
  chrome.tabs
    .create({ url: webURL })
    .then(() =>
      setTimeout(() => chrome.storage.sync.set({ logout: "false" }), 500)
    );
}
