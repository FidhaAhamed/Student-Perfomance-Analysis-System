import React, { useState, useMemo } from 'react';

// Small inline SVG icon components to avoid an external dependency
const Search = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden>
    <circle cx="11" cy="11" r="7"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const TrendingUp = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

// --- DATA MOCKUP ---
// In a real application, this data would come from your Python/ML backend API.
const MOCK_DATA = {
  totalStudents: 30,
  averageAttendance: 98, // Changed from 100% for a realistic example
  // Performance distribution (for the pie chart)
  performanceDistribution: [
    { label: 'High Performance', percentage: 40, color: 'bg-blue-600', fill: '#2563EB' },
    { label: 'Medium Performance', percentage: 35, color: 'bg-green-500', fill: '#10B981' },
    { label: 'Low Performance', percentage: 25, color: 'bg-red-600', fill: '#DC2626' },
  ],
  atRiskStudents: [
    'ABHIJITH M.', 'AADHITHYAN K.', 'AISHWARYA S.', 'AKSA ELSA', 'ALAN S.',
    'ANJANA G.', 'FIDHA AHAMED', 'JOANN J.', 'KIRAN P.', 'MAYA R.',
    'NIYA T.', 'PRANAV V.', 'SACHIN K.', 'VARSHA P.', 'YADHUKRISHNA R.',
  ],
};

// --- UTILITY COMPONENT: PIE CHART SIMULATOR ---
// Uses CSS conic-gradient for a simple, responsive pie chart visualization.
const PieChartSimulator = ({ distribution }) => {
  // Calculate segments for conic-gradient
  let currentPercentage = 0;
  const segments = distribution.map((item, index) => {
    const start = currentPercentage;
    currentPercentage += item.percentage;
    const end = currentPercentage;
    return `${item.fill} ${start}% ${end}%`;
  }).join(', ');

  const chartStyle = {
    backgroundImage: `conic-gradient(${segments})`,
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.5)',
    transform: 'rotateX(55deg) scale(1.05)', // Tilt for 3D effect
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-64 h-64 rounded-full relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105" style={chartStyle}>
        {/* Placeholder for the 3D-style base shadow/depth */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-900/10 backdrop-blur-sm"></div>
      </div>
      <div className="mt-8 flex space-x-4">
        {distribution.map((item, index) => (
          <div key={index} className="flex items-center text-xs text-gray-700 font-main">
            <div className={`w-3 h-3 ${item.color} rounded-full mr-2`}></div>
            {item.label} ({item.percentage}%)
          </div>
        ))}
      </div>
    </div>
  );
};


// --- UTILITY COMPONENT: KPI CARD ---
const KPICard = ({ title, value, unit, colorClass }) => (
  <div className={`p-4 rounded-xl shadow-lg border-2 border-gray-900/10 flex flex-col items-center justify-center min-w-[150px] transform hover:scale-[1.03] transition duration-200 cursor-pointer ${colorClass}`}>
    <div className="text-sm font-bold tracking-widest text-gray-700 uppercase font-main">{title}</div>
    <div className="text-5xl font-extrabold font-mono-accent mt-1 text-gray-900">{value}</div>
    <div className="text-lg font-bold text-gray-600 mt-1 font-main">{unit}</div>
  </div>
);

// --- UTILITY COMPONENT: AT RISK STUDENT LIST ---
const AtRiskStudentsList = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    return students.filter(student =>
      student.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  return (
    <div className="bg-gray-100 p-6 rounded-xl shadow-2xl border-4 border-gray-800/20 w-full lg:w-[350px] min-h-[400px]">
      <div className="text-xl font-mono-accent font-black mb-4 text-gray-900 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 transform rotate-90 text-red-600" />
        AT RISK STUDENTS
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="SEARCH"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 border-2 border-gray-400 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150 font-mono-accent uppercase text-sm bg-white"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student, index) => (
            <div
              key={index}
              className="flex items-center text-lg font-mono-accent font-bold text-gray-800 p-2 bg-white rounded-md shadow-sm border-l-4 border-red-500 hover:bg-red-50 transition duration-150 cursor-pointer"
            >
              <span className="w-6 text-red-600 text-sm">{index + 1}</span>
              <span className="ml-2 uppercase">{student}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic font-main">No students found matching "{searchTerm}".</p>
        )}
      </div>
    </div>
  );
};

// --- MAIN APPLICATION COMPONENT ---
const App = () => {
  return (
    // 1. Load Google Fonts and define custom utility classes
    <div className="min-h-screen bg-gray-50 font-main text-gray-900 p-4 sm:p-8">
      <style>
        {/*
          Using 'Bebas Neue' as the main font (similar bold display style to 'Alde de Apache').
          Using 'Audiowide' as the accent/mono font as requested.
        */}
        {`
        @import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Bebas+Neue:wght@400;700&display=swap');
        
        :root {
          --font-main: 'Bebas Neue', sans-serif;
          --font-mono-accent: 'Audiowide', cursive;
        }

        /* Custom Tailwind-like utilities */
        .font-main { font-family: var(--font-main); }
        .font-mono-accent { font-family: var(--font-mono-accent); }
        `}
      </style>

      {/* HEADER / NAVIGATION */}
      <header className="flex justify-end mb-12">
        <nav className="flex space-x-6 text-lg font-mono-accent font-bold tracking-widest text-gray-700">
          <a href="#/" className="hover:text-red-600 transition duration-150 border-b-2 border-red-600">DASHBOARD</a>
          <a href="#/student" className="hover:text-red-600 transition duration-150">STUDENT</a>
          <a href="#/upload" className="hover:text-red-600 transition duration-150">UPLOAD CSV</a>
        </nav>
      </header>

      <main className="container mx-auto">
        {/* MAIN TITLE */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-mono-accent font-black leading-none tracking-tighter mb-12 text-gray-900">
          CLASS <br />
          <span className="text-red-600">PERFORMANCE</span> <br />
          ANALYSIS
        </h1>

        {/* DASHBOARD CONTENT GRID */}
        <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">

          {/* LEFT SECTION: METRICS & CHART */}
          <section className="flex-1 space-y-10">
            <div className="flex flex-wrap gap-6 justify-start">
              <KPICard
                title="TOTAL"
                value={MOCK_DATA.totalStudents}
                unit="STUDENTS"
                colorClass="bg-red-50 border-red-200"
              />
              <KPICard
                title="AVERAGE"
                value={`${MOCK_DATA.averageAttendance}%`}
                unit="ATTENDANCE"
                colorClass="bg-blue-50 border-blue-200"
              />
            </div>

            <div className="mt-12 p-4">
               {/* This is the area for the pie chart */}
               <h2 className="text-xl font-bold font-mono-accent tracking-wider mb-8 uppercase text-gray-700">
                Performance Distribution
               </h2>
               <PieChartSimulator distribution={MOCK_DATA.performanceDistribution} />
            </div>

          </section>

          {/* RIGHT SECTION: AT RISK STUDENTS */}
          <aside className="lg:w-auto flex-shrink-0">
            <AtRiskStudentsList students={MOCK_DATA.atRiskStudents} />
          </aside>

        </div>
      </main>

      {/* Responsive Design Helper Text (optional) */}
      <footer className="mt-12 text-center text-xs text-gray-400 font-main">
        <p>Built with React and Tailwind CSS. Data is mocked for demonstration.</p>
      </footer>
    </div>
  );
};

export default App;
