import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import useStore from './store/useStore';

function App() {
  const subscribeToResults = useStore((state) => state.subscribeToResults);

  useEffect(() => {
    // Start listening to Firebase real-time updates
    const unsubscribe = subscribeToResults();
    // Cleanup on unmount
    return () => unsubscribe();
  }, [subscribeToResults]);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminPanelOrLogin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Wrapper to decide whether to show Login or Panel


const AdminPanelOrLogin = () => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  return isAuthenticated ? <AdminPanel /> : <AdminLogin />;
};

export default App;
