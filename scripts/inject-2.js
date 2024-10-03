const button = document.querySelector('.primary[type="submit"]');
if (button) {
  button.click();
} else {
  console.error("submit button is not defined");
}
