function pingServerWithXHR() {
  const xhr = new XMLHttpRequest()
  xhr.open("GET", "https://hfw.vitap.ac.in:8090/images/logo-sophos.png", true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 400) {
        console.log("Server is reachable. Opening tab...")
        chrome.tabs.create(
          { url: "https://hfw.vitap.ac.in:8090/httpclient.html" },
          (tab) => {
            console.log("Tab created, injecting content script...")
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ["content-script-1.js"],
            })
          }
        )
      } else {
        console.log("Server is not reachable.")
      }
    }
  }
  xhr.onerror = function () {
    console.log("Request failed. Server is not reachable.")
  }
  xhr.send()
}

// Call the function when needed
pingServerWithXHR()
