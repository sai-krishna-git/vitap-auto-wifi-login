// setting the values;

console.log("setter called")
chrome.storage.sync.get(["wifi_username", "wifi_password"], function (result) {
  if (result.wifi_username) {
    console.log("Retrieved username: " + result.wifi_username)
    document.getElementById("ft_un").value = result.wifi_username

    if (result.wifi_password) {
      document.getElementById("ft_pd").value = result.wifi_password
    } else {
      console.log("No password found")
    }
  } else {
    console.log("No username found")
  }
  injectScript("scripts/inject-1.js", function () {
    // Send a message to the background script to close the tab
    chrome.runtime.sendMessage({ action: "closeTab" })
  })
})

function injectScript(file, callback) {
  var script = document.createElement("script")
  script.setAttribute("type", "text/javascript")
  script.setAttribute("src", chrome.runtime.getURL(file))
  ;(document.head || document.documentElement).appendChild(script)
  script.onload = function () {
    script.remove()
    if (callback) callback()
  }
}
