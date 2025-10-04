from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os
import sys
import subprocess

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



@app.route('/upload', methods=['POST'])
def upload_csv():
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file uploaded'}), 400

    save_path = 'data/student_performance.csv'
    file.save(save_path)

    # Use the python executable from the current environment
    python_executable = sys.executable
    subprocess.run([python_executable, 'analyze_student_performance.py'], check=True)

    return jsonify({'success': True, 'message': 'File uploaded and processed.'})

if __name__ == "__main__":
    app.run(debug=True)