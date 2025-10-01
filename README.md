# Student Performance Analysis and Improvement System

## Abstract
This project presents a Student Performance Analysis and Improvement System that leverages machine learning techniques to help teachers identify students who require academic and extracurricular support. Using a Decision Tree classifier, the system categorizes students into High, Medium, or Low performance levels based on factors such as attendance, assignments, tutorials, volunteering, MOOCs, and participation. The model provides interpretable rules for classification, and the Apriori algorithm is applied to discover hidden patterns and associations. A user-friendly React dashboard displays performance distribution, at-risk students, and personalized recommendations for data-driven interventions.

---

## Tech Stack

- **Backend (ML & Processing):**
  - Python
  - Flask
  - Scikit-learn (Decision Tree Classifier)
  - MLxtend (Apriori Algorithm)
  - Pandas
  - NumPy

- **Frontend (Dashboard):**
  - React.js
  - Vite

- **Data Source:**
  - Pre-stored CSV files containing student performance data

---

## Project Structure

```
/backend                # Python Flask backend, ML logic, and CSV data
  ├─ app.py             # Main Flask application
  ├─ generate_student_performance.py  # Script for dataset generation
  ├─ student_performance.csv  # Sample student data
  └─ ...                # Other backend files

/frontend               # React.js frontend (dashboard)
  ├─ src/
  ├─ public/
  ├─ package.json
  ├─ vite.config.js
  └─ ...                # Other frontend files
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/Student-Perfomance-Analysis-System.git
cd Student-Perfomance-Analysis-System
```

---

### 2. Backend Setup (Flask + ML)

**Install dependencies:**
```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Generate or update dataset (optional):**
```bash
python generate_student_performance.py
```

**Run the backend server:**
```bash
python app.py
```
The server will be available at `http://localhost:5000`.

---

### 3. Frontend Setup (React)

**Install dependencies:**
```bash
cd ../frontend
npm install
```

**Run development server:**
```bash
npm run dev
```
The dashboard will be available at `http://localhost:5173`.

---

## Sample Dataset Columns

- StudentID
- Name
- Attendance
- Assignments
- Tutorials
- Volunteering
- MOOCs
- Participation
- PerformanceLevel

---

## Features

- **Performance Prediction:** Uses Decision Tree to classify students as High, Medium, or Low performers.
- **Association Mining:** Discovers hidden patterns in academic/extra-curricular performance using Apriori algorithm.
- **Dashboard:** Displays performance distribution, at-risk students, and actionable recommendations.
- **Interpretable Model:** Shows rules/explanations for each student's classification.

---

## Contributing

1. Fork the repository
2. Commit your changes (`git commit -am 'Add new feature'`)
3. Push to the forked repository 
4. Open a Pull Request

---

## License

This project is licensed under the MIT License.
