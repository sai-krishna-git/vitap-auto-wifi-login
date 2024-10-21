document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const addUserBtn = document.getElementById("addUserBtn");
  const userList = document.getElementById("userList");
  const toggleInput = document.getElementById("toggle");

  chrome.storage.sync.get("startup", function (result) {
    toggle.checked = result.startup === "true";
  });
  // Load users from chrome storage on page load
  loadUsers();

  toggle.addEventListener("change", function () {
    if (this.checked) {
      // Toggle is ON
      chrome.storage.sync.set({ startup: "true" }, function () {
        console.log("Startup set to true");
      });
    } else {
      // Toggle is OFF
      chrome.storage.sync.set({ startup: "false" }, function () {
        console.log("Startup set to false");
      });
    }
  });

  // Add user on button click
  addUserBtn.addEventListener("click", () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    if (username && password) {
      addUser(username, password);
      showNotification(`User "${username}" Added successfully`);
      usernameInput.value = "";
      passwordInput.value = "";
    }
  });

  // Add user to chrome storage
  function addUser(username, password) {
    chrome.storage.local.get({ users: [] }, (result) => {
      const users = result.users;
      users.push({ username, password });
      chrome.storage.local.set({ users }, loadUsers);
    });
  }

  // Load users and display them in the list
  function loadUsers() {
    chrome.storage.local.get({ users: [], selectedUserIndex: -1 }, (result) => {
      userList.innerHTML = "";
      const users = result.users;
      const selectedUserIndex = result.selectedUserIndex;

      users.forEach((user, index) => {
        const userDiv = document.createElement("div");
        userDiv.classList.add("user-item"); // Flex container

        // Radio button for selecting the user
        const radioBtn = document.createElement("input");
        radioBtn.type = "radio";
        radioBtn.name = "selectedUser";
        radioBtn.value = index;

        // Set the radio button to checked if it's the selected user
        if (index === selectedUserIndex) {
          radioBtn.checked = true;
        }

        // Add event listener to update the selected user when the radio button is clicked
        radioBtn.addEventListener("change", () => {
          sync(user.username, user.password);
          showNotification(`User "${user.username}" selected successfully`);

          // Update the selected user in chrome.storage
          chrome.storage.local.set({ selectedUserIndex: index });
        });

        // Label for username
        const label = document.createElement("label");
        label.classList.add("user-label");
        label.textContent = user.username;

        // Create edit and delete buttons
        const editBtn = document.createElement("button");
        editBtn.classList.add("icon-button");
        editBtn.innerHTML = '<i class="fas fa-edit"></i>'; // Edit icon
        editBtn.onclick = () => editUser(index);

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("icon-button");
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'; // Delete icon
        deleteBtn.onclick = () => deleteUser(index);

        // Container for buttons (edit and delete)
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");
        buttonContainer.appendChild(editBtn); // Edit button on the left
        buttonContainer.appendChild(deleteBtn); // Delete button on the right

        // Append elements to userDiv
        userDiv.appendChild(radioBtn); // Radio button on the left
        userDiv.appendChild(label); // Username label
        userDiv.appendChild(buttonContainer); // Button container with edit/delete

        // Append the userDiv to the userList
        userList.appendChild(userDiv);
      });

      // Automatically select the first user if none is selected yet
      if (users.length > 0 && selectedUserIndex === -1) {
        chrome.storage.local.set({ selectedUserIndex: 0 }, () => {
          // Reload the users to reflect the auto-selection
          sync(users[0].username, users[0].password);
          loadUsers();
        });
      }
    });
  }

  // Edit user function
  function editUser(index) {
    chrome.storage.local.get({ users: [] }, (result) => {
      const users = result.users;
      const user = users[index];
      usernameInput.value = user.username;
      passwordInput.value = user.password;

      // Remove user from list, it will be added again when saved
      deleteUser(index);
    });
  }

  // Delete user function
  function deleteUser(index) {
    chrome.storage.local.get({ users: [] }, (result) => {
      const users = result.users;
      users.splice(index, 1);
      chrome.storage.local.set({ users }, loadUsers);
    });
  }
});
function sync(username, password) {
  // Saving data to Chrome storage
  chrome.storage.sync.set({ wifi_username: username }, function () {
    console.log("username saved: " + username);
  });
  chrome.storage.sync.set({ wifi_password: password }, function () {
    console.log("password saved: " + password);
  });
}
let notificationTimeout;
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";

  // Clear any existing timeout
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }

  // Hide the notification after 3 seconds
  notificationTimeout = setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}
function detectOS() {
  const userAgent = window.navigator.userAgent;
  if (userAgent.indexOf("Mac") !== -1) {
    return "MacOS";
  } else if (userAgent.indexOf("Windows") !== -1) {
    return "Windows";
  } else {
    return "Other";
  }
}

// Get the OS
const os = detectOS();

// Define the shortcut text for both platforms
const windowsShortcuts = `
<b>Shortcuts:</b> <br />
    ( ALT + 1 ) to Login Hostel 1<br />
    ( ALT + 2 ) to Login Hostel 2<br />
    ( ALT + 3 ) to Login University<br />
    ( ALT + Q ) to Logout
  `;

const macShortcuts = `
<b>Shortcuts:</b> <br />
    ( CMD + 1 ) to Login Hostel 1<br />
    ( CMD + 2 ) to Login Hostel 2<br />
    ( CMD + 3 ) to Login University<br />
    ( CMD + Q ) to Logout
  `;

// Update the text based on the OS
const shortcutsText = document.getElementById("shortcutsText");
if (os === "MacOS") {
  shortcutsText.innerHTML = macShortcuts;
} else {
  shortcutsText.innerHTML = windowsShortcuts;
}
