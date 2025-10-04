import React, { useState } from 'react';

// Inline SVG icons to avoid external dependency
const UploadCloud = ({ className = '', size = 48 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M16 16l4-4-4-4" />
        <path d="M8 8l-4 4 4 4" />
        <path d="M12 12v9" />
    </svg>
);

const FileText = ({ className = '', size = 20 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h8" />
    </svg>
);

const X = ({ className = '', size = 16 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

// --- NAVIGATION COMPONENT (Reused for consistency) ---
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

// --- FILE UPLOAD COMPONENT ---
const FileUploadArea = ({ onFileSelect }) => {
    const [isDragging, setIsDragging] = useState(false);

    // Prevent default drag behaviors
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    };

    const handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileSelect(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div
            className={`w-full max-w-sm lg:max-w-md p-10 mx-auto border-2 transition duration-300 rounded-xl shadow-xl flex flex-col items-center justify-center 
            ${isDragging ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white hover:border-red-400'}`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <div className="text-center">
                <UploadCloud size={48} className={`mx-auto mb-4 ${isDragging ? 'text-red-600' : 'text-gray-500'}`} />
                <p className="font-mono-accent text-lg font-bold tracking-wider">DRAG AND DROP</p>
                <p className="font-mono-accent my-4 text-gray-500">OR</p>
                
                <label className="cursor-pointer font-mono-accent text-lg font-bold tracking-wider text-red-600 hover:text-red-800 transition duration-150 border-b-2 border-red-600 pb-1">
                    ATTACH FILE
                    <input 
                        type="file" 
                        accept=".csv" 
                        onChange={handleFileChange} 
                        className="hidden" 
                    />
                </label>
            </div>
        </div>
    );
};

// --- MAIN APPLICATION COMPONENT ---
const UploadCSVApp = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileSelect = (file) => {
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            setSelectedFile(file);
            setUploadStatus('');
        } else {
            setSelectedFile(null);
            setUploadStatus('Error: Please upload a valid CSV file.');
        }
    };

    const handleUploadSubmit = async () => {
    if (selectedFile) {
        setUploadStatus('Uploading...');
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const res = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setUploadStatus(`Success! "${selectedFile.name}" processed.`);
                // Redirect to dashboard after short delay
                setTimeout(() => {
                    window.location.href = "#/";
                }, 1000);
            } else {
                setUploadStatus(`Error: ${data.message || 'Failed to process file.'}`);
            }
        } catch (err) {
            setUploadStatus(`Error: ${err.message}`);
        }
    } else {
        setUploadStatus('Please select a file first.');
    }
};

    return (
        <div className="min-h-screen bg-gray-50 font-main text-gray-900 p-4 sm:p-8">
            {/* Custom Font Styling (must be included in the single file) */}
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

            <Navigation currentPage="UPLOAD CSV" />

            <main className="container mx-auto flex flex-col items-center pt-8">
                {/* Main Content Card - Larger and centered */}
                <div className="w-full max-w-2xl bg-gray-200 p-8 sm:p-12 rounded-2xl shadow-2xl border-4 border-gray-800/10">
                    
                    <h1 className="text-4xl sm:text-5xl font-mono-accent font-black tracking-wider text-center mb-10 text-gray-900">
                        UPLOAD CSV
                    </h1>

                    <FileUploadArea onFileSelect={handleFileSelect} />

                    {/* File Status and Action */}
                    <div className="mt-8 text-center">
                        {selectedFile && (
                            <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-inner mb-4 max-w-xs mx-auto">
                                <FileText size={20} className="text-green-600 mr-2" />
                                <span className="text-sm font-main truncate" title={selectedFile.name}>
                                    Selected: {selectedFile.name}
                                </span>
                                <button 
                                    onClick={() => setSelectedFile(null)} 
                                    className="ml-2 text-gray-500 hover:text-red-500"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <p className={`font-main font-semibold mb-4 ${uploadStatus.includes('Error') ? 'text-red-600' : uploadStatus.includes('Success') ? 'text-green-600' : 'text-gray-700'}`}>
                            {uploadStatus}
                        </p>

                        <button
                            onClick={handleUploadSubmit}
                            disabled={!selectedFile || uploadStatus.includes('Uploading')}
                            className={`
                                font-mono-accent font-bold text-lg px-8 py-3 rounded-xl transition duration-200 uppercase tracking-widest shadow-lg
                                ${!selectedFile || uploadStatus.includes('Uploading')
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                    : 'bg-red-600 text-white hover:bg-red-700 active:shadow-none'
                                }
                            `}
                        >
                            {uploadStatus.includes('Uploading') ? 'Processing...' : 'Analyze Data'}
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default UploadCSVApp;