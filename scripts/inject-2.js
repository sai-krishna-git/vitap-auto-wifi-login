console.log("hi")
const button = document.querySelector('.primary[type="submit"]')
if (button) {
  button.click()
} else {
  console.log("Not clicked")
}
