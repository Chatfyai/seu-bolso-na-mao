import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/pages/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectIfCompleted?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true,
  redirectIfCompleted = false
}: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      // If authentication is required and user is not authenticated
      if (requireAuth && !user) {
        navigate('/login');
        return;
      }

      // If user is authenticated
      if (user && profile) {
        // If onboarding is completed and this is an onboarding page
        if (redirectIfCompleted && profile.onboarding_completed) {
          navigate('/dashboard');
          return;
        }
        
        // If onboarding is not completed and trying to access dashboard
        if (!redirectIfCompleted && !profile.onboarding_completed && window.location.pathname === '/dashboard') {
          navigate('/account-type');
          return;
        }
      }
    }
  }, [user, profile, loading, navigate, requireAuth, redirectIfCompleted]);

  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
};