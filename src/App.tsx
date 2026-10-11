import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import CandidateProfile from './pages/CandidateProfile';
import Interviews from './pages/Interviews';
import CreateInterview from './pages/CreateInterview';
import InterviewSession from './pages/InterviewSession';
import Processing from './pages/Processing';
import MultimodalAnalysis from './pages/MultimodalAnalysis';
import AuthenticityPage from './pages/AuthenticityPage';
import BehaviourPage from './pages/BehaviourPage';
import PersonalityPage from './pages/PersonalityPage';
import Analytics from './pages/Analytics';
import ReportPage from './pages/Report';
import Settings from './pages/Settings';

function Protected({ children }: { children: React.ReactNode }) {
  const authed = localStorage.getItem('hn-auth') === '1';
  if (!authed) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/interview/:id" element={<InterviewSession />} />
        <Route path="/processing/:id" element={<Processing />} />

        <Route
          element={
            <Protected>
              <AppLayout />
            </Protected>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/candidates/:id" element={<CandidateProfile />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/interviews/create" element={<CreateInterview />} />
          <Route path="/interviews/:id" element={<CandidateProfile />} />
          <Route path="/analysis/:id" element={<MultimodalAnalysis />} />
          <Route path="/analysis/authenticity" element={<AuthenticityPage />} />
          <Route path="/analysis/behaviour" element={<BehaviourPage />} />
          <Route path="/analysis/personality" element={<PersonalityPage />} />
          <Route path="/analysis/multimodal" element={<MultimodalAnalysis />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Interviews />} />
          <Route path="/reports/:id" element={<ReportPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
