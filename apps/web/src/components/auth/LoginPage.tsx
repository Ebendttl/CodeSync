import React, { useState } from 'react';
// @ts-ignore
import { useAuthStore } from '../../store/authStore';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin ? { email, password } : { email, username, password };
      
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (isLogin) {
        setAuth(data.token, data.user.id, data.user.username, data.user.avatarColor || '#00d4ff');
      } else {
        // After successful register, switch to login or auto-login
        // We will auto-login the user directly if the backend returns a user object
        // Actually, the register endpoint returns { user }, we need to login to get the token
        // Let's just switch to login mode for simplicity
        setIsLogin(true);
        setError('Account created! Please log in.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-base)' }}>
      <form onSubmit={handleSubmit} style={{ background: 'var(--bg-surface)', padding: 32, borderRadius: 'var(--radius-md)', width: 400 }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: 24, fontFamily: 'var(--font-ui)' }}>
          {isLogin ? 'Welcome to CodeSync' : 'Create an Account'}
        </h2>
        
        {error && <div style={{ color: error.includes('created') ? '#00e676' : '#ff5252', marginBottom: 16, fontSize: '0.9rem' }}>{error}</div>}

        {!isLogin && (
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Username" 
            required
            style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--bg-elevated)', color: 'var(--text-primary)', outline: 'none' }}
          />
        )}
        
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--bg-elevated)', color: 'var(--text-primary)', outline: 'none' }}
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          style={{ width: '100%', marginBottom: 24, padding: 12, borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--bg-elevated)', color: 'var(--text-primary)', outline: 'none' }}
        />
        <button disabled={isLoading} type="submit" style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-sm)', border: 'none', background: isLoading ? 'var(--bg-elevated)' : 'var(--accent-primary)', color: 'var(--bg-base)', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', marginBottom: 16 }}>
          {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: 'var(--accent-primary)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </div>
      </form>
    </div>
  );
}
