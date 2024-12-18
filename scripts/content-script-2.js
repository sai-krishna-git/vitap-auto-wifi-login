// setting the values;
console.log("Setter Called");
chrome.storage.sync.get(["wifi_username", "wifi_password"], function (result) {
  if (result.wifi_username) {
    console.log("Retrieved username: " + result.wifi_username);
    document.getElementById("ft_un").value = result.wifi_username;

    if (result.wifi_password) {
      document.getElementById("ft_pd").value = result.wifi_password;
    } else {
      console.log("No password found");
    }
  } else {
    console.log("No username found");
  }

  // Send a message to the background script to close the tab
  injectScript("scripts/inject-2.js");
});

function injectScript(file) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ page: "university" });
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", chrome.runtime.getURL(file));
    script.onload = function () {
      script.remove();
      resolve();
    };
    (document.head || document.documentElement).appendChild(script);
  });
}
