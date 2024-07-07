//setting the values;
console.log("started")

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("submit").addEventListener("click", function (event) {
    event.preventDefault() // Prevent the form from submitting
    console.log("Submit button clicked!")
    sync()
  })
})
function sync() {
  let username = document.getElementById("username").value
  let password = document.getElementById("password").value
  console.log("inside sync")
  // Saving data
  chrome.storage.sync.set({ wifi_username: username }, function () {
    console.log("username:" + username)
  })
  chrome.storage.sync.set({ wifi_password: password }, function () {
    console.log("password:" + password)
  })
}

// Retrieving data
