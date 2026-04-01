import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleRoute } from './routes/ProtectedRoute';
import Navbar from './components/common/Navbar';

// ── Public Pages ─────────────────────────────────────────
import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// ── User Pages ───────────────────────────────────────────
import UserDashboard from './pages/User/UserDashboard';
import NewProposal from './pages/User/NewProposal';
import ProposalDetail from './pages/User/ProposalDetail';
import PaymentPage from './pages/User/PaymentPage';
import MyClaims from './pages/User/MyClaims';

// ── Officer Pages ─────────────────────────────────────────
import OfficerDashboard from './pages/Officer/OfficerDashboard';
import OfficerProposals from './pages/Officer/OfficerProposals';
import OfficerClaims from './pages/Officer/OfficerClaims';
import OfficerPolicies from './pages/Officer/OfficerPolicies';

import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>

          {/* ── PUBLIC ROUTES ──────────────────────── */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── USER ROUTES ────────────────────────── */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <RoleRoute role="USER">
                <UserDashboard />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path="/proposals/new" element={
            <ProtectedRoute>
              <RoleRoute role="USER">
                <NewProposal />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path="/proposals/:proposalId" element={
            <ProtectedRoute>
              <RoleRoute role="USER">
                <ProposalDetail />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path="/proposals/:proposalId/pay" element={
            <ProtectedRoute>
              <RoleRoute role="USER">
                <PaymentPage />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path="/my-claims" element={
            <ProtectedRoute>
              <RoleRoute role="USER">
                <MyClaims />
              </RoleRoute>
            </ProtectedRoute>
          } />

          {/* ── OFFICER ROUTES ─────────────────────── */}
          <Route path="/officer/dashboard" element={
            <ProtectedRoute>
              <RoleRoute role="OFFICER">
                <OfficerDashboard />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path="/officer/proposals" element={
            <ProtectedRoute>
              <RoleRoute role="OFFICER">
                <OfficerProposals />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path="/officer/claims" element={
            <ProtectedRoute>
              <RoleRoute role="OFFICER">
                <OfficerClaims />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path="/officer/policies" element={
            <ProtectedRoute>
              <RoleRoute role="OFFICER">
                <OfficerPolicies />
              </RoleRoute>
            </ProtectedRoute>
          } />

          {/* ── FALLBACK ───────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;