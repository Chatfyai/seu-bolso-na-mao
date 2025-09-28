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
        const currentPath = window.location.pathname;
        
        // If onboarding is completed and this is an onboarding page
        if (redirectIfCompleted && profile.onboarding_completed) {
          navigate('/dashboard');
          return;
        }
        
        // If trying to access dashboard but onboarding is not complete
        if (currentPath === '/dashboard' && !profile.onboarding_completed) {
          // Redirect to the next pending onboarding step
          if (!profile.onboarding_account_type_completed) {
            navigate('/account-type');
          } else if (!profile.onboarding_setup_completed) {
            navigate('/setup');
          } else if (!profile.onboarding_charts_completed) {
            navigate('/chart-preference');
          }
          return;
        }

        // Prevent access to later onboarding steps if earlier ones aren't complete
        if (!redirectIfCompleted) {
          if (currentPath === '/setup' && !profile.onboarding_account_type_completed) {
            navigate('/account-type');
            return;
          }
          if (currentPath === '/chart-preference' && (!profile.onboarding_account_type_completed || !profile.onboarding_setup_completed)) {
            navigate(!profile.onboarding_account_type_completed ? '/account-type' : '/setup');
            return;
          }
        }
      }
    }
  }, [user, profile, loading, navigate, requireAuth, redirectIfCompleted]);

  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
};