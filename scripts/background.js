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
      chrome.storage.sync.get(["uni", "hostel1", "hostel2"], function (result) {
        if (result.uni === "true") {
          createTab("https://172.18.10.10:1000/login?");
        }
        if (result.hostel1 === "true") {
          createTab("https://hfw.vitap.ac.in:8090/httpclient.html");
        }
        if (result.hostel2 === "true") {
          createTab("https://hfw2.vitap.ac.in:8090/httpclient.html");
        }
      });
    }
  });
});
function createTab(webURL) {
  chrome.tabs.create({ url: webURL });
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
