from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/")
def home():
    return "Welcome to the Student Performance Analysis API! Try /summary, /at-risk, /students, or /rules"

@app.route("/summary")
def summary():
    df = pd.read_csv('data/student_performance_with_predictions.csv')
    perf_counts = df['Predicted_Performance'].value_counts().to_dict()
    return jsonify({"performance_distribution": perf_counts})

@app.route("/at-risk")
def at_risk():
    df = pd.read_csv('data/student_performance_with_predictions.csv')
    low_perf = df[df['Predicted_Performance'] == 'Low']
    return low_perf.to_json(orient='records')

@app.route("/students")
def students():
    df = pd.read_csv('data/student_performance_with_predictions.csv')
    return df.to_json(orient='records')

@app.route("/rules")
def rules():
    rules_df = pd.read_csv('data/performance_association_rules.csv')
    return rules_df.to_json(orient='records')

if __name__ == "__main__":
    app.run(debug=True)