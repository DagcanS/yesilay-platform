import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        setError(authError.message || 'Giriş başarısız');
      } else if (data.session) {
        localStorage.setItem('adminToken', data.session.access_token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Sunucuya bağlanılamadı');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-subtle)' }}>
      <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: 'var(--shadow-md)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--isbank-blue)' }}>Yönetici Girişi</h2>
        
        {error && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '6px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>E-posta Adresi</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            required
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Şifre</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
          GİRİŞ YAP
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
