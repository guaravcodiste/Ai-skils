import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/auth/Login';
import ForgetPassword from '../pages/auth/ForgetPassword';
import SetPassword from '../pages/auth/SetPassword';
import AcceptInvite from '../pages/auth/AcceptInvite';
import WelcomeArea from '../pages/WelcomeArea';
import PreSessionAssessment from '../pages/PreSessionAssessment';
import QuestionaryFinalization from '../pages/questions/QuestionaryFinalization';
import PracticeSession from '../pages/session/PracticeSession';
import SectionSummary from '../pages/session/SectionSummary';
import ProductExpert from '../components/ProductExpert';
import SessionFeedback from '../pages/session/SessionFeedback';
import SystemCheck from '../pages/systemcheck/SystemCheck';
import Dashboard from '../pages/dashboard';
import Questionary from '../pages/questions/Questionary';
import SessionStart from '../pages/session/SessionStart';
import SessionWithCompetence from '../pages/session/SessionWithCompetence';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/set-password" element={<SetPassword />} />
            <Route path="/accept-invite" element={<AcceptInvite />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/systemcheck" element={<SystemCheck />} />
                <Route path="/welcomeArea" element={<WelcomeArea />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pre-session-assessment/practice/:practice_id" element={<PreSessionAssessment />} />
                <Route path="/questionary/:practice_id" element={<Questionary />} />
                {/* <Route path="/productExpert" element={<ProductExpert />} /> */}
                <Route path="/questionaryFinalization" element={<QuestionaryFinalization />} />
                <Route path="/session-start/:practice_id" element={<SessionWithCompetence />} />
                <Route path="/sessionStart/:practice_id" element={<SessionStart />} />
                <Route path="/practiceSession/:practice_id/competency/:context_id" element={<PracticeSession />} />
                <Route path="/session-feedback/:practice_id/session/:session_id" element={<SessionFeedback />} />
                <Route path="/session-summary/:practice_id/session/:session_id" element={<SectionSummary />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
