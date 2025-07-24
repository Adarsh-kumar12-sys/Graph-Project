// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Removed 'as Router' alias as it's not needed here
import GraphEditor from './components/GraphEditor'; // in case needed later
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './context/AuthContext';
import MstEditor from './pages/MstEditor'; // Main MST UI
import Home from "./pages/Home";


function App() {
  return (
    <BrowserRouter> {/* This is your main router */}
      <AuthProvider> {/* AuthProvider is a child of the router */}
        <div> {/* You can keep this div or remove it if not needed for layout */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/network-designer" element={<MstEditor />} />
            <Route path="/dijkstra" element={<GraphEditor />} /> {/* Placeholder for Graph Editor */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
