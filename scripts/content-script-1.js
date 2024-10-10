let logout;
chrome.storage.sync.get(["logout"]).then((result) => {
  logout = result.logout;
  console.log("Value is " + result.logout);
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
  // Inject the external script and close the tab after it's fully executed
  injectScript().then(() => {
    console.log("Script injected", logout);
    if (logout === "true") {
      setTimeout(() => {
        injectScript();
      }, 500);
    }
  });
});
function injectScript() {
  return new Promise((resolve) => {
    const currentPageUrl = window.location.href;
    if (currentPageUrl.startsWith("https://hfw.")) {
      chrome.storage.sync.set({ page: "hostel1" });
    } else {
      chrome.storage.sync.set({ page: "hostel2" });
    }
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", chrome.runtime.getURL("scripts/inject-1.js"));
    script.onload = () => {
      script.remove(); // Remove the script after it has executed
      resolve(); // Resolve the promise
    };
    (document.head || document.documentElement).appendChild(script);
  });
}
