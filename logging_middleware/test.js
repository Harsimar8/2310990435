const Log = require('./index');

// Testing the function
Log("backend", "info", "setup", "Testing my middleware connection")
    .then(() => console.log("Check your terminal for 'Log Sent' or errors."))
    .catch(err => console.error("Test failed:", err));