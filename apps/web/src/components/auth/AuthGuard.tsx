import React from 'react';
// @ts-ignore
import { useAuthStore } from '../../store/authStore';
// @ts-ignore
import { LoginPage } from './LoginPage';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();

  if (!token) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
