function pingServerWithImage() {
  const img = new Image()
  img.src =
    "https://hfw.vitap.ac.in:8090/images/logo-sophos.png?" +
    new Date().getTime()

  img.onload = function () {
    console.log("Server is reachable. Opening login page...")
    chrome.storage.local.set({ checked: true })
    chrome.runtime.sendMessage({ action: "openLoginPage" })
  }

  img.onerror = function () {
    console.log("Server is not reachable.")
  }
}
chrome.storage.local.get(["checked"], (result) => {
  if (!result.checked) {
    pingServerWithImage()
  } else {
    console.log("Availability check already done this session.")
  }
})
