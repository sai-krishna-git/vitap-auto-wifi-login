// Listen for the background message to start the process
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "injectScript") {
    // If triggered by the shortcut, perform login and logout
    setTimeout(() => injectScript("scripts/inject-1.js"), 600);
    sendResponse({ status: "Login and Logout process started." });
  }
});

// When the page is loaded normally, just perform the login
chrome.storage.sync.get(["wifi_username", "wifi_password"], function (result) {
  if (result.wifi_username) {
    console.log("Retrieved username: " + result.wifi_username);
    document.getElementById("username").value = result.wifi_username;

    if (result.wifi_password) {
      document.getElementById("password").value = result.wifi_password;
    } else {
      console.log("No password found");
    }
  } else {
    console.log("No username found");
  }

  injectScript("scripts/inject-1.js");
  setTimeout(() => chrome.runtime.sendMessage({ action: "closeTab" }), 1000);
});
function injectScript(file) {
  const currentPageUrl = window.location.href;
  if (currentPageUrl.startsWith("https://hfw.")) {
    chrome.storage.sync.set({ page: "hostel1" });
  } else {
    chrome.storage.sync.set({ page: "hostel2" });
  }
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", chrome.runtime.getURL(file));
  (document.head || document.documentElement).appendChild(script);
  script.onload = function () {
    script.remove();
  };
}
