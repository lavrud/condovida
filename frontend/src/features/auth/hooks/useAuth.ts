import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth.store';
import { authService } from '../services/auth.service';

export function useAuth() {
  const navigate = useNavigate();
  const { login: storeLogin, logout: storeLogout, user, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      storeLogin(data.user, data.accessToken, data.refreshToken);
      navigate('/', { replace: true });
    },
  });

  const logout = () => {
    storeLogout();
    navigate('/login', { replace: true });
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
}
