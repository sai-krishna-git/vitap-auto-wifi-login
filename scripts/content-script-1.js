class Mutex {
  constructor() {
    this._lock = Promise.resolve()
  }

  async acquire() {
    let release
    const lock = new Promise((resolve) => (release = resolve))
    const oldLock = this._lock
    this._lock = lock
    await oldLock
    return release
  }
}

const mutex = new Mutex()

async function performLoginAndLogout(shouldLogout) {
  const release = await mutex.acquire() // Acquire the mutex lock

  try {
    await injectScript("scripts/inject-1.js")
    chrome.storage.sync.set({ page: "hostel" })
    console.log("Login script executed.")

    if (shouldLogout) {
      await injectScript("scripts/inject-1.js")
      console.log("Logout script executed.")
    }
  } catch (error) {
    console.error("Error in script execution:", error)
  } finally {
    release() // Release the mutex lock after the function completes
    console.log("op complete" + new Date())
  }
}

function injectScript(file) {
  console.log("injecting " + new Date())
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.setAttribute("type", "text/javascript")
    script.setAttribute("src", chrome.runtime.getURL(file))
    ;(document.head || document.documentElement).appendChild(script)
    script.onload = function () {
      script.remove()
      resolve()
    }
    script.onerror = function (error) {
      reject(error)
    }
  })
}

// Listen for the background message to start the process
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "injectScript") {
    // If triggered by the shortcut, perform login and logout

    setTimeout(() => injectScript("scripts/inject-1.js"), 600)
    sendResponse({ status: "Login and Logout process started." })
  }
})

// When the page is loaded normally, just perform the login
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

  // Perform login without logout
  performLoginAndLogout(false)
  setTimeout(() => chrome.runtime.sendMessage({ action: "closeTab" }), 1000)
})
