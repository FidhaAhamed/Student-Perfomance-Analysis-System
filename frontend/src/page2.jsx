import React, { useState, useEffect, useMemo } from 'react';

// --- INLINE SVG ICONS (Needed for aesthetic consistency if used, but only Navigation is required here) ---
// Note: Keeping Navigation focused on state change, not hash routing
const Navigation = ({ currentPage }) => (
    <header className="flex justify-end mb-12">
        <nav className="flex space-x-6 text-lg font-mono-accent font-bold tracking-widest text-gray-700">
            <a 
                href="#/" 
                className={`hover:text-red-600 transition duration-150 ${currentPage === 'DASHBOARD' ? 'border-b-2 border-red-600 text-red-600' : ''}`}
            >
                DASHBOARD
            </a>
            <a 
                href="#/student" 
                className={`hover:text-red-600 transition duration-150 ${currentPage === 'STUDENT' ? 'border-b-2 border-red-600 text-red-600' : ''}`}
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


// Helper: choose text color for score
const getScoreColorClass = (score) => {
  if (score >= 70) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const ProgressBar = ({ label, value, max = 100 }) => {
  const percentage = Math.round((value / max) * 100);
  const displayValue = `${value}/${max}`;

  let barColor = 'bg-green-500';
  if (percentage < 70) barColor = 'bg-yellow-500';
  if (percentage < 50) barColor = 'bg-red-500';

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
  if (!rules || rules.length === 0) return <p className="text-center text-gray-600 mt-4 p-4 bg-white rounded-md shadow-sm">No personalized actionable rules available. Performance currently stable.</p>;

  return (
    <div className="mt-6 p-5 border border-blue-200 bg-blue-50 rounded-lg shadow-inner">
      <h4 className="text-lg font-bold tracking-wider text-blue-800 uppercase mb-3 border-b border-blue-300 pb-2 font-main">Personalized Actionable Insights (Apriori)</h4>
      <ul className="space-y-3">{rules.map((r, i) => <li key={i} className="bg-white p-3 border-l-4 border-blue-500 shadow-sm rounded-md text-sm"><p className="font-medium text-gray-700">{r}</p></li>)}</ul>
    </div>
  );
};

const StudentPortalView = ({ student, onBack }) => {
  if (!student || !student.detailedPerformance) return null;
  const { detailedPerformance } = student;
  const currentClassification = student.score < 70 ? 'AT RISK' : 'LOW RISK';
  const classificationColor = student.score < 70 ? 'text-red-600' : 'text-green-600';

  const getRiskCategory = (score) => (score >= 70 ? 'LOW' : score >= 60 ? 'MEDIUM' : 'HIGH');
  const riskCategory = getRiskCategory(student.score);
  let categoryColor = 'text-green-700';
  if (riskCategory === 'HIGH') categoryColor = 'text-red-700';
  if (riskCategory === 'MEDIUM') categoryColor = 'text-yellow-600';

  return (
    <div className="p-8 bg-white shadow-xl rounded-lg w-full">
      <button onClick={onBack} className="text-red-600 hover:text-red-800 font-semibold mb-6 flex items-center transition">← BACK TO LIST</button>
      <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2 font-mono-accent">STUDENT DETAIL PORTAL</h1>
      <h2 className="text-6xl font-extrabold text-red-600 mb-8 font-main">{student.name}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2 font-main">Summary Status</h3>
            <p className="text-lg mb-3"><span className="font-semibold">Overall Score:</span> <span className="text-red-600 text-3xl font-bold ml-2">{student.score}%</span></p>
            <p className="text-lg mb-2"><span className="font-semibold">Classification:</span> <span className={`font-bold ml-2 ${classificationColor} text-xl`}>{currentClassification}</span></p>
            <p className="text-lg mb-2"><span className="font-semibold">Category:</span> <span className={`font-bold ml-2 text-xl ${categoryColor}`}>{riskCategory}</span></p>
          </div>
          <PersonalizedInsights rules={student.personalizedRules} />
        </div>
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full">
            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2 font-main">Activity & Engagement</h3>
            <ProgressBar label="Attendance Rate" value={detailedPerformance.attendanceRate} max={100} />
            <ProgressBar label="Participation Score" value={detailedPerformance.participation} max={100} />
            <ProgressBar label="Assignments Completed" value={detailedPerformance.assignmentsCompleted} max={5} />
            <ProgressBar label="Tutorials Completed" value={detailedPerformance.tutorialsCompleted} max={10} />
            <ProgressBar label="Volunteering Hours" value={detailedPerformance.volunteeringHours} max={20} />
            <ProgressBar label="MOOC's Status" value={detailedPerformance.moocs} max={1} />
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
  const [sortBy, setSortBy] = useState('score');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    const ALL_STUDENTS_DATA = [
      { id: 1, name: 'ABHIJITH', score: 55, personalizedRules: ['Focus on MOOC completion (80% confidence)', 'Improve tutorial participation (95% confidence)'], detailedPerformance: { attendanceRate: 78, participation: 55, assignmentsCompleted: 3, tutorialsCompleted: 6, volunteeringHours: 10, moocs: 0 } },
      { id: 2, name: 'AADHITHYAN', score: 62, personalizedRules: ['Submit the final missing assignment to recover core marks.', 'Increase active participation during lecture hours (60% Participation Score).'], detailedPerformance: { attendanceRate: 85, participation: 60, assignmentsCompleted: 4, tutorialsCompleted: 8, volunteeringHours: 15, moocs: 1 } },
      { id: 3, name: 'AISHWAARYA', score: 48, personalizedRules: ['Seek tutorial support immediately', 'Low attendance directly linked to low scores'], detailedPerformance: { attendanceRate: 65, participation: 40, assignmentsCompleted: 3, tutorialsCompleted: 2, volunteeringHours: 5, moocs: 0 } },
      { id: 4, name: 'AKSA ELSA', score: 59, personalizedRules: ['Low Assignment score (below 70%) => High chance of failing (Conf: 88%)'], detailedPerformance: { attendanceRate: 92, participation: 70, assignmentsCompleted: 5, tutorialsCompleted: 7, volunteeringHours: 12, moocs: 1 } },
      { id: 5, name: 'ALAN S', score: 65, personalizedRules: ['Missing 3+ Volunteering hours => Low overall engagement score (Conf: 75%)'], detailedPerformance: { attendanceRate: 98, participation: 80, assignmentsCompleted: 4, tutorialsCompleted: 9, volunteeringHours: 18, moocs: 1 } },
      { id: 6, name: 'BENNY K', score: 70, personalizedRules: [], detailedPerformance: { attendanceRate: 100, participation: 90, assignmentsCompleted: 5, tutorialsCompleted: 10, volunteeringHours: 20, moocs: 1 } },
      { id: 7, name: 'CHANDANA T', score: 85, personalizedRules: [], detailedPerformance: { attendanceRate: 100, participation: 95, assignmentsCompleted: 5, tutorialsCompleted: 10, volunteeringHours: 20, moocs: 1 } },
      { id: 8, name: 'DAVID R', score: 92, personalizedRules: [], detailedPerformance: { attendanceRate: 99, participation: 98, assignmentsCompleted: 5, tutorialsCompleted: 10, volunteeringHours: 20, moocs: 1 } },
      { id: 9, name: 'EMILY W', score: 78, personalizedRules: [], detailedPerformance: { attendanceRate: 95, participation: 85, assignmentsCompleted: 5, tutorialsCompleted: 10, volunteeringHours: 20, moocs: 1 } },
      { id: 10, name: 'FAHAD M', score: 81, personalizedRules: [], detailedPerformance: { attendanceRate: 97, participation: 90, assignmentsCompleted: 5, tutorialsCompleted: 10, volunteeringHours: 20, moocs: 1 } },
      { id: 11, name: 'GEETHA P', score: 73, personalizedRules: [], detailedPerformance: { attendanceRate: 90, participation: 80, assignmentsCompleted: 5, tutorialsCompleted: 10, volunteeringHours: 20, moocs: 1 } },
      { id: 12, name: 'HARI V', score: 68, personalizedRules: ['Complete the mandatory MOOC to fulfill course requirements.', 'Dedicate time to the 3 incomplete tutorials.'], detailedPerformance: { attendanceRate: 88, participation: 68, assignmentsCompleted: 4, tutorialsCompleted: 7, volunteeringHours: 14, moocs: 0 } },
      { id: 13, name: 'ISHA N', score: 88, personalizedRules: [], detailedPerformance: { attendanceRate: 100, participation: 100, assignmentsCompleted: 5, tutorialsCompleted: 10, volunteeringHours: 20, moocs: 1 } },
      { id: 14, name: 'JAYANT K', score: 52, personalizedRules: ['Zero MOOC participation => Low overall score (Conf: 92%)'], detailedPerformance: { attendanceRate: 70, participation: 50, assignmentsCompleted: 3, tutorialsCompleted: 5, volunteeringHours: 8, moocs: 0 } },
      { id: 15, name: 'KAVYA S', score: 90, personalizedRules: [], detailedPerformance: { attendanceRate: 100, participation: 99, assignmentsCompleted: 5, tutorialsCompleted: 10, volunteeringHours: 20, moocs: 1 } }
    ];

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise((r) => setTimeout(r, 500));
        setAllStudents(ALL_STUDENTS_DATA);
      } catch (err) {
        console.error('Failed to fetch student data:', err);
      } finally {
        setIsLoading(false);
      }
    };

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
      // In this app, both 'DASHBOARD' and 'STUDENT' navigation links lead to the list view
      if (pageName === 'LIST') {
          handleBackToList();
      }
      // Other page transitions would go here if they existed
  };

  const filteredAndSortedStudents = useMemo(() => {
    if (isLoading) return [];
    let filtered = allStudents.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
      setSortDirection(key === 'name' ? 'asc' : 'desc');
    }
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? '▲' : '▼';
  };

  // The old renderHeader is removed and replaced by the Navigation component call

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
              <th className="px-6 py-3 text-left font-extrabold cursor-pointer hover:bg-red-700 transition" onClick={() => handleSort('name')}>Student Name <SortIcon column="name" /></th>
              <th className="px-6 py-3 text-center font-extrabold cursor-pointer hover:bg-red-700 transition w-32" onClick={() => handleSort('score')}>Score (%) <SortIcon column="score" /></th>
              <th className="px-6 py-3 text-center font-extrabold w-36">Classification</th>
              <th className="px-6 py-3 text-center font-extrabold w-24">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan="4" className="text-center py-12 text-gray-500 font-main">Loading comprehensive student data...</td></tr>
            ) : filteredAndSortedStudents.length > 0 ? (
              filteredAndSortedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900 font-main">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-xl font-extrabold"><span className={getScoreColorClass(student.score)}>{student.score}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-center"><span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${student.score < 70 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{student.score < 70 ? 'AT RISK' : 'LOW RISK'}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-center"><button onClick={() => handleStudentSelect(student)} className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition">View</button></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center py-8 text-gray-500 font-main">No students match your search criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-main text-gray-900">
        {/* Custom Font Styling (moved from page3.jsx) */}
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
