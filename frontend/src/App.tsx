import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import CustomCursor from './components/CustomCursor';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Lectures from './pages/Lectures';
import LectureDetail from './pages/LectureDetail';
import SearchPage from './pages/Search';
import History from './pages/History';
import Bookmarks from './pages/Bookmarks';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function AppLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <CustomCursor />
      <Navbar />
      <Sidebar />
      <main className={isLanding ? '' : 'lg:ml-60 pb-20 lg:pb-0'}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lectures" element={<Lectures />} />
          <Route path="/lectures/:number" element={<LectureDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/history" element={<History />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
