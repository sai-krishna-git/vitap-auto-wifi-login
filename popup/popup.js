//setting the values;
console.log("started")

retrieveData()

document.getElementById("submit").addEventListener("click", function (event) {
  event.preventDefault() // Prevent the form from submitting
  console.log("Submit button clicked!")
  sync()
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
function retrieveData() {
  chrome.storage.sync.get(
    ["wifi_username", "wifi_password"],
    function (result) {
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
    }
  )
}
