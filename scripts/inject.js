;(function () {
  // Call the method defined in the page's context
  if (typeof submitRequest === "function") {
    submitRequest()
  } else {
    console.error("submitRequest is not defined")
  }
})()
