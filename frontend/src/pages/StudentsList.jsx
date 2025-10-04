import React, { useState, useEffect, useMemo } from 'react';

// --- API Utility ---
const API_URL = 'http://localhost:5000';

async function getAllStudents() {
  const response = await fetch(`${API_URL}/students`);
  if (!response.ok) throw new Error('Failed to fetch students');
  return await response.json();
}

async function getStudentDetails(studentId) {
  const students = await getAllStudents();
  return students.find(s => s.StudentID === studentId);
}

// --- INLINE SVG ICONS ---
const Navigation = ({ currentPage, setPage }) => (
  <header className="flex justify-end mb-12">
    <nav className="flex space-x-6 text-lg font-mono-accent font-bold tracking-widest text-gray-700">
      <a
        href="#/"
        className={`hover:text-red-600 transition duration-150 ${currentPage === 'DASHBOARD' ? 'border-b-2 border-red-600 text-red-600' : ''}`}
        onClick={() => setPage('LIST')}
      >
        DASHBOARD
      </a>
      <a
        href="#/student"
        className={`hover:text-red-600 transition duration-150 ${currentPage === 'STUDENT' ? 'border-b-2 border-red-600 text-red-600' : ''}`}
        onClick={() => setPage('LIST')}
      >
        STUDENT
      </a>
      <a
        href="#/upload"
        className={`hover:text-red-600 transition duration-150 ${currentPage === 'UPLOAD CSV' ? 'border-b-2 border-red-600 text-red-600' : ''}`}
      >
        UPLOAD CSV
      </a>
    </nav>
  </header>
);

const getScoreColorClass = (score) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const ProgressBar = ({ label, value, max = 100 }) => {
  const percentage = Math.round((value / max) * 100);
  const displayValue = `${value}/${max}`;
  let barColor = 'bg-green-500';
  if (percentage < 90) barColor = 'bg-blue-500';
  if (percentage < 70) barColor = 'bg-yellow-500';
  if (percentage < 60) barColor = 'bg-red-500';
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm font-semibold mb-1 text-gray-700">
        <span>{label}</span>
        <span>{displayValue} ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-2.5 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

const PersonalizedInsights = ({ rules }) => {
  if (!rules || rules.length === 0)
    return (
      <p className="text-center text-gray-600 mt-4 p-4 bg-white rounded-md shadow-sm">
        No personalized actionable rules available. Performance currently stable.
      </p>
    );
  return (
    <div className="mt-6 p-5 border border-blue-200 bg-blue-50 rounded-lg shadow-inner">
      <h4 className="text-lg font-bold tracking-wider text-blue-800 uppercase mb-3 border-b border-blue-300 pb-2 font-main">
        Personalized Actionable Insights (Apriori)
      </h4>
      <ul className="space-y-3">
        {rules.map((r, i) => (
          <li key={i} className="bg-white p-3 border-l-4 border-blue-500 shadow-sm rounded-md text-sm">
            <p className="font-medium text-gray-700">{r}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Classification function ---
function getClassification(score, predicted) {
  // Score out of 100, predicted is 'High', 'Medium', 'Low'
  if (predicted === 'Low' || score < 60) return { label: 'AT RISK', color: 'bg-red-100 text-red-800' };
  if (score >= 90) return { label: 'SAFE', color: 'bg-green-100 text-green-800' };
  if (score >= 70) return { label: 'LOW RISK', color: 'bg-blue-100 text-blue-800' };
  return { label: 'LOW RISK', color: 'bg-yellow-100 text-yellow-800' };
}

const StudentPortalView = ({ student, onBack }) => {
  if (!student) return null;

  // Normalized score out of 100 (all attributes included)
  const score = (
    (student.Attendance / 100) +
    (student.Assignments / 10) +
    (student.Tutorials / 5) +
    (student.Volunteering / 5) +
    (student.MOOCs / 3) +
    (student.EventsParticipation / 5)
  ) / 6 * 100;

  const classification = getClassification(score, student.Predicted_Performance);

  return (
    <div className="p-8 bg-white shadow-xl rounded-lg w-full">
      <button onClick={onBack} className="text-red-600 hover:text-red-800 font-semibold mb-6 flex items-center transition">← BACK TO LIST</button>
      <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2 font-mono-accent">STUDENT DETAIL PORTAL</h1>
      <h2 className="text-6xl font-extrabold text-red-600 mb-8 font-main">{student.Name}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2 font-main">Summary Status</h3>
            <p className="text-lg mb-3"><span className="font-semibold">Overall Score:</span> <span className="text-red-600 text-3xl font-bold ml-2">{score.toFixed(2)} / 100</span></p>
            <p className="text-lg mb-2"><span className="font-semibold">Classification:</span> <span className={`font-bold ml-2 text-xl ${classification.color}`}>{classification.label}</span></p>
          </div>
        </div>
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full">
            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2 font-main">Activity & Engagement</h3>
            <ProgressBar label="Attendance Rate" value={student.Attendance} max={100} />
            <ProgressBar label="Assignments Completed" value={student.Assignments} max={10} />
            <ProgressBar label="Tutorials Completed" value={student.Tutorials} max={5} />
            <ProgressBar label="Volunteering Hours" value={student.Volunteering} max={5} />
            <ProgressBar label="MOOCs Status" value={student.MOOCs} max={3} />
            <ProgressBar label="Events Participation" value={student.EventsParticipation} max={5} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentsApp = () => {
  const [currentPage, setCurrentPage] = useState('LIST');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const students = await getAllStudents();
        setAllStudents(students);
      } catch (err) {
        console.error('Failed to fetch student data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setCurrentPage('DETAIL');
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
    setCurrentPage('LIST');
  };

  const handleSetPage = (pageName) => {
    if (pageName === 'LIST') {
      handleBackToList();
    }
  };

  const filteredAndSortedStudents = useMemo(() => {
    if (isLoading) return [];
    let filtered = allStudents.filter((s) => (s.Name || '').toLowerCase().includes(searchTerm.toLowerCase()));
    return filtered.sort((a, b) => {
      let comparison = 0;
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (typeof aValue === 'string') comparison = aValue.localeCompare(bValue);
      else {
        if (aValue > bValue) comparison = 1;
        if (aValue < bValue) comparison = -1;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [allStudents, searchTerm, sortBy, sortDirection, isLoading]);

  const handleSort = (key) => {
    if (sortBy === key) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else {
      setSortBy(key);
      setSortDirection(key === 'Name' ? 'asc' : 'desc');
    }
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? '▲' : '▼';
  };

  const renderListView = () => (
    <div className="p-8 bg-white shadow-xl rounded-lg w-full">
      <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 border-b pb-2 font-mono-accent">CLASS PERFORMANCE OVERVIEW</h1>
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search Student Name..."
          className="w-full max-w-sm p-3 border border-gray-300 bg-gray-50 uppercase text-lg font-main focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-600 text-white uppercase text-sm tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left font-extrabold cursor-pointer hover:bg-red-700 transition" onClick={() => handleSort('Name')}>Student Name <SortIcon column="Name" /></th>
              <th className="px-6 py-3 text-center font-extrabold cursor-pointer hover:bg-red-700 transition w-32" onClick={() => handleSort('Attendance')}>Attendance <SortIcon column="Attendance" /></th>
              <th className="px-6 py-3 text-center font-extrabold w-36">Classification</th>
              <th className="px-6 py-3 text-center font-extrabold w-24">Score</th>
              <th className="px-6 py-3 text-center font-extrabold w-24">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan="5" className="text-center py-12 text-gray-500 font-main">Loading comprehensive student data...</td></tr>
            ) : filteredAndSortedStudents.length > 0 ? (
              filteredAndSortedStudents.map((student) => {
                // Normalized score out of 100
                const score = (
                  (student.Attendance / 100) +
                  (student.Assignments / 10) +
                  (student.Tutorials / 5) +
                  (student.Volunteering / 5) +
                  (student.MOOCs / 3) +
                  (student.EventsParticipation / 5)
                ) / 6 * 100;
                const classification = getClassification(score, student.Predicted_Performance);
                return (
                  <tr key={student.StudentID} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900 font-main">{student.Name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-xl font-extrabold"><span className={getScoreColorClass(student.Attendance)}>{student.Attendance}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${classification.color}`}>{classification.label}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center font-mono-accent font-bold">
                      <span className={getScoreColorClass(score)}>{score.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button onClick={() => handleStudentSelect(student)} className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition">View</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="5" className="text-center py-8 text-gray-500 font-main">No students match your search criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-main text-gray-900">
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Bebas+Neue:wght@400;700&display=swap');
        :root {
          --font-main: 'Bebas Neue', sans-serif;
          --font-mono-accent: 'Audiowide', cursive;
        }
        .font-main { font-family: var(--font-main); }
        .font-mono-accent { font-family: var(--font-mono-accent); }
        `}
      </style>
      <Navigation currentPage={currentPage} setPage={handleSetPage} />
      {currentPage === 'LIST' && renderListView()}
      {currentPage === 'DETAIL' && selectedStudent && <StudentPortalView student={selectedStudent} onBack={handleBackToList} />}
    </div>
  );
};

export default StudentsApp;