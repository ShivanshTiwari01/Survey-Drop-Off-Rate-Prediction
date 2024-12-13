# Survey Drop-off Rate Prediction

## Overview

This project is designed to predict the probability of survey drop-off using a pre-trained machine learning model. It consists of a Node.js server that communicates with a Python script to perform the prediction.

## Project Structure

- `app.js`: Main Node.js application file that handles API requests and communicates with the Python script.
- `predict_dropoff.py`: Python script that loads the pre-trained model and performs the prediction.
- `input_data.json`: Example of input data format for the API.
- `package.json`: Node.js project configuration file.

## Prerequisites

- Node.js and npm installed on your system.
- Python 3.x installed on your system.
- Required Python packages: `joblib`, `pandas`.

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Install Node.js dependencies:
   ```bash
   npm install
   ```
4. Install Python dependencies:
   ```bash
   pip install joblib pandas
   ```

## Usage

1. Start the Node.js server:
   ```bash
   node app.js
   ```
2. Send a POST request to the API endpoint `http://localhost:3000/api/predict-dropoff` with JSON input data in the format specified in `input_data.json`.

## Example Input Data

```json
{
  "response": "Good",
  "time": "18:30:00",
  "ppSurveyFormId": 123,
  "ppSurveyFormQuestionId": 45,
  "isLastQuestion": 0
}
```

## License

This project is licensed under the ISC License.
