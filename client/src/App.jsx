import React, { lazy, Suspense, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import FloatingChatWidget from './components/FloatingChatWidget';
import ErrorBoundary from './components/ErrorBoundary';

// Code-splitting industry standard implementation to reduce initial bundle size
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard'));
const DoctorReports = lazy(() => import('./pages/DoctorReports'));
const DoctorAlerts = lazy(() => import('./pages/DoctorAlerts'));
const DoctorMap = lazy(() => import('./pages/DoctorMap'));
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));
const SymptomSubmit = lazy(() => import('./pages/SymptomSubmit'));
const NearbyRisk = lazy(() => import('./pages/NearbyRisk'));
const ChatbotPage = lazy(() => import('./pages/ChatbotPage'));
const VitalsPage = lazy(() => import('./pages/VitalsPage'));
const MedicalUploads = lazy(() => import('./pages/MedicalUploads'));
const AIEngine = lazy(() => import('./pages/AIEngine'));
const HealthBotIntegration = lazy(() => import('./pages/HealthBotIntegration'));
const DoctorPatientChat = lazy(() => import('./pages/DoctorPatientChat'));
const DiseasePrediction = lazy(() => import('./pages/DiseasePrediction'));

const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <div className="animate-spin h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
  </div>
);

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
    <FloatingChatWidget />
  </ProtectedRoute>
);

function RoleHome() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const home = useMemo(() => (user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'), [user]);
  return <Navigate to={home} replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<RoleHome />} />

          <Route path="/doctor/dashboard" element={<ProtectedLayout><DoctorDashboard /></ProtectedLayout>} />
          <Route path="/doctor/reports" element={<ProtectedLayout><DoctorReports /></ProtectedLayout>} />
          <Route path="/doctor/alerts" element={<ProtectedLayout><DoctorAlerts /></ProtectedLayout>} />
          <Route path="/doctor/map" element={<ProtectedLayout><DoctorMap /></ProtectedLayout>} />
          <Route path="/doctor/ai-engine" element={<ProtectedLayout><AIEngine /></ProtectedLayout>} />
          <Route path="/doctor/disease-predict" element={<ProtectedLayout><DiseasePrediction /></ProtectedLayout>} />

          <Route path="/patient/dashboard" element={<ProtectedLayout><PatientDashboard /></ProtectedLayout>} />
          <Route path="/patient/submit" element={<ProtectedLayout><SymptomSubmit /></ProtectedLayout>} />
          <Route path="/patient/vitals" element={<ProtectedLayout><VitalsPage /></ProtectedLayout>} />
          <Route path="/patient/uploads" element={<ProtectedLayout><MedicalUploads /></ProtectedLayout>} />
          <Route path="/patient/nearby" element={<ProtectedLayout><NearbyRisk /></ProtectedLayout>} />
          <Route path="/patient/disease-predict" element={<ProtectedLayout><DiseasePrediction /></ProtectedLayout>} />

          <Route path="/chat" element={<ProtectedLayout><ChatbotPage /></ProtectedLayout>} />
          <Route path="/messages" element={<ProtectedLayout><DoctorPatientChat /></ProtectedLayout>} />
          <Route path="/healthbot" element={<ProtectedLayout><HealthBotIntegration /></ProtectedLayout>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
