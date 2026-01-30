import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { HackathonDetailPage } from './pages/HackathonDetailPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminEditor } from './pages/AdminEditor';
import { LoginPage } from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hackathon/:id" element={<HackathonDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/new" element={<AdminEditor />} />
          <Route path="/admin/edit/:id" element={<AdminEditor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;