const express = require("express");
const bodyParser = require("body-parser");
const { PythonShell } = require("python-shell");

// Initialize the Express app
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// API endpoint to predict drop-off probability
app.post("/api/predict-dropoff", (req, res) => {
  const inputData = req.body;

  // Check if all required fields are present
  if (
    !inputData.response ||
    !inputData.time ||
    !inputData.ppSurveyFormId ||
    !inputData.ppSurveyFormQuestionId ||
    typeof inputData.isLastQuestion === "undefined"
  ) {
    console.log("Missing required fields in input data");
    return res
      .status(400)
      .json({ error: "Missing required fields in the input data" });
  }

  // Log the input data to make sure it's correctly formatted
  console.log("Received input data:", JSON.stringify(inputData));

  const options = {
    mode: "text",
    pythonOptions: ["-u"], // Unbuffered output
    args: [], // No command-line arguments
  };

  const pyshell = new PythonShell("predict_dropoff.py", options);

  // Write the input data to stdin
  pyshell.stdin.write(JSON.stringify(inputData) + "\n");
  pyshell.stdin.end(); // End the input stream

  let isResponseSent = false; // Flag to track if the response has been sent

  // Handle the result from Python
  pyshell.on("message", (message) => {
    console.log("Python output:", message);

    // Try to parse the Python output
    const dropOffProbability = parseFloat(message.trim());

    // Check if the response is a valid number
    if (isNaN(dropOffProbability)) {
      console.log("Invalid response from Python script:", message);
      if (!isResponseSent) {
        isResponseSent = true; // Mark response as sent
        return res
          .status(500)
          .json({ error: "Invalid response from Python script" });
      }
    } else {
      if (!isResponseSent) {
        isResponseSent = true; // Mark response as sent
        return res.json({ dropOffProbability });
      }
    }
  });

  // Handle any Python errors
  pyshell.on("error", (err) => {
    console.error("Error executing Python script:", err);
    if (!isResponseSent) {
      isResponseSent = true; // Mark response as sent
      return res.status(500).json({ error: "Internal server error" });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
