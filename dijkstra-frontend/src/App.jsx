

// again update

// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GraphEditor from './components/GraphEditor';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './context/AuthContext'; // NEW

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-100 min-h-screen p-4">
          <Routes>
            <Route path="/" element={<GraphEditor />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


