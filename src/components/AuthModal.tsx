import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Gift } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  showGift?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, showGift }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        navigate('/program');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      {showGift ? (
        <div className="bg-gray-900 p-8 rounded-2xl max-w-md w-full mx-4 animate-fade-in">
          <div className="text-center">
            <Gift className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold mb-4">Поздравляем! 🎉</h2>
            <p className="text-gray-300 mb-6">
              Вы получили 100 токенов в подарок за регистрацию!
            </p>
            <button
              onClick={() => navigate('/program')}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full transition-colors"
            >
              Начать обучение
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 p-8 rounded-2xl max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full transition-colors"
            >
              Зарегистрироваться
            </button>
          </form>
        </div>
      )}
    </div>
  );
};