// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GraphEditor from './components/GraphEditor'; // in case needed later
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './context/AuthContext';
import MstEditor from './pages/MstEditor'; // Main MST UI

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-100 min-h-screen p-4">
          <Routes>
            <Route path="/" element={<MstEditor />} />
            <Route path ="/dijkstra" element={<GraphEditor />} /> {/* Placeholder for Graph Editor */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
