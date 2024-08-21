chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "closeTab" && sender.tab) {
    chrome.tabs.remove(sender.tab.id)
  }
})
chrome.commands.onCommand.addListener((command) => {
  if (command === "executeScriptCommand") {
    chrome.tabs.create(
      { url: "https://hfw.vitap.ac.in:8090/httpclient.html" },
      (tab) => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (tabId === tab.id && changeInfo.status === "complete") {
            console.log("background script ")
            chrome.tabs.onUpdated.removeListener(listener)
            chrome.tabs.sendMessage(
              tab.id,
              { action: "injectScript" },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.error(
                    "Error sending message:",
                    chrome.runtime.lastError
                  )
                }
              }
            )
          }
        })
      }
    )
  }
})
