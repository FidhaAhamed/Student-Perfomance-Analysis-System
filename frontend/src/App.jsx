import './App.css'
import { useEffect, useState } from 'react'
import Page1 from './pages/Dashboard.jsx'
import Page2 from './pages/StudentsList.jsx'
import Page3 from './pages/UploadCSV.jsx'

function AppRouter() {
  const getPath = () => {
    const hash = window.location.hash || '#/';
    return hash.replace('#', '');
  };

  const [path, setPath] = useState(getPath());

  useEffect(() => {
    const onHash = () => setPath(getPath());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (path === '/upload') return <Page3 />;
  if (path === '/student') return <Page2 />;
  return <Page1 />;
}

function App() {
  return (
    <AppRouter />
  )
}

export default App