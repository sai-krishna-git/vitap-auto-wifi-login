console.log("Setter called")
chrome.storage.sync.get(["wifi_username", "wifi_password"], function (result) {
  if (result.wifi_username) {
    console.log("Retrieved username: " + result.wifi_username)
    document.getElementById("username").value = result.wifi_username

    if (result.wifi_password) {
      document.getElementById("password").value = result.wifi_password
    } else {
      console.log("No password found")
    }
  } else {
    console.log("No username found")
  }
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "injectScript") {
      // Inject the script into the page
      injectScript("scripts/inject-1.js", function () {
        //   // Send a message to the background script to close the tab
        // })
      })
      // Respond to the message after injecting the script
      sendResponse({ status: "script injected" })

      // Keep the message channel open until the script is loaded
    }
  })

  injectScript("scripts/inject-1.js", function () {
    // Send a message to the background script to close the tab
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
