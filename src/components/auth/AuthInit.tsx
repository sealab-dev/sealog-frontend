import { useEffect } from 'react';
import { authApi } from '../../services/auth/auth.api';
import { useAuthStore } from '../../store/authStore';

export default function AuthInit() {
  const setUser = useAuthStore((s) => s.setUser);
  const setAuthReady = useAuthStore((s) => s.setAuthReady);

  useEffect(() => {
    if (!localStorage.getItem('hasSession')) return;

    authApi.me()
      .then((res) => setUser(res))
      .catch(() => {
        // 401 → 인터셉터가 refresh 시도, 실패 시 logout 처리
        setAuthReady();
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
