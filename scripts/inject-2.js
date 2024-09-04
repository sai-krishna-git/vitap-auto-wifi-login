const button = document.querySelector('.primary[type="submit"]')
if (button) {
  console.log("inside button")
  button.click()
} else {
  console.log("Not clicked")
}
console.log("after clicking" + new Date())
