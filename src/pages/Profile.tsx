import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Profile = () => {
  const { user, signOut } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccess('Пароль успешно изменен');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError('Ошибка при изменении пароля');
      console.error('Password change error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    try {
      const { error } = await supabase.auth.resendEmailVerification();
      if (error) throw error;
      setSuccess('Письмо для подтверждения отправлено');
    } catch (err) {
      setError('Ошибка при отправке письма');
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-2xl p-8">
            <h1 className="text-3xl font-bold mb-8">Профиль</h1>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-xl">
                <Mail className="text-red-500" size={24} />
                <div>
                  <p className="font-medium">{user.email}</p>
                  {!user.email_confirmed_at && (
                    <div className="mt-2">
                      <p className="text-yellow-500 text-sm mb-2">Email не подтвержден</p>
                      <button
                        onClick={resendVerificationEmail}
                        className="text-sm text-red-500 hover:text-red-400 transition-colors"
                      >
                        Отправить письмо повторно
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Изменить пароль</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Новый пароль</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="text-green-500 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {loading ? 'Сохранение...' : 'Сохранить'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;