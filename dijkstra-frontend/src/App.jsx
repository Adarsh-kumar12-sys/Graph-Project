

// again update

// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GraphEditor from './components/GraphEditor';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './context/AuthContext'; // NEW
import CourseSchedulerPage from './pages/CourseSchedulerPage'; // NEW
import HomePage from "./pages/HomePage"; // add this
import GraphEditorPage from './pages/GraphEditorPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} /> {/* Add HomePage route */}
            <Route path="/dijkstra" element={<GraphEditorPage/>} />
            {/* <Route path="/" element={<GraphEditor />} /> */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/topo" element= {<CourseSchedulerPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


