import { useApp } from '@/context/AppContext';
import { CandidateDashboard } from '@/components/dashboard/CandidateDashboard';
import { AlumniDashboard } from '@/components/dashboard/AlumniDashboard';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div className="container-page py-8">
      {currentUser?.activeRole === 'candidate' ? (
        <CandidateDashboard />
      ) : (
        <AlumniDashboard />
      )}
    </div>
  );
}
