import json
import joblib
import pandas as pd
import sys

# Read input from stdin (the data passed by Node.js)
input_data = sys.stdin.read()

# Check if the input data is empty or not a valid JSON
try:
    input_data = json.loads(input_data)
except json.JSONDecodeError as e:
    print(f"Error decoding JSON: {e}")
    sys.exit(1)

# Check the input data (for debugging)
# print("Input data:", input_data)  # This line should be removed to avoid printing unnecessary logs

# Load the pre-trained model (replace with the correct path to the model)
model = joblib.load('dropoff_model.pkl')

# Feature engineering for prediction
response_length = len(input_data['response']) if isinstance(input_data['response'], str) else 0
time_hour = pd.to_datetime(input_data['time'], format='%H:%M:%S').hour
ppSurveyFormId = input_data['ppSurveyFormId']
ppSurveyFormQuestionId = input_data['ppSurveyFormQuestionId']
isLastQuestion = input_data['isLastQuestion']

# Create a DataFrame for the prediction input
features = pd.DataFrame([[response_length, time_hour, ppSurveyFormId, ppSurveyFormQuestionId, isLastQuestion]],
                        columns=['response_length', 'time', 'ppSurveyFormId', 'ppSurveyFormQuestionId', 'isLastQuestion'])

# Predict dropoff probability (probability of class 1)
dropoff_probability = model.predict_proba(features)[0][1]

# Output the result (drop-off probability) to the console
# Only output the probability, not any extra information
print(dropoff_probability)
