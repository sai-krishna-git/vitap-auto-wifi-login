// setting the values;

var passwordField = document.getElementById("password")
console.log("setter called")
chrome.storage.sync.get(["wifi_username", "wifi_password"], function (result) {
  if (result.wifi_username) {
    console.log("Retrieved username: " + result.wifi_username)
    document.getElementById("username").value = result.wifi_username

    if (result.wifi_password) {
      passwordField.value = result.wifi_password
    } else {
      console.log("No password found")
    }
  } else {
    console.log("No username found")
  }
})
function injectScript(file) {
  var script = document.createElement("script")
  script.setAttribute("type", "text/javascript")
  script.setAttribute("src", chrome.runtime.getURL(file))
  ;(document.head || document.documentElement).appendChild(script)
  script.onload = function () {
    script.remove()
  }
}
injectScript("scripts/inject.js")
